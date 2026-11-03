/* ==========================================================================
   COURSEBOOK — LABORATÓRIO DO CATÁLOGO: PROCESSAMENTO DE STRINGS & JOGO DA FORCA
   id: "hangman-lab" | mobile: "full" | source: "catalog"
   ========================================================================== */

(function () {
  "use strict";

  window.COURSEBOOK_LABS = window.COURSEBOOK_LABS || {};

  window.COURSEBOOK_LABS["hangman-lab"] = {
    id: "hangman-lab",
    title: "Laboratório Interativo: Strings, Fatiamento & Jogo da Forca",
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
            <span class="workbench-title lab-title">Laboratório Interativo • Strings &amp; Jogo da Forca</span>
            <span class="bracket-tag amber">STEP-BY-STEP • VANILLA JS</span>
          </div>
          <div class="workbench-body">
            <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
              Explore métodos de manipulação de texto, régua de fatiamento com índices positivos e negativos, e jogue a versão canônica do <strong>Jogo da Forca</strong> de Nilo Menezes.
            </p>

            <div class="workbench-tabs" role="tablist" style="display:flex;gap:0.5rem;margin-bottom:1rem;border-bottom:1px solid var(--border-color);padding-bottom:0.5rem;">
              <button class="workbench-tab active" data-tab="tab-hangman" style="font-family:var(--font-mono);font-size:0.8rem;padding:0.4rem 0.8rem;cursor:pointer;background:var(--paper-card);border:1px solid var(--border-color);color:var(--ink-primary);">1. Jogo da Forca Canônico</button>
              <button class="workbench-tab" data-tab="tab-slice-tester" style="font-family:var(--font-mono);font-size:0.8rem;padding:0.4rem 0.8rem;cursor:pointer;background:transparent;border:1px solid var(--border-color);color:var(--ink-secondary);">2. Régua de Fatiamento &amp; Métodos</button>
            </div>

            <!-- PAINEL 1: JOGO DA FORCA -->
            <div id="tab-hangman" class="workbench-panel">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;" class="responsive-lab-grid">
                <!-- Coluna Esquerda: Forca ASCII -->
                <div>
                  <h4 style="font-size:0.82rem;font-family:var(--font-mono);text-transform:uppercase;margin:0 0 0.5rem 0;color:var(--ink-secondary);">
                    Representação Visual da Forca
                  </h4>
                  <pre id="hm-gallows" style="background:#111;color:#10b981;padding:1rem;border-radius:4px;font-family:var(--font-mono);font-size:0.95rem;line-height:1.25;min-height:140px;margin:0;"></pre>
                  
                  <div style="margin-top:0.8rem;background:var(--paper-card);padding:0.8rem;border:1px solid var(--border-color);">
                    <div style="font-size:0.75rem;font-family:var(--font-mono);color:var(--ink-secondary);margin-bottom:0.3rem;">PALAVRA SECRETA:</div>
                    <div id="hm-word-display" style="font-family:var(--font-mono);font-size:1.6rem;font-weight:bold;letter-spacing:0.35rem;color:var(--accent);min-height:2.2rem;"></div>
                  </div>
                </div>

                <!-- Coluna Direita: Controles e Histórico -->
                <div>
                  <div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.8rem;">
                    <label style="font-size:0.8rem;font-family:var(--font-mono);">Palavra:</label>
                    <select id="hm-word-select" class="workbench-select" style="flex:1;padding:0.35rem;font-size:0.82rem;font-family:var(--font-mono);">
                      <option value="PYTHON">PYTHON (6 letras)</option>
                      <option value="ALGORITMO">ALGORITMO (9 letras)</option>
                      <option value="ESTRUTURA">ESTRUTURA (9 letras)</option>
                      <option value="DICIONARIO">DICIONARIO (10 letras)</option>
                      <option value="IMUTABILIDADE">IMUTABILIDADE (13 letras)</option>
                    </select>
                    <button id="hm-btn-reset" class="workbench-btn" style="padding:0.35rem 0.7rem;font-size:0.8rem;font-family:var(--font-mono);cursor:pointer;">Reiniciar</button>
                  </div>

                  <div style="display:flex;gap:0.5rem;margin-bottom:0.8rem;">
                    <input id="hm-input-letter" type="text" maxlength="1" placeholder="Letra" style="width:70px;text-align:center;text-transform:uppercase;font-family:var(--font-mono);font-size:1.2rem;font-weight:bold;padding:0.3rem;border:1px solid var(--border-color);background:var(--paper-card);color:var(--ink-primary);" />
                    <button id="hm-btn-guess" class="workbench-btn primary" style="flex:1;padding:0.4rem 0.8rem;font-size:0.85rem;font-family:var(--font-mono);cursor:pointer;background:var(--accent);color:#fff;border:none;">Tentar Letra</button>
                  </div>

                  <div id="hm-message" style="font-family:var(--font-mono);font-size:0.82rem;padding:0.5rem;border-radius:3px;margin-bottom:0.8rem;display:none;"></div>

                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;font-family:var(--font-mono);font-size:0.8rem;">
                    <div style="background:var(--paper-card);padding:0.5rem;border:1px solid var(--border-color);">
                      <div style="color:var(--ink-secondary);font-size:0.72rem;">LETRAS TENTADAS:</div>
                      <div id="hm-guessed-letters" style="margin-top:0.2rem;font-weight:bold;word-break:break-all;">-</div>
                    </div>
                    <div style="background:var(--paper-card);padding:0.5rem;border:1px solid var(--border-color);">
                      <div style="color:var(--ink-secondary);font-size:0.72rem;">ERROS COMETIDOS:</div>
                      <div id="hm-errors-count" style="margin-top:0.2rem;font-weight:bold;color:#e11d48;">0 / 6</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- PAINEL 2: RÉGUA DE FATIAMENTO & MÉTODOS -->
            <div id="tab-slice-tester" class="workbench-panel" style="display:none;">
              <div style="margin-bottom:1rem;">
                <label style="font-size:0.8rem;font-family:var(--font-mono);display:block;margin-bottom:0.3rem;">String Base para Análise:</label>
                <input id="st-base-string" type="text" value="PROGRAMACAO PYTHON" style="width:100%;padding:0.5rem;font-family:var(--font-mono);font-size:0.95rem;background:var(--paper-card);border:1px solid var(--border-color);color:var(--ink-primary);" />
              </div>

              <!-- Régua com Índices Positivos e Negativos -->
              <div style="overflow-x:auto;padding-bottom:0.5rem;margin-bottom:1.2rem;">
                <div style="font-size:0.75rem;font-family:var(--font-mono);color:var(--ink-secondary);margin-bottom:0.3rem;">RÉGUA DE ÍNDICES POSITIVOS (+) E NEGATIVOS (-):</div>
                <div id="st-ruler-container" style="display:flex;gap:2px;font-family:var(--font-mono);font-size:0.75rem;"></div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;" class="responsive-lab-grid">
                <!-- Seletor de Fatiamento -->
                <div style="background:var(--paper-card);padding:0.8rem;border:1px solid var(--border-color);">
                  <div style="font-family:var(--font-mono);font-size:0.82rem;font-weight:bold;margin-bottom:0.6rem;color:var(--accent);">
                    Operação de Fatiamento: S[início : fim : passo]
                  </div>
                  <div style="display:flex;gap:0.4rem;align-items:center;margin-bottom:0.6rem;">
                    <span style="font-family:var(--font-mono);font-size:0.85rem;">S[</span>
                    <input id="st-slice-start" type="text" placeholder="0" style="width:50px;text-align:center;font-family:var(--font-mono);padding:0.25rem;border:1px solid var(--border-color);" />
                    <span style="font-family:var(--font-mono);font-size:0.85rem;">:</span>
                    <input id="st-slice-end" type="text" placeholder="len" style="width:50px;text-align:center;font-family:var(--font-mono);padding:0.25rem;border:1px solid var(--border-color);" />
                    <span style="font-family:var(--font-mono);font-size:0.85rem;">:</span>
                    <input id="st-slice-step" type="text" placeholder="1" style="width:50px;text-align:center;font-family:var(--font-mono);padding:0.25rem;border:1px solid var(--border-color);" />
                    <span style="font-family:var(--font-mono);font-size:0.85rem;">]</span>
                    <button id="st-btn-slice" class="workbench-btn" style="padding:0.3rem 0.6rem;font-size:0.8rem;font-family:var(--font-mono);cursor:pointer;">Fatiar</button>
                  </div>
                  <div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--ink-secondary);">
                    Resultado do Fatiamento: <strong id="st-slice-res" style="color:var(--accent);font-size:0.95rem;">-</strong>
                  </div>
                </div>

                <!-- Testador de Métodos Canônicos -->
                <div style="background:var(--paper-card);padding:0.8rem;border:1px solid var(--border-color);">
                  <div style="font-family:var(--font-mono);font-size:0.82rem;font-weight:bold;margin-bottom:0.6rem;color:var(--accent);">
                    Métodos Built-in do Capítulo 7
                  </div>
                  <div style="display:flex;gap:0.4rem;margin-bottom:0.6rem;">
                    <select id="st-method-select" style="flex:1;padding:0.3rem;font-family:var(--font-mono);font-size:0.8rem;">
                      <option value="upper">.upper()</option>
                      <option value="lower">.lower()</option>
                      <option value="find">.find(substring)</option>
                      <option value="count">.count(substring)</option>
                      <option value="replace">.replace(antigo, novo)</option>
                      <option value="split">.split(separador)</option>
                      <option value="strip">.strip()</option>
                      <option value="isalnum">.isalnum()</option>
                      <option value="isalpha">.isalpha()</option>
                      <option value="isdigit">.isdigit()</option>
                    </select>
                    <input id="st-method-arg" type="text" placeholder="Parâmetro (ex: 'A')" style="width:110px;padding:0.25rem;font-family:var(--font-mono);font-size:0.8rem;border:1px solid var(--border-color);" />
                    <button id="st-btn-exec-method" class="workbench-btn" style="padding:0.3rem 0.6rem;font-size:0.8rem;font-family:var(--font-mono);cursor:pointer;">Executar</button>
                  </div>
                  <div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--ink-secondary);">
                    Retorno da Expressão: <strong id="st-method-res" style="color:#059669;font-size:0.9rem;">-</strong>
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

      // --- LOGIC 1: JOGO DA FORCA ---
      const GALLOWS_STAGES = [
        `X---+
|   |
|
|
|
|
=======`,
        `X---+
|   |
|   O
|
|
|
=======`,
        `X---+
|   |
|   O
|   |
|
|
=======`,
        `X---+
|   |
|   O
|  /|
|
|
=======`,
        `X---+
|   |
|   O
|  /|\\
|
|
=======`,
        `X---+
|   |
|   O
|  /|\\
|  /
|
=======`,
        `X---+
|   |
|   O
|  /|\\
|  / \\
|
=======`
      ];

      let secretWord = "PYTHON";
      let guessedLetters = [];
      let errors = 0;
      let gameOver = false;

      const elGallows = mount.querySelector("#hm-gallows");
      const elWordDisplay = mount.querySelector("#hm-word-display");
      const elGuessedLetters = mount.querySelector("#hm-guessed-letters");
      const elErrorsCount = mount.querySelector("#hm-errors-count");
      const elMessage = mount.querySelector("#hm-message");
      const elInputLetter = mount.querySelector("#hm-input-letter");
      const elBtnGuess = mount.querySelector("#hm-btn-guess");
      const elWordSelect = mount.querySelector("#hm-word-select");
      const elBtnReset = mount.querySelector("#hm-btn-reset");

      function updateHangmanUI() {
        elGallows.textContent = GALLOWS_STAGES[Math.min(errors, 6)];
        
        let displayStr = "";
        let allGuessed = true;
        for (let char of secretWord) {
          if (guessedLetters.includes(char)) {
            displayStr += char + " ";
          } else {
            displayStr += ". ";
            allGuessed = false;
          }
        }
        elWordDisplay.textContent = displayStr.trim();
        elGuessedLetters.textContent = guessedLetters.length > 0 ? guessedLetters.join(", ") : "-";
        elErrorsCount.textContent = errors + " / 6";

        if (allGuessed && !gameOver) {
          gameOver = true;
          elMessage.style.display = "block";
          elMessage.style.background = "#dcfce7";
          elMessage.style.color = "#15803d";
          elMessage.textContent = "Parabéns! Você adivinhou a palavra secreta!";
        } else if (errors >= 6 && !gameOver) {
          gameOver = true;
          elMessage.style.display = "block";
          elMessage.style.background = "#fee2e2";
          elMessage.style.color = "#b91c1c";
          elMessage.textContent = `Enforcado! A palavra correta era "${secretWord}".`;
        }
      }

      function handleGuess() {
        if (gameOver) return;
        const letter = elInputLetter.value.trim().toUpperCase();
        elInputLetter.value = "";
        elInputLetter.focus();

        if (!letter || letter.length !== 1 || !letter.match(/[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/)) {
          return;
        }

        if (guessedLetters.includes(letter)) {
          elMessage.style.display = "block";
          elMessage.style.background = "#fef3c7";
          elMessage.style.color = "#92400e";
          elMessage.textContent = `Você já tentou a letra "${letter}"!`;
          return;
        }

        elMessage.style.display = "none";
        guessedLetters.push(letter);

        if (!secretWord.includes(letter)) {
          errors++;
        }
        updateHangmanUI();
      }

      function resetHangman() {
        secretWord = elWordSelect.value;
        guessedLetters = [];
        errors = 0;
        gameOver = false;
        elMessage.style.display = "none";
        updateHangmanUI();
      }

      elBtnGuess.addEventListener("click", handleGuess);
      elInputLetter.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleGuess();
      });
      elBtnReset.addEventListener("click", resetHangman);
      elWordSelect.addEventListener("change", resetHangman);
      resetHangman();

      // --- LOGIC 2: RÉGUA DE FATIAMENTO & MÉTODOS ---
      const elBaseString = mount.querySelector("#st-base-string");
      const elRulerContainer = mount.querySelector("#st-ruler-container");
      const elSliceStart = mount.querySelector("#st-slice-start");
      const elSliceEnd = mount.querySelector("#st-slice-end");
      const elSliceStep = mount.querySelector("#st-slice-step");
      const elBtnSlice = mount.querySelector("#st-btn-slice");
      const elSliceRes = mount.querySelector("#st-slice-res");
      const elMethodSelect = mount.querySelector("#st-method-select");
      const elMethodArg = mount.querySelector("#st-method-arg");
      const elBtnExecMethod = mount.querySelector("#st-btn-exec-method");
      const elMethodRes = mount.querySelector("#st-method-res");

      function renderRuler() {
        const text = elBaseString.value;
        const len = text.length;
        elRulerContainer.innerHTML = "";

        for (let i = 0; i < len; i++) {
          const char = text[i];
          const negIndex = i - len;
          const cell = document.createElement("div");
          cell.style.display = "flex";
          cell.style.flexDirection = "column";
          cell.style.alignItems = "center";
          cell.style.padding = "4px 6px";
          cell.style.background = i % 2 === 0 ? "var(--paper-card)" : "transparent";
          cell.style.border = "1px solid var(--border-color)";
          cell.style.borderRadius = "2px";
          cell.style.minWidth = "26px";

          cell.innerHTML = `
            <span style="font-size:0.65rem;color:#059669;font-weight:bold;">${i}</span>
            <span style="font-size:0.95rem;font-weight:bold;color:var(--ink-primary);">${char === " " ? "&blank;" : char}</span>
            <span style="font-size:0.65rem;color:#e11d48;">${negIndex}</span>
          `;
          elRulerContainer.appendChild(cell);
        }
      }

      function executeSlice() {
        const str = elBaseString.value;
        const len = str.length;
        let startVal = elSliceStart.value.trim();
        let endVal = elSliceEnd.value.trim();
        let stepVal = elSliceStep.value.trim();

        let start = startVal === "" ? 0 : parseInt(startVal, 10);
        let end = endVal === "" ? len : parseInt(endVal, 10);
        let step = stepVal === "" ? 1 : parseInt(stepVal, 10);

        if (isNaN(start)) start = 0;
        if (isNaN(end)) end = len;
        if (isNaN(step) || step === 0) step = 1;

        if (start < 0) start = Math.max(0, len + start);
        if (end < 0) end = Math.max(0, len + end);

        let result = "";
        if (step > 0) {
          for (let i = start; i < end && i < len; i += step) {
            result += str[i];
          }
        } else {
          for (let i = start; i > end && i >= 0; i += step) {
            result += str[i];
          }
        }
        elSliceRes.textContent = `"${result}" (tamanho: ${result.length})`;
      }

      function executeMethod() {
        const str = elBaseString.value;
        const method = elMethodSelect.value;
        const arg = elMethodArg.value;

        let output = "";
        switch (method) {
          case "upper":
            output = `"${str.toUpperCase()}"`;
            break;
          case "lower":
            output = `"${str.toLowerCase()}"`;
            break;
          case "find":
            output = String(str.indexOf(arg));
            break;
          case "count":
            if (!arg) {
              output = "0";
            } else {
              const regex = new RegExp(arg.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'), 'g');
              const matches = str.match(regex);
              output = String(matches ? matches.length : 0);
            }
            break;
          case "replace": {
            const parts = arg.split(",");
            const oldVal = (parts[0] || "").trim();
            const newVal = (parts[1] || "").trim();
            output = `"${str.split(oldVal).join(newVal)}"`;
            break;
          }
          case "split":
            output = JSON.stringify(str.split(arg || " "));
            break;
          case "strip":
            output = `"${str.trim()}"`;
            break;
          case "isalnum":
            output = String(/^[a-zA-Z0-9]+$/.test(str));
            break;
          case "isalpha":
            output = String(/^[a-zA-Z]+$/.test(str));
            break;
          case "isdigit":
            output = String(/^[0-9]+$/.test(str));
            break;
          default:
            output = "Método não reconhecido";
        }
        elMethodRes.textContent = output;
      }

      elBaseString.addEventListener("input", () => {
        renderRuler();
        executeSlice();
      });
      elBtnSlice.addEventListener("click", executeSlice);
      elBtnExecMethod.addEventListener("click", executeMethod);

      renderRuler();
      executeSlice();
      executeMethod();
    }
  };
})();
