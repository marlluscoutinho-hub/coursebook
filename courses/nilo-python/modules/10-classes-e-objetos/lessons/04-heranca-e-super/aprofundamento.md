# Aprofundamento Teórico: Hierarquia de Tipos e Reuso com `super()`

### 1. Declaração de Herança em Python

Para indicar que uma classe herda de outra, colocamos o nome da superclasse entre parênteses logo após o nome da nova subclasse:

$$\mathbf{class} \quad \text{SubClasse}(\text{SuperClasse}):$$

Vejamos a implementação canônica da `ContaEspecial` herdando de `Conta` (Listagem 10.10, p. 227):

```python
class Conta:
    def __init__(self, clientes, numero, saldo=0.0):
        self.saldo = saldo
        self.clientes = clientes
        self.numero = numero
        self.operacoes = []
        if saldo > 0:
            self.operacoes.append(["DEPÓSITO INICIAL", saldo])

    def deposito(self, valor):
        self.saldo += valor
        self.operacoes.append(["DEPÓSITO", valor])

class ContaEspecial(Conta):
    def __init__(self, clientes, numero, saldo=0.0, limite=0.0):
        # Invocação do construtor da superclasse via super():
        super().__init__(clientes, numero, saldo)
        # Atributo especializado e exclusivo da subclasse:
        self.limite = limite
```

---

### 2. A Mecânica da Função `super()`

O que faz a chamada `super().__init__(clientes, numero, saldo)`?
1. Ela delega a inicialização dos campos comuns (`self.saldo`, `self.clientes`, `self.numero`, `self.operacoes`) diretamente para o construtor da classe base `Conta`.
2. Evita duplicação de lógica: se amanhã a classe `Conta` passar a gerar números de protocolo ou registrar timestamps, a subclasse herdará esse comportamento automaticamente sem precisar ser reescrita.
3. Respeita a Ordem de Resolução de Métodos (*MRO - Method Resolution Order*).

---

### 3. Herança de Métodos Automática

Uma instância de `ContaEspecial` herda todos os métodos existentes na superclasse sem que seja necessário digitar uma única linha a mais:

```python
# Criando uma conta especial com R$ 500 de saldo e R$ 1000 de limite:
ce = ContaEspecial("Maria", 102, saldo=500.0, limite=1000.0)

# O método deposito() NÃO foi definido em ContaEspecial; ele foi herdado de Conta:
ce.deposito(200.0)
print(ce.saldo)  # 700.0

# Verificação de tipo e hierarquia:
print(isinstance(ce, ContaEspecial))  # True
print(isinstance(ce, Conta))          # True! Uma ContaEspecial É UMA Conta!
print(issubclass(ContaEspecial, Conta)) # True
```
A verificação `isinstance(ce, Conta)` comprova formalmente o princípio da substituição: onde quer que o sistema espere um objeto do tipo `Conta`, uma `ContaEspecial` pode ser fornecida com total compatibilidade.
