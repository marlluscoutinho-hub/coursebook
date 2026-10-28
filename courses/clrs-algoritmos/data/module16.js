/* ==========================================================================
   CODEX — MÓDULO 16: INTRATABILIDADE COMPUTACIONAL: PROBLEMAS NP-COMPLETOS E ALGORITMOS DE APROXIMAÇÃO
   Capítulos 34 e 35 (pp. 846–928)
   Obra: Algoritmos: Teoria e Prática (3ª Edição) — Cormen, Leiserson, Rivest e Stein
   ========================================================================== */

(function () {

const revisao = {
    subtitle:
      "A Fronteira da Intratabilidade: Teoria da NP-Completude, Reduções Polinomiais de Cook-Karp e Garantias Provadas em Algoritmos de Aproximação (PTAS e FPTAS)",
    intro:
      "Com o Módulo 16 alcançamos o ápice da teoria da complexidade computacional e do projeto algorítmico moderno, cobrindo integralmente a Parte VIII (Capítulos 34 e 35, pp. 846–928) da obra seminal de Cormen, Leiserson, Rivest e Stein. Ao longo dos quinze módulos anteriores, exploramos dezenas de problemas algorítmicos clássicos — ordenação, busca, grafos, geometria, matrizes e programação linear — todos com soluções executáveis em tempo polinomial O(n^k) para constantes k modestas. O Capítulo 34 introduz a barreira fundamental da computabilidade eficiente: a classe de problemas NP-completos, cuja resolução exata em tempo polinomial permanece o mais célebre problema em aberto da ciência da computação (a questão P versus NP proposta por Cook e Levin em 1971). Investigamos a formalização de problemas de decisão através de linguagens formais, codificações binárias concisas, algoritmos de verificação baseados em certificados polinomiais, e o mecanismo matemático de reduções polinomiais (L₁ ≤_P L₂), demonstrando desde o Teorema de Cook-Levin (CIRCUIT-SAT) até a árvore canônica de NP-completude: SAT, 3-CNF-SAT, CLIQUE, VERTEX-COVER, HAM-CYCLE, TSP e SUBSET-SUM. Em seguida, o Capítulo 35 enfrenta a intratabilidade sob a perspectiva pragmática do engenheiro e do cientista: quando um problema de otimização é NP-difícil e instâncias de grande porte exigem respostas rápidas, abrimos mão da otimalidade estrita em favor de Algoritmos de Aproximação com garantias de desempenho provadas matematicamente. Estudamos algoritmos 2-aproximados baseados em emparelhamento maximal (APPROX-VERTEX-COVER) e em árvores geradoras mínimas com desigualdade triangular (APPROX-TSP-TOUR), provamos o Teorema 35.3 de inaproximabilidade absoluta do TSP geral caso P ≠ NP, analisamos a razão logarítmica harmônica de GREEDY-SET-COVER, a técnica de aleatorização em MAX-3-CNF atingindo 7/8 de satisfatibilidade esperada, e os esquemas PTAS e FPTAS, culminando no elegante algoritmo APPROX-SUBSET-SUM com poda geométrica de listas (TRIM) que atinge garantia (1 + ε) em tempo totalmente polinomial.",
    pillars: [
      {
        tag: "[ PILAR 01 • TEMPO POLINOMIAL, CODIFICAÇÕES E A CLASSE P ]",
        title: "Problemas Abstratos, Equivalência Polinomial de Codificações e Decisão vs. Otimização (Cap. 34.1)",
        body: `
          <p>O alicerce da teoria da complexidade repousa na formalização matemática do que constitui um problema tratável e eficiente (pp. 848–854):</p>
          <ul>
            <li><strong>Problemas Abstratos vs. Concretos:</strong> Um <em>problema abstrato</em> $Q$ é uma relação binária entre um conjunto $I$ de instâncias e um conjunto $S$ de soluções. No âmbito da NP-completude, restringimo-nos a <strong>problemas de decisão</strong>, modelados como funções booleanas $Q: I \\to \\{0, 1\\}$. Qualquer problema de otimização (como encontrar o caminho mínimo ou o ciclo de menor custo) pode ser reformulado como um problema de decisão parametrizado por um limite $k$ (por exemplo, "existe um caminho com custo $\\le k$?") sem perda de generalidade, pois uma busca binária sobre $k$ reconstrói a solução ótima com apenas $O(\\lg(\\text{custo max}))$ chamadas ao oráculo de decisão.</li>
            <li><strong>Codificações e o Lema 34.1:</strong> Um programa de computador opera sobre cadeias binárias $\\{0, 1\\}^*$. Uma codificação $e: I \\to \\{0, 1\\}^*$ mapeia instâncias abstratas para palavras concretas. Duas codificações $e_1$ e $e_2$ são <em>polinomialmente relacionadas</em> se existem transformações computáveis em tempo polinomial entre elas. Pelo <strong>Lema 34.1</strong>, se $e_1$ e $e_2$ são polinomialmente relacionadas, a pertinência à classe $\\text{P}$ independe da codificação adotada. Rejeitamos expressamente codificações degeneradas como a <em>unária</em> (onde o número $k$ ocupa $k$ bits, transformando falsamente algoritmos exponenciais $O(k) = O(2^n)$ em pseudopolinomiais $O(n)$) e assumimos codificações concisas padrão $\\langle \\cdot \\rangle$ em base binária ($n = \\lfloor \\lg k \\rfloor + 1$).</li>
            <li><strong>A Classe $\\text{P}$ e o Teorema 34.2:</strong> No arcabouço de linguagens formais ($L \\subseteq \\{0, 1\\}^*$), $\\text{P}$ é o conjunto de linguagens decidíveis por algoritmos no tempo $O(n^k)$. Pelo <strong>Teorema 34.2</strong>, a classe de linguagens <em>aceitas</em> em tempo polinomial coincide exatamente com a classe de linguagens <em>decididas</em> em tempo polinomial (pois podemos simular $A$ por no máximo $c n^k$ passos e rejeitar se não houver aceitação). A classe $\\text{P}$ é estritamente fechada sob união, interseção, concatenação, complemento e estrela de Kleene.</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 02 • CERTIFICADOS, A CLASSE NP E A FRONTEIRA co-NP ]",
        title: "Verificação Eficiente com Certificados Polinomiais e a Estrutura de NP (Cap. 34.2)",
        body: `
          <p>A assimetria entre <em>resolver</em> do zero e <em>verificar</em> uma solução apresentada é capturada pela classe $\\text{NP}$ (pp. 855–862):</p>
          <ul>
            <li><strong>Algoritmos de Verificação de Duas Entradas:</strong> Um algoritmo $A(x, y)$ verifica uma cadeia de entrada $x$ através de um <strong>certificado</strong> $y$. A linguagem verificada é $L = \\{x \\in \\{0, 1\\}^* : \\exists y \\in \\{0, 1\\}^* \\text{ tal que } A(x, y) = 1\\}$. A classe $\\text{NP}$ (<em>Nondeterministic Polynomial-time</em>) é o conjunto de linguagens verificáveis em tempo polinomial: existe $A$ e constante $c$ tal que $x \\in L \\iff \\exists y \\text{ com } |y| \\le c|x|^c \\text{ e } A(x, y) = 1$.</li>
            <li><strong>Exemplo Paradigmático (HAM-CYCLE):</strong> Determinar se um grafo não dirigido $G$ possui um ciclo que visita todos os vértices exatamente uma vez requer explorar $m! = \\Theta(\\sqrt{n}!)$ permutações. No entanto, dado um ciclo proposto como certificado $y = \\langle v_1, v_2, \\dots, v_m \\rangle$, um algoritmo de verificação confere em tempo $O(V + E) = O(n)$ se todos os vértices são visitados e se as arestas consecutivas existem em $G$. Logo, $\\text{HAM-CYCLE} \\in \\text{NP}$. Como qualquer algoritmo de decisão para $L \\in \\text{P}$ pode ignorar o certificado e decidir $x$, temos trivialmente $\\text{P} \\subseteq \\text{NP}$.</li>
            <li><strong>A Classe $\\text{co-NP}$ e Cenários Abertos:</b> Definimos $\\text{co-NP} = \\{L : \\bar{L} \\in \\text{NP}\\}$, a classe de linguagens cujos <em>não-exemplos</em> possuem certificados curtos de rejeição (ex.: $\\text{TAUTOLOGY} \\in \\text{co-NP}$, pois uma atribuição que falseia a fórmula prova que ela não é tautologia). A comunidade científica conjectura fortemente que $\\text{P} \\neq \\text{NP}$ e que $\\text{NP} \\neq \\text{co-NP}$, posicionando $\\text{P} \\subseteq (\\text{NP} \\cap \\text{co-NP})$ como o núcleo de problemas simultaneamente verificáveis para respostas afirmativas e negativas.</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 03 • REDUTIBILIDADE POLINOMIAL L₁ ≤_P L₂ E NP-COMPLETUDE ]",
        title: "Reduções de Karp, Teorema de Cook-Levin e a Árvore Genealógica de Problemas NP-Completos (Caps. 34.3–34.5)",
        body: `
          <p>A redutibilidade em tempo polinomial estabelece a ordem parcial de dificuldade relativa entre problemas computacionais (pp. 862–898):</p>
          <ul>
            <li><strong>Redução de Karp ($L_1 \\le_P L_2$):</strong> Uma linguagem $L_1$ é redutível em tempo polinomial a $L_2$ se existe uma função $f: \\{0, 1\\}^* \\to \\{0, 1\\}^*$ computável em tempo polinomial tal que $x \\in L_1 \\iff f(x) \\in L_2$. Pelo <strong>Lema 34.3</strong>, se $L_1 \\le_P L_2$ e $L_2 \\in \\text{P}$, então $L_1 \\in \\text{P}$. Uma linguagem é <strong>NP-difícil</strong> se toda linguagem em $\\text{NP}$ se reduz a ela; e é <strong>NP-completa</strong> ($\\text{NPC}$) se pertence a $\\text{NP}$ e é NP-difícil.</li>
            <li><strong>O Teorema de Cook-Levin (Teorema 34.4 / 34.7):</strong> Demonstra que $\\text{CIRCUIT-SAT}$ é NP-completo sem depender de nenhuma redução prévia. A prova simula a execução do programa verificador polinomial $A(x, y)$ mapeando suas configurações de memória sequenciais $c_0 \\to c_1 \\to \\dots \\to c_{T(n)}$ através de uma cascata de $T(n)$ réplicas de um circuito combinacional $M$ que modela a CPU. Fixando os bits do programa e da entrada $x$, as únicas entradas livres do circuito correspondem aos bits do certificado $y$, garantindo que o circuito é satisfazível se e somente se $x \\in L$.</li>
            <li><strong>A Cadeia Canônica de Reduções:</strong> A partir de $\\text{CIRCUIT-SAT}$, o CLRS constrói a linhagem completa: $\\text{CIRCUIT-SAT} \\le_P \\text{SAT} \\le_P \\text{3-CNF-SAT} \\le_P \\text{CLIQUE} \\le_P \\text{VERTEX-COVER} \\le_P \\text{HAM-CYCLE} \\le_P \\text{TSP}$; e em paralelo, $\\text{3-CNF-SAT} \\le_P \\text{SUBSET-SUM}$. Provar que um novo problema $L \\in \\text{NP}$ é NP-completo requer apenas exibir uma redução $L' \\le_P L$ partindo de algum $L'$ já consagrado como NP-completo (Lema 34.4).</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 04 • ALGORITMOS DE APROXIMAÇÃO: RAZÕES, INAPROXIMABILIDADE E FPTAS ]",
        title: "Garantias de Desempenho ρ(n), Limites Condicionais e Esquemas Totalmente Polinomiais (Cap. 35)",
        body: `
          <p>Quando a NP-dificuldade impede a busca por soluções exatas em tempo polinomial, projetamos algoritmos aproximados com garantias analíticas rígidas (pp. 899–928):</p>
          <ul>
            <li><strong>Razão de Aproximação $\\rho(n)$:</strong> Um algoritmo tem razão de aproximação $\\rho(n)$ se, para qualquer instância de tamanho $n$ com custo $C$ e ótimo $C^*$, temos $\\max(C/C^*, C^*/C) \\le \\rho(n)$. Em <code>APPROX-VERTEX-COVER</code>, extraímos um emparelhamento maximal de arestas $A$ em tempo $O(V + E)$ e devolvemos os vértices de suas extremidades: como $|C| = 2|A|$ e qualquer cobertura ótima exige $|C^*| \\ge |A|$, o algoritmo garante $\\rho = 2$ (Teorema 35.1), enquanto heurísticas gulosas de maior grau degradam para $\\Theta(\\lg |V|)$.</li>
            <li><strong>TSP Métrico vs. Inaproximabilidade Geral:</strong> Sob a <em>desigualdade triangular</em> ($c(u, w) \\le c(u, v) + c(v, w)$), <code>APPROX-TSP-TOUR</code> constrói uma Árvore Geradora Mínima $T$, executa um percurso em pré-ordem e aplica atalhos, atingindo razão $\\rho = 2$ (Teorema 35.2). Em contrapartida, pelo <strong>Teorema 35.3</strong>, se $\\text{P} \\neq \\text{NP}$, o TSP geral <strong>não admite algoritmo $\\rho$-aproximado para nenhuma constante $\\rho \\ge 1$</strong> (pois uma redução atribuindo peso $\\rho|V| + 1$ a arestas inexistentes decidiria $\\text{HAM-CYCLE}$ em tempo polinomial).</li>
            <li><strong>Esquemas de Aproximação (PTAS e FPTAS):</strong> Para além de razões fixas, buscamos esquemas parametrizados por $\\epsilon > 0$ que garantam razão $(1 + \\epsilon)$. Um PTAS roda em tempo polinomial em $n$ para cada $\\epsilon$ fixo (ex.: $O(n^{2/\\epsilon})$); já um <strong>FPTAS</strong> (<em>Fully Polynomial-Time Approximation Scheme</em>) roda em tempo polinomial simultaneamente em $n$ e em $1/\\epsilon$ ($O((1/\\epsilon)^c n^d)$). O algoritmo <code>APPROX-SUBSET-SUM</code> desbasta as listas de somas parciais descartando valores redundantes via <code>TRIM</code> com fator $\\delta = \\epsilon / (2n)$, provando que o erro acumulado em $n$ iterações não ultrapassa $(1 + \\delta)^n \\le 1 + \\epsilon$ e mantendo o tamanho da lista limitado por $O((n \\ln t) / \\epsilon)$, com complexidade total $O((n^2 \\ln t) / \\epsilon)$ (Teorema 35.8).</li>
          </ul>
        `
      }
    ],
    checklist: [
      "Compreendo a formalização de problemas de decisão abstratos e concretos em {0, 1}*, o conceito de codificações concisas polinomialmente relacionadas (Lema 34.1), a representação de problemas como linguagens formais, e a equivalência entre aceitação e decisão em tempo polinomial para a classe P (Teorema 34.2).",
      "Sei definir formalmente a classe NP por meio de algoritmos de verificação com certificados de tamanho polinomial A(x, y), exemplificar com HAM-CYCLE, enunciar a classe co-NP, explicar os 4 diagramas de inclusão possíveis e analisar o significado teórico da conjectura P ≠ NP.",
      "Domino a definição formal de redutibilidade polinomial L₁ ≤_P L₂ (Lema 34.3), as definições de linguagens NP-difíceis e NP-completas (NPC), e a demonstração completa do Teorema de Cook-Levin (Teorema 34.4/34.7) que estabelece a NP-completude de CIRCUIT-SAT via composição do circuito de configurações M da CPU.",
      "Sei reconstruir e justificar rigorosamente cada elo da cadeia genealógica de reduções NP-completas do CLRS: CIRCUIT-SAT ≤_P SAT, SAT ≤_P 3-CNF-SAT, 3-CNF-SAT ≤_P CLIQUE, CLIQUE ≤_P VERTEX-COVER (usando o grafo complemento Ḡ), VERTEX-COVER ≤_P HAM-CYCLE (usando widgets de 12 vértices e vértices seletores), HAM-CYCLE ≤_P TSP e 3-CNF-SAT ≤_P SUBSET-SUM (tabela decimal sem transportes).",
      "Sei projetar, provar e implementar algoritmos de aproximação: a 2-aproximação de APPROX-VERTEX-COVER via emparelhamento maximal (|C| = 2|A| ≤ 2C*), a 2-aproximação de APPROX-TSP-TOUR com MST e atalhos triangulares, o Teorema 35.3 de inaproximabilidade do TSP geral com peso ρ|V| + 1, a razão harmônica H(max |S|) ≤ ln |X| + 1 de GREEDY-SET-COVER, a satisfação esperada 7/8 de MAX-3-CNF aleatorizado, e o FPTAS APPROX-SUBSET-SUM com poda geométrica TRIM(L, δ) garantindo razão 1 + ε em tempo O((n² ln t) / ε)."
    ]
  };

  const unidades = [
{
      id: "u16-1",
      code: "34.1 e 34.2",
      title: "Tempo Polinomial, Codificações, Problemas de Decisão, a Classe P e Verificação em Tempo Polinomial (a Classe NP)",
      reading: "pp. 846–862",
      content: `
        <h3>1. A Linha Divisória da Eficiência Computacional e Problemas de Decisão</h3>
        <p>Quase todos os algoritmos investigados nos Capítulos 1 a 33 executam no pior caso em tempo $O(n^k)$ para alguma constante inteira pequena $k$ (em geral $k \\le 3$). Na taxonomia da complexidade computacional, denominamos os problemas com algoritmos de tempo polinomial de <strong>tratáveis</strong> ou fáceis, contrastando-os com problemas <strong>intratáveis</strong> ou difíceis, que exigem tempo superpolinomial (como $2^{\\Omega(n)}$ ou $n!$), ou que são formalmente indecidíveis (como o Problema da Parada de Alan Turing).</p>

        <p>Cormen et al. oferecem três argumentos filosóficos e matemáticos que sustentam a escolha do tempo polinomial como a fronteira canônica de eficiência (pp. 848–849):</p>
        <ol>
          <li><strong>Realismo Empírico:</strong> Embora teoricamente uma função como $\\Theta(n^{100})$ seja polinomial, na prática da ciência da computação quase nenhum algoritmo útil exibe polinômios de grau arbitrariamente elevado. Algoritmos polinomiais práticos gravitam em torno de $O(n)$, $O(n \\lg n)$, $O(n^2)$ ou $O(n^3)$. Quando um problema admite uma solução polinomial inicial de grau elevado, melhorias subsequentes invariavelmente reduzem o expoente.</li>
          <li><strong>Invariância frente a Modelos de Computação:</strong> Pela <em>Tese de Church-Turing Estendida</em>, todos os modelos computacionais razoavelmente realistas — incluindo a Máquina de Acesso Aleatório (RAM) serial adotada no livro, Máquinas de Turing determinísticas de fita única ou múltiplas fitas, e computadores paralelos com número polinomial de processadores — são <em>polinomialmente equivalentes</em>. Um algoritmo executável em tempo polinomial em uma arquitetura pode ser simulado em qualquer outra em tempo polinomial.</li>
          <li><strong>Propriedades Algébricas de Fechamento:</strong> Polinômios são fechados sob adição, multiplicação e composição. Se um algoritmo de tempo polinomial invoca como sub-rotina outro algoritmo de tempo polinomial um número polinomial de vezes (e o tamanho dos dados intermediários cresce polinomialmente), a composição permanece estritamente em tempo polinomial (Exercício 34.1-5).</li>
        </ol>

        <h4>Problemas Abstratos vs. Problemas Concretos</h4>
        <p>Formalmente, um <strong>problema abstrato</strong> $Q$ é definido como uma relação binária entre um conjunto $I$ de instâncias e um conjunto $S$ de soluções. Por exemplo, no problema de caminhos mínimos $\\text{SHORTEST-PATH}$, uma instância é uma tripla $\\langle G, u, v \\rangle$ e uma solução é uma sequência de vértices em $G$ conectando $u$ a $v$ com custo total mínimo.</p>
        <p>A teoria da NP-completude foca predominantemente em <strong>problemas de decisão</strong>, nos quais a resposta para cada instância é estritamente booleana: $\\text{SIM}$ (1) ou $\\text{NÃO}$ (0). O problema abstrato de decisão associado ao caminho mínimo é:</p>
        $$\\text{PATH} = \\{\\langle G, u, v, k \\rangle : G = (V, E) \\text{ é um grafo, } u, v \\in V, \\, k \\ge 0 \\text{ e existe caminho de } u \\text{ a } v \\text{ com no máximo } k \\text{ arestas}\\}.$$

        <div class="canonical-callout">
          <span class="callout-tag">[ EQUIVALÊNCIA POLINOMIAL ENTRE OTIMIZAÇÃO E DECISÃO ]</span>
          <p>Seja $Q_{\\text{opt}}$ um problema de otimização de minimização (por exemplo, encontrar o comprimento do caminho mínimo $d^*(u, v)$) e seja $Q_{\\text{dec}}$ sua contrapartida de decisão ("existe caminho com custo $\\le k$?").</p>
          <ul>
            <li>Se sabemos resolver o problema de otimização em tempo polinomial, basta calcular $d^*(u, v)$ e testar se $d^*(u, v) \\le k$, decidindo $Q_{\\text{dec}}$ imediatamente.</li>
            <li>Reciprocamente, se dispomos de um oráculo polinomial para $Q_{\\text{dec}}$, podemos determinar o valor ótimo $k^* = d^*(u, v)$ executando uma <strong>busca binária</strong> sobre o intervalo de custos possíveis $[0, \\, W_{\\max} \\cdot |V|]$. Como o intervalo tem comprimento limitado pelo número de bits da entrada, o número de consultas de decisão é no máximo $O(\\lg(W_{\\max} |V|))$, o que é estritamente polinomial no tamanho da entrada codificada em binário! Logo, o problema de otimização é polinomial se e somente se o de decisão é polinomial.</li>
          </ul>
        </div>

        <h3>2. Codificações Binárias, Codificação Padrão e o Lema 34.1</h3>
        <p>Computadores reais não processam grafos ou polígonos abstratos; processam cadeias de bits $\\{0, 1\\}^*$. Uma <strong>codificação</strong> de um conjunto abstrato de instâncias $I$ é um mapeamento injetivo $e: I \\to \\{0, 1\\}^*$. Um <strong>problema concreto</strong> é aquele cujo domínio de instâncias é $\\{0, 1\\}^*$. Dada uma codificação $e$, o problema abstrato $Q: I \\to \\{0, 1\\}$ induz o problema concreto $e(Q): \\{0, 1\\}^* \\to \\{0, 1\\}$, convencionando-se que qualquer cadeia binária que não represente uma instância válida mapeia para 0.</p>

        <p>Um algoritmo resolve um problema concreto no tempo $O(T(n))$ se, para qualquer instância binária $x$ de comprimento $n = |x|$, produz a resposta em no máximo $O(T(n))$ etapas. Dizemos que o problema é resolvível em tempo polinomial se $T(n) = O(n^k)$ para alguma constante $k$.</p>

        <div class="canonical-callout">
          <span class="callout-tag">[ O PERIGO DAS CODIFICAÇÕES DEGENERADAS (UNÁRIA VS. BINÁRIA) ]</span>
          <p>Considere um algoritmo cujo tempo de execução é proporcional ao valor numérico da entrada inteira $k$, isto é, $T(k) = \\Theta(k)$ (como o algoritmo clássico de programação dinâmica para a Mochila 0-1, que roda em $\\Theta(n W)$):</p>
          <ul>
            <li><strong>Codificação Unária:</strong> O número $k$ é representado como uma sequência de $k$ uns: $1^k = 111\\dots 1$. O comprimento da entrada é $n = |1^k| = k$. Nesse caso, o algoritmo executa em $T(n) = \\Theta(n)$, parecendo falsamente ser de tempo polinomial!</li>
            <li><strong>Codificação Binária Padrão:</strong> O número $k$ é codificado na base 2, exigindo comprimento $n = \\lfloor \\lg k \\rfloor + 1$. Assim, $k = \\Theta(2^n)$. O tempo de execução do algoritmo em relação ao tamanho da entrada $n$ é $T(n) = \\Theta(2^n)$, que é <strong>puramente exponencial</strong>!</li>
          </ul>
          <p>Por isso, a teoria da NP-completude impõe que números inteiros sejam representados em base binária (ou qualquer base $b \\ge 2$). Algoritmos cuja complexidade é polinomial apenas sob a representação unária são classificados como <strong>pseudopolinomiais</strong>.</p>
        </div>

        <p>Duas codificações $e_1$ e $e_2$ são <strong>polinomialmente relacionadas</strong> se existem funções calculáveis em tempo polinomial $f_{12}$ e $f_{21}$ tais que, para toda instância $i \\in I$, temos $f_{12}(e_1(i)) = e_2(i)$ e $f_{21}(e_2(i)) = e_1(i)$.</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ LEMA 34.1 • (INDEPENDÊNCIA DA CODIFICAÇÃO, P. 852): ]</span>
          Seja $Q$ um problema de decisão abstrato sobre um conjunto de instâncias $I$, e sejam $e_1$ e $e_2$ codificações polinomialmente relacionadas em $\\{0, 1\\}^*$. Então, $e_1(Q) \\in \\text{P}$ se e somente se $e_2(Q) \\in \\text{P}$.
          <br><br>
          <em>Demonstração:</em> Suponha que $e_2(Q)$ seja decidido por um algoritmo $A_2$ no tempo $O(n^k)$. Para decidir $e_1(Q)$ sobre uma entrada $x = e_1(i)$ de comprimento $n = |x|$, executamos o algoritmo de transformação polinomial $f_{12}$, que produz $e_2(i)$ em tempo $O(n^c)$ para alguma constante $c$. O comprimento da cadeia resultante é $|e_2(i)| \\le O(n^c)$. Em seguida, alimentamos $e_2(i)$ no algoritmo $A_2$, cujo tempo de execução é $O(|e_2(i)|^k) = O((n^c)^k) = O(n^{ck})$. Como $c$ e $k$ são constantes, o tempo total $O(n^c + n^{ck}) = O(n^{ck})$ é polinomial. A direção recíproca é análoga usando $f_{21}$. $\\blacksquare$
        </div>

        <p>Graças ao Lema 34.1, podemos adotar uma <strong>codificação padrão</strong> concisa — denotada por colchetes angulares $\\langle G \\rangle$, $\\langle G, u, v, k \\rangle$, $\\langle \\phi \\rangle$ —, sabendo que matrizes de adjacência e listas de adjacência são polinomialmente relacionadas ($O(V^2)$ vs. $O(V + E)$), e focar diretamente nas propriedades intrínsecas dos problemas abstratos.</p>

        <h3>3. Arcabouço de Linguagens Formais, a Classe P e o Teorema 34.2</h3>
        <p>No arcabouço da teoria da computação, seja $\\Sigma = \\{0, 1\\}$ o alfabeto binário. Uma <strong>linguagem</strong> $L \\subseteq \\Sigma^*$ é qualquer conjunto de cadeias sobre $\\Sigma$. O problema de decisão $Q$ é identificado biunivocamente com a linguagem de suas instâncias afirmativas:</p>
        $$L = \\{x \\in \\{0, 1\\}^* : Q(x) = 1\\}.$$
        <ul>
          <li><strong>Aceitação:</strong> Um algoritmo $A$ <em>aceita</em> $x \\in \\Sigma^*$ se $A(x) = 1$. A linguagem aceita por $A$ é $L = \\{x \\in \\Sigma^* : A(x) = 1\\}$. Se $x \\notin L$, o algoritmo pode retornar 0 ou entrar em loop infinito.</li>
          <li><strong>Decisão:</strong> Um algoritmo $A$ <em>decide</em> uma linguagem $L$ se para toda cadeia $x \\in L$ ele para e retorna $A(x) = 1$, e para toda cadeia $x \\notin L$ ele para em tempo finito e retorna $A(x) = 0$.</li>
          <li><strong>A Classe $\\text{P}$ (Definição Formal):</strong> $\\text{P} = \\{L \\subseteq \\{0, 1\\}^* : \\exists \\text{ algoritmo } A \\text{ e constante } k \\text{ t.q. } A \\text{ decide } L \\text{ no tempo } O(n^k)\\}$.</li>
        </ul>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 34.2 • (EQUIVALÊNCIA DE ACEITAÇÃO E DECISÃO EM TEMPO POLINOMIAL, P. 854): ]</span>
          $$\\text{P} = \\{L : L \\text{ é aceita por um algoritmo de tempo polinomial}\\}.$$
          <br>
          <em>Demonstração:</em> Claramente, se $L$ é decidida em tempo polinomial, ela é aceita em tempo polinomial (o próprio decisor serve como aceitador). Para a recíproca, suponha que $L$ seja aceita por um algoritmo $A$ no tempo $O(n^k)$. Então existem constantes $c, k > 0$ tais que, para toda $x \\in L$, $A$ aceita $x$ em no máximo $c n^k$ passos de computação. Construímos um novo algoritmo $A'$ que decide $L$: dada qualquer entrada $x \\in \\{0, 1\\}^*$ de tamanho $n$, $A'$ simula o passo a passo de $A$ sobre $x$ mantendo um contador até $c n^k$ passos. Se $A$ parar e produzir 1 dentro desse limite, $A'$ para e produz 1. Se o contador atingir $c n^k$ passos e $A$ não tiver aceito (tendo produzido 0 ou continuando a executar), $A'$ interrompe forçadamente a simulação e produz 0. A sobrecarga de contagem e simulação consome apenas um fator constante a mais de tempo. Logo, $A'$ decide $L$ em tempo $O(n^k)$, provando que $L \\in \\text{P}$. $\\blacksquare$
        </div>

        <h3>4. Verificação em Tempo Polinomial, a Classe NP e a Fronteira co-NP</h3>
        <p>A classe $\\text{NP}$ modela problemas cujas soluções são fáceis de <em>verificar</em>, mesmo que sejam extremamente difíceis de <em>encontrar</em>. Considere o problema do Ciclo Hamiltoniano:</p>
        $$\\text{HAM-CYCLE} = \\{\\langle G \\rangle : G \\text{ é um grafo não dirigido que possui um ciclo hamiltoniano}\\}.$$
        <p>Para determinar se $G$ possui um ciclo hamiltoniano, um algoritmo ingênuo precisaria inspecionar todas as $m!$ permutações de seus $m = |V|$ vértices. Como $m \\approx \\sqrt{n}$ onde $n = |\\langle G \\rangle|$, temos $m! = \\Theta(\\sqrt{n}!) = \\Theta(2^{\\sqrt{n} \\lg n})$, um custo brutalmente exponencial.</p>
        <p>Entretanto, se alguém nos fornecer um <strong>certificado</strong> $y = \\langle v_1, v_2, \\dots, v_m \\rangle$, podemos verificar em tempo $O(V + E)$ se:</p>
        <ol>
          <li>A sequência contém cada vértice de $V$ exatamente uma vez;</li>
          <li>Para cada $i \\in \\{1, \\dots, m-1\\}$, a aresta $(v_i, v_{i+1}) \\in E$;</li>
          <li>A aresta de fechamento $(v_m, v_1) \\in E$.</li>
        </ol>
        <p>Se todas as condições forem válidas, temos a certeza absoluta de que $G \\in \\text{HAM-CYCLE}$. Caso o grafo não seja hamiltoniano, nenhuma lista fraudulenta de vértices conseguirá enganar o verificador.</p>

        <div class="canonical-callout">
          <span class="callout-tag">[ DEFINIÇÃO FORMAL DA CLASSE NP (P. 857) ]</span>
          <p>Um <strong>algoritmo de verificação</strong> é um procedimento de dois argumentos $A(x, y)$, onde $x$ é a cadeia de entrada ordinária e $y$ é uma cadeia binária denominada <strong>certificado</strong>. Dizemos que $A$ verifica uma linguagem $L$ se:</p>
          $$L = \\{x \\in \\{0, 1\\}^* : \\exists y \\in \\{0, 1\\}^* \\text{ tal que } A(x, y) = 1\\}.$$
          <p>A classe de complexidade $\\text{NP}$ (<em>Non-deterministic Polynomial-time</em>) é o conjunto de linguagens verificáveis por um algoritmo de tempo polinomial:</p>
          $$\\text{NP} = \\{L \\subseteq \\{0, 1\\}^* : \\exists \\text{ algoritmo polinomial } A \\text{ e constante } c \\ge 0 \\text{ t.q. } x \\in L \\iff \\exists y \\text{ com } |y| \\le c|x|^c \\text{ e } A(x, y) = 1\\}.$$
        </div>

        <p>Duas propriedades fundamentais decorrem imediatamente dessa formulação:</p>
        <ul>
          <li><strong>$\\text{P} \\subseteq \\text{NP}$ Transparente:</strong> Se $L \\in \\text{P}$, existe um algoritmo polinomial $A_0(x)$ que decide $L$. Podemos construir trivialmente um verificador de dois argumentos $A(x, y) = A_0(x)$ que simplesmente ignora o certificado $y$ e executa em tempo polinomial. Portanto, qualquer linguagem resolvível eficientemente é também verificável eficientemente.</li>
          <li><strong>Limite Superior Exponencial para NP (Exercício 34.2-5):</strong> Qualquer linguagem $L \\in \\text{NP}$ pode ser <em>decidida</em> deterministicamente no tempo $2^{O(n^c)}$ testando exaustivamente todos os $2^{|y|} \\le 2^{c n^c}$ certificados possíveis de comprimento limitado e aplicando o verificador polinomial $A(x, y)$ a cada um.</li>
        </ul>

        <h4>A Classe co-NP e os Cenários da Complexidade</h4>
        <p>Definimos a classe <strong>co-NP</strong> como a classe das linguagens cujos complementos pertencem a $\\text{NP}$:</p>
        $$\\text{co-NP} = \\{L \\subseteq \\{0, 1\\}^* : \\bar{L} = (\\Sigma^* - L) \\in \\text{NP}\\}.$$
        <p>Um problema está em $\\text{co-NP}$ se, sempre que a resposta for $\\text{NÃO}$, existe um certificado conciso de tempo polinomial comprovando que a instância não pertence à linguagem. Por exemplo, o problema $\\text{TAUTOLOGY} = \\{\\langle \\phi \\rangle : \\phi \\text{ é avaliada como } 1 \\text{ sob todas as atribuições verdade}\\}$ pertence a $\\text{co-NP}$, pois seu complemento (fórmulas que não são tautologias) admite como certificado uma única atribuição que torna $\\phi = 0$.</p>
        <p>Como $\\text{P}$ é estritamente fechada sob complemento ($L \\in \\text{P} \\iff \\bar{L} \\in \\text{P}$, bastando inverter a saída do decisor), segue que $\\text{P} \\subseteq \\text{NP} \\cap \\text{co-NP}$. O Cormen elenca as 4 possibilidades teóricas (Figura 34.3, p. 859):</p>
        <ol>
          <li>$\\text{P} = \\text{NP} = \\text{co-NP}$ (universalmente considerada a mais improvável);</li>
          <li>$\\text{NP} = \\text{co-NP}$, mas $\\text{P} \\subsetneq \\text{NP}$;</li>
          <li>$\\text{P} = \\text{NP} \\cap \\text{co-NP}$, com $\\text{NP} \\neq \\text{co-NP}$;</li>
          <li>$\\text{NP} \\neq \\text{co-NP}$ e $\\text{P} \\subsetneq (\\text{NP} \\cap \\text{co-NP})$ (o cenário considerado mais plausível pela comunidade científica).</li>
        </ol>

        <div id="workbench-mod16-mount"></div>
      `
    },
    {
      id: "u16-2",
      code: "34.3",
      title: "Redutibilidade em Tempo Polinomial (L₁ ≤_P L₂), Definição de NP-Completude e o Teorema de Cook-Levin (CIRCUIT-SAT)",
      reading: "pp. 862–875",
      content: `
        <h3>1. Reduções em Tempo Polinomial (Mapeamento de Karp: $L_1 \\le_P L_2$)</h3>
        <p>A ferramenta mestra para calibrar a dificuldade relativa entre dois problemas computacionais é a <strong>redutibilidade em tempo polinomial</strong> (ou redução de muitos-para-um de Karp, pp. 862–865). Intuitivamente, se um problema $Q_1$ pode ser transformado eficientemente em um problema $Q_2$, então $Q_1$ não pode ser intrinsecamente mais difícil de resolver que $Q_2$.</p>

        <div class="canonical-callout">
          <span class="callout-tag">[ DEFINIÇÃO FORMAL DE REDUÇÃO POLINOMIAL ($L_1 \\LE_P L_2$) ]</span>
          <p>Dizemos que uma linguagem $L_1 \\subseteq \\{0, 1\\}^*$ é <strong>redutível em tempo polinomial</strong> a uma linguagem $L_2 \\subseteq \\{0, 1\\}^*$, e escrevemos $L_1 \\le_P L_2$, se existe uma função $f: \\{0, 1\\}^* \\to \\{0, 1\\}^*$ calculável em tempo polinomial por um algoritmo de redução $F$, tal que para toda cadeia $x \\in \\{0, 1\\}^*$:</p>
          $$x \\in L_1 \\iff f(x) \\in L_2.$$
        </div>

        <p>Essa equivalência bi-implica duas propriedades cruciais:</p>
        <ul>
          <li><strong>Consistência Afirmativa:</strong> Se $x \\in L_1$, a instância transformada $f(x)$ obrigatoriamente pertence a $L_2$.</li>
          <li><strong>Consistência Negativa:</strong> Se $x \\notin L_1$, a instância transformada $f(x)$ obrigatoriamente <em>não</em> pertence a $L_2$ ($x \\notin L_1 \\iff f(x) \\notin L_2$).</li>
        </ul>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ LEMA 34.3 • (PRESERVAÇÃO DA POLINOMIALIDADE POR REDUÇÃO, P. 864): ]</span>
          Se $L_1 \\le_P L_2$ e $L_2 \\in \\text{P}$, então $L_1 \\in \\text{P}$.
          <br><br>
          <em>Demonstração:</em> Seja $A_2$ um algoritmo de tempo polinomial que decide $L_2$ no tempo $O(m^k)$, e seja $F$ o algoritmo que calcula a função redução $f(x)$ no tempo $O(n^c)$ para entradas $x$ de comprimento $n$. Para qualquer $x \\in \\{0, 1\\}^*$, o tamanho da saída gerada por $F$ é no máximo proporcional ao seu tempo de execução, logo $m = |f(x)| \\le d \\cdot n^c$ para alguma constante $d$. Para decidir se $x \\in L_1$, executamos $F(x)$ para obter $f(x)$ e em seguida executamos $A_2(f(x))$. O tempo total consumido é:
          $$T(n) = O(n^c) + O(|f(x)|^k) = O(n^c + (d n^c)^k) = O(n^{ck}).$$
          Como $c$ e $k$ são constantes fixas, $A_2(F(x))$ é um algoritmo determinístico de tempo polinomial que decide $L_1$. Portanto, $L_1 \\in \\text{P}$. $\\blacksquare$
        </div>

        <h3>2. As Classes NP-Difícil e NP-Completo (NPC)</h3>
        <p>A noção de redução permite isolar as linguagens que são as mais difíceis de toda a classe $\\text{NP}$ (p. 865):</p>
        <div class="canonical-callout">
          <span class="callout-tag">[ DEFINIÇÕES FUNDAMENTAIS ]</span>
          <ol>
            <li>Uma linguagem $L \\subseteq \\{0, 1\\}^*$ é <strong>NP-difícil</strong> (<em>NP-hard</em>) se, para toda linguagem $L' \\in \\text{NP}$, temos $L' \\le_P L$.</li>
            <li>Uma linguagem $L \\subseteq \\{0, 1\\}^*$ é <strong>NP-completa</strong> (<em>NP-complete</em>, ou $L \\in \\text{NPC}$) se:
              <br>(i) $L \\in \\text{NP}$; e
              <br>(ii) $L$ é NP-difícil.
            </li>
          </ol>
        </div>

        <p>Dessas definições emerge a consequência mais extraordinária da teoria da complexidade:</p>
        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 34.4 • (IMPACTO DA NP-COMPLETUDE SOBRE P VS. NP, P. 865): ]</span>
          Se qualquer problema NP-completo pertencer a $\\text{P}$, então $\\text{P} = \\text{NP}$. Reciprocamente, se qualquer problema em $\\text{NP}$ não puder ser resolvido em tempo polinomial, então nenhum problema NP-completo pode ser resolvido em tempo polinomial!
          <br><br>
          <em>Demonstração:</em> Suponha que $L \\in \\text{NPC}$ e $L \\in \\text{P}$. Seja $L'$ qualquer linguagem arbitrária em $\\text{NP}$. Como $L$ é NP-completa, ela é NP-difícil, o que significa por definição que $L' \\le_P L$. Pelo Lema 34.3, como $L' \\le_P L$ e $L \\in \\text{P}$, decorre imediatamente que $L' \\in \\text{P}$. Visto que $L'$ foi escolhida arbitrariamente em $\\text{NP}$, concluímos que $\\text{NP} \\subseteq \\text{P}$. Como já provamos anteriormente que $\\text{P} \\subseteq \\text{NP}$, segue necessariamente que $\\text{P} = \\text{NP}$. A contrapositiva é idêntica. $\\blacksquare$
        </div>

        <h4>A Transitividade de Reduções e a Metodologia de Prova (Lema 34.4)</h4>
        <p>Provar que $L$ é NP-completa demonstrando diretamente que <em>toda</em> linguagem $L' \\in \\text{NP}$ se reduz a $L$ seria uma tarefa hercúlea para cada novo problema. Felizmente, a relação $\\le_P$ é <strong>transitiva</strong>: se $L_1 \\le_P L_2$ via $f$ e $L_2 \\le_P L_3$ via $g$, então $L_1 \\le_P L_3$ via a composição $g(f(x))$, que é computável em tempo polinomial. Disso resulta a regra prática de ouro:</p>

        <div class="canonical-callout">
          <span class="callout-tag">[ METODOLOGIA DO LEMA 34.4 (COMO PROVAR QUE UM PROBLEMA $L$ É NP-COMPLETO) ]</span>
          <ol>
            <li><strong>Verificação (Pertinência a NP):</strong> Prove que $L \\in \\text{NP}$ exibindo um algoritmo verificador polinomial $A(x, y)$ que valide certificados concisos de tamanho polinomial em tempo $O(n^k)$.</li>
            <li><strong>Seleção da Origem:</strong> Escolha uma linguagem $L'$ <em>já conhecida e consagrada como NP-completa</em>.</li>
            <li><strong>Construção da Redução:</strong> Descreva um algoritmo determinístico de tempo polinomial $F$ que mapeie qualquer instância $x$ de $L'$ em uma instância $f(x)$ de $L$.</li>
            <li><strong>Prova de Correção (Equivalência Lógica Bidirecional):</strong> Prove formalmente que $x \\in L' \\iff f(x) \\in L$ (ou seja: se $x \\in L'$, então $f(x) \\in L$; e se $f(x) \\in L$, então $x \\in L'$).</li>
            <li><strong>Conclusão:</strong> Pela transitividade, toda linguagem em $\\text{NP}$ se reduz a $L'$ e, portanto, a $L$. Logo, $L$ é NP-completa!</li>
          </ol>
        </div>

        <h3>3. Satisfatibilidade de Circuitos (CIRCUIT-SAT) e o Teorema de Cook-Levin</h3>
        <p>Para inaugurar o método das reduções, a ciência da computação necessitava de um "primeiro motor imóvel" — o primeiro problema provado NP-completo por construção pura, sem depender de nenhuma redução prévia. Esse marco histórico foi alcançado por Stephen Cook (1971) e Leonid Levin (1973) através do <strong>Teorema de Cook-Levin</strong>.</p>
        <p>O CLRS formaliza esse teorema por meio da <strong>Satisfatibilidade de Circuitos Combinacionais Booleanos</strong> (pp. 866–875):</p>
        <ul>
          <li><strong>Circuitos Combinacionais:</strong> Um circuito combinacional booleano é um grafo acíclico dirigido $G = (V, E)$ cujos nós são portas lógicas básicas ($\\text{AND}$, $\\text{OR}$, $\\text{NOT}$) ou fios de entrada externos. As arestas representam fios que transportam sinais booleanos $\\{0, 1\\}$. Limitamos o circuito a ter exatamente uma saída externa.</li>
          <li><strong>O Problema:</strong> $\\text{CIRCUIT-SAT} = \\{\\langle C \\rangle : C \\text{ é um circuito combinacional booleano satisfazível}\\}$. Um circuito $C$ é satisfazível se existe uma atribuição de valores verdade $\\{0, 1\\}$ aos seus $k$ fios de entrada que faça a saída única do circuito avaliar como 1.</li>
        </ul>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ LEMA 34.5 • (PERTINÊNCIA): ]</span>
          $\\text{CIRCUIT-SAT} \\in \\text{NP}$.
          <br>
          <em>Prova:</em> O certificado $y$ é o vetor binário $(x_1, \\dots, x_k)$ atribuído às entradas de $C$. Como o circuito é um grafo acíclico dirigido, podemos ordenar suas portas topologicamente em tempo $O(V + E)$ e computar o valor de cada fio sequencialmente. O tempo de avaliação é estritamente proporcional ao número de portas e fios do circuito, que é o tamanho da entrada $|\\langle C \\rangle|$. Logo, o verificador executa em tempo linear $O(n)$. $\\blacksquare$
        </div>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 34.7 • (COOK-LEVIN: CIRCUIT-SAT É NP-COMPLETO, PP. 869–874): ]</span>
          <br>
          <em>Esboço da Demonstração Rigorosa do CLRS:</em>
          <p>Precisamos provar que para <em>qualquer</em> linguagem $L \\in \\text{NP}$, existe uma redução em tempo polinomial $L \\le_P \\text{CIRCUIT-SAT}$.</p>
          <ol>
            <li><strong>O Verificador de $L$:</strong> Como $L \\in \\text{NP}$, existe um algoritmo de verificação determinístico $A(x, y)$ que roda no tempo de pior caso $T(n) = O(n^k)$ sobre instâncias $x$ de comprimento $n$, com certificados $y$ de comprimento $|y| = O(n^k)$.</li>
            <li><strong>Configurações da Máquina:</strong> Em um computador real (ou arquitetura RAM), o estado global no passo $i$ da execução é uma <strong>configuração</strong> $c_i$, composta pelo código do programa de $A$, pelo contador de programa (PC), pelos registradores e pelo conteúdo da memória acessada. Como $A$ executa em no máximo $T(n)$ passos, a quantidade total de posições de memória acessadas não pode ultrapassar $T(n) = O(n^k)$. Logo, cada configuração $c_i$ pode ser inteiramente descrita por uma cadeia de bits de comprimento polinomial $S(n) = O(n^k)$.</li>
            <li><strong>O Circuito de Transição de Hardware $M$:</strong> A CPU de um computador é ela própria um gigantesco circuito combinacional booleano. Existe um circuito combinacional fixo $M$ que toma como entrada uma configuração $c_i$ e produz como saída a configuração do passo seguinte $c_{i+1} = M(c_i)$. Como o hardware opera com portas lógicas de fan-in constante, o tamanho desse circuito $M$ é proporcional ao número de bits da configuração, ou seja, $|M| = O(S(n)) = O(n^k)$.</li>
            <li><strong>Cascata de Configurações:</strong> O algoritmo de redução $F$, ao receber a cadeia $x$, constrói um supercircuito $C'$ colando em cascata $T(n)$ cópias sucessivas do circuito $M$:
              $$c_0 \\xrightarrow{\\;M_1\\;} c_1 \\xrightarrow{\\;M_2\\;} c_2 \\xrightarrow{\\;M_3\\;} \\dots \\xrightarrow{\\;M_{T(n)}\\;} c_{T(n)}.$$
              A saída de cada estágio $M_i$ é ligada diretamente como entrada do estágio subsequente $M_{i+1}$.</li>
            <li><strong>Fixação de Entradas e Isolamento do Certificado:</strong> Na configuração inicial $c_0$, quase todos os bits são valores constantes conhecidos pelo algoritmo de redução: o código do programa $A$, o PC inicial e a cadeia de entrada $x$. O algoritmo de redução $F$ "solda" esses fios do circuito nos valores constantes 0 ou 1 correspondentes. <strong>Os únicos fios de entrada que permanecem livres e não fixados são os bits do certificado $y$!</strong></li>
            <li><strong>Saída do Circuito $C$:</strong> O bit de término do algoritmo $A(x, y)$ (que indica se $A$ produziu 1) localiza-se em uma posição específica da configuração final $c_{T(n)}$. O circuito $C = f(x)$ adota esse bit como sua saída externa única.</li>
            <li><strong>Equivalência e Complexidade:</strong>
              <ul>
                <li>Se $x \\in L$, existe um certificado $y$ tal que $A(x, y) = 1$. Alimentando esses bits de $y$ nos fios de entrada livres, a cascata de circuitos replica fielmente a computação de $A$, e o bit final de saída avaliará como 1. Logo, $C$ é satisfazível.</li>
                <li>Reciprocamente, se $C$ é satisfazível, existe uma atribuição aos fios livres que gera saída 1. Como a cascata de circuitos simula a CPU com fidelidade determinística, essa atribuição aos fios livres constitui um certificado válido $y$ que faz $A(x, y) = 1$, provando que $x \\in L$.</li>
                <li>O tamanho total do circuito construído é $T(n) \\cdot |M| = O(n^k) \\cdot O(n^k) = O(n^{2k})$, que é estritamente polinomial em $n = |x|$! O algoritmo de redução $F$ gera essa descrição de circuito em tempo polinomial.</li>
              </ul>
            </li>
          </ol>
          <p>Isso conclui a prova: $\\text{CIRCUIT-SAT}$ é NP-difícil. Como $\\text{CIRCUIT-SAT} \\in \\text{NP}$, o problema é <strong>NP-completo</strong>! $\\blacksquare$</p>
        </div>
      `
    },
    {
      id: "u16-3",
      code: "34.4 e 34.5",
      title: "A Cadeia Canônica de Reduções NP-Completas do CLRS: SAT, 3-CNF-SAT, CLIQUE, VERTEX-COVER, HAM-CYCLE, TSP e SUBSET-SUM",
      reading: "pp. 875–898",
      content: `
        <h3>1. A Árvore Genealógica de Reduções do CLRS</h3>
        <p>Munidos do Teorema de Cook-Levin, Cormen et al. constroem uma magnífica árvore genealógica de reduções polinomiais (pp. 875–898), na qual cada novo problema herda a NP-completude de seu antecessor imediato via Lema 34.4:</p>
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(59, 130, 246, 0.4); border-radius: 8px; padding: 14px; margin: 16px 0; text-align: center; font-family: monospace; font-size: 0.95rem;">
          CIRCUIT-SAT (Teorema 34.7)<br>
          &nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          SAT (Teorema 34.9)<br>
          &nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          3-CNF-SAT (Teorema 34.10)<br>
          &nbsp;&nbsp;&nbsp;&nbsp;↙&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↘<br>
          CLIQUE (Teorema 34.11)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SUBSET-SUM (Teorema 34.15)<br>
          &nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          VERTEX-COVER (Teorema 34.12)<br>
          &nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          HAM-CYCLE (Teorema 34.13)<br>
          &nbsp;&nbsp;&nbsp;&nbsp;↓<br>
          TSP (Teorema 34.14)
        </div>

        <h3>2. De Circuitos a Fórmulas: CIRCUIT-SAT ≤_P SAT e SAT ≤_P 3-CNF-SAT</h3>
        <h4>Elo 1: $\\text{CIRCUIT-SAT} \\le_P \\text{SAT}$ (Teorema 34.9, p. 876)</h4>
        <p>No problema $\\text{SAT}$ (Satisfatibilidade de Fórmulas Booleanas), temos uma fórmula booleana $\\phi$ formada por variáveis, operadores $\\land$, $\\lor$, $\\neg$ e parênteses. Para reduzir uma instância de $\\text{CIRCUIT-SAT}$ (circuito $C$) a uma fórmula booleana em tempo polinomial:</p>
        <ul>
          <li>Associamos uma variável booleana $x_i$ a cada fio do circuito $C$.</li>
          <li>Para cada porta lógica $g$ de $C$, escrevemos uma subfórmula booleana que expressa a equivalência funcional entre sua saída e suas entradas. Por exemplo, se uma porta $\\text{AND}$ tem fios de entrada $x_j, x_k$ e saída $x_i$, escrevemos $x_i \\leftrightarrow (x_j \\land x_k)$, cuja tabela verdade se traduz na conjunção de cláusulas:
            $$( \\neg x_i \\lor x_j ) \\land ( \\neg x_i \\lor x_k ) \\land ( x_i \\lor \\neg x_j \\lor \\neg x_k ).$$
          </li>
          <li>Se $y$ for o fio de saída externa do circuito, a fórmula completa é $\\phi = y \\land \\bigwedge_{g} \\phi_g$.</li>
          <li>$C$ é satisfazível se e somente se $\\phi$ é satisfazível. Como cada porta gera um número constante de cláusulas, $|\\phi| = O(|C|)$, tornando a redução estritamente linear em tempo e tamanho.</li>
        </ul>

        <h4>Elo 2: $\\text{SAT} \\le_P \\text{3-CNF-SAT}$ (Teorema 34.10, pp. 879–883)</h4>
        <p>Uma fórmula está na <strong>Forma Normal 3-Conjuntiva (3-CNF)</strong> se for uma conjunção ($\\land$) de cláusulas, onde cada cláusula é uma disjunção ($\\lor$) de <em>exatamente três literais distintos</em> (uma variável ou sua negação). A redução ocorre em três etapas:</p>
        <ol>
          <li><strong>Árvore de Análise Sintática:</strong> Dada uma fórmula arbitrária $\\phi$, construímos sua árvore sintática binária e introduzimos uma nova variável booleana $y_i$ para cada operador interno. Escrevemos a equivalência de cada nó (ex.: $y_i \\leftrightarrow (y_j \\land y_k)$) e exigimos que a raiz seja verdadeira ($y_{\\text{raiz}}$).</li>
          <li><strong>Conversão para CNF via Tabela Verdade:</strong> Cada subfórmula $y_i \\leftrightarrow (y_j \\circ y_k)$ envolve no máximo 3 variáveis. Sua tabela verdade possui $2^3 = 8$ linhas. Para cada linha que avalia como 0, criamos uma cláusula $\\lor$ proibindo aquela combinação, gerando uma conjunção equivalente de cláusulas com no máximo 3 literais.</li>
          <li><strong>Padronização para Exatamente 3 Literais por Cláusula:</strong> Para cláusulas que resultarem com menos de 3 literais, introduzimos variáveis auxiliares $p, q$:
            <ul>
              <li>Uma cláusula de 1 literal $(l_1)$ torna-se $(l_1 \\lor p \\lor q) \\land (l_1 \\lor p \\lor \\neg q) \\land (l_1 \\lor \\neg p \\lor q) \\land (l_1 \\lor \\neg p \\lor \\neg q)$;</li>
              <li>Uma cláusula de 2 literais $(l_1 \\lor l_2)$ torna-se $(l_1 \\lor l_2 \\lor p) \\land (l_1 \\lor l_2 \\lor \\neg p)$;</li>
              <li>Uma cláusula com $m > 3$ literais $(l_1 \\lor l_2 \\lor \\dots \\lor l_m)$ é decomposta em cadeia com variáveis auxiliares $p_1, \\dots, p_{m-3}$:
                $$(l_1 \\lor l_2 \\lor p_1) \\land (\\neg p_1 \\lor l_3 \\lor p_2) \\land \\dots \\land (\\neg p_{m-3} \\lor l_{m-1} \\lor l_m).$$
              </li>
            </ul>
          </li>
        </ol>

        <h3>3. Reduções em Grafos: CLIQUE, VERTEX-COVER, HAM-CYCLE e TSP</h3>
        <h4>Elo 3: $\text{3-CNF-SAT} \le_P \text{CLIQUE}$ (Teorema 34.11, pp. 886–888)</h4>
        <p>Um <strong>clique</strong> em um grafo não dirigido $G = (V, E)$ é um subconjunto de vértices $V' \subseteq V$ tal que todo par de vértices em $V'$ é conectado por uma aresta de $E$ (um subgrafo completo). A linguagem é $\text{CLIQUE} = \{\langle G, k \rangle : G \text{ contém um clique de tamanho } k\}$.</p>
        <div class="canonical-callout theorem">
          <span class="callout-tag">[ REDUÇÃO CLÁSSICA • TEOREMA 34.11 (3-CNF-SAT &le;<sub>P</sub> CLIQUE, PP. 886–888) ]</span>
          <strong>Construção do Grafo $G$:</strong> Para cada cláusula $C_r = (l_1^r \lor l_2^r \lor l_3^r)$ em $\phi$, criamos uma tríade de 3 vértices $v_1^r, v_2^r, v_3^r$ em $G$. Colocamos uma aresta entre dois vértices $v_i^r$ e $v_j^s$ se e somente se:
          <ul>
            <li>(1) Eles pertencem a cláusulas <em>distintas</em> ($r \neq s$); e</li>
            <li>(2) Seus literais correspondentes são <em>consistentes</em> (ou seja, $l_i^r$ não é a negação de $l_j^s$, $l_i^r \neq \neg l_j^s$).</li>
            <li>Definimos o tamanho alvo do clique como $k$ (o número de cláusulas de $\phi$).</li>
          </ul>
          <em>Prova de Equivalência:</em> Se $\phi$ é satisfeita, cada cláusula possui pelo menos um literal verdadeiro. Escolhendo exatamente um literal verdadeiro por cláusula, obtemos $k$ vértices em cláusulas distintas que jamais são mutuamente contraditórios. Pela regra de construção, todos esses $k$ vértices são mutuamente adjacentes em $G$, formando um clique de tamanho $k$. Reciprocamente, se $G$ possui um clique $V'$ de tamanho $k$, como não há arestas dentro da mesma tríade de cláusula, o clique deve conter exatamente um vértice de cada uma das $k$ cláusulas. Atribuindo valor 1 a esses $k$ literais consistentes, todas as $k$ cláusulas são simultaneamente satisfeitas. $\blacksquare$
        </div>

        <h4>Elo 4: $\text{CLIQUE} \le_P \text{VERTEX-COVER}$ (Teorema 34.12, pp. 888–890)</h4>
        <p>Uma <strong>cobertura de vértices</strong> em um grafo não dirigido $G = (V, E)$ é um subconjunto $V' \subseteq V$ tal que, para toda aresta $(u, v) \in E$, pelo menos um de seus extremos pertence a $V'$ ($u \in V'$ ou $v \in V'$). O problema de decisão é $\text{VERTEX-COVER} = \{\langle G, k \rangle : G \text{ tem cobertura de vértices de tamanho } k\}$.</p>
        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 34.12 • EQUIVALÊNCIA NO GRAFO COMPLEMENTO (PP. 888–890) ]</span>
          <strong>Teorema 34.12:</strong> Um grafo $G = (V, E)$ possui um clique de tamanho $k$ se e somente se seu grafo complemento $\bar{G} = (V, \bar{E})$ possui uma cobertura de vértices de tamanho $|V| - k$.
          <br><br>
          <em>Demonstração:</em>
          <ul>
            <li>$(\implies)$ Suponha que $V'$ seja um clique de tamanho $k$ em $G$. Seja $(u, v)$ qualquer aresta de $\bar{E}$. Por definição de complemento, $(u, v) \notin E$. Como todo par de vértices dentro do clique $V'$ possui aresta em $E$, é impossível que ambos $u$ e $v$ pertençam a $V'$. Logo, pelo menos um de $u$ ou $v$ não pertence a $V'$, o que equivale a dizer que $u \in (V - V')$ ou $v \in (V - V')$. Assim, a aresta $(u, v)$ de $\bar{E}$ é coberta por $V - V'$. Como isso vale para toda aresta de $\bar{E}$, $V - V'$ é uma cobertura de vértices em $\bar{G}$ de tamanho $|V| - k$.</li>
            <li>$(\impliedby)$ Reciprocamente, se $V - V'$ é uma cobertura de vértices em $\bar{G}$, então para qualquer par $u, v \in V'$, a aresta $(u, v)$ não pode pertencer a $\bar{E}$ (caso contrário, a cobertura conteria $u$ ou $v$, contradizendo que ambos estão em $V'$). Como $(u, v) \notin \bar{E}$, temos necessariamente $(u, v) \in E$. Logo, todo par de vértices em $V'$ tem aresta em $G$, provando que $V'$ é um clique de tamanho $|V| - (|V| - k) = k$. $\blacksquare$</li>
          </ul>
        </div>

        <h4>Elo 5: $\\text{VERTEX-COVER} \\le_P \\text{HAM-CYCLE}$ (Teorema 34.13, pp. 890–896)</h4>
        <p>A redução que transforma uma cobertura de vértices de tamanho $k$ em um grafo $G$ em um ciclo hamiltoniano em $G'$ constitui um dos mais brilhantes usos de <em>gadgets</em> (ou componentes de circuito em grafos) da computação:</p>
        <ul>
          <li><strong>O Widget de Aresta $W_{uv}$:</strong> Para cada aresta $(u, v) \\in E$, criamos um widget $W_{uv}$ contendo 12 vértices divididos em duas colunas de 6 vértices: $[u, v, 1 \\dots 6]$ e $[v, u, 1 \\dots 6]$, interligados por 14 arestas internas estruturadas de tal forma que um ciclo que entre em $W_{uv}$ só pode percorrer o widget de três formas válidas:
            <ol>
              <li>Entrar em $[u, v, 1]$ e sair em $[u, v, 6]$ visitando <em>todos os 12 vértices</em> (quando $u$ está na cobertura e $v$ não está);</li>
              <li>Entrar em $[v, u, 1]$ e sair em $[v, u, 6]$ visitando <em>todos os 12 vértices</em> (quando $v$ está na cobertura e $u$ não está);</li>
              <li>Visitar em uma passagem os 6 vértices de $u$ ($[u, v, 1 \\dots 6]$) e, em outra passagem posterior, visitar os 6 vértices de $v$ ($[v, u, 1 \\dots 6]$) (quando <em>ambos</em> $u$ e $v$ pertencem à cobertura).</li>
            </ol>
          </li>
          <li><strong>Vértices Seletores:</strong> Criamos $k$ vértices especiais $s_1, s_2, \\dots, s_k$ que funcionarão como "seletores" dos $k$ vértices da cobertura.</li>
          <li><strong>Encadeamento de Caminhos:</strong> Para cada vértice $u \\in V$, ordenamos arbitrariamente suas arestas incidentes $u^{(1)}, \\dots, u^{(\\text{grau}(u))}$ e unimos os widgets correspondentes em série, ligando $[u, u^{(i)}, 6]$ a $[u, u^{(i+1)}, 1]$.</li>
          <li><strong>Fechamento do Ciclo:</strong> Ligamos todos os $k$ seletores $s_r$ ao início $[u, u^{(1)}, 1]$ e ao fim $[u, u^{(\\text{grau}(u))}, 6]$ da cadeia de cada vértice $u \\in V$.</li>
          <li>$G$ tem cobertura de tamanho $k$ $\\iff$ os $k$ seletores conectam exatamente as $k$ cadeias correspondentes aos vértices da cobertura, visitando todos os widgets de arestas e fechando um ciclo hamiltoniano em $G'$!</li>
        </ul>

        <h4>Elo 6: $\\text{HAM-CYCLE} \\le_P \\text{TSP}$ (Teorema 34.14, pp. 896–898)</h4>
        <p>No <strong>Problema do Caixeiro-Viajante (TSP)</strong>, temos um grafo completo $G' = (V, E')$ com custos nas arestas $c(u, v)$ e um limite $k$. Desejamos saber se existe um percurso fechado (ciclo hamiltoniano) com custo total $\\le k$.</p>
        <p>A redução de $\\text{HAM-CYCLE}$ em $G = (V, E)$ para $\\text{TSP}$ em $G' = (V, E')$ é direta e elegante:</p>
        $c(u, v) = \\begin{cases} 0 & \\text{se } (u, v) \\in E, \\\\ 1 & \\text{se } (u, v) \\notin E. \\end{cases}$
        <p>Definimos o limite de custo do percurso como $k = 0$. Claramente, $G$ possui um ciclo hamiltoniano se e somente se existe um percurso em $G'$ com custo total $\\le 0$ (o que exige que todas as arestas do percurso pertençam a $E$). Logo, $\\text{TSP}$ é NP-completo.</p>

        <h3>4. O Problema da Soma de Subconjuntos: 3-CNF-SAT ≤_P SUBSET-SUM</h3>
        <p>No problema $\\text{SUBSET-SUM}$, recebemos um conjunto finito de inteiros positivos $S = \\{s_1, \\dots, s_n\\}$ e um inteiro alvo $t$. A pergunta é se existe um subconjunto $S' \\subseteq S$ tal que $\\sum_{s \\in S'} s = t$.</p>
        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 34.15 • (SUBSET-SUM É NP-COMPLETO VIA TABELA DECIMAL, PP. 898–902): ]</span>
          <p>Dada uma fórmula 3-CNF $\\phi$ com $n$ variáveis $x_1, \\dots, x_n$ e $k$ cláusulas $C_1, \\dots, C_k$, construímos uma tabela com $2n + 2k$ inteiros expressos em <strong>base 10</strong> com $n + k$ posições de dígitos:</p>
          <ul>
            <li>Os $n$ dígitos mais significativos representam as variáveis $x_1, \\dots, x_n$.</li>
            <li>Os $k$ dígitos menos significativos representam as cláusulas $C_1, \\dots, C_k$.</li>
            <li>Para cada variável $x_i$, criamos dois números $v_i$ e $v'_i$:
              <ul>
                <li>Ambos possuem o dígito 1 na coluna correspondente a $x_i$ e 0 nas demais colunas de variáveis.</li>
                <li>Na coluna de uma cláusula $C_j$, $v_i$ tem o dígito 1 se o literal positivo $x_i \\in C_j$; e $v'_i$ tem o dígito 1 se o literal negativo $\\neg x_i \\in C_j$. Nos demais casos, o dígito é 0.</li>
              </ul>
            </li>
            <li>Para cada cláusula $C_j$, criamos dois números de folga (<em>slack numbers</em>) $s_j$ e $s'_j$:
              <ul>
                <li>Ambos possuem 0 em todas as colunas de variáveis e em todas as colunas de outras cláusulas.</li>
                <li>Na coluna da cláusula $C_j$, $s_j$ possui o dígito 1 e $s'_j$ possui o dígito 2.</li>
              </ul>
            </li>
            <li><strong>O Alvo $t$:</strong> É definido como o número com o dígito <strong>1</strong> em cada uma das $n$ colunas de variáveis, e o dígito <strong>4</strong> em cada uma das $k$ colunas de cláusulas:
              $t = \\underbrace{11\\dots 1}_{n \\text{ uns}} \\, \\underbrace{44\\dots 4}_{k \\text{ quatros}}.$
            </li>
          </ul>
          <p><strong>Ausência de Transporte (No-Carry Property):</strong> A maior soma possível em qualquer coluna de cláusula é $1 + 1 + 1$ (dos literais de $v_i, v'_i$) mais $1 + 2$ (dos números de folga), totalizando no máximo 6. Como $6 < 10$, <em>jamais ocorre transporte (vai-um) de uma coluna para outra na base 10</em>! Cada coluna comporta-se como uma equação independente.</p>
          <p><strong>Demonstração de Equivalência:</strong></p>
          <ol>
            <li>Nas colunas de variáveis, como a meta é 1 e cada par $(v_i, v'_i)$ tem 1 naquela coluna, qualquer subconjunto que some $t$ deve escolher <em>exatamente um</em> entre $v_i$ e $v'_i$ para cada $i$, correspondendo a uma atribuição consistente de valores verdade para as variáveis ($x_i = 1$ se escolheu $v_i$, e $x_i = 0$ se escolheu $v'_i$).</li>
            <li>Nas colunas de cláusulas, os valores $v_i$ ou $v'_i$ selecionados fornecem uma soma entre 1 e 3 (se a cláusula for satisfeita por 1, 2 ou 3 literais). Como as folgas $s_j \\in \\{1\\}$ e $s'_j \\in \\{2\\}$ podem somar 0, 1, 2 ou 3, é possível complementar a soma da coluna exatamente até o valor 4 se e somente se pelo menos um literal da cláusula avaliou como 1!</li>
            <li>Se a cláusula não fosse satisfeita por nenhum literal, a soma fornecida pelas variáveis seria 0, e a soma máxima atingível com as folgas seria $1 + 2 = 3 < 4$, tornando impossível atingir o alvo $t$.</li>
          </ol>
          <p>Logo, $\\phi$ é satisfazível $\\iff$ existe subconjunto de $S$ cuja soma é exatamente $t$. A tabela possui $O(n + k)$ números com $O(n + k)$ dígitos, gerada em tempo polinomial $O((n+k)^2)$. Logo, $\\text{SUBSET-SUM}$ é NP-completo! $\\blacksquare$</p>
        </div>
      `
    },
{
      id: "u16-4",
      code: "35.1",
      title: "O Problema da Cobertura de Vértices: Algoritmo 2-Aproximação (APPROX-VERTEX-COVER)",
      reading: "pp. 899–904",
      content: `
        <h3>1. O Paradigma dos Algoritmos de Aproximação</h3>
        <p>Provar que um problema é NP-completo ou NP-difícil demonstra que, a menos que $\\text{P} = \\text{NP}$, não existe nenhum algoritmo exato capaz de resolvê-lo no pior caso em tempo polinomial. No entanto, na prática da engenharia de software e da pesquisa operacional, decisões precisam ser tomadas e sistemas de grande escala devem operar em tempo hábil. Surge então o paradigma dos <strong>Algoritmos de Aproximação</strong> (Capítulo 35, pp. 899–928): abrimos mão da garantia de otimalidade estrita em favor de algoritmos rápidos (polinomiais) que entregam soluções comprovadamente próximas da ótima.</p>

        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header">
            <span class="proc-name">APPROX-VERTEX-COVER(G)</span>
            <span>[ CAPÍTULO 35.1 • 2-APROXIMAÇÃO EM O(V + E) ]</span>
          </div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">C = ∅</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">E' = G.E</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">while</span> E' ≠ ∅</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">seja</span> (u, v) uma aresta arbitrária de E'</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content">&nbsp;&nbsp;&nbsp;&nbsp;C = C ∪ {u, v}</span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content">&nbsp;&nbsp;&nbsp;&nbsp;remova de E' toda aresta incidente a u ou a v</span></div>
            <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">return</span> C</span></div>
          </div>
        </div>

        <p><strong>Complexidade de Execução:</strong> Usando listas de adjacência e marcadores de vértices visitados, cada aresta é inspecionada um número constante de vezes. O tempo de execução de <code>APPROX-VERTEX-COVER</code> é $O(V + E)$, perfeitamente linear no tamanho do grafo.</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 35.1 • (GARANTIA DE 2-APROXIMAÇÃO DE APPROX-VERTEX-COVER, P. 900): ]</span>
          <code>APPROX-VERTEX-COVER</code> é um algoritmo de aproximação de tempo polinomial com uma razão de aproximação de 2.</span></div>
              <div class="code-line"><span class="line-num"></span><span class="line-content"><em>Demonstração Formal:</em>
          <ol>
            <li><strong>$C$ é uma Cobertura Válida:</strong> O laço <code>while</code> só termina quando $E' = \\emptyset$. Como toda aresta removida de $E'$ na linha 6 é incidente a $u$ ou a $v$ (vértices adicionados a $C$ na linha 5), nenhuma aresta de $E$ fica descoberta. Logo, $C$ é uma cobertura de vértices legítima de $G$.</li>
            <li><strong>$A$ é um Emparelhamento:</strong> Seja $A \\subseteq E$ o conjunto de arestas selecionadas na linha 4 ao longo de todas as iterações do laço. Sempre que uma aresta $(u, v)$ é incluída em $A$, a linha 6 expurga de $E'$ <em>todas</em> as arestas que tocam $u$ ou $v$. Consequentemente, nenhuma aresta selecionada em iterações posteriores pode compartilhar qualquer vértice com $(u, v)$. Isso significa que $A$ é um <strong>emparelhamento</strong> (<em>matching</em>) em $G$ — um conjunto de arestas disjuntas nos vértices.</li>
            <li><strong>Tamanho da Cobertura Calculada:</strong> Para cada aresta $(u, v) \\in A$, o algoritmo adiciona exatamente dois vértices ($u$ e $v$) ao conjunto $C$. Como as arestas de $A$ não compartilham extremidades, temos:
              $|C| = 2 |A|.$
            </li>
            <li><strong>Limite Inferior para Qualquer Cobertura Ótima $C^*$:</strong> Considere uma cobertura ótima de vértices $C^*$ de tamanho mínimo $|C^*|$. Por definição, para cada aresta $(u, v) \\in A$, a cobertura $C^*$ deve conter pelo menos um de seus extremos ($u \\in C^*$ ou $v \\in C^*$). Visto que nenhuma duas arestas de $A$ possuem vértices em comum, <em>nenhum vértice de $C^*$ pode cobrir mais de uma aresta de $A$ simultaneamente</em>! Portanto, para cobrir todas as $|A|$ arestas disjuntas de $A$, a cobertura ótima $C^*$ é obrigada a conter no mínimo $|A|$ vértices distintos:
              $|C^*| \\ge |A|.$
            </li>
            <li><strong>Conclusão da Razão 2:</strong> Multiplicando ambos os lados da desigualdade por 2, obtemos:
              $2 |C^*| \\ge 2 |A| = |C| \\implies |C| \\le 2 |C^*|.$
              Assim, a razão de aproximação $|C| / |C^*| \\le 2$. $\\blacksquare$
            </li>
          </ol>
        </div>

        <h3>3. A Falácia da Estratégia Gulosa de Maior Grau (Exercício 35.1-3)</h3>
        <p>Uma intuição bastante comum ao tentar resolver a cobertura de vértices é formular uma heurística puramente gulosa: <em>"em cada passo, selecione o vértice que possui o maior grau residual, adicione-o à cobertura e remova todas as suas arestas incidentes, repetindo até cobrir o grafo"</em>.</p>
        <p>Surpreendentemente, essa heurística gulosa natural é <strong>estritamente pior</strong> que a 2-aproximação de <code>APPROX-VERTEX-COVER</code>! O Exercício 35.1-3 (p. 903) comprova que a heurística gulosa atinge uma razão de aproximação de $\\Theta(\\lg |V|)$, não sendo constante:</p>
        <ul>
          <li>Considere uma família de grafos bipartidos com uma partição $L$ de tamanho $k$ e uma partição $R$ particionada em blocos disjuntos $B_1, B_2, \\dots, B_k$. Os vértices de $L$ são conectados de tal forma que a cobertura ótima é o conjunto $L$, com $|C^*| = k$.</li>
          <li>No entanto, os vértices da direita são conectados de modo que, a cada etapa gulosa, existe um vértice em $R$ cujo grau residual é ligeiramente maior que o grau residual de qualquer vértice de $L$. O algoritmo guloso é ludibriado a escolher sucessivamente vértices de $R$, somando uma série harmônica:
            $|C_{\\text{guloso}}| = \\sum_{i=1}^k \\frac{k}{i} = k \\cdot H_k = \\Theta(k \\ln k) = \\Theta(|C^*| \\cdot \\ln |V|).$
          </li>
          <li>Portanto, o algoritmo guloso atinge razão $\\Omega(\\lg |V|)$, enquanto <code>APPROX-VERTEX-COVER</code> jamais ultrapassa o fator 2, independentemente da topologia do grafo!</li>
        </ul>
      `
    },
    {
      id: "u16-5",
      code: "35.2",
      title: "O Problema do Caixeiro-Viajante (TSP): 2-Aproximação com Desigualdade Triangular via Árvore Geradora Mínima e a Não Aproximabilidade do TSP Geral",
      reading: "pp. 904–911",
      content: `
        <h3>1. O Problema do Caixeiro-Viajante Métrico (Com Desigualdade Triangular)</h3>
        <p>No <strong>Problema do Caixeiro-Viajante (TSP)</strong>, temos um grafo completo não dirigido $G = (V, E)$ onde cada par de vértices possui uma aresta com uma função de custo não negativa $c(u, v) \\ge 0$. Desejamos encontrar um ciclo hamiltoniano (percurso) de custo total mínimo $c(H) = \\sum_{e \\in H} c(e)$.</p>
        <p>Em muitas aplicações práticas (como logística, roteamento de veículos e design de placas de circuito impresso), os custos representam distâncias no espaço euclidiano ou tempos de trânsito em redes viárias, obedecendo à <strong>desigualdade triangular</strong> (pp. 904–907):</p>
        $c(u, w) \\le c(u, v) + c(v, w), \\quad \\forall u, v, w \\in V.$
        <p>A desigualdade triangular estabelece que "pegar um atalho" direto de $u$ para $w$ nunca é mais longo do que fazer uma escala intermediária em $v$.</p>

        <h3>2. O Algoritmo APPROX-TSP-TOUR baseado em Árvore Geradora Mínima</h3>
        <p>O algoritmo aproximado do CLRS explora a íntima conexão estrutural entre ciclos hamiltonianos e árvores geradoras mínimas (MST):</p>

        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header">
            <span class="proc-name">APPROX-TSP-TOUR(G, c)</span>
            <span>[ CAPÍTULO 35.2 • 2-APROXIMAÇÃO COM MST ]</span>
          </div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">selecione um vértice arbitrário r ∈ G.V como raiz</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">calcule uma árvore geradora mínima T para G a partir de r usando MST-PRIM(G, c, r)</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">seja</span> L a lista de vértices visitados em um percurso em pré-ordem da árvore T</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">return</span> o ciclo hamiltoniano H que visita os vértices na ordem da lista L (fechando com r)</span></div>
          </div>
        </div>

        <p><strong>Complexidade:</strong> Calcular a MST com Prim ou Kruskal consome $O(V^2)$ ou $O(E \lg V)$; o percurso em pré-ordem da árvore consome $O(V)$; construir o ciclo $H$ consome $O(V)$. O tempo total é polinomial e muito eficiente.</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 35.2 • (GARANTIA DE 2-APROXIMAÇÃO PARA TSP MÉTRICO, P. 906): ]</span>
          <code>APPROX-TSP-TOUR</code> é um algoritmo 2-aproximação em tempo polinomial para o problema do caixeiro-viajante com desigualdade triangular.
          <br><br>
          <em>Demonstração Detalhada em 4 Etapas:</em>
          <ol>
            <li><strong>O Custo da MST Limita Inferiormente o Tour Ótimo:</strong> Seja $H^*$ um ciclo hamiltoniano ótimo com custo mínimo $c(H^*)$. Se removermos qualquer aresta arbitrária de $H^*$, o que sobra é um caminho que visita todos os vértices de $V$ — logo, é uma árvore geradora de $G$. Como $T$ é a árvore geradora <em>mínima</em> de $G$, seu custo total $c(T)$ é menor ou igual ao custo de qualquer outra árvore geradora. Como os custos são não negativos:
              $c(T) \\le c(H^* - e) < c(H^*).$
            </li>
            <li><strong>A Caminhada Completa (Full Walk) $W$:</strong> Uma caminhada em profundidade completa $W$ que percorre a árvore geradora $T$ a partir da raiz $r$, desce por cada subárvore e retorna pelo caminho inverso atravessa cada aresta de $T$ <em>exatamente duas vezes</em> (uma na ida e outra na volta). Consequentemente, o custo total dessa caminhada completa é:
              $c(W) = 2 c(T) < 2 c(H^*).$
            </li>
            <li><strong>Atalhos (Shortcuts) via Pré-Ordem:</strong> A caminhada completa $W$ não é um ciclo hamiltoniano porque revisita vértices múltiplas vezes. Ao percorrermos $T$ em pré-ordem para formar a lista $L$, sempre que o percurso estiver prestes a revisitar um vértice já visto, nós o "pulamos", ligando diretamente o vértice atual ao próximo vértice inédito de $L$. Seja $H$ o ciclo hamiltoniano resultante.</li>
            <li><strong>A Desigualdade Triangular Garante Não Aumento de Custo:</strong> Suponha que na caminhada completa $W$ o caminho entre dois vértices inéditos $u$ e $w$ passe por vértices intermediários já visitados $v_1, v_2, \\dots, v_k$. Pela desigualdade triangular aplicada sucessivas vezes:
              $c(u, w) \\le c(u, v_1) + c(v_1, v_2) + \\dots + c(v_k, w).$
              Logo, substituir o subcaminho intermediário pela aresta direta $(u, w)$ <em>nunca aumenta o custo total</em>! Portanto:
              $c(H) \\le c(W).$
            </li>
            <li><strong>Conclusão:</strong> Unindo os resultados das etapas 2 e 4:
              $c(H) \\le c(W) = 2 c(T) < 2 c(H^*).$
              Isso comprova que $c(H) / c(H^*) \\le 2$, assegurando a razão de aproximação 2. $\\blacksquare$
            </li>
          </ol>
        </div>

        <h3>3. O Teorema 35.3: A Não Aproximabilidade do Caixeiro-Viajante Geral</h3>
        <p>O que ocorre se a função de custo $c(u, v)$ <strong>não satisfizer</strong> a desigualdade triangular? Poderíamos sonhar em projetar algum algoritmo de tempo polinomial com razão de aproximação constante $\\rho = 100$ ou mesmo $\\rho = 10^{6}$ para o TSP geral? O Teorema 35.3 do CLRS sepulta essa esperança de maneira definitiva e contundente:</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 35.3 • (INAPROXIMABILIDADE ABSOLUTA DO TSP GERAL, P. 909): ]</span>
          Se $\\text{P} \\neq \\text{NP}$, então para <strong>qualquer constante</strong> $\\rho \\ge 1$, não existe nenhum algoritmo de aproximação de tempo polinomial com razão de aproximação $\\rho$ para o problema geral do caixeiro-viajante.</span></div>
              <div class="code-line"><span class="line-num"></span><span class="line-content"><em>Demonstração por Contradição (Redução de HAM-CYCLE):</em>
          <p>Suponha, por absurdo, que para algum número real $\\rho \\ge 1$ (sem perda de generalidade, assuma $\\rho$ inteiro) exista um algoritmo de tempo polinomial $A$ capaz de encontrar um tour com razão de aproximação $\\rho$ para instâncias gerais de TSP. Mostraremos que $A$ poderia ser usado para decidir o problema $\\text{HAM-CYCLE}$ em tempo polinomial, o que implicaria $\\text{P} = \\text{NP}$!</p>
          <ol>
            <li>Seja $G = (V, E)$ uma instância arbitrária de $\\text{HAM-CYCLE}$ com $n = |V|$ vértices.</li>
            <li>Construímos em tempo polinomial uma instância de TSP em um grafo completo $G' = (V, E')$ com a mesma quantidade de vértices, atribuindo a cada par de vértices $(u, v)$ um custo definido por:
              $c(u, v) = \\begin{cases} 1 & \\text{se } (u, v) \\in E, \\\\ \\rho n + 1 & \\text{se } (u, v) \\notin E. \\end{cases}$
            </li>
            <li><strong>Cenário 1: $G$ possui um Ciclo Hamiltoniano.</strong></span></div>
              <div class="code-line"><span class="line-num"></span><span class="line-content">Nesse caso, existe em $G'$ um percurso que utiliza exclusivamente arestas originais de $E$. Como cada uma dessas arestas tem custo 1 e o percurso visita $n$ vértices, o custo do tour ótimo em $G'$ é exatamente:
              $c(H^*) = n \\cdot 1 = n.$
              Se executarmos o algoritmo aproximado $A$ sobre $G'$, ele garante devolver um percurso $H$ cujo custo satisfaz:
              $c(H) \\le \\rho \\cdot c(H^*) = \\rho n.$
            </li>
            <li><strong>Cenário 2: $G$ NÃO possui nenhum Ciclo Hamiltoniano.</strong></span></div>
              <div class="code-line"><span class="line-num"></span><span class="line-content">Qualquer percurso em $G'$ é obrigado a conter <em>pelo menos uma aresta que não pertence a $E$</em>. Como essa aresta tem custo penalizador $\\rho n + 1$ e todas as demais $n - 1$ arestas têm custo no mínimo 1, o custo de <em>qualquer</em> percurso possível em $G'$ é estritamente limitado inferiormente por:
              $c(\\text{qualquer percurso}) \\ge (\\rho n + 1) + (n - 1) \\cdot 1 = \\rho n + n > \\rho n.$
            </li>
            <li><strong>O Algoritmo Decisor de HAM-CYCLE:</strong> Para decidir se $G \\in \\text{HAM-CYCLE}$, basta construir $G'$, rodar o algoritmo de aproximação $A$ e inspecionar o custo $c(H)$ do tour devolvido:
              <ul>
                <li>Se $c(H) \\le \\rho n$, respondemos com certeza que <strong>$G$ é hamiltoniano</strong>;</li>
                <li>Se $c(H) > \\rho n$, respondemos com certeza que <strong>$G$ não é hamiltoniano</strong>.</li>
              </ul>
            </li>
          </ol>
          <p>Como a construção de $G'$ e a execução de $A$ tomam tempo polinomial, teríamos resolvido $\\text{HAM-CYCLE}$ em tempo polinomial. Mas pelo Teorema 34.13, $\\text{HAM-CYCLE}$ é NP-completo; portanto, teríamos $\\text{P} = \\text{NP}$, contradizendo a premissa de que $\\text{P} \\neq \\text{NP}$! $\\blacksquare$</p>
        </div>
      `
    },
    {
      id: "u16-6",
      code: "35.3, 35.4 e 35.5",
      title: "Cobertura de Conjuntos (GREEDY-SET-COVER), Randomização em Max-3-CNF, e Esquema de Aproximação Totalmente Polinomial (FPTAS) para a Soma de Subconjuntos (APPROX-SUBSET-SUM)",
      reading: "pp. 911–928",
      content: `
        <h3>1. O Problema de Cobertura de Conjuntos (GREEDY-SET-COVER)</h3>
        <p>No problema de <strong>Cobertura de Conjuntos</strong> (<em>Set Cover</em>, pp. 911–918), temos um conjunto universo finito $X$ com $n$ elementos e uma família $\\mathcal{F}$ de subconjuntos de $X$ tal que todo elemento de $X$ pertence a pelo menos um conjunto em $\\mathcal{F}$ ($\\bigcup_{S \\in \\mathcal{F}} S = X$). Desejamos encontrar uma subfamília $\\mathcal{C} \\subseteq \\mathcal{F}$ de tamanho <em>mínimo</em> que cubra todos os elementos de $X$ ($\\bigcup_{S \\in \\mathcal{C}} S = X$).</p>

        <p>A heurística gulosa natural consiste em escolher, a cada passo, o conjunto que abrange o maior número de elementos ainda não cobertos:</p>

        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header">
            <span class="proc-name">GREEDY-SET-COVER(X, F)</span>
            <span>[ CAPÍTULO 35.3 • RAZÃO HARMÔNICA ln |X| + 1 ]</span>
          </div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">U = X <span class="cmt">// elementos ainda não cobertos</span></span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">C = ∅</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">while</span> U ≠ ∅</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">&nbsp;&nbsp;&nbsp;&nbsp;selecione um conjunto S ∈ F que maximize |S ∩ U|</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content">&nbsp;&nbsp;&nbsp;&nbsp;U = U - S</span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content">&nbsp;&nbsp;&nbsp;&nbsp;C = C ∪ {S}</span></div>
            <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">return</span> C</span></div>
          </div>
        </div>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 35.4 • (RAZÃO DE APROXIMAÇÃO HARMÔNICA DE GREEDY-SET-COVER, P. 913): ]</span>
          <code>GREEDY-SET-COVER</code> é um algoritmo de aproximação em tempo polinomial com uma razão de aproximação de $H(\\max_{S \\in \\mathcal{F}} |S|) \\le \\ln |X| + 1$, onde $H(d) = \\sum_{i=1}^d \\frac{1}{i}$ é o $d$-ésimo número harmônico.
          <br><br>
          <em>Demonstração via Custo Amortizado:</em>
          <ol>
            <li>Atribuímos um custo unitário a cada conjunto $S$ selecionado na linha 4. Quando $S$ é escolhido, distribuímos uniformemente esse custo de 1 entre todos os elementos que são cobertos pela primeira vez por $S$. Se $S$ cobre $|S \\cap U|$ novos elementos, atribuímos a cada elemento $x \\in (S \\cap U)$ o custo:
              $$c_x = \\frac{1}{|S \\cap U|}.$$
            </li>
            <li>O custo total da cobertura calculada é $|\\mathcal{C}| = \\sum_{x \\in X} c_x$.</li>
            <li>Seja $\\mathcal{C}^*$ uma cobertura ótima com $|\mathcal{C}^*|$ conjuntos. Como $\\mathcal{C}^*$ cobre $X$, temos:
              $$|\\mathcal{C}| = \\sum_{x \\in X} c_x \\le \\sum_{S \\in \\mathcal{C}^*} \\sum_{x \\in S} c_x.$$
            </li>
            <li>Para qualquer conjunto fixo $S \\in \\mathcal{F}$, limitamos $\\sum_{x \\in S} c_x$. Ordene os elementos de $S$ na ordem reversa em que são cobertos pelo algoritmo guloso ($x_{|S|}, x_{|S|-1}, \\dots, x_1$). Quando o $k$-ésimo elemento restante de $S$ ($x_k$) foi coberto, o conjunto $S$ continha pelo menos $k$ elementos em $U$. Como o algoritmo guloso escolheu um conjunto que maximizava $|S' \\cap U|$, o conjunto escolhido cobriu no mínimo $k$ elementos, implicando que $c_{x_k} \\le 1/k$.</li>
            <li>Somando sobre todos os elementos de $S$:
              $$\\sum_{x \\in S} c_x \\le \\sum_{k=1}^{|S|} \\frac{1}{k} = H(|S|) \\le H(d), \\quad \\text{onde } d = \\max_{S \\in \\mathcal{F}} |S|.$$
            </li>
            <li>Substituindo de volta:
              $$|\\mathcal{C}| \\le \\sum_{S \\in \\mathcal{C}^*} H(d) = |\\mathcal{C}^*| \\cdot H(d) \\implies \\frac{|\\mathcal{C}|}{|\\mathcal{C}^*|} \\le H(d) \\le \\ln |X| + 1. \\quad \\blacksquare$$
            </li>
          </ol>
        </div>

        <h3>2. Aleatorização e Satisfatibilidade MAX-3-CNF</h3>
        <p>No problema de otimização <strong>MAX-3-CNF</strong> (pp. 918–922), temos uma fórmula booleana 3-CNF com $n$ variáveis e $m$ cláusulas, onde cada cláusula contém exatamente 3 literais distintos. Desejamos encontrar uma atribuição de valores verdade que satisfaça o maior número possível de cláusulas.</p>
        <p>Considere o algoritmo probabilístico mais elementar imaginável: para cada variável $x_i$, sorteamos independentemente seu valor com probabilidade $\\Pr(x_i = 1) = 1/2$ e $\\Pr(x_i = 0) = 1/2$.</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 35.6 • (GARANTIA DE 7/8 EM ESPERANÇA PARA MAX-3-CNF, P. 920): ]</span>
          Dada uma instância de MAX-3-CNF com $m$ cláusulas, o algoritmo aleatorizado produz em tempo polinomial uma atribuição de variáveis que satisfaz, em esperança, pelo menos $\\frac{7}{8} m$ cláusulas (razão de aproximação esperada $8/7 \\approx 1.1428$).
          <br><br>
          <em>Demonstração:</em>
          <ul>
            <li>Defina para cada cláusula $i \\in \\{1, \\dots, m\\}$ uma variável aleatória indicadora:
              $$Y_i = I\\{ \\text{a cláusula } C_i \\text{ é satisfeita sob a atribuição sorteada} \\}.$$
            </li>
            <li>A cláusula $C_i = (l_1 \\lor l_2 \\lor l_3)$ contém 3 literais distintos. Ela só avalia como 0 se <em>todos os três literais avaliarem como 0 simultaneamente</em>. Como cada literal assume valor 0 com probabilidade $1/2$ independentemente, temos:
              $$\\Pr(C_i = 0) = \\left( \\frac{1}{2} \\right)^{\\!3} = \\frac{1}{8} \\implies \\Pr(C_i = 1) = 1 - \\frac{1}{8} = \\frac{7}{8}.$$
            </li>
            <li>Pela propriedade de esperança de variáveis indicadoras: $E[Y_i] = \\Pr(Y_i = 1) = \\frac{7}{8}$.</li>
            <li>Seja $Y = \\sum_{i=1}^m Y_i$ o número total de cláusulas satisfeitas. Pela <strong>Linearidade da Esperança</strong> (mesmo havendo dependência estatística entre cláusulas que compartilham variáveis):
              $$E[Y] = E\\left[ \\sum_{i=1}^m Y_i \\right] = \\sum_{i=1}^m E[Y_i] = \\sum_{i=1}^m \\frac{7}{8} = \\mathbf{\\frac{7}{8} m}.$$
            </li>
            <li>Como o ótimo $C^*$ não pode exceder o total de cláusulas ($C^* \\le m$), o valor esperado $E[Y] \\ge \\frac{7}{8} C^*$, garantindo a razão de aproximação $8/7$. $\\blacksquare$</li>
          </ul>
        </div>

        <h3>3. Esquemas de Aproximação: PTAS vs. FPTAS</h3>
        <p>A classe mais nobre e refinada de algoritmos para problemas NP-difíceis são os <strong>Esquemas de Aproximação</strong> (pp. 922–928):</p>
        <ul>
          <li><strong>PTAS (Polynomial-Time Approximation Scheme):</strong> Um algoritmo de aproximação que toma como parâmetros a instância do problema e um parâmetro de erro $\\epsilon > 0$, garantindo razão $(1 + \\epsilon)$ para minimização (ou $1 - \\epsilon$ para maximização). Para qualquer $\\epsilon$ <em>fixo</em>, o algoritmo executa em tempo polinomial no tamanho $n$ da entrada, embora a dependência em $1/\\epsilon$ possa ser arbitrária (por exemplo, $O(n^{2/\\epsilon})$ ou $O(n^{1/\\epsilon!})$).</li>
          <li><strong>FPTAS (Fully Polynomial-Time Approximation Scheme):</strong> É o padrão ouro da computação aproximada. Um esquema é <em>totalmente polinomial</em> se o seu tempo de execução é limitado por um polinômio <strong>simultaneamente no tamanho da entrada $n$ e em $1/\\epsilon$</strong>, ou seja, $O\\left(\\left( \\frac{1}{\\epsilon} \\right)^c n^d \\right)$ para constantes fixas $c, d$. Se desejamos dobrar a precisão (reduzindo $\\epsilon$ pela metade), o tempo de execução aumenta apenas por um fator polinomial, jamais exponencial!</li>
        </ul>

        <h3>4. O FPTAS para Soma de Subconjuntos (APPROX-SUBSET-SUM)</h3>
        <p>No problema de otimização da Soma de Subconjuntos, dados $S = \\{x_1, \\dots, x_n\\}$ e o alvo $t$, buscamos o subconjunto $S' \\subseteq S$ cuja soma seja a maior possível sem ultrapassar $t$.</p>

        <h4>O Algoritmo Exato de Tempo Exponencial (EXACT-SUBSET-SUM)</h4>
        <p>O procedimento exato calcula iterativamente $L_i$, a lista ordenada de todas as somas de subconjuntos de $\\{x_1, \\dots, x_i\\}$ que não excedem $t$:</p>
        <ul>
          <li>$L_0 = \\langle 0 \\rangle$;</li>
          <li>A cada etapa $i = 1, \\dots, n$, calculamos $L_i = \\text{MERGE-LISTS}(L_{i-1}, L_{i-1} + x_i)$ e removemos elementos $> t$.</li>
          <li>Como $|L_i|$ pode dobrar a cada passo, o tamanho atinge $2^n$, tornando-o exponencial.</li>
        </ul>

        <h4>A Poda Geométrica (TRIM) e o Esquema Totalmente Polinomial</h4>
        <p>A ideia genial do CLRS para transformar esse algoritmo em um FPTAS consiste em "desbastar" a lista $L_i$ descartando números que estejam excessivamente próximos de algum elemento já retido (pp. 924–928):</p>

        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header">
            <span class="proc-name">TRIM(L, δ)</span>
            <span>[ CAPÍTULO 35.5 • PODA GEOMÉTRICA DE LISTAS ]</span>
          </div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">m = |L|</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">L' = ⟨y₁⟩ <span class="cmt">// onde L = ⟨y₁, y₂, ..., y_m⟩</span></span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">last = y₁</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">for</span> i = 2 <span class="kw">to</span> m</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content">&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">if</span> y_i > last · (1 + δ)</span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;anexe y_i ao final de L'</span></div>
            <div class="code-line"><span class="line-num">7</span><span class="line-content">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;last = y_i</span></div>
            <div class="code-line"><span class="line-num">8</span><span class="line-content"><span class="kw">return</span> L'</span></div>
          </div>
        </div>

        <p>O procedimento <code>APPROX-SUBSET-SUM</code> utiliza <code>TRIM</code> com parâmetro de poda $\delta = \frac{\epsilon}{2n}$:</p>

        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header">
            <span class="proc-name">APPROX-SUBSET-SUM(S, t, ε)</span>
            <span>[ CAPÍTULO 35.5 • FPTAS (1 + ε) EM TEMPO TOTALMENTE POLINOMIAL ]</span>
          </div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">n = |S|</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">L_0 = ⟨0⟩</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">for</span> i = 1 <span class="kw">to</span> n</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">&nbsp;&nbsp;&nbsp;&nbsp;L_i = MERGE-LISTS(L_{i-1}, L_{i-1} + x_i)</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content">&nbsp;&nbsp;&nbsp;&nbsp;L_i = TRIM(L_i, ε / (2n))</span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content">&nbsp;&nbsp;&nbsp;&nbsp;remova de L_i todo elemento maior que t</span></div>
            <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">return</span> o maior elemento em L_n</span></div>
          </div>
        </div>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 35.8 • (APPROX-SUBSET-SUM É UM FPTAS, PP. 926–928): ]</span>
          <code>APPROX-SUBSET-SUM</code> é um esquema de aproximação de tempo totalmente polinomial para o problema da soma de subconjuntos, operando no tempo $O((n^2 \\ln t) / \\epsilon)$ com razão de aproximação $1 + \\epsilon$.
          <br><br>
          <em>Demonstração:</em>
          <ol>
            <li><strong>Garantia de Aproximação $(1 + \\epsilon)$:</strong>
              <br>A cada etapa de desbaste com $\\delta = \\frac{\\epsilon}{2n}$, para todo elemento $y$ descartado, existe um elemento retido $z$ tal que $\\frac{y}{1 + \\delta} \\le z \\le y$.
              <br>Por indução em $i$, após $n$ etapas de desbaste composto, para a soma ótima exata $y^* \\in P_n$ ($y^* \\le t$), existe um elemento $z^* \\in L_n$ tal que:
              $$\\frac{y^*}{(1 + \\delta)^n} \\le z^* \\le y^* \\implies \\frac{y^*}{z^*} \\le (1 + \\delta)^n = \\left( 1 + \\frac{\\epsilon}{2n} \\right)^{\\!n}.$$
              Como a função $(1 + \\epsilon/2n)^n$ converge monotonicamente por baixo para $e^{\\epsilon/2}$ e para qualquer $0 \\le \\epsilon \\le 1$ vale $e^{\\epsilon/2} \\le 1 + \\epsilon/2 + (\\epsilon/2)^2 \\le 1 + \\epsilon$, concluímos que:
              $$\\frac{y^*}{z^*} \\le 1 + \\epsilon.$$
            </li>
            <li><strong>Cota Superior no Tamanho das Listas Desbastadas $|L_i|$:</strong>
              <br>Em qualquer lista $L_i$ após o desbaste com $\\delta$, dois elementos sucessivos não nulos $z$ e $z'$ satisfazem $z' / z > 1 + \\delta$. Logo, os elementos crescem geometricamente por um fator de pelo menos $(1 + \\delta)$. Como o menor elemento positivo é $\\ge 1$ e o maior é $\\le t$, o número máximo de elementos positivos em $L_i$ é limitado por:
              $$|L_i| \\le 1 + \\log_{1+\\delta} t = 1 + \\frac{\\ln t}{\\ln(1 + \\delta)}.$$
              Usando a desigualdade $\\ln(1 + x) \\ge \\frac{x}{1 + x}$ para $x > 0$:
              $$|L_i| \\le 1 + \\frac{\\ln t}{\\delta / (1 + \\delta)} = 1 + \\left( 1 + \\frac{1}{\\delta} \\right) \\ln t \\le 1 + \\left( 1 + \\frac{2n}{\\epsilon} \\right) \\ln t = O\\left( \\frac{n \\ln t}{\\epsilon} \\right).$$
            </li>
            <li><strong>Complexidade Total:</strong> Como o laço <code>for</code> executa $n$ vezes e cada iteração realiza operações de mescla e desbaste proporcionais a $|L_i|$, o tempo total de execução é:
              $$T(n) = n \\cdot O(|L_i|) = O\\left( \\frac{n^2 \\ln t}{\\epsilon} \\right).$$
            </li>
          </ol>
          <p>O tempo de execução é estritamente polinomial tanto no tamanho da entrada ($n$ e $\\ln t$, que é o número de bits de $t$) quanto em $1/\\epsilon$. Portanto, <code>APPROX-SUBSET-SUM</code> é um FPTAS legítimo! $\\blacksquare$</p>
        </div>
      `
    }
  ];

/* ========================================================================
     SEÇÃO 2.5: WORKBENCH INTERATIVO DUPLO DO MÓDULO 16
     (1) Simulador de 2-Aproximação para Cobertura de Vértices (APPROX-VERTEX-COVER) vs C*
     (2) Simulador de FPTAS de Soma de Subconjuntos (APPROX-SUBSET-SUM) com Poda Geométrica
     ======================================================================== */
  function initWorkbenches() {
    const mount = document.getElementById("workbench-mod16-mount");
    if (!mount || mount.dataset.initialized === "true") return;
    mount.dataset.initialized = "true";

    mount.innerHTML = `
      <div class="workbench-box" style="margin-top:1.5rem;">
        <div class="workbench-header">
          <span class="workbench-title">[ BANCADA INTERATIVA DUPLA • MÓDULO 16: ALGORITMOS DE APROXIMAÇÃO (CAP. 35) ]</span>
          <span class="bracket-tag amber">VERTEX-COVER • FPTAS SUBSET-SUM • PODA TRIM</span>
        </div>
        <div class="workbench-body">
          <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
            Explore interativamente:
            <strong>(Laboratório 01)</strong> a execução passo a passo de <code>APPROX-VERTEX-COVER</code> sobre grafos configuráveis (incluindo a instância canônica da Figura 35.1, p. 900), acompanhando a formação do emparelhamento maximal de arestas $A$, a cobertura resultante $|C| = 2|A|$, a comparação com a cobertura ótima exata $C^*$ e a demonstração da falha da heurística gulosa por maior grau (Exercício 35.1-3);
            <strong>(Laboratório 02)</strong> o Esquema de Aproximação em Tempo Totalmente Polinomial (FPTAS) <code>APPROX-SUBSET-SUM</code> (Seção 35.5, p. 925), inspecionando o desbaste de listas via <code>TRIM(L, δ)</code> com $\\delta = \\epsilon / 2n$, a compactação exponencial da memória e a garantia $(1 + \\epsilon)$.
          </p>

          <div style="display:flex;gap:0.6rem;flex-wrap:wrap;margin-bottom:1.1rem;border-bottom:2px solid var(--ink-primary);padding-bottom:0.8rem;">
            <button id="m16-tab-vc" class="wb-btn primary">[ LABORATÓRIO 01: COBERTURA DE VÉRTICES: 2-APROX vs. ÓTIMO C* vs. GULOSO (CAP. 35.1) ]</button>
            <button id="m16-tab-ss" class="wb-btn">[ LABORATÓRIO 02: FPTAS SOMA DE SUBCONJUNTOS & PODA GEOMÉTRICA TRIM (CAP. 35.5) ]</button>
          </div>

          <!-- ABA 1: COBERTURA DE VÉRTICES -->
          <div id="m16-panel-vc">
            <div class="workbench-controls" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
              <label for="m16-vc-graph-select" style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;">Grafo de Entrada:</label>
              <select id="m16-vc-graph-select" class="search-input-brutal" style="min-width:240px;">
                <option value="clrs">Exemplo Canônico CLRS (Fig. 35.1, p. 900 — 7 vértices, 8 arestas)</option>
                <option value="star">Grafo Estrela K_{1,5} (Centro c, 5 folhas — Ótimo = 1, Approx = 2)</option>
                <option value="bipartite">Desafio Bipartido Ex. 35.1-3 (Onde a Heurística Gulosa Falha)</option>
                <option value="cycle">Ciclo C₆ (6 vértices — Ótimo = 3, Approx = 6)</option>
              </select>
              <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
                <button id="m16-vc-step-btn" class="wb-btn primary">Passo a Passo (Aresta)</button>
                <button id="m16-vc-run-btn" class="wb-btn">Executar 2-Aprox Completo</button>
                <button id="m16-vc-greedy-btn" class="wb-btn">Testar Heurística Gulosa</button>
                <button id="m16-vc-reset-btn" class="wb-btn">↺ Reiniciar</button>
              </div>
            </div>

            <!-- Métricas e Placar -->
            <div class="workbench-telemetry-strip" style="margin-bottom:14px;">
              <div class="wb-stat-box">
                <span class="array-idx-label">Cobertura Calculada |C|</span>
                <strong id="m16-vc-c-size" style="color:var(--accent-amber-dark);">0</strong>
                <div id="m16-vc-c-nodes" style="font-size:0.72rem;color:var(--ink-secondary);word-break:break-all;">∅</div>
              </div>
              <div class="wb-stat-box">
                <span class="array-idx-label">Emparelhamento Maximal |A|</span>
                <strong id="m16-vc-a-size" style="color:var(--accent-emerald-dark);">0</strong>
                <div id="m16-vc-a-edges" style="font-size:0.72rem;color:var(--ink-secondary);">∅</div>
              </div>
              <div class="wb-stat-box">
                <span class="array-idx-label">Cobertura Ótima Exata |C*|</span>
                <strong id="m16-vc-opt-size" style="color:var(--ink-primary);">-</strong>
                <div id="m16-vc-opt-nodes" style="font-size:0.72rem;color:var(--ink-secondary);word-break:break-all;">-</div>
              </div>
              <div class="wb-stat-box">
                <span class="array-idx-label">Razão Observada |C| / |C*|</span>
                <strong id="m16-vc-ratio" style="color:var(--accent-amber-dark);">-</strong>
                <div id="m16-vc-ratio-badge" style="font-size:0.72rem;font-weight:700;">Garantia: ≤ 2.0</div>
              </div>
            </div>

            <!-- Grafo SVG e Log -->
            <div style="display:grid;grid-template-columns:1fr 280px;gap:14px;">
              <div style="background:var(--bg-paper);padding:10px;border:var(--border-thin);display:flex;justify-content:center;align-items:center;">
                <svg id="m16-vc-svg" width="460" height="300" viewBox="0 0 460 300" style="background:#111;border:2px solid #111;box-shadow:var(--shadow-brutal-sm);"></svg>
              </div>
              <div style="display:flex;flex-direction:column;gap:10px;">
                <div style="background:var(--bg-card);border:var(--border-thin);padding:10px;">
                  <div style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;margin-bottom:6px;color:var(--accent-amber-dark);">Legenda do Grafo:</div>
                  <div style="font-family:var(--font-mono);font-size:0.74rem;line-height:1.6;">
                    <div><span style="color:#22c55e;">━━</span> Aresta em A (Emparelhamento)</div>
                    <div><span style="color:#ef4444;">●</span> Vértice em C (Coberto)</div>
                    <div><span style="color:#64748b;">━━</span> Aresta Eliminada / Coberta</div>
                    <div><span style="color:#cbd5e1;">○</span> Vértice Não Coberto</div>
                  </div>
                </div>
                <div id="m16-vc-log" class="wb-log-panel" style="flex:1;max-height:180px;overflow-y:auto;"></div>
              </div>
            </div>
          </div>

          <!-- ABA 2: FPTAS SOMA DE SUBCONJUNTOS -->
          <div id="m16-panel-ss" style="display:none;">
            <div style="background:var(--bg-card);border:var(--border-thin);padding:1rem;">
              <div class="workbench-controls" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                <label style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;">Conjunto $S$:
                  <input id="m16-ss-s-input" type="text" value="104, 102, 201, 101" class="search-input-brutal" style="min-width:180px;" />
                </label>
                <label style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;">Meta $t$:
                  <input id="m16-ss-t-input" type="number" value="308" class="search-input-brutal" style="width:75px;" />
                </label>
                <label style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;">Parâmetro $\\epsilon$:
                  <select id="m16-ss-eps-select" class="search-input-brutal">
                    <option value="0.4" selected>ε = 0.40 (δ = 0.05)</option>
                    <option value="0.2">ε = 0.20 (δ = 0.025)</option>
                    <option value="0.1">ε = 0.10 (δ = 0.0125)</option>
                  </select>
                </label>
                <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
                  <button id="m16-ss-step-btn" class="wb-btn primary">Próxima Iteração TRIM ▶</button>
                  <button id="m16-ss-run-btn" class="wb-btn">Executar FPTAS Completo</button>
                  <button id="m16-ss-reset-btn" class="wb-btn">↺ Reiniciar</button>
                </div>
              </div>

              <div style="font-family:var(--font-mono);font-size:0.75rem;margin-bottom:10px;color:var(--ink-secondary);">
                Predefinição: <a href="javascript:void(0)" id="m16-ss-preset-clrs" style="color:var(--accent-amber-dark);font-weight:700;">CLRS Exemplo Seção 35.5 (p. 928: S={104,102,201,101}, t=308, ε=0.40)</a>
              </div>

              <!-- Rastreamento de Iterações -->
              <div id="m16-ss-iterations-view" class="canonical-table-wrap" style="max-height:280px;overflow-y:auto;margin-bottom:12px;"></div>

              <div id="m16-ss-summary-card" class="wb-log-panel"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    // -------------------------------------------------------------
    // LÓGICA DE TROCA DE ABAS
    // -------------------------------------------------------------
    const tabVc = document.getElementById("m16-tab-vc");
    const tabSs = document.getElementById("m16-tab-ss");
    const panelVc = document.getElementById("m16-panel-vc");
    const panelSs = document.getElementById("m16-panel-ss");

    if (tabVc && tabSs && panelVc && panelSs) {
      tabVc.addEventListener("click", () => {
        tabVc.className = "wb-btn primary";
        tabSs.className = "wb-btn";
        panelVc.style.display = "block";
        panelSs.style.display = "none";
      });
      tabSs.addEventListener("click", () => {
        tabSs.className = "wb-btn primary";
        tabVc.className = "wb-btn";
        panelSs.style.display = "block";
        panelVc.style.display = "none";
      });
    }

    // =============================================================
    // ABA 1: SIMULADOR DE VERTEX COVER
    // =============================================================
    const graphs = {
      clrs: {
        name: "CLRS Fig. 35.1 (pp. 900–901)",
        nodes: {
          a: { x: 70, y: 140 },
          b: { x: 150, y: 140 },
          c: { x: 230, y: 140 },
          d: { x: 330, y: 75 },
          e: { x: 330, y: 205 },
          f: { x: 440, y: 140 },
          g: { x: 330, y: 260 }
        },
        edges: [
          ["a", "b"], ["b", "c"], ["c", "d"], ["c", "e"],
          ["d", "e"], ["d", "f"], ["e", "f"], ["d", "g"]
        ],
        canonicalEdgeOrder: [["b", "c"], ["e", "f"], ["d", "g"]]
      },
      star: {
        name: "Grafo Estrela K_{1,5}",
        nodes: {
          c: { x: 270, y: 140 },
          v1: { x: 130, y: 70 },
          v2: { x: 130, y: 210 },
          v3: { x: 410, y: 70 },
          v4: { x: 410, y: 210 },
          v5: { x: 270, y: 245 }
        },
        edges: [
          ["c", "v1"], ["c", "v2"], ["c", "v3"], ["c", "v4"], ["c", "v5"]
        ],
        canonicalEdgeOrder: [["c", "v1"]]
      },
      bipartite: {
        name: "Desafio Guloso Bipartido (Ex. 35.1-3)",
        nodes: {
          l1: { x: 140, y: 65 },
          l2: { x: 140, y: 140 },
          l3: { x: 140, y: 215 },
          r1: { x: 380, y: 45 },
          r2: { x: 380, y: 90 },
          r3: { x: 380, y: 135 },
          r4: { x: 380, y: 180 },
          r5: { x: 380, y: 225 }
        },
        edges: [
          ["l1", "r1"], ["l1", "r2"], ["l1", "r3"],
          ["l2", "r3"], ["l2", "r4"], ["l2", "r5"],
          ["l3", "r1"], ["l3", "r2"], ["l3", "r5"]
        ],
        canonicalEdgeOrder: [["l1", "r1"], ["l2", "r3"], ["l3", "r5"]]
      },
      cycle: {
        name: "Ciclo C₆",
        nodes: {
          v1: { x: 180, y: 70 },
          v2: { x: 360, y: 70 },
          v3: { x: 450, y: 150 },
          v4: { x: 360, y: 230 },
          v5: { x: 180, y: 230 },
          v6: { x: 90, y: 150 }
        },
        edges: [
          ["v1", "v2"], ["v2", "v3"], ["v3", "v4"],
          ["v4", "v5"], ["v5", "v6"], ["v6", "v1"]
        ],
        canonicalEdgeOrder: [["v1", "v2"], ["v3", "v4"], ["v5", "v6"]]
      }
    };

    let currentGraphKey = "clrs";
    let activeEdges = [];
    let matchedEdges = [];
    let coverNodes = new Set();
    let discardedEdges = [];
    let exactOptCover = [];
    let vcStepCount = 0;

    function computeExactOptCover(graph) {
      const nodeList = Object.keys(graph.nodes);
      const n = nodeList.length;
      let bestCover = nodeList;

      for (let mask = 0; mask < (1 << n); mask++) {
        const candidate = [];
        for (let i = 0; i < n; i++) {
          if ((mask >> i) & 1) candidate.push(nodeList[i]);
        }
        if (candidate.length >= bestCover.length) continue;

        const candSet = new Set(candidate);
        let coversAll = true;
        for (const [u, v] of graph.edges) {
          if (!candSet.has(u) && !candSet.has(v)) {
            coversAll = false;
            break;
          }
        }
        if (coversAll) {
          bestCover = candidate;
        }
      }
      return bestCover;
    }

    function resetVc() {
      const g = graphs[currentGraphKey];
      activeEdges = g.edges.map(e => [...e]);
      matchedEdges = [];
      coverNodes = new Set();
      discardedEdges = [];
      exactOptCover = computeExactOptCover(g);
      vcStepCount = 0;
      updateVcUI("Grafo reiniciado. Pronto para executar APPROX-VERTEX-COVER.");
    }

    function renderVcGraph() {
      const svg = document.getElementById("m16-vc-svg");
      if (!svg) return;
      const g = graphs[currentGraphKey];

      let svgHtml = "";

      // Desenha arestas
      for (const [u, v] of g.edges) {
        const p1 = g.nodes[u];
        const p2 = g.nodes[v];
        if (!p1 || !p2) continue;

        const isMatched = matchedEdges.some(e => (e[0]===u && e[1]===v) || (e[0]===v && e[1]===u));
        const isDiscarded = discardedEdges.some(e => (e[0]===u && e[1]===v) || (e[0]===v && e[1]===u));

        let strokeColor = "#0284c7"; // ativo
        let strokeWidth = 2;
        let strokeDash = "none";

        if (isMatched) {
          strokeColor = "#10b981"; // emparelhamento
          strokeWidth = 4;
        } else if (isDiscarded) {
          strokeColor = "#475569"; // coberto e descartado
          strokeWidth = 1.5;
          strokeDash = "4,4";
        }

        svgHtml += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-dasharray="${strokeDash}" />`;
      }

      // Desenha vértices
      for (const [id, pos] of Object.entries(g.nodes)) {
        const inCover = coverNodes.has(id);
        const inOpt = exactOptCover.includes(id);

        const fill = inCover ? "#10b981" : "#1e293b";
        const stroke = inCover ? "#34d399" : (inOpt ? "#eab308" : "#475569");
        const strokeWidth = inCover ? 3 : (inOpt ? 2.5 : 1.5);

        svgHtml += `
          <g>
            <circle cx="${pos.x}" cy="${pos.y}" r="17" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
            <text x="${pos.x}" y="${pos.y + 5}" font-size="12" font-family="sans-serif" font-weight="bold" fill="#f8fafc" text-anchor="middle">${id}</text>
          </g>
        `;
      }

      svg.innerHTML = svgHtml;
    }

    function updateVcUI(logMessage) {
      renderVcGraph();

      const cSizeEl = document.getElementById("m16-vc-c-size");
      const cNodesEl = document.getElementById("m16-vc-c-nodes");
      const aSizeEl = document.getElementById("m16-vc-a-size");
      const aEdgesEl = document.getElementById("m16-vc-a-edges");
      const optSizeEl = document.getElementById("m16-vc-opt-size");
      const optNodesEl = document.getElementById("m16-vc-opt-nodes");
      const ratioEl = document.getElementById("m16-vc-ratio");
      const logEl = document.getElementById("m16-vc-log");

      const cArr = Array.from(coverNodes);
      if (cSizeEl) cSizeEl.textContent = cArr.length;
      if (cNodesEl) cNodesEl.textContent = cArr.length > 0 ? "{" + cArr.join(", ") + "}" : "∅";

      if (aSizeEl) aSizeEl.textContent = matchedEdges.length;
      if (aEdgesEl) aEdgesEl.textContent = matchedEdges.length > 0 ? matchedEdges.map(e => `(${e[0]},${e[1]})`).join(" ") : "∅";

      if (optSizeEl) optSizeEl.textContent = exactOptCover.length;
      if (optNodesEl) optNodesEl.textContent = "{" + exactOptCover.join(", ") + "}";

      if (ratioEl) {
        if (exactOptCover.length > 0 && cArr.length > 0) {
          const r = (cArr.length / exactOptCover.length).toFixed(2);
          ratioEl.textContent = r;
          ratioEl.style.color = Number(r) <= 2.0 ? "#34d399" : "#ef4444";
        } else {
          ratioEl.textContent = "-";
        }
      }

      if (logEl && logMessage) {
        logEl.innerHTML = `<div>[Passo ${vcStepCount}] ${logMessage}</div>` + logEl.innerHTML;
      }
    }

    function stepVc() {
      if (activeEdges.length === 0) {
        updateVcUI("O conjunto de arestas E' está vazio! Todas as arestas foram cobertas.");
        return;
      }

      vcStepCount++;
      // Escolhe a primeira aresta restante em activeEdges
      const [u, v] = activeEdges[0];
      matchedEdges.push([u, v]);
      coverNodes.add(u);
      coverNodes.add(v);

      // Linha 6: remove todas as arestas incidentes a u ou v
      const newlyDiscarded = [];
      const remainingEdges = [];

      for (const [x, y] of activeEdges) {
        if (x === u || x === v || y === u || y === v) {
          newlyDiscarded.push([x, y]);
          discardedEdges.push([x, y]);
        } else {
          remainingEdges.push([x, y]);
        }
      }

      activeEdges = remainingEdges;

      const msg = `Selecionada aresta (${u}, ${v}) para o emparelhamento A. Vértices ${u} e ${v} adicionados a C. ` +
        `Removidas de E' as ${newlyDiscarded.length} arestas incidentes: ${newlyDiscarded.map(e => `(${e[0]},${e[1]})`).join(", ")}. Restam ${activeEdges.length} arestas em E'.`;

      updateVcUI(msg);

      if (activeEdges.length === 0) {
        const cLen = coverNodes.size;
        const optLen = exactOptCover.length;
        const r = (cLen / optLen).toFixed(2);
        updateVcUI(`<strong>CONCLUÍDO:</strong> Cobertura final |C| = ${cLen} (|A| = ${matchedEdges.length}). Cobertura ótima exata |C*| = ${optLen}. Razão de aproximação atingida: ${r} ≤ 2.0!`);
      }
    }

    function runVcAll() {
      while (activeEdges.length > 0) {
        stepVc();
      }
    }

    function runVcGreedy() {
      // Heurística Gulosa: escolhe vértice de maior grau residual
      resetVc();
      const g = graphs[currentGraphKey];
      let curEdges = g.edges.map(e => [...e]);
      const gCover = new Set();
      let stepG = 0;

      while (curEdges.length > 0) {
        stepG++;
        // Calcula graus residuais
        const deg = {};
        for (const [u, v] of curEdges) {
          deg[u] = (deg[u] || 0) + 1;
          deg[v] = (deg[v] || 0) + 1;
        }
        let maxNode = null;
        let maxDeg = -1;
        for (const [node, d] of Object.entries(deg)) {
          if (d > maxDeg) {
            maxDeg = d;
            maxNode = node;
          }
        }
        if (!maxNode) break;

        gCover.add(maxNode);
        curEdges = curEdges.filter(([u, v]) => u !== maxNode && v !== maxNode);
      }

      coverNodes = gCover;
      matchedEdges = []; // Guloso não forma emparelhamento maximal de 2 em 2
      discardedEdges = g.edges.map(e => [...e]);
      activeEdges = [];

      const r = (gCover.size / exactOptCover.length).toFixed(2);
      updateVcUI(`<strong>Heurística Gulosa de Maior Grau:</strong> Selecionou ${gCover.size} vértices: {${Array.from(gCover).join(", ")}}. Ótimo |C*| = ${exactOptCover.length}. Razão = ${r}.`);
    }

    // Eventos da Aba 1
    const selectGraph = document.getElementById("m16-vc-graph-select");
    if (selectGraph) {
      selectGraph.addEventListener("change", (e) => {
        currentGraphKey = e.target.value;
        resetVc();
      });
    }
    const btnVcStep = document.getElementById("m16-vc-step-btn");
    const btnVcRun = document.getElementById("m16-vc-run-btn");
    const btnVcGreedy = document.getElementById("m16-vc-greedy-btn");
    const btnVcReset = document.getElementById("m16-vc-reset-btn");

    if (btnVcStep) btnVcStep.addEventListener("click", stepVc);
    if (btnVcRun) btnVcRun.addEventListener("click", runVcAll);
    if (btnVcGreedy) btnVcGreedy.addEventListener("click", runVcGreedy);
    if (btnVcReset) btnVcReset.addEventListener("click", resetVc);

    resetVc();

    // =============================================================
    // ABA 2: SIMULADOR DE FPTAS SOMA DE SUBCONJUNTOS
    // =============================================================
    const ssPresets = {
      clrs: {
        S: [104, 102, 201, 101],
        t: 308,
        eps: 0.40
      },
      small: {
        S: [15, 22, 14, 26, 32, 9],
        t: 53,
        eps: 0.20
      }
    };

    let ssS = [104, 102, 201, 101];
    let ssT = 308;
    let ssEps = 0.40;
    let ssDelta = 0.05;
    let ssStep = 0; // iteração 0 a n
    let ssHistory = []; // { i, x_i, unprunedSize, mergedSize, Li, trimmedOut }
    let ssOptimalExact = null;

    function exactSubsetSum(S, t) {
      // Computa ótimo exato via conjunto de somas
      let sums = new Set([0]);
      for (const x of S) {
        const nextSums = new Set(sums);
        for (const s of sums) {
          if (s + x <= t) nextSums.add(s + x);
        }
        sums = nextSums;
      }
      let best = 0;
      for (const s of sums) {
        if (s > best) best = s;
      }
      return best;
    }

    function trimList(L, delta) {
      // L deve estar ordenado
      if (L.length === 0) return { trimmed: [], discarded: [] };
      const trimmed = [L[0]];
      const discarded = [];
      let last = L[0];

      for (let i = 1; i < L.length; i++) {
        const y = L[i];
        if (y > last * (1 + delta)) {
          trimmed.push(y);
          last = y;
        } else {
          discarded.push({ val: y, rep: last });
        }
      }
      return { trimmed, discarded };
    }

    function resetSs() {
      const n = ssS.length;
      ssDelta = ssEps / (2 * n);
      ssStep = 0;
      ssHistory = [{
        i: 0,
        x_i: "-",
        unprunedSize: 1,
        mergedSize: 1,
        Li: [0],
        trimmedOut: []
      }];
      ssOptimalExact = exactSubsetSum(ssS, ssT);
      updateSsUI("Instância carregada. L₀ = ⟨0⟩. Pronto para executar iteração 1.");
    }

    function stepSs() {
      const n = ssS.length;
      if (ssStep >= n) {
        updateSsUI("Execução já concluída para todas as n iterações!");
        return;
      }

      ssStep++;
      const xi = ssS[ssStep - 1];
      const prevLi = ssHistory[ssStep - 1].Li;

      // 1. Gera L_{i-1} + xi
      const shifted = prevLi.map(v => v + xi);

      // 2. Intercala e remove duplicados (Merge-Lists)
      const mergedSet = new Set([...prevLi, ...shifted]);
      const merged = Array.from(mergedSet).sort((a, b) => a - b);

      // 3. Poda geométrica TRIM(L, δ)
      const { trimmed, discarded } = trimList(merged, ssDelta);

      // 4. Remove elementos maiores que t
      const finalLi = trimmed.filter(v => v <= ssT);
      const greaterThanT = trimmed.filter(v => v > ssT);

      ssHistory.push({
        i: ssStep,
        x_i: xi,
        unprunedSize: Math.pow(2, ssStep),
        mergedSize: merged.length,
        Li: finalLi,
        trimmedOut: discarded,
        greaterThanT
      });

      const discStr = discarded.length > 0 ? discarded.map(d => `${d.val} (rep. por ${d.rep})`).join(", ") : "nenhum";
      const gtStr = greaterThanT.length > 0 ? greaterThanT.join(", ") : "nenhum";

      const msg = `Iteração i = ${ssStep} (elemento x_{${ssStep}} = ${xi}): ` +
        `Merge gerou ${merged.length} valores. ` +
        `TRIM(δ=${ssDelta.toFixed(4)}) descartou ${discarded.length} elementos [${discStr}]. ` +
        `Descartados > t (${ssT}): [${gtStr}]. ` +
        `Lista resultante L_{${ssStep}} retém ${finalLi.length} valores: ⟨${finalLi.join(", ")}⟩.`;

      updateSsUI(msg);

      if (ssStep === n) {
        const zStar = finalLi[finalLi.length - 1];
        const yOpt = ssOptimalExact;
        const ratio = (yOpt / zStar).toFixed(4);
        const errPct = (((yOpt - zStar) / yOpt) * 100).toFixed(2);
        updateSsUI(`<strong>CONCLUÍDO:</strong> Solução aproximada z* = ${zStar}. Solução ótima exata y* = ${yOpt}. ` +
          `Razão y*/z* = ${ratio} ≤ ${(1 + ssEps).toFixed(4)} (1 + ε). Erro real: ${errPct}% (bem abaixo do limite garantido de ${(ssEps * 100).toFixed(1)}%)!`);
      }
    }

    function runSsAll() {
      const n = ssS.length;
      while (ssStep < n) {
        stepSs();
      }
    }

    function updateSsUI(logMsg) {
      const deltaEl = document.getElementById("m16-ss-delta");
      const zStarEl = document.getElementById("m16-ss-z-star");
      const zInfoEl = document.getElementById("m16-ss-z-info");
      const yOptEl = document.getElementById("m16-ss-y-opt");
      const ratioEl = document.getElementById("m16-ss-ratio");
      const errorEl = document.getElementById("m16-ss-error");
      const tableBody = document.getElementById("m16-ss-table-body");
      const detailEl = document.getElementById("m16-ss-detail");

      if (deltaEl) deltaEl.textContent = ssDelta.toFixed(4);
      if (yOptEl) yOptEl.textContent = ssOptimalExact;

      const lastHist = ssHistory[ssHistory.length - 1];
      const currentMax = lastHist.Li[lastHist.Li.length - 1];

      if (zStarEl) zStarEl.textContent = currentMax !== undefined ? currentMax : "-";

      if (ssStep === ssS.length && currentMax > 0 && ssOptimalExact > 0) {
        const r = (ssOptimalExact / currentMax).toFixed(4);
        const err = (((ssOptimalExact - currentMax) / ssOptimalExact) * 100).toFixed(2);
        if (ratioEl) {
          ratioEl.textContent = `${r} ≤ ${(1 + ssEps).toFixed(2)}`;
          ratioEl.style.color = Number(r) <= (1 + ssEps) ? "#34d399" : "#ef4444";
        }
        if (errorEl) errorEl.textContent = `Erro real: ${err}% (cota: ${(ssEps * 100).toFixed(0)}%)`;
      } else {
        if (ratioEl) ratioEl.textContent = "-";
        if (errorEl) errorEl.textContent = `Cota teórica: ≤ ${(1 + ssEps).toFixed(2)}`;
      }

      if (tableBody) {
        let rowsHtml = "";
        for (const item of ssHistory) {
          rowsHtml += `
            <tr style="border-bottom: 1px solid #334155;">
              <td style="padding: 6px; font-weight: bold; color: #60a5fa;">${item.i}</td>
              <td style="padding: 6px;">${item.x_i}</td>
              <td style="padding: 6px; color: #f87171;">${item.unprunedSize}</td>
              <td style="padding: 6px; font-weight: bold; color: #34d399;">${item.Li.length}</td>
              <td style="padding: 6px; font-family: monospace; font-size: 0.8rem; word-break: break-all;">⟨${item.Li.join(", ")}⟩</td>
            </tr>
          `;
        }
        tableBody.innerHTML = rowsHtml;
      }

      if (detailEl && logMsg) {
        detailEl.innerHTML = `<div>${logMsg}</div>`;
      }
    }

    // Eventos Aba 2
    const presetSs = document.getElementById("m16-ss-preset-select");
    const inputS = document.getElementById("m16-ss-input-s");
    const inputT = document.getElementById("m16-ss-input-t");
    const inputEps = document.getElementById("m16-ss-input-eps");
    const btnSsApply = document.getElementById("m16-ss-apply-btn");
    const btnSsStep = document.getElementById("m16-ss-step-btn");
    const btnSsRun = document.getElementById("m16-ss-run-btn");
    const btnSsReset = document.getElementById("m16-ss-reset-btn");

    if (presetSs) {
      presetSs.addEventListener("change", (e) => {
        const val = e.target.value;
        if (val !== "custom" && ssPresets[val]) {
          const p = ssPresets[val];
          ssS = [...p.S];
          ssT = p.t;
          ssEps = p.eps;
          if (inputS) inputS.value = ssS.join(", ");
          if (inputT) inputT.value = ssT;
          if (inputEps) inputEps.value = ssEps;
          resetSs();
        }
      });
    }

    if (btnSsApply) {
      btnSsApply.addEventListener("click", () => {
        if (inputS && inputT && inputEps) {
          const sArr = inputS.value.split(",").map(v => parseInt(v.trim(), 10)).filter(v => !isNaN(v) && v > 0);
          const tVal = parseInt(inputT.value, 10);
          const epsVal = parseFloat(inputEps.value);
          if (sArr.length > 0 && !isNaN(tVal) && tVal > 0 && !isNaN(epsVal) && epsVal > 0 && epsVal <= 1) {
            ssS = sArr;
            ssT = tVal;
            ssEps = epsVal;
            resetSs();
          } else {
            alert("Por favor, forneça valores válidos: inteiros positivos para S e t, e 0 < ε ≤ 1.");
          }
        }
      });
    }

    if (btnSsStep) btnSsStep.addEventListener("click", stepSs);
    if (btnSsRun) btnSsRun.addEventListener("click", runSsAll);
    if (btnSsReset) btnSsReset.addEventListener("click", resetSs);

    resetSs();
  }

const quizzes = [
    {
      id: "q16-1",
      type: "Múltipla Escolha",
      reference: "Cap. 34, Seção 34.1 (pp. 848–854)",
      question:
        "Sobre a formalização de problemas de decisão, codificações binárias concisas e a definição da classe P, qual das seguintes afirmações expressa CORRETAMENTE os princípios demonstrados no CLRS?",
      options: [
        {
          letter: "A",
          text: "Pelo Lema 34.1, a pertinência de um problema à classe P independe de qualquer codificação, de modo que mesmo a codificação unária é polinomialmente equivalente à representação binária padrão.",
          isCorrect: false,
          explanation:
            "Incorreta. A representação unária de um inteiro k possui tamanho n = k, enquanto a binária possui tamanho n = ⌊lg k⌋ + 1. Elas não são polinomialmente relacionadas (uma conversão exigiria tempo exponencial 2^n), e a codificação unária transformaria falsamente algoritmos exponenciais em pseudopolinomiais."
        },
        {
          letter: "B",
          text: "A classe P é definida como o conjunto de linguagens decididas em tempo polinomial por algoritmos determinísticos e, pelo Teorema 34.2, coincide exatamente com a classe de linguagens aceitas em tempo polinomial, pois qualquer aceitador de tempo O(n^k) pode ser simulado com um temporizador de c·n^k passos que rejeita forçadamente se a aceitação não ocorrer no prazo.",
          isCorrect: true,
          explanation:
            "Correta! Pelo Teorema 34.2 (p. 854), a simulação com contador de passos limita a execução e converte um aceitador polinomial em um decisor polinomial com sobrecarga assintótica constante."
        },
        {
          letter: "C",
          text: "Um problema de otimização de minimização jamais pode ser resolvido em tempo polinomial caso sua contrapartida de decisão pertença a P, pois determinar o valor ótimo exige explorar um número infinito de limites k.",
          isCorrect: false,
          explanation:
            "Incorreta. Pela Seção 34.1 (p. 850), podemos encontrar o valor ótimo exato aplicando busca binária sobre o intervalo de custos com apenas O(lg(custo máximo)) chamadas ao problema de decisão."
        },
        {
          letter: "D",
          text: "A classe P não é fechada sob a operação de complemento, o que impede que qualquer linguagem cujo complemento esteja em P seja resolvida em tempo polinomial.",
          isCorrect: false,
          explanation:
            "Incorreta. Pelo Exercício 34.1-6, a classe P é estritamente fechada sob complemento, união, interseção, concatenação e estrela de Kleene (basta inverter o bit de saída 0 ↔ 1 do decisor determinístico)."
        }
      ]
    },
    {
      id: "q16-2",
      type: "Múltipla Escolha",
      reference: "Cap. 34, Seção 34.2 (pp. 855–862)",
      question:
        "Considere a definição da classe NP baseada em algoritmos de verificação A(x, y) com certificados polinomiais y, e a relação com a classe co-NP. Qual afirmação está CORRETA?",
      options: [
        {
          letter: "A",
          text: "Uma linguagem L pertence a NP se e somente se para toda cadeia x ∉ L existe um certificado polinomial y que faz o algoritmo de verificação retornar A(x, y) = 1.",
          isCorrect: false,
          explanation:
            "Incorreta. Para x ∉ L, é terminantemente proibido que exista qualquer certificado que faça A(x, y) = 1. A existência de certificado positivo só ocorre para instâncias afirmativas x ∈ L."
        },
        {
          letter: "B",
          text: "Se L pertence a P, então L pertence a NP, pois um algoritmo decisor polinomial para L pode atuar como um verificador de dois argumentos que simplesmente ignora o certificado y; além disso, a classe co-NP consiste nas linguagens cujos complementos estão em NP, sendo P ⊆ (NP ∩ co-NP).",
          isCorrect: true,
          explanation:
            "Correta! Pela Seção 34.2 (pp. 857–859), todo problema em P é verificável ignorando-se o certificado (logo P ⊆ NP), e como P é fechada sob complemento, P ⊆ co-NP, estabelecendo que P ⊆ (NP ∩ co-NP)."
        },
        {
          letter: "C",
          text: "O problema HAM-CYCLE pertence a P porque podemos verificar em tempo polinomial se uma permutação proposta dos vértices é um ciclo hamiltoniano.",
          isCorrect: false,
          explanation:
            "Incorreta. A verificação polinomial com certificado prova apenas que HAM-CYCLE ∈ NP. Não se conhece nenhum algoritmo para decidir HAM-CYCLE em tempo polinomial do zero; de fato, HAM-CYCLE é NP-completo."
        },
        {
          letter: "D",
          text: "Já foi matematicamente demonstrado que NP = co-NP, o que prova conclusivamente que P = NP.",
          isCorrect: false,
          explanation:
            "Incorreta. A igualdade NP = co-NP permanece um problema aberto fundamental. A maioria dos pesquisadores conjectura que NP ≠ co-NP e que P ≠ NP."
        }
      ]
    },
    {
      id: "q16-3",
      type: "Múltipla Escolha",
      reference: "Cap. 34, Seção 34.3 (pp. 862–865)",
      question:
        "Sobre a redutibilidade de Karp em tempo polinomial (L₁ ≤_P L₂) e as definições de linguagens NP-difíceis e NP-completas, assinale a alternativa CORRETA:",
      options: [
        {
          letter: "A",
          text: "Se L₁ ≤_P L₂ e sabemos que L₁ ∈ P, podemos concluir imediatamente pelo Lema 34.3 que L₂ ∈ P.",
          isCorrect: false,
          explanation:
            "Incorreta. A implicação do Lema 34.3 é na direção oposta: se L₁ ≤_P L₂ e L₂ ∈ P, então L₁ ∈ P. Saber que o problema mais fácil (L₁) está em P não impõe restrição de facilidade sobre L₂."
        },
        {
          letter: "B",
          text: "Para provar que uma linguagem L é NP-completa, basta mostrar que L é NP-difícil, sendo desnecessário demonstrar que L ∈ NP.",
          isCorrect: false,
          explanation:
            "Incorreta. Por definição (p. 865), uma linguagem só é NP-completa se cumprir DUAS condições: (1) L ∈ NP e (2) L é NP-difícil. O problema da parada, por exemplo, é NP-difícil, mas não pertence a NP."
        },
        {
          letter: "C",
          text: "Uma redução de Karp exige que x ∈ L₁ ⟺ f(x) ∈ L₂ com f computável em tempo polinomial; a relação ≤_P é transitiva e, se L' é consagrado como NP-completo e provamos que L' ≤_P L com L ∈ NP, então L é NP-completo (Lema 34.4).",
          isCorrect: true,
          explanation:
            "Correta! Pelo Lema 34.4 (p. 866), a transitividade de ≤_P permite transferir a NP-dificuldade de L' para L sem precisar reduzir todas as infinitas linguagens de NP novamente."
        },
        {
          letter: "D",
          text: "Se um problema NP-completo for resolvido em tempo superpolinomial, isso provará imediatamente que P = NP.",
          isCorrect: false,
          explanation:
            "Incorreta. Todos os problemas NP-completos já podem ser resolvidos em tempo superpolinomial (exponencial, 2^O(n^c)). O que provaria P = NP seria encontrar um algoritmo de tempo POLINOMIAL para qualquer um deles."
        }
      ]
    },
    {
      id: "q16-4",
      type: "Múltipla Escolha",
      reference: "Cap. 34, Seção 34.3 (pp. 866–875)",
      question:
        "Na demonstração do Teorema de Cook-Levin (Teorema 34.7) de que CIRCUIT-SAT é NP-completo, qual é o princípio arquitetural que permite construir o circuito combinacional booleano C a partir do verificador A(x, y)?",
      options: [
        {
          letter: "A",
          text: "O circuito C é construído ligando em cascata T(n) réplicas do circuito combinacional M que implementa a CPU, onde cada estágio mapeia a configuração c_i para c_{i+1}, soldando-se os bits conhecidos de A, x e PC, e deixando livres apenas as entradas correspondentes ao certificado y.",
          isCorrect: true,
          explanation:
            "Correta! Pela Seção 34.3 (pp. 870–873), a CPU é um circuito combinacional M de tamanho polinomial. Colando T(n) cópias de M, o circuito resultante tem tamanho O(T(n)·|M|) = O(n^{2k}), e suas únicas entradas livres são os bits do certificado y."
        },
        {
          letter: "B",
          text: "O circuito C utiliza portas lógicas com atrasos variáveis que permitem laços de retroalimentação cíclicos, simulando loops infinitos da máquina de Turing.",
          isCorrect: false,
          explanation:
            "Incorreta. Circuitos combinacionais booleanos são estritamente acíclicos (DAGs) e não contêm nenhum laço de retroalimentação temporal."
        },
        {
          letter: "C",
          text: "O circuito C possui tamanho exponencial O(2^n) para testar todas as atribuições em paralelo antes de gerar a resposta.",
          isCorrect: false,
          explanation:
            "Incorreta. O circuito C tem tamanho polinomial em n. Se tivesse tamanho exponencial, o algoritmo de redução F não seria de tempo polinomial."
        },
        {
          letter: "D",
          text: "O teorema de Cook-Levin reduz o problema do ciclo hamiltoniano a CIRCUIT-SAT, provando a NP-completude por herança de grafos.",
          isCorrect: false,
          explanation:
            "Incorreta. CIRCUIT-SAT é o primeiro problema provado NP-completo a partir dos primeiros princípios (simulação da computação), e não a partir de reduções de grafos."
        }
      ]
    },
    {
      id: "q16-5",
      type: "Múltipla Escolha",
      reference: "Cap. 34, Seção 34.4 (pp. 875–885)",
      question:
        "Nas reduções CIRCUIT-SAT ≤_P SAT e SAT ≤_P 3-CNF-SAT, como Cormen et al. garantem que as fórmulas geradas permanecem de tamanho polinomial e satisfazem a restrição de 3 literais por cláusula?",
        options: [
        {
          letter: "A",
          text: "Para CIRCUIT-SAT ≤_P SAT, expande-se a tabela verdade completa do circuito com 2^k linhas; para 3-CNF-SAT, eliminam-se todas as cláusulas que possuem mais de 3 variáveis sem adicionar literais.",
          isCorrect: false,
          explanation:
            "Incorreta. Uma tabela verdade global do circuito teria 2^k linhas (exponencial). Em vez disso, atribui-se uma variável a CADA FIO e cláusulas locais para cada porta individual."
        },
        {
          letter: "B",
          text: "Para cada fio do circuito cria-se uma variável booleana, gerando cláusulas de equivalência lógica para cada porta em tempo linear; na conversão para 3-CNF, cláusulas com mais de 3 literais são decompostas em cadeia com variáveis auxiliares (ex.: (l₁ ∨ l₂ ∨ p₁) ∧ (¬p₁ ∨ l₃ ∨ p₂) ...).",
          isCorrect: true,
          explanation:
            "Correta! Pela Seção 34.4 (pp. 876–883), a árvore sintática introduz variáveis auxiliares que particionam expressões lógicas complexas sem provocar explosão combinatória."
        },
        {
          letter: "C",
          text: "O problema SAT é reduzido a 2-CNF-SAT, que é então resolvido em tempo linear e convertido para 3-CNF adicionando literais verdadeiros constantes.",
          isCorrect: false,
          explanation:
            "Incorreta. 2-CNF-SAT pertence a P. Se SAT pudesse ser reduzido a 2-CNF-SAT, teríamos provado P = NP!"
        },
        {
          letter: "D",
          text: "A redução de SAT para 3-CNF-SAT não preserva a satisfatibilidade, sendo apenas uma aproximação heurística.",
          isCorrect: false,
          explanation:
            "Incorreta. É uma redução exata de Karp: a fórmula 3-CNF é satisfazível se e somente se a fórmula SAT original é satisfazível."
        }
      ]
    },
    {
      id: "q16-6",
      type: "Múltipla Escolha",
      reference: "Cap. 34, Seção 34.5 (pp. 886–890)",
      question:
        "Na redução canônica de 3-CNF-SAT para CLIQUE (Teorema 34.11) e de CLIQUE para VERTEX-COVER (Teorema 34.12), quais são as propriedades geométricas e combinatórias essenciais utilizadas?",
      options: [
        {
          letter: "A",
          text: "Em 3-CNF-SAT ≤_P CLIQUE, conectam-se vértices da mesma cláusula; em CLIQUE ≤_P VERTEX-COVER, inverte-se a direção de todas as arestas dirigidas.",
          isCorrect: false,
          explanation:
            "Incorreta. Em 3-CNF-SAT ≤_P CLIQUE, NÃO há arestas entre vértices da mesma cláusula (tríade). E em CLIQUE ≤_P VERTEX-COVER, os grafos são NÃO DIRIGIDOS e a transformação utiliza o grafo complemento Ḡ."
        },
        {
          letter: "B",
          text: "Em 3-CNF-SAT ≤_P CLIQUE, cria-se uma tríade de vértices para cada cláusula com arestas entre literais consistentes de cláusulas distintas, buscando clique de tamanho k; em CLIQUE ≤_P VERTEX-COVER, constrói-se o grafo complemento Ḡ, onde V' é clique em G se e somente se V - V' é cobertura de vértices em Ḡ com tamanho |V| - k.",
          isCorrect: true,
          explanation:
            "Correta! Pela Seção 34.5 (pp. 886–890), todo par em V' tem aresta em G ⟺ nenhum par em V' tem aresta em Ḡ ⟺ toda aresta de Ḡ tem pelo menos uma ponta fora de V' (em V - V')."
        },
        {
          letter: "C",
          text: "Uma cobertura de vértices em G é exatamente idêntica a um clique em G, dispensando a construção do grafo complemento.",
          isCorrect: false,
          explanation:
            "Incorreta. Um clique é um subgrafo densamente conectado (completo), enquanto uma cobertura de vértices é um conjunto que toca todas as arestas. Eles são complementares no grafo complemento Ḡ."
        },
        {
          letter: "D",
          text: "A redução de CLIQUE para VERTEX-COVER requer tempo exponencial para calcular todas as permutações de arestas de Ḡ.",
          isCorrect: false,
          explanation:
            "Incorreta. O grafo complemento Ḡ = (V, V×V - E) é computado trivialmente inspecionando cada par de vértices em tempo O(V^2), perfeitamente polinomial."
        }
      ]
    },
    {
      id: "q16-7",
      type: "Múltipla Escolha",
      reference: "Cap. 34, Seção 34.5 (pp. 890–902)",
      question:
        "Na redução de 3-CNF-SAT para SUBSET-SUM (Teorema 34.15), por que os números inteiros são representados na base 10 e qual é o papel dos números de folga (slack numbers)?",
      options: [
        {
          letter: "A",
          text: "A base 10 é escolhida porque a soma máxima de dígitos em qualquer coluna de cláusula é 6 (três 1s dos literais e 1+2 das folgas), o que impede totalmente a ocorrência de transportes (carries) entre colunas; os números de folga s_j e s'_j permitem complementar a soma da cláusula até exatamente 4 se pelo menos um literal for satisfeito.",
          isCorrect: true,
          explanation:
            "Correta! Pela Seção 34.5.5 (pp. 898–902), a ausência de transporte garante que cada coluna funcione como uma equação booleana independente, e as folgas 1 e 2 somam 0, 1, 2 ou 3 para atingir a meta 4."
        },
        {
          letter: "B",
          text: "A base 10 é obrigatória porque números na base 2 não podem ser verificados em tempo polinomial pela máquina de Turing.",
          isCorrect: false,
          explanation:
            "Incorreta. Qualquer base b ≥ 7 funcionaria para impedir transportes. A base 10 é usada por clareza didática. A representação binária é a codificação padrão perfeitamente polinomial."
        },
        {
          letter: "C",
          text: "Os números de folga s_j e s'_j são necessários para transportar o excesso de dígitos das cláusulas insatisfeitas para as colunas de variáveis.",
          isCorrect: false,
          explanation:
            "Incorreta. O objetivo central é exatamente NÃO ter transportes entre colunas, isolando as restrições de cada cláusula e de cada variável."
        },
        {
          letter: "D",
          text: "O alvo t é definido com dígitos 0 em todas as posições para que a soma seja nula.",
          isCorrect: false,
          explanation:
            "Incorreta. O alvo t possui o dígito 1 em cada coluna de variável e o dígito 4 em cada coluna de cláusula (ex.: t = 111...444...)."
        }
      ]
    },
    {
      id: "q16-8",
      type: "Múltipla Escolha",
      reference: "Cap. 35, Seção 35.1 (pp. 899–904)",
      question:
        "Em relação ao algoritmo APPROX-VERTEX-COVER e à análise de algoritmos de aproximação, assinale a alternativa que descreve CORRETAMENTE o Teorema 35.1 e o comportamento da heurística gulosa de maior grau:",
      options: [
        {
          letter: "A",
          text: "O conjunto de arestas A selecionado por APPROX-VERTEX-COVER é um emparelhamento maximal de arestas; como cada aresta de A exige pelo menos um vértice na cobertura ótima (|C*| ≥ |A|) e o algoritmo inclui ambos os extremos (|C| = 2|A|), temos |C| ≤ 2|C*|; enquanto a heurística gulosa por maior grau pode atingir razão Θ(lg |V|).",
          isCorrect: true,
          explanation:
            "Correta! Pelo Teorema 35.1 e Exercício 35.1-3 (pp. 900–903), APPROX-VERTEX-COVER garante razão estrita 2 em tempo linear O(V + E), superando a heurística gulosa em instâncias patológicas."
        },
        {
          letter: "B",
          text: "APPROX-VERTEX-COVER devolve sempre uma cobertura ótima exata |C| = |C*| para qualquer grafo planar.",
          isCorrect: false,
          explanation:
            "Incorreta. Mesmo em grafos planares simples (como o ciclo C_6 ou o exemplo da Fig. 35.1), o algoritmo pode devolver uma cobertura com o dobro do tamanho ótimo."
        },
        {
          letter: "C",
          text: "A razão de aproximação de APPROX-VERTEX-COVER é O(V^2), pois o emparelhamento pode conter todas as arestas do grafo completo.",
          isCorrect: false,
          explanation:
            "Incorreta. A razão de aproximação é uma constante fixa igual a 2 (ρ = 2), independente do número de vértices ou arestas do grafo."
        },
        {
          letter: "D",
          text: "A heurística gulosa que escolhe vértices de maior grau sempre obtém razão de aproximação de 1.5, sendo comprovadamente superior a APPROX-VERTEX-COVER.",
          isCorrect: false,
          explanation:
            "Incorreta. Como demonstrado no Exercício 35.1-3, a heurística gulosa pode ser ludibriada por estruturas harmônicas e atingir razão Ω(lg |V|)."
        }
      ]
    },
    {
      id: "q16-9",
      type: "Múltipla Escolha",
      reference: "Cap. 35, Seção 35.2 (pp. 904–911)",
      question:
        "Considere o Problema do Caixeiro-Viajante (TSP) com e sem a desigualdade triangular. Qual das afirmações abaixo expressa CORRETAMENTE os Teoremas 35.2 e 35.3?",
      options: [
        {
          letter: "A",
          text: "Se os custos satisfazem a desigualdade triangular, APPROX-TSP-TOUR atinge razão 2 porque c(T) < c(H*), a caminhada completa dobra as arestas da MST (c(W) = 2c(T)), e atalhos nunca aumentam o custo; já para o TSP geral, se P ≠ NP, não existe algoritmo com razão de aproximação constante ρ ≥ 1 para nenhuma constante ρ.",
          isCorrect: true,
          explanation:
            "Correta! O Teorema 35.2 (p. 906) prova a 2-aproximação métrica via MST e atalhos triangulares, enquanto o Teorema 35.3 (p. 909) prova a inaproximabilidade absoluta do TSP geral reduzindo HAM-CYCLE com arestas de peso ρ|V| + 1."
        },
        {
          letter: "B",
          text: "APPROX-TSP-TOUR garante razão de aproximação 1.5 para qualquer grafo, mesmo que os pesos das arestas violem a desigualdade triangular.",
          isCorrect: false,
          explanation:
            "Incorreta. A garantia do Teorema 35.2 é estritamente 2 (não 1.5) e depende indispensavelmente da desigualdade triangular para que os atalhos não encareçam o percurso."
        },
        {
          letter: "C",
          text: "O Teorema 35.3 demonstra que existe um algoritmo com razão de aproximação ρ = 100 para o TSP geral executável em tempo linear.",
          isCorrect: false,
          explanation:
            "Incorreta. O Teorema 35.3 prova que NÃO EXISTE algoritmo com razão ρ para NENHUMA constante ρ ≥ 1 para o TSP geral, a menos que P = NP."
        },
        {
          letter: "D",
          text: "No TSP com desigualdade triangular, o custo da árvore geradora mínima T é sempre estritamente maior que o custo do ciclo hamiltoniano ótimo H*.",
          isCorrect: false,
          explanation:
            "Incorreta. Removendo uma aresta de H* obtemos uma árvore geradora, portanto c(T) ≤ c(H* - e) < c(H*). A MST é estritamente mais barata que o ciclo ótimo."
        }
      ]
    },
    {
      id: "q16-10",
      type: "Múltipla Escolha",
      reference: "Cap. 35, Seções 35.3, 35.4 e 35.5 (pp. 911–928)",
      question:
        "Sobre esquemas de aproximação (PTAS e FPTAS), o algoritmo aleatorizado para MAX-3-CNF e o procedimento APPROX-SUBSET-SUM, qual afirmação é VERDADEIRA?",
      options: [
        {
          letter: "A",
          text: "Em MAX-3-CNF, um sorteio uniforme independente das variáveis satisfaz em esperança exatamente 1/2 das cláusulas, pois cada literal tem chance 1/2.",
          isCorrect: false,
          explanation:
            "Incorreta. Cada cláusula possui 3 literais distintos e só falha se os três forem falsos simultaneamente ((1/2)^3 = 1/8). Logo, a probabilidade de satisfação é 1 - 1/8 = 7/8 (Teorema 35.6)."
        },
        {
          letter: "B",
          text: "Um esquema PTAS possui complexidade sempre limitada por um polinômio em 1/ε, enquanto um FPTAS pode ter complexidade exponencial em 1/ε.",
          isCorrect: false,
          explanation:
            "Incorreta. É exatamente o oposto: o FPTAS é que exige dependência estritamente polinomial em 1/ε (O((1/ε)^c n^d)), enquanto um PTAS genérico permite dependência exponencial como O(n^{2/ε})."
        },
        {
          letter: "C",
          text: "APPROX-SUBSET-SUM é um FPTAS com razão 1 + ε e tempo O((n² ln t) / ε), pois a poda TRIM(L, δ) com δ = ε / (2n) garante erro acumulado (1 + δ)^n ≤ 1 + ε e mantém o tamanho de cada lista limitado por O((n ln t) / ε).",
          isCorrect: true,
          explanation:
            "Correta! Pelo Teorema 35.8 (pp. 926–928), o espaçamento geométrico (1+δ) limita o comprimento de L_i a O((n ln t)/ε), garantindo que as n iterações executem em tempo totalmente polinomial O((n² ln t)/ε)."
        },
        {
          letter: "D",
          text: "GREEDY-SET-COVER garante razão de aproximação constante de 2 para qualquer família de conjuntos, independente do número de elementos de X.",
          isCorrect: false,
          explanation:
            "Incorreta. Pelo Teorema 35.4 (p. 913), a razão de aproximação de GREEDY-SET-COVER é harmônica: H(max |S|) ≤ ln |X| + 1, crescendo logaritmicamente com o tamanho do universo."
        }
      ]
    }
  ];

const exercicios = [
    {
      id: "ex16-1",
      code: "EXERCÍCIO 01 • EQUIVALÊNCIA POLINOMIAL ENTRE OTIMIZAÇÃO E DECISÃO",
      reference: "Exercício 34.1-1 (p. 854)",
      title: "Relação Formal entre LONGEST-PATH e LONGEST-PATH-LENGTH via Busca Binária",
      prompt: `
        <p>Defina o problema de otimização <strong>LONGEST-PATH-LENGTH</strong> como a relação que associa cada instância $\\langle G, u, v \\rangle$ (onde $G = (V, E)$ é um grafo não dirigido e $u, v \\in V$) ao número de arestas em um caminho simples de comprimento máximo entre $u$ e $v$. Defina o problema de decisão correspondente:</p>
        $$\\text{LONGEST-PATH} = \\{\\langle G, u, v, k \\rangle : G = (V, E) \\text{ é não dirigido}, u, v \\in V, k \\ge 0 \\text{ inteiro, e existe caminho simples de } u \\text{ a } v \\text{ com } \\ge k \\text{ arestas}\\}.$$
        <p>Mostre que o problema de otimização <strong>LONGEST-PATH-LENGTH</strong> pode ser resolvido em tempo polinomial se e somente se $\\text{LONGEST-PATH} \\in \\text{P}$.</p>
      `,
      placeholder:
        "Para a direção direta (⇒), se temos o comprimento ótimo k*, basta testar se k* ≥ k; para a recíproca (⇐), execute uma busca binária sobre o intervalo [0, |V| - 1] fazendo consultas a LONGEST-PATH...",
      solution: `
        <h4>1. Direção Direta ($\\implies$): Otimização Polinomial $\\implies$ Decisão em P</h4>
        <p>Suponha que exista um algoritmo $A_{\\text{opt}}$ que resolve $\\text{LONGEST-PATH-LENGTH}$ no tempo $O(n^c)$ para alguma constante $c$, devolvendo o comprimento máximo $k^*$ de um caminho simples entre $u$ e $v$ em $G$.</p>
        <p>Para decidir se $\\langle G, u, v, k \\rangle \\in \\text{LONGEST-PATH}$, projetamos o algoritmo $A_{\\text{dec}}$:</p>
        <ol>
          <li>Executa $k^* = A_{\\text{opt}}(G, u, v)$ em tempo $O(n^c)$;</li>
          <li>Se $k^* \\ge k$, retorna 1 (SIM); caso contrário, retorna 0 (NÃO).</li>
        </ol>
        <p>A comparação consome tempo $O(1)$. Logo, o tempo total é $O(n^c)$, provando que $\\text{LONGEST-PATH} \\in \\text{P}$.</p>

        <h4>2. Direção Recíproca ($\\impliedby$): Decisão em P $\\implies$ Otimização Polinomial</h4>
        <p>Suponha agora que $\\text{LONGEST-PATH} \\in \\text{P}$, isto é, existe um algoritmo de decisão $A_{\\text{dec}}$ que responde se existe caminho simples com $\\ge k$ arestas em tempo $O(n^d)$.</p>
        <p>Em qualquer grafo $G = (V, E)$, um caminho simples não pode conter vértices repetidos, logo o número de arestas de qualquer caminho simples é um inteiro no intervalo limitado:</p>
        $$0 \\le k \\le |V| - 1.$$
        <p>Podemos determinar o valor exato de $k^*$ através de uma <strong>busca binária</strong> sobre o intervalo $[\\text{low}, \\text{high}] = [0, |V| - 1]$:</p>
        <ol>
          <li>Inicialize $\\text{low} = 0$, $\\text{high} = |V| - 1$ e $\\text{melhor} = -1$ (ou 0 se $u = v$).</li>
          <li>Enquanto $\\text{low} \\le \\text{high}$:
            <br>a. Seja $\\text{mid} = \\lfloor (\\text{low} + \\text{high}) / 2 \\rfloor$.
            <br>b. Execute $A_{\\text{dec}}(\\langle G, u, v, \\text{mid} \\rangle)$.
            <br>c. Se a resposta for 1 (existe caminho com $\\ge \\text{mid}$ arestas): atualize $\\text{melhor} = \\text{mid}$ e faça $\\text{low} = \\text{mid} + 1$ (tenta encontrar caminhos ainda mais longos).
            <br>d. Se a resposta for 0: faça $\\text{high} = \\text{mid} - 1$ (o comprimento máximo é estritamente menor que $\\text{mid}$).
          </li>
          <li>Retorne $\\text{melhor}$.</li>
        </ol>
        <p><strong>Análise de Complexidade:</strong> O espaço de busca tem tamanho $|V|$. A busca binária realiza exatamente $\\lceil \\lg |V| \\rceil + 1$ iterações. Em cada iteração, é feita uma chamada ao algoritmo de decisão $A_{\\text{dec}}$, que consome $O(n^d)$ tempo. Como $\\lg |V| \\le n$, o tempo total de execução é:</p>
        $$T(n) = O(\\lg |V| \\cdot n^d) = O(n^{d+1}).$$
        <p>Como $d+1$ é uma constante, o problema de otimização $\\text{LONGEST-PATH-LENGTH}$ é resolvido em tempo estritamente polinomial. $\\blacksquare$</p>
      `
    },
    {
      id: "ex16-2",
      code: "EXERCÍCIO 02 • CERTIFICADOS DE NÃO PERTINÊNCIA E GRAFOS NÃO HAMILTONIANOS",
      reference: "Exercícios 34.2-2 e 34.2-7 (pp. 861–862)",
      title: "Demonstração Estrutural de Não Hamiltonicidade em Grafos Bipartidos Ímpares e DAGs",
      prompt: `
        <p>Resolva os dois problemas estruturais de ciclos e caminhos hamiltonianos:</p>
        <ol>
          <li><strong>(Exercício 34.2-2)</strong> Prove que, se $G = (V, E)$ é um grafo bipartido não dirigido com um número ímpar de vértices ($|V| = 2k + 1$), então $G$ é obrigatoriamente <strong>não hamiltoniano</strong>. Explique como esse fato fornece um certificado conciso de tempo polinomial para provar que certas instâncias pertencem ao complemento de $\\text{HAM-CYCLE}$.</li>
          <li><strong>(Exercício 34.2-7)</strong> Embora determinar se um grafo arbitrário possui um caminho hamiltoniano seja NP-completo, mostre que o problema do caminho hamiltoniano de $u$ até $v$ pode ser resolvido em <strong>tempo linear</strong> para Grafos Acíclicos Dirigidos (DAGs). Dê o algoritmo.</li>
        </ol>
      `,
      placeholder:
        "Para o item 1, observe a alternância estrita entre as partições V₁ e V₂ ao longo de qualquer ciclo; para o item 2, use ordenação topológica...",
      solution: `
        <h4>1. Grafos Bipartidos com Número Ímpar de Vértices (Exercício 34.2-2)</h4>
        <p>Seja $G = (V, E)$ um grafo bipartido. Por definição de bipartição, seus vértices podem ser particionados em dois subconjuntos disjuntos $V_1$ e $V_2$ ($V = V_1 \\cup V_2$ e $V_1 \\cap V_2 = \\emptyset$) de modo que toda aresta $(u, v) \\in E$ conecta um vértice de $V_1$ a um vértice de $V_2$. Não existem arestas internas em $V_1$ nem em $V_2$.</p>
        <ul>
          <li>Considere qualquer ciclo em $G$: $C = \\langle v_1, v_2, v_3, \\dots, v_m, v_1 \\rangle$.</li>
          <li>Sem perda de generalidade, seja $v_1 \\in V_1$. Como não há arestas dentro de $V_1$, o vértice seguinte $v_2$ obrigatoriamente pertence a $V_2$. O vértice $v_3$ deve pertencer a $V_1$, $v_4 \\in V_2$, e assim sucessivamente. Em geral:
            $$v_i \\in \\begin{cases} V_1 & \\text{se } i \\text{ é ímpar}, \\\\ V_2 & \\text{se } i \\text{ é par}. \\end{cases}$$
          </li>
          <li>Para que a aresta final $(v_m, v_1)$ exista em $G$, como $v_1 \\in V_1$, o vértice $v_m$ <strong>deve obrigatoriamente pertencer a $V_2$</strong>.</li>
          <li>Isso exige que o índice $m$ seja par! Portanto, <em>todo ciclo em um grafo bipartido tem comprimento par</em>.</li>
          <li>Um ciclo hamiltoniano em $G$ deve visitar todos os vértices de $V$ exatamente uma vez. Logo, seu comprimento é exatamente $m = |V|$. Se $|V| = 2k + 1$ é ímpar, é matematicamente impossível existir um ciclo hamiltoniano. Concluímos que $G$ é não hamiltoniano!</li>
        </ul>
        <p><strong>Certificado em co-NP:</strong> Para provar a um terceiro que um grafo é não hamiltoniano (uma instância $\\langle G \\rangle \\in \\overline{\\text{HAM-CYCLE}}$), se o grafo for bipartido ímpar, o certificado é a própria bipartição $(V_1, V_2)$. O verificador checa em $O(V + E)$ que todas as arestas cruzam entre $V_1$ e $V_2$ e que $|V_1| + |V_2|$ é ímpar, atestando irrefutavelmente a não existência de ciclo hamiltoniano.</p>

        <h4>2. Caminho Hamiltoniano em DAGs em Tempo Linear (Exercício 34.2-7)</h4>
        <p>Seja $G = (V, E)$ um Grafo Acíclico Dirigido (DAG). Desejamos determinar se existe um caminho simples dirigido de $u$ a $v$ que visite todos os vértices de $V$ exatamente uma vez.</p>
        <p><strong>Algoritmo em Tempo $O(V + E)$:</strong></p>
        <ol>
          <li>Calcule uma <strong>ordenação topológica</strong> dos vértices de $G$ usando busca em profundidade (DFS) em tempo $O(V + E)$. Seja $\\langle v_1, v_2, \\dots, v_n \\rangle$ a sequência ordenada dos vértices de modo que todas as arestas dirigidas apontem da esquerda para a direita ($i < j$ para toda aresta $(v_i, v_j) \\in E$).</li>
          <li>Um caminho que visita todos os $n$ vértices em um DAG só pode se mover para a frente na ordenação topológica. Logo, o <em>único</em> caminho hamiltoniano possível em um DAG é a própria sequência consecutiva da ordenação topológica:
            $$v_1 \\to v_2 \\to v_3 \\to \\dots \\to v_n.$$
          </li>
          <li>Verifique se $v_1 = u$ e se $v_n = v$. Se não forem, nenhum caminho de $u$ a $v$ pode cobrir todos os vértices, retorne NÃO.</li>
          <li>Para cada $i \\in \\{1, 2, \\dots, n - 1\\}$, verifique se a aresta dirigida $(v_i, v_{i+1})$ existe em $E$.</li>
          <li>Se todas as $n - 1$ arestas consecutivas existirem, retorne SIM (o caminho $\\langle v_1, \\dots, v_n \\rangle$ é hamiltoniano). Se qualquer aresta consecutiva estiver ausente, retorne NÃO (não pode existir nenhum outro caminho hamiltoniano).</li>
        </ol>
        <p>A ordenação topológica consome $O(V + E)$ e a verificação das $n-1$ arestas consome $O(V + E)$. O tempo total é estritamente linear $O(V + E)$. $\\blacksquare$</p>
      `
    },
    {
      id: "ex16-3",
      code: "EXERCÍCIO 03 • REDUÇÃO POLINOMIAL DE 3-CNF-SAT PARA CLIQUE",
      reference: "Seção 34.5.1 (pp. 886–888) e Exercício 34.5-8",
      title: "Demonstração Completa da Correção Bidirecional da Redução 3-CNF-SAT ≤_P CLIQUE",
      prompt: `
        <p>Considere a redução polinomial que transforma uma fórmula booleana na forma normal 3-conjuntiva $\\phi = C_1 \\land C_2 \\land \\dots \\land C_k$ em um grafo não dirigido $G = (V, E)$ para o problema do $\\text{CLIQUE}$ (Teorema 34.11, pp. 886–888):</p>
        <ol>
          <li>Apresente a construção formal do conjunto de vértices $V$ e do conjunto de arestas $E$ a partir de $\\phi$.</li>
          <li>Prove rigorosamente a implicação direta: se $\\phi$ é satisfazível, então $G$ possui um clique de tamanho $k$.</li>
          <li>Prove rigorosamente a implicação recíproca: se $G$ possui um clique de tamanho $k$, então $\\phi$ é satisfazível.</li>
          <li>Aplique a redução à fórmula específica $\\phi = (x_1 \\lor \\neg x_2 \\lor x_3) \\land (\\neg x_1 \\lor x_2 \\lor x_3) \\land (\\neg x_1 \\lor \\neg x_2 \\lor \\neg x_3)$, indicando o número de vértices, as arestas proibidas e exibindo um clique de tamanho 3 correspondente a uma atribuição que a satisfaz.</li>
        </ol>
      `,
      placeholder:
        "Construa 3k vértices em k tríades; conecte vértices de cláusulas diferentes se os literais não forem contraditórios...",
      solution: `
        <h4>1. Construção Formal do Grafo $G = (V, E)$</h4>
        <p>Seja $\\phi = C_1 \\land C_2 \\land \\dots \\land C_k$ uma fórmula 3-CNF com $k$ cláusulas sobre as variáveis $x_1, \\dots, x_n$, onde cada cláusula $C_r = (l_1^r \\lor l_2^r \\lor l_3^r)$ é composta por três literais distintos.</p>
        <ul>
          <li><strong>Vértices:</strong> Criamos 3 vértices para cada uma das $k$ cláusulas:
            $$V = \\{v_1^r, v_2^r, v_3^r : 1 \\le r \\le k\\}, \\quad \\text{com } |V| = 3k.$$
            O vértice $v_i^r$ corresponde diretamente ao literal $l_i^r$ da cláusula $C_r$.
          </li>
          <li><strong>Arestas:</strong> Uma aresta não dirigida conecta dois vértices $v_i^r$ e $v_j^s$ se e somente se:
            <ol>
              <li>Eles pertencem a cláusulas distintas: $r \\neq s$; e</li>
              <li>Os literais correspondentes são consistentes (não contraditórios): $l_i^r \\neq \\neg l_j^s$.</li>
            </ol>
          </li>
          <li>O tamanho alvo do clique é definido como $k$. O algoritmo de redução executa em tempo $O(k^2)$, inspecionando todos os pares de vértices.</li>
        </ul>

        <h4>2. Implicação Direta ($\\implies$): $\\phi$ Satisfazível $\\implies$ Clique de Tamanho $k$</h4>
        <p>Suponha que $\\phi$ seja satisfazível. Então existe uma atribuição de valores verdade às variáveis tal que toda cláusula $C_r$ ($1 \\le r \\le k$) avalia como 1. Isso significa que em cada cláusula $C_r$ existe pelo menos um literal cujo valor é 1 sob essa atribuição. Para cada $r \\in \\{1, \\dots, k\\}$, selecionamos exatamente um literal com valor 1, digamos $l_{\\sigma(r)}^r$, e consideramos o conjunto de $k$ vértices correspondentes $V' = \\{v_{\\sigma(1)}^1, v_{\\sigma(2)}^2, \\dots, v_{\\sigma(k)}^k\\}$.</p>
        <p>Afirmamos que $V'$ forma um clique em $G$:</p>
        <ul>
          <li>Sejam $u, v \\in V'$ dois vértices distintos, com $u = v_{\\sigma(r)}^r$ e $v = v_{\\sigma(s)}^s$. Como cada vértice foi extraído de uma cláusula diferente, temos $r \\neq s$.</li>
          <li>Além disso, como ambos os literais $l_{\\sigma(r)}^r$ e $l_{\\sigma(s)}^s$ avaliam como 1 sob a mesma atribuição verdade, é impossível que um seja a negação do outro (não podemos ter uma variável sendo 1 e 0 simultaneamente). Logo, eles são consistentes.</li>
          <li>Pela regra de construção de arestas, existe uma aresta $(u, v) \\in E$. Como isso se aplica a todo par em $V'$, $V'$ é um subgrafo completo de tamanho $k$ (um clique de tamanho $k$).</li>
        </ul>

        <h4>3. Implicação Recíproca ($\\impliedby$): Clique de Tamanho $k$ $\\implies$ $\\phi$ Satisfazível</h4>
        <p>Suponha que $G$ contenha um clique $V' \\subseteq V$ com $|V'| = k$.</p>
        <ul>
          <li>Por construção, não existem arestas entre vértices que pertencem à mesma cláusula ($r = s$). Portanto, um subgrafo completo não pode conter dois vértices da mesma cláusula.</li>
          <li>Como $|V'| = k$ e existem exatamente $k$ cláusulas, $V'$ deve conter <strong>exatamente um vértice de cada cláusula</strong> $C_1, C_2, \\dots, C_k$.</li>
          <li>Mais ainda, como todos os vértices de $V'$ são mutuamente conectados por arestas, nenhum par de vértices em $V'$ pode representar literais contraditórios ($l$ e $\\neg l$).</li>
          <li>Podemos então construir uma atribuição verdade viável: para cada vértice $v_i^r \\in V'$, se o literal associado for uma variável positiva $x_j$, atribuímos $x_j = 1$; se for um literal negativo $\\neg x_j$, atribuímos $x_j = 0$. Variáveis que não aparecem nos literais de $V'$ recebem valores arbitrários (por exemplo, 0).</li>
          <li>Como não há contradições em $V'$, essa atribuição é consistente e torna verdadeiros todos os $k$ literais representados em $V'$. Como cada cláusula $C_r$ contém pelo menos um desses literais, todas as $k$ cláusulas avaliam como 1, satisfazendo a fórmula $\\phi$. $\\blacksquare$</li>
        </ul>

        <h4>4. Aplicação à Instância Concreta</h4>
        <p>Para $\\phi = (x_1 \\lor \\neg x_2 \\lor x_3) \\land (\\neg x_1 \\lor x_2 \\lor x_3) \\land (\\neg x_1 \\lor \\neg x_2 \\lor \\neg x_3)$ ($k = 3$ cláusulas):</p>
        <ul>
          <li>O grafo possui $|V| = 3 \\cdot 3 = 9$ vértices: $C_1 = \\{v_1^1: x_1, v_2^1: \\neg x_2, v_3^1: x_3\\}$; $C_2 = \\{v_1^2: \\neg x_1, v_2^2: x_2, v_3^2: x_3\\}$; $C_3 = \\{v_1^3: \\neg x_1, v_2^3: \\neg x_2, v_3^3: \\neg x_3\\}$.</li>
          <li>As arestas proibidas são: entre vértices da mesma cláusula; entre $x_1$ de $C_1$ e $\\neg x_1$ de $C_2$ ou $C_3$; entre $\\neg x_2$ de $C_1$ e $x_2$ de $C_2$; entre $x_3$ de $C_1$ ou $C_2$ e $\\neg x_3$ de $C_3$.</li>
          <li>Considere a atribuição que satisfaz $\\phi$: $x_1 = 0, x_2 = 0, x_3 = 1$.</li>
          <li>Essa atribuição torna verdadeiros os literais $\\neg x_2$ em $C_1$, $x_3$ em $C_2$ e $\\neg x_1$ em $C_3$.</li>
          <li>O conjunto de vértices correspondente $V' = \\{v_2^1, v_3^2, v_1^3\\}$ possui vértices em cláusulas distintas que não são contraditórios entre si ($\\neg x_2, x_3, \\neg x_1$). Portanto, existe aresta entre todos eles, formando um <strong>clique de tamanho 3</strong> em $G$!</li>
        </ul>
      `
    },
    {
      id: "ex16-4",
      code: "EXERCÍCIO 04 • COMPLEMENTARIDADE ENTRE CLIQUE E VERTEX-COVER",
      reference: "Exercício 35.1-5 (p. 904)",
      title: "Por Que a 2-Aproximação de Cobertura de Vértices Não Gera Aproximação Constante para o Clique",
      prompt: `
        <p><strong>(Exercício 35.1-5, p. 904)</strong> Pela prova do Teorema 34.12, sabemos que o problema da cobertura de vértices e o problema do clique são complementares no sentido de que um subconjunto $V' \\subseteq V$ é uma cobertura de vértices ótima em um grafo não dirigido $G = (V, E)$ se e somente se o conjunto complementar $V - V'$ é um clique de tamanho máximo no grafo complemento $\\bar{G} = (V, \\bar{E})$.</p>
        <p>Essa relação fundamental implica que existe um algoritmo de aproximação em tempo polinomial com razão de aproximação constante para o problema do clique? Justifique sua resposta analisando algebricamente a transferência de erros da aproximação.</p>
      `,
      placeholder:
        "Calcule o tamanho do clique aproximado V - C quando |C| ≤ 2|C*| e observe que quando |V| - 2|C*| pode ser nulo ou negativo...",
      solution: `
        <h4>1. A Resposta Conceitual</h4>
        <p><strong>NÃO.</strong> A existência de um algoritmo 2-aproximado para a Cobertura de Vértices <em>não</em> implica a existência de um algoritmo de aproximação com razão constante para o problema do Clique Máximo. De fato, o problema do Clique é conhecido por ser extremamente intratável para aproximações: por resultados avançados de PCP (Håstad, 1999), não é possível aproximar o Clique com razão $n^{1 - \\epsilon}$ para qualquer $\\epsilon > 0$, a menos que $\\text{P} = \\text{NP}$.</p>

        <h4>2. Análise Algébrica da Falha na Transferência de Razão</h4>
        <p>Seja $G$ um grafo com $n = |V|$ vértices. Seja $C^*$ o tamanho da cobertura de vértices mínima em $G$, e seja $K^*$ o tamanho do clique máximo no grafo complemento $\\bar{G}$. Pela complementaridade exata:</p>
        $$C^* + K^* = n \\implies K^* = n - C^*.$$
        <p>Suponha que executemos o algoritmo <code>APPROX-VERTEX-COVER</code> sobre $G$, obtendo uma cobertura de vértices $C$ que satisfaz:</p>
        $$|C| \\le 2 C^*.$$
        <p>Tomando o complemento do conjunto $C$, obtemos um clique $K = V - C$ no grafo $\\bar{G}$. O tamanho desse clique é:</p>
        $$|K| = n - |C| \\ge n - 2 C^*.$$
        <p>Para avaliar a razão de aproximação para o clique (que é um problema de maximização, logo desejamos $K^* / |K|$ constante), examinamos a razão:</p>
        $$\\frac{K^*}{|K|} \\le \\frac{n - C^*}{n - 2 C^*}.$$

        <h4>3. Demonstração de Instâncias Onde a Razão Degrada Catastroficamente</h4>
        <p>Considere uma família de grafos onde a cobertura de vértices ótima $C^*$ é ligeiramente superior à metade dos vértices:</p>
        <ul>
          <li>Suponha que $n = 100$ e $C^* = 50$. O clique ótimo em $\\bar{G}$ tem tamanho $K^* = n - C^* = 100 - 50 = 50$.</li>
          <li>O algoritmo 2-aproximado <code>APPROX-VERTEX-COVER</code> pode devolver uma cobertura de tamanho $|C| = 2 C^* = 2 \\times 50 = 100$ (todos os vértices do grafo!).</li>
          <li>Nesse caso, o conjunto complementar retornado é $K = V - C = \\emptyset$, com tamanho $|K| = 0$!</li>
          <li>A razão de aproximação resultante seria:
            $$\\frac{K^*}{|K|} = \\frac{50}{0} = \\infty.$$
          </li>
        </ul>
        <p>Mesmo que exijamos $|K| \\ge 1$, se $C^* = \\frac{n-1}{2}$, temos $K^* = \\frac{n+1}{2} = \\Theta(n)$, mas $n - 2C^* = 1$. O clique obtido pelo complemento teria tamanho 1, gerando uma razão de aproximação de:</p>
        $$\\frac{K^*}{|K|} = \\frac{\\Theta(n)}{1} = \\Theta(n) = \\Theta(|V|),$$
        <p>que cresce com o tamanho da entrada e não é constante. Portanto, reduções que preservam a otimalidade exata (como $K^* = n - C^*$) distorcem severamente as garantias relativas de aproximação multiplicativa ($|C| \\le 2C^*$). $\\blacksquare$</p>
      `
    },
    {
      id: "ex16-5",
      code: "EXERCÍCIO 05 • COBERTURA DE VÉRTICES EM ÁRVORES EM TEMPO LINEAR",
      reference: "Exercício 35.1-4 (p. 903)",
      title: "Algoritmo Guloso Ótimo em Tempo Linear para Cobertura de Vértices em Árvores",
      prompt: `
        <p><strong>(Exercício 35.1-4, p. 903)</strong> Dê um algoritmo eficiente para determinar uma cobertura de vértices <em>ótima</em> (de tamanho mínimo exato) para uma árvore não dirigida $T = (V, E)$ no tempo $O(V)$. Prove a corretude de sua estratégia e demonstre que a complexidade é linear.</p>
      `,
      placeholder:
        "Processe a árvore em pós-ordem ou das folhas para a raiz: se uma folha u está ligada ao pai v, sempre adicione v à cobertura...",
      solution: `
        <h4>1. Ideia Central e Propriedade da Escolha Gulosa</h4>
        <p>Em um grafo geral, a cobertura de vértices é NP-completa. Contudo, em uma árvore (grafo conexo e acíclico), a estrutura hierárquica permite uma <strong>escolha gulosa ótima</strong>:</p>
        <p><em>Lema da Escolha Gulosa:</em> Seja $T$ uma árvore enraizada e seja $u$ uma folha de $T$ com vértice pai $v$. Então existe uma cobertura de vértices de tamanho mínimo para $T$ que <strong>contém o pai $v$</strong>.</p>
        <br>
        <em>Demonstração do Lema:</em>
        <ul>
          <li>A aresta $(u, v)$ deve ser coberta por qualquer cobertura viável. Logo, toda cobertura deve conter $u$ ou $v$ (ou ambos).</li>
          <li>Suponha que uma cobertura ótima $C^*$ contenha a folha $u$, mas não contenha o pai $v$.</li>
          <li>Considere a cobertura alternativa $C' = (C^* - \\{u\\}) \\cup \\{v\\}$.</li>
          <li>Como $u$ é folha, a <em>única</em> aresta incidente a $u$ é $(u, v)$, a qual é imediatamente coberta por $v$. Além disso, $v$ pode cobrir arestas que ligam $v$ a seus outros filhos e ao pai de $v$. Logo, $C'$ é uma cobertura de vértices válida de $T$.</li>
          <li>O tamanho é $|C'| = |C^*| - 1 + 1 = |C^*|$. Como $C^*$ era ótima, $C'$ também é uma cobertura de vértices de tamanho mínimo, contendo o pai $v$.</li>
        </ul>

        <h4>2. Pseudocódigo do Algoritmo Linear (GULOSO-TREE-VERTEX-COVER)</h4>
        <div class="canonical-callout">
        <strong>GULOSO-TREE-VERTEX-COVER(T)</strong><br>
          1 &nbsp;C = ∅<br>
          2 &nbsp;escolha uma raiz arbitrária r ∈ T.V e compute uma ordenação em pós-ordem via DFS<br>
          3 &nbsp;seja L a lista de vértices em ordem pós-ordem (folhas aparecem antes de seus pais)<br>
          4 &nbsp;para cada vértice v ∈ T.V: coberto[v] = FALSE<br>
          5 &nbsp;for each vértice u em L (exceto a raiz r):<br>
          6 &nbsp;&nbsp;&nbsp;&nbsp;seja p o pai de u em T<br>
          7 &nbsp;&nbsp;&nbsp;&nbsp;se NOT coberto[u] e NOT coberto[p]:<br>
          8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;C = C ∪ {p} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// inclui o pai p na cobertura<br>
          9 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;coberto[p] = TRUE<br>
          10 return C
      </div>

        <h4>3. Análise de Complexidade de Tempo</h4>
        <ul>
          <li>Enraizar a árvore e calcular a ordenação em pós-ordem via busca em profundidade (DFS) percorre cada vértice e cada uma das $|V|-1$ arestas exatamente uma vez, consumindo $O(V)$ etapas.</li>
          <li>O laço <code>for</code> inspeciona cada um dos $|V| - 1$ vértices em $L$, realizando consultas e atualizações de tabelas booleanas em tempo $O(1)$ por vértice.</li>
          <li>O tempo total de execução é rigorosamente $\\Theta(V)$, estritamente linear. $\\blacksquare$</li>
        </ul>
      `
    },
    {
      id: "ex16-6",
      code: "EXERCÍCIO 06 • INAPROXIMABILIDADE DO TSP GERAL SE P ≠ NP",
      reference: "Seção 35.2.2 (pp. 909–911) e Exercício 35.2-1",
      title: "Construção Formal da Redução com Peso de Penalidade ρ|V| + 1 e TSP com Pesos {1, 2}",
      prompt: `
        <p>Considere o Teorema 35.3 e o Exercício 35.2-1 sobre a inaproximabilidade do Caixeiro-Viajante Geral:</p>
        <ol>
          <li>Explique por que na redução de $\\text{HAM-CYCLE}$ para $\\text{TSP}$ o valor de penalidade atribuído a arestas inexistentes deve ser estritamente $\\rho |V| + 1$, e calcule explicitamente a diferença mínima de custo entre um percurso hamiltoniano viável e um percurso inviável.</li>
          <li><strong>(Exercício 35.2-1, p. 911)</strong> Suponha que em uma instância de TSP todos os custos de arestas pertençam ao conjunto restrito $\\{1, 2\\}$. Mostre que essa função de custo <em>automaticamente satisfaz a desigualdade triangular</em> e conclua se essa versão admite algoritmo com razão de aproximação constante.</li>
        </ol>
      `,
      placeholder:
        "Para o item 1, mostre que ρn < (ρn + 1) + (n - 1) = (ρ+1)n; para o item 2, verifique c(u, w) ≤ 2 ≤ 1 + 1 ≤ c(u, v) + c(v, w)...",
      solution: `
        <h4>1. O Papel da Penalidade $\\rho |V| + 1$ no Teorema 35.3</h4>
        <p>Seja $G = (V, E)$ um grafo com $n = |V|$ vértices. Desejamos decidir se $G$ possui um ciclo hamiltoniano usando um algoritmo hipotético $A$ com razão de aproximação $\\rho \\ge 1$ para o TSP. Construímos o grafo completo $G' = (V, E')$ com custos:</p>
        $$c(u, v) = \\begin{cases} 1 & \\text{se } (u, v) \\in E, \\\\ \\rho n + 1 & \\text{se } (u, v) \\notin E. \\end{cases}$$
        <ul>
          <li><strong>Se $G$ é hamiltoniano:</strong> O ciclo hamiltoniano ótimo $H^*$ usa exclusivamente arestas de $E$. Seu custo é exatamente:
            $$c(H^*) = n \\cdot 1 = n.$$
            O algoritmo $\\rho$-aproximado $A$ é obrigado a encontrar um percurso $H$ que satisfaça:
            $$c(H) \\le \\rho \\cdot c(H^*) = \\mathbf{\\rho n}.$$
          </li>
          <li><strong>Se $G$ NÃO é hamiltoniano:</strong> Todo ciclo que visita todos os $n$ vértices em $G'$ deve usar <em>pelo menos uma aresta fora de $E$</em>. Como o custo dessa aresta é $\\rho n + 1$ e as outras $n - 1$ arestas custam no mínimo 1, o custo de <em>qualquer</em> percurso é limitado inferiormente por:
            $$c(H) \\ge (\\rho n + 1) + (n - 1) \\cdot 1 = \\rho n + 1 + n - 1 = \\mathbf{\\rho n + n} > \\mathbf{\\rho n}.$$
          </li>
          <li><strong>O Gap Insuperável:</strong> Há uma separação nítida de pelo menos $n$ unidades de custo entre o limite superior de uma instância afirmativa ($\\le \\rho n$) e o limite inferior de uma instância negativa ($\\ge \\rho n + n$). Assim, se o algoritmo $A$ existisse, bastaria testar se $c(H) \\le \\rho n$ para decidir $\\text{HAM-CYCLE}$ em tempo polinomial, implicando $\\text{P} = \\text{NP}$. $\\blacksquare$</li>
        </ul>

        <h4>2. Instâncias de TSP com Custos em $\\{1, 2\\}$ (Exercício 35.2-1)</h4>
        <p>Seja $G = (V, E)$ um grafo completo com função de custo $c(u, v) \\in \\{1, 2\\}$ para todo par de vértices distintos $u, v \\in V$.</p>
        <ul>
          <li>Para quaisquer três vértices $u, v, w \\in V$, o custo máximo possível de uma única aresta é $c(u, w) \\le 2$.</li>
          <li>Por outro lado, o custo mínimo de qualquer aresta é 1. Portanto:
            $$c(u, v) + c(v, w) \\ge 1 + 1 = 2.$$
          </li>
          <li>Consequentemente:
            $$c(u, w) \\le 2 \\le c(u, v) + c(v, w).$$
          </li>
          <li>A <strong>desigualdade triangular é universalmente satisfeita</strong> para toda e qualquer tripla de vértices!</li>
        </ul>
        <p>Portanto, o algoritmo <code>APPROX-TSP-TOUR</code> (Teorema 35.2) garante imediatamente uma razão de aproximação 2 em tempo polinomial. Mais ainda, Christofides (1976) atinge razão $3/2$ para esse problema, e algoritmos especializados para TSP com pesos em $\\{1, 2\\}$ alcançam razões ainda melhores (como $7/5$ ou $8/7$). $\\blacksquare$</p>
      `
    },
    {
      id: "ex16-7",
      code: "EXERCÍCIO 07 • ANÁLISE HARMÔNICA DA COBERTURA DE CONJUNTOS",
      reference: "Teorema 35.4 e Exercício 35.3-4 (pp. 913–918)",
      title: "Demonstração Passo a Passo da Razão Harmônica H(max |S|) de GREEDY-SET-COVER",
      prompt: `
        <p><strong>(Teorema 35.4 e Exercício 35.3-4)</strong> Considere o algoritmo <code>GREEDY-SET-COVER(X, F)</code> para o problema da Cobertura de Conjuntos:</p>
        <ol>
          <li>Defina rigorosamente a variável de custo amortizado $c_x$ atribuída a cada elemento $x \\in X$ durante a execução do algoritmo guloso.</li>
          <li>Prove que para qualquer conjunto fixo $S \\in \\mathcal{F}$, temos $\\sum_{x \\in S} c_x \\le H(|S|)$, onde $H(d) = \\sum_{i=1}^d \\frac{1}{i}$.</li>
          <li>Conclua a demonstração de que a razão de aproximação é limitada por $H(\\max_{S \\in \\mathcal{F}} |S|) \\le \\ln |X| + 1$.</li>
        </ol>
      `,
      placeholder:
        "Distribua o custo 1 do conjunto S_i igualmente entre os elementos novos cobertos c_x = 1/|S_i ∩ U|; ordene S na ordem reversa de cobertura...",
      solution: `
        <h4>1. Definição do Custo Amortizado $c_x$</h4>
        <p>Seja $\\mathcal{C} = \\{S_1, S_2, \\dots, S_k\\}$ a subfamília de conjuntos selecionados sucessivamente pelo algoritmo guloso na linha 4 de <code>GREEDY-SET-COVER</code>. Cada conjunto $S_i$ acarreta um custo de 1.</p>
        <p>No momento em que $S_i$ é selecionado, ele cobre um conjunto não vazio de elementos inéditos $S_i \\cap U$, onde $U$ é o conjunto de elementos ainda não cobertos imediatamente antes da escolha de $S_i$. Distribuímos uniformemente o custo 1 de $S_i$ entre esses novos elementos cobertos:</p>
        $$c_x = \\frac{1}{|S_i \\cap U|}, \\quad \\forall x \\in (S_i \\cap U).$$
        <p>Como cada elemento $x \\in X$ é coberto pela primeira vez por exatamente um conjunto $S_i$, a soma de todos os custos distribuídos é exatamente o número total de conjuntos da solução gulosa:</p>
        $$|\\mathcal{C}| = \\sum_{x \\in X} c_x.$$

        <h4>2. Limitação Superior de $\\sum_{x \\in S} c_x$ para Qualquer Conjunto $S \\in \\mathcal{F}$</h4>
        <p>Seja $S$ qualquer conjunto pertencente à família original $\\mathcal{F}$, com $|S| = m$. Sejam $u_1, u_2, \\dots, u_m$ os elementos de $S$ ordenados na ordem em que foram cobertos pelo algoritmo guloso (com empates resolvidos arbitrariamente).</p>
        <p>Considere o momento imediatamente anterior ao instante em que o elemento $u_k$ foi coberto ($1 \\le k \\le m$):</p>
        <ul>
          <li>Nesse instante, pelo menos os elementos $u_k, u_{k+1}, \\dots, u_m$ ainda não haviam sido cobertos e pertenciam a $U$.</li>
          <li>Portanto, o conjunto $S$ continha pelo menos $m - k + 1$ elementos não cobertos: $|S \\cap U| \\ge m - k + 1$.</li>
          <li>Como o algoritmo guloso escolheu um conjunto $S_i$ que <em>maximizava</em> a quantidade de elementos não cobertos $|S' \\cap U|$, o conjunto escolhido $S_i$ deve ter coberto pelo menos tantos elementos quanto $S$ cobriria:
            $$|S_i \\cap U| \\ge |S \\cap U| \\ge m - k + 1.$$
          </li>
          <li>Portanto, o custo $c_{u_k}$ atribuído ao elemento $u_k$ satisfaz:
            $$c_{u_k} = \\frac{1}{|S_i \\cap U|} \\le \\frac{1}{m - k + 1}.$$
          </li>
        </ul>
        <p>Somando esse custo sobre todos os $m$ elementos de $S$:</p>
        $$\\sum_{x \\in S} c_x = \\sum_{k=1}^m c_{u_k} \\le \\sum_{k=1}^m \\frac{1}{m - k + 1} = \\frac{1}{m} + \\frac{1}{m-1} + \\dots + \\frac{1}{2} + 1 = \\sum_{j=1}^m \\frac{1}{j} = H(|S|).$$

        <h4>3. Conclusão da Razão de Aproximação</h4>
        <p>Seja $\\mathcal{C}^*$ uma cobertura de conjuntos ótima, de tamanho mínimo $|\\mathcal{C}^*|$. Como $\\mathcal{C}^*$ cobre todo o universo $X$, temos $X = \\bigcup_{S \\in \\mathcal{C}^*} S$. Logo:</p>
        $$|\\mathcal{C}| = \\sum_{x \\in X} c_x \\le \\sum_{S \\in \\mathcal{C}^*} \\sum_{x \\in S} c_x \\le \\sum_{S \\in \\mathcal{C}^*} H(|S|).$$
        <p>Seja $d = \\max_{S \\in \\mathcal{F}} |S|$ o tamanho do maior conjunto de $\\mathcal{F}$. Como $H(|S|) \\le H(d)$ para todo $S$:</p>
        $$|\\mathcal{C}| \\le \\sum_{S \\in \\mathcal{C}^*} H(d) = |\\mathcal{C}^*| \\cdot H(d).$$
        <p>Dividindo ambos os lados por $|\\mathcal{C}^*|$:</p>
        $$\\frac{|\\mathcal{C}|}{|\\mathcal{C}^*|} \\le H(d) \\le H(|X|) \\le \\ln |X| + 1. \\quad \\blacksquare$$
      `
    },
    {
      id: "ex16-8",
      code: "EXERCÍCIO 08 • ANÁLISE RIGOROSA DO FPTAS PARA SOMA DE SUBCONJUNTOS",
      reference: "Seção 35.5, Teorema 35.8 e Exercícios 35.5-1 a 35.5-3 (pp. 926–928)",
      title: "Demonstração por Indução da Poda Geométrica, Limite do Erro (1+ε) e Cota do Tamanho de Lista",
      prompt: `
        <p>No Esquema de Aproximação Totalmente Polinomial <code>APPROX-SUBSET-SUM(S, t, ε)</code> com parâmetro de poda $\\delta = \\frac{\\epsilon}{2n}$ (pp. 926–928):</p>
        <ol>
          <li><strong>(Exercício 35.5-2)</strong> Usando indução sobre a iteração $i$, prove que para todo elemento $y \\in P_i$ com $y \\le t$, existe um elemento $z \\in L_i$ tal que:
            $$\\frac{y}{(1 + \\delta)^i} \\le z \\le y.$$
          </li>
          <li>Mostre que o erro acumulado na última iteração satisfaz $(1 + \\delta)^n \\le 1 + \\epsilon$, garantindo que a razão de aproximação é $\\le 1 + \\epsilon$.</li>
          <li><strong>(Exercício 35.5-3)</strong> Deduza a cota superior formal sobre o número máximo de elementos em qualquer lista desbastada $|L_i| \\le \\frac{2n \\ln t}{\\epsilon} + 2$, demonstrando por que o algoritmo opera no tempo $O((n^2 \\ln t) / \\epsilon)$.</li>
        </ol>
      `,
      placeholder:
        "No caso base i=0, L₀={0}; no passo indutivo, considere y ∈ P_i como y ∈ P_{i-1} ou y = y' + x_i e aplique a garantia de TRIM...",
      solution: `
        <h4>1. Demonstração por Indução de $\\frac{y}{(1+\\delta)^i} \\le z \\le y$ (Exercício 35.5-2)</h4>
        <p><strong>Base ($i = 0$):</strong> Temos $P_0 = \\{0\\}$ e $L_0 = \\langle 0 \\rangle$. O único elemento é $y = 0$, e para $z = 0 \\in L_0$ temos $\\frac{0}{(1+\\delta)^0} = 0 \\le 0 \\le 0$, que é verdadeira.</p>
        <p><strong>Hipótese de Indução:</strong> Suponha que a desigualdade seja válida para a iteração $i - 1$: para todo $y \\in P_{i-1}$ com $y \\le t$, existe $z' \\in L_{i-1}$ tal que:</p>
        $$\\frac{y}{(1 + \\delta)^{i-1}} \\le z' \\le y.$$
        <p><strong>Passo Indutivo (para $P_i$):</strong> Seja $y \\in P_i$ tal que $y \\le t$. Por definição, $P_i = P_{i-1} \\cup (P_{i-1} + x_i)$. Há dois casos:</p>
        <ul>
          <li><strong>Caso 1: $y \\in P_{i-1}$.</strong> Pela hipótese indutiva, existe $z' \\in L_{i-1}$ com $\\frac{y}{(1+\\delta)^{i-1}} \\le z' \\le y$. Quando a lista não desbastada é formada na linha 4, $z'$ é incluído nela. Na linha 5, o procedimento <code>TRIM</code> ou retém $z'$, ou descarta $z'$ em favor de algum $z \\in L_i$ tal que $\\frac{z'}{1+\\delta} \\le z \\le z'$. Substituindo $z'$:
            $$z \\le z' \\le y \\quad \\text{e} \\quad z \\ge \\frac{z'}{1+\\delta} \\ge \\frac{y}{(1+\\delta)^{i-1} (1+\\delta)} = \\frac{y}{(1+\\delta)^i}.$$
          </li>
          <li><strong>Caso 2: $y \\in P_{i-1} + x_i$.</strong> Então $y = y' + x_i$ para algum $y' \\in P_{i-1}$. Pela hipótese indutiva, existe $z' \\in L_{i-1}$ tal que $\\frac{y'}{(1+\\delta)^{i-1}} \\le z' \\le y'$. Somando $x_i$ a ambos os lados:
            $$\\frac{y'}{(1+\\delta)^{i-1}} + x_i \\le z' + x_i \\le y' + x_i = y.$$
            Como $1+\\delta > 1$, temos $x_i \\ge \\frac{x_i}{(1+\\delta)^{i-1}}$, logo:
            $$\\frac{y}{(1+\\delta)^{i-1}} = \\frac{y' + x_i}{(1+\\delta)^{i-1}} \\le z' + x_i \\le y.$$
            O valor $z' + x_i$ pertence à lista mesclada antes do desbaste. O procedimento <code>TRIM</code> garante que existe $z \\in L_i$ tal que $\\frac{z' + x_i}{1+\\delta} \\le z \\le z' + x_i$. Portanto:
            $$\\frac{y}{(1+\\delta)^i} \\le z \\le y.$$
          </li>
        </ul>
        <p>Em ambos os casos a propriedade é mantida, completando a indução.</p>

        <h4>2. Erro Acumulado na Última Iteração ($i = n$)</h4>
        <p>Para a solução ótima exata $y^* \\in P_n$, existe $z^* \\in L_n$ tal que $\\frac{y^*}{(1+\\delta)^n} \\le z^* \\le y^*$. Com $\\delta = \\frac{\\epsilon}{2n}$:</p>
        $$\\frac{y^*}{z^*} \\le (1 + \\delta)^n = \\left( 1 + \\frac{\\epsilon}{2n} \\right)^{\\!n}.$$
        <p>Pelo limite clássico do cálculo, para todo $n \\ge 1$, a sequência $(1 + x/n)^n$ cresce monotonicamente em direção a $e^x$. Assim:</p>
        $$\\left( 1 + \\frac{\\epsilon}{2n} \\right)^{\\!n} \\le e^{\\epsilon/2}.$$
        <p>Pela expansão em série de Taylor de $e^u = 1 + u + \\frac{u^2}{2!} + \\dots$, para qualquer $0 \\le \\epsilon \\le 1$ (onde $u = \\epsilon/2 \\le 1/2$):</p>
        $$e^{\\epsilon/2} \\le 1 + \\frac{\\epsilon}{2} + \\left( \\frac{\\epsilon}{2} \\right)^{\\!2} \\le 1 + \\frac{\\epsilon}{2} + \\frac{\\epsilon}{4} \\le 1 + \\epsilon.$$
        <p>Logo, $\\frac{y^*}{z^*} \\le 1 + \\epsilon$, provando a razão de aproximação.</p>

        <h4>3. Cota Superior no Tamanho de $L_i$ e Complexidade (Exercício 35.5-3)</h4>
        <p>Na lista $L_i$ resultante de <code>TRIM</code>, o primeiro elemento positivo é $\\ge 1$ e o último é $\\le t$. A linha 5 de <code>TRIM</code> só anexa um elemento $y_k$ se $y_k > \\text{last} \\cdot (1 + \\delta)$. Logo, quaisquer dois elementos consecutivos $z, z'$ em $L_i$ satisfazem:</p>
        $$\\frac{z'}{z} > 1 + \\delta.$$
        <p>Portanto, o número de elementos positivos em $L_i$ é no máximo:</p>
        $$m \\le 1 + \\log_{1+\\delta} t = 1 + \\frac{\\ln t}{\\ln(1+\\delta)}.$$
        <p>Usando a desigualdade $\\ln(1 + x) \\ge \\frac{x}{1+x}$ para todo $x > 0$:</p>
        $$\\ln(1 + \\delta) \\ge \\frac{\\delta}{1+\\delta} \\implies \\frac{1}{\\ln(1+\\delta)} \\le \\frac{1+\\delta}{\\delta} = 1 + \\frac{1}{\\delta}.$$
        <p>Substituindo $\\delta = \\frac{\\epsilon}{2n}$:</p>
        $$|L_i| \\le 1 + \\left( 1 + \\frac{2n}{\\epsilon} \\right) \\ln t \\le \\frac{2n \\ln t}{\\epsilon} + 2 = O\\left( \\frac{n \\ln t}{\\epsilon} \\right).$$
        <p>Como o algoritmo executa $n$ iterações e cada iteração mescla e desbasta listas de comprimento $O(|L_i|)$, o tempo total é:</p>
        $$T(n) = n \\cdot O\\left( \\frac{n \\ln t}{\\epsilon} \\right) = \\mathbf{O\\left( \\frac{n^2 \\ln t}{\\epsilon} \\right)}.$$
        <p>Como $\\ln t$ é o número de bits para representar $t$, o algoritmo opera em tempo estritamente polinomial no tamanho da entrada e em $1/\\epsilon$, caracterizando um legítimo <strong>FPTAS</strong>. $\\blacksquare$</p>
      `
    }
  ];

  if (typeof window !== "undefined" && typeof window.registerCodexModule === "function") {
    window.registerCodexModule(16, {
      revisao,
      unidades,
      initWorkbenches,
      quizzes,
      exercicios
    });
  }
})();
