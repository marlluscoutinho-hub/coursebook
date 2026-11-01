# Síntese da Unidade: Conexões e Cursores em sqlite3

### Pontos Fundamentais
1. **Importação:** `import sqlite3` dispensa dependências externas e vem pré-instalado em qualquer distribuição oficial de Python.
2. **`sqlite3.connect()`:** Conecta ao banco de dados em disco (`agenda.db`) ou em memória RAM temporária (`:memory:`).
3. **`Connection` vs. `Cursor`:**
   - A `Connection` gerencia a integridade física do arquivo e o controle transacional (`commit()` / `rollback()`).
   - O `Cursor` despacha as instruções SQL (`execute()`) e itera sobre os dados retornados.
4. **Fechamento de Recursos:** Sempre encerre cursores e conexões com `cursor.close()` e `conexao.close()` para evitar vazamento de descritores de arquivo no sistema operacional.
5. **Context Manager:** O uso de `with sqlite3.connect(...) as conexao:` automatiza o commit em caso de sucesso e o rollback em caso de exceções imprevistas.
