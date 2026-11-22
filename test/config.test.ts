import assert from "node:assert/strict";
import { test } from "node:test";
import { loadConfig } from "../src/config.js";

test("uses port 3000 when PORT is not configured", () => {
  assert.deepEqual(loadConfig({}), { port: 3000 });
});

test("accepts a valid port", () => {
  assert.deepEqual(loadConfig({ PORT: "5173" }), { port: 5173 });
});

test("rejects ports outside the valid range or with non-numeric text", () => {
  for (const PORT of ["0", "65536", "-1", "3.5", "abc", " 3000 "]) {
    assert.throws(() => loadConfig({ PORT }), /PORT must be a whole number/);
  }
});
