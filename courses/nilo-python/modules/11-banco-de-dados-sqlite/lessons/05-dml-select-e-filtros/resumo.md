# Síntese da Unidade: Consultas SELECT e Filtros

### Pontos Fundamentais
1. **Comando `SELECT`:** Permite projetar colunas específicas e extrair subconjuntos de dados sem alterar a base.
2. **Três Formas de Iterar:**
   - `for linha in cursor:` Leitura sob demanda (streaming), $\mathcal{O}(1)$ de memória adicional.
   - `cursor.fetchone()`: Recupera o próximo registro individual ou `None`.
   - `cursor.fetchall()`: Carrega todos os registros remanescentes em uma lista em memória.
3. **`sqlite3.Row`:** Configurando `conexao.row_factory = sqlite3.Row`, os registros podem ser lidos pelo nome das colunas (`linha['nome']`).
4. **Filtros com `WHERE`:** Suporta operadores relacionais (`=`, `>`, `<`, `BETWEEN`, `IN`), lógicos (`AND`, `OR`, `NOT`) e de casamento textual (`LIKE` com `%` e `_`).
5. **Ordenação e Paginação:** `ORDER BY coluna ASC/DESC` organiza os resultados e `LIMIT n OFFSET m` divide conjuntos extensos em páginas de navegação.
