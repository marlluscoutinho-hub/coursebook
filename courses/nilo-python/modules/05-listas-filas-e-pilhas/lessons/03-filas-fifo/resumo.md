### Síntese: A Estrutura de Fila (FIFO)

1. **Princípio FIFO:** *First In, First Out*. O primeiro que chega é rigorosamente o primeiro a sair.
2. **Operações em Listas:** Inserção no fim com `fila.append(item)` e remoção do início com `fila.pop(0)`.
3. **Custo Computacional:** Em listas padrão de Python, `pop(0)` tem complexidade $O(N)$ porque exige o deslocamento de todos os elementos para a esquerda na memória.
4. **Verificação Defensiva:** Nunca execute `pop(0)` sem confirmar se `len(fila) > 0` para prevenir `IndexError`.
