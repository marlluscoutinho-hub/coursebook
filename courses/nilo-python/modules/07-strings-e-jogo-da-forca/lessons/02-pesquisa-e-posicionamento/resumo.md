# Resumo da Unidade: Pesquisa e Posicionamento de Substrings

### Pontos Essenciais

1. **Prefixos e Sufixos:** `s.startswith(sub)` e `s.endswith(sub)` validam extremos de strings de forma booleana e sensível à caixa. A combinação com `.lower()` neutraliza diferenças entre maiúsculas e minúsculas.
2. **Contagem:** `s.count(sub)` apura ocorrências sem sobreposição.
3. **`find()` vs `index()`:** Ambos localizam o primeiro índice de uma substring. Quando a busca falha, `find()` retorna `-1`, enquanto `index()` lança `ValueError`. `rfind()` e `rindex()` realizam a busca da direita para a esquerda.
4. **Alinhamento Visual:** `center(largura, char)`, `ljust(largura, char)` e `rjust(largura, char)` preenchem espaços para gerar saídas e relatórios alinhados em modo texto.
