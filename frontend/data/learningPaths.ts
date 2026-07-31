export type LearningPathPhase = {
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  courseIds: string[];
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

function semester(index: number, description: string, descriptionZh: string, courseIds: string[]): LearningPathPhase {
  return {
    title: semesterNames[index][0],
    titleZh: semesterNames[index][1],
    description,
    descriptionZh,
    courseIds,
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
      semester(2, "Start algorithms and complete a mathematics option.", "开始算法，并完成一门数学方向课。", ["mit-6-006", "mit-18-06", "mit-18-05"]),
      semester(3, "Advance into algorithm design and computer systems.", "进入算法设计与计算机系统。", ["mit-6-046j", "cornell-cs3410"]),
      semester(4, "Explore artificial intelligence and graphics.", "探索人工智能与计算机图形学。", ["mit-6-034", "mit-6-837"]),
      semester(5, "Take advanced systems and security electives.", "学习高阶系统与安全选修。", ["mit-6-824", "mit-6-858"]),
      semester(6, "Deepen a chosen track and begin independent inquiry.", "深化所选方向并开始独立研究。", ["stanford-cs229"]),
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
      semester(4, "Begin an artificial-intelligence or robotics depth path.", "开始人工智能或机器人深度方向。", ["stanford-cs229", "stanford-cs223a"]),
      semester(5, "Add optimization and a depth elective.", "学习优化并增加一门深度选修。", ["stanford-ee364a"]),
      semester(6, "Continue advanced depth work.", "继续高阶深度学习。", ["stanford-ee364b"]),
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
      semester(4, "Begin upper-division breadth with security.", "以计算机安全开始高年级广度课程。", ["berkeley-cs161"]),
      semester(5, "Continue upper-division breadth with artificial intelligence.", "继续学习人工智能高年级广度课程。", ["berkeley-cs188"]),
      semester(6, "Choose advanced electives and begin a project.", "选择高阶选修并开始项目。", ["stanford-cs229"]),
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
      semester(4, "Take systems and AI/ML core-category courses.", "学习系统与人工智能/机器学习核心类别课程。", ["cornell-cs4410", "berkeley-cs188"]),
      semester(5, "Continue core categories and begin independent work.", "继续核心类别课程并开始独立研究。", ["mit-6-046j"]),
      semester(6, "Complete advanced electives and thesis or independent work.", "完成高阶选修及论文或独立研究。", ["stanford-cs229"]),
      semester(7, "Finish the thesis, independent work, and remaining electives.", "完成论文、独立研究与剩余选修。", []),
    ],
  },
];
