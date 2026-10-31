/* ==========================================================================
   coursebook — Motor Interativo da Aplicação Web (Início + Visão Geral + Bancada)
   Persistência em localStorage, Progresso por Módulo e Geral, Simuladores CLRS
   ========================================================================== */

(function () {
  const STORAGE_KEY = "coursebook_clrs_course_state_v1";

  // Registro global de cursos (CourseBook Multi-Course Registry)
  window.COURSES_REGISTRY = window.COURSES_REGISTRY || {};
  if (window.CODEX_DATA && !window.COURSES_REGISTRY["clrs-algoritmos"]) {
    window.COURSES_REGISTRY["clrs-algoritmos"] = window.CODEX_DATA;
  }

  const STEP_KEYS = ["revisao", "aprendizado", "quizzes", "exercicios"];
  const STEP_LABELS = {
    revisao: "Revisão",
    aprendizado: "Primeiro Contato",
    quizzes: "Quizzes",
    exercicios: "Exercícios"
  };

  /* Estado persistente padrão */
  const defaultState = {
    currentCourseId: "clrs-algoritmos",
    currentView: "home", // 'home' | 'catalog' | 'reader'
    currentModuleId: 1,
    currentStep: "revisao", // 'revisao' | 'aprendizado' | 'quizzes' | 'exercicios'
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
        window.CODEX_DATA = window.COURSES_REGISTRY[activeCourseId];
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
        currentStep: courseProgress.currentStep || parsed.currentStep || "revisao",
        activeUnitId: courseProgress.activeUnitId || parsed.activeUnitId || "u1-1",
        completedSteps: courseProgress.completedSteps || parsed.completedSteps || {
          ...defaultState.completedSteps,
          ...(parsed.completedSteps || {})
        },
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
    const totalModules = window.CODEX_DATA.modules.length; // 16
    const totalCourseSteps = totalModules * STEP_KEYS.length; // 64
    let completedCourseSteps = 0;
    let completedModulesCount = 0;

    window.CODEX_DATA.modules.forEach((m) => {
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
    const modId = state.currentModuleId || 1;
    return window.CODEX_DATA.modules.find((m) => m.id === modId) || window.CODEX_DATA.modules[0];
  }

  function getCurrentModuleContent() {
    const modId = state.currentModuleId || 1;
    const map = window.CODEX_DATA.modulesContent || { 1: window.CODEX_DATA.module1 };
    return map[modId] || window.CODEX_DATA.module1;
  }

  function updateTomeHeroUI() {
    const data = window.CODEX_DATA;
    if (!data || !data.tome) return;
    const tome = data.tome;
    const heroTitle = document.getElementById("tome-hero-title");
    const heroAuthors = document.getElementById("tome-hero-authors");
    const heroMetaRow = document.getElementById("tome-hero-meta-row");
    const heroDesc = document.getElementById("tome-hero-desc");

    if (heroTitle) heroTitle.textContent = `${tome.title} (${tome.edition})`;
    if (heroAuthors) heroAuthors.textContent = tome.authors.toUpperCase();
    if (heroDesc) heroDesc.textContent = tome.summary;
    if (heroMetaRow) {
      heroMetaRow.innerHTML = `
        <span class="bracket-tag dark">[ VISÃO GERAL DO CURSO ]</span>
        <span class="bracket-tag amber">[ ${data.modules.length} MÓDULOS ESTRUTURADOS ]</span>
        <span class="bracket-tag emerald">[ ${tome.totalChapters} • ${tome.totalPages} PÁGINAS ]</span>
      `;
    }
  }

  window.selectCourse = function (courseId, optModuleId) {
    saveState();
    state.currentCourseId = courseId;
    if (window.COURSES_REGISTRY && window.COURSES_REGISTRY[courseId]) {
      window.CODEX_DATA = window.COURSES_REGISTRY[courseId];
    }
    localStorage.setItem("coursebook_active_course_id", courseId);

    if (state.courses && state.courses[courseId]) {
      const c = state.courses[courseId];
      state.currentModuleId = optModuleId || c.currentModuleId || 1;
      state.currentStep = c.currentStep || "revisao";
      state.activeUnitId = c.activeUnitId || "u1-1";
      state.completedSteps = c.completedSteps || { 1: { revisao: false, aprendizado: false, quizzes: false, exercicios: false } };
      state.checklistState = c.checklistState || {};
      state.quizAnswers = c.quizAnswers || {};
      state.exerciseNotes = c.exerciseNotes || {};
      state.exerciseStatus = c.exerciseStatus || {};
    } else {
      state.currentModuleId = optModuleId || 1;
      state.currentStep = "revisao";
      state.activeUnitId = "u1-1";
      state.completedSteps = { 1: { revisao: false, aprendizado: false, quizzes: false, exercicios: false } };
      state.checklistState = {};
      state.quizAnswers = {};
      state.exerciseNotes = {};
      state.exerciseStatus = {};
    }

    saveState();
    updateTomeHeroUI();
    renderCatalogModules();
    updateAllProgressIndicators();

    if (optModuleId) {
      window.openModuleReader(optModuleId, "revisao");
    } else {
      window.switchCodexView("catalog");
    }
  };

  function updateAllProgressIndicators() {
    const globalProg = getGlobalCourseProgress();
    const curMod = getCurrentModuleMeta();
    const curModProg = getModuleProgress(curMod.id);
    const unlockedCount = window.CODEX_DATA.modules.filter((m) => m.unlocked).length;
    const totalMods = window.CODEX_DATA.modules.length;

    // Topbar
    const globalBar = document.getElementById("topbar-global-fill");
    const globalPct = document.getElementById("topbar-global-pct");
    const globalLabel = document.getElementById("topbar-global-label");
    if (globalBar) globalBar.style.width = `${globalProg.percentage}%`;
    if (globalPct) globalPct.textContent = `${globalProg.percentage}%`;
    if (globalLabel) {
      const tomeId = (window.CODEX_DATA.tome && window.CODEX_DATA.tome.id) || "CURSO";
      globalLabel.textContent = `${tomeId.toUpperCase()}: ${globalProg.completedCourseSteps}/${globalProg.totalCourseSteps} ETAPAS`;
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
        homeMod1MiniPct.textContent = `${curMod.code}: ${curModProg.completedCount}/4 seções (${curModProg.percentage}%)`;
      }
      if (homeStatusTag) {
        homeStatusTag.textContent =
          globalProg.percentage === 100
            ? "[ CURSO CONCLUÍDO • 100% ]"
            : `[ ${unlockedCount}/${totalMods} MÓDULOS ATIVOS ]`;
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
        homeNiloPctText.textContent = `${niloCoursePct}% concluído (Módulo 01: ${niloMod1Pct}% • ${niloDone} de 4 seções)`;
      }
      if (homeNiloMod1MiniPct) {
        homeNiloMod1MiniPct.textContent = `Módulo 01: ${niloDone}/4 seções (${niloMod1Pct}%)`;
      }
      if (homeNiloStatusTag) {
        homeNiloStatusTag.textContent = niloDone === 4 ? "[ MÓDULO 01 CONCLUÍDO • 100% ]" : "[ MÓDULO 01 PRONTO ]";
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
    if (sbCount) sbCount.textContent = `${curModProg.completedCount} DE 4 SEÇÕES`;
  }

  /* ========================================================================
     NAVEGAÇÃO ENTRE TELAS (INÍCIO / VISÃO GERAL / BANCADA DO MÓDULO)
     ======================================================================== */
  window.switchCodexView = function (viewName) {
    state.currentView = viewName;
    saveState();

    document.querySelectorAll(".view-container").forEach((el) => {
      el.classList.toggle("active", el.id === `view-${viewName}`);
    });

    if (viewName === "catalog") {
      updateTomeHeroUI();
      renderCatalogModules();
    } else if (viewName === "reader") {
      renderReaderView();
    }
    updateAllProgressIndicators();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.openModuleReader = function (moduleId, stepKey) {
    const mod = window.CODEX_DATA.modules.find((m) => m.id === moduleId);
    if (!mod) return;
    if (!mod.unlocked) {
      showLockedModuleModal(mod);
      return;
    }
    state.currentModuleId = moduleId;
    state.currentStep = stepKey || "revisao";
    saveState();
    window.switchCodexView("reader");
  };

  function showLockedModuleModal(mod) {
    const modal = document.getElementById("codex-modal-overlay");
    const titleEl = document.getElementById("modal-mod-title");
    const descEl = document.getElementById("modal-mod-desc");
    if (titleEl) titleEl.textContent = `[ ${mod.code} • ${mod.title} ]`;
    if (descEl) {
      descEl.innerHTML = `
        <p style="margin-bottom:0.75rem;"><strong>Capítulos cobertos:</strong> ${mod.chapters}</p>
        <p style="margin-bottom:0.75rem;"><strong>Objetivo de aprendizagem:</strong> ${mod.objective}</p>
      `;
    }
    if (modal) modal.style.display = "flex";
  }

  window.closeCodexModal = function () {
    const modal = document.getElementById("codex-modal-overlay");
    if (modal) modal.style.display = "none";
  };

  /* ========================================================================
     RENDERIZAÇÃO DA TELA DE VISÃO GERAL (TRILHA DOS 16 MÓDULOS E FILTROS)
     ======================================================================== */
  function renderCatalogModules() {
    const mount = document.getElementById("curriculum-blocks-mount");
    if (!mount) return;

    const query = (state.searchQuery || "").trim().toLowerCase();
    const activeBlock = state.blockFilter || "all";

    let html = "";

    window.CODEX_DATA.blocks.forEach((block) => {
      if (activeBlock !== "all" && activeBlock !== block.id) return;

      const blockModules = window.CODEX_DATA.modules.filter((m) => {
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
              <span class="bracket-tag dark" style="margin-right:0.5rem;">[ ${block.code} ]</span>
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
        ? `<span class="bracket-tag emerald">[ CONCLUÍDO • 100% ]</span>`
        : prog.completedCount > 0
        ? `<span class="bracket-tag amber">[ EM ESTUDO • ${prog.percentage}% ]</span>`
        : `<span class="bracket-tag amber">[ DISPONÍVEL ]</span>`
      : `<span class="bracket-tag">[ EM CONSTRUÇÃO ]</span>`;

    const stepSegments = STEP_KEYS.map(
      (k) => `<div class="mini-step-segment ${modSteps[k] ? "done" : ""}" title="${STEP_LABELS[k]}"></div>`
    ).join("");

    return `
      <article class="module-card ${m.unlocked ? "unlocked" : "locked"}" onclick="openModuleReader(${m.id})">
        <div>
          <div class="module-card-top">
            <span class="bracket-tag dark">[ ${m.code} ]</span>
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
              ${m.unlocked ? "[ ACESSAR BANCADA DE ESTUDO → ]" : "[ VER ESCOPO DO MÓDULO ]"}
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

    if (sbCode) sbCode.textContent = `[ ${curMod.code} DE ${window.CODEX_DATA.modules.length} ]`;
    if (sbCh) sbCh.textContent = curMod.chapters.toUpperCase();
    if (sbTitle) sbTitle.textContent = curMod.title;
    if (sbStepsTitle) sbStepsTitle.textContent = `Seções do ${curMod.code}`;
    if (sbQuizzesLbl && curContent.quizzes) {
      sbQuizzesLbl.textContent = `03. Quizzes (${curContent.quizzes.length})`;
    }
    if (sbExerciciosLbl && curContent.exercicios) {
      sbExerciciosLbl.textContent = `04. Exercícios (${curContent.exercicios.length})`;
    }
    if (sbTocTitle) {
      sbTocTitle.textContent = `Unidades (${curMod.code})`;
    }
    if (sbTocList && curContent.unidades) {
      sbTocList.innerHTML = curContent.unidades
        .map(
          (u) => `
          <li>
            <a href="javascript:void(0)" class="sidebar-toc-link" onclick="selectModuleStep('aprendizado'); setTimeout(()=>scrollToStudyUnit('${u.id}'), 60);">
              ${u.title}
            </a>
          </li>
        `
        )
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
    list.innerHTML = window.CODEX_DATA.modules
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
     SEÇÃO 1: REVISÃO
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
        <span class="bracket-tag amber">[ ${curMod.code} • ETAPA 01 DE 04: REVISÃO E NIVELAMENTO ]</span>
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
        <span class="callout-tag">[ CHECKLIST DE PRONTIDÃO • ${curMod.code} (${curMod.chapters}) ]</span>
        <p style="margin-bottom:0.85rem;">Marque cada ponto abaixo conforme confirma sua compreensão antes de iniciar o Primeiro Contato:</p>
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
            ${isCompleted ? "[ ✓ SEÇÃO DE REVISÃO CONCLUÍDA ]" : "[ ETAPA ATUAL: REVISÃO ]"}
          </span>
          <p style="font-size:0.88rem;color:var(--ink-secondary);margin-top:0.35rem;">
            Ao concluir esta revisão, você avança 25% na barra de progresso do ${curMod.code}.
          </p>
        </div>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button class="btn-secondary-brutal" onclick="toggleStepCompleted('revisao', false)">
            ${isCompleted ? "[ DESMARCAR CONCLUSÃO ]" : "[ MARCAR COMO CONCLUÍDA ]"}
          </button>
          <button class="btn-primary-brutal" onclick="toggleStepCompleted('revisao', true)">
            [ CONCLUIR REVISÃO E IR PARA APRENDIZADO → ]
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
     SEÇÃO 2: PRIMEIRO CONTATO (APRENDIZADO + BANCADAS INTERATIVAS)
     ------------------------------------------------------------------------ */
  function renderAprendizadoPane() {
    const pane = document.getElementById("pane-aprendizado");
    if (!pane) return;
    const curMod = getCurrentModuleMeta();
    const curContent = getCurrentModuleContent();
    const unidades = curContent.unidades || [];
    const isCompleted = !!(state.completedSteps[curMod.id] && state.completedSteps[curMod.id].aprendizado);

    pane.innerHTML = `
      <div class="reading-intro-banner">
        <span class="bracket-tag amber">[ ${curMod.code} • ETAPA 02 DE 04: PRIMEIRO CONTATO & BANCADAS ALGORÍTMICAS ]</span>
        <h2>Estudo Aprofundado — ${curMod.title}</h2>
        <p>Cobertura integral e rigorosa de <strong>${curMod.chapters}</strong> (Cormen, Leiserson, Rivest e Stein), preservando todas as definições formais, teoremas, demonstrações, pseudocódigos e bancadas interativas.</p>
      </div>

      ${unidades
        .map(
          (u) => `
        <article class="study-unit-card" id="unit-card-${u.id}">
          <div class="unit-header">
            <div class="unit-meta">
              <span class="bracket-tag dark">[ ${u.code} ]</span>
              <span class="bracket-tag amber">[ LIVRO: ${u.pages} ]</span>
            </div>
            <h2 class="unit-title">${u.title}</h2>
          </div>
          <div class="prose-block">${renderMarkdown(u.content)}</div>
        </article>
      `
        )
        .join("")}

      <div class="section-completion-footer">
        <div>
          <span class="bracket-tag ${isCompleted ? "emerald" : "amber"}">
            ${isCompleted ? "[ ✓ APRENDIZADO CONCLUÍDO ]" : "[ ETAPA ATUAL: PRIMEIRO CONTATO (APRENDIZADO) ]"}
          </span>
          <p style="font-size:0.88rem;color:var(--ink-secondary);margin-top:0.35rem;">
            Após explorar os blocos de leitura e os simuladores interativos deste módulo, avance para os Quizzes comentados.
          </p>
        </div>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button class="btn-secondary-brutal" onclick="toggleStepCompleted('aprendizado', false)">
            ${isCompleted ? "[ DESMARCAR CONCLUSÃO ]" : "[ MARCAR COMO CONCLUÍDA ]"}
          </button>
          <button class="btn-primary-brutal" onclick="toggleStepCompleted('aprendizado', true)">
            [ CONCLUIR APRENDIZADO E IR PARA QUIZZES → ]
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
      const header = title ? `<span class="callout-tag">[ ${title.trim()} ]</span>` : `<span class="callout-tag">[ ${tag.toUpperCase()} ]</span>`;
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
        <span class="bracket-tag amber">[ ${curMod.code} • ETAPA 03 DE 04: VERIFICAÇÃO CONCEITUAL & GABARITO DIALÉTICO ]</span>
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
        <button class="btn-secondary-brutal" onclick="resetModuleQuizzes()">[ ↺ REINICIAR RESPOSTAS DESTE MÓDULO ]</button>
      </div>

      ${quizzes
        .map((q, idx) => {
          const chosenLetter = state.quizAnswers[q.id];
          const isAnswered = !!chosenLetter;

          return `
            <article class="quiz-card" id="quiz-card-${q.id}">
              <div class="quiz-card-header">
                <span class="bracket-tag dark">[ QUESTÃO ${String(idx + 1).padStart(2, "0")} • ${q.type.toUpperCase()} ]</span>
                <span class="bracket-tag amber">[ REF: ${q.reference} ]</span>
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
                  [ GABARITO COMENTADO ALTERNATIVA POR ALTERNATIVA — ${q.reference} ]
                </div>
                ${q.options
                  .map(
                    (opt) => `
                  <div class="commentary-Option-item">
                    <strong style="color:${opt.isCorrect ? "var(--accent-emerald-dark)" : "var(--accent-crimson)"};font-family:var(--font-mono);">
                      [${opt.letter}] ${opt.isCorrect ? "✓ CORRETA:" : "✗ INCORRETA:"}
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
            ${isCompleted ? "[ ✓ QUIZZES CONCLUÍDOS ]" : "[ ETAPA ATUAL: QUIZZES ]"}
          </span>
          <p style="font-size:0.88rem;color:var(--ink-secondary);margin-top:0.35rem;">
            Conclua a verificação conceitual para avançar para a última etapa do ${curMod.code}: Exercícios e Demonstrações.
          </p>
        </div>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button class="btn-secondary-brutal" onclick="toggleStepCompleted('quizzes', false)">
            ${isCompleted ? "[ DESMARCAR CONCLUSÃO ]" : "[ MARCAR COMO CONCLUÍDA ]"}
          </button>
          <button class="btn-primary-brutal" onclick="toggleStepCompleted('quizzes', true)">
            [ CONCLUIR QUIZZES E IR PARA EXERCÍCIOS → ]
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
    const nextMod = window.CODEX_DATA.modules.find((m) => m.id === curMod.id + 1);

    pane.innerHTML = `
      <div class="reading-intro-banner">
        <span class="bracket-tag amber">[ ${curMod.code} • ETAPA 04 DE 04: APLICAÇÃO PRÁTICA, PSEUDOCÓDIGO & DEMONSTRAÇÕES ]</span>
        <h2>Caderno de Exercícios e Problemas — ${curMod.chapters}</h2>
        <p>Resolva os ${exercicios.length} exercícios e problemas canônicos deste módulo. Utilize a bancada de rascunho em cada atividade (suas anotações ficam salvas automaticamente no navegador) e, em seguida, abra o <strong>Guia de Resposta e Demonstração Passo a Passo</strong> para confrontar sua solução com a resolução formal.</p>
      </div>

      ${exercicios
        .map((ex) => {
          const savedNote = state.exerciseNotes[ex.id] || "";
          const selfStatus = state.exerciseStatus[ex.id] || "";

          return `
            <article class="exercise-card" id="ex-card-${ex.id}">
              <div class="unit-meta">
                <span class="bracket-tag dark">[ ${ex.code} ]</span>
                <span class="bracket-tag amber">[ FONTE: ${ex.reference} ]</span>
              </div>
              <h3 class="unit-title" style="margin-top:0.5rem;">${ex.title}</h3>
              <div class="exercise-prompt prose-block">${ex.prompt}</div>

              <div class="exercise-workspace">
                <label style="display:block;font-family:var(--font-mono);font-size:0.73rem;font-weight:700;margin-bottom:0.4rem;">
                  [ SUA RESOLUÇÃO / RASCUNHO DE PSEUDOCÓDIGO E PROVA (SALVO AUTOMATICAMENTE) ]:
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
                  [ VER / OCULTAR GUIA DE RESPOSTA COMPLETO ]
                </button>
              </div>

              <div class="solution-guide-panel prose-block" id="sol-guide-${ex.id}">
                <div style="font-family:var(--font-mono);font-size:0.76rem;font-weight:700;color:var(--accent-emerald-dark);margin-bottom:0.75rem;border-bottom:1px solid var(--ink-primary);padding-bottom:0.4rem;">
                  [ GUIA DE RESPOSTA E DEMONSTRAÇÃO PASSO A PASSO • ${ex.reference} ]
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
            ${isCompleted ? `[ ✓ ${curMod.code} CONCLUÍDO ]` : `[ ETAPA FINAL DO ${curMod.code}: EXERCÍCIOS ]`}
          </span>
          <p style="font-size:0.88rem;color:var(--ink-secondary);margin-top:0.35rem;">
            Marque esta etapa como concluída para finalizar o ${curMod.code}!
          </p>
        </div>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button class="btn-secondary-brutal" onclick="switchCodexView('catalog')">
            [ ← VOLTAR À VISÃO GERAL ]
          </button>
          <button class="btn-primary-brutal" onclick="toggleStepCompleted('exercicios', false)">
            ${isCompleted ? "[ ✓ EXERCÍCIOS CONCLUÍDOS ]" : `[ ★ CONCLUIR EXERCÍCIOS (${curMod.code}) ]`}
          </button>
          ${
            nextMod && nextMod.unlocked
              ? `<button class="btn-primary-brutal" onclick="openModuleReader(${nextMod.id}, 'revisao')">
                  [ IR PARA ${nextMod.code} → ]
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

  window.toggleMobileSidebar = function (forceClose) {
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
  };

  /* ========================================================================
     INICIALIZAÇÃO GERAL AO CARREGAR O DOM
     ======================================================================== */
  document.addEventListener("DOMContentLoaded", function () {
    updateTomeHeroUI();
    renderCatalogModules();
    renderReaderView();
    window.switchCodexView(state.currentView || "home");
  });
})();
