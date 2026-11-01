# Síntese da Unidade: Modelagem Relacional, JOIN e GROUP BY

### Pontos Fundamentais
1. **Normalização:** Separa entidades em tabelas distintas (`cidades` e `clientes`) eliminando repetições desnecessárias de dados e facilitando a manutenção.
2. **Chaves Estrangeiras (`FOREIGN KEY`):** Criam vínculos formais entre tabelas. Ative no SQLite com `PRAGMA foreign_keys = ON;`.
3. **`INNER JOIN`:** Conecta linhas de duas tabelas com base na igualdade de chaves (`ON clientes.cidade_id = cidades.id`).
4. **Funções de Agregação:** `COUNT()`, `SUM()`, `AVG()`, `MIN()` e `MAX()` consolidam conjuntos de dados em estatísticas pontuais.
5. **`GROUP BY`:** Segmenta os registros em grupos analíticos (ex.: total de clientes por município).
6. **`WHERE` vs `HAVING`:** O `WHERE` filtra registros antes do agrupamento; o `HAVING` filtra os grupos resultantes das funções de agregação.
