import { courses } from "../data/courses.ts";

const officialHosts = new Set([
  "ocw.mit.edu",
  "see.stanford.edu",
  "cs50.harvard.edu",
  "www.cs.princeton.edu",
  "www.cs.cornell.edu",
  "inst.eecs.berkeley.edu",
  "courses.cs.washington.edu",
]);

const officialHomePaths = new Set(["/", "/index.html"]);

async function checkUrl(course, url, label) {
  const response = await fetch(url, {
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

  return { course, label, requestedUrl: url, finalUrl: finalUrl.href, errors };
}

const results = await Promise.all(
  courses.flatMap((course) => [
    { course, url: course.courseUrl, label: "course" },
    ...course.resources.map((resource) => ({
      course,
      url: resource.url,
      label: resource.type,
    })),
  ]).map(async ({ course, url, label }) => {
    try {
      return await checkUrl(course, url, label);
    } catch (error) {
      return { course, label, requestedUrl: url, finalUrl: null, errors: [String(error)] };
    }
  }),
);

let failureCount = 0;

for (const { course, label, finalUrl, errors } of results) {
  if (errors.length === 0) {
    console.log(`PASS ${course.id} [${label}] -> ${finalUrl}`);
    continue;
  }

  failureCount += 1;
  console.error(`FAIL ${course.id} [${label}]: ${errors.join("; ")}`);
}

console.log(`\nChecked ${results.length} official course and resource links: ${results.length - failureCount} passed, ${failureCount} failed.`);

if (failureCount > 0) process.exitCode = 1;
