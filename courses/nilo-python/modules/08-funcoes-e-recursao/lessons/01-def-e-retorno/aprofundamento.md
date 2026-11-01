# Aprofundamento Teórico: Engenharia de Funções e o Ciclo do `return`

### 1. Declaração vs Invocação

Quando o interpretador Python encontra a palavra-chave `def`, ele não executa o corpo da função imediatamente: ele compila o bloco em um objeto de código (*code object*) e vincula o nome da função a esse objeto no espaço de nomes (*namespace*) atual.

```python
# Declaração (preparação):
def soma(a, b):
    return a + b

# Invocação (execução física):
resultado = soma(10, 25)
print(resultado)  # 35
```

---

### 2. A Filosofia de Projeto: `print()` vs `return`

Um dos erros mais comuns de iniciantes é colocar comandos `print()` dentro de todas as funções. Nilo Menezes (p. 162) destaca a importância de separar o cálculo da apresentação:

```python
# ABORDAGEM PROBLEMÁTICA (acoplamento rígido com a tela):
def soma_ruim(a, b):
    print(a + b)

# ABORDAGEM IDIOMÁTICA E REUTILIZÁVEL:
def soma_boa(a, b):
    return a + b
```

Por que `return` é infinitamente superior?
1. **Composabilidade:** O valor retornado por `soma_boa(2, 3)` pode ser passado diretamente para outra função: `raiz_quadrada(soma_boa(2, 3))`.
2. **Testabilidade:** Testes unitários automatizados inspecionam o valor de retorno, não o texto impresso no terminal.
3. **Flexibilidade de Destino:** O resultado pode ser salvo em arquivo, gravado em banco de dados SQLite, enviado por rede ou exibido na interface gráfica.

---

### 3. A Instrução `return` como Ponto de Saída

A execução de uma instrução `return` causa a terminação imediata da função. Quaisquer linhas situadas após o `return` dentro do mesmo fluxo são sumariamente ignoradas:

```python
def classifica_numero(x):
    if x > 0:
        return "Positivo"
    if x < 0:
        return "Negativo"
    return "Zero"
    print("Esta linha NUNCA será executada!")
```

Se uma função terminar seu bloco sem executar um `return` explícito, o Python retorna implicitamente o objeto especial `None`.

#### Retorno Múltiplo de Valores
Em Python, uma função pode retornar múltiplos valores separando-os por vírgula. O interpretador empacota esses valores automaticamente em uma tupla:

```python
def operacoes(a, b):
    soma = a + b
    produto = a * b
    return soma, produto  # Retorna uma tupla (soma, produto)

s, p = operacoes(4, 5)   # Desempacotamento direto
print(f"Soma: {s}, Produto: {p}")  # Soma: 9, Produto: 20
```
