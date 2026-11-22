import assert from "node:assert/strict";
import express, { type Express } from "express";
import { after, before, test } from "node:test";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { apiErrorHandler, apiNotFoundHandler, buildApp } from "../src/app.js";

async function startServer(app: Express): Promise<{ server: Server; baseUrl: string }> {
  const server = await new Promise<Server>((resolve, reject) => {
    const listeningServer = app.listen(0, "127.0.0.1", () => resolve(listeningServer));
    listeningServer.once("error", reject);
  });

  const address = server.address() as AddressInfo;
  return { server, baseUrl: `http://127.0.0.1:${address.port}` };
}

const app = buildApp();
let server: Server;
let baseUrl: string;

before(async () => {
  const listening = await startServer(app);
  server = listening.server;
  baseUrl = listening.baseUrl;
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("unknown routes return a consistent 404 response", async () => {
  const response = await fetch(`${baseUrl}/missing`);

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {
    error: { code: "NOT_FOUND", message: "Route not found." },
  });
});

test("malformed JSON returns a clear 400 response", async () => {
  const response = await fetch(`${baseUrl}/health`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{bad json",
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: { code: "INVALID_JSON", message: "Request body must be valid JSON." },
  });
});

test("JSON bodies larger than 100 KB return 413", async () => {
  const response = await fetch(`${baseUrl}/health`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify("a".repeat(101 * 1024)),
  });

  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), {
    error: { code: "PAYLOAD_TOO_LARGE", message: "Request body exceeds the 100 KB limit." },
  });
});

test("unexpected errors return a safe 500 without exposing details", async () => {
  const failingApp = express();
  failingApp.get("/fail", () => {
    throw new Error("private database connection detail");
  });
  failingApp.use(apiNotFoundHandler);
  failingApp.use(apiErrorHandler);

  const listening = await startServer(failingApp);
  try {
    const response = await fetch(`${listening.baseUrl}/fail`);
    const body = await response.text();

    assert.equal(response.status, 500);
    assert.deepEqual(JSON.parse(body), {
      error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." },
    });
    assert.equal(body.includes("private database connection detail"), false);
  } finally {
    await new Promise<void>((resolve, reject) => {
      listening.server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
