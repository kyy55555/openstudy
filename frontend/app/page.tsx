import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
          Verified university courses
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
          OpenStudy
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-gray-600">
          Search open computer science courses from leading universities.
        </p>

        <form action="/courses" method="get" className="mt-10 flex gap-2">
          <label htmlFor="course-search" className="sr-only">
            Search courses
          </label>
          <input
            id="course-search"
            name="q"
            type="search"
            placeholder="Algorithms, machine learning, Python, 算法..."
            autoFocus
            className="min-w-0 flex-1 rounded-xl border border-gray-300 px-5 py-4 text-base shadow-sm outline-none focus:border-gray-700"
          />

          <button
            type="submit"
            className="rounded-xl bg-black px-6 py-4 font-medium text-white hover:bg-gray-800"
          >
            Search
          </button>
        </form>

        <Link
          href="/courses"
          className="mt-5 inline-block text-sm text-gray-500 hover:text-black hover:underline"
        >
          Browse all 35 verified courses →
        </Link>
      </section>
    </main>
  );
}
