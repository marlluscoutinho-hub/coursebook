# Aprofundamento Teórico: Sobrescrita Elegante e o Princípio de Substituição

### 1. Refatoração Canônica: O Exercício 10.12 do Livro

Observe um problema comum de design inicial:
Se na classe base `Conta`, o método `saque()` faz a checagem com `if self.saldo >= valor:`, para a `ContaEspecial` permitir saque com limite, teríamos que reescrever o método `saque()` inteiro na subclasse, duplicando a linha `self.saldo -= valor` e o `self.operacoes.append(...)`.

Nilo Menezes propõe uma refatoração genial no Exercício 10.12 (p. 230): **isolar a condição de autorização em um método auxiliar `pode_sacar()`**.

```python
class Conta:
    def __init__(self, clientes, numero, saldo=0.0):
        self.saldo = saldo
        self.clientes = clientes
        self.numero = numero
        self.operacoes = []

    def pode_sacar(self, valor):
        # Regra da Conta Comum: saldo deve cobrir o valor
        return self.saldo >= valor

    def saque(self, valor):
        # O método de saque agora é UNIVERSAL:
        if self.pode_sacar(valor):
            self.saldo -= valor
            self.operacoes.append(["SAQUE", valor])
            return True
        return False

class ContaEspecial(Conta):
    def __init__(self, clientes, numero, saldo=0.0, limite=1000.0):
        super().__init__(clientes, numero, saldo)
        self.limite = limite

    def pode_sacar(self, valor):
        # Sobrescrita Polimórfica: saldo + limite devem cobrir o valor!
        return (self.saldo + self.limite) >= valor
```

> [!NOTE]
> **A Elegância do Polimorfismo:**
> Note que a classe `ContaEspecial` **nem precisou redefinir o método `saque()`**!
> Quando `conta_esp.saque(600)` é executado, ele usa o método `saque()` herdado de `Conta`. Porém, quando o código de `saque()` chama internamente `self.pode_sacar(600)`, o Python resolve dinamicamente a chamada para a versão de `ContaEspecial`! Isso é o polimorfismo em sua forma mais refinada.

---

### 2. Sobrescrita do Método de Extrato (Exercício 10.11)

A subclasse também pode enriquecer a visualização de relatórios:

```python
class ContaEspecial(Conta):
    # ...
    def extrato(self):
        # Imprime o extrato comum herdado ou customizado com limite
        print(f"Extrato Especial Nº {self.numero}")
        for op, val in self.operacoes:
            print(f"{op:12s}: R$ {val:8.2f}")
        print(f"Saldo contábil : R$ {self.saldo:8.2f}")
        print(f"Limite aprovado: R$ {self.limite:8.2f}")
        print(f"Total p/ saque : R$ {(self.saldo + self.limite):8.2f}\n")
```

---

### 3. Processamento Polimórfico de Coleções

Graças ao polimorfismo, podemos iterar sobre uma lista de contas bancárias mistas e aplicar operações de forma transparente:

```python
contas_banco = [
    Conta("Ana", 101, saldo=200.0),
    ContaEspecial("Bruno", 102, saldo=50.0, limite=500.0),
    Conta("Carlos", 103, saldo=800.0)
]

# Tentativa de sacar R$ 300 em todas as contas:
for c in contas_banco:
    sucesso = c.saque(300.0)
    print(f"Conta {c.numero}: {'Saque aprovado' if sucesso else 'Recusado'}")

# Resultado:
# Conta 101: Recusado (Saldo 200 < 300)
# Conta 102: Saque aprovado (Saldo 50 + Limite 500 = 550 >= 300)
# Conta 103: Saque aprovado (Saldo 800 >= 300)
```
O laço não contém nenhum `if isinstance(...)`. Cada objeto reage e decide sua própria autorização com base em sua implementação de classe.
