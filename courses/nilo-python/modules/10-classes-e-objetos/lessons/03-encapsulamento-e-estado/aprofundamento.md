# Aprofundamento Teórico: Invariantes de Estado e Encapsulamento

O estado de um objeto deve ser **consistente** em todos os momentos de sua vida útil. Em programação orientada a objetos, chamamos de **invariante** uma condição lógica que deve ser verdadeira antes e depois da execução de qualquer método.

---

### 1. Invariantes no Exemplo da Televisão (Exercícios 10.2 a 10.5)

Na modelagem inicial da classe `Televisao`, o usuário podia decrementar o canal indefinidamente até números negativos (`canal = -1`). Para proteger o estado:

```python
class Televisao:
    def __init__(self, min_canal=2, max_canal=14):
        self.ligada = False
        self.canal = min_canal
        self.cmin = min_canal
        self.cmax = max_canal

    def muda_canal_para_cima(self):
        if self.canal + 1 <= self.cmax:
            self.canal += 1
        else:
            self.canal = self.cmin  # Rotação circular de canais!

    def muda_canal_para_baixo(self):
        if self.canal - 1 >= self.cmin:
            self.canal -= 1
        else:
            self.canal = self.cmax  # Rotação circular de canais!
```
Ao encapsular a mutação nos métodos `muda_canal_para_cima` e `muda_canal_para_baixo`, o objeto impede que seu canal assuma valores fora do intervalo $[cmin, cmax]$.

---

### 2. Validação e Histórico na Conta Bancária (Listagem 10.4, p. 222)

Vejamos a classe `Conta` canônica com controle de saldo e extrato:

```python
class Conta:
    def __init__(self, clientes, numero, saldo=0.0):
        self.saldo = 0.0
        self.clientes = clientes
        self.numero = numero
        self.operacoes = []
        if saldo > 0:
            self.deposito(saldo)

    def resumo(self):
        print(f"CC Número: {self.numero} | Saldo: R$ {self.saldo:.2f}")

    def pode_sacar(self, valor):
        return self.saldo >= valor

    def saque(self, valor):
        if self.pode_sacar(valor):
            self.saldo -= valor
            self.operacoes.append(["SAQUE", valor])
            return True
        else:
            print("Saldo insuficiente para efetuar o saque!")
            return False

    def deposito(self, valor):
        if valor > 0:
            self.saldo += valor
            self.operacoes.append(["DEPÓSITO", valor])
            return True
        return False

    def extrato(self):
        print(f"Extrato CC Nº {self.numero}")
        for op, val in self.operacoes:
            print(f"{op:12s}: R$ {val:8.2f}")
        print(f"Saldo atual : R$ {self.saldo:8.2f}\n")
```

Observe as regras de integridade encapsuladas:
1. `saque()` não permite que o saldo fique negativo; ele consulta `pode_sacar()`.
2. `deposito()` não aceita valores negativos ou zerados.
3. Toda operação autorizada é atomicamente registrada no histórico `self.operacoes`.
4. O extrato projeta o histórico fiel de transações a qualquer momento.
