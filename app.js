/* ==========================================================================
   coursebook — Motor Interativo da Aplicação Web (Início + Catálogo + Leitor)
   Persistência em localStorage, Progresso por Módulo e Geral, Laboratórios
   ========================================================================== */

(function () {
  const STORAGE_KEY = "coursebook_course_state_v1";

  // Registro global de cursos (CourseBook Multi-Course Registry)
  window.COURSES_REGISTRY = window.COURSES_REGISTRY || {};
  if (window.COURSEBOOK_DATA && !window.COURSES_REGISTRY["clrs-algoritmos"]) {
    window.COURSES_REGISTRY["clrs-algoritmos"] = window.COURSEBOOK_DATA;
  } else if (window.CODEX_DATA && !window.COURSES_REGISTRY["clrs-algoritmos"]) {
    window.COURSES_REGISTRY["clrs-algoritmos"] = window.CODEX_DATA;
  }
  const initialActiveCourseId = (typeof localStorage !== "undefined" && localStorage.getItem("coursebook_active_course_id")) || "clrs-algoritmos";
  if (window.COURSES_REGISTRY && window.COURSES_REGISTRY[initialActiveCourseId]) {
    window.COURSEBOOK_DATA = window.COURSES_REGISTRY[initialActiveCourseId];
  } else if (window.COURSES_REGISTRY && window.COURSES_REGISTRY["clrs-algoritmos"]) {
    window.COURSEBOOK_DATA = window.COURSES_REGISTRY["clrs-algoritmos"];
  }
  window.CODEX_DATA = window.COURSEBOOK_DATA;


  const STEP_KEYS = ["aprendizado", "revisao", "quizzes", "exercicios"];
  const STEP_LABELS = {
    aprendizado: "Aulas & Aprofundamento",
    revisao: "Revisão do Módulo",
    quizzes: "Quizzes Dialéticos",
    exercicios: "Exercícios Práticos"
  };

  /* Estado persistente padrão */
  const defaultState = {
    currentCourseId: "clrs-algoritmos",
    currentView: "home", // 'home' | 'catalog' | 'reader'
    currentModuleId: 1,
    currentStep: "aprendizado", // 'revisao' | 'aprendizado' | 'quizzes' | 'exercicios'
    activeUnitId: "u1-1",
    blockFilter: "all",
    searchQuery: "",
    completedSteps: {
      1: {
        revisao: false,
        aprendizado: false,
        quizzes: false,
        exercicios: false
      }
    },
    completedUnits: {},
    checklistState: {},
    quizAnswers: {},
    exerciseNotes: {},
    exerciseStatus: {},
    courses: {}
  };

  let state = loadState();

  function loadState() {
    try {
      const activeCourseId = localStorage.getItem("coursebook_active_course_id") || "clrs-algoritmos";
      if (window.COURSES_REGISTRY && window.COURSES_REGISTRY[activeCourseId]) {
        window.COURSEBOOK_DATA = window.COURSES_REGISTRY[activeCourseId];
        window.CODEX_DATA = window.COURSEBOOK_DATA;
      }

      const raw =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem("lurvro_clrs_course_state_v1") ||
        localStorage.getItem("codex_clrs_course_state_v1");
      if (!raw) {
        const fresh = JSON.parse(JSON.stringify(defaultState));
        fresh.currentCourseId = activeCourseId;
        return fresh;
      }
      const parsed = JSON.parse(raw);
      const courseProgress = (parsed.courses && parsed.courses[activeCourseId]) || {};

      return {
        ...defaultState,
        ...parsed,
        currentCourseId: parsed.currentCourseId || activeCourseId,
        currentView: ["home", "catalog", "reader"].includes(parsed.currentView) ? parsed.currentView : "home",
        currentModuleId: courseProgress.currentModuleId || parsed.currentModuleId || 1,
        currentStep: courseProgress.currentStep || parsed.currentStep || "aprendizado",
        activeUnitId: courseProgress.activeUnitId || parsed.activeUnitId || "u1-1",
        completedSteps: courseProgress.completedSteps || parsed.completedSteps || {
          ...defaultState.completedSteps,
          ...(parsed.completedSteps || {})
        },
        completedUnits: courseProgress.completedUnits || parsed.completedUnits || {},
        checklistState: courseProgress.checklistState || parsed.checklistState || {},
        quizAnswers: courseProgress.quizAnswers || parsed.quizAnswers || {},
        exerciseNotes: courseProgress.exerciseNotes || parsed.exerciseNotes || {},
        exerciseStatus: courseProgress.exerciseStatus || parsed.exerciseStatus || {}
      };
    } catch (e) {
      return JSON.parse(JSON.stringify(defaultState));
    }
  }

  function saveState() {
    try {
      if (!state.courses) state.courses = {};
      const cId = state.currentCourseId || "clrs-algoritmos";
      state.courses[cId] = {
        currentModuleId: state.currentModuleId,
        currentStep: state.currentStep,
        activeUnitId: state.activeUnitId,
        completedSteps: state.completedSteps,
        completedUnits: state.completedUnits,
        checklistState: state.checklistState,
        quizAnswers: state.quizAnswers,
        exerciseNotes: state.exerciseNotes,
        exerciseStatus: state.exerciseStatus
      };
      localStorage.setItem("coursebook_active_course_id", cId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* Ignorar bloqueio de storage privado */
    }
  }

  /* ========================================================================
     FORMATADOR MATEMÁTICO HÍBRIDO (KaTeX + Fallback Offline Nativo)
     Garante que fórmulas LaTeX fiquem impecáveis mesmo 100% offline
     ======================================================================== */
  function renderMathInContainer(container) {
    if (!container) return;
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(container, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
          ],
          throwOnError: false
        });
        return;
      } catch (e) {
        /* Usa fallback nativo se KaTeX falhar */
      }
    }
    applyOfflineMathFallback(container);
  }

  function convertLatexFragment(tex) {
    let s = tex.trim();
    // Substituições de símbolos matemáticos comuns para HTML semântico
    s = s.replace(/\\mathbf\{([^}]+)\}/g, "<strong>$1</strong>");
    s = s.replace(/\\text\{([^}]+)\}/g, "<span class='math-text'>$1</span>");
    s = s.replace(/\\mathcal\{([^}]+)\}/g, "<em>$1</em>");
    s = s.replace(/\\langle/g, "⟨").replace(/\\rangle/g, "⟩");
    s = s.replace(/\\lfloor/g, "⌊").replace(/\\rfloor/g, "⌋");
    s = s.replace(/\\lceil/g, "⌈").replace(/\\rceil/g, "⌉");
    s = s.replace(/\\le\b/g, "≤").replace(/\\ge\b/g, "≥");
    s = s.replace(/\\ne\b/g, "≠").replace(/\\approx\b/g, "≈");
    s = s.replace(/\\iff\b/g, "⟺").replace(/\\implies\b/g, "⟹");
    s = s.replace(/\\in\b/g, "∈").replace(/\\notin\b/g, "∉");
    s = s.replace(/\\dots\b/g, "…").replace(/\\cdots\b/g, "⋯");
    s = s.replace(/\\cdot\b/g, "·").replace(/\\times\b/g, "×");
    s = s.replace(/\\infty\b/g, "∞");
    s = s.replace(/\\Theta\b/g, "Θ").replace(/\\Omega\b/g, "Ω");
    s = s.replace(/\\lg\b/g, "lg").replace(/\\ln\b/g, "ln").replace(/\\log_2/g, "log<sub>2</sub>");
    s = s.replace(/\\Pr/g, "Pr");
    s = s.replace(/\\binom\{([^}]+)\}\{([^}]+)\}/g, "C($1, $2)");
    s = s.replace(/\\left\(/g, "(").replace(/\\right\)/g, ")");
    s = s.replace(/\\left\[/g, "[").replace(/\\right\]/g, "]");
    s = s.replace(/\\{/g, "{").replace(/\\}/g, "}");
    // Frações \frac{a}{b}
    for (let pass = 0; pass < 3; pass++) {
      s = s.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "<span class='math-frac'>($1)/($2)</span>");
    }
    // Somatórios \sum_{a}^{b}
    s = s.replace(/\\sum_\{([^{}]+)\}\^\{([^{}]+)\}/g, "∑<sub>$1</sub><sup>$2</sup>");
    // Cases
    s = s.replace(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g, function (_, body) {
      const rows = body
        .split("\\\\")
        .map((r) => r.replace(/&/g, " "))
        .join(" ; ");
      return "{ " + rows + " }";
    });
    // Subscritos e sobrescritos
    s = s.replace(/_\{([^{}]+)\}/g, "<sub>$1</sub>");
    s = s.replace(/\^\{([^{}]+)\}/g, "<sup>$1</sup>");
    s = s.replace(/_([a-zA-Z0-9])/g, "<sub>$1</sub>");
    s = s.replace(/\^([a-zA-Z0-9])/g, "<sup>$1</sup>");
    s = s.replace(/\\,/g, " ").replace(/\\qquad/g, " &nbsp;&nbsp;&nbsp; ");
    return s;
  }

  function applyOfflineMathFallback(container) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    const nodesToReplace = [];
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue && node.nodeValue.includes("$")) {
        nodesToReplace.push(node);
      }
    }
    nodesToReplace.forEach((textNode) => {
      const parent = textNode.parentNode;
      if (!parent || parent.tagName === "SCRIPT" || parent.tagName === "STYLE" || parent.tagName === "TEXTAREA") {
        return;
      }
      let html = textNode.nodeValue
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      // Display math $$...$$
      html = html.replace(/\$\$([\s\S]+?)\$\$/g, function (_, tex) {
        return `<div class="math-display-block" style="margin:0.85rem 0;padding:0.75rem 1rem;background:#F4EFE4;border-left:3px solid #111;font-family:var(--font-mono);font-size:0.9rem;overflow-x:auto;">${convertLatexFragment(tex)}</div>`;
      });
      // Inline math $...$
      html = html.replace(/\$([^$\n]+?)\$/g, function (_, tex) {
        return `<span class="math-inline" style="font-family:var(--font-serif);font-style:italic;">${convertLatexFragment(tex)}</span>`;
      });
      const wrapper = document.createElement("span");
      wrapper.innerHTML = html;
      parent.replaceChild(wrapper, textNode);
    });
  }

  /* ========================================================================
     CÁLCULO DE PROGRESSO POR MÓDULO E GERAL DO CURSO
     ======================================================================== */
  function getModuleProgress(moduleId) {
    const modSteps = state.completedSteps[moduleId] || {};
    let completedCount = 0;
    STEP_KEYS.forEach((k) => {
      if (modSteps[k]) completedCount++;
    });
    return {
      completedCount,
      totalSteps: STEP_KEYS.length,
      percentage: Math.round((completedCount / STEP_KEYS.length) * 100)
    };
  }

  function getGlobalCourseProgress() {
    const data = window.COURSEBOOK_DATA || window.CODEX_DATA;
    const totalModules = data.modules.length; // 16
    const totalCourseSteps = totalModules * STEP_KEYS.length; // 64
    let completedCourseSteps = 0;
    let completedModulesCount = 0;

    data.modules.forEach((m) => {
      const p = getModuleProgress(m.id);
      completedCourseSteps += p.completedCount;
      if (p.completedCount === STEP_KEYS.length) {
        completedModulesCount++;
      }
    });

    const percentage = Math.round((completedCourseSteps / totalCourseSteps) * 100);
    return {
      completedCourseSteps,
      totalCourseSteps,
      completedModulesCount,
      totalModules,
      percentage
    };
  }

  function getCurrentModuleMeta() {
    const data = window.COURSEBOOK_DATA || window.CODEX_DATA;
    if (!data || !data.modules || data.modules.length === 0) {
      return { id: 1, code: "MÓDULO 01", title: "", chapters: "", unlocked: true, concepts: [] };
    }
    const modId = state.currentModuleId || 1;
    return data.modules.find((m) => m.id === modId) || data.modules[0];
  }

  function getCurrentModuleContent() {
    const data = window.COURSEBOOK_DATA || window.CODEX_DATA;
    if (!data) return {};
    const modId = state.currentModuleId || 1;
    const map = data.modulesContent || { 1: data.module1 };
    return map[modId] || data.module1 || {};
  }

  function updateCourseHeroUI() {
    const data = window.COURSEBOOK_DATA || window.CODEX_DATA;
    if (!data) return;
    const courseMeta = data.course || data.tome;
    if (!courseMeta) return;
    const heroTitle = document.getElementById("course-hero-title") || document.getElementById("tome-hero-title");
    const heroAuthors = document.getElementById("course-hero-authors") || document.getElementById("tome-hero-authors");
    const heroMetaRow = document.getElementById("course-hero-meta-row") || document.getElementById("tome-hero-meta-row");
    const heroDesc = document.getElementById("course-hero-desc") || document.getElementById("tome-hero-desc");

    if (heroTitle) heroTitle.textContent = `${courseMeta.title}${courseMeta.edition ? " (" + courseMeta.edition + ")" : ""}`;
    if (heroAuthors) heroAuthors.textContent = (courseMeta.authors || "").toUpperCase();
    if (heroDesc) heroDesc.textContent = courseMeta.summary || courseMeta.description || "";
    if (heroMetaRow) {
      heroMetaRow.innerHTML = `
        <span class="bracket-tag dark">Visão Geral do Curso</span>
        <span class="bracket-tag amber">${data.modules ? data.modules.length : 0} Módulos Estruturados</span>
        <span class="bracket-tag emerald">${courseMeta.totalChapters || "Conteúdo Estruturado"}</span>
      `;
    }
  }

  const updateTomeHeroUI = updateCourseHeroUI;

  /* ========================================================================
     CARREGADOR MODULAR NATIVO DE CURSOS (JSON + MARKDOWN v2)
     Carrega course.json, curriculum.json, module.json, quiz, exercises e aulas
     ======================================================================== */
  function loadCourseLabScript(courseId, labId) {
    return new Promise((resolve) => {
      const knownFileMap = {
        "clrs-insertion-sort": "clrs-module1-labs.js",
        "clrs-complexity-duel": "clrs-module1-labs.js",
        "clrs-merge-sort-tree": "clrs-module1-labs.js"
      };
      const fileName = knownFileMap[labId] || `${labId}.js`;
      const scriptUrl = `courses/${courseId}/labs/${fileName}`;
      if (document.querySelector(`script[src="${scriptUrl}"]`)) {
        return resolve();
      }
      const s = document.createElement("script");
      s.src = scriptUrl;
      s.onload = () => resolve();
      s.onerror = () => resolve();
      document.body.appendChild(s);
    });
  }

  async function loadModularCourse(courseId) {
    if (window.COURSES_REGISTRY && window.COURSES_REGISTRY[courseId] && window.COURSES_REGISTRY[courseId].__isModular) {
      return window.COURSES_REGISTRY[courseId];
    }

    try {
      // 1. Carrega course.json
      const courseRes = await fetch(`courses/${courseId}/course.json`);
      if (!courseRes.ok) throw new Error(`Falha ao obter course.json (${courseRes.status})`);
      const courseData = await courseRes.json();

      // 2. Carrega curriculum.json se disponível
      let curriculum = null;
      try {
        const currRes = await fetch(`courses/${courseId}/curriculum.json`);
        if (currRes.ok) curriculum = await currRes.json();
      } catch (_) {}

      const existingRegistry = (window.COURSES_REGISTRY && window.COURSES_REGISTRY[courseId]) || {};
      const compiledCourse = {
        course: curriculum?.course || existingRegistry.course || existingRegistry.tome || {
          id: courseData.id,
          code: courseData.code || "CURSO",
          title: courseData.title,
          edition: courseData.book?.edition || "",
          authors: courseData.book?.authors || "",
          totalPages: courseData.book?.totalPages || 0,
          totalModules: (courseData.modules || []).length,
          totalChapters: courseData.chapters || "",
          tag: courseData.tag || "CURSO MODULAR",
          badge: "CANÔNICO",
          summary: courseData.description
        },
        tome: curriculum?.tome || existingRegistry.tome || null,
        blocks: curriculum?.blocks || existingRegistry.blocks || [
          {
            id: "bloco-1",
            code: "BLOCO I",
            title: "Módulos do Curso",
            subtitle: ""
          }
        ],
        modules: curriculum?.modules ? JSON.parse(JSON.stringify(curriculum.modules)) : (existingRegistry.modules ? JSON.parse(JSON.stringify(existingRegistry.modules)) : []),
        modulesContent: Object.assign({}, existingRegistry.modulesContent || {})
      };
      if (!compiledCourse.tome) compiledCourse.tome = compiledCourse.course;

      if (compiledCourse.modules.length === 0) {
        (courseData.modules || []).forEach((modFolder, idx) => {
          compiledCourse.modules.push({
            id: idx + 1,
            code: `MÓDULO ${String(idx + 1).padStart(2, "0")}`,
            blockId: "bloco-1",
            title: modFolder,
            unlocked: idx === 0,
            folder: modFolder
          });
        });
      }

      // 3. Itera sobre cada módulo em courseData.modules
      const modFolders = courseData.modules || [];
      for (let i = 0; i < modFolders.length; i++) {
        const modFolder = modFolders[i];
        const modNumericId = parseInt(modFolder.split("-")[0], 10) || (i + 1);

        let modMeta = null;
        try {
          const modRes = await fetch(`courses/${courseId}/modules/${modFolder}/module.json`);
          if (modRes.ok) modMeta = await modRes.json();
        } catch (e) {
          console.warn(`Falha ao ler module.json de ${modFolder}:`, e);
        }
        if (!modMeta) continue;

        const modItem = compiledCourse.modules.find((m) => m.id === modNumericId);
        if (modItem) {
          modItem.title = modMeta.title || modItem.title;
          modItem.chapters = modMeta.chapters || modItem.chapters;
          modItem.pages = modMeta.pages || modItem.pages;
          modItem.summary = modMeta.summary || modItem.summary;
          modItem.unlocked = true;
        }

        // 3.1 Quizzes
        let quizzes = [];
        try {
          const qFile = modMeta.quiz || "quiz.json";
          const qRes = await fetch(`courses/${courseId}/modules/${modFolder}/${qFile}`);
          if (qRes.ok) {
            const qJson = await qRes.json();
            quizzes = qJson.questions || [];
          }
        } catch (err) {
          console.warn(`Erro nos quizzes de ${modFolder}:`, err);
        }

        // 3.2 Exercícios
        let exercicios = [];
        try {
          const exFile = modMeta.exercises || "exercises.json";
          const exRes = await fetch(`courses/${courseId}/modules/${modFolder}/${exFile}`);
          if (exRes.ok) {
            const exJson = await exRes.json();
            exercicios = exJson.exercises || [];
          }
        } catch (err) {
          console.warn(`Erro nos exercícios de ${modFolder}:`, err);
        }

        // 3.3 Checklist
        let checklist = [];
        try {
          const chkRes = await fetch(`courses/${courseId}/modules/${modFolder}/checklist.json`);
          if (chkRes.ok) {
            checklist = await chkRes.json();
          }
        } catch (_) {}

        // 3.4 Aulas (lessons)
        const unidades = [];
        const reviewPillars = [];

        const lessonFolders = modMeta.lessons || [];
        for (let lIdx = 0; lIdx < lessonFolders.length; lIdx++) {
          const lessonFolder = lessonFolders[lIdx];
          let lessonMeta = null;
          try {
            const lessonRes = await fetch(`courses/${courseId}/modules/${modFolder}/lessons/${lessonFolder}/lesson.json`);
            if (lessonRes.ok) lessonMeta = await lessonRes.json();
          } catch (_) {}
          if (!lessonMeta) continue;

          let introMd = "";
          let aprofundamentoMd = "";
          let resumoMd = "";
          let labBlock = null;

          for (const block of (lessonMeta.blocks || [])) {
            if (block.type === "intro" && block.file) {
              try {
                const res = await fetch(`courses/${courseId}/modules/${modFolder}/lessons/${lessonFolder}/${block.file}`);
                if (res.ok) introMd = await res.text();
              } catch (_) {}
            } else if (block.type === "text" && block.file) {
              try {
                const res = await fetch(`courses/${courseId}/modules/${modFolder}/lessons/${lessonFolder}/${block.file}`);
                if (res.ok) aprofundamentoMd = await res.text();
              } catch (_) {}
            } else if (block.type === "summary" && block.file) {
              try {
                const res = await fetch(`courses/${courseId}/modules/${modFolder}/lessons/${lessonFolder}/${block.file}`);
                if (res.ok) resumoMd = await res.text();
              } catch (_) {}
            } else if (block.type === "lab") {
              labBlock = block;
            }
          }

          let unitContent = "";
          if (introMd) {
            const introClean = introMd.replace(/^#\s+[^\n\r]+\n+/, "").trim();
            unitContent += `:::note [INTRODUÇÃO CONTEXTUAL • AULA ${modNumericId}.${lIdx + 1}]\n${introClean}\n:::\n\n`;
          }
          if (aprofundamentoMd) {
            unitContent += aprofundamentoMd + "\n\n";
          }
          if (labBlock) {
            const mountId = labBlock.mountId || `workbench-mod${modNumericId}-mount`;
            if (!unitContent.includes(mountId)) {
              unitContent += `<div id="${mountId}"></div>\n`;
            }
          }

          unidades.push({
            id: `u${modNumericId}-${lIdx + 1}`,
            slug: lessonFolder,
            code: `${modNumericId}.${lIdx + 1}`,
            title: lessonMeta.title,
            pages: lessonMeta.pages || "",
            reading: lessonMeta.pages || "",
            content: unitContent,
            lab: labBlock
          });

          if (resumoMd) {
            let pTitle = lessonMeta.title;
            const titleMatch = resumoMd.match(/^#\s+([^\n\r]+)/);
            if (titleMatch) {
              pTitle = titleMatch[1].replace(/^Resumo\s*(?:da\s*Aula)?:\s*/i, "");
            }
            const pBody = resumoMd.replace(/^#\s+[^\n\r]+\n+/, "").trim();
            reviewPillars.push({
              tag: `[ REVISÃO UNIDADE ${modNumericId}.${lIdx + 1} • ${lessonMeta.title.toUpperCase()} ]`,
              title: pTitle,
              body: pBody
            });
          }

          if (checklist.length <= lIdx) {
            checklist.push(`Compreendo e dominei os conceitos essenciais da Aula ${modNumericId}.${lIdx + 1}: ${lessonMeta.title}.`);
          }
        }

        const initWorkbenches = async function () {
          for (const u of unidades) {
            if (u.lab && u.lab.id) {
              const labId = u.lab.id;
              if (!window.COURSEBOOK_LABS || !window.COURSEBOOK_LABS[labId]) {
                try {
                  await loadCourseLabScript(courseId, labId);
                } catch (_) {}
              }
              if (window.COURSEBOOK_LABS && window.COURSEBOOK_LABS[labId] && typeof window.COURSEBOOK_LABS[labId].init === "function") {
                const mountId = u.lab.mountId || `workbench-mod${modNumericId}-mount`;
                window.COURSEBOOK_LABS[labId].init(mountId);
              }
            }
          }
        };

        compiledCourse.modulesContent[modNumericId] = {
          unidades: unidades,
          revisao: {
            subtitle: `Síntese e Fixação dos Fundamentos — ${modMeta.code || ("MÓDULO " + modNumericId)}`,
            intro: `Esta seção consolida os alicerces teóricos e práticos de ${modMeta.chapters || ""}. Cada bloco abaixo sintetiza individualmente uma das unidades temáticas do módulo para fixação rápida antes dos Quizzes.`,
            pillars: reviewPillars,
            checklist: checklist
          },
          quizzes: quizzes,
          exercicios: exercicios,
          initWorkbenches: initWorkbenches
        };
      }

      compiledCourse.__isModular = true;
      window.COURSES_REGISTRY = window.COURSES_REGISTRY || {};
      window.COURSES_REGISTRY[courseId] = compiledCourse;
      return compiledCourse;
    } catch (err) {
      console.error(`Erro ao carregar curso modular "${courseId}":`, err);
      throw err;
    }
  }

  window.loadModularCourse = loadModularCourse;

  window.selectCourse = async function (courseId, optModuleId) {
    saveState();
    state.currentCourseId = courseId;
    state.blockFilter = "all";
    state.searchQuery = "";

    if (!window.COURSES_REGISTRY || !window.COURSES_REGISTRY[courseId] || !window.COURSES_REGISTRY[courseId].__isModular) {
      try {
        await loadModularCourse(courseId);
      } catch (err) {
        console.warn(`Não foi possível carregar o curso modular "${courseId}":`, err);
      }
    }
    if (window.COURSES_REGISTRY && window.COURSES_REGISTRY[courseId]) {
      window.COURSEBOOK_DATA = window.COURSES_REGISTRY[courseId];
      window.CODEX_DATA = window.COURSEBOOK_DATA;
    }
    localStorage.setItem("coursebook_active_course_id", courseId);

    if (state.courses && state.courses[courseId]) {
      const c = state.courses[courseId];
      state.currentModuleId = optModuleId || c.currentModuleId || 1;
      state.currentStep = c.currentStep || "aprendizado";
      state.activeUnitId = c.activeUnitId || "u1-1";
      state.completedSteps = c.completedSteps || { 1: { revisao: false, aprendizado: false, quizzes: false, exercicios: false } };
      state.completedUnits = c.completedUnits || {};
      state.checklistState = c.checklistState || {};
      state.quizAnswers = c.quizAnswers || {};
      state.exerciseNotes = c.exerciseNotes || {};
      state.exerciseStatus = c.exerciseStatus || {};
    } else {
      state.currentModuleId = optModuleId || 1;
      state.currentStep = "aprendizado";
      state.activeUnitId = "u1-1";
      state.completedSteps = { 1: { revisao: false, aprendizado: false, quizzes: false, exercicios: false } };
      state.completedUnits = {};
      state.checklistState = {};
      state.quizAnswers = {};
      state.exerciseNotes = {};
      state.exerciseStatus = {};
    }

    saveState();
    renderCatalogFilterControls();
    updateCourseHeroUI();
    renderCatalogModules();
    updateAllProgressIndicators();

    if (optModuleId) {
      await window.openModuleReader(optModuleId, "aprendizado");
    } else {
      window.switchView("catalog");
    }
  };

  function updateAllProgressIndicators() {
    const globalProg = getGlobalCourseProgress();
    const curMod = getCurrentModuleMeta();
    const curModProg = getModuleProgress(curMod.id);
    const curCourseData = window.COURSEBOOK_DATA || window.CODEX_DATA;
    const unlockedCount = curCourseData.modules.filter((m) => m.unlocked).length;
    const totalMods = curCourseData.modules.length;

    // Topbar
    const globalBar = document.getElementById("topbar-global-fill");
    const globalPct = document.getElementById("topbar-global-pct");
    const globalLabel = document.getElementById("topbar-global-label");
    if (globalBar) globalBar.style.width = `${globalProg.percentage}%`;
    if (globalPct) globalPct.textContent = `${globalProg.percentage}%`;
    if (globalLabel) {
      globalLabel.textContent = `${globalProg.completedCourseSteps}/${globalProg.totalCourseSteps} ETAPAS CONCLUÍDAS`;
    }

    // Home Course Card (Curso 01 - CLRS)
    const homeCourseFill = document.getElementById("home-course-fill");
    const homeCoursePctText = document.getElementById("home-course-pct-text");
    const homeMod1MiniPct = document.getElementById("home-mod1-mini-pct");
    const homeStatusTag = document.getElementById("home-course-status-tag");
    if (homeCourseFill && (!state.currentCourseId || state.currentCourseId === "clrs-algoritmos")) {
      homeCourseFill.style.width = `${globalProg.percentage}%`;
      if (homeCoursePctText) {
        homeCoursePctText.textContent = `${globalProg.percentage}% (${globalProg.completedModulesCount} de ${globalProg.totalModules} módulos • ${globalProg.completedCourseSteps} de ${globalProg.totalCourseSteps} etapas)`;
      }
      if (homeMod1MiniPct) {
        homeMod1MiniPct.textContent = `${curMod.code}: ${curModProg.completedCount}/4 etapas (${curModProg.percentage}%)`;
      }
      if (homeStatusTag) {
        homeStatusTag.textContent =
          globalProg.percentage === 100
            ? "Curso Concluído • 100%"
            : `${unlockedCount}/${totalMods} Módulos Ativos`;
      }
    }

    // Home Course Card (Curso 03 - Nilo Python)
    const homeNiloFill = document.getElementById("home-nilo-fill");
    const homeNiloPctText = document.getElementById("home-nilo-pct-text");
    const homeNiloMod1MiniPct = document.getElementById("home-nilo-mod1-mini-pct");
    const homeNiloStatusTag = document.getElementById("home-nilo-status-tag");
    if (homeNiloFill) {
      const niloCourse = (window.COURSES_REGISTRY && window.COURSES_REGISTRY["nilo-python"]);
      const niloSteps = (state.courses && state.courses["nilo-python"] && state.courses["nilo-python"].completedSteps) || (state.currentCourseId === "nilo-python" ? state.completedSteps : {});
      let niloDone = 0;
      STEP_KEYS.forEach((k) => {
        if (niloSteps[1] && niloSteps[1][k]) niloDone++;
      });
      const niloMod1Pct = Math.round((niloDone / STEP_KEYS.length) * 100);
      const niloCoursePct = Math.round((niloDone / (12 * STEP_KEYS.length)) * 100);
      homeNiloFill.style.width = `${Math.max(8.33, niloCoursePct)}%`;
      if (homeNiloPctText) {
        homeNiloPctText.textContent = `${niloCoursePct}% concluído (Módulo 01: ${niloMod1Pct}% • ${niloDone} de 4 etapas)`;
      }
      if (homeNiloMod1MiniPct) {
        homeNiloMod1MiniPct.textContent = `Módulo 01: ${niloDone}/4 etapas (${niloMod1Pct}%)`;
      }
      if (homeNiloStatusTag) {
        homeNiloStatusTag.textContent = niloDone === 4 ? "Módulo 01 Concluído • 100%" : "Módulo 01 Pronto";
      }
    }

    // Hero Telemetry (Catalog View)
    const heroModFill = document.getElementById("hero-mod1-fill");
    const heroModText = document.getElementById("hero-mod1-text");
    const heroGlobalStat = document.getElementById("hero-global-stat");
    const heroStepsStat = document.getElementById("hero-steps-stat");
    const heroBuiltStat = document.getElementById("hero-modules-built-stat");
    const heroCompletedModsStat = document.getElementById("hero-completed-mods-stat");
    const heroActiveModName = document.getElementById("hero-active-mod-name");
    const heroStepsLabel = document.getElementById("hero-steps-label");

    if (heroModFill) heroModFill.style.width = `${curModProg.percentage}%`;
    if (heroModText) heroModText.textContent = `${curModProg.percentage}% (${curModProg.completedCount}/4)`;
    if (heroGlobalStat) heroGlobalStat.textContent = `${globalProg.percentage}%`;
    if (heroStepsStat) heroStepsStat.textContent = `${curModProg.completedCount} / 4`;
    if (heroStepsLabel) heroStepsLabel.textContent = `Etapas do ${curMod.code}`;
    if (heroBuiltStat) heroBuiltStat.textContent = `${String(unlockedCount).padStart(2, "0")} / ${totalMods}`;
    if (heroCompletedModsStat) heroCompletedModsStat.textContent = `${globalProg.completedModulesCount} / ${totalMods}`;
    if (heroActiveModName) heroActiveModName.textContent = `${curMod.code}: ${curMod.title} (${curMod.chapters})`;

    // Sidebar Progress (Reader View)
    const sbFill = document.getElementById("sidebar-mod-fill");
    const sbPct = document.getElementById("sidebar-mod-pct");
    const sbCount = document.getElementById("sidebar-mod-count");
    if (sbFill) sbFill.style.width = `${curModProg.percentage}%`;
    if (sbPct) sbPct.textContent = `${curModProg.percentage}% CONCLUÍDO`;
    if (sbCount) sbCount.textContent = `${curModProg.completedCount} de 4 etapas`;
  }

  /* ========================================================================
     NAVEGAÇÃO ENTRE TELAS (INÍCIO / CATÁLOGO / LEITOR DO MÓDULO / CONFIGURAÇÕES)
     ======================================================================== */
  window.switchView = function (viewName) {
    if (window.toggleAppMenu) window.toggleAppMenu(true);
    state.currentView = viewName;
    saveState();

    document.querySelectorAll(".view-container").forEach((el) => {
      el.classList.toggle("active", el.id === `view-${viewName}`);
    });

    // Atualiza classes do body para controle declarativo via CSS
    document.body.className = document.body.className.replace(/\bview-[a-z0-9_-]+-active\b/g, "").trim();
    document.body.classList.add(`view-${viewName}-active`);

    // Controle do botão de menu: em páginas sem menu lateral (como settings), ocultar
    const menuBtn = document.getElementById("mobile-sidebar-btn");
    if (menuBtn) {
      if (viewName === "settings") {
        menuBtn.style.display = "none";
      } else {
        menuBtn.style.display = "";
      }
    }

    // Progresso de etapas no cabeçalho aparece apenas DENTRO do curso (view-reader)
    const globalProgPill = document.getElementById("topbar-global-progress") || (document.querySelector ? document.querySelector(".global-progress-pill") : null);
    if (globalProgPill) {
      globalProgPill.style.display = (viewName === "reader") ? "flex" : "none";
    }


    // Sincroniza estado ativo dos links de navegação do topo (Desktop)
    document.querySelectorAll(".top-nav-link").forEach((btn) => {
      btn.classList.toggle("active", btn.id === `top-nav-${viewName}`);
    });

    if (viewName === "catalog") {
      renderCatalogFilterControls();
      updateCourseHeroUI();
      renderCatalogModules();
    } else if (viewName === "reader") {
      renderReaderView();
    } else if (viewName === "settings") {
      updateSettingsUI();
    }

    updateAllProgressIndicators();
    if (typeof window !== "undefined" && window.scrollTo) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


  window.switchCodexView = window.switchView;

  window.openModuleReader = async function (moduleId, stepKey) {
    const curCourseId = state.currentCourseId || "clrs-algoritmos";
    if (!window.COURSES_REGISTRY || !window.COURSES_REGISTRY[curCourseId] || !window.COURSES_REGISTRY[curCourseId].__isModular) {
      try {
        await loadModularCourse(curCourseId);
      } catch (_) {}
    }
    if (window.COURSES_REGISTRY && window.COURSES_REGISTRY[curCourseId]) {
      window.COURSEBOOK_DATA = window.COURSES_REGISTRY[curCourseId];
      window.CODEX_DATA = window.COURSEBOOK_DATA;
    }
    const curCourseData = window.COURSEBOOK_DATA || window.CODEX_DATA;
    if (!curCourseData || !curCourseData.modules) return;
    const mod = curCourseData.modules.find((m) => m.id === moduleId);
    if (!mod) return;
    if (!mod.unlocked) {
      showLockedModuleModal(mod);
      return;
    }
    state.currentModuleId = moduleId;
    state.currentStep = stepKey || "aprendizado";
    saveState();
    window.switchView("reader");
  };

  function showLockedModuleModal(mod) {
    const modal = document.getElementById("coursebook-modal-overlay") || document.getElementById("codex-modal-overlay") || document.querySelector(".coursebook-modal-overlay");
    const titleEl = document.getElementById("modal-mod-title");
    const descEl = document.getElementById("modal-mod-desc");
    if (titleEl) titleEl.textContent = `${mod.code} • ${mod.title}`;
    if (descEl) {
      descEl.innerHTML = `
        <p style="margin-bottom:0.75rem;"><strong>Capítulos cobertos:</strong> ${mod.chapters}</p>
        <p style="margin-bottom:0.75rem;"><strong>Objetivo de aprendizagem:</strong> ${mod.objective}</p>
      `;
    }
    if (modal) modal.style.display = "flex";
  }

  window.closeModal = function () {
    const modal = document.getElementById("coursebook-modal-overlay") || document.getElementById("codex-modal-overlay") || document.querySelector(".coursebook-modal-overlay");
    if (modal) modal.style.display = "none";
  };
  window.closeCodexModal = window.closeModal;

  /* ========================================================================
     RENDERIZAÇÃO DA TELA DE VISÃO GERAL (TRILHA DOS MÓDULOS E FILTROS DINÂMICOS)
     ======================================================================== */
  function getBlockChipLabel(block) {
    if (block.shortTitle) return `${block.code}: ${block.shortTitle}`;
    const t = block.title || "";
    if (t.toLowerCase().includes("fundamento")) return `${block.code}: Fundamentos`;
    if (t.toLowerCase().includes("ordena")) return `${block.code}: Ordenação`;
    if (t.toLowerCase().includes("estrutura")) return `${block.code}: Estruturas`;
    if (t.toLowerCase().includes("avan")) return `${block.code}: Avançados`;
    if (t.toLowerCase().includes("grafo")) return `${block.code}: Grafos`;
    if (t.toLowerCase().includes("tópico") || t.toLowerCase().includes("np")) return `${block.code}: Tópicos & NP`;
    if (t.toLowerCase().includes("modular")) return `${block.code}: Modularização`;
    if (t.toLowerCase().includes("robust")) return `${block.code}: Robustez`;
    const clean = t.split(/[,:]|\se\s/)[0].trim();
    return `${block.code}: ${clean.length > 20 ? clean.substring(0, 18) + "..." : clean}`;
  }

  function renderCatalogFilterControls() {
    const curCourseData = window.COURSEBOOK_DATA || window.CODEX_DATA;
    if (!curCourseData) return;

    const heading = document.getElementById("curriculum-section-heading") || document.querySelector(".curriculum-section-heading");
    const totalMods = (curCourseData.modules || []).length;
    if (heading) {
      heading.textContent = `Trilha de Módulos (1 a ${totalMods})`;
    }

    const chipsContainer = document.getElementById("curriculum-filter-chips");
    if (!chipsContainer) return;

    const activeBlock = state.blockFilter || "all";
    const blocks = curCourseData.blocks || [];

    let chipsHTML = `<button class="filter-chip ${activeBlock === "all" ? "active" : ""}" data-block="all" onclick="setBlockFilter('all')">Todos (${totalMods})</button>`;

    blocks.forEach((block) => {
      const isActive = activeBlock === block.id;
      const label = getBlockChipLabel(block);
      chipsHTML += `\n          <button class="filter-chip ${isActive ? "active" : ""}" data-block="${block.id}" onclick="setBlockFilter('${block.id}')">${label}</button>`;
    });

    chipsContainer.innerHTML = chipsHTML;

    const searchInput = document.querySelector(".search-input-brutal");
    if (searchInput) {
      searchInput.value = state.searchQuery || "";
    }
  }

  window.renderCatalogFilterControls = renderCatalogFilterControls;

  function renderCatalogModules() {
    const mount = document.getElementById("curriculum-blocks-mount");
    if (!mount) return;

    const query = (state.searchQuery || "").trim().toLowerCase();
    const activeBlock = state.blockFilter || "all";

    let html = "";
    const curCourseData = window.COURSEBOOK_DATA || window.CODEX_DATA;
    if (!curCourseData || !curCourseData.blocks) return;

    curCourseData.blocks.forEach((block) => {
      if (activeBlock !== "all" && activeBlock !== block.id) return;

      const blockModules = curCourseData.modules.filter((m) => {
        if (m.blockId !== block.id) return false;
        if (!query) return true;
        const haystack = `${m.code} ${m.title} ${m.chapters} ${m.objective} ${m.concepts.join(" ")}`.toLowerCase();
        return haystack.includes(query);
      });

      if (blockModules.length === 0) return;

      html += `
        <section class="curriculum-block">
          <div class="block-header">
            <div>
              <span class="bracket-tag dark" style="margin-right:0.5rem;">${block.code}</span>
              <span class="block-title">${block.title}</span>
            </div>
            <span class="block-subtitle">${block.subtitle}</span>
          </div>
          <div class="modules-grid">
            ${blockModules.map((m) => renderModuleCardHTML(m)).join("")}
          </div>
        </section>
      `;
    });

    if (!html) {
      html = `
        <div class="study-unit-card" style="text-align:center;padding:3rem;">
          <p style="font-family:var(--font-mono);font-size:0.9rem;">Nenhum módulo encontrado para o filtro "<strong>${state.searchQuery}</strong>".</p>
        </div>
      `;
    }

    mount.innerHTML = html;
  }

  function renderModuleCardHTML(m) {
    const prog = getModuleProgress(m.id);
    const modSteps = state.completedSteps[m.id] || {};
    const statusBadge = m.unlocked
      ? prog.percentage === 100
        ? `<span class="bracket-tag emerald">Concluído • 100%</span>`
        : prog.completedCount > 0
        ? `<span class="bracket-tag amber">Em Estudo • ${prog.percentage}%</span>`
        : `<span class="bracket-tag amber">Disponível</span>`
      : `<span class="bracket-tag">Em Construção</span>`;

    const stepSegments = STEP_KEYS.map(
      (k) => `<div class="mini-step-segment ${modSteps[k] ? "done" : ""}" title="${STEP_LABELS[k]}"></div>`
    ).join("");

    return `
      <article class="module-card ${m.unlocked ? "unlocked" : "locked"}" onclick="openModuleReader(${m.id})">
        <div>
          <div class="module-card-top">
            <span class="bracket-tag dark">${m.code}</span>
            ${statusBadge}
          </div>
          <h3 class="module-card-title">${m.title}</h3>
          <div style="font-family:var(--font-mono);font-size:0.74rem;color:var(--ink-muted);margin-bottom:0.55rem;">
            📖 ${m.chapters} • ⏱ ${m.estimatedTime}
          </div>
          <p class="module-card-objective">${m.objective}</p>
          <div class="module-concepts-list">
            ${m.concepts.map((c) => `<span class="concept-pill">${c}</span>`).join("")}
          </div>
        </div>
        <div class="module-card-footer">
          <div class="module-mini-progress">
            <span>PROGRESSO DO MÓDULO</span>
            <strong>${prog.completedCount}/4 ETAPAS (${prog.percentage}%)</strong>
          </div>
          <div class="module-mini-steps">${stepSegments}</div>
          <div style="margin-top:0.35rem;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-family:var(--font-mono);font-size:0.72rem;font-weight:700;color:${
              m.unlocked ? "var(--ink-primary)" : "var(--ink-muted)"
            };">
              ${m.unlocked ? "Acessar Aulas do Módulo →" : "Ver Escopo do Módulo"}
            </span>
          </div>
        </div>
      </article>
    `;
  }

  window.setBlockFilter = function (blockId) {
    state.blockFilter = blockId;
    saveState();
    document.querySelectorAll(".filter-chip").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.block === blockId);
    });
    renderCatalogModules();
  };

  window.onCurriculumSearch = function (val) {
    state.searchQuery = val;
    renderCatalogModules();
  };

  /* ========================================================================
     RENDERIZAÇÃO DO AMBIENTE DE LEITURA ATIVA (MÓDULOS 1 A 16)
     ======================================================================== */
  window.selectModuleStep = function (stepKey) {
    if (!STEP_KEYS.includes(stepKey)) return;
    state.currentStep = stepKey;
    saveState();
    const sb = document.getElementById("reader-sidebar");
    if (sb) sb.classList.remove("open");
    renderReaderView();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.toggleStepCompleted = function (stepKey, goNext) {
    const modId = state.currentModuleId || 1;
    if (!state.completedSteps[modId]) {
      state.completedSteps[modId] = { revisao: false, aprendizado: false, quizzes: false, exercicios: false };
    }
    if (goNext) {
      state.completedSteps[modId][stepKey] = true;
    } else {
      state.completedSteps[modId][stepKey] = !state.completedSteps[modId][stepKey];
    }
    saveState();
    updateAllProgressIndicators();
    recordMetricEvent("lesson_complete", { step: stepKey, isDone: state.completedSteps[modId][stepKey] });

    if (goNext) {
      const idx = STEP_KEYS.indexOf(stepKey);
      if (idx >= 0 && idx < STEP_KEYS.length - 1) {
        window.selectModuleStep(STEP_KEYS[idx + 1]);
        return;
      }
    }
    renderReaderView();
  };

  function renderReaderView() {
    const curMod = getCurrentModuleMeta();
    const curContent = getCurrentModuleContent();
    const modSteps = state.completedSteps[curMod.id] || {};

    // Atualizar informações do Módulo no Card Preto da Sidebar
    const sbCode = document.getElementById("sidebar-mod-code");
    const sbCh = document.getElementById("sidebar-mod-chapters");
    const sbTitle = document.getElementById("sidebar-mod-title");
    const sbStepsTitle = document.getElementById("sidebar-steps-title");
    const sbQuizzesLbl = document.getElementById("sidebar-step-quizzes-label");
    const sbExerciciosLbl = document.getElementById("sidebar-step-exercicios-label");
    const sbTocTitle = document.getElementById("sidebar-toc-title");
    const sbTocList = document.getElementById("sidebar-toc-list");

    if (sbCode) sbCode.textContent = `${curMod.code} de ${(window.COURSEBOOK_DATA || window.CODEX_DATA).modules.length}`;
    if (sbCh) sbCh.textContent = curMod.chapters.toUpperCase();
    if (sbTitle) sbTitle.textContent = curMod.title;
    if (sbStepsTitle) sbStepsTitle.textContent = `Etapas do ${curMod.code}`;
    if (sbQuizzesLbl && curContent.quizzes) {
      sbQuizzesLbl.textContent = `03. Quizzes (${curContent.quizzes.length})`;
    }
    if (sbExerciciosLbl && curContent.exercicios) {
      sbExerciciosLbl.textContent = `04. Exercícios (${curContent.exercicios.length})`;
    }
    if (sbTocTitle) {
      sbTocTitle.textContent = `Aulas (${curMod.code})`;
    }
    if (sbTocList && curContent.unidades) {
      sbTocList.innerHTML = curContent.unidades
        .map((u) => {
          const unitKey = `mod${curMod.id}_unit_${u.id}`;
          const isUnitDone = !!(state.completedUnits && state.completedUnits[unitKey]);
          return `
          <li>
            <a href="javascript:void(0)" class="sidebar-toc-link ${isUnitDone ? "unit-done" : ""}" onclick="selectModuleStep('aprendizado'); setTimeout(()=>scrollToStudyUnit('${u.id}'), 60);" style="display:flex;align-items:flex-start;gap:0.45rem;">
              <span class="step-check" id="toc-unit-check-${u.id}" style="font-size:0.85rem;font-weight:700;color:${isUnitDone ? "var(--accent-emerald)" : "var(--ink-secondary)"};">${isUnitDone ? "✓" : "○"}</span>
              <span>${u.code ? u.code + " — " : ""}${u.title}</span>
            </a>
          </li>
        `;
        })
        .join("");
    }

    document.querySelectorAll(".sidebar-step-btn").forEach((btn) => {
      const key = btn.dataset.step;
      const isDone = !!modSteps[key];
      const isActive = state.currentStep === key;
      btn.classList.toggle("active", isActive);
      btn.classList.toggle("completed", isDone);
      const check = btn.querySelector(".step-check");
      if (check) {
        check.textContent = isDone ? "✓" : "○";
      }
    });

    // Mostrar o painel correspondente
    document.querySelectorAll(".section-pane").forEach((pane) => {
      pane.classList.toggle("active", pane.id === `pane-${state.currentStep}`);
    });

    if (state.currentStep === "revisao") {
      renderRevisaoPane();
    } else if (state.currentStep === "aprendizado") {
      renderAprendizadoPane();
    } else if (state.currentStep === "quizzes") {
      renderQuizzesPane();
    } else if (state.currentStep === "exercicios") {
      renderExerciciosPane();
    }

    renderSidebarCompactModules();
    updateAllProgressIndicators();
  }

  function renderSidebarCompactModules() {
    const list = document.getElementById("sidebar-compact-modules");
    if (!list) return;
    const curModId = state.currentModuleId || 1;
    list.innerHTML = (window.COURSEBOOK_DATA || window.CODEX_DATA).modules
      .map((m) => {
        const p = getModuleProgress(m.id);
        return `
          <li class="sidebar-mod-item ${m.id === curModId ? "current" : ""} ${m.unlocked ? "" : "locked"}" onclick="openModuleReader(${m.id})">
            <span>${m.code}: ${m.title.slice(0, 26)}…</span>
            <span>${m.unlocked ? `${p.percentage}%` : "🔒"}</span>
          </li>
        `;
      })
      .join("");
  }

  /* ------------------------------------------------------------------------
     ETAPA 2: REVISÃO DO MÓDULO & SÍNTESE
     ------------------------------------------------------------------------ */
  function renderRevisaoPane() {
    const pane = document.getElementById("pane-revisao");
    if (!pane) return;
    const curMod = getCurrentModuleMeta();
    const curContent = getCurrentModuleContent();
    const rev = curContent.revisao;
    const isCompleted = !!(state.completedSteps[curMod.id] && state.completedSteps[curMod.id].revisao);

    pane.innerHTML = `
      <div class="reading-intro-banner">
        <span class="bracket-tag amber">${curMod.code} • Etapa 02 de 04: Revisão &amp; Síntese Conceitual</span>
        <h2>${rev.subtitle}</h2>
        <p>${rev.intro}</p>
      </div>

      ${rev.pillars
        .map(
          (p) => `
        <article class="study-unit-card">
          <div class="unit-header">
            <span class="bracket-tag dark">${p.tag}</span>
            <h3 class="unit-title" style="margin-top:0.5rem;">${p.title}</h3>
          </div>
          <div class="prose-block">${p.body}</div>
        </article>
      `
        )
        .join("")}

      <div class="canonical-callout theorem">
        <span class="callout-tag">Checklist de Prontidão • ${curMod.code} (${curMod.chapters})</span>
        <p style="margin-bottom:0.85rem;">Marque cada ponto abaixo conforme confirma sua compreensão antes de avançar para os Quizzes:</p>
        <div style="display:flex;flex-direction:column;gap:0.55rem;">
          ${rev.checklist
            .map((item, idx) => {
              const chkKey = `mod${curMod.id}_rev_${idx}`;
              const checked = !!state.checklistState[chkKey] || (curMod.id === 1 && !!state.checklistState[`rev_${idx}`]);
              return `
                <label style="display:flex;align-items:flex-start;gap:0.65rem;cursor:pointer;background:var(--bg-card);padding:0.7rem 0.9rem;border:var(--border-thin);">
                  <input type="checkbox" ${checked ? "checked" : ""} onchange="toggleChecklistItem('${chkKey}', this.checked)" style="margin-top:0.25rem;transform:scale(1.2);" />
                  <span style="font-size:0.92rem;color:var(--ink-primary);">${item}</span>
                </label>
              `;
            })
            .join("")}
        </div>
      </div>

      <div class="section-completion-footer">
        <div>
          <span class="bracket-tag ${isCompleted ? "emerald" : "amber"}">
            ${isCompleted ? "✓ Etapa de Revisão Concluída" : "Etapa Atual: Revisão"}
          </span>
          <p style="font-size:0.88rem;color:var(--ink-secondary);margin-top:0.35rem;">
            Após revisar os resumos conceituais de todas as aulas deste módulo, avance para os Quizzes Dialéticos comentados.
          </p>
        </div>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button class="btn-secondary-brutal" onclick="toggleStepCompleted('revisao', false)">
            ${isCompleted ? "Desmarcar Conclusão" : "Marcar como Concluída"}
          </button>
          <button class="btn-primary-brutal" onclick="toggleStepCompleted('revisao', true)">
            Concluir Revisão e Ir para os Quizzes →
          </button>
        </div>
      </div>
    `;

    renderMathInContainer(pane);
  }

  window.toggleChecklistItem = function (key, checked) {
    state.checklistState[key] = checked;
    saveState();
  };

  /* ------------------------------------------------------------------------
     ETAPA 1: AULAS & APROFUNDAMENTO (COM LABORATÓRIOS INTERATIVOS)
     ------------------------------------------------------------------------ */
  function renderAprendizadoPane() {
    const pane = document.getElementById("pane-aprendizado");
    if (!pane) return;
    const curMod = getCurrentModuleMeta();
    const curContent = getCurrentModuleContent();
    const curCourseData = window.COURSEBOOK_DATA || window.CODEX_DATA;
    const courseAuthors = (curCourseData && (curCourseData.course?.authors || curCourseData.tome?.authors)) || "";
    const authorsText = courseAuthors ? ` (${courseAuthors})` : "";
    const unidades = curContent.unidades || [];
    const isCompleted = !!(state.completedSteps[curMod.id] && state.completedSteps[curMod.id].aprendizado);

    const completedUnitsCount = unidades.filter((u) => {
      const unitKey = `mod${curMod.id}_unit_${u.id}`;
      return !!(state.completedUnits && state.completedUnits[unitKey]);
    }).length;
    const allUnitsDone = unidades.length > 0 && completedUnitsCount === unidades.length;

    pane.innerHTML = `
      <div class="reading-intro-banner">
        <span class="bracket-tag amber">${curMod.code} • Etapa 01 de 04: Aulas &amp; Laboratórios Interativos</span>
        <h2>Estudo Aprofundado — ${curMod.title}</h2>
        <p>Cobertura integral e rigorosa de <strong>${curMod.chapters}</strong>${authorsText}, preservando todas as definições formais, teoremas, demonstrações, pseudocódigos e laboratórios interativos.</p>
      </div>

      <!-- Checklist de Aulas do Módulo -->
      <div class="canonical-callout idea" style="margin-bottom:2rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.75rem;">
          <span class="callout-tag">Checklist de Aulas • ${curMod.code}</span>
          <span class="bracket-tag ${allUnitsDone ? "emerald" : "amber"}" id="unit-checklist-summary">
            ${completedUnitsCount} de ${unidades.length} Aulas Concluídas (${Math.round((completedUnitsCount / (unidades.length || 1)) * 100)}%)
          </span>
        </div>
        <p style="margin-bottom:0.85rem;color:var(--ink-secondary);">
          Acompanhe seu progresso aula a aula. Marque cada aula concluída após estudar a teoria e praticar com os laboratórios:
        </p>
        <div class="unit-checklist-items" style="display:flex;flex-direction:column;gap:0.55rem;">
          ${unidades
            .map((u) => {
              const unitKey = `mod${curMod.id}_unit_${u.id}`;
              const isUnitDone = !!(state.completedUnits && state.completedUnits[unitKey]);
              const pageRef = u.pages || u.reading || "";
              const refBadgeText = pageRef ? `Livro: ${pageRef}` : "";
              return `
                <label class="unit-checklist-label" style="display:flex;align-items:flex-start;gap:0.75rem;cursor:pointer;background:var(--bg-card);padding:0.75rem 1rem;border:var(--border-thin);">
                  <input
                    type="checkbox"
                    data-unit-key="${unitKey}"
                    ${isUnitDone ? "checked" : ""}
                    onchange="toggleUnitCompleted(${curMod.id}, '${u.id}', this.checked)"
                    style="margin-top:0.25rem;transform:scale(1.2);accent-color:var(--accent-emerald);"
                  />
                  <div style="flex:1;">
                    <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
                      <strong style="font-size:0.92rem;color:var(--ink-primary);">${u.code ? u.code + " — " : ""}${u.title}</strong>
                      ${refBadgeText ? `<span class="bracket-tag dark" style="font-size:0.72rem;">${refBadgeText}</span>` : ""}
                    </div>
                  </div>
                  <button
                    type="button"
                    class="btn-secondary-brutal"
                    style="padding:0.2rem 0.5rem;font-size:0.72rem;"
                    onclick="event.preventDefault(); scrollToStudyUnit('${u.id}')"
                  >
                    Ir para Aula ↓
                  </button>
                </label>
              `;
            })
            .join("")}
        </div>
      </div>

      ${unidades
        .map(
          (u, idx) => {
            const pillar = (curContent.revisao && curContent.revisao.pillars && curContent.revisao.pillars[idx]) || null;
            const resumoSnippet = pillar && pillar.body ? `
              <div class="canonical-callout key-idea" style="margin-top:1.25rem;">
                <span class="callout-tag">Síntese da Aula • Ideias Principais</span>
                <div style="font-size:0.92rem;line-height:1.6;color:var(--ink-secondary);">${pillar.body}</div>
              </div>
            ` : "";

            const pageRef = u.pages || u.reading || "";
            const refBadge = pageRef ? `<span class="bracket-tag amber">Livro: ${pageRef}</span>` : "";

            const unitKey = `mod${curMod.id}_unit_${u.id}`;
            const isUnitDone = !!(state.completedUnits && state.completedUnits[unitKey]);

            return `
        <article class="study-unit-card" id="unit-card-${u.id}">
          <div class="unit-header">
            <div class="unit-meta">
              <span class="bracket-tag dark">${u.code}</span>
              ${refBadge}
              <span class="bracket-tag ${isUnitDone ? "emerald" : "dark"}" id="unit-status-badge-${u.id}">
                ${isUnitDone ? "✓ Aula Concluída" : "○ Aula Pendente"}
              </span>
            </div>
            <h2 class="unit-title">${u.title}</h2>
          </div>

          ${resumoSnippet}
          <div class="prose-block" style="margin-top:1.5rem;">${renderMarkdown(u.content)}</div>

          <div class="unit-card-footer" style="margin-top:1.75rem;padding-top:1rem;border-top:var(--border-thin);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
            <span style="font-family:var(--font-mono);font-size:0.78rem;color:var(--ink-secondary);" id="unit-status-desc-${u.id}">
              ${isUnitDone ? "✓ Aula marcada como concluída no checklist do módulo." : "○ Esta aula ainda não foi marcada como concluída."}
            </span>
            <button
              type="button"
              class="${isUnitDone ? "btn-secondary-brutal" : "btn-primary-brutal"}"
              id="unit-status-btn-${u.id}"
              style="font-size:0.8rem;padding:0.4rem 0.85rem;"
              onclick="toggleUnitCompleted(${curMod.id}, '${u.id}')"
            >
              ${isUnitDone ? "Desmarcar Aula" : "✓ Marcar Aula como Concluída"}
            </button>
          </div>
        </article>
      `;
          }
        )
        .join("")}

      <div class="section-completion-footer">
        <div>
          <span class="bracket-tag ${isCompleted ? "emerald" : "amber"}">
            ${isCompleted ? "✓ Aulas Concluídas" : "Etapa Atual: Aulas &amp; Laboratórios"}
          </span>
          <p style="font-size:0.88rem;color:var(--ink-secondary);margin-top:0.35rem;">
            Após explorar a teoria e os laboratórios interativos desta etapa, avance para a Revisão do módulo.
          </p>
        </div>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button class="btn-secondary-brutal" onclick="toggleStepCompleted('aprendizado', false)">
            ${isCompleted ? "Desmarcar Conclusão" : "Marcar como Concluída"}
          </button>
          <button class="btn-primary-brutal" onclick="toggleStepCompleted('aprendizado', true)">
            Concluir Aulas e Ir para a Revisão →
          </button>
        </div>
      </div>
    `;

    if (typeof curContent.initWorkbenches === "function") {
      curContent.initWorkbenches();
    } else if (typeof curContent.initLabs === "function") {
      curContent.initLabs();
    }

    renderMathInContainer(pane);
  }

  window.toggleUnitCompleted = function (modId, unitId, optChecked) {
    const curModId = modId || state.currentModuleId || 1;
    const unitKey = `mod${curModId}_unit_${unitId}`;
    if (!state.completedUnits) state.completedUnits = {};

    const nextState = typeof optChecked === "boolean" ? optChecked : !state.completedUnits[unitKey];
    state.completedUnits[unitKey] = nextState;
    saveState();
    recordMetricEvent("unit_complete", {
      unitId: unitId,
      moduleId: curModId,
      isDone: nextState
    });

    const badge = document.getElementById(`unit-status-badge-${unitId}`);
    if (badge) {
      badge.className = `bracket-tag ${nextState ? "emerald" : "dark"}`;
      badge.textContent = nextState ? "✓ Aula Concluída" : "○ Aula Pendente";
    }

    const desc = document.getElementById(`unit-status-desc-${unitId}`);
    if (desc) {
      desc.textContent = nextState
        ? "✓ Aula marcada como concluída no checklist do módulo."
        : "○ Esta aula ainda não foi marcada como concluída.";
    }

    const btn = document.getElementById(`unit-status-btn-${unitId}`);
    if (btn) {
      btn.className = nextState ? "btn-secondary-brutal" : "btn-primary-brutal";
      btn.textContent = nextState ? "Desmarcar Aula" : "✓ Marcar Aula como Concluída";
    }

    document.querySelectorAll(`input[data-unit-key="${unitKey}"]`).forEach((input) => {
      input.checked = nextState;
    });

    const curContent = getCurrentModuleContent();
    const unidades = (curContent && curContent.unidades) || [];
    const completedUnitsCount = unidades.filter((u) => {
      const k = `mod${curModId}_unit_${u.id}`;
      return !!(state.completedUnits && state.completedUnits[k]);
    }).length;
    const allDone = unidades.length > 0 && completedUnitsCount === unidades.length;

    const summary = document.getElementById("unit-checklist-summary");
    if (summary) {
      summary.className = `bracket-tag ${allDone ? "emerald" : "amber"}`;
      summary.textContent = `${completedUnitsCount} de ${unidades.length} Aulas Concluídas (${Math.round((completedUnitsCount / (unidades.length || 1)) * 100)}%)`;
    }

    const tocCheck = document.getElementById(`toc-unit-check-${unitId}`);
    if (tocCheck) {
      tocCheck.textContent = nextState ? "✓" : "○";
      tocCheck.style.color = nextState ? "var(--accent-emerald)" : "var(--ink-secondary)";
    }
    const tocLink = tocCheck ? tocCheck.closest(".sidebar-toc-link") : null;
    if (tocLink) {
      tocLink.classList.toggle("unit-done", nextState);
    }
  };

  window.scrollToStudyUnit = function (unitId) {
    window.toggleMobileSidebar(true);
    const el = document.getElementById(`unit-card-${unitId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /* ========================================================================
     WEB ENGINE v2 — PARSER MARKDOWN & CALLOUTS EDITORIAIS
     Suporte a diretivas :::tag [Título] e fallback KaTeX inline
     ======================================================================== */
  function renderMarkdown(rawText) {
    if (!rawText) return "";
    if (/<\/?[a-z][\s\S]*>/i.test(rawText) && !rawText.includes(":::")) {
      return rawText;
    }

    let parsed = rawText.replace(/:::([a-zA-Z0-9_-]+)(?:[ \t]+([^\n\r]+))?\n([\s\S]*?)\n:::/g, function (match, tag, title, body) {
      const cleanTitle = title ? title.replace(/^\[\s*|\s*\]$/g, "").trim() : tag.toUpperCase();
      const header = `<span class="callout-tag">${cleanTitle}</span>`;
      return `<div class="canonical-callout ${tag}">${header}\n${body}\n</div>`;
    });

    if (typeof window.marked !== "undefined" && typeof window.marked.parse === "function") {
      try {
        return window.marked.parse(parsed);
      } catch (e) {
        console.warn("Falha no marked.parse, usando fallback:", e);
      }
    }

    return parsed
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      .replace(/\n\n/gim, '</p><p>');
  }

  /* ========================================================================
     SISTEMA DE TELEMETRIA E MÉTRICAS LOCAIS (coursebook:events:v1)
     Registra eventos estruturados com viewport para comparação de formatos
     ======================================================================== */
  const EVENTS_STORAGE_KEY = "coursebook:events:v1";

  function recordMetricEvent(type, details) {
    try {
      const raw = localStorage.getItem(EVENTS_STORAGE_KEY) || "[]";
      const events = JSON.parse(raw);
      const evt = {
        ts: new Date().toISOString(),
        course: (state && state.currentCourseId) || "clrs-algoritmos",
        module: String((state && state.currentModuleId) || 1),
        lesson: (state && state.activeUnitId) || "u1-1",
        type: type,
        profile: (state && state.currentProfile) || "padrao",
        viewport: window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || 1280,
        ...(details || {})
      };
      events.push(evt);
      if (events.length > 2000) events.shift();
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.warn("Telemetria:", e);
    }
  }

  window.coursebookGetMetrics = function () {
    try {
      return JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY) || "[]");
    } catch (e) {
      return [];
    }
  };

  /* ------------------------------------------------------------------------
     SEÇÃO 3: QUIZZES COM GABARITO COMENTADO DIALÉTICO
     ------------------------------------------------------------------------ */
  function renderQuizzesPane() {
    const pane = document.getElementById("pane-quizzes");
    if (!pane) return;
    const curMod = getCurrentModuleMeta();
    const curContent = getCurrentModuleContent();
    const quizzes = curContent.quizzes || [];
    const isCompleted = !!(state.completedSteps[curMod.id] && state.completedSteps[curMod.id].quizzes);

    let answeredCount = 0;
    let correctCount = 0;
    quizzes.forEach((q) => {
      const chosen = state.quizAnswers[q.id];
      if (chosen) {
        answeredCount++;
        const opt = q.options.find((o) => o.letter === chosen);
        if (opt && opt.isCorrect) correctCount++;
      }
    });

    const pctScore = quizzes.length ? Math.round((correctCount / quizzes.length) * 100) : 0;

    pane.innerHTML = `
      <div class="reading-intro-banner">
        <span class="bracket-tag amber">${curMod.code} • Etapa 03 de 04: Verificação Conceitual &amp; Gabarito Dialético</span>
        <h2>Quizzes Comentados — ${curMod.chapters}</h2>
        <p>Responda às ${quizzes.length} questões de Múltipla Escolha e Verdadeiro/Falso. Ao selecionar uma alternativa, o <strong>Gabarito Comentado</strong> é exibido imediatamente, explicando por que a resposta certa é verdadeira e refutando formalmente cada alternativa incorreta com referência às páginas do livro.</p>
      </div>

      <div class="quiz-score-banner">
        <div>
          <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--accent-amber-border);">DESEMPENHO NOS QUIZZES DO ${curMod.code}</div>
          <div style="font-family:var(--font-serif);font-size:1.35rem;font-weight:700;margin-top:0.2rem;">
            ${answeredCount} de ${quizzes.length} questões respondidas • ${correctCount} acertos (${pctScore}%)
          </div>
        </div>
        <button class="btn-secondary-brutal" onclick="resetModuleQuizzes()">↺ Reiniciar Respostas deste Módulo</button>
      </div>

      ${quizzes
        .map((q, idx) => {
          const chosenLetter = state.quizAnswers[q.id];
          const isAnswered = !!chosenLetter;

          return `
            <article class="quiz-card" id="quiz-card-${q.id}">
              <div class="quiz-card-header">
                <span class="bracket-tag dark">Questão ${String(idx + 1).padStart(2, "0")} • ${q.type.toUpperCase()}</span>
                <span class="bracket-tag amber">Ref: ${q.reference}</span>
              </div>
              <div class="quiz-question-text">${q.question}</div>
              <div class="quiz-options-list">
                ${q.options
                  .map((opt) => {
                    let cls = "quiz-opt-btn";
                    if (isAnswered) {
                      if (opt.isCorrect) cls += " correct-choice";
                      else if (opt.letter === chosenLetter && !opt.isCorrect) cls += " wrong-choice";
                    }
                    return `
                      <button class="${cls}" onclick="answerQuizQuestion('${q.id}', '${opt.letter}')">
                        <span class="quiz-opt-letter">${opt.letter}</span>
                        <span>${opt.text}</span>
                      </button>
                    `;
                  })
                  .join("")}
              </div>

              <div class="quiz-commentary-box ${isAnswered ? "visible" : ""}">
                <div style="font-family:var(--font-mono);font-size:0.76rem;font-weight:700;text-transform:uppercase;margin-bottom:0.65rem;color:var(--ink-primary);">
                  Gabarito Comentado Alternativa por Alternativa — ${q.reference}
                </div>
                ${q.options
                  .map(
                    (opt) => `
                  <div class="commentary-Option-item">
                    <strong style="color:${opt.isCorrect ? "var(--accent-emerald-dark)" : "var(--accent-crimson)"};font-family:var(--font-mono);">
                      (${opt.letter}) ${opt.isCorrect ? "✓ Correta:" : "✗ Incorreta:"}
                    </strong>
                    <span> ${opt.explanation}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </article>
          `;
        })
        .join("")}

      <div class="section-completion-footer">
        <div>
          <span class="bracket-tag ${isCompleted ? "emerald" : "amber"}">
            ${isCompleted ? "✓ Quizzes Concluídos" : "Etapa Atual: Quizzes"}
          </span>
          <p style="font-size:0.88rem;color:var(--ink-secondary);margin-top:0.35rem;">
            Conclua a verificação conceitual para avançar para a última etapa do ${curMod.code}: Exercícios e Demonstrações.
          </p>
        </div>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button class="btn-secondary-brutal" onclick="toggleStepCompleted('quizzes', false)">
            ${isCompleted ? "Desmarcar Conclusão" : "Marcar como Concluída"}
          </button>
          <button class="btn-primary-brutal" onclick="toggleStepCompleted('quizzes', true)">
            Concluir Quizzes e Ir para os Exercícios →
          </button>
        </div>
      </div>
    `;

    renderMathInContainer(pane);
  }

  window.answerQuizQuestion = function (quizId, letter) {
    state.quizAnswers[quizId] = letter;
    const curContent = getCurrentModuleContent();
    const qObj = (curContent.quizzes || []).find((x) => x.id === quizId);
    const chosenOpt = qObj ? (qObj.options || []).find((o) => o.letter === letter) : null;
    recordMetricEvent("quiz_answer", { questionId: quizId, chosen: letter, isCorrect: chosenOpt ? !!chosenOpt.isCorrect : false });
    saveState();
    renderQuizzesPane();
  };

  window.resetModuleQuizzes = function () {
    const curContent = getCurrentModuleContent();
    (curContent.quizzes || []).forEach((q) => {
      delete state.quizAnswers[q.id];
    });
    saveState();
    renderQuizzesPane();
  };

  /* ------------------------------------------------------------------------
     SEÇÃO 4: EXERCÍCIOS PRÁTICOS & GUIA DE RESPOSTA
     ------------------------------------------------------------------------ */
  function renderExerciciosPane() {
    const pane = document.getElementById("pane-exercicios");
    if (!pane) return;
    const curMod = getCurrentModuleMeta();
    const curContent = getCurrentModuleContent();
    const exercicios = curContent.exercicios || [];
    const isCompleted = !!(state.completedSteps[curMod.id] && state.completedSteps[curMod.id].exercicios);
    const nextMod = (window.COURSEBOOK_DATA || window.CODEX_DATA).modules.find((m) => m.id === curMod.id + 1);

    pane.innerHTML = `
      <div class="reading-intro-banner">
        <span class="bracket-tag amber">${curMod.code} • Etapa 04 de 04: Aplicação Prática &amp; Demonstrações</span>
        <h2>Caderno de Exercícios e Problemas — ${curMod.chapters}</h2>
        <p>Resolva os ${exercicios.length} exercícios e problemas canônicos deste módulo. Utilize o rascunho em cada atividade (suas anotações ficam salvas automaticamente no navegador) e, em seguida, abra o <strong>Guia de Resposta e Demonstração Passo a Passo</strong> para confrontar sua solução com a resolução formal.</p>
      </div>

      ${exercicios
        .map((ex) => {
          const savedNote = state.exerciseNotes[ex.id] || "";
          const selfStatus = state.exerciseStatus[ex.id] || "";

          return `
            <article class="exercise-card" id="ex-card-${ex.id}">
              <div class="unit-meta">
                <span class="bracket-tag dark">${ex.code}</span>
                <span class="bracket-tag amber">Fonte: ${ex.reference}</span>
              </div>
              <h3 class="unit-title" style="margin-top:0.5rem;">${ex.title}</h3>
              <div class="exercise-prompt prose-block">${ex.prompt}</div>

              <div class="exercise-workspace">
                <label style="display:block;font-family:var(--font-mono);font-size:0.73rem;font-weight:700;margin-bottom:0.4rem;">
                  Sua Resolução / Rascunho (Salvo Automaticamente):
                </label>
                <textarea
                  class="exercise-textarea"
                  placeholder="${ex.placeholder || "Escreva sua demonstração, análise ou pseudocódigo aqui..."}"
                  oninput="saveExerciseNote('${ex.id}', this.value)"
                >${savedNote}</textarea>
              </div>

              <div class="exercise-actions-row">
                <div style="display:flex;align-items:center;gap:0.45rem;flex-wrap:wrap;">
                  <span style="font-family:var(--font-mono);font-size:0.72rem;font-weight:700;">AUTOAVALIAÇÃO:</span>
                  <button class="wb-btn ${selfStatus === "resolvido" ? "primary" : ""}" onclick="setExerciseStatus('${ex.id}', 'resolvido')">
                    ✓ Resolvi com segurança
                  </button>
                  <button class="wb-btn ${selfStatus === "consulta" ? "primary" : ""}" onclick="setExerciseStatus('${ex.id}', 'consulta')">
                    ◐ Resolvi consultando o guia
                  </button>
                  <button class="wb-btn ${selfStatus === "revisar" ? "primary" : ""}" onclick="setExerciseStatus('${ex.id}', 'revisar')">
                    ⚑ Marcar para revisão
                  </button>
                </div>
                <button class="btn-secondary-brutal" onclick="toggleSolutionGuide('${ex.id}')">
                  Ver / Ocultar Guia de Resposta Completo
                </button>
              </div>

              <div class="solution-guide-panel prose-block" id="sol-guide-${ex.id}">
                <div style="font-family:var(--font-mono);font-size:0.76rem;font-weight:700;color:var(--accent-emerald-dark);margin-bottom:0.75rem;border-bottom:1px solid var(--ink-primary);padding-bottom:0.4rem;">
                  Guia de Resposta e Demonstração Passo a Passo • ${ex.reference}
                </div>
                ${ex.solution}
              </div>
            </article>
          `;
        })
        .join("")}

      <div class="section-completion-footer">
        <div>
          <span class="bracket-tag ${isCompleted ? "emerald" : "amber"}">
            ${isCompleted ? `✓ ${curMod.code} Concluído` : `Etapa Atual: Exercícios`}
          </span>
          <p style="font-size:0.88rem;color:var(--ink-secondary);margin-top:0.35rem;">
            Marque esta etapa como concluída para finalizar o ${curMod.code}!
          </p>
        </div>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button class="btn-secondary-brutal" onclick="switchView('catalog')">
            ← Voltar à Visão Geral
          </button>
          <button class="btn-primary-brutal" onclick="toggleStepCompleted('exercicios', false)">
            ${isCompleted ? "✓ Exercícios Concluídos" : `★ Concluir Exercícios (${curMod.code})`}
          </button>
          ${
            nextMod && nextMod.unlocked
              ? `<button class="btn-primary-brutal" onclick="openModuleReader(${nextMod.id}, 'aprendizado')">
                  Ir para ${nextMod.code} →
                </button>`
              : ""
          }
        </div>
      </div>
    `;

    renderMathInContainer(pane);
  }

  window.saveExerciseNote = function (exId, text) {
    state.exerciseNotes[exId] = text;
    saveState();
  };

  window.setExerciseStatus = function (exId, status) {
    state.exerciseStatus[exId] = state.exerciseStatus[exId] === status ? "" : status;
    saveState();
    renderExerciciosPane();
  };

  window.toggleSolutionGuide = function (exId) {
    const panel = document.getElementById(`sol-guide-${exId}`);
    if (panel) {
      panel.classList.toggle("visible");
    }
  };

  /* ========================================================================
     CONTROLE DO MENU DA APLICAÇÃO (LATERAL E LEITOR)
     ======================================================================== */
  window.toggleAppMenu = function (forceClose) {
    if (state.currentView === "reader") {
      const sb = document.getElementById("reader-sidebar");
      const backdrop = document.getElementById("sidebar-backdrop");
      if (!sb) return;

      const shouldOpen = forceClose ? false : !sb.classList.contains("open");
      if (shouldOpen) {
        sb.classList.add("open");
        if (backdrop) backdrop.classList.add("active");
        document.body.style.overflow = "hidden";
      } else {
        sb.classList.remove("open");
        if (backdrop) backdrop.classList.remove("active");
        document.body.style.overflow = "";
      }
    } else if (state.currentView === "home" || state.currentView === "catalog") {
      const ps = document.getElementById("platform-sidebar");
      const backdrop = document.getElementById("platform-backdrop");
      if (!ps) return;

      const shouldOpen = forceClose ? false : !ps.classList.contains("open");
      if (shouldOpen) {
        ps.classList.add("open");
        if (backdrop) backdrop.classList.add("active");
        document.body.style.overflow = "hidden";
      } else {
        ps.classList.remove("open");
        if (backdrop) backdrop.classList.remove("active");
        document.body.style.overflow = "";
      }
    }
  };
  window.toggleMobileSidebar = window.toggleAppMenu;

  /* ========================================================================
     SISTEMA DE CONFIGURAÇÕES, BACKUP & RESTAURAÇÃO (coursebook)
     ======================================================================== */
  function updateSettingsUI() {
    const curCourseData = window.COURSEBOOK_DATA || window.CODEX_DATA;
    const courseTitleEl = document.getElementById("settings-active-course");
    const stepsCountEl = document.getElementById("settings-completed-steps");
    const storageSizeEl = document.getElementById("settings-storage-size");

    if (courseTitleEl && curCourseData && (curCourseData.course || curCourseData.tome)) {
      const meta = curCourseData.course || curCourseData.tome;
      courseTitleEl.textContent = meta.title || "Curso Interativo";
    }

    if (stepsCountEl) {
      let count = 0;
      if (state.completedSteps) {
        Object.values(state.completedSteps).forEach((mod) => {
          if (mod) {
            if (mod.aprendizado) count++;
            if (mod.revisao) count++;
            if (mod.quizzes) count++;
            if (mod.exercicios) count++;
          }
        });
      }
      stepsCountEl.textContent = `${count} etapas`;
    }

    if (storageSizeEl) {
      try {
        let totalBytes = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith("coursebook") || key.startsWith("codex"))) {
            totalBytes += (key.length + (localStorage.getItem(key) || "").length) * 2;
          }
        }
        storageSizeEl.textContent = `~${(totalBytes / 1024).toFixed(1)} KB`;
      } catch (e) {
        storageSizeEl.textContent = "~2 KB";
      }
    }
  }

  window.openBackupModal = function () {
    const modal = document.getElementById("backup-modal-overlay");
    if (modal) modal.style.display = "flex";
  };

  window.closeBackupModal = function () {
    const modal = document.getElementById("backup-modal-overlay");
    if (modal) modal.style.display = "none";
  };

  window.coursebookExportData = function () {
    try {
      const payload = {
        exportedAt: new Date().toISOString(),
        version: "coursebook-backup-v1",
        activeCourseId: localStorage.getItem("coursebook_active_course_id") || "clrs-algoritmos",
        state: state,
        events: window.coursebookGetMetrics()
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `coursebook-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Erro ao exportar backup: " + e.message);
    }
  };

  window.triggerRestoreFromFile = function (optInputId) {
    const inputId = optInputId || "backup-file-input";
    let input = document.getElementById(inputId);
    if (!input || !input.files || !input.files[0]) {
      input = document.getElementById("settings-backup-file-input") || document.getElementById("backup-file-input");
    }
    if (!input || !input.files || !input.files[0]) {
      alert("Por favor, selecione um arquivo JSON de backup antes de restaurar.");
      return;
    }
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);
        if (!data || !data.state) {
          throw new Error("Formato de backup inválido: objeto de estado ausente.");
        }
        state = { ...defaultState, ...data.state };
        saveState();
        if (data.events && Array.isArray(data.events)) {
          localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(data.events));
        }
        if (data.activeCourseId) {
          localStorage.setItem("coursebook_active_course_id", data.activeCourseId);
          state.currentCourseId = data.activeCourseId;
          if (window.COURSES_REGISTRY && window.COURSES_REGISTRY[data.activeCourseId]) {
            window.COURSEBOOK_DATA = window.COURSES_REGISTRY[data.activeCourseId];
            window.CODEX_DATA = window.COURSEBOOK_DATA;
          }
        }
        window.closeBackupModal();
        updateCourseHeroUI();
        renderCatalogModules();
        renderReaderView();
        updateAllProgressIndicators();
        updateSettingsUI();
        alert("Progresso e histórico de estudo restaurados com sucesso!");
      } catch (err) {
        alert("Falha na restauração do backup: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  window.triggerRestoreFromSettings = function () {
    window.triggerRestoreFromFile("settings-backup-file-input");
  };

  window.resetCoursebookProgress = function () {
    const confirmed = confirm(
      "Tem certeza que deseja zerar todo o progresso de estudo salvo neste navegador?\n\nEsta ação apagará respostas de quizzes, notas de exercícios e etapas concluídas. Backups exportados em arquivo JSON não serão afetados."
    );
    if (!confirmed) return;

    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(EVENTS_STORAGE_KEY);
      state = JSON.parse(JSON.stringify(defaultState));
      saveState();
      updateCourseHeroUI();
      renderCatalogModules();
      renderReaderView();
      updateAllProgressIndicators();
      updateSettingsUI();
      alert("Progresso de estudo zerado com sucesso!");
      window.switchView("home");
    } catch (e) {
      alert("Erro ao zerar progresso: " + e.message);
    }
  };


  /* ========================================================================
     INICIALIZAÇÃO GERAL AO CARREGAR O DOM
     ======================================================================== */
  document.addEventListener("DOMContentLoaded", async function () {
    const activeCourseId = (typeof localStorage !== "undefined" && localStorage.getItem("coursebook_active_course_id")) || state.currentCourseId || "clrs-algoritmos";
    if (activeCourseId && (!window.COURSES_REGISTRY || !window.COURSES_REGISTRY[activeCourseId] || !window.COURSES_REGISTRY[activeCourseId].__isModular)) {
      try {
        await loadModularCourse(activeCourseId);
      } catch (err) {
        console.warn(`Carregamento inicial modular para "${activeCourseId}":`, err);
      }
    }
    if (window.COURSES_REGISTRY && window.COURSES_REGISTRY[activeCourseId]) {
      window.COURSEBOOK_DATA = window.COURSES_REGISTRY[activeCourseId];
      window.CODEX_DATA = window.COURSEBOOK_DATA;
    }
    updateCourseHeroUI();
    renderCatalogFilterControls();
    renderCatalogModules();
    renderReaderView();
    window.switchView(state.currentView || "home");
  });
})();
