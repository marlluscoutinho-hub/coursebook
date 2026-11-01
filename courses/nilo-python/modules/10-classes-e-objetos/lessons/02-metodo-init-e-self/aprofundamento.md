# Aprofundamento Teórico: A Mecânica Interna do `self` e Construtores

### 1. O que realmente é o `self`?

No Python, a sintaxe de orientação a objetos é uma camada elegante de açúcar sintático sobre chamadas de funções normais com dicionários de atributos.

Quando você escreve:
```python
class Televisao:
    def muda_canal_para_cima(self):
        self.canal += 1

tv = Televisao()
tv.canal = 4
tv.muda_canal_para_cima()
```

O interpretador CPython traduz a chamada `tv.muda_canal_para_cima()` exatamente para:
```python
Televisao.muda_canal_para_cima(tv)
```

Ou seja: o objeto `tv` à esquerda do ponto é passado automaticamente como o **primeiro argumento** para o parâmetro `self` da função! O nome `self` é uma convenção universal estabelecida na PEP 8 (embora gramaticalmente qualquer nome pudesse ser usado, violar a convenção é inaceitável na indústria).

---

### 2. A Inicialização de Estado no `__init__`

O método especial `__init__` é o **inicializador** do objeto. Ele não aloca a memória (quem aloca é o método primitivo `__new__`), mas configura todos os atributos obrigatórios e valores padrão antes do objeto ser entregue ao programa chamador:

```python
class ContaBancaria:
    def __init__(self, titular, saldo_inicial=0.0):
        # Atributos de instância (prefixados com self.):
        self.titular = titular
        self.saldo = saldo_inicial
        self.historico = []  # Lista de transações associada a este objeto

# Chamadas com argumentos:
c1 = ContaBancaria("Carlos", 1000.0)
c2 = ContaBancaria("Beatriz")  # saldo_inicial assume 0.0
```

---

### 3. A Falha Clássica: Esquecer o `self.`

Observe com atenção a diferença crucial entre criar um atributo e declarar uma variável temporária:

```python
class ExemploErrado:
    def __init__(self, valor):
        x = valor  # x é apenas uma variável local! Deixa de existir ao sair de __init__

obj = ExemploErrado(42)
# print(obj.x) -> AttributeError: 'ExemploErrado' object has no attribute 'x'
```

**Correção:**
```python
class ExemploCorreto:
    def __init__(self, valor):
        self.x = valor  # self.x vincula o dado ao objeto permanente

obj = ExemploCorreto(42)
print(obj.x)  # 42
```

Sempre que você quiser que um dado pertença ao objeto e seja acessível por outros métodos da classe no futuro (`self.saldo`, `self.canal`, `self.titular`), **o prefixo `self.` é mandatório**.
