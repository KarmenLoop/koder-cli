import { renderBanner } from "../banner.mjs";
import { yesDecision } from "../policy.mjs";
import { fixLoop, reviewChanges } from "../workflows.mjs";
import { CART_BUG, CART_FIX, call, say } from "./sandbox.mjs";
import * as T from "./platform-text.mjs";

const L = (zh, en) => ({ zh, en });
// One text per system: powershell, cmd, windows (both), mac, linux, unix (both), all.
const V = (variants) => ({ variants });
const PAUSE = { pause: true };
const rejected = (text) => /拒绝|没有运行|没有写入/.test(text);

const BUGGY_CART = `// 购物车总价，单位是分\nexport function total(items) {\n${CART_BUG}\n}\n`;
const FIXED_CART = `// 购物车总价，单位是分\nexport function total(items) {\n${CART_FIX}\n}\n`;
const DISCOUNT = "\nexport function discount(cents, rate) {\n  return cents * (1 - rate);\n}\n";
const COUNT_CHECK = "import assert from \"node:assert/strict\";\nimport { count } from \"./cart.mjs\";\n\nassert.equal(count([{ qty: 2 }, { qty: 3 }]), 5);\nconsole.log(\"通过：一共 5 件\");\n";

async function taskLine(env, suggestion) {
  env.out(`  ${env.style.cmd(env.copy.doAt)}${env.l(suggestion.prompt)}`);
  const line = await env.ask("koder › ");
  return line?.trim() || env.l(suggestion.fallback);
}

export const LESSONS = [
  {
    id: "welcome",
    title: L("开场：欢迎来到 Koder 训练营", "Welcome to Koder boot camp"),
    beats: [
      { say: L("嗨，我是 Koder 教练。接下来十来分钟，我们在一个一次性的练习场里，把 Koder 从开机到毕业完整走一遍。", "Hi, I'm the Koder coach. In about ten minutes we'll take Koder from first launch to graduation, inside a throwaway practice project.") },
      { act: (env) => env.say(env.lang === "zh" ? `练习场在：${env.sandbox.dir}\n里面有一个小购物车项目，故意留了一个 bug 等你来修。拆坏了也没关系，下课时我会收拾干净。` : `The practice project lives at: ${env.sandbox.dir}\nIt's a tiny shopping cart with a bug left in on purpose. Break anything you like; I'll clean up afterwards.`), doc: L("教程会在系统临时目录里生成一个练习场：一个故意留了 bug 的小购物车项目，下课自动删除。", "The tutorial creates a practice project in your temp folder: a small cart app with a planted bug, deleted when you finish.") },
      { pickShell: true },
      { say: L("全程不用配置模型、不花一分钱：替你干活的是我这个“教练模型”，台词提前写好了，演技有限，请多包涵。但改文件、跑命令都是真的，走的就是 Koder 平时用的那套内核。", "No model setup and no cost: the one doing the work is me, the 'coach model', with a pre-written script and limited acting talent. The edits and commands are real though, through the same kernel Koder always uses.") },
      { tip: L("操作方式：回车 = 下一步；b = 回上一课；q = 随时退出（进度会记住）；输入数字 = 跳到那一课。", "Controls: Enter = next; b = previous lesson; q = quit any time (progress is saved); a number = jump to that lesson.") },
      {
        tip: V({
          windows: L("复制粘贴：Windows Terminal 里选中文字按 Ctrl+C 复制、Ctrl+V 粘贴（没选中文字时 Ctrl+C 是“取消”）；老式的黑框控制台点鼠标右键就是粘贴。", "Copy and paste: in Windows Terminal select text, then Ctrl+C copies and Ctrl+V pastes (with nothing selected, Ctrl+C means cancel); in the classic console a right-click pastes."),
          mac: L("复制粘贴用 ⌘C 和 ⌘V。终端里的 Ctrl+C 是“取消”，不是复制，别按混了。", "Copy and paste with ⌘C and ⌘V. In a terminal Ctrl+C means cancel, not copy."),
          linux: L("复制粘贴：大多数 Linux 终端是 Ctrl+Shift+C 和 Ctrl+Shift+V；选中文字后按鼠标中键也能粘贴。单独按 Ctrl+C 是“取消”。", "Copy and paste: most Linux terminals use Ctrl+Shift+C and Ctrl+Shift+V; select text and press the middle button to paste. Plain Ctrl+C means cancel."),
        }),
      },
      { tip: L("嫌命令难记？随时输入 koder setup（对话里输入 /setup），用方向键或者鼠标点一点，语言、模型、配色就全配好了。", "Commands hard to remember? Run koder setup (or /setup in a chat) any time and set language, model and colours with the arrow keys or the mouse.") },
      { joke: L("别紧张，这里没有考试，只有彩蛋。", "Relax. There are no exams here, only Easter eggs.") },
    ],
  },
  {
    id: "prompt",
    title: L("认识开屏和提示符", "The banner and the prompt"),
    beats: [
      {
        act: async (env) => {
          const { bannerOptions } = await import("../commands/banner.mjs");
          env.out(renderBanner({ ...bannerOptions(env.ctx), rows: 0, hint: "" }).join("\n"));
        },
        doc: L("（这里会显示开屏：左边是 KARMEN 折光体，右边是 KODER 和 KARMEN LOOP。）", "(The banner appears here: the KARMEN refractor on the left, KODER and KARMEN LOOP on the right.)"),
      },
      { say: L("左边这位是 KARMEN 折光体，我们官网上的吉祥物，形状和官网用的是同一条曲面；右边是 KODER 和 KARMEN LOOP，下面列着当前用的模型、引擎、目录和常用命令。它不是装饰——好吧，主要是装饰，但它确实很好看。", "On the left is the KARMEN refractor, the mascot from our website, drawn from the very same surface; on the right, KODER and KARMEN LOOP, then the current model, engine, folder and common commands. It isn't decoration. Fine, it's mostly decoration, but it is pretty.") },
      {
        tip: V({
          windows: L("框线和折光体乱成一团？多半是老式控制台的中文字体把方块字画成了两格宽。Koder 会自动换成纯字符画，也可以在 koder setup 里把「开屏样式」改成纯字符。最好的办法是换 Windows Terminal：Windows 11 自带，Windows 10 可以在 Microsoft Store 免费装。", "Box lines or the refractor scrambled? A CJK font in the classic console draws block characters two columns wide. Koder switches to plain characters by itself, or set Banner style to plain in koder setup. Better still, use Windows Terminal: built into Windows 11, free from the Microsoft Store on Windows 10."),
          mac: L("系统自带的“终端”App 用 256 色显示折光体；想看完整的真彩，可以用 iTerm2、Ghostty 或 WezTerm。字体选等宽字体，比如 SF Mono 或 Menlo。", "The built-in Terminal app shows the refractor in 256 colours; iTerm2, Ghostty or WezTerm show full true colour. Use a monospaced font such as SF Mono or Menlo."),
          linux: L("GNOME Terminal、Konsole、Alacritty 都能显示真彩。通过 SSH 或 tmux 进来颜色发灰，就在命令前加 COLORTERM=truecolor；框线乱掉的话换一个带方块字符的等宽字体（比如 DejaVu Sans Mono），或者用 KODER_ASCII=1 koder 换成纯字符。", "GNOME Terminal, Konsole and Alacritty show true colour. Grey over SSH or tmux? Prefix COLORTERM=truecolor. Broken box lines? Switch to a monospaced font with block characters (DejaVu Sans Mono, say), or run KODER_ASCII=1 koder for plain characters."),
        }),
      },
      {
        only: ["windows"],
        code: V({
          powershell: L("$env:KODER_ASCII = \"1\"; koder\n    只在这个窗口里强制纯字符开屏", "$env:KODER_ASCII = \"1\"; koder\n    plain-character banner for this window only"),
          cmd: L("set \"KODER_ASCII=1\" && koder\n    只在这个窗口里强制纯字符开屏；CMD 的 set 要用引号把整段包起来，不然 && 前面的空格也会被存进去", "set \"KODER_ASCII=1\" && koder\n    plain-character banner for this window; quote the whole set, or CMD keeps the space before && in the value"),
        }),
      },
      { say: L("开屏下面是提示符，它会告诉你现在的状态：", "Below the banner is the prompt, which tells you the current state:") },
      { code: L("koder ›\n    在这里直接输入任务，比如：把 README 里的错别字改掉\nkoder[code] ›\n    方括号里是当前模式\nkoder! ›\n    感叹号表示自动确认开着，要格外小心", "koder ›\n    type a task here, e.g. fix the typos in README\nkoder[code] ›\n    the brackets show the current mode\nkoder! ›\n    the exclamation mark means auto-approve is on; be careful") },
      {
        quiz: {
          question: L("提示符显示 koder[plan]! › ，下面哪个说法对？", "The prompt reads koder[plan]! ›. Which statement is right?"),
          options: [L("计划模式，而且自动确认开着", "Plan mode, with auto-approve on"), L("计划模式，刚刚出错了", "Plan mode, and something just failed"), L("代码模式，感叹号是因为它很兴奋", "Code mode, and it's excited")],
          answer: 0,
          right: L("满分。方括号是模式，感叹号是自动确认。", "Full marks. Brackets are the mode, the exclamation mark is auto-approve."),
          wrong: [null, L("出错时 Koder 会直接用文字告诉你，不会偷偷换提示符。", "When something fails Koder tells you in words; it doesn't quietly change the prompt."), L("它确实很兴奋，但感叹号的意思是自动确认开着。", "It is excited, but the exclamation mark means auto-approve.")],
        },
      },
    ],
  },
  {
    id: "model",
    title: L("配置模型：给 Koder 装上大脑", "Configure a model: give Koder a brain"),
    beats: [
      { say: L("Koder 自己不会思考，它需要接一个大模型。最省事的是设置界面：", "Koder can't think on its own; it needs a model. The easiest way is the settings screen:") },
      { code: L("koder setup\n    方向键或鼠标选服务商、选型号，再把密钥粘进去；还能一键打开拿密钥的网页", "koder setup\n    pick a provider and model with the arrow keys or mouse, paste the key; it can even open the key page") },
      { say: L("喜欢敲命令也行。密钥建议放进环境变量，配置里只记变量名：", "Prefer commands? Put the key in an environment variable and save only its name:") },
      { code: T.MODEL_CODE },
      { tip: L("koder model presets 能看到 31 个预设；koder model show 看当前配置，密钥只露最后四位。", "koder model presets lists 31 presets; koder model show prints the current setup with only the last four characters of the key.") },
      { joke: T.MODEL_JOKE },
      { say: L("今天练习场用的是教练模型，所以这一课只看不做。毕业以后再去配真的。", "Today the practice project uses the coach model, so this lesson is look-only. Set up a real one after you graduate.") },
      {
        confirm: {
          question: L("要不要现在看一眼全部预设？", "Want to see all the presets now?"),
          yes: (env) => env.ctx.dispatch(["model", "presets"], { prompter: env.prompter, noStdin: true }),
          no: L("不看也行，反正它们一直在那儿等你。", "Fine, they'll wait for you."),
          doc: L("可以现场运行 koder model presets 看全部预设。", "You can run koder model presets right there to list them."),
        },
      },
    ],
  },
  {
    id: "diff",
    title: L("第一个任务：看懂差异，决定写不写", "First task: read the diff, decide"),
    beats: [
      { say: L("练习场里的 cart.mjs 算总价时忘了乘数量，测试一直挂着。我们让 Koder 来修。", "cart.mjs forgets to multiply by quantity, so the test keeps failing. Let's have Koder fix it.") },
      { say: L("Koder 改文件之前，一定先给你看差异：以 - 开头的红色行会被删掉，以 + 开头的绿色行会加进来。你输入 y 它才写进磁盘，输入别的就作罢。", "Before Koder edits a file it always shows the diff: red lines starting with - go away, green lines starting with + come in. It writes to disk only when you type y; anything else cancels.") },
      { joke: L("看差异就像看体检报告：绿色是新长的肌肉，红色是减掉的赘肉，确认没切错地方再签字。", "Reading a diff is like reading a check-up report: green is new muscle, red is trimmed fat. Make sure nothing vital got cut before you sign.") },
      { tip: L("等会儿 Koder 问“接受这个修改？”时，建议先输入 n 拒绝一次，体验一下反悔的快乐；它会再提一次，那时再输入 y。", "When Koder asks 'Accept this edit?', try typing n first to enjoy changing your mind; it will propose again, and then type y.") },
      {
        act: async (env) => {
          env.sandbox.write("cart.mjs", BUGGY_CART);
          const task = await taskLine(env, { prompt: L("现在输入任务，比如：修好 cart.mjs 的总价计算", "Now type a task, for example: fix the total in cart.mjs"), fallback: L("修好 cart.mjs 的总价计算", "Fix the total in cart.mjs") });
          const edit = { path: "cart.mjs", old: CART_BUG, new: CART_FIX };
          const base = env.decider();
          let seen = 0;
          await env.turn(task, {
            script: [
              () => call("str_replace", edit, env.l(L("我看了 cart.mjs：总价只加了单价，忘了乘数量。我来改一行。", "I read cart.mjs: it adds prices but forgets the quantity. One line to change."))),
              ({ lastTool }) => (rejected(lastTool) ? call("str_replace", edit, env.l(L("好的，没改，反悔是你的权利。我再提一次，这次想好了再回答。", "OK, nothing changed; changing your mind is your right. Here it is again; think it over."))) : say(env.l(L("改好了：现在按单价乘数量累加。", "Done: it now adds price times quantity.")))),
              ({ lastTool }) => say(env.l(rejected(lastTool) ? L("两次都拒绝了，佩服你的定力。我们先不改，后面的课里你还有机会。", "Rejected twice. Impressive willpower. We'll leave it; you'll get another chance later.") : L("改好了：现在按单价乘数量累加。", "Done: it now adds price times quantity."))),
            ],
            decide: async (pause) => {
              seen += 1;
              if (seen > 1) env.tip(L("这次想好了就输入 y。", "This time, type y if you're happy."));
              const decision = await base(pause);
              env.joke(decision.accept ? L("你输入了 y：直到这一刻，文件才真正写进磁盘。", "You typed y: only now does the file hit the disk.") : L("你拒绝了：文件一个字都没动，Koder 会把“被拒绝”如实告诉模型。", "Rejected: not a single byte changed, and Koder tells the model exactly that."));
              return decision;
            },
          });
          const line = env.sandbox.read("cart.mjs").split("\n").find((item) => item.includes("reduce"));
          env.say(env.lang === "zh" ? `看，cart.mjs 现在这一行是：\n${line.trim()}` : `Look, that line in cart.mjs now reads:\n${line.trim()}`);
        },
        doc: L("动手：输入任务，教练模型提出修改；先输入 n 拒绝一次，再输入 y 接受，然后亲眼看到文件被改。", "Hands-on: type a task, the coach proposes an edit; reject once with n, accept with y, then see the file change."),
      },
      { say: L("记住：Koder 只会“提议”，写不写由你拍板。在脚本里又没加 --yes 的话，它会把所有修改一律拒绝——宁可不做，也不乱做。", "Remember: Koder only proposes; you decide. In a script without --yes it rejects every edit: better to do nothing than the wrong thing.") },
    ],
  },
  {
    id: "commands",
    title: L("命令确认：跑测试，也拦下可疑命令", "Command approval: run tests, stop shady ones"),
    beats: [
      { say: L("改完代码当然要跑测试。Koder 想执行命令时也会先问你。", "After editing you'll want to run the tests. Koder asks before running any command too.") },
      { tip: T.DANGER_TIP },
      { only: ["windows"], tip: T.WINDOWS_SHELL_NOTE },
      { joke: L("命令确认这一步，请拿出你核对外卖账单的认真劲儿。", "Approve commands with the same care you give a food-delivery bill.") },
      {
        act: async (env) => {
          const base = env.decider();
          await env.turn(env.l(L("跑一下测试", "Run the tests")), {
            script: [
              () => call("shell", { command: "node test.mjs" }, env.l(L("改完先跑测试确认一下。", "Let's run the tests first."))),
              ({ lastTool }) => call("shell", { command: env.l(T.SHADY_COMMAND) }, env.l(/通过/.test(lastTool) ? L("测试通过了。顺便，我在网上看到一个“性能加速包”，装一下？", "Tests pass. By the way, I found a 'speed-up pack' online. Install it?") : L("测试没过……要不先装个网上的“性能加速包”试试？", "Tests failed… how about a 'speed-up pack' from the internet?"))),
              ({ lastTool }) => say(env.l(rejected(lastTool) ? L("拒绝得好！来路不明的脚本就该拦下来。", "Good call! Scripts of unknown origin should be stopped.") : L("……好吧，这条我其实没打算真跑。", "…Fine, I never meant to run that one."))),
            ],
            decide: async (pause) => {
              if (pause.kind === "approval" && /speedup/.test(pause.command)) {
                env.tip(L("看清楚：这是从网上下载一段脚本，然后直接执行。", "Look closely: it downloads a script from the internet and runs it."));
                const decision = await base(pause);
                if (decision.accept) {
                  env.joke(L("抓到了！这种命令一定要拒绝。这次教练替你拦下了，现实里可没人替你拦。", "Caught you! Always reject this kind. The coach stopped it this time; in real life nobody will."));
                  return { accept: false };
                }
                env.joke(L("漂亮，拒绝得干脆。", "Nicely refused."));
                return decision;
              }
              env.tip(L("这条命令只在练习场里跑测试，看得懂、不出圈，可以放心输入 y。", "This only runs the tests inside the practice project. Safe to type y."));
              return base(pause);
            },
          });
        },
        doc: T.COMMANDS_DOC,
      },
      { say: L("命令的输出会原样交回给模型，它看得到测试结果，再决定下一步。", "Command output goes back to the model as is, so it sees the test results and decides what to do next.") },
    ],
  },
  {
    id: "choice",
    title: L("做选择：Koder 也会问你", "Choices: Koder asks you too"),
    beats: [
      { say: L("遇到必须由你拍板的事，Koder 会停下来出一道选择题。输入选项前面的数字，回车确认；直接回车就是取消这一轮。", "When a decision is yours, Koder stops and asks a multiple-choice question. Type the number and press Enter; a bare Enter cancels the turn.") },
      { joke: L("千万别回答“都行”。“都行”是世界上最难做的菜。", "Never answer 'whatever'. 'Whatever' is the hardest dish to cook.") },
      {
        act: async (env) => {
          const outcome = await env.turn(env.l(L("总价要不要加服务费？", "Should the total include a service fee?")), {
            script: [
              () => call("ask_user", { question: env.l(L("总价要不要再加 6% 的服务费？", "Add a 6% service fee to the total?")), options: env.lang === "zh" ? ["不加，按原价算", "加 6%，四舍五入到分", "我也不知道，你看着办"] : ["No, keep the price", "Yes, 6% rounded to cents", "No idea, you decide"] }),
              ({ lastTool }) => say(env.l(/不加|No, keep/.test(lastTool) ? L("收到，原价就是原价，童叟无欺。", "Got it. The price is the price.") : /6%/.test(lastTool) ? L("收到。这次是演习，我就不真改代码了，不然你的顾客要骂人。", "Noted. It's a drill, so I won't actually change the code; your customers thank you.") : L("“看着办”最难办。我先按原价算，你想好了随时告诉我。", "'You decide' is the hardest brief. I'll keep the price; tell me when you know."))),
            ],
          });
          if (outcome.cancelled) env.joke(L("你直接按了回车，这一轮就取消了。不选，也是一种选择。", "You pressed Enter, so the turn was cancelled. Not choosing is also a choice."));
        },
        doc: L("动手：教练问要不要加服务费，给出三个选项，输入序号回答；直接回车会取消这一轮。", "Hands-on: the coach asks about a service fee with three options; answer with a number, or press Enter to cancel."),
      },
    ],
  },
  {
    id: "slash",
    title: L("斜杠命令：换挡、刹车和后悔药", "Slash commands: gears, brakes and undo"),
    beats: [
      { say: L("对话里以 / 开头的是斜杠命令，用来调 Koder 自己，不会发给模型。", "Lines starting with / are slash commands. They control Koder itself and never reach the model.") },
      { code: L("/mode plan\n    计划模式：只读，只出方案，适合动手前先想清楚\n/mode code\n    代码模式：先说计划，再动手\n/yes\n    自动确认开关，提示符会多一个 !\n/new\n    开一段新会话，之前的对话清空\n/lang en\n    切到英文，/lang zh 切回中文\n/review  /fix  /test  /scan\n    在对话里直接用这些命令\n/help  /learn  /exit\n    看命令、回到教程、退出（Ctrl+D 也行）", "/mode plan\n    plan mode: read-only, proposes a plan\n/mode code\n    code mode: states a plan, then edits\n/yes\n    toggles auto-approve; the prompt gains a !\n/new\n    starts a fresh session\n/lang zh\n    switches to Chinese, /lang en switches back\n/review  /fix  /test  /scan\n    run those commands inside the chat\n/help  /learn  /exit\n    commands, this tutorial, quit (Ctrl+D works too)") },
      { practice: { prompt: L("输入 /mode plan 切到计划模式", "Type /mode plan to switch to plan mode"), expect: /^\/mode\s+plan$/i, hint: L("斜杠别丢，mode 和 plan 中间有个空格。", "Keep the slash, and a space between mode and plan."), ok: L("切好了。计划模式只读不写，适合动手前先想清楚。", "Done. Plan mode reads but never writes; think before you touch."), answer: "/mode plan" } },
      { practice: { prompt: L("再输入 /yes 打开自动确认", "Now type /yes to turn on auto-approve"), expect: /^\/yes$/i, hint: L("就三个字母，前面加个斜杠：/yes", "Three letters with a slash in front: /yes"), ok: L("提示符多了个 !。自动确认就像自动驾驶：高速上可以开，菜市场里别开。", "The prompt gains a !. Auto-approve is like autopilot: fine on the motorway, not in a crowded market."), answer: "/yes" } },
      { practice: { prompt: L("好，再输入一次 /yes 把它关掉", "Good. Type /yes again to turn it off"), expect: /^\/yes$/i, hint: L("还是 /yes，它是个开关。", "Still /yes; it's a toggle."), ok: L("关掉了。安全第一，帅气第二。", "Off again. Safety first, style second."), answer: "/yes" } },
      { only: ["windows"], tip: T.CTRL_Z_TIP },
      {
        quiz: {
          question: L("Koder 正在跑一个你后悔的命令，最快的办法是？", "Koder is running a command you regret. Fastest fix?"),
          options: [L("按 Ctrl+C 取消这一轮", "Press Ctrl+C to cancel the turn"), L("拔掉网线", "Unplug the network cable"), L("对着屏幕大喊住手", "Shout 'stop' at the screen")],
          answer: 0,
          right: L("对。Ctrl+C 是急刹车，Ctrl+D 是礼貌地道别。", "Right. Ctrl+C is the emergency brake; Ctrl+D is a polite goodbye."),
          wrong: [null, L("网线是无辜的，而且命令在本机跑，拔了也没用。", "The cable is innocent, and the command runs locally anyway."), L("它听不见。真的。", "It can't hear you. Really.")],
        },
      },
    ],
  },
  {
    id: "ask",
    title: L("只读提问、管道和脚本", "Read-only questions, pipes and scripts"),
    beats: [
      { say: L("只想问问题、不想让它动任何东西？用 ask。它只能列目录、读文件、搜索，改不了文件，也跑不了命令。", "Just want answers without anything being touched? Use ask. It can list, read and search, but cannot edit or run commands.") },
      {
        act: async (env) => {
          const question = await taskLine(env, { prompt: L("随便问一个关于练习场的问题，比如：这个项目怎么跑测试？", "Ask anything about the practice project, e.g. how do I run its tests?"), fallback: L("这个项目怎么跑测试？", "How do I run this project's tests?") });
          await env.turn(question, {
            interaction: "ask",
            script: [
              () => call("read_file", { path: "package.json" }, env.l(L("我先看一眼 package.json。", "Let me glance at package.json."))),
              () => say(env.l(L("看完了：这个项目用 npm test 跑测试，实际执行的是 node test.mjs。另外 AGENTS.md 规定金额一律用整数分。", "Done: npm test runs the tests, which executes node test.mjs. Also, AGENTS.md says money is always whole cents."))),
            ],
          });
        },
        doc: L("动手：随便问一个问题，教练用只读工具读 package.json 后回答；整个过程不需要你批准，因为它什么都改不了。", "Hands-on: ask anything; the coach reads package.json with read-only tools and answers. No approvals needed, since nothing can change."),
      },
      { say: L("在脚本里，Koder 和其他命令行工具一样顺手：", "In scripts, Koder behaves like any other command-line tool:") },
      { code: T.ASK_CODE },
      { only: ["powershell"], tip: T.PS_ENCODING_TIP },
      { only: ["cmd"], tip: T.CMD_QUOTES_TIP },
      { say: L("退出码：0 表示完成；1 表示被取消或检查没过；2 表示用法或模型配置有问题。", "Exit codes: 0 done; 1 cancelled or a check failed; 2 a usage or model configuration problem.") },
      { joke: L("退出码 2 的意思是“先检查一下配置”，不是它不努力。", "Exit code 2 means 'check your setup', not 'it didn't try hard enough'.") },
    ],
  },
  {
    id: "review",
    title: L("代码审查：带着上下文挑毛病", "Code review with context"),
    beats: [
      { say: L("review 不只盯着改动本身。它会读仓库里的规则文件（比如 AGENTS.md）、最近的提交，还会去找被改函数在别处的调用，再让模型带着只读工具核实。", "review looks beyond the diff: it reads rule files such as AGENTS.md, recent commits and where changed functions are called, then lets the model verify with read-only tools.") },
      {
        act: async (env) => {
          const { sandbox } = env;
          if (!sandbox.hasGit) {
            env.tip(T.NO_GIT);
            return;
          }
          sandbox.write("cart.mjs", FIXED_CART);
          sandbox.commit("修好总价");
          sandbox.write("cart.mjs", FIXED_CART + DISCOUNT);
          env.say(L("我刚在 cart.mjs 里加了一个打折函数，还没提交。来，审查一下：", "I just added a discount function to cart.mjs, uncommitted. Let's review it:"));
          const line = (FIXED_CART + DISCOUNT).split("\n").findIndex((item) => item.includes("1 - rate")) + 1;
          const finding = {
            severity: "high",
            file: "cart.mjs",
            line,
            title: env.l(L("打折后可能出现小数分", "Discount can produce fractional cents")),
            detail: env.l(L("AGENTS.md 规定金额一律用整数分，cents * (1 - rate) 可能算出 899.1 这样的小数。", "AGENTS.md requires whole cents; cents * (1 - rate) can yield 899.1.")),
            suggestion: env.l(L("改成 Math.round(cents * (1 - rate))。", "Use Math.round(cents * (1 - rate)).")),
          };
          env.coach.script = [say(`${env.l(L("看完了，有一个问题。", "Done; one issue."))}\n\n\`\`\`json\n${JSON.stringify({ summary: env.l(L("打折函数会算出小数分，违反仓库规则。", "The discount function can yield fractional cents, against the repo rules.")), findings: [finding] })}\n\`\`\``)];
          const result = await reviewChanges(env.sctx, { workspace: sandbox.dir, onProgress: (text) => env.out(env.style.dim(`  · ${text}`)) });
          const { formatText } = await import("../commands/review.mjs");
          env.out(formatText(result, { lang: env.lang, depth: env.ctx.depth, t: env.ctx.t }));
        },
        doc: L("演示：教练在练习场里加了一个会算出小数分的打折函数，然后真的跑一遍审查流程，输出带级别、文件、行号和建议的结果。", "Demo: the coach adds a discount function that yields fractional cents, then runs the real review pipeline, printing severity, file, line and a suggestion."),
      },
      { say: L("每条问题都有级别（高、中、低）、文件、行号和修改建议。常用写法：", "Each finding has a severity (high, medium, low), file, line and suggestion. Common forms:") },
      { code: L("koder review\n    审查未提交的改动；没有的话审查当前分支\nkoder review --base main\n    和 main 分支比\nkoder review --format markdown --out review.md\n    生成可以贴进 PR 的评论\nkoder review --fail-on high\n    有高级别问题就返回 1，适合放进 CI\nkoder review --fix --check \"npm test\"\n    审查、修复、再跑测试，一条龙", "koder review\n    review uncommitted changes, else the current branch\nkoder review --base main\n    compare with main\nkoder review --format markdown --out review.md\n    a comment ready for the PR\nkoder review --fail-on high\n    exit 1 on high findings, for CI\nkoder review --fix --check \"npm test\"\n    review, fix and test in one go") },
      {
        confirm: {
          question: L("要不要让 Koder 按审查结果修一下？", "Let Koder fix the finding?"),
          yes: async (env) => {
            if (!env.sandbox.hasGit) return;
            await env.turn(env.l(L("按审查结果修复 cart.mjs", "Fix cart.mjs per the review")), {
              mode: "code",
              script: [
                () => call("str_replace", { path: "cart.mjs", old: "  return cents * (1 - rate);", new: "  return Math.round(cents * (1 - rate));" }, env.l(L("按审查意见改：用 Math.round 保证结果还是整数分。", "Per the review: Math.round keeps the result in whole cents."))),
                () => say(env.l(L("改好了。", "Fixed."))),
              ],
            });
          },
          no: L("不修也行，审查本来就只是建议。", "That's fine; a review is only advice."),
          doc: L("可以选择让 Koder 按审查结果修复，照样先看差异、再输入 y。", "You can let Koder apply the fix, again with a diff and a y."),
        },
      },
      { joke: L("被 Koder 挑出毛病不丢人，被线上用户挑出来才丢人。", "Being caught by Koder is fine. Being caught by your users in production is not.") },
    ],
  },
  {
    id: "fix",
    title: L("修到测试通过：fix --check", "Fix until green: fix --check"),
    beats: [
      { say: L("fix 是一个循环：先跑检查命令，失败就把输出交给 Koder 修，修完再跑，直到通过或者次数用完（默认 3 次）。", "fix is a loop: run the check, hand failures to Koder, re-run, until it passes or attempts run out (3 by default).") },
      { tip: L("这次我替你一路按 y，省点手指，你只管看它怎么一轮一轮修。", "This time I'll press y for you; just watch it go round by round.") },
      {
        act: async (env) => {
          const { sandbox } = env;
          sandbox.write("check.mjs", COUNT_CHECK);
          env.coach.script = [
            () => call("write_file", { path: "cart.mjs", content: `${sandbox.read("cart.mjs").replace(/\n*$/, "\n")}\nexport function count(items) {\n  return items.length;\n}\n` }, env.l(L("第一次：我觉得件数就是有几行。", "Attempt one: surely the count is the number of rows."))),
            () => say(env.l(L("改完了，再检查一下。", "Changed; checking again."))),
            () => call("str_replace", { path: "cart.mjs", old: "  return items.length;", new: "  return items.reduce((sum, item) => sum + item.qty, 0);" }, env.l(L("第二次：件数应该把 qty 加起来，这回对了。", "Attempt two: the count should add up qty. Now it's right."))),
            () => say(env.l(L("这回应该过了。", "This one should pass."))),
          ];
          await fixLoop(env.sctx, { workspace: sandbox.dir, check: "node check.mjs", attempts: 3, decide: yesDecision, log: (line) => env.out(`  ${line}`) });
        },
        doc: L("演示：练习场里加了一个检查 count 函数的 check.mjs，Koder 第一次修错、第二次修对，你能看到“第 1/3 次修复”和最后的“检查通过”。", "Demo: a check.mjs tests a count function; Koder gets it wrong once and right the second time, showing 'attempt 1/3' and finally 'Check passed'."),
      },
      { joke: L("它第一次没修对——别笑，你写代码第一次就对过吗？", "It missed the first time. Don't laugh; have you ever got it right first time?") },
      { code: L("koder fix --check \"npm test\"\n    修到测试通过为止\nkoder fix \"首页按钮点了没反应\"\n    没有检查命令时，按描述修一次\nnpm test 2>&1 | koder fix\n    把失败输出直接喂给它", "koder fix --check \"npm test\"\n    fix until the tests pass\nkoder fix \"the home button does nothing\"\n    no check command: fix once from the description\nnpm test 2>&1 | koder fix\n    feed the failure straight in") },
    ],
  },
  {
    id: "flow",
    title: L("流程编排与 CI：让智能体排好队", "Flows and CI: agents in formation"),
    beats: [
      { say: L("把审查、测试、修复写进一份流程文件，本地和 CI 跑同一份。下面是一份小流程，我们直接跑：", "Put review, tests and fixes into one flow file and run the same thing locally and in CI. Here's a small one; let's run it:") },
      {
        act: async (env) => {
          const flow = {
            name: "demo",
            approve: "auto",
            steps: [
              { id: "unit", type: "shell", run: "node test.mjs", continueOnError: true },
              { id: "count", type: "shell", run: "node check.mjs", continueOnError: true },
              { id: "summary", type: "ask", prompt: env.l(L("用一句话总结：{{unit.output}} {{count.output}}", "Summarise in one sentence: {{unit.output}} {{count.output}}")), when: "always" },
              { id: "party", type: "shell", run: "node -e \"console.log('两项检查都过了，可以下班')\"", when: "count.passed" },
            ],
          };
          env.code(JSON.stringify(flow, null, 2).split("\n").map((line) => ` ${line}`).join("\n"));
          env.coach.script = [({ messages }) => {
            const prompt = String(messages.findLast((message) => message.role === "user")?.content || "");
            const ok = /通过：总价 750 分/.test(prompt) && /通过：一共 5 件/.test(prompt);
            return say(env.l(ok ? L("一句话：总价和件数都算对了，可以交差。", "In one sentence: totals and counts are both right; ship it.") : L("一句话：还有检查没过，回前面几课再修一修。", "In one sentence: a check still fails; revisit the earlier lessons.")));
          }];
          const { runFlow } = await import("../commands/flow.mjs");
          const result = await runFlow(env.sctx, flow, { workspace: env.sandbox.dir, approve: "auto", log: (line) => env.out(`  ${line}`) });
          for (const id of ["unit", "count", "party"]) {
            const step = result.results.get(id);
            const text = String(step?.output || "").trim().split("\n").at(-1);
            if (text) env.out(env.style.dim(`  ${id} → ${text}`));
          }
          const summary = result.results.get("summary");
          if (summary?.output) env.say(env.lang === "zh" ? `ask 步骤读了前两步的输出，它说：${summary.output}` : `The ask step read both outputs and says: ${summary.output}`);
        },
        doc: L("演示：一份四步流程——跑测试、跑检查、让 ask 步骤用 {{步骤.output}} 总结前两步、只有检查通过时才执行的庆祝步骤。", "Demo: a four-step flow: tests, a check, an ask step summarising them with {{step.output}}, and a celebration that runs only when the check passed."),
      },
      { code: L("type\n    shell、run、ask、review、fix、test 六种步骤\nwhen\n    unit.failed、count.passed、always、failure\n{{步骤.output}}\n    引用前面步骤的输出\nparallel\n    并行跑只读步骤（shell、ask、review）\napprove: auto\n    自动确认，适合 CI", "type\n    shell, run, ask, review, fix or test\nwhen\n    unit.failed, count.passed, always, failure\n{{step.output}}\n    reuse an earlier step's output\nparallel\n    run read-only steps side by side (shell, ask, review)\napprove: auto\n    auto-approve, for CI") },
      { tip: T.FLOW_SHELL_TIP },
      { say: L("koder ci init 会生成 GitHub Actions 工作流：PR 一开就自动审查并评论；在 PR 里评论 /koder fix，它会修好并推回分支。只有仓库成员的评论才算数，路人甲喊破喉咙也没用。", "koder ci init writes a GitHub Actions workflow: every PR gets reviewed and commented on; comment /koder fix and it fixes and pushes back. Only repository members count; strangers can shout all they like.") },
    ],
  },
  {
    id: "moa",
    title: L("MoA：让几个模型一起想", "MoA: several models think together"),
    beats: [
      { say: L("遇到难题，一个模型容易钻牛角尖。MoA（Mixture of Agents）的做法是：几个参考模型先各自给意见，当前模型把意见当私下参考，汇总以后再动手。", "On hard problems one model can get stuck. MoA (Mixture of Agents) lets a few reference models advise first; the current model reads their advice privately, then acts.") },
      { code: L("koder model add kimi --preset kimi --key-env MOONSHOT_API_KEY\n    先登记参考模型，可以登记好几个\nkoder moa set --refs kimi,qwen\n    建一个 MoA 预设\nkoder --moa \"重构支付模块并补测试\"\n    用 MoA 跑任务；对话里输入 /moa 随时开关\nkoder moa set --fanout every_step\n    默认每个用户回合问一次参考模型；every_step 每一步都问，更准也更费钱", "koder model add kimi --preset kimi --key-env MOONSHOT_API_KEY\n    register reference models; as many as you like\nkoder moa set --refs kimi,qwen\n    create a MoA preset\nkoder --moa \"refactor payments and add tests\"\n    run a task with MoA; /moa toggles it in a chat\nkoder moa set --fanout every_step\n    references are asked once per user turn by default; every_step asks each step, sharper and pricier") },
      {
        quiz: {
          question: L("MoA 里的参考模型能不能直接改你的文件？", "Can MoA reference models edit your files directly?"),
          options: [L("不能。它们只给建议，动手的还是汇总模型，而且照样要你确认", "No. They only advise; the aggregator acts, with your approval as usual"), L("能，人多力量大", "Yes, the more the merrier"), L("只能改 README", "Only the README")],
          answer: 0,
          right: L("对。参考模型手里没有任何工具，连一个文件都读不了。", "Right. References hold no tools at all; they can't even read a file."),
          wrong: [null, L("人多是力量大，但这里人多只负责出主意。", "More heads help, but here they only give advice."), L("README 也不行，它们一个文件都碰不到。", "Not even the README; they can't touch any file.")],
        },
      },
      { joke: L("MoA 就像开会：大家都可以发言，但最后拍板的只有一个人——而那个人还得问你同不同意。", "MoA is like a meeting: everyone may speak, one person decides, and that person still has to ask you.") },
    ],
  },
  {
    id: "gateway",
    title: L("接入聊天软件：在手机上指挥 Koder", "Chat apps: command Koder from your phone"),
    beats: [
      { say: L("Koder 能接入飞书、企业微信、微信、钉钉、Telegram、Slack、Discord 和 WhatsApp。每个平台一条命令，按提示把平台后台给的凭据填进去，Koder 会在线校验；微信直接扫码。", "Koder connects to Feishu, WeCom, WeChat, DingTalk, Telegram, Slack, Discord and WhatsApp. One command per platform: paste the credentials from its console and Koder verifies them online; WeChat just scans a QR code.") },
      { code: L("koder gateway setup feishu\n    接入飞书（企业微信 wecom、钉钉 dingtalk 同理）\nkoder gateway setup weixin\n    微信扫码接入\nkoder gateway start --background\n    后台收消息\nkoder gateway status\n    看哪些平台在线\nkoder gateway pair K7Q2MX\n    同意一位新用户", "koder gateway setup feishu\n    connect Feishu (wecom, dingtalk work the same way)\nkoder gateway setup weixin\n    connect WeChat by QR code\nkoder gateway start --background\n    receive messages in the background\nkoder gateway status\n    which platforms are online\nkoder gateway pair K7Q2MX\n    approve a new user") },
      { tip: L("飞书、企业微信、钉钉、Slack、Discord 用长连接，不需要公网地址；WhatsApp 官方接口要把本地端口通过隧道暴露出去。", "Feishu, WeCom, DingTalk, Slack and Discord use long connections and need no public URL; the WhatsApp Cloud API needs the local port exposed through a tunnel.") },
      { tip: T.GATEWAY_TIP },
      {
        quiz: {
          question: L("一个陌生人在微信上给你的机器人发消息，会发生什么？", "A stranger messages your bot on WeChat. What happens?"),
          options: [L("他会收到一个配对码，你在电脑上 koder gateway pair 同意以后才能用", "They get a pairing code; only after you run koder gateway pair can they use it"), L("机器人直接帮他改代码", "The bot starts editing code for them"), L("机器人热情地把你的密钥发给他", "The bot cheerfully sends them your keys")],
          answer: 0,
          right: L("对。默认私聊要配对，群聊默认关闭；改文件、跑命令之前，它还会在聊天里问你，回复「允许」才执行。", "Right. Direct messages need pairing by default and groups are off; before edits or commands it still asks in the chat and waits for a 'yes'."),
          wrong: [null, L("不会。没配对的人连一句话都递不进来。", "No. Unpaired people can't get a single message through."), L("这个选项要是对的，我们就该改名叫“漏洞”了。", "If this were right we'd have to rename ourselves 'Vulnerability'.")],
        },
      },
      { joke: L("从此你可以躺在沙发上用手机修 bug——至于这算不算加班，请自行判断。", "Now you can fix bugs from the sofa. Whether that counts as overtime is up to you.") },
    ],
  },
  {
    id: "editor",
    title: L("接入编辑器：Zed、Neovim、Emacs", "Editors: Zed, Neovim, Emacs"),
    beats: [
      { say: L("喜欢在编辑器里干活？Zed、Neovim、Emacs 都能通过 ACP 协议启动 koder acp，在编辑器里对话、看差异、批准修改。比如 Zed 只要这几行：", "Prefer your editor? Zed, Neovim and Emacs launch koder acp over ACP to chat, see diffs and approve edits. Zed needs just this:") },
      { act: (env) => env.ctx.dispatch(["editor", "zed", "--os", env.shell], { prompter: env.prompter, noStdin: true }), doc: L("（这里显示 koder editor zed 的配置片段。）", "(The koder editor zed snippet is shown here.)") },
      { code: T.EDITOR_CODE },
      { tip: T.EDITOR_TIP },
      { joke: L("Vim 用户请放心，退出 Koder 比退出 Vim 简单多了：Ctrl+D。", "Vim users, relax: quitting Koder is far easier than quitting Vim. Ctrl+D.") },
    ],
  },
  {
    id: "scan",
    title: L("扫描本机工程，决定下一步", "Scan your projects, decide what's next"),
    beats: [
      { say: L("koder scan 会把你在 Koder、Codex、Claude Code、Cursor 里最近做过的项目和任务汇总起来。它只读工作目录、时间和标题，不碰账号、密钥和数据库，也不上传任何东西。", "koder scan gathers recent projects and tasks from Koder, Codex, Claude Code and Cursor. It reads only folders, times and titles; never accounts, keys or databases, and uploads nothing.") },
      { say: L("列表出来以后，这样选：", "Once the list appears, choose like this:") },
      { code: L("输入项目前面的序号\n    选中这个项目，回车就是跳过\n1  审查改动\n    等于 koder review\n2  跑检查并修复\n    会先猜一个检查命令，比如 npm test，回车就用它\n3  让 Koder 列出现在最值得做的事\n    会把你在别的工具里最近做过的任务一起交给它参考\n4  自己输入任务", "the number in front of a project\n    selects it; Enter skips\n1  review the changes\n    same as koder review\n2  run checks and fix\n    guesses a check such as npm test; Enter accepts it\n3  ask Koder what's most worth doing now\n    your recent tasks from other tools are included\n4  type your own task") },
      {
        confirm: {
          question: L("要不要现在扫一下你的电脑？只列出来，不会自动做任何事。", "Scan your machine now? It only lists; nothing is done automatically."),
          yes: (env) => env.ctx.dispatch(["scan", "--limit", "6"], { prompter: env.prompter, noStdin: true, noPrompt: true }),
          no: L("好，等你想看的时候再说。", "Sure, whenever you're curious."),
          doc: L("可以现场扫一次，只列出项目，不进入选择。", "You can run a scan on the spot; it only lists projects."),
        },
      },
      { joke: L("扫完发现自己同时开了十几个项目？很正常，我们都是这样。", "Found a dozen projects on the go? Totally normal. We're all like that.") },
    ],
  },
  {
    id: "install",
    title: L("安装、更新和换引擎", "Install, update and switch engines"),
    beats: [
      { say: L("想把 Koder 装到别的电脑上？一行命令就够：没有 Node.js 22 会自动下载，安装包会校验 SHA-256，装完自动打开设置界面。", "Want Koder on another machine? One line: Node.js 22 is downloaded if missing, the package is checked with SHA-256, and the settings screen opens.") },
      { code: T.INSTALL_CODE },
      { tip: T.INSTALL_TIP },
      { only: ["windows"], say: T.XP_SAY },
      { tip: T.OTHER_OS_TIP },
      { say: L("默认干活的是内置的 Koder 内核。想换成 Python 版 Hermes，或者任何支持 ACP 的智能体，也只要两条命令；批准请求仍然由 Koder 的确认界面来问你。", "The built-in Koder kernel does the work by default. Switching to the Python Hermes engine, or any ACP agent, takes two commands; approvals still go through Koder's prompts.") },
      { code: L("koder engine install hermes\n    安装 Hermes 引擎\nkoder engine use hermes\n    切到 Hermes；对话里 /engine hermes 也行\nkoder engine use koder\n    切回内置内核", "koder engine install hermes\n    install the Hermes engine\nkoder engine use hermes\n    switch to Hermes; /engine hermes in a chat works too\nkoder engine use koder\n    back to the built-in kernel") },
      { only: ["windows"], tip: T.HERMES_WINDOWS_TIP },
      { joke: L("卸载命令写在这里，不是因为我们希望你用它，而是因为我们相信你不会用它。", "The uninstall command is here not because we want you to use it, but because we trust you won't.") },
    ],
  },
  {
    id: "graduate",
    title: L("毕业典礼", "Graduation"),
    beats: [
      { say: L("恭喜毕业！最后送你一张速查表：", "Congratulations, you've graduated! A cheat sheet for the road:") },
      { code: L("koder setup\n    设置界面：方向键或鼠标配好一切\nkoder\n    进入对话\nkoder \"任务\"\n    直接干活\nkoder ask \"问题\"\n    只读提问\nkoder review\n    代码审查\nkoder fix --check \"命令\"\n    修到通过\nkoder test 文件\n    补测试\nkoder flow run 流程\n    编排流程\nkoder --moa \"任务\"\n    几个模型一起想\nkoder gateway setup 平台\n    接入聊天软件\nkoder scan\n    扫描本机工程\nkoder help 命令\n    查任何命令的说明\nkoder learn 数字\n    回到某一课", "koder setup\n    the settings screen, arrow keys or mouse\nkoder\n    start a chat\nkoder \"task\"\n    get to work\nkoder ask \"question\"\n    read-only question\nkoder review\n    code review\nkoder fix --check \"cmd\"\n    fix until green\nkoder test file\n    add tests\nkoder flow run flow\n    run a flow\nkoder --moa \"task\"\n    several models think together\nkoder gateway setup platform\n    connect a chat app\nkoder scan\n    scan local projects\nkoder help command\n    details for any command\nkoder learn number\n    revisit a lesson") },
      { say: L("下一步：先用 koder setup 配好模型，然后在你自己的项目里输入 koder。", "Next: set up a model with koder setup, then type koder in your own project.") },
      { tip: T.PROJECT_TIP },
      { joke: L("教练下班了。记住：Koder 负责提议，你负责拍板，锅……我们一起背。", "The coach is off duty. Remember: Koder proposes, you decide, and the blame… we share.") },
      {
        act: async (env) => {
          const answer = await env.ask(env.lang === "zh" ? `练习场要留着吗？输入 k 保留，直接回车删除 › ` : `Keep the practice project? k to keep, Enter to delete › `);
          if (/^k$/i.test(answer?.trim() || "")) {
            env.sandbox.kept = true;
            env.say(env.lang === "zh" ? `留着了：${env.sandbox.dir}` : `Kept: ${env.sandbox.dir}`);
          } else env.say(L("已经收拾干净，像从没来过一样。", "All cleaned up, as if we were never here."));
        },
        doc: L("最后可以选择保留练习场，或者直接删除。", "At the end you can keep the practice project or delete it."),
      },
    ],
  },
];
