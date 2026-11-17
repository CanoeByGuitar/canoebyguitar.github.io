"""Validate this skill's SVG subset and embedded Draw.io references, not all SVG."""

import argparse
import math
import re
import xml.etree.ElementTree as ET
from pathlib import Path

from defusedxml import ElementTree as SafeET
from defusedxml.common import DefusedXmlException

SVG = "http://www.w3.org/2000/svg"


def validate(path):
    root = SafeET.parse(path).getroot()
    if root is None:
        raise ValueError("empty XML document")
    if root.tag != f"{{{SVG}}}svg":
        raise ValueError("not an SVG root")
    box = [float(n) for n in root.attrib["viewBox"].split()]
    if len(box) != 4 or not all(math.isfinite(n) for n in box) or min(box[2:]) <= 0:
        raise ValueError("invalid viewBox")
    ids = [e.attrib["id"] for e in root.iter() if "id" in e.attrib]
    if len(ids) != len(set(ids)):
        raise ValueError("duplicate SVG IDs")
    paths = 0
    for element in root.iter():
        for key, value in element.attrib.items():
            if key == "content":
                continue
            for ref in re.findall(r"url\(#([^)]+)\)", value):
                if ref not in ids:
                    raise ValueError(f"missing SVG reference: {ref}")
        if element.tag == f"{{{SVG}}}path":
            paths += 1
            data = element.attrib["d"]
            # Generated paths deliberately contain only explicit absolute M/L/Z.
            if re.sub(r"[MLZ]|-?\d+(?:\.\d+)?|[\s,]", "", data):
                raise ValueError("path outside supported M/L/Z subset")
            tokens = re.findall(r"[MLZ]|-?\d+(?:\.\d+)?", data)
            if not tokens or tokens[0] != "M":
                raise ValueError("path must start with M")
            i = 0
            while i < len(tokens):
                cmd = tokens[i]
                if cmd not in ("M", "L", "Z"):
                    raise ValueError("expected path command")
                i += 1
                if cmd != "Z":
                    if i + 1 >= len(tokens):
                        raise ValueError("missing path coordinates")
                    float(tokens[i])
                    float(tokens[i + 1])
                    i += 2
    mxfile = SafeET.fromstring(root.attrib["content"])
    if mxfile.tag != "mxfile":
        raise ValueError("embedded content is not mxfile")
    cells = mxfile.findall(".//mxCell")
    cell_ids = [c.attrib["id"] for c in cells]
    if len(cell_ids) != len(set(cell_ids)) or not {"0", "1"}.issubset(cell_ids):
        raise ValueError("invalid Draw.io IDs")
    lookup = {c.attrib["id"]: c for c in cells}
    for cell in cells:
        for attr in ("parent", "source", "target"):
            if attr in cell.attrib and cell.attrib[attr] not in lookup:
                raise ValueError(f"missing Draw.io {attr}: {cell.attrib[attr]}")
        if cell.attrib.get("edge") == "1":
            if not {"source", "target"}.issubset(cell.attrib):
                raise ValueError("edge is not attached to vertices")
            for attr in ("source", "target"):
                if lookup[cell.attrib[attr]].attrib.get("vertex") != "1":
                    raise ValueError("edge endpoint is not a vertex")
        seen = set()
        current = cell
        while "parent" in current.attrib:
            if current.attrib["id"] in seen:
                raise ValueError("cyclic Draw.io parent hierarchy")
            seen.add(current.attrib["id"])
            current = lookup[current.attrib["parent"]]
    print(
        f"PASS: XML, viewBox, IDs, marker references, {paths} M/L/Z paths, {len(cells)} Draw.io cells and attached edges"
    )
    print(
        "Not checked: full SVG conformance, UML semantics, visual layout, Draw.io GUI round-trip."
    )
    return root, mxfile


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("svg", type=Path)
    args = parser.parse_args()
    try:
        validate(args.svg)
    except (ValueError, KeyError, OSError, ET.ParseError, DefusedXmlException) as error:
        parser.exit(1, f"FAIL: {error}\n")


if __name__ == "__main__":
    main()
