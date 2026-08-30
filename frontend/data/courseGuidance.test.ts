import assert from "node:assert/strict";
import test from "node:test";

import { courseGoalSequence } from "./courseGuidance.ts";
import { courses } from "./courses.ts";

test("goal guidance gives a real prerequisite-first sequence", () => {
  const sequence = courseGoalSequence(courses, "distributed systems");
  assert.ok(sequence);
  assert.equal(sequence.topic, "Distributed Systems");
  assert.deepEqual(sequence.courses.map(({ id }) => id), [
    "harvard-cs50x",
    "berkeley-cs61c",
    "stanford-cs111",
    "mit-6-824",
    "stanford-cs244b",
  ]);
});
