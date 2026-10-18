export const PLATFORMS = ["feishu", "wecom", "weixin", "dingtalk", "telegram", "slack", "discord", "whatsapp"];

const ALIASES = { lark: "feishu", 飞书: "feishu", 企业微信: "wecom", wework: "wecom", 微信: "weixin", wechat: "weixin", 钉钉: "dingtalk", tg: "telegram" };

export function platformId(name) {
  const value = String(name || "").toLowerCase();
  if (PLATFORMS.includes(value)) return value;
  return ALIASES[value] || ALIASES[name] || null;
}

export function loadPlatform(id) {
  return import(`./platforms/${id}.mjs`);
}
