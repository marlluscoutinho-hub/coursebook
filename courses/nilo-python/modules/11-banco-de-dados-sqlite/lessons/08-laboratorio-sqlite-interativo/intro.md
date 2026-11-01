# Laboratório Interativo: Simulador Relacional SQLite

Seja bem-vindo à bancada interativa do **Capítulo 11**! Nesta unidade prática, você terá acesso a um motor SQLite virtual em memória (`:memory:`) rodando diretamente no seu navegador.

A bancada foi projetada para que você possa:
1. **Digitar e Executar SQL Livremente:** Teste consultas `SELECT`, inserções `INSERT`, modificações `UPDATE` e exclusões `DELETE`.
2. **Inspecionar o Estado das Tabelas em Tempo Real:** O painel lateral direito exibe os dados reais das tabelas `cidades`, `clientes` e `precos`.
3. **Experimentar o Controle Transacional:** Observe como as alterações ficam sinalizadas como **pendentes** até que você clique em `conn.commit()`. Se errar um `UPDATE` ou `DELETE`, clique em `conn.rollback()` para restaurar o estado estável anterior!
4. **Laboratório de Segurança contra SQL Injection:** Veja com seus próprios olhos como uma string maliciosa contorna cláusulas `WHERE` inseguras e como os marcadores de parâmetro `?` neutralizam o ataque completamente.
