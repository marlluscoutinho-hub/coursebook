# Aprofundamento Teórico: Assinaturas Variádicas com `*args` e `**kwargs`

Funções que aceitam uma quantidade variável de parâmetros são denominadas **variádicas** (*variadic functions*). No CPython, o analisador sintático trata os operadores `*` e `**` como diretivas especiais de empacotamento e desempacotamento de contêineres de dados.

---

### 1. Empacotamento Posicional com `*args`

Quando adicionamos um asterisco antes de um parâmetro na definição da função, o Python captura todos os argumentos posicionais excedentes passados pelo chamador e os empacota em uma **tupla**:

```python
def soma_multipla(*numeros):
    print(type(numeros))  # <class 'tuple'>
    total = 0
    for n in numeros:
        total += n
    return total

print(soma_multipla(1, 2))              # 3
print(soma_multipla(10, 20, 30, 40))    # 100
print(soma_multipla())                  # 0 (tupla vazia)
```

Podemos combinar parâmetros obrigatórios normais com `*args`:
```python
def registrar_log(nivel, *mensagens):
    texto = " ".join(mensagens)
    print(f"[{nivel.upper()}] {texto}")

registrar_log("info", "Servidor", "iniciado", "na", "porta", "8080")
# [INFO] Servidor iniciado na porta 8080
```

---

### 2. Empacotamento Nomeado com `**kwargs`

O duplo asterisco `**` captura quaisquer argumentos nomeados (*keyword arguments*) passados na chamada que não tenham sido expressamente declarados na assinatura, empacotando-os em um **dicionário**:

```python
def configurar_servidor(host, porta, **opcoes):
    print(f"Host: {host}:{porta}")
    print(f"Opções extras ({type(opcoes)}): {opcoes}")
    
    timeout = opcoes.get("timeout", 30)
    ssl = opcoes.get("ssl", False)
    print(f"Timeout: {timeout}s | SSL ativo: {ssl}")

configurar_servidor("127.0.0.1", 5432, timeout=60, ssl=True, debug=True)
```

---

### 3. A Assinatura Universal e Desempacotamento na Chamada

A combinação de `*args` e `**kwargs` cria uma função com assinatura universal, capaz de interceptar qualquer combinação de chamadas e repassá-la adiante (padrão de projeto *Proxy* / *Decorator*):

```python
def wrapper(funcao_alvo, *args, **kwargs):
    print("--- Pré-execução: Interceptando chamada ---")
    resultado = funcao_alvo(*args, **kwargs)  # Desempacotamento na chamada!
    print("--- Pós-execução: Concluído ---")
    return resultado
```

#### Desempacotando Coleções na Chamada
Se já possuímos uma lista `valores = [10, 20]` ou um dicionário `params = {'largura': 10, 'altura': 5}`, podemos passá-los desempacotados:
```python
def calcula_area(largura, altura):
    return largura * altura

dimensoes = [8, 4]
print(calcula_area(*dimensoes))  # Equivalente a calcula_area(8, 4)

dados_dict = {"largura": 12, "altura": 6}
print(calcula_area(**dados_dict)) # Equivalente a calcula_area(largura=12, altura=6)
```
Essa simetria entre empacotar no cabeçalho e desempacotar na chamada é um dos pilares da expressividade idiomática do Python.
