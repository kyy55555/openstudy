import assert from "node:assert/strict";
import test from "node:test";

import { courses } from "./courses.ts";
import { learningPaths } from "./learningPaths.ts";

test("learning paths use official sources and known courses", () => {
  const courseIds = new Set(courses.map(({ id }) => id));
  assert.equal(learningPaths.length, 4);
  for (const path of learningPaths) {
    assert.equal(new URL(path.officialUrl).protocol, "https:");
    assert.equal(path.phases.length, 8);
    assert.deepEqual(path.phases.map(({ titleZh }) => titleZh), [
      "大一上", "大一下", "大二上", "大二下", "大三上", "大三下", "大四上", "大四下",
    ]);
    for (const phase of path.phases.slice(4, 7)) {
      assert.ok(phase.chooseCount !== null, `${path.id} ${phase.title} is not flexible`);
      assert.ok(phase.courseIds.length >= phase.chooseCount!, `${path.id} ${phase.title} has too few choices`);
    }
    for (const id of path.phases.flatMap(({ courseIds }) => courseIds)) {
      assert.ok(courseIds.has(id), `${path.id} references missing course ${id}`);
    }
  }
});
