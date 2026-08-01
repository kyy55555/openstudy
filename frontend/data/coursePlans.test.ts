import assert from "node:assert/strict";
import test from "node:test";
import { buildGentlePlan, structuredCoursePlans } from "./coursePlans.ts";

test("MIT 18.01SC plan keeps one official task per day", () => {
  const minimum = structuredCoursePlans["mit-18-01sc"].tasks.length;
  assert.equal(minimum, 113);
  assert.equal(buildGentlePlan("mit-18-01sc", minimum - 1), null);
  const plan = buildGentlePlan("mit-18-01sc", 120);
  assert.equal(plan?.days.length, 120);
  assert.equal(plan?.days.filter(({ kind }) => kind === "buffer").length, 7);
  assert.ok(plan?.days.every(({ url }) => url.startsWith("https://ocw.mit.edu/")));
});
