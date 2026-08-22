export default function Loading() {
  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-4xl px-6 py-12" aria-busy="true" aria-live="polite">
      <p className="sr-only">Loading page · 正在加载页面</p>
      <div className="animate-pulse space-y-5" aria-hidden="true">
        <div className="h-5 w-32 rounded bg-gray-200" />
        <div className="h-10 w-3/5 rounded bg-gray-200" />
        <div className="h-5 w-full max-w-2xl rounded bg-gray-100" />
        <div className="mt-8 h-40 rounded-2xl border border-gray-200 bg-gray-50" />
        <div className="h-40 rounded-2xl border border-gray-200 bg-gray-50" />
      </div>
    </main>
  );
}
