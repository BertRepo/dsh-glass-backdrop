# 安装两个插件与验证记录

## Desktop：在 DSH 内安装

复制下面整段到 DSH 创造模式的对话中：

```text
请使用 plugin_manager 依次安装并启用以下两个插件；按实际返回结果处理需要重启的提示：
https://github.com/BertRepo/dsh-magpie-connect.git#v0.6.1
https://github.com/BertRepo/dsh-glass-backdrop.git#v1.0.0
```

也可以在侧边栏「插件 → 安装」中逐一粘贴上述地址。Git 安装需要 Git；没有 Git 时改用各项目 Release 的 `.tgz` 完整下载 URL。`.tgz` 是安装包，源码 ZIP 用于阅读和开发，不作为插件安装包。

## 命令行版：一条命令安装两个插件

Windows PowerShell、macOS、Linux，在 `dsh` 已加入 PATH 的前提下：

```sh
dsh plugin --profile web add "https://github.com/BertRepo/dsh-magpie-connect.git#v0.6.1" "https://github.com/BertRepo/dsh-glass-backdrop.git#v1.0.0"
```

`web` 是命令行版 profile。Desktop 的 `desktop` profile 由 Electron 管理，Desktop 请用应用内入口，不能把它当成 CLI web profile。安装器状态要求重启时重启相应应用。

## 装好后

Magpie：设置 → Magpie 网关，填写可访问的 `/v1` API 地址与自己的 Key，保存、测试连接、获取模型。插件不附带网关程序、账户或 Key。Key 存在本机 JSON 中，远程网关应使用 HTTPS。

背景：设置 → 背景，默认原创鲸鱼；可以选择本机图片并调节雨滴、浓度与模糊。私人婚纱照不在公开仓库中。图片只存在当前来源的 localStorage，不跨设备同步。装饰是界面上方的半透明层，浓度高时会降低文字对比度，可调低或关闭。

## 发布验证快照（2026-11-12）

- 背景插件 v1.0.0：Windows/macOS/Linux 构建与打包 CI 全通过；DSH 0.2.1-rc.5 内置插件管理器从公开 Release URL 下载并安装成功（测试时禁用，已移除临时包）。未用此测试声称视觉效果通过。
- Magpie 分发版 v0.6.1：Windows Node 24.21 的 172 项测试中 170 通过、2 项 POSIX 权限测试跳过，零失败、零取消。GitHub Windows/Linux CI 全通过；记录时 macOS runner 尚排队，查看实时结果：[Magpie Actions](https://github.com/BertRepo/dsh-magpie-connect/actions/runs/43248335910)。
- [背景 Actions](https://github.com/BertRepo/dsh-glass-backdrop/actions/runs/43247466902)。CI 验证源码/构建/打包，不等于在每个系统上完成真实 DSH 界面和网关推理测试。
- 两个公开 `.tgz` 的 GitHub 服务端 SHA256 与本地打包文件一致。各 Release 同时提供源码 ZIP 与 SHA256 校验文件。
- Magpie 保留 bitxeno 上游 MIT 署名；BertRepo 的 0.6.1 是分发 fork，不是上游 npm 发行版。Node 最低声明为 22.19；请同时满足 DSH 版本范围，禁止以跳过兼容检查代替升级。

[Magpie Release](https://github.com/BertRepo/dsh-magpie-connect/releases/tag/v0.6.1) · [背景 Release](https://github.com/BertRepo/dsh-glass-backdrop/releases/tag/v1.0.0)
