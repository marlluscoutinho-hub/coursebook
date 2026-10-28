/* ==========================================================================
   CODEX — MÓDULO 06: LIMITES INFERIORES, ORDENAÇÃO EM TEMPO LINEAR E ESTATÍSTICAS DE ORDEM
   Capítulos 8 e 9 (pp. 166–195)
   Obra: Algoritmos: Teoria e Prática (3ª Edição) — Cormen, Leiserson, Rivest e Stein
   ========================================================================== */

(function () {
  const revisao = {
    subtitle:
      "Da Barreira Teórica Ω(n lg n) das Árvores de Decisão à Ordenação Não Comparativa em Θ(n) e à Seleção de Estatísticas de Ordem em Tempo Linear",
    intro:
      "Nos Módulos 01 a 05, estudamos quatro grandes algoritmos de ordenação: INSERTION-SORT (Θ(n²) no pior caso), MERGE-SORT (Θ(n lg n) no pior caso), HEAPSORT (Θ(n lg n) no pior caso e in-place) e QUICKSORT (Θ(n lg n) no caso esperado e in-place). Todos eles compartilham uma restrição estrutural idêntica: a ordem relativa dos elementos na saída é determinada exclusivamente por comparações par a par (a_i ≤ a_j) entre os elementos de entrada. No Módulo 06, unificamos o Capítulo 8 (Ordenação em Tempo Linear, pp. 166–182) e o Capítulo 9 (Medianas e Estatísticas de Ordem, pp. 183–195) para responder a duas questões fundamentais da Ciência da Computação: (1) É possível ordenar mais rápido que Ω(n lg n)? e (2) É possível encontrar a mediana ou o i-ésimo menor elemento de um conjunto desordenado em tempo O(n), sem precisar pagar o custo Θ(n lg n) de ordenar o conjunto inteiro?",
    pillars: [
      {
        tag: "[ PILAR 01 • A BARREIRA Ω(n lg n) ]",
        title: "O Modelo da Árvore de Decisão e a Otimalidade Assintótica de Merge Sort e Heapsort",
        body: `
          <p>Qualquer algoritmo de <strong>ordenação por comparação</strong> pode ser modelado abstratamente como uma <strong>árvore de decisão</strong> binária cheia, na qual cada nó interno $i:j$ representa um teste $a_i \\le a_j$ e cada folha representa uma permutação $\\langle \\pi(1), \\pi(2), \\dots, \\pi(n) \\rangle$ que restabelece a ordem total $a_{\\pi(1)} \\le a_{\\pi(2)} \\le \\dots \\le a_{\\pi(n)}$.</p>
          <ul>
            <li><strong>Contagem combinatória de folhas:</strong> Como um algoritmo de ordenação correto deve ser capaz de distinguir todas as $n!$ permutações possíveis de $n$ elementos distintos, sua árvore de decisão deve possuir pelo menos $l \\ge n!$ folhas alcançáveis a partir da raiz.</li>
            <li><strong>Teorema 8.1 e Corolário 8.2:</strong> Uma árvore binária de altura $h$ possui no máximo $2^h$ folhas ($l \\le 2^h$). Combinando as duas desigualdades e aplicando a aproximação de Stirling, obtemos $2^h \\ge l \\ge n! \\implies h \\ge \\lg(n!) = \\Omega(n \\lg n)$. Logo, <code>MERGE-SORT</code> e <code>HEAPSORT</code> são <strong>assintoticamente ótimos</strong> no modelo de comparação!</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 02 • ORDENANDO EM TEMPO LINEAR ]",
        title: "Rompendo o Limite via Premissas sobre a Entrada: Counting-Sort, Radix-Sort e Bucket-Sort",
        body: `
          <p>Para superar o limite inferior $\\Omega(n \\lg n)$, é obrigatório abandonar o modelo puramente comparativo e explorar propriedades algébricas ou probabilísticas das chaves de entrada:</p>
          <ul>
            <li><strong>Ordenação por Contagem (<code>COUNTING-SORT</code>):</strong> Assume que os $n$ elementos são inteiros no intervalo pequeno $\\{0, 1, \\dots, k\\}$. Usando os próprios valores como índices no arranjo auxiliar de frequências acumuladas $C[0 \\dots k]$, posiciona cada elemento diretamente em $B[1 \\dots n]$ em tempo $\\Theta(n + k)$ (que é $\\Theta(n)$ quando $k = O(n)$), sem realizar <em>nenhuma</em> comparação entre elementos da entrada!</li>
            <li><strong>Estabilidade e Ordenação Digital (<code>RADIX-SORT</code>):</strong> Um algoritmo é <strong>estável</strong> se preserva a ordem relativa original de elementos com chaves idênticas. O laço regressivo (<code>downto 1</code>) de <code>COUNTING-SORT</code> garante estabilidade e permite que <code>RADIX-SORT</code> ordene números de $d$ dígitos do dígito <strong>menos significativo (LSD)</strong> para o <strong>mais significativo (MSD)</strong> em tempo $\\Theta(d(n+k))$ (Lema 8.3), ou inteiros de $b$ bits agrupados em dígitos de $r \\approx \\lg n$ bits em tempo $\\Theta((b/r)(n + 2^r))$ (Lema 8.4).</li>
            <li><strong>Ordenação por Balde (<code>BUCKET-SORT</code>):</strong> Assume que as chaves reais são distribuídas uniforme e independentemente em $[0, 1)$. Dividindo $[0, 1)$ em $n$ baldes $B[0 \\dots n-1]$ e usando variáveis aleatórias indicadoras $X_{ij}$, prova-se que o quadrado esperado do tamanho de cada balde é $E[n_i^2] = 2 - \\frac{1}{n}$, garantindo tempo médio $\\Theta(n)$ mesmo usando <code>INSERTION-SORT</code> quadrático dentro de cada balde.</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 03 • ESTATÍSTICAS DE ORDEM E PODA ]",
        title: "Torneios de Mínimo/Máximo (3⌊n/2⌋) e Seleção Aleatorizada em Tempo Esperado O(n)",
        body: `
          <p>A <strong>$i$-ésima estatística de ordem</strong> de um conjunto de $n$ elementos é o seu $i$-ésimo menor elemento ($i=1$ é o mínimo, $i=n$ é o máximo, e $i = \\lfloor(n+1)/2\\rfloor$ é a mediana inferior). Resolver seleção ordenando tudo em $O(n \\lg n)$ é um desperdício assintótico:</p>
          <ul>
            <li><strong>Mínimo e Máximo Simultâneos (Seção 9.1):</strong> Determinar apenas o mínimo exige exatamente $n - 1$ comparações (ótimo pelo argumento do torneio onde $n-1$ elementos precisam perder ao menos uma partida). Já para encontrar o mínimo e o máximo simultaneamente, comparar elementos de entrada <strong>aos pares</strong> antes de testar o menor contra o <code>min</code> atual e o maior contra o <code>max</code> atual reduz o custo de $2n - 2$ para no máximo $\\mathbf{3\\lfloor n/2 \\rfloor}$ comparações (3 comparações para cada 2 elementos)!</li>
            <li><strong>Seleção Aleatorizada (<code>RANDOMIZED-SELECT</code>, Seção 9.2):</strong> Inspirado no Quicksort, particiona o subarranjo com <code>RANDOMIZED-PARTITION</code>, mas — ao contrário do Quicksort que faz duas chamadas recursivas — <strong>poda uma das metades</strong> e recursiona apenas no lado que contém a $i$-ésima estatística desejada. Essa assimetria reduz a recorrência esperada para uma série geométrica decrescente, resultando em tempo esperado $\\mathbf{E[T(n)] = \\Theta(n)}$.</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 04 • MEDIANA DAS MEDIANAS ]",
        title: "O Algoritmo Determinístico SELECT (BFPRT) em Tempo O(n) no Pior Caso",
        body: `
          <p>Enquanto <code>RANDOMIZED-SELECT</code> possui pior caso $\\Theta(n^2)$ (se o pivô sorteado for sempre um extremo), Blum, Floyd, Pratt, Rivest e Tarjan criaram o algoritmo determinístico <code>SELECT</code> (Seção 9.3), que garante tempo $\\mathbf{O(n)}$ <strong>no pior caso</strong> mesmo usando apenas comparações:</p>
          <ul>
            <li><strong>A Engenharia dos Grupos de 5:</strong> Ao dividir os $n$ elementos em $\\lceil n/5 \\rceil$ colunas de 5 elementos, ordenar cada coluna por inserção em $O(1)$ e encontrar recursivamente a mediana $x$ das $\\lceil n/5 \\rceil$ medianas em $T(\\lceil n/5 \\rceil)$, o algoritmo garante geometricamente que pelo menos $\\frac{3n}{10} - 6$ elementos são maiores que $x$ e pelo menos $\\frac{3n}{10} - 6$ são menores que $x$.</li>
            <li><strong>Soma de Frações Estritamente Menor que 1:</strong> A chamada recursiva restante processa no máximo $\\frac{7n}{10} + 6$ elementos. Na recorrência $T(n) \\le T(\\lceil n/5 \\rceil) + T(7n/10 + 6) + an$, a soma dos tamanhos fracionários dos subproblemas é $\\frac{1}{5} + \\frac{7}{10} = \\frac{9}{10} < 1$, deixando uma folga linear $\\frac{1}{10}cn$ que absorve o custo de particionamento $an$ (por exemplo, para $n \\ge 140$ e $c \\ge 20a$).</li>
          </ul>
        `
      }
    ],
    checklist: [
      "Compreendo o modelo da árvore de decisão e sei demonstrar o Teorema 8.1: qualquer algoritmo de ordenação por comparação exige Ω(n lg n) comparações no pior caso (2^h ≥ l ≥ n!).",
      "Domino o funcionamento de COUNTING-SORT(A, B, k) em Θ(n + k) e sei provar por que o laço regressivo da linha 10 (j = A.comprimento downto 1) é indispensável para a estabilidade.",
      "Sei demonstrar os Lemas 8.3 e 8.4 para RADIX-SORT (escolhendo r ≈ lg n bits por dígito) e a prova com variáveis indicadoras X_ij de que E[n_i²] = 2 - 1/n em BUCKET-SORT.",
      "Sei explicar o torneio ótimo de n - 1 comparações para MINIMUM, o pareamento de 3⌊n/2⌋ comparações para mínimo e máximo simultâneos e a prova por substituição de E[T(n)] = O(n) para RANDOMIZED-SELECT.",
      "Domino os 5 passos do algoritmo determinístico SELECT (Mediana das Medianas), a contagem geométrica 3(⌈(1/2)⌈n/5⌉⌉ - 2) ≥ 3n/10 - 6 e por que grupos de 5 ou 7 funcionam em O(n), mas grupos de 3 falham (1/3 + 2/3 = 1)."
    ]
  };

  const unidades = [
    /* ======================================================================
       UNIDADE 6.1 — CAPÍTULO 8, SEÇÃO 8.1 (pp. 166–170)
       ====================================================================== */
    {
      id: "u6-1",
      code: "UNIDADE 6.1 • CAP. 8 (SEÇÃO 8.1)",
      pages: "pp. 166–170",
      title: "8.1 Limites Inferiores para Ordenação por Comparação e o Modelo da Árvore de Decisão",
      content: `
        <p>Nos capítulos anteriores, vimos algoritmos capazes de ordenar $n$ números em tempo $O(n \\lg n)$: a ordenação por intercalação (<code>MERGE-SORT</code>) e a ordenação por heap (<code>HEAPSORT</code>) atingem esse limite superior no pior caso, enquanto o <code>QUICKSORT</code> o atinge no caso médio. Além disso, para cada um desses algoritmos, somos capazes de exibir uma sequência de entrada de $n$ números que o força a gastar tempo $\\Omega(n \\lg n)$.</p>
        <p>Todos esses algoritmos pertencem à classe das <strong>ordenações por comparação</strong>: a sequência ordenada que eles produzem baseia-se <em>unicamente</em> em comparações diretas entre elementos da entrada.</p>

        <h3>1. O que é uma Ordenação por Comparação? (p. 166)</h3>
        <p>Em uma ordenação por comparação, usamos somente testes de ordem entre pares de elementos para extrair informações sobre uma sequência de entrada $\\langle a_1, a_2, \\dots, a_n \\rangle$. Dados dois elementos $a_i$ e $a_j$, executamos um dos cinco testes relacionais:</p>
        $$a_i < a_j, \\qquad a_i \\le a_j, \\qquad a_i = a_j, \\qquad a_i > a_j \\qquad \\text{ou} \\qquad a_i \\ge a_j$$
        <p>para determinar sua ordem relativa. <strong>Restrição fundamental do modelo:</strong> não podemos inspecionar os valores internos dos elementos (como seus bits ou dígitos decimais), nem usá-los como índices de arranjos ou realizar operações aritméticas sobre eles para deduzir a ordem.</p>
        <p>Para demonstrar um limite inferior válido para qualquer algoritmo de ordenação por comparação, podemos supor, <strong>sem perda de generalidade, que todos os $n$ elementos de entrada são distintos</strong> (afinal, se um limite inferior já vale para o subconjunto restrito de entradas com elementos distintos, ele vale por mais razão ainda para o problema geral!). Sob a premissa de elementos distintos:</p>
        <ul>
          <li>Comparações de igualdade estrita $a_i = a_j$ são inúteis (seu resultado é sempre falso), logo podemos assumir que não são feitas.</li>
          <li>As comparações $a_i \\le a_j$, $a_i \\ge a_j$, $a_i > a_j$ e $a_i < a_j$ são matematicamente equivalentes, pois fornecem exatamente a mesma informação binária sobre a ordem relativa entre $a_i$ e $a_j$. Portanto, padronizamos que <strong>todas as comparações têm a forma $a_i \\le a_j$</strong>.</li>
        </ul>

        <h3>2. O Modelo da Árvore de Decisão (pp. 166–168)</h3>
        <p>Qualquer algoritmo de ordenação por comparação determinístico aplicado a uma entrada de tamanho fixo $n$ pode ser representado de maneira exata por uma <strong>árvore de decisão</strong> (abstraindo movimentação de dados, variáveis de controle de laço e indexação, e focando exclusivamente nas comparações entre elementos):</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ DEFINIÇÃO FORMAL • MODELO DA ÁRVORE DE DECISÃO (pp. 166–167) ]</span>
          <p>Uma <strong>árvore de decisão</strong> para um algoritmo de ordenação sobre $n$ elementos é uma <strong>árvore binária cheia</strong> (cada nó interno possui exatamente dois filhos) com a seguinte estrutura:</p>
          <ul>
            <li><strong>Nós Internos ($i:j$):</strong> Cada nó interno é rotulado por um par de índices $i:j$ (com $1 \\le i, j \\le n$), indicando que o algoritmo compara os elementos originais $a_i$ e $a_j$ testando se $a_i \\le a_j$.</li>
            <li><strong>Ramos Esquerdo e Direito:</strong> Se a condição $a_i \\le a_j$ for <strong>verdadeira</strong>, a execução segue para a <strong>subárvore esquerda</strong>; se for <strong>falsa</strong> (isto é, $a_i > a_j$), a execução segue para a <strong>subárvore direita</strong>.</li>
            <li><strong>Folhas ($\\langle \\pi(1), \\pi(2), \\dots, \\pi(n) \\rangle$):</strong> Cada folha é rotulada por uma permutação $\\langle \\pi(1), \\pi(2), \\dots, \\pi(n) \\rangle$ dos índices $\\{1, 2, \\dots, n\\}$. Quando a execução atinge essa folha, o algoritmo estabeleceu univocamente a ordenação total:
              $$a_{\\pi(1)} \\le a_{\\pi(2)} \\le \\dots \\le a_{\\pi(n)}.$$</li>
          </ul>
        </div>

        <h4>Ilustração Canônica: Árvore de Decisão de <code>INSERTION-SORT</code> para $n = 3$ (Figura 8.1, p. 167)</h4>
        <p>Para $n = 3$ elementos $\\langle a_1, a_2, a_3 \\rangle$, existem $3! = 6$ permutações possíveis, logo a árvore de decisão possui exatamente 6 folhas:</p>
        <div class="pseudocode-block">
          <div class="pseudocode-header">
            <span class="pseudocode-title">FIGURA 8.1 — ÁRVORE DE DECISÃO PARA INSERTION-SORT COM n = 3 ELEMENTOS</span>
            <span class="bracket-tag">6 FOLHAS = 3! PERMUTAÇÕES</span>
          </div>
          <pre><code>                            [ 1 : 2 ]               (Compara a₁ ≤ a₂)
                           /         \\
                    ( ≤ ) /           \\ ( > )
                         /             \\
                    [ 2 : 3 ]         [ 1 : 3 ]
                   /         \\       /         \\
             (≤)  /       (>) \\ (≤) /       (>) \\
                 /             \\   /             \\
            〈1, 2, 3〉      [ 1 : 3 ]           [ 2 : 3 ]
            (prof. 2)      /       \\    〈2, 1, 3〉  /       \\
                      (≤) /     (>) \\   (prof. 2) / (≤) (>) \\
                         /           \\           /           \\
                    〈1, 3, 2〉     〈3, 1, 2〉  〈2, 3, 1〉     〈3, 2, 1〉
                    (prof. 3)     (prof. 3)  (prof. 3)     (prof. 3)</code></pre>
        </div>
        <p><strong>Rastreamento do exemplo da Figura 8.1:</strong> Considere a entrada $\\langle a_1 = 6, a_2 = 8, a_3 = 5 \\rangle$:</p>
        <ol>
          <li>Na raiz <code>1:2</code>, testamos $a_1 \\le a_2 \\iff 6 \\le 8$ (Verdadeiro $\\to$ ramo esquerdo).</li>
          <li>No nó <code>2:3</code>, testamos $a_2 \\le a_3 \\iff 8 \\le 5$ (Falso $\\to$ ramo direito).</li>
          <li>No nó <code>1:3</code>, testamos $a_1 \\le a_3 \\iff 6 \\le 5$ (Falso $\\to$ ramo direito), chegando à folha $\\langle 3, 1, 2 \\rangle$, que certifica a ordem correta $a_3 = 5 \\le a_1 = 6 \\le a_2 = 8$ após 3 comparações!</li>
        </ol>

        <p><strong>Condição Necessária de Correção ($l \\ge n!$):</strong> Como qualquer algoritmo de ordenação correto deve ser capaz de produzir cada permutação possível de sua entrada, <strong>cada uma das $n!$ permutações sobre $n$ elementos deve aparecer como pelo menos uma folha alcançável (acessível) da árvore de decisão</strong>. (Se duas permutações distintas levassem à mesma folha, o algoritmo aplicaria o mesmo reordenamento $\\pi$ a ambas e erraria em pelo menos uma delas!)</p>

        <h3>3. Limite Inferior para o Pior Caso: Teorema 8.1 e Corolário 8.2 (pp. 168–169)</h3>
        <p>O número de comparações executadas no <strong>pior caso</strong> por um algoritmo de ordenação por comparação corresponde exatamente ao comprimento do caminho simples mais longo da raiz até qualquer folha alcançável — isto é, à <strong>altura $h$</strong> de sua árvore de decisão.</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 8.1 • LIMITE INFERIOR PARA ORDENAÇÃO POR COMPARAÇÃO (p. 168) ]</span>
          <p><strong>Enunciado:</strong> Qualquer algoritmo de ordenação por comparação exige $\\Omega(n \\lg n)$ comparações no pior caso.</p>
          <p><strong>Demonstração Formal Completa:</strong><br/>
          Pela discussão anterior, basta determinar a altura mínima $h$ de uma árvore de decisão na qual cada permutação aparece como uma folha alcançável. Considere uma árvore de decisão de altura $h$ com $l$ folhas alcançáveis correspondente a uma ordenação por comparação de $n$ elementos.<br/>
          1. Como cada uma das $n!$ permutações da entrada aparece em alguma folha alcançável, temos obrigatoriamente:
          $$n! \\le l.$$
          2. Por outro lado, como uma árvore binária de altura $h$ não pode ter mais do que $2^h$ folhas (propriedade estrutural demonstrável por indução imediata em $h$), temos:
          $$l \\le 2^h.$$
          3. Combinando as duas desigualdades em uma única cadeia:
          $$n! \\le l \\le 2^h \\implies 2^h \\ge n!.$$
          4. Aplicando o logaritmo binário ($\\lg$, que é estritamente crescente) em ambos os lados e utilizando a aproximação de Stirling da Equação (3.19) ($\\lg(n!) = \\Theta(n \\lg n)$, ou $n! > (n/e)^n$):
          $$h \\ge \\lg(n!) = \\Omega(n \\lg n). \\quad \\blacksquare$$
          <hr style="border:none;border-top:1px dashed var(--border-color);margin:0.85rem 0;" />
          <p><strong>Corolário 8.2 (Otimalidade Assintótica, p. 169):</strong> A ordenação por heap (<code>HEAPSORT</code>) e a ordenação por intercalação (<code>MERGE-SORT</code>) são <strong>algoritmos de ordenação por comparação assintoticamente ótimos</strong>.<br/>
          <em>Prova:</em> Os limites superiores $O(n \\lg n)$ dos tempos de execução de <code>HEAPSORT</code> (Cap. 6) e <code>MERGE-SORT</code> (Cap. 2) coincidem assintoticamente com o limite inferior $\\Omega(n \\lg n)$ do pior caso estabelecido pelo Teorema 8.1. $\\blacksquare$</p>
        </div>

        <p><strong>Nota sobre o Problema 8-1 (Limites Inferiores Probabilísticos / Caso Médio):</strong> Mesmo se o algoritmo de comparação for aleatorizado ou se analisarmos o <strong>comprimento médio do caminho externo</strong> $D(T)/n!$ sobre todas as $n!$ permutações equiprováveis, a soma das profundidades das $k = n!$ folhas de qualquer árvore binária satisfaz $D(T) \\ge k \\lg k = n! \\lg(n!)$, provando que o número <em>esperado</em> de comparações também é $\\Omega(n \\lg n)$!</p>

        <div id="workbench-mod6-mount"></div>
      `
    },

    /* ======================================================================
       UNIDADE 6.2 — CAPÍTULO 8, SEÇÃO 8.2 (pp. 170–173)
       ====================================================================== */
    {
      id: "u6-2",
      code: "UNIDADE 6.2 • CAP. 8 (SEÇÃO 8.2)",
      pages: "pp. 170–173",
      title: "8.2 Ordenação por Contagem (COUNTING-SORT) e a Propriedade de Estabilidade",
      content: `
        <p>A <strong>ordenação por contagem</strong> (<code>COUNTING-SORT</code>) supõe que cada um dos $n$ elementos de entrada é um número inteiro pertencente à faixa de $0$ a $k$, para algum inteiro $k$. Quando $k = O(n)$, a ordenação é executada em tempo $\\Theta(n)$!</p>

        <h3>1. Ideia Central e Arranjos Envolvidos (p. 170)</h3>
        <p>A ideia de <code>COUNTING-SORT</code> é determinar, para cada elemento de entrada $x$, <strong>quantos elementos de entrada são menores ou iguais a $x$</strong>. De posse dessa informação, podemos inserir $x$ diretamente em sua posição final exata no arranjo de saída! Por exemplo, se todos os elementos forem distintos e existirem $17$ elementos menores ou iguais a $x$ (incluindo o próprio $x$), então $x$ pertence exatamente à posição $17$ do arranjo de saída $B[1 \\dots n]$. Quando há elementos repetidos (não distintos), precisamos apenas ajustar ligeiramente esse esquema decrementando o contador a cada inserção para não sobrescrever a mesma posição.</p>
        <p>No código de <code>COUNTING-SORT</code>, utilizamos três arranjos:</p>
        <ul>
          <li><code>A[1 .. n]</code>: o arranjo de entrada de comprimento $A.\\text{comprimento} = n$, cujos elementos pertencem a $\\{0, 1, \\dots, k\\}$;</li>
          <li><code>B[1 .. n]</code>: o arranjo que recebe a saída ordenada final;</li>
          <li><code>C[0 .. k]</code>: o arranjo auxiliar de trabalho (com $k + 1$ posições, indexado de $0$ a $k$) que armazena primeiro o histograma de frequências e depois as somas de prefixos (contagens acumuladas).</li>
        </ul>

        <h3>2. Pseudocódigo Canônico de <code>COUNTING-SORT</code> (p. 170)</h3>
        <div class="pseudocode-block">
          <div class="pseudocode-header">
            <span class="pseudocode-title">COUNTING-SORT(A, B, k) — CLRS p. 170</span>
            <span class="bracket-tag">TEMPO Θ(n + k) • ESTÁVEL</span>
          </div>
          <pre><code> 1  seja C[0 .. k] um novo arranjo
 2  for i = 0 to k
 3      C[i] = 0
 4  for j = 1 to A.comprimento
 5      C[A[j]] = C[A[j]] + 1
 6  // C[i] agora contém o número de elementos iguais a i.
 7  for i = 1 to k
 8      C[i] = C[i] + C[i - 1]
 9  // C[i] agora contém o número de elementos menores ou iguais a i.
10  for j = A.comprimento downto 1
11      B[C[A[j]]] = A[j]
12      C[A[j]] = C[A[j]] - 1</code></pre>
        </div>

        <h3>3. Rastreamento Completo da Figura 8.2 (pp. 170–171)</h3>
        <p>Considere o arranjo de entrada da Figura 8.2 com $n = 8$ elementos e limite superior $k = 5$:</p>
        $$A[1 \\dots 8] = \\langle 2_a, 5, 3_a, 0_a, 2_b, 3_b, 0_b, 3_c \\rangle$$
        <p><em>(Adicionamos os subscritos $a, b, c$ apenas para rastrear visualmente elementos de mesmo valor e comprovar a estabilidade!)</em></p>
        <ol>
          <li><strong>Fase 1 — Inicialização (linhas 2–3):</strong> O arranjo $C[0 \\dots 5]$ é zerado: $C = \\langle 0, 0, 0, 0, 0, 0 \\rangle$.</li>
          <li><strong>Fase 2 — Contagem de Frequências (linhas 4–5, Figura 8.2a):</strong> Varremos $A[1 \\dots 8]$ incrementando $C[A[j]]$. Ao final da linha 5, $C[i]$ guarda quantas vezes o inteiro $i$ ocorre em $A$:
            $$\\begin{array}{c|cccccc}
            i & 0 & 1 & 2 & 3 & 4 & 5 \\\\ \\hline
            C[i] \\text{ (após linha 5)} & 2 & 0 & 2 & 3 & 0 & 1
            \\end{array}$$</li>
          <li><strong>Fase 3 — Somas Acumuladas / Prefixos (linhas 7–8, Figura 8.2b):</strong> Para $i = 1 \\dots 5$, fazemos $C[i] = C[i] + C[i-1]$. Ao final da linha 8, $C[i]$ indica exatamente quantos elementos de $A$ são $\\le i$ (ou seja, a última posição que o valor $i$ deve ocupar em $B[1 \\dots 8]$):
            $$\\begin{array}{c|cccccc}
            i & 0 & 1 & 2 & 3 & 4 & 5 \\\\ \\hline
            C[i] \\text{ (após linha 8)} & 2 & 2 & 4 & 7 & 7 & 8
            \\end{array}$$</li>
          <li><strong>Fase 4 — Posicionamento Regressivo em $B$ (linhas 10–12, Figuras 8.2c–f):</strong> Percorremos $A$ de trás para frente ($j = 8$ até $1$):
            <ul>
              <li>$j = 8$ ($A[8] = 3_c$): Como $C[3] = 7$, colocamos $B[7] = 3_c$ e decrementamos $C[3]$ para $6$.</li>
              <li>$j = 7$ ($A[7] = 0_b$): Como $C[0] = 2$, colocamos $B[2] = 0_b$ e decrementamos $C[0]$ para $1$.</li>
              <li>$j = 6$ ($A[6] = 3_b$): Como $C[3] = 6$, colocamos $B[6] = 3_b$ e decrementamos $C[3]$ para $5$.</li>
              <li>$j = 5$ ($A[5] = 2_b$): Como $C[2] = 4$, colocamos $B[4] = 2_b$ e decrementamos $C[2]$ para $3$.</li>
              <li>$j = 4$ ($A[4] = 0_a$): Como $C[0] = 1$, colocamos $B[1] = 0_a$ e decrementamos $C[0]$ para $0$.</li>
              <li>$j = 3$ ($A[3] = 3_a$): Como $C[3] = 5$, colocamos $B[5] = 3_a$ e decrementamos $C[3]$ para $4$.</li>
              <li>$j = 2$ ($A[2] = 5$): Como $C[5] = 8$, colocamos $B[8] = 5$ e decrementamos $C[5]$ para $7$.</li>
              <li>$j = 1$ ($A[1] = 2_a$): Como $C[2] = 3$, colocamos $B[3] = 2_a$ e decrementamos $C[2]$ para $2$.</li>
            </ul>
            Resultado final em $B[1 \\dots 8]$:
            $$B[1 \\dots 8] = \\langle 0_a, 0_b, 2_a, 2_b, 3_a, 3_b, 3_c, 5 \\rangle.$$</li>
        </ol>

        <h3>4. Análise de Tempo de Execução e Ausência de Comparações (pp. 171–172)</h3>
        <table class="clrs-cost-table">
          <thead>
            <tr>
              <th>Trecho do Algoritmo</th>
              <th>Linhas</th>
              <th>Número de Iterações</th>
              <th>Tempo Gasto</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Inicialização de $C[0 \\dots k]$ com zeros</td>
              <td>Linhas 2–3</td>
              <td>$k + 1$</td>
              <td>$\\Theta(k)$</td>
            </tr>
            <tr>
              <td>Contagem da frequência de cada $A[j]$</td>
              <td>Linhas 4–5</td>
              <td>$n$</td>
              <td>$\\Theta(n)$</td>
            </tr>
            <tr>
              <td>Acumulação de somas de prefixos em $C[1 \\dots k]$</td>
              <td>Linhas 7–8</td>
              <td>$k$</td>
              <td>$\\Theta(k)$</td>
            </tr>
            <tr>
              <td>Preenchimento do arranjo de saída $B[1 \\dots n]$</td>
              <td>Linhas 10–12</td>
              <td>$n$</td>
              <td>$\\Theta(n)$</td>
            </tr>
            <tr style="background:rgba(16,185,129,0.08);font-weight:700;">
              <td><strong>Tempo de Execução Total</strong></td>
              <td>Linhas 1–12</td>
              <td>$2n + 2k + 1$</td>
              <td><strong>$\\Theta(n + k)$</strong> (ou $\\Theta(n)$ quando $k = O(n)$)</td>
            </tr>
          </tbody>
        </table>
        <p><strong>Por que <code>COUNTING-SORT</code> bate o limite $\\Omega(n \\lg n)$?</strong> Porque ele <strong>não é uma ordenação por comparação</strong>! De fato, nenhuma comparação entre elementos de entrada ($A[i] \\le A[j]$) ocorre em qualquer linha do código. Em vez disso, <code>COUNTING-SORT</code> usa o <em>valor numérico real</em> de cada elemento $A[j]$ para indexar diretamente uma posição de memória no arranjo $C$ em tempo $O(1)$ no modelo RAM.</p>

        <h3>5. A Propriedade de Estabilidade e o Papel Crucial de <code>downto 1</code> (p. 172)</h3>
        <div class="canonical-callout invariant">
          <span class="callout-tag">[ PROPRIEDADE FUNDAMENTAL • ESTABILIDADE DE COUNTING-SORT (p. 172, EX. 8.2-2 E 8.2-3) ]</span>
          <p><strong>Definição de Estabilidade:</strong> Um algoritmo de ordenação é <strong>estável</strong> se elementos com o mesmo valor de chave aparecem no arranjo de saída exatamente na mesma ordem relativa em que apareciam no arranjo de entrada. Isto é, se $A[i] = A[j]$ com $i < j$, então $A[i]$ deve preceder $A[j]$ no arranjo de saída $B$.</p>
          <p><strong>Por que a estabilidade é vital?</strong></p>
          <ol>
            <li>Quando dados satélites são transportados junto com a chave que está sendo ordenada (não queremos embaralhar registros que empatam na chave atual);</li>
            <li>Porque <code>COUNTING-SORT</code> é usado como a sub-rotina de ordenação intermediária dentro de <code>RADIX-SORT</code> (Seção 8.3): para que a ordenação digital funcione corretamente, a ordenação de cada dígito <strong>precisa obrigatoriamente ser estável</strong>!</li>
          </ol>
          <p><strong>Prova da Estabilidade e Análise do Laço Regressivo (Linha 10):</strong><br/>
          Considere dois elementos iguais $A[i] = A[j] = v$ com $1 \\le i < j \\le n$. Como o laço da linha 10 percorre $A$ de trás para frente (<code>for j = A.comprimento downto 1</code>), o elemento $A[j]$ (que está mais à direita na entrada) é processado <strong>antes</strong> de $A[i]$. Quando $A[j]$ é processado, $C[v]$ aponta para a posição mais alta disponível para o valor $v$ em $B$, e em seguida $C[v]$ é decrementado na linha 12. Assim, quando $A[i]$ é alcançado mais tarde, o valor de $C[v]$ já foi reduzido, fazendo com que $A[i]$ seja colocado em um índice estritamente menor em $B$ do que $A[j]$! Logo, a ordem relativa $i < j$ é preservada.<br/>
          <em>E se trocássemos a linha 10 para <code>for j = 1 to A.comprimento</code> (Exercício 8.2-3)?</em> O arranjo $B$ ainda ficaria ordenado pelos valores das chaves (pois os mesmos $C[v]$ slots seriam preenchidos com o valor $v$), mas o algoritmo <strong>deixaria de ser estável</strong> (ele inverteria a ordem relativa dos elementos iguais, colocando $A[i]$ na maior posição e $A[j]$ antes dele)!</p>
        </div>
      `
    },

    /* ======================================================================
       UNIDADE 6.3 — CAPÍTULO 8, SEÇÕES 8.3 E 8.4 (pp. 173–181)
       ====================================================================== */
    {
      id: "u6-3",
      code: "UNIDADE 6.3 • CAP. 8 (SEÇÕES 8.3 E 8.4)",
      pages: "pp. 173–181",
      title: "8.3 e 8.4 Ordenação Digital (RADIX-SORT) e Ordenação por Balde (BUCKET-SORT)",
      content: `
        <h3>1. Ordenação Digital (<code>RADIX-SORT</code>, Seção 8.3, pp. 173–176)</h3>
        <p>A <strong>ordenação digital</strong> (<code>RADIX-SORT</code>) nasceu historicamente nas máquinas eletromecânicas de tabulação de cartões perfurados de Herman Hollerith (cartões de 80 colunas com 12 posições por coluna, das quais 10 codificam dígitos decimais). Um ordenador mecânico de cartões só consegue inspecionar uma única coluna por vez e distribuir a pilha em 10 caixas (0 a 9).</p>
        <p><strong>Por que ordenar do Dígito Menos Significativo (LSD) para o Mais Significativo (MSD)?</strong><br/>
        Intuitivamente, alguém tentaria ordenar primeiro pelo dígito <em>mais significativo</em> (MSD) e depois ordenar recursivamente cada uma das 10 caixas. Porém, em uma máquina de cartões, isso obrigaria o operador a guardar e controlar muitas pilhas intermediárias (9 pilhas postas de lado a cada nível de recursão, exigindo no pior caso $\\frac{10^d - 1}{9}$ passagens e $9d + 1$ pilhas — Exercício 8.3-5!).<br/>
        O <code>RADIX-SORT</code> resolve o problema de modo contraintuitivo e brilhante: ordena a pilha inteira primeiro pelo <strong>dígito menos significativo (dígito 1)</strong>, recombina todas as caixas de 0 a 9 em uma única pilha, ordena pelo <strong>segundo dígito menos significativo (dígito 2)</strong> usando uma ordenação <strong>estável</strong>, e assim sucessivamente até o <strong>dígito mais significativo (dígito $d$)</strong>, exigindo apenas $d$ passagens sobre a pilha única!</p>

        <div class="pseudocode-block">
          <div class="pseudocode-header">
            <span class="pseudocode-title">RADIX-SORT(A, d) — CLRS p. 174</span>
            <span class="bracket-tag">LSD → MSD • EXIGE SUB-ROTINA ESTÁVEL</span>
          </div>
          <pre><code>1  for i = 1 to d
2      use uma ordenação estável para ordenar o arranjo A sobre o dígito i</code></pre>
        </div>

        <h4>Ilustração Canônica: Figura 8.3 (p. 174)</h4>
        <p>Veja como <code>RADIX-SORT</code> ordena $n = 7$ números decimais de $d = 3$ dígitos em 3 passagens estáveis (da coluna da direita para a coluna da esquerda):</p>
        $$\\begin{array}{cccc}
        \\textbf{Entrada} & \\textbf{Após Dígito 1 (Unidade)} & \\textbf{Após Dígito 2 (Dezena)} & \\textbf{Após Dígito 3 (Centena)} \\\\ \\hline
        32\\mathbf{9} & 72\\mathbf{0} & 7\\mathbf{2}0 & \\mathbf{3}29 \\\\
        45\\mathbf{7} & 35\\mathbf{5} & 3\\mathbf{2}9 & \\mathbf{3}55 \\\\
        65\\mathbf{7} & 43\\mathbf{6} & 4\\mathbf{3}6 & \\mathbf{4}36 \\\\
        83\\mathbf{9} & 45\\mathbf{7} & 8\\mathbf{3}9 & \\mathbf{4}57 \\\\
        43\\mathbf{6} & 65\\mathbf{7} & 3\\mathbf{5}5 & \\mathbf{6}57 \\\\
        72\\mathbf{0} & 32\\mathbf{9} & 4\\mathbf{5}7 & \\mathbf{7}20 \\\\
        35\\mathbf{5} & 83\\mathbf{9} & 6\\mathbf{5}7 & \\mathbf{8}39
        \\end{array}$$
        <p>Observe na última passagem como $436$ e $457$ empatam no dígito da centena ($4$), mas como na coluna anterior $436$ já aparecia antes de $457$ (pois $3 < 5$ na dezena), a <strong>estabilidade</strong> garante que $436$ permaneça antes de $457$!</p>

        <h4>Lema 8.3 e Lema 8.4: Otimização da Base e Tamanho do Dígito em Bits (pp. 174–176)</h4>
        <div class="canonical-callout theorem">
          <span class="callout-tag">[ LEMAS 8.3 E 8.4 • COMPLEXIDADE E AGRUPAMENTO DE BITS NO RADIX-SORT (pp. 174–175) ]</span>
          <p><strong>Lema 8.3:</strong> Dados $n$ números de $d$ dígitos nos quais cada dígito pode assumir até $k$ valores possíveis, o procedimento <code>RADIX-SORT</code> ordena corretamente esses números no tempo $\\mathbf{\\Theta(d(n + k))}$ se a ordenação estável usada levar tempo $\\Theta(n + k)$ (como <code>COUNTING-SORT</code>).<br/>
          <em>Prova por Indução (Exercício 8.3-3):</em> Suponha por hipótese indutiva que após a passagem $i - 1$ os números estejam corretamente ordenados pelos seus $i - 1$ dígitos menos significativos. Na passagem $i$, ordenamos pelo $i$-ésimo dígito: se dois números têm dígitos diferentes na posição $i$, a passagem $i$ os coloca na ordem correta (já que o dígito $i$ domina todos os dígitos $1 \\dots i-1$); se eles têm o <strong>mesmo dígito</strong> na posição $i$, a <strong>estabilidade</strong> da ordenação intermediária preserva a ordem relativa da passagem $i - 1$, na qual já estavam ordenados pelos dígitos $1 \\dots i-1$! Como cada uma das $d$ passagens de <code>COUNTING-SORT</code> custa $\\Theta(n + k)$, o tempo total é $\\Theta(d(n + k))$. $\\blacksquare$</p>
          <hr style="border:none;border-top:1px dashed var(--border-color);margin:0.85rem 0;" />
          <p><strong>Lema 8.4 (Decomposição de Palavras de $b$ Bits em Dígitos de $r$ Bits):</strong> Dados $n$ números de $b$ bits e qualquer inteiro positivo $r \\le b$, o <code>RADIX-SORT</code> ordena corretamente esses números no tempo:</p>
          $$\\mathbf{T(n) = \\Theta\\left(\\frac{b}{r}(n + 2^r)\\right)}$$
          <p>se a ordenação estável usada levar tempo $\\Theta(n + k)$ para entradas na faixa de $0$ a $k$.<br/>
          <em>Prova:</em> Enxergamos cada chave de $b$ bits como tendo $d = \\lceil b/r \\rceil$ dígitos de $r$ bits cada. Cada dígito é um inteiro na faixa de $0$ a $2^r - 1$, permitindo usar <code>COUNTING-SORT</code> com $k = 2^r - 1$ em cada uma das $d$ passagens. (Por exemplo, uma palavra de $b = 32$ bits pode ser vista como $d = 4$ dígitos de $r = 8$ bits com $k = 2^8 - 1 = 255$.)</p>
          <p><strong>Como escolher o valor ótimo de $r \\le b$ para minimizar $\\frac{b}{r}(n + 2^r)$?</strong></p>
          <ul>
            <li><strong>Caso 1 ($b < \\lfloor \\lg n \\rfloor$):</strong> Para qualquer $r \\le b$, temos $2^r \\le 2^b < n$, logo $n + 2^r = \\Theta(n)$. Escolhendo $r = b$ (uma única passagem!), obtemos $\\frac{b}{b}(n + 2^b) = \\mathbf{\\Theta(n)}$, que é assintoticamente ótimo.</li>
            <li><strong>Caso 2 ($b \\ge \\lfloor \\lg n \\rfloor$):</strong> Escolher $\\mathbf{r = \\lfloor \\lg n \\rfloor}$ fornece o melhor tempo dentro de um fator constante:
              $$T(n) = \\Theta\\left(\\frac{b}{\\lfloor \\lg n \\rfloor}(n + 2^{\\lfloor \\lg n \\rfloor})\\right) = \\mathbf{\\Theta\\left(\\frac{bn}{\\lg n}\\right)}.$$
              Se aumentarmos $r$ acima de $\\lg n$, o termo exponencial $2^r$ no numerador cresce muito mais rápido que o denominador linear $r$, degradando o tempo para $\\omega(bn/\\lg n)$; se diminuirmos $r$ abaixo de $\\lg n$, o fator $b/r$ cresce enquanto $n + 2^r$ permanece em $\\Theta(n)$. Em particular, se $b = O(\\lg n)$, escolher $r \\approx \\lg n$ garante tempo linear $\\mathbf{\\Theta(n)}$!</li>
          </ul>
        </div>

        <p><strong>Comparação Prática: <code>RADIX-SORT</code> vs. <code>QUICKSORT</code> (p. 176):</strong> Embora $\\Theta(n)$ pareça assintoticamente superior ao $\\Theta(n \\lg n)$ esperado do Quicksort quando $b = O(\\lg n)$, na prática os fatores constantes ocultos em $\\Theta$ no <code>RADIX-SORT</code> por passagem podem ser maiores, o <code>QUICKSORT</code> explora melhor a localidade de cache do hardware e, crucialmente, o <code>RADIX-SORT</code> baseado em <code>COUNTING-SORT</code> <strong>não ordena no lugar (não é in-place)</strong>, exigindo memória auxiliar $\\Theta(n + 2^r)$.</p>

        <h3>2. Ordenação por Balde (<code>BUCKET-SORT</code>, Seção 8.4, pp. 176–180)</h3>
        <p>Enquanto a ordenação por contagem assume inteiros em uma faixa pequena, a <strong>ordenação por balde</strong> (<code>BUCKET-SORT</code>) supõe que a entrada é gerada por um processo aleatório que distribui elementos de modo <strong>uniforme e independente no intervalo semiaberto $[0, 1)$</strong>.</p>
        <p>O algoritmo divide o intervalo $[0, 1)$ em $n$ subintervalos de mesmo tamanho (chamados <strong>baldes</strong> ou <em>buckets</em>), onde o $i$-ésimo balde $B[i]$ corresponde ao subintervalo $[i/n, (i+1)/n)$ para $i = 0, 1, \\dots, n-1$. Cada elemento $A[i] \\in [0, 1)$ é inserido na lista encadeada do balde de índice $\\lfloor n A[i] \\rfloor$. Depois, ordenamos cada balde individualmente com <code>INSERTION-SORT</code> e concatenamos os baldes $B[0], B[1], \\dots, B[n-1]$ em ordem.</p>

        <div class="pseudocode-block">
          <div class="pseudocode-header">
            <span class="pseudocode-title">BUCKET-SORT(A) — CLRS p. 177</span>
            <span class="bracket-tag">CASO MÉDIO Θ(n) • PIOR CASO Θ(n²)</span>
          </div>
          <pre><code>1  n = A.comprimento
2  seja B[0 .. n - 1] um novo arranjo
3  for i = 0 to n - 1
4      faça B[i] uma lista vazia
5  for i = 1 to n
6      insira A[i] na lista B[⌊n A[i]⌋]
7  for i = 0 to n - 1
8      ordene a lista B[i] com ordenação por inserção
9  concatene as listas B[0], B[1], ..., B[n - 1] juntas em ordem</code></pre>
        </div>

        <h4>Análise Probabilística Rigorosa do Caso Médio com Variáveis Indicadoras (pp. 178–179)</h4>
        <p>Todas as linhas de <code>BUCKET-SORT</code>, exceto a linha 8, levam tempo $\\Theta(n)$ no pior caso. Seja $n_i$ a variável aleatória que denota o número de elementos inseridos no balde $B[i]$. Como a ordenação por inserção da lista $B[i]$ leva tempo quadrático $O(n_i^2)$, o tempo de execução de <code>BUCKET-SORT</code> é:</p>
        $$T(n) = \\Theta(n) + \\sum_{i=0}^{n-1} O(n_i^2).$$
        <p>Aplicando o valor esperado em ambos os lados e usando a <strong>linearidade da esperança</strong> (Equação 8.1):</p>
        $$E[T(n)] = E\\left[\\Theta(n) + \\sum_{i=0}^{n-1} O(n_i^2)\\right] = \\Theta(n) + \\sum_{i=0}^{n-1} O(E[n_i^2]). \\qquad (8.1)$$

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ PROVA FORMAL • EQUAÇÃO (8.2): E[n_i²] = 2 - 1/n EM BUCKET-SORT (pp. 178–179) ]</span>
          <p><strong>Afirmação (Equação 8.2):</strong> Para todo balde $i = 0, 1, \\dots, n-1$, vale:</p>
          $$E[n_i^2] = 2 - \\frac{1}{n}.$$
          <p><strong>Demonstração via Variáveis Aleatórias Indicadoras:</strong><br/>
          Para $i = 0, 1, \\dots, n-1$ e $j = 1, 2, \\dots, n$, definimos a variável aleatória indicadora:
          $$X_{ij} = \\text{I}\\{A[j] \\text{ cai no balde } i\\}.$$
          Como $A[j]$ é distribuído uniformemente em $[0, 1)$, a probabilidade de cair em qualquer um dos $n$ subintervalos de largura $1/n$ é exatamente $1/n$. Logo, $X_{ij} = 1$ com probabilidade $\\frac{1}{n}$ e $0$ com probabilidade $1 - \\frac{1}{n}$, e o número total de elementos no balde $i$ é $n_i = \\sum_{j=1}^{n} X_{ij}$.<br/>
          Para calcular $E[n_i^2]$, expandimos o quadrado do somatório separando os termos diagonais ($k = j$) dos termos cruzados ($k \\ne j$) (Equação 8.3):
          $$E[n_i^2] = E\\left[\\left(\\sum_{j=1}^{n} X_{ij}\\right)^2\\right] = E\\left[\\sum_{j=1}^{n} \\sum_{k=1}^{n} X_{ij} X_{ik}\\right] = E\\left[\\sum_{j=1}^{n} X_{ij}^2 + \\sum_{1 \\le j \\le n} \\sum_{\\substack{1 \\le k \\le n \\\\ k \\ne j}} X_{ij} X_{ik}\\right]$$
          $$E[n_i^2] = \\sum_{j=1}^{n} E[X_{ij}^2] + \\sum_{1 \\le j \\le n} \\sum_{\\substack{1 \\le k \\le n \\\\ k \\ne j}} E[X_{ij} X_{ik}]. \\qquad (8.3)$$
          Avaliamos as duas esperanças separadamente:</p>
          <ol>
            <li><strong>Termos Quadráticos ($k = j$):</strong> Como $X_{ij} \\in \\{0, 1\\}$, temos $X_{ij}^2 = X_{ij}$, logo:
              $$E[X_{ij}^2] = 1^2 \\cdot \\frac{1}{n} + 0^2 \\cdot \\left(1 - \\frac{1}{n}\\right) = \\frac{1}{n}.$$</li>
            <li><strong>Termos Cruzados ($k \\ne j$):</strong> Como os elementos $A[j]$ e $A[k]$ da entrada são <strong>independentes</strong> para $k \\ne j$, as variáveis indicadoras $X_{ij}$ e $X_{ik}$ são independentes, logo a esperança do produto é o produto das esperanças:
              $$E[X_{ij} X_{ik}] = E[X_{ij}] \\cdot E[X_{ik}] = \\frac{1}{n} \\cdot \\frac{1}{n} = \\frac{1}{n^2}.$$</li>
          </ol>
          <p>Substituindo na Equação (8.3) (observando que há $n$ termos na primeira soma e $n(n-1)$ pares com $k \\ne j$ na segunda soma):
          $$E[n_i^2] = \\sum_{j=1}^{n} \\frac{1}{n} + \\sum_{1 \\le j \\le n} \\sum_{\\substack{1 \\le k \\le n \\\\ k \\ne j}} \\frac{1}{n^2} = n \\cdot \\frac{1}{n} + n(n-1) \\cdot \\frac{1}{n^2} = 1 + \\frac{n - 1}{n} = 2 - \\frac{1}{n}.$$
          Finalmente, substituindo $E[n_i^2] = 2 - \\frac{1}{n}$ na Equação (8.1), concluímos que o tempo de execução do caso médio de <code>BUCKET-SORT</code> é:
          $$E[T(n)] = \\Theta(n) + n \\cdot O\\left(2 - \\frac{1}{n}\\right) = \\mathbf{\\Theta(n)}. \\quad \\blacksquare$$</p>
        </div>
        <p><strong>Observação Final (p. 179):</strong> Mesmo que a entrada não venha de uma distribuição perfeitamente uniforme, a Equação (8.1) garante que <code>BUCKET-SORT</code> continuará executando em tempo linear $\\Theta(n)$ sempre que a distribuição de entrada satisfizer a propriedade de que a <strong>soma dos quadrados dos tamanhos dos baldes ($\sum_{i=0}^{n-1} n_i^2$) seja linear em $n$</strong>!</p>
      `
    },

    /* ======================================================================
       UNIDADE 6.4 — CAPÍTULO 9, SEÇÃO 9.1 (pp. 183–185)
       ====================================================================== */
    {
      id: "u6-4",
      code: "UNIDADE 6.4 • CAP. 9 (SEÇÃO 9.1)",
      pages: "pp. 183–185",
      title: "9.1 Estatísticas de Ordem: Mínimo, Máximo e Mínimo/Máximo Simultâneos (3⌊n/2⌋)",
      content: `
        <h3>1. O Problema da Seleção e as Medianas Inferior e Superior (p. 183)</h3>
        <p>A <strong>$i$-ésima estatística de ordem</strong> de um conjunto de $n$ elementos é o seu <strong>$i$-ésimo menor elemento</strong>:</p>
        <ul>
          <li>O <strong>mínimo</strong> de um conjunto é a primeira estatística de ordem ($i = 1$).</li>
          <li>O <strong>máximo</strong> de um conjunto é a $n$-ésima estatística de ordem ($i = n$).</li>
          <li>Uma <strong>mediana</strong> é informalmente o "ponto médio" do conjunto. Quando $n$ é ímpar, a mediana é única e ocorre em $i = (n+1)/2$. Quando $n$ é par, existem duas medianas, em $i = n/2$ e $i = n/2 + 1$. Unificando ambos os casos para qualquer paridade de $n$, definimos:
            $$\\text{Mediana Inferior: } i = \\left\\lfloor \\frac{n + 1}{2} \\right\\rfloor \\qquad \\text{e} \\qquad \\text{Mediana Superior: } i = \\left\\lceil \\frac{n + 1}{2} \\right\\rceil.$$
            <em>Convenção do CLRS:</em> Sempre que o livro diz simplesmente "a mediana", refere-se à <strong>mediana inferior $\\lfloor(n+1)/2\\rfloor$</strong>.</li>
        </ul>

        <div class="canonical-callout invariant">
          <span class="callout-tag">[ ESPECIFICAÇÃO FORMAL • PROBLEMA DE SELEÇÃO (p. 183) ]</span>
          <ul>
            <li><strong>Entrada:</strong> Um conjunto $A$ de $n$ números (distintos) e um inteiro $i$, com $1 \\le i \\le n$.</li>
            <li><strong>Saída:</strong> O elemento $x \\in A$ que é estritamente maior que exatamente $i - 1$ outros elementos de $A$.</li>
          </ul>
          <p>Embora seja trivial resolver o problema em tempo $O(n \\lg n)$ ordenando $A$ com <code>HEAPSORT</code> ou <code>MERGE-SORT</code> e retornando $A[i]$, veremos no Capítulo 9 como resolvê-lo em <strong>tempo linear $O(n)$</strong> sem ordenar o conjunto inteiro!</p>
        </div>

        <h3>2. Mínimo (ou Máximo) Isolado e o Argumento de Otimalidade do Torneio (pp. 183–184)</h3>
        <p>Para determinar o menor elemento de um conjunto $A[1 \\dots n]$, mantemos o menor valor visto até o momento e varremos o arranjo elemento a elemento:</p>

        <div class="pseudocode-block">
          <div class="pseudocode-header">
            <span class="pseudocode-title">MINIMUM(A) — CLRS p. 184</span>
            <span class="bracket-tag">EXATAMENTE n - 1 COMPARAÇÕES • ÓTIMO</span>
          </div>
          <pre><code>1  min = A[1]
2  for i = 2 to A.comprimento
3      if min > A[i]
4          min = A[i]
5  return min</code></pre>
        </div>

        <p><strong>Por que $n - 1$ comparações é o limite inferior absoluto (ótimo)?</strong><br/>
        Imagine qualquer algoritmo baseado em comparações que determine o mínimo como um <strong>torneio eliminatório</strong> entre os $n$ elementos. Cada comparação $A[i] < A[j]$ é uma partida na qual o menor dos dois elementos vence e o maior perde. Como somente o elemento mínimo verdadeiro jamais perde uma comparação, <strong>todos os outros $n - 1$ elementos devem perder pelo menos uma partida</strong> para que tenhamos certeza de que não são o mínimo. Como cada comparação produz exatamente $1$ perdedor, são necessárias no mínimo $\\mathbf{n - 1}$ comparações no pior caso! Logo, <code>MINIMUM(A)</code> é ótimo.</p>

        <h3>3. Mínimo e Máximo Simultâneos em $3\\lfloor n/2 \\rfloor$ Comparações (pp. 184–185)</h3>
        <p>Em muitas aplicações (como em computação gráfica ao determinar a caixa delimitadora $[x_{\\min}, x_{\\max}] \\times [y_{\\min}, y_{\\max}]$ de $n$ pontos para ajustar a escala da tela), precisamos encontrar <strong>tanto o mínimo quanto o máximo</strong> de um conjunto de $n$ elementos. Se executarmos <code>MINIMUM</code> e <code>MAXIMUM</code> separadamente (ou compararmos cada novo elemento tanto com <code>min</code> quanto com <code>max</code>), gastaremos $2(n - 1) = 2n - 2$ comparações.</p>
        <p><strong>O Truque do Processamento aos Pares:</strong> Podemos reduzir o número total de comparações para no máximo $\\mathbf{3\\lfloor n/2 \\rfloor}$ (economizando cerca de $25\\%$ das comparações) processando os elementos da entrada <strong>aos pares</strong>:</p>
        <ol>
          <li><strong>Inicialização (dependente da paridade de $n$):</strong>
            <ul>
              <li>Se $n$ é <strong>ímpar</strong>: definimos inicialmente $\\textit{min} = A[1]$ e $\\textit{max} = A[1]$ (gastando <strong>0 comparações</strong> na inicialização) e restam $n - 1$ elementos (um número par) para processar aos pares.</li>
              <li>Se $n$ é <strong>par</strong>: executamos <strong>1 comparação inicial</strong> entre $A[1]$ e $A[2]$; o menor torna-se $\\textit{min}$ e o maior torna-se $\\textit{max}$, e restam $n - 2$ elementos (um número par) para processar aos pares.</li>
            </ul>
          </li>
          <li><strong>Laço sobre os pares restantes $(A[i], A[i+1])$:</strong> Para cada par de elementos da entrada:
            <ul>
              <li><strong>1ª Comparação:</strong> Comparamos $A[i]$ com $A[i+1]$ entre si para descobrir qual é o menor do par e qual é o maior do par.</li>
              <li><strong>2ª Comparação:</strong> Comparamos <em>apenas o menor do par</em> com o $\\textit{min}$ atual (já que o maior do par jamais poderia ser menor que $\\textit{min}$!).</li>
              <li><strong>3ª Comparação:</strong> Comparamos <em>apenas o maior do par</em> com o $\\textit{max}$ atual (já que o menor do par jamais poderia ser maior que $\\textit{max}$!).</li>
            </ul>
            Portanto, gastamos <strong>3 comparações para cada 2 elementos</strong>!</li>
        </ol>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ CONTAGEM EXATA • MÍNIMO E MÁXIMO SIMULTÂNEOS (p. 184) ]</span>
          <ul>
            <li><strong>Caso $n$ ímpar:</strong> $0$ (inicialização) $+ 3 \\cdot \\frac{n - 1}{2} = \\mathbf{3\\lfloor n/2 \\rfloor}$ comparações.</li>
            <li><strong>Caso $n$ par:</strong> $1$ (inicialização) $+ 3 \\cdot \\frac{n - 2}{2} = \\frac{3n}{2} - 2 = \\mathbf{3\\lfloor n/2 \\rfloor - 2}$ comparações.</li>
          </ul>
          <p>Em qualquer caso, o número total de comparações nunca excede $\\mathbf{3\\lfloor n/2 \\rfloor}$ (e, como mostra o Exercício 9.1-2, $\\lceil 3n/2 \\rceil - 2$ é de fato o limite inferior teórico exato para o problema!).</p>
        </div>
      `
    },

    /* ======================================================================
       UNIDADE 6.5 — CAPÍTULO 9, SEÇÃO 9.2 (pp. 185–189)
       ====================================================================== */
    {
      id: "u6-5",
      code: "UNIDADE 6.5 • CAP. 9 (SEÇÃO 9.2)",
      pages: "pp. 185–189",
      title: "9.2 Seleção em Tempo Esperado Linear (RANDOMIZED-SELECT)",
      content: `
        <p>O algoritmo <code>RANDOMIZED-SELECT</code> (inventado por C. A. R. Hoare, originalmente chamado <em>FIND</em> ou <em>Quickselect</em>) é modelado sobre o algoritmo <code>QUICKSORT</code> do Capítulo 7. Assim como no Quicksort, particionamos recursivamente o arranjo de entrada usando <code>RANDOMIZED-PARTITION(A, p, r)</code>. Contudo, há uma diferença decisiva:</p>
        <ul>
          <li>O <code>QUICKSORT</code> processa recursivamente <strong>ambos os lados</strong> da partição, levando ao tempo esperado $\\Theta(n \\lg n)$.</li>
          <li>O <code>RANDOMIZED-SELECT</code> descarta um dos lados e processa recursivamente <strong>apenas um lado</strong> da partição, reduzindo o tempo esperado de execução para $\\mathbf{\\Theta(n)}$!</li>
        </ul>

        <h3>1. Pseudocódigo e Funcionamento de <code>RANDOMIZED-SELECT</code> (pp. 185–186)</h3>
        <p>A chamada <code>RANDOMIZED-SELECT(A, p, r, i)</code> retorna o $i$-ésimo menor elemento do subarranjo $A[p \\dots r]$ (onde $1 \\le i \\le r - p + 1$):</p>

        <div class="pseudocode-block">
          <div class="pseudocode-header">
            <span class="pseudocode-title">RANDOMIZED-SELECT(A, p, r, i) — CLRS p. 185</span>
            <span class="bracket-tag">TEMPO ESPERADO Θ(n) • PIOR CASO Θ(n²)</span>
          </div>
          <pre><code>1  if p == r
2      return A[p]
3  q = RANDOMIZED-PARTITION(A, p, r)
4  k = q - p + 1
5  if i == k          // o valor do pivô é a resposta
6      return A[q]
7  elseif i < k
8      return RANDOMIZED-SELECT(A, p, q - 1, i)
9  else return RANDOMIZED-SELECT(A, q + 1, r, i - k)</code></pre>
        </div>

        <h4>Explicação Linha por Linha e Invariante de Índice Relativo ($i - k$):</h4>
        <ol>
          <li><strong>Caso-base (linhas 1–2):</strong> Se $p == r$, o subarranjo $A[p \\dots r]$ possui apenas 1 elemento (e obrigatoriamente $i = 1$), logo retornamos $A[p]$.</li>
          <li><strong>Particionamento Aleatorizado (linha 3):</strong> <code>RANDOMIZED-PARTITION(A, p, r)</code> escolhe um pivô aleatório uniformemente em $A[p \\dots r]$ e particiona o subarranjo em torno dele na posição final $q$, garantindo que todo elemento em $A[p \\dots q-1]$ é $\\le A[q]$ e todo elemento em $A[q+1 \\dots r]$ é $\\ge A[q]$.</li>
          <li><strong>Ordem Relativa do Pivô $k$ (linha 4):</strong> Calculamos $k = q - p + 1$, que é o número exato de elementos no subarranjo $A[p \\dots q]$ (os $q - p$ elementos do lado baixo mais o próprio pivô $A[q]$). Logo, $A[q]$ é o <strong>$k$-ésimo menor elemento de $A[p \\dots r]$</strong>!</li>
          <li><strong>Decisão Tripla (linhas 5–9):</strong>
            <ul>
              <li><strong>Se $i == k$ (linhas 5–6):</strong> O próprio pivô $A[q]$ é a $i$-ésima estatística de ordem procurada; retornamos $A[q]$ imediatamente!</li>
              <li><strong>Se $i < k$ (linhas 7–8):</strong> O elemento desejado está no subarranjo baixo $A[p \\dots q-1]$, e continua sendo o $i$-ésimo menor elemento dentro de $A[p \\dots q-1]$. Fazemos a chamada recursiva <code>RANDOMIZED-SELECT(A, p, q - 1, i)</code>.</li>
              <li><strong>Se $i > k$ (linha 9):</strong> O elemento desejado está no subarranjo alto $A[q+1 \\dots r]$. Como já descartamos os $k$ elementos de $A[p \\dots q]$ que sabemos serem todos menores que o elemento procurado, a ordem relativa procurada dentro de $A[q+1 \\dots r]$ passa a ser <strong>$i - k$</strong>! Fazemos a chamada recursiva <code>RANDOMIZED-SELECT(A, q + 1, r, i - k)</code>.</li>
            </ul>
          </li>
        </ol>
        <p><em>Nota (Exercício 9.2-1):</em> <code>RANDOMIZED-SELECT</code> <strong>jamais</strong> faz uma chamada recursiva sobre um subarranjo de comprimento $0$: na linha 8, como $i < k = q - p + 1$ e $i \\ge 1$, temos $q - p + 1 > 1 \\implies q - 1 \\ge p$; na linha 9, como $i > k = q - p + 1$ e $i \\le r - p + 1$, temos $q - p + 1 < r - p + 1 \\implies q + 1 \\le r$.</p>

        <h3>2. Pior Caso $\\Theta(n^2)$ vs. Caso Esperado $\\Theta(n)$ (pp. 186–188)</h3>
        <p><strong>Pior Caso $\\Theta(n^2)$:</strong> O tempo de execução do pior caso de <code>RANDOMIZED-SELECT</code> é $\\Theta(n^2)$, mesmo para buscar o mínimo ($i=1$), pois poderíamos ter o extremo azar de sortear em todas as etapas o maior elemento restante como pivô, reduzindo o subarranjo em apenas 1 elemento por chamada ($n + (n-1) + \\dots + 1 = \\Theta(n^2)$). Porém, como o algoritmo é aleatorizado, <strong>nenhuma entrada específica força o pior caso</strong>!</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ DEMONSTRAÇÃO FORMAL • TEMPO ESPERADO E[T(n)] = O(n) DE RANDOMIZED-SELECT (pp. 186–188) ]</span>
          <p>Seja $T(n)$ a variável aleatória para o tempo de execução sobre uma entrada de $n$ elementos distintos. Para $k = 1, 2, \\dots, n$, definimos a variável aleatória indicadora:</p>
          $$X_k = \\text{I}\\{\\text{o subarranjo } A[p \\dots q] \\text{ tem exatamente } k \\text{ elementos}\\}.$$
          <p>Como <code>RANDOMIZED-PARTITION</code> escolhe qualquer um dos $n$ elementos como pivô com igual probabilidade, temos $E[X_k] = \\Pr\\{X_k = 1\\} = \\frac{1}{n}$. Quando $X_k = 1$, os dois subarranjos candidatos à recursão têm tamanhos $k - 1$ (lado baixo) e $n - k$ (lado alto). Para obter um limite superior seguro (assumindo $T(n)$ monotonicamente crescente), supomos pessimistamente que a recursão cai sempre no <strong>maior dos dois lados</strong>, de tamanho $\\max(k - 1, n - k)$:</p>
          $$T(n) \\le \\sum_{k=1}^{n} X_k \\cdot T(\\max(k - 1, n - k)) + O(n).$$
          <p>Tomando a esperança em ambos os lados e usando a independência entre a escolha atual $X_k$ e as escolhas aleatórias futuras dentro de $T(\\max(k-1, n-k))$ (Exercício 9.2-2):</p>
          $$E[T(n)] \\le \\sum_{k=1}^{n} E[X_k] \\cdot E[T(\\max(k - 1, n - k))] + O(n) = \\frac{1}{n} \\sum_{k=1}^{n} E[T(\\max(k - 1, n - k))] + O(n).$$
          <p>Como $\\max(k - 1, n - k)$ vale $k - 1$ quando $k > \\lceil n/2 \\rceil$ e vale $n - k$ quando $k \\le \\lceil n/2 \\rceil$, cada termo $E[T(m)]$ para $m$ de $\\lfloor n/2 \\rfloor$ até $n - 1$ aparece no máximo <strong>duas vezes</strong> na soma:</p>
          $$E[T(n)] \\le \\frac{2}{n} \\sum_{k=\\lfloor n/2 \\rfloor}^{n-1} E[T(k)] + O(n).$$
          <hr style="border:none;border-top:1px dashed var(--border-color);margin:0.85rem 0;" />
          <p><strong>Prova por Substituição ($E[T(n)] \\le cn$):</strong><br/>
          Suponha por hipótese indutiva que $E[T(k)] \\le ck$ para todo $k < n$, e que o termo $O(n)$ seja limitado por $an$ ($a > 0$). Substituindo na recorrência:</p>
          $$E[T(n)] \\le \\frac{2}{n} \\sum_{k=\\lfloor n/2 \\rfloor}^{n-1} ck + an = \\frac{2c}{n}\\left(\\sum_{k=1}^{n-1} k - \\sum_{k=1}^{\\lfloor n/2 \\rfloor - 1} k\\right) + an$$
          $$E[T(n)] \\le \\frac{2c}{n}\\left(\\frac{(n - 1)n}{2} - \\frac{(\\lfloor n/2 \\rfloor - 1)\\lfloor n/2 \\rfloor}{2}\\right) + an.$$
          <p>Como $\\lfloor n/2 \\rfloor \\ge \\frac{n - 1}{2}$, temos $(\\lfloor n/2 \\rfloor - 1)\\lfloor n/2 \\rfloor \\ge \\frac{(n - 3)(n - 1)}{4}$, o que nos dá a cadeia algébrica exata da página 188:</p>
          $$E[T(n)] \\le \\frac{2c}{n}\\left(\\frac{(n - 1)n}{2} - \\frac{(n - 3)(n - 1)}{8}\\right) + an = \\frac{c(n - 1)}{n}\\left(n - \\frac{n - 3}{4}\\right) + an = \\frac{c(n - 1)(3n + 3)}{4n} + an$$
          $$E[T(n)] = \\frac{c}{4n}(3n^2 - 3) + an \\le \\frac{3}{4}cn + an = cn - \\left(\\frac{cn}{4} - \\frac{c}{2} - an\\right)$$
          <p>Para que o resíduo seja não negativo ($\\frac{cn}{4} - \\frac{c}{2} - an \\ge 0 \\iff n(\\frac{c}{4} - a) \\ge \\frac{c}{2}$), basta escolher qualquer constante $\\mathbf{c > 4a}$, o que torna a desigualdade válida para todo $n \\ge \\frac{2c}{c - 4a}$ (e os casos base finitos $n < \\frac{2c}{c - 4a}$ têm tempo $O(1)$, bastando aumentar $c$ se necessário). Portanto, $\\mathbf{E[T(n)] = O(n)}$! $\\blacksquare$</p>
        </div>
      `
    },

    /* ======================================================================
       UNIDADE 6.6 — CAPÍTULO 9, SEÇÃO 9.3 (pp. 189–195)
       ====================================================================== */
    {
      id: "u6-6",
      code: "UNIDADE 6.6 • CAP. 9 (SEÇÃO 9.3)",
      pages: "pp. 189–195",
      title: "9.3 Seleção em Tempo Linear no Pior Caso (SELECT — Mediana das Medianas)",
      content: `
        <p>Seria possível projetar um algoritmo de seleção determinístico que execute em tempo $\\mathbf{O(n)}$ <strong>no pior caso</strong>? Em 1973, Manuel Blum, Robert W. Floyd, Vaughan Pratt, Ronald L. Rivest e Robert Endre Tarjan responderam afirmativamente com o célebre algoritmo <code>SELECT</code> (conhecido como <strong>BFPRT</strong> ou <strong>Mediana das Medianas</strong>).</p>
        <p>Assim como <code>RANDOMIZED-SELECT</code>, o algoritmo <code>SELECT</code> encontra o elemento desejado particionando recursivamente o arranjo de entrada; porém, em vez de sortear o pivô ao acaso, ele <strong>garante deterministamente uma boa divisão</strong> escolhendo um pivô cuidadosamente calculado (a mediana das medianas dos grupos de 5) e passando esse pivô $x$ como parâmetro para uma versão modificada de <code>PARTITION</code>.</p>

        <h3>1. Os 5 Passos do Algoritmo Determinístico <code>SELECT</code> (pp. 189–190)</h3>
        <div class="canonical-callout theorem">
          <span class="callout-tag">[ ALGORITMO CANÔNICO • OS 5 PASSOS DE SELECT(A, p, r, i) (pp. 189–190) ]</span>
          <p>Para encontrar o $i$-ésimo menor elemento de um arranjo de $n > 1$ elementos distintos (se $n = 1$, retorna o único elemento):</p>
          <ol>
            <li><strong>Passo 1 (Divisão em Grupos de 5):</strong> Divida os $n$ elementos do arranjo de entrada em $\\lfloor n/5 \\rfloor$ grupos de $5$ elementos cada e, no máximo, um último grupo contendo os $n \\bmod 5$ elementos restantes, totalizando $\\mathbf{\\lceil n/5 \\rceil}$ grupos.</li>
            <li><strong>Passo 2 (Medianas Locais por Inserção):</strong> Encontre a mediana de cada um dos $\\lceil n/5 \\rceil$ grupos: primeiro ordene por inserção (<code>INSERTION-SORT</code>) os elementos dentro de cada grupo (de tamanho $\\le 5$, portanto tempo $O(1)$ por grupo e $O(n)$ no total) e escolha o elemento central (mediana inferior) de cada grupo ordenado.</li>
            <li><strong>Passo 3 (Mediana das Medianas $x$ — 1ª Chamada Recursiva):</strong> Use <code>SELECT</code> recursivamente para encontrar a mediana (inferior) $\\mathbf{x}$ das $\\lceil n/5 \\rceil$ medianas encontradas no Passo 2.</li>
            <li><strong>Passo 4 (Particionamento em Torno de $x$):</strong> Particione o arranjo de entrada inteiro em torno da mediana das medianas $x$ usando a versão modificada de <code>PARTITION</code>. Seja $k$ um a mais que o número de elementos no lado baixo da partição, de modo que $x$ é o $k$-ésimo menor elemento e há $n - k$ elementos no lado alto.</li>
            <li><strong>Passo 5 (Poda e 2ª Chamada Recursiva):</strong> Se $i == k$, retorne $x$. Caso contrário, use <code>SELECT</code> recursivamente para encontrar o $i$-ésimo menor elemento no lado baixo se $i < k$, ou o $(i - k)$-ésimo menor elemento no lado alto se $i > k$.</li>
          </ol>
        </div>

        <h3>2. Análise Geométrica da Grade (Figura 9.1): Por que Pelo Menos $\\frac{3n}{10} - 6$ Elementos são Maiores (e Menores) que $x$? (pp. 189–190)</h3>
        <p>Visualize os $\\lceil n/5 \\rceil$ grupos dispostos como colunas verticais de 5 elementos ordenados de cima para baixo, e as colunas ordenadas da esquerda para a direita pelas suas medianas (círculos centrais), tendo $x$ como a mediana central (Figura 9.1):</p>

        <div class="pseudocode-block">
          <div class="pseudocode-header">
            <span class="pseudocode-title">FIGURA 9.1 — GRADE DE GRUPOS DE 5 E ELEMENTOS GARANTIDAMENTE MAIORES QUE x</span>
            <span class="bracket-tag">PELO MENOS 3n/10 - 6 MAIORES E 3n/10 - 6 MENORES</span>
          </div>
          <pre><code>          Grupos com mediana < x       Coluna de x     Grupos com mediana > x (Sombreados)
          (pelo menos ⌈(1/2)⌈n/5⌉⌉-1)                  (pelo menos ⌈(1/2)⌈n/5⌉⌉ grupos)
        ┌───────────────────────────┐   ┌───────┐   ┌───────────────────────────────────┐
        │   (○)       (○)       (○) │   │  (○)  │   │  (○)         (○)         (○)      │  ← menores no grupo
        │    ↑         ↑         ↑  │   │   ↑   │   │   ↑           ↑           ↑       │
        │   (○)       (○)       (○) │   │  (○)  │   │  (○)         (○)         (○)      │
        │    ↑         ↑         ↑  │   │   ↑   │   │   ↑           ↑           ↑       │
Mediana │   [M₁]  →   [M₂]  →   [M₃]│ → │  [x]  │ → │  [M₅]   →    [M₆]   →    [M₇]  >x │  ← 3 elementos
do grupo│    ↑         ↑         ↑  │   │   ↑   │   │   ↑           ↑           ↑       │    por grupo completo
        │   (●)       (●)       (●) │   │  (●)  │   │  (●)>x       (●)>x       (●)>x    │    são > x!
        │    ↑         ↑         ↑  │   │   ↑   │   │   ↑           ↑           ↑       │
        │   (●)       (●)       (●) │   │  (●)  │   │  (●)>x       (●)>x       (●)>x    │  ← maiores no grupo
        └───────────────────────────┘   └───────┘   └───────────────────────────────────┘</code></pre>
        </div>

        <ol>
          <li>Pela definição de mediana, pelo menos metade das $\\lceil n/5 \\rceil$ medianas dos grupos — isto é, pelo menos $\\left\\lceil \\frac{1}{2}\\lceil n/5 \\rceil \\right\\rceil$ medianas — são <strong>maiores ou iguais a $x$</strong>.</li>
          <li>Cada um desses $\\left\\lceil \\frac{1}{2}\\lceil n/5 \\rceil \\right\\rceil$ grupos contribui com pelo menos <strong>$3$ elementos estritamente maiores que $x$</strong> (a própria mediana do grupo e os 2 elementos abaixo dela na coluna), <strong>com duas únicas exceções</strong>:
            <ul>
              <li><strong>Exceção 1:</strong> O próprio grupo que contém $x$ (pois $x$ não é estritamente maior que $x$, contribuindo com apenas 2 elementos maiores);</li>
              <li><strong>Exceção 2:</strong> O único grupo incompleto (com $n \\bmod 5 < 5$ elementos), caso $5$ não divida $n$ exatamente.</li>
            </ul>
          </li>
          <li>Descontando esses <strong>2 grupos</strong>, o número de elementos <strong>estritamente maiores que $x$</strong> é, no mínimo:
            $$3\\left(\\left\\lceil \\frac{1}{2}\\left\\lceil \\frac{n}{5} \\right\\rceil \\right\\rceil - 2\\right) \\ge \\frac{3n}{10} - 6.$$</li>
          <li>Por um argumento perfeitamente simétrico (olhando para o canto superior esquerdo da grade), o número de elementos <strong>estritamente menores que $x$</strong> também é no mínimo $\\mathbf{\\frac{3n}{10} - 6}$.</li>
          <li><strong>Consequência para o Passo 5 (Pior Caso da Partição):</strong> Como pelo menos $\\frac{3n}{10} - 6$ elementos são descartados (quer vamos para o lado baixo, quer vamos para o lado alto), a chamada recursiva do Passo 5 é feita sobre, <strong>no máximo</strong>:
            $$n - \\left(\\frac{3n}{10} - 6\\right) = \\mathbf{\\frac{7n}{10} + 6 \\text{ elementos!}}$$</li>
        </ol>

        <h3>3. Resolução da Recorrência de <code>SELECT</code> por Substituição (pp. 190–191)</h3>
        <p>Somando os custos dos 5 passos (Passos 1, 2 e 4 custam $O(n)$, Passo 3 custa $T(\\lceil n/5 \\rceil)$ e Passo 5 custa no máximo $T(7n/10 + 6)$), obtemos a recorrência do pior caso de <code>SELECT</code>:</p>
        $$T(n) \\le \\begin{cases} O(1) & \\text{se } n < 140, \\\\ T(\\lceil n/5 \\rceil) + T(7n/10 + 6) + O(n) & \\text{se } n \\ge 140. \\end{cases}$$

        <div class="canonical-callout invariant">
          <span class="callout-tag">[ PROVA POR SUBSTITUIÇÃO • T(n) ≤ cn E A ORIGEM DA CONSTANTE 140 (pp. 190–191) ]</span>
          <p>Queremos provar por indução que $T(n) \\le cn$ para alguma constante $c > 0$ adequadamente grande, sendo o termo $O(n)$ limitado superiormente por $an$ ($a > 0$). Substituindo a hipótese indutiva $T(k) \\le ck$ e usando $\\lceil n/5 \\rceil < n/5 + 1$:</p>
          $$T(n) \\le c\\lceil n/5 \\rceil + c(7n/10 + 6) + an \\le \\frac{cn}{5} + c + \\frac{7cn}{10} + 6c + an$$
          $$T(n) \\le \\frac{9cn}{10} + 7c + an = cn + \\left(-\\frac{cn}{10} + 7c + an\\right).$$
          <p>Para que $T(n) \\le cn$, precisamos que o termo entre parênteses seja $\\le 0$ (Equação 9.2):</p>
          $$-\\frac{cn}{10} + 7c + an \\le 0 \\iff c\\left(\\frac{n - 70}{10}\\right) \\ge an \\iff c \\ge 10a\\left(\\frac{n}{n - 70}\\right) \\quad (\\text{para } n > 70).$$
          <p><strong>Por que os autores escolheram o limiar $n \\ge 140$?</strong> Porque para $n \\ge 140$ (o dobro de $70$), a fração $\\frac{n}{n - 70}$ é limitada superiormente por $\\frac{140}{140 - 70} = 2$! Assim, basta escolher $\\mathbf{c \\ge 20a}$ para satisfazer a desigualdade indutiva para todo $n \\ge 140$ (e depois aumentar $c$, se necessário, para cobrir o número finito de casos base $n < 140$). Note que não há nada de mágico em $140$: qualquer inteiro estritamente maior que $70$ (como $71$) funcionaria ajustando $c$ proporcionalmente!</p>
        </div>

        <p><strong>Por que o Tamanho do Grupo $g = 5$ Funciona, $g = 7$ Funciona, mas $g = 3$ Falha? (Exercício 9.3-1):</strong></p>
        <ul>
          <li>Com <strong>grupos de 5</strong>: os subproblemas têm frações $\\frac{1}{5} + \\frac{7}{10} = \\mathbf{\\frac{9}{10} < 1} \\implies T(n) = \\Theta(n)$.</li>
          <li>Com <strong>grupos de 7</strong>: pelo menos $4$ elementos de metade dos $\\lceil n/7 \\rceil$ grupos são maiores que $x$ ($\\ge \\frac{4n}{14} - 8 = \\frac{2n}{7} - 8$), deixando no máximo $\\frac{5n}{7} + 8$ elementos no Passo 5. A soma das frações é $\\frac{1}{7} + \\frac{5}{7} = \\mathbf{\\frac{6}{7} < 1} \\implies T(n) = \\Theta(n)$!</li>
          <li>Com <strong>grupos de 3</strong>: apenas $2$ elementos de metade dos $\\lceil n/3 \\rceil$ grupos são maiores que $x$ ($\\ge \\frac{2n}{6} - 4 = \\frac{n}{3} - 4$), deixando até $\\frac{2n}{3} + 4$ elementos no Passo 5. A soma das frações na recorrência $T(n) = T(n/3) + T(2n/3) + O(n)$ é $\\frac{1}{3} + \\frac{2}{3} = \\mathbf{1}$, o que gera uma árvore de recursão com custo $\\Theta(n)$ por nível e resulta em $\\mathbf{\\Theta(n \\lg n)}$, falhando em atingir tempo linear!</li>
        </ul>
      `
    }
  ];

  /* ========================================================================
     BANCADAS INTERATIVAS DO MÓDULO 06 (initWorkbenches)
     ======================================================================== */
  function initWorkbenches() {
    const mount = document.getElementById("workbench-mod6-mount");
    if (!mount) return;

    mount.innerHTML = `
      <div class="workbench-box" style="margin-top:1.75rem;">
        <div class="workbench-header">
          <span class="workbench-title">[ BANCADA INTERATIVA #06 • SIMULADOR DE COUNTING-SORT ESTÁVEL & PODA DE RANDOMIZED-SELECT ]</span>
          <span class="bracket-tag dark">CAP. 8 + CAP. 9</span>
        </div>
        <div class="workbench-body">
          <p style="font-size:0.9rem;color:var(--ink-secondary);margin-bottom:1rem;">
            <strong>Parte A — Rastreamento Passo a Passo de <code>COUNTING-SORT(A, B, k)</code> com Rótulos de Estabilidade:</strong> Escolha um arranjo de entrada (como a Figura 8.2 ou o Exercício 8.2-1) e avance pelas fases ou iteração por iteração do laço regressivo (<code>j = n downto 1</code>) para inspecionar $A[1..n]$, $C[0..k]$ e $B[1..n]$:
          </p>

          <div class="workbench-controls" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0.85rem;margin-bottom:1rem;">
            <div>
              <label style="display:block;font-family:var(--font-mono);font-size:0.75rem;font-weight:700;margin-bottom:0.3rem;">ARRANJO DE ENTRADA A[1..n]:</label>
              <select id="mod6-cs-preset" class="search-input-brutal" style="width:100%;" onchange="window.resetMod6CountingSort()">
                <option value="fig82" selected>Figura 8.2 (p. 171): 〈2, 5, 3, 0, 2, 3, 0, 3〉 (k = 5)</option>
                <option value="ex821">Exercício 8.2-1 (p. 172): 〈6, 0, 2, 0, 1, 3, 4, 6, 1, 3, 2〉 (k = 6)</option>
                <option value="dup">Teste de Estabilidade Intensa: 〈3, 1, 3, 0, 1, 3, 2, 0〉 (k = 3)</option>
              </select>
            </div>
            <div>
              <label style="display:block;font-family:var(--font-mono);font-size:0.75rem;font-weight:700;margin-bottom:0.3rem;">DIREÇÃO DO LAÇO DA LINHA 10:</label>
              <select id="mod6-cs-dir" class="search-input-brutal" style="width:100%;" onchange="window.resetMod6CountingSort()">
                <option value="downto" selected>Canônico: for j = n downto 1 (ESTÁVEL)</option>
                <option value="to">Exercício 8.2-3: for j = 1 to n (INSTÁVEL!)</option>
              </select>
            </div>
            <div style="display:flex;align-items:flex-end;gap:0.5rem;flex-wrap:wrap;">
              <button class="btn-secondary-brutal" type="button" onclick="window.stepMod6CountingSort(-1)">[ ◀ PASSO ANTERIOR ]</button>
              <button class="btn-primary-brutal" type="button" onclick="window.stepMod6CountingSort(1)">[ PRÓXIMO PASSO ▶ ]</button>
              <button class="btn-secondary-brutal" type="button" onclick="window.resetMod6CountingSort()">[ REINICIAR ]</button>
            </div>
          </div>

          <div id="mod6-cs-telemetry" class="workbench-telemetry-strip" style="margin-bottom:1rem;"></div>
          <div id="mod6-cs-arrays" style="overflow-x:auto;margin-bottom:1.75rem;"></div>

          <hr style="border:none;border-top:2px solid var(--border-color);margin:1.5rem 0;" />

          <p style="font-size:0.9rem;color:var(--ink-secondary);margin-bottom:0.85rem;">
            <strong>Parte B — Simulador de Seleção <code>RANDOMIZED-SELECT(A, p, r, i)</code> e Comparativo de Limites:</strong> Selecione a estatística de ordem desejada $i$ ($1 \\le i \\le n$) e a estratégia de escolha de pivô para observar como a poda unilateral encontra o $i$-ésimo menor elemento sem ordenar o restante do arranjo:
          </p>
          <div class="workbench-controls" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.85rem;margin-bottom:1rem;">
            <div>
              <label style="display:block;font-family:var(--font-mono);font-size:0.75rem;font-weight:700;margin-bottom:0.3rem;">CONJUNTO DE ENTRADA (n = 10, Ex. 9.2-4):</label>
              <select id="mod6-sel-preset" class="search-input-brutal" style="width:100%;" onchange="window.runMod6SelectSim()">
                <option value="ex924" selected>Ex. 9.2-4: 〈3, 2, 9, 0, 7, 5, 4, 8, 6, 1〉</option>
                <option value="clrs">Arranjo CLRS: 〈13, 19, 9, 5, 12, 8, 7, 4, 21, 2〉</option>
              </select>
            </div>
            <div>
              <label style="display:block;font-family:var(--font-mono);font-size:0.75rem;font-weight:700;margin-bottom:0.3rem;">
                ESTATÍSTICA DE ORDEM i: <span id="mod6-sel-i-lbl">i = 5 (Mediana Inferior)</span>
              </label>
              <input id="mod6-sel-i" type="range" min="1" max="10" step="1" value="5" style="width:100%;" oninput="window.runMod6SelectSim()" />
            </div>
            <div>
              <label style="display:block;font-family:var(--font-mono);font-size:0.75rem;font-weight:700;margin-bottom:0.3rem;">ESTRATÉGIA DE PIVÔ:</label>
              <select id="mod6-sel-mode" class="search-input-brutal" style="width:100%;" onchange="window.runMod6SelectSim()">
                <option value="balanced" selected>Pivô Mediano/Equilibrado — O(n)</option>
                <option value="last">Pivô de Lomuto Padrão (A[r])</option>
                <option value="worst">Adversário de Pior Caso (Ex. 9.2-4) — Θ(n²)</option>
              </select>
            </div>
          </div>
          <div id="mod6-sel-output" style="overflow-x:auto;"></div>
        </div>
      </div>
    `;

    const csState = {
      step: 0,
      maxSteps: 0,
      snapshots: []
    };

    function buildCountingSortSnapshots(rawArr, k, direction) {
      const countsPerVal = {};
      const letters = ["a", "b", "c", "d", "e", "f"];
      const labeledA = rawArr.map((val, idx) => {
        const c = countsPerVal[val] || 0;
        countsPerVal[val] = c + 1;
        return { val, idx: idx + 1, sub: letters[c] || String(c + 1) };
      });
      const totalFreq = {};
      labeledA.forEach((item) => {
        totalFreq[item.val] = (totalFreq[item.val] || 0) + 1;
      });
      labeledA.forEach((item) => {
        if (totalFreq[item.val] === 1) item.sub = "";
      });

      const n = labeledA.length;
      const snaps = [];

      // Snapshot 0: Initial state after lines 2-3
      const C0 = new Array(k + 1).fill(0);
      const B0 = new Array(n).fill(null);
      snaps.push({
        phase: "FASE 1 (Linhas 2–3): Inicialização de C[0..k] = 0",
        desc: `O arranjo auxiliar C[0..${k}] foi inicializado com zeros. Nenhuma comparação entre elementos de A será feita.`,
        activeJ: null,
        placedPos: null,
        C: C0.slice(),
        B: B0.slice(),
        A: labeledA
      });

      // Snapshot 1: Histogram after lines 4-5
      const C1 = C0.slice();
      for (let j = 0; j < n; j++) {
        C1[labeledA[j].val]++;
      }
      snaps.push({
        phase: "FASE 2 (Linhas 4–5): Histograma de Frequências C[i]",
        desc: `Após varrer A[1..${n}] em Θ(n), cada C[i] armazena exatamente quantos elementos de A são iguais a i (Figura 8.2a).`,
        activeJ: null,
        placedPos: null,
        C: C1.slice(),
        B: B0.slice(),
        A: labeledA
      });

      // Snapshot 2: Prefix sums after lines 7-8
      const C2 = C1.slice();
      for (let i = 1; i <= k; i++) {
        C2[i] += C2[i - 1];
      }
      snaps.push({
        phase: "FASE 3 (Linhas 7–8): Somas de Prefixos Acumuladas C[i]",
        desc: `Após acumular C[i] = C[i] + C[i-1] em Θ(k), cada C[i] indica quantos elementos são ≤ i (a última posição que o valor i ocupará em B, Figura 8.2b).`,
        activeJ: null,
        placedPos: null,
        C: C2.slice(),
        B: B0.slice(),
        A: labeledA
      });

      // Snapshots 3..3+n-1: Loop lines 10-12
      const curC = C2.slice();
      const curB = B0.slice();
      const order = [];
      if (direction === "downto") {
        for (let j = n; j >= 1; j--) order.push(j);
      } else {
        for (let j = 1; j <= n; j++) order.push(j);
      }

      order.forEach((j, stepIdx) => {
        const item = labeledA[j - 1];
        const targetPos = curC[item.val];
        curB[targetPos - 1] = item;
        curC[item.val] = targetPos - 1;
        snaps.push({
          phase: `FASE 4 (Linhas 10–12) • Iteração ${stepIdx + 1}/${n} (j = ${j})`,
          desc: `Lemos A[${j}] = ${item.val}${item.sub ? "_" + item.sub : ""}. Como C[${item.val}] valia ${targetPos}, gravamos B[${targetPos}] = ${item.val}${item.sub ? "_" + item.sub : ""} e decrementamos C[${item.val}] para ${targetPos - 1}.`,
          activeJ: j,
          placedPos: targetPos,
          C: curC.slice(),
          B: curB.slice(),
          A: labeledA
        });
      });

      return snaps;
    }

    window.renderMod6CountingSort = function () {
      const telem = document.getElementById("mod6-cs-telemetry");
      const container = document.getElementById("mod6-cs-arrays");
      const dirSel = document.getElementById("mod6-cs-dir");
      if (!telem || !container || !csState.snapshots.length) return;

      const snap = csState.snapshots[csState.step];
      const isDownto = !dirSel || dirSel.value === "downto";

      telem.innerHTML = `
        <div class="telemetry-card">
          <span class="telemetry-label">ESTÁGIO ATUAL (${csState.step + 1}/${csState.maxSteps})</span>
          <span class="telemetry-val">${snap.phase}</span>
        </div>
        <div class="telemetry-card">
          <span class="telemetry-label">PROPRIEDADE DE ESTABILIDADE</span>
          <span class="telemetry-val" style="color:${isDownto ? "var(--emerald)" : "var(--crimson)"};">
            ${isDownto ? "✓ ESTÁVEL (a precede b precede c)" : "✗ INSTÁVEL (ordem de duplicatas invertida!)"}
          </span>
        </div>
        <div class="telemetry-card">
          <span class="telemetry-label">OPERAÇÃO EXECUTADA</span>
          <span class="telemetry-val">${snap.desc}</span>
        </div>
      `;

      let aHeaders = "";
      let aCells = "";
      snap.A.forEach((item) => {
        const isCurrent = snap.activeJ === item.idx;
        aHeaders += `<th style="text-align:center;">j = ${item.idx}</th>`;
        aCells += `
          <td style="text-align:center;font-family:var(--font-mono);font-weight:700;${
            isCurrent ? "background:rgba(245,158,11,0.25);border:2px solid var(--amber);" : ""
          }">
            ${item.val}${item.sub ? `<sub>${item.sub}</sub>` : ""}
          </td>
        `;
      });

      let cHeaders = "";
      let cCells = "";
      snap.C.forEach((val, idx) => {
        const isHighlighted = snap.activeJ !== null && snap.A[snap.activeJ - 1].val === idx;
        cHeaders += `<th style="text-align:center;">i = ${idx}</th>`;
        cCells += `
          <td style="text-align:center;font-family:var(--font-mono);font-weight:700;${
            isHighlighted ? "background:rgba(59,130,246,0.22);border:2px solid var(--cobalt);" : ""
          }">
            ${val}
          </td>
        `;
      });

      let bHeaders = "";
      let bCells = "";
      snap.B.forEach((item, idx) => {
        const pos = idx + 1;
        const isJustPlaced = snap.placedPos === pos;
        bHeaders += `<th style="text-align:center;">pos = ${pos}</th>`;
        bCells += `
          <td style="text-align:center;font-family:var(--font-mono);font-weight:700;${
            isJustPlaced
              ? "background:rgba(16,185,129,0.25);border:2px solid var(--emerald);"
              : item
              ? "background:rgba(16,185,129,0.08);"
              : "color:var(--ink-muted);"
          }">
            ${item ? `${item.val}${item.sub ? `<sub>${item.sub}</sub>` : ""}` : "—"}
          </td>
        `;
      });

      container.innerHTML = `
        <div style="display:grid;gap:0.85rem;">
          <div>
            <div style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;margin-bottom:0.25rem;">
              ARRANJO DE ENTRADA A[1..${snap.A.length}]:
            </div>
            <table class="clrs-cost-table">
              <thead><tr>${aHeaders}</tr></thead>
              <tbody><tr>${aCells}</tr></tbody>
            </table>
          </div>
          <div>
            <div style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;margin-bottom:0.25rem;">
              ARRANJO AUXILIAR C[0..${snap.C.length - 1}] (Frequências / Prefixos Acumulados):
            </div>
            <table class="clrs-cost-table">
              <thead><tr>${cHeaders}</tr></thead>
              <tbody><tr>${cCells}</tr></tbody>
            </table>
          </div>
          <div>
            <div style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;margin-bottom:0.25rem;">
              ARRANJO DE SAÍDA ORDENADO B[1..${snap.B.length}]:
            </div>
            <table class="clrs-cost-table">
              <thead><tr>${bHeaders}</tr></thead>
              <tbody><tr>${bCells}</tr></tbody>
            </table>
          </div>
        </div>
      `;
    };

    window.resetMod6CountingSort = function () {
      const presetSel = document.getElementById("mod6-cs-preset");
      const dirSel = document.getElementById("mod6-cs-dir");
      const preset = presetSel ? presetSel.value : "fig82";
      const dir = dirSel ? dirSel.value : "downto";

      let raw = [2, 5, 3, 0, 2, 3, 0, 3];
      let k = 5;
      if (preset === "ex821") {
        raw = [6, 0, 2, 0, 1, 3, 4, 6, 1, 3, 2];
        k = 6;
      } else if (preset === "dup") {
        raw = [3, 1, 3, 0, 1, 3, 2, 0];
        k = 3;
      }

      csState.snapshots = buildCountingSortSnapshots(raw, k, dir);
      csState.maxSteps = csState.snapshots.length;
      csState.step = 2; // Start right at the prefix sum ready to step through placement
      window.renderMod6CountingSort();
    };

    window.stepMod6CountingSort = function (delta) {
      const next = csState.step + delta;
      if (next >= 0 && next < csState.maxSteps) {
        csState.step = next;
        window.renderMod6CountingSort();
      }
    };

    window.runMod6SelectSim = function () {
      const presetSel = document.getElementById("mod6-sel-preset");
      const iRange = document.getElementById("mod6-sel-i");
      const iLbl = document.getElementById("mod6-sel-i-lbl");
      const modeSel = document.getElementById("mod6-sel-mode");
      const out = document.getElementById("mod6-sel-output");
      if (!presetSel || !iRange || !modeSel || !out) return;

      const baseArr =
        presetSel.value === "ex924"
          ? [3, 2, 9, 0, 7, 5, 4, 8, 6, 1]
          : [13, 19, 9, 5, 12, 8, 7, 4, 21, 2];
      const targetI = parseInt(iRange.value, 10);
      const mode = modeSel.value;

      let specialTag = "";
      if (targetI === 1) specialTag = " (Mínimo)";
      else if (targetI === 5) specialTag = " (Mediana Inferior ⌊(n+1)/2⌋)";
      else if (targetI === 6) specialTag = " (Mediana Superior ⌈(n+1)/2⌉)";
      else if (targetI === 10) specialTag = " (Máximo)";
      if (iLbl) iLbl.textContent = `i = ${targetI}${specialTag}`;

      const A = baseArr.slice();
      let p = 0;
      let r = A.length - 1;
      let curI = targetI;
      let totalComparisons = 0;
      const traceRows = [];
      let callCount = 0;

      while (p <= r) {
        callCount++;
        if (p === r) {
          traceRows.push({
            call: callCount,
            range: `A[${p + 1}..${r + 1}] (tam. 1)`,
            iRel: curI,
            pivotVal: A[p],
            qIdx: p + 1,
            kRel: 1,
            comps: 0,
            decision: `Caso-base p == r → Retorna A[${p + 1}] = ${A[p]}`,
            snapshot: A.slice(),
            p,
            r,
            q: p
          });
          break;
        }

        // Choose pivot index according to selected strategy
        let pivotIdx = r;
        if (mode === "balanced") {
          const sub = A.slice(p, r + 1).map((v, idx) => ({ v, idx: p + idx }));
          sub.sort((a, b) => a.v - b.v);
          pivotIdx = sub[Math.floor((sub.length - 1) / 2)].idx;
        } else if (mode === "worst") {
          const sub = A.slice(p, r + 1).map((v, idx) => ({ v, idx: p + idx }));
          sub.sort((a, b) => a.v - b.v);
          // Pick extreme opposite to where target resides to force worst case
          const targetVal = sub[curI - 1].v;
          pivotIdx = sub[sub.length - 1].v !== targetVal ? sub[sub.length - 1].idx : sub[0].idx;
        }

        // Swap chosen pivot to A[r] and run Lomuto PARTITION
        const tmpPiv = A[pivotIdx];
        A[pivotIdx] = A[r];
        A[r] = tmpPiv;

        const pivotVal = A[r];
        let iLom = p - 1;
        let compsThisCall = 0;
        for (let j = p; j < r; j++) {
          compsThisCall++;
          if (A[j] <= pivotVal) {
            iLom++;
            const t = A[iLom];
            A[iLom] = A[j];
            A[j] = t;
          }
        }
        const q = iLom + 1;
        const t2 = A[q];
        A[q] = A[r];
        A[r] = t2;

        totalComparisons += compsThisCall;
        const kRel = q - p + 1;
        let decision = "";
        const curP = p;
        const curR = r;
        const curISaved = curI;

        if (curI === kRel) {
          decision = `i == k (${curI} == ${kRel}) → ENCONTRADO! Retorna pivô A[${q + 1}] = ${pivotVal}`;
          traceRows.push({
            call: callCount,
            range: `A[${curP + 1}..${curR + 1}] (tam. ${curR - curP + 1})`,
            iRel: curISaved,
            pivotVal,
            qIdx: q + 1,
            kRel,
            comps: compsThisCall,
            decision,
            snapshot: A.slice(),
            p: curP,
            r: curR,
            q
          });
          break;
        } else if (curI < kRel) {
          decision = `i < k (${curI} < ${kRel}) → Poda direita; recursiona em A[${curP + 1}..${q}] buscando i = ${curI}`;
          r = q - 1;
        } else {
          decision = `i > k (${curI} > ${kRel}) → Poda esquerda; recursiona em A[${q + 2}..${curR + 1}] buscando i - k = ${curI - kRel}`;
          p = q + 1;
          curI = curI - kRel;
        }

        traceRows.push({
          call: callCount,
          range: `A[${curP + 1}..${curR + 1}] (tam. ${curR - curP + 1})`,
          iRel: curISaved,
          pivotVal,
          qIdx: q + 1,
          kRel,
          comps: compsThisCall,
          decision,
          snapshot: A.slice(),
          p: curP,
          r: curR,
          q
        });
      }

      const sortedCopy = baseArr.slice().sort((a, b) => a - b);
      const foundValue = sortedCopy[targetI - 1];

      let rowsHtml = "";
      traceRows.forEach((tr) => {
        const arrFormatted = tr.snapshot
          .map((v, idx) => {
            if (idx === tr.q) return `<strong style="color:var(--emerald);">[${v}]</strong>`;
            if (idx >= tr.p && idx <= tr.r) return `<span>${v}</span>`;
            return `<span style="opacity:0.35;text-decoration:line-through;">${v}</span>`;
          })
          .join(", ");

        rowsHtml += `
          <tr>
            <td style="font-family:var(--font-mono);font-weight:700;">#${tr.call}</td>
            <td style="font-family:var(--font-mono);">${tr.range}</td>
            <td style="font-family:var(--font-mono);font-weight:700;">i = ${tr.iRel}</td>
            <td style="font-family:var(--font-mono);">x = ${tr.pivotVal} (q=${tr.qIdx}, k=${tr.kRel})</td>
            <td style="font-family:var(--font-mono);">${tr.comps}</td>
            <td style="font-family:var(--font-mono);font-size:0.8rem;">〈${arrFormatted}〉</td>
            <td style="font-size:0.82rem;">${tr.decision}</td>
          </tr>
        `;
      });

      out.innerHTML = `
        <div class="workbench-telemetry-strip" style="margin-bottom:0.85rem;">
          <div class="telemetry-card">
            <span class="telemetry-label">${targetI}ª ESTATÍSTICA DE ORDEM ENCONTRADA</span>
            <span class="telemetry-val" style="color:var(--emerald);">Valor = ${foundValue}</span>
          </div>
          <div class="telemetry-card">
            <span class="telemetry-label">CHAMADAS RECURSIVAS / PARTIÇÕES</span>
            <span class="telemetry-val">${traceRows.length} chamadas</span>
          </div>
          <div class="telemetry-card">
            <span class="telemetry-label">TOTAL DE COMPARAÇÕES EXECUTADAS</span>
            <span class="telemetry-val">${totalComparisons} comparações (vs. n(n-1)/2 = 45 no pior caso)</span>
          </div>
        </div>
        <table class="clrs-cost-table">
          <thead>
            <tr>
              <th>Nível</th>
              <th>Subarranjo Ativo A[p..r]</th>
              <th>Ordem Buscada</th>
              <th>Pivô & Posição Relativa k</th>
              <th>Comp.</th>
              <th>Estado do Arranjo (Elementos Podados Riscados)</th>
              <th>Decisão de RANDOMIZED-SELECT</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      `;
    };

    window.resetMod6CountingSort();
    window.runMod6SelectSim();
  }

  /* ========================================================================
     SEÇÃO 3: QUIZZES COMENTADOS (10 QUESTÕES — CAPÍTULOS 8 E 9)
     ======================================================================== */
  const quizzes = [
    {
      id: "q6-1",
      type: "Múltipla Escolha",
      reference: "Cap. 8, Seção 8.1 (pp. 166–169) — Árvores de Decisão, Teorema 8.1 e Corolário 8.2",
      question:
        "No modelo de árvore de decisão para ordenação por comparação de n elementos distintos (Seção 8.1), qual relação matemática entre a altura h da árvore, o número l de folhas alcançáveis e o número de permutações possíveis fundamenta o Teorema 8.1, e qual é a conclusão imediata do Corolário 8.2?",
      options: [
        {
          letter: "A",
          text: "Como existem 2^n permutações possíveis de n elementos e uma árvore binária de altura h possui no máximo h² folhas, temos h² ≥ 2^n, implicando h = Ω(2^(n/2)).",
          isCorrect: false,
          explanation:
            "Incorreta. O número de permutações de n elementos distintos é n! (e não 2^n), e o número máximo de folhas em uma árvore binária de altura h é 2^h (e não h²)."
        },
        {
          letter: "B",
          text: "Cada uma das n! permutações deve aparecer como uma folha alcançável (logo n! ≤ l) e uma árvore binária de altura h tem no máximo 2^h folhas (logo l ≤ 2^h); combinando ambos e usando Stirling, 2^h ≥ l ≥ n! ⇒ h ≥ lg(n!) = Ω(n lg n), o que prova pelo Corolário 8.2 que Heapsort e Merge Sort são algoritmos de ordenação por comparação assintoticamente ótimos.",
          isCorrect: true,
          explanation:
            "Correta! Esta é a demonstração exata do Teorema 8.1 e do Corolário 8.2 nas páginas 168–169: o pior caso de comparações é a altura h da árvore de decisão, que satisfaz 2^h ≥ l ≥ n! ⇒ h ≥ lg(n!) = Ω(n lg n)."
        },
        {
          letter: "C",
          text: "O Teorema 8.1 prova que absolutamente nenhum algoritmo computacional (nem mesmo Counting-Sort ou Radix-Sort) pode ordenar n inteiros em tempo inferior a Ω(n lg n).",
          isCorrect: false,
          explanation:
            "Incorreta! O limite inferior Ω(n lg n) do Teorema 8.1 aplica-se exclusivamente a algoritmos de ordenação baseados em comparações. Algoritmos como Counting-Sort, Radix-Sort e Bucket-Sort não se restringem a comparações par a par e alcançam tempo Θ(n)."
        },
        {
          letter: "D",
          text: "O Corolário 8.2 afirma que o Quicksort determinístico é assintoticamente ótimo no pior caso, pois sua altura máxima na árvore de decisão é Θ(n lg n).",
          isCorrect: false,
          explanation:
            "Incorreta. O pior caso do Quicksort é Θ(n²); o Corolário 8.2 cita especificamente a ordenação por heap (Heapsort) e a ordenação por intercalação (Merge Sort), cujos limites superiores de pior caso são O(n lg n)."
        }
      ]
    },
    {
      id: "q6-2",
      type: "Múltipla Escolha",
      reference: "Cap. 8, Seção 8.2 (pp. 170–172) e Exercício 8.2-3",
      question:
        "Considere o algoritmo COUNTING-SORT(A, B, k) aplicado a um arranjo A[1..n] de inteiros em {0, 1, ..., k}. O que armazena o elemento C[i] imediatamente após o laço das linhas 7–8, qual é a complexidade total de tempo do algoritmo, e o que aconteceria se alterássemos o cabeçalho do laço da linha 10 de 'for j = A.comprimento downto 1' para 'for j = 1 to A.comprimento'?",
      options: [
        {
          letter: "A",
          text: "Após a linha 8, C[i] armazena o número de elementos de A menores ou iguais a i; o tempo total é Θ(n + k) (ou Θ(n) quando k = O(n)); se alterarmos a linha 10 para 'for j = 1 to A.comprimento', o arranjo B continuará sendo ordenado corretamente por valor, mas o algoritmo deixará de ser estável (invertendo a ordem relativa de elementos com chaves iguais).",
          isCorrect: true,
          explanation:
            "Correta! Como analisado na página 172 e no Exercício 8.2-3, substituir 'downto' por 'to' preenche as mesmas posições destinadas a cada valor v em B (portanto a saída ainda fica ordenada), porém coloca o primeiro elemento igual a v encontrado na entrada na maior posição disponível em B, destruindo a estabilidade."
        },
        {
          letter: "B",
          text: "Após a linha 8, C[i] armazena apenas o número de elementos estritamente iguais a i; e se alterarmos a linha 10 para 'for j = 1 to A.comprimento', o algoritmo escreverá fora dos limites do arranjo B.",
          isCorrect: false,
          explanation:
            "Incorreta. C[i] armazena a frequência de i após a linha 5, mas após a linha 8 armazena a soma acumulada (elementos ≤ i). Além disso, trocar por 'to' não viola os limites de B, apenas perde a estabilidade."
        },
        {
          letter: "C",
          text: "O tempo de execução de COUNTING-SORT é Θ(n lg k) porque utiliza busca binária no arranjo auxiliar C[0..k].",
          isCorrect: false,
          explanation:
            "Incorreta. COUNTING-SORT não faz nenhuma busca binária nem comparação de chaves: ele indexa C[A[j]] diretamente em O(1), levando tempo total Θ(n + k)."
        },
        {
          letter: "D",
          text: "A propriedade de estabilidade de COUNTING-SORT é meramente estética e não afeta o funcionamento do algoritmo RADIX-SORT quando COUNTING-SORT é usado como sub-rotina.",
          isCorrect: false,
          explanation:
            "Incorreta! Na página 172, Cormen et al. enfatizam que a estabilidade de COUNTING-SORT é indispensável para que RADIX-SORT funcione corretamente."
        }
      ]
    },
    {
      id: "q6-3",
      type: "Verdadeiro ou Falso",
      reference: "Cap. 8, Seção 8.3 (pp. 173–175) — Ordenação Digital (RADIX-SORT)",
      question:
        "[ VERDADEIRO OU FALSO ] Para ordenar corretamente números de d dígitos usando apenas d passagens sobre uma única lista, o algoritmo RADIX-SORT ordena os elementos a partir do dígito MENOS significativo (dígito 1) até o dígito MAIS significativo (dígito d), exigindo obrigatoriamente que a ordenação intermediária de cada dígito seja estável.",
      options: [
        {
          letter: "V",
          text: "Verdadeiro — Ordenar do dígito menos significativo (LSD) para o mais significativo (MSD) com uma sub-rotina estável garante por indução que, quando dois números empatam no dígito i, sua ordem correta já estabelecida nos dígitos 1 .. i-1 seja preservada.",
          isCorrect: true,
          explanation:
            "Correta! Esta é a essência da Seção 8.3 e do Exercício 8.3-3 (pp. 173–175)."
        },
        {
          letter: "F",
          text: "Falso — O procedimento RADIX-SORT da Seção 8.3 ordena do dígito mais significativo para o menos significativo e pode usar HEAPSORT como sub-rotina intermediária.",
          isCorrect: false,
          explanation:
            "Incorreta. HEAPSORT não é estável, e ordenar do dígito mais significativo sem dividir em subbaldes independentes destruiria a ordenação das passagens anteriores."
        }
      ]
    },
    {
      id: "q6-4",
      type: "Múltipla Escolha",
      reference: "Cap. 8, Seção 8.3 (pp. 175–176) — Lema 8.4",
      question:
        "De acordo com o Lema 8.4, ao utilizar RADIX-SORT com COUNTING-SORT para ordenar n números de b bits agrupando cada chave em d = ⌈b/r⌉ dígitos de r bits cada (onde r ≤ b), qual é o tempo de execução resultante e qual escolha de r minimiza assintoticamente esse tempo quando b ≥ ⌊lg n⌋?",
      options: [
        {
          letter: "A",
          text: "O tempo é Θ((b/r)(n + r²)), e a escolha ótima para b ≥ ⌊lg n⌋ é r = 1 bit por dígito.",
          isCorrect: false,
          explanation:
            "Incorreta. Um dígito de r bits assume valores de 0 a 2^r - 1 (portanto k = 2^r - 1, e não r²). Além disso, escolher r = 1 resulta em Θ(bn), que é pior que Θ(bn / lg n)."
        },
        {
          letter: "B",
          text: "O tempo é Θ((b/r)(n + 2^r)); quando b ≥ ⌊lg n⌋, escolher r = ⌊lg n⌋ fornece o tempo ótimo Θ(bn / lg n) (que se reduz a Θ(n) sempre que b = O(lg n)).",
          isCorrect: true,
          explanation:
            "Correta! Pelo Lema 8.4 (p. 175), cada uma das b/r passagens de COUNTING-SORT com k = 2^r - 1 leva Θ(n + 2^r). Para b ≥ ⌊lg n⌋, escolher r = ⌊lg n⌋ equilibra n e 2^r ≈ n, resultando em Θ((b / lg n)(n + n)) = Θ(bn / lg n)."
        },
        {
          letter: "C",
          text: "O tempo é Θ((b/r)(n + 2^r)), e quando b ≥ ⌊lg n⌋ devemos escolher sempre o maior valor possível r = b, garantindo tempo Θ(n) mesmo se b = n.",
          isCorrect: false,
          explanation:
            "Incorreta! Se b for muito maior que lg n (por exemplo, b = 4 lg n) e escolhermos r = b, o termo 2^r = 2^b = n⁴ explodirá exponencialmente!"
        },
        {
          letter: "D",
          text: "O Lema 8.4 prova que RADIX-SORT ordena no lugar (in-place) usando apenas O(1) palavras de memória auxiliar.",
          isCorrect: false,
          explanation:
            "Incorreta. Na página 176, os autores ressaltam que o RADIX-SORT baseado em COUNTING-SORT NÃO ordena no lugar, exigindo os arranjos auxiliares B[1..n] e C[0..2^r - 1]."
        }
      ]
    },
    {
      id: "q6-5",
      type: "Múltipla Escolha",
      reference: "Cap. 8, Seção 8.4 (pp. 176–179) — Ordenação por Balde (BUCKET-SORT)",
      question:
        "Na análise probabilística do caso médio de BUCKET-SORT(A) para n elementos distribuídos uniforme e independentemente em [0, 1), seja n_i o número de elementos que caem no balde B[i] e X_ij = I{A[j] cai no balde i}. Qual é o valor exato de E[n_i²] demonstrado na Equação (8.2) e como ele é obtido?",
      options: [
        {
          letter: "A",
          text: "E[n_i²] = 1, pois como E[n_i] = 1, o valor esperado do quadrado de uma variável aleatória é sempre igual ao quadrado do seu valor esperado (E[n_i]² = 1² = 1).",
          isCorrect: false,
          explanation:
            "Incorreta! E[X²] = (E[X])² + Var(X) ≠ (E[X])² para variáveis não constantes (veja o Exercício 8.4-3). Aqui, E[n_i] = 1, mas Var(n_i) = 1 - 1/n, logo E[n_i²] = 2 - 1/n."
        },
        {
          letter: "B",
          text: "E[n_i²] = 2 - 1/n, obtido expandindo E[(∑_{j=1..n} X_ij)²] em n termos diagonais E[X_ij²] = 1/n (já que X_ij² = X_ij) somados a n(n - 1) termos independentes cruzados E[X_ij X_ik] = (1/n)(1/n) = 1/n² para k ≠ j, resultando em n(1/n) + n(n-1)(1/n²) = 1 + (n-1)/n = 2 - 1/n.",
          isCorrect: true,
          explanation:
            "Correta! Esta é a dedução exata das páginas 178–179, que permite concluir pela Equação (8.1) que E[T(n)] = Θ(n) + n · O(2 - 1/n) = Θ(n)."
        },
        {
          letter: "C",
          text: "E[n_i²] = Θ(lg n), o que faz com que BUCKET-SORT tenha tempo médio Θ(n lg n).",
          isCorrect: false,
          explanation:
            "Incorreta. E[n_i²] = 2 - 1/n = O(1), portanto o tempo médio total é Θ(n)."
        },
        {
          letter: "D",
          text: "BUCKET-SORT só pode ser executado em tempo linear se a entrada seguir estritamente uma distribuição uniforme, jamais funcionando em Θ(n) para qualquer outra distribuição.",
          isCorrect: false,
          explanation:
            "Incorreta. Como observado no final da página 179, BUCKET-SORT é executado em tempo linear para qualquer entrada na qual a soma dos quadrados dos tamanhos dos baldes (∑ n_i²) seja linear em n."
        }
      ]
    },
    {
      id: "q6-6",
      type: "Múltipla Escolha",
      reference: "Cap. 9, Seção 9.1 (pp. 183–185)",
      question:
        "Qual é o número mínimo de comparações necessárias para determinar isoladamente o elemento mínimo de n números, e qual é o número máximo de comparações realizadas pelo algoritmo ótimo da Seção 9.1 que encontra SIMULTANEAMENTE o mínimo e o máximo de n elementos?",
      options: [
        {
          letter: "A",
          text: "São necessárias n - 1 comparações para determinar o mínimo isoladamente (ótimo pelo argumento do torneio); para determinar o mínimo e o máximo simultaneamente comparando elementos aos pares, gastam-se no máximo 3⌊n/2⌋ comparações (sendo 3(n-1)/2 para n ímpar e 3n/2 - 2 para n par).",
          isCorrect: true,
          explanation:
            "Correta! Ao comparar primeiro cada par de elementos de entrada entre si (1 comparação) e depois comparar o menor do par com min (1 comparação) e o maior do par com max (1 comparação), fazemos 3 comparações para cada 2 elementos, totalizando no máximo 3⌊n/2⌋ comparações em vez de 2n - 2 (p. 184)."
        },
        {
          letter: "B",
          text: "São necessárias ⌈lg n⌉ comparações para encontrar o mínimo, e n - 1 comparações para encontrar o mínimo e o máximo simultaneamente.",
          isCorrect: false,
          explanation:
            "Incorreta. Qualquer algoritmo de comparação precisa eliminar n - 1 candidatos a mínimo, exigindo pelo menos n - 1 comparações apenas para o mínimo."
        },
        {
          letter: "C",
          text: "O melhor algoritmo possível para encontrar o mínimo e o máximo simultaneamente exige obrigatoriamente 2n - 2 comparações.",
          isCorrect: false,
          explanation:
            "Incorreta. 2n - 2 é o custo de encontrar o mínimo e o máximo independentemente; processando aos pares, reduzimos para 3⌊n/2⌋."
        },
        {
          letter: "D",
          text: "Para n par, o algoritmo de mínimo e máximo simultâneos realiza exatamente 3n/2 + 1 comparações.",
          isCorrect: false,
          explanation:
            "Incorreta. Para n par, faz-se 1 comparação inicial entre A[1] e A[2] seguida de 3(n - 2)/2 comparações nos pares restantes, totalizando 1 + 3n/2 - 3 = 3n/2 - 2 comparações (p. 184)."
        }
      ]
    },
    {
      id: "q6-7",
      type: "Múltipla Escolha",
      reference: "Cap. 9, Seção 9.2 (pp. 185–186)",
      question:
        "Durante a execução de RANDOMIZED-SELECT(A, p, r, i), suponha que RANDOMIZED-PARTITION(A, p, r) retorne o índice q do pivô e que calculemos k = q - p + 1. Se verificarmos que i > k, qual chamada recursiva exata é executada na linha 9 e por quê?",
      options: [
        {
          letter: "A",
          text: "RANDOMIZED-SELECT(A, q + 1, r, i), pois continuamos procurando o i-ésimo menor elemento no subarranjo direito.",
          isCorrect: false,
          explanation:
            "Incorreta! No subarranjo direito A[q+1..r], os k menores elementos de A[p..q] já foram descartados; portanto, o índice relativo procurado deve ser ajustado para i - k."
        },
        {
          letter: "B",
          text: "RANDOMIZED-SELECT(A, q + 1, r, i - k), pois já sabemos que existem exatamente k elementos em A[p .. q] (os elementos do lado baixo mais o pivô A[q]) que são menores que o elemento desejado; logo, dentro de A[q + 1 .. r], procuramos o (i - k)-ésimo menor elemento.",
          isCorrect: true,
          explanation:
            "Correta! Esta é a lógica fundamental das linhas 4 e 9 de RANDOMIZED-SELECT (pp. 185–186)."
        },
        {
          letter: "C",
          text: "RANDOMIZED-SELECT(A, p, q - 1, i - k), pois quando i > k o elemento está no subarranjo esquerdo.",
          isCorrect: false,
          explanation:
            "Incorreta. Quando i > k, o elemento procurado é maior que o pivô A[q] (que é o k-ésimo menor), logo está no subarranjo direito A[q+1..r]."
        },
        {
          letter: "D",
          text: "RANDOMIZED-SELECT(A, q + 1, r, i - q), pois subtraímos o índice absoluto q do arranjo A.",
          isCorrect: false,
          explanation:
            "Incorreta. Devemos subtrair k = q - p + 1 (a quantidade de elementos descartados no subarranjo atual A[p..q]), e não o índice global q."
        }
      ]
    },
    {
      id: "q6-8",
      type: "Verdadeiro ou Falso",
      reference: "Cap. 9, Seção 9.2 (pp. 186–189) e Exercício 9.2-1",
      question:
        "[ VERDADEIRO OU FALSO ] Embora o tempo de execução esperado de RANDOMIZED-SELECT para encontrar qualquer estatística de ordem seja Θ(n) (e o algoritmo nunca faça chamadas recursivas para subarranjos de comprimento 0), seu tempo de execução no pior caso é Θ(n²), pois uma sequência extremamente azarada de sorteios de pivô pode particionar sempre em torno do maior (ou menor) elemento restante.",
      options: [
        {
          letter: "V",
          text: "Verdadeiro — Como destacado na página 186 e no Exercício 9.2-4, se o pivô sorteado for repetidamente o extremo oposto ao elemento buscado, o subarranjo diminui em apenas 1 elemento por nível, gerando ∑_{m=1..n} Θ(m) = Θ(n²).",
          isCorrect: true,
          explanation:
            "Correta! É exatamente por causa desse pior caso Θ(n²) de RANDOMIZED-SELECT que a Seção 9.3 introduz o algoritmo determinístico SELECT de tempo O(n) no pior caso."
        },
        {
          letter: "F",
          text: "Falso — Como RANDOMIZED-SELECT faz apenas uma chamada recursiva por nível, seu tempo de execução no pior caso também é O(n).",
          isCorrect: false,
          explanation:
            "Incorreta. Fazer apenas uma chamada recursiva com redução de tamanho de n para n - 1 a cada passo produz a recorrência T(n) = T(n - 1) + Θ(n) = Θ(n²)."
        }
      ]
    },
    {
      id: "q6-9",
      type: "Múltipla Escolha",
      reference: "Cap. 9, Seção 9.3 (pp. 189–191) — Análise do Algoritmo SELECT",
      question:
        "Na análise do algoritmo determinístico SELECT (Seção 9.3), os n elementos são divididos em ⌈n/5⌉ grupos de 5 elementos, e x é a mediana das ⌈n/5⌉ medianas. Qual é o limite inferior garantido para o número de elementos maiores (e menores) que x, qual é o tamanho máximo do subarranjo na chamada recursiva da Etapa 5, e qual é a recorrência resultante para o pior caso T(n)?",
      options: [
        {
          letter: "A",
          text: "Pelo menos n/2 elementos são maiores que x; a Etapa 5 chama SELECT para no máximo n/2 elementos; e a recorrência é T(n) ≤ T(n/5) + T(n/2) + O(n).",
          isCorrect: false,
          explanation:
            "Incorreta. A mediana das medianas x não é a mediana exata de todos os n elementos; ela garante que 3 de 5 elementos em metade dos grupos sejam maiores que x, o que corresponde a cerca de 3n/10 (e não n/2)."
        },
        {
          letter: "B",
          text: "Pelo menos 3(⌈(1/2)⌈n/5⌉⌉ - 2) ≥ 3n/10 - 6 elementos são maiores que x (e pelo menos 3n/10 - 6 são menores que x); assim, no pior caso a Etapa 5 chama SELECT recursivamente para no máximo 7n/10 + 6 elementos, gerando a recorrência T(n) ≤ T(⌈n/5⌉) + T(7n/10 + 6) + O(n) = O(n).",
          isCorrect: true,
          explanation:
            "Correta! Esta é a análise canônica das páginas 190–191: descontando o grupo que contém x e o eventual grupo incompleto (n mod 5), restam pelo menos ⌈(1/2)⌈n/5⌉⌉ - 2 grupos com 3 elementos > x cada, garantindo ≥ 3n/10 - 6 elementos descartados e no máximo n - (3n/10 - 6) = 7n/10 + 6 elementos na chamada recursiva da Etapa 5."
        },
        {
          letter: "C",
          text: "Pelo menos 4n/5 elementos são maiores que x, gerando a recorrência T(n) ≤ T(n/5) + T(n/5) + O(n).",
          isCorrect: false,
          explanation:
            "Incorreta. O subproblema da Etapa 5 tem tamanho máximo 7n/10 + 6."
        },
        {
          letter: "D",
          text: "A recorrência de SELECT é T(n) ≤ 5 T(n/5) + O(n), cuja solução pelo Teorema Mestre é Θ(n lg n).",
          isCorrect: false,
          explanation:
            "Incorreta! Os ⌈n/5⌉ grupos de 5 elementos na Etapa 2 não são ordenados recursivamente com SELECT, mas sim com INSERTION-SORT em O(1) cada (total O(n)). SELECT só faz duas chamadas recursivas: T(⌈n/5⌉) na Etapa 3 e T(7n/10 + 6) na Etapa 5."
        }
      ]
    },
    {
      id: "q6-10",
      type: "Múltipla Escolha",
      reference: "Cap. 9, Seção 9.3 (p. 191) e Exercício 9.3-1",
      question:
        "Por que o algoritmo SELECT (Mediana das Medianas) mantém tempo de execução linear O(n) no pior caso se dividirmos a entrada em grupos de 5 ou de 7 elementos, mas DEIXA de ter tempo linear se usarmos grupos de 3 elementos?",
      options: [
        {
          letter: "A",
          text: "Porque 3 não é um número primo de Fermat, o que impede ordenar grupos de 3 com Insertion-Sort.",
          isCorrect: false,
          explanation:
            "Incorreta. Qualquer grupo de tamanho constante (inclusive 3) pode ser ordenado em tempo O(1); o problema com grupos de 3 está na soma dos tamanhos das duas chamadas recursivas."
        },
        {
          letter: "B",
          text: "Porque a resolução por substituição T(n) ≤ cn exige que a soma das frações dos tamanhos dos dois subproblemas recursivos seja estritamente menor que 1: para grupos de 5 temos 1/5 + 7/10 = 9/10 < 1 e para grupos de 7 temos 1/7 + 5/7 = 6/7 < 1; já para grupos de 3, apenas 2 elementos de metade dos ⌈n/3⌉ grupos são maiores que x (≥ n/3 - 4), deixando até 2n/3 + 4 elementos na Etapa 5 e produzindo 1/3 + 2/3 = 1, cuja recorrência T(n) = T(n/3) + T(2n/3) + Θ(n) resulta em Θ(n lg n).",
          isCorrect: true,
          explanation:
            "Correta! Esta é a resposta completa do Exercício 9.3-1: quando a soma dos fatores fracionários nos subproblemas recursivos é igual a 1 (1/3 + 2/3 = 1), cada nível da árvore de recursão realiza trabalho Θ(n) sem decaimento geométrico, elevando o custo total para Θ(n lg n)."
        },
        {
          letter: "C",
          text: "Porque com grupos de 3 elementos o algoritmo entra em laço infinito para qualquer n ≥ 10.",
          isCorrect: false,
          explanation:
            "Incorreta. Com grupos de 3 o algoritmo termina (para n grande), mas em tempo Θ(n lg n) em vez de O(n)."
        },
        {
          letter: "D",
          text: "Com grupos de 7 elementos o algoritmo também falha, pois 7 é maior que 5 e o custo da Etapa 2 passa a ser Θ(n²).",
          isCorrect: false,
          explanation:
            "Incorreta! Ordenar ⌈n/7⌉ grupos de tamanho constante 7 leva (n/7) · O(7²) = O(n), e a soma das frações recursivas 1/7 + 5/7 = 6/7 < 1 garante tempo total O(n)."
        }
      ]
    }
  ];

  /* ========================================================================
     SEÇÃO 4: EXERCÍCIOS E PROBLEMAS CANÔNICOS (8 ATIVIDADES COM SOLUÇÃO)
     ======================================================================== */
  const exercicios = [
    {
      id: "ex6-1",
      code: "EXERCÍCIO 01 • PROFUNDIDADE DE FOLHAS E AUSÊNCIA DE ENTRADAS LINEARES EM 1/2^k",
      reference: "Exercícios 8.1-1 e 8.1-3 (p. 169)",
      title: "Menor Profundidade Possível em uma Árvore de Decisão e Fração Exponencialmente Pequena de Entradas Lineares",
      prompt: `
        <p>Resolva rigorosamente os dois problemas fundamentais sobre árvores de decisão da Seção 8.1:</p>
        <ol>
          <li><strong>(Exercício 8.1-1)</strong> Qual é a menor profundidade possível de uma folha em uma árvore de decisão para uma ordenação por comparação de $n$ elementos? Justifique combinatoriamente e em termos de grafos de comparações.</li>
          <li><strong>(Exercício 8.1-3)</strong> Mostre que não existe <strong>nenhum</strong> algoritmo de ordenação por comparação cujo tempo de execução seja linear para pelo menos metade das $n!$ entradas de comprimento $n$. E se for para uma fração de $1/n$ das entradas de comprimento $n$? E se for para uma fração de $1/2^n$?</li>
        </ol>
      `,
      placeholder:
        "Para 8.1-1, considere quantas comparações são necessárias para conectar n elementos em uma cadeia total; para 8.1-3, conte quantas folhas podem existir até a profundidade cn...",
      solution: `
        <h4>1. Resolução do Exercício 8.1-1: Menor Profundidade de uma Folha é $n - 1$</h4>
        <p>A menor profundidade possível de uma folha alcançável em uma árvore de decisão para ordenar $n$ elementos é <strong>$n - 1$</strong>:</p>
        <ul>
          <li><strong>Justificativa por Teoria dos Grafos / Ordem Total:</strong> Considere os $n$ elementos de entrada como $n$ vértices inicialmente isolados, e cada comparação $a_i \\le a_j$ como uma aresta conectando os vértices $i$ e $j$. Para que uma folha certifique univocamente uma ordenação total $a_{\\pi(1)} \\le a_{\\pi(2)} \\le \\dots \\le a_{\\pi(n)}$, cada par adjacente $(a_{\\pi(k)}, a_{\\pi(k+1)})$ para $k = 1, \\dots, n-1$ precisa ter sido comparado diretamente (caso contrário, se não houvesse comparação entre $a_{\\pi(k)}$ e $a_{\\pi(k+1)}$, ambos poderiam ser trocados sem alterar o resultado de nenhuma comparação no caminho da raiz até a folha!). Portanto, o grafo de comparações deve ser conexo (e conter o caminho hamiltoniano $a_{\\pi(1)} - a_{\\pi(2)} - \\dots - a_{\\pi(n)}$), o que exige no mínimo <strong>$n - 1$ arestas (comparações)</strong>.</li>
          <li><strong>Atingibilidade:</strong> Essa profundidade mínima $n - 1$ é atingida, por exemplo, pelo melhor caso de <code>INSERTION-SORT</code> quando a entrada já está ordenada!</li>
        </ul>

        <h4>2. Resolução do Exercício 8.1-3: Impossibilidade de Tempo Linear até mesmo para uma Fração $1/2^n$ das Entradas</h4>
        <p>Suponha que um algoritmo de ordenação por comparação execute em tempo linear — realizando no máximo $cn$ comparações para alguma constante $c > 0$ — sobre $m$ das $n!$ permutações possíveis de entrada. Cada uma dessas $m$ permutações distintas deve terminar em uma folha alcançável distinta de profundidade $\\le cn$ na árvore de decisão.</p>
        <p>Quantas folhas de profundidade $\\le cn$ podem existir em uma árvore binária? No máximo o número de folhas de uma árvore binária completa de altura $cn$ (ou a soma de nós até o nível $cn$), que é limitado por:</p>
        $$m \\le 2^{cn}.$$
        <p>Agora comparamos $2^{cn}$ com as três frações exigidas de $n!$:</p>
        <ol>
          <li><strong>Para metade das entradas ($m \\ge n!/2$):</strong> Precisaríamos ter $2^{cn} \\ge \\frac{n!}{2} \\iff cn \\ge \\lg(n!) - 1 = \\Theta(n \\lg n)$. Mas para $n$ suficientemente grande, $cn = o(n \\lg n)$, o que é uma contradição!</li>
          <li><strong>Para uma fração $1/n$ das entradas ($m \\ge n!/n$):</strong> Precisaríamos ter $2^{cn} \\ge \\frac{n!}{n} = (n-1)! \\iff cn \\ge \\lg(n!) - \\lg n = \\Theta(n \\lg n)$, novamente impossível para $n$ grande!</li>
          <li><strong>Para uma fração $1/2^n$ das entradas ($m \\ge n!/2^n$):</strong> Precisaríamos ter:
            $$2^{cn} \\ge \\frac{n!}{2^n} \\iff cn \\ge \\lg(n!) - n \\iff (c + 1)n \\ge \\lg(n!) = \\Theta(n \\lg n).$$
            Como $(c + 1)n = \\Theta(n) = o(n \\lg n)$, essa desigualdade também falha para todo $n$ suficientemente grande (basta $n > e \\cdot 2^{c+1}$)! Portanto, <strong>nenhum algoritmo de ordenação por comparação pode ser linear nem mesmo para uma fração exponencialmente pequena $1/2^n$ das permutações de entrada</strong>! $\\blacksquare$</li>
        </ol>
      `
    },
    {
      id: "ex6-2",
      code: "EXERCÍCIO 02 • CONSULTA DE FAIXA [a .. b] EM TEMPO O(1) COM PRÉ-PROCESSAMENTO Θ(n + k)",
      reference: "Exercício 8.2-4 (p. 172)",
      title: "Projetar Algoritmo de Pré-Processamento Θ(n + k) para Contar Inteiros em [a .. b] em Tempo O(1)",
      prompt: `
        <p><strong>(Exercício 8.2-4)</strong> Descreva um algoritmo que, dados $n$ inteiros na faixa de $0$ a $k$, pré-processe sua entrada no tempo $\\Theta(n + k)$ e depois responda a qualquer consulta sobre quantos dos $n$ inteiros caem em uma faixa $[a \\dots b]$ (com $0 \\le a \\le b \\le k$) no tempo $O(1)$.</p>
        <p><em>Instrução:</em> Escreva o pseudocódigo da fase de pré-processamento e da função de consulta <code>COUNT-IN-RANGE(C, a, b)</code>, tratando cuidadosamente o caso de borda $a = 0$.</p>
      `,
      placeholder:
        "Use exatamente as linhas 1 a 8 de COUNTING-SORT para construir o arranjo de somas de prefixos C[0..k] e expresse a resposta para [a..b] usando C[b] e C[a - 1]...",
      solution: `
        <h4>1. Fase de Pré-Processamento em Tempo $\\Theta(n + k)$</h4>
        <p>Executamos exatamente as <strong>linhas 1 a 8 de <code>COUNTING-SORT(A, B, k)</code></strong> (sem precisar alocar nem preencher o arranjo $B$!):</p>
        <pre><code>PREPROCESS-RANGE-COUNT(A, k)
1  seja C[0 .. k] um novo arranjo
2  for i = 0 to k
3      C[i] = 0
4  for j = 1 to A.comprimento
5      C[A[j]] = C[A[j]] + 1
6  for i = 1 to k
7      C[i] = C[i] + C[i - 1]
8  return C</code></pre>
        <ul>
          <li><strong>Custo do Pré-processamento:</strong> As linhas 2–3 levam $\\Theta(k)$, as linhas 4–5 levam $\\Theta(n)$ e as linhas 6–7 levam $\\Theta(k)$, totalizando exatamente $\\mathbf{\\Theta(n + k)}$.</li>
          <li><strong>Invariante de $C[0 \\dots k]$:</strong> Para todo $i \\in \\{0, 1, \\dots, k\\}$, $C[i]$ armazena o número exato de elementos de $A$ que pertencem ao intervalo $[0 \\dots i]$ (isto é, menores ou iguais a $i$).</li>
        </ul>

        <h4>2. Resposta a Cada Consulta $[a \\dots b]$ em Tempo $O(1)$</h4>
        <p>O número de elementos de $A$ que caem no intervalo fechado $[a \\dots b]$ (com $0 \\le a \\le b \\le k$) é o número de elementos $\\le b$ menos o número de elementos $\\le a - 1$:</p>
        <pre><code>COUNT-IN-RANGE(C, a, b)
1  if a == 0
2      return C[b]
3  else return C[b] - C[a - 1]</code></pre>
        <p>Como a consulta realiza no máximo uma subtração e dois acessos a arranjo, seu tempo de execução é <strong>$O(1)$ no pior caso</strong>! $\\blacksquare$</p>
      `
    },
    {
      id: "ex6-3",
      code: "EXERCÍCIO 03 • RADIX-SORT SOBRE PALAVRAS E ORDENAÇÃO DE [0 .. n³ - 1] EM O(n)",
      reference: "Exercícios 8.3-1 e 8.3-4 (p. 176)",
      title: "Ilustrar RADIX-SORT em Lista de Palavras e Ordenar n Inteiros no Intervalo 0 a n³ - 1 em Tempo O(n)",
      prompt: `
        <p>Resolva os dois exercícios clássicos da Seção 8.3:</p>
        <ol>
          <li><strong>(Exercício 8.3-1)</strong> Usando a Figura 8.3 como modelo, ilustre a operação de <code>RADIX-SORT</code> sobre a seguinte lista de 16 palavras de 3 letras em inglês:<br/>
            <code>COW, DOG, SEA, RUG, ROW, MOB, BOX, TAB, BAR, EAR, TAR, DIG, BIG, TEA, NOW, FOX</code>.</li>
          <li><strong>(Exercício 8.3-4)</strong> Mostre como ordenar $n$ inteiros na faixa de $0$ a $n^3 - 1$ no tempo $O(n)$.</li>
        </ol>
      `,
      placeholder:
        "No item 1, mostre as 3 colunas após ordenar pela 3ª letra, 2ª letra e 1ª letra; no item 2, represente cada inteiro na base n...",
      solution: `
        <h4>1. Resolução do Exercício 8.3-1: Rastreamento de <code>RADIX-SORT</code> nas 16 Palavras</h4>
        <p>Ordenamos de forma estável da 3ª letra (menos significativa, à direita) até a 1ª letra (mais significativa, à esquerda):</p>
        $$\\begin{array}{c|cccc}
        \\text{Pos.} & \\textbf{Entrada} & \\textbf{Passagem 1 (3ª letra)} & \\textbf{Passagem 2 (2ª letra)} & \\textbf{Passagem 3 (1ª letra — Final)} \\\\ \\hline
        1  & \\text{COW} & \\text{SE}\\mathbf{\\text{A}} & \\text{T}\\mathbf{\\text{A}}\\text{B} & \\mathbf{\\text{B}}\\text{AR} \\\\
        2  & \\text{DOG} & \\text{TE}\\mathbf{\\text{A}} & \\text{B}\\mathbf{\\text{A}}\\text{R} & \\mathbf{\\text{B}}\\text{IG} \\\\
        3  & \\text{SEA} & \\text{MO}\\mathbf{\\text{B}} & \\text{E}\\mathbf{\\text{A}}\\text{R} & \\mathbf{\\text{B}}\\text{OX} \\\\
        4  & \\text{RUG} & \\text{TA}\\mathbf{\\text{B}} & \\text{T}\\mathbf{\\text{A}}\\text{R} & \\mathbf{\\text{C}}\\text{OW} \\\\
        5  & \\text{ROW} & \\text{DO}\\mathbf{\\text{G}} & \\text{S}\\mathbf{\\text{E}}\\text{A} & \\mathbf{\\text{D}}\\text{IG} \\\\
        6  & \\text{MOB} & \\text{RU}\\mathbf{\\text{G}} & \\text{T}\\mathbf{\\text{E}}\\text{A} & \\mathbf{\\text{D}}\\text{OG} \\\\
        7  & \\text{BOX} & \\text{DI}\\mathbf{\\text{G}} & \\text{D}\\mathbf{\\text{I}}\\text{G} & \\mathbf{\\text{E}}\\text{AR} \\\\
        8  & \\text{TAB} & \\text{BI}\\mathbf{\\text{G}} & \\text{B}\\mathbf{\\text{I}}\\text{G} & \\mathbf{\\text{F}}\\text{OX} \\\\
        9  & \\text{BAR} & \\text{BA}\\mathbf{\\text{R}} & \\text{M}\\mathbf{\\text{O}}\\text{B} & \\mathbf{\\text{M}}\\text{OB} \\\\
        10 & \\text{EAR} & \\text{EA}\\mathbf{\\text{R}} & \\text{D}\\mathbf{\\text{O}}\\text{G} & \\mathbf{\\text{N}}\\text{OW} \\\\
        11 & \\text{TAR} & \\text{TA}\\mathbf{\\text{R}} & \\text{C}\\mathbf{\\text{O}}\\text{W} & \\mathbf{\\text{R}}\\text{OW} \\\\
        12 & \\text{DIG} & \\text{CO}\\mathbf{\\text{W}} & \\text{R}\\mathbf{\\text{O}}\\text{W} & \\mathbf{\\text{R}}\\text{UG} \\\\
        13 & \\text{BIG} & \\text{RO}\\mathbf{\\text{W}} & \\text{N}\\mathbf{\\text{O}}\\text{W} & \\mathbf{\\text{S}}\\text{EA} \\\\
        14 & \\text{TEA} & \\text{NO}\\mathbf{\\text{W}} & \\text{B}\\mathbf{\\text{O}}\\text{X} & \\mathbf{\\text{T}}\\text{AB} \\\\
        15 & \\text{NOW} & \\text{BO}\\mathbf{\\text{X}} & \\text{F}\\mathbf{\\text{O}}\\text{X} & \\mathbf{\\text{T}}\\text{AR} \\\\
        16 & \\text{FOX} & \\text{FO}\\mathbf{\\text{X}} & \\text{R}\\mathbf{\\text{U}}\\text{G} & \\mathbf{\\text{T}}\\text{EA}
        \\end{array}$$

        <h4>2. Resolução do Exercício 8.3-4: Ordenar $n$ Inteiros em $[0 \\dots n^3 - 1]$ em Tempo $O(n)$</h4>
        <ul>
          <li><strong>Se tentássemos usar <code>COUNTING-SORT</code> diretamente:</strong> teríamos $k = n^3 - 1$, levando tempo $\\Theta(n + n^3) = \\Theta(n^3)$, o que é proibitivo!</li>
          <li><strong>Solução usando <code>RADIX-SORT</code> na base $n$:</strong> Representamos cada inteiro $x \\in \\{0, 1, \\dots, n^3 - 1\\}$ como um número de <strong>$d = 3$ dígitos na base $n$</strong>:
            $$x = d_2 \\cdot n^2 + d_1 \\cdot n + d_0, \\qquad \\text{onde cada dígito } d_i \\in \\{0, 1, \\dots, n - 1\\}.$$
            (Os dígitos são obtidos em $O(1)$ por divisão inteira e resto: $d_0 = x \\bmod n$, $d_1 = \\lfloor x/n \\rfloor \\bmod n$, $d_2 = \\lfloor x/n^2 \\rfloor$.)</li>
          <li>Agora aplicamos <code>RADIX-SORT</code> com <code>COUNTING-SORT</code> como sub-rotina estável sobre esses números de $d = 3$ dígitos, onde cada dígito assume $k = n$ valores possíveis ($0$ a $n - 1$). Pelo <strong>Lema 8.3</strong>, o tempo total de execução é:
            $$T(n) = \\Theta(d(n + k)) = \\Theta(3(n + n)) = \\Theta(6n) = \\mathbf{O(n)}. \\quad \\blacksquare$$</li>
        </ul>
      `
    },
    {
      id: "ex6-4",
      code: "EXERCÍCIO 04 • PIOR CASO DE BUCKET-SORT E GARANTIA O(n lg n) NO PIOR CASO",
      reference: "Exercício 8.4-2 (p. 179)",
      title: "Explicar o Pior Caso Θ(n²) de BUCKET-SORT e Modificá-lo para Garantir O(n lg n) no Pior Caso Mantendo Θ(n) Médio",
      prompt: `
        <p><strong>(Exercício 8.4-2)</strong> Explique por que o tempo de execução do pior caso para a ordenação por balde (<code>BUCKET-SORT</code>) é $\\Theta(n^2)$. Qual é a alteração simples no algoritmo que preserva seu tempo de execução linear $\\Theta(n)$ do caso médio e torna seu tempo de execução do pior caso igual a $O(n \\lg n)$?</p>
      `,
      placeholder:
        "Analise o que acontece quando todos os n elementos caem no mesmo balde B[i] e qual algoritmo de ordenação deve substituir INSERTION-SORT na linha 8...",
      solution: `
        <h4>1. Por que o Pior Caso de <code>BUCKET-SORT</code> é $\\Theta(n^2)$?</h4>
        <p>A premissa de distribuição uniforme garante que o tamanho esperado de cada balde seja pequeno, mas <strong>no pior caso</strong> (para uma entrada adversária em que a distribuição não é uniforme), <strong>todos os $n$ elementos podem cair dentro de um único balde $B[i^*]$</strong> (por exemplo, se todos os $n$ números de entrada pertencerem ao subintervalo $[0, 1/n)$ e estiverem em ordem decrescente). Nesse caso, $n_{i^*} = n$ e $n_i = 0$ para $i \\ne i^*$. Na linha 8 de <code>BUCKET-SORT</code>, chamamos <code>INSERTION-SORT</code> sobre a lista $B[i^*]$ de tamanho $n$, cujo tempo de execução no pior caso é $\\mathbf{\\Theta(n^2)}$!</p>

        <h4>2. A Alteração Simples para Garantir $O(n \\lg n)$ no Pior Caso e Preservar $\\Theta(n)$ no Caso Médio</h4>
        <p>Basta substituir a chamada à ordenação por inserção na linha 8 por um algoritmo de ordenação por comparação ótimo de pior caso $O(n \\lg n)$, como <strong><code>MERGE-SORT</code></strong> ou <strong><code>HEAPSORT</code></strong>, para ordenar cada balde $B[i]$ (ou usar <em>Introsort</em> / Insertion-Sort para baldes pequenos e Merge-Sort se $n_i$ exceder uma constante):</p>
        <ul>
          <li><strong>Novo Pior Caso $O(n \\lg n)$:</strong> No pior caso, ordenar o balde $B[i]$ de tamanho $n_i$ leva tempo $O(n_i \\lg n_i)$. Somando sobre todos os $n$ baldes (lembrando que $\\sum_{i=0}^{n-1} n_i = n$ e $\\lg n_i \\le \\lg n$):
            $$T(n) = \\Theta(n) + \\sum_{i=0}^{n-1} O(n_i \\lg n_i) \\le \\Theta(n) + O\\left(\\lg n \\sum_{i=0}^{n-1} n_i\\right) = \\Theta(n) + O(n \\lg n) = \\mathbf{O(n \\lg n)}.$$</li>
          <li><strong>Preservação do Caso Médio $\\Theta(n)$:</strong> Como para todo inteiro $n_i \\ge 0$ vale $n_i \\lg n_i \\le n_i^2$, o custo esperado de ordenar o balde $B[i]$ sob distribuição uniforme continua limitado superiormente por $O(E[n_i^2]) = O(2 - 1/n) = O(1)$. Logo, pela Equação (8.1), o tempo de execução do caso médio permanece $\\Theta(n) + n \\cdot O(1) = \\mathbf{\\Theta(n)}$! $\\blacksquare$</li>
        </ul>
      `
    },
    {
      id: "ex6-5",
      code: "EXERCÍCIO 05 • SEGUNDO MENOR ELEMENTO EM n + ⌈lg n⌉ - 2 COMPARAÇÕES",
      reference: "Exercício 9.1-1 (p. 184)",
      title: "Demonstrar que o Segundo Menor Elemento Pode Ser Determinado com n + ⌈lg n⌉ - 2 Comparações no Pior Caso",
      prompt: `
        <p><strong>(Exercício 9.1-1)</strong> Mostre que o <strong>segundo menor</strong> entre $n$ elementos pode ser determinado com</p>
        $$n + \\lceil \\lg n \\rceil - 2$$
        <p>comparações no pior caso. <em>(Sugestão do livro: Determine também o menor elemento.)</em></p>
      `,
      placeholder:
        "Organize um torneio eliminatório em árvore binária balanceada para encontrar o menor elemento em n - 1 comparações e identifique quais elementos perderam diretamente para o campeão...",
      solution: `
        <h4>1. Fase 1: Torneio em Árvore Binária para Encontrar o Menor Elemento ($n - 1$ Comparações)</h4>
        <p>Organizamos um torneio eliminatório estruturado como uma árvore binária quase completa (com os $n$ elementos nas folhas):</p>
        <ul>
          <li>Na 1ª rodada, emparelhamos os elementos dois a dois e avançamos o menor de cada par para a próxima rodada (se o número de elementos na rodada for ímpar, um elemento avança automaticamente por <em>bye</em>).</li>
          <li>Repetimos rodada após rodada até restar apenas $1$ vencedor na raiz da árvore, que é o <strong>menor elemento absoluto $x_{\\min}$</strong>.</li>
          <li>Como cada comparação elimina exatamente $1$ elemento e $n - 1$ elementos são eliminados até restar o campeão, essa primeira fase realiza exatamente <strong>$n - 1$ comparações</strong>, e a altura da árvore do torneio é $\\mathbf{\\lceil \\lg n \\rceil}$ (logo, o campeão $x_{\\min}$ disputou e venceu no máximo $\\lceil \\lg n \\rceil$ partidas ao longo do seu caminho da folha até a raiz).</li>
        </ul>

        <h4>2. Fase 2: Encontrar o Menor entre os Elementos Derrotados Diretamente por $x_{\\min}$ ($\\lceil \\lg n \\rceil - 1$ Comparações)</h4>
        <p><strong>Observação-chave:</strong> O segundo menor elemento do conjunto perdeu apenas para um único elemento possível: o próprio menor elemento $x_{\\min}$! Portanto, o segundo menor elemento deve obrigatoriamente pertencer ao conjunto $S_{\\text{perdedores}}$ dos elementos que <strong>foram comparados diretamente com $x_{\\min}$ e perderam para ele</strong> durante a Fase 1.</p>
        <ul>
          <li>Como $x_{\\min}$ participou de no máximo $\\lceil \\lg n \\rceil$ comparações na Fase 1, o conjunto $S_{\\text{perdedores}}$ contém no máximo <strong>$\\lceil \\lg n \\rceil$ elementos</strong>.</li>
          <li>Executamos agora o algoritmo padrão <code>MINIMUM</code> sobre os elementos de $S_{\\text{perdedores}}$, o que exige no máximo:
            $$|S_{\\text{perdedores}}| - 1 \\le \\lceil \\lg n \\rceil - 1 \\text{ comparações}.$$</li>
        </ul>

        <h4>3. Total de Comparações no Pior Caso</h4>
        <p>Somando as comparações das duas fases, obtemos exatamente:</p>
        $$(n - 1) + (\\lceil \\lg n \\rceil - 1) = \\mathbf{n + \\lceil \\lg n \\rceil - 2 \\text{ comparações}}. \\quad \\blacksquare$$
      `
    },
    {
      id: "ex6-6",
      code: "EXERCÍCIO 06 • GRUPOS DE 7 VS. GRUPOS DE 3 NO ALGORITMO SELECT",
      reference: "Exercício 9.3-1 (p. 191)",
      title: "Provar que SELECT Funciona em Tempo Linear com Grupos de 7, mas Não Funciona em Tempo Linear com Grupos de 3",
      prompt: `
        <p><strong>(Exercício 9.3-1)</strong> No algoritmo <code>SELECT</code>, os elementos de entrada são divididos em grupos de cinco:</p>
        <ol>
          <li><strong>(a)</strong> O algoritmo funcionará em tempo linear se eles forem divididos em <strong>grupos de sete</strong>? Demonstre formalmente montando a recorrência e resolvendo-a por substituição.</li>
          <li><strong>(b)</strong> Demonstre que <code>SELECT</code> <strong>não</strong> será executado em tempo linear se forem usados <strong>grupos de três</strong> elementos.</li>
        </ol>
      `,
      placeholder:
        "Para grupos de 7, mostre que ≥ 4(⌈(1/2)⌈n/7⌉⌉ - 2) ≥ 2n/7 - 8 elementos são maiores que x; para grupos de 3, mostre que a recorrência fica T(n) = T(n/3) + T(2n/3) + Θ(n)...",
      solution: `
        <h4>(a) Demonstração de que <code>SELECT</code> com Grupos de 7 Executa em Tempo Linear $O(n)$</h4>
        <ol>
          <li>Dividindo os $n$ elementos em $\\lceil n/7 \\rceil$ grupos de 7 elementos, pelo menos metade das medianas dos grupos ($\\lceil \\frac{1}{2}\\lceil n/7 \\rceil \\rceil$) são $\\ge x$.</li>
          <li>Em cada grupo completo de 7 elementos cuja mediana é $\\ge x$, existem <strong>$4$ elementos</strong> maiores ou iguais a $x$ (a mediana e os 3 elementos maiores que ela no grupo). Descontando o grupo que contém $x$ e o único eventual grupo incompleto ($n \\bmod 7$), o número de elementos estritamente maiores que $x$ (e, simetricamente, estritamente menores que $x$) é no mínimo:
            $$4\\left(\\left\\lceil \\frac{1}{2}\\left\\lceil \\frac{n}{7} \\right\\rceil \\right\\rceil - 2\\right) \\ge \\frac{4n}{14} - 8 = \\frac{2n}{7} - 8.$$</li>
          <li>Logo, a Etapa 5 faz chamada recursiva para no máximo $n - (\\frac{2n}{7} - 8) = \\frac{5n}{7} + 8$ elementos, produzindo a recorrência:
            $$T(n) \\le T(\\lceil n/7 \\rceil) + T(5n/7 + 8) + an.$$</li>
          <li>Substituindo a hipótese indutiva $T(k) \\le ck$ (e usando $\\lceil n/7 \\rceil < n/7 + 1$):
            $$T(n) \\le \\frac{cn}{7} + c + \\frac{5cn}{7} + 8c + an = \\frac{6cn}{7} + 9c + an = cn + \\left(-\\frac{cn}{7} + 9c + an\\right).$$
            Para que $-\\frac{cn}{7} + 9c + an \\le 0$, precisamos de $c(\\frac{n - 63}{7}) \\ge an \\iff c \\ge 7a(\\frac{n}{n - 63})$ para $n > 63$. Escolhendo o limiar $n \\ge 126$ (o dobro de $63$), temos $\\frac{n}{n - 63} \\le 2$, bastando escolher $\\mathbf{c \\ge 14a}$ para provar que $\\mathbf{T(n) = O(n)}$!</li>
        </ol>

        <h4>(b) Demonstração de que <code>SELECT</code> com Grupos de 3 NÃO Executa em Tempo Linear</h4>
        <ol>
          <li>Se dividirmos os $n$ elementos em $\\lceil n/3 \\rceil$ grupos de 3 elementos, cada grupo completo com mediana $\\ge x$ contribui com apenas <strong>$2$ elementos</strong> maiores ou iguais a $x$.</li>
          <li>Descontando os 2 grupos excepcionais, o número garantido de elementos maiores (ou menores) que $x$ é no mínimo:
            $$2\\left(\\left\\lceil \\frac{1}{2}\\left\\lceil \\frac{n}{3} \\right\\rceil \\right\\rceil - 2\\right) \\ge \\frac{2n}{6} - 4 = \\frac{n}{3} - 4.$$</li>
          <li>Portanto, no pior caso, a Etapa 5 pode ser chamada recursivamente sobre até $n - (\\frac{n}{3} - 4) = \\frac{2n}{3} + 4$ elementos, e a recorrência do pior caso tem a forma:
            $$T(n) = T(\\lceil n/3 \\rceil) + T(2n/3 + 4) + \\Theta(n).$$</li>
          <li>Como a soma dos coeficientes fracionários dos subproblemas é $\\frac{1}{3} + \\frac{2}{3} = 1$, se tentarmos substituir $T(k) \\le ck$, obteremos $T(n) \\le \\frac{cn}{3} + \\frac{2cn}{3} + 5c + an = cn + 5c + an > cn$ para qualquer constante $c$! Na verdade, como vimos no Capítulo 4, uma recorrência da forma $T(n) = T(n/3) + T(2n/3) + \\Theta(n)$ tem custo $\\Theta(n)$ em cada um dos $\\Omega(\\lg n)$ níveis completos da árvore de recursão, resultando em $\\mathbf{T(n) = \\Omega(n \\lg n)}$! $\\blacksquare$</li>
        </ol>
      `
    },
    {
      id: "ex6-7",
      code: "EXERCÍCIO 07 • MEDIANA DE DOIS ARRANJOS ORDENADOS EM TEMPO O(lg n)",
      reference: "Exercício 9.3-8 (p. 192)",
      title: "Projetar Algoritmo de Tempo O(lg n) para Determinar a Mediana de Todos os 2n Elementos em Dois Arranjos Ordenados X[1..n] e Y[1..n]",
      prompt: `
        <p><strong>(Exercício 9.3-8)</strong> Sejam $X[1 \\dots n]$ e $Y[1 \\dots n]$ dois arranjos, cada um contendo $n$ números já em sequência ordenada. Apresente um algoritmo de tempo $O(\\lg n)$ para determinar a mediana (inferior, isto é, o $n$-ésimo menor elemento) de todos os $2n$ elementos nos arranjos $X$ e $Y$.</p>
      `,
      placeholder:
        "Compare a mediana m_X de X com a mediana m_Y de Y (ou use busca binária para encontrar k tal que X[k] ≤ Y[n - k + 1]) descartando metade de cada arranjo a cada passo...",
      solution: `
        <h4>1. Ideia de Dividir para Conquistar (Descarte de Metade de Cada Subarranjo em $O(1)$)</h4>
        <p>Queremos encontrar a mediana inferior de um total de $2n$ elementos, que é o <strong>$n$-ésimo menor elemento</strong> da união $X \\cup Y$. Mantemos dois subarranjos ativos $X[p_X \\dots r_X]$ e $Y[p_Y \\dots r_Y]$, ambos de mesmo tamanho $m$ (inicialmente $m = n$), de modo que a mediana procurada dos $2n$ elementos originais seja sempre a mediana inferior dos $2m$ elementos restantes.</p>
        <p>Em cada passo (se $m = 1$, a mediana inferior dos 2 elementos restantes é simplesmente $\\min(X[p_X], Y[p_Y])$):</p>
        <ol>
          <li>Calculamos em $O(1)$ a mediana inferior $m_X$ de $X[p_X \\dots r_X]$ e a mediana inferior $m_Y$ de $Y[p_Y \\dots r_Y]$.</li>
          <li><strong>Se $m_X == m_Y$:</strong> Então $m_X$ é a mediana exata dos $2m$ elementos; retornamos $m_X$ imediatamente!</li>
          <li><strong>Se $m_X < m_Y$:</strong> Então $m_X$ é menor que pelo menos a segunda metade de $X$ e a segunda metade de $Y$, logo a mediana global <strong>não pode estar na metade inferior de $X$</strong> nem na <strong>metade superior de $Y$</strong>! Descartamos exatamente $\\lfloor m/2 \\rfloor$ elementos do início de $X$ e o mesmo número $\\lfloor m/2 \\rfloor$ elementos do final de $Y$ (mantendo os tamanhos iguais e preservando a mediana do conjunto combinado!).</li>
          <li><strong>Se $m_X > m_Y$:</strong> Simetricamente, descartamos os $\\lfloor m/2 \\rfloor$ menores elementos de $Y$ e os $\\lfloor m/2 \\rfloor$ maiores elementos de $X$.</li>
        </ol>

        <h4>2. Abordagem Equivalente por Busca Binária Direta em $X[1 \\dots n]$</h4>
        <p>Alternativamente, se a mediana global $z$ está em $X[k]$, então existem $k - 1$ elementos em $X$ menores que $z$, logo devem existir exatamente $(n - 1) - (k - 1) = n - k$ elementos em $Y$ menores ou iguais a $z$. Isso ocorre se e somente se:</p>
        $$Y[n - k] \\le X[k] \\le Y[n - k + 1] \\quad (\\text{para } 1 \\le k < n, \\text{ ou } X[n] \\le Y[1] \\text{ para } k = n).$$
        <pre><code>TWO-ARRAY-MEDIAN(X, Y, n)
1  med = FIND-MEDIAN-IN-FIRST(X, Y, n, 1, n)
2  if med == NÃO-ENCONTRADO
3      med = FIND-MEDIAN-IN-FIRST(Y, X, n, 1, n)
4  return med

FIND-MEDIAN-IN-FIRST(A, B, n, low, high)
1  if low > high
2      return NÃO-ENCONTRADO
3  k = ⌊(low + high) / 2⌋
4  if k == n and A[n] ≤ B[1]
5      return A[n]
6  elseif k < n and B[n - k] ≤ A[k] and A[k] ≤ B[n - k + 1]
7      return A[k]
8  elseif A[k] > B[n - k + 1]
9      return FIND-MEDIAN-IN-FIRST(A, B, n, low, k - 1)
10 else return FIND-MEDIAN-IN-FIRST(A, B, n, k + 1, high)</code></pre>
        <p><strong>Complexidade:</strong> Em ambas as formulações, o tamanho da busca cai pela metade a cada passo com custo $O(1)$ por passo: $T(n) = T(n/2) + O(1) = \\mathbf{O(\\lg n)}$. $\\blacksquare$</p>
      `
    },
    {
      id: "ex6-8",
      code: "EXERCÍCIO 08 • PROBLEMA 9-1: OS i MAIORES NÚMEROS EM SEQUÊNCIA ORDENADA",
      reference: "Problema 9-1 (p. 193)",
      title: "Comparar as Três Estratégias Assintóticas para Encontrar os i Maiores Números em Ordem",
      prompt: `
        <p><strong>(Problema 9-1: Os $i$ maiores números em sequência ordenada)</strong> Dado um conjunto de $n$ números, queremos determinar os $i$ maiores em sequência ordenada usando um algoritmo baseado em comparação. Descubra o algoritmo que implementa cada um dos três métodos a seguir com o melhor tempo de execução assintótico do pior caso e analise os tempos de execução em termos de $n$ e $i$:</p>
        <ol>
          <li><strong>(a)</strong> Ordene todos os números e produza uma lista com os $i$ maiores.</li>
          <li><strong>(b)</strong> Construa uma fila de prioridade máxima (heap máximo) com os números e chame <code>EXTRACT-MAX</code> $i$ vezes.</li>
          <li><strong>(c)</strong> Use um algoritmo de estatística de ordem para determinar o $i$-ésimo maior número, particione em torno desse número e ordene os $i$ maiores números.</li>
        </ol>
      `,
      placeholder:
        "Analise o pior caso de (a) usando Merge-Sort/Heapsort, (b) usando BUILD-MAX-HEAP + i chamadas a HEAP-EXTRACT-MAX, e (c) usando SELECT + PARTITION + Merge-Sort sobre os i maiores...",
      solution: `
        <h4>Análise Completa dos Três Métodos no Pior Caso</h4>
        <ol>
          <li><strong>Método (a) — Ordenar tudo e extrair os $i$ últimos: $\\mathbf{\\Theta(n \\lg n)}$</strong>
            <ul>
              <li><em>Algoritmo:</em> Ordenamos o arranjo $A[1 \\dots n]$ usando <code>MERGE-SORT</code> ou <code>HEAPSORT</code> em tempo $\\Theta(n \\lg n)$ no pior caso (ótimo pelo Corolário 8.2) e depois copiamos o subarranjo final $A[n - i + 1 \\dots n]$ em tempo $\\Theta(i) = O(n)$.</li>
              <li><em>Tempo total do pior caso:</em> $\\Theta(n \\lg n) + \\Theta(i) = \\mathbf{\\Theta(n \\lg n)}$.</li>
            </ul>
          </li>
          <li><strong>Método (b) — Fila de Prioridade Máxima (Heap Máximo): $\\mathbf{O(n + i \\lg n)}$</strong>
            <ul>
              <li><em>Algoritmo:</em> Construímos um heap máximo sobre os $n$ elementos usando <code>BUILD-MAX-HEAP(A)</code>, que leva tempo linear $\\Theta(n)$ no pior caso (Seção 6.3). Em seguida, executamos $i$ vezes a operação <code>HEAP-EXTRACT-MAX(A)</code> (Seção 6.5), onde cada extração leva $O(\\lg n)$ no pior caso.</li>
              <li><em>Tempo total do pior caso:</em> $\\Theta(n) + i \\cdot O(\\lg n) = \\mathbf{O(n + i \\lg n)}$.</li>
            </ul>
          </li>
          <li><strong>Método (c) — Seleção Linear + Partição + Ordenação dos $i$ Maiores: $\\mathbf{O(n + i \\lg i)}$</strong>
            <ul>
              <li><em>Algoritmo:</em>
                <ol>
                  <li>Usamos o algoritmo determinístico <code>SELECT</code> da Seção 9.3 para encontrar o $i$-ésimo maior elemento (que equivale à $(n - i + 1)$-ésima estatística de ordem) em tempo $\\Theta(n)$ no pior caso.</li>
                  <li>Particionamos o arranjo de $n$ elementos em torno desse pivô usando <code>PARTITION</code> em tempo $\\Theta(n)$, isolando os $i$ maiores elementos nas últimas $i$ posições do arranjo.</li>
                  <li>Ordenamos apenas esses $i$ maiores elementos usando <code>MERGE-SORT</code> ou <code>HEAPSORT</code> em tempo $O(i \\lg i)$ no pior caso.</li>
                </ol>
              </li>
              <li><em>Tempo total do pior caso:</em> $\\Theta(n) + \\Theta(n) + O(i \\lg i) = \\mathbf{O(n + i \\lg i)}$.</li>
            </ul>
          </li>
        </ol>

        <h4>Comparação Assintótica Final</h4>
        <p>Como $i \\le n \\implies i \\lg i \\le i \\lg n \\le n \\lg n$, o <strong>Método (c) com $O(n + i \\lg i)$ é assintoticamente o mais rápido dos três</strong> no pior caso! Em particular, para qualquer $i = O(n / \\lg n)$, o Método (c) resolve o problema inteiro em <strong>tempo estritamente linear $\\Theta(n)$</strong>! $\\blacksquare$</p>
      `
    }
  ];

  if (typeof window !== "undefined" && typeof window.registerCodexModule === "function") {
    window.registerCodexModule(6, {
      revisao,
      unidades,
      initWorkbenches,
      quizzes,
      exercicios
    });
  }
})();
