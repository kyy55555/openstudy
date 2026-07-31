import type { Course } from "./courses";

export type CourseFilters = {
  searchTerm: string;
  university: string;
  subject: string;
  onlyVideos: boolean;
  onlyAssignments: boolean;
  onlySolutions: boolean;
};

export type CourseSort = "easiest" | "newest" | "title" | "university";

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
  const normalizedSearch = filters.searchTerm.trim().toLowerCase();

  return courses.filter((course) => {
    const searchableText = [
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
      (normalizedSearch === "" || searchableText.includes(normalizedSearch)) &&
      (filters.university === "All" || course.university === filters.university) &&
      (filters.subject === "All" || course.subject === filters.subject) &&
      (!filters.onlyVideos || course.hasVideos === true) &&
      (!filters.onlyAssignments || course.hasAssignments === true) &&
      (!filters.onlySolutions || course.hasSolutions === true)
    );
  });
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

    if (sort === "university") {
      const universityDifference = a.university.localeCompare(b.university);
      if (universityDifference !== 0) return universityDifference;
    }

    return a.title.localeCompare(b.title);
  });
}
