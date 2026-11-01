# Resumo da Unidade: Recursão e Pilha de Chamadas

### Pontos Essenciais

1. **Definição de Recursão:** Uma função é dita recursiva quando invoca a si mesma no processo de solução do problema.
2. **Caso Base vs Caso Recursivo:** O caso base interrompe as chamadas ao atingir a condição de parada mais simples. O caso recursivo reduz o problema em direção ao caso base.
3. **Mecânica LIFO da Pilha:** A cada chamada, um novo frame é alocado no topo da pilha (*wind*). Ao atingir o caso base, os frames calculam seus valores acumulados e são destruídos sequencialmente (*unwind*).
4. **Proteção de Memória:** O Python limita a profundidade de recursão para evitar esgotamento de memória, lançando `RecursionError` caso o caso base não seja alcançado.
