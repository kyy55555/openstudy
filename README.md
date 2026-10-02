# OpenStudy

**Find verified university courses, open the real materials, and turn them into a practical self-study plan.**

[Open the public beta](https://openstudy-sigma.vercel.app) · [Report an issue or request a course](https://openstudy-sigma.vercel.app/feedback)

OpenStudy brings public university learning resources into one searchable place. Instead of stopping at a department page, it helps learners reach the useful parts of a course—lectures, assignments, projects, exams, and official downloads—and organize them into a manageable plan.

The catalog currently contains **160+ verified courses from 12 universities** across computer science, mathematics, natural sciences, economics, and product management. English and Chinese interfaces are available.

> OpenStudy links to official public resources. It does not claim university affiliation, grant credit, or copy restricted course content.

## Why OpenStudy?

Excellent university material is already online, but self-learners still have to answer difficult questions:

- Which course is current and publicly accessible?
- Where are the actual lectures, assignments, and exams?
- What should I learn first?
- How can I make steady progress without building an unrealistic schedule?

OpenStudy reduces that decision load while keeping the original university sources and provenance visible.

## What you can do

- **Search verified courses** by title, course code, university, subject, language, or related topic.
- **Open specific official materials** instead of hunting through a course homepage.
- **Explore learning goals** such as algorithms, machine learning, distributed systems, databases, and cybersecurity in prerequisite-aware order.
- **Reference real university curricula** without being forced to choose or follow a single school’s path.
- **Create a gentle study plan** from the course’s published material and a target number of days.
- **Resume where you stopped**, mark resources and daily tasks complete, and see progress across curriculum references.
- **Save and compare courses** using site-wide save counts.
- **Use the site as a guest** or create a free account for optional cross-device sync.
- **Switch between English and Chinese**, light and dark modes, and mobile or desktop layouts.

## Product principles

1. **Official sources first** — course facts and links should come from universities, official course teams, or official repositories.
2. **Unknown is better than invented** — missing dates, prerequisites, or capabilities stay unknown until verified.
3. **Direct paths to learning** — a learner should be able to reach the lecture, assignment, project, or exam they need with minimal searching.
4. **Plans should feel achievable** — planning adds conservative breathing room instead of compressing work into an unrealistically short schedule.
5. **Curricula are references, not rules** — learners keep control over what they study.
6. **Guest and account data stay separate** — signing in never automatically merges a guest record.

## Tech stack

- [Next.js](https://nextjs.org/) 16 and React 19
- TypeScript and Tailwind CSS
- [Supabase](https://supabase.com/) for optional authentication, cloud progress, feedback, and privacy-minimized product events
- [Vercel](https://vercel.com/) for deployment and anonymous traffic analytics
- Node.js 24 test runner and GitHub Actions

## Run locally

Requirements: Node.js 24 and npm.

```bash
git clone https://github.com/kyy55555/openstudy.git
cd openstudy/frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The core guest experience works without cloud configuration. Guest progress and saved courses remain in the browser.

### Optional Supabase setup

To enable accounts and cross-device sync:

1. Create a Supabase project.
2. Run [`frontend/supabase/schema.sql`](frontend/supabase/schema.sql) in the Supabase SQL editor.
3. Copy the example environment file:

   ```bash
   cd frontend
   cp .env.example .env.local
   ```

4. Add your public project values:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   NEXT_PUBLIC_SITE_URL=https://your-domain.example
   ```

Never place a Supabase service-role key in a `NEXT_PUBLIC_*` variable.

## Quality checks

Run the complete beta check from `frontend/`:

```bash
npm run check:beta
```

Or run checks separately:

```bash
npm test
npm run lint
npm run check:data
npm run build
npm run check:bundle
npm run check:links
npm run check:smoke
```

GitHub Actions runs tests, linting, data checks, the production build, and the client-bundle check on pull requests and pushes to `main`. External university links are audited separately because some official sites rate-limit automated traffic.

## Repository structure

```text
OpenStudy/
├── frontend/
│   ├── app/                 # Next.js pages and UI
│   ├── data/                # Courses, study plans, guidance, and tests
│   ├── docs/                # Beta launch and operations notes
│   ├── lib/                 # Product analytics and shared helpers
│   ├── scripts/             # Data, link, bundle, and smoke checks
│   └── supabase/schema.sql  # Optional cloud schema and RLS policies
└── .github/workflows/       # Continuous quality checks
```

## Contributing

Contributions are welcome, especially:

- broken or outdated official links;
- direct links to public lectures, assignments, projects, and exams;
- corrections backed by an official university source;
- accessibility, mobile, search, and dark-mode improvements;
- carefully verified courses in fields not yet well represented.

For course data, include the official source and avoid guessing. A smaller accurate catalog is more useful than a large unreliable one.

Before opening a pull request, run:

```bash
cd frontend
npm test
npm run lint
npm run check:data
npm run build
```

## Privacy and content

OpenStudy does not host university course videos or restricted materials. Links remain with their original publishers, and each institution retains ownership of its content and trademarks.

Product analytics use random first-party visitor and session identifiers and do not store passwords, full URLs, IP addresses, or device fingerprints. See the live [privacy page](https://openstudy-sigma.vercel.app/privacy) for the current policy.

## 中文简介

OpenStudy 是一个面向自学者的大学公开课导航与学习规划平台。它帮助用户搜索经过核实的课程，直接打开官方讲义、视频、作业、项目和考试，并根据真实课程内容制定相对宽松、可持续的每日计划。

课程资料仍由原大学或课程团队提供；OpenStudy 不代表任何大学，不授予学分，也不会把未知信息写成确定事实。

---

Built for people who want to learn seriously without spending hours deciding where to begin.
