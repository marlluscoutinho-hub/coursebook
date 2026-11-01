# Laboratório Interativo: Simulador Bancário POO & Métodos Mágicos

> *"Uma bancada interativa de POO permite instanciar objetos concretos, invocar métodos de depósito e saque, observar o polimorfismo entre Contas Comuns e Contas Especiais em ação e inspecionar a mecânica de métodos mágicos como len e getitem."*  
> — **Nilo Ney Coutinho Menezes**, *Capítulo 10*, pp. 216–259

---

### Visão Geral do Laboratório

Bem-vindo ao laboratório prático de Programação Orientada a Objetos. Esta bancada interativa permite interagir com as classes canônicas do Capítulo 10 em um ambiente visual reativo:

1. **Simulador Bancário Orientado a Objetos:**
   - Instancie objetos das classes `Conta` e `ContaEspecial` dinamicamente com titular, saldo inicial e limite de cheque especial.
   - Execute operações atômicas de depósito (`.deposito(v)`) e saque (`.saque(v)`).
   - Teste a autorização polimórfica: comprove que uma `ContaEspecial` autoriza saques maiores que o saldo físico usando o limite, enquanto uma `Conta` comum recusa a operação.
   - Emita extratos analíticos completos gerados pelo método `.extrato()` do objeto selecionado.

2. **Inspetor de Métodos Mágicos (`ListaÚnica`):**
   - Teste a classe `ListaÚnica(int)` adicionando elementos válidos e inválidos.
   - Observe a validação de tipo disparando `TypeError` em tempo real para floats ou strings.
   - Verifique os métodos mágicos `__len__`, `__getitem__` e `__iter__` operando na coleção.
