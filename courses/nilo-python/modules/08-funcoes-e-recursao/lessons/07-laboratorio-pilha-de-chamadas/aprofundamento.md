# Guia de Operação e Experimentos Práticos do Laboratório

Para dominar a mecânica da pilha de execução e de funções como parâmetros, execute a seguinte sequência experimental:

---

### Experimento 1: Rastreamento do Fatorial $4!$

1. No painel **"1. Simulador da Pilha de Chamadas"**, certifique-se de que o algoritmo selecionado seja **Fatorial**.
2. Clique repetidamente em **"Próximo Passo &rarr;"** e observe:
   - **Passo 1 a 4 (Empilhamento):** O frame `fatorial(4)` é empilhado, seguido por `fatorial(3)`, `fatorial(2)` e `fatorial(1)`. A profundidade da pilha atinge o pico de **4 frames**.
   - **Passo 5 (Caso Base):** `fatorial(1)` atinge `n == 1` e produz o retorno imediato `ret: 1`.
   - **Passo 6 a 8 (Desempilhamento):** O frame de topo é removido e seu retorno alimenta o frame anterior:
     - `2 * 1 = 2`
     - `3 * 2 = 6`
     - `4 * 6 = 24`
   - O resultado final $24$ é exibido quando a pilha é totalmente esvaziada.

---

### Experimento 2: A Convergência Veloz do MDC de Euclides

1. Altere o seletor para **MDC de Euclides: mdc(24, 9)** e clique em **"Reiniciar"**.
2. Avance os passos observando a transformação dos parâmetros $a$ e $b$:
   - $\text{mdc}(24, 9) \to 24 \pmod 9 = 6$
   - $\text{mdc}(9, 6) \to 9 \pmod 6 = 3$
   - $\text{mdc}(6, 3) \to 6 \pmod 3 = 0$
   - $\text{mdc}(3, 0) \to$ Caso base ($b == 0$) retorna $a = 3$!
3. Observe como com apenas 4 passos a função resolve o maior divisor comum entre 24 e 9.

---

### Experimento 3: Injeção de Expressões Lambda

1. Mude para a aba **"2. Funções Lambda & Ordem Superior"**.
2. Observe a lista de entrada `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`.
3. No painel de filtro, altere a expressão para `x > 5` e clique em **"Filtrar"** $\to$ Resultado: `[6, 7, 8, 9, 10]`.
4. Teste um predicado de múltiplos de 3: `x % 3 == 0` $\to$ Resultado: `[3, 6, 9]`.
5. No painel de mapeamento, altere a expressão para `x ** 2` e clique em **"Mapear"** $\to$ Resultado: `[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]`.
