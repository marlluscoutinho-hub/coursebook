// ============================================================================
// coursebook — Laboratório 12: Depurador de Tracebacks & Sandbox de Exceções
// Baseado no Capítulo 12 e Apêndice A: Guia de Erros e Boas Práticas (Nilo Menezes)
// ============================================================================

window.COURSEBOOK_LABS = window.COURSEBOOK_LABS || {};

window.COURSEBOOK_LABS["traceback-debugger"] = {
  render(container) {
    const errorScenarios = [
      {
        id: "zerodiv",
        title: "ZeroDivisionError",
        badge: "Erro Matemático",
        code: `def calcula_media(total, quantidade):\n    return total / quantidade\n\n# Simulando lista vazia\ntotal_vendas = 1500.0\nnum_vendas = 0\nmedia = calcula_media(total_vendas, num_vendas)`,
        errorType: "ZeroDivisionError",
        errorMsg: "division by zero",
        line: 2,
        func: "calcula_media",
        file: "calculadora.py",
        cause: "O denominador de uma divisão ou operação de módulo (%) resultou exatamente no número 0.",
        fix: "Adicione uma condicional 'if quantidade > 0:' antes de dividir ou utilize um bloco try/except ZeroDivisionError.",
        tryExceptCode: `def calcula_media(total, quantidade):\n    try:\n        return total / quantidade\n    except ZeroDivisionError:\n        print(\"Aviso: Quantidade é zero. Retornando média 0.0.\")\n        return 0.0\n    finally:\n        print(\"[LOG] Cálculo finalizado.\")\n\nmedia = calcula_media(1500.0, 0)`
      },
      {
        id: "indexerr",
        title: "IndexError",
        badge: "Limite de Lista",
        code: `frutas = [\"maçã\", \"banana\", \"laranja\"]\n# O tamanho é 3, mas os índices válidos são 0, 1 e 2!\nprint(frutas[3])`,
        errorType: "IndexError",
        errorMsg: "list index out of range",
        line: 3,
        func: "<module>",
        file: "sacola.py",
        cause: "Tentativa de acessar uma posição que não existe na sequência. Em Python com N elementos, o último índice é N - 1.",
        fix: "Verifique o comprimento com len(frutas) antes de indexar, use fatiamento (slice frutas[3:]) ou trate com except IndexError.",
        tryExceptCode: `frutas = [\"maçã\", \"banana\", \"laranja\"]\nindice = 3\ntry:\n    item = frutas[indice]\nexcept IndexError:\n    print(f\"Índice {indice} fora da lista (tamanho {len(frutas)}).\")\nelse:\n    print(f\"Fruta encontrada: {item}\")\nfinally:\n    print(\"Operação de acesso encerrada.\")`
      },
      {
        id: "keyerr",
        title: "KeyError",
        badge: "Dicionário",
        code: `aluno = {\"nome\": \"Carlos\", \"nota\": 8.5}\n# Acessando chave não cadastrada sem o método get:\nprint(aluno[\"matricula\"])`,
        errorType: "KeyError",
        errorMsg: "'matricula'",
        line: 3,
        func: "<module>",
        file: "boletim.py",
        cause: "A chave consultada através de colchetes dicionario[chave] não existe no mapeamento.",
        fix: "Utilize o método seguro aluno.get('matricula', 'Não Informada') ou teste com 'if chave in aluno:' antes do acesso.",
        tryExceptCode: `aluno = {\"nome\": \"Carlos\", \"nota\": 8.5}\ntry:\n    matricula = aluno[\"matricula\"]\nexcept KeyError:\n    matricula = aluno.get(\"matricula\", \"MAT-PADRAO-000\")\n    print(\"Chave ausente capturada! Atribuído valor de contingência.\")\nprint(f\"Matrícula final: {matricula}\")`
      },
      {
        id: "typeerr",
        title: "TypeError",
        badge: "Tipos Incompatíveis",
        code: `preco = 49.90\nquantidade = \"5\"  # string recebida de input()\n# Tentando somar ou multiplicar float com str não convertida:\ntotal = preco + quantidade`,
        errorType: "TypeError",
        errorMsg: "unsupported operand type(s) for +: 'float' and 'str'",
        line: 4,
        func: "<module>",
        file: "caixa.py",
        cause: "O operador '+' foi aplicado entre dois operandos de tipos incompatíveis sem coerção de tipo.",
        fix: "Converta a string para número com int() ou float() antes da operação matemática, ou converta o número para str() se a intenção for concatenação.",
        tryExceptCode: `preco = 49.90\nquantidade = \"5\"\ntry:\n    total = preco + float(quantidade)\n    print(f\"Total correto: R$ {total:.2f}\")\nexcept (TypeError, ValueError) as erro:\n    print(f\"Erro na conversão de tipos: {erro}\")`
      },
      {
        id: "valueerr",
        title: "ValueError",
        badge: "Valor Inadequado",
        code: `texto_usuario = \"cem\"\n# O tipo str é aceito por int(), mas o conteúdo textual não é numérico:\nidade = int(texto_usuario)`,
        errorType: "ValueError",
        errorMsg: "invalid literal for int() with base 10: 'cem'",
        line: 3,
        func: "<module>",
        file: "formulario.py",
        cause: "A função int() recebeu um tipo válido (str), mas cujo valor interno não representa dígitos numéricos válidos na base 10.",
        fix: "Trate a entrada com try/except ValueError para solicitar que o usuário digite novamente apenas números.",
        tryExceptCode: `def le_inteiro(prompt):\n    while True:\n        try:\n            return int(input(prompt))\n        except ValueError:\n            print(\"Valor inválido! Digite apenas dígitos inteiros (ex: 100).\")\n            return 100 # Simulação de fallback`
      }
    ];

    let currentScenario = errorScenarios[0];
    let isHandlingActive = false;
    let activeTab = 'traceback'; // 'traceback' ou 'listcomp'

    // Dados de exemplo para list comprehension
    const listCompExamples = [
      {
        title: "1. Quadrados dos Pares",
        source: "[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
        syntax: "[x**2 for x in numeros if x % 2 == 0]",
        explanation: "Filtra apenas números onde x % 2 == 0 e eleva cada um ao quadrado.",
        result: "[4, 16, 36, 64, 100]"
      },
      {
        title: "2. Formatação de Nomes em Caixa Alta",
        source: "['ana', 'pedro', 'mariana', 'joão']",
        syntax: "[nome.capitalize() for nome in nomes if len(nome) > 3]",
        explanation: "Filtra nomes com mais de 3 caracteres e capitaliza a primeira letra.",
        result: "['Pedro', 'Mariana', 'João']"
      },
      {
        title: "3. Reajuste de Preços com Desconto",
        source: "[100.0, 250.0, 40.0, 80.0]",
        syntax: "[round(p * 0.90, 2) for p in precos if p >= 80.0]",
        explanation: "Aplica 10% de desconto (multiplica por 0.90) somente nos itens com preço a partir de R$ 80,00.",
        result: "[90.0, 225.0, 72.0]"
      }
    ];
    let currentListComp = listCompExamples[0];

    function renderApp() {
      container.innerHTML = `
        <div class="traceback-lab-wrapper" style="font-family: var(--cb-font-sans, 'Inter', sans-serif); color: var(--cb-ink, #121212);">
          
          <!-- Topo da Ferramenta -->
          <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; background:#f4eedb; border:2px solid #121212; padding:0.75rem 1rem; margin-bottom:1rem; box-shadow:3px 3px 0 #121212; gap:0.5rem;">
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span style="font-family:'Space Mono', monospace; font-size:0.75rem; text-transform:uppercase; font-weight:bold; background:#121212; color:#fff; padding:0.2rem 0.5rem;">
                Python 3.x Diagnostic Lab
              </span>
              <span style="font-family:'Space Mono', monospace; font-size:0.85rem; font-weight:600;">
                Depurador de Tracebacks e Sandbox
              </span>
            </div>

            <div style="display:flex; gap:0.4rem;">
              <button id="tab-traceback-btn" style="background:${activeTab === 'traceback' ? '#121212' : '#fff'}; color:${activeTab === 'traceback' ? '#fff' : '#121212'}; border:1px solid #121212; padding:0.35rem 0.75rem; font-family:'Space Mono', monospace; font-size:0.8rem; font-weight:bold; cursor:pointer;">
                🔍 Anatomia de Exceções & Try/Except
              </button>
              <button id="tab-listcomp-btn" style="background:${activeTab === 'listcomp' ? '#121212' : '#fff'}; color:${activeTab === 'listcomp' ? '#fff' : '#121212'}; border:1px solid #121212; padding:0.35rem 0.75rem; font-family:'Space Mono', monospace; font-size:0.8rem; font-weight:bold; cursor:pointer;">
                ⚡ List Comprehensions & PEP 8
              </button>
            </div>
          </div>

          ${activeTab === 'traceback' ? renderTracebackTab() : renderListCompTab()}

        </div>
      `;

      bindEvents();
    }

    function renderTracebackTab() {
      return `
        <!-- Presets dos Erros Canônicos do Apêndice A -->
        <div style="background:#fff; border:2px solid #121212; padding:0.75rem 1rem; margin-bottom:1rem; box-shadow:3px 3px 0 #121212;">
          <div style="font-family:'Space Mono', monospace; font-size:0.75rem; text-transform:uppercase; font-weight:bold; margin-bottom:0.5rem; color:#666;">
            Catálogo Canônico de Erros de Execução (Apêndice A):
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
            ${errorScenarios.map(sc => `
              <button class="sc-btn" data-id="${sc.id}" style="background:${currentScenario.id === sc.id ? '#121212' : '#f5f5f5'}; color:${currentScenario.id === sc.id ? '#fff' : '#121212'}; border:1px solid #121212; padding:0.3rem 0.6rem; font-family:'Space Mono', monospace; font-size:0.75rem; cursor:pointer; font-weight:600;">
                ${sc.title}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Painel Principal de Comparação e Depuração -->
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem; margin-bottom:1rem;">
          
          <!-- Coluna Esquerda: Código Fonte com Toggle de Tratamento -->
          <div style="background:#fff; border:2px solid #121212; padding:1rem; box-shadow:3px 3px 0 #121212; display:flex; flex-direction:column;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; border-bottom:1px solid #ddd; padding-bottom:0.5rem;">
              <span style="font-family:'Space Mono', monospace; font-size:0.8rem; font-weight:bold; text-transform:uppercase;">
                📄 Código em Execução (${currentScenario.file})
              </span>
              <button id="toggle-handling-btn" style="background:${isHandlingActive ? '#2e7d32' : '#b00020'}; color:#fff; border:none; padding:0.35rem 0.75rem; font-family:'Space Mono', monospace; font-size:0.75rem; font-weight:bold; cursor:pointer; box-shadow:2px 2px 0 #121212;">
                ${isHandlingActive ? '✅ Com try / except (Tratado)' : '⚠️ Sem Tratamento (Erro Fatal)'}
              </button>
            </div>

            <pre style="background:#1e1e1e; color:#d4d4d4; font-family:'Space Mono', monospace; font-size:0.8rem; padding:0.85rem; border-radius:3px; overflow-x:auto; margin:0; flex:1; line-height:1.5;"><code>${isHandlingActive ? escapeHtml(currentScenario.tryExceptCode) : escapeHtml(currentScenario.code)}</code></pre>

            <div style="margin-top:0.75rem; font-size:0.8rem; line-height:1.4; color:#555;">
              ${isHandlingActive 
                ? '<strong>Proteção Ativada:</strong> O bloco <code>try</code> intercepta a exceção específica, permitindo ao programa recuperar-se elegantemente sem quebrar o processo.' 
                : '<strong>Execução Não Protegida:</strong> Ao encontrar a inconsistência, o interpretador interrompe a execução e emite o traceback abaixo.'}
            </div>
          </div>

          <!-- Coluna Direita: Analisador Visual de Traceback -->
          <div style="background:#fff; border:2px solid #121212; padding:1rem; box-shadow:3px 3px 0 #121212; display:flex; flex-direction:column;">
            <div style="font-family:'Space Mono', monospace; font-size:0.8rem; font-weight:bold; text-transform:uppercase; margin-bottom:0.75rem; border-bottom:1px solid #ddd; padding-bottom:0.5rem; display:flex; justify-content:space-between;">
              <span>🚨 Diagnóstico do Interpretador CPython</span>
              <span style="font-size:0.75rem; background:#eee; padding:0.1rem 0.4rem; border:1px solid #ccc;">
                Leitura de Baixo para Cima
              </span>
            </div>

            ${isHandlingActive ? renderHandledResult() : renderTracebackCards()}
          </div>

        </div>
      `;
    }

    function renderTracebackCards() {
      return `
        <!-- Card de Traceback Formatado -->
        <div style="background:#fff5f5; border:1px solid #b00020; padding:0.75rem; margin-bottom:0.75rem;">
          <div style="font-family:'Space Mono', monospace; font-size:0.75rem; color:#888; margin-bottom:0.4rem;">
            Traceback (most recent call last):
          </div>
          <div style="font-family:'Space Mono', monospace; font-size:0.8rem; padding-left:0.5rem; border-left:3px solid #b00020; margin-bottom:0.5rem;">
            File "<strong>${currentScenario.file}</strong>", line <strong>${currentScenario.line}</strong>, in <code>${currentScenario.func}</code>
          </div>
          <div style="background:#121212; color:#ff6b6b; font-family:'Space Mono', monospace; font-size:0.85rem; font-weight:bold; padding:0.5rem 0.75rem;">
            💥 ${currentScenario.errorType}: ${currentScenario.errorMsg}
          </div>
        </div>

        <!-- Análise Didática e Solução -->
        <div style="background:#fafafa; border:1px solid #ddd; padding:0.75rem; flex:1;">
          <div style="font-family:'Space Mono', monospace; font-size:0.75rem; font-weight:bold; text-transform:uppercase; color:#121212; margin-bottom:0.35rem;">
            🔍 Causa Raiz do Problema:
          </div>
          <p style="font-size:0.85rem; line-height:1.4; margin:0 0 0.6rem 0; color:#333;">
            ${currentScenario.cause}
          </p>

          <div style="font-family:'Space Mono', monospace; font-size:0.75rem; font-weight:bold; text-transform:uppercase; color:#2e7d32; margin-bottom:0.35rem;">
            💡 Como Corrigir Segundo as Boas Práticas:
          </div>
          <p style="font-size:0.85rem; line-height:1.4; margin:0; color:#2e7d32;">
            ${currentScenario.fix}
          </p>
        </div>
      `;
    }

    function renderHandledResult() {
      return `
        <div style="background:#f4faf5; border:2px solid #2e7d32; padding:1rem; flex:1; display:flex; flex-direction:column; justify-content:center;">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.75rem;">
            <span style="font-size:1.5rem;">🛡️</span>
            <div>
              <div style="font-family:'Space Mono', monospace; font-size:0.9rem; font-weight:bold; color:#2e7d32;">
                Exceção Capturada com Sucesso!
              </div>
              <div style="font-size:0.8rem; color:#666;">
                O processo permaneceu vivo e executou o bloco de contingência.
              </div>
            </div>
          </div>

          <div style="background:#fff; border:1px solid #cfc; padding:0.75rem; font-family:'Space Mono', monospace; font-size:0.8rem; line-height:1.5; margin-bottom:0.75rem;">
            <strong>Saída do Terminal:</strong><br/>
            <span style="color:#2e7d32;">&gt;&gt;&gt; [EXCEPT] Exceção ${currentScenario.errorType} interceptada de forma graciosa.</span><br/>
            <span style="color:#555;">&gt;&gt;&gt; [FINALLY] Bloco de garantia de liberação de recursos executado.</span>
          </div>

          <div style="font-size:0.8rem; color:#444; line-height:1.4;">
            <strong>Princípio Canônico do Nilo:</strong> Trate sempre a exceção específica (<code>except ${currentScenario.errorType}:</code>) e evite blocos <code>except:</code> vazios que escondam erros de digitação como <code>NameError</code> ou <code>SyntaxError</code>.
          </div>
        </div>
      `;
    }

    function renderListCompTab() {
      return `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
          
          <!-- Coluna Esquerda: Construtor Interativo de Compreensão de Listas -->
          <div style="background:#fff; border:2px solid #121212; padding:1rem; box-shadow:3px 3px 0 #121212;">
            <div style="font-family:'Space Mono', monospace; font-size:0.8rem; font-weight:bold; text-transform:uppercase; margin-bottom:0.75rem; border-bottom:1px solid #ddd; padding-bottom:0.4rem;">
              ⚡ Compreensão de Listas (List Comprehension)
            </div>

            <div style="margin-bottom:0.75rem;">
              <label style="font-family:'Space Mono', monospace; font-size:0.75rem; font-weight:bold; color:#666;">
                Selecione um Exemplo Canônico:
              </label>
              <div style="display:flex; flex-direction:column; gap:0.4rem; margin-top:0.35rem;">
                ${listCompExamples.map((ex, idx) => `
                  <button class="listcomp-preset-btn" data-idx="${idx}" style="background:${currentListComp.title === ex.title ? '#121212' : '#f9f9f9'}; color:${currentListComp.title === ex.title ? '#fff' : '#121212'}; border:1px solid #121212; padding:0.4rem 0.6rem; font-family:'Space Mono', monospace; font-size:0.75rem; text-align:left; cursor:pointer;">
                    ${ex.title}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Sintaxe Visual Desmembrada -->
            <div style="background:#fafafa; border:1px solid #ddd; padding:0.75rem; margin-bottom:0.75rem;">
              <div style="font-family:'Space Mono', monospace; font-size:0.75rem; font-weight:bold; margin-bottom:0.3rem;">
                Anatomia do Comando:
              </div>
              <div style="font-family:'Space Mono', monospace; font-size:0.85rem; background:#121212; color:#ffea79; padding:0.5rem; border-radius:3px; overflow-x:auto;">
                ${currentListComp.syntax}
              </div>
              <div style="font-size:0.8rem; color:#555; margin-top:0.4rem;">
                ${currentListComp.explanation}
              </div>
            </div>

            <!-- Dados de Entrada e Saída -->
            <div style="font-family:'Space Mono', monospace; font-size:0.8rem;">
              <div style="margin-bottom:0.35rem;">
                <strong>Entrada:</strong> <code>${currentListComp.source}</code>
              </div>
              <div>
                <strong>Resultado:</strong> <code style="color:#2e7d32; font-weight:bold;">${currentListComp.result}</code>
              </div>
            </div>
          </div>

          <!-- Coluna Direita: Guia de Estilo PEP 8 & Zen do Python -->
          <div style="background:#fff; border:2px solid #121212; padding:1rem; box-shadow:3px 3px 0 #121212;">
            <div style="font-family:'Space Mono', monospace; font-size:0.8rem; font-weight:bold; text-transform:uppercase; margin-bottom:0.75rem; border-bottom:1px solid #ddd; padding-bottom:0.4rem;">
              📜 As 5 Regras de Ouro da PEP 8 (Nilo Menezes)
            </div>

            <div style="display:flex; flex-direction:column; gap:0.6rem; font-size:0.85rem; line-height:1.4;">
              <div style="border-left:3px solid #121212; padding-left:0.5rem;">
                <strong>1. Indentação Rígida:</strong> Sempre 4 espaços em branco por nível. Nunca misture tabulações com espaços sob pena de <code>IndentationError</code>.
              </div>

              <div style="border-left:3px solid #121212; padding-left:0.5rem;">
                <strong>2. Convenções de Nomes:</strong>
                <ul style="margin:0.2rem 0 0 1rem; padding:0;">
                  <li>Variáveis e funções: <code>snake_case</code> (ex.: <code>calcula_imposto</code>)</li>
                  <li>Classes: <code>PascalCase</code> (ex.: <code>ContaEspecial</code>)</li>
                  <li>Constantes: <code>MAIUSCULAS</code> (ex.: <code>TAXA_PADRAO</code>)</li>
                </ul>
              </div>

              <div style="border-left:3px solid #121212; padding-left:0.5rem;">
                <strong>3. Comprimento Máximo de Linhas:</strong> Mantenha linhas com até 79 caracteres para legibilidade em monitores divididos.
              </div>

              <div style="border-left:3px solid #121212; padding-left:0.5rem;">
                <strong>4. Espaçamento em Operadores:</strong> Use um espaço antes e depois de operadores de atribuição e comparação (<code>saldo = total + 10</code> e não <code>saldo=total+10</code>).
              </div>

              <div style="border-left:3px solid #121212; padding-left:0.5rem;">
                <strong>5. O Zen do Python (PEP 20):</strong> <em>"Explícito é melhor que implícito. Simples é melhor que complexo. Erros nunca devem passar silenciosamente."</em>
              </div>
            </div>
          </div>

        </div>
      `;
    }

    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    function bindEvents() {
      // Alternância de Abas
      const tabTrace = container.querySelector("#tab-traceback-btn");
      const tabComp = container.querySelector("#tab-listcomp-btn");

      if (tabTrace && tabComp) {
        tabTrace.addEventListener("click", () => {
          activeTab = 'traceback';
          renderApp();
        });
        tabComp.addEventListener("click", () => {
          activeTab = 'listcomp';
          renderApp();
        });
      }

      // Presets de Cenários de Erro
      container.querySelectorAll(".sc-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;
          currentScenario = errorScenarios.find(s => s.id === id) || errorScenarios[0];
          isHandlingActive = false;
          renderApp();
        });
      });

      // Toggle try/except
      const toggleBtn = container.querySelector("#toggle-handling-btn");
      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
          isHandlingActive = !isHandlingActive;
          renderApp();
        });
      }

      // Presets de List Comprehension
      container.querySelectorAll(".listcomp-preset-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.idx, 10);
          currentListComp = listCompExamples[idx] || listCompExamples[0];
          renderApp();
        });
      });
    }

    renderApp();
  }
};
