/* ==========================================================================
   COURSEBOOK — LABORATÓRIO DO CATÁLOGO: ESTRUTURAS DE DADOS (FILAS & PILHAS)
   id: "data-structures-lab" | mobile: "full" | source: "catalog"
   ========================================================================== */

(function () {
  "use strict";

  window.COURSEBOOK_LABS = window.COURSEBOOK_LABS || {};

  window.COURSEBOOK_LABS["data-structures-lab"] = {
    id: "data-structures-lab",
    title: "Laboratório Interativo: Estruturas de Dados (Filas FIFO & Pilhas LIFO)",
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
            <span class="workbench-title lab-title">Laboratório Interativo • Estruturas de Dados (FIFO &amp; LIFO)</span>
            <span class="bracket-tag amber">STEP-BY-STEP • VANILLA JS</span>
          </div>
          <div class="workbench-body">
            <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
              Experimente a dinâmica das estruturas de dados clássicas implementadas sobre listas em Python: Filas (FIFO via <code>pop(0)</code>) e Pilhas (LIFO via <code>pop()</code>).
            </p>

            <!-- Abas do Laboratório -->
            <div style="display:flex;gap:0.5rem;margin-bottom:1rem;border-bottom:var(--border-thin);padding-bottom:0.5rem;">
              <button id="wb5-tab-fifo" class="wb-btn primary btn-primary-brutal" style="font-size:0.8rem;padding:0.35rem 0.75rem;">
                1. Fila de Banco (FIFO: First In, First Out)
              </button>
              <button id="wb5-tab-lifo" class="wb-btn btn-secondary-brutal" style="font-size:0.8rem;padding:0.35rem 0.75rem;">
                2. Pilha &amp; Validador de Parênteses (LIFO)
              </button>
            </div>

            <!-- PAINEL 1: FILA FIFO -->
            <div id="wb5-panel-fifo">
              <div style="background:var(--bg-paper);padding:0.75rem;border:var(--border-thin);margin-bottom:1rem;">
                <span style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;display:block;margin-bottom:0.4rem;">
                  CONTROLE DE ATENDIMENTO BANCÁRIO (Listagem 6.21 &amp; Exercício 6.5):
                </span>
                <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
                  <button id="wb5-btn-enqueue" class="wb-btn primary btn-primary-brutal" style="font-size:0.8rem;padding:0.35rem 0.75rem;">
                    Chegada de Cliente (F) [append]
                  </button>
                  <button id="wb5-btn-dequeue" class="wb-btn btn-secondary-brutal" style="font-size:0.8rem;padding:0.35rem 0.75rem;">
                    Atender Cliente (A) [pop(0)]
                  </button>
                  <button id="wb5-btn-reset-fifo" class="wb-btn btn-secondary-brutal" style="font-size:0.8rem;padding:0.35rem 0.75rem;">
                    Reiniciar Fila ↺
                  </button>
                </div>

                <!-- Execução em Lote -->
                <div style="margin-top:0.75rem;display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
                  <label for="wb5-input-batch" style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;">
                    Comandos em Lote (ex: FFFAAAS):
                  </label>
                  <input type="text" id="wb5-input-batch" value="FFFAAA" style="padding:0.25rem 0.5rem;font-family:var(--font-mono);font-size:0.82rem;border:var(--border-strong);background:var(--bg-card);width:120px;" />
                  <button id="wb5-btn-exec-batch" class="wb-btn btn-secondary-brutal" style="padding:0.25rem 0.5rem;font-size:0.78rem;">Processar Lote</button>
                </div>
              </div>

              <!-- Visualização da Fila -->
              <div style="border:var(--border-strong);background:var(--bg-card);padding:0.85rem;margin-bottom:1rem;">
                <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
                  <span style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;">
                    VISUALIZAÇÃO DA FILA (ÍNDICE 0 = CABEÇA / INÍCIO):
                  </span>
                  <span id="wb5-fifo-count" style="font-family:var(--font-mono);font-size:0.8rem;color:var(--ink-secondary);">5 clientes aguardando</span>
                </div>

                <div id="wb5-fifo-container" style="display:flex;gap:0.5rem;align-items:center;overflow-x:auto;padding:0.5rem 0;min-height:60px;">
                  <!-- Elementos gerados dinamicamente -->
                </div>
              </div>

              <!-- Registro de Eventos da Fila -->
              <div style="padding:0.6rem;background:#18181b;color:#a1a1aa;border:var(--border-strong);font-family:var(--font-mono);font-size:0.82rem;max-height:140px;overflow-y:auto;" id="wb5-fifo-log">
                [Início] Fila inicializada com 5 clientes padrão (1 a 5).
              </div>
            </div>

            <!-- PAINEL 2: PILHA LIFO & PARÊNTESES -->
            <div id="wb5-panel-lifo" style="display:none;">
              <div style="background:var(--bg-paper);padding:0.75rem;border:var(--border-thin);margin-bottom:1rem;">
                <span style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;display:block;margin-bottom:0.4rem;">
                  VERIFICADOR DE PARÊNTESES BALANCEADOS (Exercício 6.7):
                </span>
                <p style="font-size:0.82rem;color:var(--ink-secondary);margin-bottom:0.6rem;">
                  Digite uma expressão algébrica ou cadeia de parênteses. A pilha armazena cada <code>(</code> aberto e desempilha ao encontrar <code>)</code>.
                </p>
                <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
                  <input type="text" id="wb5-input-expr" value="((2 + 3) * (5 - 1))" style="flex:1;min-width:200px;padding:0.35rem 0.6rem;font-family:var(--font-mono);font-size:0.88rem;border:var(--border-strong);background:var(--bg-card);" />
                  <button id="wb5-btn-verify-expr" class="wb-btn primary btn-primary-brutal" style="font-size:0.8rem;padding:0.35rem 0.75rem;">
                    Analisar Pilha Passo a Passo
                  </button>
                  <button id="wb5-btn-preset-err1" class="wb-btn btn-secondary-brutal" style="font-size:0.75rem;padding:0.3rem 0.5rem;">Exemplo Inválido: ())</button>
                  <button id="wb5-btn-preset-err2" class="wb-btn btn-secondary-brutal" style="font-size:0.75rem;padding:0.3rem 0.5rem;">Exemplo Inválido: (()()</button>
                </div>
              </div>

              <!-- Visualização da Pilha Vertical -->
              <div style="display:grid;grid-template-columns:1fr 2fr;gap:1rem;margin-bottom:1rem;">
                <div style="border:var(--border-strong);background:var(--bg-card);padding:0.75rem;">
                  <span style="display:block;font-family:var(--font-mono);font-size:0.78rem;font-weight:700;margin-bottom:0.5rem;text-align:center;">
                    ESTRUTURA DA PILHA (TOPO):
                  </span>
                  <div id="wb5-stack-view" style="display:flex;flex-direction:column-reverse;gap:0.35rem;min-height:160px;justify-content:flex-start;background:var(--bg-paper);border:var(--border-thin);padding:0.5rem;">
                    <!-- Elementos empilhados -->
                  </div>
                </div>

                <div style="border:var(--border-strong);background:var(--bg-card);padding:0.75rem;display:flex;flex-direction:column;">
                  <span style="display:block;font-family:var(--font-mono);font-size:0.78rem;font-weight:700;margin-bottom:0.5rem;">
                    DIAGNÓSTICO E TRAÇO DE ANÁLISE:
                  </span>
                  <div id="wb5-stack-result" style="padding:0.5rem;background:var(--bg-paper);border:var(--border-thin);margin-bottom:0.5rem;font-family:var(--font-mono);font-size:0.85rem;font-weight:700;">
                    Clique em "Analisar Pilha" para iniciar.
                  </div>
                  <div id="wb5-stack-log" style="flex:1;overflow-y:auto;font-family:var(--font-mono);font-size:0.78rem;background:#18181b;color:#a1a1aa;padding:0.5rem;max-height:120px;">
                    Aguardando expressão...
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      `;

      // ESTADO DA FILA (FIFO)
      let fila = [1, 2, 3, 4, 5];
      let ultimoCliente = 5;

      const fifoContainer = mount.querySelector("#wb5-fifo-container");
      const fifoCount = mount.querySelector("#wb5-fifo-count");
      const fifoLog = mount.querySelector("#wb5-fifo-log");

      function renderFIFO() {
        fifoCount.textContent = `${fila.length} cliente(s) aguardando`;
        if (fila.length === 0) {
          fifoContainer.innerHTML = `<span style="font-family:var(--font-mono);font-size:0.82rem;color:var(--ink-secondary);padding:0.5rem;">Fila vazia! Nenhum cliente aguardando atendimento.</span>`;
          return;
        }

        let html = "";
        fila.forEach((cli, idx) => {
          const isHead = idx === 0;
          const isTail = idx === fila.length - 1;
          const bg = isHead ? "background:var(--accent-green, #107c41);color:#ffffff;" : "background:var(--bg-paper);color:var(--ink-primary);";
          const tag = isHead ? '<span style="font-size:0.68rem;display:block;color:#bbf7d0;">PRÓXIMO</span>' : (isTail ? '<span style="font-size:0.68rem;display:block;color:var(--ink-secondary);">ÚLTIMO</span>' : '');

          html += `
            <div style="${bg}padding:0.5rem 0.75rem;border:var(--border-strong);font-family:var(--font-mono);text-align:center;min-width:65px;box-shadow:2px 2px 0px rgba(0,0,0,0.1);">
              <strong style="font-size:0.95rem;">#${cli}</strong>
              ${tag}
            </div>
          `;
          if (idx < fila.length - 1) {
            html += `<span style="font-family:var(--font-mono);color:var(--ink-secondary);font-size:0.85rem;">←</span>`;
          }
        });

        fifoContainer.innerHTML = html;
      }

      function logFIFO(msg) {
        fifoLog.innerHTML += `\n${msg}`;
        fifoLog.scrollTop = fifoLog.scrollHeight;
      }

      mount.querySelector("#wb5-btn-enqueue").addEventListener("click", () => {
        ultimoCliente++;
        fila.push(ultimoCliente);
        logFIFO(`[Chegada] Cliente #${ultimoCliente} entrou no fim da fila (append). Fila atual: [${fila.join(", ")}]`);
        renderFIFO();
      });

      mount.querySelector("#wb5-btn-dequeue").addEventListener("click", () => {
        if (fila.length === 0) {
          logFIFO(`[Aviso] Tentativa de atendimento em fila vazia! (Exercício 6.4: pop(0) em lista vazia geraria IndexError).`);
          return;
        }
        const atendido = fila.shift(); // pop(0)
        logFIFO(`[Atendimento] Cliente #${atendido} atendido no guichê (pop(0)). Fila restante: [${fila.join(", ")}]`);
        renderFIFO();
      });

      mount.querySelector("#wb5-btn-reset-fifo").addEventListener("click", () => {
        fila = [1, 2, 3, 4, 5];
        ultimoCliente = 5;
        fifoLog.textContent = `[Reset] Fila reiniciada com clientes [1, 2, 3, 4, 5].`;
        renderFIFO();
      });

      mount.querySelector("#wb5-btn-exec-batch").addEventListener("click", () => {
        const batch = (mount.querySelector("#wb5-input-batch").value || "").toUpperCase();
        logFIFO(`\n[Processamento em Lote]: Executando sequência "${batch}"...`);
        for (let i = 0; i < batch.length; i++) {
          const cmd = batch[i];
          if (cmd === "F") {
            ultimoCliente++;
            fila.push(ultimoCliente);
            logFIFO(`  Op '${cmd}': Cliente #${ultimoCliente} chegou à fila.`);
          } else if (cmd === "A") {
            if (fila.length > 0) {
              const atendido = fila.shift();
              logFIFO(`  Op '${cmd}': Cliente #${atendido} atendido.`);
            } else {
              logFIFO(`  Op '${cmd}': Fila vazia! Nenhum cliente a atender.`);
            }
          } else if (cmd === "S") {
            logFIFO(`  Op '${cmd}': Comando de saída detectado. Encerrando lote.`);
            break;
          }
        }
        renderFIFO();
      });

      // ESTADO DA PILHA (LIFO) E VALIDADOR DE PARÊNTESES
      const stackView = mount.querySelector("#wb5-stack-view");
      const stackResult = mount.querySelector("#wb5-stack-result");
      const stackLog = mount.querySelector("#wb5-stack-log");
      const inputExpr = mount.querySelector("#wb5-input-expr");

      function verifyParentheses(expr) {
        let pilha = [];
        let log = [];
        let erro = false;
        let motivoErro = "";

        for (let i = 0; i < expr.length; i++) {
          const char = expr[i];
          if (char === "(") {
            pilha.push("(");
            log.push(`Caractere '${char}' na pos ${i} -> Empilha '(' [Tamanho da pilha: ${pilha.length}]`);
          } else if (char === ")") {
            if (pilha.length > 0) {
              pilha.pop();
              log.push(`Caractere '${char}' na pos ${i} -> Desempilha '(' [Tamanho da pilha: ${pilha.length}]`);
            } else {
              erro = true;
              motivoErro = `Fechou ')' na posição ${i} sem nenhum '(' correspondente aberto na pilha!`;
              log.push(`ERRO na pos ${i}: tentativa de fechar ')' com pilha vazia!`);
              break;
            }
          }
        }

        if (!erro && pilha.length > 0) {
          erro = true;
          motivoErro = `A expressão terminou com ${pilha.length} parêntese(s) '(' abertos que nunca foram fechados!`;
          log.push(`ERRO final: sobrou(ram) ${pilha.length} '(' na pilha sem fechamento.`);
        }

        // Renderiza Pilha
        if (pilha.length === 0) {
          stackView.innerHTML = `<span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-secondary);text-align:center;padding:1rem;">(Pilha Vazia)</span>`;
        } else {
          stackView.innerHTML = pilha.map((item, idx) => `
            <div style="background:var(--accent-red);color:#ffffff;padding:0.35rem 0.5rem;font-family:var(--font-mono);font-size:0.85rem;border:var(--border-strong);text-align:center;">
              ( [Topo: ${idx}]
            </div>
          `).join("");
        }

        // Renderiza Resultado
        if (!erro) {
          stackResult.style.color = "var(--accent-green, #107c41)";
          stackResult.textContent = "OK! Expressão com parênteses balanceados com perfeição.";
        } else {
          stackResult.style.color = "var(--accent-red)";
          stackResult.textContent = `ERRO: ${motivoErro}`;
        }

        stackLog.innerHTML = log.map(l => `<div>${escapeHtml(l)}</div>`).join("");
      }

      function escapeHtml(s) {
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }

      mount.querySelector("#wb5-btn-verify-expr").addEventListener("click", () => {
        verifyParentheses(inputExpr.value);
      });
      mount.querySelector("#wb5-btn-preset-err1").addEventListener("click", () => {
        inputExpr.value = "(()) )";
        verifyParentheses(inputExpr.value);
      });
      mount.querySelector("#wb5-btn-preset-err2").addEventListener("click", () => {
        inputExpr.value = "(()()";
        verifyParentheses(inputExpr.value);
      });

      // Alternância de Abas
      const tabFifo = mount.querySelector("#wb5-tab-fifo");
      const tabLifo = mount.querySelector("#wb5-tab-lifo");
      const panelFifo = mount.querySelector("#wb5-panel-fifo");
      const panelLifo = mount.querySelector("#wb5-panel-lifo");

      tabFifo.addEventListener("click", () => {
        tabFifo.className = "wb-btn primary btn-primary-brutal";
        tabLifo.className = "wb-btn btn-secondary-brutal";
        panelFifo.style.display = "block";
        panelLifo.style.display = "none";
      });

      tabLifo.addEventListener("click", () => {
        tabLifo.className = "wb-btn primary btn-primary-brutal";
        tabFifo.className = "wb-btn btn-secondary-brutal";
        panelFifo.style.display = "none";
        panelLifo.style.display = "block";
        verifyParentheses(inputExpr.value);
      });

      renderFIFO();
    }
  };

  if (typeof document !== "undefined") {
    const el = document.getElementById("data-structures-lab-mount");
    if (el) window.COURSEBOOK_LABS["data-structures-lab"].init(el);
  }
})();
