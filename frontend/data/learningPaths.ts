export type LearningPathPhase = {
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  courseIds: string[];
  chooseCount: number | null;
  requirements: string[];
  requirementsZh: string[];
};

export type LearningPath = {
  id: string;
  university: string;
  program: string;
  programZh: string;
  officialUrl: string;
  summary: string;
  summaryZh: string;
  scheduleStatus: "prerequisite-inferred";
  calendar: "semester" | "quarter";
  phases: LearningPathPhase[];
};

function term(
  title: string,
  titleZh: string,
  description: string,
  descriptionZh: string,
  courseIds: string[],
  requirements: string[] = [],
  requirementsZh: string[] = [],
  chooseCount: number | null = null,
): LearningPathPhase {
  return { title, titleZh, description, descriptionZh, courseIds, chooseCount, requirements, requirementsZh };
}

export const learningPaths: LearningPath[] = [
  {
    id: "mit-6-3",
    university: "MIT",
    program: "Computer Science and Engineering (6-3)",
    programZh: "计算机科学与工程（6-3）",
    officialUrl: "https://catalog.mit.edu/degree-charts/computer-science-engineering-course-6-3/",
    summary: "All listed requirements come from MIT's Course 6-3 degree chart and GIR rules. Term placement is an OpenStudy suggestion derived from prerequisites, not an official MIT eight-term plan.",
    summaryZh: "课程要求来自 MIT 6-3 官方学位表和全校 GIR；学期位置由 OpenStudy 根据先修关系推导，并非 MIT 官方八学期课表。",
    scheduleStatus: "prerequisite-inferred",
    calendar: "semester",
    phases: [
      term("Year 1 · Fall", "大一上", "Start the calculus, physics, and programming chains.", "开始微积分、物理与编程序列。", ["mit-18-01sc", "mit-8-01sc", "mit-6-100l"]),
      term("Year 1 · Spring", "大一下", "Continue calculus, physics, and programming.", "继续微积分、物理与编程基础。", ["mit-18-02sc", "mit-8-02", "mit-6-0002"]),
      term("Year 2 · Fall", "大二上", "Build mathematical reasoning, programming, low-level, and chemistry foundations.", "建立离散数学、软件构造、底层编程与化学基础。", ["mit-6-042j", "stanford-cs106b", "cornell-cs3410", "mit-5-111sc"]),
      term("Year 2 · Spring", "大二下", "Take algorithms, biology, and one approved mathematics option: probability/statistics or linear algebra.", "学习算法与生物，并在概率统计和线性代数中完成一门获批数学选项。", ["mit-6-006", "mit-7-012", "mit-18-05", "mit-18-06"]),
      term("Year 3 · Fall", "大三上", "Move into systems and an advanced theory option.", "进入系统课程及高阶理论选项。", ["cornell-cs4410", "mit-6-046j"], ["Computer-science track subject"], ["计算机科学方向课"]),
      term("Year 3 · Spring", "大三下", "Begin the selected track and advanced undergraduate work.", "开始方向课程和高阶本科课程。", ["mit-6-034", "mit-6-837", "mit-6-858"], ["Advanced undergraduate / CI-M subject"], ["高阶本科 / CI-M 课程"], 1),
      term("Year 4 · Fall", "大四上", "Continue approved track electives and complete independent inquiry.", "继续批准的方向选修，并完成独立研究要求。", ["mit-6-824", "stanford-cs229", "stanford-ee364a"], ["Independent-inquiry subject"], ["独立研究课程"], 1),
      term("Year 4 · Spring", "大四下", "Finish the remaining track and advanced-subject requirements.", "完成剩余方向与高阶课程要求。", ["mit-6-824", "mit-6-858", "mit-6-837"], ["Remaining track subject"], ["剩余方向课程"], 1),
    ],
  },
  {
    id: "stanford-cs",
    university: "Stanford University",
    program: "Bachelor of Science in Computer Science",
    programZh: "计算机科学理学学士",
    officialUrl: "https://bulletin.stanford.edu/programs/CS-BS",
    summary: "Requirements follow Stanford's current bulletin. Stanford uses quarters, so this suggested sequence has twelve quarters rather than eight semesters.",
    summaryZh: "要求来自 Stanford 当前官方 Bulletin。Stanford 采用学季制，因此建议路线按十二个学季展示，而不是八学期。",
    scheduleStatus: "prerequisite-inferred",
    calendar: "quarter",
    phases: [
      term("Year 1 · Fall", "大一秋季", "Begin programming and calculus.", "开始编程与微积分。", ["stanford-cs106a", "mit-18-01sc"]),
      term("Year 1 · Winter", "大一冬季", "Continue programming and calculus.", "继续编程与微积分。", ["stanford-cs106b", "mit-18-02sc"]),
      term("Year 1 · Spring", "大一春季", "Start mathematical foundations and the required science sequence.", "开始数学基础与必修科学序列。", ["stanford-cs103", "mit-8-01sc"]),
      term("Year 2 · Fall", "大二秋季", "Take systems programming and probability.", "学习系统编程与概率论。", ["stanford-cs107", "stanford-cs109"]),
      term("Year 2 · Winter", "大二冬季", "Continue the systems core, engineering fundamentals, and science sequence.", "继续系统核心、工程基础与科学序列。", ["stanford-cs111", "cornell-cs3410", "mit-8-02"]),
      term("Year 2 · Spring", "大二春季", "Complete algorithms plus approved mathematics and science electives before depth work.", "在进入深度方向前完成算法，以及获批的数学和科学选修。", ["stanford-cs161", "mit-18-06", "mit-5-111sc", "mit-7-012"]),
      term("Year 3 · Fall", "大三秋季", "Begin one approved CS depth pathway.", "开始一个获批的 CS 深度方向。", ["stanford-cs229", "stanford-cs223a", "mit-6-034"], [], [], 1),
      term("Year 3 · Winter", "大三冬季", "Continue depth and breadth courses.", "继续深度与广度课程。", ["stanford-ee364a", "mit-6-837", "berkeley-cs161"], [], [], 1),
      term("Year 3 · Spring", "大三春季", "Continue the selected depth pathway.", "继续所选深度方向。", ["stanford-ee364b", "mit-6-824", "mit-6-858"], [], [], 1),
      term("Year 4 · Fall", "大四秋季", "Complete depth electives and begin the capstone.", "完成深度选修并开始毕业项目。", [], ["Approved depth elective", "Senior project / capstone"], ["批准的深度选修", "高年级项目 / 毕业项目"]),
      term("Year 4 · Winter", "大四冬季", "Continue the capstone and remaining technical depth work.", "继续毕业项目及剩余技术深度课程。", [], ["Remaining depth course"], ["剩余深度课程"]),
      term("Year 4 · Spring", "大四春季", "Finish remaining depth and capstone units.", "完成剩余深度与毕业项目学分。", [], ["Remaining depth / capstone units"], ["剩余深度 / 毕业项目学分"]),
    ],
  },
  {
    id: "berkeley-cs",
    university: "UC Berkeley",
    program: "Computer Science Major",
    programZh: "计算机科学本科专业",
    officialUrl: "https://eecs.berkeley.edu/resources/undergrads/cs/degree-reqs-lowerdiv/",
    summary: "Lower-division requirements follow Berkeley EECS: Math 51, Math 52, linear algebra, CS 61A, 61B/BL, 61C, and CS 70. Placement is inferred from that prerequisite sequence.",
    summaryZh: "低年级要求按 Berkeley EECS 官网：Math 51、Math 52、线性代数、CS 61A、61B/BL、61C 与 CS 70；具体学期由先修链推导。",
    scheduleStatus: "prerequisite-inferred",
    calendar: "semester",
    phases: [
      term("Year 1 · Fall", "大一上", "Begin calculus and programming.", "开始微积分与编程。", ["mit-18-01sc", "berkeley-cs61a"]),
      term("Year 1 · Spring", "大一下", "Continue calculus and data structures.", "继续微积分并学习数据结构。", ["mit-18-02sc", "berkeley-cs61b"]),
      term("Year 2 · Fall", "大二上", "Complete linear algebra and machine structures.", "完成线性代数与机器结构。", ["mit-18-06", "berkeley-cs61c"]),
      term("Year 2 · Spring", "大二下", "Complete the lower-division discrete mathematics and probability requirement.", "完成低年级离散数学与概率要求。", ["berkeley-cs70"]),
      term("Year 3 · Fall", "大三上", "Start approved upper-division CS breadth and design work.", "开始获批的高年级 CS 广度与设计课程。", ["berkeley-cs161", "berkeley-cs188"], [], [], 1),
      term("Year 3 · Spring", "大三下", "Continue upper-division technical electives.", "继续高年级技术选修。", ["stanford-cs229", "mit-6-837", "mit-6-824"], [], [], 2),
      term("Year 4 · Fall", "大四上", "Choose advanced electives while satisfying official breadth rules.", "在满足官方广度规则的前提下选择高阶课程。", ["mit-6-858", "mit-6-824", "stanford-ee364a"], ["Upper-division CS elective"], ["高年级 CS 选修"], 1),
      term("Year 4 · Spring", "大四下", "Finish the remaining upper-division CS requirements.", "完成剩余高年级 CS 要求。", ["mit-6-837", "berkeley-cs188", "berkeley-cs161"], [], [], 1),
    ],
  },
  {
    id: "princeton-cos",
    university: "Princeton University",
    program: "Computer Science (AB/BSE)",
    programZh: "计算机科学（AB/BSE）",
    officialUrl: "https://www.cs.princeton.edu/ugrad/undergraduate-degrees-requirements",
    summary: "The department requirements are shared where possible; AB and BSE general education and independent-work differences are explicitly retained. Term placement is inferred from prerequisites and official completion deadlines.",
    summaryZh: "路线合并展示 AB/BSE 共有专业要求，并明确保留两种学位在通识和独立研究上的差异；学期位置由先修关系和官方完成期限推导。",
    scheduleStatus: "prerequisite-inferred",
    calendar: "semester",
    phases: [
      term("Year 1 · Fall", "大一上", "Begin the introductory COS, mathematics, and BSE science sequence.", "开始 COS 入门、数学及 BSE 科学序列。", ["princeton-cos126", "mit-18-01sc", "mit-8-01sc"]),
      term("Year 1 · Spring", "大一下", "Continue mathematics, systems programming, and BSE science.", "继续数学、系统编程及 BSE 科学课程。", ["princeton-cos217", "mit-18-02sc", "mit-8-02"]),
      term("Year 2 · Fall", "大二上", "Complete algorithms/data structures and the applicable mathematics prerequisite.", "完成算法与数据结构，以及适用的数学先修要求。", ["princeton-cos226", "mit-18-06"]),
      term("Year 2 · Spring", "大二下", "Begin the required theory foundation; BSE students also continue science and engineering foundations.", "开始必修理论基础；BSE 学生同时继续科学与工程基础。", ["princeton-cos240", "mit-5-111sc", "cornell-cs3410"]),
      term("Year 3 · Fall", "大三上", "Take two of the four distinct official core categories.", "修读四个官方核心类别中的两类。", ["cornell-cs4410", "berkeley-cs188", "mit-6-046j", "princeton-cos333"], ["AB/BSE independent work as applicable"], ["适用的 AB/BSE 独立研究"], 2),
      term("Year 3 · Spring", "大三下", "Complete the other two core categories; COS 240 must be finished by the end of junior year.", "完成另外两个核心类别；COS 240 最迟须在大三结束前完成。", ["cornell-cs4410", "berkeley-cs188", "mit-6-046j", "princeton-cos333"], ["AB/BSE independent work as applicable"], ["适用的 AB/BSE 独立研究"], 2),
      term("Year 4 · Fall", "大四上", "Complete eligible 300-level-or-higher electives and degree-specific independent work.", "完成符合规定的 300 级以上选修及对应学位的独立研究。", ["stanford-cs229", "berkeley-cs161", "mit-6-824", "mit-6-858", "stanford-ee364a"], ["AB senior thesis or BSE independent work"], ["AB 毕业论文或 BSE 独立研究"], 2),
      term("Year 4 · Spring", "大四下", "Finish the third elective and remaining AB/BSE requirements.", "完成第三门选修及剩余 AB/BSE 要求。", ["stanford-cs229", "berkeley-cs161", "mit-6-824", "mit-6-858", "stanford-ee364a"], ["AB senior thesis continuation or remaining BSE requirement"], ["AB 毕业论文续修或剩余 BSE 要求"], 1),
    ],
  },
];
