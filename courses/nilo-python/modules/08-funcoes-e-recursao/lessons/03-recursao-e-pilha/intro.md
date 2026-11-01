# Recursão Matemática, Pilha de Chamadas e Caso Base

> *"Dizemos que uma função é recursiva quando ela chama a si mesma... Toda função recursiva deve possuir uma condição de parada, chamada de caso base, para evitar que ela continue chamando a si mesma indefinidamente até esgotar a memória."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, pp. 169–172

---

### Visão Geral da Aula

A **recursão** é um dos paradigmas mais elegantes e poderosos da ciência da computação. Ela expressa a solução de um problema grande em termos de instâncias menores do mesmo problema, refletindo com perfeição definições matemáticas indutivas.

Nesta aula, desvendaremos:
1. **Os Dois Pilares da Recursão:** O **Caso Base** (onde o cálculo atinge um valor primitivo conhecido e interrompe as chamadas) e o **Caso Recursivo** (onde a função chama a si mesma com parâmetros reduzidos).
2. **A Pilha de Chamadas (*Call Stack*):** Como o sistema operacional e a máquina virtual do Python alocam frames de ativação em uma pilha LIFO (*Last In, First Out*) a cada chamada recursiva.
3. **Algoritmos Canônicos de Nilo Menezes:** O cálculo do Fatorial ($n!$), a Sequência de Fibonacci ($F_n$), e o Algoritmo do MDC de Euclides.
4. **O Perigo do `RecursionError`:** O estouro de pilha (*stack overflow*) e o limite de recursão padrão do Python (`sys.getrecursionlimit()`).
