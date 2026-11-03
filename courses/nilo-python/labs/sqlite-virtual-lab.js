// ============================================================================
// coursebook — Laboratório 11: Simulador Relacional SQLite (Virtual In-Memory)
// Baseado no Capítulo 11: Bancos de Dados Relacionais com SQLite3 (Nilo Menezes)
// ============================================================================

window.COURSEBOOK_LABS = window.COURSEBOOK_LABS || {};

window.COURSEBOOK_LABS["sqlite-virtual-lab"] = {
  render(container) {
    // Estado inicial padrão (clone profundo)
    const initialDb = {
      cidades: [
        { id: 1, nome: "São Paulo", populacao: 12396372 },
        { id: 2, nome: "Rio de Janeiro", populacao: 6775561 },
        { id: 3, nome: "Curitiba", populacao: 1963726 },
        { id: 4, nome: "Belo Horizonte", populacao: 2530701 }
      ],
      clientes: [
        { id: 1, nome: "Nilo Menezes", telefone: "99111-2233", cidade_id: 1 },
        { id: 2, nome: "Maria Silva", telefone: "98222-3344", cidade_id: 2 },
        { id: 3, nome: "João Souza", telefone: "97333-4455", cidade_id: 1 },
        { id: 4, nome: "Ana Pereira", telefone: "96444-5566", cidade_id: 3 },
        { id: 5, nome: "Carlos Ramos", telefone: "95555-6677", cidade_id: 4 }
      ],
      precos: [
        { id: 1, produto: "Livro Python Nilo", preco: 74.00 },
        { id: 2, produto: "Caderno Espiral", preco: 18.50 },
        { id: 3, produto: "Caneta Gel", preco: 6.20 },
        { id: 4, produto: "Mochila Executiva", preco: 189.90 }
      ]
    };

    // Estado da transação e banco
    let committedState = JSON.parse(JSON.stringify(initialDb));
    let db = JSON.parse(JSON.stringify(committedState));
    let uncommittedCount = 0;
    let lastQueryResults = null;
    let queryMessage = 'Banco SQLite virtual inicializado (:memory:). Execute comandos SQL ou selecione os exemplos canônicos.';
    let activeInspectorTab = 'clientes';

    function deepCopy(obj) {
      return JSON.parse(JSON.stringify(obj));
    }

    // Mini avaliador SQL
    function executeSql(rawSql) {
      const sql = rawSql.trim().replace(/;$/, "");
      if (!sql) return { success: false, message: "Instrução SQL vazia." };

      const upper = sql.toUpperCase();

      try {
        // 1. SELECT simples ou com JOIN
        if (upper.startsWith("SELECT")) {
          return handleSelect(sql);
        }

        // 2. INSERT INTO
        if (upper.startsWith("INSERT INTO")) {
          return handleInsert(sql);
        }

        // 3. UPDATE
        if (upper.startsWith("UPDATE")) {
          return handleUpdate(sql);
        }

        // 4. DELETE FROM
        if (upper.startsWith("DELETE FROM") || upper.startsWith("DELETE")) {
          return handleDelete(sql);
        }

        // 5. CREATE TABLE
        if (upper.startsWith("CREATE TABLE")) {
          return handleCreateTable(sql);
        }

        return { success: false, message: "Comando SQL não reconhecido pelo parser de simulação. Use SELECT, INSERT, UPDATE, DELETE ou CREATE TABLE." };
      } catch (err) {
        return { success: false, message: `Erro de Sintaxe SQL: ${err.message}` };
      }
    }

    function handleSelect(sql) {
      const upper = sql.toUpperCase();

      // Verifica se é agregação GROUP BY cidades
      if (upper.includes("GROUP BY") && upper.includes("CIDADES")) {
        const rows = [];
        db.cidades.forEach(cid => {
          const count = db.clientes.filter(c => c.cidade_id === cid.id).length;
          rows.push({ "cidade": cid.nome, "total_clientes": count });
        });
        return {
          success: true,
          columns: ["cidade", "total_clientes"],
          rows: rows,
          rowCount: rows.length,
          message: `Consulta realizada com sucesso. ${rows.length} grupos retornados.`
        };
      }

      // Verifica se é JOIN clientes e cidades
      if (upper.includes("FROM CLIENTES") && upper.includes("JOIN CIDADES")) {
        let rows = db.clientes.map(cli => {
          const cid = db.cidades.find(c => c.id === cli.cidade_id);
          return {
            "cliente_id": cli.id,
            "nome": cli.nome,
            "telefone": cli.telefone,
            "cidade": cid ? cid.nome : "(Sem Cidade)",
            "populacao_cidade": cid ? cid.populacao.toLocaleString("pt-BR") : "0"
          };
        });

        if (upper.includes("ORDER BY NOME")) {
          rows.sort((a, b) => a.nome.localeCompare(b.nome));
        }

        return {
          success: true,
          columns: ["cliente_id", "nome", "telefone", "cidade", "populacao_cidade"],
          rows: rows,
          rowCount: rows.length,
          message: `INNER JOIN executado: ${rows.length} registros correlacionados.`
        };
      }

      // SELECT simples em tabela específica
      let tableName = null;
      for (const t of Object.keys(db)) {
        if (new RegExp(`\\bFROM\\s+${t}\\b`, "i").test(sql)) {
          tableName = t;
          break;
        }
      }

      if (!tableName) {
        return { success: false, message: "Tabela não encontrada na consulta SELECT." };
      }

      let data = deepCopy(db[tableName]);
      if (data.length === 0) {
        return { success: true, columns: ["status"], rows: [{ status: "Tabela vazia" }], rowCount: 0, message: `Tabela ${tableName} não possui registros.` };
      }

      // Tratamento básico de WHERE
      const whereMatch = sql.match(/WHERE\s+(.+?)(\s+ORDER\s+BY|\s+LIMIT|$)/i);
      if (whereMatch) {
        const cond = whereMatch[1].trim();
        data = filterData(data, cond);
      }

      // ORDER BY
      const orderMatch = sql.match(/ORDER\s+BY\s+(\w+)(\s+DESC|\s+ASC)?/i);
      if (orderMatch) {
        const col = orderMatch[1];
        const isDesc = (orderMatch[2] || "").trim().toUpperCase() === "DESC";
        data.sort((a, b) => {
          if (a[col] < b[col]) return isDesc ? 1 : -1;
          if (a[col] > b[col]) return isDesc ? -1 : 1;
          return 0;
        });
      }

      // LIMIT
      const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) {
        data = data.slice(0, parseInt(limitMatch[1], 10));
      }

      const columns = Object.keys(data[0] || (db[tableName][0] || { id: 0 }));
      return {
        success: true,
        columns: columns,
        rows: data,
        rowCount: data.length,
        message: `SELECT concluído na tabela '${tableName}'. ${data.length} linha(s) retornada(s).`
      };
    }

    function filterData(rows, cond) {
      // Suporte a = , >, <, LIKE
      return rows.filter(item => {
        // Ex: preco > 50
        const gt = cond.match(/(\w+)\s*>\s*([0-9.]+)/);
        if (gt) return Number(item[gt[1]]) > Number(gt[2]);

        const lt = cond.match(/(\w+)\s*<\s*([0-9.]+)/);
        if (lt) return Number(item[lt[1]]) < Number(lt[2]);

        const eqNum = cond.match(/(\w+)\s*=\s*([0-9]+)/);
        if (eqNum) return Number(item[eqNum[1]]) === Number(eqNum[2]);

        const eqStr = cond.match(/(\w+)\s*=\s*['"](.+?)['"]/);
        if (eqStr) return String(item[eqStr[1]]).toLowerCase() === eqStr[2].toLowerCase();

        const like = cond.match(/(\w+)\s+LIKE\s+['"]%?(.+?)%?['"]/i);
        if (like) return String(item[like[1]]).toLowerCase().includes(like[2].toLowerCase());

        return true;
      });
    }

    function handleInsert(sql) {
      // Ex: INSERT INTO precos (produto, preco) VALUES ('Teclado', 120.0)
      const match = sql.match(/INSERT\s+INTO\s+(\w+)\s*(?:\(([^)]+)\))?\s*VALUES\s*\(([^)]+)\)/i);
      if (!match) {
        return { success: false, message: "Sintaxe de INSERT incorreta. Utilize: INSERT INTO tabela (cols...) VALUES (valores...)" };
      }
      const table = match[1].toLowerCase();
      if (!db[table]) {
        return { success: false, message: `Tabela '${table}' não existe.` };
      }

      const colsRaw = match[2];
      const valsRaw = match[3];

      const vals = valsRaw.split(",").map(v => {
        let clean = v.trim();
        if ((clean.startsWith("'") && clean.endsWith("'")) || (clean.startsWith('"') && clean.endsWith('"'))) {
          return clean.slice(1, -1);
        }
        if (!isNaN(clean)) return Number(clean);
        return clean;
      });

      const nextId = db[table].reduce((max, r) => Math.max(max, r.id || 0), 0) + 1;
      let newRow = { id: nextId };

      if (colsRaw) {
        const cols = colsRaw.split(",").map(c => c.trim());
        cols.forEach((c, idx) => {
          newRow[c] = vals[idx] !== undefined ? vals[idx] : null;
        });
      } else {
        // Mapeia na ordem dos atributos existentes
        const sampleCols = Object.keys(db[table][0] || { id: 0 }).filter(k => k !== 'id');
        sampleCols.forEach((c, idx) => {
          newRow[c] = vals[idx] !== undefined ? vals[idx] : null;
        });
      }

      db[table].push(newRow);
      uncommittedCount++;
      activeInspectorTab = table;

      return {
        success: true,
        rowCount: 1,
        message: `INSERT INTO ${table} executado com sucesso (id gerado: ${nextId}). [Pendente de conn.commit()]`
      };
    }

    function handleUpdate(sql) {
      // Ex: UPDATE precos SET preco = 79.90 WHERE id = 1
      const match = sql.match(/UPDATE\s+(\w+)\s+SET\s+(.+?)(?:\s+WHERE\s+(.+))?$/i);
      if (!match) {
        return { success: false, message: "Sintaxe de UPDATE incorreta. Utilize: UPDATE tabela SET col = valor [WHERE condicao]" };
      }
      const table = match[1].toLowerCase();
      if (!db[table]) {
        return { success: false, message: `Tabela '${table}' não existe.` };
      }

      const setAssignments = match[2].split(",").map(s => s.trim());
      const whereCond = match[3];

      let affected = 0;
      db[table].forEach(row => {
        let matchWhere = true;
        if (whereCond) {
          matchWhere = filterData([row], whereCond).length > 0;
        }
        if (matchWhere) {
          setAssignments.forEach(assign => {
            const parts = assign.split("=");
            if (parts.length === 2) {
              const col = parts[0].trim();
              let val = parts[1].trim();
              if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
                val = val.slice(1, -1);
              } else if (!isNaN(val)) {
                val = Number(val);
              }
              row[col] = val;
            }
          });
          affected++;
        }
      });

      if (affected > 0) {
        uncommittedCount++;
      }
      activeInspectorTab = table;

      return {
        success: true,
        rowCount: affected,
        message: `UPDATE em '${table}' concluído. cursor.rowcount = ${affected} linha(s) modificada(s). [Pendente de conn.commit()]`
      };
    }

    function handleDelete(sql) {
      // Ex: DELETE FROM precos WHERE id = 3
      const match = sql.match(/DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?$/i);
      if (!match) {
        return { success: false, message: "Sintaxe de DELETE incorreta. Utilize: DELETE FROM tabela [WHERE condicao]" };
      }
      const table = match[1].toLowerCase();
      if (!db[table]) {
        return { success: false, message: `Tabela '${table}' não existe.` };
      }

      const whereCond = match[2];
      const initialLen = db[table].length;

      if (!whereCond) {
        // Perigo! Deletou tudo
        db[table] = [];
      } else {
        db[table] = db[table].filter(row => filterData([row], whereCond).length === 0);
      }

      const affected = initialLen - db[table].length;
      if (affected > 0) {
        uncommittedCount++;
      }
      activeInspectorTab = table;

      return {
        success: true,
        rowCount: affected,
        message: `DELETE FROM '${table}' executado. cursor.rowcount = ${affected} linha(s) removida(s). ${!whereCond ? '⚠️ ATENÇÃO: Sem cláusula WHERE, todos os registros foram apagados!' : ''} [Pendente de conn.commit()]`
      };
    }

    function handleCreateTable(sql) {
      const match = sql.match(/CREATE\s+TABLE\s+(\w+)\s*\((.+)\)/i);
      if (!match) {
        return { success: false, message: "Sintaxe de CREATE TABLE incorreta." };
      }
      const table = match[1].toLowerCase();
      if (db[table]) {
        return { success: false, message: `Tabela '${table}' já existe no banco de dados.` };
      }
      db[table] = [];
      uncommittedCount++;
      activeInspectorTab = table;
      return {
        success: true,
        rowCount: 0,
        message: `Tabela '${table}' criada no SQLite em memória com sucesso.`
      };
    }

    // Renderizador da UI do Lab
    function renderApp() {
      container.innerHTML = `
        <div class="sqlite-lab-wrapper" style="font-family: var(--cb-font-sans, 'Inter', sans-serif); color: var(--cb-ink, #121212);">
          
          <!-- Topo: Informações do Motor e Estado Transacional -->
          <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; background:#f4eedb; border:2px solid #121212; padding:0.75rem 1rem; margin-bottom:1rem; box-shadow:3px 3px 0 #121212; gap:0.5rem;">
            <div>
              <span style="font-family:'Space Mono', monospace; font-size:0.75rem; text-transform:uppercase; font-weight:bold; background:#121212; color:#fff; padding:0.2rem 0.5rem; margin-right:0.5rem;">
                SQLite3 Virtual :memory:
              </span>
              <span style="font-family:'Space Mono', monospace; font-size:0.85rem; font-weight:600;">
                Modo Transacional Ativo
              </span>
            </div>
            
            <div style="display:flex; align-items:center; gap:0.75rem; font-family:'Space Mono', monospace; font-size:0.8rem;">
              <span style="padding:0.25rem 0.6rem; border:1px solid #121212; background:${uncommittedCount > 0 ? '#ffea79' : '#e6f4ea'}; font-weight:bold;">
                ${uncommittedCount > 0 ? `⚠️ ${uncommittedCount} alteração(ões) pendente(s)` : '✓ Sincronizado (Sem pendências)'}
              </span>
              <button id="btn-commit" style="background:#121212; color:#fff; border:1px solid #121212; padding:0.35rem 0.75rem; font-family:'Space Mono', monospace; font-size:0.75rem; font-weight:bold; cursor:pointer;" title="Salva permanentemente as alterações no banco (conn.commit())">
                💾 conn.commit()
              </button>
              <button id="btn-rollback" style="background:#fff; color:#b00020; border:1px solid #b00020; padding:0.35rem 0.75rem; font-family:'Space Mono', monospace; font-size:0.75rem; font-weight:bold; cursor:pointer;" title="Reverte todas as alterações não commitadas (conn.rollback())">
                ↩️ conn.rollback()
              </button>
              <button id="btn-reset" style="background:#fff; color:#121212; border:1px solid #121212; padding:0.35rem 0.5rem; font-family:'Space Mono', monospace; font-size:0.75rem; cursor:pointer;" title="Reiniciar banco original">
                🔄 Resetar Banco
              </button>
            </div>
          </div>

          <!-- Presets de Exemplos do Livro -->
          <div style="background:#fff; border:2px solid #121212; padding:0.75rem 1rem; margin-bottom:1rem; box-shadow:3px 3px 0 #121212;">
            <div style="font-family:'Space Mono', monospace; font-size:0.75rem; text-transform:uppercase; font-weight:bold; margin-bottom:0.5rem; color:#666;">
              Exemplos Canônicos do Capítulo 11 (Nilo Menezes):
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
              <button class="preset-btn" data-sql="SELECT c.id, c.nome, c.telefone, cid.nome as cidade FROM clientes c JOIN cidades cid ON c.cidade_id = cid.id ORDER BY c.nome;">
                1. Clientes e Cidades (JOIN)
              </button>
              <button class="preset-btn" data-sql="INSERT INTO precos (produto, preco) VALUES ('Cabo USB Tipo-C', 29.90);">
                2. Inserir Produto (INSERT)
              </button>
              <button class="preset-btn" data-sql="UPDATE precos SET preco = 79.90 WHERE produto = 'Livro Python Nilo';">
                3. Atualizar Preço (UPDATE com WHERE)
              </button>
              <button class="preset-btn" data-sql="DELETE FROM clientes WHERE id = 5;">
                4. Excluir Registro (DELETE)
              </button>
              <button class="preset-btn" data-sql="SELECT cidade, total_clientes FROM cidades GROUP BY cidades;">
                5. Agrupamento e Contagem (GROUP BY)
              </button>
              <button class="preset-btn" data-mode="injection" style="background:#fff0f2; border-color:#b00020; color:#b00020;">
                🛡️ Demo: SQL Injection vs ? Seguro
              </button>
            </div>
          </div>

          <!-- Área do Editor SQL e Botão Executar -->
          <div style="display:grid; grid-template-columns: 1fr 340px; gap:1rem; margin-bottom:1rem;">
            
            <!-- Coluna Esquerda: Editor e Resultados -->
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              <div style="background:#fff; border:2px solid #121212; padding:1rem; box-shadow:3px 3px 0 #121212;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                  <label for="sql-input" style="font-family:'Space Mono', monospace; font-size:0.8rem; font-weight:bold; text-transform:uppercase;">
                    Console SQL (cursor.execute):
                  </label>
                  <button id="btn-run-sql" style="background:#121212; color:#fff; border:none; padding:0.45rem 1.25rem; font-family:'Space Mono', monospace; font-size:0.85rem; font-weight:bold; cursor:pointer; box-shadow:2px 2px 0 #666;">
                    ▶ Executar SQL (Ctrl+Enter)
                  </button>
                </div>
                <textarea id="sql-input" rows="4" style="width:100%; box-sizing:border-box; font-family:'Space Mono', monospace; font-size:0.85rem; padding:0.6rem; border:1px solid #121212; background:#fafafa; resize:vertical;" placeholder="Digite aqui o comando SQL (ex: SELECT * FROM precos WHERE preco > 20)...">SELECT * FROM precos;</textarea>
              </div>

              <!-- Mensagem de Feedback e cursor.rowcount -->
              <div id="sql-message" style="background:#f9f9f9; border-left:4px solid #121212; border:1px solid #ddd; border-left-width:4px; padding:0.6rem 0.85rem; font-family:'Space Mono', monospace; font-size:0.8rem;">
                ${queryMessage}
              </div>

              <!-- Tabela de Resultados do SELECT -->
              <div style="background:#fff; border:2px solid #121212; padding:1rem; box-shadow:3px 3px 0 #121212; min-height:160px; overflow-x:auto;">
                <div style="font-family:'Space Mono', monospace; font-size:0.8rem; font-weight:bold; margin-bottom:0.5rem; text-transform:uppercase; color:#444;">
                  Resultados da Consulta (cursor.fetchall()):
                </div>
                <div id="results-table-container">
                  ${renderResultsTable()}
                </div>
              </div>
            </div>

            <!-- Coluna Direita: Inspetor de Tabelas do Banco de Dados -->
            <div style="background:#fff; border:2px solid #121212; padding:1rem; box-shadow:3px 3px 0 #121212; display:flex; flex-direction:column;">
              <div style="font-family:'Space Mono', monospace; font-size:0.8rem; font-weight:bold; text-transform:uppercase; margin-bottom:0.75rem; border-bottom:2px solid #121212; padding-bottom:0.35rem;">
                🗄️ Tabelas no Banco (:memory:)
              </div>

              <!-- Abas das tabelas -->
              <div style="display:flex; gap:0.25rem; margin-bottom:0.75rem; border-bottom:1px solid #ccc; padding-bottom:0.25rem;">
                ${Object.keys(db).map(tbl => `
                  <button class="tbl-tab-btn" data-tbl="${tbl}" style="background:${activeInspectorTab === tbl ? '#121212' : '#f0f0f0'}; color:${activeInspectorTab === tbl ? '#fff' : '#121212'}; border:1px solid #121212; padding:0.25rem 0.5rem; font-family:'Space Mono', monospace; font-size:0.75rem; cursor:pointer;">
                    ${tbl} (${db[tbl].length})
                  </button>
                `).join('')}
              </div>

              <!-- Visualização da Tabela Ativa -->
              <div id="table-inspector-content" style="flex:1; overflow-y:auto; max-height:360px;">
                ${renderInspectorTable(activeInspectorTab)}
              </div>
            </div>

          </div>

          <!-- Modal Interativo: Demonstração de SQL Injection -->
          <div id="injection-modal" style="display:none; background:#fff; border:3px solid #b00020; padding:1.25rem; margin-top:1rem; box-shadow:4px 4px 0 #121212;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
              <h3 style="margin:0; font-family:'Newsreader', serif; font-size:1.35rem; color:#b00020;">
                🛡️ Laboratório de Prevenção: SQL Injection vs Parâmetros '?'
              </h3>
              <button id="close-injection-btn" style="background:none; border:none; font-size:1.2rem; cursor:pointer; font-weight:bold;">✕</button>
            </div>
            
            <p style="font-size:0.9rem; line-height:1.4; margin-bottom:0.75rem;">
              No Capítulo 11 (pp. 268-270), o autor enfatiza o perigo mortal de concatenar strings de entrada do usuário diretamente no comando SQL. Veja a diferença na prática:
            </p>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
              <div style="border:1px solid #b00020; background:#fff5f5; padding:0.75rem;">
                <div style="font-family:'Space Mono', monospace; font-size:0.8rem; font-weight:bold; color:#b00020; margin-bottom:0.4rem;">
                  ❌ FORMA INSEGURA (Interpolação direta de Strings):
                </div>
                <div style="font-family:'Space Mono', monospace; font-size:0.75rem; background:#fff; padding:0.5rem; border:1px solid #fcc; margin-bottom:0.5rem;">
                  f"SELECT * FROM clientes WHERE nome = '{userInput}'"
                </div>
                <p style="font-size:0.8rem; color:#666; margin-bottom:0.5rem;">
                  Se o usuário digitar <code>' OR '1'='1</code>, a instrução SQL torna-se verdadeira para todas as linhas e expõe a base inteira!
                </p>
                <button id="demo-injection-vuln" style="background:#b00020; color:#fff; border:none; padding:0.4rem 0.75rem; font-family:'Space Mono', monospace; font-size:0.75rem; cursor:pointer; font-weight:bold;">
                  Simular Ataque Inseguro
                </button>
              </div>

              <div style="border:1px solid #2e7d32; background:#f4faf5; padding:0.75rem;">
                <div style="font-family:'Space Mono', monospace; font-size:0.8rem; font-weight:bold; color:#2e7d32; margin-bottom:0.4rem;">
                  ✅ FORMA SEGURA (Tupla de Parâmetros com '?'):
                </div>
                <div style="font-family:'Space Mono', monospace; font-size:0.75rem; background:#fff; padding:0.5rem; border:1px solid #cfc; margin-bottom:0.5rem;">
                  cursor.execute("SELECT * FROM clientes WHERE nome = ?", (userInput,))
                </div>
                <p style="font-size:0.8rem; color:#666; margin-bottom:0.5rem;">
                  O SQLite trata o valor estritamente como dado literal (escapado internamente). Nenhum caractere especial de controle SQL será executado!
                </p>
                <button id="demo-injection-safe" style="background:#2e7d32; color:#fff; border:none; padding:0.4rem 0.75rem; font-family:'Space Mono', monospace; font-size:0.75rem; cursor:pointer; font-weight:bold;">
                  Simular Busca Segura com '?'
                </button>
              </div>
            </div>
          </div>

        </div>
      `;

      bindEvents();
    }

    function renderResultsTable() {
      if (!lastQueryResults) {
        return `<div style="color:#777; font-size:0.85rem; font-style:italic;">Nenhum conjunto de registros em memória. Execute um comando SELECT.</div>`;
      }
      if (!lastQueryResults.success) {
        return `<div style="color:#b00020; font-family:'Space Mono', monospace; font-size:0.85rem;">Erro: ${lastQueryResults.message}</div>`;
      }
      if (lastQueryResults.rows.length === 0) {
        return `<div style="color:#666; font-size:0.85rem;">Consulta válida executada. (0 linhas retornadas)</div>`;
      }

      const cols = lastQueryResults.columns;
      return `
        <table style="width:100%; border-collapse:collapse; font-family:'Space Mono', monospace; font-size:0.8rem; text-align:left;">
          <thead>
            <tr style="background:#f0f0f0; border-bottom:2px solid #121212;">
              <th style="padding:0.4rem; border:1px solid #ddd; width:40px;">#</th>
              ${cols.map(c => `<th style="padding:0.4rem; border:1px solid #ddd;">${c}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${lastQueryResults.rows.map((row, idx) => `
              <tr style="background:${idx % 2 === 0 ? '#fff' : '#fcfcfc'}; border-bottom:1px solid #eee;">
                <td style="padding:0.4rem; border:1px solid #ddd; color:#888;">${idx + 1}</td>
                ${cols.map(c => `<td style="padding:0.4rem; border:1px solid #ddd;">${row[c] !== undefined && row[c] !== null ? row[c] : '<span style="color:#999;">NULL</span>'}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    function renderInspectorTable(tbl) {
      const rows = db[tbl] || [];
      if (rows.length === 0) {
        return `<div style="padding:0.5rem; color:#888; font-size:0.8rem; font-style:italic;">Tabela '${tbl}' está vazia no momento.</div>`;
      }
      const cols = Object.keys(rows[0]);
      return `
        <table style="width:100%; border-collapse:collapse; font-family:'Space Mono', monospace; font-size:0.75rem;">
          <thead>
            <tr style="background:#f7f7f7; border-bottom:1px solid #ccc;">
              ${cols.map(c => `<th style="padding:0.35rem; border:1px solid #eee; text-align:left;">${c}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr style="border-bottom:1px solid #eee;">
                ${cols.map(c => `<td style="padding:0.35rem; border:1px solid #eee;">${r[c] !== null && r[c] !== undefined ? r[c] : 'NULL'}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    function bindEvents() {
      const sqlInput = container.querySelector("#sql-input");
      const btnRun = container.querySelector("#btn-run-sql");
      const btnCommit = container.querySelector("#btn-commit");
      const btnRollback = container.querySelector("#btn-rollback");
      const btnReset = container.querySelector("#btn-reset");

      // Executar SQL
      function runCurrentQuery() {
        const sql = sqlInput.value.trim();
        const res = executeSql(sql);
        if (res.success && res.rows) {
          lastQueryResults = res;
        } else if (res.success) {
          lastQueryResults = null;
        } else {
          lastQueryResults = { success: false, message: res.message };
        }
        queryMessage = res.message;
        renderApp();
      }

      btnRun.addEventListener("click", runCurrentQuery);
      sqlInput.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.preventDefault();
          runCurrentQuery();
        }
      });

      // Commit
      btnCommit.addEventListener("click", () => {
        committedState = deepCopy(db);
        uncommittedCount = 0;
        queryMessage = "✓ conn.commit(): Transação finalizada e persistida. Alterações salvas no banco com integridade.";
        renderApp();
      });

      // Rollback
      btnRollback.addEventListener("click", () => {
        db = deepCopy(committedState);
        uncommittedCount = 0;
        lastQueryResults = null;
        queryMessage = "↩️ conn.rollback(): Transação abortada! Todos os INSERTs, UPDATEs e DELETEs não commitados foram desfeitos.";
        renderApp();
      });

      // Reset
      btnReset.addEventListener("click", () => {
        committedState = deepCopy(initialDb);
        db = deepCopy(initialDb);
        uncommittedCount = 0;
        lastQueryResults = null;
        queryMessage = "Banco restaurado ao estado inicial canônico.";
        renderApp();
      });

      // Presets
      container.querySelectorAll(".preset-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          if (btn.dataset.mode === "injection") {
            const modal = container.querySelector("#injection-modal");
            modal.style.display = modal.style.display === "none" ? "block" : "none";
            return;
          }
          sqlInput.value = btn.dataset.sql;
          runCurrentQuery();
        });
      });

      // Fechar modal injection
      const closeInj = container.querySelector("#close-injection-btn");
      if (closeInj) {
        closeInj.addEventListener("click", () => {
          container.querySelector("#injection-modal").style.display = "none";
        });
      }

      // Demo vulnerável
      const demoVuln = container.querySelector("#demo-injection-vuln");
      if (demoVuln) {
        demoVuln.addEventListener("click", () => {
          // SQL Injection clássico
          sqlInput.value = "SELECT * FROM clientes WHERE nome = '' OR '1'='1';";
          runCurrentQuery();
          queryMessage = "⚠️ INJEÇÃO EXECUTADA COM SUCESSO: A condição '1'='1' contornou a checagem e expôs toda a tabela de clientes!";
          container.querySelector("#sql-message").innerHTML = queryMessage;
          container.querySelector("#sql-message").style.borderLeftColor = "#b00020";
        });
      }

      // Demo seguro
      const demoSafe = container.querySelector("#demo-injection-safe");
      if (demoSafe) {
        demoSafe.addEventListener("click", () => {
          sqlInput.value = "SELECT * FROM clientes WHERE nome = 'Nilo Menezes';";
          runCurrentQuery();
          queryMessage = "✅ PARÂMETRO '?' SEGURO: Apenas o registro estritamente correspondente ao texto é retornado com total proteção.";
          container.querySelector("#sql-message").innerHTML = queryMessage;
          container.querySelector("#sql-message").style.borderLeftColor = "#2e7d32";
        });
      }

      // Abas de inspetor de tabela
      container.querySelectorAll(".tbl-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          activeInspectorTab = btn.dataset.tbl;
          renderApp();
        });
      });
    }

    renderApp();
  }
};
