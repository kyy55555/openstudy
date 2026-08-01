# OpenStudy

OpenStudy indexes verified public university courses and builds prerequisite-aware self-study paths.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Optional free cloud sync

The site works without cloud configuration: guest progress and saved courses stay in the browser. To enable email accounts and cross-device sync with a free Supabase project:

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in its SQL editor. This creates the progress table and user-only Row Level Security policies.
3. Copy `.env.example` to `.env.local` and enter the project URL and publishable key. Never expose a secret or service-role key.
4. Restart the development server and use `/account` to register.

Only authenticated users write to Supabase. Guest and account records remain separate and are never merged automatically. The cloud record contains course progress, saved course IDs, the account ID, and an update timestamp; course content remains on official university websites.

## Checks

```bash
npm test
npm run lint
npm run build
npm run check:links
```
