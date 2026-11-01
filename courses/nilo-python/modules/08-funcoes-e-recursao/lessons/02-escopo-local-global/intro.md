# Escopo de Variáveis, Ciclo de Vida e a Instrução Global

> *"Uma variável criada dentro de uma função existe apenas enquanto a função estiver sendo executada... Quando a função termina, suas variáveis locais são destruídas."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, p. 165

---

### Visão Geral da Aula

Quando múltiplos blocos e funções operam em um mesmo programa, surge uma questão crítica de isolamento: **o que impede uma variável `x` de uma função de sobrescrever acidentalmente a variável `x` de outra função ou do programa principal?**

A resposta está na regra de **escopos léxicos**:
1. **Escopo Local vs Escopo Global:** Como o Python gerencia variáveis criadas dentro do corpo da função versus variáveis definidas no nível superior do script.
2. **A Regra LEGB (Local, Enclosing, Global, Built-in):** Como o interpretador resolve nomes de identificadores durante a execução.
3. **A Palavra-Chave `global`:** Como declarar explicitamente que uma atribuição dentro de uma função deve afetar a variável de nível global, e por que o uso excessivo de globais é considerado um antipadrão de design.
