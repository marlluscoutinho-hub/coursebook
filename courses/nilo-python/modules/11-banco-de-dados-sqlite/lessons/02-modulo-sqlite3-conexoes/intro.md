# O Módulo sqlite3: Conexões, Cursores e Ciclo de Vida

Para utilizar bancos de dados em Python, não é necessário instalar nenhum pacote externo via `pip`: a biblioteca padrão já inclui o módulo oficial `sqlite3`.

Toda interação com o banco de dados segue um ciclo de vida composto por quatro etapas essenciais:
1. **Estabelecer Conexão (`Connection`):** Abre a ponte de comunicação com o arquivo do banco no sistema de arquivos ou aloca uma base volátil em memória.
2. **Obter um Cursor (`Cursor`):** Cria um despachante de comandos SQL e um iterador sobre as linhas retornadas.
3. **Executar Comandos e Transações:** Envia instruções DDL/DML através de `cursor.execute()` e consolida os dados com `conexao.commit()`.
4. **Fechar Recursos:** Libera as travas de arquivo e desaloca ponteiros do sistema operacional chamando `cursor.close()` e `conexao.close()`.

No **Capítulo 11 (pp. 263–266)**, Nilo Menezes detalha a distinção entre a conexão física e o cursor de comandos, fornecendo o alicerce para qualquer aplicação que persista dados estruturados.
