/* ==========================================================================
   COURSEBOOK — LABORATÓRIO DO CATÁLOGO: SIMULADOR BANCÁRIO ORIENTADO A OBJETOS
   id: "oop-bank-lab" | mobile: "full" | source: "catalog"
   ========================================================================== */

(function () {
  "use strict";

  window.COURSEBOOK_LABS = window.COURSEBOOK_LABS || {};

  window.COURSEBOOK_LABS["oop-bank-lab"] = {
    id: "oop-bank-lab",
    title: "Laboratório Interativo: Simulador Bancário Orientado a Objetos (POO)",
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
            <span class="workbench-title lab-title">Laboratório Interativo • Programação Orientada a Objetos</span>
            <span class="bracket-tag amber">STEP-BY-STEP • VANILLA JS</span>
          </div>
          <div class="workbench-body">
            <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
              Simule a arquitetura canônica de <strong>Classes, Herança (Conta vs ContaEspecial)</strong> e <strong>Polimorfismo</strong> implementando o sistema bancário do Capítulo 10.
            </p>

            <div class="workbench-tabs" role="tablist" style="display:flex;gap:0.5rem;margin-bottom:1rem;border-bottom:1px solid var(--border-color);padding-bottom:0.5rem;">
              <button class="workbench-tab active" data-tab="tab-bank-sim" style="font-family:var(--font-mono);font-size:0.8rem;padding:0.4rem 0.8rem;cursor:pointer;background:var(--paper-card);border:1px solid var(--border-color);color:var(--ink-primary);">1. Simulador do Sistema Bancário</button>
              <button class="workbench-tab" data-tab="tab-magic-methods" style="font-family:var(--font-mono);font-size:0.8rem;padding:0.4rem 0.8rem;cursor:pointer;background:transparent;border:1px solid var(--border-color);color:var(--ink-secondary);">2. Métodos Mágicos (__len__, __getitem__)</button>
            </div>

            <!-- PAINEL 1: SIMULADOR BANCÁRIO POO -->
            <div id="tab-bank-sim" class="workbench-panel">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;" class="responsive-lab-grid">
                <!-- Coluna Esquerda: Instâncias e Operações -->
                <div>
                  <div style="background:var(--paper-card);border:1px solid var(--border-color);padding:0.8rem;margin-bottom:0.8rem;">
                    <div style="font-family:var(--font-mono);font-size:0.82rem;font-weight:bold;color:var(--accent);margin-bottom:0.6rem;">
                      Instanciar Nova Conta (class Conta / ContaEspecial)
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.4rem;margin-bottom:0.5rem;">
                      <input id="bk-titular" type="text" placeholder="Nome do Cliente" value="João Silva" style="padding:0.3rem;font-family:var(--font-mono);font-size:0.8rem;border:1px solid var(--border-color);" />
                      <input id="bk-saldo-ini" type="number" placeholder="Saldo Inicial (R$)" value="500" style="padding:0.3rem;font-family:var(--font-mono);font-size:0.8rem;border:1px solid var(--border-color);" />
                    </div>
                    <div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.5rem;">
                      <label style="font-family:var(--font-mono);font-size:0.8rem;">Tipo:</label>
                      <select id="bk-tipo-conta" style="padding:0.25rem;font-family:var(--font-mono);font-size:0.8rem;">
                        <option value="padrao">Conta Comum (Limite R$ 0.00)</option>
                        <option value="especial">ContaEspecial (Herança com Limite)</option>
                      </select>
                      <input id="bk-limite" type="number" placeholder="Limite" value="1000" style="width:70px;padding:0.25rem;font-family:var(--font-mono);font-size:0.8rem;border:1px solid var(--border-color);display:none;" />
                    </div>
                    <button id="bk-btn-criar" class="workbench-btn" style="width:100%;padding:0.35rem;font-family:var(--font-mono);font-size:0.8rem;cursor:pointer;">Instanciar Objeto Conta</button>
                  </div>

                  <!-- Ações na Conta Selecionada -->
                  <div style="background:var(--paper-card);border:1px solid var(--border-color);padding:0.8rem;">
                    <div style="font-family:var(--font-mono);font-size:0.82rem;font-weight:bold;color:var(--accent);margin-bottom:0.6rem;">
                      Invocar Métodos: .deposito() e .saque()
                    </div>
                    <div style="margin-bottom:0.5rem;">
                      <label style="font-family:var(--font-mono);font-size:0.8rem;">Conta Alvo:</label>
                      <select id="bk-sel-conta" style="width:100%;padding:0.3rem;font-family:var(--font-mono);font-size:0.82rem;margin-top:0.2rem;"></select>
                    </div>
                    <div style="display:flex;gap:0.4rem;margin-bottom:0.5rem;">
                      <input id="bk-val-op" type="number" placeholder="Valor (R$)" value="100" style="flex:1;padding:0.3rem;font-family:var(--font-mono);font-size:0.82rem;border:1px solid var(--border-color);" />
                      <button id="bk-btn-deposito" class="workbench-btn" style="padding:0.3rem 0.6rem;font-family:var(--font-mono);font-size:0.8rem;cursor:pointer;">Depósito (+)</button>
                      <button id="bk-btn-saque" class="workbench-btn" style="padding:0.3rem 0.6rem;font-family:var(--font-mono);font-size:0.8rem;cursor:pointer;">Saque (-)</button>
                    </div>
                    <div id="bk-msg" style="font-family:var(--font-mono);font-size:0.78rem;padding:0.3rem;border-radius:2px;display:none;"></div>
                  </div>
                </div>

                <!-- Coluna Direita: Estado do Objeto e Extrato Analítico -->
                <div>
                  <h4 style="font-family:var(--font-mono);font-size:0.82rem;margin:0 0 0.5rem 0;color:var(--ink-secondary);text-transform:uppercase;">
                    Extrato Analítico (self.extrato())
                  </h4>
                  <pre id="bk-extrato-view" style="background:#111;color:#10b981;padding:0.8rem;border-radius:4px;font-family:var(--font-mono);font-size:0.82rem;line-height:1.35;min-height:220px;margin:0;overflow-y:auto;max-height:280px;"></pre>
                </div>
              </div>
            </div>

            <!-- PAINEL 2: MÉTODOS MÁGICOS -->
            <div id="tab-magic-methods" class="workbench-panel" style="display:none;">
              <p style="font-size:0.85rem;color:var(--ink-secondary);margin-bottom:0.8rem;">
                A classe <code>ListaÚnica</code> de Nilo Menezes (Listagem 10.13) implementa <strong>métodos mágicos (dunder methods)</strong> para se comportar como uma coleção nativa sem duplicatas e com tipagem homogênea.
              </p>
              
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;" class="responsive-lab-grid">
                <div style="background:var(--paper-card);border:1px solid var(--border-color);padding:0.8rem;">
                  <div style="font-family:var(--font-mono);font-size:0.82rem;font-weight:bold;color:var(--accent);margin-bottom:0.5rem;">
                    lu = ListaÚnica(int)
                  </div>
                  <div style="display:flex;gap:0.4rem;margin-bottom:0.6rem;">
                    <input id="lu-input-elem" type="text" placeholder="Valor (ex: 5 ou 'texto')" style="flex:1;padding:0.3rem;font-family:var(--font-mono);font-size:0.82rem;border:1px solid var(--border-color);" />
                    <button id="lu-btn-adiciona" class="workbench-btn primary" style="padding:0.3rem 0.6rem;font-family:var(--font-mono);font-size:0.8rem;cursor:pointer;background:var(--accent);color:#fff;border:none;">lu.adiciona()</button>
                  </div>
                  <div id="lu-status" style="font-family:var(--font-mono);font-size:0.78rem;margin-bottom:0.6rem;min-height:1.2rem;"></div>
                  
                  <div style="display:flex;gap:0.5rem;font-family:var(--font-mono);font-size:0.8rem;">
                    <div style="background:#fff;padding:0.4rem;border:1px solid var(--border-color);flex:1;">
                      len(lu) = <strong id="lu-len-res" style="color:var(--accent);">0</strong>
                    </div>
                    <div style="background:#fff;padding:0.4rem;border:1px solid var(--border-color);flex:1;">
                      lu[0] = <strong id="lu-item0-res" style="color:#059669;">-</strong>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style="font-family:var(--font-mono);font-size:0.82rem;margin:0 0 0.4rem 0;color:var(--ink-secondary);text-transform:uppercase;">
                    Iteração com for: for item in lu (__iter__)
                  </h4>
                  <pre id="lu-list-view" style="background:#111;color:#93c5fd;padding:0.8rem;border-radius:4px;font-family:var(--font-mono);font-size:0.82rem;min-height:140px;margin:0;"></pre>
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

      // --- LOGIC 1: SIMULADOR BANCÁRIO POO ---
      class Cliente {
        constructor(nome, telefone) {
          this.nome = nome;
          this.telefone = telefone || "9999-0000";
        }
      }

      class Conta {
        constructor(clientes, numero, saldo = 0) {
          this.saldo = saldo;
          this.clientes = Array.isArray(clientes) ? clientes : [clientes];
          this.numero = numero;
          this.operacoes = [];
          if (saldo > 0) {
            this.operacoes.push(["DEPÓSITO INICIAL", saldo]);
          }
        }
        resumo() {
          const titular = this.clientes.map(c => c.nome).join(", ");
          return `Conta Comum Nº ${this.numero} - Titular: ${titular} - Saldo: R$ ${this.saldo.toFixed(2)}`;
        }
        pode_sacar(valor) {
          return this.saldo >= valor;
        }
        saque(valor) {
          if (this.pode_sacar(valor)) {
            this.saldo -= valor;
            this.operacoes.push(["SAQUE", valor]);
            return true;
          }
          return false;
        }
        deposito(valor) {
          this.saldo += valor;
          this.operacoes.push(["DEPÓSITO", valor]);
        }
        extrato() {
          let out = `====================================\n`;
          out += `EXTRATO BANCÁRIO - CONTA Nº ${this.numero}\n`;
          out += `Titular(es): ${this.clientes.map(c => c.nome).join(", ")}\n`;
          out += `Tipo: CONTA COMUM\n`;
          out += `------------------------------------\n`;
          for (let op of this.operacoes) {
            out += `${op[0].padEnd(18)} R$ ${op[1].toFixed(2).padStart(9)}\n`;
          }
          out += `------------------------------------\n`;
          out += `SALDO ATUAL:        R$ ${this.saldo.toFixed(2).padStart(9)}\n`;
          out += `====================================`;
          return out;
        }
      }

      class ContaEspecial extends Conta {
        constructor(clientes, numero, saldo = 0, limite = 1000) {
          super(clientes, numero, saldo);
          this.limite = limite;
        }
        resumo() {
          const titular = this.clientes.map(c => c.nome).join(", ");
          return `ContaEspecial Nº ${this.numero} - Titular: ${titular} - Saldo: R$ ${this.saldo.toFixed(2)} (Limite: R$ ${this.limite.toFixed(2)})`;
        }
        pode_sacar(valor) {
          return (this.saldo + this.limite) >= valor;
        }
        extrato() {
          let out = `====================================\n`;
          out += `EXTRATO BANCÁRIO - CONTA Nº ${this.numero}\n`;
          out += `Titular(es): ${this.clientes.map(c => c.nome).join(", ")}\n`;
          out += `Tipo: CONTA ESPECIAL COM LIMITE\n`;
          out += `------------------------------------\n`;
          for (let op of this.operacoes) {
            out += `${op[0].padEnd(18)} R$ ${op[1].toFixed(2).padStart(9)}\n`;
          }
          out += `------------------------------------\n`;
          out += `SALDO DISPONÍVEL:   R$ ${this.saldo.toFixed(2).padStart(9)}\n`;
          out += `LIMITE DE CRÉDITO:  R$ ${this.limite.toFixed(2).padStart(9)}\n`;
          out += `TOTAL PARA SAQUE:   R$ ${(this.saldo + this.limite).toFixed(2).padStart(9)}\n`;
          out += `====================================`;
          return out;
        }
      }

      let contas = [];
      let nextContaId = 101;

      // Initial instances
      const c1 = new Cliente("João Silva", "9888-1111");
      const c2 = new Cliente("Maria Souza", "9777-2222");
      contas.push(new Conta(c1, nextContaId++, 500));
      contas.push(new ContaEspecial(c2, nextContaId++, 100, 1000));

      const elTitular = mount.querySelector("#bk-titular");
      const elSaldoIni = mount.querySelector("#bk-saldo-ini");
      const elTipoConta = mount.querySelector("#bk-tipo-conta");
      const elLimite = mount.querySelector("#bk-limite");
      const elBtnCriar = mount.querySelector("#bk-btn-criar");
      const elSelConta = mount.querySelector("#bk-sel-conta");
      const elValOp = mount.querySelector("#bk-val-op");
      const elBtnDeposito = mount.querySelector("#bk-btn-deposito");
      const elBtnSaque = mount.querySelector("#bk-btn-saque");
      const elMsg = mount.querySelector("#bk-msg");
      const elExtratoView = mount.querySelector("#bk-extrato-view");

      elTipoConta.addEventListener("change", () => {
        elLimite.style.display = elTipoConta.value === "especial" ? "inline-block" : "none";
      });

      function updateContaSelect() {
        elSelConta.innerHTML = "";
        contas.forEach((conta, idx) => {
          const opt = document.createElement("option");
          opt.value = idx;
          opt.textContent = conta.resumo();
          elSelConta.appendChild(opt);
        });
        showExtrato();
      }

      function showExtrato() {
        const idx = parseInt(elSelConta.value, 10);
        if (isNaN(idx) || !contas[idx]) {
          elExtratoView.textContent = "Nenhuma conta selecionada.";
          return;
        }
        elExtratoView.textContent = contas[idx].extrato();
      }

      elBtnCriar.addEventListener("click", () => {
        const nome = elTitular.value.trim() || "Cliente Anônimo";
        const saldo = parseFloat(elSaldoIni.value) || 0;
        const tipo = elTipoConta.value;
        const cli = new Cliente(nome);

        if (tipo === "especial") {
          const lim = parseFloat(elLimite.value) || 1000;
          contas.push(new ContaEspecial(cli, nextContaId++, saldo, lim));
        } else {
          contas.push(new Conta(cli, nextContaId++, saldo));
        }

        elTitular.value = "";
        updateContaSelect();
        elSelConta.value = contas.length - 1;
        showExtrato();
      });

      elBtnDeposito.addEventListener("click", () => {
        const idx = parseInt(elSelConta.value, 10);
        const val = parseFloat(elValOp.value) || 0;
        if (val <= 0 || !contas[idx]) return;

        contas[idx].deposito(val);
        elMsg.style.display = "block";
        elMsg.style.background = "#dcfce7";
        elMsg.style.color = "#15803d";
        elMsg.textContent = `Depósito de R$ ${val.toFixed(2)} efetuado com sucesso!`;
        updateContaSelect();
        elSelConta.value = idx;
        showExtrato();
      });

      elBtnSaque.addEventListener("click", () => {
        const idx = parseInt(elSelConta.value, 10);
        const val = parseFloat(elValOp.value) || 0;
        if (val <= 0 || !contas[idx]) return;

        const ok = contas[idx].saque(val);
        elMsg.style.display = "block";
        if (ok) {
          elMsg.style.background = "#dcfce7";
          elMsg.style.color = "#15803d";
          elMsg.textContent = `Saque de R$ ${val.toFixed(2)} aprovado!`;
        } else {
          elMsg.style.background = "#fee2e2";
          elMsg.style.color = "#b91c1c";
          elMsg.textContent = `Saque de R$ ${val.toFixed(2)} recusado! Saldo insuficiente (mesmo com limite).`;
        }
        updateContaSelect();
        elSelConta.value = idx;
        showExtrato();
      });

      elSelConta.addEventListener("change", showExtrato);
      updateContaSelect();

      // --- LOGIC 2: MÉTODOS MÁGICOS (ListaÚnica) ---
      class ListaUnica {
        constructor() {
          this.lista = [];
        }
        adiciona(elem) {
          // Verifica se é inteiro
          if (typeof elem !== "number" || !Number.isInteger(elem)) {
            throw new Error("TypeError: Elemento deve ser do tipo int.");
          }
          if (this.lista.includes(elem)) {
            return false; // Não adiciona duplicata
          }
          this.lista.push(elem);
          return true;
        }
        len() {
          return this.lista.length;
        }
        getitem(idx) {
          return this.lista[idx] !== undefined ? this.lista[idx] : "IndexError";
        }
      }

      const lu = new ListaUnica();
      lu.adiciona(10);
      lu.adiciona(25);

      const elLuInput = mount.querySelector("#lu-input-elem");
      const elLuBtnAdiciona = mount.querySelector("#lu-btn-adiciona");
      const elLuStatus = mount.querySelector("#lu-status");
      const elLuLenRes = mount.querySelector("#lu-len-res");
      const elLuItem0Res = mount.querySelector("#lu-item0-res");
      const elLuListView = mount.querySelector("#lu-list-view");

      function updateLuUI() {
        elLuLenRes.textContent = lu.len();
        elLuItem0Res.textContent = lu.getitem(0);
        let out = "";
        lu.lista.forEach((item, i) => {
          out += `lu[${i}] -> ${item}\n`;
        });
        elLuListView.textContent = out || "[Lista Vazia]";
      }

      elLuBtnAdiciona.addEventListener("click", () => {
        const raw = elLuInput.value.trim();
        elLuInput.value = "";
        const parsed = parseInt(raw, 10);

        if (isNaN(parsed) || raw.includes(".") || raw.includes(",")) {
          elLuStatus.style.color = "#e11d48";
          elLuStatus.textContent = "TypeError: 'Tipo inválido'. Esperado 'int'.";
          return;
        }

        try {
          const added = lu.adiciona(parsed);
          if (added) {
            elLuStatus.style.color = "#059669";
            elLuStatus.textContent = `Elemento ${parsed} inserido com sucesso.`;
          } else {
            elLuStatus.style.color = "#d97706";
            elLuStatus.textContent = `Elemento ${parsed} ignorado (já existe na lista).`;
          }
          updateLuUI();
        } catch (e) {
          elLuStatus.style.color = "#e11d48";
          elLuStatus.textContent = e.message;
        }
      });

      updateLuUI();
    }
  };
})();
