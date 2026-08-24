"use client";

import { Suspense, useEffect, useState } from "react";
import type { FormEvent, KeyboardEvent, MouseEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { courseCode, courseEditionLabel, courses, suggestedStudyStage } from "../../data/courses";
import type { Course } from "../../data/courses";
import { courseDetailPath } from "../../data/courseNavigation";
import {
  filterCourses,
  courseSearchSuggestions,
  displayCourseSubjects,
  courseSubjectLabel,
  programmingLanguageSubjectPrefix,
  rankCoursesForSearch,
  sortCourses,
  uniqueCourseValues,
  uniqueCourseSubjects,
  uniqueProgrammingLanguages,
} from "../../data/courseFilters";
import type { CourseSort } from "../../data/courseFilters";
import { structuredCoursePlans } from "../../data/coursePlans";
import { useCourseLibrary } from "../useCourseLibrary";
import { useCourseFavoriteCounts } from "../useCourseFavoriteCounts";

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
    popular: "Most saved",
    savedBy: (count: number) => `${count} saved`,
    verifiedCourses: (filtered: number, total: number) =>
      `${filtered} of ${total} verified courses`,
    noCourses: "No courses found.",
    noCoursesHint: "Try another subject or remove some filters.",
    requestCourse: "Request a missing course",
    requestCourseHelp: "Tell us what you searched for. Real requests decide what OpenStudy verifies and adds next.",
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
    popular: "收藏最多",
    savedBy: (count: number) => `${count} 人收藏`,
    verifiedCourses: (filtered: number, total: number) =>
      `${total} 门已核实课程，当前 ${filtered} 门`,
    noCourses: "没有找到课程。",
    noCoursesHint: "请尝试其他学科或减少筛选条件。",
    requestCourse: "提交缺少的课程",
    requestCourseHelp: "告诉我们你想找什么；真实搜索需求将决定 OpenStudy 下一批核实和增加的课程。",
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
    <header className="flex flex-col items-start gap-5 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-violet-950 to-indigo-900 p-6 text-white shadow-xl sm:flex-row sm:justify-between sm:p-8">
      <div>
        <h1 className="text-3xl font-bold">
          <Link href="/" className="hover:opacity-70">{text}</Link>
        </h1>

        <p className="mt-2 max-w-2xl leading-7 text-slate-200">{subtitle}</p>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:shrink-0 sm:flex-nowrap">
        <Link href={language === "zh" ? "/compare?lang=zh" : "/compare"} className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur hover:bg-white/20">
          {language === "zh" ? `收藏比较${savedCount ? ` (${savedCount})` : ""}` : `Compare${savedCount ? ` (${savedCount})` : ""}`}
        </Link>
        <Link href={language === "zh" ? "/paths?lang=zh" : "/paths"} className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur hover:bg-white/20">
          {language === "zh" ? "学习路线" : "Learning paths"}
        </Link>
        <button
          type="button"
          onClick={onToggleLanguage}
          aria-label={language === "en" ? "切换到中文" : "Switch to English"}
          className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur hover:bg-white/20"
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
  suggestions: string[];
  copy: Copy;
};

function SearchBox({
  searchInput,
  setSearchInput,
  onSearch,
  suggestions,
  copy,
}: SearchBoxProps) {
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSearch();
  }

  function chooseSuggestion(suggestion: string) {
    setSearchInput(suggestion);
    setActiveSuggestion(-1);
    void onSearch(suggestion);
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestion((current) => current >= suggestions.length - 1 ? 0 : current + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestion((current) => current <= 0 ? suggestions.length - 1 : current - 1);
    } else if (event.key === "Enter" && activeSuggestion >= 0) {
      event.preventDefault();
      chooseSuggestion(suggestions[activeSuggestion]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setActiveSuggestion(-1);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative mt-6 flex flex-col gap-2 sm:flex-row">
      <div className="relative min-w-0 flex-1">
        <input
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={suggestions.length > 0}
          aria-controls="course-search-suggestions"
          aria-activedescendant={activeSuggestion >= 0 ? `course-search-suggestion-${activeSuggestion}` : undefined}
          placeholder={copy.searchPlaceholder}
          value={searchInput}
          onChange={(event) => { setSearchInput(event.target.value); setActiveSuggestion(-1); }}
          onKeyDown={handleSearchKeyDown}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-700"
        />

        {suggestions.length > 0 && (
          <div
            id="course-search-suggestions"
            role="listbox"
            className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                id={`course-search-suggestion-${index}`}
                type="button"
                role="option"
                aria-selected={activeSuggestion === index}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveSuggestion(index)}
                onClick={() => chooseSuggestion(suggestion)}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${activeSuggestion === index ? "bg-gray-100" : ""}`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="min-w-24 rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
      >
        {copy.search}
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
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
  favoriteCount: number | null;
  onToggleFavorite: () => void;
};

function CourseCard({ course, language, copy, favorite, favoriteCount, onToggleFavorite }: CourseCardProps) {
  const router = useRouter();
  const studyStage = suggestedStudyStage(course);
  const displayedSubjects = displayCourseSubjects(course, language);
  const detailPath = courseDetailPath(course, language);
  const planTasks = structuredCoursePlans[course.id]?.tasks ?? [];
  const resourceBadges = [
    { key: "lectures", label: language === "zh" ? "讲义 / 视频" : "Lectures / video", icon: "▶", kind: "session", className: "border-blue-200 bg-blue-50 text-blue-900" },
    { key: "assignments", label: language === "zh" ? "作业" : "Assignments", icon: "✓", kind: "assignment", className: "border-emerald-200 bg-emerald-50 text-emerald-900" },
    { key: "exams", label: language === "zh" ? "考试" : "Exams", icon: "◇", kind: "exam", className: "border-amber-200 bg-amber-50 text-amber-950" },
    { key: "projects", label: language === "zh" ? "项目" : "Projects", icon: "◆", kind: "project", className: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-900" },
  ].map((item) => ({ ...item, tasks: planTasks.filter(({ kind }) => kind === item.kind) })).filter(({ tasks }) => tasks.length > 0);

  function openCourse(event: MouseEvent<HTMLElement>) {
    const target = event.target;
    if (target instanceof Element && target.closest("a, button, input, select, textarea")) return;
    router.push(detailPath);
  }

  function openCourseWithKeyboard(event: KeyboardEvent<HTMLElement>) {
    if (event.target !== event.currentTarget || event.key !== "Enter") return;
    router.push(detailPath);
  }

  return (
    <article
      id={course.id}
      role="link"
      tabIndex={0}
      aria-label={`${courseCode(course)} · ${language === "zh" ? course.titleZh : course.title}`}
      onClick={openCourse}
      onKeyDown={openCourseWithKeyboard}
      className="course-card group scroll-mt-6 cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
    >
      <div className="course-card-hero border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-violet-50/70 p-5">
        <div className="flex items-start justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-700">{course.university}</p><div className="flex items-center gap-2">{favoriteCount !== null && <span className="text-xs font-semibold text-slate-500">{copy.savedBy(favoriteCount)}</span>}<button type="button" onClick={onToggleFavorite} aria-label={favorite ? "Remove favorite" : "Save favorite"} className="course-card-favorite rounded-full bg-white/90 p-2 text-xl leading-none shadow-sm ring-1 ring-slate-200 transition hover:scale-105" title={favorite ? (language === "zh" ? "取消收藏" : "Remove favorite") : (language === "zh" ? "收藏" : "Save")}>{favorite ? "★" : "☆"}</button></div></div>

      <h2 className="mt-3 text-xl font-bold leading-snug text-slate-950">
        <Link href={detailPath} className="hover:underline">
        <span className="mr-2 text-violet-700">{courseCode(course)}</span>{language === "zh" ? course.titleZh : course.title}
        </Link>
      </h2>

      <p className="mt-1 line-clamp-1 text-sm text-slate-500">
        {language === "zh" ? course.title : course.titleZh}
      </p>
      </div>

      <div className="p-5">
      <p className="line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
        {language === "zh" ? course.descriptionZh : course.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
        {displayedSubjects.map((subject) => <span key={subject} className="rounded-full bg-slate-100 px-2.5 py-1">{subject}</span>)}
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-900">{course.level === null ? copy.notVerified : language === "zh" ? (levelZh[course.level] ?? course.level) : course.level}</span>
        {studyStage && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-900">{language === "zh" ? studyStageZh[studyStage] : studyStage}</span>}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.13em] text-slate-400">{language === "zh" ? "直接打开官方资料" : "Open official material"}</p>
        <div className="flex min-h-7 flex-wrap gap-2">
        {resourceBadges.map(({ key, label, icon, className, tasks }) => <Link key={key} href={`${detailPath}#resource-${tasks[0].kind}`} title={language === "zh" ? `查看全部${label}` : `View all ${label}`} className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition hover:-translate-y-0.5 hover:shadow-sm ${className}`}><span aria-hidden="true">{icon}</span>{label}<span className="rounded-full bg-white/70 px-1.5 py-0.5 text-[0.65rem]">{tasks.length}</span><span aria-hidden="true">→</span></Link>)}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
        <span className="text-slate-500">{courseEditionLabel(course, language)}</span>
        <Link href={detailPath} className="font-bold text-violet-700 group-hover:translate-x-0.5">{copy.viewCourse}</Link>
      </div>
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
  const favoriteCounts = useCourseFavoriteCounts();
  const copy = translations[language];

  const universities = uniqueCourseValues(courses, "university");
  const subjects = uniqueCourseSubjects(courses);
  const programmingLanguages = uniqueProgrammingLanguages(courses);

  useEffect(() => {
    const nextSearch = searchInput.trim();
    if (nextSearch === searchTerm) return;
    const timer = window.setTimeout(() => {
      setSearchTerm(nextSearch);
      router.replace(coursesPath(nextSearch, language), { scroll: false });
      setVisibleCount(coursesPerPage);
    }, 160);
    return () => window.clearTimeout(timer);
  }, [language, router, searchInput, searchTerm]);

  function handleSearch(suggestedValue?: string) {
    const nextSearch = (suggestedValue ?? searchInput).trim();
    if (nextSearch === searchTerm) return;
    setSearchInput(nextSearch);
    setSearchTerm(nextSearch);
    router.replace(coursesPath(nextSearch, language), { scroll: false });
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

  const filteredCourses = rankCoursesForSearch(sortCourses(
    filterCourses(courses, {
      searchTerm,
      university: universityFilter,
      subject: subjectFilter,
      onlyVideos,
      onlyAssignments,
      onlySolutions,
    }),
    sort,
    favoriteCounts.counts,
  ), searchTerm);
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
  const requestCoursePath = `/feedback?${new URLSearchParams({ ...(language === "zh" ? { lang: "zh" } : {}), type: "missing-course", ...(searchTerm ? { request: searchTerm } : {}) }).toString()}`;

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
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
                <option value="popular">{copy.popular}</option>
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
            {searchOnlyMatches > 0 && <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-900"><p>{copy.filteredOut(searchOnlyMatches)}</p><button type="button" onClick={clearFiltersKeepSearch} className="mt-2 rounded-lg border border-blue-300 bg-white px-3 py-2 font-semibold hover:bg-blue-100">{copy.clearFiltersKeepSearch}</button></div>}
            {relatedSearches.length > 0 && <div className="mt-4"><p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{copy.relatedSearches}</p><div className="mt-2 flex flex-wrap justify-center gap-2">{relatedSearches.map((suggestion) => <button key={suggestion} type="button" onClick={() => { setSearchInput(suggestion); handleSearch(suggestion); }} className="rounded-full border border-gray-300 px-3 py-1.5 text-sm hover:border-black">{suggestion}</button>)}</div></div>}
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row"><Link href={requestCoursePath} className="rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-800">{copy.requestCourse} →</Link><button type="button" onClick={handleResetFilters} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50">{copy.reset}</button></div>
            <p className="mx-auto mt-4 max-w-xl text-xs leading-5 text-gray-500">{copy.requestCourseHelp}</p>
          </div>
        ) : (
          <div className="mt-6 grid items-stretch gap-5 md:grid-cols-2">
            {visibleCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                language={language}
                copy={copy}
                favorite={library.favorites.includes(course.id)}
                favoriteCount={favoriteCounts.available ? (favoriteCounts.counts[course.id] ?? 0) : null}
                onToggleFavorite={() => {
                  const wasFavorite = library.favorites.includes(course.id);
                  toggleFavorite(course.id);
                  favoriteCounts.adjust(course.id, wasFavorite ? -1 : 1);
                }}
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
        {filteredCourses.length > 0 && <div className="mt-8 flex flex-col items-start justify-between gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-5 sm:flex-row sm:items-center"><div><p className="font-semibold text-violet-950">{copy.requestCourse}</p><p className="mt-1 text-sm text-violet-800">{copy.requestCourseHelp}</p></div><Link href={requestCoursePath} className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-violet-800 shadow-sm ring-1 ring-violet-200 hover:ring-violet-400">{copy.requestCourse} →</Link></div>}
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
