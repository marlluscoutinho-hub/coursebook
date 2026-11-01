# Pesquisa, Contagem e Posicionamento de Substrings

> *"Quando você precisar verificar se uma string começa ou termina com alguns caracteres, você pode usar os métodos startswith e endswith... Para pesquisar se uma string está dentro de outra e obter a posição da primeira ocorrência, você pode utilizar o método find."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, pp. 138, 140

---

### Visão Geral da Aula

Ao construir sistemas de busca, leitores de arquivos, relatórios tabulares e analisadores léxicos, a capacidade de localizar e posicionar trechos de texto é essencial. Python disponibiliza um arsenal de métodos especializados que substituem laços manuais complexos por chamadas atômicas e otimizadas em C.

Nesta aula, você aprenderá:
1. **Verificação de Prefixos e Sufixos:** Como utilizar `startswith()` e `endswith()`, e o impacto da sensibilidade a maiúsculas/minúsculas (*case-sensitivity*).
2. **Pesquisa com `find()` vs `index()`:** A diferença vital entre `find()` (que retorna `-1` caso a substring inexista) e `index()` (que lança a exceção fatal `ValueError`).
3. **Contagem com `count()`:** Apuração quantitativa de palavras ou caracteres em sequências de texto.
4. **Alinhamento e Formatação Tabular:** Como padronizar larguras de colunas em relatórios usando `center()`, `ljust()` e `rjust()`.
