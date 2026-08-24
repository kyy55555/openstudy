"use client";

import { useEffect, useState } from "react";

import { getSupabaseBrowserClient } from "../lib/supabase/client";

type FavoriteCountRow = { course_id: string; favorite_count: number | string };

export function useCourseFavoriteCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [available, setAvailable] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    let active = true;

    void Promise.all([
      client.rpc("get_course_favorite_counts"),
      client.auth.getUser(),
    ]).then(([countResult, userResult]) => {
      if (!active) return;
      setAuthenticated(Boolean(userResult.data.user));
      if (countResult.error || !Array.isArray(countResult.data)) return;
      setCounts(Object.fromEntries((countResult.data as FavoriteCountRow[]).map((row) => [row.course_id, Number(row.favorite_count) || 0])));
      setAvailable(true);
    });

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      if (active) setAuthenticated(Boolean(session?.user));
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  function adjust(courseId: string, delta: number) {
    if (!authenticated) return;
    setCounts((current) => ({ ...current, [courseId]: Math.max(0, (current[courseId] ?? 0) + delta) }));
  }

  return { counts, available, authenticated, adjust };
}
