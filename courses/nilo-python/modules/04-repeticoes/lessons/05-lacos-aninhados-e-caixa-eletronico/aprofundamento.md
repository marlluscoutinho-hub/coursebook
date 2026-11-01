# Laços Aninhados e a Engenharia do Caixa Eletrônico

Um **laço aninhado** ocorre quando uma instrução `while` está contida no corpo de outra instrução `while`.

A cada iteração do laço externo, o laço interno executa seu ciclo de repetições do início ao fim.

---

### 1. Dinâmica Bidimensional: A Tabuada Completa (1 a 10)

Considere o programa para imprimir as dez tabuadas completas de 1 a 10 (Listagem 5.13):

```python
tabuada = 1
while tabuada <= 10:
    numero = 1
    while numero <= 10:
        print(f"{tabuada:2d} x {numero:2d} = {tabuada * numero:3d}")
        numero += 1
    print("-" * 18)   # Linha separadora entre tabuadas
    tabuada += 1
```

* O laço externo executa **10 vezes** (para cada valor de `tabuada` de 1 a 10).
* Para cada rodada do laço externo, o laço interno executa **10 vezes** (para `numero` de 1 a 10).
* O comando `print` interno é executado exatamente:
  $$10 \times 10 = 100 \text{ vezes}$$

:::warning
Observe que a instrução `numero = 1` precisa estar **dentro** do laço externo! Se estivesse antes do primeiro `while`, a variável `numero` terminaria a primeira tabuada valendo 11 e o laço interno nunca mais executaria nas rodadas subsequentes.
:::

---

### 2. O Algoritmo Canônico do Caixa Eletrônico (Listagem 5.14)

Um dos algoritmos mais célebres do livro de Nilo Menezes é o simulador de caixa automático bancário. O objetivo é dispensar um determinado valor de saque utilizando a **menor quantidade total de cédulas possíveis**, selecionando sempre a cédula de maior valor disponível (uma estratégia clássica de **algoritmo guloso / greedy algorithm**).

As cédulas disponíveis são: R$ 50, R$ 20, R$ 10, R$ 5 e R$ 1 (e opcionalmente R$ 100).

```python
valor = int(input("Digite o valor a sacar (R$): "))
cedulas = 0
atual = 50
apagar = valor

while True:
    if atual <= apagar:
        apagar -= atual
        cedulas += 1
    else:
        if cedulas > 0:
            print(f"{cedulas} cédula(s) de R$ {atual}")
        if apagar == 0:
            break
        if atual == 50:
            atual = 20
        elif atual == 20:
            atual = 10
        elif atual == 10:
            atual = 5
        elif atual == 5:
            atual = 1
        cedulas = 0
```

---

### 3. Rastreamento Analítico: Saque de R$ 745,00

Vamos rastrear a execução do algoritmo para `valor = 745`:

1. **Fase Cédulas de R$ 50:**
   * $745 \ge 50 \to \text{apagar} = 695, \text{cedulas} = 1$
   * O ciclo se repete 14 vezes até $\text{apagar} = 45$ e $\text{cedulas} = 14$.
   * Próxima iteração: $50 \le 45$ é `False`!
   * Entra no `else`: imprime `"14 cédula(s) de R$ 50"`.
   * Como $\text{apagar} \ne 0$, troca `atual = 20` e zera `cedulas = 0`.
2. **Fase Cédulas de R$ 20:**
   * $45 \ge 20 \to \text{apagar} = 25, \text{cedulas} = 1$.
   * $25 \ge 20 \to \text{apagar} = 5, \text{cedulas} = 2$.
   * $20 \le 5$ é `False`.
   * Entra no `else`: imprime `"2 cédula(s) de R$ 20"`. Troca `atual = 10`, `cedulas = 0`.
3. **Fase Cédulas de R$ 10:**
   * $10 \le 5$ é `False`.
   * Entra no `else`: `cedulas == 0` (não imprime nada). Troca `atual = 5`, `cedulas = 0`.
4. **Fase Cédulas de R$ 5:**
   * $5 \ge 5 \to \text{apagar} = 0, \text{cedulas} = 1$.
   * Próxima: $5 \le 0$ é `False`.
   * Entra no `else`: imprime `"1 cédula(s) de R$ 5"`.
   * Como $\text{apagar} == 0$, dispara o `break` e encerra!

$$\text{Saída Total:} \quad 14 \times 50 + 2 \times 20 + 0 \times 10 + 1 \times 5 = 700 + 40 + 5 = \text{R\$\ } 745{,}00 \quad \blacksquare$$

:::theorem
**Teorema do Sistema Canônico de Cédulas:** No sistema monetário brasileiro $\{100, 50, 20, 10, 5, 2, 1\}$, a abordagem gulosa garante a solução matematicamente ótima (mínimo de cédulas) para qualquer valor inteiro de saque.
:::
