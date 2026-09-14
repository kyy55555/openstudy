import type { Course } from "./courses";

type GoalDefinition = {
  topic: string;
  topicZh: string;
  aliases: readonly string[];
  steps: readonly GoalStepDefinition[];
};

type GoalStepDefinition = {
  courseId: string;
  reason: string;
  reasonZh: string;
};

const step = (courseId: string, reason: string, reasonZh: string): GoalStepDefinition => ({ courseId, reason, reasonZh });

export type CourseGoalOption = Pick<GoalDefinition, "topic" | "topicZh">;

const goalDefinitions: readonly GoalDefinition[] = [
  {
    topic: "Distributed Systems",
    topicZh: "分布式系统",
    aliases: ["distributed system", "distributed systems", "分布式系统"],
    steps: [
      step("harvard-cs50x", "Build programming and computational-thinking foundations.", "先建立编程与计算思维基础。"),
      step("berkeley-cs61c", "Understand memory, machines, and low-level systems.", "理解内存、计算机组成与底层系统。"),
      step("stanford-cs111", "Learn concurrency, processes, and operating-system foundations.", "补齐并发、进程与操作系统基础。"),
      step("mit-6-824", "Study the core distributed-systems ideas through real labs.", "通过真实实验学习分布式系统核心原理。"),
      step("stanford-cs244b", "Continue into advanced distributed-system design and research.", "继续进入高级分布式系统设计与研究。"),
    ],
  },
  {
    topic: "Machine Learning",
    topicZh: "机器学习",
    aliases: ["machine learning", "ml", "机器学习"],
    steps: [
      step("harvard-cs50-python", "Become comfortable implementing ideas in Python.", "先熟悉用 Python 实现想法。"),
      step("mit-18-06", "Build the linear-algebra foundation used by ML models.", "建立机器学习模型所需的线性代数基础。"),
      step("harvard-stat110", "Learn the probability needed to reason about uncertainty.", "学习处理不确定性所需的概率基础。"),
      step("mit-6-036", "Connect the mathematics to core machine-learning methods.", "把数学基础连接到核心机器学习方法。"),
      step("stanford-cs229", "Move into a more rigorous and advanced ML treatment.", "进入更严谨、更进阶的机器学习课程。"),
    ],
  },
  {
    topic: "Algorithms",
    topicZh: "算法",
    aliases: ["algorithm", "algorithms", "算法"],
    steps: [
      step("princeton-cos126", "Start with programming and basic computational problem solving.", "从编程和基础计算问题求解开始。"),
      step("princeton-cos226", "Learn the standard data structures behind efficient algorithms.", "学习高效算法依赖的标准数据结构。"),
      step("mit-6-006", "Develop systematic algorithm design and analysis skills.", "系统训练算法设计与分析能力。"),
      step("mit-6-046j", "Continue into advanced techniques and harder proofs.", "继续学习高级算法技巧与更复杂的证明。"),
    ],
  },
  {
    topic: "Operating Systems",
    topicZh: "操作系统",
    aliases: ["operating system", "operating systems", "操作系统"],
    steps: [
      step("harvard-cs50x", "Build a broad programming foundation.", "建立广泛的编程基础。"),
      step("berkeley-cs61c", "Learn how programs interact with hardware and memory.", "理解程序如何与硬件和内存交互。"),
      step("mit-6-s081", "Build operating-system concepts through xv6 labs.", "通过 xv6 实验掌握操作系统概念。"),
      step("harvard-cs1610", "Reinforce the subject with a second advanced systems treatment.", "用另一门进阶系统课程巩固知识。"),
    ],
  },
  {
    topic: "Web Development",
    topicZh: "网站开发",
    aliases: ["web development", "website", "websites", "网站", "网站开发", "网页开发"],
    steps: [
      step("harvard-cs50x", "Learn the programming and web foundations first.", "先学习编程与 Web 基础。"),
      step("harvard-cs50-web", "Build full web applications with a structured project sequence.", "通过完整项目序列构建 Web 应用。"),
      step("princeton-cos333", "Advance into larger software design and engineering tradeoffs.", "进入更大型的软件设计与工程权衡。"),
    ],
  },
  {
    topic: "Databases",
    topicZh: "数据库",
    aliases: ["database", "databases", "数据库"],
    steps: [
      step("harvard-cs50-sql", "Start with practical relational data and SQL.", "从关系数据与 SQL 实践开始。"),
      step("berkeley-cs186", "Learn database internals, indexing, and transactions.", "学习数据库内部结构、索引与事务。"),
      step("mit-6-830", "Build and reason about complete database systems.", "构建并理解完整的数据库系统。"),
      step("harvard-cs1650", "Explore modern data-system design at an advanced level.", "进阶探索现代数据系统设计。"),
    ],
  },
  {
    topic: "Artificial Intelligence",
    topicZh: "人工智能",
    aliases: ["artificial intelligence", "ai", "人工智能"],
    steps: [
      step("harvard-cs50-python", "Learn enough Python to implement AI exercises.", "先掌握足够的 Python 来完成 AI 练习。"),
      step("harvard-cs50-ai", "Survey search, optimization, learning, and language through projects.", "通过项目学习搜索、优化、学习与语言处理。"),
      step("berkeley-cs188", "Develop a broader, more rigorous AI foundation.", "建立更广泛、更严谨的人工智能基础。"),
      step("stanford-cs221", "Continue into advanced methods and problem solving.", "继续学习高级方法与问题求解。"),
    ],
  },
  {
    topic: "Cybersecurity",
    topicZh: "网络安全",
    aliases: ["cybersecurity", "cyber security", "computer security", "网络安全", "信息安全"],
    steps: [
      step("harvard-cs50x", "Build the programming foundation security work depends on.", "建立安全学习所依赖的编程基础。"),
      step("harvard-cs50-cybersecurity", "Get a practical introduction to major security risks.", "实践了解主要安全风险。"),
      step("berkeley-cs61c", "Understand memory and low-level execution before studying advanced attacks.", "在学习高级攻击前理解内存与底层执行。"),
      step("berkeley-cs161", "Study systems, web, network, and cryptographic security in depth.", "深入学习系统、Web、网络与密码安全。"),
      step("mit-6-858", "Continue into advanced computer-systems security.", "继续进入高级计算机系统安全。"),
    ],
  },
  {
    topic: "Computer Networks",
    topicZh: "计算机网络",
    aliases: ["computer network", "computer networks", "networking", "计算机网络", "网络"],
    steps: [
      step("harvard-cs50x", "Start with programming and internet fundamentals.", "先建立编程与互联网基础。"),
      step("berkeley-cs61c", "Learn the systems foundation beneath network software.", "学习网络软件背后的系统基础。"),
      step("stanford-cs144", "Build the core internet stack through implementation work.", "通过实现任务掌握互联网协议栈。"),
      step("princeton-cos461", "Deepen network architecture and protocol analysis.", "深化网络体系结构与协议分析。"),
    ],
  },
  {
    topic: "Computer Graphics",
    topicZh: "计算机图形学",
    aliases: ["computer graphics", "graphics", "计算机图形学", "图形学"],
    steps: [
      step("harvard-cs50x", "Build core programming confidence.", "先建立核心编程能力。"),
      step("mit-18-06", "Learn the vectors and transformations used throughout graphics.", "学习图形学中广泛使用的向量与变换。"),
      step("mit-6-837", "Study the graphics pipeline through lectures and assignments.", "通过讲义与作业学习图形学管线。"),
      step("berkeley-cs184", "Continue with advanced rendering, geometry, and simulation projects.", "继续完成高级渲染、几何与仿真项目。"),
    ],
  },
];

export const courseGoalOptions: readonly CourseGoalOption[] = goalDefinitions.map(({ topic, topicZh }) => ({ topic, topicZh }));

function matchingGoal(input: string) {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;
  return goalDefinitions.find(({ aliases }) => aliases.some((alias) => normalized.includes(alias))) ?? null;
}

export type CourseGoalSequence = {
  topic: string;
  topicZh: string;
  courses: Course[];
  steps: Array<{ course: Course; reason: string; reasonZh: string }>;
};

export function courseGoalSequence(catalog: Course[], input: string): CourseGoalSequence | null {
  const goal = matchingGoal(input);
  if (!goal) return null;
  const byId = new Map(catalog.map((course) => [course.id, course]));
  const steps = goal.steps.flatMap((goalStep) => {
    const course = byId.get(goalStep.courseId);
    return course ? [{ course, reason: goalStep.reason, reasonZh: goalStep.reasonZh }] : [];
  });
  if (steps.length < 2) return null;
  return { topic: goal.topic, topicZh: goal.topicZh, courses: steps.map(({ course }) => course), steps };
}
