# 带来源的项目记忆

[English](DEERFLOW-MEMORY.en.md) · [简体中文](DEERFLOW-MEMORY.zh.md)

Koder CLI 0.8.4 在原有本地记忆与上下文链路中加入相关事实召回，保留用户原话、来源与范围。不增加第二个数据库、云记忆、重复 Skill、后台抽取模型或替代执行器。

## 记住、查看、更正与遗忘

从 [CLI 官网](https://kodermodule.com/cli-download.html)安装并核对版本，进入自己的项目；练习过程中保持同一账号与工作区。以下命令适用于 0.8.4，旧安装版不会因教程新增就获得这些接口。

```sh
cd /path/to/your-project
koder learning init
koder learning remember database "PostgreSQL"
koder learning facts --json
koder learning correct database "SQLite"
koder learning facts --json
koder learning forget database
koder learning facts --json
koder learning status --json
```

`database` 是记忆键，不是数据库连接。更正和遗忘时使用 `facts` 列出的实际键；本例只记录偏好，不会创建或迁移数据库。在正常可写对话中，明确输入 `记住：数据库 = PostgreSQL`，可供同账号、同工作区的新会话使用；普通任务进度继续属于原任务。请读回事实与来源，不把模型的口头回应当成已使用该事实的证明。

## 保留的边界

- 来源必须是实际用户证据。网页、工具结果和助手结论不能只靠一个来源 ID 就变成用户偏好。
- 相同文本合并来源；相似文本不自动合并。同范围、同键的不同值保留为冲突，解决前不自动召回其中一个版本。
- 更正或遗忘会推进记忆修订，重启后也会拒绝旧证据的迟到写入。新用户指令可以重新确认事实，旧工具重放不能使它复活。
- 遗忘停止该事实的后续召回，原对话、任务检查点和审计事件仍保留，不等于清除全部历史副本或跨设备擦除。
- 召回按英文词与中文二字词匹配，不是向量嵌入。完整事实与来源受原上下文预算约束；压缩保留当前任务约束和证据标识，召回文字仍占正常模型上下文 token。
- 原 Setup 开关、`koder learning off`、`--no-learning`、`--no-memory` 继续控制捕获和注入；已有关闭选择仍有效，个性化画像保留独立启用授权。记忆不能增加工具权限，也不能证明任务完成。

任务级事实及完整命令说明见 [Markdown 学习库](MARKDOWN-LEARNING.zh.md#带来源记忆同工作区跨会话使用)。

## 设计参考与验收

设计参考 [ByteDance DeerFlow 的固定提交](https://github.com/bytedance/deer-flow/tree/12c304f12ce5c0bf66d8927386e5dd18ea84f685)，其上游采用 [MIT 许可](https://github.com/bytedance/deer-flow/blob/12c304f12ce5c0bf66d8927386e5dd18ea84f685/LICENSE)。Koder 使用自己的原生 JavaScript 实现和既有存储，不嵌入上游 Python harness、DeerMem 服务或 FTS5 数据库，也不宣称完整兼容 DeerFlow。

0.8.4 冻结记录包含 **23/23 项实际包记忆内核检查通过**，覆盖受控本地行为与上下文边界，不是新的真实模型质量分。Windows/Ubuntu 原生执行、网络文件系统、跨设备并发和真实模型记忆质量仍为 **NOT_RUN**。官网发布与公网下载检查见[发行说明](RELEASE-0.8.4.zh.md#发行核对与未验范围)；内核开发源码继续私有，既有第三方权益保留。

产品方另记录一次隔离 CLI 练习，使用结构化输出完成 8 项事实管理操作：PostgreSQL → SQLite → 无活跃事实，修订为 1 → 2 → 3，最终 epoch 2，来源审计保留。记录器补充 `--json` 便于断言；没有调用模型或真实账号，这是本地事实读回，不是跨会话模型召回或质量分验收。
