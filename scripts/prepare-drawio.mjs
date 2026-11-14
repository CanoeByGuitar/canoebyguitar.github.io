import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const contentRoot = path.resolve('src/content');
const markerPattern = /<!-- astro-drawio-metadata: <svg width="[^"]+" height="[^"]+"> -->\r?\n?/i;

async function findDrawioSvgs(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findDrawioSvgs(entryPath);
    return entry.isFile() && entry.name.endsWith('.drawio.svg') ? [entryPath] : [];
  }));

  return files.flat();
}

function parseLength(value) {
  const match = /^([0-9]+(?:\.[0-9]+)?)(?:px)?$/i.exec(value.trim());
  return match?.[1];
}

function getDimensions(source, file) {
  const root = source.match(/<svg\b[\s\S]*?>/i)?.[0];
  if (!root) throw new Error(`${file}: missing <svg> root element`);

  const width = root.match(/\bwidth=(['"])(.*?)\1/i)?.[2];
  const height = root.match(/\bheight=(['"])(.*?)\1/i)?.[2];
  const parsedWidth = width && parseLength(width);
  const parsedHeight = height && parseLength(height);
  if (parsedWidth && parsedHeight) return [parsedWidth, parsedHeight];

  const viewBox = root.match(/\bviewBox=(['"])(.*?)\1/i)?.[2]?.trim().split(/[ ,]+/).map(Number);
  if (viewBox?.length === 4 && viewBox.every(Number.isFinite) && viewBox[2] > 0 && viewBox[3] > 0) {
    return [String(viewBox[2]), String(viewBox[3])];
  }

  throw new Error(`${file}: could not determine numeric width and height from the SVG root`);
}

function addMetadataHint(source, width, height) {
  const hint = `<!-- astro-drawio-metadata: <svg width="${width}" height="${height}"> -->\n`;
  const cleanSource = source.replace(markerPattern, '');
  const declaration = cleanSource.match(/^(?:\uFEFF)?<\?xml[^?]*\?>\r?\n?/i);

  if (!declaration) return hint + cleanSource;
  return declaration[0] + hint + cleanSource.slice(declaration[0].length);
}

const files = await findDrawioSvgs(contentRoot);
let updated = 0;

for (const file of files) {
  const source = await readFile(file, 'utf8');
  const [width, height] = getDimensions(source, file);
  const prepared = addMetadataHint(source, width, height);
  if (prepared !== source) {
    await writeFile(file, prepared);
    updated += 1;
    console.log(`[drawio] prepared ${path.relative(process.cwd(), file)} (${width}×${height})`);
  }
}

if (files.length > 0 && updated === 0) {
  console.log(`[drawio] ${files.length} editable SVG file(s) already prepared`);
}
