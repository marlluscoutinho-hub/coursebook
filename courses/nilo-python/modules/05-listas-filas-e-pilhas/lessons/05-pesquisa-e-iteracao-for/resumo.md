### Síntese: Iteração com for e Busca Sequencial

1. **Iterador Direto:** A estrutura `for elemento in lista:` itera sobre cada valor sem necessidade de contadores auxiliares manuais.
2. **Gerador `range(start, stop, step)`:** Gera sequências de números inteiros sob demanda, com limite final rigorosamente exclusivo.
3. **Pares com `enumerate()`:** Produz simultaneamente a tupla `(índice, elemento)` a cada iteração, tornando desnecessário criar contadores externos.
4. **Busca Sequencial ($O(N)$):** Varre os elementos sequencialmente até encontrar a chave ou esgotar a lista. O `break` antecipa o término quando o alvo é achado.
5. **Cálculo de Extremos:** Inicializar o maior e o menor com o primeiro elemento da lista (`L[0]`) garante correção mesmo para conjuntos com números negativos.
