export interface AppConfig {
  port: number;
}

export function loadConfig(env: NodeJS.ProcessEnv): AppConfig {
  const rawPort = env.PORT;

  if (rawPort === undefined) {
    return { port: 3000 };
  }

  if (!/^\d+$/.test(rawPort)) {
    throw new Error("PORT must be a whole number between 1 and 65535.");
  }

  const port = Number(rawPort);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a whole number between 1 and 65535.");
  }

  return { port };
}
