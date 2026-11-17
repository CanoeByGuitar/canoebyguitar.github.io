"""Generate a synchronous swimlane call execution flow (not strict UML sequence).

Python 3.10+, standard library. Events are ordered; nesting is checked with a stack.
"""

import argparse
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

from generate_class_diagram import SVG, keys, mx_cell, string, svg_element, wrap

LANE, GAP, LEFT, TOP, BOX = 320, 150, 40, 150, 272
INK, LINE, BG = "#263244", "#526176", "#f8fafc"


def prepare(data):
    keys(data, {"title", "lanes", "entry", "events", "notes"}, "model")
    string(data.get("title"), "title")
    lanes = data.get("lanes")
    if not isinstance(lanes, list) or not lanes:
        raise ValueError("lanes must be a nonempty array")
    lookup = {}
    for lane in lanes:
        keys(lane, {"id", "name"}, "lane")
        ident = string(lane.get("id"), "lane.id")
        if not re.fullmatch(r"[A-Za-z][A-Za-z0-9_-]*", ident) or ident in lookup:
            raise ValueError("invalid or duplicate lane ID")
        name = string(lane.get("name"), "lane.name")
        if len(wrap(name, LANE - 32)) > 1:
            raise ValueError("lane name too long; abbreviate")
        lookup[ident] = len(lookup)
    entry = data.get("entry")
    if entry not in lookup:
        raise ValueError("entry references missing lane")
    events = data.get("events")
    if not isinstance(events, list) or not events:
        raise ValueError("events must be nonempty")
    stack, current, rows = [], entry, []
    for event in events:
        keys(event, {"kind", "text", "target", "resume"}, "event")
        kind = event.get("kind")
        text = string(event.get("text"), "event.text")
        source = current
        if kind == "step":
            if "target" in event or "resume" in event:
                raise ValueError("step cannot have target/resume")
        elif kind == "call":
            target = event.get("target")
            if target not in lookup or target == current:
                raise ValueError("call target must be another existing lane")
            if "resume" in event:
                raise ValueError("call cannot have resume")
            stack.append(current)
            current = target
        elif kind == "return":
            if not stack:
                raise ValueError("return without matching call")
            caller = stack.pop()
            if event.get("target", caller) != caller:
                raise ValueError("return must resume the most recent caller")
            current = caller
            string(event.get("resume", "Resume caller"), "event.resume")
        else:
            raise ValueError("event kind must be step/call/return")
        texts = (
            [text]
            if kind == "step"
            else (
                ["Call", text]
                if kind == "call"
                else [text, event.get("resume", "Resume caller")]
            )
        )
        height = max(len(wrap(t, BOX - 32)) for t in texts) * 24 + 24
        rows.append(
            dict(event, source=source, dest=current, texts=texts, height=height)
        )
    if stack:
        raise ValueError("unfinished calls: add returns (partial traces not supported)")
    notes = data.get("notes", [])
    if not isinstance(notes, list):
        raise TypeError("notes must be an array")
    for note in notes:
        string(note, "note")
    return lanes, lookup, rows


def generate(data):
    lanes, lookup, rows = prepare(data)
    width = LEFT * 2 + len(lanes) * LANE + (len(lanes) - 1) * GAP
    lane_height = sum(row["height"] + 64 for row in rows) + 80
    notes = [line for note in data.get("notes", []) for line in wrap(note, width - 80)]
    height = TOP + lane_height + 64 + len(notes) * 24
    mxfile = ET.Element("mxfile", host="app.diagrams.net")
    diagram = ET.SubElement(mxfile, "diagram", id="call-flow", name=data["title"])
    model = ET.SubElement(
        diagram,
        "mxGraphModel",
        page="1",
        pageWidth=str(width),
        pageHeight=str(height),
        background=BG,
    )
    root = ET.SubElement(model, "root")
    ET.SubElement(root, "mxCell", id="0")
    ET.SubElement(root, "mxCell", {"id": "1", "parent": "0"})
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
    svg_element(
        svg, "desc", id="desc"
    ).text = "Synchronous call flow: solid downward execution arrows, dashed cross-lane calls and stack-matched returns."
    defs = svg_element(svg, "defs")
    marker = svg_element(
        defs,
        "marker",
        id="arrow",
        markerWidth=12,
        markerHeight=12,
        refX=11,
        refY=6,
        orient="auto",
        markerUnits="userSpaceOnUse",
    )
    svg_element(marker, "path", d="M 1 1 L 11 6 L 1 11 Z", fill=LINE, stroke=LINE)
    svg_element(svg, "rect", x=0, y=0, width=width, height=height, fill=BG)
    background = svg_element(svg, "g", id="lanes")
    edges = svg_element(svg, "g", id="edges")
    boxes = svg_element(svg, "g", id="steps")
    annotations = svg_element(svg, "g", id="annotations")

    def text(parent, value, x, y, size=16, bold=False):
        svg_element(
            parent,
            "text",
            x=x,
            y=y,
            font_family="Consolas, 'DejaVu Sans Mono', monospace",
            font_size=size,
            font_weight=700 if bold else 400,
            fill=INK,
        ).text = value

    text(annotations, data["title"], LEFT, 48, 28, True)
    text(
        annotations,
        "Time flows down | solid: execution | dashed: call / return",
        LEFT,
        82,
    )
    mx_cell(
        root,
        "title",
        data["title"],
        "text;html=0;align=left;fontSize=28;fontStyle=1;",
        {"x": LEFT, "y": 20, "width": width - 80, "height": 40},
        vertex="1",
    )
    mx_cell(
        root,
        "legend",
        "Time flows down | solid: execution | dashed: call / return",
        "text;html=0;align=left;fontSize=16;",
        {"x": LEFT, "y": 64, "width": width - 80, "height": 28},
        vertex="1",
    )
    for index, lane in enumerate(lanes):
        x = LEFT + index * (LANE + GAP)
        svg_element(
            background,
            "rect",
            x=x,
            y=TOP - 40,
            width=LANE,
            height=lane_height + 40,
            fill="#ffffff",
            stroke="#c6d0dc",
        )
        svg_element(
            background,
            "rect",
            x=x,
            y=TOP - 40,
            width=LANE,
            height=40,
            fill="#edf2f6",
            stroke="#c6d0dc",
        )
        text(background, lane["name"], x + 16, TOP - 14, 18, True)
        mx_cell(
            root,
            "lane-" + lane["id"],
            lane["name"],
            "swimlane;html=0;startSize=40;horizontal=1;collapsible=0;container=1;recursiveResize=0;fontSize=18;fontStyle=1;fillColor=#edf2f6;swimlaneFillColor=#ffffff;strokeColor=#c6d0dc;",
            {"x": x, "y": TOP - 40, "width": LANE, "height": lane_height + 40},
            vertex="1",
        )
    last, y, edge_index = None, TOP + 24, 0

    def node(lane, value, ident, h):
        x = LEFT + lookup[lane] * (LANE + GAP) + (LANE - BOX) / 2
        svg_element(
            boxes,
            "rect",
            x=x,
            y=y,
            width=BOX,
            height=h,
            fill="#edf2f6",
            stroke=LINE,
            stroke_width=1.4,
        )
        for i, row in enumerate(wrap(value, BOX - 32)):
            text(boxes, row, x + 16, y + 28 + i * 24)
        mx_cell(
            root,
            ident,
            "\n".join(wrap(value, BOX - 32)),
            f"rounded=0;html=0;whiteSpace=wrap;align=left;spacingLeft=16;fontFamily=Consolas;fontSize=16;fontColor={INK};fillColor=#edf2f6;strokeColor={LINE};",
            {"x": (LANE - BOX) / 2, "y": y - (TOP - 40), "width": BOX, "height": h},
            "lane-" + lane,
            vertex="1",
        )
        return ident, x, y, h

    def edge(a, b, cross=False, label=""):
        nonlocal edge_index
        ident = "edge-" + str(edge_index)
        edge_index += 1
        if cross:
            right = b[1] > a[1]
            sx, tx = (1, 0) if right else (0, 1)
            p = (a[1] + sx * BOX, a[2] + a[3] / 2)
            q = (b[1] + tx * BOX, b[2] + b[3] / 2)
            sy = ty = 0.5
        else:
            sx = tx = 0.5
            sy, ty = 1, 0
            p = (a[1] + BOX / 2, a[2] + a[3])
            q = (b[1] + BOX / 2, b[2])
        attrs = {
            "d": f"M {p[0]} {p[1]} L {q[0]} {q[1]}",
            "fill": "none",
            "stroke": LINE,
            "stroke_width": 1.8,
            "marker_end": "url(#arrow)",
        }
        if cross:
            attrs["stroke_dasharray"] = "7 5"
        svg_element(edges, "path", **attrs)
        mx_cell(
            root,
            ident,
            label,
            f"edgeStyle=none;html=0;rounded=0;endArrow=block;endFill=1;strokeColor={LINE};strokeWidth=1.8;dashed={int(cross)};fontSize=14;labelBackgroundColor={BG};exitX={sx};exitY={sy};exitPerimeter=0;entryX={tx};entryY={ty};entryPerimeter=0;",
            {"relative": 1},
            edge="1",
            source=a[0],
            target=b[0],
        )
        if label:
            text(annotations, label, (p[0] + q[0]) / 2 - 28, p[1] - 10, 14)

    for index, row in enumerate(rows):
        source = node(
            row["source"], row["texts"][0], f"step-{index}-source", row["height"]
        )
        if last:
            edge(last, source)
        if row["kind"] == "step":
            last = source
        else:
            dest = node(
                row["dest"], row["texts"][1], f"step-{index}-dest", row["height"]
            )
            edge(source, dest, True, row["kind"])
            last = dest
        y += row["height"] + 64
    for index, note in enumerate(notes):
        ny = TOP + lane_height + 40 + index * 24
        text(annotations, note, LEFT, ny)
        mx_cell(
            root,
            f"note-{index}",
            note,
            "text;html=0;align=left;fontSize=16;",
            {"x": LEFT, "y": ny - 18, "width": width - 80, "height": 28},
            vertex="1",
        )
    svg.set("content", ET.tostring(mxfile, encoding="unicode"))
    return svg, mxfile


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("model", type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--drawio", type=Path)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    try:
        if not str(args.output).endswith(".drawio.svg"):
            raise ValueError("output must end in .drawio.svg")
        if args.drawio and args.drawio.suffix != ".drawio":
            raise ValueError("--drawio must end in .drawio")
        paths = [args.output] + ([args.drawio] if args.drawio else [])
        for path in paths:
            if path.resolve() == args.model.resolve() or (
                path.exists() and not args.force
            ):
                raise ValueError(
                    "input/output collision or existing output; use --force only for intended overwrites"
                )
        svg, mxfile = generate(json.loads(args.model.read_text(encoding="utf-8-sig")))
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
