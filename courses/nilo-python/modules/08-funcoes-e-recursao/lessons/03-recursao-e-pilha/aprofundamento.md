# Aprofundamento Teórico: A Mecânica da Call Stack e Algoritmos Indutivos

A compreensão profunda da recursão depende de enxergar o que ocorre na memória física da máquina a cada chamada.

---

### 1. Fatorial e o Fluxo de Empilhamento e Desempilhamento

Matematicamente, a função fatorial é definida indutivamente como:

$$n! = \begin{cases} 1, & \text{se } n = 0 \text{ ou } n = 1 \quad \text{(Caso Base)} \\ n \times (n - 1)!, & \text{se } n > 1 \quad \text{(Caso Recursivo)} \end{cases}$$

Vejamos a implementação canônica com rastreamento (Listagem 8.12, p. 171):

```python
def fatorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * fatorial(n - 1)
```

Ao calcularmos `fatorial(4)`:
1. **Fase de Ida (Empilhamento / *Wind*):**
   - `fatorial(4)` aguarda `4 * fatorial(3)` $\to$ Frame 1 empilhado.
   - `fatorial(3)` aguarda `3 * fatorial(2)` $\to$ Frame 2 empilhado.
   - `fatorial(2)` aguarda `2 * fatorial(1)` $\to$ Frame 3 empilhado.
   - `fatorial(1)` atinge o caso base e retorna `1` $\to$ Frame 4 empilhado.
2. **Fase de Retorno (Desempilhamento / *Unwind*):**
   - Frame 4 retorna `1` para Frame 3. Frame 3 calcula `2 * 1 = 2` e é destruído.
   - Frame 3 retorna `2` para Frame 2. Frame 2 calcula `3 * 2 = 6` e é destruído.
   - Frame 2 retorna `6` para Frame 1. Frame 1 calcula `4 * 6 = 24` e retorna `24`.

---

### 2. A Sequência de Fibonacci e a Árvore de Chamadas

A sequência de Fibonacci reflete a reprodução idealizada de coelhos (p. 171):

$$F(n) = \begin{cases} n, & \text{se } n \le 1 \\ F(n - 1) + F(n - 2), & \text{se } n > 1 \end{cases}$$

```python
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)
```

> [!NOTE]
> **Complexidade Exponencial da Recursão Ingênua de Fibonacci:**
> Observe que `fibonacci(n)` gera duas chamadas recursivas para cada nó não-base, formando uma árvore binária de profundidade $n$. O número total de nós é de ordem $O(2^n)$. Para $n = 40$, isso requer mais de um trilhão de operações redundantes! Mais adiante no curso, veremos como a versão iterativa (ou com memoização) reduz isso para tempo linear $O(n)$.

---

### 3. O Algoritmo de Euclides para o MDC (Exercício 8.7)

O cálculo do Máximo Divisor Comum entre dois números inteiros $a > b$ baseia-se na propriedade euclidiana de que $\text{mdc}(a, b) = \text{mdc}(b, a \pmod b)$:

$$\text{mdc}(a, b) = \begin{cases} a, & \text{se } b = 0 \\ \text{mdc}(b, a \pmod b), & \text{se } b > 0 \end{cases}$$

```python
def mdc(a, b):
    if b == 0:
        return a
    else:
        return mdc(b, a % b)

print(mdc(24, 9))  # mdc(24, 9) -> mdc(9, 6) -> mdc(6, 3) -> mdc(3, 0) = 3
```
Este algoritmo converge com rapidez logarítmica extraordinária, demonstrando que a recursão, quando bem estruturada com redução divisiva, é extremamente veloz.

---

### 4. Estouro de Pilha: `RecursionError`

Se esquecermos o caso base ou se a condição de decremento nunca atingir a parada:

```python
def loop_infinito(x):
    return loop_infinito(x + 1)  # Nunca para!
```
O interpretador Python detecta o crescimento descontrolado da pilha de chamadas e lança:
`RecursionError: maximum recursion depth exceeded in comparison` (o limite padrão é tipicamente 1000 frames).
