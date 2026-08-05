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
  return path;
}));

const [robotsResponse, sitemapResponse] = await Promise.all([
  fetch(`${base}/robots.txt`),
  fetch(`${base}/sitemap.xml`),
]);
if (!robotsResponse.ok || !sitemapResponse.ok) throw new Error("robots.txt or sitemap.xml is unavailable");

const [robots, sitemap] = await Promise.all([robotsResponse.text(), sitemapResponse.text()]);
if (!robots.includes(`${base}/sitemap.xml`)) throw new Error("robots.txt points to the wrong sitemap URL");
if (!sitemap.includes(`${base}/courses/mit-18-01sc`)) throw new Error("sitemap.xml is missing course detail URLs");
if (sitemap.includes(`${base}//`)) throw new Error("sitemap.xml contains double-slash paths");

console.log(`Smoke test passed for ${results.length + 2} public endpoints at ${base}.`);
