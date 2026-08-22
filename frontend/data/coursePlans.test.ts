import assert from "node:assert/strict";
import test from "node:test";
import { buildGentlePlan, completedPlanTaskId, structuredCoursePlans } from "./coursePlans.ts";

test("MIT 18.01SC plan is never shorter than the user's target", () => {
  assert.equal(structuredCoursePlans["mit-18-01sc"].tasks.length, 113);
  assert.equal(buildGentlePlan("mit-18-01sc", 0), null);
  const plan = buildGentlePlan("mit-18-01sc", 30);
  assert.equal(plan?.requestedDays, 30);
  assert.equal(plan?.plannedDays, 35);
  assert.equal(plan?.days.length, 35);
  assert.equal(plan?.days.flatMap(({ tasks }) => tasks).filter(({ kind }) => kind !== "buffer").length, 113);
  assert.ok(plan?.days.flatMap(({ tasks }) => tasks).every(({ url }) => url.startsWith("https://ocw.mit.edu/")));
});

test("extending a plan preserves split-task progress and legacy completion records", () => {
  const original = buildGentlePlan("harvard-cs50-sql", 30);
  const extended = buildGentlePlan("harvard-cs50-sql", 60);
  assert.ok(original && extended);
  const originalTask = original.days.flatMap(({ tasks }) => tasks).find(({ sourceTaskId }) => sourceTaskId);
  assert.ok(originalTask?.sourceTaskId);
  const matchingExtendedTask = extended.days.flatMap(({ tasks }) => tasks).find(({ id }) => id === originalTask.id);
  assert.ok(matchingExtendedTask, "stable split id disappeared after extending the plan");
  assert.equal(completedPlanTaskId(matchingExtendedTask, [originalTask.id]), originalTask.id);
  const part = originalTask.id.match(/--part-(\d+)$/)?.[1];
  assert.ok(part);
  const legacyId = `${originalTask.sourceTaskId}--part-${part}-of-99`;
  assert.equal(completedPlanTaskId(matchingExtendedTask, [legacyId]), legacyId);
});

test("every catalog course has a plan made only from its official resources", async () => {
  const { courses } = await import("./courses.ts");
  assert.equal(Object.keys(structuredCoursePlans).length, courses.length);
  for (const course of courses) {
    const plan = structuredCoursePlans[course.id];
    assert.ok(plan.tasks.length > 0, `${course.id} has no plan tasks`);
    assert.ok(plan.tasks.every(({ url }) => new URL(url).protocol === "https:"));
    for (const requestedDays of [1, 7, 30]) {
      const generated = buildGentlePlan(course.id, requestedDays);
      assert.ok(generated, `${course.id} could not generate a ${requestedDays}-day plan`);
      assert.ok(generated.plannedDays >= requestedDays);
      const scheduledTasks = generated.days.flatMap(({ tasks }) => tasks);
      assert.ok(generated.days.every(({ tasks }) => tasks.length > 0), `${course.id} has an empty study day`);
      assert.ok(scheduledTasks.every(({ kind }) => kind !== "buffer"), `${course.id} still generates buffer-only days`);
      const scheduledSourceIds = scheduledTasks.map(({ id, sourceTaskId }) => sourceTaskId ?? id);
      let cursor = 0;
      for (const task of plan.tasks) {
        const nextIndex = scheduledSourceIds.indexOf(task.id, cursor);
        assert.ok(nextIndex >= cursor, `${course.id} omitted or reordered ${task.id}`);
        cursor = nextIndex;
      }
      for (const syllabus of plan.tasks.filter(({ resourceType }) => resourceType === "syllabus")) {
        assert.equal(scheduledSourceIds.filter((id) => id === syllabus.id).length, 1, `${course.id} stretches its syllabus across multiple days`);
      }
    }
  }
});

test("Stanford CS106A follows all 28 official lectures, assignments, and practice exams", () => {
  const definition = structuredCoursePlans["stanford-cs106a"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ kind }) => kind === "session").length, 28);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "assignment").length, 7);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
  const plan = buildGentlePlan("stanford-cs106a", 30);
  assert.equal(plan?.days[0].tasks[0].id, "lecture-1");
  assert.equal(plan?.days.flatMap(({ tasks }) => tasks).filter(({ kind }) => kind === "buffer").length, 0);
});

test("MIT 6.006 and 6.034 use their complete official lecture and assessment sequences", () => {
  const algorithms = structuredCoursePlans["mit-6-006"];
  assert.equal(algorithms.detail, "full");
  assert.equal(algorithms.tasks.filter(({ kind }) => kind === "session").length, 21);
  assert.equal(algorithms.tasks.filter(({ kind }) => kind === "assignment").length, 9);
  assert.equal(algorithms.tasks.filter(({ kind }) => kind === "exam").length, 4);

  const ai = structuredCoursePlans["mit-6-034"];
  assert.equal(ai.detail, "full");
  assert.equal(ai.tasks.filter(({ kind }) => kind === "session").length, 23);
  assert.equal(ai.tasks.filter(({ kind }) => kind === "assignment").length, 6);
  assert.equal(ai.tasks.filter(({ kind }) => kind === "exam").length, 5);
});

test("MIT 18.06 follows its official resource index through the final exam", () => {
  const definition = structuredCoursePlans["mit-18-06"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ kind }) => kind === "assignment").length, 31);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 4);
  assert.equal(definition.tasks.at(-1)?.id, "final-exam");
});

test("MIT 6.046J follows all official lectures, problem sets, and exams", () => {
  const definition = structuredCoursePlans["mit-6-046j"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ kind }) => kind === "session").length, 24);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "assignment").length, 10);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 3);
  assert.equal(definition.tasks.at(-1)?.id, "final-exam");
});

test("MIT Python and computational thinking plans follow their official sequences", () => {
  const python = structuredCoursePlans["mit-6-100l"];
  assert.equal(python.detail, "full");
  assert.equal(python.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 26);
  assert.equal(python.tasks.filter(({ id }) => id.startsWith("finger-exercise-")).length, 26);
  assert.equal(python.tasks.filter(({ id }) => id.startsWith("problem-set-")).length, 6);

  const dataScience = structuredCoursePlans["mit-6-0002"];
  assert.equal(dataScience.detail, "full");
  assert.equal(dataScience.tasks.filter(({ kind }) => kind === "session").length, 15);
  assert.equal(dataScience.tasks.filter(({ kind }) => kind === "assignment").length, 5);
});

test("MIT 18.05 follows the official classes, studios, problem sets, and exams", () => {
  const definition = structuredCoursePlans["mit-18-05"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("class-")).length, 27);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("studio-")).length, 10);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("problem-set-")).length, 11);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 4);
  assert.equal(definition.tasks.at(-1)?.id, "final-exam");
});

test("MIT 6.042J follows all official lectures, recitations, problem sets, and exams", () => {
  const definition = structuredCoursePlans["mit-6-042j"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 25);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("recitation-")).length, 23);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("problem-set-")).length, 12);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
});

test("MIT 18.02SC follows all official independent-study sessions and assessments", () => {
  const definition = structuredCoursePlans["mit-18-02sc"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("session-")).length, 98);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("problem-set-")).length, 12);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 5);
  assert.equal(definition.tasks.at(-1)?.id, "final-exam");
});

test("MIT 8.01SC follows all public lessons and problem sets", () => {
  const definition = structuredCoursePlans["mit-8-01sc"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lesson-")).length, 38);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("problem-set-")).length, 12);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 0);
});

test("MIT 5.111SC follows all lectures, lecture problems, and exams", () => {
  const definition = structuredCoursePlans["mit-5-111sc"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-") && !id.startsWith("lecture-problems-")).length, 35);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-problems-")).length, 35);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 5);
  assert.equal(definition.tasks.at(-1)?.id, "final-exam");
});

test("MIT 7.012 follows the official lecture, problem-set, and exam sequence", () => {
  const definition = structuredCoursePlans["mit-7-012"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 35);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("problem-set-")).length, 7);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 4);
  assert.equal(definition.tasks.at(-1)?.id, "final-exam");
});

test("Stanford CS106B follows its complete SEE lecture and assignment sequence", () => {
  const definition = structuredCoursePlans["stanford-cs106b"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 27);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("section-assignment-")).length, 9);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("programming-assignment-")).length, 7);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
});

test("Stanford CS107 follows its complete SEE lecture and assignment sequence", () => {
  const definition = structuredCoursePlans["stanford-cs107"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 27);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("section-assignment-")).length, 8);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("programming-assignment-")).length, 8);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 3);
});

test("Stanford CS223A follows its complete public SEE lecture and assignment sequence", () => {
  const definition = structuredCoursePlans["stanford-cs223a"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 16);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("assignment-")).length, 6);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 0);
  assert.ok(definition.tasks.every(({ url }) => url === "https://see.stanford.edu/Course/CS223A"));
});

test("Stanford CS229 follows its complete SEE lecture, problem-set, and project sequence", () => {
  const definition = structuredCoursePlans["stanford-cs229"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 20);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("problem-set-")).length, 4);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "project").length, 4);
  assert.ok(definition.tasks.every(({ url }) => url === "https://see.stanford.edu/Course/CS229"));
});

test("Stanford EE261 follows all public SEE lectures, problem sets, and exams", () => {
  const definition = structuredCoursePlans["stanford-ee261"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 30);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("problem-set-")).length, 9);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 3);
  assert.ok(definition.tasks.every(({ url }) => url === "https://see.stanford.edu/Course/EE261"));
});

test("Stanford EE263 follows all public SEE lectures, homework, and exams", () => {
  const definition = structuredCoursePlans["stanford-ee263"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 20);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("homework-")).length, 9);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 4);
  assert.ok(definition.tasks.every(({ url }) => url === "https://see.stanford.edu/Course/EE263"));
});

test("Stanford EE364A follows all public lectures, readings, homework, reviews, and exams", () => {
  const definition = structuredCoursePlans["stanford-ee364a"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 19);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("reading-")).length, 8);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("homework-")).length, 8);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("review-session-")).length, 9);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
});

test("Stanford EE364B follows all public lectures, assignments, and project milestones", () => {
  const definition = structuredCoursePlans["stanford-ee364b"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 18);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("assignment-")).length, 7);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "project").length, 4);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 0);
});

test("Stanford CS109 follows its current public lecture, problem-set, and exam sequence", () => {
  const definition = structuredCoursePlans["stanford-cs109"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 27);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("problem-set-")).length, 6);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 3);
});

test("Stanford CS111 follows all public lectures, assignments, sections, and exams", () => {
  const definition = structuredCoursePlans["stanford-cs111"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 28);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("assignment-")).length, 9);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("section-")).length, 8);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
});

test("MIT 6.004 follows every public OCW unit and worksheet", () => {
  const definition = structuredCoursePlans["mit-6-004"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("unit-")).length, 21);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("worksheet-")).length, 17);
  assert.ok(definition.tasks.every(({ url }) => url === "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/"));
});

test("MIT 6.837 follows the official lecture, programming-assignment, and exam sequence", () => {
  const definition = structuredCoursePlans["mit-6-837"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 25);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "project").length, 6);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
});

test("MIT 6.824 follows all public readings, labs, project milestones, and exams", () => {
  const definition = structuredCoursePlans["mit-6-824"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 24);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lab-")).length, 6);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("project-milestone-")).length, 8);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
});

test("MIT 6.858 follows all official lectures, labs, quizzes, and project milestones", () => {
  const definition = structuredCoursePlans["mit-6-858"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 24);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lab-")).length, 6);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("project-")).length, 4);
});

test("MIT 6.S081 follows every official lecture, homework, and xv6 lab", () => {
  const definition = structuredCoursePlans["mit-6-s081"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 25);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("homework-")).length, 23);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lab-")).length, 10);
});

test("MIT 6.172 follows all official lectures, homework, recitations, quizzes, and projects", () => {
  const definition = structuredCoursePlans["mit-6-172"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 23);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("homework-")).length, 10);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("recitation-")).length, 10);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "project").length, 12);
});

test("MIT 6.830 follows all official readings, problem sets, labs, exams, and project milestones", () => {
  const definition = structuredCoursePlans["mit-6-830"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 23);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("problem-set-")).length, 3);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lab-")).length, 3);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("project-") || id === "final-project").length, 3);
});

test("MIT 6.033 follows all official lectures, experiments, critiques, quizzes, and design milestones", () => {
  const definition = structuredCoursePlans["mit-6-033"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 26);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("hands-on-")).length, 7);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("system-critique-")).length, 2);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("design-project-")).length, 5);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
});

test("MIT 8.02 follows all three official MITx modules and their published durations", () => {
  const definition = structuredCoursePlans["mit-8-02"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ kind }) => kind === "session").length, 23);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "assignment").length, 23);
  assert.ok(definition.tasks.every(({ url }) => url.startsWith("https://openlearninglibrary.mit.edu/courses/")));
});

test("MIT 6.031 follows all official readings, problem sets, quizzes, and project milestones", () => {
  const definition = structuredCoursePlans["mit-6-031"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("reading-")).length, 29);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("problem-set-")).length, 5);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "project").length, 2);
});

test("MIT 6.036 follows every official MITx week and its published work", () => {
  const definition = structuredCoursePlans["mit-6-036"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("week-")).length, 13);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("exercises-")).length, 13);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lab-")).length, 12);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("homework-")).length, 12);
});

test("MIT 6.253 follows all official lecture notes, homework sets, and the published exam", () => {
  const definition = structuredCoursePlans["mit-6-253"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 25);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("homework-")).length, 5);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 1);
});

test("Princeton COS 126 follows the current official lecture, assignment, project, and exam sequence", () => {
  const definition = structuredCoursePlans["princeton-cos126"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 21);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("assignment-")).length, 10);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 3);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "project").length, 1);
});

test("Princeton COS 226 follows the current official lecture, programming assignment, and exam sequence", () => {
  const definition = structuredCoursePlans["princeton-cos226"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 22);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("assignment-")).length, 7);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
});

test("Princeton COS 217 follows every official lecture, programming assignment, and exam", () => {
  const definition = structuredCoursePlans["princeton-cos217"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 23);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("assignment-")).length, 7);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
});

test("Princeton COS 240 follows the official topic allocation and midterm", () => {
  const definition = structuredCoursePlans["princeton-cos240"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 24);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 1);
  assert.ok(definition.tasks.every(({ url }) => url === "https://www.cs.princeton.edu/courses/archive/fall25/cos240/"));
});

test("Princeton COS 316 follows its current official systems lectures, assignment, and exams", () => {
  const definition = structuredCoursePlans["princeton-cos316"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 23);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("assignment-")).length, 1);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
});

test("Princeton COS 324 follows all official lectures, six assignments, and two exams", () => {
  const definition = structuredCoursePlans["princeton-cos324"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 22);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("assignment-")).length, 6);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
});

test("Princeton COS 418 follows all official lectures, precepts, assignments, and exams", () => {
  const definition = structuredCoursePlans["princeton-cos418"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 33);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("assignment-")).length, 5);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
});

test("additional Princeton courses follow their complete official public sequences", () => {
  const expected = { "princeton-cos423": [24, 6, 0], "princeton-cos432": [21, 6, 1], "princeton-cos461": [25, 0, 1] } as const;
  for (const [courseId, [lectures, assignments, exams]] of Object.entries(expected)) {
    const definition = structuredCoursePlans[courseId];
    assert.equal(definition.detail, "full");
    assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, lectures);
    assert.equal(definition.tasks.filter(({ id }) => id.startsWith("assignment-")).length, assignments);
    assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, exams);
  }
  assert.equal(structuredCoursePlans["princeton-cos461"].tasks.filter(({ kind }) => kind === "project").length, 2);
});

test("Princeton MAT 104 follows all twelve official weekly topics and practice sets", () => {
  const definition = structuredCoursePlans["princeton-mat104"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("week-")).length, 12);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("practice-")).length, 12);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
});

test("Princeton COS 333 follows the current official weekly, assignment, and project sequence", () => {
  const definition = structuredCoursePlans["princeton-cos333"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("week-")).length, 13);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("assignment-")).length, 4);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("project-")).length, 10);
});

test("Cornell CS 3780 follows its current public lectures, homework, projects, and exams", () => {
  const definition = structuredCoursePlans["cornell-cs3780"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 27);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("assignment-")).length, 6);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "project").length, 10);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
});

test("Cornell CS 3410 follows all current lectures, labs, assignments, and exams", () => {
  const definition = structuredCoursePlans["cornell-cs3410"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 27);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lab-")).length, 11);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("assignment-")).length, 11);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 3);
});

test("Cornell CS 4410 covers every officially listed OS unit and public assessment", () => {
  const definition = structuredCoursePlans["cornell-cs4410"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("module-") && !id.includes("practice")).length, 8);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 2);
});

test("Cornell CS 6787 follows all official lectures, discussions, reviews, and project milestones", () => {
  const definition = structuredCoursePlans["cornell-cs6787"];
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 15);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("paper-discussion-")).length, 12);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("paper-review-")).length, 11);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "project").length, 3);
});

test("Cornell CS 2110 and CS 3110 follow their complete official public texts", () => {
  assert.equal(structuredCoursePlans["cornell-cs2110"].tasks.filter(({ id }) => id.startsWith("lecture-")).length, 27);
  assert.equal(structuredCoursePlans["cornell-cs2110"].tasks.filter(({ id }) => id.startsWith("exercise-")).length, 27);
  assert.equal(structuredCoursePlans["cornell-cs3110"].tasks.filter(({ id }) => id.startsWith("chapter-") && !id.includes("exercises")).length, 10);
  assert.equal(structuredCoursePlans["cornell-cs3110"].tasks.filter(({ id }) => id.startsWith("chapter-exercises-")).length, 10);
});

test("Cornell CS 4820 follows every current lecture, homework quiz, and exam", () => {
  const definition = structuredCoursePlans["cornell-cs4820"];
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 41);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("homework-quiz-")).length, 9);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 3);
});

test("Cornell CS 1110 includes the official curriculum, labs, projects, and exams", () => {
  const definition = structuredCoursePlans["cornell-cs1110"];
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lesson-")).length, 26);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("lab-")).length, 26);
  assert.equal(definition.tasks.filter(({ id }) => id.startsWith("assignment-")).length, 7);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 3);
});

test("Princeton foundation courses expose complete official topic-and-practice plans", () => {
  for (const courseId of ["princeton-mat103", "princeton-mat201", "princeton-mat202", "princeton-phy103", "princeton-phy104", "princeton-chm201"]) {
    const definition = structuredCoursePlans[courseId];
    assert.equal(definition.detail, "full");
    assert.equal(definition.tasks.filter(({ id }) => id.startsWith("topic-")).length, 12);
    assert.equal(definition.tasks.filter(({ id }) => id.startsWith("practice-")).length, 12);
  }
});

test("Berkeley calculus courses turn every official topic unit into study and practice", () => {
  for (const courseId of ["berkeley-math1a", "berkeley-math1b"]) {
    assert.equal(structuredCoursePlans[courseId].detail, "full");
    assert.equal(structuredCoursePlans[courseId].tasks.length, 24);
    assert.equal(structuredCoursePlans[courseId].tasks.filter(({ kind }) => kind === "assignment").length, 12);
  }
});

test("Berkeley CS 61A and CS 70 follow their current official calendars", () => {
  assert.equal(structuredCoursePlans["berkeley-cs61a"].tasks.filter(({ id }) => id.startsWith("lecture-")).length, 40);
  assert.equal(structuredCoursePlans["berkeley-cs70"].tasks.filter(({ id }) => id.startsWith("lecture-")).length, 29);
  assert.equal(structuredCoursePlans["berkeley-cs70"].tasks.filter(({ id }) => id.startsWith("homework-")).length, 7);
  assert.equal(structuredCoursePlans["berkeley-cs70"].tasks.filter(({ kind }) => kind === "exam").length, 2);
});

test("Berkeley CS 170, CS 61C, and CS 184 include official lessons and graded work", () => {
  assert.equal(structuredCoursePlans["berkeley-cs170"].tasks.filter(({id})=>id.startsWith("topic-")).length,26);
  assert.equal(structuredCoursePlans["berkeley-cs170"].tasks.filter(({id})=>id.startsWith("homework-")).length,14);
  assert.equal(structuredCoursePlans["berkeley-cs61c"].tasks.filter(({id})=>id.startsWith("lecture-")).length,26);
  assert.equal(structuredCoursePlans["berkeley-cs61c"].tasks.filter(({kind})=>kind==="project").length,4);
  assert.equal(structuredCoursePlans["berkeley-cs184"].tasks.filter(({kind})=>kind==="project").length,6);
});

test("all remaining Berkeley courses provide official topic practice and projects", () => {
  const projects={"berkeley-cs61b":6,"berkeley-cs161":3,"berkeley-cs188":6,"berkeley-cs162":4,"berkeley-cs186":5,"berkeley-cs189":0};
  for(const [id,count] of Object.entries(projects)) {
    assert.equal(structuredCoursePlans[id].detail,"full");
    assert.ok(structuredCoursePlans[id].tasks.filter(({id})=>id.startsWith("topic-")).length>=15);
    assert.equal(structuredCoursePlans[id].tasks.filter(({kind})=>kind==="project").length,count);
  }
});

test("all Stanford catalog courses now have executable official-source plans",()=>{
 for(const id of ["stanford-cs103","stanford-cs161","stanford-cs144","stanford-cs143","stanford-cs148","stanford-cs221","stanford-cs155","stanford-cs244b"]){assert.equal(structuredCoursePlans[id].detail,"full");assert.ok(structuredCoursePlans[id].tasks.length>=24);}
});

test("remaining non-CMU university courses all have executable official curricula",()=>{
 for(const id of ["washington-cse550","tsinghua-20740112","tsinghua-computer-graphics","pku-computing-intro","pku-data-structures","pku-operating-systems","tsinghua-20740164","tsinghua-database-technology","uiuc-cs124","uiuc-cs128","uiuc-cs225","gatech-cs1301","gatech-cs2110","gatech-cs3510","harvard-cs61"]){assert.equal(structuredCoursePlans[id].detail,"full");assert.ok(structuredCoursePlans[id].tasks.length>=20);}
});

test("Cornell's required math and foundations courses use only verified official topic sequences", () => {
  for (const id of ["cornell-math1910", "cornell-math1920", "cornell-cs2800", "cornell-math2940"]) {
    const definition = structuredCoursePlans[id];
    assert.equal(definition.detail, "full");
    assert.ok(definition.tasks.length >= 7);
    assert.ok(definition.tasks.every(({ kind }) => kind === "session"));
  }
});

test("Harvard foundations follow official schedules, lectures, and public practice", () => {
  assert.equal(structuredCoursePlans["harvard-cs20"].tasks.filter(({ kind }) => kind === "session").length, 34);
  assert.equal(structuredCoursePlans["harvard-cs20"].tasks.filter(({ kind }) => kind === "exam").length, 2);
  assert.equal(structuredCoursePlans["harvard-math21b"].tasks.filter(({ kind }) => kind === "assignment").length, 13);
  assert.equal(structuredCoursePlans["harvard-stat110"].tasks.filter(({ kind }) => kind === "session").length, 34);
  assert.equal(structuredCoursePlans["harvard-stat110"].tasks.filter(({ kind }) => kind === "assignment").length, 11);
});

test("Illinois foundations and core courses follow their official public sequences", () => {
  assert.equal(structuredCoursePlans["uiuc-math221"].tasks.filter(({ kind }) => kind === "session").length, 22);
  assert.equal(structuredCoursePlans["uiuc-math231"].tasks.filter(({ kind }) => kind === "session").length, 21);
  assert.equal(structuredCoursePlans["uiuc-cs173"].tasks.filter(({ kind }) => kind === "session").length, 21);
  assert.equal(structuredCoursePlans["uiuc-cs341"].tasks.filter(({ kind }) => kind === "session").length, 40);
  assert.equal(structuredCoursePlans["uiuc-cs341"].tasks.filter(({ kind }) => kind === "project").length, 8);
  assert.equal(structuredCoursePlans["uiuc-cs341"].tasks.filter(({ kind }) => kind === "assignment").length, 14);
  assert.equal(structuredCoursePlans["uiuc-cs341"].tasks.filter(({ kind }) => kind === "exam").length, 2);
  assert.equal(structuredCoursePlans["uiuc-cs357"].tasks.filter(({ kind }) => kind === "session").length, 19);
  assert.equal(structuredCoursePlans["uiuc-cs357"].tasks.filter(({ kind }) => kind === "assignment").length, 19);
  assert.equal(structuredCoursePlans["uiuc-cs357"].tasks.filter(({ kind }) => kind === "project").length, 5);
  assert.equal(structuredCoursePlans["uiuc-cs357"].tasks.filter(({ kind }) => kind === "exam").length, 7);
  assert.equal(structuredCoursePlans["uiuc-cs361"].tasks.filter(({ kind }) => kind === "session").length, 24);
  assert.equal(structuredCoursePlans["uiuc-cs374"].tasks.filter(({ kind }) => kind === "session").length, 26);
  assert.equal(structuredCoursePlans["uiuc-cs374"].tasks.filter(({ kind }) => kind === "assignment").length, 12);
  assert.equal(structuredCoursePlans["uiuc-cs374"].tasks.filter(({ kind }) => kind === "exam").length, 3);
});

test("Georgia Tech shared foundations follow official 2026 syllabi", () => {
  assert.equal(structuredCoursePlans["gatech-math1551"].tasks.filter(({ kind }) => kind === "session").length, 14);
  assert.equal(structuredCoursePlans["gatech-math1552"].tasks.filter(({ kind }) => kind === "session").length, 17);
  assert.equal(structuredCoursePlans["gatech-math1552"].tasks.filter(({ kind }) => kind === "exam").length, 4);
  assert.equal(structuredCoursePlans["gatech-cs1331"].tasks.filter(({ kind }) => kind === "session").length, 15);
  assert.equal(structuredCoursePlans["gatech-cs1332"].tasks.filter(({ kind }) => kind === "session").length, 22);
  assert.equal(structuredCoursePlans["gatech-cs2050"].tasks.filter(({ kind }) => kind === "session").length, 25);
  assert.equal(structuredCoursePlans["gatech-cs2050"].tasks.filter(({ kind }) => kind === "exam").length, 4);
  assert.equal(structuredCoursePlans["gatech-cs2340"].tasks.filter(({ kind }) => kind === "session").length, 13);
  assert.equal(structuredCoursePlans["gatech-cs2340"].tasks.filter(({ kind }) => kind === "project").length, 5);
});

test("new Tsinghua and PKU mathematics courses follow official published content", () => {
  assert.equal(structuredCoursePlans["tsinghua-linear-algebra"].tasks.filter(({ kind }) => kind === "session").length, 17);
  assert.equal(structuredCoursePlans["tsinghua-linear-algebra"].tasks.filter(({ kind }) => kind === "assignment").length, 17);
  assert.equal(structuredCoursePlans["pku-higher-algebra-1"].tasks.filter(({ kind }) => kind === "session").length, 15);
  assert.equal(structuredCoursePlans["pku-probability"].tasks.filter(({ kind }) => kind === "session").length, 19);
});

test("Tsinghua operating systems follows every official lecture, ucore lab, and final", () => {
  const definition = structuredCoursePlans["tsinghua-operating-systems"];
  assert.equal(definition.tasks.filter(({ kind }) => kind === "session").length, 14);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "project").length, 10);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, 1);
});

test("Tsinghua combinatorics and algorithms follow every published unit and assessment", () => {
  const combinatorics = structuredCoursePlans["tsinghua-combinatorics"];
  assert.equal(combinatorics.tasks.filter(({ kind }) => kind === "session").length, 8);
  assert.equal(combinatorics.tasks.filter(({ kind }) => kind === "assignment").length, 8);
  assert.equal(combinatorics.tasks.filter(({ kind }) => kind === "exam").length, 1);
  const algorithms = structuredCoursePlans["tsinghua-algorithm-design"];
  assert.equal(algorithms.tasks.filter(({ kind }) => kind === "session").length, 11);
  assert.equal(algorithms.tasks.filter(({ kind }) => kind === "assignment").length, 11);
  assert.equal(algorithms.tasks.filter(({ kind }) => kind === "exam").length, 1);
});

test("PKU systems, network, database, and algorithm plans follow official outlines", () => {
  assert.equal(structuredCoursePlans["pku-algorithm-design"].tasks.filter(({ kind }) => kind === "session").length, 13);
  assert.equal(structuredCoursePlans["pku-computer-organization"].tasks.filter(({ kind }) => kind === "session").length, 12);
  assert.equal(structuredCoursePlans["pku-computer-organization"].tasks.filter(({ kind }) => kind === "project").length, 3);
  assert.equal(structuredCoursePlans["pku-computer-networks"].tasks.filter(({ kind }) => kind === "session").length, 16);
  assert.equal(structuredCoursePlans["pku-computer-networks"].tasks.filter(({ kind }) => kind === "assignment").length, 3);
  assert.equal(structuredCoursePlans["pku-databases"].tasks.filter(({ kind }) => kind === "session").length, 15);
  assert.equal(structuredCoursePlans["pku-databases"].tasks.filter(({ kind }) => kind === "assignment").length, 4);
});

test("Tsinghua digital logic and computer organization follow current official labs and schedules", () => {
  assert.equal(structuredCoursePlans["tsinghua-digital-logic-lab"].tasks.filter(({ kind }) => kind === "project").length, 8);
  assert.equal(structuredCoursePlans["tsinghua-digital-logic-lab"].tasks.filter(({ kind }) => kind === "exam").length, 1);
  assert.equal(structuredCoursePlans["tsinghua-computer-organization"].tasks.filter(({ kind }) => kind === "session").length, 22);
  assert.equal(structuredCoursePlans["tsinghua-computer-organization"].tasks.filter(({ kind }) => kind === "project").length, 6);
  assert.equal(structuredCoursePlans["tsinghua-computer-organization"].tasks.filter(({ kind }) => kind === "assignment").length, 4);
});

test("all 164 catalog courses now have substantive official-source plans",()=>{
 const definitions=Object.values(structuredCoursePlans);assert.equal(definitions.length,164);assert.ok(definitions.every(({detail,tasks})=>detail==="full"&&tasks.length>=2));
});

test("MIT economics plans follow every official lecture and assessment", () => {
  const micro = structuredCoursePlans["mit-14-01"];
  assert.equal(micro.tasks.filter(({ kind }) => kind === "session").length, 26);
  assert.equal(micro.tasks.filter(({ kind }) => kind === "assignment").length, 8);
  assert.equal(micro.tasks.filter(({ kind }) => kind === "exam").length, 2);
  assert.ok(micro.tasks.filter(({ kind }) => kind === "assignment").every(({ url }) => url.includes("/lists/problem-sets/")));
  assert.ok(micro.tasks.filter(({ kind }) => kind === "exam").every(({ url }) => url.includes("/lists/exams/")));
  const macro = structuredCoursePlans["mit-14-02"];
  assert.equal(macro.tasks.filter(({ kind }) => kind === "session").length, 25);
  assert.equal(macro.tasks.filter(({ kind }) => kind === "assignment").length, 8);
  assert.equal(macro.tasks.filter(({ kind }) => kind === "exam").length, 3);
});

test("MIT genetics, organic chemistry, and waves follow their complete official sequences", () => {
  const expected = {
    "mit-7-03": { session: 35, assignment: 7, exam: 4 },
    "mit-5-12": { session: 35, assignment: 9, exam: 5 },
    "mit-8-03sc": { session: 24, assignment: 10, exam: 3 },
  } as const;
  for (const [id, counts] of Object.entries(expected)) {
    const definition = structuredCoursePlans[id];
    assert.equal(definition.tasks.filter(({ kind }) => kind === "session").length, counts.session);
    assert.equal(definition.tasks.filter(({ kind }) => kind === "assignment").length, counts.assignment);
    assert.equal(definition.tasks.filter(({ kind }) => kind === "exam").length, counts.exam);
  }
});

test("Berkeley MATH 54 and CMU 15-418 follow their official published sequences", () => {
  const math54 = structuredCoursePlans["berkeley-math54"];
  assert.equal(math54.tasks.length, 10);
  assert.equal(math54.tasks.filter(({ kind }) => kind === "assignment").length, 0);
  assert.ok(math54.tasks.some(({ url }) => url.endsWith("lecture_notes_on_svd_for_math_54.pdf")));
  const parallel = structuredCoursePlans["cmu-15-418"];
  assert.equal(parallel.tasks.filter(({ id }) => id.startsWith("lecture-")).length, 25);
  assert.equal(parallel.tasks.filter(({ kind }) => kind === "assignment").length, 4);
  assert.equal(parallel.tasks.filter(({ kind }) => kind === "exam").length, 2);
  assert.equal(parallel.tasks.filter(({ kind }) => kind === "project").length, 5);
});

test("CS50x follows the official weeks, problem sets, AI module, and final project", () => {
  const definition = structuredCoursePlans["harvard-cs50x"];
  assert.equal(definition.detail, "full");
  assert.equal(definition.tasks.length, 23);
  assert.equal(definition.tasks.filter(({ kind }) => kind === "assignment").length, 10);
  assert.ok(definition.tasks.every(({ url }) => url.startsWith("https://cs50.harvard.edu/x/")));
  assert.equal(buildGentlePlan("harvard-cs50x", 30)?.plannedDays, 35);
});

test("verified CS50 courses expose their full official weekly sequences", () => {
  const expected = { "harvard-cs50-python": 21, "harvard-cs50-ai": 14, "harvard-cs50-web": 19, "harvard-cs50-cybersecurity": 11, "harvard-cs50-sql": 15, "harvard-cs50-r": 15, "harvard-cs50-scratch": 19 };
  for (const [courseId, taskCount] of Object.entries(expected)) {
    assert.equal(structuredCoursePlans[courseId].detail, "full");
    assert.equal(structuredCoursePlans[courseId].tasks.length, taskCount);
    assert.ok(structuredCoursePlans[courseId].tasks.every(({ url }) => url.startsWith("https://cs50.harvard.edu/")));
  }
});
