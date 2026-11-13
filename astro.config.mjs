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
        '@fontsource/noto-sans-sc/400.css',
        '@fontsource/noto-sans-sc/600.css',
        '@fontsource/noto-serif-sc/400.css',
        '@fontsource/noto-serif-sc/600.css',
        'katex/dist/katex.min.css',
        './src/styles/custom.css',
      ],
      components: {
        Header: './src/components/Header.astro',
      },
      head: [
        // 全站分享缩略图使用个人头像。
        { tag: 'meta', attrs: { property: 'og:image', content: new URL('avatar.jpg', site).href } },
        { tag: 'meta', attrs: { property: 'og:image:alt', content: 'Portrait of Chenhui Wang' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: new URL('avatar.jpg', site).href } },
        // 首屏前先按 localStorage 设定配色，避免闪烁
        {
          tag: 'script',
          content: `try{document.documentElement.dataset.scheme=localStorage.getItem('theme-palette')||'one-light'}catch{}`,
        },
        // 配色切换器（t 键唤起）与文章目录折叠。
        { tag: 'script', attrs: { src: `${base}theme.js`, defer: true } },
        { tag: 'script', attrs: { src: `${base}article-toc.js`, defer: true } },
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
