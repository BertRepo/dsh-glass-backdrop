/** 验证真实 npm tgz 内容 / Verify actual npm tarball, without extra packages. */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const archive = process.argv[2] || `${manifest.name}-${manifest.version}.tgz`;
const compressed = await readFile(archive);
const tar = gunzipSync(compressed);
const files = new Map();
const field = (header, start, length) => header.subarray(start, start + length).toString('utf8').replace(/\0.*$/s, '');
for (let offset = 0; offset + 512 <= tar.length;) {
  const header = tar.subarray(offset, offset + 512);
  if (header.every((byte) => byte === 0)) break;
  const size = parseInt(field(header, 124, 12).trim(), 8);
  const name = field(header, 0, 100);
  const prefix = field(header, 345, 155);
  const path = prefix ? `${prefix}/${name}` : name;
  assert.ok(Number.isSafeInteger(size) && size >= 0);
  assert.ok(['', '0'].includes(field(header, 156, 1)), `Only regular files allowed: ${path}`);
  assert.ok(path.startsWith('package/') && !path.includes('..') && !path.includes('\\'));
  assert.ok(!files.has(path), `Duplicate ${path}`);
  let checksum = 0;
  for (let i = 0; i < 512; i++) checksum += i >= 148 && i < 156 ? 32 : header[i];
  assert.equal(checksum, parseInt(field(header, 148, 8).trim(), 8), 'TAR checksum');
  assert.ok(offset + 512 + size <= tar.length);
  files.set(path, tar.subarray(offset + 512, offset + 512 + size));
  offset += 512 + Math.ceil(size / 512) * 512;
}
const expected = [
  'package.json', 'index.js', 'client.js', 'client.src.js', 'build.mjs', 'cordis.patch.yml',
  'locale/en.json', 'locale/zh.json', 'icon.svg', 'assets/deep-sea-rain.svg',
  'README.md', 'LICENSE', 'ATTRIBUTION.md', 'scripts/check.mjs', 'scripts/verify-pack.mjs',
];
assert.deepEqual([...files.keys()].sort(), expected.map((name) => 'package/' + name).sort(), 'Exact package allowlist');
for (const name of expected) {
  assert.deepEqual(files.get('package/' + name), await readFile(new URL(name, root)), `Packaged bytes: ${name}`);
  if (/\.(?:js|svg|json)$/.test(name)) assert.doesNotMatch(files.get('package/' + name).toString('utf8'), /rain-wedding|data:image\/jpeg;base64,|wedding portrait|婚纱/);
}
const built = files.get('package/client.js').toString('utf8');
const embedded = /data:image\/svg\+xml;base64,([^"']+)/.exec(built);
assert.ok(embedded, 'Runtime embeds SVG with correct MIME');
assert.deepEqual(Buffer.from(embedded[1], 'base64'), files.get('package/assets/deep-sea-rain.svg'));
console.log(`PASS: ${archive}: ${files.size} allowlisted regular files, exact source/runtime bytes, original SVG only`);
console.log('tgz SHA256 ' + createHash('sha256').update(compressed).digest('hex'));
