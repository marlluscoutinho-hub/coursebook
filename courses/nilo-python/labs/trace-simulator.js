/* ==========================================================================
   COURSEBOOK — LABORATÓRIO DO CATÁLOGO: SIMULADOR DE TESTE DE MESA & LÓGICA
   id: "trace-simulator" | mobile: "full" | source: "catalog"
   ========================================================================== */

(function () {
  "use strict";

  window.COURSEBOOK_LABS = window.COURSEBOOK_LABS || {};

  window.COURSEBOOK_LABS["trace-simulator"] = {
    id: "trace-simulator",
    title: "Laboratório Interativo: Simulador de Teste de Mesa & Avaliador Lógico",
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
            <span class="workbench-title lab-title">Laboratório Interativo • Teste de Mesa &amp; Avaliador Booleano</span>
            <span class="bracket-tag amber">STEP-BY-STEP • VANILLA JS</span>
          </div>
          <div class="workbench-body">
            <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
              Simule a técnica de rastreamento manual (teste de mesa) e explore a álgebra booleana de curto-circuito em tempo real.
            </p>

            <!-- Abas do Laboratório -->
            <div style="display:flex;gap:0.5rem;margin-bottom:1rem;border-bottom:var(--border-thin);padding-bottom:0.5rem;">
              <button id="wb2-tab-trace" class="wb-btn primary btn-primary-brutal" style="font-size:0.8rem;padding:0.35rem 0.75rem;">
                1. Rastreamento (Teste de Mesa)
              </button>
              <button id="wb2-tab-logic" class="wb-btn btn-secondary-brutal" style="font-size:0.8rem;padding:0.35rem 0.75rem;">
                2. Avaliador Booleano &amp; Curto-Circuito
              </button>
            </div>

            <!-- PAINEL 1: TESTE DE MESA -->
            <div id="wb2-panel-trace">
              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;margin-bottom:1rem;background:var(--bg-paper);padding:0.75rem;border:var(--border-thin);">
                <label for="wb2-program-select" style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;">
                  PROGRAMA DO LIVRO:
                </label>
                <select id="wb2-program-select" style="padding:0.35rem 0.6rem;font-family:var(--font-mono);font-size:0.82rem;border:var(--border-strong);background:var(--bg-card);flex:1;min-width:220px;">
                  <option value="prog1" selected>Listagem 3.12: Cálculo de Aumento Salarial (salário e aumento)</option>
                  <option value="prog2">Exercício 3.9: Conversão de Tempo para Segundos</option>
                  <option value="prog3">Exercício 3.14: Aluguel de Carro (diárias e km rodado)</option>
                  <option value="prog4">Programa D: Troca de Variáveis com Auxiliar</option>
                </select>
                <button id="wb2-load-btn" class="wb-btn btn-secondary-brutal" style="padding:0.3rem 0.6rem;font-size:0.8rem;">Carregar</button>
              </div>

              <!-- Código e Passo Atual -->
              <div style="margin-bottom:1rem;">
                <label for="wb2-code-input" style="display:block;font-family:var(--font-mono);font-size:0.78rem;margin-bottom:0.35rem;font-weight:700;">
                  INSTRUÇÕES DO SCRIPT (Linha por linha):
                </label>
                <textarea id="wb2-code-input" rows="5" style="width:100%;box-sizing:border-box;padding:0.6rem;font-family:var(--font-mono);font-size:0.85rem;background:var(--bg-card);border:var(--border-strong);resize:vertical;"></textarea>
              </div>

              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem;">
                <button id="wb2-step-btn" class="wb-btn primary btn-primary-brutal" style="font-size:0.8rem;padding:0.4rem 0.8rem;">Executar Próxima Linha →</button>
                <button id="wb2-runall-btn" class="wb-btn btn-secondary-brutal" style="font-size:0.8rem;padding:0.4rem 0.8rem;">Executar Tudo ⏩</button>
                <button id="wb2-reset-btn" class="wb-btn btn-secondary-brutal" style="font-size:0.8rem;padding:0.4rem 0.8rem;">Reiniciar Rastreamento ↺</button>
              </div>

              <!-- Tabela de Teste de Mesa -->
              <div style="overflow-x:auto;margin-top:1rem;border:var(--border-strong);background:var(--bg-card);">
                <table style="width:100%;border-collapse:collapse;font-family:var(--font-mono);font-size:0.82rem;text-align:left;">
                  <thead>
                    <tr style="background:var(--bg-paper);border-bottom:var(--border-strong);">
                      <th style="padding:0.5rem 0.75rem;border-right:var(--border-thin);width:60px;">PASSO</th>
                      <th style="padding:0.5rem 0.75rem;border-right:var(--border-thin);">INSTRUÇÃO EXECUTADA</th>
                      <th style="padding:0.5rem 0.75rem;border-right:var(--border-thin);">VARIÁVEIS ALTERADAS</th>
                      <th style="padding:0.5rem 0.75rem;">ESTADO TOTAL DA MEMÓRIA</th>
                    </tr>
                  </thead>
                  <tbody id="wb2-trace-body">
                    <tr>
                      <td colspan="4" style="padding:1rem;text-align:center;color:var(--ink-secondary);">
                        Clique em "Executar Próxima Linha" para iniciar o teste de mesa.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- PAINEL 2: AVALIADOR BOOLEANO -->
            <div id="wb2-panel-logic" style="display:none;">
              <p style="font-size:0.85rem;color:var(--ink-secondary);margin-bottom:1rem;">
                Configure os valores verdade das variáveis e observe a avaliação lógica com destaque para o mecanismo de <strong>curto-circuito</strong> de Python.
              </p>

              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:0.75rem;margin-bottom:1rem;background:var(--bg-paper);padding:0.75rem;border:var(--border-thin);">
                <div>
                  <span style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;">Variável A:</span><br/>
                  <button id="wb2-btn-toggle-a" class="wb-btn primary btn-primary-brutal" style="margin-top:0.35rem;width:100%;font-size:0.8rem;">True</button>
                </div>
                <div>
                  <span style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;">Variável B:</span><br/>
                  <button id="wb2-btn-toggle-b" class="wb-btn btn-secondary-brutal" style="margin-top:0.35rem;width:100%;font-size:0.8rem;">False</button>
                </div>
                <div>
                  <span style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;">Variável C:</span><br/>
                  <button id="wb2-btn-toggle-c" class="wb-btn primary btn-primary-brutal" style="margin-top:0.35rem;width:100%;font-size:0.8rem;">True</button>
                </div>
                <div>
                  <span style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;">Variável D:</span><br/>
                  <button id="wb2-btn-toggle-d" class="wb-btn btn-secondary-brutal" style="margin-top:0.35rem;width:100%;font-size:0.8rem;">False</button>
                </div>
              </div>

              <!-- Expressões Prontas do Livro -->
              <div style="border:var(--border-thin);padding:0.75rem;background:var(--bg-card);margin-bottom:1rem;">
                <strong style="font-family:var(--font-mono);font-size:0.82rem;display:block;margin-bottom:0.5rem;">
                  EXPRESSÕES DO LIVRO (Capítulo 3):
                </strong>
                <div id="wb2-logic-results" style="display:flex;flex-direction:column;gap:0.5rem;">
                  <!-- Gerado dinamicamente -->
                </div>
              </div>
            </div>

          </div>
        </div>
      `;

      // Programas Pré-definidos
      const samplePrograms = {
        prog1: [
          "salario = 1500",
          "aumento = 5",
          "valor_aumento = salario * aumento / 100",
          "novo_salario = salario + valor_aumento",
          "aprovado = novo_salario > 1550"
        ].join("\n"),
        prog2: [
          "dias = 2",
          "horas = 4",
          "minutos = 40",
          "segundos = 15",
          "total_segundos = dias * 86400 + horas * 3600 + minutos * 60 + segundos"
        ].join("\n"),
        prog3: [
          "dias = 8",
          "km = 520.5",
          "custo_diarias = dias * 60",
          "custo_km = km * 0.15",
          "total_pagar = custo_diarias + custo_km"
        ].join("\n"),
        prog4: [
          "a = 10",
          "b = 25",
          "aux = a",
          "a = b",
          "b = aux"
        ].join("\n")
      };

      // Estado do Simulador
      let lines = [];
      let currentLineIndex = 0;
      let memory = {};
      let traceLog = [];

      const codeInput = mount.querySelector("#wb2-code-input");
      const programSelect = mount.querySelector("#wb2-program-select");
      const traceBody = mount.querySelector("#wb2-trace-body");

      function loadProgram(key) {
        codeInput.value = samplePrograms[key] || samplePrograms.prog1;
        resetTrace();
      }

      function resetTrace() {
        lines = codeInput.value.split("\n").map(l => l.trim()).filter(l => l.length > 0 && !l.startsWith("#"));
        currentLineIndex = 0;
        memory = {};
        traceLog = [];
        renderTraceTable();
      }

      function safeEvalLine(line, mem) {
        const eqIdx = line.indexOf("=");
        if (eqIdx === -1) return { varName: null, val: null, desc: "Expressão sem atribuição" };

        const varName = line.substring(0, eqIdx).trim();
        const expr = line.substring(eqIdx + 1).trim();

        // Cria contexto seguro com chaves da memória
        const keys = Object.keys(mem);
        const vals = keys.map(k => mem[k]);
        try {
          // Substitui operadores Python por JS
          let jsExpr = expr
            .replace(/\band\b/g, "&&")
            .replace(/\bor\b/g, "||")
            .replace(/\bnot\b/g, "!")
            .replace(/\bTrue\b/g, "true")
            .replace(/\bFalse\b/g, "false");

          const fn = new Function(...keys, "return " + jsExpr + ";");
          const res = fn(...vals);
          return { varName, val: res, expr };
        } catch (err) {
          return { varName, val: "[Erro de Avaliação]", expr, error: err.message };
        }
      }

      function executeNextLine() {
        if (currentLineIndex === 0 && lines.length === 0) {
          resetTrace();
        }
        if (currentLineIndex >= lines.length) {
          return;
        }

        const line = lines[currentLineIndex];
        const res = safeEvalLine(line, memory);

        if (res.varName) {
          memory[res.varName] = res.val;
        }

        traceLog.push({
          step: currentLineIndex + 1,
          line: line,
          changed: res.varName ? `${res.varName} = ${formatVal(res.val)}` : "-",
          snapshot: { ...memory }
        });

        currentLineIndex++;
        renderTraceTable();
      }

      function formatVal(v) {
        if (typeof v === "boolean") return v ? "True" : "False";
        if (typeof v === "number") return Number.isInteger(v) ? v.toString() : v.toFixed(2);
        if (typeof v === "string") return `"${v}"`;
        return String(v);
      }

      function renderTraceTable() {
        if (traceLog.length === 0) {
          traceBody.innerHTML = `
            <tr>
              <td colspan="4" style="padding:1rem;text-align:center;color:var(--ink-secondary);">
                Nenhum passo executado. Clique em "Executar Próxima Linha" para começar.
              </td>
            </tr>
          `;
          return;
        }

        let html = "";
        traceLog.forEach((item, idx) => {
          const isLatest = idx === traceLog.length - 1;
          const bg = isLatest ? "background:var(--bg-paper);font-weight:600;" : "";
          const memStr = Object.keys(item.snapshot).map(k => `${k}: ${formatVal(item.snapshot[k])}`).join(", ") || "(vazia)";

          html += `
            <tr style="${bg}border-bottom:var(--border-thin);">
              <td style="padding:0.45rem 0.75rem;border-right:var(--border-thin);font-family:var(--font-mono);">${item.step}</td>
              <td style="padding:0.45rem 0.75rem;border-right:var(--border-thin);font-family:var(--font-mono);color:var(--accent-red);">${escapeHtml(item.line)}</td>
              <td style="padding:0.45rem 0.75rem;border-right:var(--border-thin);font-family:var(--font-mono);color:var(--ink-primary);">${item.changed}</td>
              <td style="padding:0.45rem 0.75rem;font-family:var(--font-mono);color:var(--ink-secondary);">${memStr}</td>
            </tr>
          `;
        });

        traceBody.innerHTML = html;
      }

      function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }

      // Eventos Painel 1
      mount.querySelector("#wb2-load-btn").addEventListener("click", () => {
        loadProgram(programSelect.value);
      });
      mount.querySelector("#wb2-step-btn").addEventListener("click", executeNextLine);
      mount.querySelector("#wb2-runall-btn").addEventListener("click", () => {
        while (currentLineIndex < lines.length) {
          executeNextLine();
        }
      });
      mount.querySelector("#wb2-reset-btn").addEventListener("click", resetTrace);

      // PAINEL 2: LÓGICA BOOLEANA
      const logicState = { A: true, B: false, C: true, D: false };

      function updateLogicButtons() {
        ["A", "B", "C", "D"].forEach(v => {
          const btn = mount.querySelector(`#wb2-btn-toggle-${v.toLowerCase()}`);
          if (btn) {
            btn.textContent = logicState[v] ? "True" : "False";
            if (logicState[v]) {
              btn.className = "wb-btn primary btn-primary-brutal";
            } else {
              btn.className = "wb-btn btn-secondary-brutal";
            }
          }
        });
        evaluateLogicExpressions();
      }

      function evaluateLogicExpressions() {
        const A = logicState.A;
        const B = logicState.B;
        const C = logicState.C;
        const D = logicState.D;

        const exprs = [
          { label: "not A", val: !A, note: "Inversor unário simples" },
          { label: "A and B", val: A && B, note: A ? "Avaliou B (A foi True)" : "Curto-circuito: falso imediato em A" },
          { label: "A or B", val: A || B, note: A ? "Curto-circuito: verdadeiro imediato em A" : "Avaliou B (A foi False)" },
          { label: "A > B (Exercício 3.5)", val: (A ? 1 : 0) > (B ? 1 : 0), note: "Comparação booleana numérica (True=1, False=0)" },
          { label: "A and C or D", val: (A && C) || D, note: "and tem precedência mais alta que or" },
          { label: "not A or (B and C)", val: (!A) || (B && C), note: "not avaliado antes de or e and" },
          { label: "A or B and not C", val: A || (B && (!C)), note: "Equivalente a: A or (B and (not C))" }
        ];

        const container = mount.querySelector("#wb2-logic-results");
        if (!container) return;

        let html = "";
        exprs.forEach(e => {
          const resStr = e.val ? "True" : "False";
          const resColor = e.val ? "var(--accent-green, #107c41)" : "var(--accent-red, #d83b01)";

          html += `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:0.4rem 0.6rem;background:var(--bg-paper);border:var(--border-thin);font-family:var(--font-mono);font-size:0.82rem;">
              <div>
                <strong>${escapeHtml(e.label)}</strong>
                <span style="font-size:0.75rem;color:var(--ink-secondary);display:block;">${e.note}</span>
              </div>
              <span style="font-weight:700;color:${resColor};font-size:0.9rem;border:var(--border-thin);padding:0.15rem 0.45rem;background:var(--bg-card);">${resStr}</span>
            </div>
          `;
        });

        container.innerHTML = html;
      }

      ["A", "B", "C", "D"].forEach(v => {
        const btn = mount.querySelector(`#wb2-btn-toggle-${v.toLowerCase()}`);
        if (btn) {
          btn.addEventListener("click", () => {
            logicState[v] = !logicState[v];
            updateLogicButtons();
          });
        }
      });

      // Alternância de Abas
      const tabTrace = mount.querySelector("#wb2-tab-trace");
      const tabLogic = mount.querySelector("#wb2-tab-logic");
      const panelTrace = mount.querySelector("#wb2-panel-trace");
      const panelLogic = mount.querySelector("#wb2-panel-logic");

      tabTrace.addEventListener("click", () => {
        tabTrace.className = "wb-btn primary btn-primary-brutal";
        tabLogic.className = "wb-btn btn-secondary-brutal";
        panelTrace.style.display = "block";
        panelLogic.style.display = "none";
      });

      tabLogic.addEventListener("click", () => {
        tabLogic.className = "wb-btn primary btn-primary-brutal";
        tabTrace.className = "wb-btn btn-secondary-brutal";
        panelTrace.style.display = "none";
        panelLogic.style.display = "block";
        updateLogicButtons();
      });

      // Inicia com programa padrão
      loadProgram("prog1");
      updateLogicButtons();
    }
  };

  // Se montado sob demanda ou carregado em página aberta
  if (typeof document !== "undefined") {
    const el = document.getElementById("trace-simulator-mount");
    if (el) window.COURSEBOOK_LABS["trace-simulator"].init(el);
  }
})();
