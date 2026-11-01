# Transformação, Sanitização e Divisão de Strings

> *"O método split quebra uma string a partir de um caractere passado como parâmetro, retornando uma lista com as substrings já separadas... O método strip é utilizado para remover espaços em branco do início ou fim da string."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, pp. 145, 146

---

### Visão Geral da Aula

Na prática do desenvolvimento de software, a entrada fornecida pelo usuário ou lida a partir de arquivos externos frequentemente vem desordenada: com quebras de linha indesejadas, espaços acidentais nas extremidades ou delimitadores em formatos variados (como vírgulas, pontos e vírgulas ou barras).

Nesta aula, exploraremos as ferramentas fundamentais de limpeza e transformação textual de Python:
1. **Quebra Estruturada com `split()` e `splitlines()`:** Como converter dados tabulares e arquivos multilinha em listas de termos processáveis.
2. **Substituição de Padrões com `replace()`:** Troca atômica de caracteres ou palavras, controle de quantidade máxima de substituições e remoção por esvaziamento.
3. **Sanitização de Extremidades com `strip()`, `lstrip()` e `rstrip()`:** Como eliminar espaços em branco, quebras de linha `\n` e caracteres especiais de cabeçalhos e rodapés de strings.
