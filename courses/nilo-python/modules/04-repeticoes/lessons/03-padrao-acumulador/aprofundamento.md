# O Padrão Acumulador, Somatórios e Juros Compostos

Na matemática discreta, somatórios são expressos pela notação sigma:

$$S = \sum_{i=1}^{N} v_i$$

Em ciência da computação, essa soma contínua é implementada através do **padrão acumulador**.

---

### 1. Contador vs. Acumulador

A diferença conceitual entre os dois padrões é nítida:
* **Contador:** incrementado por um valor constante fixo ($\Delta = 1$):
  $$c \leftarrow c + 1$$
* **Acumulador:** incrementado por um valor variável ($v_i$):
  $$s \leftarrow s + v_i$$

:::key-idea
**A Regra do Elemento Neutro:**
* Para somatórios, o acumulador deve ser obrigatoriamente inicializado com **zero** (`soma = 0`), pois $x + 0 = x$.
* Para produtórios (multiplicações sucessivas ou fatoriais), o acumulador deve ser inicializado com **um** (`produto = 1`), pois $x \times 1 = x$.
:::

---

### 2. Leitura de 5 Números e Cálculo da Média Aritmética

Considere a Listagem 5.9 do livro:
```python
n = 1
soma = 0

while n <= 5:
    x = float(input(f"Digite o {n}º número: "))
    soma = soma + x
    n = n + 1

media = soma / 5
print(f"Soma total: {soma:.2f}")
print(f"Média aritmética: {media:.2f}")
```

#### Rastreamento da Memória:
Se as entradas forem $10, 20, 30, 40, 50$:
1. $n=1 \to \text{soma} = 0 + 10 = 10$
2. $n=2 \to \text{soma} = 10 + 20 = 30$
3. $n=3 \to \text{soma} = 30 + 30 = 60$
4. $n=4 \to \text{soma} = 60 + 40 = 100$
5. $n=5 \to \text{soma} = 100 + 50 = 150$
6. $n=6 \to \text{encerra laço}$. $\text{media} = 150 / 5 = 30.0$.

---

### 3. Multiplicação por Somas Sucessivas (Exercício 5.8)

Qualquer produto $A \times B$ pode ser formalizado como somar o número $A$ a si mesmo $B$ vezes:

$$A \times B = \underbrace{A + A + \dots + A}_{B \text{ parcelas}}$$

Podemos calcular a multiplicação utilizando exclusivamente o operador de adição `+`:

```python
a = int(input("Primeiro fator: "))
b = int(input("Segundo fator: "))

resultado = 0
contador = 1

while contador <= b:
    resultado = resultado + a
    contador += 1

print(f"{a} x {b} = {resultado}")
```

---

### 4. Simulação de Poupança e Juros Compostos (Exercícios 5.11 e 5.12)

No Exercício 5.11, simulamos a evolução patrimonial de uma caderneta de poupança ao longo de 24 meses (2 anos):
* Depósito inicial $S_0$.
* Taxa de juros mensal $j$ (por exemplo, 0.5% ao mês).
* A cada mês, o rendimento é calculado sobre o saldo atual:
  $$J_{\text{mês}} = S_{t-1} \times j$$
  $$S_t = S_{t-1} + J_{\text{mês}}$$

```python
deposito = float(input("Depósito inicial (R$): "))
taxa = float(input("Taxa de juros mensal (%): ")) / 100

mes = 1
saldo = deposito
total_juros = 0

print("\n--- Evolução Mensal da Poupança ---")
while mes <= 24:
    rendimento = saldo * taxa
    saldo = saldo + rendimento
    total_juros = total_juros + rendimento
    print(f"Mês {mes:2d}: Rendimento = R$ {rendimento:6.2f} | Saldo = R$ {saldo:8.2f}")
    mes += 1

print("-----------------------------------")
print(f"Total ganho com juros no período: R$ {total_juros:.2f}")
print(f"Saldo final após 2 anos: R$ {saldo:.2f}")
```
