/* ==========================================================================
   CODEX — MÓDULO 09: PROGRAMAÇÃO DINÂMICA, ALGORITMOS GULOSOS E ANÁLISE AMORTIZADA
   Capítulos 15, 16 e 17 (pp. 300–397)
   Obra: Algoritmos: Teoria e Prática (3ª Edição) — Cormen, Leiserson, Rivest e Stein
   ========================================================================== */

(function () {
  const revisao = {
    subtitle:
      "Da Superposição de Subproblemas na Programação Dinâmica à Propriedade da Escolha Gulosa, Teoria dos Matroides e Garantias Determinísticas de Custo Amortizado",
    intro:
      "Com o Módulo 09 inauguramos a Parte IV (Técnicas Avançadas de Projeto e Análise, Capítulos 15, 16 e 17, pp. 300–397). Enquanto nos Módulos 01 a 03 estudamos o paradigma de Divisão e Conquista — no qual o problema é particionado em subproblemas disjuntos —, muitos problemas de otimização combinatória geram subproblemas que compartilham sub-subproblemas idênticos. O Capítulo 15 apresenta a Programação Dinâmica (PD), que resolve cada subproblema distinto apenas uma vez e armazena sua resposta em uma tabela, convertendo algoritmos exponenciais em polinomiais. O Capítulo 16 demonstra que, para uma classe importante de problemas (incluindo Seleção de Atividades, Códigos de Huffman e Matroides Ponderados), não é sequer necessário avaliar todas as escolhas: a melhor decisão localmente ótima no momento (Escolha Gulosa) conduz diretamente a uma solução globalmente ótima. Por fim, o Capítulo 17 introduz a Análise Amortizada (pelos métodos Agregado, da Contabilidade e do Potencial), provando limites determinísticos rigorosos para o custo médio de uma sequência de operações no pior caso, sem recorrer a qualquer hipótese probabilística.",
    pillars: [
      {
        tag: "[ PILAR 01 • DIVISÃO E CONQUISTA VS. PROGRAMAÇÃO DINÂMICA ]",
        title: "Quando os Subproblemas se Superpõem: A Permuta Tempo–Memória",
        body: `
          <p>Tanto a <strong>Divisão e Conquista</strong> quanto a <strong>Programação Dinâmica</strong> combinam soluções de subproblemas para resolver um problema maior, mas diferem radicalmente na topologia do grafo de subproblemas (p. 300):</p>
          <ul>
            <li><strong>Divisão e Conquista (Subproblemas Disjuntos):</strong> Em algoritmos como <code>MERGE-SORT</code> ou <code>QUICKSORT</code>, as chamadas recursivas operam sobre subarranjos mutuamente disjuntos. Nenhum subproblema é resolvido duas vezes; a árvore de recursão possui número polinomial de nós.</li>
            <li><strong>Programação Dinâmica (Subproblemas Superpostos):</strong> Em problemas de otimização como o Corte de Hastes (<code>CUT-ROD</code>) ou a Multiplicação de Cadeias de Matrizes, uma implementação recursiva ingênua visita os <em>mesmos</em> subproblemas exponencialmente muitas vezes ($2^n$ chamadas no corte de hastes!). A Programação Dinâmica elimina essa redundância resolvendo cada subproblema distinto <strong>exatamente uma vez</strong> e salvando seu resultado em uma tabela (seja <em>top-down com memoização</em> ou <em>bottom-up tabular</em>).</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 02 • AS 4 ETAPAS DO PROJETO EM PROGRAMAÇÃO DINÂMICA ]",
        title: "O Roteiro Canônico do Capítulo 15 (p. 300)",
        body: `
          <p>Todo desenvolvimento rigoroso de um algoritmo de Programação Dinâmica no CLRS obedece a uma sequência estruturada de <strong>quatro etapas</strong>:</p>
          <ol>
            <li><strong>Caracterizar a estrutura de uma solução ótima:</strong> Demonstrar a propriedade de <em>subestrutura ótima</em> (usando a técnica de prova por contradição de <em>"recortar e colar" / cut-and-paste</em>) e verificar se os subproblemas são independentes.</li>
            <li><strong>Definir recursivamente o valor de uma solução ótima:</strong> Expressar matematicamente o custo/receita ótima em função dos valores ótimos de subproblemas menores (como as recorrências para $r_n$, $m[i,j]$, $c[i,j]$ e $e[i,j]$).</li>
            <li><strong>Calcular o valor de uma solução ótima (geralmente de baixo para cima):</strong> Preencher a tabela em uma ordem topológica válida do grafo de subproblemas, de modo que, ao calcular um estado, todos os subproblemas dos quais ele depende já estejam resolvidos.</li>
            <li><strong>Construir uma solução ótima a partir das informações calculadas:</strong> Manter uma tabela auxiliar de escolhas ($s[j]$, $s[i,j]$, $b[i,j]$ ou $\\text{raiz}[i,j]$) ou rastrear a própria tabela de valores para reconstruir as decisões que atingem o ótimo.</li>
          </ol>
        `
      },
      {
        tag: "[ PILAR 03 • PROGRAMAÇÃO DINÂMICA VS. ALGORITMOS GULOSOS ]",
        title: "Escolher Depois de Resolver Subproblemas vs. Escolher Primeiro Sem Olhar Para Trás",
        body: `
          <p>O Capítulo 16 contrasta diretamente a mecânica decisória da Programação Dinâmica com a da Estratégia Gulosa (pp. 347–353):</p>
          <ul>
            <li><strong>Em Programação Dinâmica:</strong> A escolha em cada etapa depende das soluções dos subproblemas. Por isso, primeiro resolvemos os subproblemas menores (de baixo para cima) e só então comparamos todas as escolhas candidatas para tomar a decisão ótima (ex.: Problema da Mochila 0-1).</li>
            <li><strong>Em Algoritmos Gulosos (Propriedade da Escolha Gulosa):</strong> Fazemos a escolha que parece melhor no momento <em>antes</em> de resolver qualquer subproblema! A decisão gulosa reduz o problema original a <strong>um único subproblema</strong> menor (e não a dois ou mais), permitindo avançar de cima para baixo sem jamais reconsiderar escolhas passadas (ex.: Seleção de Atividades, Mochila Fracionária, Códigos de Huffman e Matroides Ponderados).</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 04 • ANÁLISE DE PIOR CASO INDIVIDUAL VS. ANÁLISE AMORTIZADA ]",
        title: "Garantias Determinísticas Sobre Sequências de Operações Sem Probabilidade",
        body: `
          <p>Em muitas estruturas de dados (como pilhas com <code>MULTIPOP</code>, contadores binários e tabelas dinâmicas), uma operação isolada pode custar $\\Theta(n)$ no pior caso, mas <strong>não pode ocorrer com frequência</strong> porque consome um recurso acumulado lentamente por operações baratas anteriores. O Capítulo 17 (pp. 375–397) formaliza a <strong>Análise Amortizada</strong>:</p>
          <ul>
            <li><strong>Sem Probabilidade:</strong> Diferentemente da análise de caso médio (Cap. 5), a análise amortizada não depende de distribuições de entrada nem de escolhas aleatórias: ela garante o desempenho médio de cada operação <strong>no pior caso de qualquer sequência de $n$ operações</strong>.</li>
            <li><strong>Os Três Métodos Equivalentes:</strong> (1) <em>Análise Agregada</em> (determina $T(n)$ total da sequência e atribui $T(n)/n$ a cada operação); (2) <em>Método da Contabilidade</em> (cobra um custo amortizado $\\hat{c}_i$ por operação e deposita a sobra $\\hat{c}_i - c_i$ como <strong>crédito não negativo</strong> em objetos específicos da estrutura); (3) <em>Método do Potencial</em> (armazena o trabalho pré-pago globalmente em uma função potencial $\\Phi(D_i) \\ge \\Phi(D_0)$ do estado da estrutura, definindo $\\hat{c}_i = c_i + \\Phi(D_i) - \\Phi(D_{i-1})$).</li>
          </ul>
        `
      }
    ],
    checklist: [
      "Sei deduzir a recorrência r_n = max_{1≤i≤n}(p_i + r_{n-i}) do corte de hastes, explicar por que CUT-ROD recursivo ingênuo realiza 2^n chamadas e implementar tanto MEMOIZED-CUT-ROD quanto EXTENDED-BOTTOM-UP-CUT-ROD em Θ(n²).",
      "Domino a recorrência m[i,j] de MATRIX-CHAIN-ORDER em Θ(n³), a recorrência c[i,j] de LCS-LENGTH em Θ(mn) (Teorema 15.1) e a recorrência e[i,j] de OPTIMAL-BST em Θ(n³), além de distinguir subproblemas independentes (Caminho Mais Curto) de dependentes (Caminho Simples Mais Longo).",
      "Compreendo a demonstração do Teorema 16.1 para Seleção de Atividades em Θ(n) (após ordenação), a diferença estrutural entre Mochila 0-1 (PD) e Mochila Fracionária (Gulosa) e a construção da árvore ótima de Huffman em O(n lg n) via Lemas 16.2 e 16.3.",
      "Sei definir formalmente um Matroide M = (S, I) pelas propriedades hereditária e de intercâmbio, reconhecer matroides gráficos/matriciais e aplicar GREEDY(M, w) ao escalonamento de tarefas unitárias com prazos e multas.",
      "Sei aplicar Análise Agregada, Método da Contabilidade e Método do Potencial a MULTIPOP, INCREMENT e Tabelas Dinâmicas, explicando por que a contração da tabela em α < 1/4 (com função potencial de duas ramas) evita o thrashing Θ(n) de contrair em α < 1/2."
    ]
  };

  const unidades = [
    /* ======================================================================
       UNIDADE 9.1 — CAPÍTULO 15, SEÇÕES 15.1 E 15.2 (pp. 300–318)
       ====================================================================== */
    {
      id: "u9-1",
      code: "UNIDADE 9.1 • CAP. 15 (SEÇÕES 15.1 E 15.2)",
      pages: "pp. 300–318",
      title: "15.1 e 15.2 Corte de Hastes (CUT-ROD, Memoização e Bottom-Up) e Multiplicação de Cadeias de Matrizes (MATRIX-CHAIN-ORDER)",
      content: `
        <p>A <strong>programação dinâmica</strong>, assim como o método de divisão e conquista, resolve problemas combinando as soluções de subproblemas. Contudo, aplica-se tipicamente a <strong>problemas de otimização</strong> nos quais podem existir muitas soluções com o valor ótimo (buscamos encontrar <em>uma</em> solução ótima, e não <em>a</em> solução ótima) e nos quais os subproblemas se <strong>superpõem</strong> (isto é, os subproblemas compartilham sub-subproblemas).</p>

        <h3>1. Seção 15.1 — O Problema do Corte de Hastes (pp. 301–309)</h3>
        <p>A empresa Serling Enterprises compra hastes de aço longas e as corta em hastes mais curtas, que então vende. Cada corte é gratuito. Dada uma haste de comprimento $n$ polegadas e uma tabela de preços $p_i$ para $i = 1, 2, \\dots, n$ (Figura 15.1, p. 301), desejamos determinar a <strong>receita máxima $r_n$</strong> que pode ser obtida cortando a haste e vendendo os pedaços:</p>

        <table class="clrs-cost-table">
          <thead>
            <tr>
              <th>Comprimento $i$</th>
              <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Preço $p_i$</strong></td>
              <td>1</td><td>5</td><td>8</td><td>9</td><td>10</td><td>17</td><td>17</td><td>20</td><td>24</td><td>30</td>
            </tr>
            <tr>
              <td><strong>Receita Ótima $r_i$</strong></td>
              <td>1</td><td>5</td><td>8</td><td>10</td><td>13</td><td>17</td><td>18</td><td>22</td><td>25</td><td>30</td>
            </tr>
            <tr>
              <td><strong>1º Corte Ótimo $s[i]$</strong></td>
              <td>1</td><td>2</td><td>3</td><td>2</td><td>2</td><td>6</td><td>1 (ou 6)</td><td>2</td><td>3</td><td>10</td>
            </tr>
          </tbody>
        </table>

        <p>Uma haste de comprimento $n$ pode ser cortada de $2^{n-1}$ maneiras diferentes, pois temos uma opção independente de cortar ou não cortar a cada distância $i \\in \\{1, 2, \\dots, n-1\\}$ da extremidade esquerda. Se uma solução ótima corta a haste em $k$ pedaços de tamanhos $i_1, i_2, \\dots, i_k$ (com $n = i_1 + i_2 + \\dots + i_k$), a receita máxima correspondente é $r_n = p_{i_1} + p_{i_2} + \\dots + p_{i_k}$.</p>

        <h4>Subestrutura Ótima e Recorrência Simplificada</h4>
        <p>Inicialmente, podemos formular $r_n$ escolhendo se não fazemos corte algum ($p_n$) ou se dividimos a haste em duas partes de comprimentos $i$ e $n-i$, otimizando ambas independentemente (Equação 15.1, p. 302):</p>
        $$r_n = \\max(p_n, \\; r_1 + r_{n-1}, \\; r_2 + r_{n-2}, \\; \\dots, \\; r_{n-1} + r_1).$$
        <p>Contudo, há uma maneira mais simples e canônica de estruturar a recursão (Equação 15.2, p. 303): consideramos a haste como consistindo em um <strong>primeiro pedaço</strong> de comprimento $i$ ($1 \\le i \\le n$) cortado da extremidade esquerda — que não sofrerá mais divisões e será vendido por $p_i$ — e uma <strong>parte restante</strong> à direita de comprimento $n - i$, que pode ser cortada otimamente rendendo $r_{n-i}$ (com $r_0 = 0$):</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ EQUAÇÃO 15.2 • RECORRÊNCIA DO CORTE DE HASTES (p. 303) ]</span>
          $$r_n = \\max_{1 \\le i \\le n} (p_i + r_{n-i}), \\quad \\text{com } r_0 = 0.$$
          <p>Nessa formulação, a solução de um problema de tamanho $n$ incorpora a solução de <strong>apenas um subproblema</strong> (o restante de comprimento $n - i$), em vez de dois.</p>
        </div>

        <h4>Por que a Implementação Recursiva Ingênua <code>CUT-ROD</code> é Exponencial $\\Theta(2^n)$?</h4>
        <div class="pseudocode-block">
          <span class="pseudo-title">CUT-ROD(p, n) — Recursivo Ingênuo de Cima para Baixo (p. 303)</span>
<pre>1  se n == 0
2      retorne 0
3  q = -∞
4  para i = 1 até n
5      q = max(q, p[i] + CUT-ROD(p, n - i))
6  retorne q</pre>
        </div>
        <p>Seja $T(n)$ o número total de chamadas feitas a <code>CUT-ROD(p, n)</code>. Na raiz contamos $1$ chamada, e o laço <code>para</code> invoca <code>CUT-ROD(p, n - i)</code> para $i = 1, \\dots, n$ (isto é, para cada subproblema $j = n - i \\in \\{0, 1, \\dots, n-1\\}$), fornecendo a Equação (15.3) (p. 304):</p>
        $$T(n) = 1 + \\sum_{j=0}^{n-1} T(j), \\quad \\text{com } T(0) = 1.$$
        <p>Por indução (Exercício 15.1-1): supondo $T(j) = 2^j$ para $j < n$, temos $T(n) = 1 + \\sum_{j=0}^{n-1} 2^j = 1 + (2^n - 1) = 2^n$ (Equação 15.4). A árvore de recursão possui $2^n$ nós e $2^{n-1}$ folhas — <code>CUT-ROD</code> enumera explicitamente todas as $2^{n-1}$ maneiras de cortar a haste porque resolve repetidamente os mesmos subproblemas!</p>

        <h4>As Duas Abordagens de Programação Dinâmica em $\\Theta(n^2)$ (pp. 304–308)</h4>
        <div class="pseudocode-block">
          <span class="pseudo-title">MEMOIZED-CUT-ROD(p, n) e MEMOIZED-CUT-ROD-AUX(p, n, r) — Top-Down com Memoização (p. 305)</span>
<pre>MEMOIZED-CUT-ROD(p, n)
1  seja r[0 .. n] um novo arranjo
2  para i = 0 até n
3      r[i] = -∞
4  retorne MEMOIZED-CUT-ROD-AUX(p, n, r)

MEMOIZED-CUT-ROD-AUX(p, n, r)
1  se r[n] ≥ 0
2      retorne r[n]
3  se n == 0
4      q = 0
5  senão q = -∞
6      para i = 1 até n
7          q = max(q, p[i] + MEMOIZED-CUT-ROD-AUX(p, n - i, r))
8  r[n] = q
9  retorne q</pre>
        </div>

        <div class="pseudocode-block">
          <span class="pseudo-title">BOTTOM-UP-CUT-ROD(p, n) e EXTENDED-BOTTOM-UP-CUT-ROD(p, n) — Bottom-Up com Reconstrução (pp. 306–308)</span>
<pre>BOTTOM-UP-CUT-ROD(p, n)
1  seja r[0 .. n] um novo arranjo
2  r[0] = 0
3  para j = 1 até n
4      q = -∞
5      para i = 1 até j
6          q = max(q, p[i] + r[j - i])
7      r[j] = q
8  retorne r[n]

EXTENDED-BOTTOM-UP-CUT-ROD(p, n)
1  sejam r[0 .. n] e s[0 .. n] novos arranjos
2  r[0] = 0
3  para j = 1 até n
4      q = -∞
5      para i = 1 até j
6          se q < p[i] + r[j - i]
7              q = p[i] + r[j - i]
8              s[j] = i
9      r[j] = q
10 retorne r e s

PRINT-CUT-ROD-SOLUTION(p, n)
1  (r, s) = EXTENDED-BOTTOM-UP-CUT-ROD(p, n)
2  enquanto n > 0
3      imprima s[n]
4      n = n - s[n]</pre>
        </div>
        <ul>
          <li><strong>Análise de Tempo $\\Theta(n^2)$ e Grafo de Subproblemas:</strong> Tanto <code>BOTTOM-UP-CUT-ROD</code> quanto <code>MEMOIZED-CUT-ROD</code> executam em tempo $\\Theta(n^2)$: o laço interno para um subproblema de tamanho $j$ itera $j$ vezes, totalizando $\\sum_{j=1}^{n} j = \\frac{n(n+1)}{2} = \\Theta(n^2)$. No <strong>grafo de subproblemas</strong> $G = (V, E)$ (Figura 15.4, p. 307), os vértices são os tamanhos $0, 1, \\dots, n$ e há uma aresta orientada $j \\to k$ se calcular $r_j$ requer $r_k$ ($0 \\le k < j$). O tempo de execução da PD é linear no número de vértices mais arestas: $\\Theta(|V| + |E|) = \\Theta(n + n^2) = \\Theta(n^2)$.</li>
        </ul>

        <h3>2. Seção 15.2 — Multiplicação de Cadeias de Matrizes (pp. 309–318)</h3>
        <p>Dada uma sequência (cadeia) $\\langle A_1, A_2, \\dots, A_n \\rangle$ de $n$ matrizes a ser multiplicada, desejamos calcular o produto $A_1 A_2 \\dots A_n$. Como a multiplicação de matrizes é <strong>associativa</strong>, todas as parentizações produzem exatamente a mesma matriz final, mas o <strong>número de multiplicações escalares</strong> varia drasticamente!</p>
        <ul>
          <li><strong>Custo de <code>MATRIX-MULTIPLY(A, B)</code> (p. 310):</strong> Duas matrizes $A$ (dimensão $p \\times q$) e $B$ (dimensão $q \\times r$) são compatíveis se $A.\\text{colunas} = B.\\text{linhas} = q$, e sua multiplicação padrão gera uma matriz $C$ de dimensão $p \\times r$ usando exatamente <strong>$p \\cdot q \\cdot r$ multiplicações escalares</strong>.</li>
          <li><strong>Exemplo Dramático:</strong> Sejam $A_1$ ($10 \\times 100$), $A_2$ ($100 \\times 5$) e $A_3$ ($5 \\times 50$):
            <ul>
              <li>Parentizando como $((A_1 A_2) A_3)$: calculamos $(A_1 A_2)$ ($10 \\times 5$) com $10 \\cdot 100 \\cdot 5 = 5.000$ multiplicações e depois multiplicamos por $A_3$ com $10 \\cdot 5 \\cdot 50 = 2.500$, totalizando <strong>$7.500$ multiplicações escalares</strong>.</li>
              <li>Parentizando como $(A_1 (A_2 A_3))$: calculamos $(A_2 A_3)$ ($100 \\times 50$) com $100 \\cdot 5 \\cdot 50 = 25.000$ multiplicações e depois multiplicamos $A_1$ por $(A_2 A_3)$ com $10 \\cdot 100 \\cdot 50 = 50.000$, totalizando <strong>$75.000$ multiplicações escalares</strong> ($10$ vezes mais lento!).</li>
            </ul>
          </li>
        </ul>

        <h4>Contagem do Número de Parentizações: Números de Catalan (pp. 310–311)</h4>
        <p>Seja $P(n)$ o número de parentizações completas distintas de uma sequência de $n$ matrizes. Quando $n = 1$, $P(1) = 1$. Quando $n \\ge 2$, podemos dividir o produto entre a $k$-ésima e a $(k+1)$-ésima matriz para qualquer $k \\in \\{1, 2, \\dots, n-1\\}$, obtendo a Equação (15.6):</p>
        $$P(n) = \\begin{cases} 1 & \\text{se } n = 1, \\\\ \\displaystyle\\sum_{k=1}^{n-1} P(k)P(n-k) & \\text{se } n \\ge 2. \\end{cases}$$
        <p>Essa recorrência gera os <strong>números de Catalan</strong> $P(n) = C(n-1) = \\frac{1}{n}\\binom{2n-2}{n-1} = \\Omega\\left(\\frac{4^n}{n^{3/2}}\\right)$ (e pelo Exercício 15.2-3, $P(n) = \\Omega(2^n)$), inviabilizando a busca exaustiva.</p>

        <h4>As 4 Etapas da Programação Dinâmica para <code>MATRIX-CHAIN-ORDER</code> (pp. 311–316)</h4>
        <p>Denotamos a matriz $A_i$ com dimensões $p_{i-1} \\times p_i$ ($i = 1, 2, \\dots, n$), de modo que a entrada é o vetor de dimensões $p = \\langle p_0, p_1, \\dots, p_n \\rangle$. Definimos $A_{i..j} = A_i A_{i+1} \\dots A_j$ (de dimensão $p_{i-1} \\times p_j$):</p>
        <ol>
          <li><strong>Etapa 1 (Subestrutura Ótima):</strong> Para parentizar $A_i A_{i+1} \\dots A_j$ ($i < j$), a última multiplicação deve dividir a cadeia em algum índice $k$ ($i \\le k < j$) nos subprodutos $A_{i..k}$ e $A_{k+1..j}$. Pelo argumento de <em>recortar e colar</em>, se a parentização de $A_{i..j}$ é ótima, então as subparentizações de $A_{i..k}$ e de $A_{k+1..j}$ dentro dela devem ser ótimas para seus respectivos subproblemas!</li>
          <li><strong>Etapa 2 (Solução Recursiva — Equação 15.7, p. 312):</strong> Seja $m[i, j]$ o número mínimo de multiplicações escalares para calcular $A_{i..j}$:
            $$m[i, j] = \\begin{cases} 0 & \\text{se } i = j, \\\\ \\displaystyle\\min_{i \\le k < j} \\{ m[i, k] + m[k+1, j] + p_{i-1} p_k p_j \\} & \\text{se } i < j. \\end{cases}$$
            E salvamos em $s[i, j]$ o valor de $k$ que atinge esse mínimo.</li>
          <li><strong>Etapa 3 (Cálculo dos Custos Ótimos de Baixo para Cima):</strong> Existem apenas $\\binom{n}{2} + n = \\Theta(n^2)$ subproblemas distintos $(i, j)$ com $1 \\le i \\le j \\le n$. Como $m[i, j]$ depende apenas de subcadeias de comprimento estritamente menor que $l = j - i + 1$, calculamos a tabela em <strong>ordem crescente do comprimento da cadeia $l = 2, 3, \\dots, n$</strong>:</li>
        </ol>

        <div class="pseudocode-block">
          <span class="pseudo-title">MATRIX-CHAIN-ORDER(p) e PRINT-OPTIMAL-PARENS(s, i, j) (pp. 314 e 316)</span>
<pre>MATRIX-CHAIN-ORDER(p)
1  n = p.comprimento - 1
2  sejam m[1 .. n, 1 .. n] e s[1 .. n - 1, 2 .. n] novas tabelas
3  para i = 1 até n
4      m[i, i] = 0
5  para l = 2 até n                     // l é o comprimento da cadeia
6      para i = 1 até n - l + 1
7          j = i + l - 1
8          m[i, j] = ∞
9          para k = i até j - 1
10             q = m[i, k] + m[k + 1, j] + p[i - 1] * p[k] * p[j]
11             se q < m[i, j]
12                 m[i, j] = q
13                 s[i, j] = k
14 retorne m e s

PRINT-OPTIMAL-PARENS(s, i, j)
1  se i == j
2      imprima "A"_i
3  senão imprima "("
4      PRINT-OPTIMAL-PARENS(s, i, s[i, j])
5      PRINT-OPTIMAL-PARENS(s, s[i, j] + 1, j)
6      imprima ")"</pre>
        </div>

        <ul>
          <li><strong>Complexidade:</strong> Os três laços aninhados ($l$, $i$ e $k$) executam $\\sum_{l=2}^{n} (n - l + 1)(l - 1) = \\frac{n^3 - n}{6} = \\mathbf{\\Theta(n^3)}$ iterações e utilizam espaço $\\mathbf{\\Theta(n^2)}$ para as tabelas $m$ e $s$.</li>
          <li><strong>Exemplo Canônico da Figura 15.5 (p. 315):</strong> Para $n = 6$ matrizes com vetor de dimensões $p = \\langle 30, 35, 15, 5, 10, 20, 25 \\rangle$ ($A_1: 30\\times 35, A_2: 35\\times 15, A_3: 15\\times 5, A_4: 5\\times 10, A_5: 10\\times 20, A_6: 20\\times 25$), obtemos custo ótimo $m[1, 6] = 15.125$ com divisões ótimas $s[1, 6] = 3$, $s[1, 3] = 1$ e $s[4, 6] = 5$, de modo que <code>PRINT-OPTIMAL-PARENS(s, 1, 6)</code> imprime <code>((A1(A2A3))((A4A5)A6))</code>.</li>
        </ul>

        <div id="workbench-mod9-mount"></div>
      `
    },

    /* ======================================================================
       UNIDADE 9.2 — CAPÍTULO 15, SEÇÕES 15.3, 15.4 E 15.5 (pp. 318–339)
       ====================================================================== */
    {
      id: "u9-2",
      code: "UNIDADE 9.2 • CAP. 15 (SEÇÕES 15.3, 15.4 E 15.5)",
      pages: "pp. 318–339",
      title: "15.3, 15.4 e 15.5 Elementos da Programação Dinâmica, Subsequência Comum Mais Longa (LCS-LENGTH) e Árvores de Busca Binária Ótimas (OPTIMAL-BST)",
      content: `
        <h3>1. Seção 15.3 — Elementos da Programação Dinâmica (pp. 318–327)</h3>
        <p>Quando devemos procurar uma solução por Programação Dinâmica? Os dois ingredientes fundamentais que um problema de otimização deve exibir são <strong>subestrutura ótima</strong> e <strong>subproblemas superpostos</strong>.</p>

        <h4>Ingrediente 1: Subestrutura Ótima e a Técnica "Recortar e Colar" (Cut-and-Paste)</h4>
        <p>Um problema exibe <strong>subestrutura ótima</strong> se uma solução ótima para o problema contém dentro dela soluções ótimas para subproblemas. O padrão universal para provar subestrutura ótima é a prova por contradição de <strong>"recortar e colar" (cut-and-paste)</strong> (p. 319): supomos que a solução induzida para um subproblema não seja ótima; então "recortamos" essa sub-solução subótima e "colamos" uma solução verdadeiramente ótima para o subproblema, obtendo uma solução para o problema original melhor do que a suposta ótima — uma contradição!</p>
        <p>Para caracterizar o espaço de subproblemas de forma tão enxuta quanto possível (por exemplo, prefixos $1..j$ no corte de hastes ou intervalos contíguos $i..j$ na cadeia de matrizes), devemos também verificar como o custo total e o número de escolhas variam:</p>
        <ul>
          <li><strong>Corte de Hastes:</strong> $\\Theta(n)$ subproblemas e até $n$ escolhas por subproblema $\\implies \\Theta(n^2)$.</li>
          <li><strong>Multiplicação de Cadeias de Matrizes:</strong> $\\Theta(n^2)$ subproblemas e até $n - 1$ escolhas por subproblema $\\implies \\Theta(n^3)$.</li>
        </ul>

        <div class="canonical-callout warning">
          <span class="callout-tag">[ CONTRASTE CRÍTICO • CAMINHO SIMPLES MAIS CURTO VS. CAMINHO SIMPLES MAIS LONGO (FIG. 15.6, pp. 320–322) ]</span>
          <p>Nem todo problema de otimização em grafos possui subestrutura ótima ou subproblemas independentes! Considere um grafo orientado não ponderado $G = (V, E)$:</p>
          <ul>
            <li><strong>Caminho Simples Mais Curto (Possui Subestrutura Ótima e Subproblemas Independentes):</strong> Se $p = u \\leadsto w \\leadsto v$ é um caminho mais curto de $u$ até $v$, então o subcaminho $p_1 = u \\leadsto w$ é necessariamente um caminho mais curto de $u$ até $w$, e $p_2 = w \\leadsto v$ é um caminho mais curto de $w$ até $v$ (prova imediata por <em>cut-and-paste</em>).</li>
            <li><strong>Caminho Simples Mais Longo (NÃO Possui Subestrutura Ótima e os Subproblemas NÃO são Independentes!):</strong> Considere o grafo orientado da Figura 15.6 (p. 321) com vértices $\\{q, r, s, t\\}$ e arestas $(q,r), (r,q), (q,s), (s,q), (r,t), (s,t), (t,q)$. O caminho simples $q \\to r \\to t$ é o caminho simples mais longo de $q$ até $t$. Porém, o subcaminho $q \\to r$ <strong>não</strong> é o caminho simples mais longo de $q$ até $r$, pois o caminho simples mais longo de $q$ até $r$ é $q \\to s \\to t \\to r$ (ou $q \\to s \\to t \\to q$ se não fosse simples)! Mais ainda: se tentássemos substituir $q \\to r$ por $q \\to s \\to t \\to r$ e concatenar com $r \\to t$, obteríamos $q \\to s \\to t \\to r \\to t$, que <strong>não é simples</strong> (repete o vértice $t$)!</li>
            <li><strong>Causa Raiz (Dependência de Subproblemas):</strong> Dois subproblemas são <strong>independentes</strong> quando a solução de um não consome recursos que inviabilizem o outro. Na multiplicação de matrizes, os subintervalos $A_{i..k}$ e $A_{k+1..j}$ são disjuntos. Já no Caminho Simples Mais Longo, usar o vértice $t$ no primeiro subproblema proíbe que o segundo subproblema utilize $t$ novamente!</li>
          </ul>
        </div>

        <h4>Ingrediente 2: Subproblemas Superpostos ($\\Omega(2^n)$ em <code>RECURSIVE-MATRIX-CHAIN</code> vs. $O(n^3)$ em <code>MEMOIZED-MATRIX-CHAIN</code>)</h4>
        <p>Na Seção 15.3 (pp. 322–326), os autores analisam a implementação recursiva direta da Equação (15.7), <code>RECURSIVE-MATRIX-CHAIN(p, i, j)</code>. Seu tempo de execução $T(n)$ satisfaz $T(1) \\ge 1$ e $T(n) \\ge 1 + \\sum_{k=1}^{n-1} (T(k) + T(n-k) + 1) = 2 \\sum_{i=1}^{n-1} T(i) + n$. Por substituição ($T(n) \\ge 2^{n-1}$), prova-se que $T(n) = \\Omega(2^n)$, pois a árvore de recursão (Figura 15.7, p. 324) recalcula os mesmos pares $(i, j)$ exponencialmente muitas vezes.</p>
        <p>Por outro lado, a versão memoizada <code>MEMOIZED-MATRIX-CHAIN(p)</code> inicializa $m[i, j] = \\infty$ e chama <code>LOOKUP-CHAIN(m, p, i, j)</code>: cada uma das $\\Theta(n^2)$ entradas é inicializada uma vez e preenchida exatamente uma vez (em $O(n)$), levando $O(n^3)$ no total. <strong>Regra prática (p. 326):</strong> se todos os subproblemas no espaço de subproblemas precisam ser resolvidos pelo menos uma vez, um algoritmo <em>bottom-up</em> geralmente supera o <em>top-down memoizado</em> por um fator constante (sem sobrecarga de recursão); se muitos subproblemas jamais precisam ser visitados, a memoização <em>top-down</em> calcula apenas os estritamente necessários.</p>

        <h3>2. Seção 15.4 — Subsequência Comum Mais Longa (LCS, pp. 327–333)</h3>
        <p>Dada uma sequência $X = \\langle x_1, x_2, \\dots, x_m \\rangle$, outra sequência $Z = \\langle z_1, z_2, \\dots, z_k \\rangle$ é uma <strong>subsequência</strong> de $X$ se existir uma sequência estritamente crescente $\\langle i_1, i_2, \\dots, i_k \\rangle$ de índices de $X$ ($1 \\le i_1 < i_2 < \\dots < i_k \\le m$) tal que $x_{i_j} = z_j$ para todo $j = 1, \\dots, k$. Dadas duas sequências $X$ (comprimento $m$) e $Y$ (comprimento $n$), queremos encontrar uma <strong>subsequência comum de comprimento máximo (LCS — Longest Common Subsequence)</strong>.</p>
        <p>Enumerando todas as $2^m$ subsequências de $X$ por força bruta gastaríamos tempo exponencial. Contudo, definindo o $i$-ésimo prefixo $X_i = \\langle x_1, \\dots, x_i \\rangle$ (com $X_0 = \\langle \\rangle$), o Teorema 15.1 caracteriza a subestrutura ótima em termos de prefixos:</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 15.1 • SUBESTRUTURA ÓTIMA DE UMA LCS (p. 328) ]</span>
          <p>Sejam $X = \\langle x_1, x_2, \\dots, x_m \\rangle$ e $Y = \\langle y_1, y_2, \\dots, y_n \\rangle$ sequências, e seja $Z = \\langle z_1, z_2, \\dots, z_k \\rangle$ qualquer LCS de $X$ e $Y$.</p>
          <ol>
            <li>Se $x_m = y_n$, então $z_k = x_m = y_n$ e $Z_{k-1}$ é uma LCS de $X_{m-1}$ e $Y_{n-1}$.</li>
            <li>Se $x_m \\ne y_n$, então $z_k \\ne x_m$ implica que $Z$ é uma LCS de $X_{m-1}$ e $Y$.</li>
            <li>Se $x_m \\ne y_n$, então $z_k \\ne y_n$ implica que $Z$ é uma LCS de $X$ e $Y_{n-1}$.</li>
          </ol>
          <p><strong>Recorrência (Equação 15.9, p. 329):</strong> Seja $c[i, j]$ o comprimento de uma LCS dos prefixos $X_i$ e $Y_j$:</p>
          $$c[i, j] = \\begin{cases} 0 & \\text{se } i = 0 \\text{ ou } j = 0, \\\\ c[i-1, j-1] + 1 & \\text{se } i, j > 0 \\text{ e } x_i = y_j, \\\\ \\max(c[i, j-1], \\; c[i-1, j]) & \\text{se } i, j > 0 \\text{ e } x_i \\ne y_j. \\end{cases}$$
        </div>

        <p>Observe como o condicionamento do problema elimina escolhas desnecessárias: quando $x_i = y_j$, não precisamos testar $c[i-1, j]$ nem $c[i, j-1]$, bastando resolver o único subproblema $(i-1, j-1)$!</p>

        <div class="pseudocode-block">
          <span class="pseudo-title">LCS-LENGTH(X, Y) em Θ(mn) e PRINT-LCS(b, X, i, j) em O(m + n) (pp. 330–331)</span>
<pre>LCS-LENGTH(X, Y)
1  m = X.comprimento
2  n = Y.comprimento
3  sejam b[1 .. m, 1 .. n] e c[0 .. m, 0 .. n] novas tabelas
4  para i = 1 até m
5      c[i, 0] = 0
6  para j = 0 até n
7      c[0, j] = 0
8  para i = 1 até m
9      para j = 1 até n
10         se x_i == y_j
11             c[i, j] = c[i - 1, j - 1] + 1
12             b[i, j] = "↖"
13         senão se c[i - 1, j] ≥ c[i, j - 1]
14             c[i, j] = c[i - 1, j]
15             b[i, j] = "↑"
16         senão c[i, j] = c[i, j - 1]
17             b[i, j] = "←"
18 retorne c e b

PRINT-LCS(b, X, i, j)
1  se i == 0 ou j == 0
2      retorne
3  se b[i, j] == "↖"
4      PRINT-LCS(b, X, i - 1, j - 1)
5      imprima x_i
6  senão se b[i, j] == "↑"
7      PRINT-LCS(b, X, i - 1, j)
8  senão PRINT-LCS(b, X, i, j - 1)</pre>
        </div>
        <p>Na Figura 15.8 (p. 331), para $X = \\langle A, B, C, B, D, A, B \\rangle$ ($m = 7$) e $Y = \\langle B, D, C, A, B, A \\rangle$ ($n = 6$), <code>LCS-LENGTH</code> obtém $c[7, 6] = 4$ e <code>PRINT-LCS(b, X, 7, 6)</code> imprime a LCS $\\langle B, C, B, A \\rangle$ em tempo $O(m + n)$ (pois cada chamada recursiva decrementa $i$ e/ou $j$ em pelo menos $1$).</p>

        <h3>3. Seção 15.5 — Árvores de Busca Binária Ótimas (<code>OPTIMAL-BST</code>, pp. 333–339)</h3>
        <p>Dada uma sequência ordenada $K = \\langle k_1, k_2, \\dots, k_n \\rangle$ de $n$ chaves distintas ($k_1 < k_2 < \\dots < k_n$) e probabilidades conhecidas de busca:</p>
        <ul>
          <li>$p_i$ ($1 \\le i \\le n$): probabilidade de que uma busca seja pela chave real $k_i$ (buscas bem-sucedidas, nós internos);</li>
          <li>$q_i$ ($0 \\le i \\le n$): probabilidade de que uma busca caia no intervalo representado pela <strong>chave fictícia (dummy key)</strong> $d_i$ (folhas externas: $d_0$ representa chaves $< k_1$, $d_i$ representa chaves entre $k_i$ e $k_{i+1}$, e $d_n$ representa chaves $> k_n$), com $\\sum_{i=1}^{n} p_i + \\sum_{i=0}^{n} q_i = 1$.</li>
        </ul>
        <p>Sabendo que uma busca por um nó na profundidade $\\text{prof}_T(x)$ visita exatamente $\\text{prof}_T(x) + 1$ nós, queremos construir uma árvore de busca binária $T$ que minimize o <strong>custo esperado de uma busca</strong> (Equação 15.11, p. 334):</p>
        $$\\text{E}[\\text{custo de busca em } T] = \\sum_{i=1}^{n} (\\text{prof}_T(k_i) + 1) p_i + \\sum_{i=0}^{n} (\\text{prof}_T(d_i) + 1) q_i = 1 + \\sum_{i=1}^{n} \\text{prof}_T(k_i) p_i + \\sum_{i=0}^{n} \\text{prof}_T(d_i) q_i.$$

        <h4>Subestrutura Ótima, Efeito do Aumento de Profundidade $w(i, j)$ e Recorrência $e[i, j]$</h4>
        <p>Para uma subárvore que contém as chaves reais $k_i, \\dots, k_j$ ($1 \\le i \\le j+1 \\le n+1$) e as chaves fictícias $d_{i-1}, \\dots, d_j$, definimos a soma de probabilidades da subárvore como (Equação 15.12, p. 336):</p>
        $$w(i, j) = \\sum_{l=i}^{j} p_l + \\sum_{l=i-1}^{j} q_l, \\quad \\text{calculada incrementalmente por } w(i, j) = w(i, j-1) + p_j + q_j.$$
        <p>Se escolhermos $k_r$ ($i \\le r \\le j$) como a raiz dessa subárvore, a subárvore esquerda conterá $k_i, \\dots, k_{r-1}$ e a direita conterá $k_{r+1}, \\dots, k_j$. Quando uma subárvore torna-se filha do nó $k_r$, a profundidade de <strong>cada nó</strong> dentro dela aumenta em $1$, o que eleva o custo esperado daquela subárvore exatamente pela soma de suas probabilidades! Somando $p_r$ da própria raiz $k_r$, o acréscimo total é $w(i, r-1) + w(r+1, j) + p_r = w(i, j)$. Isso conduz à recorrência fundamental (Equação 15.14, p. 336):</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ EQUAÇÃO 15.14 • RECORRÊNCIA DE OPTIMAL-BST (p. 336) ]</span>
          $$e[i, j] = \\begin{cases} q_{i-1} & \\text{se } j = i - 1 \\; (\\text{apenas a folha fictícia } d_{i-1}), \\\\ \\displaystyle\\min_{i \\le r \\le j} \\{ e[i, r-1] + e[r+1, j] + w(i, j) \\} & \\text{se } i \\le j. \\end{cases}$$
        </div>

        <div class="pseudocode-block">
          <span class="pseudo-title">OPTIMAL-BST(p, q, n) em Θ(n³) (p. 337)</span>
<pre>OPTIMAL-BST(p, q, n)
1  sejam e[1 .. n + 1, 0 .. n], w[1 .. n + 1, 0 .. n] e raiz[1 .. n, 1 .. n] novas tabelas
2  para i = 1 até n + 1
3      e[i, i - 1] = q_{i - 1}
4      w[i, i - 1] = q_{i - 1}
5  para l = 1 até n                     // comprimento do intervalo de chaves k_i .. k_j
6      para i = 1 até n - l + 1
7          j = i + l - 1
8          e[i, j] = ∞
9          w[i, j] = w[i, j - 1] + p_j + q_j
10         para r = i até j
11             t = e[i, r - 1] + e[r + 1, j] + w[i, j]
12             se t < e[i, j]
13                 e[i, j] = t
14                 raiz[i, j] = r
15 retorne e e raiz</pre>
        </div>
        <p>Assim como <code>MATRIX-CHAIN-ORDER</code>, <code>OPTIMAL-BST</code> executa em tempo $\\mathbf{\\Theta(n^3)}$ (embora Knuth tenha demonstrado, como explorado no Exercício 15.5-4, que a monotonicidade $\\text{raiz}[i, j-1] \\le \\text{raiz}[i, j] \\le \\text{raiz}[i+1, j]$ permite reduzir o tempo total para $\\Theta(n^2)$!).</p>
      `
    },

    /* ======================================================================
       UNIDADE 9.3 — CAPÍTULO 16, SEÇÕES 16.1 E 16.2 (pp. 342–353)
       ====================================================================== */
    {
      id: "u9-3",
      code: "UNIDADE 9.3 • CAP. 16 (SEÇÕES 16.1 E 16.2)",
      pages: "pp. 342–353",
      title: "16.1 e 16.2 Seleção de Atividades (RECURSIVE e GREEDY-ACTIVITY-SELECTOR) e Elementos da Estratégia Gulosa (Mochila 0-1 vs. Fracionária)",
      content: `
        <p>Um <strong>algoritmo guloso</strong> sempre faz a escolha que parece ser a melhor naquele momento: ele faz uma escolha <em>localmente ótima</em> na esperança de que essa escolha leve a uma solução <em>globalmente ótima</em>. Embora algoritmos gulosos não produzam soluções ótimas para todos os problemas de otimização, para muitos problemas importantes eles são provadamente ótimos e drasticamente mais eficientes que a programação dinâmica.</p>

        <h3>1. Seção 16.1 — Um Problema de Seleção de Atividades (pp. 342–349)</h3>
        <p>Temos um conjunto $S = \\{a_1, a_2, \\dots, a_n\\}$ de $n$ atividades propostas que desejam utilizar um recurso compartilhado (como um anfiteatro), que só pode atender a uma atividade por vez. Cada atividade $a_i$ tem um <strong>tempo de início $s_i$</strong> e um <strong>tempo de término $f_i$</strong>, onde $0 \\le s_i < f_i < \\infty$, ocupando o intervalo semiaberto $[s_i, f_i)$. Duas atividades $a_i$ e $a_j$ são <strong>compatíveis</strong> se seus intervalos não se superpõem ($s_i \\ge f_j$ ou $s_j \\ge f_i$). Queremos selecionar um <strong>subconjunto de tamanho máximo de atividades mutuamente compatíveis</strong>.</p>
        <p>Supomos que as atividades de entrada estejam ordenadas em ordem monotonicamente crescente de tempo de término (Equação 16.1, p. 343):</p>
        $$f_1 \\le f_2 \\le f_3 \\le \\dots \\le f_{n-1} \\le f_n.$$

        <h4>Da Subestrutura Ótima de PD ($S_{ij}$) à Escolha Gulosa ($S_k$)</h4>
        <p>Se definíssemos o subproblema geral $S_{ij}$ como o conjunto de atividades que começam depois que $a_i$ termina e terminam antes que $a_j$ comece, a recorrência de Programação Dinâmica seria $c[i, j] = \\max_{a_k \\in S_{ij}} \\{c[i, k] + c[k, j] + 1\\}$ (Equação 16.2, p. 344), exigindo tempo $O(n^3)$. Contudo, podemos fazer muito melhor: em vez de testar todas as atividades $a_k$, devemos escolher a atividade que deixa o recurso livre para o máximo de atividades subsequentes — isto é, <strong>a atividade compatível com o tempo de término mais cedo</strong>! Isso reduz os subproblemas à forma $S_k = \\{a_i \\in S : s_i \\ge f_k\\}$ (atividades que começam após $a_k$ terminar, adicionando a atividade fictícia $a_0$ com $f_0 = 0$ para que $S_0 = S$):</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 16.1 • ESCOLHA GULOSA NA SELEÇÃO DE ATIVIDADES (p. 345) ]</span>
          <p>Considere qualquer subproblema não vazio $S_k$, e seja $a_m$ uma atividade em $S_k$ com o menor tempo de término:</p>
          $$f_m = \\min \\{ f_i : a_i \\in S_k \\}.$$
          <p>Então $a_m$ está incluída em algum subconjunto de tamanho máximo de atividades mutuamente compatíveis de $S_k$.</p>
          <p><strong>Demonstração (Argumento de Troca / Exchange Argument):</strong> Seja $A_k$ um subconjunto de tamanho máximo de atividades mutuamente compatíveis em $S_k$, e seja $a_j$ a atividade em $A_k$ com o menor tempo de término. Se $a_j = a_m$, estamos prontos. Se $a_j \\ne a_m$, construímos o conjunto $A'_k = (A_k - \\{a_j\\}) \\cup \\{a_m\\}$ substituindo $a_j$ por $a_m$. Como as atividades em $A_k$ são disjuntas, $a_j$ é a primeira a terminar em $A_k$, e $f_m \\le f_j$, o intervalo de $a_m$ termina ainda antes (ou no mesmo instante) que $a_j$, logo todas as atividades em $A'_k$ permanecem mutuamente compatíveis! Como $|A'_k| = |A_k|$, concluímos que $A'_k$ é um subconjunto ótimo de $S_k$ que inclui $a_m$. $\\blacksquare$</p>
        </div>

        <div class="pseudocode-block">
          <span class="pseudo-title">RECURSIVE-ACTIVITY-SELECTOR(s, f, k, n) e GREEDY-ACTIVITY-SELECTOR(s, f) em Θ(n) (pp. 346–348)</span>
<pre>RECURSIVE-ACTIVITY-SELECTOR(s, f, k, n)
1  m = k + 1
2  enquanto m ≤ n e s[m] < f[k]        // encontra a primeira atividade em S_k a terminar
3      m = m + 1
4  se m ≤ n
5      retorne {a_m} ∪ RECURSIVE-ACTIVITY-SELECTOR(s, f, m, n)
6  senão retorne ∅

GREEDY-ACTIVITY-SELECTOR(s, f)
1  n = s.comprimento
2  A = {a_1}
3  k = 1
4  para m = 2 até n
5      se s[m] ≥ f[k]
6          A = A ∪ {a_m}
7          k = m
8  retorne A</pre>
        </div>
        <ul>
          <li><strong>Complexidade:</strong> Supondo que as atividades já estejam ordenadas por $f_i$, ambos os algoritmos examinam cada atividade exatamente uma vez em tempo $\\mathbf{\\Theta(n)}$ (e $O(n \\lg n)$ se incluirmos a ordenação inicial). No exemplo de 11 atividades da p. 343 ($\langle [1,4), [3,5), [0,6), [5,7), [3,9), [5,9), [6,10), [8,11), [8,12), [2,14), [12,16) \\rangle$), o algoritmo seleciona $A = \\{a_1, a_4, a_8, a_{11}\\}$.</li>
        </ul>

        <h3>2. Seção 16.2 — Elementos da Estratégia Gulosa e o Contraste entre as Mochilas (pp. 349–353)</h3>
        <p>Projetar um algoritmo guloso envolve mostrar duas propriedades essenciais:</p>
        <ol>
          <li><strong>Propriedade de Escolha Gulosa:</strong> Podemos montar uma solução globalmente ótima fazendo escolhas localmente ótimas (gulosas). Na PD, fazemos uma escolha em cada passo, mas a escolha depende das soluções dos subproblemas (procedemos de baixo para cima). Em um algoritmo guloso, fazemos a escolha que parece melhor no momento e <em>depois</em> resolvemos o único subproblema que resta (procedemos de cima para baixo).</li>
          <li><strong>Subestrutura Ótima:</strong> Uma solução ótima do problema contém uma solução ótima do subproblema que resulta após fazermos a escolha gulosa.</li>
        </ol>

        <div class="canonical-callout warning">
          <span class="callout-tag">[ COMPARAÇÃO CLÁSSICA • MOCHILA 0-1 (PD) VS. MOCHILA FRACIONÁRIA (GULOSA) (FIG. 16.2, pp. 351–352) ]</span>
          <p>Um ladrão assalta uma loja encontrando $n$ itens; o $i$-ésimo item vale $v_i$ reais e pesa $w_i$ quilos ($v_i, w_i$ inteiros), e sua mochila suporta no máximo $W$ quilos:</p>
          <ul>
            <li><strong>Problema da Mochila 0-1 (Lingotes de Ouro — Exige Programação Dinâmica):</strong> O ladrão deve fazer uma escolha binária para cada item: levá-lo inteiro ($1$) ou deixá-lo para trás ($0$).</li>
            <li><strong>Problema da Mochila Fracionária (Ouro em Pó — Resolvível por Estratégia Gulosa em $O(n \\lg n)$ ou $O(n)$):</strong> O ladrão pode levar frações de itens. Calculamos a razão valor por quilo $v_i / w_i$ de cada item e tomamos o máximo possível em ordem decrescente de $v_i / w_i$.</li>
            <li><strong>Contraexemplo da Figura 16.2 (Por que a escolha gulosa falha na Mochila 0-1):</strong> Sejam $W = 50$ quilos e $3$ itens:
              <ul>
                <li>Item 1: $w_1 = 10\\text{ kg}, v_1 = R\\$ 60 \\implies v_1/w_1 = 6\\text{ R\\$/kg}$ (maior razão!);</li>
                <li>Item 2: $w_2 = 20\\text{ kg}, v_2 = R\\$ 100 \\implies v_2/w_2 = 5\\text{ R\\$/kg}$;</li>
                <li>Item 3: $w_3 = 30\\text{ kg}, v_3 = R\\$ 120 \\implies v_3/w_3 = 4\\text{ R\\$/kg}$.</li>
              </ul>
              Na <strong>Mochila Fracionária</strong>, a escolha gulosa leva todo o Item 1 ($10\\text{kg}, R\\$60$), todo o Item 2 ($20\\text{kg}, R\\$100$) e $20/30 = 2/3$ do Item 3 ($20\\text{kg}, R\\$80$), atingindo o ótimo de <strong>$R\\$ 240$</strong>.<br>
              Na <strong>Mochila 0-1</strong>, se o ladrão pegar o Item 1 primeiro, só poderá levar mais o Item 2 ($10+20=30\\text{kg}, R\\$160$, deixando $20\\text{kg}$ vazios!) ou o Item 3 ($10+30=40\\text{kg}, R\\$180$, deixando $10\\text{kg}$ vazios!). A solução ótima 0-1 deixa o Item 1 para trás e leva os <strong>Itens 2 e 3</strong> ($20+30=50\\text{kg}$), obtendo <strong>$R\\$ 220$</strong>! No problema 0-1, precisamos comparar o subproblema que inclui o item com o subproblema que o exclui via Programação Dinâmica em $O(nW)$ (Exercício 16.2-2).
            </li>
          </ul>
        </div>
      `
    },

    /* ======================================================================
       UNIDADE 9.4 — CAPÍTULO 16, SEÇÕES 16.3, 16.4 E 16.5 (pp. 353–371)
       ====================================================================== */
    {
      id: "u9-4",
      code: "UNIDADE 9.4 • CAP. 16 (SEÇÕES 16.3, 16.4 E 16.5)",
      pages: "pp. 353–371",
      title: "16.3, 16.4 e 16.5 Códigos de Huffman (HUFFMAN), Fundamentos de Matroides e Escalonamento de Tarefas Unitárias com Prazos e Multas",
      content: `
        <h3>1. Seção 16.3 — Códigos de Huffman (pp. 353–361)</h3>
        <p>Para comprimir um arquivo de caracteres onde cada caractere $c \\in C$ aparece com frequência conhecida $c.\\text{freq}$, atribuímos palavras de código binárias curtas aos caracteres frequentes e longas aos raros. Consideramos apenas <strong>códigos de prefixo</strong> (ou códigos livres de prefixo), nos quais nenhuma palavra de código é prefixo de outra palavra de código. Isso garante decodificação imediata sem ambiguidade, e um código de prefixo sempre atinge a compressão ótima entre todos os códigos unicamente decodificáveis.</p>

        <h4>Representação por Árvore Binária Cheia e Custo $B(T)$</h4>
        <p>Um código de prefixo corresponde a uma árvore binária enraizada $T$ onde cada caractere $c \\in C$ é uma folha (arestas esquerdas rotuladas com $0$ e direitas com $1$). O comprimento da palavra de código de $c$ é exatamente a profundidade $d_T(c)$ da folha $c$ em $T$. O número total de bits necessários para codificar o arquivo (o <strong>custo da árvore $T$</strong>, Equação 16.4, p. 355) é:</p>
        $$B(T) = \\sum_{c \\in C} c.\\text{freq} \\cdot d_T(c).$$
        <p>Uma árvore que corresponde a um código de prefixo ótimo é sempre uma <strong>árvore binária cheia (full binary tree)</strong> — todo nó interno tem exatamente dois filhos — contendo $|C|$ folhas e exatamente $|C| - 1$ nós internos (Exercício 16.3-2).</p>

        <div class="pseudocode-block">
          <span class="pseudo-title">HUFFMAN(C) — Construção Gulosa com Fila de Prioridade Mínima em O(n lg n) (p. 356)</span>
<pre>HUFFMAN(C)
1  n = |C|
2  Q = C                                // fila de prioridade mínima ordenada por freq
3  para i = 1 até n - 1
4      aloque um novo nó z
5      z.esquerda = x = EXTRACT-MIN(Q)
6      z.direita = y = EXTRACT-MIN(Q)
7      z.freq = x.freq + y.freq
8      INSERT(Q, z)
9  retorne EXTRACT-MIN(Q)               // retorna a raiz da árvore</pre>
        </div>

        <ul>
          <li><strong>Complexidade:</strong> Inicializar a fila de prioridade mínima $Q$ leva $O(n)$, e o laço <code>para</code> executa $n - 1$ intercalações (cada uma com duas operações <code>EXTRACT-MIN</code> e uma <code>INSERT</code> em $O(\\lg n)$), totalizando $\\mathbf{O(n \\lg n)}$ (ou $O(n \\lg \\lg n)$ com árvores de van Emde Boas se as frequências forem inteiros pequenos).</li>
          <li><strong>Exemplo Canônico (Figuras 16.3 a 16.5, pp. 354–356):</strong> Para 100.000 caracteres com frequências (em milhares) $a:45, b:13, c:12, d:16, e:9, f:5$: um código fixo de 3 bits gasta $300.000$ bits; a árvore ótima de Huffman atribui $a=0$ (1 bit), $b=101$, $c=100$, $d=111$ (3 bits cada), $e=1101$, $f=1100$ (4 bits cada), exigindo apenas $(45\\cdot 1 + 13\\cdot 3 + 12\\cdot 3 + 16\\cdot 3 + 9\\cdot 4 + 5\\cdot 4)\\times 1000 = \\mathbf{224.000\\text{ bits}}$ (economia de $25\\%$).</li>
        </ul>

        <h4>Demonstração da Corretude do Algoritmo de Huffman (Lemas 16.2 e 16.3, pp. 357–359)</h4>
        <div class="canonical-callout theorem">
          <span class="callout-tag">[ LEMA 16.2 (ESCOLHA GULOSA), LEMA 16.3 (SUBESTRUTURA ÓTIMA) E TEOREMA 16.4 ]</span>
          <ul>
            <li><strong>Lema 16.2 (Propriedade da Escolha Gulosa):</strong> Seja $C$ um alfabeto no qual cada caractere $c \\in C$ tem frequência $c.\\text{freq}$, e sejam $x$ e $y$ dois caracteres em $C$ com as <strong>menores frequências</strong>. Então existe um código de prefixo ótimo para $C$ no qual as palavras de código para $x$ e $y$ têm o mesmo comprimento e diferem apenas no último bit (isto é, $x$ e $y$ são folhas irmãs de profundidade máxima).<br>
              <em>Prova (Troca em Duas Etapas — Fig. 16.6):</em> Tome uma árvore ótima arbitrária $T$ e sejam $a$ e $b$ duas folhas irmãs de profundidade máxima em $T$ (sem perda de generalidade, $x.\\text{freq} \\le y.\\text{freq}$ e $a.\\text{freq} \\le b.\\text{freq}$, logo $x.\\text{freq} \\le a.\\text{freq}$ e $y.\\text{freq} \\le b.\\text{freq}$). Permutando as posições de $a$ e $x$ em $T$, obtemos uma árvore $T'$ cuja diferença de custo é:
              $$B(T) - B(T') = (a.\\text{freq} - x.\\text{freq})(d_T(a) - d_T(x)) \\ge 0,$$
              pois ambos os fatores são não negativos! Analogamente, permutando $b$ e $y$ em $T'$ para produzir $T''$, temos $B(T') - B(T'') = (b.\\text{freq} - y.\\text{freq})(d_{T'}(b) - d_{T'}(y)) \\ge 0$. Logo $B(T'') \\le B(T)$, e como $T$ é ótima, $B(T'') = B(T)$ com $x$ e $y$ como folhas irmãs de profundidade máxima!</li>
            <li><strong>Lema 16.3 (Subestrutura Ótima):</strong> Sejam $x, y \\in C$ com frequência mínima, $z$ um novo caractere com $z.\\text{freq} = x.\\text{freq} + y.\\text{freq}$ e $C' = (C - \\{x, y\\}) \\cup \\{z\\}$. Se $T'$ é uma árvore ótima para $C'$, então a árvore $T$ obtida de $T'$ substituindo a folha $z$ por um nó interno com filhos $x$ e $y$ é uma árvore ótima para $C$.<br>
              <em>Prova:</em> Como $d_T(x) = d_T(y) = d_{T'}(z) + 1$, temos $x.\\text{freq}\\cdot d_T(x) + y.\\text{freq}\\cdot d_T(y) = (x.\\text{freq} + y.\\text{freq})(d_{T'}(z) + 1) = z.\\text{freq}\\cdot d_{T'}(z) + (x.\\text{freq} + y.\\text{freq})$, logo:
              $$B(T) = B(T') + x.\\text{freq} + y.\\text{freq}.$$
              Se $T$ não fosse ótima para $C$, existiria $T''$ (com $x$ e $y$ irmãos pelo Lema 16.2) tal que $B(T'') < B(T)$; contraindo $x$ e $y$ em $T''$ obteríamos uma árvore $T'''$ para $C'$ com $B(T''') = B(T'') - x.\\text{freq} - y.\\text{freq} < B(T')$, contradizendo a otimalidade de $T'$!</li>
            <li><strong>Teorema 16.4:</strong> O procedimento <code>HUFFMAN</code> produz um código de prefixo ótimo. $\\blacksquare$</li>
          </ul>
        </div>

        <h3>2. Seção 16.4 — Fundamentos Teóricos para Métodos Gulosos: Matroides (pp. 361–367)</h3>
        <p>Um <strong>matroide</strong> é um par ordenado $M = (S, \\mathcal{I})$ que satisfaz três condições:</p>
        <ol>
          <li>$S$ é um conjunto finito;</li>
          <li>$\\mathcal{I}$ é uma família não vazia de subconjuntos de $S$, denominados <strong>subconjuntos independentes</strong> de $S$, que é <strong>hereditária</strong>: se $B \\in \\mathcal{I}$ e $A \\subseteq B$, então $A \\in \\mathcal{I}$ (em particular, $\\emptyset \\in \\mathcal{I}$);</li>
          <li><strong>Propriedade de Intercâmbio (Exchange Property):</strong> Se $A \\in \\mathcal{I}$, $B \\in \\mathcal{I}$ e $|A| < |B|$, então existe algum elemento $x \\in B - A$ tal que $A \\cup \\{x\\} \\in \\mathcal{I}$.</li>
        </ol>
        <ul>
          <li><strong>Teorema 16.5 (Equicardinalidade dos Subconjuntos Independentes Maximais):</strong> Todos os subconjuntos independentes maximais (bases) de um matroide têm exatamente o mesmo tamanho (provado diretamente pela propriedade de intercâmbio).</li>
          <li><strong>Exemplos Clássicos:</strong> (1) <em>Matroide Matricial</em> ($S =$ colunas de uma matriz, $A \\in \\mathcal{I} \\iff$ as colunas em $A$ são linearmente independentes); (2) <em>Matroide Gráfico</em> $M_G = (S_G, \\mathcal{I}_G)$ de um grafo não orientado $G = (V, E)$, onde $S_G = E$ e $A \\in \\mathcal{I}_G$ se e somente se $A$ é uma <strong>floresta (acíclico)</strong> (Teorema 16.6: se $|A| < |B|$, a floresta $A$ tem $|V| - |A|$ árvores conectadas, mais do que as $|V| - |B|$ árvores de $B$, logo alguma árvore de $B$ contém vértices em duas árvores distintas de $A$, fornecendo uma aresta $x \\in B - A$ que pode ser unida a $A$ sem criar ciclo!).</li>
        </ul>

        <div class="pseudocode-block">
          <span class="pseudo-title">GREEDY(M, w) — Subconjunto Independente de Peso Máximo em Matroides Ponderados (p. 363)</span>
<pre>GREEDY(M, w)
1  A = ∅
2  ordene M.S em ordem monotonicamente decrescente pelo peso w
3  para cada x ∈ M.S, tomado em ordem monotonicamente decrescente pelo peso w(x)
4      se A ∪ {x} ∈ M.I
5          A = A ∪ {x}
6  retorne A</pre>
        </div>
        <p>Pelo <strong>Lema 16.7</strong> (propriedade da escolha gulosa em matroides), <strong>Corolário 16.9</strong> (qualquer elemento que não é extensão de $\\emptyset$ jamais pertencerá a nenhum subconjunto independente) e <strong>Lema 16.10</strong> (subestrutura ótima no matroide contraído $M' = (S', \\mathcal{I}')$), o <strong>Teorema 16.11</strong> garante que <code>GREEDY(M, w)</code> sempre retorna um subconjunto independente de peso máximo!</p>

        <h3>3. Seção 16.5 — Escalonamento de Tarefas Unitárias com Prazos e Multas (pp. 367–371)</h3>
        <p>Dado um conjunto $S = \\{a_1, a_2, \\dots, a_n\\}$ de $n$ tarefas de <strong>tempo unitário</strong> a serem executadas em um único processador, onde cada tarefa $a_i$ possui um <strong>prazo (deadline) inteiro $d_i \\in \\{1, \\dots, n\\}$</strong> e uma <strong>multa (penalidade) $w_i \\ge 0$</strong> incorrida se $a_i$ não terminar até o instante $d_i$, queremos encontrar uma programação que <strong>minimize a multa total</strong> por tarefas atrasadas (o que equivale a <strong>maximizar a soma das multas das tarefas pontuais</strong>).</p>
        <ul>
          <li><strong>Forma Canônica e Independência:</strong> Um subconjunto $A$ de tarefas é <strong>independente</strong> se existe uma programação para $A$ sem nenhuma tarefa atrasada (e podemos sempre ordenar as tarefas pontuais em ordem crescente de seus prazos, seguida das atrasadas).</li>
          <li><strong>Critério de Verificação $N_t(A) \\le t$ (Lema 16.12, p. 369):</strong> Para qualquer conjunto de tarefas $A$, seja $N_t(A)$ o número de tarefas em $A$ cujo prazo é $t$ ou anterior ($d_i \\le t$). Então as três afirmações são equivalentes:
            <ol>
              <li>$A$ é independente;</li>
              <li>$N_t(A) \\le t$ para todo $t = 1, 2, \\dots, n$;</li>
              <li>Se as tarefas em $A$ são programadas em ordem monotonicamente crescente de seus prazos, nenhuma tarefa se atrasa.</li>
            </ol>
          </li>
          <li><strong>Teorema 16.13 (p. 369):</strong> Se $S$ é um conjunto de tarefas de tempo unitário com prazos e $\\mathcal{I}$ é o conjunto de todos os subconjuntos independentes de tarefas, então $(S, \\mathcal{I})$ é um <strong>matroide</strong>! Consequentemente, aplicar <code>GREEDY</code> ordenando as tarefas em ordem decrescente de multa $w_i$ resolve o problema de forma ótima em $O(n^2)$ (ou $O(n \\alpha(n))$ usando Conjuntos Disjuntos, Exercício 21.3-5).</li>
        </ul>
      `
    },

    /* ======================================================================
       UNIDADE 9.5 — CAPÍTULO 17, SEÇÕES 17.1, 17.2 E 17.3 (pp. 375–385)
       ====================================================================== */
    {
      id: "u9-5",
      code: "UNIDADE 9.5 • CAP. 17 (SEÇÕES 17.1, 17.2 E 17.3)",
      pages: "pp. 375–385",
      title: "17.1, 17.2 e 17.3 Os Três Métodos de Análise Amortizada: Análise Agregada, Método da Contabilidade e Método do Potencial",
      content: `
        <p>Em uma <strong>análise amortizada</strong>, calculamos a média do tempo necessário para executar uma sequência de operações de estrutura de dados sobre todas as operações executadas. Com a análise amortizada, podemos mostrar que o custo médio de uma operação é pequeno, se tirarmos a média sobre uma sequência de operações, mesmo que uma única operação dentro da sequência possa ser dispendiosa. A análise amortizada difere da análise de caso médio porque a probabilidade não está envolvida; uma análise amortizada garante o <strong>desempenho médio de cada operação no pior caso</strong>.</p>

        <h3>1. Os Dois Exemplos Canônicos de Estruturas de Dados (pp. 375–379)</h3>
        <h4>Exemplo A: Operações de Pilha com <code>MULTIPOP(S, k)</code></h4>
        <p>Além de <code>PUSH(S, x)</code> e <code>POP(S)</code> — cada uma executada em $O(1)$ com custo real $1$ —, incluímos a operação <code>MULTIPOP(S, k)</code>, que desempilha os $k$ objetos superiores da pilha $S$ (ou a pilha inteira se ela contiver menos de $k$ objetos):</p>
        <div class="pseudocode-block">
          <span class="pseudo-title">MULTIPOP(S, k) (p. 376)</span>
<pre>1  enquanto não STACK-EMPTY(S) e k > 0
2      POP(S)
3      k = k - 1</pre>
        </div>
        <p>Se a pilha contém $s$ objetos, o custo real de <code>MULTIPOP(S, k)</code> é $\\min(s, k)$ passos <code>POP</code>. Em uma sequência de $n$ operações sobre uma pilha inicialmente vazia, o pior caso de uma única chamada <code>MULTIPOP</code> é $O(n)$, o que daria um limite ingênuo de $n \\cdot O(n) = O(n^2)$ para a sequência.</p>

        <h4>Exemplo B: Incremento de um Contador Binário de $k$ Bits (<code>INCREMENT(A)</code>)</h4>
        <p>Um contador binário de $k$ bits que conta ascendentemente a partir de $0$ é representado por um arranjo $A[0 .. k-1]$ de bits, onde $x = \\sum_{i=0}^{k-1} A[i] \\cdot 2^i$ ($A[0]$ é o bit de ordem mais baixa):</p>
        <div class="pseudocode-block">
          <span class="pseudo-title">INCREMENT(A) (p. 377)</span>
<pre>1  i = 0
2  enquanto i < A.comprimento e A[i] == 1
3      A[i] = 0
4      i = i + 1
5  se i < A.comprimento
6      A[i] = 1</pre>
        </div>
        <p>O custo de cada chamada a <code>INCREMENT</code> é proporcional ao número de bits invertidos (trocados de $1 \\to 0$ no laço <code>enquanto</code> mais no máximo um bit trocado de $0 \\to 1$ na linha 6). Como uma única chamada pode inverter todos os $k$ bits, a análise ingênua para $n$ incrementos a partir de zero daria $O(nk)$.</p>

        <h3>2. Seção 17.1 — Análise Agregada (pp. 375–379)</h3>
        <p>Na <strong>análise agregada</strong>, mostramos que, para todo $n$, uma sequência de $n$ operações leva o tempo de pior caso $T(n)$ no total. No pior caso, portanto, o custo médio (ou <strong>custo amortizado</strong>) por operação é $T(n) / n$. Note que a análise agregada atribui o <em>mesmo</em> custo amortizado a todos os tipos de operações na sequência:</p>
        <ul>
          <li><strong>Pilha com <code>MULTIPOP</code>:</strong> Podemos desempilhar cada objeto no máximo uma vez para cada vez que o empilhamos. Logo, o número total de chamadas a <code>POP</code> (incluindo as internas a <code>MULTIPOP</code>) é no máximo o número de chamadas a <code>PUSH</code>, que é no máximo $n$. Portanto, $T(n) \\le 2n = O(n)$ e o custo amortizado é $O(n)/n = \\mathbf{O(1)}$.</li>
          <li><strong>Contador Binário (<code>INCREMENT</code>):</strong> Em uma sequência de $n$ operações <code>INCREMENT</code> partindo de $0$, o bit $A[0]$ é invertido a cada vez ($n$ vezes), $A[1]$ é invertido a cada $2$ vezes ($\\lfloor n/2 \\rfloor$ vezes), e em geral o bit $A[i]$ é invertido $\\lfloor n / 2^i \\rfloor$ vezes. O número total de inversões de bits na sequência inteira é:
            $$\\sum_{i=0}^{k-1} \\left\\lfloor \\frac{n}{2^i} \\right\\rfloor < n \\sum_{i=0}^{\\infty} \\frac{1}{2^i} = 2n.$$
            Logo, $T(n) = O(n)$ e o custo amortizado de cada operação <code>INCREMENT</code> é $O(n)/n = \\mathbf{O(1)}$.</li>
        </ul>

        <h3>3. Seção 17.2 — O Método da Contabilidade (pp. 379–381)</h3>
        <p>No <strong>método da contabilidade</strong>, atribuímos encargos diferentes a operações diferentes, denominados <strong>custos amortizados $\\hat{c}_i$</strong>. Quando $\\hat{c}_i$ excede o custo real $c_i$, a diferença $\\hat{c}_i - c_i > 0$ é atribuída a <strong>objetos específicos na estrutura de dados como crédito</strong>, que pode ser usado mais tarde para pagar operações cujo custo amortizado seja menor que o custo real ($\\hat{c}_i < c_i$).</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ INVARIANTE FUNDAMENTAL DO MÉTODO DA CONTABILIDADE (Equação 17.1, p. 379) ]</span>
          <p>Para que os custos amortizados limitem superiormente os custos reais em todas as circunstâncias, o <strong>crédito total armazenado na estrutura de dados nunca pode se tornar negativo</strong>; isto é, para todo prefixo de $n$ operações deve valer:</p>
          $$\\sum_{i=1}^{n} \\hat{c}_i \\ge \\sum_{i=1}^{n} c_i.$$
        </div>

        <ul>
          <li><strong>Contabilidade na Pilha com <code>MULTIPOP</code>:</strong> Atribuímos os seguintes custos amortizados:
            $$\\hat{c}_{\\text{PUSH}} = 2, \\quad \\hat{c}_{\\text{POP}} = 0, \\quad \\hat{c}_{\\text{MULTIPOP}} = 0.$$
            Ao empilhar um prato (<code>PUSH</code>), usamos $1$ real para pagar o custo real da inserção e deixamos <strong>$1$ real de crédito sobre o prato empilhado</strong>. Como cada prato na pilha sempre possui $1$ real de crédito, quando ele for removido mais tarde por <code>POP</code> ou <code>MULTIPOP</code>, seu próprio crédito paga o custo real de $1$ da remoção! Como o número de pratos é $\\ge 0$, o crédito total é sempre $\\ge 0$, e $\\sum_{i=1}^{n} \\hat{c}_i \\le 2n = O(n)$.</li>
          <li><strong>Contabilidade no Contador Binário:</strong> Cobramos um custo amortizado de <strong>$2$ reais para colocar um bit em $1$</strong> ($0 \\to 1$) e <strong>$0$ reais para reajustar um bit para $0$</strong> ($1 \\to 0$). Quando <code>INCREMENT</code> coloca um bit em $1$ na linha 6, $1$ real paga a inversão $0 \\to 1$ e o outro $1$ real fica armazenado como crédito sobre aquele bit $1$. No laço <code>enquanto</code> (linhas 2–4), todos os bits reajustados de $1 \\to 0$ já possuem $1$ real de crédito para pagar seu próprio reajuste! Como <code>INCREMENT</code> coloca no máximo <strong>um</strong> bit em $1$ (linha 6), seu custo amortizado é no máximo $\\mathbf{2 = O(1)}$, e o crédito total na estrutura é sempre igual ao número de bits $1$ no contador ($b_i \\ge 0$).</li>
        </ul>

        <h3>4. Seção 17.3 — O Método do Potencial (pp. 381–385)</h3>
        <p>Em vez de associar trabalho pré-pago a objetos individuais da estrutura, o <strong>método do potencial</strong> representa o trabalho pré-pago como "energia potencial" de toda a estrutura de dados. Começamos com uma estrutura inicial $D_0$ e executamos $n$ operações, onde a $i$-ésima operação tem custo real $c_i$ e transforma $D_{i-1}$ em $D_i$. Uma <strong>função potencial $\\Phi$</strong> mapeia cada estado $D_i$ a um número real $\\Phi(D_i)$:</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ EQUAÇÕES 17.2 E 17.3 • MÉTODO DO POTENCIAL E SOMA TELESCÓPICA (p. 382) ]</span>
          <p>O <strong>custo amortizado $\\hat{c}_i$</strong> da $i$-ésima operação em relação à função potencial $\\Phi$ é definido por:</p>
          $$\\hat{c}_i = c_i + \\Phi(D_i) - \\Phi(D_{i-1}).$$
          <p>Somando sobre as $n$ operações, os potenciais intermediários se cancelam por <strong>soma telescópica</strong>:</p>
          $$\\sum_{i=1}^{n} \\hat{c}_i = \\sum_{i=1}^{n} \\left(c_i + \\Phi(D_i) - \\Phi(D_{i-1})\\right) = \\sum_{i=1}^{n} c_i + \\Phi(D_n) - \\Phi(D_0).$$
          <p>Se definirmos $\\Phi$ de modo que <strong>$\\Phi(D_i) \\ge \\Phi(D_0)$ para todo $i$</strong> (convencionalmente escolhendo $\\Phi(D_0) = 0$ e mostrando que $\\Phi(D_i) \\ge 0$ para todo $i$), então garantimos $\\sum_{i=1}^{n} \\hat{c}_i \\ge \\sum_{i=1}^{n} c_i$ em qualquer instante.</p>
        </div>

        <ul>
          <li><strong>Potencial na Pilha com <code>MULTIPOP</code>:</strong> Definimos $\\Phi(D_i)$ como o número de objetos na pilha ($\Phi(D_0) = 0$ e $\\Phi(D_i) \\ge 0$).
            <ul>
              <li><code>PUSH</code>: se a pilha passa de $s$ para $s+1$ objetos, $\\Delta\\Phi_i = (s+1) - s = 1$, logo $\\hat{c}_i = 1 + 1 = \\mathbf{2}$.</li>
              <li><code>MULTIPOP(S, k)</code>: desempilha $k' = \\min(k, s)$ objetos, logo $c_i = k'$ e $\\Delta\\Phi_i = -k'$, resultando em $\\hat{c}_i = k' - k' = \\mathbf{0}$ (e o mesmo vale para <code>POP</code> com $k=1$).</li>
            </ul>
          </li>
          <li><strong>Potencial no Contador Binário:</strong> Definimos $\\Phi(D_i) = b_i$, o número de bits $1$ no contador após a $i$-ésima operação. Suponha que a $i$-ésima operação <code>INCREMENT</code> reajuste $t_i$ bits de $1 \\to 0$ e coloque no máximo um bit em $1$. Então o custo real é $c_i \\le t_i + 1$ e o novo número de uns satisfaz $b_i \\le b_{i-1} - t_i + 1$, isto é, $\\Delta\\Phi_i = b_i - b_{i-1} \\le 1 - t_i$. Portanto:
            $$\\hat{c}_i = c_i + \\Phi(D_i) - \\Phi(D_{i-1}) \\le (t_i + 1) + (1 - t_i) = \\mathbf{2}.$$
            <em>E se o contador não começar em zero (p. 384)?</em> Mesmo que inicialmente o contador contenha $b_0$ uns, após $n$ incrementos temos $\\sum_{i=1}^{n} c_i = \\sum_{i=1}^{n} \\hat{c}_i - \\Phi(D_n) + \\Phi(D_0) \\le 2n - b_n + b_0 \\le 2n + k$; logo, desde que $k = O(n)$, o custo total continua $O(n)$!</li>
        </ul>
      `
    },

    /* ======================================================================
       UNIDADE 9.6 — CAPÍTULO 17, SEÇÃO 17.4 (pp. 385–397)
       ====================================================================== */
    {
      id: "u9-6",
      code: "UNIDADE 9.6 • CAP. 17 (SEÇÃO 17.4)",
      pages: "pp. 385–397",
      title: "17.4 Tabelas Dinâmicas: Expansão por Duplicação (TABLE-INSERT) e Contração em α < 1/4 (TABLE-DELETE)",
      content: `
        <p>Em muitas aplicações, não sabemos antecipadamente quantos objetos serão armazenados em uma tabela (como um vetor dinâmico ou tabela hash). Uma <strong>tabela dinâmica $T$</strong> é realocada para um tamanho maior quando fica cheia e realocada para um tamanho menor quando muitos objetos são removidos. Definimos o <strong>fator de carga $\\alpha(T) = T.\\text{num} / T.\\text{tamanho}$</strong> (com $\\alpha(T) = 1$ se $T.\\text{tamanho} = 0$).</p>

        <h3>1. Expansão de Tabela por Duplicação (<code>TABLE-INSERT</code>, pp. 385–389)</h3>
        <p>Quando tentamos inserir um item em uma tabela cheia ($T.\\text{num} == T.\\text{tamanho}$), alocamos uma nova tabela com o <strong>dobro de posições</strong> ($2 \\cdot T.\\text{tamanho}$, ou tamanho $1$ se estava vazia), copiamos os $T.\\text{num}$ itens antigos por inserções elementares e liberamos a tabela antiga:</p>
        <div class="pseudocode-block">
          <span class="pseudo-title">TABLE-INSERT(T, x) (p. 386)</span>
<pre>1  se T.tamanho == 0
2      aloque T.tabela com 1 posição
3      T.tamanho = 1
4  se T.num == T.tamanho
5      aloque nova-tabela com 2 * T.tamanho posições
6      insira todos os itens de T.tabela em nova-tabela
7      libere T.tabela
8      T.tabela = nova-tabela
9      T.tamanho = 2 * T.tamanho
10 insira x em T.tabela
11 T.num = T.num + 1</pre>
        </div>

        <h4>Análise Amortizada de <code>TABLE-INSERT</code> pelos Três Métodos</h4>
        <ol>
          <li><strong>Análise Agregada:</strong> Uma expansão só ocorre quando $i - 1$ é uma potência exata de $2$. Assim, $c_i = i$ se $i - 1 = 2^k$, e $c_i = 1$ caso contrário. O custo total de $n$ inserções é:
            $$\\sum_{i=1}^{n} c_i \\le n + \\sum_{j=0}^{\\lfloor \\lg n \\rfloor} 2^j < n + 2n = 3n \\implies \\text{custo amortizado } \\le \\mathbf{3}.$$</li>
          <li><strong>Método da Contabilidade:</strong> Cobramos $\\hat{c}_i = 3$ por inserção: $1$ real paga a inserção imediata de $x$, $1$ real fica armazenado como crédito no próprio $x$ recém-inserido (que está na metade superior da tabela), e $1$ real é doado como crédito para um dos itens que já estava na metade inferior da tabela (que não tinha crédito porque acabara de ser copiado na expansão anterior). Quando a tabela encher novamente ($T.\\text{num} = T.\\text{tamanho}$), cada um dos $T.\\text{tamanho}$ itens terá $1$ real de crédito para pagar sua cópia na próxima duplicação!</li>
          <li><strong>Método do Potencial:</strong> Queremos que $\\Phi(T) = 0$ imediatamente após uma expansão (quando $T.\\text{num} = T.\\text{tamanho}/2$) e que $\\Phi(T) = T.\\text{tamanho}$ imediatamente antes da próxima expansão (quando $T.\\text{num} = T.\\text{tamanho}$). Isso determina univocamente a função potencial (Equação 17.5, p. 388):
            $$\\Phi(T) = 2 \\cdot T.\\text{num} - T.\\text{tamanho} \\ge 0 \\quad (\\text{pois } T.\\text{num} \\ge T.\\text{tamanho}/2 \\text{ sempre}).$$
            <ul>
              <li><em>Caso 1 (Sem expansão, $s_i = s_{i-1}$):</em> $c_i = 1$ e $\\Delta\\Phi_i = (2\\text{num}_i - s_i) - (2(\\text{num}_i - 1) - s_i) = 2 \\implies \\hat{c}_i = 1 + 2 = \\mathbf{3}$.</li>
              <li><em>Caso 2 (Com expansão, $s_{i-1} = \\text{num}_{i-1} = \\text{num}_i - 1$ e $s_i = 2(\\text{num}_i - 1)$):</em> $c_i = \\text{num}_i$ e $\\Delta\\Phi_i = (2\\text{num}_i - 2\\text{num}_i + 2) - (2\\text{num}_i - 2 - \\text{num}_i + 1) = 3 - \\text{num}_i \\implies \\hat{c}_i = \\text{num}_i + (3 - \\text{num}_i) = \\mathbf{3}$!</li>
            </ul>
          </li>
        </ol>

        <h3>2. Expansão e Contração: Por que Contrair em $\\alpha < 1/4$ (e NÃO em $\\alpha < 1/2$)? (pp. 389–393)</h3>
        <div class="canonical-callout warning">
          <span class="callout-tag">[ ARMADILHA DO THRASHING • POR QUE CONTRAIR EM α < 1/2 LEVA A Θ(n) POR OPERAÇÃO (p. 389) ]</span>
          <p>Para preservar um fator de carga limitado inferiormente por uma constante positiva e ao mesmo tempo manter o custo amortizado $O(1)$, poderíamos ser tentados a dobrar a tabela quando cheia e reduzi-la à metade assim que uma remoção fizesse $\\alpha(T) < 1/2$. <strong>Isso é catastrófico!</strong></p>
          <p>Suponha $n$ uma potência de $2$: realizamos $n/2$ operações <code>I</code> (inserção), enchendo uma tabela de tamanho $n/2$. Na segunda metade das $n$ operações, executamos a sequência alternada <code>I, D, D, I, I, D, D, I, I, ...</code>: a primeira inserção expande a tabela para $n$ (custo $\\Theta(n)$); as duas remoções seguintes reduzem os itens para $n/2 - 1$, disparando uma contração para tamanho $n/2$ (custo $\\Theta(n)$); as duas inserções seguintes disparam nova expansão (custo $\\Theta(n)$), e assim por diante! O problema é que, imediatamente após uma expansão ou contração, não sobram itens/espaços suficientes para acumular crédito antes da operação inversa.</p>
          <p><strong>Solução:</strong> Permitimos que o fator de carga caia abaixo de $1/2$ e <strong>só contraímos a tabela pela metade quando uma remoção faria $\\alpha(T) < 1/4$</strong>! Assim, imediatamente após uma contração (de $s$ para $s/2$), o novo fator de carga volta a ser $\\alpha(T) = \\frac{s/4}{s/2} = \\mathbf{1/2}$ (exatamente como imediatamente após uma expansão!), mantendo sempre $1/4 \\le \\alpha(T) \\le 1$.</p>
        </div>

        <h4>A Função Potencial de Duas Ramas para <code>TABLE-INSERT</code> e <code>TABLE-DELETE</code> (Equação 17.6, p. 390)</h4>
        <p>Queremos que $\\Phi(T) = 0$ quando $\\alpha(T) = 1/2$, que $\\Phi(T) = T.\\text{num}$ quando $\\alpha(T) = 1$ (para pagar uma expansão) e que $\\Phi(T) = T.\\text{num}$ quando $\\alpha(T) = 1/4$ (para pagar uma contração):</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ EQUAÇÃO 17.6 • FUNÇÃO POTENCIAL PARA EXPANSÃO E CONTRAÇÃO (p. 390) ]</span>
          $$\\Phi(T) = \\begin{cases} 2 \\cdot T.\\text{num} - T.\\text{tamanho} & \\text{se } \\alpha(T) \\ge 1/2, \\\\ T.\\text{tamanho}/2 - T.\\text{num} & \\text{se } \\alpha(T) < 1/2. \\end{cases}$$
          <p>Com essa função potencial não negativa, o custo amortizado de <code>TABLE-INSERT</code> é no máximo <strong>$3$</strong> e o custo amortizado de <code>TABLE-DELETE</code> é no máximo <strong>$2$</strong>!</p>
          <ul>
            <li><strong>Análise de <code>TABLE-DELETE</code> quando $\\alpha_{i-1} < 1/2$ sem contração:</strong> $c_i = 1$ e $\\Phi$ aumenta em $1$ (pois $\\text{num}_i = \\text{num}_{i-1} - 1$), logo $\\hat{c}_i = 1 + 1 = \\mathbf{2}$.</li>
            <li><strong>Análise de <code>TABLE-DELETE</code> quando $\\alpha_{i-1} = 1/4$ dispara uma contração:</strong> Antes da remoção, $s_{i-1} = 4 \\cdot \\text{num}_{i-1}$ e $\\Phi_{i-1} = s_{i-1}/2 - \\text{num}_{i-1} = \\text{num}_{i-1} = \\text{num}_i + 1$. A remoção contrai a tabela para $s_i = s_{i-1}/2 = 2(\\text{num}_i + 1)$ com custo real $c_i = \\text{num}_i + 1$, e o novo potencial é $\\Phi_i = s_i/2 - \\text{num}_i = (\\text{num}_i + 1) - \\text{num}_i = 1$. Portanto:
              $$\\hat{c}_i = c_i + \\Phi_i - \\Phi_{i-1} = (\\text{num}_i + 1) + 1 - (\\text{num}_i + 1) = \\mathbf{1} \\le 2!$$</li>
            <li><strong>Análise de <code>TABLE-DELETE</code> quando $\\alpha_{i-1} \\ge 1/2$:</strong> Como $c_i = 1$ e o potencial diminui (ou cresce no máximo em $1$ se cruzar a fronteira $\\alpha = 1/2$), em todos os subcasos $\\hat{c}_i \\le 2$. Portanto, qualquer sequência de $n$ operações <code>TABLE-INSERT</code> e <code>TABLE-DELETE</code> executa em tempo total $\\mathbf{O(n)}$! $\\blacksquare$</li>
          </ul>
        </div>
      `
    }
  ];

  /* ========================================================================
     WORKBENCH INTERATIVO DUPLO DO MÓDULO 09
     (1) Simulador de Programação Dinâmica: Corte de Hastes & LCS-LENGTH
     (2) Simulador de Análise Amortizada: Tabela Dinâmica (Expansão/Contração) & Contador Binário
     ======================================================================== */
  function initWorkbenches() {
    const mount = document.getElementById("workbench-mod9-mount");
    if (!mount) return;

    mount.innerHTML = `
      <div class="workbench-container" style="margin: 2rem 0;">
        <div class="workbench-header">
          <span class="workbench-badge">[ LABORATÓRIO INTERATIVO • CAPÍTULOS 15, 16 E 17 ]</span>
          <h3 class="workbench-title">Bancada Dupla: (1) Programação Dinâmica (Corte de Hastes & LCS) e (2) Análise Amortizada (Tabela Dinâmica & Contador Binário)</h3>
          <p class="workbench-desc">
            Explore interativamente o preenchimento das tabelas <em>bottom-up</em> de Programação Dinâmica com reconstrução da solução ótima e acompanhe passo a passo o custo real $c_i$, a variação do potencial $\\Delta\\Phi_i$ e o custo amortizado constante $\\hat{c}_i$ na Análise Amortizada.
          </p>
        </div>

        <!-- PARTE 1: SIMULADOR DE PROGRAMAÇÃO DINÂMICA (CORTE DE HASTES E LCS) -->
        <div style="border: 1px solid var(--border-subtle); border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem; background: rgba(15,23,42,0.45);">
          <h4 style="margin-top:0; color: var(--amber);">1. Simulador de Programação Dinâmica: <code>EXTENDED-BOTTOM-UP-CUT-ROD</code> & <code>LCS-LENGTH</code></h4>
          <div class="workbench-controls" style="display:flex; flex-wrap:wrap; gap:1rem; align-items:flex-end; margin-bottom:1rem;">
            <label style="display:flex; flex-direction:column; gap:0.35rem; font-size:0.85rem;">
              <span><strong>Modo de Programação Dinâmica:</strong></span>
              <select id="mod9-dp-mode" onchange="window.updateMod9DPSim()" style="padding:0.45rem; border-radius:6px; background:#0f172a; color:#f8fafc; border:1px solid #334155;">
                <option value="rod">15.1 Corte de Hastes (EXTENDED-BOTTOM-UP-CUT-ROD)</option>
                <option value="lcs">15.4 Subsequência Comum Mais Longa (LCS-LENGTH & PRINT-LCS)</option>
              </select>
            </label>

            <div id="mod9-rod-controls" style="display:flex; flex-wrap:wrap; gap:1rem; align-items:flex-end;">
              <label style="display:flex; flex-direction:column; gap:0.35rem; font-size:0.85rem;">
                <span><strong>Comprimento da Haste n (1 a 10):</strong> <strong id="mod9-rod-n-val">7</strong></span>
                <input type="range" id="mod9-rod-n" min="1" max="10" step="1" value="7" oninput="window.updateMod9DPSim()" />
              </label>
              <label style="display:flex; flex-direction:column; gap:0.35rem; font-size:0.85rem;">
                <span><strong>Custo por Corte c (Ex. 15.1-3):</strong> <strong id="mod9-rod-c-val">0</strong></span>
                <input type="range" id="mod9-rod-c" min="0" max="4" step="1" value="0" oninput="window.updateMod9DPSim()" />
              </label>
            </div>

            <div id="mod9-lcs-controls" style="display:none; flex-wrap:wrap; gap:1rem; align-items:flex-end;">
              <label style="display:flex; flex-direction:column; gap:0.35rem; font-size:0.85rem;">
                <span><strong>Sequência X:</strong></span>
                <input type="text" id="mod9-lcs-x" value="ABCBDAB" maxlength="10" oninput="window.updateMod9DPSim()" style="padding:0.45rem; border-radius:6px; background:#0f172a; color:#f8fafc; border:1px solid #334155; font-family:var(--font-mono); width:130px;" />
              </label>
              <label style="display:flex; flex-direction:column; gap:0.35rem; font-size:0.85rem;">
                <span><strong>Sequência Y:</strong></span>
                <input type="text" id="mod9-lcs-y" value="BDCABA" maxlength="10" oninput="window.updateMod9DPSim()" style="padding:0.45rem; border-radius:6px; background:#0f172a; color:#f8fafc; border:1px solid #334155; font-family:var(--font-mono); width:130px;" />
              </label>
              <button class="btn-secondary" onclick="window.setMod9LCSPreset('clrs')" style="padding:0.45rem 0.75rem;">Exemplo Fig. 15.8 (ABCBDAB / BDCABA)</button>
              <button class="btn-secondary" onclick="window.setMod9LCSPreset('ex1541')" style="padding:0.45rem 0.75rem;">Ex. 15.4-1 (10010101 / 010110110)</button>
            </div>
          </div>

          <div id="mod9-dp-telemetry" class="telemetry-grid" style="margin-bottom: 1rem;"></div>
          <div id="mod9-dp-output" style="overflow-x:auto;"></div>
        </div>

        <!-- PARTE 2: SIMULADOR DE ANÁLISE AMORTIZADA (TABELA DINÂMICA E CONTADOR BINÁRIO) -->
        <div style="border: 1px solid var(--border-subtle); border-radius: 8px; padding: 1.25rem; background: rgba(15,23,42,0.45);">
          <h4 style="margin-top:0; color: var(--emerald);">2. Simulador de Análise Amortizada (Método do Potencial): Tabela Dinâmica ($\\alpha &lt; 1/4$) & Contador Binário</h4>
          <div class="workbench-controls" style="display:flex; flex-wrap:wrap; gap:0.75rem; align-items:center; margin-bottom:1rem;">
            <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem;">
              <span><strong>Estrutura:</strong></span>
              <select id="mod9-amort-mode" onchange="window.resetMod9AmortSim()" style="padding:0.45rem; border-radius:6px; background:#0f172a; color:#f8fafc; border:1px solid #334155;">
                <option value="table">17.4 Tabela Dinâmica (TABLE-INSERT e TABLE-DELETE com α &lt; 1/4)</option>
                <option value="counter">17.1–17.3 Contador Binário de 6 Bits (INCREMENT)</option>
              </select>
            </label>
            <button id="mod9-btn-insert" class="btn-primary" onclick="window.stepMod9Amort('insert')" style="padding:0.45rem 0.85rem;">+ Executar TABLE-INSERT</button>
            <button id="mod9-btn-delete" class="btn-secondary" onclick="window.stepMod9Amort('delete')" style="padding:0.45rem 0.85rem;">− Executar TABLE-DELETE</button>
            <button id="mod9-btn-burst" class="btn-secondary" onclick="window.stepMod9Amort('burst')" style="padding:0.45rem 0.85rem;">⚡ Inserir 9 Itens + Remover 7 Itens</button>
            <button class="btn-secondary" onclick="window.resetMod9AmortSim()" style="padding:0.45rem 0.85rem;">↺ Reiniciar Sequência</button>
          </div>

          <div id="mod9-amort-telemetry" class="telemetry-grid" style="margin-bottom: 1rem;"></div>
          <div id="mod9-amort-output" style="overflow-x:auto;"></div>
        </div>
      </div>
    `;

    const prices = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 30];

    window.setMod9LCSPreset = function (preset) {
      const xIn = document.getElementById("mod9-lcs-x");
      const yIn = document.getElementById("mod9-lcs-y");
      if (!xIn || !yIn) return;
      if (preset === "clrs") {
        xIn.value = "ABCBDAB";
        yIn.value = "BDCABA";
      } else {
        xIn.value = "10010101";
        yIn.value = "010110110";
      }
      window.updateMod9DPSim();
    };

    window.updateMod9DPSim = function () {
      const modeSel = document.getElementById("mod9-dp-mode");
      const rodCtrl = document.getElementById("mod9-rod-controls");
      const lcsCtrl = document.getElementById("mod9-lcs-controls");
      const telem = document.getElementById("mod9-dp-telemetry");
      const out = document.getElementById("mod9-dp-output");
      if (!modeSel || !rodCtrl || !lcsCtrl || !telem || !out) return;

      const mode = modeSel.value;
      if (mode === "rod") {
        rodCtrl.style.display = "flex";
        lcsCtrl.style.display = "none";

        const nIn = document.getElementById("mod9-rod-n");
        const cIn = document.getElementById("mod9-rod-c");
        const n = parseInt(nIn.value, 10);
        const cCost = parseInt(cIn.value, 10);
        document.getElementById("mod9-rod-n-val").textContent = String(n);
        document.getElementById("mod9-rod-c-val").textContent = String(cCost);

        const r = new Array(n + 1).fill(0);
        const s = new Array(n + 1).fill(0);
        for (let j = 1; j <= n; j++) {
          let q = -Infinity;
          for (let i = 1; i <= j; i++) {
            const cutPenalty = i < j ? cCost : 0;
            const cand = prices[i] + r[j - i] - cutPenalty;
            if (cand > q) {
              q = cand;
              s[j] = i;
            }
          }
          r[j] = q;
        }

        const pieces = [];
        let rem = n;
        while (rem > 0) {
          pieces.push(s[rem]);
          rem -= s[rem];
        }

        telem.innerHTML = `
          <div class="telemetry-card">
            <span class="telemetry-label">RECEITA MÁXIMA r[${n}]</span>
            <span class="telemetry-val" style="color:var(--emerald);">R$ ${r[n]}</span>
          </div>
          <div class="telemetry-card">
            <span class="telemetry-label">DECOMPOSIÇÃO ÓTIMA (PRINT-CUT-ROD-SOLUTION)</span>
            <span class="telemetry-val">${n} = ${pieces.join(" + ")} (${pieces.length - 1} corte(s))</span>
          </div>
          <div class="telemetry-card">
            <span class="telemetry-label">CHAMADAS CUT-ROD INGÊNUO VS. PD</span>
            <span class="telemetry-val">2^${n} = ${Math.pow(2, n)} chamadas vs. ${(n * (n + 1)) / 2} iterações</span>
          </div>
        `;

        let th = "<th>Índice j</th>";
        let trP = "<td><strong>Preço p[j]</strong></td>";
        let trR = "<td><strong>Receita Ótima r[j]</strong></td>";
        let trS = "<td><strong>1º Pedaço Ótimo s[j]</strong></td>";
        for (let j = 0; j <= n; j++) {
          const highlight = j === n ? "background:rgba(16,185,129,0.16);" : "";
          th += `<th style="${highlight}">${j}</th>`;
          trP += `<td style="font-family:var(--font-mono);${highlight}">${j === 0 ? "—" : prices[j]}</td>`;
          trR += `<td style="font-family:var(--font-mono);font-weight:700;color:var(--emerald);${highlight}">${r[j]}</td>`;
          trS += `<td style="font-family:var(--font-mono);font-weight:700;color:var(--amber);${highlight}">${j === 0 ? "—" : s[j]}</td>`;
        }

        out.innerHTML = `
          <table class="clrs-cost-table">
            <thead><tr>${th}</tr></thead>
            <tbody>
              <tr>${trP}</tr>
              <tr>${trR}</tr>
              <tr>${trS}</tr>
            </tbody>
          </table>
        `;
      } else {
        rodCtrl.style.display = "none";
        lcsCtrl.style.display = "flex";

        const rawX = (document.getElementById("mod9-lcs-x").value || "ABCBDAB").toUpperCase().trim();
        const rawY = (document.getElementById("mod9-lcs-y").value || "BDCABA").toUpperCase().trim();
        const X = rawX.slice(0, 10);
        const Y = rawY.slice(0, 10);
        const m = X.length;
        const n = Y.length;

        const c = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
        const b = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(""));

        for (let i = 1; i <= m; i++) {
          for (let j = 1; j <= n; j++) {
            if (X[i - 1] === Y[j - 1]) {
              c[i][j] = c[i - 1][j - 1] + 1;
              b[i][j] = "↖";
            } else if (c[i - 1][j] >= c[i][j - 1]) {
              c[i][j] = c[i - 1][j];
              b[i][j] = "↑";
            } else {
              c[i][j] = c[i][j - 1];
              b[i][j] = "←";
            }
          }
        }

        const onPath = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
        const lcsChars = [];
        let pi = m;
        let pj = n;
        onPath[pi][pj] = true;
        while (pi > 0 && pj > 0) {
          onPath[pi][pj] = true;
          if (b[pi][pj] === "↖") {
            lcsChars.push(X[pi - 1]);
            pi--;
            pj--;
          } else if (b[pi][pj] === "↑") {
            pi--;
          } else {
            pj--;
          }
          onPath[pi][pj] = true;
        }
        lcsChars.reverse();

        telem.innerHTML = `
          <div class="telemetry-card">
            <span class="telemetry-label">COMPRIMENTO DA LCS c[${m}, ${n}]</span>
            <span class="telemetry-val" style="color:var(--emerald);">${c[m][n]}</span>
          </div>
          <div class="telemetry-card">
            <span class="telemetry-label">SUBSEQUÊNCIA RECONSTRUÍDA (PRINT-LCS)</span>
            <span class="telemetry-val" style="color:var(--amber);">⟨${lcsChars.join(", ")}⟩</span>
          </div>
          <div class="telemetry-card">
            <span class="telemetry-label">CUSTO TABULAR Θ(mn)</span>
            <span class="telemetry-val">${m} × ${n} = ${m * n} células avaliadas</span>
          </div>
        `;

        let headHtml = "<th>i \\ j</th><th>j = 0 (∅)</th>";
        for (let j = 1; j <= n; j++) {
          headHtml += `<th>j = ${j} (${Y[j - 1]})</th>`;
        }

        let bodyHtml = "";
        for (let i = 0; i <= m; i++) {
          let row = `<td><strong>i = ${i} (${i === 0 ? "∅" : X[i - 1]})</strong></td>`;
          for (let j = 0; j <= n; j++) {
            const active = onPath[i][j];
            const isMatch = active && b[i][j] === "↖";
            const bg = isMatch
              ? "background:rgba(16,185,129,0.25);border:1px solid var(--emerald);"
              : active
              ? "background:rgba(245,158,11,0.16);"
              : "";
            row += `<td style="font-family:var(--font-mono);text-align:center;${bg}">${b[i][j] ? `<span style="color:var(--amber);margin-right:4px;">${b[i][j]}</span>` : ""}<strong>${c[i][j]}</strong></td>`;
          }
          bodyHtml += `<tr>${row}</tr>`;
        }

        out.innerHTML = `
          <table class="clrs-cost-table">
            <thead><tr>${headHtml}</tr></thead>
            <tbody>${bodyHtml}</tbody>
          </table>
        `;
      }
    };

    /* Estado do Simulador de Análise Amortizada */
    let amortHistory = [];
    let tblNum = 0;
    let tblSize = 0;
    let counterVal = 0;

    function calcTablePotential(num, size) {
      if (size === 0) return 0;
      const alpha = num / size;
      if (alpha >= 0.5) return 2 * num - size;
      return size / 2 - num;
    }

    function countOnes(x) {
      let c = 0;
      let v = x;
      while (v > 0) {
        c += v & 1;
        v >>= 1;
      }
      return c;
    }

    window.resetMod9AmortSim = function () {
      amortHistory = [];
      tblNum = 0;
      tblSize = 0;
      counterVal = 0;
      const mode = document.getElementById("mod9-amort-mode")?.value || "table";
      const btnIns = document.getElementById("mod9-btn-insert");
      const btnDel = document.getElementById("mod9-btn-delete");
      const btnBurst = document.getElementById("mod9-btn-burst");
      if (btnIns && btnDel && btnBurst) {
        if (mode === "table") {
          btnIns.textContent = "+ Executar TABLE-INSERT";
          btnDel.style.display = "inline-block";
          btnBurst.textContent = "⚡ Inserir 9 Itens + Remover 7 Itens";
        } else {
          btnIns.textContent = "+ Executar INCREMENT(A)";
          btnDel.style.display = "none";
          btnBurst.textContent = "⚡ Executar 8 INCREMENTs Seguidos";
        }
      }
      if (mode === "table") {
        for (let k = 0; k < 5; k++) window.stepMod9Amort("insert", true);
      } else {
        for (let k = 0; k < 5; k++) window.stepMod9Amort("insert", true);
      }
      window.renderMod9Amort();
    };

    window.stepMod9Amort = function (action, skipRender) {
      const mode = document.getElementById("mod9-amort-mode")?.value || "table";
      if (action === "burst") {
        if (mode === "table") {
          for (let i = 0; i < 9; i++) window.stepMod9Amort("insert", true);
          for (let i = 0; i < 7; i++) window.stepMod9Amort("delete", true);
        } else {
          for (let i = 0; i < 8; i++) window.stepMod9Amort("insert", true);
        }
        window.renderMod9Amort();
        return;
      }

      if (mode === "table") {
        const phiPrev = calcTablePotential(tblNum, tblSize);
        if (action === "insert") {
          let realCost = 1;
          let eventDesc = "Inserção simples";
          if (tblSize === 0) {
            tblSize = 1;
            eventDesc = "Alocação inicial (tamanho = 1)";
          } else if (tblNum === tblSize) {
            realCost = tblNum + 1;
            tblSize = tblSize * 2;
            eventDesc = `EXPANSÃO 2× (${tblNum} cópias + 1 inserção → tam = ${tblSize})`;
          }
          tblNum += 1;
          const phiNow = calcTablePotential(tblNum, tblSize);
          const dPhi = phiNow - phiPrev;
          const cHat = realCost + dPhi;
          amortHistory.push({
            step: amortHistory.length + 1,
            op: "TABLE-INSERT",
            state: `num=${tblNum}, tam=${tblSize} (α=${(tblNum / tblSize).toFixed(2)})`,
            event: eventDesc,
            cReal: realCost,
            phi: phiNow,
            dPhi: dPhi,
            cHat: cHat
          });
        } else if (action === "delete" && tblNum > 0) {
          let realCost = 1;
          let eventDesc = "Remoção simples";
          tblNum -= 1;
          if (tblSize > 1 && tblNum / tblSize < 0.25) {
            realCost = tblNum + 1;
            tblSize = Math.max(1, tblSize / 2);
            eventDesc = `CONTRAÇÃO ½× em α < 1/4 (${tblNum} cópias + 1 remoção → tam = ${tblSize})`;
          }
          const phiNow = calcTablePotential(tblNum, tblSize);
          const dPhi = phiNow - phiPrev;
          const cHat = realCost + dPhi;
          amortHistory.push({
            step: amortHistory.length + 1,
            op: "TABLE-DELETE",
            state: `num=${tblNum}, tam=${tblSize} (α=${(tblNum / tblSize).toFixed(2)})`,
            event: eventDesc,
            cReal: realCost,
            phi: phiNow,
            dPhi: dPhi,
            cHat: cHat
          });
        }
      } else {
        const phiPrev = countOnes(counterVal);
        const prevVal = counterVal;
        counterVal = (counterVal + 1) % 64;
        const xorBits = prevVal ^ counterVal;
        const realCost = countOnes(xorBits);
        const phiNow = countOnes(counterVal);
        const dPhi = phiNow - phiPrev;
        const cHat = realCost + dPhi;
        const binStr = counterVal.toString(2).padStart(6, "0");
        amortHistory.push({
          step: amortHistory.length + 1,
          op: "INCREMENT(A)",
          state: `${binStr}₂ (decimal ${counterVal})`,
          event: `${realCost - 1} bit(s) 1→0 reajustado(s) + ${counterVal === 0 ? "0" : "1"} bit 0→1`,
          cReal: realCost,
          phi: phiNow,
          dPhi: dPhi,
          cHat: cHat
        });
      }

      if (!skipRender) window.renderMod9Amort();
    };

    window.renderMod9Amort = function () {
      const telem = document.getElementById("mod9-amort-telemetry");
      const out = document.getElementById("mod9-amort-output");
      if (!telem || !out) return;

      const totalReal = amortHistory.reduce((acc, r) => acc + r.cReal, 0);
      const totalAmort = amortHistory.reduce((acc, r) => acc + r.cHat, 0);
      const lastPhi = amortHistory.length > 0 ? amortHistory[amortHistory.length - 1].phi : 0;

      telem.innerHTML = `
        <div class="telemetry-card">
          <span class="telemetry-label">OPERAÇÕES EXECUTADAS (n)</span>
          <span class="telemetry-val">${amortHistory.length}</span>
        </div>
        <div class="telemetry-card">
          <span class="telemetry-label">CUSTO REAL ACUMULADO ∑ c_i</span>
          <span class="telemetry-val">${totalReal} (média ${(totalReal / Math.max(1, amortHistory.length)).toFixed(2)})</span>
        </div>
        <div class="telemetry-card">
          <span class="telemetry-label">SOMA TELESCÓPICA ∑ ĉ_i = ∑ c_i + Φ_n</span>
          <span class="telemetry-val" style="color:var(--emerald);">∑ ĉ_i = ${totalAmort} = ${totalReal} + ${lastPhi} ≥ ∑ c_i</span>
        </div>
      `;

      let rows = "";
      amortHistory.forEach((h) => {
        const isHeavy = h.cReal > 1;
        rows += `
          <tr style="${isHeavy ? "background:rgba(245,158,11,0.12);" : ""}">
            <td style="font-family:var(--font-mono);">${h.step}</td>
            <td style="font-family:var(--font-mono);font-weight:700;">${h.op}</td>
            <td style="font-family:var(--font-mono);">${h.state}</td>
            <td>${h.event}</td>
            <td style="font-family:var(--font-mono);font-weight:700;color:${isHeavy ? "var(--amber)" : "inherit"};">${h.cReal}</td>
            <td style="font-family:var(--font-mono);">${h.phi}</td>
            <td style="font-family:var(--font-mono);">${h.dPhi >= 0 ? "+" + h.dPhi : h.dPhi}</td>
            <td style="font-family:var(--font-mono);font-weight:700;color:var(--emerald);">${h.cHat}</td>
          </tr>
        `;
      });

      out.innerHTML = `
        <table class="clrs-cost-table">
          <thead>
            <tr>
              <th>i</th>
              <th>Operação</th>
              <th>Estado D_i</th>
              <th>Evento Estrutural</th>
              <th>Custo Real c_i</th>
              <th>Potencial Φ(D_i)</th>
              <th>ΔΦ_i</th>
              <th>Custo Amortizado ĉ_i</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    };

    window.updateMod9DPSim();
    window.resetMod9AmortSim();
  }

  /* ========================================================================
     SEÇÃO 3: QUIZZES COMENTADOS (10 QUESTÕES — CAPÍTULOS 15, 16 E 17)
     ======================================================================== */
  const quizzes = [
    {
      id: "q9-1",
      type: "Múltipla Escolha",
      reference: "Cap. 15, Seção 15.1 (pp. 303–308) e Exercício 15.1-1",
      question:
        "No problema do corte de hastes (Seção 15.1), por que o procedimento recursivo ingênuo CUT-ROD(p, n) executa em tempo exponencial T(n) = 2^n, enquanto tanto MEMOIZED-CUT-ROD(p, n) quanto BOTTOM-UP-CUT-ROD(p, n) executam em tempo Θ(n²)?",
      options: [
        {
          letter: "A",
          text: "Porque CUT-ROD utiliza variáveis globais que dobram a cada chamada, enquanto BOTTOM-UP-CUT-ROD usa apenas uma escolha gulosa por tamanho.",
          isCorrect: false,
          explanation:
            "Incorreta. Nem CUT-ROD usa variáveis globais nem BOTTOM-UP-CUT-ROD é um algoritmo guloso (ele avalia todas as j escolhas i = 1..j para cada subproblema j)."
        },
        {
          letter: "B",
          text: "Porque CUT-ROD(p, n) chama recursivamente CUT-ROD(p, j) para todo j = 0, 1, ..., n - 1 sem armazenar resultados, gerando a recorrência T(n) = 1 + ∑_{j=0}^{n-1} T(j) = 2^n (uma árvore de recursão com 2^{n-1} folhas correspondente a todos os cortes possíveis); já as versões de programação dinâmica resolvem cada um dos n + 1 subproblemas distintos (tamanhos 0..n) exatamente uma vez, somando ∑_{j=1}^n j = Θ(n²) iterações.",
          isCorrect: true,
          explanation:
            "Correta! Como demonstrado nas pp. 303–307, há apenas n + 1 subproblemas distintos, mas eles se superpõem intensamente. Ao salvar r[j] na primeira vez em que é calculado, cada aresta do grafo de subproblemas é percorrida apenas uma vez, reduzindo 2^n para n(n+1)/2 = Θ(n²)."
        },
        {
          letter: "C",
          text: "Porque MEMOIZED-CUT-ROD é assintoticamente mais rápido que BOTTOM-UP-CUT-ROD, rodando em Θ(n lg n) graças ao uso de tabelas hash.",
          isCorrect: false,
          explanation:
            "Incorreta. Ambas as versões (memoizada top-down e bottom-up) possuem exatamente o mesmo tempo de execução assintótico Θ(n²), sendo que a versão bottom-up tem fatores constantes melhores por evitar a sobrecarga de chamadas recursivas (p. 305)."
        },
        {
          letter: "D",
          text: "Porque a recorrência r_n = max_{1≤i≤n}(p_i + r_{n-i}) só é válida para algoritmos de baixo para cima.",
          isCorrect: false,
          explanation:
            "Incorreta. A Equação (15.2) é a base matemática tanto de CUT-ROD quanto de MEMOIZED-CUT-ROD e BOTTOM-UP-CUT-ROD."
        }
      ]
    },
    {
      id: "q9-2",
      type: "Múltipla Escolha",
      reference: "Cap. 15, Seção 15.2 (pp. 309–316)",
      question:
        "Considere o procedimento MATRIX-CHAIN-ORDER(p) para parentizar otimamente uma cadeia A₁A₂...A_n de n matrizes, onde A_i tem dimensão p_{i-1} × p_i. Assinale a alternativa CORRETA sobre a ordem de preenchimento da tabela m[1..n, 1..n] e sua complexidade:",
      options: [
        {
          letter: "A",
          text: "O algoritmo preenche a tabela linha por linha (i = 1 até n) e coluna por coluna (j = i até n), executando em tempo Θ(n²) e espaço Θ(n).",
          isCorrect: false,
          explanation:
            "Incorreta! Preencher na ordem i = 1..n crescente falharia porque m[i, j] depende de m[k+1, j] (que está em uma linha inferior k+1 > i!). Além disso, o tempo é Θ(n³) e o espaço é Θ(n²)."
        },
        {
          letter: "B",
          text: "O algoritmo preenche a tabela por diagonais em ordem crescente do comprimento da subcadeia l = j - i + 1 (de l = 2 até n), avaliando para cada par (i, j) todas as l - 1 possíveis posições de corte k ∈ {i, ..., j - 1} pela recorrência m[i, j] = min_{i≤k<j} {m[i, k] + m[k+1, j] + p_{i-1}p_kp_j}, com tempo Θ(n³) e espaço Θ(n²).",
          isCorrect: true,
          explanation:
            "Correta! Como qualquer corte k divide uma cadeia de comprimento l em duas subcadeias de comprimentos estritamente menores que l, iterar sobre l = 2..n garante que m[i, k] e m[k+1, j] já estão calculados, consumindo ∑_{l=2}^n (n - l + 1)(l - 1) = (n³ - n)/6 = Θ(n³) tempo e Θ(n²) espaço (pp. 313–315)."
        },
        {
          letter: "C",
          text: "MATRIX-CHAIN-ORDER realiza efetivamente as multiplicações das matrizes A₁...A_n durante a execução de seus três laços aninhados.",
          isCorrect: false,
          explanation:
            "Incorreta. MATRIX-CHAIN-ORDER apenas determina a ordem ótima de parentização (nas tabelas m e s) usando apenas as dimensões p₀..p_n, sem multiplicar nenhum elemento das matrizes."
        },
        {
          letter: "D",
          text: "O número total de parentizações completas distintas de n matrizes é Θ(n³), razão pela qual a programação dinâmica leva tempo cúbico.",
          isCorrect: false,
          explanation:
            "Incorreta. O número de parentizações é dado pelos números de Catalan P(n) = Ω(4^n / n^{3/2}); a programação dinâmica leva Θ(n³) justamente porque evita enumerar as parentizações exponenciais."
        }
      ]
    },
    {
      id: "q9-3",
      type: "Verdadeiro ou Falso",
      reference: "Cap. 15, Seção 15.3 (pp. 320–322 e Figura 15.6)",
      question:
        "Julgue a afirmação a seguir sobre subestrutura ótima e independência de subproblemas em grafos orientados: 'Assim como o problema do Caminho Simples Mais Curto sem pesos negativos exibe subestrutura ótima (qualquer subcaminho de um caminho mais curto é ele próprio um caminho mais curto), o problema do Caminho Simples Mais Longo em um grafo orientado geral também possui subestrutura ótima e subproblemas independentes, podendo ser resolvido em tempo polinomial pela mesma recorrência trocando min por max.'",
      options: [
        {
          letter: "V",
          text: "Verdadeiro — trocar min por max preserva tanto a subestrutura ótima quanto a independência dos subproblemas.",
          isCorrect: false,
          explanation:
            "Incorreta! A afirmação é FALSA. O Caminho Simples Mais Longo é NP-completo e viola ambos os requisitos (pp. 320–322)."
        },
        {
          letter: "F",
          text: "Falso — o problema do Caminho Simples Mais Longo NÃO possui subestrutura ótima (como mostra o grafo da Figura 15.6, onde q → r → t é o caminho simples mais longo de q a t, mas q → r não é o mais longo de q a r, que seria q → s → t → r) e seus subproblemas NÃO são independentes, pois usar um vértice em um subcaminho proíbe que o subcaminho complementar o reutilize sob pena de formar ciclos.",
          isCorrect: true,
          explanation:
            "Correta! Na Seção 15.3 (pp. 320–322), os autores usam exatamente esse contraste para ensinar que a subestrutura ótima exige que os recursos consumidos por um subproblema (neste caso, vértices do grafo) não inviabilizem as soluções dos demais subproblemas."
        }
      ]
    },
    {
      id: "q9-4",
      type: "Múltipla Escolha",
      reference: "Cap. 15, Seção 15.4 (pp. 328–332) — Teorema 15.1",
      question:
        "No algoritmo LCS-LENGTH(X, Y) para encontrar uma Subsequência Comum Mais Longa de X = ⟨x₁, ..., x_m⟩ e Y = ⟨y₁, ..., y_n⟩, quando avaliamos a célula c[i, j] e constatamos que x_i == y_j, por que a recorrência define simplesmente c[i, j] = c[i - 1, j - 1] + 1 sem precisar comparar com c[i - 1, j] nem com c[i, j - 1]?",
      options: [
        {
          letter: "A",
          text: "Porque pelo item (1) do Teorema 15.1, se x_i = y_j, então qualquer LCS de X_i e Y_j deve terminar com o caractere comum x_i = y_j precedido por uma LCS de X_{i-1} e Y_{j-1} (como provado por recortar e colar), o que elimina a necessidade de examinar os subproblemas (i - 1, j) e (i, j - 1).",
          isCorrect: true,
          explanation:
            "Correta! Se x_i = y_j, anexar esse caractere a qualquer subsequência comum de X_{i-1} e Y_{j-1} sempre aumenta o comprimento em 1, e c[i-1, j-1] + 1 é garantidamente ≥ max(c[i-1, j], c[i, j-1]). Isso exemplifica como refinar a subestrutura ótima reduz o número de escolhas por estado (p. 329)."
        },
        {
          letter: "B",
          text: "Porque x_i == y_j só ocorre na diagonal principal i == j da tabela c.",
          isCorrect: false,
          explanation:
            "Incorreta. Caracteres iguais podem ocorrer em quaisquer coordenadas (i, j) da matriz m × n."
        },
        {
          letter: "C",
          text: "Porque se x_i == y_j, os valores c[i - 1, j] e c[i, j - 1] ainda não foram calculados na ordem de preenchimento linha a linha.",
          isCorrect: false,
          explanation:
            "Incorreta. Tanto c[i-1, j] (linha anterior) quanto c[i, j-1] (coluna anterior da mesma linha) já estão calculados, mas o Teorema 15.1 mostra que são desnecessários quando x_i = y_j."
        },
        {
          letter: "D",
          text: "Porque o algoritmo é guloso e descarta permanentemente os prefixos anteriores sempre que encontra uma igualdade.",
          isCorrect: false,
          explanation:
            "Incorreta. LCS-LENGTH é um algoritmo de programação dinâmica que preenche todas as mn células da tabela."
        }
      ]
    },
    {
      id: "q9-5",
      type: "Múltipla Escolha",
      reference: "Cap. 15, Seção 15.5 (pp. 333–338)",
      question:
        "Na construção de uma Árvore de Busca Binária Ótima (OPTIMAL-BST, Seção 15.5) para as chaves k_i, ..., k_j e folhas fictícias d_{i-1}, ..., d_j, a recorrência do custo esperado mínimo ao escolher k_r como raiz é e[i, j] = min_{i≤r≤j} {e[i, r - 1] + e[r + 1, j] + w(i, j)}, onde w(i, j) = ∑_{l=i}^j p_l + ∑_{l=i-1}^j q_l. De onde surge exatamente o termo adicional w(i, j) nessa equação?",
      options: [
        {
          letter: "A",
          text: "É o custo de realizar rotações LEFT-ROTATE e RIGHT-ROTATE para balancear a subárvore.",
          isCorrect: false,
          explanation:
            "Incorreta. OPTIMAL-BST constrói uma árvore estática ótima sem realizar rotações."
        },
        {
          letter: "B",
          text: "Quando as subárvores contendo k_i..k_{r-1} e k_{r+1}..k_j tornam-se subárvores filhas da nova raiz k_r, a profundidade de cada nó (real e fictício) em ambas as subárvores aumenta em 1, aumentando o custo esperado de cada subárvore por w(i, r - 1) e w(r + 1, j), respectivamente; somando o custo 1 · p_r da própria raiz k_r, obtemos w(i, r - 1) + p_r + w(r + 1, j) = w(i, j).",
          isCorrect: true,
          explanation:
            "Correta! Esta é a dedução exata das Equações (15.13) e (15.14) na página 336: cada nível adicional de profundidade acrescenta 1 vez a probabilidade de cada nó da subárvore ao número esperado de comparações."
        },
        {
          letter: "C",
          text: "Porque w(i, j) vale sempre 1 para quaisquer índices i e j.",
          isCorrect: false,
          explanation:
            "Incorreta. Apenas para a árvore completa (i = 1, j = n) temos w(1, n) = 1; para subárvores próprias, w(i, j) < 1."
        },
        {
          letter: "D",
          text: "Para penalizar árvores cuja raiz k_r não seja a chave de maior probabilidade p_r.",
          isCorrect: false,
          explanation:
            "Incorreta. Como w(i, j) não depende da escolha do índice r ∈ {i, ..., j}, ele é constante em relação à minimização sobre r."
        }
      ]
    },
    {
      id: "q9-6",
      type: "Múltipla Escolha",
      reference: "Cap. 16, Seções 16.1 e 16.2 (pp. 342–353)",
      question:
        "Sobre o Problema de Seleção de Atividades (Seção 16.1) e a comparação entre os problemas da Mochila 0-1 e da Mochila Fracionária (Seção 16.2), assinale a alternativa CORRETA:",
      options: [
        {
          letter: "A",
          text: "Escolher primeiro a atividade de menor duração (f_i - s_i mínima) ou a atividade que começa mais cedo (s_i mínimo) sempre produz um subconjunto máximo de atividades compatíveis.",
          isCorrect: false,
          explanation:
            "Incorreta! Como o Exercício 16.1-3 demonstra, escolher a menor duração falha (ex.: {[1, 5), [4, 7), [6, 10)} onde [4, 7) tem duração 3 mas bloqueia as outras duas!), e escolher o menor início falha se a primeira atividade for muito longa (ex.: {[0, 10), [1, 2), [3, 4)})."
        },
        {
          letter: "B",
          text: "Pelo Teorema 16.1, qualquer subproblema não vazio S_k possui uma solução ótima que inclui a atividade a_m ∈ S_k com o menor tempo de término f_m (ou, simetricamente, a atividade com o último tempo de início s_m), deixando apenas um único subproblema S_m a resolver; já na Mochila 0-1, escolher o item de maior razão v_i / w_i falha porque a impossibilidade de fracionar itens pode deixar capacidade ociosa que reduz o valor efetivo da carga.",
          isCorrect: true,
          explanation:
            "Correta! O Teorema 16.1 prova que a escolha gulosa por término mais cedo é sempre segura na Seleção de Atividades, e a Figura 16.2 (p. 352) ilustra exatamente por que a capacidade ociosa invalida a escolha gulosa na Mochila 0-1, mas não na Mochila Fracionária."
        },
        {
          letter: "C",
          text: "Nem a Mochila 0-1 nem a Mochila Fracionária possuem a propriedade de subestrutura ótima.",
          isCorrect: false,
          explanation:
            "Incorreta. Ambas as variantes da mochila exibem subestrutura ótima (p. 351); a diferença é que apenas a Fracionária exibe também a propriedade de escolha gulosa."
        },
        {
          letter: "D",
          text: "GREEDY-ACTIVITY-SELECTOR exige tempo Θ(n²) mesmo quando as atividades já estão ordenadas por tempo de término.",
          isCorrect: false,
          explanation:
            "Incorreta. Quando as atividades já estão ordenadas por f_1 ≤ ... ≤ f_n, GREEDY-ACTIVITY-SELECTOR executa em tempo estritamente linear Θ(n) (p. 348)."
        }
      ]
    },
    {
      id: "q9-7",
      type: "Múltipla Escolha",
      reference: "Cap. 16, Seção 16.3 (pp. 353–360) — Lemas 16.2 e 16.3",
      question:
        "No algoritmo de HUFFMAN(C) para construir um código de prefixo ótimo para um alfabeto C de n = |C| caracteres, qual é o número exato de nós internos na árvore binária resultante, qual é a invariante da escolha gulosa provada no Lema 16.2 e qual é o tempo de execução usando um heap binário mínimo?",
      options: [
        {
          letter: "A",
          text: "A árvore tem n - 1 nós internos (pois é uma árvore binária cheia com n folhas); o Lema 16.2 prova que sempre existe uma árvore ótima na qual os dois caracteres x e y de menores frequências são folhas irmãs de profundidade máxima; e o tempo total de execução é O(n lg n).",
          isCorrect: true,
          explanation:
            "Correta! O laço de HUFFMAN executa exatamente n - 1 fusões (criando n - 1 nós internos), cada uma realizando duas extrações de mínimo e uma inserção em O(lg n), totalizando O(n lg n) (pp. 356–358)."
        },
        {
          letter: "B",
          text: "A árvore tem 2n nós internos; o Lema 16.2 coloca os dois caracteres mais frequentes como folhas irmãs na raiz; e o tempo é O(n²).",
          isCorrect: false,
          explanation:
            "Incorreta. Uma árvore binária cheia com n folhas tem sempre n - 1 nós internos (e 2n - 1 nós no total), e os caracteres de menor frequência ficam na profundidade máxima."
        },
        {
          letter: "C",
          text: "O custo B(T) de uma árvore de Huffman depende apenas da altura máxima da árvore, independentemente das frequências c.freq.",
          isCorrect: false,
          explanation:
            "Incorreta. Pela Equação (16.4), B(T) = ∑_{c∈C} c.freq · d_T(c) (ou equivalentemente, pelo Exercício 16.3-4, a soma das frequências de todos os n - 1 nós internos)."
        },
        {
          letter: "D",
          text: "Códigos de Huffman não são livres de prefixo, necessitando de caracteres separadores entre palavras de código.",
          isCorrect: false,
          explanation:
            "Incorreta. Como todos os caracteres residem exclusivamente nas folhas da árvore, nenhuma palavra de código é prefixo de outra."
        }
      ]
    },
    {
      id: "q9-8",
      type: "Múltipla Escolha",
      reference: "Cap. 16, Seções 16.4 e 16.5 (pp. 361–371)",
      question:
        "Seja M = (S, I) um matroide ponderado com função de peso estritamente positiva w. Qual das alternativas abaixo descreve CORRETAMENTE os axiomas de M e sua aplicação ao escalonamento de tarefas de tempo unitário com prazos d_i e multas w_i?",
      options: [
        {
          letter: "A",
          text: "I deve ser fechado sob união arbitrária (se A, B ∈ I então A ∪ B ∈ I).",
          isCorrect: false,
          explanation:
            "Incorreta. Se I fosse fechado sob união, o próprio S seria sempre independente! Os axiomas exigem hereditariedade (A ⊆ B ∈ I ⇒ A ∈ I) e a propriedade de intercâmbio (se A, B ∈ I e |A| < |B|, existe x ∈ B - A tal que A ∪ {x} ∈ I)."
        },
        {
          letter: "B",
          text: "M = (S, I) satisfaz a propriedade hereditária e a propriedade de intercâmbio (que implica que todas as bases têm a mesma cardinalidade); no escalonamento de tarefas unitárias, um subconjunto A de tarefas é independente (não há tarefas atrasadas) se e somente se N_t(A) ≤ t para todo t = 1, ..., n (Lema 16.12), formando um matroide no qual GREEDY seleciona as tarefas em ordem decrescente de multa w_i.",
          isCorrect: true,
          explanation:
            "Correta! Pelo Lema 16.12 e Teorema 16.13 (pp. 369–370), os conjuntos de tarefas que podem ser concluídos sem atraso formam os conjuntos independentes de um matroide, e maximizar a soma das multas das tarefas pontuais equivale a minimizar a soma das multas das tarefas atrasadas."
        },
        {
          letter: "C",
          text: "O algoritmo GREEDY(M, w) ordena os elementos de S em ordem crescente de peso w(x) para maximizar o peso do subconjunto independente.",
          isCorrect: false,
          explanation:
            "Incorreta. Na linha 2 de GREEDY(M, w) (p. 363), os elementos são ordenados em ordem monotonicamente decrescente de peso."
        },
        {
          letter: "D",
          text: "O problema de seleção de atividades da Seção 16.1 e os códigos de Huffman da Seção 16.3 são casos particulares diretos da teoria de matroides da Seção 16.4.",
          isCorrect: false,
          explanation:
            "Incorreta. Na primeira frase da Seção 16.4 (p. 361), os autores destacam explicitamente que a teoria dos matroides não abrange todos os algoritmos gulosos (em particular, não abrange seleção de atividades nem codificação de Huffman)."
        }
      ]
    },
    {
      id: "q9-9",
      type: "Múltipla Escolha",
      reference: "Cap. 17, Seções 17.1 a 17.3 (pp. 375–385)",
      question:
        "No Método do Potencial da Análise Amortizada (Seção 17.3), definimos o custo amortizado da i-ésima operação como ĉ_i = c_i + Φ(D_i) - Φ(D_{i-1}). Qual condição sobre a função potencial Φ garante rigorosamente que ∑_{i=1}^n ĉ_i ≥ ∑_{i=1}^n c_i para todo n, e qual é a variação ΔΦ_i quando INCREMENT(A) em um contador binário reajusta t_i bits de 1 para 0 e coloca 1 bit de 0 para 1?",
      options: [
        {
          letter: "A",
          text: "Basta que Φ(D_i) ≥ Φ(D_{i-1}) para todo i; no contador binário, ΔΦ_i = +t_i + 1.",
          isCorrect: false,
          explanation:
            "Incorreta. Φ(D_i) pode diminuir em operações caras (quando gastamos o potencial acumulado!), portanto não exigimos Φ(D_i) ≥ Φ(D_{i-1}), mas sim Φ(D_i) ≥ Φ(D_0) para todo i. E quando t_i bits 1 viram 0, o potencial diminui de t_i."
        },
        {
          letter: "B",
          text: "Exige-se que Φ(D_n) ≥ Φ(D_0) para todo n (em geral Φ(D_0) = 0 e Φ(D_i) ≥ 0); tomando Φ(D_i) = b_i (número de bits 1 no contador), uma operação INCREMENT que reajusta t_i bits 1 → 0 e coloca um bit 0 → 1 tem custo real c_i = t_i + 1 e variação de potencial ΔΦ_i = b_i - b_{i-1} = 1 - t_i, resultando em custo amortizado ĉ_i = (t_i + 1) + (1 - t_i) = 2.",
          isCorrect: true,
          explanation:
            "Correta! Pela Equação (17.3) (p. 382), ∑ c_i = ∑ ĉ_i - Φ(D_n) + Φ(D_0); logo, Φ(D_n) ≥ Φ(D_0) garante ∑ ĉ_i ≥ ∑ c_i. No contador binário, o termo t_i do custo real cancela-se exatamente com -t_i de ΔΦ_i, fornecendo ĉ_i ≤ 2 (p. 383)."
        },
        {
          letter: "C",
          text: "A análise amortizada por potencial depende da hipótese de que cada bit do contador tem probabilidade 1/2 de ser igual a 1.",
          isCorrect: false,
          explanation:
            "Incorreta. A análise amortizada é 100% determinística e vale para o pior caso de qualquer sequência de n operações, sem usar probabilidade."
        },
        {
          letter: "D",
          text: "No método da contabilidade, é permitido que o crédito total acumulado na estrutura fique temporariamente negativo, desde que volte a ser positivo no final.",
          isCorrect: false,
          explanation:
            "Incorreta! Na página 379, os autores enfatizam que o crédito total armazenado na estrutura NUNCA pode se tornar negativo em nenhuma etapa."
        }
      ]
    },
    {
      id: "q9-10",
      type: "Múltipla Escolha",
      reference: "Cap. 17, Seção 17.4 (pp. 385–393)",
      question:
        "Em uma Tabela Dinâmica que dobra de tamanho quando α(T) = 1 em TABLE-INSERT, por que contraímos a tabela à metade em TABLE-DELETE somente quando α(T) cai abaixo de 1/4 (em vez de contrair quando α(T) < 1/2), e como a função potencial da Equação (17.6) reflete isso?",
      options: [
        {
          letter: "A",
          text: "Contrair em α < 1/2 causaria thrashing (uma sequência alternada I, D, D, I, I... próxima a α = 1/2 dispararia expansões e contrações de custo Θ(n) a cada duas operações!); contraindo apenas quando α < 1/4, o fator de carga após qualquer expansão ou contração volta a ser exatamente 1/2, onde a função potencial de duas ramas Φ(T) = (2·num - tam se α ≥ 1/2; tam/2 - num se α < 1/2) vale 0, acumulando Φ(T) = num unidades de potencial tanto ao subir até α = 1 quanto ao descer até α = 1/4.",
          isCorrect: true,
          explanation:
            "Correta! Esta é a síntese perfeita da Seção 17.4 (pp. 389–392): em α = 1/2 o potencial é zero; conforme α se afasta de 1/2 em direção a 1 (inserções) ou em direção a 1/4 (remoções), o potencial cresce linearmente até atingir exatamente num, pagando integralmente a cópia dos num elementos na realocação!"
        },
        {
          letter: "B",
          text: "Porque é impossível dividir um arranjo por 2 quando o fator de carga é 1/2.",
          isCorrect: false,
          explanation:
            "Incorreta. É perfeitamente possível dividir o arranjo por 2 em α < 1/2, mas isso destruiria a garantia amortizada O(1)."
        },
        {
          letter: "C",
          text: "Contrair em α < 1/4 garante que nunca haverá realocação de memória durante operações TABLE-DELETE.",
          isCorrect: false,
          explanation:
            "Incorreta. Há realocações quando α cai abaixo de 1/4, mas elas são pagas pelo potencial acumulado pelas remoções anteriores desde α = 1/2."
        },
        {
          letter: "D",
          text: "A função potencial Φ(T) = 2 · T.num - T.tamanho continua sendo não negativa mesmo quando α(T) < 1/2.",
          isCorrect: false,
          explanation:
            "Incorreta. Para α(T) < 1/2, temos 2 · T.num - T.tamanho < 0, motivo pelo qual a segunda rama T.tamanho/2 - T.num é indispensável na Equação (17.6)."
        }
      ]
    }
  ];

  /* ========================================================================
     SEÇÃO 4: EXERCÍCIOS E PROBLEMAS CANÔNICOS (8 EXERCÍCIOS — CAPS. 15, 16 E 17)
     ======================================================================== */
  const exercicios = [
    {
      id: "ex9-1",
      code: "EXERCÍCIO 01 • CORTE DE HASTES COM CUSTO FIXO POR CORTE",
      reference: "Exercício 15.1-3 (p. 308)",
      title: "Modificar BOTTOM-UP-CUT-ROD Quando Cada Corte Possui um Custo Fixo c > 0",
      prompt: `
        <p><strong>(Exercício 15.1-3)</strong> Considere uma modificação do problema do corte de hastes na qual, além de um preço $p_i$ para cada haste, cada corte incorre em um <strong>custo fixo de $c$ reais</strong>. A receita associada a uma solução passa a ser a soma dos preços das peças menos os custos de fazer os cortes.</p>
        <p>Formule a nova equação de recorrência para $r_j$ e escreva um algoritmo de programação dinâmica <code>CUT-ROD-WITH-COST(p, n, c)</code> para resolver esse problema, analisando seu tempo de execução.</p>
      `,
      placeholder:
        "Observe que para i = j (nenhum corte realizado), a receita líquida é p[j]; já para 1 ≤ i < j, fazemos um corte imediato que custa c e deixa o subproblema j - i...",
      solution: `
        <h4>1. Formulação da Nova Recorrência</h4>
        <p>Para uma haste de comprimento $j \\ge 1$, quando escolhemos o comprimento $i$ ($1 \\le i \\le j$) do primeiro pedaço à esquerda:</p>
        <ul>
          <li>Se $i = j$, <strong>não fazemos nenhum corte</strong>: vendemos a haste inteira de comprimento $j$ por $p_j$, sem pagar a taxa $c$.</li>
          <li>Se $1 \\le i < j$, fazemos um corte que separa o pedaço $i$ do restante de comprimento $j - i$, pagando imediatamente o custo $c$ por esse corte e obtendo a receita ótima $r_{j-i}$ no pedaço restante: $p_i + r_{j-i} - c$.</li>
        </ul>
        <p>Portanto, a recorrência modificada é:</p>
        $$r_j = \\max\\left( p_j, \\; \\max_{1 \\le i \\le j-1} (p_i + r_{j-i} - c) \\right), \\quad \\text{com } r_0 = 0.$$

        <h4>2. Pseudocódigo <code>CUT-ROD-WITH-COST(p, n, c)</code> em $\\Theta(n^2)$</h4>
        <div class="pseudocode-block">
          <span class="pseudo-title">CUT-ROD-WITH-COST(p, n, c)</span>
<pre>1  sejam r[0 .. n] e s[0 .. n] novos arranjos
2  r[0] = 0
3  para j = 1 até n
4      q = p[j]                        // opção sem corte (i = j): não paga c
5      s[j] = j
6      para i = 1 até j - 1
7          se q < p[i] + r[j - i] - c
8              q = p[i] + r[j - i] - c
9              s[j] = i
10     r[j] = q
11 retorne r e s</pre>
        </div>
        <p><strong>Complexidade:</strong> O laço interno executa $j - 1$ vezes para cada $j = 1, \\dots, n$, mantendo o tempo $\\mathbf{\\Theta(n^2)}$ e espaço $\\Theta(n)$. $\\blacksquare$</p>
      `
    },
    {
      id: "ex9-2",
      code: "EXERCÍCIO 02 • PARENTIZAÇÃO ÓTIMA DE CADEIA DE 6 MATRIZES",
      reference: "Exercício 15.2-1 (p. 316)",
      title: "Determinar a Parentização Ótima para a Sequência de Dimensões ⟨5, 10, 3, 12, 5, 50, 6⟩",
      prompt: `
        <p><strong>(Exercício 15.2-1)</strong> Determine uma parentização ótima de um produto de cadeia de $n = 6$ matrizes $A_1 A_2 A_3 A_4 A_5 A_6$ cuja sequência de dimensões é:</p>
        $$p = \\langle 5, 10, 3, 12, 5, 50, 6 \\rangle.$$
        <p>Apresente os valores calculados nas tabelas $m[i, j]$ e $s[i, j]$ para cada comprimento $l = 2, \\dots, 6$ e a expressão parentizada final produzida por <code>PRINT-OPTIMAL-PARENS(s, 1, 6)</code>.</p>
      `,
      placeholder:
        "Calcule m[i, j] para l = 2, 3, 4, 5, 6 usando m[i, j] = min_{i≤k<j} {m[i, k] + m[k+1, j] + p_{i-1} p_k p_j}...",
      solution: `
        <h4>1. Dimensões das Matrizes e Cálculo de Baixo para Cima por Comprimento $l$</h4>
        <p>Temos $A_1 (5\\times 10)$, $A_2 (10\\times 3)$, $A_3 (3\\times 12)$, $A_4 (12\\times 5)$, $A_5 (5\\times 50)$ e $A_6 (50\\times 6)$, com $m[i,i] = 0$ para $i = 1..6$:</p>
        <ul>
          <li><strong>$l = 2$ (pares adjacentes):</strong>
            <ul>
              <li>$m[1,2] = 5\\cdot 10\\cdot 3 = 150$ ($s[1,2]=1$);</li>
              <li>$m[2,3] = 10\\cdot 3\\cdot 12 = 360$ ($s[2,3]=2$);</li>
              <li>$m[3,4] = 3\\cdot 12\\cdot 5 = 180$ ($s[3,4]=3$);</li>
              <li>$m[4,5] = 12\\cdot 5\\cdot 50 = 3000$ ($s[4,5]=4$);</li>
              <li>$m[5,6] = 5\\cdot 50\\cdot 6 = 1500$ ($s[5,6]=5$).</li>
            </ul>
          </li>
          <li><strong>$l = 3$:</strong>
            <ul>
              <li>$m[1,3] = \\min_{k=1,2}\\{0+360+5\\cdot 10\\cdot 12=960, \\; 150+0+5\\cdot 3\\cdot 12=330\\} = \\mathbf{330}$ ($s[1,3]=2$);</li>
              <li>$m[2,4] = \\min_{k=2,3}\\{0+180+10\\cdot 3\\cdot 5=330, \\; 360+0+10\\cdot 12\\cdot 5=960\\} = \\mathbf{330}$ ($s[2,4]=2$);</li>
              <li>$m[3,5] = \\min_{k=3,4}\\{0+3000+3\\cdot 12\\cdot 50=4800, \\; 180+0+3\\cdot 5\\cdot 50=930\\} = \\mathbf{930}$ ($s[3,5]=4$);</li>
              <li>$m[4,6] = \\min_{k=4,5}\\{0+1500+12\\cdot 5\\cdot 6=1860, \\; 3000+0+12\\cdot 50\\cdot 6=6600\\} = \\mathbf{1860}$ ($s[4,6]=4$).</li>
            </ul>
          </li>
          <li><strong>$l = 4$:</strong>
            <ul>
              <li>$m[1,4]$: para $k=2$, $m[1,2]+m[3,4]+p_0 p_2 p_4 = 150 + 180 + 5\\cdot 3\\cdot 5 = \\mathbf{405}$ ($s[1,4]=2$);</li>
              <li>$m[2,5]$: para $k=2$, $m[2,2]+m[3,5]+p_1 p_2 p_5 = 0 + 930 + 10\\cdot 3\\cdot 50 = \\mathbf{2430}$ ($s[2,5]=2$);</li>
              <li>$m[3,6]$: para $k=4$, $m[3,4]+m[5,6]+p_2 p_4 p_6 = 180 + 1500 + 3\\cdot 5\\cdot 6 = \\mathbf{1770}$ ($s[3,6]=4$).</li>
            </ul>
          </li>
          <li><strong>$l = 5$:</strong>
            <ul>
              <li>$m[1,5]$: para $k=2$, $m[1,2]+m[3,5]+p_0 p_2 p_5 = 150 + 930 + 5\\cdot 3\\cdot 50 = \\mathbf{1830}$ ($s[1,5]=2$);</li>
              <li>$m[2,6]$: para $k=2$, $m[2,2]+m[3,6]+p_1 p_2 p_6 = 0 + 1770 + 10\\cdot 3\\cdot 6 = \\mathbf{1950}$ ($s[2,6]=2$).</li>
            </ul>
          </li>
          <li><strong>$l = 6$ (Cadeia Completa $A_{1..6}$):</strong>
            <ul>
              <li>Para $k=2$: $m[1,2] + m[3,6] + p_0 p_2 p_6 = 150 + 1770 + 5\\cdot 3\\cdot 6 = 1920 + 90 = \\mathbf{2010}$ ($s[1,6]=2$).</li>
            </ul>
          </li>
        </ul>

        <h4>2. Reconstrução da Parentização Ótima</h4>
        <p>Como $s[1,6] = 2$, dividimos em $(A_1 A_2)$ e $(A_3 A_4 A_5 A_6)$. Para $A_{3..6}$, temos $s[3,6] = 4$, dividindo em $(A_3 A_4)$ e $(A_5 A_6)$. Logo, a parentização ótima exige apenas <strong>$2.010$ multiplicações escalares</strong> e é:</p>
        $$\\mathbf{((A_1 A_2)((A_3 A_4)(A_5 A_6)))}. \\quad \\blacksquare$$
      `
    },
    {
      id: "ex9-3",
      code: "EXERCÍCIO 03 • OTIMIZAÇÃO DE ESPAÇO EM LCS-LENGTH E RECONSTRUÇÃO SEM TABELA b",
      reference: "Exercícios 15.4-2 e 15.4-4 (p. 332)",
      title: "Reconstruir a LCS Sem a Tabela b em O(m + n) e Calcular o Comprimento da LCS em Espaço O(min(m, n))",
      prompt: `
        <p>Considere as duas otimizações de memória clássicas para o algoritmo <code>LCS-LENGTH(X, Y)</code> (Seção 15.4):</p>
        <ol>
          <li><strong>(Exercício 15.4-2)</strong> Escreva o pseudocódigo de um procedimento <code>PRINT-LCS-NO-B(c, X, Y, i, j)</code> que reconstrói e imprime uma LCS a partir da tabela completa $c[0..m, 0..n]$ e das sequências originais $X$ e $Y$ no tempo $O(m + n)$, <strong>sem utilizar a tabela de setas $b$</strong>.</li>
          <li><strong>(Exercício 15.4-4)</strong> Mostre como calcular o comprimento de uma LCS utilizando apenas $2 \\cdot \\min(m, n)$ entradas na tabela $c$ mais $O(1)$ de espaço adicional, e em seguida usando apenas $\\min(m, n)$ entradas mais $O(1)$ de espaço adicional.</li>
        </ol>
      `,
      placeholder:
        "Para o item 1, compare x_i com y_j (ou compare c[i, j] com c[i-1, j] e c[i, j-1]); para o item 2, mantenha apenas a linha atual e a anterior (ou uma única linha com uma variável escalar diagPrev)...",
      solution: `
        <h4>1. Reconstrução da LCS Sem a Tabela $b$ em $O(m + n)$ (Exercício 15.4-2)</h4>
        <div class="pseudocode-block">
          <span class="pseudo-title">PRINT-LCS-NO-B(c, X, Y, i, j)</span>
<pre>1  se i == 0 ou j == 0
2      retorne
3  se x_i == y_j
4      PRINT-LCS-NO-B(c, X, Y, i - 1, j - 1)
5      imprima x_i
6  senão se c[i - 1, j] ≥ c[i, j - 1]
7      PRINT-LCS-NO-B(c, X, Y, i - 1, j)
8  senão PRINT-LCS-NO-B(c, X, Y, i, j - 1)</pre>
        </div>
        <p>Cada chamada realiza trabalho $O(1)$ e reduz $i + j$ em pelo menos $1$, executando em tempo $O(m + n)$ e economizando os $mn$ ponteiros da tabela $b$.</p>

        <h4>2. Cálculo de $c[m, n]$ em Espaço $2\\min(m, n)$ e $\\min(m, n) + O(1)$ (Exercício 15.4-4)</h4>
        <ul>
          <li>Assuma sem perda de generalidade que $n = \\min(m, n)$ (caso $m < n$, basta trocar os papéis de $X$ e $Y$).</li>
          <li><strong>Com $2\\min(m, n)$ entradas:</strong> Para calcular a $i$-ésima linha $c[i, 0..n]$, dependemos exclusivamente da linha anterior $c[i-1, 0..n]$ e da própria linha atual $c[i, 0..j-1]$. Logo, mantemos apenas duas linhas de tamanho $n + 1$ (alternando <code>atual</code> e <code>anterior</code> via índice $i \\bmod 2$).</li>
          <li><strong>Com $\\min(m, n)$ entradas mais $O(1)$ variáveis escalares:</strong> Mantemos um único arranjo unidimensional $L[0..n]$. Antes de sobrescrever $L[j]$ na iteração $(i, j)$, o valor antigo de $L[j]$ é exatamente $c[i-1, j]$ (topo $\\uparrow$), $L[j-1]$ já atualizado é $c[i, j-1]$ (esquerda $\\leftarrow$), e guardamos o valor antigo de $L[j-1]$ (que era $c[i-1, j-1]$, diagonal $\\nwarrow$) em uma única variável escalar <code>diagPrev</code>! $\\blacksquare$</li>
        </ul>
      `
    },
    {
      id: "ex9-4",
      code: "EXERCÍCIO 04 • COLORAÇÃO DE GRAFOS DE INTERVALOS (ALOCAÇÃO DE SALAS DE AULA)",
      reference: "Exercício 16.1-4 (p. 349)",
      title: "Escalonar Todas as n Atividades no Menor Número Possível de Salas de Aula em O(n lg n)",
      prompt: `
        <p><strong>(Exercício 16.1-4 — Problema de Coloração de Grafo de Intervalos)</strong> Suponha que tenhamos um conjunto de $n$ atividades para programar entre um grande número de salas de aula, onde qualquer atividade pode ocorrer em qualquer sala. Desejamos programar <strong>todas</strong> as atividades usando o <strong>menor número possível de salas</strong> (ou equivalentemente, atribuir uma cor a cada intervalo de modo que intervalos sobrepostos recebam cores distintas usando o mínimo de cores).</p>
        <p>Apresente um algoritmo guloso eficiente em tempo $O(n \\lg n)$ para determinar qual atividade deve usar qual sala e prove sua otimalidade.</p>
      `,
      placeholder:
        "Ordene os 2n eventos (inícios s_i e términos f_i) em ordem cronológica e mantenha uma lista de salas livres...",
      solution: `
        <h4>1. Algoritmo Guloso por Varredura de Eventos em $O(n \\lg n)$</h4>
        <ol>
          <li>Criamos uma lista com os $2n$ pontos extremos dos intervalos: $n$ eventos de <strong>início</strong> $s_i$ e $n$ eventos de <strong>término</strong> $f_i$, e ordenamos esses $2n$ eventos em ordem crescente de tempo em $O(n \\lg n)$ (em caso de empate $f_j == s_i$, processamos o evento de <strong>término $f_j$ antes</strong> do início $s_i$, pois os intervalos $[s_i, f_i)$ são semiabertos e compatíveis quando $s_i = f_j$!).</li>
          <li>Mantemos uma pilha (ou lista) <code>SalasLivres</code> de salas já alocadas que estão desocupadas no momento, e um contador $k = 0$ do total de salas criadas:
            <ul>
              <li>Ao encontrar um evento de <strong>término $f_j$</strong>: devolvemos a sala usada por $a_j$ para a pilha <code>SalasLivres</code>.</li>
              <li>Ao encontrar um evento de <strong>início $s_i$</strong>: se <code>SalasLivres</code> não estiver vazia, desempilhamos uma sala livre e a atribuímos a $a_i$; caso contrário, incrementamos $k = k + 1$ e alocamos uma nova sala $k$ para $a_i$.</li>
            </ul>
          </li>
        </ol>

        <h4>2. Prova de Otimalidade (Dualidade Clique–Coloração em Grafos de Intervalos)</h4>
        <p>Seja $k$ o número total de salas abertas pelo algoritmo. Considere o instante exato $s_i$ em que a $k$-ésima sala foi criada: naquele instante, <code>SalasLivres</code> estava vazia, o que significa que as outras $k - 1$ salas já estavam todas ocupadas por $k - 1$ atividades que começaram em ou antes de $s_i$ e que terminam estritamente depois de $s_i$. Portanto, existem <strong>$k$ atividades que contêm simultaneamente o instante $s_i$</strong> (uma clique de tamanho $k$ no grafo de intervalos). Como essas $k$ atividades são mutuamente incompatíveis duas a duas, <em>qualquer</em> escalonamento válido é obrigado a usar no mínimo $k$ salas! Logo, $k$ é estritamente ótimo. $\\blacksquare$</p>
      `
    },
    {
      id: "ex9-5",
      code: "EXERCÍCIO 05 • PROGRAMAÇÃO DINÂMICA O(nW) PARA O PROBLEMA DA MOCHILA 0-1",
      reference: "Exercício 16.2-2 (p. 352)",
      title: "Formular a Recorrência e o Algoritmo de Programação Dinâmica O(nW) para a Mochila 0-1",
      prompt: `
        <p><strong>(Exercício 16.2-2)</strong> Dê uma solução de programação dinâmica para o <strong>problema da mochila 0-1</strong> que seja executada no tempo $O(nW)$, onde $n$ é o número de itens (cada item $i$ com peso inteiro positivo $w_i$ e valor $v_i$) e $W$ é o peso máximo inteiro que o ladrão pode pôr em sua mochila.</p>
      `,
      placeholder:
        "Defina K[i, w] como o valor máximo que pode ser obtido usando um subconjunto dos primeiros i itens com capacidade máxima w (para 0 ≤ i ≤ n e 0 ≤ w ≤ W)...",
      solution: `
        <h4>1. Subestrutura Ótima e Recorrência $K[i, w]$</h4>
        <p>Para $0 \\le i \\le n$ e $0 \\le w \\le W$, seja $K[i, w]$ o valor máximo de um subconjunto dos itens $\\{1, 2, \\dots, i\\}$ cujo peso total não excede $w$. Ao considerar o $i$-ésimo item (de peso $w_i$ e valor $v_i$):</p>
        <ul>
          <li>Se $w_i > w$, o item $i$ não cabe na capacidade $w$, logo somos obrigados a excluí-lo: $K[i, w] = K[i-1, w]$.</li>
          <li>Se $w_i \\le w$, comparamos as duas decisões possíveis: excluir o item $i$ ($K[i-1, w]$) ou incluir o item $i$ (ganhando $v_i$ e dispondo de capacidade restante $w - w_i$ para os $i - 1$ itens anteriores, $v_i + K[i-1, w - w_i]$):</li>
        </ul>
        $$K[i, w] = \\begin{cases} 0 & \\text{se } i = 0 \\text{ ou } w = 0, \\\\ K[i-1, w] & \\text{se } i > 0 \\text{ e } w_i > w, \\\\ \\max\\big(K[i-1, w], \\; v_i + K[i-1, w - w_i]\\big) & \\text{se } i > 0 \\text{ e } w_i \\le w. \\end{cases}$$

        <h4>2. Pseudocódigo <code>KNAPSACK-01(v, w, n, W)</code> em $\\Theta(nW)$</h4>
        <div class="pseudocode-block">
          <span class="pseudo-title">KNAPSACK-01(v, w, n, W)</span>
<pre>1  seja K[0 .. n, 0 .. W] uma nova tabela
2  para w = 0 até W
3      K[0, w] = 0
4  para i = 1 até n
5      K[i, 0] = 0
6      para w = 1 até W
7          se w_i ≤ w e v_i + K[i - 1, w - w_i] > K[i - 1, w]
8              K[i, w] = v_i + K[i - 1, w - w_i]
9          senão K[i, w] = K[i - 1, w]
10 retorne K[n, W]</pre>
        </div>
        <p><strong>Complexidade:</strong> Dois laços aninhados de tamanhos $n$ e $W$ com corpo $O(1)$, totalizando tempo $\\mathbf{O(nW)}$ e espaço $O(nW)$ (redutível a $O(W)$ se precisarmos apenas do valor ótimo). $\\blacksquare$</p>
      `
    },
    {
      id: "ex9-6",
      code: "EXERCÍCIO 06 • CÓDIGO DE HUFFMAN PARA OS NÚMEROS DE FIBONACCI",
      reference: "Exercício 16.3-3 (p. 360)",
      title: "Determinar o Código de Huffman Ótimo para as 8 Primeiras Frequências de Fibonacci e Generalizar para n",
      prompt: `
        <p><strong>(Exercício 16.3-3)</strong> Qual é o código de Huffman ótimo para o seguinte conjunto de frequências, baseado nos primeiros $8$ números de Fibonacci?</p>
        $$a:1, \\quad b:1, \\quad c:2, \\quad d:3, \\quad e:5, \\quad f:8, \\quad g:13, \\quad h:21.$$
        <p>Você pode generalizar sua resposta para determinar o código ótimo quando as frequências são os primeiros $n$ números de Fibonacci?</p>
      `,
      placeholder:
        "Aplique HUFFMAN fundindo repetidamente os dois menores: 1+1=2, 2+2=4, 4+3=7, 7+5=12, 12+8=20, 20+13=33, 33+21=54 e observe a estrutura de espinha (caterpillar tree)...",
      solution: `
        <h4>1. Execução Passo a Passo de <code>HUFFMAN</code> para $n = 8$</h4>
        <p>Pela identidade fundamental dos números de Fibonacci $\\sum_{i=1}^{k} F_i = F_{k+2} - 1 < F_{k+2}$, a soma acumulada de todas as folhas fundidas até a etapa $k$ é sempre $F_{k+2} - 1$, que está situada entre $F_{k+1}$ e $F_{k+2}$! Portanto, cada fusão combina o nó interno recém-criado com o próximo caractere individual da sequência:</p>
        <ol>
          <li>Fusão 1: $a(1) + b(1) = z_1(2)$;</li>
          <li>Fusão 2: $z_1(2) + c(2) = z_2(4)$;</li>
          <li>Fusão 3: $d(3) + z_2(4) = z_3(7)$;</li>
          <li>Fusão 4: $e(5) + z_3(7) = z_4(12)$;</li>
          <li>Fusão 5: $f(8) + z_4(12) = z_5(20)$;</li>
          <li>Fusão 6: $g(13) + z_5(20) = z_6(33)$;</li>
          <li>Fusão 7: $h(21) + z_6(33) = z_7(54)$ (raiz).</li>
        </ol>
        <p>Colocando sempre o filho de menor frequência à esquerda ($0$) ou fixando a folha individual como $0$ e a subárvore acumulada como $1$, obtemos uma <strong>árvore espinha (degenerada à direita)</strong>:</p>
        <ul>
          <li>$h (21): \\mathbf{0}$ (comprimento 1)</li>
          <li>$g (13): \\mathbf{10}$ (comprimento 2)</li>
          <li>$f (8): \\mathbf{110}$ (comprimento 3)</li>
          <li>$e (5): \\mathbf{1110}$ (comprimento 4)</li>
          <li>$d (3): \\mathbf{11110}$ (comprimento 5)</li>
          <li>$c (2): \\mathbf{111110}$ (comprimento 6)</li>
          <li>$b (1): \\mathbf{1111110}$ (comprimento 7)</li>
          <li>$a (1): \\mathbf{1111111}$ (comprimento 7)</li>
        </ul>

        <h4>2. Generalização para os Primeiros $n$ Números de Fibonacci</h4>
        <p>Como para todo $k \\ge 2$ vale $\\sum_{i=1}^{k} F_i = F_{k+2} - 1 < F_{k+2}$, por indução a árvore ótima de Huffman para $c_1, c_2, \\dots, c_n$ com $c_i.\\text{freq} = F_i$ é sempre uma árvore binária cheia de altura $n - 1$ na qual:</p>
        <ul>
          <li>Para $2 \\le k \\le n$, o caractere $c_k$ tem profundidade $n - k + 1$ e palavra de código $\\underbrace{11\\dots 1}_{n-k}\\!0$;</li>
          <li>O caractere $c_1$ tem profundidade $n - 1$ e palavra de código $\\underbrace{11\\dots 1}_{n-1}$. $\\blacksquare$</li>
        </ul>
      `
    },
    {
      id: "ex9-7",
      code: "EXERCÍCIO 07 • ANÁLISE AMORTIZADA: CUSTO EM POTÊNCIAS DE 2 E FILA COM DUAS PILHAS",
      reference: "Exercícios 17.1-3, 17.2-1 e 17.3-3 (pp. 379, 381 e 385) + Ex. 10.1-6",
      title: "Provar Custo Amortizado O(1) Quando a i-ésima Operação Custa i se i = 2^k e para uma Fila Implementada com Duas Pilhas",
      prompt: `
        <p>Resolva os dois problemas clássicos de análise amortizada abaixo:</p>
        <ol>
          <li><strong>(Exercícios 17.1-3 e 17.3-3)</strong> Suponha que executemos uma sequência de $n$ operações em uma estrutura de dados na qual a $i$-ésima operação custa $i$ se $i$ é uma potência exata de $2$, e $1$ no caso contrário. Determine o custo amortizado por operação usando (a) <strong>análise agregada</strong> e (b) o <strong>método do potencial</strong>.</li>
          <li><strong>(Fila com Duas Pilhas — Cap. 17 / Ex. 10.1-6)</strong> Uma fila FIFO $Q$ é implementada com duas pilhas $S_{\\text{in}}$ (entrada) e $S_{\\text{out}}$ (saída): <code>ENQUEUE(Q, x)</code> faz <code>PUSH(S_in, x)</code>; <code>DEQUEUE(Q)</code> verifica se $S_{\\text{out}}$ está vazia — se estiver, transfere todos os elementos de $S_{\\text{in}}$ para $S_{\\text{out}}$ fazendo <code>PUSH(S_out, POP(S_in))</code> repetidamente — e por fim retorna <code>POP(S_out)</code>. Prove pelo método do potencial que tanto <code>ENQUEUE</code> quanto <code>DEQUEUE</code> têm custo amortizado $O(1)$.</li>
        </ol>
      `,
      placeholder:
        "No item 1(b), defina Φ(D_i) = 2i - 2^{⌊lg i⌋ + 1} (ou acumule 2 unidades por operação); no item 2, defina Φ(Q) = 2 · |S_in|...",
      solution: `
        <h4>1. Operações com Custo $i$ nas Potências de $2$ (Exercícios 17.1-3 e 17.3-3)</h4>
        <ul>
          <li><strong>(a) Análise Agregada:</strong> O custo real da $i$-ésima operação é $c_i = i$ se $i = 2^k$ para algum inteiro $k \\ge 0$, e $c_i = 1$ caso contrário. Em $n$ operações, o custo total é:
            $$\\sum_{i=1}^{n} c_i \\le n + \\sum_{k=0}^{\\lfloor \\lg n \\rfloor} 2^k = n + \\left(2^{\\lfloor \\lg n \\rfloor + 1} - 1\\right) < n + 2n = 3n.$$
            Logo, o custo amortizado por operação é $3n / n = \\mathbf{3 = O(1)}$.</li>
          <li><strong>(b) Método do Potencial:</strong> Definimos $\\Phi(D_0) = 0$ e, para $i \\ge 1$, $\\Phi(D_i) = 2i - 2^{\\lfloor \\lg i \\rfloor + 1} + 1 \\ge 0$ (pois $2^{\\lfloor \\lg i \\rfloor + 1} \\le 2i$).
            <ul>
              <li>Se $i$ <em>não</em> é potência de $2$: $\\lfloor \\lg i \\rfloor = \\lfloor \\lg(i-1) \\rfloor$, logo $\\Delta\\Phi_i = 2$ e $\\hat{c}_i = 1 + 2 = \\mathbf{3}$.</li>
              <li>Se $i = 2^k$ ($k \\ge 1$): $2^{\\lfloor \\lg i \\rfloor + 1} = 2^{k+1} = 2i$, enquanto $2^{\\lfloor \\lg(i-1) \\rfloor + 1} = 2^k = i$. Logo $\\Delta\\Phi_i = (2i - 2i + 1) - (2(i-1) - i + 1) = 1 - (i - 1) = 2 - i$. Como $c_i = i$, temos $\\hat{c}_i = i + (2 - i) = \\mathbf{2 \\le 3}$!</li>
            </ul>
          </li>
        </ul>

        <h4>2. Fila com Duas Pilhas via Método do Potencial</h4>
        <p>Definimos a função potencial $\\Phi(Q) = 2 \\cdot |S_{\\text{in}}|$ (duas vezes o número de elementos na pilha de entrada $S_{\\text{in}}$). Claramente $\\Phi(Q_0) = 0$ e $\\Phi(Q) \\ge 0$ sempre:</p>
        <ul>
          <li><strong><code>ENQUEUE(Q, x)</code>:</strong> Realiza um <code>PUSH(S_in, x)</code> com custo real $c_i = 1$ e aumenta $|S_{\\text{in}}|$ em $1$ ($\\Delta\\Phi_i = +2$). Logo:
            $$\\hat{c}_{\\text{ENQUEUE}} = 1 + 2 = \\mathbf{3 = O(1)}.$$</li>
          <li><strong><code>DEQUEUE(Q)</code> quando $S_{\\text{out}}$ não está vazia:</strong> Realiza apenas <code>POP(S_out)</code> com custo real $c_i = 1$ e não altera $|S_{\\text{in}}|$ ($\\Delta\\Phi_i = 0$). Logo:
            $$\\hat{c}_{\\text{DEQUEUE}} = 1 + 0 = \\mathbf{1 = O(1)}.$$</li>
          <li><strong><code>DEQUEUE(Q)</code> quando $S_{\\text{out}}$ está vazia e $|S_{\\text{in}}| = k > 0$:</strong> Transfere os $k$ elementos fazendo $k$ operações <code>POP(S_in)</code> e $k$ operações <code>PUSH(S_out)</code>, mais $1$ operação final <code>POP(S_out)</code>, com custo real $c_i = 2k + 1$. Como $S_{\\text{in}}$ passa de $k$ para $0$ elementos, a variação do potencial é $\\Delta\\Phi_i = 0 - 2k = -2k$. Portanto:
            $$\\hat{c}_{\\text{DEQUEUE}} = (2k + 1) + (-2k) = \\mathbf{1 = O(1)}. \\quad \\blacksquare$$</li>
        </ul>
      `
    },
    {
      id: "ex9-8",
      code: "EXERCÍCIO 08 • PROBLEMAS CLÁSSICOS: IMPRESSÃO JUSTIFICADA (PROB. 15-4) E TROCO DE MOEDAS (PROB. 16-1)",
      reference: "Problema 15-4 (p. 340) e Problema 16-1 (p. 371)",
      title: "Programação Dinâmica para Impressão Justificada de Parágrafos e Troco de Moedas (Guloso vs. PD)",
      prompt: `
        <p>Analise e resolva os dois problemas clássicos de final de capítulo dos Capítulos 15 e 16:</p>
        <ol>
          <li><strong>(Problema 15-4 — Impressão Justificada / Neatly Printing)</strong> Dada uma sequência de $n$ palavras de comprimentos $l_1, l_2, \\dots, l_n$ e linhas de largura máxima $M$, se uma linha contém as palavras $i$ até $j$ ($i \\le j$) separadas por um espaço, o número de espaços extras no final da linha é $extras[i, j] = M - j + i - \\sum_{k=i}^{j} l_k$. O custo $lc[i, j]$ de uma linha é $\\infty$ se $extras[i, j] < 0$, $0$ se $j = n$ e $extras[i, j] \\ge 0$ (a última linha não é penalizada!), e $(extras[i, j])^3$ caso contrário. Formule a recorrência de Programação Dinâmica $c[j]$ para minimizar a soma dos cubos dos espaços extras das palavras $1..n$.</li>
          <li><strong>(Problema 16-1 — Troco de Moedas / Coin Changing)</strong> Para dar troco de $n$ centavos usando moedas americanas de $25, 10, 5$ e $1$ centavo, o algoritmo guloso (tomar sempre a maior moeda $\\le$ valor restante) é ótimo. Dê um conjunto de denominações de moedas (incluindo a moeda de $1$ centavo) para o qual o algoritmo guloso <strong>não</strong> produz o número mínimo de moedas, e apresente o algoritmo de Programação Dinâmica $O(nk)$ que resolve o problema para qualquer conjunto de $k$ denominações $1 = c_1 < c_2 < \\dots < c_k$.</li>
        </ol>
      `,
      placeholder:
        "No item 1, defina c[j] como o custo mínimo para formatar as palavras 1..j testando a primeira palavra i da última linha; no item 2, use moedas {1, 3, 4} para troco n = 6...",
      solution: `
        <h4>1. Problema 15-4: Impressão Justificada de Parágrafo em $O(n^2)$ (ou $O(nM)$)</h4>
        <p>Seja $c[j]$ o custo mínimo total para imprimir de forma justificada as palavras $1, 2, \\dots, j$ (com $c[0] = 0$). Se a última linha que termina na palavra $j$ começa na palavra $i$ ($1 \\le i \\le j$), então as palavras $1, \\dots, i-1$ devem estar dispostas de forma ótima, o que nos dá a recorrência:</p>
        $$c[j] = \\min_{1 \\le i \\le j} \\big\\{ c[i - 1] + lc[i, j] \\big\\}, \\quad \\text{para } j = 1, 2, \\dots, n.$$
        <p>Salvando em $p[j]$ o índice $i$ que minimiza $c[j]$, calculamos $c[1..n]$ em tempo $O(n^2)$ (ou $O(nM)$, já que uma linha comporta no máximo $\\lceil M/2 \\rceil$ palavras, bastando testar $j - i \\le M/2$!). A reconstrução imprime recursivamente as linhas de $1$ até $p[n]-1$ e depois a última linha de $p[n]$ até $n$.</p>

        <h4>2. Problema 16-1: Troco de Moedas — Contraexemplo Guloso e Solução Ótima por PD</h4>
        <ul>
          <li><strong>Contraexemplo para o Algoritmo Guloso (Item c):</strong> Considere as denominações $C = \\{1, 3, 4\\}$ (ou $\\{1, 10, 25\\}$) e o valor de troco $n = 6$ (ou $n = 30$):
            <ul>
              <li>Para $C = \\{1, 3, 4\\}$ e $n = 6$: o algoritmo guloso escolhe primeiro a moeda de $4$ e depois duas moedas de $1$ ($6 = 4 + 1 + 1$, usando <strong>$3$ moedas</strong>), enquanto a solução ótima usa duas moedas de $3$ ($6 = 3 + 3$, apenas <strong>$2$ moedas</strong>!).</li>
              <li>Para $C = \\{1, 10, 25\\}$ e $n = 30$: o guloso escolhe $25 + 1 + 1 + 1 + 1 + 1$ ($6$ moedas), enquanto o ótimo usa $10 + 10 + 10$ ($3$ moedas!).</li>
            </ul>
          </li>
          <li><strong>Algoritmo de Programação Dinâmica em $O(nk)$ (Item d):</strong> Seja $m[j]$ o número mínimo de moedas para dar troco de $j$ centavos ($0 \\le j \\le n$). Temos $m[0] = 0$ e, para $j \\ge 1$, fazemos a primeira escolha de qual denominação $c_i \\le j$ usar:
            $$m[j] = 1 + \\min_{1 \\le i \\le k : c_i \\le j} \\big\\{ m[j - c_i] \\big\\}.$$
            Preenchendo $m[1..n]$ de baixo para cima com um laço externo $j = 1..n$ e um laço interno $i = 1..k$, calculamos a solução ótima para qualquer sistema monetário em tempo $\\mathbf{O(nk)}$ e espaço $\\Theta(n)$. $\\blacksquare$</li>
        </ul>
      `
    }
  ];

  if (typeof window !== "undefined" && typeof window.registerCodexModule === "function") {
    window.registerCodexModule(9, {
      revisao,
      unidades,
      initWorkbenches,
      quizzes,
      exercicios
    });
  }
})();
