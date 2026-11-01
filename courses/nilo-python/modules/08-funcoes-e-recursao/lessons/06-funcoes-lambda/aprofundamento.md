# Aprofundamento Teórico: Funções de Ordem Superior e o Cálculo Lambda

### 1. Funções como Parâmetros (Funções de Ordem Superior)

Uma função de ordem superior (*Higher-Order Function*) é uma função que recebe outra função como argumento ou retorna uma função como resultado.

Observe a Listagem 8.26 do livro de Nilo Menezes (p. 178):

```python
def soma(a, b):
    return a + b

def subtracao(a, b):
    return a - b

def imprime_operacao(a, b, foper):
    # foper é chamado exatamente como qualquer função:
    resultado = foper(a, b)
    print(f"Resultado da operação: {resultado}")

# Passando a função sem parênteses:
imprime_operacao(10, 5, soma)       # Resultado da operação: 15
imprime_operacao(10, 5, subtracao)  # Resultado da operação: 5
```

> [!IMPORTANT]
> **Atenção à Sintaxe: Nome vs Chamada:**
> - `soma`: Refere-se ao **objeto função** em si (o ponteiro da função). É o que passamos como parâmetro.
> - `soma(10, 5)`: É a **execução imediata** da função, produzindo o número 15. Passar `imprime_operacao(10, 5, soma(10, 5))` geraria `TypeError: 'int' object is not callable` dentro da função receptora!

---

### 2. Expressões Lambda (Funções Anônimas)

Muitas vezes precisamos de uma função minúscula para realizar uma checagem simples uma única vez. Declarar uma função completa com `def`, nome, indentação e `return` pode ser desnecessariamente verboso.

As funções `lambda` fornecem uma notação compacta originada no Cálculo Lambda de Alonzo Church:

$$\mathbf{lambda} \quad \text{parâmetros} : \text{expressão}$$

```python
# Equivalência formal:
# def dobro(x): return x * 2
dobro = lambda x: x * 2
print(dobro(5))  # 10

# Função lambda com múltiplos parâmetros:
multiplica = lambda a, b: a * b
print(multiplica(3, 4))  # 12
```

Restrições fundamentais das funções lambda em Python:
- Podem conter apenas **uma única expressão**. Não podem conter comandos imperativos como `while`, `for`, `try/except` ou atribuições com `=`.
- O valor da expressão calculada é retornado **automaticamente** sem necessidade da palavra `return`.

---

### 3. Ordenação com Chave Customizada (`key=lambda`)

O uso mais idiomático e frequente de funções lambda no cotidiano de um desenvolvedor Python é como critério de ordenação com `sort()` ou `sorted()`:

```python
# Lista de tuplas representando produtos e preços:
produtos = [
    ("Tomate", 2.30),
    ("Alface", 0.45),
    ("Batata", 1.20)
]

# Ordenar por preço crescente (segundo elemento da tupla):
produtos_ordenados = sorted(produtos, key=lambda item: item[1])
print(produtos_ordenados)
# [('Alface', 0.45), ('Batata', 1.2), ('Tomate', 2.3)]
```
Sem lambdas, teríamos que definir uma função separada `def obtem_preco(item): return item[1]` apenas para alimentar o `sorted()`. A lambda condensa tudo em uma expressão clara e legível.
