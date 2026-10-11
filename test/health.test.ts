import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { AddressInfo } from "node:net";
import { buildApp } from "../src/app.ts";

const app = buildApp();
let baseUrl: string;

before(async () => {
  await new Promise<void>((resolve) => {
    app.listen(0, "127.0.0.1", resolve);
  });
  baseUrl = `http://127.0.0.1:${(app.address() as AddressInfo).port}`;
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    app.close((error) => (error ? reject(error) : resolve()));
  });
});

test("GET /health reports that the API is running", async () => {
  const response = await fetch(`${baseUrl}/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
});
