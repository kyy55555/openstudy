"use client";

import { useEffect, useState } from "react";

import { getSupabaseBrowserClient } from "../lib/supabase/client";

type FavoriteCountRow = { course_id: string; favorite_count: number | string };

export function useCourseFavoriteCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    let active = true;

    void client.rpc("get_course_favorite_counts").then((countResult) => {
      if (!active) return;
      if (countResult.error || !Array.isArray(countResult.data)) return;
      setCounts(Object.fromEntries((countResult.data as FavoriteCountRow[]).map((row) => [row.course_id, Number(row.favorite_count) || 0])));
      setAvailable(true);
    });
    return () => {
      active = false;
    };
  }, []);

  function adjust(courseId: string, delta: number) {
    setCounts((current) => ({ ...current, [courseId]: Math.max(0, (current[courseId] ?? 0) + delta) }));
  }

  return { counts, available, adjust };
}
