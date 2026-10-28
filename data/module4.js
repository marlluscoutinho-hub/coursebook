/* ==========================================================================
   MÓDULO 04 — Análise Probabilística e Algoritmos Aleatorizados
   Capítulo 5 (pp. 106–130) + Apêndice C (pp. 950–977) — Cormen, Leiserson, Rivest e Stein (CLRS)
   ========================================================================== */

(function () {
  if (!window.registerCodexModule) return;

  const module4Content = {
    /* ======================================================================
       SEÇÃO 1: REVISÃO E NIVELAMENTO MATEMÁTICO (4 PILARES + CHECKLIST)
       ====================================================================== */
    revisao: {
      subtitle:
        "Análise de Caso Médio vs. Algoritmos Aleatorizados, Fundamentos Combinatórios (Apêndice C) e o Poder da Linearidade da Esperança",
      intro:
        "Até o Capítulo 4, analisamos algoritmos essencialmente sob o prisma determinístico do pior caso. No Capítulo 5 (e no Apêndice C, que lhe dá sustentação matemática rigorosa), introduzimos a teoria das probabilidades no projeto e na análise de algoritmos. Esta etapa de Revisão estabelece quatro pilares indispensáveis: a distinção epistemológica entre análise probabilística e algoritmos aleatorizados, as ferramentas de contagem e probabilidade do Apêndice C, o milagre algébrico da linearidade do valor esperado (mesmo sob dependência!) e a estrutura matemática das permutações aleatórias uniformes.",
      pillars: [
        {
          tag: "[ PILAR 01 • CASO MÉDIO VS. ALEATORIZAÇÃO ]",
          title: "Análise Probabilística (Entrada Aleatória) vs. Algoritmo Aleatorizado (Escolhas Internas)",
          body: `
            <p>Uma das distinções conceituais mais importantes de toda a Ciência da Computação — enfatizada por Cormen et al. nas Seções 5.1 e 5.3 — separa <strong>onde reside a fonte da aleatoriedade</strong>:</p>
            <ul>
              <li><strong>Análise Probabilística (Tempo/Custo de Caso Médio):</strong> O algoritmo em si pode ser 100% <em>determinístico</em> (como <code>HIRE-ASSISTANT</code>). Para calcular seu desempenho médio, fazemos uma <strong>hipótese estatística sobre a distribuição das entradas</strong> (por exemplo, supor que os candidatos chegam da agência em uma permutação aleatória uniforme). Para uma entrada fixa $A_1 = \\langle 1, 2, \\dots, 10 \\rangle$, o algoritmo determinístico <em>sempre</em> fará $10$ contratações em toda execução. Referimo-nos ao resultado dessa análise como <strong>custo ou tempo de execução do caso médio</strong>.</li>
              <li><strong>Algoritmo Aleatorizado (Tempo/Custo Esperado):</strong> Não fazemos <em>nenhuma</em> suposição sobre a distribuição da entrada (ela pode vir até mesmo de um adversário malicioso!). Em vez disso, o <strong>próprio algoritmo invoca um gerador de números aleatórios</strong> <code>RANDOM(a, b)</code> para tomar decisões ou permutar a entrada antes de processá-la (como em <code>RANDOMIZED-HIRE-ASSISTANT</code>). Assim, para a <em>mesma</em> entrada fixa $A_1$, execuções distintas produzem comportamentos e custos diferentes. Referimo-nos ao desempenho médio sobre as escolhas do gerador <code>RANDOM</code> como <strong>custo ou tempo de execução esperado</strong>.</li>
            </ul>
          `
        },
        {
          tag: "[ PILAR 02 • CONTAGEM E PROBABILIDADE (APÊNDICE C) ]",
          title: "Arranjos, Combinações, Axiomas de Kolmogorov e Probabilidade Condicional",
          body: `
            <p>Para quantificar eventos em algoritmos, apoiamo-nos no arcabouço combinatório e probabilístico das Seções C.1 e C.2:</p>
            <ul>
              <li><strong>$k$-cadeias, $k$-permutações e $k$-combinações:</strong> Em um conjunto finito $S$ de $n$ elementos:
                <ol>
                  <li>O número de sequências ordenadas de comprimento $k$ <em>com repetição permitida</em> ($k$-cadeias) é $n^k$;</li>
                  <li>O número de sequências ordenadas de $k$ elementos <em>distintos</em> ($k$-permutações) é $\\frac{n!}{(n-k)!} = n(n-1)\\cdots(n-k+1)$;</li>
                  <li>O número de subconjuntos não ordenados de tamanho $k$ ($k$-combinações) é o coeficiente binomial $\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$.</li>
                </ol>
              </li>
              <li><strong>Axiomas de Probabilidade e Regra do Produto Condicional:</strong> Dado um espaço amostral discreto $S$, $\\Pr\\{A\\} \\ge 0$, $\\Pr\\{S\\} = 1$ e $\\Pr\\{A \\cup B\\} = \\Pr\\{A\\} + \\Pr\\{B\\}$ para eventos mutuamente exclusivos ($A \\cap B = \\emptyset$). A probabilidade condicional de $A$ dado $B$ ($\\Pr\\{B\\} > 0$) é $\\Pr\\{A \\mid B\\} = \\frac{\\Pr\\{A \\cap B\\}}{\\Pr\\{B\\}}$, o que nos dá a identidade fundamental para provas de invariantes probabilísticos (como nos Lemas 5.4 e 5.5):
                $$\\Pr\\{E_1 \\cap E_2\\} = \\Pr\\{E_1\\} \\cdot \\Pr\\{E_2 \\mid E_1\\}.$$
              </li>
            </ul>
          `
        },
        {
          tag: "[ PILAR 03 • LINEARIDADE E VARIÁVEIS INDICADORAS ]",
          title: "O Lema 5.1 e a Linearidade da Esperança sem Hipótese de Independência",
          body: `
            <p>Calcular o valor esperado $E[X] = \\sum_{x} x \\Pr\\{X = x\\}$ diretamente pela distribuição global de $X$ costuma exigir somatórios combinatórios intrincados. A técnica das <strong>variáveis aleatórias indicadoras</strong> (Seção 5.2) transforma esse problema difícil em uma soma elementar de probabilidades:</p>
            <ul>
              <li>Para qualquer evento $A$, definimos $X_A = I\\{A\\} = 1$ se $A$ ocorre, e $0$ caso contrário. Pelo <strong>Lema 5.1</strong>, o valor esperado dessa variável indicadora é simplesmente a probabilidade do evento:
                $$E[X_A] = 1 \\cdot \\Pr\\{A\\} + 0 \\cdot \\Pr\\{\\overline{A}\\} = \\Pr\\{A\\}.$$
              </li>
              <li><strong>Linearidade da Esperança (Equação C.21):</strong> Se $X = X_1 + X_2 + \\dots + X_n$, então:
                $$E\\left[\\sum_{i=1}^{n} X_i\\right] = \\sum_{i=1}^{n} E[X_i]$$
                <strong>mesmo quando as variáveis $X_1, X_2, \\dots, X_n$ são fortemente dependentes entre si!</strong> Não confunda: para multiplicar esperanças ($E[XY] = E[X]E[Y]$) ou somar variâncias ($\\text{Var}[X+Y] = \\text{Var}[X] + \\text{Var}[Y]$), a independência é exigida; mas para <em>somar valores esperados</em>, a linearidade vale incondicionalmente!</li>
            </ul>
          `
        },
        {
          tag: "[ PILAR 04 • PERMUTAÇÕES UNIFORMES E SÉRIE HARMÔNICA ]",
          title: "Permutações Aleatórias Uniformes (1/n!) e o Número Harmônico Hₙ",
          body: `
            <p>Um conjunto de $n$ elementos distintos possui exatamente $n!$ permutações possíveis. Uma <strong>permutação aleatória uniforme</strong> é aquela em que cada uma das $n!$ permutações ocorre com probabilidade idêntica igual a $\\frac{1}{n!}$.</p>
            <ul>
              <li><strong>Simetria dos primeiros $i$ elementos:</strong> Se uma sequência de $n$ números distintos forma uma permutação aleatória uniforme, então para qualquer prefixo de tamanho $i \\in \\{1, \\dots, n\\}$, os primeiros $i$ elementos têm todos a mesma probabilidade de ser o maior (ou o menor) entre os $i$ primeiros: exatamente $\\frac{1}{i}$.</li>
              <li><strong>Emergência da Série Harmônica:</strong> Somar as probabilidades $\\frac{1}{i}$ de $i = 1$ até $n$ produz o $n$-ésimo número harmônico (Equação A.7):
                $$H_n = \\sum_{i=1}^{n} \\frac{1}{i} = 1 + \\frac{1}{2} + \\frac{1}{3} + \\dots + \\frac{1}{n} = \\ln n + O(1) \\approx \\ln n + 0,5772.$$
                É por essa razão que o logaritmo natural $\\ln n$ (base $e \\approx 2,71828$) aparece naturalmente na análise do problema da contratação, do colecionador de cupons e do Quicksort aleatorizado!</li>
            </ul>
          `
        }
      ],
      checklist: [
        "Sei explicar com precisão a diferença entre 'tempo de execução do caso médio' (entrada aleatória segundo uma distribuição) e 'tempo de execução esperado' (escolhas aleatórias internas via RANDOM).",
        "Compreendo o Lema 5.1: para uma variável aleatória indicadora X_A = I{A}, vale sempre E[X_A] = Pr{A}.",
        "Reconheço que a linearidade da esperança E[∑ X_i] = ∑ E[X_i] vale para quaisquer variáveis aleatórias, independentes ou dependentes.",
        "Entendo que uma permutação aleatória uniforme de n elementos atribui probabilidade 1/n! a cada permutação, e que o simples fato de cada elemento ter probabilidade 1/n de cair em cada posição NÃO basta para garantir uniformidade.",
        "Domino as médias e variâncias das distribuições Geométrica (E[X] = 1/p, Var[X] = q/p²) e Binomial (E[X] = np, Var[X] = npq)."
      ]
    },

    /* ======================================================================
       SEÇÃO 2: UNIDADES DE ESTUDO APROFUNDADO (6 UNIDADES: CAP. 5 + AP. C)
       ====================================================================== */
    unidades: [
      /* ====================================================================
         UNIDADE 4.1 — CAPÍTULO 5, SEÇÃO 5.1
         ==================================================================== */
      {
        id: "u4-1",
        code: "UNIDADE 4.1 • CAP. 5 (SEÇÃO 5.1)",
        pages: "pp. 106–109",
        title: "5.1 O Problema da Contratação (HIRE-ASSISTANT), Análise Probabilística e Algoritmos Aleatorizados",
        content: `
          <h3>1. Formulação e Modelo de Custo do Problema da Contratação</h3>
          <p>Suponha que você precise contratar um novo auxiliar de escritório por meio de uma agência de empregos. A agência lhe envia <strong>um candidato por dia</strong> ao longo de $n$ dias. Você entrevista cada candidato e decide imediatamente se o contrata ou não. Adotamos duas taxas financeiras distintas:</p>
          <ul>
            <li><strong>Custo de entrevista ($c_i$):</strong> Paga-se uma pequena taxa $c_i$ à agência para entrevistar cada candidato.</li>
            <li><strong>Custo de contratação ($c_h \\gg c_i$):</strong> Contratar um candidato é muito mais oneroso ($c_h$), pois exige demitir o auxiliar atual e pagar uma substancial comissão de contratação à agência.</li>
          </ul>
          <p>Como a política da empresa exige manter <em>sempre</em> a pessoa mais bem qualificada vista até o momento, você contrata o candidato $i$ sempre que ele for melhor que o auxiliar atualmente contratado. O procedimento <code>HIRE-ASSISTANT(n)</code> formaliza essa estratégia usando um candidato fictício inicial $0$ menos qualificado que todos os demais:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">HIRE-ASSISTANT(n)</span>
              <span>[ CAPÍTULO 5.1 • PÁGINA 106 ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">melhor = 0 <span class="cmt">// o candidato 0 é um candidato fictício menos qualificado</span></span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">for</span> i = 1 <span class="kw">to</span> n</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    entrevistar o candidato i</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">if</span> o candidato i é melhor que o candidato melhor</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">        melhor = i</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">        contratar o candidato i</span></div>
            </div>
          </div>

          <p><strong>Análise do Custo Total e do Pior Caso:</strong> Se dentre os $n$ candidatos entrevistados exatamente $m$ pessoas são contratadas (linhas 5–6), o custo total incorrido pelo processo é:</p>
          $$\\text{Custo Total} = O(c_i n + c_h m).$$
          <p>Como a parcela $c_i n$ é fixa em toda execução (sempre entrevistamos todos os $n$ candidatos), nossa análise concentra-se no <strong>custo de contratação $c_h m$</strong>. Esse paradigma modela um problema computacional onipresente: <em>com que frequência atualizamos o "vencedor atual" (máximo ou mínimo) ao varrer uma sequência de $n$ elementos?</em></p>
          <p>No <strong>pior caso</strong>, os candidatos apresentam-se em ordem estritamente crescente de qualidade. Nesse cenário, todo candidato $i$ supera os anteriores e é contratado ($m = n$), resultando em um custo de contratação de pior caso igual a <strong>$O(c_h n)$</strong>.</p>

          <h3>2. Análise Probabilística e Permutação Aleatória Uniforme</h3>
          <p>A <strong>análise probabilística</strong> é o uso da probabilidade na análise de problemas. Para realizá-la, precisamos conhecer ou adotar uma premissa sobre a <strong>distribuição de probabilidades das entradas</strong> e calcular a média do custo sobre todas as entradas possíveis — obtendo o <strong>custo (ou tempo de execução) do caso médio</strong>.</p>
          <p>No problema da contratação, supomos que quaisquer dois candidatos podem ser comparados sem empates (isto é, existe uma <strong>ordem total</strong> estrita sobre os candidatos — Exercício 5.1-1). Assim, atribuímos a cada candidato $i$ um posto único $\\text{ordenação}(i) \\in \\{1, 2, \\dots, n\\}$, onde um valor maior indica maior qualificação. A sequência $\\langle \\text{ordenação}(1), \\text{ordenação}(2), \\dots, \\text{ordenação}(n) \\rangle$ é uma permutação de $\\langle 1, 2, \\dots, n \\rangle$.</p>

          <div class="canonical-callout theorem">
            <span class="callout-tag">[ DEFINIÇÃO FORMAL • PERMUTAÇÃO ALEATÓRIA UNIFORME (p. 107) ]</span>
            <p>Dizer que os candidatos chegam em uma <strong>ordem aleatória</strong> equivale a afirmar que a lista de classificações $\\langle \\text{ordenação}(1), \\text{ordenação}(2), \\dots, \\text{ordenação}(n) \\rangle$ tem igual probabilidade de ser qualquer uma das $n!$ permutações possíveis dos inteiros $1$ a $n$. Nesse caso, dizemos que as classificações formam uma <strong>permutação aleatória uniforme</strong>: cada uma das $n!$ permutações possíveis aparece com probabilidade exata $\\frac{1}{n!}$.</p>
          </div>

          <h3>3. Algoritmos Aleatorizados e o Gerador <code>RANDOM(a, b)</code></h3>
          <p>Na prática, raramente conhecemos ou controlamos a distribuição real das entradas (a agência pode enviar os piores candidatos primeiro de propósito!). Quando não podemos confiar que a entrada seja aleatória, mudamos o modelo: pedimos a lista dos $n$ candidatos com antecedência e <strong>nós mesmos sorteamos aleatoriamente a ordem de entrevista</strong>.</p>

          <div class="canonical-callout invariant">
            <span class="callout-tag">[ ALGORITMO ALEATORIZADO & PRIMITIVA RANDOM(a, b) (p. 108) ]</span>
            <p>Um algoritmo é chamado de <strong>aleatorizado</strong> se seu comportamento é determinado não apenas por sua entrada, mas também por valores produzidos por um <strong>gerador de números aleatórios</strong>.</p>
            <ul>
              <li>Assumimos a primitiva <code>RANDOM(a, b)</code>, que devolve em tempo $\\Theta(1)$ um inteiro sorteado uniformemente no intervalo fechado $\\{a, a+1, \\dots, b\\}$, onde cada um dos $b - a + 1$ inteiros tem probabilidade exata $\\frac{1}{b - a + 1}$ e é estatisticamente <strong>independente</strong> de chamadas anteriores.</li>
              <li><strong>Terminologia Rigorosa do CLRS:</strong> Usamos <strong>tempo de execução do caso médio</strong> quando a probabilidade está na <em>distribuição das entradas</em> (algoritmo determinístico), e <strong>tempo de execução esperado</strong> quando o <em>próprio algoritmo</em> faz escolhas aleatórias!</li>
            </ul>
          </div>

          <div id="workbench-mod4-mount"></div>
        `
      },

      /* ====================================================================
         UNIDADE 4.2 — CAPÍTULO 5, SEÇÃO 5.2
         ==================================================================== */
      {
        id: "u4-2",
        code: "UNIDADE 4.2 • CAP. 5 (SEÇÃO 5.2)",
        pages: "pp. 109–113",
        title: "5.2 Variáveis Aleatórias Indicadoras e Análise do Problema da Contratação",
        content: `
          <h3>1. Definição de Variável Aleatória Indicadora e o Lema 5.1</h3>
          <p>Para analisar inúmeros algoritmos ao longo do livro (do problema da contratação ao Quicksort e tabelas hash), utilizamos as <strong>variáveis aleatórias indicadoras</strong>, que fornecem um método elegante e direto para converter probabilidades em valores esperados.</p>
          <p>Dado um espaço amostral $S$ e um evento $A \\subseteq S$, a <strong>variável aleatória indicadora</strong> $I\\{A\\}$ associada ao evento $A$ é definida pela Equação (5.1):</p>
          $$I\\{A\\} = \\begin{cases} 1 & \\text{se } A \\text{ ocorre,} \\\\ 0 & \\text{se } A \\text{ não ocorre.} \\end{cases}$$

          <div class="canonical-callout theorem">
            <span class="callout-tag">[ LEMA 5.1 • ESPERANÇA DE UMA VARIÁVEL INDICADORA (p. 109) ]</span>
            <p><strong>Enunciado:</strong> Dado um espaço amostral $S$ e um evento $A$ no espaço amostral $S$, seja $X_A = I\\{A\\}$. Então:</p>
            $$E[X_A] = \\Pr\\{A\\}.$$
            <p><strong>Prova:</strong> Pela definição de variável aleatória indicadora (Equação 5.1) e pela definição de valor esperado discreto (Equação C.20), temos:</p>
            $$\\begin{aligned} E[X_A] &= E[I\\{A\\}] = 1 \\cdot \\Pr\\{A\\} + 0 \\cdot \\Pr\\{\\overline{A}\\} \\\\ &= \\Pr\\{A\\}, \\end{aligned}$$
            <p>onde $\\overline{A} = S - A$ denota o complemento de $A$. $\\blacksquare$</p>
          </div>

          <p><strong>Por que variáveis indicadoras brilham em testes repetidos?</strong> Considere contar o número esperado de caras em $n$ lançamentos de uma moeda justa. Em vez de calcular a soma binomial $\\sum_{k=0}^{n} k \\binom{n}{k} / 2^n$, definimos $X_i = I\\{\\text{o } i\\text{-ésimo lançamento resulta em cara}\\}$. Então o número total de caras é $X = \\sum_{i=1}^{n} X_i$. Pela <strong>linearidade da esperança</strong> (Equação C.21):</p>
          $$E[X] = E\\left[\\sum_{i=1}^{n} X_i\\right] = \\sum_{i=1}^{n} E[X_i] = \\sum_{i=1}^{n} \\frac{1}{2} = \\frac{n}{2}.$$
          <p>Mais importante ainda: a linearidade da esperança <strong>aplica-se integralmente mesmo quando há forte dependência entre as variáveis aleatórias $X_i$</strong>!</p>

          <h3>2. Análise Completa do Problema da Contratação (Lema 5.2)</h3>
          <p>Retornemos ao procedimento <code>HIRE-ASSISTANT(n)</code> sob a premissa da análise probabilística: os $n$ candidatos chegam em ordem aleatória (permutação aleatória uniforme). Seja $X$ a variável aleatória que denota o número total de vezes que contratamos um novo auxiliar de escritório. Calcular $E[X] = \\sum_{x=1}^{n} x \\Pr\\{X = x\\}$ diretamente exigiria os números de Stirling de primeiro tipo!</p>
          <p>Com variáveis indicadoras, porém, a derivação torna-se cristalina: para cada $i \\in \\{1, 2, \\dots, n\\}$, definimos:</p>
          $$X_i = I\\{\\text{o candidato } i \\text{ é contratado}\\} = \\begin{cases} 1 & \\text{se o candidato } i \\text{ é contratado,} \\\\ 0 & \\text{se o candidato } i \\text{ não é contratado.} \\end{cases}$$
          <p>Como o número total de contratações é a soma das contratações individuais:</p>
          $$X = X_1 + X_2 + \\dots + X_n = \\sum_{i=1}^{n} X_i,$$
          <p>e pelo Lema 5.1 temos $E[X_i] = \\Pr\\{\\text{o candidato } i \\text{ é contratado}\\}$.</p>
          <p><strong>Qual é a probabilidade de o candidato $i$ ser contratado?</strong> Na linha 4 de <code>HIRE-ASSISTANT</code>, o candidato $i$ é contratado se, e somente se, ele for mais qualificado que todos os candidatos $1, 2, \\dots, i - 1$. Como os $n$ candidatos chegam em uma permutação aleatória uniforme, <strong>os primeiros $i$ candidatos também apareceram em uma ordem aleatória uniforme entre si</strong>: qualquer um desses $i$ primeiros candidatos tem exatamente a mesma probabilidade de ser o mais bem qualificado visto até o momento! Portanto, o candidato $i$ tem probabilidade exata $\\frac{1}{i}$ de ser mais qualificado que os candidatos $1$ a $i - 1$, o que nos dá:</p>
          $$E[X_i] = \\frac{1}{i}.$$

          <div class="canonical-callout theorem">
            <span class="callout-tag">[ EQUAÇÃO (5.5) E LEMA 5.2 • CUSTO DE CONTRATAÇÃO DO CASO MÉDIO (pp. 111–112) ]</span>
            <p>Aplicando a linearidade da esperança sobre $X = \\sum_{i=1}^{n} X_i$ e o limite da série harmônica (Equação A.7):</p>
            $$\\begin{aligned} E[X] &= E\\left[\\sum_{i=1}^{n} X_i\\right] = \\sum_{i=1}^{n} E[X_i] \\\\ &= \\sum_{i=1}^{n} \\frac{1}{i} = \\ln n + O(1). \\end{aligned}$$
            <p><strong>Lema 5.2:</strong> <em>Considerando que os candidatos sejam apresentados em ordem aleatória, o algoritmo <code>HIRE-ASSISTANT</code> tem um custo total de contratação $O(c_h \\ln n)$ no caso médio.</em></p>
            <p><strong>Impacto prático:</strong> Mesmo entrevistando $n$ pessoas, contratamos em média apenas $\\approx \\ln n$ delas! Isso representa um salto exponencial de economia frente ao pior caso $O(c_h n)$.</p>
          </div>

          <h3>3. Aplicações Imediatas: Inversões Esperadas e o Problema da Chapelaria</h3>
          <ul>
            <li><strong>Problema da Chapelaria (Exercício 5.2-4):</strong> $n$ clientes entregam seus chapéus e os recebem de volta segundo uma permutação aleatória uniforme. Seja $X_i = I\\{\\text{cliente } i \\text{ recebe o próprio chapéu}\\}$. Como cada cliente tem probabilidade $\\Pr\\{A_i\\} = 1/n$ de receber seu chapéu, mesmo os eventos sendo dependentes, o número esperado de clientes que recebem o próprio chapéu é $E[X] = \\sum_{i=1}^{n} (1/n) = 1$!</li>
            <li><strong>Número Esperado de Inversões (Exercício 5.2-5):</strong> Para cada par $1 \\le i < j \\le n$ em uma permutação aleatória uniforme $A[1 \\dots n]$, definimos $X_{ij} = I\\{A[i] > A[j]\\}$. Como as duas ordens relativas ($A[i] > A[j]$ e $A[i] < A[j]$) são igualmente prováveis, $E[X_{ij}] = 1/2$. Logo, o número esperado de inversões é $\\sum_{1 \\le i < j \\le n} (1/2) = \\binom{n}{2} \\cdot \\frac{1}{2} = \\frac{n(n-1)}{4}$.</li>
          </ul>
        `
      },

      /* ====================================================================
         UNIDADE 4.3 — CAPÍTULO 5, SEÇÃO 5.3
         ==================================================================== */
      {
        id: "u4-3",
        code: "UNIDADE 4.3 • CAP. 5 (SEÇÃO 5.3)",
        pages: "pp. 113–119",
        title: "5.3 Algoritmos Aleatorizados: RANDOMIZED-HIRE-ASSISTANT, PERMUTE-BY-SORTING e RANDOMIZE-IN-PLACE",
        content: `
          <h3>1. Impondo Aleatoriedade na Entrada: <code>RANDOMIZED-HIRE-ASSISTANT</code> (Lema 5.3)</h3>
          <p>Para eliminar a dependência de qualquer hipótese sobre a entrada, permutamos aleatoriamente o arranjo de candidatos <em>antes</em> de iniciar as entrevistas. Considere três entradas específicas de tamanho $10$:</p>
          <ul>
            <li>$A_1 = \\langle 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 \\rangle$ (entrada custosa: sempre induz $10$ contratações no algoritmo determinístico);</li>
            <li>$A_2 = \\langle 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 \\rangle$ (entrada econômica: induz apenas $1$ contratação);</li>
            <li>$A_3 = \\langle 5, 2, 1, 8, 4, 7, 10, 9, 3, 6 \\rangle$ (induz $3$ contratações: candidatos de postos $5$, $8$ e $10$).</li>
          </ul>
          <p>No algoritmo aleatorizado abaixo, <strong>nenhuma entrada específica induz o comportamento de pior caso</strong>! Nem mesmo seu pior inimigo pode fabricar um arranjo patológico, pois a permutação aleatória inicial destrói completamente a ordem fornecida na entrada. O pior caso só ocorre se o gerador de números aleatórios tiver o "azar" de sortear uma permutação ruim:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">RANDOMIZED-HIRE-ASSISTANT(n)</span>
              <span>[ CAPÍTULO 5.3 • LEMA 5.3: CUSTO ESPERADO O(c_h ln n) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">permutar aleatoriamente a lista de candidatos</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">melhor = 0 <span class="cmt">// o candidato 0 é um candidato fictício menos qualificado</span></span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">for</span> i = 1 <span class="kw">to</span> n</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    entrevistar o candidato i</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">if</span> o candidato i é melhor que o candidato melhor</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">        melhor = i</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">        contratar o candidato i</span></div>
            </div>
          </div>

          <p><strong>Lema 5.3:</strong> <em>O custo de contratação esperado do procedimento <code>RANDOMIZED-HIRE-ASSISTANT</code> é $O(c_h \\ln n)$.</em> (Note a precisão terminológica: no Lema 5.2 é custo do <em>caso médio</em>; no Lema 5.3 é custo <em>esperado</em>.)</p>

          <h3>2. Método 1: <code>PERMUTE-BY-SORTING(A)</code> em $\\Theta(n \\lg n)$ e o Lema 5.4</h3>
          <p>Como implementar a linha 1 (permutar aleatoriamente um arranjo $A[1 \\dots n]$)? O primeiro método atribui a cada elemento $A[i]$ uma prioridade aleatória $P[i]$ sorteada em $\\{1, 2, \\dots, n^3\\}$ e ordena $A$ usando $P$ como chaves de ordenação (por exemplo, se $A = \\langle 1, 2, 3, 4 \\rangle$ e sorteamos $P = \\langle 36, 3, 62, 19 \\rangle$, a ordenação pelas prioridades crescentes $3 < 19 < 36 < 62$ produz $B = \\langle 2, 4, 1, 3 \\rangle$):</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">PERMUTE-BY-SORTING(A)</span>
              <span>[ CAPÍTULO 5.3 • PÁGINA 115 ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">n = A.comprimento</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">seja</span> P[1 .. n] um novo arranjo</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">for</span> i = 1 <span class="kw">to</span> n</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    P[i] = RANDOM(1, n³)</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">ordenar A, usando P como chaves de ordenação</span></div>
            </div>
          </div>

          <p>Escolhemos o intervalo $\\{1, \\dots, n^3\\}$ para que a probabilidade de todas as prioridades em $P$ serem distintas seja de no mínimo $1 - 1/n$ (Exercício 5.3-5).</p>

          <div class="canonical-callout theorem">
            <span class="callout-tag">[ LEMA 5.4 • UNIFORMIDADE DE PERMUTE-BY-SORTING (p. 115) ]</span>
            <p><strong>Enunciado:</strong> <em>O procedimento <code>PERMUTE-BY-SORTING</code> produz uma permutação aleatória uniforme da entrada, admitindo que todas as prioridades são distintas.</em></p>
            <p><strong>Prova:</strong> Considere primeiro a permutação identidade, na qual cada $A[i]$ recebe a $i$-ésima menor prioridade. Seja $E_i$ o evento em que $A[i]$ recebe a $i$-ésima menor prioridade. Queremos calcular $\\Pr\\{E_1 \\cap E_2 \\cap \\dots \\cap E_n\\}$. Pela regra do produto para probabilidades condicionais (Exercício C.2-5):</p>
            $$\\Pr\\{E_1 \\cap E_2 \\cap \\dots \\cap E_n\\} = \\Pr\\{E_1\\} \\cdot \\Pr\\{E_2 \\mid E_1\\} \\cdot \\Pr\\{E_3 \\mid E_2 \\cap E_1\\} \\cdots \\Pr\\{E_n \\mid E_{n-1} \\cap \\dots \\cap E_1\\}.$$
            <p>Temos $\\Pr\\{E_1\\} = 1/n$ (qualquer um dos $n$ elementos tem igual chance de ter a menor prioridade). Dado $E_1$, cada um dos $n - 1$ elementos restantes tem igual chance de receber a segunda menor prioridade, logo $\\Pr\\{E_2 \\mid E_1\\} = \\frac{1}{n-1}$. Em geral, $\\Pr\\{E_i \\mid E_{i-1} \\cap \\dots \\cap E_1\\} = \\frac{1}{n - i + 1}$. Multiplicando os fatores:</p>
            $$\\Pr\\{E_1 \\cap E_2 \\cap \\dots \\cap E_n\\} = \\left(\\frac{1}{n}\\right)\\left(\\frac{1}{n-1}\\right)\\cdots\\left(\\frac{1}{2}\\right)\\left(\\frac{1}{1}\\right) = \\frac{1}{n!}.$$
            <p>Para qualquer outra permutação fixa $\\sigma = \\langle \\sigma(1), \\dots, \\sigma(n) \\rangle$, basta definir $E_i$ como o evento em que $A[i]$ recebe a $\\sigma(i)$-ésima menor prioridade: o produto é idêntico e resulta em $\\frac{1}{n!}$. $\\blacksquare$</p>
          </div>

          <h3>3. Método 2 (Ótimo): <code>RANDOMIZE-IN-PLACE(A)</code> em $\\Theta(n)$ e a Prova do Lema 5.5</h3>
          <p>Podemos permutar o arranjo <strong>no lugar</strong> (<em>in-place</em>) em tempo linear $\\Theta(n)$ sem alocar o arranjo $P$ e sem pagar o custo $\\Theta(n \\lg n)$ da ordenação! Na $i$-ésima iteração, o procedimento <code>RANDOMIZE-IN-PLACE(A)</code> (também conhecido na literatura como embaralhamento de Fisher-Yates / Knuth) escolhe $A[i]$ uniformemente dentre os elementos $A[i \\dots n]$. Após a iteração $i$, o elemento $A[i]$ jamais volta a ser alterado:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">RANDOMIZE-IN-PLACE(A)</span>
              <span>[ CAPÍTULO 5.3 • PERMUTAÇÃO UNIFORME NO LUGAR EM Θ(n) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">n = A.comprimento</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">for</span> i = 1 <span class="kw">to</span> n</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    trocar A[i] com A[RANDOM(i, n)]</span></div>
            </div>
          </div>

          <p>Para provar que <code>RANDOMIZE-IN-PLACE</code> gera uma permutação aleatória uniforme, lembramos que uma <strong>$k$-permutação</strong> de um conjunto de $n$ elementos é uma sequência ordenada contendo $k$ dos $n$ elementos sem repetição, existindo exatamente $\\frac{n!}{(n-k)!}$ tais $k$-permutações (Equação C.1).</p>

          <div class="canonical-callout invariant">
            <span class="callout-tag">[ LEMA 5.5 • PROVA POR INVARIANTE DE LAÇO PROBABILÍSTICO (pp. 116–117) ]</span>
            <p><strong>Invariante de Laço:</strong> <em>"Imediatamente antes da $i$-ésima iteração do laço <code>for</code> das linhas 2–3, para cada $(i - 1)$-permutação possível dos $n$ elementos, o subarranjo $A[1 \\dots i - 1]$ contém essa $(i - 1)$-permutação com probabilidade $\\frac{(n - i + 1)!}{n!}$."</em></p>
            <div class="invariant-triad">
              <div class="triad-card">
                <div class="triad-card-title">1. Inicialização</div>
                <p>Imediatamente antes da primeira iteração ($i = 1$), o subarranjo $A[1 \\dots i - 1]$ é o subarranjo vazio $A[1 \\dots 0]$, e uma $0$-permutação é a sequência vazia (sem elementos). Logo, $A[1 \\dots 0]$ contém essa única $0$-permutação com probabilidade $1 = \\frac{n!}{n!} = \\frac{(n - 1 + 1)!}{n!}$. O invariante é válido.</p>
              </div>
              <div class="triad-card">
                <div class="triad-card-title">2. Manutenção</div>
                <p>Considere uma $i$-permutação específica $\\langle x_1, x_2, \\dots, x_i \\rangle$. Seja $E_1$ o evento em que as primeiras $i - 1$ iterações criaram a $(i - 1)$-permutação $\\langle x_1, \\dots, x_{i-1} \\rangle$ em $A[1 \\dots i - 1]$; pela hipótese do invariante, $\\Pr\\{E_1\\} = \\frac{(n - i + 1)!}{n!}$. Seja $E_2$ o evento em que a $i$-ésima iteração coloca $x_i$ em $A[i]$. Dado que $E_1$ ocorreu, $x_i$ é um dos $n - i + 1$ elementos restantes em $A[i \\dots n]$, que a linha 3 sorteia uniformemente com probabilidade condicional $\\Pr\\{E_2 \\mid E_1\\} = \\frac{1}{n - i + 1}$. Portanto:
                $$\\Pr\\{E_2 \\cap E_1\\} = \\Pr\\{E_2 \\mid E_1\\}\\Pr\\{E_1\\} = \\frac{1}{n - i + 1} \\cdot \\frac{(n - i + 1)!}{n!} = \\frac{(n - i)!}{n!}.$$
                Incrementar $i$ para $i + 1$ restabelece o invariante para a próxima iteração!</p>
              </div>
              <div class="triad-card">
                <div class="triad-card-title">3. Término</div>
                <p>No término, $i = n + 1$. Substituindo $i = n + 1$ no invariante, obtemos que o subarranjo $A[1 \\dots n]$ é uma $n$-permutação dada com probabilidade exata:
                $$\\frac{(n - (n + 1) + 1)!}{n!} = \\frac{0!}{n!} = \\frac{1}{n!}.$$
                Logo, <code>RANDOMIZE-IN-PLACE</code> produz uma permutação aleatória uniforme!</p>
              </div>
            </div>
          </div>

          <h3>4. Três Armadilhas Clássicas dos Exercícios 5.3-2, 5.3-3 e 5.3-4</h3>
          <ul>
            <li><strong>Armadilha 1 — <code>PERMUTE-WITH-ALL(A)</code> (Exercício 5.3-3):</strong> E se na linha 3 trocássemos <code>A[i]</code> com <code>A[RANDOM(1, n)]</code> em vez de <code>A[RANDOM(i, n)]</code>? O código faz $n$ escolhas independentes entre $n$ posições, gerando $n^n$ sequências equiprováveis de escolhas. Para que todas as $n!$ permutações fossem equiprováveis, $n!$ teria de dividir $n^n$. Porém, para todo $n \\ge 3$, $n!$ <strong>não divide</strong> $n^n$ (por exemplo, para $n = 3$, temos $n^n = 27$ resultados possíveis e $n! = 6$ permutações; como $27$ não é divisível por $6$, algumas permutações ocorrem com probabilidade $4/27$ e outras com $5/27$!).</li>
            <li><strong>Armadilha 2 — <code>PERMUTE-BY-CYCLIC(A)</code> (Exercício 5.3-4):</strong> Sortear um deslocamento único $\\text{offset} = \\text{RANDOM}(1, n)$ e rotacionar ciclicamente o arranjo faz com que cada elemento $A[i]$ tenha probabilidade individual $1/n$ de terminar em qualquer posição $j$, mas gera apenas $n$ permutações (as $n$ rotações cíclicas) dentre as $n!$ possíveis! Isso prova que ter probabilidade marginal $1/n$ por posição é <em>insuficiente</em> para ser uma permutação aleatória uniforme.</li>
            <li><strong>Armadilha 3 — <code>PERMUTE-WITHOUT-IDENTITY(A)</code> (Exercício 5.3-2):</strong> Executar <code>for i = 1 to n - 1: trocar A[i] com A[RANDOM(i + 1, n)]</code> gera apenas $(n-1)!$ permutações (aquelas que não têm nenhum ponto fixo nos $n-1$ primeiros passos, ou seja, certos desarranjos), deixando de fora permutações não-identidade que fixam apenas $1$ elemento!</li>
          </ul>
        `
      },

      /* ====================================================================
         UNIDADE 4.4 — CAPÍTULO 5, SEÇÃO 5.4
         ==================================================================== */
      {
        id: "u4-4",
        code: "UNIDADE 4.4 • CAP. 5 (SEÇÃO 5.4)",
        pages: "pp. 119–130",
        title: "5.4 Análise Probabilística Avançada: Paradoxo do Aniversário, Bolas e Caixas, Sequências e Contratação On-line",
        content: `
          <p>A Seção 5.4 aprofunda o ferramental probabilístico e o uso de variáveis aleatórias indicadoras por meio de quatro problemas clássicos fundamentais.</p>

          <h3>1. O Paradoxo do Aniversário (Seção 5.4.1, pp. 119–121)</h3>
          <p><em>Quantas pessoas ($k$) devem estar em uma sala para que a probabilidade de ao menos duas delas compartilharem a mesma data de aniversário seja de no mínimo $50\\%$ (assumindo $n = 365$ dias equiprováveis e independentes)?</em></p>
          <ul>
            <li><strong>Abordagem 1 — Análise Probabilística Exata pelo Evento Complementar:</strong> A probabilidade de duas pessoas específicas $i$ e $j$ fazerem aniversário no mesmo dia é $\\sum_{r=1}^{n} \\Pr\\{b_i = r \\text{ e } b_j = r\\} = n \\cdot (1/n^2) = 1/n$ (Equação 5.6). Seja $B_k$ o evento em que todas as $k$ pessoas têm aniversários <em>distintos</em>, e $A_i$ o evento em que a pessoa $i$ difere das $i-1$ anteriores. Como $\\Pr\\{A_i \\mid B_{i-1}\\} = \\frac{n - i + 1}{n}$, aplicando a desigualdade $1 + x \\le e^x$ (Equação 3.12):
              $$\\begin{aligned} \\Pr\\{B_k\\} &= 1 \\cdot \\left(1 - \\frac{1}{n}\\right)\\left(1 - \\frac{2}{n}\\right)\\cdots\\left(1 - \\frac{k-1}{n}\\right) \\\\ &\\le e^{-1/n} e^{-2/n} \\cdots e^{-(k-1)/n} = e^{-\\sum_{i=1}^{k-1} i/n} = e^{-k(k-1)/(2n)}. \\end{aligned}$$
              Para que $\\Pr\\{B_k\\} \\le 1/2$, basta que $-k(k-1)/(2n) \\le \\ln(1/2) = -\\ln 2 \\iff k(k-1) \\ge 2n \\ln 2$, cuja raiz positiva é $k \\ge \\frac{1 + \\sqrt{1 + (8 \\ln 2)n}}{2}$. Para $n = 365$, obtemos <strong>$k \\ge 23$ pessoas</strong> (em Marte, com $n = 669$ dias, seriam $k \\ge 31$ marcianos).</li>
            <li><strong>Abordagem 2 — Análise por Variáveis Aleatórias Indicadoras:</strong> Para cada um dos $\\binom{k}{2}$ pares $(i, j)$ com $1 \\le i < j \\le k$, definimos $X_{ij} = I\\{\\text{pessoa } i \\text{ e pessoa } j \\text{ têm o mesmo aniversário}\\}$. Pelo Lema 5.1, $E[X_{ij}] = 1/n$. O número esperado de pares coincidentes na sala é:
              $$E[X] = \\sum_{i=1}^{k-1} \\sum_{j=i+1}^{k} E[X_{ij}] = \\binom{k}{2} \\frac{1}{n} = \\frac{k(k-1)}{2n}.$$
              Assim, esperamos ao menos $1$ par coincidente ($E[X] \\ge 1$) quando $k(k-1) \\ge 2n$ (aproximadamente $k \\ge \\sqrt{2n} + 1$). Para $n = 365$, basta <strong>$k = 28$ pessoas</strong> ($\\frac{28 \\cdot 27}{2 \\cdot 365} \\approx 1,0356$). Embora os limiares numéricos difiram sutilmente ($23$ para probabilidade $\\ge 1/2$ vs. $28$ para esperança $\\ge 1$), ambos têm a mesma ordem assintótica <strong>$\\Theta(\\sqrt{n})$</strong>!</li>
          </ul>

          <h3>2. Bolas e Caixas e o Problema do Colecionador de Cupons (Seção 5.4.2, pp. 121–122)</h3>
          <p>Lançamos bolas idênticas de forma independente e uniforme em $b$ caixas numeradas $1, 2, \\dots, b$ (probabilidade de cair em uma caixa específica é $p = 1/b$, modelando espalhamento/hashing no Capítulo 11):</p>
          <ol>
            <li><strong>Quantas bolas caem em uma caixa dada após $n$ lançamentos?</strong> Segue a distribuição binomial $b(k; n, 1/b)$, com valor esperado $\\frac{n}{b}$.</li>
            <li><strong>Quantas bolas lançar, em média, até que uma caixa dada receba sua 1ª bola?</strong> Segue a distribuição geométrica com $p = 1/b$, logo a esperança é $\\frac{1}{1/b} = b$.</li>
            <li><strong>Quantas bolas lançar até que TODAS as $b$ caixas contenham ao menos uma bola (Problema do Colecionador de Cupons)?</strong> Chamamos de "acerto" cair em uma caixa ainda vazia e dividimos o processo em $b$ fases: a $i$-ésima fase vai do $(i-1)$-ésimo acerto até o $i$-ésimo acerto. Na fase $i$, há $i - 1$ caixas ocupadas e $b - i + 1$ caixas vazias; logo, cada lançamento na fase $i$ tem probabilidade de acerto $p_i = \\frac{b - i + 1}{b}$. O número $n_i$ de lançamentos na fase $i$ segue uma distribuição geométrica com média $E[n_i] = \\frac{b}{b - i + 1}$. Pela linearidade da esperança sobre $n = \\sum_{i=1}^{b} n_i$:
              $$E[n] = \\sum_{i=1}^{b} E[n_i] = \\sum_{i=1}^{b} \\frac{b}{b - i + 1} = b \\sum_{j=1}^{b} \\frac{1}{j} = b(\\ln b + O(1)) = b \\ln b + O(b).$$
              Portanto, são necessários aproximadamente <strong>$b \\ln b$</strong> lançamentos (ou cupons) para preencher todas as $b$ caixas!</li>
          </ol>

          <h3>3. Sequências de Caras Consecutivas — <em>Streaks</em> (Seção 5.4.3, pp. 122–126)</h3>
          <p><em>Qual é o comprimento esperado $E[L]$ da sequência mais longa de caras consecutivas ao lançar uma moeda justa $n$ vezes?</em> A resposta é <strong>$\\Theta(\\lg n)$</strong>, demonstrada em duas etapas complementares:</p>
          <ul>
            <li><strong>Limite Superior $E[L] = O(\\lg n)$:</strong> Seja $A_{ik}$ o evento em que uma sequência de caras de comprimento $\\ge k$ começa na posição $i$, com $\\Pr\\{A_{ik}\\} = 1/2^k$. Para $k = 2\\lceil \\lg n \\rceil$, temos $\\Pr\\{A_{i, 2\\lceil \\lg n \\rceil}\\} \\le 1/2^{2\\lg n} = 1/n^2$. Pela <strong>desigualdade de Boole</strong> (união de no máximo $n$ posições iniciais), a probabilidade de a maior sequência atingir ao menos $2\\lceil \\lg n \\rceil$ é $\\sum_{j = 2\\lceil \\lg n \\rceil}^{n} \\Pr\\{L_j\\} < n \\cdot (1/n^2) = 1/n$. Particionando o somatório da esperança em $j < 2\\lceil \\lg n \\rceil$ e $j \\ge 2\\lceil \\lg n \\rceil$:
              $$E[L] = \\sum_{j=0}^{2\\lceil \\lg n \\rceil - 1} j \\Pr\\{L_j\\} + \\sum_{j=2\\lceil \\lg n \\rceil}^{n} j \\Pr\\{L_j\\} < 2\\lceil \\lg n \\rceil \\cdot 1 + n \\cdot \\left(\\frac{1}{n}\\right) = O(\\lg n).$$
            </li>
            <li><strong>Limite Inferior $E[L] = \\Omega(\\lg n)$:</strong> Particionamos os $n$ lançamentos em $\\lfloor n / s \\rfloor$ grupos <em>disjuntos e independentes</em> de comprimento $s = \\lfloor (\\lg n)/2 \\rfloor$. A probabilidade de um grupo específico dar somente caras é $\\ge 1/2^{(\\lg n)/2} = 1/\\sqrt{n}$. Logo, a probabilidade de <em>todos</em> os grupos falharem é no máximo $(1 - 1/\\sqrt{n})^{\\lfloor n / \\lfloor (\\lg n)/2 \\rfloor \\rfloor} \\le e^{-\\lg n} = O(1/n)$. Assim, com probabilidade $1 - O(1/n)$, temos $L \\ge \\lfloor (\\lg n)/2 \\rfloor$, garantindo $E[L] = \\Omega(\\lg n)$ e portanto <strong>$E[L] = \\Theta(\\lg n)$</strong>. (Pela análise rápida via variáveis indicadoras $X_{ik} = I\\{A_{ik}\\}$, para $k = c \\lg n$ temos $E[X] \\approx n / 2^{c \\lg n} = n^{1-c}$, que transita em torno de $1$ exatamente quando $c \\approx 1$, isto é, $k = \\Theta(\\lg n)$.)</li>
          </ul>

          <h3>4. O Problema da Contratação On-line e o Limiar Ótimo $k = n/e$ (Seção 5.4.4, pp. 126–128)</h3>
          <p>Na variante <strong>on-line</strong> (famoso <em>Problema da Secretária</em>), você quer contratar <strong>exatamente uma vez</strong> (sem demissões!), decidindo imediatamente após cada entrevista, e quer maximizar a probabilidade de escolher o candidato mais bem qualificado de todos os $n$. A estratégia <code>ON-LINE-MAXIMUM(k, n)</code> entrevista e rejeita os primeiros $k$ candidatos para estabelecer um referencial $\\text{melhorpontuação} = M(k) = \\max_{1 \\le i \\le k} \\text{pontuação}(i)$, e em seguida contrata o primeiro candidato $i \\in \\{k+1, \\dots, n\\}$ que superar $M(k)$:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">ON-LINE-MAXIMUM(k, n)</span>
              <span>[ CAPÍTULO 5.4.4 • ESTRATÉGIA DO LIMIAR DE AMOSTRAGEM k ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">melhorpontuação = -∞</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">for</span> i = 1 <span class="kw">to</span> k</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    <span class="kw">if</span> pontuação(i) &gt; melhorpontuação</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">        melhorpontuação = pontuação(i)</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">for</span> i = k + 1 <span class="kw">to</span> n</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">    <span class="kw">if</span> pontuação(i) &gt; melhorpontuação</span></div>
              <div class="code-line"><span class="line-content">        <span class="kw">return</span> i</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content"><span class="kw">return</span> n</span></div>
            </div>
          </div>

          <div class="canonical-callout theorem">
            <span class="callout-tag">[ ANÁLISE DE ON-LINE-MAXIMUM • LIMIAR k = n/e E PROBABILIDADE ≥ 1/e (pp. 127–128) ]</span>
            <p>Seja $S_i$ o evento em que contratamos o melhor candidato global e ele está na posição $i$. Para $i \\le k$, $\\Pr\\{S_i\\} = 0$ (pois os $k$ primeiros são rejeitados). Para $i > k$, $S_i = B_i \\cap O_i$, onde:</p>
            <ul>
              <li>$B_i$: o melhor candidato global está na posição $i$, com $\\Pr\\{B_i\\} = \\frac{1}{n}$;</li>
              <li>$O_i$: nenhum candidato nas posições $k+1$ até $i-1$ foi contratado antes de $i$. Isso ocorre se, e somente se, o maior valor entre os primeiros $i-1$ candidatos caiu em uma das $k$ primeiras posições! Logo, $\\Pr\\{O_i\\} = \\frac{k}{i - 1}$.</li>
            </ul>
            <p>Como $B_i$ e $O_i$ são independentes, $\\Pr\\{S_i\\} = \\frac{k}{n(i-1)}$. Somando sobre $i = k+1, \\dots, n$ e limitando por integrais (Equação A.12):</p>
            $$\\Pr\\{S\\} = \\sum_{i=k+1}^{n} \\frac{k}{n(i-1)} = \\frac{k}{n} \\sum_{i=k}^{n-1} \\frac{1}{i} \\implies \\frac{k}{n}(\\ln n - \\ln k) \\le \\Pr\\{S\\} \\le \\frac{k}{n}(\\ln(n-1) - \\ln(k-1)).$$
            <p>Para maximizar o limite inferior $f(k) = \\frac{k}{n}(\\ln n - \\ln k)$, derivamos em relação a $k$ e igualamos a zero:</p>
            $$\\frac{d}{dk}\\left[\\frac{k}{n}(\\ln n - \\ln k)\\right] = \\frac{1}{n}(\\ln n - \\ln k - 1) = 0 \\iff \\ln k = \\ln n - 1 = \\ln\\left(\\frac{n}{e}\\right) \\iff k = \\frac{n}{e}.$$
            <p>Substituindo <strong>$k = n/e$</strong> no limite inferior, garantimos contratar o melhor candidato global com probabilidade <strong>$\\Pr\\{S\\} \\ge \\frac{1}{e} \\approx 0,36788$ ($36,8\\%$)</strong>!</p>
          </div>
        `
      },

      /* ====================================================================
         UNIDADE 4.5 — APÊNDICE C, SEÇÕES C.1 E C.2
         ==================================================================== */
      {
        id: "u4-5",
        code: "UNIDADE 4.5 • APÊNDICE C (SEÇÕES C.1 E C.2)",
        pages: "pp. 950–961",
        title: "Apêndice C.1 e C.2: Contagem (Permutações, Combinações, Limites Binomiais) e Probabilidade (Axiomas, Bayes e Independência)",
        content: `
          <h3>1. Teoria da Contagem: Regras Básicas, Permutações e Combinações (Seção C.1)</h3>
          <ul>
            <li><strong>Regra da Soma e Regra do Produto:</strong> Se $A$ e $B$ são conjuntos finitos disjuntos ($A \\cap B = \\emptyset$), então $|A \\cup B| = |A| + |B|$. Para o produto cartesiano de quaisquer conjuntos finitos, $|A \\times B| = |A| \\cdot |B|$.</li>
            <li><strong>$k$-cadeias:</strong> Uma sequência ordenada de $k$ elementos escolhidos de um conjunto $S$ de tamanho $n$ (com repetição permitida) é um elemento de $S^k$; existem exatamente <strong>$n^k$</strong> $k$-cadeias.</li>
            <li><strong>$k$-permutações (Equação C.1):</strong> Uma sequência ordenada de $k$ elementos <em>distintos</em> de um conjunto de $n$ elementos existe em quantidade:
              $$n(n-1)(n-2)\\cdots(n-k+1) = \\frac{n!}{(n-k)!}.$$
            </li>
            <li><strong>$k$-combinações e Coeficientes Binomiais (Equações C.2–C.4):</strong> Um subconjunto (sem ordem) de $k$ elementos distintos de um conjunto de $n$ elementos é obtido dividindo o número de $k$-permutações pelas $k!$ reordenações equivalentes:
              $$\\binom{n}{k} = \\frac{n!}{k!(n-k)!} = \\binom{n}{n-k}, \\qquad (x + y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^k y^{n-k}, \\qquad \\sum_{k=0}^{n} \\binom{n}{k} = 2^n.$$
            </li>
          </ul>

          <div class="canonical-callout theorem">
            <span class="callout-tag">[ LIMITES PARA COEFICIENTES BINOMIAIS E ENTROPIA BINÁRIA (EQUAÇÕES C.5–C.7, pp. 952–953) ]</span>
            <p>Para todo $1 \\le k \\le n$, valem os limites inferior e superiores fundamentais (usando $k! \\ge (k/e)^k$ de Stirling):</p>
            $$\\left(\\frac{n}{k}\\right)^k \\le \\binom{n}{k} \\le \\frac{n^k}{k!} \\le \\left(\\frac{en}{k}\\right)^k.$$
            <p>Além disso, para $0 \\le k \\le n$ e fazendo $k = \\lambda n$ com $0 \\le \\lambda \\le 1$, vale o limite em termos da <strong>função entropia binária</strong> $H(\\lambda) = -\\lambda \\lg \\lambda - (1 - \\lambda)\\lg(1 - \\lambda)$:</p>
            $$\\binom{n}{k} \\le \\frac{n^n}{k^k (n-k)^{n-k}} = 2^{n H(k/n)}.$$
          </div>

          <h3>2. Axiomas de Probabilidade, Desigualdade de Boole e Probabilidade Condicional (Seção C.2)</h3>
          <p>Dado um espaço amostral $S$ (conjunto de eventos elementares), uma distribuição de probabilidades $\\Pr\\{\\}$ mapeia eventos $A \\subseteq S$ para números reais satisfazendo os três <strong>Axiomas de Kolmogorov</strong>:</p>
          <ol>
            <li><strong>Não negatividade:</strong> $\\Pr\\{A\\} \\ge 0$ para qualquer evento $A$;</li>
            <li><strong>Normalização:</strong> $\\Pr\\{S\\} = 1$;</li>
            <li><strong>Aditividade contável:</strong> Se $A_1, A_2, \\dots$ são eventos mutuamente exclusivos aos pares ($A_i \\cap A_j = \\emptyset$ para $i \\ne j$), então $\\Pr\\left\\{\\bigcup_i A_i\\right\\} = \\sum_i \\Pr\\{A_i\\}$.</li>
          </ol>
          <p>Para dois eventos quaisquer $A$ e $B$, vale a inclusão-exclusão $\\Pr\\{A \\cup B\\} = \\Pr\\{A\\} + \\Pr\\{B\\} - \\Pr\\{A \\cap B\\} \\le \\Pr\\{A\\} + \\Pr\\{B\\}$ (Equação C.12). Generalizando para qualquer sequência finita ou contável de eventos (independentes ou não), obtemos a <strong>Desigualdade de Boole / Limite da União (Exercício C.2-2)</strong>:</p>
          $$\\Pr\\{A_1 \\cup A_2 \\cup \\dots\\} \\le \\sum_{i \\ge 1} \\Pr\\{A_i\\}.$$

          <h3>3. Independência Aos Pares vs. Mútua e o Teorema de Bayes</h3>
          <ul>
            <li><strong>Probabilidade Condicional (Equação C.14):</strong> Sempre que $\\Pr\\{B\\} > 0$, definimos $\\Pr\\{A \\mid B\\} = \\frac{\\Pr\\{A \\cap B\\}}{\\Pr\\{B\\}}$.</li>
            <li><strong>Independência Aos Pares vs. Independência Mútua:</strong> Eventos $A_1, \\dots, A_n$ são <strong>independentes aos pares</strong> se $\\Pr\\{A_i \\cap A_j\\} = \\Pr\\{A_i\\}\\Pr\\{A_j\\}$ para todo $i < j$. Eles são <strong>mutuamente independentes</strong> se, para <em>todo</em> subconjunto de $k \\ge 2$ eventos, $\\Pr\\{A_{i_1} \\cap \\dots \\cap A_{i_k}\\} = \\Pr\\{A_{i_1}\\}\\cdots\\Pr\\{A_{i_k}\\}$.
              <br><em>Contraexemplo Canônico do CLRS (p. 958):</em> No lançamento de duas moedas justas, sejam $A_1 =$ "1ª moeda dá cara", $A_2 =$ "2ª moeda dá cara" e $A_3 =$ "as duas moedas dão resultados diferentes". Temos $\\Pr\\{A_1\\} = \\Pr\\{A_2\\} = \\Pr\\{A_3\\} = 1/2$ e, para qualquer par $i < j$, $\\Pr\\{A_i \\cap A_j\\} = 1/4 = \\Pr\\{A_i\\}\\Pr\\{A_j\\}$ (são <strong>independentes aos pares</strong>!). Contudo, $\\Pr\\{A_1 \\cap A_2 \\cap A_3\\} = 0 \\ne (1/2)^3 = 1/8$, logo <strong>não são mutuamente independentes</strong>!</li>
            <li><strong>Teorema de Bayes e Probabilidade Total (Equações C.17 e C.18):</strong> Para eventos $A$ e $B$ de probabilidade não nula:
              $$\\Pr\\{A \\mid B\\} = \\frac{\\Pr\\{A\\}\\Pr\\{B \\mid A\\}}{\\Pr\\{B\\}} = \\frac{\\Pr\\{A\\}\\Pr\\{B \\mid A\\}}{\\Pr\\{A\\}\\Pr\\{B \\mid A\\} + \\Pr\\{\\overline{A}\\}\\Pr\\{B \\mid \\overline{A}\\}}.$$
            </li>
          </ul>
        `
      },

      /* ====================================================================
         UNIDADE 4.6 — APÊNDICE C, SEÇÕES C.3, C.4 E C.5
         ==================================================================== */
      {
        id: "u4-6",
        code: "UNIDADE 4.6 • APÊNDICE C (SEÇÕES C.3, C.4 E C.5)",
        pages: "pp. 961–977",
        title: "Apêndice C.3 a C.5: Variáveis Aleatórias Discretas, Markov, Distribuições Geométrica e Binomial e Limites de Caudas (Chernoff)",
        content: `
          <h3>1. Variáveis Aleatórias Discretas, Esperança, Variância e Desigualdade de Markov (Seção C.3)</h3>
          <p>Uma <strong>variável aleatória discreta</strong> $X: S \\to \\mathbb{R}$ associa um número real a cada resultado do espaço amostral. Sua função densidade (massa) de probabilidade é $f(x) = \\Pr\\{X = x\\}$. Resumimos as identidades fundamentais da Seção C.3:</p>
          <ul>
            <li><strong>Valor Esperado e Linearidade (Equações C.20–C.23):</strong>
              $$E[X] = \\sum_{x} x \\Pr\\{X = x\\}, \\qquad E[aX + Y] = aE[X] + E[Y] \\text{ (sempre!)}.$$
              Se $X$ assume valores naturais $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$, vale a elegante soma de caudas (Equação C.25): $E[X] = \\sum_{i=1}^{\\infty} \\Pr\\{X \\ge i\\}$. E para toda função convexa $f$, vale a <strong>Desigualdade de Jensen</strong> (Equação C.26): $E[f(X)] \\ge f(E[X])$.</li>
            <li><strong>Variância e Desvio-Padrão $\\sigma$ (Equações C.27–C.29):</strong>
              $$\\text{Var}[X] = E\\left[(X - E[X])^2\\right] = E[X^2] - E^2[X], \\qquad \\text{Var}[aX] = a^2 \\text{Var}[X].$$
              Como $\\text{Var}[X] \\ge 0$, temos sempre $E[X^2] \\ge E^2[X]$ (Exercício C.3-8). Se $X_1, \\dots, X_n$ são <strong>independentes aos pares</strong>, então a variância da soma é a soma das variâncias:
              $$\\text{Var}\\left[\\sum_{i=1}^{n} X_i\\right] = \\sum_{i=1}^{n} \\text{Var}[X_i].$$
            </li>
            <li><strong>Desigualdade de Markov (Equação C.30 / Exercício C.3-6):</strong> Se $X$ é uma variável aleatória <strong>não negativa</strong> ($X \\ge 0$), então para todo $t > 0$:
              $$\\Pr\\{X \\ge t\\} \\le \\frac{E[X]}{t}.$$
            </li>
          </ul>

          <h3>2. Tentativas de Bernoulli: Distribuições Geométrica e Binomial (Seção C.4)</h3>
          <p>Uma <strong>tentativa de Bernoulli</strong> possui dois resultados possíveis: <em>sucesso</em> (probabilidade $p$) e <em>insucesso</em> (probabilidade $q = 1 - p$). Da sequência de tentativas de Bernoulli mutuamente independentes emergem duas distribuições essenciais:</p>
          <ol>
            <li><strong>Distribuição Geométrica (Equações C.31–C.33):</strong> Seja $X \\in \\{1, 2, \\dots\\}$ o número de tentativas necessárias até obter o <strong>primeiro sucesso</strong>. Para $k \\ge 1$, precisamos de $k - 1$ insucessos seguidos de $1$ sucesso:
              $$\\Pr\\{X = k\\} = q^{k-1} p, \\qquad E[X] = \\frac{1}{p}, \\qquad \\text{Var}[X] = \\frac{q}{p^2}.$$
            </li>
            <li><strong>Distribuição Binomial (Equações C.34–C.40):</strong> Seja $X \\in \\{0, 1, \\dots, n\\}$ o número total de sucessos em $n$ tentativas independentes. Então:
              $$\\Pr\\{X = k\\} = b(k; n, p) = \\binom{n}{k} p^k q^{n-k}, \\qquad E[X] = np, \\qquad \\text{Var}[X] = npq.$$
              Escrevendo $X = \\sum_{i=1}^{n} X_i$ com $X_i = I\\{i\\text{-ésima tentativa é sucesso}\\}$, obtemos imediatamente $E[X] = \\sum_{i=1}^{n} p = np$ e, como $\\text{Var}[X_i] = E[X_i^2] - E^2[X_i] = p - p^2 = pq$, pela independência temos $\\text{Var}[X] = \\sum_{i=1}^{n} pq = npq$!</li>
          </ol>

          <h3>3. As Caudas da Distribuição Binomial e os Limites Exponenciais de Chernoff (Seção C.5)</h3>
          <p>Em algoritmos aleatorizados, frequentemente precisamos garantir que a probabilidade de $X$ desviar muito de sua média $\\mu = E[X]$ seja exponencialmente pequena:</p>
          <ul>
            <li><strong>Teorema C.2 (Limite Combinatório para a Cauda Direita):</strong> Em $n$ tentativas de Bernoulli com probabilidade $p$, para $0 \\le k \\le n$:
              $$\\Pr\\{X \\ge k\\} = \\sum_{i=k}^{n} b(i; n, p) \\le \\binom{n}{k} p^k.$$
            </li>
            <li><strong>Teorema C.4 e Corolário C.6 (Dominação pelo Termo de Fronteira):</strong> Quando $0 < k < np$ (cauda esquerda), $\\Pr\\{X < k\\} < \\frac{kq}{np - k} b(k; n, p)$. Simetricamente, quando $np < k < n$ (cauda direita, Corolário C.6), $\\Pr\\{X > k\\} < \\frac{(n-k)p}{k - np} b(k; n, p)$.</li>
          </ul>

          <div class="canonical-callout theorem">
            <span class="callout-tag">[ TEOREMA C.8 E COROLÁRIO C.9 • LIMITES DE CHERNOFF PARA TENTATIVAS DE POISSON / BERNOULLI (pp. 972–974) ]</span>
            <p><strong>Teorema C.8:</strong> Considere $n$ tentativas de Bernoulli mutuamente independentes nas quais a $i$-ésima tentativa tem probabilidade de sucesso $p_i$ (não necessariamente iguais!). Seja $X = \\sum_{i=1}^{n} X_i$ o número total de sucessos e seja $\\mu = E[X] = \\sum_{i=1}^{n} p_i$. Então, para todo $r > \\mu$:</p>
            $$\\Pr\\{X - \\mu \\ge r\\} \\le \\left(\\frac{\\mu e}{r}\\right)^r.$$
            <p><strong>Ideia-chave da Prova (Método do Momento Exponencial de Bernstein/Chernoff):</strong> Em vez de aplicar a desigualdade de Markov diretamente a $X - \\mu$, aplicamos Markov à variável exponencial positiva $e^{\\alpha(X - \\mu)}$ para um parâmetro livre $\\alpha > 0$:
            $$\\Pr\\{X - \\mu \\ge r\\} = \\Pr\\left\\{e^{\\alpha(X - \\mu)} \\ge e^{\\alpha r}\\right\\} \\le E\\left[e^{\\alpha(X - \\mu)}\\right] e^{-\\alpha r}.$$
            Pela independência mútua das variáveis $X_i$, a esperança do produto fatora como $\\prod_{i=1}^{n} E[e^{\\alpha(X_i - p_i)}] \\le \\prod_{i=1}^{n} \\exp(p_i e^\\alpha) = \\exp(\\mu e^\\alpha)$, resultando em $\\Pr\\{X - \\mu \\ge r\\} \\le \\exp(\\mu e^\\alpha - \\alpha r)$. Escolhendo o valor ótimo $\\alpha = \\ln(r / \\mu)$ que minimiza o expoente (Exercício C.5-7), obtemos exatamente $\\left(\\frac{\\mu e}{r}\\right)^r$! No caso binomial uniforme ($\\mu = np$, Corolário C.9), temos $\\Pr\\{X - np \\ge r\\} \\le \\left(\\frac{npe}{r}\\right)^r$. $\\blacksquare$</p>
          </div>
        `
      }
    ],

    /* ======================================================================
       BANCADAS INTERATIVAS DO MÓDULO 04 (initWorkbenches)
       1. Laboratório RANDOMIZE-IN-PLACE (Passo a Passo + Invariante) & Monte Carlo HIRE-ASSISTANT (Empírico vs H_n)
       2. Simulador de Contratação On-line (Limiar k = n/e) & Paradoxo do Aniversário
       ====================================================================== */
    initWorkbenches: function () {
      const mount = document.getElementById("workbench-mod4-mount");
      if (!mount) return;

      mount.innerHTML = `
        <div class="workbench-container" style="margin-top:1.75rem;">
          <div class="workbench-header">
            <span class="workbench-title">[ BANCADA INTERATIVA 04 • SIMULADOR CLRS: RANDOMIZE-IN-PLACE, HIRE-ASSISTANT & ON-LINE 1/e ]</span>
            <span class="bracket-tag emerald">[ CAPÍTULO 5 • INTERATIVO ]</span>
          </div>
          <div class="workbench-body" style="display:flex;flex-direction:column;gap:1.5rem;">
            <!-- ABA 1: RANDOMIZE-IN-PLACE PASSO A PASSO + MONTE CARLO HIRE-ASSISTANT -->
            <div style="background:var(--bg-primary);border:var(--border-brutal);padding:1.1rem;">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:0.85rem;">
                <div>
                  <span class="bracket-tag dark">[ LABORATÓRIO A • SEÇÕES 5.1 A 5.3 ]</span>
                  <h4 style="margin:0.35rem 0 0;font-size:1.05rem;">Execução Passo a Passo de <code>RANDOMIZE-IN-PLACE(A)</code> & Monte Carlo de <code>HIRE-ASSISTANT(n)</code></h4>
                </div>
                <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
                  <label style="font-family:var(--font-mono);font-size:0.8rem;">Candidatos n:
                    <select id="mod4-n-select" style="font-family:var(--font-mono);padding:0.25rem 0.4rem;border:1px solid #111;background:#fff;">
                      <option value="8">n = 8</option>
                      <option value="10" selected>n = 10</option>
                      <option value="12">n = 12</option>
                      <option value="16">n = 16</option>
                    </select>
                  </label>
                  <button class="btn-secondary-brutal" id="mod4-btn-reset" style="padding:0.4rem 0.7rem;font-size:0.78rem;">[ REINICIAR A = ⟨1..n⟩ ]</button>
                  <button class="btn-primary-brutal" id="mod4-btn-step" style="padding:0.4rem 0.75rem;font-size:0.78rem;">[ PASSO i DE RANDOMIZE-IN-PLACE → ]</button>
                  <button class="btn-secondary-brutal" id="mod4-btn-mc" style="padding:0.4rem 0.75rem;font-size:0.78rem;">[ SIMULAR M = 2.000 EXECUÇÕES ]</button>
                </div>
              </div>

              <div id="mod4-array-cells" style="display:flex;gap:0.45rem;flex-wrap:wrap;margin:0.85rem 0;"></div>

              <div id="mod4-step-log" style="font-family:var(--font-mono);font-size:0.83rem;background:var(--bg-card);border:var(--border-thin);padding:0.75rem;line-height:1.55;"></div>
            </div>

            <!-- ABA 2: CONTRATAÇÃO ON-LINE (k = n/e) & PARADOXO DO ANIVERSÁRIO -->
            <div style="background:var(--bg-primary);border:var(--border-brutal);padding:1.1rem;">
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:0.85rem;">
                <div>
                  <span class="bracket-tag amber">[ LABORATÓRIO B • SEÇÃO 5.4 ]</span>
                  <h4 style="margin:0.35rem 0 0;font-size:1.05rem;">Curva de Sucesso de <code>ON-LINE-MAXIMUM(k, n)</code> ($k^* = n/e$) & Paradoxo do Aniversário</h4>
                </div>
                <div style="display:flex;gap:0.65rem;align-items:center;flex-wrap:wrap;">
                  <label style="font-family:var(--font-mono);font-size:0.8rem;">Limiar k (para n = 30):
                    <input type="range" id="mod4-k-slider" min="1" max="29" value="11" style="vertical-align:middle;" />
                    <strong id="mod4-k-label">k = 11</strong>
                  </label>
                  <label style="font-family:var(--font-mono);font-size:0.8rem;">Pessoas na sala:
                    <input type="range" id="mod4-bday-slider" min="2" max="60" value="23" style="vertical-align:middle;" />
                    <strong id="mod4-bday-label">23 pessoas</strong>
                  </label>
                </div>
              </div>

              <div id="mod4-online-output" style="font-family:var(--font-mono);font-size:0.83rem;background:var(--bg-card);border:var(--border-thin);padding:0.8rem;line-height:1.6;"></div>
            </div>
          </div>
        </div>
      `;

      let n = 10;
      let arr = [];
      let curI = 1;
      let lastSwapIdx = -1;

      function harmonic(num) {
        let s = 0;
        for (let k = 1; k <= num; k++) s += 1 / k;
        return s;
      }

      function factorialRatio(nVal, iVal) {
        // Calcula (n - i + 1)! / n! = 1 / (n * (n-1) * ... * (n - i + 2))
        if (iVal <= 1) return "1 (0-permutação vazia)";
        let denom = 1;
        for (let m = nVal; m >= nVal - iVal + 2; m--) denom *= m;
        return `1 / ${denom.toLocaleString("pt-BR")} ≈ ${(1 / denom).toExponential(3)}`;
      }

      function countHires(sequence) {
        let best = 0;
        let hires = [];
        for (let idx = 0; idx < sequence.length; idx++) {
          if (sequence[idx] > best) {
            best = sequence[idx];
            hires.push({ pos: idx + 1, rank: sequence[idx] });
          }
        }
        return hires;
      }

      function resetLabA() {
        const sel = document.getElementById("mod4-n-select");
        n = sel ? parseInt(sel.value, 10) : 10;
        arr = Array.from({ length: n }, (_, idx) => idx + 1);
        curI = 1;
        lastSwapIdx = -1;
        renderLabA("Início: A[1 .. 0] está vazio. Invariante Lema 5.5 vale trivialmente com Pr = n!/n! = 1.");
      }

      function stepLabA() {
        if (curI > n) {
          resetLabA();
          return;
        }
        const r = curI + Math.floor(Math.random() * (n - curI + 1)); // RANDOM(i, n) em base 1
        const tmp = arr[curI - 1];
        arr[curI - 1] = arr[r - 1];
        arr[r - 1] = tmp;
        lastSwapIdx = r;
        const msg = `Iteração i = ${curI}: sorteado RANDOM(${curI}, ${n}) = ${r} → trocou A[${curI}] com A[${r}]. O prefixo A[1 .. ${curI}] agora fixa uma ${curI}-permutação uniforme!`;
        curI++;
        renderLabA(msg);
      }

      function renderLabA(statusMsg) {
        const cellsEl = document.getElementById("mod4-array-cells");
        const logEl = document.getElementById("mod4-step-log");
        if (!cellsEl || !logEl) return;

        const hires = countHires(arr);
        const hiredPositions = new Set(hires.map((h) => h.pos));

        cellsEl.innerHTML = arr
          .map((val, idx) => {
            const pos = idx + 1;
            const isFixedPrefix = pos < curI;
            const isCurrentSwap = pos === lastSwapIdx;
            const isHired = hiredPositions.has(pos);
            const bg = isFixedPrefix ? "#111111" : isCurrentSwap ? "#D97706" : "#FFFFFF";
            const fg = isFixedPrefix || isCurrentSwap ? "#F7F4EC" : "#111111";
            return `
              <div style="min-width:58px;border:2px solid #111;background:${bg};color:${fg};padding:0.45rem 0.5rem;text-align:center;font-family:var(--font-mono);">
                <div style="font-size:0.68rem;opacity:0.8;">A[${pos}]</div>
                <div style="font-size:1.05rem;font-weight:700;">${val}</div>
                <div style="font-size:0.65rem;margin-top:0.15rem;color:${isHired ? (isFixedPrefix ? "#34D399" : "#047857") : "inherit"};">
                  ${isHired ? "★ CONTRATA" : "—"}
                </div>
              </div>
            `;
          })
          .join("");

        const hn = harmonic(n);
        logEl.innerHTML = `
          <div><strong>Status do Passo:</strong> ${statusMsg}</div>
          <div style="margin-top:0.35rem;">
            <strong>Invariante Lema 5.5 (antes de i = ${curI}):</strong> Subarranjo prefixo <code>A[1 .. ${curI - 1}]</code> contém a (${curI - 1})-permutação atual com probabilidade exata <code>(n - i + 1)! / n! = ${factorialRatio(n, curI)}</code>.
          </div>
          <div style="margin-top:0.35rem;">
            <strong>Rastreamento de <code>HIRE-ASSISTANT</code> no arranjo atual:</strong> Contratações realizadas = <strong>${hires.length}</strong> (candidatos nos dias ${hires.map((h) => `i=${h.pos} [posto ${h.rank}]`).join(", ")}) vs. Esperança Teórica <strong>H<sub>${n}</sub> = ∑<sub>i=1..${n}</sub> 1/i ≈ ${hn.toFixed(4)}</strong> (ln(${n}) ≈ ${Math.log(n).toFixed(4)}).
          </div>
        `;
      }

      function runMonteCarloHire() {
        const trials = 2000;
        let totalHires = 0;
        let hireExactlyOne = 0;
        let hireExactlyN = 0;
        for (let t = 0; t < trials; t++) {
          const sample = Array.from({ length: n }, (_, idx) => idx + 1);
          for (let i = 0; i < n; i++) {
            const r = i + Math.floor(Math.random() * (n - i));
            const tmp = sample[i];
            sample[i] = sample[r];
            sample[r] = tmp;
          }
          let best = 0;
          let c = 0;
          for (let i = 0; i < n; i++) {
            if (sample[i] > best) {
              best = sample[i];
              c++;
            }
          }
          totalHires += c;
          if (c === 1) hireExactlyOne++;
          if (c === n) hireExactlyN++;
          if (t === trials - 1) {
            arr = sample;
            curI = n + 1;
            lastSwapIdx = -1;
          }
        }
        const empMean = totalHires / trials;
        const hn = harmonic(n);
        renderLabA(
          `Simulação de Monte Carlo concluída (${trials.toLocaleString("pt-BR")} permutações geradas via RANDOMIZE-IN-PLACE): Média empírica = ${empMean.toFixed(4)} contratações vs. Valor Esperado Exato H_${n} = ${hn.toFixed(4)} (diferença de ${Math.abs(empMean - hn).toFixed(4)}). Fração com 1 contratação = ${(hireExactlyOne / trials).toFixed(3)} (teórico 1/${n} = ${(1 / n).toFixed(3)}).`
        );
      }

      function updateLabB() {
        const kSlider = document.getElementById("mod4-k-slider");
        const bSlider = document.getElementById("mod4-bday-slider");
        const kLbl = document.getElementById("mod4-k-label");
        const bLbl = document.getElementById("mod4-bday-label");
        const outEl = document.getElementById("mod4-online-output");
        if (!kSlider || !bSlider || !outEl) return;

        const nOnline = 30;
        const k = parseInt(kSlider.value, 10);
        const kOpt = Math.round(nOnline / Math.E);
        if (kLbl) kLbl.textContent = `k = ${k} (ótimo n/e ≈ ${kOpt})`;

        // Probabilidade exata Pr{S} = (k/n) * sum_{i=k}^{n-1} 1/i
        let sumRecip = 0;
        for (let i = k; i <= nOnline - 1; i++) sumRecip += 1 / i;
        const prExact = (k / nOnline) * sumRecip;
        const prLower = (k / nOnline) * (Math.log(nOnline) - Math.log(k));

        // Paradoxo do Aniversário para kBday pessoas em 365 dias
        const kBday = parseInt(bSlider.value, 10);
        if (bLbl) bLbl.textContent = `${kBday} pessoas`;
        let prAllDistinct = 1;
        for (let i = 1; i < kBday; i++) {
          prAllDistinct *= (365 - i) / 365;
        }
        const prMatch = 1 - prAllDistinct;
        const expectedPairs = (kBday * (kBday - 1)) / (2 * 365);

        outEl.innerHTML = `
          <div><strong>1. Contratação On-line (Seção 5.4.4, n = ${nOnline}, limiar escolhido k = ${k}):</strong></div>
          <div style="margin-left:0.75rem;">
            • Probabilidade Exata de contratar o melhor candidato global: <code>Pr{S} = (k/n) ∑<sub>i=k..n-1</sub> (1/i) = <strong>${(prExact * 100).toFixed(2)}%</strong></code><br/>
            • Limite Inferior Integral do CLRS: <code>(k/n)(ln n - ln k) = <strong>${(prLower * 100).toFixed(2)}%</strong></code> (Limite assintótico 1/e ≈ <strong>36,79%</strong> atingido em k* = n/e ≈ ${ (nOnline / Math.E).toFixed(2) }).
          </div>
          <div style="margin-top:0.55rem;"><strong>2. Paradoxo do Aniversário (Seção 5.4.1, n = 365 dias, k = ${kBday} pessoas):</strong></div>
          <div style="margin-left:0.75rem;">
            • Probabilidade Exata de ao menos 1 coincidência: <code>1 - Pr{B_${kBday}} = <strong>${(prMatch * 100).toFixed(2)}%</strong></code> ${kBday >= 23 ? "<span style='color:#047857;font-weight:700;'>[ ≥ 50% ATINGIDO (k ≥ 23) ]</span>" : "<span style='color:#B45309;'>[ < 50% (mínimo k = 23) ]</span>"}<br/>
            • Número Esperado de Pares Coincidentes (Variáveis Indicadoras X<sub>ij</sub>): <code>E[X] = k(k-1)/(2·365) = <strong>${expectedPairs.toFixed(4)} pares</strong></code> ${kBday >= 28 ? "<span style='color:#047857;font-weight:700;'>[ E[X] ≥ 1 ATINGIDO (k ≥ 28) ]</span>" : ""}
          </div>
        `;
      }

      const selEl = document.getElementById("mod4-n-select");
      const btnReset = document.getElementById("mod4-btn-reset");
      const btnStep = document.getElementById("mod4-btn-step");
      const btnMc = document.getElementById("mod4-btn-mc");
      const kSlider = document.getElementById("mod4-k-slider");
      const bSlider = document.getElementById("mod4-bday-slider");

      if (selEl) selEl.addEventListener("change", resetLabA);
      if (btnReset) btnReset.addEventListener("click", resetLabA);
      if (btnStep) btnStep.addEventListener("click", stepLabA);
      if (btnMc) btnMc.addEventListener("click", runMonteCarloHire);
      if (kSlider) kSlider.addEventListener("input", updateLabB);
      if (bSlider) bSlider.addEventListener("input", updateLabB);

      resetLabA();
      updateLabB();
    },

    /* ======================================================================
       SEÇÃO 3: QUIZZES COM GABARITO COMENTADO (10 QUESTÕES: CAP. 5 + AP. C)
       ====================================================================== */
    quizzes: [
      {
        id: "q4-1",
        type: "Múltipla Escolha",
        reference: "Cap. 5, Seções 5.1 e 5.3 (pp. 107–108, 113–114) — Análise Probabilística vs. Algoritmo Aleatorizado",
        question:
          "Qual é a distinção conceitual e terminológica estabelecida por Cormen, Leiserson, Rivest e Stein entre o Lema 5.2 (para HIRE-ASSISTANT) e o Lema 5.3 (para RANDOMIZED-HIRE-ASSISTANT)?",
        options: [
          {
            letter: "A",
            text: "No Lema 5.2, o algoritmo é determinístico e fazemos uma suposição estatística sobre a distribuição das entradas (obtendo um custo de contratação do caso médio O(c_h ln n)); já no Lema 5.3, não fazemos nenhuma suposição sobre a entrada, pois o próprio algoritmo a permuta aleatoriamente (obtendo um custo de contratação esperado O(c_h ln n) para qualquer entrada).",
            isCorrect: true,
            explanation:
              "Correta! Esta é a distinção central das Seções 5.1 e 5.3 (pp. 108 e 114): 'caso médio' refere-se a uma distribuição presumida sobre as entradas de um algoritmo determinístico, enquanto 'esperado' refere-se às escolhas aleatórias internas de um algoritmo aleatorizado, tornando a ordem original da entrada irrelevante."
          },
          {
            letter: "B",
            text: "O procedimento RANDOMIZED-HIRE-ASSISTANT reduz o custo de pior caso absoluto de O(c_h n) para O(c_h ln n), garantindo que jamais ocorrerão n contratações.",
            isCorrect: false,
            explanation:
              "Incorreta. Um algoritmo aleatorizado ainda pode sofrer o pior caso O(c_h n) se o gerador de números aleatórios tiver o azar de produzir a permutação estritamente crescente (o que ocorre com probabilidade 1/n!). O que muda é que nenhuma entrada específica induz esse pior caso."
          },
          {
            letter: "C",
            text: "No Lema 5.2 o custo de entrevista cai para O(c_i ln n), enquanto no Lema 5.3 o custo de entrevista permanece O(c_i n).",
            isCorrect: false,
            explanation:
              "Incorreta. Em ambos os algoritmos, todos os n candidatos são sempre entrevistados, de modo que o custo total de entrevistas é sempre exatamente c_i n."
          },
          {
            letter: "D",
            text: "Não há diferença alguma entre HIRE-ASSISTANT e RANDOMIZED-HIRE-ASSISTANT: ambos produzem sempre o mesmo número de contratações quando executados duas vezes seguidas sobre a mesma entrada A = ⟨1, 2, ..., 10⟩.",
            isCorrect: false,
            explanation:
              "Incorreta. Sobre A = ⟨1, 2, ..., 10⟩, o determinístico HIRE-ASSISTANT sempre fará 10 contratações em toda execução, enquanto RANDOMIZED-HIRE-ASSISTANT embaralha A a cada execução e fará em média H₁₀ ≈ 2,93 contratações."
          }
        ]
      },
      {
        id: "q4-2",
        type: "Múltipla Escolha",
        reference: "Cap. 5, Seção 5.2 (pp. 109–112) — Variáveis Aleatórias Indicadoras e Lema 5.1",
        question:
          "Na análise do número esperado de contratações E[X] em HIRE-ASSISTANT com variáveis aleatórias indicadoras X_i = I{o candidato i é contratado}, por que podemos afirmar que E[X] = ∑_{i=1..n} E[X_i] = ∑_{i=1..n} (1/i) = ln n + O(1)?",
        options: [
          {
            letter: "A",
            text: "Porque pelo Lema 5.1 temos E[X_i] = Pr{candidato i é contratado} = 1/i (já que qualquer um dos i primeiros candidatos tem igual chance de ser o mais qualificado entre os i primeiros), e pela linearidade da esperança a igualdade E[∑ X_i] = ∑ E[X_i] é válida independentemente de haver ou não dependência entre os X_i.",
            isCorrect: true,
            explanation:
              "Correta! O Lema 5.1 converte a esperança de cada indicadora X_i na probabilidade 1/i, e a linearidade da esperança soma essas esperanças diretamente sem exigir independência (p. 110)."
          },
          {
            letter: "B",
            text: "Porque a linearidade da esperança só vale quando as variáveis X_i são mutuamente independentes, mas não vale no problema da chapelaria (Exercício 5.2-4).",
            isCorrect: false,
            explanation:
              "Incorreta! A linearidade da esperança E[∑ X_i] = ∑ E[X_i] vale SEMPRE, inclusive quando as variáveis são fortemente dependentes (como no problema da chapelaria e nas inversões)."
          },
          {
            letter: "C",
            text: "Porque a probabilidade de o candidato i ser o melhor de todos os n candidatos da agência é 1/i.",
            isCorrect: false,
            explanation:
              "Incorreta! A probabilidade de o candidato i ser o melhor de TODOS os n candidatos é 1/n. O candidato i é contratado quando ele é o melhor entre os PRIMEIROS i candidatos (1 a i), cuja probabilidade é 1/i."
          },
          {
            letter: "D",
            text: "Porque a série harmônica ∑_{i=1..n} (1/i) converge para uma constante finita menor que 2 quando n tende ao infinito.",
            isCorrect: false,
            explanation:
              "Incorreta. A série harmônica diverge logaritmicamente: H_n = ∑_{i=1..n} (1/i) = ln n + O(1) (a série que soma menos que 2 é ∑ 1/i² = π²/6)."
          }
        ]
      },
      {
        id: "q4-3",
        type: "Múltipla Escolha",
        reference: "Cap. 5, Seção 5.3 (pp. 116–118) — Lema 5.5, RANDOMIZE-IN-PLACE e Exercício 5.3-3",
        question:
          "Compare o procedimento correto RANDOMIZE-IN-PLACE(A) (que na iteração i troca A[i] com A[RANDOM(i, n)]) com o procedimento incorreto PERMUTE-WITH-ALL(A) do Exercício 5.3-3 (que na iteração i troca A[i] com A[RANDOM(1, n)]). Assinale a alternativa CORRETA:",
        options: [
          {
            letter: "A",
            text: "Ambos os procedimentos geram uma permutação aleatória uniforme com probabilidade 1/n! para cada permutação, mas RANDOMIZE-IN-PLACE faz menos trocas.",
            isCorrect: false,
            explanation:
              "Incorreta. PERMUTE-WITH-ALL NÃO gera uma permutação aleatória uniforme para nenhum n ≥ 3."
          },
          {
            letter: "B",
            text: "Em RANDOMIZE-IN-PLACE, o invariante do Lema 5.5 garante que antes da iteração i o subarranjo A[1 .. i-1] contém cada (i-1)-permutação com probabilidade (n - i + 1)!/n!, resultando em 1/n! no término (i = n + 1); já PERMUTE-WITH-ALL produz nⁿ sequências equiprováveis de escolhas, e como n! não divide nⁿ para n ≥ 3 (ex.: 6 não divide 27), ele jamais pode distribuir probabilidades iguais de 1/n! a todas as permutações.",
            isCorrect: true,
            explanation:
              "Correta! Esta é a demonstração exata do Lema 5.5 (pp. 116–117) combinada com o argumento de divisibilidade de PERMUTE-WITH-ALL: em n passos com n escolhas equiprováveis cada, as probabilidades de cada permutação são múltiplos de 1/nⁿ, que não podem ser iguais a 1/n! pois n! contém fatores primos (ou multiplicidades) que não dividem nⁿ para n ≥ 3."
          },
          {
            letter: "C",
            text: "Para provar que um algoritmo gera uma permutação aleatória uniforme, basta demonstrar que cada elemento A[i] tem probabilidade 1/n de terminar em cada posição j.",
            isCorrect: false,
            explanation:
              "Incorreta! O Exercício 5.3-4 (PERMUTE-BY-CYCLIC) refuta exatamente essa falácia: deslocar ciclicamente por um offset aleatório dá probabilidade 1/n para cada elemento cair em cada posição, mas só gera n das n! permutações possíveis!"
          },
          {
            letter: "D",
            text: "O procedimento RANDOMIZE-IN-PLACE tem tempo de execução Θ(n lg n) porque precisa ordenar prioridades internamente.",
            isCorrect: false,
            explanation:
              "Incorreta. Quem usa ordenação em Θ(n lg n) é PERMUTE-BY-SORTING; RANDOMIZE-IN-PLACE executa um único laço de n iterações em tempo Θ(n)."
          }
        ]
      },
      {
        id: "q4-4",
        type: "Verdadeiro ou Falso",
        reference: "Cap. 5, Seção 5.4.1 e Exercício 5.4-3 (pp. 119–121, 128) — Paradoxo do Aniversário e Independência",
        question:
          "[ VERDADEIRO OU FALSO ] Na análise do Paradoxo do Aniversário para um ano de n = 365 dias, são necessárias k = 23 pessoas para que a probabilidade de ao menos um par fazer aniversário no mesmo dia seja ≥ 1/2 (análise exata que requer independência mútua dos aniversários), e k = 28 pessoas para que o número esperado de pares com o mesmo aniversário seja ≥ 1 (análise via variáveis indicadoras X_ij que exige apenas independência aos pares).",
        options: [
          {
            letter: "V",
            text: "Verdadeiro — A análise exata multiplica probabilidades condicionais sobre todos os k aniversários (exigindo independência mútua e resultando em k = 23), enquanto a análise por variáveis indicadoras calcula E[X] = ∑_{i<j} Pr{b_i = b_j} = k(k-1)/(2n), que depende apenas da independência dois a dois (aos pares) e atinge E[X] ≥ 1 em k = 28.",
            isCorrect: true,
            explanation:
              "Correta! Esta é a síntese exata da Seção 5.4.1 (pp. 120–121) e da resposta ao Exercício 5.4-3 (p. 128): como cada indicadora X_ij envolve apenas o par (i, j) e a linearidade da esperança não exige independência entre os diferentes pares X_ij, a independência aos pares dos aniversários é suficiente para que E[X] = k(k-1)/(2n)!"
          },
          {
            letter: "F",
            text: "Falso — São necessárias pelo menos 183 pessoas (metade de 365) para que a probabilidade de coincidência atinja 50%.",
            isCorrect: false,
            explanation:
              "Incorreta. Como há k(k-1)/2 pares possíveis entre k pessoas, o número de pares cresce quadraticamente com k, atingindo 23·22/2 = 253 pares já com k = 23 pessoas!"
          }
        ]
      },
      {
        id: "q4-5",
        type: "Múltipla Escolha",
        reference: "Cap. 5, Seções 5.4.2 e 5.4.3 (pp. 121–126) — Bolas e Caixas & Sequências de Moedas",
        question:
          "Considere os resultados demonstrados nas Seções 5.4.2 (Bolas e Caixas) e 5.4.3 (Sequências / Streaks): (1) Qual é o número esperado de lançamentos até que todas as b caixas contenham ao menos uma bola (Problema do Colecionador de Cupons)? (2) Qual é o comprimento esperado da sequência mais longa de caras consecutivas em n lançamentos de uma moeda justa?",
        options: [
          {
            letter: "A",
            text: "(1) Θ(b²) lançamentos; (2) Θ(√n) caras consecutivas.",
            isCorrect: false,
            explanation:
              "Incorreta. Θ(√b) é o número esperado de lançamentos até que UMA caixa tenha DUAS bolas (colisão de aniversário, Exercício 5.4-2), e preencher todas as b caixas leva b ln b + O(b) = Θ(b ln b)."
          },
          {
            letter: "B",
            text: "(1) b H_b = b ln b + O(b) = Θ(b ln b) lançamentos (obtido somando as médias b/(b - i + 1) das b fases geométricas); (2) Θ(lg n) caras consecutivas (com probabilidade no máximo 1/n de atingir comprimento ≥ 2⌈lg n⌉).",
            isCorrect: true,
            explanation:
              "Correta! Na Seção 5.4.2, a i-ésima fase (quando b - i + 1 caixas estão vazias) tem distribuição geométrica com p_i = (b - i + 1)/b e média b/(b - i + 1), somando b ∑_{j=1..b} (1/j) = b ln b + O(b). Na Seção 5.4.3, os limites superior O(lg n) e inferior Ω(lg n) provam que o comprimento esperado da maior sequência de caras é Θ(lg n)."
          },
          {
            letter: "C",
            text: "(1) Exatamente b lançamentos em média; (2) Θ(n / 2) caras consecutivas.",
            isCorrect: false,
            explanation:
              "Incorreta. b é o número esperado de lançamentos para que UMA ÚNICA caixa específica receba uma bola; para TODAS as b caixas receberem ao menos uma bola, são necessários b ln b + O(b) lançamentos."
          },
          {
            letter: "D",
            text: "(1) Θ(ln b) lançamentos; (2) Θ(lg lg n) caras consecutivas.",
            isCorrect: false,
            explanation:
              "Incorreta. Falta o fator b em b ln b, e o comprimento esperado da maior sequência de caras é Θ(lg n)."
          }
        ]
      },
      {
        id: "q4-6",
        type: "Múltipla Escolha",
        reference: "Cap. 5, Seção 5.4.4 (pp. 126–128) — Problema da Contratação On-line (ON-LINE-MAXIMUM)",
        question:
          "No procedimento ON-LINE-MAXIMUM(k, n), rejeitamos os primeiros k candidatos para fixar melhorpontuação = M(k) e contratamos o primeiro candidato i ∈ {k + 1, ..., n} com pontuação maior que M(k). Qual é a expressão exata de Pr{S_i} para i > k, qual escolha de k maximiza o limite inferior de Pr{S}, e qual é a probabilidade mínima garantida de contratar o melhor candidato global?",
        options: [
          {
            letter: "A",
            text: "Pr{S_i} = k / [n(i - 1)]; o limiar ótimo é k = n/e (cerca de 36,8% dos candidatos entrevistados como amostra); e a probabilidade de contratar o melhor candidato global é de no mínimo 1/e ≈ 36,8%.",
            isCorrect: true,
            explanation:
              "Correta! Para ter sucesso na posição i > k, o melhor global deve estar em i (Pr{B_i} = 1/n) e o máximo dos primeiros i - 1 candidatos deve estar entre os primeiros k (Pr{O_i} = k/(i - 1)). Derivando o limite inferior (k/n)(ln n - ln k) em relação a k e igualando a zero, obtemos ln k = ln n - 1 ⟺ k = n/e, com Pr{S} ≥ 1/e."
          },
          {
            letter: "B",
            text: "Pr{S_i} = 1/n; o limiar ótimo é k = n/2; e a probabilidade garantida de sucesso é 1/2 = 50%.",
            isCorrect: false,
            explanation:
              "Incorreta. Escolher k = n/2 dá probabilidade aproximada (1/2) ln 2 ≈ 34,66%, inferior ao ótimo k = n/e que atinge 1/e ≈ 36,79%."
          },
          {
            letter: "C",
            text: "Os eventos B_i (o melhor global está em i) e O_i (o máximo entre 1..i-1 está em 1..k) são mutuamente exclusivos, portanto Pr{S_i} = Pr{B_i} + Pr{O_i}.",
            isCorrect: false,
            explanation:
              "Incorreta. Os eventos B_i e O_i são INDEPENDENTES (p. 127), pois B_i depende apenas de o elemento na posição i ser maior que todos os outros, enquanto O_i depende apenas da ordem relativa dos primeiros i - 1 elementos entre si. Por isso Pr{S_i} = Pr{B_i} · Pr{O_i}."
          },
          {
            letter: "D",
            text: "A probabilidade de sucesso de ON-LINE-MAXIMUM tende a 0 quando n tende ao infinito, mesmo escolhendo o melhor k possível.",
            isCorrect: false,
            explanation:
              "Incorreta! O resultado extraordinário da Seção 5.4.4 é justamente que, mesmo para n arbitrariamente grande (milhões de candidatos), rejeitar os primeiros n/e candidatos garante pelo menos 1/e ≈ 36,8% de chance de contratar o único melhor candidato!"
          }
        ]
      },
      {
        id: "q4-7",
        type: "Múltipla Escolha",
        reference: "Apêndice C, Seção C.1 (pp. 951–953) — Permutações, Combinações e Limites para Coeficientes Binomiais",
        question:
          "De acordo com a Seção C.1 do Apêndice C, dado um conjunto S de n elementos e um inteiro k com 1 ≤ k ≤ n, quais são respectivamente: (i) o número de k-permutações de S, (ii) o número de k-combinações de S, e (iii) os limites inferior e superior da Equação (C.5)-(C.6) para o coeficiente binomial C(n, k)?",
        options: [
          {
            letter: "A",
            text: "(i) n! / (n - k)! ; (ii) n! / [k!(n - k)!] ; (iii) (n/k)ᵏ ≤ C(n, k) ≤ nᵏ / k! ≤ (en/k)ᵏ.",
            isCorrect: true,
            explanation:
              "Correta! Estas são exatamente as equações (C.1), (C.2), (C.5) e (C.6) das páginas 951–953 do livro."
          },
          {
            letter: "B",
            text: "(i) nᵏ ; (ii) n! / (n - k)! ; (iii) (k/n)ᵏ ≤ C(n, k) ≤ (n/e)ᵏ.",
            isCorrect: false,
            explanation:
              "Incorreta. nᵏ é o número de k-cadeias (com repetição permitida), não de k-permutações."
          },
          {
            letter: "C",
            text: "(i) k! ; (ii) 2ⁿ ; (iii) n/k ≤ C(n, k) ≤ nᵏ.",
            isCorrect: false,
            explanation:
              "Incorreta. 2ⁿ é a soma de todos os coeficientes binomiais ∑_{k=0..n} C(n, k), isto é, o número total de subconjuntos de todos os tamanhos."
          },
          {
            letter: "D",
            text: "Para k = 0, o coeficiente binomial C(n, 0) é igual a 0, pois não é possível escolher 0 elementos.",
            isCorrect: false,
            explanation:
              "Incorreta. Na página 952, os autores destacam explicitamente que para k = 0 o número de modos de escolher 0 elementos é 1 (o conjunto vazio), já que 0! = 1."
          }
        ]
      },
      {
        id: "q4-8",
        type: "Verdadeiro ou Falso",
        reference: "Apêndice C, Seção C.2 (p. 958) — Independência Aos Pares vs. Independência Mútua",
        question:
          "[ VERDADEIRO OU FALSO ] Se três eventos A₁, A₂ e A₃ em um espaço amostral satisfazem Pr{A_i ∩ A_j} = Pr{A_i}Pr{A_j} para todos os pares 1 ≤ i < j ≤ 3 (isto é, são independentes aos pares), então eles são necessariamente mutuamente independentes, valendo automaticamente Pr{A₁ ∩ A₂ ∩ A₃} = Pr{A₁}Pr{A₂}Pr{A₃}.",
        options: [
          {
            letter: "V",
            text: "Verdadeiro — A independência aos pares sempre implica a independência mútua de qualquer coleção finita de eventos.",
            isCorrect: false,
            explanation:
              "Incorreta! Independência aos pares é uma condição estritamente mais fraca que independência mútua."
          },
          {
            letter: "F",
            text: "Falso — No contraexemplo clássico da página 958 (lançamento de duas moedas justas com A₁ = '1ª moeda cara', A₂ = '2ª moeda cara' e A₃ = 'as duas moedas dão resultados diferentes'), temos Pr{A_i} = 1/2 e Pr{A_i ∩ A_j} = 1/4 para todo par i < j, mas Pr{A₁ ∩ A₂ ∩ A₃} = 0 ≠ 1/8 = Pr{A₁}Pr{A₂}Pr{A₃}.",
            isCorrect: true,
            explanation:
              "Correta! O exemplo da página 958 mostra que A₁, A₂ e A₃ são independentes aos pares, mas se A₁ e A₂ ocorrem (ambas caras), é impossível que A₃ (resultados diferentes) ocorra, logo Pr{A₁ ∩ A₂ ∩ A₃} = 0 ≠ 1/8."
          }
        ]
      },
      {
        id: "q4-9",
        type: "Múltipla Escolha",
        reference: "Apêndice C, Seções C.3 e C.4 (pp. 964–969) — Desigualdade de Markov e Distribuições Geométrica e Binomial",
        question:
          "Assinale a alternativa que apresenta CORRETAMENTE a Desigualdade de Markov (Equação C.30) para uma variável aleatória não negativa X e os valores esperados e variâncias das distribuições Geométrica (parâmetro p) e Binomial b(k; n, p) (com q = 1 - p):",
        options: [
          {
            letter: "A",
            text: "Markov: Pr{X ≥ t} ≤ E[X] / t (para todo t > 0); Geométrica: E[X] = 1/p e Var[X] = q / p²; Binomial: E[X] = np e Var[X] = npq.",
            isCorrect: true,
            explanation:
              "Correta! Todas as cinco expressões correspondem exatamente às Equações (C.30), (C.32), (C.33), (C.37) e (C.40) do Apêndice C."
          },
          {
            letter: "B",
            text: "Markov: Pr{X ≥ t} ≤ t / E[X]; Geométrica: E[X] = p e Var[X] = pq; Binomial: E[X] = n/p e Var[X] = nq/p².",
            isCorrect: false,
            explanation:
              "Incorreta. Na desigualdade de Markov E[X] está no numerador e t no denominador; além disso, as fórmulas da geométrica e da binomial foram trocadas/invertidas."
          },
          {
            letter: "C",
            text: "A desigualdade de Markov vale para qualquer variável aleatória X que assuma valores positivos e negativos, e E[X²] é sempre menor ou igual a E²[X].",
            isCorrect: false,
            explanation:
              "Incorreta. A desigualdade de Markov exige que X seja não negativa (X ≥ 0), e como Var[X] = E[X²] - E²[X] ≥ 0, temos sempre E[X²] ≥ E²[X] (Exercício C.3-8)."
          },
          {
            letter: "D",
            text: "Para calcular a variância da distribuição binomial Var[X] = npq, não precisamos que as n tentativas de Bernoulli sejam independentes.",
            isCorrect: false,
            explanation:
              "Incorreta. Enquanto E[X] = np usa apenas linearidade da esperança, a soma das variâncias Var[∑ X_i] = ∑ Var[X_i] = npq exige que as tentativas sejam independentes aos pares (Equação C.29)."
          }
        ]
      },
      {
        id: "q4-10",
        type: "Múltipla Escolha",
        reference: "Apêndice C, Seção C.5 (pp. 972–974) — Teorema C.8 e Limites de Caudas da Distribuição Binomial",
        question:
          "No Teorema C.8 (p. 972), considera-se a soma X = ∑_{i=1..n} X_i de n tentativas de Bernoulli mutuamente independentes com probabilidades de sucesso p_i e média μ = E[X] = ∑ p_i. Qual é a técnica central da demonstração e qual é o limite obtido para a cauda direita Pr{X - μ ≥ r} quando r > μ?",
        options: [
          {
            letter: "A",
            text: "Aplica-se a desigualdade de Markov à variável exponencial e^{α(X - μ)} (para α > 0), usa-se a independência mútua para fatorar E[e^{α(X - μ)}] = ∏ E[e^{α(X_i - p_i)}] ≤ exp(μ e^α), e escolhe-se o parâmetro ótimo α = ln(r/μ), obtendo Pr{X - μ ≥ r} ≤ (μe / r)^r.",
            isCorrect: true,
            explanation:
              "Correta! Esta é a demonstração completa do Teorema C.8 (pp. 972–974), um dos resultados mais importantes do Apêndice C (conhecido como limite de Chernoff), que produz decaimento exponencial na cauda superior."
          },
          {
            letter: "B",
            text: "Aplica-se a desigualdade de Markov diretamente a X, obtendo Pr{X - μ ≥ r} ≤ μ / r, que decai apenas linearmente com r.",
            isCorrect: false,
            explanation:
              "Incorreta. Aplicar Markov diretamente a X dá apenas um limite linear fraco; o truque de Chernoff no Teorema C.8 é justamente aplicar Markov a e^{α(X - μ)} para obter o limite exponencial (μe / r)^r."
          },
          {
            letter: "C",
            text: "O Teorema C.8 só é válido se todas as probabilidades p_i forem estritamente iguais a 1/2.",
            isCorrect: false,
            explanation:
              "Incorreta. O Teorema C.8 vale para tentativas de Bernoulli com probabilidades heterogêneas p_1, p_2, ..., p_n quaisquer (tentativas de Poisson); o caso de probabilidades iguais p_i = p é o Corolário C.9."
          },
          {
            letter: "D",
            text: "O valor ótimo de α que minimiza o lado direito da desigualdade na prova do Teorema C.8 é α = 0.",
            isCorrect: false,
            explanation:
              "Incorreta. Para α = 0 a desigualdade torna-se trivial (≤ 1); derivando μe^α - αr em relação a α, o mínimo ocorre em μe^α = r ⟺ α = ln(r/μ) > 0 (já que r > μ)."
          }
        ]
      }
    ],

    /* ======================================================================
       SEÇÃO 4: EXERCÍCIOS E PROBLEMAS CANÔNICOS RESOLVIDOS (8 ATIVIDADES)
       ====================================================================== */
    exercicios: [
      {
        id: "ex4-1",
        code: "EXERCÍCIO 01 • GERADORES ALEATÓRIOS E REMOÇÃO DE VIÉS (VON NEUMANN)",
        reference: "Exercícios 5.1-2 e 5.1-3 (p. 108)",
        title: "Implementar RANDOM(a, b) via RANDOM(0, 1) e Desenviesar BIASED-RANDOM",
        prompt: `
          <p>Resolva os dois exercícios clássicos de construção de geradores aleatórios da Seção 5.1:</p>
          <ol>
            <li><strong>(Exercício 5.1-2)</strong> Descreva uma implementação do procedimento <code>RANDOM(a, b)</code> que só faça chamadas a <code>RANDOM(0, 1)</code>. Qual é o tempo de execução esperado de seu procedimento em função de $a$ e $b$?</li>
            <li><strong>(Exercício 5.1-3)</strong> Suponha que você tenha à disposição um procedimento <code>BIASED-RANDOM()</code> que retorna $1$ com alguma probabilidade desconhecida $p$ e $0$ com probabilidade $1 - p$, onde $0 < p < 1$. Projete um algoritmo que utilize <code>BIASED-RANDOM</code> como sub-rotina e retorne $0$ com probabilidade exata $1/2$ e $1$ com probabilidade exata $1/2$. Qual é o tempo de execução esperado em função de $p$?</li>
          </ol>
        `,
        placeholder:
          "Escreva o pseudocódigo de RANDOM(a, b) gerando k = ⌈lg(b - a + 1)⌉ bits com amostragem por rejeição, e o truque de pares (0,1) vs (1,0) de von Neumann para BIASED-RANDOM...",
        solution: `
          <h4>1. Implementação de <code>RANDOM(a, b)</code> usando <code>RANDOM(0, 1)</code> (Exercício 5.1-2)</h4>
          <p>Queremos sortear uniformemente um inteiro no conjunto $\\{a, a+1, \\dots, b\\}$, que possui $m = b - a + 1$ elementos, o que equivale a sortear $r \\in \\{0, 1, \\dots, b - a\\}$ e devolver $a + r$. Se $a == b$, devolvemos $a$ em $O(1)$. Caso contrário, seja $k = \\lceil \\lg(b - a + 1) \\rceil$ o menor inteiro tal que $2^k \\ge b - a + 1$. Em cada tentativa, fazemos $k$ chamadas a <code>RANDOM(0, 1)</code> para construir os $k$ bits de um inteiro $r \\in \\{0, 1, \\dots, 2^k - 1\\}$ de forma perfeitamente uniforme. Se $r \\le b - a$, devolvemos $a + r$; se $r > b - a$ (fora da faixa), rejeitamos $r$ e repetimos:</p>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">RANDOM(a, b)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> a == b</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">return</span> a</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">k = ⌈lg(b - a + 1)⌉</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">while</span> TRUE</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    r = 0</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">    <span class="kw">for</span> i = 1 <span class="kw">to</span> k</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">        r = 2 · r + RANDOM(0, 1)</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">    <span class="kw">if</span> r ≤ b - a</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">        <span class="kw">return</span> a + r</span></div>
            </div>
          </div>
          <p><strong>Tempo de Execução Esperado:</strong> Como $2^{k-1} < b - a + 1 \\le 2^k$, a probabilidade de sucesso $p$ em cada iteração do laço <code>while</code> é $p = \\frac{b - a + 1}{2^k} > \\frac{2^{k-1}}{2^k} = \\frac{1}{2}$. Pelo modelo da distribuição geométrica (Equação C.32), o número esperado de iterações do <code>while</code> é $1/p < 2 = O(1)$. Como cada iteração faz $k = \\Theta(\\lg(b - a))$ chamadas a <code>RANDOM(0, 1)</code>, o tempo esperado total é <strong>$\\Theta(\\lg(b - a))$</strong>.</p>

          <h4>2. Algoritmo <code>UNBIASED-RANDOM()</code> de von Neumann (Exercício 5.1-3)</h4>
          <p>Observe a simetria fundamental de duas chamadas independentes $x$ e $y$ a <code>BIASED-RANDOM()</code>: o par $(x=0, y=1)$ ocorre com probabilidade $(1 - p)p$, e o par $(x=1, y=0)$ ocorre exatamente com a <strong>mesma probabilidade</strong> $p(1 - p)$! Já os pares $(0, 0)$ e $(1, 1)$ são descartados:</p>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">UNBIASED-RANDOM()</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">while</span> TRUE</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    x = BIASED-RANDOM()</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    y = BIASED-RANDOM()</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">if</span> x ≠ y</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">        <span class="kw">return</span> x</span></div>
            </div>
          </div>
          <p><strong>Corretude e Tempo Esperado:</strong> A probabilidade de parar em uma dada iteração (evento $x \\ne y$) é $q = 2p(1 - p)$. Condicionado a $x \\ne y$, as probabilidades de retornar $0$ (par $(0,1)$) e retornar $1$ (par $(1,0)$) são ambas iguais a $\\frac{p(1-p)}{2p(1-p)} = \\frac{1}{2}$. Como o número de iterações segue uma distribuição geométrica com probabilidade de sucesso $2p(1-p)$, o número esperado de iterações é $\\frac{1}{2p(1-p)}$, e o tempo de execução esperado é <strong>$\\Theta\\left(\\frac{1}{p(1 - p)}\\right)$</strong>.</p>
        `
      },
      {
        id: "ex4-2",
        code: "EXERCÍCIO 02 • CONTRATAÇÕES EXATAS, CHAPELARIA E INVERSÕES",
        reference: "Exercícios 5.2-1, 5.2-2, 5.2-4 e 5.2-5 (p. 112)",
        title: "Probabilidades de Contratar 1, 2 ou n Vezes, Problema da Chapelaria e Inversões Esperadas",
        prompt: `
          <p>Assumindo que os $n$ candidatos em <code>HIRE-ASSISTANT</code> se apresentam em uma permutação aleatória uniforme, resolva os seguintes problemas da Seção 5.2:</p>
          <ol>
            <li><strong>(Exercícios 5.2-1 e 5.2-2)</strong> Qual é a probabilidade de você contratar <strong>exatamente $1$ vez</strong>? E <strong>exatamente $n$ vezes</strong>? E <strong>exatamente $2$ vezes</strong>?</li>
            <li><strong>(Exercício 5.2-4 — Problema da Chapelaria)</strong> Cada um de $n$ clientes entrega seu chapéu na chapelaria de um restaurante, e o funcionário devolve os chapéus em ordem aleatória uniforme. Use variáveis aleatórias indicadoras para determinar o número esperado de clientes que recebem de volta seu próprio chapéu.</li>
            <li><strong>(Exercício 5.2-5 — Inversões Esperadas)</strong> Seja $A[1 \\dots n]$ uma permutação aleatória uniforme de $\\langle 1, 2, \\dots, n \\rangle$. Use variáveis indicadoras para calcular o número esperado de inversões $(i, j)$ com $i < j$ e $A[i] > A[j]$.</li>
          </ol>
        `,
        placeholder:
          "Deduza as probabilidades para 1, n e 2 contratações, defina X_i para o problema da chapelaria e X_ij para as inversões...",
        solution: `
          <h4>1. Probabilidades de Contratar Exatamente $1$, $n$ e $2$ Vezes (Exercícios 5.2-1 e 5.2-2)</h4>
          <ul>
            <li><strong>Contratar exatamente $1$ vez:</strong> O candidato $1$ é sempre contratado na 1ª iteração. Para que nenhum outro candidato seja contratado depois dele, o candidato $1$ precisa ser o mais bem qualificado de todos os $n$ candidatos ($\\text{ordenação}(1) = n$). Como há $(n-1)!$ permutações que começam com $n$ dentre as $n!$ permutações possíveis, a probabilidade é:
              $$\\Pr\\{\\text{contratar exatamente } 1 \\text{ vez}\\} = \\frac{(n-1)!}{n!} = \\mathbf{\\frac{1}{n}}.$$
            </li>
            <li><strong>Contratar exatamente $n$ vezes:</strong> Ocorre se, e somente se, os $n$ candidatos chegarem em ordem estritamente crescente de qualificação $\\langle 1, 2, 3, \\dots, n \\rangle$. Como essa é apenas $1$ das $n!$ permutações possíveis:
              $$\\Pr\\{\\text{contratar exatamente } n \\text{ vezes}\\} = \\mathbf{\\frac{1}{n!}}.$$
            </li>
            <li><strong>Contratar exatamente $2$ vezes (Exercício 5.2-2):</strong> O candidato $1$ é contratado primeiro. Para haver exatamente uma segunda contratação, o candidato mais qualificado de todos (posto $n$) deve estar em alguma posição $j \\in \\{2, \\dots, n\\}$, e o candidato na posição $1$ deve ser o mais qualificado dentre os primeiros $j - 1$ candidatos (para que ninguém nas posições $2, \\dots, j - 1$ seja contratado antes de $j$). Para um dado $i = \\text{ordenação}(1) \\in \\{1, 2, \\dots, n - 1\\}$, ou equivalentemente condicionando na posição $j$ do candidato de posto $n$ ($\\Pr = 1/n$) e no evento independente de o máximo entre as posições $1 \\dots j - 1$ estar na posição $1$ ($\\Pr = \\frac{1}{j - 1}$):
              $$\\Pr\\{\\text{contratar exatamente } 2 \\text{ vezes}\\} = \\sum_{j=2}^{n} \\frac{1}{n} \\cdot \\frac{1}{j - 1} = \\frac{1}{n} \\sum_{k=1}^{n-1} \\frac{1}{k} = \\mathbf{\\frac{H_{n-1}}{n}}.$$
            </li>
          </ul>

          <h4>2. Problema da Chapelaria (Exercício 5.2-4)</h4>
          <p>Para cada cliente $i \\in \\{1, 2, \\dots, n\\}$, definimos a variável aleatória indicadora $X_i = I\\{\\text{o cliente } i \\text{ recebe seu próprio chapéu}\\}$. O número total de clientes que recebem o próprio chapéu é $X = \\sum_{i=1}^{n} X_i$. Como a devolução é uma permutação aleatória uniforme, cada cliente $i$ tem probabilidade exata $\\frac{1}{n}$ de receber seu chapéu; pelo Lema 5.1, $E[X_i] = \\frac{1}{n}$. Pela linearidade da esperança:</p>
          $$E[X] = E\\left[\\sum_{i=1}^{n} X_i\\right] = \\sum_{i=1}^{n} E[X_i] = \\sum_{i=1}^{n} \\frac{1}{n} = n \\cdot \\frac{1}{n} = \\mathbf{1}.$$

          <h4>3. Número Esperado de Inversões (Exercício 5.2-5)</h4>
          <p>Para cada par de índices $(i, j)$ com $1 \\le i < j \\le n$, definimos $X_{ij} = I\\{(i, j) \\text{ é uma inversão}\\} = I\\{A[i] > A[j]\\}$. Em uma permutação aleatória uniforme de $n$ números distintos, quaisquer dois elementos $A[i]$ e $A[j]$ têm probabilidade idêntica de aparecer com $A[i] > A[j]$ ou $A[i] < A[j]$; logo, $\\Pr\\{A[i] > A[j]\\} = \\frac{1}{2}$ e $E[X_{ij}] = \\frac{1}{2}$. Como há $\\binom{n}{2} = \\frac{n(n-1)}{2}$ pares $(i, j)$ com $i < j$, a linearidade da esperança nos dá:</p>
          $$E[X] = \\sum_{i=1}^{n-1} \\sum_{j=i+1}^{n} E[X_{ij}] = \\binom{n}{2} \\cdot \\frac{1}{2} = \\mathbf{\\frac{n(n - 1)}{4}}.$$
        `
      },
      {
        id: "ex4-3",
        code: "EXERCÍCIO 03 • ANÁLISE DE ALGORITMOS DE PERMUTAÇÃO E AMOSTRAGEM",
        reference: "Exercícios 5.3-2, 5.3-3 e 5.3-7 (pp. 117–119)",
        title: "Por que PERMUTE-WITHOUT-IDENTITY e PERMUTE-WITH-ALL Falham e Amostragem RANDOM-SAMPLE(m, n)",
        prompt: `
          <p>Analise três procedimentos fundamentais da Seção 5.3:</p>
          <ol>
            <li><strong>(Exercício 5.3-2)</strong> O professor Kelp propõe <code>PERMUTE-WITHOUT-IDENTITY(A)</code> (que executa <code>for i = 1 to n - 1: trocar A[i] com A[RANDOM(i + 1, n)]</code>) afirmando que ele gera toda permutação exceto a permutação identidade. Mostre por que o código do professor Kelp está errado para $n \\ge 3$.</li>
            <li><strong>(Exercício 5.3-3)</strong> Demonstre formalmente por que <code>PERMUTE-WITH-ALL(A)</code> (que executa <code>for i = 1 to n: trocar A[i] com A[RANDOM(1, n)]</code>) não produz uma permutação aleatória uniforme.</li>
            <li><strong>(Exercício 5.3-7)</strong> Mostre por indução que o procedimento recursivo <code>RANDOM-SAMPLE(m, n)</code> devolve um subconjunto aleatório uniforme de $m$ elementos de $\\{1, 2, \\dots, n\\}$ fazendo apenas $m$ chamadas a <code>RANDOM</code>:
              <br><code>se m == 0 return ∅; senão S = RANDOM-SAMPLE(m - 1, n - 1); i = RANDOM(1, n); se i ∈ S então S = S ∪ {n} senão S = S ∪ {i}; return S</code>.</li>
          </ol>
        `,
        placeholder:
          "Compare o número de resultados possíveis (n-1)! vs n! - 1 no Ex. 5.3-2, o argumento de divisibilidade n! | nⁿ no Ex. 5.3-3, e faça a indução em m no Ex. 5.3-7...",
        solution: `
          <h4>1. O Erro de <code>PERMUTE-WITHOUT-IDENTITY(A)</code> (Exercício 5.3-2)</h4>
          <p>Existem $n! - 1$ permutações diferentes da identidade. Contudo, na iteração $i = 1$, o laço de Kelp tem $n - 1$ escolhas (índices $2 \\dots n$); na iteração $i = 2$, tem $n - 2$ escolhas, e assim por diante até $i = n - 1$ ($1$ escolha). Portanto, o algoritmo de Kelp pode produzir no máximo:</p>
          $$(n - 1)(n - 2)\\cdots 1 = (n - 1)! \\text{ permutações diferentes!}$$
          <p>Para todo $n \\ge 3$, temos $(n - 1)! < n! - 1$ (por exemplo, para $n = 3$, existem $3! - 1 = 5$ permutações não-identidade, mas o código só gera $(3-1)! = 2$ permutações: como na iteração $i = 1$ o elemento $A[1]$ é obrigatoriamente trocado para $A[2]$ ou $A[3]$ e nunca volta para $A[1]$, o algoritmo <strong>jamais consegue gerar uma permutação que mantenha $A[1]$ em sua posição original</strong>, como $\\langle 1, 3, 2 \\rangle$!).</p>

          <h4>2. O Erro de <code>PERMUTE-WITH-ALL(A)</code> (Exercício 5.3-3)</h4>
          <p>O laço executa $n$ iterações e, em cada uma, faz uma escolha independente dentre $n$ índices possíveis via <code>RANDOM(1, n)</code>. Logo, a árvore de execução possui exatamente $n^n$ folhas (sequências de escolhas), cada uma ocorrendo com probabilidade exata $\\frac{1}{n^n}$. Se uma permutação específica $\\pi$ é produzida por $k_\\pi$ folhas, sua probabilidade é $\\frac{k_\\pi}{n^n}$. Para que o algoritmo gerasse uma permutação aleatória uniforme, precisaríamos ter $\\frac{k_\\pi}{n^n} = \\frac{1}{n!} \\iff k_\\pi = \\frac{n^n}{n!}$ para toda permutação $\\pi$. Porém, como $k_\\pi$ deve ser um número inteiro, $n!$ teria de dividir $n^n$. Para qualquer $n \\ge 3$, existe um primo $p \\le n - 1$ (ou fator coprimo a $n$, como $n - 1$) que divide $n!$, mas que não divide $n$ (nem $n^n$). Logo, $n! \\nmid n^n$ para todo $n \\ge 3$ (para $n = 3$, $n^n = 27$ não é divisível por $3! = 6$: três permutações ocorrem $5$ vezes com probabilidade $5/27$ e três ocorrem $4$ vezes com probabilidade $4/27$).</p>

          <h4>3. Corretude de <code>RANDOM-SAMPLE(m, n)</code> (Exercício 5.3-7)</h4>
          <p>Provamos por indução em $m$ que cada um dos $\\binom{n}{m}$ subconjuntos de tamanho $m$ de $\\{1, \\dots, n\\}$ é retornado com probabilidade $\\frac{1}{\\binom{n}{m}}$:</p>
          <ul>
            <li><strong>Caso Base ($m = 0$):</strong> Retorna $\\emptyset$ com probabilidade $1 = \\frac{1}{\\binom{n}{0}}$.</li>
            <li><strong>Passo Indutivo:</strong> Suponha que <code>RANDOM-SAMPLE(m - 1, n - 1)</code> retorna cada $(m-1)$-subconjunto de $\\{1, \\dots, n-1\\}$ com probabilidade $\\frac{1}{\\binom{n-1}{m-1}}$. Considere um $m$-subconjunto qualquer $S^* \\subseteq \\{1, \\dots, n\\}$:
              <ol>
                <li><strong>Caso 1 ($n \\in S^*$):</strong> $S^* = S' \\cup \\{n\\}$, onde $S'$ é um $(m-1)$-subconjunto específico de $\\{1, \\dots, n-1\\}$. Para produzir $S^*$, a chamada recursiva deve produzir exatamente $S'$ (probabilidade $\\frac{1}{\\binom{n-1}{m-1}}$) e depois <code>RANDOM(1, n)</code> deve sortear $i \\in S' \\cup \\{n\\}$ (que tem $(m-1) + 1 = m$ valores favoráveis dentre $n$, probabilidade $\\frac{m}{n}$). Logo:
                  $$\\Pr\\{S = S^*\\} = \\frac{1}{\\binom{n-1}{m-1}} \\cdot \\frac{m}{n} = \\frac{(m-1)!(n-m)!}{(n-1)!} \\cdot \\frac{m}{n} = \\frac{m!(n-m)!}{n!} = \\frac{1}{\\binom{n}{m}}.$$
                </li>
                <li><strong>Caso 2 ($n \\notin S^*$):</strong> Todos os $m$ elementos de $S^*$ pertencem a $\\{1, \\dots, n-1\\}$. Para produzir $S^*$, a chamada recursiva deve produzir $S^* - \\{x\\}$ para algum dos $m$ elementos $x \\in S^*$ e, em seguida, <code>RANDOM(1, n)</code> deve sortear exatamente $i = x$ (probabilidade $1/n$). Como há $m$ escolhas disjuntas para qual elemento $x \\in S^*$ foi adicionado por último:
                  $$\\Pr\\{S = S^*\\} = \\sum_{x \\in S^*} \\frac{1}{\\binom{n-1}{m-1}} \\cdot \\frac{1}{n} = m \\cdot \\frac{1}{\\binom{n-1}{m-1}} \\cdot \\frac{1}{n} = \\frac{1}{\\binom{n}{m}}. \\quad \\blacksquare$$
                </li>
              </ol>
            </li>
          </ul>
        `
      },
      {
        id: "ex4-4",
        code: "EXERCÍCIO 04 • VARIAÇÕES DE ANIVERSÁRIO E BOLAS EM CAIXAS",
        reference: "Exercícios 5.4-1, 5.4-2 e 5.4-6 (pp. 128–129)",
        title: "Mesmo Aniversário que Você, Lançamentos até a 1ª Colisão e Caixas Vazias após n Bolas",
        prompt: `
          <p>Resolva três problemas clássicos da Seção 5.4:</p>
          <ol>
            <li><strong>(Exercício 5.4-1)</strong> Quantas outras pessoas ($k$) devem estar em uma sala para que a probabilidade de <em>alguém ter a mesma data de aniversário que você</em> seja de no mínimo $1/2$? E quantas pessoas ($k$) devem estar presentes para que a probabilidade de <em>no mínimo duas pessoas fazerem aniversário especificamente no dia 4 de julho</em> seja maior que $1/2$? (Considere $n = 365$.)</li>
            <li><strong>(Exercício 5.4-2)</strong> Lançamos bolas independentemente e uniformemente em $b$ caixas até que <strong>alguma caixa contenha duas bolas</strong> (primeira colisão). Qual é o número esperado de lançamentos em função de $b$?</li>
            <li><strong>(Exercício 5.4-6)</strong> Quando $n$ bolas são lançadas independentemente em $n$ caixas, qual é o número esperado de <strong>caixas vazias</strong> e qual é o número esperado de <strong>caixas com exatamente $1$ bola</strong>? Quais são seus limites assintóticos para $n$ grande?</li>
          </ol>
        `,
        placeholder:
          "Compare (364/365)^k ≤ 1/2 no Ex. 5.4-1, use a soma de probabilidades de sobrevivência E[X] = ∑ Pr{X ≥ k} no Ex. 5.4-2 e variáveis indicadoras por caixa no Ex. 5.4-6...",
        solution: `
          <h4>1. Resolução do Exercício 5.4-1 (Data Fixa vs. Qualquer Dia)</h4>
          <ul>
            <li><strong>Parte (a) — Alguém ter o mesmo aniversário que você:</strong> A probabilidade de uma pessoa ter aniversário diferente do seu é $\\frac{n-1}{n} = \\frac{364}{365}$. Para $k$ outras pessoas independentes, a probabilidade de <em>nenhuma</em> delas compartilhar seu aniversário é $\\left(\\frac{364}{365}\\right)^k$. Queremos:
              $$1 - \\left(\\frac{364}{365}\\right)^k \\ge \\frac{1}{2} \\iff \\left(\\frac{364}{365}\\right)^k \\le \\frac{1}{2} \\iff k \\ge \\frac{\\ln(1/2)}{\\ln(364/365)} \\approx 252,65 \\implies \\mathbf{k = 253 \\text{ pessoas}}.$$
              (Repare na diferença colossal: para coincidir em <em>qualquer</em> dia bastam $23$ pessoas; para coincidir com a <em>sua</em> data fixa, são necessárias $253$ outras pessoas!)</li>
            <li><strong>Parte (b) — No mínimo 2 pessoas fazerem aniversário em 4 de julho:</strong> O evento complementar é "0 ou 1 pessoa faz aniversário em 4 de julho". Pela distribuição binomial com $p = 1/365$ e $q = 364/365$:
              $$\\Pr\\{\\le 1 \\text{ em 4 de julho}\\} = \\left(\\frac{364}{365}\\right)^k + k\\left(\\frac{1}{365}\\right)\\left(\\frac{364}{365}\\right)^{k-1} = \\left(\\frac{364}{365}\\right)^{k-1}\\left(\\frac{364 + k}{365}\\right) < \\frac{1}{2}.$$
              Resolvendo numericamente para $n = 365$, para $k = 612$ a probabilidade complementar é $\\approx 0,5005$, e para <strong>$k = 613$ pessoas</strong> ela cai para $\\approx 0,4991 < 1/2$ (logo a probabilidade de ao menos duas pessoas fazerem aniversário em 4 de julho supera $50\%$).</li>
          </ul>

          <h4>2. Resolução do Exercício 5.4-2 (Lançamentos até a 1ª Caixa ter 2 Bolas)</h4>
          <p>Seja $X \\in \\{2, 3, \\dots, b + 1\\}$ o número de lançamentos até ocorrer a primeira colisão. Pela identidade da soma de caudas (Equação C.25), $E[X] = \\sum_{k=1}^{b+1} \\Pr\\{X \\ge k\\}$. O evento $X \\ge k$ ocorre se, e somente se, as primeiras $k - 1$ bolas caírem em caixas todas distintas:
          $$\\Pr\\{X \\ge k\\} = 1 \\cdot \\left(1 - \\frac{1}{b}\\right)\\left(1 - \\frac{2}{b}\\right)\\cdots\\left(1 - \\frac{k-2}{b}\\right) = \\frac{b!}{b^{k-1}(b - k + 1)!}.$$
          Como para $1 \\le j \\le \\sqrt{b}$ temos $\\Pr\\{X \\ge k\\} \\approx e^{-(k-1)(k-2)/(2b)}$, a soma aproxima a integral gaussiana $\\int_{0}^{\\infty} e^{-x^2/(2b)}\\,dx = \\sqrt{\\frac{\\pi b}{2}} \\approx 1,2533\\sqrt{b}$. Portanto, o número esperado de lançamentos até a primeira colisão é <strong>$\\Theta(\\sqrt{b})$</strong>.</p>

          <h4>3. Resolução do Exercício 5.4-6 ($n$ Bolas em $n$ Caixas)</h4>
          <ul>
            <li><strong>Número esperado de caixas vazias:</strong> Para cada caixa $i \\in \\{1, \\dots, n\\}$, defina $X_i = I\\{\\text{a caixa } i \\text{ permanece vazia após } n \\text{ bolas}\\}$. Uma caixa específica fica vazia se todas as $n$ bolas evitarem a caixa $i$, o que ocorre com probabilidade $\\left(1 - \\frac{1}{n}\\right)^n$. Pela linearidade da esperança:
              $$E[\\text{caixas vazias}] = \\sum_{i=1}^{n} E[X_i] = \\mathbf{n\\left(1 - \\frac{1}{n}\\right)^n} \\approx \\frac{n}{e} \\approx 0,3679\\,n.$$
            </li>
            <li><strong>Número esperado de caixas com exatamente $1$ bola:</strong> Defina $Y_i = I\\{\\text{a caixa } i \\text{ recebe exatamente } 1 \\text{ bola}\\}$. Pela distribuição binomial $b(1; n, 1/n)$, temos $E[Y_i] = \\binom{n}{1}\\left(\\frac{1}{n}\\right)^1\\left(1 - \\frac{1}{n}\\right)^{n-1} = \\left(1 - \\frac{1}{n}\\right)^{n-1}$. Somando para as $n$ caixas:
              $$E[\\text{caixas com } 1 \\text{ bola}] = \\sum_{i=1}^{n} E[Y_i] = \\mathbf{n\\left(1 - \\frac{1}{n}\\right)^{n-1}} \\approx \\frac{n}{e} \\approx 0,3679\\,n.$$
            </li>
          </ul>
        `
      },
      {
        id: "ex4-5",
        code: "EXERCÍCIO 05 • PROBLEMA 5-1: CONTAGEM PROBABILÍSTICA DE MORRIS",
        reference: "Problema 5-1 (p. 129)",
        title: "Contador Probabilístico de Morris: Valor Esperado Imparcial e Estimativa da Variância",
        prompt: `
          <p>Com um registrador de $b$ bits, normalmente só podemos contar até $2^b - 1$. Com a <strong>contagem probabilística de R. Morris (Problema 5-1)</strong>, interpretamos um contador armazenando o índice $i \\in \\{0, 1, \\dots, 2^b - 1\\}$ como representando uma contagem $n_i$, onde $0 = n_0 < n_1 < n_2 < \\dots$ é uma sequência estritamente crescente. Quando o contador contém o valor $i$, a operação <code>INCREMENT</code> incrementa $i$ para $i + 1$ com probabilidade $\\frac{1}{n_{i+1} - n_i}$ e deixa o contador inalterado ($i$) com probabilidade $1 - \\frac{1}{n_{i+1} - n_i}$.</p>
          <ol>
            <li><strong>(a)</strong> Mostre por indução (usando a esperança condicional) que o valor esperado representado pelo contador após $n$ operações <code>INCREMENT</code> é <strong>exatamente $n$</strong>, para qualquer escolha da sequência crescente $n_i$!</li>
            <li><strong>(b)</strong> Considere o caso $n_i = 100i$ para todo $i \\ge 0$. Determine a variância exata no valor representado pelo registrador após $n$ operações <code>INCREMENT</code>.</li>
          </ol>
        `,
        placeholder:
          "No item (a), denote por X_n o valor representado após n operações INCREMENT e mostre que E[X_n | contador está em i após n-1 operações] = n_i + 1. No item (b), observe que n_i = 100i reduz a uma distribuição binomial...",
        solution: `
          <h4>(a) Prova de que $E[X_n] = n$ após $n$ operações <code>INCREMENT</code></h4>
          <p>Seja $X_n$ a variável aleatória que denota a contagem representada pelo contador após $n$ chamadas a <code>INCREMENT</code>. Provamos por indução em $n$ que $E[X_n] = n$:</p>
          <ul>
            <li><strong>Caso Base ($n = 0$):</strong> Inicialmente o contador contém $i = 0$, que representa $n_0 = 0$. Logo, $E[X_0] = 0$.</li>
            <li><strong>Passo Indutivo:</strong> Suponha como hipótese de indução que $E[X_{n-1}] = n - 1$. Condicionemos no estado do contador após $n - 1$ operações: suponha que $X_{n-1} = n_i$ (isto é, o registrador contém o índice $i$). Na $n$-ésima operação <code>INCREMENT</code>:
              <ul>
                <li>Com probabilidade $p_i = \\frac{1}{n_{i+1} - n_i}$, o contador passa para $i + 1$ (representando $n_{i+1}$);</li>
                <li>Com probabilidade $1 - p_i = 1 - \\frac{1}{n_{i+1} - n_i}$, o contador permanece em $i$ (representando $n_i$).</li>
              </ul>
              Portanto, a esperança condicional de $X_n$ dado que $X_{n-1} = n_i$ é:
              $$\\begin{aligned} E[X_n \\mid X_{n-1} = n_i] &= n_{i+1} \\cdot \\left(\\frac{1}{n_{i+1} - n_i}\\right) + n_i \\cdot \\left(1 - \\frac{1}{n_{i+1} - n_i}\\right) \\ &= n_i + (n_{i+1} - n_i) \\cdot \\left(\\frac{1}{n_{i+1} - n_i}\\right) = n_i + 1 = X_{n-1} + 1! \\end{aligned}$$
              Tomando a esperança sobre todos os valores possíveis de $X_{n-1}$ (lei da esperança total / linearidade):
              $$E[X_n] = E[X_{n-1} + 1] = E[X_{n-1}] + 1 = (n - 1) + 1 = \\mathbf{n}. \\quad \\blacksquare$$
            </li>
          </ul>

          <h4>(b) Variância para a Sequência Linear $n_i = 100i$</h4>
          <p>Quando $n_i = 100i$, a diferença entre níveis consecutivos é constante para todo $i \\ge 0$:</p>
          $$n_{i+1} - n_i = 100(i + 1) - 100i = 100.$$
          <p>Consequentemente, em <em>cada</em> uma das $n$ operações <code>INCREMENT</code>, a probabilidade de o índice $I$ do registrador aumentar de $1$ é sempre constante e igual a $p = \\frac{1}{100} = 0,01$ (com $q = 1 - p = \\frac{99}{100} = 0,99$), independentemente do estado atual do registrador! Assim, o índice $I_n$ armazenado no registrador após $n$ operações segue exatamente uma <strong>distribuição binomial</strong> $b(k; n, 1/100)$ com variância (Equação C.40):</p>
          $$\\text{Var}[I_n] = npq = n \\cdot \\frac{1}{100} \\cdot \\frac{99}{100} = \\frac{99n}{10.000}.$$
          <p>Como o valor representado pelo registrador é $X_n = n_{I_n} = 100\\,I_n$, aplicamos a propriedade $\\text{Var}[aY] = a^2\\text{Var}[Y]$ (Equação C.28) com $a = 100$:</p>
          $$\\text{Var}[X_n] = \\text{Var}[100\\,I_n] = 100^2 \\cdot \\text{Var}[I_n] = 10.000 \\cdot \\frac{99n}{10.000} = \\mathbf{99n}.$$
        `
      },
      {
        id: "ex4-6",
        code: "EXERCÍCIO 06 • PROBLEMA 5-2: TRÊS ALGORITMOS DE BUSCA EM ARRANJO NÃO ORDENADO",
        reference: "Problema 5-2 (pp. 129–130)",
        title: "Análise Completa de RANDOM-SEARCH, DETERMINISTIC-SEARCH e SCRAMBLE-SEARCH",
        prompt: `
          <p>O <strong>Problema 5-2</strong> compara três algoritmos para procurar um valor $x$ em um arranjo não ordenado $A[1 \\dots n]$ supondo que existam $k \\ge 0$ índices $i$ tais que $A[i] = x$:</p>
          <ol>
            <li><strong><code>RANDOM-SEARCH</code> (itens a–d):</strong> Sorteia repetidamente um índice aleatório $i \\in \\{1, \\dots, n\\}$ (com reposição, mantendo um conjunto/vetor booleano dos índices já inspecionados para parar quando todos os $n$ elementos tiverem sido vistos). Calcule o número esperado de índices escolhidos para: (b) $k = 1$; (c) $k \\ge 1$; (d) $k = 0$.</li>
            <li><strong><code>DETERMINISTIC-SEARCH</code> (itens e–g):</strong> Varre $A[1], A[2], \\dots, A[n]$ em ordem, assumindo que todas as permutações de $A$ são equiprováveis. Calcule o número médio (e de pior caso) de inspeções para: (e) $k = 1$; (f) $k \\ge 1$; (g) $k = 0$.</li>
            <li><strong><code>SCRAMBLE-SEARCH</code> (itens h–i):</strong> Primeiro aplica <code>RANDOMIZE-IN-PLACE(A)</code> e depois executa <code>DETERMINISTIC-SEARCH</code>. Qual dos três algoritmos você escolheria na prática e por quê?</li>
          </ol>
        `,
        placeholder:
          "Use a distribuição geométrica e o colecionador de cupons para RANDOM-SEARCH, variáveis indicadoras sobre os n - k elementos diferentes de x para DETERMINISTIC-SEARCH e compare com SCRAMBLE-SEARCH...",
        solution: `
          <h4>1. Análise de <code>RANDOM-SEARCH</code> (Itens a–d)</h4>
          <ul>
            <li><strong>(a) Pseudocódigo:</strong> Mantemos um arranjo booleano $V[1 \\dots n]$ inicializado com $0$ e um contador $\\text{vistos} = 0$. Em um laço <code>while vistos < n</code>, sorteamos $i = \\text{RANDOM}(1, n)$; se $A[i] == x$, retornamos $i$; se $V[i] == 0$, fazemos $V[i] = 1$ e incrementamos $\\text{vistos}$. Se o laço terminar, retornamos <code>NIL</code>.</li>
            <li><strong>(b) Caso $k = 1$:</strong> Cada sorteio é uma tentativa de Bernoulli com probabilidade de encontrar $x$ igual a $p = 1/n$. Pela distribuição geométrica (Equação C.32), o número esperado de índices sorteados é <strong>$1 / (1/n) = n$</strong>.</li>
            <li><strong>(c) Caso geral $k \\ge 1$:</strong> Em cada sorteio, a probabilidade de encontrar um dos $k$ índices contendo $x$ é $p = k/n$. Pela distribuição geométrica, o número esperado de sorteios até encontrar $x$ é <strong>$\\frac{n}{k}$</strong>.</li>
            <li><strong>(d) Caso $k = 0$ ($x \\notin A$):</strong> O algoritmo só termina após sortear <em>todos os $n$ índices distintos</em> ao menos uma vez! Pelo Problema do Colecionador de Cupons (Seção 5.4.2), o número esperado de sorteios é exatamente <strong>$n H_n = n \\ln n + O(n)$</strong> (e o pior caso é ilimitado, $\\infty$, embora com probabilidade zero).</li>
          </ul>

          <h4>2. Análise de <code>DETERMINISTIC-SEARCH</code> e <code>SCRAMBLE-SEARCH</code> (Itens e–i)</h4>
          <ul>
            <li><strong>(e) Caso $k = 1$:</strong> No pior caso, $x$ está em $A[n]$ ($n$ verificações). No caso médio, $x$ tem probabilidade $1/n$ de estar em cada posição, resultando em <strong>$\\frac{n + 1}{2}$</strong> verificações.</li>
            <li><strong>(f) Caso geral $k \\ge 1$ (Demonstração Elegante via Variáveis Indicadoras):</strong> Sejam $z_1, z_2, \\dots, z_{n-k}$ os $n - k$ elementos de $A$ que são <em>diferentes</em> de $x$. Para cada um deles, defina $X_j = I\\{z_j \\text{ aparece antes de todas as } k \\text{ cópias de } x\\}$. Considerando o conjunto de tamanho $k + 1$ formado por $\\{z_j\\}$ e pelas $k$ cópias de $x$, como todas as permutações são equiprováveis, $z_j$ tem probabilidade exata $\\frac{1}{k + 1}$ de ser o primeiro desses $k + 1$ elementos! Logo, $E[X_j] = \\frac{1}{k + 1}$. Somando os $n - k$ elementos inspecionados antes do primeiro $x$, mais $1$ inspeção para o próprio primeiro $x$ encontrado:
              $$E[\\text{verificações}] = 1 + \\sum_{j=1}^{n-k} \\frac{1}{k + 1} = 1 + \\frac{n - k}{k + 1} = \\mathbf{\\frac{n + 1}{k + 1}}.$$
              (No pior caso, todas as $k$ cópias de $x$ estão nas últimas $k$ posições, exigindo <strong>$n - k + 1$</strong> verificações.)</li>
            <li><strong>(g) Caso $k = 0$:</strong> Tanto no caso médio quanto no pior caso, varre exatamente todas as <strong>$n$</strong> posições.</li>
            <li><strong>(h–i) Comparação e Escolha Final:</strong> <code>SCRAMBLE-SEARCH</code> gasta $\\Theta(n)$ já na etapa obrigatória de embaralhar o arranjo inteiro via <code>RANDOMIZE-IN-PLACE(A)</code>, antes mesmo de começar a busca! Portanto, <strong><code>DETERMINISTIC-SEARCH</code> é superior aos outros dois</strong>: não gasta tempo embaralhando ($O(n)$ desperdiçado pelo <code>SCRAMBLE-SEARCH</code>), nunca repete inspeções no mesmo índice (ao contrário de <code>RANDOM-SEARCH</code>, que leva $n \\ln n$ quando $k=0$ e $n/k > (n+1)/(k+1)$ quando $k \\ge 1$), e garante término em no máximo $n$ passos no pior caso absoluto!</li>
          </ul>
        `
      },
      {
        id: "ex4-7",
        code: "EXERCÍCIO 07 • DESIGUALDADE DE MARKOV E VARIÂNCIA DE INDICADORAS",
        reference: "Exercícios C.3-6, C.3-8, C.3-9 e C.4-2 (pp. 964–965, 969)",
        title: "Demonstração da Desigualdade de Markov, Variância de Indicadoras e Moedas Justas",
        prompt: `
          <p>Resolva quatro exercícios essenciais das Seções C.3 e C.4:</p>
          <ol>
            <li><strong>(Exercício C.3-6 — Desigualdade de Markov)</strong> Seja $X$ uma variável aleatória não negativa ($X \\ge 0$) com $E[X]$ bem definida. Prove rigorosamente que, para todo $t > 0$:
              $$\\Pr\\{X \\ge t\\} \\le \\frac{E[X]}{t}.$$</li>
            <li><strong>(Exercícios C.3-8 e C.3-9)</strong> Qual é maior: $E[X^2]$ ou $E^2[X]$? Além disso, mostre que para qualquer variável aleatória $X$ que assuma apenas os valores $0$ e $1$ (variável indicadora), vale $\\text{Var}[X] = E[X]\\,E[1 - X]$.</li>
            <li><strong>(Exercício C.4-2)</strong> Quantas vezes, em média, devemos lançar simultaneamente $6$ moedas não viciadas antes de obtermos exatamente $3$ caras e $3$ coroas?</li>
          </ol>
        `,
        placeholder:
          "Escreva a prova da Desigualdade de Markov separando o somatório de E[X] em x < t e x ≥ t (ou usando a variável indicadora t · I{X ≥ t} ≤ X)...",
        solution: `
          <h4>1. Demonstração da Desigualdade de Markov (Exercício C.3-6)</h4>
          <p><strong>Prova 1 (Pela definição de valor esperado):</strong> Como $X$ assume apenas valores não negativos ($x \\ge 0$), podemos separar o somatório de $E[X]$ em $0 \\le x < t$ e $x \\ge t$:</p>
          $$\\begin{aligned} E[X] &= \\sum_{x \\ge 0} x \\Pr\\{X = x\\} = \\sum_{0 \\le x < t} x \\Pr\\{X = x\\} + \\sum_{x \\ge t} x \\Pr\\{X = x\\} \\ &\\ge \\sum_{x \\ge t} x \\Pr\\{X = x\\} \\quad (\\text{pois } x \\Pr\\{X = x\\} \\ge 0 \\text{ para } 0 \\le x < t) \\ &\\ge \\sum_{x \\ge t} t \\Pr\\{X = x\\} = t \\sum_{x \\ge t} \\Pr\\{X = x\\} = t \\Pr\\{X \\ge t\\}. \\end{aligned}$$
          <p>Dividindo ambos os lados por $t > 0$, obtemos $\\Pr\\{X \\ge t\\} \\le \\frac{E[X]}{t}$. $\\blacksquare$</p>
          <p><em>Prova 2 (Via Variável Indicadora):</em> Defina $I = I\\{X \\ge t\\}$. Como $X \\ge 0$, vale sempre a desigualdade pontual $t \\cdot I \\le X$ (pois se $X < t$, $t \\cdot I = 0 \\le X$; e se $X \\ge t$, $t \\cdot I = t \\le X$). Tomando a esperança em ambos os lados (Exercício C.3-7): $t E[I] = t \\Pr\\{X \\ge t\\} \\le E[X] \\implies \\Pr\\{X \\ge t\\} \\le E[X]/t$.</p>

          <h4>2. Resolução dos Exercícios C.3-8 e C.3-9</h4>
          <ul>
            <li><strong>(C.3-8):</strong> Pela Equação (C.27), $\\text{Var}[X] = E[(X - E[X])^2] = E[X^2] - E^2[X]$. Como o quadrado de qualquer número real é não negativo, $\\text{Var}[X] \\ge 0$, o que implica imediatamente que <strong>$E[X^2] \\ge E^2[X]$</strong> (a esperança do quadrado é sempre maior ou igual ao quadrado da esperança, com igualdade se e somente se $\\text{Var}[X] = 0$, isto é, $X$ é constante com probabilidade $1$).</li>
            <li><strong>(C.3-9):</strong> Se $X \\in \\{0, 1\\}$, então $X^2 = X$ sempre (pois $0^2 = 0$ e $1^2 = 1$). Logo, $E[X^2] = E[X]$. Substituindo na fórmula da variância:
              $$\\text{Var}[X] = E[X^2] - E^2[X] = E[X] - E^2[X] = E[X](1 - E[X]) = \\mathbf{E[X]\\,E[1 - X]}.$$
            </li>
          </ul>

          <h4>3. Resolução do Exercício C.4-2 (Seis Moedas Justas)</h4>
          <p>Em cada lançamento de $6$ moedas não viciadas, o número de caras segue a distribuição binomial $b(k; 6, 1/2)$. A probabilidade de obter exatamente $k = 3$ caras (e consequentemente $3$ coroas) em uma rodada é:</p>
          $$p = b(3; 6, 1/2) = \\binom{6}{3}\\left(\\frac{1}{2}\\right)^3\\left(\\frac{1}{2}\\right)^3 = \\frac{20}{64} = \\frac{5}{16}.$$
          <p>O número de rodadas até o primeiro sucesso segue uma distribuição geométrica com parâmetro $p = 5/16$. Pela Equação (C.32), o número esperado de lançamentos é:</p>
          $$E[X] = \\frac{1}{p} = \\frac{1}{5/16} = \\mathbf{\\frac{16}{5} = 3,2 \\text{ lançamentos}}.$$
        `
      },
      {
        id: "ex4-8",
        code: "EXERCÍCIO 08 • CAUDAS DA DISTRIBUIÇÃO BINOMIAL E CHERNOFF (SEÇÃO C.5)",
        reference: "Exercícios C.5-1, C.5-5 e C.5-7 (pp. 974–975)",
        title: "Comparação de Caudas Binomiais, Escolha Ótima α = ln(r/μ) e Limite Exponencial exp(-r² / 2μ)",
        prompt: `
          <p>Resolva três problemas analíticos sobre as caudas da distribuição binomial (Seção C.5):</p>
          <ol>
            <li><strong>(Exercício C.5-1)</strong> O que é menos provável: não obter nenhuma cara quando lançamos uma moeda justa $n$ vezes, ou obter estritamente menos de $n$ caras quando lançamos uma moeda justa $4n$ vezes?</li>
            <li><strong>(Exercício C.5-7)</strong> Na prova do Teorema C.8, obtemos o limite $\\Pr\\{X - \\mu \\ge r\\} \\le \\exp(\\mu e^\\alpha - \\alpha r)$ válido para todo $\\alpha > 0$. Demonstre por cálculo diferencial que a escolha $\\alpha = \\ln(r / \\mu)$ minimiza o lado direito dessa desigualdade quando $r > \\mu$.</li>
            <li><strong>(Exercício C.5-5 / C.5-6)</strong> Explique por que os limites de cauda da Seção C.5 garantem que a probabilidade de um desvio aditivo $r$ acima da média $\\mu = E[X]$ decai exponencialmente como $\\exp(-r^2 / (2\\mu))$ na faixa moderada ou como $(\\mu e / r)^r$ para grandes desvios ($r > \\mu e$).</li>
          </ol>
        `,
        placeholder:
          "No Ex. C.5-1, compare (1/2)ⁿ com o limite do Corolário C.5 para b(k; 4n, 1/2) com k = n. No Ex. C.5-7, derive g(α) = μ e^α - α r em relação a α...",
        solution: `
          <h4>1. Resolução do Exercício C.5-1 ($0$ caras em $n$ lançamentos vs. $< n$ caras em $4n$ lançamentos)</h4>
          <ul>
            <li><strong>Evento A (nenhuma cara em $n$ lançamentos):</strong> $\\Pr\\{A\\} = \\left(\\frac{1}{2}\\right)^n = 2^{-n} = 0,5^n$.</li>
            <li><strong>Evento B (menos de $n$ caras em $N = 4n$ lançamentos):</strong> Aqui temos uma distribuição binomial com $N = 4n$ tentativas e $p = q = 1/2$, cuja média é $\\mu = Np = 2n$. Queremos limitar $\\Pr\\{X < k\\}$ para $k = n = \\mu / 2$. Aplicando o <strong>Corolário C.5</strong> (p. 971) e o Lema C.1 (ou a entropia binária Equação C.7 com $\\lambda = k/N = n/(4n) = 1/4$):
              $$\\Pr\\{X < n\\} < b(n; 4n, 1/2) = \\binom{4n}{n} 2^{-4n} \\le \\left(\\frac{4^4}{1^1 \\cdot 3^3}\\right)^n 2^{-4n} = \\left(\\frac{256}{27 \\cdot 16}\\right)^n = \\left(\\frac{16}{27}\\right)^n \\approx 0,5926^n.$$
              Por outro lado, para $n$ pequeno ou usando o limite inferior de Stirling $\\binom{4n}{n} 2^{-4n} = \\Theta\\left(\\frac{1}{\\sqrt{n}}\\left(\\frac{16}{27}\\right)^n\\right)$, como $\\frac{16}{27} \\approx 0,5926 > \\frac{1}{2} = 0,5$, para $n$ suficientemente grande temos $\\left(\\frac{1}{2}\\right)^n < \\Pr\\{X < n\\}$. Portanto, <strong>não obter nenhuma cara em $n$ lançamentos ($0,5^n$) é assintoticamente menos provável</strong> do que obter menos de $n$ caras em $4n$ lançamentos ($\\approx 0,5926^n / \\sqrt{n}$)!</li>
          </ul>

          <h4>2. Resolução do Exercício C.5-7 (Minimização em $\\alpha = \\ln(r/\\mu)$)</h4>
          <p>Como a função exponencial $\\exp(z)$ é estritamente crescente em $z$, minimizar $\\exp(\\mu e^\\alpha - \\alpha r)$ em relação a $\\alpha > 0$ equivale a minimizar o expoente $g(\\alpha) = \\mu e^\\alpha - \\alpha r$. Calculando a primeira e a segunda derivadas de $g(\\alpha)$:</p>
          $$g'(\\alpha) = \\mu e^\\alpha - r = 0 \\iff e^\\alpha = \\frac{r}{\\mu} \\iff \\mathbf{\\alpha = \\ln\\left(\\frac{r}{\\mu}\\right)}.$$
          <p>Como $r > \\mu > 0$, temos $\\frac{r}{\\mu} > 1$ e portanto $\\alpha = \\ln(r/\\mu) > 0$ pertence ao domínio válido. Além disso, $g''(\\alpha) = \\mu e^\\alpha > 0$ para todo $\\alpha \\in \\mathbb{R}$ ($g$ é estritamente convexa), confirmando que $\\alpha = \\ln(r/\\mu)$ é o único ponto de mínimo global! Substituindo $\\alpha = \\ln(r/\\mu)$ em $\\exp(\\mu e^\\alpha - \\alpha r)$:</p>
          $$\\exp\\left(\\mu \\cdot \\frac{r}{\\mu} - r \\ln\\left(\\frac{r}{\\mu}\\right)\\right) = \\frac{e^r}{(r/\\mu)^r} = \\mathbf{\\left(\\frac{\\mu e}{r}\\right)^r}.$$

          <h4>3. Resolução dos Exercícios C.5-5 e C.5-6 (Decaimento Gaussiano e Superexponencial)</h4>
          <p>Pelo Teorema C.8, se $r > \\mu e$, então a base $\\frac{\\mu e}{r} < 1$; em particular, se $r \\ge \\mu e^2$, temos $\\frac{\\mu e}{r} \\le e^{-1}$ e portanto $\\Pr\\{X - \\mu \\ge r\\} \\le e^{-r}$. Além disso, refinando o limite de $E[e^{\\alpha(X_i - p_i)}] \\le e^{\\alpha^2 p_i / 2}$ (Exercício C.5-6) e escolhendo $\\alpha = r / \\mu$, obtemos a forma clássica de Hoeffding/Chernoff:</p>
          $$\\Pr\\{X - \\mu \\ge r\\} \\le \\exp\\left(\\frac{\\alpha^2 \\mu}{2} - \\alpha r\\right) = \\mathbf{\\exp\\left(-\\frac{r^2}{2\\mu}\\right)}.$$
        `
      }
    ]
  };

  window.registerCodexModule(4, module4Content);
})();
