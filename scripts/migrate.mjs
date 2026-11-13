// 一次性迁移脚本：旧 Docusaurus 博客 → 新 Astro + Starlight 博客
// 用法：node scripts/migrate.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NEW_ROOT = path.resolve(__dirname, '..');
const OLD_ROOT = 'C:/Blog/canoebyguitar.github.io';

// 旧文件路径（相对旧博客根）、新 slug（即文件夹名）、git 最后提交日期
const POSTS = [
  { src: 'blog/C++/Cpp和UE智能指针详解/1.md', slug: 'cpp-ue-smart-pointers', date: '2024-06-28' },
  { src: 'blog/C++/Eigen/eigen.md', slug: 'eigen-cookbook', date: '2024-12-21' },
  { src: 'blog/C++/Modern Cpp新特性总结/1.md', slug: 'modern-cpp-features', date: '2024-09-08' },
  { src: 'blog/C++/cpp规范.md', slug: 'cpp-style-guide', date: '2024-07-16' },
  { src: 'blog/C++/从移动语义到封装RAII类/1.md', slug: 'move-semantics-and-raii', date: '2024-08-06' },
  { src: 'blog/C++/仿函数/1.md', slug: 'functor-and-std-function', date: '2024-07-28' },
  { src: 'blog/C++/动态多态和静态多态/1.md', slug: 'dynamic-and-static-polymorphism', date: '2024-08-06' },
  { src: 'blog/C++/模版元范式入门/1.md', slug: 'template-metaprogramming-intro', date: '2024-09-08' },
  { src: 'blog/C++/编译和链接/链接、装载与库.md', slug: 'compile-link-and-libraries', date: '2023-12-02' },
  { src: 'blog/C++/设计模式/1.md', slug: 'design-patterns', date: '2024-09-08' },
  { src: 'blog/C++/面向对象基础/1.md', slug: 'cpp-oop-basics', date: '2024-07-28' },
  { src: 'blog/Rendering/渲染基础 - Fundamental of Graphics/1.md', slug: 'rendering-fundamentals', date: '2024-06-28' },
  { src: 'blog/Unreal/Factory.md', slug: 'ue-factory', date: '2024-07-16' },
  { src: 'blog/Unreal/Lyra浅析/1.md', slug: 'lyra-analysis', date: '2024-07-21' },
  { src: 'blog/Unreal/RewindDebugger/1.md', slug: 'rewind-debugger', date: '2024-07-28' },
  { src: 'blog/Unreal/UE_Cookbook/1.md', slug: 'ue-cpp-cookbook', date: '2024-09-08' },
  { src: 'blog/Unreal/UE动画模块浅析/1.md', slug: 'ue-animation-module', date: '2024-09-08' },
  { src: 'blog/Unreal/UE类型系统/1.md', slug: 'ue-type-system', date: '2024-07-21' },
  { src: 'blog/数据结构和算法/Dijkstra/Dijkstra.md', slug: 'dijkstra-problems', date: '2023-12-02' },
  { src: 'blog/数据结构和算法/RBTree/RBTree.md', slug: 'red-black-tree', date: '2023-12-02' },
  { src: 'blog/杂谈/三种操作系统开发环境的搭建/Linux问题汇总.md', slug: 'three-os-environments', date: '2024-06-28' },
  { src: 'blog/杂谈/浅析ECS架构/ECS.md', slug: 'ecs-architecture', date: '2024-07-28' },
  { src: 'blog/杂谈/随笔/选offer后的思考.md', slug: 'thoughts-on-offer-choice', date: '2024-12-21' },
  { src: 'blog/项目/CAD课程作业：物理引擎/PhysicEngine.md', slug: 'tiny-physic-engine', date: '2024-06-28' },
  { src: 'blog/项目/Code-Graph/CodeGraph.md', slug: 'code-graph', date: '2024-07-16' },
  { src: 'blog/项目/Maya-Physion-Bone/PhysionBone.md', slug: 'pseudo-physics-elastic-bone', date: '2024-07-16' },
  { src: 'blog/项目/Pose-Space-Deformer/PoseDriverDeformer.md', slug: 'pose-driver-deformer', date: '2024-07-22' },
];

const CATEGORY = '归档';
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i;

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { frontmatter: {}, body: text };
  const body = text.slice(m[0].length);
  const frontmatter = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) frontmatter[kv[1]] = kv[2].trim();
  }
  return { frontmatter, body };
}

function stripMarkdown(text) {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/<\/?[^>]+>/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s*/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/\$\$?[^$]*\$\$?/g, '')
    .replace(/[#*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractDescription(body, fallback) {
  const trunc = body.indexOf('<!--truncate-->');
  const before = trunc >= 0 ? body.slice(0, trunc) : body;
  const paragraph = before
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .find((s) => s && !s.startsWith('```') && !s.startsWith('#') && !/^!\[/.test(s));
  const desc = stripMarkdown(paragraph ?? before) || fallback;
  return desc.length > 160 ? desc.slice(0, 160) + '……' : desc;
}

function sanitizeName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

let copied = 0;
const missingRefs = [];

for (const p of POSTS) {
  const srcPath = path.join(OLD_ROOT, p.src);
  if (!fs.existsSync(srcPath)) {
    console.error(`✗ 找不到文件：${p.src}`);
    continue;
  }
  const raw = fs.readFileSync(srcPath, 'utf8');
  const { frontmatter, body: bodyWithTrunc } = parseFrontmatter(raw);
  const title = (frontmatter.title || p.slug).trim();
  const description = extractDescription(bodyWithTrunc, title);
  let body = bodyWithTrunc.replace(/<!--truncate-->/g, '').trim();

  const outDir = path.join(NEW_ROOT, 'src', 'content', 'docs', 'posts', p.slug);
  const assetsDir = path.join(outDir, 'assets');
  const oldDir = path.dirname(srcPath);

  // 复制被引用的本地图片，并把路径改写到 assets/<文件名>
  const usedNames = new Map();
  const rewrite = (ref) => {
    if (/^(https?:|#|\/|data:|mailto:|javascript:)/i.test(ref)) return ref;
    const clean = ref.split('#')[0].split('?')[0].trim();
    if (!clean) return ref;
    const abs = path.resolve(oldDir, clean);
    if (!fs.existsSync(abs) || !IMAGE_EXT.test(abs)) {
      if (!clean.startsWith('.') && clean.includes('.')) missingRefs.push(`${p.slug} → ${clean}`);
      return ref;
    }
    fs.mkdirSync(assetsDir, { recursive: true });
    const ext = path.extname(abs);
    const stem = sanitizeName(path.basename(abs, ext));
    let target = `${stem}${ext}`;
    let n = 1;
    while (usedNames.has(target) && usedNames.get(target) !== abs) {
      target = `${stem}-${n}${ext}`;
      n += 1;
    }
    usedNames.set(target, abs);
    fs.copyFileSync(abs, path.join(assetsDir, target));
    copied += 1;
    return `assets/${target}`;
  };

  body = body.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, ref) => `![${alt}](${rewrite(ref)})`);
  body = body.replace(/<img\b([^>]*?)\bsrc="([^"]+)"/g, (_m, pre, ref) => `<img${pre} src="${rewrite(ref)}"`);

  const newFrontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `date: ${p.date}`,
    `category: ${CATEGORY}`,
    '---',
  ].join('\n');

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.md'), `${newFrontmatter}\n\n${body}\n`);
  console.log(`✓ ${p.slug.padEnd(28)} ${title}`);
}

console.log(`\n迁移完成：${POSTS.length} 篇，复制图片 ${copied} 张`);
if (missingRefs.length) {
  console.log(`\n以下图片引用在本地找不到（可能是外链或已失效，已保留原引用）：`);
  for (const r of missingRefs) console.log(`  - ${r}`);
}
