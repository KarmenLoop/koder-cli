// Errors carry an i18n key so every message can be shown in Chinese or English.
export class KoderError extends Error {
  constructor(key, vars = {}, exitCode = 2) {
    super(key);
    this.key = key;
    this.vars = vars;
    this.exitCode = exitCode;
  }
}
