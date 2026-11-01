# Adição, Remoção e Concatenação Dinâmica de Listas

As listas em Python são implementadas internamente como **vetores dinâmicos (arrays redimensionáveis)** de ponteiros de objetos. À medida que novos elementos chegam, o interpretador gerencia a realocação da memória de forma transparente.

---

### 1. Adição de Elementos: O Método `append()`

O método `append()` anexa um único novo elemento ao final da lista, aumentando seu tamanho em uma unidade ($N \to N + 1$):

```python
L = []
L.append("primeiro")
L.append("segundo")
L.append("terceiro")
print(L)  # ['primeiro', 'segundo', 'terceiro']
```

:::warning
Não tente usar atribuição direta em um índice inexistente: `L[3] = "quarto"` dispara `IndexError: list assignment index out of range`. Para expandir uma lista, deve-se usar `append()`.
:::

---

### 2. Extensão e Concatenação: `append()` vs. `extend()` vs. `+`

Existe uma diferença crucial entre adicionar uma lista como elemento ou desmembrá-la:

#### A. O perigo de passar uma lista para `append()`:
```python
L = [1, 2]
L.append([3, 4])
print(L)  # [1, 2, [3, 4]] -> Criou uma lista aninhada como elemento único!
```

#### B. A solução com o método `extend()`:
O método `extend()` itera sobre os elementos da sequência fornecida e adiciona cada um deles individualmente ao final da lista original:
```python
L = [1, 2]
L.extend([3, 4])
print(L)  # [1, 2, 3, 4]
```

#### C. Concatenação com o Operador `+`:
O operador `+` cria e retorna uma **terceira nova lista** contendo a fusão de duas listas preexistentes, sem modificar nenhuma das originais:
```python
A = [1, 2]
B = [3, 4]
C = A + B
print(C)  # [1, 2, 3, 4]
print(A)  # [1, 2] (inalterada)
```

---

### 3. Remoção de Elementos: A Instrução `del` e o Método `pop()`

Python disponibiliza duas ferramentas complementares para retirar elementos de uma lista:

#### A. A instrução `del`:
Remove o elemento localizado no índice especificado. O interpretador desloca automaticamente todos os elementos posteriores uma posição para a esquerda:
```python
L = ["a", "b", "c", "d"]
del L[1]  # Remove o elemento no índice 1 ("b")
print(L)  # ['a', 'c', 'd']
```

Podemos também apagar fatias inteiras:
```python
del L[1:3]  # Apaga os elementos dos índices 1 e 2
```

#### B. O método `pop()`:
Diferente de `del` (que apenas descarta o valor), o método `pop(índice)` **remove o elemento e o devolve como retorno da chamada**:

```python
compras = ["pão", "leite", "café"]

# pop() sem argumentos remove e devolve o ÚLTIMO elemento:
ultimo = compras.pop()
print(ultimo)   # "café"
print(compras)  # ['pão', 'leite']

# pop(0) remove e devolve o PRIMEIRO elemento:
primeiro = compras.pop(0)
print(primeiro) # "pão"
print(compras)  # ['leite']
```

:::theorem
**Teorema de Limite de Pop (Exercício 6.4):** Chamar `L.pop()` ou `L.pop(0)` sobre uma lista vazia `[]` dispara imediatamente a exceção `IndexError: pop from empty list`. Portanto, programas defensivos devem obrigatoriamente checar se `len(L) > 0` antes de invocar remoções.
:::
