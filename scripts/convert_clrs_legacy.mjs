import fs from "fs";
import path from "path";

// Carrega curriculum.js legado do CLRS em sandbox
const curriculumCode = fs.readFileSync("courses/clrs-algoritmos/data/curriculum.js", "utf8");
const fakeWindow = { COURSEBOOK_DATA: {}, COURSES_REGISTRY: {} };
const fn = new Function("window", curriculumCode);
fn(fakeWindow);

const data = fakeWindow.COURSEBOOK_DATA;
const mod1 = data.module1;

const targetModDir = "courses/clrs-algoritmos/modules/01-papel-dos-algoritmos-e-partida";
fs.mkdirSync(path.join(targetModDir, "lessons"), { recursive: true });

// 1. Atualiza course.json
const courseJson = {
  id: "clrs-algoritmos",
  title: "Algoritmos: Teoria e Prática (3ª Edição)",
  description: "Edição interativa canônica baseada na obra de referência mundial de Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest e Clifford Stein (MIT Press / McGraw-Hill). Cobre de forma profunda e rigorosa os fundamentos de algoritmos, invariantes de laço, análise assintótica, divisão e conquista, ordenação, estruturas de dados elementares e avançadas, programação dinâmica, algoritmos gulosos, grafos e teoria da complexidade NP.",
  book: {
    title: "Algoritmos: Teoria e Prática",
    authors: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest e Clifford Stein",
    edition: "3ª Edição",
    year: 2012
  },
  contentPolicy: "paraphrase",
  profile: "padrao",
  modules: [
    "01-papel-dos-algoritmos-e-partida"
  ],
  status: "in_development"
};
fs.writeFileSync("courses/clrs-algoritmos/course.json", JSON.stringify(courseJson, null, 2) + "\n");
console.log("courses/clrs-algoritmos/course.json gerado!");

// 2. Mapeamento das Aulas
const LESSON_SLUGS = [
  "01-papel-dos-algoritmos-na-computacao",
  "02-algoritmos-como-tecnologia-duelo",
  "03-ordenacao-insercao-invariantes",
  "04-analise-algoritmos-modelo-ram-e-theta",
  "05-divisao-conquista-merge-sort",
  "06-recorrencias-arvore-problemas"
];

const LAB_MAP = {
  "02-algoritmos-como-tecnologia-duelo": {
    type: "lab",
    id: "clrs-scale-duel",
    mountId: "workbench-scale-mount",
    title: "Laboratório Interativo: Duelo Computador A vs. Computador B",
    source: "catalog",
    mobile: "full"
  },
  "03-ordenacao-insercao-invariantes": {
    type: "lab",
    id: "clrs-insertion-sort",
    mountId: "workbench-insertion-mount",
    title: "Laboratório Interativo: Simulador Passo a Passo de Insertion-Sort",
    source: "catalog",
    mobile: "full"
  },
  "05-divisao-conquista-merge-sort": {
    type: "lab",
    id: "clrs-merge-sort",
    mountId: "workbench-merge-mount",
    title: "Laboratório Interativo: Intercalação Merge com Sentinelas de Infinito",
    source: "catalog",
    mobile: "full"
  }
};

// Processa e escreve cada aula
mod1.unidades.forEach((u, idx) => {
  const slug = LESSON_SLUGS[idx];
  const lessonDir = path.join(targetModDir, "lessons", slug);
  fs.mkdirSync(lessonDir, { recursive: true });

  const labBlock = LAB_MAP[slug] || null;

  const blocks = [
    { type: "intro", file: "intro.md" },
    { type: "text", file: "aprofundamento.md" }
  ];
  if (labBlock) {
    blocks.push(labBlock);
  }
  blocks.push({ type: "summary", file: "resumo.md" });

  const lessonJson = {
    id: slug,
    title: u.title,
    kind: labBlock ? "lab" : "standard",
    pages: u.reading || u.pages || "",
    blocks: blocks
  };
  fs.writeFileSync(path.join(lessonDir, "lesson.json"), JSON.stringify(lessonJson, null, 2) + "\n");

  // Intro
  const introMd = `# Introdução Contextual: ${u.title}\n\nNesta aula cobrimos os conceitos fundamentais de **${u.reading || u.pages || "Capítulo 1 e 2"}** de *Algoritmos: Teoria e Prática* (CLRS 3ª Edição), estabelecendo os alicerces teóricos e práticos necessários para o raciocínio assintótico rigoroso.\n`;
  fs.writeFileSync(path.join(lessonDir, "intro.md"), introMd);

  // Aprofundamento (remove indentação à esquerda para evitar blocos <pre><code> espúrios no Markdown)
  const aprof = u.content
    .trim()
    .split("\n")
    .map(l => l.trimStart())
    .join("\n");
  fs.writeFileSync(path.join(lessonDir, "aprofundamento.md"), aprof + "\n");

  // Resumo
  const pillar = mod1.revisao?.pillars?.[Math.min(idx, (mod1.revisao?.pillars?.length || 1) - 1)];
  const resumoBody = pillar ? pillar.body.trim() : `<p>Síntese dos conceitos fundamentais de ${u.title}.</p>`;
  const resumoMd = `# Resumo da Aula: ${u.title}\n\n${resumoBody}\n`;
  fs.writeFileSync(path.join(lessonDir, "resumo.md"), resumoMd);

  console.log(`Aula ${idx + 1} (${slug}) gerada.`);
});

// 3. Gera module.json
const moduleJson = {
  id: "01-papel-dos-algoritmos-e-partida",
  code: "MÓDULO 01",
  title: "O Papel dos Algoritmos e a Partida no Projeto e Análise",
  chapters: "Capítulos 1 e 2 (pp. 15–46)",
  pages: "pp. 15–46",
  summary: data.modules[0].summary || data.modules[0].objective,
  lessons: LESSON_SLUGS,
  quiz: "quiz.json",
  exercises: "exercises.json"
};
fs.writeFileSync(path.join(targetModDir, "module.json"), JSON.stringify(moduleJson, null, 2) + "\n");
console.log("module.json do CLRS Módulo 01 gerado!");

// 4. Gera quiz.json
const questions = mod1.quizzes.map((q, idx) => ({
  id: `q1-${idx + 1}`,
  type: q.type?.toLowerCase().includes("verdadeiro") ? "true_false" : "multiple_choice",
  reference: q.reference || "Cap. 1 e 2",
  question: q.question,
  options: q.options.map(o => ({
    letter: o.letter,
    text: o.text,
    isCorrect: !!o.isCorrect,
    explanation: o.explanation
  }))
}));
const quizJson = {
  title: "Quizzes Dialéticos do Módulo 01 (Capítulos 1 e 2)",
  subtitle: "12 questões analíticas com gabarito comentado alternativa por alternativa",
  questions: questions
};
fs.writeFileSync(path.join(targetModDir, "quiz.json"), JSON.stringify(quizJson, null, 2) + "\n");
console.log(`quiz.json do CLRS Módulo 01 gerado com ${questions.length} questões!`);

// 5. Gera exercises.json
const exercises = mod1.exercicios.map((ex, idx) => ({
  id: `ex1-${idx + 1}`,
  code: ex.code || `EXERCÍCIO ${idx + 1}`,
  reference: ex.reference || "Cap. 1 e 2",
  title: ex.title,
  prompt: ex.prompt,
  placeholder: ex.placeholder || "Utilize o rascunho para anotar hipóteses e código...",
  solution: ex.solution
}));
const exercisesJson = {
  title: "Exercícios e Problemas Canônicos do Módulo 01",
  subtitle: "8 atividades clássicas com resolução analítica passo a passo e rascunho",
  exercises: exercises
};
fs.writeFileSync(path.join(targetModDir, "exercises.json"), JSON.stringify(exercisesJson, null, 2) + "\n");
console.log(`exercises.json do CLRS Módulo 01 gerado com ${exercises.length} problemas!`);

// 6. Gera checklist.json
const checklistJson = mod1.revisao?.checklist || [
  "Compreendo a definição formal de algoritmo como ferramenta computacional e tecnologia.",
  "Domino o método de prova por invariantes de laço (inicialização, manutenção e término).",
  "Sei calcular os custos de linha a linha no modelo RAM e derivar a ordem de crescimento assintótica Θ.",
  "Compreendo o paradigma de divisão e conquista, o procedimento MERGE com sentinelas de infinito e a árvore de recursão do MERGE-SORT."
];
fs.writeFileSync(path.join(targetModDir, "checklist.json"), JSON.stringify(checklistJson, null, 2) + "\n");
console.log("checklist.json do CLRS Módulo 01 gerado!");
