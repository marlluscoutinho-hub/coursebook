# DML: Modificações com UPDATE, DELETE e Controle Transacional

Inserir e consultar dados representam apenas metade da rotina de um sistema de informação. Clientes mudam de endereço, preços de produtos são reajustados pela inflação e registros obsoletos precisam ser removidos do cadastro.

Para realizar essas operações, a DML disponibiliza as instruções `UPDATE` e `DELETE`. Ambas compartilham duas características fundamentais:
1. São **operações de mutação de estado**: se executadas de forma equivocada sem a cláusula de restrição `WHERE`, alteram ou apagam irreversivelmente toda a base de dados.
2. Dependem intrinsecamente do **controle transacional**: no SQLite, cada alteração é isolada em uma transação temporária até que você chame explicitamente `conexao.commit()` para confirmá-la ou `conexao.rollback()` para desfazê-la.

No **Capítulo 11 (pp. 285–296)**, Nilo Menezes discute a prudência necessária no uso de `UPDATE` e `DELETE`, bem como a arquitetura de transações que protege sistemas bancários contra falhas e inconsistências.
