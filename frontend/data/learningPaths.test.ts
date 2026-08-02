import assert from "node:assert/strict";
import test from "node:test";

import { courses } from "./courses.ts";
import { learningPaths } from "./learningPaths.ts";

test("learning paths use official sources and known courses", () => {
  const courseIds = new Set(courses.map(({ id }) => id));
  assert.equal(learningPaths.length, 11);
  for (const path of learningPaths) {
    assert.equal(new URL(path.officialUrl).protocol, "https:");
    assert.equal(path.scheduleStatus, "prerequisite-inferred");
    assert.equal(path.phases.length, path.calendar === "quarter" ? 12 : 8);
    assert.ok(path.officialRequirementNotes.length >= 2);
    assert.equal(path.officialRequirementNotes.length, path.officialRequirementNotesZh.length);
    for (const phase of path.phases) {
      if (phase.chooseCount !== null) {
        assert.ok(phase.courseIds.length >= phase.chooseCount, `${path.id} ${phase.title} has too few choices`);
      }
      for (const group of phase.choiceGroups) {
        assert.ok(group.chooseCount > 0);
        assert.ok(group.courseIds.length >= group.chooseCount);
        for (const id of group.courseIds) assert.ok(courseIds.has(id), `${path.id} references missing choice ${id}`);
      }
    }
    for (const id of path.phases.flatMap(({ courseIds }) => courseIds)) {
      assert.ok(courseIds.has(id), `${path.id} references missing course ${id}`);
    }
  }
});
