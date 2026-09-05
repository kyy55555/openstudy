const base = (process.env.OPENSTUDY_SMOKE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

const checks = [
  ["/", "OpenStudy"],
  ["/courses", "OpenStudy"],
  ["/paths", "OpenStudy"],
  ["/courses/mit-18-01sc", "Single Variable Calculus"],
  ["/dashboard", "OpenStudy"],
  ["/account", "OpenStudy"],
  // These bilingual client-rendered pages return the shared application shell
  // in the initial HTML; their visible localized headings are browser-tested.
  ["/privacy", "OpenStudy"],
  ["/terms", "OpenStudy"],
  ["/feedback", "OpenStudy"],
];

const results = await Promise.all(checks.map(async ([path, marker]) => {
  const response = await fetch(`${base}${path}`, { redirect: "follow" });
  const body = await response.text();
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
  if (!body.includes(marker)) throw new Error(`${path} is missing expected content: ${marker}`);
  const requiredHeaders = {
    "content-security-policy": ["default-src 'self'", "frame-ancestors 'none'", "object-src 'none'"],
    "referrer-policy": ["strict-origin-when-cross-origin"],
    "x-content-type-options": ["nosniff"],
    "x-frame-options": ["DENY"],
    "permissions-policy": ["camera=()", "microphone=()", "geolocation=()"],
    "cross-origin-opener-policy": ["same-origin"],
  };
  for (const [header, expectedParts] of Object.entries(requiredHeaders)) {
    const value = response.headers.get(header) ?? "";
    for (const expected of expectedParts) {
      if (!value.includes(expected)) throw new Error(`${path} is missing security header value ${header}: ${expected}`);
    }
  }
  if (base.startsWith("https://") && !response.headers.get("strict-transport-security")?.includes("max-age=")) {
    throw new Error(`${path} is missing Strict-Transport-Security on HTTPS`);
  }
  return path;
}));

const [robotsResponse, sitemapResponse] = await Promise.all([
  fetch(`${base}/robots.txt`),
  fetch(`${base}/sitemap.xml`),
]);
if (!robotsResponse.ok || !sitemapResponse.ok) throw new Error("robots.txt or sitemap.xml is unavailable");

const [robots, sitemap] = await Promise.all([robotsResponse.text(), sitemapResponse.text()]);
const sitemapDirective = robots.match(/^Sitemap:\s*(\S+)$/im)?.[1];
if (!sitemapDirective) throw new Error("robots.txt is missing an absolute sitemap URL");
const canonicalSitemapUrl = new URL(sitemapDirective);
if (canonicalSitemapUrl.pathname !== "/sitemap.xml") throw new Error("robots.txt points to the wrong sitemap path");

const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
if (!sitemapLocations.some(({ pathname }) => pathname === "/courses/mit-18-01sc")) throw new Error("sitemap.xml is missing course detail URLs");
if (sitemapLocations.some(({ origin }) => origin !== canonicalSitemapUrl.origin)) throw new Error("sitemap.xml mixes canonical origins");
if (sitemapLocations.some(({ pathname }) => pathname.includes("//"))) throw new Error("sitemap.xml contains double-slash paths");

console.log(`Smoke test passed for ${results.length + 2} public endpoints at ${base}.`);
