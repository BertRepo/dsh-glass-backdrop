# 玻璃背景 / DSH Glass Backdrop

为 DeepSeek Harness Web UI 提供原创深海鲸鱼、雨玻璃和自选图片装饰。默认是鲸鱼；图片模式的默认图为原创抽象深海 SVG，没有个人摄影素材。代码与原创图形以 MIT 许可分发，© 2026 BertRepo。

Original whale and wet-glass decoration for the DSH Web UI, with an optional local custom image. Whale is the default; the bundled image is original abstract SVG artwork. MIT © 2026 BertRepo.

## 安装 / Install

在 DSH 对话中说：

```text
安装插件 https://github.com/BertRepo/dsh-glass-backdrop
```

这是发给 DSH 智能体的自然语言指令，**不是终端命令**。在创造模式中使用插件管理工具；安装结果以 DSH 返回状态为准。也可以直接打开 DSH 侧边栏的“插件”页面，把下面的 GitHub 地址粘贴到安装入口：

```text
https://github.com/BertRepo/dsh-glass-backdrop.git
```

固定首发版可使用 `https://github.com/BertRepo/dsh-glass-backdrop.git#v1.0.0`。不想依赖 Git 时，可安装 [Release 安装包](https://github.com/BertRepo/dsh-glass-backdrop/releases/download/v1.0.0/dsh-glass-backdrop-1.0.0.tgz) 的完整下载地址，或下载后选择本机 `.tgz` 路径。tarball 包不要求安装 Git，但仍需访问下载站点。

以下是 `plugin_manager` 工具调用参数，不是 JavaScript 或命令行指令：

```json
{
  "action": "install_bundle",
  "target": "https://github.com/BertRepo/dsh-glass-backdrop.git"
}
```

安装命令行版 DSH 且 `dsh` 已在 PATH 中时，Windows PowerShell、macOS 和 Linux 可使用同一条命令：

```sh
dsh plugin --profile web add "https://github.com/BertRepo/dsh-glass-backdrop.git#v1.0.0"
```

这里的 `web` 是命令行版 profile；**Desktop 的 `desktop` profile 由 Electron 管理，请通过应用内插件页面或对话安装，不要改成 `--profile desktop`**。安装仅影响选定 profile；不支持重载的版本需重启。

仓库同时提供构建好的 `client.js` 和源代码。使用者无需编译本插件或批准构建脚本。若使用源代码目录，先由开发者运行构建，再把该目录的绝对路径交给 `plugin_manager` 的 `install_bundle`。安装是否立即生效，以工具返回的 `application`、`warnings` 和 `nextStep` 为准；需要重启时应遵照提示。

Desktop: paste the GitHub `.git` URL or the release `.tgz` URL into DSH's Plugins install page, or ask its agent to install the URL. CLI users can run the command above for the `web` profile. The Desktop profile is Electron-managed. Prebuilt code is committed, so consumers need no build scripts; Git-based installation requires Git, while tarball installation does not. No npm registry publication is required.

## 使用与真实限制 / Behavior and limits

在设置中打开“背景”，选择深海鲸鱼、照片 · 玻璃雨滴或关闭。图片模式提供明暗适配、图片选择、背景浓度、0–14 px 模糊和雨滴密度。默认模糊为 0；浅色模式没有白色雾层，亮部雨滴与玻璃反光仍然存在。系统启用“减少动态效果”时，CSS 动画停止。

装饰注册在 `shell.overlay`：它是覆盖整个窗口的半透明层，并非真正绘制在聊天内容下面。`pointer-events:none` 让点击穿透，装饰本身对辅助技术隐藏，但**高浓度图片、深色遮罩、光束或雨滴仍可能降低文字对比度**。背景不会把原有不透明面板改成透明玻璃；0 px 模糊只作用于图片，不会模糊 DSH 界面。不同主题、窗口尺寸、显卡及 WebView 的混合效果可能不同。难以阅读时请调低浓度或关闭。

The decoration uses `shell.overlay`, a translucent click-through layer above the application, not a true background beneath it. It can reduce text contrast. Blur affects the image only; it does not turn opaque app panels into transparent glass. White fog is absent in light mode, while highlights remain. CSS animations respect reduced motion.

## 本机存储与隐私 / Local storage and privacy

- 仅使用当前浏览器、当前 DSH 站点来源的 `localStorage`，键为 `dsh-glass-backdrop/settings/v1`。与原本地插件的键完全独立，不读取、不迁移旧图片。
- 图片通过浏览器 FileReader 读取，再等比缩小到不超过 2200 × 1400，转为质量 0.86 的 JPEG data URL。设置和所选文件名也保存在同一记录中。原始文件不会被修改；包内没有所选图片。
- 插件没有网络请求、上传、远程素材、分析服务、账号同步或云备份。`localStorage` 不是加密保险箱；同一来源下其他脚本、浏览器扩展以及有本机配置访问权限的软件可能读取它。
- 没有承诺固定存储容量。浏览器配额、已有站点数据、隐私模式和存储策略都会影响可用空间；base64 比二进制大约多三分之一。大图片可能耗费内存，配额不足时会提示错误；失败的图片可能仅在当前页面内显示，刷新后回到上次成功保存的状态。
- “恢复默认图片”清除自选图片与文件名并切回图片模式；“清除本插件所有数据”删除上述键并恢复默认鲸鱼。浏览器拒绝访问存储时会提示清除失败，可使用浏览器的站点数据管理。卸载插件不会自动删除浏览器数据；请先清除。清除整个站点数据会同时影响 DSH 的其他本地数据。
- 浏览器、端口、域名、设备或配置文件不同，数据通常不互通。同源多个标签页的设置没有实时同步，刷新后读取最后保存的记录。

Custom images are resized locally and stored with their filename/settings in origin-scoped `localStorage` only. Nothing is uploaded. Storage is not encrypted; quotas vary and large images may fail. “Clear all plugin data” removes this plugin's key; uninstalling alone does not. Other browsers/origins/devices do not share the data. Use only images you are permitted to use.

## 开发与打包 / Development

需要带 npm 的现代 Node.js；CI 选择 Node.js 22，不代表声明 DSH 的最低版本。无额外依赖：

```sh
npm run build
npm run check
npm run pack
```

`build.mjs` 只读取 `client.src.js` 与原创 `assets/deep-sea-rain.svg`，以正确的 `image/svg+xml` MIME 内嵌到 `client.js`，输入换行规范化为 LF。请同时提交源码和最新构建产物。

`npm run check` 检查 JavaScript 语法、模块/清单/补丁身份、构建一致性与确定性、默认 SVG 字节、元数据、无个人栅格图片，并通过轻量 React/Slot 替身验证默认鲸鱼、0 模糊、自选图片缩放、恢复默认、关闭、存储配额异常及清除数据。替身测试不等于真实 DSH 渲染测试。

`npm run pack` 显式构建和检查，再执行 `npm pack --ignore-scripts`，最后验证真实 tgz 中的 15 个允许文件、TAR 校验和、逐文件字节和嵌入 SVG MIME。构建步骤没有绑定到 install、prepare 或 prepack 生命周期，因此消费者不会被要求执行构建脚本。压缩包仅在本地生成，不会发布 npm。

GitHub Actions 提供 Linux、Windows、macOS 的构建、语法、确定性及打包验证矩阵。工作流不会发布包。准备阶段尚未运行远程 CI；本机通过情况应以交付记录为准。跨平台可重现性由源文件 LF 与确定性构建约束支持，但未声称不同系统生成的 tgz 已做逐字节交叉比较。

Build/check/pack require modern Node.js with npm (CI uses Node 22). There are no dependencies or lifecycle install hooks. The CI matrix checks Linux, Windows and macOS when run; it does not publish. Offline fixtures do not prove real DSH rendering or cross-platform visual compatibility.

## 兼容性与验证状态 / Compatibility

使用 DSH 动态客户端模块加载器、`shell.overlay`、`settings.section`、可选 locale 服务以及现有主题变量。没有在清单里虚构 DSH 最低版本或设置未经核实的 `engines.dsh`。DSH 的接口可能随版本变化。

本次准备公开包时，实时 Client Inspect 查询超时，且按照要求没有安装公开包、改变本地插件或执行真实界面验证。已准备静态与离线测试；Windows 构建与打包结果见交付报告。Linux/macOS CI、真实客户端渲染、语言切换及卸载后显示恢复尚待实际运行验证。

No unverified minimum DSH version is declared. Live Client Inspect timed out during package preparation. This public package was not installed or visually tested; the existing local plugin was left intact. Linux/macOS and actual DSH rendering remain unverified until CI/runtime testing is performed.

## 文件与许可 / Files and license

`client.src.js` 是可读源代码，`client.js` 是提交的运行产物，`index.js` 是无副作用 Host 入口，`cordis.patch.yml` 注册同名插件。`assets/deep-sea-rain.svg` 与 `icon.svg` 为原创。中英展示元数据在 `locale/`，许可与素材来源见 `LICENSE`、`ATTRIBUTION.md`。
