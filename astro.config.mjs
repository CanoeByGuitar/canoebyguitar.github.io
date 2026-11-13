// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// GitHub Pages 部署时通过环境变量注入；本地开发默认使用根路径。
// 例：SITE=https://canoebyguitar.github.io  BASE=/
const site = process.env.SITE ?? 'http://localhost:4321';
const base = process.env.BASE ?? '/';

export default defineConfig({
  site,
  base,
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },
  integrations: [
    starlight({
      title: 'Chenhui Wang',
      description: 'Graphics / Math / C++ — 物理与动画引擎程序员的笔记本',
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      customCss: [
        '@fontsource/jetbrains-mono',
        '@fontsource/source-serif-4',
        'katex/dist/katex.min.css',
        './src/styles/custom.css',
      ],
      head: [
        // 首屏前先按 localStorage 设定配色，避免闪烁
        {
          tag: 'script',
          content: `try{document.documentElement.dataset.scheme=localStorage.getItem('scheme')||'catppuccin-mocha'}catch(e){}`,
        },
        // 配色切换器（t 键唤起）
        { tag: 'script', attrs: { src: `${base}theme.js`, defer: true } },
      ],
      sidebar: [
        {
          label: '归档',
          items: [
            { autogenerate: { directory: 'posts' } },
          ],
        },
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/canoeByGuitar' },
        { icon: 'email', label: 'Email', href: 'mailto:canoebyguitar@gmail.com' },
      ],
    }),
  ],
});
