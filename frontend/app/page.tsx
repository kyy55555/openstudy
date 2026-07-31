"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { courses } from "../data/courses";
import type { Course } from "../data/courses";
import { filterCourses, uniqueCourseValues } from "../data/courseFilters";

/* -------------------- Title -------------------- */

type TitleProps = {
  text: string;
  subtitle: string;
};

function Title({ text, subtitle }: TitleProps) {
  return (
    <header>
      <h1 className="text-3xl font-bold">{text}</h1>

      <p className="mt-2 text-gray-600">{subtitle}</p>
    </header>
  );
}

/* -------------------- Search Box -------------------- */

type SearchBoxProps = {
  searchInput: string;
  setSearchInput: (value: string) => void;
  onSearch: () => void;
};

function SearchBox({
  searchInput,
  setSearchInput,
  onSearch,
}: SearchBoxProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
      <input
        type="text"
        placeholder="Search algorithms, machine learning, 算法..."
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-700"
      />

      <button
        type="submit"
        className="rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
      >
        Search
      </button>
    </form>
  );
}

/* -------------------- Filter Bar -------------------- */

type FilterBarProps = {
  universities: string[];
  subjects: string[];

  universityFilter: string;
  setUniversityFilter: (value: string) => void;

  subjectFilter: string;
  setSubjectFilter: (value: string) => void;

  onlyVideos: boolean;
  setOnlyVideos: (value: boolean) => void;

  onlyAssignments: boolean;
  setOnlyAssignments: (value: boolean) => void;

  onlySolutions: boolean;
  setOnlySolutions: (value: boolean) => void;

  onReset: () => void;
};

function FilterBar({
  universities,
  subjects,
  universityFilter,
  setUniversityFilter,
  subjectFilter,
  setSubjectFilter,
  onlyVideos,
  setOnlyVideos,
  onlyAssignments,
  setOnlyAssignments,
  onlySolutions,
  setOnlySolutions,
  onReset,
}: FilterBarProps) {
  return (
    <div className="mt-5 rounded-xl border border-gray-200 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <label className="flex items-center gap-2 text-sm">
          <span className="font-medium">University</span>

          <select
            value={universityFilter}
            onChange={(event) =>
              setUniversityFilter(event.target.value)
            }
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none"
          >
            <option value="All">All universities</option>

            {universities.map((university) => (
              <option key={university} value={university}>
                {university}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <span className="font-medium">Subject</span>

          <select
            value={subjectFilter}
            onChange={(event) => setSubjectFilter(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none"
          >
            <option value="All">All subjects</option>

            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyVideos}
            onChange={(event) =>
              setOnlyVideos(event.target.checked)
            }
          />

          Has videos
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyAssignments}
            onChange={(event) =>
              setOnlyAssignments(event.target.checked)
            }
          />

          Has assignments
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlySolutions}
            onChange={(event) =>
              setOnlySolutions(event.target.checked)
            }
          />

          Has solutions
        </label>

        <button
          type="button"
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-black hover:underline"
        >
          Reset filters
        </button>
      </div>
    </div>
  );
}

/* -------------------- Course Card -------------------- */

type CourseCardProps = {
  course: Course;
};

function CourseCard({ course }: CourseCardProps) {
  function materialStatus(value: Course["hasVideos"]) {
    if (value === null) return "? Not verified";
    return value ? "✓ Available" : "✗ Not available";
  }

  return (
    <article className="rounded-xl border border-gray-200 p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-gray-500">
          {course.university}
        </p>
      </div>

      <h2 className="mt-2 text-xl font-semibold">
        {course.title}
      </h2>

      {course.titleZh && (
        <p className="mt-1 text-sm text-gray-500">{course.titleZh}</p>
      )}

      <p className="mt-4 text-gray-700">
        {course.description}
      </p>

      <div className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
        <p>
          <span className="font-medium">Subject:</span>{" "}
          {course.subject}
        </p>

        <p>
          <span className="font-medium">Level:</span>{" "}
          {course.level ?? "Not verified"}
        </p>

        <p>
          <span className="font-medium">Language:</span>{" "}
          {course.language}
        </p>

        <p>
          <span className="font-medium">Course year:</span>{" "}
          {course.year === null ? "Not verified" : course.year}
        </p>

      </div>

      <div className="mt-5">
        <p className="font-medium">Prerequisites</p>

        {course.prerequisites === null ? (
          <p className="mt-2 text-sm text-gray-500">Not verified.</p>
        ) : course.prerequisites.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">
            No prerequisites listed.
          </p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {course.prerequisites.map((prerequisite) => (
              <li key={`${course.id}-${prerequisite}`}>
                ✓ {prerequisite}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5">
        <p className="font-medium">Course materials</p>

        <div className="mt-2 space-y-1 text-sm">
          <p>Videos: {materialStatus(course.hasVideos)}</p>
          <p>Assignments: {materialStatus(course.hasAssignments)}</p>
          <p>Solutions: {materialStatus(course.hasSolutions)}</p>
        </div>
      </div>

      <p className="mt-5 text-xs text-gray-500">
        Verified from{" "}
        <a
          href={course.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          {course.sourceName}
        </a>{" "}
        on {course.verifiedOn}.
      </p>

      <a
        href={course.courseUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-block font-medium text-blue-600 hover:underline"
      >
        View official course →
      </a>
    </article>
  );
}

/* -------------------- Home Page -------------------- */

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [universityFilter, setUniversityFilter] =
    useState("All");

  const [subjectFilter, setSubjectFilter] = useState("All");

  const [onlyVideos, setOnlyVideos] = useState(false);

  const [onlyAssignments, setOnlyAssignments] =
    useState(false);

  const [onlySolutions, setOnlySolutions] =
    useState(false);

  const universities = uniqueCourseValues(courses, "university");
  const subjects = uniqueCourseValues(courses, "subject");

  function handleSearch() {
    setSearchTerm(searchInput.trim());
  }

  function handleResetFilters() {
    setSearchInput("");
    setSearchTerm("");
    setUniversityFilter("All");
    setSubjectFilter("All");
    setOnlyVideos(false);
    setOnlyAssignments(false);
    setOnlySolutions(false);
  }

  const filteredCourses = filterCourses(courses, {
    searchTerm,
    university: universityFilter,
    subject: subjectFilter,
    onlyVideos,
    onlyAssignments,
    onlySolutions,
  });

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12">
      <Title
        text="OpenStudy"
        subtitle="Explore open courses from the world's leading universities."
      />

      <SearchBox
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={handleSearch}
      />

      <FilterBar
        universities={universities}
        subjects={subjects}
        universityFilter={universityFilter}
        setUniversityFilter={setUniversityFilter}
        subjectFilter={subjectFilter}
        setSubjectFilter={setSubjectFilter}
        onlyVideos={onlyVideos}
        setOnlyVideos={setOnlyVideos}
        onlyAssignments={onlyAssignments}
        setOnlyAssignments={setOnlyAssignments}
        onlySolutions={onlySolutions}
        setOnlySolutions={setOnlySolutions}
        onReset={handleResetFilters}
      />

      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold">
            Courses
          </h2>

          <p className="text-sm text-gray-500">
            Showing {filteredCourses.length} of {courses.length} verified courses
          </p>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="mt-6 rounded-xl border border-gray-200 p-8 text-center">
            <p className="font-medium">
              No courses found.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Try another subject or remove some filters.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
