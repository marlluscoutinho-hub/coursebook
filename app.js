/* ==========================================================================
   coursebook — Motor Interativo da Aplicação Web (Início + Visão Geral + Bancada)
   Persistência em localStorage, Progresso por Módulo e Geral, Simuladores CLRS
   ========================================================================== */

(function () {
  const STORAGE_KEY = "coursebook_clrs_course_state_v1";

  const STEP_KEYS = ["revisao", "aprendizado", "quizzes", "exercicios"];
  const STEP_LABELS = {
    revisao: "Revisão",
    aprendizado: "Primeiro Contato",
    quizzes: "Quizzes",
    exercicios: "Exercícios"
  };

  /* Estado persistente padrão */
  const defaultState = {
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
    exerciseStatus: {}
  };

  let state = loadState();

  function loadState() {
    try {
      const raw =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem("lurvro_clrs_course_state_v1") ||
        localStorage.getItem("codex_clrs_course_state_v1");
      if (!raw) return JSON.parse(JSON.stringify(defaultState));
      const parsed = JSON.parse(raw);
      return {
        ...defaultState,
        ...parsed,
        currentView: ["home", "catalog", "reader"].includes(parsed.currentView) ? parsed.currentView : "home",
        completedSteps: {
          ...defaultState.completedSteps,
          ...(parsed.completedSteps || {})
        }
      };
    } catch (e) {
      return JSON.parse(JSON.stringify(defaultState));
    }
  }

  function saveState() {
    try {
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

  function updateAllProgressIndicators() {
    const globalProg = getGlobalCourseProgress();
    const curMod = getCurrentModuleMeta();
    const curModProg = getModuleProgress(curMod.id);
    const unlockedCount = window.CODEX_DATA.modules.filter((m) => m.unlocked).length;

    // Topbar
    const globalBar = document.getElementById("topbar-global-fill");
    const globalPct = document.getElementById("topbar-global-pct");
    const globalLabel = document.getElementById("topbar-global-label");
    if (globalBar) globalBar.style.width = `${globalProg.percentage}%`;
    if (globalPct) globalPct.textContent = `${globalProg.percentage}%`;
    if (globalLabel) {
      globalLabel.textContent = `CURSO: ${globalProg.completedCourseSteps}/${globalProg.totalCourseSteps} ETAPAS`;
    }

    // Home Course Card (Página Inicial)
    const homeCourseFill = document.getElementById("home-course-fill");
    const homeCoursePctText = document.getElementById("home-course-pct-text");
    const homeMod1MiniPct = document.getElementById("home-mod1-mini-pct");
    const homeStatusTag = document.getElementById("home-course-status-tag");
    if (homeCourseFill) homeCourseFill.style.width = `${globalProg.percentage}%`;
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
          : `[ ${unlockedCount}/16 MÓDULOS ATIVOS ]`;
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
    if (heroBuiltStat) heroBuiltStat.textContent = `${String(unlockedCount).padStart(2, "0")} / 16`;
    if (heroCompletedModsStat) heroCompletedModsStat.textContent = `${globalProg.completedModulesCount} / 16`;
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

    if (sbCode) sbCode.textContent = `[ ${curMod.code} DE 16 ]`;
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
          <div class="prose-block">${u.content}</div>
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

    if (curMod.id === 1) {
      initScaleWorkbench();
      initInsertionSortWorkbench();
      initMergeSortWorkbench();
    } else if (typeof curContent.initWorkbenches === "function") {
      curContent.initWorkbenches();
    }

    renderMathInContainer(pane);
  }

  window.scrollToStudyUnit = function (unitId) {
    const sb = document.getElementById("reader-sidebar");
    if (sb) sb.classList.remove("open");
    const el = document.getElementById(`unit-card-${unitId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /* ========================================================================
     BANCADA INTERATIVA #1: DUELO COMPUTADOR A vs. B & TABELA DO PROBLEMA 1-1
     ======================================================================== */
  function initScaleWorkbench() {
    const mount = document.getElementById("workbench-scale-mount");
    if (!mount) return;

    mount.innerHTML = `
      <div class="workbench-box">
        <div class="workbench-header">
          <span class="workbench-title">[ BANCADA INTERATIVA #01 • SIMULADOR DE ESCALA & PROBLEMA 1-1 (CAP. 1.2) ]</span>
          <span class="bracket-tag dark">c₁n² vs. c₂n lg n</span>
        </div>
        <div class="workbench-body">
          <p style="font-size:0.9rem;color:var(--ink-secondary);margin-bottom:1rem;">
            Ajuste o tamanho da entrada $n$ para comparar o <strong>Computador A</strong> ($10^{10}$ instr/s executando Ordenação por Inserção com $2n^2$ instruções) e o <strong>Computador B</strong> ($10^7$ instr/s — mil vezes mais lento — executando Ordenação por Intercalação com $50n \\lg n$ instruções):
          </p>
          <div class="workbench-controls">
            <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
              <label style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;">SELECIONE O TAMANHO DA ENTRADA (n):</label>
              <select id="scale-n-select" class="search-input-brutal" onchange="updateScaleSimulation()">
                <option value="100">n = 100 números</option>
                <option value="10000">n = 10.000 números</option>
                <option value="460000">n = 460.000 (Zona de Empate!)</option>
                <option value="1000000">n = 1.000.000 (1 milhão)</option>
                <option value="10000000" selected>n = 10.000.000 (10 milhões — Exemplo da p. 22)</option>
                <option value="100000000">n = 100.000.000 (100 milhões — Exemplo da p. 22)</option>
              </select>
            </div>
          </div>
          <div id="scale-sim-output" class="workbench-telemetry-strip"></div>

          <details style="margin-top:1rem;background:var(--bg-card);border:var(--border-thin);padding:0.85rem 1rem;">
            <summary style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;cursor:pointer;">
              [ + EXPANDIR TABELA COMPLETA RESOLVIDA DO PROBLEMA 1-1 (p. 23): MAIOR TAMANHO n RESOLVÍVEL EM TEMPO t ]
            </summary>
            <p style="font-size:0.84rem;color:var(--ink-secondary);margin:0.65rem 0;">
              Para cada função $f(n)$ em microssegundos ($10^{-6}\\text{ s}$), a tabela exibe o maior tamanho de problema $n$ que pode ser resolvido em cada intervalo de tempo:
            </p>
            <div class="canonical-table-wrap">
              <table class="canonical-table">
                <thead>
                  <tr>
                    <th>f(n) (µs)</th>
                    <th>1 segundo (10⁶ µs)</th>
                    <th>1 minuto (6·10⁷ µs)</th>
                    <th>1 hora (3,6·10⁹ µs)</th>
                    <th>1 dia (8,64·10¹⁰ µs)</th>
                    <th>1 mês (2,59·10¹² µs)</th>
                    <th>1 ano (3,15·10¹³ µs)</th>
                    <th>1 século (3,15·10¹⁵ µs)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>lg n</strong></td>
                    <td>2^(10⁶)</td>
                    <td>2^(6·10⁷)</td>
                    <td>2^(3,6·10⁹)</td>
                    <td>2^(8,64·10¹⁰)</td>
                    <td>2^(2,59·10¹²)</td>
                    <td>2^(3,15·10¹³)</td>
                    <td>2^(3,15·10¹⁵)</td>
                  </tr>
                  <tr>
                    <td><strong>√n</strong></td>
                    <td>10¹²</td>
                    <td>3,6 · 10¹⁵</td>
                    <td>1,30 · 10¹⁹</td>
                    <td>7,46 · 10²¹</td>
                    <td>6,72 · 10²⁴</td>
                    <td>9,95 · 10²⁶</td>
                    <td>9,95 · 10³⁰</td>
                  </tr>
                  <tr>
                    <td><strong>n</strong></td>
                    <td>10⁶</td>
                    <td>6 · 10⁷</td>
                    <td>3,6 · 10⁹</td>
                    <td>8,64 · 10¹⁰</td>
                    <td>2,59 · 10¹²</td>
                    <td>3,15 · 10¹³</td>
                    <td>3,15 · 10¹⁵</td>
                  </tr>
                  <tr>
                    <td><strong>n lg n</strong></td>
                    <td>62.746</td>
                    <td>2.801.417</td>
                    <td>1,33 · 10⁸</td>
                    <td>2,75 · 10⁹</td>
                    <td>7,18 · 10¹⁰</td>
                    <td>7,97 · 10¹¹</td>
                    <td>6,86 · 10¹³</td>
                  </tr>
                  <tr>
                    <td><strong>n²</strong></td>
                    <td>1.000</td>
                    <td>7.745</td>
                    <td>60.000</td>
                    <td>293.938</td>
                    <td>1.609.968</td>
                    <td>5.615.692</td>
                    <td>56.156.922</td>
                  </tr>
                  <tr>
                    <td><strong>n³</strong></td>
                    <td>100</td>
                    <td>391</td>
                    <td>1.532</td>
                    <td>4.420</td>
                    <td>13.736</td>
                    <td>31.593</td>
                    <td>146.645</td>
                  </tr>
                  <tr>
                    <td><strong>2ⁿ</strong></td>
                    <td>19</td>
                    <td>25</td>
                    <td>31</td>
                    <td>36</td>
                    <td>41</td>
                    <td>44</td>
                    <td>51</td>
                  </tr>
                  <tr>
                    <td><strong>n!</strong></td>
                    <td>9</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13</td>
                    <td>15</td>
                    <td>16</td>
                    <td>17</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </div>
    `;

    window.updateScaleSimulation();
  }

  function formatDurationSeconds(sec) {
    if (sec < 0.001) return `${(sec * 1e6).toFixed(1)} µs`;
    if (sec < 1) return `${(sec * 1000).toFixed(2)} ms`;
    if (sec < 60) return `${sec.toFixed(2)} segundos`;
    if (sec < 3600) return `${sec.toFixed(0)} s (~${(sec / 60).toFixed(1)} minutos)`;
    if (sec < 86400) return `${sec.toFixed(0)} s (~${(sec / 3600).toFixed(2)} horas)`;
    return `${(sec / 86400).toFixed(1)} dias (${(sec / 3600).toFixed(0)} horas)`;
  }

  window.updateScaleSimulation = function () {
    const sel = document.getElementById("scale-n-select");
    const out = document.getElementById("scale-sim-output");
    if (!sel || !out) return;
    const n = parseFloat(sel.value);
    const lgN = Math.log2(n);

    const instrA = 2 * n * n;
    const timeA = instrA / 1e10; // 10^10 instr/s

    const instrB = 50 * n * lgN;
    const timeB = instrB / 1e7; // 10^7 instr/s

    const ratio = timeA >= timeB ? `Computador B é ${(timeA / timeB).toFixed(1)}× mais rápido` : `Computador A é ${(timeB / timeA).toFixed(1)}× mais rápido`;

    out.innerHTML = `
      <div class="wb-stat-box">
        <span>COMPUTADOR A (INSERTION-SORT 2n²)</span>
        <strong style="color:var(--accent-crimson);">${formatDurationSeconds(timeA)}</strong>
        <span style="color:var(--ink-muted);">10¹⁰ instr/s • Fator n = ${n.toLocaleString("pt-BR")}</span>
      </div>
      <div class="wb-stat-box">
        <span>COMPUTADOR B (MERGE-SORT 50n lg n)</span>
        <strong style="color:var(--accent-emerald-dark);">${formatDurationSeconds(timeB)}</strong>
        <span style="color:var(--ink-muted);">10⁷ instr/s • Fator lg n ≈ ${lgN.toFixed(2)}</span>
      </div>
      <div class="wb-stat-box" style="background:var(--accent-amber-bg);border-color:var(--accent-amber-dark);">
        <span>VEREDITO EXPERIMENTAL</span>
        <strong style="color:var(--ink-primary);">${ratio}</strong>
        <span>Razão n / lg n = ${(n / lgN).toFixed(0)}×</span>
      </div>
    `;
  };

  /* ========================================================================
     BANCADA INTERATIVA #2: SIMULADOR PASSO A PASSO DE INSERTION-SORT(A)
     ======================================================================== */
  let insTrace = [];
  let insStepIdx = 0;
  let insTimer = null;

  function buildInsertionSortTrace(initialArr) {
    const A = initialArr.slice();
    const n = A.length;
    const steps = [];
    let totalComparisons = 0;
    let totalShifts = 0;

    steps.push({
      A: A.slice(),
      j: 2,
      i: 1,
      chave: A[1],
      comparingIdx: -1,
      sortedUpTo: 1,
      activeLine: 1,
      phase: "INICIALIZAÇÃO",
      comparisons: 0,
      shifts: 0,
      msg: `Inicialização antes da 1ª iteração (j = 2): O subarranjo A[1 .. 1] = ⟨${A[0]}⟩ contém 1 único elemento e satisfaz trivialmente o Invariante de Laço.`
    });

    for (let j = 2; j <= n; j++) {
      const chave = A[j - 1];
      let i = j - 1;

      steps.push({
        A: A.slice(),
        j,
        i,
        chave,
        comparingIdx: -1,
        sortedUpTo: j - 1,
        activeLine: 2,
        phase: `ITERAÇÃO j = ${j}`,
        comparisons: totalComparisons,
        shifts: totalShifts,
        msg: `Início da iteração j = ${j}: Selecionamos a carta chave = A[${j}] = ${chave} para inseri-la na mão esquerda ordenada A[1 .. ${j - 1}] = ⟨${A.slice(0, j - 1).join(", ")}⟩.`
      });

      while (true) {
        totalComparisons++;
        if (i > 0 && A[i - 1] > chave) {
          steps.push({
            A: A.slice(),
            j,
            i,
            chave,
            comparingIdx: i,
            sortedUpTo: j - 1,
            activeLine: 5,
            phase: `COMPARA & DESLOCA (j=${j})`,
            comparisons: totalComparisons,
            shifts: totalShifts,
            msg: `Linha 5–6: i = ${i} > 0 e A[${i}] = ${A[i - 1]} > chave (${chave}). Deslocamos A[${i}] (${A[i - 1]}) uma posição para a direita (para A[${i + 1}]) e decrementamos i.`
          });
          A[i] = A[i - 1];
          totalShifts++;
          i = i - 1;
        } else {
          const reason =
            i === 0
              ? `i atingiu 0 (curto-circuito evita avaliar A[0]!)`
              : `A[${i}] = ${A[i - 1]} ≤ chave (${chave})`;
          steps.push({
            A: A.slice(),
            j,
            i,
            chave,
            comparingIdx: i > 0 ? i : -1,
            sortedUpTo: j - 1,
            activeLine: 5,
            phase: `FIM DO WHILE (j=${j})`,
            comparisons: totalComparisons,
            shifts: totalShifts,
            msg: `Linha 5: Teste do while encerra pois ${reason}. Encontramos a posição correta i + 1 = ${i + 1} para a chave ${chave}.`
          });
          break;
        }
      }

      A[i] = chave;
      steps.push({
        A: A.slice(),
        j,
        i,
        chave,
        comparingIdx: -1,
        sortedUpTo: j,
        activeLine: 8,
        phase: `MANUTENÇÃO (j=${j})`,
        comparisons: totalComparisons,
        shifts: totalShifts,
        msg: `Linha 8 (Manutenção do Invariante): A[${i + 1}] = chave (${chave}). Agora A[1 .. ${j}] = ⟨${A.slice(0, j).join(", ")}⟩ contém os elementos originais de A[1 .. ${j}] em sequência ordenada!`
      });
    }

    steps.push({
      A: A.slice(),
      j: n + 1,
      i: 0,
      chave: null,
      comparingIdx: -1,
      sortedUpTo: n,
      activeLine: 1,
      phase: "TÉRMINO (j = n + 1)",
      comparisons: totalComparisons,
      shifts: totalShifts,
      msg: `Término: O contador j atinge n + 1 = ${n + 1} (> A.comprimento). Pelo Invariante de Laço com j = n + 1, o subarranjo A[1 .. ${n}] = ⟨${A.join(", ")}⟩ está integralmente ordenado!`
    });

    return steps;
  }

  function initInsertionSortWorkbench() {
    const mount = document.getElementById("workbench-insertion-mount");
    if (!mount) return;

    mount.innerHTML = `
      <div class="workbench-box">
        <div class="workbench-header">
          <span class="workbench-title">[ BANCADA INTERATIVA #02 • SIMULADOR PASSO A PASSO DE INSERTION-SORT(A) ]</span>
          <span class="bracket-tag amber">FIGURA 2.2 & EXERCÍCIO 2.1-1</span>
        </div>
        <div class="workbench-body">
          <div class="workbench-controls">
            <div class="Preset-group">
              <button class="wb-btn" onclick="loadInsertionPreset([5, 2, 4, 6, 1, 3])">[ Fig. 2.2: ⟨5, 2, 4, 6, 1, 3⟩ ]</button>
              <button class="wb-btn" onclick="loadInsertionPreset([31, 41, 59, 26, 41, 58])">[ Ex. 2.1-1: ⟨31, 41, 59, 26, 41, 58⟩ ]</button>
              <button class="wb-btn" onclick="loadInsertionPreset([6, 5, 4, 3, 2, 1])">[ Pior Caso Θ(n²) ]</button>
              <button class="wb-btn" onclick="loadInsertionPreset([1, 2, 3, 4, 5, 6])">[ Melhor Caso Θ(n) ]</button>
            </div>
            <div class="step-btn-group">
              <button class="wb-btn" id="ins-prev-btn" onclick="stepInsertion(-1)">◀ Anterior</button>
              <button class="wb-btn primary" id="ins-play-btn" onclick="togglePlayInsertion()">▶ Executar</button>
              <button class="wb-btn" id="ins-next-btn" onclick="stepInsertion(1)">Próximo ▶</button>
              <button class="wb-btn" onclick="resetInsertion()">↺ Reiniciar</button>
            </div>
          </div>

          <div id="ins-array-stage" class="array-stage"></div>
          <div id="ins-telemetry" class="workbench-telemetry-strip"></div>
          <div id="ins-log" class="wb-log-panel"></div>
        </div>
      </div>
    `;

    window.loadInsertionPreset([5, 2, 4, 6, 1, 3]);
  }

  window.loadInsertionPreset = function (arr) {
    if (insTimer) {
      clearInterval(insTimer);
      insTimer = null;
    }
    insTrace = buildInsertionSortTrace(arr);
    insStepIdx = 0;
    renderInsertionStep();
  };

  window.stepInsertion = function (delta) {
    const next = insStepIdx + delta;
    if (next >= 0 && next < insTrace.length) {
      insStepIdx = next;
      renderInsertionStep();
    } else if (insTimer) {
      clearInterval(insTimer);
      insTimer = null;
      renderInsertionStep();
    }
  };

  window.resetInsertion = function () {
    if (insTimer) {
      clearInterval(insTimer);
      insTimer = null;
    }
    insStepIdx = 0;
    renderInsertionStep();
  };

  window.togglePlayInsertion = function () {
    if (insTimer) {
      clearInterval(insTimer);
      insTimer = null;
      renderInsertionStep();
      return;
    }
    if (insStepIdx >= insTrace.length - 1) {
      insStepIdx = 0;
    }
    insTimer = setInterval(() => {
      if (insStepIdx < insTrace.length - 1) {
        insStepIdx++;
        renderInsertionStep();
      } else {
        clearInterval(insTimer);
        insTimer = null;
        renderInsertionStep();
      }
    }, 850);
    renderInsertionStep();
  };

  function renderInsertionStep() {
    const step = insTrace[insStepIdx];
    if (!step) return;

    const stage = document.getElementById("ins-array-stage");
    const telemetry = document.getElementById("ins-telemetry");
    const log = document.getElementById("ins-log");
    const playBtn = document.getElementById("ins-play-btn");
    const prevBtn = document.getElementById("ins-prev-btn");
    const nextBtn = document.getElementById("ins-next-btn");

    if (playBtn) playBtn.textContent = insTimer ? "⏸ Pausar" : "▶ Executar";
    if (prevBtn) prevBtn.disabled = insStepIdx === 0;
    if (nextBtn) nextBtn.disabled = insStepIdx === insTrace.length - 1;

    if (stage) {
      stage.innerHTML = step.A.map((val, idx0) => {
        const idx1 = idx0 + 1;
        let cls = "array-cell";
        if (idx1 <= step.sortedUpTo) cls += " sorted-hand";
        if (idx1 === step.j && step.j <= step.A.length) cls += " active-key";
        if (idx1 === step.comparingIdx) cls += " comparing";

        let ptr = "";
        if (idx1 === step.j && idx1 === step.i) ptr = "i, j";
        else if (idx1 === step.j) ptr = "j (chave)";
        else if (idx1 === step.i) ptr = "i";

        return `
          <div class="array-cell-wrap">
            <span class="array-idx-label">A[${idx1}]</span>
            <div class="${cls}">${val}</div>
            <span class="array-pointer-tag">${ptr}</span>
          </div>
        `;
      }).join("");
    }

    if (telemetry) {
      telemetry.innerHTML = `
        <div class="wb-stat-box">
          <span>ETAPA DO INVARIANTE</span>
          <strong>${step.phase}</strong>
        </div>
        <div class="wb-stat-box">
          <span>VARIÁVEIS LOCAIS</span>
          <strong>j = ${step.j} | i = ${step.i} | chave = ${step.chave !== null ? step.chave : "—"}</strong>
        </div>
        <div class="wb-stat-box">
          <span>MÃO ORDENADA A[1 .. j-1]</span>
          <strong>A[1 .. ${step.sortedUpTo}]</strong>
        </div>
        <div class="wb-stat-box">
          <span>CUSTO ACUMULADO</span>
          <strong>${step.comparisons} comp. | ${step.shifts} desloc.</strong>
        </div>
      `;
    }

    if (log) {
      log.innerHTML = `[PASSO ${insStepIdx + 1}/${insTrace.length} • LINHA ${step.activeLine}] ${step.msg}`;
    }
  }

  /* ========================================================================
     BANCADA INTERATIVA #3: SIMULADOR DE MERGE(A, p, q, r) COM SENTINELAS ∞
     ======================================================================== */
  let mergeTrace = [];
  let mergeStepIdx = 0;

  function buildMergeTrace(leftPart, rightPart) {
    const L = [...leftPart, "∞"];
    const R = [...rightPart, "∞"];
    const total = leftPart.length + rightPart.length;
    const A = new Array(total).fill("·");
    const steps = [];

    let i = 0;
    let j = 0;

    steps.push({
      A: A.slice(),
      L: L.slice(),
      R: R.slice(),
      i: 1,
      j: 1,
      k: 1,
      msg: `Inicialização (k = p): Subarranjo de saída A está vazio (contém k - p = 0 menores elementos). L[1] = ${L[0]} e R[1] = ${R[0]} são os menores elementos não copiados, e L[${L.length}] = R[${R.length}] = ∞ são as cartas sentinelas.`
    });

    for (let k = 0; k < total; k++) {
      const lVal = L[i] === "∞" ? Infinity : L[i];
      const rVal = R[j] === "∞" ? Infinity : R[j];

      if (lVal <= rVal) {
        A[k] = L[i];
        const chosen = L[i];
        i++;
        steps.push({
          A: A.slice(),
          L: L.slice(),
          R: R.slice(),
          i: i + 1,
          j: j + 1,
          k: k + 2,
          msg: `Iteração k = ${k + 1}: Como L[${i}] (${chosen}) ≤ R[${j + 1}] (${R[j]}), copiamos L[${i}] = ${chosen} para A[${k + 1}] e avançamos i para ${i + 1}. A[1 .. ${k + 1}] contém os ${k + 1} menores elementos ordenados!`
        });
      } else {
        A[k] = R[j];
        const chosen = R[j];
        j++;
        steps.push({
          A: A.slice(),
          L: L.slice(),
          R: R.slice(),
          i: i + 1,
          j: j + 1,
          k: k + 2,
          msg: `Iteração k = ${k + 1}: Como L[${i + 1}] (${L[i]}) > R[${j}] (${chosen}), copiamos R[${j}] = ${chosen} para A[${k + 1}] e avançamos j para ${j + 1}. A[1 .. ${k + 1}] contém os ${k + 1} menores elementos ordenados!`
        });
      }
    }

    steps.push({
      A: A.slice(),
      L: L.slice(),
      R: R.slice(),
      i: i + 1,
      j: j + 1,
      k: total + 1,
      msg: `Término (k = r + 1 = ${total + 1}): Todos os ${total} elementos reais foram intercalados em A = ⟨${A.join(", ")}⟩, e os dois únicos elementos não copiados que restaram em L[${i + 1}] e R[${j + 1}] são as duas cartas sentinelas ∞!`
    });

    return steps;
  }

  function initMergeSortWorkbench() {
    const mount = document.getElementById("workbench-merge-mount");
    if (!mount) return;

    mount.innerHTML = `
      <div class="workbench-box">
        <div class="workbench-header">
          <span class="workbench-title">[ BANCADA INTERATIVA #03 • INTERCALAÇÃO MERGE(A, p, q, r) COM SENTINELAS ∞ ]</span>
          <span class="bracket-tag emerald">FIGURA 2.3 & EXERCÍCIO 2.3-1</span>
        </div>
        <div class="workbench-body">
          <div class="workbench-controls">
            <div class="Preset-group">
              <button class="wb-btn" onclick="loadMergePreset([2, 4, 5, 7], [1, 2, 3, 6])">[ Fig. 2.3: L=⟨2,4,5,7,∞⟩ e R=⟨1,2,3,6,∞⟩ ]</button>
              <button class="wb-btn" onclick="loadMergePreset([3, 26, 41, 52], [9, 38, 49, 57])">[ Ex. 2.3-1 Final: L=⟨3,26,41,52,∞⟩ e R=⟨9,38,49,57,∞⟩ ]</button>
            </div>
            <div class="step-btn-group">
              <button class="wb-btn" id="mrg-prev-btn" onclick="stepMerge(-1)">◀ Anterior</button>
              <button class="wb-btn primary" id="mrg-next-btn" onclick="stepMerge(1)">Próximo Passo ▶</button>
              <button class="wb-btn" onclick="stepMerge(-999)">↺ Reiniciar</button>
            </div>
          </div>

          <div id="merge-stage-box" style="background:var(--bg-card);border:var(--border-thin);padding:1.25rem;margin-bottom:1rem;"></div>
          <div id="merge-log-box" class="wb-log-panel"></div>
        </div>
      </div>
    `;

    window.loadMergePreset([2, 4, 5, 7], [1, 2, 3, 6]);
  }

  window.loadMergePreset = function (leftArr, rightArr) {
    mergeTrace = buildMergeTrace(leftArr, rightArr);
    mergeStepIdx = 0;
    renderMergeStep();
  };

  window.stepMerge = function (delta) {
    if (delta === -999) {
      mergeStepIdx = 0;
    } else {
      mergeStepIdx = Math.max(0, Math.min(mergeTrace.length - 1, mergeStepIdx + delta));
    }
    renderMergeStep();
  };

  function renderMergeStep() {
    const step = mergeTrace[mergeStepIdx];
    if (!step) return;

    const stage = document.getElementById("merge-stage-box");
    const log = document.getElementById("merge-log-box");
    const prevBtn = document.getElementById("mrg-prev-btn");
    const nextBtn = document.getElementById("mrg-next-btn");

    if (prevBtn) prevBtn.disabled = mergeStepIdx === 0;
    if (nextBtn) nextBtn.disabled = mergeStepIdx === mergeTrace.length - 1;

    const renderRow = (label, arr, activeIdx1, isOutput) => `
      <div style="margin-bottom:0.85rem;">
        <div style="font-family:var(--font-mono);font-size:0.75rem;font-weight:700;margin-bottom:0.35rem;">${label}</div>
        <div style="display:flex;flex-wrap:wrap;gap:0.45rem;">
          ${arr
            .map((v, idx0) => {
              const idx1 = idx0 + 1;
              let bg = "var(--bg-paper)";
              let color = "var(--ink-primary)";
              if (isOutput && v !== "·") {
                bg = "var(--accent-emerald-bg)";
              } else if (!isOutput && idx1 < activeIdx1) {
                bg = "#E5E0D5";
                color = "#888";
              } else if (!isOutput && idx1 === activeIdx1) {
                bg = "var(--accent-amber-bg)";
              }
              return `
                <div style="border:var(--border-thin);padding:0.4rem 0.65rem;min-width:44px;text-align:center;font-family:var(--font-mono);font-weight:700;background:${bg};color:${color};">
                  <div style="font-size:0.62rem;opacity:0.7;">[${idx1}]</div>
                  <div>${v}</div>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;

    if (stage) {
      stage.innerHTML = `
        ${renderRow(`Arranjo de Saída A[p .. r] (próximo k = ${step.k <= step.A.length ? step.k : "Fim"})`, step.A, step.k, true)}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
          ${renderRow(`Pilha Esquerda L[1 .. n₁+1] (topo i = ${step.i})`, step.L, step.i, false)}
          ${renderRow(`Pilha Direita R[1 .. n₂+1] (topo j = ${step.j})`, step.R, step.j, false)}
        </div>
      `;
    }

    if (log) {
      log.innerHTML = `[PASSO ${mergeStepIdx + 1}/${mergeTrace.length}] ${step.msg}`;
    }
  }

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

  window.toggleMobileSidebar = function () {
    const sb = document.getElementById("reader-sidebar");
    if (sb) sb.classList.toggle("open");
  };

  /* ========================================================================
     INICIALIZAÇÃO GERAL AO CARREGAR O DOM
     ======================================================================== */
  document.addEventListener("DOMContentLoaded", function () {
    renderCatalogModules();
    renderReaderView();
    window.switchCodexView(state.currentView || "home");
  });
})();
