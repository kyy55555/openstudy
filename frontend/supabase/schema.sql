create table if not exists public.course_libraries (
  user_id uuid primary key references auth.users(id) on delete cascade,
  library jsonb not null default '{"progress":{},"favorites":[],"completedResources":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.course_libraries enable row level security;

create policy "Users can read their own course library"
on public.course_libraries for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own course library"
on public.course_libraries for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own course library"
on public.course_libraries for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
