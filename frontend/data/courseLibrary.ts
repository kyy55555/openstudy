export type CourseProgress = "not-started" | "in-progress" | "completed";

export const courseLibraryStorageKey = "openstudy-course-library-v1";

export type CourseLibraryState = {
  progress: Record<string, CourseProgress>;
  favorites: string[];
  completedResources: string[];
  studyPlans: Record<string, { days: number; completedTaskIds: string[] }>;
  lastOpenedResource: { courseId: string; url: string; title: string; titleZh: string; openedAt: string } | null;
};

export const emptyCourseLibrary: CourseLibraryState = { progress: {}, favorites: [], completedResources: [], studyPlans: {}, lastOpenedResource: null };

export function courseResourceKey(courseId: string, resourceUrl: string) {
  return `${courseId}::${resourceUrl}`;
}

export function parseCourseLibrary(value: string | null): CourseLibraryState {
  if (!value) return emptyCourseLibrary;
  try {
    const parsed = JSON.parse(value) as Partial<CourseLibraryState>;
    return {
      progress: parsed.progress && typeof parsed.progress === "object" ? parsed.progress : {},
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites.filter((id): id is string => typeof id === "string") : [],
      completedResources: Array.isArray(parsed.completedResources) ? parsed.completedResources.filter((key): key is string => typeof key === "string") : [],
      studyPlans: parsed.studyPlans && typeof parsed.studyPlans === "object" ? parsed.studyPlans : {},
      lastOpenedResource: parsed.lastOpenedResource && typeof parsed.lastOpenedResource === "object" ? parsed.lastOpenedResource : null,
    };
  } catch {
    return emptyCourseLibrary;
  }
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
