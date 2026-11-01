# Síntese da Unidade: DDL e Criação de Tabelas

### Pontos Fundamentais
1. **Papel da DDL:** Comandos como `CREATE TABLE` definem o molde, nomes de colunas e restrições estruturais dos dados.
2. **Tipos Básicos do SQLite:** `NULL` (ausência), `INTEGER` (números inteiros), `REAL` (decimais/float), `TEXT` (strings) e `BLOB` (binários brutos).
3. **Idempotência com `IF NOT EXISTS`:** Garante que a execução do script não resulte em exceção caso a tabela já tenha sido criada previamente.
4. **Chave Primária (`PRIMARY KEY AUTOINCREMENT`):** Identificador exclusivo numérico gerado automaticamente pelo banco para cada registro novo.
5. **Restrições de Integridade:** `NOT NULL` (campo obrigatório), `UNIQUE` (impede duplicações) e `DEFAULT` (valor automático de fallback).
