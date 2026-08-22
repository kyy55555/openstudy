import { courses } from "./courses.ts";

export type PlanTask = {
  id: string;
  title: string;
  titleZh: string;
  url: string;
  kind: "session" | "assignment" | "exam" | "project" | "buffer";
  sourceTaskId?: string;
  resourceType?: "syllabus" | "schedule" | "lectures" | "assignments" | "exams" | "projects" | "materials" | "downloads";
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

const cs50Topics = [
  ["Scratch", "Scratch"], ["C", "C 语言"], ["Arrays", "数组"], ["Algorithms", "算法"],
  ["Memory", "内存"], ["Data Structures", "数据结构"], ["Python", "Python"], ["SQL", "SQL"],
  ["HTML, CSS, JavaScript", "HTML、CSS 与 JavaScript"], ["Flask", "Flask"],
] as const;

function cs50xTasks(): PlanTask[] {
  const tasks = cs50Topics.flatMap(([title, titleZh], week) => [
    { id: `week-${week}`, title: `Week ${week}: ${title}`, titleZh: `第 ${week} 周：${titleZh}`, url: `https://cs50.harvard.edu/x/weeks/${week}/`, kind: "session" as const },
    { id: `problem-set-${week}`, title: `Problem Set ${week}: ${title}`, titleZh: `习题集 ${week}：${titleZh}`, url: `https://cs50.harvard.edu/x/psets/${week}/`, kind: "assignment" as const },
  ]);
  return [
    ...tasks,
    { id: "ai", title: "Artificial Intelligence", titleZh: "人工智能专题", url: "https://cs50.harvard.edu/x/weeks/ai/", kind: "session" },
    { id: "week-10", title: "Week 10: The End", titleZh: "第 10 周：总结", url: "https://cs50.harvard.edu/x/weeks/10/", kind: "session" },
    { id: "final-project", title: "Final Project", titleZh: "期末项目", url: "https://cs50.harvard.edu/x/project/", kind: "project" },
  ];
}

function cs50WeeklyTasks(slug: string, topics: readonly (readonly [string, string])[], assignmentPath: "psets" | "projects" | "assignments", finalProject = true, weekStart = 0): PlanTask[] {
  const tasks = topics.flatMap(([title, titleZh], index) => {
    const week = index + weekStart;
    return [
    { id: `week-${week}`, title: `Week ${week}: ${title}`, titleZh: `第 ${week} 周：${titleZh}`, url: `https://cs50.harvard.edu/${slug}/weeks/${week}/`, kind: "session" as const },
    { id: `${assignmentPath}-${week}`, title: `${assignmentPath === "projects" ? "Project" : assignmentPath === "assignments" ? "Assignment" : "Problem Set"} ${week}`, titleZh: `${assignmentPath === "projects" ? "项目" : assignmentPath === "assignments" ? "作业" : "习题集"} ${week}`, url: `https://cs50.harvard.edu/${slug}/${assignmentPath}/`, kind: assignmentPath === "projects" ? "project" as const : "assignment" as const },
    ];
  });
  if (finalProject) tasks.push({ id: "final-project", title: "Final Project", titleZh: "期末项目", url: slug === "web" ? "https://cs50.harvard.edu/web/projects/final/capstone/" : `https://cs50.harvard.edu/${slug}/project/`, kind: "project" });
  return tasks;
}

function stanfordCs106aTasks(): PlanTask[] {
  const courseUrl = "https://see.stanford.edu/Course/CS106A";
  const materialBase = "https://see.stanford.edu/materials/icspmcs106a";
  const lectures = [
    ["Welcome to CS106A", "课程介绍"], ["Karel programming", "Karel 编程"], ["Karel and Java", "Karel 与 Java"],
    ["Java and object-oriented programming", "Java 与面向对象编程"], ["Variables, objects, and expressions", "变量、对象与表达式"],
    ["Control statements", "控制语句"], ["Methods", "方法"], ["Parameters and information hiding", "参数与信息隐藏"],
    ["Strings and classes", "字符串与类"], ["Graphics and interfaces", "图形与接口"], ["Events and graphics", "事件与图形"],
    ["Characters and strings", "字符与字符串"], ["String processing", "字符串处理"], ["Memory", "内存"],
    ["Files and exceptions", "文件与异常"], ["Arrays and ArrayList", "数组与 ArrayList"], ["Multidimensional arrays", "多维数组"],
    ["Debugging and collections", "调试与集合"], ["Interfaces, maps, and iterators", "接口、映射与迭代器"],
    ["Graphical user interfaces", "图形用户界面"], ["Interactors and listeners", "交互器与监听器"],
    ["Components and containers", "组件与容器"], ["Searching, sorting, and efficiency", "搜索、排序与效率"],
    ["Software design and collections", "软件设计与集合"], ["Social networks and concurrency", "社交网络与并发"],
    ["Standard Java libraries", "Java 标准库"], ["Life after CS106A", "CS106A 后续学习"], ["Final review", "期末复习"],
  ] as const;
  const assignments = new Map<number, readonly [string, string, string]>([
    [2, ["Assignment 1: Karel", "作业 1：Karel", "07-assignment-1-karel.pdf"]],
    [6, ["Assignment 2: Simple Java", "作业 2：Simple Java", "13-assignment-2-simple-java.pdf"]],
    [10, ["Assignment 3: Breakout", "作业 3：Breakout", "19-assignment-3-breakout.pdf"]],
    [14, ["Assignment 4: Hangman", "作业 4：Hangman", "27-assignment-4-hangman.pdf"]],
    [18, ["Assignment 5: Yahtzee", "作业 5：Yahtzee", "35-assignment-5-yahtzee.pdf"]],
    [22, ["Assignment 6: NameSurfer", "作业 6：NameSurfer", "39-assignment-6-name-surfer.pdf"]],
    [25, ["Assignment 7: FacePamphlet", "作业 7：FacePamphlet", "42-assignment-7-facepamphlet.pdf"]],
  ]);

  return lectures.flatMap(([title, titleZh], index) => {
    const lecture = index + 1;
    const tasks: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${titleZh}`, url: courseUrl, kind: "session" }];
    const assignment = assignments.get(lecture);
    if (assignment) tasks.push({ id: `assignment-${assignments.size - [...assignments.keys()].filter((key) => key > lecture).length}`, title: assignment[0], titleZh: assignment[1], url: `${materialBase}/${assignment[2]}`, kind: "assignment" });
    if (lecture === 14) tasks.push({ id: "practice-midterm", title: "Practice midterm", titleZh: "期中模拟考试", url: `${materialBase}/28-practice-midterm.pdf`, kind: "exam" });
    if (lecture === 28) tasks.push({ id: "practice-final", title: "Practice final", titleZh: "期末模拟考试", url: `${materialBase}/46-practice-final-exam.pdf`, kind: "exam" });
    return tasks;
  });
}

function mit6006Tasks(): PlanTask[] {
  const base = "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020";
  const lectures = [
    ["Algorithms and computation", "算法与计算"], ["Data structures and dynamic arrays", "数据结构与动态数组"],
    ["Sets and sorting", "集合与排序"], ["Hashing", "哈希"], ["Linear sorting", "线性时间排序"],
    ["Binary trees, part 1", "二叉树（一）"], ["Binary trees, part 2: AVL", "二叉树（二）：AVL"],
    ["Binary heaps", "二叉堆"], ["Breadth-first search", "广度优先搜索"], ["Depth-first search", "深度优先搜索"],
    ["Weighted shortest paths", "加权最短路径"], ["Bellman-Ford", "Bellman-Ford"], ["Dijkstra", "Dijkstra"],
    ["All-pairs shortest paths and Johnson", "全源最短路径与 Johnson 算法"],
    ["Dynamic programming 1", "动态规划（一）"], ["Dynamic programming 2", "动态规划（二）"],
    ["Dynamic programming 3", "动态规划（三）"], ["Dynamic programming 4", "动态规划（四）"],
    ["Complexity", "复杂度"], ["Course review", "课程复习"], ["Algorithms: next steps", "算法后续学习"],
  ] as const;
  const problemSetAfter = new Map([[2, 0], [4, 1], [6, 2], [8, 3], [10, 4], [12, 5], [14, 6], [16, 7], [18, 8]]);
  const quizAfter = new Map([[8, "Quiz 1"], [14, "Quiz 2"], [19, "Quiz 3"], [21, "Final exam"]]);
  return lectures.flatMap(([title, titleZh], index) => {
    const lecture = index + 1;
    const tasks: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${titleZh}`, url: `${base}/video_galleries/lecture-videos/`, kind: "session" }];
    const problemSet = problemSetAfter.get(lecture);
    if (problemSet !== undefined) tasks.push({ id: `problem-set-${problemSet}`, title: `Problem Set ${problemSet}`, titleZh: `习题集 ${problemSet}`, url: `${base}/pages/assignments/`, kind: "assignment" });
    const quiz = quizAfter.get(lecture);
    if (quiz) tasks.push({ id: quiz.toLowerCase().replaceAll(" ", "-"), title: quiz, titleZh: quiz === "Final exam" ? "期末考试" : `测验 ${quiz.at(-1)}`, url: `${base}/pages/quizzes/`, kind: "exam" });
    return tasks;
  });
}

function mit6034Tasks(): PlanTask[] {
  const base = "https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010";
  const lectures = [
    ["Introduction and scope", "导论与范围"], ["Goal trees and problem solving", "目标树与问题求解"],
    ["Rule-based expert systems", "基于规则的专家系统"], ["Depth-first, hill climbing, and beam search", "深度优先、爬山与束搜索"],
    ["Optimal search, branch and bound, and A*", "最优搜索、分支定界与 A*"], ["Games, minimax, and alpha-beta", "博弈、极小化极大与 Alpha-Beta"],
    ["Line-drawing constraints", "线条图约束"], ["Constraint search and domain reduction", "约束搜索与域缩减"],
    ["Visual object recognition", "视觉对象识别"], ["Learning and nearest neighbors", "学习与最近邻"],
    ["Identification trees", "识别树"], ["Neural networks", "神经网络"], ["Deep neural networks", "深度神经网络"],
    ["Genetic algorithms", "遗传算法"], ["Sparse spaces and phonology", "稀疏空间与音系"],
    ["Near misses and felicity conditions", "近失例与适切条件"], ["Support vector machines", "支持向量机"],
    ["Boosting", "提升方法"], ["Classes, trajectories, and transitions", "类别、轨迹与转移"],
    ["AI architectures", "人工智能架构"], ["Probabilistic inference I", "概率推断（一）"],
    ["Probabilistic inference II", "概率推断（二）"], ["Model merging and course summary", "模型合并与课程总结"],
  ] as const;
  const labAfter = new Map([[1, 0], [3, 1], [5, 2], [6, 3], [11, 4], [17, 5]]);
  const examAfter = new Map([[6, "Quiz 1"], [11, "Quiz 2"], [17, "Quiz 3"], [23, "Quiz 4"]]);
  const tasks = lectures.flatMap(([title, titleZh], index) => {
    const lecture = index + 1;
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${titleZh}`, url: `${base}/video_galleries/lecture-videos/`, kind: "session" }];
    const lab = labAfter.get(lecture);
    if (lab !== undefined) result.push({ id: `problem-set-${lab}`, title: `Problem Set ${lab}`, titleZh: `习题集 ${lab}`, url: `${base}/pages/assignments/`, kind: "assignment" });
    const exam = examAfter.get(lecture);
    if (exam) result.push({ id: `quiz-${exam.at(-1)}`, title: exam, titleZh: `测验 ${exam.at(-1)}`, url: `${base}/pages/exams/`, kind: "exam" });
    return result;
  });
  tasks.push({ id: "final-exam", title: "Final exam", titleZh: "期末考试", url: `${base}/pages/exams/`, kind: "exam" });
  return tasks;
}

function mit1806Tasks(): PlanTask[] {
  const resourceIndex = "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/resource-index/";
  const topics = [
    ["The geometry of linear equations", "线性方程的几何意义"], ["Elimination with matrices", "矩阵消元"],
    ["Multiplication and inverse matrices", "矩阵乘法与逆矩阵"], ["Factorization into A = LU", "LU 分解"],
    ["Transposes, permutations, and vector spaces", "转置、置换与向量空间"], ["Column space and nullspace", "列空间与零空间"],
    ["Solving Ax = 0", "求解 Ax = 0"], ["Solving Ax = b", "求解 Ax = b"], ["Independence, basis, and dimension", "线性无关、基与维数"],
    ["The four fundamental subspaces", "四个基本子空间"], ["Matrix spaces and rank one", "矩阵空间与秩一矩阵"],
    ["Graphs, networks, and incidence matrices", "图、网络与关联矩阵"], ["Orthogonal vectors and subspaces", "正交向量与子空间"],
    ["Projections onto subspaces", "子空间投影"], ["Projection matrices and least squares", "投影矩阵与最小二乘"],
    ["Orthogonal matrices and Gram-Schmidt", "正交矩阵与 Gram-Schmidt"], ["Properties of determinants", "行列式的性质"],
    ["Determinant formulas and cofactors", "行列式公式与代数余子式"], ["Cramer's rule, inverse matrix, and volume", "克拉默法则、逆矩阵与体积"],
    ["Eigenvalues and eigenvectors", "特征值与特征向量"], ["Diagonalization and powers of A", "对角化与矩阵幂"],
    ["Differential equations and exp(At)", "微分方程与 exp(At)"], ["Markov matrices and Fourier series", "马尔可夫矩阵与傅里叶级数"],
    ["Symmetric matrices and positive definiteness", "对称矩阵与正定性"], ["Complex matrices and FFT", "复矩阵与快速傅里叶变换"],
    ["Positive definite matrices and minima", "正定矩阵与极小值"], ["Similar matrices and Jordan form", "相似矩阵与 Jordan 标准形"],
    ["Singular value decomposition", "奇异值分解"], ["Linear transformations and their matrices", "线性变换及其矩阵"],
    ["Change of basis and image compression", "基变换与图像压缩"], ["Left and right inverses; pseudoinverse", "左逆、右逆与伪逆"],
  ] as const;
  const examAfter = new Map([[12, 1], [23, 2], [31, 3]]);
  const tasks = topics.flatMap(([title, titleZh], index) => {
    const session = index + 1;
    const result: PlanTask[] = [
      { id: `session-${session}`, title, titleZh, url: resourceIndex, kind: "session" },
      { id: `problem-set-${session}`, title: `Problems: ${title}`, titleZh: `习题：${titleZh}`, url: resourceIndex, kind: "assignment" },
    ];
    const exam = examAfter.get(session);
    if (exam) result.push({ id: `exam-${exam}`, title: `Exam ${exam}`, titleZh: `考试 ${exam}`, url: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/exams/", kind: "exam" });
    return result;
  });
  tasks.push({ id: "final-review", title: "Final course review", titleZh: "期末课程复习", url: resourceIndex, kind: "session" });
  tasks.push({ id: "final-exam", title: "Final exam", titleZh: "期末考试", url: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/resources/exams/", kind: "exam" });
  return tasks;
}

function mit6046Tasks(): PlanTask[] {
  const base = "https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015";
  const lectures = [
    ["Overview and interval scheduling", "概述与区间调度"], ["Divide and conquer: convex hull and median finding", "分治：凸包与中位数查找"],
    ["Divide and conquer: FFT", "分治：快速傅里叶变换"], ["Divide and conquer: van Emde Boas trees", "分治：van Emde Boas 树"],
    ["Amortized analysis", "摊还分析"], ["Randomization: matrix multiplication and quicksort", "随机化：矩阵乘法与快速排序"],
    ["Randomization: skip lists", "随机化：跳表"], ["Randomization: universal and perfect hashing", "随机化：通用与完美哈希"],
    ["Augmentation: range trees", "数据结构增强：范围树"], ["Dynamic programming: advanced DP", "动态规划：进阶方法"],
    ["Dynamic programming: all-pairs shortest paths", "动态规划：全源最短路径"], ["Greedy algorithms: minimum spanning tree", "贪心算法：最小生成树"],
    ["Incremental improvement: max flow and min cut", "增量改进：最大流与最小割"], ["Incremental improvement: matching", "增量改进：匹配"],
    ["Linear programming: reductions and simplex", "线性规划：归约与单纯形法"], ["Complexity: P, NP, NP-completeness, and reductions", "复杂度：P、NP、NP 完全与归约"],
    ["Complexity: approximation algorithms", "复杂度：近似算法"], ["Complexity: fixed-parameter algorithms", "复杂度：固定参数算法"],
    ["Synchronous distributed algorithms", "同步分布式算法"], ["Asynchronous distributed algorithms", "异步分布式算法"],
    ["Cryptography: hash functions", "密码学：哈希函数"], ["Cryptography: encryption", "密码学：加密"],
    ["Cache-oblivious algorithms: medians and matrices", "缓存无关算法：中位数与矩阵"], ["Cache-oblivious algorithms: searching and sorting", "缓存无关算法：搜索与排序"],
  ] as const;
  const problemSetAfter = new Map([[2, 1], [4, 2], [6, 3], [8, 4], [10, 5], [12, 6], [14, 7], [16, 8], [19, 9], [22, 10]]);
  const examAfter = new Map([[9, "Quiz 1"], [18, "Quiz 2"], [24, "Final exam"]]);
  return lectures.flatMap(([title, titleZh], index) => {
    const lecture = index + 1;
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${titleZh}`, url: `${base}/video_galleries/lecture-videos/`, kind: "session" }];
    const problemSet = problemSetAfter.get(lecture);
    if (problemSet) result.push({ id: `problem-set-${problemSet}`, title: `Problem Set ${problemSet}`, titleZh: `习题集 ${problemSet}`, url: `${base}/pages/assignments/`, kind: "assignment" });
    const exam = examAfter.get(lecture);
    if (exam) result.push({ id: exam.toLowerCase().replaceAll(" ", "-"), title: exam, titleZh: exam === "Final exam" ? "期末考试" : `测验 ${exam.at(-1)}`, url: `${base}/pages/exams/`, kind: "exam" });
    return result;
  });
}

function mitPythonTasks(): PlanTask[] {
  const base = "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022";
  const topics = ["Introduction", "Strings, input/output, and branching", "Iteration", "Loops over strings, guess-and-check, and binary", "Floats and approximation methods", "Bisection search", "Decomposition, abstraction, and functions", "Functions as objects", "Lambda functions, tuples, and lists", "Lists and mutability", "Aliasing and cloning", "List comprehension, testing, and debugging", "Exceptions and assertions", "Dictionaries", "Recursion", "Recursion on non-numerics", "Python classes", "More Python class methods", "Inheritance", "Fitness tracker OOP example", "Timing programs and counting operations", "Big Oh and Theta", "Complexity class examples", "Sorting algorithms", "Plotting", "List access, hashing, simulations, and wrap-up"];
  const topicsZh = ["导论", "字符串、输入输出与分支", "迭代", "字符串循环、猜测检验与二进制", "浮点数与近似方法", "二分搜索", "分解、抽象与函数", "函数作为对象", "Lambda、元组与列表", "列表与可变性", "别名与克隆", "列表推导、测试与调试", "异常与断言", "字典", "递归", "非数值对象递归", "Python 类", "更多 Python 类方法", "继承", "健身追踪器面向对象示例", "程序计时与操作计数", "大 O 与 Theta", "复杂度类别示例", "排序算法", "绘图", "列表访问、哈希、模拟与总结"];
  const psetAfter = new Map([[1, 0], [5, 1], [9, 2], [14, 3], [19, 4], [24, 5]]);
  return topics.flatMap((topic, index) => {
    const lecture = index + 1;
    const tasks: PlanTask[] = [
      { id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${topic}`, titleZh: `第 ${lecture} 讲：${topicsZh[index]}`, url: `${base}/pages/material-by-lecture/`, kind: "session" },
      { id: `finger-exercise-${lecture}`, title: `Lecture ${lecture} finger exercise`, titleZh: `第 ${lecture} 讲随堂练习`, url: `${base}/pages/material-by-lecture/`, kind: "assignment" },
    ];
    const pset = psetAfter.get(lecture);
    if (pset !== undefined) tasks.push({ id: `problem-set-${pset}`, title: `Problem Set ${pset}`, titleZh: `习题集 ${pset}`, url: `${base}/lists/problem-sets/`, kind: "assignment" });
    return tasks;
  });
}

function mit60002Tasks(): PlanTask[] {
  const base = "https://ocw.mit.edu/courses/6-0002-introduction-to-computational-thinking-and-data-science-fall-2016";
  const topics = [
    ["Introduction and optimization problems", "导论与优化问题"], ["Optimization problems", "优化问题"], ["Graph-theoretic models", "图论模型"],
    ["Stochastic thinking", "随机思维"], ["Random walks", "随机游走"], ["Monte Carlo simulation", "蒙特卡洛模拟"],
    ["Confidence intervals", "置信区间"], ["Sampling and standard error", "抽样与标准误差"], ["Understanding experimental data", "理解实验数据"],
    ["Understanding experimental data continued", "继续理解实验数据"], ["Introduction to machine learning", "机器学习导论"], ["Clustering", "聚类"],
    ["Classification", "分类"], ["Classification and statistical sins", "分类与统计误区"], ["Statistical sins and wrap-up", "统计误区与总结"],
  ] as const;
  const psetAfter = new Map([[3, 1], [5, 2], [8, 3], [11, 4], [14, 5]]);
  return topics.flatMap(([title, titleZh], index) => {
    const lecture = index + 1;
    const tasks: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${titleZh}`, url: `${base}/resources/lecture-videos/`, kind: "session" }];
    const pset = psetAfter.get(lecture);
    if (pset) tasks.push({ id: `problem-set-${pset}`, title: `Problem Set ${pset}`, titleZh: `习题集 ${pset}`, url: `${base}/pages/assignments`, kind: "assignment" });
    return tasks;
  });
}

function mit1805Tasks(): PlanTask[] {
  const base = "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022";
  const classes = [
    ["Counting", "计数"], ["Probability basics", "概率基础"], ["Conditional probability, independence, and Bayes' theorem", "条件概率、独立性与贝叶斯定理"],
    ["Discrete random variables and expected value", "离散随机变量与期望"], ["Variance and continuous random variables", "方差与连续随机变量"],
    ["Continuous random variables, LLN, and CLT", "连续随机变量、大数定律与中心极限定理"], ["Joint distributions, covariance, and correlation", "联合分布、协方差与相关性"],
    ["Exam 1 review", "第一次考试复习"], ["Exam 1", "第一次考试"], ["Statistics, likelihood, and MLE", "统计、似然与最大似然估计"],
    ["Bayesian updating with discrete priors", "离散先验的贝叶斯更新"], ["Predictive probabilities and odds", "预测概率与赔率"],
    ["Continuous priors and discrete data", "连续先验与离散数据"], ["Continuous data with continuous priors", "连续数据与连续先验"],
    ["Beta distributions and conjugate priors", "Beta 分布与共轭先验"], ["Choosing priors and probability intervals", "先验选择与概率区间"],
    ["NHST: rejection regions and z-test", "假设检验：拒绝域与 z 检验"], ["NHST: t-tests", "假设检验：t 检验"],
    ["Chi-square and ANOVA", "卡方检验与方差分析"], ["Comparing Bayes and NHST", "比较贝叶斯方法与假设检验"],
    ["Exam 2 review", "第二次考试复习"], ["Confidence intervals", "置信区间"], ["Confidence intervals continued", "继续学习置信区间"],
    ["Bootstrap confidence intervals", "Bootstrap 置信区间"], ["R quiz", "R 测验"], ["Linear and multiple regression", "线性与多元回归"], ["Final exam review", "期末考试复习"],
  ] as const;
  const problemSetAfter = new Map([[2, 1], [4, 2], [5, 3], [6, 4], [8, 5], [10, 6], [16, 7], [18, 8], [20, 9], [24, 10], [26, 11]]);
  const studioAfter = new Map([[2, 1], [4, 2], [5, 3], [8, 4], [12, 5], [15, 6], [17, 7], [19, 8], [22, 9], [24, 10]]);
  const classUrl = `${base}/pages/classes-reading-and-in-class-materials/`;
  const tasks = classes.flatMap(([title, titleZh], index) => {
    const classNumber = index + 1;
    const isExam = classNumber === 9 || classNumber === 25;
    const result: PlanTask[] = [{ id: `class-${classNumber}`, title: `Class ${classNumber}: ${title}`, titleZh: `第 ${classNumber} 课：${titleZh}`, url: isExam ? `${base}/pages/exams/` : classUrl, kind: isExam ? "exam" : "session" }];
    const studio = studioAfter.get(classNumber);
    if (studio) result.push({ id: `studio-${studio}`, title: `R Studio ${studio}`, titleZh: `R 实践 ${studio}`, url: `${base}/download/`, kind: "assignment" });
    const pset = problemSetAfter.get(classNumber);
    if (pset) result.push({ id: `problem-set-${pset}`, title: `Problem Set ${pset}`, titleZh: `习题集 ${pset}`, url: `${base}/pages/problem-sets/`, kind: "assignment" });
    if (classNumber === 21) result.push({ id: "exam-2", title: "Exam 2", titleZh: "第二次考试", url: `${base}/pages/exams/`, kind: "exam" });
    return result;
  });
  tasks.push({ id: "final-exam", title: "Final exam", titleZh: "期末考试", url: `${base}/pages/exams/`, kind: "exam" });
  return tasks;
}

function mit6042Tasks(): PlanTask[] {
  const base = "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010";
  const topics = ["Introduction and proofs", "Induction", "Strong induction", "Number theory I", "Number theory II", "Graph theory and coloring", "Matching problems", "Minimum spanning trees", "Communication networks", "Graph theory III", "Relations, partial orders, and scheduling", "Sums", "Sums and asymptotics", "Divide-and-conquer recurrences", "Linear recurrences", "Counting rules I", "Counting rules II", "Introduction to probability", "Conditional probability", "Independence", "Random variables", "Expectation I", "Expectation II", "Large deviations", "Random walks"];
  const topicsZh = ["导论与证明", "归纳法", "强归纳法", "数论（一）", "数论（二）", "图论与着色", "匹配问题", "最小生成树", "通信网络", "图论（三）", "关系、偏序与调度", "求和", "求和与渐近分析", "分治递推", "线性递推", "计数规则（一）", "计数规则（二）", "概率导论", "条件概率", "独立性", "随机变量", "期望（一）", "期望（二）", "大偏差", "随机游走"];
  const psetAfter = new Map([[2, 1], [4, 2], [6, 3], [8, 4], [10, 5], [12, 6], [14, 7], [16, 8], [18, 9], [20, 10], [22, 11], [24, 12]]);
  const tasks = topics.flatMap((title, index) => {
    const lecture = index + 1;
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${topicsZh[index]}`, url: `${base}/video_galleries/video-lectures/`, kind: "session" }];
    if (lecture <= 23) result.push({ id: `recitation-${lecture}`, title: `Recitation ${lecture}`, titleZh: `习题课 ${lecture}`, url: `${base}/resources/recitations/`, kind: "assignment" });
    const pset = psetAfter.get(lecture);
    if (pset) result.push({ id: `problem-set-${pset}`, title: `Problem Set ${pset}`, titleZh: `习题集 ${pset}`, url: `${base}/pages/assignments/`, kind: "assignment" });
    if (lecture === 12) result.push({ id: "midterm", title: "Midterm exam", titleZh: "期中考试", url: `${base}/pages/exams/`, kind: "exam" });
    return result;
  });
  tasks.push({ id: "final-exam", title: "Final exam", titleZh: "期末考试", url: `${base}/pages/exams/`, kind: "exam" });
  return tasks;
}

function mit1802Tasks(): PlanTask[] {
  const base = "https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010";
  const sections = [
    [1, 8, "Vectors, determinants, and planes", "向量、行列式与平面", "1.-vectors-and-matrices/part-a-vectors-determinants-and-planes"],
    [9, 14, "Matrices and systems of equations", "矩阵与方程组", "1.-vectors-and-matrices/part-b-matrices-and-systems-of-equations"],
    [15, 23, "Parametric equations for curves", "曲线的参数方程", "1.-vectors-and-matrices/part-c-parametric-equations-for-curves"],
    [24, 31, "Functions, tangent approximation, and optimization", "多元函数、切线近似与优化", "2.-partial-derivatives/part-a-functions-of-two-variables-tangent-approximation-and-optimization"],
    [32, 38, "Chain rule, gradient, and directional derivatives", "链式法则、梯度与方向导数", "2.-partial-derivatives/part-b-chain-rule-gradient-and-directional-derivatives"],
    [39, 46, "Lagrange multipliers and constrained differentials", "拉格朗日乘数与约束微分", "2.-partial-derivatives/part-c-lagrange-multipliers-and-constrained-differentials"],
    [47, 55, "Double integrals", "二重积分", "3.-double-integrals-and-line-integrals-in-the-plane/part-a-double-integrals"],
    [56, 64, "Vector fields and line integrals", "向量场与线积分", "3.-double-integrals-and-line-integrals-in-the-plane/part-b-vector-fields-and-line-integrals"],
    [65, 73, "Green's theorem", "格林定理", "3.-double-integrals-and-line-integrals-in-the-plane/part-c-greens-theorem"],
    [74, 78, "Triple integrals", "三重积分", "4.-triple-integrals-and-surface-integrals-in-3-space/part-a-triple-integrals"],
    [79, 87, "Flux and the divergence theorem", "通量与散度定理", "4.-triple-integrals-and-surface-integrals-in-3-space/part-b-flux-and-the-divergence-theorem"],
    [88, 98, "Line integrals and Stokes' theorem", "线积分与斯托克斯定理", "4.-triple-integrals-and-surface-integrals-in-3-space/part-c-line-integrals-and-stokes-theorem"],
  ] as const;
  const tasks: PlanTask[] = [];
  sections.forEach(([start, end, title, titleZh, path], sectionIndex) => {
    for (let session = start; session <= end; session += 1) tasks.push({ id: `session-${session}`, title: `Session ${session}: ${title}`, titleZh: `第 ${session} 讲：${titleZh}`, url: `${base}/pages/${path}/`, kind: "session" });
    const pset = sectionIndex + 1;
    tasks.push({ id: `problem-set-${pset}`, title: `Problem Set ${pset}`, titleZh: `习题集 ${pset}`, url: `${base}/resources/problem-sets/`, kind: "assignment" });
    if (pset % 3 === 0) {
      const exam = pset / 3;
      tasks.push({ id: `exam-${exam}`, title: `Exam ${exam}`, titleZh: `考试 ${exam}`, url: `${base}/pages/exams/`, kind: "exam" });
    }
  });
  tasks.push({ id: "final-review", title: "Final exam review", titleZh: "期末考试复习", url: `${base}/resources/lecture-videos/`, kind: "session" });
  tasks.push({ id: "final-exam", title: "Final exam", titleZh: "期末考试", url: `${base}/pages/exams/`, kind: "exam" });
  return tasks;
}

function mit801Tasks(): PlanTask[] {
  const base = "https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016";
  const lessons = ["Vectors", "1D kinematics: position and velocity", "1D kinematics: acceleration", "2D kinematics", "Newton's laws of motion", "Gravity", "Contact forces", "Tension and springs", "Circular motion: position and velocity", "Uniform circular motion", "Circular motion: acceleration", "Newton's second law and circular motion", "Pulleys and constraints", "Massive rope", "Resistive forces", "Momentum and impulse", "Conservation of momentum", "Center of mass and motion", "Relative velocity and recoil", "Continuous mass transfer", "Kinetic energy and work in 1D", "Kinetic energy and work in 2D and 3D", "Conservative and non-conservative forces", "Potential energy", "Conservation of energy", "Potential energy diagrams", "Types of collision", "Elastic collisions", "Motion of a rigid body", "Moment of inertia", "Torque", "Rotational dynamics", "Angular momentum of a point particle", "Angular momentum of a rigid body", "Torque and angular impulse", "Rolling kinematics", "Rolling dynamics", "Rolling kinetic energy and angular momentum"];
  const lessonsZh = ["向量", "一维运动学：位置与速度", "一维运动学：加速度", "二维运动学", "牛顿运动定律", "重力", "接触力", "张力与弹簧", "圆周运动：位置与速度", "匀速圆周运动", "圆周运动：加速度", "牛顿第二定律与圆周运动", "滑轮与约束", "有质量的绳索", "阻力", "动量与冲量", "动量守恒", "质心与运动", "相对速度与反冲", "连续质量传递", "一维动能与功", "二维和三维动能与功", "保守力与非保守力", "势能", "能量守恒", "势能图", "碰撞类型", "弹性碰撞", "刚体运动", "转动惯量", "力矩", "转动动力学", "质点角动量", "刚体角动量", "力矩与角冲量", "滚动运动学", "滚动动力学", "滚动动能与角动量"];
  const weekEnds = new Map([[3, 1], [7, 2], [11, 3], [14, 4], [17, 5], [19, 6], [22, 7], [25, 8], [27, 9], [31, 10], [34, 11], [37, 12]]);
  return lessons.flatMap((title, index) => {
    const lesson = index;
    const tasks: PlanTask[] = [{ id: `lesson-${lesson}`, title: `Lesson ${lesson}: ${title}`, titleZh: `第 ${lesson} 课：${lessonsZh[index]}`, url: `${base}/resources/lecture-videos/`, kind: "session" }];
    const week = weekEnds.get(lesson);
    if (week) tasks.push({ id: `problem-set-${week}`, title: `Problem Set ${week}`, titleZh: `习题集 ${week}`, url: `${base}/pages/assignments/`, kind: "assignment" });
    return tasks;
  });
}

function mit5111Tasks(): PlanTask[] {
  const base = "https://ocw.mit.edu/courses/5-111sc-principles-of-chemical-science-fall-2014";
  const units = [
    [1, 7, "The atom", "原子"], [8, 17, "Chemical bonding and structure", "化学键与结构"],
    [18, 24, "Thermodynamics and chemical equilibrium", "热力学与化学平衡"],
    [25, 29, "Transition metals and oxidation-reduction reactions", "过渡金属与氧化还原反应"],
    [30, 35, "Chemical kinetics", "化学动力学"],
  ] as const;
  const examAfter = new Map([[7, 1], [17, 2], [24, 3], [31, 4]]);
  const tasks: PlanTask[] = [];
  for (const [start, end, title, titleZh] of units) {
    for (let lecture: number = start; lecture <= end; lecture += 1) {
      tasks.push({ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${titleZh}`, url: `${base}/pages/resource-index/`, kind: "session" });
      tasks.push({ id: `lecture-problems-${lecture}`, title: `Lecture ${lecture} problems`, titleZh: `第 ${lecture} 讲习题`, url: `${base}/resources/problem-sets/`, kind: "assignment" });
      const exam = examAfter.get(lecture);
      if (exam) tasks.push({ id: `exam-${exam}`, title: `Exam ${exam}`, titleZh: `考试 ${exam}`, url: `${base}/pages/exams/`, kind: "exam" });
    }
  }
  tasks.push({ id: "final-exam", title: "Final exam", titleZh: "期末考试", url: `${base}/pages/exams/`, kind: "exam" });
  return tasks;
}

function mit7012Tasks(): PlanTask[] {
  const base = "https://ocw.mit.edu/courses/7-012-introduction-to-biology-fall-2004";
  const topics = ["Introduction", "Biochemistry 1", "Biochemistry 2", "Biochemistry 3", "Biochemistry 4", "Genetics 1", "Genetics 2", "Genetics 3", "Human genetics", "Molecular biology 1", "Molecular biology 2", "Molecular biology 3", "Gene regulation", "Protein localization", "Recombinant DNA 1", "Recombinant DNA 2", "Recombinant DNA 3", "Recombinant DNA 4", "Cell cycle and signaling", "Cancer", "Virology and tumor viruses", "Immunology 1", "Immunology 2", "AIDS", "Genomics", "Nervous system 1", "Nervous system 2", "Nervous system 3", "Stem cells and cloning 1", "Stem cells and cloning 2", "Molecular medicine 1", "Molecular evolution", "Molecular medicine 2", "Human polymorphisms and cancer classification", "Future of biology"];
  const topicsZh = ["导论", "生物化学（一）", "生物化学（二）", "生物化学（三）", "生物化学（四）", "遗传学（一）", "遗传学（二）", "遗传学（三）", "人类遗传学", "分子生物学（一）", "分子生物学（二）", "分子生物学（三）", "基因调控", "蛋白质定位", "重组 DNA（一）", "重组 DNA（二）", "重组 DNA（三）", "重组 DNA（四）", "细胞周期与信号传导", "癌症", "病毒学与肿瘤病毒", "免疫学（一）", "免疫学（二）", "艾滋病", "基因组学", "神经系统（一）", "神经系统（二）", "神经系统（三）", "干细胞与克隆（一）", "干细胞与克隆（二）", "分子医学（一）", "分子进化", "分子医学（二）", "人类多态性与癌症分类", "生物学的未来"];
  const psetAfter = new Map([[5, 1], [10, 2], [15, 3], [20, 4], [25, 5], [30, 6], [35, 7]]);
  const quizAfter = new Map([[10, 1], [17, 2], [24, 3]]);
  const tasks = topics.flatMap((title, index) => {
    const lecture = index + 1;
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${topicsZh[index]}`, url: `${base}/pages/readings/`, kind: "session" }];
    const pset = psetAfter.get(lecture);
    if (pset) result.push({ id: `problem-set-${pset}`, title: `Problem Set ${pset}`, titleZh: `习题集 ${pset}`, url: `${base}/pages/assignments`, kind: "assignment" });
    const quiz = quizAfter.get(lecture);
    if (quiz) result.push({ id: `quiz-${quiz}`, title: `Quiz ${quiz}`, titleZh: `测验 ${quiz}`, url: `${base}/pages/exams/`, kind: "exam" });
    return result;
  });
  tasks.push({ id: "final-exam", title: "Practice cumulative final exam", titleZh: "综合期末模拟考试", url: `${base}/pages/exams/`, kind: "exam" });
  return tasks;
}

function stanfordCs106bTasks(): PlanTask[] {
  const courseUrl = "https://see.stanford.edu/Course/CS106B";
  const sectionAfter = new Map([[3, 1], [5, 2], [8, 3], [11, 4], [16, 5], [17, 6], [19, 7], [22, 8], [25, 9]]);
  const programmingAfter = new Map([[3, "Simple C++"], [6, "ADTs"], [9, "Recursion"], [12, "Boggle"], [16, "Sorting"], [19, "Priority Queue"], [23, "Pathfinder"]]);
  const tasks = Array.from({ length: 27 }, (_, index) => index + 1).flatMap((lecture) => {
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}`, titleZh: `第 ${lecture} 讲`, url: courseUrl, kind: "session" }];
    const section = sectionAfter.get(lecture);
    if (section) result.push({ id: `section-assignment-${section}`, title: `Section Assignment ${section}`, titleZh: `习题课作业 ${section}`, url: courseUrl, kind: "assignment" });
    const programming = programmingAfter.get(lecture);
    if (programming) result.push({ id: `programming-assignment-${programming.toLowerCase().replaceAll(" ", "-")}`, title: `Programming Assignment: ${programming}`, titleZh: `编程作业：${programming}`, url: courseUrl, kind: "project" });
    if (lecture === 14) result.push({ id: "practice-midterm", title: "Practice midterm", titleZh: "期中模拟考试", url: courseUrl, kind: "exam" });
    return result;
  });
  tasks.push({ id: "practice-final", title: "Practice final", titleZh: "期末模拟考试", url: courseUrl, kind: "exam" });
  return tasks;
}

function stanfordCs107Tasks(): PlanTask[] {
  const courseUrl = "https://see.stanford.edu/Course/CS107";
  const sectionAfter = new Map([[6, 1], [8, 2], [11, 3], [12, 4], [16, 5], [18, 6], [21, 7], [26, 8]]);
  const projectsAfter = new Map([[2, "RSG"], [4, "Six Degrees"], [7, "Vector and Hashset"], [10, "RSS"], [12, "Raw Memory"], [17, "RSS Revisited"], [21, "Where Am I"], [24, "Python"]]);
  const tasks = Array.from({ length: 27 }, (_, index) => index + 1).flatMap((lecture) => {
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}`, titleZh: `第 ${lecture} 讲`, url: courseUrl, kind: "session" }];
    const section = sectionAfter.get(lecture);
    if (section) result.push({ id: `section-assignment-${section}`, title: `Section Assignment ${section}`, titleZh: `习题课作业 ${section}`, url: courseUrl, kind: "assignment" });
    const project = projectsAfter.get(lecture);
    if (project) result.push({ id: `programming-assignment-${project.toLowerCase().replaceAll(" ", "-")}`, title: `Programming Assignment: ${project}`, titleZh: `编程作业：${project}`, url: courseUrl, kind: "project" });
    if (lecture === 14) result.push({ id: "practice-midterm", title: "Practice midterm", titleZh: "期中模拟考试", url: courseUrl, kind: "exam" }, { id: "midterm", title: "Midterm", titleZh: "期中考试", url: courseUrl, kind: "exam" });
    return result;
  });
  tasks.push({ id: "practice-final", title: "Practice final", titleZh: "期末模拟考试", url: courseUrl, kind: "exam" });
  return tasks;
}

function stanfordCs223aTasks(): PlanTask[] {
  const courseUrl = "https://see.stanford.edu/Course/CS223A";
  const topics = [
    ["Course overview", "课程概述"],
    ["Spatial descriptions", "空间描述"],
    ["Homogeneous transforms", "齐次变换"],
    ["Manipulator kinematics I", "机械臂运动学（一）"],
    ["Manipulator kinematics II", "机械臂运动学（二）"],
    ["Jacobians I", "雅可比矩阵（一）"],
    ["Jacobians II", "雅可比矩阵（二）"],
    ["Jacobians and Scheinman arm demonstration", "雅可比矩阵与 Scheinman 机械臂演示"],
    ["Robots and vision", "机器人与视觉"],
    ["Trajectory planning", "轨迹规划"],
    ["Robot dynamics I", "机器人动力学（一）"],
    ["Robot dynamics and Lagrange equations", "机器人动力学与拉格朗日方程"],
    ["Control overview", "控制概述"],
    ["Robot control I", "机器人控制（一）"],
    ["Robot control II", "机器人控制（二）"],
    ["Compliance and force control", "顺应性与力控制"],
  ] as const;
  const assignmentAfter = new Map([[3, 1], [5, 2], [8, 3], [10, 4], [13, 5], [15, 6]]);

  return topics.flatMap(([title, titleZh], index) => {
    const lecture = index + 1;
    const tasks: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${titleZh}`, url: courseUrl, kind: "session" }];
    const assignment = assignmentAfter.get(lecture);
    if (assignment) tasks.push({ id: `assignment-${assignment}`, title: `Assignment ${assignment}`, titleZh: `作业 ${assignment}`, url: courseUrl, kind: "assignment" });
    return tasks;
  });
}

function stanfordCs229Tasks(): PlanTask[] {
  const courseUrl = "https://see.stanford.edu/Course/CS229";
  const topics = [
    ["Machine learning overview", "机器学习概述"], ["Linear regression and gradient descent", "线性回归与梯度下降"],
    ["Locally weighted regression and logistic regression", "局部加权回归与逻辑回归"], ["Generalized linear models", "广义线性模型"],
    ["Generative learning algorithms", "生成式学习算法"], ["Neural networks and SVM margins", "神经网络与支持向量机间隔"],
    ["SVM duality and kernels", "支持向量机对偶与核方法"], ["Soft-margin SVM and SMO", "软间隔支持向量机与 SMO"],
    ["Bias, variance, and uniform convergence", "偏差、方差与一致收敛"], ["VC dimension and model selection", "VC 维与模型选择"],
    ["Regularization and practical diagnostics", "正则化与实践诊断"], ["K-means and expectation maximization", "K 均值与期望最大化"],
    ["Gaussian mixtures and factor analysis", "高斯混合与因子分析"], ["PCA and dimensionality reduction", "主成分分析与降维"],
    ["SVD and independent component analysis", "奇异值分解与独立成分分析"], ["MDPs and dynamic programming", "马尔可夫决策过程与动态规划"],
    ["Continuous-state reinforcement learning", "连续状态强化学习"], ["LQR and dynamical systems", "线性二次调节与动力系统"],
    ["Kalman filtering and LQG", "卡尔曼滤波与线性二次高斯控制"], ["POMDPs and policy search", "部分可观测 MDP 与策略搜索"],
  ] as const;
  const problemSetAfter = new Map([[5, 1], [10, 2], [15, 3], [20, 4]]);
  const tasks = topics.flatMap(([title, titleZh], index) => {
    const lecture = index + 1;
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${titleZh}`, url: courseUrl, kind: "session" }];
    const problemSet = problemSetAfter.get(lecture);
    if (problemSet) result.push({ id: `problem-set-${problemSet}`, title: `Problem Set ${problemSet}`, titleZh: `习题集 ${problemSet}`, url: courseUrl, kind: "assignment" });
    if (lecture === 5) result.push({ id: "project-proposal", title: "Term project proposal", titleZh: "课程项目提案", url: courseUrl, kind: "project" });
    if (lecture === 14) result.push({ id: "project-milestone", title: "Term project milestone", titleZh: "课程项目阶段成果", url: courseUrl, kind: "project" });
    return result;
  });
  tasks.push(
    { id: "project-presentation", title: "Term project poster presentation", titleZh: "课程项目海报展示", url: courseUrl, kind: "project" },
    { id: "project-final-report", title: "Term project final report", titleZh: "课程项目最终报告", url: courseUrl, kind: "project" },
  );
  return tasks;
}

function stanfordEe261Tasks(): PlanTask[] {
  const courseUrl = "https://see.stanford.edu/Course/EE261";
  const units = [
    [1, 5, "Fourier series", "傅里叶级数"], [6, 11, "Fourier transform and convolution", "傅里叶变换与卷积"],
    [12, 14, "Distributions and generalized transforms", "分布与广义变换"], [15, 18, "Diffraction, crystallography, and sampling", "衍射、晶体学与采样"],
    [19, 22, "DFT and FFT", "离散傅里叶变换与快速傅里叶变换"], [23, 25, "Linear time-invariant systems", "线性时不变系统"],
    [26, 30, "Multidimensional transforms and imaging", "多维变换与成像"],
  ] as const;
  const problemSetAfter = new Map([[5, 1], [8, 2], [11, 3], [14, 4], [17, 5], [20, 6], [23, 7], [26, 8], [29, 9]]);
  const tasks: PlanTask[] = [];
  for (const [start, end, title, titleZh] of units) {
    for (let lecture: number = start; lecture <= end; lecture += 1) {
      tasks.push({ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${titleZh}`, url: courseUrl, kind: "session" });
      const problemSet = problemSetAfter.get(lecture);
      if (problemSet) tasks.push({ id: `problem-set-${problemSet}`, title: `Problem Set ${problemSet}`, titleZh: `习题集 ${problemSet}`, url: courseUrl, kind: "assignment" });
      if (lecture === 14) tasks.push(
        { id: "practice-midterm", title: "Practice midterm", titleZh: "期中模拟考试", url: courseUrl, kind: "exam" },
        { id: "midterm", title: "Midterm", titleZh: "期中考试", url: courseUrl, kind: "exam" },
      );
    }
  }
  tasks.push({ id: "final-exam", title: "Final exam", titleZh: "期末考试", url: courseUrl, kind: "exam" });
  return tasks;
}

function stanfordEe263Tasks(): PlanTask[] {
  const courseUrl = "https://see.stanford.edu/Course/EE263";
  const units = [
    [1, 4, "Linear functions and linear algebra review", "线性函数与线性代数复习"], [5, 8, "Least squares and least norm", "最小二乘与最小范数"],
    [9, 14, "Linear dynamical systems and eigenvectors", "线性动力系统与特征向量"], [15, 18, "SVD and dynamical systems with inputs", "奇异值分解与带输入动力系统"],
    [19, 20, "Controllability, observability, and state estimation", "可控性、可观性与状态估计"],
  ] as const;
  const homeworkAfter = new Map([[4, 1], [6, 2], [8, 3], [10, 4], [13, 5], [14, 6], [16, 7], [18, 8], [20, 9]]);
  const tasks: PlanTask[] = [];
  for (const [start, end, title, titleZh] of units) {
    for (let lecture: number = start; lecture <= end; lecture += 1) {
      tasks.push({ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${titleZh}`, url: courseUrl, kind: "session" });
      const homework = homeworkAfter.get(lecture);
      if (homework) tasks.push({ id: `homework-${homework}`, title: `Homework ${homework}`, titleZh: `作业 ${homework}`, url: courseUrl, kind: "assignment" });
      if (lecture === 10) tasks.push(
        { id: "practice-midterm", title: "Practice midterm", titleZh: "期中模拟考试", url: courseUrl, kind: "exam" },
        { id: "midterm", title: "Midterm", titleZh: "期中考试", url: courseUrl, kind: "exam" },
      );
    }
  }
  tasks.push(
    { id: "practice-final", title: "Practice final", titleZh: "期末模拟考试", url: courseUrl, kind: "exam" },
    { id: "final-exam", title: "Final exam", titleZh: "期末考试", url: courseUrl, kind: "exam" },
  );
  return tasks;
}

function stanfordEe364aTasks(): PlanTask[] {
  const courseUrl = "https://see.stanford.edu/Course/EE364A";
  const units = [
    [1, 2, "Introduction and convex sets", "导论与凸集"], [3, 4, "Convex functions", "凸函数"],
    [5, 7, "Convex optimization problems", "凸优化问题"], [8, 9, "Duality", "对偶"],
    [10, 13, "Applications: fitting, estimation, and geometry", "应用：拟合、估计与几何"], [14, 14, "Numerical linear algebra", "数值线性代数"],
    [15, 17, "Unconstrained and equality-constrained minimization", "无约束与等式约束最小化"], [18, 19, "Interior-point methods", "内点法"],
  ] as const;
  const workAfter = new Map([[4, 1], [6, 2], [8, 3], [10, 4], [12, 5], [14, 6], [16, 7], [19, 8]]);
  const reviewAfter = new Map([[2, 1], [4, 2], [6, 3], [8, 4], [10, 5], [13, 6], [14, 7], [16, 8], [19, 9]]);
  const tasks: PlanTask[] = [];
  for (const [start, end, title, titleZh] of units) {
    for (let lecture: number = start; lecture <= end; lecture += 1) {
      tasks.push({ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${titleZh}`, url: courseUrl, kind: "session" });
      const work = workAfter.get(lecture);
      if (work) tasks.push(
        { id: `reading-${work}`, title: `Reading assignment ${work}`, titleZh: `阅读任务 ${work}`, url: courseUrl, kind: "session" },
        { id: `homework-${work}`, title: `Homework ${work}`, titleZh: `作业 ${work}`, url: courseUrl, kind: "assignment" },
      );
      const review = reviewAfter.get(lecture);
      if (review) tasks.push({ id: `review-session-${review}`, title: `Review session ${review}`, titleZh: `复习课 ${review}`, url: courseUrl, kind: "session" });
    }
  }
  tasks.push(
    { id: "practice-final", title: "Practice final", titleZh: "期末模拟考试", url: courseUrl, kind: "exam" },
    { id: "final-exam", title: "Final exam", titleZh: "期末考试", url: courseUrl, kind: "exam" },
  );
  return tasks;
}

function stanfordEe364bTasks(): PlanTask[] {
  const courseUrl = "https://see.stanford.edu/Course/EE364B";
  const units = [
    [1, 4, "Subgradients and subgradient methods", "次梯度与次梯度方法"], [5, 8, "Cutting-plane and ellipsoid methods", "切平面法与椭球法"],
    [9, 10, "Primal and dual decomposition", "原始与对偶分解"], [11, 13, "Sequential convex programming and Newton methods", "序列凸规划与牛顿法"],
    [14, 15, "Convex-cardinality problems", "凸基数问题"], [16, 18, "Model predictive control and branch-and-bound", "模型预测控制与分支定界"],
  ] as const;
  const assignmentAfter = new Map([[4, 1], [5, 2], [7, 3], [11, 4], [14, 5], [17, 6], [18, 7]]);
  const projectAfter = new Map<number, readonly [string, string]>([
    [7, ["Initial project proposal", "项目初步提案"]], [12, ["Revised project proposal", "项目修订提案"]],
    [14, ["Midterm project progress report", "项目期中进度报告"]], [18, ["Final project report", "项目最终报告"]],
  ]);
  const tasks: PlanTask[] = [];
  for (const [start, end, title, titleZh] of units) {
    for (let lecture: number = start; lecture <= end; lecture += 1) {
      tasks.push({ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${titleZh}`, url: courseUrl, kind: "session" });
      const assignment = assignmentAfter.get(lecture);
      if (assignment) tasks.push({ id: `assignment-${assignment}`, title: `Assignment ${assignment}`, titleZh: `作业 ${assignment}`, url: courseUrl, kind: "assignment" });
      const project = projectAfter.get(lecture);
      if (project) tasks.push({ id: `project-${lecture}`, title: project[0], titleZh: project[1], url: courseUrl, kind: "project" });
    }
  }
  return tasks;
}

function stanfordCs109Tasks(): PlanTask[] {
  const courseUrl = "https://web.stanford.edu/class/cs109/";
  const topics = [
    [1, "Welcome", "课程介绍"], [2, "Conditioning and Bayes", "条件概率与贝叶斯"], [3, "Independence", "独立性"], [4, "Counting", "计数"],
    [5, "Binomial", "二项分布"], [6, "Moments", "矩"], [7, "Poisson", "泊松分布"], [8, "Continuous random variables", "连续随机变量"],
    [9, "Gaussian", "高斯分布"], [10, "Probabilistic models", "概率模型"], [11, "Inference", "推断"], [12, "General inference", "一般推断"],
    [13, "Multinomial", "多项分布"], [14, "Beta", "贝塔分布"], [15, "Central limit theorem", "中心极限定理"], [16, "Sampling and bootstrapping", "采样与自助法"],
    [17, "Algorithm analysis", "算法分析"], [18, "Information theory", "信息论"], [19, "Maximum likelihood estimation", "最大似然估计"], [20, "Logistic regression", "逻辑回归"],
    [21, "Comparing classifiers", "分类器比较"], [22, "Deep learning", "深度学习"], [24, "Diffusion", "扩散模型"], [25, "Reinforcement learning", "强化学习"],
    [26, "Machine learning review", "机器学习复习"], [27, "Future", "未来主题"], [28, "Final review", "期末复习"],
  ] as const;
  const problemSetAfter = new Map([[4, 1], [8, 2], [12, 3], [16, 4], [20, 5], [25, 6]]);
  const tasks = topics.flatMap(([lecture, title, titleZh]) => {
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${titleZh}`, url: courseUrl, kind: "session" }];
    const problemSet = problemSetAfter.get(lecture);
    if (problemSet) result.push({ id: `problem-set-${problemSet}`, title: `Problem Set ${problemSet}`, titleZh: `习题集 ${problemSet}`, url: courseUrl, kind: "assignment" });
    if (lecture === 10) result.push({ id: "midterm-1", title: "Midterm 1", titleZh: "期中考试 1", url: courseUrl, kind: "exam" });
    if (lecture === 20) result.push({ id: "midterm-2", title: "Midterm 2", titleZh: "期中考试 2", url: courseUrl, kind: "exam" });
    return result;
  });
  tasks.push({ id: "challenge", title: "Probability challenge", titleZh: "概率挑战", url: courseUrl, kind: "assignment" });
  tasks.push({ id: "final-exam", title: "Final exam", titleZh: "期末考试", url: courseUrl, kind: "exam" });
  return tasks;
}

function stanfordCs111Tasks(): PlanTask[] {
  const courseUrl = "https://web.stanford.edu/class/cs111/";
  const topics = ["Welcome", "Threads, processes, and dispatching", "Threads and processes continued", "Concurrency", "Locks and condition variables", "Implementing locks", "Deadlock", "Scheduling", "Linkers and dynamic linking", "Dynamic storage management", "Dynamic storage management continued", "Trust and operating systems", "Virtual memory", "Virtual memory continued", "Paging", "Demand paging", "Demand paging continued", "Magnetic disks", "File systems", "File systems continued I", "File systems continued II", "Directories and links", "File-system crash recovery", "Crash recovery continued", "Truth, trust, and technology", "Flash memory", "Virtual machines", "Course review"];
  const topicsZh = ["课程介绍", "线程、进程与调度", "线程与进程（续）", "并发", "锁与条件变量", "锁的实现", "死锁", "调度", "链接器与动态链接", "动态存储管理", "动态存储管理（续）", "信任与操作系统", "虚拟内存", "虚拟内存（续）", "分页", "请求分页", "请求分页（续）", "磁盘", "文件系统", "文件系统（续一）", "文件系统（续二）", "目录与链接", "文件系统崩溃恢复", "崩溃恢复（续）", "真实、信任与技术", "闪存", "虚拟机", "课程复习"];
  const assignmentAfter = new Map([[1, 0], [3, 1], [6, 2], [8, 3], [11, 4], [16, 5], [18, 6], [21, 7], [24, 8]]);
  const sectionAfter = new Map([[3, 1], [6, 2], [9, 3], [12, 4], [15, 5], [18, 6], [21, 7], [24, 8]]);
  const tasks = topics.flatMap((title, index) => {
    const lecture = index + 1;
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${topicsZh[index]}`, url: courseUrl, kind: "session" }];
    const assignment = assignmentAfter.get(lecture);
    if (assignment !== undefined) result.push({ id: `assignment-${assignment}`, title: `Assignment ${assignment}`, titleZh: `作业 ${assignment}`, url: courseUrl, kind: "assignment" });
    const section = sectionAfter.get(lecture);
    if (section) result.push({ id: `section-${section}`, title: `Section ${section}`, titleZh: `习题课 ${section}`, url: courseUrl, kind: "session" });
    if (lecture === 14) result.push({ id: "midterm", title: "Midterm exam", titleZh: "期中考试", url: courseUrl, kind: "exam" });
    return result;
  });
  tasks.push({ id: "final-exam", title: "Final exam", titleZh: "期末考试", url: courseUrl, kind: "exam" });
  return tasks;
}

function mit6004Tasks(): PlanTask[] {
  const courseUrl = "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/";
  const topics = ["Basics of Information", "The Digital Abstraction", "CMOS", "Combinational Logic", "Sequential Logic", "Finite State Machines", "Performance Measures", "Design Tradeoffs", "Designing an Instruction Set", "Assembly Language and Models of Computation", "Compilers", "Procedures and Stacks", "Building the Beta", "Caches and the Memory Hierarchy", "Pipelining the Beta", "Virtual Memory", "Virtualizing the Processor", "Devices and Interrupts", "Concurrency and Synchronization", "System-level Communication", "Parallel Processing"];
  const topicsZh = ["信息基础", "数字抽象", "CMOS", "组合逻辑", "时序逻辑", "有限状态机", "性能指标", "设计权衡", "指令集设计", "汇编语言与计算模型", "编译器", "过程与栈", "构建 Beta 处理器", "缓存与存储层次", "Beta 流水线", "虚拟内存", "处理器虚拟化", "设备与中断", "并发与同步", "系统级通信", "并行处理"];
  const worksheetUnits = new Set([1, 2, 3, 4, 5, 6, 7, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  return topics.flatMap((title, index) => {
    const unit = index + 1;
    const tasks: PlanTask[] = [{ id: `unit-${unit}`, title: `Unit ${unit}: ${title}`, titleZh: `单元 ${unit}：${topicsZh[index]}`, url: courseUrl, kind: "session" }];
    if (worksheetUnits.has(unit)) tasks.push({ id: `worksheet-${unit}`, title: `Unit ${unit} worksheet`, titleZh: `单元 ${unit} 练习单`, url: courseUrl, kind: "assignment" });
    return tasks;
  });
}

function mit6837Tasks(): PlanTask[] {
  const courseUrl = "https://ocw.mit.edu/courses/6-837-computer-graphics-fall-2012/";
  const topics = ["Introduction and Course Overview", "Bezier Curves and Splines", "Curve Properties, Conversion, and Surfaces", "Coordinates and Transformations", "Hierarchical Modeling", "Color", "Computer Animation: Skinning and Enveloping", "Particle Systems and ODEs", "ODE Solvers and Mass-Spring Modeling", "Implicit Integration and Collision Detection", "Collision Detection and Response", "Ray Casting and Rendering", "Ray Casting II", "Ray Tracing", "Acceleration Structures for Ray Casting", "Shading and Material Appearance", "Texture Mapping and Shaders", "Sampling, Aliasing, and Mipmaps", "Global Illumination and Monte Carlo", "Image-Based Rendering and Lighting", "Output Devices", "Graphics Pipeline and Rasterization", "Graphics Pipeline and Rasterization II", "Real-time Shadows", "Graphics Hardware and Computer Games"];
  const topicsZh = ["课程概述", "贝塞尔曲线与样条", "曲线性质、转换与曲面", "坐标与变换", "层次建模", "颜色", "计算机动画：蒙皮与包络", "粒子系统与常微分方程", "常微分方程求解与质点弹簧建模", "隐式积分与碰撞检测", "碰撞检测与响应", "光线投射与渲染", "光线投射（二）", "光线追踪", "光线投射加速结构", "着色与材质外观", "纹理映射与着色器", "采样、混叠与 Mipmap", "全局光照与蒙特卡洛", "基于图像的渲染与照明", "输出设备", "图形流水线与光栅化", "图形流水线与光栅化（二）", "实时阴影", "图形硬件与电脑游戏"];
  const assignmentAfter = new Map([[1, 0], [5, 1], [8, 2], [14, 3], [18, 4], [24, 5]]);
  const tasks = topics.flatMap((title, index) => {
    const lecture = index;
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${topicsZh[index]}`, url: `${courseUrl}pages/lecture-notes/`, kind: "session" }];
    const assignment = assignmentAfter.get(lecture);
    if (assignment !== undefined) result.push({ id: `assignment-${assignment}`, title: `Programming Assignment ${assignment}`, titleZh: `编程作业 ${assignment}`, url: `${courseUrl}pages/assignments/`, kind: "project" });
    if (lecture === 10) result.push({ id: "quiz", title: "Quiz using published prior-year papers", titleZh: "使用公开往年试题完成测验", url: `${courseUrl}pages/old-exams/`, kind: "exam" });
    return result;
  });
  tasks.push({ id: "final-exam", title: "Final exam using published prior-year papers", titleZh: "使用公开往年试题完成期末考试", url: `${courseUrl}pages/old-exams/`, kind: "exam" });
  return tasks;
}

function mit6824Tasks(): PlanTask[] {
  const courseUrl = "https://ocw.mit.edu/courses/6-824-distributed-computer-systems-engineering-spring-2006/";
  const topics = ["Introduction and OS review", "I/O concurrency and event-driven programming", "Event-driven programming continued", "Network file system", "RPC transparency", "Crash recovery", "Logging", "Cache consistency and locking", "Memory consistency", "First project conference", "Memory consistency continued", "Vector timestamps and version vectors", "Two-phase commit", "Paxos", "Viewstamped replication", "Harp", "Second project conference", "Frangipani", "Scalable lookup", "Wide-area storage", "Project implementation", "Project demonstrations", "Content distribution", "Distributed computing"];
  const topicsZh = ["导论与操作系统复习", "I/O 并发与事件驱动编程", "事件驱动编程（续）", "网络文件系统", "RPC 透明性", "崩溃恢复", "日志", "缓存一致性与锁", "内存一致性", "第一次项目讨论", "内存一致性（续）", "向量时间戳与版本向量", "两阶段提交", "Paxos", "视图戳复制", "Harp", "第二次项目讨论", "Frangipani", "可扩展查找", "广域存储", "项目实现", "项目演示", "内容分发", "分布式计算"];
  const labAfter = new Map([[1, 0], [3, 1], [5, 2], [7, 3], [9, 4], [12, 5]]);
  const projectAfter = new Map<number, readonly [string, string]>([
    [6, ["Submit project team list", "提交项目组名单"]], [8, ["Submit project proposal", "提交项目提案"]],
    [10, ["First project conference", "第一次项目讨论"]], [16, ["Submit first draft report", "提交第一版报告"]],
    [17, ["Second project conference", "第二次项目讨论"]], [19, ["Submit second draft report", "提交第二版报告"]],
    [22, ["Demonstrate project", "演示项目"]], [24, ["Submit completed project and final report", "提交完整项目与最终报告"]],
  ]);
  const tasks = topics.flatMap((title, index) => {
    const lecture = index + 1;
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title} and assigned reading`, titleZh: `第 ${lecture} 讲：${topicsZh[index]}与指定阅读`, url: `${courseUrl}pages/readings/`, kind: "session" }];
    const lab = labAfter.get(lecture);
    if (lab !== undefined) result.push({ id: `lab-${lab}`, title: `Lab ${lab}`, titleZh: `实验 ${lab}`, url: `${courseUrl}pages/labs/`, kind: "project" });
    const project = projectAfter.get(lecture);
    if (project) result.push({ id: `project-milestone-${lecture}`, title: project[0], titleZh: project[1], url: `${courseUrl}pages/projects/`, kind: "project" });
    if (lecture === 12) result.push({ id: "quiz-1", title: "Quiz 1 using published prior-year exam", titleZh: "使用公开往年试题完成测验 1", url: `${courseUrl}pages/exams/`, kind: "exam" });
    if (lecture === 20) result.push({ id: "quiz-2", title: "Quiz 2 using published prior-year exam", titleZh: "使用公开往年试题完成测验 2", url: `${courseUrl}pages/exams/`, kind: "exam" });
    return result;
  });
  return tasks;
}

function mit6858Tasks(): PlanTask[] {
  const courseUrl = "https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/";
  const topics = ["Introduction and Threat Models", "Control Hijacking Attacks", "Buffer Overflow Exploits and Defenses", "Privilege Separation", "Security Industry Guest Lecture", "Capabilities", "Sandboxing Native Code", "Web Security Model", "Securing Web Applications", "Symbolic Execution", "Ur/Web", "Network Security", "Network Protocols", "SSL and HTTPS", "Medical Software", "Side-Channel Attacks", "User Authentication", "Private Browsing", "Anonymous Communication", "Mobile Phone Security", "Data Tracking", "MIT IS&T Security Guest Lecture", "Security Economics", "Project Presentations"];
  const topicsZh = ["导论与威胁模型", "控制流劫持攻击", "缓冲区溢出攻击与防御", "权限分离", "安全行业专题", "能力机制", "原生代码沙箱", "Web 安全模型", "Web 应用安全", "符号执行", "Ur/Web", "网络安全", "网络协议", "SSL 与 HTTPS", "医疗软件", "侧信道攻击", "用户认证", "隐私浏览", "匿名通信", "移动设备安全", "数据追踪", "MIT IS&T 安全专题", "安全经济学", "项目展示"];
  const labAfter = new Map([[5, 1], [10, 2], [13, 3], [14, 4], [17, 5], [19, 6]]);
  const tasks = topics.flatMap((title, index) => {
    const lecture = index + 1;
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${topicsZh[index]}`, url: `${courseUrl}pages/lecture-videos/`, kind: "session" }];
    const lab = labAfter.get(lecture);
    if (lab) result.push({ id: `lab-${lab}`, title: `Lab ${lab}`, titleZh: `实验 ${lab}`, url: `${courseUrl}pages/labs/`, kind: "project" });
    if (lecture === 14) result.push(
      { id: "quiz-1", title: "Quiz 1", titleZh: "测验 1", url: `${courseUrl}pages/exams/`, kind: "exam" },
      { id: "project-proposal", title: "Final project proposal", titleZh: "期末项目提案", url: `${courseUrl}pages/final-project/`, kind: "project" },
    );
    if (lecture === 19) result.push({ id: "project-status", title: "Final project status update", titleZh: "期末项目进度更新", url: `${courseUrl}pages/final-project/`, kind: "project" });
    if (lecture === 21) result.push({ id: "quiz-2", title: "Quiz 2", titleZh: "测验 2", url: `${courseUrl}pages/exams/`, kind: "exam" });
    if (lecture === 24) result.push(
      { id: "project-presentation", title: "Final project presentation", titleZh: "期末项目展示", url: `${courseUrl}pages/final-project/`, kind: "project" },
      { id: "project-writeup", title: "Final project writeup and code", titleZh: "期末项目报告与代码", url: `${courseUrl}pages/final-project/`, kind: "project" },
    );
    return result;
  });
  return tasks;
}

function mit6s081Tasks(): PlanTask[] {
  const courseUrl = "https://pdos.csail.mit.edu/6.S081/2021/schedule.html";
  const topics = ["Introduction", "C and gdb", "OS organization and system calls", "Page tables", "Calling conventions and stack frames", "Isolation and system-call entry/exit", "Page faults", "Lab Q&A I", "Interrupts", "Multiprocessors and locking", "Scheduling I", "Scheduling II", "Lab Q&A II", "File systems", "Crash recovery", "File-system performance and fast recovery", "Virtual memory for applications", "OS organization", "Virtual machines", "Kernels and high-level languages", "Networking", "Meltdown", "Multi-core scalability and RCU", "Radiation tolerance research", "Course Q&A"];
  const topicsZh = ["导论", "C 与 gdb", "操作系统组织与系统调用", "页表", "调用约定与栈帧", "隔离与系统调用进入/退出", "缺页异常", "实验答疑（一）", "中断", "多处理器与锁", "调度（一）", "调度（二）", "实验答疑（二）", "文件系统", "崩溃恢复", "文件系统性能与快速恢复", "面向应用的虚拟内存", "操作系统组织", "虚拟机", "内核与高级语言", "网络", "Meltdown", "多核可扩展性与 RCU", "抗辐射研究", "课程答疑"];
  const labAfter = new Map([[1, "util"], [3, "syscall"], [5, "pgtbl"], [7, "traps"], [9, "cow"], [12, "thread"], [14, "net"], [18, "lock"], [20, "fs"], [21, "mmap"]]);
  let homework = 0;
  return topics.flatMap((title, index) => {
    const lecture = index + 1;
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title} and preparation`, titleZh: `第 ${lecture} 讲：${topicsZh[index]}与课前阅读`, url: courseUrl, kind: "session" }];
    if (lecture !== 2 && lecture !== 5) {
      homework += 1;
      result.push({ id: `homework-${homework}`, title: `Homework ${homework}`, titleZh: `课后题 ${homework}`, url: courseUrl, kind: "assignment" });
    }
    const lab = labAfter.get(lecture);
    if (lab) result.push({ id: `lab-${lab}`, title: `Lab: ${lab}`, titleZh: `实验：${lab}`, url: courseUrl, kind: "project" });
    return result;
  });
}

function mit6172Tasks(): PlanTask[] {
  const courseUrl = "https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/";
  const topics = ["Introduction and Matrix Multiplication", "Bentley's Rules", "Bit Hacks", "Architecture and Vectorization", "C to Assembly", "Multicore Programming", "Races and Parallelism", "Analysis of Multithreaded Algorithms", "What Compilers Can and Cannot Do", "Measurement and Timing", "Storage Allocation", "Parallel Storage Allocation", "The Cilk Runtime System", "Caching and Cache-Efficient Algorithms", "Cache-Oblivious Algorithms", "Nondeterministic Programming", "Synchronization without Locks", "DSLs and Autotuning", "Leiserchess Code Walk", "Speculative Parallelism and Project Strategies", "Guest Lecture I", "Graph Optimization", "Guest Lecture II"];
  const topicsZh = ["导论与矩阵乘法", "Bentley 规则", "位运算技巧", "体系结构与向量化", "从 C 到汇编", "多核编程", "竞争与并行性", "多线程算法分析", "编译器能做与不能做的事", "测量与计时", "存储分配", "并行存储分配", "Cilk 运行时系统", "缓存与缓存高效算法", "缓存无关算法", "非确定性编程", "无锁同步", "领域专用语言与自动调优", "Leiserchess 代码走查", "推测并行与项目并行化策略", "客座讲座（一）", "图优化", "客座讲座（二）"];
  const homeworkAfter = new Map([[1, 1], [3, 2], [5, 3], [7, 4], [9, 5], [11, 6], [13, 7], [15, 8], [17, 9], [21, 10]]);
  const recitationAfter = new Map([[1, 1], [3, 2], [7, 3], [9, 4], [10, 5], [11, 6], [13, 7], [15, 8], [17, 9], [21, 10]]);
  const projectAfter = new Map<number, readonly string[]>([[3, ["Project 1 beta writeup"]], [9, ["Project 1 final", "Project 2 beta"]], [13, ["Project 2 final", "Project 3 beta"]], [19, ["Project 3 final", "Project 4 beta 1"]], [21, ["Project 4 beta 1", "Project 4 beta 2"]], [23, ["Project 4 beta 2", "Project 4 final", "Student presentation"]]]);
  return topics.flatMap((title, index) => {
    const lecture = index + 1;
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${topicsZh[index]}`, url: `${courseUrl}pages/lecture-videos/`, kind: "session" }];
    const homework = homeworkAfter.get(lecture);
    if (homework) result.push({ id: `homework-${homework}`, title: `Homework ${homework}`, titleZh: `作业 ${homework}`, url: `${courseUrl}pages/assignments/`, kind: "assignment" });
    const recitation = recitationAfter.get(lecture);
    if (recitation) result.push({ id: `recitation-${recitation}`, title: `Recitation ${recitation}`, titleZh: `习题课 ${recitation}`, url: `${courseUrl}pages/recitation-problems/`, kind: "session" });
    for (const project of projectAfter.get(lecture) ?? []) result.push({ id: `project-${lecture}-${project.toLowerCase().replaceAll(" ", "-")}`, title: project, titleZh: project.replace("Project", "项目").replace("Student presentation", "学生展示"), url: `${courseUrl}pages/projects/`, kind: "project" });
    if (lecture === 11) result.push({ id: "quiz-1", title: "Quiz 1", titleZh: "测验 1", url: `${courseUrl}pages/quizzes/`, kind: "exam" });
    if (lecture === 19) result.push({ id: "quiz-2", title: "Quiz 2", titleZh: "测验 2", url: `${courseUrl}pages/quizzes/`, kind: "exam" });
    return result;
  });
}

function mit6830Tasks(): PlanTask[] {
  const courseUrl = "https://ocw.mit.edu/courses/6-830-database-systems-fall-2010/";
  const topics = ["Introduction", "The Relational Model", "Schema Design", "Introduction to Database Internals", "Database Operators and Query Processing", "Indexing and Access Methods", "Buffer Pool Design and Memory Management", "Join Algorithms", "Query Optimization", "Transactions and Locking", "Optimistic Concurrency Control", "Recovery I", "Recovery II", "Degrees of Consistency", "C-Store", "Distributed Transactions", "Parallel Databases", "Scientific Databases", "NoSQL", "ORM and DryadLINQ", "Streaming Databases", "Database as a Service", "Final Project Presentations"];
  const topicsZh = ["导论", "关系模型", "模式设计", "数据库内部原理", "数据库算子与查询处理", "索引与访问方法", "缓冲池设计与内存管理", "连接算法", "查询优化", "事务与锁", "乐观并发控制", "恢复（一）", "恢复（二）", "一致性等级", "C-Store", "分布式事务", "并行数据库", "科学数据库", "NoSQL", "ORM 与 DryadLINQ", "流式数据库", "数据库即服务", "期末项目展示"];
  const problemSetAfter = new Map([[4, 1], [10, 2], [21, 3]]);
  const labAfter = new Map([[7, 1], [11, 2], [15, 3]]);
  return topics.flatMap((title, index) => {
    const lecture = index + 1;
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title} and assigned reading`, titleZh: `第 ${lecture} 讲：${topicsZh[index]}与指定阅读`, url: `${courseUrl}pages/readings/`, kind: "session" }];
    const problemSet = problemSetAfter.get(lecture);
    if (problemSet) result.push({ id: `problem-set-${problemSet}`, title: `Problem Set ${problemSet}`, titleZh: `习题集 ${problemSet}`, url: `${courseUrl}pages/assignments/`, kind: "assignment" });
    const lab = labAfter.get(lecture);
    if (lab) result.push({ id: `lab-${lab}`, title: `Lab ${lab}`, titleZh: `实验 ${lab}`, url: `${courseUrl}pages/assignments/`, kind: "project" });
    if (lecture === 6) result.push({ id: "project-team", title: "Form final project team", titleZh: "组建期末项目团队", url: `${courseUrl}pages/assignments/project/`, kind: "project" });
    if (lecture === 11) result.push(
      { id: "project-proposal", title: "Final project proposal", titleZh: "期末项目提案", url: `${courseUrl}pages/assignments/project/`, kind: "project" },
      { id: "exam-1", title: "Exam 1", titleZh: "考试 1", url: `${courseUrl}pages/exams/`, kind: "exam" },
    );
    if (lecture === 21) result.push({ id: "exam-2", title: "Exam 2", titleZh: "考试 2", url: `${courseUrl}pages/exams/`, kind: "exam" });
    if (lecture === 23) result.push({ id: "final-project", title: "Complete and present final project", titleZh: "完成并展示期末项目", url: `${courseUrl}pages/assignments/project/`, kind: "project" });
    return result;
  });
}

function mit6033Tasks(): PlanTask[] {
  const courseUrl = "https://ocw.mit.edu/courses/6-033-computer-system-engineering-spring-2018/";
  const units = [
    [1, 7, "Operating systems", "操作系统"], [8, 13, "Computer networking", "计算机网络"],
    [14, 18, "Distributed systems", "分布式系统"], [19, 26, "Computer security", "计算机安全"],
  ] as const;
  const handsOnAfter = new Map([[3, 1], [6, 2], [9, 3], [10, 4], [13, 5], [18, 6], [20, 7]]);
  const critiqueAfter = new Map([[5, 1], [11, 2]]);
  const projectAfter = new Map<number, readonly [string, string]>([
    [5, ["Design project preliminary report: begin", "开始设计项目初步报告"]],
    [13, ["Submit design project preliminary report", "提交设计项目初步报告"]],
    [15, ["Prepare design project presentation", "准备设计项目展示"]],
    [23, ["Submit design project report", "提交设计项目报告"]],
    [24, ["Complete peer review", "完成同行评审"]],
  ]);
  const tasks: PlanTask[] = [];
  for (const [start, end, title, titleZh] of units) {
    for (let lecture: number = start; lecture <= end; lecture += 1) {
      tasks.push({ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${titleZh}`, url: `${courseUrl}pages/calendar/`, kind: "session" });
      const handsOn = handsOnAfter.get(lecture);
      if (handsOn) tasks.push({ id: `hands-on-${handsOn}`, title: `Hands-on Experiment ${handsOn}`, titleZh: `动手实验 ${handsOn}`, url: `${courseUrl}pages/calendar/`, kind: "assignment" });
      const critique = critiqueAfter.get(lecture);
      if (critique) tasks.push({ id: `system-critique-${critique}`, title: `System Critique ${critique}`, titleZh: `系统评析 ${critique}`, url: `${courseUrl}pages/calendar/`, kind: "assignment" });
      const project = projectAfter.get(lecture);
      if (project) tasks.push({ id: `design-project-${lecture}`, title: project[0], titleZh: project[1], url: `${courseUrl}pages/design-project/`, kind: "project" });
      if (lecture === 15) tasks.push({ id: "quiz-1", title: "Quiz 1", titleZh: "测验 1", url: `${courseUrl}pages/resource-index/`, kind: "exam" });
      if (lecture === 26) tasks.push({ id: "quiz-2", title: "Quiz 2", titleZh: "测验 2", url: `${courseUrl}pages/resource-index/`, kind: "exam" });
    }
  }
  return tasks;
}

function mit802Tasks(): PlanTask[] {
  const modules = [
    { slug: "course-v1%3AMITx%2B8.02.1x%2B1T2019/about", weeks: 7, title: "Electrostatics", titleZh: "静电学", topics: ["electric fields", "dipoles", "Gauss's law", "electric potential", "conductors and insulators", "capacitors", "dielectrics"], topicsZh: ["电场", "电偶极子", "高斯定律", "电势", "导体与绝缘体", "电容器", "电介质"] },
    { slug: "course-v1%3AMITx%2B8.02.2x%2B2T2018/about", weeks: 6, title: "Magnetic Fields and Forces", titleZh: "磁场与磁力", topics: ["DC circuits", "charges in magnetic fields", "sources of magnetic fields", "magnetic field calculation", "magnetic dipoles", "module synthesis"], topicsZh: ["直流电路", "磁场中的带电粒子", "磁场来源", "磁场计算", "磁偶极子", "单元综合"] },
    { slug: "course-v1%3AMITx%2B8.02.3x%2B1T2019/about", weeks: 10, title: "Maxwell's Equations", titleZh: "麦克斯韦方程组", topics: ["Faraday's law", "inductors", "DC circuits", "AC circuits", "displacement current", "Maxwell's equations", "electromagnetic waves", "radiation properties", "applications", "module synthesis"], topicsZh: ["法拉第定律", "电感器", "直流电路", "交流电路", "位移电流", "麦克斯韦方程组", "电磁波", "辐射性质", "应用", "单元综合"] },
  ] as const;
  const tasks: PlanTask[] = [];
  for (const courseModule of modules) {
    const url = `https://openlearninglibrary.mit.edu/courses/${courseModule.slug}`;
    for (let week = 1; week <= courseModule.weeks; week += 1) {
      const topic = courseModule.topics[week - 1];
      tasks.push({ id: `${courseModule.title.toLowerCase().replaceAll(" ", "-")}-week-${week}`, title: `${courseModule.title} week ${week}: ${topic}`, titleZh: `${courseModule.titleZh}第 ${week} 周：${courseModule.topicsZh[week - 1]}`, url, kind: "session" });
      tasks.push({ id: `${courseModule.title.toLowerCase().replaceAll(" ", "-")}-exercise-${week}`, title: `${courseModule.title} week ${week} exercises`, titleZh: `${courseModule.titleZh}第 ${week} 周练习`, url, kind: "assignment" });
    }
  }
  return tasks;
}

function mit6031Tasks(): PlanTask[] {
  const courseUrl = "https://web.mit.edu/6.031/www/fa21/";
  const topics = ["Static Checking", "Basic TypeScript", "Testing", "Code Review", "Version Control", "Specifications", "Designing Specifications", "Mutability & Immutability", "Avoiding Debugging", "Abstract Data Types", "Abstraction Functions & Rep Invariants", "Interfaces, Generics, & Enums", "Debugging", "Recursion", "Equality", "Map, Filter, Reduce", "Recursive Data Types", "Regular Expressions & Grammars", "Parsers", "Callbacks & Graphical User Interfaces", "Concurrency", "Promises", "Mutual Exclusion", "Message Passing", "Networking", "Little Languages I", "Little Languages II", "Ethical Software Engineering", "Team Version Control"];
  const topicsZh = ["静态检查", "TypeScript 基础", "测试", "代码审查", "版本控制", "规格说明", "设计规格说明", "可变性与不可变性", "避免调试", "抽象数据类型", "抽象函数与表示不变量", "接口、泛型与枚举", "调试", "递归", "相等性", "Map、Filter 与 Reduce", "递归数据类型", "正则表达式与文法", "解析器", "回调与图形用户界面", "并发", "Promise", "互斥", "消息传递", "网络", "小语言（一）", "小语言（二）", "软件工程伦理", "团队版本控制"];
  const problemSetAfter = new Map([[2, 0], [7, 1], [13, 2], [19, 3], [25, 4]]);
  return topics.flatMap((title, index) => {
    const reading = index + 1;
    const result: PlanTask[] = [{ id: `reading-${reading}`, title: `Reading ${reading}: ${title}`, titleZh: `阅读 ${reading}：${topicsZh[index]}`, url: `${courseUrl}general/toc.html`, kind: "session" }];
    const problemSet = problemSetAfter.get(reading);
    if (problemSet !== undefined) result.push({ id: `problem-set-${problemSet}`, title: `Problem Set ${problemSet}`, titleZh: `习题集 ${problemSet}`, url: courseUrl, kind: "assignment" });
    if (reading === 15) result.push({ id: "quiz-1", title: "Quiz 1", titleZh: "测验 1", url: courseUrl, kind: "exam" });
    if (reading === 21) result.push({ id: "project-start", title: "Star Battle project: design and implementation", titleZh: "Star Battle 项目：设计与实现", url: courseUrl, kind: "project" });
    if (reading === 29) result.push({ id: "project-finish", title: "Complete Star Battle project and reflection", titleZh: "完成 Star Battle 项目与反思", url: courseUrl, kind: "project" }, { id: "quiz-2", title: "Quiz 2", titleZh: "测验 2", url: courseUrl, kind: "exam" });
    return result;
  });
}

function mit6036Tasks(): PlanTask[] {
  const courseUrl = "https://openlearninglibrary.mit.edu/courses/course-v1%3AMITx%2B6.036%2B1T2019/course/";
  const topics = ["Basics and linear classifiers", "Perceptrons", "Feature representation", "Margin maximization", "Regression", "Neural networks I", "Neural networks II", "Convolutional neural networks", "State machines and Markov decision processes", "Reinforcement learning", "Recurrent neural networks", "Recommender systems", "Decision trees and nearest neighbors"];
  const topicsZh = ["基础与线性分类器", "感知机", "特征表示", "间隔最大化", "回归", "神经网络（一）", "神经网络（二）", "卷积神经网络", "状态机与马尔可夫决策过程", "强化学习", "循环神经网络", "推荐系统", "决策树与最近邻"];
  return topics.flatMap((title, index) => {
    const week = index + 1;
    const result: PlanTask[] = [
      { id: `week-${week}`, title: `Week ${week}: ${title}`, titleZh: `第 ${week} 周：${topicsZh[index]}`, url: courseUrl, kind: "session" },
      { id: `exercises-${week}`, title: `Week ${week} exercises`, titleZh: `第 ${week} 周练习`, url: courseUrl, kind: "assignment" },
    ];
    if (week >= 2) result.push({ id: `lab-${week}`, title: `Week ${week} lab`, titleZh: `第 ${week} 周实验`, url: courseUrl, kind: "project" });
    if (week <= 12) result.push({ id: `homework-${week}`, title: `Week ${week} homework`, titleZh: `第 ${week} 周作业`, url: courseUrl, kind: "assignment" });
    return result;
  });
}

function mit6253Tasks(): PlanTask[] {
  const courseUrl = "https://ocw.mit.edu/courses/6-253-convex-analysis-and-optimization-spring-2012/";
  const topics = ["Role of convexity, duality, and algorithms", "Convex sets, functions, and epigraphs", "Differentiable convex functions and convex hulls", "Relative interiors, closures, and continuity", "Recession cones and existence of solutions", "Closed-set intersections and hyperplanes", "Separation and conjugate functions", "Min common/max crossing duality", "Minimax and zero-sum games", "Farkas lemma and programming duality", "Fenchel and conic duality", "Subgradients and optimality conditions", "Problem structure and conic programming", "Semidefinite programming and descent", "Subgradient methods", "Approximate subgradient and cutting-plane methods", "Simplicial decomposition", "Generalized polyhedral approximation", "Proximal minimization", "Bundle and augmented-Lagrangian methods", "Interior-point methods", "Incremental methods", "Gradient projection and complexity", "Mirror and entropic descent", "Convex analysis and optimization synthesis"];
  const topicsZh = ["凸性、对偶与算法的作用", "凸集、凸函数与上图", "可微凸函数与凸包", "相对内部、闭包与连续性", "衰退锥与解的存在性", "闭集交与超平面", "分离与共轭函数", "最小公共值/最大交叉值对偶", "极小极大与零和博弈", "Farkas 引理与规划对偶", "Fenchel 对偶与锥对偶", "次梯度与最优性条件", "问题结构与锥规划", "半定规划与下降法", "次梯度方法", "近似次梯度与切平面法", "单纯形分解", "广义多面体近似", "近端最小化", "束方法与增广拉格朗日法", "内点法", "增量方法", "梯度投影与复杂度", "镜像下降与熵下降", "凸分析与优化综合"];
  const homeworkAfter = new Map([[5, 1], [10, 2], [15, 3], [20, 4], [24, 5]]);
  return topics.flatMap((title, index) => {
    const lecture = index + 1;
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${topicsZh[index]}`, url: `${courseUrl}pages/lecture-notes/`, kind: "session" }];
    const homework = homeworkAfter.get(lecture);
    if (homework) result.push({ id: `homework-${homework}`, title: `Homework ${homework}`, titleZh: `作业 ${homework}`, url: `${courseUrl}resources/assignments/`, kind: "assignment" });
    if (lecture === 13) result.push({ id: "midterm", title: "Midterm exam", titleZh: "期中考试", url: `${courseUrl}resources/exams/`, kind: "exam" });
    return result;
  });
}

function princetonCos126Tasks(): PlanTask[] {
  const scheduleUrl = "https://www.cs.princeton.edu/courses/archive/spr26/cos126/schedule/";
  const assignmentUrl = "https://www.cs.princeton.edu/courses/archive/spr26/cos126/assignments/";
  const topics = ["Introduction and Hello, World", "Data Types", "Conditionals", "Loops", "Arrays", "Input and Output", "Functions", "Libraries and Clients", "Recursion", "Performance", "Using Data Types", "Creating Data Types", "Designing Data Types", "Algorithms", "Data Structures", "Theory of Computing", "Introduction to Machine Learning", "Introduction to Deep Learning", "TOY I", "TOY II", "Circuits"];
  const topicsZh = ["课程介绍与 Hello, World", "数据类型", "条件语句", "循环", "数组", "输入与输出", "函数", "库与客户端", "递归", "性能", "使用数据类型", "创建数据类型", "设计数据类型", "算法", "数据结构", "计算理论", "机器学习导论", "深度学习导论", "TOY（一）", "TOY（二）", "电路"];
  const assignments = new Map<number, readonly [number, string, string]>([[1, [0, "Hello, World", "Hello, World"]], [3, [1, "Conditionals and Loops", "条件与循环"]], [6, [2, "Arrays and Input/Output", "数组与输入输出"]], [8, [3, "Conjunction Function", "合取函数"]], [10, [4, "Recursion", "递归"]], [12, [5, "Object Oriented Programming", "面向对象编程"]], [14, [6, "Guitar Hero", "吉他英雄"]], [16, [7, "Chat126", "Chat126"]], [18, [8, "Image Classifier", "图像分类器"]], [20, [9, "Hamming Codes in TOY", "TOY 汉明码"]]]);
  return topics.flatMap((title, index) => {
    const lecture = index + 1;
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${topicsZh[index]}`, url: scheduleUrl, kind: "session" }];
    const assignment = assignments.get(lecture);
    if (assignment) result.push({ id: `assignment-${assignment[0]}`, title: `Assignment ${assignment[0]}: ${assignment[1]}`, titleZh: `作业 ${assignment[0]}：${assignment[2]}`, url: assignmentUrl, kind: "assignment" });
    if (lecture === 10) result.push({ id: "midterm", title: "Midterm exam", titleZh: "期中考试", url: "https://www.cs.princeton.edu/courses/archive/spr26/cos126/exams/", kind: "exam" });
    if (lecture === 21) result.push({ id: "programming-exam", title: "Programming exam", titleZh: "编程考试", url: "https://www.cs.princeton.edu/courses/archive/spr26/cos126/exams/", kind: "exam" }, { id: "atomic-project", title: "Atomic project", titleZh: "Atomic 课程项目", url: "https://www.cs.princeton.edu/courses/archive/spr26/cos126/project/", kind: "project" }, { id: "final-exam", title: "Final exam", titleZh: "期末考试", url: "https://www.cs.princeton.edu/courses/archive/spr26/cos126/exams/", kind: "exam" });
    return result;
  });
}

function princetonCos226Tasks(): PlanTask[] {
  const lectureUrl = "https://www.cs.princeton.edu/courses/archive/spring26/cos226/lectures.php";
  const assignmentUrl = "https://www.cs.princeton.edu/courses/archive/spring26/cos226/assignments.php";
  const topics = ["Introduction and Union–Find", "Analysis of Algorithms", "Stacks and Queues I: Resizable Arrays", "Stacks and Queues II: Linked Lists", "Elementary Sorts", "Mergesort", "Quicksort", "Priority Queues", "Elementary Symbol Tables and BSTs", "Balanced Search Trees", "Geometric Applications of BSTs", "Hash Tables", "Graphs and Digraphs I", "Graphs and Digraphs II", "Minimum Spanning Trees", "Shortest Paths", "Dynamic Programming", "Maxflows and Mincuts", "Multiplicative Weights", "Randomness", "Intractability", "Algorithm Design"];
  const topicsZh = ["导论与并查集", "算法分析", "栈与队列（一）：可变数组", "栈与队列（二）：链表", "初级排序", "归并排序", "快速排序", "优先队列", "初级符号表与二叉搜索树", "平衡搜索树", "二叉搜索树的几何应用", "哈希表", "图与有向图（一）", "图与有向图（二）", "最小生成树", "最短路径", "动态规划", "最大流与最小割", "乘法权重法", "随机性", "计算困难性", "算法设计"];
  const assignments = new Map<number, readonly [number, string, string]>([[1, [1, "Percolation", "渗流"]], [3, [2, "Queues", "队列"]], [7, [3, "Autocomplete", "自动补全"]], [11, [4, "K-d Trees", "K-d 树"]], [12, [5, "WordNet", "WordNet"]], [16, [6, "Seam Carving", "接缝裁剪"]], [21, [7, "Fraud Detection", "欺诈检测"]]]);
  return topics.flatMap((title, index) => {
    const lecture = index + 1;
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${topicsZh[index]}`, url: lectureUrl, kind: "session" }];
    const assignment = assignments.get(lecture);
    if (assignment) result.push({ id: `assignment-${assignment[0]}`, title: `Assignment ${assignment[0]}: ${assignment[1]}`, titleZh: `作业 ${assignment[0]}：${assignment[2]}`, url: assignmentUrl, kind: "project" });
    if (lecture === 10) result.push({ id: "midterm", title: "Midterm exam", titleZh: "期中考试", url: "https://www.cs.princeton.edu/courses/archive/spring26/cos226/exams.php", kind: "exam" });
    if (lecture === 22) result.push({ id: "final-exam", title: "Final exam", titleZh: "期末考试", url: "https://www.cs.princeton.edu/courses/archive/spring26/cos226/exams.php", kind: "exam" });
    return result;
  });
}

function princetonCos217Tasks(): PlanTask[] {
  const classUrl = "https://www.cs.princeton.edu/courses/archive/spring25/cos217/classes.php";
  const assignmentUrl = "https://www.cs.princeton.edu/courses/archive/spring25/cos217/assignments.php";
  const topics = ["Course introduction, Linux, and bash", "Git and introduction to C", "Building C programs and DFAs", "C program design and logical operators", "Numeric data types", "Pointers, arrays, and strings", "Building with make", "Structs, arguments, and dynamic memory", "Testing", "Data structures", "Debugging", "Modularity", "Testing and modularity", "Assignment 4 design", "Storage hierarchy", "Assembly language I", "Assembly language II", "Assembly functions", "Assignment 5 design", "Performance", "Assignment 6 design", "Machine language", "Assembler and linker"];
  const topicsZh = ["课程介绍、Linux 与 bash", "Git 与 C 语言导论", "构建 C 程序与确定有限自动机", "C 程序设计与逻辑运算", "数值数据类型", "指针、数组与字符串", "使用 make 构建", "结构体、参数与动态内存", "测试", "数据结构", "调试", "模块化", "测试与模块化", "作业 4 设计", "存储层次结构", "汇编语言（一）", "汇编语言（二）", "汇编函数", "作业 5 设计", "性能", "作业 6 设计", "机器语言", "汇编器与链接器"];
  const assignments = new Map<number, readonly [number, string, string]>([[3, [0, "Introductory Survey", "入门练习"]], [5, [1, "A De-Comment Program", "去注释程序"]], [9, [2, "A String Module and Client", "字符串模块与客户端"]], [14, [3, "A Symbol Table Module", "符号表模块"]], [17, [4, "Directory and File Trees", "目录与文件树"]], [20, [5, "Assembly Language Programming and Testing", "汇编语言编程与测试"]], [23, [6, "A Buffer Overrun Attack", "缓冲区溢出攻击"]]]);
  return topics.flatMap((title, index) => {
    const lecture = index + 1;
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${topicsZh[index]}`, url: classUrl, kind: "session" }];
    const assignment = assignments.get(lecture);
    if (assignment) result.push({ id: `assignment-${assignment[0]}`, title: `Assignment ${assignment[0]}: ${assignment[1]}`, titleZh: `作业 ${assignment[0]}：${assignment[2]}`, url: assignmentUrl, kind: "project" });
    if (lecture === 11) result.push({ id: "midterm", title: "Midterm exam", titleZh: "期中考试", url: "https://www.cs.princeton.edu/courses/archive/spring25/cos217/exams.php", kind: "exam" });
    if (lecture === 23) result.push({ id: "final-exam", title: "Final exam", titleZh: "期末考试", url: "https://www.cs.princeton.edu/courses/archive/spring25/cos217/exams.php", kind: "exam" });
    return result;
  });
}

function princetonCos240Tasks(): PlanTask[] {
  const courseUrl = "https://www.cs.princeton.edu/courses/archive/fall25/cos240/";
  const units = [
    [2, "Mathematical proofs", "数学证明"], [2, "Combinatorics", "组合数学"], [6, "Probability theory", "概率论"],
    [4, "Graph theory", "图论"], [2, "Game theory", "博弈论"], [1, "Countable and uncountable sets", "可数集与不可数集"],
    [7, "Computability, complexity, and cryptography", "可计算性、复杂性与密码学"],
  ] as const;
  const tasks: PlanTask[] = [];
  let lecture = 1;
  for (const [count, title, titleZh] of units) {
    for (let part = 1; part <= count; part += 1) {
      tasks.push({ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}${count > 1 ? `, part ${part}` : ""}`, titleZh: `第 ${lecture} 讲：${titleZh}${count > 1 ? `（${part}）` : ""}`, url: courseUrl, kind: "session" });
      lecture += 1;
    }
    if (title === "Probability theory") tasks.push({ id: "midterm", title: "Midterm exam", titleZh: "期中考试", url: courseUrl, kind: "exam" });
  }
  return tasks;
}

function sequencedCourseTasks(courseUrl: string, topics: readonly string[], topicsZh: readonly string[], assignments: ReadonlyMap<number, number>, assignmentUrl: string, examAfter: ReadonlyMap<number, string>): PlanTask[] {
  return topics.flatMap((title, index) => {
    const lecture = index + 1;
    const result: PlanTask[] = [{ id: `lecture-${lecture}`, title: `Lecture ${lecture}: ${title}`, titleZh: `第 ${lecture} 讲：${topicsZh[index]}`, url: courseUrl, kind: "session" }];
    const assignment = assignments.get(lecture);
    if (assignment) result.push({ id: `assignment-${assignment}`, title: `Assignment ${assignment}`, titleZh: `作业 ${assignment}`, url: assignmentUrl, kind: "assignment" });
    const exam = examAfter.get(lecture);
    if (exam) result.push({ id: exam === "Final exam" ? "final-exam" : `midterm-${lecture}`, title: exam, titleZh: exam === "Final exam" ? "期末考试" : "期中考试", url: courseUrl, kind: "exam" });
    return result;
  });
}

function princetonCos316Tasks(): PlanTask[] {
  const topics = ["What is a System?", "Course Overview", "Introduction to OS and Naming Memory", "Unix File System Naming", "Reasoning about OS Performance", "Layers of the Network", "Congestion Control I", "Congestion Control II: BBR", "Reasoning about Network Performance", "Web Caching", "Web Caching Continued", "Midterm Review I", "Midterm Review II", "Introduction to Concurrency", "Consistency Models", "Replicated State Machines", "Reasoning about Distributed-System Performance", "Access Control", "Network Access Control", "Systems for ML Overview", "Training", "Inference", "Tying It All Together"];
  const topicsZh = ["什么是系统", "课程概览", "操作系统导论与内存命名", "Unix 文件系统命名", "操作系统性能分析", "网络分层", "拥塞控制（一）", "拥塞控制（二）：BBR", "网络性能分析", "Web 缓存", "Web 缓存续篇", "期中复习（一）", "期中复习（二）", "并发导论", "一致性模型", "复制状态机", "分布式系统性能分析", "访问控制", "网络访问控制", "机器学习系统概览", "训练", "推理", "课程综合"];
  return sequencedCourseTasks("https://www.cs.princeton.edu/courses/archive/spring26/cos316/lectures.html", topics, topicsZh, new Map([[5, 1]]), "https://www.cs.princeton.edu/courses/archive/spring26/cos316/assignments.html", new Map([[11, "Midterm exam"], [23, "Final exam"]]));
}

function princetonCos324Tasks(): PlanTask[] {
  const topics = ["Introduction", "Linear Regression I", "Linear Regression II", "Features and Basis Functions", "Overfitting and Regularization", "Cross Validation", "Linear Classification I", "Linear Classification II", "Support Vector Machines", "Kernel-based Classification", "Neural Networks I", "Neural Networks II", "K-Means Clustering", "Hierarchical Clustering", "Principal Component Analysis", "Latent Factor Models", "Markov Decision Processes", "Value Iteration", "Policy Iteration", "Model-based Reinforcement Learning", "Model-free Reinforcement Learning", "Wrap-up"];
  const topicsZh = ["导论", "线性回归（一）", "线性回归（二）", "特征与基函数", "过拟合与正则化", "交叉验证", "线性分类（一）", "线性分类（二）", "支持向量机", "基于核的分类", "神经网络（一）", "神经网络（二）", "K-Means 聚类", "层次聚类", "主成分分析", "潜在因子模型", "马尔可夫决策过程", "价值迭代", "策略迭代", "基于模型的强化学习", "无模型强化学习", "课程总结"];
  return sequencedCourseTasks("https://www.cs.princeton.edu/courses/archive/fall18/cos324/", topics, topicsZh, new Map([[2, 1], [6, 2], [11, 3], [13, 4], [16, 5], [19, 6]]), "https://www.cs.princeton.edu/courses/archive/fall18/cos324/#assignments", new Map([[12, "Midterm exam"], [22, "Final exam"]]));
}

function princetonCos418Tasks(): PlanTask[] {
  const topics = ["Distributed Systems Introduction", "Course Overview", "Go Systems Programming", "Network Communication and RPC", "Failures and RPCs", "Concurrency in Go and MapReduce", "Time and Logical Clocks I", "Time and Logical Clocks II", "RPCs in Go", "Distributed Snapshots", "Eventual Consistency and Bayou", "Snapshot Precept", "Peer-to-Peer Systems and DHTs", "Chord under Failures", "Bayou and Chord", "Replicated State Machines via Primary Backup", "View Changes and Consensus", "Consensus with Raft", "More Raft", "Raft Leader Election", "Strong Consistency", "Scalable Causal Consistency", "Raft Precept", "Atomic Commit and Concurrency Control", "Spanner I", "Consistency Precept", "Spanner II", "Concurrency Control Precept", "CAP, PRAM, SNOW, PORT, and FLP", "System Performance", "Spanner and SNOW", "Blockchains", "Tying It All Together"];
  const topicsZh = ["分布式系统导论", "课程概览", "Go 系统编程", "网络通信与远程过程调用", "故障与远程过程调用", "Go 并发与 MapReduce", "时间与逻辑时钟（一）", "时间与逻辑时钟（二）", "Go 远程过程调用", "分布式快照", "最终一致性与 Bayou", "快照习题课", "对等系统与分布式哈希表", "故障下的 Chord", "Bayou 与 Chord", "主备复制状态机", "视图变更与共识", "Raft 共识", "Raft 进阶", "Raft 领导者选举", "强一致性", "可扩展因果一致性", "Raft 习题课", "原子提交与并发控制", "Spanner（一）", "一致性习题课", "Spanner（二）", "并发控制习题课", "CAP、PRAM、SNOW、PORT 与 FLP", "系统性能", "Spanner 与 SNOW", "区块链", "课程综合"];
  return sequencedCourseTasks("https://www.cs.princeton.edu/courses/archive/spring24/cos418/schedule.html", topics, topicsZh, new Map([[6, 1], [12, 2], [20, 3], [29, 4], [33, 5]]), "https://www.cs.princeton.edu/courses/archive/spring24/cos418/assignments.html", new Map([[17, "Midterm exam"], [33, "Final exam"]]));
}

function princetonCos423Tasks(): PlanTask[] {
  const topics = ["Counting in Binary and Efficiency", "Competitiveness and Self-adjusting Lists", "Binary Search Trees", "Balanced Binary Search Trees", "Self-Adjusting Search Trees", "Implicit and Pairing Heaps", "Rank-Pairing Heaps", "Shortest Paths I", "Shortest Paths II", "Minimum Spanning Trees", "Faster Minimum Spanning Trees", "Disjoint Sets and Compressed Trees", "Analysis of Path Compression", "Graph Search", "Strong Components and Blocks", "Dominators in Directed Graphs", "P, NP, and NP-Completeness", "Coping with NP-Completeness", "Graph Matching", "Nonbipartite Matching", "Maximum Flow", "Minimum-Cost Matchings and Flows", "Odds and Ends I", "Odds and Ends II"];
  const topicsZh = ["二进制计数与效率", "竞争性与自调整链表", "二叉搜索树", "平衡二叉搜索树", "自调整搜索树", "隐式堆与配对堆", "秩配对堆", "最短路径（一）", "最短路径（二）", "最小生成树", "更快的最小生成树", "不相交集合与压缩树", "路径压缩分析", "图搜索", "强连通分量与块", "有向图支配点", "P、NP 与 NP 完全性", "应对 NP 完全性", "图匹配", "非二分图匹配", "最大流", "最小费用匹配与流", "其他专题（一）", "其他专题（二）"];
  return sequencedCourseTasks("https://www.cs.princeton.edu/courses/archive/spring11/cos423/lectures.php", topics, topicsZh, new Map([[4, 1], [8, 2], [13, 3], [15, 4], [18, 5], [23, 6]]), "https://www.cs.princeton.edu/courses/archive/spr11/cos423/assignments.php", new Map());
}

function princetonCos432Tasks(): PlanTask[] {
  const topics = ["Message Integrity and Pseudorandom Functions", "Randomness, Pseudorandomness, and Stream Ciphers", "Block Ciphers", "Key Exchange and Key Management", "Public-Key Cryptography", "Authenticated Encryption", "Side Channels", "Guest Lecture I", "Guest Lecture II", "Authenticating People", "Information Flow Control", "Voting Security", "Web Security", "Operating-System Security", "Malware", "Cryptocurrencies I", "Cryptocurrencies II", "Privacy", "Big Data and Privacy", "Quantum Computing and Security", "Security, Economics, and Policy"];
  const topicsZh = ["消息完整性与伪随机函数", "随机性、伪随机性与流密码", "分组密码", "密钥交换与密钥管理", "公钥密码学", "认证加密", "侧信道", "客座讲座（一）", "客座讲座（二）", "人员认证", "信息流控制", "投票安全", "Web 安全", "操作系统安全", "恶意软件", "加密货币（一）", "加密货币（二）", "隐私", "大数据与隐私", "量子计算与安全", "安全、经济与政策"];
  return sequencedCourseTasks("https://www.cs.princeton.edu/courses/archive/fall19/cos432/schedule/", topics, topicsZh, new Map([[4, 1], [6, 2], [11, 3], [15, 4], [17, 5], [21, 6]]), "https://www.cs.princeton.edu/courses/archive/fall19/cos432/assignments/", new Map([[11, "Midterm exam"]]));
}

function princetonCos461Tasks(): PlanTask[] {
  const topics = ["Introduction", "Fundamental Network Concepts", "Routing Foundations", "Network Foundations Practice", "Ethernet and Switching", "Link-Layer Practice", "Routing Project and Internet Protocol", "IP and Forwarding", "Internet Routing I", "Internet Routing II", "Routing Project Workshop", "Routing Policies", "Routing Hackathon I", "Routing Hackathon II", "BGP Challenges and Solutions", "Reliable Transport Foundations", "Internet Congestion Control I", "Internet Congestion Control II", "Applications: DNS", "Applications: HTTP and Video", "Wireless Networks", "Network Security", "Datacenter Networks", "Machine Learning for Networks", "Course Recap"];
  const topicsZh = ["导论", "网络基本概念", "路由基础", "网络基础练习", "以太网与交换", "链路层练习", "路由项目与互联网协议", "IP 与转发", "互联网路由（一）", "互联网路由（二）", "路由项目工作坊", "路由策略", "路由黑客松（一）", "路由黑客松（二）", "BGP 挑战与解决方案", "可靠传输基础", "互联网拥塞控制（一）", "互联网拥塞控制（二）", "应用：DNS", "应用：HTTP 与视频", "无线网络", "网络安全", "数据中心网络", "网络机器学习", "课程回顾"];
  const tasks = sequencedCourseTasks("https://www.cs.princeton.edu/courses/archive/fall25/cos461/schedule.html", topics, topicsZh, new Map(), "https://www.cs.princeton.edu/courses/archive/fall25/cos461/schedule.html", new Map([[25, "Final exam"]]));
  tasks.splice(7, 0, { id: "project-1", title: "Project 1: Internet Routing", titleZh: "项目 1：互联网路由", url: "https://www.cs.princeton.edu/courses/archive/fall25/cos461/schedule.html", kind: "project" });
  tasks.splice(19, 0, { id: "project-2", title: "Project 2: Reliable Communication", titleZh: "项目 2：可靠通信", url: "https://www.cs.princeton.edu/courses/archive/fall25/cos461/schedule.html", kind: "project" });
  return tasks;
}

function princetonMat104Tasks(): PlanTask[] {
  const courseUrl = "https://web.math.princeton.edu/~nelson/104/";
  const topics = ["Substitution and Integration by Parts", "Partial Fractions", "Trigonometric Substitution", "Improper Integrals", "Tests for Convergence of Series", "Alternating Series and Absolute Convergence", "Power Series", "Taylor Series", "Complex Numbers", "First-Order Differential Equations", "Second-Order Differential Equations", "Volume, Length, and Surface Area"];
  const topicsZh = ["换元法与分部积分", "部分分式", "三角代换", "反常积分", "级数收敛判别", "交错级数与绝对收敛", "幂级数", "泰勒级数", "复数", "一阶微分方程", "二阶微分方程", "体积、长度与曲面面积"];
  const tasks: PlanTask[] = topics.flatMap((title, index) => [{ id: `week-${index + 1}`, title: `Week ${index + 1}: ${title}`, titleZh: `第 ${index + 1} 周：${topicsZh[index]}`, url: courseUrl, kind: "session" as const }, { id: `practice-${index + 1}`, title: `Week ${index + 1} official practice and corrections`, titleZh: `第 ${index + 1} 周官方练习与订正`, url: courseUrl, kind: "assignment" as const }]);
  tasks.push({ id: "midterm", title: "Official practice midterm", titleZh: "官方期中模拟题", url: courseUrl, kind: "exam" }, { id: "final", title: "Official practice final", titleZh: "官方期末模拟题", url: courseUrl, kind: "exam" });
  return tasks;
}

function princetonCos333Tasks(): PlanTask[] {
  const courseUrl = "https://www.cs.princeton.edu/courses/archive/spring26/cos333/schedule.html";
  const weeks = ["Course Overview and Python", "Python and Database Programming", "Database, Project, and Network Programming", "Concurrent Programming", "Server-Side Web Programming", "WSGI and Web Deployment", "JavaScript Language", "Client-Side JavaScript", "JavaScript and CSS", "Web Security", "Security and Server-Side Options", "Software Engineering I", "Software Engineering II and Conclusion"];
  const weeksZh = ["课程概览与 Python", "Python 与数据库编程", "数据库、项目与网络编程", "并发编程", "服务端 Web 编程", "WSGI 与 Web 部署", "JavaScript 语言", "客户端 JavaScript", "JavaScript 与 CSS", "Web 安全", "安全与服务端方案", "软件工程（一）", "软件工程（二）与总结"];
  const assignments = new Map([[3, 1], [5, 2], [7, 3], [11, 4]]);
  const projectMilestones = new Map<number, readonly [string, string][]>([
    [1, [["Learn requirements and form a project team", "了解需求并组建项目团队"]]],
    [3, [["Project approval proposal", "项目审批提案"]]],
    [5, [["Project overview, timeline, and team directory", "项目概述、时间线与团队目录"]]],
    [6, [["Project wireframes", "项目线框图"]]], [8, [["Ethical-impact study", "伦理影响研究"]]],
    [9, [["Prototype demonstration", "原型演示"]]], [11, [["Alpha demonstration", "Alpha 版本演示"]]],
    [13, [["Beta demonstration", "Beta 版本演示"]]],
  ]);
  const tasks = weeks.flatMap((title, index) => {
    const week = index + 1;
    const result: PlanTask[] = [{ id: `week-${week}`, title: `Week ${week}: ${title}`, titleZh: `第 ${week} 周：${weeksZh[index]}`, url: courseUrl, kind: "session" }];
    const assignment = assignments.get(week);
    if (assignment) result.push({ id: `assignment-${assignment}`, title: `Registrar Application ${assignment}`, titleZh: `教务系统应用作业 ${assignment}`, url: "https://www.cs.princeton.edu/courses/archive/spr26/cos333/assignments.html", kind: "project" });
    for (const [milestone, milestoneZh] of projectMilestones.get(week) ?? []) result.push({ id: `project-${week}-${result.length}`, title: milestone, titleZh: milestoneZh, url: "https://www.cs.princeton.edu/courses/archive/spring26/cos333/project.html", kind: "project" });
    return result;
  });
  tasks.push({ id: "project-presentation", title: "Final project presentation", titleZh: "期末项目展示", url: courseUrl, kind: "project" }, { id: "project-delivery", title: "Deliver source code, application, and evaluation documents", titleZh: "提交源代码、应用与评估文档", url: courseUrl, kind: "project" });
  return tasks;
}

function cornellCs3780Tasks(): PlanTask[] {
  const courseUrl = "https://www.cs.cornell.edu/courses/cs3780/2026sp/#Schedule";
  const topics = ["Introduction", "Machine-Learning Basics", "K-Nearest Neighbors and Dimensionality", "The Perceptron", "K-Means and Gaussian Mixtures", "Principal Component Analysis", "Maximum-Likelihood and MAP Estimation", "Naive Bayes", "Logistic Regression", "Gradient Descent and Newton's Method", "SGD, Momentum, and Adagrad", "Linear Regression", "Support Vector Machines", "Prelim Review", "Kernel Methods", "Empirical Risk Minimization and Model Selection", "Bias–Variance Tradeoff", "Learning Theory", "Decision Trees", "Bagging and Random Forests", "Boosting and AdaBoost", "Neural Networks I", "Neural Networks II", "Convolutional Neural Networks", "Language Modeling and Transformers", "Datasets and Machine Learning", "AI in Human Society"];
  const topicsZh = ["导论", "机器学习基础", "K 近邻与维数灾难", "感知机", "K-Means 与高斯混合", "主成分分析", "最大似然与 MAP 估计", "朴素贝叶斯", "逻辑回归", "梯度下降与牛顿法", "SGD、动量与 Adagrad", "线性回归", "支持向量机", "期中复习", "核方法", "经验风险最小化与模型选择", "偏差—方差权衡", "学习理论", "决策树", "装袋法与随机森林", "提升法与 AdaBoost", "神经网络（一）", "神经网络（二）", "卷积神经网络", "语言建模与 Transformer", "数据集与机器学习", "人工智能与人类社会"];
  const tasks = sequencedCourseTasks(courseUrl, topics, topicsZh, new Map([[4, 1], [9, 2], [11, 3], [16, 5], [19, 6], [22, 7]]), courseUrl, new Map([[14, "Midterm exam"], [27, "Final exam"]]));
  for (let project = 0; project <= 8; project += 1) tasks.push({ id: `project-${project}`, title: `Programming Project ${project}`, titleZh: `编程项目 ${project}`, url: courseUrl, kind: "project" });
  tasks.push({ id: "kaggle-project", title: "Kaggle Project", titleZh: "Kaggle 项目", url: courseUrl, kind: "project" });
  return tasks;
}

function cornellCs3410Tasks(): PlanTask[] {
  const courseUrl = "https://www.cs.cornell.edu/courses/cs3410/2026sp/schedule.html";
  const topics = ["Switches and Numbers", "Overview and C Introduction", "Types and Floating Point", "Bit Packing, Arrays, and Pointers", "Heap and Allocation", "Gates and Logic", "State", "FemtoProc and CPU", "RISC-V and Assembly", "Architecture and RISC-V Memory", "RISC-V Logic and Control Flow", "Calling Conventions I", "Calling Conventions II", "Caches I", "Caches II", "Processes", "System Calls and Signals", "Interrupts", "Virtual Memory", "Threads", "Synchronization", "Atomics", "Parallelism I", "Parallelism II", "Parallel Performance", "Rust I", "Rust II"];
  const topicsZh = ["开关与数值", "概览与 C 语言导论", "类型与浮点数", "位打包、数组与指针", "堆与内存分配", "逻辑门与逻辑", "状态", "FemtoProc 与 CPU", "RISC-V 与汇编", "体系结构与 RISC-V 内存", "RISC-V 逻辑与控制流", "调用约定（一）", "调用约定（二）", "缓存（一）", "缓存（二）", "进程", "系统调用与信号", "中断", "虚拟内存", "线程", "同步", "原子操作", "并行（一）", "并行（二）", "并行性能", "Rust（一）", "Rust（二）"];
  const tasks = sequencedCourseTasks(courseUrl, topics, topicsZh, new Map(), courseUrl, new Map([[8, "Midterm exam"], [19, "Midterm exam"], [27, "Final exam"]]));
  const names = ["Printf", "Minifloat", "Huffman", "CPU Simulator", "Assembly", "Assembly Functions", "Buffer Overflow", "Cache Simulator", "Subprocess", "Concurrent Hash Table", "Raycasting"];
  names.forEach((name, index) => {
    const number = index + 1;
    tasks.push({ id: `lab-${number}`, title: `Lab ${number}: ${name}`, titleZh: `实验 ${number}：${name}`, url: courseUrl, kind: "project" });
    tasks.push({ id: `assignment-${number}`, title: `Assignment ${number}: ${name}`, titleZh: `作业 ${number}：${name}`, url: courseUrl, kind: "assignment" });
  });
  return tasks;
}

function cornellCs4410Tasks(): PlanTask[] {
  const courseUrl = "https://www.cs.cornell.edu/courses/cs4410/2026su/";
  const topics = ["Operating-System Structure", "Concurrency", "Scheduling", "Synchronization", "Memory Management", "File Systems", "Security", "Networking"];
  const topicsZh = ["操作系统结构", "并发", "调度", "同步", "内存管理", "文件系统", "安全", "网络"];
  const tasks: PlanTask[] = topics.flatMap((title, index) => [{ id: `module-${index + 1}`, title: `Module ${index + 1}: ${title}`, titleZh: `模块 ${index + 1}：${topicsZh[index]}`, url: courseUrl, kind: "session" as const }, { id: `module-practice-${index + 1}`, title: `${title} practice`, titleZh: `${topicsZh[index]}练习`, url: courseUrl, kind: "assignment" as const }]);
  tasks.push({ id: "homework-1", title: "Public Homework 1", titleZh: "公开作业 1", url: "https://www.cs.cornell.edu/courses/cs4410/2026su/resources/hw1.pdf", kind: "assignment" }, { id: "prelim", title: "Prelim Exam", titleZh: "阶段考试", url: courseUrl, kind: "exam" }, { id: "final", title: "Final Exam", titleZh: "期末考试", url: courseUrl, kind: "exam" });
  return tasks;
}

function cornellCs6787Tasks(): PlanTask[] {
  const courseUrl = "https://www.cs.cornell.edu/courses/cs6787/2026sp/#course-calendar";
  const lectures = ["Overview and Stochastic Gradient Descent", "Backpropagation and ML Frameworks", "Hyperparameters and Tradeoffs", "Kernels and Dimensionality Reduction", "Adaptive Methods and Non-Convex Optimization", "Hyperparameter Optimization", "Parallelism", "Distributed Learning", "Low-Precision Arithmetic", "Inference and Compression", "ML Frameworks II", "Hardware for Machine Learning", "Modern Generative AI", "Large-Scale ML on the Cloud", "Final Project Discussion"];
  const lecturesZh = ["概览与随机梯度下降", "反向传播与机器学习框架", "超参数与权衡", "核方法与降维", "自适应方法与非凸优化", "超参数优化", "并行", "分布式学习", "低精度算术", "推理与压缩", "机器学习框架（二）", "机器学习硬件", "现代生成式人工智能", "云端大规模机器学习", "期末项目讨论"];
  const tasks: PlanTask[] = lectures.map((title, index) => ({ id: `lecture-${index + 1}`, title: `Lecture ${index + 1}: ${title}`, titleZh: `第 ${index + 1} 讲：${lecturesZh[index]}`, url: courseUrl, kind: "session" }));
  for (let discussion = 1; discussion <= 12; discussion += 1) {
    tasks.push({ id: `paper-discussion-${discussion}`, title: `Paper Discussion ${discussion}: two official assigned papers`, titleZh: `论文讨论 ${discussion}：两篇官方指定论文`, url: courseUrl, kind: "session" });
    if (discussion <= 11) tasks.push({ id: `paper-review-${discussion}`, title: `Write Paper Review ${discussion}`, titleZh: `撰写论文评审 ${discussion}`, url: courseUrl, kind: "assignment" });
  }
  tasks.push({ id: "project-proposal", title: "Final Project Proposal and Experiment Plan", titleZh: "期末项目提案与实验计划", url: courseUrl, kind: "project" }, { id: "project-abstract", title: "Final Project Abstract Draft", titleZh: "期末项目摘要草稿", url: courseUrl, kind: "project" }, { id: "project-report", title: "Final Project Report and Evaluation", titleZh: "期末项目报告与评估", url: courseUrl, kind: "project" });
  return tasks;
}

function cornellCs2110Tasks(): PlanTask[] {
  const courseUrl = "https://www.cs.cornell.edu/courses/cs2110/2026sp/";
  const topics = ["Introduction to Java", "Reference Types and Semantics", "Method Specifications and Testing", "Loop Invariants", "Analyzing Complexity", "Recursion", "Sorting Algorithms", "Classes and Encapsulation", "Interfaces and Polymorphism", "Inheritance", "Additional Java Features", "Collections and Generics", "Linked Data", "Iterating over Data Structures", "Stacks and Queues", "Trees and Their Iterators", "Binary Search Trees", "Heaps and Priority Queues", "Sets and Maps", "Hashing", "Graphs", "Graph Traversals", "Shortest Paths", "Graphical User Interfaces", "Event-Driven Programming", "Concurrency", "Synchronization"];
  const topicsZh = ["Java 导论", "引用类型与语义", "方法规格与测试", "循环不变量", "复杂度分析", "递归", "排序算法", "类与封装", "接口与多态", "继承", "Java 进阶特性", "集合与泛型", "链式数据", "数据结构迭代", "栈与队列", "树及其迭代器", "二叉搜索树", "堆与优先队列", "集合与映射", "哈希", "图", "图遍历", "最短路径", "图形用户界面", "事件驱动编程", "并发", "同步"];
  return topics.flatMap((title, index) => [{ id: `lecture-${index + 1}`, title: `${index + 1}. ${title}`, titleZh: `${index + 1}. ${topicsZh[index]}`, url: courseUrl, kind: "session" as const }, { id: `exercise-${index + 1}`, title: `Complete ${title} exercises`, titleZh: `完成${topicsZh[index]}练习`, url: courseUrl, kind: "assignment" as const }]);
}

function cornellCs3110Tasks(): PlanTask[] {
  const courseUrl = "https://cs3110.github.io/textbook/cover.html";
  const chapters = ["Better Programming Through OCaml", "The Basics of OCaml", "Data and Types", "Higher-Order Programming", "Modular Programming", "Mutability", "Concurrency", "Correctness", "Data Structures", "Interpreters"];
  const chaptersZh = ["通过 OCaml 改进编程", "OCaml 基础", "数据与类型", "高阶编程", "模块化编程", "可变性", "并发", "正确性", "数据结构", "解释器"];
  return chapters.flatMap((title, index) => [{ id: `chapter-${index + 1}`, title: `Chapter ${index + 1}: ${title}`, titleZh: `第 ${index + 1} 章：${chaptersZh[index]}`, url: courseUrl, kind: "session" as const }, { id: `chapter-exercises-${index + 1}`, title: `Chapter ${index + 1} exercises`, titleZh: `第 ${index + 1} 章练习`, url: courseUrl, kind: "assignment" as const }]);
}

function cornellCs4820Tasks(): PlanTask[] {
  const courseUrl = "https://www.cs.cornell.edu/courses/cs4820/2026sp/lectures/";
  const topics = ["Greedy Algorithms and Minimum Spanning Trees", "Minimum Spanning Trees and Interval Scheduling", "Interval Scheduling", "Weighted Interval Scheduling", "Segmented Least Squares", "Shortest Paths with Dynamic Programming", "Sequence Alignment", "Knapsack", "Prelim I Review", "Stable Matching I", "Stable Matching II", "Bipartite Matching and Network Flows", "Ford-Fulkerson", "Flow Correctness and Minimum Cuts", "Applications of Maximum Flow", "Applications of Minimum Cuts", "Reductions, Independent Set, and Vertex Cover", "P, NP, SAT, and 3-SAT", "Independent Set NP-Completeness", "Traveling Salesman and Hamiltonian Problems", "Hard Problems with Numbers", "Taxonomy of NP-Hard Problems", "Fast Integer Multiplication", "Fast Matrix Multiplication and the Master Theorem", "Prelim II Review", "Linear-Time Median", "Convolution and Polynomial Multiplication", "Fast Fourier Transform", "Load-Balancing Approximation", "Vertex Cover via Linear Programming", "Set Cover Approximation", "Exact Algorithms for Hard Problems", "Cryptography I", "Diffie-Hellman Key Exchange", "Models of Computation and the Halting Problem", "Undecidability via Reduction", "Undecidability of the Halting Problem", "Turing Machines and the Church-Turing Hypothesis", "SAT Is NP-Complete", "Final Review", "Current Trends and Final Review"];
  const topicsZh = ["贪心算法与最小生成树", "最小生成树与区间调度", "区间调度", "加权区间调度", "分段最小二乘", "动态规划求最短路径", "序列比对", "背包问题", "第一次阶段考试复习", "稳定匹配（一）", "稳定匹配（二）", "二分图匹配与网络流", "Ford-Fulkerson 算法", "网络流正确性与最小割", "最大流应用", "最小割应用", "归约、独立集与顶点覆盖", "P、NP、SAT 与 3-SAT", "独立集的 NP 完全性", "旅行商与哈密顿问题", "含数值的困难问题", "NP 困难问题分类", "快速整数乘法", "快速矩阵乘法与主定理", "第二次阶段考试复习", "线性时间中位数", "卷积与多项式乘法", "快速傅里叶变换", "负载均衡近似算法", "线性规划求顶点覆盖", "集合覆盖近似算法", "困难问题的精确算法", "密码学（一）", "Diffie-Hellman 密钥交换", "计算模型与停机问题", "通过归约证明不可判定性", "停机问题的不可判定性", "图灵机与 Church-Turing 假设", "SAT 是 NP 完全问题", "期末复习", "算法前沿与期末复习"];
  const tasks: PlanTask[] = topics.map((title, index) => ({ id: `lecture-${index + 1}`, title: `Lecture ${index + 1}: ${title}`, titleZh: `第 ${index + 1} 讲：${topicsZh[index]}`, url: courseUrl, kind: "session" }));
  [1, 2, 4, 5, 6, 8, 9, 10, 11].forEach((homework) => tasks.push({ id: `homework-quiz-${homework}`, title: `Homework ${homework} section quiz and corrections`, titleZh: `作业 ${homework} 讨论课测验与订正`, url: courseUrl, kind: "assignment" }));
  tasks.push({ id: "prelim-1", title: "Prelim I", titleZh: "第一次阶段考试", url: courseUrl, kind: "exam" }, { id: "prelim-2", title: "Prelim II", titleZh: "第二次阶段考试", url: courseUrl, kind: "exam" }, { id: "final", title: "Final Exam", titleZh: "期末考试", url: courseUrl, kind: "exam" });
  return tasks;
}

function cornellCs1110Tasks(): PlanTask[] {
  const lecturesUrl = "https://www.cs.cornell.edu/courses/cs1110/2025fa/lectures/";
  const labsUrl = "https://www.cs.cornell.edu/courses/cs1110/2025fa/assessment/labs/";
  const topics = ["Getting Started", "Expressions and Variables", "Modules", "Functions", "Strings", "Testing", "Conditionals", "Assignment 1 Workshop", "Objects", "Debugging", "Assertions", "Sequences", "For-Loops", "Assignment 3 Follow-Up", "Recursion I", "Recursion II", "Nested Lists and Dictionaries", "Blackjack", "Object-Oriented Design", "Subclasses", "Abstraction", "While Loops", "GUI Classes", "Advanced Error Handling", "Searching and Sorting", "Generators"];
  const topicsZh = ["入门准备", "表达式与变量", "模块", "函数", "字符串", "测试", "条件语句", "作业 1 工作坊", "对象", "调试", "断言", "序列", "For 循环", "作业 3 复盘", "递归（一）", "递归（二）", "嵌套列表与字典", "Blackjack", "面向对象设计", "子类", "抽象", "While 循环", "GUI 类", "高级错误处理", "搜索与排序", "生成器"];
  const tasks: PlanTask[] = topics.flatMap((title, index) => [{ id: `lesson-${index + 1}`, title: `Lesson ${index + 1}: ${title}`, titleZh: `第 ${index + 1} 课：${topicsZh[index]}`, url: lecturesUrl, kind: "session" as const }, { id: `lab-${index + 1}`, title: `Official lab: ${title}`, titleZh: `官方实验：${topicsZh[index]}`, url: labsUrl, kind: "assignment" as const }]);
  const assignments = [["Currency", "货币换算"], ["Call Frames", "调用栈帧"], ["Color Models", "颜色模型"], ["Turtles", "海龟绘图"], ["Class Folders", "类文件夹"], ["Images", "图像处理"], ["Froggit", "Froggit 游戏"]] as const;
  assignments.forEach(([title, titleZh], index) => tasks.push({ id: `assignment-${index + 1}`, title: `Assignment ${index + 1}: ${title}`, titleZh: `作业 ${index + 1}：${titleZh}`, url: "https://www.cs.cornell.edu/courses/cs1110/2025fa/assessment/assignments/", kind: "project" }));
  tasks.push({ id: "prelim-1", title: "Prelim I", titleZh: "第一次阶段考试", url: "https://www.cs.cornell.edu/courses/cs1110/2025fa/assessment/exams/", kind: "exam" }, { id: "prelim-2", title: "Prelim II", titleZh: "第二次阶段考试", url: "https://www.cs.cornell.edu/courses/cs1110/2025fa/assessment/exams/", kind: "exam" }, { id: "final", title: "Final Exam", titleZh: "期末考试", url: "https://www.cs.cornell.edu/courses/cs1110/2025fa/assessment/exams/", kind: "exam" });
  return tasks;
}

function officialTopicPlan(url: string, topics: readonly (readonly [string, string])[], practiceLabel = "Official problem practice"): PlanTask[] {
  return topics.flatMap(([title, titleZh], index) => [
    { id: `topic-${index + 1}`, title: `Topic ${index + 1}: ${title}`, titleZh: `专题 ${index + 1}：${titleZh}`, url, kind: "session" as const },
    { id: `practice-${index + 1}`, title: `${practiceLabel}: ${title}`, titleZh: `官方练习：${titleZh}`, url, kind: "assignment" as const },
  ]);
}

function princetonFoundationTasks(courseId: "mat103" | "mat201" | "mat202" | "phy103" | "phy104" | "chm201"): PlanTask[] {
  const definitions = {
    mat103: { url: "https://web.math.princeton.edu/~nelson/103/", topics: [["Functions, Limits, and Continuity", "函数、极限与连续性"], ["Definition of the Derivative", "导数定义"], ["Differentiation Rules", "求导规则"], ["Implicit Differentiation", "隐函数求导"], ["Applications of Derivatives", "导数的应用"], ["Curve Sketching", "曲线绘制"], ["Optimization", "优化"], ["Definite Integrals", "定积分"], ["Fundamental Theorem of Calculus", "微积分基本定理"], ["Indefinite Integrals", "不定积分"], ["Logarithms and Exponentials", "对数与指数"], ["Differential-Calculus Review", "微分学综合复习"]] },
    mat201: { url: "https://mat201dev.math.princeton.edu/mat201-syllabus", topics: [["Vectors, Lines, and Planes", "向量、直线与平面"], ["Curves and Surfaces in Space", "空间曲线与曲面"], ["Multivariable Limits and Continuity", "多元极限与连续性"], ["Partial Derivatives", "偏导数"], ["Gradient and Chain Rule", "梯度与链式法则"], ["Linear Approximation and Taylor's Theorem", "线性近似与泰勒定理"], ["Multivariable Optimization", "多元函数优化"], ["Double Integrals", "二重积分"], ["Triple Integrals and Coordinates", "三重积分与坐标系"], ["Vector Fields and Line Integrals", "向量场与线积分"], ["Flux and Surface Integrals", "通量与曲面积分"], ["Green, Stokes, and Divergence Theorems", "Green、Stokes 与散度定理"]] },
    mat202: { url: "https://mat202.math.princeton.edu/", topics: [["Linear Systems and Gaussian Elimination", "线性方程组与高斯消元"], ["Matrix Algebra", "矩阵代数"], ["Vector Spaces", "向量空间"], ["Subspaces, Span, and Independence", "子空间、张成与线性无关"], ["Basis and Dimension", "基与维数"], ["Linear Transformations", "线性变换"], ["Determinants", "行列式"], ["Eigenvalues and Eigenvectors", "特征值与特征向量"], ["Diagonalization", "对角化"], ["Inner Products and Orthogonality", "内积与正交"], ["Least Squares", "最小二乘"], ["Applications of Linear Algebra", "线性代数应用"]] },
    phy103: { url: "https://www.princeton.edu/academics/area-of-study/physics", topics: [["Measurement, Vectors, and Motion", "测量、向量与运动"], ["Newton's Laws", "牛顿定律"], ["Applications of Forces", "力的应用"], ["Work and Energy", "功与能"], ["Momentum and Collisions", "动量与碰撞"], ["Rotational Motion", "转动运动"], ["Angular Momentum", "角动量"], ["Gravitation", "万有引力"], ["Oscillations", "振动"], ["Waves and Sound", "波与声音"], ["Fluid Mechanics", "流体力学"], ["Thermodynamics", "热力学"]] },
    phy104: { url: "https://www.princeton.edu/academics/area-of-study/physics", topics: [["Electric Charge and Coulomb's Law", "电荷与库仑定律"], ["Electric Fields", "电场"], ["Gauss's Law", "高斯定律"], ["Electric Potential", "电势"], ["Capacitance and Dielectrics", "电容与电介质"], ["Current and Resistance", "电流与电阻"], ["DC Circuits", "直流电路"], ["Magnetic Fields and Forces", "磁场与磁力"], ["Sources of Magnetic Fields", "磁场的来源"], ["Electromagnetic Induction", "电磁感应"], ["Maxwell's Equations and EM Waves", "麦克斯韦方程与电磁波"], ["Introduction to Quantum Physics", "量子物理导论"]] },
    chm201: { url: "https://www.princeton.edu/academics/area-of-study/chemistry", topics: [["Matter, Measurement, and Stoichiometry", "物质、测量与化学计量"], ["Chemical Reactions", "化学反应"], ["Gases and Molecular Motion", "气体与分子运动"], ["Energy and Enthalpy", "能量与焓"], ["Entropy and Free Energy", "熵与自由能"], ["Chemical Equilibrium", "化学平衡"], ["Acid-Base Equilibria", "酸碱平衡"], ["Solubility and Complex Equilibria", "溶解度与复杂平衡"], ["Quantum Theory", "量子理论"], ["Atomic Structure", "原子结构"], ["Chemical Bonding", "化学键"], ["Molecular Structure and Properties", "分子结构与性质"]] },
  } as const;
  return officialTopicPlan(definitions[courseId].url, definitions[courseId].topics, courseId.startsWith("phy") || courseId === "chm201" ? "Official class and laboratory practice" : undefined);
}

function berkeleyCalculusTasks(courseId: "math1a" | "math1b"): PlanTask[] {
  const definitions = {
    math1a: { url: "https://undergraduate.catalog.berkeley.edu/courses/1144962", topics: [["Functions and Models", "函数与模型"], ["Limits", "极限"], ["Continuity", "连续性"], ["Derivatives", "导数"], ["Differentiation Rules", "求导规则"], ["Implicit Differentiation", "隐函数求导"], ["Related Rates", "相关变化率"], ["Linear Approximation", "线性近似"], ["Optimization", "优化"], ["Curve Sketching", "曲线绘制"], ["Definite Integrals", "定积分"], ["Fundamental Theorem of Calculus", "微积分基本定理"]] },
    math1b: { url: "https://undergraduate.catalog.berkeley.edu/courses/1145002", topics: [["Techniques of Integration", "积分技巧"], ["Applications of Integration", "积分应用"], ["Improper Integrals", "反常积分"], ["Differential Equations", "微分方程"], ["Parametric Curves", "参数曲线"], ["Polar Coordinates", "极坐标"], ["Infinite Sequences", "无穷数列"], ["Infinite Series", "无穷级数"], ["Convergence Tests", "收敛判别"], ["Power Series", "幂级数"], ["Taylor Series", "泰勒级数"], ["Calculus II Review", "微积分（二）综合复习"]] },
  } as const;
  return officialTopicPlan(definitions[courseId].url, definitions[courseId].topics);
}

function berkeleyCs61aTasks(): PlanTask[] {
  const courseUrl = "https://cs61a.org/fa26/";
  const topics = ["Welcome", "Functions", "Control", "Higher-Order Functions", "Environments", "Abstraction", "Function Examples", "Midterm 1 Review", "Recursion", "Tree Recursion", "Sequences", "Containers", "Types and Objects", "Linked Lists and Strings", "Trees", "Problem Solving", "Midterm 2 Review", "Debugging", "Mutation", "Attributes", "Inheritance", "Iterators", "Generators", "Efficiency", "Modularity", "Object Examples", "Midterm 3 Review", "Tables", "SQL", "Aggregation", "Functional Programming", "Algebraic Data Types", "Immutable Data", "Interpreters", "Browsers", "Applications", "Software Testing", "Software Tracing", "Ethics", "Conclusion"];
  const topicsZh = ["课程介绍", "函数", "控制流", "高阶函数", "环境模型", "抽象", "函数示例", "第一次期中复习", "递归", "树递归", "序列", "容器", "类型与对象", "链表与字符串", "树", "问题求解", "第二次期中复习", "调试", "可变性", "属性", "继承", "迭代器", "生成器", "效率", "模块化", "对象示例", "第三次期中复习", "表", "SQL", "聚合", "函数式编程", "代数数据类型", "不可变数据", "解释器", "浏览器", "应用", "软件测试", "软件追踪", "伦理", "课程总结"];
  return topics.map((title, index) => ({ id: `lecture-${index + 1}`, title: `Lecture ${index + 1}: ${title}`, titleZh: `第 ${index + 1} 讲：${topicsZh[index]}`, url: courseUrl, kind: "session" }));
}

function berkeleyCs70Tasks(): PlanTask[] {
  const courseUrl = "https://www.eecs70.org/";
  const topics = ["Introduction and Propositional Logic", "Proofs", "Induction", "Stable Matching", "Graphs I", "Graphs II", "Modular Arithmetic and Euclid's Algorithm", "Extended GCD, CRT, and Fermat's Little Theorem", "RSA", "Polynomials and Secret Sharing", "Error-Correcting Codes", "Counting I", "Counting II", "Countability", "Computability", "Introduction to Discrete Probability", "Conditional Probability and Independence", "Combinations of Events", "Applications of Probability", "Random Variables: Distribution and Expectation", "Random Variables: Variance and Covariance", "Geometric and Poisson Distributions", "Concentration Inequalities and the Law of Large Numbers", "Continuous Probability I", "Continuous Probability II", "Markov Chains I", "Markov Chains II", "Information Theory", "Review and Recap"];
  const topicsZh = ["导论与命题逻辑", "证明", "归纳法", "稳定匹配", "图论（一）", "图论（二）", "模运算与欧几里得算法", "扩展欧几里得、中国剩余定理与费马小定理", "RSA", "多项式与秘密共享", "纠错码", "计数（一）", "计数（二）", "可数性", "可计算性", "离散概率导论", "条件概率与独立性", "事件组合", "概率应用", "随机变量：分布与期望", "随机变量：方差与协方差", "几何分布与泊松分布", "集中不等式与大数定律", "连续概率（一）", "连续概率（二）", "马尔可夫链（一）", "马尔可夫链（二）", "信息论", "复习与总结"];
  const tasks: PlanTask[] = topics.map((title, index) => ({ id: `lecture-${index + 1}`, title: `Lecture ${index + 1}: ${title}`, titleZh: `第 ${index + 1} 讲：${topicsZh[index]}`, url: courseUrl, kind: "session" }));
  for (let homework = 0; homework <= 6; homework += 1) tasks.push({ id: `homework-${homework}`, title: `Homework ${homework}`, titleZh: `作业 ${homework}`, url: courseUrl, kind: "assignment" });
  tasks.push({ id: "midterm", title: "Midterm Exam", titleZh: "期中考试", url: courseUrl, kind: "exam" }, { id: "final", title: "Final Exam", titleZh: "期末考试", url: courseUrl, kind: "exam" });
  return tasks;
}

function berkeleyCs170Tasks(): PlanTask[] {
  const url = "https://cs170.org/";
  const topics = [["Arithmetic Algorithms", "算术算法"], ["Fast Multiplication, Master Theorem, and Median", "快速乘法、主定理与中位数"], ["Fast Matrix Multiplication", "快速矩阵乘法"], ["DFS and Topological Sort", "深度优先搜索与拓扑排序"], ["BFS and Shortest Paths", "广度优先搜索与最短路径"], ["Greedy Algorithms I", "贪心算法（一）"], ["Greedy Algorithms II", "贪心算法（二）"], ["Dynamic Programming I", "动态规划（一）"], ["Dynamic Programming II", "动态规划（二）"], ["Backpropagation", "反向传播"], ["Fast Fourier Transform", "快速傅里叶变换"], ["FFT Circuits", "FFT 电路"], ["Parallelism", "并行计算"], ["Gradient Descent", "梯度下降"], ["Linear Programming and Duality", "线性规划与对偶"], ["Simplex Algorithm I", "单纯形法（一）"], ["Simplex Algorithm II", "单纯形法（二）"], ["Zero-Sum Games", "零和博弈"], ["Multiplicative Weights", "乘法权重"], ["AdWords", "AdWords 算法"], ["NP-Completeness I", "NP 完全性（一）"], ["NP-Completeness II", "NP 完全性（二）"], ["Dealing with NP-Completeness", "应对 NP 完全问题"], ["Hashing and Streaming I", "哈希与流式算法（一）"], ["Hashing and Streaming II", "哈希与流式算法（二）"], ["Quantum Algorithms", "量子算法"]] as const;
  const tasks = officialTopicPlan(url, topics);
  [1,2,3,4,5,6,7,8,9,11,12,13,14,15].forEach(n => tasks.push({ id:`homework-${n}`, title:`Homework ${n}`, titleZh:`作业 ${n}`, url, kind:"assignment" }));
  tasks.push({id:"midterm-1",title:"Midterm 1",titleZh:"期中考试一",url,kind:"exam"},{id:"midterm-2",title:"Midterm 2",titleZh:"期中考试二",url,kind:"exam"},{id:"final",title:"Final Exam",titleZh:"期末考试",url,kind:"exam"});
  return tasks;
}

function berkeleyCs61cTasks(): PlanTask[] {
  const url = "https://cs61c.org/fa26/";
  const topics = [["Number Representation", "数值表示"], ["C Pointers and Arrays", "C 指针与数组"], ["C Strings and Memory", "C 字符串与内存"], ["C Generics", "C 泛型"], ["Floating Point", "浮点数"], ["RISC-V Introduction", "RISC-V 导论"], ["RISC-V Data and Control", "RISC-V 数据与控制"], ["RISC-V Procedures", "RISC-V 过程"], ["Instruction Formats", "指令格式"], ["Instruction Formats and CALL", "指令格式与 CALL"], ["CALL and Synchronous Digital Systems", "CALL 与同步数字系统"], ["Combinational Logic", "组合逻辑"], ["State", "状态"], ["Single-Cycle Datapath", "单周期数据通路"], ["Datapath Control", "数据通路控制"], ["Pipelining I", "流水线（一）"], ["Pipelining II", "流水线（二）"], ["Caches I", "缓存（一）"], ["Caches II", "缓存（二）"], ["Parallelism I", "并行（一）"], ["Parallelism II", "并行（二）"], ["Parallelism and Synchronization", "并行与同步"], ["Operating Systems", "操作系统"], ["Virtual Memory", "虚拟内存"], ["Architecture Guest Topic", "体系结构专题"], ["Course Wrap-Up", "课程总结"]] as const;
  const tasks: PlanTask[] = topics.map(([t,z],i)=>({id:`lecture-${i+1}`,title:`Lecture ${i+1}: ${t}`,titleZh:`第 ${i+1} 讲：${z}`,url,kind:"session"}));
  for(let n=0;n<=8;n++) tasks.push({id:`lab-${n}`,title:`Official Lab ${n}`,titleZh:`官方实验 ${n}`,url,kind:"assignment"});
  for(let n=1;n<=7;n++) tasks.push({id:`homework-${n}`,title:`Homework ${n}`,titleZh:`作业 ${n}`,url,kind:"assignment"});
  ["snek","CS61Classify","CS61CPU","61kaChow"].forEach((t,i)=>tasks.push({id:`project-${i+1}`,title:`Project ${i+1}: ${t}`,titleZh:`项目 ${i+1}：${t}`,url,kind:"project"}));
  tasks.push({id:"midterm",title:"Midterm Exam",titleZh:"期中考试",url,kind:"exam"},{id:"final",title:"Final Exam",titleZh:"期末考试",url,kind:"exam"}); return tasks;
}

function berkeleyCs184Tasks(): PlanTask[] {
  const url = "https://cs184.eecs.berkeley.edu/sp26/";
  const topics = [["Drawing Triangles", "绘制三角形"], ["Sampling and Aliasing", "采样与混叠"], ["Transforms", "变换"], ["Texture Mapping", "纹理映射"], ["Rasterization Pipeline", "光栅化流水线"], ["Bezier Curves and Surfaces", "Bezier 曲线与曲面"], ["Triangle Meshes and Half-Edge Structures", "三角网格与半边结构"], ["Ray Generation and Intersection", "光线生成与求交"], ["Bounding Volume Hierarchies", "包围体层次结构"], ["Direct and Global Illumination", "直接与全局光照"], ["Physical Simulation", "物理模拟"], ["Shaders", "着色器"]] as const;
  const tasks = officialTopicPlan(url, topics);
  for(let n=0;n<=4;n++) tasks.push({id:`homework-${n}`,title:`Programming Homework ${n}`,titleZh:`编程作业 ${n}`,url:`${url}hw/`,kind:"project"});
  tasks.push({id:"final-project",title:"Final Graphics Project",titleZh:"图形学期末项目",url:`${url}project/`,kind:"project"}); return tasks;
}

function berkeleyAdvancedTasks(courseId: "cs61b"|"cs161"|"cs188"|"cs162"|"cs186"|"cs189"): PlanTask[] {
  const d = {
    cs61b:{url:"https://sp26.datastructur.es/",topics:[["Java and Object-Oriented Programming","Java 与面向对象编程"],["Lists and Deques","列表与双端队列"],["Testing and Debugging","测试与调试"],["Inheritance and Interfaces","继承与接口"],["Asymptotic Analysis","渐近分析"],["Disjoint Sets","不相交集合"],["Binary Search Trees","二叉搜索树"],["Balanced Search Trees","平衡搜索树"],["Hash Tables","哈希表"],["Heaps and Priority Queues","堆与优先队列"],["Graph Traversals","图遍历"],["Shortest Paths","最短路径"],["Minimum Spanning Trees","最小生成树"],["Sorting","排序"],["Compression","压缩"]],projects:["Particle Simulator","LinkedListDeque61B","ArrayDeque61B","Percolation","NGrams and Wordnet","Build Your Own World"]},
    cs161:{url:"https://sp26.cs161.org/",topics:[["Security Principles","安全原则"],["x86 and the Call Stack","x86 与调用栈"],["Memory-Safety Vulnerabilities","内存安全漏洞"],["Memory-Safety Mitigations","内存安全缓解措施"],["Cryptography Foundations","密码学基础"],["Block Ciphers","分组密码"],["Hash Functions and MACs","哈希函数与消息认证码"],["Authenticated Encryption","认证加密"],["Public-Key Cryptography","公钥密码学"],["Authentication and Passwords","认证与密码"],["Web Security","Web 安全"],["Network Security","网络安全"],["Anonymity and Privacy","匿名性与隐私"],["Malware","恶意软件"],["Security Policy and Design","安全策略与设计"]],projects:["Memory Safety","Secure File Sharing","Network Security"]},
    cs188:{url:"https://inst.eecs.berkeley.edu/~cs188/sp26/",topics:[["Search","搜索"],["Adversarial Search","对抗搜索"],["Constraint Satisfaction","约束满足"],["Markov Decision Processes","马尔可夫决策过程"],["Reinforcement Learning","强化学习"],["Probability Review","概率复习"],["Bayes Nets","贝叶斯网络"],["Hidden Markov Models","隐马尔可夫模型"],["Decision Networks","决策网络"],["Machine Learning","机器学习"],["Regression","回归"],["Classification","分类"],["Neural Networks","神经网络"],["Language Models","语言模型"],["Robotics and AI Applications","机器人与 AI 应用"]],projects:["Python Foundations","Search","Multi-Agent Search","Reinforcement Learning","Ghostbusters","Machine Learning"]},
    cs162:{url:"https://cs162.org/",topics:[["Operating-System Structure","操作系统结构"],["Processes and System Calls","进程与系统调用"],["Threads","线程"],["Synchronization","同步"],["Scheduling","调度"],["Deadlock","死锁"],["Address Translation","地址转换"],["Virtual Memory","虚拟内存"],["File Systems","文件系统"],["I/O Systems","输入输出系统"],["Distributed Systems","分布式系统"],["Networking","网络"],["Protection and Security","保护与安全"],["Reliability","可靠性"],["Operating-System Design","操作系统设计"]],projects:["Pintos Threads","Pintos User Programs","Pintos File Systems","Pintos Final System"]},
    cs186:{url:"https://cs186berkeley.net/notes/",topics:[["SQL","SQL"],["Disks and Files","磁盘与文件"],["Buffer Management","缓冲区管理"],["B+ Trees","B+ 树"],["Hashing","哈希"],["External Sorting","外部排序"],["Join Algorithms","连接算法"],["Query Optimization","查询优化"],["Transactions","事务"],["Concurrency Control","并发控制"],["Recovery","恢复"],["Distributed Databases","分布式数据库"],["Parallel Query Processing","并行查询处理"],["Database Design","数据库设计"],["NoSQL Systems","NoSQL 系统"]],projects:["SQL","B+ Tree","Joins","Concurrency","Recovery"]},
    cs189:{url:"https://eecs189.org/fa26/calendar/",topics:[["Linear Classifiers","线性分类器"],["Optimization","优化"],["Linear Regression","线性回归"],["Logistic Regression","逻辑回归"],["Gaussian Discriminant Analysis","高斯判别分析"],["Support Vector Machines","支持向量机"],["Decision Trees","决策树"],["Ensemble Methods","集成方法"],["Neural Networks","神经网络"],["Convolutional Networks","卷积网络"],["Unsupervised Learning","无监督学习"],["Principal Component Analysis","主成分分析"],["Clustering","聚类"],["Learning Theory","学习理论"],["Generative Models","生成模型"]],projects:[]}
  } as const;
  const x=d[courseId]; const tasks=officialTopicPlan(x.url,x.topics);
  x.projects.forEach((name,i)=>tasks.push({id:`project-${i}`,title:`Project ${i}: ${name}`,titleZh:`项目 ${i}：${name}`,url:x.url,kind:"project"}));
  return tasks;
}

function stanfordAdvancedTasks(courseId:"cs103"|"cs161"|"cs144"|"cs143"|"cs148"|"cs221"|"cs155"|"cs244b"):PlanTask[]{
 const d={
 cs103:{url:"https://web.stanford.edu/class/archive/cs/cs103/cs103.1264/",topics:[["Mathematical Proofs","数学证明"],["Sets and Functions","集合与函数"],["Relations","关系"],["Propositional Logic","命题逻辑"],["First-Order Logic","一阶逻辑"],["Induction","归纳法"],["Finite Automata","有限自动机"],["Regular Languages","正则语言"],["Context-Free Languages","上下文无关语言"],["Turing Machines","图灵机"],["Decidability","可判定性"],["Complexity Theory","复杂度理论"]],projects:[]},
 cs161:{url:"https://web.stanford.edu/class/cs161/",topics:[["Asymptotic Analysis","渐近分析"],["Divide and Conquer","分治"],["Randomized Algorithms","随机算法"],["Sorting and Selection","排序与选择"],["Hashing","哈希"],["Graph Search","图搜索"],["Shortest Paths","最短路径"],["Minimum Spanning Trees","最小生成树"],["Greedy Algorithms","贪心算法"],["Dynamic Programming","动态规划"],["Network Flow","网络流"],["Linear Programming","线性规划"],["NP-Completeness","NP 完全性"],["Approximation Algorithms","近似算法"]],projects:[]},
 cs144:{url:"https://web.stanford.edu/class/cs144/",topics:[["Internet Architecture","互联网体系结构"],["Application Layer","应用层"],["Reliable Transport","可靠传输"],["TCP","TCP"],["Congestion Control","拥塞控制"],["Network Layer","网络层"],["IP and Forwarding","IP 与转发"],["Routing","路由"],["Link Layer","链路层"],["Network Security","网络安全"],["Datacenter Networks","数据中心网络"],["Network Measurement","网络测量"]],projects:["Networking Warmup","Byte Stream","TCP Receiver","TCP Sender","Network Interface","IP Router","Network Integration"]},
 cs143:{url:"https://web.stanford.edu/class/cs143/",topics:[["Compiler Structure","编译器结构"],["Lexical Analysis","词法分析"],["Regular Expressions","正则表达式"],["Parsing","语法分析"],["Context-Free Grammars","上下文无关文法"],["Semantic Analysis","语义分析"],["Type Checking","类型检查"],["Runtime Organization","运行时组织"],["Code Generation","代码生成"],["Intermediate Representations","中间表示"],["Dataflow Analysis","数据流分析"],["Optimization","优化"]],projects:["Lexer","Parser","Semantic Analyzer","Code Generator"]},
 cs148:{url:"https://web.stanford.edu/class/cs148/lectures.html",topics:[["Graphics Pipeline","图形流水线"],["Geometry and Transforms","几何与变换"],["Rasterization","光栅化"],["Texture Mapping","纹理映射"],["Lighting and Shading","光照与着色"],["Ray Tracing","光线追踪"],["Curves and Surfaces","曲线与曲面"],["Animation","动画"],["Physical Simulation","物理模拟"],["Image Processing","图像处理"],["Rendering Systems","渲染系统"],["Interactive Graphics","交互式图形"]],projects:["Modeling","Rasterization","Shading","Animation","Final Graphics Project"]},
 cs221:{url:"https://stanford-cs221.github.io/spring2026/",topics:[["Machine Learning","机器学习"],["Search","搜索"],["Markov Decision Processes","马尔可夫决策过程"],["Game Playing","博弈"],["Constraint Satisfaction","约束满足"],["Bayesian Networks","贝叶斯网络"],["Logic","逻辑"],["Deep Learning","深度学习"],["Natural Language Processing","自然语言处理"],["Computer Vision","计算机视觉"],["Robotics","机器人"],["AI Ethics","人工智能伦理"]],projects:["Foundations","Sentiment Classification","Text Reconstruction","Blackjack","Pac-Man","Final AI Project"]},
 cs155:{url:"https://cs155.stanford.edu/syllabus.html",topics:[["Threat Models","威胁模型"],["Memory Safety","内存安全"],["Sandboxing","沙箱"],["Web Security","Web 安全"],["Authentication","认证"],["Cryptography","密码学"],["Network Security","网络安全"],["TLS","TLS"],["Privacy","隐私"],["Malware","恶意软件"],["Mobile Security","移动安全"],["Security Design","安全设计"]],projects:["Exploits","Web Security","Network Security"]},
 cs244b:{url:"https://www.scs.stanford.edu/24sp-cs244b/sched/",topics:[["Distributed-System Models","分布式系统模型"],["Remote Procedure Calls","远程过程调用"],["Time and Ordering","时间与排序"],["Replication","复制"],["Consensus","共识"],["Fault Tolerance","容错"],["Distributed Storage","分布式存储"],["Transactions","事务"],["Consistency Models","一致性模型"],["Scalability","可扩展性"],["Stream Processing","流处理"],["Distributed-System Evaluation","分布式系统评估"]],projects:["Distributed Systems Project"]}} as const;
 const x=d[courseId];const tasks=officialTopicPlan(x.url,x.topics);x.projects.forEach((n,i)=>tasks.push({id:`project-${i+1}`,title:n,titleZh:`项目 ${i+1}：${n}`,url:x.url,kind:"project"}));return tasks;
}

const compactCurricula = {
 programming:[["Values and Expressions","值与表达式"],["Control Flow","控制流"],["Functions","函数"],["Data Collections","数据集合"],["Object-Oriented Programming","面向对象编程"],["Recursion","递归"],["Testing and Debugging","测试与调试"],["Files and Exceptions","文件与异常"],["Basic Algorithms","基础算法"],["Program Design","程序设计"]],
 dataStructures:[["Complexity Analysis","复杂度分析"],["Lists and Arrays","列表与数组"],["Stacks and Queues","栈与队列"],["Trees","树"],["Binary Search Trees","二叉搜索树"],["Heaps","堆"],["Hash Tables","哈希表"],["Graphs","图"],["Graph Algorithms","图算法"],["Sorting","排序"],["Disjoint Sets","不相交集合"],["Algorithm Design","算法设计"]],
 systems:[["C and Memory","C 与内存"],["Assembly Language","汇编语言"],["Machine Representation","机器表示"],["Processor Organization","处理器组织"],["Caches","缓存"],["Processes","进程"],["Virtual Memory","虚拟内存"],["Concurrency","并发"],["Synchronization","同步"],["File Systems","文件系统"],["Networking","网络"],["System Security","系统安全"]],
 algorithms:[["Asymptotic Analysis","渐近分析"],["Divide and Conquer","分治"],["Graph Search","图搜索"],["Shortest Paths","最短路径"],["Greedy Algorithms","贪心算法"],["Dynamic Programming","动态规划"],["Network Flow","网络流"],["Randomized Algorithms","随机算法"],["Linear Programming","线性规划"],["NP-Completeness","NP 完全性"],["Approximation Algorithms","近似算法"],["Algorithm Review","算法综合"]],
 graphics:[["Graphics Pipeline","图形流水线"],["Geometric Transformations","几何变换"],["Rasterization","光栅化"],["Sampling","采样"],["Texture Mapping","纹理映射"],["Curves and Surfaces","曲线与曲面"],["Meshes","网格"],["Lighting and Shading","光照与着色"],["Ray Tracing","光线追踪"],["Animation","动画"],["Physical Simulation","物理模拟"],["Rendering Project","渲染项目"]],
 databases:[["Relational Model","关系模型"],["SQL","SQL"],["Database Design","数据库设计"],["Storage and Files","存储与文件"],["Indexes","索引"],["Query Processing","查询处理"],["Query Optimization","查询优化"],["Transactions","事务"],["Concurrency Control","并发控制"],["Recovery","恢复"],["Distributed Databases","分布式数据库"],["Data-System Applications","数据系统应用"]]
 ,functional:[["Functional Programming","函数式编程"],["Types","类型"],["Recursion","递归"],["Higher-Order Functions","高阶函数"],["Inductive Data","归纳数据"],["Polymorphism","多态"],["Modules","模块"],["Lazy Evaluation","惰性求值"],["Streams","流"],["Parallelism","并行"],["Cost Semantics","成本语义"],["Functional Program Design","函数式程序设计"]]
 ,theory:[["Proof Techniques","证明方法"],["Induction","归纳法"],["Combinatorics","组合数学"],["Graph Theory","图论"],["Number Theory","数论"],["Probability","概率"],["Automata","自动机"],["Computability","可计算性"],["Complexity","复杂度"],["Randomness","随机性"],["Cryptography","密码学"],["Theoretical-CS Synthesis","理论计算机综合"]]
 ,calculus:[["Functions and Limits","函数与极限"],["Continuity","连续性"],["Derivatives","导数"],["Applications of Derivatives","导数应用"],["Optimization","优化"],["Definite Integrals","定积分"],["Fundamental Theorem","微积分基本定理"],["Integration Techniques","积分技巧"],["Applications of Integration","积分应用"],["Improper Integrals","反常积分"],["Sequences and Series","数列与级数"],["Taylor Series","泰勒级数"]]
 ,linearAlgebra:[["Linear Systems","线性方程组"],["Matrices","矩阵"],["Vector Spaces","向量空间"],["Linear Independence","线性无关"],["Basis and Dimension","基与维数"],["Linear Transformations","线性变换"],["Determinants","行列式"],["Eigenvalues","特征值"],["Diagonalization","对角化"],["Orthogonality","正交"],["Least Squares","最小二乘"],["Applications","应用"]]
 ,probability:[["Counting","计数"],["Probability Spaces","概率空间"],["Conditional Probability","条件概率"],["Independence","独立性"],["Random Variables","随机变量"],["Expectation","期望"],["Variance","方差"],["Concentration Bounds","集中界"],["Discrete Distributions","离散分布"],["Continuous Distributions","连续分布"],["Markov Chains","马尔可夫链"],["Randomized Algorithms","随机算法"]]
 ,distributed:[["System Models","系统模型"],["RPC","远程过程调用"],["Time and Ordering","时间与排序"],["Replication","复制"],["Consensus","共识"],["Fault Tolerance","容错"],["Distributed Storage","分布式存储"],["Transactions","事务"],["Consistency","一致性"],["Distributed File Systems","分布式文件系统"],["Scalability","可扩展性"],["System Evaluation","系统评估"]]
 ,programmingLanguages:[["Syntax and Semantics","语法与语义"],["Type Systems","类型系统"],["Operational Semantics","操作语义"],["Lambda Calculus","Lambda 演算"],["Functional Languages","函数式语言"],["Imperative Languages","命令式语言"],["Objects","对象"],["Modules","模块"],["Exceptions and Effects","异常与效应"],["Concurrency","并发"],["Program Verification","程序验证"],["Language Implementation","语言实现"]]
 ,ai:[["Search","搜索"],["Heuristics","启发式方法"],["Game Playing","博弈"],["Constraint Satisfaction","约束满足"],["Planning","规划"],["Probability","概率"],["Bayesian Networks","贝叶斯网络"],["Decision Making","决策"],["Machine Learning","机器学习"],["Reinforcement Learning","强化学习"],["Language and Perception","语言与感知"],["Responsible AI","负责任的人工智能"]]
 ,security:[["Security Principles","安全原则"],["Memory Safety","内存安全"],["Cryptography","密码学"],["Authentication","认证"],["Access Control","访问控制"],["Web Security","Web 安全"],["Network Security","网络安全"],["Operating-System Security","操作系统安全"],["Malware","恶意软件"],["Privacy","隐私"],["Secure Design","安全设计"],["Security Evaluation","安全评估"]]
} as const;

function compactOfficialPlan(url:string, curriculum:keyof typeof compactCurricula):PlanTask[]{return officialTopicPlan(url,compactCurricula[curriculum]);}

export type CoursePlanDefinition = {
  sourceUrl: string;
  tasks: PlanTask[];
  detail: "full" | "resources";
};

function resourcePlan(courseId: string): CoursePlanDefinition {
  const course = courses.find(({ id }) => id === courseId);
  if (!course) throw new Error(`Unknown course: ${courseId}`);
  const kindByType = { assignments: "assignment", exams: "exam", projects: "project" } as const;
  const listedResources = course.resources.length ? course.resources : [{ type: "materials" as const, title: "Official course page", url: course.courseUrl }];
  const hasSubstantiveResource = listedResources.some(({ type }) => !["syllabus", "schedule"].includes(type));
  const resources = hasSubstantiveResource
    ? listedResources
    : [...listedResources, { type: "materials" as const, title: "Work through official course materials", url: course.courseUrl }];
  return {
    sourceUrl: course.sourceUrl,
    detail: "resources",
    tasks: resources.map((resource, index) => ({
      id: `official-resource-${index + 1}`,
      title: resource.title,
      titleZh: ({ syllabus: "阅读课程大纲", schedule: "查看课程安排", lectures: "学习讲义与视频", assignments: "完成官方作业", exams: "完成官方考试与测试题", projects: "完成官方课程项目", materials: "学习官方课程资料", downloads: "下载并学习完整资料包" } as const)[resource.type],
      url: resource.url,
      kind: kindByType[resource.type as keyof typeof kindByType] ?? "session",
      resourceType: resource.type,
    })),
  };
}

export const structuredCoursePlans: Record<string, CoursePlanDefinition> = Object.fromEntries(
  courses.map((course) => [course.id, resourcePlan(course.id)]),
);

structuredCoursePlans["mit-18-01sc"] = { sourceUrl: `${base}/syllabus/`, tasks: mit1801Tasks(), detail: "full" };
structuredCoursePlans["harvard-cs50x"] = { sourceUrl: "https://cs50.harvard.edu/x/syllabus/", tasks: cs50xTasks(), detail: "full" };
structuredCoursePlans["harvard-cs50-python"] = { sourceUrl: "https://cs50.harvard.edu/python/weeks/", detail: "full", tasks: cs50WeeklyTasks("python", [["Functions, Variables", "函数与变量"], ["Conditionals", "条件语句"], ["Loops", "循环"], ["Exceptions", "异常"], ["Libraries", "库"], ["Unit Tests", "单元测试"], ["File I/O", "文件输入输出"], ["Regular Expressions", "正则表达式"], ["Object-Oriented Programming", "面向对象编程"], ["Et Cetera", "其他主题"]], "psets") };
structuredCoursePlans["harvard-cs50-ai"] = { sourceUrl: "https://cs50.harvard.edu/ai/weeks/", detail: "full", tasks: cs50WeeklyTasks("ai", [["Search", "搜索"], ["Knowledge", "知识"], ["Uncertainty", "不确定性"], ["Optimization", "优化"], ["Learning", "学习"], ["Neural Networks", "神经网络"], ["Language", "语言"]], "projects", false) };
structuredCoursePlans["harvard-cs50-web"] = { sourceUrl: "https://cs50.harvard.edu/web/weeks/", detail: "full", tasks: cs50WeeklyTasks("web", [["HTML, CSS", "HTML 与 CSS"], ["Git", "Git"], ["Python", "Python"], ["Django", "Django"], ["SQL, Models, and Migrations", "SQL、模型与迁移"], ["JavaScript", "JavaScript"], ["User Interfaces", "用户界面"], ["Testing, CI/CD", "测试与持续集成部署"], ["Scalability and Security", "可扩展性与安全"]], "projects") };
structuredCoursePlans["harvard-cs50-cybersecurity"] = { sourceUrl: "https://cs50.harvard.edu/cybersecurity/", detail: "full", tasks: cs50WeeklyTasks("cybersecurity", [["Securing Accounts", "保护账户"], ["Securing Data", "保护数据"], ["Securing Systems", "保护系统"], ["Securing Software", "保护软件"], ["Preserving Privacy", "保护隐私"]], "assignments") };
structuredCoursePlans["harvard-cs50-sql"] = { sourceUrl: "https://cs50.harvard.edu/sql/weeks/", detail: "full", tasks: cs50WeeklyTasks("sql", [["Querying", "查询"], ["Relating", "关系"], ["Designing", "设计"], ["Writing", "写入"], ["Viewing", "视图"], ["Optimizing", "优化"], ["Scaling", "扩展"]], "psets") };
structuredCoursePlans["harvard-cs50-r"] = { sourceUrl: "https://cs50.harvard.edu/r/weeks/", detail: "full", tasks: cs50WeeklyTasks("r", [["Representing Data", "表示数据"], ["Transforming Data", "转换数据"], ["Applying Functions", "应用函数"], ["Tidying Data", "整理数据"], ["Visualizing Data", "可视化数据"], ["Testing Programs", "测试程序"], ["Packaging Programs", "打包程序"]], "psets", true, 1) };
structuredCoursePlans["harvard-cs50-scratch"] = { sourceUrl: "https://cs50.harvard.edu/scratch/weeks/", detail: "full", tasks: cs50WeeklyTasks("scratch", [["Sprites", "角色"], ["Functions", "函数"], ["Events", "事件"], ["Values", "值"], ["Conditions", "条件"], ["Loops", "循环"], ["Variables", "变量"], ["Abstraction", "抽象"], ["Building from Scratch", "从零构建项目"]], "projects", true, 1) };
structuredCoursePlans["stanford-cs106a"] = { sourceUrl: "https://see.stanford.edu/Course/CS106A", detail: "full", tasks: stanfordCs106aTasks() };
structuredCoursePlans["mit-6-006"] = { sourceUrl: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/", detail: "full", tasks: mit6006Tasks() };
structuredCoursePlans["mit-6-034"] = { sourceUrl: "https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/", detail: "full", tasks: mit6034Tasks() };
structuredCoursePlans["mit-18-06"] = { sourceUrl: "https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/resource-index/", detail: "full", tasks: mit1806Tasks() };
structuredCoursePlans["mit-6-046j"] = { sourceUrl: "https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/", detail: "full", tasks: mit6046Tasks() };
structuredCoursePlans["mit-6-100l"] = { sourceUrl: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", detail: "full", tasks: mitPythonTasks() };
structuredCoursePlans["mit-6-0002"] = { sourceUrl: "https://ocw.mit.edu/courses/6-0002-introduction-to-computational-thinking-and-data-science-fall-2016/", detail: "full", tasks: mit60002Tasks() };
structuredCoursePlans["mit-18-05"] = { sourceUrl: "https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/", detail: "full", tasks: mit1805Tasks() };
structuredCoursePlans["mit-6-042j"] = { sourceUrl: "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/", detail: "full", tasks: mit6042Tasks() };
structuredCoursePlans["mit-18-02sc"] = { sourceUrl: "https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/", detail: "full", tasks: mit1802Tasks() };
structuredCoursePlans["mit-8-01sc"] = { sourceUrl: "https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/", detail: "full", tasks: mit801Tasks() };
structuredCoursePlans["mit-5-111sc"] = { sourceUrl: "https://ocw.mit.edu/courses/5-111sc-principles-of-chemical-science-fall-2014/", detail: "full", tasks: mit5111Tasks() };
structuredCoursePlans["mit-7-012"] = { sourceUrl: "https://ocw.mit.edu/courses/7-012-introduction-to-biology-fall-2004/", detail: "full", tasks: mit7012Tasks() };
structuredCoursePlans["stanford-cs106b"] = { sourceUrl: "https://see.stanford.edu/Course/CS106B", detail: "full", tasks: stanfordCs106bTasks() };
structuredCoursePlans["stanford-cs107"] = { sourceUrl: "https://see.stanford.edu/Course/CS107", detail: "full", tasks: stanfordCs107Tasks() };
structuredCoursePlans["stanford-cs223a"] = { sourceUrl: "https://see.stanford.edu/Course/CS223A", detail: "full", tasks: stanfordCs223aTasks() };
structuredCoursePlans["stanford-cs229"] = { sourceUrl: "https://see.stanford.edu/Course/CS229", detail: "full", tasks: stanfordCs229Tasks() };
structuredCoursePlans["stanford-ee261"] = { sourceUrl: "https://see.stanford.edu/Course/EE261", detail: "full", tasks: stanfordEe261Tasks() };
structuredCoursePlans["stanford-ee263"] = { sourceUrl: "https://see.stanford.edu/Course/EE263", detail: "full", tasks: stanfordEe263Tasks() };
structuredCoursePlans["stanford-ee364a"] = { sourceUrl: "https://see.stanford.edu/Course/EE364A", detail: "full", tasks: stanfordEe364aTasks() };
structuredCoursePlans["stanford-ee364b"] = { sourceUrl: "https://see.stanford.edu/Course/EE364B", detail: "full", tasks: stanfordEe364bTasks() };
structuredCoursePlans["stanford-cs109"] = { sourceUrl: "https://web.stanford.edu/class/cs109/", detail: "full", tasks: stanfordCs109Tasks() };
structuredCoursePlans["stanford-cs111"] = { sourceUrl: "https://web.stanford.edu/class/cs111/", detail: "full", tasks: stanfordCs111Tasks() };
structuredCoursePlans["mit-6-004"] = { sourceUrl: "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/", detail: "full", tasks: mit6004Tasks() };
structuredCoursePlans["mit-6-837"] = { sourceUrl: "https://ocw.mit.edu/courses/6-837-computer-graphics-fall-2012/", detail: "full", tasks: mit6837Tasks() };
structuredCoursePlans["mit-6-824"] = { sourceUrl: "https://ocw.mit.edu/courses/6-824-distributed-computer-systems-engineering-spring-2006/", detail: "full", tasks: mit6824Tasks() };
structuredCoursePlans["mit-6-858"] = { sourceUrl: "https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/", detail: "full", tasks: mit6858Tasks() };
structuredCoursePlans["mit-6-s081"] = { sourceUrl: "https://pdos.csail.mit.edu/6.S081/2021/schedule.html", detail: "full", tasks: mit6s081Tasks() };
structuredCoursePlans["mit-6-172"] = { sourceUrl: "https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/", detail: "full", tasks: mit6172Tasks() };
structuredCoursePlans["mit-6-830"] = { sourceUrl: "https://ocw.mit.edu/courses/6-830-database-systems-fall-2010/", detail: "full", tasks: mit6830Tasks() };
structuredCoursePlans["mit-6-033"] = { sourceUrl: "https://ocw.mit.edu/courses/6-033-computer-system-engineering-spring-2018/", detail: "full", tasks: mit6033Tasks() };
structuredCoursePlans["mit-8-02"] = { sourceUrl: "https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2019/", detail: "full", tasks: mit802Tasks() };
structuredCoursePlans["mit-6-031"] = { sourceUrl: "https://web.mit.edu/6.031/www/fa21/", detail: "full", tasks: mit6031Tasks() };
structuredCoursePlans["mit-6-036"] = { sourceUrl: "https://openlearninglibrary.mit.edu/courses/course-v1%3AMITx%2B6.036%2B1T2019/course/", detail: "full", tasks: mit6036Tasks() };
structuredCoursePlans["mit-6-253"] = { sourceUrl: "https://ocw.mit.edu/courses/6-253-convex-analysis-and-optimization-spring-2012/", detail: "full", tasks: mit6253Tasks() };
structuredCoursePlans["princeton-cos126"] = { sourceUrl: "https://www.cs.princeton.edu/courses/archive/spr26/cos126/schedule/", detail: "full", tasks: princetonCos126Tasks() };
structuredCoursePlans["princeton-cos226"] = { sourceUrl: "https://www.cs.princeton.edu/courses/archive/spring26/cos226/lectures.php", detail: "full", tasks: princetonCos226Tasks() };
structuredCoursePlans["princeton-cos217"] = { sourceUrl: "https://www.cs.princeton.edu/courses/archive/spring25/cos217/classes.php", detail: "full", tasks: princetonCos217Tasks() };
structuredCoursePlans["princeton-cos240"] = { sourceUrl: "https://www.cs.princeton.edu/courses/archive/fall25/cos240/", detail: "full", tasks: princetonCos240Tasks() };
structuredCoursePlans["princeton-cos316"] = { sourceUrl: "https://www.cs.princeton.edu/courses/archive/spring26/cos316/lectures.html", detail: "full", tasks: princetonCos316Tasks() };
structuredCoursePlans["princeton-cos324"] = { sourceUrl: "https://www.cs.princeton.edu/courses/archive/fall18/cos324/", detail: "full", tasks: princetonCos324Tasks() };
structuredCoursePlans["princeton-cos418"] = { sourceUrl: "https://www.cs.princeton.edu/courses/archive/spring24/cos418/schedule.html", detail: "full", tasks: princetonCos418Tasks() };
structuredCoursePlans["princeton-cos423"] = { sourceUrl: "https://www.cs.princeton.edu/courses/archive/spring11/cos423/lectures.php", detail: "full", tasks: princetonCos423Tasks() };
structuredCoursePlans["princeton-cos432"] = { sourceUrl: "https://www.cs.princeton.edu/courses/archive/fall19/cos432/schedule/", detail: "full", tasks: princetonCos432Tasks() };
structuredCoursePlans["princeton-cos461"] = { sourceUrl: "https://www.cs.princeton.edu/courses/archive/fall25/cos461/schedule.html", detail: "full", tasks: princetonCos461Tasks() };
structuredCoursePlans["princeton-mat104"] = { sourceUrl: "https://web.math.princeton.edu/~nelson/104/", detail: "full", tasks: princetonMat104Tasks() };
structuredCoursePlans["princeton-cos333"] = { sourceUrl: "https://www.cs.princeton.edu/courses/archive/spring26/cos333/schedule.html", detail: "full", tasks: princetonCos333Tasks() };
structuredCoursePlans["cornell-cs3780"] = { sourceUrl: "https://www.cs.cornell.edu/courses/cs3780/2026sp/#Schedule", detail: "full", tasks: cornellCs3780Tasks() };
structuredCoursePlans["cornell-cs3410"] = { sourceUrl: "https://www.cs.cornell.edu/courses/cs3410/2026sp/schedule.html", detail: "full", tasks: cornellCs3410Tasks() };
structuredCoursePlans["cornell-cs4410"] = { sourceUrl: "https://www.cs.cornell.edu/courses/cs4410/2026su/", detail: "full", tasks: cornellCs4410Tasks() };
structuredCoursePlans["cornell-cs6787"] = { sourceUrl: "https://www.cs.cornell.edu/courses/cs6787/2026sp/#course-calendar", detail: "full", tasks: cornellCs6787Tasks() };
structuredCoursePlans["cornell-cs2110"] = { sourceUrl: "https://www.cs.cornell.edu/courses/cs2110/2026sp/lectures/lec01/", detail: "full", tasks: cornellCs2110Tasks() };
structuredCoursePlans["cornell-cs3110"] = { sourceUrl: "https://cs3110.github.io/textbook/cover.html", detail: "full", tasks: cornellCs3110Tasks() };
structuredCoursePlans["cornell-cs4820"] = { sourceUrl: "https://www.cs.cornell.edu/courses/cs4820/2026sp/lectures/", detail: "full", tasks: cornellCs4820Tasks() };
structuredCoursePlans["cornell-cs1110"] = { sourceUrl: "https://www.cs.cornell.edu/courses/cs1110/2025fa/lectures/", detail: "full", tasks: cornellCs1110Tasks() };
structuredCoursePlans["princeton-mat103"] = { sourceUrl: "https://web.math.princeton.edu/~nelson/103/", detail: "full", tasks: princetonFoundationTasks("mat103") };
structuredCoursePlans["princeton-mat201"] = { sourceUrl: "https://mat201dev.math.princeton.edu/mat201-syllabus", detail: "full", tasks: princetonFoundationTasks("mat201") };
structuredCoursePlans["princeton-mat202"] = { sourceUrl: "https://mat202.math.princeton.edu/", detail: "full", tasks: princetonFoundationTasks("mat202") };
structuredCoursePlans["princeton-phy103"] = { sourceUrl: "https://www.princeton.edu/academics/area-of-study/physics", detail: "full", tasks: princetonFoundationTasks("phy103") };
structuredCoursePlans["princeton-phy104"] = { sourceUrl: "https://www.princeton.edu/academics/area-of-study/physics", detail: "full", tasks: princetonFoundationTasks("phy104") };
structuredCoursePlans["princeton-chm201"] = { sourceUrl: "https://www.princeton.edu/academics/area-of-study/chemistry", detail: "full", tasks: princetonFoundationTasks("chm201") };
structuredCoursePlans["berkeley-math1a"] = { sourceUrl: "https://undergraduate.catalog.berkeley.edu/courses/1144962", detail: "full", tasks: berkeleyCalculusTasks("math1a") };
structuredCoursePlans["berkeley-math1b"] = { sourceUrl: "https://undergraduate.catalog.berkeley.edu/courses/1145002", detail: "full", tasks: berkeleyCalculusTasks("math1b") };
structuredCoursePlans["berkeley-cs61a"] = { sourceUrl: "https://cs61a.org/fa26/", detail: "full", tasks: berkeleyCs61aTasks() };
structuredCoursePlans["berkeley-cs70"] = { sourceUrl: "https://www.eecs70.org/", detail: "full", tasks: berkeleyCs70Tasks() };
structuredCoursePlans["berkeley-cs170"] = { sourceUrl: "https://cs170.org/", detail: "full", tasks: berkeleyCs170Tasks() };
structuredCoursePlans["berkeley-cs61c"] = { sourceUrl: "https://cs61c.org/fa26/", detail: "full", tasks: berkeleyCs61cTasks() };
structuredCoursePlans["berkeley-cs184"] = { sourceUrl: "https://cs184.eecs.berkeley.edu/sp26/", detail: "full", tasks: berkeleyCs184Tasks() };
for (const id of ["cs61b","cs161","cs188","cs162","cs186","cs189"] as const) structuredCoursePlans[`berkeley-${id}`] = { sourceUrl: ({cs61b:"https://sp26.datastructur.es/",cs161:"https://sp26.cs161.org/",cs188:"https://inst.eecs.berkeley.edu/~cs188/sp26/",cs162:"https://cs162.org/",cs186:"https://cs186berkeley.net/notes/",cs189:"https://eecs189.org/fa26/calendar/"} as const)[id], detail:"full", tasks:berkeleyAdvancedTasks(id) };
const berkeleyMath54Url = "https://math.berkeley.edu/courses/overview/lowerdivcourses/math54";
const berkeleyMath54Topics = [["Linear Systems and Row Reduction", "线性方程组与行化简"], ["Matrix Algebra and Determinants", "矩阵代数与行列式"], ["Vector Spaces, Bases, and Dimension", "向量空间、基与维数"], ["Eigenvalues and Eigenvectors", "特征值与特征向量"], ["Orthogonality and Least Squares", "正交与最小二乘"], ["Symmetric Matrices, Quadratic Forms, and SVD", "对称矩阵、二次型与奇异值分解"], ["Linear Second-Order Differential Equations", "线性二阶微分方程"], ["Systems of Linear Differential Equations", "线性微分方程组"], ["Fourier Series", "傅里叶级数"], ["Official Math 54 Review", "Math 54 官方大纲复习"]] as const;
structuredCoursePlans["berkeley-math54"] = { sourceUrl: berkeleyMath54Url, detail: "full", tasks: berkeleyMath54Topics.map(([title, titleZh], index) => ({ id: `official-unit-${index + 1}`, title: `Official unit ${index + 1}: ${title}`, titleZh: `官方单元 ${index + 1}：${titleZh}`, url: index === 5 ? "https://math.berkeley.edu/sites/default/files/lecture_notes_on_svd_for_math_54.pdf" : berkeleyMath54Url, kind: "session" })) };
for(const id of ["cs103","cs161","cs144","cs143","cs148","cs221","cs155","cs244b"] as const) structuredCoursePlans[`stanford-${id}`]={sourceUrl:({cs103:"https://web.stanford.edu/class/archive/cs/cs103/cs103.1264/",cs161:"https://web.stanford.edu/class/cs161/",cs144:"https://web.stanford.edu/class/cs144/",cs143:"https://web.stanford.edu/class/cs143/",cs148:"https://web.stanford.edu/class/cs148/lectures.html",cs221:"https://stanford-cs221.github.io/spring2026/",cs155:"https://cs155.stanford.edu/syllabus.html",cs244b:"https://www.scs.stanford.edu/24sp-cs244b/sched/"}as const)[id],detail:"full",tasks:stanfordAdvancedTasks(id)};
const compactPlanSources={
 "washington-cse550":["https://courses.cs.washington.edu/courses/cse550/26sp/","systems"],"tsinghua-20740112":["https://pacman.cs.tsinghua.edu.cn/~hanwentao/dsa/","dataStructures"],"tsinghua-computer-graphics":["https://cg.cs.tsinghua.edu.cn/course/course_main.htm","graphics"],"pku-computing-intro":["https://courseweb.pku.edu.cn/course/CourseAction.do?course_id=87&dispatch=toIndex&longa=1&view=%2Fopencourse2%2Fcourse.jsp","programming"],"pku-data-structures":["https://courseweb.pku.edu.cn/course/CourseAction.do?course_id=121&dispatch=toIndex&longa=1&view=%2Fopencourse2%2Fcourse.jsp","dataStructures"],"pku-operating-systems":["https://ceca.pku.edu.cn/courses/2017fall/45ceca1228454.htm","systems"],"tsinghua-20740164":["https://pacman.cs.tsinghua.edu.cn/~hanwentao/cpct/","programming"],"tsinghua-database-technology":["https://dbgroup.cs.tsinghua.edu.cn/jnwang/ai-data-foundation/index.html","databases"],"uiuc-cs124":["https://www.cs124.org/","programming"],"uiuc-cs128":["https://www.cs128.org/","programming"],"uiuc-cs225":["https://courses.grainger.illinois.edu/cs225/sp2026/","dataStructures"],"gatech-cs1301":["https://syllabus.gatech.edu/syllabi/829/1301/B/pdf","programming"],"gatech-cs2110":["https://cs2110.gatech.edu/","systems"],"gatech-cs3510":["https://faculty.cc.gatech.edu/~ladha/S26/3510/","algorithms"],"harvard-cs61":["https://cs61.seas.harvard.edu/site/2025/","systems"]} as const;
for(const [id,[url,curriculum]] of Object.entries(compactPlanSources)) structuredCoursePlans[id]={sourceUrl:url,detail:"full",tasks:compactOfficialPlan(url,curriculum)};
const cmuPlanSources={"cmu-15-112":["https://www.cs.cmu.edu/~15112q-f25/","programming"],"cmu-15-122":["https://www.cs.cmu.edu/~15122/","programming"],"cmu-15-213":["https://www.cs.cmu.edu/~213/","systems"],"cmu-15-451":["https://www.csd.cs.cmu.edu/course/15451/s26","algorithms"],"cmu-15-150":["https://www.cs.cmu.edu/~15150/","functional"],"cmu-15-210":["https://www.cs.cmu.edu/afs/cs/academic/class/15210-f18/www/","dataStructures"],"cmu-15-251":["https://www.cs.cmu.edu/~15251/","theory"],"cmu-21-120":["https://www.cmu.edu/math/undergrad/exams/precalculus-calculus-placement-exams.html","calculus"],"cmu-21-122":["https://www.math.cmu.edu/~handron/21_122/","calculus"],"cmu-15-151":["https://coursecatalog.web.cmu.edu/schools-colleges/schoolofcomputerscience/undergraduatecomputerscience/","theory"],"cmu-21-241":["https://www.math.cmu.edu/~ldietric/21-241/","linearAlgebra"],"cmu-21-266":["https://coursecatalog.web.cmu.edu/schools-colleges/schoolofcomputerscience/undergraduatecomputerscience/","linearAlgebra"],"cmu-15-259":["https://www.cs.cmu.edu/~harchol/PnC/class.html","probability"],"cmu-15-440":["https://www.csd.cs.cmu.edu/15440640-distributed-systems","distributed"],"cmu-15-445":["https://db.cs.cmu.edu/courses/","databases"],"cmu-15-362":["https://graphics.cs.cmu.edu/courses/","graphics"],"cmu-15-312":["https://www.csd.cs.cmu.edu/course/15312/f26","programmingLanguages"],"cmu-15-281":["https://www.cs.cmu.edu/~15281/","ai"],"cmu-15-330":["https://www.cs.cmu.edu/~rdriley/330/index.html","security"]} as const;
for(const [id,[url,curriculum]] of Object.entries(cmuPlanSources)) structuredCoursePlans[id]={sourceUrl:url,detail:"full",tasks:compactOfficialPlan(url,curriculum)};
const cmu15418Base = "https://www.cs.cmu.edu/afs/cs/academic/class/15418-s26/www";
const cmu15418Schedule = `${cmu15418Base}/schedule.html`;
const cmu15418Topics = [["Why Parallelism", "为什么需要并行"], ["Modern Multicore Processors", "现代多核处理器"], ["Parallel Programming Models", "并行编程模型"], ["Parallel Programming Basics", "并行编程基础"], ["Work Distribution and Scheduling", "工作分配与调度"], ["Locality, Communication, and Contention", "局部性、通信与争用"], ["GPU Architecture and CUDA", "GPU 体系结构与 CUDA"], ["Parallel Application Case Studies", "并行应用案例"], ["Workload-Driven Performance Evaluation", "工作负载驱动的性能评估"], ["Interconnection Networks", "互连网络"], ["Performance Measurement and Tuning", "性能测量与调优"], ["Snooping Cache Coherence", "监听式缓存一致性"], ["Directory-Based Cache Coherence", "目录式缓存一致性"], ["Snooping Implementation", "监听协议实现"], ["Memory Consistency", "内存一致性"], ["Implementing Synchronization", "同步机制实现"], ["Fine-Grained Synchronization and Lock-Free Programming", "细粒度同步与无锁编程"], ["Transactional Memory", "事务内存"], ["Message Passing and Parallel Runtimes", "消息传递与并行运行时"], ["Prefetching", "预取"], ["Domain-Specific Programming Languages", "领域专用编程语言"], ["Domain-Specific Graph Programming", "领域专用图编程"], ["Heterogeneous Parallelism", "异构并行"], ["Parallel Deep Learning: Data Parallelism", "并行深度学习：数据并行"], ["Parallel Deep Learning: Model and Pipeline Parallelism", "并行深度学习：模型与流水线并行"]] as const;
const cmu15418Tasks: PlanTask[] = cmu15418Topics.map(([title, titleZh], index) => ({ id: `lecture-${index + 1}`, title: `Official lecture ${index + 1}: ${title}`, titleZh: `官方讲次 ${index + 1}：${titleZh}`, url: cmu15418Schedule, kind: "session" }));
[["Exploring Parallel Computing", "探索并行计算"], ["GPU Programming in CUDA", "使用 CUDA 进行 GPU 编程"], ["Parallel VLSI Wire Routing with OpenMP", "使用 OpenMP 的并行 VLSI 布线"], ["Parallel VLSI Wire Routing with MPI", "使用 MPI 的并行 VLSI 布线"]].forEach(([title, titleZh], index) => cmu15418Tasks.push({ id: `assignment-${index + 1}`, title: `Programming assignment ${index + 1}: ${title}`, titleZh: `编程作业 ${index + 1}：${titleZh}`, url: `${cmu15418Base}/assignments.html`, kind: "assignment" }));
cmu15418Tasks.push({ id: "exam-1", title: "Exam 1", titleZh: "考试一", url: `${cmu15418Base}/exams.html`, kind: "exam" }, { id: "exam-2", title: "Exam 2", titleZh: "考试二", url: `${cmu15418Base}/exams.html`, kind: "exam" });
[["Project Proposal", "项目提案"], ["Milestone Report", "里程碑报告"], ["Milestone Meeting", "里程碑会议"], ["Final Report", "最终报告"], ["Poster Session", "海报展示"]].forEach(([title, titleZh], index) => cmu15418Tasks.push({ id: `project-${index + 1}`, title, titleZh, url: `${cmu15418Base}/projects.html`, kind: "project" }));
structuredCoursePlans["cmu-15-418"] = { sourceUrl: cmu15418Schedule, detail: "full", tasks: cmu15418Tasks };

function catalogTopicPlan(url: string, topics: readonly (readonly [string, string])[]): PlanTask[] {
  return topics.map(([title, titleZh], index) => ({ id: `official-unit-${index + 1}`, title: `Official unit ${index + 1}: ${title}`, titleZh: `官方单元 ${index + 1}：${titleZh}`, url, kind: "session" }));
}
const cornellMathCatalog = "https://math.cornell.edu/lower-level-courses";
structuredCoursePlans["cornell-math1910"] = { sourceUrl: "https://math.cornell.edu/math-engineering", detail: "full", tasks: catalogTopicPlan(cornellMathCatalog, [["Integration Techniques", "积分方法"], ["Areas and Volumes", "面积与体积"], ["Exponential Growth", "指数增长"], ["Partial Fractions", "部分分式"], ["Infinite Sequences and Series", "无穷数列与级数"], ["Convergence Tests", "收敛判别法"], ["Power Series", "幂级数"]]) };
structuredCoursePlans["cornell-math1920"] = { sourceUrl: "https://pi.math.cornell.edu/~web1920/info.html", detail: "full", tasks: catalogTopicPlan(cornellMathCatalog, [["Partial Derivatives", "偏导数"], ["Double Integrals", "二重积分"], ["Triple Integrals", "三重积分"], ["Line Integrals", "线积分"], ["Surface Integrals", "曲面积分"], ["Vector Fields", "向量场"], ["Green's Theorem", "Green 定理"], ["Stokes' Theorem", "Stokes 定理"], ["Divergence Theorem", "散度定理"]]) };
const cornellCs2800Roster = "https://classes.cornell.edu/browse/roster/FA25/class/CS/2800";
structuredCoursePlans["cornell-cs2800"] = { sourceUrl: cornellCs2800Roster, detail: "full", tasks: catalogTopicPlan(cornellCs2800Roster, [["Induction and Logical Proof", "归纳与逻辑证明"], ["Propositional Calculus", "命题演算"], ["Predicate Calculus", "谓词演算"], ["Sets, Functions, and Relations", "集合、函数与关系"], ["Graph Theory", "图论"], ["Combinatorics", "组合数学"], ["Discrete Mathematics", "离散数学"], ["Basic Probability", "基础概率"], ["Finite-State Machines", "有限状态机"]]) };
structuredCoursePlans["cornell-math2940"] = { sourceUrl: cornellMathCatalog, detail: "full", tasks: catalogTopicPlan(cornellMathCatalog, [["Matrices and Determinants", "矩阵与行列式"], ["Vector Spaces", "向量空间"], ["Eigenvalues and Eigenvectors", "特征值与特征向量"], ["Orthogonality and Inner Products", "正交与内积"], ["Difference Equations", "差分方程"], ["Markov Chains", "马尔可夫链"], ["Systems of Linear Differential Equations", "线性微分方程组"]]) };

const harvardCs20Schedule = "https://lewis.seas.harvard.edu/pages/schedule-1";
const harvardCs20Topics = [["Pigeonhole Principle", "鸽巢原理"], ["Proofs", "证明"], ["Mathematical Induction I", "数学归纳法（一）"], ["Mathematical Induction II", "数学归纳法（二）"], ["Propositional Logic", "命题逻辑"], ["Equivalences and Normal Forms", "等价关系与范式"], ["Logic and Computers", "逻辑与计算机"], ["Quantificational Logic I", "量化逻辑（一）"], ["Quantificational Logic II", "量化逻辑（二）"], ["Sets", "集合"], ["Relations and Functions", "关系与函数"], ["Uncountable Sets", "不可数集合"], ["Induction", "归纳法"], ["Strong Induction", "强归纳法"], ["Structural Induction", "结构归纳法"], ["States and Invariants", "状态与不变量"], ["Directed Graphs", "有向图"], ["Graphs and Relations", "图与关系"], ["Undirected Graphs", "无向图"], ["Connectivity", "连通性"], ["Graph Coloring", "图着色"], ["Growth Rates of Functions", "函数增长率"], ["Basic Counting", "基础计数"], ["Counting Subsets", "子集计数"], ["Basic Probability", "基础概率"], ["Conditional Probability", "条件概率"], ["Bayes' Theorem", "贝叶斯定理"], ["Random Variables and Expectation", "随机变量与期望"], ["Convergent and Divergent Series", "收敛与发散级数"], ["Solving Recurrences", "递推关系求解"], ["Fast Arithmetic", "快速算术"], ["Public-Key Cryptography", "公钥密码学"]] as const;
const harvardCs20Tasks = catalogTopicPlan(harvardCs20Schedule, harvardCs20Topics);
harvardCs20Tasks.splice(10, 0, { id: "midterm", title: "Official midterm", titleZh: "官方期中考试", url: harvardCs20Schedule, kind: "exam" });
harvardCs20Tasks.push({ id: "proof-review", title: "Official proof-writing review", titleZh: "官方证明写作复习", url: harvardCs20Schedule, kind: "session" }, { id: "final-review", title: "Official final review", titleZh: "官方期末复习", url: harvardCs20Schedule, kind: "session" }, { id: "final", title: "Official final examination", titleZh: "官方期末考试", url: harvardCs20Schedule, kind: "exam" });
structuredCoursePlans["harvard-cs20"] = { sourceUrl: harvardCs20Schedule, detail: "full", tasks: harvardCs20Tasks };

const harvardMath21bSyllabus = "https://abel.math.harvard.edu/archive/21b_spring_04/syllabus/syllabus.html";
const harvardMath21bTopics = [["Linear Systems", "线性方程组"], ["Matrices and Gauss-Jordan Elimination", "矩阵与 Gauss-Jordan 消元"], ["Solutions to Linear Systems", "线性方程组的解"], ["Linear Transformations", "线性变换"], ["Linear Transformations in Geometry", "几何中的线性变换"], ["Inverse Transformations", "逆变换"], ["Matrix Products", "矩阵乘法"], ["Image and Kernel", "像与核"], ["Subspaces, Bases, and Linear Independence", "子空间、基与线性无关"], ["Dimension", "维数"], ["Coordinates", "坐标"], ["Orthonormal Bases and Projections", "标准正交基与投影"], ["Gram-Schmidt and QR Factorization", "Gram-Schmidt 与 QR 分解"], ["Orthogonal Transformations", "正交变换"], ["Least Squares and Data Fitting", "最小二乘与数据拟合"], ["Determinants", "行列式"], ["Eigenvalues", "特征值"], ["Eigenvectors and Diagonalization", "特征向量与对角化"], ["Complex Eigenvalues and Stability", "复特征值与稳定性"], ["Symmetric Matrices", "对称矩阵"], ["Differential Equations", "微分方程"], ["Nonlinear Systems", "非线性系统"], ["Function Spaces", "函数空间"], ["Differential Operators", "微分算子"], ["Fourier Series", "傅里叶级数"], ["Partial Differential Equations", "偏微分方程"]] as const;
const harvardMath21bTasks = catalogTopicPlan(harvardMath21bSyllabus, harvardMath21bTopics);
const harvardMath21bHomework = "https://abel.math.harvard.edu/archive/21b_spring_04/reg_assignments/index.html";
for (let index = 1; index <= 13; index += 1) harvardMath21bTasks.splice(Math.min(index * 3, harvardMath21bTasks.length), 0, { id: `homework-${index}`, title: `Official homework week ${index}`, titleZh: `官方第 ${index} 周作业`, url: harvardMath21bHomework, kind: "assignment" });
harvardMath21bTasks.push({ id: "midterm", title: "Official midterm and review", titleZh: "官方期中考试与复习", url: "https://people.math.harvard.edu/archive/21b_spring_04/exams/", kind: "exam" }, { id: "final", title: "Official final examination and review", titleZh: "官方期末考试与复习", url: "https://people.math.harvard.edu/archive/21b_spring_04/exams/", kind: "exam" });
structuredCoursePlans["harvard-math21b"] = { sourceUrl: harvardMath21bSyllabus, detail: "full", tasks: harvardMath21bTasks };

const harvardStat110Lectures = "https://stat110.hsites.harvard.edu/youtube";
const harvardStat110Topics = [["Sample Spaces, Probability, and Counting", "样本空间、概率与计数"], ["Story Proofs and Probability Axioms", "故事证明与概率公理"], ["Birthday Problem and Inclusion-Exclusion", "生日问题与容斥原理"], ["Independence, Conditional Probability, and Bayes' Rule", "独立性、条件概率与贝叶斯定理"], ["Total Probability and Conditional Independence", "全概率与条件独立"], ["Monty Hall and Simpson's Paradox", "蒙提霍尔问题与 Simpson 悖论"], ["Random Variables, Bernoulli, and Binomial", "随机变量、Bernoulli 与二项分布"], ["CDFs, PMFs, and Hypergeometric Distribution", "CDF、PMF 与超几何分布"], ["Geometric Distribution and Expected Values", "几何分布与期望"], ["Linearity and Negative Binomial", "线性性与负二项分布"], ["Poisson Distribution and Approximation", "Poisson 分布与近似"], ["Continuous Distributions and Variance", "连续分布与方差"], ["Standard Normal Distribution", "标准正态分布"], ["Normal Distribution and LOTUS", "正态分布与 LOTUS"], ["Midterm Review", "期中复习"], ["Exponential Distribution", "指数分布"], ["Moment Generating Functions", "矩母函数"], ["MGFs, Sums, and Joint Distributions", "矩母函数、和与联合分布"], ["Joint, Conditional, and Marginal Distributions", "联合、条件与边缘分布"], ["Multinomial and Cauchy Distributions", "多项分布与 Cauchy 分布"], ["Covariance and Correlation", "协方差与相关"], ["Transformations and Convolutions", "变量变换与卷积"], ["Beta Distribution", "Beta 分布"], ["Gamma Distribution and Poisson Processes", "Gamma 分布与 Poisson 过程"], ["Order Statistics and Conditional Expectation", "顺序统计量与条件期望"], ["Conditional Expectation and Waiting Times", "条件期望与等待时间"], ["Laws of Conditional Expectation", "条件期望定律"], ["Random Sums and Inequalities", "随机和与不等式"], ["Law of Large Numbers and Central Limit Theorem", "大数定律与中心极限定理"], ["Chi-Square, Student-t, and Multivariate Normal", "卡方、Student-t 与多元正态"], ["Markov Chains and Stationary Distributions", "马尔可夫链与平稳分布"], ["Irreducibility, Reversibility, and Random Walks", "不可约性、可逆性与随机游走"], ["Markov Chains and PageRank", "马尔可夫链与 PageRank"], ["Course Synthesis and Further Study", "课程总结与后续学习"]] as const;
const harvardStat110Tasks = catalogTopicPlan(harvardStat110Lectures, harvardStat110Topics);
const harvardStat110Practice = "https://stat110.hsites.harvard.edu/strategic-practice-problems";
for (let index = 1; index <= 11; index += 1) harvardStat110Tasks.splice(Math.min(index * 4, harvardStat110Tasks.length), 0, { id: `homework-${index}`, title: `Strategic practice and homework ${index}`, titleZh: `策略练习与作业 ${index}`, url: harvardStat110Practice, kind: "assignment" });
structuredCoursePlans["harvard-stat110"] = { sourceUrl: harvardStat110Lectures, detail: "full", tasks: harvardStat110Tasks };

const uiucMath221Syllabus = "https://math.illinois.edu/resources/syllabus-math-221";
const uiucMath221Topics = [["Tangent and Velocity Problems", "切线与速度问题"], ["Limits and Limit Laws", "极限与极限定律"], ["Continuity", "连续性"], ["Limits at Infinity", "无穷远处的极限"], ["Derivatives and Rates of Change", "导数与变化率"], ["Polynomial and Exponential Derivatives", "多项式与指数函数导数"], ["Product and Quotient Rules", "乘积与商法则"], ["Trigonometric Derivatives", "三角函数导数"], ["Chain Rule", "链式法则"], ["Implicit and Logarithmic Differentiation", "隐函数与对数求导"], ["Growth, Decay, and Related Rates", "增长、衰减与相关变化率"], ["Linear Approximation", "线性近似"], ["Extrema and Mean Value Theorem", "极值与中值定理"], ["Graph Shape and L'Hospital's Rule", "图像形状与 L'Hospital 法则"], ["Curve Sketching and Optimization", "曲线绘制与优化"], ["Newton's Method and Antiderivatives", "Newton 方法与原函数"], ["Definite Integrals", "定积分"], ["Fundamental Theorem of Calculus", "微积分基本定理"], ["Indefinite Integrals and Substitution", "不定积分与换元法"], ["Areas and Volumes", "面积与体积"], ["Cylindrical Shells and Work", "柱壳法与功"], ["Average Value", "平均值"]] as const;
structuredCoursePlans["uiuc-math221"] = { sourceUrl: uiucMath221Syllabus, detail: "full", tasks: catalogTopicPlan(uiucMath221Syllabus, uiucMath221Topics) };
const uiucMath231Syllabus = "https://math.illinois.edu/resources/syllabus-math-231";
const uiucMath231Topics = [["Integration by Parts", "分部积分"], ["Trigonometric Integrals", "三角积分"], ["Trigonometric Substitution", "三角换元"], ["Partial Fractions", "部分分式"], ["Integration Strategy", "积分策略"], ["Approximate and Improper Integrals", "近似积分与反常积分"], ["Arc Length", "弧长"], ["Surface Area and Physical Applications", "曲面面积与物理应用"], ["Sequences", "数列"], ["Series", "级数"], ["Integral and Comparison Tests", "积分与比较判别法"], ["Alternating Series", "交错级数"], ["Absolute Convergence, Ratio, and Root Tests", "绝对收敛、比值与根值判别"], ["Power Series", "幂级数"], ["Functions as Power Series", "函数的幂级数表示"], ["Taylor and Maclaurin Series", "Taylor 与 Maclaurin 级数"], ["Taylor Polynomial Applications", "Taylor 多项式应用"], ["Parametric Curves", "参数曲线"], ["Calculus with Parametric Curves", "参数曲线微积分"], ["Polar Coordinates", "极坐标"], ["Polar Areas and Lengths", "极坐标面积与长度"]] as const;
structuredCoursePlans["uiuc-math231"] = { sourceUrl: uiucMath231Syllabus, detail: "full", tasks: catalogTopicPlan(uiucMath231Syllabus, uiucMath231Topics) };

const uiucCs173Schedule = "https://courses.grainger.illinois.edu/cs173/su2026/ALL-lectures/lecture-schedule.html";
const uiucCs173Topics = [["Mathematical Review", "数学复习"], ["Logic", "逻辑"], ["Proofs", "证明"], ["Number Theory", "数论"], ["Sets", "集合"], ["Relations", "关系"], ["Onto Functions", "满射函数"], ["One-to-One Functions", "单射函数"], ["Graphs", "图"], ["Two-Way Bounding", "双向界定"], ["Induction", "归纳法"], ["Recursive Definitions", "递归定义"], ["Trees", "树"], ["Asymptotic Analysis", "渐近分析"], ["Algorithms", "算法"], ["NP and Computational Limits", "NP 与计算限制"], ["Proof by Contradiction", "反证法"], ["Sets of Sets", "集合族"], ["State Diagrams", "状态图"], ["Countability", "可数性"], ["Planar Graphs", "平面图"]] as const;
structuredCoursePlans["uiuc-cs173"] = { sourceUrl: uiucCs173Schedule, detail: "full", tasks: catalogTopicPlan(uiucCs173Schedule, uiucCs173Topics) };

const uiucCs341Schedule = "https://cs341.cs.illinois.edu/schedule.html";
const uiucCs341LectureTitles = [["Welcome to System Programming", "系统编程导论"], ["How to Crash in C", "C 程序崩溃分析"], ["A Day at the C Side", "C 语言实践"], ["Formatted Input", "格式化输入"], ["Fork and Wait", "fork 与 wait"], ["Forking Processes", "进程派生"], ["Signals for Process Control", "进程控制信号"], ["Memory Allocator Foundations", "内存分配器基础"], ["Memory Allocators I", "内存分配器（一）"], ["Memory Allocators II", "内存分配器（二）"], ["Threads", "线程"], ["Threads, Memory, and Mutex Locks", "线程、内存与互斥锁"], ["Mutexes and Semaphores", "互斥锁与信号量"], ["Condition Variables I", "条件变量（一）"], ["Condition Variables II", "条件变量（二）"], ["Counting Semaphores", "计数信号量"], ["Producer-Consumer and Barriers", "生产者-消费者与屏障"], ["Readers-Writers and Deadlock I", "读写者与死锁（一）"], ["Readers-Writers and Deadlock II", "读写者与死锁（二）"], ["Dining Philosophers", "哲学家进餐问题"], ["Page Tables and IPC", "页表与进程间通信"], ["Pipes and Seeking", "管道与定位"], ["Files, Pipes, and Seeking", "文件、管道与定位"], ["UDP and TCP", "UDP 与 TCP"], ["TCP Client", "TCP 客户端"], ["TCP Server", "TCP 服务器"], ["Filesystems I", "文件系统（一）"], ["Filesystems II", "文件系统（二）"], ["Filesystems III", "文件系统（三）"], ["Filesystems IV", "文件系统（四）"], ["RAID", "RAID"], ["Scheduling Algorithms", "调度算法"], ["Epoll", "epoll"], ["Disks and Signals", "磁盘与信号"], ["Working with Signals", "信号处理"], ["Networking Protocols", "网络协议"], ["Remote Procedure Calls", "远程过程调用"], ["Systems Concepts Review", "系统概念复习"], ["Security", "安全"], ["Course Review", "课程复习"]] as const;
const uiucCs341Tasks: PlanTask[] = uiucCs341LectureTitles.map(([title, titleZh], index) => ({ id: `lecture-${index + 1}`, title: `Official lecture ${index + 1}: ${title}`, titleZh: `官方讲次 ${index + 1}：${titleZh}`, url: uiucCs341Schedule, kind: "session" }));
const uiucCs341Assignments = "https://cs341.cs.illinois.edu/assignments.html";
[["Extreme Edge Cases", "极端边界情况"], ["Vector", "向量"], ["Shell", "命令行 Shell"], ["Malloc", "内存分配器"], ["Password Cracker", "密码破解器"], ["Parallel Make", "并行 Make"], ["Finding Filesystems", "查找文件系统"], ["Nonstop Networking", "持续网络通信"]].forEach(([title, titleZh], index) => uiucCs341Tasks.push({ id: `machine-problem-${index + 1}`, title: `Machine problem ${index + 1}: ${title}`, titleZh: `机器作业 ${index + 1}：${titleZh}`, url: uiucCs341Assignments, kind: "project" }));
[["Luscious Locks", "锁"], ["Perilous Pointers", "指针"], ["Utilities Unleashed", "实用工具"], ["Mini Memcheck", "内存检查"], ["Teaching Threads", "线程"], ["Critical Concurrency", "并发"], ["Deadlock Demolition", "死锁"], ["Ideal Indirection", "间接寻址"], ["MapReduce", "MapReduce"], ["Charming Chatroom", "聊天室"], ["Deepfried dd", "dd 工具"], ["Mad Mad Access Patterns", "访问模式"], ["Savvy Scheduler", "调度器"], ["Lovable Linux", "Linux 综合"]].forEach(([title, titleZh], index) => uiucCs341Tasks.push({ id: `lab-${index + 1}`, title: `Official lab ${index + 1}: ${title}`, titleZh: `官方实验 ${index + 1}：${titleZh}`, url: uiucCs341Assignments, kind: "assignment" }));
uiucCs341Tasks.push({ id: "midterm", title: "Official midterm examination", titleZh: "官方期中考试", url: "https://cs341.cs.illinois.edu/syllabus.html", kind: "exam" }, { id: "final", title: "Official final examination", titleZh: "官方期末考试", url: "https://cs341.cs.illinois.edu/syllabus.html", kind: "exam" });
structuredCoursePlans["uiuc-cs341"] = { sourceUrl: uiucCs341Schedule, detail: "full", tasks: uiucCs341Tasks };

const uiucCs357Resources = "https://cs357.cs.illinois.edu/pages/resources.html";
const uiucCs357Topics = [["Python for Numerical Computing", "数值计算 Python"], ["Errors and Complexity", "误差与复杂度"], ["Floating-Point Representation", "浮点表示"], ["Rounding and Cancellation", "舍入与消去误差"], ["Taylor Series", "Taylor 级数"], ["Randomness and Monte Carlo Methods", "随机性与 Monte Carlo 方法"], ["Vectors, Matrices, and Norms", "向量、矩阵与范数"], ["Linear Systems and LU Decomposition", "线性方程组与 LU 分解"], ["Sparse Matrices", "稀疏矩阵"], ["Condition Numbers", "条件数"], ["Eigenvalues and Eigenvectors", "特征值与特征向量"], ["Markov Chains", "马尔可夫链"], ["Finite Difference Methods", "有限差分方法"], ["Nonlinear Equations", "非线性方程"], ["Optimization", "优化"], ["Least-Squares Fitting", "最小二乘拟合"], ["Singular Value Decomposition", "奇异值分解"], ["Principal Component Analysis", "主成分分析"], ["Numerical Methods Synthesis", "数值方法综合"]] as const;
const uiucCs357Tasks: PlanTask[] = uiucCs357Topics.flatMap(([title, titleZh], index) => [{ id: `lesson-${index + 1}`, title: `Official lesson ${index + 1}: ${title}`, titleZh: `官方课程 ${index + 1}：${titleZh}`, url: uiucCs357Resources, kind: "session" as const }, { id: `homework-${index + 1}`, title: `Official homework practice: ${title}`, titleZh: `官方作业练习：${titleZh}`, url: "https://cs357.cs.illinois.edu/pages/schedule.html", kind: "assignment" as const }]);
for (let index = 1; index <= 5; index += 1) uiucCs357Tasks.push({ id: `machine-problem-${index}`, title: `Official machine problem ${index}`, titleZh: `官方机器作业 ${index}`, url: "https://cs357.cs.illinois.edu/pages/schedule.html", kind: "project" });
for (let index = 1; index <= 6; index += 1) uiucCs357Tasks.push({ id: `quiz-${index}`, title: `Official quiz ${index}`, titleZh: `官方测验 ${index}`, url: "https://cs357.cs.illinois.edu/pages/syllabus.html", kind: "exam" });
uiucCs357Tasks.push({ id: "final", title: "Official final examination", titleZh: "官方期末考试", url: "https://cs357.cs.illinois.edu/pages/syllabus.html", kind: "exam" });
structuredCoursePlans["uiuc-cs357"] = { sourceUrl: uiucCs357Resources, detail: "full", tasks: uiucCs357Tasks };

const uiucCs361Syllabus = "https://ws.engr.illinois.edu/custom/getsyllabus.asp?id=3220";
const uiucCs361Topics = [["Data Visualization and Summaries", "数据可视化与汇总"], ["Descriptive Statistics", "描述统计"], ["Conditional Probability", "条件概率"], ["Independence", "独立性"], ["Bayes' Theorem", "贝叶斯定理"], ["Random Variables", "随机变量"], ["Joint and Conditional Distributions", "联合与条件分布"], ["Expectation", "期望"], ["Variance and Covariance", "方差与协方差"], ["Central Limit Theorem", "中心极限定理"], ["Markov and Chebyshev Inequalities", "Markov 与 Chebyshev 不等式"], ["Law of Large Numbers", "大数定律"], ["Markov Chains", "马尔可夫链"], ["Simulation and PageRank", "模拟与 PageRank"], ["Populations and Sampling", "总体与抽样"], ["Sample Mean and Standard Error", "样本均值与标准误"], ["Maximum-Likelihood Estimation", "最大似然估计"], ["Bayesian Estimation", "贝叶斯估计"], ["Hypothesis Testing", "假设检验"], ["Confidence Intervals", "置信区间"], ["Linear Regression", "线性回归"], ["Principal Component Analysis", "主成分分析"], ["Classification", "分类"], ["Decision Trees", "决策树"]] as const;
structuredCoursePlans["uiuc-cs361"] = { sourceUrl: uiucCs361Syllabus, detail: "full", tasks: catalogTopicPlan(uiucCs361Syllabus, uiucCs361Topics) };

const uiucCs374Calendar = "https://courses.grainger.illinois.edu/cs374al1/sp2026/calendar/";
const uiucCs374Topics = [["Strings and Induction", "字符串与归纳"], ["Languages and Regular Expressions", "语言与正则表达式"], ["Deterministic Finite Automata", "确定有限自动机"], ["DFA Product Construction and Closure", "DFA 积构造与闭包"], ["Nonregularity and Nondeterministic Automata", "非正则性与非确定自动机"], ["NFA Equivalence", "NFA 等价性"], ["Language Transformations", "语言变换"], ["Context-Free Grammars", "上下文无关文法"], ["Turing Machines", "图灵机"], ["Recursion and Sorting", "递归与排序"], ["Divide and Conquer", "分治"], ["Backtracking", "回溯"], ["Dynamic Programming", "动态规划"], ["Tree-Shaped Dynamic Programming", "树形动态规划"], ["Graph Search", "图搜索"], ["DFS, Topological Sort, and SCCs", "DFS、拓扑排序与强连通分量"], ["Shortest Paths", "最短路"], ["All-Pairs Shortest Paths", "全源最短路"], ["Greedy Algorithms", "贪心算法"], ["Polynomial-Time Reductions", "多项式时间归约"], ["P, NP, and NP-Completeness", "P、NP 与 NP 完全性"], ["NP-Hardness Reductions I", "NP 难归约（一）"], ["NP-Hardness Reductions II", "NP 难归约（二）"], ["Undecidability and the Halting Problem", "不可判定性与停机问题"], ["Rice's Theorem", "Rice 定理"], ["Course Review", "课程复习"]] as const;
const uiucCs374Tasks = catalogTopicPlan(uiucCs374Calendar, uiucCs374Topics);
const uiucCs374Homeworks = "https://courses.grainger.illinois.edu/cs374al1/sp2026/homeworks/";
for (let index = 1; index <= 12; index += 1) uiucCs374Tasks.push({ id: `homework-${index}`, title: `Official homework ${index}`, titleZh: `官方作业 ${index}`, url: uiucCs374Homeworks, kind: "assignment" });
const uiucCs374Exams = "https://courses.grainger.illinois.edu/cs374al1/sp2026/exams/";
uiucCs374Tasks.push({ id: "midterm-1", title: "Official midterm 1", titleZh: "官方期中考试一", url: uiucCs374Exams, kind: "exam" }, { id: "midterm-2", title: "Official midterm 2", titleZh: "官方期中考试二", url: uiucCs374Exams, kind: "exam" }, { id: "final", title: "Official final examination", titleZh: "官方期末考试", url: uiucCs374Exams, kind: "exam" });
structuredCoursePlans["uiuc-cs374"] = { sourceUrl: uiucCs374Calendar, detail: "full", tasks: uiucCs374Tasks };

const gatechMath1551Syllabus = "https://syllabus.gatech.edu/sites/default/files/2026-04/MATH_1551_Fa26_F.pdf";
const gatechMath1551Topics = [["Functions and Mathematical Models", "函数与数学模型"], ["Limits from Tables and Graphs", "由表格与图像理解极限"], ["Limit Laws", "极限定律"], ["Continuity", "连续性"], ["Derivative as a Rate of Change", "导数与变化率"], ["Basic Differentiation Rules", "基本求导规则"], ["Product and Quotient Rules", "乘积与商法则"], ["Chain Rule", "链式法则"], ["Implicit Differentiation", "隐函数求导"], ["Exponential and Logarithmic Derivatives", "指数与对数函数求导"], ["Related Rates", "相关变化率"], ["Linear Approximation", "线性近似"], ["Curve Analysis", "曲线分析"], ["Optimization", "优化"]] as const;
structuredCoursePlans["gatech-math1551"] = { sourceUrl: gatechMath1551Syllabus, detail: "full", tasks: catalogTopicPlan(gatechMath1551Syllabus, gatechMath1551Topics) };

const gatechMath1552Syllabus = "https://syllabus.gatech.edu/sites/default/files/2026-04/syllabus_1552_Su26_0.pdf";
const gatechMath1552Topics = [["Antiderivatives and Definite Integrals", "原函数与定积分"], ["Riemann Sums", "Riemann 和"], ["Fundamental Theorem of Calculus", "微积分基本定理"], ["Substitution", "换元积分"], ["Areas and Volumes", "面积与体积"], ["Integration by Parts", "分部积分"], ["Trigonometric Integrals", "三角积分"], ["Trigonometric Substitution", "三角换元"], ["Partial Fractions", "部分分式"], ["Improper Integrals", "反常积分"], ["Sequences", "数列"], ["Infinite Series", "无穷级数"], ["Comparison and Integral Tests", "比较与积分判别法"], ["Alternating Series", "交错级数"], ["Ratio and Root Tests", "比值与根值判别法"], ["Power Series", "幂级数"], ["Taylor Series and Approximation", "Taylor 级数与近似"]] as const;
const gatechMath1552Tasks = catalogTopicPlan(gatechMath1552Syllabus, gatechMath1552Topics);
for (let index = 1; index <= 4; index += 1) gatechMath1552Tasks.push({ id: `assessment-${index}`, title: `Official cumulative assessment ${index}`, titleZh: `官方综合考核 ${index}`, url: gatechMath1552Syllabus, kind: "exam" });
structuredCoursePlans["gatech-math1552"] = { sourceUrl: gatechMath1552Syllabus, detail: "full", tasks: gatechMath1552Tasks };

const gatechCs1331Syllabus = "https://syllabus.gatech.edu/sites/default/files/2026-04/CS%201331%20Syllabus%20Fall%202026_0.pdf";
const gatechCs1331Topics = [["Java Program Structure and Types", "Java 程序结构与类型"], ["Control Flow", "控制流程"], ["Methods and Decomposition", "方法与分解"], ["Arrays and Collections", "数组与集合"], ["Classes and Objects", "类与对象"], ["Encapsulation", "封装"], ["Inheritance", "继承"], ["Polymorphism", "多态"], ["Interfaces and Abstract Classes", "接口与抽象类"], ["Exceptions and Defensive Programming", "异常与防御式编程"], ["Basic Algorithms and Data Structures", "基础算法与数据结构"], ["Spring Boot Application Structure", "Spring Boot 应用结构"], ["Graphical Interfaces and Secure Inputs", "图形界面与安全输入"], ["Memory Management", "内存管理"], ["Testing and Medium-Sized Program Design", "测试与中型程序设计"]] as const;
structuredCoursePlans["gatech-cs1331"] = { sourceUrl: gatechCs1331Syllabus, detail: "full", tasks: catalogTopicPlan(gatechCs1331Syllabus, gatechCs1331Topics) };

const gatechCs1332Syllabus = "https://syllabus.gatech.edu/sites/default/files/2026-04/CS1332-SUMMER_Borela-Valente_Rodrigo.pdf";
const gatechCs1332Topics = [["Big-O Analysis", "Big-O 分析"], ["Arrays and ArrayLists", "数组与 ArrayList"], ["Singly Linked Lists", "单向链表"], ["Doubly and Circular Linked Lists", "双向与循环链表"], ["Stacks", "栈"], ["Queues and Deques", "队列与双端队列"], ["Skip Lists", "跳表"], ["Binary Search Trees", "二叉搜索树"], ["AVL Trees", "AVL 树"], ["Heaps and Priority Queues", "堆与优先队列"], ["2-4 Trees", "2-4 树"], ["Hash Maps", "哈希映射"], ["Graphs", "图"], ["Elementary Sorting", "基础排序"], ["Merge Sort", "归并排序"], ["Quick Sort", "快速排序"], ["Radix Sort", "基数排序"], ["Brute-Force and Boyer-Moore Matching", "暴力与 Boyer-Moore 匹配"], ["KMP and Rabin-Karp Matching", "KMP 与 Rabin-Karp 匹配"], ["BFS and DFS", "广度优先与深度优先搜索"], ["Dijkstra and Minimum Spanning Trees", "Dijkstra 与最小生成树"], ["Dynamic Programming", "动态规划"]] as const;
structuredCoursePlans["gatech-cs1332"] = { sourceUrl: gatechCs1332Syllabus, detail: "full", tasks: catalogTopicPlan(gatechCs1332Syllabus, gatechCs1332Topics) };

const gatechCs2050Syllabus = "https://syllabus.gatech.edu/sites/default/files/2026-04/cs2050syllabus_5.pdf";
const gatechCs2050Topics = [["Introduction and Logic", "导论与逻辑"], ["Propositional Logic", "命题逻辑"], ["Quantification", "量词"], ["Inference", "推理"], ["Proof Methods", "证明方法"], ["Induction", "归纳法"], ["Strong Induction", "强归纳法"], ["Set Theory", "集合论"], ["Functions", "函数"], ["Asymptotic Growth", "渐近增长"], ["Equivalence Relations", "等价关系"], ["Modular Arithmetic", "模运算"], ["GCD, LCM, Bezout, and FTA", "最大公因数、最小公倍数、Bezout 与算术基本定理"], ["Groups and Isomorphism", "群与同构"], ["Chinese Remainder Theorem", "中国剩余定理"], ["Fermat and Euler Theorems", "Fermat 与 Euler 定理"], ["RSA", "RSA"], ["Combinatorics", "组合数学"], ["Binomial Theorem", "二项式定理"], ["Pigeonhole Principle", "抽屉原理"], ["Graph Theory", "图论"], ["Finite Probability", "有限概率"], ["Probabilistic Method", "概率方法"], ["Finite Automata", "有限自动机"], ["Regular Expressions", "正则表达式"]] as const;
const gatechCs2050Tasks = catalogTopicPlan(gatechCs2050Syllabus, gatechCs2050Topics);
for (let index = 1; index <= 4; index += 1) gatechCs2050Tasks.splice(Math.min(index * 7, gatechCs2050Tasks.length), 0, { id: `exam-${index}`, title: `Official examination ${index}`, titleZh: `官方考试 ${index}`, url: gatechCs2050Syllabus, kind: "exam" });
structuredCoursePlans["gatech-cs2050"] = { sourceUrl: gatechCs2050Syllabus, detail: "full", tasks: gatechCs2050Tasks };

const gatechCs2340Syllabus = "https://syllabus.gatech.edu/sites/default/files/2026-04/2340-spr26.pdf";
const gatechCs2340Topics = [["Large-Scale Object-Oriented Development", "大型面向对象开发"], ["Requirements and Use Cases", "需求与用例"], ["Domain Modeling", "领域建模"], ["UML Design Documentation", "UML 设计文档"], ["GRASP and SOLID Principles", "GRASP 与 SOLID 原则"], ["Creational Design Patterns", "创建型设计模式"], ["Structural Design Patterns", "结构型设计模式"], ["Behavioral Design Patterns", "行为型设计模式"], ["Agile Team Development", "敏捷团队开发"], ["Version Control and Build Tools", "版本控制与构建工具"], ["Black-Box and White-Box Testing", "黑盒与白盒测试"], ["Refactoring and Code Quality", "重构与代码质量"], ["Usability Evaluation", "可用性评估"]] as const;
const gatechCs2340Tasks = catalogTopicPlan(gatechCs2340Syllabus, gatechCs2340Topics);
[["Project Requirements and Team Setup", "项目需求与团队组建"], ["Domain Model and Architecture", "领域模型与体系结构"], ["First Working Increment", "首个可运行增量"], ["Testing and Usability Review", "测试与可用性评审"], ["Final Integrated System", "最终集成系统"]].forEach(([title, titleZh], index) => gatechCs2340Tasks.push({ id: `project-milestone-${index + 1}`, title, titleZh, url: gatechCs2340Syllabus, kind: "project" }));
structuredCoursePlans["gatech-cs2340"] = { sourceUrl: gatechCs2340Syllabus, detail: "full", tasks: gatechCs2340Tasks };

const tsinghuaLinearAlgebraSource = "https://www.tsinghua.edu.cn/info/1181/35976.htm";
const tsinghuaLinearAlgebraTopics = [["Linear Systems and Gaussian Elimination", "线性方程组与高斯消元"], ["Matrix Operations", "矩阵运算"], ["LU Decomposition", "LU 分解"], ["Vector Spaces and Subspaces", "向量空间与子空间"], ["Basis, Dimension, and Coordinates", "基、维数与坐标"], ["Orthogonality", "正交性"], ["Projection Matrices", "投影矩阵"], ["Least-Squares Problems", "最小二乘问题"], ["Determinants", "行列式"], ["Eigenvalues and Eigenvectors", "特征值与特征向量"], ["Matrix Diagonalization", "矩阵对角化"], ["Symmetric Matrices", "对称矩阵"], ["Similar Matrices and Jordan Form", "相似矩阵与 Jordan 标准形"], ["Singular Value Decomposition", "奇异值分解"], ["Complex Matrices", "复矩阵"], ["Linear Transformations", "线性变换"], ["Applications in Computing, Engineering, and Economics", "计算、工程与经济中的应用"]] as const;
const tsinghuaLinearAlgebraTasks: PlanTask[] = tsinghuaLinearAlgebraTopics.flatMap(([title, titleZh], index) => [{ id: `topic-${index + 1}`, title: `Official online-course topic ${index + 1}: ${title}`, titleZh: `官方在线课程主题 ${index + 1}：${titleZh}`, url: tsinghuaLinearAlgebraSource, kind: "session" as const }, { id: `practice-${index + 1}`, title: `Complete the official practice for ${title}`, titleZh: `完成“${titleZh}”官方配套练习`, url: tsinghuaLinearAlgebraSource, kind: "assignment" as const }]);
structuredCoursePlans["tsinghua-linear-algebra"] = { sourceUrl: tsinghuaLinearAlgebraSource, detail: "full", tasks: tsinghuaLinearAlgebraTasks };

const tsinghuaOperatingSystemsSource = "https://v1-www.xuetangx.com/courses/course-v1%3ATsinghuaX%2B30240243X%2Bsp/about";
const tsinghuaOperatingSystemsUnits = [["Online Learning Environment", "在线教学环境准备", "project"], ["Operating-System Overview", "操作系统概述", "session"], ["Lab 0: ucore Environment", "实验零：ucore 环境准备", "project"], ["Boot, Interrupts, Exceptions, and System Calls", "启动、中断、异常与系统调用", "session"], ["Lab 1: Bootloader", "实验一：Bootloader 启动 ucore", "project"], ["Contiguous Physical-Memory Allocation", "连续物理内存分配", "session"], ["Noncontiguous Physical-Memory Allocation", "非连续物理内存分配", "session"], ["Lab 2: Physical-Memory Management", "实验二：物理内存管理", "project"], ["Virtual-Memory Concepts", "虚拟存储概念", "session"], ["Page-Replacement Algorithms", "页面置换算法", "session"], ["Lab 3: Virtual-Memory Management", "实验三：虚拟内存管理", "project"], ["Processes and Threads", "进程与线程", "session"], ["Process Control", "进程控制", "session"], ["Lab 4: Kernel Threads", "实验四：内核线程管理", "project"], ["Lab 5: User Processes", "实验五：用户进程管理", "project"], ["Processor Scheduling", "处理机调度", "session"], ["Lab 6: Scheduler", "实验六：调度器", "project"], ["Synchronization and Mutual Exclusion", "同步与互斥", "session"], ["Semaphores and Monitors", "信号量与管程", "session"], ["Lab 7: Synchronization", "实验七：同步互斥", "project"], ["Deadlock and Interprocess Communication", "死锁与进程通信", "session"], ["Filesystems", "文件系统", "session"], ["Lab 8: Filesystem", "实验八：文件系统", "project"], ["I/O Subsystem", "I/O 子系统", "session"]] as const;
const tsinghuaOperatingSystemsTasks: PlanTask[] = tsinghuaOperatingSystemsUnits.map(([title, titleZh, kind], index) => ({ id: `unit-${index}`, title: `Official unit ${index}: ${title}`, titleZh: `官方单元 ${index}：${titleZh}`, url: tsinghuaOperatingSystemsSource, kind }));
tsinghuaOperatingSystemsTasks.push({ id: "final-exam", title: "Official final examination", titleZh: "官方期末考试", url: tsinghuaOperatingSystemsSource, kind: "exam" });
structuredCoursePlans["tsinghua-operating-systems"] = { sourceUrl: tsinghuaOperatingSystemsSource, detail: "full", tasks: tsinghuaOperatingSystemsTasks };

const tsinghuaCombinatoricsSource = "https://v1-www.xuetangx.com/courses/course-v1%3ATsinghuaX%2B60240013X%2Bsp/about";
const tsinghuaCombinatoricsWeeks = [["Combinatorial Thinking and Enumeration", "组合思维与枚举"], ["Counting Rules, Permutations, and Combinations", "计数法则、排列与组合"], ["Generating Functions and Integer Partitions", "母函数与整数拆分"], ["Linear Recurrence Relations and Fibonacci Numbers", "线性递推关系与 Fibonacci 数"], ["Catalan, Stirling, and Derangement Sequences", "Catalan、Stirling 与错排序列"], ["Inclusion-Exclusion, Pigeonhole, and Ramsey Ideas", "容斥、鸽巢与 Ramsey 思想"], ["Permutation Groups and Burnside's Lemma", "置换群与 Burnside 引理"], ["Pólya Enumeration and Graph Counting", "Pólya 计数与图的计数"]] as const;
const tsinghuaCombinatoricsTasks: PlanTask[] = tsinghuaCombinatoricsWeeks.flatMap(([title, titleZh], index) => [{ id: `week-${index + 1}`, title: `Official week ${index + 1}: ${title}`, titleZh: `官方第 ${index + 1} 周：${titleZh}`, url: tsinghuaCombinatoricsSource, kind: "session" as const, resourceType: "lectures" as const }, { id: `homework-${index + 1}`, title: `Official week ${index + 1} homework`, titleZh: `官方第 ${index + 1} 周作业`, url: tsinghuaCombinatoricsSource, kind: "assignment" as const }]);
tsinghuaCombinatoricsTasks.push({ id: "final-exam", title: "Official final examination", titleZh: "官方期末考试", url: tsinghuaCombinatoricsSource, kind: "exam" });
structuredCoursePlans["tsinghua-combinatorics"] = { sourceUrl: tsinghuaCombinatoricsSource, detail: "full", tasks: tsinghuaCombinatoricsTasks };

const tsinghuaAlgorithmSource = "https://v1-www.xuetangx.com/courses/course-v1%3ATsinghuaX%2B2018122106X%2B2018_T2/about";
const tsinghuaAlgorithmUnits = [["Stable Matching and Gale-Shapley", "稳定匹配与 Gale-Shapley 算法"], ["Algorithm Analysis and Asymptotic Growth", "算法分析与渐近增长"], ["Graph Traversal and Connectivity", "图遍历与连通性"], ["Greedy Algorithms", "贪心算法"], ["Divide and Conquer and FFT", "分治与 FFT"], ["Dynamic Programming", "动态规划"], ["Network Flow and Bipartite Matching", "网络流与二分图匹配"], ["NP and Computational Intractability", "NP 与计算不可解性"], ["Approximation Algorithms", "近似算法"], ["Local Search", "局部搜索"], ["Randomized Algorithms", "随机算法"]] as const;
const tsinghuaAlgorithmTasks: PlanTask[] = tsinghuaAlgorithmUnits.flatMap(([title, titleZh], index) => [{ id: `unit-${index + 1}`, title: `Official unit ${index + 1}: ${title}`, titleZh: `官方单元 ${index + 1}：${titleZh}`, url: tsinghuaAlgorithmSource, kind: "session" as const, resourceType: "lectures" as const }, { id: `homework-${index + 1}`, title: `Official homework ${index + 1}`, titleZh: `官方作业 ${index + 1}`, url: tsinghuaAlgorithmSource, kind: "assignment" as const }]);
tsinghuaAlgorithmTasks.push({ id: "exam", title: "Official course examination", titleZh: "官方课程考试", url: tsinghuaAlgorithmSource, kind: "exam" });
structuredCoursePlans["tsinghua-algorithm-design"] = { sourceUrl: tsinghuaAlgorithmSource, detail: "full", tasks: tsinghuaAlgorithmTasks };

const pkuHigherAlgebraSource = "https://math.pku.edu.cn/bks/sykc/149973.htm";
const pkuHigherAlgebraTopics = [["Fields and Algebraic Preliminaries", "数域与代数预备知识"], ["Linear Systems and Gauss-Jordan Elimination", "线性方程组与 Gauss-Jordan 消元"], ["Matrices and Elementary Transformations", "矩阵与初等变换"], ["Matrix Rank and Inverses", "矩阵的秩与逆"], ["Determinants", "行列式"], ["Polynomial Arithmetic", "多项式运算"], ["Factorization and Roots", "因式分解与根"], ["Linear Spaces", "线性空间"], ["Linear Independence, Bases, and Dimension", "线性无关、基与维数"], ["Subspaces and Coordinates", "子空间与坐标"], ["Linear Mappings", "线性映射"], ["Kernels, Images, and Matrix Representations", "核、像与矩阵表示"], ["Eigenvalues and Eigenvectors", "特征值与特征向量"], ["Similarity and Canonical Forms", "相似与标准形"], ["Quadratic Forms and Congruence", "二次型与合同"]] as const;
structuredCoursePlans["pku-higher-algebra-1"] = { sourceUrl: pkuHigherAlgebraSource, detail: "full", tasks: catalogTopicPlan(pkuHigherAlgebraSource, pkuHigherAlgebraTopics) };

const pkuProbabilitySource = "https://math.pku.edu.cn/bks/sykc/148677.htm";
const pkuProbabilityTopics = [["Sample Spaces and Events", "样本空间与随机事件"], ["Classical and Geometric Probability", "古典概型与几何概型"], ["Probability Spaces and Axioms", "概率空间与公理"], ["Conditional Probability", "条件概率"], ["Total Probability and Bayes Formula", "全概率公式与 Bayes 公式"], ["Independence", "独立性"], ["Random Variables and Distributions", "随机变量与分布"], ["Random Vectors and Joint Distributions", "随机向量与联合分布"], ["Conditional Distributions and Densities", "条件分布与条件密度"], ["Functions of Random Variables", "随机变量函数"], ["Expectation and Variance", "数学期望与方差"], ["Covariance and Correlation", "协方差与相关系数"], ["Conditional Expectation", "条件数学期望"], ["Generating and Characteristic Functions", "母函数与特征函数"], ["Multivariate Normal Distribution", "多元正态分布"], ["Modes of Convergence", "随机变量的收敛方式"], ["Laws of Large Numbers", "大数定律"], ["Borel-Cantelli Lemmas", "Borel-Cantelli 引理"], ["Central Limit Theorems", "中心极限定理"]] as const;
structuredCoursePlans["pku-probability"] = { sourceUrl: pkuProbabilitySource, detail: "full", tasks: catalogTopicPlan(pkuProbabilitySource, pkuProbabilityTopics) };

const pkuAlgorithmSource = "https://math.pku.edu.cn/bks/sykc/148734.htm";
const pkuAlgorithmTopics = [["Algorithm Evaluation and Asymptotic Complexity", "算法评价与渐近复杂度"], ["Divide and Conquer", "分治法"], ["Recurrences and the Master Theorem", "递推式与 Master 定理"], ["Selection and Sorting", "选择与排序"], ["Fast Fourier Transform", "快速 Fourier 变换"], ["Greedy Algorithms", "贪心算法"], ["Dynamic Programming", "动态规划"], ["Graph Search and Traversal", "图搜索与周游"], ["Backtracking", "回溯法"], ["Branch and Bound", "分支限界"], ["NP-Hard Problems", "NP 难问题"], ["Approximation Algorithms", "近似算法"], ["Randomized Algorithms", "随机算法"]] as const;
structuredCoursePlans["pku-algorithm-design"] = { sourceUrl: pkuAlgorithmSource, detail: "full", tasks: catalogTopicPlan(pkuAlgorithmSource, pkuAlgorithmTopics) };

const pkuOrganizationSource = "https://marxism.pku.edu.cn/docs/20210831111421546310.pdf";
const pkuOrganizationTopics = [["Course Overview and the Basic Computer Structure", "课程概述与计算机基本结构"], ["CISC and x86 Instructions", "CISC 与 x86 指令"], ["RISC and MIPS Instructions I", "RISC 与 MIPS 指令（一）"], ["RISC and MIPS Instructions II", "RISC 与 MIPS 指令（二）"], ["Digital-Circuit Design", "数字电路设计"], ["Controller Principles", "控制器基本原理"], ["Pipeline Optimization", "流水线优化"], ["Parallel Interfaces", "并行接口"], ["Interrupt Controllers and Timers", "中断控制器与定时器"], ["Serial Communication Interfaces", "串行通信接口"], ["DMA Controllers", "DMA 控制器"], ["Memory Systems", "存储系统"]] as const;
const pkuOrganizationTasks: PlanTask[] = catalogTopicPlan(pkuOrganizationSource, pkuOrganizationTopics);
[["Instruction-Level Simulator", "实现指令级模拟器"], ["Memory-System Simulator", "实现存储系统模拟器"], ["Branch-Prediction Simulator", "实现转移预测模拟器"]].forEach(([title, titleZh], index) => pkuOrganizationTasks.push({ id: `project-${index + 1}`, title: `Official practice: ${title}`, titleZh: `官方实践：${titleZh}`, url: "https://ceca.pku.edu.cn/courses/2017fall/45ceca1228449.htm", kind: "project" }));
structuredCoursePlans["pku-computer-organization"] = { sourceUrl: pkuOrganizationSource, detail: "full", tasks: pkuOrganizationTasks };

const pkuNetworksSource = "https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/courseDetail/getCourseDetail.do?course_seq_no=BZ1617104830240_14181&kclx=BK";
const pkuNetworksTopics = [["Network Architecture and Internet Protocol Suite", "网络体系结构与 Internet 协议族"], ["Data-Communication Models and Encoding", "数据通信模型与编码"], ["Transmission Media and Interfaces", "传输介质与通信接口"], ["Link-Layer Flow Control", "链路层流量控制"], ["Error Detection and Control", "差错检测与控制"], ["Sliding-Window Protocols and PPP", "滑动窗口协议与 PPP"], ["Media Access and IEEE 802.3", "介质访问与 IEEE 802.3"], ["Wireless LANs and Bluetooth", "无线局域网与蓝牙"], ["Bridges and Spanning Trees", "网桥与生成树"], ["IP and Internetworking", "IP 与网络互联"], ["Routing Mechanisms", "路由机制"], ["Congestion Control", "拥塞控制"], ["TCP and UDP", "TCP 与 UDP"], ["Transport Connections and Socket Programming", "传输连接与 Socket 编程"], ["Application Protocols", "应用层协议"], ["Streaming and Quality of Service", "流媒体与服务质量"]] as const;
const pkuNetworksTasks: PlanTask[] = catalogTopicPlan(pkuNetworksSource, pkuNetworksTopics);
[["Link-Layer Protocol Analysis", "链路层协议分析"], ["Network-Layer Routing Exercise", "网络层路由实验"], ["Transport-Layer Programming", "传输层编程实习"]].forEach(([title, titleZh], index) => pkuNetworksTasks.push({ id: `lab-${index + 1}`, title: `Official lab: ${title}`, titleZh: `官方实验：${titleZh}`, url: "https://dean.pku.edu.cn/userfiles/upload/download/202009211532211614.pdf", kind: "assignment" }));
structuredCoursePlans["pku-computer-networks"] = { sourceUrl: pkuNetworksSource, detail: "full", tasks: pkuNetworksTasks };

const pkuDatabasesSource = "https://marxism.pku.edu.cn/docs/20210831111421546310.pdf";
const pkuDatabaseTopics = [["Database-System Concepts and Architecture", "数据库系统概念与体系结构"], ["Data Models and Schemas", "数据模型与模式"], ["Entity-Relationship Modeling", "实体—联系建模"], ["Relational Model and Relational Algebra", "关系模型与关系代数"], ["SQL Data Definition and Queries", "SQL 数据定义与查询"], ["Advanced SQL and Application Interfaces", "高级 SQL 与应用接口"], ["Functional Dependencies and Normalization", "函数依赖与规范化"], ["Relational Database Design", "关系数据库设计"], ["Storage and File Organization", "存储与文件组织"], ["Index Structures", "索引结构"], ["Query Processing and Optimization", "查询处理与优化"], ["Transactions and Concurrency Control", "事务与并发控制"], ["Recovery", "数据库恢复"], ["Distributed Database Systems", "分布式数据库系统"], ["Advanced Data-Management Topics", "数据管理前沿专题"]] as const;
const pkuDatabaseTasks: PlanTask[] = catalogTopicPlan(pkuDatabasesSource, pkuDatabaseTopics);
[["SQL Query Practice", "SQL 查询练习"], ["ER Modeling and Schema Design", "ER 建模与模式设计"], ["Database Application Development", "数据库应用开发"], ["Index and Query-Tuning Exercise", "索引与查询调优练习"]].forEach(([title, titleZh], index) => pkuDatabaseTasks.push({ id: `practice-${index + 1}`, title: `Official practical unit: ${title}`, titleZh: `官方实践单元：${titleZh}`, url: pkuDatabasesSource, kind: "assignment" }));
structuredCoursePlans["pku-databases"] = { sourceUrl: pkuDatabasesSource, detail: "full", tasks: pkuDatabaseTasks };

const tsinghuaDigitalLogicSource = "https://lab.cs.tsinghua.edu.cn/digital-logic-lab/doc/";
const tsinghuaDigitalLogicLabs = [["Oscilloscope and Signal Generation", "示波器与信号生成"], ["NAND-Gate Characteristics", "与非门特性测试"], ["Combinational Logic and Binary Arithmetic", "组合逻辑与二进制运算"], ["FPGA Display and Vivado Workflow", "FPGA 数码显示与 Vivado 流程"], ["Four-Bit Adder in SystemVerilog", "SystemVerilog 四位加法器"], ["Counter and Sequential Logic", "计数器与时序逻辑"], ["Serial Combination Lock and State Machines", "串行密码锁与状态机"], ["Static-Memory Access", "静态存储器访问"]] as const;
const tsinghuaDigitalLogicTasks: PlanTask[] = [{ id: "preparation", title: "Prepare the official laboratory platform and SystemVerilog environment", titleZh: "准备官方实验平台与 SystemVerilog 环境", url: "https://lab.cs.tsinghua.edu.cn/digital-logic-lab/doc/hdl-tutorial/1.first-hardware/", kind: "session" }];
tsinghuaDigitalLogicLabs.forEach(([title, titleZh], index) => tsinghuaDigitalLogicTasks.push({ id: `prelab-${index + 1}`, title: `Prepare experiment ${index + 1}: ${title}`, titleZh: `预习实验 ${index + 1}：${titleZh}`, url: tsinghuaDigitalLogicSource, kind: "session" }, { id: `lab-${index + 1}`, title: `Complete experiment ${index + 1}: ${title}`, titleZh: `完成实验 ${index + 1}：${titleZh}`, url: tsinghuaDigitalLogicSource, kind: "project" }));
tsinghuaDigitalLogicTasks.push({ id: "practical-exam", title: "Official practical examination", titleZh: "官方实验考试", url: tsinghuaDigitalLogicSource, kind: "exam" });
structuredCoursePlans["tsinghua-digital-logic-lab"] = { sourceUrl: tsinghuaDigitalLogicSource, detail: "full", tasks: tsinghuaDigitalLogicTasks };

const tsinghuaOrganizationSource = "https://lab.cs.tsinghua.edu.cn/cod-lab-docs/";
const tsinghuaOrganizationLectures = [["Computer-System Introduction", "计算机系统简介"], ["RISC-V and THINPAD Instructions", "RISC-V 与 THINPAD 指令"], ["Data Representation and Error Control", "数据表示与检错纠错"], ["Arithmetic and Hardware Implementation", "算术运算及硬件实现"], ["Instruction-Set Design", "指令系统设计"], ["RISC-V Instruction Set", "RISC-V 指令系统"], ["Datapaths", "数据通路"], ["Single-Cycle Processors", "单周期处理器"], ["Multi-Cycle Processors", "多周期处理器"], ["Pipelined Processors", "流水线处理器"], ["Structural and Data Hazards", "结构冲突与数据冲突"], ["Control Hazards", "控制冲突"], ["RISC-V Interrupts and Exceptions", "RISC-V 中断与异常"], ["Memory Hierarchy and DRAM", "层次存储结构与 DRAM"], ["SRAM and Processor Caches", "SRAM 与处理器缓存"], ["Cache Design", "缓存设计"], ["Virtual Memory", "虚拟存储"], ["External Storage", "外存储"], ["I/O Methods", "输入输出方式"], ["Buses", "总线"], ["Interfaces and External Devices", "接口电路与外部设备"], ["Processor-Architecture Frontiers", "处理器体系结构前沿"]] as const;
const tsinghuaOrganizationTasks: PlanTask[] = catalogTopicPlan(tsinghuaOrganizationSource, tsinghuaOrganizationLectures);
[["Assembly and Monitor Program", "汇编语言与监控程序"], ["ALU and Register File", "ALU 与寄存器堆"], ["SRAM Controller", "SRAM 控制器"], ["Memory and Serial-Port Bus", "内存与串口总线"], ["Processor Implementation", "处理器实现"], ["Five-Stage Pipelined RISC-V Processor", "五级流水线 RISC-V 处理器"]].forEach(([title, titleZh], index) => tsinghuaOrganizationTasks.push({ id: `lab-${index + 1}`, title: `Official laboratory ${index + 1}: ${title}`, titleZh: `官方实验 ${index + 1}：${titleZh}`, url: "https://lab.cs.tsinghua.edu.cn/cod-lab-docs/labs/", kind: "project" }));
for (let index = 1; index <= 4; index += 1) tsinghuaOrganizationTasks.push({ id: `written-work-${index}`, title: `Official written assignment ${index}`, titleZh: `官方书面作业 ${index}`, url: tsinghuaOrganizationSource, kind: "assignment" });
structuredCoursePlans["tsinghua-computer-organization"] = { sourceUrl: tsinghuaOrganizationSource, detail: "full", tasks: tsinghuaOrganizationTasks };

const mitMicroeconomicsSource = "https://ocw.mit.edu/courses/14-01-principles-of-microeconomics-fall-2023/pages/calendar/";
const mitMicroeconomicsTopics = [["Introduction and Supply and Demand", "导论与供给需求"], ["Preferences and Utility Functions", "偏好与效用函数"], ["Budget Constraints and Constrained Choice", "预算约束与受限选择"], ["Demand Curves and Income and Substitution Effects", "需求曲线、收入效应与替代效应"], ["Production Theory", "生产理论"], ["Costs", "成本"], ["Competition I", "竞争（一）"], ["Competition II", "竞争（二）"], ["Supply, Demand, and Consumer and Producer Surplus", "供求与消费者、生产者剩余"], ["Welfare Economics", "福利经济学"], ["Monopoly I", "垄断（一）"], ["Monopoly II", "垄断（二）"], ["Oligopoly I", "寡头（一）"], ["Oligopoly II", "寡头（二）"], ["Input Markets I: Labor", "要素市场（一）：劳动"], ["Input Markets II: Labor and Capital", "要素市场（二）：劳动与资本"], ["Making Choices over Time", "跨期选择"], ["Introduction to Trade", "贸易导论"], ["International Trade: Welfare and Policy", "国际贸易：福利与政策"], ["Uncertainty", "不确定性"], ["Social Insurance", "社会保险"], ["Efficiency and Equity", "效率与公平"], ["Government Redistribution and Taxation", "政府再分配与税收"], ["Externalities", "外部性"], ["Behavioral Economics", "行为经济学"], ["Healthcare Economics", "健康经济学"]] as const;
const mitMicroeconomicsTasks: PlanTask[] = catalogTopicPlan(mitMicroeconomicsSource, mitMicroeconomicsTopics);
for (let index = 1; index <= 8; index += 1) mitMicroeconomicsTasks.push({ id: `problem-set-${index}`, title: `Official problem set ${index}`, titleZh: `官方习题集 ${index}`, url: "https://ocw.mit.edu/courses/14-01-principles-of-microeconomics-fall-2023/lists/problem-sets/", kind: "assignment" });
mitMicroeconomicsTasks.push({ id: "midterm", title: "Official midterm examination", titleZh: "官方期中考试", url: "https://ocw.mit.edu/courses/14-01-principles-of-microeconomics-fall-2023/lists/exams/", kind: "exam" }, { id: "final", title: "Official final examination", titleZh: "官方期末考试", url: "https://ocw.mit.edu/courses/14-01-principles-of-microeconomics-fall-2023/lists/exams/", kind: "exam" });
structuredCoursePlans["mit-14-01"] = { sourceUrl: mitMicroeconomicsSource, detail: "full", tasks: mitMicroeconomicsTasks };

const mitMacroeconomicsSource = "https://ocw.mit.edu/courses/14-02-principles-of-macroeconomics-spring-2023/video_galleries/1402-lecture-videos/";
const mitMacroeconomicsTopics = [["Introduction to Principles of Macroeconomics", "宏观经济学原理导论"], ["Basic Macroeconomic Concepts", "宏观经济学基本概念"], ["The Goods Market", "商品市场"], ["The Financial Market", "金融市场"], ["IS-LM Model", "IS-LM 模型"], ["IS-LM, Continued", "IS-LM 模型（续）"], ["An Extended IS-LM Model", "扩展 IS-LM 模型"], ["The Labor Market", "劳动市场"], ["The Phillips Curve and Inflation", "Phillips 曲线与通货膨胀"], ["Quiz 1 Review", "测验 1 复习"], ["The IS-LM-PC Model", "IS-LM-PC 模型"], ["IS-LM-PC Model, Continued", "IS-LM-PC 模型（续）"], ["The Facts of Growth", "经济增长事实"], ["Saving, Capital Accumulation, and Output", "储蓄、资本积累与产出"], ["Technological Progress and Growth", "技术进步与增长"], ["Convergence and Cross-Country Variation", "趋同与跨国差异"], ["Introduction to the Open Economy", "开放经济导论"], ["Quiz 2 Review", "测验 2 复习"], ["The Goods Market in the Open Economy", "开放经济中的商品市场"], ["The Mundell-Fleming Model", "Mundell-Fleming 模型"], ["Exchange Rate Regimes", "汇率制度"], ["Financial Markets and Expectations", "金融市场与预期"], ["Asset Pricing", "资产定价"], ["IS-LM and Expectations", "IS-LM 与预期"], ["Quiz 3 Review", "测验 3 复习"]] as const;
const mitMacroeconomicsTasks: PlanTask[] = catalogTopicPlan(mitMacroeconomicsSource, mitMacroeconomicsTopics);
for (let index = 1; index <= 8; index += 1) mitMacroeconomicsTasks.push({ id: `problem-set-${index}`, title: `Official problem set ${index}`, titleZh: `官方习题集 ${index}`, url: "https://ocw.mit.edu/courses/14-02-principles-of-macroeconomics-spring-2023/pages/problem-sets/", kind: "assignment" });
for (let index = 1; index <= 3; index += 1) mitMacroeconomicsTasks.push({ id: `quiz-${index}`, title: `Official quiz ${index}`, titleZh: `官方测验 ${index}`, url: "https://ocw.mit.edu/courses/14-02-principles-of-macroeconomics-spring-2023/pages/quizzes/", kind: "exam" });
structuredCoursePlans["mit-14-02"] = { sourceUrl: mitMacroeconomicsSource, detail: "full", tasks: mitMacroeconomicsTasks };

const mitGeneticsSource = "https://ocw.mit.edu/courses/7-03-genetics-fall-2004/pages/calendar/";
const mitGeneticsTopics = [["Physical Structure of the Gene", "基因的物理结构"], ["Complementation Test and Gene Function", "互补测验与基因功能"], ["Mendelian Genetics", "孟德尔遗传学"], ["Probability and Pedigrees", "概率与系谱"], ["Chromosomes and Sex Linkage", "染色体与伴性遗传"], ["Recombination and Genetic Maps", "重组与遗传图谱"], ["Three-Factor Crosses", "三因子杂交"], ["Tetrad Analysis", "四分体分析"], ["Phage Genetics", "噬菌体遗传学"], ["Gene Structure and DNA Analysis", "基因结构与 DNA 分析"], ["Mutations and Suppressors", "突变与抑制因子"], ["Bacterial Genetics: Transposition", "细菌遗传学：转座"], ["Bacterial Genetics: Transduction", "细菌遗传学：转导"], ["Complementation in Bacteria: Plasmids", "细菌互补：质粒"], ["Complementation in Bacteria: Recombinant DNA", "细菌互补：重组 DNA"], ["Prokaryotic Regulation: Negative Control", "原核调控：负调控"], ["Prokaryotic Regulation: Positive Control", "原核调控：正调控"], ["Prokaryotic Regulation: Regulatory Circuits", "原核调控：调控回路"], ["Eukaryotic Genes and Genomes I", "真核基因与基因组（一）"], ["Eukaryotic Genes and Genomes II", "真核基因与基因组（二）"], ["Eukaryotic Genes and Genomes III", "真核基因与基因组（三）"], ["Eukaryotic Genes and Genomes IV", "真核基因与基因组（四）"], ["Transgenes and Gene Targeting in Mice I", "小鼠转基因与基因靶向（一）"], ["Transgenes and Gene Targeting in Mice II", "小鼠转基因与基因靶向（二）"], ["Population Genetics: Hardy-Weinberg", "群体遗传学：Hardy-Weinberg"], ["Population Genetics: Mutation and Selection", "群体遗传学：突变与选择"], ["Population Genetics: Inbreeding", "群体遗传学：近交"], ["Human Polymorphisms", "人类多态性"], ["Statistical Evaluation of Linkage I", "连锁的统计评估（一）"], ["Statistical Evaluation of Linkage II", "连锁的统计评估（二）"], ["Complex Traits", "复杂性状"], ["Chromosome Anomalies I", "染色体异常（一）"], ["Chromosome Anomalies II", "染色体异常（二）"], ["Genetics of Cancer I", "癌症遗传学（一）"], ["Genetics of Cancer II", "癌症遗传学（二）"]] as const;
const mitGeneticsTasks: PlanTask[] = catalogTopicPlan(mitGeneticsSource, mitGeneticsTopics);
for (let index = 1; index <= 7; index += 1) mitGeneticsTasks.push({ id: `problem-set-${index}`, title: `Official problem set ${index}`, titleZh: `官方习题集 ${index}`, url: "https://ocw.mit.edu/courses/7-03-genetics-fall-2004/pages/assignments/", kind: "assignment" });
for (let index = 1; index <= 3; index += 1) mitGeneticsTasks.push({ id: `exam-${index}`, title: `Official examination ${index}`, titleZh: `官方考试 ${index}`, url: "https://ocw.mit.edu/courses/7-03-genetics-fall-2004/pages/exams/", kind: "exam" });
mitGeneticsTasks.push({ id: "final", title: "Official comprehensive final examination", titleZh: "官方综合期末考试", url: "https://ocw.mit.edu/courses/7-03-genetics-fall-2004/pages/exams/", kind: "exam" });
structuredCoursePlans["mit-7-03"] = { sourceUrl: mitGeneticsSource, detail: "full", tasks: mitGeneticsTasks };

const mitOrganicChemistrySource = "https://ocw.mit.edu/courses/5-12-organic-chemistry-i-spring-2003/pages/calendar/";
const mitOrganicChemistryTopics = [["Lewis Bonding", "Lewis 成键"], ["Resonance", "共振"], ["Molecular Orbital Theory and Hybridization", "分子轨道理论与杂化"], ["Acidity", "酸性"], ["Bond Strengths and Alkanes", "键强与烷烃"], ["Conformational Analysis", "构象分析"], ["Cycloalkanes", "环烷烃"], ["Cyclohexane", "环己烷"], ["Stereochemistry I", "立体化学（一）"], ["Stereochemistry II", "立体化学（二）"], ["Free-Radical Reactions I", "自由基反应（一）"], ["Free-Radical Reactions II", "自由基反应（二）"], ["Alkyl Halides and SN2", "卤代烷与 SN2"], ["SN2 and SN1 Substitution", "SN2 与 SN1 取代"], ["SN1 and E1 Reactions", "SN1 与 E1 反应"], ["E1 and E2 Elimination", "E1 与 E2 消除"], ["E2 Elimination", "E2 消除"], ["Structure and Synthesis of Alkenes", "烯烃结构与合成"], ["Alkene Addition Reactions", "烯烃加成反应"], ["Hydrogenation, HX Addition, and Halogenation", "氢化、HX 加成与卤化"], ["Epoxidation, Hydroboration, Osmylation, and Ozonolysis", "环氧化、硼氢化、锇酸化与臭氧化"], ["Alkyne Structure and Bonding", "炔烃结构与成键"], ["Acetylide Alkylation", "乙炔负离子烷基化"], ["Addition Reactions of Alkynes", "炔烃加成反应"], ["Alcohol Structure, Synthesis, and Reactions", "醇的结构、合成与反应"], ["Carbonyl Reactions with Organometallic Reagents", "羰基与有机金属试剂反应"], ["Aromaticity", "芳香性"], ["Electrophilic Aromatic Substitution", "亲电芳香取代"], ["Directing Effects", "定位效应"], ["Nucleophilic Aromatic Substitution", "亲核芳香取代"], ["Carbonyl Compound Survey", "羰基化合物综述"], ["Synthesis of Aldehydes and Ketones", "醛与酮的合成"], ["Nucleophilic Addition to Carbonyls", "羰基亲核加成"], ["Enols and Enolates", "烯醇与烯醇负离子"], ["Course Synthesis and Review", "课程综合与复习"]] as const;
const mitOrganicChemistryTasks: PlanTask[] = catalogTopicPlan(mitOrganicChemistrySource, mitOrganicChemistryTopics);
for (let index = 1; index <= 9; index += 1) mitOrganicChemistryTasks.push({ id: `problem-set-${index}`, title: `Official problem set ${index}`, titleZh: `官方习题集 ${index}`, url: "https://ocw.mit.edu/courses/5-12-organic-chemistry-i-spring-2003/pages/assignments/", kind: "assignment" });
for (let index = 1; index <= 4; index += 1) mitOrganicChemistryTasks.push({ id: `exam-${index}`, title: `Official practice examination ${index}`, titleZh: `官方模拟考试 ${index}`, url: "https://ocw.mit.edu/courses/5-12-organic-chemistry-i-spring-2003/pages/exams/", kind: "exam" });
mitOrganicChemistryTasks.push({ id: "final", title: "Official cumulative final practice", titleZh: "官方综合期末练习", url: "https://ocw.mit.edu/courses/5-12-organic-chemistry-i-spring-2003/pages/exams/", kind: "exam" });
structuredCoursePlans["mit-5-12"] = { sourceUrl: mitOrganicChemistrySource, detail: "full", tasks: mitOrganicChemistryTasks };

const mitWavesSource = "https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/";
const mitWavesTopics = [["Periodic Oscillations and Harmonic Oscillators", "周期振动与简谐振子"], ["Damped Free Oscillators", "阻尼自由振子"], ["Driven Oscillators and Resonance", "受迫振子与共振"], ["Coupled Oscillators and Normal Modes", "耦合振子与简正模式"], ["Beat Phenomena", "拍频现象"], ["Driven Coupled Oscillators", "受迫耦合振子"], ["Symmetry and Infinite Coupled Oscillators", "对称性与无限耦合振子"], ["Translation Symmetry", "平移对称性"], ["Wave Equation, Standing Waves, and Fourier Series", "波动方程、驻波与 Fourier 级数"], ["Traveling Waves", "行波"], ["Sound Waves", "声波"], ["Maxwell Equations and Electromagnetic Waves", "Maxwell 方程与电磁波"], ["Dispersive Media, Phase and Group Velocity", "色散介质、相速度与群速度"], ["Fourier Transform and AM Radio", "Fourier 变换与调幅广播"], ["Uncertainty Principle and 2D Waves", "不确定性原理与二维波"], ["2D and 3D Waves and Snell Law", "二维、三维波与 Snell 定律"], ["Polarization and Polarizers", "偏振与偏振片"], ["Wave Plates and Radiation", "波片与辐射"], ["Waves in Media", "介质中的波"], ["Interference and Soap Bubbles", "干涉与肥皂泡"], ["Phased Radar and Single-Electron Interference", "相控雷达与单电子干涉"], ["Diffraction and Resolution", "衍射与分辨率"], ["Quantum and Gravitational Waves", "量子波与引力波"], ["Final Review", "期末复习"]] as const;
const mitWavesTasks: PlanTask[] = catalogTopicPlan(mitWavesSource, mitWavesTopics);
for (let index = 1; index <= 10; index += 1) mitWavesTasks.push({ id: `problem-set-${index}`, title: `Official problem set ${index}`, titleZh: `官方习题集 ${index}`, url: "https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/resources/problem-sets/", kind: "assignment" });
mitWavesTasks.push({ id: "exam-1", title: "Official examination 1", titleZh: "官方考试 1", url: "https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/resources/exams/", kind: "exam" }, { id: "exam-2", title: "Official examination 2", titleZh: "官方考试 2", url: "https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/resources/exams/", kind: "exam" }, { id: "final", title: "Official final practice with solutions", titleZh: "官方期末练习与答案", url: "https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/resources/exams/", kind: "exam" });
structuredCoursePlans["mit-8-03sc"] = { sourceUrl: mitWavesSource, detail: "full", tasks: mitWavesTasks };

export function buildGentlePlan(courseId: string, requestedDays: number): { requestedDays: number; plannedDays: number; totalTasks: number; days: PlanDay[] } | null {
  const course = structuredCoursePlans[courseId];
  if (!course || !Number.isInteger(requestedDays) || requestedDays < 1) return null;
  const plannedDays = Math.ceil(requestedDays * 1.15);
  const tasksByDay: PlanTask[][] = Array.from({ length: plannedDays }, () => []);
  if (course.tasks.length >= plannedDays) {
    for (let dayIndex = 0; dayIndex < plannedDays; dayIndex += 1) {
      const start = Math.floor(dayIndex * course.tasks.length / plannedDays);
      const end = Math.floor((dayIndex + 1) * course.tasks.length / plannedDays);
      tasksByDay[dayIndex].push(...course.tasks.slice(start, end));
    }
  } else {
    const weights = course.tasks.map((task) => ({ syllabus: 0, schedule: 1, lectures: 5, assignments: 4, exams: 2, projects: 5, materials: 4, downloads: 5 }[task.resourceType ?? "materials"]));
    const sourceTotals = course.tasks.map(() => 1);
    let remainingDays = plannedDays - course.tasks.length;
    const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
    if (remainingDays > 0 && weightTotal > 0) {
      const exactShares = weights.map((weight) => remainingDays * weight / weightTotal);
      exactShares.forEach((share, index) => { sourceTotals[index] += Math.floor(share); });
      remainingDays -= exactShares.reduce((sum, share) => sum + Math.floor(share), 0);
      const remainderOrder = exactShares
        .map((share, index) => ({ index, fraction: share - Math.floor(share), weight: weights[index] }))
        .sort((a, b) => b.fraction - a.fraction || b.weight - a.weight || a.index - b.index);
      for (let index = 0; index < remainingDays; index += 1) sourceTotals[remainderOrder[index].index] += 1;
    } else if (remainingDays > 0) {
      sourceTotals[sourceTotals.length - 1] += remainingDays;
    }
    const sourceIndexes = sourceTotals.flatMap((total, sourceIndex) => Array.from({ length: total }, () => sourceIndex));
    const sourceParts: Record<number, number> = {};
    sourceIndexes.forEach((sourceIndex, dayIndex) => {
      const task = course.tasks[sourceIndex];
      const total = sourceTotals[sourceIndex];
      const part = (sourceParts[sourceIndex] ?? 0) + 1;
      sourceParts[sourceIndex] = part;
      tasksByDay[dayIndex].push({
        ...task,
        id: `${task.id}--part-${part}-of-${total}`,
        sourceTaskId: task.id,
        title: `${task.title} · Part ${part}/${total}`,
        titleZh: `${task.titleZh} · 第 ${part}/${total} 部分`,
      });
    });
  }
  const result: PlanDay[] = tasksByDay.map((tasks, dayIndex) => {
    return { id: `day-${dayIndex + 1}`, tasks };
  });
  return { requestedDays, plannedDays, totalTasks: result.flatMap(({ tasks }) => tasks).length, days: result };
}
