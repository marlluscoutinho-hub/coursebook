# Matrizes Bidimensionais e Listas Aninhadas

Na álgebra linear, uma matriz de dimensão $M \times N$ organiza elementos em $M$ linhas e $N$ colunas:

$$A = \begin{pmatrix}
a_{0,0} & a_{0,1} & \dots & a_{0,N-1} \\
a_{1,0} & a_{1,1} & \dots & a_{1,N-1} \\
\vdots & \vdots & \ddots & \vdots \\
a_{M-1,0} & a_{M-1,1} & \dots & a_{M-1,N-1}
\end{pmatrix}$$

Em Python puro (sem bibliotecas externas como NumPy), representamos essa estrutura como uma **lista cujos elementos são outras listas**.

---

### 1. Declaração e Acesso por Coordenadas

```python
# Matriz 3x3
M = [
    [1, 2, 3],   # Linha 0
    [4, 5, 6],   # Linha 1
    [7, 8, 9]    # Linha 2
]
```

Para acessar um elemento individual:
1. O primeiro índice seleciona a **linha**: `M[1]` devolve `[4, 5, 6]`.
2. O segundo índice seleciona a **coluna** dentro daquela linha: `M[1][2]` devolve `6`.

$$\text{Sintaxe de Consulta:} \quad \mathbf{M}[\text{linha}][\text{coluna}]$$

```python
print(M[0][0])  # 1 (canto superior esquerdo)
print(M[2][2])  # 9 (canto inferior direito)
```

---

### 2. Iteração Bidimensional com Laços Aninhados

Para percorrer todos os elementos de uma matriz linha por linha, utilizamos dois laços `for` encadeados:

```python
for linha in M:
    for valor in linha:
        print(f"{valor:2d}", end=" ")
    print()  # Quebra de linha ao final de cada linha da matriz
```

---

### 3. Aplicação Comercial: Tabela de Compras (Listagem 6.43)

No livro de Nilo Menezes, listas aninhadas são introduzidas para modelar compras de supermercado onde cada item possui: nome do produto, quantidade comprada e preço unitário:

```python
# Tabela de compras: [Produto, Quantidade, Preço Unitário]
compras = [
    ["Maçãs", 10, 0.30],
    ["Peras", 5, 0.75],
    ["Kiwis", 4, 0.98]
]

total = 0
print("--- Extrato Detalhado de Compras ---")
for item in compras:
    produto = item[0]
    quantidade = item[1]
    preco_unit = item[2]
    subtotal = quantidade * preco_unit
    total += subtotal
    print(f"{produto:10s} | {quantidade:2d} un x R$ {preco_unit:.2f} = R$ {subtotal:.2f}")

print("-" * 38)
print(f"VALOR TOTAL DA COMPRA: R$ {total:.2f}")
```

:::key-idea
Listas aninhadas funcionam como precursores estruturais de registros de bancos de dados relacionais: cada elemento da lista externa atua como uma **linha (tupla relacional)** e cada índice interno como uma **coluna (atributo)**.
:::
