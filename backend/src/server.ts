import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { buildApp } from "./app.ts";
import { loadConfig } from "./config.ts";

let port: number;
try {
  if (existsSync(".env")) {
    loadEnvFile(".env");
  }
  ({ port } = loadConfig(process.env));
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown configuration error.";
  console.error(`Configuration error: ${message}`);
  process.exit(1);
}

const app = buildApp();

const server = app.listen(port, "127.0.0.1", () => {
  console.log(`SalesGenie API listening at http://127.0.0.1:${port}`);
});

server.on("error", (error) => {
  console.error("Unable to start SalesGenie API:", error);
  process.exitCode = 1;
});
