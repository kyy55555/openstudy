import { getSupabaseBrowserClient } from "./supabase/client";
import { productAnalyticsUuidPattern, sanitizeProductEvent } from "../data/productAnalytics";
import type { ProductEventInput, ProductEventRow } from "../data/productAnalytics";

const visitorKey = "openstudy-product-visitor-v1";
const sessionKey = "openstudy-product-session-v1";
const dedupePrefix = "openstudy-product-event-v1:";
function storedUuid(storage: Storage, key: string) {
  try {
    const existing = storage.getItem(key);
    if (existing && productAnalyticsUuidPattern.test(existing)) return existing;
    const next = crypto.randomUUID();
    storage.setItem(key, next);
    return next;
  } catch {
    return crypto.randomUUID();
  }
}

function viewport(): ProductEventRow["viewport"] {
  if (window.innerWidth < 640) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
}

export function trackProductEvent(input: ProductEventInput, options?: { oncePerSession?: string }) {
  if (typeof window === "undefined" || navigator.doNotTrack === "1") return;
  const client = getSupabaseBrowserClient();
  if (!client) return;
  if (options?.oncePerSession) {
    try {
      const key = `${dedupePrefix}${options.oncePerSession}`;
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // Analytics must never interfere with learning when storage is unavailable.
    }
  }
  const row = sanitizeProductEvent(input, {
    anonymousId: storedUuid(window.localStorage, visitorKey),
    sessionId: storedUuid(window.sessionStorage, sessionKey),
    pagePath: window.location.pathname,
    viewport: viewport(),
  });
  if (!row) return;
  void (async () => {
    try {
      await client.from("product_events").insert(row);
    } catch {
      // Product analytics is best-effort and must not surface errors to learners.
    }
  })();
}
