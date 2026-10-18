// Facts taken from https://karmenloop.com (home about section, updates page, download page).
export const SITE = "https://karmenloop.com";

export const OFFICIAL = {
  site: SITE,
  updates: `${SITE}/updates.html`,
  download: `${SITE}/download.html`,
  cli: `${SITE}/cli.html`,
  install: `${SITE}/install`,
  email: "info@karmenloop.com",
  github: "https://github.com/KarmenLoop",
};

export function aboutText(lang = "zh") {
  if (lang === "en") {
    return [
      "Koder is written by KARMEN LOOP. The kernel is called KARMEN LOOP: it perceives, decides and acts on your computer.",
      "Koder works on your own computer. The desktop app is the IDE; the terminal apps are the CLI and the TUI.",
      `Website: ${OFFICIAL.site}`,
      `Updates: ${OFFICIAL.updates}`,
      `Download: ${OFFICIAL.download}`,
      `Contact: ${OFFICIAL.email}`,
    ].join("\n");
  }
  return [
    "Koder 由 KARMEN LOOP 自己编写。内核就叫 KARMEN LOOP，在你的电脑上按感知、决策、执行做事。",
    "Koder 在你自己的电脑上办事。电脑版是 IDE，终端里是 CLI 和 TUI。",
    `官网：${OFFICIAL.site}`,
    `查更新：${OFFICIAL.updates}`,
    `下载：${OFFICIAL.download}`,
    `联系：${OFFICIAL.email}`,
  ].join("\n");
}

export function versionText(version, lang = "zh") {
  const en = lang === "en";
  return [
    `koder ${version}`,
    `${en ? "Website" : "官网"}  ${OFFICIAL.site}`,
    `${en ? "Updates" : "更新"}  ${OFFICIAL.updates}`,
    `${en ? "Download" : "下载"}  ${OFFICIAL.download}`,
  ].join("\n");
}

// A short question about who made the tool, or where the official site and updates are.
// Longer requests that also ask for code work are left to the model.
const WORK = /修复|改成|重构|函数|文件|测试|报错|bug|implement|refactor|fix the/i;

export function asksAboutUs(text) {
  const raw = String(text || "").trim();
  if (!raw || raw.length > 80) return false;
  if (WORK.test(raw)) return false;
  return /谁(?:开发|做的|写的|制作|出品)|是谁(?:开发|做|写)|哪个公司|什么公司|开发者|出品方|官方(?:网站|网址|主页)|官网|去哪(?:儿|里)?(?:看|查)?更新|在哪(?:儿|里)?(?:看|查)?更新|怎么更新|检查更新|who (?:made|built|developed|created|wrote)|who are you|what are you|official (?:site|website|page)|where (?:do i |can i |to )?(?:update|download)/i.test(raw);
}
