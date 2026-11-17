# 类图 JSON 输入协议

可运行示例：`../examples/class-diagram.json`。协议面向 AI 已整理的 UML 模型，不直接输入源码。Python 3.10+，生成器用标准库；验证器依赖 `defusedxml`。

## 顶层

```json
{
  "title": "Subsystem — UML class diagram",
  "description": "Accessible one-sentence summary",
  "classes": [],
  "relations": [],
  "notes": ["Signatures abbreviated; standard-library types omitted."]
}
```

`title` 必填非空，`classes` 必填非空数组；其余可选。未知字段会拒绝，便于捕获拼写错误。description 用于 SVG 无障碍描述；notes 显示在图底部。不要在 notes 粘贴全文源码。

## 类 / 接口 / 枚举

```json
{
  "id": "renderer",
  "name": "Renderer",
  "kind": "abstract",
  "stereotype": "«service»",
  "final": false,
  "x": 450,
  "y": 120,
  "width": 380,
  "attributes": ["- cache: Cache", "# mode: Mode"],
  "operations": [
    {"text": "+ draw(scene: Scene): void", "abstract": true},
    {"text": "+ create(): Renderer", "static": true},
    "+ flush(): void"
  ]
}
```

- `id`：唯一且匹配 `[A-Za-z][A-Za-z0-9_-]*`，关系通过它引用。不是显示类名。
- `name`：必填非空。过长名称会报错，应扩宽或有说明地简写。
- `kind`：`class`（默认）、`abstract`、`interface`、`struct`、`enumeration`。
- `stereotype`：可选补充标题记号，完整输入如 `«service»`；kind 已产生接口/struct/枚举记号，不要重复。
- `final`：布尔；显示 `{leaf}`。
- `x/y`：必填有限非负数，绝对坐标；`y >= 100` 给标题留空间。
- `width`：默认 360，至少 160。**不支持手工 height**，按实际换行行数自动算高。
- `attributes/operations`：可选数组；元素为字符串或 `{text, abstract?, static?}`。属性与方法类型、可见性和参数由 AI 写在 text 中，脚本不推断。
- `abstract`：布尔，斜体；`static`：布尔，下划线。接口的纯虚方法需显式 abstract。
- 枚举值放 attributes，operations 可为空；类的空栏仍保留。
- 所有成员按 16px 等宽字符估算换行，中文等宽度按双列估算。真实字形宽度仍需渲染核对；不保证所有平台字体一致。

当前框高公式：`64 + 32 + max(1, 属性行数)*24 + 32 + max(1, 方法行数)*24`。属性与方法换行后行数计入。生成器拒绝相交类框，但不自动移动它们。

## 关系

```json
{
  "source": "renderer",
  "target": "cache",
  "kind": "composition",
  "source_anchor": "bottom",
  "target_anchor": "top",
  "waypoints": [[640, 520], [980, 520]],
  "labels": [{"text": "cache 1", "x": 720, "y": 505}]
}
```

- kind：`association`（默认）、`aggregation`、`composition`、`generalization`、`realization`、`dependency`。
- source/target 必须引用现有类；继承/实现 target 是基类/接口；组合/聚合 source 是整体。
- 锚点：`left/right/top/bottom`，或归一化 `[x,y]`，值在 `[0,1]` 且至少一个坐标为 0 或 1（矩形边界）。默认 source=right、target=left。
- `[1,0.25]` 表示右边四分之一高处，可用来分开多条关联。坐标最终由框高计算，不需要手写端点。
- waypoints：可选绝对 `[x,y]` 数组，依次经过，生成折线；没有则是直线。没有自动避障。禁止相邻点重合。
- labels：可选数组，每个 text 为非空单行字符串；x 是文字左端，y 是 SVG 文字基线，均为绝对非负数。角色/多重性用独立标签放到正确端，如 `items 0..*`。
- Draw.io 边绑定到类框。标签转换为边的相对子元素；固定折点是初始布局，用户移动框后仍可能需要调整。

## 输出和限制

```bash
python scripts/generate_class_diagram.py model.json --output diagram.drawio.svg --drawio diagram.drawio
```

- 画布由类框、折点、标签、标题和 notes 范围推导，不写死。
- SVG 内嵌 `content="...mxfile..."`，浏览器不解析它；Draw.io 不从 SVG 图形反推模型。
- 默认拒绝覆盖，`--force` 明确允许覆盖；输入不允许与输出相同。
- JSON 是 AI 的建模结果，不是编译器 AST；程序不会判断 composition 语义、证据真实性、多重性正确性，也不会修复穿框连线。
- 当前无导航关联箭头、模板专用栏、多页/包框、泛型自动展开、自动布局、主题参数、自定义图标。需要时扩展协议和测试，不添加未支持的 JSON 字段。
- `validate_svg.py` 只面向生成器的 SVG 子集；不适用于验证 Draw.io 再导出的任意复杂 SVG。后者至少用安全 XML 解析与实际浏览器渲染检查，必要时扩展验证器。
