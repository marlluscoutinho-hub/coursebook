/* ==========================================================================
   COURSEBOOK — LABORATÓRIO DO CATÁLOGO: SIMULADOR DE FLUXO DE DECISÃO
   id: "decision-flow" | mobile: "full" | source: "catalog"
   ========================================================================== */

(function () {
  "use strict";

  window.COURSEBOOK_LABS = window.COURSEBOOK_LABS || {};

  window.COURSEBOOK_LABS["decision-flow"] = {
    id: "decision-flow",
    title: "Laboratório Interativo: Árvore de Decisão & Desvios Condicionais",
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
            <span class="workbench-title lab-title">Laboratório Interativo • Árvore de Decisão &amp; Fluxo Condicional</span>
            <span class="bracket-tag amber">STEP-BY-STEP • VANILLA JS</span>
          </div>
          <div class="workbench-body">
            <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
              Simule graficamente como o interpretador Python avalia predicados lógicos e decide quais ramos de código (<code>if</code>, <code>elif</code>, <code>else</code>) devem ser executados ou ignorados.
            </p>

            <!-- Seletor de Cenários Canônicos -->
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;margin-bottom:1rem;background:var(--bg-paper);padding:0.75rem;border:var(--border-thin);">
              <label for="wb3-scenario-select" style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;">
                PROBLEMA CANÔNICO:
              </label>
              <select id="wb3-scenario-select" style="padding:0.35rem 0.6rem;font-family:var(--font-mono);font-size:0.82rem;border:var(--border-strong);background:var(--bg-card);flex:1;min-width:240px;">
                <option value="radar" selected>Exercício 4.2: Radar de Velocidade e Multa (Limite 80 km/h)</option>
                <option value="salario">Exercício 4.4: Escalonamento Salarial (&gt; R$ 1.250: 10% vs 15%)</option>
                <option value="viagem">Exercício 4.6: Passagem Rodoviária (Até 200 km: R$ 0,50 vs R$ 0,45)</option>
                <option value="energia">Exercício 4.10: Tarifas de Energia Elétrica com elif (R, C, I)</option>
              </select>
            </div>

            <!-- Painel de Entradas Interativas -->
            <div id="wb3-controls-container" style="background:var(--bg-card);border:var(--border-thin);padding:0.75rem;margin-bottom:1rem;">
              <!-- Gerado dinamicamente -->
            </div>

            <!-- Visualização da Árvore de Ramos de Decisão -->
            <div style="margin-bottom:1rem;">
              <span style="display:block;font-family:var(--font-mono);font-size:0.8rem;font-weight:700;margin-bottom:0.4rem;">
                DIAGRAMA DE RAMIFICAÇÃO (EXECUÇÃO DO INTERPRETADOR):
              </span>
              <div id="wb3-branch-view" style="display:flex;flex-direction:column;gap:0.5rem;">
                <!-- Blocos gerados dinamicamente -->
              </div>
            </div>

            <!-- Console de Saída do Script -->
            <div>
              <span style="display:block;font-family:var(--font-mono);font-size:0.78rem;font-weight:700;margin-bottom:0.35rem;">
                SAÍDA NO CONSOLE (STDOUT):
              </span>
              <pre id="wb3-console-output" style="margin:0;padding:0.75rem;background:#18181b;color:#a1a1aa;border:var(--border-strong);font-family:var(--font-mono);font-size:0.85rem;white-space:pre-wrap;"></pre>
            </div>

          </div>
        </div>
      `;

      const scenarioSelect = mount.querySelector("#wb3-scenario-select");
      const controlsContainer = mount.querySelector("#wb3-controls-container");
      const branchView = mount.querySelector("#wb3-branch-view");
      const consoleOutput = mount.querySelector("#wb3-console-output");

      let currentScenario = "radar";

      function renderControls() {
        if (currentScenario === "radar") {
          controlsContainer.innerHTML = `
            <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
              <label for="wb3-input-speed" style="font-family:var(--font-mono);font-size:0.82rem;font-weight:700;">
                Velocidade do Veículo (km/h):
              </label>
              <input type="range" id="wb3-input-speed" min="40" max="150" value="95" style="flex:1;min-width:180px;" />
              <span id="wb3-speed-val" style="font-family:var(--font-mono);font-weight:700;font-size:0.95rem;min-width:60px;">95 km/h</span>
            </div>
          `;
          const input = controlsContainer.querySelector("#wb3-input-speed");
          const valDisplay = controlsContainer.querySelector("#wb3-speed-val");
          input.addEventListener("input", () => {
            valDisplay.textContent = `${input.value} km/h`;
            evaluate();
          });
        } else if (currentScenario === "salario") {
          controlsContainer.innerHTML = `
            <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
              <label for="wb3-input-sal" style="font-family:var(--font-mono);font-size:0.82rem;font-weight:700;">
                Salário Atual (R$):
              </label>
              <input type="number" id="wb3-input-sal" value="1200" step="50" min="500" max="10000" style="padding:0.35rem 0.6rem;font-family:var(--font-mono);font-size:0.85rem;border:var(--border-strong);background:var(--bg-paper);width:140px;" />
            </div>
          `;
          controlsContainer.querySelector("#wb3-input-sal").addEventListener("input", evaluate);
        } else if (currentScenario === "viagem") {
          controlsContainer.innerHTML = `
            <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
              <label for="wb3-input-dist" style="font-family:var(--font-mono);font-size:0.82rem;font-weight:700;">
                Distância a Percorrer (km):
              </label>
              <input type="range" id="wb3-input-dist" min="20" max="600" value="250" style="flex:1;min-width:180px;" />
              <span id="wb3-dist-val" style="font-family:var(--font-mono);font-weight:700;font-size:0.95rem;min-width:60px;">250 km</span>
            </div>
          `;
          const input = controlsContainer.querySelector("#wb3-input-dist");
          const valDisplay = controlsContainer.querySelector("#wb3-dist-val");
          input.addEventListener("input", () => {
            valDisplay.textContent = `${input.value} km`;
            evaluate();
          });
        } else if (currentScenario === "energia") {
          controlsContainer.innerHTML = `
            <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
              <div>
                <label for="wb3-select-tipo" style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;">Tipo de Instalação:</label>
                <select id="wb3-select-tipo" style="padding:0.35rem 0.5rem;font-family:var(--font-mono);font-size:0.82rem;border:var(--border-strong);background:var(--bg-paper);margin-left:0.5rem;">
                  <option value="R" selected>R - Residencial</option>
                  <option value="C">C - Comercial</option>
                  <option value="I">I - Industrial</option>
                </select>
              </div>
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <label for="wb3-input-kwh" style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;">Consumo (kWh):</label>
                <input type="number" id="wb3-input-kwh" value="450" min="10" max="15000" step="50" style="padding:0.35rem 0.5rem;font-family:var(--font-mono);font-size:0.82rem;border:var(--border-strong);background:var(--bg-paper);width:100px;" />
              </div>
            </div>
          `;
          controlsContainer.querySelector("#wb3-select-tipo").addEventListener("change", evaluate);
          controlsContainer.querySelector("#wb3-input-kwh").addEventListener("input", evaluate);
        }
        evaluate();
      }

      function evaluate() {
        if (currentScenario === "radar") {
          const speed = parseFloat(controlsContainer.querySelector("#wb3-input-speed")?.value || 95);
          const limit = 80;
          const isOver = speed > limit;

          let branches = [];
          if (isOver) {
            const diff = speed - limit;
            const fine = diff * 5;
            branches = [
              {
                cond: `if velocidade > 80: (${speed} > 80) -> True`,
                active: true,
                lines: [
                  `excedente = ${speed} - 80  # ${diff} km/h acima do limite`,
                  `multa = ${diff} * 5.00     # R$ ${fine.toFixed(2)}`,
                  `print(f"MULTADO! Velocidade de ${speed} km/h excede o limite de 80 km/h.")`,
                  `print(f"Valor da penalidade: R$ ${fine.toFixed(2)}")`
                ]
              },
              {
                cond: `else:`,
                active: false,
                lines: [
                  `print("Velocidade dentro do limite regulamentar. Boa viagem!")`
                ]
              }
            ];
            consoleOutput.textContent = `MULTADO! Velocidade de ${speed} km/h excede o limite de 80 km/h.\nValor da penalidade: R$ ${fine.toFixed(2)}`;
          } else {
            branches = [
              {
                cond: `if velocidade > 80: (${speed} > 80) -> False`,
                active: false,
                lines: [
                  `# Ramo ignorado pelo interpretador`
                ]
              },
              {
                cond: `else:`,
                active: true,
                lines: [
                  `print("Velocidade dentro do limite regulamentar. Boa viagem!")`
                ]
              }
            ];
            consoleOutput.textContent = `Velocidade dentro do limite regulamentar. Boa viagem!`;
          }
          renderBranches(branches);

        } else if (currentScenario === "salario") {
          const sal = parseFloat(controlsContainer.querySelector("#wb3-input-sal")?.value || 1200);
          const isHigh = sal > 1250;
          let branches = [];
          if (isHigh) {
            const pct = 10;
            const aum = sal * 0.10;
            const novo = sal + aum;
            branches = [
              {
                cond: `if salario > 1250: (${sal.toFixed(2)} > 1250) -> True`,
                active: true,
                lines: [
                  `aumento = salario * 0.10  # R$ ${aum.toFixed(2)} (Faixa de 10%)`,
                  `novo_salario = salario + aumento  # R$ ${novo.toFixed(2)}`
                ]
              },
              {
                cond: `else:`,
                active: false,
                lines: [
                  `# Ramo ignorado`
                ]
              }
            ];
            consoleOutput.textContent = `Salário original: R$ ${sal.toFixed(2)}\nAumento aplicado (10%): R$ ${aum.toFixed(2)}\nNovo salário: R$ ${novo.toFixed(2)}`;
          } else {
            const pct = 15;
            const aum = sal * 0.15;
            const novo = sal + aum;
            branches = [
              {
                cond: `if salario > 1250: (${sal.toFixed(2)} > 1250) -> False`,
                active: false,
                lines: [
                  `# Ramo ignorado`
                ]
              },
              {
                cond: `else: (${sal.toFixed(2)} <= 1250) -> Executado`,
                active: true,
                lines: [
                  `aumento = salario * 0.15  # R$ ${aum.toFixed(2)} (Faixa de 15%)`,
                  `novo_salario = salario + aumento  # R$ ${novo.toFixed(2)}`
                ]
              }
            ];
            consoleOutput.textContent = `Salário original: R$ ${sal.toFixed(2)}\nAumento aplicado (15%): R$ ${aum.toFixed(2)}\nNovo salário: R$ ${novo.toFixed(2)}`;
          }
          renderBranches(branches);

        } else if (currentScenario === "viagem") {
          const dist = parseFloat(controlsContainer.querySelector("#wb3-input-dist")?.value || 250);
          let branches = [];
          if (dist <= 200) {
            const preco = dist * 0.50;
            branches = [
              {
                cond: `if distancia <= 200: (${dist} <= 200) -> True`,
                active: true,
                lines: [
                  `preco = distancia * 0.50  # Tarifa curta: R$ 0,50/km`,
                  `print(f"Passagem: R$ {preco:.2f}")`
                ]
              },
              {
                cond: `else:`,
                active: false,
                lines: [`# Ramo de longa distância ignorado`]
              }
            ];
            consoleOutput.textContent = `Distância: ${dist} km (Viagem Curta)\nTarifa: R$ 0,50/km\nPreço da passagem: R$ ${preco.toFixed(2)}`;
          } else {
            const preco = dist * 0.45;
            branches = [
              {
                cond: `if distancia <= 200: (${dist} <= 200) -> False`,
                active: false,
                lines: [`# Ramo ignorado`]
              },
              {
                cond: `else: (${dist} > 200) -> Executado`,
                active: true,
                lines: [
                  `preco = distancia * 0.45  # Tarifa promocional longa: R$ 0,45/km`,
                  `print(f"Passagem: R$ {preco:.2f}")`
                ]
              }
            ];
            consoleOutput.textContent = `Distância: ${dist} km (Viagem Longa)\nTarifa com desconto: R$ 0,45/km\nPreço da passagem: R$ ${preco.toFixed(2)}`;
          }
          renderBranches(branches);

        } else if (currentScenario === "energia") {
          const tipo = controlsContainer.querySelector("#wb3-select-tipo")?.value || "R";
          const kwh = parseFloat(controlsContainer.querySelector("#wb3-input-kwh")?.value || 450);

          let precoUnit = 0;
          let condBranch = "";
          let branches = [];

          if (tipo === "R") {
            if (kwh <= 500) {
              precoUnit = 0.40;
              condBranch = "Residencial <= 500 kWh";
            } else {
              precoUnit = 0.65;
              condBranch = "Residencial > 500 kWh";
            }
          } else if (tipo === "C") {
            if (kwh <= 1000) {
              precoUnit = 0.55;
              condBranch = "Comercial <= 1000 kWh";
            } else {
              precoUnit = 0.60;
              condBranch = "Comercial > 1000 kWh";
            }
          } else if (tipo === "I") {
            if (kwh <= 5000) {
              precoUnit = 0.55;
              condBranch = "Industrial <= 5000 kWh";
            } else {
              precoUnit = 0.60;
              condBranch = "Industrial > 5000 kWh";
            }
          }

          const total = kwh * precoUnit;

          branches = [
            {
              cond: `if tipo == "R":`,
              active: tipo === "R",
              lines: [
                `preco = 0.40 if kwh <= 500 else 0.65  # Atual: ${tipo === 'R' ? precoUnit : '-'}`
              ]
            },
            {
              cond: `elif tipo == "C":`,
              active: tipo === "C",
              lines: [
                `preco = 0.55 if kwh <= 1000 else 0.60  # Atual: ${tipo === 'C' ? precoUnit : '-'}`
              ]
            },
            {
              cond: `elif tipo == "I":`,
              active: tipo === "I",
              lines: [
                `preco = 0.55 if kwh <= 5000 else 0.60  # Atual: ${tipo === 'I' ? precoUnit : '-'}`
              ]
            },
            {
              cond: `else:`,
              active: false,
              lines: [`print("Instalação Inválida")`]
            }
          ];

          renderBranches(branches);
          consoleOutput.textContent = `Tipo de Instalação: ${tipo} (${condBranch})\nConsumo Registrado: ${kwh} kWh\nTarifa Unitária Aplicada: R$ ${precoUnit.toFixed(2)}/kWh\nTotal a Pagar: R$ ${total.toFixed(2)}`;
        }
      }

      function renderBranches(branches) {
        let html = "";
        branches.forEach(b => {
          const border = b.active ? "border-left:4px solid var(--accent-green, #107c41);" : "border-left:4px solid var(--border-strong);opacity:0.6;";
          const bg = b.active ? "background:var(--bg-paper);" : "background:var(--bg-card);";
          const badge = b.active
            ? `<span style="font-family:var(--font-mono);font-size:0.75rem;padding:0.15rem 0.4rem;background:#dcfce7;color:#166534;font-weight:700;">ATIVO (EXECUTADO)</span>`
            : `<span style="font-family:var(--font-mono);font-size:0.75rem;padding:0.15rem 0.4rem;background:#f4f4f5;color:#71717a;">IGNORADO</span>`;

          html += `
            <div style="${border}${bg}padding:0.6rem 0.75rem;border-top:var(--border-thin);border-right:var(--border-thin);border-bottom:var(--border-thin);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem;">
                <code style="font-family:var(--font-mono);font-weight:700;font-size:0.85rem;color:${b.active ? 'var(--ink-primary)' : 'var(--ink-secondary)'};">${escapeHtml(b.cond)}</code>
                ${badge}
              </div>
              <div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--ink-secondary);padding-left:0.5rem;">
                ${b.lines.map(l => `<div>${escapeHtml(l)}</div>`).join("")}
              </div>
            </div>
          `;
        });
        branchView.innerHTML = html;
      }

      function escapeHtml(s) {
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }

      scenarioSelect.addEventListener("change", () => {
        currentScenario = scenarioSelect.value;
        renderControls();
      });

      renderControls();
    }
  };

  if (typeof document !== "undefined") {
    const el = document.getElementById("decision-flow-mount");
    if (el) window.COURSEBOOK_LABS["decision-flow"].init(el);
  }
})();
