### Síntese: Dicionários Hash

1. **Mapeamento Chave-Valor:** Dicionários associam chaves únicas a valores arbitrários, delimitados por `{ chave: valor }`.
2. **Tempo Constante $O(1)$:** Implementados com tabelas de dispersão hash, localizam registros instantaneamente sem varredura linear.
3. **Chaves Imutáveis:** Chaves devem ser imutáveis (`str`, `int`, `tuple`). Listas não podem ser chaves (`unhashable type`).
4. **Iteração Idiomática:** O método `d.items()` permite percorrer pares `(chave, valor)` diretamente em laços `for`. A existência prévia deve ser checada com `chave in d` para evitar `KeyError`.
