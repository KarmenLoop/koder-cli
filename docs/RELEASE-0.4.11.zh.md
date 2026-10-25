# Koder CLI 0.4.11

新增内置 GitHub 绑定：在 Setup 或 koder github connect 中连接自己的令牌，可以列出和读取仓库、创建默认私有仓库、提交选定项目文件、修改 README 等文本与仓库介绍/主页，并从已有分支创建草稿 PR。

Agent 直接调用 github_read / github_project。选定本地文件按当前工作区快照上传，保留其他文件和可执行属性，不强推分支。令牌沿用本机保护存储；每次远程写入先显示目标和内容并取得确认，--yes 不代替该确认。

中断后的不确定写入保留回执并先对账，不盲目重发。远程仓库任务已获得真实成功回执时，不再因本地缺少代码文件被误判未落实；普通编程任务的文件与测试要求仍保留。

## 安装与教程

Windows CMD、PowerShell 与 macOS 使用同一份版本化运行包。运行 koder update，再确认 koder --version 为 0.4.11。旧更新器无法读取清单时，使用[官网当前安装器](https://karmenloop.com/download.html)覆盖升级。

[GitHub 绑定和项目完整教程](GITHUB-PROJECTS.zh.md) · [全部功能导航](START-HERE.zh.md) · [完整中文教程](USER-GUIDE.zh.md)

保留 0.4.10 长命令等待、恢复、邮箱、MCP、Skills、模型路由、实时输入、多窗口和原有权限。30 课与八套中英文文字教程继续提供。

## 验证范围

最终源码无密钥回归：CLI 72 项、GitHub/内核 23 项通过。测试使用本地回环服务、受保护存储测试端口及脚本化模型，不等同真实 GitHub PAT、组织权限或真实模型验收。打包产物另行检查并记录。

Windows 10/11、PowerShell 5.1 冷启动、ConPTY/IME、Windows-MCP 图形操作、真实邮箱/模型和原生凭据存储仍待验。之前两项输入交互失败记录保留。未签名 macOS 锁屏原型继续独立留存，未并入本包。

本版 GitHub 支持选定文本文件与已有分支；浏览器 OAuth、GitHub Enterprise、二进制/LFS、整目录上传、新建分支、合并、删除及 GitHub Projects 看板未接入。详细限制与令牌权限见教程。
