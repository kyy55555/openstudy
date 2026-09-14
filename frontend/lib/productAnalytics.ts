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

export async function trackProductEvent(input: ProductEventInput, options?: { oncePerSession?: string }) {
  if (typeof window === "undefined" || navigator.doNotTrack === "1") return;
  const client = getSupabaseBrowserClient();
  if (!client) return;
  let dedupeKey: string | null = null;
  if (options?.oncePerSession) {
    try {
      dedupeKey = `${dedupePrefix}${options.oncePerSession}`;
      if (window.sessionStorage.getItem(dedupeKey)) return;
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
  try {
    const { error } = await client.from("product_events").insert(row);
    if (error) return;
    if (dedupeKey) window.sessionStorage.setItem(dedupeKey, "1");
  } catch {
    // Product analytics is best-effort and must not surface errors to learners.
  }
}
