"""Generate native SVG + editable Draw.io XML from a language-neutral UML JSON model.

Python 3.10+, standard library only. No source-code parsing or automatic graph layout.
Run with --help. All output paths are explicit; existing files require --force.
"""

import argparse
import json
import math
import re
import unicodedata
import xml.etree.ElementTree as ET
from itertools import pairwise
from pathlib import Path

SVG = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG)
KINDS = {
    "association",
    "aggregation",
    "composition",
    "generalization",
    "realization",
    "dependency",
}
CLASS_KINDS = {"class", "abstract", "interface", "struct", "enumeration"}
SIDES = {"left": (0, 0.5), "right": (1, 0.5), "top": (0.5, 0), "bottom": (0.5, 1)}
PALETTE = {
    "bg": "#f8fafc",
    "box": "#ffffff",
    "header": "#edf2f6",
    "ink": "#263244",
    "line": "#526176",
}
FONT = "Consolas, 'DejaVu Sans Mono', monospace"
SIZE, ROW, HEADER, PAD = 16, 24, 64, 16


def number(value, name, minimum=0):
    if (
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        or value < minimum
    ):
        raise ValueError(f"{name}: expected finite number >= {minimum}")
    return value


def string(value, name):
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{name}: expected nonempty string")
    if any(ord(c) < 32 and c not in "\n\t\r" for c in value):
        raise ValueError(f"{name}: invalid XML control character")
    return value


def keys(obj, allowed, name):
    if not isinstance(obj, dict):
        raise TypeError(f"{name}: expected object")
    unknown = set(obj) - set(allowed)
    if unknown:
        raise ValueError(f"{name}: unknown fields {sorted(unknown)}")


def units(text):
    return sum(2 if unicodedata.east_asian_width(c) in "WF" else 1 for c in text)


def wrap(text, width):
    """Conservative monospace estimate; browser screenshot remains mandatory."""
    limit = max(1, int(width / (SIZE * 0.65)))
    result = []
    for paragraph in text.split("\n"):
        current, used = "", 0
        for char in paragraph:
            weight = 2 if unicodedata.east_asian_width(char) in "WF" else 1
            if used + weight > limit and current:
                result.append(current)
                current, used = "", 0
            current += char
            used += weight
        result.append(current)
    return result


def members(values, width):
    if not isinstance(values, list):
        raise TypeError("attributes/operations: expected array")
    rows = []
    for value in values:
        if isinstance(value, str):
            value = {"text": value}
        keys(value, {"text", "abstract", "static"}, "member")
        text = string(value.get("text"), "member.text")
        for flag in ("abstract", "static"):
            if flag in value and not isinstance(value[flag], bool):
                raise ValueError(f"member.{flag}: expected boolean")
        for row in wrap(text, width):
            rows.append(
                {
                    "text": row,
                    "abstract": value.get("abstract", False),
                    "static": value.get("static", False),
                }
            )
    return rows


def prepare(data):
    keys(data, {"title", "description", "classes", "relations", "notes"}, "model")
    string(data.get("title"), "title")
    if "description" in data:
        string(data["description"], "description")
    classes = data.get("classes")
    if not isinstance(classes, list) or not classes:
        raise ValueError("classes: expected nonempty array")
    nodes = {}
    for raw in classes:
        keys(
            raw,
            {
                "id",
                "name",
                "kind",
                "stereotype",
                "final",
                "x",
                "y",
                "width",
                "attributes",
                "operations",
            },
            "class",
        )
        ident = string(raw.get("id"), "class.id")
        if not re.fullmatch(r"[A-Za-z][A-Za-z0-9_-]*", ident) or ident in nodes:
            raise ValueError(f"invalid or duplicate class ID: {ident}")
        name = string(raw.get("name"), "class.name")
        kind = raw.get("kind", "class")
        if kind not in CLASS_KINDS:
            raise ValueError(f"unknown class kind: {kind}")
        if "final" in raw and not isinstance(raw["final"], bool):
            raise ValueError("class.final: expected boolean")
        width = number(raw.get("width", 360), "class.width", 160)
        attrs = members(raw.get("attributes", []), width - 2 * PAD)
        ops = members(raw.get("operations", []), width - 2 * PAD)
        stereotype = raw.get("stereotype", "")
        if stereotype:
            string(stereotype, "class.stereotype")
        label = " ".join(
            filter(
                None,
                [
                    f"«{kind}»"
                    if kind in {"interface", "struct", "enumeration"}
                    else "{abstract}"
                    if kind == "abstract"
                    else "",
                    stereotype,
                    "{leaf}" if raw.get("final") else "",
                ],
            )
        )
        if (
            units(name) * 22 * 0.65 > width - 2 * PAD
            or units(label) * 14 * 0.65 > width - 2 * PAD
        ):
            raise ValueError(
                f"{ident}: class header too long; increase width or abbreviate"
            )
        node = dict(
            raw,
            id=ident,
            name=name,
            kind=kind,
            x=number(raw.get("x"), "class.x"),
            y=number(raw.get("y"), "class.y"),
            width=width,
            attrs=attrs,
            ops=ops,
            label=label,
        )
        node["height"] = (
            HEADER
            + 2 * PAD
            + max(1, len(attrs)) * ROW
            + 2 * PAD
            + max(1, len(ops)) * ROW
        )
        node["divider"] = HEADER + 2 * PAD + max(1, len(attrs)) * ROW
        nodes[ident] = node
    for a in nodes.values():
        for b in nodes.values():
            if (
                a["id"] < b["id"]
                and a["x"] < b["x"] + b["width"]
                and b["x"] < a["x"] + a["width"]
                and a["y"] < b["y"] + b["height"]
                and b["y"] < a["y"] + a["height"]
            ):
                raise ValueError(f"overlapping class boxes: {a['id']} and {b['id']}")
        if a["y"] < 100:
            raise ValueError(f"{a['id']}: y must be >= 100 (title area)")
    relations = data.get("relations", [])
    if not isinstance(relations, list):
        raise TypeError("relations: expected array")
    edges = []
    for index, raw in enumerate(relations):
        keys(
            raw,
            {
                "source",
                "target",
                "kind",
                "source_anchor",
                "target_anchor",
                "waypoints",
                "labels",
            },
            "relation",
        )
        kind = raw.get("kind", "association")
        if kind not in KINDS:
            raise ValueError(f"unknown relation kind: {kind}")
        if raw.get("source") not in nodes or raw.get("target") not in nodes:
            raise ValueError("relation references missing class")
        source, target = nodes[raw["source"]], nodes[raw["target"]]
        sa = anchor(raw.get("source_anchor", "right"))
        ta = anchor(raw.get("target_anchor", "left"))
        waypoints = raw.get("waypoints", [])
        if not isinstance(waypoints, list):
            raise TypeError("waypoints: expected array")
        points = (
            [endpoint(source, sa)]
            + [point(p) for p in waypoints]
            + [endpoint(target, ta)]
        )
        if any(a == b for a, b in pairwise(points)):
            raise ValueError("zero-length edge segment; adjust anchors/waypoints")
        labels = raw.get("labels", [])
        if not isinstance(labels, list):
            raise TypeError("labels: expected array")
        for label in labels:
            keys(label, {"text", "x", "y"}, "label")
            string(label.get("text"), "label.text")
            if "\n" in label["text"]:
                raise ValueError("relation labels must be single-line")
            number(label.get("x"), "label.x")
            number(label.get("y"), "label.y")
        edges.append(
            dict(
                raw,
                id=f"edge-{index}",
                kind=kind,
                sa=sa,
                ta=ta,
                points=points,
                labels=labels,
            )
        )
    notes = data.get("notes", [])
    if not isinstance(notes, list) or any(not isinstance(n, str) for n in notes):
        raise ValueError("notes: expected string array")
    for note in notes:
        string(note, "note")
    return nodes, edges


def point(value):
    if not isinstance(value, list) or len(value) != 2:
        raise ValueError("point/anchor: expected [x, y]")
    return number(value[0], "point.x"), number(value[1], "point.y")


def anchor(value):
    if isinstance(value, str):
        if value not in SIDES:
            raise ValueError(f"unknown anchor: {value}")
        return SIDES[value]
    x, y = point(value)
    if x > 1 or y > 1 or not (x in (0, 1) or y in (0, 1)):
        raise ValueError("anchor must be on box perimeter, normalized to 0..1")
    return x, y


def endpoint(node, pin):
    return node["x"] + pin[0] * node["width"], node["y"] + pin[1] * node["height"]


def svg_element(parent, tag, **attrs):
    return ET.SubElement(
        parent,
        f"{{{SVG}}}{tag}",
        {k.replace("_", "-"): str(v) for k, v in attrs.items()},
    )


def mx_cell(parent, ident, value, style, geometry, container="1", **attrs):
    cell = ET.SubElement(
        parent,
        "mxCell",
        {"id": ident, "value": value, "style": style, "parent": container, **attrs},
    )
    ET.SubElement(
        cell,
        "mxGeometry",
        {**{k: str(v) for k, v in geometry.items()}, "as": "geometry"},
    )
    return cell


def generate(data):
    nodes, edges = prepare(data)
    width = max(
        800,
        max(n["x"] + n["width"] for n in nodes.values()) + 40,
        units(data["title"]) * 20 + 80,
    )
    bottom = max(n["y"] + n["height"] for n in nodes.values())
    for edge in edges:
        for x, y in edge["points"]:
            width, bottom = max(width, x + 40), max(bottom, y + 40)
        for label in edge["labels"]:
            width = max(width, label["x"] + units(label["text"]) * SIZE * 0.65 + 40)
            bottom = max(bottom, label["y"] + ROW)
    note_rows = [
        row for note in data.get("notes", []) for row in wrap(note, width - 80)
    ]
    note_y = bottom + 48
    height = math.ceil(note_y + len(note_rows) * ROW + 40)
    width = math.ceil(width)
    mxfile = ET.Element("mxfile", host="app.diagrams.net")
    diagram = ET.SubElement(mxfile, "diagram", id="class-diagram", name=data["title"])
    model = ET.SubElement(
        diagram,
        "mxGraphModel",
        page="1",
        pageWidth=str(width),
        pageHeight=str(height),
        grid="1",
        gridSize="10",
        background=PALETTE["bg"],
    )
    mxroot = ET.SubElement(model, "root")
    ET.SubElement(mxroot, "mxCell", id="0")
    ET.SubElement(mxroot, "mxCell", {"id": "1", "parent": "0"})
    svg = ET.Element(
        f"{{{SVG}}}svg",
        {
            "width": str(width),
            "height": str(height),
            "viewBox": f"0 0 {width} {height}",
            "role": "img",
            "aria-labelledby": "title desc",
        },
    )
    svg_element(svg, "title", id="title").text = data["title"]
    svg_element(svg, "desc", id="desc").text = data.get(
        "description", "UML class diagram with embedded editable Draw.io data."
    )
    defs = svg_element(svg, "defs")
    for ident, path, fill, ref, orient in [
        ("triangle", "M 1 1 L 15 7 L 1 13 Z", PALETTE["box"], 15, "auto"),
        ("open", "M 1 1 L 11 7 L 1 13", "none", 11, "auto"),
        (
            "diamond",
            "M 1 7 L 9 1 L 17 7 L 9 13 Z",
            PALETTE["line"],
            17,
            "auto-start-reverse",
        ),
        (
            "hollow-diamond",
            "M 1 7 L 9 1 L 17 7 L 9 13 Z",
            PALETTE["box"],
            17,
            "auto-start-reverse",
        ),
    ]:
        marker = svg_element(
            defs,
            "marker",
            id=ident,
            markerWidth=19,
            markerHeight=14,
            refX=ref,
            refY=7,
            orient=orient,
            markerUnits="userSpaceOnUse",
        )
        svg_element(
            marker, "path", d=path, fill=fill, stroke=PALETTE["line"], stroke_width=1.5
        )
    svg_element(svg, "rect", x=0, y=0, width=width, height=height, fill=PALETTE["bg"])
    edge_layer = svg_element(svg, "g", id="edges")
    node_layer = svg_element(svg, "g", id="classes")
    text_layer = svg_element(svg, "g", id="annotations")

    def text(
        parent,
        ident,
        value,
        x,
        baseline,
        w,
        size=SIZE,
        bold=False,
        italic=False,
        static=False,
        container="1",
        local=None,
        center=False,
    ):
        svg_element(
            parent,
            "text",
            x=x,
            y=baseline,
            font_family=FONT,
            font_size=size,
            font_weight=700 if bold else 400,
            font_style="italic" if italic else "normal",
            text_decoration="underline" if static else "none",
            fill=PALETTE["ink"],
            text_anchor="middle" if center else "start",
        ).text = value
        lx, ly = local if local else (x - w / 2 if center else x, baseline - size)
        mx_cell(
            mxroot,
            ident,
            value,
            f"text;html=0;strokeColor=none;fillColor=none;align={'center' if center else 'left'};verticalAlign=top;whiteSpace=nowrap;overflow=visible;spacing=0;fontFamily=Consolas;fontSize={size};fontColor={PALETTE['ink']};fontStyle={int(bold) + 2 * int(italic) + 4 * int(static)};",
            {"x": lx, "y": ly, "width": w, "height": size + 8},
            container,
            vertex="1",
        )

    text(
        text_layer,
        "diagram-title",
        data["title"],
        40,
        52,
        width - 80,
        size=28,
        bold=True,
    )
    for node in nodes.values():
        ident = f"class-{node['id']}"
        x, y, w, h = (node[k] for k in ("x", "y", "width", "height"))
        group = svg_element(node_layer, "g", id=ident)
        svg_element(
            group,
            "rect",
            x=x,
            y=y,
            width=w,
            height=h,
            fill=PALETTE["box"],
            stroke=PALETTE["line"],
            stroke_width=1.5,
        )
        svg_element(
            group,
            "rect",
            x=x,
            y=y,
            width=w,
            height=HEADER,
            fill=PALETTE["header"],
            stroke=PALETTE["line"],
            stroke_width=1.5,
        )
        # Native parent vertex: children use local coordinates and move as one class.
        mx_cell(
            mxroot,
            ident,
            "",
            f"rounded=0;container=1;collapsible=0;recursiveResize=0;fillColor={PALETTE['box']};strokeColor={PALETTE['line']};",
            {"x": x, "y": y, "width": w, "height": h},
            vertex="1",
        )
        mx_cell(
            mxroot,
            ident + "-header",
            "",
            f"rounded=0;fillColor={PALETTE['header']};strokeColor={PALETTE['line']};",
            {"x": 0, "y": 0, "width": w, "height": HEADER},
            ident,
            vertex="1",
        )
        text(
            group,
            ident + "-stereotype",
            node["label"],
            x + w / 2,
            y + 22,
            w,
            size=14,
            container=ident,
            local=(0, 8),
            center=True,
        )
        text(
            group,
            ident + "-name",
            node["name"],
            x + w / 2,
            y + 49,
            w,
            size=22,
            bold=True,
            italic=node["kind"] == "abstract",
            container=ident,
            local=(0, 27),
            center=True,
        )
        for section, start in [
            ("attrs", HEADER + PAD + SIZE),
            ("ops", node["divider"] + PAD + SIZE),
        ]:
            for index, row in enumerate(node[section]):
                dy = start + index * ROW
                text(
                    group,
                    f"{ident}-{section}-{index}",
                    row["text"],
                    x + PAD,
                    y + dy,
                    w - 2 * PAD,
                    italic=row["abstract"],
                    static=row["static"],
                    container=ident,
                    local=(PAD, dy - SIZE),
                )
        divider = node["divider"]
        svg_element(
            group,
            "path",
            d=f"M {x} {y + divider} L {x + w} {y + divider}",
            fill="none",
            stroke=PALETTE["line"],
        )
        mx_cell(
            mxroot,
            ident + "-divider",
            "",
            f"rounded=0;fillColor={PALETTE['line']};strokeColor=none;",
            {"x": 0, "y": divider, "width": w, "height": 1},
            ident,
            vertex="1",
        )
    for edge in edges:
        kind = edge["kind"]
        dashed = kind in {"dependency", "realization"}
        end = (
            "triangle"
            if kind in {"generalization", "realization"}
            else "open"
            if kind == "dependency"
            else None
        )
        start = (
            "diamond"
            if kind == "composition"
            else "hollow-diamond"
            if kind == "aggregation"
            else None
        )
        attrs = {
            "d": "M " + " L ".join(f"{x} {y}" for x, y in edge["points"]),
            "fill": "none",
            "stroke": PALETTE["line"],
            "stroke_width": 1.8,
        }
        if dashed:
            attrs["stroke_dasharray"] = "7 5"
        if end:
            attrs["marker_end"] = f"url(#{end})"
        if start:
            attrs["marker_start"] = f"url(#{start})"
        svg_element(edge_layer, "path", **attrs)
        sx, sy = edge["sa"]
        tx, ty = edge["ta"]
        style = f"edgeStyle=none;rounded=0;html=0;strokeColor={PALETTE['line']};strokeWidth=1.8;dashed={int(dashed)};endArrow={'block' if end == 'triangle' else 'open' if end else 'none'};endFill=0;startArrow={'diamond' if start else 'none'};startFill={int(kind == 'composition')};exitX={sx};exitY={sy};exitPerimeter=0;entryX={tx};entryY={ty};entryPerimeter=0;"
        cell = mx_cell(
            mxroot,
            edge["id"],
            "",
            style,
            {"relative": 1},
            edge="1",
            source=f"class-{edge['source']}",
            target=f"class-{edge['target']}",
        )
        geom = cell.find("mxGeometry")
        assert geom is not None
        if len(edge["points"]) > 2:
            array = ET.SubElement(geom, "Array", {"as": "points"})
            for x, y in edge["points"][1:-1]:
                ET.SubElement(array, "mxPoint", x=str(x), y=str(y))
        # Labels are relative edge children: move with the edge in Draw.io.
        a, b = edge["points"][0], edge["points"][-1]
        for i, label in enumerate(edge["labels"]):
            lw = units(label["text"]) * SIZE * 0.65 + 8
            text(
                text_layer,
                f"{edge['id']}-label-{i}",
                label["text"],
                label["x"],
                label["y"],
                lw,
            )
            label_cell = mxroot[-1]
            label_cell.set("parent", edge["id"])
            label_cell.set("connectable", "0")
            lg = label_cell.find("mxGeometry")
            assert lg is not None
            lg.attrib.update({"relative": "1", "x": "0", "y": "0"})
            # mxGraph x=0 is the arc-length midpoint, not the endpoint average.
            lengths = [
                math.dist(p, q)
                for p, q in zip(edge["points"], edge["points"][1:], strict=False)
            ]
            remaining = sum(lengths) / 2
            midpoint = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
            for p, q, length in zip(
                edge["points"], edge["points"][1:], lengths, strict=False
            ):
                if remaining <= length:
                    ratio = remaining / length
                    midpoint = (
                        p[0] + ratio * (q[0] - p[0]),
                        p[1] + ratio * (q[1] - p[1]),
                    )
                    break
                remaining -= length
            ET.SubElement(
                lg,
                "mxPoint",
                {
                    "x": str(label["x"] - midpoint[0]),
                    "y": str(label["y"] - SIZE - midpoint[1]),
                    "as": "offset",
                },
            )
    for i, note in enumerate(note_rows):
        text(text_layer, f"note-{i}", note, 40, note_y + i * ROW, width - 80)
    svg.set("content", ET.tostring(mxfile, encoding="unicode"))
    return svg, mxfile


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("model", type=Path, help="UTF-8 JSON model")
    parser.add_argument(
        "--output", required=True, type=Path, help="Editable .drawio.svg"
    )
    parser.add_argument("--drawio", type=Path, help="Optional standalone .drawio model")
    parser.add_argument(
        "--force", action="store_true", help="Allow overwriting outputs"
    )
    args = parser.parse_args()
    try:
        if not str(args.output).endswith(".drawio.svg"):
            raise ValueError("--output must end in .drawio.svg")
        if args.drawio and args.drawio.suffix != ".drawio":
            raise ValueError("--drawio must end in .drawio")
        outputs = [args.output] + ([args.drawio] if args.drawio else [])
        if args.model.resolve() in [p.resolve() for p in outputs]:
            raise ValueError("output cannot overwrite input")
        for path in outputs:
            if path.exists() and not args.force:
                raise ValueError(f"output exists: {path}; use --force deliberately")
        data = json.loads(args.model.read_text(encoding="utf-8-sig"))
        svg, mxfile = generate(data)
        for path, tree in [(args.output, svg)] + (
            [(args.drawio, mxfile)] if args.drawio else []
        ):
            path.parent.mkdir(parents=True, exist_ok=True)
            ET.indent(tree)
            ET.ElementTree(tree).write(path, encoding="utf-8", xml_declaration=True)
            print(f"Wrote {path}")
    except (ValueError, TypeError, KeyError, OSError) as error:
        parser.exit(1, f"Error: {error}\n")


if __name__ == "__main__":
    main()
