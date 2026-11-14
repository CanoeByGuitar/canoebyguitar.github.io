# Project Instructions

## 最重要：不要擅自提交或部署

**只有当用户在对话中明确提出「提交 / commit / 推送 / push / 发布 / 部署 / deploy」时，才执行 `git commit`、`git push` 或触发 GitHub Actions。**

其他情况一律到「静态编译通过」为止：

- 默认验证命令是 `npm run check` + `npm run build`
- 不要 `git commit`
- 不要 `git push`
- 不要手动触发 workflow
- 不要修改 `.github/workflows/` 的触发条件
- 构建失败时只修代码，不要靠提交后看 CI

需要用户确认的边界情况：批量改名、改 URL、改分类、删除文章、动 `astro.config.mjs` 的 `site`/`base`，先说明影响再动手。

## 这个项目是什么

一个个人技术博客，作者是物理/动画引擎程序员（Chenhui Wang）。

- Astro 7 + Starlight 0.43，纯静态输出
- 文章放在 `src/content/docs/posts/`，由 Starlight 的 docs collection 渲染
- 站点部署在 GitHub Pages 根域名：`https://canoebyguitar.github.io`
- 仓库：`git@github.com:CanoeByGuitar/canoebyguitar.github.io.git`
- 旧 Docusaurus 博客备份在远程分支 `legacy-docusaurus`，不要删除

## 命令

| 目的 | 命令 |
| --- | --- |
| 本地开发 | `npm run dev` |
| 手机同 WiFi 预览 | `npm run dev -- --host` |
| 类型检查 | `npm run check` |
| 静态编译 | `npm run build` |
| 预览编译产物 | `npm run preview` |
| 预览产物 + 局域网 | `npm run preview -- --host` |

Zed 里还有 tasks：`dev` / `build` / `preview` / `check` / `Manim: Preview current scene` / `Manim: Render current scene`。

## 内容结构

一篇文章 = 一个文件夹，slug 就是文件夹名：

```text
src/content/docs/posts/<slug>/
├── index.md          # 正文
├── assets/           # 可选：Markdown 里引用的图片
└── scenes/           # 可选：动画源码（Manim 等）
```

- URL 是 `/posts/<slug>/`
- 不要再按分类建目录，分类是元数据，不是路径
- 首页 `/posts/` 列表只显示日期 + 标题 + 分类

### Frontmatter 约定

```yaml
---
title: "Article Title"
description: One-sentence summary shown in lists and meta tags.
date: 2026-11-13
category: Misc
---
```

- `title` 必填
- `date` 用 `YYYY-MM-DD`
- `category` 是**一级分类**，只有一个
- **没有 `tags`**，schema 里没有这个字段，不要加

### 媒体路径（容易踩坑）

两条不同规则：

- Markdown 图片语法 `![](./assets/x.png)` → Astro 会处理并优化，可以放在文章自己的 `assets/`
- 原生 HTML `<video>` / `<source>` / `<img src>` → **不经过 Astro 资源管线**，必须放 `public/`，用绝对路径引用

所以生成的视频/大媒体统一放：

```text
public/media/<slug>/
```

文章里引用：

```html
<video controls playsinline preload="metadata" poster="/media/<slug>/name-poster.webp">
  <source src="/media/<slug>/name.webm" type="video/webm" />
  <source src="/media/<slug>/name.mp4" type="video/mp4" />
</video>
```

WebM 放前面，MP4 兜底。

## 示例文章（showcase）

`src/content/docs/posts/blog-writing-sample/`

这是系统的活体样例，用来验证排版、公式、代码、表格和媒体，不要随意删除。

路径与产物：

```text
src/content/docs/posts/blog-writing-sample/index.md
src/content/docs/posts/blog-writing-sample/scenes/bouncing_ball.py
src/content/docs/posts/blog-writing-sample/scenes/vec3_project.py
public/media/blog-writing-sample/bouncing-ball.{mp4,webm}
public/media/blog-writing-sample/bouncing-ball-poster.webp
src/content/docs/posts/blog-writing-sample/assets/vec3-projection.png
```

里面目前展示了一个完整案例：**Manim CE 3D 小球弹跳**，小球从 `(0,2,0)` 在 XZ 平面上下落、反弹，冲击速度低于阈值后停止，旁边实时显示 `vel` / `pos`；另有一张静态的向量投影图。包含：

- KaTeX 公式（自由落体与反弹）
- 视频 + poster（WebM/MP4 双源）
- 输出规格表（1920×1080 / 30fps / 4.6s）
- 静态图（自动裁剪 PNG → WebP）
- 源码位置和重新渲染方式
- Roadmap（Draw.io、带字幕视频、自定义媒体语法尚未实现）

新增 showcase 案例时追加到这篇里，并同步更新它的 Roadmap。

## 主题与样式

- 全部设计令牌在 `src/styles/custom.css`，变量前缀 `--c-*`（`--c-bg` / `--c-fg` / `--c-accent` / `--c-muted` / `--c-surface` / `--c-border`）
- 17 套配色：11 暗（含 `jetbrains-dark`）+ 6 浅，通过 `[data-scheme='...']` 覆盖变量
- 切换器是 `public/theme.js`：`t` 唤起，hover 预览，Enter 保存，Esc 取消，存 `localStorage: theme-palette`
- 切换器同时写 `data-theme`，因为 Expressive Code 靠它选 dark/light 代码 token
- 字体：JetBrains Mono（UI/标题/代码）+ Source Serif 4（英文正文）+ Noto Sans SC / Noto Serif SC（中文），通过 `astro.config.mjs` 的 `customCss` 引入 fontsource

改配色时四处要一起改：

- `src/styles/custom.css` 的 `[data-scheme='...']` 变量块
- `public/theme.js` 的 `SCHEMES` 数组
- 三个首屏 bootstrap 的暗色列表：`astro.config.mjs` 的 `head` 内联脚本、`src/pages/index.astro`、`src/pages/posts/index.astro`

首屏 bootstrap 负责在绘制前写入 `data-scheme` / `data-theme` / `data-mode`，漏改会导致刷新闪一下浅色。

## Starlight 定制原则

**不要改 `node_modules`。** 需要改框架行为时，把组件复制到 `src/components/` 再在 `astro.config.mjs` 里覆盖：

```js
components: {
  Header: './src/components/Header.astro',
  PageFrame: './src/components/PageFrame.astro',
  TwoColumnContent: './src/components/TwoColumnContent.astro',
  PageSidebar: './src/components/PageSidebar.astro',
}
```

当前已做的定制：

- `Header` — 只保留 `about` / `posts` / 搜索 / 配色按钮
- `PageFrame` — 去掉 Starlight 的文章列表侧栏
- `TwoColumnContent` — 桌面端左侧目录 + 右侧正文；**没有 TOC 的页面必须保持单列**（否则正文会挤进 18rem 列）
- `PageSidebar` + `TocTree.astro` — 多级可折叠目录，父节点文字点击折叠，`#` 单独跳转，自动展开当前章节祖先

自定义 Markdown 语法不要改框架，走 `markdown.processor` 的 remark/rehype 插件。

## 数学公式

KaTeX，通过 `@astrojs/markdown-remark` 的 `unified()` 配置：

```js
markdown: {
  processor: unified({
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  }),
}
```

写公式用 `$...$` 和 `$$...$$`，不要用需要完整 LaTeX 的宏包。

## Manim 动画

环境在本项目本地 venv，不污染系统 Python：

```text
.venv/            Python 3.12 + Manim CE 0.22.1
.venv/Scripts/python.exe
```

渲染脚本：`scripts/render-manim.mjs`（Node，无 PowerShell 依赖），由 Zed task 用 `node` 直接调用。三种模式：

| 模式 | 输出 | 用途 |
| --- | --- | --- |
| `preview` | 480p15 MP4 到 `.manim-media/`，自动打开 | 改片时快速看效果 |
| `still` | 3840×2160 PNG，自动裁掉白边后存到文章 `assets/<output>.png` | 静态插图、封面帧 |
| `render` | 1080p30 MP4 + VP9 WebM + WebP poster 到 `public/media/<slug>/` | 正式发布 |

`still` 存进文章自己的 `assets/`，是因为它用 Markdown 图片语法引用时 Astro 会优化（转 WebP + 带尺寸）；`<video>` 走原生标签，所以视频必须在 `public/media/`。

场景文件约定：

- 类名可以是任意 `Scene` / `ThreeDScene` 子类，脚本自动识别（多个时用 `--scene <ClassName>`）
- 写一行 `# output: <asset-name>`，决定输出文件名（不放第一行也行，建议放开头）
- 视频输出目录自动推导为 `public/media/<文章文件夹名>/`
- 只有静态 `self.add(...)`、没有 `play` / `wait` 的场景，用 `still` 最快
- 公共工具放在 `scripts/manim_utils/`：场景里 `from manim_utils import UnityScene, to_manim`，`render-manim.mjs` 会把 `scripts/` 注入 `PYTHONPATH`，`pyrightconfig.json` 的 `extraPaths` 负责编辑器里的 import 解析
- Unity 坐标系适配（Y 朝上、Z 朝前、yaw/pitch 或 pos/look_at/up 相机、RGB 三色轴）在 `scripts/manim_utils/unity3d.py`；新场景继承 `UnityScene`，不要改 `.venv` 里的 Manim

Render task 会做完整链条：

1. Manim 1080p30 → MP4
2. 复制到 `public/media/<slug>/`
3. FFmpeg 转 VP9 WebM
4. FFmpeg 抽 2 秒处生成 WebP poster

预览 task 是 480p15，只渲染并打开，不写进 `public/`。

命令行直接调用也可以：

```bash
node scripts/render-manim.mjs --mode preview --scene-file <scene.py>
node scripts/render-manim.mjs --mode still   --scene-file <scene.py>
node scripts/render-manim.mjs --mode render  --scene-file <scene.py>
```

FFmpeg 解析顺序：`FFMPEG_PATH` → PATH 上的 `ffmpeg` → winget 安装目录。找不到会直接报错并给出安装命令。

`.venv/`、`.manim-media/`、`qa/`、`__pycache__/` 都已被 gitignore，不要提交。

改完 Python 场景要跑：

```bash
.venv/Scripts/python.exe -m ruff check <scene.py>
.venv/Scripts/python.exe -m py_compile <scene.py>
```

## 部署

只有当用户明确要求时才部署。

机制：

- 推送到 `main` → `.github/workflows/deploy.yml` 触发
- `withastro/action@v6` 构建并上传 artifact，`actions/deploy-pages@v5` 发布
- workflow 里写死了 `SITE: https://canoebyguitar.github.io` 和 `BASE: /`
- 也支持 `workflow_dispatch` 手动触发

因为仓库名是 `canoebyguitar.github.io`，站点在域名根路径，所以 `BASE=/` 是对的。换仓库名必须同步改 `BASE`。

## 完成前检查

改任何内容后：

```bash
npm run check    # 0 errors / 0 warnings / 0 hints
npm run build    # 页面数与预期一致
```

涉及媒体时额外确认：

- `dist/media/<slug>/` 里有对应文件
- 页面 HTML 里的路径是 `/media/...` 而不是 `./assets/...`
- `preload="metadata"`、`poster`、WebM 在前

涉及文章时确认路由：

- 新文章在 `dist/posts/<slug>/index.html`
- 改名后旧路由已消失
