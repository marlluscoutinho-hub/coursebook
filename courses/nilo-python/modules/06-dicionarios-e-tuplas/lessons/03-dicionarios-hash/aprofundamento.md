# Dicionários: Estruturas Associativas e Tabelas Hash

Um **dicionário** (`dict`) em Python é uma estrutura de dados associativa composta por pares **chave : valor** (*key-value pairs*).

Internamente, dicionários são implementados através de **tabelas hash (tabelas de dispersão)**, o que garante que a busca, inserção e remoção de qualquer elemento ocorram com complexidade assintótica média de **tempo constante**:

$$T_{\text{busca}} = O(1)$$

---

### 1. Declaração, Acesso e Inserção

Dicionários são delimitados por chaves `{ ... }`, com a relação de associação marcada por dois-pontos `:`:

```python
# Tabela de preços do hortifrúti (Listagem 6.47)
tabela = {
    "Alface": 0.45,
    "Batata": 1.20,
    "Tomate": 2.30,
    "Feijão": 1.50
}

# Consulta direta pela chave (tempo O(1)):
print(tabela["Tomate"])  # 2.30

# Modificação de valor existente:
tabela["Tomate"] = 2.50

# Inserção de uma nova chave:
tabela["Cebola"] = 1.10
```

:::warning
Tentar acessar uma chave inexistente (como `tabela["Abacaxi"]`) dispara imediatamente a exceção `KeyError: 'Abacaxi'`.
:::

Para prevenir o `KeyError`, testamos a existência da chave com o operador `in`:
```python
if "Abacaxi" in tabela:
    print(tabela["Abacaxi"])
else:
    print("Produto não cadastrado na tabela de preços.")
```

Alternativamente, podemos usar o método seguro `tabela.get("Abacaxi", 0.0)`, que devolve um valor padrão predefinido sem estourar exceção.

---

### 2. A Regra Inegociável das Chaves: Objetos Hasháveis

Nem todo objeto pode ser usado como chave de um dicionário:

:::key-idea
Para que um objeto sirva como chave em um dicionário, ele deve ser **imutável e hashável** (*hashable*):
* **Tipos válidos como chave:** `str`, `int`, `float`, `bool`, `tuple`.
* **Tipos proibidos como chave:** `list`, `dict`, `set` (disparam `TypeError: unhashable type: 'list'`).
:::

Os valores associados, por outro lado, podem ser de **qualquer tipo**, sem qualquer restrição (incluindo listas e outros dicionários).

---

### 3. Métodos Fundamentais de Introspecção

Python fornece três métodos canônicos para inspecionar os elementos de um dicionário:

1. **`d.keys()`:** Retorna uma visão dinâmica de todas as chaves cadastradas.
2. **`d.values()`:** Retorna uma visão de todos os valores armazenados.
3. **`d.items()`:** Retorna pares tuplados `(chave, valor)`, permitindo desempacotamento idiomático em laços `for`:

```python
for produto, preco in tabela.items():
    print(f"Item: {produto:8s} | Preço: R$ {preco:.2f}")
```

---

### 4. Aplicação Prática: Contagem de Frequência de Caracteres (Exercício 6.18)

No Exercício 6.18, construímos um analisador estatístico de texto que conta a frequência de cada caractere em uma frase:

```python
frase = input("Digite uma frase para análise: ")

ocorrencias = {}

for letra in frase:
    if letra in ocorrencias:
        ocorrencias[letra] += 1
    else:
        ocorrencias[letra] = 1

print("\n--- Histograma de Frequência de Caracteres ---")
for char, contagem in ocorrencias.items():
    rep = repr(char)
    print(f"Caractere {rep:6s}: {contagem:2d} ocorrência(s)")
```
