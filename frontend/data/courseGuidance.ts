import type { Course } from "./courses";

type GoalDefinition = {
  topic: string;
  topicZh: string;
  aliases: readonly string[];
  courseIds: readonly string[];
};

const goalDefinitions: readonly GoalDefinition[] = [
  {
    topic: "Distributed Systems",
    topicZh: "分布式系统",
    aliases: ["distributed system", "distributed systems", "分布式系统"],
    courseIds: ["harvard-cs50x", "berkeley-cs61c", "stanford-cs111", "mit-6-824", "stanford-cs244b"],
  },
  {
    topic: "Machine Learning",
    topicZh: "机器学习",
    aliases: ["machine learning", "ml", "机器学习"],
    courseIds: ["harvard-cs50-python", "mit-18-06", "harvard-stat110", "mit-6-036", "stanford-cs229"],
  },
  {
    topic: "Algorithms",
    topicZh: "算法",
    aliases: ["algorithm", "algorithms", "算法"],
    courseIds: ["princeton-cos126", "princeton-cos226", "mit-6-006", "mit-6-046j"],
  },
  {
    topic: "Operating Systems",
    topicZh: "操作系统",
    aliases: ["operating system", "operating systems", "操作系统"],
    courseIds: ["harvard-cs50x", "berkeley-cs61c", "mit-6-s081", "harvard-cs1610"],
  },
  {
    topic: "Web Development",
    topicZh: "网站开发",
    aliases: ["web development", "website", "websites", "网站", "网站开发", "网页开发"],
    courseIds: ["harvard-cs50x", "harvard-cs50-web", "princeton-cos333"],
  },
  {
    topic: "Databases",
    topicZh: "数据库",
    aliases: ["database", "databases", "数据库"],
    courseIds: ["harvard-cs50-sql", "berkeley-cs186", "mit-6-830", "harvard-cs1650"],
  },
];

function matchingGoal(input: string) {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;
  return goalDefinitions.find(({ aliases }) => aliases.some((alias) => normalized.includes(alias))) ?? null;
}

export type CourseGoalSequence = {
  topic: string;
  topicZh: string;
  courses: Course[];
};

export function courseGoalSequence(catalog: Course[], input: string): CourseGoalSequence | null {
  const goal = matchingGoal(input);
  if (!goal) return null;
  const byId = new Map(catalog.map((course) => [course.id, course]));
  const sequence = goal.courseIds.map((id) => byId.get(id)).filter((course): course is Course => Boolean(course));
  if (sequence.length < 2) return null;
  return { topic: goal.topic, topicZh: goal.topicZh, courses: sequence };
}
