// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// GitHub Pages 部署时通过环境变量注入；本地开发默认使用根路径。
// 例：SITE=https://yourname.github.io  BASE=/blog
const site = process.env.SITE ?? 'http://localhost:4321';
const base = process.env.BASE ?? '/';

export default defineConfig({
  site,
  base,
  integrations: [
    starlight({
      title: '像素乐园',
      description: '一个卡通像素风格的个人博客',
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      logo: {
        src: './src/assets/logo.svg',
      },
      // 字体与主题样式：fontsource 走本地打包，避免 Google Fonts 被墙。
      customCss: [
        '@fontsource/press-start-2p',
        '@fontsource/zcool-kuaile',
        './src/styles/custom.css',
      ],
      sidebar: [
        {
          label: '文章',
          items: [
            { autogenerate: { directory: 'posts' } },
          ],
        },
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/yourname' },
      ],
    }),
  ],
});
