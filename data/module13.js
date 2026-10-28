/* ==========================================================================
   CODEX — MÓDULO 13: ALGORITMOS MULTITHREAD, OPERAÇÕES COM MATRIZES E PROGRAMAÇÃO LINEAR
   Capítulos 27, 28 e 29 + Apêndice D (pp. 624–725 e pp. 978–990)
   Obra: Algoritmos: Teoria e Prática (3ª Edição) — Cormen, Leiserson, Rivest e Stein
   ========================================================================== */

(function () {
  const revisao = {
    subtitle:
      "Do Multithreading Dinâmico (Trabalho T₁, Duração T_∞ e Escalonamento Guloso) à Decomposição LUP, Aproximação por Mínimos Quadrados e Otimização Linear Convexa (Simplex e Dualidade Forte)",
    intro:
      "Com o Módulo 13 adentramos a Parte VII (Tópicos Selecionados, Capítulos 27, 28 e 29, pp. 624–725) consolidada pelos fundamentos matriciais do Apêndice D (pp. 978–990). O Capítulo 27 rompe com o paradigma puramente sequencial ao introduzir o modelo de Multithreading Dinâmico (baseado em spawn, sync e parallel), modelando qualquer computação concorrente como um grafo acíclico dirigido (GAD) G = (V, E) de fibras (strands) e caracterizando sua eficiência pelas métricas intrínsecas de Trabalho (T₁) e Duração/Caminho Crítico (T_∞), culminando no Teorema 27.1 de Escalonamento Guloso (T_P ≤ T₁/P + T_∞) e na intercalação paralela P-MERGE-SORT com paralelismo Θ(n / lg² n). Em seguida, o Apêndice D e o Capítulo 28 desenvolvem a álgebra linear numérica: resolução de sistemas Ax = b em Θ(n³) via Decomposição LUP numericamente estável com pivoteamento parcial (PA = LU), equivalência assintótica entre inversão e multiplicação de matrizes (Teoremas 28.1 e 28.2), garantia de decomposição LU sem pivoteamento para matrizes simétricas positivas definidas (Corolário 28.5) e ajuste de curvas por mínimos quadrados via pseudoinversa de Moore–Penrose A⁺ = (AᵀA)⁻¹Aᵀ. Por fim, o Capítulo 29 estuda a Programação Linear (PL) — um dos modelos mais gerais e expressivos da otimização combinatória e contínua — cobrindo as Formas Padrão e de Folgas (Slack Form), o Algoritmo SIMPLEX de Dantzig (operações de PIVOT, degenerescência e prevenção de ciclagem pela Regra de Bland), a Teoria da Dualidade Forte (Teorema 29.10) e a determinação de soluções básicas viáveis iniciais via programa linear auxiliar L_aux em INITIALIZE-SIMPLEX (Teorema 29.12).",
    pillars: [
      {
        tag: "[ PILAR 01 • CONCORRÊNCIA DINÂMICA: TRABALHO T₁, DURAÇÃO T_∞ E PARALELISMO T₁/T_∞ ]",
        title: "A Geometria do GAD de Computação e o Limite de Escalonamento Guloso (Cap. 27)",
        body: `
          <p>Em vez de gerenciar threads físicas manualmente, o <strong>Multithreading Dinâmico</strong> (pp. 624–635) permite que o programador expresse o paralelismo lógico por meio de três palavras-chave (<code>spawn</code>, <code>sync</code> e <code>parallel</code>), cabendo a um escalonador em tempo de execução distribuir o trabalho sobre $P$ processadores:</p>
          <ul>
            <li><strong>Trabalho ($T_1$) e Duração ($T_\\infty$):</strong> A execução é um GAD $G = (V, E)$ de fibras. O <em>trabalho</em> $T_1$ é o tempo total em $1$ processador (soma de todas as fibras), enquanto a <em>duração</em> (<em>span</em> ou caminho crítico) $T_\\infty$ é o peso do caminho dirigido mais longo em $G$ (tempo em $\\infty$ processadores).</li>
            <li><strong>Leis Fundamentais e Escalonamento Guloso (Teorema 27.1):</strong> Todo escalonamento em $P$ processadores obedece à <strong>Lei do Trabalho</strong> ($T_P \\ge T_1 / P$) e à <strong>Lei da Duração</strong> ($T_P \\ge T_\\infty$). Mais ainda, qualquer escalonador guloso garante $T_P \\le T_1 / P + T_\\infty$. Assim, a razão $\\bar{P} = T_1 / T_\\infty$ (o <strong>paralelismo</strong> médio da computação) representa o número máximo de processadores nos quais é possível obter aceleração linear ($T_P = \\Theta(T_1 / P)$ quando $P \\ll T_1 / T_\\infty$).</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 02 • FUNDAMENTOS DE ÁLGEBRA LINEAR E MATRIZES POSITIVAS DEFINIDAS ]",
        title: "Posto, Vetores Anuladores, Determinantes e Formas Quadráticas xᵀAx > 0 (Apêndice D e Cap. 28)",
        body: `
          <p>O <strong>Apêndice D</strong> (pp. 978–990) e a <strong>Seção 28.3</strong> (pp. 669–674) estabelecem os alicerces algébricos que sustentam todos os algoritmos matriciais do Capítulo 28:</p>
          <ul>
            <li><strong>Posto Completo e Não Singularidade (Teoremas D.1 a D.5):</strong> Para uma matriz quadrada $A$ de ordem $n \\times n$, são equivalentes: (i) $A$ é inversível (não singular, existe $A^{-1}$ única tal que $AA^{-1} = I_n$); (ii) $A$ tem posto completo $\\text{posto}(A) = n$ (suas linhas e colunas são linearmente independentes); (iii) $A$ não possui vetor anulador não nulo ($Ax = 0 \\implies x = 0$); e (iv) $\\det(A) \\neq 0$.</li>
            <li><strong>Matrizes Simétricas Positivas Definidas:</strong> Uma matriz simétrica $A$ é positiva definida se $x^{\\text{T}} A x > 0$ para todo vetor $x \\neq 0$. Pelo <strong>Teorema D.6</strong>, para qualquer matriz $A$ ($m \\times n$) com posto coluna completo ($n$), a matriz quadrada $A^{\\text{T}} A$ ($n \\times n$) é simétrica e positiva definida (pois $x^{\\text{T}}(A^{\\text{T}}A)x = \\|Ax\\|^2 > 0$). Além disso, toda submatriz principal líder e todo complemento de Schur de uma matriz simétrica positiva definida permanecem positivos definidos (Lemas 28.3 e 28.4), garantindo que a decomposição LU jamais divide por zero mesmo sem pivoteamento (Corolário 28.5)!</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 03 • ESTABILIDADE NUMÉRICA, COMPLEMENTO DE SCHUR E DECOMPOSIÇÃO LUP ]",
        title: "Fatorar Uma Vez em Θ(n³), Resolver Múltiplos Sistemas em Θ(n²) (Seções 28.1 e 28.2)",
        body: `
          <p>Resolver um sistema linear $Ax = b$ diretamente por inversão ($x = A^{-1}b$) é mais trabalhoso e numericamente menos preciso do que fatorar $A$ em fatores triangulares (pp. 653–665):</p>
          <ul>
            <li><strong>Decomposição LUP ($PA = LU$):</strong> Buscamos uma matriz de permutação $P$, uma matriz triangular inferior unitária $L$ (com $1$s na diagonal principal) e uma matriz triangular superior $U$ tais que $PA = LU$. Multiplicando $Ax = b$ por $P$, obtemos $LUx = Pb$: resolvemos primeiro $Ly = Pb$ por <strong>substituição progressiva</strong> e depois $Ux = y$ por <strong>substituição regressiva</strong> em tempo $\\Theta(n^2)$ (<code>LUP-SOLVE</code>).</li>
            <li><strong>Por Que Pivotear?</strong> Na eliminação gaussiana recursiva via <strong>complemento de Schur</strong> ($A' - v w^{\\text{T}} / a_{11}$), se o pivô $a_{11}$ for zero, <code>LU-DECOMPOSITION</code> falha por divisão por zero; e se $|a_{11}|$ for muito pequeno em aritmética de ponto flutuante, ocorre grave <em>instabilidade numérica</em>. O procedimento <code>LUP-DECOMPOSITION</code> executa <strong>pivoteamento parcial</strong> em $\\Theta(n^3)$, escolhendo em cada etapa $k$ o elemento de maior módulo $|a_{ik}|$ ($i \\ge k$) na coluna como pivô e permutando as linhas.</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 04 • OTIMIZAÇÃO LINEAR CONVEXA: FORMAS PADRÃO E DE FOLGAS, SIMPLEX E DUALIDADE ]",
        title: "Caminhada pelos Vértices do Politopo Simplicial e Certificados de Otimalidade Dual (Cap. 29)",
        body: `
          <p>A <strong>Programação Linear</strong> otimiza uma função linear $\\sum_{j=1}^n c_j x_j$ sujeita a desigualdades lineares que definem um politopo convexo (o <em>simplex</em> multidimensional, pp. 676–725):</p>
          <ul>
            <li><strong>Forma Padrão vs. Forma de Folgas:</strong> Na <strong>Forma Padrão</strong> maximizamos $c^{\\text{T}}x$ sujeito a $Ax \\le b$ e $x \\ge 0$. Para aplicar o algoritmo <code>SIMPLEX</code>, introduzimos uma <strong>variável de folga</strong> $x_{n+i} = b_i - \\sum_{j=1}^n a_{ij} x_j \\ge 0$ para cada uma das $m$ restrições, obtendo a <strong>Forma de Folgas</strong> representada pela tupla $(N, B, A, b, c, v)$, onde $B$ ($|B|=m$) são as variáveis básicas (lado esquerdo) e $N$ ($|N|=n$) são as variáveis não básicas (lado direito, fixadas em $0$ na solução básica).</li>
            <li><strong><code>PIVOT</code>, Dualidade Forte e <code>INITIALIZE-SIMPLEX</code>:</strong> Cada operação de <code>PIVOT</code> troca uma variável não básica de entrada $x_e$ ($c_e > 0$) por uma variável básica de saída $x_l$ (que impõe o limite mais restritivo $b_l / a_{le}$ com $a_{le} > 0$), movendo-se para um vértice adjacente do simplex. Quando todos os coeficientes da função objetivo se tornam $\\le 0$, o <strong>Teorema 29.10 (Dualidade Forte)</strong> prova que a solução básica primal $\\bar{x}$ e a solução dual $\\bar{y}_i = -c'_{n+i}$ atingem exatamente o mesmo valor objetivo ótimo ($\\sum c_j \\bar{x}_j = \\sum b_i \\bar{y}_i = v'$)!</li>
          </ul>
        `
      }
    ],
    checklist: [
      "Sei modelar algoritmos multithread com spawn, sync e parallel como um GAD G = (V, E), calcular Trabalho T₁, Duração T_∞ e Paralelismo T₁/T_∞, demonstrar a Lei do Trabalho, a Lei da Duração e o Teorema 27.1 (T_P ≤ T₁/P + T_∞), e analisar P-FIB, P-MATRIX-MULTIPLY-RECURSIVE e P-MERGE-SORT (T₁ = Θ(n lg n), T_∞ = Θ(lg³ n)).",
      "Domino as propriedades de matrizes do Apêndice D (transposta, matriz de permutação P⁻¹ = Pᵀ, posto linha = posto coluna, determinantes e matrizes simétricas positivas definidas xᵀAx > 0) e sei executar LUP-DECOMPOSITION(A) em Θ(n³) e LUP-SOLVE(L, U, π, b) em Θ(n²).",
      "Compreendo a demonstração da equivalência assintótica entre multiplicação e inversão de matrizes (Teoremas 28.1 e 28.2), a prova de que matrizes simétricas positivas definidas possuem decomposição LU sem pivoteamento (Lemas 28.3, 28.4 e Corolário 28.5) e a dedução das equações normais AᵀAc = Aᵀy para ajuste por mínimos quadrados.",
      "Sei converter qualquer programa linear para a Forma Padrão e para a Forma de Folgas (N, B, A, b, c, v), além de formular Caminhos Mínimos de Fonte Única, Fluxo Máximo, Fluxo de Custo Mínimo e Fluxo de Multimercadorias como programas lineares.",
      "Sei executar passo a passo o algoritmo SIMPLEX(A, b, c) e o procedimento PIVOT, aplicar a Regra de Bland contra ciclagem em pivôs degenerados, construir o Programa Linear Dual (Teorema 29.10) e encontrar uma solução básica inicial viável via programa auxiliar L_aux em INITIALIZE-SIMPLEX (Teorema 29.12)."
    ]
  };

  const unidades = [
    /* ======================================================================
       UNIDADE 13.1 — CAPÍTULO 27 (SEÇÕES 27.1, 27.2 E 27.3, pp. 624–652)
       ====================================================================== */
    {
      id: "u13-1",
      code: "UNIDADE 13.1 • CAP. 27 (SEÇÕES 27.1 A 27.3)",
      pages: "pp. 624–652",
      title: "27.1, 27.2 e 27.3 Fundamentos de Multithreading Dinâmico (spawn, sync, parallel), Trabalho T₁, Duração T_∞, Escalonamento Guloso e P-MERGE-SORT",
      content: `
        <p>O <strong>Capítulo 27</strong> (pp. 624–652) introduz o projeto e a análise de algoritmos para computadores multiprocessadores de memória compartilhada por meio do modelo de <strong>multithreading dinâmico</strong>. Em vez de exigir que o programador aloque e sincronize manualmente <em>threads estáticas</em> (o que é complexo e propenso a erros quando o algoritmo é recursivo ou irregular), a plataforma de concorrência fornece primitivas de paralelismo lógico e utiliza um <strong>escalonador automático com balanceamento de carga</strong> para mapear o trabalho dinamicamente sobre os $P$ processadores físicos.</p>

        <h3>1. Seção 27.1 — O Modelo de Multithreading Dinâmico e <code>P-FIB</code> (pp. 625–638)</h3>
        <p>Estendemos nosso pseudocódigo serial com três palavras-chave de concorrência:</p>
        <ul>
          <li><code>spawn</code> (geração paralela): Precedendo uma chamada de procedimento, indica que o procedimento chamado (o filho gerado) <strong>pode ser executado em paralelo</strong> com o procedimento chamador (o pai), em vez de obrigar o pai a aguardar seu retorno imediato.</li>
          <li><code>sync</code> (sincronização): Indica que o procedimento atual <strong>deve aguardar</strong> até que todos os filhos por ele gerados via <code>spawn</code> até aquele ponto tenham terminado sua execução antes de prosseguir para a instrução seguinte. Todo procedimento executa um <code>sync</code> implícito antes de retornar (<code>return</code>).</li>
          <li><code>parallel</code> (laços paralelos): Precedendo um laço <code>para</code> (<code>parallel para i = 1 até n</code>), indica que todas as iterações do laço podem ser executadas concorrentemente. Semântica e assintoticamente, um laço <code>parallel para</code> de $n$ iterações é implementado pelo compilador como uma árvore binária recursiva de divisão e conquista que gera (<code>spawn</code>) as metades superior e inferior do intervalo, adicionando apenas $\\Theta(\\lg n)$ à duração da computação!</li>
        </ul>
        <p><strong>Importante:</strong> As palavras-chave <code>spawn</code>, <code>sync</code> e <code>parallel</code> expressam apenas o <em>paralelismo lógico</em>: se removermos todas essas palavras-chave de um programa multithread livre de corridas, obteremos um programa puramente serial válido que chamamos de <strong>projeção serial</strong> do algoritmo multithread.</p>

        <p>Para ilustrar o modelo (mesmo em um algoritmo exponencial ineficiente usado como estudo de caso didático), considere o cálculo recursivo de Fibonacci paralelizado <code>P-FIB(n)</code> (p. 626):</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">P-FIB(n)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">se</span> n ≤ 1</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">   <span class="kw">retorne</span> n</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">x = <span class="kw">spawn</span> P-FIB(n - 1)</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">y = P-FIB(n - 2)</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">sync</span></span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">retorne</span> x + y</span></div>
            </div>
          </div>

        <p>Observe a necessidade da linha 5 (<code>sync</code>): sem ela, a linha 6 tentaria somar <code>x + y</code> antes de termos garantia de que a chamada gerada <code>spawn P-FIB(n - 1)</code> na linha 3 concluiu e escreveu seu valor em $x$.</p>

        <h4>1.1 O GAD de Computação $G = (V, E)$ e as Medidas de Desempenho ($T_1$ e $T_\\infty$)</h4>
        <p>Modelamos a execução de uma computação multithread como um <strong>grafo acíclico dirigido (GAD)</strong> $G = (V, E)$ (Figura 27.2, p. 627):</p>
        <ul>
          <li>Cada vértice $u \\in V$ representa uma <strong>fibra</strong> (<em>strand</em>): uma sequência máxima de instruções seriais que não contém nenhum controle paralelo (nenhum <code>spawn</code>, <code>sync</code> ou retorno de <code>spawn</code>).</li>
          <li>Cada aresta dirigida $(u, v) \\in E$ representa uma dependência de precedência que exige que a fibra $u$ termine antes de $v$ começar, classificada em quatro tipos: <strong>arestas de continuação</strong> $(u, u')$ (horizontais, dentro da mesma instância de procedimento), <strong>arestas geradoras</strong> $(u, v)$ (apontam para baixo em um <code>spawn</code>), <strong>arestas de chamada</strong> (apontam para baixo em uma chamada normal) e <strong>arestas de retorno</strong> $(u, x)$ (apontam para cima para a fibra imediatamente após o <code>sync</code>).</li>
          <li>Se existe um caminho dirigido entre $u$ e $v$ em $G$, dizemos que as duas fibras estão <strong>logicamente em série</strong>; caso contrário, estão <strong>logicamente em paralelo</strong>.</li>
        </ul>

        <p>Sob o modelo de um <strong>computador paralelo ideal</strong> com memória compartilhada sequencialmente consistente, definimos duas medidas fundamentais (pp. 628–631):</p>
        <ol>
          <li><strong>Trabalho ($T_1$):</strong> O tempo total para executar toda a computação em <strong>um único processador</strong> ($P = 1$), isto é, a soma dos tempos de todas as fibras em $V$. Para <code>P-FIB(n)</code>, o trabalho satisfaz a mesma recorrência da projeção serial:
            $$T_1(n) = T_1(n-1) + T_1(n-2) + \\Theta(1) = \\mathbf{\\Theta(\\phi^n)}, \\quad \\text{onde } \\phi = \\frac{1+\\sqrt{5}}{2}.$$
          </li>
          <li><strong>Duração / Span / Caminho Crítico ($T_\\infty$):</strong> O tempo mais longo para executar as fibras ao longo de qualquer caminho dirigido no GAD $G$ (isto é, o tempo de execução com um número ilimitado $\\infty$ de processadores). Como fibras em série somam seus tempos e subcomputações em paralelo contribuem com o <strong>máximo</strong> de suas durações, em <code>P-FIB(n)</code> as chamadas <code>P-FIB(n-1)</code> e <code>P-FIB(n-2)</code> ocorrem logicamente em paralelo, resultando em:
            $$T_\\infty(n) = \\max\\big(T_\\infty(n-1), \\, T_\\infty(n-2)\\big) + \\Theta(1) = T_\\infty(n-1) + \\Theta(1) = \\mathbf{\\Theta(n)}.$$
          </li>
        </ol>

        <h4>1.2 Leis do Trabalho e da Duração, Aceleração, Paralelismo e Escalonamento Guloso (Teorema 27.1)</h4>
        <p>Seja $T_P$ o tempo de execução da computação em $P$ processadores. O trabalho $T_1$ e a duração $T_\\infty$ fornecem dois limites inferiores universais (Equações 27.2 e 27.3, p. 629):</p>
        <ul>
          <li><strong>Lei do Trabalho:</strong> Em uma etapa de tempo, $P$ processadores podem realizar no máximo $P$ unidades de trabalho; logo, em tempo $T_P$ realizam no máximo $P \\cdot T_P \\ge T_1$:
            $$\\mathbf{T_P \\ge \\frac{T_1}{P}}.$$
          </li>
          <li><strong>Lei da Duração:</strong> Um computador de $P$ processadores não pode ser mais rápido do que uma máquina com número ilimitado ($\\infty$) de processadores:
            $$\\mathbf{T_P \\ge T_\\infty}.$$
          </li>
        </ul>
        <p>Definimos a <strong>aceleração</strong> (<em>speedup</em>) em $P$ processadores como a razão $T_1 / T_P$. Pela Lei do Trabalho, $T_1 / T_P \\le P$: quando $T_1 / T_P = \\Theta(P)$, temos <strong>aceleração linear</strong>; e quando $T_1 / T_P = P$, temos <strong>aceleração linear perfeita</strong>. A razão entre o trabalho e a duração define o <strong>paralelismo</strong> da computação:</p>
        $$\\text{Paralelismo} = \\mathbf{\\frac{T_1}{T_\\infty}}.$$
        <p>O paralelismo $T_1 / T_\\infty$ tem três interpretações fundamentais: (1) é a quantidade média de trabalho disponível por etapa ao longo do caminho crítico; (2) é a aceleração máxima possível em qualquer número de processadores (pois $T_1 / T_P \\le T_1 / T_\\infty$); e (3) é o limite de quantos processadores podem ser utilizados com eficiência linear.</p>

        <p>Um <strong>escalonador guloso</strong> (p. 631) atribui tantas fibras prontas a processadores quantas for possível em cada etapa de tempo, nunca deixando um processador ocioso se houver uma fibra pronta para executar: uma etapa é uma <strong>etapa completa</strong> se pelo menos $P$ fibras estão prontas (todos os $P$ processadores executam trabalho), e uma <strong>etapa incompleta</strong> se estritamente menos de $P$ fibras estão prontas (todas as fibras prontas são executadas).</p>

        <div class="Pseudocode-block" style="background: rgba(16, 185, 129, 0.07); border-left: 4px solid #10b981; padding: 14px; margin: 14px 0;">
          <strong>Teorema 27.1 (Limite de Escalonamento Guloso — Graham / Brent, p. 631):</strong> Em um computador paralelo ideal com $P$ processadores, qualquer escalonador guloso executa uma computação multithread com trabalho $T_1$ e duração $T_\\infty$ no tempo:
          $$\\mathbf{T_P \\le \\frac{T_1}{P} + T_\\infty}.$$
          <p style="margin-top:8px;"><strong>Demonstração:</strong></p>
          <ol>
            <li>Considere primeiro o número de <strong>etapas completas</strong>. Em cada etapa completa, todos os $P$ processadores realizam trabalho, consumindo $P$ unidades de trabalho. Se houvesse mais do que $\\lfloor T_1 / P \\rfloor$ etapas completas, o trabalho total realizado excederia $P \\cdot (\\lfloor T_1 / P \\rfloor + 1) > T_1$, uma contradição. Logo, há no máximo $\\lfloor T_1 / P \\rfloor$ etapas completas.</li>
            <li>Considere agora uma <strong>etapa incompleta</strong>. Seja $G'$ o subgrafo induzido de $G$ das fibras que ainda não foram executadas no início dessa etapa incompleta, e seja $u$ o vértice inicial de qualquer caminho mais longo (caminho crítico) em $G'$. Como $u$ inicia um caminho de comprimento máximo em $G'$, $u$ tem grau de entrada zero em $G'$ — ou seja, todos os seus predecessores em $G$ já foram executados, logo $u$ está <strong>pronta</strong> para ser executada! Como a etapa é incompleta, o escalonador guloso executa <em>todas</em> as fibras prontas nessa etapa, incluindo a primeira fibra de <em>todo</em> caminho mais longo de $G'$. Portanto, cada etapa incompleta reduz estritamente em $1$ a duração de $G'$! Logo, há no máximo $T_\\infty$ etapas incompletas.</li>
            <li>Somando os dois tipos de etapas, $T_P \\le \\lfloor T_1 / P \\rfloor + T_\\infty \\le T_1 / P + T_\\infty$. $\\blacksquare$</li>
          </ol>
        </div>

        <p><strong>Corolário Prático (Folga Paralela / Parallel Slackness):</strong> Quando o paralelismo $T_1 / T_\\infty$ é muito maior que o número de processadores $P$ — isto é, existe uma grande <strong>folga paralela</strong> $(T_1 / T_\\infty) / P = T_1 / (P T_\\infty) \\gg 1$ —, então $T_\\infty \\ll T_1 / P$, e o Teorema 27.1 garante $T_P \\le T_1 / P + T_\\infty \\approx T_1 / P$, obtendo <strong>aceleração linear quase perfeita</strong>!</p>

        <h4>1.3 Corridas de Determinismo (*Determinacy Races*)</h4>
        <p>Uma computação multithread é <strong>determinística</strong> se faz sempre a mesma coisa com a mesma entrada, independentemente de como as instruções são escalonadas nos processadores, e <strong>não determinística</strong> caso contrário. Uma <strong>corrida de determinismo</strong> (p. 635) ocorre quando duas instruções logicamente em paralelo acessam a <strong>mesma posição de memória</strong> e pelo menos uma delas executa uma <strong>escrita</strong>:</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">RACE-EXAMPLE()</span>
              <span>[ Exemplo de Corrida de Determinismo (p. 635) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">x = 0</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">parallel</span> <span class="kw">para</span> i = 1 até 2</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   x = x + 1</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">imprima</span> x</span></div>
            </div>
          </div>

        <p>Embora se pudesse esperar que <code>RACE-EXAMPLE</code> imprimisse $2$, ele pode imprimir $1$! Isso porque <code>x = x + 1</code> compila em três instruções de máquina: (1) ler $x$ da memória para um registrador $r$; (2) incrementar $r$; (3) escrever $r$ de volta em $x$. Se os dois processadores lerem $x = 0$ antes de qualquer um escrever de volta, ambos incrementarão seus registradores para $1$ e escreverão $1$ em $x$! Todos os algoritmos deste capítulo são projetados para serem <strong>livres de corridas de determinismo</strong> (todas as fibras em paralelo operam sobre variáveis independentes ou apenas leem dados compartilhados).</p>

        <h3>2. Seção 27.2 — Multiplicação de Matrizes Multithread (pp. 638–643)</h3>
        <p>Podemos paralelizar a multiplicação de duas matrizes $n \\times n$, $C = A \\cdot B$, de duas maneiras elegantes:</p>
        <ol>
          <li><strong>Via Laços Paralelos (<code>P-SQUARE-MATRIX-MULTIPLY</code>, p. 639):</strong> Transformando os dois laços externos ($i = 1..n$ e $j = 1..n$) em laços <code>parallel para</code> e mantendo o laço interno $k = 1..n$ serial (para evitar corrida de determinismo ao acumular $c_{ij} = c_{ij} + a_{ik} b_{kj}$!), obtemos trabalho $T_1(n) = \\Theta(n^3)$ e duração $T_\\infty(n) = \\Theta(\\lg n) + \\Theta(\\lg n) + \\Theta(n) = \\mathbf{\\Theta(n)}$, com paralelismo $\\Theta(n^3)/\\Theta(n) = \\mathbf{\\Theta(n^2)}$.</li>
          <li><strong>Via Divisão e Conquista Recursiva (<code>P-MATRIX-MULTIPLY-RECURSIVE</code>, p. 640):</strong> Particionando $A, B, C$ em quatro submatrizes $(n/2) \\times (n/2)$, geramos (<code>spawn</code>) as <strong>$8$ multiplicações recursivas em paralelo</strong> em submatrizes $C_{ij}$ e uma matriz temporária $T_{ij}$, damos <code>sync</code>, e depois somamos $C_{ij} = C_{ij} + T_{ij}$ com dois laços <code>parallel para</code> aninhados (que levam duração $\\Theta(\\lg n)$ e trabalho $\\Theta(n^2)$):
            <ul>
              <li><strong>Trabalho:</strong> $M_1(n) = 8 M_1(n/2) + \\Theta(n^2) = \\mathbf{\\Theta(n^3)}$ (pelo Caso 1 do Teorema Mestre);</li>
              <li><strong>Duração:</strong> Como as $8$ chamadas recursivas executam em paralelo, a duração toma o máximo de uma única chamada mais a duração $\\Theta(\\lg n)$ da adição paralela:
                $$M_\\infty(n) = M_\\infty(n/2) + \\Theta(\\lg n) = \\mathbf{\\Theta(\\lg^2 n)}$$
                (pelo Exercício 4.6-2 do Método Mestre), atingindo um paralelismo extraordinário de $\\mathbf{\\Theta(n^3 / \\lg^2 n)}$!</li>
              <li><strong>Multithreading no Algoritmo de Strassen (p. 642):</strong> Paralelizando as criações das $10$ matrizes auxiliares $S_1..S_{10}$, as $7$ multiplicações recursivas $P_1..P_7$ (via <code>spawn</code>) e as adições finais, obtemos trabalho $T_1(n) = \\Theta(n^{\\lg 7}) = O(n^{2,81})$ e duração $T_\\infty(n) = \\Theta(\\lg^2 n)$.</li>
            </ul>
          </li>
        </ol>

        <h3>3. Seção 27.3 — Ordenação por Intercalação Multithread: De <code>MERGE-SORT-MT</code> a <code>P-MERGE-SORT</code> (pp. 644–652)</h3>
        <p>A tentativa mais direta de paralelizar o <code>MERGE-SORT</code> consiste em gerar (<code>spawn</code>) a primeira chamada recursiva, chamar a segunda em paralelo, sincronizar (<code>sync</code>) e então executar o procedimento <code>MERGE</code> serial padrão (<code>MERGE-SORT-MT</code>, p. 644):</p>
        <ul>
          <li><strong>Trabalho de <code>MERGE-SORT-MT</code>:</strong> $T'_1(n) = 2 T'_1(n/2) + \\Theta(n) = \\Theta(n \\lg n)$.</li>
          <li><strong>Duração de <code>MERGE-SORT-MT</code>:</strong> Como as duas chamadas recursivas ocorrem em paralelo mas <code>MERGE</code> continua serial em $\\Theta(n)$, temos:
            $$T'_\\infty(n) = T'_\\infty(n/2) + \\Theta(n) = \\mathbf{\\Theta(n)} \\quad (\\text{Caso 3 do Teorema Mestre}).$$
          </li>
          <li><strong>O Gargalo do <code>MERGE</code> Serial:</strong> O paralelismo de <code>MERGE-SORT-MT</code> é apenas $T'_1(n) / T'_\\infty(n) = \\Theta(n \\lg n) / \\Theta(n) = \\mathbf{\\Theta(\\lg n)}$! Para ordenar $n = 10^7$ elementos, $\\lg n \\approx 23$: esse algoritmo não consegue aproveitar com eficiência sequer algumas dezenas de processadores!</li>
        </ul>

        <h4>3.1 Dividir e Conquistar na Própria Intercalação: O Algoritmo <code>P-MERGE</code></h4>
        <p>Para quebrar a barreira $\\Theta(n)$ da intercalação, projetamos um procedimento de intercalação multithread de divisão e conquista <code>P-MERGE(T, p₁, r₁, p₂, r₂, A, p₃)</code> (Figura 27.5, p. 646) que intercala dois subarranjos já ordenados $T[p_1 .. r_1]$ (de tamanho $n_1 = r_1 - p_1 + 1$) e $T[p_2 .. r_2]$ (de tamanho $n_2 = r_2 - p_2 + 1$) dentro do subarranjo de destino $A[p_3 .. r_3]$ (de tamanho $n = n_1 + n_2$):</p>
        <ol>
          <li>Garantimos (trocando os intervalos se necessário) que o primeiro subarranjo seja o maior: $n_1 \\ge n_2$. Se $n_1 = 0$, ambos são vazios e retornamos imediatamente.</li>
          <li>Tomamos o <strong>elemento mediano</strong> do maior subarranjo: $q_1 = \\lfloor (p_1 + r_1)/2 \\rfloor$ e $x = T[q_1]$.</li>
          <li>Usamos <strong>busca binária</strong> <code>BINARY-SEARCH(x, T, p₂, r₂)</code> em $\\Theta(\\lg n_2) = O(\\lg n)$ para encontrar o índice $q_2$ no segundo subarranjo tal que todos os elementos em $T[p_2 .. q_2 - 1]$ sejam $\\le x$ e todos em $T[q_2 .. r_2]$ sejam $\\ge x$.</li>
          <li>Calculamos a posição exata $q_3$ onde $x$ deve ser gravado na saída:
            $$q_3 = p_3 + (q_1 - p_1) + (q_2 - p_2), \\quad \\text{e colocamos } A[q_3] = x.$$
          </li>
          <li>Agora dividimos a intercalação em <strong>duas intercalações independentes em paralelo</strong>:
            <ul>
              <li>Geramos via <code>spawn</code> a intercalação dos elementos menores: $T[p_1 .. q_1 - 1]$ com $T[p_2 .. q_2 - 1]$ gravando em $A[p_3 .. q_3 - 1]$;</li>
              <li>Chamamos recursivamente a intercalação dos elementos maiores: $T[q_1 + 1 .. r_1]$ com $T[q_2 .. r_2]$ gravando em $A[q_3 + 1 .. r_3]$;</li>
              <li>Executamos <code>sync</code>.</li>
            </ul>
          </li>
        </ol>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">P-MERGE(T, p₁, r₁, p₂, r₂, A, p₃)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">n₁ = r₁ - p₁ + 1</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">n₂ = r₂ - p₂ + 1</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">se</span> n₁ < n₂                      <span class="cmt">// garante que n₁ ≥ n₂</span></span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   troque p₁ com p₂</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">   troque r₁ com r₂</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">   troque n₁ com n₂</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">se</span> n₁ == 0                      <span class="cmt">// ambos vazios?</span></span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">   <span class="kw">retorne</span></span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">q₁ = ⌊(p₁ + r₁) / 2⌋</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">q₂ = BINARY-SEARCH(T[q₁], T, p₂, r₂)</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">q₃ = p₃ + (q₁ - p₁) + (q₂ - p₂)</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">A[q₃] = T[q₁]</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content"><span class="kw">spawn</span> P-MERGE(T, p₁, q₁ - 1, p₂, q₂ - 1, A, p₃)</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">P-MERGE(T, q₁ + 1, r₁, q₂, r₂, A, q₃ + 1)</span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content"><span class="kw">sync</span></span></div>
            </div>
          </div>

        <h4>3.2 Análise Rigorosa da Duração e do Trabalho de <code>P-MERGE</code> e <code>P-MERGE-SORT</code></h4>
        <ul>
          <li><strong>Redução de Tamanho por Chamada Recursiva (Fator $3/4$):</strong> Como $n_1 \\ge n_2$, temos $n_2 \\le n / 2$. Na divisão de $T[p_1 .. r_1]$ ao meio em $q_1$, cada metade de $T[p_1 .. r_1]$ tem no máximo $\\lfloor n_1 / 2 \\rfloor$ elementos. Mesmo no pior caso em que <em>todos</em> os $n_2$ elementos de $T[p_2 .. r_2]$ caiam do mesmo lado de $T[q_1]$, o número total de elementos em qualquer chamada recursiva de <code>P-MERGE</code> é no máximo:
            $$\\lfloor n_1 / 2 \\rfloor + n_2 \\le \\frac{n_1}{2} + \\frac{n_2}{2} + \\frac{n_2}{2} = \\frac{n_1 + n_2}{2} + \\frac{n_2}{2} \\le \\frac{n}{2} + \\frac{n}{4} = \\mathbf{\\frac{3n}{4}}.$$
          </li>
          <li><strong>Duração de <code>P-MERGE</code>:</strong> Em cada nível, a busca binária custa $\\Theta(\\lg n)$ e reduz o tamanho máximo a no máximo $3n/4$:
            $$\\text{PM}_\\infty(n) = \\text{PM}_\\infty(3n/4) + \\Theta(\\lg n) = \\mathbf{\\Theta(\\lg^2 n)}.$$
          </li>
          <li><strong>Trabalho de <code>P-MERGE</code>:</strong> Para $0 < \\alpha \\le 1$ a fração de $T[p_2 .. r_2]$ na primeira chamada, a recorrência do trabalho é $\\text{PM}_1(n) = \\text{PM}_1(\\alpha n) + \\text{PM}_1((1-\\alpha)n) + O(\\lg n)$ com $1/4 \\le \\alpha \\le 3/4$. Pelo método de substituição (provando $\\text{PM}_1(n) \\le c_1 n - c_2 \\lg n$, pp. 648–649), o trabalho permanece estritamente linear:
            $$\\text{PM}_1(n) = \\mathbf{\\Theta(n)}.$$
          </li>
          <li><strong>Análise Final de <code>P-MERGE-SORT(A, p, r, B, s)</code> (pp. 650–651):</strong> Substituindo <code>MERGE</code> por <code>P-MERGE</code>:
            <ul>
              <li><strong>Trabalho Total:</strong> $T_1(n) = 2 T_1(n/2) + \\Theta(n) = \\mathbf{\\Theta(n \\lg n)}$ (ótimo assintótico, idêntico ao serial!);</li>
              <li><strong>Duração Total:</strong> $T_\\infty(n) = T_\\infty(n/2) + \\Theta(\\lg^2 n) = \\mathbf{\\Theta(\\lg^3 n)}$ (pelo Exercício 4.6-2 com $k=2$);</li>
              <li><strong>Paralelismo de <code>P-MERGE-SORT</code>:</strong>
                $$\\frac{T_1(n)}{T_\\infty(n)} = \\frac{\\Theta(n \\lg n)}{\\Theta(\\lg^3 n)} = \\mathbf{\\Theta\\!\\left(\\frac{n}{\\lg^2 n}\\right)}.$$
              </li>
            </ul>
          </li>
        </ul>

        <div id="workbench-mod13-mount"></div>
      `
    },

    /* ======================================================================
       UNIDADE 13.2 — APÊNDICE D E CAPÍTULO 28 (SEÇÃO 28.1, pp. 978–990 e 653–665)
       ====================================================================== */
    {
      id: "u13-2",
      code: "UNIDADE 13.2 • APÊNDICE D E CAP. 28 (SEÇÃO 28.1)",
      pages: "pp. 978–990 e pp. 653–665",
      title: "Apêndice D e Seção 28.1 — Propriedades de Matrizes e Resolução de Sistemas de Equações Lineares via Decomposição LU e LUP (LUP-SOLVE, LU-DECOMPOSITION, LUP-DECOMPOSITION)",
      content: `
        <p>Antes de estudarmos os algoritmos matriciais do Capítulo 28, consolidamos as definições e teoremas fundamentais do <strong>Apêndice D (Matrizes, pp. 978–990)</strong>.</p>

        <h3>1. Apêndice D — Matrizes, Posto, Determinantes e Matrizes Positivas Definidas (pp. 978–990)</h3>
        <ul>
          <li><strong>Transposta, Simetria e Matrizes Especiais (Seção D.1):</strong> Dada uma matriz $A = (a_{ij})$ de dimensão $m \\times n$, sua <strong>transposta</strong> $A^{\\text{T}} = (a_{ji})$ tem dimensão $n \\times m$ e satisfaz $(AB)^{\\text{T}} = B^{\\text{T}} A^{\\text{T}}$. Uma matriz quadrada $A$ é <strong>simétrica</strong> se $A = A^{\\text{T}}$. Uma matriz $L = (l_{ij})$ é <strong>triangular inferior</strong> se $l_{ij} = 0$ para todo $i < j$ (e <strong>triangular inferior unitária</strong> se, além disso, $l_{ii} = 1$ para todo $i$). Uma matriz $U = (u_{ij})$ é <strong>triangular superior</strong> se $u_{ij} = 0$ para todo $i > j$.</li>
          <li><strong>Matrizes de Permutação $P$:</strong> Uma matriz $P$ ($n \\times n$) é uma <strong>matriz de permutação</strong> se possui exatamente um $1$ em cada linha e em cada coluna, e $0$ nas demais posições. Multiplicar $PA$ permuta as <strong>linhas</strong> de $A$, enquanto $AP$ permuta as <strong>colunas</strong> de $A$ (Exercício D.1-4). Toda matriz de permutação é ortogonal: $P^{-1} = P^{\\text{T}}$, e o produto de duas matrizes de permutação é outra matriz de permutação.</li>
          <li><strong>Inversa, Dependência Linear, Posto e Vetores Anuladores (Seção D.2):</strong>
            <ul>
              <li>Uma matriz $A$ ($n \\times n$) é <strong>não singular (inversível)</strong> se existe $A^{-1}$ tal que $A A^{-1} = I_n = A^{-1} A$; caso contrário, é <strong>singular</strong>. Quando existe, a inversa é única e satisfaz $(AB)^{-1} = B^{-1} A^{-1}$ e $(A^{-1})^{\\text{T}} = (A^{\\text{T}})^{-1}$.</li>
              <li>O <strong>posto</strong> (<em>rank</em>) de uma matriz $A$ ($m \\times n$) é o tamanho do maior conjunto de colunas linearmente independentes (igual ao tamanho do maior conjunto de linhas linearmente independentes), situado em $[0, \\min(m, n)]$.</li>
              <li>Um vetor não nulo $x \\neq 0$ tal que $Ax = 0$ é chamado de <strong>vetor anulador</strong> (<em>null vector</em>) de $A$.</li>
              <li><strong>Teoremas D.1, D.2 e Corolário D.3 (p. 985):</strong> Uma matriz $A$ ($m \\times n$) tem <em>posto coluna completo</em> ($n$) se e somente se não possui vetor anulador ($Ax = 0 \\implies x = 0$). Em particular, uma matriz quadrada $n \\times n$ é <strong>não singular</strong> $\\iff$ tem <strong>posto completo $n$</strong> $\\iff$ <strong>não tem vetor anulador</strong> $\\iff$ $\\mathbf{\\det(A) \\neq 0}$ (<strong>Teorema D.5</strong>).</li>
            </ul>
          </li>
          <li><strong>Determinantes (Teorema D.4, p. 986):</strong> O determinante $\\det(A) = \\sum_{j=1}^n (-1)^{i+j} a_{ij} \\det(A_{[ij]})$ satisfaz: (1) somar uma linha (ou coluna) a outra <strong>não altera</strong> $\\det(A)$; (2) trocar duas linhas (ou colunas) <strong>multiplica $\\det(A)$ por $-1$</strong>; (3) $\\det(A) = \\det(A^{\\text{T}})$ e $\\det(AB) = \\det(A)\\det(B)$; (4) o determinante de uma matriz triangular $L$ ou $U$ é simplesmente o <strong>produto dos elementos de sua diagonal principal</strong> (Exercício D.2-2).</li>
          <li><strong>Matrizes Positivas Definidas (Teorema D.6, p. 987):</strong> Uma matriz $A$ ($n \\times n$) é <strong>positiva definida</strong> se:
            $$\\mathbf{x^{\\text{T}} A x > 0 \\quad \\text{para todo vetor } x \\in \\mathbb{R}^n \\setminus \\{0\\}}.$$
            Pelo <strong>Teorema D.6</strong>, se $A$ ($m \\times n$) tem posto coluna completo ($n$), então $A^{\\text{T}} A$ é sempre positiva definida, pois $x^{\\text{T}}(A^{\\text{T}}A)x = (Ax)^{\\text{T}}(Ax) = \\|Ax\\|^2 > 0$ para todo $x \\neq 0$.</li>
        </ul>

        <h3>2. Seção 28.1 — Resolução de Sistemas de Equações Lineares via Decomposição LUP (pp. 653–665)</h3>
        <p>Queremos resolver um sistema linear de $n$ equações e $n$ incógnitas $Ax = b$, onde $A$ é não singular. Quando precisamos resolver sistemas com a <em>mesma</em> matriz $A$ para vários vetores $b^{(1)}, b^{(2)}, \\dots, b^{(k)}$ (ou calcular a inversa de $A$), o método ideal é a <strong>Decomposição LUP</strong>:</p>
        $$\\mathbf{PA = LU},$$
        <p>onde $P$ é uma matriz de permutação $n \\times n$, $L$ é uma matriz triangular inferior unitária ($l_{ii} = 1$) e $U$ é uma matriz triangular superior. Multiplicando $Ax = b$ à esquerda por $P$, temos $PAx = Pb \\iff L(Ux) = Pb$. Definindo o vetor intermediário $y = Ux$, resolvemos o sistema em duas etapas triangulares $\\Theta(n^2)$:</p>
        <ol>
          <li><strong>Substituição Progressiva (<em>Forward Substitution</em>):</strong> Resolver $Ly = Pb$ de cima para baixo ($i = 1, 2, \\dots, n$):
            $$y_i = b_{\\pi[i]} - \\sum_{j=1}^{i-1} l_{ij} y_j,$$
            onde representamos compactamente a matriz de permutação $P$ por um vetor $\\pi[1..n]$ tal que $P_{i, \\pi[i]} = 1$ (logo o $i$-ésimo elemento de $Pb$ é $b_{\\pi[i]}$).</li>
          <li><strong>Substituição Regressiva (<em>Back Substitution</em>):</strong> Resolver $Ux = y$ de baixo para cima ($i = n, n-1, \\dots, 1$):
            $$x_i = \\frac{y_i - \\sum_{j=i+1}^{n} u_{ij} x_j}{u_{ii}}.$$
          </li>
        </ol>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">LUP-SOLVE(L, U, π, b)</span>
              <span>[ Complexidade Θ(n²) (p. 656) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">n = L.linhas</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">seja</span> x um novo vetor de comprimento n</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">para</span> i = 1 até n                          <span class="cmt">// substituição progressiva: Ly = Pb</span></span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   y_i = b_{π[i]} - ∑_{j=1}^{i-1} l_{ij} y_j</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">para</span> i = n decrescendo até 1              <span class="cmt">// substituição regressiva: Ux = y</span></span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">   x_i = (y_i - ∑_{j=i+1}^{n} u_{ij} x_j) / u_{ii}</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">retorne</span> x</span></div>
            </div>
          </div>

        <h4>2.1 Complemento de Schur e Decomposição LU Sem Pivoteamento (<code>LU-DECOMPOSITION</code>)</h4>
        <p>Suponha inicialmente que $P = I_n$ ($A = LU$) e que $a_{11} \\neq 0$. Particionamos $A$ em blocos separando a primeira linha e a primeira coluna (Equação 28.8, p. 657):</p>
        $$A = \\begin{pmatrix} a_{11} & w^{\\text{T}} \\\\ v & A' \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ v/a_{11} & I_{n-1} \\end{pmatrix} \\begin{pmatrix} a_{11} & w^{\\text{T}} \\\\ 0 & A' - \\frac{v w^{\\text{T}}}{a_{11}} \\end{pmatrix}.$$
        <p>A matriz $(n-1) \\times (n-1)$ dada por $S = A' - v w^{\\text{T}} / a_{11}$ é chamada de <strong>complemento de Schur</strong> de $A$ com relação a $a_{11}$. Se $A$ é não singular e $a_{11} \\neq 0$, o complemento de Schur também é não singular! Fatorando recursivamente $A' - v w^{\\text{T}} / a_{11} = L' U'$, obtemos:</p>
        $$L = \\begin{pmatrix} 1 & 0 \\\\ v/a_{11} & L' \\end{pmatrix}, \\qquad U = \\begin{pmatrix} a_{11} & w^{\\text{T}} \\\\ 0 & U' \\end{pmatrix}.$$
        <p>Transformando essa recursão de cauda em um laço iterativo para $k = 1..n$, obtemos <code>LU-DECOMPOSITION(A)</code> em tempo $\\Theta(n^3)$ (p. 659):</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">LU-DECOMPOSITION(A)</span>
              <span>[ Complexidade Θ(n³) (p. 659) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">n = A.linhas</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">seja</span> L uma nova matriz n × n (inicializada com 1s na diagonal e 0s acima)</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">seja</span> U uma nova matriz n × n (inicializada com 0s abaixo da diagonal)</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">para</span> k = 1 até n</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">   u_{kk} = a_{kk}                       <span class="cmt">// pivô</span></span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">   <span class="kw">para</span> i = k + 1 até n</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">       l_{ik} = a_{ik} / u_{kk}          <span class="cmt">// calcula coluna k de L (v / a_{kk})</span></span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">       u_{ki} = a_{ki}                   <span class="cmt">// copia linha k de U (w^T)</span></span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">   <span class="kw">para</span> i = k + 1 até n                  <span class="cmt">// atualiza o complemento de Schur</span></span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">      <span class="kw">para</span> j = k + 1 até n</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">          a_{ij} = a_{ij} - l_{ik} u_{kj}</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content"><span class="kw">retorne</span> L e U</span></div>
            </div>
          </div>

        <h4>2.2 Por Que Precisamos de Pivoteamento: <code>LUP-DECOMPOSITION</code> em $\\Theta(n^3)$</h4>
        <p>Mesmo quando $A$ é perfeitamente inversível — por exemplo, $A = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$ —, <code>LU-DECOMPOSITION</code> falha imediatamente se o pivô $a_{kk} = 0$ (divisão por zero). Além disso, em aritmética de ponto flutuante finita, dividir por um pivô $|a_{kk}|$ muito próximo de zero amplifica erros de arredondamento catastroficamente (<strong>instabilidade numérica</strong>).</p>
        <p>O procedimento <code>LUP-DECOMPOSITION(A)</code> (p. 661) resolve ambos os problemas usando <strong>pivoteamento parcial</strong>: na etapa $k$, inspeciona a $k$-ésima coluna nas linhas $i = k, k+1, \\dots, n$, localiza a linha $k'$ que possui o <strong>maior valor absoluto $|a_{ik}|$</strong>, verifica se esse máximo é zero (caso em que $A$ é singular e emite erro), e <strong>troca a linha $k$ inteira com a linha $k'$</strong> (bem como $\\pi[k] \\leftrightarrow \\pi[k']$). Além disso, armazena $L$ e $U$ <strong>no próprio lugar (in-place)</strong> dentro da matriz $A$ (onde ao final $l_{ij} = a_{ij}$ para $i > j$, $l_{ii} = 1$, e $u_{ij} = a_{ij}$ para $i \\le j$):</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">LUP-DECOMPOSITION(A)</span>
              <span>[ Com Pivoteamento Parcial in-place em Θ(n³) (p. 661) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">n = A.linhas</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">seja</span> π[1 .. n] um novo arranjo</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">para</span> i = 1 até n</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   π[i] = i                              <span class="cmt">// inicializa P = I_n</span></span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">para</span> k = 1 até n</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">   p = 0</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">   <span class="kw">para</span> i = k até n                      <span class="cmt">// busca pivô de maior módulo na coluna k</span></span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">       <span class="kw">se</span> |a_{ik}| > p</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">           p = |a_{ik}|</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">          k' = i</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">  <span class="kw">se</span> p == 0</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">      erro "matriz singular"</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">  troque π[k] com π[k']</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">  <span class="kw">para</span> i = 1 até n                      <span class="cmt">// troca as linhas inteiras k e k' (incluindo parte já calculada de L!)</span></span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content">      troque a_{ki} com a_{k'i}</span></div>
              <div class="code-line"><span class="line-num">16</span><span class="line-content">  <span class="kw">para</span> i = k + 1 até n</span></div>
              <div class="code-line"><span class="line-num">17</span><span class="line-content">      a_{ik} = a_{ik} / a_{kk}          <span class="cmt">// armazena l_{ik} no lugar de a_{ik}</span></span></div>
              <div class="code-line"><span class="line-num">18</span><span class="line-content">      <span class="kw">para</span> j = k + 1 até n</span></div>
              <div class="code-line"><span class="line-num">19</span><span class="line-content">          a_{ij} = a_{ij} - a_{ik} a_{kj} <span class="cmt">// atualiza o complemento de Schur</span></span></div>
            </div>
          </div>

        <p><strong>Custo Computacional:</strong> <code>LUP-DECOMPOSITION</code> executa em tempo $\\mathbf{\\Theta(n^3)}$; uma vez obtida a fatoração, cada chamada a <code>LUP-SOLVE</code> resolve $Ax = b$ em apenas $\\mathbf{\\Theta(n^2)}$!</p>
      `
    },

    /* ======================================================================
       UNIDADE 13.3 — CAPÍTULO 28 (SEÇÕES 28.2 E 28.3, pp. 665–675)
       ====================================================================== */
    {
      id: "u13-3",
      code: "UNIDADE 13.3 • CAP. 28 (SEÇÕES 28.2 E 28.3)",
      pages: "pp. 665–675",
      title: "28.2 e 28.3 Inversão de Matrizes em Θ(n³), Equivalência com Multiplicação (Teorema 28.1 / 28.2), Matrizes Simétricas Positivas Definidas e Aproximação por Mínimos Quadrados",
      content: `
        <p>As <strong>Seções 28.2 e 28.3</strong> (pp. 665–675) aprofundam três questões teóricas e aplicadas fundamentais: (1) como inverter matrizes e por que inverter matrizes tem exatamente a mesma complexidade assintótica de multiplicar matrizes; (2) por que matrizes simétricas positivas definidas nunca precisam de pivoteamento; e (3) como ajustar curvas a dados ruidosos pelo método dos mínimos quadrados.</p>

        <h3>1. Seção 28.2 — Inversão de Matrizes e Equivalência Assintótica com Multiplicação (pp. 665–669)</h3>
        <p>Para calcular a inversa $X = A^{-1}$ de uma matriz não singular $A$ ($n \\times n$) na prática usando decomposição LUP:</p>
        <ul>
          <li>Observamos que $AX = I_n$ equivale a $n$ sistemas lineares independentes $A X_i = e_i$ para $i = 1, 2, \\dots, n$, onde $X_i$ é a $i$-ésima coluna de $A^{-1}$ e $e_i$ é a $i$-ésima coluna da matriz identidade $I_n$.</li>
          <li>Executamos <strong>uma única vez</strong> <code>LUP-DECOMPOSITION(A)</code> em $\\Theta(n^3)$ e, em seguida, chamamos $n$ vezes <code>LUP-SOLVE(L, U, π, e_i)</code> (cada uma em $\\Theta(n^2)$), obtendo todas as $n$ colunas de $A^{-1}$ em tempo total $\\Theta(n^3) + n \\cdot \\Theta(n^2) = \\mathbf{\\Theta(n^3)}$.</li>
        </ul>

        <h4>1.1 Equivalência Assintótica entre Multiplicação $M(n)$ e Inversão $I(n)$</h4>
        <p>Sabemos pelo algoritmo de Strassen (Cap. 4) que é possível multiplicar matrizes em tempo subcúbico $M(n) = O(n^{\\lg 7})$. Os <strong>Teoremas 28.1 e 28.2</strong> provam que <em>inverter matrizes não é mais difícil nem mais fácil do que multiplicar matrizes</em>:</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 28.2 • (MULTIPLICAÇÃO VIA INVERSÃO, P. 666): ]</span>
          Se podemos inverter uma matriz $n \\times n$ no tempo $I(n)$ (onde $I(n) = \\Omega(n^2)$ é regular: $I(3n) = O(I(n))$), então podemos multiplicar duas matrizes $n \\times n$, $A$ e $B$, no tempo $O(I(n))$.
          <p style="margin-top:8px;"><strong>Demonstração Construtivo-Algébrica:</strong> Construímos uma matriz triangular inferior em blocos $D$ de dimensão $3n \\times 3n$:</p>
          $$D = \\begin{pmatrix} I_n & 0 & 0 \\\\ A & I_n & 0 \\\\ 0 & B & I_n \\end{pmatrix} \\implies D^{-1} = \\begin{pmatrix} I_n & 0 & 0 \\\\ -A & I_n & 0 \\\\ \\mathbf{AB} & -B & I_n \\end{pmatrix}.$$
          <p>Verificação imediata: multiplicando $D \\cdot D^{-1}$, o bloco $(3, 1)$ resulta em $0 \\cdot I_n + B \\cdot (-A) + I_n \\cdot (AB) = 0$ (quando colocamos $A$ no bloco $(2,1)$ e $B$ no bloco $(3,2)$, ou colocando $A$ em $(1,2)$ e $B$ em $(2,3)$ na versão triangular superior do livro: $D = \\begin{pmatrix} I_n & A & 0 \\\\ 0 & I_n & B \\\\ 0 & 0 & I_n \\end{pmatrix} \\implies D^{-1} = \\begin{pmatrix} I_n & -A & \\mathbf{AB} \\\\ 0 & I_n & -B \\\\ 0 & 0 & I_n \\end{pmatrix}$!). Como $D$ é sempre inversível ($\\det(D) = 1$) e pode ser construída em $\\Theta(n^2)$, uma única inversão de $D$ no tempo $I(3n) = O(I(n))$ entrega o produto $AB$ diretamente no canto superior direito de $D^{-1}$! $\\blacksquare$</p>
        </div>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 28.1 • (INVERSÃO VIA MULTIPLICAÇÃO EM $O(M(N))$, PP. 666–668): ]</span>
          Se podemos multiplicar duas matrizes $n \\times n$ no tempo $M(n)$ (com $M(n) = \\Omega(n^2)$ satisfazendo regularidade), então podemos inverter qualquer matriz $n \\times n$ real não singular $A$ no tempo $O(M(n))$.
          <p style="margin-top:8px;"><strong>Roteiro da Demonstração por Divisão e Conquista:</strong></p>
          <ol>
            <li>Mesmo que $A$ não seja simétrica nem positiva definida, como $A$ é não singular, pelo <strong>Teorema D.6</strong> a matriz $B = A^{\\text{T}} A$ é <strong>simétrica e positiva definida</strong>, e $A^{-1} = (A^{\\text{T}} A)^{-1} A^{\\text{T}} = B^{-1} A^{\\text{T}}$. Logo, basta saber inverter uma matriz simétrica positiva definida $B$ usando $O(1)$ multiplicações e <strong>duas inversões recursivas de tamanho $n/2$</strong>!</li>
            <li>Particionamos $B$ em quatro submatrizes $(n/2) \\times (n/2)$:
              $$B = \\begin{pmatrix} B_{11} & B_{12}^{\\text{T}} \\\\ B_{12} & B_{22} \\end{pmatrix}, \\quad \\text{com complemento de Schur } S = B_{22} - B_{12} B_{11}^{-1} B_{12}^{\\text{T}}.$$
            </li>
            <li>Pelos <strong>Lemas 28.3 e 28.4</strong>, tanto $B_{11}$ quanto $S$ são simétricas e positivas definidas (portanto inversíveis!). A inversa de $B$ é dada exatamente por (Equação 28.14, p. 668):
              $$B^{-1} = \\begin{pmatrix} B_{11}^{-1} + B_{11}^{-1} B_{12}^{\\text{T}} S^{-1} B_{12} B_{11}^{-1} & -B_{11}^{-1} B_{12}^{\\text{T}} S^{-1} \\\\ -S^{-1} B_{12} B_{11}^{-1} & S^{-1} \\end{pmatrix}.$$
            </li>
            <li>Calculando $B_{11}^{-1}$ recursivamente, depois $C = B_{12} B_{11}^{-1}$, $S = B_{22} - C B_{12}^{\\text{T}}$, depois $S^{-1}$ recursivamente, e por fim $D = S^{-1} C$ e $B_{11}^{-1} + C^{\\text{T}} D$, realizamos apenas <strong>$2$ inversões de tamanho $n/2$</strong> e <strong>$4$ multiplicações de tamanho $n/2$</strong>:
              $$I(n) \\le 2 I(n/2) + 4 M(n/2) + O(n^2) = \\mathbf{O(M(n))}. \\quad \\blacksquare$$
            </li>
          </ol>
        </div>

        <h3>2. Seção 28.3 — Matrizes Simétricas Positivas Definidas e Aproximação por Mínimos Quadrados (pp. 669–675)</h3>
        <p>A Seção 28.3 estabelece primeiro as três propriedades estruturais das matrizes simétricas positivas definidas:</p>
        <ul>
          <li><strong>Lema 28.3 (p. 669):</strong> Qualquer submatriz principal de uma matriz simétrica positiva definida $A$ é simétrica e positiva definida (em particular, $a_{11} > 0$ e toda $k$-ésima submatriz principal líder $A_k$ é positiva definida e não singular).
            <br><em>Prova:</em> Particionando $A = \\begin{pmatrix} B & C^{\\text{T}} \\\\ C & D \\end{pmatrix}$, para qualquer vetor $x \\neq 0$ de dimensão $k$, o vetor estendido $y = (x^{\\text{T}} \\; 0)^{\\text{T}} \\neq 0$ satisfaz $x^{\\text{T}} B x = y^{\\text{T}} A y > 0$.</li>
          <li><strong>Lema 28.4 (Complemento de Schur Positivo Definido, p. 670):</strong> Se $A = \\begin{pmatrix} B & C^{\\text{T}} \\\\ C & D \\end{pmatrix}$ é simétrica e positiva definida, então o complemento de Schur $S = D - C B^{-1} C^{\\text{T}}$ também é simétrico e positivo definido!</li>
          <li><strong>Corolário 28.5 (p. 671):</strong> A decomposição LU de uma matriz simétrica positiva definida <strong>nunca divide por zero</strong> (todos os pivôs diagonais gerados nos sucessivos complementos de Schur são estritamente positivos!).</li>
        </ul>

        <h4>2.1 Ajuste de Curvas pelo Método dos Mínimos Quadrados e Pseudoinversa $A^+$</h4>
        <p>Suponha que tenhamos um conjunto de $m$ pontos de dados experimentais $(x_1, y_1), (x_2, y_2), \\dots, (x_m, y_m)$ e desejemos ajustar uma função linear nos parâmetros $c = (c_1, c_2, \\dots, c_n)^{\\text{T}}$ (com $m \\ge n$):</p>
        $$F(x) = \\sum_{j=1}^{n} c_j f_j(x),$$
        <p>onde as <strong>funções de base</strong> $f_1(x), \\dots, f_n(x)$ são conhecidas (por exemplo, $f_j(x) = x^{j-1}$ para ajustar um polinômio de grau $n - 1$). Formamos a matriz de projeto $A$ ($m \\times n$) com $a_{ij} = f_j(x_i)$:</p>
        $$A = \\begin{pmatrix} f_1(x_1) & f_2(x_1) & \\dots & f_n(x_1) \\\\ f_1(x_2) & f_2(x_2) & \\dots & f_n(x_2) \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ f_1(x_m) & f_2(x_m) & \\dots & f_n(x_m) \\end{pmatrix}.$$
        <p>Como em geral $m > n$ (sistema sobredeterminado), não existe $c$ tal que $Ac = y$ exatamente. Definimos o vetor de erros de aproximação (resíduos) $\\eta = Ac - y$ e buscamos o vetor de coeficientes $c$ que <strong>minimiza a norma euclidiana do erro</strong> $\\|\\eta\\| = \\left(\\sum_{i=1}^m \\eta_i^2\\right)^{1/2}$, ou equivalentemente minimiza $\\|Ac - y\\|^2$:</p>
        $$\\|Ac - y\\|^2 = (Ac - y)^{\\text{T}}(Ac - y) = c^{\\text{T}} A^{\\text{T}} A c - 2 y^{\\text{T}} A c + y^{\\text{T}} y.$$
        <p>Diferenciando em relação a cada $c_k$ e igualando o gradiente a zero ($2 A^{\\text{T}} A c - 2 A^{\\text{T}} y = 0$), obtemos a famosa <strong>equação normal</strong> (Equação 28.18, p. 672):</p>
        $$\\mathbf{A^{\\text{T}} A c = A^{\\text{T}} y}.$$
        <p>Desde que as colunas de $A$ sejam linearmente independentes (posto coluna completo $n$, o que para ajuste polinomial de grau $n-1$ exige apenas pelo menos $n$ valores distintos de $x_i$, conforme o Problema D-1 da matriz de Vandermonde), pelo <strong>Teorema D.6</strong> a matriz $A^{\\text{T}} A$ ($n \\times n$) é simétrica e positiva definida (logo inversível!), e a solução única de mínimos quadrados é:</p>
        $$\\mathbf{c = \\big((A^{\\text{T}} A)^{-1} A^{\\text{T}}\\big) y = A^+ y},$$
        <p>onde $A^+ = (A^{\\text{T}} A)^{-1} A^{\\text{T}}$ é a <strong>pseudoinversa (de Moore–Penrose)</strong> da matriz $A$.</p>
      `
    },

    /* ======================================================================
       UNIDADE 13.4 — CAPÍTULO 29 (SEÇÕES 29.1 E 29.2, pp. 676–694)
       ====================================================================== */
    {
      id: "u13-4",
      code: "UNIDADE 13.4 • CAP. 29 (SEÇÕES 29.1 E 29.2)",
      pages: "pp. 676–694",
      title: "29.1 e 29.2 Programação Linear: Formas Padrão e de Folgas (Slack Form) e Formulação de Problemas em Programas Lineares",
      content: `
        <p>A <strong>Programação Linear (PL)</strong> (Capítulo 29, pp. 676–725) consiste em maximizar ou minimizar uma <strong>função objetivo linear</strong> $f(x_1, \\dots, x_n) = \\sum_{j=1}^n c_j x_j$ sujeita a um conjunto finito de <strong>restrições lineares</strong> (igualdades ou desigualdades lineares não estritas $\\le$ ou $\\ge$). Geometricamente, cada desigualdade linear define um <strong>semiespaço fechado</strong> em $\\mathbb{R}^n$, e a interseção finita desses semiespaços forma a <strong>região viável</strong>: um politopo convexo chamado de <strong>simplex</strong> (ou politopo simplicial). Como a função objetivo também é linear, se a região viável é limitada e não vazia, o valor objetivo ótimo é sempre atingido em um <strong>vértice (ponto extremo)</strong> do politopo!</p>

        <h3>1. Seção 29.1 — Formas Padrão e de Folgas (*Standard and Slack Forms*, pp. 682–689)</h3>
        <h4>1.1 A Forma Padrão (*Standard Form*)</h4>
        <p>Em um programa linear na <strong>forma padrão</strong>, dados $n$ números reais $c_1, \\dots, c_n$, $m$ números reais $b_1, \\dots, b_m$ e $mn$ números reais $a_{ij}$, desejamos (Equações 29.16–29.18, p. 682):</p>
        $$\\begin{aligned}
          \\text{maximizar} \\quad & \\sum_{j=1}^{n} c_j x_j & (\\text{ou } c^{\\text{T}} x) \\\\
          \\text{sujeito a} \\quad & \\sum_{j=1}^{n} a_{ij} x_j \\le b_i & \\text{para } i = 1, 2, \\dots, m \\quad (\\text{ou } Ax \\le b) \\\\
          & x_j \\ge 0 & \\text{para } j = 1, 2, \\dots, n \\quad (\\text{ou } x \\ge 0).
        \\end{aligned}$$

        <h4>1.2 Conversão de Qualquer Programa Linear para a Forma Padrão</h4>
        <p>Um programa linear geral pode falhar em estar na forma padrão por <strong>quatro motivos</strong>. Podemos converter qualquer programa linear em um programa linear <strong>equivalente</strong> na forma padrão aplicando quatro transformações algébricas simples (pp. 683–685):</p>
        <ol>
          <li><strong>A função objetivo é uma minimização em vez de uma maximização:</strong> Multiplicamos os coeficientes da função objetivo por $-1$: minimizar $\\sum_{j=1}^n c_j x_j$ é equivalente a <strong>maximizar $\\sum_{j=1}^n (-c_j) x_j$</strong> (e ao final negamos o valor objetivo ótimo).</li>
          <li><strong>Existem variáveis sem restrição de não negatividade ($x_j \\in \\mathbb{R}$ livre de sinal):</strong> Substituímos cada variável irrestrita $x_j$ pela diferença de <strong>duas novas variáveis não negativas</strong>:
            $$\\mathbf{x_j = x'_j - x''_j, \\quad \\text{com } x'_j \\ge 0 \\text{ e } x''_j \\ge 0}.$$
          </li>
          <li><strong>Existem restrições de igualdade ($\\sum_{j=1}^n a_{ij} x_j = b_i$):</strong> Substituímos cada equação $f(x) = b_i$ por um par de desigualdades opostas $f(x) \\le b_i$ e $f(x) \\ge b_i$.</li>
          <li><strong>Existem restrições de desigualdade "maior ou igual" ($\\sum_{j=1}^n a_{ij} x_j \\ge b_i$):</strong> Multiplicamos toda a desigualdade por $-1$, invertendo o sinal da desigualdade:
            $$\\sum_{j=1}^{n} (-a_{ij}) x_j \\le -b_i.$$
          </li>
        </ol>

        <h4>1.3 Conversão da Forma Padrão para a Forma de Folgas (*Slack Form*)</h4>
        <p>Para que o algoritmo <code>SIMPLEX</code> possa manipular algebricamente os sistemas de equações, convertemos cada desigualdade $\\sum_{j=1}^n a_{ij} x_j \\le b_i$ ($i = 1, \\dots, m$) em uma <strong>restrição de igualdade</strong> acompanhada de uma restrição de não negatividade introduzindo uma <strong>variável de folga</strong> (<em>slack variable</em>) $x_{n+i}$ que mede exatamente a diferença ("folga") entre o lado direito $b_i$ e o lado esquerdo $\\sum_{j=1}^n a_{ij} x_j$ (Equações 29.32–29.33, p. 686):</p>
        $$\\mathbf{x_{n+i} = b_i - \\sum_{j=1}^{n} a_{ij} x_j, \\qquad \\text{com } x_{n+i} \\ge 0}.$$
        <p>Na <strong>forma de folgas</strong>, isolamos as variáveis de folga no lado esquerdo das equações e usamos a variável $z$ para denotar o valor da função objetivo, omitindo as restrições implícitas $x_1, \\dots, x_{n+m} \\ge 0$:</p>
        $$\\begin{aligned}
          z &= v + \\sum_{j \\in N} c_j x_j \\\\
          x_i &= b_i - \\sum_{j \\in N} a_{ij} x_j \\quad \\text{para } i \\in B.
        \\end{aligned}$$
        <ul>
          <li><strong>Variáveis Básicas ($B$) e Não Básicas ($N$):</strong> As $m$ variáveis no lado esquerdo das igualdades formam o conjunto de índices das <strong>variáveis básicas $B$</strong> (inicialmente $B = \\{n+1, n+2, \\dots, n+m\\}$), e as $n$ variáveis no lado direito formam o conjunto das <strong>variáveis não básicas $N$</strong> (inicialmente $N = \\{1, 2, \\dots, n\\}$), com $N \\cup B = \\{1, 2, \\dots, n+m\\}$ e $N \\cap B = \\emptyset$.</li>
          <li><strong>A Tupla $(N, B, A, b, c, v)$:</strong> Representamos qualquer forma de folgas concisamente pela tupla $(N, B, A, b, c, v)$, onde $v \\in \\mathbb{R}$ é o termo constante na função objetivo (inicialmente $v = 0$) e, <strong>atenção à convenção de sinais do CLRS</strong>: os coeficientes $a_{ij}$ armazenados na matriz $A$ são os <strong>negativos</strong> dos coeficientes que aparecem somados no lado direito de $x_i = b_i - \\sum_{j \\in N} a_{ij} x_j$!</li>
        </ul>

        <h3>2. Seção 29.2 — Formulação de Problemas Clássicos como Programas Lineares (pp. 689–694)</h3>
        <p>Inúmeros problemas fundamentais de grafos e redes estudados nos capítulos anteriores são casos particulares diretos de Programação Linear:</p>
        <ol>
          <li><strong>Caminhos Mínimos de Fonte Única (Par $s \\leadsto t$, Equações 29.44–29.46, p. 690):</strong> Para calcular o peso $\\delta(s, t)$ do caminho mínimo da fonte $s$ ao sorvedouro $t$ em um grafo dirigido $G = (V, E)$ com pesos $w(u, v)$ sem ciclos negativos, introduzimos uma variável $d_v$ para cada $v \\in V$ e impomos as restrições triangulares do Lema 24.10 ($d_v \\le d_u + w(u, v)$). Surpreendentemente, <strong>maximizamos</strong> $d_t$! (Por quê? Porque como cada aresta $(u, v)$ impõe um teto $d_v - d_u \\le w(u, v)$, minimizar $d_t$ permitiria simplesmente fixar todos os $d_v = 0$; esticar $d_t$ ao máximo possível até que as desigualdades ao longo do caminho mais curto fiquem justas força $d_t = \\delta(s, t)$!):
            $$\\begin{aligned}
              \\text{maximizar} \\quad & d_t \\\\
              \\text{sujeito a} \\quad & d_v \\le d_u + w(u, v) && \\text{para cada aresta } (u, v) \\in E, \\\\
              & d_s = 0.
            \\end{aligned}$$
          </li>
          <li><strong>Fluxo Máximo (Equações 29.47–29.50, p. 691):</strong> Com uma variável $f_{uv}$ para cada par $u, v \\in V$ (com $c(u, v) = 0$ se $(u, v) \\notin E$):
            $$\\begin{aligned}
              \\text{maximizar} \\quad & \\sum_{v \\in V} f_{sv} - \\sum_{v \\in V} f_{vs} \\\\
              \\text{sujeito a} \\quad & f_{uv} \\le c(u, v) && \\text{para cada } u, v \\in V \\text{ (capacidade)}, \\\\
              & \\sum_{v \\in V} f_{vu} = \\sum_{v \\in V} f_{uv} && \\text{para cada } u \\in V - \\{s, t\\} \\text{ (conservação)}, \\\\
              & f_{uv} \\ge 0 && \\text{para cada } u, v \\in V.
            \\end{aligned}$$
          </li>
          <li><strong>Fluxo de Custo Mínimo (Equações 29.51–29.55, p. 692):</strong> Dada uma meta de fluxo total $d$ de $s$ para $t$ e um custo unitário $a(u, v) \\ge 0$ por unidade de fluxo em $(u, v)$, minimizamos $\\sum_{(u,v) \\in E} a(u, v) f_{uv}$ sujeito às restrições de capacidade, conservação e envio líquido $\\sum_{v \\in V} f_{sv} - \\sum_{v \\in V} f_{vs} = d$.</li>
          <li><strong>Fluxo de Multimercadorias (<em>Multicommodity Flow</em>, Equações 29.56–29.59, p. 693):</strong> Existem $k$ mercadorias diferentes $i = 1, \\dots, k$, cada uma com sua própria origem $s_i$, destino $t_i$, demanda $d_i$ e fluxo $f_{iuv}$, que <strong>compartilham a capacidade agregada</strong> das arestas ($\\sum_{i=1}^k f_{iuv} \\le c(u, v)$). Diferentemente dos problemas anteriores, <strong>não se conhece nenhum algoritmo combinatório puramente de grafos</strong> para fluxo de multimercadorias: a <strong>Programação Linear é o único método de tempo polinomial conhecido</strong> para resolvê-lo!</li>
        </ol>
      `
    },

    /* ======================================================================
       UNIDADE 13.5 — CAPÍTULO 29 (SEÇÃO 29.3, pp. 694–707)
       ====================================================================== */
    {
      id: "u13-5",
      code: "UNIDADE 13.5 • CAP. 29 (SEÇÃO 29.3)",
      pages: "pp. 694–707",
      title: "29.3 O Algoritmo SIMPLEX (PIVOT, Lemas 29.1 a 29.7, Degenerescência, Ciclagem e Regra de Bland)",
      content: `
        <p>O <strong>Algoritmo Simplex</strong> (George Dantzig, 1947; Seção 29.3, pp. 694–707) é o método clássico para resolver programas lineares. Embora no pior caso teórico possa executar número exponencial de iterações (como nos cubos deformados de Klee–Minty), na prática termina em um pequeno múltiplo linear de $m$ iterações e pode ser visto como uma <strong>eliminação gaussiana para desigualdades</strong>.</p>

        <h3>1. Solução Básica e a Operação Algébrica <code>PIVOT</code> (pp. 694–701)</h3>
        <p>A cada forma de folgas $(N, B, A, b, c, v)$ está associada uma <strong>solução básica</strong> $\\bar{x} = (\\bar{x}_1, \\dots, \\bar{x}_{n+m})$ obtida <strong>fixando todas as variáveis não básicas em zero</strong> ($\\bar{x}_j = 0$ para todo $j \\in N$) e lendo imediatamente os valores das variáveis básicas pelos termos constantes do lado direito: $\\bar{x}_i = b_i$ para todo $i \\in B$, com valor objetivo $z = v$. Se $b_i \\ge 0$ para todo $i \\in B$, a solução básica satisfaz todas as restrições de não negatividade e é chamada de <strong>solução básica viável</strong> (correspondente a um vértice do politopo).</p>

        <h4>1.1 Como Escolher a Variável que Entra ($x_e$) e a Variável que Sai ($x_l$)</h4>
        <p>Em cada iteração do <code>SIMPLEX</code>:</p>
        <ol>
          <li><strong>Variável de Entrada ($x_e$, $e \\in N$):</strong> Procuramos uma variável não básica $x_e$ cujo coeficiente na função objetivo seja <strong>estritamente positivo ($c_e > 0$)</strong>. Se não existir tal variável ($c_j \\le 0$ para todo $j \\in N$), a solução básica atual já é <strong>ótima</strong>!</li>
          <li><strong>Variável de Saída ($x_l$, $l \\in B$):</strong> Ao aumentarmos $x_e$ a partir de $0$ (mantendo as demais variáveis de $N$ em $0$), cada variável básica $x_i$ ($i \\in B$) varia segundo $x_i = b_i - a_{ie} x_e$:
            <ul>
              <li>Se $a_{ie} \\le 0$, aumentar $x_e$ faz $x_i$ crescer (ou permanecer constante), logo a restrição $i$ <strong>não limita</strong> o crescimento de $x_e$ ($\\Delta_i = \\infty$).</li>
              <li>Se $a_{ie} > 0$, exigir $x_i = b_i - a_{ie} x_e \\ge 0$ impõe o limite superior $x_e \\le b_i / a_{ie}$ ($\\Delta_i = b_i / a_{ie}$).</li>
            </ul>
            Portanto, para preservar a viabilidade de <em>todas</em> as variáveis básicas, escolhemos $l \\in B$ que atinge a <strong>restrição mais rígida (o menor quociente $\\Delta_i = b_i / a_{ie}$ dentre os $i \\in B$ com $a_{ie} > 0$)</strong>! Se $a_{ie} \\le 0$ para todo $i \\in B$ ($\\min_i \\Delta_i = \\infty$), podemos aumentar $x_e$ indefinidamente sem violar nenhuma restrição, e o programa linear é <strong>ilimitado (<em>unbounded</em>)</strong>!</li>
        </ol>

        <h4>1.2 O Procedimento <code>PIVOT(N, B, A, b, c, v, l, e)</code> e o Lema 29.1</h4>
        <p>Escolhidos $e \\in N$ e $l \\in B$ (com $a_{le} \\neq 0$), a operação de pivô isola $x_e$ na equação de $x_l$ ($x_e = \\frac{b_l}{a_{le}} - \\sum_{j \\in N - \\{e\\}} \\frac{a_{lj}}{a_{le}} x_j - \\frac{1}{a_{le}} x_l$) e substitui essa expressão para $x_e$ em todas as outras equações $i \\in B - \\{l\\}$ e na função objetivo $z$:</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">PIVOT(N, B, A, b, c, v, l, e)</span>
              <span>[ p. 699 ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="cmt">// Calcula os coeficientes da equação para a nova variável básica x_e</span></span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">seja</span> Â uma nova matriz m × n</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">b̂_e = b_l / a_{le}</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">para cada</span> j ∈ N - {e}</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">   â_{ej} = a_{lj} / a_{le}</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">â_{el} = 1 / a_{le}</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="cmt">// Calcula os coeficientes das restrições restantes</span></span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content"><span class="kw">para cada</span> i ∈ B - {l}</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">   b̂_i = b_i - a_{ie} b̂_e</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">  <span class="kw">para cada</span> j ∈ N - {e}</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">      â_{ij} = a_{ij} - a_{ie} â_{ej}</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">  â_{il} = -a_{ie} â_{el}</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content"><span class="cmt">// Calcula a função objetivo</span></span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">v̂ = v + c_e b̂_e</span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content"><span class="kw">para cada</span> j ∈ N - {e}</span></div>
              <div class="code-line"><span class="line-num">16</span><span class="line-content">  ĉ_j = c_j - c_e â_{ej}</span></div>
              <div class="code-line"><span class="line-num">17</span><span class="line-content">ĉ_l = -c_e â_{el}</span></div>
              <div class="code-line"><span class="line-num">18</span><span class="line-content"><span class="cmt">// Calcula os novos conjuntos de variáveis básicas e não básicas</span></span></div>
              <div class="code-line"><span class="line-num">19</span><span class="line-content">N̂ = N - {e} ∪ {l}</span></div>
              <div class="code-line"><span class="line-num">20</span><span class="line-content">B̂ = B - {l} ∪ {e}</span></div>
              <div class="code-line"><span class="line-num">21</span><span class="line-content"><span class="kw">retorne</span> (N̂, B̂, Â, b̂, ĉ, v̂)</span></div>
            </div>
          </div>

        <p>Pelo <strong>Lema 29.1 (p. 700)</strong>, após a chamada a <code>PIVOT</code>, a nova solução básica tem $\\bar{x}_j = 0$ para todo $j \\in \\hat{N}$, $\\bar{x}_e = b_l / a_{le}$ e $\\bar{x}_i = b_i - a_{ie} \\hat{b}_e$ para todo $i \\in \\hat{B} - \\{e\\}$.</p>

        <h3>2. O Algoritmo Formal <code>SIMPLEX(A, b, c)</code> (p. 702)</h3>
        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">SIMPLEX(A, b, c)</span>
              <span>[ p. 702 ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">(N, B, A, b, c, v) = INITIALIZE-SIMPLEX(A, b, c)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">seja</span> Δ um novo vetor de comprimento n</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">enquanto</span> algum índice j ∈ N tem c_j > 0</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   escolha um índice e ∈ N <span class="kw">para</span> o qual c_e > 0</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">   <span class="kw">para cada</span> índice i ∈ B</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">       <span class="kw">se</span> a_{ie} > 0</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">           Δ_i = b_i / a_{ie}</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">       <span class="kw">senão</span> Δ_i = ∞</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">   escolha um índice l ∈ B que minimize Δ_i</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">  <span class="kw">se</span> Δ_l == ∞</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">      <span class="kw">retorne</span> "ilimitado"</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">  <span class="kw">senão</span> (N, B, A, b, c, v) = PIVOT(N, B, A, b, c, v, l, e)</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content"><span class="kw">para</span> i = 1 até n</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">  <span class="kw">se</span> i ∈ B</span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content">      x̄_i = b_i</span></div>
              <div class="code-line"><span class="line-num">16</span><span class="line-content">  <span class="kw">senão</span> x̄_i = 0</span></div>
              <div class="code-line"><span class="line-num">17</span><span class="line-content"><span class="kw">retorne</span> (x̄₁, x̄₂, ..., x̄_n)</span></div>
            </div>
          </div>

        <h3>3. Análise de Correção, Unicidade da Forma de Folgas, Degenerescência e Regra de Bland (pp. 702–707)</h3>
        <ul>
          <li><strong>Lema 29.2 (Invariante de Viabilidade e Monotonicidade, p. 703):</strong> Se <code>INITIALIZE-SIMPLEX</code> retorna uma forma de folgas com solução básica viável ($b_i \\ge 0$ para todo $i \\in B$), então em toda iteração do laço <code>enquanto</code> de <code>SIMPLEX</code> a solução básica permanece viável ($\\hat{b}_i \\ge 0$) e o valor objetivo nunca diminui ($\\hat{v} = v + c_e (b_l / a_{le}) \\ge v$). Além disso, se <code>SIMPLEX</code> retorna uma solução nas linhas 13–17, essa solução é viável, e se retorna "ilimitado" na linha 11, o programa linear é de fato ilimitado.</li>
          <li><strong>Lema 29.3 (Identidade de Combinações Lineares, p. 704) e Lema 29.4 (Unicidade da Forma de Folgas para Cada Base $B$, p. 704):</strong> O <strong>Lema 29.4</strong> prova um fato estrutural profundo: dada a forma padrão original $(A, b, c)$, para cada escolha do subconjunto $B$ de $m$ variáveis básicas, existe <strong>no máximo uma única forma de folgas $(N, B, A', b', c', v')$</strong>! (Pois subtrair duas formas de folgas com o mesmo conjunto $B$ geraria $0 = (b_i - b'_i) - \\sum_{j \\in N} (a_{ij} - a'_{ij}) x_j$, o que pelo Lema 29.3 obriga $b_i = b'_i$, $a_{ij} = a'_{ij}$, $c_j = c'_j$ e $v = v'$).</li>
          <li><strong>Degenerescência e Ciclagem (pp. 705–706):</strong> Se $b_l > 0$, então $\\hat{v} = v + c_e (b_l / a_{le}) > v$ cresce estritamente. Porém, quando <strong>$b_l = 0$</strong> (e $a_{le} > 0$), temos $\\hat{b}_e = 0$ e $\\hat{v} = v$: o pivô troca os conjuntos $N$ e $B$ mas <strong>não altera o valor objetivo nem a solução básica</strong>! Esse fenômeno é chamado de <strong>degenerescência</strong>. Se uma sequência de pivôs degenerados repetir um conjunto de variáveis básicas $B$ já visitado, o algoritmo entra em um laço infinito chamado de <strong>ciclagem</strong> (<em>cycling</em>).</li>
          <li><strong>Lema 29.5, Regra de Bland e Teorema 29.6 (pp. 706–707):</strong> Pelo Lema 29.4, como existem apenas $\\binom{n+m}{m}$ escolhas possíveis para o conjunto $B$ de $m$ variáveis básicas dentre as $n+m$ variáveis totais, se <code>SIMPLEX</code> executar mais do que $\\binom{n+m}{m}$ iterações, ele obrigatoriamente cicla (Lema 29.5). Podemos impedir 100% a ciclagem usando a <strong>Regra de Bland (Regra dos Menores Índices)</strong>:
            <ol>
              <li>Na linha 4, dentre todas as variáveis não básicas candidatas com $c_j > 0$, escolha como variável de entrada $x_e$ aquela que possui o <strong>menor índice $e$</strong>;</li>
              <li>Na linha 9, se houver empate entre duas ou mais variáveis básicas que minimizam $\\Delta_i = b_i / a_{ie}$, escolha como variável de saída $x_l$ aquela que possui o <strong>menor índice $l$</strong>.</li>
            </ol>
            Pelo <strong>Lema 29.7 e Teorema 29.6 (p. 707)</strong>, sob a Regra de Bland o algoritmo <code>SIMPLEX</code> <strong>nunca cicla</strong> e termina sempre em no máximo $\\mathbf{\\binom{n+m}{m}}$ iterações!</li>
        </ul>
      `
    },

    /* ======================================================================
       UNIDADE 13.6 — CAPÍTULO 29 (SEÇÕES 29.4 E 29.5, pp. 707–725)
       ====================================================================== */
    {
      id: "u13-6",
      code: "UNIDADE 13.6 • CAP. 29 (SEÇÕES 29.4 E 29.5)",
      pages: "pp. 707–725",
      title: "29.4 e 29.5 Dualidade em Programação Linear (Teorema 29.10) e Solução Básica Viável Inicial (INITIALIZE-SIMPLEX e Teorema 29.12)",
      content: `
        <p>As duas últimas seções do Capítulo 29 (pp. 707–725) completam a teoria da Programação Linear respondendo às duas grandes questões restantes: (1) como provar que a solução retornada pelo <code>SIMPLEX</code> é globalmente ótima (<strong>Dualidade</strong>); e (2) como encontrar uma solução básica inicial viável quando algum $b_i < 0$ (<strong><code>INITIALIZE-SIMPLEX</code></strong>).</p>

        <h3>1. Seção 29.4 — Dualidade em Programação Linear (pp. 707–714)</h3>
        <p>Dado um programa linear de maximização na forma padrão — que chamamos de <strong>primal</strong> —, definimos seu <strong>programa linear dual</strong> trocando o papel do vetor do lado direito $b$ com o vetor da função objetivo $c$, transpondo a matriz de coeficientes $A$ para $A^{\\text{T}}$, trocando maximização por minimização e invertendo $\\le$ para $\\ge$ (Equações 29.83–29.85, p. 708):</p>

        <table class="clrs-cost-table">
          <thead>
            <tr>
              <th>Programa Linear Primal (Maximização)</th>
              <th>Programa Linear Dual (Minimização)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>$$\\text{maximizar } \\sum_{j=1}^{n} c_j x_j \\quad (c^{\\text{T}} x)$$</td>
              <td>$$\\text{minimizar } \\sum_{i=1}^{m} b_i y_i \\quad (b^{\\text{T}} y)$$</td>
            </tr>
            <tr>
              <td>$$\\text{s.a. } \\sum_{j=1}^{n} a_{ij} x_j \\le b_i \\quad (i = 1, \\dots, m) \\; [Ax \\le b]$$</td>
              <td>$$\\text{s.a. } \\sum_{i=1}^{m} a_{ij} y_i \\ge c_j \\quad (j = 1, \\dots, n) \\; [A^{\\text{T}} y \\ge c]$$</td>
            </tr>
            <tr>
              <td>$$x_j \\ge 0 \\quad (j = 1, \\dots, n)$$</td>
              <td>$$y_i \\ge 0 \\quad (i = 1, \\dots, m)$$</td>
            </tr>
          </tbody></table></div>

        <p>Note a correspondência biunívoca: cada uma das $m$ restrições $i$ do primal (associada à variável de folga primal $x_{n+i}$) corresponde exatamente à $i$-ésima variável dual $y_i$; e cada uma das $n$ variáveis $x_j$ do primal corresponde à $j$-ésima restrição do dual!</p>

        <h4>1.1 Dualidade Fraca (Lema 29.8 e Corolário 29.9)</h4>
        <div class="canonical-callout theorem">
          <span class="callout-tag">[ LEMA 29.8 • (DUALIDADE FRACA DE PROGRAMAÇÃO LINEAR, P. 708): ]</span>
          Seja $\\bar{x}$ qualquer solução viável para o programa linear primal e seja $\\bar{y}$ qualquer solução viável para o programa linear dual. Então:
          $$\\mathbf{\\sum_{j=1}^{n} c_j \\bar{x}_j \\le \\sum_{i=1}^{m} b_i \\bar{y}_i}.$$
          <p style="margin-top:8px;"><strong>Demonstração em 1 Linha (Equação 29.86):</strong> Usando $\\sum_{i=1}^m a_{ij} \\bar{y}_i \\ge c_j$ (com $\\bar{x}_j \\ge 0$) e $\\sum_{j=1}^n a_{ij} \\bar{x}_j \\le b_i$ (com $\\bar{y}_i \\ge 0$):</p>
          $$\\sum_{j=1}^{n} c_j \\bar{x}_j \\le \\sum_{j=1}^{n} \\left(\\sum_{i=1}^{m} a_{ij} \\bar{y}_i\\right) \\bar{x}_j = \\sum_{i=1}^{m} \\left(\\sum_{j=1}^{n} a_{ij} \\bar{x}_j\\right) \\bar{y}_i \\le \\sum_{i=1}^{m} b_i \\bar{y}_i. \\quad \\blacksquare$$
        </div>

        <p>Pelo <strong>Corolário 29.9 (p. 709)</strong>, se encontrarmos uma solução viável primal $\\bar{x}$ e uma solução viável dual $\\bar{y}$ tais que $\\sum_{j=1}^n c_j \\bar{x}_j = \\sum_{i=1}^m b_i \\bar{y}_i$, então $\\bar{x}$ é obrigatoriamente uma solução <strong>ótima primal</strong> e $\\bar{y}$ é uma solução <strong>ótima dual</strong> (nenhuma solução primal pode superar $\\sum b_i \\bar{y}_i$ e nenhuma solução dual pode ficar abaixo de $\\sum c_j \\bar{x}_j$!).</p>

        <h4>1.2 Dualidade Forte (Teorema 29.10) — Lendo a Solução Ótima Dual na Forma de Folgas Final</h4>
        <p>Quando o algoritmo <code>SIMPLEX</code> termina com uma forma de folgas final $(N, B, A', b', c', v')$ na qual todos os coeficientes da função objetivo satisfazem $c'_j \\le 0$ para todo $j \\in N$ (e definindo $c'_j = 0$ para todo $j \\in B$), podemos extrair a solução ótima dual $\\bar{y} = (\\bar{y}_1, \\dots, \\bar{y}_m)$ diretamente dos <strong>negativos dos coeficientes finais das variáveis de folga originais $x_{n+i}$</strong> (Equação 29.91, p. 710):</p>
        $$\\mathbf{\\bar{y}_i = \\begin{cases} -c'_{n+i} & \\text{se } (n + i) \\in N, \\\\ 0 & \\text{caso contrário } ((n + i) \\in B). \\end{cases}}$$

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 29.10 • (TEOREMA DA DUALIDADE DE PROGRAMAÇÃO LINEAR, P. 710): ]</span>
          Suponha que <code>SIMPLEX</code> retorne valores $\\bar{x} = (\\bar{x}_1, \\dots, \\bar{x}_n)$ para o programa linear primal $(A, b, c)$, com forma de folgas final $(N, B, A', b', c', v')$, e seja $\\bar{y} = (\\bar{y}_1, \\dots, \\bar{y}_m)$ definido por $\\bar{y}_i = -c'_{n+i}$ (para $n+i \\in N$) e $0$ (para $n+i \\in B$). Então $\\bar{x}$ é uma solução ótima para o primal, $\\bar{y}$ é uma solução ótima para o dual, e:
          $$\\mathbf{\\sum_{j=1}^{n} c_j \\bar{x}_j = \\sum_{i=1}^{m} b_i \\bar{y}_i = v'}.$$
          <p style="margin-top:8px;"><strong>Essência da Demonstração (pp. 710–711):</strong> Como a função objetivo final $z = v' + \\sum_{j=1}^{n+m} c'_j x_j$ é algebricamente equivalente à função objetivo original $\\sum_{j=1}^n c_j x_j$ para qualquer atribuição que satisfaça $x_{n+i} = b_i - \\sum_{j=1}^n a_{ij} x_j$, substituindo $c'_{n+i} = -\\bar{y}_i$ temos a identidade algébrica:</p>
          $$\\sum_{j=1}^{n} c_j x_j = v' + \\sum_{j=1}^{n} c'_j x_j - \\sum_{i=1}^{m} \\bar{y}_i \\left(b_i - \\sum_{j=1}^{n} a_{ij} x_j\\right) = \\left(v' - \\sum_{i=1}^{m} b_i \\bar{y}_i\\right) + \\sum_{j=1}^{n} \\left(c'_j + \\sum_{i=1}^{m} a_{ij} \\bar{y}_i\\right) x_j.$$
          <p>Para a solução básica final $\\bar{x}$ (onde $c'_j \\bar{x}_j = 0$ e $\\bar{y}_i \\bar{x}_{n+i} = 0$ por folga complementar), temos $v' = \\sum_{j=1}^n c_j \\bar{x}_j = \\sum_{i=1}^m b_i \\bar{y}_i$. E pelo <strong>Lema 29.3</strong>, igualando os coeficientes de $x_j$ na identidade acima, $c_j = c'_j + \\sum_{i=1}^m a_{ij} \\bar{y}_i \\implies \\sum_{i=1}^m a_{ij} \\bar{y}_i = c_j - c'_j \\ge c_j$ (já que $c'_j \\le 0$!) e $\\bar{y}_i = -c'_{n+i} \\ge 0$. Logo $\\bar{y}$ é viável no dual e, pelo Corolário 29.9, $\\bar{x}$ e $\\bar{y}$ são ótimas! $\\blacksquare$</p>
        </div>

        <h3>2. Seção 29.5 — A Solução Básica Viável Inicial: <code>INITIALIZE-SIMPLEX</code> e o Programa Auxiliar $L_{\\text{aux}}$ (pp. 714–721)</h3>
        <p>E se o programa linear em forma padrão tiver algum <strong>$b_i < 0$</strong>? Nesse caso, a solução básica inicial óbvia ($\\bar{x}_j = 0$ para $j \\in N$ e $\\bar{x}_{n+i} = b_i$) <strong>não é viável</strong> (pois $\\bar{x}_{n+i} = b_i < 0$), embora o programa linear ainda possa possuir soluções viáveis! Para testar se $L$ é viável e, em caso afirmativo, construir uma forma de folgas inicial com solução básica viável, introduzimos uma variável artificial $x_0 \\ge 0$ e formulamos o <strong>programa linear auxiliar $L_{\\text{aux}}$</strong> (Equações 29.106–29.108, p. 715):</p>
        $$\\begin{aligned}
          \\text{maximizar} \\quad & -x_0 \\\\
          \\text{sujeito a} \\quad & \\sum_{j=1}^{n} a_{ij} x_j - x_0 \\le b_i && \\text{para } i = 1, 2, \\dots, m, \\\\
          & x_j \\ge 0 && \\text{para } j = 0, 1, \\dots, n.
        \\end{aligned}$$

        <ul>
          <li><strong>Lema 29.11 (p. 715):</strong> O programa linear original $L$ é viável <strong>se e somente se o valor objetivo ótimo de $L_{\\text{aux}}$ é $0$</strong> (pois se $L$ tem solução viável $\\bar{x}$, basta tomar $\\bar{x}_0 = 0$ em $L_{\\text{aux}}$; reciprocamente, se o ótimo de $L_{\\text{aux}}$ é $-x_0 = 0$, então $x_0 = 0$ e $(x_1, \\dots, x_n)$ satisfaz todas as restrições de $L$).</li>
          <li><strong>O Primeiro Pivô Mágico em <code>INITIALIZE-SIMPLEX</code>:</strong> Na forma de folgas inicial de $L_{\\text{aux}}$, temos $x_{n+i} = b_i - \\sum_{j=1}^n a_{ij} x_j + x_0$. Selecionamos $k$ tal que <strong>$b_k$ seja o menor (mais negativo) dentre todos os $b_i$</strong> ($l = n + k$) e executamos <strong>um único <code>PIVOT(N, B, A, b, c, v, l, 0)</code> com $x_0$ entrando na base e $x_l$ saindo da base</strong>!
            <ul>
              <li>Como $a_{l0} = -1$, após esse pivô temos $\\hat{b}_0 = b_l / (-1) = -b_k > 0$, e para todo $i \\in B - \\{l\\}$ temos $\\hat{b}_i = b_i - a_{i0} \\hat{b}_0 = b_i - (-1)(-b_k) = \\mathbf{b_i - b_k \\ge 0}$ (já que $b_k \\le b_i$ era o mais negativo!).</li>
              <li>Portanto, <strong>após esse único pivô inicial, a solução básica de $L_{\\text{aux}}$ torna-se 100% viável</strong>!</li>
            </ul>
          </li>
          <li>Em seguida, executamos o laço de <code>PIVOT</code> do Simplex até resolver $L_{\\text{aux}}$ até a otimalidade:
            <ul>
              <li>Se o valor objetivo ótimo de $L_{\\text{aux}}$ for $< 0$ ($\\bar{x}_0 > 0$), retornamos <strong>"inviável"</strong>.</li>
              <li>Se o valor ótimo for $0$ ($\\bar{x}_0 = 0$), caso $x_0$ ainda pertença à base $B$ (com valor degenerado $\\bar{x}_0 = 0$), fazemos um pivô degenerado com qualquer $e \\in N$ tal que $a_{0e} \\neq 0$ para retirar $x_0$ da base, removemos a coluna de $x_0$ e restauramos a função objetivo original de $L$ (substituindo quaisquer variáveis básicas presentes na função objetivo original por seus lados direitos), entregando uma forma de folgas válida e viável para $L$ (<strong>Lema 29.12, p. 718</strong>)!</li>
            </ul>
          </li>
        </ul>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">INITIALIZE-SIMPLEX(A, b, c)</span>
              <span>[ p. 716 ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">seja</span> k o índice do mínimo b_i</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">se</span> b_k ≥ 0                        <span class="cmt">// a solução básica inicial já é viável?</span></span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   <span class="kw">retorne</span> ({1, 2, ..., n}, {n + 1, n + 2, ..., n + m}, A, b, c, 0)</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">forme L_aux adicionando -x₀ ao lado esquerdo de cada restrição</span></div>
              <div class="code-line"><span class="line-num"></span><span class="line-content">       e configurando a função objetivo como -x₀</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">seja</span> (N, B, A, b, c, v) a forma de folgas resultante <span class="kw">para</span> L_aux</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">l = n + k</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="cmt">// L_aux tem n + 1 variáveis não básicas e m variáveis básicas</span></span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">(N, B, A, b, c, v) = PIVOT(N, B, A, b, c, v, l, 0)</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content"><span class="cmt">// A solução básica agora é viável para L_aux</span></span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">itere o laço <span class="kw">enquanto</span> das linhas 3-12 de SIMPLEX até encontrar uma solução ótima <span class="kw">para</span> L_aux</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content"><span class="kw">se</span> a solução ótima <span class="kw">para</span> L_aux define x̄₀ como 0</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">  <span class="kw">se</span> x̄₀ é básica</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">      execute um pivô (degenerado) <span class="kw">para</span> torná-la não básica</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">  da forma de folgas final de L_aux, remova x₀ das restrições e</span></div>
              <div class="code-line"><span class="line-num"></span><span class="line-content">           restaure a função objetivo original de L, mas substitua cada</span></div>
              <div class="code-line"><span class="line-num"></span><span class="line-content">           variável básica nessa função objetivo pelo lado direito de sua restrição associada</span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content">  <span class="kw">retorne</span> a forma de folgas final modificada</span></div>
              <div class="code-line"><span class="line-num">16</span><span class="line-content"><span class="kw">senão</span> <span class="kw">retorne</span> "inviável"</span></div>
            </div>
          </div>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 29.13 • (TEOREMA FUNDAMENTAL DA PROGRAMAÇÃO LINEAR, P. 720): ]</span>
          Qualquer programa linear $L$, dado na forma padrão, ou:
          <ol>
            <li>Tem uma <strong>solução ótima</strong> com um valor objetivo finito;</li>
            <li>É <strong>inviável</strong> (conjunto de soluções viáveis vazio); ou</li>
            <li>É <strong>ilimitado</strong> (possui soluções viáveis com valores objetivos arbitrariamente grandes).</li>
          </ol>
          Se $L$ é inviável, <code>SIMPLEX</code> retorna "inviável". Se $L$ é ilimitado, <code>SIMPLEX</code> retorna "ilimitado". Caso contrário, <code>SIMPLEX</code> retorna uma solução ótima com um valor objetivo finito. $\\blacksquare$
        </div>
      `
    }
  ];

  /* ========================================================================
     SEÇÃO 2.5: WORKBENCH INTERATIVO DUPLO DO MÓDULO 13
     (1) Simulador Passo a Passo do Algoritmo SIMPLEX & PIVOT + Solução Dual
     (2) Analisador de Multithreading Dinâmico (T₁, T_∞, T₁/T_∞, T_P) & LUP-DECOMPOSITION
     ======================================================================== */
  function initWorkbenches() {
    const mount = document.getElementById("workbench-mod13-mount");
    if (!mount || mount.dataset.initialized === "true") return;
    mount.dataset.initialized = "true";

    mount.innerHTML = `
      <div class="workbench-box" style="margin-top:1.5rem;">
        <div class="workbench-header">
          <span class="workbench-title">[ BANCADA INTERATIVA DUPLA • MÓDULO 13: SIMPLEX & MULTITHREADING (CAPS. 27–29) ]</span>
          <span class="bracket-tag amber">SIMPLEX • DUALIDADE • MULTITHREAD • LUP</span>
        </div>
        <div class="workbench-body">
          <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
            Explore interativamente: <strong>(Laboratório 01)</strong> a execução passo a passo de <code>SIMPLEX</code> e <code>PIVOT</code> no exemplo canônico da Seção 29.3 (pp. 694–698) e no Exercício 29.3-5, inspecionando os dicionários na forma de folgas, os conjuntos $N$ e $B$, as razões $\\Delta_i = b_i / a_{ie}$ e a solução ótima dual $\\bar{y}_i = -c'_{n+i}$; <strong>(Laboratório 02)</strong> a análise de Trabalho $T_1$, Duração $T_\\infty$, Paralelismo $T_1/T_\\infty$, Limite de Escalonamento Guloso $T_P \\le T_1/P + T_\\infty$ e Decomposição <code>LUP-DECOMPOSITION</code> passo a passo.
          </p>

          <div style="display:flex;gap:0.6rem;flex-wrap:wrap;margin-bottom:1.1rem;border-bottom:2px solid var(--ink-primary);padding-bottom:0.8rem;">
            <button id="m13-tab-simplex" class="wb-btn primary">[ LABORATÓRIO 01: SIMULADOR SIMPLEX & DUALIDADE (CAP. 29) ]</button>
            <button id="m13-tab-mtlup" class="wb-btn">[ LABORATÓRIO 02: MULTITHREADING & DECOMPOSIÇÃO LUP (CAPS. 27–28) ]</button>
          </div>

          <!-- ABA 1: SIMULADOR SIMPLEX -->
          <div id="m13-panel-simplex">
            <div class="workbench-controls" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:1rem;">
              <label for="m13-lp-select" style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;">Instância de PL:</label>
              <select id="m13-lp-select" class="search-input-brutal" style="min-width:280px;">
                <option value="clrs293">Exemplo Canônico Seção 29.3 (pp. 694–698): max 3x₁ + x₂ + 2x₃ (3 pivôs até z* = 28)</option>
                <option value="ex2935">Exercício 29.3-5 (p. 707): max 18x₁ + 12,5x₂ s.a. x₁+x₂≤20, x₁≤12, x₂≤16 (z* = 316)</option>
              </select>
              <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
                <button id="m13-simplex-prev" class="wb-btn">◀ Pivô Anterior</button>
                <button id="m13-simplex-next" class="wb-btn primary">Próximo Pivô ▶</button>
              </div>
              <span id="m13-simplex-step-label" style="font-family:var(--font-mono);font-weight:700;color:var(--accent-amber-dark);font-size:0.82rem;"></span>
            </div>
            <div id="m13-simplex-view"></div>
          </div>

          <!-- ABA 2: MULTITHREADING E LUP -->
          <div id="m13-panel-mtlup" style="display:none;">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:1.25rem;">
              <div style="background:var(--bg-card);border:var(--border-thin);padding:1rem;">
                <div style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;margin-bottom:0.6rem;color:var(--accent-amber-dark);">
                  [ ANALISADOR DE MULTITHREADING DINÂMICO (CAP. 27) ]
                </div>
                <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;font-family:var(--font-mono);font-size:0.78rem;">
                  <label>Tamanho $n$:
                    <select id="m13-mt-n" class="search-input-brutal" style="padding:4px 8px;">
                      <option value="64">n = 64 (2⁶)</option>
                      <option value="1024" selected>n = 1.024 (2¹⁰)</option>
                      <option value="65536">n = 65.536 (2¹⁶)</option>
                      <option value="1048576">n = 1.048.576 (2²⁰)</option>
                    </select>
                  </label>
                  <label>Processadores $P$:
                    <select id="m13-mt-p" class="search-input-brutal" style="padding:4px 8px;">
                      <option value="4">P = 4</option>
                      <option value="16">P = 16</option>
                      <option value="64" selected>P = 64</option>
                      <option value="256">P = 256</option>
                    </select>
                  </label>
                </div>
                <div id="m13-mt-output"></div>
              </div>

              <div style="background:var(--bg-card);border:var(--border-thin);padding:1rem;">
                <div style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;margin-bottom:0.6rem;color:var(--accent-emerald-dark);">
                  [ DECOMPOSIÇÃO LUP & LUP-SOLVE (SEÇÃO 28.1) ]
                </div>
                <p style="font-size:0.84rem;color:var(--ink-secondary);margin-bottom:0.6rem;">Fatoração canônica da Figura 28.2 (pp. 662–664) e resolução de $Ax = b$ via substituição progressiva ($Ly = Pb$) e regressiva ($Ux = y$):</p>
                <div style="margin-bottom:8px;font-family:var(--font-mono);font-size:0.78rem;">
                  <label>Sistema Canônico:
                    <select id="m13-lup-select" class="search-input-brutal" style="padding:4px 8px;">
                      <option value="sec281">Exemplo Seção 28.1 (3×3, pp. 656 e 662)</option>
                      <option value="ex2813">Exercício 28.1-3 (3×3, p. 664)</option>
                    </select>
                  </label>
                </div>
                <div id="m13-lup-output"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const lpData = {
      clrs293: [
        {
          step: "Iteração 0 — Forma de Folgas Inicial (Eqs. 29.58–29.61, p. 695)",
          N: ["x₁", "x₂", "x₃"],
          B: ["x₄", "x₅", "x₆"],
          zEq: "z = 0 + 3x₁ + 1x₂ + 2x₃",
          rows: [
            { bVar: "x₄", rhs: "30 - 1x₁ - 1x₂ - 3x₃", delta: "30 / 1 = 30" },
            { bVar: "x₅", rhs: "24 - 2x₁ - 2x₂ - 5x₃", delta: "24 / 2 = 12" },
            { bVar: "x₆", rhs: "36 - 4x₁ - 1x₂ - 2x₃", delta: "36 / 4 = 9 (Mínimo → x₆ sai!)" }
          ],
          basicSol: "(x₁, x₂, x₃, x₄, x₅, x₆) = (0, 0, 0, 30, 24, 36)",
          zVal: "0",
          pivotDesc: "Variável de entrada: x₁ (c₁ = 3 > 0). Variável de saída: x₆ (menor razão Δ₆ = 36/4 = 9). Chamamos PIVOT(N, B, A, b, c, v, 6, 1)."
        },
        {
          step: "Iteração 1 — Após PIVOT(l = 6, e = 1) (Eqs. 29.64–29.67, p. 697)",
          N: ["x₂", "x₃", "x₆"],
          B: ["x₁", "x₄", "x₅"],
          zEq: "z = 27 + (1/4)x₂ + (1/2)x₃ - (3/4)x₆",
          rows: [
            { bVar: "x₁", rhs: "9 - (1/4)x₂ - (1/2)x₃ - (1/4)x₆", delta: "9 / (1/2) = 18" },
            { bVar: "x₄", rhs: "21 - (3/4)x₂ - (5/2)x₃ + (1/4)x₆", delta: "21 / (5/2) = 42/5 = 8,4" },
            { bVar: "x₅", rhs: "6 - (3/2)x₂ - 4x₃ + (1/2)x₆", delta: "6 / 4 = 3/2 = 1,5 (Mínimo → x₅ sai!)" }
          ],
          basicSol: "(x₁, x₂, x₃, x₄, x₅, x₆) = (9, 0, 0, 21, 6, 0)",
          zVal: "27",
          pivotDesc: "Escolhemos x₃ para entrar (c₃ = 1/2 > 0). Variável de saída: x₅ (menor razão Δ₅ = 6/4 = 3/2). Chamamos PIVOT(N, B, A, b, c, v, 5, 3)."
        },
        {
          step: "Iteração 2 — Após PIVOT(l = 5, e = 3) (Eqs. 29.68–29.71, p. 697)",
          N: ["x₂", "x₅", "x₆"],
          B: ["x₁", "x₃", "x₄"],
          zEq: "z = 111/4 + (1/16)x₂ - (1/8)x₅ - (11/16)x₆",
          rows: [
            { bVar: "x₁", rhs: "33/4 - (1/16)x₂ + (1/8)x₅ - (5/16)x₆", delta: "(33/4) / (1/16) = 132" },
            { bVar: "x₃", rhs: "3/2 - (3/8)x₂ - (1/4)x₅ + (1/8)x₆", delta: "(3/2) / (3/8) = 4 (Mínimo → x₃ sai!)" },
            { bVar: "x₄", rhs: "69/4 + (3/16)x₂ + (5/8)x₅ - (1/16)x₆", delta: "∞ (pois a₄₂ = -3/16 ≤ 0)" }
          ],
          basicSol: "(x₁, x₂, x₃, x₄, x₅, x₆) = (33/4, 0, 3/2, 69/4, 0, 0)",
          zVal: "111/4 = 27,75",
          pivotDesc: "Única variável com c_j > 0 é x₂ (c₂ = 1/16 > 0). Variável de saída: x₃ (Δ₃ = 4). Chamamos PIVOT(N, B, A, b, c, v, 3, 2)."
        },
        {
          step: "Iteração 3 — Forma de Folgas Final Ótima! (Eqs. 29.72–29.75, p. 698)",
          N: ["x₃", "x₅", "x₆"],
          B: ["x₁", "x₂", "x₄"],
          zEq: "z = 28 - (1/6)x₃ - (1/6)x₅ - (2/3)x₆",
          rows: [
            { bVar: "x₁", rhs: "8 + (1/6)x₃ + (1/6)x₅ - (1/3)x₆", delta: "—" },
            { bVar: "x₂", rhs: "4 - (8/3)x₃ - (2/3)x₅ + (1/3)x₆", delta: "—" },
            { bVar: "x₄", rhs: "18 - (1/2)x₃ + (1/2)x₅ + 0x₆", delta: "—" }
          ],
          basicSol: "(x₁, x₂, x₃, x₄, x₅, x₆) = (8, 4, 0, 18, 0, 0)",
          zVal: "28 (ÓTIMO!)",
          pivotDesc: "Todos os coeficientes na função objetivo são ≤ 0 (c'₃ = -1/6, c'₅ = -1/6, c'₆ = -2/3)! Pelo Teorema 29.10 (Dualidade Forte), a solução ótima primal é (x₁*, x₂*, x₃*) = (8, 4, 0) com valor z* = 28, e a solução ótima dual é (y₁*, y₂*, y₃*) = (-c'₄, -c'₅, -c'₆) = (0, 1/6, 2/3) com valor bᵀy* = 30(0) + 24(1/6) + 36(2/3) = 4 + 24 = 28!"
        }
      ],
      ex2935: [
        {
          step: "Iteração 0 — Forma de Folgas Inicial (Exercício 29.3-5, p. 707)",
          N: ["x₁", "x₂"],
          B: ["x₃", "x₄", "x₅"],
          zEq: "z = 0 + 18x₁ + 12,5x₂",
          rows: [
            { bVar: "x₃", rhs: "20 - 1x₁ - 1x₂", delta: "20 / 1 = 20" },
            { bVar: "x₄", rhs: "12 - 1x₁ + 0x₂", delta: "12 / 1 = 12 (Mínimo → x₄ sai!)" },
            { bVar: "x₅", rhs: "16 + 0x₁ - 1x₂", delta: "∞ (a₅₁ = 0)" }
          ],
          basicSol: "(x₁, x₂, x₃, x₄, x₅) = (0, 0, 20, 12, 16)",
          zVal: "0",
          pivotDesc: "Escolhemos x₁ para entrar (c₁ = 18 > 0). Variável de saída: x₄ (Δ₄ = 12). Chamamos PIVOT(l = 4, e = 1)."
        },
        {
          step: "Iteração 1 — Após PIVOT(l = 4, e = 1)",
          N: ["x₂", "x₄"],
          B: ["x₁", "x₃", "x₅"],
          zEq: "z = 216 + 12,5x₂ - 18x₄",
          rows: [
            { bVar: "x₁", rhs: "12 + 0x₂ - 1x₄", delta: "∞ (a₁₂ = 0)" },
            { bVar: "x₃", rhs: "8 - 1x₂ + 1x₄", delta: "8 / 1 = 8 (Mínimo → x₃ sai!)" },
            { bVar: "x₅", rhs: "16 - 1x₂ + 0x₄", delta: "16 / 1 = 16" }
          ],
          basicSol: "(x₁, x₂, x₃, x₄, x₅) = (12, 0, 8, 0, 16)",
          zVal: "216",
          pivotDesc: "Escolhemos x₂ para entrar (c₂ = 12,5 > 0). Variável de saída: x₃ (Δ₃ = 8). Chamamos PIVOT(l = 3, e = 2)."
        },
        {
          step: "Iteração 2 — Forma de Folgas Final Ótima!",
          N: ["x₃", "x₄"],
          B: ["x₁", "x₂", "x₅"],
          zEq: "z = 316 - 12,5x₃ - 5,5x₄",
          rows: [
            { bVar: "x₁", rhs: "12 + 0x₃ - 1x₄", delta: "—" },
            { bVar: "x₂", rhs: "8 - 1x₃ + 1x₄", delta: "—" },
            { bVar: "x₅", rhs: "8 + 1x₃ - 1x₄", delta: "—" }
          ],
          basicSol: "(x₁, x₂, x₃, x₄, x₅) = (12, 8, 0, 0, 8)",
          zVal: "316 (ÓTIMO!)",
          pivotDesc: "Todos os coeficientes na função objetivo são ≤ 0 (c'₃ = -12,5 e c'₄ = -5,5)! Solução ótima primal: (x₁*, x₂*) = (12, 8) com z* = 18(12) + 12,5(8) = 216 + 100 = 316. Solução ótima dual: (y₁*, y₂*, y₃*) = (-c'₃, -c'₄, -c'₅) = (12,5; 5,5; 0), com valor dual 20(12,5) + 12(5,5) + 16(0) = 250 + 66 = 316!"
        }
      ]
    };

    let currentLP = "clrs293";
    let currentStep = 0;

    function renderSimplex() {
      const steps = lpData[currentLP];
      const s = steps[currentStep];
      document.getElementById("m13-simplex-step-label").textContent = `Passo ${currentStep + 1} de ${steps.length}`;
      const rowsHtml = s.rows
        .map(
          (r) => `
          <tr>
            <td style="padding: 6px 10px; border-bottom: 1px solid #334155;"><strong>${r.bVar}</strong> = ${r.rhs}</td>
            <td style="padding: 6px 10px; border-bottom: 1px solid #334155;">${r.delta}</td>
          </tr>
        `
        )
        .join("");

      document.getElementById("m13-simplex-view").innerHTML = `
        <div style="background:var(--bg-card);padding:1.25rem;border:var(--border-thin);">
          <h4 style="margin-top:0;color:var(--accent-amber-dark);font-family:var(--font-mono);font-size:0.88rem;">[ ${s.step.toUpperCase()} ]</h4>
          <p style="margin: 6px 0;"><strong>Conjunto Não Básico $N$:</strong> { ${s.N.join(", ")} } &nbsp;|&nbsp; <strong>Conjunto Básico $B$:</strong> { ${s.B.join(", ")} }</p>
          <p style="margin:6px 0;font-family:var(--font-mono);font-size:0.95rem;color:var(--ink-primary);"><strong>Função Objetivo:</strong> ${s.zEq}</p>
          <div class="canonical-table-wrap"><table class="canonical-table" style="margin:8px 0;">
            <thead>
              <tr style="background: rgba(51, 65, 85, 0.5);">
                <th style="padding: 6px 10px; text-align: left;">Equações das Variáveis Básicas ($x_i = b_i - \\sum_{j \\in N} a_{ij} x_j$)</th>
                <th style="padding: 6px 10px; text-align: left;">Limite $\\Delta_i = b_i / a_{ie}$</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody></table></div>
          <p style="margin: 6px 0;"><strong>Solução Básica Atual:</strong> <code>${s.basicSol}</code> &nbsp;|&nbsp; <strong>Valor Objetivo $z$:</strong> <strong style="color: #4ade80;">${s.zVal}</strong></p>
          <div class="wb-log-panel" style="margin-top:10px;"><strong>Análise da Iteração:</strong> ${s.pivotDesc}</div>
        </div>
      `;
    }

    function renderMTAndLUP() {
      const n = parseInt(document.getElementById("m13-mt-n").value, 10);
      const P = parseInt(document.getElementById("m13-mt-p").value, 10);
      const lgn = Math.round(Math.log2(n));

      // Merge-Sort-MT vs P-Merge-Sort
      const t1 = n * lgn;
      const tInfNaive = 2 * n; // Θ(n)
      const parNaive = (t1 / tInfNaive).toFixed(1);
      const tpNaive = Math.round(t1 / P + tInfNaive);

      const tInfPMerge = lgn * lgn * lgn; // lg³ n
      const parPMerge = (t1 / tInfPMerge).toFixed(1);
      const tpPMerge = Math.round(t1 / P + tInfPMerge);

      document.getElementById("m13-mt-output").innerHTML = `
        <div class="canonical-table-wrap"><table class="canonical-table" style="font-size:0.82rem;">
          <thead>
            <tr style="background: rgba(51, 65, 85, 0.6);">
              <th style="padding: 6px; text-align: left;">Métrica ($n = ${n.toLocaleString("pt-BR")}, \\lg n = ${lgn}, P = ${P}$)</th>
              <th style="padding: 6px; text-align: right;"><code>MERGE-SORT-MT</code> (MERGE serial)</th>
              <th style="padding: 6px; text-align: right;"><code>P-MERGE-SORT</code> (<code>P-MERGE</code>)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 5px; border-bottom: 1px solid #334155;">Trabalho $T_1(n) = n \\lg n$</td>
              <td style="padding: 5px; text-align: right; border-bottom: 1px solid #334155;">${t1.toLocaleString("pt-BR")}</td>
              <td style="padding: 5px; text-align: right; border-bottom: 1px solid #334155;">${t1.toLocaleString("pt-BR")}</td>
            </tr>
            <tr>
              <td style="padding: 5px; border-bottom: 1px solid #334155;">Duração $T_\\infty(n)$ ($\\Theta(n)$ vs. $\\lg^3 n$)</td>
              <td style="padding: 5px; text-align: right; border-bottom: 1px solid #334155; color: #f87171;">${tInfNaive.toLocaleString("pt-BR")}</td>
              <td style="padding: 5px; text-align: right; border-bottom: 1px solid #334155; color: #4ade80;">${tInfPMerge.toLocaleString("pt-BR")}</td>
            </tr>
            <tr>
              <td style="padding: 5px; border-bottom: 1px solid #334155;">Paralelismo $T_1 / T_\\infty$</td>
              <td style="padding: 5px; text-align: right; border-bottom: 1px solid #334155;">${parNaive}</td>
              <td style="padding: 5px; text-align: right; border-bottom: 1px solid #334155;"><strong>${parPMerge}</strong></td>
            </tr>
            <tr>
              <td style="padding: 5px;">Limite Guloso $T_P \\le T_1/P + T_\\infty$</td>
              <td style="padding: 5px; text-align: right;">${tpNaive.toLocaleString("pt-BR")}</td>
              <td style="padding: 5px; text-align: right; color: #38bdf8;"><strong>${tpPMerge.toLocaleString("pt-BR")}</strong></td>
            </tr>
          </tbody>
        </table>
      `;

      const lupChoice = document.getElementById("m13-lup-select").value;
      if (lupChoice === "sec281") {
        document.getElementById("m13-lup-output").innerHTML = `
          <div style="font-size: 0.86rem; font-family: monospace; line-height: 1.45;">
            <div><strong>Matriz A e vetor b (pp. 656–657):</strong></div>
            <div>A = [[1, 2, 0], [3, 4, 4], [5, 6, 3]], &nbsp; b = [3, 7, 8]ᵀ</div>
            <div style="margin-top: 6px; color: #38bdf8;"><strong>Resultado de LUP-DECOMPOSITION(A):</strong></div>
            <div>π = [3, 1, 2] &nbsp;(P permuta linhas para [3, 1, 2])</div>
            <div>L = [[1, 0, 0], [0.2, 1, 0], [0.6, 0.5, 1]]</div>
            <div>U = [[5, 6, 3], [0, 0.8, -0.6], [0, 0, 2.5]]</div>
            <div style="margin-top: 6px; color: #4ade80;"><strong>LUP-SOLVE(L, U, π, b):</strong></div>
            <div>1) Subst. Progressiva (Ly = Pb = [8, 3, 7]ᵀ): y = [8, 1.4, 1.5]ᵀ</div>
            <div>2) Subst. Regressiva (Ux = y): <strong>x = [-1.4, 2.2, 0.6]ᵀ</strong></div>
          </div>
        `;
      } else {
        document.getElementById("m13-lup-output").innerHTML = `
          <div style="font-size: 0.86rem; font-family: monospace; line-height: 1.45;">
            <div><strong>Exercício 28.1-3 (p. 664):</strong></div>
            <div>A = [[1, 5, 4], [2, 0, 3], [5, 8, 2]], &nbsp; b = [12, 9, 5]ᵀ</div>
            <div style="margin-top: 6px; color: #38bdf8;"><strong>Resultado de LUP-DECOMPOSITION(A):</strong></div>
            <div>π = [3, 1, 2] &nbsp;(pivôs: |a₃₁|=5, depois |u₂₂|=3.4)</div>
            <div>L = [[1, 0, 0], [0.2, 1, 0], [0.4, -16/17, 1]]</div>
            <div>U = [[5, 8, 2], [0, 3.4, 3.6], [0, 0, 95/17]]</div>
            <div style="margin-top: 6px; color: #4ade80;"><strong>LUP-SOLVE(L, U, π, b):</strong></div>
            <div>1) Subst. Progressiva (Ly = Pb = [5, 12, 9]ᵀ): y = [5, 11, 300/17]ᵀ</div>
            <div>2) Subst. Regressiva (Ux = y): <strong>x = [-3/19, -6/19, 60/19]ᵀ</strong></div>
          </div>
        `;
      }
    }

    document.getElementById("m13-tab-simplex").addEventListener("click", () => {
      document.getElementById("m13-panel-simplex").style.display = "block";
      document.getElementById("m13-panel-mtlup").style.display = "none";
      document.getElementById("m13-tab-simplex").classList.add("primary");
      document.getElementById("m13-tab-mtlup").classList.remove("primary");
    });
    document.getElementById("m13-tab-mtlup").addEventListener("click", () => {
      document.getElementById("m13-panel-simplex").style.display = "none";
      document.getElementById("m13-panel-mtlup").style.display = "block";
      document.getElementById("m13-tab-mtlup").classList.add("primary");
      document.getElementById("m13-tab-simplex").classList.remove("primary");
      renderMTAndLUP();
    });
    document.getElementById("m13-lp-select").addEventListener("change", (e) => {
      currentLP = e.target.value;
      currentStep = 0;
      renderSimplex();
    });
    document.getElementById("m13-simplex-prev").addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        renderSimplex();
      }
    });
    document.getElementById("m13-simplex-next").addEventListener("click", () => {
      if (currentStep < lpData[currentLP].length - 1) {
        currentStep++;
        renderSimplex();
      }
    });
    document.getElementById("m13-mt-n").addEventListener("change", renderMTAndLUP);
    document.getElementById("m13-mt-p").addEventListener("change", renderMTAndLUP);
    document.getElementById("m13-lup-select").addEventListener("change", renderMTAndLUP);

    renderSimplex();
  }

  /* ========================================================================
     SEÇÃO 3: QUIZZES (10 QUESTÕES COM GABARITO COMENTADO — CAPS. 27, 28, 29 E AP. D)
     ======================================================================== */
  const quizzes = [
    {
      id: "q13-1",
      type: "Múltipla Escolha",
      reference: "Cap. 27, Seção 27.1 (pp. 628–634)",
      question:
        "Considere uma computação multithread executada em um computador paralelo ideal com P processadores sob um escalonador guloso, com trabalho T₁ e duração (caminho crítico) T_∞. Qual das alternativas abaixo enuncia CORRETAMENTE a Lei do Trabalho, a Lei da Duração, o Teorema 27.1 (Limite de Escalonamento Guloso) e o significado do paralelismo T₁ / T_∞?",
      options: [
        {
          letter: "A",
          text: "A Lei do Trabalho afirma que T_P ≥ T₁ / P; a Lei da Duração afirma que T_P ≥ T_∞; o Teorema 27.1 garante que qualquer escalonador guloso satisfaz T_P ≤ T₁ / P + T_∞ (pois há no máximo ⌊T₁/P⌋ etapas completas e no máximo T_∞ etapas incompletas); e o paralelismo T₁ / T_∞ é a aceleração máxima possível em qualquer número de processadores.",
          isCorrect: true,
          explanation:
            "Correta! Pela Seção 27.1 (pp. 629–632), em cada etapa completa os P processadores executam P unidades de trabalho (logo há ≤ T₁/P etapas completas) e cada etapa incompleta executa a fibra inicial de todo caminho crítico restante (reduzindo a duração de G' em 1, logo há ≤ T_∞ etapas incompletas)."
        },
        {
          letter: "B",
          text: "O Teorema 27.1 afirma que T_P = T₁ / (P · T_∞), permitindo aceleração superlinear T₁ / T_P > P sempre que T_∞ > 1.",
          isCorrect: false,
          explanation:
            "Incorreta. Pela Lei do Trabalho (T_P ≥ T₁ / P), a aceleração T₁ / T_P nunca pode exceder P (T₁ / T_P ≤ P) no modelo de computador paralelo ideal."
        },
        {
          letter: "C",
          text: "Em P-FIB(n), tanto o trabalho T₁(n) quanto a duração T_∞(n) são Θ(n), resultando em paralelismo constante Θ(1).",
          isCorrect: false,
          explanation:
            "Incorreta. Em P-FIB(n), a duração é T_∞(n) = Θ(n), mas o trabalho é igual ao da projeção serial FIB(n), ou seja, T₁(n) = Θ(φ^n), com paralelismo Θ(φ^n / n)."
        },
        {
          letter: "D",
          text: "Um laço parallel para i = 1 até n com corpo O(1) é compilado sequencialmente, adicionando Θ(n) à duração T_∞.",
          isCorrect: false,
          explanation:
            "Incorreta. Um laço parallel para de n iterações é implementado por uma árvore binária recursiva de divisão e conquista que adiciona apenas Θ(lg n) à duração T_∞ (p. 634)."
        }
      ]
    },
    {
      id: "q13-2",
      type: "Múltipla Escolha",
      reference: "Cap. 27, Seção 27.3 (pp. 644–651)",
      question:
        "Na Seção 27.3, por que o algoritmo MERGE-SORT-MT (que paraleliza as duas chamadas recursivas com spawn mas usa o procedimento MERGE serial) possui paralelismo pífio, e como P-MERGE e P-MERGE-SORT resolvem esse gargalo?",
      options: [
        {
          letter: "A",
          text: "MERGE-SORT-MT tem trabalho Θ(n²) e duração Θ(n lg n); P-MERGE reduz o trabalho para Θ(n).",
          isCorrect: false,
          explanation:
            "Incorreta. O trabalho de ambos é Θ(n lg n); a diferença crucial reside na duração T_∞(n)."
        },
        {
          letter: "B",
          text: "Porque em MERGE-SORT-MT a duração satisfaz T'_∞(n) = T'_∞(n/2) + Θ(n) = Θ(n), limitando o paralelismo a T'_1 / T'_∞ = Θ(n lg n)/Θ(n) = Θ(lg n); já P-MERGE usa busca binária do elemento mediano do maior subarranjo para reduzir o tamanho máximo das subintercalações em paralelo para ≤ 3n/4, alcançando duração PM_∞(n) = Θ(lg² n) com trabalho linear PM₁(n) = Θ(n), o que confere a P-MERGE-SORT trabalho T₁(n) = Θ(n lg n), duração T_∞(n) = Θ(lg³ n) e paralelismo Θ(n / lg² n).",
          isCorrect: true,
          explanation:
            "Correta! Esta é a análise exata da Seção 27.3 (pp. 644–651): P-MERGE reduz a duração da intercalação de Θ(n) para Θ(lg² n) mantendo o trabalho linear Θ(n), elevando o paralelismo de Θ(lg n) para Θ(n / lg² n)."
        },
        {
          letter: "C",
          text: "P-MERGE alcança duração Θ(1) porque ordena todos os elementos em um único passo sem comparações.",
          isCorrect: false,
          explanation:
            "Incorreta. P-MERGE executa BINARY-SEARCH em Θ(lg n) em cada um dos Θ(lg n) níveis de recursão (fator 3/4), tendo duração Θ(lg² n)."
        },
        {
          letter: "D",
          text: "P-MERGE aumenta o trabalho total de P-MERGE-SORT para Θ(n lg² n).",
          isCorrect: false,
          explanation:
            "Incorreta. Como provado nas páginas 648–649 pelo método de substituição, o trabalho de P-MERGE permanece estritamente linear PM₁(n) = Θ(n), logo o trabalho de P-MERGE-SORT permanece ótimo em Θ(n lg n)!"
        }
      ]
    },
    {
      id: "q13-3",
      type: "Múltipla Escolha",
      reference: "Apêndice D (pp. 982–988)",
      question:
        "Com base nos Teoremas D.1 a D.6 do Apêndice D sobre matrizes, posto, vetores anuladores, determinantes e matrizes positivas definidas, assinale a alternativa CORRETA:",
      options: [
        {
          letter: "A",
          text: "Uma matriz A de dimensão m × n pode ter posto linha estritamente diferente de seu posto coluna quando m ≠ n.",
          isCorrect: false,
          explanation:
            "Incorreta. Uma propriedade fundamental de qualquer matriz A (p. 985) é que seu posto linha é sempre idêntico ao seu posto coluna."
        },
        {
          letter: "B",
          text: "Para uma matriz P de permutação n × n, sua inversa é P⁻¹ = -P, e multiplicar PA permuta as colunas de A.",
          isCorrect: false,
          explanation:
            "Incorreta. Pelo Exercício D.1-4 e D.2-3 (pp. 984, 987), PA permuta as linhas de A, AP permuta as colunas de A, e a inversa de uma matriz de permutação é sua transposta: P⁻¹ = Pᵀ."
        },
        {
          letter: "C",
          text: "Uma matriz A (m × n) tem posto coluna completo (igual a n) se e somente se não possui vetor anulador não nulo (Ax = 0 ⇒ x = 0, Teorema D.2); além disso, para qualquer matriz A com posto coluna completo, a matriz simétrica AᵀA é positiva definida (xᵀ(AᵀA)x = ||Ax||² > 0 para todo x ≠ 0, Teorema D.6).",
          isCorrect: true,
          explanation:
            "Correta! Pelos Teoremas D.2 e D.6 (pp. 985–987), posto coluna completo equivale à ausência de vetor anulador não nulo, o que implica ||Ax||² > 0 para todo x ≠ 0 e, portanto, que AᵀA é positiva definida."
        },
        {
          letter: "D",
          text: "Trocar duas linhas de uma matriz quadrada A não altera o sinal de det(A).",
          isCorrect: false,
          explanation:
            "Incorreta. Pelo Teorema D.4 (p. 986), trocar quaisquer duas linhas (ou colunas) de A multiplica det(A) por -1."
        }
      ]
    },
    {
      id: "q13-4",
      type: "Múltipla Escolha",
      reference: "Cap. 28, Seção 28.1 (pp. 653–664)",
      question:
        "Sobre a resolução de sistemas lineares Ax = b usando Decomposição LUP (PA = LU) com os procedimentos LUP-DECOMPOSITION(A) e LUP-SOLVE(L, U, π, b), qual afirmação está CORRETA?",
      options: [
        {
          letter: "A",
          text: "Na decomposição PA = LU, L é uma matriz triangular inferior unitária (com 1s na diagonal principal), U é uma matriz triangular superior (cujos elementos diagonais são os pivôs), LUP-DECOMPOSITION leva tempo Θ(n³) usando pivoteamento parcial (escolhendo o elemento de maior valor absoluto na coluna k como pivô para evitar divisão por zero e instabilidade numérica), e cada chamada subsequente a LUP-SOLVE resolve Ly = Pb e Ux = y em tempo Θ(n²).",
          isCorrect: true,
          explanation:
            "Correta! Como detalhado na Seção 28.1 (pp. 654–662), fatoramos PA = LU uma única vez em Θ(n³) e resolvemos o sistema triangular duplo (substituição progressiva Ly = Pb e regressiva Ux = y) em Θ(n²)."
        },
        {
          letter: "B",
          text: "Se uma matriz quadrada A é não singular (det(A) ≠ 0), o procedimento LU-DECOMPOSITION sem pivoteamento nunca falha por divisão por zero.",
          isCorrect: false,
          explanation:
            "Incorreta! Mesmo para a matriz não singular A = [[0, 1], [1, 0]] (det(A) = -1), o primeiro pivô é a₁₁ = 0 e LU-DECOMPOSITION divide por zero imediatamente (p. 658)."
        },
        {
          letter: "C",
          text: "LUP-SOLVE executa em tempo Θ(n³) e LUP-DECOMPOSITION executa em tempo Θ(n²).",
          isCorrect: false,
          explanation:
            "Incorreta. Os custos são exatamente o oposto: LUP-DECOMPOSITION tem três laços aninhados (Θ(n³)), enquanto LUP-SOLVE tem dois laços aninhados (Θ(n²))."
        },
        {
          letter: "D",
          text: "Ao trocar as linhas k e k' em LUP-DECOMPOSITION, trocamos apenas as colunas j ≥ k da matriz A, mantendo inalteradas as colunas 1 .. k-1 que guardam os elementos de L.",
          isCorrect: false,
          explanation:
            "Incorreta! Nas linhas 14–15 de LUP-DECOMPOSITION (p. 661), o laço troca as linhas inteiras para i = 1 até n, pois na dedução algébrica (Equação 28.12) a matriz de permutação P' multiplica também o vetor v / a_{k1} das colunas anteriores de L!"
        }
      ]
    },
    {
      id: "q13-5",
      type: "Múltipla Escolha",
      reference: "Cap. 28, Seções 28.2 e 28.3 (pp. 665–674)",
      question:
        "Assinale a alternativa que descreve CORRETAMENTE a equivalência assintótica entre multiplicação e inversão de matrizes (Teoremas 28.1 e 28.2), as propriedades de matrizes simétricas positivas definidas (Corolário 28.5) e a aproximação por mínimos quadrados:",
      options: [
        {
          letter: "A",
          text: "Pelo Teorema 28.2, podemos multiplicar duas matrizes n × n A e B em tempo O(I(n)) invertendo a matriz triangular em blocos 3n × 3n D = [[I_n, A, 0], [0, I_n, B], [0, 0, I_n]], cuja inversa D⁻¹ contém exatamente o produto AB no bloco superior direito; pelo Corolário 28.5, toda matriz simétrica positiva definida admite decomposição LU sem pivoteamento; e no ajuste por mínimos quadrados min ||Ac - y||², o vetor ótimo c satisfaz a equação normal AᵀAc = Aᵀy, dada por c = A⁺y com pseudoinversa A⁺ = (AᵀA)⁻¹Aᵀ.",
          isCorrect: true,
          explanation:
            "Correta! Esta alternativa sintetiza com precisão os Teoremas 28.1–28.2 (pp. 666–668), os Lemas 28.3–28.4 e o Corolário 28.5 (pp. 669–671) e a dedução das equações normais (28.18)–(28.19) na página 672."
        },
        {
          letter: "B",
          text: "Inverter uma matriz n × n exige inevitavelmente tempo Ω(n³), mesmo que disponhamos de um algoritmo de multiplicação de matrizes em O(n^{2,37}).",
          isCorrect: false,
          explanation:
            "Incorreta. Pelo Teorema 28.1 (p. 666), se multiplicamos matrizes em M(n), podemos inverter matrizes em O(M(n))!"
        },
        {
          letter: "C",
          text: "A pseudoinversa de uma matriz A (m × n com m > n e posto coluna completo) é definida como A⁺ = Aᵀ(AᵀA)⁻¹.",
          isCorrect: false,
          explanation:
            "Incorreta. Como AᵀA tem dimensão n × n e Aᵀ tem dimensão n × m, a expressão correta que resulta em uma matriz n × m é A⁺ = (AᵀA)⁻¹Aᵀ (Equação 28.19, p. 672)."
        },
        {
          letter: "D",
          text: "O complemento de Schur de uma matriz simétrica positiva definida pode ser singular.",
          isCorrect: false,
          explanation:
            "Incorreta. Pelo Lema 28.4 (p. 670), o complemento de Schur de qualquer matriz simétrica positiva definida é simétrico e positivo definido, logo sempre não singular."
        }
      ]
    },
    {
      id: "q13-6",
      type: "Múltipla Escolha",
      reference: "Cap. 29, Seções 29.1 e 29.2 (pp. 682–694)",
      question:
        "Sobre a conversão de programas lineares para a Forma Padrão e Forma de Folgas (Seção 29.1) e a formulação de problemas em grafos como programas lineares (Seção 29.2), qual das afirmações abaixo é VERDADEIRA?",
      options: [
        {
          letter: "A",
          text: "Para converter uma variável irrestrita em sinal x_j ∈ ℝ para a forma padrão, basta substituir x_j por uma única variável não negativa x'_j ≥ 0.",
          isCorrect: false,
          explanation:
            "Incorreta. Uma única variável não negativa não pode assumir valores negativos! Devemos substituir x_j pela diferença de duas novas variáveis não negativas: x_j = x'_j - x''_j com x'_j, x''_j ≥ 0 (p. 684)."
        },
        {
          letter: "B",
          text: "Na formulação de Caminhos Mínimos de Fonte Única (s ↝ t) como um programa linear (Equações 29.44–29.46, p. 690), a função objetivo é minimizar d_t sujeito a d_v ≥ d_u + w(u, v).",
          isCorrect: false,
          explanation:
            "Incorreta! No programa linear de caminhos mínimos (p. 690), a função objetivo é MAXIMIZAR d_t sujeito às restrições de desigualdade triangular d_v ≤ d_u + w(u, v) para toda aresta (u, v) ∈ E e d_s = 0."
        },
        {
          letter: "C",
          text: "Na Forma Padrão, maximizamos cᵀx sujeito a Ax ≤ b e x ≥ 0; na Forma de Folgas (N, B, A, b, c, v), introduzimos m variáveis básicas de folga x_{n+i} = b_i - ∑_{j=1}^n a_{ij} x_j ≥ 0; e para o problema de Fluxo de Multimercadorias (Seção 29.2, p. 693), a Programação Linear é o único algoritmo de tempo polinomial conhecido.",
          isCorrect: true,
          explanation:
            "Correta! Todas as três afirmações estão exatamente nas Seções 29.1 e 29.2 (pp. 682–693)."
        },
        {
          letter: "D",
          text: "Se um programa linear na forma padrão tem n variáveis e m restrições de desigualdade, sua forma de folgas possui n variáveis básicas e m variáveis não básicas.",
          isCorrect: false,
          explanation:
            "Incorreta. Há exatamente m variáveis básicas (|B| = m, uma para cada restrição de igualdade) e n variáveis não básicas (|N| = n)."
        }
      ]
    },
    {
      id: "q13-7",
      type: "Múltipla Escolha",
      reference: "Cap. 29, Seção 29.3 (pp. 698–707)",
      question:
        "No algoritmo SIMPLEX(A, b, c), suponha que escolhemos uma variável não básica de entrada x_e com c_e > 0. Como determinamos a variável básica de saída x_l, quando detectamos que o problema é ilimitado, e como a Regra de Bland evita a ciclagem?",
      options: [
        {
          letter: "A",
          text: "Calculamos Δ_i = b_i / a_{ie} para cada i ∈ B com a_{ie} > 0 (e Δ_i = ∞ se a_{ie} ≤ 0) e escolhemos l ∈ B que minimiza Δ_i; se Δ_l = ∞ (isto é, a_{ie} ≤ 0 para todo i ∈ B), o programa linear é ilimitado; quando b_l = 0 ocorre um pivô degenerado (que não aumenta v), e a Regra de Bland evita ciclagem escolhendo sempre o menor índice e ∈ N com c_e > 0 e, em caso de empate em Δ_i, o menor índice l ∈ B, garantindo terminação em no máximo C(n+m, m) iterações (Teorema 29.6).",
          isCorrect: true,
          explanation:
            "Correta! Esta é a mecânica exata de SIMPLEX, PIVOT, degenerescência e da Regra de Bland (pp. 698–707)."
        },
        {
          letter: "B",
          text: "Escolhemos l ∈ B que maximiza b_i / a_{ie} para aumentar o valor objetivo o máximo possível.",
          isCorrect: false,
          explanation:
            "Incorreta. Escolher uma razão maior que o mínimo violaria as restrições de não negatividade das variáveis básicas mais restritivas!"
        },
        {
          letter: "C",
          text: "Para um mesmo subconjunto B de m variáveis básicas, podem existir infinitas formas de folgas distintas com diferentes matrizes A' e vetores b'.",
          isCorrect: false,
          explanation:
            "Incorreta. O Lema 29.4 (p. 704) demonstra que o conjunto de variáveis básicas B determina de maneira ÚNICA toda a forma de folgas (N, B, A', b', c', v')!"
        },
        {
          letter: "D",
          text: "Um pivô degenerado ocorre quando c_e = 0 e faz o valor objetivo diminuir estritamente.",
          isCorrect: false,
          explanation:
            "Incorreta. Um pivô degenerado ocorre quando b_l = 0 (logo Δ_l = 0), mantendo o valor objetivo v̂ = v + c_e Δ_l = v inalterado."
        }
      ]
    },
    {
      id: "q13-8",
      type: "Múltipla Escolha",
      reference: "Cap. 29, Seção 29.4 (pp. 707–714)",
      question:
        "Seja o programa linear primal: maximizar cᵀx sujeito a Ax ≤ b e x ≥ 0. Qual é o seu programa linear dual, o que afirma a Dualidade Fraca (Lema 29.8) e como obtemos a solução ótima dual y* a partir da forma de folgas final do SIMPLEX (Teorema 29.10)?",
      options: [
        {
          letter: "A",
          text: "O dual é minimizar bᵀy sujeito a Aᵀy ≥ c e y ≥ 0; pela Dualidade Fraca, para quaisquer soluções viáveis x (primal) e y (dual) vale cᵀx ≤ bᵀy; e na forma de folgas final ótima do SIMPLEX, a solução ótima dual é dada por y*_i = -c'_{n+i} se (n+i) ∈ N e y*_i = 0 se (n+i) ∈ B, satisfazendo cᵀx* = bᵀy* = v'.",
          isCorrect: true,
          explanation:
            "Correta! Pela Seção 29.4 (pp. 708–711), os coeficientes finais c'_{n+i} das variáveis de folga originais na função objetivo fornecem (com sinal trocado) os multiplicadores ótimos duais y*_i!"
        },
        {
          letter: "B",
          text: "O dual é maximizar bᵀy sujeito a Aᵀy ≤ c e y ≥ 0, e pela Dualidade Fraca vale cᵀx ≥ bᵀy.",
          isCorrect: false,
          explanation:
            "Incorreta. O dual de um problema de maximização na forma padrão é um problema de minimização com restrições ≥, e o valor de qualquer solução primal viável é menor ou igual ao de qualquer solução dual viável (cᵀx ≤ bᵀy)."
        },
        {
          letter: "C",
          text: "Se o programa linear primal é ilimitado, então o seu programa linear dual possui uma solução ótima finita.",
          isCorrect: false,
          explanation:
            "Incorreta! Pela Dualidade Fraca (Lema 29.8), se o dual tivesse qualquer solução viável y, bᵀy seria um limite superior finito para cᵀx; logo, se o primal é ilimitado, o dual é obrigatoriamente INVIÁVEL!"
        },
        {
          letter: "D",
          text: "O dual do dual de um programa linear na forma padrão é diferente do programa linear primal original.",
          isCorrect: false,
          explanation:
            "Incorreta. Pelo Exercício 29.4-5 (p. 714), o dual do dual de qualquer programa linear é exatamente o próprio programa linear primal."
        }
      ]
    },
    {
      id: "q13-9",
      type: "Múltipla Escolha",
      reference: "Cap. 29, Seção 29.5 (pp. 714–721)",
      question:
        "No procedimento INITIALIZE-SIMPLEX(A, b, c), quando o menor elemento b_k do vetor b é estritamente negativo (b_k < 0), como o programa linear auxiliar L_aux é formulado e qual operação transforma imediatamente a solução básica de L_aux em uma solução básica viável?",
      options: [
        {
          letter: "A",
          text: "Multiplicamos todas as restrições com b_i < 0 por -1 e chamamos SIMPLEX diretamente.",
          isCorrect: false,
          explanation:
            "Incorreta. Multiplicar uma restrição ≤ por -1 a transforma em uma restrição ≥, destruindo a forma padrão!"
        },
        {
          letter: "B",
          text: "Formulamos L_aux para maximizar -x₀ sujeito a ∑_{j=1}^n a_{ij} x_j - x₀ ≤ b_i (para i = 1..m) e x_j ≥ 0 (para j = 0..n); em seguida, executamos um único PIVOT(N, B, A, b, c, v, l, 0) onde x₀ entra na base e x_l = x_{n+k} (correspondente ao mais negativo b_k) sai da base, tornando todos os novos termos constantes b̂_0 = -b_k > 0 e b̂_i = b_i - b_k ≥ 0; finalmente resolvemos L_aux com SIMPLEX, e L é viável se e somente se o valor ótimo de L_aux é 0 (Lema 29.11).",
          isCorrect: true,
          explanation:
            "Correta! Esta é a descrição exata do Lema 29.11, de INITIALIZE-SIMPLEX e da prova do Lema 29.12 nas páginas 715–719."
        },
        {
          letter: "C",
          text: "Sempre que b_k < 0 para algum k, o programa linear original L é automaticamente inviável.",
          isCorrect: false,
          explanation:
            "Incorreta. Como mostrado no exemplo das Equações (29.102)–(29.105) na página 714, um programa linear pode ter b_k < 0 (solução básica inicial inviável) e ainda assim ser perfeitamente viável!"
        },
        {
          letter: "D",
          text: "L é viável se e somente se o valor objetivo ótimo de L_aux (maximizar -x₀) for estritamente positivo (> 0).",
          isCorrect: false,
          explanation:
            "Incorreta. Como x₀ ≥ 0, a função objetivo -x₀ nunca pode ser positiva (é sempre ≤ 0); o ótimo é 0 se e somente se L é viável."
        }
      ]
    },
    {
      id: "q13-10",
      type: "Verdadeiro ou Falso",
      reference: "Cap. 27, Seção 27.1 (p. 635) e Exercício 27.1-6 (p. 637)",
      question:
        "Julgue a afirmação a seguir: 'Em uma computação multithread dinâmica, se duas fibras u e v executam logicamente em paralelo (não há caminho dirigido entre u e v no GAD de computação G) e ambas apenas LEEM a mesma variável compartilhada x na memória sem que nenhuma fibra escreva em x, então ocorre uma corrida de determinismo (determinacy race).'",
      options: [
        {
          letter: "V",
          text: "Verdadeiro — qualquer acesso simultâneo à mesma posição de memória por duas fibras em paralelo constitui uma corrida de determinismo.",
          isCorrect: false,
          explanation:
            "Falso! Pela definição formal da página 635, uma corrida de determinismo ocorre somente quando dois acessos logicamente em paralelo à mesma posição de memória incluem PELO MENOS UMA ESCRITA. Leituras simultâneas (read-read) são totalmente seguras e determinísticas."
        },
        {
          letter: "F",
          text: "Falso — leituras concorrentes da mesma posição de memória não causam corrida de determinismo; uma corrida de determinismo exige que duas instruções logicamente em paralelo acessem a mesma posição de memória e que pelo menos uma delas execute uma escrita (write).",
          isCorrect: true,
          explanation:
            "Correta! Duas fibras em paralelo podem ler a mesma posição de memória livremente sem qualquer corrida de determinismo (p. 635)."
        }
      ]
    }
  ];

  /* ========================================================================
     SEÇÃO 4: EXERCÍCIOS E PROBLEMAS CANÔNICOS (8 EXERCÍCIOS — CAPS. 27, 28, 29 E AP. D)
     ======================================================================== */
  const exercicios = [
    {
      id: "ex13-1",
      code: "EXERCÍCIO 01 • EFICIÊNCIA PARALELA, LEI DO TRABALHO E LEI DA DURAÇÃO",
      reference: "Exercícios 27.1-2 e 27.1-3 (p. 637)",
      title: "Análise de Eficiência em Escalonamento Guloso e Limite de Processadores a Partir de T₁, T_∞ e T_P",
      prompt: `
        <p>Resolva os dois exercícios fundamentais da Seção 27.1 sobre limites de desempenho em multithreading dinâmico:</p>
        <ol>
          <li><strong>(Exercício 27.1-2)</strong> Suponha que uma computação multithread leve tempo $T_1 = 2.048\\text{ s}$ em $1$ processador e tenha duração $T_\\infty = 32\\text{ s}$. Qual é o paralelismo da computação? Usando a Lei do Trabalho, a Lei da Duração e o Teorema 27.1, dê limites inferior e superior para o tempo de execução $T_P$ em $P = 16$ processadores e em $P = 128$ processadores.</li>
          <li><strong>(Exercício 27.1-3)</strong> Suponha que um algoritmo multithread seja executado em tempos $T_4 = 80\\text{ s}$ (em $4$ processadores) e $T_{10} = 42\\text{ s}$ (em $10$ processadores) sob um escalonador guloso ideal, mas que você não conheça $T_1$ nem $T_\\infty$. Usando as leis de desempenho (supondo que na prática $T_P \\approx T_1/P + T_\\infty$), estime $T_1$, $T_\\infty$ e o tempo $T_{64}$ em $64$ processadores.</li>
        </ol>
      `,
      placeholder:
        "Para o item 1, calcule T₁ / T_∞ = 2048 / 32 = 64 e use max(T₁/P, T_∞) ≤ T_P ≤ T₁/P + T_∞; para o item 2, resolva o sistema linear T₁/4 + T_∞ = 80 e T₁/10 + T_∞ = 42...",
      solution: `
        <h4>1. Resolução do Item 1 (Exercício 27.1-2)</h4>
        <ul>
          <li><strong>Paralelismo da Computação:</strong>
            $$\\text{Paralelismo} = \\frac{T_1}{T_\\infty} = \\frac{2.048}{32} = \\mathbf{64}.$$
          </li>
          <li><strong>Limites Gerais para $T_P$:</strong> Pela Lei do Trabalho ($T_P \\ge T_1 / P$), pela Lei da Duração ($T_P \\ge T_\\infty$) e pelo Teorema 27.1 ($T_P \\le T_1 / P + T_\\infty$), temos para qualquer $P$:
            $$\\max\\!\\left(\\frac{T_1}{P}, \\, T_\\infty\\right) \\le T_P \\le \\frac{T_1}{P} + T_\\infty.$$
          </li>
          <li><strong>Para $P = 16$ processadores ($P < T_1 / T_\\infty = 64$):</strong> Temos $T_1 / 16 = 2.048 / 16 = 128\\text{ s}$. Logo:
            $$\\max(128, 32) \\le T_{16} \\le 128 + 32 \\implies \\mathbf{128\\text{ s} \\le T_{16} \\le 160\\text{ s}}.$$
          </li>
          <li><strong>Para $P = 128$ processadores ($P > T_1 / T_\\infty = 64$):</strong> Temos $T_1 / 128 = 2.048 / 128 = 16\\text{ s} < T_\\infty = 32\\text{ s}$. Logo a Lei da Duração domina o limite inferior:
            $$\\max(16, 32) \\le T_{128} \\le 16 + 32 \\implies \\mathbf{32\\text{ s} \\le T_{128} \\le 48\\text{ s}}.$$
          </li>
        </ul>

        <h4>2. Resolução do Item 2 (Exercício 27.1-3)</h4>
        <p>Modelando $T_P \\approx T_1 / P + T_\\infty$ para $P = 4$ e $P = 10$, obtemos o sistema linear:</p>
        $$\\begin{cases} \\dfrac{T_1}{4} + T_\\infty = 80 \\\\[6pt] \\dfrac{T_1}{10} + T_\\infty = 42 \\end{cases} \\implies \\left(\\frac{1}{4} - \\frac{1}{10}\\right) T_1 = 80 - 42 \\implies \\frac{3}{20} T_1 = 38 \\implies \\mathbf{T_1 = \\frac{760}{3} \\approx 253,33\\text{ s}}.$$
        <p>Substituindo $T_1$ na primeira equação:</p>
        $$T_\\infty = 80 - \\frac{760}{12} = 80 - \\frac{190}{3} = \\mathbf{\\frac{50}{3} \\approx 16,67\\text{ s}}.$$
        <p>Portanto, para $P = 64$ processadores, a estimativa de tempo é:</p>
        $$T_{64} \\approx \\frac{T_1}{64} + T_\\infty = \\frac{760 / 3}{64} + \\frac{50}{3} = \\frac{95}{24} + \\frac{400}{24} = \\mathbf{\\frac{495}{24} = 20,625\\text{ s}}. \\quad \\blacksquare$$
      `
    },
    {
      id: "ex13-2",
      code: "EXERCÍCIO 02 • CORRIDA DE DETERMINISMO E MULTIPLICAÇÃO MATRIZ-VETOR",
      reference: "Exercício 27.1-6 (p. 637)",
      title: "Identificar e Eliminar a Corrida de Determinismo em MAT-VEC-WRONG e Analisar T₁, T_∞ e Paralelismo",
      prompt: `
        <p><strong>(Exercício 27.1-6)</strong> O procedimento <code>MAT-VEC(A, x)</code> multiplica uma matriz $A$ ($n \\times n$) por um vetor $x$ de comprimento $n$ usando dois laços <code>parallel para</code> para inicializar $y_i = 0$ e calcular a linha $i$, mantendo o laço interno $j = 1..n$ serial. Um programador propôs substituir o laço interno serial por um laço paralelo conforme abaixo:</p>
        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">MAT-VEC-WRONG(A, x)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">n = A.linhas</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">seja</span> y um novo vetor de comprimento n</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">parallel</span> <span class="kw">para</span> i = 1 até n</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   y_i = 0</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">parallel</span> <span class="kw">para</span> i = 1 até n</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">   <span class="kw">parallel</span> <span class="kw">para</span> j = 1 até n</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">       y_i = y_i + a_{ij} x_j</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content"><span class="kw">retorne</span> y</span></div>
            </div>
          </div>
        <p>Explique por que <code>MAT-VEC-WRONG</code> é incorreto (possui corrida de determinismo), analise o trabalho $T_1$, a duração $T_\\infty$ e o paralelismo de <code>MAT-VEC</code> (com a linha 6 serial), e mostre como paralelizar também o somatório da linha 6 usando divisão e conquista recursiva sem corridas para alcançar duração $\\Theta(\\lg n)$!</p>
      `,
      placeholder:
        "Observe que na linha 7 de MAT-VEC-WRONG, para um mesmo i fixo, diferentes iterações j = 1..n em paralelo leem e escrevem na mesma posição de memória y_i...",
      solution: `
        <h4>1. Corrida de Determinismo em <code>MAT-VEC-WRONG</code></h4>
        <p>Na linha 7 (<code>y_i = y_i + a_{ij} x_j</code>), para um índice de linha $i$ fixo, todas as $n$ iterações $j = 1, 2, \\dots, n$ do laço <code>parallel para j = 1 até n</code> (linha 6) são executadas <strong>logicamente em paralelo</strong> e todas <strong>leem e escrevem na mesma variável $y_i$</strong>! Isso constitui uma <strong>corrida de determinismo clássica</strong> (atualizações concorrentes se sobrescrevem e são perdidas).</p>

        <h4>2. Análise de <code>MAT-VEC</code> (Com a Linha 6 Serial: <code>para j = 1 até n</code>)</h4>
        <ul>
          <li><strong>Trabalho $T_1(n)$:</strong> A projeção serial realiza $n^2$ somas e multiplicações: $T_1(n) = \\mathbf{\\Theta(n^2)}$.</li>
          <li><strong>Duração $T_\\infty(n)$:</strong> O primeiro <code>parallel para</code> (linhas 3–4) tem duração $\\Theta(\\lg n)$. O segundo <code>parallel para</code> (linha 5) tem árvore de geração $\\Theta(\\lg n)$, e cada folha executa um laço serial de $n$ iterações (linhas 6–7) com duração $\\Theta(n)$. Logo:
            $$T_\\infty(n) = \\Theta(\\lg n) + \\Theta(\\lg n) + \\Theta(n) = \\mathbf{\\Theta(n)}.$$
          </li>
          <li><strong>Paralelismo:</strong> $T_1(n) / T_\\infty(n) = \\Theta(n^2) / \\Theta(n) = \\mathbf{\\Theta(n)}$.</li>
        </ul>

        <h4>3. Reduzindo a Duração para $\\Theta(\\lg n)$ Sem Corridas (Árvore de Redução Recursiva)</h4>
        <p>Substituímos o laço interno serial das linhas 6–7 por uma chamada a uma função recursiva de redução paralela <code>y_i = P-DOT-PRODUCT(A, x, i, 1, n)</code>:</p>
        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">P-DOT-PRODUCT(A, x, i, j₁, j₂)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">se</span> j₁ == j₂</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">   <span class="kw">retorne</span> a_{i, j₁} · x_{j₁}</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">meio = ⌊(j₁ + j₂) / 2⌋</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">esq = <span class="kw">spawn</span> P-DOT-PRODUCT(A, x, i, j₁, meio)</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">dir = P-DOT-PRODUCT(A, x, i, meio + 1, j₂)</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">sync</span></span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">retorne</span> esq + dir</span></div>
            </div>
          </div>
        <p>Como cada chamada escreve apenas em suas variáveis locais <code>esq</code> e <code>dir</code> na pilha e soma após o <code>sync</code>, o código é <strong>100% livre de corridas</strong>, tem trabalho $\\Theta(n)$ por linha (total $T_1(n) = \\Theta(n^2)$) e duração $\\Theta(\\lg n)$ por linha, resultando em duração total $T_\\infty(n) = \\Theta(\\lg n) + \\Theta(\\lg n) = \\mathbf{\\Theta(\\lg n)}$ e paralelismo $\\mathbf{\\Theta(n^2 / \\lg n)}$! $\\blacksquare$</p>
      `
    },
    {
      id: "ex13-3",
      code: "EXERCÍCIO 03 • INTERCALAÇÃO PARALELA P-MERGE PASSO A PASSO",
      reference: "Exercícios 27.3-1 e 27.3-2 (p. 651)",
      title: "Rastreamento de P-MERGE e Prova de Que a Mediana da União Está Entre as Medianas dos Dois Subarranjos",
      prompt: `
        <p>Considere o algoritmo de intercalação multithread <code>P-MERGE(T, p₁, r₁, p₂, r₂, A, p₃)</code> da Seção 27.3 (p. 647):</p>
        <ol>
          <li><strong>(Rastreamento de <code>P-MERGE</code>)</strong> Execute o primeiro nível de <code>P-MERGE(T, 1, 5, 6, 9, A, 1)</code> para intercalar o primeiro subarranjo ordenado $T[1..5] = \\langle 2, 5, 8, 12, 16 \\rangle$ ($n_1 = 5$) com o segundo subarranjo ordenado $T[6..9] = \\langle 3, 7, 10, 15 \\rangle$ ($n_2 = 4$) dentro de $A[1..9]$, determinando explicitamente $q_1, T[q_1], q_2, q_3$, a posição gravada em $A[q_3]$ e os dois subproblemas gerados nas linhas 13 e 14.</li>
          <li><strong>(Exercício 27.3-2 — Mediana de Dois Arranjos Ordenados em $\\Theta(\\lg n)$)</strong> Descreva um algoritmo serial (ou multithread) de tempo $O(\\lg n)$ para encontrar a mediana total de $n = n_1 + n_2$ elementos distribuídos em dois arranjos já ordenados $T[p_1 .. r_1]$ e $T[p_2 .. r_2]$.</li>
        </ol>
      `,
      placeholder:
        "No item 1, calcule q₁ = ⌊(1+5)/2⌋ = 3 (T[3] = 8), encontre q₂ em T[6..9] = ⟨3, 7, 10, 15⟩ tal que T[q₂] ≥ 8 (q₂ = 8, onde T[8] = 10) e q₃ = 1 + (3-1) + (8-6) = 5...",
      solution: `
        <h4>1. Rastreamento do Primeiro Nível de <code>P-MERGE(T, 1, 5, 6, 9, A, 1)</code></h4>
        <ul>
          <li><strong>Tamanhos:</strong> $n_1 = 5 - 1 + 1 = 5$ e $n_2 = 9 - 6 + 1 = 4$. Como $n_1 \\ge n_2$, não trocamos os intervalos nas linhas 3–6.</li>
          <li><strong>Linha 9 (Mediana do Primeiro Subarranjo):</strong>
            $$q_1 = \\lfloor (1 + 5) / 2 \\rfloor = \\mathbf{3} \\implies x = T[q_1] = T[3] = \\mathbf{8}.$$
          </li>
          <li><strong>Linha 10 (Busca Binária no Segundo Subarranjo $T[6..9] = \\langle 3, 7, 10, 15 \\rangle$):</strong> <code>BINARY-SEARCH(8, T, 6, 9)</code> retorna o menor índice $q_2 \\in [6, 10]$ tal que $T[6 .. q_2 - 1] \\le 8$ e $T[q_2 .. 9] \\ge 8$. Como $T[6]=3 < 8$, $T[7]=7 < 8$ e $T[8]=10 \\ge 8$, obtemos:
            $$q_2 = \\mathbf{8}.$$
          </li>
          <li><strong>Linhas 11–12 (Posição Exata no Arranjo de Saída $A$):</strong>
            $$q_3 = p_3 + (q_1 - p_1) + (q_2 - p_2) = 1 + (3 - 1) + (8 - 6) = 1 + 2 + 2 = \\mathbf{5}, \\quad A[5] = T[3] = \\mathbf{8}.$$
          </li>
          <li><strong>Linhas 13–14 (Duas Chamadas Recursivas em Paralelo):</strong>
            <ul>
              <li>Linha 13 (<code>spawn</code>): <code>P-MERGE(T, 1, 2, 6, 7, A, 1)</code> — intercala $\\langle 2, 5 \\rangle$ com $\\langle 3, 7 \\rangle$ gravando em $A[1..4]$;</li>
              <li>Linha 14 (chamada): <code>P-MERGE(T, 4, 5, 8, 9, A, 6)</code> — intercala $\\langle 12, 16 \\rangle$ com $\\langle 10, 15 \\rangle$ gravando em $A[6..9]$.</li>
            </ul>
          </li>
        </ul>

        <h4>2. Encontrando a Mediana (ou $k$-ésimo Menor Elemento) de Dois Arranjos Ordenados em $O(\\lg n)$ (Exercício 27.3-2)</h4>
        <p>Para encontrar o $k$-ésimo menor elemento (para a mediana, $k = \\lfloor (n+1)/2 \\rfloor$) da união de dois subarranjos ordenados $A[p_1 .. r_1]$ ($n_1$ elementos) e $B[p_2 .. r_2]$ ($n_2$ elementos, assumindo $n_1 \\ge n_2$):</p>
        <ol>
          <li>Se $n_2 = 0$, retornamos imediatamente $A[p_1 + k - 1]$. Se $k = 1$, retornamos $\\min(A[p_1], B[p_2])$.</li>
          <li>Escolhemos $i = \\min(n_1, \\lfloor k/2 \\rfloor)$ e $j = \\min(n_2, k - i)$ (de modo que $i + j = k$) e comparamos $x = A[p_1 + i - 1]$ com $y = B[p_2 + j - 1]$:
            <ul>
              <li>Se $x \\le y$: os elementos $A[p_1 .. p_1 + i - 1]$ ($i$ elementos) são menores ou iguais a pelo menos $n_1 - i + n_2 - j + 1$ elementos, logo nenhum dos primeiros $i$ elementos de $A$ pode superar o $k$-ésimo menor elemento! Descartamos $A[p_1 .. p_1 + i - 1]$ e buscamos o $(k - i)$-ésimo menor em $A[p_1 + i .. r_1]$ e $B[p_2 .. r_2]$.</li>
              <li>Se $x > y$: simetricamente, descartamos os primeiros $j$ elementos de $B$ ($B[p_2 .. p_2 + j - 1]$) e buscamos o $(k - j)$-ésimo menor em $A[p_1 .. r_1]$ e $B[p_2 + j .. r_2]$.</li>
            </ul>
          </li>
        </ol>
        <p>Em cada etapa $O(1)$, descartamos pelo menos $\\lfloor k/2 \\rfloor$ candidatos (ou esgotamos o menor arranjo), reduzindo $k$ pela metade a cada passo e terminando em tempo $\\mathbf{O(\\lg(\\min(n_1, n_2))) = O(\\lg n)}$! $\\blacksquare$</p>
      `
    },
    {
      id: "ex13-4",
      code: "EXERCÍCIO 04 • RESOLUÇÃO DE SISTEMA LINEAR VIA DECOMPOSIÇÃO LUP PASSO A PASSO",
      reference: "Exercício 28.1-3 (p. 664)",
      title: "Resolver o Sistema Linear 3×3 do Exercício 28.1-3 Calculando Explicita e Manualmente PA = LU, Ly = Pb e Ux = y",
      prompt: `
        <p><strong>(Exercício 28.1-3, p. 664)</strong> Resolva a equação matricial $Ax = b$ utilizando a <strong>decomposição LUP</strong> passo a passo (mostrando as matrizes $P, L, U$ e os vetores $y$ e $x$):</p>
        $$\\begin{pmatrix} 1 & 5 & 4 \\\\ 2 & 0 & 3 \\\\ 5 & 8 & 2 \\end{pmatrix} \\begin{pmatrix} x_1 \\\\ x_2 \\\\ x_3 \\end{pmatrix} = \\begin{pmatrix} 12 \\\\ 9 \\\\ 5 \\end{pmatrix}.$$
      `,
      placeholder:
        "Etapa k=1: o maior elemento em módulo na coluna 1 é a₃₁ = 5 (troque a linha 1 com a linha 3, π = [3, 2, 1]); calcule os multiplicadores l₂₁ = 2/5 e l₃₁ = 1/5 e o complemento de Schur 2×2...",
      solution: `
        <h4>1. Execução Passo a Passo de <code>LUP-DECOMPOSITION(A)</code></h4>
        <p>Inicializamos $\\pi = [1, 2, 3]$ e $A = \\begin{pmatrix} 1 & 5 & 4 \\\\ 2 & 0 & 3 \\\\ 5 & 8 & 2 \\end{pmatrix}$:</p>
        <ul>
          <li><strong>Etapa $k = 1$:</strong> Na coluna $1$, o elemento de maior módulo é $|a_{31}| = 5$ ($k' = 3$). Trocamos a linha $1$ com a linha $3$ ($\pi = [3, 2, 1]$):
            $$A^{(1)} = \\begin{pmatrix} 5 & 8 & 2 \\\\ 2 & 0 & 3 \\\\ 1 & 5 & 4 \\end{pmatrix}.$$
            Dividimos a coluna abaixo do pivô $u_{11} = 5$: $l_{21} = 2/5 = 0,4$ e $l_{31} = 1/5 = 0,2$. Atualizamos o complemento de Schur $2 \\times 2$:
            $$\\begin{aligned}
              a'_{22} &= 0 - (2/5)\\cdot 8 = -16/5, & a'_{23} &= 3 - (2/5)\\cdot 2 = 11/5, \\\\
              a'_{32} &= 5 - (1/5)\\cdot 8 = 17/5,  & a'_{33} &= 4 - (1/5)\\cdot 2 = 18/5.
            \\end{aligned}$$
          </li>
          <li><strong>Etapa $k = 2$:</strong> Na coluna $2$ (linhas $2$ e $3$), comparamos $|-16/5| = 3,2$ com $|17/5| = 3,4$. O maior em módulo é $|a'_{32}| = 17/5$ ($k' = 3$)! Trocamos a linha $2$ inteira com a linha $3$ inteira ($\pi = [3, 1, 2]$):
            <ul>
              <li>Agora $l_{21} = 1/5$, $u_{22} = 17/5$ e $u_{23} = 18/5$;</li>
              <li>Na linha $3$, temos $l_{31} = 2/5$ e calculamos $l_{32} = \\frac{-16/5}{17/5} = -\\frac{16}{17}$;</li>
              <li>Atualizamos o complemento de Schur $1 \\times 1$:
                $$u_{33} = a''_{33} = \\frac{11}{5} - \\left(-\\frac{16}{17}\\right)\\left(\\frac{18}{5}\\right) = \\frac{187 + 288}{85} = \\frac{475}{85} = \\mathbf{\\frac{95}{17}}.$$
              </li>
            </ul>
          </li>
        </ul>
        <p>Portanto, a decomposição $PA = LU$ é:</p>
        $$P = \\begin{pmatrix} 0 & 0 & 1 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0 \\end{pmatrix}, \\quad L = \\begin{pmatrix} 1 & 0 & 0 \\\\ 1/5 & 1 & 0 \\\\ 2/5 & -16/17 & 1 \\end{pmatrix}, \\quad U = \\begin{pmatrix} 5 & 8 & 2 \\\\ 0 & 17/5 & 18/5 \\\\ 0 & 0 & 95/17 \\end{pmatrix}.$$

        <h4>2. Substituição Progressiva ($Ly = Pb$) e Regressiva ($Ux = y$) em <code>LUP-SOLVE</code></h4>
        <ul>
          <li>Como $\\pi = [3, 1, 2]$ e $b = (12, 9, 5)^{\\text{T}}$, temos $Pb = (b_3, b_1, b_2)^{\\text{T}} = (5, 12, 9)^{\\text{T}}$:
            <ul>
              <li>$y_1 = 5$;</li>
              <li>$y_2 = 12 - (1/5)(5) = 12 - 1 = 11$;</li>
              <li>$y_3 = 9 - (2/5)(5) - (-16/17)(11) = 7 + \\frac{176}{17} = \\mathbf{\\frac{295}{17}}$.</li>
            </ul>
          </li>
          <li>Agora resolvemos $Ux = y$ de baixo para cima:
            <ul>
              <li>$\\frac{95}{17} x_3 = \\frac{295}{17} \\implies x_3 = \\frac{295}{95} = \\mathbf{\\frac{59}{19}}$;</li>
              <li>$\\frac{17}{5} x_2 = 11 - \\frac{18}{5}\\left(\\frac{59}{19}\\right) = \\frac{1045 - 1062}{95} = -\\frac{17}{95} \\implies x_2 = \\mathbf{-\\frac{1}{19}}$;</li>
              <li>$5 x_1 = 5 - 8\\left(-\\frac{1}{19}\\right) - 2\\left(\\frac{59}{19}\\right) = \\frac{95 + 8 - 118}{19} = -\\frac{15}{19} \\implies x_1 = \\mathbf{-\\frac{3}{19}}$.</li>
            </ul>
          </li>
        </ul>
        <p><strong>Verificação em $Ax = b$:</strong></p>
        <ul>
          <li>Linha 1: $1(-3/19) + 5(-1/19) + 4(59/19) = (-3 - 5 + 236)/19 = 228/19 = 12$ ✔</li>
          <li>Linha 2: $2(-3/19) + 0(-1/19) + 3(59/19) = (-6 + 177)/19 = 171/19 = 9$ ✔</li>
          <li>Linha 3: $5(-3/19) + 8(-1/19) + 2(59/19) = (-15 - 8 + 118)/19 = 95/19 = 5$ ✔ $\\blacksquare$</li>
        </ul>
      `
    },
    {
      id: "ex13-5",
      code: "EXERCÍCIO 05 • AJUSTE POR MÍNIMOS QUADRADOS E EQUAÇÕES NORMAIS",
      reference: "Exemplo Seção 28.3 (pp. 673–674) e Exercício 28.3-5 (p. 674)",
      title: "Formular e Resolver as Equações Normais AᵀAc = Aᵀy para Ajuste Linear por Mínimos Quadrados",
      prompt: `
        <p>Considere o problema de aproximação por mínimos quadrados da Seção 28.3 (pp. 671–674):</p>
        <ol>
          <li>Dados os $m = 4$ pontos experimentais $(x_1, y_1) = (-1, 1)$, $(x_2, y_2) = (0, 0)$, $(x_3, y_3) = (1, 1)$ e $(x_4, y_4) = (2, 5)$, queremos ajustar uma reta $F(x) = c_1 + c_2 x$ (isto é, funções de base $f_1(x) = 1$ e $f_2(x) = x$) que minimize a soma dos quadrados dos resíduos $\\|Ac - y\\|^2$. Construa explicitamente a matriz $A$ ($4 \\times 2$), o vetor $y$, a matriz simétrica positiva definida $A^{\\text{T}} A$ ($2 \\times 2$), o vetor $A^{\\text{T}} y$, e resolva a equação normal $A^{\\text{T}} A c = A^{\\text{T}} y$ para determinar a reta ótima $F(x)$ e o vetor de erros $\\eta = Ac - y$.</li>
          <li>Verifique que o vetor residual $\\eta = Ac - y$ é ortogonal a todas as colunas de $A$ ($A^{\\text{T}} \\eta = 0$).</li>
        </ol>
      `,
      placeholder:
        "Monte A com a primeira coluna [1, 1, 1, 1]ᵀ e a segunda coluna [-1, 0, 1, 2]ᵀ; calcule AᵀA = [[4, 2], [2, 6]] e Aᵀy = [7, 10]ᵀ...",
      solution: `
        <h4>1. Construção de $A$, $A^{\\text{T}} A$, $A^{\\text{T}} y$ e Resolução da Equação Normal</h4>
        <p>Com $f_1(x) = 1$ e $f_2(x) = x$ avaliados em $x = -1, 0, 1, 2$, temos:</p>
        $$A = \\begin{pmatrix} 1 & -1 \\\\ 1 & 0 \\\\ 1 & 1 \\\\ 1 & 2 \\end{pmatrix}, \\qquad y = \\begin{pmatrix} 1 \\\\ 0 \\\\ 1 \\\\ 5 \\end{pmatrix}.$$
        <p>Calculamos $A^{\\text{T}} A$ e $A^{\\text{T}} y$:</p>
        $$A^{\\text{T}} A = \\begin{pmatrix} 1 & 1 & 1 & 1 \\\\ -1 & 0 & 1 & 2 \\end{pmatrix} \\begin{pmatrix} 1 & -1 \\\\ 1 & 0 \\\\ 1 & 1 \\\\ 1 & 2 \\end{pmatrix} = \\begin{pmatrix} 4 & 2 \\\\ 2 & 6 \\end{pmatrix}, \\qquad A^{\\text{T}} y = \\begin{pmatrix} 1 & 1 & 1 & 1 \\\\ -1 & 0 & 1 & 2 \\end{pmatrix} \\begin{pmatrix} 1 \\\\ 0 \\\\ 1 \\\\ 5 \\end{pmatrix} = \\begin{pmatrix} 7 \\\\ 10 \\end{pmatrix}.$$
        <p>Resolvendo o sistema normal $A^{\\text{T}} A c = A^{\\text{T}} y$ ($\det(A^{\\text{T}} A) = 24 - 4 = 20 > 0$):</p>
        $$\\begin{pmatrix} c_1 \\\\ c_2 \\end{pmatrix} = \\frac{1}{20} \\begin{pmatrix} 6 & -2 \\\\ -2 & 4 \\end{pmatrix} \\begin{pmatrix} 7 \\\\ 10 \\end{pmatrix} = \\frac{1}{20} \\begin{pmatrix} 22 \\\\ 26 \\end{pmatrix} = \\begin{pmatrix} 1,1 \\\\ 1,3 \\end{pmatrix}.$$
        <p>Portanto, a reta ótima de mínimos quadrados é:</p>
        $$\\mathbf{F(x) = 1,1 + 1,3 x}.$$

        <h4>2. Vetor de Resíduos $\\eta = Ac - y$ e Ortogonalidade $A^{\\text{T}} \\eta = 0$</h4>
        <p>Os valores previstos $Ac$ nos pontos $x = -1, 0, 1, 2$ são $(-0,2; \\, 1,1; \\, 2,4; \\, 3,7)^{\\text{T}}$, logo o vetor de erros é:</p>
        $$\\eta = Ac - y = \\begin{pmatrix} -0,2 - 1 \\\\ 1,1 - 0 \\\\ 2,4 - 1 \\\\ 3,7 - 5 \\end{pmatrix} = \\begin{pmatrix} -1,2 \\\\ 1,1 \\\\ 1,4 \\\\ -1,3 \\end{pmatrix}.$$
        <p>Verificando a ortogonalidade geométrica $A^{\\text{T}} \\eta = A^{\\text{T}}(Ac - y) = A^{\\text{T}} A c - A^{\\text{T}} y = 0$:</p>
        <ul>
          <li>Produto interno com a coluna $1$: $(-1,2) + 1,1 + 1,4 + (-1,3) = 0$ ✔</li>
          <li>Produto interno com a coluna $2$: $(-1)(-1,2) + 0(1,1) + 1(1,4) + 2(-1,3) = 1,2 + 1,4 - 2,6 = 0$ ✔ $\\blacksquare$</li>
        </ul>
      `
    },
    {
      id: "ex13-6",
      code: "EXERCÍCIO 06 • CONVERSÃO DE PROGRAMA LINEAR PARA FORMA PADRÃO E FORMA DE FOLGAS",
      reference: "Exercícios 29.1-4 e 29.1-5 (p. 688)",
      title: "Converter um Programa Linear de Minimização com Igualdade e Variável Livre para Forma Padrão e Forma de Folgas",
      prompt: `
        <p><strong>(Exercícios 29.1-4 e 29.1-5, p. 688)</strong> Converta o seguinte programa linear primeiro para a <strong>forma padrão</strong> e, em seguida, para a <strong>forma de folgas</strong> (especificando os conjuntos $N$ e $B$):</p>
        $$\\begin{aligned}
          \\text{minimizar} \\quad & 2x_1 + 7x_2 + x_3 \\\\
          \\text{sujeito a} \\quad & x_1 - x_3 = 7 \\\\
          & 3x_1 + x_2 \\ge 24 \\\\
          & x_2 \\ge 0 \\\\
          & x_3 \\le 0.
        \\end{aligned}$$
      `,
      placeholder:
        "Observe que x₁ é livre de sinal (substitua x₁ = x'₁ - x''₁ com x'₁, x''₁ ≥ 0) e que x₃ ≤ 0 (substitua x'₃ = -x₃ ≥ 0); troque minimizar por maximizar negando a função objetivo e desdobre x₁ - x₃ = 7 em duas desigualdades ≤...",
      solution: `
        <h4>1. Tratamento das Variáveis e da Função Objetivo</h4>
        <ul>
          <li><strong>Variáveis:</strong>
            <ul>
              <li>$x_1$ não tem restrição de sinal (livre em $\\mathbb{R}$): substituímos $x_1 = x'_1 - x''_1$ com $x'_1 \\ge 0$ e $x''_1 \\ge 0$.</li>
              <li>$x_2 \\ge 0$ já está no formato padrão.</li>
              <li>$x_3 \\le 0$: definimos $x'_3 = -x_3$ (isto é, $x_3 = -x'_3$), de modo que $x'_3 \\ge 0$.</li>
            </ul>
            Renomeando $(x'_1, x''_1, x_2, x'_3)$ como $(y_1, y_2, y_3, y_4) \\ge 0$, temos $x_1 = y_1 - y_2$, $x_2 = y_3$ e $x_3 = -y_4$.</li>
          <li><strong>Função Objetivo (Minimização $\\to$ Maximização):</strong> Minimizar $2(y_1 - y_2) + 7y_3 - y_4$ equivale a <strong>maximizar $-2y_1 + 2y_2 - 7y_3 + y_4$</strong>.</li>
          <li><strong>Restrições:</strong>
            <ol>
              <li>A igualdade $x_1 - x_3 = 7 \\iff y_1 - y_2 + y_4 = 7$ desdobra-se em duas desigualdades $\\le$:
                $$y_1 - y_2 + y_4 \\le 7 \\quad \\text{e} \\quad -y_1 + y_2 - y_4 \\le -7.$$
              </li>
              <li>A desigualdade $3x_1 + x_2 \\ge 24 \\iff 3y_1 - 3y_2 + y_3 \\ge 24$, multiplicada por $-1$, torna-se:
                $$-3y_1 + 3y_2 - y_3 \\le -24.$$
              </li>
            </ol>
          </li>
        </ul>

        <h4>2. Programa Linear na Forma Padrão</h4>
        $$\\begin{aligned}
          \\text{maximizar} \\quad & -2y_1 + 2y_2 - 7y_3 + y_4 \\\\
          \\text{sujeito a} \\quad & y_1 - y_2 + y_4 \\le 7 \\\\
          & -y_1 + y_2 - y_4 \\le -7 \\\\
          & -3y_1 + 3y_2 - y_3 \\le -24 \\\\
          & y_1, y_2, y_3, y_4 \\ge 0.
        \\end{aligned}$$

        <h4>3. Programa Linear na Forma de Folgas ($N = \\{1, 2, 3, 4\\}, \\; B = \\{5, 6, 7\\}$)</h4>
        <p>Introduzindo as variáveis de folga básicas $y_5, y_6, y_7 \\ge 0$:</p>
        $$\\begin{aligned}
          z &= -2y_1 + 2y_2 - 7y_3 + y_4 \\\\
          y_5 &= 7 - y_1 + y_2 - y_4 \\\\
          y_6 &= -7 + y_1 - y_2 + y_4 \\\\
          y_7 &= -24 + 3y_1 - 3y_2 + y_3. \\quad \\blacksquare
        \\end{aligned}$$
      `
    },
    {
      id: "ex13-7",
      code: "EXERCÍCIO 07 • RESOLUÇÃO COMPLETA DE PROGRAMA LINEAR COM SIMPLEX",
      reference: "Exercício 29.3-6 (p. 707)",
      title: "Resolver Passo a Passo o Programa Linear do Exercício 29.3-6 Pelo Algoritmo SIMPLEX",
      prompt: `
        <p><strong>(Exercício 29.3-6, p. 707)</strong> Resolva o seguinte programa linear utilizando o algoritmo <code>SIMPLEX</code>, exibindo a forma de folgas inicial e cada operação de <code>PIVOT</code> até a solução ótima:</p>
        $$\\begin{aligned}
          \\text{maximizar} \\quad & 5x_1 - 3x_2 \\\\
          \\text{sujeito a} \\quad & x_1 - x_2 \\le 1 \\\\
          & 2x_1 + x_2 \\le 2 \\\\
          & x_1, x_2 \\ge 0.
        \\end{aligned}$$
        <p>Em seguida, determine também a solução ótima do dual diretamente da forma de folgas final pelo Teorema 29.10 e confira que $c^{\\text{T}} x^* = b^{\\text{T}} y^*$.</p>
      `,
      placeholder:
        "Introduza x₃ = 1 - x₁ + x₂ e x₄ = 2 - 2x₁ - x₂; faça x₁ entrar na base (c₁ = 5 > 0) comparando Δ₃ = 1/1 = 1 e Δ₄ = 2/2 = 1...",
      solution: `
        <h4>1. Forma de Folgas Inicial ($N = \\{1, 2\\}, \\; B = \\{3, 4\\}$)</h4>
        $$\\begin{aligned}
          z &= 0 + 5x_1 - 3x_2 \\\\
          x_3 &= 1 - x_1 + x_2 \\\\
          x_4 &= 2 - 2x_1 - x_2.
        \\end{aligned}$$
        <p>Solução básica inicial: $(x_1, x_2, x_3, x_4) = (0, 0, 1, 2)$ (viável, pois $b_3, b_4 \\ge 0$), com $z = 0$.</p>

        <h4>2. Primeiro Pivô: $x_1$ Entra ($e = 1$), $x_3$ Sai ($l = 3$)</h4>
        <ul>
          <li>A única variável não básica com coeficiente positivo em $z$ é $x_1$ ($c_1 = 5 > 0$).</li>
          <li>Calculamos os limites $\\Delta_i = b_i / a_{i1}$:
            $$\\Delta_3 = \\frac{1}{1} = 1, \\qquad \\Delta_4 = \\frac{2}{2} = 1.$$
            Pela Regra de Bland (menor índice em caso de empate), escolhemos $l = 3$ ($x_3$ sai da base).</li>
          <li>Isolamos $x_1$ na equação de $x_3$: $x_1 = 1 + x_2 - x_3$, e substituímos em $x_4$ e em $z$:
            $$\\begin{aligned}
              x_4 &= 2 - 2(1 + x_2 - x_3) - x_2 = 0 - 3x_2 + 2x_3, \\\\
              z &= 5(1 + x_2 - x_3) - 3x_2 = 5 + 2x_2 - 5x_3.
            \\end{aligned}$$
          </li>
        </ul>
        <p>Nova forma de folgas ($N = \\{2, 3\\}, \\; B = \\{1, 4\\}$), com solução básica $(1, 0, 0, 0)$ e $z = 5$.</p>

        <h4>3. Segundo Pivô (Degenerado!): $x_2$ Entra ($e = 2$), $x_4$ Sai ($l = 4$)</h4>
        <ul>
          <li>Em $z = 5 + 2x_2 - 5x_3$, temos $c_2 = 2 > 0$, logo $x_2$ entra na base ($e = 2$).</li>
          <li>Limites $\\Delta_i$: na equação de $x_1$, $a_{12} = -1 \\le 0 \\implies \\Delta_1 = \\infty$; na equação de $x_4$, $b_4 = 0$ e $a_{42} = 3 > 0 \\implies \\Delta_4 = 0 / 3 = 0$. Logo $x_4$ sai da base ($l = 4$).</li>
          <li>Isolamos $x_2$ na equação de $x_4$: $x_2 = 0 + \\frac{2}{3} x_3 - \\frac{1}{3} x_4$, e substituímos em $x_1$ e em $z$:
            $$\\begin{aligned}
              z &= 5 + 2\\left(\\frac{2}{3} x_3 - \\frac{1}{3} x_4\\right) - 5x_3 = 5 - \\frac{11}{3} x_3 - \\frac{2}{3} x_4, \\\\
              x_1 &= 1 + \\left(\\frac{2}{3} x_3 - \\frac{1}{3} x_4\\right) - x_3 = 1 - \\frac{1}{3} x_3 - \\frac{1}{3} x_4, \\\\
              x_2 &= 0 + \\frac{2}{3} x_3 - \\frac{1}{3} x_4.
            \\end{aligned}$$
          </li>
        </ul>

        <h4>4. Solução Ótima Primal e Solução Ótima Dual (Teorema 29.10)</h4>
        <ul>
          <li>Como todos os coeficientes em $z$ agora são negativos ($c'_3 = -11/3 \\le 0$ e $c'_4 = -2/3 \\le 0$), o algoritmo termina!</li>
          <li><strong>Solução Ótima Primal:</strong> $(x_1^*, x_2^*) = \\mathbf{(1, 0)}$, com valor objetivo ótimo $z^* = 5(1) - 3(0) = \\mathbf{5}$.</li>
          <li><strong>Solução Ótima Dual (Teorema 29.10):</strong> Como as variáveis de folga originais são $x_3 = x_{2+1}$ e $x_4 = x_{2+2}$, temos:
            $$y_1^* = -c'_3 = \\mathbf{\\frac{11}{3}}, \\qquad y_2^* = -c'_4 = \\mathbf{\\frac{2}{3}}.$$
            Verificação no dual ($\min 1y_1 + 2y_2$ s.a. $y_1 + 2y_2 \\ge 5$ e $-y_1 + y_2 \\ge -3$):
            $$b_1 y_1^* + b_2 y_2^* = 1\\left(\\frac{11}{3}\\right) + 2\\left(\\frac{2}{3}\\right) = \\frac{15}{3} = \\mathbf{5 = z^*}. \\quad \\blacksquare$$
          </li>
        </ul>
      `
    },
    {
      id: "ex13-8",
      code: "EXERCÍCIO 08 • DUALIDADE DE PROGRAMAÇÃO LINEAR E TEOREMA DO FLUXO MÁXIMO–CORTE MÍNIMO",
      reference: "Exercícios 29.4-1 e 29.4-3 (p. 714)",
      title: "Formular o Dual do Programa Linear de Fluxo Máximo e Demonstrar Sua Equivalência com o Problema do Corte Mínimo",
      prompt: `
        <p><strong>(Exercício 29.4-3, p. 714)</strong> Considere o programa linear de <strong>Fluxo Máximo</strong> em um grafo dirigido $G = (V, E)$ com fonte $s$, sorvedouro $t$ e capacidades $c(u, v) \\ge 0$ para $(u, v) \\in E$ (Equações 29.47–29.50, p. 691; dica: adicione uma aresta artificial de retorno $(t, s)$ com capacidade $\\infty$ e maximize $f_{ts}$ sujeito à conservação de fluxo em <em>todos</em> os vértices $u \\in V$ e $f_{uv} \\le c(u, v)$ para todo $(u, v) \\in E$):</p>
        <ol>
          <li>Escreva o <strong>Programa Linear Dual</strong> desse problema introduzindo uma variável dual $y_{uv} \\ge 0$ para cada restrição de capacidade $f_{uv} \\le c(u, v)$ ($(u, v) \\in E$) e uma variável dual irrestrita $z_u \\in \\mathbb{R}$ para cada restrição de igualdade de conservação de fluxo no vértice $u \\in V$.</li>
          <li>Explique como qualquer corte $(S, T)$ com $s \\in S$ e $t \\in T = V - S$ define uma solução viável inteira $0$-$1$ do programa dual (com $z_u = 1$ para $u \\in S$ e $z_u = 0$ para $u \\in T$) cujo valor objetivo é exatamente a capacidade do corte $c(S, T)$, mostrando que o <strong>Teorema do Fluxo Máximo–Corte Mínimo (Teorema 26.6)</strong> é um caso particular da <strong>Dualidade Forte de Programação Linear (Teorema 29.10)</strong>!</li>
        </ol>
      `,
      placeholder:
        "Para cada aresta (u, v) ∈ E, a restrição dual correspondente à variável primal f_{uv} é y_{uv} + z_u - z_v ≥ 0, e para a aresta de retorno f_{ts} (com coeficiente 1 no objetivo primal) é z_t - z_s ≥ 1...",
      solution: `
        <h4>1. Formulação Primal Compacta (Com Aresta de Retorno $(t, s)$) e Construção do Dual</h4>
        <p>No primal, adicionando a variável $f_{ts} \\ge 0$ que mede o valor total $|f|$ do fluxo que chega a $t$ e retorna a $s$, maximizamos $1 \\cdot f_{ts}$ sujeito a:</p>
        <ul>
          <li>Restrição de capacidade para cada $(u, v) \\in E$: $f_{uv} \\le c(u, v)$ $\\longrightarrow$ <strong>variável dual $y_{uv} \\ge 0$</strong>;</li>
          <li>Conservação de fluxo para cada $u \\in V$: $\\sum_{v} f_{uv} - \\sum_{v} f_{vu} = 0$ $\\longrightarrow$ <strong>variável dual potencial $z_u \\in \\mathbb{R}$</strong> (livre de sinal, pois a restrição primal é uma igualdade!).</li>
        </ul>
        <p>Transpondo os coeficientes de cada variável primal $f_{uv}$ ($(u, v) \\in E$, que tem coeficiente $0$ na função objetivo primal, $+1$ na restrição de capacidade $(u,v)$, $+1$ na conservação de $u$ e $-1$ na conservação de $v$) e da variável $f_{ts}$ (que tem coeficiente $+1$ na função objetivo primal, $+1$ na conservação de $t$ e $-1$ na conservação de $s$), obtemos o <strong>Programa Linear Dual</strong>:</p>
        $$\\begin{aligned}
          \\text{minimizar} \\quad & \\sum_{(u, v) \\in E} c(u, v) \\, y_{uv} \\\\
          \\text{sujeito a} \\quad & y_{uv} + z_u - z_v \\ge 0 && \\text{para cada aresta } (u, v) \\in E, \\\\
          & z_t - z_s \\ge 1 && (\\text{ou, fixando } z_s = 1 \\text{ e } z_t = 0: \\; z_s - z_t \\ge 1 \\text{ se invertermos o sinal de } z), \\\\
          & y_{uv} \\ge 0 && \\text{para cada } (u, v) \\in E.
        \\end{aligned}$$
        <p>(Adotando a convenção de conservação $\\sum_v f_{vu} - \\sum_v f_{uv} = 0$, as restrições duais ficam na forma ainda mais intuitiva: <strong>$y_{uv} \\ge z_u - z_v$</strong> para toda $(u, v) \\in E$ e <strong>$z_s - z_t \\ge 1$</strong>!)</p>

        <h4>2. Interpretação como o Problema do Corte Mínimo</h4>
        <p>Considere qualquer partição $(S, T)$ de $V$ com $s \\in S$ e $t \\in T = V - S$. Definimos para cada vértice $u \\in V$:</p>
        $$z_u = \\begin{cases} 1 & \\text{se } u \\in S, \\\\ 0 & \\text{se } u \\in T. \\end{cases}$$
        <p>Então $z_s - z_t = 1 - 0 = 1 \\ge 1$ é satisfeita. Para minimizar $\\sum_{(u,v) \\in E} c(u, v) y_{uv}$ sujeito a $y_{uv} \\ge z_u - z_v$ e $y_{uv} \\ge 0$, escolhemos o menor $y_{uv}$ possível para cada aresta $(u, v) \\in E$, isto é, $y_{uv} = \\max(0, z_u - z_v)$:</p>
        <ul>
          <li>Se $u \\in S$ e $v \\in T$ (a aresta $(u, v)$ <strong>cruza o corte de $S$ para $T$</strong>): $z_u - z_v = 1 - 0 = 1 \\implies \\mathbf{y_{uv} = 1}$;</li>
          <li>Nos demais três casos ($u, v \\in S$; $u, v \\in T$; ou $u \\in T, v \\in S$): $z_u - z_v \\le 0 \\implies \\mathbf{y_{uv} = 0}$.</li>
        </ul>
        <p>Portanto, o valor objetivo dual dessa atribuição é exatamente:</p>
        $$\\sum_{(u, v) \\in E} c(u, v) \\, y_{uv} = \\sum_{u \\in S} \\sum_{v \\in T} c(u, v) = \\mathbf{c(S, T)}.$$
        <p>Pela <strong>Dualidade Fraca (Lema 29.8)</strong>, o valor de qualquer fluxo $|f|$ é menor ou igual à capacidade de qualquer corte $c(S, T)$ (Lema 26.4!); e pela <strong>Dualidade Forte (Teorema 29.10)</strong> (aliada à total unimodularidade da matriz de incidência da rede, que garante solução básica ótima inteira), o valor do fluxo máximo é idêntico à capacidade do corte mínimo! $\\blacksquare$</p>
      `
    }
  ];

  if (typeof window !== "undefined" && typeof window.registerCodexModule === "function") {
    window.registerCodexModule(13, {
      revisao,
      unidades,
      initWorkbenches,
      quizzes,
      exercicios
    });
  }
})();
