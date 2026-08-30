import { courses } from "../data/courses.ts";
import { learningPaths } from "../data/learningPaths.ts";
import { structuredCoursePlans } from "../data/coursePlans.ts";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const verbose = process.env.LINK_CHECK_VERBOSE === "1";
const requestedIds = new Set(
  (process.env.LINK_CHECK_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean),
);
const requestHeaders = { "User-Agent": "Mozilla/5.0 (compatible; OpenStudyLinkAudit/1.0; +https://openstudy-sigma.vercel.app/)" };

const pathUrls = learningPaths.flatMap((path) => [path.officialUrl, ...(path.additionalOfficialSources ?? []).map((source) => source.url)]);
const listedUrls = [...courses.flatMap((course) => [course.courseUrl, ...course.resources.map((resource) => resource.url), structuredCoursePlans[course.id]?.sourceUrl, ...(structuredCoursePlans[course.id]?.tasks ?? []).map((task) => task.url)]), ...pathUrls];
const officialHosts = new Set(listedUrls.map((url) => new URL(url).hostname));

function isApprovedHost(hostname) {
  const withoutWww = hostname.replace(/^www\./, "");
  return [...officialHosts].some((host) => host.replace(/^www\./, "") === withoutWww);
}

const officialHomePaths = new Set(["/", "/index.html"]);

async function checkUrl(course, url, label) {
  let response = await fetch(url, {
    method: "HEAD",
    headers: requestHeaders,
    redirect: "follow",
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok && ![401, 403, 429].includes(response.status)) {
    response = await fetch(url, {
      headers: requestHeaders,
      redirect: "follow",
      signal: AbortSignal.timeout(8_000),
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

async function checkUrlWithCurl(course, url, label) {
  const { stdout } = await execFileAsync("curl", [
    "--location",
    "--silent",
    "--show-error",
    "--output",
    "/dev/null",
    "--max-time",
    "20",
    "--user-agent",
    requestHeaders["User-Agent"],
    "--write-out",
    "%{http_code}\n%{url_effective}",
    url,
  ]);
  const [statusText, ...finalUrlLines] = stdout.trim().split("\n");
  const status = Number(statusText);
  const finalUrl = new URL(finalUrlLines.join("\n") || url);
  const requestedUrl = new URL(url);
  const errors = [];
  const warnings = [];

  if ([401, 403, 429].includes(status)) warnings.push(`HTTP ${status}; official site blocks automated checks`);
  else if (status < 200 || status >= 400) errors.push(`HTTP ${status || "unknown"}`);
  if (!isApprovedHost(finalUrl.hostname)) {
    errors.push(`redirected outside an approved official host to ${finalUrl.hostname}`);
  }
  if (
    officialHomePaths.has(finalUrl.pathname) &&
    !officialHomePaths.has(requestedUrl.pathname)
  ) {
    errors.push(`redirected to the official site's home page`);
  }

  return { course, label, requestedUrl: url, finalUrl: finalUrl.href, errors, warnings };
}

const allChecks = [...courses.flatMap((course) => {
    const existingUrls = new Set([course.courseUrl, ...course.resources.map((resource) => resource.url)]);
    const planUrls = [...new Set([structuredCoursePlans[course.id]?.sourceUrl, ...(structuredCoursePlans[course.id]?.tasks ?? []).map((task) => task.url)].filter(Boolean))]
      .filter((url) => !existingUrls.has(url));
    return [
    { course, url: course.courseUrl, label: "course" },
    ...course.resources.map((resource) => ({
      course,
      url: resource.url,
      label: resource.type,
    })),
    ...planUrls.map((url) => ({ course, url, label: "study-plan" })),
  ];}), ...learningPaths.flatMap((path) => [
    { course: path, url: path.officialUrl, label: "curriculum" },
    ...(path.additionalOfficialSources ?? []).map((source) => ({ course: path, url: source.url, label: "curriculum-source" })),
  ])];
const checks = requestedIds.size > 0
  ? allChecks.filter(({ course }) => requestedIds.has(course.id))
  : allChecks;

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
        try {
          results[index] = await checkUrlWithCurl(course, url, label);
        } catch (curlError) {
          results[index] = { course, label, requestedUrl: url, finalUrl: null, errors: [], warnings: [`fetch and curl checks failed: ${String(retryError)}; ${String(curlError)}`] };
        }
      }
    }
  }
}

await Promise.all(Array.from({ length: 12 }, () => worker()));

let failureCount = 0;
let warningCount = 0;

for (const { course, label, requestedUrl, finalUrl, errors, warnings } of results) {
  if (warnings.length > 0) {
    warningCount += 1;
    console.warn(
      `WARN ${course.id} [${label}] ${requestedUrl}: ${warnings.join("; ")}`,
    );
  }
  if (errors.length === 0) {
    if (warnings.length === 0 && verbose) console.log(`PASS ${course.id} [${label}] -> ${finalUrl}`);
    continue;
  }

  failureCount += 1;
    console.error(`FAIL ${course.id} [${label}] ${requestedUrl}: ${errors.join("; ")}`);
}

console.log(`\nChecked ${results.length} official course, resource, study-plan, and curriculum links: ${results.length - failureCount - warningCount} passed, ${warningCount} warned, ${failureCount} failed.`);

if (failureCount > 0) process.exitCode = 1;
