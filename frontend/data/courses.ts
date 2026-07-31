export type Verification = boolean | null;

export type Course = {
  id: string;
  title: string;
  titleZh: string | null;
  university: string;
  subject: string;
  subjectZh: string;
  description: string;
  descriptionZh: string | null;
  searchKeywords: string[];
  level: string | null;
  prerequisites: string[] | null;
  language: string;
  year: number | null;
  hasVideos: Verification;
  hasAssignments: Verification;
  hasSolutions: Verification;
  courseUrl: string;
  sourceName: string;
  sourceUrl: string;
  verifiedOn: string;
};

const verifiedOn = "2026-07-31";

type CourseSeed = Omit<
  Course,
  | "titleZh"
  | "descriptionZh"
  | "searchKeywords"
  | "level"
  | "prerequisites"
  | "language"
  | "year"
  | "hasVideos"
  | "hasAssignments"
  | "hasSolutions"
  | "sourceUrl"
  | "verifiedOn"
> &
  Partial<
    Pick<
      Course,
      | "titleZh"
      | "descriptionZh"
      | "searchKeywords"
      | "level"
      | "prerequisites"
      | "language"
      | "year"
      | "hasVideos"
      | "hasAssignments"
      | "hasSolutions"
      | "sourceUrl"
    >
  >;

function course(seed: CourseSeed): Course {
  return {
    titleZh: null,
    descriptionZh: null,
    searchKeywords: [],
    level: null,
    prerequisites: null,
    language: "English",
    year: null,
    hasVideos: null,
    hasAssignments: null,
    hasSolutions: null,
    sourceUrl: seed.courseUrl,
    verifiedOn,
    ...seed,
  };
}

const mitSource = "MIT OpenCourseWare";
const stanfordSource = "Stanford Engineering Everywhere";
const harvardSource = "Harvard CS50 OpenCourseWare";

export const courses: Course[] = [
  course({
    id: "mit-6-100l",
    title: "Introduction to CS and Programming Using Python",
    university: "MIT",
    subject: "Programming",
    subjectZh: "编程",
    description: "An introduction to computer science and programming using Python.",
    searchKeywords: ["python", "introductory programming"],
    level: "Introductory",
    year: 2022,
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/",
    sourceName: mitSource,
  }),
  course({
    id: "mit-6-0002",
    title: "Introduction to Computational Thinking and Data Science",
    university: "MIT",
    subject: "Data Science",
    subjectZh: "数据科学",
    description: "Computational problem solving, data analysis, simulation, and modeling with Python.",
    searchKeywords: ["python", "data science", "simulation"],
    level: "Introductory",
    prerequisites: ["Introductory Python programming"],
    year: 2016,
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://ocw.mit.edu/courses/6-0002-introduction-to-computational-thinking-and-data-science-fall-2016/",
    sourceName: mitSource,
  }),
  course({
    id: "mit-6-006",
    title: "Introduction to Algorithms",
    university: "MIT",
    subject: "Algorithms",
    subjectZh: "算法",
    description: "Algorithm design, analysis, and common data structures.",
    searchKeywords: ["algorithms", "data structures"],
    level: "Undergraduate",
    year: 2020,
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
    sourceName: mitSource,
  }),
  course({
    id: "mit-6-046j",
    title: "Design and Analysis of Algorithms",
    university: "MIT",
    subject: "Algorithms",
    subjectZh: "算法",
    description: "Advanced techniques for designing and analyzing efficient algorithms.",
    searchKeywords: ["algorithm design", "algorithm analysis"],
    level: "Advanced Undergraduate",
    year: 2015,
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/",
    sourceName: mitSource,
  }),
  course({
    id: "mit-6-034",
    title: "Artificial Intelligence",
    university: "MIT",
    subject: "Artificial Intelligence",
    subjectZh: "人工智能",
    description: "Foundational methods for reasoning, learning, search, and knowledge representation.",
    searchKeywords: ["AI", "search", "machine learning"],
    level: "Undergraduate",
    year: 2010,
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/",
    sourceName: mitSource,
  }),
  course({
    id: "mit-6-824",
    title: "Distributed Computer Systems Engineering",
    university: "MIT",
    subject: "Distributed Systems",
    subjectZh: "分布式系统",
    description: "Design and implementation principles for distributed computer systems.",
    searchKeywords: ["distributed systems", "systems engineering"],
    level: "Graduate",
    year: 2006,
    hasAssignments: true,
    courseUrl: "https://ocw.mit.edu/courses/6-824-distributed-computer-systems-engineering-spring-2006/",
    sourceName: mitSource,
  }),
  course({
    id: "mit-6-858",
    title: "Computer Systems Security",
    university: "MIT",
    subject: "Cybersecurity",
    subjectZh: "网络安全",
    description: "Security principles and techniques for computer systems and software.",
    searchKeywords: ["security", "computer security", "cybersecurity"],
    level: "Graduate",
    year: 2014,
    hasVideos: true,
    hasAssignments: true,
    hasSolutions: true,
    courseUrl: "https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/",
    sourceName: mitSource,
  }),
  course({
    id: "mit-6-837",
    title: "Computer Graphics",
    university: "MIT",
    subject: "Computer Graphics",
    subjectZh: "计算机图形学",
    description: "Core concepts and algorithms for creating and manipulating computer graphics.",
    searchKeywords: ["graphics", "rendering", "animation"],
    level: "Undergraduate",
    year: 2012,
    hasAssignments: true,
    courseUrl: "https://ocw.mit.edu/courses/6-837-computer-graphics-fall-2012/",
    sourceName: mitSource,
  }),
  course({
    id: "stanford-cs106a",
    title: "Programming Methodology",
    university: "Stanford University",
    subject: "Programming",
    subjectZh: "编程",
    description: "Object-oriented programming and software engineering principles using Java.",
    searchKeywords: ["Java", "object-oriented programming"],
    level: "Introductory",
    prerequisites: [],
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://see.stanford.edu/Course/CS106A",
    sourceName: stanfordSource,
  }),
  course({
    id: "stanford-cs106b",
    title: "Programming Abstractions",
    university: "Stanford University",
    subject: "Data Structures",
    subjectZh: "数据结构",
    description: "Data abstraction, recursion, algorithms, and fundamental data structures using C++.",
    searchKeywords: ["C++", "recursion", "data structures"],
    level: "Intermediate",
    prerequisites: ["Introductory programming"],
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://see.stanford.edu/Course/CS106B",
    sourceName: stanfordSource,
  }),
  course({
    id: "stanford-cs107",
    title: "Programming Paradigms",
    university: "Stanford University",
    subject: "Programming Languages",
    subjectZh: "编程语言",
    description: "Imperative, object-oriented, functional, and concurrent programming paradigms.",
    searchKeywords: ["C", "C++", "Scheme", "concurrency"],
    level: "Intermediate",
    prerequisites: ["Programming Abstractions or equivalent"],
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://see.stanford.edu/Course/CS107",
    sourceName: stanfordSource,
  }),
  course({
    id: "stanford-cs223a",
    title: "Introduction to Robotics",
    university: "Stanford University",
    subject: "Robotics",
    subjectZh: "机器人学",
    description: "Modeling, planning, and control for robotic manipulators.",
    searchKeywords: ["robotics", "control", "kinematics"],
    level: "Advanced",
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://see.stanford.edu/Course/CS223A",
    sourceName: stanfordSource,
  }),
  course({
    id: "stanford-cs229",
    title: "Machine Learning",
    university: "Stanford University",
    subject: "Machine Learning",
    subjectZh: "机器学习",
    description: "Supervised and unsupervised learning, learning theory, and reinforcement learning.",
    searchKeywords: ["machine learning", "statistical learning", "reinforcement learning"],
    level: "Advanced",
    prerequisites: ["Programming", "Probability", "Linear algebra"],
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://see.stanford.edu/Course/CS229",
    sourceName: stanfordSource,
  }),
  course({
    id: "stanford-ee261",
    title: "The Fourier Transform and Its Applications",
    university: "Stanford University",
    subject: "Applied Mathematics",
    subjectZh: "应用数学",
    description: "Fourier analysis and its applications in science and engineering.",
    searchKeywords: ["Fourier transform", "signal processing"],
    level: "Advanced",
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://see.stanford.edu/Course/EE261",
    sourceName: stanfordSource,
  }),
  course({
    id: "stanford-ee263",
    title: "Introduction to Linear Dynamical Systems",
    university: "Stanford University",
    subject: "Systems",
    subjectZh: "系统",
    description: "State-space models, stability, control, and estimation for linear dynamical systems.",
    searchKeywords: ["linear systems", "control", "state space"],
    level: "Advanced",
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://see.stanford.edu/Course/EE263",
    sourceName: stanfordSource,
  }),
  course({
    id: "stanford-ee364a",
    title: "Convex Optimization I",
    university: "Stanford University",
    subject: "Optimization",
    subjectZh: "优化",
    description: "Convex sets, convex functions, duality, and convex optimization algorithms.",
    searchKeywords: ["convex optimization", "duality"],
    level: "Advanced",
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://see.stanford.edu/Course/EE364A",
    sourceName: stanfordSource,
  }),
  course({
    id: "stanford-ee364b",
    title: "Convex Optimization II",
    university: "Stanford University",
    subject: "Optimization",
    subjectZh: "优化",
    description: "Advanced topics and applications in convex optimization.",
    searchKeywords: ["convex optimization", "optimization methods"],
    level: "Advanced",
    prerequisites: ["Convex Optimization I or equivalent"],
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://see.stanford.edu/Course/EE364B",
    sourceName: stanfordSource,
  }),
  course({
    id: "harvard-cs50x",
    title: "CS50's Introduction to Computer Science",
    university: "Harvard University",
    subject: "Computer Science",
    subjectZh: "计算机科学",
    description: "A broad introduction to computational thinking, programming, algorithms, data structures, and the web.",
    searchKeywords: ["C", "Python", "SQL", "algorithms", "web"],
    level: "Introductory",
    prerequisites: [],
    year: 2026,
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://cs50.harvard.edu/x/",
    sourceName: harvardSource,
  }),
  course({
    id: "harvard-cs50-python",
    title: "CS50's Introduction to Programming with Python",
    university: "Harvard University",
    subject: "Programming",
    subjectZh: "编程",
    description: "An introduction to programming, testing, and debugging with Python.",
    searchKeywords: ["Python", "testing", "debugging"],
    level: "Introductory",
    prerequisites: [],
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://cs50.harvard.edu/python/",
    sourceName: harvardSource,
  }),
  course({
    id: "harvard-cs50-ai",
    title: "CS50's Introduction to Artificial Intelligence with Python",
    university: "Harvard University",
    subject: "Artificial Intelligence",
    subjectZh: "人工智能",
    description: "Search, knowledge, uncertainty, optimization, learning, neural networks, and language.",
    searchKeywords: ["AI", "Python", "neural networks", "natural language"],
    level: "Intermediate",
    prerequisites: ["CS50x or prior Python experience"],
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://cs50.harvard.edu/ai/",
    sourceName: harvardSource,
  }),
  course({
    id: "harvard-cs50-web",
    title: "CS50's Web Programming with Python and JavaScript",
    university: "Harvard University",
    subject: "Web Development",
    subjectZh: "Web 开发",
    description: "Web application design and implementation with Python, JavaScript, SQL, Django, and React.",
    searchKeywords: ["web", "Python", "JavaScript", "Django", "React"],
    level: "Intermediate",
    prerequisites: ["CS50x or prior programming experience"],
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://cs50.harvard.edu/web/",
    sourceName: harvardSource,
  }),
  course({
    id: "harvard-cs50-sql",
    title: "CS50's Introduction to Databases with SQL",
    university: "Harvard University",
    subject: "Databases",
    subjectZh: "数据库",
    description: "Relational data modeling, querying, normalization, indexes, and database scalability.",
    searchKeywords: ["SQL", "databases", "SQLite", "PostgreSQL", "MySQL"],
    level: "Introductory",
    prerequisites: [],
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://cs50.harvard.edu/sql/",
    sourceName: harvardSource,
  }),
  course({
    id: "harvard-cs50-cybersecurity",
    title: "CS50's Introduction to Cybersecurity",
    university: "Harvard University",
    subject: "Cybersecurity",
    subjectZh: "网络安全",
    description: "An introduction to securing accounts, data, systems, software, and privacy.",
    searchKeywords: ["cybersecurity", "security", "privacy", "cryptography"],
    level: "Introductory",
    prerequisites: [],
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://cs50.harvard.edu/cybersecurity/",
    sourceName: harvardSource,
  }),
  course({
    id: "harvard-cs50-r",
    title: "CS50's Introduction to Programming with R",
    university: "Harvard University",
    subject: "Data Science",
    subjectZh: "数据科学",
    description: "An introduction to programming and data analysis with R.",
    searchKeywords: ["R", "data science", "statistics"],
    level: "Introductory",
    prerequisites: [],
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://cs50.harvard.edu/r/",
    sourceName: harvardSource,
  }),
  course({
    id: "harvard-cs50-scratch",
    title: "CS50's Introduction to Programming with Scratch",
    university: "Harvard University",
    subject: "Programming",
    subjectZh: "编程",
    description: "A visual introduction to programming fundamentals using Scratch.",
    searchKeywords: ["Scratch", "visual programming"],
    level: "Introductory",
    prerequisites: [],
    hasVideos: true,
    hasAssignments: true,
    courseUrl: "https://cs50.harvard.edu/scratch/",
    sourceName: harvardSource,
  }),
];
