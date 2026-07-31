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
      { title: "Programming foundation", titleZh: "编程基础", description: "Start with Python and computational thinking.", descriptionZh: "从 Python 与计算思维开始。", courseIds: ["mit-6-100l", "mit-6-0002"] },
      { title: "Mathematics and algorithms", titleZh: "数学与算法", description: "Build discrete mathematics and algorithmic reasoning.", descriptionZh: "建立离散数学与算法思维。", courseIds: ["mit-6-042j", "mit-6-006", "mit-6-046j"] },
      { title: "Math option", titleZh: "数学方向课", description: "Study probability or linear algebra as required by the program.", descriptionZh: "按培养方案学习概率论或线性代数。", courseIds: ["mit-18-05", "mit-18-06"] },
      { title: "Advanced systems and electives", titleZh: "高阶系统与选修", description: "Continue into systems, security, graphics, AI, or another track.", descriptionZh: "继续学习系统、安全、图形学、人工智能或其他方向。", courseIds: ["mit-6-034", "mit-6-837", "mit-6-824", "mit-6-858"] },
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
      { title: "Programming sequence", titleZh: "编程序列", description: "Learn programming methodology, abstractions, and systems-level programming.", descriptionZh: "学习编程方法、编程抽象与系统级编程。", courseIds: ["stanford-cs106a", "stanford-cs106b", "stanford-cs107"] },
      { title: "Mathematical foundations", titleZh: "数学基础", description: "Build calculus, linear algebra, and probability foundations.", descriptionZh: "建立微积分、线性代数和概率基础。", courseIds: ["mit-18-01sc", "mit-18-02sc", "mit-18-06", "mit-18-05"] },
      { title: "Depth examples", titleZh: "深度方向示例", description: "Choose a pathway such as AI, robotics, or optimization.", descriptionZh: "选择人工智能、机器人或优化等深度方向。", courseIds: ["stanford-cs229", "stanford-cs223a", "stanford-ee364a", "stanford-ee364b"] },
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
      { title: "Math foundation", titleZh: "数学基础", description: "Complete calculus and linear algebra preparation.", descriptionZh: "完成微积分与线性代数准备。", courseIds: ["mit-18-01sc", "mit-18-02sc", "mit-18-06"] },
      { title: "Lower-division CS core", titleZh: "低年级计算机核心", description: "Progress through programming, data structures, and discrete math/probability.", descriptionZh: "依次学习编程、数据结构以及离散数学与概率。", courseIds: ["berkeley-cs61a", "berkeley-cs61b", "berkeley-cs70", "cornell-cs3410"] },
      { title: "Upper-division examples", titleZh: "高年级方向示例", description: "Explore security and artificial intelligence after the core.", descriptionZh: "完成核心课程后探索安全与人工智能。", courseIds: ["berkeley-cs161", "berkeley-cs188"] },
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
      { title: "Prerequisite sequence", titleZh: "先修序列", description: "Complete introductory programming, systems programming, and data structures.", descriptionZh: "完成编程导论、系统编程与数据结构。", courseIds: ["princeton-cos126", "princeton-cos217", "princeton-cos226"] },
      { title: "Departmental depth", titleZh: "专业深化", description: "Continue into advanced programming and core-category electives.", descriptionZh: "继续学习高阶编程和各核心类别选修课。", courseIds: ["princeton-cos333", "berkeley-cs188", "cornell-cs4410"] },
      { title: "Independent work", titleZh: "独立研究", description: "Finish with supervised independent work or a thesis according to the degree track.", descriptionZh: "根据学位类型完成导师指导的独立研究或毕业论文。", courseIds: [] },
    ],
  },
];
