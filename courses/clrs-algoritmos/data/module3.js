/* ==========================================================================
   MÓDULO 03 — Divisão e Conquista Avançada e Resolução de Recorrências
   Capítulo 4 (pp. 66–105) — Cormen, Leiserson, Rivest e Stein (3ª Edição)
   ========================================================================== */

(function () {
  const module3Content = {
    /* ======================================================================
       SEÇÃO 1: REVISÃO E NIVELAMENTO (CONEXÃO COM CAPÍTULOS 2 E 3)
       ====================================================================== */
    revisao: {
      subtitle:
        "Da Ordenação por Intercalação e Notação Assintótica para o Paradigma Geral de Divisão e Conquista e as Equações de Recorrência",
      intro:
        "No Capítulo 2 (Seção 2.3), introduzimos a abordagem de divisão e conquista ao projetar o procedimento MERGE-SORT e construímos nossa primeira árvore de recursão para mostrar que T(n) = 2T(n/2) + Θ(n) = Θ(n lg n). No Capítulo 3 e no Apêndice A, estabelecemos o formalismo da notação assintótica (Θ, O, Ω, o, ω) e as técnicas de manipulação de somatórios (séries geométricas, harmônicas e telescópicas). Agora, no Capítulo 4 (pp. 66–105), unificamos esses dois mundos: primeiro aplicaremos a divisão e conquista para romper barreiras quadráticas e cúbicas em dois problemas fundamentais — o Problema do Subarranjo Máximo em Θ(n lg n) e a Multiplicação de Matrizes de Strassen em Θ(n^{lg 7}) = O(n^{2,81}) — e, em seguida, desenvolveremos os três métodos matemáticos canônicos para resolver recorrências algorítmicas: o Método de Substituição, o Método da Árvore de Recursão e o Método Mestre (com sua demonstração completa).",
      pillars: [
        {
          tag: "[ PILAR 01 • A ANATOMIA DA DIVISÃO E CONQUISTA ]",
          title: "As Três Etapas (Dividir, Conquistar, Combinar), Caso Recursivo e Caso-Base",
          body: `
            <p>Na abertura do Capítulo 4 (p. 66), Cormen, Leiserson, Rivest e Stein formalizam o paradigma de <strong>divisão e conquista</strong> em três etapas em cada nível da recursão:</p>
            <ul>
              <li><strong>Dividir</strong> o problema em uma série de subproblemas que são instâncias menores do mesmo problema.</li>
              <li><strong>Conquistar</strong> os subproblemas resolvendo-os recursivamente. Entretanto, se os tamanhos dos subproblemas forem pequenos o bastante, apenas resolva os subproblemas de maneira direta.</li>
              <li><strong>Combinar</strong> as soluções dos subproblemas em uma solução para o problema original.</li>
            </ul>
            <p>Os autores destacam a terminologia fundamental entre dois regimes de tamanho:</p>
            <ul>
              <li><strong>Caso recursivo:</strong> Ocorre quando os subproblemas são grandes o suficiente para exigir chamadas recursivas.</li>
              <li><strong>Caso-base:</strong> Ocorre quando os subproblemas se tornam pequenos o bastante (por exemplo, $n = 1$ ou $n \\le n_0$) para que não precisemos mais recorrer; dizemos então que a recursão <em>"chega ao fundo"</em> (<em>bottoms out</em>).</li>
              <li><strong>Distinção crucial sobre subproblemas:</strong> Às vezes, além de subproblemas que são instâncias menores exatas do problema original, resolvemos subproblemas auxiliares que <em>não são</em> exatamente instâncias menores do problema original (por exemplo, encontrar um subarranjo máximo restrito a cruzar o ponto médio na Seção 4.1). Por definição metodológica do CLRS, a resolução desses problemas com restrições adicionais faz parte da etapa de <strong>combinar</strong>!</li>
            </ul>
          `
        },
        {
          tag: "[ PILAR 02 • EQUAÇÕES DE RECORRÊNCIA E DETALHES TÉCNICOS ]",
          title: "Formulação Geral T(n) = aT(n/b) + D(n) + C(n) e as Três Simplificações Padrão",
          body: `
            <p>Uma <strong>recorrência</strong> é uma equação ou desigualdade que descreve uma função em termos de seu valor em entradas menores. Se um algoritmo divide um problema de tamanho $n$ em $a$ subproblemas, cada um de tamanho $n/b$, gastando $D(n)$ para dividir e $C(n)$ para combinar, obtemos a forma canônica:</p>
            $$T(n) = \\begin{cases} \\Theta(1) & \\text{se } n \\le c, \\\\ aT(n/b) + D(n) + C(n) & \\text{caso contrário.} \\end{cases}$$
            <p>Nas páginas 67 e 68, os autores explicam três "detalhes técnicos" que frequentemente omitimos ao enunciar e resolver recorrências porque não alteram o limite assintótico:</p>
            <ol>
              <li><strong>Argumentos inteiros (pisos e tetos):</strong> Embora o tempo real da ordenação por intercalação seja $T(n) = T(\\lfloor n/2 \\rfloor) + T(\\lceil n/2 \\rceil) + \\Theta(n)$, ignorar pisos e tetos escrevendo $T(n) = 2T(n/2) + \\Theta(n)$ geralmente não afeta o crescimento assintótico (o que será provado rigorosamente na Seção 4.6.2).</li>
              <li><strong>Condições de contorno (casos-base):</strong> Como $T(n) = \\Theta(1)$ para $n$ pequeno ($n \\le n_0$), omitimos a declaração explícita do caso-base na equação de recorrência, pois mudar o valor constante de $T(1)$ altera a solução apenas por um fator constante, o que não modifica $\\Theta(g(n))$.</li>
              <li><strong>Fatores constantes fora vs. dentro da recursão:</strong> Embora possamos absorver constantes aditivas ou multiplicativas em termos não recursivos (por exemplo, $4 \\cdot \\Theta(n^2/4) = \\Theta(n^2)$), <strong>jamais podemos absorver a constante $a$ que multiplica $T(n/b)$</strong>! Escrever $T(n/2)$ em vez de $8T(n/2)$ mudaria a árvore de recursão de uma árvore frondosa de grau $8$ para uma simples linha reta, alterando drasticamente a ordem de crescimento de $\\Theta(n^3)$ para $\\Theta(n^2)$.</li>
            </ol>
          `
        },
        {
          tag: "[ PILAR 03 • IDENTIDADES LOGARÍTMICAS E SÉRIES GEOMÉTRICAS ]",
          title: "A Identidade de Troca na Base das Folhas e os Três Regimes da Soma Geométrica",
          body: `
            <p>Ao expandir uma árvore de recursão onde o tamanho do problema cai por um fator $b > 1$ a cada nível e o número de filhos multiplica por $a \\ge 1$, atingimos tamanho $1$ na profundidade $h = \\log_b n$ (pois $n/b^h = 1 \\iff b^h = n$). Duas ferramentas do Capítulo 3 e Apêndice A governam a soma total da árvore:</p>
            <ul>
              <li><strong>Número de folhas na profundidade $\\log_b n$:</strong> Pela identidade de troca de base e expoente (Equação 3.15 do Cap. 3: $a^{\\log_b c} = c^{\\log_b a}$), o número de folhas é:
                $$a^{\\log_b n} = n^{\\log_b a}$$
                Por exemplo, para $a = 3, b = 4$, há $3^{\\log_4 n} = n^{\\log_4 3} \\approx n^{0,7925}$ folhas; para Strassen ($a = 7, b = 2$), há $7^{\\lg n} = n^{\\lg 7} \\approx n^{2,8074}$ folhas!</li>
              <li><strong>Os três regimes da série geométrica $\\sum_{j=0}^{h-1} r^j$:</strong> Quando o custo no nível $j$ varia segundo uma razão $r$ de um nível para o seguinte:
                <ul>
                  <li>Se $r < 1$ (<strong>série decrescente</strong>, ex.: $r = 3/16$): a soma é limitada superiormente pela série infinita $\\frac{1}{1-r} = O(1)$, logo o <strong>nível da raiz ($j=0$)</strong> domina todo o custo!</li>
                  <li>Se $r = 1$ (<strong>custos iguais por nível</strong>): todos os $\\log_b n$ níveis têm o mesmo custo, multiplicando o custo da raiz por um fator $\\lg n$.</li>
                  <li>Se $r > 1$ (<strong>série crescente</strong>): o último nível domina a soma, e o custo total concentra-se nas <strong>$n^{\\log_b a}$ folhas</strong>!</li>
                </ul>
              </li>
            </ul>
          `
        },
        {
          tag: "[ PILAR 04 • PANORAMA DOS TRÊS MÉTODOS DE RESOLUÇÃO ]",
          title: "Substituição, Árvore de Recursão e Método Mestre (e o Teorema de Akra-Bazzi)",
          body: `
            <p>O Capítulo 4 equipa você com três métodos complementares para obter limites assintóticos "$\\Theta$" ou "$O$" para recorrências:</p>
            <ol>
              <li><strong>Método de Substituição (Seção 4.3):</strong> Você conjectura um limite e usa <strong>indução matemática</strong> para provar que o palpite está correto e determinar as constantes. É o método mais geral e rigoroso (serve inclusive para provar palpites gerados por árvores de recursão), mas exige provar a <em>forma exata</em> da hipótese indutiva.</li>
              <li><strong>Método da Árvore de Recursão (Seção 4.4):</strong> Converte a recorrência em uma árvore cujos nós representam os custos incorridos nos vários níveis da recursão. Excelente para visualizar como o trabalho se distribui (mesmo em divisões desbalanceadas como $T(n/3) + T(2n/3) + cn$) e gerar palpites certeiros.</li>
              <li><strong>Método Mestre (Seções 4.5 e 4.6):</strong> Fornece uma receita imediata ("livro de receitas") para recorrências da forma $T(n) = aT(n/b) + f(n)$ com $a \\ge 1, b > 1$, comparando $f(n)$ com a função crítica $n^{\\log_b a}$. Nas Notas do Capítulo (pp. 104–105), os autores apresentam ainda o <strong>Método de Akra-Bazzi</strong> para subproblemas de tamanhos desiguais $T(x) = \\sum_{i=1}^k a_i T(b_i x) + f(x)$.</li>
            </ol>
          `
        }
      ],
      checklist: [
        "Compreendo as três etapas do paradigma de divisão e conquista (Dividir, Conquistar, Combinar) e sei que resolver subproblemas que não são instâncias menores exatas do problema original pertence à etapa de Combinar.",
        "Entendo por que podemos omitir pisos/tetos e casos-base ao escrever recorrências, mas jamais podemos absorver na notação Θ a constante 'a' que multiplica o termo recursivo aT(n/b).",
        "Domino a identidade logarítmica a^(log_b n) = n^(log_b a), que determina o número exato de folhas em uma árvore de recursão a-ária de altura log_b n.",
        "Sei distinguir os três comportamentos de uma soma por níveis: série geométrica decrescente (dominada pela raiz), soma uniforme (multiplicada por lg n) e série geométrica crescente (dominada pelas folhas).",
        "Reconheço o papel de cada um dos três métodos do Capítulo 4: Substituição (prova indutiva exata), Árvore de Recursão (visualização e soma por níveis) e Método Mestre (comparação polinomial entre f(n) e n^(log_b a))."
      ]
    },

    /* ======================================================================
       SEÇÃO 2: UNIDADES DE ESTUDO APROFUNDADO (CAPÍTULO 4, SEÇÕES 4.1 A 4.6)
       ====================================================================== */
    unidades: [
      /* ====================================================================
         UNIDADE 3.1 — SEÇÃO 4.1: O PROBLEMA DO SUBARRANJO MÁXIMO
         ==================================================================== */
      {
        id: "u3-1",
        code: "UNIDADE 3.1 • CAP. 4 (SEÇÃO 4.1)",
        pages: "pp. 68–74",
        title: "4.1 O Problema do Subarranjo Máximo",
        content: `
          <p>A Seção 4.1 apresenta um problema clássico de otimização em arranjos unidimensionais para ilustrar como uma reformulação inteligente da entrada combinada com o paradigma de divisão e conquista reduz um algoritmo quadrático $\\Theta(n^2)$ para $\\Theta(n \\lg n)$.</p>

          <h3>1. Motivação: Compra e Venda de Ações da Chemical Corporation</h3>
          <p>Suponha que você recebeu a oportunidade de investir na <em>Chemical Corporation</em>. Como dispõe de informações privilegiadas (ou está analisando dados históricos), você conhece o preço de uma ação ao final de cada um dos $n$ dias de um período (do Dia $0$ ao Dia $16$ na Figura 4.1 do livro, p. 68). Você tem permissão para <strong>comprar uma única unidade da ação em um determinado dia e vendê-la em uma data posterior</strong>, buscando maximizar seu lucro líquido (diferença entre o preço de venda e o preço de compra).</p>

          <div class="clrs-table-wrap">
            <table class="clrs-table">
              <thead>
                <tr>
                  <th>Dia</th>
                  <th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Preço (\\$)</strong></td>
                  <td>100</td><td>113</td><td>110</td><td>85</td><td>105</td><td>102</td><td>86</td><td>63</td><td>81</td><td>101</td><td>94</td><td>106</td><td>101</td><td>79</td><td>94</td><td>90</td><td>97</td>
                </tr>
                <tr>
                  <td><strong>Mudança $A[i]$</strong></td>
                  <td>—</td><td>13</td><td>-3</td><td>-25</td><td>20</td><td>-3</td><td>-16</td><td>-23</td><td><strong>18</strong></td><td><strong>20</strong></td><td><strong>-7</strong></td><td><strong>12</strong></td><td>-5</td><td>-22</td><td>15</td><td>-4</td><td>7</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>2. Por que "Comprar no Mínimo Global e Vender no Máximo Global" Falha?</h3>
          <p>À primeira vista, poderíamos pensar que basta encontrar o preço mínimo global e o preço máximo global em tempo $\\Theta(n)$. Porém, <strong>a compra deve obrigatoriamente ocorrer antes da venda</strong>! Na tabela acima (Figura 4.1), o preço máximo ocorre após o Dia 1 (\\$113) e o preço mínimo ocorre após o Dia 7 (\\$63), mas o Dia 1 antecede o Dia 7.</p>
          <p>Mais ainda, como demonstra o contraexemplo da <strong>Figura 4.2 (p. 69)</strong> com preços $\\langle 10, 11, 7, 10, 6 \\rangle$ nos dias $0, 1, 2, 3, 4$, <strong>o lucro máximo nem sempre começa no preço mais baixo nem termina no preço mais alto</strong>: ali o preço mais alto é \\$11 (Dia 1) e o mais baixo é \\$6 (Dia 4), mas o lucro máximo é de \\$3 por ação, obtido comprando após o Dia 2 por \\$7 e vendendo após o Dia 3 por \\$10!</p>

          <h3>3. Solução de Força Bruta sobre Pares de Datas e a Transformação para Variações Diárias</h3>
          <p><strong>Força bruta sobre pares de datas:</strong> Em um período de $n$ dias, existem $\\binom{n}{2} = \\frac{n(n-1)}{2} = \\Theta(n^2)$ pares possíveis de datas de compra e venda. Testar cada par em tempo constante exige $\\Theta(n^2)$.</p>
          <p><strong>A Transformação para Mudanças Diárias:</strong> Em vez de olhar para os preços diários, definimos o arranjo $A[1 \\dots n]$ onde $A[i]$ é a <strong>mudança no preço no dia $i$</strong> (a diferença entre o preço após o dia $i$ e o preço após o dia $i-1$). Para os dados da Figura 4.1, obtemos o arranjo de $16$ elementos da <strong>Figura 4.3 (p. 69)</strong>:</p>
          $$A[1 \\dots 16] = \\langle 13, -3, -25, 20, -3, -16, -23, \\underbrace{18, 20, -7, 12}_{\\text{Soma máxima } = 43}, -5, -22, 15, -4, 7 \\rangle$$
          <p>Qualquer compra após o dia $i-1$ e venda após o dia $j$ (com $1 \\le i \\le j \\le n$) gera um lucro líquido exatamente igual à soma telescópica do subarranjo contíguo $A[i \\dots j]$:</p>
          $$\\text{Lucro}(i-1, j) = \\text{Preço}[j] - \\text{Preço}[i-1] = \\sum_{k=i}^{j} A[k].$$
          <p>Assim, o problema transforma-se no <strong>Problema do Subarranjo Máximo</strong>: encontrar um subarranjo contíguo não vazio $A[i \\dots j]$ cujos valores tenham a maior soma possível (no exemplo acima, $A[8 \\dots 11] = \\langle 18, 20, -7, 12 \\rangle$, com soma $43$, o que corresponde a comprar após o Dia 7 por \\$63 e vender após o Dia 11 por \\$106).</p>
          <div class="canonical-callout">
            <span class="callout-tag">[ OBSERVAÇÃO FUNDAMENTAL • PAPEL DOS NÚMEROS NEGATIVOS ]</span>
            <p>O problema do subarranjo máximo só é interessante quando o arranjo contém alguns números negativos. Se todas as entradas de $A$ fossem não negativas, o arranjo inteiro $A[1 \\dots n]$ sempre forneceria a maior soma sem nenhum esforço!</p>
          </div>

          <h3>4. Decomposição por Divisão e Conquista</h3>
          <p>Para encontrar um subarranjo máximo de $A[\\text{low} \\dots \\text{high}]$, calculamos o ponto médio $\\text{mid} = \\lfloor (\\text{low} + \\text{high})/2 \\rfloor$ e particionamos o arranjo no subarranjo da esquerda $A[\\text{low} \\dots \\text{mid}]$ e no subarranjo da direita $A[\\text{mid} + 1 \\dots \\text{high}]$. Como ilustra a <strong>Figura 4.4(a) (p. 70)</strong>, qualquer subarranjo contíguo $A[i \\dots j]$ de $A[\\text{low} \\dots \\text{high}]$ deve estar em <strong>exatamente uma</strong> de três localizações mutuamente exclusivas:</p>
          <ol>
            <li><strong>Inteiramente no subarranjo da esquerda</strong> $A[\\text{low} \\dots \\text{mid}]$, de modo que $\\text{low} \\le i \\le j \\le \\text{mid}$;</li>
            <li><strong>Inteiramente no subarranjo da direita</strong> $A[\\text{mid} + 1 \\dots \\text{high}]$, de modo que $\\text{mid} < i \\le j \\le \\text{high}$;</li>
            <li><strong>Cruzando o ponto médio</strong>, de modo que $\\text{low} \\le i \\le \\text{mid} < j \\le \\text{high}$.</li>
          </ol>
          <p>Os casos (1) e (2) são instâncias menores exatas do problema do subarranjo máximo e são resolvidos recursivamente. Já o caso (3) — encontrar um subarranjo máximo que <strong>cruza o ponto médio</strong> — não é uma instância menor irrestrita, pois impõe a restrição de que o subarranjo deve conter tanto $A[\\text{mid}]$ quanto $A[\\text{mid} + 1]$. Como mostra a <strong>Figura 4.4(b)</strong>, qualquer subarranjo que cruze o ponto médio é a união de dois subarranjos independentes: um sufixo $A[i \\dots \\text{mid}]$ da metade esquerda (com $\\text{low} \\le i \\le \\text{mid}$) e um prefixo $A[\\text{mid} + 1 \\dots j]$ da metade direita (com $\\text{mid} < j \\le \\text{high}$). Portanto, podemos maximizar a metade esquerda varrendo de $\\text{mid}$ até $\\text{low}$ e maximizar a metade direita varrendo de $\\text{mid} + 1$ até $\\text{high}$ em tempo linear $\\Theta(n)$!</p>

          <h3>5. Pseudocódigo de <code>FIND-MAX-CROSSING-SUBARRAY</code> e Análise $\\Theta(n)$</h3>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">FIND-MAX-CROSSING-SUBARRAY(A, low, mid, high)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">left-sum = -∞</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">sum = 0</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">for</span> i = mid <span class="kw">downto</span> low</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    sum = sum + A[i]</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">if</span> sum &gt; left-sum</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">        left-sum = sum</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">        max-left = i</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">right-sum = -∞</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">sum = 0</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content"><span class="kw">for</span> j = mid + 1 <span class="kw">to</span> high</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">    sum = sum + A[j]</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">    <span class="kw">if</span> sum &gt; right-sum</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">        right-sum = sum</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">        max-right = j</span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content"><span class="kw">return</span> (max-left, max-right, left-sum + right-sum)</span></div>
            </div>
          </div>
          <p><strong>Análise de Tempo:</strong> Seja $n = \\text{high} - \\text{low} + 1$ o número de elementos em $A[\\text{low} \\dots \\text{high}]$. Cada iteração de cada um dos dois laços <code>for</code> gasta tempo $\\Theta(1)$. O laço das linhas 3–7 executa $(\\text{mid} - \\text{low} + 1)$ iterações e o laço das linhas 10–14 executa $(\\text{high} - \\text{mid})$ iterações. O total de iterações é exatamente:</p>
          $$(\\text{mid} - \\text{low} + 1) + (\\text{high} - \\text{mid}) = \\text{high} - \\text{low} + 1 = n = \\Theta(n).$$

          <h3>6. Pseudocódigo de <code>FIND-MAXIMUM-SUBARRAY</code> e Recorrência $\\Theta(n \\lg n)$</h3>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">FIND-MAXIMUM-SUBARRAY(A, low, high)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> high == low</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">return</span> (low, high, A[low]) <span class="cmt">// caso-base: apenas um elemento</span></span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">else</span> mid = ⌊(low + high) / 2⌋</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    (left-low, left-high, left-sum) = FIND-MAXIMUM-SUBARRAY(A, low, mid)</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    (right-low, right-high, right-sum) = FIND-MAXIMUM-SUBARRAY(A, mid + 1, high)</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">    (cross-low, cross-high, cross-sum) = FIND-MAX-CROSSING-SUBARRAY(A, low, mid, high)</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    <span class="kw">if</span> left-sum ≥ right-sum <span class="kw">e</span> left-sum ≥ cross-sum</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">        <span class="kw">return</span> (left-low, left-high, left-sum)</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">    <span class="kw">elseif</span> right-sum ≥ left-sum <span class="kw">e</span> right-sum ≥ cross-sum</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">        <span class="kw">return</span> (right-low, right-high, right-sum)</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">    <span class="kw">else</span> <span class="kw">return</span> (cross-low, cross-high, cross-sum)</span></div>
            </div>
          </div>

          <p><strong>Análise da Recorrência (Equações 4.5, 4.6 e 4.7, pp. 72–73):</strong> Assumindo que $n$ é uma potência de $2$, no caso-base ($n = 1$) as linhas 1–2 gastam $T(1) = \\Theta(1)$. Para $n > 1$, a divisão na linha 3 gasta $\\Theta(1)$, as linhas 4 e 5 resolvem dois subproblemas de tamanho $n/2$ em tempo $2T(n/2)$, a linha 6 gasta $\\Theta(n)$ em <code>FIND-MAX-CROSSING-SUBARRAY</code> e as linhas 7–11 gastam $\\Theta(1)$. Somando tudo:</p>
          $$T(n) = \\Theta(1) + 2T(n/2) + \\Theta(n) + \\Theta(1) = 2T(n/2) + \\Theta(n)$$
          $$T(n) = \\begin{cases} \\Theta(1) & \\text{se } n = 1, \\\\ 2T(n/2) + \\Theta(n) & \\text{se } n > 1. \\end{cases}$$
          <p>Esta recorrência é idêntica à do <code>MERGE-SORT</code> (Equação 2.1) e, pelo Caso 2 do Teorema Mestre (Seção 4.5), tem solução exata <strong>$T(n) = \\Theta(n \\lg n)$</strong>, superando assintoticamente o método de força bruta $\\Theta(n^2)$! (No Exercício 4.1-5 veremos que é possível ir além e resolver o problema em tempo linear $\\Theta(n)$ sem divisão e conquista.)</p>

          <div id="workbench-mod3-mount"></div>
        `
      },

      /* ====================================================================
         UNIDADE 3.2 — SEÇÃO 4.2: ALGORITMO DE STRASSEN PARA MULTIPLICAÇÃO DE MATRIZES
         ==================================================================== */
      {
        id: "u3-2",
        code: "UNIDADE 3.2 • CAP. 4 (SEÇÃO 4.2)",
        pages: "pp. 74–81",
        title: "4.2 Algoritmo de Strassen para Multiplicação de Matrizes",
        content: `
          <p>Dadas duas matrizes quadradas $A = (a_{ij})$ e $B = (b_{ij})$ de dimensão $n \\times n$, o produto $C = A \\cdot B$ define cada entrada $c_{ij}$ (para $i, j = 1, 2, \\dots, n$) pela Equação (4.8):</p>
          $$c_{ij} = \\sum_{k=1}^{n} a_{ik} \\cdot b_{kj}.$$

          <h3>1. O Procedimento Direto <code>SQUARE-MATRIX-MULTIPLY</code> em $\\Theta(n^3)$</h3>
          <p>Como precisamos calcular $n^2$ entradas de $C$ e cada entrada exige somar $n$ produtos escalares, a implementação direta por três laços <code>for</code> aninhados executa em tempo cúbico $\\Theta(n^3)$:</p>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">SQUARE-MATRIX-MULTIPLY(A, B)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">n = A.linhas</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">seja</span> C uma nova matriz n × n</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">for</span> i = 1 <span class="kw">to</span> n</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">for</span> j = 1 <span class="kw">to</span> n</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">        c_{ij} = 0</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">        <span class="kw">for</span> k = 1 <span class="kw">to</span> n</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">            c_{ij} = c_{ij} + a_{ik} · b_{kj}</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content"><span class="kw">return</span> C</span></div>
            </div>
          </div>
          <p>Durante décadas, acreditou-se que nenhum algoritmo poderia multiplicar matrizes em tempo $o(n^3)$. Em 1969, Volker Strassen surpreendeu a comunidade científica ao demonstrar um algoritmo recursivo que executa em tempo $\\Theta(n^{\\lg 7}) = O(n^{2,81})$!</p>

          <h3>2. Tentativa Simples de Divisão e Conquista em 8 Subproblemas ($\\Theta(n^3)$)</h3>
          <p>Suponha que $n$ seja uma potência exata de $2$ e que particionemos $A$, $B$ e $C$ em quatro submatrizes de dimensão $n/2 \\times n/2$ cada (Equações 4.9 e 4.10):</p>
          $$A = \\begin{pmatrix} A_{11} & A_{12} \\\\ A_{21} & A_{22} \\end{pmatrix}, \\qquad B = \\begin{pmatrix} B_{11} & B_{12} \\\\ B_{21} & B_{22} \\end{pmatrix}, \\qquad C = \\begin{pmatrix} C_{11} & C_{12} \\\\ C_{21} & C_{22} \\end{pmatrix}$$
          <p>O produto em blocos $C = A \\cdot B$ fornece as quatro equações matriciais (Equações 4.11 a 4.14):</p>
          $$\\begin{aligned}
          C_{11} &= A_{11}B_{11} + A_{12}B_{21} \\qquad (4.11) \\\\
          C_{12} &= A_{11}B_{12} + A_{12}B_{22} \\qquad (4.12) \\\\
          C_{21} &= A_{21}B_{11} + A_{22}B_{21} \\qquad (4.13) \\\\
          C_{22} &= A_{21}B_{12} + A_{22}B_{22} \\qquad (4.14)
          \\end{aligned}$$
          <p>Essas equações especificam <strong>$8$ multiplicações recursivas</strong> de matrizes $n/2 \\times n/2$ e $4$ adições de matrizes $n/2 \\times n/2$, traduzidas no procedimento <code>SQUARE-MATRIX-MULTIPLY-RECURSIVE(A, B)</code>:</p>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">SQUARE-MATRIX-MULTIPLY-RECURSIVE(A, B)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">n = A.linhas</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">seja</span> C uma nova matriz n × n</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">if</span> n == 1</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    c_{11} = a_{11} · b_{11}</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">else</span> repartir A, B e C como nas equações (4.9)</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">    C_{11} = SQUARE-MATRIX-MULTIPLY-RECURSIVE(A_{11}, B_{11}) + SQUARE-MATRIX-MULTIPLY-RECURSIVE(A_{12}, B_{21})</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    C_{12} = SQUARE-MATRIX-MULTIPLY-RECURSIVE(A_{11}, B_{12}) + SQUARE-MATRIX-MULTIPLY-RECURSIVE(A_{12}, B_{22})</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">    C_{21} = SQUARE-MATRIX-MULTIPLY-RECURSIVE(A_{21}, B_{11}) + SQUARE-MATRIX-MULTIPLY-RECURSIVE(A_{22}, B_{21})</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">    C_{22} = SQUARE-MATRIX-MULTIPLY-RECURSIVE(A_{21}, B_{12}) + SQUARE-MATRIX-MULTIPLY-RECURSIVE(A_{22}, B_{22})</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content"><span class="kw">return</span> C</span></div>
            </div>
          </div>
          <p><strong>Sutileza de implementação (cálculo de índices vs. cópia):</strong> Se copiássemos elementos para criar $12$ novas matrizes na linha 5, gastaríamos $\\Theta(n^2)$; porém, especificando submatrizes por faixas de índices de linha e coluna (cálculo de índices), a partição na linha 5 leva $\\Theta(1)$. Em ambos os casos, as $4$ adições de matrizes nas linhas 6–9 (cada uma com $n^2/4$ entradas) custam $\\Theta(n^2)$, e as $8$ chamadas recursivas custam $8T(n/2)$, gerando a recorrência (Equação 4.17):</p>
          $$T(n) = \\begin{cases} \\Theta(1) & \\text{se } n = 1, \\\\ 8T(n/2) + \\Theta(n^2) & \\text{se } n > 1. \\end{cases}$$
          <p>Pelo Caso 1 do Teorema Mestre ($a = 8, b = 2 \\implies n^{\\log_2 8} = n^3$, que domina polinomialmente $f(n) = \\Theta(n^2)$), a solução continua sendo <strong>$T(n) = \\Theta(n^3)$</strong>!</p>

          <h3>3. O Método de Strassen: 7 Multiplicações em vez de 8 ($\\Theta(n^{\\lg 7})$)</h3>
          <p>A chave do método de Strassen é tornar a árvore de recursão ligeiramente menos frondosa: reduzir de <strong>$8$ para $7$ multiplicações recursivas</strong> de matrizes $n/2 \\times n/2$, pagando o preço de realizar um número constante de somas e subtrações extras de matrizes $n/2 \\times n/2$ (que continuam custando $\\Theta(n^2)$). O algoritmo compreende <strong>quatro etapas</strong>:</p>
          <ol>
            <li><strong>Etapa 1 (Divisão em $\\Theta(1)$):</strong> Dividir $A, B, C$ em submatrizes $n/2 \\times n/2$ por cálculo de índices.</li>
            <li><strong>Etapa 2 (Criação das 10 matrizes $S_1, \\dots, S_{10}$ em $\\Theta(n^2)$):</strong> Cada $S_i$ é a soma ou diferença de duas submatrizes da Etapa 1:
              $$\\begin{aligned}
              S_1 &= B_{12} - B_{22} & S_6 &= A_{11} + A_{22} \\\\
              S_2 &= A_{11} + A_{12} & S_7 &= A_{12} - A_{22} \\\\
              S_3 &= A_{21} + A_{22} & S_8 &= B_{21} + B_{22} \\\\
              S_4 &= B_{21} - B_{11} & S_9 &= A_{11} - A_{21} \\\\
              S_5 &= A_{11} + A_{22} & S_{10} &= B_{11} + B_{12}
              \\end{aligned}$$
            </li>
            <li><strong>Etapa 3 (Conquista — 7 produtos recursivos $P_1, \\dots, P_7$ em $7T(n/2)$):</strong> Calculamos recursivamente apenas $7$ multiplicações de matrizes $n/2 \\times n/2$:
              $$\\begin{aligned}
              P_1 &= A_{11} \\cdot S_1 = A_{11}B_{12} - A_{11}B_{22} \\\\
              P_2 &= S_2 \\cdot B_{22} = A_{11}B_{22} + A_{12}B_{22} \\\\
              P_3 &= S_3 \\cdot B_{11} = A_{21}B_{11} + A_{22}B_{11} \\\\
              P_4 &= A_{22} \\cdot S_4 = A_{22}B_{21} - A_{22}B_{11} \\\\
              P_5 &= S_5 \\cdot S_6 = A_{11}B_{11} + A_{11}B_{22} + A_{22}B_{11} + A_{22}B_{22} \\\\
              P_6 &= S_7 \\cdot S_8 = A_{12}B_{21} + A_{12}B_{22} - A_{22}B_{21} - A_{22}B_{22} \\\\
              P_7 &= S_9 \\cdot S_{10} = A_{11}B_{11} + A_{11}B_{12} - A_{21}B_{11} - A_{21}B_{12}
              \\end{aligned}$$
            </li>
            <li><strong>Etapa 4 (Combinação — Reconstrução de $C_{11}, C_{12}, C_{21}, C_{22}$ com 8 somas/subtrações em $\\Theta(n^2)$):</strong>
              <ul>
                <li>$C_{11} = P_5 + P_4 - P_2 + P_6 = (A_{11}B_{11} + A_{11}B_{22} + A_{22}B_{11} + A_{22}B_{22}) + (A_{22}B_{21} - A_{22}B_{11}) - (A_{11}B_{22} + A_{12}B_{22}) + (A_{12}B_{21} + A_{12}B_{22} - A_{22}B_{21} - A_{22}B_{22}) = A_{11}B_{11} + A_{12}B_{21}$</li>
                <li>$C_{12} = P_1 + P_2 = (A_{11}B_{12} - A_{11}B_{22}) + (A_{11}B_{22} + A_{12}B_{22}) = A_{11}B_{12} + A_{12}B_{22}$</li>
                <li>$C_{21} = P_3 + P_4 = (A_{21}B_{11} + A_{22}B_{11}) + (A_{22}B_{21} - A_{22}B_{11}) = A_{21}B_{11} + A_{22}B_{21}$</li>
                <li>$C_{22} = P_5 + P_1 - P_3 - P_7 = (A_{11}B_{11} + A_{11}B_{22} + A_{22}B_{11} + A_{22}B_{22}) + (A_{11}B_{12} - A_{11}B_{22}) - (A_{21}B_{11} + A_{22}B_{11}) - (A_{11}B_{11} + A_{11}B_{12} - A_{21}B_{11} - A_{21}B_{12}) = A_{21}B_{12} + A_{22}B_{22}$</li>
              </ul>
            </li>
          </ol>

          <p><strong>Recorrência de Strassen (Equação 4.18, p. 78):</strong> Somando as Etapas 1, 2 e 4 ($10 + 8 = 18$ somas/subtrações de matrizes $n/2 \\times n/2$, que custam $\\Theta(n^2)$) com as $7$ chamadas recursivas da Etapa 3:</p>
          $$T(n) = \\begin{cases} \\Theta(1) & \\text{se } n = 1, \\\\ 7T(n/2) + \\Theta(n^2) & \\text{se } n > 1. \\end{cases}$$
          <p>Pelo Caso 1 do Teorema Mestre ($a = 7, b = 2 \\implies n^{\\log_2 7} = n^{\\lg 7}$, com $f(n) = O(n^{\\lg 7 - \\epsilon})$ para $\\epsilon = 0,8$), a solução é:</p>
          $$T(n) = \\Theta(n^{\\lg 7}) = O(n^{2,81}).$$
          <p><strong>Considerações práticas (Notas do Capítulo, p. 104):</strong> Na prática, Strassen possui constante oculta maior que <code>SQUARE-MATRIX-MULTIPLY</code>, não é ideal para matrizes esparsas, acumula mais erro de ponto flutuante (menor estabilidade numérica, analisada por Higham) e consome memória extra para as submatrizes recursivas. Por isso, bibliotecas de alto desempenho usam Strassen apenas acima de um <strong>ponto de passagem (crossover point)</strong> $n_0$ e revertem para o método tradicional quando o subproblema cai abaixo de $n_0$. O menor expoente assintótico citado no livro é o de Coppersmith e Winograd ($O(n^{2,376})$), enquanto o único limite inferior geral conhecido é o trivial $\\Omega(n^2)$ (pois é preciso preencher $n^2$ entradas).</p>
        `
      },

      /* ====================================================================
         UNIDADE 3.3 — SEÇÃO 4.3: O MÉTODO DE SUBSTITUIÇÃO PARA RESOLVER RECORRÊNCIAS
         ==================================================================== */
      {
        id: "u3-3",
        code: "UNIDADE 3.3 • CAP. 4 (SEÇÃO 4.3)",
        pages: "pp. 81–86",
        title: "4.3 O Método de Substituição para Resolver Recorrências",
        content: `
          <p>O <strong>método de substituição</strong> para resolver recorrências compreende duas etapas fundamentais:</p>
          <ol>
            <li><strong>Arriscar um palpite (conjectura)</strong> para a forma assintótica da solução.</li>
            <li><strong>Usar indução matemática</strong> para encontrar as constantes que funcionam e demonstrar que a solução vale.</li>
          </ol>
          <p>O nome "método de substituição" vem do fato de que substituímos a função desconhecida $T$ pelo nosso palpite indutivo quando o aplicamos aos argumentos menores no lado direito da recorrência.</p>

          <h3>1. Exemplo Completo: $T(n) = 2T(\\lfloor n/2 \\rfloor) + n$ (Equação 4.19)</h3>
          <p>Queremos provar que $T(n) = O(n \\lg n)$. Para isso, devemos provar que $T(n) \\le c n \\lg n$ para uma constante apropriada $c > 0$ e para todo $n \\ge n_0$.</p>
          <ul>
            <li><strong>Passo Indutivo:</strong> Suponha que o limite $T(k) \\le c k \\lg k$ seja válido para todos os números positivos $k < n$, em particular para $k = \\lfloor n/2 \\rfloor$, o que nos dá $T(\\lfloor n/2 \\rfloor) \\le c \\lfloor n/2 \\rfloor \\lg(\\lfloor n/2 \\rfloor)$. Substituindo na recorrência:
              $$\\begin{aligned}
              T(n) &\\le 2\\left(c \\lfloor n/2 \\rfloor \\lg(\\lfloor n/2 \\rfloor)\\right) + n \\\\
                   &\\le c n \\lg(n/2) + n \\\\
                   &= c n (\\lg n - \\lg 2) + n \\\\
                   &= c n \\lg n - c n + n \\\\
                   &\\le c n \\lg n,
              \\end{aligned}$$
              onde a última desigualdade vale <strong>desde que $-cn + n \\le 0 \\iff c \\ge 1$</strong>!</li>
            <li><strong>Tratamento das Condições de Contorno (Casos-Base da Indução vs. Caso-Base da Recorrência):</strong> Se $T(1) = 1$ for a única condição de contorno da recorrência, não podemos escolher $n_0 = 1$ na indução, pois para $n = 1$ teríamos $T(1) \\le c(1)\\lg 1 = 0$, o que contradiz $T(1) = 1$! Como resolvemos isso? Tiramos proveito da definição de $O(n \\lg n)$, que exige apenas $T(n) \\le c n \\lg n$ para $n \\ge n_0$ com $n_0$ de nossa escolha. Observamos que, para $n > 3$, a recorrência $T(n) = 2T(\\lfloor n/2 \\rfloor) + n$ não depende diretamente de $T(1)$, mas sim de $T(2)$ e $T(3)$! Com $T(1) = 1$, calculamos $T(2) = 2T(1) + 2 = 4$ e $T(3) = 2T(1) + 3 = 5$. Escolhemos então <strong>$n_0 = 2$</strong> e tomamos <strong>$n = 2$ e $n = 3$ como os casos-base da prova indutiva</strong>: basta escolher $c$ tal que $T(2) = 4 \\le c(2 \\lg 2) = 2c$ e $T(3) = 5 \\le c(3 \\lg 3)$, o que é satisfeito para qualquer <strong>$c \\ge 2$</strong>!</li>
          </ul>

          <h3>2. Sutilezas: Subtraindo um Termo de Ordem Mais Baixa</h3>
          <p>Às vezes, seu palpite assintótico está <em>correto</em>, mas a indução trava porque a hipótese indutiva não é suficientemente forte! Considere a recorrência (p. 84):</p>
          $$T(n) = T(\\lfloor n/2 \\rfloor) + T(\\lceil n/2 \\rceil) + 1.$$
          <p>Sabemos que a solução é $T(n) = O(n)$. Se tentarmos provar diretamente a hipótese $T(n) \\le cn$, a substituição produz:</p>
          $$T(n) \\le c\\lfloor n/2 \\rfloor + c\\lceil n/2 \\rceil + 1 = cn + 1,$$
          <p>que <strong>não implica $T(n) \\le cn$ para nenhuma escolha de $c$</strong>! Em vez de enfraquecer o limite para $O(n^2)$, <strong>fortalecemos a hipótese indutiva subtraindo um termo de ordem mais baixa</strong>: propomos <strong>$T(n) \\le cn - d$</strong>, onde $d \\ge 0$ é uma constante. Substituindo nos dois termos recursivos (note que $d$ é subtraído duas vezes, uma para cada chamada recursiva!):</p>
          $$\\begin{aligned}
          T(n) &\\le (c\\lfloor n/2 \\rfloor - d) + (c\\lceil n/2 \\rceil - d) + 1 \\\\
               &= cn - 2d + 1 \\\\
               &\\le cn - d,
          \\end{aligned}$$
          <p>o que é verdadeiro desde que $-2d + 1 \\le -d \\iff \\mathbf{d \\ge 1}$! Escolhendo $d = 1$ e depois $c$ suficientemente grande para o caso-base, a prova indutiva fecha perfeitamente.</p>

          <div class="canonical-callout warning">
            <span class="callout-tag">[ ARMADILHA MORTAL • NUNCA USE NOTAÇÃO ASSINTÓTICA NA HIPÓTESE INDUTIVA! ]</span>
            <p>Na página 85 ("Como evitar armadilhas"), os autores alertam contra um erro clássico: na recorrência $T(n) = 2T(\\lfloor n/2 \\rfloor) + n$ (cuja solução real é $\\Theta(n \\lg n)$), alguém poderia "provar" falsamente que $T(n) = O(n)$ assumindo $T(n) \\le cn$ e escrevendo:</p>
            $$T(n) \\le 2(c\\lfloor n/2 \\rfloor) + n \\le cn + n = O(n) \\qquad \\text{(ERRADO!)}$$
            <p><strong>Por que está errado?</strong> Porque a constante implícita no $O(n)$ do final ($c + 1$) é maior que a constante $c$ da hipótese indutiva! No método de substituição, você deve provar a <strong>forma exata</strong> da hipótese indutiva com exatamente a mesma constante $c$: $T(n) \\le cn$.</p>
          </div>

          <h3>3. Mudança de Variáveis (Renomeação Algébrica)</h3>
          <p>Considere a recorrência aparentemente intimidadora (p. 85):</p>
          $$T(n) = 2T(\\lfloor \\sqrt{n} \\rfloor) + \\lg n.$$
          <p>Ignorando o arredondamento inteiro por conveniência:</p>
          <ol>
            <li><strong>Passo 1 — Substituir $m = \\lg n$ (isto é, $n = 2^m$ e $\\sqrt{n} = 2^{m/2}$):</strong>
              $$T(2^m) = 2T(2^{m/2}) + m.$$
            </li>
            <li><strong>Passo 2 — Definir a nova função $S(m) = T(2^m)$:</strong> Como $T(2^{m/2}) = S(m/2)$, a recorrência transforma-se em:
              $$S(m) = 2S(m/2) + m.$$
            </li>
            <li><strong>Passo 3 — Resolver para $S(m)$ e retornar à variável original $n$:</strong> Sabemos que $S(m) = 2S(m/2) + m$ tem solução $S(m) = O(m \\lg m)$ (na verdade, $\\Theta(m \\lg m)$). Substituindo de volta $m = \\lg n$:
              $$T(n) = T(2^m) = S(m) = O(m \\lg m) = \\mathbf{O(\\lg n \\lg \\lg n)}.$$
            </li>
          </ol>
        `
      },

      /* ====================================================================
         UNIDADE 3.4 — SEÇÃO 4.4: O MÉTODO DA ÁRVORE DE RECURSÃO
         ==================================================================== */
      {
        id: "u3-4",
        code: "UNIDADE 3.4 • CAP. 4 (SEÇÃO 4.4)",
        pages: "pp. 86–91",
        title: "4.4 O Método da Árvore de Recursão para Resolver Recorrências",
        content: `
          <p>Em uma <strong>árvore de recursão</strong>, cada nó representa o custo de um único subproblema dentro do conjunto de invocações recursivas. Somamos os custos dentro de cada nível da árvore para obter os <strong>custos por nível</strong> e, em seguida, somamos os custos de todos os níveis para obter o custo total. Ela é ideal para gerar um bom palpite (permitindo certo "desleixo" controlado, como omitir pisos/tetos ou supor $n$ potência exata) que é então verificado rigorosamente pelo método de substituição.</p>

          <h3>1. Estudo de Caso 1: $T(n) = 3T(\\lfloor n/4 \\rfloor) + \\Theta(n^2)$ (Figura 4.5, pp. 86–89)</h3>
          <p>Explicitamos a constante $c > 0$ do termo $\\Theta(n^2)$ e omitimos o piso, analisando $T(n) = 3T(n/4) + cn^2$ com $n$ potência de $4$:</p>
          <ul>
            <li><strong>Tamanho do subproblema na profundidade $i$:</strong> Cai por um fator de $4$ a cada nível, logo vale $n/4^i$.</li>
            <li><strong>Altura da árvore e número de níveis:</strong> Atingimos o caso-base de tamanho $1$ quando $n/4^i = 1 \\iff i = \\log_4 n$. Portanto, a árvore tem altura $\\log_4 n$ e possui $\\log_4 n + 1$ níveis ($i = 0, 1, \\dots, \\log_4 n$).</li>
            <li><strong>Número de nós e custo no nível interno $i$ ($0 \\le i \\le \\log_4 n - 1$):</strong> Há $3^i$ nós na profundidade $i$, cada um com custo $c(n/4^i)^2 = cn^2 / 16^i$. O custo total do nível $i$ é:
              $$\\text{Custo}(\\text{nível } i) = 3^i \\cdot c\\left(\\frac{n}{4^i}\\right)^2 = \\left(\\frac{3}{16}\\right)^i cn^2.$$
            </li>
            <li><strong>Custo no nível das folhas ($i = \\log_4 n$):</strong> Há $3^{\\log_4 n} = n^{\\log_4 3}$ folhas, cada uma custando $T(1) = \\Theta(1)$, totalizando $\\Theta(n^{\\log_4 3})$ (onde $\\log_4 3 \\approx 0,7925$).</li>
            <li><strong>Soma de todos os níveis (série geométrica decrescente de razão $r = 3/16 < 1$):</strong>
              $$\\begin{aligned}
              T(n) &= cn^2 + \\frac{3}{16}cn^2 + \\left(\\frac{3}{16}\\right)^2 cn^2 + \\dots + \\left(\\frac{3}{16}\\right)^{\\log_4 n - 1} cn^2 + \\Theta(n^{\\log_4 3}) \\\\
                   &= \\sum_{i=0}^{\\log_4 n - 1} \\left(\\frac{3}{16}\\right)^i cn^2 + \\Theta(n^{\\log_4 3}) \\\\
                   &< \\sum_{i=0}^{\\infty} \\left(\\frac{3}{16}\\right)^i cn^2 + \\Theta(n^{\\log_4 3}) \\\\
                   &= \\frac{1}{1 - (3/16)} cn^2 + \\Theta(n^{\\log_4 3}) = \\frac{16}{13}cn^2 + \\Theta(n^{\\log_4 3}) = \\mathbf{O(n^2)}.
              \\end{aligned}$$
            </li>
            <li><strong>Verificação por Substituição:</strong> Queremos provar que $T(n) \\le dn^2$ para alguma constante $d > 0$:
              $$T(n) \\le 3T(\\lfloor n/4 \\rfloor) + cn^2 \\le 3d\\lfloor n/4 \\rfloor^2 + cn^2 \\le 3d(n/4)^2 + cn^2 = \\frac{3}{16}dn^2 + cn^2 \\le dn^2,$$
              onde a última etapa vale sempre que $\\frac{3}{16}d + c \\le d \\iff c \\le \\frac{13}{16}d \\iff \\mathbf{d \\ge (16/13)c}$! Como a raiz já contribui com $cn^2 = \\Omega(n^2)$, concluímos $T(n) = \\Theta(n^2)$.</li>
          </ul>

          <h3>2. Estudo de Caso 2: Árvore Desbalanceada $T(n) = T(n/3) + T(2n/3) + cn$ (Figura 4.6, pp. 89–90)</h3>
          <p>Considere agora uma recorrência com subproblemas de tamanhos desiguais ($n/3$ e $2n/3$), à qual o Teorema Mestre <strong>não se aplica</strong>:</p>
          $$T(n) = T(n/3) + T(2n/3) + O(n).$$
          <ul>
            <li><strong>Análise da árvore desbalanceada (Figura 4.6):</strong>
              <ul>
                <li>O <strong>caminho mais curto</strong> (sempre descendo para o filho esquerdo $n/3$) atinge tamanho $1$ quando $n/3^i = 1 \\iff i = \\log_3 n$.</li>
                <li>O <strong>caminho mais longo</strong> (sempre descendo para o filho direito $2n/3$) atinge tamanho $1$ quando $n(2/3)^k = 1 \\iff k = \\log_{3/2} n$.</li>
                <li>Em cada nível completo $i$ (para $0 \\le i \\le \\log_3 n$), a soma dos tamanhos dos subproblemas é exatamente $n$, e portanto o custo do nível é $cn$: por exemplo, no nível $1$ temos $c(n/3) + c(2n/3) = cn$; no nível $2$ temos $c(n/9) + 2c(2n/9) + c(4n/9) = cn$. Nos níveis abaixo de $\\log_3 n$ (onde algumas folhas já terminaram), o custo do nível é <strong>no máximo $cn$</strong>!</li>
              </ul>
            </li>
            <li><strong>Gerando o palpite para o limite superior:</strong> Como a árvore tem altura máxima $\\log_{3/2} n$ e cada nível custa no máximo $cn$, estimamos:
              $$T(n) \\le cn \\cdot \\log_{3/2} n = O(n \\lg n)$$
              (já que $\\log_{3/2} n = \\frac{\\lg n}{\\lg(3/2)}$ difere de $\\lg n$ apenas pela constante $1/\\lg(3/2)$).</li>
            <li><strong>Verificação por Substituição:</strong> Provamos que $T(n) \\le dn \\lg n$:
              $$\\begin{aligned}
              T(n) &\\le T(n/3) + T(2n/3) + cn \\\\
                   &\\le d(n/3)\\lg(n/3) + d(2n/3)\\lg(2n/3) + cn \\\\
                   &= \\left(\\frac{dn}{3}\\lg n - \\frac{dn}{3}\\lg 3\\right) + \\left(\\frac{2dn}{3}\\lg n - \\frac{2dn}{3}\\lg(3/2)\\right) + cn \\\\
                   &= dn \\lg n - d\\left(\\frac{1}{3}\\lg 3 + \\frac{2}{3}\\lg(3/2)\\right)n + cn \\\\
                   &= dn \\lg n - d\\left(\\lg 3 - \\frac{2}{3}\\right)n + cn \\\\
                   &\\le dn \\lg n,
              \\end{aligned}$$
              desde que escolhamos a constante <strong>$d \\ge \\frac{c}{\\lg 3 - (2/3)}$</strong> (pois $\\lg 3 \\approx 1,585 > 2/3$). Portanto, $T(n) = O(n \\lg n)$ (e, como os primeiros $\\log_3 n$ níveis são completos e custam $cn$ cada, também vale $T(n) = \\Omega(n \\lg n)$, logo $T(n) = \\Theta(n \\lg n)$!).</li>
          </ul>
        `
      },

      /* ====================================================================
         UNIDADE 3.5 — SEÇÃO 4.5: O MÉTODO MESTRE PARA RESOLVER RECORRÊNCIAS
         ==================================================================== */
      {
        id: "u3-5",
        code: "UNIDADE 3.5 • CAP. 4 (SEÇÃO 4.5)",
        pages: "pp. 91–95",
        title: "4.5 O Método Mestre para Resolver Recorrências",
        content: `
          <p>O <strong>método mestre</strong> fornece um "livro de receitas" para resolver recorrências da forma (Equação 4.20):</p>
          $$T(n) = aT(n/b) + f(n),$$
          <p>onde $a \\ge 1$ e $b > 1$ são constantes e $f(n)$ é uma função assintoticamente positiva. Ela descreve o tempo de execução de um algoritmo que divide um problema de tamanho $n$ em $a$ subproblemas de tamanho $n/b$ cada ($a$ e $b$ não precisam ser inteiros na matemática do teorema, mas nos algoritmos $a$ é um inteiro positivo e $n/b$ pode significar $\\lfloor n/b \\rfloor$ ou $\\lceil n/b \\rceil$), gastando tempo $f(n) = D(n) + C(n)$ para dividir e combinar.</p>

          <div class="canonical-callout theorem">
            <span class="callout-tag">[ TEOREMA 4.1 • TEOREMA MESTRE (PÁGINA 92) ]</span>
            <p>Sejam $a \\ge 1$ e $b > 1$ constantes, seja $f(n)$ uma função e seja $T(n)$ definida nos inteiros não negativos pela recorrência</p>
            $$T(n) = aT(n/b) + f(n),$$
            <p>onde interpretamos $n/b$ como querendo dizer $\\lfloor n/b \\rfloor$ ou $\\lceil n/b \\rceil$. Então, $T(n)$ tem os seguintes limites assintóticos:</p>
            <ol>
              <li><strong>Caso 1:</strong> Se $f(n) = O(n^{\\log_b a - \\epsilon})$ para alguma constante $\\epsilon > 0$, então <strong>$T(n) = \\Theta(n^{\\log_b a})$</strong>.</li>
              <li><strong>Caso 2:</strong> Se $f(n) = \\Theta(n^{\\log_b a})$, então <strong>$T(n) = \\Theta(n^{\\log_b a} \\lg n)$</strong>.</li>
              <li><strong>Caso 3:</strong> Se $f(n) = \\Omega(n^{\\log_b a + \\epsilon})$ para alguma constante $\\epsilon > 0$, e se $a f(n/b) \\le c f(n)$ para alguma constante $c < 1$ e para todo $n$ suficientemente grande (<strong>condição de regularidade</strong>), então <strong>$T(n) = \\Theta(f(n))$</strong>.</li>
            </ol>
          </div>

          <h3>1. Interpretação Técnica: Comparação Polinomial e as Lacunas (Gaps)</h3>
          <p>Em cada um dos três casos, comparamos a função de trabalho $f(n)$ com a função de limiar das folhas <strong>$n^{\\log_b a}$</strong>:</p>
          <ul>
            <li><strong>Polinomialmente menor (Caso 1):</strong> Não basta que $f(n)$ seja assintoticamente menor que $n^{\\log_b a}$; ela precisa ser <strong>polinomialmente menor</strong>, isto é, menor por um fator polinomial $n^{\\epsilon}$ para alguma constante $\\epsilon > 0$. Nesse caso, o custo nas folhas domina e $T(n) = \\Theta(n^{\\log_b a})$.</li>
            <li><strong>Mesma ordem de grandeza (Caso 2):</strong> $f(n)$ e $n^{\\log_b a}$ têm o mesmo crescimento assintótico $\\Theta$. Multiplicamos por um fator logarítmico adicional $\\lg n$, obtendo $T(n) = \\Theta(n^{\\log_b a} \\lg n)$. (Nota: o Exercício 4.6-2 estende o Caso 2 para $f(n) = \\Theta(n^{\\log_b a} \\lg^k n)$ com $k \\ge 0$, resultando em $T(n) = \\Theta(n^{\\log_b a} \\lg^{k+1} n)$.)</li>
            <li><strong>Polinomialmente maior + Regularidade (Caso 3):</strong> $f(n)$ deve ser maior que $n^{\\log_b a}$ por um fator polinomial $n^{\\epsilon}$ ($\\epsilon > 0$) <strong>e</strong> satisfazer a condição de regularidade $af(n/b) \\le cf(n)$ com $c < 1$. Nesse caso, o custo na raiz domina e $T(n) = \\Theta(f(n))$.</li>
          </ul>

          <div class="canonical-callout warning">
            <span class="callout-tag">[ AS LACUNAS DO TEOREMA MESTRE • QUANDO ELE NÃO SE APLICA ]</span>
            <p>Os três casos <strong>não cobrem todas as possibilidades</strong> para $f(n)$:</p>
            <ul>
              <li><strong>Lacuna entre os Casos 1 e 2:</strong> Quando $f(n)$ é assintoticamente menor que $n^{\\log_b a}$, mas <em>não polinomialmente menor</em> (ex.: $T(n) = 2T(n/2) + n / \\lg n$, onde $n^{\\log_2 2} = n$ e $n/f(n) = \\lg n = o(n^\\epsilon)$ para todo $\\epsilon > 0$).</li>
              <li><strong>Lacuna entre os Casos 2 e 3:</strong> Quando $f(n)$ é assintoticamente maior que $n^{\\log_b a}$, mas <em>não polinomialmente maior</em>. O exemplo canônico do livro (p. 93) é:
                $$T(n) = 2T(n/2) + n \\lg n.$$
                Aqui $a = 2, b = 2, n^{\\log_2 2} = n$ e $f(n) = n \\lg n$. Embora $n \\lg n$ seja assintoticamente maior que $n$, a razão $f(n)/n^{\\log_b a} = \\lg n$ é assintoticamente menor que $n^\\epsilon$ para qualquer constante $\\epsilon > 0$! Logo, o Teorema 4.1 padrão não se aplica (pela extensão do Exercício 4.6-2 com $k=1$, sua solução é $\\Theta(n \\lg^2 n)$).</li>
              <li><strong>Falha da Condição de Regularidade no Caso 3:</strong> Se $f(n) = \\Omega(n^{\\log_b a + \\epsilon})$ mas $af(n/b) \\le cf(n)$ falha (ex.: $T(n) = 2T(n/2) + n^2(2 - \\cos n)$, Exercício 4.5-5).</li>
            </ul>
          </div>

          <h3>2. Tabela Resumo dos Exemplos Canônicos da Seção 4.5 (pp. 93–94)</h3>
          <div class="clrs-table-wrap">
            <table class="clrs-table">
              <thead>
                <tr>
                  <th>Recorrência</th>
                  <th>$a, b$</th>
                  <th>$n^{\\log_b a}$</th>
                  <th>$f(n)$</th>
                  <th>Diagnóstico do Teorema Mestre</th>
                  <th>Solução Assintótica</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>$T(n) = 9T(n/3) + n$</td>
                  <td>$a=9, b=3$</td>
                  <td>$n^{\\log_3 9} = n^2$</td>
                  <td>$n = O(n^{2-1})$</td>
                  <td><strong>Caso 1</strong> ($\\epsilon = 1$)</td>
                  <td>$\\Theta(n^2)$</td>
                </tr>
                <tr>
                  <td>$T(n) = T(2n/3) + 1$</td>
                  <td>$a=1, b=3/2$</td>
                  <td>$n^{\\log_{3/2} 1} = n^0 = 1$</td>
                  <td>$1 = \\Theta(1)$</td>
                  <td><strong>Caso 2</strong></td>
                  <td>$\\Theta(\\lg n)$</td>
                </tr>
                <tr>
                  <td>$T(n) = 3T(n/4) + n \\lg n$</td>
                  <td>$a=3, b=4$</td>
                  <td>$n^{\\log_4 3} \\approx n^{0,793}$</td>
                  <td>$n \\lg n = \\Omega(n^{\\log_4 3 + 0,2})$</td>
                  <td><strong>Caso 3</strong> ($\\epsilon \\approx 0,2$; reg. $c = 3/4 < 1$)</td>
                  <td>$\\Theta(n \\lg n)$</td>
                </tr>
                <tr>
                  <td>$T(n) = 2T(n/2) + n \\lg n$</td>
                  <td>$a=2, b=2$</td>
                  <td>$n^{\\log_2 2} = n$</td>
                  <td>$n \\lg n$</td>
                  <td><strong>Lacuna entre Casos 2 e 3</strong> ($\\lg n \\ne \\Omega(n^\\epsilon)$)</td>
                  <td>$\\Theta(n \\lg^2 n)$ (Ex. 4.6-2)</td>
                </tr>
                <tr>
                  <td>$T(n) = 2T(n/2) + \\Theta(n)$</td>
                  <td>$a=2, b=2$</td>
                  <td>$n^{\\log_2 2} = n$</td>
                  <td>$\\Theta(n)$</td>
                  <td><strong>Caso 2</strong> (Merge Sort / Subarranjo Máx.)</td>
                  <td>$\\Theta(n \\lg n)$</td>
                </tr>
                <tr>
                  <td>$T(n) = 8T(n/2) + \\Theta(n^2)$</td>
                  <td>$a=8, b=2$</td>
                  <td>$n^{\\log_2 8} = n^3$</td>
                  <td>$\\Theta(n^2) = O(n^{3-1})$</td>
                  <td><strong>Caso 1</strong> ($\\epsilon = 1$; Mult. Matrizes Recursiva)</td>
                  <td>$\\Theta(n^3)$</td>
                </tr>
                <tr>
                  <td>$T(n) = 7T(n/2) + \\Theta(n^2)$</td>
                  <td>$a=7, b=2$</td>
                  <td>$n^{\\lg 7} \\approx n^{2,81}$</td>
                  <td>$\\Theta(n^2) = O(n^{\\lg 7 - 0,8})$</td>
                  <td><strong>Caso 1</strong> ($\\epsilon = 0,8$; Algoritmo de Strassen)</td>
                  <td>$\\Theta(n^{\\lg 7})$</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },

      /* ====================================================================
         UNIDADE 3.6 — SEÇÃO 4.6: DEMONSTRAÇÃO DO TEOREMA MESTRE
         ==================================================================== */
      {
        id: "u3-6",
        code: "UNIDADE 3.6 • CAP. 4 (SEÇÃO 4.6)",
        pages: "pp. 95–105",
        title: "4.6 Prova do Teorema Mestre (Potências Exatas e Pisos/Tetos)",
        content: `
          <p>A Seção 4.6 apresenta a demonstração completa do Teorema Mestre dividida em duas partes: na <strong>Seção 4.6.1</strong>, analisamos a recorrência para potências exatas de $b$ ($n = 1, b, b^2, \\dots$) por meio dos Lemas 4.2, 4.3 e 4.4; na <strong>Seção 4.6.2</strong>, estendemos a análise a todos os inteiros $n$ domando rigorosamente o efeito de pisos $\\lfloor n/b \\rfloor$ e tetos $\\lceil n/b \\rceil$.</p>

          <div class="canonical-callout">
            <span class="callout-tag">[ ALERTA METODOLÓGICO DA PÁGINA 95 • NOTAÇÃO ASSINTÓTICA EM DOMÍNIO RESTRITO ]</span>
            <p>Os autores destacam um ponto sutil: provar que $T(n) = O(n)$ apenas quando $n$ é uma potência exata de $2$ <strong>não garante</strong> por si só que $T(n) = O(n)$ para todo inteiro $n$! Por exemplo, se uma função patológica fosse definida por $T(n) = n$ quando $n = 2^i$ e $T(n) = n^2$ caso contrário, o menor limite superior válido para todos os inteiros seria $O(n^2)$. É exatamente por isso que a Seção 4.6.2 é indispensável para completar a prova.</p>
          </div>

          <h3>1. Parte I — Prova para Potências Exatas de $b$ (Lemas 4.2, 4.3 e 4.4)</h3>
          <p><strong>Lema 4.2 (Árvore de Recursão Geral — Figura 4.7, Equação 4.21):</strong> Sejam $a \\ge 1$ e $b > 1$ constantes e $f(n)$ uma função não negativa definida para potências exatas de $b$. Se $T(1) = \\Theta(1)$ e $T(n) = aT(n/b) + f(n)$ para $n = b^i$, então:</p>
          $$T(n) = \\Theta(n^{\\log_b a}) + \\sum_{j=0}^{\\log_b n - 1} a^j f(n/b^j). \\qquad (4.21)$$
          <p><em>Demonstração do Lema 4.2:</em> Na árvore $a$-ária completa da Figura 4.7, a profundidade $j$ possui $a^j$ nós, cada um com custo $f(n/b^j)$, somando $a^j f(n/b^j)$ no nível $j$. As folhas estão na profundidade $\\log_b n$ (pois $n/b^{\\log_b n} = 1$), e há $a^{\\log_b n} = n^{\\log_b a}$ folhas, cada uma custando $T(1) = \\Theta(1)$, somando $\\Theta(n^{\\log_b a})$.</p>

          <p><strong>Lema 4.3 (Limites Assintóticos para o Somatório $g(n)$, Equação 4.22):</strong> Definindo a soma dos níveis internos como</p>
          $$g(n) = \\sum_{j=0}^{\\log_b n - 1} a^j f(n/b^j), \\qquad (4.22)$$
          <p>temos os três comportamentos para potências exatas de $b$:</p>
          <ol>
            <li><strong>Prova do Caso 1 no Lema 4.3:</strong> Se $f(n) = O(n^{\\log_b a - \\epsilon})$, então $f(n/b^j) = O((n/b^j)^{\\log_b a - \\epsilon})$. Fatorando $n^{\\log_b a - \\epsilon}$ e usando $a / b^{\\log_b a} = a / a = 1$, obtemos uma <strong>série geométrica crescente</strong> de razão $b^\\epsilon > 1$:
              $$\\sum_{j=0}^{\\log_b n - 1} a^j \\left(\\frac{n}{b^j}\\right)^{\\log_b a - \\epsilon} = n^{\\log_b a - \\epsilon} \\sum_{j=0}^{\\log_b n - 1} \\left(\\frac{a b^\\epsilon}{b^{\\log_b a}}\\right)^j = n^{\\log_b a - \\epsilon} \\sum_{j=0}^{\\log_b n - 1} (b^\\epsilon)^j = n^{\\log_b a - \\epsilon} \\left(\\frac{b^{\\epsilon \\log_b n} - 1}{b^\\epsilon - 1}\\right) = n^{\\log_b a - \\epsilon} \\left(\\frac{n^\\epsilon - 1}{b^\\epsilon - 1}\\right) = O(n^{\\log_b a}).$$
              Logo, $g(n) = O(n^{\\log_b a})$.</li>
            <li><strong>Prova do Caso 2 no Lema 4.3:</strong> Se $f(n) = \\Theta(n^{\\log_b a})$, então $f(n/b^j) = \\Theta((n/b^j)^{\\log_b a})$. Todos os termos da soma se igualam a $1$:
              $$\\sum_{j=0}^{\\log_b n - 1} a^j \\left(\\frac{n}{b^j}\\right)^{\\log_b a} = n^{\\log_b a} \\sum_{j=0}^{\\log_b n - 1} \\left(\\frac{a}{b^{\\log_b a}}\\right)^j = n^{\\log_b a} \\sum_{j=0}^{\\log_b n - 1} 1 = n^{\\log_b a} \\log_b n = \\Theta(n^{\\log_b a} \\lg n).$$
              Logo, $g(n) = \\Theta(n^{\\log_b a} \\lg n)$.</li>
            <li><strong>Prova do Caso 3 no Lema 4.3:</strong> Como o termo $j=0$ de $g(n)$ é $f(n)$ e todos os termos são não negativos, $g(n) = \\Omega(f(n))$. Pela condição de regularidade $af(n/b) \\le cf(n)$ com $c < 1$, iterando $j$ vezes obtemos $a^j f(n/b^j) \\le c^j f(n)$ (mais um termo $O(1)$ para os últimos níveis onde $n/b^j$ é pequeno). Isso gera uma <strong>série geométrica decrescente</strong>:
              $$g(n) = \\sum_{j=0}^{\\log_b n - 1} a^j f(n/b^j) \\le f(n) \\sum_{j=0}^{\\infty} c^j + O(1) = f(n) \\left(\\frac{1}{1 - c}\\right) + O(1) = O(f(n)).$$
              Portanto, $g(n) = \\Theta(f(n))$.</li>
          </ol>
          <p><strong>Lema 4.4:</strong> Combinando $T(n) = \\Theta(n^{\\log_b a}) + g(n)$ do Lema 4.2 com os limites de $g(n)$ do Lema 4.3, obtemos imediatamente os três casos do Teorema Mestre para potências exatas de $b$!</p>

          <h3>2. Parte II — O Tratamento Rigoroso de Pisos e Tetos (Seção 4.6.2, pp. 99–101)</h3>
          <p>Para estender a prova a todos os inteiros $n$, precisamos limitar superiormente $T(n) = aT(\\lceil n/b \\rceil) + f(n)$ (Equação 4.25) e limitar inferiormente $T(n) = aT(\\lfloor n/b \\rfloor) + f(n)$ (Equação 4.26). Como as duas provas são análogas, o livro demonstra o limite superior para o teto $\\lceil n/b \\rceil$.</p>
          <p>Definimos a sequência de tamanhos de argumentos recursivos $n_0, n_1, n_2, \\dots$ descendo na árvore (Figura 4.8, Equação 4.27):</p>
          $$n_j = \\begin{cases} n & \\text{se } j = 0, \\\\ \\lceil n_{j-1}/b \\rceil & \\text{se } j > 0. \\end{cases}$$
          <p>Usando repetidamente a desigualdade $\\lceil x \\rceil \\le x + 1$, obtemos:</p>
          <ul>
            <li>$n_0 = n$</li>
            <li>$n_1 \\le \\frac{n}{b} + 1$</li>
            <li>$n_2 \\le \\frac{1}{b}\\left(\\frac{n}{b} + 1\\right) + 1 = \\frac{n}{b^2} + \\frac{1}{b} + 1$</li>
            <li>Em geral, para qualquer profundidade $j$ (Equação 4.28):
              $$n_j \\le \\frac{n}{b^j} + \\sum_{i=0}^{j-1} \\frac{1}{b^i} < \\frac{n}{b^j} + \\sum_{i=0}^{\\infty} \\frac{1}{b^i} = \\frac{n}{b^j} + \\frac{b}{b - 1}.$$
            </li>
          </ul>
          <p><strong>Conclusão brilhante da Equação (4.28):</strong> Na profundidade $j = \\lfloor \\log_b n \\rfloor$, temos $n / b^{\\lfloor \\log_b n \\rfloor} < n / (n/b) = b$, e portanto:</p>
          $$n_{\\lfloor \\log_b n \\rfloor} < b + \\frac{b}{b - 1} = O(1)!$$
          <p>Isso prova que, mesmo acumulando arredondamentos para cima ($\\lceil \\cdot \\rceil$) em cada um dos $\\lfloor \\log_b n \\rfloor$ níveis da árvore, o tamanho do subproblema $n_j$ difere da divisão exata $n/b^j$ por <strong>no máximo a constante aditiva $\\frac{b}{b-1}$</strong>, atingindo tamanho constante na profundidade $\\lfloor \\log_b n \\rfloor$ e preservando intactos os três casos do Teorema Mestre para todos os inteiros $n$!</p>
        `
      }
    ],

    /* ======================================================================
       BANCADAS INTERATIVAS DO MÓDULO 3 (INJETADAS EM #workbench-mod3-mount)
       1. Analisador Interativo do Teorema Mestre & Árvore de Recursão
       2. Simulador Passo a Passo de Subarranjo Máximo (Divisão e Conquista)
       ====================================================================== */
    initWorkbenches: function () {
      const mount = document.getElementById("workbench-mod3-mount");
      if (!mount) return;

      mount.innerHTML = `
        <!-- BANCADA 01: ANALISADOR DO TEOREMA MESTRE E ÁRVORE DE RECURSÃO -->
        <div class="workbench-box" style="margin-top:1.75rem;">
          <div class="workbench-header">
            <span class="workbench-title">[ BANCADA INTERATIVA #01 • ANALISADOR DO TEOREMA MESTRE & ÁRVORE DE RECURSÃO ]</span>
            <span class="bracket-tag dark">T(n) = aT(n/b) + Θ(n^k lg^p n)</span>
          </div>
          <div class="workbench-body">
            <p style="font-size:0.9rem;color:var(--ink-secondary);margin-bottom:1rem;">
              Configure os parâmetros $a \\ge 1$, $b > 1$, o expoente polinomial $k \\ge 0$ e o expoente logarítmico $p$ de $f(n) = \\Theta(n^k \\lg^p n)$, ou escolha um dos exemplos clássicos do Capítulo 4:
            </p>

            <div class="workbench-controls" style="display:flex;flex-direction:column;gap:0.85rem;">
              <div style="display:flex;align-items:center;gap:0.65rem;flex-wrap:wrap;">
                <label style="font-family:var(--font-mono);font-size:0.76rem;font-weight:700;">EXEMPLOS DO CAPÍTULO 4:</label>
                <select id="mod3-mt-preset" class="search-input-brutal" style="max-width:420px;">
                  <option value="2,2,1,0">Merge Sort / Subarranjo Máximo: T(n) = 2T(n/2) + Θ(n)</option>
                  <option value="8,2,2,0">Mult. Matrizes Ingênua: T(n) = 8T(n/2) + Θ(n²)</option>
                  <option value="7,2,2,0">Algoritmo de Strassen: T(n) = 7T(n/2) + Θ(n²)</option>
                  <option value="9,3,1,0">Exemplo Seção 4.5 (Caso 1): T(n) = 9T(n/3) + n</option>
                  <option value="1,1.5,0,0">Busca / Seção 4.5 (Caso 2): T(n) = T(2n/3) + 1</option>
                  <option value="3,4,1,1">Exemplo Seção 4.5 (Caso 3): T(n) = 3T(n/4) + n lg n</option>
                  <option value="3,4,2,0">Árvore Seção 4.4 (Caso 3): T(n) = 3T(n/4) + cn²</option>
                  <option value="2,2,1,1">Lacuna Seção 4.5 (Ex. 4.6-2): T(n) = 2T(n/2) + n lg n</option>
                  <option value="4,2,2,1">Exercício 4.5-4 (Lacuna): T(n) = 4T(n/2) + n² lg n</option>
                  <option value="2,2,1,-1">Problema 4-3(e) (Lacuna p=-1): T(n) = 2T(n/2) + n / lg n</option>
                </select>
              </div>

              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:0.75rem;">
                <div>
                  <label style="display:block;font-family:var(--font-mono);font-size:0.72rem;font-weight:700;margin-bottom:0.25rem;">SUBPROBLEMAS (a ≥ 1)</label>
                  <input id="mod3-mt-a" type="number" step="1" min="1" max="64" value="2" class="search-input-brutal" style="width:100%;" />
                </div>
                <div>
                  <label style="display:block;font-family:var(--font-mono);font-size:0.72rem;font-weight:700;margin-bottom:0.25rem;">DIVISOR (b &gt; 1)</label>
                  <input id="mod3-mt-b" type="number" step="0.1" min="1.1" max="32" value="2" class="search-input-brutal" style="width:100%;" />
                </div>
                <div>
                  <label style="display:block;font-family:var(--font-mono);font-size:0.72rem;font-weight:700;margin-bottom:0.25rem;">EXPOENTE k EM n^k</label>
                  <input id="mod3-mt-k" type="number" step="0.25" min="0" max="10" value="1" class="search-input-brutal" style="width:100%;" />
                </div>
                <div>
                  <label style="display:block;font-family:var(--font-mono);font-size:0.72rem;font-weight:700;margin-bottom:0.25rem;">POTÊNCIA p EM lg^p n</label>
                  <input id="mod3-mt-p" type="number" step="1" min="-3" max="5" value="0" class="search-input-brutal" style="width:100%;" />
                </div>
              </div>
            </div>

            <div id="mod3-mt-output" style="margin-top:1rem;"></div>
          </div>
        </div>

        <!-- BANCADA 02: SIMULADOR PASSO A PASSO DE SUBARRANJO MÁXIMO -->
        <div class="workbench-box" style="margin-top:1.75rem;">
          <div class="workbench-header">
            <span class="workbench-title">[ BANCADA INTERATIVA #02 • SIMULADOR DE SUBARRANJO MÁXIMO (SEÇÃO 4.1) ]</span>
            <span class="bracket-tag emerald">DIVISÃO E CONQUISTA vs. KADANE</span>
          </div>
          <div class="workbench-body">
            <p style="font-size:0.9rem;color:var(--ink-secondary);margin-bottom:0.85rem;">
              Inspecione a decomposição recursiva de <code>FIND-MAXIMUM-SUBARRAY(A, 1, n)</code> e <code>FIND-MAX-CROSSING-SUBARRAY</code> sobre o arranjo de 16 dias da <em>Chemical Corporation</em> (Figura 4.3, p. 69) ou digite seu próprio arranjo:
            </p>
            <div class="workbench-controls" style="display:flex;gap:0.65rem;flex-wrap:wrap;align-items:center;">
              <input id="mod3-sub-input" type="text" class="search-input-brutal" style="flex:1;min-width:260px;" value="13, -3, -25, 20, -3, -16, -23, 18, 20, -7, 12, -5, -22, 15, -4, 7" />
              <button id="mod3-sub-run-btn" class="btn-primary-brutal">[ EXECUTAR DIVISÃO E CONQUISTA ]</button>
              <button id="mod3-sub-reset-btn" class="btn-secondary-brutal">[ ARRANJO DA FIGURA 4.3 ]</button>
            </div>
            <div id="mod3-sub-output" style="margin-top:1rem;"></div>
          </div>
        </div>
      `;

      /* Lógica da Bancada 01: Analisador do Teorema Mestre */
      const presetEl = document.getElementById("mod3-mt-preset");
      const aEl = document.getElementById("mod3-mt-a");
      const bEl = document.getElementById("mod3-mt-b");
      const kEl = document.getElementById("mod3-mt-k");
      const pEl = document.getElementById("mod3-mt-p");
      const outEl = document.getElementById("mod3-mt-output");

      function formatPolyTerm(exp) {
        if (Math.abs(exp) < 1e-6) return "1";
        if (Math.abs(exp - 1) < 1e-6) return "n";
        if (Math.abs(exp - 0.5) < 1e-6) return "√n";
        const rounded = Math.round(exp * 1000) / 1000;
        return `n<sup>${rounded}</sup>`;
      }

      function formatFn(k, p) {
        const nPart = formatPolyTerm(k);
        let lgPart = "";
        if (p === 1) lgPart = " lg n";
        else if (p === -1) lgPart = " / lg n";
        else if (p > 1) lgPart = ` lg<sup>${p}</sup> n`;
        else if (p < -1) lgPart = ` / lg<sup>${Math.abs(p)}</sup> n`;
        if (nPart === "1" && lgPart) {
          return p > 0 ? lgPart.trim() : "1" + lgPart;
        }
        return nPart + lgPart;
      }

      function updateMasterAnalysis() {
        const a = Math.max(1, parseFloat(aEl.value) || 1);
        const b = Math.max(1.05, parseFloat(bEl.value) || 2);
        const k = parseFloat(kEl.value) || 0;
        const p = parseInt(pEl.value, 10) || 0;

        const critExp = Math.log(a) / Math.log(b);
        const critRounded = Math.round(critExp * 10000) / 10000;
        const diff = k - critExp;

        let caseBadge = "";
        let diagnosisTitle = "";
        let explanationHTML = "";
        let finalBoundHTML = "";
        let treeBehavior = "";

        const critDisplay =
          Math.abs(critExp - Math.round(critExp)) < 1e-6
            ? formatPolyTerm(Math.round(critExp))
            : `n<sup>log<sub>${b}</sub> ${a}</sup> ≈ n<sup>${critRounded}</sup>`;

        const fnDisplay = formatFn(k, p);

        if (diff < -1e-5) {
          const eps = Math.round(Math.abs(diff / 2) * 1000) / 1000;
          caseBadge = `<span class="bracket-tag emerald">[ CASO 1 DO TEOREMA MESTRE • DOMINADO PELAS FOLHAS ]</span>`;
          diagnosisTitle = `Caso 1 Aplicável: f(n) é polinomialmente menor que n<sup>log<sub>b</sub> a</sup>`;
          explanationHTML = `
            <p>O expoente crítico das folhas é log<sub>${b}</sub> ${a} ≈ ${critRounded}, enquanto o expoente polinomial de <em>f(n)</em> é <em>k</em> = ${k} &lt; ${critRounded}. Portanto, <em>f(n)</em> = O(n<sup>log<sub>b</sub> a − ε</sup>) para ε ≈ ${eps} &gt; 0.</p>
          `;
          finalBoundHTML = `Θ(${critDisplay})`;
          treeBehavior = `Custo por nível cresce geometricamente da raiz até as ${a}<sup>log<sub>${b}</sub> n</sup> = n<sup>${critRounded}</sup> folhas.`;
        } else if (Math.abs(diff) <= 1e-5) {
          if (p === 0) {
            caseBadge = `<span class="bracket-tag amber">[ CASO 2 PADRÃO DO TEOREMA MESTRE • DISTRIBUIÇÃO UNIFORME ]</span>`;
            diagnosisTitle = `Caso 2 Padrão (Teorema 4.1): f(n) = Θ(n<sup>log<sub>b</sub> a</sup>)`;
            explanationHTML = `
              <p>Temos <em>k</em> = log<sub>${b}</sub> ${a} = ${critRounded} e <em>p</em> = 0. Logo, <em>f(n)</em> = Θ(n<sup>log<sub>b</sub> a</sup>). Cada um dos log<sub>${b}</sub> n + 1 níveis da árvore de recursão tem custo assintótico igual a Θ(${critDisplay}).</p>
            `;
            finalBoundHTML =
              Math.abs(critExp) < 1e-6 ? `Θ(lg n)` : `Θ(${critDisplay} lg n)`;
            treeBehavior = `Todos os níveis internos da árvore têm exatamente o mesmo custo assintótico Θ(${critDisplay}).`;
          } else if (p > 0) {
            caseBadge = `<span class="bracket-tag amber">[ LACUNA ENTRE CASOS 2 E 3 • RESOLVIDO PELO EXERCÍCIO 4.6-2 ]</span>`;
            diagnosisTitle = `Lacuna Polinomial (Gap 2–3): f(n) é maior por fator logarítmico lg<sup>${p}</sup> n`;
            explanationHTML = `
              <p>O Teorema 4.1 básico <strong>não se aplica diretamente</strong> porque <em>f(n)</em> / n<sup>log<sub>b</sub> a</sup> = lg<sup>${p}</sup> n é assintoticamente maior que 1, mas <strong>não é polinomialmente maior</strong> (lg<sup>${p}</sup> n = o(n<sup>ε</sup>) para todo ε &gt; 0). Porém, pelo <strong>Método Mestre Estendido (Exercício 4.6-2, p. 101)</strong>, para <em>f(n)</em> = Θ(n<sup>log<sub>b</sub> a</sup> lg<sup>p</sup> n) com <em>p</em> ≥ 0, a soma dos níveis acrescenta mais um fator lg n!</p>
            `;
            finalBoundHTML =
              Math.abs(critExp) < 1e-6
                ? `Θ(lg<sup>${p + 1}</sup> n)`
                : `Θ(${critDisplay} lg<sup>${p + 1}</sup> n)`;
            treeBehavior = `Soma nos níveis equivale a ∑ lg^${p}(n/b^j) = Θ(lg^${p + 1} n) multiplicado por n^(log_b a).`;
          } else {
            caseBadge = `<span class="bracket-tag">[ LACUNA ENTRE CASOS 1 E 2 • MÉTODO MESTRE NÃO APLICÁVEL ]</span>`;
            diagnosisTitle = `Lacuna Polinomial (Gap 1–2): f(n) é menor apenas por fator logarítmico`;
            explanationHTML = `
              <p>Aqui n<sup>log<sub>b</sub> a</sup> / <em>f(n)</em> = lg<sup>${Math.abs(p)}</sup> n, que é assintoticamente menor que n<sup>ε</sup> para qualquer ε &gt; 0. Cai na lacuna entre o Caso 1 e o Caso 2! Resolvendo pela árvore de recursão (soma harmônica / integral):</p>
            `;
            if (p === -1) {
              finalBoundHTML =
                Math.abs(critExp) < 1e-6
                  ? `Θ(lg lg n)`
                  : `Θ(${critDisplay} lg lg n)`;
            } else {
              finalBoundHTML = `Θ(${critDisplay})`;
            }
            treeBehavior =
              p === -1
                ? `A soma por níveis recai na série harmônica ∑ (1 / j) = Θ(lg lg n).`
                : `Como p = ${p} < -1, a série ∑ (1 / j^${Math.abs(p)}) converge para uma constante Θ(1)!`;
          }
        } else {
          const eps = Math.round((diff / 2) * 1000) / 1000;
          const regFactor = Math.round((a / Math.pow(b, k)) * 10000) / 10000;
          caseBadge = `<span class="bracket-tag dark">[ CASO 3 DO TEOREMA MESTRE • DOMINADO PELA RAIZ ]</span>`;
          diagnosisTitle = `Caso 3 Aplicável: f(n) é polinomialmente maior que n<sup>log<sub>b</sub> a</sup> + Condição de Regularidade`;
          explanationHTML = `
            <p>O expoente polinomial de <em>f(n)</em> (<em>k</em> = ${k}) supera log<sub>${b}</sub> ${a} ≈ ${critRounded} por ε ≈ ${eps} &gt; 0. Além disso, a <strong>condição de regularidade</strong> <em>a f(n/b) ≤ c f(n)</em> é satisfeita com <em>c</em> = <em>a</em> / <em>b<sup>k</sup></em> = ${a} / ${b}<sup>${k}</sup> ≈ ${regFactor} &lt; 1 para <em>n</em> suficientemente grande!</p>
          `;
          finalBoundHTML = `Θ(${fnDisplay})`;
          treeBehavior = `Série geométrica decrescente de razão c ≈ ${regFactor} < 1: o custo concentra-se na raiz f(n).`;
        }

        outEl.innerHTML = `
          <div style="background:var(--bg-card);border:var(--border-brutal);padding:1.1rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.75rem;">
              ${caseBadge}
              <span style="font-family:var(--font-mono);font-size:0.82rem;font-weight:700;">
                Recorrência: T(n) = ${a === 1 ? "" : a}T(n/${b}) + Θ(${fnDisplay})
              </span>
            </div>
            <h4 style="margin-bottom:0.5rem;">${diagnosisTitle}</h4>
            <div style="font-size:0.9rem;margin-bottom:0.85rem;">${explanationHTML}</div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.75rem;background:var(--bg-secondary);padding:0.85rem;border:var(--border-thin);">
              <div>
                <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--ink-muted);">LIMIAR DAS FOLHAS (n^log_b a)</div>
                <div style="font-family:var(--font-mono);font-size:1rem;font-weight:700;margin-top:0.2rem;">${critDisplay}</div>
              </div>
              <div>
                <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--ink-muted);">CUSTO FORA DA RECURSÃO f(n)</div>
                <div style="font-family:var(--font-mono);font-size:1rem;font-weight:700;margin-top:0.2rem;">Θ(${fnDisplay})</div>
              </div>
              <div>
                <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--ink-muted);">SOLUÇÃO ASSINTÓTICA FINAL</div>
                <div style="font-family:var(--font-mono);font-size:1.05rem;font-weight:700;color:var(--accent-emerald);margin-top:0.2rem;">T(n) = ${finalBoundHTML}</div>
              </div>
            </div>
            <div style="margin-top:0.65rem;font-family:var(--font-mono);font-size:0.78rem;color:var(--ink-secondary);">
              <strong>Árvore de Recursão (Altura log<sub>${b}</sub> n):</strong> ${treeBehavior}
            </div>
          </div>
        `;
      }

      if (presetEl) {
        presetEl.addEventListener("change", function () {
          const parts = presetEl.value.split(",");
          aEl.value = parts[0];
          bEl.value = parts[1];
          kEl.value = parts[2];
          pEl.value = parts[3];
          updateMasterAnalysis();
        });
      }
      [aEl, bEl, kEl, pEl].forEach((inp) => {
        if (inp) inp.addEventListener("input", updateMasterAnalysis);
      });
      updateMasterAnalysis();

      /* Lógica da Bancada 02: Simulador de Subarranjo Máximo */
      const subInput = document.getElementById("mod3-sub-input");
      const subRunBtn = document.getElementById("mod3-sub-run-btn");
      const subResetBtn = document.getElementById("mod3-sub-reset-btn");
      const subOut = document.getElementById("mod3-sub-output");

      function findMaxCrossing(arr, low, mid, high) {
        let leftSum = -Infinity;
        let sum = 0;
        let maxLeft = mid;
        for (let i = mid; i >= low; i--) {
          sum += arr[i];
          if (sum > leftSum) {
            leftSum = sum;
            maxLeft = i;
          }
        }
        let rightSum = -Infinity;
        sum = 0;
        let maxRight = mid + 1;
        for (let j = mid + 1; j <= high; j++) {
          sum += arr[j];
          if (sum > rightSum) {
            rightSum = sum;
            maxRight = j;
          }
        }
        return { low: maxLeft, high: maxRight, sum: leftSum + rightSum, leftSum, rightSum };
      }

      function findMaxSubarrayDC(arr, low, high, depth, logs) {
        if (low === high) {
          return { low, high, sum: arr[low] };
        }
        const mid = Math.floor((low + high) / 2);
        const leftRes = findMaxSubarrayDC(arr, low, mid, depth + 1, logs);
        const rightRes = findMaxSubarrayDC(arr, mid + 1, high, depth + 1, logs);
        const crossRes = findMaxCrossing(arr, low, mid, high);

        let winner = "CROSS";
        let best = crossRes;
        if (leftRes.sum >= rightRes.sum && leftRes.sum >= crossRes.sum) {
          winner = "ESQUERDA";
          best = leftRes;
        } else if (rightRes.sum >= leftRes.sum && rightRes.sum >= crossRes.sum) {
          winner = "DIREITA";
          best = rightRes;
        }

        if (depth <= 1) {
          logs.push({
            depth,
            range: `A[${low + 1}..${high + 1}]`,
            mid: mid + 1,
            left: `A[${leftRes.low + 1}..${leftRes.high + 1}] (soma = ${leftRes.sum})`,
            right: `A[${rightRes.low + 1}..${rightRes.high + 1}] (soma = ${rightRes.sum})`,
            cross: `A[${crossRes.low + 1}..${crossRes.high + 1}] (soma = ${crossRes.sum})`,
            winner
          });
        }
        return best;
      }

      function runSubarraySimulation() {
        if (!subInput || !subOut) return;
        const nums = subInput.value
          .split(",")
          .map((s) => parseFloat(s.trim()))
          .filter((v) => !isNaN(v));

        if (nums.length === 0) {
          subOut.innerHTML = `<p style="color:var(--accent-crimson);font-family:var(--font-mono);">Digite pelo menos 1 número válido separado por vírgula.</p>`;
          return;
        }

        const logs = [];
        const res = findMaxSubarrayDC(nums, 0, nums.length - 1, 0, logs);

        const cellsHTML = nums
          .map((val, idx) => {
            const inMax = idx >= res.low && idx <= res.high;
            return `
              <div style="padding:0.45rem 0.55rem;border:var(--border-thin);text-align:center;min-width:44px;background:${
                inMax ? "#111" : "var(--bg-card)"
              };color:${inMax ? "#FAF6EE" : "var(--ink-primary)"};font-family:var(--font-mono);">
                <div style="font-size:0.65rem;opacity:0.75;">[${idx + 1}]</div>
                <div style="font-size:0.88rem;font-weight:700;">${val}</div>
              </div>
            `;
          })
          .join("");

        const logsHTML = logs
          .reverse()
          .map(
            (l) => `
              <tr>
                <td><strong>${l.range}</strong> (mid=${l.mid})</td>
                <td>${l.left}</td>
                <td>${l.right}</td>
                <td>${l.cross}</td>
                <td><span class="bracket-tag dark">${l.winner}</span></td>
              </tr>
            `
          )
          .join("");

        subOut.innerHTML = `
          <div style="background:var(--bg-card);border:var(--border-brutal);padding:1rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.75rem;">
              <span class="bracket-tag emerald">[ SUBARRANJO MÁXIMO ENCONTRADO: A[${res.low + 1} .. ${res.high + 1}] ]</span>
              <span style="font-family:var(--font-mono);font-size:0.95rem;font-weight:700;">
                SOMA MÁXIMA = ${res.sum}
              </span>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:0.35rem;margin-bottom:1rem;">
              ${cellsHTML}
            </div>
            ${
              logs.length > 0
                ? `
              <div style="font-family:var(--font-mono);font-size:0.75rem;font-weight:700;margin-bottom:0.4rem;">
                DECISÕES NOS NÍVEIS SUPERIORES DA ÁRVORE DE RECURSÃO (ESQUERDA vs. DIREITA vs. CRUZADO):
              </div>
              <div class="clrs-table-wrap" style="margin:0;">
                <table class="clrs-table">
                  <thead>
                    <tr>
                      <th>Intervalo</th>
                      <th>Máximo Esquerda</th>
                      <th>Máximo Direita</th>
                      <th>Máximo Cruzado</th>
                      <th>Vencedor</th>
                    </tr>
                  </thead>
                  <tbody>${logsHTML}</tbody>
                </table>
              </div>
            `
                : ""
            }
          </div>
        `;
      }

      if (subRunBtn) subRunBtn.addEventListener("click", runSubarraySimulation);
      if (subResetBtn) {
        subResetBtn.addEventListener("click", function () {
          subInput.value = "13, -3, -25, 20, -3, -16, -23, 18, 20, -7, 12, -5, -22, 15, -4, 7";
          runSubarraySimulation();
        });
      }
      runSubarraySimulation();
    },

    /* ======================================================================
       SEÇÃO 3: QUIZZES COMENTADOS (10 QUESTÕES DO CAPÍTULO 4)
       ====================================================================== */
    quizzes: [
      {
        id: "q3-1",
        type: "Múltipla Escolha",
        reference: "Cap. 4, Seção 4.1 (pp. 68–73) e Exercício 4.1-1 — Subarranjo Máximo",
        question:
          "Considere o procedimento recursivo FIND-MAXIMUM-SUBARRAY(A, low, high) e sua sub-rotina FIND-MAX-CROSSING-SUBARRAY(A, low, mid, high). Qual é a complexidade de FIND-MAX-CROSSING-SUBARRAY para um subarranjo de n elementos e o que FIND-MAXIMUM-SUBARRAY retorna quando TODOS os elementos de A[1 .. n] são estritamente negativos (Exercício 4.1-1)?",
        options: [
          {
            letter: "A",
            text: "FIND-MAX-CROSSING-SUBARRAY executa em tempo Θ(n²) porque testa todos os pares (i, j) com low ≤ i ≤ mid < j ≤ high; e quando todos os elementos são negativos, retorna o subarranjo vazio com soma 0.",
            isCorrect: false,
            explanation:
              "Incorreta! FIND-MAX-CROSSING-SUBARRAY realiza dois laços independentes (um de mid até low e outro de mid + 1 até high), gastando tempo linear Θ(n); além disso, a definição padrão exige um subarranjo não vazio (o subarranjo vazio é tratado apenas na variante do Exercício 4.1-4)."
          },
          {
            letter: "B",
            text: "FIND-MAX-CROSSING-SUBARRAY executa em tempo linear Θ(n) (fazendo exatamente (mid - low + 1) + (high - mid) = n iterações nos dois laços); e quando todos os elementos de A são negativos, FIND-MAXIMUM-SUBARRAY retorna o subarranjo de 1 único elemento que contém o maior elemento de A (isto é, o elemento menos negativo).",
            isCorrect: true,
            explanation:
              "Correta! Como qualquer soma de dois ou mais números estritamente negativos é menor do que cada parcela isolada, os subarranjos cruzados sempre perdem para o maior elemento individual, e o algoritmo retorna (k, k, A[k]), onde A[k] = max_{1≤i≤n} A[i]."
          },
          {
            letter: "C",
            text: "FIND-MAX-CROSSING-SUBARRAY é uma chamada recursiva para uma instância menor do problema original e executa em Θ(lg n); quando todos os elementos são negativos, retorna a soma de todo o arranjo A[1 .. n].",
            isCorrect: false,
            explanation:
              "Incorreta. Como os autores frisam na página 71, encontrar o subarranjo máximo que cruza o ponto médio NÃO é uma instância menor do problema original (pois há a restrição adicional de cruzar o ponto médio) e faz parte da etapa de combinar em tempo Θ(n)."
          },
          {
            letter: "D",
            text: "FIND-MAX-CROSSING-SUBARRAY executa em Θ(n lg n) e, para entradas todas negativas, lança erro porque left-sum e right-sum são inicializados com 0.",
            isCorrect: false,
            explanation:
              "Incorreta. As variáveis left-sum e right-sum são inicializadas com -∞ (linhas 1 e 8), garantindo funcionamento correto mesmo quando todos os elementos são negativos."
          }
        ]
      },
      {
        id: "q3-2",
        type: "Verdadeiro ou Falso",
        reference: "Cap. 4, Seção 4.2 (p. 77) — Fatores Constantes em Recorrências",
        question:
          "Julgue a afirmação com base na discussão da página 77 do livro: 'Assim como combinamos quatro adições de matrizes n/2 × n/2 escrevendo 4 · Θ(n²/4) = Θ(n²), também podemos absorver o fator constante 8 das oito chamadas recursivas de SQUARE-MATRIX-MULTIPLY-RECURSIVE escrevendo T(n/2) em vez de 8T(n/2), pois a notação assintótica ignora constantes multiplicativas.'",
        options: [
          {
            letter: "V",
            text: "Verdadeiro — Qualquer constante multiplicativa positiva pode ser suprimida tanto fora quanto na frente de termos recursivos T(n/b) sem alterar a solução assintótica.",
            isCorrect: false,
            explanation:
              "Incorreta! Suprimir o coeficiente 'a' de aT(n/b) altera completamente a estrutura da árvore de recursão e o expoente crítico log_b a."
          },
          {
            letter: "F",
            text: "Falso — Embora a notação Θ incorpore fatores constantes em termos fechados como Θ(n²), o mesmo NÃO acontece com a notação recursiva T(n/2): o fator 8 determina quantos filhos cada nó da árvore de recursão possui (tornando-a frondosa com 8^(lg n) = n³ folhas em vez de linear), sendo proibido omiti-lo.",
            isCorrect: true,
            explanation:
              "Correta! Esta é a advertência explícita das páginas 77–78: o fator 'a' em aT(n/b) determina o grau de ramificação da árvore de recursão em cada nível, mudando a potência do polinômio resultante."
          }
        ]
      },
      {
        id: "q3-3",
        type: "Múltipla Escolha",
        reference: "Cap. 4, Seção 4.2 (pp. 78–80) — Algoritmo de Strassen",
        question:
          "No algoritmo de Strassen para multiplicar duas matrizes n × n, quantas matrizes auxiliares Sᵢ (somas/diferenças de submatrizes de A e B) são criadas na Etapa 2, quantos produtos recursivos Pᵢ de dimensão n/2 × n/2 são calculados na Etapa 3, quantas operações de soma/subtração entre matrizes Pᵢ são feitas na Etapa 4 para montar C₁₁, C₁₂, C₂₁, C₂₂ e qual é a recorrência resultante?",
        options: [
          {
            letter: "A",
            text: "Etapa 2 cria 8 matrizes S₁..S₈; Etapa 3 calcula 8 produtos P₁..P₈; Etapa 4 faz 4 somas; recorrência T(n) = 8T(n/2) + Θ(n²) = Θ(n³).",
            isCorrect: false,
            explanation:
              "Incorreta. Essa contagem de 8 produtos e 4 somas corresponde ao algoritmo ingênuo SQUARE-MATRIX-MULTIPLY-RECURSIVE, não ao de Strassen."
          },
          {
            letter: "B",
            text: "Etapa 2 cria 10 matrizes S₁..S₁₀ em Θ(n²); Etapa 3 calcula recursivamente 7 produtos P₁..P₇ em 7T(n/2); Etapa 4 efetua 8 somas/subtrações de matrizes Pᵢ em Θ(n²); recorrência T(n) = 7T(n/2) + Θ(n²) = Θ(n^(lg 7)) = O(n^2,81).",
            isCorrect: true,
            explanation:
              "Correta! Strassen troca 1 multiplicação recursiva de matrizes n/2 × n/2 por 18 somas/subtrações de matrizes n/2 × n/2 (10 na Etapa 2 e 8 na Etapa 4), reduzindo o expoente de lg 8 = 3 para lg 7 ≈ 2,807."
          },
          {
            letter: "C",
            text: "Etapa 2 cria 7 matrizes S₁..S₇; Etapa 3 calcula 6 produtos P₁..P₆; Etapa 4 faz 4 somas; recorrência T(n) = 6T(n/2) + Θ(n²) = Θ(n^(lg 6)).",
            isCorrect: false,
            explanation:
              "Incorreta. Não é possível multiplicar matrizes 2 × 2 gerais com apenas 6 multiplicações escalares; Strassen utiliza 7 produtos."
          },
          {
            letter: "D",
            text: "Etapa 2 cria 10 matrizes S₁..S₁₀ em Θ(n³); Etapa 3 calcula 7 produtos; recorrência T(n) = 7T(n/2) + Θ(n³) = Θ(n³).",
            isCorrect: false,
            explanation:
              "Incorreta. Somar ou subtrair duas matrizes n/2 × n/2 leva tempo proporcional ao número de entradas, que é (n/2)² = Θ(n²), jamais Θ(n³)."
          }
        ]
      },
      {
        id: "q3-4",
        type: "Múltipla Escolha",
        reference: "Cap. 4, Seção 4.3 (pp. 84–85) — Método de Substituição e Hipótese Indutiva",
        question:
          "Ao tentar provar por substituição que T(n) = T(⌊n/2⌋) + T(⌈n/2⌉) + 1 é O(n), a hipótese indutiva direta T(n) ≤ cn leva a T(n) ≤ cn + 1, que falha em fechar a indução. Qual é a técnica correta ensinada na Seção 4.3 para resolver esse impasse e qual é o erro na 'prova' falsa T(n) ≤ 2(c⌊n/2⌋) + n ≤ cn + n = O(n) para T(n) = 2T(⌊n/2⌋) + n?",
        options: [
          {
            letter: "A",
            text: "Devemos aumentar o palpite para T(n) ≤ cn², pois quando T(n) ≤ cn falha significa que a solução real não é O(n); e na segunda recorrência a prova cn + n = O(n) está correta.",
            isCorrect: false,
            explanation:
              "Incorreta em ambos os pontos! A primeira recorrência é de fato O(n), e a segunda recorrência é Θ(n lg n), nunca O(n)."
          },
          {
            letter: "B",
            text: "Devemos fortalecer a hipótese indutiva subtraindo um termo de ordem mais baixa, propondo T(n) ≤ cn - d (que produz T(n) ≤ (c⌊n/2⌋ - d) + (c⌈n/2⌉ - d) + 1 = cn - 2d + 1 ≤ cn - d para d ≥ 1); e o erro em escrever 'cn + n = O(n)' no passo indutivo é que não se provou a forma exata da hipótese indutiva T(n) ≤ cn com a mesma constante c.",
            isCorrect: true,
            explanation:
              "Correta! Subtrair d de cada chamada recursiva subtrai 2d no total, absorvendo o +1 para qualquer d ≥ 1; e na seção 'Como evitar armadilhas' (p. 85), os autores frisam que jamais se pode usar notação O dentro do passo indutivo porque a constante oculta mudaria de c para c + 1 a cada nível."
          },
          {
            letter: "C",
            text: "Devemos somar um termo de ordem mais baixa propondo T(n) ≤ cn + d, pois somar d nos dois termos recursivos cancela o +1.",
            isCorrect: false,
            explanation:
              "Incorreta! Se propuséssemos T(n) ≤ cn + d, a substituição daria T(n) ≤ cn + 2d + 1, o que pioraria a desigualdade (exigindo 2d + 1 ≤ d, impossível para d ≥ 0)."
          },
          {
            letter: "D",
            text: "O método de substituição não pode ser aplicado quando a recorrência possui pisos e tetos.",
            isCorrect: false,
            explanation:
              "Incorreta. O método de substituição lida naturalmente com pisos e tetos, como demonstrado nesse próprio exemplo da página 84."
          }
        ]
      },
      {
        id: "q3-5",
        type: "Múltipla Escolha",
        reference: "Cap. 4, Seção 4.3 (pp. 85–86) e Exercício 4.3-9 — Mudança de Variáveis",
        question:
          "Usando o método de mudança de variáveis (substituindo m = lg n e definindo S(m) = T(2^m)), quais são as recorrências transformadas S(m) e as soluções assintóticas justas para (1) T(n) = 2T(⌊√n⌋) + lg n (exemplo da p. 85) e (2) T(n) = 3T(√n) + log n (Exercício 4.3-9)?",
        options: [
          {
            letter: "A",
            text: "(1) S(m) = 2S(m/2) + m ⇒ T(n) = Θ(lg n lg lg n); e (2) S(m) = 3S(m/2) + m ⇒ S(m) = Θ(m^(lg 3)) ⇒ T(n) = Θ((lg n)^(lg 3)).",
            isCorrect: true,
            explanation:
              "Correta! Como √n = n^(1/2) = 2^(m/2), temos T(2^m) = a T(2^(m/2)) + m, ou seja, S(m) = a S(m/2) + m. Para a = 2, o Caso 2 do Teorema Mestre dá S(m) = Θ(m lg m) = Θ(lg n lg lg n). Para a = 3, o Caso 1 do Teorema Mestre dá S(m) = Θ(m^(lg 3)) = Θ((lg n)^(lg 3))."
          },
          {
            letter: "B",
            text: "(1) S(m) = 2S(m - 1) + m ⇒ T(n) = Θ(n); e (2) S(m) = 3S(m - 1) + m ⇒ T(n) = Θ(n^(lg 3)).",
            isCorrect: false,
            explanation:
              "Incorreta. Tirar a raiz quadrada divide o expoente m = lg n por 2 (m/2), não subtrai 1."
          },
          {
            letter: "C",
            text: "(1) T(n) = Θ(√n lg n); e (2) T(n) = Θ(n^(lg 3)).",
            isCorrect: false,
            explanation:
              "Incorreta. Ambas as soluções são polilogarítmicas em n, pois a variável transformada é m = lg n."
          },
          {
            letter: "D",
            text: "(1) S(m) = S(m/2) + 2^m ⇒ T(n) = Θ(n); e (2) S(m) = 3S(m/2) + 2^m ⇒ T(n) = Θ(n).",
            isCorrect: false,
            explanation:
              "Incorreta. O termo aditivo na recorrência original já é lg n = m, não n = 2^m."
          }
        ]
      },
      {
        id: "q3-6",
        type: "Múltipla Escolha",
        reference: "Cap. 4, Seção 4.4 (pp. 86–90) — Árvores de Recursão",
        question:
          "Compare as duas árvores de recursão analisadas na Seção 4.4: (1) T(n) = 3T(n/4) + cn² (Figura 4.5) e (2) T(n) = T(n/3) + T(2n/3) + cn (Figura 4.6). Quais são, respectivamente, a razão da série geométrica por nível e o número de folhas em (1), e os comprimentos do caminho mais curto até uma folha e do caminho mais longo até uma folha em (2)?",
        options: [
          {
            letter: "A",
            text: "Em (1), a razão por nível é 3/4 e há n^(3/4) folhas; em (2), o caminho mais curto e o mais longo têm ambos comprimento lg n.",
            isCorrect: false,
            explanation:
              "Incorreta! Em (1), cada nó no nível i tem tamanho n/4^i, mas o custo é quadrático c(n/4^i)² = cn²/16^i; multiplicando por 3^i nós, a razão é 3/16, não 3/4."
          },
          {
            letter: "B",
            text: "Em (1), o custo no nível i é (3/16)^i cn² (razão 3/16 < 1) e há 3^(log₄ n) = n^(log₄ 3) folhas; em (2), o caminho mais curto (ramo n/3) tem comprimento log₃ n e o caminho mais longo (ramo 2n/3) tem comprimento log_{3/2} n.",
            isCorrect: true,
            explanation:
              "Correta! Em (1), a série geométrica decrescente de razão 3/16 converge para (16/13)cn² = Θ(n²), dominando o custo Θ(n^(log₄ 3)) das folhas. Em (2), a árvore é desbalanceada com profundidades entre log₃ n e log_{3/2} n, e custo cn por nível completo, resultando em Θ(n lg n)."
          },
          {
            letter: "C",
            text: "Em (1), a razão por nível é 16/3 > 1 e a solução é Θ(n^(log₄ 3)); em (2), a solução é Θ(n²) porque a árvore é desbalanceada.",
            isCorrect: false,
            explanation:
              "Incorreta. Em (1) a razão é 3/16 < 1 (decrescente) e a solução é Θ(n²); em (2) a solução é Θ(n lg n)."
          },
          {
            letter: "D",
            text: "Ambas as recorrências podem ser resolvidas diretamente pelo Teorema 4.1 (Teorema Mestre padrão).",
            isCorrect: false,
            explanation:
              "Incorreta. A segunda recorrência T(n) = T(n/3) + T(2n/3) + cn divide o problema em subproblemas de tamanhos desiguais (n/3 e 2n/3), portanto não tem a forma aT(n/b) + f(n) exigida pelo Teorema Mestre (exigindo Árvore de Recursão/Substituição ou Akra-Bazzi)."
          }
        ]
      },
      {
        id: "q3-7",
        type: "Múltipla Escolha",
        reference: "Cap. 4, Seção 4.5 (pp. 91–94) e Exercício 4.5-4 — A Lacuna do Teorema Mestre",
        question:
          "Por que o Teorema Mestre padrão (Teorema 4.1) NÃO pode ser aplicado às recorrências T(n) = 2T(n/2) + n lg n (p. 93) e T(n) = 4T(n/2) + n² lg n (Exercício 4.5-4), e quais são suas respectivas soluções assintóticas justas?",
        options: [
          {
            letter: "A",
            text: "Porque lg n não é uma função assintoticamente positiva; e ambas têm solução Θ(n³).",
            isCorrect: false,
            explanation:
              "Incorreta. Para n > 1, lg n > 0 é positiva; o impedimento é a ausência de diferença polinomial n^ε."
          },
          {
            letter: "B",
            text: "Porque em ambas f(n) é assintoticamente maior que n^(log_b a) apenas por um fator logarítmico lg n, e não polinomialmente maior (isto é, f(n)/n^(log_b a) = lg n ≠ Ω(n^ε) para qualquer ε > 0), caindo na lacuna entre os Casos 2 e 3; suas soluções justas são Θ(n lg² n) e Θ(n² lg² n), respectivamente.",
            isCorrect: true,
            explanation:
              "Correta! Na primeira, n^(log₂ 2) = n e f(n) = n lg n; na segunda, n^(log₂ 4) = n² e f(n) = n² lg n. Em ambas, a razão f(n)/n^(log_b a) é lg n, que cresce mais devagar que qualquer potência n^ε (ε > 0). Pelo Exercício 4.6-2 (ou somando a árvore de recursão ∑ lg(n/2^j) = Θ(lg² n)), obtemos Θ(n lg² n) e Θ(n² lg² n)."
          },
          {
            letter: "C",
            text: "Porque ambas violam a condição de regularidade af(n/b) ≤ cf(n), mas caem no Caso 1 com soluções Θ(n) e Θ(n²).",
            isCorrect: false,
            explanation:
              "Incorreta. Elas não caem no Caso 1 (pois f(n) é maior que n^(log_b a), não menor) e o bloqueio ocorre antes mesmo da condição de regularidade: falha a exigência f(n) = Ω(n^(log_b a + ε))."
          },
          {
            letter: "D",
            text: "O Caso 3 aplica-se normalmente a ambas, fornecendo Θ(n lg n) e Θ(n² lg n).",
            isCorrect: false,
            explanation:
              "Incorreta! Essa é exatamente a armadilha denunciada pelos autores na página 93: confundir 'assintoticamente maior' com 'polinomialmente maior'."
          }
        ]
      },
      {
        id: "q3-8",
        type: "Múltipla Escolha",
        reference: "Cap. 4, Seção 4.5 (Exercício 4.5-2, p. 94) — Superando o Algoritmo de Strassen",
        question:
          "(Exercício 4.5-2) O professor César deseja projetar um algoritmo de divisão e conquista para multiplicação de matrizes que seja assintoticamente mais rápido que o algoritmo de Strassen Θ(n^(lg 7)). Seu algoritmo dividirá cada matriz em submatrizes de dimensão n/4 × n/4, gastando Θ(n²) nas etapas de dividir e combinar, o que gera a recorrência T(n) = aT(n/4) + Θ(n²). Qual é o MAIOR valor inteiro de 'a' (número de subproblemas recursivos) para o qual o algoritmo do professor César supera assintoticamente o de Strassen?",
        options: [
          {
            letter: "A",
            text: "a = 48, pois para a = 49 temos n^(log₄ 49) = n^(log₂ 7) = n^(lg 7), que empata com Strassen; logo, para a = 48, o Caso 1 do Teorema Mestre fornece T(n) = Θ(n^(log₄ 48)) = o(n^(lg 7)).",
            isCorrect: true,
            explanation:
              "Correta! Na recorrência T(n) = aT(n/4) + Θ(n²), o expoente crítico é log₄ a = (lg a) / (lg 4) = (lg a) / 2. Para ser assintoticamente mais rápido que Strassen (cujo expoente é lg 7), precisamos de log₄ a < lg 7 ⟺ (lg a)/2 < lg 7 ⟺ lg a < 2 lg 7 = lg(7²) = lg 49 ⟺ a < 49. Como 'a' é inteiro, o maior valor possível é a = 48 (dando log₄ 48 ≈ 2,7925 < lg 7 ≈ 2,8074)!"
          },
          {
            letter: "B",
            text: "a = 13, pois 2 × 7 - 1 = 13.",
            isCorrect: false,
            explanation:
              "Incorreta. Aplicar Strassen duas vezes seguidas (dividindo por 2 e depois por 2, chegando a n/4) multiplica o número de subproblemas por 7 × 7 = 49, não soma 7 + 7."
          },
          {
            letter: "C",
            text: "a = 63, pois o algoritmo cúbico faz 4³ = 64 multiplicações de tamanho n/4 × n/4.",
            isCorrect: false,
            explanation:
              "Incorreta. a = 63 supera o algoritmo cúbico Θ(n³), mas log₄ 63 ≈ 2,988 é mais lento que o algoritmo de Strassen (lg 7 ≈ 2,807)."
          },
          {
            letter: "D",
            text: "a = 15, pois a partir de a = 16 a recorrência cai no Caso 1.",
            isCorrect: false,
            explanation:
              "Incorreta. Para a = 16 o algoritmo seria Θ(n² lg n), mas a pergunta pede apenas que seja mais rápido que Strassen Θ(n^(lg 7)), o que ocorre até a = 48."
          }
        ]
      },
      {
        id: "q3-9",
        type: "Verdadeiro ou Falso",
        reference: "Cap. 4, Seção 4.6 (pp. 95–101) — Prova do Teorema Mestre e Pisos/Tetos",
        question:
          "Julgue a afirmação sobre a demonstração do Teorema Mestre na Seção 4.6: 'Na Seção 4.6.2, ao analisar a sequência de tamanhos de subproblemas n₀ = n e nⱼ = ⌈nⱼ₋₁ / b⌉ gerada por tetos sucessivos na árvore de recursão, demonstra-se pela Equação (4.28) que nⱼ < n/bʲ + b/(b - 1), o que garante que na profundidade ⌊log_b n⌋ o tamanho do subproblema n_{⌊log_b n⌋} é limitado superiormente pela constante b + b/(b - 1).'",
        options: [
          {
            letter: "V",
            text: "Verdadeiro — Como ⌈x⌉ ≤ x + 1, os erros de arredondamento de cada nível são divididos por b nos níveis seguintes, formando a série geométrica convergente 1 + 1/b + 1/b² + ... < b/(b - 1).",
            isCorrect: true,
            explanation:
              "Correta! Essa é a essência da Seção 4.6.2 (pp. 99–101): o erro acumulado pelos tetos jamais cresce linearmente com a profundidade j; como cada erro +1 é dividido por b a cada novo nível abaixo, o acúmulo total de arredondamento é estritamente menor que b/(b - 1)!"
          },
          {
            letter: "F",
            text: "Falso — Cada teto ⌈n/b⌉ soma +1 sem ser dividido nos níveis seguintes, fazendo com que nⱼ cresça como n/bʲ + j e alterando a altura da árvore para Θ(n).",
            isCorrect: false,
            explanation:
              "Incorreta. O erro de arredondamento do nível i é dividido por b em cada um dos j - i níveis subsequentes, contribuindo apenas com 1/b^(j-i) no nível j."
          }
        ]
      },
      {
        id: "q3-10",
        type: "Múltipla Escolha",
        reference: "Cap. 4, Problema 4-5 (p. 103) — Testes de Chips do Professor Diógenes",
        question:
          "No Problema 4-5 (Testes de chips), um chip bom sempre diz a verdade sobre outro chip, enquanto um chip ruim pode mentir ou conspirar. Em um teste aos pares entre A e B, se ambos declaram que o outro é 'bom', concluímos que 'ambos são bons ou ambos são ruins'; nos outros três resultados, sabemos que 'ao menos um é ruim'. Supondo que MAIS DE n/2 chips sejam bons, como reduzimos o problema pela metade com ⌊n/2⌋ testes e qual é a complexidade total para identificar todos os chips bons?",
        options: [
          {
            letter: "A",
            text: "Testamos um chip fixo contra todos os outros n - 1 chips na primeira rodada, levando a T(n) = T(n - 1) + n = Θ(n²).",
            isCorrect: false,
            explanation:
              "Incorreta. Testar todos contra todos ou eliminar um por vez gasta Θ(n²), enquanto o pareamento por divisão e conquista resolve em Θ(n)."
          },
          {
            letter: "B",
            text: "Formamos ⌊n/2⌋ pares disjuntos e testamos cada par: se o resultado não for (bom, bom), descartamos AMBOS os chips do par (pois há pelo menos 1 ruim entre os dois); se for (bom, bom), mantemos exatamente 1 representante do par (e se n for ímpar, mantemos o chip que sobrou quando o número de pares mantidos for par). Isso preserva a maioria estrita de chips bons em no máximo ⌈n/2⌉ chips restantes, gerando T(n) = T(⌈n/2⌉) + ⌊n/2⌋ = Θ(n) testes!",
            isCorrect: true,
            explanation:
              "Correta! Descartar pares discordantes remove no mínimo tantos chips ruins quanto bons, e escolher 1 representante de cada par (bom, bom) divide por 2 tanto os pares (bom, bom) quanto os pares (ruim, ruim), mantendo os bons em maioria estrita! Uma vez encontrado 1 único chip bom em Θ(n) testes, basta usá-lo para testar os outros n - 1 chips em mais n - 1 testes, totalizando Θ(n)."
          },
          {
            letter: "C",
            text: "Mesmo quando mais da metade dos chips são ruins, é possível identificar os chips bons em tempo Θ(n lg n).",
            isCorrect: false,
            explanation:
              "Incorreta! No item (a) do Problema 4-5, prova-se que se ≥ n/2 chips forem ruins, os chips ruins podem formar um grupo do mesmo tamanho dos bons que elogia a si mesmo e acusa os bons, tornando impossível distinguir qual grupo é o verdadeiro!"
          },
          {
            letter: "D",
            text: "A recorrência para encontrar o primeiro chip bom é T(n) = 2T(n/2) + n = Θ(n lg n).",
            isCorrect: false,
            explanation:
              "Incorreta. Fazemos apenas UMA chamada recursiva sobre o conjunto reduzido de representantes (a = 1, b = 2, f(n) = Θ(n)), o que cai no Caso 3 do Teorema Mestre: T(n) = T(n/2) + Θ(n) = Θ(n)!"
          }
        ]
      }
    ],

    /* ======================================================================
       SEÇÃO 4: EXERCÍCIOS E PROBLEMAS CANÔNICOS (8 ATIVIDADES RESOLVIDAS)
       ====================================================================== */
    exercicios: [
      {
        id: "ex3-1",
        code: "EXERCÍCIO 01 • FORÇA BRUTA Θ(n²), PONTO DE CRUZAMENTO E ALGORITMO LINEAR DE KADANE Θ(n)",
        reference: "Exercícios 4.1-2, 4.1-3, 4.1-4 e 4.1-5 (pp. 73–74)",
        title: "Três Paradigmas para o Subarranjo Máximo: Força Bruta Θ(n²), Híbrido e Kadane Θ(n)",
        prompt: `
          <p>Resolva os quatro exercícios fundamentais da Seção 4.1 sobre o Problema do Subarranjo Máximo:</p>
          <ol>
            <li><strong>(Exercício 4.1-2)</strong> Escreva o pseudocódigo para o método da força bruta que resolve o problema do subarranjo máximo em tempo <strong>$\\Theta(n^2)$</strong> (acumulando a soma de $A[i \\dots j]$ em tempo $O(1)$ a partir da soma de $A[i \\dots j-1]$).</li>
            <li><strong>(Exercício 4.1-3 e 4.1-4)</strong> Explique o conceito de ponto de cruzamento $n_0$ entre força bruta e divisão e conquista e o efeito de mudar o caso-base recursivo para chamar a força bruta quando $n < n_0$. Além disso, indique como adaptar os algoritmos caso seja permitido retornar um <strong>subarranjo vazio com soma $0$</strong>.</li>
            <li><strong>(Exercício 4.1-5 — Algoritmo Linear de Kadane)</strong> Desenvolva um algoritmo não recursivo de <strong>tempo linear $\\Theta(n)$</strong>: varra da esquerda para a direita mantendo o subarranjo máximo visto até aqui em $A[1 \\dots j]$ e o subarranjo máximo que <em>termina exatamente no índice $j$</em>, estendendo a resposta para $j+1$ em tempo $O(1)$.</li>
          </ol>
        `,
        placeholder:
          "Escreva os pseudocódigos de BRUTE-FORCE-MAX-SUBARRAY(A) em Θ(n²) e LINEAR-MAX-SUBARRAY(A) em Θ(n), e explique o tratamento do subarranjo vazio...",
        solution: `
          <h4>1. Método da Força Bruta em $\\Theta(n^2)$ (Exercício 4.1-2)</h4>
          <p>Para evitar recalcular $\\sum_{k=i}^{j} A[k]$ do zero (o que levaria a $\\Theta(n^3)$), mantemos um acumulador <code>sum</code> para cada índice inicial $i$ fixado e somamos $A[j]$ em tempo $O(1)$ à medida que $j$ avança de $i$ até $n$:</p>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">BRUTE-FORCE-MAX-SUBARRAY(A, low, high)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">max-sum = -∞</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">for</span> i = low <span class="kw">to</span> high</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    sum = 0</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">for</span> j = i <span class="kw">to</span> high</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">        sum = sum + A[j]</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">        <span class="kw">if</span> sum &gt; max-sum</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">            max-sum = sum</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">            max-left = i</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">            max-right = j</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content"><span class="kw">return</span> (max-left, max-right, max-sum)</span></div>
            </div>
          </div>
          <p>O laço interno executa $\\sum_{i=1}^{n} (n - i + 1) = \\frac{n(n+1)}{2} = \\Theta(n^2)$ vezes.</p>

          <h4>2. Ponto de Cruzamento $n_0$ (Ex. 4.1-3) e Subarranjo Vazio (Ex. 4.1-4)</h4>
          <ul>
            <li><strong>Ponto de cruzamento e algoritmo híbrido:</strong> Em implementações típicas, devido à sobrecarga das chamadas recursivas, a força bruta é mais rápida para subarranjos pequenos ($n < n_0$, tipicamente entre $n_0 = 20$ e $n_0 = 50$). Ao alterar a linha 1 de <code>FIND-MAXIMUM-SUBARRAY</code> de <code>if high == low</code> para <code>if high - low + 1 &lt; n₀</code> chamando <code>BRUTE-FORCE-MAX-SUBARRAY(A, low, high)</code> como caso-base engrossado (<em>coarsened leaves</em>), o algoritmo híbrido passa a superar a força bruta pura para <em>qualquer</em> $n \\ge n_0$ (reduzindo o ponto de cruzamento efetivo para $1$, pois abaixo de $n_0$ ambos executam exatamente o mesmo código!).</li>
            <li><strong>Permitindo o subarranjo vazio (Exercício 4.1-4):</strong> Se a soma máxima encontrada por qualquer algoritmo que exige subarranjo não vazio for negativa ($\\text{max-sum} < 0$, o que ocorre se e somente se todos os elementos de $A$ forem negativos), basta substituir o retorno final por um subarranjo vazio (por exemplo, índices $(1, 0)$ ou <code>NIL</code>) com soma $0$!</li>
          </ul>

          <h4>3. Algoritmo de Tempo Linear $\\Theta(n)$ — Algoritmo de Kadane (Exercício 4.1-5)</h4>
          <p><strong>Ideia Indutiva:</strong> Seja $A[\\text{end-left} \\dots j]$ o subarranjo máximo que <strong>termina exatamente no índice $j$</strong>, com soma $\\text{ending-here-sum}$. Qual é o subarranjo máximo que termina exatamente em $j + 1$? Ele só pode ser:</p>
          <ul>
            <li>A extensão do subarranjo anterior $A[\\text{end-left} \\dots j + 1]$ (soma $\\text{ending-here-sum} + A[j + 1]$), se $\\text{ending-here-sum} > 0$; ou</li>
            <li>Um novo subarranjo unitário começando em $j + 1$, isto é, $A[j + 1 \\dots j + 1]$ (soma $A[j + 1]$), caso $\\text{ending-here-sum} \\le 0$!</li>
          </ul>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">LINEAR-MAX-SUBARRAY(A)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">max-sum = A[1]; low = 1; high = 1</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">ending-here-sum = A[1]; ending-here-low = 1</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">for</span> j = 2 <span class="kw">to</span> A.comprimento</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">if</span> ending-here-sum &gt; 0</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">        ending-here-sum = ending-here-sum + A[j]</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">    <span class="kw">else</span></span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">        ending-here-sum = A[j]</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">        ending-here-low = j</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">    <span class="kw">if</span> ending-here-sum &gt; max-sum</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">        max-sum = ending-here-sum</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">        low = ending-here-low</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">        high = j</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content"><span class="kw">return</span> (low, high, max-sum)</span></div>
            </div>
          </div>
          <p>Como o laço <code>for</code> executa $n - 1$ iterações de custo $O(1)$, o tempo total é <strong>$\\Theta(n)$</strong> no pior caso e no melhor caso, usando espaço auxiliar $\\Theta(1)$!</p>
        `
      },
      {
        id: "ex3-2",
        code: "EXERCÍCIO 02 • RASTREAMENTO E GENERALIZAÇÃO DO ALGORITMO DE STRASSEN",
        reference: "Exercícios 4.2-1, 4.2-2, 4.2-3 e 4.2-7 (p. 80)",
        title: "Cálculo Passo a Passo de Strassen, Matrizes com n Arbitrário e Multiplicação Complexa em 3 Produtos",
        prompt: `
          <p>Resolva os quatro problemas de projeto algorítmico da Seção 4.2:</p>
          <ol>
            <li><strong>(Exercício 4.2-1)</strong> Use o algoritmo de Strassen para calcular o produto das matrizes $2 \\times 2$:
              $$A = \\begin{pmatrix} 1 & 3 \\\\ 7 & 5 \\end{pmatrix}, \\qquad B = \\begin{pmatrix} 6 & 8 \\\\ 4 & 2 \\end{pmatrix},$$
              exibindo explicitamente $S_1, \\dots, S_{10}$, $P_1, \\dots, P_7$ e $C_{11}, C_{12}, C_{21}, C_{22}$.</li>
            <li><strong>(Exercício 4.2-3)</strong> Como você modificaria o algoritmo de Strassen para multiplicar matrizes $n \\times n$ nas quais $n$ <strong>não é uma potência exata de $2$</strong>? Demonstre que o algoritmo resultante ainda é executado em tempo $\\Theta(n^{\\lg 7})$.</li>
            <li><strong>(Exercício 4.2-7)</strong> Mostre como multiplicar dois números complexos $a + bi$ e $c + di$ usando <strong>apenas $3$ multiplicações de números reais</strong> para obter a parte real $ac - bd$ e a parte imaginária $ad + bc$.</li>
          </ol>
        `,
        placeholder:
          "Calcule S₁..S₁₀, P₁..P₇ e C para as matrizes 2x2, explique o preenchimento com zeros (padding) até a próxima potência de 2 e mostre os 3 produtos reais para (a+bi)(c+di)...",
        solution: `
          <h4>1. Rastreamento Completo de Strassen para Matrizes $2 \\times 2$ (Exercício 4.2-1)</h4>
          <p>Temos $A_{11}=1, A_{12}=3, A_{21}=7, A_{22}=5$ e $B_{11}=6, B_{12}=8, B_{21}=4, B_{22}=2$:</p>
          <ul>
            <li><strong>Etapa 2 (As 10 somas/diferenças $S_1 \\dots S_{10}$):</strong>
              <ul>
                <li>$S_1 = B_{12} - B_{22} = 8 - 2 = 6$</li>
                <li>$S_2 = A_{11} + A_{12} = 1 + 3 = 4$</li>
                <li>$S_3 = A_{21} + A_{22} = 7 + 5 = 12$</li>
                <li>$S_4 = B_{21} - B_{11} = 4 - 6 = -2$</li>
                <li>$S_5 = A_{11} + A_{22} = 1 + 5 = 6$</li>
                <li>$S_6 = B_{11} + B_{22} = 6 + 2 = 8$</li>
                <li>$S_7 = A_{12} - A_{22} = 3 - 5 = -2$</li>
                <li>$S_8 = B_{21} + B_{22} = 4 + 2 = 6$</li>
                <li>$S_9 = A_{11} - A_{21} = 1 - 7 = -6$</li>
                <li>$S_{10} = B_{11} + B_{12} = 6 + 8 = 14$</li>
              </ul>
            </li>
            <li><strong>Etapa 3 (Os 7 produtos $P_1 \\dots P_7$):</strong>
              <ul>
                <li>$P_1 = A_{11} \\cdot S_1 = 1 \\times 6 = 6$</li>
                <li>$P_2 = S_2 \\cdot B_{22} = 4 \\times 2 = 8$</li>
                <li>$P_3 = S_3 \\cdot B_{11} = 12 \\times 6 = 72$</li>
                <li>$P_4 = A_{22} \\cdot S_4 = 5 \\times (-2) = -10$</li>
                <li>$P_5 = S_5 \\cdot S_6 = 6 \\times 8 = 48$</li>
                <li>$P_6 = S_7 \\cdot S_8 = (-2) \\times 6 = -12$</li>
                <li>$P_7 = S_9 \\cdot S_{10} = (-6) \\times 14 = -84$</li>
              </ul>
            </li>
            <li><strong>Etapa 4 (Reconstrução de $C$):</strong>
              <ul>
                <li>$C_{11} = P_5 + P_4 - P_2 + P_6 = 48 + (-10) - 8 + (-12) = \\mathbf{18}$</li>
                <li>$C_{12} = P_1 + P_2 = 6 + 8 = \\mathbf{14}$</li>
                <li>$C_{21} = P_3 + P_4 = 72 + (-10) = \\mathbf{62}$</li>
                <li>$C_{22} = P_5 + P_1 - P_3 - P_7 = 48 + 6 - 72 - (-84) = \\mathbf{66}$</li>
              </ul>
              Resultado: $C = \\begin{pmatrix} 18 & 14 \\\\ 62 & 66 \\end{pmatrix}$. (Conferência direta: $1\\cdot 6 + 3\\cdot 4 = 18$; $1\\cdot 8 + 3\\cdot 2 = 14$; $7\\cdot 6 + 5\\cdot 4 = 62$; $7\\cdot 8 + 5\\cdot 2 = 66$.)
            </li>
          </ul>

          <h4>2. Modificação de Strassen para $n$ Arbitrário em $\\Theta(n^{\\lg 7})$ (Exercício 4.2-3)</h4>
          <p>Seja $m = 2^{\\lceil \\lg n \\rceil}$ a menor potência de $2$ tal que $m \\ge n$. Preenchemos (<em>pad</em>) as matrizes $A$ e $B$ com linhas e colunas de zeros até atingirem dimensão $m \\times m$, aplicamos o algoritmo de Strassen padrão sobre as matrizes $m \\times m$ e extraímos a submatriz superior esquerda $n \\times n$ do resultado $C$.</p>
          <p><strong>Prova de que o tempo permanece $\\Theta(n^{\\lg 7})$:</strong> Como $m = 2^{\\lceil \\lg n \\rceil} < 2^{\\lg n + 1} = 2n$, temos $n \\le m < 2n$. Portanto, o tempo gasto pelo algoritmo de Strassen em dimensão $m$ é:</p>
          $$T(m) = \\Theta(m^{\\lg 7}) \\le \\Theta((2n)^{\\lg 7}) = \\Theta(2^{\\lg 7} n^{\\lg 7}) = \\Theta(7 n^{\\lg 7}) = \\mathbf{\\Theta(n^{\\lg 7})}.$$

          <h4>3. Multiplicação de Números Complexos com 3 Multiplicações Reais (Exercício 4.2-7)</h4>
          <p>Calculamos os três produtos reais:</p>
          $$P_1 = a \\cdot c, \\qquad P_2 = b \\cdot d, \\qquad P_3 = (a + b) \\cdot (c + d).$$
          <p>Então obtemos as partes real e imaginária apenas com subtrações:</p>
          <ul>
            <li><strong>Parte Real:</strong> $ac - bd = P_1 - P_2$.</li>
            <li><strong>Parte Imaginária:</strong> $ad + bc = (a+b)(c+d) - ac - bd = P_3 - P_1 - P_2$.</li>
          </ul>
        `
      },
      {
        id: "ex3-3",
        code: "EXERCÍCIO 03 • PROVAS PELO MÉTODO DE SUBSTITUIÇÃO E TERMOS DE ORDEM INFERIOR",
        reference: "Exercícios 4.3-1, 4.3-2, 4.3-6 e 4.3-7 (pp. 85–86)",
        title: "Demonstrações Indutivas Exatas e Subtração de Termo Linear para T(n) = 4T(n/3) + n",
        prompt: `
          <p>Demonstre rigorosamente pelo <strong>método de substituição</strong> as quatro proposições da Seção 4.3:</p>
          <ol>
            <li><strong>(Exercício 4.3-1)</strong> Mostre que a solução de $T(n) = T(n - 1) + n$ é $O(n^2)$.</li>
            <li><strong>(Exercício 4.3-2)</strong> Mostre que a solução de $T(n) = T(\\lceil n/2 \\rceil) + 1$ é $O(\\lg n)$.</li>
            <li><strong>(Exercício 4.3-6)</strong> Mostre que a solução de $T(n) = 2T(\\lfloor n/2 \\rfloor + 17) + n$ é $O(n \\lg n)$.</li>
            <li><strong>(Exercício 4.3-7)</strong> Pela Seção 4.5, a solução de $T(n) = 4T(n/3) + n$ é $\\Theta(n^{\\log_3 4})$. Mostre primeiro por que a hipótese ingênua $T(n) \\le c n^{\\log_3 4}$ falha na indução e, em seguida, mostre como <strong>subtrair um termo de ordem mais baixa</strong> ($T(n) \\le c n^{\\log_3 4} - dn$) faz a prova funcionar.</li>
          </ol>
        `,
        placeholder:
          "Escreva o passo indutivo de cada uma das 4 recorrências, explicitando as condições sobre as constantes c e d...",
        solution: `
          <h4>1. Exercício 4.3-1: $T(n) = T(n - 1) + n = O(n^2)$</h4>
          <p><strong>Hipótese indutiva:</strong> $T(k) \\le c k^2$ para $k < n$, com $c > 0$. Substituindo para $k = n - 1$:</p>
          $$T(n) \\le c(n - 1)^2 + n = c(n^2 - 2n + 1) + n = cn^2 - (2cn - c - n) \\le cn^2,$$
          <p>o que vale para todo $n \\ge 1$ se escolhermos <strong>$c = 1$</strong> (pois $-(2n - 1 - n) = -(n - 1) \\le 0$ para $n \\ge 1$).</p>

          <h4>2. Exercício 4.3-2: $T(n) = T(\\lceil n/2 \\rceil) + 1 = O(\\lg n)$</h4>
          <p>Para lidar com o teto $\\lceil n/2 \\rceil$, provamos a hipótese indutiva deslocada <strong>$T(k) \\le c \\lg(k - 2)$</strong> para $k < n$ (pois $\\lceil n/2 \\rceil < \\frac{n}{2} + 1$, logo $\\lceil n/2 \\rceil - 2 \\le \\frac{n}{2} - 1 = \\frac{n - 2}{2}$):</p>
          $$T(n) \\le c \\lg(\\lceil n/2 \\rceil - 2) + 1 \\le c \\lg\\left(\\frac{n - 2}{2}\\right) + 1 = c \\lg(n - 2) - c + 1 \\le c \\lg(n - 2) \\le c \\lg n,$$
          <p>válido para todo <strong>$c \\ge 1$</strong> e $n > n_0 \\ge 3$.</p>

          <h4>3. Exercício 4.3-6: $T(n) = 2T(\\lfloor n/2 \\rfloor + 17) + n = O(n \\lg n)$</h4>
          <p>Deslocamos o argumento na hipótese indutiva propondo <strong>$T(k) \\le c(k - 34) \\lg(k - 34)$</strong> para $k < n$. Como $\\lfloor n/2 \\rfloor + 17 - 34 = \\lfloor n/2 \\rfloor - 17 \\le \\frac{n - 34}{2}$:</p>
          $$\\begin{aligned}
          T(n) &\\le 2c\\left(\\frac{n - 34}{2}\\right) \\lg\\left(\\frac{n - 34}{2}\\right) + n \\\\
               &= c(n - 34)\\lg(n - 34) - c(n - 34) + n \\\\
               &\\le c(n - 34)\\lg(n - 34) \\le cn \\lg n,
          \\end{aligned}$$
          <p>onde $-c(n - 34) + n \\le 0$ vale para todo $n \\ge 68$ tomando <strong>$c \\ge 2$</strong>!</p>

          <h4>4. Exercício 4.3-7: $T(n) = 4T(n/3) + n = \\Theta(n^{\\log_3 4})$</h4>
          <ul>
            <li><strong>Por que $T(n) \\le c n^{\\log_3 4}$ falha?</strong> Substituindo diretamente na recorrência:
              $$T(n) \\le 4 c (n/3)^{\\log_3 4} + n = 4 c \\frac{n^{\\log_3 4}}{3^{\\log_3 4}} + n = c n^{\\log_3 4} + n,$$
              que tem um resíduo positivo $+n$ e não é $\\le c n^{\\log_3 4}$ para nenhuma constante $c$!</li>
            <li><strong>Subtraindo um termo linear de ordem mais baixa:</strong> Propomos a hipótese mais forte <strong>$T(n) \\le c n^{\\log_3 4} - dn$</strong>, com $d > 0$:
              $$\\begin{aligned}
              T(n) &\\le 4\\left(c(n/3)^{\\log_3 4} - d(n/3)\\right) + n \\\\
                   &= c n^{\\log_3 4} - \\frac{4}{3}dn + n \\\\
                   &= c n^{\\log_3 4} - dn - \\left(\\frac{1}{3}dn - n\\right) \\\\
                   &\\le c n^{\\log_3 4} - dn,
              \\end{aligned}$$
              o que vale sempre que $\\frac{1}{3}d - 1 \\ge 0 \\iff \\mathbf{d \\ge 3}$! Escolhendo $d = 3$ e $c$ suficientemente grande para o caso-base, provamos $T(n) = O(n^{\\log_3 4})$.</li>
          </ul>
        `
      },
      {
        id: "ex3-4",
        code: "EXERCÍCIO 04 • MÉTODO DA ÁRVORE DE RECURSÃO E ÁRVORES DESBALANCEADAS",
        reference: "Exercícios 4.4-1, 4.4-6 e 4.4-9 (p. 91)",
        title: "Resolução por Árvore de Recursão e Limite Inferior Ω(n lg n) em Divisões Desproporcionais",
        prompt: `
          <p>Aplique o método da árvore de recursão e a verificação por substituição nos três problemas da Seção 4.4:</p>
          <ol>
            <li><strong>(Exercício 4.4-1)</strong> Determine um bom limite superior assintótico para $T(n) = 3T(\\lfloor n/2 \\rfloor) + n$ usando uma árvore de recursão e verifique sua resposta pelo método de substituição.</li>
            <li><strong>(Exercício 4.4-6)</strong> Argumente, examinando a árvore de recursão da Figura 4.6, que a solução para a recorrência $T(n) = T(n/3) + T(2n/3) + cn$ é também <strong>$\\Omega(n \\lg n)$</strong>, concluindo que $T(n) = \\Theta(n \\lg n)$.</li>
            <li><strong>(Exercício 4.4-9)</strong> Resolva a recorrência geral de divisão desproporcional $T(n) = T(\\alpha n) + T((1 - \\alpha)n) + cn$, onde $0 < \\alpha < 1$ é uma constante e $c > 0$.</li>
          </ol>
        `,
        placeholder:
          "Construa a soma por níveis para 3T(n/2) + n, analise os níveis completos até log₃ n na Figura 4.6 e generalize para α e 1 - α...",
        solution: `
          <h4>1. Exercício 4.4-1: $T(n) = 3T(\\lfloor n/2 \\rfloor) + n$</h4>
          <ul>
            <li><strong>Árvore de Recursão:</strong> A árvore tem altura $\\lg n$. No nível $i$, há $3^i$ nós, cada um custando $n/2^i$, logo o nível $i$ custa $(3/2)^i n$ (série geométrica crescente de razão $r = 3/2 > 1$). No nível $\\lg n$, há $3^{\\lg n} = n^{\\lg 3}$ folhas. A soma total é:
              $$T(n) = \\sum_{i=0}^{\\lg n - 1} \\left(\\frac{3}{2}\\right)^i n + \\Theta(n^{\\lg 3}) = n \\frac{(3/2)^{\\lg n} - 1}{(3/2) - 1} + \\Theta(n^{\\lg 3}) = 2(n^{\\lg 3} - n) + \\Theta(n^{\\lg 3}) = \\mathbf{O(n^{\\lg 3})}.$$
            </li>
            <li><strong>Verificação por Substituição (com subtração de termo inferior):</strong> Tentamos $T(n) \\le c n^{\\lg 3} - dn$:
              $$T(n) \\le 3\\left(c(n/2)^{\\lg 3} - d(n/2)\\right) + n = 3c\\frac{n^{\\lg 3}}{3} - \\frac{3}{2}dn + n = c n^{\\lg 3} - dn - \\left(\\frac{1}{2}dn - n\\right) \\le c n^{\\lg 3} - dn,$$
              válido para todo <strong>$d \\ge 2$</strong>!</li>
          </ul>

          <h4>2. Exercício 4.4-6: Prova de $T(n) = \\Omega(n \\lg n)$ para $T(n) = T(n/3) + T(2n/3) + cn$</h4>
          <p>Na árvore de recursão da Figura 4.6, o caminho mais curto da raiz até uma folha desce sempre pelo filho esquerdo $n/3$ e tem comprimento $\\log_3 n$. Portanto, todos os níveis $i$ no intervalo $0 \\le i \\le \\lfloor \\log_3 n \\rfloor - 1$ são <strong>níveis binários completos</strong> (nenhuma folha ainda foi atingida acima dessa profundidade!). Em cada nível completo, a soma dos tamanhos dos $2^i$ nós é exatamente $n$, e o custo do nível é exatamente $cn$. Logo:</p>
          $$T(n) \\ge \\sum_{i=0}^{\\lfloor \\log_3 n \\rfloor - 1} cn = cn \\lfloor \\log_3 n \\rfloor = \\frac{c}{\\lg 3} n \\lg n - O(n) = \\mathbf{\\Omega(n \\lg n)}.$$
          <p>Combinando com $T(n) = O(n \\lg n)$ provado na Seção 4.4, concluímos <strong>$T(n) = \\Theta(n \\lg n)$</strong>.</p>

          <h4>3. Exercício 4.4-9: Generalização para $T(n) = T(\\alpha n) + T((1 - \\alpha)n) + cn$ ($0 < \\alpha < 1$)</h4>
          <p>Sem perda de generalidade, suponha $0 < \\alpha \\le 1/2 \\le 1 - \\alpha < 1$. Em cada nível completo da árvore, a soma dos argumentos é $(\\alpha + (1 - \\alpha))^i n = 1^i n = n$, portanto cada nível completo custa $cn$:</p>
          <ul>
            <li>O caminho mais curto tem comprimento $\\log_{1/\\alpha} n$ (fornecendo $\\lfloor \\log_{1/\\alpha} n \\rfloor$ níveis completos de custo $cn$, logo $T(n) = \\Omega(n \\lg n)$).</li>
            <li>O caminho mais longo tem comprimento $\\log_{1/(1 - \\alpha)} n$ (e cada nível custa no máximo $cn$, logo $T(n) = O(n \\lg n)$).</li>
          </ul>
          <p>Portanto, para <strong>qualquer constante $0 < \\alpha < 1$</strong> (mesmo $\\alpha = 1/100$ e $1 - \\alpha = 99/100$), a solução é sempre <strong>$T(n) = \\Theta(n \\lg n)$</strong>!</p>
        `
      },
      {
        id: "ex3-5",
        code: "EXERCÍCIO 05 • APLICAÇÕES DO MÉTODO MESTRE E EXTENSÃO LOGARÍTMICA",
        reference: "Exercícios 4.5-1, 4.5-3, 4.5-4 e 4.6-2 (pp. 94 e 101)",
        title: "A Progressão dos 4 Casos de T(n) = 2T(n/4) + f(n) e Resolução da Lacuna Logarítmica",
        prompt: `
          <p>Resolva os seguintes problemas sobre o Teorema Mestre e sua extensão:</p>
          <ol>
            <li><strong>(Exercício 4.5-1)</strong> Use o método mestre para fornecer limites assintóticos restritos ($\\Theta$) para as quatro recorrências abaixo, observando como o crescimento de $f(n)$ percorre os três casos do Teorema Mestre:
              <ul>
                <li>(a) $T(n) = 2T(n/4) + 1$</li>
                <li>(b) $T(n) = 2T(n/4) + \\sqrt{n}$</li>
                <li>(c) $T(n) = 2T(n/4) + n$</li>
                <li>(d) $T(n) = 2T(n/4) + n^2$</li>
              </ul>
            </li>
            <li><strong>(Exercícios 4.5-4 e 4.6-2)</strong> Demonstre para potências exatas de $b$ que, se $f(n) = \\Theta(n^{\\log_b a} \\lg^k n)$ com $k \\ge 0$, então $T(n) = aT(n/b) + f(n)$ tem solução <strong>$T(n) = \\Theta(n^{\\log_b a} \\lg^{k+1} n)$</strong>. Use esse resultado para resolver $T(n) = 4T(n/2) + n^2 \\lg n$.</li>
          </ol>
        `,
        placeholder:
          "Calcule n^(log₄ 2) = n^(1/2) = √n para o Exercício 4.5-1 e avalie o somatório do Lema 4.2 para f(n) = Θ(n^(log_b a) lg^k n)...",
        solution: `
          <h4>1. Resolução do Exercício 4.5-1 ($a = 2, b = 4 \\implies n^{\\log_4 2} = n^{1/2} = \\sqrt{n}$)</h4>
          <p>Em todos os quatro itens, o limiar das folhas é <strong>$n^{\\log_4 2} = n^{1/2} = \\sqrt{n}$</strong>:</p>
          <ul>
            <li><strong>(a) $T(n) = 2T(n/4) + 1$:</strong> Como $f(n) = 1 = O(n^{1/2 - \\epsilon})$ para $\\epsilon = 1/2$, aplica-se o <strong>Caso 1</strong> $\\implies \\mathbf{T(n) = \\Theta(\\sqrt{n})}$.</li>
            <li><strong>(b) $T(n) = 2T(n/4) + \\sqrt{n}$:</strong> Como $f(n) = \\sqrt{n} = \\Theta(n^{1/2})$, aplica-se o <strong>Caso 2</strong> $\\implies \\mathbf{T(n) = \\Theta(\\sqrt{n} \\lg n)}$.</li>
            <li><strong>(c) $T(n) = 2T(n/4) + n$:</strong> Como $f(n) = n = \\Omega(n^{1/2 + \\epsilon})$ para $\\epsilon = 1/2$ e a condição de regularidade vale ($2(n/4) = \\frac{1}{2}n \\le cn$ com $c = 1/2 < 1$), aplica-se o <strong>Caso 3</strong> $\\implies \\mathbf{T(n) = \\Theta(n)}$.</li>
            <li><strong>(d) $T(n) = 2T(n/4) + n^2$:</strong> Como $f(n) = n^2 = \\Omega(n^{1/2 + \\epsilon})$ para $\\epsilon = 3/2$ e a regularidade vale ($2(n/4)^2 = \\frac{1}{8}n^2 \\le cn^2$ com $c = 1/8 < 1$), aplica-se o <strong>Caso 3</strong> $\\implies \\mathbf{T(n) = \\Theta(n^2)}$.</li>
          </ul>

          <h4>2. Demonstração do Exercício 4.6-2 e Aplicação ao Exercício 4.5-4</h4>
          <p>Pelo Lema 4.2, precisamos avaliar a soma $g(n) = \\sum_{j=0}^{\\log_b n - 1} a^j f(n/b^j)$. Substituindo $f(n/b^j) = \\Theta\\left((n/b^j)^{\\log_b a} \\lg^k(n/b^j)\\right)$ e usando $a^j / (b^j)^{\\log_b a} = 1$:</p>
          $$g(n) = \\Theta\\left(n^{\\log_b a} \\sum_{j=0}^{\\log_b n - 1} \\lg^k(n/b^j)\\right).$$
          <p>Como $n = b^m$ (onde $m = \\log_b n$), fazendo o índice reverso $i = m - j$ (que varia de $1$ até $m = \\log_b n$), temos $\\lg(n/b^j) = \\lg(b^i) = i \\lg b$. Assim:</p>
          $$\\sum_{j=0}^{\\log_b n - 1} \\lg^k(n/b^j) = (\\lg b)^k \\sum_{i=1}^{\\log_b n} i^k = \\Theta\\left((\\log_b n)^{k+1}\\right) = \\Theta(\\lg^{k+1} n).$$
          <p>Logo, $g(n) = \\Theta(n^{\\log_b a} \\lg^{k+1} n)$ e <strong>$T(n) = \\Theta(n^{\\log_b a} \\lg^{k+1} n)$</strong>! Aplicando ao <strong>Exercício 4.5-4</strong> ($T(n) = 4T(n/2) + n^2 \\lg n$), onde $n^{\\log_2 4} = n^2$ e $k = 1$, obtemos imediatamente <strong>$T(n) = \\Theta(n^2 \\lg^2 n)$</strong>.</p>
        `
      },
      {
        id: "ex3-6",
        code: "EXERCÍCIO 06 • PROBLEMAS 4-1 E 4-3: BATERIA CANÔNICA DE RECORRÊNCIAS",
        reference: "Problemas 4-1 e 4-3 (pp. 101–102)",
        title: "Resolução Completa dos Problemas 4-1 (a–g) e 4-3 (a–j)",
        prompt: `
          <p>Determine limites assintóticos justos ($\\Theta$) para as recorrências selecionadas dos <strong>Problemas 4-1 e 4-3</strong>, justificando o método empregado em cada caso:</p>
          <ol>
            <li><strong>Problema 4-1:</strong> (a) $T(n) = 2T(n/2) + n^4$; (b) $T(n) = T(7n/10) + n$; (c) $T(n) = 16T(n/4) + n^2$; (d) $T(n) = 7T(n/3) + n^2$; (e) $T(n) = 7T(n/2) + n^2$; (g) $T(n) = T(n - 2) + n^2$.</li>
            <li><strong>Problema 4-3:</strong> (a) $T(n) = 4T(n/3) + n \\lg n$; (b) $T(n) = 3T(n/3) + n / \\lg n$; (c) $T(n) = 4T(n/2) + n^2 \\sqrt{n}$; (f) $T(n) = T(n/2) + T(n/4) + T(n/8) + n$; (g) $T(n) = T(n - 1) + 1/n$; (h) $T(n) = T(n - 1) + \\lg n$; (j) $T(n) = \\sqrt{n} T(\\sqrt{n}) + n$.</li>
          </ol>
        `,
        placeholder:
          "Classifique cada recorrência pelo Teorema Mestre, Árvore de Recursão/Substituição, Somatório Direto ou Mudança de Variáveis...",
        solution: `
          <h4>1. Resolução do Problema 4-1 (p. 101)</h4>
          <ul>
            <li><strong>(a) $T(n) = 2T(n/2) + n^4$:</strong> $n^{\\log_2 2} = n$; $f(n) = n^4 = \\Omega(n^{1+3})$ e $2(n/2)^4 = \\frac{1}{8}n^4$ ($c = 1/8 < 1$). Caso 3 do Teorema Mestre $\\implies \\mathbf{\\Theta(n^4)}$.</li>
            <li><strong>(b) $T(n) = T(7n/10) + n$:</strong> $a=1, b=10/7 \\implies n^{\\log_{10/7} 1} = 1$; $f(n) = n$ e $1(7n/10) = 0,7n$ ($c = 0,7 < 1$). Caso 3 do Teorema Mestre $\\implies \\mathbf{\\Theta(n)}$.</li>
            <li><strong>(c) $T(n) = 16T(n/4) + n^2$:</strong> $n^{\\log_4 16} = n^2 = f(n)$. Caso 2 do Teorema Mestre $\\implies \\mathbf{\\Theta(n^2 \\lg n)}$.</li>
            <li><strong>(d) $T(n) = 7T(n/3) + n^2$:</strong> $n^{\\log_3 7} \\approx n^{1,771}$; $f(n) = n^2 = \\Omega(n^{\\log_3 7 + 0,2})$ e $7(n/3)^2 = \\frac{7}{9}n^2$ ($c = 7/9 < 1$). Caso 3 $\\implies \\mathbf{\\Theta(n^2)}$.</li>
            <li><strong>(e) $T(n) = 7T(n/2) + n^2$:</strong> $n^{\\lg 7} \\approx n^{2,81}$; $f(n) = n^2 = O(n^{\\lg 7 - 0,8})$. Caso 1 (Strassen) $\\implies \\mathbf{\\Theta(n^{\\lg 7})}$.</li>
            <li><strong>(g) $T(n) = T(n - 2) + n^2$:</strong> Expansão direta em somatório com $\\approx n/2$ termos: $T(n) = \\sum_{k=1}^{n/2} (2k)^2 = 4 \\frac{(n/2)(n/2 + 1)(n + 1)}{6} = \\mathbf{\\Theta(n^3)}$.</li>
          </ul>

          <h4>2. Resolução do Problema 4-3 (pp. 101–102)</h4>
          <ul>
            <li><strong>(a) $T(n) = 4T(n/3) + n \\lg n$:</strong> Como $n^{\\log_3 4} \\approx n^{1,262}$ e $f(n) = n \\lg n = O(n^{1,262 - 0,2})$, aplica-se o Caso 1 do Teorema Mestre $\\implies \\mathbf{\\Theta(n^{\\log_3 4})}$.</li>
            <li><strong>(b) $T(n) = 3T(n/3) + n / \\lg n$:</strong> Aqui $n^{\\log_3 3} = n$, mas $n / f(n) = \\lg n = o(n^\\epsilon)$ (cai na <strong>lacuna entre os Casos 1 e 2</strong>!). Na árvore de recursão, o nível $j$ tem $3^j$ nós de custo $\\frac{n/3^j}{\\lg(n/3^j)} = \\frac{n}{3^j \\lg(n/3^j)}$, logo o nível $j$ custa $\\frac{n}{\\lg(n/3^j)}$. Somando para $j = 0 \\dots \\log_3 n - 1$, obtemos $n$ vezes a <strong>série harmônica</strong> $\\sum_{i=1}^{\\log_3 n} \\frac{1}{i \\lg 3} = \\Theta(\\lg \\lg n)$. Solução: $\\mathbf{\\Theta(n \\lg \\lg n)}$.</li>
            <li><strong>(c) $T(n) = 4T(n/2) + n^2 \\sqrt{n}$:</strong> $n^{\\log_2 4} = n^2$ e $f(n) = n^{2,5} = \\Omega(n^{2 + 0,5})$, com $4(n/2)^{2,5} = \\frac{1}{\\sqrt{2}}n^{2,5}$ ($c = 1/\\sqrt{2} < 1$). Caso 3 $\\implies \\mathbf{\\Theta(n^2 \\sqrt{n})}$.</li>
            <li><strong>(f) $T(n) = T(n/2) + T(n/4) + T(n/8) + n$:</strong> Em cada nível da árvore, a soma dos tamanhos dos filhos é $(1/2 + 1/4 + 1/8) = 7/8 < 1$ do nível anterior! Isso gera uma série geométrica decrescente $\\sum_{j=0}^{\\infty} (7/8)^j n = 8n$. Verificando por substituição $T(n) \\le 8n$: $8(n/2) + 8(n/4) + 8(n/8) + n = (4 + 2 + 1 + 1)n = 8n$. Solução: $\\mathbf{\\Theta(n)}$.</li>
            <li><strong>(g) $T(n) = T(n - 1) + 1/n$:</strong> Expansão direta gera a série harmônica $H_n = \\sum_{k=1}^{n} \\frac{1}{k} = \\ln n + O(1) = \\mathbf{\\Theta(\\lg n)}$.</li>
            <li><strong>(h) $T(n) = T(n - 1) + \\lg n$:</strong> Expansão direta gera $\\sum_{k=1}^{n} \\lg k = \\lg(n!) = \\mathbf{\\Theta(n \\lg n)}$ (pela aproximação de Stirling, Cap. 3).</li>
            <li><strong>(j) $T(n) = \\sqrt{n} T(\\sqrt{n}) + n$:</strong> Dividindo ambos os lados por $n$, obtemos $\\frac{T(n)}{n} = \\frac{T(n^{1/2})}{n^{1/2}} + 1$. Definindo $S(n) = T(n)/n$, temos $S(n) = S(n^{1/2}) + 1$, que atinge constante após $\\lg \\lg n$ passos ($n^{1/2^k} = 2 \\iff 2^k = \\lg n \\iff k = \\lg \\lg n$). Logo $S(n) = \\Theta(\\lg \\lg n) \\implies \\mathbf{T(n) = \\Theta(n \\lg \\lg n)}$.</li>
          </ul>
        `
      },
      {
        id: "ex3-7",
        code: "EXERCÍCIO 07 • PROBLEMA 4-5: TESTES DE CHIPS DO PROFESSOR DIÓGENES",
        reference: "Problema 4-5 (p. 103)",
        title: "Prova de Impossibilidade para Maioria Ruim e Algoritmo Linear Θ(n) por Pareamento",
        prompt: `
          <p>No <strong>Problema 4-5 (Testes de chips)</strong>, o professor Diógenes possui $n$ chips. Um chip bom sempre relata com precisão se outro chip é bom ou ruim, mas um chip ruim pode mentir arbitrariamente. Resolva os três itens do problema:</p>
          <ol>
            <li><strong>(a)</strong> Prove que, se $\\ge n/2$ chips forem ruins, o professor não pode necessariamente determinar quais chips são bons usando qualquer estratégia baseada em testes aos pares.</li>
            <li><strong>(b)</strong> Supondo que <strong>mais de $n/2$ chips sejam bons</strong>, mostre que $\\lfloor n/2 \\rfloor$ testes de pares são suficientes para reduzir o problema de encontrar um único chip bom a um subproblema com no máximo metade do tamanho que preserva a propriedade de que mais da metade dos chips são bons.</li>
            <li><strong>(c)</strong> Dê e resolva a recorrência para identificar um chip bom e todos os demais chips em <strong>$\\Theta(n)$</strong> testes.</li>
          </ol>
        `,
        placeholder:
          "Demonstre o argumento do adversário no item (a), as regras de descarte de pares no item (b) e resolva T(n) = T(⌈n/2⌉) + ⌊n/2⌋ no item (c)...",
        solution: `
          <h4>(a) Impossibilidade quando $\\ge n/2$ chips são ruins (Argumento do Adversário)</h4>
          <p>Suponha que existam $g \\le n/2$ chips bons (conjunto $G$) e $b = n - g \\ge g$ chips ruins. Escolha um subconjunto $B' \\subseteq B$ de chips ruins com exatamente o mesmo tamanho dos bons ($|B'| = g$). Os chips ruins em $B'$ adotam a seguinte conspiração simétrica:</p>
          <ul>
            <li>Todo chip em $B'$ declara que qualquer outro chip de $B'$ é "bom" e que qualquer chip fora de $B'$ (incluindo todos os chips de $G$) é "ruim".</li>
            <li>Enquanto isso, os chips bons em $G$ dizem a verdade: declaram que todo chip de $G$ é "bom" e que todo chip de $B'$ é "ruim".</li>
          </ul>
          <p>Com esse comportamento, os conjuntos $G$ e $B'$ têm exatamente o mesmo tamanho $g$ e produzem respostas idênticas e simétricas em todos os testes possíveis! Nenhum algoritmo pode distinguir se os chips bons são $G$ ou $B'$.</p>

          <h4>(b) Redução pela Metade com $\\lfloor n/2 \\rfloor$ Testes Preservando a Maioria Boa</h4>
          <p>Suponha agora que $g > n/2$ (há estritamente mais chips bons que ruins: $g - b \\ge 1$). Dividimos os $n$ chips em $\\lfloor n/2 \\rfloor$ pares disjuntos (deixando $1$ chip de fora se $n$ for ímpar) e realizamos $1$ teste em cada par:</p>
          <ol>
            <li><strong>Regra de Descarte:</strong> Se o resultado do par <em>não for</em> ("bom", "bom"), sabemos com certeza que <strong>pelo menos um chip do par é ruim</strong>; descartamos <strong>ambos</strong> os chips do par! Se o resultado for ("bom", "bom"), sabemos que <strong>ambos são bons ou ambos são ruins</strong>; mantemos <strong>apenas $1$ chip</strong> do par para a próxima rodada.</li>
            <li><strong>Tratamento do chip ímpar que sobrou (se $n$ for ímpar):</strong> Se o número de pares que deram ("bom", "bom") for <em>ímpar</em>, já existem estritamente mais pares (bom, bom) do que (ruim, ruim) (diferença $\\ge 1$, ou seja, pelo menos $2$ chips bons a mais que ruins nos pares), então podemos descartar o chip que sobrou; se o número de pares ("bom", "bom") for <em>par</em>, incluímos o chip que sobrou no conjunto da próxima rodada!</li>
          </ol>
          <p>Seja $k_G$ o número de pares (bom, bom) e $k_B$ o número de pares (ruim, ruim). Cada par misto descartado removeu $1$ bom e $1$ ruim, preservando a vantagem dos bons. Nos pares homogêneos, cada par (bom, bom) contribui com $1$ chip bom e cada par (ruim, ruim) contribui com $1$ chip ruim na próxima rodada. Assim, na nova instância de tamanho $n' \\le \\lceil n/2 \\rceil$, o número de chips bons continua sendo estritamente maior que $n'/2$!</p>

          <h4>(c) Recorrência e Complexidade Linear $\\Theta(n)$</h4>
          <p>O número de testes $T(n)$ para encontrar <strong>$1$ único chip bom</strong> satisfaz a recorrência:</p>
          $$T(n) = T(\\lceil n/2 \\rceil) + \\lfloor n/2 \\rfloor.$$
          <p>Pelo Caso 3 do Teorema Mestre ($a = 1, b = 2 \\implies n^{\\log_2 1} = 1$, $f(n) = \\Theta(n)$ com $c = 1/2 < 1$), temos <strong>$T(n) = \\Theta(n)$</strong> (na verdade, $T(n) \\le n$ testes). Uma vez identificado esse único chip bom $c^*$, basta testá-lo contra os outros $n - 1$ chips usando mais $n - 1$ testes! O total geral é $\\le 2n - 1 = \\mathbf{\\Theta(n)}$ testes.</p>
        `
      },
      {
        id: "ex3-8",
        code: "EXERCÍCIO 08 • PROBLEMA 4-6: ARRANJOS DE MONGE E MÍNIMOS EM O(m + n log m)",
        reference: "Problema 4-6 (pp. 103–104 — numerado como 1-7 na impressão brasileira)",
        title: "Propriedades Estruturais de Arranjos de Monge e Divisão e Conquista por Linhas Pares e Ímpares",
        prompt: `
          <p>Um arranjo $m \\times n$ de números reais $A$ é um <strong>arranjo de Monge</strong> se, para todo $1 \\le i < k \\le m$ e $1 \\le j < l \\le n$, vale a desigualdade:</p>
          $$A[i, j] + A[k, l] \\le A[i, l] + A[k, j].$$
          <p>Resolva os itens fundamentais do <strong>Problema 4-6</strong>:</p>
          <ol>
            <li><strong>(a)</strong> Explique por que $A$ é de Monge se e somente se para todo $i = 1, \\dots, m-1$ e $j = 1, \\dots, n-1$ vale a condição local $2 \\times 2$: $A[i, j] + A[i+1, j+1] \\le A[i, j+1] + A[i+1, j]$.</li>
            <li><strong>(c)</strong> Seja $f(i)$ o índice da coluna que contém o elemento mínimo mais à esquerda da linha $i$. Prove a monotonicidade das colunas mínimas: <strong>$f(1) \\le f(2) \\le \\dots \\le f(m)$</strong>.</li>
            <li><strong>(d) e (e)</strong> Dado os mínimos $f(2), f(4), \\dots$ das linhas pares de $A$, mostre como encontrar os mínimos $f(1), f(3), f(5), \\dots$ de todas as linhas ímpares em tempo total <strong>$O(m + n)$</strong> e resolva a recorrência resultante para provar que o algoritmo de divisão e conquista encontra todos os mínimos em tempo <strong>$O(m + n \\log m)$</strong>!</li>
          </ol>
        `,
        placeholder:
          "Prove f(i) ≤ f(i+1) por contradição usando a desigualdade de Monge, mostre a soma telescópica dos intervalos [f(2k), f(2k+2)] em O(m+n) e resolva T(m, n) = T(m/2, n) + O(m + n)...",
        solution: `
          <h4>1. Parte (a): Equivalência com Submatrizes Adjacentes $2 \\times 2$</h4>
          <p>A direção "somente se" é imediata tomando $k = i + 1$ e $l = j + 1$. Para a direção "se", basta somar as desigualdades $2 \\times 2$ adjacentes ao longo do retângulo de linhas $i \\dots k-1$ e colunas $j \\dots l-1$: todos os termos internos se cancelam telescopicamente, restando exatamente os quatro cantos $A[i, j] + A[k, l] \\le A[i, l] + A[k, j]$!</p>

          <h4>2. Parte (c): Prova da Monotonicidade $f(1) \\le f(2) \\le \\dots \\le f(m)$</h4>
          <p>Suponha, por absurdo, que para algum $i < k$ tivéssemos $f(i) > f(k)$. Definindo $j = f(k)$ e $l = f(i)$, temos $1 \\le j < l \\le n$ e $1 \\le i < k \\le m$:
          <ul>
            <li>Como $l = f(i)$ é o mínimo mais à esquerda da linha $i$ e $j < l$, temos estritamente <strong>$A[i, l] < A[i, j]$</strong>.</li>
            <li>Como $j = f(k)$ é o mínimo da linha $k$, temos <strong>$A[k, j] \\le A[k, l]$</strong>.</li>
          </ul>
          Somando essas duas desigualdades, obteríamos $A[i, l] + A[k, j] < A[i, j] + A[k, l]$, o que <strong>contradiz a propriedade de Monge</strong> $A[i, j] + A[k, l] \\le A[i, l] + A[k, j]$! Logo, $f(i) \\le f(k)$ para todo $i < k$.</p>

          <h4>3. Partes (d) e (e): Busca nas Linhas Ímpares em $O(m + n)$ e Recorrência $O(m + n \\log m)$</h4>
          <p><strong>Parte (d):</strong> Uma vez conhecidos os índices $f(2), f(4), f(6), \\dots$ das linhas pares (definindo $f(0) = 1$ e $f(m+1) = n$), a propriedade de monotonicidade $f(2k) \\le f(2k+1) \\le f(2k+2)$ garante que, para achar o mínimo da linha ímpar $2k+1$, basta varrer as colunas no intervalo restrito $[f(2k), f(2k+2)]$, que contém $f(2k+2) - f(2k) + 1$ elementos! Somando esse trabalho sobre todas as $\\lceil m/2 \\rceil$ linhas ímpares, obtemos uma <strong>soma telescópica</strong>:</p>
          $$\\sum_{k=0}^{\\lceil m/2 \\rceil - 1} \\left(f(2k+2) - f(2k) + 1\\right) = (f(m+1) - f(0)) + \\lceil m/2 \\rceil = (n - 1) + \\lceil m/2 \\rceil = \\mathbf{O(m + n)}!$$
          <p><strong>Parte (e):</strong> A submatriz $A'$ formada pelas linhas pares de uma matriz de Monge continua sendo de Monge e tem dimensão $\\lfloor m/2 \\rfloor \\times n$. Portanto, a recorrência para o tempo total $T(m, n)$ é:</p>
          $$T(m, n) = T(m/2, n) + c(m + n).$$
          <p>Expandindo pelos $\\lg m$ níveis da recursão (onde $m$ cai pela metade a cada nível enquanto $n$ permanece fixo em todos os níveis):</p>
          $$T(m, n) = \\sum_{j=0}^{\\lg m} c\\left(\\frac{m}{2^j} + n\\right) = cm \\sum_{j=0}^{\\lg m} \\frac{1}{2^j} + cn(\\lg m + 1) < 2cm + cn(\\lg m + 1) = \\mathbf{O(m + n \\log m)}.$$
          <p>(Para uma matriz quadrada $n \\times n$, encontramos o mínimo de cada linha em $O(n \\log n)$, muito mais rápido que ler todas as $n^2$ entradas!)</p>
        `
      }
    ]
  };

  if (typeof window !== "undefined" && typeof window.registerCodexModule === "function") {
    window.registerCodexModule(3, module3Content);
  }
})();
