# Koder CLI 0.4.5 更新说明

修复更新器把超过 100 MB 的合法安装包误判为“更新清单无效”的问题，上限调整为有界的 512 MiB；原有清单格式、协议与 SHA-256 校验继续保留。Windows-MCP、邮箱发送与监控、Headroom 和全部 0.4.4 功能继续保留。

## 旧版升级一次这样做

0.4.4 及更早版本的大小限制写在本机程序里，服务器无法替旧程序解除。若 `koder update` 报清单无效，请直接运行 [官网当前安装器](https://karmenloop.com/download.html) 覆盖升级一次，不要卸载或删除配置目录。按提示阅读并同意许可；安装不会代开电脑或邮箱权限。正常安装器保留独立配置与历史。

安装后 `koder --version` 应显示 0.4.5，再运行 `koder update --check`。从 0.4.5 开始可以通过普通更新命令接受新上限内的包。

[完整中文教程](USER-GUIDE.zh.md) · [安装步骤](INSTALLATION.md) · [0.4.4 功能说明](RELEASE-0.4.4.zh.md) · [Windows-MCP](WINDOWS-MCP-BUNDLED.zh.md) · [邮箱](MAIL-DELIVERY.zh.md) · [Headroom](HEADROOM.zh.md)。30 课、八套终端教程和完整命令参考继续随包提供。

旧版更新失败原记录保留。Windows 10/11 实机冷安装与更新、MCP 图形操作、系统登录重启、真实邮箱与模型质量仍未验；按用户要求发布，不把未验项目标成通过。
