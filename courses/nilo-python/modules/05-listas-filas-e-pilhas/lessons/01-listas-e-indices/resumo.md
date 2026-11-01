### Síntese: Listas Dinâmicas e Fatiamento

1. **Definição de Listas:** Coleções ordenadas, heterogêneas e dinâmicas delimitadas por colchetes `[...]`.
2. **Mutabilidade em Memória:** Ao contrário de strings e tuplas, elementos de uma lista podem ser substituídos diretamente por atribuição de índice (`L[0] = valor`).
3. **Referência vs. Cópia:** `B = A` cria um pseudônimo para o mesmo objeto na RAM (efeito colateral mútuo). Para clonar elementos de forma isolada, deve-se usar `B = A[:]` ou `B = A.copy()`.
4. **Fatiamento `[início:fim]`:** Produz uma nova lista derivada contendo do índice de início até o índice final exclusivo.
