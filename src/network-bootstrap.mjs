// Node reads proxy opt-in at startup. Setting this after importing the CLI does
// not affect fetch. Respect an explicit opt-out and let native NO_PROXY apply.
export function proxyBootstrapEnv(env = process.env, supported = process.allowedNodeEnvironmentFlags.has('--use-env-proxy')) {
  if (!supported || env.NODE_USE_ENV_PROXY !== undefined || !(env.HTTP_PROXY || env.HTTPS_PROXY || env.http_proxy || env.https_proxy)) return null;
  return {...env,NODE_USE_ENV_PROXY:'1'};
}
