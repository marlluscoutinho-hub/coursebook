/* ==========================================================================
   COURSEBOOK — LABORATÓRIO DO CATÁLOGO: SISTEMA DE ARQUIVOS VIRTUAL (VFS)
   id: "vfs-lab" | mobile: "full" | source: "catalog"
   ========================================================================== */

(function () {
  "use strict";

  window.COURSEBOOK_LABS = window.COURSEBOOK_LABS || {};

  window.COURSEBOOK_LABS["vfs-lab"] = {
    id: "vfs-lab",
    title: "Laboratório Interativo: Sistema de Arquivos Virtual & Ponteiro Seek/Tell",
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
            <span class="workbench-title lab-title">Laboratório Interativo • Arquivos &amp; Diretórios</span>
            <span class="bracket-tag amber">STEP-BY-STEP • VANILLA JS</span>
          </div>
          <div class="workbench-body">
            <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
              Simule a operação de arquivos em disco com <strong>modos de abertura (r, w, a)</strong>, manipulação do ponteiro <code>seek()</code> e <code>tell()</code>, e geração de relatórios <strong>HTML</strong>.
            </p>

            <div class="workbench-tabs" role="tablist" style="display:flex;gap:0.5rem;margin-bottom:1rem;border-bottom:1px solid var(--border-color);padding-bottom:0.5rem;">
              <button class="workbench-tab active" data-tab="tab-vfs-file" style="font-family:var(--font-mono);font-size:0.8rem;padding:0.4rem 0.8rem;cursor:pointer;background:var(--paper-card);border:1px solid var(--border-color);color:var(--ink-primary);">1. Ponteiro Seek, Tell &amp; Modos</button>
              <button class="workbench-tab" data-tab="tab-vfs-tree" style="font-family:var(--font-mono);font-size:0.8rem;padding:0.4rem 0.8rem;cursor:pointer;background:transparent;border:1px solid var(--border-color);color:var(--ink-secondary);">2. os.walk &amp; Gerador HTML</button>
            </div>

            <!-- PAINEL 1: PONTEIRO SEEK & TELL -->
            <div id="tab-vfs-file" class="workbench-panel">
              <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;margin-bottom:0.8rem;">
                <label style="font-family:var(--font-mono);font-size:0.8rem;">Arquivo:</label>
                <input id="vfs-filename" type="text" value="dados.txt" style="width:110px;padding:0.3rem;font-family:var(--font-mono);font-size:0.82rem;border:1px solid var(--border-color);" />
                
                <label style="font-family:var(--font-mono);font-size:0.8rem;margin-left:0.5rem;">Modo:</label>
                <select id="vfs-mode" style="padding:0.3rem;font-family:var(--font-mono);font-size:0.82rem;">
                  <option value="w">"w" (Escrita / Sobrescreve)</option>
                  <option value="a">"a" (Append / Anexa ao fim)</option>
                  <option value="r">"r" (Leitura)</option>
                  <option value="r+">"r+" (Leitura e Escrita)</option>
                </select>
                <button id="vfs-btn-open" class="workbench-btn" style="padding:0.3rem 0.7rem;font-family:var(--font-mono);font-size:0.8rem;cursor:pointer;">Abrir Arquivo</button>
                <button id="vfs-btn-close" class="workbench-btn" style="padding:0.3rem 0.7rem;font-family:var(--font-mono);font-size:0.8rem;cursor:pointer;">Fechar (close)</button>
              </div>

              <!-- Régua Visual do Arquivo e Ponteiro de Posição -->
              <div style="background:#111;color:#fff;padding:0.8rem;border-radius:4px;margin-bottom:1rem;border:1px solid var(--border-color);">
                <div style="display:flex;justify-content:space-between;margin-bottom:0.4rem;font-family:var(--font-mono);font-size:0.75rem;">
                  <span id="vfs-file-status" style="color:#10b981;">STATUS: ARQUIVO FECHADO</span>
                  <span id="vfs-pointer-pos" style="color:#93c5fd;">Ponteiro (tell): 0 bytes</span>
                </div>
                <div id="vfs-buffer-view" style="font-family:var(--font-mono);font-size:0.95rem;min-height:40px;background:#1e293b;padding:0.5rem;border-radius:2px;overflow-x:auto;white-space:pre;letter-spacing:1px;position:relative;">
                  [Buffer vazio]
                </div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;" class="responsive-lab-grid">
                <!-- Operações de Escrita -->
                <div style="background:var(--paper-card);padding:0.8rem;border:1px solid var(--border-color);">
                  <div style="font-family:var(--font-mono);font-size:0.82rem;font-weight:bold;margin-bottom:0.6rem;color:var(--accent);">
                    Operação: arquivo.write(texto)
                  </div>
                  <div style="display:flex;gap:0.4rem;margin-bottom:0.5rem;">
                    <input id="vfs-write-input" type="text" placeholder="Texto para gravar..." style="flex:1;padding:0.3rem;font-family:var(--font-mono);font-size:0.82rem;border:1px solid var(--border-color);" />
                    <button id="vfs-btn-write" class="workbench-btn primary" style="padding:0.3rem 0.7rem;font-family:var(--font-mono);font-size:0.8rem;cursor:pointer;background:var(--accent);color:#fff;border:none;">write()</button>
                  </div>
                  <div style="font-size:0.75rem;color:var(--ink-secondary);font-family:var(--font-mono);">
                    Dica: Use "\\n" para quebras de linha automáticas.
                  </div>
                </div>

                <!-- Operações de Leitura & Seek -->
                <div style="background:var(--paper-card);padding:0.8rem;border:1px solid var(--border-color);">
                  <div style="font-family:var(--font-mono);font-size:0.82rem;font-weight:bold;margin-bottom:0.6rem;color:var(--accent);">
                    Operação: seek(offset) &amp; read()
                  </div>
                  <div style="display:flex;gap:0.4rem;align-items:center;margin-bottom:0.6rem;">
                    <span style="font-family:var(--font-mono);font-size:0.8rem;">seek:</span>
                    <input id="vfs-seek-val" type="number" min="0" value="0" style="width:60px;padding:0.25rem;font-family:var(--font-mono);font-size:0.8rem;border:1px solid var(--border-color);" />
                    <button id="vfs-btn-seek" class="workbench-btn" style="padding:0.25rem 0.5rem;font-family:var(--font-mono);font-size:0.8rem;cursor:pointer;">Mover Ponteiro</button>
                    <button id="vfs-btn-read" class="workbench-btn" style="padding:0.25rem 0.5rem;font-family:var(--font-mono);font-size:0.8rem;cursor:pointer;">read()</button>
                  </div>
                  <div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--ink-secondary);">
                    Último read(): <strong id="vfs-read-output" style="color:#059669;">-</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- PAINEL 2: OS.WALK & GERADOR HTML -->
            <div id="tab-vfs-tree" class="workbench-panel" style="display:none;">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;" class="responsive-lab-grid">
                <!-- Árvore de Diretórios os.walk -->
                <div>
                  <h4 style="font-family:var(--font-mono);font-size:0.82rem;margin:0 0 0.5rem 0;color:var(--ink-secondary);text-transform:uppercase;">
                    Navegação Recursiva com os.walk()
                  </h4>
                  <pre id="vfs-walk-output" style="background:#111;color:#10b981;padding:0.8rem;font-family:var(--font-mono);font-size:0.8rem;line-height:1.35;border-radius:4px;min-height:160px;margin:0 0 0.6rem 0;"></pre>
                  <button id="vfs-btn-walk" class="workbench-btn" style="width:100%;padding:0.4rem;font-family:var(--font-mono);font-size:0.8rem;cursor:pointer;">Simular os.walk('/projeto')</button>
                </div>

                <!-- Pré-visualização do Gerador HTML -->
                <div>
                  <h4 style="font-family:var(--font-mono);font-size:0.82rem;margin:0 0 0.5rem 0;color:var(--ink-secondary);text-transform:uppercase;">
                    Página HTML Gerada em Python
                  </h4>
                  <div id="vfs-html-preview" style="background:#fff;color:#000;padding:0.8rem;border:1px solid var(--border-color);border-radius:4px;min-height:160px;font-family:sans-serif;font-size:0.85rem;overflow-y:auto;max-height:200px;">
                    <em>Clique no botão abaixo para gerar a página HTML.</em>
                  </div>
                  <button id="vfs-btn-gen-html" class="workbench-btn primary" style="width:100%;margin-top:0.6rem;padding:0.4rem;font-family:var(--font-mono);font-size:0.8rem;cursor:pointer;background:var(--accent);color:#fff;border:none;">Gerar pagina.html Dinâmica</button>
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

      // --- LOGIC 1: VIRTUAL FILE & SEEK/TELL ---
      let fileOpen = false;
      let currentMode = "w";
      let fileBuffer = "";
      let pointer = 0;

      const elFilename = mount.querySelector("#vfs-filename");
      const elMode = mount.querySelector("#vfs-mode");
      const elBtnOpen = mount.querySelector("#vfs-btn-open");
      const elBtnClose = mount.querySelector("#vfs-btn-close");
      const elStatus = mount.querySelector("#vfs-file-status");
      const elPointer = mount.querySelector("#vfs-pointer-pos");
      const elBufferView = mount.querySelector("#vfs-buffer-view");
      const elWriteInput = mount.querySelector("#vfs-write-input");
      const elBtnWrite = mount.querySelector("#vfs-btn-write");
      const elSeekVal = mount.querySelector("#vfs-seek-val");
      const elBtnSeek = mount.querySelector("#vfs-btn-seek");
      const elBtnRead = mount.querySelector("#vfs-btn-read");
      const elReadOutput = mount.querySelector("#vfs-read-output");

      function updateFileUI() {
        if (!fileOpen) {
          elStatus.textContent = "STATUS: ARQUIVO FECHADO";
          elStatus.style.color = "#ef4444";
          elPointer.textContent = "Ponteiro (tell): -";
          elBufferView.textContent = fileBuffer.length === 0 ? "[Arquivo fechado / Vazio]" : fileBuffer;
          return;
        }

        elStatus.textContent = `STATUS: ABERTO [${elFilename.value}] em modo "${currentMode}"`;
        elStatus.style.color = "#10b981";
        elPointer.textContent = `Ponteiro (tell): ${pointer} / ${fileBuffer.length} bytes`;

        let display = "";
        for (let i = 0; i < fileBuffer.length; i++) {
          if (i === pointer) {
            display += `<span style="background:#e11d48;color:#fff;padding:0 2px;font-weight:bold;">${fileBuffer[i]}</span>`;
          } else {
            display += fileBuffer[i];
          }
        }
        if (pointer >= fileBuffer.length) {
          display += `<span style="background:#e11d48;color:#fff;padding:0 2px;font-weight:bold;">EOF</span>`;
        }
        elBufferView.innerHTML = display || `<span style="background:#e11d48;color:#fff;padding:0 2px;font-weight:bold;">EOF</span>`;
      }

      elBtnOpen.addEventListener("click", () => {
        fileOpen = true;
        currentMode = elMode.value;
        if (currentMode === "w") {
          fileBuffer = "";
          pointer = 0;
        } else if (currentMode === "a") {
          pointer = fileBuffer.length;
        } else if (currentMode === "r") {
          pointer = 0;
        } else if (currentMode === "r+") {
          pointer = 0;
        }
        updateFileUI();
      });

      elBtnClose.addEventListener("click", () => {
        fileOpen = false;
        updateFileUI();
      });

      elBtnWrite.addEventListener("click", () => {
        if (!fileOpen) {
          alert("Abra o arquivo primeiro!");
          return;
        }
        if (currentMode === "r") {
          alert("Erro io.UnsupportedOperation: not writable (aberto em modo 'r')");
          return;
        }

        let txt = elWriteInput.value.replace(/\\n/g, "\n");
        elWriteInput.value = "";

        if (currentMode === "a") {
          fileBuffer += txt;
          pointer = fileBuffer.length;
        } else {
          // write at current pointer
          const before = fileBuffer.slice(0, pointer);
          const after = fileBuffer.slice(pointer + txt.length);
          fileBuffer = before + txt + after;
          pointer += txt.length;
        }
        updateFileUI();
      });

      elBtnSeek.addEventListener("click", () => {
        if (!fileOpen) {
          alert("Abra o arquivo primeiro!");
          return;
        }
        let pos = parseInt(elSeekVal.value, 10);
        if (isNaN(pos) || pos < 0) pos = 0;
        pointer = Math.min(pos, fileBuffer.length);
        updateFileUI();
      });

      elBtnRead.addEventListener("click", () => {
        if (!fileOpen) {
          alert("Abra o arquivo primeiro!");
          return;
        }
        if (currentMode === "w" || currentMode === "a") {
          alert("Erro io.UnsupportedOperation: not readable (aberto em modo de escrita)");
          return;
        }
        const data = fileBuffer.slice(pointer);
        pointer = fileBuffer.length;
        elReadOutput.textContent = `"${data}"`;
        updateFileUI();
      });

      // Default sample file
      fileBuffer = "Linha 1\nLinha 2\nLinha 3\n";
      updateFileUI();

      // --- LOGIC 2: OS.WALK & HTML GENERATOR ---
      const elWalkOutput = mount.querySelector("#vfs-walk-output");
      const elBtnWalk = mount.querySelector("#vfs-btn-walk");
      const elHtmlPreview = mount.querySelector("#vfs-html-preview");
      const elBtnGenHtml = mount.querySelector("#vfs-btn-gen-html");

      elBtnWalk.addEventListener("click", () => {
        elWalkOutput.textContent = `Caminho: /projeto
  src/
  docs/
  README.md (1420 bytes)
  main.py (580 bytes)

Caminho: /projeto/src
  utils/
  banco.py (3100 bytes)
  calculo.py (1890 bytes)

Caminho: /projeto/docs
  index.html (2400 bytes)
  manual.pdf (45000 bytes)

Total: 3 diretório(s), 6 arquivo(s)`;
      });
      elBtnWalk.click();

      elBtnGenHtml.addEventListener("click", () => {
        elHtmlPreview.innerHTML = `
          <h2 style="margin:0 0 0.5rem 0;color:var(--accent);font-size:1.1rem;">Relatório Gerado por Script Python</h2>
          <p>Este relatório foi compilado com <code>open("pagina.html", "w", encoding="utf-8")</code>.</p>
          <table style="width:100%;border-collapse:collapse;margin-top:0.5rem;font-size:0.8rem;">
            <thead>
              <tr style="background:#f1f5f9;text-align:left;">
                <th style="padding:4px 8px;border:1px solid #cbd5e1;">Item</th>
                <th style="padding:4px 8px;border:1px solid #cbd5e1;">Qtd</th>
                <th style="padding:4px 8px;border:1px solid #cbd5e1;">Preço</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="padding:4px 8px;border:1px solid #cbd5e1;">Tomate</td><td style="padding:4px 8px;border:1px solid #cbd5e1;">1000</td><td style="padding:4px 8px;border:1px solid #cbd5e1;">R$ 2.30</td></tr>
              <tr><td style="padding:4px 8px;border:1px solid #cbd5e1;">Batata</td><td style="padding:4px 8px;border:1px solid #cbd5e1;">2000</td><td style="padding:4px 8px;border:1px solid #cbd5e1;">R$ 1.20</td></tr>
              <tr><td style="padding:4px 8px;border:1px solid #cbd5e1;">Alface</td><td style="padding:4px 8px;border:1px solid #cbd5e1;">500</td><td style="padding:4px 8px;border:1px solid #cbd5e1;">R$ 0.45</td></tr>
            </tbody>
          </table>
        `;
      });
      elBtnGenHtml.click();
    }
  };
})();
