import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import zlib from "node:zlib";
import { encodeQr, renderQr } from "../src/gateway/qr.mjs";
import { BIN, cli, mockModel, textStep, tmp, toolStep } from "./helpers.mjs";

function engineHome(server) {
  const home = tmp();
  fs.writeFileSync(path.join(home, "provider.json"), JSON.stringify({ model: "m", baseUrl: server.url, auth: "none" }));
  fs.writeFileSync(path.join(home, "config.json"), JSON.stringify({ engines: { bridge: { command: process.execPath, args: [BIN, "acp"] } } }));
  return home;
}

test("ACP engine: Koder drives an external ACP agent, shows its diff and approves through Koder", async () => {
  const server = await mockModel([toolStep("write_file", { path: "e.txt", content: "from engine\n" }, "我来写文件", "w1"), textStep("引擎写好了")]);
  try {
    const home = engineHome(server);
    const dir = tmp();
    const result = await cli(["run", "写 e.txt", "--engine", "bridge", "--yes", "-w", dir], { home });
    assert.equal(result.code, 0, result.err);
    assert.equal(fs.readFileSync(path.join(dir, "e.txt"), "utf8"), "from engine\n");
    assert.match(result.out, /我来写文件/);
    assert.match(result.out, /准备修改 e\.txt/);
    assert.match(result.out, /\+ from engine/);
    assert.match(result.out, /引擎写好了/);
  } finally {
    await server.close();
  }
});

test("ACP engine: rejected edits are refused inside the agent", async () => {
  const server = await mockModel([toolStep("write_file", { path: "no.txt", content: "x" }, "", "w2"), textStep("被拒绝了")]);
  try {
    const home = engineHome(server);
    const dir = tmp();
    const result = await cli(["run", "写 no.txt", "--engine", "bridge", "-w", dir], { home, decide: () => ({ accept: false }) });
    assert.equal(result.code, 0, result.err);
    assert.equal(fs.existsSync(path.join(dir, "no.txt")), false);
    assert.match(result.out, /被拒绝了/);
  } finally {
    await server.close();
  }
});

test("engine commands: list, add, use, test handshake, unknown engine", async () => {
  const home = tmp();
  const add = await cli(["engine", "add", "self", "--command", process.execPath, "--args", `${BIN} acp`], { home });
  assert.equal(add.code, 0, add.err);
  const list = await cli(["engine", "list"], { home });
  assert.match(list.out, /\* koder/);
  assert.match(list.out, /hermes\s+hermes acp/);
  assert.match(list.out, /self/);
  const handshake = await cli(["engine", "test", "self"], { home });
  assert.equal(handshake.code, 0, handshake.err);
  assert.match(handshake.out, /koder 0\.3\.1 · ACP v1/);
  await cli(["engine", "use", "self"], { home });
  assert.equal(JSON.parse(fs.readFileSync(path.join(home, "config.json"), "utf8")).engine, "self");
  const bad = await cli(["run", "x", "--engine", "ghost"], { home, provider: { complete: () => assert.fail() } });
  assert.match(bad.err, /没有这个引擎：ghost/);
});

function png(qr, scale = 6, quiet = 4) {
  const crc32 = (buf) => {
    let crc = 0xffffffff;
    for (const b of buf) {
      let c = (crc ^ b) & 0xff;
      for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crc = (crc >>> 8) ^ c;
    }
    return (crc ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(td));
    return Buffer.concat([len, td, crc]);
  };
  const n = (qr.size + quiet * 2) * scale;
  const raw = Buffer.alloc((n + 1) * n);
  for (let y = 0; y < n; y += 1) {
    for (let x = 0; x < n; x += 1) {
      const mx = Math.floor(x / scale) - quiet;
      const my = Math.floor(y / scale) - quiet;
      raw[y * (n + 1) + 1 + x] = mx >= 0 && my >= 0 && mx < qr.size && my < qr.size && qr.modules[my][mx] ? 0 : 255;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(n, 0);
  ihdr.writeUInt32BE(n, 4);
  ihdr[8] = 8;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}

const swiftc = spawnSync("swiftc", ["--version"], { stdio: "ignore" }).status === 0 && process.platform === "darwin";

test("QR codes decode with macOS CoreImage across versions and error levels", { skip: !swiftc && "needs swiftc on macOS" }, () => {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, "decode.swift"), [
    "import CoreImage",
    "import Foundation",
    "for path in CommandLine.arguments.dropFirst() {",
    "  let image = CIImage(contentsOf: URL(fileURLWithPath: path))!",
    "  let detector = CIDetector(ofType: CIDetectorTypeQRCode, context: nil, options: [CIDetectorAccuracy: CIDetectorAccuracyHigh])!",
    "  print((detector.features(in: image).first as? CIQRCodeFeature)?.messageString ?? \"NONE\")",
    "}",
  ].join("\n"));
  execFileSync("swiftc", ["-O", path.join(dir, "decode.swift"), "-o", path.join(dir, "decode")], { stdio: "pipe" });
  const texts = [];
  const files = [];
  const base = "https://liteapp.weixin.qq.com/q/7GiQu1?qrcode=";
  [5, 60, 150, 300].forEach((length, i) => {
    for (const ecc of ["L", "M", "H"]) {
      const text = `${(base + "0123456789abcdef".repeat(30)).slice(0, length)}${i % 2 ? "扫码登录" : ""}`;
      const file = path.join(dir, `${length}-${ecc}.png`);
      fs.writeFileSync(file, png(encodeQr(text, { ecc })));
      texts.push(text);
      files.push(file);
    }
  });
  const decoded = execFileSync(path.join(dir, "decode"), files, { encoding: "utf8" }).trim().split("\n");
  assert.deepEqual(decoded, texts);
});

test("QR terminal rendering uses two modules per cell with explicit colors", () => {
  const qr = encodeQr("https://example.com");
  const lines = renderQr(qr);
  assert.equal(lines.length, Math.ceil((qr.size + 4) / 2));
  assert.match(lines[0], /\x1b\[97;107m▀/);
  const plain = renderQr(qr, { color: false });
  assert.doesNotMatch(plain.join(""), /\x1b/);
});
