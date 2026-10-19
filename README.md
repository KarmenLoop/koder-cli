# Koder CLI 0.4.0-preview.7

完善中英文安装同意提示、版权、下载使用许可、国际用户说明及官方联系方式。

- 普通安装明确提示：输入 `accept` 并回车继续；`decline`、空回车或 Ctrl+C 取消。拒绝时不下载、不安装、不写同意记录。
- Mac/Linux 管道安装改从真实控制终端读取；非交互运行需已经阅读并明确同意的人设置 `KODER_EULA_ACCEPT=1`。
- PowerShell/CMD 增加同意询问及重定向输入判断，保留 Windows PowerShell 5.1 的 ASCII 安装包装。Windows 真机尚未验收。
- 包内新增完整双语 `LEGAL-NOTICE.md`；团队为 KARMENLOOP 官方团队 / KARMENLOOP Official Team，上海，info@karmenloop.com。
- 许可正文第 1–6 条保持不变；头部信息使校验值变化，旧更新器会要求重新阅读。运行普通安装命令并输入 `accept` 即可覆盖更新，配置、记忆和绑定保留，无需重新配置。
- 保留原第三方许可证、旧 GPL 权利、可选功能授权和更新完整性检查。

串行回归：400 项，397 通过，0 失败，3 项既有 Core 环境跳过。独立真实终端同意检查与隔离安装升级通过；真实渠道、多设备、Windows 真机与生产 Core 未验收。

This preview adds bilingual acceptance/cancellation instructions, interactive PowerShell/CMD consent, controlling-terminal reads for piped shell installs, and a complete copyright/download/international-use notice. The official team is KARMENLOOP Official Team in Shanghai, China; contact info@karmenloop.com.

EULA clauses 1–6 are unchanged. Updated contact metadata changes the checksum, so older updaters stop for review. Run the ordinary installer and type `accept` after reading; configuration, memory and bindings are retained. License acceptance grants no optional feature or computer permissions. Native Windows and live channel/multi-device acceptance remain pending.

Basic local use remains free. New Koder-owned development source is proprietary. This tag's source archives contain distribution documents only; legacy source and third-party components keep their applicable licenses.

[Install](https://github.com/KarmenLoop/koder-cli#readme) · [License](https://github.com/KarmenLoop/koder-cli/blob/main/EULA.md) · [Legal notice](https://github.com/KarmenLoop/koder-cli/blob/main/LEGAL-NOTICE.md) · [Consent guide](https://github.com/KarmenLoop/koder-cli/blob/main/ACCEPTANCE.md) · [Credits](https://github.com/KarmenLoop/koder-cli/blob/main/OPEN_SOURCE_CREDITS.md)


This tag contains distribution documentation only. Install Koder from the release assets. The implementation is proprietary; legacy GPL source remains on the main branch under its original terms.
