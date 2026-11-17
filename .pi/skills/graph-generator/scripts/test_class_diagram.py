"""Regression tests; run directly with Python, no test framework required."""

import copy
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from defusedxml import ElementTree as SafeET
from defusedxml.common import DefusedXmlException
from generate_class_diagram import generate, prepare
from validate_svg import validate

HERE = Path(__file__).resolve().parent


class ClassDiagramTests(unittest.TestCase):
    def setUp(self):
        self.data = json.loads(
            (HERE.parent / "examples/class-diagram.json").read_text(encoding="utf-8")
        )

    def test_generate_and_references(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "diagram.drawio.svg"
            model = Path(directory) / "model.json"
            drawio = Path(directory) / "diagram.drawio"
            model.write_text(json.dumps(self.data), encoding="utf-8")
            result = subprocess.run(
                [
                    sys.executable,
                    str(HERE / "generate_class_diagram.py"),
                    str(model),
                    "--output",
                    str(output),
                    "--drawio",
                    str(drawio),
                ],
                check=False,
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            svg, mxfile = validate(output)
            standalone = SafeET.parse(drawio).getroot()
            assert standalone is not None
            # Whitespace from pretty-printing is not diagram model content.
            embedded_elements = [(e.tag, e.attrib) for e in mxfile.iter()]
            standalone_elements = [(e.tag, e.attrib) for e in standalone.iter()]
            self.assertEqual(embedded_elements, standalone_elements)
            cells = mxfile.findall(".//mxCell")
            edges = [c for c in cells if c.attrib.get("edge") == "1"]
            self.assertEqual(len(edges), 6)
            self.assertTrue(all(c.attrib["source"].startswith("class-") for c in edges))
            self.assertTrue(
                any(c.attrib.get("parent") == "class-document" for c in cells)
            )
            self.assertTrue(
                any(c.attrib.get("parent", "").startswith("edge-") for c in cells)
            )
            self.assertIn("content", svg.attrib)
            second = subprocess.run(
                [
                    sys.executable,
                    str(HERE / "generate_class_diagram.py"),
                    str(model),
                    "--output",
                    str(output),
                ],
                check=False,
                capture_output=True,
                text=True,
            )
            self.assertNotEqual(second.returncode, 0)
            self.assertIn("output exists", second.stderr)

    def test_reject_bad_models(self):
        changes = [
            lambda d: d["classes"].append(copy.deepcopy(d["classes"][0])),
            lambda d: d["relations"][0].update(target="missing"),
            lambda d: d["relations"][0].update(kind="made-up"),
            lambda d: d["classes"][0].update(x=float("nan")),
            lambda d: d["classes"][0].update(height=200),
            lambda d: d["classes"][1].update(x=480, y=120),
            lambda d: d["relations"][0].update(source_anchor=[0.5, 0.5]),
            lambda d: d["classes"][0].update(name="x" * 200),
            lambda d: d["relations"][0].update(
                labels=[{"text": "a\nb", "x": 0, "y": 0}]
            ),
        ]
        for change in changes:
            data = copy.deepcopy(self.data)
            change(data)
            with self.subTest(change=change), self.assertRaises(ValueError):
                prepare(data)

    def test_long_unicode_and_xml_escape(self):
        data = {
            "title": "图形 <测试> & UML",
            "classes": [
                {
                    "id": "sample",
                    "name": "示例类型",
                    "x": 40,
                    "y": 120,
                    "width": 240,
                    "attributes": ["- values: map<string, vector<T>> & 中文说明" * 3],
                    "operations": [
                        {"text": "+ create(): 示例类型", "static": True},
                        {"text": "+ work(): void", "abstract": True},
                    ],
                }
            ],
        }
        svg, mxfile = generate(data)
        nodes, _ = prepare(data)
        node = nodes["sample"]
        self.assertGreater(len(node["attrs"]), 3)
        self.assertGreater(node["height"], 250)
        # Round-trip the actual serialized XML through a safe parser.
        import xml.etree.ElementTree as ET

        parsed = SafeET.fromstring(ET.tostring(svg))
        self.assertEqual(SafeET.fromstring(parsed.attrib["content"]).tag, "mxfile")
        styles = [c.attrib.get("style", "") for c in mxfile.findall(".//mxCell")]
        self.assertTrue(any("fontStyle=4" in s for s in styles))
        self.assertTrue(any("fontStyle=2" in s for s in styles))

    def test_malicious_xml_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "attack.svg"
            path.write_text(
                '<!DOCTYPE svg [<!ENTITY attack "payload">]><svg>&attack;</svg>',
                encoding="utf-8",
            )
            with self.assertRaises(DefusedXmlException):
                validate(path)


if __name__ == "__main__":
    unittest.main(verbosity=2)
