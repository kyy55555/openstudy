"use client";

import { useEffect, useState } from "react";
import { courseLibraryStorageKey, emptyCourseLibrary, parseCourseLibrary } from "../data/courseLibrary";
import type { CourseLibraryState, CourseProgress } from "../data/courseLibrary";

export function useCourseLibrary() {
  const [library, setLibrary] = useState<CourseLibraryState>(emptyCourseLibrary);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLibrary(parseCourseLibrary(window.localStorage.getItem(courseLibraryStorageKey)));
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function update(next: CourseLibraryState) {
    setLibrary(next);
    window.localStorage.setItem(courseLibraryStorageKey, JSON.stringify(next));
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
