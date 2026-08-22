import { courseCode } from "./courses.ts";
import type { Course } from "./courses";

export type CourseFilters = {
  searchTerm: string;
  university: string;
  subject: string;
  onlyVideos: boolean;
  onlyAssignments: boolean;
  onlySolutions: boolean;
};

export type CourseSort = "easiest" | "newest";

const searchSynonymGroups = [
  ["web", "website", "websites", "webpage", "webpages", "网站", "网页", "网站开发", "网页开发", "web开发"],
  ["ai", "artificial intelligence", "人工智能"],
  ["machine learning", "ml", "机器学习"],
  ["database", "databases", "数据库"],
  ["algorithm", "algorithms", "算法"],
  ["data structure", "data structures", "数据结构"],
  ["operating system", "operating systems", "os", "操作系统"],
  ["computer network", "computer networks", "networking", "网络", "计算机网络"],
  ["cybersecurity", "cyber security", "computer security", "网络安全", "信息安全"],
  ["computer graphics", "graphics", "图形学", "计算机图形学"],
  ["linear algebra", "线性代数"],
  ["calculus", "微积分"],
  ["probability", "statistics", "probability and statistics", "概率", "统计", "概率统计"],
  ["data science", "数据科学"],
  ["distributed systems", "distributed system", "分布式系统"],
  ["compiler", "compilers", "编译器", "编译原理"],
] as const;

const commonSearchSuggestions = [
  "Python", "Java", "C", "C++", "JavaScript", "SQL",
  "网站开发", "Web Development", "算法", "Algorithms",
  "人工智能", "Artificial Intelligence", "机器学习", "Machine Learning",
  "数据结构", "Data Structures", "数据库", "Databases",
  "操作系统", "Operating Systems", "计算机网络", "Computer Networks",
  "网络安全", "Cybersecurity", "计算机图形学", "Computer Graphics",
  "线性代数", "Linear Algebra", "微积分", "Calculus",
  "概率统计", "Probability and Statistics", "分布式系统", "Distributed Systems",
] as const;

function editDistance(left: string, right: string) {
  const row = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let diagonal = row[0];
    row[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const previous = row[rightIndex];
      row[rightIndex] = Math.min(
        row[rightIndex] + 1,
        row[rightIndex - 1] + 1,
        diagonal + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
      diagonal = previous;
    }
  }
  return row[right.length];
}

export function courseSearchSuggestions(courses: Course[], input: string, limit = 8) {
  const query = input.trim().toLowerCase();
  if (!query) return [];

  const candidates = Array.from(new Set([
    ...commonSearchSuggestions,
    ...searchSynonymGroups.flat(),
    ...courses.flatMap((course) => [courseCode(course), course.title, course.titleZh, course.subject, course.subjectZh]),
  ].filter((candidate): candidate is string => typeof candidate === "string" && candidate.length > 0)));

  const directMatches = candidates
    .filter((candidate) => candidate.toLowerCase().includes(query))
    .sort((a, b) => {
      const aStarts = a.toLowerCase().startsWith(query) ? 0 : 1;
      const bStarts = b.toLowerCase().startsWith(query) ? 0 : 1;
      return aStarts - bStarts || a.length - b.length || a.localeCompare(b);
    })
    .slice(0, limit);
  if (directMatches.length > 0) return directMatches;

  if (!/^[a-z\s]+$/.test(query) || query.length < 4) return [];
  return candidates
    .map((candidate) => {
      const words = candidate.toLowerCase().match(/[a-z]+/g) ?? [];
      const distance = Math.min(...words.map((word) => editDistance(query, word)), Number.POSITIVE_INFINITY);
      return { candidate, distance };
    })
    .filter(({ distance }) => distance <= Math.max(2, Math.floor(query.length * 0.25)))
    .sort((a, b) => a.distance - b.distance || a.candidate.length - b.candidate.length)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

function searchAlternatives(term: string): readonly string[] {
  return searchSynonymGroups.find((group) => group.some((alias) => alias === term)) ?? [term];
}

function searchMatches(searchableText: string, searchTerm: string) {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (!normalizedSearch) return true;

  // Match known phrases first so Chinese queries and multi-word concepts remain
  // intact. For other multi-word searches, require every word while allowing
  // each word to use its known synonyms.
  const phraseAlternatives = searchAlternatives(normalizedSearch);
  if (phraseAlternatives.length > 1) {
    return phraseAlternatives.some((alternative) => searchableText.includes(alternative));
  }

  return normalizedSearch
    .split(/\s+/)
    .every((word) => searchAlternatives(word).some((alternative) => searchableText.includes(alternative)));
}

const programmingLanguages = [
  { name: "Python", pattern: /\bPython\b/i },
  { name: "Java", pattern: /\bJava\b/i },
  { name: "C", pattern: /\bC programming\b|\bprogramming in C(?!\+)|\busing C(?!\+)/i },
  { name: "C++", pattern: /C\+\+/i },
  { name: "JavaScript", pattern: /\bJavaScript\b/i },
  { name: "SQL", pattern: /\bSQL\b/i },
  { name: "Scratch", pattern: /\bScratch\b/i },
  { name: "Scheme", pattern: /\bScheme\b/i },
  { name: "OCaml", pattern: /\bOCaml\b/i },
  { name: "Standard ML", pattern: /\bStandard ML\b/i },
] as const;

export function courseProgrammingLanguages(course: Course): string[] {
  const text = [course.title, course.description, ...course.searchKeywords].join(" ");
  const exactKeywords = new Set(course.searchKeywords.map((keyword) => keyword.toLowerCase()));

  return programmingLanguages
    .filter(({ name, pattern }) =>
      pattern.test(text) || exactKeywords.has(name.toLowerCase()),
    )
    .map(({ name }) => name);
}

export function uniqueProgrammingLanguages(courses: Course[]) {
  const available = new Set(courses.flatMap(courseProgrammingLanguages));
  return programmingLanguages
    .map(({ name }) => name)
    .filter((name) => available.has(name));
}

export const programmingLanguageSubjectPrefix = "Programming language:";

const broadSubjects = new Set([
  "Computer Science",
  "Programming",
  "Programming Languages",
]);

export function canonicalCourseSubject(course: Course): string | null {
  if (broadSubjects.has(course.subject)) return null;
  if (course.subject === "Systems") return "Computer Systems";
  if (course.subject === "Probability") return "Probability and Statistics";
  return course.subject;
}

export function displayCourseSubjects(course: Course, language: "en" | "zh") {
  const canonicalSubject = canonicalCourseSubject(course);
  if (!canonicalSubject) return courseProgrammingLanguages(course);
  if (language === "en") return [canonicalSubject];
  if (course.subject === "Systems") return ["计算机系统"];
  if (course.subject === "Probability") return ["概率与统计"];
  return [course.subjectZh];
}

export function uniqueCourseSubjects(courses: Course[]) {
  return Array.from(
    new Set(courses.map(canonicalCourseSubject).filter((subject): subject is string => Boolean(subject))),
  ).sort();
}

export function courseSubjectLabel(
  courses: Course[],
  subject: string,
  language: "en" | "zh",
) {
  if (language === "en") return subject;
  const matchingCourse = courses.find(
    (course) => canonicalCourseSubject(course) === subject,
  );
  return matchingCourse ? displayCourseSubjects(matchingCourse, "zh")[0] : subject;
}

export function courseDifficultyRank(course: Course) {
  if (course.level === "Introductory") {
    return course.prerequisites?.length ? 1 : 0;
  }
  if (course.level === "Intermediate") return 1;
  if (course.level === "Undergraduate") return 2;
  if (course.level === "Advanced" || course.level === "Advanced Undergraduate") return 3;
  if (course.level === "Graduate") return 4;
  return Number.POSITIVE_INFINITY;
}

export function uniqueCourseValues(
  courses: Course[],
  field: "university" | "subject",
) {
  return Array.from(new Set(courses.map((course) => course[field]))).sort();
}

export function filterCourses(courses: Course[], filters: CourseFilters) {
  return courses.filter((course) => {
    const searchableText = [
      courseCode(course),
      course.title,
      course.titleZh,
      course.university,
      course.subject,
      course.subjectZh,
      course.description,
      course.descriptionZh,
      ...course.searchKeywords,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      searchMatches(searchableText, filters.searchTerm) &&
      (filters.university === "All" || course.university === filters.university) &&
      (filters.subject === "All" ||
        (filters.subject.startsWith(programmingLanguageSubjectPrefix)
          ? courseProgrammingLanguages(course).includes(
              filters.subject.slice(programmingLanguageSubjectPrefix.length),
            )
          : canonicalCourseSubject(course) === filters.subject)) &&
      (!filters.onlyVideos || course.hasVideos === true) &&
      (!filters.onlyAssignments || course.hasAssignments === true) &&
      (!filters.onlySolutions || course.hasSolutions === true)
    );
  });
}

export function rankCoursesForSearch(courses: Course[], searchTerm: string) {
  const query = searchTerm.trim().toLowerCase();
  if (!query) return [...courses];
  function score(course: Course) {
    const code = courseCode(course).toLowerCase();
    const titles = [course.title, course.titleZh].filter((value): value is string => Boolean(value)).map((value) => value.toLowerCase());
    const subjects = [course.subject, course.subjectZh].map((value) => value.toLowerCase());
    if (code === query) return 0;
    if (titles.some((title) => title === query)) return 1;
    if (code.startsWith(query)) return 2;
    if (titles.some((title) => title.startsWith(query))) return 3;
    if (titles.some((title) => title.includes(query))) return 4;
    if (subjects.some((subject) => subject.includes(query))) return 5;
    return 6;
  }
  return [...courses].sort((a, b) => score(a) - score(b));
}

export function sortCourses(courses: Course[], sort: CourseSort) {
  return [...courses].sort((a, b) => {
    if (sort === "easiest") {
      const stageDifference = courseDifficultyRank(a) - courseDifficultyRank(b);
      if (stageDifference !== 0) return stageDifference;

      const prerequisiteDifference =
        (a.prerequisites?.length ?? Number.POSITIVE_INFINITY) -
        (b.prerequisites?.length ?? Number.POSITIVE_INFINITY);
      if (prerequisiteDifference !== 0) return prerequisiteDifference;
    }

    if (sort === "newest") {
      const yearDifference = (b.year ?? -Infinity) - (a.year ?? -Infinity);
      if (yearDifference !== 0) return yearDifference;
    }

    return a.title.localeCompare(b.title);
  });
}
