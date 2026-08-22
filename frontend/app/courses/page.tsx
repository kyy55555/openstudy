"use client";

import { Suspense, useState } from "react";
import type { FormEvent, KeyboardEvent, MouseEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { courseCode, courseEditionLabel, courseLanguageLabel, courses, suggestedStudyStage } from "../../data/courses";
import type { Course } from "../../data/courses";
import { courseDetailPath, prerequisiteCourseIds } from "../../data/courseNavigation";
import {
  filterCourses,
  courseSearchSuggestions,
  displayCourseSubjects,
  courseSubjectLabel,
  programmingLanguageSubjectPrefix,
  sortCourses,
  uniqueCourseValues,
  uniqueCourseSubjects,
  uniqueProgrammingLanguages,
} from "../../data/courseFilters";
import type { CourseSort } from "../../data/courseFilters";
import { useCourseLibrary } from "../useCourseLibrary";

const coursesPerPage = 12;

type Language = "en" | "zh";

const translations = {
  en: {
    subtitle: "Explore verified computer science courses and related mathematics and natural-science foundations. More fields are coming after Beta.",
    switchLanguage: "中文",
    searchPlaceholder: "Search algorithms, machine learning, 算法...",
    search: "Search",
    searching: "Searching...",
    university: "University",
    allUniversities: "All universities",
    subject: "Subject",
    allSubjects: "All subjects",
    subjectAreas: "Fields",
    programmingLanguages: "Programming languages",
    hasVideos: "Has videos",
    hasAssignments: "Has assignments",
    hasSolutions: "Has solutions",
    reset: "Reset filters",
    level: "Level",
    suggestedStage: "Suggested study stage",
    inferred: "estimate",
    language: "Language",
    year: "Public-material edition",
    notVerified: "Not verified",
    prerequisites: "Prerequisites",
    noPrerequisites: "No prerequisites.",
    materials: "Course materials",
    resourceLinks: "Official resource links",
    resourceTypes: {
      syllabus: "Syllabus",
      schedule: "Schedule",
      lectures: "Lectures",
      assignments: "Assignments",
      exams: "Exams",
      projects: "Projects",
      materials: "Materials",
      downloads: "Download all materials",
    },
    videos: "Videos",
    assignments: "Assignments",
    solutions: "Solutions",
    available: "✓ Available",
    unavailable: "✗ Not available",
    verifiedFrom: "Verified from",
    verifiedOn: "on",
    viewCourse: "Course details →",
    officialCourse: "Official course ↗",
    courses: "Courses",
    sort: "Sort",
    easiest: "Easiest to hardest",
    newest: "Newest first",
    verifiedCourses: (filtered: number, total: number) =>
      `${filtered} of ${total} verified courses`,
    noCourses: "No courses found.",
    noCoursesHint: "Try another subject or remove some filters.",
    relatedSearches: "Try a related search",
    filteredOut: (count: number) => `${count} matching courses are hidden by the current filters.`,
    clearFiltersKeepSearch: "Clear filters and keep this search",
    showMore: (remaining: number) => `Show more courses (${remaining} remaining)`,
  },
  zh: {
    subtitle: "探索已核实的计算机科学课程，以及相关数学与自然科学基础课程；Beta 后将持续扩展更多专业。",
    switchLanguage: "English",
    searchPlaceholder: "搜索算法、机器学习、Python……",
    search: "搜索",
    searching: "正在搜索……",
    university: "大学",
    allUniversities: "全部大学",
    subject: "学科",
    allSubjects: "全部学科",
    subjectAreas: "专业领域",
    programmingLanguages: "编程语言",
    hasVideos: "有视频",
    hasAssignments: "有作业",
    hasSolutions: "有答案",
    reset: "重置筛选",
    level: "难度",
    suggestedStage: "建议学习阶段",
    inferred: "推断",
    language: "语言",
    year: "公开资料版本",
    notVerified: "尚未核实",
    prerequisites: "先修要求",
    noPrerequisites: "无需先修课。",
    materials: "课程资料",
    resourceLinks: "官方资料链接",
    resourceTypes: {
      syllabus: "课程大纲",
      schedule: "课程安排与阅读",
      lectures: "讲义与视频",
      assignments: "作业",
      exams: "考试与测试题",
      projects: "课程项目",
      materials: "其他资料",
      downloads: "下载完整资料包",
    },
    videos: "视频",
    assignments: "作业",
    solutions: "答案",
    available: "✓ 有",
    unavailable: "✗ 无",
    verifiedFrom: "核实来源：",
    verifiedOn: "核实日期：",
    viewCourse: "查看课程详情 →",
    officialCourse: "官方课程网站 ↗",
    courses: "课程",
    sort: "排序",
    easiest: "由易到难",
    newest: "最新优先",
    verifiedCourses: (filtered: number, total: number) =>
      `${total} 门已核实课程，当前 ${filtered} 门`,
    noCourses: "没有找到课程。",
    noCoursesHint: "请尝试其他学科或减少筛选条件。",
    relatedSearches: "试试相关搜索",
    filteredOut: (count: number) => `有 ${count} 门匹配课程被当前筛选条件隐藏。`,
    clearFiltersKeepSearch: "清除筛选并保留搜索词",
    showMore: (remaining: number) => `显示更多课程（剩余 ${remaining} 门）`,
  },
} as const;

type Copy = (typeof translations)[Language];

function coursesPath(searchTerm: string, language: Language) {
  const params = new URLSearchParams();
  if (searchTerm) params.set("q", searchTerm);
  if (language === "zh") params.set("lang", "zh");
  const query = params.toString();
  return query ? `/courses?${query}` : "/courses";
}

const levelZh: Record<string, string> = {
  Introductory: "入门",
  Undergraduate: "本科",
  "Advanced Undergraduate": "本科高阶",
  Intermediate: "中级",
  Advanced: "高级",
  Graduate: "研究生",
};

const studyStageZh: Record<string, string> = {
  "Year 1": "本科一年级",
  "Year 2": "本科二年级",
  "Years 2–3": "本科二至三年级",
  "Years 3–4": "本科三至四年级",
  Graduate: "研究生",
};

const prerequisiteZh: Record<string, string> = {
  "Introductory Python programming": "Python 编程入门",
  "Introductory programming": "编程入门",
  "Programming Abstractions or equivalent": "编程抽象或同等课程",
  Programming: "编程基础",
  Probability: "概率论",
  "Linear algebra": "线性代数",
  "Convex Optimization I or equivalent": "凸优化 I 或同等课程",
  "CS50x or prior Python experience": "CS50x 或 Python 编程经验",
  "CS50x or prior programming experience": "CS50x 或编程经验",
  "COS 126 or equivalent": "COS 126 或同等课程",
  "COS 217": "COS 217",
  "COS 226": "COS 226",
  "CS 3410 or ECE 3140 equivalent": "CS 3410、ECE 3140 或同等课程",
  "Discrete mathematics": "离散数学",
  "Data structures": "数据结构",
  "Machine learning": "机器学习",
  "Computer architecture": "计算机体系结构",
  "CS 61A or CS 61B equivalent": "CS 61A、CS 61B 或同等课程",
  "CS 61A": "CS 61A",
  "CS 61B": "CS 61B",
  "CS 70": "CS 70",
  "Single Variable Calculus": "单变量微积分",
  "Multivariable Calculus": "多元微积分",
  "MIT 6.006": "MIT 6.006 算法导论",
  "Stanford CS 103": "Stanford CS 103 计算基础的数学原理",
  "Stanford CS 109": "Stanford CS 109 面向计算机科学家的概率论",
};

/* -------------------- Title -------------------- */

type TitleProps = {
  text: string;
  subtitle: string;
  language: Language;
  onToggleLanguage: () => void;
  switchLanguageLabel: string;
  savedCount: number;
};

function Title({
  text,
  subtitle,
  language,
  onToggleLanguage,
  switchLanguageLabel,
  savedCount,
}: TitleProps) {
  return (
    <header className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold">
          <Link href="/" className="hover:opacity-70">{text}</Link>
        </h1>

        <p className="mt-2 text-gray-600">{subtitle}</p>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:shrink-0 sm:flex-nowrap">
        <Link href={language === "zh" ? "/compare?lang=zh" : "/compare"} className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
          {language === "zh" ? `收藏比较${savedCount ? ` (${savedCount})` : ""}` : `Compare${savedCount ? ` (${savedCount})` : ""}`}
        </Link>
        <Link href={language === "zh" ? "/paths?lang=zh" : "/paths"} className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
          {language === "zh" ? "学习路线" : "Learning paths"}
        </Link>
        <button
          type="button"
          onClick={onToggleLanguage}
          aria-label={language === "en" ? "切换到中文" : "Switch to English"}
          className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          {switchLanguageLabel}
        </button>
      </div>
    </header>
  );
}

/* -------------------- Search Box -------------------- */

type SearchBoxProps = {
  searchInput: string;
  setSearchInput: (value: string) => void;
  onSearch: (value?: string) => void;
  isSearching: boolean;
  suggestions: string[];
  copy: Copy;
};

function SearchBox({
  searchInput,
  setSearchInput,
  onSearch,
  isSearching,
  suggestions,
  copy,
}: SearchBoxProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSearch();
  }

  return (
    <form onSubmit={handleSubmit} className="relative mt-6 flex gap-2">
      <div className="relative min-w-0 flex-1">
        <input
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={suggestions.length > 0}
          aria-controls="course-search-suggestions"
          placeholder={copy.searchPlaceholder}
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-700"
        />

        {suggestions.length > 0 && (
          <div
            id="course-search-suggestions"
            role="listbox"
            className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                role="option"
                aria-selected={false}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setSearchInput(suggestion);
                  onSearch(suggestion);
                }}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSearching}
        aria-busy={isSearching}
        className="min-w-24 rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800 disabled:cursor-wait disabled:bg-gray-600"
      >
        {isSearching ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            {copy.searching}
          </span>
        ) : copy.search}
      </button>
    </form>
  );
}

/* -------------------- Filter Bar -------------------- */

type FilterBarProps = {
  language: Language;
  universities: string[];
  subjects: string[];
  programmingLanguages: string[];

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
  language,
  universities,
  subjects,
  programmingLanguages,
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  return (
    <div className="mt-5 rounded-xl border border-gray-200 p-4">
      <button type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)} className="flex w-full items-center justify-between text-sm font-semibold sm:hidden">
        <span>{language === "zh" ? "筛选课程" : "Filter courses"}</span>
        <span aria-hidden="true">{filtersOpen ? "−" : "+"}</span>
      </button>
      <div className={`${filtersOpen ? "flex" : "hidden"} mt-4 flex-col gap-4 sm:mt-0 sm:flex sm:flex-row sm:flex-wrap sm:items-center`}>
        <label className="flex flex-col items-start gap-2 text-sm sm:flex-row sm:items-center">
          <span className="font-medium">{copy.university}</span>

          <select
            value={universityFilter}
            onChange={(event) =>
              setUniversityFilter(event.target.value)
            }
            className="w-full max-w-full rounded-lg border border-gray-300 px-3 py-2 outline-none sm:w-auto"
          >
            <option value="All">{copy.allUniversities}</option>

            {universities.map((university) => (
              <option key={university} value={university}>
                {university}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col items-start gap-2 text-sm sm:flex-row sm:items-center">
          <span className="font-medium">{copy.subject}</span>

          <select
            value={subjectFilter}
            onChange={(event) => setSubjectFilter(event.target.value)}
            className="w-full max-w-full rounded-lg border border-gray-300 px-3 py-2 outline-none sm:w-auto"
          >
            <option value="All">{copy.allSubjects}</option>

            <optgroup label={copy.subjectAreas}>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {courseSubjectLabel(courses, subject, language)}
                </option>
              ))}
            </optgroup>

            <optgroup label={copy.programmingLanguages}>
              {programmingLanguages.map((programmingLanguage) => (
                <option
                  key={programmingLanguage}
                  value={`${programmingLanguageSubjectPrefix}${programmingLanguage}`}
                >
                  {programmingLanguage}
                </option>
              ))}
            </optgroup>
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
  favorite: boolean;
  onToggleFavorite: () => void;
};

function CourseCard({ course, language, copy, favorite, onToggleFavorite }: CourseCardProps) {
  const router = useRouter();
  const studyStage = suggestedStudyStage(course);
  const displayedSubjects = displayCourseSubjects(course, language);
  const detailPath = courseDetailPath(course, language);

  function openCourse(event: MouseEvent<HTMLElement>) {
    const target = event.target;
    if (target instanceof Element && target.closest("a, button, input, select, textarea")) return;
    router.push(detailPath);
  }

  function openCourseWithKeyboard(event: KeyboardEvent<HTMLElement>) {
    if (event.target !== event.currentTarget || event.key !== "Enter") return;
    router.push(detailPath);
  }

  function prerequisiteLink(prerequisite: string) {
    const targetId = prerequisiteCourseIds[prerequisite];
    const target = courses.find(({ id }) => id === targetId);
    if (!target) return null;
    return courseDetailPath(target, language);
  }

  function materialStatus(value: Course["hasVideos"]) {
    if (value === null) return `? ${copy.notVerified}`;
    return value ? copy.available : copy.unavailable;
  }

  return (
    <article
      id={course.id}
      role="link"
      tabIndex={0}
      aria-label={`${courseCode(course)} · ${language === "zh" ? course.titleZh : course.title}`}
      onClick={openCourse}
      onKeyDown={openCourseWithKeyboard}
      className="scroll-mt-6 cursor-pointer rounded-xl border border-gray-200 p-6 shadow-sm transition hover:border-gray-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      <div>
        <div className="flex items-start justify-between gap-3"><p className="text-sm font-medium text-gray-500">{course.university}</p><button type="button" onClick={onToggleFavorite} aria-label={favorite ? "Remove favorite" : "Save favorite"} className="text-xl leading-none" title={favorite ? (language === "zh" ? "取消收藏" : "Remove favorite") : (language === "zh" ? "收藏" : "Save")}>{favorite ? "★" : "☆"}</button></div>
      </div>

      <h2 className="mt-2 text-xl font-semibold">
        <Link href={detailPath} className="hover:underline">
        <span className="mr-2 text-gray-500">{courseCode(course)}</span>
        {language === "zh" ? course.titleZh : course.title}
        </Link>
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        {language === "zh" ? course.title : course.titleZh}
      </p>

      <p className="mt-4 text-gray-700">
        {language === "zh" ? course.descriptionZh : course.description}
      </p>

      <div className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
        {displayedSubjects.length > 0 && <p>
          <span className="font-medium">{copy.subject}:</span>{" "}
          {displayedSubjects.join(" / ")}
        </p>}

        <p>
          <span className="font-medium">{copy.level}:</span>{" "}
          {course.level === null
            ? copy.notVerified
            : language === "zh"
              ? (levelZh[course.level] ?? course.level)
              : course.level}
        </p>

        <p>
          <span className="font-medium">{copy.suggestedStage}:</span>{" "}
          {studyStage === null
            ? copy.notVerified
            : language === "zh"
              ? studyStageZh[studyStage]
              : studyStage}{" "}
          {studyStage !== null && (
            <span className="text-gray-500">({copy.inferred})</span>
          )}
        </p>

        <p>
          <span className="font-medium">{copy.language}:</span>{" "}
          {courseLanguageLabel(course.language, language)}
        </p>

        <p>
          <span className="font-medium">{copy.year}:</span>{" "}
          {courseEditionLabel(course, language)}
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
                ✓ {prerequisiteLink(prerequisite) ? (
                  <Link
                    href={prerequisiteLink(prerequisite)!}
                    className="font-medium underline decoration-gray-300 underline-offset-4 hover:decoration-black"
                  >
                    {language === "zh"
                      ? (prerequisiteZh[prerequisite] ?? prerequisite)
                      : prerequisite} →
                  </Link>
                ) : (
                  language === "zh"
                    ? (prerequisiteZh[prerequisite] ?? prerequisite)
                    : prerequisite
                )}
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

      {course.resources.length > 0 && (
        <div className="mt-5">
          <p className="font-medium">{copy.resourceLinks}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {course.resources.map((resource) => (
              <a
                key={resource.url}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-gray-300 px-3 py-1.5 text-sm text-blue-700 hover:bg-gray-50 hover:underline"
              >
                {language === "zh"
                  ? copy.resourceTypes[resource.type]
                  : resource.title}
              </a>
            ))}
          </div>
        </div>
      )}

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

      <div className="mt-6 flex flex-wrap gap-4">
        <Link href={detailPath} className="font-medium text-blue-600 hover:underline">{copy.viewCourse}</Link>
        <a href={course.courseUrl} target="_blank" rel="noreferrer" className="font-medium text-gray-600 hover:underline">{copy.officialCourse}</a>
      </div>
    </article>
  );
}

/* -------------------- Home Page -------------------- */

function CourseExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("q")?.trim() ?? "";
  const initialLanguage: Language = searchParams.get("lang") === "zh" ? "zh" : "en";
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isSearching, setIsSearching] = useState(false);

  const [universityFilter, setUniversityFilter] =
    useState("All");

  const [subjectFilter, setSubjectFilter] = useState("All");

  const [onlyVideos, setOnlyVideos] = useState(false);

  const [onlyAssignments, setOnlyAssignments] =
    useState(false);

  const [onlySolutions, setOnlySolutions] =
    useState(false);

  const [sort, setSort] = useState<CourseSort>("easiest");
  const [visibleCount, setVisibleCount] = useState(coursesPerPage);
  const { library, toggleFavorite } = useCourseLibrary();
  const copy = translations[language];

  const universities = uniqueCourseValues(courses, "university");
  const subjects = uniqueCourseSubjects(courses);
  const programmingLanguages = uniqueProgrammingLanguages(courses);

  async function handleSearch(suggestedValue?: string) {
    const nextSearch = (suggestedValue ?? searchInput).trim();
    if (nextSearch === searchTerm) return;
    setIsSearching(true);
    // Keep the feedback visible long enough to be perceived without making
    // this local catalog search feel slow.
    await new Promise((resolve) => setTimeout(resolve, 250));
    setSearchTerm(nextSearch);
    router.replace(coursesPath(nextSearch, language));
    setVisibleCount(coursesPerPage);
    setIsSearching(false);
  }

  function handleResetFilters() {
    setSearchInput("");
    setSearchTerm("");
    setUniversityFilter("All");
    setSubjectFilter("All");
    setOnlyVideos(false);
    setOnlyAssignments(false);
    setOnlySolutions(false);
    setSort("easiest");
    setVisibleCount(coursesPerPage);
    router.replace(coursesPath("", language));
  }

  function clearFiltersKeepSearch() {
    setUniversityFilter("All");
    setSubjectFilter("All");
    setOnlyVideos(false);
    setOnlyAssignments(false);
    setOnlySolutions(false);
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
  const suggestions = searchInput.trim() === searchTerm
    ? []
    : courseSearchSuggestions(courses, searchInput);
  const relatedSearches = filteredCourses.length === 0 && searchTerm
    ? courseSearchSuggestions(courses, searchTerm).slice(0, 6)
    : [];
  const searchOnlyMatches = filteredCourses.length === 0 && searchTerm
    ? filterCourses(courses, { searchTerm, university: "All", subject: "All", onlyVideos: false, onlyAssignments: false, onlySolutions: false }).length
    : 0;

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12">
      <Title
        text="OpenStudy"
        subtitle={copy.subtitle}
        language={language}
        onToggleLanguage={() => {
          const nextLanguage = language === "en" ? "zh" : "en";
          setLanguage(nextLanguage);
          router.replace(coursesPath(searchTerm, nextLanguage));
        }}
        switchLanguageLabel={copy.switchLanguage}
        savedCount={library.favorites.length}
      />

      <SearchBox
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={handleSearch}
        isSearching={isSearching}
        suggestions={suggestions}
        copy={copy}
      />

      <FilterBar
        language={language}
        universities={universities}
        subjects={subjects}
        programmingLanguages={programmingLanguages}
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
                <option value="easiest">{copy.easiest}</option>
                <option value="newest">{copy.newest}</option>
              </select>
            </label>

            <p className="text-sm text-gray-500">
              {copy.verifiedCourses(filteredCourses.length, courses.length)}
            </p>
          </div>
        </div>

        {isSearching ? (
          <div className="mt-6 space-y-5" aria-live="polite" aria-label={copy.searching}>
            {[0, 1, 2].map((item) => (
              <div key={item} className="animate-pulse rounded-xl border border-gray-200 p-6">
                <div className="h-4 w-36 rounded bg-gray-200" />
                <div className="mt-4 h-7 w-3/5 rounded bg-gray-200" />
                <div className="mt-4 h-4 w-full rounded bg-gray-100" />
                <div className="mt-2 h-4 w-4/5 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="mt-6 rounded-xl border border-gray-200 p-8 text-center">
            <p className="font-medium">
              {copy.noCourses}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {copy.noCoursesHint}
            </p>
            {searchOnlyMatches > 0 && <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-900"><p>{copy.filteredOut(searchOnlyMatches)}</p><button type="button" onClick={clearFiltersKeepSearch} className="mt-2 rounded-lg border border-blue-300 bg-white px-3 py-2 font-semibold hover:bg-blue-100">{copy.clearFiltersKeepSearch}</button></div>}
            {relatedSearches.length > 0 && <div className="mt-4"><p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{copy.relatedSearches}</p><div className="mt-2 flex flex-wrap justify-center gap-2">{relatedSearches.map((suggestion) => <button key={suggestion} type="button" onClick={() => { setSearchInput(suggestion); handleSearch(suggestion); }} className="rounded-full border border-gray-300 px-3 py-1.5 text-sm hover:border-black">{suggestion}</button>)}</div></div>}
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              {copy.reset}
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {visibleCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                language={language}
                copy={copy}
                favorite={library.favorites.includes(course.id)}
                onToggleFavorite={() => toggleFavorite(course.id)}
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

export default function CoursesPage() {
  return (
    <Suspense fallback={<main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12" />}>
      <CourseExplorer />
    </Suspense>
  );
}
