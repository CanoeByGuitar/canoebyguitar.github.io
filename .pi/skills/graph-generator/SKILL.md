---
name: graph-generator
description: 根据代码、设计文档或文字描述，用 AI 分析真实关系并生成浏览器可显示、Draw.io 可二次编辑的图表。适用于类图、UML、泳道式代码调用执行流、从函数入口展开调用与返回、可编辑 SVG 等请求。支持类图与同步泳道调用执行流；其他图型需独立场景说明和生成器。
compatibility: 生成器需要 Python 3.10+；验证器需要 defusedxml；图片检查需要可用的浏览器或 SVG 渲染工具。
---

# Graph Generator

## 路由与目录

- **类图 / UML**：先完整阅读 `references/class-diagram.md`，然后阅读 `references/class-model.md`；按说明使用 `scripts/generate_class_diagram.py`。
- **泳道式调用执行流**：完整阅读 `references/call-flow.md`，使用 `scripts/generate_call_flow.py` 与 `examples/call-flow.json`；对应从函数入口向下执行、跨泳道调用和逐层返回的请求。不是静态调用图，也不是严格 UML 时序图。
- **普通流程图 / 严格 UML 时序图 / 静态调用图 / 其他**：尚未实现。新增独立场景说明、模型与生成器后再支持，不冒充已有图型。
- `examples/class-diagram.json`：与业务无关的最小示范，演示所有六种关系；不是任何真实源码的事实。
- `scripts/validate_svg.py`：生成器使用的 SVG 子集 + 嵌入 Draw.io XML 检查。
- `scripts/test_class_diagram.py` / `scripts/test_call_flow.py`：对应场景的回归测试。
- `scripts/generate-logger-uml.py`：早期专用示例，仅供回顾双格式生成原理；**不要作为默认生成器，不要运行它覆盖文章**。通用流程不依赖它。

所有技能内相对路径相对于本目录解析。用户模型和产物路径由任务显式确定，不依赖当前博客目录、固定机器路径或特定 Python venv。

## 共通交付契约

1. AI 负责阅读材料、抽取模型、判断语义、设计布局；脚本负责编码和确定性检查。不要宣称脚本自动理解源码或自动完成 UML 建模。
2. 同一份 JSON 模型生成两套表示：原生 SVG 图形 + `content` 属性中的 Draw.io `<mxfile>`。浏览器显示前者，Draw.io 编辑后者。只有 SVG 没有编辑模型，不满足本技能交付要求。
3. 类图的类框、执行流的泳道必须作为父容器携带子元素；边必须以 `source` / `target` 绑定类框或步骤节点，不能只存绝对坐标假装可编辑关系。类图标签为边的相对子元素，执行流使用原生边标签。容器移动时子元素跟随；手工 waypoint 不保证自动避障。
4. 不能只检查 XML 后宣称图正确：必须实际渲染、读取图片、修复溢出/遮挡/连线问题并重渲染。
5. 区分“结构验证通过”“图片已检查”“Draw.io GUI 往返已测试”。没做的不要声称已做。
6. SVG 原始图形与内嵌模型不会自动同步。AI 修改应改 JSON 后重新生成；Draw.io 修改应重新保存/导出 **Editable SVG / Include a copy of my diagram**。
7. 明确编辑权威来源：JSON 主导或 Draw.io 主导。不要从过期 JSON 覆盖用户在 Draw.io 中的修改。模型不是代码事实的自动同步副本。
8. 默认不覆盖现有文件；`--force` 只在确认没有需要保留的手工编辑时使用。禁止未经请求提交、推送或部署。

## 默认交付

- `<name>.drawio.svg`：展示与二次编辑。
- `<name>.json`：AI 建模与可复现生成的输入；用户不需要它来打开 Draw.io。**用于文章的图，JSON 必须与 SVG 一起保存在该文章的 `assets/`，同名配对为 `assets/<name>.json` 和 `assets/<name>.drawio.svg`。** 从文章自己的 JSON 生成 SVG，不直接依赖技能 `examples/` 中的模型；技能示例只能作为模板，先复制到文章再编辑。其他项目也将 JSON 与对应 SVG 同目录保存。
- 文章说明应指出本地 JSON 图源位置与重新生成方式。修改 JSON 后需重新运行生成器；当前没有自动同步，也不会把 Draw.io 修改反写 JSON。
- 简短说明：范围、缩写、关键关系及实际验证证据。
- 可选 `.drawio`：便于专用编辑器直接打开，内容与 SVG 内嵌模型一致。

临时 PNG、浏览器截图、检查日志放任务的临时/QA 目录，不把它们混入文章正式媒体。嵌入模型含有类名、成员与注释，发布前留意源码隐私。
