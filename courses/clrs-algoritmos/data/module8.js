/* ==========================================================================
   MÓDULO 08 — Árvores de Busca Binária, Árvores Vermelho-Preto e Aumento de Estruturas
   Capítulos 12, 13 e 14 (pp. 244–299) — Thomas H. Cormen, Charles E. Leiserson,
   Ronald L. Rivest e Clifford Stein (Algoritmos: Teoria e Prática, 3ª Edição)
   ========================================================================== */

(function () {
  const module8Content = {
    /* ======================================================================
       SEÇÃO 1: REVISÃO DE PRÉ-REQUISITOS E ARQUITETURA DOS CAPÍTULOS 12–14
       ====================================================================== */
    revisao: {
      subtitle:
        "Das Tabelas de Dispersão às Árvores de Busca Balanceadas e Estruturas Aumentadas: Ordem Total em O(lg n), Rotações Locais em O(1) e o Teorema do Aumento",
      intro:
        "No Módulo 07 (Capítulos 10 e 11), vimos que as Tabelas de Dispersão (Hash Tables) implementam as operações de dicionário INSERT, SEARCH e DELETE em tempo esperado O(1), mas sacrificam completamente a relação de ordem linear entre as chaves. Nos Capítulos 12, 13 e 14 (pp. 244–299), Cormen, Leiserson, Rivest e Stein desenvolvem a família mais versátil de estruturas de conjuntos dinâmicos da Ciência da Computação: as Árvores de Busca Binária (ABBs), as Árvores Vermelho-Preto (que garantem altura h ≤ 2 lg(n + 1) no pior caso) e a metodologia sistemática para Aumentar Estruturas de Dados, culminando nas Árvores de Estatísticas de Ordem e nas Árvores de Intervalos.",
      pillars: [
        {
          tag: "[ PILAR 01 • TABELAS HASH O(1) VS. ÁRVORES DE BUSCA O(h) ]",
          title: "Por que Precisamos de Árvores de Busca se Tabelas Hash Fazem Buscas em O(1) Médio?",
          body: `
            <p>Uma tabela de dispersão espalha as chaves de forma pseudoaleatória pelos compartimentos $T[0 \\dots m-1]$. Por isso, ela é incapaz de responder eficientemente a consultas baseadas em <strong>ordem total</strong>. Já uma <strong>Árvore de Busca Binária (ABB)</strong> preserva uma invariante global de ordenação em cada nó, suportando o conjunto completo de operações de conjuntos dinâmicos tanto como <strong>dicionário</strong> quanto como <strong>fila de prioridades</strong>:</p>
            <div class="canonical-table-wrap">
              <table class="canonical-table">
                <thead>
                  <tr>
                    <th>Operação / Propriedade</th>
                    <th>Tabela Hash (Cap. 11)</th>
                    <th>ABB Comum (Cap. 12)</th>
                    <th>Árvore Vermelho-Preto (Cap. 13)</th>
                    <th>Árvore Aumentada (Cap. 14)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong><code>SEARCH(S, k)</code></strong></td>
                    <td>$O(1)$ esperado / $\\Theta(n)$ pior caso</td>
                    <td>$O(h)$ ($\\Theta(\\lg n)$ médio / $\\Theta(n)$ pior)</td>
                    <td>$O(\\lg n)$ <strong>garantido no pior caso</strong></td>
                    <td>$O(\\lg n)$ (mais consultas customizadas)</td>
                  </tr>
                  <tr>
                    <td><strong><code>INSERT</code> / <code>DELETE</code></strong></td>
                    <td>$O(1)$ esperado</td>
                    <td>$O(h)$ ($\\Theta(n)$ pior caso)</td>
                    <td>$O(\\lg n)$ com $\\le 2$ (ins.) ou $\\le 3$ (rem.) rotações</td>
                    <td>$O(\\lg n)$ mantendo atributos extras</td>
                  </tr>
                  <tr>
                    <td><strong><code>MINIMUM</code> / <code>MAXIMUM</code></strong></td>
                    <td>$\\Theta(n + m)$ (varredura total)</td>
                    <td>$O(h)$</td>
                    <td>$O(\\lg n)$</td>
                    <td>$O(\\lg n)$ (ou $O(1)$ se mantido ponteiro)</td>
                  </tr>
                  <tr>
                    <td><strong><code>SUCCESSOR</code> / <code>PREDECESSOR</code></strong></td>
                    <td>$\\Theta(n + m)$</td>
                    <td>$O(h)$</td>
                    <td>$O(\\lg n)$</td>
                    <td>$O(\\lg n)$ (ou $O(1)$ pelo Ex. 14.2-1)</td>
                  </tr>
                  <tr>
                    <td><strong>Impressão Ordenada</strong></td>
                    <td>$\\Theta(n \\lg n)$ (requer ordenar à parte)</td>
                    <td>$\\Theta(n)$ via <code>INORDER-TREE-WALK</code></td>
                    <td>$\\Theta(n)$ via <code>INORDER-TREE-WALK</code></td>
                    <td>$\\Theta(n)$ + <code>OS-SELECT</code> / <code>OS-RANK</code> em $O(\\lg n)$</td>
                  </tr>
                </tbody>
              </table>
            </div>
          `
        },
        {
          tag: "[ PILAR 02 • DEGENERAÇÃO Θ(n) VS. BALANCEAMENTO VERMELHO-PRETO ]",
          title: "Altura Esperada O(lg n) vs. Garantia Determinística h ≤ 2 lg(n + 1)",
          body: `
            <p>Todas as operações básicas em uma árvore de busca binária custam tempo $O(h)$, onde $h$ é a altura da árvore:</p>
            <ul>
              <li><strong>O Risco da Degeneração:</strong> Se $n$ chaves forem inseridas em ordem estritamente crescente ou decrescente em uma ABB comum, a árvore degenera em uma <strong>cadeia linear de altura $h = n - 1 = \\Theta(n)$</strong>, degradando todas as operações para $\\Theta(n)$.</li>
              <li><strong>ABBs Construídas Aleatoriamente (Seção 12.4):</strong> Se as $n$ chaves forem inseridas segundo uma permutação escolhida uniformemente ao acaso dentre as $n!$ possíveis, o <strong>Teorema 12.4</strong> demonstra (usando alturas exponenciais $Y_n = 2^{X_n}$ e a Desigualdade de Jensen) que a altura esperada é $E[X_n] = O(\\lg n)$.</li>
              <li><strong>Árvores Vermelho-Preto (Capítulo 13):</strong> Para garantir desempenho $O(\\lg n)$ <strong>mesmo no pior caso e sob sequências arbitrárias de inserções e remoções</strong>, adicionamos 1 bit de cor (<code>VERMELHO</code> ou <code>PRETO</code>) por nó e impomos 5 propriedades estruturais que impedem que qualquer caminho simples da raiz a uma folha seja mais do que o dobro de qualquer outro, garantindo pelo <strong>Lema 13.1</strong> que $h \\le 2 \\lg(n + 1)$.</li>
            </ul>
          `
        },
        {
          tag: "[ PILAR 03 • ROTAÇÕES LOCAIS EM O(1) ]",
          title: "Mudando a Topologia da Árvore em Tempo Constante Sem Violar a Ordem",
          body: `
            <p>Quando <code>RB-INSERT</code> ou <code>RB-DELETE</code> modificam uma árvore vermelho-preto, as propriedades de cor podem ser temporariamente violadas. A ferramenta cirúrgica para restaurar o equilíbrio é a <strong>rotação</strong> (<code>LEFT-ROTATE</code> e <code>RIGHT-ROTATE</code>):</p>
            <ul>
              <li>Uma rotação é uma operação <strong>estritamente local</strong> que altera apenas um número constante de ponteiros entre um nó $x$, seu filho $y$ e três subárvores $\\alpha, \\beta, \\gamma$ em tempo <strong>$O(1)$</strong>.</li>
              <li>Fundamentalmente, toda rotação <strong>preserva a propriedade de árvore de busca binária</strong>: o percurso em ordem simétrica (<code>INORDER-TREE-WALK</code>) produz exatamente a mesma sequência $\\alpha \\to x \\to \\beta \\to y \\to \\gamma$ antes e depois da rotação!</li>
              <li>Além disso, <code>RB-INSERT-FIXUP</code> realiza <strong>no máximo 2 rotações</strong> para restaurar a árvore após qualquer inserção, e <code>RB-DELETE-FIXUP</code> realiza <strong>no máximo 3 rotações</strong> após qualquer remoção!</li>
            </ul>
          `
        },
        {
          tag: "[ PILAR 04 • METODOLOGIA DE AUMENTO DE ESTRUTURAS (CAP. 14) ]",
          title: "Não Reinvente Estruturas do Zero: A Metodologia de 4 Etapas e o Teorema 14.1",
          body: `
            <p>O Capítulo 14 ensina uma das lições de engenharia de algoritmos mais valiosas do livro: diante de um problema novo, raramente precisamos criar uma estrutura de dados inteiramente nova; quase sempre basta <strong>aumentar</strong> uma estrutura existente seguindo <strong>4 etapas sistemáticas</strong>:</p>
            <ol>
              <li>Escolher uma estrutura de dados subjacente (tipicamente uma Árvore Vermelho-Preto).</li>
              <li>Determinar quais informações adicionais armazenar em cada nó (ex.: $x.\\text{tamanho}$ ou $x.\\text{max}$).</li>
              <li>Verificar que podemos manter as informações adicionais durante as operações básicas de modificação (<code>INSERT</code>, <code>DELETE</code> e rotações) sem degradar a complexidade $O(\\lg n)$.</li>
              <li>Desenvolver novas operações que explorem as informações adicionais (ex.: <code>OS-SELECT</code>, <code>OS-RANK</code>, <code>INTERVAL-SEARCH</code>).</li>
            </ol>
            <p>O <strong>Teorema 14.1</strong> garante que qualquer atributo $x.f$ que possa ser calculado em tempo $O(1)$ apenas a partir de $x$, $x.\\text{esquerda}$ e $x.\\text{direita}$ pode ser mantido automaticamente durante inserções e remoções em uma árvore vermelho-preto em tempo $O(\\lg n)$!</p>
          `
        }
      ],
      checklist: [
        "Compreendo a diferença fundamental entre a propriedade de Árvore de Busca Binária (esquerda ≤ nó ≤ direita para TODOS os descendentes) e a propriedade de Heap (pai ≥ filhos, sem ordenação entre subárvore esquerda e direita).",
        "Sei explicar os dois casos de TREE-SUCCESSOR(x): quando x.direita ≠ NIL (mínimo da subárvore direita) e quando x.direita == NIL (ancestral mais baixo cujo filho esquerdo também é ancestral de x).",
        "Domino a sub-rotina TRANSPLANT(T, u, v) e os 4 casos de TREE-DELETE(T, z) da Figura 12.4.",
        "Sei enunciar as 5 propriedades das Árvores Vermelho-Preto, definir altura preta bh(x) e provar por indução o Lema 13.1 (subárvore enraizada em x tem ≥ 2^bh(x) - 1 nós internos, logo h ≤ 2 lg(n + 1)).",
        "Domino o Teorema 14.1 do aumento de árvores vermelho-preto e sei como atualizar x.tamanho e x.max em O(1) durante LEFT-ROTATE e RIGHT-ROTATE."
      ]
    },

    /* ======================================================================
       SEÇÃO 2: UNIDADES DE APRENDIZADO (CAPÍTULOS 12, 13 E 14, pp. 244–299)
       ====================================================================== */
    unidades: [
      /* ====================================================================
         UNIDADE 8.1 — CAPÍTULO 12, SEÇÕES 12.1 E 12.2 (pp. 244–251)
         ==================================================================== */
      {
        id: "u8-1",
        code: "UNIDADE 01 • CAPÍTULO 12.1 E 12.2 (PP. 244–251)",
        title: "12.1 e 12.2 O que é uma Árvore de Busca Binária e Consultas em uma ABB",
        summary:
          "Representação encadeada de nós com ponteiros p, esquerda e direita; a Propriedade de Árvore de Busca Binária; percurso em ordem simétrica INORDER-TREE-WALK(x) e prova formal do Teorema 12.1 (Θ(n)); buscas recursiva (TREE-SEARCH) e iterativa (ITERATIVE-TREE-SEARCH); TREE-MINIMUM, TREE-MAXIMUM, TREE-SUCCESSOR (os 2 casos estruturais) e Teorema 12.2 (O(h)).",
        body: `
          <h3>1. Representação e a Propriedade de Árvore de Busca Binária (Seção 12.1, pp. 244–246)</h3>
          <p>Uma <strong>árvore de busca binária</strong> é organizada como uma árvore binária representada por uma estrutura encadeada (como vimos na Seção 10.4, Módulo 7). Cada nó é um objeto que, além do atributo $x.\\text{chave}$ e de dados satélites, contém três atributos de ponteiros:</p>
          <ul>
            <li><strong>$x.\\text{esquerda}$</strong>: aponta para o filho à esquerda de $x$ (ou <code>NIL</code> se não houver filho esquerdo);</li>
            <li><strong>$x.\\text{direita}$</strong>: aponta para o filho à direita de $x$ (ou <code>NIL</code> se não houver filho direito);</li>
            <li><strong>$x.p$</strong>: aponta para o nó pai de $x$ (ou <code>NIL</code> se $x$ for a raiz $T.\\text{raiz}$, que é o único nó da árvore cujo pai é <code>NIL</code>).</li>
          </ul>

          <div class="concept-highlight-box">
            <h4>Propriedade de Árvore de Busca Binária (p. 244)</h4>
            <p>Seja $x$ um nó em uma árvore de busca binária:</p>
            <ul>
              <li>Se $y$ é um nó na <strong>subárvore esquerda</strong> de $x$, então $\\mathbf{y.\\text{chave} \\le x.\\text{chave}}$.</li>
              <li>Se $y$ é um nó na <strong>subárvore direita</strong> de $x$, então $\\mathbf{y.\\text{chave} \\ge x.\\text{chave}}$.</li>
            </ul>
            <p><em>Observação Crítica:</em> Esta propriedade vale globalmente para <strong>todos os nós descendentes</strong> na subárvore esquerda e na subárvore direita de $x$, e não apenas para seus filhos imediatos! Além disso, diferentes árvores de busca binária podem representar o mesmo conjunto de chaves (Figura 12.1): uma ABB balanceada com 6 chaves $\\{2, 5, 5, 6, 7, 8\\}$ tem altura $2$, enquanto uma ABB menos eficiente sobre as mesmas chaves tem altura $4$.</p>
          </div>

          <h3>2. Percurso em Ordem Simétrica (<code>INORDER-TREE-WALK</code>) e o Teorema 12.1 (pp. 244–245)</h3>
          <p>A propriedade de árvore de busca binária permite imprimir todas as chaves de $T$ em <strong>sequência monotônica não decrescente</strong> por meio de um algoritmo recursivo simples denominado <strong>percurso de árvore em in-ordem (ou ordem simétrica)</strong>, chamado inicialmente como <code>INORDER-TREE-WALK(T.raiz)</code>:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">INORDER-TREE-WALK(x)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> x ≠ NIL</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    INORDER-TREE-WALK(x.esquerda)</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    <span class="kw">print</span> x.chave</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    INORDER-TREE-WALK(x.direita)</span></div>
            </div>
          </div>

          <p>Ele recebe esse nome porque imprime a chave da raiz $x$ <em>entre</em> a impressão dos valores de sua subárvore esquerda ($\le x.\\text{chave}$) e a impressão dos valores de sua subárvore direita ($\ge x.\\text{chave}$). De modo análogo, um percurso em <strong>pré-ordem</strong> (<code>PREORDER-TREE-WALK</code>) imprime $x.\\text{chave}$ <em>antes</em> das duas chamadas recursivas, e um percurso em <strong>pós-ordem</strong> (<code>POSTORDER-TREE-WALK</code>) imprime $x.\\text{chave}$ <em>depois</em> das duas chamadas recursivas.</p>

          <div class="theorem-box">
            <h4>Teorema 12.1 — Complexidade Linear do Percurso em In-Ordem (p. 245)</h4>
            <p><strong>Enunciado:</strong> Se $x$ é a raiz de uma subárvore de $n$ nós, então a chamada <code>INORDER-TREE-WALK(x)</code> demora o tempo $\\Theta(n)$.</p>
            <p><strong>Demonstração Formal (Método da Substituição):</strong> Seja $T(n)$ o tempo tomado por <code>INORDER-TREE-WALK</code> quando chamado na raiz de uma subárvore de $n$ nós. Como o procedimento visita todos os $n$ nós da subárvore, temos trivialmente $T(n) = \\Omega(n)$. Resta provar que $T(n) = O(n)$.</p>
            <ul>
              <li>Em uma subárvore vazia ($x == \\text{NIL}$), o procedimento gasta um tempo constante $c > 0$ apenas para testar $x \\neq \\text{NIL}$, logo <strong>$T(0) = c$</strong>.</li>
              <li>Para $n > 0$, suponha que <code>INORDER-TREE-WALK</code> seja chamado em um nó $x$ cuja subárvore esquerda tem $k$ nós e cuja subárvore direita tem $n - k - 1$ nós ($0 \\le k \\le n - 1$). Sendo $d > 0$ um limite superior para o custo do corpo do procedimento excluindo as chamadas recursivas, temos:
                $$T(n) \\le T(k) + T(n - k - 1) + d.$$</li>
              <li>Provamos por substituição (indução em $n$) que <strong>$T(n) \\le (c + d)n + c$</strong>:
                <ul>
                  <li><strong>Caso base ($n = 0$):</strong> $(c + d) \\cdot 0 + c = c = T(0)$.</li>
                  <li><strong>Passo indutivo ($n > 0$):</strong> Supondo a hipótese válida para todo $m < n$:
                    $$\\begin{aligned}
                    T(n) &\\le T(k) + T(n - k - 1) + d \\\\
                         &\\le \\bigl((c + d)k + c\\bigr) + \\bigl((c + d)(n - k - 1) + c\\bigr) + d \\\\
                         &= (c + d)(k + n - k - 1) + 2c + d \\\\
                         &= (c + d)n - c - d + 2c + d = (c + d)n + c,
                    \\end{aligned}$$
                    o que conclui a prova de que $T(n) = \\Theta(n)$. $\\blacksquare$</li>
                </ul>
              </li>
            </ul>
          </div>

          <h3>3. Consultas em uma Árvore de Busca Binária (Seção 12.2, pp. 246–251)</h3>
          <p>Examinemos agora como suportar as cinco operações de consulta de conjuntos dinâmicos — <code>SEARCH</code>, <code>MINIMUM</code>, <code>MAXIMUM</code>, <code>SUCCESSOR</code> e <code>PREDECESSOR</code> — todas em tempo $O(h)$ em uma ABB de altura $h$.</p>

          <h4>3.1 Buscas: <code>TREE-SEARCH</code> e <code>ITERATIVE-TREE-SEARCH</code> (pp. 246–247)</h4>
          <p>Para procurar um nó com chave $k$ a partir da raiz $x$, comparamos $k$ com $x.\\text{chave}$. Se forem iguais, terminamos; se $k < x.\\text{chave}$, a propriedade de ABB garante que $k$ só pode estar na subárvore esquerda; se $k > x.\\text{chave}$, $k$ só pode estar na subárvore direita. Na maioria dos computadores, a versão iterativa (que "desdobra" a recursão de cauda em um laço <code>while</code>) é mais eficiente em fatores constantes e usa espaço auxiliar $O(1)$:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">TREE-SEARCH(x, k)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> x == NIL <span class="kw">ou</span> k == x.chave</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">return</span> x</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">if</span> k &lt; x.chave</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">return</span> TREE-SEARCH(x.esquerda, k)</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">else</span> <span class="kw">return</span> TREE-SEARCH(x.direita, k)</span></div>
            </div>
          </div>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">ITERATIVE-TREE-SEARCH(x, k)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">while</span> x ≠ NIL <span class="kw">e</span> k ≠ x.chave</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">if</span> k &lt; x.chave</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">        x = x.esquerda</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">else</span> x = x.direita</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">return</span> x</span></div>
            </div>
          </div>

          <h4>3.2 Mínimo e Máximo: <code>TREE-MINIMUM</code> e <code>TREE-MAXIMUM</code> (pp. 247–248)</h4>
          <p>Para encontrar o elemento mínimo na subárvore enraizada em $x$, basta seguir os ponteiros <code>esquerda</code> até que $x.\\text{esquerda} == \\text{NIL}$ (pois se $x$ não tem subárvore esquerda, toda chave na subárvore direita de $x$ é $\\ge x.\\text{chave}$, e se tem subárvore esquerda, nenhum nó da subárvore direita ou o próprio $x$ pode ser estritamente menor que o mínimo de $x.\\text{esquerda}$). O procedimento <code>TREE-MAXIMUM</code> é estritamente simétrico:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">TREE-MINIMUM(x)</span> &nbsp;/&nbsp; <span class="proc-name">TREE-MAXIMUM(x)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="cmt">// TREE-MINIMUM(x):</span></span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">while</span> x.esquerda ≠ NIL</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    x = x.esquerda</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">return</span> x</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="cmt">// TREE-MAXIMUM(x): substitua x.esquerda por x.direita nas linhas 2 e 3</span></span></div>
            </div>
          </div>

          <h4>3.3 Sucessor e Predecessor: <code>TREE-SUCCESSOR(x)</code> (pp. 248–249)</h4>
          <p>Se todas as chaves são distintas, o <strong>sucessor</strong> de um nó $x$ é o nó com a menor chave estritamente maior que $x.\\text{chave}$ (ou, de forma geral mesmo com chaves repetidas, o próximo nó visitado em um percurso em in-ordem da árvore). A estrutura de uma árvore de busca binária nos permite determinar o sucessor de um nó $x$ <strong>sem nunca comparar chaves</strong>, dividindo a análise em <strong>dois casos estruturais</strong>:</p>
          <ol>
            <li><strong>Caso 1 ($x.\\text{direita} \\neq \\text{NIL}$ — a subárvore direita de $x$ é não vazia):</strong> Então o sucessor de $x$ é simplesmente o nó mais à esquerda na subárvore direita de $x$, encontrado por <code>TREE-MINIMUM(x.direita)</code> (ex.: na Figura 12.2, o sucessor de $15$ é o mínimo de sua subárvore direita, que é $17$).</li>
            <li><strong>Caso 2 ($x.\\text{direita} == \\text{NIL}$ — a subárvore direita de $x$ é vazia):</strong> Como toda a subárvore enraizada em $x$ já foi visitada quando terminamos de processar $x$, o sucessor de $x$ (se existir) deve ser o <strong>ancestral mais baixo de $x$ cujo filho à esquerda também é um ancestral de $x$</strong> (observando que todo nó é ancestral de si mesmo). Para encontrá-lo, subimos na árvore de $x$ em direção à raiz (usando $y = x.p$) enquanto $x$ for o <strong>filho à direita</strong> de seu pai $y$ ($x == y.\\text{direita}$). O primeiro ancestral $y$ para o qual subimos vindo de seu filho à esquerda (ou <code>NIL</code> se chegarmos à raiz vindo sempre da direita, o que significa que $x$ era o máximo da árvore) é o sucessor de $x$! (Ex.: na Figura 12.2, para achar o sucessor de $13$, subimos de $13$ para $7$ e de $7$ para $6$ porque $13$ é filho direito de $7$ e $7$ é filho direito de $6$; como $6$ é filho <em>esquerdo</em> de $15$, paramos e retornamos $y = 15$.)</li>
          </ol>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">TREE-SUCCESSOR(x)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> x.direita ≠ NIL</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">return</span> TREE-MINIMUM(x.direita)</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">y = x.p</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">while</span> y ≠ NIL <span class="kw">e</span> x == y.direita</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    x = y</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">    y = y.p</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">return</span> y</span></div>
            </div>
          </div>

          <p>O procedimento <code>TREE-PREDECESSOR(x)</code> é completamente simétrico: se $x.\\text{esquerda} \\neq \\text{NIL}$, retorna <code>TREE-MAXIMUM(x.esquerda)</code>; caso contrário, sobe enquanto $y \\neq \\text{NIL}$ e $x == y.\\text{esquerda}$.</p>

          <div class="theorem-box">
            <h4>Teorema 12.2 — Consultas em Árvores de Busca Binária em $O(h)$ (p. 249)</h4>
            <p><strong>Enunciado:</strong> Podemos implementar as operações de conjuntos dinâmicos <code>SEARCH</code>, <code>MINIMUM</code>, <code>MAXIMUM</code>, <code>SUCCESSOR</code> e <code>PREDECESSOR</code> de modo que cada uma seja executada no tempo $O(h)$ em uma árvore de busca binária de altura $h$.</p>
            <p><strong>Justificativa:</strong> Cada um dos cinco procedimentos percorre um caminho simples descendente na árvore (no caso de <code>SEARCH</code>, <code>MINIMUM</code>, <code>MAXIMUM</code> e do Caso 1 de <code>SUCCESSOR</code>/<code>PREDECESSOR</code>) ou um caminho simples ascendente (no Caso 2 de <code>SUCCESSOR</code>/<code>PREDECESSOR</code>). Como o comprimento de qualquer caminho simples vertical é limitado pela altura $h$ da árvore, todos executam em $O(h)$. $\\blacksquare$</p>
          </div>

          <!-- PONTO DE MONTAGEM DO WORKBENCH INTERATIVO DUPLO DO MÓDULO 8 -->
          <div id="workbench-mod8-mount"></div>
        `
      },

      /* ====================================================================
         UNIDADE 8.2 — CAPÍTULO 12, SEÇÕES 12.3 E 12.4 (pp. 251–262)
         ==================================================================== */
      {
        id: "u8-2",
        code: "UNIDADE 02 • CAPÍTULO 12.3 E 12.4 (PP. 251–262)",
        title: "12.3 e 12.4 Inserção e Remoção em ABB e ABBs Construídas Aleatoriamente",
        summary:
          "Inserção com ponteiro rastreador (TREE-INSERT); a sub-rotina TRANSPLANT(T, u, v); os 4 casos cirúrgicos de TREE-DELETE(T, z) (Figura 12.4) e Teorema 12.3 (O(h)); Seção 12.4: ABBs construídas aleatoriamente, alturas exponenciais Y_n = 2^{X_n}, Desigualdade de Jensen e prova completa do Teorema 12.4 (E[X_n] = O(lg n)).",
        body: `
          <h3>1. Inserção em uma Árvore de Busca Binária: <code>TREE-INSERT(T, z)</code> (Seção 12.3, pp. 251–252)</h3>
          <p>Para inserir um novo valor $v$ em uma árvore de busca binária $T$, passamos ao procedimento <code>TREE-INSERT(T, z)</code> um novo nó $z$ já inicializado com $z.\\text{chave} = v$, $z.\\text{esquerda} = \\text{NIL}$ e $z.\\text{direita} = \\text{NIL}$. O procedimento desce pela árvore a partir da raiz $x = T.\\text{raiz}$ procurando uma posição vazia (um ponteiro <code>NIL</code>) onde $z$ possa ser anexado como folha sem violar a propriedade de ABB.</p>
          <p><strong>O Papel do Ponteiro Rastreador $y$ (Trailing Pointer):</strong> Quando $x$ finalmente atinge <code>NIL</code> (no término do laço <code>while</code>), precisamos saber quem era o <em>pai</em> daquele ponteiro <code>NIL</code> para ligar $z$ a ele. Por isso, o algoritmo mantém um ponteiro auxiliar $y$ (inicializado com <code>NIL</code>) que caminha sempre um passo atrás de $x$, guardando o pai de $x$:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">TREE-INSERT(T, z)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">y = NIL</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">x = T.raiz</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">while</span> x ≠ NIL</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    y = x</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">if</span> z.chave &lt; x.chave</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">        x = x.esquerda</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    <span class="kw">else</span> x = x.direita</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">z.p = y</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content"><span class="kw">if</span> y == NIL</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">    T.raiz = z <span class="cmt">// A árvore T estava vazia</span></span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content"><span class="kw">elseif</span> z.chave &lt; y.chave</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">    y.esquerda = z</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content"><span class="kw">else</span> y.direita = z</span></div>
            </div>
          </div>

          <p>Como <code>TREE-INSERT</code> percorre apenas um caminho simples descendente da raiz até uma folha, seu tempo de execução é <strong>$O(h)$</strong> em uma árvore de altura $h$.</p>

          <h3>2. Eliminação em uma Árvore de Busca Binária: <code>TRANSPLANT</code> e <code>TREE-DELETE</code> (pp. 252–255)</h3>
          <p>A estratégia geral para eliminar um nó $z$ de uma árvore de busca binária $T$ divide-se em <strong>três situações básicas</strong>, mas uma delas possui um subcaso delicado, totalizando os <strong>4 casos da Figura 12.4</strong>:</p>
          <ul>
            <li><strong>Caso (a) — $z$ não tem filho à esquerda ($z.\\text{esquerda} == \\text{NIL}$):</strong> Substituímos $z$ por seu filho à direita $r = z.\\text{direita}$, que pode ou não ser <code>NIL</code>. (Quando $r = \\text{NIL}$, este caso também trata o caso em que $z$ é uma folha sem nenhum filho!)</li>
            <li><strong>Caso (b) — $z$ tem apenas um filho, que é o seu filho à esquerda ($z.\\text{esquerda} \\neq \\text{NIL}$ e $z.\\text{direita} == \\text{NIL}$):</strong> Substituímos $z$ por seu filho à esquerda $l = z.\\text{esquerda}$.</li>
            <li><strong>Casos (c) e (d) — $z$ tem dois filhos ($z.\\text{esquerda} \\neq \\text{NIL}$ e $z.\\text{direita} \\neq \\text{NIL}$):</strong> Localizamos o <strong>sucessor</strong> de $z$, $y = \\text{TREE-MINIMUM}(z.\\text{direita})$, que está na subárvore direita de $z$ e <strong>não possui filho à esquerda</strong> ($y.\\text{esquerda} == \\text{NIL}$, conforme provaremos no Exercício 12.2-5). Queremos recortar $y$ de sua posição atual e colocá-lo no lugar de $z$:
              <ul>
                <li><strong>Caso (c) — $y$ é o próprio filho à direita imediato de $z$ ($y == z.\\text{direita}$):</strong> Substituímos $z$ por $y$ e fazemos $y$ adotar a subárvore esquerda de $z$ ($y.\\text{esquerda} = z.\\text{esquerda}$), deixando o filho direito original de $y$ ($x = y.\\text{direita}$) intacto.</li>
                <li><strong>Caso (d) — $y$ está na subárvore direita de $z$, mas não é o filho direito imediato de $z$ ($y \\neq z.\\text{direita}$, logo $y.p \\neq z$):</strong> Primeiro substituímos $y$ por seu próprio filho à direita $x = y.\\text{direita}$ (via <code>TRANSPLANT(T, y, y.direita)</code>), depois transformamos o filho direito de $z$ ($r = z.\\text{direita}$) em filho direito de $y$ ($y.\\text{direita} = z.\\text{direita}$ e $y.\\text{direita}.p = y$), e finalmente substituímos $z$ por $y$ e fazemos $y$ adotar a subárvore esquerda de $z$!</li>
              </ul>
            </li>
          </ul>

          <h4>2.1 A Sub-rotina <code>TRANSPLANT(T, u, v)</code> (p. 253)</h4>
          <p>Para movimentar subárvores dentro de $T$ em tempo $O(1)$, definimos a sub-rotina <code>TRANSPLANT(T, u, v)</code>, que substitui a subárvore enraizada em $u$ pela subárvore enraizada em $v$ (permitindo que $v$ seja <code>NIL</code>). Note que <code>TRANSPLANT</code> atualiza o ponteiro do pai de $u$ (ou $T.\\text{raiz}$) e atualiza $v.p$ se $v \\neq \\text{NIL}$, mas <strong>não</strong> altera $v.\\text{esquerda}$ nem $v.\\text{direita}$ (isso fica a cargo do chamador):</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">TRANSPLANT(T, u, v)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> u.p == NIL</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    T.raiz = v</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">elseif</span> u == u.p.esquerda</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    u.p.esquerda = v</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">else</span> u.p.direita = v</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">if</span> v ≠ NIL</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    v.p = u.p</span></div>
            </div>
          </div>

          <h4>2.2 O Procedimento Completo <code>TREE-DELETE(T, z)</code> e o Teorema 12.3 (p. 254)</h4>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">TREE-DELETE(T, z)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> z.esquerda == NIL <span class="cmt">// Caso (a): sem filho à esquerda</span></span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    TRANSPLANT(T, z, z.direita)</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">elseif</span> z.direita == NIL <span class="cmt">// Caso (b): apenas filho à esquerda</span></span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    TRANSPLANT(T, z, z.esquerda)</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">else</span> y = TREE-MINIMUM(z.direita) <span class="cmt">// Casos (c) e (d): dois filhos</span></span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">    <span class="kw">if</span> y.p ≠ z <span class="cmt">// Caso (d): y não é filho direito imediato de z</span></span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">        TRANSPLANT(T, y, y.direita)</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">        y.direita = z.direita</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">        y.direita.p = y</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">    TRANSPLANT(T, z, y) <span class="cmt">// Executado em ambos os Casos (c) e (d)</span></span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">    y.esquerda = z.esquerda</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">    y.esquerda.p = y</span></div>
            </div>
          </div>

          <div class="theorem-box">
            <h4>Teorema 12.3 — Inserção e Remoção em $O(h)$ (p. 254)</h4>
            <p><strong>Enunciado:</strong> Podemos implementar as operações de conjuntos dinâmicos <code>INSERT</code> e <code>DELETE</code> de modo que cada uma seja executada no tempo $O(h)$ em uma árvore de busca binária de altura $h$.</p>
            <p><strong>Prova:</strong> <code>TREE-INSERT</code> gasta $O(h)$ descendo um caminho da raiz até uma folha. Em <code>TREE-DELETE</code>, todas as linhas (incluindo as até 2 chamadas a <code>TRANSPLANT</code>) levam tempo $O(1)$, exceto a chamada a <code>TREE-MINIMUM(z.direita)</code> na linha 5, que leva $O(h)$. Logo, ambas executam em $O(h)$. $\\blacksquare$</p>
          </div>

          <h3>3. Árvores de Busca Binária Construídas Aleatoriamente (Seção 12.4, pp. 255–260)</h3>
          <p>Uma <strong>árvore de busca binária construída aleatoriamente</strong> em $n$ chaves distintas é aquela obtida inserindo-se as chaves em ordem aleatória em uma árvore inicialmente vazia, onde cada uma das $n!$ permutações das chaves de entrada é igualmente provável. (Note pelo Exercício 12.4-3 que isso <em>não</em> é o mesmo que atribuir igual probabilidade a cada uma das $C_n = \\frac{1}{n+1}\\binom{2n}{n}$ topologias de árvores binárias possíveis: por exemplo, para $n = 3$, as $3! = 6$ permutações geram $5$ árvores distintas, mas a árvore perfeitamente balanceada com raiz $2$ ocorre para <em>duas</em> permutações — $\\langle 2, 1, 3 \\rangle$ e $\\langle 2, 3, 1 \\rangle$, com probabilidade $2/6 = 1/3$ — enquanto cada uma das outras $4$ árvores de altura $2$ ocorre com probabilidade $1/6$!)</p>

          <div class="theorem-box">
            <h4>Teorema 12.4 — Altura Esperada de uma ABB Construída Aleatoriamente (pp. 255–259)</h4>
            <p><strong>Enunciado:</strong> A altura esperada de uma árvore de busca binária construída aleatoriamente em $n$ chaves distintas é $O(\\lg n)$.</p>
            <p><strong>Demonstração Completa em 4 Passos:</strong></p>
            <ol>
              <li><strong>Variáveis Aleatórias e Altura Exponencial:</strong> Seja $X_n$ a variável aleatória que denota a altura de uma ABB construída aleatoriamente em $n$ chaves, e definamos a <strong>altura exponencial</strong> $Y_n = 2^{X_n}$ (com $X_0 = 0, Y_0 = 0$ por convenção para simplificar as fórmulas e $X_1 = 0 \\implies Y_1 = 2^0 = 1$). Seja $R_n \\in \\{1, 2, \\dots, n\\}$ o posto (classificação) da primeira chave inserida (a raiz da árvore). Como todas as $n!$ permutações são equiprováveis, $\\Pr\\{R_n = i\\} = 1/n$ para cada $i = 1, \\dots, n$.</li>
              <li><strong>Recorrência para $Y_n$:</strong> Condicionado a $R_n = i$, a subárvore esquerda é uma ABB construída aleatoriamente em $i - 1$ chaves (com altura $X_{i-1}$) e a subárvore direita é uma ABB construída aleatoriamente em $n - i$ chaves (com altura $X_{n-i}$). Como $X_n = 1 + \\max(X_{i-1}, X_{n-i})$, temos para a altura exponencial:
                $$Y_n = 2^{X_n} = 2 \\cdot \\max(Y_{i-1}, Y_{n-i}).$$
                Definindo as variáveis indicadoras $Z_{n,i} = \\text{I}\\{R_n = i\\}$ (onde $E[Z_{n,i}] = 1/n$ e $Z_{n,i}$ é independente de $Y_{i-1}$ e $Y_{n-i}$), temos:
                $$Y_n = \\sum_{i=1}^{n} Z_{n,i} \\bigl(2 \\cdot \\max(Y_{i-1}, Y_{n-i})\\bigr).$$</li>
              <li><strong>Limitação Superior de $E[Y_n]$ por Indução:</strong> Tomando a esperança em ambos os lados, usando que $\\max(a, b) \\le a + b$ para variáveis não negativas e observando que cada termo $E[Y_k]$ aparece duas vezes na soma ($k = i - 1$ e $k = n - i$):
                $$E[Y_n] \\le \\sum_{i=1}^{n} \\frac{1}{n} \\cdot 2\\bigl(E[Y_{i-1}] + E[Y_{n-i}]\\bigr) = \\frac{4}{n} \\sum_{i=0}^{n-1} E[Y_i].$$
                Por indução em $n$, provamos que $E[Y_n] \\le \\frac{1}{4}\\binom{n+3}{3}$ usando a identidade combinatória $\\sum_{i=0}^{n-1} \\binom{i+3}{3} = \\binom{n+3}{4}$ (Exercício 12.4-1):
                $$E[Y_n] \\le \\frac{4}{n} \\sum_{i=0}^{n-1} \\frac{1}{4}\\binom{i+3}{3} = \\frac{1}{n}\\binom{n+3}{4} = \\frac{1}{n} \\cdot \\frac{(n+3)(n+2)(n+1)n}{24} = \\frac{1}{4}\\binom{n+3}{3}.$$</li>
              <li><strong>Aplicação da Desigualdade de Jensen (Convexidade de $f(x) = 2^x$):</strong> Como a função $f(x) = 2^x$ é <strong>convexa</strong> (Exercício 12.4-4), a Desigualdade de Jensen garante que $2^{E[X_n]} \\le E[2^{X_n}] = E[Y_n]$. Portanto:
                $$2^{E[X_n]} \\le E[Y_n] \\le \\frac{1}{4}\\binom{n+3}{3} = \\frac{(n+3)(n+2)(n+1)}{24} = O(n^3).$$
                Tomando o logaritmo na base 2 em ambos os lados, obtemos <strong>$E[X_n] \\le 3 \\lg(n + 3) + O(1) = O(\\lg n)$</strong>! $\\blacksquare$</li>
            </ol>
          </div>
        `
      },

      /* ====================================================================
         UNIDADE 8.3 — CAPÍTULO 13, SEÇÕES 13.1 E 13.2 (pp. 263–269)
         ==================================================================== */
      {
        id: "u8-3",
        code: "UNIDADE 03 • CAPÍTULO 13.1 E 13.2 (PP. 263–269)",
        title: "13.1 e 13.2 Propriedades das Árvores Vermelho-Preto e Rotações",
        summary:
          "As 5 Propriedades Vermelho-Preto; o uso da sentinela única T.nil (preta); definição de altura preta bh(x); demonstração completa por indução do Lema 13.1 (n ≥ 2^{bh(x)} - 1 e h ≤ 2 lg(n + 1)); rotações locais LEFT-ROTATE(T, x) e RIGHT-ROTATE(T, y) em tempo O(1) preservando a propriedade de ABB.",
        body: `
          <h3>1. As 5 Propriedades das Árvores Vermelho-Preto e a Sentinela <code>T.nil</code> (Seção 13.1, pp. 263–266)</h3>
          <p>Uma <strong>árvore vermelho-preto</strong> (<em>red-black tree</em>) é uma árvore de busca binária que contém um bit extra de armazenamento por nó: sua <strong>cor</strong> ($x.\\text{cor}$), que pode ser <code>VERMELHO</code> ou <code>PRETO</code>. Restringindo as cores dos nós em qualquer caminho simples da raiz até uma folha, as árvores vermelho-preto garantem que nenhum caminho desse tipo seja mais do que duas vezes mais longo que qualquer outro, de modo que a árvore é aproximadamente <strong>balanceada</strong>.</p>
          <p>Cada nó da árvore contém os cinco atributos <code>cor</code>, <code>chave</code>, <code>esquerda</code>, <code>direita</code> e <code>p</code>. Se um filho ou o pai de um nó não existir, o ponteiro correspondente aponta para um objeto <strong>sentinela único <code>T.nil</code></strong> (que substitui todos os ponteiros <code>NIL</code> externos das folhas e o pai da raiz, economizando memória e permitindo tratar filhos <code>T.nil</code> como nós pretos normais nos algoritmos de correção).</p>

          <div class="concept-highlight-box">
            <h4>As 5 Propriedades Vermelho-Preto (p. 263)</h4>
            <p>Uma árvore de busca binária $T$ é uma <strong>árvore vermelho-preto</strong> se satisfaz as seguintes propriedades:</p>
            <ol>
              <li><strong>Propriedade 1:</strong> Todo nó é vermelho ou preto.</li>
              <li><strong>Propriedade 2:</strong> A raiz ($T.\\text{raiz}$) é preta.</li>
              <li><strong>Propriedade 3:</strong> Toda folha (<code>T.nil</code>) é preta.</li>
              <li><strong>Propriedade 4:</strong> Se um nó é vermelho, então ambos os seus filhos são pretos (isto é, não podem existir dois nós vermelhos consecutivos em nenhum caminho simples!).</li>
              <li><strong>Propriedade 5:</strong> Para cada nó, todos os caminhos simples do nó até folhas descendentes contêm o <strong>mesmo número de nós pretos</strong>.</li>
            </ol>
          </div>

          <h4>1.1 Altura Preta $\\text{bh}(x)$ e Demonstração do Lema 13.1 (pp. 264–265)</h4>
          <p>Pela Propriedade 5, a noção a seguir é bem definida: chamamos o número de nós pretos em qualquer caminho simples a partir de um nó $x$ (<strong>mas não incluindo o próprio $x$</strong>) até uma folha <code>T.nil</code> (incluindo a folha <code>T.nil</code> preta!) de <strong>altura preta</strong> do nó $x$, denotada por <strong>$\\text{bh}(x)$</strong>. Definimos a altura preta de uma árvore vermelho-preto como a altura preta de sua raiz.</p>

          <div class="theorem-box">
            <h4>Lema 13.1 — Altura Máxima de uma Árvore Vermelho-Preto (pp. 264–265)</h4>
            <p><strong>Enunciado:</strong> Uma árvore vermelho-preto com $n$ nós internos tem altura no máximo $2 \\lg(n + 1)$.</p>
            <p><strong>Demonstração Completa por Indução:</strong></p>
            <p><strong>Parte 1 (Afirmativa por indução na altura de $x$):</strong> Provamos primeiro que a subárvore enraizada em qualquer nó $x$ contém no mínimo <strong>$2^{\\text{bh}(x)} - 1$ nós internos</strong>.</p>
            <ul>
              <li><strong>Caso Base ($\text{altura}(x) = 0$):</strong> Se a altura de $x$ é $0$, então $x$ deve ser uma folha (<code>T.nil</code>). A subárvore enraizada em $x$ contém $0$ nós internos, e como $\\text{bh}(x) = 0$, temos $2^{\\text{bh}(x)} - 1 = 2^0 - 1 = 0$ nós internos. A base é verdadeira!</li>
              <li><strong>Passo Indutivo ($\text{altura}(x) > 0$):</strong> Considere um nó $x$ que tem altura positiva e, portanto, é um nó interno com dois filhos ($x.\\text{esquerda}$ e $x.\\text{direita}$, que podem ser nós internos ou <code>T.nil</code>). Cada filho de $x$ tem uma altura preta igual a:
                <ul>
                  <li>$\\text{bh}(x)$ se o filho for <strong>vermelho</strong> (pois o próprio filho não entra na sua altura preta, mas tampouco contribuía como nó preto para $\\text{bh}(x)$); ou</li>
                  <li>$\\text{bh}(x) - 1$ se o filho for <strong>preto</strong> (pois o filho contava como $+1$ nó preto no caminho a partir de $x$, mas não conta no caminho a partir de si mesmo).</li>
                </ul>
                Em ambos os casos, cada filho de $x$ tem altura preta de <strong>no mínimo $\\text{bh}(x) - 1$</strong>. Como a altura de cada filho de $x$ é estritamente menor que a altura de $x$, aplicamos a hipótese indutiva para concluir que cada uma das duas subárvores filhas contém no mínimo $2^{\\text{bh}(x) - 1} - 1$ nós internos. Somando as duas subárvores filhas mais o próprio nó interno $x$, a subárvore enraizada em $x$ contém no mínimo:
                $$\\bigl(2^{\\text{bh}(x) - 1} - 1\\bigr) + \\bigl(2^{\\text{bh}(x) - 1} - 1\\bigr) + 1 = 2 \\cdot 2^{\\text{bh}(x) - 1} - 1 = 2^{\\text{bh}(x)} - 1 \\text{ nós internos!}$$</li>
            </ul>
            <p><strong>Parte 2 (Relação entre $h$ e $\\text{bh}(\\text{raiz})$):</strong> Seja $h$ a altura da árvore. Pela Propriedade 4 (nenhum nó vermelho tem filho vermelho), <strong>no mínimo metade</strong> dos nós em qualquer caminho simples da raiz até uma folha (não incluindo a raiz) deve ser preta. Consequentemente, a altura preta da raiz é no mínimo $\\text{bh}(T.\\text{raiz}) \\ge h/2$. Aplicando a Parte 1 à raiz da árvore:</p>
            $$n \\ge 2^{\\text{bh}(T.\\text{raiz})} - 1 \\ge 2^{h/2} - 1 \\implies n + 1 \\ge 2^{h/2} \\implies \\lg(n + 1) \\ge \\frac{h}{2} \\implies \\mathbf{h \\le 2 \\lg(n + 1)}. \\quad \\blacksquare$$
          </div>

          <h3>2. Rotações: <code>LEFT-ROTATE</code> e <code>RIGHT-ROTATE</code> (Seção 13.2, pp. 266–268)</h3>
          <p>Uma <strong>rotação</strong> é uma operação local em uma árvore de busca que preserva a propriedade de árvore de busca binária em tempo $O(1)$, alterando apenas ponteiros:</p>
          <ul>
            <li>Em <strong><code>LEFT-ROTATE(T, x)</code></strong> (supondo que $y = x.\\text{direita} \\neq T.\\text{nil}$), pivotamos ao redor da ligação $(x, y)$: $y$ sobe para se tornar a nova raiz da subárvore, $x$ desce para se tornar o filho à esquerda de $y$, e a subárvore esquerda original de $y$ ($\\beta = y.\\text{esquerda}$) passa a ser a subárvore direita de $x$.</li>
            <li>Em <strong><code>RIGHT-ROTATE(T, y)</code></strong> (a operação inversa, supondo que $x = y.\\text{esquerda} \\neq T.\\text{nil}$), $x$ sobe para se tornar a nova raiz da subárvore, $y$ desce para se tornar o filho à direita de $x$, e a subárvore direita original de $x$ ($\\beta = x.\\text{direita}$) passa a ser a subárvore esquerda de $y$.</li>
          </ul>
          <p><strong>Preservação da Ordem:</strong> Em ambas as configurações (Figura 13.2), todas as chaves em $\\alpha$ são $\\le x.\\text{chave} \\le$ todas as chaves em $\\beta \\le y.\\text{chave} \\le$ todas as chaves em $\\gamma$.</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">LEFT-ROTATE(T, x)</span> &nbsp;(p. 266)</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">y = x.direita <span class="cmt">// define y (supõe x.direita ≠ T.nil)</span></span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">x.direita = y.esquerda <span class="cmt">// transforma a subárvore esquerda de y (β) na subárvore direita de x</span></span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">if</span> y.esquerda ≠ T.nil</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    y.esquerda.p = x</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">y.p = x.p <span class="cmt">// liga o pai de x a y</span></span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">if</span> x.p == T.nil</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    T.raiz = y</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content"><span class="kw">elseif</span> x == x.p.esquerda</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">    x.p.esquerda = y</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content"><span class="kw">else</span> x.p.direita = y</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">y.esquerda = x <span class="cmt">// coloca x à esquerda de y</span></span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">x.p = y</span></div>
            </div>
          </div>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">RIGHT-ROTATE(T, y)</span> &nbsp;(Simétrico — Exercício 13.2-1)</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">x = y.esquerda <span class="cmt">// define x (supõe y.esquerda ≠ T.nil)</span></span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">y.esquerda = x.direita <span class="cmt">// transforma a subárvore direita de x (β) na subárvore esquerda de y</span></span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">if</span> x.direita ≠ T.nil</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    x.direita.p = y</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">x.p = y.p <span class="cmt">// liga o pai de y a x</span></span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">if</span> y.p == T.nil</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    T.raiz = x</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content"><span class="kw">elseif</span> y == y.p.direita</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">    y.p.direita = x</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content"><span class="kw">else</span> y.p.esquerda = x</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">x.direita = y <span class="cmt">// coloca y à direita de x</span></span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">y.p = x</span></div>
            </div>
          </div>
        `
      },

      /* ====================================================================
         UNIDADE 8.4 — CAPÍTULO 13, SEÇÕES 13.3 E 13.4 (pp. 269–284)
         ==================================================================== */
      {
        id: "u8-4",
        code: "UNIDADE 04 • CAPÍTULO 13.3 E 13.4 (PP. 269–284)",
        title: "13.3 e 13.4 Inserção e Remoção em Árvores Vermelho-Preto",
        summary:
          "Por que inserimos o novo nó z colorido de VERMELHO; RB-INSERT(T, z) e RB-INSERT-FIXUP(T, z); o Invariante de Laço de 3 Partes e análise detalhada dos Casos 1, 2 e 3 (no máximo 2 rotações); RB-TRANSPLANT, RB-DELETE e os 4 Casos de RB-DELETE-FIXUP (o conceito de nó 'duplamente preto' e no máximo 3 rotações).",
        body: `
          <h3>1. Inserção em Árvores Vermelho-Preto: <code>RB-INSERT</code> e <code>RB-INSERT-FIXUP</code> (Seção 13.3, pp. 269–276)</h3>
          <p>Para inserir um nó $z$ em uma árvore vermelho-preto $T$ em tempo $O(\\lg n)$, primeiro o inserimos como em uma ABB comum (substituindo <code>NIL</code> pela sentinela <code>T.nil</code>) e <strong>colorimos $z$ de <code>VERMELHO</code></strong> (linha 16 de <code>RB-INSERT</code>).</p>
          <p><strong>Por que colorir $z$ de <code>VERMELHO</code> em vez de <code>PRETO</code>? (Exercício 13.3-1):</strong> Se coloríssemos o novo nó $z$ de <code>PRETO</code>, todo caminho simples da raiz até as duas novas folhas <code>T.nil</code> filhas de $z$ ganharia $+1$ nó preto a mais do que todos os outros caminhos da árvore, violando imediatamente a <strong>Propriedade 5</strong> (igualdade das alturas pretas), que é global e difícil de restaurar. Ao colorir $z$ de <code>VERMELHO</code>, a Propriedade 5 (bem como as Propriedades 1 e 3) é <strong>automaticamente preservada</strong>! As únicas propriedades que podem ser violadas são:</p>
          <ul>
            <li><strong>Propriedade 2 (A raiz é preta):</strong> Violada se $T$ estava vazia e $z$ tornou-se a própria raiz; ou</li>
            <li><strong>Propriedade 4 (Um nó vermelho não pode ter filho vermelho):</strong> Violada se o pai de $z$ ($z.p$) também era <code>VERMELHO</code>. Note que essas duas violações são mutuamente exclusivas!</li>
          </ul>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">RB-INSERT(T, z)</span> &nbsp;(p. 269)</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">y = T.nil</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">x = T.raiz</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">while</span> x ≠ T.nil</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    y = x</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">if</span> z.chave &lt; x.chave</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">        x = x.esquerda</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    <span class="kw">else</span> x = x.direita</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">z.p = y</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content"><span class="kw">if</span> y == T.nil</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">    T.raiz = z</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content"><span class="kw">elseif</span> z.chave &lt; y.chave</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">    y.esquerda = z</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content"><span class="kw">else</span> y.direita = z</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">z.esquerda = T.nil</span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content">z.direita = T.nil</span></div>
              <div class="code-line"><span class="line-num">16</span><span class="line-content">z.cor = VERMELHO</span></div>
              <div class="code-line"><span class="line-num">17</span><span class="line-content">RB-INSERT-FIXUP(T, z)</span></div>
            </div>
          </div>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">RB-INSERT-FIXUP(T, z)</span> &nbsp;(p. 270)</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">while</span> z.p.cor == VERMELHO</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">if</span> z.p == z.p.p.esquerda</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">        y = z.p.p.direita <span class="cmt">// y é o tio de z</span></span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">        <span class="kw">if</span> y.cor == VERMELHO <span class="cmt">// CASO 1: o tio y de z é vermelho</span></span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">            z.p.cor = PRETO <span class="cmt">// (Caso 1)</span></span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">            y.cor = PRETO <span class="cmt">// (Caso 1)</span></span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">            z.p.p.cor = VERMELHO <span class="cmt">// (Caso 1)</span></span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">            z = z.p.p <span class="cmt">// (Caso 1: sobe 2 níveis na árvore)</span></span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">        <span class="kw">else</span> <span class="kw">if</span> z == z.p.direita <span class="cmt">// CASO 2: tio y é preto e z é filho à direita</span></span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">                z = z.p <span class="cmt">// (Caso 2)</span></span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">                LEFT-ROTATE(T, z) <span class="cmt">// (Caso 2: transforma no Caso 3!)</span></span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">            z.p.cor = PRETO <span class="cmt">// CASO 3: tio y é preto e z é filho à esquerda</span></span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">            z.p.p.cor = VERMELHO <span class="cmt">// (Caso 3)</span></span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">            RIGHT-ROTATE(T, z.p.p) <span class="cmt">// (Caso 3: encerra o laço while!)</span></span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content">    <span class="kw">else</span> (mesmo que a cláusula <span class="kw">then</span> com “direita” e “esquerda” trocados)</span></div>
              <div class="code-line"><span class="line-num">16</span><span class="line-content">T.raiz.cor = PRETO</span></div>
            </div>
          </div>

          <h4>1.1 O Invariante de Laço de 3 Partes e os Casos 1, 2 e 3 de <code>RB-INSERT-FIXUP</code> (pp. 270–275)</h4>
          <p>No início de cada iteração do laço <code>while z.p.cor == VERMELHO</code>, vale o seguinte <strong>invariante de 3 partes</strong>:</p>
          <ol>
            <li><strong>(a)</strong> O nó $z$ é vermelho.</li>
            <li><strong>(b)</strong> Se $z.p$ é a raiz, então $z.p$ é preto.</li>
            <li><strong>(c)</strong> Se houver uma violação das propriedades da árvore vermelho-preto, há <strong>no máximo uma violação</strong>, e ela é da Propriedade 2 (se $z$ é a raiz e é vermelho) ou da Propriedade 4 (se $z$ e $z.p$ são ambos vermelhos).</li>
          </ol>
          <p>Enquanto $z.p.\\text{cor} == \\text{VERMELHO}$, pela parte (b) do invariante $z.p$ não pode ser a raiz; logo o avô $z.p.p$ existe e, pela parte (c), o avô $z.p.p$ é obrigatoriamente <strong><code>PRETO</code></strong>! Supondo que $z.p$ seja o filho esquerdo do avô $z.p.p$ (linhas 2–14; o ramo <code>else</code> é estritamente simétrico), seja $y = z.p.p.\\text{direita}$ o <strong>tio</strong> de $z$. Há três casos (Figura 13.4):</p>
          <ul>
            <li><strong>Caso 1 — O tio $y$ de $z$ é <code>VERMELHO</code> (linhas 4–8):</strong> Como o pai $z.p$ e o tio $y$ são ambos vermelhos e o avô $z.p.p$ é preto, "empurramos" a negritude do avô para seus dois filhos: colorimos $z.p$ e $y$ de <code>PRETO</code>, colorimos o avô $z.p.p$ de <code>VERMELHO</code> e subimos o ponteiro $z = z.p.p$ dois níveis na árvore. Nenhuma altura preta muda e a violação entre $z$ e $z.p$ desaparece (podendo agora haver violação apenas no novo $z = z.p.p$).</li>
            <li><strong>Caso 2 — O tio $y$ de $z$ é <code>PRETO</code> e $z$ é um filho à direita (linhas 9–11):</strong> A ligação $z.p.p \\to z.p \\to z$ forma um "zigue-zague" (esquerda-direita). Fazemos $z = z.p$ e aplicamos <code>LEFT-ROTATE(T, z)</code>, o que alinha os dois nós vermelhos como uma cadeia esquerda-esquerda e <strong>transforma imediatamente a situação no Caso 3</strong>!</li>
            <li><strong>Caso 3 — O tio $y$ de $z$ é <code>PRETO</code> e $z$ é um filho à esquerda (linhas 12–14):</strong> Colorimos o pai $z.p$ de <code>PRETO</code>, colorimos o avô $z.p.p$ de <code>VERMELHO</code> e executamos <code>RIGHT-ROTATE(T, z.p.p)</code>. Agora $z.p$ (que é <code>PRETO</code>!) ocupa o lugar do antigo avô e é pai tanto de $z$ quanto do antigo avô (ambos vermelhos). Como $z.p.\\text{cor} == \\text{PRETO}$, o laço <code>while</code> <strong>termina imediatamente</strong> após o Caso 3!</li>
          </ul>
          <p><strong>Conclusão sobre Rotações na Inserção:</strong> O laço <code>while</code> só continua iterando enquanto ocorre o Caso 1 (que apenas recolora e sobe 2 níveis, sem fazer rotações). Assim que entra no Caso 2 ou no Caso 3, ele realiza no máximo <strong>2 rotações</strong> (uma no Caso 2 e uma no Caso 3) e encerra! Logo, <code>RB-INSERT</code> leva tempo $O(\\lg n)$ e nunca executa mais do que <strong>2 rotações</strong>.</p>

          <h3>2. Remoção em Árvores Vermelho-Preto: <code>RB-TRANSPLANT</code>, <code>RB-DELETE</code> e <code>RB-DELETE-FIXUP</code> (Seção 13.4, pp. 276–283)</h3>
          <p>Primeiro adaptamos <code>TRANSPLANT</code> para usar a sentinela <code>T.nil</code> (observe na linha 6 de <code>RB-TRANSPLANT</code> que a atribuição $v.p = u.p$ é feita <strong>incondicionalmente</strong>, mesmo quando $v == T.\\text{nil}$, pois <code>RB-DELETE-FIXUP(T, x)</code> precisará consultar $x.p$ mesmo quando $x == T.\\text{nil}$!):</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">RB-TRANSPLANT(T, u, v)</span> &nbsp;(p. 276)</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> u.p == T.nil</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    T.raiz = v</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">elseif</span> u == u.p.esquerda</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    u.p.esquerda = v</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">else</span> u.p.direita = v</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">v.p = u.p <span class="cmt">// atribuição incondicional (mesmo se v == T.nil!)</span></span></div>
            </div>
          </div>

          <p>Em <code>RB-DELETE(T, z)</code>, mantemos o nó $y$ como o nó que é efetivamente removido da árvore (nos Casos a e b de 1 filho, $y = z$) ou que se move dentro da árvore para substituir $z$ (nos Casos c e d de 2 filhos, $y = \\text{TREE-MINIMUM}(z.\\text{direita})$). Guardamos em <code>cor-original-de-y</code> a cor que $y$ tinha antes das mudanças (pois, quando $y \\neq z$, $y$ assumirá a cor de $z$ na linha 20, de modo que a cor que "desaparece" da posição original de $y$ é <code>cor-original-de-y</code>!), e guardamos em $x$ o filho único que passa a ocupar a posição original de $y$. Se <code>cor-original-de-y == VERMELHO</code>, nenhuma propriedade vermelho-preto é violada quando $y$ é removido ou movido! Porém, se <strong><code>cor-original-de-y == PRETO</code></strong>, chamamos <code>RB-DELETE-FIXUP(T, x)</code>:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">RB-DELETE(T, z)</span> &nbsp;(p. 277)</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">y = z</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">cor-original-de-y = y.cor</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">if</span> z.esquerda == T.nil</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    x = z.direita</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    RB-TRANSPLANT(T, z, z.direita)</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">elseif</span> z.direita == T.nil</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    x = z.esquerda</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">    RB-TRANSPLANT(T, z, z.esquerda)</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content"><span class="kw">else</span> y = TREE-MINIMUM(z.direita)</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">    cor-original-de-y = y.cor</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">    x = y.direita</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">    <span class="kw">if</span> y.p == z</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">        x.p = y <span class="cmt">// garante que x.p aponte para y mesmo se x == T.nil</span></span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">    <span class="kw">else</span> RB-TRANSPLANT(T, y, y.direita)</span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content">        y.direita = z.direita</span></div>
              <div class="code-line"><span class="line-num">16</span><span class="line-content">        y.direita.p = y</span></div>
              <div class="code-line"><span class="line-num">17</span><span class="line-content">    RB-TRANSPLANT(T, z, y)</span></div>
              <div class="code-line"><span class="line-num">18</span><span class="line-content">    y.esquerda = z.esquerda</span></div>
              <div class="code-line"><span class="line-num">19</span><span class="line-content">    y.esquerda.p = y</span></div>
              <div class="code-line"><span class="line-num">20</span><span class="line-content">    y.cor = z.cor</span></div>
              <div class="code-line"><span class="line-num">21</span><span class="line-content"><span class="kw">if</span> cor-original-de-y == PRETO</span></div>
              <div class="code-line"><span class="line-num">22</span><span class="line-content">    RB-DELETE-FIXUP(T, x)</span></div>
            </div>
          </div>

          <h4>2.1 O Conceito de "Duplamente Preto" e os 4 Casos de <code>RB-DELETE-FIXUP(T, x)</code> (pp. 278–282)</h4>
          <p>Quando <code>cor-original-de-y == PRETO</code>, todos os caminhos que passavam pela posição original de $y$ têm agora 1 nó preto a menos (violando a Propriedade 5). Podemos restaurar conceitualmente a Propriedade 5 imaginando que o nó $x$ (que ocupou o lugar de $y$) recebe uma <strong>camada extra de cor preta</strong>, tornando-se <strong>"duplamente preto"</strong> (se $x.\\text{cor} == \\text{PRETO}$, contribuindo com $2$ para a contagem de nós pretos) ou <strong>"vermelho-e-preto"</strong> (se $x.\\text{cor} == \\text{VERMELHO}$, contribuindo com $1$). O objetivo de <code>RB-DELETE-FIXUP(T, x)</code> é mover esse "preto extra" para cima até que (1) $x$ aponte para um nó vermelho-e-preto (que pode simplesmente ser pintado de <code>PRETO</code> na linha 23), (2) $x$ atinja a raiz (quando o preto extra pode simplesmente ser descartado), ou (3) rotações e recolorações absorvam o preto extra localmente.</p>
          <p>Supondo que $x$ seja filho esquerdo de $x.p$, seja $w = x.p.\\text{direita}$ o <strong>irmão</strong> de $x$ (que nunca pode ser <code>T.nil</code>, pois a altura preta do caminho por $w$ é maior que a altura preta real de $x$). Os <strong>4 Casos</strong> (Figura 13.7) são:</p>
          <ul>
            <li><strong>Caso 1 — O irmão $w$ de $x$ é <code>VERMELHO</code> (linhas 5–8):</strong> Como $w$ é vermelho, seus dois filhos são pretos. Trocamos as cores de $w$ (para <code>PRETO</code>) e $x.p$ (para <code>VERMELHO</code>) e fazemos <code>LEFT-ROTATE(T, x.p)</code>. O novo irmão de $x$ (que era $w.\\text{esquerda}$) é agora garantidamente <code>PRETO</code>, o que <strong>converte o Caso 1 em um dos Casos 2, 3 ou 4</strong>!</li>
            <li><strong>Caso 2 — O irmão $w$ de $x$ é <code>PRETO</code> e ambos os filhos de $w$ são <code>PRETOS</code> (linhas 9–11):</strong> Retiramos uma camada de cor preta tanto de $x$ quanto de $w$ (deixando $x$ com apenas 1 preto e pintando $w$ de <code>VERMELHO</code>) e transferimos o preto extra para o pai $x.p$, fazendo $x = x.p$ subir 1 nível na árvore! (Se viemos do Caso 1, o novo $x = x.p$ era vermelho, logo o laço termina e a linha 23 o pinta de <code>PRETO</code>.)</li>
            <li><strong>Caso 3 — O irmão $w$ de $x$ é <code>PRETO</code>, o filho esquerdo de $w$ (sobrinho próximo) é <code>VERMELHO</code> e o filho direito de $w$ (sobrinho distante) é <code>PRETO</code> (linhas 12–16):</strong> Trocamos as cores de $w$ e $w.\\text{esquerda}$, executamos <code>RIGHT-ROTATE(T, w)</code> e atualizamos $w = x.p.\\text{direita}$, o que <strong>transforma imediatamente o Caso 3 no Caso 4</strong>!</li>
            <li><strong>Caso 4 — O irmão $w$ de $x$ é <code>PRETO</code> e o filho direito de $w$ (sobrinho distante) é <code>VERMELHO</code> (linhas 17–21):</strong> Pintamos $w$ com a cor de $x.p$, pintamos $x.p$ e $w.\\text{direita}$ de <code>PRETO</code>, executamos <code>LEFT-ROTATE(T, x.p)</code> (eliminando o preto extra de $x$ sem alterar nenhuma altura preta!) e atribuímos $x = T.\\text{raiz}$ para encerrar o laço!</li>
          </ul>
          <p><strong>Conclusão sobre Rotações na Remoção:</strong> Apenas o Caso 2 pode se repetir subindo na árvore (sem fazer rotações). Ao entrar nos Casos 1, 3 ou 4, o algoritmo realiza <strong>no máximo 3 rotações</strong> (Caso 1 $\\to$ Caso 3 $\\to$ Caso 4) e termina em tempo total $O(\\lg n)$!</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">RB-DELETE-FIXUP(T, x)</span> &nbsp;(p. 279)</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">while</span> x ≠ T.raiz <span class="kw">e</span> x.cor == PRETO</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">if</span> x == x.p.esquerda</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">        w = x.p.direita</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">        <span class="kw">if</span> w.cor == VERMELHO <span class="cmt">// CASO 1: irmão w é vermelho</span></span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">            w.cor = PRETO</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">            x.p.cor = VERMELHO</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">            LEFT-ROTATE(T, x.p)</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">            w = x.p.direita</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">        <span class="kw">if</span> w.esquerda.cor == PRETO <span class="kw">e</span> w.direita.cor == PRETO <span class="cmt">// CASO 2: ambos os filhos de w são pretos</span></span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">            w.cor = VERMELHO</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">            x = x.p</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">        <span class="kw">else</span> <span class="kw">if</span> w.direita.cor == PRETO <span class="cmt">// CASO 3: w.esquerda é vermelho e w.direita é preto</span></span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">                w.esquerda.cor = PRETO</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">                w.cor = VERMELHO</span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content">                RIGHT-ROTATE(T, w)</span></div>
              <div class="code-line"><span class="line-num">16</span><span class="line-content">                w = x.p.direita</span></div>
              <div class="code-line"><span class="line-num">17</span><span class="line-content">            w.cor = x.p.cor <span class="cmt">// CASO 4: w.direita é vermelho</span></span></div>
              <div class="code-line"><span class="line-num">18</span><span class="line-content">            x.p.cor = PRETO</span></div>
              <div class="code-line"><span class="line-num">19</span><span class="line-content">            w.direita.cor = PRETO</span></div>
              <div class="code-line"><span class="line-num">20</span><span class="line-content">            LEFT-ROTATE(T, x.p)</span></div>
              <div class="code-line"><span class="line-num">21</span><span class="line-content">            x = T.raiz</span></div>
              <div class="code-line"><span class="line-num">22</span><span class="line-content">    <span class="kw">else</span> (mesmo que a cláusula <span class="kw">then</span> com “direita” e “esquerda” trocados)</span></div>
              <div class="code-line"><span class="line-num">23</span><span class="line-content">x.cor = PRETO</span></div>
            </div>
          </div>
        `
      },

      /* ====================================================================
         UNIDADE 8.5 — CAPÍTULO 14, SEÇÕES 14.1 E 14.2 (pp. 285–293)
         ==================================================================== */
      {
        id: "u8-5",
        code: "UNIDADE 05 • CAPÍTULO 14.1 E 14.2 (PP. 285–293)",
        title: "14.1 e 14.2 Estatísticas de Ordem Dinâmicas e Como Aumentar uma Estrutura de Dados",
        summary:
          "Árvores de Estatísticas de Ordem com o atributo x.tamanho = x.esquerda.tamanho + x.direita.tamanho + 1; seleção do i-ésimo menor elemento (OS-SELECT) e determinação do posto de um nó (OS-RANK) em O(lg n); manutenção de x.tamanho durante inserção, remoção e rotações em O(1); metodologia de 4 etapas para aumentar estruturas e prova do Teorema 14.1.",
        body: `
          <h3>1. Árvores de Estatísticas de Ordem Dinâmicas (Seção 14.1, pp. 285–290)</h3>
          <p>No Capítulo 9 (Módulo 6), vimos como encontrar a $i$-ésima estatística de ordem de um conjunto estático de $n$ elementos em tempo $O(n)$. Agora queremos manter um <strong>conjunto dinâmico</strong> sujeito a inserções e remoções constantes e responder em tempo <strong>$O(\\lg n)$</strong> tanto qual é o $i$-ésimo menor elemento (<code>OS-SELECT</code>) quanto qual é o posto (posição na ordem linear) de um dado nó $x$ (<code>OS-RANK</code>).</p>
          <p>Uma <strong>árvore de estatísticas de ordem</strong> $T$ é simplesmente uma árvore vermelho-preto na qual cada nó $x$ armazena, além de <code>chave</code>, <code>cor</code>, <code>p</code>, <code>esquerda</code> e <code>direita</code>, um atributo inteiro adicional <strong>$x.\\text{tamanho}$</strong>, que contém o número de nós internos na subárvore enraizada em $x$ (incluindo o próprio $x$). Definindo o tamanho da sentinela como <strong>$T.\\text{nil}.\\text{tamanho} = 0$</strong>, vale para todo nó interno $x$ a identidade fundamental:</p>
          $$\\mathbf{x.\\text{tamanho} = x.\\text{esquerda}.\\text{tamanho} + x.\\text{direita}.\\text{tamanho} + 1}.$$
          <p>(Na presença de chaves iguais, definimos o <em>posto</em> de um elemento como a posição $1 \\dots n$ na qual ele seria impresso em um percurso em in-ordem da árvore.)</p>

          <h4>1.1 Recuperando o Elemento de Determinado Posto: <code>OS-SELECT(x, i)</code> (p. 286)</h4>
          <p>O procedimento <code>OS-SELECT(x, i)</code> retorna um ponteiro para o nó que contém a $i$-ésima menor chave na subárvore enraizada em $x$ (chamado inicialmente como <code>OS-SELECT(T.raiz, i)</code>). Na linha 1, calculamos $r = x.\\text{esquerda}.\\text{tamanho} + 1$, que é exatamente o <strong>posto de $x$ dentro da subárvore enraizada em $x$</strong> (pois $x.\\text{esquerda}.\\text{tamanho}$ nós precedem $x$ no percurso em in-ordem dessa subárvore):</p>
          <ul>
            <li>Se $i == r$, então o próprio nó $x$ é o $i$-ésimo menor elemento!</li>
            <li>Se $i < r$, então o $i$-ésimo menor elemento está na subárvore esquerda de $x$, logo recursamos em <code>OS-SELECT(x.esquerda, i)</code>.</li>
            <li>Se $i > r$, então o $i$-ésimo menor elemento está na subárvore direita de $x$. Como $r$ elementos da subárvore enraizada em $x$ (toda a subárvore esquerda de $x$ mais o próprio $x$) precedem a subárvore direita de $x$, o $i$-ésimo menor elemento da subárvore em $x$ é o <strong>$(i - r)$-ésimo menor elemento da subárvore enraizada em $x.\\text{direita}$</strong>!</li>
          </ul>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">OS-SELECT(x, i)</span> &nbsp;(p. 286)</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">r = x.esquerda.tamanho + 1</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">if</span> i == r</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    <span class="kw">return</span> x</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">elseif</span> i &lt; r</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">return</span> OS-SELECT(x.esquerda, i)</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">else</span> <span class="kw">return</span> OS-SELECT(x.direita, i - r)</span></div>
            </div>
          </div>

          <h4>1.2 Determinando o Posto de um Elemento: <code>OS-RANK(T, x)</code> (pp. 287–288)</h4>
          <p>Dado um ponteiro para um nó $x$ em uma árvore de estatísticas de ordem $T$, o procedimento <code>OS-RANK(T, x)</code> retorna a posição de $x$ na ordem linear determinada por um percurso em in-ordem de $T$. Começamos com $r = x.\\text{esquerda}.\\text{tamanho} + 1$ (o posto de $x$ dentro da subárvore enraizada em $x$) e subimos com um ponteiro $y = x$ até $T.\\text{raiz}$: sempre que $y$ for o <strong>filho à direita</strong> de seu pai $y.p$ ($y == y.p.\\text{direita}$), todos os nós na subárvore esquerda de $y.p$ mais o próprio $y.p$ precedem $x$, portanto somamos $y.p.\\text{esquerda}.\\text{tamanho} + 1$ a $r$!</p>
          <p><strong>Invariante de Laço de <code>OS-RANK</code>:</strong> No início de cada iteração do laço <code>while</code>, $r$ é o posto de $x.\\text{chave}$ na subárvore com raiz no nó $y$.</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">OS-RANK(T, x)</span> &nbsp;(p. 287)</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">r = x.esquerda.tamanho + 1</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">y = x</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">while</span> y ≠ T.raiz</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">if</span> y == y.p.direita</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">        r = r + y.p.esquerda.tamanho + 1</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">    y = y.p</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">return</span> r</span></div>
            </div>
          </div>

          <p>Tanto <code>OS-SELECT</code> quanto <code>OS-RANK</code> gastam tempo $O(1)$ por nível de altura da árvore vermelho-preto, executando em <strong>$O(\\lg n)$</strong>.</p>

          <h4>1.3 Manutenção dos Tamanhos de Subárvores em $O(\\lg n)$ (pp. 288–289)</h4>
          <p>Como manter o atributo $x.\\text{tamanho}$ atualizado durante <code>RB-INSERT</code> e <code>RB-DELETE</code> sem aumentar a complexidade assintótica $O(\\lg n)$?</p>
          <ul>
            <li><strong>Fase 1 de <code>RB-INSERT</code> (descida na árvore):</strong> Inicializamos $z.\\text{tamanho} = 1$ para o novo nó inserido e, para cada nó $x$ no caminho simples da raiz até o ponto de inserção, incrementamos $x.\\text{tamanho} = x.\\text{tamanho} + 1$ durante a descida (gastando $O(\\lg n)$).</li>
            <li><strong>Fase 1 de <code>RB-DELETE</code> (remoção estrutural de $y$):</strong> Percorremos um caminho simples do pai da posição original de $y$ até a raiz da árvore, decrementando o atributo <code>tamanho</code> de cada nó no caminho em $1$ (gastando $O(\\lg n)$).</li>
            <li><strong>Fase 2 de <code>RB-INSERT-FIXUP</code> e <code>RB-DELETE-FIXUP</code> (Rotações):</strong> As mudanças de cor não alteram o tamanho de nenhuma subárvore, e as rotações são operações locais que invalidam o atributo <code>tamanho</code> de <strong>apenas dois nós: $x$ e $y$</strong>! Em <code>LEFT-ROTATE(T, x)</code> (Figura 14.2), como $y$ assume o lugar de $x$ como raiz da subárvore inteira e $x$ passa a ser o filho esquerdo de $y$, basta adicionar duas linhas ao final de <code>LEFT-ROTATE(T, x)</code> (em tempo $O(1)$!):
              <div class="clrs-pseudocode-box">
                <div class="pseudocode-header">Linhas 13–14 adicionadas a <span class="proc-name">LEFT-ROTATE(T, x)</span> &nbsp;(p. 289)</div>
                <div class="pseudocode-lines">
                  <div class="code-line"><span class="line-num">13</span><span class="line-content">y.tamanho = x.tamanho</span></div>
                  <div class="code-line"><span class="line-num">14</span><span class="line-content">x.tamanho = x.esquerda.tamanho + x.direita.tamanho + 1</span></div>
                </div>
              </div>
              (E simetricamente em <code>RIGHT-ROTATE(T, y)</code>: <code>x.tamanho = y.tamanho</code> e <code>y.tamanho = y.esquerda.tamanho + y.direita.tamanho + 1</code>.)
            </li>
          </ul>

          <h3>2. Como Aumentar uma Estrutura de Dados e o Teorema 14.1 (Seção 14.2, pp. 290–293)</h3>
          <p>O processo de aumentar uma estrutura de dados básica para suportar funcionalidades adicionais pode ser dividido em <strong>quatro etapas metodológicas</strong>:</p>
          <ol>
            <li><strong>Etapa 1:</strong> Escolher uma estrutura de dados subjacente.</li>
            <li><strong>Etapa 2:</strong> Determinar informações adicionais a serem mantidas na estrutura de dados subjacente.</li>
            <li><strong>Etapa 3:</strong> Verificar se podemos manter as informações adicionais para as operações básicas de modificação na estrutura de dados subjacente.</li>
            <li><strong>Etapa 4:</strong> Desenvolver novas operações.</li>
          </ol>

          <p>Para árvores vermelho-preto, o <strong>Teorema 14.1</strong> automatiza a Etapa 3 sempre que a informação adicional em um nó depender apenas dele mesmo e de seus dois filhos imediatos:</p>

          <div class="theorem-box">
            <h4>Teorema 14.1 — Aumentando uma Árvore Vermelho-Preto (p. 291)</h4>
            <p><strong>Enunciado:</strong> Seja $f$ um atributo que aumenta uma árvore vermelho-preto $T$ de $n$ nós internos, e suponha que o conteúdo de $f$ para qualquer nó $x$ possa ser calculado no tempo $O(1)$ usando apenas as informações nos nós $x$, $x.\\text{esquerda}$ e $x.\\text{direita}$, possivelmente incluindo $x.\\text{esquerda}.f$ e $x.\\text{direita}.f$. Então, podemos manter os valores de $f$ em todos os nós de $T$ durante a inserção e a eliminação sem afetar assintoticamente os tempos de execução $O(\\lg n)$ dessas operações.</p>
            <p><strong>Ideia da Prova:</strong> Quando um atributo $x.f$ muda em um nó $x$, o único outro nó cujo valor de $f$ depende diretamente de $x.f$ é seu pai $x.p$. Assim, propagar uma alteração de $x.f$ até a raiz custa $O(1)$ por ancestral no caminho simples de $x$ até $T.\\text{raiz}$, totalizando $O(h) = O(\\lg n)$. Tanto na Fase 1 de <code>RB-INSERT</code> (inserção da folha $z$) quanto na Fase 1 de <code>RB-DELETE</code> (remoção/transplante de $y$), basta subir de $z$ (ou de $y.p$ e $y$) até a raiz recalculando $f$ em $O(\\lg n)$. Na Fase 2 (<code>FIXUP</code>), realizam-se no máximo 2 (inserção) ou 3 (remoção) rotações; após cada rotação entre $x$ e $y$, recalculamos $f$ em $x$, depois em $y$, e propagamos pela cadeia de ancestrais até a raiz em $O(\\lg n)$ (ou em $O(1)$ apenas para $x$ e $y$ quando o valor da subárvore como um todo permanece inalterado, como em $x.\\text{tamanho}$ e $x.\\text{max}$!). $\\blacksquare$</p>
          </div>
        `
      },

      /* ====================================================================
         UNIDADE 8.6 — CAPÍTULO 14, SEÇÃO 14.3 (pp. 293–299)
         ==================================================================== */
      {
        id: "u8-6",
        code: "UNIDADE 06 • CAPÍTULO 14.3 (PP. 293–299)",
        title: "14.3 Árvores de Intervalos (INTERVAL-SEARCH e Teorema 14.2)",
        summary:
          "Representação de intervalos fechados [t_1, t_2] e a lei da Tricotomia de Intervalos; aplicação das 4 etapas do aumento para projetar Árvores de Intervalos (chave = x.int.baixo, atributo aumentado = x.max); busca de intervalo sobreposto INTERVAL-SEARCH(T, i) em O(lg n) e prova completa do invariante do Teorema 14.2.",
        body: `
          <h3>1. Representação de Intervalos e a Tricotomia de Intervalos (Seção 14.3, pp. 293–294)</h3>
          <p>Nesta seção, aplicamos a metodologia de aumento da Seção 14.2 para projetar uma <strong>Árvore de Intervalos</strong>: uma árvore vermelho-preto aumentada que mantém um conjunto dinâmico de intervalos fechados (como intervalos de tempo contínuos de eventos) e suporta ` +
          `<code>INTERVAL-INSERT</code>, <code>INTERVAL-DELETE</code> e a consulta <code>INTERVAL-SEARCH(T, i)</code> (que encontra um intervalo na árvore que se sobrepõe ao intervalo de consulta $i$, se existir) — todas em tempo <strong>$O(\\lg n)$</strong>.</p>
          <p>Representamos um intervalo fechado $[t_1, t_2]$ como um objeto $i$ com dois atributos: o <strong>ponto extremo baixo</strong> $i.\\text{baixo} = t_1$ e o <strong>ponto extremo alto</strong> $i.\\text{alto} = t_2$, onde $i.\\text{baixo} \\le i.\\text{alto}$. Dois intervalos $i$ e $i'$ <strong>se sobrepõem</strong> ($i \\cap i' \\neq \\emptyset$) se, e somente se, ambos os testes simultâneos são verdadeiros:</p>
          $$\\mathbf{i.\\text{baixo} \\le i'.\\text{alto} \\quad \\text{e} \\quad i'.\\text{baixo} \\le i.\\text{alto}}.$$
          <p>Qualquer par de intervalos $i$ e $i'$ satisfaz a <strong>tricotomia de intervalos</strong> (Figura 14.3), isto é, exatamente uma das três propriedades a seguir é verdadeira:</p>
          <ol>
            <li><strong>(a)</strong> $i$ e $i'$ se sobrepõem ($i.\\text{baixo} \\le i'.\\text{alto}$ e $i'.\\text{baixo} \\le i.\\text{alto}$).</li>
            <li><strong>(b)</strong> $i$ está totalmente à esquerda de $i'$ ($i.\\text{alto} < i'.\\text{baixo}$).</li>
            <li><strong>(c)</strong> $i$ está totalmente à direita de $i'$ ($i'.\\text{alto} < i.\\text{baixo}$).</li>
          </ol>

          <h3>2. Projetando Árvores de Intervalos pelas 4 Etapas do Aumento (pp. 294–296)</h3>
          <ul>
            <li><strong>Etapa 1 (Estrutura de dados subjacente):</strong> Escolhemos uma <strong>árvore vermelho-preto</strong> na qual cada nó $x$ contém um atributo de intervalo $x.\\text{int}$, e a <strong>chave</strong> de $x$ é o seu ponto extremo baixo: $x.\\text{chave} = x.\\text{int}.\\text{baixo}$. Assim, um percurso em in-ordem da estrutura lista os intervalos em ordem crescente pelo ponto extremo baixo.</li>
            <li><strong>Etapa 2 (Informação adicional):</strong> Além dos intervalos em si, cada nó $x$ contém um valor <strong>$x.\\text{max}$</strong>, que é o <strong>valor máximo de qualquer ponto extremo de intervalo armazenado na subárvore enraizada em $x$</strong> (com $T.\\text{nil}.\\text{max} = -\\infty$).</li>
            <li><strong>Etapa 3 (Manutenção da informação):</strong> Dado o intervalo $x.\\text{int}$ e os valores $x.\\text{max}$ dos filhos de $x$, podemos calcular $x.\\text{max}$ em tempo $O(1)$ pela recorrência local:
              $$\\mathbf{x.\\text{max} = \\max(x.\\text{int}.\\text{alto},\\; x.\\text{esquerda}.\\text{max},\\; x.\\text{direita}.\\text{max})}.$$
              Portanto, pelo <strong>Teorema 14.1</strong>, <code>INTERVAL-INSERT</code> e <code>INTERVAL-DELETE</code> são executados no tempo <strong>$O(\\lg n)$</strong>! (Em uma rotação <code>LEFT-ROTATE(T, x)</code>, basta definir $y.\\text{max} = x.\\text{max}$ e recalcular $x.\\text{max} = \\max(x.\\text{int}.\\text{alto}, x.\\text{esquerda}.\\text{max}, x.\\text{direita}.\\text{max})$ em $O(1)$!)</li>
            <li><strong>Etapa 4 (Desenvolvendo novas operações — <code>INTERVAL-SEARCH(T, i)</code>):</strong> Procuramos um nó $x$ na árvore $T$ cujo intervalo $x.\\text{int}$ se sobreponha ao intervalo de consulta $i$ (retornando $T.\\text{nil}$ se não existir tal intervalo):</li>
          </ul>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">INTERVAL-SEARCH(T, i)</span> &nbsp;(p. 296)</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">x = T.raiz</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">while</span> x ≠ T.nil <span class="kw">e</span> i não se sobrepõe a x.int</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    <span class="kw">if</span> x.esquerda ≠ T.nil <span class="kw">e</span> x.esquerda.max ≥ i.baixo</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">        x = x.esquerda</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">else</span> x = x.direita</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">return</span> x</span></div>
            </div>
          </div>

          <h3>3. Prova de Corretude de <code>INTERVAL-SEARCH</code>: O Teorema 14.2 (pp. 296–298)</h3>
          <p>Por que podemos ter certeza de que seguir para <code>x.esquerda</code> quando $x.\\text{esquerda}.\\text{max} \\ge i.\\text{baixo}$ nunca nos fará "perder" um intervalo sobreposto que estivesse apenas na subárvore direita de $x$? A resposta é uma das provas de invariante mais elegantes do livro:</p>

          <div class="theorem-box">
            <h4>Teorema 14.2 — Corretude de <code>INTERVAL-SEARCH(T, i)</code> (p. 296)</h4>
            <p><strong>Enunciado:</strong> Qualquer execução de <code>INTERVAL-SEARCH(T, i)</code> encontra um intervalo que se sobrepõe a $i$, ou retorna <code>T.nil</code> se a árvore $T$ não contém nenhum intervalo que se sobreponha a $i$.</p>
            <p><strong>Demonstração Completa via Invariante de Laço:</strong></p>
            <p><strong>Invariante de Laço (linhas 2–5):</strong> <em>Se a árvore $T$ contém um intervalo que se sobrepõe a $i$, então a subárvore com raiz em $x$ contém tal intervalo.</em></p>
            <ul>
              <li><strong>Inicialização:</strong> Antes da primeira iteração, a linha 1 atribui $x = T.\\text{raiz}$, logo a subárvore enraizada em $x$ é a árvore inteira $T$, e o invariante é trivialmente verdadeiro.</li>
              <li><strong>Manutenção — Caso 1 (A busca vai para a direita na linha 5):</strong> Isso ocorre quando $x.\\text{esquerda} == T.\\text{nil}$ (subárvore esquerda vazia) ou quando <strong>$x.\\text{esquerda}.\\text{max} < i.\\text{baixo}$</strong> (Figura 14.5a). Neste segundo caso, pela definição de $\\text{max}$, para <em>qualquer</em> intervalo $i'$ na subárvore esquerda de $x$, temos:
                $$i'.\\text{alto} \\le x.\\text{esquerda}.\\text{max} < i.\\text{baixo}.$$
                Pela tricotomia de intervalos, $i'$ está totalmente à esquerda de $i$, logo <strong>nenhum intervalo na subárvore esquerda de $x$ pode se sobrepor a $i$</strong>! Como o próprio $x.\\text{int}$ também não se sobrepõe a $i$ (condição do <code>while</code>), qualquer intervalo que se sobreponha a $i$ na subárvore de $x$ deve estar na subárvore direita $x.\\text{direita}$. Logo, $x = x.\\text{direita}$ mantém o invariante.</li>
              <li><strong>Manutenção — Caso 2 (A busca vai para a esquerda na linha 4):</strong> Isso ocorre quando $x.\\text{esquerda} \\neq T.\\text{nil}$ e <strong>$x.\\text{esquerda}.\\text{max} \\ge i.\\text{baixo}$</strong> (Figura 14.5b). Provaremos a contrapositiva do invariante: <em>se a subárvore esquerda $x.\\text{esquerda}$ NÃO contiver nenhum intervalo que se sobreponha a $i$, então também NÃO há nenhum intervalo na subárvore direita $x.\\text{direita}$ que se sobreponha a $i$!</em>
                <br>De fato, pela definição de $x.\\text{esquerda}.\\text{max}$, a subárvore esquerda de $x$ contém algum intervalo $i'$ tal que:
                $$i'.\\text{alto} = x.\\text{esquerda}.\\text{max} \\ge i.\\text{baixo}.$$
                Suponha que a subárvore esquerda não contenha nenhum intervalo sobreposto a $i$; em particular, $i$ e $i'$ não se sobrepõem. Como não vale $i'.\\text{alto} < i.\\text{baixo}$ (pois $i'.\\text{alto} \\ge i.\\text{baixo}$), pela tricotomia de intervalos deve valer obrigatoriamente que:
                $$\\mathbf{i.\\text{alto} < i'.\\text{baixo}}.$$
                Mas as árvores de intervalos são ordenadas como ABBs pelos pontos extremos <strong>baixos</strong>! Como $i'$ está na subárvore esquerda de $x$, a propriedade de árvore de busca binária garante que para <em>qualquer</em> intervalo $i''$ na subárvore direita de $x$:
                $$i.\\text{alto} < i'.\\text{baixo} \\le x.\\text{int}.\\text{baixo} \\le i''.\\text{baixo}.$$
                Logo, $i.\\text{alto} < i''.\\text{baixo}$ para todo $i''$ na subárvore direita de $x$, o que prova que <strong>nenhum intervalo na subárvore direita pode se sobrepor a $i$</strong>! Portanto, ir para $x = x.\\text{esquerda}$ sempre mantém o invariante!</li>
              <li><strong>Término:</strong> Se o laço termina com $x \\neq T.\\text{nil}$, então $i$ se sobrepõe a $x.\\text{int}$ e retornamos $x$ corretamente. Se termina com $x == T.\\text{nil}$, a subárvore vazia enraizada em $x$ não contém nenhum intervalo sobreposto a $i$, logo pela contrapositiva do invariante $T$ não contém nenhum intervalo sobreposto a $i$. $\\blacksquare$</li>
            </ul>
          </div>
        `
      }
    ],

    /* ======================================================================
       SEÇÃO 2.5: WORKBENCH INTERATIVO DUPLO DO MÓDULO 8
       ====================================================================== */
    initWorkbenches: function () {
      const mount = document.getElementById("workbench-mod8-mount");
      if (!mount) return;

      mount.innerHTML = `
        <div class="interactive-workbench-card" style="margin: 2rem 0; padding: 1.5rem; border-radius: 12px; background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(56, 189, 248, 0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
            <div>
              <span style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; color: #38bdf8; text-transform: uppercase;">
                [ WORKBENCH INTERATIVO • CAPÍTULOS 12, 13 E 14 ]
              </span>
              <h4 style="margin: 0.25rem 0 0 0; font-size: 1.2rem; color: #f8fafc;">
                Laboratório Duplo: Rotações / RB-INSERT-FIXUP + Árvores de Estatísticas de Ordem e Intervalos
              </h4>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button id="wb8-tab-rb" type="button" style="padding: 0.45rem 0.9rem; border-radius: 6px; border: 1px solid #38bdf8; background: #0284c7; color: #fff; font-weight: 600; cursor: pointer;">
                1. Rotações & RB-INSERT-FIXUP
              </button>
              <button id="wb8-tab-aug" type="button" style="padding: 0.45rem 0.9rem; border-radius: 6px; border: 1px solid #475569; background: #1e293b; color: #cbd5e1; font-weight: 600; cursor: pointer;">
                2. OS-SELECT / INTERVAL-SEARCH
              </button>
            </div>
          </div>

          <!-- ABA 1: SIMULADOR DE ROTAÇÕES E RB-INSERT-FIXUP -->
          <div id="wb8-panel-rb">
            <p style="font-size: 0.92rem; color: #cbd5e1; margin-bottom: 1rem;">
              Explore a sequência clássica de <code>RB-INSERT-FIXUP</code> da Figura 13.4 do CLRS (inserção de $z = 4$ na árvore vermelho-preto) ou o exemplo do Exercício 13.3-2 ($\\langle 41, 38, 31, 12, 19, 8 \\rangle$), acompanhando as cores, a altura preta $\\text{bh}(x)$ e a manutenção em $O(1)$ do atributo aumentado $x.\\text{tamanho}$:
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 1rem;">
              <button class="wb8-step-btn" data-step="0" type="button" style="padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid #38bdf8; background: #0f172a; color: #e2e8f0; cursor: pointer;">
                Passo 1: Inserir z=4 (Caso 1: Tio y=8 Vermelho)
              </button>
              <button class="wb8-step-btn" data-step="1" type="button" style="padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #e2e8f0; cursor: pointer;">
                Passo 2: Após Caso 1 → z=7 (Caso 2: Tio y=14 Preto, z Filho Direito)
              </button>
              <button class="wb8-step-btn" data-step="2" type="button" style="padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #e2e8f0; cursor: pointer;">
                Passo 3: LEFT-ROTATE(T, 2) → z=2 (Caso 3: z Filho Esquerdo)
              </button>
              <button class="wb8-step-btn" data-step="3" type="button" style="padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #e2e8f0; cursor: pointer;">
                Passo 4: RIGHT-ROTATE(T, 11) → Árvore Válida!
              </button>
            </div>
            <div id="wb8-rb-display" style="padding: 1rem; border-radius: 8px; background: rgba(2, 6, 23, 0.75); border: 1px solid rgba(148, 163, 184, 0.2); font-family: monospace; line-height: 1.55; color: #f1f5f9;"></div>
          </div>

          <!-- ABA 2: SIMULADOR DE OS-SELECT E INTERVAL-SEARCH -->
          <div id="wb8-panel-aug" style="display: none;">
            <p style="font-size: 0.92rem; color: #cbd5e1; margin-bottom: 1rem;">
              Simule passo a passo a consulta <code>OS-SELECT(T.raiz, i)</code> na árvore de estatísticas de ordem ou <code>INTERVAL-SEARCH(T, [baixo, alto])</code> na árvore de intervalos da Figura 14.4 do CLRS:
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
              <div style="padding: 0.85rem; border-radius: 8px; background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(56, 189, 248, 0.25);">
                <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #38bdf8; margin-bottom: 0.4rem;">
                  Consulta 1: OS-SELECT(T.raiz, i) (i de 1 a 9)
                </label>
                <div style="display: flex; gap: 0.5rem;">
                  <input id="wb8-os-rank" type="number" min="1" max="9" value="5" style="width: 80px; padding: 0.4rem; border-radius: 6px; border: 1px solid #475569; background: #020617; color: #fff;" />
                  <button id="wb8-run-os" type="button" style="padding: 0.4rem 0.8rem; border-radius: 6px; border: none; background: #0284c7; color: #fff; font-weight: 600; cursor: pointer;">
                    Executar OS-SELECT
                  </button>
                </div>
              </div>
              <div style="padding: 0.85rem; border-radius: 8px; background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(16, 185, 129, 0.25);">
                <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #34d399; margin-bottom: 0.4rem;">
                  Consulta 2: INTERVAL-SEARCH(T, [baixo, alto])
                </label>
                <div style="display: flex; gap: 0.4rem; align-items: center;">
                  <input id="wb8-int-low" type="number" value="22" style="width: 65px; padding: 0.4rem; border-radius: 6px; border: 1px solid #475569; background: #020617; color: #fff;" />
                  <span style="color: #94a3b8;">até</span>
                  <input id="wb8-int-high" type="number" value="25" style="width: 65px; padding: 0.4rem; border-radius: 6px; border: 1px solid #475569; background: #020617; color: #fff;" />
                  <button id="wb8-run-int" type="button" style="padding: 0.4rem 0.8rem; border-radius: 6px; border: none; background: #059669; color: #fff; font-weight: 600; cursor: pointer;">
                    Buscar Intervalo
                  </button>
                </div>
              </div>
            </div>
            <div id="wb8-aug-display" style="padding: 1rem; border-radius: 8px; background: rgba(2, 6, 23, 0.75); border: 1px solid rgba(148, 163, 184, 0.2); font-family: monospace; line-height: 1.55; color: #f1f5f9;"></div>
          </div>
        </div>
      `;

      const rbSteps = [
        {
          title: "Figura 13.4(a) — Estado Inicial Após Inserir z = 4 (VERMELHO): Caso 1",
          tree: [
            "              [11 : PRETO | tam=9, bh=2]",
            "             /                          \\",
            "    [2 : VERMELHO | tam=6]        [14 : PRETO | tam=2]",
            "     /                 \\                        \\",
            "[1:PRETO|tam=1]   [7:PRETO|tam=4]           [15:VERMELHO|tam=1]",
            "                   /           \\",
            "          [5:VERMELHO|tam=2]  [8:VERMELHO|tam=1] (← tio y de z)",
            "                /",
            "        [4:VERMELHO|tam=1] (← nó z recém-inserido)"
          ].join("<br>"),
          note: "Violação da Propriedade 4: z = 4 (VERMELHO) e z.p = 5 (VERMELHO). Como o tio y = 8 também é VERMELHO, aplica-se o CASO 1: pintamos z.p = 5 e y = 8 de PRETO, pintamos o avô z.p.p = 7 de VERMELHO e subimos z = 7!"
        },
        {
          title: "Figura 13.4(b) — Após o Caso 1 (z = 7): Caso 2 (Tio y = 14 é PRETO e z é Filho Direito)",
          tree: [
            "              [11 : PRETO | tam=9, bh=2]",
            "             /                          \\",
            "    [2 : VERMELHO | tam=6]        [14 : PRETO | tam=2] (← tio y de z)",
            "     /                 \\                        \\",
            "[1:PRETO|tam=1]   [7:VERMELHO|tam=4] (← z)  [15:VERMELHO|tam=1]",
            "                   /           \\",
            "           [5:PRETO|tam=2]   [8:PRETO|tam=1]",
            "                /",
            "        [4:VERMELHO|tam=1]"
          ].join("<br>"),
          note: "Agora z = 7 (VERMELHO) e z.p = 2 (VERMELHO), mas o tio y = 14 é PRETO e z = 7 é FILHO DIREITO de z.p = 2 (zigue-zague esquerda-direita). Aplica-se o CASO 2: fazemos z = z.p = 2 e executamos LEFT-ROTATE(T, 2)!"
        },
        {
          title: "Figura 13.4(c) — Após LEFT-ROTATE(T, 2): Caso 3 (Tio y = 14 é PRETO e z = 2 é Filho Esquerdo)",
          tree: [
            "              [11 : PRETO | tam=9, bh=2] (← avô z.p.p)",
            "             /                          \\",
            "    [7 : VERMELHO | tam=6] (← z.p) [14 : PRETO | tam=2] (← tio y)",
            "     /                 \\                        \\",
            "[2:VERMELHO|tam=4](←z) [8:PRETO|tam=1]      [15:VERMELHO|tam=1]",
            "   /          \\",
            "[1:PRETO|1]  [5:PRETO|tam=2]",
            "               /",
            "       [4:VERMELHO|tam=1]"
          ].join("<br>"),
          note: "Note a atualização de tamanho em O(1) durante LEFT-ROTATE(T, 2): 7.tamanho recebeu o antigo 2.tamanho (= 6), e 2.tamanho foi recalculado como 1.tamanho + 5.tamanho + 1 = 1 + 2 + 1 = 4! Agora aplicamos o CASO 3: pintamos z.p = 7 de PRETO, z.p.p = 11 de VERMELHO e executamos RIGHT-ROTATE(T, 11)."
        },
        {
          title: "Figura 13.4(d) — Após RIGHT-ROTATE(T, 11): Árvore Vermelho-Preto Perfeitamente Balanceada!",
          tree: [
            "              [7 : PRETO | tam=9, bh=2] (← nova raiz)",
            "             /                         \\",
            "    [2 : VERMELHO | tam=4]       [11 : VERMELHO | tam=4]",
            "     /            \\                /                \\",
            "[1:PRETO|1]   [5:PRETO|2]     [8:PRETO|1]       [14:PRETO|2]",
            "               /                                     \\",
            "       [4:VERMELHO|1]                            [15:VERMELHO|1]"
          ].join("<br>"),
          note: "Em RIGHT-ROTATE(T, 11), 7.tamanho recebeu 11.tamanho (= 9) e 11.tamanho foi recalculado como 8.tamanho + 14.tamanho + 1 = 1 + 2 + 1 = 4. Todas as 5 propriedades vermelho-preto foram restauradas com apenas 2 rotações!"
        }
      ];

      const rbDisplay = document.getElementById("wb8-rb-display");
      const stepBtns = mount.querySelectorAll(".wb8-step-btn");

      function renderRbStep(idx) {
        const s = rbSteps[idx];
        rbDisplay.innerHTML = `
          <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.5rem;">${s.title}</div>
          <div style="padding: 0.75rem; background: #020617; border-radius: 6px; overflow-x: auto; margin-bottom: 0.75rem;">${s.tree}</div>
          <div style="color: #cbd5e1; font-size: 0.88rem;"><strong>Análise CLRS:</strong> ${s.note}</div>
        `;
        stepBtns.forEach((b, i) => {
          b.style.borderColor = i === idx ? "#38bdf8" : "#475569";
          b.style.background = i === idx ? "#0284c7" : "#0f172a";
        });
      }
      stepBtns.forEach((btn) => {
        btn.addEventListener("click", () => renderRbStep( parseInt(btn.getAttribute("data-step"), 10) ));
      });
      renderRbStep(0);

      // Aba 2: OS-SELECT e INTERVAL-SEARCH
      const osTree = {
        key: 7, size: 9,
        left: {
          key: 2, size: 4,
          left: { key: 1, size: 1, left: null, right: null },
          right: {
            key: 5, size: 2,
            left: { key: 4, size: 1, left: null, right: null },
            right: null
          }
        },
        right: {
          key: 11, size: 4,
          left: { key: 8, size: 1, left: null, right: null },
          right: {
            key: 14, size: 2,
            left: null,
            right: { key: 15, size: 1, left: null, right: null }
          }
        }
      };

      const intervalTree = {
        low: 16, high: 21, max: 30,
        left: {
          low: 8, high: 9, max: 23,
          left: {
            low: 5, high: 8, max: 10,
            left: { low: 0, high: 3, max: 3, left: null, right: null },
            right: { low: 6, high: 10, max: 10, left: null, right: null }
          },
          right: { low: 15, high: 23, max: 23, left: null, right: null }
        },
        right: {
          low: 25, high: 30, max: 30,
          left: {
            low: 17, high: 19, max: 20,
            left: null,
            right: { low: 19, high: 20, max: 20, left: null, right: null }
          },
          right: { low: 26, high: 26, max: 26, left: null, right: null }
        }
      };

      const augDisplay = document.getElementById("wb8-aug-display");

      function runOsSelect() {
        let i = parseInt(document.getElementById("wb8-os-rank").value, 10);
        if (isNaN(i) || i < 1 || i > 9) i = 5;
        let x = osTree;
        let currI = i;
        const logs = [`<strong>Rastreamento de OS-SELECT(T.raiz, ${i}) na árvore aumentada (chaves: 1, 2, 4, 5, 7, 8, 11, 14, 15):</strong>`];
        while (x) {
          const leftSize = x.left ? x.left.size : 0;
          const r = leftSize + 1;
          logs.push(`• Nó x = ${x.key} (x.tamanho = ${x.size}, x.esquerda.tamanho = ${leftSize}) → posto local r = ${leftSize} + 1 = <strong>${r}</strong>, buscando i = <strong>${currI}</strong>.`);
          if (currI === r) {
            logs.push(`✅ <strong>Encontrado!</strong> Como i == r (${currI} == ${r}), retorna o nó <strong>x.chave = ${x.key}</strong> (${i}ª estatística de ordem)!`);
            break;
          } else if (currI < r) {
            logs.push(`  ↳ Como i = ${currI} &lt; r = ${r}, recursa à esquerda: <code>OS-SELECT(x.esquerda, ${currI})</code>.`);
            x = x.left;
          } else {
            logs.push(`  ↳ Como i = ${currI} &gt; r = ${r}, desconta r = ${r} elementos e recursa à direita: <code>OS-SELECT(x.direita, ${currI} - ${r} = ${currI - r})</code>.`);
            currI = currI - r;
            x = x.right;
          }
        }
        augDisplay.innerHTML = logs.join("<br>");
      }

      function runIntervalSearch() {
        const qLow = parseInt(document.getElementById("wb8-int-low").value, 10) || 0;
        const qHigh = parseInt(document.getElementById("wb8-int-high").value, 10) || 0;
        let x = intervalTree;
        const logs = [`<strong>Rastreamento de INTERVAL-SEARCH(T, [${qLow}, ${qHigh}]) na Árvore de Intervalos da Figura 14.4:</strong>`];
        while (x) {
          const overlaps = (qLow <= x.high) && (x.low <= qHigh);
          if (overlaps) {
            logs.push(`• Nó x.int = [${x.low}, ${x.high}] (x.max = ${x.max}): <strong>Sobrepõe-se a [${qLow}, ${qHigh}]</strong> (pois ${qLow} ≤ ${x.high} e ${x.low} ≤ ${qHigh})!`);
            logs.push(`✅ <strong>Retorna x.int = [${x.low}, ${x.high}]</strong>!`);
            augDisplay.innerHTML = logs.join("<br>");
            return;
          }
          const leftMax = x.left ? x.left.max : -Infinity;
          if (x.left && leftMax >= qLow) {
            logs.push(`• Nó x.int = [${x.low}, ${x.high}] não se sobrepõe. Como x.esquerda.max = ${leftMax} ≥ i.baixo = ${qLow}, segue para <strong>x.esquerda</strong>.`);
            x = x.left;
          } else {
            logs.push(`• Nó x.int = [${x.low}, ${x.high}] não se sobrepõe. Como x.esquerda.max = ${leftMax === -Infinity ? "-∞" : leftMax} &lt; i.baixo = ${qLow}, segue para <strong>x.direita</strong>.`);
            x = x.right;
          }
        }
        logs.push(`❌ Atingiu <strong>T.nil</strong>: nenhum intervalo na árvore se sobrepõe a [${qLow}, ${qHigh}] (pelo Teorema 14.2)!`);
        augDisplay.innerHTML = logs.join("<br>");
      }

      document.getElementById("wb8-run-os").addEventListener("click", runOsSelect);
      document.getElementById("wb8-run-int").addEventListener("click", runIntervalSearch);
      runOsSelect();

      const tabRb = document.getElementById("wb8-tab-rb");
      const tabAug = document.getElementById("wb8-tab-aug");
      const panelRb = document.getElementById("wb8-panel-rb");
      const panelAug = document.getElementById("wb8-panel-aug");

      tabRb.addEventListener("click", () => {
        panelRb.style.display = "block";
        panelAug.style.display = "none";
        tabRb.style.background = "#0284c7";
        tabRb.style.borderColor = "#38bdf8";
        tabRb.style.color = "#fff";
        tabAug.style.background = "#1e293b";
        tabAug.style.borderColor = "#475569";
        tabAug.style.color = "#cbd5e1";
      });

      tabAug.addEventListener("click", () => {
        panelRb.style.display = "none";
        panelAug.style.display = "block";
        tabAug.style.background = "#0284c7";
        tabAug.style.borderColor = "#38bdf8";
        tabAug.style.color = "#fff";
        tabRb.style.background = "#1e293b";
        tabRb.style.borderColor = "#475569";
        tabRb.style.color = "#cbd5e1";
      });
    },

    /* ======================================================================
       SEÇÃO 3: QUIZZES DE REVISÃO E VERIFICAÇÃO PROFUNDA (10 QUESTÕES)
       ====================================================================== */
    quizzes: [
      {
        id: "q8-1",
        code: "QUIZ 01 • SEÇÃO 12.1 (PROPRIEDADE DE ABB VS. HEAP E TEOREMA 12.1)",
        type: "multiple_choice",
        question: `
          <p>Sobre a <strong>propriedade de árvore de busca binária</strong>, a propriedade de heap de mínimo e o percurso <code>INORDER-TREE-WALK(x)</code> (Seção 12.1, pp. 244–246), assinale a alternativa <strong>correta</strong>:</p>
        `,
        options: [
          {
            letter: "A",
            text: "Em uma árvore de busca binária, todo nó y na subárvore esquerda de x satisfaz y.chave ≤ x.chave e todo nó y na subárvore direita de x satisfaz y.chave ≥ x.chave, permitindo que INORDER-TREE-WALK imprima as n chaves em ordem não decrescente em tempo Θ(n). Já a propriedade de heap de mínimo (x.p.chave ≤ x.chave) não distingue entre subárvore esquerda e direita e não pode imprimir n chaves ordenadas em O(n), pois isso violaria o limite inferior Ω(n lg n) da ordenação por comparações (visto que BUILD-MIN-HEAP leva apenas O(n)).",
            isCorrect: true,
            explanation:
              "Perfeita! Como demonstrado no Exercício 12.1-2, se fosse possível imprimir os elementos de um heap de mínimo em sequência ordenada em tempo O(n), poderíamos ordenar qualquer arranjo de n elementos em O(n) executando BUILD-MIN-HEAP em O(n) seguido dessa impressão em O(n), contradizendo o limite inferior Ω(n lg n) do modelo de comparações!"
          },
          {
            letter: "B",
            text: "A propriedade de árvore de busca binária exige apenas que o filho imediato esquerdo de x tenha chave ≤ x.chave e o filho imediato direito tenha chave ≥ x.chave, sem impor restrições sobre os netos de x.",
            isCorrect: false,
            explanation:
              "Incorreta! Se apenas os filhos imediatos fossem restritos, um filho esquerdo igual a 5 de uma raiz 10 poderia ter um filho direito igual a 99, violando a propriedade de ABB! A condição vale para TODOS os nós y nas subárvores esquerda e direita de x."
          },
          {
            letter: "C",
            text: "O procedimento INORDER-TREE-WALK(x) executa em tempo Θ(n lg n) em uma árvore equilibrada e em tempo Θ(n²) em uma árvore degenerada de altura n - 1.",
            isCorrect: false,
            explanation:
              "Incorreta. Pelo Teorema 12.1, INORDER-TREE-WALK(x) visita cada nó e faz exatamente duas chamadas recursivas por nó, levando tempo estritamente Θ(n) independentemente da altura da árvore!"
          },
          {
            letter: "D",
            text: "Construir uma árvore de busca binária a partir de uma lista arbitrária de n elementos pode ser feito em tempo Θ(n) no pior caso no modelo de comparação.",
            isCorrect: false,
            explanation:
              "Incorreta. Pelo Exercício 12.1-5, como INORDER-TREE-WALK extrai a sequência ordenada em Θ(n), qualquer algoritmo baseado em comparações que construa uma ABB a partir de uma entrada arbitrária deve levar Ω(n lg n) no pior caso."
          }
        ]
      },
      {
        id: "q8-2",
        code: "QUIZ 02 • SEÇÃO 12.2 (TREE-SUCCESSOR E ESTRUTURA DE PAIS)",
        type: "multiple_choice",
        question: `
          <p>Considere o procedimento <code>TREE-SUCCESSOR(x)</code> (Seção 12.2, p. 248) aplicado a um nó $x$ em uma árvore de busca binária onde todas as chaves são distintas. Qual das afirmações a seguir descreve exatamente o funcionamento do algoritmo quando <strong>$x.\\text{direita} == \\text{NIL}$</strong>?</p>
        `,
        options: [
          {
            letter: "A",
            text: "Quando x.direita == NIL, o sucessor de x (se existir) é o ancestral mais baixo de x cujo filho à esquerda também é um ancestral de x; o algoritmo o encontra subindo pelos ponteiros de pai (y = x.p) enquanto y ≠ NIL e x == y.direita, sem realizar nenhuma comparação entre chaves.",
            isCorrect: true,
            explanation:
              "Exato! Enquanto subimos de um filho direito para seu pai (x == y.direita), o pai y tem chave menor que x.chave (pois x está na subárvore direita de y). O primeiro ancestral y tal que subimos vindo de y.esquerda é o menor ancestral maior que x!"
          },
          {
            letter: "B",
            text: "Quando x.direita == NIL, o nó x nunca tem sucessor na árvore e TREE-SUCCESSOR(x) retorna imediatamente NIL.",
            isCorrect: false,
            explanation:
              "Incorreta! Apenas o elemento máximo de toda a árvore retorna NIL quando x.direita == NIL. Qualquer outro nó sem subárvore direita possui um sucessor que é um de seus ancestrais."
          },
          {
            letter: "C",
            text: "Quando x.direita == NIL, o sucessor de x é encontrado chamando TREE-MAXIMUM(x.esquerda).",
            isCorrect: false,
            explanation:
              "Incorreta! TREE-MAXIMUM(x.esquerda) retorna o PREDECESSOR de x quando x.esquerda ≠ NIL, nunca o sucessor."
          },
          {
            letter: "D",
            text: "Para encontrar o sucessor de x quando x.direita == NIL, é obrigatório comparar x.chave com y.chave em cada nível da subida até a raiz.",
            isCorrect: false,
            explanation:
              "Incorreta. TREE-SUCCESSOR nunca lê o atributo chave de nenhum nó: basta comparar os ponteiros x == y.direita!"
          }
        ]
      },
      {
        id: "q8-3",
        code: "QUIZ 03 • SEÇÃO 12.3 (TRANSPLANT E OS 4 CASOS DE TREE-DELETE)",
        type: "multiple_choice",
        question: `
          <p>No procedimento <code>TREE-DELETE(T, z)</code> (Seção 12.3, p. 254), quando o nó $z$ a ser removido possui <strong>dois filhos</strong> ($z.\\text{esquerda} \\neq \\text{NIL}$ e $z.\\text{direita} \\neq \\text{NIL}$), localizamos seu sucessor $y = \\text{TREE-MINIMUM}(z.\\text{direita})$. Por que podemos substituir $y$ diretamente por $y.\\text{direita}$ na linha 7 (<code>TRANSPLANT(T, y, y.direita)</code>) quando $y.p \\neq z$, sem nos preocuparmos com um eventual filho esquerdo de $y$?</p>
        `,
        options: [
          {
            letter: "A",
            text: "Porque, sendo y o elemento mínimo da subárvore direita de z (y = TREE-MINIMUM(z.direita)), y garantidamente não possui filho à esquerda (y.esquerda == NIL); se tivesse um filho esquerdo, esse filho teria chave menor que y.chave e ainda estaria em z.direita, contradizendo a minimalidade de y.",
            isCorrect: true,
            explanation:
              "Correta! Esta é a propriedade estrutural chave provada no Exercício 12.2-5: se um nó z em uma ABB tem dois filhos, seu sucessor y = TREE-MINIMUM(z.direita) nunca tem filho à esquerda, e seu predecessor nunca tem filho à direita."
          },
          {
            letter: "B",
            text: "Porque a sub-rotina TRANSPLANT(T, y, y.direita) copia automaticamente a subárvore y.esquerda para dentro de y.direita.",
            isCorrect: false,
            explanation:
              "Incorreta. Como destacado no texto da p. 253, TRANSPLANT(T, u, v) atualiza apenas a ligação entre u.p e v, sem tocar em v.esquerda ou v.direita."
          },
          {
            letter: "C",
            text: "Porque, quando y.p ≠ z, o nó y é obrigatoriamente uma folha sem nenhum filho (nem esquerdo nem direito).",
            isCorrect: false,
            explanation:
              "Incorreta! O sucessor y não pode ter filho esquerdo, mas pode perfeitamente ter um filho direito x = y.direita não vazio (como ilustrado na Figura 12.4d)."
          },
          {
            letter: "D",
            text: "Porque a operação de eliminação em árvores de busca binária é sempre comutativa: eliminar z e depois x produz sempre a mesma árvore que eliminar x e depois z.",
            isCorrect: false,
            explanation:
              "Incorreta! Pelo Exercício 12.3-4, TREE-DELETE NÃO é comutativa em geral (por exemplo, em uma árvore com raiz 2, filho esquerdo 1, filho direito 3 e filho direito de 3 igual a 4, remover 1 e depois 2 dá uma árvore diferente de remover 2 e depois 1)."
          }
        ]
      },
      {
        id: "q8-4",
        code: "QUIZ 04 • SEÇÃO 12.4 (TEOREMA 12.4 — ABBS CONSTRUÍDAS ALEATORIAMENTE)",
        type: "true_false",
        question: `
          <p>Julgue a veracidade da afirmação sobre a prova do <strong>Teorema 12.4</strong> (Seção 12.4, pp. 255–259): <em>“Para demonstrar que a altura esperada $E[X_n]$ de uma árvore de busca binária construída aleatoriamente em $n$ chaves distintas é $O(\\lg n)$, Cormen et al. definem a altura exponencial $Y_n = 2^{X_n}$, provam por indução que $E[Y_n] \\le \\frac{1}{4}\\binom{n+3}{3} = O(n^3)$ e utilizam a convexidade da função $f(x) = 2^x$ (Desigualdade de Jensen: $2^{E[X_n]} \\le E[2^{X_n}] = E[Y_n]$) para concluir que $E[X_n] \\le 3\\lg(n+3) + O(1) = O(\\lg n)$.”</em></p>
        `,
        options: [
          {
            letter: "V",
            text: "Verdadeiro",
            isCorrect: true,
            explanation:
              "Verdadeiro! Trabalhar diretamente com E[X_n] = 1 + E[max(X_{i-1}, X_{n-i})] é algebricamente difícil por causa do máximo; ao passar para a altura exponencial Y_n = 2^{X_n}, a recorrência ganha um fator multiplicativo 2 que permite limitar max(Y_{i-1}, Y_{n-i}) ≤ Y_{i-1} + Y_{n-i} e obter um polinômio cúbico O(n³), cujo logaritmo na base 2 continua sendo O(lg n)!"
          },
          {
            letter: "F",
            text: "Falso",
            isCorrect: false,
            explanation:
              "A afirmação é verdadeira e resume com exatidão todos os passos da prova do Teorema 12.4."
          }
        ]
      },
      {
        id: "q8-5",
        code: "QUIZ 05 • SEÇÃO 13.1 (PROPRIEDADES VERMELHO-PRETO E LEMA 13.1)",
        type: "multiple_choice",
        question: `
          <p>Considere uma árvore vermelho-preto $T$ com $n$ nós internos e altura preta $k = \\text{bh}(T.\\text{raiz})$. De acordo com as 5 propriedades vermelho-preto e o <strong>Lema 13.1</strong> (Seção 13.1, pp. 263–266), quais são o <strong>menor</strong> e o <strong>maior</strong> número possível de nós internos em uma árvore vermelho-preto de altura preta $k$ (Exercício 13.1-6)?</p>
        `,
        options: [
          {
            letter: "A",
            text: "O menor número possível de nós internos é 2^k - 1 (quando todos os nós são pretos, formando uma árvore binária completa de altura k) e o maior número possível de nós internos é 2^{2k} - 1 (quando níveis pretos e vermelhos se alternam perfeitamente até a altura 2k).",
            isCorrect: true,
            explanation:
              "Exato! Pelo Lema 13.1, o mínimo de nós internos para altura preta k é 2^k - 1 (atingido quando não há nenhum nó vermelho). E como a Propriedade 4 proíbe dois nós vermelhos consecutivos, a altura máxima possível para altura preta k é h = 2k, que comporta no máximo uma árvore binária completa de altura 2k com 2^{2k} - 1 nós internos!"
          },
          {
            letter: "B",
            text: "O menor número possível é k e o maior número possível é 2k.",
            isCorrect: false,
            explanation:
              "Incorreta. Uma árvore vermelho-preto de altura preta k não pode ser uma cadeia linear, pois todos os caminhos até folhas T.nil precisam ter k nós pretos, exigindo no mínimo 2^k - 1 nós internos."
          },
          {
            letter: "C",
            text: "O menor número possível é 2^{k-1} e o maior número possível é 2^{k+1} - 1.",
            isCorrect: false,
            explanation:
              "Incorreta. Esses seriam os limites de um heap binário de altura k - 1, mas em uma árvore vermelho-preto de altura preta k a altura real h pode variar de k até 2k."
          },
          {
            letter: "D",
            text: "Se colorirmos a raiz vermelha de uma árvore vermelho-preto relaxada (que satisfaz as propriedades 1, 3, 4 e 5) de preto, a Propriedade 4 ou a Propriedade 5 pode passar a ser violada.",
            isCorrect: false,
            explanation:
              "Incorreta! Pelo Exercício 13.1-3, pintar a raiz de preto NUNCA cria dois nós vermelhos consecutivos (Propriedade 4) e adiciona +1 nó preto a TODOS os caminhos da árvore simultaneamente (preservando a Propriedade 5). É exatamente por isso que a linha 16 de RB-INSERT-FIXUP (T.raiz.cor = PRETO) sempre funciona!"
          }
        ]
      },
      {
        id: "q8-6",
        code: "QUIZ 06 • SEÇÃO 13.2 (ROTAÇÕES E PROFUNDIDADES DE SUBÁRVORES)",
        type: "multiple_choice",
        question: `
          <p>Considere a operação <code>LEFT-ROTATE(T, x)</code> (Figura 13.2, pp. 266–268), que pivota ao redor da ligação entre $x$ e seu filho direito $y = x.\\text{direita}$, onde $\\alpha$ é a subárvore esquerda de $x$, $\\beta$ é a subárvore esquerda de $y$, e $\\gamma$ é a subárvore direita de $y$. Como mudam as profundidades de todos os nós nas subárvores $\\alpha$, $\\beta$ e $\\gamma$ após a execução de <code>LEFT-ROTATE(T, x)</code> (Exercício 13.2-3)?</p>
        `,
        options: [
          {
            letter: "A",
            text: "A profundidade de cada nó em α aumenta em 1 (pois x desce 1 nível para se tornar filho esquerdo de y), a profundidade de cada nó em β permanece inalterada (pois β passa de filho esquerdo de y para filho direito de x, que agora está na antiga profundidade de y), e a profundidade de cada nó em γ diminui em 1 (pois y sobe 1 nível para o lugar de x).",
            isCorrect: true,
            explanation:
              "Perfeito! Antes da rotação: prof(x) = d e prof(y) = d + 1. Depois da rotação: prof(y) = d e prof(x) = d + 1. Logo α (filha de x) passa de base d+1 para d+2 (+1); β (que trocou de pai y na prof. d+1 para pai x na prof. d+1) mantém a mesma profundidade (0); e γ (filha de y) passa de base d+2 para d+1 (-1)!"
          },
          {
            letter: "B",
            text: "As profundidades de todos os nós em α, β e γ permanecem exatamente iguais, pois rotações preservam o percurso em ordem simétrica.",
            isCorrect: false,
            explanation:
              "Incorreta! Rotações preservam a ordem linear in-ordem, mas justamente alteram as profundidades de α (+1) e γ (-1) para rebalancear a árvore."
          },
          {
            letter: "C",
            text: "A profundidade de α diminui em 1, a de β aumenta em 1 e a de γ diminui em 1.",
            isCorrect: false,
            explanation:
              "Incorreta. Em LEFT-ROTATE(T, x), o nó x desce (logo α aumenta sua profundidade em 1) e β permanece na mesma profundidade."
          },
          {
            letter: "D",
            text: "LEFT-ROTATE(T, x) requer tempo Θ(lg n) porque precisa percorrer todos os nós da subárvore β para transferir seus ponteiros de y para x.",
            isCorrect: false,
            explanation:
              "Incorreta! Apenas a raiz da subárvore β (y.esquerda) tem seu ponteiro p atualizado para x; toda a subárvore β move-se em tempo O(1)."
          }
        ]
      },
      {
        id: "q8-7",
        code: "QUIZ 07 • SEÇÃO 13.3 E 13.4 (NÚMERO MÁXIMO DE ROTAÇÕES EM RB-INSERT E RB-DELETE)",
        type: "multiple_choice",
        question: `
          <p>Compare o comportamento de <code>RB-INSERT-FIXUP</code> e <code>RB-DELETE-FIXUP</code> (Seções 13.3 e 13.4, pp. 269–283) em uma árvore vermelho-preto de $n$ nós. Quantas <strong>recolorações</strong> e quantas <strong>rotações</strong> cada operação pode realizar no pior caso?</p>
        `,
        options: [
          {
            letter: "A",
            text: "Ambas podem realizar O(lg n) mudanças de cor (subindo pela árvore no Caso 1 da inserção ou no Caso 2 da remoção), mas RB-INSERT-FIXUP executa no máximo 2 rotações no total e RB-DELETE-FIXUP executa no máximo 3 rotações no total!",
            isCorrect: true,
            explanation:
              "Exatamente! Esta é uma das propriedades mais notáveis das árvores vermelho-preto: embora a correção possa subir Θ(lg n) níveis recolorindo nós, o número de alterações estruturais de ponteiros (rotações) é estritamente O(1) — no máximo 2 na inserção (Caso 2 → Caso 3) e no máximo 3 na remoção (Caso 1 → Caso 3 → Caso 4)!"
          },
          {
            letter: "B",
            text: "RB-INSERT-FIXUP executa O(1) rotações, mas RB-DELETE-FIXUP pode executar Θ(lg n) rotações ao subir da folha até a raiz.",
            isCorrect: false,
            explanation:
              "Incorreta! Em RB-DELETE-FIXUP, o único caso que sobe na árvore repetindo o laço é o Caso 2, que NÃO realiza nenhuma rotação! Os Casos 1, 3 e 4 realizam rotações e encerram imediatamente o laço após no máximo 3 rotações. (Diferentemente das árvores AVL, que podem exigir Θ(lg n) rotações na remoção!)"
          },
          {
            letter: "C",
            text: "Tanto RB-INSERT-FIXUP quanto RB-DELETE-FIXUP executam Θ(lg n) rotações no pior caso.",
            isCorrect: false,
            explanation:
              "Incorreta. Ambas executam O(1) rotações no pior caso (≤ 2 na inserção e ≤ 3 na remoção)."
          },
          {
            letter: "D",
            text: "Em RB-DELETE(T, z), quando o nó removido ou movido y tinha cor-original-de-y == VERMELHO, ainda é obrigatório chamar RB-DELETE-FIXUP(T, x) para corrigir a Propriedade 5.",
            isCorrect: false,
            explanation:
              "Incorreta. Quando cor-original-de-y == VERMELHO, nenhuma altura preta muda, nenhum par de nós vermelhos adjacentes é criado e a raiz continua preta; por isso RB-DELETE só chama RB-DELETE-FIXUP se cor-original-de-y == PRETO (linha 21)."
          }
        ]
      },
      {
        id: "q8-8",
        code: "QUIZ 08 • SEÇÃO 14.1 (OS-SELECT E OS-RANK EM ÁRVORES DE ESTATÍSTICAS DE ORDEM)",
        type: "multiple_choice",
        question: `
          <p>Em uma Árvore de Estatísticas de Ordem $T$ (Seção 14.1, pp. 285–289), considere a chamada <code>OS-SELECT(x, i)</code> quando $r = x.\\text{esquerda}.\\text{tamanho} + 1 < i$. Por que a chamada recursiva na linha 6 é <code>OS-SELECT(x.direita, i - r)</code> em vez de <code>OS-SELECT(x.direita, i)</code>?</p>
        `,
        options: [
          {
            letter: "A",
            text: "Porque r = x.esquerda.tamanho + 1 é exatamente o número de elementos na subárvore enraizada em x que precedem todos os elementos da subárvore direita de x em um percurso em in-ordem (os x.esquerda.tamanho nós da subárvore esquerda mais o próprio x); logo, o i-ésimo menor elemento da subárvore enraizada em x é o (i - r)-ésimo menor elemento dentro da subárvore enraizada em x.direita.",
            isCorrect: true,
            explanation:
              "Perfeito! Ao descer para a subárvore direita x.direita, todos os r elementos formados por x.esquerda e pelo próprio x ficaram para trás (são menores ou anteriores a toda a subárvore direita), portanto o posto relativo procurado dentro de x.direita passa a ser i - r."
          },
          {
            letter: "B",
            text: "Porque na subárvore esquerda de x existem r + 1 elementos e precisamos compensar a sentinela T.nil cujo tamanho é 1.",
            isCorrect: false,
            explanation:
              "Incorreta! O tamanho da sentinela é definido como T.nil.tamanho = 0, e a subárvore esquerda de x tem r - 1 elementos (mais o próprio x, totalizando r elementos)."
          },
          {
            letter: "C",
            text: "Porque OS-SELECT precisa percorrer a subárvore esquerda inteira antes de visitar a subárvore direita, gastando tempo Θ(n).",
            isCorrect: false,
            explanation:
              "Incorreta. Graças ao atributo x.esquerda.tamanho já armazenado no nó, sabemos em tempo O(1) quantos elementos existem à esquerda sem precisar visitá-los, garantindo tempo O(lg n)!"
          },
          {
            letter: "D",
            text: "Quando i < r, também descontamos r e chamamos OS-SELECT(x.esquerda, r - i).",
            isCorrect: false,
            explanation:
              "Incorreta! Quando i < r, os elementos da subárvore esquerda de x são os primeiros elementos do percurso in-ordem da subárvore de x, logo o posto relativo continua sendo exatamente i: OS-SELECT(x.esquerda, i)."
          }
        ]
      },
      {
        id: "q8-9",
        code: "QUIZ 09 • SEÇÃO 14.2 (TEOREMA 14.1 DO AUMENTO DE ÁRVORES VERMELHO-PRETO)",
        type: "true_false",
        question: `
          <p>Julgue a veracidade da afirmação sobre o <strong>Teorema 14.1</strong> (Seção 14.2, p. 291) e o Exercício 14.1-5: <em>“Como cada nó $x$ de uma árvore de estatísticas de ordem de $n$ elementos pode determinar seu posto global em $O(\\lg n)$ via <code>OS-RANK(T, x)</code>, se em vez de armazenar $x.\\text{tamanho}$ decidíssemos armazenar diretamente o posto global $x.\\text{posto}$ como atributo em cada nó $x$, o Teorema 14.1 garantiria que $x.\\text{posto}$ também pode ser mantido em tempo $O(\\lg n)$ durante inserções e remoções.”</em></p>
        `,
        options: [
          {
            letter: "V",
            text: "Verdadeiro",
            isCorrect: false,
            explanation:
              "Falso! Esta é uma pegadinha clássica: o posto global x.posto NÃO satisfaz a hipótese do Teorema 14.1!"
          },
          {
            letter: "F",
            text: "Falso",
            isCorrect: true,
            explanation:
              "Falso! O posto global de um nó x NÃO depende apenas de x, x.esquerda e x.direita: se inserirmos uma nova chave menor que o mínimo atual da árvore, o posto global de TODOS os n nós da árvore aumenta em +1, exigindo tempo Ω(n) para atualizar x.posto em todos os nós! Já x.tamanho é uma propriedade estritamente local da subárvore enraizada em x (x.tamanho = x.esquerda.tamanho + x.direita.tamanho + 1), satisfazendo o Teorema 14.1 e mudando apenas para os O(lg n) ancestrais do nó inserido."
          }
        ]
      },
      {
        id: "q8-10",
        code: "QUIZ 10 • SEÇÃO 14.3 (INTERVAL-SEARCH E PROVA DO TEOREMA 14.2)",
        type: "multiple_choice",
        question: `
          <p>Em <code>INTERVAL-SEARCH(T, i)</code> (Seção 14.3, pp. 296–298), quando o intervalo $x.\\text{int}$ do nó atual não se sobrepõe ao intervalo de consulta $i$ e verificamos que <strong>$x.\\text{esquerda} \\neq T.\\text{nil}$ e $x.\\text{esquerda}.\\text{max} \\ge i.\\text{baixo}$</strong>, o algoritmo desce para <code>x = x.esquerda</code> sem jamais inspecionar a subárvore direita $x.\\text{direita}$. Por que essa decisão determinística é sempre segura (Teorema 14.2)?</p>
        `,
        options: [
          {
            letter: "A",
            text: "Porque na subárvore esquerda existe algum intervalo i' com i'.alto = x.esquerda.max ≥ i.baixo; se a subárvore esquerda não contiver nenhum intervalo sobreposto a i, então em particular i não se sobrepõe a i', o que implica (pela tricotomia) que i.alto < i'.baixo. E como a ABB é ordenada pelos pontos extremos baixos, todo intervalo i'' na subárvore direita satisfaz i''.baixo ≥ x.int.baixo ≥ i'.baixo > i.alto, logo nenhum intervalo na subárvore direita pode se sobrepor a i!",
            isCorrect: true,
            explanation:
              "Demonstração impecável! É exatamente a combinação da definição de x.esquerda.max com a tricotomia de intervalos e a ordenação da ABB por pontos extremos baixos (Figura 14.5b) que garante que, se a ida para a esquerda falhar, a subárvore direita também estava condenada a falhar!"
          },
          {
            letter: "B",
            text: "Porque sempre que x.esquerda.max ≥ i.baixo, é 100% garantido que existe um intervalo na subárvore esquerda de x que se sobrepõe a i.",
            isCorrect: false,
            explanation:
              "Cuidado com essa armadilha! Como mostra a Figura 14.5(b) do CLRS, pode acontecer de x.esquerda.max ≥ i.baixo e AINDA ASSIM nenhum intervalo da subárvore esquerda se sobrepor a i (quando o intervalo i está inteiramente à esquerda de i', isto é, i.alto < i'.baixo)! O que o Teorema 14.2 prova é que, NESSE caso, tampouco pode existir qualquer sobreposição na subárvore direita!"
          },
          {
            letter: "C",
            text: "Porque as árvores de intervalos são ordenadas pelos pontos extremos altos (x.int.alto), logo todos os intervalos na subárvore direita têm ponto alto menor que x.esquerda.max.",
            isCorrect: false,
            explanation:
              "Incorreta. As árvores de intervalos são ordenadas pelos pontos extremos BAIXOS (x.chave = x.int.baixo)."
          },
          {
            letter: "D",
            text: "Se a busca na subárvore esquerda terminar em T.nil, INTERVAL-SEARCH faz backtracking e passa a buscar na subárvore direita de x, levando O(n) no pior caso.",
            isCorrect: false,
            explanation:
              "Incorreta! INTERVAL-SEARCH é um simples laço while sem nenhum backtracking: ele desce um único caminho simples da raiz até uma folha em tempo O(lg n) no pior caso."
          }
        ]
      }
    ],

    /* ======================================================================
       SEÇÃO 4: EXERCÍCIOS E PROBLEMAS CANÔNICOS RESOLVIDOS (8 EXERCÍCIOS)
       ====================================================================== */
    exercicios: [
      {
        id: "ex8-1",
        code: "EXERCÍCIO 01 • PROPRIEDADE DE ABB VS. PROPRIEDADE DE HEAP DE MÍNIMO",
        reference: "Exercício 12.1-2 (p. 245)",
        title: "Diferença Entre ABB e Heap de Mínimo e Impossibilidade de Impressão Ordenada em O(n)",
        prompt: `
          <p><strong>(Exercício 12.1-2)</strong> Qual é a diferença entre a propriedade de árvore de busca binária e a propriedade de heap de mínimo (veja p. 132)? A propriedade de heap de mínimo pode ser usada para imprimir as chaves de uma árvore de $n$ nós em sequência ordenada no tempo $O(n)$? Justifique rigorosamente sua resposta.</p>
        `,
        placeholder:
          "Compare a restrição esquerda ≤ x ≤ direita da ABB com a restrição pai ≤ filhos do heap de mínimo e use o limite inferior Ω(n lg n) da ordenação por comparações...",
        solution: `
          <h4>1. Diferença Estrutural Entre a Propriedade de ABB e a Propriedade de Heap de Mínimo</h4>
          <ul>
            <li><strong>Propriedade de Árvore de Busca Binária (Total / Horizontal entre subárvores):</strong> Para qualquer nó $x$, toda chave $y.\\text{chave}$ na <strong>subárvore esquerda</strong> de $x$ satisfaz $y.\\text{chave} \\le x.\\text{chave}$, e toda chave $y.\\text{chave}$ na <strong>subárvore direita</strong> de $x$ satisfaz $y.\\text{chave} \\ge x.\\text{chave}$. Isso impõe uma separação total entre os elementos à esquerda de $x$ e os elementos à direita de $x$.</li>
            <li><strong>Propriedade de Heap de Mínimo (Parcial / Vertical pai-filho):</strong> Para todo nó $x$ diferente da raiz, $x.p.\\text{chave} \\le x.\\text{chave}$ (a chave de um nó é maior ou igual à chave de seu pai). Portanto, ambos os filhos (esquerdo e direito) são $\\ge x.\\text{chave}$, e <strong>não há nenhuma relação de ordem entre a subárvore esquerda e a subárvore direita</strong> de $x$!</li>
          </ul>

          <h4>2. Por Que a Propriedade de Heap de Mínimo NÃO Permite Imprimir em Ordem em Tempo $O(n)$</h4>
          <p><strong>Prova por Contradição via Limite Inferior de Ordenação (Teorema 8.1):</strong></p>
          <p>Suponha, por absurdo, que existisse um algoritmo baseado em comparações capaz de receber um heap de mínimo de $n$ elementos e imprimir suas chaves em sequência ordenada em tempo $O(n)$. Então poderíamos ordenar qualquer arranjo arbitrário $A[1 \\dots n]$ no modelo de comparações em tempo total $O(n)$ executando dois passos:</p>
          <ol>
            <li>Chamar <code>BUILD-MIN-HEAP(A)</code> para converter $A$ em um heap de mínimo no tempo <strong>$O(n)$</strong> (Seção 6.3);</li>
            <li>Executar o suposto algoritmo de impressão ordenada do heap no tempo <strong>$O(n)$</strong>.</li>
          </ol>
          <p>Isso produziria um algoritmo de ordenação por comparações de pior caso $O(n) + O(n) = O(n)$, o que <strong>contradiz o limite inferior fundamental $\\Omega(n \\lg n)$</strong> (Teorema 8.1, Capítulo 8) para qualquer ordenação baseada em comparações! Portanto, é impossível imprimir as chaves de um heap de mínimo em ordem em tempo $O(n)$. $\\blacksquare$</p>
        `
      },
      {
        id: "ex8-2",
        code: "EXERCÍCIO 02 • PROPRIEDADE DOS FILHOS DO SUCESSOR E PREDECESSOR",
        reference: "Exercício 12.2-5 (p. 250)",
        title: "Prova de que o Sucessor de um Nó com Dois Filhos Não Tem Filho Esquerdo",
        prompt: `
          <p><strong>(Exercício 12.2-5)</strong> Mostre que, se um nó em uma árvore de busca binária tem dois filhos, então seu sucessor não tem nenhum filho à esquerda e seu predecessor não tem nenhum filho à direita.</p>
        `,
        placeholder:
          "Suponha por contradição que o sucessor y de um nó x (com dois filhos) possua um filho à esquerda z e mostre que x.chave < z.chave < y.chave...",
        solution: `
          <h4>Demonstração Formal por Contradição</h4>
          <p>Seja $x$ um nó em uma árvore de busca binária que possui dois filhos ($x.\\text{esquerda} \\neq \\text{NIL}$ e $x.\\text{direita} \\neq \\text{NIL}$).</p>
          <ol>
            <li><strong>Prova para o Sucessor $y$:</strong>
              <ul>
                <li>Como a subárvore direita de $x$ é não vazia ($x.\\text{direita} \\neq \\text{NIL}$), o sucessor $y$ de $x$ no percurso em in-ordem é o primeiro nó visitado na subárvore direita de $x$, isto é, $y = \\text{TREE-MINIMUM}(x.\\text{direita})$.</li>
                <li>Suponha, por contradição, que $y$ possua um filho à esquerda $z = y.\\text{esquerda} \\neq \\text{NIL}$.</li>
                <li>Como $y$ está na subárvore direita de $x$, seu filho $z$ também pertence à subárvore direita de $x$. Logo, em um percurso em in-ordem, $z$ é visitado <em>depois</em> de $x$ e <em>antes</em> de $y$ (pois a subárvore esquerda de $y$ é percorrida antes de imprimir $y$).</li>
                <li>Isso contradiz o fato de que $y$ é o sucessor imediato de $x$ no percurso em in-ordem (ou, no caso de chaves distintas, teríamos $x.\\text{chave} < z.\\text{chave} < y.\\text{chave}$, contradizendo que $y$ tem a menor chave na subárvore direita de $x$)! Portanto, <strong>$y.\\text{esquerda} == \\text{NIL}$</strong>.</li>
              </ul>
            </li>
            <li><strong>Prova Simétrica para o Predecessor $p$:</strong>
              <ul>
                <li>Como $x.\\text{esquerda} \\neq \\text{NIL}$, o predecessor $p$ de $x$ é o último nó visitado na subárvore esquerda de $x$ ($p = \\text{TREE-MAXIMUM}(x.\\text{esquerda})$). Se $p$ tivesse um filho à direita $w = p.\\text{direita} \\neq \\text{NIL}$, então $w$ ainda estaria na subárvore esquerda de $x$ e seria visitado no percurso em in-ordem <em>depois</em> de $p$ e <em>antes</em> de $x$, contradizendo que $p$ é o predecessor imediato de $x$. Logo, <strong>$p.\\text{direita} == \\text{NIL}$</strong>. $\\blacksquare$</li>
              </ul>
            </li>
          </ol>
        `
      },
      {
        id: "ex8-3",
        code: "EXERCÍCIO 03 • ORDENAÇÃO VIA TREE-INSERT + INORDER-TREE-WALK",
        reference: "Exercício 12.3-3 (pp. 254–255)",
        title: "Tempos de Pior Caso Θ(n²), Melhor Caso Θ(n lg n) e Paralelo com Quicksort",
        prompt: `
          <p><strong>(Exercício 12.3-3)</strong> Podemos ordenar um dado conjunto de $n$ números construindo primeiro uma árvore de busca binária contendo esses números (usando <code>TREE-INSERT</code> repetidamente para inserir os números um a um) e então imprimindo os números por um percurso de árvore em in-ordem (<code>INORDER-TREE-WALK</code>). Quais são os tempos de execução do <strong>pior caso</strong> e do <strong>melhor caso</strong> (bem como do caso médio) para esse algoritmo de ordenação?</p>
        `,
        placeholder:
          "Analise o custo das n chamadas de TREE-INSERT quando a árvore é uma cadeia linear vs. quando é balanceada, e some o Θ(n) de INORDER-TREE-WALK...",
        solution: `
          <h4>1. Análise do Melhor Caso: $\\mathbf{\\Theta(n \\lg n)}$</h4>
          <ul>
            <li>Pelo Teorema 12.1, a fase final <code>INORDER-TREE-WALK(T.raiz)</code> leva sempre tempo $\\Theta(n)$, independentemente do formato da árvore.</li>
            <li>No melhor caso (por exemplo, quando a sequência de inserção preenche a árvore nível a nível como uma árvore binária completa), cada $i$-ésima chamada de <code>TREE-INSERT</code> desce por uma árvore de altura $\\lfloor \\lg i \\rfloor$, levando tempo $\\Theta(\\lg i)$. Somando para $i = 1 \\dots n$:
              $$T_{\\text{melhor}}(n) = \\sum_{i=1}^{n} \\Theta(\\lg i) + \\Theta(n) = \\Theta(n \\lg n) + \\Theta(n) = \\mathbf{\\Theta(n \\lg n)}.$$
              (Além disso, pelo Exercício 12.1-5, como se trata de uma ordenação baseada em comparações capaz de ordenar qualquer permutação, mesmo o melhor caso de construção geral para produzir uma árvore de altura mínima $\\Theta(\\lg n)$ requer $\\Omega(n \\lg n)$.)</li>
          </ul>

          <h4>2. Análise do Pior Caso: $\\mathbf{\\Theta(n^2)}$</h4>
          <ul>
            <li>O pior caso ocorre quando os $n$ números são inseridos em ordem estritamente crescente (ou estritamente decrescente). Nesse caso, a árvore degenera em uma cadeia linear de altura $n - 1$, onde a $i$-ésima inserção precisa percorrer todos os $i - 1$ nós anteriores, gastando $\\Theta(i)$:
              $$T_{\\text{pior}}(n) = \\sum_{i=1}^{n} \\Theta(i) + \\Theta(n) = \\Theta(n^2) + \\Theta(n) = \\mathbf{\\Theta(n^2)}.$$</li>
          </ul>

          <h4>3. Observação Extra — Paralelo Exato com o <code>QUICKSORT</code> no Caso Médio: $\\mathbf{\\Theta(n \\lg n)}$</h4>
          <p>Para uma permutação aleatória de $n$ chaves distintas, as comparações feitas durante as $n$ chamadas de <code>TREE-INSERT</code> são <strong>exatamente as mesmas comparações</strong> feitas por <code>QUICKSORT</code> quando escolhe os mesmos pivôs (a 1ª chave inserida é a raiz da ABB e é comparada com todas as demais $n - 1$ chaves, exatamente como o 1º pivô do Quicksort!), resultando em tempo esperado $\\mathbf{\\Theta(n \\lg n)}$.</p>
        `
      },
      {
        id: "ex8-4",
        code: "EXERCÍCIO 04 • EQUILÍBRIO DE CAMINHOS EM ÁRVORES VERMELHO-PRETO",
        reference: "Exercício 13.1-5 (p. 265)",
        title: "Prova de que o Caminho Mais Longo é no Máximo o Dobro do Caminho Mais Curto",
        prompt: `
          <p><strong>(Exercício 13.1-5)</strong> Mostre que o comprimento do mais longo caminho simples de um nó $x$ em uma árvore vermelho-preto até uma folha descendente é, no máximo, duas vezes o do caminho simples mais curto do nó $x$ até uma folha descendente.</p>
        `,
        placeholder:
          "Relacione o comprimento do caminho mais curto p_min e do caminho mais longo p_max com a altura preta bh(x) usando as Propriedades 4 e 5...",
        solution: `
          <h4>Demonstração Direta pelas Propriedades 4 e 5</h4>
          <p>Seja $x$ um nó arbitrário em uma árvore vermelho-preto e seja $b = \\text{bh}(x)$ a sua altura preta.</p>
          <ol>
            <li><strong>Limite Inferior para o Caminho Simples Mais Curto ($p_{\\min}$):</strong>
              <p>Pela <strong>Propriedade 5</strong>, todo caminho simples de $x$ até uma folha descendente (<code>T.nil</code>) contém exatamente $b = \\text{bh}(x)$ nós pretos (não contando o próprio $x$). Como qualquer caminho simples contém pelo menos seus nós pretos (e no mínimo $0$ nós vermelhos), o comprimento (número de arestas, que é igual ao número de nós no caminho excluindo $x$) do caminho simples mais curto $p_{\\min}$ de $x$ até uma folha descendente satisfaz:</p>
              $$\\mathbf{p_{\\min} \\ge \\text{bh}(x)}.$$
            </li>
            <li><strong>Limite Superior para o Caminho Simples Mais Longo ($p_{\\max}$):</strong>
              <p>Pela <strong>Propriedade 4</strong>, um nó vermelho nunca pode ter um filho vermelho (ou seja, não existem dois nós vermelhos consecutivos em nenhum caminho simples), e pela <strong>Propriedade 3</strong> toda folha <code>T.nil</code> é preta. Assim, em qualquer caminho simples de $x$ até uma folha descendente, cada nó vermelho (exceto possivelmente o próprio $x$, que não é contado nas arestas abaixo dele) deve ser imediatamente seguido por um nó preto distinto no caminho. Portanto, o número de nós vermelhos entre os descendentes de $x$ no caminho não pode exceder o número de nós pretos $\\text{bh}(x)$. Logo, o comprimento do caminho simples mais longo $p_{\\max}$ de $x$ até uma folha descendente contém no máximo $\\text{bh}(x)$ nós pretos e no máximo $\\text{bh}(x)$ nós vermelhos:</p>
              $$\\mathbf{p_{\\max} \\le 2 \\cdot \\text{bh}(x)}.$$
            </li>
            <li><strong>Conclusão:</strong> Combinando as duas desigualdades:
              $$p_{\\max} \\le 2 \\cdot \\text{bh}(x) \\le 2 \\cdot p_{\\min}. \\quad \\blacksquare$$
            </li>
          </ol>
        `
      },
      {
        id: "ex8-5",
        code: "EXERCÍCIO 05 • INSERÇÃO PASSO A PASSO EM ÁRVORE VERMELHO-PRETO",
        reference: "Exercício 13.3-2 (p. 275)",
        title: "Rastreamento Completo de RB-INSERT para ⟨41, 38, 31, 12, 19, 8⟩",
        prompt: `
          <p><strong>(Exercício 13.3-2)</strong> Mostre as árvores vermelho-preto que resultam após a inserção sucessiva das chaves $41, 38, 31, 12, 19, 8$ em uma árvore vermelho-preto inicialmente vazia, indicando qual caso de <code>RB-INSERT-FIXUP</code> (Caso 1, Caso 2 ou Caso 3) é acionado em cada passo.</p>
        `,
        placeholder:
          "Rastreie cada uma das 6 inserções, indicando a cor (P ou V), quem é o pai z.p, o tio y e o avô z.p.p, e quais rotações ocorrem...",
        solution: `
          <h4>Rastreamento Completo das 6 Inserções (Notação: <code>[chave:P]</code> = Preto, <code>(chave:V)</code> = Vermelho)</h4>
          <ol>
            <li><strong>Inserir <code>41</code>:</strong> Inserido como raiz <code>(41:V)</code>; a linha 16 de <code>RB-INSERT-FIXUP</code> pinta a raiz de preto:
              <br><code>Raiz: [41:P]</code>.</li>
            <li><strong>Inserir <code>38</code>:</strong> Inserido como filho esquerdo de 41: <code>(38:V)</code>. Como $z.p = \\text{[41:P]}$ é preto, o laço <code>while</code> não executa:
              <br><code>[41:P]</code> com filho esquerdo <code>(38:V)</code>.</li>
            <li><strong>Inserir <code>31</code>:</strong> Inserido como filho esquerdo de 38: <code>[41:P] → (38:V) → (31:V)</code>.
              <ul>
                <li>Violação: $z = 31$ (V) e $z.p = 38$ (V). O tio $y = 41.\\text{direita} = T.\\text{nil}$ é <strong>PRETO</strong> e $z = 31$ é <strong>filho esquerdo</strong> de 38 $\\implies$ <strong>CASO 3</strong>!</li>
                <li>Pintamos $38$ de <code>PRETO</code>, $41$ de <code>VERMELHO</code> e aplicamos <code>RIGHT-ROTATE(T, 41)</code>:
                  <br><strong>Árvore:</strong> Raiz <code>[38:P]</code>, filho esquerdo <code>(31:V)</code>, filho direito <code>(41:V)</code>.</li>
              </ul>
            </li>
            <li><strong>Inserir <code>12</code>:</strong> Inserido como filho esquerdo de 31: <code>(12:V)</code>.
              <ul>
                <li>Violação: $z = 12$ (V) e $z.p = 31$ (V). O tio $y = 41$ é <strong>VERMELHO</strong> $\\implies$ <strong>CASO 1</strong>!</li>
                <li>Pintamos $z.p = 31$ e $y = 41$ de <code>PRETO</code>, o avô $38$ de <code>VERMELHO</code>, subimos $z = 38$ (raiz) e a linha 16 pinta a raiz $38$ de <code>PRETO</code>:
                  <br><strong>Árvore:</strong> Raiz <code>[38:P]</code>, filho esq. <code>[31:P]</code> (com filho esq. <code>(12:V)</code>), filho dir. <code>[41:P]</code>.</li>
              </ul>
            </li>
            <li><strong>Inserir <code>19</code>:</strong> Inserido como filho direito de 12: <code>(19:V)</code>.
              <ul>
                <li>Violação: $z = 19$ (V) e $z.p = 12$ (V). O tio $y = 31.\\text{direita} = T.\\text{nil}$ é <strong>PRETO</strong> e $z = 19$ é <strong>filho direito</strong> de 12 $\\implies$ <strong>CASO 2</strong> seguido do <strong>CASO 3</strong>!</li>
                <li><strong>Caso 2:</strong> $z = 12$ e <code>LEFT-ROTATE(T, 12)</code> faz <code>(19:V)</code> virar filho esquerdo de <code>[31:P]</code> e pai de <code>(12:V)</code>.</li>
                <li><strong>Caso 3:</strong> Pintamos $19$ de <code>PRETO</code>, o avô $31$ de <code>VERMELHO</code> e aplicamos <code>RIGHT-ROTATE(T, 31)</code>:
                  <br><strong>Árvore:</strong> Raiz <code>[38:P]</code> (filho dir. <code>[41:P]</code>); na esquerda da raiz está <code>[19:P]</code> com filhos <code>(12:V)</code> e <code>(31:V)</code>.</li>
              </ul>
            </li>
            <li><strong>Inserir <code>8</code>:</strong> Inserido como filho esquerdo de 12: <code>(8:V)</code>.
              <ul>
                <li>Violação: $z = 8$ (V) e $z.p = 12$ (V). O tio $y = 31$ é <strong>VERMELHO</strong> $\\implies$ <strong>CASO 1</strong>!</li>
                <li>Pintamos $12$ e $31$ de <code>PRETO</code> e o avô $19$ de <code>VERMELHO</code>, subindo $z = 19$. Como o pai de $19$ é a raiz <code>[38:P]</code> (preta), o laço termina!
                  <br><strong>Árvore Final:</strong> Raiz <code>[38:P]</code>; filho direito <code>[41:P]</code>; filho esquerdo <code>(19:V)</code>, que tem filho esquerdo <code>[12:P]</code> (com filho esquerdo <code>(8:V)</code>) e filho direito <code>[31:P]</code>. $\\blacksquare$</li>
              </ul>
            </li>
          </ol>
        `
      },
      {
        id: "ex8-6",
        code: "EXERCÍCIO 06 • CONTAGEM DE INVERSÕES EM O(n lg n) COM OS-RANK",
        reference: "Exercício 14.1-7 (p. 290)",
        title: "Usando uma Árvore de Estatísticas de Ordem para Contar Inversões em O(n lg n)",
        prompt: `
          <p><strong>(Exercício 14.1-7)</strong> Mostre como usar uma árvore de estatísticas de ordem para contar o número de <strong>inversões</strong> (veja o Problema 2-4, Módulo 1: pares de índices $i < j$ tais que $A[i] > A[j]$) em um arranjo de tamanho $n$ no tempo $O(n \\lg n)$.</p>
        `,
        placeholder:
          "Insira os elementos A[1], A[2], ..., A[n] um a um na árvore de estatísticas de ordem T e use OS-RANK(T, z_j) para determinar quantos elementos já inseridos são maiores que A[j]...",
        solution: `
          <h4>1. Ideia Central do Algoritmo</h4>
          <p>Para cada índice $j = 1, 2, \\dots, n$, o número de inversões da forma $(i, j)$ cujo segundo elemento é $A[j]$ é exatamente a quantidade de elementos já processados $A[1 \\dots j - 1]$ que são <strong>estritamente maiores que $A[j]$</strong>.</p>
          <p>Se inserirmos os elementos $A[1], A[2], \\dots, A[n]$ sequencialmente em uma Árvore de Estatísticas de Ordem $T$ inicialmente vazia, imediatamente após inserir o $j$-ésimo elemento $z_j$ (com $z_j.\\text{chave} = A[j]$), a árvore $T$ contém exatamente os $j$ elementos $A[1 \\dots j]$:</p>
          <ul>
            <li>Chamando $r_j = \\text{OS-RANK}(T, z_j)$ (e garantindo na inserção que chaves iguais a $A[j]$ fiquem à direita das chaves iguais já existentes, de modo que $r_j$ conte todos os elementos em $A[1 \\dots j]$ que são $\\le A[j]$), sabemos que exatamente $r_j$ elementos dentre $A[1 \\dots j]$ são $\\le A[j]$.</li>
            <li>Portanto, o número de elementos em $A[1 \\dots j - 1]$ que são <strong>estritamente maiores que $A[j]$</strong> é exatamente:
              $$\\mathbf{\\text{inversões terminando em } j = j - r_j = j - \\text{OS-RANK}(T, z_j)}!$$</li>
          </ul>

          <h4>2. Pseudocódigo Completo em $O(n \\lg n)$</h4>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">COUNT-INVERSIONS-OST(A, n)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">inicialize uma Árvore de Estatísticas de Ordem vazia T</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">total-inversoes = 0</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">for</span> j = 1 <span class="kw">to</span> n</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    crie o nó z com z.chave = A[j]</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    OS-INSERT(T, z) <span class="cmt">// O(lg j)</span></span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">    r = OS-RANK(T, z) <span class="cmt">// O(lg j)</span></span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    total-inversoes = total-inversoes + (j - r)</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content"><span class="kw">return</span> total-inversoes</span></div>
            </div>
          </div>

          <p><strong>Análise de Complexidade:</strong> Cada uma das $n$ iterações executa uma chamada a <code>OS-INSERT</code> em $O(\\lg j)$ e uma chamada a <code>OS-RANK</code> em $O(\\lg j)$. Logo, o tempo total é $\\sum_{j=1}^{n} O(\\lg j) = \\mathbf{O(n \\lg n)}$. $\\blacksquare$</p>
        `
      },
      {
        id: "ex8-7",
        code: "EXERCÍCIO 07 • SUCESSOR E PREDECESSOR EM O(1) POR COSTURA DE PONTEIROS",
        reference: "Exercício 14.2-1 (p. 292)",
        title: "Aumentando uma Árvore Vermelho-Preto com Ponteiros pred e suc em O(1)",
        prompt: `
          <p><strong>(Exercício 14.2-1)</strong> Explique como os atributos de ponteiros $x.\\text{pred}$ (predecessor) e $x.\\text{suc}$ (sucessor) podem ser mantidos em cada nó $x$ de uma árvore vermelho-preto aumentada, de modo que <code>MINIMUM</code>, <code>MAXIMUM</code>, <code>SUCCESSOR</code> e <code>PREDECESSOR</code> funcionem todos no tempo <strong>$O(1)$</strong> no pior caso, sem afetar o desempenho assintótico $O(\\lg n)$ das operações <code>INSERT</code>, <code>DELETE</code> e <code>SEARCH</code>.</p>
        `,
        placeholder:
          "Explique por que rotações e mudanças de cor NÃO alteram a ordem in-ordem (logo pred e suc não mudam em rotações!) e mostre como atualizar a lista duplamente ligada na inserção e remoção...",
        solution: `
          <h4>1. Por Que Rotações NÃO Afetam $x.\\text{pred}$ nem $x.\\text{suc}$!</h4>
          <p>Observemos que os ponteiros $x.\\text{pred}$ e $x.\\text{suc}$ formam uma <strong>lista duplamente ligada ordenada</strong> embutida sobre os nós da árvore vermelho-preto (onde também podemos manter $T.\\text{min}$ e $T.\\text{max}$ apontando para o primeiro e o último nó da lista, respondendo <code>MINIMUM</code>, <code>MAXIMUM</code>, <code>SUCCESSOR(x)</code> e <code>PREDECESSOR(x)</code> em tempo estritamente <strong>$O(1)$</strong>!).</p>
          <p>A propriedade fundamental que viabiliza essa manutenção em $O(\\lg n)$ é que <strong>as rotações (<code>LEFT-ROTATE</code> e <code>RIGHT-ROTATE</code>) e as recolorações preservam a sequência do percurso em in-ordem da árvore</strong>! Portanto, durante <code>RB-INSERT-FIXUP</code> e <code>RB-DELETE-FIXUP</code>, <strong>nenhum ponteiro <code>pred</code> ou <code>suc</code> precisa ser alterado em uma rotação</strong>!</p>

          <h4>2. Atualização de <code>pred</code> e <code>suc</code> em <code>RB-INSERT(T, z)</code> e <code>RB-DELETE(T, z)</code></h4>
          <ul>
            <li><strong>Na Inserção (<code>RB-INSERT(T, z)</code>):</strong>
              <p>Após anexar o novo nó folha $z$ como filho de $y$ em $O(\\lg n)$:</p>
              <ul>
                <li>Se $z$ foi inserido como <strong>filho esquerdo</strong> de $y$, então na ordem in-ordem $z$ fica imediatamente antes de $y$: logo $z.\\text{suc} = y$ e $z.\\text{pred} = y.\\text{pred}$ (que já estava salvo em $y$ em $O(1)$!). Em seguida, religamos a lista duplamente encadeada em $O(1)$: $y.\\text{pred} = z$ e, se $z.\\text{pred} \\neq T.\\text{nil}$, fazemos $z.\\text{pred}.\\text{suc} = z$ (caso contrário, atualizamos $T.\\text{min} = z$).</li>
                <li>Simetricamente, se $z$ foi inserido como <strong>filho direito</strong> de $y$, então $z$ fica imediatamente depois de $y$: $z.\\text{pred} = y$, $z.\\text{suc} = y.\\text{suc}$, $y.\\text{suc} = z$ e, se $z.\\text{suc} \\neq T.\\text{nil}$, $z.\\text{suc}.\\text{pred} = z$ (caso contrário, $T.\\text{max} = z$). Tudo em tempo <strong>$O(1)$</strong> adicional!</li>
              </ul>
            </li>
            <li><strong>Na Remoção (<code>RB-DELETE(T, z)</code>):</strong>
              <p>Antes de remover $z$, já temos em mãos $z.\\text{pred}$ e $z.\\text{suc}$ em tempo $O(1)$! (Inclusive, na linha 9 de <code>RB-DELETE</code>, quando $z$ tem dois filhos, podemos obter $y = z.\\text{suc}$ diretamente em $O(1)$ sem sequer chamar <code>TREE-MINIMUM(z.direita)</code>!) Basta remover $z$ da lista duplamente ligada em $O(1)$:</p>
              <ul>
                <li>Se $z.\\text{pred} \\neq T.\\text{nil}$, $z.\\text{pred}.\\text{suc} = z.\\text{suc}$ (senão $T.\\text{min} = z.\\text{suc}$);</li>
                <li>Se $z.\\text{suc} \\neq T.\\text{nil}$, $z.\\text{suc}.\\text{pred} = z.\\text{pred}$ (senão $T.\\text{max} = z.\\text{pred}$). $\\blacksquare$</li>
              </ul>
            </li>
          </ul>
        `
      },
      {
        id: "ex8-8",
        code: "EXERCÍCIO 08 • PROBLEMA 14-1: PONTO DE SOBREPOSIÇÃO MÁXIMA (POM)",
        reference: "Problema 14-1 (p. 298)",
        title: "Projetando uma Árvore Vermelho-Preto Aumentada para Encontrar o Ponto de Sobreposição Máxima em O(1)",
        prompt: `
          <p>No <strong>Problema 14-1 (Ponto de sobreposição máxima)</strong>, desejamos manter um conjunto dinâmico de intervalos fechados e consultar rapidamente um <strong>ponto de sobreposição máxima (POM)</strong> — um ponto na reta real que tenha o maior número de intervalos no banco de dados que se sobreponham a ele:</p>
          <ol>
            <li><strong>(a)</strong> Mostre que sempre existirá um ponto de sobreposição máxima que é uma extremidade de um dos segmentos.</li>
            <li><strong>(b)</strong> Projete uma estrutura de dados que suporte <code>INTERVAL-INSERT</code> e <code>INTERVAL-DELETE</code> em $O(\\lg n)$ e <code>FIND-POM</code> em $O(1)$ usando o Teorema 14.1.</li>
          </ol>
        `,
        placeholder:
          "Prove (a) deslizando um ponto arbitrário até a primeira extremidade à esquerda, e em (b) associe p = +1 às extremidades esquerdas e p = -1 às direitas, mantendo soma v, soma máxima de prefixo m e ponto ótimo o em cada nó...",
        solution: `
          <h4>(a) Prova de que Sempre Existe um POM que é uma Extremidade de Intervalo</h4>
          <p>Seja $x_0 \\in \\mathbb{R}$ um ponto qualquer de sobreposição máxima, coberto por um subconjunto $S$ de $k$ intervalos ($k$ máximo). Como $x_0$ pertence a todos os intervalos $[a_j, b_j] \\in S$, temos $a_j \\le x_0 \\le b_j$ para todo $[a_j, b_j] \\in S$. Seja $a^* = \\max_{[a_j, b_j] \\in S} a_j$ a maior extremidade esquerda dentre os intervalos de $S$. Então $a_j \\le a^* \\le x_0 \\le b_j$ para todo $[a_j, b_j] \\in S$, o que significa que a extremidade $a^*$ também está contida em todos os $k$ intervalos de $S$! Logo, $a^*$ é uma extremidade de segmento e também é um ponto de sobreposição máxima. $\\blacksquare$</p>

          <h4>(b) Estrutura de Dados Aumentada via Teorema 14.1</h4>
          <p>Seguindo a sugestão do CLRS, mantemos uma árvore vermelho-preto $T$ contendo as <strong>$2n$ extremidades</strong> de todos os $n$ intervalos ativos:</p>
          <ul>
            <li>Para cada intervalo $[a, b]$, inserimos dois nós na árvore: a extremidade esquerda $a$ com peso <strong>$x.p = +1$</strong> e a extremidade direita $b$ com peso <strong>$x.p = -1$</strong>. (Em caso de empate na coordenada de chave, ordenamos os pontos com $p = +1$ <em>antes</em> dos pontos com $p = -1$, pois os intervalos são fechados!)</li>
            <li>Se listarmos os nós da árvore em ordem simétrica $e_1, e_2, \\dots, e_{2n}$, o número de intervalos que cobrem o ponto $e_i$ é exatamente a <strong>soma de prefixo</strong> $\\sum_{j=1}^{i} e_j.p$. Assim, encontrar o POM equivale a encontrar o índice $i$ que maximiza a soma de prefixo na árvore!</li>
            <li><strong>Atributos Aumentados em Cada Nó $x$ (calculáveis em $O(1)$ a partir de $x.\\text{esquerda}$ e $x.\\text{direita}$):</strong>
              <ol>
                <li><strong>$x.v$ (soma total dos pesos na subárvore de $x$):</strong> Com $T.\\text{nil}.v = 0$, temos:
                  $$x.v = x.\\text{esquerda}.v + x.p + x.\\text{direita}.v.$$</li>
                <li><strong>$x.m$ (valor máximo da soma de prefixo dentro da subárvore de $x$):</strong> Com $T.\\text{nil}.m = 0$ (ou $-\\infty$), a maior soma de prefixo na subárvore de $x$ ocorre ou (i) na subárvore esquerda, ou (ii) terminando exatamente no nó $x$, ou (iii) na subárvore direita:
                  $$\\mathbf{x.m = \\max\\bigl(x.\\text{esquerda}.m,\\;\\; x.\\text{esquerda}.v + x.p,\\;\\; x.\\text{esquerda}.v + x.p + x.\\text{direita}.m\\bigr)}.$$</li>
                <li><strong>$x.o$ (o ponto extremo que atinge a soma máxima $x.m$ na subárvore de $x$):</strong>
                  <ul>
                    <li>Se $x.m == x.\\text{esquerda}.m$, então $x.o = x.\\text{esquerda}.o$;</li>
                    <li>Senão, se $x.m == x.\\text{esquerda}.v + x.p$, então $x.o = x.\\text{chave}$;</li>
                    <li>Caso contrário, $x.o = x.\\text{direita}.o$.</li>
                  </ul>
                </li>
              </ol>
            </li>
          </ul>
          <p><strong>Complexidade Final:</strong> Como $x.v$, $x.m$ e $x.o$ dependem exclusivamente de $x$, $x.\\text{esquerda}$ e $x.\\text{direita}$ e são calculados em $O(1)$, o <strong>Teorema 14.1</strong> garante que <code>INTERVAL-INSERT</code> (2 inserções em $T$) e <code>INTERVAL-DELETE</code> (2 remoções em $T$) executam em tempo <strong>$O(\\lg n)$</strong>, enquanto <code>FIND-POM(T)</code> simplesmente retorna <strong>$T.\\text{raiz}.o$ em tempo $O(1)$</strong>! $\\blacksquare$</p>
        `
      }
    ]
  };

  if (typeof window !== "undefined" && typeof window.registerCodexModule === "function") {
    window.registerCodexModule(8, module8Content);
  }
})();
