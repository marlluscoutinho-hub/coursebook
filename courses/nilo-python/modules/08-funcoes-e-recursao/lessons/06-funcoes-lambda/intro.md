# Funções de Primeira Classe e Expressões Lambda Anônimas

> *"Um poderoso recurso de Python é permitir a passagem de funções como parâmetro... Em Python, funções são objetos como qualquer outro, podendo ser atribuídas a variáveis, passadas como parâmetros e retornadas por outras funções."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, pp. 178, 182

---

### Visão Geral da Aula

Em muitas linguagens legadas, funções são apenas blocos estáticos de instruções compiladas. Em Python, funções são **cidadãs de primeira classe** (*first-class citizens*): possuem o tipo `function`, podem ser armazenadas em listas ou dicionários, passadas como argumentos para outras funções e criadas dinamicamente em tempo de execução.

Nesta aula, exploraremos:
1. **Injeção de Comportamento:** Como passar funções como argumentos para construir filtros e transformadores genéricos (Listagem 8.27).
2. **Funções Anônimas (`lambda`):** A sintaxe concisa `lambda x: expressao` para criar pequenas funções descartáveis de uma única linha.
3. **Casos de Uso Canônicos:** Ordenação customizada com `sorted(..., key=lambda ...)` e funções de ordem superior como `filter()` e `map()`.
