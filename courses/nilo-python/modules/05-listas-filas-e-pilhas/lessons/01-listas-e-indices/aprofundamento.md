# Listas Dinâmicas, Mutabilidade, Referências e Fatiamento

Uma **lista** em Python é uma sequência mutável e heterogênea de objetos armazenados de forma ordenada na memória.

---

### 1. Declaração, Heterogeneidade e Indexação

Listas são delimitadas por colchetes `[...]`, com elementos separados por vírgulas:

```python
# Lista de inteiros
primos = [2, 3, 5, 7, 11]

# Lista heterogênea (Python não exige tipos homogêneos)
registro = ["Nilo Menezes", 45, 1.82, True]

# Lista vazia
fila_espera = []
```

O acesso a elementos individuais é regido pela indexação com **base zero** e suporte a **índices negativos**:

$$\begin{array}{|c|c|c|c|c|c|}
\hline
\text{Elemento} & 10 & 20 & 30 & 40 & 50 \\
\hline
\text{Índice Direto} & 0 & 1 & 2 & 3 & 4 \\
\hline
\text{Índice Negativo} & -5 & -4 & -3 & -2 & -1 \\
\hline
\end{array}$$

```python
L = [10, 20, 30, 40, 50]
print(L[0])   # 10 (primeiro)
print(L[-1])  # 50 (último)
```

---

### 2. A Natureza Mutável das Listas

Diferente de inteiros, floats e strings (que são tipos imutáveis), as **listas são mutáveis**: podemos alterar qualquer um de seus elementos diretamente sem recriar o objeto na memória:

```python
L = [1, 2, 3]
L[0] = 99
print(L)  # [99, 2, 3]
```

---

### 3. A Grande Armadilha: Atribuição de Referência vs. Cópia Independente

Esta é uma das distinções mais vitais de toda a ciência da computação em Python:

#### A. Atribuição de Referência (`B = A`):
```python
A = [1, 2, 3]
B = A          # B passa a apontar para o MESMO objeto que A na memória!
B[0] = 999
print(A)       # [999, 2, 3]! A foi alterado junto!
```
Quando atribuímos `B = A`, **nenhum novo elemento é duplicado**. As variáveis `A` e `B` tornam-se apenas dois rótulos associados ao mesmo endereço de memória na heap. Qualquer modificação feita via `B` afeta imediatamente `A`.

#### B. Cópia Rasa Independente (`B = A[:]`):
```python
A = [1, 2, 3]
B = A[:]       # Fatiamento cria um NOVO objeto contendo cópia dos elementos
B[0] = 999
print(A)       # [1, 2, 3] (A permanece protegido e intacto!)
print(B)       # [999, 2, 3]
```

:::key-idea
Para duplicar uma lista garantindo independência mútua, utilize a notação de fatiamento integral `B = A[:]` ou o método moderno `B = A.copy()`.
:::

---

### 4. Fatiamento de Listas (*List Slicing*)

A sintaxe de fatia `L[início:fim]` extrai uma nova sublista:
* `início`: índice inclusivo.
* `fim`: índice exclusivo.

```python
letras = ["a", "b", "c", "d", "e"]
print(letras[1:3])   # ['b', 'c'] (índices 1 e 2)
print(letras[:2])    # ['a', 'b'] (do início até o índice 1)
print(letras[2:])    # ['c', 'd', 'e'] (do índice 2 até o fim)
```
