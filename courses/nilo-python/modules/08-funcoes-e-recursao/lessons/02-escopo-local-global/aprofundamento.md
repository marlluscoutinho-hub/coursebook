# Aprofundamento Teórico: Namespaces, Escopos e Sombreamento de Variáveis

### 1. Variáveis Locais e Ciclo de Vida

Toda invocação de função cria um novo quadro de ativação (*stack frame*) contendo seu próprio espaço de nomes local (*local namespace*). Variáveis declaradas dentro da função (ou passadas como parâmetros) nascem quando a função inicia e deixam de existir quando a função retorna:

```python
def teste():
    a = 10  # Variável local
    print(f"Dentro da função: a = {a}")

teste()
# print(a) -> NameError: name 'a' is not defined
```

O isolamento é total: o programa principal não enxerga a variável `a`, evitando colisões de nomes acidentais entre diferentes módulos.

---

### 2. Sombreamento de Variáveis (*Variable Shadowing*)

Se uma variável global e uma variável local compartilharem o mesmo nome, o Python prioriza o escopo local, "sombreando" a variável global sem alterá-la:

```python
x = 5  # x global

def altera():
    x = 100  # x local! Cria uma nova variável na tabela de símbolos local
    print(f"Dentro da função: x = {x}")  # 100

altera()
print(f"No programa principal: x = {x}")  # 5 (Inalterado!)
```

---

### 3. Modificação Explícita com a Palavra-Chave `global`

Se uma função realmente precisar alterar o valor de uma variável definida no escopo global, a palavra-chave `global` deve ser usada antes de qualquer atribuição:

```python
total_vendas = 0  # Global

def registrar_venda(valor):
    global total_vendas
    total_vendas += valor  # Modifica a variável global existente

registrar_venda(50)
registrar_venda(120)
print(f"Total acumulado: {total_vendas}")  # 170
```

> [!WARNING]
> **O Perigo do Estado Global:**
> O uso de variáveis globais cria acoplamento invisível entre partes desconexas do sistema, dificultando a depuração e inviabilizando testes em paralelo. A melhor prática em engenharia de software é receber os dados como parâmetros e retornar novos dados via `return`.

---

### 4. A Pegadinha do `UnboundLocalError`

Veja o erro clássico que ocorre ao tentar ler e escrever uma variável global na mesma função sem a declaração `global`:

```python
contador = 1

def incrementa():
    contador += 1  # UnboundLocalError: local variable 'contador' referenced before assignment

incrementa()
```

Por que isso acontece? O compilador do Python analisa a função e vê a atribuição `contador = ...`. Ele conclui que `contador` é uma variável **local** daquela função. Quando a linha tenta ler o valor de `contador` para somar 1 antes de criá-la localmente, o erro é disparado. A solução é usar `global contador` ou passar o contador como parâmetro.
