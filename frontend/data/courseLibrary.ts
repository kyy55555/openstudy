export type CourseProgress = "not-started" | "in-progress" | "completed";

export const courseLibraryStorageKey = "openstudy-course-library-v1";

export type CourseLibraryState = {
  progress: Record<string, CourseProgress>;
  favorites: string[];
  completedResources: string[];
  studyPlans: Record<string, { days: number; completedTaskIds: string[] }>;
};

export const emptyCourseLibrary: CourseLibraryState = { progress: {}, favorites: [], completedResources: [], studyPlans: {} };

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
