"use client";

import { Suspense, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { courseCode, courses, suggestedStudyStage } from "../../data/courses";
import type { Course } from "../../data/courses";
import {
  filterCourses,
  sortCourses,
  uniqueCourseValues,
} from "../../data/courseFilters";
import type { CourseSort } from "../../data/courseFilters";

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
    suggestedStage: "Suggested study stage",
    inferred: "estimate",
    language: "Language",
    year: "Course year",
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
    viewCourse: "View official course →",
    courses: "Courses",
    sort: "Sort",
    easiest: "Easiest to hardest",
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
    suggestedStage: "建议学习阶段",
    inferred: "推断",
    language: "语言",
    year: "课程年份",
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
    viewCourse: "查看官方课程 →",
    courses: "课程",
    sort: "排序",
    easiest: "由易到难",
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

const prerequisiteCourseIds: Record<string, string> = {
  "Introductory Python programming": "mit-6-100l",
  "Introductory programming": "stanford-cs106a",
  "Programming Abstractions or equivalent": "stanford-cs106b",
  Programming: "stanford-cs106a",
  Probability: "mit-18-05",
  "Linear algebra": "mit-18-06",
  "Convex Optimization I or equivalent": "stanford-ee364a",
  "CS50x or prior Python experience": "harvard-cs50x",
  "CS50x or prior programming experience": "harvard-cs50x",
  "COS 126 or equivalent": "princeton-cos126",
  "COS 217": "princeton-cos217",
  "COS 226": "princeton-cos226",
  "CS 3410 or ECE 3140 equivalent": "cornell-cs3410",
  "Discrete mathematics": "mit-6-042j",
  "Data structures": "princeton-cos226",
  "Machine learning": "stanford-cs229",
  "Computer architecture": "cornell-cs3410",
  "CS 61A or CS 61B equivalent": "berkeley-cs61a",
  "CS 61A": "berkeley-cs61a",
  "CS 61B": "berkeley-cs61b",
  "CS 70": "berkeley-cs70",
  "Single Variable Calculus": "mit-18-01sc",
  "Multivariable Calculus": "mit-18-02sc",
  "MIT 6.006": "mit-6-006",
  "MIT 6.004": "mit-6-004",
  "MIT 6.031": "mit-6-031",
  "MIT 6.033 or equivalent": "mit-6-033",
  "Stanford CS 107": "stanford-cs107",
  "Stanford CS 103": "stanford-cs103",
  "Stanford CS 109": "stanford-cs109",
};

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
        <h1 className="text-3xl font-bold">
          <Link href="/" className="hover:opacity-70">{text}</Link>
        </h1>

        <p className="mt-2 text-gray-600">{subtitle}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
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
  const studyStage = suggestedStudyStage(course);

  function prerequisiteLink(prerequisite: string) {
    const targetId = prerequisiteCourseIds[prerequisite];
    const target = courses.find(({ id }) => id === targetId);
    if (!target) return null;
    return `${coursesPath(target.title, language)}#${target.id}`;
  }

  function materialStatus(value: Course["hasVideos"]) {
    if (value === null) return `? ${copy.notVerified}`;
    return value ? copy.available : copy.unavailable;
  }

  return (
    <article id={course.id} className="scroll-mt-6 rounded-xl border border-gray-200 p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-gray-500">
          {course.university}
        </p>
      </div>

      <h2 className="mt-2 text-xl font-semibold">
        <span className="mr-2 text-gray-500">{courseCode(course)}</span>
        {language === "zh" ? course.titleZh : course.title}
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        {language === "zh" ? course.title : course.titleZh}
      </p>

      <p className="mt-4 text-gray-700">
        {language === "zh" ? course.descriptionZh : course.description}
      </p>

      <div className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
        <p>
          <span className="font-medium">{copy.subject}:</span>{" "}
          {language === "zh" ? course.subjectZh : course.subject}
        </p>

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
          {language === "zh" && course.language === "English"
            ? "英语"
            : course.language}
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
  const copy = translations[language];

  const universities = uniqueCourseValues(courses, "university");
  const subjects = uniqueCourseValues(courses, "subject");

  function handleSearch() {
    const nextSearch = searchInput.trim();
    setSearchTerm(nextSearch);
    router.replace(coursesPath(nextSearch, language));
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
        onToggleLanguage={() => {
          const nextLanguage = language === "en" ? "zh" : "en";
          setLanguage(nextLanguage);
          router.replace(coursesPath(searchTerm, nextLanguage));
        }}
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
                <option value="easiest">{copy.easiest}</option>
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

export default function CoursesPage() {
  return (
    <Suspense fallback={<main className="mx-auto min-h-screen max-w-4xl px-6 py-12" />}>
      <CourseExplorer />
    </Suspense>
  );
}
