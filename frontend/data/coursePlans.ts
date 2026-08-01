export type PlanTask = {
  id: string;
  title: string;
  titleZh: string;
  url: string;
  kind: "session" | "assignment" | "exam" | "buffer";
};

export type PlanDay = { id: string; tasks: PlanTask[] };

type Segment = {
  start: number;
  end: number;
  title: string;
  titleZh: string;
  url: string;
  problemSet?: number;
};

const base = "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/pages";

const mit1801Segments: Segment[] = [
  { start: 1, end: 12, title: "Definition and basic differentiation rules", titleZh: "导数定义与基本规则", url: `${base}/1.-differentiation/part-a-definition-and-basic-rules/`, problemSet: 1 },
  { start: 13, end: 20, title: "Implicit differentiation and inverse functions", titleZh: "隐函数求导与反函数", url: `${base}/1.-differentiation/part-b-implicit-differentiation-and-inverse-functions/`, problemSet: 2 },
  { start: 21, end: 22, title: "Exam 1 review and exam", titleZh: "第一次考试复习与考试", url: `${base}/1.-differentiation/exam-1/` },
  { start: 23, end: 28, title: "Approximation and curve sketching", titleZh: "近似与曲线绘制", url: `${base}/unit-2-applications-of-differentiation/part-a-approximation-and-curve-sketching/`, problemSet: 3 },
  { start: 29, end: 33, title: "Optimization, related rates, and Newton's method", titleZh: "优化、相关变化率与牛顿法", url: `${base}/unit-2-applications-of-differentiation/part-b-optimization-related-rates-and-newtons-method/`, problemSet: 4 },
  { start: 34, end: 40, title: "Mean value theorem, antiderivatives, and differential equations", titleZh: "中值定理、原函数与微分方程", url: `${base}/unit-2-applications-of-differentiation/part-c-mean-value-theorem-antiderivatives-and-differential-equations/`, problemSet: 5 },
  { start: 41, end: 42, title: "Exam 2 review and exam", titleZh: "第二次考试复习与考试", url: `${base}/unit-2-applications-of-differentiation/exam-2/` },
  { start: 43, end: 50, title: "Definite integral and first fundamental theorem", titleZh: "定积分与第一基本定理", url: `${base}/unit-3-the-definite-integral-and-its-applications/part-a-definition-of-the-definite-integral-and-first-fundamental-theorem/`, problemSet: 6 },
  { start: 51, end: 59, title: "Second fundamental theorem, areas, and volumes", titleZh: "第二基本定理、面积与体积", url: `${base}/unit-3-the-definite-integral-and-its-applications/part-b-second-fundamental-theorem-areas-volumes/`, problemSet: 7 },
  { start: 60, end: 65, title: "Average value, probability, and numerical integration", titleZh: "平均值、概率与数值积分", url: `${base}/unit-3-the-definite-integral-and-its-applications/part-c-average-value-probability-and-numerical-integration/`, problemSet: 8 },
  { start: 66, end: 67, title: "Exam 3 review and exam", titleZh: "第三次考试复习与考试", url: `${base}/unit-3-the-definite-integral-and-its-applications/exam-3/` },
  { start: 68, end: 73, title: "Trigonometric powers and substitution", titleZh: "三角函数幂与三角代换", url: `${base}/unit-4-techniques-of-integration/part-a-trigonometric-powers-trigonometric-substitution-and-completing-the-square/`, problemSet: 9 },
  { start: 74, end: 79, title: "Partial fractions, integration by parts, and arc length", titleZh: "部分分式、分部积分与弧长", url: `${base}/unit-4-techniques-of-integration/part-b-partial-fractions-integration-by-parts-arc-length-and-surface-area/`, problemSet: 10 },
  { start: 80, end: 84, title: "Parametric equations and polar coordinates", titleZh: "参数方程与极坐标", url: `${base}/unit-4-techniques-of-integration/part-c-parametric-equations-and-polar-coordinates/`, problemSet: 11 },
  { start: 85, end: 86, title: "Exam 4 review and exam", titleZh: "第四次考试复习与考试", url: `${base}/unit-4-techniques-of-integration/exam-4/` },
  { start: 87, end: 93, title: "L'Hospital's rule and improper integrals", titleZh: "洛必达法则与反常积分", url: `${base}/unit-5-exploring-the-infinite/part-a-lhospitals-rule-and-improper-integrals/` },
  { start: 94, end: 101, title: "Taylor series", titleZh: "泰勒级数", url: `${base}/unit-5-exploring-the-infinite/part-b-taylor-series/` },
];

function mit1801Tasks(): PlanTask[] {
  const tasks: PlanTask[] = [];
  for (const segment of mit1801Segments) {
    for (let session = segment.start; session <= segment.end; session += 1) {
      tasks.push({ id: `session-${session}`, title: `Session ${session}: ${segment.title}`, titleZh: `第 ${session} 讲：${segment.titleZh}`, url: segment.url, kind: "session" });
    }
    if (segment.problemSet) tasks.push({ id: `problem-set-${segment.problemSet}`, title: `Problem Set ${segment.problemSet}`, titleZh: `习题集 ${segment.problemSet}`, url: "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/resources/problem-sets/", kind: "assignment" });
  }
  tasks.push({ id: "final-exam", title: "Final exam", titleZh: "期末考试", url: "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/resources/exams/", kind: "exam" });
  return tasks;
}

export const structuredCoursePlans: Record<string, { sourceUrl: string; tasks: PlanTask[] }> = {
  "mit-18-01sc": { sourceUrl: `${base}/syllabus/`, tasks: mit1801Tasks() },
};

export function buildGentlePlan(courseId: string, requestedDays: number): { requestedDays: number; plannedDays: number; totalTasks: number; days: PlanDay[] } | null {
  const course = structuredCoursePlans[courseId];
  if (!course || !Number.isInteger(requestedDays) || requestedDays < 1) return null;
  const plannedDays = Math.ceil(requestedDays * 1.15);
  const result: PlanDay[] = Array.from({ length: plannedDays }, (_, dayIndex) => {
    const start = Math.floor(dayIndex * course.tasks.length / plannedDays);
    const end = Math.floor((dayIndex + 1) * course.tasks.length / plannedDays);
    const tasks = course.tasks.slice(start, end);
    return { id: `day-${dayIndex + 1}`, tasks: tasks.length ? tasks : [{ id: `buffer-${dayIndex + 1}`, title: "Buffer or review day", titleZh: "缓冲或复习日", url: course.sourceUrl, kind: "buffer" }] };
  });
  return { requestedDays, plannedDays, totalTasks: course.tasks.length, days: result };
}
