# OpenStudy

OpenStudy indexes verified public university courses and builds prerequisite-aware self-study paths.

Public Beta: [https://openstudy-sigma.vercel.app](https://openstudy-sigma.vercel.app)

## Local development

Use Node.js 24 (the repository includes `.nvmrc`).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Optional free cloud sync

The site works without cloud configuration: guest progress and saved courses stay in the browser. To enable email accounts and cross-device sync with a free Supabase project:

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in its SQL editor. This creates learning records, first-party product events, aggregate retention views, and Row Level Security policies.
3. Copy `.env.example` to `.env.local` and enter the project URL and publishable key. Never expose a secret or service-role key.
4. Set `NEXT_PUBLIC_SITE_URL` to the public Beta URL.
5. In Supabase Authentication URL Configuration, set the Site URL to the public Beta URL. Add both the public Beta URL and its `/account` page to Redirect URLs so confirmation and password-recovery emails return to OpenStudy.
6. Keep email confirmation enabled, restart the app, and use `/account` to register.

Before launching, verify the host's environment configuration:

```bash
npm run check:launch-env
```

This command intentionally fails when any cloud variable is missing or when the public site URL is not HTTPS.

After the deployment is live, verify its public pages in one command:

```bash
OPENSTUDY_SMOKE_URL=https://your-beta-domain.example npm run check:smoke
```

For local development, `npm run check:smoke` checks `http://localhost:3000` by default.

Only authenticated users write to Supabase. Guest and account records remain separate and are never merged automatically. The cloud record contains course progress, completed resource links, saved course IDs, the account ID, and an update timestamp; course content remains on official university websites.

Anonymous and authenticated visitors can submit Beta feedback, but cannot read feedback rows. The SQL script is safe to run again when policies change.

Feedback rows include a category, review status, interface language, coarse viewport class, and deployment commit when available. The form automatically falls back to the legacy columns during a staggered deployment, so run `supabase/schema.sql` before or shortly after publishing the matching frontend. Manage the `new → reviewing → resolved/closed` workflow in the Supabase dashboard; these operational fields are never readable through the public client.

The current Beta does not use advertising trackers. Vercel provides anonymous traffic aggregates, while the Supabase `product_events` table stores privacy-minimized first-party product actions with random visitor/session IDs. It never stores account email, passwords, full URLs, IP addresses, or device fingerprints. Feedback stores the submitted message, optional reply email, submission time, and feedback-page URL. Never ask users to include passwords in feedback.

### Product behavior and retention

After applying `supabase/schema.sql`, use Supabase Table Editor to inspect:

- `product_daily_summary`: daily event, visitor, and session counts.
- `product_retention`: exact day-1, day-7, day-14, and day-30 returning visitors by first-seen cohort.
- `product_events`: bounded raw events for course/search/funnel analysis. This table is owner-only; the public client can insert but cannot read it.

Useful SQL Editor query for the latest 30-day funnel:

```sql
select event_name, count(*) as events, count(distinct anonymous_id) as visitors
from public.product_events
where created_at >= now() - interval '30 days'
group by event_name
order by visitors desc;
```

Apply the schema before deploying the matching frontend. Until the table exists, analytics calls fail silently and never block the learner experience.

## Beta deployment checklist

The full release, tester-cohort, incident, and rollback procedure is in [`docs/BETA_LAUNCH.md`](docs/BETA_LAUNCH.md).

- Configure the three environment variables from `.env.example` in the host.
- When importing the GitHub repository into Vercel, set the project Root Directory to `frontend` and keep the detected Next.js build settings.
- Run `supabase/schema.sql` and verify Row Level Security is enabled on both tables.
- Confirm a new account by email, then verify progress on a second browser.
- Send a password-reset email and verify that its link opens `/account` and accepts a new password.
- Verify that guest progress does not appear inside the account after sign-in.
- Download a learning-record backup from `/dashboard` and confirm that it contains no email or password.
- Run all checks below and review any link warnings manually.
- Submit one test item from `/feedback`, verify that it appears in Supabase, and remove the test row.
- Confirm both English and Chinese privacy pages accurately describe the deployed services before launch.
- Use a custom domain only after the preview deployment passes these checks.

## Checks

GitHub Actions runs the test, lint, and production-build checks on pull requests and pushes to `main`. The external-link audit remains an explicit launch check because university sites may rate-limit automated CI traffic.

```bash
npm run check:beta
```

Or run the individual checks:

```bash
npm test
npm run lint
npm run check:data
npm run build
npm run check:bundle
npm run check:links
npm run check:smoke
```
