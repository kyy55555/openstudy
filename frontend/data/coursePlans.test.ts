import assert from "node:assert/strict";
import test from "node:test";
import { buildGentlePlan, structuredCoursePlans } from "./coursePlans.ts";

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
