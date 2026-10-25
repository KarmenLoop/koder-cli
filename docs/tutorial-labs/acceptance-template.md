# Learning acceptance record / 学习验收记录

- Lesson / 课程：
- Date, version, platform / 日期、版本、平台：
- Workspace, target, owner / 工作区、目标、归属：
- Prerequisites and consent / 前置条件与授权：
- Goal and invariant / 目标与不变量：

| Command or action / 命令或操作 | Expected / 预期 | Actual exit/result / 实际退出码或结果 | Evidence path / 证据路径 | PASS / FAIL / NOT_RUN / UNKNOWN |
| --- | --- | --- | --- | --- |
| | | | | |

## Failure and recovery / 失败与恢复

Record the first failure, what changed, and which checks were repeated. Never replace the original failure record. / 保留首次失败、修复和重跑范围，不覆盖失败记录。

## Side effects and cleanup / 副作用与清理

Name the owned files/windows/repositories. External writes require appropriate authorization; reconcile unknown effects before retrying. / 写明自有资源；外部写入需相应授权，未知结果先对账。

## Not tested / 未验

Keep device, real-model, account, signing and publication boundaries separate. / 设备、真实模型、账号、签名与发布分别说明。
