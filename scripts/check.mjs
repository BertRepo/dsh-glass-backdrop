/** 离线契约与打包前检查 / Offline checks; not a real DSH render test. */
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { buildClient } from '../build.mjs';
const root = new URL('../', import.meta.url);
const text = (name) => readFile(new URL(name, root), 'utf8');
const manifest = JSON.parse(await text('package.json'));
assert.equal(manifest.name, 'dsh-glass-backdrop');
assert.equal(manifest.license, 'MIT');
for (const key of ['install', 'preinstall', 'postinstall', 'prepare', 'prepack', 'prepublish', 'prepublishOnly']) assert.equal(manifest.scripts[key], undefined, `Consumer lifecycle script ${key}`);
assert.match(await text('cordis.patch.yml'), /id: dsh-glass-backdrop\s+name: dsh-glass-backdrop/);
const source = await text('client.src.js');
const built = await text('client.js');
assert.equal(built, await buildClient(), 'Committed runtime must match source');
assert.equal(await buildClient(), await buildClient(), 'Build is deterministic');
assert.match(built, /data:image\/svg\+xml;base64,/);
assert.doesNotMatch(built, /__DEFAULT_PHOTO__|data:image\/jpeg;base64,|rain-wedding|wedding portrait|婚纱/);
assert.match(source, /blur: 0/);
assert.match(source, /data-scheme="light"\] \.dsg-mist\{display:none\}/);
const embedded = /data:image\/svg\+xml;base64,([^"']+)/.exec(built)[1];
assert.equal(Buffer.from(embedded, 'base64').toString('utf8'), (await text('assets/deep-sea-rain.svg')).replace(/\r\n/g, '\n'));
for (const lang of ['en', 'zh']) {
  const locale = JSON.parse(await text(`locale/${lang}.json`));
  assert.ok(locale.meta.title && locale.meta.description);
}
for (const asset of ['icon.svg', 'assets/deep-sea-rain.svg']) {
  const svg = await text(asset);
  assert.ok(Buffer.byteLength(svg) < 256 * 1024);
  assert.match(svg, /<svg\b/);
  assert.doesNotMatch(svg, /<(?:image|script|foreignObject)\b|(?:href|src)\s*=/i);
}
async function walk(dir = '') {
  const files = [];
  for (const item of await readdir(new URL(dir || '.', root), { withFileTypes: true })) {
    const path = dir + item.name;
    if (item.isDirectory()) files.push(...await walk(path + '/'));
    else files.push(path);
  }
  return files;
}
for (const file of await walk()) {
  assert.doesNotMatch(file, /\.(?:jpe?g|png|webp|gif)$/i, 'No personal raster assets in public output');
  if (/\.(?:js|mjs)$/.test(file)) {
    const checked = spawnSync(process.execPath, ['--check', fileURLToPath(new URL(file, root))], { stdio: 'inherit' });
    assert.equal(checked.status, 0, `Syntax: ${file}`);
  }
}

// 用最小 React / Slot 替身测试交互，不声称真实 DSH 兼容性。
// A tiny React/Slot fixture exercises behavior without installing the plugin.
function fixture(initial, blocked = false) {
  const store = new Map(initial ? [['dsh-glass-backdrop/settings/v1', JSON.stringify(initial)]] : []);
  let module, resized;
  const slots = new Map();
  const React = {
    Component: class {},
    createElement: (type, props, ...children) => ({ type, props: { ...props, children: children.flat() } }),
    useState: (value) => [value, () => {}], useEffect: () => {}, useRef: () => ({ current: null }),
  };
  class Reader { readAsDataURL() { this.result = 'data:image/png;base64,dGVzdA=='; this.onload(); } }
  class Image { constructor() { this.width = 4400; this.height = 2800; } set src(value) { this.onload(); } }
  const storage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, value) => { if (blocked) throw new Error('quota'); store.set(key, value); },
    removeItem: (key) => { if (blocked) throw new Error('blocked'); store.delete(key); },
  };
  const window = { __ModuleLoader__: { load(value) { module = value; } }, localStorage: storage, Image,
    getComputedStyle: () => ({ backgroundColor: '#000', getPropertyValue: () => '', colorScheme: 'dark' }) };
  const document = { body: {}, documentElement: {}, createElement: () => {
    const canvas = { getContext: () => ({ drawImage() {} }), toDataURL: (type, quality) => {
      assert.equal(type, 'image/jpeg'); assert.equal(quality, 0.86);
      resized = [canvas.width, canvas.height]; return 'data:image/jpeg;fixture';
    } }; return canvas;
  } };
  vm.runInNewContext(built, { window, document, navigator: { language: 'en' }, FileReader: Reader, console });
  assert.equal(module.id, manifest.name);
  const plugin = module.factory((name) => { assert.equal(name, 'react'); return React; });
  const cleanups = [];
  plugin.apply({ get: () => undefined, effect: (fn) => cleanups.push(fn()), slots: {
    inject: (_name, callback) => callback(), register: (options, component) => slots.set(options.name, component),
  } });
  assert.deepEqual([...slots.keys()], ['shell.overlay', 'settings.section']);
  function render(node) {
    if (!node || typeof node !== 'object') return node;
    if (Array.isArray(node)) return node.flatMap((child) => render(child));
    if (typeof node.type === 'function') {
      if (node.type.prototype?.render) return render(node.props.children);
      return render(node.type(node.props));
    }
    return { ...node, props: { ...node.props, children: node.props.children.flatMap((child) => render(child)) } };
  }
  function nodes(node) {
    if (Array.isArray(node)) return node.flatMap(nodes);
    return !node || typeof node !== 'object' ? [] : [node, ...(node.props?.children || []).flatMap(nodes)];
  }
  const page = () => nodes(render(React.createElement(slots.get('settings.section'), {})));
  const click = (label) => { const button = page().find((n) => n.type === 'button' && n.props.children.includes(label)); assert.ok(button, label); button.props.onClick(); };
  const saved = () => JSON.parse(store.get('dsh-glass-backdrop/settings/v1') || 'null');
  return { store, saved, page, click, backdrop: () => render(React.createElement(slots.get('shell.overlay'), {})),
    upload: () => page().find((n) => n.type === 'input' && n.props.type === 'file').props.onChange({ target: { files: [{ type: 'image/png', name: 'fixture.png' }], value: '' } }),
    resized: () => resized, dispose: () => cleanups.forEach((fn) => fn?.()) };
}
const ui = fixture();
assert.ok(ui.backdrop().some((n) => n?.props?.className === 'dsw-root'));
assert.ok(ui.backdrop()[0].props.children.some((n) => n?.props?.className === 'dsw-whale'), 'Default scene is whale');
ui.click('Photo · wet glass');
assert.equal(ui.saved().mode, 'photo');
const sliders = ui.page().filter((n) => n.type === 'input' && n.props.type === 'range');
assert.equal(sliders[1].props.value, 0, 'Blur defaults to 0');
sliders[1].props.onChange({ target: { value: '3' } });
assert.equal(ui.saved().blur, 3);
ui.upload();
assert.deepEqual(ui.resized(), [2200, 1400]);
assert.equal(ui.saved().customName, 'fixture.png');
ui.click('Use the default image');
assert.equal(ui.saved().custom, '');
ui.click('Off');
assert.equal(ui.backdrop(), null);
ui.click('Clear all plugin data');
assert.equal(ui.saved(), null);
assert.equal(ui.store.size, 0);
ui.dispose();
const quota = fixture(undefined, true);
assert.doesNotThrow(() => quota.upload());
assert.equal(quota.saved(), null);
assert.doesNotThrow(() => quota.click('Clear all plugin data'));
quota.dispose();
console.log('PASS: syntax, manifest, original assets, source/runtime equality, determinism, overlay/settings fixture, blur0, image resize/reset, off, storage quota and clear');
console.log('client.js SHA256 ' + createHash('sha256').update(built).digest('hex'));
