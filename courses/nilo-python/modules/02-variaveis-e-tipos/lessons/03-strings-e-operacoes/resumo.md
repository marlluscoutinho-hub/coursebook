### Síntese: Strings e Manipulação Elementar

1. **Delimitação de Texto:** Em Python, `'...'` e `"..."` têm exata equivalência, facilitando o aninhamento sem barras de escape. Textos multilinhas utilizam aspas triplas `"""..."""`.
2. **Sobrecarga de Operadores:** O operador `+` concatena strings; o operador `*` repete a cadeia por um número inteiro de vezes. Nunca tente somar string com número sem conversão explícita via `str()`.
3. **Indexação com Base Zero:** Strings são sequências indexadas de $0$ a $N-1$, ou de $-1$ retrocedendo até $-N$. Acessos fora dessa faixa disparam `IndexError`.
4. **Comprimento e Fatiamento:** A função `len(s)` retorna a quantidade de caracteres. A notação `s[início:fim]` extrai uma subcadeia onde o limite final é estritamente exclusivo.
