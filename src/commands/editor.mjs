import { KoderError } from "../errors.mjs";
import { detectShell, isWindowsShell, normalizeShell } from "../platform.mjs";

export const flags = {
  os: { type: "string" },
};

// Shapes follow each client's own docs: Zed agent_servers, CodeCompanion
// adapters.acp, agent-shell agent-shell-make-agent-config + acp-make-client.
export const SNIPPETS = {
  zed: {
    file: "~/.config/zed/settings.json",
    winFile: "%APPDATA%\\Zed\\settings.json",
    note: { zh: "加到 settings.json；在 Agent 面板新建线程时选择 Koder。", en: "Add to settings.json, then pick Koder when starting a thread in the Agent panel." },
    code: `{
  "agent_servers": {
    "Koder": {
      "type": "custom",
      "command": "koder",
      "args": ["acp"],
      "env": { "KODER_LANG": "zh" }
    }
  }
}`,
  },
  nvim: {
    file: "~/.config/nvim/lua/plugins/codecompanion.lua",
    winFile: "%LOCALAPPDATA%\\nvim\\lua\\plugins\\codecompanion.lua",
    note: { zh: "需要 CodeCompanion.nvim；:CodeCompanionChat 里会使用 Koder。", en: "Requires CodeCompanion.nvim; :CodeCompanionChat then uses Koder." },
    code: `require("codecompanion").setup({
  adapters = {
    acp = {
      koder = function()
        local helpers = require("codecompanion.adapters.acp.helpers")
        return {
          name = "koder",
          formatted_name = "Koder",
          type = "acp",
          roles = { llm = "assistant", user = "user" },
          commands = { default = { "koder", "acp" } },
          defaults = { mcpServers = {}, timeout = 20000 },
          parameters = {
            protocolVersion = 1,
            clientCapabilities = { fs = { readTextFile = true, writeTextFile = true } },
            clientInfo = { name = "CodeCompanion.nvim", version = "1.0.0" },
          },
          handlers = {
            setup = function() return true end,
            auth = function() return true end,
            form_messages = function(self, messages, capabilities)
              return helpers.form_messages(self, messages, capabilities)
            end,
            on_exit = function() end,
          },
        }
      end,
    },
  },
  interactions = { chat = { adapter = "koder" } },
})`,
  },
  emacs: {
    file: "~/.emacs.d/init.el",
    winFile: "%APPDATA%\\.emacs.d\\init.el",
    note: { zh: "需要 MELPA 上的 agent-shell；M-x agent-shell 后选择 Koder。", en: "Requires agent-shell from MELPA; run M-x agent-shell and pick Koder." },
    code: `(require 'agent-shell)
(add-to-list 'agent-shell-agent-configs
             (agent-shell-make-agent-config
              :identifier 'koder
              :mode-line-name "Koder"
              :buffer-name "Koder"
              :shell-prompt "Koder> "
              :shell-prompt-regexp "Koder> "
              :client-maker (lambda (buffer)
                              (acp-make-client :command "koder"
                                               :command-params '("acp")
                                               :environment-variables '("KODER_LANG=zh")
                                               :context-buffer buffer))))`,
  },
};

const ALIASES = { neovim: "nvim", vim: "nvim", "codecompanion": "nvim", "agent-shell": "emacs" };

export function editorName(name) {
  return ALIASES[name] || name;
}

// Editors start programs without trying .cmd, so on Windows they need koder.cmd spelled out.
export function snippetFor(name, { lang = "zh", shell = detectShell() } = {}) {
  const item = SNIPPETS[name];
  const windows = isWindowsShell(shell);
  let code = item.code.replace(/KODER_LANG[=": ]+zh/g, (match) => match.replace("zh", lang));
  if (windows) code = code.replace('"command": "koder"', '"command": "koder.cmd"').replace('{ "koder", "acp" }', '{ "koder.cmd", "acp" }').replace(':command "koder"', ':command "koder.cmd"');
  return { file: windows ? item.winFile : item.file, note: item.note[lang], code };
}

export async function run(ctx) {
  const wanted = ctx.positionals[0];
  const names = wanted ? [editorName(wanted)] : Object.keys(SNIPPETS);
  for (const name of names) if (!SNIPPETS[name]) throw new KoderError("err.unknownCommand", { name: `editor ${wanted}` });
  if (ctx.opts.os && !normalizeShell(ctx.opts.os)) throw new KoderError("err.flagValue", { flag: `--os ${ctx.opts.os}` });
  const shell = normalizeShell(ctx.opts.os) || detectShell({ env: ctx.env, platform: ctx.io.platform || process.platform });
  const out = [ctx.t("editor.title"), ""];
  for (const name of names) {
    const { file, note, code } = snippetFor(name, { lang: ctx.lang, shell });
    out.push(`# ${name} · ${file}`, note, "", code, "");
  }
  ctx.stdout.write(`${out.join("\n").trimEnd()}\n`);
  return 0;
}
