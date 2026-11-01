# O Padrão Contador e Aplicações Clássicas

Um **contador** é uma variável inteira destinada a rastrear a quantidade de vezes que determinado bloco ou evento ocorreu durante a execução do programa.

---

### 1. Mecânica de Incremento e Operadores Aumentados

A atribuição fundamental do contador é:

$$x \leftarrow x + \Delta$$

Em Python:
```python
x = x + 1
```

O interpretador também oferece a sintaxe concisa do **operador de atribuição aumentada** (*augmented assignment*):
```python
x += 1   # Equivalente exato a: x = x + 1
x -= 1   # Decremento: x = x - 1
x += 2   # Passo de dois em dois: x = x + 2
```

---

### 2. Contagem Regressiva: O Lançamento do Foguete (Exercício 5.2)

No Exercício 5.2 de Nilo Menezes, implementamos a contagem regressiva para o lançamento de um veículo espacial:
* Começar em 10.
* Decrementar de 1 em 1 até 0.
* Ao final, exibir a mensagem de ignição e decolagem: `"Fogo!"`.

```python
x = 10
while x >= 0:
    print(x)
    x -= 1

print("Fogo! Lançamento realizado com sucesso!")
```

#### Rastreamento da Contagem Regressiva:
$$\begin{array}{c|c|c}
\textbf{Passo} & x \ge 0 & \textbf{Saída} \\
\hline
1 & 10 \ge 0 \to \text{True} & 10 \\
2 & 9 \ge 0 \to \text{True} & 9 \\
\dots & \dots & \dots \\
11 & 0 \ge 0 \to \text{True} & 0 \\
12 & -1 \ge 0 \to \text{False} & \text{"Fogo!"}
\end{array}$$

Observe que o laço itera exatamente **11 vezes** (de 10 até 0 inclusive). Se o predicado fosse `x > 0`, o zero ficaria excluído da contagem.

---

### 3. Filtros Aritméticos: Números Ímpares e Múltiplos de 3 (Exercícios 5.4 e 5.5)

Podemos controlar o incremento para gerar sequências numéricas específicas de duas formas:

#### A. Incrementando o contador de 2 em 2:
```python
fim = int(input("Digite o teto da sequência: "))
x = 1
while x <= fim:
    print(x)
    x += 2   # Salta de 2 em 2 (1, 3, 5, 7, 9...)
```

#### B. Utilizando múltiplos de 3:
```python
# Os 10 primeiros múltiplos de 3 (3, 6, 9, 12, ..., 30)
contador = 1
while contador <= 10:
    multiplo = contador * 3
    print(f"3 x {contador} = {multiplo}")
    contador += 1
```

---

### 4. Tabuada Parametrizada pelo Usuário (Exercícios 5.6 e 5.7)

Na Listagem 5.7 e no Exercício 5.7, construímos um gerador de tabuada customizável:
* O usuário escolhe o número base da tabuada ($N$).
* O usuário escolhe o valor de início e o valor de fim da tabuada.

```python
tabuada = int(input("Qual tabuada deseja calcular? "))
inicio = int(input("Início da tabuada: "))
fim = int(input("Fim da tabuada: "))

x = inicio
while x <= fim:
    resultado = tabuada * x
    print(f"{tabuada} x {x:2d} = {resultado:3d}")
    x += 1
```
