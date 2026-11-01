# Catálogo Exaustivo de Erros do Apêndice A

## 1. SyntaxError e IndentationError (Erros Gramaticais de Sintaxe)

Esses erros ocorrem antes do programa rodar, durante a análise léxica e sintática do interpretador.

### 1.1 `SyntaxError` (Erro de Sintaxe Gramatical)
- **Gatilho Típico:** Esquecer os dois pontos `:` ao final de estruturas de controle (`if`, `while`, `for`, `def`, `class`), deixar parênteses ou aspas sem fechar, ou utilizar palavras reservadas como nomes de variáveis.
```python
# ❌ ERRO: Faltam os dois pontos
if idade >= 18
    print("Maior de idade")

# ❌ ERRO: Uso de palavra reservada
for = 10
```
- **Solução:** Verifique o caractere `^` apontado pelo Python no traceback e complete a pontuação ou renomeie a variável.

### 1.2 `IndentationError` (Erro de Indentação)
- **Gatilho Típico:** Misturar tabulações (`\t`) com espaços ou recuar linhas com quantidades divergentes de espaços dentro do mesmo bloco.
```python
def saudacao():
    print("Olá")
      print("Mundo")  # ❌ 6 espaços em vez de 4!
```
- **Solução:** Configure seu editor para converter a tecla Tab em exatamente **4 espaços em branco** e alinhe todos os comandos no mesmo nível hierárquico.

---

## 2. NameError e TypeError (Erros de Identificadores e Tipos)

### 2.1 `NameError` (Identificador Não Localizado)
- **Gatilho Típico:** Tentar ler uma variável antes de atribuir um valor a ela, cometer erro de digitação (*typo*) no nome da função/variável, ou tentar usar dentro de uma função uma variável definida em outro escopo local.
```python
preco = 50.0
print(preoc)  # ❌ NameError: name 'preoc' is not defined
```
- **Solução:** Confira a grafia exata de cada caractere (Python diferencia maiúsculas de minúsculas: `Total` $\neq$ `total`).

### 2.2 `TypeError` (Tipo Incompatível)
- **Gatilho Típico:** Aplicar operações incompatíveis entre tipos distintos, passar argumentos a mais ou a menos em uma função, ou tentar indexar tipos não iteráveis (como tentar fatiar um número inteiro `123[0]`).
```python
idade = 20
texto = "Idade: " + idade  # ❌ TypeError: can only concatenate str to str
```
- **Solução:** Faça a conversão explícita de tipos com `str(idade)` ou use interpolação formatada `f"Idade: {idade}"`.

---

## 3. ValueError, IndexError, KeyError e ZeroDivisionError

### 3.1 `ValueError` (Valor Incompatível com a Operação)
- **Gatilho Típico:** O tipo está correto, mas o conteúdo não pode ser interpretado pela operação. O caso mais clássico é tentar converter letras em números com `int()` ou `float()`, ou tentar desempacotar uma tupla em número divergente de variáveis.
```python
numero = int("cem")  # ❌ ValueError: invalid literal for int()
a, b = [1, 2, 3]     # ❌ ValueError: too many values to unpack
```
- **Solução:** Valide os dados antes da conversão ou capture com `try / except ValueError`.

### 3.2 `IndexError` (Índice Fora dos Limites da Sequência)
- **Gatilho Típico:** Em uma lista de tamanho $N$, os índices válidos vão de $0$ até $N - 1$. Tentar acessar `lista[N]` dispara `IndexError`.
```python
cores = ["azul", "verde"]  # len(cores) == 2. Índices: 0 e 1
print(cores[2])            # ❌ IndexError: list index out of range
```
- **Solução:** Nunca use o tamanho da lista como índice. O último elemento é acessado com `cores[-1]` ou `cores[len(cores) - 1]`.

### 3.3 `KeyError` (Chave Não Encontrada no Dicionário)
- **Gatilho Típico:** Consultar `dicionario[chave]` quando a chave solicitada não existe no mapeamento.
```python
usuario = {"nome": "Maria"}
print(usuario["idade"])  # ❌ KeyError: 'idade'
```
- **Solução:** Use o operador de pertinência `if "idade" in usuario:` ou o método seguro `usuario.get("idade", 0)`.

### 3.4 `ZeroDivisionError` (Divisão ou Módulo por Zero)
- **Gatilho Típico:** O denominador de uma divisão (`/`, `//`) ou resto (`%`) resultou no valor numérico 0.
```python
media = total / contador  # ❌ ZeroDivisionError se contador == 0
```
- **Solução:** Proteja com condicional `if contador != 0:` ou trate com `try/except ZeroDivisionError`.
