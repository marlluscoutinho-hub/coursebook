# Resumo da Unidade: Escopos e Ciclo de Vida de Variáveis

### Pontos Essenciais

1. **Escopo Local:** Variáveis criadas dentro de uma função residem em seu próprio frame de ativação e são destruídas no término da sub-rotina.
2. **Isolamento de Nomes:** Atribuir a uma variável local de mesmo nome de uma variável global causa sombreamento (*shadowing*), preservando o valor global intacto.
3. **Instrução `global`:** Permite que uma função modifique uma variável do escopo externo de módulo. Deve ser utilizada com extrema moderação para evitar acoplamento oculto.
4. **Resolução Léxica:** Tentar ler e alterar uma variável sem `global` gera `UnboundLocalError` devido à resolução em tempo de compilação da tabela de símbolos locais.
