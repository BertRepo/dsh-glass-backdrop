/** 构建公开客户端 / Build the public client with its original SVG only. */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const here = new URL('.', import.meta.url);
const placeholder = "'__DEFAULT_PHOTO__'";
export async function buildClient() {
  const source = (await readFile(new URL('client.src.js', here), 'utf8')).replace(/\r\n/g, '\n');
  const asset = (await readFile(new URL('assets/deep-sea-rain.svg', here), 'utf8')).replace(/\r\n/g, '\n');
  if (source.split(placeholder).length !== 2) throw new Error('Expected exactly one default-image placeholder');
  if (!asset.startsWith('<svg ') || /<(?:image|script|foreignObject)\b|(?:href|src)\s*=/i.test(asset)) throw new Error('Default must be a self-contained original SVG');
  const dataUrl = 'data:image/svg+xml;base64,' + Buffer.from(asset, 'utf8').toString('base64');
  return source.replace(placeholder, JSON.stringify(dataUrl));
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const built = await buildClient();
  await writeFile(new URL('client.js', here), built, 'utf8');
  console.log(`Built client.js (${Buffer.byteLength(built)} bytes; original SVG, image/svg+xml)`);
}
