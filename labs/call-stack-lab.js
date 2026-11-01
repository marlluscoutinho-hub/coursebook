/* ==========================================================================
   COURSEBOOK — LABORATÓRIO DO CATÁLOGO: PILHA DE CHAMADAS & RECURSÃO
   id: "call-stack-lab" | mobile: "full" | source: "catalog"
   ========================================================================== */

(function () {
  "use strict";

  window.COURSEBOOK_LABS = window.COURSEBOOK_LABS || {};

  window.COURSEBOOK_LABS["call-stack-lab"] = {
    id: "call-stack-lab",
    title: "Laboratório Interativo: Pilha de Chamadas & Árvore Recursiva",
    mobile: "full",
    init: function (mountElOrId) {
      const mount = typeof mountElOrId === "string"
        ? document.getElementById(mountElOrId)
        : mountElOrId;

      if (!mount || mount.dataset.initialized === "true") return;
      mount.dataset.initialized = "true";

      mount.innerHTML = `
        <div class="workbench-box lab-box" style="margin-top:1.5rem;">
          <div class="workbench-header lab-header">
            <span class="workbench-title lab-title">Laboratório Interativo • Pilha de Chamadas &amp; Recursão</span>
            <span class="bracket-tag amber">STEP-BY-STEP • VANILLA JS</span>
          </div>
          <div class="workbench-body">
            <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
              Observe visualmente a alocação e desalocação dos <strong>quadros de ativação (stack frames)</strong> na memória do processo durante a execução de algoritmos recursivos canônicos do Capítulo 8.
            </p>

            <div class="workbench-tabs" role="tablist" style="display:flex;gap:0.5rem;margin-bottom:1rem;border-bottom:1px solid var(--border-color);padding-bottom:0.5rem;">
              <button class="workbench-tab active" data-tab="tab-stack-sim" style="font-family:var(--font-mono);font-size:0.8rem;padding:0.4rem 0.8rem;cursor:pointer;background:var(--paper-card);border:1px solid var(--border-color);color:var(--ink-primary);">1. Simulador da Pilha de Chamadas</button>
              <button class="workbench-tab" data-tab="tab-lambda-eval" style="font-family:var(--font-mono);font-size:0.8rem;padding:0.4rem 0.8rem;cursor:pointer;background:transparent;border:1px solid var(--border-color);color:var(--ink-secondary);">2. Funções Lambda &amp; Ordem Superior</button>
            </div>

            <!-- PAINEL 1: PILHA DE CHAMADAS -->
            <div id="tab-stack-sim" class="workbench-panel">
              <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;margin-bottom:1rem;">
                <label style="font-family:var(--font-mono);font-size:0.8rem;">Algoritmo:</label>
                <select id="cs-algo-select" style="padding:0.35rem;font-family:var(--font-mono);font-size:0.82rem;">
                  <option value="fatorial">Fatorial: n! (n = 4)</option>
                  <option value="fibonacci">Fibonacci: fib(4)</option>
                  <option value="mdc">MDC de Euclides: mdc(24, 9)</option>
                </select>
                <button id="cs-btn-reset" class="workbench-btn" style="padding:0.35rem 0.7rem;font-family:var(--font-mono);font-size:0.8rem;cursor:pointer;">Reiniciar</button>
                <button id="cs-btn-step" class="workbench-btn primary" style="padding:0.35rem 0.9rem;font-family:var(--font-mono);font-size:0.8rem;cursor:pointer;background:var(--accent);color:#fff;border:none;">Próximo Passo &rarr;</button>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;" class="responsive-lab-grid">
                <!-- Coluna Esquerda: Pilha de Execução Visual -->
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
                    <span style="font-family:var(--font-mono);font-size:0.78rem;font-weight:bold;text-transform:uppercase;color:var(--ink-secondary);">
                      Pilha de Execução (Stack Frames)
                    </span>
                    <span id="cs-stack-depth" style="font-family:var(--font-mono);font-size:0.75rem;color:var(--accent);">
                      Profundidade: 0
                    </span>
                  </div>
                  <div id="cs-stack-container" style="display:flex;flex-direction:column-reverse;gap:6px;min-height:220px;background:#111;padding:0.8rem;border-radius:4px;border:1px solid var(--border-color);justify-content:flex-start;">
                    <!-- Frames empilhados dinamicamente -->
                  </div>
                </div>

                <!-- Coluna Direita: Código-fonte Rastreado e Registro de Eventos -->
                <div>
                  <span style="font-family:var(--font-mono);font-size:0.78rem;font-weight:bold;text-transform:uppercase;color:var(--ink-secondary);display:block;margin-bottom:0.4rem;">
                    Linha em Execução &amp; Retorno
                  </span>
                  <pre id="cs-code-viewer" style="background:var(--paper-card);border:1px solid var(--border-color);padding:0.8rem;font-family:var(--font-mono);font-size:0.8rem;line-height:1.4;margin:0 0 0.8rem 0;"></pre>
                  
                  <div style="background:var(--paper-card);border:1px solid var(--border-color);padding:0.6rem;font-family:var(--font-mono);font-size:0.78rem;">
                    <div style="color:var(--ink-secondary);font-size:0.72rem;margin-bottom:0.2rem;">STATUS DA EXECUÇÃO:</div>
                    <div id="cs-status-text" style="color:var(--accent);font-weight:bold;">Pronto para iniciar.</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- PAINEL 2: LAMBDA & FUNÇÕES COMO PARÂMETROS -->
            <div id="tab-lambda-eval" class="workbench-panel" style="display:none;">
              <div style="margin-bottom:1rem;">
                <label style="font-family:var(--font-mono);font-size:0.8rem;display:block;margin-bottom:0.3rem;">Lista de Entrada:</label>
                <input id="lm-input-list" type="text" value="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" style="width:100%;padding:0.4rem;font-family:var(--font-mono);font-size:0.9rem;border:1px solid var(--border-color);background:var(--paper-card);color:var(--ink-primary);" />
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;" class="responsive-lab-grid">
                <div style="background:var(--paper-card);padding:0.8rem;border:1px solid var(--border-color);">
                  <div style="font-family:var(--font-mono);font-size:0.82rem;font-weight:bold;margin-bottom:0.6rem;color:var(--accent);">
                    Injeção de Função Predicado (Filtro)
                  </div>
                  <div style="display:flex;gap:0.4rem;align-items:center;margin-bottom:0.6rem;">
                    <span style="font-family:var(--font-mono);font-size:0.82rem;">lambda x:</span>
                    <input id="lm-filter-expr" type="text" value="x % 2 == 0" style="flex:1;padding:0.3rem;font-family:var(--font-mono);font-size:0.82rem;border:1px solid var(--border-color);" />
                    <button id="lm-btn-filter" class="workbench-btn" style="padding:0.3rem 0.6rem;font-family:var(--font-mono);font-size:0.8rem;cursor:pointer;">Filtrar</button>
                  </div>
                  <div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--ink-secondary);">
                    Resultado Filtrado: <strong id="lm-filter-res" style="color:#059669;font-size:0.9rem;">-</strong>
                  </div>
                </div>

                <div style="background:var(--paper-card);padding:0.8rem;border:1px solid var(--border-color);">
                  <div style="font-family:var(--font-mono);font-size:0.82rem;font-weight:bold;margin-bottom:0.6rem;color:var(--accent);">
                    Injeção de Função Transformadora (Mapeamento)
                  </div>
                  <div style="display:flex;gap:0.4rem;align-items:center;margin-bottom:0.6rem;">
                    <span style="font-family:var(--font-mono);font-size:0.82rem;">lambda x:</span>
                    <input id="lm-map-expr" type="text" value="x * 2" style="flex:1;padding:0.3rem;font-family:var(--font-mono);font-size:0.82rem;border:1px solid var(--border-color);" />
                    <button id="lm-btn-map" class="workbench-btn" style="padding:0.3rem 0.6rem;font-family:var(--font-mono);font-size:0.8rem;cursor:pointer;">Mapear</button>
                  </div>
                  <div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--ink-secondary);">
                    Resultado Mapeado: <strong id="lm-map-res" style="color:var(--accent);font-size:0.9rem;">-</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      `;

      // TAB NAVIGATION
      const tabBtns = mount.querySelectorAll(".workbench-tab");
      const panels = mount.querySelectorAll(".workbench-panel");
      tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          tabBtns.forEach(b => {
            b.classList.remove("active");
            b.style.background = "transparent";
            b.style.color = "var(--ink-secondary)";
          });
          panels.forEach(p => p.style.display = "none");

          btn.classList.add("active");
          btn.style.background = "var(--paper-card)";
          btn.style.color = "var(--ink-primary)";
          const targetId = btn.getAttribute("data-tab");
          const targetPanel = mount.querySelector("#" + targetId);
          if (targetPanel) targetPanel.style.display = "block";
        });
      });

      // --- LOGIC 1: CALL STACK SIMULATOR ---
      const algoSelect = mount.querySelector("#cs-algo-select");
      const btnReset = mount.querySelector("#cs-btn-reset");
      const btnStep = mount.querySelector("#cs-btn-step");
      const stackContainer = mount.querySelector("#cs-stack-container");
      const stackDepth = mount.querySelector("#cs-stack-depth");
      const codeViewer = mount.querySelector("#cs-code-viewer");
      const statusText = mount.querySelector("#cs-status-text");

      const ALGO_SCRIPTS = {
        fatorial: {
          code: `def fatorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * fatorial(n - 1)

fatorial(4)`,
          steps: [
            { type: "call", func: "fatorial(4)", vars: "n = 4", line: 1, desc: "Chamada inicial: aloca frame fatorial(4)." },
            { type: "call", func: "fatorial(3)", vars: "n = 3", line: 5, desc: "4 > 1: chamada recursiva n * fatorial(3)." },
            { type: "call", func: "fatorial(2)", vars: "n = 2", line: 5, desc: "3 > 1: chamada recursiva n * fatorial(2)." },
            { type: "call", func: "fatorial(1)", vars: "n = 1", line: 5, desc: "2 > 1: chamada recursiva n * fatorial(1)." },
            { type: "base", func: "fatorial(1)", vars: "n = 1", ret: 1, line: 3, desc: "Caso base atingido: n == 1 retorna 1 imediatamente." },
            { type: "return", func: "fatorial(2)", vars: "n = 2", ret: 2, line: 5, desc: "Desempilha: 2 * 1 = retorna 2 para fatorial(3)." },
            { type: "return", func: "fatorial(3)", vars: "n = 3", ret: 6, line: 5, desc: "Desempilha: 3 * 2 = retorna 6 para fatorial(4)." },
            { type: "return", func: "fatorial(4)", vars: "n = 4", ret: 24, line: 5, desc: "Desempilha: 4 * 6 = 24. Resultado final!" }
          ]
        },
        fibonacci: {
          code: `def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

fibonacci(4)`,
          steps: [
            { type: "call", func: "fib(4)", vars: "n = 4", line: 1, desc: "Chamada fib(4): avalia fib(3) + fib(2)." },
            { type: "call", func: "fib(3)", vars: "n = 3", line: 5, desc: "Avança ramo esquerdo: fib(3)." },
            { type: "call", func: "fib(2)", vars: "n = 2", line: 5, desc: "Avança ramo esquerdo: fib(2)." },
            { type: "call", func: "fib(1)", vars: "n = 1", line: 5, desc: "Chama fib(1)." },
            { type: "base", func: "fib(1)", vars: "n = 1", ret: 1, line: 3, desc: "Caso base: fib(1) retorna 1." },
            { type: "call", func: "fib(0)", vars: "n = 0", line: 5, desc: "Chama fib(0) para completar fib(2)." },
            { type: "base", func: "fib(0)", vars: "n = 0", ret: 0, line: 3, desc: "Caso base: fib(0) retorna 0." },
            { type: "return", func: "fib(2)", vars: "n = 2", ret: 1, line: 5, desc: "fib(2) = 1 + 0 = 1 retornado." },
            { type: "call", func: "fib(1)", vars: "n = 1", line: 5, desc: "Chama ramo direito de fib(3)." },
            { type: "base", func: "fib(1)", vars: "n = 1", ret: 1, line: 3, desc: "fib(1) retorna 1." },
            { type: "return", func: "fib(3)", vars: "n = 3", ret: 2, line: 5, desc: "fib(3) = 1 + 1 = 2 retornado para fib(4)." },
            { type: "return", func: "fib(4)", vars: "n = 4", ret: 3, line: 5, desc: "fib(4) = fib(3) + fib(2) = 2 + 1 = 3. Concluído!" }
          ]
        },
        mdc: {
          code: `def mdc(a, b):
    if b == 0:
        return a
    else:
        return mdc(b, a % b)

mdc(24, 9)`,
          steps: [
            { type: "call", func: "mdc(24, 9)", vars: "a = 24, b = 9", line: 1, desc: "Inicia mdc(24, 9). 24 % 9 = 6." },
            { type: "call", func: "mdc(9, 6)", vars: "a = 9, b = 6", line: 5, desc: "Chama recursiva com a=9, b=6. 9 % 6 = 3." },
            { type: "call", func: "mdc(6, 3)", vars: "a = 6, b = 3", line: 5, desc: "Chama recursiva com a=6, b=3. 6 % 3 = 0." },
            { type: "call", func: "mdc(3, 0)", vars: "a = 3, b = 0", line: 5, desc: "Chama com b = 0." },
            { type: "base", func: "mdc(3, 0)", vars: "a = 3, b = 0", ret: 3, line: 3, desc: "Caso base: b == 0. Retorna a = 3." },
            { type: "return", func: "mdc(6, 3)", vars: "a = 6, b = 3", ret: 3, line: 5, desc: "Desempilha: propaga retorno 3." },
            { type: "return", func: "mdc(9, 6)", vars: "a = 9, b = 6", ret: 3, line: 5, desc: "Desempilha: propaga retorno 3." },
            { type: "return", func: "mdc(24, 9)", vars: "a = 24, b = 9", ret: 3, line: 5, desc: "Desempilha final: MDC(24, 9) = 3!" }
          ]
        }
      };

      let currentAlgo = "fatorial";
      let stepIndex = -1;
      let stack = [];

      function renderStackUI() {
        stackContainer.innerHTML = "";
        stack.forEach((frame, idx) => {
          const el = document.createElement("div");
          el.style.padding = "6px 10px";
          el.style.border = "1px solid " + (idx === stack.length - 1 ? "#10b981" : "#444");
          el.style.background = idx === stack.length - 1 ? "#064e3b" : "#1f2937";
          el.style.borderRadius = "3px";
          el.style.color = "#fff";
          el.style.fontFamily = "var(--font-mono)";
          el.style.fontSize = "0.78rem";
          el.style.display = "flex";
          el.style.justifyContent = "space-between";

          el.innerHTML = `
            <span><strong>${frame.func}</strong> [${frame.vars}]</span>
            <span style="color:#93c5fd;">${frame.ret !== undefined ? `ret: ${frame.ret}` : "aguardando..."}</span>
          `;
          stackContainer.appendChild(el);
        });

        stackDepth.textContent = `Profundidade: ${stack.length}`;
      }

      function resetAlgo() {
        currentAlgo = algoSelect.value;
        stepIndex = -1;
        stack = [];
        codeViewer.textContent = ALGO_SCRIPTS[currentAlgo].code;
        statusText.textContent = "Pronto para iniciar. Clique em 'Próximo Passo'.";
        renderStackUI();
      }

      function nextStep() {
        const script = ALGO_SCRIPTS[currentAlgo];
        if (stepIndex + 1 >= script.steps.length) {
          statusText.textContent = "Execução concluída com sucesso!";
          return;
        }

        stepIndex++;
        const step = script.steps[stepIndex];
        statusText.textContent = `[Passo ${stepIndex + 1}/${script.steps.length}] ${step.desc}`;

        if (step.type === "call") {
          stack.push({ func: step.func, vars: step.vars });
        } else if (step.type === "base") {
          if (stack.length > 0) {
            stack[stack.length - 1].ret = step.ret;
          }
        } else if (step.type === "return") {
          stack.pop();
          if (stack.length > 0) {
            stack[stack.length - 1].ret = step.ret;
          }
        }

        renderStackUI();
      }

      algoSelect.addEventListener("change", resetAlgo);
      btnReset.addEventListener("click", resetAlgo);
      btnStep.addEventListener("click", nextStep);
      resetAlgo();

      // --- LOGIC 2: LAMBDA SANDBOX ---
      const elInputList = mount.querySelector("#lm-input-list");
      const elFilterExpr = mount.querySelector("#lm-filter-expr");
      const elBtnFilter = mount.querySelector("#lm-btn-filter");
      const elFilterRes = mount.querySelector("#lm-filter-res");
      const elMapExpr = mount.querySelector("#lm-map-expr");
      const elBtnMap = mount.querySelector("#lm-btn-map");
      const elMapRes = mount.querySelector("#lm-map-res");

      function parseList() {
        try {
          const raw = elInputList.value.trim();
          return JSON.parse(raw);
        } catch (e) {
          return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        }
      }

      elBtnFilter.addEventListener("click", () => {
        const arr = parseList();
        const expr = elFilterExpr.value.trim();
        try {
          const fn = new Function("x", `return Boolean(${expr});`);
          const res = arr.filter(fn);
          elFilterRes.textContent = JSON.stringify(res);
        } catch (e) {
          elFilterRes.textContent = "Erro na expressão lambda";
        }
      });

      elBtnMap.addEventListener("click", () => {
        const arr = parseList();
        const expr = elMapExpr.value.trim();
        try {
          const fn = new Function("x", `return ${expr};`);
          const res = arr.map(fn);
          elMapRes.textContent = JSON.stringify(res);
        } catch (e) {
          elMapRes.textContent = "Erro na expressão lambda";
        }
      });

      elBtnFilter.click();
      elBtnMap.click();
    }
  };
})();
