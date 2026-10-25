# 12. MoA：让几个模型一起想

建议 30 分钟

**目标**：知道何时多模型有帮助，能控制费用并验证最终答案。

**准备**：至少有一个可用主模型；参考模型需独立可用且已授权。只看教学无需真实调用。

## 手把手操作

1. 先用一个模型完成小任务，记下耗时、验证结果和可得的用量。

   **应看到**：有可比较的单模型基线。

2. 按本课命令登记reference模型，先单独诊断它，再配置MoA引用。

   **应看到**：参考模型不是随便一个名字；密钥和产品路线对应。

3. 用同一任务与输入开启MoA，观察参考意见如何合并。

   **应看到**：主执行者负责工具与审批；参考意见没有独立操作权限。

4. 比较结果正确性、时间和费用，再决定是否保留。

   **应看到**：没有用量就写未知；every_step可能增加请求，不因模型多就默认更好。

## 常见问题与恢复

- **参考模型不可用**：先关闭该引用并检查配置；不要切到未经同意的计费路线。
- **意见互相矛盾**：回到事实、测试和来源，不按票数判断对错。

## 作业与自查

用两种方案解释一个购物车bug，列出共同证据与分歧；只采用能被测试支持的结论。

**自查标准**：能说明额外模型提供了什么信息，不能以“大家都同意”代替测试。

## 开发者教学

1. 固定模型、任务输入与预算做对照；不要换更大模型后把提升归因给编排。

2. 用 koder harness status 查看任务配置；JIT配置与MoA是不同层，均不扩大权限。

3. 记录成本、步数、失败与回退；未经证实的经验保留NO_ENTRY，不自动激活。

交件要求：按本课步骤选择自有测试目标，保存前置、实际命令/退出码、产物、正反例、未验和恢复方式。使用 [验收模板](../tutorial-labs/acceptance-template.md)。

## 延伸阅读

- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HARNESS-INCREMENTAL.md](../HARNESS-INCREMENTAL.md)

<details><summary>powershell · 原教练讲解与命令</summary>

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 12 课 / 共 30 课 · MoA：让几个模型一起想 ━━
教练 › 遇到难题，一个模型容易钻牛角尖。MoA（Mixture of Agents）的做法是：几个参考模型先各自给意见，当前模型把意见当私下参考，汇总以后再动手。
    koder model add reference --preset custom --base-url https://your-provider.example/v1 --model YOUR_MODEL --key-env MODEL_API_KEY
        先登记参考模型，可以登记好几个
    koder moa set --refs reference
        建一个 MoA 预设
    koder --moa "重构支付模块并补测试"
        用 MoA 跑任务；对话里输入 /moa 随时开关
    koder moa set --fanout every_step
        默认每个用户回合问一次参考模型；every_step 每一步都问，更准也更费钱
教练 › MoA 里的参考模型能不能直接改你的文件？
    1. 不能。它们只给建议，动手的还是汇总模型，而且照样要你确认
    2. 能，人多力量大
    3. 只能改 README
  答案：1。对。参考模型手里没有任何工具，连一个文件都读不了。
  （小声）MoA 就像开会：大家都可以发言，但最后拍板的只有一个人——而那个人还得问你同不同意。
```

</details>

<details><summary>cmd · 原教练讲解与命令</summary>

```text
这份文字版按「Windows 命令提示符（CMD）」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 12 课 / 共 30 课 · MoA：让几个模型一起想 ━━
教练 › 遇到难题，一个模型容易钻牛角尖。MoA（Mixture of Agents）的做法是：几个参考模型先各自给意见，当前模型把意见当私下参考，汇总以后再动手。
    koder model add reference --preset custom --base-url https://your-provider.example/v1 --model YOUR_MODEL --key-env MODEL_API_KEY
        先登记参考模型，可以登记好几个
    koder moa set --refs reference
        建一个 MoA 预设
    koder --moa "重构支付模块并补测试"
        用 MoA 跑任务；对话里输入 /moa 随时开关
    koder moa set --fanout every_step
        默认每个用户回合问一次参考模型；every_step 每一步都问，更准也更费钱
教练 › MoA 里的参考模型能不能直接改你的文件？
    1. 不能。它们只给建议，动手的还是汇总模型，而且照样要你确认
    2. 能，人多力量大
    3. 只能改 README
  答案：1。对。参考模型手里没有任何工具，连一个文件都读不了。
  （小声）MoA 就像开会：大家都可以发言，但最后拍板的只有一个人——而那个人还得问你同不同意。
```

</details>

<details><summary>mac · 原教练讲解与命令</summary>

```text
这份文字版按「macOS 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 12 课 / 共 30 课 · MoA：让几个模型一起想 ━━
教练 › 遇到难题，一个模型容易钻牛角尖。MoA（Mixture of Agents）的做法是：几个参考模型先各自给意见，当前模型把意见当私下参考，汇总以后再动手。
    koder model add reference --preset custom --base-url https://your-provider.example/v1 --model YOUR_MODEL --key-env MODEL_API_KEY
        先登记参考模型，可以登记好几个
    koder moa set --refs reference
        建一个 MoA 预设
    koder --moa "重构支付模块并补测试"
        用 MoA 跑任务；对话里输入 /moa 随时开关
    koder moa set --fanout every_step
        默认每个用户回合问一次参考模型；every_step 每一步都问，更准也更费钱
教练 › MoA 里的参考模型能不能直接改你的文件？
    1. 不能。它们只给建议，动手的还是汇总模型，而且照样要你确认
    2. 能，人多力量大
    3. 只能改 README
  答案：1。对。参考模型手里没有任何工具，连一个文件都读不了。
  （小声）MoA 就像开会：大家都可以发言，但最后拍板的只有一个人——而那个人还得问你同不同意。
```

</details>

<details><summary>linux · 原教练讲解与命令</summary>

```text
这份文字版按「Linux / Ubuntu 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 12 课 / 共 30 课 · MoA：让几个模型一起想 ━━
教练 › 遇到难题，一个模型容易钻牛角尖。MoA（Mixture of Agents）的做法是：几个参考模型先各自给意见，当前模型把意见当私下参考，汇总以后再动手。
    koder model add reference --preset custom --base-url https://your-provider.example/v1 --model YOUR_MODEL --key-env MODEL_API_KEY
        先登记参考模型，可以登记好几个
    koder moa set --refs reference
        建一个 MoA 预设
    koder --moa "重构支付模块并补测试"
        用 MoA 跑任务；对话里输入 /moa 随时开关
    koder moa set --fanout every_step
        默认每个用户回合问一次参考模型；every_step 每一步都问，更准也更费钱
教练 › MoA 里的参考模型能不能直接改你的文件？
    1. 不能。它们只给建议，动手的还是汇总模型，而且照样要你确认
    2. 能，人多力量大
    3. 只能改 README
  答案：1。对。参考模型手里没有任何工具，连一个文件都读不了。
  （小声）MoA 就像开会：大家都可以发言，但最后拍板的只有一个人——而那个人还得问你同不同意。
```

</details>
