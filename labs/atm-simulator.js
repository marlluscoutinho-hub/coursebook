/* ==========================================================================
   COURSEBOOK — LABORATÓRIO DO CATÁLOGO: SIMULADOR DE CAIXA ELETRÔNICO
   id: "atm-simulator" | mobile: "full" | source: "catalog"
   ========================================================================== */

(function () {
  "use strict";

  window.COURSEBOOK_LABS = window.COURSEBOOK_LABS || {};

  window.COURSEBOOK_LABS["atm-simulator"] = {
    id: "atm-simulator",
    title: "Laboratório Interativo: Simulador de Caixa Eletrônico & Laços while",
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
            <span class="workbench-title lab-title">Laboratório Interativo • Caixa Eletrônico &amp; Laços while</span>
            <span class="bracket-tag amber">STEP-BY-STEP • VANILLA JS</span>
          </div>
          <div class="workbench-body">
            <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
              Explore a execução detalhada do algoritmo guloso de dispensação de cédulas da <strong>Listagem 5.14</strong> de Nilo Menezes e a evolução patrimonial por juros compostos.
            </p>

            <!-- Abas do Laboratório -->
            <div style="display:flex;gap:0.5rem;margin-bottom:1rem;border-bottom:var(--border-thin);padding-bottom:0.5rem;">
              <button id="wb4-tab-atm" class="wb-btn primary btn-primary-brutal" style="font-size:0.8rem;padding:0.35rem 0.75rem;">
                1. Caixa Eletrônico (Listagem 5.14)
              </button>
              <button id="wb4-tab-poupança" class="wb-btn btn-secondary-brutal" style="font-size:0.8rem;padding:0.35rem 0.75rem;">
                2. Poupança &amp; Juros Compostos (Ex 5.11)
              </button>
            </div>

            <!-- PAINEL 1: CAIXA ELETRÔNICO -->
            <div id="wb4-panel-atm">
              <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;margin-bottom:1rem;background:var(--bg-paper);padding:0.75rem;border:var(--border-thin);">
                <label for="wb4-input-saque" style="font-family:var(--font-mono);font-size:0.82rem;font-weight:700;">
                  VALOR DO SAQUE (R$):
                </label>
                <input type="number" id="wb4-input-saque" value="384" min="1" max="10000" style="padding:0.35rem 0.6rem;font-family:var(--font-mono);font-size:0.88rem;border:var(--border-strong);background:var(--bg-card);width:110px;" />
                <button id="wb4-btn-preset-384" class="wb-btn btn-secondary-brutal" style="padding:0.3rem 0.5rem;font-size:0.75rem;">R$ 384 (Ex 5.16)</button>
                <button id="wb4-btn-preset-745" class="wb-btn btn-secondary-brutal" style="padding:0.3rem 0.5rem;font-size:0.75rem;">R$ 745</button>
                <button id="wb4-btn-preset-501" class="wb-btn btn-secondary-brutal" style="padding:0.3rem 0.5rem;font-size:0.75rem;">R$ 501</button>
              </div>

              <!-- Controles de Passo a Passo -->
              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem;">
                <button id="wb4-btn-step" class="wb-btn primary btn-primary-brutal" style="font-size:0.8rem;padding:0.4rem 0.8rem;">Próxima Iteração do while →</button>
                <button id="wb4-btn-runall" class="wb-btn btn-secondary-brutal" style="font-size:0.8rem;padding:0.4rem 0.8rem;">Dispensar Cédulas Imediatamente ⏩</button>
                <button id="wb4-btn-reset" class="wb-btn btn-secondary-brutal" style="font-size:0.8rem;padding:0.4rem 0.8rem;">Reiniciar Saque ↺</button>
              </div>

              <!-- Monitor de Estado da Memória -->
              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:0.5rem;margin-bottom:1rem;">
                <div style="padding:0.5rem;background:var(--bg-card);border:var(--border-thin);">
                  <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-secondary);display:block;">VALOR A PAGAR:</span>
                  <strong id="wb4-stat-atual" style="font-family:var(--font-mono);font-size:1.1rem;color:var(--accent-red);">R$ 384</strong>
                </div>
                <div style="padding:0.5rem;background:var(--bg-card);border:var(--border-thin);">
                  <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-secondary);display:block;">CÉDULA ATUAL:</span>
                  <strong id="wb4-stat-cedula" style="font-family:var(--font-mono);font-size:1.1rem;color:var(--ink-primary);">R$ 100</strong>
                </div>
                <div style="padding:0.5rem;background:var(--bg-card);border:var(--border-thin);">
                  <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-secondary);display:block;">TOTAL DE CÉDULAS:</span>
                  <strong id="wb4-stat-total-cedulas" style="font-family:var(--font-mono);font-size:1.1rem;color:var(--accent-green, #107c41);">0</strong>
                </div>
                <div style="padding:0.5rem;background:var(--bg-card);border:var(--border-thin);">
                  <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-secondary);display:block;">STATUS DO LAÇO:</span>
                  <strong id="wb4-stat-status" style="font-family:var(--font-mono);font-size:0.9rem;color:var(--ink-primary);">EM EXECUÇÃO</strong>
                </div>
              </div>

              <!-- Exibição Visual das Cédulas Dispensadas -->
              <div style="border:var(--border-strong);background:var(--bg-paper);padding:0.75rem;margin-bottom:1rem;">
                <span style="display:block;font-family:var(--font-mono);font-size:0.8rem;font-weight:700;margin-bottom:0.5rem;">
                  BANDEJA DE SAÍDA DE CÉDULAS:
                </span>
                <div id="wb4-tray" style="display:flex;flex-wrap:wrap;gap:0.5rem;min-height:50px;align-items:center;">
                  <span style="font-size:0.8rem;color:var(--ink-secondary);font-family:var(--font-mono);">Nenhuma cédula dispensada ainda.</span>
                </div>
              </div>

              <!-- Histórico de Transições -->
              <div style="overflow-x:auto;border:var(--border-thin);background:var(--bg-card);">
                <table style="width:100%;border-collapse:collapse;font-family:var(--font-mono);font-size:0.78rem;">
                  <thead>
                    <tr style="background:var(--bg-paper);border-bottom:var(--border-thin);text-align:left;">
                      <th style="padding:0.4rem 0.6rem;border-right:var(--border-thin);">PASSO</th>
                      <th style="padding:0.4rem 0.6rem;border-right:var(--border-thin);">TESTE (atual &gt;= cedula)</th>
                      <th style="padding:0.4rem 0.6rem;border-right:var(--border-thin);">AÇÃO COMPUTACIONAL</th>
                      <th style="padding:0.4rem 0.6rem;">NOVO VALOR A PAGAR</th>
                    </tr>
                  </thead>
                  <tbody id="wb4-history-body"></tbody>
                </table>
              </div>
            </div>

            <!-- PAINEL 2: POUPANÇA -->
            <div id="wb4-panel-poupança" style="display:none;">
              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:0.75rem;margin-bottom:1rem;background:var(--bg-paper);padding:0.75rem;border:var(--border-thin);">
                <div>
                  <label for="wb4-input-deposito" style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;display:block;margin-bottom:0.25rem;">Depósito Inicial (R$):</label>
                  <input type="number" id="wb4-input-deposito" value="1000" min="50" step="50" style="padding:0.35rem 0.5rem;font-family:var(--font-mono);font-size:0.85rem;border:var(--border-strong);background:var(--bg-card);width:100%;box-sizing:border-box;" />
                </div>
                <div>
                  <label for="wb4-input-taxa" style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;display:block;margin-bottom:0.25rem;">Taxa de Juros Mensal (%):</label>
                  <input type="number" id="wb4-input-taxa" value="1.0" min="0.1" max="15" step="0.1" style="padding:0.35rem 0.5rem;font-family:var(--font-mono);font-size:0.85rem;border:var(--border-strong);background:var(--bg-card);width:100%;box-sizing:border-box;" />
                </div>
                <div>
                  <label for="wb4-input-aporte" style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;display:block;margin-bottom:0.25rem;">Aporte Mensal (R$):</label>
                  <input type="number" id="wb4-input-aporte" value="100" min="0" step="25" style="padding:0.35rem 0.5rem;font-family:var(--font-mono);font-size:0.85rem;border:var(--border-strong);background:var(--bg-card);width:100%;box-sizing:border-box;" />
                </div>
              </div>

              <button id="wb4-btn-calc-poup" class="wb-btn primary btn-primary-brutal" style="font-size:0.8rem;padding:0.4rem 0.8rem;margin-bottom:1rem;">
                Simular 24 Meses de Acumulação 📊
              </button>

              <div id="wb4-poup-results" style="display:none;">
                <div style="padding:0.6rem;background:var(--bg-card);border:var(--border-thin);margin-bottom:1rem;font-family:var(--font-mono);font-size:0.85rem;">
                  <span id="wb4-poup-summary"></span>
                </div>
                <div style="max-height:260px;overflow-y:auto;border:var(--border-thin);">
                  <table style="width:100%;border-collapse:collapse;font-family:var(--font-mono);font-size:0.78rem;">
                    <thead>
                      <tr style="background:var(--bg-paper);border-bottom:var(--border-thin);text-align:left;">
                        <th style="padding:0.35rem 0.5rem;border-right:var(--border-thin);">MÊS</th>
                        <th style="padding:0.35rem 0.5rem;border-right:var(--border-thin);">SALDO ANTERIOR</th>
                        <th style="padding:0.35rem 0.5rem;border-right:var(--border-thin);">RENDIMENTO (JUROS)</th>
                        <th style="padding:0.35rem 0.5rem;border-right:var(--border-thin);">APORTE</th>
                        <th style="padding:0.35rem 0.5rem;">SALDO FINAL</th>
                      </tr>
                    </thead>
                    <tbody id="wb4-poup-table-body"></tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      `;

      // ESTADO DO CAIXA ELETRÔNICO
      let valorInicial = 384;
      let valorAtual = 384;
      const cedulasDisponiveis = [100, 50, 20, 10, 5, 1];
      let cedulaIndex = 0;
      let cedulasContadas = {};
      let passo = 0;
      let finished = false;
      let historyLog = [];

      const inputSaque = mount.querySelector("#wb4-input-saque");
      const statAtual = mount.querySelector("#wb4-stat-atual");
      const statCedula = mount.querySelector("#wb4-stat-cedula");
      const statTotalCedulas = mount.querySelector("#wb4-stat-total-cedulas");
      const statStatus = mount.querySelector("#wb4-stat-status");
      const tray = mount.querySelector("#wb4-tray");
      const historyBody = mount.querySelector("#wb4-history-body");

      function initATM(val) {
        valorInicial = val;
        valorAtual = val;
        cedulaIndex = 0;
        cedulasContadas = { 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 1: 0 };
        passo = 0;
        finished = false;
        historyLog = [];
        updateATMView();
      }

      function stepATM() {
        if (finished) return;

        passo++;
        const cedulaAtual = cedulasDisponiveis[cedulaIndex];

        if (valorAtual >= cedulaAtual) {
          valorAtual -= cedulaAtual;
          cedulasContadas[cedulaAtual]++;
          historyLog.push({
            passo: passo,
            teste: `${valorAtual + cedulaAtual} >= ${cedulaAtual} (True)`,
            acao: `Subtrai R$ ${cedulaAtual} e incrementa contador`,
            restante: `R$ ${valorAtual}`
          });
        } else {
          // Troca de cédula
          const anterior = cedulaAtual;
          cedulaIndex++;
          if (cedulaIndex >= cedulasDisponiveis.length || valorAtual === 0) {
            finished = true;
            historyLog.push({
              passo: passo,
              teste: `${valorAtual} >= ${anterior} (False)`,
              acao: `Encerrado: Dispensação completa`,
              restante: `R$ ${valorAtual}`
            });
          } else {
            const proxima = cedulasDisponiveis[cedulaIndex];
            historyLog.push({
              passo: passo,
              teste: `${valorAtual} >= ${anterior} (False)`,
              acao: `Troca cédula de R$ ${anterior} para R$ ${proxima}`,
              restante: `R$ ${valorAtual}`
            });
          }
        }

        if (valorAtual === 0) {
          finished = true;
        }

        updateATMView();
      }

      function updateATMView() {
        statAtual.textContent = `R$ ${valorAtual}`;
        statCedula.textContent = finished ? "CONCLUÍDO" : `R$ ${cedulasDisponiveis[cedulaIndex] || "-"}`;
        
        const total = Object.values(cedulasContadas).reduce((a, b) => a + b, 0);
        statTotalCedulas.textContent = total;
        statStatus.textContent = finished ? "SAQUE FINALIZADO (break)" : "EM EXECUÇÃO";
        statStatus.style.color = finished ? "var(--accent-green, #107c41)" : "var(--accent-red)";

        // Atualiza bandeja
        const items = [];
        cedulasDisponiveis.forEach(c => {
          if (cedulasContadas[c] > 0) {
            items.push(`
              <div style="padding:0.4rem 0.6rem;background:#18181b;color:#f4f4f5;border:var(--border-strong);font-family:var(--font-mono);font-size:0.8rem;display:flex;align-items:center;gap:0.4rem;">
                <span style="font-weight:700;color:#facc15;">R$ ${c}</span>
                <span style="font-size:0.75rem;background:#27272a;padding:0.1rem 0.35rem;border-radius:2px;">× ${cedulasContadas[c]}</span>
              </div>
            `);
          }
        });

        tray.innerHTML = items.length > 0 ? items.join("") : `<span style="font-size:0.8rem;color:var(--ink-secondary);font-family:var(--font-mono);">Nenhuma cédula dispensada ainda.</span>`;

        // Atualiza Histórico
        let rows = "";
        historyLog.forEach(h => {
          rows += `
            <tr style="border-bottom:var(--border-thin);">
              <td style="padding:0.35rem 0.6rem;border-right:var(--border-thin);font-weight:700;">#${h.passo}</td>
              <td style="padding:0.35rem 0.6rem;border-right:var(--border-thin);">${escapeHtml(h.teste)}</td>
              <td style="padding:0.35rem 0.6rem;border-right:var(--border-thin);color:var(--ink-primary);">${escapeHtml(h.acao)}</td>
              <td style="padding:0.35rem 0.6rem;font-weight:700;color:var(--accent-red);">${escapeHtml(h.restante)}</td>
            </tr>
          `;
        });
        historyBody.innerHTML = rows;
      }

      function escapeHtml(s) {
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }

      // Eventos ATM
      mount.querySelector("#wb4-btn-step").addEventListener("click", stepATM);
      mount.querySelector("#wb4-btn-runall").addEventListener("click", () => {
        let maxLoops = 200;
        while (!finished && maxLoops > 0) {
          stepATM();
          maxLoops--;
        }
      });
      mount.querySelector("#wb4-btn-reset").addEventListener("click", () => {
        const val = parseInt(inputSaque.value, 10) || 384;
        initATM(val);
      });

      mount.querySelector("#wb4-btn-preset-384").addEventListener("click", () => {
        inputSaque.value = "384";
        initATM(384);
      });
      mount.querySelector("#wb4-btn-preset-745").addEventListener("click", () => {
        inputSaque.value = "745";
        initATM(745);
      });
      mount.querySelector("#wb4-btn-preset-501").addEventListener("click", () => {
        inputSaque.value = "501";
        initATM(501);
      });

      // PAINEL 2: POUPANÇA
      mount.querySelector("#wb4-btn-calc-poup").addEventListener("click", () => {
        const depInicial = parseFloat(mount.querySelector("#wb4-input-deposito").value) || 1000;
        const taxa = (parseFloat(mount.querySelector("#wb4-input-taxa").value) || 1.0) / 100;
        const aporte = parseFloat(mount.querySelector("#wb4-input-aporte").value) || 0;

        let saldo = depInicial;
        let totalJuros = 0;
        let totalAportes = depInicial;
        let rows = "";

        for (let mes = 1; mes <= 24; mes++) {
          const saldoAnterior = saldo;
          const juros = saldoAnterior * taxa;
          totalJuros += juros;
          saldo = saldoAnterior + juros + aporte;
          totalAportes += aporte;

          rows += `
            <tr style="border-bottom:var(--border-thin);">
              <td style="padding:0.35rem 0.5rem;border-right:var(--border-thin);font-weight:700;">${mes}</td>
              <td style="padding:0.35rem 0.5rem;border-right:var(--border-thin);">R$ ${saldoAnterior.toFixed(2)}</td>
              <td style="padding:0.35rem 0.5rem;border-right:var(--border-thin);color:var(--accent-green, #107c41);">+ R$ ${juros.toFixed(2)}</td>
              <td style="padding:0.35rem 0.5rem;border-right:var(--border-thin);">+ R$ ${aporte.toFixed(2)}</td>
              <td style="padding:0.35rem 0.5rem;font-weight:700;">R$ ${saldo.toFixed(2)}</td>
            </tr>
          `;
        }

        mount.querySelector("#wb4-poup-table-body").innerHTML = rows;
        mount.querySelector("#wb4-poup-summary").innerHTML = `
          <strong>Resultados após 24 Meses (2 Anos):</strong><br/>
          • Total Investido do Bolso (Depósito + 24 Aportes): <strong>R$ ${totalAportes.toFixed(2)}</strong><br/>
          • Total Ganho Exclusivamente em Juros: <strong style="color:var(--accent-green, #107c41);">R$ ${totalJuros.toFixed(2)}</strong><br/>
          • Saldo Final Acumulado na Poupança: <strong>R$ ${saldo.toFixed(2)}</strong>
        `;
        mount.querySelector("#wb4-poup-results").style.display = "block";
      });

      // Abas
      const tabAtm = mount.querySelector("#wb4-tab-atm");
      const tabPoup = mount.querySelector("#wb4-tab-poupança");
      const panelAtm = mount.querySelector("#wb4-panel-atm");
      const panelPoup = mount.querySelector("#wb4-panel-poupança");

      tabAtm.addEventListener("click", () => {
        tabAtm.className = "wb-btn primary btn-primary-brutal";
        tabPoup.className = "wb-btn btn-secondary-brutal";
        panelAtm.style.display = "block";
        panelPoup.style.display = "none";
      });

      tabPoup.addEventListener("click", () => {
        tabPoup.className = "wb-btn primary btn-primary-brutal";
        tabAtm.className = "wb-btn btn-secondary-brutal";
        panelAtm.style.display = "none";
        panelPoup.style.display = "block";
      });

      initATM(384);
    }
  };

  if (typeof document !== "undefined") {
    const el = document.getElementById("atm-simulator-mount");
    if (el) window.COURSEBOOK_LABS["atm-simulator"].init(el);
  }
})();
