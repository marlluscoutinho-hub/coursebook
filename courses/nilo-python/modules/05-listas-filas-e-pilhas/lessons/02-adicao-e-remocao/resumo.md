### Síntese: Adição e Remoção em Listas

1. **Expansão com `append()`:** Adiciona um elemento ao final da lista, alterando o objeto original.
2. **`append()` vs. `extend()`:** Inserir uma lista via `append` cria um elemento aninhado `[1, [2, 3]]`; utilizar `extend` incorpora os itens individualmente `[1, 2, 3]`.
3. **Fusão com `+`:** O operador `+` gera uma terceira lista independente com a união dos elementos.
4. **Remoção com `del` e `pop()`:** `del L[i]` apaga o item; `L.pop(i)` apaga e devolve o elemento para uso imediato. Sem argumento, `pop()` remove o topo final.
5. **Prevenção de Falhas:** Aplicar `pop()` em lista sem elementos gera `IndexError: pop from empty list`.
