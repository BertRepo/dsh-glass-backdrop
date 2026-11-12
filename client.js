/**
 * 原创深海 / 雨玻璃装饰；public source, MIT © BertRepo 2026.
 * A translucent click-through shell.overlay decoration, not a true UI background.
 *
 * Two switchable looks, both rendered into `shell.overlay` (the click-through
 * frame layer), plus one settings page that writes the shared state:
 *
 *  - `photo`: a photograph seen through wet glass - a blurred, dimmed plate
 *    with grain, sheen and rain drops that stick, shimmer and slide, tuned by
 *    the strength / blur / rain sliders.
 *  - `whale`: the deep-sea scene (god rays, a breaching whale, bubbles).
 *
 * The bundled original abstract SVG is spliced in as a data URL by build.mjs;
 * a picture the user picks is downscaled in the browser and kept in
 * localStorage, so it survives a reload without writing a separate file.
 * The decoration is pointer-events:none and aria-hidden; settings remain interactive.
 */
window.__ModuleLoader__.load({
  id: 'dsh-glass-backdrop',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /* ------------------------------------------------------------------ *
     * Shared state
     * ------------------------------------------------------------------ */

    const STORE_KEY = 'dsh-glass-backdrop/settings/v1';
    // 原创抽象深海 SVG，由 build.mjs 以内联 data URL 嵌入。
    // Original abstract deep-sea SVG, embedded by build.mjs.
    const DEFAULT_PHOTO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEyMDAiIHZpZXdCb3g9IjAgMCAxOTIwIDEyMDAiIHJvbGU9ImltZyIgYXJpYS1sYWJlbD0iT3JpZ2luYWwgYWJzdHJhY3QgZGVlcCBzZWEgd2l0aCBjeWFuIGN1cnJlbnRzIGFuZCByYWluIj4KICA8IS0tIOWOn+WIm+aKveixoea3sea1tyAvIE9yaWdpbmFsIGdlbmVyYXRlZCBhcnR3b3JrLiBNSVQgwqkgMjAyNiBCZXJ0UmVwby4gLS0+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImRlcHRoIiB4Mj0iMC4yIiB5Mj0iMSI+PHN0b3Agc3RvcC1jb2xvcj0iIzE2M2U1OSIvPjxzdG9wIG9mZnNldD0iLjQ4IiBzdG9wLWNvbG9yPSIjMGIyNjNlIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDMwZTIwIi8+PC9saW5lYXJHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iY3VycmVudCIgY3g9Ii42OCIgY3k9Ii4xNSIgcj0iLjgiPjxzdG9wIHN0b3AtY29sb3I9IiM1MmI5Y2EiIHN0b3Atb3BhY2l0eT0iLjQ1Ii8+PHN0b3Agb2Zmc2V0PSIuNTUiIHN0b3AtY29sb3I9IiMyMzc2OGYiIHN0b3Atb3BhY2l0eT0iLjEzIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDUyMDM3IiBzdG9wLW9wYWNpdHk9IjAiLz48L3JhZGlhbEdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJyYXkiIHgyPSIuMyIgeTI9IjEiPjxzdG9wIHN0b3AtY29sb3I9IiNhNWU5ZTIiIHN0b3Atb3BhY2l0eT0iLjE4Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNDFhOWMzIiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJyYWluIiB4Mj0iMCIgeTI9IjEiPjxzdG9wIHN0b3AtY29sb3I9IiNiNmU5ZWYiIHN0b3Atb3BhY2l0eT0iMCIvPjxzdG9wIG9mZnNldD0iLjciIHN0b3AtY29sb3I9IiM5ZmRiZWQiIHN0b3Atb3BhY2l0eT0iLjMiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM0ZDkxYjAiIHN0b3Atb3BhY2l0eT0iMCIvPjwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEyMDAiIGZpbGw9InVybCgjZGVwdGgpIi8+CiAgPHJlY3Qgd2lkdGg9IjE5MjAiIGhlaWdodD0iMTIwMCIgZmlsbD0idXJsKCNjdXJyZW50KSIvPgogIDxnIGZpbGw9InVybCgjcmF5KSI+PHBhdGggZD0iTTE4MCAwSDM1MEwxMDYwIDEyMDBIODAwWiIvPjxwYXRoIGQ9Ik03MjAgMEg3OTBMMTQwMCAxMjAwSDEyMzBaIi8+PHBhdGggZD0iTTExMDAgMEgxMjcwTDE4NTAgMTIwMEgxNjAwWiIvPjwvZz4KICA8ZyBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiPgogICAgPHBhdGggZD0iTS0xMDAgODUwQzMwMCA1ODAgNjYwIDEwNTAgMTEwMCA3MTBTMTcwMCA1MjAgMjAyMCA3MjAiIHN0cm9rZT0iIzNjOWNiMiIgc3Ryb2tlLW9wYWNpdHk9Ii4xNiIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgICA8cGF0aCBkPSJNLTgwIDkyMEM0MjAgNjYwIDY5MCAxMTAwIDExNzAgODAwUzE3NDAgNjIwIDIwMDAgNzcwIiBzdHJva2U9IiM1YWM1YmYiIHN0cm9rZS1vcGFjaXR5PSIuMTMiIHN0cm9rZS13aWR0aD0iMiIvPgogICAgPHBhdGggZD0iTS0xMDAgMTA1MEMzMTAgODMwIDc4MCAxMTUwIDEzMDAgOTIwUzE3MjAgODAwIDIwNDAgOTAwIiBzdHJva2U9IiM0Njk0YmIiIHN0cm9rZS1vcGFjaXR5PSIuMTUiIHN0cm9rZS13aWR0aD0iNiIvPgogICAgPGcgc3Ryb2tlPSJ1cmwoI3JhaW4pIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xNDAgNzB2MTgwbTE3MCAyOTB2MTI1bTI0MC01MzB2MjIwbTI4MCAxMDB2MjQwbTE5MC02MzB2MTgwbTE4MCA0MTB2MTUwbTIxMC0zNTB2MjEwbTIyMCAxOTB2MjQwbS0xNDEwIDE1MHYxNDBtMTQ4MC04NTB2MTYwIi8+PC9nPgogIDwvZz4KICA8ZyBmaWxsPSIjYjhlZGYxIiBvcGFjaXR5PSIuMjYiPjxjaXJjbGUgY3g9IjI2NSIgY3k9IjM4MCIgcj0iMiIvPjxjaXJjbGUgY3g9IjU2MCIgY3k9Ijc3MCIgcj0iMyIvPjxjaXJjbGUgY3g9IjgzMCIgY3k9IjQwMCIgcj0iMiIvPjxjaXJjbGUgY3g9IjExOTAiIGN5PSI4OTAiIHI9IjIiLz48Y2lyY2xlIGN4PSIxNTEwIiBjeT0iMzgwIiByPSIzIi8+PGNpcmNsZSBjeD0iMTcxNSIgY3k9Ijc0MCIgcj0iMiIvPjxjaXJjbGUgY3g9Ijk4MCIgY3k9IjE5MCIgcj0iMiIvPjwvZz4KPC9zdmc+Cg==";
    const DEFAULTS = {
      mode: 'whale',
      custom: '',
      customName: '',
      schemeMode: 'auto',
      blur: 0,
      strength: null,
      rain: 0.6,
    };

    /** Fixed internal grade: the plate is a veil over the live UI, so its
     *  highlights are pulled down before the strength factor applies. */
    const PLATE_DIM = 0.4;
    const PHOTO_BRIGHTNESS = 0.66;

    const listeners = new Set();
    let localeTranslate = (key) => key;

    function readState() {
      try {
        const raw = window.localStorage.getItem(STORE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') return Object.assign({}, DEFAULTS, parsed);
        }
      } catch (error) {
        /* a corrupt or blocked store falls back to the defaults */
      }
      return Object.assign({}, DEFAULTS);
    }

    let state = readState();

    function notify() {
      listeners.forEach((fn) => {
        try {
          fn();
        } catch (error) {
          /* one broken consumer must not stop the rest */
        }
      });
    }

    /** Merge a patch, persist it, and fan out one change. Returns persistence success. */
    function commit(patch) {
      state = Object.assign({}, state, patch);
      let persisted = true;
      try {
        window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
      } catch (error) {
        persisted = false;
      }
      notify();
      return persisted;
    }

    function useSettings() {
      const [, bump] = React.useState(0);
      React.useEffect(() => {
        const fn = () => bump((n) => n + 1);
        listeners.add(fn);
        return () => {
          listeners.delete(fn);
        };
      }, []);
      return state;
    }

    /* ------------------------------------------------------------------ *
     * Copy
     * ------------------------------------------------------------------ */

    const DICT = {
      zh: {
        'section.label': '背景',
        'page.title': '背景',
        'page.subtitle': '点击穿透的半透明覆盖层；并非真正位于界面后方，背景过浓可能降低文字对比度。',
        'mode.title': '样式',
        'mode.photo': '照片 · 玻璃雨滴',
        'mode.whale': '深海鲸鱼',
        'mode.off': '关闭',
        'scheme.title': '明暗适配',
        'scheme.auto': '跟随界面',
        'scheme.light': '浅色',
        'scheme.dark': '深色',
        'scheme.hint': '自动适配界面明暗；没有白色雾层。若文字不够清楚，请降低背景浓度或关闭背景。',
        'image.title': '背景图片',
        'image.default': '默认：原创抽象深海',
        'image.custom': '自定义图片',
        'image.pick': '选择图片…',
        'image.reset': '恢复默认图片',
        'image.clear': '清除本插件所有数据',
        'note.cleared': '已清除图片和设置，恢复默认鲸鱼。',
        'note.clearFailed': '浏览器拒绝清除存储；请通过浏览器站点数据设置清除。',
        'image.hint': '选择的图片会在浏览器里压缩后保存在本机，刷新后仍然有效；不会上传到任何地方。',
        'slider.blur': '玻璃模糊',
        'slider.strength': '背景浓度',
        'slider.rain': '雨滴密度',
        'note.applied': '已应用。',
        'note.reset': '已恢复默认图片。',
        'note.tooBig': '图片太大，浏览器存不下，请换一张更小的。',
        'note.badFile': '这个文件读不出来，请选择图片。',
      },
      en: {
        'section.label': 'Backdrop',
        'page.title': 'Backdrop',
        'page.subtitle': 'A translucent, click-through overlay, not a true background behind the UI. High density may reduce text contrast.',
        'mode.title': 'Style',
        'mode.photo': 'Photo · wet glass',
        'mode.whale': 'Deep-sea whale',
        'mode.off': 'Off',
        'scheme.title': 'Colour scheme',
        'scheme.auto': 'Match UI',
        'scheme.light': 'Light',
        'scheme.dark': 'Dark',
        'scheme.hint': 'Match the UI scheme automatically; no white fog layer is added. Reduce density or turn the backdrop off if text becomes hard to read.',
        'image.title': 'Image',
        'image.default': 'Default: original abstract deep sea',
        'image.custom': 'Custom image',
        'image.pick': 'Choose image…',
        'image.reset': 'Use the default image',
        'image.clear': 'Clear all plugin data',
        'note.cleared': 'Image and settings cleared; default whale restored.',
        'note.clearFailed': 'Browser storage could not be cleared; use browser site-data settings.',
        'image.hint': 'A chosen picture is downscaled and stored in this browser only; it survives a reload and is never uploaded.',
        'slider.blur': 'Glass blur',
        'slider.strength': 'Density',
        'slider.rain': 'Rain',
        'note.applied': 'Applied.',
        'note.reset': 'Default image restored.',
        'note.tooBig': 'That image is too large for the browser store; try a smaller one.',
        'note.badFile': 'That file could not be read; pick an image.',
      },
    };

    /* ------------------------------------------------------------------ *
     * Styles
     * ------------------------------------------------------------------ */

    /** Parse a CSS colour into { r, g, b, a } (alpha 1 when omitted). */
    function parseColour(text) {
      const raw = String(text || '').trim();
      if (!raw || raw === 'transparent') return null;
      let match = /^#([0-9a-f]{3})$/i.exec(raw);
      if (match) {
        const h = match[1];
        return { r: parseInt(h[0] + h[0], 16), g: parseInt(h[1] + h[1], 16), b: parseInt(h[2] + h[2], 16), a: 1 };
      }
      match = /^#([0-9a-f]{6})$/i.exec(raw);
      if (match) {
        const h = match[1];
        return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 };
      }
      match = /^rgba?\(([^)]+)\)$/i.exec(raw);
      if (match) {
        const parts = match[1].split(/[,\s/]+/).filter(Boolean).map(Number);
        if (parts.length >= 3 && parts.slice(0, 3).every((n) => typeof n === 'number' && !isNaN(n))) {
          return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
        }
      }
      return null;
    }

    function luminanceOf(colour) {
      return (0.2126 * colour.r + 0.7152 * colour.g + 0.0722 * colour.b) / 255;
    }

    /**
     * Which way the plate washes. The live page background is the honest
     * signal (a theme can keep its tokens on a scoped element), so it is read
     * first, then the tokens, then `color-scheme`.
     */
    function themeScheme() {
      try {
        const painted = [document.body, document.documentElement];
        for (let i = 0; i < painted.length; i += 1) {
          const element = painted[i];
          if (!element) continue;
          const background = parseColour(window.getComputedStyle(element).backgroundColor);
          if (background && background.a > 0.2) {
            return luminanceOf(background) > 0.5 ? 'light' : 'dark';
          }
        }
        const root = window.getComputedStyle(document.documentElement);
        const tokens = ['--dsw-alias-bg-base', '--dsw-alias-bg-layer-1', '--dsw-alias-label-primary'];
        for (let i = 0; i < tokens.length; i += 1) {
          const colour = parseColour(root.getPropertyValue(tokens[i]));
          if (colour) return luminanceOf(colour) > 0.5 ? 'light' : 'dark';
        }
        const scheme = String(root.colorScheme || '');
        if (scheme.indexOf('dark') >= 0) return 'dark';
        if (scheme.indexOf('light') >= 0) return 'light';
      } catch (error) {
        /* fall through */
      }
      return 'dark';
    }

    /** The user's explicit choice wins over detection. */
    function resolveScheme(settings) {
      const mode = settings && settings.schemeMode;
      if (mode === 'light' || mode === 'dark') return mode;
      return themeScheme();
    }

    /**
     * Translate one key. The locale service is authoritative; when it has no
     * dictionary yet (or returns the key itself) this falls back to the packed
     * dictionary, so the panel never renders raw keys.
     */
    function T(key) {
      try {
        const value = localeTranslate(key);
        if (value && value !== key) return value;
      } catch (error) {
        /* fall through to the packed dictionary */
      }
      let language = 'zh';
      try {
        const list = navigator.languages;
        language = String((list && list.length ? list[0] : navigator.language) || 'zh');
      } catch (error) {
        language = 'zh';
      }
      const dict = language.toLowerCase().indexOf('zh') === 0 ? DICT.zh : DICT.en;
      return dict[key] || DICT.en[key] || key;
    }

    const CSS = `
.dsw-root{position:fixed;inset:0;overflow:hidden;pointer-events:none;contain:strict;z-index:0}
.dsw-layer{position:absolute;inset:0;pointer-events:none}
.dsg-plate{position:absolute;inset:0}
.dsw-root[data-scheme="light"] .dsg-scrim{display:none}
.dsw-root[data-scheme="light"] .dsg-sheen{background:linear-gradient(104deg,rgba(255,255,255,0) 22%,rgba(255,255,255,.26) 36%,rgba(255,255,255,.06) 47%,rgba(255,255,255,.16) 60%,rgba(255,255,255,0) 74%)}
.dsw-root[data-scheme="light"] .dsg-mist{display:none}
.dsw-root[data-scheme="light"] .dsg-vignette{background:radial-gradient(ellipse 92% 84% at 50% 42%,rgba(0,0,0,0) 45%,rgba(48,64,86,.06) 82%,rgba(32,46,64,.12) 100%)}
.dsw-root[data-scheme="light"] .dsg-drop{background:radial-gradient(circle at 32% 27%,rgba(255,255,255,.98) 0%,rgba(158,182,203,.45) 22%,rgba(120,150,175,.18) 46%,rgba(120,150,175,0) 66%),radial-gradient(circle at 72% 78%,rgba(92,122,152,.3),rgba(92,122,152,0) 62%);box-shadow:inset -1px -2px 4px rgba(255,255,255,.8),inset 1px 2px 5px rgba(42,62,88,.35),0 2px 6px rgba(42,62,88,.2)}
.dsw-root[data-scheme="light"] .dsg-drop--run::after{background:linear-gradient(180deg,rgba(92,118,144,.32),rgba(92,118,144,0))}

/* ---- photograph behind wet glass ---- */
.dsg-photo{position:absolute;inset:-8%;background-position:center;background-size:cover;background-repeat:no-repeat;will-change:filter}
.dsg-scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,13,22,.88) 0%,rgba(4,10,17,.82) 42%,rgba(3,7,13,.9) 100%)}
.dsg-glass{position:absolute;inset:0;opacity:.055;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E");background-size:180px 180px}
.dsg-sheen{position:absolute;inset:0;background:linear-gradient(104deg,rgba(205,232,255,0) 20%,rgba(205,232,255,.10) 34%,rgba(255,255,255,.02) 45%,rgba(180,215,255,.07) 59%,rgba(255,255,255,0) 72%)}
.dsg-mist{position:absolute;left:0;right:0;bottom:0;height:30vh;background:linear-gradient(180deg,rgba(10,22,36,0),rgba(7,15,26,.5))}
.dsg-vignette{position:absolute;inset:0;background:radial-gradient(ellipse 92% 84% at 50% 42%,rgba(0,0,0,0) 42%,rgba(0,4,10,.32) 82%,rgba(0,3,8,.5) 100%)}
.dsg-drops{position:absolute;inset:0;overflow:hidden}
.dsg-drop{position:absolute;border-radius:50%;background:radial-gradient(circle at 32% 27%,rgba(255,255,255,.95) 0%,rgba(255,255,255,.42) 18%,rgba(255,255,255,.06) 42%,rgba(255,255,255,0) 62%),radial-gradient(circle at 72% 78%,rgba(170,215,255,.35),rgba(170,215,255,0) 62%);box-shadow:inset -1px -2px 4px rgba(255,255,255,.3),inset 1px 2px 5px rgba(4,14,26,.45),0 2px 7px rgba(0,8,18,.35);animation-name:dsg-shimmer;animation-timing-function:ease-in-out;animation-iteration-count:infinite}
@keyframes dsg-shimmer{0%,100%{opacity:.72;transform:scale(1)}50%{opacity:1;transform:scale(1.07)}}
.dsg-drop--run{top:-12vh;animation-name:dsg-run;animation-timing-function:cubic-bezier(.42,0,.58,1)}
.dsg-drop--run::after{content:'';position:absolute;left:50%;top:96%;width:1px;height:48px;margin-left:-.5px;background:linear-gradient(180deg,rgba(214,238,255,.3),rgba(214,238,255,0));filter:blur(.4px)}
@keyframes dsg-run{0%{transform:translate3d(0,0,0) scaleY(.9);opacity:0}8%{opacity:.9}52%{transform:translate3d(6px,56vh,0) scaleY(1.15)}92%{opacity:.85}100%{transform:translate3d(2px,120vh,0) scaleY(1.3);opacity:0}}

/* ---- settings page ---- */
.dsx{display:flex;flex-direction:column;gap:20px;padding:2px;max-width:640px;color:var(--dsw-alias-label-primary);font-size:13px}
.dsx-title{font-size:15px;font-weight:600;letter-spacing:.01em}
.dsx-row{display:flex;flex-direction:column;gap:8px}
.dsx-label{display:flex;gap:8px;align-items:baseline;color:var(--dsw-alias-label-secondary);font-size:12px}
.dsx-val{color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}
.dsx-seg{display:inline-flex;width:fit-content;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;overflow:hidden}
.dsx-seg button{all:unset;cursor:pointer;padding:7px 15px;font-size:13px;color:var(--dsw-alias-label-secondary)}
.dsx-seg button:hover{color:var(--dsw-alias-label-primary)}
.dsx-seg button[data-on="1"]{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.dsx-inline{display:flex;gap:14px;align-items:flex-start}
.dsx-col{display:flex;flex-direction:column;gap:8px;min-width:0}
.dsx-thumb{width:138px;height:78px;flex:none;border-radius:10px;border:1px solid var(--dsw-alias-border-l1);background-size:cover;background-position:center;background-color:var(--dsw-alias-bg-layer-1)}
.dsx-name{font-size:12px;color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:340px}
.dsx-actions{display:flex;gap:8px;flex-wrap:wrap}
.dsx-btn{cursor:pointer;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:9px;padding:6px 13px;font-size:12px;line-height:1.5}
.dsx-btn:hover{border-color:var(--dsw-alias-border-l2)}
.dsx-btn[disabled]{opacity:.45;cursor:default}
.dsx-slider{width:100%;max-width:380px;accent-color:var(--dsw-alias-brand-primary);cursor:pointer}
.dsx-hint{font-size:12px;line-height:1.65;color:var(--dsw-alias-label-secondary)}
.dsx-note{font-size:12px;color:var(--dsw-alias-state-success-primary)}
.dsx-note[data-bad="1"]{color:var(--dsw-alias-state-error-primary)}

/* ---- deep-sea whale ---- */
.dsw-deep{background:linear-gradient(180deg,rgba(2,10,22,0.04) 0%,rgba(4,20,38,0.10) 32%,rgba(5,28,52,0.18) 62%,rgba(2,12,26,0.30) 100%)}
.dsw-surface{top:0;height:26vh;background:linear-gradient(180deg,rgba(96,206,255,0.13) 0%,rgba(96,206,255,0.03) 45%,rgba(0,0,0,0) 100%)}
.dsw-glow{background:radial-gradient(ellipse 62% 52% at 52% 0%,rgba(80,190,255,0.15),rgba(80,190,255,0.04) 55%,rgba(0,0,0,0) 100%)}
.dsw-halo{left:10%;top:-10%;width:84vw;height:62vh;background:radial-gradient(ellipse at 58% 38%,rgba(52,150,210,0.18),rgba(20,80,130,0.06) 52%,rgba(0,0,0,0) 74%)}
.dsw-vignette{background:radial-gradient(ellipse 88% 78% at 50% 42%,rgba(0,0,0,0) 40%,rgba(0,5,14,0.24) 78%,rgba(0,4,12,0.38) 100%)}
.dsw-shafts{position:absolute;left:-8%;top:-14%;width:116%;height:120%}
.dsw-shafts svg{width:100%;height:100%;display:block}
.dsw-ray{animation-name:dsw-ray-breathe;animation-timing-function:ease-in-out;animation-iteration-count:infinite}
@keyframes dsw-ray-breathe{0%,100%{opacity:0.32}50%{opacity:0.9}}
.dsw-whale{position:absolute;left:30%;top:0%;width:min(56vw,820px);transform-origin:50% 50%;animation:dsw-breach 46s cubic-bezier(0.42,0,0.58,1) infinite;will-change:transform,opacity}
.dsw-whale svg,.dsw-far svg{width:100%;height:auto;aspect-ratio:1020 / 470;display:block}
@keyframes dsw-breach{
0%{transform:translate3d(-3%,7%,0) rotate(-18deg);opacity:0}
9%{opacity:1}
36%{transform:translate3d(-1%,2%,0) rotate(-11deg)}
60%{transform:translate3d(1%,-1%,0) rotate(-6deg)}
84%{opacity:1}
100%{transform:translate3d(3%,6%,0) rotate(2deg);opacity:0}
}
.dsw-far{position:absolute;left:3%;top:68%;width:min(26vw,340px);opacity:0.55;animation:dsw-drift 68s ease-in-out infinite;will-change:transform}
@keyframes dsw-drift{0%,100%{transform:translate3d(0,0,0) rotate(6deg)}50%{transform:translate3d(6vw,-3vh,0) rotate(13deg)}}
.dsw-b{position:absolute;border-radius:50%;background:radial-gradient(circle at 34% 30%,rgba(210,248,255,0.7),rgba(120,200,240,0.2) 52%,rgba(90,170,220,0) 74%);box-shadow:inset 0 0 6px rgba(180,235,255,0.3);animation-name:dsw-rise;animation-timing-function:linear;animation-iteration-count:infinite}
@keyframes dsw-rise{0%{transform:translate3d(0,0,0) scale(0.65);opacity:0}12%{opacity:0.6}70%{opacity:0.42}100%{transform:translate3d(2.2vw,-94vh,0) scale(1.1);opacity:0}}
.dsw-p{position:absolute;border-radius:50%;background:rgba(150,225,255,0.6);animation:dsw-twinkle 7s ease-in-out infinite}
@keyframes dsw-twinkle{0%,100%{opacity:0.06;transform:scale(0.8)}50%{opacity:0.42;transform:scale(1.2)}}
@media (prefers-reduced-motion: reduce){
.dsw-root *{animation:none !important}
.dsw-whale{opacity:0.95;transform:none}
}
`;

    /* ------------------------------------------------------------------ *
     * Rain
     * ------------------------------------------------------------------ */

    function mulberry32(seed) {
      let a = seed >>> 0;
      return function random() {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    const DROPS = (() => {
      const random = mulberry32(20261030);
      const out = [];
      for (let i = 0; i < 96; i += 1) {
        const kind = random();
        const size = kind < 0.7 ? 2 + random() * 4 : kind < 0.93 ? 6 + random() * 8 : 15 + random() * 15;
        const running = kind > 0.8;
        out.push({
          x: random() * 100,
          y: random() * 100,
          size,
          opacity: 0.26 + random() * 0.55,
          running,
          duration: running ? 9 + random() * 16 : 7 + random() * 9,
          delay: -random() * 24,
          rank: random(),
        });
      }
      return out;
    })();

    function renderDrops(density) {
      const shown = DROPS.filter((drop) => drop.rank <= density);
      return shown.map((drop, index) =>
        h('span', {
          key: 'd' + index,
          className: 'dsg-drop' + (drop.running ? ' dsg-drop--run' : ''),
          style: {
            left: drop.x.toFixed(2) + '%',
            top: drop.running ? undefined : drop.y.toFixed(2) + '%',
            width: drop.size.toFixed(1) + 'px',
            height: drop.running ? (drop.size * 1.35).toFixed(1) + 'px' : drop.size.toFixed(1) + 'px',
            opacity: drop.opacity.toFixed(2),
            animationDuration: drop.duration.toFixed(1) + 's',
            animationDelay: drop.delay.toFixed(1) + 's',
          },
        }),
      );
    }

    /* ------------------------------------------------------------------ *
     * Photograph backdrop
     * ------------------------------------------------------------------ */

    function PhotoScene({ settings }) {
      const source = settings.custom ? settings.custom : DEFAULT_PHOTO;
      const blur = Math.max(0, Math.min(14, Number(settings.blur) || 0));
      const scheme = resolveScheme(settings);
      const light = scheme === 'light';
      const strength = settings.strength == null
        ? (light ? 0.32 : 0.5)
        : Math.max(0.1, Math.min(0.95, Number(settings.strength) || 0));
      const brightness = light ? 0.98 : PHOTO_BRIGHTNESS;
      const scrim = light ? 0 : PLATE_DIM;
      return h('div', { className: 'dsw-root', 'data-scheme': scheme, 'aria-hidden': 'true' }, [
        h('style', { key: 'css' }, CSS),
        h('div', {
          key: 'plate',
          className: 'dsg-plate',
          style: { opacity: strength.toFixed(3) },
        }, [
          h('div', {
            key: 'photo',
            className: 'dsg-photo',
            style: {
              backgroundImage: 'url("' + source + '")',
              filter: 'blur(' + blur + 'px) brightness(' + brightness + ') saturate(' + (light ? 0.9 : 0.96) + ')',
            },
          }),
          h('div', { key: 'scrim', className: 'dsg-scrim', style: { opacity: scrim } }),
          h('div', { key: 'glass', className: 'dsg-glass' }),
          h('div', { key: 'sheen', className: 'dsg-sheen' }),
          h('div', { key: 'mist', className: 'dsg-mist' }),
        ]),
        h('div', { key: 'drops', className: 'dsg-drops' }, renderDrops(settings.rain)),
        h('div', { key: 'vig', className: 'dsg-vignette' }),
      ]);
    }

    /* ------------------------------------------------------------------ *
     * Deep-sea whale backdrop
     * ------------------------------------------------------------------ */

    const BODY =
      'M 180 218 C 235 200 305 178 385 156 C 480 130 580 112 690 110 ' +
      'C 790 108 878 120 928 148 C 972 172 986 208 956 236 ' +
      'C 900 274 836 304 750 322 C 650 342 540 338 440 318 ' +
      'C 340 298 250 270 182 244 Z';

    const FLUKES =
      'M 184 216 C 158 172 116 138 62 126 C 82 178 118 212 158 236 ' +
      'C 118 262 82 300 60 348 C 118 336 160 302 184 258 Z';

    const DORSAL = 'M 688 110 C 684 96 674 84 658 76 C 668 92 668 102 662 112 Z';

    const FIN =
      'M 618 336 C 612 384 578 424 518 452 C 546 408 560 366 566 328 ' +
      'C 584 326 602 330 618 336 Z';

    const BACK =
      'M 300 196 C 420 158 540 130 660 118 C 760 108 850 116 918 140';

    const GAPE = 'M 944 196 C 916 206 890 212 866 214';

    const PLEATS = [
      'M 900 240 C 866 264 830 280 790 290',
      'M 866 254 C 834 274 800 288 762 298',
      'M 830 266 C 800 282 768 294 734 302',
    ];

    const RAYS = [
      { x: -30, w: 118, d: '0s', dur: '15s' },
      { x: 168, w: 58, d: '-3s', dur: '18s' },
      { x: 352, w: 150, d: '-7s', dur: '16s' },
      { x: 636, w: 78, d: '-2s', dur: '20s' },
      { x: 838, w: 126, d: '-9s', dur: '17s' },
      { x: 1018, w: 54, d: '-5s', dur: '22s' },
    ];

    const BUBBLES = [
      { l: '8%', s: 9, b: -4, d: 0, dur: 24 },
      { l: '14%', s: 5, b: -2, d: 7, dur: 19 },
      { l: '22%', s: 12, b: -8, d: 3, dur: 27 },
      { l: '31%', s: 6, b: -3, d: 12, dur: 21 },
      { l: '44%', s: 10, b: -6, d: 5, dur: 26 },
      { l: '52%', s: 4, b: -2, d: 15, dur: 18 },
      { l: '61%', s: 14, b: -5, d: 1, dur: 30 },
      { l: '68%', s: 7, b: -9, d: 9, dur: 23 },
      { l: '76%', s: 5, b: -3, d: 17, dur: 20 },
      { l: '84%', s: 11, b: -7, d: 4, dur: 28 },
      { l: '91%', s: 6, b: -4, d: 11, dur: 22 },
      { l: '96%', s: 8, b: -6, d: 6, dur: 25 },
    ];

    const PLANKTON = [
      { l: '9%', t: '22%', s: 2, d: '0s' },
      { l: '17%', t: '58%', s: 3, d: '-1.4s' },
      { l: '26%', t: '34%', s: 2, d: '-2.8s' },
      { l: '35%', t: '74%', s: 2, d: '-0.6s' },
      { l: '43%', t: '16%', s: 3, d: '-3.6s' },
      { l: '51%', t: '48%', s: 2, d: '-2.1s' },
      { l: '58%', t: '86%', s: 2, d: '-4.4s' },
      { l: '66%', t: '28%', s: 2, d: '-1.1s' },
      { l: '73%', t: '64%', s: 3, d: '-3.1s' },
      { l: '81%', t: '40%', s: 2, d: '-5.2s' },
      { l: '88%', t: '78%', s: 2, d: '-2.5s' },
      { l: '94%', t: '20%', s: 2, d: '-4.8s' },
    ];

    function shafts() {
      const defs = h(
        'defs',
        { key: 'd' },
        h(
          'linearGradient',
          { id: 'dsw-shaft', x1: '0', y1: '0', x2: '0', y2: '1' },
          h('stop', { offset: '0%', stopColor: '#9fe8ff', stopOpacity: '0.22' }),
          h('stop', { offset: '52%', stopColor: '#63c6ee', stopOpacity: '0.07' }),
          h('stop', { offset: '100%', stopColor: '#3a9dc7', stopOpacity: '0' }),
        ),
      );
      const polys = RAYS.map((r, i) =>
        h('polygon', {
          key: 'r' + i,
          className: 'dsw-ray',
          points:
            r.x + ',-80 ' + (r.x + r.w) + ',-80 ' +
            (r.x + r.w + 300) + ',940 ' + (r.x + 180) + ',940',
          fill: 'url(#dsw-shaft)',
          style: { animationDelay: r.d, animationDuration: r.dur },
        }),
      );
      return h(
        'svg',
        { viewBox: '0 0 1200 900', preserveAspectRatio: 'none', 'aria-hidden': 'true' },
        [defs].concat(polys),
      );
    }

    function mainWhale() {
      const defs = h(
        'defs',
        { key: 'd' },
        h(
          'linearGradient',
          { id: 'dsw-body', x1: '0.2', y1: '0', x2: '0.36', y2: '1' },
          h('stop', { offset: '0%', stopColor: '#8fd9f5', stopOpacity: '0.34' }),
          h('stop', { offset: '42%', stopColor: '#3f92be', stopOpacity: '0.30' }),
          h('stop', { offset: '78%', stopColor: '#1c5476', stopOpacity: '0.26' }),
          h('stop', { offset: '100%', stopColor: '#0f3550', stopOpacity: '0.24' }),
        ),
        h(
          'linearGradient',
          { id: 'dsw-rim', x1: '0', y1: '0', x2: '1', y2: '0.85' },
          h('stop', { offset: '0%', stopColor: '#cdf4ff', stopOpacity: '0.5' }),
          h('stop', { offset: '42%', stopColor: '#7fd2f0', stopOpacity: '0.28' }),
          h('stop', { offset: '78%', stopColor: '#3f9dc4', stopOpacity: '0.12' }),
          h('stop', { offset: '100%', stopColor: '#2a7fa8', stopOpacity: '0.04' }),
        ),
        h(
          'filter',
          { id: 'dsw-bloom', x: '-20%', y: '-20%', width: '140%', height: '140%' },
          h('feGaussianBlur', { stdDeviation: '13' }),
        ),
      );

      const parts = [
        h('path', { key: 'glow', d: BODY, fill: 'rgba(120,214,255,0.28)', filter: 'url(#dsw-bloom)' }),
        h('path', { key: 'fluke', d: FLUKES, fill: 'url(#dsw-body)', stroke: 'url(#dsw-rim)', strokeWidth: 2.4, strokeLinejoin: 'round' }),
        h('path', { key: 'dorsal', d: DORSAL, fill: 'url(#dsw-body)', stroke: 'url(#dsw-rim)', strokeWidth: 1.8 }),
        h('path', { key: 'fin', d: FIN, fill: 'url(#dsw-body)', stroke: 'url(#dsw-rim)', strokeWidth: 2.2 }),
        h('path', { key: 'body', d: BODY, fill: 'url(#dsw-body)', stroke: 'url(#dsw-rim)', strokeWidth: 3.2 }),
        h('path', { key: 'back', d: BACK, fill: 'none', stroke: 'rgba(196,242,255,0.32)', strokeWidth: 5, strokeLinecap: 'round' }),
        h('path', { key: 'gape', d: GAPE, fill: 'none', stroke: 'rgba(190,242,255,0.34)', strokeWidth: 3.2, strokeLinecap: 'round' }),
        h('circle', {
          key: 'eye',
          cx: 902,
          cy: 168,
          r: 8,
          fill: 'rgba(5,22,38,0.66)',
          stroke: 'rgba(205,247,255,0.5)',
          strokeWidth: 2,
        }),
      ].concat(
        PLEATS.map((d, i) =>
          h('path', {
            key: 'pleat' + i,
            d: d,
            fill: 'none',
            stroke: 'rgba(170,235,255,0.18)',
            strokeWidth: 3,
            strokeLinecap: 'round',
          }),
        ),
      );

      return h(
        'svg',
        { viewBox: '0 0 1020 470', 'aria-hidden': 'true' },
        [defs, h('g', { key: 'g' }, parts)],
      );
    }

    function farWhale() {
      return h(
        'svg',
        { viewBox: '0 0 1020 470', 'aria-hidden': 'true' },
        h(
          'g',
          { key: 'g' },
          h('path', { key: 'fluke', d: FLUKES, fill: 'rgba(9,32,52,0.55)', stroke: 'rgba(120,200,235,0.20)', strokeWidth: 3 }),
          h('path', { key: 'fin', d: FIN, fill: 'rgba(9,32,52,0.5)', stroke: 'rgba(120,200,235,0.16)', strokeWidth: 3 }),
          h('path', { key: 'body', d: BODY, fill: 'rgba(9,32,52,0.55)', stroke: 'rgba(120,200,235,0.22)', strokeWidth: 3 }),
          h('path', { key: 'back', d: BACK, fill: 'none', stroke: 'rgba(160,230,255,0.20)', strokeWidth: 5, strokeLinecap: 'round' }),
        ),
      );
    }

    function WhaleScene() {
      return h('div', { className: 'dsw-root', 'aria-hidden': 'true' }, [
        h('style', { key: 'css' }, CSS),
        h('div', { key: 'deep', className: 'dsw-layer dsw-deep' }),
        h('div', { key: 'glow', className: 'dsw-layer dsw-glow' }),
        h('div', { key: 'surface', className: 'dsw-layer dsw-surface' }),
        h('div', { key: 'shafts', className: 'dsw-shafts' }, shafts()),
        h('div', { key: 'halo', className: 'dsw-layer dsw-halo' }),
        h('div', { key: 'whale', className: 'dsw-whale' }, mainWhale()),
        h('div', { key: 'far', className: 'dsw-far' }, farWhale()),
        h(
          'div',
          { key: 'bubbles', className: 'dsw-layer' },
          BUBBLES.map((b, i) =>
            h('span', {
              key: 'b' + i,
              className: 'dsw-b',
              style: {
                left: b.l,
                bottom: b.b + 'vh',
                width: b.s + 'px',
                height: b.s + 'px',
                animationDelay: b.d + 's',
                animationDuration: b.dur + 's',
              },
            }),
          ),
        ),
        h(
          'div',
          { key: 'plankton', className: 'dsw-layer' },
          PLANKTON.map((p, i) =>
            h('span', {
              key: 'p' + i,
              className: 'dsw-p',
              style: {
                left: p.l,
                top: p.t,
                width: p.s + 'px',
                height: p.s + 'px',
                animationDelay: p.d,
              },
            }),
          ),
        ),
        h('div', { key: 'vig', className: 'dsw-layer dsw-vignette' }),
      ]);
    }

    /* ------------------------------------------------------------------ *
     * Slots
     * ------------------------------------------------------------------ */

    class Guard extends React.Component {
      constructor(props) {
        super(props);
        this.state = { error: null };
      }
      static getDerivedStateFromError(error) {
        return { error: error };
      }
      render() {
        if (this.state.error) {
          const text = String((this.state.error && (this.state.error.stack || this.state.error.message)) || this.state.error);
          return h('pre', {
            style: {
              position: 'fixed', left: '8px', top: '8px', zIndex: 99999, maxWidth: '94vw',
              margin: 0, padding: '10px 12px', pointerEvents: 'none', whiteSpace: 'pre-wrap',
              background: 'rgba(140,20,20,0.94)', color: '#fff', font: '12px/1.5 ui-monospace, monospace',
              borderRadius: '8px',
            },
          }, 'DSW backdrop error:\n' + text);
        }
        return this.props.children;
      }
    }

    function Backdrop() {
      const settings = useSettings();
      if (settings.mode === 'off') return null;
      const scene = settings.mode === 'whale' ? h(WhaleScene, null) : h(PhotoScene, { settings });
      return h(Guard, null, scene);
    }

    function SettingsPage() {
      const settings = useSettings();
      const fileRef = React.useRef(null);
      const [note, setNote] = React.useState({ text: '', bad: false });

      function fail(key) {
        setNote({ text: T(key), bad: true });
      }

      function pick() {
        if (fileRef.current) fileRef.current.click();
      }

      function onFile(event) {
        const input = event.target;
        const file = input.files && input.files[0];
        input.value = '';
        if (!file) return;
        if (!/^image\//i.test(file.type)) {
          fail('note.badFile');
          return;
        }
        const reader = new FileReader();
        reader.onerror = () => fail('note.badFile');
        reader.onload = () => {
          const image = new window.Image();
          image.onerror = () => fail('note.badFile');
          image.onload = () => {
            try {
              const maxWidth = 2200;
              const maxHeight = 1400;
              const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
              const width = Math.max(1, Math.round(image.width * scale));
              const height = Math.max(1, Math.round(image.height * scale));
              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const context = canvas.getContext('2d');
              context.drawImage(image, 0, 0, width, height);
              const stored = canvas.toDataURL('image/jpeg', 0.86);
              const persisted = commit({ custom: stored, customName: file.name, mode: 'photo' });
              setNote(persisted
                ? { text: T('note.applied'), bad: false }
                : { text: T('note.tooBig'), bad: true });
            } catch (error) {
              fail('note.badFile');
            }
          };
          image.src = String(reader.result);
        };
        reader.readAsDataURL(file);
      }

      function clearData() {
        try {
          window.localStorage.removeItem(STORE_KEY);
          state = Object.assign({}, DEFAULTS);
          notify();
          setNote({ text: T('note.cleared'), bad: false });
        } catch (error) {
          fail('note.clearFailed');
        }
      }

      function reset() {
        commit({ custom: '', customName: '', mode: 'photo' });
        setNote({ text: T('note.reset'), bad: false });
      }

      function segment(value, labelKey) {
        return h(
          'button',
          {
            key: value,
            type: 'button',
            'data-on': settings.mode === value ? '1' : '0',
            onClick: () => commit({ mode: value }),
          },
          T(labelKey),
        );
      }

      function schemeSegment(value, labelKey) {
        return h(
          'button',
          {
            key: value,
            type: 'button',
            'data-on': (settings.schemeMode || 'auto') === value ? '1' : '0',
            onClick: () => commit({ schemeMode: value }),
          },
          T(labelKey),
        );
      }

      function slider(key, labelKey, min, max, step, format, fallback) {
        const shown = settings[key] == null ? fallback : settings[key];
        return h('div', { key: key, className: 'dsx-row' }, [
          h('div', { key: 'l', className: 'dsx-label' }, [
            h('span', { key: 'n' }, T(labelKey)),
            h('span', { key: 'v', className: 'dsx-val' }, format(shown)),
          ]),
          h('input', {
            key: 'i',
            className: 'dsx-slider',
            type: 'range',
            min: min,
            max: max,
            step: step,
            value: shown,
            onChange: (event) => {
              const next = {};
              next[key] = Number(event.target.value);
              commit(next);
            },
          }),
        ]);
      }

      const photo = settings.mode === 'photo';

      return h('div', { className: 'dsx' }, [
        h('style', { key: 'css' }, CSS),
        h('div', { key: 't', className: 'dsx-title' }, T('page.title')),
        h('div', { key: 's', className: 'dsx-hint' }, T('page.subtitle')),

        h('div', { key: 'mode', className: 'dsx-row' }, [
          h('div', { key: 'l', className: 'dsx-label' }, T('mode.title')),
          h('div', { key: 'c', className: 'dsx-seg' }, [
            segment('photo', 'mode.photo'),
            segment('whale', 'mode.whale'),
            segment('off', 'mode.off'),
          ]),
        ]),

        photo
          ? h('div', { key: 'scheme', className: 'dsx-row' }, [
            h('div', { key: 'l', className: 'dsx-label' }, T('scheme.title')),
            h('div', { key: 'c', className: 'dsx-seg' }, [
              schemeSegment('auto', 'scheme.auto'),
              schemeSegment('light', 'scheme.light'),
              schemeSegment('dark', 'scheme.dark'),
            ]),
            h('div', { key: 'h', className: 'dsx-hint' }, T('scheme.hint')),
          ])
          : null,

        h('div', { key: 'image', className: 'dsx-row' }, [
          h('div', { key: 'l', className: 'dsx-label' }, T('image.title')),
          h('div', { key: 'c', className: 'dsx-inline' }, [
            h('div', {
              key: 'thumb',
              className: 'dsx-thumb',
              style: { backgroundImage: 'url("' + (settings.custom || DEFAULT_PHOTO) + '")' },
            }),
            h('div', { key: 'col', className: 'dsx-col' }, [
              h('div', { key: 'name', className: 'dsx-name' },
                settings.custom ? (settings.customName || T('image.custom')) : T('image.default')),
              h('div', { key: 'actions', className: 'dsx-actions' }, [
                h('button', { key: 'pick', type: 'button', className: 'dsx-btn', onClick: pick }, T('image.pick')),
                h('button', {
                  key: 'reset',
                  type: 'button',
                  className: 'dsx-btn',
                  disabled: !settings.custom,
                  onClick: reset,
                }, T('image.reset')),
                h('button', { key: 'clear', type: 'button', className: 'dsx-btn', onClick: clearData }, T('image.clear')),
              ]),
            ]),
          ]),
          h('input', {
            key: 'file',
            ref: fileRef,
            type: 'file',
            accept: 'image/*',
            style: { display: 'none' },
            onChange: onFile,
          }),
          h('div', { key: 'hint', className: 'dsx-hint' }, T('image.hint')),
        ]),

        photo
          ? slider('strength', 'slider.strength', 0.1, 0.9, 0.01, (v) => Math.round(v * 100) + '%', resolveScheme(settings) === 'light' ? 0.32 : 0.5)
          : null,
        photo
          ? slider('blur', 'slider.blur', 0, 14, 0.5, (v) => v.toFixed(1).replace(/\.0$/, '') + ' px')
          : null,
        photo
          ? slider('rain', 'slider.rain', 0, 1, 0.05, (v) => Math.round(v * 100) + '%')
          : null,

        note.text
          ? h('div', { key: 'note', className: 'dsx-note', 'data-bad': note.bad ? '1' : '0' }, note.text)
          : null,
      ]);
    }

    function SettingsSection() {
      return h(Guard, null, h(SettingsPage, null));
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        /* Optional access: a direct `ctx.locale` read throws when the client
           composition has no locale service, and that would abort this whole
           apply. `ctx.get` is the documented optional-access form. */
        let locale;
        try {
          locale = typeof ctx.get === 'function' ? ctx.get('locale') : undefined;
        } catch (error) {
          locale = undefined;
        }
        if (locale) {
          const add = (id, dict) => {
            try {
              locale.register('glass-backdrop', id, dict);
            } catch (error) {
              /* an id that is already taken is fine */
            }
          };
          ['zh', 'zh-CN', 'zh-Hans', 'zh-SG'].forEach((id) => add(id, DICT.zh));
          ['en', 'en-US', 'en-GB'].forEach((id) => add(id, DICT.en));
          try {
            localeTranslate = locale.bind('glass-backdrop');
          } catch (error) {
            localeTranslate = (key) => key;
          }
          try {
            ctx.effect(() => locale.subscribe(() => notify()));
          } catch (error) {
            /* the subscription is a nicety, not a requirement */
          }
        }

        try {
          ctx.effect(() => {
            if (typeof MutationObserver !== 'function') return () => {};
            let last = themeScheme();
            const observer = new MutationObserver(() => {
              const next = themeScheme();
              if (next !== last) {
                last = next;
                notify();
              }
            });
            observer.observe(document.documentElement, {
              attributes: true,
              attributeFilter: ['class', 'style', 'data-theme', 'data-scheme'],
            });
            return () => observer.disconnect();
          });
        } catch (error) {
          /* a missing observer only costs live theme switching */
        }

        ctx.slots.inject('shell.overlay', () =>
          ctx.slots.register(
            { name: 'shell.overlay', id: 'glass-backdrop', order: -20 },
            Backdrop,
          ),
        );

        ctx.slots.inject('settings.section', () =>
          ctx.slots.register(
            {
              name: 'settings.section',
              id: 'glass-backdrop',
              order: 16,
              label: () => T('section.label'),
            },
            SettingsSection,
          ),
        );
      },
    };
  },
});
