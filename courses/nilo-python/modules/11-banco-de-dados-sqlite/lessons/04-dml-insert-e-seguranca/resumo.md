# Síntese da Unidade: Inserção de Dados e Segurança

### Pontos Fundamentais
1. **Comando `INSERT INTO`:** Adiciona novas tuplas informando a lista de colunas de destino e os valores associados.
2. **Vulnerabilidade de SQL Injection:** Concatenação de strings com dados de usuários (`f"INSERT ... {var}"`) permite que caracteres especiais alterem o fluxo sintático do banco, possibilitando vazamento e destruição de dados.
3. **Parametrização com `?`:** A regra inviolável de segurança. Substitui variáveis no texto SQL por marcadores `?` e passa os valores reais em uma tupla como segundo parâmetro do método `execute()`.
4. **`cursor.executemany()`:** Executa inserção em massa de uma lista de tuplas com alta performance, compilando o comando SQL apenas uma vez.
5. **Propriedades do Cursor:** `cursor.rowcount` informa quantas linhas foram afetadas e `cursor.lastrowid` retorna o ID gerado pelo banco.
6. **Obrigatório `conn.commit()`:** Dados inseridos só são gravados no arquivo de forma persistente após a invocação explícita de `conexao.commit()`.
