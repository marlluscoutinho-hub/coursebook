# Resumo da Unidade: Imutabilidade e Fatiamento de Strings

### Pontos Essenciais

1. **Imutabilidade de `str`:** Strings não podem ter caracteres individuais reatribuídos via `S[0] = "x"`, sob pena de `TypeError`.
2. **Ciclo de Conversão:** Para alterar pontualmente uma string, convertemos em lista com `L = list(S)`, modificamos as posições por índice `L[i] = novo` e reconvertemos em string usando `"".join(L)`.
3. **Mecânica do `join()`:** O método `separador.join(sequencia)` une uma lista de strings intercalando o delimitador especificado.
4. **Fatiamento com Passo:** A sintaxe `S[inicio:fim:passo]` permite extrair substrings de forma não destrutiva. O truque `S[::-1]` inverte uma string usando passo negativo.
