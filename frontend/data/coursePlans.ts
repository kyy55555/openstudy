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
    { id: `${assignmentPath}-${week}`, title: `${assignmentPath === "projects" ? "Project" : assignmentPath === "assignments" ? "Assignment" : "Problem Set"} ${week}`, titleZh: `${assignmentPath === "projects" ? "项目" : assignmentPath === "assignments" ? "作业" : "习题集"} ${week}`, url: `https://cs50.harvard.edu/${slug}/${assignmentPath}/${week}/`, kind: assignmentPath === "projects" ? "project" as const : "assignment" as const },
    ];
  });
  if (finalProject) tasks.push({ id: "final-project", title: "Final Project", titleZh: "期末项目", url: `https://cs50.harvard.edu/${slug}/project/`, kind: "project" });
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
    if (studio) result.push({ id: `studio-${studio}`, title: `R Studio ${studio}`, titleZh: `R 实践 ${studio}`, url: `${base}/pages/r-studio-resources/`, kind: "assignment" });
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
    for (let lecture = start; lecture <= end; lecture += 1) {
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
