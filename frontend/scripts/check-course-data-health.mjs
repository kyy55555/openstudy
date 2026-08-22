import { courses } from "../data/courses.ts";
import { learningPaths } from "../data/learningPaths.ts";
import { structuredCoursePlans } from "../data/coursePlans.ts";

const now = new Date();
const staleAfterDays = 180;
const critical = [];
const warnings = [];

function ageInDays(dateValue) {
  const timestamp = Date.parse(`${dateValue}T00:00:00Z`);
  return Number.isFinite(timestamp) ? Math.floor((now.getTime() - timestamp) / 86_400_000) : null;
}

function add(target, id, issue) {
  target.push({ id, issue });
}

for (const course of courses) {
  if (!course.title.trim() || !course.titleZh?.trim()) add(critical, course.id, "missing bilingual title");
  if (!course.description.trim() || !course.descriptionZh?.trim()) add(critical, course.id, "missing bilingual description");
  if (course.courseUrl !== course.sourceUrl) add(critical, course.id, "course and provenance URLs differ");
  if (!course.sourceName.trim()) add(critical, course.id, "missing source name");
  const verifiedAge = ageInDays(course.verifiedOn);
  if (verifiedAge === null || verifiedAge < 0) add(critical, course.id, "invalid or future verification date");
  else if (verifiedAge > staleAfterDays) add(warnings, course.id, `verification is ${verifiedAge} days old`);

  const resourceUrls = course.resources.map(({ url }) => url);
  const plan = structuredCoursePlans[course.id];
  if (new Set(resourceUrls).size !== resourceUrls.length) add(critical, course.id, "duplicate official resource URL");
  if (resourceUrls.includes(course.courseUrl)) add(warnings, course.id, "resource repeats the main course URL");
  if (course.resources.length === 0) add(warnings, course.id, "no separate official resource entry");
  if (course.hasVideos === true && !course.resources.some(({ type }) => type === "lectures")) add(warnings, course.id, "video claim has no separate lecture/video entry");
  if (course.hasAssignments === true && !course.resources.some(({ type }) => ["assignments", "projects", "exams"].includes(type)) && !plan?.tasks.some(({ kind }) => ["assignment", "project", "exam"].includes(kind))) add(warnings, course.id, "assignment claim has no official work entry in resources or plan");

  if (!plan) add(critical, course.id, "missing study plan");
  else {
    if (plan.tasks.length < 2) add(critical, course.id, "study plan has fewer than two substantive tasks");
    for (const task of plan.tasks) {
      if (!task.title.trim() || !task.titleZh.trim()) add(critical, course.id, `plan task ${task.id} lacks a bilingual title`);
      try {
        new URL(task.url);
      } catch {
        add(critical, course.id, `plan task ${task.id} has an invalid URL`);
      }
    }
  }
}

for (const path of learningPaths) {
  const verifiedAge = ageInDays(path.verifiedOn);
  if (verifiedAge === null || verifiedAge < 0) add(critical, path.id, "invalid or future curriculum verification date");
  else if (verifiedAge > staleAfterDays) add(warnings, path.id, `curriculum verification is ${verifiedAge} days old`);
  if (!path.officialUrl || !path.sourceEdition.trim() || !path.sourceEditionZh.trim()) add(critical, path.id, "missing curriculum provenance");
  if (path.phases.length < 8) add(warnings, path.id, "curriculum has fewer than eight displayed terms");
}

const universityCoverage = Object.entries(Object.groupBy(courses, ({ university }) => university))
  .map(([university, items]) => ({ university, courses: items.length, withResources: items.filter(({ resources }) => resources.length > 0).length }))
  .sort((a, b) => b.courses - a.courses || a.university.localeCompare(b.university));

console.log(`Course data health: ${courses.length} courses, ${learningPaths.length} curricula, ${critical.length} critical issues, ${warnings.length} warnings.`);
console.log("University coverage:");
for (const item of universityCoverage) console.log(`- ${item.university}: ${item.courses} courses; ${item.withResources} with separate official resources`);
if (warnings.length) {
  console.log("Warnings:");
  for (const warning of warnings) console.log(`- ${warning.id}: ${warning.issue}`);
}
if (critical.length) {
  console.error("Critical issues:");
  for (const issue of critical) console.error(`- ${issue.id}: ${issue.issue}`);
  process.exitCode = 1;
}
