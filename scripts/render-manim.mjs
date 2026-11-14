#!/usr/bin/env node
/**
 * Render a Manim scene and publish the result as blog media.
 *
 * Usage:
 *   node scripts/render-manim.mjs --mode preview --scene-file <path/to/scene.py>
 *   node scripts/render-manim.mjs --mode still   --scene-file <path/to/scene.py>
 *   node scripts/render-manim.mjs --mode render  --scene-file <path/to/scene.py> [--scene <ClassName>]
 *
 * Modes:
 *   preview : 480p15 video into .manim-media/, opens it, touches nothing else
 *   still   : 1920x1080 PNG of the last frame -> <article>/assets/<output>.png
 *   render  : 1080p30 video -> public/media/<slug>/ + WebM + poster
 *
 * Conventions:
 *   - scene class: any `class X(Scene)` / `class X(ThreeDScene)` subclass
 *   - asset name : a `# output: <name>` comment anywhere in the file
 *   - output dir : public/media/<article folder name>/
 */
import { spawn, spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const IS_WIN = process.platform === 'win32';

// Shared scene helpers, e.g. `from manim_utils import UnityScene`.
const PYTHONPATH = [join(ROOT, 'scripts'), process.env.PYTHONPATH]
  .filter(Boolean)
  .join(delimiter);

const die = (message) => {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
};

const argv = process.argv.slice(2);
const opt = (name) => {
  const index = argv.indexOf(name);
  if (index === -1) return undefined;
  const value = argv[index + 1];
  return value && !value.startsWith('--') ? value : undefined;
};

const mode = opt('--mode') ?? 'preview';
if (!['preview', 'still', 'render'].includes(mode)) {
  die(`--mode must be "preview", "still" or "render" (got "${mode}")`);
}

const sceneFileArg = opt('--scene-file');
if (!sceneFileArg) die('missing --scene-file <path/to/scene.py>');

const sceneFile = resolve(sceneFileArg);
if (!existsSync(sceneFile)) die(`scene file not found: ${sceneFile}`);

const source = readFileSync(sceneFile, 'utf8');

const classMatch = source.match(/^class\s+([A-Za-z_]\w*)\s*\(\s*[A-Za-z_][\w.]*Scene\s*\)/m);
const sceneName = opt('--scene') ?? classMatch?.[1];
if (!sceneName) die('no Scene subclass found in the file; pass --scene <ClassName>');

const outputName =
  source.match(/^#\s*output:\s*([A-Za-z0-9._-]+)\s*$/m)?.[1] ??
  (sceneFile.split(/[\\/]/).pop() ?? 'scene').replace(/\.py$/, '');

// <root>/src/content/docs/posts/<slug>/scenes/<file>.py
const articleDir = dirname(dirname(sceneFile));
const slug = articleDir.split(/[\\/]/).filter(Boolean).pop();
if (!slug) die(`could not derive article folder from ${sceneFile}`);

const mediaDir = join(ROOT, '.manim-media');
const assetsDir = join(ROOT, 'public', 'media', slug);
const imageDir = join(articleDir, 'assets');
const python = join(ROOT, '.venv', IS_WIN ? 'Scripts/python.exe' : 'bin/python');

if (!existsSync(python)) {
  die(
    `missing Manim environment: ${python}\n` +
      '  create it with:  python -m venv .venv && .venv/Scripts/pip install manim',
  );
}

const run = (command, args, label) => {
  console.log(`\n▸ ${label}`);
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, PYTHONPATH },
  });
  if (result.error) die(`${label} could not start: ${result.error.message}`);
  if (result.status !== 0) die(`${label} exited with code ${result.status}`);
};

const walk = (dir, depth = 0, out = []) => {
  if (depth > 8 || !existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(path, depth + 1, out);
    } else {
      try {
        out.push({ path, name: entry.name, mtime: statSync(path).mtimeMs });
      } catch {
        // ignore files that vanish mid-scan
      }
    }
  }
  return out;
};

const newestMatching = (dir, predicate) =>
  walk(dir)
    .filter((file) => predicate(file.name))
    .sort((a, b) => b.mtime - a.mtime)[0]?.path;

const canExec = (bin, args) => {
  const result = spawnSync(bin, args, { stdio: 'ignore' });
  return !result.error && result.status === 0;
};

const findFile = (root, name, depth = 0) => {
  if (depth > 6 || !existsSync(root)) return undefined;
  let entries;
  try {
    entries = readdirSync(root, { withFileTypes: true });
  } catch {
    return undefined;
  }
  for (const entry of entries) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) {
      const nested = findFile(path, name, depth + 1);
      if (nested) return nested;
    } else if (entry.name.toLowerCase() === name.toLowerCase()) {
      return path;
    }
  }
  return undefined;
};

const resolveFfmpeg = () => {
  const candidates = [process.env.FFMPEG_PATH, 'ffmpeg', 'ffmpeg.exe'].filter(Boolean);
  for (const bin of candidates) {
    if (canExec(bin, ['-version'])) return bin;
  }
  const winget = process.env.LOCALAPPDATA
    ? join(process.env.LOCALAPPDATA, 'Microsoft', 'WinGet', 'Packages')
    : undefined;
  const found = winget ? findFile(winget, 'ffmpeg.exe') : undefined;
  if (found) return found;
  return die(
    'FFmpeg not found.\n' +
      '  install with:  winget install Gyan.FFmpeg\n' +
      '  then restart Zed, or set FFMPEG_PATH to the ffmpeg executable.',
  );
};

const openFile = (file) => {
  try {
    const options = { detached: true, stdio: 'ignore' };
    if (IS_WIN) {
      spawn('explorer.exe', [file], options).unref();
    } else if (process.platform === 'darwin') {
      spawn('open', [file], options).unref();
    } else {
      spawn('xdg-open', [file], options).unref();
    }
  } catch {
    // opening a preview is best-effort
  }
};

if (mode === 'preview') {
  run(
    python,
    ['-m', 'manim', '-ql', '--disable_caching', '--media_dir', mediaDir, sceneFile, sceneName],
    `Manim preview ${sceneName} (480p15)`,
  );

  const rendered = newestMatching(mediaDir, (name) => name === `${sceneName}.mp4`);
  if (!rendered) die(`preview video was not produced for ${sceneName}`);

  openFile(rendered);
  console.log(`\n✔ preview: ${rendered}`);
  console.log('  (nothing was written to public/)');
  process.exit(0);
}

if (mode === 'still') {
  run(
    python,
    [
      '-m', 'manim',
      '-s',
      '--format', 'png',
      '-r', '3840,2160',
      '--disable_caching',
      '--media_dir', mediaDir,
      '-o', `${outputName}.png`,
      sceneFile,
      sceneName,
    ],
    `Manim still ${sceneName} (3840x2160 PNG)`,
  );

  const rendered = newestMatching(
    mediaDir,
    (name) => name === `${outputName}.png` || name.startsWith(`${outputName}_`),
  );
  if (!rendered) die(`still image was not produced for ${outputName}`);

  mkdirSync(imageDir, { recursive: true });
  const target = join(imageDir, `${outputName}.png`);

  // Trim the uniform background so the figure is not a tiny stamp on a huge canvas.
  try {
    const { default: sharp } = await import('sharp');
    const trimmed = await sharp(rendered)
      .trim({ threshold: 8 })
      .extend({ top: 32, bottom: 32, left: 32, right: 32, background: '#ffffff' })
      .png({ compressionLevel: 9 })
      .toBuffer();
    writeFileSync(target, trimmed);
  } catch (error) {
    copyFileSync(rendered, target);
    console.warn(`\n⚠ trim skipped (${error.message}); copied untrimmed image instead`);
  }

  console.log(`\n✔ still: ${target}`);
  console.log(`  reference it as ./assets/${outputName}.png`);
  process.exit(0);
}

run(
  python,
  [
    '-m', 'manim',
    '-r', '1920,1080',
    '--fps', '30',
    '--disable_caching',
    '--media_dir', mediaDir,
    '--format', 'mp4',
    '-o', `${outputName}.mp4`,
    sceneFile,
    sceneName,
  ],
  `Manim render ${sceneName} (1920x1080 @30fps)`,
);

const rendered = newestMatching(mediaDir, (name) => name === `${outputName}.mp4`);
if (!rendered) die(`rendered video was not produced for ${outputName}`);

mkdirSync(assetsDir, { recursive: true });
const mp4 = join(assetsDir, `${outputName}.mp4`);
const webm = join(assetsDir, `${outputName}.webm`);
const poster = join(assetsDir, `${outputName}-poster.webp`);

copyFileSync(rendered, mp4);

const ffmpeg = resolveFfmpeg();
run(
  ffmpeg,
  ['-y', '-loglevel', 'error', '-i', mp4, '-c:v', 'libvpx-vp9', '-crf', '32', '-b:v', '0', '-an', webm],
  'WebM (VP9)',
);
run(
  ffmpeg,
  [
    '-y', '-loglevel', 'error',
    '-ss', '00:00:02',
    '-i', mp4,
    '-frames:v', '1',
    '-c:v', 'libwebp',
    '-quality', '85',
    poster,
  ],
  'Poster (WebP)',
);

console.log('\n✔ published media');
console.log(`  article : src/content/docs/posts/${slug}/`);
console.log(`  mp4     : public/media/${slug}/${outputName}.mp4`);
console.log(`  webm    : public/media/${slug}/${outputName}.webm`);
console.log(`  poster  : public/media/${slug}/${outputName}-poster.webp`);
console.log(`\n  reference it as /media/${slug}/${outputName}.webm`);
