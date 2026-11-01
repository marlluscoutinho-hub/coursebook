/* ==========================================================================
   COURSEBOOK — LABORATÓRIO DO CATÁLOGO: SIMULADOR REPL & MEMÓRIA VIRTUAL
   id: "repl-simulator" | mobile: "full" | source: "catalog"
   ========================================================================== */

(function () {
  "use strict";

  window.COURSEBOOK_LABS = window.COURSEBOOK_LABS || {};

  window.COURSEBOOK_LABS["repl-simulator"] = {
    id: "repl-simulator",
    title: "Laboratório Interativo: Simulador do Ciclo REPL & Memória Virtual",
    mobile: "full",
    init: function (mountElOrId) {
      const mount = typeof mountElOrId === "string"
        ? document.getElementById(mountElOrId) || document.getElementById("workbench-mod1-mount")
        : mountElOrId || document.getElementById("workbench-mod1-mount");

      if (!mount || mount.dataset.initialized === "true") return;
      mount.dataset.initialized = "true";

      mount.innerHTML = `
        <div class="workbench-box lab-box" style="margin-top:1.5rem;">
          <div class="workbench-header lab-header">
            <span class="workbench-title lab-title">Laboratório Interativo • Simulador do Ciclo REPL &amp; Memória Virtual</span>
            <span class="bracket-tag amber">STEP-BY-STEP • VANILLA JS</span>
          </div>
          <div class="workbench-body">
            <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
              Experimente o comportamento do interpretador interativo de Python. Selecione um exemplo do livro de Nilo Menezes ou digite suas próprias instruções para acompanhar a tokenização, a atualização da tabela de variáveis na memória e o console de saída.
            </p>

            <!-- Seletor de Programas Canônicos do Livro -->
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;margin-bottom:1rem;background:var(--bg-paper);padding:0.75rem;border:var(--border-thin);">
              <label for="wb1-program-select" style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;">
                PROGRAMAS DO LIVRO:
              </label>
              <select id="wb1-program-select" style="padding:0.35rem 0.6rem;font-family:var(--font-mono);font-size:0.82rem;border:var(--border-strong);background:var(--bg-card);flex:1;min-width:220px;">
                <option value="prog1">Listagem 1.1: Programa Olá Mundo (print('Oi'))</option>
                <option value="prog2">Listagem 2.1 a 2.6: Operações Aritméticas e Precedência</option>
                <option value="prog3" selected>Listagem 2.7: Primeiro Programa com Variáveis (a + b)</option>
                <option value="prog4">Listagem 2.11: Reajuste Salarial (1500 + 5%)</option>
                <option value="prog5">Exercício 2.2: Expressão Complexa de Precedência (81.0)</option>
                <option value="prog6">Exercício 2.6: Salário de R$ 750 com 15% de Aumento</option>
              </select>
              <button id="wb1-load-btn" class="wb-btn btn-secondary-brutal" style="padding:0.3rem 0.6rem;font-size:0.8rem;">Carregar</button>
            </div>

            <!-- Editor de Instruções -->
            <div style="margin-bottom:1rem;">
              <label for="wb1-code-input" style="display:block;font-family:var(--font-mono);font-size:0.78rem;margin-bottom:0.35rem;font-weight:700;">
                INSTRUÇÕES A EXECUTAR (Uma por linha):
              </label>
              <textarea id="wb1-code-input" rows="4" style="width:100%;box-sizing:border-box;padding:0.6rem;font-family:var(--font-mono);font-size:0.88rem;background:var(--bg-card);border:var(--border-strong);resize:vertical;"></textarea>
            </div>

            <!-- Controles de Execução -->
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem;">
              <button id="wb1-step-btn" class="wb-btn primary btn-primary-brutal" style="font-size:0.8rem;padding:0.4rem 0.8rem;">Executar Próxima Linha →</button>
              <button id="wb1-run-all-btn" class="wb-btn btn-secondary-brutal" style="font-size:0.8rem;padding:0.4rem 0.8rem;">Executar Tudo</button>
              <button id="wb1-reset-btn" class="wb-btn btn-secondary-brutal" style="font-size:0.8rem;padding:0.4rem 0.8rem;">Reiniciar Memória</button>
            </div>

            <!-- Painel Dividido: Memória (Tabela de Símbolos) e Console Virtual -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:0.75rem;margin-bottom:0.75rem;">
              
              <!-- Tabela de Variáveis na Memória -->
              <div style="background:var(--bg-card);border:var(--border-thin);padding:0.75rem;">
                <div style="font-family:var(--font-mono);font-size:0.75rem;font-weight:700;margin-bottom:0.5rem;border-bottom:var(--border-thin);padding-bottom:0.25rem;">
                  [ MEMÓRIA RAM • TABELA DE SÍMBOLOS ]
                </div>
                <div id="wb1-memory-view" style="font-family:var(--font-mono);font-size:0.82rem;min-height:90px;color:var(--ink-secondary);">
                  <em>Nenhuma variável alocada na memória.</em>
                </div>
              </div>

              <!-- Terminal Virtual de Saída -->
              <div style="background:var(--bg-terminal);color:#f0f0f0;border:var(--border-strong);padding:0.75rem;font-family:var(--font-mono);font-size:0.82rem;">
                <div style="color:var(--accent-amber);font-size:0.72rem;margin-bottom:0.5rem;border-bottom:1px solid #333;padding-bottom:0.25rem;">
                  [ CONSOLE DE SAÍDA DO USUÁRIO ]
                </div>
                <div id="wb1-terminal-view" style="min-height:90px;white-space:pre-wrap;line-height:1.4;">Python 3.4.0 (IDLE Interactive Shell)&#10;Digite uma instrução ou clique em Executar.&#10;</div>
              </div>
            </div>

            <!-- Log de Telemetria do Interpretador -->
            <div id="wb1-log" class="wb-log-panel" style="font-size:0.75rem;padding:0.6rem;background:var(--bg-terminal);color:var(--ink-on-dark);">
              [LOG] Interpretador pronto. Aguardando execução.
            </div>
          </div>
        </div>
      `;

      const EXAMPLES = {
        prog1: 'print("Oi")',
        prog2: "2 + 3\n5 - 3\n2 * 10\n20 / 4\n2 ** 3\n10 % 3",
        prog3: "a = 2\nb = 3\nprint(a + b)",
        prog4: "salário = 1500\naumento = 5\nprint(salário + (salário * aumento / 100))",
        prog5: "resultado = 10 % 3 * 10 ** 2 + 1 - 10 * 4 / 2\nprint(resultado)",
        prog6: "salário = 750\naumento = 15\nprint(salário + (salário * aumento / 100))"
      };

      const codeInput = document.getElementById("wb1-code-input");
      const programSelect = document.getElementById("wb1-program-select");
      const loadBtn = document.getElementById("wb1-load-btn");
      const stepBtn = document.getElementById("wb1-step-btn");
      const runAllBtn = document.getElementById("wb1-run-all-btn");
      const resetBtn = document.getElementById("wb1-reset-btn");
      const memoryView = document.getElementById("wb1-memory-view");
      const terminalView = document.getElementById("wb1-terminal-view");
      const logEl = document.getElementById("wb1-log");

      let memory = {};
      let lines = [];
      let currentLineIndex = 0;

      function loadSelectedProgram() {
        const selected = programSelect.value;
        if (EXAMPLES[selected]) {
          codeInput.value = EXAMPLES[selected];
          resetWorkbench();
          if (logEl) logEl.textContent = `[CARREGADO] ${programSelect.options[programSelect.selectedIndex].text}`;
        }
      }

      function resetWorkbench() {
        memory = {};
        lines = codeInput.value
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0 && !l.startsWith("#"));
        currentLineIndex = 0;
        updateMemoryDisplay();
        if (terminalView) {
          terminalView.textContent = "Python 3.4.0 (IDLE Interactive Shell)\n>>> \n";
        }
        if (logEl) logEl.textContent = `[RESET] Memória limpa. ${lines.length} instruções carregadas.`;
      }

      function updateMemoryDisplay() {
        if (!memoryView) return;
        const keys = Object.keys(memory);
        if (keys.length === 0) {
          memoryView.innerHTML = "<em>Nenhuma variável alocada na memória.</em>";
          return;
        }
        let html = '<table style="width:100%;border-collapse:collapse;font-size:0.8rem;">';
        html += '<tr style="border-bottom:1px solid #ddd;text-align:left;"><th style="padding:4px;">Nome</th><th style="padding:4px;">Tipo</th><th style="padding:4px;">Valor</th></tr>';
        keys.forEach((k) => {
          const val = memory[k];
          const typeStr = typeof val === "number" ? (Number.isInteger(val) ? "int" : "float") : typeof val;
          html += `<tr style="border-bottom:1px solid #eee;">
            <td style="padding:4px;font-weight:700;color:var(--ink-primary);">${k}</td>
            <td style="padding:4px;color:var(--accent-amber);">${typeStr}</td>
            <td style="padding:4px;color:var(--ink-primary);">${val}</td>
          </tr>`;
        });
        html += "</table>";
        memoryView.innerHTML = html;
      }

      function evaluateInstruction(line) {
        if (!line) return null;

        const printMatch = line.match(/^print\s*\((.*)\)$/);
        if (printMatch) {
          const expr = printMatch[1].trim();
          if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
            const text = expr.slice(1, -1);
            return { type: "print", output: text, raw: line };
          }
          const val = safeEvalWithMemory(expr);
          return { type: "print", output: String(val), raw: line };
        }

        const assignMatch = line.match(/^([a-zA-Z_áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-zA-Z0-9_áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]*)\s*=\s*(.+)$/);
        if (assignMatch) {
          const varName = assignMatch[1].trim();
          const expr = assignMatch[2].trim();
          const val = safeEvalWithMemory(expr);
          memory[varName] = val;
          return { type: "assign", varName, val, raw: line };
        }

        const val = safeEvalWithMemory(line);
        return { type: "expr", val, raw: line };
      }

      function safeEvalWithMemory(expression) {
        try {
          let sanitized = expression;
          const keys = Object.keys(memory).sort((a, b) => b.length - a.length);
          keys.forEach((k) => {
            const regex = new RegExp(`\\b${k}\\b`, "g");
            sanitized = sanitized.replace(regex, memory[k]);
          });

          sanitized = sanitized.replace(/(\d+(\.\d+)?)\s*\*\*\s*(\d+(\.\d+)?)/g, "Math.pow($1, $3)");
          // eslint-disable-next-line no-new-func
          const result = Function(`"use strict"; return (${sanitized});`)();
          return typeof result === "number" ? Math.round(result * 10000) / 10000 : result;
        } catch (err) {
          return `Erro: ${err.message}`;
        }
      }

      function executeNextStep() {
        if (lines.length === 0) {
          resetWorkbench();
        }
        if (currentLineIndex >= lines.length) {
          if (logEl) logEl.textContent = "[FIM] Todas as instruções do programa foram executadas.";
          return;
        }

        const line = lines[currentLineIndex];
        const result = evaluateInstruction(line);
        currentLineIndex++;

        if (terminalView) {
          terminalView.textContent += `>>> ${line}\n`;
          if (result && result.type === "print") {
            terminalView.textContent += `${result.output}\n`;
          } else if (result && result.type === "expr" && result.val !== undefined) {
            terminalView.textContent += `${result.val}\n`;
          }
          terminalView.scrollTop = terminalView.scrollHeight;
        }

        updateMemoryDisplay();
        if (logEl) {
          if (result && result.type === "assign") {
            logEl.textContent = `[LINHA ${currentLineIndex}] Atribuição: Variável "${result.varName}" recebeu o valor ${result.val}.`;
          } else if (result && result.type === "print") {
            logEl.textContent = `[LINHA ${currentLineIndex}] Saída em tela: "${result.output}".`;
          } else {
            logEl.textContent = `[LINHA ${currentLineIndex}] Executada instrução: "${line}".`;
          }
        }
      }

      function executeAllSteps() {
        resetWorkbench();
        while (currentLineIndex < lines.length) {
          executeNextStep();
        }
      }

      if (loadBtn) loadBtn.onclick = loadSelectedProgram;
      if (stepBtn) stepBtn.onclick = executeNextStep;
      if (runAllBtn) runAllBtn.onclick = executeAllSteps;
      if (resetBtn) resetBtn.onclick = resetWorkbench;

      loadSelectedProgram();
    }
  };
})();
