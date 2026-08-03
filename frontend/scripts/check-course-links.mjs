import { courses } from "../data/courses.ts";

const listedUrls = courses.flatMap((course) => [course.courseUrl, ...course.resources.map((resource) => resource.url)]);
const officialHosts = new Set(listedUrls.map((url) => new URL(url).hostname));

function isApprovedHost(hostname) {
  const withoutWww = hostname.replace(/^www\./, "");
  return [...officialHosts].some((host) => host.replace(/^www\./, "") === withoutWww);
}

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
  const warnings = [];

  if ([401, 403, 429].includes(response.status)) warnings.push(`HTTP ${response.status}; official site blocks automated checks`);
  else if (!response.ok) errors.push(`HTTP ${response.status}`);
  if (!isApprovedHost(finalUrl.hostname)) {
    errors.push(`redirected outside an approved official host to ${finalUrl.hostname}`);
  }
  const requestedUrl = new URL(url);
  if (
    officialHomePaths.has(finalUrl.pathname) &&
    !officialHomePaths.has(requestedUrl.pathname)
  ) {
    errors.push(`redirected to the official site's home page`);
  }

  return { course, label, requestedUrl: url, finalUrl: finalUrl.href, errors, warnings };
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
        results[index] = { course, label, requestedUrl: url, finalUrl: null, errors: [], warnings: [`automated request failed twice: ${String(retryError)}`] };
      }
    }
  }
}

await Promise.all(Array.from({ length: 6 }, () => worker()));

let failureCount = 0;
let warningCount = 0;

for (const { course, label, finalUrl, errors, warnings } of results) {
  if (warnings.length > 0) {
    warningCount += 1;
    console.warn(`WARN ${course.id} [${label}]: ${warnings.join("; ")}`);
  }
  if (errors.length === 0) {
    if (warnings.length === 0) console.log(`PASS ${course.id} [${label}] -> ${finalUrl}`);
    continue;
  }

  failureCount += 1;
  console.error(`FAIL ${course.id} [${label}]: ${errors.join("; ")}`);
}

console.log(`\nChecked ${results.length} official course and resource links: ${results.length - failureCount - warningCount} passed, ${warningCount} warned, ${failureCount} failed.`);

if (failureCount > 0) process.exitCode = 1;
