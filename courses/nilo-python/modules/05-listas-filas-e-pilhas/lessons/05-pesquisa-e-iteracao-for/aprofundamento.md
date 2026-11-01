# Busca Sequencial Linear e Iteração Idiomática com for

O laço `for` em Python não é um mero contador numérico como em linguagens derivadas de C: ele é um **iterador de coleções** (*for-each*). Ele percorre diretamente cada elemento pertencente a um objeto iterável.

---

### 1. A Instrução `for` e a Comparação com `while`

Vejamos como percorrer uma lista de números:

#### Abordagem Imperativa com `while`:
```python
L = [8, 9, 15]
x = 0
while x < len(L):
    e = L[x]
    print(e)
    x += 1
```

#### Abordagem Idiomática com `for`:
```python
L = [8, 9, 15]
for e in L:
    print(e)
```

:::key-idea
O comando `for e in L:` elimina três pontos clássicos de bugs:
1. Dispensa a inicialização manual da variável contadora `x = 0`.
2. Dispensa a consulta ao tamanho `len(L)`.
3. Dispensa a linha de incremento `x += 1`, impossibilitando laços infinitos por esquecimento.
:::

---

### 2. A Função Geradora `range()`

Quando precisamos de uma progressão aritmética de números inteiros, utilizamos a função embutida `range()`:

* `range(stop)`: gera inteiros de $0$ até $\text{stop}-1$.
* `range(start, stop)`: gera inteiros de $\text{start}$ até $\text{stop}-1$.
* `range(start, stop, step)`: gera inteiros com salto $\text{step}$.

```python
# Contagem de 0 a 4
for i in range(5):
    print(i, end=" ")  # 0 1 2 3 4

# Contagem de 10 a 50 com passo 10
for v in range(10, 51, 10):
    print(v, end=" ")  # 10 20 30 40 50

# Conversão direta para lista concreta
pares = list(range(0, 11, 2))
print(pares)  # [0, 2, 4, 6, 8, 10]
```

---

### 3. A Função `enumerate()`

Se precisarmos simultaneamente do **índice numérico** da posição e do **valor do elemento**, a função idiomática é `enumerate()`:

```python
alunos = ["Ana", "Bruno", "Carla", "Daniel"]

for indice, nome in enumerate(alunos):
    print(f"Posição {indice}: Aluno(a) {nome}")
```

---

### 4. Busca Sequencial Linear e Extremos (Maior, Menor e Médias)

A **busca sequencial** percorre a lista da esquerda para a direita comparando cada elemento com a chave procurada ($p$):

```python
# Listagem 6.23 Adaptada - Busca Sequencial
L = [15, 7, 27, 39, 42, 8]
p = int(input("Digite o valor a procurar: "))

achou = False
posicao = -1

for idx, item in enumerate(L):
    if item == p:
        achou = True
        posicao = idx
        break   # Interrompe a busca assim que encontra o elemento

if achou:
    print(f"Elemento {p} encontrado no índice {posicao}!")
else:
    print(f"Elemento {p} não pertence à lista.")
```

#### Cálculo de Maior, Menor e Média (Exercício 6.13):
Na lista de temperaturas $T = [-10, -8, 0, 1, 2, 5, -2, -4]$ de Mons, Bélgica:

```python
T = [-10, -8, 0, 1, 2, 5, -2, -4]

minima = T[0]
maxima = T[0]
soma = 0

for temp in T:
    if temp < minima:
        minima = temp
    if temp > maxima:
        maxima = temp
    soma += temp

media = soma / len(T)

print(f"Temperatura Mínima: {minima} °C")
print(f"Temperatura Máxima: {maxima} °C")
print(f"Temperatura Média: {media:.2f} °C")
```
