import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PassThrough } from "node:stream";
import test from "node:test";
import { createContext } from "../src/cli.mjs";
import { startGateway } from "../src/commands/gateway.mjs";
import { createGateway, splitText } from "../src/gateway/core.mjs";
import { approvePairing, loadGateway, loadPairing } from "../src/gateway/store.mjs";
import { cli, scripted, textStep, tmp, toolStep } from "./helpers.mjs";
import { httpMock, until } from "./ws-server.mjs";

function context(provider, home = tmp()) {
  return createContext({ command: "gateway", argv: [], opts: {}, positionals: [], io: { providerOverride: provider, env: { KODER_CLI_HOME: home, HOME: home, NO_COLOR: "1" }, stdin: new PassThrough(), stdout: new PassThrough(), stderr: new PassThrough(), cwd: home } });
}

function chat(gateway, { userId = "u1", chatId = "c1", isGroup = false, mentioned = true } = {}) {
  const replies = [];
  const send = (text) => gateway.receive({ platform: "fake", chatId, userId, userName: userId, text, isGroup, mentioned, reply: async (value) => replies.push(value) });
  return { replies, send };
}

test("splitText keeps chunks under the platform limit, preferring line breaks", () => {
  const text = `${"a".repeat(30)}\n${"b".repeat(30)}\n${"c".repeat(10)}`;
  const chunks = splitText(text, 40);
  assert.deepEqual(chunks.map((c) => c.length), [30, 30, 10]);
  assert.deepEqual(splitText("短", 40), ["短"]);
});

test("pairing: a stranger gets a code, the owner approves it, then tasks run", async () => {
  const home = tmp();
  const ctx = context(scripted([textStep("你好，我是 Koder")]), home);
  const gateway = createGateway(ctx, { config: { workspace: path.join(home, "ws"), interaction: "agent", approvalTimeoutSec: 5, moa: false, platforms: { fake: {} } } });
  const alice = chat(gateway);
  await alice.send("在吗");
  assert.equal(alice.replies.length, 1);
  const code = /pair ([A-Z0-9]{6})/.exec(alice.replies[0])[1];
  assert.equal(loadPairing(ctx.env).pending[0].code, code);
  await alice.send("还在吗");
  assert.match(alice.replies[1], new RegExp(code), "the same code is reused while pending");
  assert.ok(approvePairing(code, ctx.env));
  await alice.send("介绍一下自己");
  assert.equal(alice.replies.at(-1), "你好，我是 Koder");
  assert.ok(fs.existsSync(path.join(home, "ws")));
});

test("edits wait for a yes from the same person in the same chat", async () => {
  const home = tmp();
  const workspace = path.join(home, "ws");
  const model = scripted([
    toolStep("write_file", { path: "a.txt", content: "new\n" }),
    textStep("写好了"),
    toolStep("write_file", { path: "b.txt", content: "x" }),
    textStep("没写"),
  ]);
  const ctx = context(model, home);
  const gateway = createGateway(ctx, { config: { workspace, interaction: "agent", approvalTimeoutSec: 5, moa: false, platforms: { fake: { dmPolicy: "open" } } } });
  const alice = chat(gateway);
  const bob = chat(gateway, { userId: "u2" });
  const turn = alice.send("写 a.txt");
  await until(() => alice.replies.length === 1);
  assert.match(alice.replies[0], /准备修改 a\.txt/);
  assert.match(alice.replies[0], /\+ new/);
  await bob.send("允许");
  assert.equal(fs.existsSync(path.join(workspace, "a.txt")), false, "another person cannot approve");
  await alice.send("允许");
  await turn;
  assert.equal(fs.readFileSync(path.join(workspace, "a.txt"), "utf8"), "new\n");
  assert.equal(alice.replies.at(-1), "写好了");
  const second = alice.send("写 b.txt");
  await until(() => alice.replies.length === 3);
  await alice.send("不要");
  await second;
  assert.equal(fs.existsSync(path.join(workspace, "b.txt")), false);
  assert.equal(alice.replies.at(-1), "没写");
});

test("unanswered approvals time out and nothing runs", async () => {
  const home = tmp();
  const marker = path.join(home, "ran.txt");
  const ctx = context(scripted([toolStep("shell", { command: `echo x > ${JSON.stringify(marker)}` }), textStep("结束")]), home);
  const gateway = createGateway(ctx, { config: { workspace: home, interaction: "agent", approvalTimeoutSec: 0.2, moa: false, platforms: { fake: { dmPolicy: "open" } } } });
  const alice = chat(gateway);
  await alice.send("跑命令");
  assert.match(alice.replies[0], /准备在电脑上运行命令/);
  assert.match(alice.replies[1], /等待确认超时/);
  assert.equal(fs.existsSync(marker), false);
});

test("group policy: disabled by default, open groups need a mention; read-only mode offers no write tools", async () => {
  const home = tmp();
  const model = scripted([textStep("群里好")]);
  const closed = createGateway(context(model, home), { config: { workspace: home, interaction: "ask", approvalTimeoutSec: 5, moa: false, platforms: { fake: {} } } });
  const group = chat(closed, { isGroup: true });
  await group.send("hi");
  assert.equal(group.replies.length, 0);
  const open = createGateway(context(model, home), { config: { workspace: home, interaction: "ask", approvalTimeoutSec: 5, moa: false, platforms: { fake: { groupPolicy: "open" } } } });
  const quiet = chat(open, { isGroup: true, mentioned: false });
  await quiet.send("hi");
  assert.equal(quiet.replies.length, 0);
  const called = chat(open, { isGroup: true });
  await called.send("hi");
  assert.equal(called.replies[0], "群里好");
  assert.equal(model.calls[0].tools.some((tool) => tool.name === "write_file"), false);
});

test("chat commands: /new, /moa, /help", async () => {
  const home = tmp();
  const gateway = createGateway(context(scripted([textStep("x")]), home), { config: { workspace: home, interaction: "agent", approvalTimeoutSec: 5, moa: false, platforms: { fake: { dmPolicy: "open" } } } });
  const alice = chat(gateway);
  await alice.send("/help");
  await alice.send("/moa");
  await alice.send("/new");
  assert.match(alice.replies[0], /\/new/);
  assert.equal(alice.replies[1], "已开启 MoA 模式。");
  assert.equal(alice.replies[2], "已开始新会话。");
});

test("gateway command: setup with --set and live verification, policy, status JSON, pair", async () => {
  const home = tmp();
  const api = await httpMock({ "POST /botT/getMe": () => ({ ok: true, result: { id: 1, username: "kb" } }) });
  try {
    const bad = await cli(["gateway", "setup", "telegram"], { home });
    assert.equal(bad.code, 2);
    assert.match(bad.err, /还缺这些信息：token/);
    const ok = await cli(["gateway", "setup", "telegram", "--set", "token=T", "--set", `apiBase=${api.url}`], { home });
    assert.equal(ok.code, 0, ok.err);
    assert.match(ok.out, /校验通过：@kb/);
    const file = path.join(home, "gateway", "config.json");
    assert.equal(fs.statSync(file).mode & 0o777, 0o600);
    assert.equal(loadGateway({ KODER_CLI_HOME: home }).platforms.telegram.token, "T");
    const policy = await cli(["gateway", "policy", "telegram", "--dm", "allowlist", "--allow", "7,8"], { home });
    assert.match(policy.out, /私聊 allowlist/);
    const status = JSON.parse((await cli(["gateway", "status", "--json"], { home })).out);
    assert.equal(status.running, false);
    assert.equal(status.platforms.telegram.configured, true);
    assert.equal(status.platforms.feishu.configured, false);
    const unknown = await cli(["gateway", "setup", "icq"], { home });
    assert.match(unknown.err, /不支持的平台：icq/);
    const pair = await cli(["gateway", "pair", "NOPE00"], { home });
    assert.equal(pair.code, 1);
  } finally {
    await api.close();
  }
});

test("end to end: Telegram message → Koder turn → reply, through the real gateway start path", async () => {
  const home = tmp();
  let served = false;
  const api = await httpMock({
    "POST /botT/getMe": () => ({ ok: true, result: { id: 1, username: "kb" } }),
    "POST /botT/getUpdates": async () => {
      if (served) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        return { ok: true, result: [] };
      }
      served = true;
      return { ok: true, result: [{ update_id: 1, message: { message_id: 3, chat: { id: 55, type: "private" }, from: { id: 9, username: "zoe" }, text: "列出工作区" } }] };
    },
    "POST /botT/sendMessage": () => ({ ok: true, result: {} }),
  });
  try {
    fs.mkdirSync(path.join(home, "gateway"), { recursive: true });
    fs.writeFileSync(path.join(home, "gateway", "config.json"), JSON.stringify({ workspace: path.join(home, "ws"), platforms: { telegram: { token: "T", apiBase: api.url, dmPolicy: "open", enabled: true } } }));
    const ctx = context(scripted([toolStep("list_dir", { path: "." }), textStep("工作区是空的")]), home);
    const { gateway } = await startGateway(ctx, { log: () => {} });
    const sent = await until(() => api.find("POST", "/botT/sendMessage")[0]);
    assert.deepEqual(sent.body, { chat_id: "55", text: "工作区是空的", reply_parameters: { message_id: 3, allow_sending_without_reply: true } });
    const state = JSON.parse(fs.readFileSync(path.join(home, "gateway", "state.json"), "utf8"));
    assert.equal(state.pid, process.pid);
    assert.equal(state.platforms.telegram.state, "connected");
    await gateway.stop();
  } finally {
    await api.close();
  }
});
