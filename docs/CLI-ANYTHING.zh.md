# 在 Koder 使用 CLI-Anything

在交互会话里可直接输入 `/cli-anything catalog gimp`，不用退出当前命令窗口；其余子命令同样通过原命令分发器执行。

候选版内置 `builtin:cli-anything`、固定上游版本的离线目录，以及 `cli_anything_discover`、`cli_anything_call` 工具。来源为 HKUDS/CLI-Anything，固定 SHA `34f519533bc175d2fe287ab8316b0dd99bb9cc43`；保留 Apache-2.0 文本及来源说明。各应用及生成的 CLI 仍需分别核对许可和平台要求。

这不是把所有应用装进安装包。它让 Agent 能在原执行链中查找、注册、检查和调用项目内已有的应用 CLI。Apps/MCP 已能完成任务时仍优先使用；GUI 与网络权限仍走原门控。

## 一步步接入

1. `koder cli-anything catalog gimp`：查看固定版本目录及依赖。`installed:false` 表示目录条目不是本机安装证明。
2. 先运行 `koder skills prepare cli-anything`，把原来已内置的同版本源码复制到一个新的项目目录；它不安装、不执行。按返回路径阅读 SKILL.md、cli-anything-plugin/HARNESS.md、选中适配器的源码、应用要求与许可。安装所需应用、Python 或依赖须单独授权，不会静默全局安装。
3. 在项目内创建独立环境：`python3 -m venv --copies .venv`。准备审阅过的本地包及其依赖；使用 copies 是因为路径不得通过符号链接越出工作区。
4. 编写 `app-clis.json`，例如：

```json
{
  "version": 1,
  "apps": [{
    "id": "gimp",
    "executable": ".venv/bin/cli-anything-gimp",
    "prefixArgs": [],
    "platforms": ["darwin", "linux"],
    "python": ".venv/bin/python",
    "package": ".koder-skill-cli-anything/gimp/agent-harness"
  }]
}
```

Windows 应改成真实 `.venv/Scripts/python.exe` 和 `.exe` 入口，并在确认目标支持后填写 `win32`。不要将此示例当成所有系统均已验证的配置。

5. `koder cli-anything register app-clis.json`：只登记元数据到本项目 `.koder/cli-anything.json`，不执行。已有登记文件不会被覆盖；变更须自行审阅该文件。
6. `koder cli-anything inspect gimp`：检查路径、可执行性和当前平台。`applicationVerified:false` 表示尚未核实真实应用状态。
7. 如尚未安装本地包，`koder cli-anything install gimp` 先显示参数；确认后加 `--yes` 才执行该项。使用本项目 venv，离线 pip、不自动下载依赖；本地构建钩子也属于要批准的代码执行。
8. `koder cli-anything invoke gimp -- --help` 先查看调用计划。确认后用 `koder cli-anything invoke gimp --yes -- --help`。应用参数放在 `--` 后，防止被 Koder 当作自身参数。

## 在对话中使用

告诉 Koder：“查看本项目登记的应用 CLI，用已登记的工具完成……并核对产物。”工具先查询/检查，再通过已有审批执行。审批中显示程序路径和真实参数；取消后不运行。运行回执保留原进程退出、超时和清理状态；未知结果须先核对，不能盲目重试外部操作。退出码 0 只说明进程成功退出，不等于应用里已发送、发布或保存成功。

`koder skills show builtin:cli-anything` 查看内置方法。生成的第三方 Skill 可走原有 `koder skills import <本地目录>`；导入文档不等于安装程序，也不授予执行权。Setup 中仍可单独关闭该 Skill。

## 验收范围

隔离本机夹具验证发现/登记、拒绝不执行、批准后字面 argv、持久回执和超时传递。没有用真实账号，也没有安装 GIMP 等目标软件。原生 Windows、实际应用操作及真实 pip 包安装仍须另验。不会把元数据存在、工具已注册或一个夹具成功称为所有应用完全兼容。

[完整英文命令说明](cli-anything.md) · [会话控制教程](SESSION-CONTROLS.zh.md)。
