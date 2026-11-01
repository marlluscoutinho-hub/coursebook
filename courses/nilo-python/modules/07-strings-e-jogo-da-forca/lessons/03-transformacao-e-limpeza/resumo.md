# Resumo da Unidade: Transformação e Sanitização de Strings

### Pontos Essenciais

1. **Divisão de Sequências:** `split(delimitador)` quebra uma string em lista. Sem parâmetros, `split()` quebra em qualquer sequência de espaços em branco, tabs e quebras de linha.
2. **Multilinhas:** `splitlines()` decompõe textos multilinha respeitando convenções Unix e Windows (`\n` e `\r\n`).
3. **Substituição de Padrões:** `replace(antigo, novo, [limite])` troca substrings. Usar `""` como novo termo apaga ocorrências.
4. **Higienização de Extremidades:** `strip()`, `lstrip()` e `rstrip()` eliminam espaços ou caracteres arbitrários das bordas da string sem tocar no conteúdo interno.
