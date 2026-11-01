# Roteiro Experimental do Laboratório de Banco de Dados

Para extrair o máximo proveito da bancada interativa abaixo, siga os quatro desafios propostos na ordem pedagógica:

---

### Experimento 1: Consultando com Junção Relacional (INNER JOIN)
1. Clique no botão de preset **"1. Clientes e Cidades (JOIN)"** no painel superior.
2. Note a consulta carregada no console: ela conecta a chave estrangeira `c.cidade_id` com a chave primária `cid.id`.
3. Pressione **Executar SQL**.
4. Observe na tabela de resultados a desnormalização controlada: cada cliente aparece associado ao nome exato de sua cidade e à população correspondente, sem redundância nas tabelas de origem.

---

### Experimento 2: Ciclo de Inserção e Pendência de Commit
1. Clique no preset **"2. Inserir Produto (INSERT)"** ou digite seu próprio comando:
   ```sql
   INSERT INTO precos (produto, preco) VALUES ('Monitor UltraWide', 1450.00);
   ```
2. Clique em **Executar SQL**.
3. Veja o aviso amarelo no topo: `⚠️ 1 alteração(ões) pendente(s)`.
4. Mude a aba do inspetor de tabelas à direita para `precos`. Note que a linha foi inserida.
5. Agora clique em **💾 conn.commit()**. O status mudará para verde: `✓ Sincronizado (Sem pendências)`. Os dados agora estão salvos de forma durável!

---

### Experimento 3: Simulando um Desastre e Revertendo com conn.rollback()
1. Imagine que você digitou acidentalmente um comando `DELETE` esquecendo o `WHERE`:
   ```sql
   DELETE FROM precos;
   ```
2. Execute o comando. O inspetor mostrará que a tabela `precos` foi completamente esvaziada!
3. **Não entre em pânico:** como você não executou `conn.commit()`, a transação ainda está aberta na memória de trabalho.
4. Clique no botão **↩️ conn.rollback()**.
5. Observe a mágica da Atomicidade ACID: a tabela `precos` é restaurada instantaneamente para o estado do último commit!

---

### Experimento 4: O Teste de Segurança contra SQL Injection
1. Clique no botão vermelho **"🛡️ Demo: SQL Injection vs ? Seguro"**.
2. Leia a explicação e clique em **"Simular Ataque Inseguro"**. Observe como a injeção `' OR '1'='1` dribla a validação e faz o banco retornar todos os clientes cadastrados.
3. Em seguida, clique em **"Simular Busca Segura com '?'"**. Observe como o motor parametrizado impede o escape de caracteres e preserva o sigilo dos registros.
