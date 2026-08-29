export type LearningPathPhase = {
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  courseIds: string[];
  chooseCount: number | null;
  requirements: string[];
  requirementsZh: string[];
  choiceGroups: LearningPathChoiceGroup[];
};

export type LearningPathChoiceGroup = {
  label: string;
  labelZh: string;
  courseIds: string[];
  chooseCount: number;
};

export type LearningPath = {
  id: string;
  university: string;
  program: string;
  programZh: string;
  officialUrl: string;
  sourceEdition: string;
  sourceEditionZh: string;
  verifiedOn: string;
  additionalOfficialSources?: { title: string; titleZh: string; url: string }[];
  summary: string;
  summaryZh: string;
  officialRequirementNotes: string[];
  officialRequirementNotesZh: string[];
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
  return { title, titleZh, description, descriptionZh, courseIds, chooseCount, requirements, requirementsZh, choiceGroups: [] };
}

function withChoices(phase: LearningPathPhase, ...choiceGroups: LearningPathChoiceGroup[]): LearningPathPhase {
  return { ...phase, choiceGroups };
}

export const learningPaths: LearningPath[] = [
  {
    id: "mit-6-3",
    university: "MIT",
    program: "Computer Science and Engineering (6-3)",
    programZh: "计算机科学与工程（6-3）",
    officialUrl: "https://catalog.mit.edu/degree-charts/computer-science-engineering-course-6-3/",
    sourceEdition: "Current MIT catalog",
    sourceEditionZh: "MIT 当前目录",
    verifiedOn: "2026-08-04",
    summary: "All listed requirements come from MIT's Course 6-3 degree chart and GIR rules. Term placement is an OpenStudy suggestion derived from prerequisites, not an official MIT eight-term plan.",
    summaryZh: "课程要求来自 MIT 6-3 官方学位表和全校 GIR；学期位置由 OpenStudy 根据先修关系推导，并非 MIT 官方八学期课表。",
    officialRequirementNotes: ["Current required CS foundation covers programming, software construction, mathematics for CS, algorithms, theory, systems, low-level programming, and computation structures.", "Choose one approved mathematics subject in probability, inference, linear algebra, or linear algebra and optimization.", "Advanced work includes four track subjects, one additional approved subject, at least two advanced undergraduate subjects, and one independent-inquiry subject."],
    officialRequirementNotesZh: ["当前计算机基础要求涵盖编程、软件构造、计算机数学、算法、理论、系统、底层编程和计算结构。", "概率、推断、线性代数或线性代数与优化中选一门获批数学课程。", "高阶要求包括四门方向课程、一门额外获批课程，且至少两门为本科高阶课程、一门满足独立研究要求。"],
    scheduleStatus: "prerequisite-inferred",
    calendar: "semester",
    phases: [
      term("Year 1 · Fall", "大一上", "Start the calculus, physics, and programming chains.", "开始微积分、物理与编程序列。", ["mit-18-01sc", "mit-8-01sc", "mit-6-100l"]),
      term("Year 1 · Spring", "大一下", "Continue calculus, physics, and programming.", "继续微积分、物理与编程基础。", ["mit-18-02sc", "mit-8-02", "mit-6-0002"]),
      term("Year 2 · Fall", "大二上", "Build mathematical reasoning, software-construction, computation-structure, and chemistry foundations.", "建立离散数学、软件构造、计算结构与化学基础。", ["mit-6-042j", "mit-6-031", "mit-6-004", "mit-5-111sc"]),
      withChoices(term("Year 2 · Spring", "大二下", "Take algorithms, biology, and one approved mathematics option: probability/statistics or linear algebra.", "学习算法与生物，并在概率统计和线性代数中完成一门获批数学选项。", ["mit-6-006", "mit-7-012"]), { label: "Approved mathematics option", labelZh: "获批数学选项", courseIds: ["mit-18-05", "mit-18-06"], chooseCount: 1 }),
      term("Year 3 · Fall", "大三上", "Move into operating systems, computer-system engineering, and advanced theory.", "进入操作系统、计算机系统工程与高阶理论。", ["mit-6-s081", "mit-6-033", "mit-6-046j"]),
      term("Year 3 · Spring", "大三下", "Begin a selected track through advanced systems, databases, AI, graphics, security, or performance engineering.", "通过高级系统、数据库、人工智能、图形学、安全或性能工程开始所选方向。", ["mit-6-172", "mit-6-830", "mit-6-034", "mit-6-837", "mit-6-858"], [], [], 2),
      term("Year 4 · Fall", "大四上", "Continue approved track electives and complete independent inquiry.", "继续批准的方向选修，并完成独立研究要求。", ["mit-6-824", "mit-6-172", "mit-6-830", "mit-6-036", "mit-6-253"], ["Independent-inquiry subject"], ["独立研究课程"], 2),
      term("Year 4 · Spring", "大四下", "Finish the remaining track and advanced-subject requirements.", "完成剩余方向与高阶课程要求。", ["mit-6-824", "mit-6-858", "mit-6-837", "mit-6-172", "mit-6-830"], [], [], 1),
    ],
  },
  {
    id: "stanford-cs",
    university: "Stanford University",
    program: "Bachelor of Science in Computer Science",
    programZh: "计算机科学理学学士",
    officialUrl: "https://bulletin.stanford.edu/programs/CS-BS",
    sourceEdition: "Current Stanford Bulletin",
    sourceEditionZh: "Stanford 当前课程公报",
    verifiedOn: "2026-08-04",
    summary: "Requirements follow Stanford's current bulletin. Stanford uses quarters, so this suggested sequence has twelve quarters rather than eight semesters.",
    summaryZh: "要求来自 Stanford 当前官方 Bulletin。Stanford 采用学季制，因此建议路线按十二个学季展示，而不是八学期。",
    officialRequirementNotes: ["The CS BS requires mathematics, an approved science sequence and elective, engineering fundamentals, core CS, a depth track, writing in the major, and a capstone.", "The twelve-quarter placement below is an OpenStudy prerequisite-based example, not a Stanford-prescribed quarter-by-quarter plan.", "When a suitable Stanford course does not have verified public materials, senior-year external courses are clearly marked self-study substitutes and do not imply Stanford credit or degree approval."],
    officialRequirementNotesZh: ["CS 本科要求包括数学、获批科学序列及科学选修、工程基础、CS 核心、深度方向、专业写作和毕业项目。", "下方十二学季仅为 OpenStudy 按先修关系生成的示例，并非 Stanford 规定的逐学季课表。", "当 Stanford 对应课程没有已核实的公开资料时，大四所列外校课程会明确作为自学替代，不代表 Stanford 学分或学位审核认可。"],
    scheduleStatus: "prerequisite-inferred",
    calendar: "quarter",
    phases: [
      term("Year 1 · Fall", "大一秋季", "Begin programming and calculus.", "开始编程与微积分。", ["stanford-cs106a", "mit-18-01sc"]),
      term("Year 1 · Winter", "大一冬季", "Continue programming and calculus.", "继续编程与微积分。", ["stanford-cs106b", "mit-18-02sc"]),
      term("Year 1 · Spring", "大一春季", "Start mathematical foundations and the required science sequence.", "开始数学基础与必修科学序列。", ["stanford-cs103", "mit-8-01sc"]),
      term("Year 2 · Fall", "大二秋季", "Take systems programming and probability.", "学习系统编程与概率论。", ["stanford-cs107", "stanford-cs109"]),
      term("Year 2 · Winter", "大二冬季", "Continue the systems core and science sequence while completing an approved engineering-fundamentals subject.", "继续系统核心与科学序列，并完成一门获批工程基础课程。", ["stanford-cs111", "mit-8-02"], ["Approved engineering-fundamentals subject"], ["获批工程基础课程"]),
      withChoices(term("Year 2 · Spring", "大二春季", "Complete algorithms plus approved mathematics and science electives before depth work.", "在进入深度方向前完成算法，以及获批的数学和科学选修。", ["stanford-cs161", "mit-18-06"]), { label: "Example approved science elective", labelZh: "获批科学选修示例", courseIds: ["mit-5-111sc", "mit-7-012"], chooseCount: 1 }),
      term("Year 3 · Fall", "大三秋季", "Begin one approved CS depth pathway using Stanford courses where public materials are available.", "使用具有公开资料的 Stanford 本校课程开始一个获批的 CS 深度方向。", ["stanford-cs229", "stanford-cs223a", "stanford-cs144", "stanford-cs221"], [], [], 1),
      term("Year 3 · Winter", "大三冬季", "Continue depth with compilers, graphics, optimization, or another approved course.", "通过编译器、图形学、优化或其他获批课程继续深度方向。", ["stanford-cs143", "stanford-cs148", "stanford-ee364a"], [], [], 1),
      term("Year 3 · Spring", "大三春季", "Continue the selected depth pathway.", "继续所选深度方向。", ["stanford-ee364b", "stanford-cs244b", "stanford-cs155"], [], [], 1),
      term("Year 4 · Fall", "大四秋季", "Complete depth electives and begin the capstone.", "完成深度选修并开始毕业项目。", ["stanford-cs144", "stanford-cs143", "stanford-cs148", "stanford-cs155", "stanford-ee364b"], ["Senior project / capstone"], ["高年级项目 / 毕业项目"], 1),
      term("Year 4 · Winter", "大四冬季", "Choose two advanced systems courses from verified public offerings at other universities while continuing the Stanford capstone. These are self-study substitutes, not Stanford credit equivalents.", "继续 Stanford 毕业项目，同时从其他大学已核实的公开课中任选两门高级系统课程。这些仅为自学替代，不代表 Stanford 学分。", ["mit-6-824", "mit-6-858", "berkeley-cs162", "berkeley-cs186", "cmu-15-418", "mit-6-830"], ["Continue the Stanford senior project / capstone"], ["继续 Stanford 高年级项目 / 毕业项目"], 2),
      term("Year 4 · Spring", "大四春季", "Choose two advanced AI, graphics, networking, or machine-learning-systems courses from verified public offerings and finish the capstone. These are optional self-study substitutes.", "从已核实的公开课中任选两门人工智能、图形学、网络或机器学习系统深度课程，并完成毕业项目；这些是可自由选择的外校自学替代。", ["cornell-cs6787", "berkeley-cs189", "mit-6-837", "princeton-cos461", "mit-6-036", "stanford-cs244b"], ["Finish the Stanford senior project / capstone"], ["完成 Stanford 高年级项目 / 毕业项目"], 2),
    ],
  },
  {
    id: "berkeley-cs",
    university: "UC Berkeley",
    program: "Computer Science Major",
    programZh: "计算机科学本科专业",
    officialUrl: "https://eecs.berkeley.edu/resources/undergrads/cs/degree-reqs-lowerdiv/",
    sourceEdition: "Current Berkeley EECS requirements",
    sourceEditionZh: "Berkeley EECS 当前要求",
    verifiedOn: "2026-08-22",
    additionalOfficialSources: [{ title: "Upper-division requirements", titleZh: "高年级要求", url: "https://eecs.berkeley.edu/resources/undergrads/cs/degree-reqs-upperdiv/" }],
    summary: "Lower-division requirements follow Berkeley EECS: Math 51, Math 52, linear algebra, CS 61A, 61B/BL, 61C, and CS 70. MIT open calculus courses stand in for Math 51 and 52 because Berkeley currently publishes catalog descriptions rather than complete public self-study materials.",
    summaryZh: "低年级要求按 Berkeley EECS 官网：Math 51、Math 52、线性代数、CS 61A、61B/BL、61C 与 CS 70。由于 Berkeley 目前只公开 Math 51 与 52 的目录说明、没有完整自学资料，此处采用 MIT 公开微积分课程替代。",
    officialRequirementNotes: ["Lower-division work includes the published mathematics sequence plus CS 61A, 61B/61BL, 61C, and CS 70.", "The current upper-division rule is 20 units: 4 units from the published design-course list, 8 units of upper-division CS, and 8 units of upper-division CS/EE/EECS, plus 4 units of upper-division technical electives. For Fall 2022 or later admits, that technical elective must be approved non-CS or EE/EECS.", "Courses shown below are self-study choices arranged by prerequisites; they are not all mandatory and do not reproduce Berkeley enrollment or unit rules."],
    officialRequirementNotesZh: ["低年级包括官网列出的数学序列，以及 CS 61A、61B/61BL、61C 和 CS 70。", "当前高年级规则为 20 学分：官方设计课清单中 4 学分、高年级 CS 8 学分、高年级 CS/EE/EECS 8 学分；另加 4 学分高年级技术选修。2022 秋季及以后入学者的该技术选修必须为获批的非 CS 或 EE/EECS 课程。", "下方课程仅按先修关系组织为自学选项，并非全部必修，也不等同于 Berkeley 的选课或学分规则。"],
    scheduleStatus: "prerequisite-inferred",
    calendar: "semester",
    phases: [
      term("Year 1 · Fall", "大一上", "Begin Berkeley's Math 51 and programming sequence; MIT 18.01SC supplies the complete open calculus materials.", "开始 Berkeley Math 51 与编程序列；微积分的完整公开资料采用 MIT 18.01SC。", ["mit-18-01sc", "berkeley-cs61a"]),
      term("Year 1 · Spring", "大一下", "Continue Berkeley's Math 52 and data-structures sequence; MIT 18.02SC supplies the complete open calculus materials.", "继续 Berkeley Math 52 与数据结构序列；微积分的完整公开资料采用 MIT 18.02SC。", ["mit-18-02sc", "berkeley-cs61b"]),
      term("Year 2 · Fall", "大二上", "Complete Berkeley's linear algebra requirement and machine structures.", "完成 Berkeley 本校线性代数要求与机器结构。", ["berkeley-math54", "berkeley-cs61c"]),
      term("Year 2 · Spring", "大二下", "Complete the lower-division discrete mathematics and probability requirement.", "完成低年级离散数学与概率要求。", ["berkeley-cs70"]),
      term("Year 3 · Fall", "大三上", "Start approved upper-division systems, algorithms, security, or AI work.", "开始获批的高年级系统、算法、安全或人工智能课程。", ["berkeley-cs162", "berkeley-cs170", "berkeley-cs161", "berkeley-cs188"], [], [], 2),
      term("Year 3 · Spring", "大三下", "Continue with Berkeley databases, machine learning, graphics, and approved technical electives.", "继续 Berkeley 数据库、机器学习、图形学及获批技术选修。", ["berkeley-cs186", "berkeley-cs189", "berkeley-cs184"], [], [], 2),
      term("Year 4 · Fall", "大四上", "Choose advanced electives while satisfying official breadth rules.", "在满足官方广度规则的前提下选择高阶课程。", ["berkeley-cs162", "berkeley-cs170", "berkeley-cs186", "berkeley-cs184", "berkeley-cs189"], [], [], 1),
      term("Year 4 · Spring", "大四下", "Finish the remaining upper-division CS requirements.", "完成剩余高年级 CS 要求。", ["berkeley-cs184", "berkeley-cs188", "berkeley-cs161"], [], [], 1),
    ],
  },
  {
    id: "princeton-cos",
    university: "Princeton University",
    program: "Computer Science (AB/BSE)",
    programZh: "计算机科学（AB/BSE）",
    officialUrl: "https://www.cs.princeton.edu/ugrad/undergraduate-degrees-requirements",
    sourceEdition: "Current Princeton CS requirements",
    sourceEditionZh: "Princeton CS 当前要求",
    verifiedOn: "2026-08-04",
    summary: "The department requirements are shared where possible; AB and BSE general education and independent-work differences are explicitly retained. Term placement is inferred from prerequisites and official completion deadlines.",
    summaryZh: "路线合并展示 AB/BSE 共有专业要求，并明确保留两种学位在通识和独立研究上的差异；学期位置由先修关系和官方完成期限推导。",
    officialRequirementNotes: ["Foundation and core courses must be taken at Princeton; linked external open courses are self-study equivalents, not Princeton degree credit.", "AB and BSE share departmental foundations but have different general-education and independent-work requirements.", "Students complete the official core categories and eligible 300-level-or-higher electives under the rules for their graduating class."],
    officialRequirementNotesZh: ["官方规定基础与核心课程必须在 Princeton 修读；链接的外校公开课仅供自学等价参考，不代表 Princeton 学分。", "AB 与 BSE 共享院系基础要求，但通识教育和独立研究要求不同。", "学生须按所属毕业年级规则完成官方核心类别及符合条件的 300 级以上选修。"],
    scheduleStatus: "prerequisite-inferred",
    calendar: "semester",
    phases: [
      term("Year 1 · Fall", "大一上", "Begin Princeton's BSE mathematics, physics, chemistry, and introductory COS sequence. MIT's open mechanics and chemistry courses stand in for Princeton PHY 103 and CHM 201, whose public pages do not expose complete self-study materials.", "开始 Princeton BSE 的数学、物理、化学及 COS 入门序列。由于 Princeton PHY 103 与 CHM 201 的公开页面没有完整自学资料，此处分别采用 MIT 的公开力学与化学课程。", ["princeton-mat103", "mit-8-01sc", "mit-5-111sc", "princeton-cos126"]),
      term("Year 1 · Spring", "大一下", "Continue calculus and systems programming. MIT's open electricity-and-magnetism course stands in for Princeton PHY 104, whose complete materials are not public.", "继续微积分与系统编程。由于 Princeton PHY 104 没有公开完整资料，此处采用 MIT 的公开电磁学课程。", ["princeton-mat104", "mit-8-02", "princeton-cos217"]),
      term("Year 2 · Fall", "大二上", "Complete algorithms/data structures and linear algebra.", "完成算法与数据结构以及线性代数。", ["princeton-cos226", "princeton-mat202"]),
      term("Year 2 · Spring", "大二下", "Complete multivariable calculus and the required theory foundation; BSE students also continue engineering foundations.", "完成多元微积分和必修理论基础；BSE 学生同时继续工程基础。", ["princeton-cos240", "princeton-mat201"], ["BSE engineering requirement"], ["BSE 工程课程要求"]),
      term("Year 3 · Fall", "大三上", "Take two of the four distinct official core categories.", "修读四个官方核心类别中的两类。", ["princeton-cos316", "princeton-cos324", "princeton-cos423", "princeton-cos333"], ["AB/BSE independent work as applicable"], ["适用的 AB/BSE 独立研究"], 2),
      term("Year 3 · Spring", "大三下", "Complete the other two core categories; COS 240 must be finished by the end of junior year.", "完成另外两个核心类别；COS 240 最迟须在大三结束前完成。", ["princeton-cos316", "princeton-cos324", "princeton-cos423", "princeton-cos333"], ["AB/BSE independent work as applicable"], ["适用的 AB/BSE 独立研究"], 2),
      term("Year 4 · Fall", "大四上", "Complete eligible 300-level-or-higher electives and degree-specific independent work.", "完成符合规定的 300 级以上选修及对应学位的独立研究。", ["princeton-cos418", "princeton-cos432", "princeton-cos461", "princeton-cos324", "princeton-cos423"], ["AB senior thesis or BSE independent work"], ["AB 毕业论文或 BSE 独立研究"], 2),
      term("Year 4 · Spring", "大四下", "Finish the third elective and remaining AB/BSE requirements.", "完成第三门选修及剩余 AB/BSE 要求。", ["princeton-cos418", "princeton-cos432", "princeton-cos461", "princeton-cos333"], ["AB senior thesis continuation or remaining BSE requirement"], ["AB 毕业论文续修或剩余 BSE 要求"], 1),
    ],
  },
  {
    id: "cmu-cs",
    university: "Carnegie Mellon University",
    program: "Bachelor of Science in Computer Science",
    programZh: "计算机科学理学学士",
    officialUrl: "https://csd.cmu.edu/academics/bachelors/overview",
    sourceEdition: "Current CMU CS requirements",
    sourceEditionZh: "CMU CS 当前要求",
    verifiedOn: "2026-08-22",
    summary: "The categories follow CMU Computer Science Department's current undergraduate curriculum. Public courses from other universities are linked only as self-study substitutes; the eight-term placement is inferred from prerequisites.",
    summaryZh: "课程类别依据 CMU 计算机科学系当前本科培养要求。外校公开课只作为自学替代资源；八学期位置由先修关系推导。",
    officialRequirementNotes: ["The curriculum combines a CS core, mathematics and probability, science and engineering, humanities and arts, and a required concentration or minor.", "The CS core spans introductory programming, data structures, computer systems, theoretical foundations, algorithms, and required core electives.", "OpenStudy omits humanities and arts from this technical self-study route; students seeking a CMU degree must still satisfy them."],
    officialRequirementNotesZh: ["培养方案包括计算机核心、数学与概率、科学与工程、人文艺术，以及一个必修的专修方向或辅修。", "计算机核心覆盖编程入门、数据结构、计算机系统、理论基础、算法及核心选修。", "本技术自学路线按产品范围省略人文艺术；攻读 CMU 学位的学生仍须完成这些要求。"],
    scheduleStatus: "prerequisite-inferred",
    calendar: "semester",
    phases: [
      term("Year 1 · Fall", "大一上", "For learners without AP credit, begin with CMU's introductory programming and first calculus course plus laboratory science.", "面向没有 AP 学分的学习者，从 CMU 编程入门、第一门微积分和实验科学开始。", ["cmu-15-112", "cmu-21-120", "mit-8-01sc"]),
      term("Year 1 · Spring", "大一下", "Complete imperative computation, mathematical foundations, and the second calculus course while continuing science.", "完成命令式计算、计算机数学基础和第二门微积分，同时继续科学课程。", ["cmu-15-122", "cmu-15-151", "cmu-21-122", "mit-8-02"]),
      term("Year 2 · Fall", "大二上", "Follow the CMU core with functional programming, computer systems, and linear algebra.", "继续 CMU 核心课程：函数式编程、计算机系统和线性代数。", ["cmu-15-150", "cmu-15-213", "cmu-21-241"]),
      term("Year 2 · Spring", "大二下", "Complete parallel algorithms, theoretical CS, vector calculus, and probability foundations. MIT 18.02SC is used as the open self-study substitute because CMU 21-266 currently publishes a description but not complete course materials.", "完成并行算法、理论计算机科学、向量微积分和概率基础。由于 CMU 21-266 目前只公开课程说明、没有完整资料，此处采用 MIT 18.02SC 作为公开自学替代课。", ["cmu-15-210", "cmu-15-251", "mit-18-02sc", "cmu-15-259"]),
      withChoices(term("Year 3 · Fall", "大三上", "Complete required algorithm design and choose an approved systems or languages elective.", "完成必修算法设计，并在系统或编程语言方向选修一门。", ["cmu-15-451"]), { label: "Approved systems or languages elective", labelZh: "获批系统或编程语言选修", courseIds: ["cmu-15-312", "cmu-15-440"], chooseCount: 1 }),
      term("Year 3 · Spring", "大三下", "Choose two native CMU electives and begin the concentration or minor.", "从 CMU 本校课程中任选两门，并开始专修方向或辅修。", ["cmu-15-445", "cmu-15-362", "cmu-15-281", "cmu-15-330"], ["Concentration or minor course"], ["专修方向或辅修课程"], 2),
      term("Year 4 · Fall", "大四上", "Complete advanced electives and concentration or minor work, using CMU's public parallel-computing course where possible.", "完成高阶选修与专修方向或辅修课程，并优先使用 CMU 本校公开的并行计算课程。", ["cmu-15-418", "stanford-cs221", "berkeley-cs189", "mit-6-858"], ["Concentration or minor course"], ["专修方向或辅修课程"], 2),
      term("Year 4 · Spring", "大四下", "Finish remaining CS electives and the concentration or minor.", "完成剩余计算机选修及专修方向或辅修。", ["mit-6-837", "stanford-cs155", "mit-6-830"], ["Remaining concentration or minor requirements"], ["剩余专修方向或辅修要求"], 1),
    ],
  },
  {
    id: "cornell-cs",
    university: "Cornell University",
    program: "Bachelor of Science in Computer Science",
    programZh: "计算机科学理学学士",
    officialUrl: "https://www.cs.cornell.edu/bachelor-science-computer-science",
    sourceEdition: "Current Cornell CS requirements",
    sourceEditionZh: "Cornell CS 当前要求",
    verifiedOn: "2026-08-22",
    summary: "The route follows Cornell's published BS structure and first-year guidance. Later-term placement is an OpenStudy prerequisite-based suggestion, with Cornell public courses used whenever available.",
    summaryZh: "路线依据 Cornell 公布的 BS 结构和大一选课指导；后续学期按先修关系推导，并尽量采用 Cornell 本校公开课程。",
    officialRequirementNotes: ["Cornell Engineering's first-year requirements include MATH 1910 and MATH 1920, while the CS BS requires MATH 2940 and CS 2800.", "The major includes a programming sequence, mathematical foundations, computer organization, algorithms, probability, core breadth, and technical electives.", "Humanities and college distribution requirements are omitted from this technical self-study view, but remain degree requirements."],
    officialRequirementNotesZh: ["Cornell 工学院大一要求包括 MATH 1910 与 MATH 1920，计算机科学 BS 另要求 MATH 2940 与 CS 2800。", "专业要求包括编程序列、数学基础、计算机组成、算法、概率、核心广度与技术选修。", "本技术自学视图省略人文及学院分布要求，但正式学位仍需完成。"],
    scheduleStatus: "prerequisite-inferred",
    calendar: "semester",
    phases: [
      term("Year 1 · Fall", "大一上", "Follow Cornell Engineering's first-year structure with introductory programming and Calculus for Engineers.", "按 Cornell 工学院大一结构学习编程入门与工程微积分。", ["cornell-cs1110", "cornell-math1910"]),
      term("Year 1 · Spring", "大一下", "Continue object-oriented programming/data structures and Multivariable Calculus for Engineers.", "继续面向对象编程与数据结构，并学习工程多元微积分。", ["cornell-cs2110", "cornell-math1920"]),
      term("Year 2 · Fall", "大二上", "Complete Cornell's mathematical foundations, computer organization, and required linear algebra.", "完成 Cornell 数学基础、计算机组成及必修线性代数。", ["cornell-cs2800", "cornell-cs3410", "cornell-math2940"]),
      term("Year 2 · Spring", "大二下", "Complete algorithms and probability before upper-level breadth.", "在高年级广度课前完成算法与概率。", ["cornell-cs4820", "mit-18-05"]),
      term("Year 3 · Fall", "大三上", "Begin upper-level systems and machine-learning breadth.", "开始高年级系统与机器学习广度课程。", ["cornell-cs4410", "cornell-cs3780"]),
      term("Year 3 · Spring", "大三下", "Choose approved technical electives across multiple CS areas.", "跨多个计算机领域选择获批技术选修。", ["cornell-cs3110", "berkeley-cs186", "stanford-cs144", "mit-6-858"], [], [], 2),
      term("Year 4 · Fall", "大四上", "Continue advanced technical electives and project work.", "继续高阶技术选修与项目课程。", ["cornell-cs6787", "mit-6-824", "stanford-cs155"], ["Project or practicum requirement"], ["项目或实践要求"], 2),
      term("Year 4 · Spring", "大四下", "Finish remaining technical electives and major requirements.", "完成剩余技术选修及专业要求。", ["berkeley-cs189", "princeton-cos461", "mit-6-830"], [], [], 1),
    ],
  },
  {
    id: "harvard-cs",
    university: "Harvard University",
    program: "Bachelor's Degree in Computer Science",
    programZh: "计算机科学本科专业",
    officialUrl: "https://seas.harvard.edu/computer-science/bachelors-degree-computer-science",
    sourceEdition: "Current Harvard CS requirements",
    sourceEditionZh: "Harvard CS 当前要求",
    verifiedOn: "2026-08-22",
    summary: "This route maps Harvard's published CS concentration categories to verified public materials. Harvard does not prescribe this exact semester order; placement is inferred from prerequisites.",
    summaryZh: "路线把 Harvard 公布的计算机专业类别映射到已核实的公开资料。Harvard 并未规定这一逐学期顺序；学期位置由先修关系推导。",
    officialRequirementNotes: ["The current basic concentration requires 11 to 14 courses: 9 CS-core courses and 2 to 5 mathematics courses.", "Mathematical preparation includes early calculus as needed, one approved linear-algebra course such as MATH 21B, and one approved probability course such as STAT 110.", "Harvard's first-year guidance recommends CS 20 for discrete mathematics and commonly places CS 61 after CS 50; the courses below remain a self-study mapping, not an assertion of Harvard credit equivalence."],
    officialRequirementNotesZh: ["当前基础专业要求 11 至 14 门课程，其中包括 9 门计算机核心课和 2 至 5 门数学课。", "数学准备包括按需补充初等微积分、一门获批线性代数课（如 MATH 21B），以及一门获批概率课（如 STAT 110）。", "Harvard 大一指导建议用 CS 20 学习离散数学，并通常在 CS 50 后学习 CS 61；下列课程仍仅为自学映射，不代表 Harvard 学分等价。"],
    scheduleStatus: "prerequisite-inferred",
    calendar: "semester",
    phases: [
      term("Year 1 · Fall", "大一上", "Begin computer science and single-variable calculus.", "开始计算机科学与单变量微积分。", ["harvard-cs50x", "mit-18-01sc"]),
      term("Year 1 · Spring", "大一下", "Follow Harvard's first-year guidance with discrete mathematics and a second programming/systems course.", "按 Harvard 大一指导学习离散数学和第二门编程/系统课程。", ["harvard-cs20", "harvard-cs61"]),
      term("Year 2 · Fall", "大二上", "Complete Harvard's linear-algebra requirement alongside data structures and software foundations.", "完成 Harvard 线性代数要求，并学习数据结构与软件基础。", ["berkeley-cs61b", "harvard-math21b", "mit-6-031"]),
      term("Year 2 · Spring", "大二下", "Complete Harvard's probability requirement and continue algorithms foundations.", "完成 Harvard 概率要求，并继续算法基础。", ["harvard-stat110", "mit-6-006"]),
      term("Year 3 · Fall", "大三上", "Choose Harvard theory, systems, and data-systems courses under the official breadth rules.", "按官方广度规则选择 Harvard 理论、系统与数据系统课程。", ["harvard-cs1200", "harvard-cs1610", "harvard-cs1650", "stanford-cs143"], [], [], 2),
      term("Year 3 · Spring", "大三下", "Explore other approved CS areas.", "探索其他获批计算机领域。", ["harvard-cs50-ai", "harvard-cs50-web", "harvard-cs50-sql", "harvard-cs50-cybersecurity"], [], [], 2),
      term("Year 4 · Fall", "大四上", "Continue advanced concentration or honors work.", "继续高阶专业课程或荣誉项目。", ["stanford-cs221", "mit-6-858", "mit-6-824", "berkeley-cs189"], ["Advanced concentration or honors work"], ["高阶专业课程或荣誉项目"], 2),
      term("Year 4 · Spring", "大四下", "Finish remaining breadth, track, or thesis requirements.", "完成剩余广度、方向或论文要求。", ["mit-6-837", "stanford-cs144", "mit-6-830"], ["Remaining track or thesis requirement"], ["剩余方向或论文要求"], 1),
    ],
  },
  {
    id: "uiuc-cs",
    university: "University of Illinois Urbana-Champaign",
    program: "Bachelor of Science in Computer Science",
    programZh: "计算机科学理学学士",
    officialUrl: "https://grainger.illinois.edu/academics/undergraduate/majors-and-minors/cs-map",
    sourceEdition: "Current Illinois curriculum map",
    sourceEditionZh: "Illinois 当前培养方案图",
    verifiedOn: "2026-08-22",
    summary: "The route follows the current Illinois BSCS sample sequence and prerequisite chain. The university presents this sequence as guidance rather than a prescriptive plan; linked external courses are self-study substitutes.",
    summaryZh: "路线依据 Illinois 当前 BSCS 示例顺序和先修关系。学校将该顺序作为指导而非强制课表；外校链接为自学替代资源。",
    officialRequirementNotes: ["The 2026–2027 BSCS core includes CS 124, 128, 173, 222, 225, 233, 341, 357, 361, 374, and 421.", "The sample sequence places CS 173 in first-year spring, CS 225 in second-year fall, CS 233 and CS 361 in second-year spring, CS 341 and CS 357 in third-year fall, and CS 374 in third-year spring.", "The program also requires calculus through MATH 241, linear algebra, laboratory science, and technical electives; external links below are self-study substitutes, not Illinois credit equivalents."],
    officialRequirementNotesZh: ["2026–2027 BSCS 核心包括 CS 124、128、173、222、225、233、341、357、361、374 和 421。", "官方示例顺序把 CS 173 放在大一下、CS 225 放在大二上、CS 233 与 CS 361 放在大二下、CS 341 与 CS 357 放在大三上、CS 374 放在大三下。", "专业还要求微积分至 MATH 241、线性代数、实验科学和技术选修；下列外校链接仅为自学替代，不代表 Illinois 学分等价。"],
    scheduleStatus: "prerequisite-inferred",
    calendar: "semester",
    phases: [
      term("Year 1 · Fall", "大一上", "Begin programming and the calculus sequence, following the official first-semester core.", "按官方第一学期核心开始编程和微积分序列。", ["uiuc-cs124", "uiuc-math221"]),
      term("Year 1 · Spring", "大一下", "Continue programming and take Illinois discrete structures alongside Calculus II.", "继续编程，并在微积分 II 同期学习 Illinois 离散结构。", ["uiuc-cs128", "uiuc-cs173", "uiuc-math231"]),
      term("Year 2 · Fall", "大二上", "Take Illinois data structures with multivariable calculus and mechanics.", "学习 Illinois 数据结构，并同步学习多元微积分和力学。", ["uiuc-cs225", "mit-18-02sc", "mit-8-01sc"]),
      term("Year 2 · Spring", "大二下", "Follow the official core with computer architecture, probability, linear algebra, and electromagnetism.", "按官方核心学习计算机体系结构、概率、线性代数和电磁学。", ["berkeley-cs61c", "uiuc-cs361", "mit-18-06", "mit-8-02"]),
      term("Year 3 · Fall", "大三上", "Complete Illinois system programming and numerical methods before advanced theory.", "在高阶理论前完成 Illinois 系统编程与数值方法。", ["uiuc-cs341", "uiuc-cs357"]),
      term("Year 3 · Spring", "大三下", "Complete Illinois algorithms and models of computation, then begin a coherent elective focus area.", "完成 Illinois 算法与计算模型，并开始同一技术选修方向。", ["uiuc-cs374", "berkeley-cs186", "stanford-cs221", "mit-6-837", "stanford-cs144"], [], [], 2),
      term("Year 4 · Fall", "大四上", "Continue the focus area and complete team-project work.", "继续方向课程并完成团队项目。", ["mit-6-824", "berkeley-cs189", "mit-6-858", "stanford-cs148"], ["Approved team-project course"], ["获批团队项目课程"], 2),
      term("Year 4 · Spring", "大四下", "Finish the focus-area sequence and remaining technical electives.", "完成方向序列及剩余技术选修。", ["cornell-cs6787", "stanford-cs155", "mit-6-830"], [], [], 1),
    ],
  },
  {
    id: "gatech-cs",
    university: "Georgia Institute of Technology",
    program: "Bachelor of Science in Computer Science",
    programZh: "计算机科学理学学士",
    officialUrl: "https://catalog.gatech.edu/programs/computer-science-bs/",
    sourceEdition: "Current Georgia Tech catalog",
    sourceEditionZh: "Georgia Tech 当前目录",
    verifiedOn: "2026-08-22",
    summary: "Georgia Tech's current BSCS combines shared computing and mathematics foundations with two student-selected Threads. This route places the verified common courses by prerequisite order and presents later Thread work as choices, not a mandatory pairing.",
    summaryZh: "Georgia Tech 当前 BSCS 由共同计算与数学基础加学生自选的两个 Threads 组成。本路线按先修顺序安排已核实的共同课程，并把后期 Thread 课程作为选择，而非强制组合。",
    officialRequirementNotes: ["The current BSCS requires 124 credit hours and selection of two of the nine official Threads.", "Shared foundations include introductory programming, object-oriented programming, data structures and algorithms, discrete mathematics, computer organization, objects and design, and mathematics through integral calculus before most upper-level Thread work.", "Thread combinations define much of the junior- and senior-level curriculum; OpenStudy omits humanities and social-science requirements while retaining mathematics and laboratory science, and external links remain self-study substitutes rather than Georgia Tech credit equivalents."],
    officialRequirementNotesZh: ["当前 BSCS 要求 124 学分，并从九个官方 Threads 中选择两个。", "共同基础包括编程导论、面向对象程序设计、数据结构与算法、离散数学、计算机组成、面向对象设计，以及进入多数高阶 Thread 课程前的积分学。", "大三和大四的大部分课程由 Thread 组合决定；OpenStudy 省略人文社科要求但保留数学与实验科学，外校链接仅为自学替代，不代表 Georgia Tech 学分等价。"],
    scheduleStatus: "prerequisite-inferred",
    calendar: "semester",
    phases: [
      term("Year 1 · Fall", "大一上", "Begin Georgia Tech programming and differential calculus with laboratory science.", "开始 Georgia Tech 编程、微分学和实验科学。", ["gatech-cs1301", "gatech-math1551", "mit-5-111sc"]),
      term("Year 1 · Spring", "大一下", "Continue with Georgia Tech object-oriented programming and integral calculus alongside science.", "继续学习 Georgia Tech 面向对象程序设计和积分学，并同步学习科学课程。", ["gatech-cs1331", "gatech-math1552", "mit-8-01sc"]),
      term("Year 2 · Fall", "大二上", "Build the native data structures, discrete mathematics, and computer organization core.", "完成本校数据结构、离散数学与计算机组成核心。", ["gatech-cs1332", "gatech-cs2050", "gatech-cs2110"]),
      term("Year 2 · Spring", "大二下", "Complete Georgia Tech objects and design with linear algebra and probability foundations before Thread work.", "在进入 Thread 前完成 Georgia Tech 面向对象设计，并补足线性代数与概率基础。", ["gatech-cs2340", "mit-18-06", "mit-18-05"]),
      term("Year 3 · Fall", "大三上", "Start two selected Threads after the common foundations.", "完成共同基础后，开始两个自选 Threads。", ["gatech-cs3510", "berkeley-cs162", "stanford-cs221", "mit-6-837"], ["Choose courses required by both selected Threads"], ["选择两个 Threads 要求的课程"], 2),
      term("Year 3 · Spring", "大三下", "Continue both Threads with their required courses and electives.", "继续两个 Threads 的必修与选修。", ["stanford-cs144", "stanford-cs143", "berkeley-cs186", "mit-6-858"], ["Selected Thread requirements"], ["所选 Threads 的要求"], 2),
      term("Year 4 · Fall", "大四上", "Complete advanced Thread work and project requirements.", "完成高阶 Thread 课程及项目要求。", ["mit-6-824", "berkeley-cs189", "stanford-cs155", "mit-6-830"], ["Selected Thread project or capstone"], ["所选 Thread 的项目或毕业设计"], 2),
      term("Year 4 · Spring", "大四下", "Finish both Threads and remaining degree requirements.", "完成两个 Threads 及剩余学位要求。", ["cornell-cs6787", "stanford-cs148", "princeton-cos461"], ["Remaining requirements for both selected Threads"], ["两个所选 Threads 的剩余要求"], 1),
    ],
  },
  {
    id: "tsinghua-cs",
    university: "Tsinghua University",
    program: "Computer Science and Technology (2025 curriculum)",
    programZh: "计算机科学与技术（2025 级培养方案）",
    officialUrl: "https://www.cs.tsinghua.edu.cn/info/1043/6918.htm",
    sourceEdition: "2025-entry official curriculum",
    sourceEditionZh: "2025 级官方培养方案",
    verifiedOn: "2026-08-04",
    summary: "Requirements follow Tsinghua University's official 2025 Computer Science and Technology curriculum. OpenStudy omits general education and maps technical requirements to verified public courses; semester placement is inferred from the official prerequisite chain.",
    summaryZh: "要求依据清华大学计算机系 2025 级官方培养方案。OpenStudy 省略通识课程，并将技术要求映射到已核实的公开课；学期顺序依据官方先修关系推断。",
    officialRequirementNotes: ["The official four-year curriculum includes calculus, linear algebra, probability, physics, programming, discrete mathematics, data structures, digital logic, computer organization, operating systems, networks, databases, algorithms, theory, AI, software engineering, and practical or capstone work.", "Upper-level study contains substantial direction electives rather than one mandatory fixed sequence.", "The linked TsinghuaX linear-algebra and algorithm courses are public self-study editions from Tsinghua faculty; they support the corresponding foundations but do not assert equivalence to specific on-campus sections.", "Linked courses from other universities are self-study substitutes and do not imply Tsinghua credit equivalence."],
    officialRequirementNotesZh: ["官方四年方案包括微积分、线性代数、概率、物理、程序设计、离散数学、数据结构、数字逻辑、计算机组成、操作系统、网络、数据库、算法、理论、人工智能、软件工程与实践或毕业设计。", "高年级包含较多方向选修，并非只有一条强制固定顺序。", "所链接的 TsinghuaX 线性代数和算法课程由清华教师建设，是同校公开自学版本；它们支持对应基础学习，但不声称等同于某个校内教学班。", "外校链接仅为自学替代资料，不代表清华学分等价。"],
    scheduleStatus: "prerequisite-inferred",
    calendar: "semester",
    phases: [
      term("Year 1 · Fall", "大一上", "Begin calculus, programming, and science foundations.", "开始微积分、程序设计与科学基础。", ["mit-18-01sc", "tsinghua-20740164", "mit-8-01sc"]),
      term("Year 1 · Spring", "大一下", "Continue calculus, physics, programming, and Tsinghua's public linear-algebra sequence.", "继续微积分、物理、程序设计，并学习清华公开线性代数课程。", ["mit-18-02sc", "mit-8-02", "berkeley-cs61a", "tsinghua-linear-algebra"]),
      term("Year 2 · Fall", "大二上", "Build discrete mathematics, data structures, digital logic, and computer organization.", "建立离散数学、数据结构、数字逻辑与计算机组成基础。", ["mit-6-042j", "tsinghua-20740112", "tsinghua-digital-logic-lab", "tsinghua-computer-organization"]),
      term("Year 2 · Spring", "大二下", "Study probability, Tsinghua's public algorithm sequence, software construction, and systems foundations.", "学习概率、清华公开算法课程、软件构造与系统基础。", ["mit-18-05", "tsinghua-algorithm-design", "mit-6-031", "princeton-cos217"]),
      term("Year 3 · Fall", "大三上", "Complete Tsinghua operating systems alongside networks, databases, and theory.", "完成清华操作系统，并同步学习网络、数据库与理论核心。", ["tsinghua-operating-systems", "stanford-cs144", "tsinghua-database-technology", "stanford-cs103"]),
      term("Year 3 · Spring", "大三下", "Choose advanced directions after the common core, including Tsinghua combinatorics for theory depth.", "完成共同核心后选择高阶方向，其中可选清华组合数学深化理论基础。", ["tsinghua-computer-graphics", "tsinghua-combinatorics", "stanford-cs221", "berkeley-cs189", "mit-6-858", "stanford-cs143"], [], [], 2),
      term("Year 4 · Fall", "大四上", "Continue direction electives and engineering practice.", "继续方向选修与工程实践。", ["mit-6-824", "mit-6-830", "stanford-cs155", "stanford-cs148"], ["Approved practice or research requirement"], ["获批实践或科研要求"], 2),
      term("Year 4 · Spring", "大四下", "Finish advanced electives and the graduation project.", "完成高阶选修与毕业设计。", ["cornell-cs6787", "princeton-cos461", "mit-6-036"], ["Graduation project"], ["毕业设计"], 1),
    ],
  },
  {
    id: "pku-cs",
    university: "Peking University",
    program: "Computer Science and Technology (2023 curriculum)",
    programZh: "计算机科学与技术（2023 级培养方案）",
    officialUrl: "https://eecs.pku.edu.cn/info/1083/5741.htm",
    sourceEdition: "2023-entry published curriculum",
    sourceEditionZh: "2023 级公开培养方案",
    verifiedOn: "2026-08-04",
    summary: "Requirements follow Peking University's official 2023 Computer Science and Technology curriculum publication. OpenStudy retains mathematics, science, and technical study while omitting general education; public courses from other universities are self-study substitutes.",
    summaryZh: "要求依据北京大学 2023 级计算机科学与技术专业官方培养方案。OpenStudy 保留数学、科学与技术课程，省略通识课程；外校公开课仅作为自学替代。",
    officialRequirementNotes: ["The official program combines mathematics and natural science foundations with programming, data structures, computer systems, algorithms, theory, and upper-level technical electives.", "The official publication includes required and elective modules; the eight-term OpenStudy placement is a prerequisite-based interpretation, not a prescribed PKU timetable.", "PKU Higher Algebra I and Probability Theory are same-university public self-study substitutes for the route's linear-algebra and probability foundations; they do not assert exact credit equivalence to the CS program's required sections.", "Linked courses are learning-resource substitutes and do not imply PKU credit equivalence."],
    officialRequirementNotesZh: ["官方方案把数学与自然科学基础同程序设计、数据结构、计算机系统、算法、理论及高年级技术选修结合。", "官方方案包含必修与选修模块；OpenStudy 的八学期安排是依据先修关系的解释，并非北大规定课表。", "北大高等代数 I 与概率论是路线中线性代数和概率基础的同校公开自学替代，不声称与计算机专业指定教学班完全等同。", "链接课程是学习资源替代，不代表北大学分等价。"],
    scheduleStatus: "prerequisite-inferred",
    calendar: "semester",
    phases: [
      term("Year 1 · Fall", "大一上", "Begin programming and mathematical analysis/calculus.", "开始程序设计与数学分析/微积分。", ["pku-computing-intro", "mit-18-01sc"]),
      term("Year 1 · Spring", "大一下", "Continue programming, calculus, and physics.", "继续程序设计、微积分与物理。", ["berkeley-cs61a", "mit-18-02sc", "mit-8-01sc"]),
      term("Year 2 · Fall", "大二上", "Build data structures, discrete mathematics, PKU higher algebra, and computer organization.", "建立数据结构、离散数学、北大高等代数与计算机组成基础。", ["pku-data-structures", "mit-6-042j", "pku-higher-algebra-1", "pku-computer-organization"]),
      term("Year 2 · Spring", "大二下", "Study PKU probability, algorithms, systems programming, and physics.", "学习北大概率论、算法、系统编程与物理。", ["pku-probability", "pku-algorithm-design", "princeton-cos217", "mit-8-02"]),
      term("Year 3 · Fall", "大三上", "Complete PKU operating systems, databases, and networks, plus theory foundations.", "完成北大操作系统、数据库和网络课程，并巩固理论基础。", ["pku-operating-systems", "pku-databases", "pku-computer-networks", "stanford-cs103"]),
      term("Year 3 · Spring", "大三下", "Choose upper-level courses across AI, graphics, security, and programming languages.", "在人工智能、图形学、安全与编程语言等方向选课。", ["stanford-cs221", "mit-6-837", "mit-6-858", "stanford-cs143", "berkeley-cs189"], [], [], 2),
      term("Year 4 · Fall", "大四上", "Continue technical electives and research or project work.", "继续技术选修与科研或项目实践。", ["mit-6-824", "mit-6-830", "stanford-cs155", "princeton-cos461"], ["Research or practical project"], ["科研或实践项目"], 2),
      term("Year 4 · Spring", "大四下", "Finish electives and the graduation thesis or project.", "完成选修与毕业论文或毕业设计。", ["cornell-cs6787", "mit-6-036", "stanford-cs148"], ["Graduation thesis or project"], ["毕业论文或毕业设计"], 1),
    ],
  },
];
