# Síntese da Unidade: Modificações e Controle Transacional

### Pontos Fundamentais
1. **Comando `UPDATE`:** Modifica valores de colunas existentes. Exige obrigatoriamente a cláusula `WHERE` para evitar a alteração acidental de todas as linhas da tabela.
2. **Comando `DELETE`:** Remove registros selecionados. Sem `WHERE`, limpa toda a tabela sem confirmação adicional.
3. **`cursor.rowcount`:** Atributo que armazena a contagem exata de linhas afetadas pela instrução DML anterior, permitindo validar se a operação atingiu o alvo desejado.
4. **`conn.commit()`:** Efetiva a gravação física das modificações pendentes da transação no arquivo permanente.
5. **`conn.rollback()`:** Aborta a transação atual e desfaz todas as instruções não salvas, retornando o banco ao estado estável anterior.
6. **Atomicidade em Transferências:** Agrupamento de múltiplos comandos (`UPDATE`, `INSERT`) sob blocos `try/except` com `commit` no sucesso e `rollback` em exceções garante conformidade rigorosa com os pilares ACID.
