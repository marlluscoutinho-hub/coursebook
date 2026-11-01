# Herança de Classes, Especialização e a Função Super

> *"Quando você utilizar herança, tente criar classes nas quais o comportamento e características comuns fiquem na superclasse. Dessa forma, você poderá definir subclasses enxutas... Se mudarmos algo na superclasse, essas mudanças serão também usadas pelas subclasses."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, p. 229

---

### Visão Geral da Aula

No mundo real e no design de sistemas, entidades frequentemente compartilham 90% das suas propriedades, mas diferem em regras específicas. Por exemplo, uma **Conta Especial** possui titular, número, saldo, operações de depósito e extrato idênticos a uma **Conta Comum**, mas acrescenta um novo conceito: **limite de crédito adicional** para saques descobertos.

Copiar e colar o código da classe `Conta` para criar uma `ContaEspecial` duplicaria dezenas de linhas e geraria pesadelo de manutenção. A solução é o pilar da **Herança**:
1. **Relação "É-Um" (*Is-A*):** Estabelecer que uma `ContaEspecial` *é uma* `Conta`.
2. **Superclasse vs Subclasse:** A classe base (`Conta`) e a classe derivada (`ContaEspecial`).
3. **A Função `super()`:** Como invocar o construtor da classe mãe para inicializar atributos herdados sem redundância de código.
