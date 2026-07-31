"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { courses } from "../data/courses";
import type { Course } from "../data/courses";
import {
  filterCourses,
  sortCourses,
  uniqueCourseValues,
} from "../data/courseFilters";
import type { CourseSort } from "../data/courseFilters";

const coursesPerPage = 12;

type Language = "en" | "zh";

const translations = {
  en: {
    subtitle: "Explore open courses from the world's leading universities.",
    switchLanguage: "中文",
    searchPlaceholder: "Search algorithms, machine learning, 算法...",
    search: "Search",
    university: "University",
    allUniversities: "All universities",
    subject: "Subject",
    allSubjects: "All subjects",
    hasVideos: "Has videos",
    hasAssignments: "Has assignments",
    hasSolutions: "Has solutions",
    reset: "Reset filters",
    level: "Level",
    language: "Language",
    year: "Course year",
    notVerified: "Not verified",
    prerequisites: "Prerequisites",
    noPrerequisites: "No prerequisites listed.",
    materials: "Course materials",
    videos: "Videos",
    assignments: "Assignments",
    solutions: "Solutions",
    available: "✓ Available",
    unavailable: "✗ Not available",
    verifiedFrom: "Verified from",
    verifiedOn: "on",
    viewCourse: "View official course →",
    courses: "Courses",
    sort: "Sort",
    newest: "Newest first",
    title: "Course title",
    universitySort: "University",
    verifiedCourses: (filtered: number, total: number) =>
      `${filtered} of ${total} verified courses`,
    noCourses: "No courses found.",
    noCoursesHint: "Try another subject or remove some filters.",
    showMore: (remaining: number) => `Show more courses (${remaining} remaining)`,
  },
  zh: {
    subtitle: "探索世界一流大学公开的计算机科学课程。",
    switchLanguage: "English",
    searchPlaceholder: "搜索算法、机器学习、Python……",
    search: "搜索",
    university: "大学",
    allUniversities: "全部大学",
    subject: "学科",
    allSubjects: "全部学科",
    hasVideos: "有视频",
    hasAssignments: "有作业",
    hasSolutions: "有答案",
    reset: "重置筛选",
    level: "难度",
    language: "语言",
    year: "课程年份",
    notVerified: "尚未核实",
    prerequisites: "先修要求",
    noPrerequisites: "官方未列出先修要求。",
    materials: "课程资料",
    videos: "视频",
    assignments: "作业",
    solutions: "答案",
    available: "✓ 有",
    unavailable: "✗ 无",
    verifiedFrom: "核实来源：",
    verifiedOn: "核实日期：",
    viewCourse: "查看官方课程 →",
    courses: "课程",
    sort: "排序",
    newest: "最新优先",
    title: "课程名称",
    universitySort: "大学",
    verifiedCourses: (filtered: number, total: number) =>
      `${total} 门已核实课程，当前 ${filtered} 门`,
    noCourses: "没有找到课程。",
    noCoursesHint: "请尝试其他学科或减少筛选条件。",
    showMore: (remaining: number) => `显示更多课程（剩余 ${remaining} 门）`,
  },
} as const;

type Copy = (typeof translations)[Language];

/* -------------------- Title -------------------- */

type TitleProps = {
  text: string;
  subtitle: string;
  language: Language;
  onToggleLanguage: () => void;
  switchLanguageLabel: string;
};

function Title({
  text,
  subtitle,
  language,
  onToggleLanguage,
  switchLanguageLabel,
}: TitleProps) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">{text}</h1>

        <p className="mt-2 text-gray-600">{subtitle}</p>
      </div>

      <button
        type="button"
        onClick={onToggleLanguage}
        aria-label={language === "en" ? "切换到中文" : "Switch to English"}
        className="shrink-0 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
      >
        {switchLanguageLabel}
      </button>
    </header>
  );
}

/* -------------------- Search Box -------------------- */

type SearchBoxProps = {
  searchInput: string;
  setSearchInput: (value: string) => void;
  onSearch: () => void;
  copy: Copy;
};

function SearchBox({
  searchInput,
  setSearchInput,
  onSearch,
  copy,
}: SearchBoxProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
      <input
        type="text"
        placeholder={copy.searchPlaceholder}
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-700"
      />

      <button
        type="submit"
        className="rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
      >
        {copy.search}
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
  copy: Copy;
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
  copy,
}: FilterBarProps) {
  return (
    <div className="mt-5 rounded-xl border border-gray-200 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <label className="flex items-center gap-2 text-sm">
          <span className="font-medium">{copy.university}</span>

          <select
            value={universityFilter}
            onChange={(event) =>
              setUniversityFilter(event.target.value)
            }
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none"
          >
            <option value="All">{copy.allUniversities}</option>

            {universities.map((university) => (
              <option key={university} value={university}>
                {university}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <span className="font-medium">{copy.subject}</span>

          <select
            value={subjectFilter}
            onChange={(event) => setSubjectFilter(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none"
          >
            <option value="All">{copy.allSubjects}</option>

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

          {copy.hasVideos}
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyAssignments}
            onChange={(event) =>
              setOnlyAssignments(event.target.checked)
            }
          />

          {copy.hasAssignments}
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlySolutions}
            onChange={(event) =>
              setOnlySolutions(event.target.checked)
            }
          />

          {copy.hasSolutions}
        </label>

        <button
          type="button"
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-black hover:underline"
        >
          {copy.reset}
        </button>
      </div>
    </div>
  );
}

/* -------------------- Course Card -------------------- */

type CourseCardProps = {
  course: Course;
  language: Language;
  copy: Copy;
};

function CourseCard({ course, language, copy }: CourseCardProps) {
  function materialStatus(value: Course["hasVideos"]) {
    if (value === null) return `? ${copy.notVerified}`;
    return value ? copy.available : copy.unavailable;
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
          <span className="font-medium">{copy.subject}:</span>{" "}
          {language === "zh" ? course.subjectZh : course.subject}
        </p>

        <p>
          <span className="font-medium">{copy.level}:</span>{" "}
          {course.level ?? copy.notVerified}
        </p>

        <p>
          <span className="font-medium">{copy.language}:</span>{" "}
          {course.language}
        </p>

        <p>
          <span className="font-medium">{copy.year}:</span>{" "}
          {course.year === null ? copy.notVerified : course.year}
        </p>

      </div>

      <div className="mt-5">
        <p className="font-medium">{copy.prerequisites}</p>

        {course.prerequisites === null ? (
          <p className="mt-2 text-sm text-gray-500">{copy.notVerified}</p>
        ) : course.prerequisites.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">
            {copy.noPrerequisites}
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
        <p className="font-medium">{copy.materials}</p>

        <div className="mt-2 space-y-1 text-sm">
          <p>{copy.videos}: {materialStatus(course.hasVideos)}</p>
          <p>{copy.assignments}: {materialStatus(course.hasAssignments)}</p>
          <p>{copy.solutions}: {materialStatus(course.hasSolutions)}</p>
        </div>
      </div>

      <p className="mt-5 text-xs text-gray-500">
        {copy.verifiedFrom}{" "}
        <a
          href={course.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          {course.sourceName}
        </a>{" "}
        {copy.verifiedOn} {course.verifiedOn}.
      </p>

      <a
        href={course.courseUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-block font-medium text-blue-600 hover:underline"
      >
        {copy.viewCourse}
      </a>
    </article>
  );
}

/* -------------------- Home Page -------------------- */

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
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

  const [sort, setSort] = useState<CourseSort>("newest");
  const [visibleCount, setVisibleCount] = useState(coursesPerPage);
  const copy = translations[language];

  const universities = uniqueCourseValues(courses, "university");
  const subjects = uniqueCourseValues(courses, "subject");

  function handleSearch() {
    setSearchTerm(searchInput.trim());
    setVisibleCount(coursesPerPage);
  }

  function handleResetFilters() {
    setSearchInput("");
    setSearchTerm("");
    setUniversityFilter("All");
    setSubjectFilter("All");
    setOnlyVideos(false);
    setOnlyAssignments(false);
    setOnlySolutions(false);
    setSort("newest");
    setVisibleCount(coursesPerPage);
  }

  const filteredCourses = sortCourses(
    filterCourses(courses, {
      searchTerm,
      university: universityFilter,
      subject: subjectFilter,
      onlyVideos,
      onlyAssignments,
      onlySolutions,
    }),
    sort,
  );
  const visibleCourses = filteredCourses.slice(0, visibleCount);

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12">
      <Title
        text="OpenStudy"
        subtitle={copy.subtitle}
        language={language}
        onToggleLanguage={() =>
          setLanguage((current) => (current === "en" ? "zh" : "en"))
        }
        switchLanguageLabel={copy.switchLanguage}
      />

      <SearchBox
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={handleSearch}
        copy={copy}
      />

      <FilterBar
        universities={universities}
        subjects={subjects}
        universityFilter={universityFilter}
        setUniversityFilter={(value) => {
          setUniversityFilter(value);
          setVisibleCount(coursesPerPage);
        }}
        subjectFilter={subjectFilter}
        setSubjectFilter={(value) => {
          setSubjectFilter(value);
          setVisibleCount(coursesPerPage);
        }}
        onlyVideos={onlyVideos}
        setOnlyVideos={(value) => {
          setOnlyVideos(value);
          setVisibleCount(coursesPerPage);
        }}
        onlyAssignments={onlyAssignments}
        setOnlyAssignments={(value) => {
          setOnlyAssignments(value);
          setVisibleCount(coursesPerPage);
        }}
        onlySolutions={onlySolutions}
        setOnlySolutions={(value) => {
          setOnlySolutions(value);
          setVisibleCount(coursesPerPage);
        }}
        onReset={handleResetFilters}
        copy={copy}
      />

      <section className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-semibold">
            {copy.courses}
          </h2>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <span className="font-medium">{copy.sort}</span>
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value as CourseSort);
                  setVisibleCount(coursesPerPage);
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none"
              >
                <option value="newest">{copy.newest}</option>
                <option value="title">{copy.title}</option>
                <option value="university">{copy.universitySort}</option>
              </select>
            </label>

            <p className="text-sm text-gray-500">
              {copy.verifiedCourses(filteredCourses.length, courses.length)}
            </p>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="mt-6 rounded-xl border border-gray-200 p-8 text-center">
            <p className="font-medium">
              {copy.noCourses}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {copy.noCoursesHint}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {visibleCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                language={language}
                copy={copy}
              />
            ))}
          </div>
        )}

        {visibleCount < filteredCourses.length && (
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + coursesPerPage)}
            className="mt-6 w-full rounded-lg border border-gray-300 px-5 py-3 font-medium hover:bg-gray-50"
          >
            {copy.showMore(filteredCourses.length - visibleCount)}
          </button>
        )}
      </section>
    </main>
  );
}
