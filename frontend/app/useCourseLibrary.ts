"use client";

import { useEffect, useRef, useState } from "react";
import { courseLibraryStorageKey, emptyCourseLibrary, parseCourseLibrary } from "../data/courseLibrary";
import type { CourseLibraryState, CourseProgress } from "../data/courseLibrary";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

function accountLibraryStorageKey(userId: string) {
  return `${courseLibraryStorageKey}-user-${userId}`;
}

export function useCourseLibrary() {
  const [library, setLibrary] = useState<CourseLibraryState>(emptyCourseLibrary);
  const [loaded, setLoaded] = useState(false);
  const userId = useRef<string | null>(null);
  const libraryRef = useRef<CourseLibraryState>(emptyCourseLibrary);
  const activeStorageKey = useRef(courseLibraryStorageKey);

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
        return;
      }
      activeStorageKey.current = accountLibraryStorageKey(nextUserId);
      const { data } = await supabase.from("course_libraries").select("library").eq("user_id", nextUserId).maybeSingle();
      const next = data?.library ? parseCourseLibrary(JSON.stringify(data.library)) : emptyCourseLibrary;
      libraryRef.current = next;
      setLibrary(next);
      setLoaded(true);
      window.localStorage.setItem(activeStorageKey.current, JSON.stringify(next));
      await supabase.from("course_libraries").upsert({ user_id: nextUserId, library: next, updated_at: new Date().toISOString() });
    }
    void client.auth.getUser().then(({ data }) => sync(data.user?.id ?? null));
    const { data } = client.auth.onAuthStateChange((_event, session) => { void sync(session?.user.id ?? null); });
    return () => data.subscription.unsubscribe();
  }, []);

  function update(next: CourseLibraryState) {
    libraryRef.current = next;
    setLibrary(next);
    window.localStorage.setItem(activeStorageKey.current, JSON.stringify(next));
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
