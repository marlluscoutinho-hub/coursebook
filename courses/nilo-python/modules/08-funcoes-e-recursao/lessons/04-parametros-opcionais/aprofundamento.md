# Aprofundamento Teórico: Parâmetros Default, Argumentos Nomeados e Validação Robusta

### 1. Parâmetros com Valores Padrão

A definição de valores padrão permite que o chamador omita argumentos secundários:

```python
def barra(n=40, caractere="*"):
    print(caractere * n)

barra()          # Imprime 40 asteriscos
barra(10)        # n=10, caractere="*" (10 asteriscos)
barra(10, "-")   # n=10, caractere="-" (10 traços)
```

#### A Regra Gramatical de Ordenação
Parâmetros obrigatórios (sem valor padrão) **devem obrigatoriamente preceder** qualquer parâmetro opcional no cabeçalho da função:

```python
# VÁLIDO:
def soma(a, b, imprime=False):
    s = a + b
    if imprime:
        print(s)
    return s

# INVÁLIDO (SyntaxError: non-default argument follows default argument):
# def soma_invalida(imprime=False, a, b): ...
```

---

### 2. Chamadas com Argumentos Nomeados (*Keyword Arguments*)

Quando uma função possui muitos parâmetros, lembrar a ordem posicional torna-se um fardo cognitivo propício a bugs. O Python permite nomear os argumentos na chamada:

```python
def retangulo(largura, altura, caractere="*"):
    linha = caractere * largura
    for _ in range(altura):
        print(linha)

# Chamadas com nomes explícitos (a ordem deixa de importar):
retangulo(largura=5, altura=2)
retangulo(altura=3, largura=8, caractere="#")
```

> [!NOTE]
> **Regra de Mistura Posicional e Nomeada:**
> Se você misturar argumentos posicionais e nomeados, todos os argumentos posicionais devem vir primeiro. Uma vez que o primeiro argumento nomeado for fornecido na invocação, todos os argumentos subsequentes devem obrigatoriamente ser nomeados também.
> `retangulo(5, altura=3)` $\to$ Válido!
> `retangulo(largura=5, 3)` $\to$ `SyntaxError: positional argument follows keyword argument`.

---

### 3. A Pegadinha do Valor Padrão Mutável (*Default Mutable Trap*)

Um dos aspectos mais sutis da semântica de execução do Python ocorre quando usamos objetos mutáveis (como listas ou dicionários) como valores padrão:

```python
# CUIDADO: Este valor padrão é criado UMA ÚNICA VEZ na compilação da função!
def adiciona_item(item, lista=[]):
    lista.append(item)
    return lista

print(adiciona_item(1))  # [1]
print(adiciona_item(2))  # [1, 2] -> A mesma lista foi reutilizada!
```

**Solução Idiomática com `None`:**
```python
def adiciona_item_seguro(item, lista=None):
    if lista is None:
        lista = []
    lista.append(item)
    return lista

print(adiciona_item_seguro(1))  # [1]
print(adiciona_item_seguro(2))  # [2] -> Lista nova criada para cada chamada
```

---

### 4. Padrão de Validação Canônico (Listagem 8.16, p. 173)

Modularizar a validação de entrada de dados blinda o programa contra entradas corruptas:

```python
def faixa_int(pergunta, minimo, maximo):
    while True:
        try:
            v = int(input(pergunta))
            if v < minimo or v > maximo:
                print(f"Valor inválido. Digite um valor entre {minimo} e {maximo}.")
            else:
                return v
        except ValueError:
            print("Digite um número inteiro válido!")
```
Esta função encapsula laço, tratamento de exceções, validação de limites e retorno em um único componente reutilizável por qualquer módulo do sistema.
