### Síntese: O Algoritmo Bubble Sort

1. **Trocas Adjacentes:** Compara pares vizinhos $L[i]$ e $L[i+1]$ e troca suas posições se estiverem fora da ordem desejada.
2. **Redução de Janela:** A cada rodada, o maior elemento flutua para a posição final, permitindo reduzir o limite `fim` em 1 a cada passagem.
3. **Flag de Parada Precoce:** A variável `trocou = False` encerra o algoritmo no melhor caso ($O(N)$) se a lista já estiver ordenada.
4. **Estabilidade e Pior Caso:** Mantém elementos repetidos na mesma ordem relativa (estável). No pior caso (lista invertida), atinge complexidade quadrática $O(N^2)$.
