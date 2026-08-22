"use client";

import { useEffect, useRef, useState } from "react";
import { courseLibraryStorageKey, emptyCourseLibrary, localDateKey, normalizeStudyPlanDays, parseCourseLibrary, recordStudyTaskCompletion, selectSessionLibrary } from "../data/courseLibrary";
import type { CourseLibraryState, CourseProgress } from "../data/courseLibrary";
import { courseResourceKey } from "../data/courseLibrary";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

function accountLibraryStorageKey(userId: string) {
  return `${courseLibraryStorageKey}-user-${userId}`;
}

export function useCourseLibrary() {
  const [library, setLibrary] = useState<CourseLibraryState>(emptyCourseLibrary);
  const [loaded, setLoaded] = useState(false);
  const [syncIssue, setSyncIssue] = useState(false);
  const userId = useRef<string | null>(null);
  const libraryRef = useRef<CourseLibraryState>(emptyCourseLibrary);
  const activeStorageKey = useRef(courseLibraryStorageKey);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());

  function saveCloud(nextUserId: string, next: CourseLibraryState) {
    const client = getSupabaseBrowserClient();
    if (!client) return Promise.resolve();
    saveQueue.current = saveQueue.current.then(async () => {
      const { error } = await client.from("course_libraries").upsert({ user_id: nextUserId, library: next, updated_at: new Date().toISOString() });
      setSyncIssue(Boolean(error));
    }).catch(() => setSyncIssue(true));
    return saveQueue.current;
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const local = parseCourseLibrary(window.localStorage.getItem(courseLibraryStorageKey));
      libraryRef.current = local;
      setLibrary(local);
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const supabase = client;
    async function sync(nextUserId: string | null) {
      userId.current = nextUserId;
      if (!nextUserId) {
        activeStorageKey.current = courseLibraryStorageKey;
        const guest = parseCourseLibrary(window.localStorage.getItem(courseLibraryStorageKey));
        libraryRef.current = guest;
        setLibrary(guest);
        setLoaded(true);
        setSyncIssue(false);
        return;
      }
      activeStorageKey.current = accountLibraryStorageKey(nextUserId);
      const cached = parseCourseLibrary(window.localStorage.getItem(activeStorageKey.current));
      const { data, error } = await supabase.from("course_libraries").select("library").eq("user_id", nextUserId).maybeSingle();
      if (error) {
        libraryRef.current = cached;
        setLibrary(cached);
        setLoaded(true);
        setSyncIssue(true);
        return;
      }
      const account = data?.library ? parseCourseLibrary(JSON.stringify(data.library)) : null;
      const next = selectSessionLibrary(nextUserId, emptyCourseLibrary, account ?? cached);
      libraryRef.current = next;
      setLibrary(next);
      setLoaded(true);
      window.localStorage.setItem(activeStorageKey.current, JSON.stringify(next));
      setSyncIssue(false);
      if (!data) {
        await saveCloud(nextUserId, next);
      }
    }
    void client.auth.getUser().then(({ data }) => sync(data.user?.id ?? null));
    const { data } = client.auth.onAuthStateChange((_event, session) => { void sync(session?.user.id ?? null); });
    return () => data.subscription.unsubscribe();
  }, []);

  function update(next: CourseLibraryState) {
    libraryRef.current = next;
    setLibrary(next);
    window.localStorage.setItem(activeStorageKey.current, JSON.stringify(next));
    if (userId.current) void saveCloud(userId.current, next);
  }

  function setProgress(id: string, progress: CourseProgress) {
    const current = libraryRef.current;
    update({ ...current, progress: { ...current.progress, [id]: progress } });
  }

  function toggleFavorite(id: string) {
    const current = libraryRef.current;
    const favorites = current.favorites.includes(id) ? current.favorites.filter((item) => item !== id) : [...current.favorites, id];
    update({ ...current, favorites });
  }

  function toggleResource(courseId: string, resourceUrl: string) {
    const key = courseResourceKey(courseId, resourceUrl);
    const current = libraryRef.current;
    const completedResources = current.completedResources.includes(key)
      ? current.completedResources.filter((item) => item !== key)
      : [...current.completedResources, key];
    update({ ...current, completedResources });
  }

  function createStudyPlan(courseId: string, days: number) {
    const normalizedDays = normalizeStudyPlanDays(days);
    if (normalizedDays === null) return;
    const current = libraryRef.current;
    update({ ...current, studyPlans: { ...current.studyPlans, [courseId]: { days: normalizedDays, completedTaskIds: [], createdOn: localDateKey() } } });
  }

  function updateStudyPlanDays(courseId: string, days: number) {
    const normalizedDays = normalizeStudyPlanDays(days);
    const current = libraryRef.current;
    const plan = current.studyPlans[courseId];
    if (!plan || normalizedDays === null || normalizedDays < plan.days) return;
    update({ ...current, studyPlans: { ...current.studyPlans, [courseId]: { ...plan, days: normalizedDays } } });
  }

  function toggleStudyTask(courseId: string, taskId: string) {
    const current = libraryRef.current;
    const plan = current.studyPlans[courseId];
    if (!plan) return;
    const removing = plan.completedTaskIds.includes(taskId);
    const completedTaskIds = removing ? plan.completedTaskIds.filter((id) => id !== taskId) : [...plan.completedTaskIds, taskId];
    update({
      ...current,
      studyPlans: {
        ...current.studyPlans,
        [courseId]: removing ? { ...plan, completedTaskIds } : recordStudyTaskCompletion(plan, taskId, localDateKey()),
      },
    });
  }

  function completeDailyTask(courseId: string, taskId: string, dateKey: string) {
    const current = libraryRef.current;
    const plan = current.studyPlans[courseId];
    if (!plan || plan.completedTaskIds.includes(taskId)) return;
    update({ ...current, studyPlans: { ...current.studyPlans, [courseId]: recordStudyTaskCompletion(plan, taskId, dateKey) } });
  }

  function removeStudyPlan(courseId: string) {
    const current = libraryRef.current;
    const studyPlans = { ...current.studyPlans };
    delete studyPlans[courseId];
    update({ ...current, studyPlans });
  }

  function recordResourceOpen(courseId: string, url: string, title: string, titleZh: string) {
    const current = libraryRef.current;
    const progress = current.progress[courseId] === "completed" ? current.progress : { ...current.progress, [courseId]: "in-progress" as CourseProgress };
    update({ ...current, progress, lastOpenedResource: { courseId, url, title, titleZh, openedAt: new Date().toISOString() } });
  }

  function clearLastOpenedResource() {
    update({ ...libraryRef.current, lastOpenedResource: null });
  }

  function replaceLibrary(next: CourseLibraryState) {
    update(next);
  }

  return { library, loaded, syncIssue, setProgress, toggleFavorite, toggleResource, createStudyPlan, updateStudyPlanDays, toggleStudyTask, completeDailyTask, removeStudyPlan, recordResourceOpen, clearLastOpenedResource, replaceLibrary };
}
