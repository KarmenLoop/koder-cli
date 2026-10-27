# 安装更简单，功能完整保留

0.5.10 安装器会自动选择 macOS 或 Linux 包；Windows 继续使用包含内置 Windows MCP 的完整包。用户不需要手动选依赖或拼包。macOS Intel 与 Apple Silicon 共用 macOS 包，Linux x64 / ARM64 共用运行包并自动选择各自的 Node。

保留当前系统支持的全部运行代码、模型/BYOK、权限、取消、邮箱、GitHub、MCP、Skills、桌面/浏览器适配、自主学习、OCR、PageIndex 和完整现行 1,800 课中文课堂。英文仍为原 30 课。Linux 原有 SolidCraft 外部连接入口保留；没有把不存在的 Linux 内置 SolidCraft 二进制声称已支持。

体积优化来自三处：其他操作系统专用的可执行文件不进入当前系统包；历代重复的 `docs/tutorials` 文本导出留在 GitHub 和完整离线包；OCR 只保留实际调用的一份中英文模型，去掉 npm 数据包副本及未使用的另一套模型。模型原字节、许可和设置不变。自主学习 0.4.3 的 61 份核心资源完整保留。

## 一条命令安装

macOS，或已装 curl 的 Linux：

```bash
curl -fL --retry 3 --connect-timeout 20 https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/install/koder-cli.sh -o /tmp/koder-install.sh && bash /tmp/koder-install.sh
```

Ubuntu 有 wget、没有 curl 时：

```bash
wget --tries=3 --timeout=30 -O /tmp/koder-install.sh https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/install/koder-cli.sh && bash /tmp/koder-install.sh
```

开头的小脚本下载成功才执行。按现有许可提示确认后，安装器自动处理系统选择、Node、下载和校验。若两个下载工具都没有，先分别运行 `sudo apt update` 和 `sudo apt install curl ca-certificates`。Koder 本身用普通用户运行。电脑、邮箱等权限仍单独授权。已安装用户运行 `koder update`。

## 断网或取消后继续

默认最多重试五次。网络支持 Range 时从已保存位置续传；不支持时只重下当前文件。完成后必须通过完整 SHA-256 校验才启用。

Ctrl+C 可取消，断点保存在 `~/.koder-cli/cache/downloads`。重新运行同一安装命令即可继续，无需找临时文件或手工合并。缓存按预期内容哈希区分版本，完整缓存复用前也会重新校验；并发安装各用独立临时下载文件。

默认连接等待 20 秒、无进展等待 60 秒；持续有进展的大文件不受这个停滞阈值截断。总等待仍沿用原下载期限。需要时可设置 `KODER_DOWNLOAD_RETRIES`（0–20）、`KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS`（1–600）、`KODER_DOWNLOAD_STALL_TIMEOUT_SECONDS`（1–3600）；通常不用修改。

## 完整离线包和历史记录

GitHub Release 同时保留 `koder-cli-0.5.12.tgz` 全平台完整包，以及较小的 `koder-cli-0.5.12-darwin.tgz` / `koder-cli-0.5.12-linux.tgz`。清单列出各包大小和 SHA-256。确实需要全部平台与历史导出时，可运行 `KODER_INSTALL_FULL_PACKAGE=1 bash /tmp/koder-install.sh`。旧版本源码、文档和回退记录没有删除。

安装优化不代表所有真实网络或设备已经验收。故障注入、实际包安装、Ubuntu CI 与 Windows beta 实机结果分别记录在发布回执中。

## Ubuntu 24.04 独立入口

[Ubuntu 24.04 安装器](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.12/koder-ubuntu-24.04.sh) · [Ubuntu / Linux 完整功能包](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.12/koder-cli-0.5.12-linux.tgz)。Ubuntu 24.04.x、x64 与 ARM64 共用这个入口，Node 按处理器自动选择。

```bash
wget --tries=3 --timeout=30 -O /tmp/koder-ubuntu-install.sh https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.12/koder-ubuntu-24.04.sh && bash /tmp/koder-ubuntu-install.sh
```

Ubuntu 入口从同一份安装器生成，恢复、校验、许可、权限规则保持一致，没有额外的精简版内核。

## Skill 与内存

Skill 资料文件不会各自启动一个进程。当前内核按任务选择方法、分页读取正文；兼容本机 Skill 的索引只保留元数据和哈希，正文读取时再次校验。按需加载并不表示删除功能。MCP 服务、浏览器、OCR 和模型推理的内存须分别测量，不能由下载大小推断。

私有内核开发源码不会随文档提交至公开 GitHub 仓库。安装包仍包含运行所必需的代码；第三方内容保留原许可证、来源及相应义务，不因统一调度而改变授权。
