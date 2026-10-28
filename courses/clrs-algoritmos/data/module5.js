/* ==========================================================================
   MÓDULO 05 — Ordenação no Lugar e Filas de Prioridades: Heapsort e Quicksort
   Capítulos 6 e 7 (pp. 131–165) — Thomas H. Cormen, Charles E. Leiserson,
   Ronald L. Rivest e Clifford Stein (Algoritmos: Teoria e Prática, 3ª Edição)
   ========================================================================== */

(function () {
  const module5Content = {
    /* ======================================================================
       SEÇÃO 1: REVISÃO DE PRÉ-REQUISITOS E ARQUITETURA DA PARTE II
       ====================================================================== */
    revisao: {
      subtitle:
        "Inauguração da Parte II (Ordenação e Estatísticas de Ordem): Ordenação no Lugar, Estruturas Implícitas e o Duelo entre Pior Caso Garantido e Eficiência Prática",
      intro:
        "Na Parte I (Módulos 1 a 4), conhecemos dois algoritmos fundamentais de ordenação: a Ordenação por Inserção (INSERTION-SORT), que ordena no lugar mas leva tempo Θ(n²) no pior caso e no caso médio, e a Ordenação por Intercalação (MERGE-SORT), que garante tempo assintoticamente ótimo Θ(n lg n) no pior caso mas exige memória auxiliar Θ(n) na sub-rotina MERGE. Ao inaugurar a Parte II nos Capítulos 6 e 7, Cormen, Leiserson, Rivest e Stein apresentam dois novos algoritmos clássicos — HEAPSORT e QUICKSORT — que reúnem o melhor desses mundos e introduzem técnicas estruturais e probabilísticas essenciais para toda a Ciência da Computação.",
      pillars: [
        {
          tag: "[ PILAR 01 • QUADRO COMPARATIVO DOS 4 ALGORITMOS ]",
          title: "INSERTION-SORT vs. MERGE-SORT vs. HEAPSORT vs. QUICKSORT",
          body: `
            <p>A tabela conceitual da Parte II sintetiza os trade-offs fundamentais entre os quatro algoritmos de ordenação baseados em comparações:</p>
            <div class="canonical-table-wrap">
              <table class="canonical-table">
                <thead>
                  <tr>
                    <th>Algoritmo</th>
                    <th>Tempo de Pior Caso</th>
                    <th>Tempo Caso Médio / Esperado</th>
                    <th>Ordena no Lugar (In-Place)?</th>
                    <th>Paradigma / Estrutura Central</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong><code>INSERTION-SORT</code></strong> (Cap. 2)</td>
                    <td>$\\Theta(n^2)$</td>
                    <td>$\\Theta(n^2)$</td>
                    <td><strong>Sim</strong> ($O(1)$ extra)</td>
                    <td>Incremental (inserção carta a carta)</td>
                  </tr>
                  <tr>
                    <td><strong><code>MERGE-SORT</code></strong> (Cap. 2)</td>
                    <td>$\\Theta(n \\lg n)$</td>
                    <td>$\\Theta(n \\lg n)$</td>
                    <td><strong>Não</strong> (requer $\\Theta(n)$ em $L$ e $R$)</td>
                    <td>Divisão e Conquista (foco em <code>MERGE</code>)</td>
                  </tr>
                  <tr>
                    <td><strong><code>HEAPSORT</code></strong> (Cap. 6)</td>
                    <td>$O(n \\lg n)$ (exato $\\Theta(n \\lg n)$)</td>
                    <td>$\\Theta(n \\lg n)$</td>
                    <td><strong>Sim</strong> ($O(1)$ variáveis extras)</td>
                    <td>Estrutura de Dados (Heap Binário em Arranjo)</td>
                  </tr>
                  <tr>
                    <td><strong><code>QUICKSORT</code></strong> (Cap. 7)</td>
                    <td>$\\Theta(n^2)$</td>
                    <td>$\\Theta(n \\lg n)$ <em>(fatores constantes mínimos)</em></td>
                    <td><strong>Sim</strong> (pilha recursiva $O(\\lg n)$ a $O(n)$)</td>
                    <td>Divisão e Conquista no lugar (foco em <code>PARTITION</code>)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>O <strong><code>HEAPSORT</code></strong> combina o tempo de execução $O(n \\lg n)$ do <code>MERGE-SORT</code> com a ordenação no lugar do <code>INSERTION-SORT</code>. Já o <strong><code>QUICKSORT</code></strong>, embora possua pior caso $\\Theta(n^2)$, supera o <code>HEAPSORT</code> na prática graças ao seu tempo esperado $\\Theta(n \\lg n)$ com constantes ocultas extremamente pequenas e excelente localidade de referência em arquiteturas com cache e memória virtual.</p>
          `
        },
        {
          tag: "[ PILAR 02 • ORDENAÇÃO NO LUGAR (IN-PLACE) ]",
          title: "O Significado Formal de Ordenar no Lugar e Chaves Satélites",
          body: `
            <p>Segundo a definição introduzida no Capítulo 2 (p. 17) e retomada na Parte II, um algoritmo de ordenação opera <strong>no lugar</strong> (<em>in-place</em>) se apenas um <strong>número constante de elementos</strong> do arranjo de entrada é armazenado fora do próprio arranjo em qualquer instante da execução.</p>
            <ul>
              <li>Os números que desejamos ordenar são chamados de <strong>chaves</strong>, mas na prática cada chave quase sempre vem acompanhada de <strong>dados satélites</strong> (registros completos de banco de dados, ponteiros para objetos de aplicação ou estruturas complexas).</li>
              <li>Quando trocamos dois elementos de posição em <code>MAX-HEAPIFY</code> ou em <code>PARTITION</code>, movemos o registro inteiro (ou os ponteiros para os registros) diretamente dentro de $A[1 \\dots n]$, sem alocar vetores temporários como $L[1 \\dots n_1 + 1]$ e $R[1 \\dots n_2 + 1]$.</li>
            </ul>
          `
        },
        {
          tag: "[ PILAR 03 • ÁRVORES BINÁRIAS IMPLÍCITAS EM ARRANJOS ]",
          title: "Representação de Árvores Quase Completas Sem Ponteiros Explícitos",
          body: `
            <p>Uma inovação conceitual introduzida pelo <code>HEAPSORT</code> no Capítulo 6 é o uso de uma <strong>estrutura de dados</strong> (o <em>heap</em> binário) para gerenciar informações durante a execução de um algoritmo de ordenação — e que, além disso, constitui uma excelente implementação de <strong>fila de prioridades</strong>.</p>
            <ul>
              <li>Em vez de alocar nós dinâmicos com três ponteiros (pai, filho esquerdo, filho direito), um heap binário é uma árvore binária <strong>quase completa</strong> (completamente preenchida em todos os níveis, exceto possivelmente no nível mais baixo, que é preenchido estritamente da esquerda para a direita) codificada <strong>implicitamente dentro de um simples arranjo 1-indexado $A[1 \\dots n]$</strong>.</li>
              <li>A navegação entre pais e filhos reduz-se a operações aritméticas elementares (ou deslocamentos de 1 bit nos registradores da CPU): $\\text{PARENT}(i) = \\lfloor i/2 \\rfloor$, $\\text{LEFT}(i) = 2i$ e $\\text{RIGHT}(i) = 2i + 1$.</li>
            </ul>
          `
        },
        {
          tag: "[ PILAR 04 • ANÁLISE PROBABILÍSTICA E VARIÁVEIS INDICADORAS ]",
          title: "Do Capítulo 5 para o Capítulo 7: Pior Caso vs. Tempo Esperado no Quicksort",
          body: `
            <p>Para analisar rigorosamente o <code>RANDOMIZED-QUICKSORT</code> na Seção 7.4.2, aplicaremos diretamente as ferramentas probabilísticas estudadas no Capítulo 5 (Módulo 4) e os somatórios do Apêndice A (Módulo 2):</p>
            <ul>
              <li><strong>Amostragem Aleatória do Pivô:</strong> Em vez de escolher sempre $A[r]$ como pivô, <code>RANDOMIZED-PARTITION(A, p, r)</code> sorteia $i = \\text{RANDOM}(p, r)$ uniformemente entre os $r - p + 1$ índices e troca $A[r] \\leftrightarrow A[i]$. Assim, <strong>nenhuma entrada específica</strong> (como um arranjo já ordenado) pode forçar o pior caso $\\Theta(n^2)$.</li>
              <li><strong>Variáveis Aleatórias Indicadoras (Lema 5.1):</strong> Definiremos $X_{ij} = \\text{I}\\{z_i \\text{ é comparado com } z_j\\}$, onde $z_1 < z_2 < \\dots < z_n$ são os elementos em ordem crescente, e usaremos a <strong>Linearidade da Esperança</strong> e a <strong>Série Harmônica</strong> $\\sum_{k=1}^{n} \\frac{1}{k} = \\ln n + O(1)$ para provar que o número esperado de comparações é $O(n \\lg n)$.</li>
            </ul>
          `
        }
      ],
      checklist: [
        "Compreendo a diferença entre os atributos A.comprimento (total de posições do arranjo) e A.tamanho-do-heap (quantos elementos pertencem atualmente ao heap ativo).",
        "Domino as fórmulas 1-indexadas PARENT(i) = ⌊i/2⌋, LEFT(i) = 2i e RIGHT(i) = 2i + 1 e sua implementação em 1 instrução via deslocamento de bits (shift).",
        "Lembro da soma da série aritmético-geométrica ∑_{k=0..∞} k·x^k = x/(1−x)², que para x = 1/2 vale exatamente ∑_{h=0..∞} h/2^h = (1/2)/(1/4) = 2.",
        "Compreendo o Método da Substituição (Seção 4.3) e o método da Árvore de Recursão (Seção 4.4) para analisar recorrências desbalanceadas como T(n) = T(9n/10) + T(n/10) + cn.",
        "Domino o Lema 5.1 das variáveis aleatórias indicadoras (E[X_A] = Pr{A}) e a limitação da Série Harmônica H_n = ∑_{k=1..n} (1/k) = Θ(lg n)."
      ]
    },

    /* ======================================================================
       SEÇÃO 2: UNIDADES DE APRENDIZADO (CAPÍTULOS 6 E 7 COMPLETOS, pp. 131–165)
       ====================================================================== */
    unidades: [
      /* ====================================================================
         UNIDADE 5.1 — CAPÍTULO 6, SEÇÕES 6.1 E 6.2 (pp. 131–137)
         ==================================================================== */
      {
        id: "u5-1",
        code: "UNIDADE 5.1 • CAP. 6 (SEÇÕES 6.1 E 6.2)",
        pages: "pp. 131–137",
        title: "Heaps Binários e a Manutenção da Propriedade de Heap (MAX-HEAPIFY)",
        content: `
          <h3>1. A Estrutura de Dados de Heap (Binário) e sua Representação em Arranjo (Seção 6.1)</h3>
          <p>A estrutura de dados de <strong>heap (binário)</strong> é um objeto de arranjo $A$ que podemos encarar como uma <strong>árvore binária quase completa</strong> (Figura 6.1 do livro). Cada nó da árvore corresponde a um elemento do arranjo. A árvore está completamente preenchida em todos os níveis, exceto possivelmente no nível mais baixo, que é preenchido a partir da esquerda até um determinado ponto.</p>
          <p>Um arranjo $A$ que representa um heap é um objeto com <strong>dois atributos</strong> fundamentais:</p>
          <ul>
            <li><strong>$A.\\text{comprimento}$ (<code>A.length</code>):</strong> fornece o número total de elementos no arranjo.</li>
            <li><strong>$A.\\text{tamanho-do-heap}$ (<code>A.heap-size</code>):</strong> representa quantos elementos no heap estão efetivamente armazenados dentro do arranjo $A$. Isto é, embora $A[1 \\dots A.\\text{comprimento}]$ possa conter números, somente os elementos em $A[1 \\dots A.\\text{tamanho-do-heap}]$, onde:
              $$0 \\le A.\\text{tamanho-do-heap} \\le A.\\text{comprimento},$$
              são elementos válidos do heap!</li>
          </ul>

          <h3>2. Navegação Pai-Filhos e Implementação por Deslocamento de Bits</h3>
          <p>A raiz da árvore é $A[1]$ e, dado o índice $i$ de um nó qualquer, podemos calcular facilmente os índices de seu pai, de seu filho esquerdo e de seu filho direito:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">PARENT(i), LEFT(i), RIGHT(i)</span>
              <span>[ CAPÍTULO 6.1 • NAVEGAÇÃO IMPLÍCITA EM ARRANJO 1-INDEXADO (p. 132) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="proc-name">PARENT</span>(i)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">return</span> ⌊i / 2⌋</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="proc-name">LEFT</span>(i)</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">return</span> 2i</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="proc-name">RIGHT</span>(i)</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">    <span class="kw">return</span> 2i + 1</span></div>
            </div>
          </div>

          <div class="canonical-callout note">
            <span class="callout-tag">[ IMPLEMENTAÇÃO EM HARDWARE • DESLOCAMENTO DE BITS E MACROS (p. 132) ]</span>
            <p>Na maioria dos computadores, esses três procedimentos são executados em uma única instrução de máquina operando sobre a representação binária do índice $i$:</p>
            <ul>
              <li><strong><code>LEFT(i)</code>:</strong> basta deslocar a representação binária de $i$ uma posição para a esquerda (<code>i &lt;&lt; 1</code>), o que multiplica por $2$.</li>
              <li><strong><code>RIGHT(i)</code>:</strong> basta deslocar a representação binária de $i$ uma posição para a esquerda e colocar um bit $1$ na posição de ordem mais baixa (<code>(i &lt;&lt; 1) | 1</code>).</li>
              <li><strong><code>PARENT(i)</code>:</strong> basta deslocar $i$ uma posição para a direita (<code>i &gt;&gt; 1</code>), calculando $\\lfloor i/2 \\rfloor$.</li>
            </ul>
            <p>Por isso, boas implementações de <code>HEAPSORT</code> definem esses três procedimentos como <strong>macros</strong> ou procedimentos <strong>em linha (<em>inline</em>)</strong>.</p>
          </div>

          <h3>3. Propriedade de Heap de Máximo vs. Heap de Mínimo e Altura $\\Theta(\\lg n)$</h3>
          <p>Existem dois tipos de heaps binários, cujos valores nos nós satisfazem uma <strong>propriedade de heap</strong>:</p>
          <ol>
            <li><strong>Heap de Máximo (<em>Max-Heap</em>):</strong> A <strong>propriedade de heap de máximo</strong> estabelece que, para todo nó $i$ diferente da raiz ($i > 1$):
              $$A[\\text{PARENT}(i)] \\ge A[i].$$
              Isto é, o valor de um nó é, no máximo, o valor de seu pai. Assim, por indução ao longo do caminho até a raiz (Exercício 6.1-3), <strong>o maior elemento em um heap de máximo está armazenado na raiz $A[1]$</strong>, e a subárvore enraizada em qualquer nó não contém valores maiores que o próprio nó. Usamos heaps de máximo para o algoritmo <strong><code>HEAPSORT</code></strong>.</li>
            <li><strong>Heap de Mínimo (<em>Min-Heap</em>):</strong> A <strong>propriedade de heap de mínimo</strong> estabelece que, para todo nó $i$ diferente da raiz ($i > 1$):
              $$A[\\text{PARENT}(i)] \\le A[i].$$
              O menor elemento de um heap de mínimo reside na raiz $A[1]$. Heaps de mínimo são amplamente utilizados para implementar filas de prioridade mínima (como nos algoritmos de Prim e Dijkstra, Capítulos 23 e 24).</li>
          </ol>
          <p><strong>Altura de um Nó e Altura do Heap:</strong> Definimos a <strong>altura de um nó</strong> em um heap como o número de arestas no <em>caminho descendente simples mais longo</em> que vai desse nó até uma folha; e definimos a <strong>altura do heap</strong> como a altura de sua raiz. Como um heap de $n$ elementos baseia-se em uma árvore binária completa ou quase completa, sua altura é exatamente $\\lfloor \\lg n \\rfloor = \\Theta(\\lg n)$ (Exercício 6.1-2). Veremos que as operações básicas em heaps são executadas em tempo proporcional à altura da árvore e, portanto, demoram tempo <strong>$O(\\lg n)$</strong>.</p>

          <h3>4. Manutenção da Propriedade de Heap: O Procedimento <code>MAX-HEAPIFY(A, i)</code> (Seção 6.2)</h3>
          <p>Para manter a propriedade de heap de máximo, utilizamos a sub-rotina fundamental <code>MAX-HEAPIFY(A, i)</code>. Quando chamado, <code>MAX-HEAPIFY</code> pressupõe como <strong>pré-condição</strong> que as árvores binárias enraizadas em $\\text{LEFT}(i)$ e $\\text{RIGHT}(i)$ <strong>já são heaps de máximo</strong>, mas que $A[i]$ pode ser menor que seus filhos, violando a propriedade de heap de máximo na posição $i$. O procedimento permite que o valor em $A[i]$ <strong>"flutue para baixo"</strong> (<em>float down</em>) no heap de máximo, de modo que a subárvore inteira enraizada no índice $i$ passe a obedecer à propriedade de heap de máximo:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">MAX-HEAPIFY(A, i)</span>
              <span>[ CAPÍTULO 6.2 • MANUTENÇÃO DO HEAP DE MÁXIMO EM O(lg n) (p. 134) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">l = LEFT(i)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">r = RIGHT(i)</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">if</span> l ≤ A.tamanho-do-heap <span class="kw">e</span> A[l] &gt; A[i]</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    maior = l</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">else</span> maior = i</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">if</span> r ≤ A.tamanho-do-heap <span class="kw">e</span> A[r] &gt; A[maior]</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    maior = r</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content"><span class="kw">if</span> maior ≠ i</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">    troque A[i] com A[maior]</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">    MAX-HEAPIFY(A, maior)</span></div>
            </div>
          </div>

          <p><strong>Rastreamento Canônico da Figura 6.2 (p. 135):</strong> Considere o arranjo $A = \\langle 16, 4, 10, 14, 7, 9, 3, 2, 8, 1 \\rangle$ com $A.\\text{tamanho-do-heap} = 10$, onde o nó $i = 2$ ($A[2] = 4$) viola a propriedade porque seus filhos são $A[4] = 14$ e $A[5] = 7$. Ao chamar <code>MAX-HEAPIFY(A, 2)</code>:</p>
          <ol>
            <li>Entre $A[2] = 4$, $A[4] = 14$ e $A[5] = 7$, o maior valor está em $\\text{maior} = 4$ ($A[4] = 14$). Trocamos $A[2] \\leftrightarrow A[4]$ (agora $A[2] = 14$ e $A[4] = 4$) e fazemos a chamada recursiva <code>MAX-HEAPIFY(A, 4)</code>.</li>
            <li>No nó $i = 4$ ($A[4] = 4$), os filhos são $A[8] = 2$ e $A[9] = 8$. O maior entre eles está em $\\text{maior} = 9$ ($A[9] = 8$). Trocamos $A[4] \\leftrightarrow A[9]$ (agora $A[4] = 8$ e $A[9] = 4$) e chamamos <code>MAX-HEAPIFY(A, 9)</code>.</li>
            <li>No nó $i = 9$ ($A[9] = 4$), $l = 18 > 10$ e $r = 19 > 10$ (é uma folha), logo $\\text{maior} = 9 = i$ e a recursão termina!</li>
          </ol>

          <div class="canonical-callout theorem">
            <span class="callout-tag">[ ANÁLISE DA RECORRÊNCIA DE MAX-HEAPIFY • POR QUE NO MÁXIMO 2n/3? (pp. 135–136) ]</span>
            <p>O tempo de execução de <code>MAX-HEAPIFY</code> em uma subárvore de tamanho $n$ enraizada no nó $i$ compõe-se do tempo $\\Theta(1)$ para corrigir as relações locais entre $A[i]$, $A[\\text{LEFT}(i)]$ e $A[\\text{RIGHT}(i)]$ (linhas 1–9), mais o tempo para executar <code>MAX-HEAPIFY</code> recursivamente em uma das subárvores filhas.</p>
            <p><strong>Qual é o tamanho máximo de uma subárvore filha de uma árvore quase completa de $n$ nós?</strong> O pior desequilíbrio entre a subárvore esquerda e a subárvore direita ocorre exatamente quando <strong>a última linha da árvore está exatamente metade cheia</strong> (isto é, todas as folhas do último nível estão na subárvore esquerda, e a subárvore direita tem uma altura a menos). Se a subárvore direita é uma árvore binária completa de altura $h-1$, ela contém $2^h - 1$ nós; nesse instante, a subárvore esquerda possui uma linha adicional completa com $2^h$ folhas, totalizando $(2^h - 1) + 2^h = 2^{h+1} - 1$ nós. Como o total de nós da árvore inteira (incluindo a raiz) é $n = 1 + (2^{h+1} - 1) + (2^h - 1) = 3 \\cdot 2^h - 1$, a fração de nós na subárvore esquerda é:</p>
            $$\\frac{2^{h+1} - 1}{3 \\cdot 2^h - 1} = \\frac{2 \\cdot 2^h - 1}{3 \\cdot 2^h - 1} < \\frac{2}{3} \\implies \\text{tamanho da subárvore filha} \\le \\frac{2n}{3}.$$
            <p>Portanto, o tempo de execução de <code>MAX-HEAPIFY</code> é limitado pela recorrência:</p>
            $$T(n) \\le T(2n/3) + \\Theta(1).$$
            <p>Pelo <strong>Caso 2 do Teorema Mestre</strong> (Teorema 4.1, com $a = 1$, $b = 3/2$, $n^{\\log_{3/2} 1} = n^0 = 1$ e $f(n) = \\Theta(1)$), a solução é <strong>$T(n) = O(\\lg n)$</strong>. Equivalentemente, para um nó situado à altura $h$, o tempo é <strong>$O(h)$</strong>.</p>
          </div>

          <div id="workbench-mod5-mount"></div>
        `
      },

      /* ====================================================================
         UNIDADE 5.2 — CAPÍTULO 6, SEÇÕES 6.3 E 6.4 (pp. 137–142)
         ==================================================================== */
      {
        id: "u5-2",
        code: "UNIDADE 5.2 • CAP. 6 (SEÇÕES 6.3 E 6.4)",
        pages: "pp. 137–142",
        title: "Construindo um Heap em Tempo Linear (BUILD-MAX-HEAP) e o Algoritmo HEAPSORT",
        content: `
          <h3>1. Construção de um Heap de Baixo para Cima: <code>BUILD-MAX-HEAP(A)</code> (Seção 6.3)</h3>
          <p>Podemos usar o procedimento <code>MAX-HEAPIFY</code> de baixo para cima (<em>bottom-up</em>) para converter um arranjo arbitrário $A[1 \\dots n]$, onde $n = A.\\text{comprimento}$, em um heap de máximo. Primeiro, observe uma propriedade estrutural crucial (demonstrada no Exercício 6.1-7): os elementos no subarranjo $A[(\\lfloor n/2 \\rfloor + 1) \\dots n]$ <strong>são todos folhas da árvore</strong> (pois para qualquer $i \\ge \\lfloor n/2 \\rfloor + 1$, seu filho esquerdo seria $\\text{LEFT}(i) = 2i \\ge 2(\\lfloor n/2 \\rfloor + 1) > n$). Consequentemente, cada um desses nós já é, trivialmente, um heap de máximo de $1$ elemento! O procedimento <code>BUILD-MAX-HEAP</code> percorre apenas os nós internos restantes, de $\\lfloor n/2 \\rfloor$ descendo até $1$, e executa <code>MAX-HEAPIFY</code> sobre cada um:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">BUILD-MAX-HEAP(A)</span>
              <span>[ CAPÍTULO 6.3 • CONSTRUÇÃO DE HEAP EM TEMPO LINEAR O(n) (p. 137) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">A.tamanho-do-heap = A.comprimento</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">for</span> i = ⌊A.comprimento / 2⌋ <span class="kw">downto</span> 1</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    MAX-HEAPIFY(A, i)</span></div>
            </div>
          </div>

          <div class="canonical-callout invariant">
            <span class="callout-tag">[ INVARIANTE DE LAÇO • PROCEDIMENTO BUILD-MAX-HEAP (pp. 137–138) ]</span>
            <p><strong>Enunciado do Invariante:</strong> <em>"No começo de cada iteração do laço <code>for</code> das linhas 2–3, cada nó $i + 1, i + 2, \\dots, n$ é a raiz de um heap de máximo."</em></p>
            <div class="invariant-triad">
              <div class="triad-card">
                <div class="triad-card-title">1. Inicialização</div>
                <p>Antes da primeira iteração do laço, $i = \\lfloor n/2 \\rfloor$. Cada nó $\\lfloor n/2 \\rfloor + 1, \\lfloor n/2 \\rfloor + 2, \\dots, n$ é uma folha e é, portanto, a raiz de um heap de máximo trivial (de 1 elemento).</p>
              </div>
              <div class="triad-card">
                <div class="triad-card-title">2. Manutenção</div>
                <p>Para ver que cada iteração mantém o invariante, observe que os filhos do nó $i$ ($\\text{LEFT}(i) = 2i$ e $\\text{RIGHT}(i) = 2i + 1$) são numerados com índices estritamente maiores que $i$. Assim, pelo invariante de laço, ambos já são raízes de heaps de máximo! Essa é precisamente a pré-condição exigida para que a chamada <code>MAX-HEAPIFY(A, i)</code> torne o nó $i$ a raiz de um heap de máximo, preservando também que os nós $i+1, \\dots, n$ continuam sendo raízes de heaps de máximo. Decrementar $i$ restabelece o invariante para a próxima iteração.</p>
              </div>
              <div class="triad-card">
                <div class="triad-card-title">3. Término</div>
                <p>No término do laço, $i = 0$. Pelo invariante de laço, cada nó $1, 2, \\dots, n$ é a raiz de um heap de máximo. Em particular, o nó $1$ é a raiz de um heap de máximo que contém todos os $n$ elementos!</p>
              </div>
            </div>
          </div>

          <h3>2. Demonstração Completa do Limite Linear $O(n)$ de <code>BUILD-MAX-HEAP</code></h3>
          <p>Um limite superior simples (porém frouxo) observaria que há $O(n)$ chamadas a <code>MAX-HEAPIFY</code>, cada uma custando $O(\\lg n)$, o que daria $O(n \\lg n)$. No entanto, podemos demonstrar um <strong>limite assintoticamente restrito de $O(n)$ (tempo linear!)</strong> observando que o tempo de <code>MAX-HEAPIFY</code> em um nó é proporcional à altura $h$ daquele nó, e a imensa maioria dos nós de uma árvore binária quase completa possui alturas muito pequenas!</p>

          <div class="canonical-callout theorem">
            <span class="callout-tag">[ TEOREMA • ANÁLISE ASSINTOTICAMENTE RESTRITA DE BUILD-MAX-HEAP EM O(n) (pp. 138–139) ]</span>
            <p>Nossa análise apoia-se em duas propriedades fundamentais de um heap de $n$ elementos:</p>
            <ol>
              <li>Um heap de $n$ elementos tem altura $\\lfloor \\lg n \\rfloor$ (Exercício 6.1-2);</li>
              <li>Existem, no máximo, <strong>$\\left\\lceil \\frac{n}{2^{h+1}} \\right\\rceil$ nós de qualquer altura $h$</strong> (Exercício 6.3-3). (Por exemplo, para $h = 0$, há no máximo $\\lceil n/2 \\rceil$ folhas; para $h = 1$, há no máximo $\\lceil n/4 \\rceil$ nós de altura $1$, e assim por diante).</li>
            </ol>
            <p>Como o tempo exigido por <code>MAX-HEAPIFY</code> quando chamado sobre um nó de altura $h$ é $O(h)$, podemos expressar o custo total de <code>BUILD-MAX-HEAP</code> como sendo limitado superiormente por:</p>
            $$\\sum_{h=0}^{\\lfloor \\lg n \\rfloor} \\left\\lceil \\frac{n}{2^{h+1}} \\right\\rceil O(h) = O\\left(n \\sum_{h=0}^{\\lfloor \\lg n \\rfloor} \\frac{h}{2^h}\\right).$$
            <p>Avaliamos o último somatório substituindo $x = 1/2$ na fórmula da série aritmético-geométrica infinita (Equação A.8 do Apêndice A: $\\sum_{k=0}^{\\infty} k x^k = \\frac{x}{(1 - x)^2}$ para $|x| < 1$):</p>
            $$\\sum_{h=0}^{\\infty} \\frac{h}{2^h} = \\frac{1/2}{(1 - 1/2)^2} = \\frac{1/2}{1/4} = 2.$$
            <p>Portanto, podemos limitar o tempo de execução de <code>BUILD-MAX-HEAP</code> como:</p>
            $$O\\left(n \\sum_{h=0}^{\\lfloor \\lg n \\rfloor} \\frac{h}{2^h}\\right) = O\\left(n \\sum_{h=0}^{\\infty} \\frac{h}{2^h}\\right) = O(2n) = \\mathbf{O(n)}.$$
            <p>Assim, podemos construir um heap de máximo (ou um heap de mínimo, via <code>BUILD-MIN-HEAP</code>) a partir de um arranjo desordenado em <strong>tempo linear</strong>!</p>
          </div>

          <h3>3. O Algoritmo de Ordenação por Heap: <code>HEAPSORT(A)</code> (Seção 6.4)</h3>
          <p>O algoritmo de ordenação por heap começa usando <code>BUILD-MAX-HEAP(A)</code> para construir um heap de máximo sobre o arranjo de entrada $A[1 \\dots n]$, onde $n = A.\\text{comprimento}$. Como o elemento máximo do arranjo está garantidamente armazenado na raiz $A[1]$, podemos colocá-lo em sua posição final correta trocando-o por $A[n]$. Se agora "descartarmos" o nó $n$ do heap — o que fazemos simplesmente decrementando $A.\\text{tamanho-do-heap}$ em $1$ unidade —, observamos que os filhos da raiz continuam sendo heaps de máximo, embora a nova raiz possa violar a propriedade de heap de máximo. Para restaurar a propriedade de heap de máximo em $A[1 \\dots n-1]$, basta chamar <code>MAX-HEAPIFY(A, 1)</code>! O algoritmo repete esse processo desde o heap de tamanho $n-1$ até um heap de tamanho $2$:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">HEAPSORT(A)</span>
              <span>[ CAPÍTULO 6.4 • ORDENAÇÃO POR HEAP NO LUGAR EM O(n lg n) (p. 140) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">BUILD-MAX-HEAP(A)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">for</span> i = A.comprimento <span class="kw">downto</span> 2</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    troque A[1] com A[i]</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    A.tamanho-do-heap = A.tamanho-do-heap - 1</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    MAX-HEAPIFY(A, 1)</span></div>
            </div>
          </div>

          <div class="canonical-callout invariant">
            <span class="callout-tag">[ INVARIANTE DE LAÇO • PROCEDIMENTO HEAPSORT (Exercício 6.4-2, p. 140) ]</span>
            <p><strong>Enunciado do Invariante:</strong> <em>"No início de cada iteração do laço <code>for</code> das linhas 2–5, o subarranjo $A[1 \\dots i]$ é um heap de máximo que contém os $i$ menores elementos de $A[1 \\dots n]$, e o subarranjo $A[i + 1 \\dots n]$ contém os $n - i$ maiores elementos de $A[1 \\dots n]$, ordenados."</em></p>
            <ul>
              <li><strong>Inicialização ($i = n$):</strong> Após a linha 1 (<code>BUILD-MAX-HEAP</code>), $A[1 \\dots n]$ é um heap de máximo contendo os $n$ menores elementos de $A[1 \\dots n]$, e $A[n+1 \\dots n]$ está vazio (contém $0$ maiores elementos ordenados).</li>
              <li><strong>Manutenção:</strong> Como $A[1 \\dots i]$ é um heap de máximo com os $i$ menores elementos, sua raiz $A[1]$ é o maior entre os $i$ menores elementos (portanto, o $i$-ésimo menor elemento global). Trocá-lo para $A[i]$ (linha 3) coloca-o exatamente à esquerda de $A[i+1 \\dots n]$, tornando $A[i \\dots n]$ ordenado com os $n - i + 1$ maiores elementos. Decrementar $A.\\text{tamanho-do-heap}$ para $i - 1$ (linha 4) e chamar <code>MAX-HEAPIFY(A, 1)</code> (linha 5) transforma $A[1 \\dots i-1]$ em um heap de máximo contendo os $i - 1$ menores elementos.</li>
              <li><strong>Término ($i = 1$):</strong> Quando o laço termina, $i = 1$: $A[1]$ contém o menor elemento e $A[2 \\dots n]$ contém os $n - 1$ maiores elementos ordenados — logo, todo o arranjo $A[1 \\dots n]$ está ordenado!</li>
            </ul>
            <p><strong>Complexidade de <code>HEAPSORT</code>:</strong> A chamada <code>BUILD-MAX-HEAP</code> na linha 1 leva tempo $O(n)$, e cada uma das $n - 1$ chamadas a <code>MAX-HEAPIFY(A, 1)</code> na linha 5 leva tempo $O(\\lg n)$. Portanto, o tempo total de <code>HEAPSORT</code> é <strong>$O(n \\lg n)$</strong> (e, tanto no pior caso quanto no melhor caso com elementos distintos, é exatamente $\\Theta(n \\lg n)$, conforme Exercícios 6.4-4 e 6.4-5).</p>
          </div>
        `
      },

      /* ====================================================================
         UNIDADE 5.3 — CAPÍTULO 6, SEÇÃO 6.5 (pp. 142–147)
         ==================================================================== */
      {
        id: "u5-3",
        code: "UNIDADE 5.3 • CAP. 6 (SEÇÃO 6.5)",
        pages: "pp. 142–147",
        title: "Filas de Prioridades: HEAP-MAXIMUM, HEAP-EXTRACT-MAX, HEAP-INCREASE-KEY e MAX-HEAP-INSERT",
        content: `
          <h3>1. O Tipo Abstrato de Dados Fila de Prioridades e Suas Aplicações (Seção 6.5)</h3>
          <p>Embora uma boa implementação de <code>QUICKSORT</code> normalmente supere o <code>HEAPSORT</code> na prática para ordenação pura, a estrutura de dados de <strong>heap</strong> tem uma utilidade monumental por si só: implementar uma <strong>fila de prioridades</strong> eficiente.</p>
          <p>Uma <strong>fila de prioridades</strong> é uma estrutura de dados para manter um conjunto dinâmico $S$ de elementos, cada qual com um valor associado denominado <strong>chave</strong>. Uma <strong>fila de prioridade máxima</strong> suporta quatro operações fundamentais:</p>
          <ul>
            <li><code>INSERT(S, x)</code>: insere o elemento $x$ no conjunto $S$, o que equivale a $S = S \\cup \\{x\\}$.</li>
            <li><code>MAXIMUM(S)</code>: devolve o elemento de $S$ que possui a maior chave.</li>
            <li><code>EXTRACT-MAX(S)</code>: remove e devolve o elemento de $S$ que possui a maior chave.</li>
            <li><code>INCREASE-KEY(S, x, k)</code>: aumenta o valor da chave do elemento $x$ para o novo valor $k$, onde se assume que $k$ é pelo menos tão grande quanto o valor da chave atual de $x$.</li>
          </ul>

          <div class="canonical-callout analogy">
            <span class="callout-tag">[ APLICAÇÕES REAIS • ESCALONAMENTO DE TAREFAS E SIMULADORES DE EVENTOS (p. 143) ]</span>
            <ul>
              <li><strong>Escalonador de Trabalhos em Sistema Operacional (Fila de Prioridade Máxima):</strong> Mantém os processos prontos para execução e suas prioridades relativas. Quando um processo termina ou sofre preempção (<em>time slice</em> expirado), o sistema operacional seleciona o processo de prioridade mais alta chamando <code>EXTRACT-MAX</code>, e novos processos entram chamando <code>INSERT</code> (ou ganham bônus de prioridade via <code>INCREASE-KEY</code> para evitar <em>starvation</em>).</li>
              <li><strong>Simulador Orientado a Eventos Discretos (Fila de Prioridade Mínima):</strong> Suporta <code>INSERT</code>, <code>MINIMUM</code>, <code>EXTRACT-MIN</code> e <code>DECREASE-KEY</code>. Os itens na fila são eventos futuros cuja chave é o <em>instante de ocorrência (timestamp)</em>. Como a simulação de um evento no tempo $t$ pode disparar outros eventos em $t' > t$, o simulador chama repetidamente <code>EXTRACT-MIN</code> para processar o próximo evento cronológico e <code>INSERT</code> para agendar novos eventos.</li>
              <li><strong>Descritores Bidirecionais (Handles):</strong> Na prática, cada elemento do heap armazena um ponteiro/descritor para o objeto da aplicação, e cada objeto da aplicação armazena o índice atual $i$ de seu elemento no arranjo do heap (atualizado sempre que dois elementos do heap trocam de posição).</li>
            </ul>
          </div>

          <h3>2. Implementação de <code>HEAP-MAXIMUM</code> ($\Theta(1)$) e <code>HEAP-EXTRACT-MAX</code> ($O(\\lg n)$)</h3>
          <p>O procedimento <code>HEAP-MAXIMUM</code> lê diretamente a raiz em tempo constante $\\Theta(1)$, enquanto <code>HEAP-EXTRACT-MAX</code> funciona exatamente como uma iteração do laço do <code>HEAPSORT</code>: guarda $A[1]$, move o último elemento $A[A.\\text{tamanho-do-heap}]$ para a raiz $A[1]$, decrementa o tamanho do heap e chama <code>MAX-HEAPIFY(A, 1)</code>:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">HEAP-MAXIMUM(A) &amp; HEAP-EXTRACT-MAX(A)</span>
              <span>[ CAPÍTULO 6.5 • CONSULTA EM Θ(1) E EXTRAÇÃO DO MÁXIMO EM O(lg n) (p. 143) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="proc-name">HEAP-MAXIMUM</span>(A)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">return</span> A[1]</span></div>
              <div class="code-line"><span class="line-num">&nbsp;</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="proc-name">HEAP-EXTRACT-MAX</span>(A)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">if</span> A.tamanho-do-heap &lt; 1</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">        <span class="kw">error</span> "heap underflow"</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    max = A[1]</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    A[1] = A[A.tamanho-do-heap]</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">    A.tamanho-do-heap = A.tamanho-do-heap - 1</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    MAX-HEAPIFY(A, 1)</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">    <span class="kw">return</span> max</span></div>
            </div>
          </div>

          <p><strong>Complexidade de <code>HEAP-EXTRACT-MAX</code>:</strong> Executa apenas $\\Theta(1)$ operações de custo constante além da chamada a <code>MAX-HEAPIFY(A, 1)</code> na linha 7, totalizando tempo <strong>$O(\\lg n)$</strong>.</p>

          <h3>3. Aumento de Chave e Inserção: <code>HEAP-INCREASE-KEY</code> e <code>MAX-HEAP-INSERT</code> ($O(\\lg n)$)</h3>
          <p>No procedimento <code>HEAP-INCREASE-KEY(A, i, chave)</code>, atualizar $A[i] = \\text{chave}$ (com $\\text{chave} \\ge A[i]$) não viola a propriedade em relação aos <em>filhos</em> de $i$ (pois $A[i]$ só ficou maior!), mas pode violar a propriedade em relação ao <strong>pai $\\text{PARENT}(i)$</strong>. Por isso, o algoritmo percorre um <strong>caminho ascendente simples desde o nó $i$ até a raiz</strong>, comparando repetidamente o nó com seu pai e trocando-os enquanto $i > 1$ e $A[\\text{PARENT}(i)] < A[i]$. Já <code>MAX-HEAP-INSERT(A, chave)</code> expande o heap adicionando uma nova folha com chave sentinela $-\\infty$ e em seguida invoca <code>HEAP-INCREASE-KEY</code> para promovê-la ao seu lugar correto:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">HEAP-INCREASE-KEY(A, i, chave) &amp; MAX-HEAP-INSERT(A, chave)</span>
              <span>[ CAPÍTULO 6.5 • SUBIDA NO HEAP E INSERÇÃO EM O(lg n) (p. 144) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="proc-name">HEAP-INCREASE-KEY</span>(A, i, chave)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">if</span> chave &lt; A[i]</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">        <span class="kw">error</span> "nova chave é menor que a chave atual"</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    A[i] = chave</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">while</span> i &gt; 1 <span class="kw">e</span> A[PARENT(i)] &lt; A[i]</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">        troque A[i] com A[PARENT(i)]</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">        i = PARENT(i)</span></div>
              <div class="code-line"><span class="line-num">&nbsp;</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="proc-name">MAX-HEAP-INSERT</span>(A, chave)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    A.tamanho-do-heap = A.tamanho-do-heap + 1</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    A[A.tamanho-do-heap] = -∞</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    HEAP-INCREASE-KEY(A, A.tamanho-do-heap, chave)</span></div>
            </div>
          </div>

          <div class="canonical-callout invariant">
            <span class="callout-tag">[ INVARIANTE DE LAÇO • HEAP-INCREASE-KEY (Exercício 6.5-5, p. 145) ]</span>
            <p><strong>Enunciado do Invariante:</strong> <em>"No início de cada iteração do laço <code>while</code> das linhas 5–7 de <code>HEAP-INCREASE-KEY</code>, o subarranjo $A[1 \\dots A.\\text{tamanho-do-heap}]$ satisfaz a propriedade de heap de máximo em toda parte, exceto que pode haver uma única violação: $A[i]$ pode ser maior que $A[\\text{PARENT}(i)]$."</em></p>
            <p>Como o caminho traçado desde o nó atualizado na linha 4 até a raiz tem comprimento limitado pela altura da árvore $O(\\lg n)$, tanto <code>HEAP-INCREASE-KEY</code> quanto <code>MAX-HEAP-INSERT</code> executam em tempo <strong>$O(\\lg n)$</strong>. (Dica de engenharia do Exercício 6.5-6: podemos substituir a troca completa de 3 atribuições na linha 6 pela ideia do laço interno do <code>INSERTION-SORT</code>, guardando $\\text{chave}$ em uma variável e apenas deslocando $A[i] = A[\\text{PARENT}(i)]$ em cada passo até gravar $\\text{chave}$ uma única vez ao final!)</p>
          </div>
        `
      },

      /* ====================================================================
         UNIDADE 5.4 — CAPÍTULO 7, SEÇÕES 7.1 E 7.2 (pp. 148–154)
         ==================================================================== */
      {
        id: "u5-4",
        code: "UNIDADE 5.4 • CAP. 7 (SEÇÕES 7.1 E 7.2)",
        pages: "pp. 148–154",
        title: "Descrição do Quicksort, PARTITION de Lomuto e Desempenho do Quicksort",
        content: `
          <h3>1. O Paradigma de Divisão e Conquista no Quicksort (Seção 7.1)</h3>
          <p>Assim como a ordenação por intercalação (<code>MERGE-SORT</code>), o <strong><code>QUICKSORT</code></strong> aplica o paradigma de divisão e conquista para ordenar um subarranjo típico $A[p \\dots r]$. No entanto, enquanto o <code>MERGE-SORT</code> faz uma divisão trivial e concentra todo o trabalho pesado na etapa de combinação (<code>MERGE</code>), o <code>QUICKSORT</code> <strong>inverte essa lógica</strong>: faz todo o trabalho pesado na etapa de <strong>divisão</strong> (no lugar!) e não requer trabalho algum na combinação:</p>
          <ul>
            <li><strong>Divisão:</strong> Particionar (reorganizar) o arranjo $A[p \\dots r]$ em dois subarranjos (possivelmente vazios) $A[p \\dots q - 1]$ e $A[q + 1 \\dots r]$ tais que cada elemento de $A[p \\dots q - 1]$ é <strong>menor ou igual</strong> a $A[q]$, que, por sua vez, é <strong>menor ou igual</strong> a cada elemento de $A[q + 1 \\dots r]$. Calcular o índice $q$ como parte desse procedimento de particionamento.</li>
            <li><strong>Conquista:</strong> Ordenar os dois subarranjos $A[p \\dots q - 1]$ e $A[q + 1 \\dots r]$ por chamadas recursivas a <code>QUICKSORT</code>.</li>
            <li><strong>Combinação:</strong> Como os subarranjos são ordenados no próprio lugar em torno de $A[q]$, <strong>não é necessário nenhum trabalho para combiná-los</strong>: o subarranjo $A[p \\dots r]$ inteiro já está ordenado!</li>
          </ul>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">QUICKSORT(A, p, r) &amp; PARTITION(A, p, r)</span>
              <span>[ CAPÍTULO 7.1 • PARTIÇÃO DE LOMUTO NO LUGAR EM Θ(n) (pp. 148–149) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="proc-name">QUICKSORT</span>(A, p, r)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">if</span> p &lt; r</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">        q = PARTITION(A, p, r)</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">        QUICKSORT(A, p, q - 1)</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">        QUICKSORT(A, q + 1, r)</span></div>
              <div class="code-line"><span class="line-num">&nbsp;</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="proc-name">PARTITION</span>(A, p, r)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    x = A[r]</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    i = p - 1</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">for</span> j = p <span class="kw">to</span> r - 1</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">        <span class="kw">if</span> A[j] ≤ x</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">            i = i + 1</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">            troque A[i] com A[j]</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">    troque A[i + 1] com A[r]</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">    <span class="kw">return</span> i + 1</span></div>
            </div>
          </div>

          <h3>2. Demonstração Completa do Invariante das 4 Regiões de <code>PARTITION</code></h3>
          <p>O procedimento <code>PARTITION</code> (devido a N. Lomuto) sempre seleciona o último elemento $x = A[r]$ como <strong>pivô</strong> e reparte o subarranjo $A[p \\dots r]$ em <strong>quatro regiões</strong> (possivelmente vazias), ilustradas na Figura 7.2 do livro:</p>
          <ol>
            <li><strong>Região 1 ($A[p \\dots i]$):</strong> todos os elementos já examinados que são $\\le x$;</li>
            <li><strong>Região 2 ($A[i + 1 \\dots j - 1]$):</strong> todos os elementos já examinados que são $> x$;</li>
            <li><strong>Região 3 ($A[j \\dots r - 1]$):</strong> elementos ainda não examinados (irrestritos);</li>
            <li><strong>Região 4 ($A[r]$):</strong> o próprio pivô $x$.</li>
          </ol>

          <div class="canonical-callout invariant">
            <span class="callout-tag">[ INVARIANTE DE LAÇO • PROCEDIMENTO PARTITION (pp. 149–150) ]</span>
            <p><strong>Enunciado do Invariante:</strong> <em>"No início de cada iteração do laço <code>for</code> nas linhas 4–7 de <code>PARTITION</code>, para qualquer índice de arranjo $k$:</em></p>
            <ol>
              <li><em>Se $p \\le k \\le i$, então $A[k] \\le x$.</em></li>
              <li><em>Se $i + 1 \\le k \\le j - 1$, então $A[k] > x$.</em></li>
              <li><em>Se $k = r$, então $A[k] = x$."</em></li>
            </ol>
            <p><em>(Os índices entre $j$ e $r - 1$ não são cobertos por nenhum dos três casos, pois ainda não têm relação conhecida com o pivô $x$.)</em></p>
            <div class="invariant-triad">
              <div class="triad-card">
                <div class="triad-card-title">1. Inicialização</div>
                <p>Antes da primeira iteração do laço, $i = p - 1$ e $j = p$. Como não existem valores entre $p$ e $i = p - 1$, nem valores entre $i + 1 = p$ e $j - 1 = p - 1$, as duas primeiras condições do invariante são <strong>satisfeitas por vacuidade</strong>. A atribuição na linha 2 ($x = A[r]$) satisfaz a terceira condição.</p>
              </div>
              <div class="triad-card">
                <div class="triad-card-title">2. Manutenção</div>
                <p>Como mostra a Figura 7.3, há dois casos na linha 5:<br>
                • <strong>Caso $A[j] > x$:</strong> A única ação do laço é incrementar $j$. Depois que $j$ é incrementado, a condição 2 passa a valer para $A[j - 1]$ e todos os outros elementos permanecem inalterados.<br>
                • <strong>Caso $A[j] \\le x$:</strong> A linha 6 incrementa $i$, a linha 7 troca $A[i]$ com $A[j]$ e depois o laço incrementa $j$. Por causa da troca, agora temos $A[i] \\le x$ (satisfazendo a condição 1) e o elemento que foi trocado para $A[j - 1]$ veio da antiga posição $i + 1$, logo pelo invariante sabemos que $A[j - 1] > x$ (satisfazendo a condição 2)!</p>
              </div>
              <div class="triad-card">
                <div class="triad-card-title">3. Término</div>
                <p>No término, $j = r$. Portanto, cada entrada do arranjo está em um dos três conjuntos descritos pelo invariante, e particionamos todos os valores do arranjo em três conjuntos: os $\\le x$ (em $A[p \\dots i]$), os $> x$ (em $A[i + 1 \\dots r - 1]$) e um conjunto unitário contendo $x$ (em $A[r]$). As linhas 8–9 trocam o pivô $A[r]$ com o elemento mais à esquerda maior que $x$ ($A[i + 1]$), movendo o pivô para sua posição final $q = i + 1$!</p>
              </div>
            </div>
          </div>

          <p><strong>Tempo de execução de <code>PARTITION</code>:</strong> O laço <code>for</code> executa exatamente $r - p$ iterações de custo constante, logo o tempo de execução de <code>PARTITION</code> sobre um subarranjo $A[p \\dots r]$ de $n = r - p + 1$ elementos é <strong>$\\Theta(n)$</strong>.</p>

          <h3>3. Desempenho do Quicksort: Pior Caso, Melhor Caso e Particionamento Balanceado (Seção 7.2)</h3>
          <p>O tempo de execução do <code>QUICKSORT</code> depende de o particionamento ser <strong>balanceado</strong> ou <strong>desbalanceado</strong>, o que por sua vez depende de quais elementos são usados para o particionamento:</p>
          <ul>
            <li><strong>Particionamento de Pior Caso ($\\Theta(n^2)$):</strong> Ocorre quando a rotina de particionamento produz um subproblema com <strong>$n - 1$ elementos</strong> e um com <strong>$0$ elementos</strong> em todas as chamadas recursivas. A recorrência é:
              $$T(n) = T(n - 1) + T(0) + \\Theta(n) = T(n - 1) + \\Theta(n) = \\sum_{k=1}^{n} \\Theta(k) = \\mathbf{\\Theta(n^2)}.$$
              <em>Observação crucial:</em> O tempo de pior caso do <code>QUICKSORT</code> não é melhor que o da ordenação por inserção ($\\Theta(n^2)$)! Além disso, o pior caso $\\Theta(n^2)$ do <code>QUICKSORT</code> ocorre quando <strong>o arranjo de entrada já está completamente ordenado</strong> — situação exata em que o <code>INSERTION-SORT</code> executa em tempo linear $O(n)$!</li>
            <li><strong>Particionamento de Melhor Caso ($\\Theta(n \\lg n)$):</strong> Na divisão mais uniforme possível, <code>PARTITION</code> produz dois subproblemas de tamanho não superior a $n/2$ (um de tamanho $\\lfloor n/2 \\rfloor$ e um de tamanho $\\lceil n/2 \\rceil - 1$). Ignorando pisos e subtrações de $1$, a recorrência é $T(n) = 2T(n/2) + \\Theta(n)$, que pelo Caso 2 do Teorema Mestre tem solução <strong>$T(n) = \\Theta(n \\lg n)$</strong>.</li>
            <li><strong>Particionamento Balanceado de Proporção Constante (ex.: $9$-para-$1$):</strong> Suponha que o algoritmo de particionamento produza <em>sempre</em> uma divisão proporcional de $9$-para-$1$, que à primeira vista parece muito desbalanceada. A recorrência é:
              $$T(n) = T(9n/10) + T(n/10) + cn.$$
              Construindo a árvore de recursão (Figura 7.4 do livro, p. 152), observamos que <strong>cada nível da árvore tem custo no máximo $cn$</strong>. O caminho mais curto (descendo por $n/10$) atinge tamanho $1$ na profundidade $\\log_{10} n = \\Theta(\\lg n)$, e o caminho mais longo (descendo por $9n/10$) atinge tamanho $1$ na profundidade $\\log_{10/9} n = \\Theta(\\lg n)$. Portanto, o custo total ainda é <strong>$O(n \\lg n)$</strong>! De fato, <strong>qualquer divisão de proporção constante $\\alpha$-para-$(1-\\alpha)$</strong> (mesmo $99$-para-$1$) produz uma árvore de recursão de profundidade $\\Theta(\\lg n)$ e tempo total $O(n \\lg n)$!</li>
            <li><strong>Intuição para o Caso Médio (Alternância de Boas e Más Divisões):</strong> Na execução real sobre uma entrada aleatória, cortes bons (como $n/2 : n/2$) e cortes ruins (como $n-1 : 0$) aparecem misturados. Suponha que cortes do melhor caso e do pior caso se alternem nos níveis da árvore (Figura 7.5 do livro, p. 154): combinar um nível ruim seguido de um nível bom divide o arranjo de tamanho $n$ em três subarranjos de tamanhos $0$, $(n-1)/2 - 1$ e $(n-1)/2$ a um custo combinado de $\\Theta(n) + \\Theta(n-1) = \\Theta(n)$. Ou seja, o custo do corte ruim é simplesmente <strong>absorvido na constante oculta</strong> do corte bom, mantendo o tempo em $\\Theta(n \\lg n)$!</li>
          </ul>
        `
      },

      /* ====================================================================
         UNIDADE 5.5 — CAPÍTULO 7, SEÇÃO 7.3 (pp. 154–156)
         ==================================================================== */
      {
        id: "u5-5",
        code: "UNIDADE 5.5 • CAP. 7 (SEÇÃO 7.3)",
        pages: "pp. 154–156",
        title: "Uma Versão Aleatorizada do Quicksort (RANDOMIZED-PARTITION e RANDOMIZED-QUICKSORT)",
        content: `
          <h3>1. Amostragem Aleatória vs. Permutação Completa da Entrada (Seção 7.3)</h3>
          <p>Ao explorar a suposição de que todas as permutações dos números de entrada são igualmente prováveis, deparamo-nos com um problema prático descrito no Capítulo 5 (Seção 5.3): na engenharia real, nem sempre encontramos entradas uniformemente aleatórias (por exemplo, é muito comum receber arranjos já quase ordenados). Como vimos na Seção 5.3, podemos adicionar <strong>aleatorização ao próprio algoritmo</strong> para obter, para <em>toda e qualquer entrada</em>, o bom desempenho esperado sobre todas as entradas.</p>
          <p>Poderíamos permutar explicitamente todo o arranjo de entrada antes de chamar o <code>QUICKSORT</code>, mas existe uma técnica de aleatorização ainda mais simples e elegante chamada <strong>amostragem aleatória</strong> (<em>random sampling</em>): em vez de sempre usar $A[r]$ como pivô, escolhemos como pivô um elemento selecionado aleatoriamente no subarranjo $A[p \\dots r]$!</p>

          <h3>2. Os Procedimentos <code>RANDOMIZED-PARTITION</code> e <code>RANDOMIZED-QUICKSORT</code></h3>
          <p>Para implementar a amostragem aleatória, sorteamos um índice $i = \\text{RANDOM}(p, r)$ uniformemente entre $p$ e $r$, trocamos $A[r]$ com $A[i]$ e em seguida delegamos para o procedimento padrão <code>PARTITION(A, p, r)</code>:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">RANDOMIZED-PARTITION(A, p, r) &amp; RANDOMIZED-QUICKSORT(A, p, r)</span>
              <span>[ CAPÍTULO 7.3 • AMOSTRAGEM ALEATÓRIA DO PIVÔ (p. 155) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="proc-name">RANDOMIZED-PARTITION</span>(A, p, r)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    i = RANDOM(p, r)</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    troque A[r] com A[i]</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">return</span> PARTITION(A, p, r)</span></div>
              <div class="code-line"><span class="line-num">&nbsp;</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="proc-name">RANDOMIZED-QUICKSORT</span>(A, p, r)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">if</span> p &lt; r</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">        q = RANDOMIZED-PARTITION(A, p, r)</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">        RANDOMIZED-QUICKSORT(A, p, q - 1)</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">        RANDOMIZED-QUICKSORT(A, q + 1, r)</span></div>
            </div>
          </div>

          <div class="canonical-callout note">
            <span class="callout-tag">[ PROPRIEDADE FUNDAMENTAL DA ALEATORIZAÇÃO (p. 155) ]</span>
            <ul>
              <li>Como o pivô é escolhido aleatoriamente entre os $r - p + 1$ elementos de $A[p \\dots r]$ com igual probabilidade $\\frac{1}{r - p + 1}$, esperamos que a divisão do arranjo de entrada seja razoavelmente bem balanceada na média.</li>
              <li>Mais importante ainda: <strong>nenhuma entrada específica pode provocar o comportamento de pior caso!</strong> O pior caso ainda existe (se o gerador de números aleatórios tiver o azar extremo de sortear sempre o menor ou o maior elemento em cada passo, o que ocorre com probabilidade minúscula $\\approx 2^n / n!$), mas agora depende exclusivamente do gerador de números aleatórios, e não de uma instância "inimiga" fornecida pelo usuário.</li>
            </ul>
          </div>
        `
      },

      /* ====================================================================
         UNIDADE 5.6 — CAPÍTULO 7, SEÇÃO 7.4 E PROBLEMAS 7-1 A 7-6 (pp. 156–165)
         ==================================================================== */
      {
        id: "u5-6",
        code: "UNIDADE 5.6 • CAP. 7 (SEÇÃO 7.4 & PROBLEMAS)",
        pages: "pp. 156–165",
        title: "Análise Rigorosa do Quicksort (Pior Caso por Substituição, Caso Esperado Θ(n lg n), Partição de Hoare e Recursão de Cauda)",
        content: `
          <h3>1. Análise de Pior Caso pelo Método de Substituição (Seção 7.4.1)</h3>
          <p>Na Seção 7.2 vimos intuitivamente que o pior caso do <code>QUICKSORT</code> é $\\Theta(n^2)$. Na Seção 7.4.1, provamos formalmente pelo <strong>Método de Substituição</strong> (Seção 4.3) que o tempo de pior caso $T(n)$ é $O(n^2)$. Como <code>PARTITION</code> produz dois subproblemas cujo tamanho total é $n - 1$ (um de tamanho $q$ e outro de tamanho $n - q - 1$, onde $0 \\le q \\le n - 1$), a recorrência para o tempo de pior caso é:</p>
          $$T(n) = \\max_{0 \\le q \\le n-1} \\big(T(q) + T(n - q - 1)\\big) + \\Theta(n).$$
          <p>Conjecturamos a hipótese indutiva $T(n) \\le c n^2$ para alguma constante $c > 0$. Substituindo essa hipótese na recorrência, obtemos:</p>
          $$T(n) \\le \\max_{0 \\le q \\le n-1} \\big(c q^2 + c(n - q - 1)^2\\big) + \\Theta(n) = c \\cdot \\max_{0 \\le q \\le n-1} \\big(q^2 + (n - q - 1)^2\\big) + \\Theta(n).$$
          <p>A função quadrática $f(q) = q^2 + (n - q - 1)^2$ possui segunda derivada positiva $f''(q) = 4 > 0$ (é estritamente convexa no intervalo $[0, n-1]$), portanto atinge seu valor máximo exatamente nas duas extremidades do intervalo: $q = 0$ ou $q = n - 1$ (Exercício 7.4-3)! Em ambos os extremos, seu valor vale $(n - 1)^2 = n^2 - 2n + 1$. Logo:</p>
          $$\\max_{0 \\le q \\le n-1} \\big(q^2 + (n - q - 1)^2\\big) \\le (n - 1)^2 = n^2 - 2n + 1,$$
          <p>e portanto:</p>
          $$T(n) \\le c n^2 - c(2n - 1) + \\Theta(n) \\le c n^2,$$
          <p>desde que escolhamos a constante $c$ suficientemente grande para que o termo negativo $c(2n - 1)$ domine o termo positivo $\\Theta(n)$. Como já exibimos uma entrada (o arranjo ordenado) que exige $\\Omega(n^2)$, concluímos que o tempo de execução de pior caso do <code>QUICKSORT</code> é exatamente <strong>$\\Theta(n^2)$</strong>.</p>

          <h3>2. Tempo de Execução Esperado de <code>RANDOMIZED-QUICKSORT</code>: Lema 7.1 e Variáveis Indicadoras (Seção 7.4.2)</h3>
          <p>Passamos agora à demonstração mais célebre do Capítulo 7 (devida a Avrim Blum): provar que o tempo de execução esperado de <code>RANDOMIZED-QUICKSORT</code> sobre uma entrada de $n$ elementos distintos é <strong>$O(n \\lg n)$</strong>.</p>
          <p>Primeiro, relacionamos o tempo total gasto pelo algoritmo ao número total de comparações entre elementos realizadas na linha 5 do pseudocódigo de <code>PARTITION</code> (linha 4 na numeração do livro: <code>if A[j] ≤ x</code>):</p>

          <div class="canonical-callout theorem">
            <span class="callout-tag">[ LEMA 7.1 • REDUÇÃO DO TEMPO DE EXECUÇÃO À CONTAGEM DE COMPARAÇÕES X (p. 157) ]</span>
            <p><strong>Enunciado do Lema 7.1:</strong> <em>"Seja $X$ o número de comparações executadas na linha 4 de <code>PARTITION</code> sobre toda a execução de <code>QUICKSORT</code> (ou <code>RANDOMIZED-QUICKSORT</code>) em um arranjo de $n$ elementos. Então, o tempo de execução de <code>QUICKSORT</code> é $O(n + X)$."</em></p>
            <p><strong>Demonstração:</strong> Pela inspeção do código, o algoritmo realiza no máximo $n$ chamadas a <code>PARTITION</code>, pois cada chamada a <code>PARTITION</code> seleciona um elemento pivô que é colocado em $A[q]$ e <strong>nunca mais é incluído em nenhuma chamada recursiva subsequente</strong>! Cada chamada a <code>PARTITION</code> executa uma quantidade constante de trabalho fora do laço <code>for</code>, mais um número de iterações do laço <code>for</code> exatamente igual ao número de vezes que a comparação <code>A[j] ≤ x</code> é executada naquela chamada. Portanto, a soma do trabalho em todas as chamadas é $O(n + X)$. $\\blacksquare$</p>
          </div>

          <p>Graças ao Lema 7.1, <strong>não precisamos analisar o quanto cada chamada individual de <code>PARTITION</code> demora</strong>; basta calcular o número esperado total $E[X]$ de comparações executadas em <em>todo</em> o algoritmo! Para isso:</p>
          <ol>
            <li><strong>Renomeação Ordenada dos Elementos:</strong> Renomeamos os elementos do arranjo $A$ como $z_1, z_2, \\dots, z_n$, onde $z_i$ é o <strong>$i$-ésimo menor elemento</strong> de $A$ (isto é, $z_1 < z_2 < \\dots < z_n$). Definimos também o subconjunto de elementos entre $z_i$ e $z_j$ (inclusive) como:
              $$Z_{ij} = \\{z_i, z_{i+1}, \\dots, z_j\\}, \\qquad \\text{cujo tamanho é } |Z_{ij}| = j - i + 1.$$</li>
            <li><strong>Cada par $(z_i, z_j)$ é comparado no máximo uma vez:</strong> As comparações em <code>PARTITION</code> sempre comparam um elemento com o <em>pivô</em> daquela chamada; e quando a chamada de <code>PARTITION</code> termina, aquele pivô nunca mais é comparado com nenhum outro elemento!</li>
            <li><strong>Definição da Variável Aleatória Indicadora $X_{ij}$:</strong> Para cada par $1 \\le i < j \\le n$, definimos:
              $$X_{ij} = \\text{I}\\{z_i \\text{ é comparado com } z_j\\}.$$
              Logo, o número total de comparações $X$ em toda a execução é:
              $$X = \\sum_{i=1}^{n-1} \\sum_{j=i+1}^{n} X_{ij}.$$</li>
            <li><strong>Aplicação da Linearidade da Esperança e do Lema 5.1 (Equação 7.2):</strong>
              $$E[X] = E\\left[\\sum_{i=1}^{n-1} \\sum_{j=i+1}^{n} X_{ij}\\right] = \\sum_{i=1}^{n-1} \\sum_{j=i+1}^{n} E[X_{ij}] = \\sum_{i=1}^{n-1} \\sum_{j=i+1}^{n} \\Pr\\{z_i \\text{ é comparado com } z_j\\}.$$</li>
          </ol>

          <div class="canonical-callout theorem">
            <span class="callout-tag">[ PROVA CENTRAL • QUANDO z_i E z_j SÃO COMPARADOS? (pp. 158–159) ]</span>
            <p>Quando $z_i$ e $z_j$ ($i < j$) <strong>não</strong> são comparados? Considere os números de $1$ a $10$ e suponha que o primeiro pivô sorteado seja $7$. A primeira chamada a <code>PARTITION</code> separa os números em dois conjuntos disjuntos: $\\{1, 2, 3, 4, 5, 6\\}$ e $\\{8, 9, 10\\}$. Nesse passo, o pivô $7$ é comparado com todos os outros números, mas <strong>nenhum número do primeiro conjunto (por exemplo, $2$) jamais será comparado com qualquer número do segundo conjunto (por exemplo, $9$)</strong>!</p>
            <p>Em geral, enquanto nenhum elemento de $Z_{ij} = \\{z_i, z_{i+1}, \\dots, z_j\\}$ tiver sido escolhido como pivô, <strong>todo o conjunto $Z_{ij}$ permanece unido na mesma partição</strong> (pois qualquer pivô externo $x < z_i$ coloca todo $Z_{ij}$ à direita, e qualquer pivô $x > z_j$ coloca todo $Z_{ij}$ à esquerda). No instante em que o <strong>primeiro elemento de $Z_{ij}$ é escolhido como pivô</strong>, há apenas três possibilidades mutuamente exclusivas:</p>
            <ul>
              <li>Se o primeiro pivô escolhido em $Z_{ij}$ for um elemento intermediário $x$ com $z_i < x < z_j$, então $z_i$ e $z_j$ são enviados para subarranjos separados e <strong>nunca serão comparados entre si</strong>!</li>
              <li>Se $z_i$ for escolhido como pivô antes de qualquer outro item de $Z_{ij}$, então $z_i$ será comparado com todos os demais itens de $Z_{ij}$, inclusive $z_j$.</li>
              <li>Se $z_j$ for escolhido como pivô antes de qualquer outro item de $Z_{ij}$, então $z_j$ será comparado com todos os demais itens de $Z_{ij}$, inclusive $z_i$.</li>
            </ul>
            <p>Portanto: <strong>$z_i$ e $z_j$ são comparados se, e somente se, o primeiro elemento a ser escolhido como pivô a partir de $Z_{ij}$ for $z_i$ ou $z_j$!</strong></p>
            <p>Como $Z_{ij}$ contém exatamente $j - i + 1$ elementos e todos os elementos de $Z_{ij}$ têm igual probabilidade $\\frac{1}{j - i + 1}$ de ser o primeiro escolhido como pivô desse conjunto (e os dois eventos são mutuamente exclusivos), obtemos a Equação (7.3):</p>
            $$\\Pr\\{z_i \\text{ é comparado com } z_j\\} = \\Pr\\{z_i \\text{ ou } z_j \\text{ é o 1º pivô escolhido de } Z_{ij}\\} = \\frac{1}{j - i + 1} + \\frac{1}{j - i + 1} = \\mathbf{\\frac{2}{j - i + 1}}.$$
            <p>Substituindo na Equação (7.2) e fazendo a mudança de variável $k = j - i$ (usando o limite da Série Harmônica da Equação A.7):</p>
            $$E[X] = \\sum_{i=1}^{n-1} \\sum_{j=i+1}^{n} \\frac{2}{j - i + 1} = \\sum_{i=1}^{n-1} \\sum_{k=1}^{n-i} \\frac{2}{k + 1} < \\sum_{i=1}^{n-1} \\sum_{k=1}^{n} \\frac{2}{k} = \\sum_{i=1}^{n-1} O(\\lg n) = \\mathbf{O(n \\lg n)}.$$
            <p>Assim, concluímos que o tempo de execução esperado de <code>RANDOMIZED-QUICKSORT</code> é <strong>$O(n \\lg n)$</strong> (e, pelo Exercício 7.4-4, $\\Theta(n \\lg n)$) quando os valores dos elementos são distintos! $\\blacksquare$</p>
          </div>

          <h3>3. Problemas Clássicos do Capítulo 7: Partição de Hoare (7-1) e Recursão de Cauda (7-4)</h3>
          <p>O Capítulo 7 se encerra com seis problemas fundamentais (pp. 160–164), entre os quais destacam-se dois pilares de implementação:</p>

          <h4>A. Problema 7-1: A Partição Original de C. A. R. Hoare (<code>HOARE-PARTITION</code>)</h4>
          <p>Enquanto a partição de Lomuto (Seção 7.1) varre o subarranjo da esquerda para a direita com dois ponteiros $i, j$ e isola o pivô na posição final $A[q]$, a partição original publicada por C. A. R. Hoare em 1962 usa <strong>dois ponteiros $i$ e $j$ que avançam das duas extremidades em direção ao centro</strong>, escolhendo $x = A[p]$ como pivô:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">HOARE-PARTITION(A, p, r)</span>
              <span>[ PROBLEMA 7-1 • PARTIÇÃO ORIGINAL DE HOARE COM DOIS PONTEIROS CONVERGENTES (p. 160) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">x = A[p]</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">i = p - 1</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">j = r + 1</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">while</span> TRUE</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">repeat</span></span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">        j = j - 1</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    <span class="kw">until</span> A[j] ≤ x</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">    <span class="kw">repeat</span></span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">        i = i + 1</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">    <span class="kw">until</span> A[i] ≥ x</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">    <span class="kw">if</span> i &lt; j</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">        troque A[i] com A[j]</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">    <span class="kw">else return</span> j</span></div>
            </div>
          </div>

          <p><strong>Diferença sutil crucial:</strong> Em <code>HOARE-PARTITION</code>, o pivô $x$ não fica isolado em $A[j]$; em vez disso, ele garante que $p \\le j < r$ e que todo elemento de $A[p \\dots j]$ é menor ou igual a todo elemento de $A[j + 1 \\dots r]$. Por isso, ao reescrever o <code>QUICKSORT</code> para usar <code>HOARE-PARTITION</code>, as chamadas recursivas passam a ser <code>QUICKSORT(A, p, q)</code> (incluindo $q$!) e <code>QUICKSORT(A, q + 1, r)</code>, realizando em média <strong>três vezes menos trocas</strong> que a partição de Lomuto!</p>

          <h4>B. Problema 7-4: Profundidade de Pilha e Eliminação de Recursão de Cauda (<code>TAIL-RECURSIVE-QUICKSORT</code>)</h4>
          <p>A segunda chamada recursiva em <code>QUICKSORT</code> é uma <strong>recursão de cauda</strong> e pode ser substituída por um laço iterativo <code>while p < r</code> atualizando $p = q + 1$. Contudo, se recursarmos sempre na partição esquerda, um arranjo em que $q = r$ repetidamente ainda provocaria uma profundidade de pilha de $\\Theta(n)$! Para garantir que a <strong>profundidade máxima da pilha no pior caso seja $\\Theta(\\lg n)$</strong>, basta comparar os tamanhos dos dois subarranjos ($q - p$ versus $r - q$), fazer a <strong>chamada recursiva apenas sobre o menor subarranjo</strong> (que tem tamanho no máximo $n/2$) e iterar em cauda sobre o maior subarranjo!</p>
        `
      }
    ],

    /* ======================================================================
       BANCADA INTERATIVA DUPLA (#workbench-mod5-mount):
       (1) SIMULADOR DE HEAP BINÁRIO (BUILD-MAX-HEAP & MAX-HEAPIFY)
       (2) SIMULADOR PASSO A PASSO DO INVARIANTE DE PARTITION (4 REGIÕES)
       ====================================================================== */
    initWorkbenches: function () {
      const mount = document.getElementById("workbench-mod5-mount");
      if (!mount) return;

      mount.innerHTML = `
        <div class="workbench-box" style="margin-top:1.75rem;">
          <div class="workbench-header">
            <span class="workbench-title">[ BANCADA INTERATIVA DUPLA #05 • HEAPS BINÁRIOS (CAP. 6) &amp; INVARIANTE DE PARTITION (CAP. 7) ]</span>
            <span class="bracket-tag emerald">SIMULADOR PASSO A PASSO</span>
          </div>
          <div class="workbench-body">
            <div style="display:flex;gap:0.65rem;flex-wrap:wrap;margin-bottom:1.15rem;border-bottom:var(--border-thin);padding-bottom:0.85rem;">
              <button id="mod5-tab-heap" class="btn-primary-brutal" onclick="switchMod5WorkbenchTab('heap')">
                [ 1. SIMULADOR DE HEAP BINÁRIO (BUILD-MAX-HEAP &amp; MAX-HEAPIFY) ]
              </button>
              <button id="mod5-tab-part" class="btn-secondary-brutal" onclick="switchMod5WorkbenchTab('part')">
                [ 2. SIMULADOR DAS 4 REGIÕES DO INVARIANTE DE PARTITION(A, p, r) ]
              </button>
            </div>

            <!-- PAINEL 1: HEAP BINÁRIO -->
            <div id="mod5-panel-heap">
              <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.85rem;">
                Explore passo a passo a representação implícita em arranjo $A[1 \\dots 10]$ e os 4 níveis da árvore binária quase completa nos exemplos canônicos da <strong>Figura 6.2</strong> (<code>MAX-HEAPIFY(A, 2)</code>) e da <strong>Figura 6.3</strong> (<code>BUILD-MAX-HEAP(A)</code> sobre $\\langle 4, 1, 3, 2, 16, 9, 10, 14, 8, 7 \\rangle$):
              </p>
              <div class="workbench-controls" style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;margin-bottom:1rem;">
                <label style="font-family:var(--font-mono);font-size:0.76rem;font-weight:700;">CENÁRIO DO LIVRO:</label>
                <select id="mod5-heap-scenario" class="search-input-brutal" onchange="resetMod5HeapSim()">
                  <option value="build">Figura 6.3 (p. 138): BUILD-MAX-HEAP em A = ⟨4, 1, 3, 2, 16, 9, 10, 14, 8, 7⟩</option>
                  <option value="heapify">Figura 6.2 (p. 135): MAX-HEAPIFY(A, 2) em A = ⟨16, 4, 10, 14, 7, 9, 3, 2, 8, 1⟩</option>
                </select>
                <button class="btn-secondary-brutal" onclick="stepMod5HeapSim(-1)">[ ← PASSO ANTERIOR ]</button>
                <button class="btn-primary-brutal" onclick="stepMod5HeapSim(1)">[ PRÓXIMO PASSO → ]</button>
                <button class="btn-secondary-brutal" onclick="resetMod5HeapSim()">[ REINICIAR ]</button>
              </div>
              <div id="mod5-heap-stage"></div>
            </div>

            <!-- PAINEL 2: PARTITION DE LOMUTO -->
            <div id="mod5-panel-part" style="display:none;">
              <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.85rem;">
                Acompanhe a execução de <code>PARTITION(A, 1, 8)</code> da <strong>Figura 7.1 (p. 149)</strong> sobre $A = \\langle 2, 8, 7, 1, 3, 5, 6, 4 \\rangle$ com pivô $x = A[8] = 4$, observando em tempo real as <strong>4 regiões do invariante de laço</strong>:
              </p>
              <div class="workbench-controls" style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;margin-bottom:1rem;">
                <label style="font-family:var(--font-mono);font-size:0.76rem;font-weight:700;">INSTÂNCIA:</label>
                <select id="mod5-part-scenario" class="search-input-brutal" onchange="resetMod5PartSim()">
                  <option value="fig71">Figura 7.1 (p. 149): A = ⟨2, 8, 7, 1, 3, 5, 6, 4⟩ (pivô x = 4)</option>
                  <option value="sorted">Pior Caso Ordenado: A = ⟨1, 2, 3, 4, 5, 6, 7, 8⟩ (pivô x = 8)</option>
                  <option value="equal">Exercício 7.1-2 (Chaves Iguais): A = ⟨5, 5, 5, 5, 5, 5, 5, 5⟩ (pivô x = 5)</option>
                </select>
                <button class="btn-secondary-brutal" onclick="stepMod5PartSim(-1)">[ ← ITERAÇÃO ANTERIOR ]</button>
                <button class="btn-primary-brutal" onclick="stepMod5PartSim(1)">[ PRÓXIMA ITERAÇÃO → ]</button>
                <button class="btn-secondary-brutal" onclick="resetMod5PartSim()">[ REINICIAR ]</button>
              </div>
              <div id="mod5-part-stage"></div>
            </div>
          </div>
        </div>
      `;

      const heapTraces = {
        build: [
          {
            arr: [4, 1, 3, 2, 16, 9, 10, 14, 8, 7],
            active: 5,
            swapped: [],
            rootHeaps: [6, 7, 8, 9, 10],
            desc: "<strong>Estado Inicial — Fig. 6.3(a):</strong> Os nós $6, 7, 8, 9, 10$ ($\\lfloor 10/2 \\rfloor + 1 \\dots 10$) são folhas e já constituem heaps triviais de 1 elemento. O laço começa em $i = \\lfloor 10/2 \\rfloor = 5$ ($A[5] = 16$, cujo único filho é $A[10] = 7$). Como $16 > 7$, <code>MAX-HEAPIFY(A, 5)</code> não faz trocas."
          },
          {
            arr: [4, 1, 3, 2, 16, 9, 10, 14, 8, 7],
            active: 4,
            swapped: [4, 8],
            rootHeaps: [5, 6, 7, 8, 9, 10],
            desc: "<strong>Iteração $i = 4$ — Fig. 6.3(b):</strong> Pelo invariante, os nós $5 \\dots 10$ são raízes de heaps de máximo. No nó $i = 4$ ($A[4] = 2$), seus filhos são $A[8] = 14$ e $A[9] = 8$. O maior é $A[8] = 14$, logo <code>MAX-HEAPIFY(A, 4)</code> troca $A[4] \\leftrightarrow A[8]$."
          },
          {
            arr: [4, 1, 3, 14, 16, 9, 10, 2, 8, 7],
            active: 3,
            swapped: [3, 7],
            rootHeaps: [4, 5, 6, 7, 8, 9, 10],
            desc: "<strong>Iteração $i = 3$ — Fig. 6.3(c):</strong> Agora os nós $4 \\dots 10$ são raízes de heaps de máximo. No nó $i = 3$ ($A[3] = 3$), seus filhos são $A[6] = 9$ e $A[7] = 10$. O maior é $A[7] = 10$, logo <code>MAX-HEAPIFY(A, 3)</code> troca $A[3] \\leftrightarrow A[7]$."
          },
          {
            arr: [4, 1, 10, 14, 16, 9, 3, 2, 8, 7],
            active: 2,
            swapped: [2, 5, 10],
            rootHeaps: [3, 4, 5, 6, 7, 8, 9, 10],
            desc: "<strong>Iteração $i = 2$ — Fig. 6.3(d):</strong> No nó $i = 2$ ($A[2] = 1$), os filhos são $A[4] = 14$ e $A[5] = 16$ (ambos raízes de heaps de máximo!). Trocamos $A[2] \\leftrightarrow A[5]$ (colocando $16$ em $A[2]$ e $1$ em $A[5]$) e recursivamente trocamos $A[5] \\leftrightarrow A[10]$ (colocando $7$ em $A[5]$ e $1$ em $A[10]$)."
          },
          {
            arr: [4, 16, 10, 14, 7, 9, 3, 2, 8, 1],
            active: 1,
            swapped: [1, 2, 4, 9],
            rootHeaps: [2, 3, 4, 5, 6, 7, 8, 9, 10],
            desc: "<strong>Iteração $i = 1$ — Fig. 6.3(e):</strong> Na raiz $i = 1$ ($A[1] = 4$), as subárvores em $A[2] = 16$ e $A[3] = 10$ já são heaps de máximo. <code>MAX-HEAPIFY(A, 1)</code> flutua o valor $4$ para baixo: troca $A[1] \\leftrightarrow A[2]$ ($16$), depois $A[2] \\leftrightarrow A[4]$ ($14$), e por fim $A[4] \\leftrightarrow A[9]$ ($8$)."
          },
          {
            arr: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1],
            active: null,
            swapped: [],
            rootHeaps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            desc: "<strong>Término ($i = 0$) — Fig. 6.3(f):</strong> Pelo invariante de laço, todos os nós $1, 2, \\dots, 10$ são raízes de heaps de máximo! O arranjo resultante $\\langle 16, 14, 10, 8, 7, 9, 3, 2, 4, 1 \\rangle$ é um heap de máximo perfeito construído em tempo linear $O(n)$."
          }
        ],
        heapify: [
          {
            arr: [16, 4, 10, 14, 7, 9, 3, 2, 8, 1],
            active: 2,
            swapped: [2, 4],
            rootHeaps: [3, 4, 5, 6, 7, 8, 9, 10],
            desc: "<strong>Passo 1 — Fig. 6.2(a):</strong> Chamada inicial <code>MAX-HEAPIFY(A, 2)</code>. O nó $i = 2$ ($A[2] = 4$) viola a propriedade de heap de máximo porque seus filhos são $A[4] = 14$ e $A[5] = 7$. O maior entre os três é $A[4] = 14$ ($\\text{maior} = 4$), logo trocamos $A[2] \\leftrightarrow A[4]$."
          },
          {
            arr: [16, 14, 10, 4, 7, 9, 3, 2, 8, 1],
            active: 4,
            swapped: [4, 9],
            rootHeaps: [3, 5, 6, 7, 8, 9, 10],
            desc: "<strong>Passo 2 — Fig. 6.2(b):</strong> Chamada recursiva <code>MAX-HEAPIFY(A, 4)</code>. Agora $A[4] = 4$ é comparado com seus filhos $A[8] = 2$ e $A[9] = 8$. O maior é $A[9] = 8$ ($\\text{maior} = 9$), logo trocamos $A[4] \\leftrightarrow A[9]$."
          },
          {
            arr: [16, 14, 10, 8, 7, 9, 3, 2, 4, 1],
            active: 9,
            swapped: [],
            rootHeaps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            desc: "<strong>Passo 3 — Fig. 6.2(c):</strong> Chamada recursiva <code>MAX-HEAPIFY(A, 9)</code>. O nó $i = 9$ ($A[9] = 4$) é uma folha ($\\text{LEFT}(9) = 18 > 10$), portanto $\\text{maior} = 9$ e o procedimento termina com a propriedade de heap restaurada!"
          }
        ]
      };

      let curHeapScenario = "build";
      let curHeapStep = 0;

      function renderHeapSim() {
        const stage = document.getElementById("mod5-heap-stage");
        if (!stage) return;
        const steps = heapTraces[curHeapScenario];
        const step = steps[curHeapStep];
        const arr = step.arr;

        const arrayCellsHtml = arr
          .map((val, idx) => {
            const pos = idx + 1;
            const isAct = step.active === pos;
            const isSwp = step.swapped.includes(pos);
            const isHeapRoot = step.rootHeaps.includes(pos);
            const bg = isAct
              ? "var(--accent-amber)"
              : isSwp
              ? "rgba(217, 119, 6, 0.22)"
              : isHeapRoot
              ? "rgba(16, 185, 129, 0.16)"
              : "var(--bg-card)";
            const border = isAct ? "2px solid var(--ink-primary)" : "1px solid var(--border-color)";
            return `
              <div style="min-width:52px;text-align:center;padding:0.45rem 0.35rem;background:${bg};border:${border};font-family:var(--font-mono);">
                <div style="font-size:0.68rem;color:var(--ink-muted);">i=${pos}</div>
                <div style="font-size:1rem;font-weight:800;color:var(--ink-primary);">${val}</div>
                <div style="font-size:0.62rem;color:var(--ink-secondary);">${pos >= 6 ? "folha" : `h=${pos === 1 ? 3 : pos <= 3 ? (pos === 2 ? 2 : 1) : 1}`}</div>
              </div>
            `;
          })
          .join("");

        const levels = [
          [1],
          [2, 3],
          [4, 5, 6, 7],
          [8, 9, 10]
        ];

        const treeHtml = levels
          .map((lvl, hIdx) => {
            const nodesHtml = lvl
              .map((pos) => {
                const val = arr[pos - 1];
                const isAct = step.active === pos;
                const isSwp = step.swapped.includes(pos);
                const bg = isAct
                  ? "var(--accent-amber)"
                  : isSwp
                  ? "rgba(217, 119, 6, 0.25)"
                  : "var(--bg-elevated)";
                const par = pos > 1 ? `pai=${Math.floor(pos / 2)}` : "RAIZ";
                return `
                  <div style="display:inline-flex;flex-direction:column;align-items:center;margin:0 0.5rem;padding:0.35rem 0.65rem;border:2px solid var(--ink-primary);background:${bg};font-family:var(--font-mono);min-width:64px;">
                    <span style="font-size:0.65rem;color:var(--ink-muted);">A[${pos}] (${par})</span>
                    <strong style="font-size:1.05rem;">${val}</strong>
                  </div>
                `;
              })
              .join("");
            return `
              <div style="display:flex;justify-content:center;align-items:center;margin:0.4rem 0;flex-wrap:wrap;">
                <span style="font-family:var(--font-mono);font-size:0.7rem;color:var(--ink-muted);width:85px;text-align:right;margin-right:0.75rem;">Prof. ${hIdx}:</span>
                <div style="display:flex;justify-content:center;flex:1;flex-wrap:wrap;">${nodesHtml}</div>
              </div>
            `;
          })
          .join("");

        stage.innerHTML = `
          <div style="margin-bottom:0.65rem;font-family:var(--font-mono);font-size:0.76rem;color:var(--ink-secondary);">
            [ PASSO ${curHeapStep + 1} DE ${steps.length} ] • A.comprimento = 10 • A.tamanho-do-heap = 10 • Folhas: índices ⌊10/2⌋+1 .. 10 (6..10)
          </div>
          <div style="display:flex;gap:0.35rem;flex-wrap:wrap;margin-bottom:1rem;">
            ${arrayCellsHtml}
          </div>
          <div style="background:var(--bg-card);border:var(--border-thin);padding:0.85rem;margin-bottom:0.85rem;">
            <div style="font-family:var(--font-mono);font-size:0.72rem;font-weight:700;margin-bottom:0.45rem;color:var(--ink-secondary);">
              REPRESENTAÇÃO EM ÁRVORE BINÁRIA QUASE COMPLETA (PARENT(i)=⌊i/2⌋, LEFT(i)=2i, RIGHT(i)=2i+1):
            </div>
            ${treeHtml}
          </div>
          <div class="canonical-callout note" style="margin:0;">
            <p style="margin:0;font-size:0.88rem;">${step.desc}</p>
          </div>
        `;
        if (window.renderMathInElement) {
          try {
            window.renderMathInElement(stage, {
              delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false }
              ],
              throwOnError: false
            });
          } catch (e) {}
        }
      }

      window.resetMod5HeapSim = function () {
        const sel = document.getElementById("mod5-heap-scenario");
        curHeapScenario = sel ? sel.value : "build";
        curHeapStep = 0;
        renderHeapSim();
      };

      window.stepMod5HeapSim = function (delta) {
        const steps = heapTraces[curHeapScenario];
        curHeapStep = Math.max(0, Math.min(steps.length - 1, curHeapStep + delta));
        renderHeapSim();
      };

      /* Simulador 2: PARTITION(A, p, r) */
      const partDatasets = {
        fig71: [2, 8, 7, 1, 3, 5, 6, 4],
        sorted: [1, 2, 3, 4, 5, 6, 7, 8],
        equal: [5, 5, 5, 5, 5, 5, 5, 5]
      };

      let curPartSteps = [];
      let curPartIdx = 0;

      function buildPartitionSteps(initialArr) {
        const A = initialArr.slice();
        const n = A.length;
        const x = A[n - 1];
        let i = 0; // 1-indexed: p=1, r=n, i starts at p-1 = 0
        const steps = [];

        steps.push({
          arr: A.slice(),
          i: 0,
          j: 1,
          r: n,
          x: x,
          done: false,
          q: null,
          note: `<strong>Inicialização (antes de $j = 1$):</strong> $x = A[${n}] = ${x}$, $i = p - 1 = 0$ e $j = p = 1$. As Regiões 1 ($A[1 \\dots 0]$) e 2 ($A[1 \\dots 0]$) estão vazias, satisfazendo o invariante por vacuidade.`
        });

        for (let j = 1; j <= n - 1; j++) {
          const valJ = A[j - 1];
          if (valJ <= x) {
            i = i + 1;
            const tmp = A[i - 1];
            A[i - 1] = A[j - 1];
            A[j - 1] = tmp;
            steps.push({
              arr: A.slice(),
              i: i,
              j: j + 1,
              r: n,
              x: x,
              done: false,
              q: null,
              note: `<strong>Iteração $j = ${j}$ ($A[${j}] = ${valJ} \\le x = ${x}$):</strong> Incrementamos $i$ para $${i}$ e trocamos $A[${i}] \\leftrightarrow A[${j}]$. Agora a Região 1 ($\\le x$) abrange $A[1 \\dots ${i}]$, e a Região 2 ($> x$) abrange $A[${i + 1} \\dots ${j}]$.`
            });
          } else {
            steps.push({
              arr: A.slice(),
              i: i,
              j: j + 1,
              r: n,
              x: x,
              done: false,
              q: null,
              note: `<strong>Iteração $j = ${j}$ ($A[${j}] = ${valJ} > x = ${x}$):</strong> Nenhuma troca é feita; apenas avançamos $j$ para $${j + 1}$, expandindo a Região 2 ($> x$) para $A[${i + 1} \\dots ${j}]$.`
            });
          }
        }

        const q = i + 1;
        const tmp = A[q - 1];
        A[q - 1] = A[n - 1];
        A[n - 1] = tmp;
        steps.push({
          arr: A.slice(),
          i: i,
          j: n,
          r: n,
          x: x,
          done: true,
          q: q,
          note: `<strong>Término ($j = r = ${n}$) e Troca Final (Linhas 8–9):</strong> Trocamos $A[i + 1] = A[${q}]$ com o pivô $A[${n}] = ${x}$ e retornamos $q = ${q}$! Todos os elementos em $A[1 \\dots ${q - 1}]$ são $\\le ${x}$ e todos em $A[${q + 1} \\dots ${n}]$ são $> ${x}$.`
        });

        return steps;
      }

      function renderPartSim() {
        const stage = document.getElementById("mod5-part-stage");
        if (!stage) return;
        const st = curPartSteps[curPartIdx];

        const cellsHtml = st.arr
          .map((val, idx) => {
            const k = idx + 1;
            let regionLabel = "";
            let bg = "var(--bg-card)";
            if (st.done) {
              if (k < st.q) {
                regionLabel = "≤ x";
                bg = "rgba(16, 185, 129, 0.20)";
              } else if (k === st.q) {
                regionLabel = "PIVÔ q";
                bg = "var(--accent-amber)";
              } else {
                regionLabel = "> x";
                bg = "rgba(59, 130, 246, 0.20)";
              }
            } else {
              if (k <= st.i) {
                regionLabel = "R1: ≤ x";
                bg = "rgba(16, 185, 129, 0.20)";
              } else if (k < st.j) {
                regionLabel = "R2: > x";
                bg = "rgba(59, 130, 246, 0.20)";
              } else if (k < st.r) {
                regionLabel = "R3: ?";
                bg = "var(--bg-card)";
              } else {
                regionLabel = "R4: pivô x";
                bg = "var(--accent-amber)";
              }
            }

            const ptrs = [];
            if (!st.done && k === st.i) ptrs.push("i");
            if (!st.done && k === st.j) ptrs.push("j");
            if (!st.done && k === st.r) ptrs.push("r");
            if (st.done && k === st.q) ptrs.push(`q=${st.q}`);

            return `
              <div style="min-width:68px;text-align:center;padding:0.5rem 0.4rem;background:${bg};border:2px solid var(--ink-primary);font-family:var(--font-mono);">
                <div style="font-size:0.66rem;color:var(--ink-muted);">A[${k}]</div>
                <div style="font-size:1.1rem;font-weight:800;margin:0.15rem 0;">${val}</div>
                <div style="font-size:0.65rem;font-weight:700;">${regionLabel}</div>
                <div style="font-size:0.68rem;color:var(--ink-primary);min-height:1rem;margin-top:0.15rem;">
                  ${ptrs.length ? `[ ${ptrs.join(", ")} ]` : "&nbsp;"}
                </div>
              </div>
            `;
          })
          .join("");

        stage.innerHTML = `
          <div style="margin-bottom:0.65rem;font-family:var(--font-mono);font-size:0.76rem;color:var(--ink-secondary);">
            [ PASSO ${curPartIdx + 1} DE ${curPartSteps.length} ] • Pivô x = ${st.x} • i = ${st.i} • j = ${st.j} ${st.done ? `• Retorno q = ${st.q}` : ""}
          </div>
          <div style="display:flex;gap:0.45rem;flex-wrap:wrap;margin-bottom:0.9rem;">
            ${cellsHtml}
          </div>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:0.85rem;font-family:var(--font-mono);font-size:0.72rem;">
            <span style="padding:0.2rem 0.5rem;background:rgba(16, 185, 129, 0.20);border:1px solid var(--ink-primary);">Região 1: A[p .. i] ≤ x</span>
            <span style="padding:0.2rem 0.5rem;background:rgba(59, 130, 246, 0.20);border:1px solid var(--ink-primary);">Região 2: A[i+1 .. j-1] &gt; x</span>
            <span style="padding:0.2rem 0.5rem;background:var(--bg-card);border:1px solid var(--ink-primary);">Região 3: A[j .. r-1] irrestrita</span>
            <span style="padding:0.2rem 0.5rem;background:var(--accent-amber);border:1px solid var(--ink-primary);">Região 4: A[r] = x (pivô)</span>
          </div>
          <div class="canonical-callout note" style="margin:0;">
            <p style="margin:0;font-size:0.88rem;">${st.note}</p>
          </div>
        `;
        if (window.renderMathInElement) {
          try {
            window.renderMathInElement(stage, {
              delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false }
              ],
              throwOnError: false
            });
          } catch (e) {}
        }
      }

      window.resetMod5PartSim = function () {
        const sel = document.getElementById("mod5-part-scenario");
        const key = sel ? sel.value : "fig71";
        curPartSteps = buildPartitionSteps(partDatasets[key]);
        curPartIdx = 0;
        renderPartSim();
      };

      window.stepMod5PartSim = function (delta) {
        curPartIdx = Math.max(0, Math.min(curPartSteps.length - 1, curPartIdx + delta));
        renderPartSim();
      };

      window.switchMod5WorkbenchTab = function (tab) {
        const pHeap = document.getElementById("mod5-panel-heap");
        const pPart = document.getElementById("mod5-panel-part");
        const bHeap = document.getElementById("mod5-tab-heap");
        const bPart = document.getElementById("mod5-tab-part");
        if (!pHeap || !pPart || !bHeap || !bPart) return;
        if (tab === "heap") {
          pHeap.style.display = "block";
          pPart.style.display = "none";
          bHeap.className = "btn-primary-brutal";
          bPart.className = "btn-secondary-brutal";
        } else {
          pHeap.style.display = "none";
          pPart.style.display = "block";
          bHeap.className = "btn-secondary-brutal";
          bPart.className = "btn-primary-brutal";
        }
      };

      window.resetMod5HeapSim();
      window.resetMod5PartSim();
    },

    /* ======================================================================
       SEÇÃO 3: QUIZZES COM GABARITO COMENTADO (10 QUESTÕES — CAPS. 6 E 7)
       ====================================================================== */
    quizzes: [
      {
        id: "q5-1",
        type: "Múltipla Escolha",
        reference: "Cap. 6, Seção 6.1 e Exercícios 6.1-1, 6.1-2 e 6.1-7 (pp. 131–134)",
        question:
          "Sobre a estrutura de um heap binário de n elementos representado em um arranjo 1-indexado A[1 .. n] e um heap de altura h, assinale a alternativa CORRETA:",
        options: [
          {
            letter: "A",
            text: "Um heap de altura h possui no mínimo 2^h elementos e no máximo 2^(h+1) - 1 elementos; a altura de um heap de n elementos é ⌊lg n⌋; e as folhas ocupam exatamente os índices ⌊n/2⌋ + 1, ⌊n/2⌋ + 2, ..., n.",
            isCorrect: true,
            explanation:
              "Correta! Um heap de altura h tem todos os níveis de 0 até h-1 completos (somando 2^h - 1 nós) mais pelo menos 1 nó e no máximo 2^h nós no nível h, logo 2^h ≤ n ≤ 2^(h+1) - 1, o que implica h = ⌊lg n⌋. E como LEFT(i) = 2i > n para todo i ≥ ⌊n/2⌋ + 1, os nós de ⌊n/2⌋ + 1 até n são exatamente as folhas."
          },
          {
            letter: "B",
            text: "Um heap de altura h possui no mínimo h + 1 elementos e no máximo 2^h elementos; e as folhas ocupam os índices 1 até ⌊n/2⌋.",
            isCorrect: false,
            explanation:
              "Incorreta. Como o heap é uma árvore binária quase completa (e não uma cadeia degenerada), o nível h-1 já está totalmente preenchido com 2^h - 1 nós acumulados, e os índices de 1 a ⌊n/2⌋ são os nós internos, não as folhas."
          },
          {
            letter: "C",
            text: "Em um heap de máximo com elementos distintos, o menor elemento do conjunto pode residir em qualquer nó interno que não seja a raiz.",
            isCorrect: false,
            explanation:
              "Incorreta. Pelo Exercício 6.1-4, se todos os elementos são distintos, o menor elemento de um heap de máximo não pode ter filhos (pois seria maior que seus filhos), logo obrigatoriamente reside em uma das folhas A[⌊n/2⌋ + 1 .. n]."
          },
          {
            letter: "D",
            text: "Os atributos A.comprimento e A.tamanho-do-heap têm sempre o mesmo valor durante todas as iterações do algoritmo HEAPSORT.",
            isCorrect: false,
            explanation:
              "Incorreta. Enquanto A.comprimento permanece fixo em n, o atributo A.tamanho-do-heap é decrementado em 1 unidade a cada iteração do laço do HEAPSORT (linha 4) à medida que os maiores elementos são colocados em A[i .. n]."
          }
        ]
      },
      {
        id: "q5-2",
        type: "Múltipla Escolha",
        reference: "Cap. 6, Seção 6.2 (pp. 134–136) — Análise de MAX-HEAPIFY",
        question:
          "Na análise da recorrência T(n) ≤ T(2n/3) + Θ(1) do procedimento MAX-HEAPIFY(A, i) sobre uma subárvore de tamanho n, de onde vem a fração máxima 2n/3 para o tamanho da subárvore de um dos filhos de i?",
        options: [
          {
            letter: "A",
            text: "Vem do fato de que um heap binário possui três filhos por nó e dois terços dos nós ficam à esquerda.",
            isCorrect: false,
            explanation:
              "Incorreta. Um heap binário tem no máximo 2 filhos por nó (LEFT(i) e RIGHT(i))."
          },
          {
            letter: "B",
            text: "Ocorre no pior caso de desequilíbrio de uma árvore binária quase completa, quando a última linha da árvore está exatamente metade cheia: toda a última linha (com 2^h folhas) pertence à subárvore esquerda (que fica com 2^(h+1) - 1 nós), enquanto a subárvore direita tem 2^h - 1 nós, resultando na razão (2^(h+1) - 1)/(3·2^h - 1) < 2/3.",
            isCorrect: true,
            explanation:
              "Correta! Como demonstrado na página 135, quando o último nível da árvore está exatamente metade cheio, a subárvore esquerda possui uma camada inteira de folhas a mais que a subárvore direita, atingindo no limite 2/3 dos nós totais da subárvore."
          },
          {
            letter: "C",
            text: "Vem da aplicação do Caso 3 do Teorema Mestre para recorrências com 2 chamadas recursivas.",
            isCorrect: false,
            explanation:
              "Incorreta. MAX-HEAPIFY faz apenas a = 1 chamada recursiva (para o filho indexado por 'maior') e resolve-se pelo Caso 2 do Teorema Mestre."
          },
          {
            letter: "D",
            text: "A fração 2n/3 ocorre apenas quando todos os elementos do heap são iguais e MAX-HEAPIFY não faz nenhuma troca.",
            isCorrect: false,
            explanation:
              "Incorreta. Se todos os elementos são iguais, A[l] > A[i] e A[r] > A[maior] são falsos, maior = i e MAX-HEAPIFY termina imediatamente em Θ(1) sem chamada recursiva."
          }
        ]
      },
      {
        id: "q5-3",
        type: "Múltipla Escolha",
        reference: "Cap. 6, Seção 6.3 (pp. 137–139) — Complexidade de BUILD-MAX-HEAP",
        question:
          "Por que o procedimento BUILD-MAX-HEAP(A) constrói um heap de máximo em tempo linear O(n), em vez de Θ(n lg n)?",
        options: [
          {
            letter: "A",
            text: "Porque BUILD-MAX-HEAP chama MAX-HEAPIFY apenas uma única vez, exclusivamente sobre a raiz A[1].",
            isCorrect: false,
            explanation:
              "Incorreta. BUILD-MAX-HEAP chama MAX-HEAPIFY para todos os nós internos i = ⌊n/2⌋ downto 1 (isto é, ⌊n/2⌋ chamadas)."
          },
          {
            letter: "B",
            text: "Porque cada chamada a MAX-HEAPIFY dentro de BUILD-MAX-HEAP é garantida para terminar em tempo constante O(1), sem nunca descer mais de 1 nível.",
            isCorrect: false,
            explanation:
              "Incorreta. Chamadas a MAX-HEAPIFY em nós próximos à raiz podem descer até Θ(lg n) níveis."
          },
          {
            letter: "C",
            text: "Porque um nó de altura h exige tempo O(h) e existem no máximo ⌈n / 2^(h+1)⌉ nós de altura h; como a série ∑_{h=0..∞} (h / 2^h) converge para a constante 2, a soma total de trabalho é O(n · ∑ h/2^h) = O(n).",
            isCorrect: true,
            explanation:
              "Correta! Esta é a demonstração exata das páginas 138–139: a maioria dos nós tem altura muito pequena (metade são folhas com h=0, um quarto tem h=1, um oitavo tem h=2, etc.), e a série aritmético-geométrica ∑ h/2^h converge para 2."
          },
          {
            letter: "D",
            text: "Porque o arranjo de entrada já vem parcialmente ordenado na metade direita A[⌊n/2⌋ + 1 .. n].",
            isCorrect: false,
            explanation:
              "Incorreta. Os elementos em A[⌊n/2⌋ + 1 .. n] podem estar em qualquer ordem; eles são heaps triviais apenas porque não possuem filhos na árvore."
          }
        ]
      },
      {
        id: "q5-4",
        type: "Verdadeiro ou Falso",
        reference: "Cap. 6, Problema 6-1 (p. 146) — Construção de Heap usando Inserção",
        question:
          "[ VERDADEIRO OU FALSO ] O procedimento alternativo BUILD-MAX-HEAP'(A), que começa com A.tamanho-do-heap = 1 e executa um laço for i = 2 to A.comprimento chamando MAX-HEAP-INSERT(A, A[i]), sempre produz exatamente o mesmo heap final que o BUILD-MAX-HEAP(A) de baixo para cima e também executa em tempo Θ(n) no pior caso.",
        options: [
          {
            letter: "V",
            text: "Verdadeiro — Inserir elementos um a um de cima para baixo é matematicamente idêntico a chamar MAX-HEAPIFY de baixo para cima e mantém a complexidade linear Θ(n).",
            isCorrect: false,
            explanation:
              "Incorreta! Ambas as afirmações são falsas (Problema 6-1, p. 146): (a) Para A = ⟨1, 2, 3⟩, BUILD-MAX-HEAP produz ⟨3, 2, 1⟩ enquanto BUILD-MAX-HEAP' produz ⟨3, 1, 2⟩; (b) para um arranjo em ordem estritamente crescente ⟨1, 2, ..., n⟩, cada inserção sobe até a raiz, levando tempo de pior caso Θ(n lg n)!"
          },
          {
            letter: "F",
            text: "Falso — BUILD-MAX-HEAP' pode produzir um heap diferente do BUILD-MAX-HEAP para o mesmo arranjo de entrada (por exemplo, A = ⟨1, 2, 3⟩) e, no pior caso (arranjo estritamente crescente), requer tempo Θ(n lg n) em vez de O(n).",
            isCorrect: true,
            explanation:
              "Correta! Quando inserimos chaves em ordem crescente com MAX-HEAP-INSERT, cada nova folha inserida na profundidade ⌊lg i⌋ é maior que todos os elementos anteriores e precisa subir todo o caminho até a raiz, somando ∑_{i=2..n} Θ(lg i) = Θ(n lg n)."
          }
        ]
      },
      {
        id: "q5-5",
        type: "Múltipla Escolha",
        reference: "Cap. 6, Seção 6.5 (pp. 142–145) — Filas de Prioridades",
        question:
          "Considere as operações de fila de prioridade máxima implementadas com um heap binário de n elementos na Seção 6.5. Qual é a sequência correta de ações executada por MAX-HEAP-INSERT(A, chave) e qual é o seu tempo de execução?",
        options: [
          {
            letter: "A",
            text: "Coloca 'chave' diretamente na raiz A[1], empurra a antiga raiz para o final do arranjo e chama BUILD-MAX-HEAP(A) em tempo O(n).",
            isCorrect: false,
            explanation:
              "Incorreta. Chamar BUILD-MAX-HEAP a cada inserção custaria O(n) em vez de O(lg n)."
          },
          {
            letter: "B",
            text: "Incrementa A.tamanho-do-heap, inicializa a nova folha A[A.tamanho-do-heap] = -∞ e em seguida chama HEAP-INCREASE-KEY(A, A.tamanho-do-heap, chave), que sobe pelo caminho de pais até restaurar o heap em tempo O(lg n).",
            isCorrect: true,
            explanation:
              "Correta! Ao atribuir inicialmente -∞ à nova folha, garante-se que a pré-condição chave ≥ A[i] de HEAP-INCREASE-KEY seja satisfeita para qualquer chave real, e a subida pelo caminho de pais leva tempo O(lg n)."
          },
          {
            letter: "C",
            text: "Incrementa A.tamanho-do-heap, coloca 'chave' em A[A.tamanho-do-heap] e chama MAX-HEAPIFY(A, A.tamanho-do-heap) em tempo O(1).",
            isCorrect: false,
            explanation:
              "Incorreta. MAX-HEAPIFY flutua elementos para baixo (para os filhos), mas uma folha recém-inserida não tem filhos; ela precisa subir em direção aos ancestrais via HEAP-INCREASE-KEY."
          },
          {
            letter: "D",
            text: "Procura linearmente a posição ordenada da chave no arranjo A e desloca todos os elementos menores uma posição para a direita em tempo Θ(n).",
            isCorrect: false,
            explanation:
              "Incorreta. Isso seria um arranjo ordenado comum (inserção do INSERTION-SORT), não um heap binário."
          }
        ]
      },
      {
        id: "q5-6",
        type: "Múltipla Escolha",
        reference: "Cap. 7, Seção 7.1 (pp. 149–150) — Invariante de PARTITION",
        question:
          "Durante a execução do laço for j = p to r - 1 do procedimento PARTITION(A, p, r) de Lomuto (com pivô x = A[r]), qual das seguintes afirmações descreve exatamente as regiões do subarranjo A[p .. r] no início de cada iteração?",
        options: [
          {
            letter: "A",
            text: "A[p .. i] contém elementos ≤ x; A[i + 1 .. j - 1] contém elementos > x; A[j .. r - 1] contém elementos ainda não examinados; e A[r] = x.",
            isCorrect: true,
            explanation:
              "Correta! Este é exatamente o invariante das 4 regiões demonstrado na Figura 7.2 e nas páginas 149–150."
          },
          {
            letter: "B",
            text: "A[p .. i] está completamente ordenado em ordem crescente; A[i + 1 .. r - 1] está ordenado em ordem decrescente; e A[r] = x.",
            isCorrect: false,
            explanation:
              "Incorreta. PARTITION apenas separa os elementos em ≤ x e > x, sem ordenar internamente nenhuma das duas regiões."
          },
          {
            letter: "C",
            text: "A[p .. j - 1] contém elementos ≤ x e A[j .. r] contém elementos > x.",
            isCorrect: false,
            explanation:
              "Incorreta. Os elementos em A[p .. j - 1] estão subdivididos pelo índice i em dois grupos: A[p .. i] (≤ x) e A[i + 1 .. j - 1] (> x)."
          },
          {
            letter: "D",
            text: "O pivô x muda de valor a cada vez que A[j] ≤ x é verdadeiro.",
            isCorrect: false,
            explanation:
              "Incorreta. O pivô x permanece fixo em A[r] durante todo o laço for e só é trocado com A[i + 1] na linha 8, após o término do laço."
          }
        ]
      },
      {
        id: "q5-7",
        type: "Múltipla Escolha",
        reference: "Cap. 7, Seção 7.2 (pp. 151–154) — Desempenho do Quicksort",
        question:
          "Suponha que o procedimento PARTITION do Quicksort produza sempre uma divisão proporcional de 99-para-1 (isto é, um subarranjo com 99n/100 elementos e outro com n/100 elementos). Qual será o tempo de execução assintótico T(n) do Quicksort nesse cenário?",
        options: [
          {
            letter: "A",
            text: "Θ(n²), porque uma divisão de 99-para-1 é quase tão desbalanceada quanto o pior caso de (n - 1)-para-0.",
            isCorrect: false,
            explanation:
              "Incorreta! Qualquer divisão de proporção constante α-para-(1 - α) com 0 < α < 1 gera uma árvore de recursão de profundidade logarítmica Θ(lg n) e custo total Θ(n lg n)."
          },
          {
            letter: "B",
            text: "Θ(n lg n), pois na árvore de recursão de T(n) = T(99n/100) + T(n/100) + cn cada nível soma no máximo cn e o caminho mais longo até atingir tamanho 1 tem profundidade log_{100/99}(n) = Θ(lg n).",
            isCorrect: true,
            explanation:
              "Correta! Como explicado na Seção 7.2 (pp. 152–153), mudar a base do logaritmo de 2 para 100/99 altera apenas o fator constante (pois log_{100/99} n = lg n / lg(100/99) = Θ(lg n)), mantendo o tempo total em Θ(n lg n)."
          },
          {
            letter: "C",
            text: "Θ(n), pois o ramo de tamanho n/100 chega às folhas em muito poucos passos.",
            isCorrect: false,
            explanation:
              "Incorreta. Mesmo o ramo mais curto tem profundidade log_{100} n = Θ(lg n) níveis com custo cn completo."
          },
          {
            letter: "D",
            text: "Θ(n^(99/100)), pelo Caso 1 do Teorema Mestre.",
            isCorrect: false,
            explanation:
              "Incorreta. O Teorema Mestre padrão não se aplica diretamente a subproblemas de tamanhos diferentes, mas a árvore de recursão e o método de substituição provam que T(n) = Θ(n lg n)."
          }
        ]
      },
      {
        id: "q5-8",
        type: "Verdadeiro ou Falso",
        reference: "Cap. 7, Seções 7.2 e 7.3 (pp. 151, 154–155)",
        question:
          "[ VERDADEIRO OU FALSO ] Quando o arranjo de entrada A[1 .. n] já está completamente ordenado em ordem crescente, o QUICKSORT determinístico (Seção 7.1) executa em seu pior caso Θ(n²), enquanto o INSERTION-SORT executa em seu melhor caso Θ(n); ao adotarmos o RANDOMIZED-QUICKSORT (Seção 7.3), nenhuma entrada específica consegue mais forçar o comportamento de pior caso.",
        options: [
          {
            letter: "V",
            text: "Verdadeiro — No arranjo crescente, PARTITION(A, p, r) escolhe sempre o maior elemento A[r] como pivô, gerando partições de tamanho n - 1 e 0 em Θ(n²); já no RANDOMIZED-QUICKSORT o pivô é amostrado uniformemente com RANDOM(p, r), tornando o desempenho independente da ordenação inicial da entrada.",
            isCorrect: true,
            explanation:
              "Correta! Esta é uma das comparações mais importantes destacou pelos autores nas páginas 151 e 155."
          },
          {
            letter: "F",
            text: "Falso — O QUICKSORT determinístico detecta automaticamente que o arranjo já está ordenado e termina em tempo linear Θ(n).",
            isCorrect: false,
            explanation:
              "Incorreta. O QUICKSORT determinístico com partição de Lomuto faz todas as comparações em cada nível e degrada para Θ(n²) em entradas já ordenadas."
          }
        ]
      },
      {
        id: "q5-9",
        type: "Múltipla Escolha",
        reference: "Cap. 7, Seção 7.4.2 (pp. 157–159) — Análise do Caso Esperado do Quicksort",
        question:
          "Na análise do tempo esperado de RANDOMIZED-QUICKSORT sobre n elementos distintos z₁ < z₂ < ... < zₙ, considere o subconjunto Z_{ij} = {zᵢ, zᵢ₊₁, ..., zⱼ} para i < j. Qual é a condição necessária e suficiente para que zᵢ e zⱼ sejam comparados em algum momento da execução, e qual é a probabilidade exata desse evento?",
        options: [
          {
            letter: "A",
            text: "Eles são comparados se e somente se j = i + 1 (elementos adjacentes na ordem final), com probabilidade 1/n.",
            isCorrect: false,
            explanation:
              "Incorreta. Elementos não adjacentes (como 7 e 9 quando 7 é o primeiro pivô) também são comparados; e elementos adjacentes são sempre comparados com probabilidade 2/(1 + 1) = 1!"
          },
          {
            letter: "B",
            text: "Eles são comparados se e somente se o primeiro elemento escolhido como pivô a partir do conjunto Z_{ij} for zᵢ ou zⱼ; como Z_{ij} possui j - i + 1 elementos igualmente prováveis de serem o primeiro pivô escolhido desse conjunto, a probabilidade é 2 / (j - i + 1).",
            isCorrect: true,
            explanation:
              "Correta! Se qualquer elemento estritamente entre zᵢ e zⱼ for escolhido como pivô primeiro, ele separa zᵢ e zⱼ em partições distintas e eles jamais se encontram. Se zᵢ ou zⱼ for o primeiro pivô escolhido em Z_{ij} (eventos mutuamente exclusivos de probabilidade 1/(j - i + 1) cada), ele compara-se com todos os demais elementos de Z_{ij}. Logo Pr = 2/(j - i + 1)."
          },
          {
            letter: "C",
            text: "Eles são comparados em todas as chamadas recursivas, com probabilidade 1 / (j - i)².",
            isCorrect: false,
            explanation:
              "Incorreta. Dois elementos são comparados no máximo uma vez em toda a execução, e a probabilidade decai harmonicamente como 2/(j - i + 1)."
          },
          {
            letter: "D",
            text: "Eles são comparados apenas se zᵢ for escolhido como o primeiro pivô de todo o arranjo A[1 .. n], com probabilidade 2/n.",
            isCorrect: false,
            explanation:
              "Incorreta. Pivôs escolhidos fora de Z_{ij} (menores que zᵢ ou maiores que zⱼ) mantêm todo o conjunto Z_{ij} junto na mesma subchamada recursiva; o que importa é unicamente qual elemento dentro de Z_{ij} é escolhido primeiro como pivô."
          }
        ]
      },
      {
        id: "q5-10",
        type: "Múltipla Escolha",
        reference: "Cap. 7, Problemas 7-1 e 7-4 (pp. 160–163) — Hoare e Profundidade de Pilha",
        question:
          "Sobre a Partição de Hoare (Problema 7-1) e o controle da profundidade de pilha em TAIL-RECURSIVE-QUICKSORT (Problema 7-4), assinale a alternativa CORRETA:",
        options: [
          {
            letter: "A",
            text: "Em HOARE-PARTITION(A, p, r), o índice j retornado satisfaz p ≤ j < r e garante que todo elemento de A[p .. j] é ≤ todo elemento de A[j + 1 .. r] (portanto QUICKSORT recursa em A[p .. q] e A[q + 1 .. r]); e no Problema 7-4, para limitar a pilha a Θ(lg n) no pior caso, devemos sempre fazer a chamada recursiva na MENOR partição e iterar em cauda na MAIOR partição.",
            isCorrect: true,
            explanation:
              "Correta! Em HOARE-PARTITION o pivô original A[p] fica incluído em uma das duas metades (logo recursamos em p..q e q+1..r). E em TAIL-RECURSIVE-QUICKSORT, ao recursar apenas no menor subarranjo (que tem no máximo metade do tamanho atual), a profundidade da pilha nunca ultrapassa lg n, garantindo espaço O(lg n) mesmo no pior caso!"
          },
          {
            letter: "B",
            text: "Basta eliminar a segunda chamada recursiva com um laço while p < r (recursando sempre em A[p .. q - 1]) para que a profundidade de pilha no pior caso caia automaticamente para Θ(lg n).",
            isCorrect: false,
            explanation:
              "Incorreta! Como mostra o item (b) do Problema 7-4, se recursarmos sempre na primeira partição A[p .. q - 1] e a partição produzir sempre q = r (subproblema esquerdo de tamanho n - 1), a pilha ainda atingirá profundidade Θ(n)!"
          },
          {
            letter: "C",
            text: "HOARE-PARTITION coloca o pivô em sua posição final exata A[j] e nunca move o elemento A[p].",
            isCorrect: false,
            explanation:
              "Incorreta. HOARE-PARTITION inicializa x = A[p], i = p - 1, j = r + 1 e já na primeira iteração troca A[p] com um elemento ≤ x vindo da direita."
          },
          {
            letter: "D",
            text: "Modificar TAIL-RECURSIVE-QUICKSORT para recursar na menor partição aumenta o tempo de execução esperado de O(n lg n) para Θ(n²).",
            isCorrect: false,
            explanation:
              "Incorreta. Os mesmos subproblemas são resolvidos com exatamente as mesmas comparações; o tempo esperado permanece O(n lg n) enquanto a pilha de pior caso cai de Θ(n) para Θ(lg n)."
          }
        ]
      }
    ],

    /* ======================================================================
       SEÇÃO 4: EXERCÍCIOS E PROBLEMAS CANÔNICOS RESOLVIDOS (8 EXERCÍCIOS)
       ====================================================================== */
    exercicios: [
      {
        id: "ex5-1",
        code: "EXERCÍCIO 01 • ESTRUTURA DE HEAPS E ÍNDICES DAS FOLHAS",
        reference: "Exercícios 6.1-1, 6.1-2 e 6.1-7 (pp. 133–134)",
        title: "Limites de Elementos por Altura, Altura ⌊lg n⌋ e Prova dos Índices das Folhas",
        prompt: `
          <p>Resolva formalmente o trio fundamental de exercícios estruturais da Seção 6.1:</p>
          <ol>
            <li><strong>(Exercício 6.1-1)</strong> Quais são os números mínimo e máximo de elementos em um heap de altura $h$?</li>
            <li><strong>(Exercício 6.1-2)</strong> Mostre que um heap de $n$ elementos tem altura $\\lfloor \\lg n \\rfloor$.</li>
            <li><strong>(Exercício 6.1-7)</strong> Mostre que, com a representação de arranjo para armazenar um heap de $n$ elementos, as folhas são exatamente os nós indexados por $\\lfloor n/2 \\rfloor + 1, \\lfloor n/2 \\rfloor + 2, \\dots, n$.</li>
          </ol>
        `,
        placeholder:
          "Demonstre os limites 2^h ≤ n ≤ 2^(h+1) - 1, extraia o logaritmo na base 2 para obter h = ⌊lg n⌋ e use LEFT(i) = 2i para caracterizar as folhas...",
        solution: `
          <h4>1. Números Mínimo e Máximo de Elementos em um Heap de Altura $h$ (Ex. 6.1-1)</h4>
          <p>Por definição, um heap de altura $h$ é uma árvore binária quase completa com $h$ arestas no caminho mais longo da raiz até uma folha (logo, possui os níveis $0, 1, \\dots, h$). Todos os níveis de $0$ até $h - 1$ estão completamente cheios, contendo juntos:</p>
          $$\\sum_{k=0}^{h-1} 2^k = 2^h - 1 \\text{ elementos.}$$
          <ul>
            <li><strong>Número mínimo:</strong> Ocorre quando o último nível (nível $h$) contém apenas <strong>$1$ único elemento</strong>:
              $$n_{\\min} = (2^h - 1) + 1 = \\mathbf{2^h}.$$</li>
            <li><strong>Número máximo:</strong> Ocorre quando o último nível (nível $h$) está completamente cheio com <strong>$2^h$ elementos</strong>:
              $$n_{\\max} = (2^h - 1) + 2^h = \\mathbf{2^{h+1} - 1}.$$</li>
          </ul>

          <h4>2. Prova de que um Heap de $n$ Elementos tem Altura $\\lfloor \\lg n \\rfloor$ (Ex. 6.1-2)</h4>
          <p>Pelo resultado do Exercício 6.1-1, se um heap de $n$ elementos possui altura $h$, então $n$ satisfaz a desigualdade dupla:</p>
          $$2^h \\le n \\le 2^{h+1} - 1 < 2^{h+1}.$$
          <p>Tomando o logaritmo na base $2$ ($\\lg$, que é uma função estritamente crescente) em toda a desigualdade:</p>
          $$h \\le \\lg n < h + 1.$$
          <p>Como $h$ é um número inteiro, a única solução inteira para $h \\le \\lg n < h + 1$ é, pela definição da função piso (Equação 3.3), <strong>$h = \\lfloor \\lg n \\rfloor$</strong>. $\\blacksquare$</p>

          <h4>3. Prova de que as Folhas são os Nós $\\lfloor n/2 \\rfloor + 1, \\dots, n$ (Ex. 6.1-7)</h4>
          <p>Em uma árvore binária quase completa preenchida da esquerda para a direita em $A[1 \\dots n]$, um nó de índice $i$ é uma <strong>folha</strong> se, e somente se, ele não possui filho esquerdo no heap — isto é, se e somente se $\\text{LEFT}(i) > n$:</p>
          <ul>
            <li>Para qualquer índice $i \\in \\{\\lfloor n/2 \\rfloor + 1, \\lfloor n/2 \\rfloor + 2, \\dots, n\\}$, temos:
              $$\\text{LEFT}(i) = 2i \\ge 2(\\lfloor n/2 \\rfloor + 1) = 2\\lfloor n/2 \\rfloor + 2 > 2\\left(\\frac{n}{2} - \\frac{1}{2}\\right) + 2 = n + 1 > n.$$
              Logo, nenhum desses nós possui filho esquerdo (nem direito, pois $2i + 1 > 2i > n$), sendo todos <strong>folhas</strong>.</li>
            <li>Reciprocamente, para qualquer índice $i \\in \\{1, 2, \\dots, \\lfloor n/2 \\rfloor\\}$, temos:
              $$\\text{LEFT}(i) = 2i \\le 2\\lfloor n/2 \\rfloor \\le n,$$
              logo o nó $i$ possui pelo menos o filho esquerdo $A[2i]$ dentro do heap e, portanto, é um <strong>nó interno</strong> (não folha). $\\blacksquare$</li>
          </ul>
        `
      },
      {
        id: "ex5-2",
        code: "EXERCÍCIO 02 • MAX-HEAPIFY ITERATIVO (ELIMINAÇÃO DE RECURSÃO DE CAUDA)",
        reference: "Exercício 6.2-5 (p. 136)",
        title: "Reescrevendo MAX-HEAPIFY(A, i) com um Laço Iterativo Eficiente",
        prompt: `
          <p><strong>(Exercício 6.2-5)</strong> O código para <code>MAX-HEAPIFY</code> é bastante eficiente em termos de fatores constantes, exceto possivelmente para a chamada recursiva na linha 10, que poderia fazer com que alguns compiladores produzissem código ineficiente (empilhando quadros de ativação em cada nível). Escreva um procedimento <code>ITERATIVE-MAX-HEAPIFY(A, i)</code> eficiente que use um constructo de controle iterativo (um laço <code>while</code>) em vez de recursão.</p>
        `,
        placeholder:
          "Escreva o pseudocódigo de ITERATIVE-MAX-HEAPIFY(A, i) usando um laço while e explique por que ele realiza exatamente as mesmas trocas em espaço auxiliar O(1)...",
        solution: `
          <h4>1. Pseudocódigo de <code>ITERATIVE-MAX-HEAPIFY(A, i)</code></h4>
          <p>Como a chamada recursiva <code>MAX-HEAPIFY(A, maior)</code> na linha 10 é a última instrução do procedimento (uma <strong>recursão de cauda</strong>), podemos substituí-la diretamente por um laço <code>while TRUE</code> que atualiza $i = \\text{maior}$ quando há troca, ou executa <code>return</code> assim que $\\text{maior} == i$:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">ITERATIVE-MAX-HEAPIFY(A, i)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">while</span> TRUE</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    l = LEFT(i)</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    r = RIGHT(i)</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">if</span> l ≤ A.tamanho-do-heap <span class="kw">e</span> A[l] &gt; A[i]</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">        maior = l</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">    <span class="kw">else</span> maior = i</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    <span class="kw">if</span> r ≤ A.tamanho-do-heap <span class="kw">e</span> A[r] &gt; A[maior]</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">        maior = r</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">    <span class="kw">if</span> maior == i</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">        <span class="kw">return</span></span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">    troque A[i] com A[maior]</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">    i = maior</span></div>
            </div>
          </div>

          <h4>2. Análise de Eficiência</h4>
          <p>O procedimento executa em tempo $O(\\lg n)$ (ou $O(h)$, onde $h$ é a altura inicial do nó $i$) e utiliza <strong>espaço auxiliar estritamente $O(1)$</strong> (apenas os registradores locais $i, l, r, \\text{maior}$), eliminando completamente a sobrecarga de chamadas de função e alocação de quadros na pilha de execução.</p>
        `
      },
      {
        id: "ex5-3",
        code: "EXERCÍCIO 03 • COMPORTAMENTO DE HEAPSORT EM ENTRADAS JÁ ORDENADAS",
        reference: "Exercício 6.4-3 (p. 140)",
        title: "Tempo de Execução de HEAPSORT para Arranjo em Ordem Crescente e Decrescente",
        prompt: `
          <p><strong>(Exercício 6.4-3)</strong> Qual é o tempo de execução de <code>HEAPSORT</code> para um arranjo $A$ de comprimento $n$ (com elementos distintos) que já está ordenado em <strong>ordem crescente</strong>? E em <strong>ordem decrescente</strong>? Justifique detalhadamente analisando as duas fases do algoritmo (<code>BUILD-MAX-HEAP</code> e o laço de $n - 1$ extrações).</p>
        `,
        placeholder:
          "Analise o que acontece no laço de extração (linhas 2-5 de HEAPSORT) tanto quando A começa crescente quanto quando A começa decrescente...",
        solution: `
          <h4>Resposta: Em AMBOS os casos (crescente e decrescente), o tempo de execução é $\\mathbf{\\Theta(n \\lg n)}$!</h4>
          <p>A razão fundamental é que, independentemente de a entrada inicial estar em ordem crescente ou decrescente, a linha 1 de <code>HEAPSORT</code> converte o arranjo em um <strong>heap de máximo</strong> (em tempo $O(n)$), e a partir daí a fase de extração (linhas 2–5) é obrigada a mover elementos pequenos da base da árvore para a raiz $A[1]$ e afundá-los de volta por $\\Theta(\\lg i)$ níveis:</p>

          <ol>
            <li><strong>Caso 1: Arranjo inicialmente em ordem crescente ($A[1] < A[2] < \\dots < A[n]$):</strong>
              <ul>
                <li>Na Fase 1, <code>BUILD-MAX-HEAP(A)</code> leva tempo $\\Theta(n)$ (de fato, é o pior caso de <code>BUILD-MAX-HEAP</code>, mas ainda limitado por $O(n)$) e produz um heap de máximo válido.</li>
                <li>Na Fase 2 (laço <code>for i = n downto 2</code>), em cada iteração trocamos o maior elemento atual $A[1]$ com uma folha $A[i]$ (que pertence à metade inferior dos elementos e, portanto, é pequena) e chamamos <code>MAX-HEAPIFY(A, 1)</code>, que afunda esse elemento pequeno quase até a base da árvore em $\\Theta(\\lg i)$ passos. Somando para $i = n$ até $2$:
                  $$\\sum_{i=2}^{n} \\Theta(\\lg i) = \\Theta(\\lg(n!)) = \\mathbf{\\Theta(n \\lg n)}.$$</li>
              </ul>
            </li>
            <li><strong>Caso 2: Arranjo inicialmente em ordem decrescente ($A[1] > A[2] > \\dots > A[n]$):</strong>
              <ul>
                <li>Na Fase 1, o arranjo em ordem decrescente <strong>já é um heap de máximo</strong>! Portanto, cada chamada de <code>MAX-HEAPIFY</code> dentro de <code>BUILD-MAX-HEAP</code> faz $0$ trocas, mas ainda avalia seus filhos em $\\Theta(1)$, gastando $\\Theta(n)$ no total.</li>
                <li>Na Fase 2, porém, embora $A$ já fosse um heap de máximo, o laço <code>for i = n downto 2</code> coloca os menores elementos (das folhas $A[i]$) na raiz $A[1]$ e chama <code>MAX-HEAPIFY(A, 1)</code>, que novamente percorre $\\Theta(\\lg i)$ níveis até a base da árvore em cada uma das $n - 1$ extrações! Logo, a Fase 2 gasta novamente $\\sum_{i=2}^{n} \\Theta(\\lg i) = \\mathbf{\\Theta(n \\lg n)}$.</li>
              </ul>
            </li>
          </ol>
        `
      },
      {
        id: "ex5-4",
        code: "EXERCÍCIO 04 • REMOÇÃO ARBITRÁRIA EM HEAP (HEAP-DELETE)",
        reference: "Exercício 6.5-8 (p. 145)",
        title: "Projetando a Operação HEAP-DELETE(A, i) em Tempo O(lg n)",
        prompt: `
          <p><strong>(Exercício 6.5-8)</strong> A operação <code>HEAP-DELETE(A, i)</code> elimina o item no nó $i$ do heap $A$. Dê uma implementação correta de <code>HEAP-DELETE</code> que é executada no tempo $O(\\lg n)$ para um heap de máximo de $n$ elementos.</p>
          <p><em>Atenção a uma armadilha clássica:</em> Quando substituímos $A[i]$ pelo último elemento do heap $x = A[A.\\text{tamanho-do-heap}]$, $x$ é sempre menor que $A[\\text{PARENT}(i)]$? Ou $x$ pode ser maior que $A[\\text{PARENT}(i)]$?</p>
        `,
        placeholder:
          "Escreva o pseudocódigo de HEAP-DELETE(A, i) tratando tanto o caso em que o substituto é maior que a chave removida (ou maior que o pai) quanto o caso em que é menor...",
        solution: `
          <h4>1. A Armadilha Clássica e Por Que Há Dois Casos</h4>
          <p>Em <code>HEAP-EXTRACT-MAX</code>, removemos sempre a <em>raiz</em> $A[1]$ e colocamos $A[A.\\text{tamanho-do-heap}]$ na raiz; como a raiz não tem pai, a única direção possível de violação é para baixo (chamando <code>MAX-HEAPIFY(A, 1)</code>).</p>
          <p>Porém, ao remover um nó arbitrário $i$ (digamos, uma folha profunda na subárvore esquerda com valor muito pequeno) e colocar em seu lugar o último elemento do heap $x = A[A.\\text{tamanho-do-heap}]$ (que pode estar um nível acima na subárvore direita e ter um valor muito grande!), <strong>a nova chave em $A[i]$ pode ser maior que $A[\\text{PARENT}(i)]$</strong>! Portanto:</p>
          <ul>
            <li>Se o último elemento $x = A[A.\\text{tamanho-do-heap}]$ for <strong>maior</strong> que o elemento removido $A[i]$, precisamos subir no heap chamando <code>HEAP-INCREASE-KEY(A, i, x)</code>.</li>
            <li>Se $x \\le A[i]$ (o novo valor é menor ou igual ao antigo valor em $A[i]$, que já era $\\le A[\\text{PARENT}(i)]$), ele jamais violará a relação com seu pai; basta gravar $A[i] = x$ e afundá-lo chamando <code>MAX-HEAPIFY(A, i)</code>!</li>
          </ul>

          <h4>2. Pseudocódigo Completo de <code>HEAP-DELETE(A, i)</code> em $O(\\lg n)$</h4>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">HEAP-DELETE(A, i)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">x = A[A.tamanho-do-heap]</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">A.tamanho-do-heap = A.tamanho-do-heap - 1</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">if</span> i &gt; A.tamanho-do-heap</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">return</span> <span class="cmt">// O nó removido já era o último elemento!</span></span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">if</span> x &gt; A[i]</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">    HEAP-INCREASE-KEY(A, i, x)</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">else</span></span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">    A[i] = x</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">    MAX-HEAPIFY(A, i)</span></div>
            </div>
          </div>

          <p><strong>Complexidade:</strong> Tanto <code>HEAP-INCREASE-KEY</code> quanto <code>MAX-HEAPIFY</code> executam em tempo $O(\\lg n)$, logo <code>HEAP-DELETE(A, i)</code> executa em tempo <strong>$O(\\lg n)$</strong>.</p>
        `
      },
      {
        id: "ex5-5",
        code: "EXERCÍCIO 05 • PARTITION COM ELEMENTOS IGUAIS",
        reference: "Exercício 7.1-2 (p. 150)",
        title: "Valor de q Quando Todos os Elementos de A[p .. r] Têm o Mesmo Valor",
        prompt: `
          <p><strong>(Exercício 7.1-2)</strong> Qual valor de $q$ <code>PARTITION(A, p, r)</code> retorna quando todos os elementos no arranjo $A[p \\dots r]$ têm o mesmo valor? Modifique <code>PARTITION</code> de modo que $q = \\lfloor (p + r)/2 \\rfloor$ quando todos os elementos no arranjo $A[p \\dots r]$ têm o mesmo valor.</p>
        `,
        placeholder:
          "Rastreie o laço for j = p to r - 1 quando A[j] == x sempre satisfaz A[j] ≤ x, determine o retorno q e mostre como alternar o caso de igualdade...",
        solution: `
          <h4>1. Valor Retornado pelo <code>PARTITION</code> Original: $q = r$</h4>
          <p>Quando todos os elementos de $A[p \\dots r]$ têm o mesmo valor $x = A[r]$, a condição <code>if A[j] ≤ x</code> na linha 5 é <strong>verdadeira em todas as $r - p$ iterações</strong> do laço <code>for j = p to r - 1</code>. Consequentemente, $i$ (que começou em $p - 1$) é incrementado $r - p$ vezes, terminando com:</p>
          $$i = (p - 1) + (r - p) = r - 1.$$
          <p>Na linha 9, o procedimento retorna $i + 1 = (r - 1) + 1 = \\mathbf{r}$! (Isso produz a pior divisão possível para o <code>QUICKSORT</code>: um subarranjo esquerdo de tamanho $n - 1$ e um direito de tamanho $0$, levando a $\\Theta(n^2)$ quando todas as chaves são iguais!)</p>

          <h4>2. Modificação de <code>PARTITION</code> para Retornar $q = \\lfloor (p + r)/2 \\rfloor$</h4>
          <p>Se todos os elementos são iguais, queremos que o índice $i$ seja incrementado exatamente <strong>na metade das vezes</strong> em que encontramos $A[j] == x$ (distribuindo chaves iguais alternadamente entre a Região 1 à esquerda e a Região 2 à direita), enquanto para $A[j] < x$ continuamos incrementando $i$ sempre. Usamos uma variável booleana/contador de paridade <code>turno</code>:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">PARTITION-BALANCED-EQUALS(A, p, r)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">x = A[r]</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">i = p - 1</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">paridade = 0</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">for</span> j = p <span class="kw">to</span> r - 1</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">if</span> A[j] == x</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">        paridade = 1 - paridade</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    <span class="kw">if</span> A[j] &lt; x <span class="kw">ou</span> (A[j] == x <span class="kw">e</span> paridade == 0)</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">        i = i + 1</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">        troque A[i] com A[j]</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">troque A[i + 1] com A[r]</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content"><span class="kw">return</span> i + 1</span></div>
            </div>
          </div>

          <p>Quando todos os $r - p$ elementos em $A[p \\dots r-1]$ são iguais a $x$, a condição <code>paridade == 0</code> é satisfeita exatamente $\\lfloor (r - p)/2 \\rfloor$ vezes, de modo que o retorno final é:</p>
          $$q = i + 1 = (p - 1) + \\lfloor (r - p)/2 \\rfloor + 1 = p + \\lfloor (r - p)/2 \\rfloor = \\mathbf{\\lfloor (p + r)/2 \\rfloor}.$$
        `
      },
      {
        id: "ex5-6",
        code: "EXERCÍCIO 06 • PIOR CASO DO QUICKSORT EM ORDEM DECRESCENTE",
        reference: "Exercício 7.2-3 (p. 154)",
        title: "Prova de que QUICKSORT Demora Θ(n²) para um Arranjo com Elementos Distintos em Ordem Decrescente",
        prompt: `
          <p><strong>(Exercício 7.2-3)</strong> Mostre que o tempo de execução de <code>QUICKSORT</code> é $\\Theta(n^2)$ quando o arranjo $A$ contém elementos distintos e está ordenado em ordem decrescente.</p>
        `,
        placeholder:
          "Acompanhe o que acontece na 1ª chamada de PARTITION (pivô é o menor elemento) e o que acontece no subarranjo resultante na 2ª chamada...",
        solution: `
          <h4>Demonstração Passo a Passo</h4>
          <p>Seja $A[1 \\dots n]$ um arranjo com $n$ elementos distintos em ordem estritamente decrescente: $A[1] > A[2] > \\dots > A[n]$.</p>
          <ol>
            <li><strong>Primeira chamada <code>PARTITION(A, 1, n)</code>:</strong> O pivô escolhido é $x = A[n]$, que é o <strong>menor elemento</strong> de todo o arranjo! Durante todo o laço <code>for j = 1 to n - 1</code>, temos $A[j] > x$, portanto a condição $A[j] \\le x$ nunca é satisfeita e $i$ permanece igual a $0$. Na linha 8, <code>PARTITION</code> troca $A[1]$ (o <strong>maior</strong> elemento!) com $A[n]$ (o menor elemento) e retorna $q = 1$.
              <ul>
                <li>O subarranjo esquerdo $A[1 \\dots 0]$ é vazio ($0$ elementos).</li>
                <li>O subarranjo direito $A[2 \\dots n]$ tem <strong>$n - 1$ elementos</strong>, onde $A[2] > A[3] > \\dots > A[n-1]$ continuam em ordem decrescente, exceto que a última posição $A[n]$ agora contém o antigo $A[1]$, que é o <strong>maior elemento</strong> entre todos os $n - 1$ elementos restantes!</li>
              </ul>
            </li>
            <li><strong>Segunda chamada <code>PARTITION(A, 2, n)</code>:</strong> Agora o pivô escolhido é $x = A[n]$, que é o <strong>maior elemento</strong> de $A[2 \\dots n]$! Portanto, durante o laço <code>for j = 2 to n - 1</code>, todos os elementos satisfazem $A[j] < x$: cada elemento é trocado consigo mesmo ($A[j] \\leftrightarrow A[j]$) e o procedimento retorna $q = n$:
              <ul>
                <li>O subarranjo direito é vazio ($0$ elementos).</li>
                <li>O subarranjo esquerdo $A[2 \\dots n - 1]$ tem <strong>$n - 2$ elementos</strong>, novamente em <strong>ordem estritamente decrescente</strong> $A[2] > A[3] > \\dots > A[n - 1]$!</li>
              </ul>
            </li>
            <li><strong>Padrão Indutivo e Recorrência:</strong> As chamadas alternam-se entre escolher o menor elemento como pivô ($q = p$, deixando $k - 1$ elementos) e escolher o maior elemento como pivô ($q = r$, deixando $k - 2$ elementos em ordem estritamente decrescente). Em todos os passos, uma das partições tem tamanho $0$ e a outra tem tamanho $k - 1$. Portanto, a recorrência para o tempo de execução é:
              $$T(n) = T(n - 1) + \\Theta(n) = \\sum_{k=1}^{n} \\Theta(k) = \\mathbf{\\Theta(n^2)}. \\quad \\blacksquare$$</li>
          </ol>
        `
      },
      {
        id: "ex5-7",
        code: "EXERCÍCIO 07 • PROBLEMA 7-1: CORREÇÃO DA PARTIÇÃO DE HOARE",
        reference: "Problema 7-1 (pp. 160–161)",
        title: "Rastreamento e Prova de Corretude de HOARE-PARTITION(A, p, r)",
        prompt: `
          <p>Resolva os itens fundamentais do <strong>Problema 7-1 (Correção da partição de Hoare)</strong>:</p>
          <ol>
            <li><strong>(a)</strong> Demonstre a operação de <code>HOARE-PARTITION</code> sobre o arranjo $A = \\langle 13, 19, 9, 5, 12, 8, 7, 4, 11, 2, 6, 21 \\rangle$, mostrando os valores do arranjo e os índices $i, j$ após cada iteração do laço <code>while</code>.</li>
            <li><strong>(b, c, d)</strong> Levando em conta que $A[p \\dots r]$ contém pelo menos dois elementos ($p < r$), explique por que: (b) nunca acessamos fora de $A[p \\dots r]$, (c) o valor $j$ retornado satisfaz $p \\le j < r$, e (d) todo elemento de $A[p \\dots j]$ é $\\le$ todo elemento de $A[j + 1 \\dots r]$ no término.</li>
            <li><strong>(e)</strong> Reescreva o procedimento <code>QUICKSORT</code> para usar <code>HOARE-PARTITION</code>.</li>
          </ol>
        `,
        placeholder:
          "Rastreie as 3 trocas na instância A = ⟨13, 19, 9, 5, 12, 8, 7, 4, 11, 2, 6, 21⟩ até retornar j = 9, justifique (b)-(d) e escreva HOARE-QUICKSORT...",
        solution: `
          <h4>(a) Rastreamento em $A = \\langle 13, 19, 9, 5, 12, 8, 7, 4, 11, 2, 6, 21 \\rangle$ ($p=1, r=12$)</h4>
          <p>Inicialmente, $x = A[1] = 13$, $i = 0$ e $j = 13$:</p>
          <ul>
            <li><strong>1ª Iteração:</strong> $j$ decrementa de $13$ até $11$ (pois $A[12] = 21 > 13$ e $A[11] = 6 \\le 13$). $i$ incrementa de $0$ até $1$ (pois $A[1] = 13 \\ge 13$). Como $i = 1 < j = 11$, trocamos $A[1] \\leftrightarrow A[11]$:<br>
              $$A = \\langle \\mathbf{6}, 19, 9, 5, 12, 8, 7, 4, 11, 2, \\mathbf{13}, 21 \\rangle, \\quad i = 1, \\; j = 11.$$</li>
            <li><strong>2ª Iteração:</strong> $j$ decrementa de $11$ até $10$ ($A[10] = 2 \\le 13$). $i$ incrementa de $1$ até $2$ ($A[2] = 19 \\ge 13$). Como $i = 2 < j = 10$, trocamos $A[2] \\leftrightarrow A[10]$:<br>
              $$A = \\langle 6, \\mathbf{2}, 9, 5, 12, 8, 7, 4, 11, \\mathbf{19}, 13, 21 \\rangle, \\quad i = 2, \\; j = 10.$$</li>
            <li><strong>3ª Iteração:</strong> $j$ decrementa de $10$ até $9$ ($A[9] = 11 \\le 13$). $i$ incrementa de $2$ até $10$ (pois $A[3..9]$ são todos $< 13$, parando em $A[10] = 19 \\ge 13$). Agora $i = 10 \\not< j = 9$: o laço termina e <strong>retorna $j = 9$</strong>! Observe que $A[1 \\dots 9] = \\langle 6, 2, 9, 5, 12, 8, 7, 4, 11 \\rangle$ (todos $\\le 13$) e $A[10 \\dots 12] = \\langle 19, 13, 21 \\rangle$ (todos $\\ge 13$).</li>
          </ul>

          <h4>(b, c, d) Prova de Limites e Corretude</h4>
          <ul>
            <li><strong>(b) E (c) Limites $p \\le i, j \\le r$ e término com $p \\le j < r$:</strong> Na 1ª iteração, como $x = A[p]$, o laço de $i$ para imediatamente em $i = p$ (pois $A[p] = x \\ge x$); e o laço de $j$ para em algum $j$ com $p \\le j \\le r$ (pois no máximo alcança $A[p] = x \\le x$). Se $j = p$, o procedimento retorna $j = p < r$ imediatamente. Se $j > p$, trocamos $A[p]$ com $A[j]$, colocando $x$ em $A[j] > p$ e um valor $\\le x$ em $A[p]$, o que garante que nas iterações seguintes $A[p \\dots i]$ sempre contém pelo menos um elemento $\\le x$ (impedindo $j$ de cair abaixo de $p$) e $A[j \\dots r]$ sempre contém pelo menos um elemento $\\ge x$ (impedindo $i$ de ultrapassar $r$), além de $j$ nunca parar em $r$ após a 1ª iteração, logo $p \\le j < r$.</li>
            <li><strong>(d) Particionamento Válido:</strong> Em cada iteração antes do término com $i \\ge j$, todo elemento em $A[p \\dots i - 1]$ é $\\le x$ e todo elemento em $A[j + 1 \\dots r]$ é $\\ge x$. Quando os ponteiros se cruzam ($i \\ge j$), todo elemento em $A[p \\dots j]$ é $\\le x$ e todo elemento em $A[j + 1 \\dots r]$ é $\\ge x$.</li>
          </ul>

          <h4>(e) Procedimento <code>HOARE-QUICKSORT(A, p, r)</code></h4>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">HOARE-QUICKSORT(A, p, r)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> p &lt; r</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    q = HOARE-PARTITION(A, p, r)</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    HOARE-QUICKSORT(A, p, q) <span class="cmt">// Inclui q, pois p ≤ q &lt; r!</span></span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    HOARE-QUICKSORT(A, q + 1, r)</span></div>
            </div>
          </div>
        `
      },
      {
        id: "ex5-8",
        code: "EXERCÍCIO 08 • PROBLEMA 7-4: PROFUNDIDADE DE PILHA Θ(lg n) NO QUICKSORT",
        reference: "Problema 7-4 (pp. 162–163)",
        title: "Eliminação de Recursão de Cauda e Garantia de Pilha Θ(lg n) no Pior Caso",
        prompt: `
          <p>No <strong>Problema 7-4 (Profundidade de pilha para Quicksort)</strong>, considere o procedimento <code>TAIL-RECURSIVE-QUICKSORT(A, p, r)</code> que substitui a segunda chamada recursiva por um laço <code>while p < r</code>:</p>
          <ol>
            <li><strong>(a)</strong> Mostre que <code>TAIL-RECURSIVE-QUICKSORT(A, 1, A.comprimento)</code> ordena corretamente o arranjo $A$.</li>
            <li><strong>(b)</strong> Descreva um cenário no qual a profundidade de pilha de <code>TAIL-RECURSIVE-QUICKSORT</code> ainda é $\\Theta(n)$ para um arranjo de $n$ elementos.</li>
            <li><strong>(c)</strong> Modifique o código de <code>TAIL-RECURSIVE-QUICKSORT</code> de tal modo que a profundidade de pilha no <strong>pior caso</strong> seja <strong>$\\Theta(\\lg n)$</strong>, mantendo o tempo de execução esperado $O(n \\lg n)$.</li>
          </ol>
        `,
        placeholder:
          "Explique a equivalência do laço while com a 2ª chamada recursiva, mostre que um arranjo já ordenado ainda empilha n chamadas na esquerda, e escreva o código que recursa apenas na menor partição...",
        solution: `
          <h4>(a) Corretude de <code>TAIL-RECURSIVE-QUICKSORT</code></h4>
          <p>No <code>QUICKSORT(A, p, r)</code> original, após executar <code>q = PARTITION(A, p, r)</code> e <code>QUICKSORT(A, p, q - 1)</code>, a última instrução é <code>QUICKSORT(A, q + 1, r)</code>. Executar essa chamada recursiva final com o novo primeiro argumento valendo $q + 1$ é semanticamente idêntico a atualizar a variável local $p = q + 1$ e repetir o corpo do procedimento enquanto $p < r$. Portanto, o conjunto de subarranjos particionados e ordenados é exatamente o mesmo do <code>QUICKSORT</code> padrão.</p>

          <h4>(b) Cenário em que a Profundidade de Pilha ainda é $\\Theta(n)$</h4>
          <p>Se o arranjo de entrada $A[1 \\dots n]$ já estiver ordenado em ordem crescente, <code>PARTITION(A, p, r)</code> retorna $q = r$ em todas as chamadas. Nesse caso, a chamada recursiva explícita na linha 4 é <code>TAIL-RECURSIVE-QUICKSORT(A, 1, n - 1)</code>, que por sua vez empilha <code>TAIL-RECURSIVE-QUICKSORT(A, 1, n - 2)</code>, e assim sucessivamente até $r = 1$. Portanto, <strong>$n - 1$ quadros de ativação são empilhados simultaneamente</strong> antes que o primeiro laço <code>while</code> avance, resultando em profundidade de pilha $\\Theta(n)$!</p>

          <h4>(c) Modificação para Garantir Profundidade de Pilha $O(\\lg n)$ no Pior Caso</h4>
          <p>Para garantir que cada chamada recursiva empilhada reduza o tamanho do subproblema ativo pela metade ou mais, basta comparar o tamanho do subarranjo esquerdo ($q - p$) com o tamanho do subarranjo direito ($r - q$): <strong>fazemos a chamada recursiva apenas no menor subarranjo</strong> e deixamos o laço <code>while</code> iterar sobre o maior subarranjo!</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">BOUNDED-STACK-QUICKSORT(A, p, r)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">while</span> p &lt; r</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    q = RANDOMIZED-PARTITION(A, p, r)</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    <span class="kw">if</span> q - p &lt; r - q</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">        BOUNDED-STACK-QUICKSORT(A, p, q - 1)</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">        p = q + 1</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">    <span class="kw">else</span></span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">        BOUNDED-STACK-QUICKSORT(A, q + 1, r)</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">        r = q - 1</span></div>
            </div>
          </div>

          <p><strong>Prova do Limite de Pilha $O(\\lg n)$:</strong> Sempre que uma chamada recursiva é feita (linha 4 ou linha 7), o subarranjo passado para a chamada recursiva tem tamanho estritamente menor que $(r - p + 1)/2$. Portanto, a cada nível da pilha de recursão o tamanho do subarranjo cai no mínimo pela metade, e a profundidade máxima da pilha jamais excede $\\lfloor \\lg n \\rfloor = O(\\lg n)$, mesmo no pior caso absoluto! $\\blacksquare$</p>
        `
      }
    ]
  };

  if (typeof window !== "undefined" && typeof window.registerCodexModule === "function") {
    window.registerCodexModule(5, module5Content);
  }
})();
