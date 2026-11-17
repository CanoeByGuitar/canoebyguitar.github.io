# 类图：从材料到可编辑 SVG

## 1. 确定范围，读取事实

用户给出源码、目录、设计文档时优先读取，不为已清楚的要求反复提问。只在范围、抽象层次或输出路径不明确且影响结果时询问。

- 列举目录，找类型声明、实现、相关测试或调用处。使用文件读取和符号导航，不靠类名猜职责。
- 声明确认属性、方法、继承、可见性、抽象/静态/final。
- 实现确认创建位置、实际持有、共享关系、调用、析构和生命周期。记录关系依据的文件/符号；必要时把这份映射放独立建模说明，不把敏感绝对路径嵌入公开图片。
- 区分“当前代码”与“建议设计”；没有实现依据的设计只能标注为假设。
- 大系统先选核心子系统。不要穷举全部标准库/工具函数和所有参数依赖，避免意大利面式类图；省略范围必须说明。

建议先写简短关系表：`source / target / relation / multiplicity / evidence`，再转换 JSON。

## 2. UML 语义，不机械翻译指针类型

| 关系 | 连线 | source → target 约定 | 判断依据 |
| --- | --- | --- | --- |
| association | 实线，无箭头 | 持有方 → 被关联对象（这里只是输入约定，不画导航箭头） | 持续引用、持有或协作关系 |
| aggregation | 实线，空心菱形 | 整体 → 部分，菱形在 source | 明确共享的整体—部分语义；普通共享引用通常用关联 |
| composition | 实线，实心菱形 | 整体/拥有者 → 部分，菱形在 source | 明确独占拥有及受控生命周期 |
| generalization | 实线，空心三角 | 子类 → 基类 | 继承；三角指向基类 |
| realization | 虚线，空心三角 | 实现类 → 接口 | 接口契约实现；三角指向接口 |
| dependency | 虚线，开放箭头 | 使用者 → 被使用类型 | 临时使用、参数、返回值、创建等主要依赖 |

C++ 注意：

- `shared_ptr<T>` 不自动等于聚合或组合；默认关联，再根据整体—部分和生命周期证据判断。
- 按值的领域成员通常形成组合；不要为每个 `string`/`mutex` 画组合边。
- `unique_ptr` 也需查看所有权行为，不能只凭拼写下结论。
- 未实现全部纯虚函数的中间基类仍然抽象，哪怕头文件没有写“abstract”。
- 接口可用 `«interface»`，实现关系按 UML 虚线三角表达；不要把语言中的所有 `public Base` 都当接口实现。
- `string_view`/裸指针/引用不拥有对象；依赖和关联需结合是否持久存储判断。
- 不把同步局部记录和函数调用画成队列、异步服务或持久对象。

通用记号：`+` public、`-` private、`#` protected、`~` package；抽象名称/方法用斜体，静态方法用下划线，final 可用 `{leaf}`。构造器无返回类型。缩写类型需在注释解释，避免错误的合并返回类型。

## 3. 建模与布局

完整阅读 `class-model.md`。生成器不解析代码、不自动排图：AI 写 JSON 的坐标、框宽、锚点、waypoints 和标签位置。

- 上层放接口/基类，中层放核心协作者，下层放实现/数据类型；不强制所有图都三列。
- 把关联端的角色名和多重性标在对应端。不要把 `0..*` 放到持有者一侧；多条同端关系可用不同归一化锚点分开。
- 框高由成员行数计算。长成员自动保守换行；若太长，先扩宽或有说明地简写。
- 排列时预留绕线路径，不让边穿类框/标题。多折线必须通过 waypoints 显式规划。
- 暂定中性背景、细线、无阴影的标准技术图；不为图增加无关装饰。字号默认 16，类名 22，标题 28；宽图在文章中缩小时需要另查可读性。
- 注释明确抽象层级、省略类型、缩写与生命周期细节。禁止编造方法或多重性。

## 4. 生成

从技能路径定位脚本；Python 用当前任务可用的 3.10+ 解释器：

```bash
python <skill>/scripts/generate_class_diagram.py <model>.json --output <name>.drawio.svg
# 可选另存同一编辑模型
python <skill>/scripts/generate_class_diagram.py <model>.json --output <name>.drawio.svg --drawio <name>.drawio
```

只依赖标准库。它从同一组类/成员/关系参数生成：

1. SVG `rect/text/path/marker`，无 HTML foreignObject。
2. Draw.io 父类框 + 局部坐标子元素 + 绑定类框的边 + 边子标签。
3. XML 转义后的 mxfile 放根节点 `content`，设置显式 width/height/viewBox。

已有输出会拒绝覆盖；确认编辑权威来源后才加 `--force`。所有文件输出路径显式传入，不写死到博客或某个样例。

## 5. 可执行结构检查

验证器额外依赖安全 XML 库：

```bash
python -m pip install -r <skill>/scripts/requirements.txt
python <skill>/scripts/validate_svg.py <name>.drawio.svg
python <skill>/scripts/test_class_diagram.py
```

验证覆盖 XML、尺寸、ID、marker、生成器的绝对 M/L/Z 路径子集、嵌入模型、父子引用/循环与绑定边。**不是完整 SVG 规范验证，也不会证明 UML 语义或视觉正确。** 对用户提供的任意 SVG 不支持的命令应明确报出，不能误称其 SVG 非法。

## 6. 渲染—检查—修正闭环

优先使用现有工具，不擅自安装大型依赖。可用以下任一渲染路线；有浏览器时建议额外检查浏览器版本：

```bash
# 项目已安装 Sharp 时，从该项目运行；路径要换成实际值
node --input-type=module -e "import sharp from 'sharp'; await sharp('diagram.drawio.svg').png().toFile('qa/diagram.png')"

# Chromium/Chrome 已安装时；使用绝对 file URL 和实际视口尺寸
chrome --headless --disable-gpu --hide-scrollbars --screenshot=<absolute-qa-path>.png --window-size=1600,1200 file:///<absolute-svg-path>
```

Sharp 属于可选渲染工具，不是生成器依赖；浏览器参数和可执行文件位置因系统而异。不要仅因命令退出 0 就说视觉通过：**读 PNG/截图**，检查：

- 文本超框、名称截断、Unicode/中文缺字、字体回退。
- 连线穿框、交叉、箭头被覆盖、菱形是否在整体端。
- 多重性/角色标签是否贴对端、是否盖住方法或连线。
- 留白、类框距离、最终网页或目标尺寸的可读性。

修正 JSON → 重新生成 → 重验 → 重渲染。首次图可能语法通过但文字溢出；此闭环是必需步骤。有工具限制时明确报告“未完成视觉验证”，不宣称全部完成。

## 7. Draw.io 编辑与往返验收

结构检查只是可编辑模型的必要条件。能使用 Draw.io Desktop/Web 时，执行：

1. 打开 `.drawio.svg`（或 `.drawio`），确认是可选择的类框/成员/连接线，而不是一张平面图片。
2. 移动一个类框，确认其成员跟随，关系端点仍连接；手工 waypoints 可能需要手动重排。
3. 编辑类名、一个方法及关系标签；确认标签可编辑且随边移动。
4. Save As **Editable Vector Image (.svg)**，或导出时勾选 **Include a copy of my diagram**。
5. 重开文件，重渲染检查；不要要求保存后的 SVG 字节与脚本生成的一致，Draw.io 可改为 foreignObject 并调整排版。

如果环境不能操作 GUI，只说“结构与渲染已验证，Draw.io GUI 往返未测试”。没有 GUI 验收的自动输出不能承诺像素级往返一致。

## 8. 集成与交付

按目标项目的图片管线集成，而非默认修改站点设置。对于本博客，SVG 在文章 `assets/`，用 Markdown 相对路径引用；现有 `drawio:prepare` 会补尺寸提示。遵守项目 check/build，不提交、不部署。

记录执行命令、结果、修复和未覆盖项。交付时让用户知道 JSON 与 Draw.io 编辑有不同权威来源；从旧 JSON 重生成会覆盖编辑器修改。模型含源码信息，公开发布前检查隐私。
