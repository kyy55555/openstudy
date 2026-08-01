import { courses } from "../data/courses.ts";

const officialHosts = new Set([
  "ocw.mit.edu",
  "see.stanford.edu",
  "cs50.harvard.edu",
  "www.cs.princeton.edu",
  "www.cs.cornell.edu",
  "inst.eecs.berkeley.edu",
  "courses.cs.washington.edu",
  "cs61a.org",
  "sp26.datastructur.es",
  "www.eecs70.org",
  "cs61c.org",
  "web.stanford.edu",
  "web.mit.edu",
  "pdos.csail.mit.edu",
  "cs162.org",
  "cs170.org",
  "cs186berkeley.net",
  "cs144.github.io",
  "cs184.eecs.berkeley.edu",
  "eecs189.org",
  "openlearninglibrary.mit.edu",
  "cs155.stanford.edu",
]);

const officialHomePaths = new Set(["/", "/index.html"]);

async function checkUrl(course, url, label) {
  let response = await fetch(url, {
    method: "HEAD",
    redirect: "follow",
    signal: AbortSignal.timeout(20_000),
  });
  if (response.status === 405 || response.status === 501) {
    response = await fetch(url, {
      headers: { Range: "bytes=0-0" },
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
    });
  }
  const finalUrl = new URL(response.url);
  const errors = [];

  if (!response.ok) errors.push(`HTTP ${response.status}`);
  if (!officialHosts.has(finalUrl.hostname)) {
    errors.push(`redirected outside an approved official host to ${finalUrl.hostname}`);
  }
  const requestedUrl = new URL(url);
  if (
    officialHomePaths.has(finalUrl.pathname) &&
    !officialHomePaths.has(requestedUrl.pathname)
  ) {
    errors.push(`redirected to the official site's home page`);
  }

  return { course, label, requestedUrl: url, finalUrl: finalUrl.href, errors };
}

const checks = courses.flatMap((course) => [
    { course, url: course.courseUrl, label: "course" },
    ...course.resources.map((resource) => ({
      course,
      url: resource.url,
      label: resource.type,
    })),
  ]);

const results = new Array(checks.length);
let nextCheck = 0;

async function worker() {
  while (nextCheck < checks.length) {
    const index = nextCheck++;
    const { course, url, label } = checks[index];
    try {
      results[index] = await checkUrl(course, url, label);
    } catch {
      try {
        results[index] = await checkUrl(course, url, label);
      } catch (retryError) {
        results[index] = { course, label, requestedUrl: url, finalUrl: null, errors: [String(retryError)] };
      }
    }
  }
}

await Promise.all(Array.from({ length: 6 }, () => worker()));

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
