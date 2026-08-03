const required = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
];

const missing = required.filter((name) => !process.env[name]?.trim());
if (missing.length) {
  console.error(`Missing launch environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL);
const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);

if (siteUrl.protocol !== "https:") throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS for launch.");
if (supabaseUrl.protocol !== "https:" || !supabaseUrl.hostname.endsWith(".supabase.co")) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL must be an HTTPS Supabase project URL.");
}
if (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.length < 20) {
  throw new Error("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY does not look valid.");
}

console.log(`Launch environment is configured for ${siteUrl.origin}.`);
