# Encapsulamento de Regras de Negócio e Métodos Mutadores

> *"Se permitirmos que qualquer parte do programa altere diretamente os atributos de um objeto, podemos corromper seu estado com valores inválidos, como um canal negativo ou um saque maior que o saldo... Os métodos servem para proteger e validar as alterações."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, pp. 219–225

---

### Visão Geral da Aula

Imagine um sistema bancário onde qualquer linha de código pudesse executar `conta.saldo = 1000000` sem nenhuma verificação ou autorização. O sistema entraria em colapso financeiro imediatamente.

O princípio do **encapsulamento** estabelece que o estado interno de um objeto deve ser manipulado exclusivamente através de sua interface pública de métodos:
1. **Proteção de Invariantes:** Garantir que o canal de uma televisão nunca seja menor que 1 ou maior que o canal máximo permitido (Exercícios 10.2 e 10.3).
2. **Métodos de Mutação com Validação:** Implementar operações como `saque(valor)` e `deposito(valor)` que validam regras de negócio antes de alterar o saldo.
3. **Histórico de Operações:** Acumular registros de transações (extratos) como efeito colateral controlado das operações autorizadas.
