# Koder CLI 0.4.7

本版新增模型页自动获取、账号隔离缓存、受控配置资料更新与手动刷新开关，保留 0.4.6 的全部功能。Windows 与 macOS 使用同一版本化 CLI 包。执行 `koder update`，再用 `koder --version` 核对 0.4.7。0.4.4 或更早版本若拒绝大包清单，请运行官网安装器覆盖升级，不要删除配置或历史。

从 0.4.7 起，`koder setup`（聊天中 `/setup`）→ 模型会自动获取当前账号可见的型号与公共预设配置资料。型号变更后由你选择，不会直接替换当前模型。

## 使用步骤

1. 打开模型页面。已有配置会查询原 Base URL 的 Models API；首次绑定需先选择服务商、型号和填写密钥。输入密钥后会获取列表，保存提示会说明结果。
2. 重新进入模型页面，选择“当前账号最新型号”。可直接键入这几个字筛选菜单。
3. 查看型号、上下文/输出上限（若服务商返回）、工具能力声明、来源和获取时间。选中型号才写入配置，密钥和原地址保留。
4. 不在列表里也可手动输入。环境变量或 `--provider` 文件覆盖需在原来源修改，不会悄悄写到默认配置。
5. “立即刷新模型与配置”忽略缓存强制获取；“自动获取最新模型”可以关闭。关闭后原预设和手动刷新仍可用。

```text
koder model refresh
koder model refresh <saved-model-name>
koder model catalog-refresh
koder model models
koder model test --tools
```

`model refresh` 获取账号型号，`catalog-refresh` 获取官网公共资料。两者只读，不调用付费推理，不会自动切换模型或扩大权限。自动获取默认账号缓存 6 小时、公共配置缓存 24 小时；只在打开模型页面/首次配置时按需刷新，不启动额外后台服务。单次获取默认最多 5 秒，包括分页；Esc 可取消。失败会显示状态，保留上次列表和原配置。

## 两种来源

- **服务商 Models API**：针对你当前的账号、协议和地址。缓存按账号凭据指纹及接口隔离，文件内不保存 API Key；不同账号的私有模型不会互相混用。未知工具能力不再被错误隐藏，明确不支持工具或已退役的型号不会被当作编码 Agent 型号选择。接口可见不等于账号调用和工具循环已实测通过。
- **官网配置资料**：`https://karmenloop.com/install/model-catalog-v1.json`，记录服务商官方说明链接、资料核对日期、型号及可用的限制参数。公共目录是维护的资料快照，不是每家服务商实时承诺。下载不附加用户密钥，不包含可执行代码。旧或无效资料会被拒绝；接口或协议改变只提示核对，不能搬运密钥或切换计费通道。资料更新无需重装 CLI；需要新的协议实现仍须升级运行包。

Aliyun Coding Plan 官方说明目前不提供模型列表 API，因此这里使用配置资料和手动型号，不把 404 当作你的模型失效。API 与 Token/Coding Plan、国内与国际地址始终分开。此前暂不可用的接口仍保留灰色状态，不因发现了型号而恢复。

未返回的上下文/输出上限不会凭名字猜测。新型号默认沿用保守限制；有明确接口元数据时，在你选中后填写受限参数。已有型号不会仅因刷新自动扩大窗口。仍可在 Setup → 上下文与输出中明确设置。

## 状态与排障

- `fresh`：此次接口获取成功；`cached`：缓存仍新鲜。
- `stale` / `unavailable`：本次获取失败；HTTP 401 应检查该地址对应的 Key/订阅，404 可能是接口没有 Models API。刷新失败不等同于推理失败。
- `held`：已知适配问题，暂不可用；`unsupported`：当前产品没有可查询的 Models API。
- `disabled`：自动获取关闭；`cancelled`：用户取消。

真实服务商账号、付费推理、Windows 原生控制台与 GUI 仍需各自验收。本版以隔离接口桩、TUI 输入与打包验证为依据，不宣称所有新型号都能完成工具任务。

## 官方依据

- [OpenAI Models API](https://developers.openai.com/api/reference/resources/models/methods/list)：型号与基本元数据。
- [Claude Models API](https://platform.claude.com/docs/en/api/models/list)：分页、能力、生命周期和限制字段。
- [Aliyun Coding Plan FAQ](https://help.aliyun.com/en/model-studio/coding-plan-faq)：模型列表 API 不可用及套餐边界。
- [MiniMax OpenAI 配置](https://platform.minimax.cn/docs/api-reference/text-openai-api)：国内地址和调用协议。

按用户要求发布；原生 Windows 冷安装、MCP GUI、真实账号和模型质量不在本轮已验范围。保留旧发行包、失败记录与回退入口。
