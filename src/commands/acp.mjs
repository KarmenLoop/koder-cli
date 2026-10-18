import { createAcpServer } from "../acp.mjs";

export async function run(ctx) {
  // stdout carries protocol frames only; diagnostics go to stderr.
  const server = createAcpServer(ctx, { input: ctx.stdin, output: ctx.stdout });
  await server.done;
  return 0;
}
