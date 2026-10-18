#!/usr/bin/env node
import module from "node:module";

module.enableCompileCache?.();
const { runCli } = await import("../src/cli.mjs");
process.exitCode = await runCli(process.argv.slice(2));
