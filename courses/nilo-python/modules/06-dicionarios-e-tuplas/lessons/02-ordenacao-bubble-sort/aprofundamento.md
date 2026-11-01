# O Algoritmo de Ordenação por Bolha (Bubble Sort)

O algoritmo **Bubble Sort** recebe esse nome pela metáfora física: os elementos maiores "flutuam" gradualmente como bolhas de ar na água até o topo final da lista, enquanto os elementos menores "afundam" em direção ao início.

---

### 1. Mecânica de Troca e Comparação de Vizinhos

O princípio operacional consiste em percorrer a lista comparando pares adjacentes de elementos:
* Se o elemento atual for estritamente maior que o seguinte ($L[i] > L[i+1]$), eles estão invertidos e **devem trocar de posição**.
* Em Python idiomático, a troca de dois elementos de uma lista pode ser expressa sem variável auxiliar explícita via **atribuição simultânea**:

```python
L[i], L[i + 1] = L[i + 1], L[i]
```

---

### 2. A Listagem Canônica 6.44 e a Flag de Otimização

Se executássemos o laço cegamente por $N$ vezes, perderíamos tempo mesmo se a lista já estivesse ordenada. Para otimizar, Nilo Menezes introduz a variável booleana `trocou`:

```python
L = [7, 4, 3, 12, 8]
fim = len(L)

while fim > 1:
    trocou = False
    x = 0
    while x < (fim - 1):
        if L[x] > L[x + 1]:
            trocou = True
            temp = L[x]
            L[x] = L[x + 1]
            L[x + 1] = temp
        x += 1
    if not trocou:
        break   # Se nenhuma troca ocorreu em toda a passagem, a lista já está ordenada!
    fim -= 1

print(f"Lista ordenada: {L}")
```

#### O Papel de `fim -= 1`:
Ao término de cada passagem completa do laço interno, o maior elemento remanescente atinge garantidamente sua posição definitiva no final da lista. Portanto, o limite de busca `fim` pode ser decrementado em 1, evitando comparações redundantes com as posições finais já consolidadas.

---

### 3. Análise dos Três Casos Notáveis do Livro

1. **Exercício 6.14 (Melhor Caso - Lista Já Ordenada `[1, 2, 3, 4, 5]`):**
   * O laço interno compara todos os 4 pares vizinhos ($1 < 2, 2 < 3, 3 < 4, 4 < 5$).
   * Como nenhuma condição `>` é satisfeita, `trocou` permanece `False`.
   * A cláusula `if not trocou: break` é acionada na primeira rodada!
   * Complexidade no melhor caso: $O(N)$ (apenas 4 comparações e 0 trocas).
2. **Exercício 6.15 (Elementos Repetidos `[3, 3, 1, 5, 4]`):**
   * A condição `L[x] > L[x+1]` é estrita. Quando dois elementos vizinhos são iguais ($3 > 3$ resulta em `False`), eles **não são trocados**, garantindo a propriedade formal de **algoritmo estável (stable sort)**.
3. **Exercício 6.16 (Ordenação Decrescente):**
   * Para inverter a ordenação do maior para o menor, basta alterar o operador de comparação:
     $$\text{Crescente: } L[x] > L[x+1] \quad \Longrightarrow \quad \text{Decrescente: } L[x] < L[x+1]$$

---

### 4. Análise de Complexidade Computacional

$$\begin{array}{|c|c|c|c|}
\hline
\textbf{Cenário} & \textbf{Comparações} & \textbf{Trocas} & \textbf{Complexidade Big-O} \\
\hline
\text{Melhor Caso (Já ordenada)} & N - 1 & 0 & O(N) \\
\text{Caso Médio} & \approx \frac{N^2}{2} & \approx \frac{N^2}{4} & O(N^2) \\
\text{Pior Caso (Ordem invertida)} & \frac{N(N-1)}{2} & \frac{N(N-1)}{2} & O(N^2) \\
\hline
\end{array}$$
