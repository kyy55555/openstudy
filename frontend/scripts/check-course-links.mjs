import { courses } from "../data/courses.ts";

const officialHosts = new Set([
  "ocw.mit.edu",
  "see.stanford.edu",
  "cs50.harvard.edu",
]);

const officialHomePaths = new Set(["/", "/index.html"]);

async function checkCourse(course) {
  const response = await fetch(course.courseUrl, {
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
  });
  const finalUrl = new URL(response.url);
  const errors = [];

  if (!response.ok) errors.push(`HTTP ${response.status}`);
  if (!officialHosts.has(finalUrl.hostname)) {
    errors.push(`redirected outside an approved official host to ${finalUrl.hostname}`);
  }
  if (officialHomePaths.has(finalUrl.pathname)) {
    errors.push(`redirected to the official site's home page`);
  }

  return { course, finalUrl: finalUrl.href, errors };
}

const results = await Promise.all(
  courses.map(async (course) => {
    try {
      return await checkCourse(course);
    } catch (error) {
      return { course, finalUrl: null, errors: [String(error)] };
    }
  }),
);

let failureCount = 0;

for (const { course, finalUrl, errors } of results) {
  if (errors.length === 0) {
    console.log(`PASS ${course.id} -> ${finalUrl}`);
    continue;
  }

  failureCount += 1;
  console.error(`FAIL ${course.id}: ${errors.join("; ")}`);
}

console.log(`\nChecked ${results.length} official course links: ${results.length - failureCount} passed, ${failureCount} failed.`);

if (failureCount > 0) process.exitCode = 1;
