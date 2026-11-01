# Síntese da Unidade: Catálogo de Erros do Apêndice A

### Guia Rápido dos 8 Erros Fundamentais
1. **`SyntaxError`:** Erro de pontuação ou gramática (dois pontos `:`, parênteses, palavras reservadas). Corrija antes da execução.
2. **`IndentationError`:** Desalinhamento de recuos. Use sempre 4 espaços por nível de bloco.
3. **`NameError`:** Variável não declarada ou nome digitado incorretamente (*typo*).
4. **`TypeError`:** Mistura inadequada de tipos em operações (ex.: somar texto com número sem converter).
5. **`ValueError`:** Tipo adequado, mas dado inválido para a conversão (ex.: `int("abc")`).
6. **`IndexError`:** Acesso a índice além do tamanho da lista ($N$ em lista de tamanho $N$). Lembre-se: índices vão de $0$ a $N-1$.
7. **`KeyError`:** Busca de chave inexistente em dicionário. Previna com `.get(chave, default)`.
8. **`ZeroDivisionError`:** Divisão por zero em `/` ou `%`. Proteja com `if denominador != 0:`.
