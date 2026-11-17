"""Regression checks for ordered synchronous swimlane calls and returns."""

import copy
import json
import tempfile
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

from generate_call_flow import generate, prepare
from validate_svg import validate

HERE = Path(__file__).resolve().parent


class CallFlowTests(unittest.TestCase):
    def setUp(self):
        self.data = json.loads(
            (HERE.parent / "examples/call-flow.json").read_text(encoding="utf-8")
        )

    def test_nesting_and_style(self):
        _, _, rows = prepare(self.data)
        returns = [(r["source"], r["dest"]) for r in rows if r["kind"] == "return"]
        self.assertEqual(returns, [("c", "b"), ("b", "a")])
        svg, _ = generate(self.data)
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "trace.drawio.svg"
            ET.ElementTree(svg).write(path, encoding="utf-8")
            _, model = validate(path)
            cells = model.findall(".//mxCell")
            edges = [c for c in cells if c.attrib.get("edge") == "1"]
            cross = [c for c in edges if "dashed=1" in c.attrib["style"]]
            self.assertEqual(len(cross), 4)
            self.assertTrue(all("endArrow=block" in c.attrib["style"] for c in edges))
            self.assertTrue(any(c.attrib.get("parent") == "lane-a" for c in cells))

    def test_reject_invalid_stacks(self):
        cases = []
        data = copy.deepcopy(self.data)
        data["events"].insert(0, {"kind": "return", "text": "bad"})
        cases.append(data)
        data = copy.deepcopy(self.data)
        data["events"] = data["events"][:3]
        cases.append(data)
        data = copy.deepcopy(self.data)
        data["events"][6]["target"] = "a"
        cases.append(data)
        data = copy.deepcopy(self.data)
        data["events"][2]["target"] = "missing"
        cases.append(data)
        data = copy.deepcopy(self.data)
        data["events"][2]["target"] = "a"
        cases.append(data)
        for data in cases:
            with self.subTest(data=data), self.assertRaises(ValueError):
                prepare(data)

    def test_unicode_wrap(self):
        self.data["events"][0]["text"] = "中文步骤 <T> & long input " * 4
        _, _, rows = prepare(self.data)
        self.assertGreater(rows[0]["height"], 48)
        generate(self.data)


if __name__ == "__main__":
    unittest.main(verbosity=2)
