/**
 * COURSEBOOK — LABORATÓRIOS INTERATIVOS DO MÓDULO 01 (CLRS)
 * 1. Simulador de Escala e Problema 1-1 (Computador A vs. Computador B)
 * 2. Simulador Passo a Passo de Insertion-Sort(A) com Invariante de Laço
 * 3. Intercalação Merge(A, p, q, r) com Sentinelas de Infinito
 */

(function () {
  "use strict";

  function initModule1Workbenches() {
    initScaleWorkbench();
    initInsertionSortWorkbench();
    initMergeSortWorkbench();
  }

  function initScaleWorkbench(mountElOrId) {
    const mount = typeof mountElOrId === "string"
      ? document.getElementById(mountElOrId) || document.getElementById("workbench-scale-mount")
      : (mountElOrId || document.getElementById("workbench-scale-mount"));
    if (!mount || mount.dataset.initialized === "true") return;
    mount.dataset.initialized = "true";

    mount.innerHTML = `
      <div class="workbench-box lab-box">
        <div class="workbench-header lab-header">
          <span class="workbench-title lab-title">Laboratório Interativo 01 • Simulador de Escala &amp; Problema 1-1 (Cap. 1.2)</span>
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
              + Expandir Tabela Completa Resolvida do Problema 1-1 (p. 23): Maior Tamanho n Resolvível em Tempo t
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
     LABORATÓRIO INTERATIVO #2: SIMULADOR PASSO A PASSO DE INSERTION-SORT(A)
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

  function initInsertionSortWorkbench(mountElOrId) {
    const mount = typeof mountElOrId === "string"
      ? document.getElementById(mountElOrId) || document.getElementById("workbench-insertion-mount")
      : (mountElOrId || document.getElementById("workbench-insertion-mount"));
    if (!mount || mount.dataset.initialized === "true") return;
    mount.dataset.initialized = "true";

    mount.innerHTML = `
      <div class="workbench-box lab-box">
        <div class="workbench-header lab-header">
          <span class="workbench-title lab-title">Laboratório Interativo 02 • Simulador Passo a Passo de Insertion-Sort(A)</span>
          <span class="bracket-tag amber">FIGURA 2.2 &amp; EXERCÍCIO 2.1-1</span>
        </div>
        <div class="workbench-body">
          <div class="workbench-controls">
            <div class="Preset-group">
              <button class="wb-btn" onclick="loadInsertionPreset([5, 2, 4, 6, 1, 3])">Fig. 2.2: ⟨5, 2, 4, 6, 1, 3⟩</button>
              <button class="wb-btn" onclick="loadInsertionPreset([31, 41, 59, 26, 41, 58])">Ex. 2.1-1: ⟨31, 41, 59, 26, 41, 58⟩</button>
              <button class="wb-btn" onclick="loadInsertionPreset([6, 5, 4, 3, 2, 1])">Pior Caso Θ(n²)</button>
              <button class="wb-btn" onclick="loadInsertionPreset([1, 2, 3, 4, 5, 6])">Melhor Caso Θ(n)</button>
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
     LABORATÓRIO INTERATIVO #3: SIMULADOR DE MERGE(A, p, q, r) COM SENTINELAS ∞
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

  function initMergeSortWorkbench(mountElOrId) {
    const mount = typeof mountElOrId === "string"
      ? document.getElementById(mountElOrId) || document.getElementById("workbench-merge-mount")
      : (mountElOrId || document.getElementById("workbench-merge-mount"));
    if (!mount || mount.dataset.initialized === "true") return;
    mount.dataset.initialized = "true";

    mount.innerHTML = `
      <div class="workbench-box lab-box">
        <div class="workbench-header lab-header">
          <span class="workbench-title lab-title">Laboratório Interativo 03 • Intercalação Merge(A, p, q, r) com Sentinelas ∞</span>
          <span class="bracket-tag emerald">FIGURA 2.3 &amp; EXERCÍCIO 2.3-1</span>
        </div>
        <div class="workbench-body">
          <div class="workbench-controls">
            <div class="Preset-group">
              <button class="wb-btn" onclick="loadMergePreset([2, 4, 5, 7], [1, 2, 3, 6])">Fig. 2.3: L=⟨2,4,5,7,∞⟩ e R=⟨1,2,3,6,∞⟩</button>
              <button class="wb-btn" onclick="loadMergePreset([3, 26, 41, 52], [9, 38, 49, 57])">Ex. 2.3-1 Final: L=⟨3,26,41,52,∞⟩ e R=⟨9,38,49,57,∞⟩</button>
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


  // Registra no Catálogo Canônico de Laboratórios
  window.COURSEBOOK_LABS = window.COURSEBOOK_LABS || {};

  window.COURSEBOOK_LABS["clrs-scale-duel"] = {
    id: "clrs-scale-duel",
    title: "Laboratório Interativo 01 • Simulador de Escala & Problema 1-1 (Cap. 1.2)",
    mobile: "full",
    init: function (mountElOrId) {
      initScaleWorkbench(mountElOrId);
    }
  };

  window.COURSEBOOK_LABS["clrs-insertion-sort"] = {
    id: "clrs-insertion-sort",
    title: "Laboratório Interativo 02 • Simulador Passo a Passo de Insertion-Sort(A)",
    mobile: "full",
    init: function (mountElOrId) {
      initInsertionSortWorkbench(mountElOrId);
    }
  };

  window.COURSEBOOK_LABS["clrs-merge-sort"] = {
    id: "clrs-merge-sort",
    title: "Laboratório Interativo 03 • Intercalação Merge(A, p, q, r) com Sentinelas ∞",
    mobile: "full",
    init: function (mountElOrId) {
      initMergeSortWorkbench(mountElOrId);
    }
  };

  window.initModule1Workbenches = initModule1Workbenches;

  // Anexa ao module1 do CLRS (compatibilidade com camada em memória)
  function attachToModule1() {
    const data = window.COURSEBOOK_DATA || window.CODEX_DATA;
    if (data && data.module1) {
      data.module1.initWorkbenches = initModule1Workbenches;
      data.module1.initLabs = initModule1Workbenches;
    } else {
      setTimeout(attachToModule1, 50);
    }
  }
  attachToModule1();
})();
