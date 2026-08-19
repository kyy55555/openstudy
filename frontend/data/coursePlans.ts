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
    if (lecture === 6) result.push({ id: "project-team", title: "Form final project team", titleZh: "组建期末项目团队", url: `${courseUrl}pages/assignments/final-project/`, kind: "project" });
    if (lecture === 11) result.push(
      { id: "project-proposal", title: "Final project proposal", titleZh: "期末项目提案", url: `${courseUrl}pages/assignments/final-project/`, kind: "project" },
      { id: "exam-1", title: "Exam 1", titleZh: "考试 1", url: `${courseUrl}pages/exams/`, kind: "exam" },
    );
    if (lecture === 21) result.push({ id: "exam-2", title: "Exam 2", titleZh: "考试 2", url: `${courseUrl}pages/exams/`, kind: "exam" });
    if (lecture === 23) result.push({ id: "final-project", title: "Complete and present final project", titleZh: "完成并展示期末项目", url: `${courseUrl}pages/assignments/final-project/`, kind: "project" });
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
  const courseUrl = "https://www.cs.cornell.edu/courses/cs2110/2026sp/lectures/lec01/";
  const topics = ["Introduction to Java", "Reference Types and Semantics", "Method Specifications and Testing", "Loop Invariants", "Analyzing Complexity", "Recursion", "Sorting Algorithms", "Classes and Encapsulation", "Interfaces and Polymorphism", "Inheritance", "Additional Java Features", "Collections and Generics", "Linked Data", "Iterating over Data Structures", "Stacks and Queues", "Trees and Their Iterators", "Binary Search Trees", "Heaps and Priority Queues", "Sets and Maps", "Hashing", "Graphs", "Graph Traversals", "Shortest Paths", "Graphical User Interfaces", "Event-Driven Programming", "Concurrency", "Synchronization"];
  const topicsZh = ["Java 导论", "引用类型与语义", "方法规格与测试", "循环不变量", "复杂度分析", "递归", "排序算法", "类与封装", "接口与多态", "继承", "Java 进阶特性", "集合与泛型", "链式数据", "数据结构迭代", "栈与队列", "树及其迭代器", "二叉搜索树", "堆与优先队列", "集合与映射", "哈希", "图", "图遍历", "最短路径", "图形用户界面", "事件驱动编程", "并发", "同步"];
  return topics.flatMap((title, index) => [{ id: `lecture-${index + 1}`, title: `${index + 1}. ${title}`, titleZh: `${index + 1}. ${topicsZh[index]}`, url: courseUrl.replace("lec01", `lec${String(index + 1).padStart(2, "0")}`), kind: "session" as const }, { id: `exercise-${index + 1}`, title: `Complete ${title} exercises`, titleZh: `完成${topicsZh[index]}练习`, url: courseUrl.replace("lec01", `lec${String(index + 1).padStart(2, "0")}`), kind: "assignment" as const }]);
}

function cornellCs3110Tasks(): PlanTask[] {
  const courseUrl = "https://cs3110.github.io/textbook/cover.html";
  const chapters = ["Better Programming Through OCaml", "The Basics of OCaml", "Data and Types", "Higher-Order Programming", "Modular Programming", "Mutability", "Concurrency", "Correctness", "Data Structures", "Interpreters"];
  const chaptersZh = ["通过 OCaml 改进编程", "OCaml 基础", "数据与类型", "高阶编程", "模块化编程", "可变性", "并发", "正确性", "数据结构", "解释器"];
  return chapters.flatMap((title, index) => [{ id: `chapter-${index + 1}`, title: `Chapter ${index + 1}: ${title}`, titleZh: `第 ${index + 1} 章：${chaptersZh[index]}`, url: courseUrl, kind: "session" as const }, { id: `chapter-exercises-${index + 1}`, title: `Chapter ${index + 1} exercises`, titleZh: `第 ${index + 1} 章练习`, url: courseUrl, kind: "assignment" as const }]);
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
