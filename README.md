# 像素乐园

一个卡通像素风格的个人博客，基于 **Astro + Starlight**，支持深色 / 浅色主题切换，可部署到 GitHub Pages。

## 技术栈

- [Astro](https://astro.build/) 7 — 静态站点生成
- [Starlight](https://starlight.astro.build/) 0.43 — 文档/博客框架（导航、搜索、深色模式、响应式）
- Markdown / MDX 内容
- 本地打包字体：ZCOOL KuaiLe（中文卡通）、Press Start 2P（像素英文）

## 快速开始

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # 构建到 dist/
npm run preview    # 本地预览构建产物
npm run check      # TypeScript / Astro 检查
```

## 目录结构

```text
.
├── astro.config.mjs        # 站点与 Starlight 配置
├── src/
│   ├── content.config.ts   # 内容集合 schema（扩展了 date / tags）
│   ├── content/docs/posts/ # 文章（Markdown）
│   ├── pages/index.astro   # 自定义首页
│   ├── styles/custom.css   # 像素主题
│   └── assets/logo.svg
├── public/                 # 静态资源
└── .github/workflows/      # GitHub Pages 部署
```

## 添加文章

在 `src/content/docs/posts/` 新建 `.md` 文件：

```markdown
---
title: 文章标题
description: 文章简介
date: 2026-01-03
tags: [随笔]
---

正文内容……
```

首页会自动列出文章，文章页路径为 `/posts/文件名/`。

## 主题切换

- 深色 / 浅色通过 `<html data-theme="light|dark">` 控制。
- 首页和文档页共用 `localStorage` 里的 `starlight-theme`，状态互通。
- 设计令牌在 `src/styles/custom.css` 的 `:root` 与 `:root[data-theme='dark']` 中定义。

## 字体说明

当前使用 fontsource 本地打包字体，构建时随站点一起发布，无需访问 Google Fonts。
如需更完整的**中文像素字体**，可自行下载（如「缝合像素字体 Fusion Pixel」）放入
`src/assets/fonts/` 并通过 `@font-face` 引入，然后替换 `--px-font-display`。

## 部署到 GitHub Pages

1. 编辑 `.github/workflows/deploy.yml`，把 `SITE` 改成 `https://你的用户名.github.io`，
   `BASE` 改成仓库名（如 `/blog`）。若仓库名为 `用户名.github.io`，`BASE` 填 `/`。
2. 推送到 GitHub 的 `main` 分支。
3. 在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。

## 路线图

- [ ] Mermaid 流程图组件
- [ ] Draw.io 源文件 → SVG/PNG 构建管线 + Zed 外部编辑 Task
- [ ] 图片 / GIF / 视频媒体组件
- [ ] ManimCE 数学动画
- [ ] Three.js 交互式 3D
- [ ] AI 文章生成与校验脚本

## License

MIT
