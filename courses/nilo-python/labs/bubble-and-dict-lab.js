/* ==========================================================================
   COURSEBOOK — LABORATÓRIO DO CATÁLOGO: BUBBLE SORT & DICIONÁRIOS HASH
   id: "bubble-and-dict-lab" | mobile: "full" | source: "catalog"
   ========================================================================== */

(function () {
  "use strict";

  window.COURSEBOOK_LABS = window.COURSEBOOK_LABS || {};

  window.COURSEBOOK_LABS["bubble-and-dict-lab"] = {
    id: "bubble-and-dict-lab",
    title: "Laboratório Interativo: Bubble Sort & Mapeamentos Hash",
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
            <span class="workbench-title lab-title">Laboratório Interativo • Bubble Sort &amp; Dicionários Hash</span>
            <span class="bracket-tag amber">STEP-BY-STEP • VANILLA JS</span>
          </div>
          <div class="workbench-body">
            <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
              Simule a ordenação elementar por bolha (Bubble Sort) passo a passo e investigue as propriedades de busca em tempo constante $O(1)$ de tabelas hash (dicionários).
            </p>

            <!-- Abas do Laboratório -->
            <div style="display:flex;gap:0.5rem;margin-bottom:1rem;border-bottom:var(--border-thin);padding-bottom:0.5rem;">
              <button id="wb6-tab-bubble" class="wb-btn primary btn-primary-brutal" style="font-size:0.8rem;padding:0.35rem 0.75rem;">
                1. Bubble Sort (Listagem 6.44)
              </button>
              <button id="wb6-tab-dict" class="wb-btn btn-secondary-brutal" style="font-size:0.8rem;padding:0.35rem 0.75rem;">
                2. Dicionários &amp; Frequência (Ex 6.18)
              </button>
            </div>

            <!-- PAINEL 1: BUBBLE SORT -->
            <div id="wb6-panel-bubble">
              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;margin-bottom:1rem;background:var(--bg-paper);padding:0.75rem;border:var(--border-thin);">
                <label for="wb6-select-preset" style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;">
                  CASOS DO LIVRO:
                </label>
                <select id="wb6-select-preset" style="padding:0.35rem 0.6rem;font-family:var(--font-mono);font-size:0.82rem;border:var(--border-strong);background:var(--bg-card);flex:1;min-width:200px;">
                  <option value="p1" selected>Listagem 6.44: [7, 4, 3, 12, 8] (Desordenada)</option>
                  <option value="p2">Exercício 6.14: [1, 2, 3, 4, 5] (Já Ordenada - Melhor Caso)</option>
                  <option value="p3">Exercício 6.15: [3, 3, 1, 5, 4] (Com Elementos Iguais)</option>
                  <option value="p4">Exercício 6.16: [5, 4, 3, 2, 1] (Pior Caso Invertido)</option>
                </select>
                <div style="display:flex;align-items:center;gap:0.35rem;">
                  <label style="font-family:var(--font-mono);font-size:0.78rem;">Ordem:</label>
                  <select id="wb6-select-order" style="padding:0.3rem 0.5rem;font-family:var(--font-mono);font-size:0.8rem;border:var(--border-strong);background:var(--bg-card);">
                    <option value="asc" selected>Crescente (&gt;)</option>
                    <option value="desc">Decrescente (&lt;)</option>
                  </select>
                </div>
              </div>

              <!-- Controles de Execução do Bubble Sort -->
              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem;">
                <button id="wb6-btn-step" class="wb-btn primary btn-primary-brutal" style="font-size:0.8rem;padding:0.4rem 0.8rem;">
                  Comparar Próximo Par →
                </button>
                <button id="wb6-btn-runall" class="wb-btn btn-secondary-brutal" style="font-size:0.8rem;padding:0.4rem 0.8rem;">
                  Ordenar Lista Completa ⏩
                </button>
                <button id="wb6-btn-reset-bubble" class="wb-btn btn-secondary-brutal" style="font-size:0.8rem;padding:0.4rem 0.8rem;">
                  Reiniciar Lista ↺
                </button>
              </div>

              <!-- Representação Visual das Barras de Elementos -->
              <div style="border:var(--border-strong);background:var(--bg-card);padding:1rem;margin-bottom:1rem;">
                <div style="display:flex;justify-content:space-between;margin-bottom:0.75rem;">
                  <span id="wb6-bubble-status" style="font-family:var(--font-mono);font-size:0.82rem;font-weight:700;">
                    Status: Pronto para iniciar comparações.
                  </span>
                  <span id="wb6-bubble-stats" style="font-family:var(--font-mono);font-size:0.78rem;color:var(--ink-secondary);">
                    Passos: 0 | Trocas: 0
                  </span>
                </div>
                <div id="wb6-bars-container" style="display:flex;gap:0.75rem;align-items:flex-end;height:120px;padding:0.5rem;background:var(--bg-paper);border:var(--border-thin);">
                  <!-- Barras dinâmicas -->
                </div>
              </div>

              <!-- Log do Rastreamento -->
              <div id="wb6-bubble-log" style="background:#18181b;color:#a1a1aa;padding:0.6rem;font-family:var(--font-mono);font-size:0.78rem;max-height:130px;overflow-y:auto;border:var(--border-strong);">
                Aguardando início...
              </div>
            </div>

            <!-- PAINEL 2: DICIONÁRIOS HASH -->
            <div id="wb6-panel-dict" style="display:none;">
              <div style="background:var(--bg-paper);padding:0.75rem;border:var(--border-thin);margin-bottom:1rem;">
                <span style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;display:block;margin-bottom:0.35rem;">
                  CONTAGEM DE CARACTERES EM TEXTO (Exercício 6.18):
                </span>
                <p style="font-size:0.82rem;color:var(--ink-secondary);margin-bottom:0.6rem;">
                  Gere um dicionário em Python mapeando cada caractere para sua frequência absoluta na frase digitada:
                </p>
                <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                  <input type="text" id="wb6-input-phrase" value="O rato roeu a roupa do rei de Roma" style="flex:1;min-width:220px;padding:0.35rem 0.6rem;font-family:var(--font-mono);font-size:0.88rem;border:var(--border-strong);background:var(--bg-card);" />
                  <button id="wb6-btn-count-dict" class="wb-btn primary btn-primary-brutal" style="font-size:0.8rem;padding:0.35rem 0.75rem;">
                    Gerar Dicionário Hash
                  </button>
                </div>
              </div>

              <!-- Tabela Hash Visual -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
                <div style="border:var(--border-strong);background:var(--bg-card);padding:0.75rem;">
                  <strong style="display:block;font-family:var(--font-mono);font-size:0.8rem;margin-bottom:0.5rem;">
                    REPRESENTAÇÃO LITERAL EM PYTHON:
                  </strong>
                  <pre id="wb6-dict-literal" style="margin:0;padding:0.6rem;background:var(--bg-paper);border:var(--border-thin);font-family:var(--font-mono);font-size:0.82rem;overflow-x:auto;max-height:180px;"></pre>
                </div>

                <div style="border:var(--border-strong);background:var(--bg-card);padding:0.75rem;">
                  <strong style="display:block;font-family:var(--font-mono);font-size:0.8rem;margin-bottom:0.5rem;">
                    MAPEAMENTO TABELAR (CHAVE ➔ VALOR):
                  </strong>
                  <div id="wb6-dict-table-container" style="max-height:180px;overflow-y:auto;border:var(--border-thin);">
                    <table style="width:100%;border-collapse:collapse;font-family:var(--font-mono);font-size:0.78rem;">
                      <thead>
                        <tr style="background:var(--bg-paper);border-bottom:var(--border-thin);text-align:left;">
                          <th style="padding:0.3rem 0.5rem;border-right:var(--border-thin);">CHAVE (KEY)</th>
                          <th style="padding:0.3rem 0.5rem;border-right:var(--border-thin);">TIPO</th>
                          <th style="padding:0.3rem 0.5rem;">VALOR (FREQUÊNCIA)</th>
                        </tr>
                      </thead>
                      <tbody id="wb6-dict-table-body"></tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      `;

      // ESTADO DO BUBBLE SORT
      const presets = {
        p1: [7, 4, 3, 12, 8],
        p2: [1, 2, 3, 4, 5],
        p3: [3, 3, 1, 5, 4],
        p4: [5, 4, 3, 2, 1]
      };

      let list = [...presets.p1];
      let i = 0;
      let fim = list.length;
      let trocou = false;
      let totalComparacoes = 0;
      let totalTrocas = 0;
      let isSorted = false;
      let order = "asc"; // "asc" ou "desc"

      const barsContainer = mount.querySelector("#wb6-bars-container");
      const bubbleStatus = mount.querySelector("#wb6-bubble-status");
      const bubbleStats = mount.querySelector("#wb6-bubble-stats");
      const bubbleLog = mount.querySelector("#wb6-bubble-log");
      const selectPreset = mount.querySelector("#wb6-select-preset");
      const selectOrder = mount.querySelector("#wb6-select-order");

      function initBubble() {
        const key = selectPreset.value;
        list = [...presets[key]];
        order = selectOrder.value;
        i = 0;
        fim = list.length;
        trocou = false;
        totalComparacoes = 0;
        totalTrocas = 0;
        isSorted = false;
        bubbleStatus.textContent = `Status: Lista pronta com ${list.length} elementos.`;
        bubbleStats.textContent = `Comparações: 0 | Trocas: 0`;
        bubbleLog.textContent = `[Início] Lista inicial: [${list.join(", ")}]. Ordem: ${order === "asc" ? "Crescente" : "Decrescente"}.`;
        renderBars(-1, -1);
      }

      function renderBars(active1, active2) {
        const maxVal = Math.max(...list, 10);
        let html = "";
        list.forEach((val, idx) => {
          const isActive = idx === active1 || idx === active2;
          const bg = isActive ? "background:var(--accent-red);color:#ffffff;" : "background:var(--bg-card);color:var(--ink-primary);";
          const border = isActive ? "border:2px solid #000000;" : "border:var(--border-strong);";
          const hPct = Math.max((val / maxVal) * 100, 20);

          html += `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;">
              <span style="font-family:var(--font-mono);font-size:0.75rem;font-weight:700;margin-bottom:0.25rem;">${val}</span>
              <div style="${bg}${border}width:100%;height:${hPct}%;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease;">
                <span style="font-family:var(--font-mono);font-size:0.68rem;opacity:0.8;">[${idx}]</span>
              </div>
            </div>
          `;
        });
        barsContainer.innerHTML = html;
      }

      function logBubble(msg) {
        bubbleLog.innerHTML += `\n${msg}`;
        bubbleLog.scrollTop = bubbleLog.scrollHeight;
      }

      function stepBubble() {
        if (isSorted) return;

        if (fim <= 1) {
          isSorted = true;
          bubbleStatus.textContent = "Status: Lista perfeitamente ordenada!";
          bubbleStatus.style.color = "var(--accent-green, #107c41)";
          logBubble(`\n[FIM] Ordenação concluída. Nenhuma nova troca necessária.`);
          renderBars(-1, -1);
          return;
        }

        if (i < fim - 1) {
          totalComparacoes++;
          const valA = list[i];
          const valB = list[i + 1];
          const deveTrocar = order === "asc" ? valA > valB : valA < valB;

          renderBars(i, i + 1);

          if (deveTrocar) {
            totalTrocas++;
            list[i] = valB;
            list[i + 1] = valA;
            trocou = true;
            bubbleStatus.textContent = `Comparando [${i}] e [${i+1}]: ${valA} e ${valB} -> TROCA EFETUADA!`;
            logBubble(`Passo ${totalComparacoes}: Trocou L[${i}]=${valA} com L[${i+1}]=${valB} -> [${list.join(", ")}]`);
          } else {
            bubbleStatus.textContent = `Comparando [${i}] e [${i+1}]: ${valA} e ${valB} -> Ordem correta.`;
            logBubble(`Passo ${totalComparacoes}: L[${i}]=${valA} e L[${i+1}]=${valB} mantidos.`);
          }

          bubbleStats.textContent = `Comparações: ${totalComparacoes} | Trocas: ${totalTrocas}`;
          i++;
        } else {
          // Fim de uma rodada completa
          if (!trocou) {
            isSorted = true;
            bubbleStatus.textContent = "Status: Nenhuma troca na rodada -> Lista ordenada com sucesso!";
            bubbleStatus.style.color = "var(--accent-green, #107c41)";
            logBubble(`\n[Otimização] A flag 'trocou' permaneceu False. A lista já está ordenada!`);
            renderBars(-1, -1);
            return;
          }
          fim--;
          i = 0;
          trocou = false;
          logBubble(`-- Fim da rodada. Maior elemento fixado na posição ${fim}. Novo limite de busca: 0 até ${fim-1}. --`);
        }
      }

      mount.querySelector("#wb6-btn-step").addEventListener("click", stepBubble);
      mount.querySelector("#wb6-btn-runall").addEventListener("click", () => {
        let maxSteps = 1000;
        while (!isSorted && maxSteps > 0) {
          stepBubble();
          maxSteps--;
        }
        renderBars(-1, -1);
      });
      mount.querySelector("#wb6-btn-reset-bubble").addEventListener("click", initBubble);
      selectPreset.addEventListener("change", initBubble);
      selectOrder.addEventListener("change", initBubble);

      // PAINEL 2: DICIONÁRIOS HASH
      const inputPhrase = mount.querySelector("#wb6-input-phrase");
      const dictLiteral = mount.querySelector("#wb6-dict-literal");
      const dictTableBody = mount.querySelector("#wb6-dict-table-body");

      function generateCharFrequency(phrase) {
        let freq = {};
        for (let i = 0; i < phrase.length; i++) {
          const char = phrase[i];
          freq[char] = (freq[char] || 0) + 1;
        }

        // Formatação do Literal
        const formattedLines = Object.keys(freq).map(k => {
          const keyLabel = k === " " ? "' ' (espaço)" : JSON.stringify(k);
          return `    ${keyLabel}: ${freq[k]}`;
        });
        dictLiteral.textContent = "{\n" + formattedLines.join(",\n") + "\n}";

        // Tabela
        let tableRows = "";
        Object.keys(freq).forEach(k => {
          const displayKey = k === " " ? `<em>[espaço]</em>` : escapeHtml(k);
          tableRows += `
            <tr style="border-bottom:var(--border-thin);">
              <td style="padding:0.3rem 0.5rem;border-right:var(--border-thin);font-weight:700;">${displayKey}</td>
              <td style="padding:0.3rem 0.5rem;border-right:var(--border-thin);color:var(--ink-secondary);">&lt;class 'str'&gt;</td>
              <td style="padding:0.3rem 0.5rem;font-weight:700;color:var(--accent-red);">${freq[k]}</td>
            </tr>
          `;
        });
        dictTableBody.innerHTML = tableRows;
      }

      function escapeHtml(s) {
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }

      mount.querySelector("#wb6-btn-count-dict").addEventListener("click", () => {
        generateCharFrequency(inputPhrase.value);
      });

      // Alternância de Abas
      const tabBubble = mount.querySelector("#wb6-tab-bubble");
      const tabDict = mount.querySelector("#wb6-tab-dict");
      const panelBubble = mount.querySelector("#wb6-panel-bubble");
      const panelDict = mount.querySelector("#wb6-panel-dict");

      tabBubble.addEventListener("click", () => {
        tabBubble.className = "wb-btn primary btn-primary-brutal";
        tabDict.className = "wb-btn btn-secondary-brutal";
        panelBubble.style.display = "block";
        panelDict.style.display = "none";
      });

      tabDict.addEventListener("click", () => {
        tabDict.className = "wb-btn primary btn-primary-brutal";
        tabBubble.className = "wb-btn btn-secondary-brutal";
        panelBubble.style.display = "none";
        panelDict.style.display = "block";
        generateCharFrequency(inputPhrase.value);
      });

      initBubble();
      generateCharFrequency(inputPhrase.value);
    }
  };

  if (typeof document !== "undefined") {
    const el = document.getElementById("bubble-and-dict-lab-mount");
    if (el) window.COURSEBOOK_LABS["bubble-and-dict-lab"].init(el);
  }
})();
