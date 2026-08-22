"use client";

import { useEffect, useRef, useState } from "react";
import { cloudSyncRetryDelay, courseLibraryStorageKey, emptyCourseLibrary, localDateKey, normalizeStudyPlanDays, parseCourseLibrary, recordStudyTaskCompletion, selectNewestAccountLibrary, selectSessionLibrary, toggleStudyPlanPause } from "../data/courseLibrary";
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
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const userId = useRef<string | null>(null);
  const libraryRef = useRef<CourseLibraryState>(emptyCourseLibrary);
  const activeStorageKey = useRef(courseLibraryStorageKey);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const retryTimer = useRef<number | null>(null);
  const retryAttempt = useRef(0);
  const syncAccount = useRef<((nextUserId: string | null) => Promise<void>) | null>(null);
  const saveCloudRef = useRef<((nextUserId: string, next: CourseLibraryState) => Promise<void>) | null>(null);

  function clearCloudRetry() {
    if (retryTimer.current !== null) window.clearTimeout(retryTimer.current);
    retryTimer.current = null;
  }

  function scheduleCloudRetry(nextUserId: string) {
    if (retryTimer.current !== null || userId.current !== nextUserId) return;
    const delay = cloudSyncRetryDelay(retryAttempt.current);
    if (delay === null) return;
    retryAttempt.current += 1;
    retryTimer.current = window.setTimeout(() => {
      retryTimer.current = null;
      if (userId.current === nextUserId) void syncAccount.current?.(nextUserId);
    }, delay);
  }

  function saveCloud(nextUserId: string, next: CourseLibraryState) {
    const client = getSupabaseBrowserClient();
    if (!client) return Promise.resolve();
    saveQueue.current = saveQueue.current.then(async () => {
      if (userId.current !== nextUserId) return;
      const { error } = await client.from("course_libraries").upsert({ user_id: nextUserId, library: next, updated_at: new Date().toISOString() });
      if (userId.current !== nextUserId) return;
      setSyncIssue(Boolean(error));
      if (error) scheduleCloudRetry(nextUserId);
      else {
        clearCloudRetry();
        retryAttempt.current = 0;
        setLastSyncedAt(new Date().toISOString());
      }
    }).catch(() => {
      if (userId.current === nextUserId) {
        setSyncIssue(true);
        scheduleCloudRetry(nextUserId);
      }
    });
    return saveQueue.current;
  }
  useEffect(() => {
    saveCloudRef.current = saveCloud;
  });

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
    function retryWhenOnline() {
      if (!userId.current) return;
      clearCloudRetry();
      retryAttempt.current = 0;
      void syncAccount.current?.(userId.current);
    }
    window.addEventListener("online", retryWhenOnline);
    return () => window.removeEventListener("online", retryWhenOnline);
  }, []);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const supabase = client;
    async function sync(nextUserId: string | null) {
      userId.current = nextUserId;
      if (!nextUserId) {
        clearCloudRetry();
        retryAttempt.current = 0;
        activeStorageKey.current = courseLibraryStorageKey;
        const guest = parseCourseLibrary(window.localStorage.getItem(courseLibraryStorageKey));
        libraryRef.current = guest;
        setLibrary(guest);
        setLoaded(true);
        setSyncIssue(false);
        setLastSyncedAt(null);
        return;
      }
      activeStorageKey.current = accountLibraryStorageKey(nextUserId);
      const cached = parseCourseLibrary(window.localStorage.getItem(activeStorageKey.current));
      const { data, error } = await supabase.from("course_libraries").select("library, updated_at").eq("user_id", nextUserId).maybeSingle();
      if (error) {
        libraryRef.current = cached;
        setLibrary(cached);
        setLoaded(true);
        setSyncIssue(true);
        setLastSyncedAt(null);
        scheduleCloudRetry(nextUserId);
        return;
      }
      const account = data?.library ? parseCourseLibrary(JSON.stringify(data.library)) : null;
      const selected = selectNewestAccountLibrary(cached, account, data?.updated_at);
      const next = selectSessionLibrary(nextUserId, emptyCourseLibrary, selected.library);
      libraryRef.current = next;
      setLibrary(next);
      setLoaded(true);
      window.localStorage.setItem(activeStorageKey.current, JSON.stringify(next));
      setSyncIssue(false);
      setLastSyncedAt(data?.updated_at ?? null);
      clearCloudRetry();
      retryAttempt.current = 0;
      if (!data || selected.source === "cache") {
        await saveCloudRef.current?.(nextUserId, next);
      }
    }
    syncAccount.current = sync;
    void client.auth.getUser().then(({ data }) => sync(data.user?.id ?? null));
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      clearCloudRetry();
      retryAttempt.current = 0;
      void sync(session?.user.id ?? null);
    });
    return () => {
      data.subscription.unsubscribe();
      clearCloudRetry();
      syncAccount.current = null;
    };
  }, []);

  function update(next: CourseLibraryState) {
    const stamped = { ...next, updatedAt: new Date().toISOString() };
    libraryRef.current = stamped;
    setLibrary(stamped);
    window.localStorage.setItem(activeStorageKey.current, JSON.stringify(stamped));
    if (userId.current) {
      clearCloudRetry();
      retryAttempt.current = 0;
      void saveCloud(userId.current, stamped);
    }
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

  function togglePlanPaused(courseId: string) {
    const current = libraryRef.current;
    const plan = current.studyPlans[courseId];
    if (!plan) return;
    update({ ...current, studyPlans: { ...current.studyPlans, [courseId]: toggleStudyPlanPause(plan) } });
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

  function retryCloudSync() {
    if (!userId.current) return;
    clearCloudRetry();
    retryAttempt.current = 0;
    void syncAccount.current?.(userId.current);
  }

  return { library, loaded, syncIssue, lastSyncedAt, retryCloudSync, setProgress, toggleFavorite, toggleResource, createStudyPlan, updateStudyPlanDays, togglePlanPaused, toggleStudyTask, completeDailyTask, removeStudyPlan, recordResourceOpen, clearLastOpenedResource, replaceLibrary };
}
