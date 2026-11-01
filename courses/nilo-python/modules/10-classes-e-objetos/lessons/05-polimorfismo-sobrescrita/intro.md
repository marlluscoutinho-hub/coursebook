# Polimorfismo, Sobrescrita de Métodos e Princípio de Substituição

> *"É importante notar que, ao utilizarmos herança, as subclasses devem poder substituir suas superclasses sem perda de funcionalidade e sem gerar erros nos programas... O polimorfismo permite tratar objetos de diferentes classes derivadas através de uma interface comum uniforme."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, pp. 229, 230

---

### Visão Geral da Aula

Imagine que você está desenvolvendo o caixa automático de um banco ou a rotina de virada do mês que cobra tarifas e imprime extratos. O banco possui milhares de contas: algumas são `Conta` comuns e outras são `ContaEspecial` com limite de cheque especial.

Você precisaria escrever testes como `if type(conta) == ContaEspecial: ... else: ...` espalhados por todo o código? **Absolutamente não.**

É para isso que existe o **Polimorfismo** (*muitas formas*):
1. **Sobrescrita de Métodos (*Method Overriding*):** Como uma subclasse redefine a implementação de um método da superclasse para expressar seu comportamento especializado (como `pode_sacar()` e `extrato()`).
2. **Despacho Dinâmico (*Dynamic Dispatch*):** Como o Python decide em tempo de execução qual método invocar com base na classe real do objeto apontado por `self`.
3. **Tratamento Uniforme de Coleções:** A capacidade de iterar sobre uma lista heterogênea `[conta1, conta_esp, conta2]` e invocar `.saque()` ou `.extrato()` sabendo que cada objeto se comportará de acordo com sua própria regra sem quebrar o laço.
