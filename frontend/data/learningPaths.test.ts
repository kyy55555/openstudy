import assert from "node:assert/strict";
import test from "node:test";

import { courses } from "./courses.ts";
import { learningPaths } from "./learningPaths.ts";

test("learning paths use official sources and known courses", () => {
  const courseIds = new Set(courses.map(({ id }) => id));
  assert.equal(learningPaths.length, 4);
  for (const path of learningPaths) {
    assert.equal(new URL(path.officialUrl).protocol, "https:");
    assert.equal(path.scheduleStatus, "requirements-only");
    assert.ok(path.phases.length >= 3);
    for (const phase of path.phases) {
      if (phase.chooseCount !== null) {
        assert.ok(phase.courseIds.length >= phase.chooseCount, `${path.id} ${phase.title} has too few choices`);
      }
    }
    for (const id of path.phases.flatMap(({ courseIds }) => courseIds)) {
      assert.ok(courseIds.has(id), `${path.id} references missing course ${id}`);
    }
  }
});
