export type Course = {
  id: string;

  title: string;
  titleZh: string;

  university: string;

  subject: string;
  subjectZh: string;

  description: string;
  descriptionZh: string;

  searchKeywords: string[];

  level: string;
  prerequisites: string[];

  language: string;

  year: number | null;
  lastUpdated: number | null;

  hasVideos: boolean;
  hasAssignments: boolean;
  hasSolutions: boolean;

  recommended: boolean;

  courseUrl: string;
};


export const courses: Course[] = [
  {
    id: "mit-algorithms",

    title: "Introduction to Algorithms",
    titleZh: "算法导论",

    university: "MIT",

    subject: "Algorithms",
    subjectZh: "算法",

    description:
      "An introductory course covering fundamental algorithms and data structures.",

    descriptionZh:
      "介绍基础算法、数据结构和算法分析。",

    searchKeywords: [
      "algorithm",
      "algorithms",
      "data structure",
      "data structures",
      "算法",
      "数据结构",
    ],

    level: "Intermediate",

    prerequisites: [
      "Programming",
      "Data Structures",
    ],

    language: "English",

    year: 2020,
    lastUpdated: null,

    hasVideos: true,
    hasAssignments: true,
    hasSolutions: true,

    recommended: true,

    courseUrl: "#",
  },


  {
    id: "stanford-algorithms",

    title: "Algorithms",
    titleZh: "算法",

    university: "Stanford University",

    subject: "Algorithms",
    subjectZh: "算法",

    description:
      "A course covering algorithm design, analysis, and problem-solving techniques.",

    descriptionZh:
      "介绍算法设计、算法分析以及解决复杂问题的方法。",

    searchKeywords: [
      "algorithm",
      "algorithms",
      "data structure",
      "data structures",
      "algorithm design",
      "算法",
      "算法设计",
      "数据结构",
    ],

    level: "Intermediate",

    prerequisites: [
      "Programming",
      "Data Structures",
    ],

    language: "English",

    year: null,
    lastUpdated: null,

    hasVideos: true,
    hasAssignments: true,
    hasSolutions: false,

    recommended: false,

    courseUrl: "#",
  },


  {
    id: "cmu-algorithms",

    title: "Algorithms and Advanced Data Structures",
    titleZh: "算法与高级数据结构",

    university: "Carnegie Mellon University",

    subject: "Algorithms",
    subjectZh: "算法",

    description:
      "A rigorous course in algorithms, data structures, and computational problem solving.",

    descriptionZh:
      "一门深入学习算法、数据结构以及计算问题求解的课程。",

    searchKeywords: [
      "algorithm",
      "algorithms",
      "advanced data structures",
      "data structure",
      "数据结构",
      "高级数据结构",
    ],

    level: "Advanced",

    prerequisites: [
      "Programming",
      "Data Structures",
      "Discrete Mathematics",
    ],

    language: "English",

    year: null,
    lastUpdated: null,

    hasVideos: false,
    hasAssignments: true,
    hasSolutions: false,

    recommended: false,

    courseUrl: "#",
  },
];