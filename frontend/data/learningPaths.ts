export type LearningPathPhase = {
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  courseIds: string[];
  chooseCount: number | null;
};

export type LearningPath = {
  id: string;
  university: string;
  program: string;
  programZh: string;
  officialUrl: string;
  summary: string;
  summaryZh: string;
  scheduleStatus: "requirements-only";
  phases: LearningPathPhase[];
};

function group(title: string, titleZh: string, description: string, descriptionZh: string, courseIds: string[], chooseCount: number | null = null): LearningPathPhase {
  return { title, titleZh, description, descriptionZh, courseIds, chooseCount };
}

export const learningPaths: LearningPath[] = [
  {
    id: "mit-6-3",
    university: "MIT",
    program: "Computer Science and Engineering (6-3)",
    programZh: "计算机科学与工程（6-3）",
    officialUrl: "https://catalog.mit.edu/degree-charts/computer-science-engineering-course-6-3/",
    summary: "The official catalog specifies programming, algorithms and theory, systems, mathematics, track electives, advanced subjects, and independent inquiry requirements.",
    summaryZh: "官方目录规定编程、算法与理论、系统、数学、方向选修、高阶课程和独立研究要求，但未规定统一的八学期顺序。",
    scheduleStatus: "requirements-only",
    phases: [
      group("Programming requirements", "编程要求", "Programming and software construction foundation.", "编程与软件构造基础。", ["mit-6-100l", "mit-6-0002", "stanford-cs106b"]),
      group("Algorithms and theory", "算法与理论要求", "Discrete mathematics, introductory algorithms, and an advanced theory option.", "离散数学、算法导论及一门高阶理论课程。", ["mit-6-042j", "mit-6-006", "mit-6-046j"]),
      group("Systems requirements", "系统要求", "Low-level programming, computation structures, and a systems option.", "低级编程、计算结构及一门系统方向课。", ["cornell-cs3410", "cornell-cs4410", "mit-6-824"]),
      group("Mathematics option", "数学选项", "Choose probability/statistics or linear algebra.", "概率统计或线性代数任选一门。", ["mit-18-05", "mit-18-06"], 1),
      group("Tracks and advanced electives", "方向与高阶选修", "Choose advanced subjects across approved tracks; the catalog also requires advanced undergraduate and independent-inquiry work.", "从批准方向中选择高阶课程；官方还要求高阶本科课程与独立研究。", ["mit-6-034", "mit-6-837", "mit-6-824", "mit-6-858", "stanford-cs229", "stanford-ee364a"], 4),
    ],
  },
  {
    id: "stanford-cs",
    university: "Stanford University",
    program: "Bachelor of Science in Computer Science",
    programZh: "计算机科学理学学士",
    officialUrl: "https://bulletin.stanford.edu/programs/CS-BS",
    summary: "The official bulletin defines mathematics, science, engineering fundamentals, the CS core, and a selected depth pathway.",
    summaryZh: "官方培养要求包括数学、科学、工程基础、计算机核心课程和一个深度方向；当前页面暂不把建议顺序冒充成官方学期表。",
    scheduleStatus: "requirements-only",
    phases: [
      group("Mathematics", "数学要求", "Calculus plus approved mathematics electives.", "微积分及批准的数学选修。", ["mit-18-01sc", "mit-18-02sc", "mit-18-06", "mit-18-05"]),
      group("Programming and systems core", "编程与系统核心", "Complete the official programming and systems core sequence.", "完成官方编程与系统核心序列。", ["stanford-cs106a", "stanford-cs106b", "stanford-cs107", "stanford-cs103", "stanford-cs109", "stanford-cs111", "stanford-cs161"]),
      group("Depth pathway", "深度方向", "Select courses according to one approved CS pathway.", "按照一个批准的计算机科学方向选择课程。", ["stanford-cs229", "stanford-cs223a", "stanford-ee364a", "stanford-ee364b", "mit-6-034", "mit-6-837"], 4),
      group("Senior project and electives", "高年级项目与选修", "Complete remaining pathway electives and an approved senior project where required.", "完成剩余方向选修及适用的高年级项目。", ["mit-6-824", "mit-6-858", "berkeley-cs161"], 2),
    ],
  },
  {
    id: "berkeley-cs",
    university: "UC Berkeley",
    program: "Computer Science Major",
    programZh: "计算机科学本科专业",
    officialUrl: "https://eecs.berkeley.edu/resources/undergrads/cs/degree-reqs-lowerdiv/",
    summary: "The official requirements specify calculus, linear algebra, CS 61A, 61B/BL, 61C, CS 70, and upper-division requirements.",
    summaryZh: "官方要求包括微积分、线性代数、CS 61A、61B/BL、61C、CS 70 和高年级课程要求。",
    scheduleStatus: "requirements-only",
    phases: [
      group("Lower-division mathematics", "低年级数学", "Complete calculus and linear algebra requirements.", "完成微积分与线性代数要求。", ["mit-18-01sc", "mit-18-02sc", "mit-18-06"]),
      group("Lower-division CS core", "低年级计算机核心", "Complete CS 61A, CS 61B/BL, CS 61C, and CS 70.", "完成 CS 61A、CS 61B/BL、CS 61C 和 CS 70。", ["berkeley-cs61a", "berkeley-cs61b", "berkeley-cs61c", "berkeley-cs70"]),
      group("Upper-division breadth and electives", "高年级广度与选修", "Choose approved upper-division courses while satisfying the official breadth and design rules.", "在满足官方广度与设计规则的前提下选择高年级课程。", ["berkeley-cs161", "berkeley-cs188", "stanford-cs229", "mit-6-824", "mit-6-837", "mit-6-858"], 4),
    ],
  },
  {
    id: "princeton-cos",
    university: "Princeton University",
    program: "Computer Science (AB/BSE)",
    programZh: "计算机科学（AB/BSE）",
    officialUrl: "https://www.cs.princeton.edu/ugrad/undergraduate-degrees-requirements",
    summary: "The official department page defines prerequisites, a foundation course, four core categories, electives, and degree-specific independent work.",
    summaryZh: "官方页面规定先修课、理论基础、四个核心类别、选修课及不同学位对应的独立研究要求，但未规定统一学期顺序。",
    scheduleStatus: "requirements-only",
    phases: [
      group("Prerequisites", "专业先修", "Complete COS 126 or its alternative, COS 217, COS 226, and the applicable mathematics requirement.", "完成 COS 126 或替代课、COS 217、COS 226 及适用的数学要求。", ["princeton-cos126", "princeton-cos217", "princeton-cos226", "mit-18-06"]),
      group("Foundation", "理论基础", "Complete COS 240 or the officially allowed advanced-mathematics alternative.", "完成 COS 240 或官方允许的高阶数学替代组合。", ["princeton-cos240"]),
      group("Four core categories", "四个核心类别", "Choose one course from each official core category.", "从四个官方核心类别中各选一门。", ["cornell-cs4410", "berkeley-cs188", "mit-6-046j", "princeton-cos333"], 4),
      group("Electives", "专业选修", "Complete three eligible upper-level electives under the official rules.", "按官方规则完成三门符合条件的高年级选修。", ["stanford-cs229", "berkeley-cs161", "mit-6-824", "mit-6-858", "stanford-ee364a"], 3),
      group("Independent work", "独立研究", "Complete the independent-work or thesis requirement for the selected AB or BSE track.", "完成 AB 或 BSE 对应的独立研究或论文要求。", []),
    ],
  },
];
