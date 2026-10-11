import assert from "node:assert/strict";
import { test } from "node:test";
import { mapLeadRow } from "../src/lead-mapping.ts";

const syntheticRow = {
  "Decision Maker Name": "  Alex Example  ",
  "Decision Maker Title": "  Operations Director ",
  Industry: " Software ",
  "Email Address": " ALEX@EXAMPLE.COM ",
  Country: " Canada ",
};

test("maps the five observed CSV fields without inventing company data", () => {
  assert.deepEqual(mapLeadRow(syntheticRow), {
    ok: true,
    lead: {
      contactName: "Alex Example",
      jobTitle: "Operations Director",
      industry: "Software",
      email: "alex@example.com",
      country: "Canada",
    },
  });
});

test("keeps a missing industry as unknown", () => {
  const result = mapLeadRow({ ...syntheticRow, Industry: " " });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.lead.industry, null);
});

test("rejects missing required fields and malformed email without echoing values", () => {
  const result = mapLeadRow({
    ...syntheticRow,
    "Decision Maker Name": " ",
    "Email Address": "not-an-email",
    Industry: 42,
  });
  assert.deepEqual(result, {
    ok: false,
    errors: [
      { field: "Decision Maker Name", reason: "required" },
      { field: "Industry", reason: "invalid_type" },
      { field: "Email Address", reason: "invalid_format" },
    ],
  });
});
