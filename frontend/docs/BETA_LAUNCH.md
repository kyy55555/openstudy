# OpenStudy public Beta launch guide

This guide is the go/no-go checklist for a small public Beta. Course and curriculum updates use atomic deployments, so the site does not need to be paused while new verified material is added.

## Go/no-go gates

Launch only when all items below are true:

- `npm run check:beta` passes. Automated university-site blocks may remain warnings, but confirmed failures must be fixed.
- `npm run check:smoke` passes against the production deployment.
- `npm run check:launch-env` passes with the production environment variables.
- Supabase Row Level Security is enabled for `course_libraries` and `feedback`.
- A fresh account can confirm its email, sign in, reset its password, and sign out in both English and Chinese.
- Progress created while signed in appears on a second browser after sign-in.
- When two signed-in browsers edit after one becomes stale, the older browser shows a conflict instead of silently overwriting the newer cloud record; verify both resolution choices using disposable test progress.
- Guest progress remains separate before and after account sign-in.
- One feedback submission appears in Supabase and the test row is then removed.
- The privacy notice matches the services actually enabled in production.

## Manual learner journey

Test this journey on a phone and a desktop:

1. Open the Chinese home page and search for “网站”, “网络安全”, and a course code such as “CS50P”.
2. Open a course by clicking anywhere on its card.
3. Open an official resource, return to OpenStudy, and confirm that “continue where you left off” points to it.
4. Create a 30-day plan and confirm every planned day contains real work rather than an empty rest day.
5. Complete one task, reload, and confirm progress is retained.
6. Pause the plan and confirm it disappears from today's suggestion; resume it and confirm the target is extended by the paused calendar days.
7. Open a curriculum reference and confirm home-university courses and external substitutes are clearly labeled.
8. Submit a feedback item without entering sensitive information.
9. In two browsers signed into the same test account, change progress in browser A, then make a stale change in browser B. Confirm B pauses sync and asks whether to keep its local copy or use the cloud copy.

## First tester cohort

Start with 10–20 people who are not involved in building OpenStudy. Give them the public URL without a product walkthrough. Ask each tester to complete the learner journey above, then answer:

- What did you expect to happen but could not find?
- Which course or official link looked wrong?
- Was the daily task small enough to finish?
- Did any external-course substitute look like an official university requirement?
- Would you return next week? Why or why not?

Record problems by severity:

- **P0:** data loss, account exposure, broken sign-in for everyone, or unsafe content. Stop inviting testers and roll back.
- **P1:** core search, course opening, progress, or feedback is unusable. Fix before expanding the cohort.
- **P2:** confusing copy, missing course, isolated broken link, or layout issue. Keep testing and schedule the fix.

In the Supabase feedback table, triage every `new` row within 48 hours: change it to `reviewing` when accepted, then `resolved` after the fix is deployed or `closed` when no action is needed. Filter by `issue_type`, `viewport`, and `app_version` to identify repeated failures without collecting browsing histories. Never change or delete the original message while resolving an item.

## Privacy-preserving Beta signals

Do not add behavior tracking merely to measure growth. For the first cohort, use only aggregate operational counts already available from the services and voluntary feedback:

- number of confirmed accounts in Supabase Auth;
- number and category of submitted feedback items;
- confirmed link failures from the link audit;
- tester-reported completion of the manual journey;
- voluntary answer to “Would you return next week?”

Never export passwords, access tokens, learning-record contents, or individual browsing histories. If analytics is added later, update the privacy notice before collection begins and collect the minimum necessary data.

## Deployment and rollback

1. Push the reviewed local commits only after explicit approval.
2. Wait for Vercel's deployment and GitHub quality checks.
3. Run `OPENSTUDY_SMOKE_URL=https://openstudy-sigma.vercel.app npm run check:smoke`.
4. Complete one real account sync and one feedback test.
5. If a P0 regression appears, use Vercel to promote the previous known-good deployment, then preserve the failing commit for diagnosis rather than rewriting history.

## Known Beta limitations

- OpenStudy links to official university content and does not control external availability.
- Some official sites block automated link checks; warnings require periodic manual review.
- Several curriculum references still use clearly labeled external self-study substitutes where the home university does not publish usable open materials.
- There is no third-party product analytics service in the current Beta.
