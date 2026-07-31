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
  phases: LearningPathPhase[];
};

const semesterNames = [
  ["Freshman fall", "大一上"],
  ["Freshman spring", "大一下"],
  ["Sophomore fall", "大二上"],
  ["Sophomore spring", "大二下"],
  ["Junior fall", "大三上"],
  ["Junior spring", "大三下"],
  ["Senior fall", "大四上"],
  ["Senior spring", "大四下"],
] as const;

function semester(
  index: number,
  description: string,
  descriptionZh: string,
  courseIds: string[],
  chooseCount: number | null = null,
): LearningPathPhase {
  return {
    title: semesterNames[index][0],
    titleZh: semesterNames[index][1],
    description,
    descriptionZh,
    courseIds,
    chooseCount,
  };
}

export const learningPaths: LearningPath[] = [
  {
    id: "mit-6-3",
    university: "MIT",
    program: "Computer Science and Engineering (6-3)",
    programZh: "计算机科学与工程（6-3）",
    officialUrl: "https://catalog.mit.edu/degree-charts/computer-science-engineering-course-6-3/",
    summary: "Programming, mathematical foundations, algorithms, systems, probability or linear algebra, followed by advanced tracks and independent inquiry.",
    summaryZh: "依次学习编程、数学基础、算法、系统、概率或线性代数，再进入高阶方向与独立研究。",
    phases: [
      semester(0, "Begin programming and calculus.", "开始编程与微积分基础。", ["mit-6-100l", "mit-18-01sc"]),
      semester(1, "Continue computational thinking, discrete math, and calculus.", "继续计算思维、离散数学与微积分。", ["mit-6-0002", "mit-6-042j", "mit-18-02sc"]),
      semester(2, "Take algorithms and choose one mathematics option.", "学习算法，并在线性代数和概率统计中任选一门。", ["mit-6-006", "mit-18-06", "mit-18-05"], 2),
      semester(3, "Advance into algorithm design and computer systems.", "进入算法设计与计算机系统。", ["mit-6-046j", "cornell-cs3410"]),
      semester(4, "Choose two track courses in AI, graphics, systems, or security.", "从人工智能、图形学、系统或安全方向中任选两门。", ["mit-6-034", "mit-6-837", "mit-6-824", "mit-6-858"], 2),
      semester(5, "Choose two more advanced track courses.", "继续从高阶方向课池中任选两门。", ["mit-6-824", "mit-6-858", "stanford-cs229", "stanford-ee364a"], 2),
      semester(6, "Choose one advanced elective and begin independent inquiry.", "任选一门高阶选修并开始独立研究。", ["stanford-cs229", "stanford-cs223a", "stanford-ee364a", "berkeley-cs161"], 1),
      semester(7, "Complete advanced electives and an independent project.", "完成高阶选修与独立项目。", []),
    ],
  },
  {
    id: "stanford-cs",
    university: "Stanford University",
    program: "Bachelor of Science in Computer Science",
    programZh: "计算机科学理学学士",
    officialUrl: "https://bulletin.stanford.edu/programs/CS-BS",
    summary: "Mathematics and science foundations, programming and systems core, then a chosen depth pathway and electives.",
    summaryZh: "先完成数学、科学与编程系统核心，再选择专业深度方向和选修课。",
    phases: [
      semester(0, "Begin programming and single-variable calculus.", "开始编程与单变量微积分。", ["stanford-cs106a", "mit-18-01sc"]),
      semester(1, "Continue programming abstractions and calculus.", "继续编程抽象与微积分。", ["stanford-cs106b", "mit-18-02sc"]),
      semester(2, "Study systems programming and linear algebra.", "学习系统编程与线性代数。", ["stanford-cs107", "mit-18-06"]),
      semester(3, "Complete probability and algorithm foundations.", "完成概率与算法基础。", ["mit-18-05", "mit-6-006"]),
      semester(4, "Choose two courses to begin a depth pathway.", "从方向课池中任选两门，开始专业深度方向。", ["stanford-cs229", "stanford-cs223a", "stanford-ee364a", "mit-6-034"], 2),
      semester(5, "Choose two additional depth courses.", "再任选两门深度方向课程。", ["stanford-ee364a", "stanford-ee364b", "mit-6-837", "berkeley-cs188"], 2),
      semester(6, "Choose advanced electives across or within the pathway.", "可在本方向内或跨方向任选两门高阶课。", ["stanford-ee364b", "mit-6-824", "mit-6-858", "berkeley-cs161"], 2),
      semester(7, "Complete a capstone and remaining electives.", "完成综合项目与剩余选修。", []),
    ],
  },
  {
    id: "berkeley-cs",
    university: "UC Berkeley",
    program: "Computer Science Major",
    programZh: "计算机科学本科专业",
    officialUrl: "https://eecs.berkeley.edu/resources/undergrads/cs/degree-reqs-lowerdiv/",
    summary: "Calculus and linear algebra plus CS 61A, 61B, 61C, and CS 70 form the lower-division foundation before upper-division breadth and electives.",
    summaryZh: "微积分、线性代数以及 CS 61A、61B、61C、CS 70 构成本科低年级基础，之后进入高年级广度课与选修课。",
    phases: [
      semester(0, "Take Calculus I and begin CS 61A.", "学习微积分 I，并开始 CS 61A。", ["mit-18-01sc", "berkeley-cs61a"]),
      semester(1, "Take Calculus II and CS 61B data structures.", "学习微积分 II 与 CS 61B 数据结构。", ["mit-18-02sc", "berkeley-cs61b"]),
      semester(2, "Complete linear algebra and CS 70.", "完成线性代数与 CS 70。", ["mit-18-06", "berkeley-cs70"]),
      semester(3, "Study machine structures; use an equivalent open systems course where needed.", "学习计算机组成；缺少本校公开课时采用等价系统课程。", ["cornell-cs3410"]),
      semester(4, "Choose two upper-division breadth courses.", "从高年级广度课池中任选两门。", ["berkeley-cs161", "berkeley-cs188", "cornell-cs4410", "mit-6-837"], 2),
      semester(5, "Choose two upper-division electives.", "从高年级选修课池中任选两门。", ["berkeley-cs188", "stanford-cs229", "mit-6-034", "mit-6-858"], 2),
      semester(6, "Choose one advanced elective and begin a project.", "任选一门高阶选修并开始项目。", ["stanford-cs229", "mit-6-824", "stanford-cs223a", "stanford-ee364a"], 1),
      semester(7, "Complete electives and a capstone project.", "完成选修与综合项目。", []),
    ],
  },
  {
    id: "princeton-cos",
    university: "Princeton University",
    program: "Computer Science (AB/BSE foundation)",
    programZh: "计算机科学（AB/BSE 基础）",
    officialUrl: "https://www.cs.princeton.edu/ugrad/undergraduate-degrees-requirements",
    summary: "COS 126, 217, and 226 prepare students for foundations, four core categories, electives, and independent work.",
    summaryZh: "COS 126、217、226 为基础，随后完成理论基础、四类核心课、选修课与独立研究。",
    phases: [
      semester(0, "Begin COS 126 and the required mathematics sequence.", "开始 COS 126 与必修数学序列。", ["princeton-cos126", "mit-18-01sc"]),
      semester(1, "Continue mathematics and prepare for the systems sequence.", "继续数学学习并准备系统课程。", ["mit-18-02sc"]),
      semester(2, "Take COS 217 and COS 226.", "学习 COS 217 与 COS 226。", ["princeton-cos217", "princeton-cos226"]),
      semester(3, "Build mathematical reasoning and begin departmental work.", "建立数学推理能力并开始专业课程。", ["mit-6-042j", "princeton-cos333"]),
      semester(4, "Choose one systems course and one AI/ML or applications course.", "系统方向任选一门，并从人工智能、机器学习或应用方向任选一门。", ["cornell-cs4410", "mit-6-824", "berkeley-cs188", "stanford-cs229", "mit-6-837"], 2),
      semester(5, "Choose two core-category or theory electives and begin independent work.", "从核心类别或理论选修中任选两门，并开始独立研究。", ["mit-6-046j", "berkeley-cs161", "mit-6-034", "cornell-cs4820"], 2),
      semester(6, "Choose two advanced electives alongside thesis or independent work.", "配合论文或独立研究任选两门高阶课。", ["stanford-cs229", "stanford-cs223a", "mit-6-858", "stanford-ee364a"], 2),
      semester(7, "Finish the thesis, independent work, and remaining electives.", "完成论文、独立研究与剩余选修。", []),
    ],
  },
];
