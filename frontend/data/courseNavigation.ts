import type { Course } from "./courses";

export type Language = "en" | "zh";

export const prerequisiteCourseIds: Record<string, string> = {
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
  "Single Variable Calculus or equivalent": "mit-18-01sc",
  "Multivariable Calculus": "mit-18-02sc",
  "Introduction to Biology": "mit-7-012",
  "Principles of Chemical Science": "mit-5-111sc",
  "Classical Mechanics": "mit-8-01sc",
  "Physics II: Electricity and Magnetism": "mit-8-02",
  "Differential equations": "harvard-math21b",
  "MIT 6.006": "mit-6-006",
  "MIT 6.004": "mit-6-004",
  "MIT 6.031": "mit-6-031",
  "MIT 6.033 or equivalent": "mit-6-033",
  "Stanford CS 107": "stanford-cs107",
  "Stanford CS 103": "stanford-cs103",
  "Stanford CS 109": "stanford-cs109",
  "Stanford CS 111": "stanford-cs111",
};

export function courseDetailPath(courseOrId: Course | string, language: Language) {
  const id = typeof courseOrId === "string" ? courseOrId : courseOrId.id;
  return `/courses/${id}${language === "zh" ? "?lang=zh" : ""}`;
}
