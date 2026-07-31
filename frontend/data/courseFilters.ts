import type { Course } from "./courses";

export type CourseFilters = {
  searchTerm: string;
  university: string;
  subject: string;
  onlyVideos: boolean;
  onlyAssignments: boolean;
  onlySolutions: boolean;
};

export type CourseSort = "newest" | "title" | "university";

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
