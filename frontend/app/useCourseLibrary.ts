"use client";

import { useEffect, useRef, useState } from "react";
import { courseLibraryStorageKey, emptyCourseLibrary, parseCourseLibrary } from "../data/courseLibrary";
import type { CourseLibraryState, CourseProgress } from "../data/courseLibrary";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

const syncedUserStorageKey = "openstudy-synced-user-v1";

function mergeLibraries(remote: CourseLibraryState, local: CourseLibraryState): CourseLibraryState {
  return { progress: { ...remote.progress, ...local.progress }, favorites: [...new Set([...remote.favorites, ...local.favorites])] };
}

export function useCourseLibrary() {
  const [library, setLibrary] = useState<CourseLibraryState>(emptyCourseLibrary);
  const [loaded, setLoaded] = useState(false);
  const userId = useRef<string | null>(null);
  const libraryRef = useRef<CourseLibraryState>(emptyCourseLibrary);

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
      if (!nextUserId) return;
      const { data } = await supabase.from("course_libraries").select("library").eq("user_id", nextUserId).maybeSingle();
      const remote = parseCourseLibrary(data?.library ? JSON.stringify(data.library) : null);
      const hasSyncedBefore = window.localStorage.getItem(syncedUserStorageKey) === nextUserId;
      const next = data && hasSyncedBefore ? remote : mergeLibraries(remote, libraryRef.current);
      libraryRef.current = next;
      setLibrary(next);
      setLoaded(true);
      window.localStorage.setItem(courseLibraryStorageKey, JSON.stringify(next));
      window.localStorage.setItem(syncedUserStorageKey, nextUserId);
      await supabase.from("course_libraries").upsert({ user_id: nextUserId, library: next, updated_at: new Date().toISOString() });
    }
    void client.auth.getUser().then(({ data }) => sync(data.user?.id ?? null));
    const { data } = client.auth.onAuthStateChange((_event, session) => { void sync(session?.user.id ?? null); });
    return () => data.subscription.unsubscribe();
  }, []);

  function update(next: CourseLibraryState) {
    libraryRef.current = next;
    setLibrary(next);
    window.localStorage.setItem(courseLibraryStorageKey, JSON.stringify(next));
    const client = getSupabaseBrowserClient();
    if (client && userId.current) void client.from("course_libraries").upsert({ user_id: userId.current, library: next, updated_at: new Date().toISOString() });
  }

  function setProgress(id: string, progress: CourseProgress) {
    update({ ...library, progress: { ...library.progress, [id]: progress } });
  }

  function toggleFavorite(id: string) {
    const favorites = library.favorites.includes(id) ? library.favorites.filter((item) => item !== id) : [...library.favorites, id];
    update({ ...library, favorites });
  }

  return { library, loaded, setProgress, toggleFavorite };
}
