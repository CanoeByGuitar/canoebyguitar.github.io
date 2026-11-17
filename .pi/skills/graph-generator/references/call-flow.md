# 泳道式调用执行流图

## 图型与边界

用于“从类的函数入口开始，竖向执行，跨类调用向另一泳道走，返回后继续”的请求。推荐称呼 **泳道式调用执行流图 / swimlane call execution flow**。

- 它不是静态 call graph：静态图表示可能的调用关系，不表达单次执行时间。
- 它借用时序图的纵向时间和参与者，但纵向实线箭头表示执行步骤，不使用标准 UML 生命线；不要声称它是严格 UML sequence diagram。
- 本版本只支持单线程、同步、闭合调用栈的一条路径。条件分支选定一条并标注；并发、异常跨栈展开、异步任务、递归/重入、循环折叠需专门扩展，不能假画成同步返回。

## 阅读与建模

具体源码任务先读取入口实现及被调函数，按执行顺序抽取核心步骤，不根据函数名编造。记录方法/行号证据和选定分支；注明省略的库调用、内部细节和最大展开层次。

用户只要示意时，使用 ClassA/ClassB/ClassC 等抽象参与者，明确不是源码事实。

1. 每条泳道对应类/对象/模块；对象实例重要时显示 `instance: Type`，避免同类不同实例混淆。
2. 时间永远向下：同泳道相邻步骤用**实线向下箭头**。
3. 同步调用：调用点 → 被调函数入口，用**跨泳道虚线箭头**，标注 call。被调泳道继续向下。
4. 返回：被调泳道的 return → 最近调用者的续执行点，用**跨泳道虚线箭头**，标注 return。返回不向上画，不跳过中间调用者。
5. 调用者等待期间不画实线跨过整个等待区，避免暗示并行执行。恢复后才继续向下。
6. 按首次进入次序从左向右排泳道，常见嵌套调用向右，返回向左。已有泳道调用向左也允许；若要求所有调用向右而存在循环依赖，应说明布局限制，不伪造参与者。

## JSON 协议

先读 `examples/call-flow.json`。输入不是类图 JSON；使用独立生成器 `scripts/generate_call_flow.py`。

```json
{
  "title": "Call execution flow",
  "lanes": [{"id":"a","name":"ClassA"}, {"id":"b","name":"ClassB"}],
  "entry": "a",
  "events": [
    {"kind":"step","text":"entry()"},
    {"kind":"call","target":"b","text":"work()"},
    {"kind":"step","text":"Compute result"},
    {"kind":"return","text":"return result","resume":"entry(): receive result"},
    {"kind":"step","text":"Finish"}
  ],
  "notes": ["Synchronous selected path; internal details omitted."]
}
```

- title、lanes、entry、events 必填；notes 可选字符串数组。
- lane id 唯一，匹配 `[A-Za-z][A-Za-z0-9_-]*`；name 为显示名；lane 数组决定左右顺序。
- entry 指定起始泳道。当前泳道由脚本维护，不能在 step 任意切换。
- step：只有 kind/text，表示当前泳道步骤。
- call：kind/text/target；text 是被调函数入口，source 显示 Call；压入当前调用者后进入 target。
- return：kind/text/resume，可选 target（若写必须等于栈顶调用者）；text 是返回动作/结果，resume 是调用者续执行说明，默认 Resume caller。弹栈返回。
- 禁止无匹配 return、未返回的 call、同泳道 call、缺失目标和未识别字段。结束必须回到入口；不支持“展开到某层就结束”的部分调用栈。
- 固定泳道宽和行距，步骤高度按长文本换行计算；自动保持调用/返回水平对齐，所有事件按全局顺序向下推进。无需 AI 手写坐标。

## 生成与验证

```bash
python <skill>/scripts/generate_call_flow.py trace.json --output trace.drawio.svg
python <skill>/scripts/validate_svg.py trace.drawio.svg
python <skill>/scripts/test_call_flow.py
```

可选 `--drawio trace.drawio`；覆盖须明确 `--force`。依赖沿用 `scripts/requirements.txt`，生成器仅需标准库。

原生 SVG 与 Draw.io 从同一模型生成；Draw.io 泳道为容器，步骤为局部坐标子节点，边绑定步骤节点。移动泳道时步骤一起移动，移动步骤后连接端点保留。水平边 label 使用 Draw.io 原生边标签。

按 `class-diagram.md` 的渲染与 Draw.io 往返步骤检查，特别确认：

- 纵向边是实线向下，水平 call/return 是虚线箭头。
- B 调 C 后先 C→B，再 B→A，时间不倒流。
- caller 等待区没有执行箭头，返回续执行没有连接到早期调用点。
- 长文本未溢出，泳道标题清楚，水平标签不盖住函数入口。
- 最终目标尺寸下能读懂；参与者太多时缩范围，不强行缩小文字。

大标题过长、多泳道导致图太宽时应简写/拆图；脚本不做复杂布局优化。不能只通过结构检查就声称视觉或 GUI 验收通过。
