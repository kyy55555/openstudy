import assert from "node:assert/strict";
import test from "node:test";

import { courseGoalOptions, courseGoalSequence } from "./courseGuidance.ts";
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

test("goal guidance exposes bilingual choices for the dedicated planner", () => {
  assert.deepEqual(courseGoalOptions.map(({ topic }) => topic), [
    "Distributed Systems",
    "Machine Learning",
    "Algorithms",
    "Operating Systems",
    "Web Development",
    "Databases",
    "Artificial Intelligence",
    "Cybersecurity",
    "Computer Networks",
    "Computer Graphics",
  ]);
  assert.ok(courseGoalOptions.every(({ topicZh }) => topicZh.length > 0));
});

test("every learning goal explains each verified course step", () => {
  for (const option of courseGoalOptions) {
    const sequence = courseGoalSequence(courses, option.topic);
    assert.ok(sequence, `${option.topic} should resolve`);
    assert.equal(sequence.steps.length, sequence.courses.length);
    assert.ok(sequence.steps.every(({ reason, reasonZh }) => reason.length > 20 && reasonZh.length > 8));
  }
});
