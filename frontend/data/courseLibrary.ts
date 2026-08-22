export type CourseProgress = "not-started" | "in-progress" | "completed";

export const courseLibraryStorageKey = "openstudy-course-library-v1";

export type CourseStudyPlan = { days: number; completedTaskIds: string[]; createdOn?: string; lastDailyCompletionDate?: string; dailyCompletionDates?: string[]; paused?: boolean; pausedOn?: string };

export type CourseLibraryState = {
  updatedAt?: string;
  progress: Record<string, CourseProgress>;
  favorites: string[];
  completedResources: string[];
  studyPlans: Record<string, CourseStudyPlan>;
  lastOpenedResource: { courseId: string; url: string; title: string; titleZh: string; openedAt: string } | null;
};

export const emptyCourseLibrary: CourseLibraryState = { progress: {}, favorites: [], completedResources: [], studyPlans: {}, lastOpenedResource: null };

export type CourseLibraryBackup = {
  format: "openstudy-learning-record";
  version: 1;
  exportedAt: string;
  library: CourseLibraryState;
};

export function courseResourceKey(courseId: string, resourceUrl: string) {
  return `${courseId}::${resourceUrl}`;
}

function uniqueStrings(value: unknown) {
  return Array.isArray(value)
    ? [...new Set(value.filter((item): item is string => typeof item === "string" && item.length > 0))]
    : [];
}

export function normalizeStudyPlanDays(days: number) {
  if (!Number.isFinite(days)) return null;
  return Math.min(3650, Math.max(1, Math.ceil(days)));
}

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function completionStreak(dateKeys: string[], today = new Date()) {
  const dates = new Set(dateKeys.filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value)));
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!dates.has(localDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (dates.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function suggestedGentlePlanDays(
  currentDays: number,
  createdOn: string | undefined,
  completedTasks: number,
  totalTasks: number,
  today = new Date(),
) {
  if (!createdOn || totalTasks < 1 || completedTasks >= totalTasks) return null;
  const created = new Date(`${createdOn}T00:00:00`);
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (Number.isNaN(created.getTime())) return null;
  const elapsedDays = Math.max(1, Math.floor((current.getTime() - created.getTime()) / 86_400_000) + 1);
  const expectedCompleted = Math.floor(totalTasks * Math.min(elapsedDays / currentDays, 1));
  if (elapsedDays <= currentDays && completedTasks >= expectedCompleted) return null;
  const completionRate = completedTasks / totalTasks;
  const paceBasedDays = completionRate > 0 ? Math.ceil(elapsedDays / completionRate) : elapsedDays + currentDays;
  return Math.min(3650, Math.max(currentDays + 7, Math.ceil(paceBasedDays * 1.15)));
}

export function recordStudyTaskCompletion(plan: CourseStudyPlan, taskId: string, dateKey: string): CourseStudyPlan {
  if (plan.completedTaskIds.includes(taskId)) return plan;
  return {
    ...plan,
    completedTaskIds: [...plan.completedTaskIds, taskId],
    lastDailyCompletionDate: dateKey,
    dailyCompletionDates: [...new Set([...(plan.dailyCompletionDates ?? []), dateKey])],
  };
}

export function toggleStudyPlanPause(plan: CourseStudyPlan, today = new Date()): CourseStudyPlan {
  const todayKey = localDateKey(today);
  if (!plan.paused) return { ...plan, paused: true, pausedOn: todayKey };
  const paused = plan.pausedOn ? new Date(`${plan.pausedOn}T00:00:00`) : today;
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const pausedDays = Number.isNaN(paused.getTime()) ? 0 : Math.max(0, Math.floor((current.getTime() - paused.getTime()) / 86_400_000));
  const resumed = { ...plan };
  delete resumed.paused;
  delete resumed.pausedOn;
  return { ...resumed, days: Math.min(3650, plan.days + pausedDays) };
}

export function selectNewestAccountLibrary(
  cached: CourseLibraryState,
  cloud: CourseLibraryState | null,
  cloudUpdatedAt?: string | null,
) {
  if (!cloud) return { library: cached, source: "cache" as const };
  const cachedTime = cached.updatedAt ? Date.parse(cached.updatedAt) : Number.NEGATIVE_INFINITY;
  const cloudTimestamp = cloud.updatedAt ?? cloudUpdatedAt;
  const cloudTime = cloudTimestamp ? Date.parse(cloudTimestamp) : Number.NEGATIVE_INFINITY;
  if (Number.isFinite(cachedTime) && cachedTime > cloudTime) return { library: cached, source: "cache" as const };
  return { library: cloud, source: "cloud" as const };
}

export function studyPlanProgress(totalTaskIds: string[], completedTaskIds: string[]) {
  const tasks = [...new Set(totalTaskIds)];
  const completedSet = new Set(completedTaskIds);
  const completed = tasks.filter((id) => completedSet.has(id)).length;
  return { completed, total: tasks.length, percent: tasks.length ? Math.round(completed / tasks.length * 100) : 0 };
}

export function parseCourseLibrary(value: string | null): CourseLibraryState {
  if (!value) return emptyCourseLibrary;
  try {
    const parsed = JSON.parse(value) as Partial<CourseLibraryState>;
    const updatedAt = typeof parsed.updatedAt === "string" && !Number.isNaN(Date.parse(parsed.updatedAt)) ? parsed.updatedAt : undefined;
    const progress = parsed.progress && typeof parsed.progress === "object"
      ? Object.fromEntries(Object.entries(parsed.progress).filter((entry): entry is [string, CourseProgress] => typeof entry[0] === "string" && ["not-started", "in-progress", "completed"].includes(entry[1] as string)))
      : {};
    const studyPlans = parsed.studyPlans && typeof parsed.studyPlans === "object"
      ? Object.fromEntries(Object.entries(parsed.studyPlans).flatMap(([courseId, plan]) => {
        if (!plan || typeof plan !== "object") return [];
        const candidate = plan as { days?: unknown; completedTaskIds?: unknown; createdOn?: unknown; lastDailyCompletionDate?: unknown; dailyCompletionDates?: unknown; paused?: unknown; pausedOn?: unknown };
        if (!Number.isInteger(candidate.days) || (candidate.days as number) < 1 || (candidate.days as number) > 3650 || !Array.isArray(candidate.completedTaskIds)) return [];
        const normalized = { days: candidate.days as number, completedTaskIds: uniqueStrings(candidate.completedTaskIds) } as CourseLibraryState["studyPlans"][string];
        if (typeof candidate.createdOn === "string" && /^\d{4}-\d{2}-\d{2}$/.test(candidate.createdOn)) normalized.createdOn = candidate.createdOn;
        if (typeof candidate.lastDailyCompletionDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(candidate.lastDailyCompletionDate)) {
          normalized.lastDailyCompletionDate = candidate.lastDailyCompletionDate;
        }
        const dailyCompletionDates = uniqueStrings(candidate.dailyCompletionDates).filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value));
        if (dailyCompletionDates.length > 0) normalized.dailyCompletionDates = dailyCompletionDates;
        if (candidate.paused === true) {
          normalized.paused = true;
          if (typeof candidate.pausedOn === "string" && /^\d{4}-\d{2}-\d{2}$/.test(candidate.pausedOn)) normalized.pausedOn = candidate.pausedOn;
        }
        return [[courseId, normalized]];
      }))
      : {};
    const recent = parsed.lastOpenedResource;
    const lastOpenedResource = recent && typeof recent === "object" && [recent.courseId, recent.url, recent.title, recent.titleZh, recent.openedAt].every((item) => typeof item === "string")
      ? recent
      : null;
    return {
      ...(updatedAt ? { updatedAt } : {}),
      progress,
      favorites: uniqueStrings(parsed.favorites),
      completedResources: uniqueStrings(parsed.completedResources),
      studyPlans,
      lastOpenedResource,
    };
  } catch {
    return emptyCourseLibrary;
  }
}

export function createCourseLibraryBackup(library: CourseLibraryState, exportedAt = new Date().toISOString()) {
  return JSON.stringify({ format: "openstudy-learning-record", version: 1, exportedAt, library } satisfies CourseLibraryBackup, null, 2);
}

export function parseCourseLibraryBackup(value: string): CourseLibraryBackup | null {
  try {
    const parsed = JSON.parse(value) as Partial<CourseLibraryBackup>;
    if (parsed.format !== "openstudy-learning-record" || parsed.version !== 1 || typeof parsed.exportedAt !== "string" || Number.isNaN(Date.parse(parsed.exportedAt)) || !parsed.library || typeof parsed.library !== "object") return null;
    return { format: parsed.format, version: parsed.version, exportedAt: parsed.exportedAt, library: parseCourseLibrary(JSON.stringify(parsed.library)) };
  } catch {
    return null;
  }
}

export function selectSessionLibrary(userId: string | null, guest: CourseLibraryState, account: CourseLibraryState | null) {
  return userId ? (account ?? emptyCourseLibrary) : guest;
}

export function pathCompletion(courseIds: string[], progress: Record<string, CourseProgress>) {
  const uniqueIds = [...new Set(courseIds)];
  const completed = uniqueIds.filter((id) => progress[id] === "completed").length;
  return { completed, total: uniqueIds.length, percent: uniqueIds.length ? Math.round(completed / uniqueIds.length * 100) : 0 };
}

type CoveragePhase = {
  courseIds: string[];
  chooseCount: number | null;
  choiceGroups: { courseIds: string[]; chooseCount: number }[];
};

export function phaseCoverage(phase: CoveragePhase, progress: Record<string, CourseProgress>) {
  const mainRequired = phase.chooseCount ?? phase.courseIds.length;
  const mainCompleted = Math.min(mainRequired, phase.courseIds.filter((id) => progress[id] === "completed").length);
  const groupResults = phase.choiceGroups.map((group) => ({
    required: group.chooseCount,
    completed: Math.min(group.chooseCount, group.courseIds.filter((id) => progress[id] === "completed").length),
  }));
  const required = mainRequired + groupResults.reduce((sum, group) => sum + group.required, 0);
  const completed = mainCompleted + groupResults.reduce((sum, group) => sum + group.completed, 0);
  const allIds = [...phase.courseIds, ...phase.choiceGroups.flatMap((group) => group.courseIds)];
  const started = allIds.some((id) => progress[id] === "in-progress" || progress[id] === "completed");
  const status = required > 0 && completed >= required ? "completed" : started ? "partial" : "not-started";
  return { required, completed, status } as const;
}

export function learningPathCoverage(phases: CoveragePhase[], progress: Record<string, CourseProgress>) {
  const results = phases.map((phase) => phaseCoverage(phase, progress));
  const completed = results.reduce((sum, phase) => sum + phase.completed, 0);
  const total = results.reduce((sum, phase) => sum + phase.required, 0);
  return { completed, total, percent: total ? Math.round(completed / total * 100) : 0 };
}
