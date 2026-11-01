# Guia de Operação e Análise Experimental do Laboratório

Para extrair o máximo de aprendizado da bancada interativa, execute as seguintes séries experimentais:

---

### Experimento 1: A Eficiência do Break no Bubble Sort (Melhor Caso vs Pior Caso)

1. No painel de Bubble Sort, clique no botão **"Carregar Já Ordenada [1, 2, 3, 4, 5]"**.
2. Clique em **"Executar Próximo Passo"** e observe o índice $x$ percorrendo os 4 pares adjacentes:
   - $(1, 2) \to$ ordem correta.
   - $(2, 3) \to$ ordem correta.
   - $(3, 4) \to$ ordem correta.
   - $(4, 5) \to$ ordem correta.
3. Observe o valor da variável booleana `trocou`: permaneceu `False` durante toda a passagem.
4. Na linha seguinte, a condição `if not trocou: break` dispara imediatamente. O algoritmo encerra com apenas $N-1 = 4$ comparações e $0$ trocas — demonstrando experimentalmente a complexidade $O(N)$ no melhor caso.

---

### Experimento 2: O Pior Caso (Lista Invertida) e Flutuação da Bolha

1. Digite a lista `5, 4, 3, 2, 1` e clique em **"Reiniciar com Nova Lista"**.
2. Avance os passos observando a primeira passagem:
   - O elemento `5` é comparado e trocado com `4`, depois com `3`, depois com `2`, depois com `1`.
   - Ao final da primeira passagem, o maior elemento `5` alcançou a última posição.
   - O limite `fim` é decrementado para $4$, poupando comparações inúteis nas passagens subsequentes.
3. Observe que o número total de comparações é:
   $$\frac{N(N-1)}{2} = \frac{5 \times 4}{2} = 10 \text{ comparações}$$
   e $10$ trocas, comprovando a complexidade quadrática $O(N^2)$.

---

### Experimento 3: Dinâmica Hash e Integridade de Chaves

1. No painel **Dicionários Hash**, consulte o produto `"Tomate"`. O sistema retorna instantaneamente `R$ 2.30` com $1000$ unidades.
2. Tente consultar `"Manga"`. O painel reporta que a chave não existe sem quebrar o sistema (prevenção de `KeyError`).
3. Adicione um novo produto (ex: `"Laranja"`, `1.80`, `250`).
4. Execute uma venda de $50$ unidades de `"Laranja"` e verifique a baixa atômica de estoque de $250$ para $200$.
