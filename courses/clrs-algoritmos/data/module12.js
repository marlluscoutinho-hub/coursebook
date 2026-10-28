/* ==========================================================================
   MÓDULO 12 — CAMINHOS MÍNIMOS (FONTE ÚNICA E TODOS OS PARES) E
   REDES DE FLUXO MÁXIMO
   Capítulos 24, 25 e 26 (pp. 526–623) — CLRS 3ª Edição
   ========================================================================== */

(function () {

  const revisao = {
    subtitle:
      "Da Teoria do Relaxamento de Arestas e Caminhos Mínimos à Dualidade de Cortes e Redes de Fluxo Máximo",
    intro:
      "O Módulo 12 consolida o núcleo avançado da Parte VI do CLRS (Algoritmos em Grafos), articulando três capítulos seminais: o Capítulo 24 (Caminhos Mínimos de Fonte Única: Bellman-Ford em O(VE), DAG-Shortest-Paths em Θ(V + E), Dijkstra em O(V lg V + E) com Heap de Fibonacci e Sistemas de Restrições de Diferença), o Capítulo 25 (Caminhos Mínimos entre Todos os Pares: Multiplicação Matricial em Θ(n³ lg n), Floyd-Warshall em Θ(n³) e o Algoritmo de Johnson para grafos esparsos em O(V² lg V + VE) via potenciais conservativos de reponderação), e o Capítulo 26 (Redes de Fluxo Máximo: Redes Residuais G_f, o Teorema do Fluxo Máximo–Corte Mínimo de Ford-Fulkerson, Edmonds-Karp em O(VE²), Emparelhamento Bipartido Máximo e a mecânica local de pré-fluxos nos algoritmos Generic Push-Relabel e Relabel-to-Front em O(V³)).",
    pillars: [
      {
        tag: "[ PILAR 01 • CAPÍTULO 24 (pp. 526–531) ]",
        title: "Subestrutura Ótima de Caminhos Mínimos (Lema 24.1) vs. A Intratabilidade do Caminho Mais Longo",
        body: `
          <p>O alicerce conceitual de todo cálculo de distâncias em redes reside na propriedade de <strong>subestrutura ótima</strong> formalizada no <strong>Lema 24.1 (p. 528)</strong>: dado um grafo dirigido ponderado $G = (V, E)$ com função peso $w : E \\to \\mathbb{R}$, se $p = \\langle v_0, v_1, \\dots, v_k \\rangle$ é um caminho mínimo do vértice $v_0$ ao vértice $v_k$ e, para quaisquer índices $i, j$ com $0 \\le i \\le j \\le k$, denotamos por $p_{ij} = \\langle v_i, v_{i+1}, \\dots, v_j \\rangle$ o subcaminho de $v_i$ a $v_j$, então <strong>$p_{ij}$ é um caminho mínimo de $v_i$ a $v_j$</strong>.</p>
          <p>A demonstração canônica por <em>recortar e colar</em> (cut-and-paste) decompõe o peso do caminho em $w(p) = w(p_{0i}) + w(p_{ij}) + w(p_{jk})$. Se existisse um caminho estritamente mais curto $p'_{ij}$ de $v_i$ a $v_j$ com $w(p'_{ij}) < w(p_{ij})$, poderíamos colar esse trecho no caminho global gerando $p' = p_{0i} \\circ p'_{ij} \\circ p_{jk}$, cujo peso total $w(p') = w(p_{0i}) + w(p'_{ij}) + w(p_{jk}) < w(p)$ violaria a minimalidade assumida de $p$.</p>
          <p>Em contraste absoluto, o problema de encontrar o <strong>caminho simples mais longo</strong> entre dois vértices não possui subestrutura ótima simples e é comprovadamente <strong>NP-difícil</strong>! A razão profunda explorada no CLRS (pp. 360 e 529) é a <em>ausência de independência entre subproblemas</em>: ao tentar estender um caminho mais longo simples unindo caminhos mais longos entre subtrechos, a exigência de que o caminho permaneça simples (sem repetição de vértices) força os subproblemas a compartilharem restrições de pertinência de vértices, destruindo a localidade do princípio de Bellman.</p>
        `
      },
      {
        tag: "[ PILAR 02 • SEÇÃO 24.5 (pp. 530–532 e 548–552) ]",
        title: "A Técnica Universal de Relaxamento RELAX(u, v, w) e as 6 Propriedades Fundamentais de Distâncias",
        body: `
          <p>Todos os algoritmos de caminhos mínimos de fonte única mantêm para cada vértice $v \\in V$ dois atributos: $v.d$ (a estimativa de caminho mínimo, que atua como um limite superior para o peso real $\\delta(s, v)$) e $v.\\pi$ (o vértice predecessor no caminho mínimo). O procedimento fundamental <code>RELAX(u, v, w)</code> testa se a passagem pela aresta $(u, v)$ melhora a estimativa $v.d$ atual:</p>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">RELAX(u, v, w)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">se</span> v.d > u.d + w(u, v)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">   v.d = u.d + w(u, v)</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   v.π = u</span></div>
            </div>
          </div>
          <p>A Seção 24.5 do CLRS prova rigorosamente as <strong>6 Propriedades de Caminhos Mínimos e Relaxamento</strong> que sustentam a corretude de Bellman-Ford, Dijkstra e algoritmos em DAGs:</p>
          <ul>
            <li><strong>Desigualdade Triangular (Lema 24.10):</strong> Para toda aresta $(u, v) \\in E$, $\\delta(s, v) \\le \\delta(s, u) + w(u, v)$.</li>
            <li><strong>Propriedade do Limite Superior (Lema 24.11):</strong> Sempre temos $v.d \\ge \\delta(s, v)$ para todo $v \\in V$, e uma vez que $v.d$ atinge $\\delta(s, v)$, seu valor nunca mais se altera.</li>
            <li><strong>Propriedade da Ausência de Caminho (Corolário 24.12):</strong> Se não existe caminho de $s$ a $v$, então $\\delta(s, v) = \\infty$ e invariavelmente $v.d = \\infty$.</li>
            <li><strong>Propriedade da Convergência (Lema 24.14):</strong> Se $s \\leadsto u \\to v$ é um caminho mínimo e $u.d = \\delta(s, u)$ em algum momento antes de relaxar a aresta $(u, v)$, então $v.d = \\delta(s, v)$ em todos os instantes posteriores a esse relaxamento.</li>
            <li><strong>Propriedade do Relaxamento de Caminhos (Lema 24.15):</strong> Se $p = \\langle v_0, v_1, \\dots, v_k \\rangle$ é um caminho mínimo a partir de $s = v_0$ e uma sequência de relaxamentos relaxa as arestas $(v_0, v_1), (v_1, v_2), \\dots, (v_{k-1}, v_k)$ nessa ordem (mesmo intercaladas por outros relaxamentos arbitrários), então $v_k.d = \\delta(s, v_k)$.</li>
            <li><strong>Propriedade do Subgrafo de Predecessores (Lemas 24.16–24.17):</strong> Uma vez que $v.d = \\delta(s, v)$ para todo $v \\in V$, o subgrafo de predecessores $G_\\pi$ é uma árvore de caminhos mínimos enraizada em $s$.</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 03 • CAPÍTULO 25 (pp. 558–586) ]",
        title: "Programação Dinâmica Matricial vs. Reponderação de Johnson para Todos os Pares",
        body: `
          <p>O problema de <strong>Caminhos Mínimos entre Todos os Pares (APSP)</strong> recebe uma matriz de adjacências $W = (w_{ij})$ e busca calcular a matriz de distâncias $D = (d_{ij}) = (\\delta(i, j))$. O Capítulo 25 desenvolve duas filosofias algorítmicas complementares:</p>
          <ol>
            <li><strong>Programação Dinâmica Matricial (Seções 25.1 e 25.2):</strong> A extensão aresta por aresta formula a recorrência $l_{ij}^{(m)} = \\min_{1 \\le k \\le n} \\{ l_{ik}^{(m-1)} + w_{kj} \\}$, cuja estrutura algébrica é idêntica à multiplicação tradicional de matrizes substituindo $(+, \\times)$ por $(\\min, +)$. Via <strong>quadratura repetida</strong>, calcula-se $D$ em tempo $\\Theta(n^3 \\lg n)$. Em seguida, o <strong>Algoritmo de Floyd-Warshall (Seção 25.2)</strong> redefine o subproblema considerando apenas caminhos cujos vértices intermediários pertencem a $\\{1, 2, \\dots, k\\}$, gerando a clássica recorrência $d_{ij}^{(k)} = \\min(d_{ij}^{(k-1)}, d_{ik}^{(k-1)} + d_{kj}^{(k-1)})$ em tempo estrito <strong>$\\Theta(n^3)$</strong> e espaço $\\Theta(n^2)$ (executável <em>in-place</em>). O <strong>Fecho Transitivo</strong> especializa essa recorrência em álgebra booleana usando $\\lor$ e $\\land$.</li>
            <li><strong>Reponderação Conservativa de Johnson para Grafos Esparsos (Seção 25.3):</strong> Para grafos onde $|E| \\ll |V|^2$, executar $|V|$ vezes o algoritmo de Dijkstra com Heap de Fibonacci gastaria apenas $O(V^2 \\lg V + VE)$, muito inferior a $\\Theta(V^3)$. No entanto, Dijkstra proíbe arestas negativas. A tentativa ingênua de somar uma constante a todas as arestas falha grosseiramente (pois penaliza caminhos com mais arestas). A solução brilhante de Donald Johnson utiliza a técnica de <strong>função de potencial</strong>: cria-se um vértice auxiliar $s$ conectado a todos os vértices por arestas de peso zero, roda-se <code>BELLMAN-FORD</code> para computar $h(v) = \\delta(s, v)$ e redefine-se cada peso por <strong>$\\hat{w}(u, v) = w(u, v) + h(u) - h(v)$</strong>. Pela Desigualdade Triangular, $\\hat{w}(u, v) \\ge 0$ para toda aresta, preservando rigorosamente todos os caminhos mínimos (<strong>Lema 25.1</strong>) e permitindo rodar $|V|$ instâncias de Dijkstra em tempo total <strong>$O(V^2 \\lg V + VE)$</strong>!</li>
          </ol>
        `
      },
      {
        tag: "[ PILAR 04 • CAPÍTULO 26 (pp. 587–623) ]",
        title: "Dualidade Fluxo Máximo–Corte Mínimo, Redes Residuais e a Mecânica Local de Pré-Fluxos",
        body: `
          <p>O Capítulo 26 estuda a transferência de material conservativo em redes direcionadas $G = (V, E)$ com capacidades $c(u, v) \\ge 0$, fonte $s$ e sorvedouro $t$. Um fluxo viável $f$ obedece à <em>restrição de capacidade</em> ($0 \\le f(u, v) \\le c(u, v)$) e à <em>conservação de fluxo</em> ($\sum_{v} f(v, u) = \\sum_{v} f(u, v)$ para $u \\notin \\{s, t\\}$).</p>
          <p>O ápice teórico do capítulo é o <strong>Teorema do Fluxo Máximo–Corte Mínimo (Teorema 26.6, p. 596)</strong>, que estabelece a equivalência matemática de três afirmações cruciais: (1) $f$ é um fluxo máximo em $G$; (2) a rede residual $G_f$ não contém nenhum caminho aumentador; e (3) o valor do fluxo $|f|$ iguala a capacidade $c(S, T)$ de algum corte $(S, T)$ da rede ($|f| = c(S, T)$). Esse teorema fundamenta tanto a verificação de otimalidade quanto a caracterização do gargalo físico de qualquer rede de transporte.</p>
          <p>Dois paradigmas algorítmicos resolvem o problema:</p>
          <ul>
            <li><strong>Método de Ford-Fulkerson e Edmonds-Karp (Seção 26.2):</strong> Aumenta iterativamente o fluxo ao longo de caminhos aumentadores em $G_f$. Se as buscas forem em largura (BFS, escolhendo caminhos com o menor número de arestas), temos o <strong>Algoritmo de Edmonds-Karp</strong>, cujo número de aumentos é limitado a $O(VE)$, garantindo tempo polinomial estrito <strong>$O(VE^2)$</strong>, independente dos valores numéricos das capacidades (superando as patologias de não convergência de Ford-Fulkerson em capacidades irracionais). Essa técnica resolve diretamente o <strong>Emparelhamento Bipartido Máximo</strong> em tempo $O(VE)$ graças ao <strong>Teorema da Integralidade 26.10</strong>.</li>
            <li><strong>Algoritmos de Empurrar-Reetiquetar (Push-Relabel, Seções 26.4 e 26.5):</strong> Superam a necessidade de inspeção global de caminhos operando exclusivamente de forma local. Relaxam a conservação de fluxo admitindo <em>pré-fluxos</em> com excesso não negativo $e(u) \\ge 0$ e mantêm uma <em>função de altura válida</em> $h(u) \\le h(v) + 1$ para toda aresta residual $(u, v) \\in E_f$. O algoritmo <code>GENERIC-PUSH-RELABEL</code> executa em $O(V^2 E)$, e sua especialização determinística <strong><code>RELABEL-TO-FRONT</code></strong> organiza os vértices em uma lista encadeada dinâmica executando operações <code>DISCHARGE</code> em tempo ótimo <strong>$O(V^3)$</strong>!</li>
          </ul>
        `
      }
    ],
    checklist: [
      "Domino a prova por recortar-e-colar da subestrutura ótima de caminhos mínimos (Lema 24.1) e compreendo por que o caminho mais longo simples falha por acoplamento de restrições e é NP-difícil.",
      "Sei enunciar e demonstrar as 6 propriedades do relaxamento (Desigualdade Triangular, Limite Superior, Ausência de Caminho, Convergência, Relaxamento de Caminhos e Subgrafo de Predecessores) e a prova de corretude e detecção de ciclos negativos de BELLMAN-FORD (Teorema 24.4).",
      "Compreendo a invariante de laço da prova formal de DIJKSTRA (Teorema 24.6), a razão matemática pela qual arestas negativas quebram sua ganância e as complexidades com Arranjo Linear O(V²), Heap Binário O(E lg V) e Heap de Fibonacci O(V lg V + E), além da modelagem de Sistemas de Restrições de Diferença.",
      "Sei derivar a recorrência matricial de Programação Dinâmica l_ij^(m) com quadratura repetida em Θ(n³ lg n), o algoritmo de FLOYD-WARSHALL em Θ(n³), seu Fecho Transitivo bitwise e a reponderação conservativa de JOHNSON com potenciais h(v) = δ(s, v) em O(V² lg V + VE).",
      "Domino a prova da equivalência tripla do Teorema do Fluxo Máximo–Corte Mínimo (Teorema 26.6), a prova de complexidade O(VE²) de EDMONDS-KARP por monotonia de distâncias (Lema 26.7) e a mecânica dos algoritmos PUSH-RELABEL e RELABEL-TO-FRONT em O(V³)."
    ]
  };

  const unidades = [
{
      id: "u12-1",
      code: "UNIDADE 12.1 • CAP. 24.0, 24.1 & 24.2",
      title: "Fundamentos de Caminhos Mínimos de Fonte Única, Relaxamento (RELAX), Bellman-Ford e Caminhos em DAGs",
      pages: "pp. 526–540",
      content: `
        <h3>1. O Problema de Caminhos Mínimos de Fonte Única e Subestrutura Ótima (pp. 526–530)</h3>
        <p>Dado um grafo dirigido ponderado $G = (V, E)$ com função peso $w : E \\to \\mathbb{R}$, o peso de um caminho $p = \\langle v_0, v_1, \\dots, v_k \\rangle$ é a soma dos pesos de suas arestas constituintes: $w(p) = \\sum_{i=1}^k w(v_{i-1}, v_i)$. Definimos o <strong>peso de caminho mínimo</strong> $\\delta(u, v)$ de $u$ a $v$ por:</p>
        $$\\delta(u, v) = \\begin{cases} \\min \\{ w(p) : u \\stackrel{p}{\\leadsto} v \\} & \\text{se existe um caminho de } u \\text{ a } v, \\\\ \\infty & \\text{caso contrário.} \\end{cases}$$
        <p>Um <strong>caminho mínimo</strong> de $u$ a $v$ é qualquer caminho $p$ cujo peso iguala a distância mínima: $w(p) = \\delta(u, v)$. No problema de <strong>Fonte Única</strong>, fixamos um vértice de origem $s \\in V$ e desejamos calcular $\\delta(s, v)$ para todo $v \\in V$.</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ LEMA 24.1 — SUBESTRUTURA ÓTIMA DE UM CAMINHO MÍNIMO (p. 528) ]</span>
          <p>Sejam $G = (V, E)$ um grafo ponderado com pesos $w : E \\to \\mathbb{R}$, $p = \\langle v_0, v_1, \\dots, v_k \\rangle$ um caminho mínimo de $v_0$ a $v_k$ e, para quaisquer $0 \\le i \\le j \\le k$, seja $p_{ij} = \\langle v_i, v_{i+1}, \\dots, v_j \\rangle$ o subcaminho de $v_i$ a $v_j$. Então, <strong>$p_{ij}$ é um caminho mínimo de $v_i$ a $v_j$</strong>.</p>
          <p><em>Demonstração por Recortar e Colar:</em> Decomponha o caminho $p$ em três segmentos concatenados: $v_0 \\stackrel{p_{0i}}{\\leadsto} v_i \\stackrel{p_{ij}}{\\leadsto} v_j \\stackrel{p_{jk}}{\\leadsto} v_k$. O peso total é $w(p) = w(p_{0i}) + w(p_{ij}) + w(p_{jk})$. Suponha, por contradição, que existisse um caminho $p'_{ij}$ de $v_i$ a $v_j$ com peso estritamente menor, isto é, $w(p'_{ij}) < w(p_{ij})$. Então, o caminho composto $p' = p_{0i} \\circ p'_{ij} \\circ p_{jk}$ ligaria $v_0$ a $v_k$ com peso total $w(p') = w(p_{0i}) + w(p'_{ij}) + w(p_{jk}) < w(p)$, contradizendo a hipótese de que $p$ era um caminho mínimo. Portanto, $w(p_{ij}) = \\delta(v_i, v_j)$. $\\blacksquare$</p>
        </div>

        <h4>Ciclos Negativos e Subgrafos de Predecessores</h4>
        <p>Se o grafo $G$ contém um <strong>ciclo com peso estritamente negativo</strong> $c$ alcançável a partir de $s$, e se um vértice $v$ é alcançável a partir de $c$, então podemos percorrer o ciclo $c$ um número arbitrário de vezes para tornar o peso do caminho de $s$ a $v$ arbitrariamente negativo. Nesse caso, convenciona-se matematicamente que <strong>$\\delta(s, v) = -\\infty$</strong> (Figura 24.1, p. 528). Nenhum caminho mínimo bem definido existe para tais vértices.</p>
        <p>Para representar os caminhos encontrados, cada vértice $v \\in V$ mantém um ponteiro $v.\\pi$ para seu predecessor na árvore de caminhos mínimos. O <strong>subgrafo de predecessores</strong> é $G_\\pi = (V_\\pi, E_\\pi)$, onde $V_\\pi = \\{v \\in V : v.\\pi \\neq \\text{NIL}\\} \\cup \\{s\\}$ e $E_\\pi = \\{(v.\\pi, v) \\in E : v \\in V_\\pi - \\{s\\}\\}$. Ao final de algoritmos corretos, $G_\\pi$ forma uma <em>árvore de caminhos mínimos</em> enraizada em $s$ (Lema 24.17).</p>

        <h3>2. A Técnica de Relaxamento e as 6 Propriedades Fundamentais (pp. 530–532 e 548–552)</h3>
        <p>Para cada vértice $v$, mantemos a estimativa de caminho mínimo $v.d$. Inicializamos o grafo atribuindo distância $0$ à fonte $s$ e $\\infty$ a todos os demais vértices:</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">INITIALIZE-SINGLE-SOURCE(G, s)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">para cada</span> vértice v ∈ G.V</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">   v.d = ∞</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   v.π = NIL</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">s.d = 0</span></div>
            </div>
          </div>

        <p>O processo de <strong>relaxar</strong> uma aresta $(u, v)$ consiste em verificar se a estimativa atual $v.d$ pode ser estritamente reduzida passando por $u$ e, em caso afirmativo, atualizar $v.d$ e $v.\\pi$:</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">RELAX(u, v, w)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">se</span> v.d > u.d + w(u, v)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">   v.d = u.d + w(u, v)</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   v.π = u</span></div>
            </div>
          </div>

        <div class="canonical-callout invariant">
          <span class="callout-tag">[ AS 6 PROPRIEDADES CRUCIAIS DE RELAXAMENTO — SEÇÃO 24.5 (pp. 548–552) ]</span>
          <ol>
            <li><strong>Desigualdade Triangular (Lema 24.10):</strong> Para toda aresta $(u, v) \\in E$, $\\delta(s, v) \\le \\delta(s, u) + w(u, v)$. <em>Prova:</em> O caminho mínimo $s \\leadsto u$ concatenado com $(u, v)$ tem peso $\\delta(s, u) + w(u, v)$; por definição, o caminho mínimo $\\delta(s, v)$ não pode ser maior que esse caminho específico.</li>
            <li><strong>Propriedade do Limite Superior (Lema 24.11):</strong> Para todo $v \\in V$, sempre vale $v.d \\ge \\delta(s, v)$. Uma vez que $v.d = \\delta(s, v)$, o valor nunca mais se altera.</li>
            <li><strong>Propriedade da Ausência de Caminho (Corolário 24.12):</strong> Se não existe caminho de $s$ a $v$, então $\\delta(s, v) = \\infty$ e $v.d = \\infty$ em todas as iterações.</li>
            <li><strong>Propriedade da Convergência (Lema 24.14):</strong> Se $s \\leadsto u \\to v$ é um caminho mínimo e $u.d = \\delta(s, u)$ em algum momento antes de relaxar $(u, v)$, então $v.d = \\delta(s, v)$ após o relaxamento de $(u, v)$ e permanece inalterado para sempre.</li>
            <li><strong>Propriedade do Relaxamento de Caminhos (Lema 24.15):</strong> Se $p = \\langle v_0, v_1, \\dots, v_k \\rangle$ é um caminho mínimo a partir de $s = v_0$ e executamos uma sequência de passos de relaxamento contendo as arestas $(v_0, v_1), (v_1, v_2), \\dots, (v_{k-1}, v_k)$ nessa ordem, então $v_k.d = \\delta(s, v_k)$. Essa propriedade vale mesmo se outros relaxamentos arbitrários estiverem intercalados!</li>
            <li><strong>Propriedade do Subgrafo de Predecessores (Lemas 24.16 e 24.17):</strong> Uma vez que $v.d = \\delta(s, v)$ para todo $v \\in V$, o subgrafo de predecessores $G_\\pi$ é uma árvore enraizada em $s$ cujos caminhos únicos correspondem a caminhos mínimos em $G$.</li>
          </ol>
        </div>

        <h3>3. O Algoritmo de Bellman-Ford (Seção 24.1, pp. 532–536)</h3>
        <p>O algoritmo de <strong>Bellman-Ford</strong> resolve o problema de caminho mínimo de fonte única no caso mais geral possível, admitindo pesos de arestas negativos. Ele retorna um valor booleano: <code>TRUE</code> se e somente se o grafo não contém nenhum ciclo de peso negativo alcançável a partir de $s$; caso exista tal ciclo, retorna <code>FALSE</code> indicando que não há solução ótima estável.</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">BELLMAN-FORD(G, w, s)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">INITIALIZE-SINGLE-SOURCE(G, s)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">para</span> i = 1 até |G.V| - 1</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   <span class="kw">para cada</span> aresta (u, v) ∈ G.E</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">       RELAX(u, v, w)</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">para cada</span> aresta (u, v) ∈ G.E</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">   <span class="kw">se</span> v.d > u.d + w(u, v)</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">       <span class="kw">retornar</span> FALSE</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content"><span class="kw">retornar</span> TRUE</span></div>
            </div>
          </div>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 24.4 — CORRETUDE DO ALGORITMO DE BELLMAN-FORD (p. 534) ]</span>
          <p>Seja $G = (V, E)$ um grafo dirigido ponderado com função peso $w : E \\to \\mathbb{R}$ e fonte $s$.</p>
          <ol>
            <li>Se $G$ <strong>não contém ciclos de peso negativo</strong> alcançáveis de $s$, o algoritmo termina com $v.d = \\delta(s, v)$ para todo $v \\in V$, o subgrafo $G_\\pi$ é uma árvore de caminhos mínimos, e a linha 8 retorna <code>TRUE</code>.</li>
            <li>Se $G$ <strong>contém um ciclo de peso negativo</strong> alcançável de $s$, o algoritmo retorna <code>FALSE</code> na linha 7.</li>
          </ol>
          <p><strong>Demonstração Rigorosa (CLRS, p. 534):</strong></p>
          <ul>
            <li><em>Parte 1 (Convergência):</em> Se não há ciclos negativos, todo caminho mínimo $p = \\langle v_0, v_1, \\dots, v_k \\rangle$ com $v_0 = s$ pode ser escolhido simples, possuindo no máximo $|V| - 1$ arestas ($k \\le |V| - 1$). Como cada iteração $i$ do laço externo (linhas 2–4) relaxa <em>todas</em> as arestas de $E$, a $i$-ésima aresta $(v_{i-1}, v_i)$ do caminho $p$ é garantidamente relaxada na iteração $i$. Pela <em>Propriedade do Relaxamento de Caminhos (Lema 24.15)</em>, ao fim de $|V| - 1$ iterações, $v_k.d = \\delta(s, v_k)$. Além disso, pela Desigualdade Triangular, $v.d = \\delta(s, v) \\le \\delta(s, u) + w(u, v) = u.d + w(u, v)$, logo a condição da linha 6 nunca é satisfeita e a função retorna <code>TRUE</code>.</li>
            <li><em>Parte 2 (Detecção de Ciclos Negativos):</em> Suponha que $G$ contenha um ciclo negativo $c = \\langle v_0, v_1, \\dots, v_k \\rangle$ alcançável de $s$, com $v_0 = v_k$, tal que $\\sum_{i=1}^k w(v_{i-1}, v_i) < 0$. Suponha, por absurdo, que o algoritmo retornasse <code>TRUE</code>. Então, a linha 6 não seria disparada para nenhuma aresta do ciclo, o que exigiria $v_i.d \\le v_{i-1}.d + w(v_{i-1}, v_i)$ para todo $i = 1, \\dots, k$. Somando essas $k$ desigualdades em torno do ciclo:
            $$\\sum_{i=1}^k v_i.d \\le \\sum_{i=1}^k v_{i-1}.d + \\sum_{i=1}^k w(v_{i-1}, v_i)$$
            Como $v_0 = v_k$, a soma $\\sum_{i=1}^k v_i.d$ é idêntica a $\\sum_{i=1}^k v_{i-1}.d$. Subtraindo essa soma finita de ambos os lados (já que os vértices do ciclo são alcançáveis a partir de $s$ e possuem distâncias finitas), obtemos:
            $$0 \\le \\sum_{i=1}^k w(v_{i-1}, v_i)$$
            Isso contradiz frontalmente a hipótese de que o ciclo $c$ possui peso estritamente negativo! Portanto, a verificação da linha 6 obrigatoriamente encontra uma aresta violada e retorna <code>FALSE</code>. $\\blacksquare$</li>
          </ul>
        </div>
        <p><strong>Complexidade de Bellman-Ford:</strong> A inicialização custa $\\Theta(V)$. O laço das linhas 2–4 executa $|V| - 1$ passagens, e cada passagem relaxa todas as $|E|$ arestas, custando $\\Theta(VE)$. A verificação das linhas 5–7 percorre $|E|$ arestas em tempo $O(E)$. Tempo total: <strong>$O(VE)$</strong> (ou $\\Theta(VE)$ em grafos densos).</p>

        <h3>4. Caminhos Mínimos em Grafos Acíclicos Dirigidos (DAGs, pp. 536–540)</h3>
        <p>Quando o grafo de entrada é um <strong>DAG (Directed Acyclic Graph)</strong>, podemos explorar a topologia acíclica para determinar caminhos mínimos em tempo <strong>estritamente linear $\\Theta(V + E)$</strong>, admitindo quaisquer pesos reais (positivos, nulos ou negativos), pois a ausência de ciclos torna impossível a existência de ciclos negativos!</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">DAG-SHORTEST-PATHS(G, w, s)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">ordenar topologicamente os vértices de G</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">INITIALIZE-SINGLE-SOURCE(G, s)</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">para cada</span> vértice u, tomado na ordem topológica</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   <span class="kw">para cada</span> vértice v ∈ G.Adj[u]</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">       RELAX(u, v, w)</span></div>
            </div>
          </div>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 24.5 — CORRETUDE DE DAG-SHORTEST-PATHS (p. 537) ]</span>
          <p>Se $G = (V, E)$ é um DAG com pesos $w$, o algoritmo <code>DAG-SHORTEST-PATHS</code> calcula corretamente $v.d = \\delta(s, v)$ para todo $v \\in V$ em tempo $\\Theta(V + E)$.</p>
          <p><em>Demonstração:</em> Se um vértice $v$ não é alcançável de $s$, pela Propriedade da Ausência de Caminho, $v.d = \\delta(s, v) = \\infty$. Se $v$ é alcançável de $s$, seja $p = \\langle v_0, v_1, \\dots, v_k \\rangle$ um caminho mínimo de $s = v_0$ a $v = v_k$. Como os vértices são processados na ordem topológica gerada pela <code>DFS</code>, para toda aresta $(v_{i-1}, v_i)$, o vértice $v_{i-1}$ aparece <em>estritamente antes</em> de $v_i$ na ordenação. Logo, as arestas de $p$ são relaxadas na ordem exata $(v_0, v_1), (v_1, v_2), \\dots, (v_{k-1}, v_k)$. Pela <em>Propriedade do Relaxamento de Caminhos (Lema 24.15)</em>, ao final temos $v.d = \\delta(s, v)$.</p>
          <p><em>Tempo de Execução:</em> A ordenação topológica via <code>DFS</code> consome $\\Theta(V + E)$ (Teorema 22.12). A inicialização custa $\\Theta(V)$. As linhas 3–5 examinam cada vértice uma única vez e relaxam cada aresta saindo de $u$ exatamente uma vez, custando $\\sum_{u \\in V} \\text{grau-saída}(u) = |E|$. Tempo total: <strong>$\\Theta(V + E)$</strong>. $\\blacksquare$</p>
        </div>

        <p><strong>Aplicação Canônica — Caminho Crítico em Redes PERT/CPM:</strong> Como um DAG permite pesos negativos, podemos encontrar o <strong>caminho mais longo</strong> em um DAG em tempo $\\Theta(V + E)$ simplesmente invertendo os sinais de todos os pesos ($w'(u, v) = -w(u, v)$) ou substituindo a operação $\\min$ por $\\max$ no relaxamento. Essa técnica é o coração do método do <em>Caminho Crítico</em> (Seção 24.2, p. 538), que determina as etapas indispensáveis cujo atraso compromete a data final de um projeto complexo.</p>

        <!-- CONTAINER DA BANCADA INTERATIVA DUPLA DO MÓDULO 12 -->
        <div id="workbench-mod12-mount"></div>
      `
    },
{
      id: "u12-2",
      code: "UNIDADE 12.2 • CAP. 24.3 & 24.4",
      title: "O Algoritmo de Dijkstra e Sistemas de Restrições de Diferença em Programação Linear",
      pages: "pp. 540–552",
      content: `
        <h3>1. O Algoritmo de Dijkstra para Pesos Não Negativos (Seção 24.3, pp. 540–544)</h3>
        <p>O algoritmo de <strong>Dijkstra</strong> resolve o problema de caminhos mínimos de fonte única sobre um grafo dirigido ponderado $G = (V, E)$ sob a premissa obrigatória de que <strong>todos os pesos de arestas sejam não negativos</strong>: $w(u, v) \\ge 0$ para todo $(u, v) \\in E$.</p>
        <p>Dijkstra adota uma <strong>estratégia gulosa</strong> similar ao algoritmo de Prim para árvores geradoras mínimas: ele mantém um conjunto $S$ de vértices cujos pesos finais de caminhos mínimos já foram determinados com precisão e uma <strong>fila de prioridade mínima $Q$</strong> contendo todos os vértices de $V - S$, indexados por suas estimativas $v.d$. A cada passo, o algoritmo extrai de $Q$ o vértice $u$ com o menor valor $u.d$, insere-o em $S$ e relaxa todas as arestas que saem de $u$:</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">DIJKSTRA(G, w, s)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">INITIALIZE-SINGLE-SOURCE(G, s)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">S = ∅</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">Q = G.V</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">enquanto</span> Q ≠ ∅</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">   u = EXTRACT-MIN(Q)</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">   S = S ∪ {u}</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">   <span class="kw">para cada</span> vértice v ∈ G.Adj[u]</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">       RELAX(u, v, w)</span></div>
            </div>
          </div>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 24.6 — CORRETUDE DO ALGORITMO DE DIJKSTRA (pp. 541–543) ]</span>
          <p>O algoritmo de Dijkstra, executado em um grafo dirigido ponderado $G = (V, E)$ com função peso não negativa $w : E \\to \\mathbb{R}^+ \\cup \\{0\\}$ e fonte $s$, termina com $u.d = \\delta(s, u)$ para todos os vértices $u \\in V$.</p>
          <p><strong>Demonstração Rigorosa por Invariante de Laço (CLRS, p. 542):</strong></p>
          <p><em>Invariante:</em> No início de cada iteração do laço <code>enquanto</code> das linhas 4–8, temos $v.d = \\delta(s, v)$ para todo vértice $v \\in S$.</p>
          <ul>
            <li><strong>Inicialização:</strong> Inicialmente $S = \\emptyset$, logo a invariante é vacuamente verdadeira.</li>
            <li><strong>Manutenção:</strong> Suponha que a invariante seja válida até o início da iteração atual e que a linha 5 selecione o vértice $u = \\text{EXTRACT-MIN}(Q)$. Queremos provar que, no momento em que $u$ é adicionado a $S$, temos <strong>$u.d = \\delta(s, u)$</strong>.
              <p>Suponha, por contradição, que $u.d > \\delta(s, u)$. Deve existir um caminho de $s$ a $u$ (pois se não existisse, $u.d = \\delta(s, u) = \\infty$). Seja $p$ o caminho mínimo de $s$ a $u$. Como $s \\in S$ (pois $s.d = 0 = \\delta(s, s)$ no início) e $u \\in V - S$, deve existir uma primeira aresta $(x, y)$ ao longo de $p$ que cruza a fronteira de $S$ para $V - S$, isto é, $x \\in S$ e $y \\in V - S$ (podendo ocorrer $x = s$ ou $y = u$).</p>
              <p>Como $x \\in S$, pela hipótese de indução tínhamos $x.d = \\delta(s, x)$ no momento em que $x$ foi adicionado a $S$. Quando $x$ foi adicionado a $S$, a aresta $(x, y)$ foi relaxada, e pela <em>Propriedade da Convergência (Lema 24.14)</em>, passamos a ter $y.d = \\delta(s, y)$.</p>
              <p>Agora usamos o fato essencial de que <strong>todos os pesos de arestas são não negativos</strong>: como o subcaminho de $s$ a $y$ é parte do caminho mínimo $p$ de $s$ a $u$, temos $\\delta(s, y) \\le \\delta(s, u)$. Além disso, pela Propriedade do Limite Superior, $\\delta(s, u) \\le u.d$. Juntando as desigualdades:</p>
              $$y.d = \\delta(s, y) \\le \\delta(s, u) \\le u.d$$
              <p>Porém, como ambos $y$ e $u$ estavam em $Q$ e a linha 5 selecionou $u = \\text{EXTRACT-MIN}(Q)$, temos necessariamente $u.d \\le y.d$. Combinando $u.d \\le y.d$ com $y.d \\le u.d$, concluímos forçosamente que $u.d = y.d = \\delta(s, u) = \\delta(s, y)$, o que contradiz nossa hipótese de que $u.d > \\delta(s, u)$! Logo, $u.d = \\delta(s, u)$ no instante de inserção em $S$.</p>
            </li>
            <li><strong>Término:</strong> Na terminação, $Q = \\emptyset$, o que implica $S = V$. Logo, $v.d = \\delta(s, v)$ para todo $v \\in V$. $\\blacksquare$</li>
          </ul>
        </div>

        <div class="canonical-callout analogy">
          <span class="callout-tag">[ POR QUE DIJKSTRA FALHA COM ARESTAS NEGATIVAS? O CONTRAEXEMPLO CLÁSSICO ]</span>
          <p>Considere o grafo com 3 vértices: $V = \\{s, a, b\\}$ e arestas $s \\to a$ com peso $3$, $s \\to b$ com peso $5$, e $b \\to a$ com peso <strong>$-4$</strong>.</p>
          <ol>
            <li>No início, $s.d = 0$, $a.d = \\infty$, $b.d = \\infty$. Dijkstra extrai $s$, adiciona $s \\in S$ e relaxa $(s, a)$ e $(s, b)$, obtendo $a.d = 3$ e $b.d = 5$.</li>
            <li>A fila $Q$ contém $a$ (chave 3) e $b$ (chave 5). A ganância de Dijkstra escolhe $a = \\text{EXTRACT-MIN}(Q)$, insere $a \\in S$ e <strong>congela</strong> $a.d = 3$, presumindo que nenhuma rota futura poderá encurtá-lo (pois assume que qualquer rota passará por nós com custo $\\ge 3$).</li>
            <li>Em seguida, $b$ é extraído com $b.d = 5$. Dijkstra relaxa a aresta $b \\to a$: o custo via $b$ é $b.d + w(b, a) = 5 + (-4) = 1$!</li>
            <li>Como $a$ já foi processado e removido de $Q$, seu valor não é atualizado (ou, se atualizado, os sucessores de $a$ que já saíram de $Q$ foram relaxados com o valor obsoleto $3$). O caminho mínimo real é $\\langle s, b, a \\rangle$ com peso $1$, mas Dijkstra declara erroneamente $a.d = 3$!</li>
          </ol>
          <p>A presença de uma aresta negativa destrói a premissa de que caminhos crescem monotonicamente em comprimento acumulado, quebrando o argumento indutivo do Teorema 24.6.</p>
        </div>

        <h3>2. Análise de Complexidade de Dijkstra com Diferentes Estruturas de Dados</h3>
        <p>A eficiência do algoritmo de Dijkstra depende criticamente da estrutura de dados que implementa a fila de prioridades mínimas $Q$ para as operações <code>INSERT</code> ($|V|$ vezes), <code>EXTRACT-MIN</code> ($|V|$ vezes) e <code>DECREASE-KEY</code> (chamada implicitamente em <code>RELAX</code> até $|E|$ vezes):</p>
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;margin:1rem 0;font-size:0.88rem;">
            <thead>
              <tr style="border-bottom:2px solid var(--ink-primary);text-align:left;">
                <th style="padding:6px;">Estrutura da Fila $Q$</th>
                <th style="padding:6px;"><code>EXTRACT-MIN</code></th>
                <th style="padding:6px;"><code>DECREASE-KEY</code></th>
                <th style="padding:6px;">Tempo Total de Dijkstra</th>
                <th style="padding:6px;">Cenário de Aplicação Recomendado</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--border-thin);">
                <td style="padding:6px;"><strong>Arranjo Linear Não Ordenado</strong></td>
                <td style="padding:6px;">$O(V)$ (busca sequencial)</td>
                <td style="padding:6px;">$O(1)$ (acesso direto por índice)</td>
                <td style="padding:6px;">$O(V^2 + E) = \\mathbf{O(V^2)}$</td>
                <td style="padding:6px;"><strong>Grafos densos</strong> ($|E| = \\Theta(V^2)$), onde $V^2 \\le E \\lg V$.</td>
              </tr>
              <tr style="border-bottom:1px solid var(--border-thin);">
                <td style="padding:6px;"><strong>Heap Binário Mínimo</strong></td>
                <td style="padding:6px;">$O(\\lg V)$</td>
                <td style="padding:6px;">$O(\\lg V)$ (via vetor de posições)</td>
                <td style="padding:6px;">$O((V + E) \\lg V) = \\mathbf{O(E \\lg V)}$</td>
                <td style="padding:6px;">Grafos esparsos em geral, de fácil implementação prática.</td>
              </tr>
              <tr>
                <td style="padding:6px;"><strong>Heap de Fibonacci</strong></td>
                <td style="padding:6px;">$O(\\lg V)$ amortizado</td>
                <td style="padding:6px;">$O(1)$ amortizado</td>
                <td style="padding:6px;">$\\mathbf{O(V \\lg V + E)}$</td>
                <td style="padding:6px;"><strong>Assintoticamente ótimo</strong> para grafos esparsos onde $|E| = o(V^2)$.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>3. Sistemas de Restrições de Diferença e Programação Linear (Seção 24.4, pp. 543–548)</h3>
        <p>Em um problema geral de <strong>Programação Linear</strong>, desejamos otimizar uma função objetivo linear sujeita a um conjunto de inequações lineares. Em um <strong>sistema de restrições de diferença</strong>, cada linha da matriz $A$ contém exatamente um $+1$, exatamente um $-1$ e todos os demais coeficientes iguais a $0$. Assim, cada restrição $k$ sobre $n$ incógnitas $x_1, x_2, \\dots, x_n$ tem a forma canônica:</p>
        $$x_j - x_i \\le b_k$$
        <p>onde $1 \\le i, j \\le n$ e $b_k \\in \\mathbb{R}$. Tais sistemas surgem naturalmente em problemas de escalonamento de tarefas com janelas temporais de precedência (por exemplo: "a tarefa $j$ não pode iniciar mais que $b_k$ minutos após o início da tarefa $i$").</p>

        <h4>Construção do Grafo de Restrições</h4>
        <p>Podemos modelar o sistema com $n$ variáveis e $m$ restrições como um grafo dirigido ponderado $G = (V, E)$, denominado <strong>grafo de restrições</strong>:</p>
        <ul>
          <li>O conjunto de vértices é $V = \\{v_1, v_2, \\dots, v_n\\} \\cup \\{v_0\\}$, onde $v_0$ é um <strong>vértice fonte adicional</strong> que não corresponde a nenhuma variável do sistema original.</li>
          <li>O conjunto de arestas é $E = \\{(v_i, v_j) : x_j - x_i \\le b_k \\text{ é uma restrição}\\} \\cup \\{(v_0, v_i) : 1 \\le i \\le n\\}$.</li>
          <li>A função peso atribui $w(v_i, v_j) = b_k$ para cada restrição e $w(v_0, v_i) = 0$ para todas as arestas partindo de $v_0$.</li>
        </ul>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMAS 24.8 & 24.9 — SOLUBILIDADE DE RESTRIÇÕES DE DIFERENÇA VIA BELLMAN-FORD ]</span>
          <p>Dado um sistema de restrições de diferença $Ax \\le b$ com grafo de restrições $G = (V, E)$:</p>
          <ol>
            <li><strong>Teorema 24.8 (Solução Factível):</strong> Se $G$ não contém ciclos de pesos negativos, então o vetor:
            $$x = (\\delta(v_0, v_1), \\delta(v_0, v_2), \\dots, \\delta(v_0, v_n))$$
            é uma solução factível para o sistema de restrições de diferença.
            <br><em>Prova:</em> Considere qualquer restrição $x_j - x_i \\le b_k$, que corresponde à aresta $(v_i, v_j) \\in E$ com peso $w(v_i, v_j) = b_k$. Pela Desigualdade Triangular (Lema 24.10), $\\delta(v_0, v_j) \\le \\delta(v_0, v_i) + w(v_i, v_j) = \\delta(v_0, v_i) + b_k$. Reorganizando os termos:
            $$\\delta(v_0, v_j) - \\delta(v_0, v_i) \\le b_k$$
            Fazendo $x_j = \\delta(v_0, v_j)$ e $x_i = \\delta(v_0, v_i)$, a restrição é perfeitamente satisfeita!</li>
            <li><strong>Teorema 24.9 (Inconsistência por Ciclo Negativo):</strong> Se o grafo de restrições $G$ contém um ciclo de peso negativo, então o sistema de restrições de diferença <strong>não possui solução factível</strong>.
            <br><em>Prova:</em> Suponha que exista um ciclo $c = \\langle v_1, v_2, \\dots, v_k, v_1 \\rangle$ com peso total $\\sum_{i=1}^k w(v_i, v_{i+1}) < 0$ (onde $v_{k+1} = v_1$). As arestas do ciclo impõem as desigualdades $x_2 - x_1 \\le w(v_1, v_2)$, $x_3 - x_2 \\le w(v_2, v_3)$, ..., $x_1 - x_k \\le w(v_k, v_1)$. Somando todas as $k$ inequações, o lado esquerdo é uma soma telescópica que se anula identicamente:
            $$(x_2 - x_1) + (x_3 - x_2) + \\dots + (x_1 - x_k) = 0$$
            O lado direito resulta no peso total do ciclo $\\sum_{i=1}^k w(v_i, v_{i+1}) < 0$, produzindo o absurdo $0 \\le \\text{negativo} < 0$. Logo, nenhuma atribuição real para $x$ pode satisfazer o sistema. $\\blacksquare$</li>
          </ol>
        </div>

        <p><strong>Propriedades Adicionais da Solução:</strong> Se $x$ é uma solução factível, então para qualquer escalar $d \\in \\mathbb{R}$, o vetor $x + d = (x_1 + d, \\dots, x_n + d)$ também é uma solução factível, pois $(x_j + d) - (x_i + d) = x_j - x_i \\le b_k$. A solução obtida via caminhos mínimos a partir de $v_0$ produz a <strong>maior solução factível</strong> sujeita à condição $x_i \\le 0$ para todo $i$ (Exercício 24.4-4).</p>
      `
    },
{
      id: "u12-3",
      code: "UNIDADE 12.3 • CAP. 25.1 & 25.2",
      title: "Caminhos Mínimos entre Todos os Pares: Multiplicação Matricial, Floyd-Warshall e Fecho Transitivo",
      pages: "pp. 564–578",
      content: `
        <h3>1. O Problema de Todos os Pares e Formulação Matricial (pp. 558–560)</h3>
        <p>No problema de <strong>Caminhos Mínimos entre Todos os Pares (All-Pairs Shortest Paths — APSP)</strong>, dado um grafo dirigido ponderado $G = (V, E)$ com $|V| = n$ vértices e função peso $w : E \\to \\mathbb{R}$, desejamos computar uma matriz $D = (d_{ij})_{n \\times n}$ tal que cada entrada $d_{ij} = \\delta(i, j)$ represente o peso do caminho mínimo do vértice $i$ ao vértice $j$.</p>
        <p>A entrada é fornecida como uma matriz de pesos $W = (w_{ij})_{n \\times n}$ onde:</p>
        $$w_{ij} = \\begin{cases} 0 & \\text{se } i = j, \\\\ w(i, j) & \\text{se } i \\neq j \\text{ e } (i, j) \\in E, \\\\ \\infty & \\text{se } i \\neq j \\text{ e } (i, j) \\notin E. \\end{cases}$$
        <p>Além das distâncias, computamos uma <strong>matriz de predecessores</strong> $\\Pi = (\\pi_{ij})_{n \\times n}$, onde $\\pi_{ij} = \\text{NIL}$ se $i = j$ ou se não há caminho de $i$ a $j$, e $\\pi_{ij}$ é o predecessor de $j$ em algum caminho mínimo a partir de $i$. O procedimento a seguir imprime o caminho em tempo $O(V)$:</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">PRINT-ALL-PAIRS-SHORTEST-PATH(Π, i, j)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">se</span> i == j</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">   <span class="kw">imprimir</span> i</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">senão se</span> Π[i, j] == NIL</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   <span class="kw">imprimir</span> "não há caminho de " i " a " j</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">senão</span></span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">   PRINT-ALL-PAIRS-SHORTEST-PATH(Π, i, Π[i, j])</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">   <span class="kw">imprimir</span> j</span></div>
            </div>
          </div>

        <h3>2. Programação Dinâmica por Extensão de Arestas e Multiplicação Matricial (Seção 25.1, pp. 560–565)</h3>
        <p>Seja $l_{ij}^{(m)}$ o peso mínimo de qualquer caminho de $i$ a $j$ que contenha <strong>no máximo $m$ arestas</strong>. Para $m = 0$, temos $l_{ij}^{(0)} = 0$ se $i = j$, e $\\infty$ se $i \\neq j$. Para $m \\ge 1$, estendemos caminhos de $m-1$ arestas avaliando todas as possíveis arestas finais $(k, j)$:</p>
        $$l_{ij}^{(m)} = \\min_{1 \\le k \\le n} \\{ l_{ik}^{(m-1)} + w_{kj} \\}$$
        <p>Observe a fascinante equivalência com a multiplicação usual de matrizes $C = A \\cdot B$, onde $c_{ij} = \\sum_{k=1}^n a_{ik} \\cdot b_{kj}$. Substituindo a adição $+$ por $\\min$ e a multiplicação $\\times$ por $+$, a recorrência adota a estrutura de um produto matricial no <strong>semianel $(\\mathbb{R} \\cup \\{\\infty\\}, \\min, +)$</strong> (conhecido como <em>álgebra tropical</em> ou <em>min-plus algebra</em>):</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">EXTEND-SHORTEST-PATHS(L, W)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">n = L.linhas</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">seja</span> L' uma nova matriz n × n</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">para</span> i = 1 até n</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   <span class="kw">para</span> j = 1 até n</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">       l'_{ij} = ∞</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">       <span class="kw">para</span> k = 1 até n</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">           l'_{ij} = min(l'_{ij}, l_{ik} + w_{kj})</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content"><span class="kw">retornar</span> L'</span></div>
            </div>
          </div>
        <p>O algoritmo <code>EXTEND-SHORTEST-PATHS</code> executa claramente em tempo <strong>$\\Theta(n^3)$</strong>. Como nenhum caminho simples contém mais de $n - 1$ arestas, a matriz final de caminhos mínimos é $D = L^{(n-1)}$.</p>
        <ul>
          <li><strong>Versão Lenta (Iterativa):</strong> Calcula sucessivamente $L^{(1)} = W$, $L^{(2)} = L^{(1)} \\cdot W$, ..., $L^{(n-1)} = L^{(n-2)} \\cdot W$. Executa $n - 2$ multiplicações matriciais em tempo total $(n-1) \\times \\Theta(n^3) = \\mathbf{\\Theta(n^4)}$.</li>
          <li><strong>Versão Rápida por Quadratura Repetida (Faster APSP):</strong> Como a multiplicação matricial no semianel tropical é associativa, podemos computar potências de $W$ dobrando o expoente a cada passo: $W^2 = W \\cdot W$, $W^4 = W^2 \\cdot W^2$, $W^8 = W^4 \\cdot W^4$, ..., até $W^{2^{\\lceil \\lg(n-1) \\rceil}}$. Precisamos apenas de $\\lceil \\lg(n-1) \\rceil$ multiplicações! Tempo total: <strong>$\\Theta(n^3 \\lg n)$</strong>.</li>
        </ul>

        <h3>3. O Algoritmo de Floyd-Warshall (Seção 25.2, pp. 565–571)</h3>
        <p>O algoritmo de <strong>Floyd-Warshall</strong> supera a abordagem matricial anterior reformulando a estrutura dos subproblemas de Programação Dinâmica de maneira genial: em vez de limitar o <em>número de arestas</em>, ele restringe o <strong>conjunto de vértices que podem atuar como intermediários</strong> no caminho!</p>
        <p>Numeramos os vértices de $V$ como $\\{1, 2, \\dots, n\\}$. Um vértice intermediário de um caminho simples $p = \\langle v_1, v_2, \\dots, v_r \\rangle$ é qualquer vértice do caminho exceto suas extremidades $v_1$ e $v_r$. Para qualquer $k \\in \\{0, 1, \\dots, n\\}$, definimos:</p>
        <p style="text-align:center;">$d_{ij}^{(k)} =$ peso de um caminho mínimo de $i$ a $j$ cujos vértices intermediários pertencem exclusivamente a $\\{1, 2, \\dots, k\\}$.</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ RECORRÊNCIA E SUBESTRUTURA ÓTIMA DE FLOYD-WARSHALL (pp. 566–567) ]</span>
          <p>Para $k = 0$, o conjunto de intermediários é vazio $\\emptyset$, logo $d_{ij}^{(0)} = w_{ij}$. Para $k \\ge 1$, considere um caminho simples mínimo $p$ de $i$ a $j$ com intermediários em $\\{1, \\dots, k\\}$:</p>
          <ul>
            <li><strong>Caso 1 ($k$ não é intermediário de $p$):</strong> Todos os intermediários de $p$ já pertencem a $\\{1, \\dots, k-1\\}$. Logo, o peso de $p$ é exatamente $d_{ij}^{(k-1)}$.</li>
            <li><strong>Caso 2 ($k$ é intermediário de $p$):</strong> Como $p$ é simples, o vértice $k$ aparece exatamente uma vez. Decomponha $p$ em $i \\stackrel{p_1}{\\leadsto} k \\stackrel{p_2}{\\leadsto} j$. Pelo Lema 24.1 (Subestrutura Ótima), $p_1$ é um caminho mínimo de $i$ a $k$ e $p_2$ é um caminho mínimo de $k$ a $j$. Como nenhum vértice em $p_1$ ou $p_2$ visita $k$ internamente, todos os seus intermediários pertencem a $\\{1, \\dots, k-1\\}$. Logo, o peso de $p$ é $d_{ik}^{(k-1)} + d_{kj}^{(k-1)}$.</li>
          </ul>
          <p>Combinando ambos os casos mutualmente exclusivos e exaustivos:</p>
          $$d_{ij}^{(k)} = \\min\\left( d_{ij}^{(k-1)}, \\; d_{ik}^{(k-1)} + d_{kj}^{(k-1)} \\right)$$
        </div>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">FLOYD-WARSHALL(W)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">n = W.linhas</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">D^(0) = W</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">Π^(0) = matriz n × n inicializada com NIL onde w_ij == ∞ ou i == j, e i onde w_ij < ∞ e i ≠ j</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">para</span> k = 1 até n</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">   <span class="kw">seja</span> D^(k) uma nova matriz n × n</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">   <span class="kw">seja</span> Π^(k) uma nova matriz n × n</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">   <span class="kw">para</span> i = 1 até n</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">       <span class="kw">para</span> j = 1 até n</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">           <span class="kw">se</span> D^(k-1)[i, j] <= D^(k-1)[i, k] + D^(k-1)[k, j]</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">              D^(k)[i, j] = D^(k-1)[i, j]</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">              Π^(k)[i, j] = Π^(k-1)[i, j]</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">          <span class="kw">senão</span></span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">              D^(k)[i, j] = D^(k-1)[i, k] + D^(k-1)[k, j]</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">              Π^(k)[i, j] = Π^(k-1)[k, j]</span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content"><span class="kw">retornar</span> D^(n), Π^(n)</span></div>
            </div>
          </div>
        <p><strong>Complexidade Estrita e Otimização In-Place:</strong> O algoritmo consiste em 3 laços aninhados de $1$ a $n$, consumindo tempo <strong>$\\Theta(n^3)$</strong>. Como a linha $k$ e a coluna $k$ não se alteram na $k$-ésima iteração (pois $d_{ik}^{(k)} = \\min(d_{ik}^{(k-1)}, d_{ik}^{(k-1)} + d_{kk}^{(k-1)}) = d_{ik}^{(k-1)}$ admitindo que não há ciclos negativos com $d_{kk} < 0$), o cálculo pode ser executado <em>in-place</em> com uma única matriz de $n \\times n$ em espaço <strong>$\\Theta(n^2)$</strong>!</p>

        <h3>4. Fecho Transitivo de um Grafo Dirigido (Seção 25.2, pp. 571–573)</h3>
        <p>O <strong>fecho transitivo</strong> de um dígrafo $G = (V, E)$ é o grafo $G^* = (V, E^*)$ onde $(i, j) \\in E^*$ se e somente se existe um caminho dirigido de $i$ a $j$ em $G$. Podemos calcular a matriz de alcançabilidade booleana $T = (t_{ij})$ adaptando Floyd-Warshall para operadores lógicos booleanos ($\lor$ e $\land$):</p>
        $$t_{ij}^{(k)} = t_{ij}^{(k-1)} \\lor \\left( t_{ik}^{(k-1)} \\land t_{kj}^{(k-1)} \\right)$$
        <p>O algoritmo <code>TRANSITIVE-CLOSURE(G)</code> executa em $\\Theta(n^3)$, mas oferece uma vantagem arquitetural crítica na prática: ao substituir operações aritméticas por instruções bitwise a nível de palavra (processando 64 bits em paralelo), consome apenas $\\Theta(n^2)$ bits de memória e acelera a execução por um fator substancial.</p>
      `
    },
{
      id: "u12-4",
      code: "UNIDADE 12.4 • CAP. 25.3",
      title: "O Algoritmo de Johnson para Grafos Esparsos e a Técnica de Reponderação Conservativa",
      pages: "pp. 578–583",
      content: `
        <h3>1. Motivação: Por Que o Algoritmo de Johnson para Grafos Esparsos? (pp. 573–574)</h3>
        <p>Considere o custo assintótico para resolver caminhos mínimos entre todos os pares em um grafo $G = (V, E)$ com $|V| = n$ vértices:</p>
        <ul>
          <li>Se todos os pesos forem não negativos ($w \\ge 0$), podemos rodar o algoritmo de <strong>Dijkstra com Heap de Fibonacci</strong> $V$ vezes (uma para cada vértice de origem). O tempo total seria:
          $$|V| \\cdot O(V \\lg V + E) = \\mathbf{O(V^2 \\lg V + VE)}$$</li>
          <li>Em um <strong>grafo esparso</strong>, onde $|E| = O(V)$, esse tempo se torna $O(V^2 \\lg V)$, o que é assintoticamente muito superior aos $\\Theta(V^3)$ de Floyd-Warshall e aos $\\Theta(V^3 \\lg V)$ da multiplicação matricial!</li>
        </ul>
        <p>No entanto, se o grafo contiver pesos de arestas negativos, o algoritmo de Dijkstra não pode ser aplicado diretamente. Se tentarmos rodar Bellman-Ford $V$ vezes, o custo total será $|V| \\cdot O(VE) = O(V^2 E)$, que para grafos esparsos é $O(V^3)$ e para grafos densos pode atingir $O(V^4)$.</p>
        <p>A genialidade de Donald Johnson foi criar uma técnica de <strong>reponderação</strong> que transforma todas as arestas em valores não negativos sem distorcer as relações de caminhos mínimos, permitindo executar $V$ instâncias de Dijkstra!</p>

        <h3>2. A Falácia da Adição Simples vs. Reponderação por Potencial (pp. 574–576)</h3>
        <div class="canonical-callout analogy">
          <span class="callout-tag">[ A FALÁCIA DE GREENSTREET — POR QUE NÃO SOMAR UMA CONSTANTE? (Exercício 25.3-4) ]</span>
          <p>Seja $w_{\\min} = \\min_{(u,v) \\in E} w(u, v) < 0$. Uma sugestão ingênua é definir uma nova função peso somando uma constante compensatória: $w'(u, v) = w(u, v) + |w_{\\min}|$. Certamente $w'(u, v) \\ge 0$ para todas as arestas. Mas por que isso destrói a corretude dos caminhos mínimos?</p>
          <p>Considere dois caminhos alternativos entre $u$ e $v$:</p>
          <ul>
            <li>Caminho $p_1$: composto por <strong>1 aresta</strong> com peso original $w(p_1) = 2$.</li>
            <li>Caminho $p_2$: composto por <strong>3 arestas</strong> com pesos originais $1, -2, 1$, somando peso original $w(p_2) = 0$.</li>
          </ul>
          <p>Sob a função original $w$, $p_2$ é estritamente mais curto que $p_1$ ($0 < 2$). Agora aplique a reponderação ingênua com $|w_{\\min}| = 2$:</p>
          <ul>
            <li>Peso de $p_1$: $w'(p_1) = 2 + 2 = 4$.</li>
            <li>Peso de $p_2$: cada uma das 3 arestas recebe $+2$, logo $w'(p_2) = (1+2) + (-2+2) + (1+2) = 3 + 0 + 3 = 6$!</li>
          </ul>
          <p>Sob $w'$, $p_1$ passa a ter peso menor que $p_2$ ($4 < 6$)! A adição constante penaliza desproporcionalmente caminhos que possuem mais arestas, distorcendo irreversivelmente a estrutura ótima de caminhos mínimos.</p>
        </div>

        <h3>3. Teoria da Reponderação Conservativa de Johnson</h3>
        <p>Para preservar caminhos mínimos, a reponderação deve empregar uma <strong>função de potencial</strong> $h : V \\to \\mathbb{R}$ associada aos vértices:</p>
        $$\\hat{w}(u, v) = w(u, v) + h(u) - h(v)$$

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ LEMAS 25.1 & 25.2 — PRESERVAÇÃO DE CAMINHOS MÍNIMOS E CICLOS (p. 574) ]</span>
          <p>Dada uma função peso $w : E \\to \\mathbb{R}$ e qualquer função potencial $h : V \\to \\mathbb{R}$, defina $\\hat{w}(u, v) = w(u, v) + h(u) - h(v)$.</p>
          <ol>
            <li><strong>Lema 25.1 (Preservação de Caminhos Mínimos):</strong> Seja $p = \\langle v_0, v_1, \\dots, v_k \\rangle$ qualquer caminho de $v_0$ a $v_k$. Então:
            $$\\hat{w}(p) = w(p) + h(v_0) - h(v_k)$$
            Em particular, $p$ é um caminho mínimo de $v_0$ a $v_k$ sob a função peso $w$ se e somente se $p$ é um caminho mínimo sob $\\hat{w}$.
            <br><em>Demonstração Telescópica:</em>
            $$\\hat{w}(p) = \\sum_{i=1}^k \\hat{w}(v_{i-1}, v_i) = \\sum_{i=1}^k \\left( w(v_{i-1}, v_i) + h(v_{i-1}) - h(v_i) \\right) = \\sum_{i=1}^k w(v_{i-1}, v_i) + \\sum_{i=1}^k (h(v_{i-1}) - h(v_i))$$
            A segunda soma é telescópica: $(h(v_0) - h(v_1)) + (h(v_1) - h(v_2)) + \\dots + (h(v_{k-1}) - h(v_k)) = h(v_0) - h(v_k)$. Portanto, $\\hat{w}(p) = w(p) + h(v_0) - h(v_k)$. Como $h(v_0)$ e $h(v_k)$ são fixos para quaisquer caminhos ligando $v_0$ a $v_k$, qualquer caminho que minimiza $w(p)$ também minimiza $\\hat{w}(p)$.</li>
            <li><strong>Lema 25.2 (Invariância do Peso de Ciclos):</strong> Para qualquer ciclo $c = \\langle v_0, v_1, \\dots, v_k \\rangle$ onde $v_0 = v_k$, temos:
            $$\\hat{w}(c) = w(c) + h(v_0) - h(v_k) = w(c) + 0 = w(c)$$
            Portanto, $G$ possui um ciclo de peso negativo sob $w$ se e somente se possui um ciclo de peso negativo sob $\\hat{w}$.</li>
          </ol>
        </div>

        <h4>Cálculo da Função Potencial $h(v)$ com Bellman-Ford</h4>
        <p>Desejamos que $\\hat{w}(u, v) \\ge 0$ para toda aresta $(u, v) \\in E$. Reescrevendo:</p>
        $$w(u, v) + h(u) - h(v) \\ge 0 \\iff h(v) \\le h(u) + w(u, v)$$
        <p>Essa é exatamente a <strong>Desigualdade Triangular (Lema 24.10)</strong>! Para garantir que todos os vértices sejam alcançáveis a partir de uma fonte comum, Johnson constrói um grafo estendido $G' = (V', E')$ adicionando um novo vértice $s \\notin V$ e arestas dirigidas $(s, v)$ com peso $w(s, v) = 0$ para todo $v \\in V$. Executa-se <code>BELLMAN-FORD(G', w, s)</code> e define-se:</p>
        $$h(v) = \\delta(s, v) \\quad \\text{para todo } v \\in V'$$
        <p>Pela Desigualdade Triangular em $G'$, temos $\\delta(s, v) \\le \\delta(s, u) + w(u, v)$, o que garante $h(v) \\le h(u) + w(u, v)$, assegurando $\\hat{w}(u, v) \\ge 0$!</p>

        <h3>4. O Pseudocódigo do Algoritmo de Johnson e Análise de Complexidade</h3>
        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">JOHNSON(G, w)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">produzir G' onde G'.V = G.V ∪ {s} e G'.E = G.E ∪ {(s, v) : v ∈ G.V}</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">para cada</span> v ∈ G.V: w(s, v) = 0</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">se</span> BELLMAN-FORD(G', w, s) == FALSE</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   <span class="kw">imprimir</span> "o grafo de entrada contém um ciclo de peso negativo"</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">   <span class="kw">retornar</span> NIL</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">senão</span></span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">   <span class="kw">para cada</span> vértice v ∈ G'.V: h(v) = δ(s, v) calculado por Bellman-Ford</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">   <span class="kw">para cada</span> aresta (u, v) ∈ G.E: ŵ(u, v) = w(u, v) + h(u) - h(v)</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">   <span class="kw">seja</span> D uma nova matriz |V| × |V|</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">  <span class="kw">para cada</span> vértice u ∈ G.V</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">      DIJKSTRA(G, ŵ, u) <span class="kw">para</span> calcular δ̂(u, v) <span class="kw">para</span> todo v ∈ G.V</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">      <span class="kw">para cada</span> vértice v ∈ G.V</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">          d_uv = δ̂(u, v) + h(v) - h(u)</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">  <span class="kw">retornar</span> D</span></div>
            </div>
          </div>

        <p><strong>Análise Detalhada de Complexidade:</strong></p>
        <ul>
          <li>A construção de $G'$ custa $O(V + E)$.</li>
          <li>A execução de <code>BELLMAN-FORD(G', w, s)</code> sobre $|V'| = |V| + 1$ vértices e $|E'| = |E| + |V|$ arestas consome tempo <strong>$O(VE)$</strong>.</li>
          <li>O cálculo dos novos pesos $\\hat{w}$ custa $O(E)$.</li>
          <li>O laço das linhas 10–13 executa $|V|$ vezes o algoritmo de Dijkstra. Usando um <strong>Heap de Fibonacci</strong>, cada chamada consome $O(V \\lg V + E)$, totalizando $|V| \\cdot O(V \\lg V + E) = \\mathbf{O(V^2 \\lg V + VE)}$. (Se usarmos um heap binário convencional, o tempo é $O(VE \\lg V)$).</li>
          <li>A reconstrução da matriz $D$ na linha 13 custa $O(V^2)$.</li>
        </ul>
        <p>Tempo total assintótico: <strong>$O(V^2 \\lg V + VE)$</strong>. Em grafos esparsos ($|E| = O(V)$), Johnson executa em impressionantes $O(V^2 \\lg V)$, superando com folga os $\\Theta(V^3)$ de Floyd-Warshall!</p>
      `
    },
{
      id: "u12-5",
      code: "UNIDADE 12.5 • CAP. 26.1, 26.2 & 26.3",
      title: "Redes de Fluxo, Teorema do Fluxo Máximo–Corte Mínimo, Edmonds-Karp e Emparelhamento Bipartido",
      pages: "pp. 587–612",
      content: `
        <h3>1. Redes de Fluxo e Conservação de Material (Seção 26.1, pp. 587–592)</h3>
        <p>Uma <strong>rede de fluxo</strong> é um grafo dirigido $G = (V, E)$ no qual cada aresta $(u, v) \\in E$ tem uma <strong>capacidade</strong> não negativa $c(u, v) \\ge 0$. Se $(u, v) \\notin E$, convenciona-se $c(u, v) = 0$. Distinguem-se dois vértices especiais: uma <strong>fonte</strong> $s$ e um <strong>sorvedouro</strong> $t$. Assume-se que todo vértice $v \\in V$ pertence a algum caminho de $s$ a $t$ ($s \\leadsto v \\leadsto t$), o que implica que $G$ é conexo e $|E| \\ge |V| - 1$. Por conveniência, assume-se que não há arestas antiparalelas (se existirem arestas $(u, v)$ e $(v, u)$, decompõe-se uma delas inserindo um nó intermediário $v'$ com $c(u, v') = c(v', v) = c(u, v)$).</p>
        <p>Um <strong>fluxo</strong> em $G$ é uma função real $f : V \\times V \\to \\mathbb{R}$ que satisfaz duas propriedades fundamentais:</p>
        <ol>
          <li><strong>Restrição de Capacidade:</strong> Para todos os vértices $u, v \\in V$, temos $0 \\le f(u, v) \\le c(u, v)$.</li>
          <li><strong>Conservação de Fluxo:</strong> Para todo vértice $u \\in V - \\{s, t\\}$, o fluxo total que entra iguala o fluxo que sai:
          $$\\sum_{v \\in V} f(v, u) = \\sum_{v \\in V} f(u, v)$$</li>
        </ol>
        <p>O <strong>valor</strong> de um fluxo $f$, denotado por $|f|$, é definido como o fluxo líquido que sai da fonte $s$:</p>
        $$|f| = \\sum_{v \\in V} f(s, v) - \\sum_{v \\in V} f(v, s)$$
        <p>No <strong>Problema do Fluxo Máximo</strong>, desejamos encontrar um fluxo viável cujo valor $|f|$ seja maximal.</p>

        <h3>2. Redes Residuais, Caminhos Aumentadores e Cancelamento de Fluxo</h3>
        <p>Dada uma rede $G$ e um fluxo $f$, a <strong>rede residual</strong> $G_f = (V, E_f)$ representa as capacidades adicionais disponíveis para rotear fluxo ou redirecionar fluxo existente. A <strong>capacidade residual</strong> $c_f(u, v)$ é definida por:</p>
        $$c_f(u, v) = \\begin{cases} c(u, v) - f(u, v) & \\text{se } (u, v) \\in E, \\\\ f(v, u) & \\text{se } (v, u) \\in E, \\\\ 0 & \\text{caso contrário.} \\end{cases}$$
        <p>O conjunto de arestas residuais consiste naquelas com capacidade estritamente positiva: $E_f = \\{(u, v) \\in V \\times V : c_f(u, v) > 0\\}$.</p>
        <ul>
          <li><strong>Arestas para a Frente ($(u, v) \\in E$):</strong> Permitem empurrar mais fluxo até saturar a capacidade original ($c(u, v) - f(u, v)$).</li>
          <li><strong>Arestas para Trás ($(v, u) \\in E$):</strong> Possuem capacidade residual $f(v, u)$, permitindo <strong>cancelar ou desfazer</strong> fluxo previamente enviado de $v$ para $u$, enviando material para rotas mais eficientes!</li>
        </ul>
        <p>Um <strong>caminho aumentador</strong> $p$ é um caminho simples de $s$ a $t$ na rede residual $G_f$. A <strong>capacidade residual do caminho</strong> (seu gargalo) é dada por $c_f(p) = \\min \\{ c_f(u, v) : (u, v) \\in p \\} > 0$. Pelo <strong>Lema 26.2 (p. 593)</strong>, aumentar o fluxo ao longo de $p$ gera um novo fluxo viável $f \\uparrow f_p$ com valor $|f \\uparrow f_p| = |f| + c_f(p) > |f|$.</p>

        <h3>3. Cortes em Redes e o Teorema do Fluxo Máximo–Corte Mínimo (Seção 26.2, pp. 594–597)</h3>
        <p>Um <strong>corte</strong> $(S, T)$ de uma rede de fluxo $G = (V, E)$ é uma partição de $V$ em dois subconjuntos disjuntos $S$ e $T = V - S$ tais que $s \\in S$ e $t \\in T$.</p>
        <ul>
          <li>O <strong>fluxo líquido através do corte</strong> $(S, T)$ é $f(S, T) = \\sum_{u \\in S} \\sum_{v \\in T} f(u, v) - \\sum_{u \\in S} \\sum_{v \\in T} f(v, u)$.</li>
          <li>A <strong>capacidade do corte</strong> $(S, T)$ é a soma apenas das capacidades que saem de $S$ para $T$:
          $$c(S, T) = \\sum_{u \\in S} \\sum_{v \\in T} c(u, v)$$</li>
        </ul>
        <p>Pelo <strong>Lema 26.4 (p. 595)</strong>, para <em>qualquer</em> corte $(S, T)$, o fluxo líquido através do corte é exatamente igual ao valor do fluxo: $f(S, T) = |f|$. Como consequência imediata (<strong>Corolário 26.5</strong>), como $f(u, v) \\le c(u, v)$ e $f(v, u) \\ge 0$, temos invariavelmente:</p>
        $$|f| = f(S, T) \\le c(S, T)$$
        <p>A capacidade de qualquer corte atua como um <strong>limite superior</strong> para o valor de qualquer fluxo viável na rede!</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 26.6 — TEOREMA DO FLUXO MÁXIMO–CORTE MÍNIMO (pp. 596–597) ]</span>
          <p>Seja $f$ um fluxo em uma rede de fluxo $G = (V, E)$ com fonte $s$ e sorvedouro $t$. As três condições a seguir são <strong>matematicamente equivalentes</strong>:</p>
          <ol>
            <li>$f$ é um <strong>fluxo máximo</strong> em $G$.</li>
            <li>A rede residual $G_f$ <strong>não contém nenhum caminho aumentador</strong> de $s$ a $t$.</li>
            <li>Existe algum corte $(S, T)$ de $G$ tal que <strong>$|f| = c(S, T)$</strong>. (Esse corte $(S, T)$ é obrigatoriamente um corte de capacidade mínima em $G$).</li>
          </ol>
          <p><strong>Demonstração Rigorosa da Cadeia de Implicações (CLRS, p. 596):</strong></p>
          <ul>
            <li><strong>(1) $\\Rightarrow$ (2):</strong> Suponha que $f$ seja um fluxo máximo. Se $G_f$ contivesse um caminho aumentador $p$, poderíamos definir o fluxo aumentado $f' = f \\uparrow f_p$, cujo valor seria $|f'| = |f| + c_f(p) > |f|$, contradizendo a maximalidade de $f$. Logo, $G_f$ não contém caminhos aumentadores.</li>
            <li><strong>(2) $\\Rightarrow$ (3):</strong> Suponha que $G_f$ não contenha caminho aumentador de $s$ a $t$. Defina:
            $$S = \\{v \\in V : \\text{existe um caminho de } s \\text{ a } v \\text{ na rede residual } G_f\\} \\quad \\text{e} \\quad T = V - S$$
            Como $s$ alcança a si mesmo por um caminho de $0$ arestas, $s \\in S$. Como não há caminho de $s$ a $t$ em $G_f$, $t \\notin S$, logo $t \\in T$. Portanto, $(S, T)$ é um corte válido.
            <br>Para qualquer par de vértices $u \\in S$ e $v \\in T$, não pode existir aresta residual de $u$ para $v$ em $E_f$ (caso contrário, como $s \\leadsto u$ em $G_f$, poderíamos estender o caminho até $v$, forçando $v \\in S$). Como $c_f(u, v) = 0$:
            <ul>
              <li>Se $(u, v) \\in E$, devemos ter $c(u, v) - f(u, v) = 0 \\implies f(u, v) = c(u, v)$ (aresta saturada).</li>
              <li>Se $(v, u) \\in E$, devemos ter $f(v, u) = 0$ (nenhum fluxo reverso enviado).</li>
            </ul>
            Calculando o fluxo líquido através do corte $(S, T)$:
            $$f(S, T) = \\sum_{u \\in S} \\sum_{v \\in T} f(u, v) - \\sum_{u \\in S} \\sum_{v \\in T} f(v, u) = \\sum_{u \\in S} \\sum_{v \\in T} c(u, v) - 0 = c(S, T)$$
            Pelo Lema 26.4, $|f| = f(S, T) = c(S, T)$!</li>
            <li><strong>(3) $\\Rightarrow$ (1):</strong> Pelo Corolário 26.5, $|f| \\le c(S', T')$ para todos os cortes $(S', T')$. Se $|f| = c(S, T)$ para um corte específico, nenhum fluxo pode ultrapassar essa capacidade, logo $f$ é comprovadamente um fluxo máximo e $(S, T)$ é um corte de capacidade mínima. $\\blacksquare$</li>
          </ul>
        </div>

        <h3>4. O Algoritmo de Edmonds-Karp e Análise em $O(VE^2)$ (pp. 597–601)</h3>
        <p>O método clássico de <strong>Ford-Fulkerson</strong> simplesmente repete a busca de caminhos aumentadores em $G_f$ até que nenhum caminho reste. Se as capacidades forem números inteiros, cada aumento incrementa $|f|$ em pelo menos $1$ unidade, consumindo tempo $O(E |f^*|)$. Porém, se as capacidades forem grandes ou irracionais, o algoritmo pode convergir com lentidão patológica ou até falhar em convergir para o valor máximo (exemplo de Zwick, p. 598).</p>
        <p>O <strong>Algoritmo de Edmonds-Karp</strong> especializa Ford-Fulkerson escolhendo a cada iteração o caminho aumentador $p$ como o <strong>caminho mais curto de $s$ a $t$ em número de arestas na rede residual $G_f$</strong>, computado via <strong>Busca em Largura (BFS)</strong>.</p>

        <div class="canonical-callout invariant">
          <span class="callout-tag">[ TEOREMA 26.8 — COMPLEXIDADE POLINOMIAL O(VE²) DE EDMONDS-KARP ]</span>
          <p>A prova de que Edmonds-Karp executa em tempo estritamente polinomial independe das capacidades numéricas e repousa em dois resultados essenciais:</p>
          <ol>
            <li><strong>Lema 26.7 (Monotonia das Distâncias mais Curtas):</strong> Durante a execução de Edmonds-Karp, para todo vértice $v \\in V - \\{s, t\\}$, a menor distância $\\delta_f(s, v)$ em número de arestas na rede residual $G_f$ <em>nunca decresce</em> após cada aumento de fluxo.</li>
            <li><strong>Teorema 26.8 (Limite de Arestas Críticas):</strong> Dizemos que uma aresta $(u, v)$ no caminho aumentador $p$ é <em>crítica</em> se $c_f(u, v) = c_f(p)$ (ela limita o gargalo e satura completamente, desaparecendo de $E_f$). Cada uma das $|E|$ arestas da rede pode tornar-se crítica no máximo <strong>$|V| / 2$ vezes</strong> ao longo de toda a execução do algoritmo!
              <p><em>Justificativa:</em> Quando $(u, v)$ se torna crítica, temos $\\delta_f(s, v) = \\delta_f(s, u) + 1$. Para que $(u, v)$ possa se tornar crítica novamente no futuro, devemos antes enviar fluxo reverso de $v$ para $u$, momento em que $\\delta_{f'}(s, u) = \\delta_{f'}(s, v) + 1$. Pela monotonia das distâncias (Lema 26.7), $\\delta_{f'}(s, v) \\ge \\delta_f(s, v)$. Logo, $\\delta_{f'}(s, u) \\ge \\delta_f(s, u) + 2$. A cada ciclo de criticidade, a distância de $s$ a $u$ cresce em pelo menos $2$ unidades. Como caminhos simples têm no máximo $|V| - 2$ vértices intermediários, a distância máxima é $|V| - 2$, limitando o número de vezes a $(|V| - 2)/2 + 1 \\le |V| / 2$.</p>
            </li>
          </ol>
          <p>Como há $2|E|$ arestas possíveis na rede residual e cada uma torna-se crítica no máximo $|V| / 2$ vezes, o <strong>número total de caminhos aumentadores é $O(VE)$</strong>. Como cada BFS consome $O(E)$, o tempo total de Edmonds-Karp é <strong>$O(VE^2)$</strong>! $\\blacksquare$</p>
        </div>

        <h3>5. Emparelhamento Bipartido Máximo (Seção 26.3, pp. 601–605)</h3>
        <p>Dado um grafo não dirigido bipartido $G = (V, E)$ onde $V = L \\cup R$ ($L \\cap R = \\emptyset$) e toda aresta conecta um vértice de $L$ a um vértice de $R$, um <strong>emparelhamento</strong> é um subconjunto de arestas $M \\subseteq E$ tal que nenhum vértice incide em mais de uma aresta de $M$. Desejamos encontrar um emparelhamento de cardinalidade máxima $|M|$.</p>
        <p>Construímos a rede de fluxo correspondente $G' = (V', E')$ adicionando uma fonte $s$ e um sorvedouro $t$:</p>
        <ul>
          <li>$V' = V \\cup \\{s, t\\}$.</li>
          <li>$E' = \\{(s, u) : u \\in L\\} \\cup \\{(u, v) : (u, v) \\in E\\} \\cup \\{(v, t) : v \\in R\\}$, com todas as arestas orientadas de $s \\to L \\to R \\to t$.</li>
          <li>Todas as arestas de $E'$ recebem <strong>capacidade unitária $c(u, v) = 1$</strong>.</li>
        </ul>
        <p>Pelo <strong>Teorema da Integralidade 26.10 (p. 604)</strong>, se todas as capacidades forem inteiras, o fluxo máximo calculado por Ford-Fulkerson ou Edmonds-Karp atribui valores estritamente inteiros $f(u, v) \\in \\{0, 1\\}$. As arestas entre $L$ e $R$ com $f(u, v) = 1$ correspondem exatamente a um emparelhamento máximo $M$, com $|M| = |f^*|$. Como o valor do fluxo máximo é no máximo $\\min(|L|, |R|) \\le |V|/2$, o número de aumentos é $O(V)$, resultando em complexidade total <strong>$O(VE)$</strong>!</p>
      `
    },
{
      id: "u12-6",
      code: "UNIDADE 12.6 • CAP. 26.4 & 26.5",
      title: "Algoritmos de Empurrar-Reetiquetar (Generic Push-Relabel) e Reetiquetar para a Frente (Relabel-to-Front)",
      pages: "pp. 612–636",
      content: `
        <h3>1. A Filosofia de Operações Locais e Pré-Fluxos (Seção 26.4, pp. 612–617)</h3>
        <p>Os métodos baseados em Ford-Fulkerson examinam a rede residual $G_f$ <em>globalmente</em> a cada iteração para encontrar um caminho completo de $s$ a $t$. Em redes extensas, essa busca global consome tempo substancial. Os algoritmos de <strong>Empurrar-Reetiquetar (Push-Relabel)</strong>, concebidos por Andrew Goldberg e Robert Tarjan, operam de maneira radicalmente diferente: eles manipulam <strong>um único vértice por vez</strong>, inspecionando exclusivamente seus vizinhos imediatos na rede residual.</p>
        <p>Para viabilizar decisões puramente locais, o algoritmo relaxa temporariamente a lei de conservação de fluxo, admitindo a existência de um <strong>pré-fluxo</strong> $f$ que satisfaz a restrição de capacidade ($0 \\le f(u, v) \\le c(u, v)$), mas permite que mais fluxo entre em um vértice do que dele saia. O <strong>excesso de fluxo</strong> em um vértice $u \\in V$ é definido por:</p>
        $$e(u) = \\sum_{v \\in V} f(v, u) - \\sum_{v \\in V} f(u, v)$$
        <p>Um vértice intermediário $u \\in V - \\{s, t\\}$ é dito <strong>ativo</strong> (ou <em>overflowing</em>) se seu excesso for estritamente positivo: $e(u) > 0$.</p>

        <h3>2. Funções de Altura Válidas e Mecânica Hidrodinâmica</h3>
        <p>Para direcionar o excesso de fluido em direção ao sorvedouro $t$ (ou devolvê-lo à fonte $s$ caso o caminho esteja bloqueado), cada vértice $u \\in V$ recebe uma etiqueta de <strong>altura</strong> inteira $h(u) \\in \\mathbb{N}$. Uma função de altura $h : V \\to \\mathbb{N}$ é dita <strong>válida</strong> se:</p>
        <ol>
          <li>$h(s) = |V|$ e $h(t) = 0$.</li>
          <li>Para toda aresta residual $(u, v) \\in E_f$, temos:
          $$h(u) \\le h(v) + 1$$</li>
        </ol>
        <p>A condição $h(u) \\le h(v) + 1$ garante que o fluido só pode "escorrer ladeira abaixo". Uma aresta residual $(u, v) \\in E_f$ pode subir qualquer número de níveis de altura ($h(v) > h(u)$), permanecer no mesmo nível ($h(v) = h(u)$), ou descer no máximo $1$ nível ($h(u) = h(v) + 1$).</p>

        <div class="canonical-callout lemma">
          <span class="callout-tag">[ LEMA 26.13 — AUSÊNCIA DE CAMINHOS AUMENTADORES (p. 615) ]</span>
          <p>Se $f$ é um pré-fluxo e $h$ é uma função de altura válida para $f$, então <strong>não existe nenhum caminho direcionado de $s$ a $t$ na rede residual $G_f$</strong>.</p>
          <p><em>Demonstração:</em> Suponha, por contradição, que existisse um caminho simples $p = \\langle v_0, v_1, \\dots, v_k \\rangle$ de $s = v_0$ a $t = v_k$ em $G_f$. Como $p$ é simples, o número de arestas é $k < |V|$. Para cada aresta $(v_{i-1}, v_i) \\in p$, a validade da função de altura exige $h(v_{i-1}) \\le h(v_i) + 1$, isto é, $h(v_{i-1}) - h(v_i) \\le 1$. Somando essas desigualdades ao longo de todo o caminho:</p>
          $$h(s) - h(t) = \\sum_{i=1}^k (h(v_{i-1}) - h(v_i)) \\le k < |V|$$
          <p>Porém, pela definição de função de altura válida, temos $h(s) = |V|$ e $h(t) = 0$, logo $h(s) - h(t) = |V| - 0 = |V|$. A desigualdade $|V| < |V|$ é uma contradição flagrante! Portanto, nenhum caminho de $s$ a $t$ pode existir em $G_f$. $\\blacksquare$</p>
        </div>

        <h3>3. As Operações Básicas: PUSH e RELABEL</h3>
        <p>O algoritmo atua sobre vértices ativos aplicando duas operações elementares:</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">PUSH(u, v)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num"></span><span class="line-content"><span class="cmt">// Pré-condição: u é ativo (e(u) > 0), c_f(u, v) > 0 e h(u) == h(v) + 1</span></span></div>
              <div class="code-line"><span class="line-num">1</span><span class="line-content">Δ = min(e(u), c_f(u, v))</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">se</span> (u, v) ∈ E</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   f(u, v) = f(u, v) + Δ</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">senão</span></span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">   f(v, u) = f(v, u) - Δ</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">e(u) = e(u) - Δ</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">e(v) = e(v) + Δ</span></div>
            </div>
          </div>
        <p>A operação <code>PUSH(u, v)</code> é dita <strong>saturante</strong> se $\\Delta = c_f(u, v)$ (a aresta desaparece da rede residual $G_f$) e <strong>não saturante</strong> se $\\Delta = e(u) < c_f(u, v)$ (o excesso de $u$ é totalmente esgotado, $e(u) = 0$).</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">RELABEL(u)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num"></span><span class="line-content"><span class="cmt">// Pré-condição: u é ativo (e(u) > 0) e, para todo (u, v) ∈ E_f, temos h(u) ≤ h(v)</span></span></div>
              <div class="code-line"><span class="line-num">1</span><span class="line-content">h(u) = 1 + min { h(v) : (u, v) ∈ E_f }</span></div>
            </div>
          </div>
        <p>A operação <code>RELABEL(u)</code> "eleva" a altura do vértice $u$ no mínimo em $+1$, criando pelo menos uma aresta residual em descida permitindo futuros empurrões.</p>

        <h3>4. O Algoritmo Genérico e Limites de Operações (pp. 617–623)</h3>
        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">GENERIC-PUSH-RELABEL(G)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">INITIALIZE-PREFLOW(G, s)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">enquanto</span> existir vértice ativo u ∈ G.V - {s, t}</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   selecionar uma operação aplicável PUSH(u, v) ou RELABEL(u) e executá-la</span></div>
            </div>
          </div>
        <p>A rotina <code>INITIALIZE-PREFLOW(G, s)</code> define $h(s) = |V|$, $h(v) = 0$ para $v \\neq s$, satura todas as arestas saindo de $s$ ($f(s, v) = c(s, v)$ e $e(v) = c(s, v)$) e define $f(u, v) = 0$ para todas as demais arestas.</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMAS 26.16 A 26.19 — LIMITES DE OPERAÇÕES DO PUSH-RELABEL GENÉRICO ]</span>
          <p>Seja $G = (V, E)$ uma rede de fluxo com $|V| = n$ e $|E| = m$:</p>
          <ul>
            <li><strong>Lema 26.14 & 26.15 (Limite Superior de Altura):</strong> Para qualquer vértice ativo $u$, existe um caminho dirigido de $u$ a $s$ em $G_f$. Consequentemente, a altura de qualquer vértice $u \\in V - \\{s, t\\}$ nunca ultrapassa <strong>$2|V| - 1$</strong> (pois $h(u) \\le h(s) + (|V| - 1) = 2|V| - 1$).</li>
            <li><strong>Teorema 26.16 (Limite de RELABEL):</strong> Como cada um dos $|V| - 2$ vértices intermediários parte de altura $0$ e pode atingir no máximo $2|V| - 1$, o número total de operações <code>RELABEL</code> em toda a execução é estritamente menor que <strong>$2|V|^2$</strong>.</li>
            <li><strong>Teorema 26.17 (Empurrões Saturantes):</strong> Entre dois empurrões saturantes consecutivos na mesma aresta residual $(u, v)$, a altura de $u$ deve crescer em pelo menos $2$ unidades e a de $v$ em pelo menos $2$ unidades. Logo, o número total de empurrões saturantes é no máximo <strong>$2|V||E|$</strong>.</li>
            <li><strong>Teorema 26.18 (Empurrões Não Saturantes):</strong> Usando a função potencial $\\Phi = \\sum_{u \\in V : e(u) > 0} h(u)$, cada empurrão não saturante em $u$ descarrega $e(u)$ e reduz $\\Phi$ em pelo menos $h(u) \\ge 1$, enquanto reetiquetagens e empurrões saturantes elevam $\\Phi$. O número total de empurrões não saturantes é limitado a <strong>$4|V|^2 |E|$</strong>.</li>
            <li><strong>Teorema 26.19 (Complexidade Total):</strong> O algoritmo <code>GENERIC-PUSH-RELABEL</code> executa em tempo <strong>$O(V^2 E)$</strong>! $\\blacksquare$</li>
          </ul>
        </div>

        <h3>5. O Algoritmo de Reetiquetar para a Frente (Relabel-to-Front em $O(V^3)$, pp. 624–636)</h3>
        <p>O algoritmo <strong>Relabel-to-Front (Reetiquetar para a Frente)</strong> atinge a complexidade ideal de <strong>$O(V^3)$</strong> organizando os vértices em uma lista encadeada dinâmica $L$ que mantém uma ordem topológica aproximada sobre a rede residual. Cada vértice mantém um ponteiro $u.\\text{corrente}$ para sua lista de vizinhos residuais.</p>
        <p>A rotina <code>DISCHARGE(u)</code> descarrega o excesso de $u$ empurrando fluxo pelas arestas admissíveis $(u, v)$. Se a lista de adjacência de $u$ se esgota sem zerar $e(u)$, executa-se <code>RELABEL(u)</code> e o ponteiro $u.\\text{corrente}$ é reiniciado no início da lista de vizinhos.</p>
        <p>A grande sacada do algoritmo: quando um vértice $u$ tem sua altura aumentada por <code>RELABEL(u)</code> durante a descarga, ele é <strong>movido imediatamente para a cabeça da lista $L$</strong> (<em>relabel to front</em>). Como os vértices com maiores alturas ficam concentrados na frente de $L$, eles transferem seu excesso progressivamente para vértices de menor altura sem gerar ciclos de empurrões desnecessários!</p>
        <p>O <strong>Teorema 26.24 (p. 631)</strong> prova que a execução de <code>RELABEL-TO-FRONT</code> realiza no máximo $O(V^3)$ empurrões não saturantes e tempo total <strong>$O(V^3)$</strong>, constituindo um dos algoritmos de fluxo mais rápidos e elegantes da literatura clássica de algoritmos.</p>
      `
    }
  ];


  /* ========================================================================
     BANCADA INTERATIVA DUPLA DO MÓDULO 12:
     (1) SIMULADOR COMPARATIVO DE CAMINHOS MÍNIMOS: DIJKSTRA vs. BELLMAN-FORD
     (2) SIMULADOR DE FLUXO MÁXIMO: EDMONDS-KARP, REDE RESIDUAL & CORTE MÍNIMO
     ======================================================================== */
  function initWorkbenches() {
    const mount = document.getElementById("workbench-mod12-mount");
    if (!mount) return;

    mount.innerHTML = `
      <div class="workbench-box" style="margin-top:1.5rem;">
        <div class="workbench-header">
          <span class="workbench-title">[ BANCADA INTERATIVA DUPLA • MÓDULO 12: CAMINHOS MÍNIMOS (CAP. 24–25) & FLUXO MÁXIMO (CAP. 26) ]</span>
          <span class="bracket-tag emerald">DIJKSTRA • BELLMAN-FORD • EDMONDS-KARP • CORTE MÍNIMO</span>
        </div>
        <div class="workbench-body">
          <div style="display:flex;gap:0.6rem;flex-wrap:wrap;margin-bottom:1.1rem;border-bottom:2px solid var(--ink-primary);padding-bottom:0.8rem;">
            <button id="m12-tab-sp" class="wb-btn primary" onclick="switchMod12WorkbenchTab('sp')">
              [ LABORATÓRIO 01: CAMINHOS MÍNIMOS (DIJKSTRA vs. BELLMAN-FORD & CICLOS NEGATIVOS) ]
            </button>
            <button id="m12-tab-flow" class="wb-btn" onclick="switchMod12WorkbenchTab('flow')">
              [ LABORATÓRIO 02: FLUXO MÁXIMO (EDMONDS-KARP, REDE RESIDUAL & CORTE MÍNIMO DUAL) ]
            </button>
          </div>

          <!-- PAINEL 1: CAMINHOS MÍNIMOS -->
          <div id="m12-panel-sp">
            <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
              Compare o comportamento guloso de <strong><code>DIJKSTRA</code></strong> (fila de prioridade $Q$, válido para $w \\ge 0$) com as $|V|-1$ passagens exaustivas de <strong><code>BELLMAN-FORD</code></strong> (capaz de detectar ciclos negativos). Alterne entre o grafo da <strong>Figura 24.6</strong> ($s, t, x, y, z$ com pesos não negativos) e o grafo com <strong>ciclo negativo</strong> ($s, a, b, c$ onde $a \\to b \\to c \\to a$ possui peso $-2$):
            </p>
            <div class="workbench-controls" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                <button id="m12-algo-dijkstra" class="wb-btn primary" onclick="setMod12SpAlgo('dijkstra')">[ DIJKSTRA (Fila Q • Guloso) ]</button>
                <button id="m12-algo-bellman" class="wb-btn" onclick="setMod12SpAlgo('bellman')">[ BELLMAN-FORD (|V|-1 Passadas) ]</button>
                <button id="m12-graph-toggle" class="wb-btn" onclick="toggleMod12SpGraph()">[ Alternar: Grafo Normal / Ciclo Negativo ]</button>
              </div>
              <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
                <button class="wb-btn" id="m12-sp-prev" onclick="stepMod12Sp(-1)">◀ Anterior</button>
                <button class="wb-btn primary" id="m12-sp-next" onclick="stepMod12Sp(1)">Próximo Passo ▶</button>
                <button class="wb-btn" onclick="stepMod12Sp(-999)">↺ Reiniciar</button>
              </div>
            </div>

            <div id="m12-sp-telemetry" class="workbench-telemetry-strip" style="margin-top:0.85rem;"></div>
            <div id="m12-sp-stage" style="background:var(--bg-card);border:var(--border-thin);padding:1rem;margin:0.85rem 0;"></div>
            <div id="m12-sp-log" class="wb-log-panel"></div>
          </div>

          <!-- PAINEL 2: FLUXO MÁXIMO E CORTE MÍNIMO -->
          <div id="m12-panel-flow" style="display:none;">
            <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
              Simule o algoritmo de <strong><code>EDMONDS-KARP</code></strong> sobre a rede de fluxo clássica de 6 vértices ($s, v_1, v_2, v_3, v_4, t$ — Figura 26.1 e 26.5 do CLRS). A cada iteração da Busca em Largura (BFS), observe o caminho aumentador mais curto em $G_f$, a saturação de gargalos, o cancelamento de fluxo via arestas reversas e a determinação final do <strong>Corte Mínimo Dual $(S, T)$</strong> com $|f^*| = c(S, T) = 23$:
            </p>
            <div class="workbench-controls" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                <span class="bracket-tag dark">[ Algoritmo: EDMONDS-KARP via BFS em G_f — O(VE²) ]</span>
              </div>
              <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
                <button class="wb-btn" id="m12-flow-prev" onclick="stepMod12Flow(-1)">◀ Anterior</button>
                <button class="wb-btn primary" id="m12-flow-next" onclick="stepMod12Flow(1)">Próximo Passo ▶</button>
                <button class="wb-btn" onclick="stepMod12Flow(-999)">↺ Reiniciar</button>
              </div>
            </div>

            <div id="m12-flow-telemetry" class="workbench-telemetry-strip" style="margin-top:0.85rem;"></div>
            <div id="m12-flow-stage" style="background:var(--bg-card);border:var(--border-thin);padding:1rem;margin:0.85rem 0;"></div>
            <div id="m12-flow-log" class="wb-log-panel"></div>
          </div>
        </div>
      </div>
    `;

    /* ========================================================================
       LABORATÓRIO 01: TRACES DE DIJKSTRA E BELLMAN-FORD
       ======================================================================== */
    // Grafo Positivo (Figura 24.6 do CLRS): V = {s, t, x, y, z}
    const V_pos = ["s", "t", "x", "y", "z"];
    const E_pos = [
      { u: "s", v: "t", w: 10 },
      { u: "s", v: "y", w: 5 },
      { u: "t", v: "x", w: 1 },
      { u: "t", v: "y", w: 2 },
      { u: "y", v: "t", w: 3 },
      { u: "y", v: "x", w: 9 },
      { u: "y", v: "z", w: 2 },
      { u: "x", v: "z", w: 4 },
      { u: "z", v: "x", w: 6 },
      { u: "z", v: "s", w: 7 }
    ];

    // Grafo com Ciclo Negativo: V = {s, a, b, c}
    // Arestas: (s, a): 2, (a, b): 3, (b, c): -7, (c, a): 2 (ciclo a->b->c->a peso 3 - 7 + 2 = -2)
    const V_neg = ["s", "a", "b", "c"];
    const E_neg = [
      { u: "s", v: "a", w: 2 },
      { u: "a", v: "b", w: 3 },
      { u: "b", v: "c", w: -7 },
      { u: "c", v: "a", w: 2 }
    ];

    function buildDijkstraTracePos() {
      const steps = [];
      const d = { s: 0, t: 10, y: 5, x: Infinity, z: Infinity };
      const pi = { s: "NIL", t: "s", y: "s", x: "NIL", z: "NIL" };
      let S = [];

      steps.push({
        stepName: "Passo 0: Inicialização",
        extracted: "s",
        S: ["s"],
        d: { s: 0, t: 10, y: 5, x: "∞", z: "∞" },
        pi: { s: "NIL", t: "s", y: "s", x: "NIL", z: "NIL" },
        activeEdge: "(s, t) e (s, y)",
        desc: "INITIALIZE-SINGLE-SOURCE: s.d = 0 e todos os outros vértices recebem ∞. Extrai s (menor chave d=0), insere em S = {s} e relaxa as arestas saindo de s: t.d = 10 (π = s) e y.d = 5 (π = s)."
      });

      steps.push({
        stepName: "Passo 1: Extrai vértice y (chave mínima 5)",
        extracted: "y",
        S: ["s", "y"],
        d: { s: 0, t: 8, y: 5, x: 14, z: 7 },
        pi: { s: "NIL", t: "y", y: "s", x: "y", z: "y" },
        activeEdge: "(y, t), (y, x), (y, z)",
        desc: "EXTRACT-MIN(Q) seleciona y com y.d = 5. S = {s, y}. Relaxa arestas de y: (y, t) com peso 3 reduz t.d de 10 para 5 + 3 = 8 (t.π = y); (y, z) com peso 2 define z.d = 5 + 2 = 7 (z.π = y); (y, x) com peso 9 define x.d = 5 + 9 = 14 (x.π = y)."
      });

      steps.push({
        stepName: "Passo 2: Extrai vértice z (chave mínima 7)",
        extracted: "z",
        S: ["s", "y", "z"],
        d: { s: 0, t: 8, y: 5, x: 13, z: 7 },
        pi: { s: "NIL", t: "y", y: "s", x: "z", z: "y" },
        activeEdge: "(z, x) e (z, s)",
        desc: "EXTRACT-MIN(Q) seleciona z com z.d = 7. S = {s, y, z}. Relaxa arestas de z: (z, x) com peso 6 reduz x.d de 14 para 7 + 6 = 13 (x.π = z). Aresta (z, s) com peso 7 não melhora s.d (7 + 7 = 14 > 0)."
      });

      steps.push({
        stepName: "Passo 3: Extrai vértice t (chave mínima 8)",
        extracted: "t",
        S: ["s", "y", "z", "t"],
        d: { s: 0, t: 8, y: 5, x: 9, z: 7 },
        pi: { s: "NIL", t: "y", y: "s", x: "t", z: "y" },
        activeEdge: "(t, x) e (t, y)",
        desc: "EXTRACT-MIN(Q) seleciona t com t.d = 8. S = {s, y, z, t}. Relaxa aresta (t, x) com peso 1: reduz x.d de 13 para 8 + 1 = 9 (x.π = t)! Aresta (t, y) não altera y.d (8 + 2 = 10 > 5)."
      });

      steps.push({
        stepName: "Passo 4: Extrai vértice x (chave mínima 9) — Término",
        extracted: "x",
        S: ["s", "y", "z", "t", "x"],
        d: { s: 0, t: 8, y: 5, x: 9, z: 7 },
        pi: { s: "NIL", t: "y", y: "s", x: "t", z: "y" },
        activeEdge: "(x, z)",
        desc: "EXTRACT-MIN(Q) seleciona x com x.d = 9. S = V. Fila Q fica vazia. O algoritmo de Dijkstra termina com todas as distâncias ótimas computadas: s=0, y=5, z=7, t=8, x=9. Invariante do Teorema 24.6 comprovada!"
      });

      return steps;
    }

    function buildBellmanTracePos() {
      const steps = [];
      steps.push({
        stepName: "Passo 0: Inicialização",
        pass: 0,
        d: { s: 0, t: "∞", x: "∞", y: "∞", z: "∞" },
        pi: { s: "NIL", t: "NIL", x: "NIL", y: "NIL", z: "NIL" },
        activeEdge: "INITIALIZE-SINGLE-SOURCE",
        desc: "Linha 1 de Bellman-Ford: s.d = 0 e todos os outros vértices recebem estimativa ∞ e predecessor NIL."
      });

      steps.push({
        stepName: "Passada 1 de 4 (|V| - 1 iterações)",
        pass: 1,
        d: { s: 0, t: 8, x: "∞", y: 5, z: 7 },
        pi: { s: "NIL", t: "y", x: "NIL", y: "s", z: "y" },
        activeEdge: "Todas as 10 arestas de E",
        desc: "Iteração i = 1: Relaxa todas as arestas. As arestas saindo de s alcançam t (10) e y (5). A aresta (y, t) reduz t de 10 para 5 + 3 = 8 (t.π = y); (y, z) define z.d = 5 + 2 = 7 (z.π = y)."
      });

      steps.push({
        stepName: "Passada 2 de 4",
        pass: 2,
        d: { s: 0, t: 8, x: 9, y: 5, z: 7 },
        pi: { s: "NIL", t: "y", x: "t", y: "s", z: "y" },
        activeEdge: "Arestas de E (destaque (t, x))",
        desc: "Iteração i = 2: Relaxa todas as arestas. A aresta (t, x) propaga o caminho de 2 arestas até x: x.d = t.d + 1 = 8 + 1 = 9 (x.π = t). As estimativas de caminhos de até 2 arestas já convergiram!"
      });

      steps.push({
        stepName: "Passada 3 de 4",
        pass: 3,
        d: { s: 0, t: 8, x: 9, y: 5, z: 7 },
        pi: { s: "NIL", t: "y", x: "t", y: "s", z: "y" },
        activeEdge: "Todas as arestas de E",
        desc: "Iteração i = 3: Nenhuma distância é reduzida. O subgrafo de predecessores formou a árvore de caminhos mínimos idêntica à de Dijkstra."
      });

      steps.push({
        stepName: "Passada 4 de 4 + Verificação de Ciclo Negativo",
        pass: 4,
        d: { s: 0, t: 8, x: 9, y: 5, z: 7 },
        pi: { s: "NIL", t: "y", x: "t", y: "s", z: "y" },
        activeEdge: "Linhas 5–7: Verificação",
        desc: "Linhas 5–7 de Bellman-Ford: Nenhuma aresta (u, v) satisfaz v.d > u.d + w(u, v). NENHUM ciclo de peso negativo detectado. Retorna TRUE com sucesso!"
      });

      return steps;
    }

    function buildBellmanTraceNeg() {
      const steps = [];
      steps.push({
        stepName: "Passo 0: Inicialização (Grafo com Ciclo Negativo)",
        pass: 0,
        d: { s: 0, a: "∞", b: "∞", c: "∞" },
        pi: { s: "NIL", a: "NIL", b: "NIL", c: "NIL" },
        activeEdge: "INITIALIZE-SINGLE-SOURCE",
        desc: "Inicializa grafo com ciclo a -> b -> c -> a de peso 3 + (-7) + 2 = -2 < 0. s.d = 0 e todos os outros ∞."
      });

      steps.push({
        stepName: "Passada 1 de 3 (|V| = 4, |V|-1 = 3 iterações)",
        pass: 1,
        d: { s: 0, a: 2, b: 5, c: -2 },
        pi: { s: "NIL", a: "s", b: "a", c: "b" },
        activeEdge: "Relaxando (s, a), (a, b), (b, c)",
        desc: "Iteração 1: (s, a) define a.d = 2; (a, b) define b.d = 2 + 3 = 5; (b, c) define c.d = 5 + (-7) = -2 (c.π = b)."
      });

      steps.push({
        stepName: "Passada 2 de 3",
        pass: 2,
        d: { s: 0, a: 0, b: 3, c: -4 },
        pi: { s: "NIL", a: "c", b: "a", c: "b" },
        activeEdge: "O ciclo negativo reduz distâncias!",
        desc: "Iteração 2: Aresta (c, a) com peso 2 reduz a.d de 2 para -2 + 2 = 0 (a.π = c)! Em seguida b.d cai para 0 + 3 = 3 e c.d cai para 3 - 7 = -4."
      });

      steps.push({
        stepName: "Passada 3 de 3",
        pass: 3,
        d: { s: 0, a: -2, b: 1, c: -6 },
        pi: { s: "NIL", a: "c", b: "a", c: "b" },
        activeEdge: "Distâncias continuam decrescendo indefinidamente!",
        desc: "Iteração 3: O ciclo continua sangrando peso: a.d cai para -4 + 2 = -2, b.d para 1, c.d para -6. Bellman-Ford conclui as |V|-1 passagens."
      });

      steps.push({
        stepName: "Passo 4: Verificação das Linhas 5–7 — DETECÇÃO DE CICLO NEGATIVO!",
        pass: 4,
        d: { s: 0, a: -2, b: 1, c: -6 },
        pi: { s: "NIL", a: "c", b: "a", c: "b" },
        activeEdge: "Aresta (c, a): a.d > c.d + w(c, a)",
        desc: "ALERTA DE CICLO NEGATIVO! Na linha 6, para a aresta (c, a): temos a.d = -2, mas c.d + w(c, a) = -6 + 2 = -4 < -2! O algoritmo detecta o ciclo de peso negativo {a, b, c} e retorna FALSE, demonstrando o Teorema 24.4!"
      });

      return steps;
    }

    function buildDijkstraTraceNeg() {
      const steps = [];
      steps.push({
        stepName: "Passo 0: Tentativa de Executar Dijkstra em Grafo com Aresta Negativa",
        d: { s: 0, a: "∞", b: "∞", c: "∞" },
        pi: { s: "NIL", a: "NIL", b: "NIL", c: "NIL" },
        desc: "AVISO CRÍTICO: O algoritmo de Dijkstra requer formalmente w(u, v) ≥ 0 para todas as arestas (Teorema 24.6). Veja como a ganância falha:"
      });
      steps.push({
        stepName: "Passo 1: Extração gulosa de s e a",
        d: { s: 0, a: 2, b: 5, c: -2 },
        pi: { s: "NIL", a: "s", b: "a", c: "b" },
        desc: "Dijkstra extrai s (0), relaxa (s, a) => a.d = 2. Extrai a (2) e coloca a em S, 'congelando' a.d = 2! Relaxa (a, b) => b.d = 5."
      });
      steps.push({
        stepName: "Passo 2: Aresta negativa (b, c) com peso -7",
        d: { s: 0, a: 2, b: 5, c: -2 },
        pi: { s: "NIL", a: "s", b: "a", c: "b" },
        desc: "Extrai b (5), relaxa (b, c) com peso -7 => c.d = -2. Extrai c (-2) e tenta relaxar (c, a) com peso 2 => -2 + 2 = 0 < 2! Mas o vértice 'a' já foi processado e extraído de Q. Dijkstra declara caminhos incorretos ou entra em laço infinito caso reabra vértices de S!"
      });
      return steps;
    }

    /* ========================================================================
       LABORATÓRIO 02: TRACE DE EDMONDS-KARP (FLUXO MÁXIMO & CORTE MÍNIMO)
       ======================================================================== */
    const V_flow = ["s", "v1", "v2", "v3", "v4", "t"];
    const E_flow = [
      { u: "s", v: "v1", c: 16 },
      { u: "s", v: "v2", c: 13 },
      { u: "v1", v: "v3", c: 12 },
      { u: "v2", v: "v1", c: 4 },
      { u: "v2", v: "v4", c: 14 },
      { u: "v3", v: "v2", c: 9 },
      { u: "v3", v: "t", c: 20 },
      { u: "v4", v: "v3", c: 7 },
      { u: "v4", v: "t", c: 4 }
    ];

    function buildEdmondsKarpTrace() {
      return [
        {
          step: 0,
          title: "Passo 0: Rede Residual Inicial (f(u, v) = 0, |f| = 0)",
          path: "Nenhum (Início)",
          bottleneck: 0,
          totalFlow: 0,
          cutS: ["s"],
          cutT: ["v1", "v2", "v3", "v4", "t"],
          flowMap: { "s,v1": 0, "s,v2": 0, "v1,v3": 0, "v2,v1": 0, "v2,v4": 0, "v3,v2": 0, "v3,t": 0, "v4,v3": 0, "v4,t": 0 },
          desc: "Inicialização: Todas as arestas possuem fluxo f(u, v) = 0. A rede residual G_f possui exatamente as capacidades originais c_f(u, v) = c(u, v). Nenhuma aresta reversa ativa ainda."
        },
        {
          step: 1,
          title: "Aumento 1: BFS encontra caminho p₁ = ⟨s, v₁, v₃, t⟩",
          path: "s → v₁ → v₃ → t",
          bottleneck: 12,
          totalFlow: 12,
          cutS: ["s", "v1"],
          cutT: ["v2", "v3", "v4", "t"],
          flowMap: { "s,v1": 12, "s,v2": 0, "v1,v3": 12, "v2,v1": 0, "v2,v4": 0, "v3,v2": 0, "v3,t": 12, "v4,v3": 0, "v4,t": 0 },
          desc: "A Busca em Largura (BFS) em G_f encontra o caminho com menor número de arestas: ⟨s, v₁, v₃, t⟩ (3 arestas). Capacidades residuais: c_f(s, v₁) = 16, c_f(v₁, v₃) = 12, c_f(v₃, t) = 20. Gargalo c_f(p) = min(16, 12, 20) = 12. A aresta (v₁, v₃) torna-se CRÍTICA (satura em 12/12 e desaparece de G_f, abrindo aresta reversa v₃ → v₁ com capacidade 12). Fluxo total sobe para |f| = 12."
        },
        {
          step: 2,
          title: "Aumento 2: BFS encontra caminho p₂ = ⟨s, v₂, v₄, t⟩",
          path: "s → v₂ → v₄ → t",
          bottleneck: 4,
          totalFlow: 16,
          cutS: ["s", "v2", "v4"],
          cutT: ["v1", "v3", "t"],
          flowMap: { "s,v1": 12, "s,v2": 4, "v1,v3": 12, "v2,v1": 0, "v2,v4": 4, "v3,v2": 0, "v3,t": 12, "v4,v3": 0, "v4,t": 4 },
          desc: "BFS encontra o caminho ⟨s, v₂, v₄, t⟩ (3 arestas). Capacidades residuais: c_f(s, v₂) = 13, c_f(v₂, v₄) = 14, c_f(v₄, t) = 4. Gargalo c_f(p) = min(13, 14, 4) = 4. A aresta (v₄, t) torna-se CRÍTICA (satura em 4/4 e desaparece de G_f). Fluxo total sobe para |f| = 12 + 4 = 16."
        },
        {
          step: 3,
          title: "Aumento 3: BFS encontra caminho p₃ = ⟨s, v₂, v₄, v₃, t⟩",
          path: "s → v₂ → v₄ → v₃ → t",
          bottleneck: 7,
          totalFlow: 23,
          cutS: ["s", "v1", "v2", "v4"],
          cutT: ["v3", "t"],
          flowMap: { "s,v1": 12, "s,v2": 11, "v1,v3": 12, "v2,v1": 0, "v2,v4": 11, "v3,v2": 0, "v3,t": 19, "v4,v3": 7, "v4,t": 4 },
          desc: "Como a aresta direta (v₄, t) está saturada, a BFS desvia por v₃: ⟨s, v₂, v₄, v₃, t⟩ (4 arestas). Capacidades residuais: c_f(s, v₂) = 13 - 4 = 9; c_f(v₂, v₄) = 14 - 4 = 10; c_f(v₄, v₃) = 7; c_f(v₃, t) = 20 - 12 = 8. Gargalo c_f(p) = min(9, 10, 7, 8) = 7. A aresta (v₄, v₃) torna-se CRÍTICA (satura em 7/7). Fluxo total sobe para |f| = 16 + 7 = 23!"
        },
        {
          step: 4,
          title: "Término e Determinação do Corte Mínimo Dual (Teorema 26.6)",
          path: "Nenhum caminho aumentador resta em G_f!",
          bottleneck: 0,
          totalFlow: 23,
          cutS: ["s", "v1", "v2", "v4"],
          cutT: ["v3", "t"],
          flowMap: { "s,v1": 12, "s,v2": 11, "v1,v3": 12, "v2,v1": 0, "v2,v4": 11, "v3,v2": 0, "v3,t": 19, "v4,v3": 7, "v4,t": 4 },
          desc: "BFS em G_f não consegue alcançar o sorvedouro t a partir de s! Pelo Teorema 26.6 (Fluxo Máximo–Corte Mínimo), o fluxo atual de |f*| = 23 é MÁXIMO. O conjunto de vértices alcançáveis de s em G_f define a partição S = {s, v₁, v₂, v₄} e T = {v₃, t}. A capacidade das arestas saindo de S para T é c(S, T) = c(v₁, v₃) + c(v₄, v₃) + c(v₄, t) = 12 + 7 + 4 = 23 = |f*|! A dualidade está comprovada!"
        }
      ];
    }

    // Variáveis de Estado
    let spAlgo = "dijkstra";
    let spGraph = "pos";
    let spIdx = 0;

    let flowTraces = buildEdmondsKarpTrace();
    let flowIdx = 0;

    function getSpTrace() {
      if (spGraph === "pos") {
        return spAlgo === "dijkstra" ? buildDijkstraTracePos() : buildBellmanTracePos();
      } else {
        return spAlgo === "dijkstra" ? buildDijkstraTraceNeg() : buildBellmanTraceNeg();
      }
    }

    function renderMod12Sp() {
      const trace = getSpTrace();
      const current = trace[spIdx];

      const tel = document.getElementById("m12-sp-telemetry");
      const stg = document.getElementById("m12-sp-stage");
      const log = document.getElementById("m12-sp-log");
      if (!tel || !stg || !log) return;

      tel.innerHTML = `
        <span class="bracket-tag dark">Passo ${spIdx + 1} / ${trace.length}</span>
        <span class="bracket-tag amber">Algoritmo: ${spAlgo.toUpperCase()}</span>
        <span class="bracket-tag ${spGraph === 'pos' ? 'emerald' : 'amber'}">Grafo: ${spGraph === 'pos' ? 'Pesos Não Negativos (Fig. 24.6)' : 'Com Ciclo Negativo'}</span>
        <span class="bracket-tag dark">Ação: ${current.activeEdge || '—'}</span>
      `;

      let cardsHtml = `<div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:1rem;">`;
      const currentV = spGraph === "pos" ? V_pos : V_neg;
      currentV.forEach((v) => {
        const valD = current.d[v];
        const valPi = current.pi[v];
        const inS = current.S && current.S.includes(v);
        cardsHtml += `
          <div style="border:2px solid ${inS ? 'var(--accent-emerald)' : 'var(--border-strong)'};background:${inS ? 'var(--accent-emerald-bg)' : 'var(--bg-paper)'};padding:0.6rem 0.85rem;border-radius:4px;min-width:90px;text-align:center;">
            <div style="font-weight:700;font-size:1.05rem;color:var(--ink-primary);">${v}</div>
            <div style="font-size:0.82rem;color:var(--ink-secondary);margin-top:2px;">d: <strong>${valD}</strong></div>
            <div style="font-size:0.78rem;color:var(--ink-secondary);">π: ${valPi}</div>
            ${inS ? '<span style="font-size:0.68rem;background:var(--accent-emerald);color:#fff;padding:1px 4px;border-radius:2px;">em S</span>' : ''}
          </div>
        `;
      });
      cardsHtml += `</div>`;

      let edgesHtml = `
        <div style="font-size:0.84rem;color:var(--ink-secondary);margin-bottom:0.4rem;font-weight:600;">Arestas do Grafo:</div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;font-size:0.8rem;">
      `;
      const currentE = spGraph === "pos" ? E_pos : E_neg;
      currentE.forEach((e) => {
        edgesHtml += `
          <span style="border:1px solid var(--border-thin);padding:3px 6px;border-radius:3px;background:var(--bg-paper);">
            (${e.u} → ${e.v}): <strong>${e.w}</strong>
          </span>
        `;
      });
      edgesHtml += `</div>`;

      stg.innerHTML = `
        <div style="font-size:0.95rem;font-weight:700;color:var(--ink-primary);margin-bottom:0.75rem;">${current.stepName}</div>
        ${cardsHtml}
        ${edgesHtml}
      `;

      log.innerHTML = `<p style="margin:0;font-size:0.88rem;line-height:1.5;">${current.desc}</p>`;

      const btnPrev = document.getElementById("m12-sp-prev");
      const btnNext = document.getElementById("m12-sp-next");
      if (btnPrev) btnPrev.disabled = spIdx === 0;
      if (btnNext) btnNext.disabled = spIdx === trace.length - 1;
    }

    function renderMod12Flow() {
      const current = flowTraces[flowIdx];
      const tel = document.getElementById("m12-flow-telemetry");
      const stg = document.getElementById("m12-flow-stage");
      const log = document.getElementById("m12-flow-log");
      if (!tel || !stg || !log) return;

      tel.innerHTML = `
        <span class="bracket-tag dark">Iteração ${flowIdx + 1} / ${flowTraces.length}</span>
        <span class="bracket-tag emerald">Fluxo Total |f| = ${current.totalFlow}</span>
        <span class="bracket-tag amber">Caminho: ${current.path}</span>
        <span class="bracket-tag dark">Gargalo c_f(p) = ${current.bottleneck}</span>
      `;

      let tableHtml = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:0.8rem;">
          <div>
            <div style="font-size:0.86rem;font-weight:700;color:var(--ink-primary);margin-bottom:0.4rem;">Rede Original G: Fluxo / Capacidade f(u, v) / c(u, v)</div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(130px, 1fr));gap:0.4rem;font-size:0.8rem;">
      `;
      E_flow.forEach((e) => {
        const key = `${e.u},${e.v}`;
        const fVal = current.flowMap[key] || 0;
        const sat = fVal === e.c;
        tableHtml += `
          <div style="border:1px solid ${sat ? 'var(--accent-amber)' : 'var(--border-thin)'};background:${sat ? 'var(--accent-amber-bg)' : 'var(--bg-paper)'};padding:4px 6px;border-radius:3px;">
            (${e.u} → ${e.v}): <strong>${fVal} / ${e.c}</strong> ${sat ? '<span style="color:#b45309;font-weight:700;">[SAT]</span>' : ''}
          </div>
        `;
      });
      tableHtml += `
            </div>
          </div>
          <div>
            <div style="font-size:0.86rem;font-weight:700;color:var(--ink-primary);margin-bottom:0.4rem;">Partição de Corte Dual (S, T) — Teorema 26.6</div>
            <div style="background:var(--bg-paper);border:var(--border-thin);padding:0.75rem;border-radius:4px;font-size:0.84rem;">
              <div style="margin-bottom:0.4rem;"><strong>Subconjunto S (alcançáveis de s em G_f):</strong> { ${current.cutS.join(", ")} }</div>
              <div style="margin-bottom:0.4rem;"><strong>Subconjunto T (V - S):</strong> { ${current.cutT.join(", ")} }</div>
              <div><strong>Capacidade do Corte c(S, T):</strong> ${flowIdx === 4 ? '<span style="color:var(--accent-emerald);font-weight:700;">c(S, T) = 12 + 7 + 4 = 23 = |f*|</span>' : 'Avaliado no término'}</div>
            </div>
          </div>
        </div>
      `;

      stg.innerHTML = `
        <div style="font-size:0.95rem;font-weight:700;color:var(--ink-primary);margin-bottom:0.75rem;">${current.title}</div>
        ${tableHtml}
      `;

      log.innerHTML = `<p style="margin:0;font-size:0.88rem;line-height:1.5;">${current.desc}</p>`;

      const btnPrev = document.getElementById("m12-flow-prev");
      const btnNext = document.getElementById("m12-flow-next");
      if (btnPrev) btnPrev.disabled = flowIdx === 0;
      if (btnNext) btnNext.disabled = flowIdx === flowTraces.length - 1;
    }

    // Funções Globais no window
    window.switchMod12WorkbenchTab = function (tab) {
      const pSp = document.getElementById("m12-panel-sp");
      const pFlow = document.getElementById("m12-panel-flow");
      const bSp = document.getElementById("m12-tab-sp");
      const bFlow = document.getElementById("m12-tab-flow");
      if (pSp) pSp.style.display = tab === "sp" ? "block" : "none";
      if (pFlow) pFlow.style.display = tab === "flow" ? "block" : "none";
      if (bSp) bSp.classList.toggle("primary", tab === "sp");
      if (bFlow) bFlow.classList.toggle("primary", tab === "flow");
    };

    window.setMod12SpAlgo = function (algo) {
      spAlgo = algo;
      spIdx = 0;
      const bDijk = document.getElementById("m12-algo-dijkstra");
      const bBell = document.getElementById("m12-algo-bellman");
      if (bDijk) bDijk.classList.toggle("primary", algo === "dijkstra");
      if (bBell) bBell.classList.toggle("primary", algo === "bellman");
      renderMod12Sp();
    };

    window.toggleMod12SpGraph = function () {
      spGraph = spGraph === "pos" ? "neg" : "pos";
      spIdx = 0;
      renderMod12Sp();
    };

    window.stepMod12Sp = function (delta) {
      const trace = getSpTrace();
      if (delta === -999) spIdx = 0;
      else spIdx = Math.max(0, Math.min(trace.length - 1, spIdx + delta));
      renderMod12Sp();
    };

    window.stepMod12Flow = function (delta) {
      if (delta === -999) flowIdx = 0;
      else flowIdx = Math.max(0, Math.min(flowTraces.length - 1, flowIdx + delta));
      renderMod12Flow();
    };

    renderMod12Sp();
    renderMod12Flow();
  }



  /* ========================================================================
     SEÇÃO 3: 10 QUIZZES COM GABARITO COMENTADO ALTERNATIVA POR ALTERNATIVA
     ======================================================================== */
  const quizzes = [
    {
      id: "q12-1",
      type: "Múltipla Escolha",
      reference: "Capítulo 24.0 — Subestrutura Ótima e Lema 24.1 (pp. 526–530)",
      question:
        "Considere a propriedade de subestrutura ótima em grafos dirigidos ponderados $G = (V, E)$ com função peso $w : E \\to \\mathbb{R}$. Segundo o Lema 24.1 e as discussões conceituais do CLRS, assinale a afirmação ESTRITAMENTE VERDADEIRA:",
      options: [
        {
          letter: "A",
          text: "Se p é um caminho simples mais longo entre u e v, então qualquer subcaminho de p é obrigatoriamente um caminho simples mais longo entre suas extremidades, garantindo que o problema do caminho mais longo possa ser resolvido por Programação Dinâmica em tempo polinomial.",
          isCorrect: false,
          explanation:
            "Falso! O problema de encontrar o caminho simples mais longo entre dois vértices NÃO possui subestrutura ótima independente e é comprovadamente NP-difícil. A exigência de que o caminho global seja simples impõe acoplamento entre os subproblemas (eles não podem reutilizar vértices), destruindo a decomposição em subproblemas independentes (CLRS, pp. 360 e 529)."
        },
        {
          letter: "B",
          text: "Pelo Lema 24.1, se p é um caminho mínimo de u a v, todo subcaminho p_xy de x a y contido em p é necessariamente um caminho mínimo de x a y; além disso, a técnica de 'recortar e colar' prova que a existência de um subcaminho estritamente mais curto contradiria a minimalidade do caminho global.",
          isCorrect: true,
          explanation:
            "Correta! O Lema 24.1 (p. 528) estabelece exatamente a subestrutura ótima de caminhos mínimos: se existisse um subcaminho alternativo p'_xy com peso estritamente menor que p_xy, poderíamos substituí-lo em p produzindo um caminho de u a v com peso estritamente menor que w(p), violando a hipótese de que p é mínimo."
        },
        {
          letter: "C",
          text: "A presença de ciclos de peso estritamente negativo não afeta a existência de caminhos mínimos bem definidos, desde que o número total de arestas no grafo seja finito.",
          isCorrect: false,
          explanation:
            "Falso! Se existe um ciclo de peso negativo alcançável a partir da fonte s e que pode alcançar um vértice v, podemos percorrer o ciclo infinitas vezes gerando caminhos de peso arbitrariamente negativo; logo, δ(s, v) = -∞ e nenhum caminho mínimo bem definido existe (p. 528)."
        },
        {
          letter: "D",
          text: "Em qualquer grafo com pesos de arestas negativos, o subgrafo de predecessores G_π calculado por relaxamento pode conter ciclos positivos, mas nunca ciclos de peso zero.",
          isCorrect: false,
          explanation:
            "Falso! Pelo Lema 24.16 e Teorema 24.4, quando todas as distâncias convergem a valores finitos δ(s, v), G_π é estritamente acíclico (uma árvore de caminhos mínimos enraizada em s). Ciclos em G_π só podem ocorrer se houver ciclos de peso estritamente negativo."
        }
      ]
    },
    {
      id: "q12-2",
      type: "Múltipla Escolha",
      reference: "Seção 24.5 — As 6 Propriedades de Relaxamento e Caminhos Mínimos (pp. 548–552)",
      question:
        "Seja $G = (V, E)$ um grafo dirigido ponderado e $s \\in V$ o vértice fonte. Sobre as 6 propriedades de relaxamento provadas na Seção 24.5 do CLRS, qual alternativa é CORRETA?",
      options: [
        {
          letter: "A",
          text: "Pela Desigualdade Triangular (Lema 24.10), para toda aresta (u, v) ∈ E, temos δ(s, v) ≥ δ(s, u) + w(u, v).",
          isCorrect: false,
          explanation:
            "Falso! A desigualdade correta é invertida: δ(s, v) ≤ δ(s, u) + w(u, v). O caminho mínimo até v não pode ser maior do que o caminho mínimo até u seguido pela aresta (u, v)."
        },
        {
          letter: "B",
          text: "Pela Propriedade do Limite Superior (Lema 24.11), temos v.d ≤ δ(s, v) para todo v ∈ V durante toda a execução de qualquer sequência de relaxamentos.",
          isCorrect: false,
          explanation:
            "Falso! O atributo v.d é uma estimativa que limita SUPERIORMENTE a distância real, isto é, v.d ≥ δ(s, v). Ele decresce monotonicamente em direção a δ(s, v) e, uma vez que v.d = δ(s, v), nunca mais muda."
        },
        {
          letter: "C",
          text: "Pela Propriedade do Relaxamento de Caminhos (Lema 24.15), se p = ⟨v₀, v₁, ..., v_k⟩ é um caminho mínimo a partir de s = v₀ e uma sequência de passos relaxa as arestas (v₀, v₁), (v₁, v₂), ..., (v_{k-1}, v_k) nessa ordem, então v_k.d = δ(s, v_k), mesmo que outros relaxamentos arbitrários ocorram intercalados.",
          isCorrect: true,
          explanation:
            "Correta! O Lema 24.15 (p. 550) assegura que desde que as arestas do caminho mínimo sejam relaxadas na ordem sequencial do caminho, o vértice final atinge v_k.d = δ(s, v_k), e relaxamentos intermediários ou supérfluos não invalidam essa convergência."
        },
        {
          letter: "D",
          text: "Se um vértice v não é alcançável a partir de s, a Propriedade da Ausência de Caminho afirma que v.d assume o valor 0 ao término do algoritmo.",
          isCorrect: false,
          explanation:
            "Falso! Pelo Corolário 24.12, se v não é alcançável de s, então δ(s, v) = ∞ e invariavelmente v.d = ∞ em todas as etapas."
        }
      ]
    },
    {
      id: "q12-3",
      type: "Múltipla Escolha",
      reference: "Seção 24.1 — O Algoritmo de Bellman-Ford e Teorema 24.4 (pp. 532–536)",
      question:
        "O algoritmo de Bellman-Ford executa $|V| - 1$ passagens de relaxamento sobre todas as arestas de $G$ e depois inspeciona cada aresta nas linhas 5–7. Por que exatamente $|V| - 1$ iterações são suficientes para garantir a convergência na ausência de ciclos negativos?",
      options: [
        {
          letter: "A",
          text: "Porque qualquer grafo conexo contém no máximo |V| - 1 arestas no total.",
          isCorrect: false,
          explanation:
            "Falso! Um grafo pode conter até |V|(|V| - 1) arestas dirigidas. Apenas árvores possuem exatamente |V| - 1 arestas."
        },
        {
          letter: "B",
          text: "Porque na ausência de ciclos de peso negativo, todo caminho mínimo é simples e contém no máximo |V| - 1 arestas; como cada passagem relaxa todas as arestas, a i-ésima passagem relaxa garantidamente a i-ésima aresta de qualquer caminho mínimo simples.",
          isCorrect: true,
          explanation:
            "Correta! Essa é a essência da demonstração do Teorema 24.4 (p. 534). Sem ciclos negativos, podemos supor sem perda de generalidade que todo caminho mínimo é simples, logo possui no máximo |V| - 1 arestas. Pelo Lema do Relaxamento de Caminhos, |V| - 1 passagens relaxando todo E asseguram que as arestas de qualquer caminho mínimo foram relaxadas na ordem correta, convergindo todos os v.d para δ(s, v)."
        },
        {
          letter: "C",
          text: "Porque cada iteração descobre exatamente um novo vértice alcançável em ordem de busca em largura.",
          isCorrect: false,
          explanation:
            "Falso! Bellman-Ford não realiza busca em largura; a ordem em que as arestas são relaxadas na passagem é arbitrária."
        },
        {
          letter: "D",
          text: "Porque Bellman-Ford ordena topologicamente as arestas antes de iniciar o laço de relaxamento.",
          isCorrect: false,
          explanation:
            "Falso! Bellman-Ford opera em grafos gerais que podem conter ciclos; ordenação topológica só é possível em DAGs."
        }
      ]
    },
    {
      id: "q12-4",
      type: "Múltipla Escolha",
      reference: "Seção 24.2 — Caminhos Mínimos em DAGs (pp. 536–540)",
      question:
        "Sobre o algoritmo DAG-SHORTEST-PATHS para Grafos Acíclicos Dirigidos (Teorema 24.5), assinale a alternativa CORRETA:",
      options: [
        {
          letter: "A",
          text: "O algoritmo requer obrigatoriamente que todos os pesos das arestas sejam não negativos, assim como o algoritmo de Dijkstra.",
          isCorrect: false,
          explanation:
            "Falso! DAG-SHORTEST-PATHS admite pesos de arestas negativos arbitrários! Como o grafo é acíclico por definição, não existe a possibilidade de ciclos de peso negativo."
        },
        {
          letter: "B",
          text: "Ao ordenar topologicamente os vértices em tempo Θ(V + E) e relaxar as arestas de saída de cada vértice nessa ordem, o algoritmo computa caminhos mínimos em tempo estritamente linear Θ(V + E).",
          isCorrect: true,
          explanation:
            "Correta! Pelo Teorema 24.5 (p. 537), a ordenação topológica via DFS consome Θ(V + E), e o laço de relaxamento processa cada vértice uma vez e cada aresta saindo de u exatamente uma vez, custando ∑ grau-saída(u) = |E|. Tempo total: Θ(V + E)."
        },
        {
          letter: "C",
          text: "O algoritmo não permite calcular o caminho mais longo em um DAG, pois caminhos mais longos são intratáveis mesmo em grafos acíclicos.",
          isCorrect: false,
          explanation:
            "Falso! Em DAGs, o problema do caminho mais longo pode ser resolvido em tempo estritamente linear Θ(V + E) simplesmente invertendo o sinal dos pesos de todas as arestas (w'(u, v) = -w(u, v)) ou substituindo a operação min por max no relaxamento (método do Caminho Crítico em redes PERT/CPM, p. 538)."
        },
        {
          letter: "D",
          text: "A complexidade de DAG-SHORTEST-PATHS depende do valor absoluto das capacidades e pode divergir se houver pesos irracionais.",
          isCorrect: false,
          explanation:
            "Falso! A complexidade é estritamente topológica e linear Θ(V + E), completamente independente dos valores numéricos dos pesos."
        }
      ]
    },
    {
      id: "q12-5",
      type: "Múltipla Escolha",
      reference: "Seção 24.3 — Algoritmo de Dijkstra e Teorema 24.6 (pp. 540–544)",
      question:
        "Considere a execução do algoritmo de Dijkstra com fila de prioridades mínimas $Q$. A prova de corretude formal (Teorema 24.6) repousa sobre qual invariante de laço e qual premissa obrigatória?",
      options: [
        {
          letter: "A",
          text: "Invariante: no momento da extração de u de Q via EXTRACT-MIN, u.d = δ(s, u); premissa obrigatória: w(u, v) ≥ 0 para todas as arestas (u, v) ∈ E.",
          isCorrect: true,
          explanation:
            "Correta! O Teorema 24.6 prova por indução que quando u é extraído de Q e adicionado a S, u.d já é o peso exato do caminho mínimo δ(s, u). A hipótese w(u, v) ≥ 0 é crucial para garantir que qualquer outro caminho que saia de S e chegue a u passando por um nó intermediário y ∉ S tenha peso δ(s, y) ≥ δ(s, u) ≥ u.d, impedindo reduções posteriores."
        },
        {
          letter: "B",
          text: "Invariante: todos os vértices de V possuem suas estimativas d estritamente menores que δ(s, v); premissa obrigatória: o grafo deve ser acíclico.",
          isCorrect: false,
          explanation:
            "Falso! Pela Propriedade do Limite Superior, v.d ≥ δ(s, v) sempre. Além disso, Dijkstra funciona perfeitamente em grafos com ciclos, desde que não haja arestas negativas."
        },
        {
          letter: "C",
          text: "Com Heap de Fibonacci, Dijkstra atinge complexidade O(E lg V), que é assintoticamente inferior ao arranjo linear O(V²) em grafos densos.",
          isCorrect: false,
          explanation:
            "Falso! Com Heap de Fibonacci, Dijkstra executa em O(V lg V + E). É o Heap Binário que produz O(E lg V). Em grafos densos onde E = Θ(V²), o arranjo linear simples O(V²) é tão eficiente quanto ou melhor que o Heap de Fibonacci devido a constantes menores."
        },
        {
          letter: "D",
          text: "Dijkstra pode ser adaptado para aceitar arestas negativas bastando somar uma constante positiva C = |min w(u, v)| a todas as arestas antes da execução.",
          isCorrect: false,
          explanation:
            "Falso! Somar uma constante a todas as arestas penaliza caminhos com mais arestas e altera a ordem de otimalidade dos caminhos (Falácia de Greenstreet, Exercício 25.3-4)."
        }
      ]
    },
    {
      id: "q12-6",
      type: "Múltipla Escolha",
      reference: "Seção 24.4 — Sistemas de Restrições de Diferença (pp. 543–548)",
      question:
        "Dada uma matriz $A$ de dimensão $m \\times n$ onde cada linha possui exatamente um coeficiente $+1$, um $-1$ e zero nos demais, o sistema $Ax \\le b$ modela $m$ restrições da forma $x_j - x_i \\le b_k$. Sobre a solução via Grafo de Restrições e Teoremas 24.8 e 24.9, assinale a opção CORRETA:",
      options: [
        {
          letter: "A",
          text: "O grafo de restrições cria uma aresta dirigida (v_j, v_i) com peso b_k para cada restrição x_j - x_i ≤ b_k.",
          isCorrect: false,
          explanation:
            "Falso! Pela Desigualdade Triangular, δ(s, v_j) ≤ δ(s, v_i) + w(v_i, v_j) implica δ(s, v_j) - δ(s, v_i) ≤ w(v_i, v_j). Para satisfazer x_j - x_i ≤ b_k, a aresta deve ser dirigida DE v_i PARA v_j com peso b_k: (v_i, v_j) ∈ E com w(v_i, v_j) = b_k."
        },
        {
          letter: "B",
          text: "O vértice fonte v₀ é adicionado com arestas (v_i, v₀) de peso 0 saindo de todos os vértices v_i.",
          isCorrect: false,
          explanation:
            "Falso! As arestas partem de v₀ para todos os vértices v_i: (v₀, v_i) ∈ E com peso 0, garantindo que todos os vértices sejam alcançáveis a partir de v₀."
        },
        {
          letter: "C",
          text: "Se o grafo de restrições não contém ciclos de peso negativo, o vetor x = (δ(v₀, v₁), δ(v₀, v₂), ..., δ(v₀, v_n)) computado por Bellman-Ford é uma solução factível maximal satisfazendo x_i ≤ 0 para todo i.",
          isCorrect: true,
          explanation:
            "Correta! Pelo Teorema 24.8 e Exercício 24.4-4, x_i = δ(v₀, v_i) satisfaz todas as restrições x_j - x_i ≤ b_k pela Desigualdade Triangular. Como w(v₀, v_i) = 0, δ(v₀, v_i) ≤ 0 para todo i. Além disso, se o grafo contiver um ciclo negativo, o Teorema 24.9 prova que o sistema é insatisfatível."
        },
        {
          letter: "D",
          text: "Se x é uma solução factível, somar uma constante real d a todas as variáveis (x + d) inviabiliza as restrições.",
          isCorrect: false,
          explanation:
            "Falso! Como cada restrição envolve a diferença entre duas variáveis, (x_j + d) - (x_i + d) = x_j - x_i ≤ b_k; logo, x + d é sempre uma solução factível válida."
        }
      ]
    },
    {
      id: "q12-7",
      type: "Múltipla Escolha",
      reference: "Capítulo 25.1 & 25.2 — Caminhos Mínimos entre Todos os Pares (pp. 560–573)",
      question:
        "Comparando a abordagem por Multiplicação de Matrizes (Seção 25.1) e o Algoritmo de Floyd-Warshall (Seção 25.2), qual afirmativa descreve com precisão a estrutura de seus subproblemas e suas complexidades?",
      options: [
        {
          letter: "A",
          text: "A abordagem por multiplicação de matrizes limita os vértices intermediários ao conjunto {1, ..., k}, enquanto Floyd-Warshall limita o número máximo de arestas a m.",
          isCorrect: false,
          explanation:
            "Falso! É o inverso: a multiplicação matricial limita o número máximo de arestas m na recorrência l_ij^(m), enquanto Floyd-Warshall limita o conjunto de vértices intermediários permitidos a {1, ..., k} na recorrência d_ij^(k)."
        },
        {
          letter: "B",
          text: "Floyd-Warshall calcula d_ij^(k) = min(d_ij^(k-1), d_ik^(k-1) + d_kj^(k-1)) em tempo estrito Θ(n³) e espaço Θ(n²) in-place, enquanto a multiplicação matricial por quadratura repetida atinge Θ(n³ lg n).",
          isCorrect: true,
          explanation:
            "Correta! Floyd-Warshall executa 3 laços aninhados de 1 a n, totalizando exatamente n³ iterações elementares (Θ(n³)), e a independência das linhas e colunas k permite atualização in-place em uma matriz n × n. Já a quadratura repetida de matrizes realiza ⌈lg(n-1)⌉ multiplicações de tempo Θ(n³), resultando em Θ(n³ lg n)."
        },
        {
          letter: "C",
          text: "O Fecho Transitivo de um dígrafo não pode ser resolvido com Floyd-Warshall porque operadores booleanos violam a associatividade.",
          isCorrect: false,
          explanation:
            "Falso! O Fecho Transitivo (TRANSITIVE-CLOSURE, p. 571) especializa Floyd-Warshall diretamente substituindo min por ∨ e + por ∧: t_ij^(k) = t_ij^(k-1) ∨ (t_ik^(k-1) ∧ t_kj^(k-1)), mantendo corretude total."
        },
        {
          letter: "D",
          text: "Floyd-Warshall não é capaz de detectar ciclos de pesos negativos no grafo de entrada.",
          isCorrect: false,
          explanation:
            "Falso! Floyd-Warshall detecta ciclos de peso negativo se e somente se, ao término do algoritmo, alguma entrada da diagonal principal for estritamente negativa: d_ii < 0 (Exercício 25.2-4)."
        }
      ]
    },
    {
      id: "q12-8",
      type: "Múltipla Escolha",
      reference: "Seção 25.3 — O Algoritmo de Johnson para Grafos Esparsos (pp. 578–583)",
      question:
        "O algoritmo de Johnson utiliza a reponderação conservativa $\\hat{w}(u, v) = w(u, v) + h(u) - h(v)$ com potencial $h(v) = \\delta(s, v)$ computado por Bellman-Ford a partir de uma fonte auxiliar $s$. Por que essa técnica garante simultaneamente que $\\hat{w}(u, v) \\ge 0$ e preserva os caminhos mínimos?",
      options: [
        {
          letter: "A",
          text: "Porque pela Desigualdade Triangular δ(s, v) ≤ δ(s, u) + w(u, v), o que implica w(u, v) + h(u) - h(v) ≥ 0; e pela soma telescópica ao longo de qualquer caminho p de v₀ a v_k, ŵ(p) = w(p) + h(v₀) - h(v_k), preservando a ordem relativa de todos os caminhos entre o mesmo par de vértices.",
          isCorrect: true,
          explanation:
            "Correta! Pelo Lema 25.1 (p. 574), ŵ(p) = w(p) + h(v₀) - h(v_k). Como h(v₀) e h(v_k) são fixos para qualquer caminho ligando v₀ a v_k, um caminho minimiza w se e somente se minimiza ŵ. Além disso, h(v) = δ(s, v) satisfaz a Desigualdade Triangular h(v) ≤ h(u) + w(u, v) ⇔ w(u, v) + h(u) - h(v) ≥ 0, assegurando ŵ(u, v) ≥ 0 para todas as arestas!"
        },
        {
          letter: "B",
          text: "Porque h(v) representa o grau de entrada de v no grafo original, cancelando as arestas que formam ciclos.",
          isCorrect: false,
          explanation:
            "Falso! h(v) é a distância de caminho mínimo δ(s, v) no grafo ampliado G', não tendo relação com grau de entrada."
        },
        {
          letter: "C",
          text: "A complexidade de Johnson com Heap de Fibonacci é O(V³), sendo assintoticamente idêntica à de Floyd-Warshall em grafos esparsos.",
          isCorrect: false,
          explanation:
            "Falso! Com Heap de Fibonacci, Johnson executa em O(V² lg V + VE). Em grafos esparsos com |E| = O(V), isso resulta em O(V² lg V), que é estritamente melhor que os Θ(V³) de Floyd-Warshall!"
        },
        {
          letter: "D",
          text: "A reponderação de Johnson altera o peso de ciclos simples, eliminando os ciclos de peso negativo sem acusar erro.",
          isCorrect: false,
          explanation:
            "Falso! Pelo Lema 25.2, para qualquer ciclo c temos ŵ(c) = w(c). Ciclos negativos não são eliminados e são detectados pelo passo inicial de Bellman-Ford."
        }
      ]
    },
    {
      id: "q12-9",
      type: "Múltipla Escolha",
      reference: "Capítulo 26.2 & 26.3 — Fluxo Máximo–Corte Mínimo e Edmonds-Karp (pp. 592–605)",
      question:
        "Sobre o Teorema do Fluxo Máximo–Corte Mínimo (Teorema 26.6) e o Algoritmo de Edmonds-Karp, assinale a opção CORRETA:",
      options: [
        {
          letter: "A",
          text: "Para qualquer fluxo viável f e qualquer corte (S, T), o fluxo líquido f(S, T) pode ser estritamente maior que a capacidade c(S, T).",
          isCorrect: false,
          explanation:
            "Falso! Pelo Corolário 26.5 (p. 595), f(S, T) = |f| ≤ c(S, T) sempre. A capacidade de qualquer corte é um limite superior para o valor de qualquer fluxo viável."
        },
        {
          letter: "B",
          text: "O Teorema 26.6 estabelece que um fluxo f é máximo se e somente se G_f não contém caminhos aumentadores de s a t, o que equivale a dizer que |f| = c(S, T) para a partição onde S é o conjunto de vértices alcançáveis a partir de s em G_f.",
          isCorrect: true,
          explanation:
            "Correta! O Teorema 26.6 (p. 596) demonstra a equivalência lógica entre as 3 condições fundamentais: (1) f é fluxo máximo; (2) G_f não tem caminho aumentador; (3) |f| = c(S, T) para algum corte (S, T), onde S = {v : s ↝ v em G_f}."
        },
        {
          letter: "C",
          text: "O algoritmo de Edmonds-Karp utiliza DFS para encontrar caminhos aumentadores, atingindo complexidade O(E |f*|).",
          isCorrect: false,
          explanation:
            "Falso! Edmonds-Karp utiliza BFS (Busca em Largura), escolhendo caminhos mais curtos em número de arestas, o que limita o número de aumentos a O(VE) e resulta em complexidade estritamente polinomial O(VE²)."
        },
        {
          letter: "D",
          text: "No problema de emparelhamento bipartido máximo com pesos unitários, o algoritmo de fluxo pode retornar fluxos fracionários não interpretáveis como emparelhamentos.",
          isCorrect: false,
          explanation:
            "Falso! Pelo Teorema da Integralidade 26.10 (p. 604), como todas as capacidades são inteiras (1), o fluxo calculado é estritamente inteiro (f(u, v) ∈ {0, 1}), correspondendo exatamente a um emparelhamento maximal sem frações."
        }
      ]
    },
    {
      id: "q12-10",
      type: "Múltipla Escolha",
      reference: "Capítulo 26.4 & 26.5 — Algoritmos Push-Relabel e Relabel-to-Front (pp. 612–636)",
      question:
        "Nos algoritmos de Empurrar-Reetiquetar (Push-Relabel), qual é a função das etiquetas de altura $h(u)$ e qual a complexidade assintótica do algoritmo Relabel-to-Front (Teorema 26.24)?",
      options: [
        {
          letter: "A",
          text: "A altura h(u) representa a capacidade residual máxima de u; o algoritmo Relabel-to-Front executa em O(V⁴).",
          isCorrect: false,
          explanation:
            "Falso! h(u) é uma função de altura inteira que orienta a descida de fluxo residual; Relabel-to-Front executa em tempo O(V³)."
        },
        {
          letter: "B",
          text: "Uma função de altura válida satisfaz h(s) = |V|, h(t) = 0 e h(u) ≤ h(v) + 1 para todo (u, v) ∈ E_f; operações PUSH só são permitidas quando h(u) = h(v) + 1, e o algoritmo Relabel-to-Front atinge tempo estrito O(V³).",
          isCorrect: true,
          explanation:
            "Correta! Pelo Lema 26.13 e Seção 26.4, a condição h(u) ≤ h(v) + 1 impede caminhos aumentadores de s a t em G_f enquanto h(s) = |V| e h(t) = 0. Operações PUSH exigem h(u) = h(v) + 1. Pelo Teorema 26.24 (p. 631), a disciplina de descarregar vértices e movê-los para a frente da lista encadeada (Relabel-to-Front) atinge tempo O(V³)."
        },
        {
          letter: "C",
          text: "A operação RELABEL(u) reduz a altura de u para facilitar a chegada de fluxo vindo da fonte s.",
          isCorrect: false,
          explanation:
            "Falso! RELABEL(u) ELEVA a altura de u para 1 + min{h(v) : (u, v) ∈ E_f}, permitindo que o excesso de u possa ser descarregado para um vizinho residual."
        },
        {
          letter: "D",
          text: "O algoritmo Generic Push-Relabel requer no máximo |V| operações de PUSH saturantes ao longo de toda a execução.",
          isCorrect: false,
          explanation:
            "Falso! Pelo Teorema 26.17, o número de empurrões saturantes é limitado a 2|V||E|, e empurrões não saturantes a 4|V|²|E|."
        }
      ]
    }
  ];



  /* ========================================================================
     SEÇÃO 4: 8 EXERCÍCIOS E PROBLEMAS CANÔNICOS RESOLVIDOS PASSO A PASSO
     ======================================================================== */
  const exercicios = [
    {
      id: "ex12-1",
      code: "EXERCÍCIOS 24.1-1 & 24.1-3",
      reference: "Seção 24.1 — Otimização de Parada Antecipada em Bellman-Ford (pp. 535–536)",
      title: "Execução Manual de Bellman-Ford e Formalização da Parada Antecipada em Tempo $O(k \\cdot E)$",
      prompt: `
        <p>Resolva as duas questões canônicas da Seção 24.1:</p>
        <ol>
          <li><strong>(Exercício 24.1-1, p. 535):</strong> Execute o algoritmo <code>BELLMAN-FORD</code> no grafo da Figura 24.4 do CLRS, usando a fonte $z$. Mostre os valores de $v.d$ e $v.\\pi$ após cada uma das passagens de relaxamento, e comprove a ausência de ciclos negativos.</li>
          <li><strong>(Exercício 24.1-3, p. 536):</strong> Modifique o pseudocódigo de <code>BELLMAN-FORD</code> para parar antecipadamente caso nenhuma estimativa $v.d$ seja alterada durante uma passagem completa de relaxamento. Prove formalmente que o algoritmo permanece correto e que seu tempo de execução passa a ser $O(k \\cdot E)$, onde $k$ é o número máximo de arestas em qualquer caminho mínimo simples a partir de $s$ ($k \\le |V| - 1$).</li>
        </ol>
      `,
      placeholder:
        "Apresente a tabela passo a passo da execução e escreva o pseudocódigo otimizado com flag booleana e a prova indutiva de convergência...",
      solution: `
        <h4>Parte 1 — Execução Passo a Passo a Partir de $z$ (Exercício 24.1-1)</h4>
        <p>Considere o grafo da Figura 24.4: $V = \\{s, t, x, y, z\\}$ e arestas $(s, t): 6, (s, y): 7, (t, x): 5, (t, y): 8, (t, z): -4, (x, t): -2, (y, x): -3, (y, z): 9, (z, x): 7, (z, s): 2$. Com fonte $z$:</p>
        <ul>
          <li><strong>Inicialização:</strong> $z.d = 0$; $s.d = t.d = x.d = y.d = \\infty$; todos $\\pi = \\text{NIL}$.</li>
          <li><strong>Passagem 1:</strong> Arestas saindo de $z$: $(z, s)$ com peso 2 dá $s.d = 2$ ($\\pi = z$); $(z, x)$ com peso 7 dá $x.d = 7$ ($\\pi = z$). Em seguida, $(s, t)$ com peso 6 dá $t.d = 2 + 6 = 8$ ($\\pi = s$); $(s, y)$ com peso 7 dá $y.d = 2 + 7 = 9$ ($\\pi = s$).</li>
          <li><strong>Passagem 2:</strong> Aresta $(t, x)$ com peso 5 não melhora $x$ ($8 + 5 = 13 > 7$), mas $(x, t)$ com peso -2 dá $t.d = \\min(8, 7 - 2) = 5$ ($\\pi = x$). Aresta $(y, x)$ com peso -3 dá $x.d = \\min(7, 9 - 3) = 6$ ($\\pi = y$).</li>
          <li><strong>Passagem 3:</strong> Como $x.d$ caiu para 6, a aresta $(x, t)$ reduz $t.d$ para $6 - 2 = 4$ ($\\pi = x$). Aresta $(t, z)$ tem custo $4 + (-4) = 0$, que não altera $z.d = 0$.</li>
          <li><strong>Passagem 4:</strong> Nenhuma estimativa muda ($s=2, t=4, x=6, y=9, z=0$). Na verificação das linhas 5–7, nenhuma aresta satisfaz $v.d > u.d + w(u, v)$, confirmando que não há ciclos negativos e retornando <code>TRUE</code>. $\\blacksquare$</li>
        </ul>

        <h4>Parte 2 — Modificação com Parada Antecipada em $O(k \\cdot E)$ (Exercício 24.1-3)</h4>
        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">BELLMAN-FORD-EARLY-STOP(G, w, s)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">INITIALIZE-SINGLE-SOURCE(G, s)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">para</span> i = 1 até |G.V| - 1</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   houve_mudanca = FALSE</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   <span class="kw">para cada</span> aresta (u, v) ∈ G.E</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">       <span class="kw">se</span> v.d > u.d + w(u, v)</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">           v.d = u.d + w(u, v)</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">           v.π = u</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">           houve_mudanca = TRUE</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">   <span class="kw">se</span> houve_mudanca == FALSE</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">      quebrar laço <span class="cmt">// Convergência prematura alcançada!</span></span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content"><span class="kw">para cada</span> aresta (u, v) ∈ G.E</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">  <span class="kw">se</span> v.d > u.d + w(u, v)</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">      <span class="kw">retornar</span> FALSE</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content"><span class="kw">retornar</span> TRUE</span></div>
            </div>
          </div>
        <p><strong>Demonstração de Corretude e Complexidade:</strong></p>
        <ul>
          <li><em>Corretude:</em> Se na $i$-ésima iteração <code>houve_mudanca == FALSE</code>, então para toda aresta $(u, v) \\in E$ vale $v.d \\le u.d + w(u, v)$. Isso satisfaz a Desigualdade Triangular para todos os pares adjacentes. Logo, nenhuma rodada subsequente de relaxamento poderia alterar qualquer valor de $v.d$. As estimativas estabilizaram em seus valores finais $\\delta(s, v)$ e não há ciclos de peso negativo (pois se houvesse um ciclo negativo alcançável, ele continuaria reduzindo distâncias a cada passagem em torno do ciclo).</li>
          <li><em>Complexidade $O(k \\cdot E)$:</em> Seja $k = \\max_{v \\in V \\text{ alcançável}} |p^*(s, v)|$ o número máximo de arestas em qualquer caminho mínimo simples enraizado em $s$. Pela <em>Propriedade do Relaxamento de Caminhos (Lema 24.15)</em>, após exatamente $k$ passagens de relaxamento, todo caminho mínimo de até $k$ arestas já terá convergido com precisão exata. A iteração $k+1$ executará sem realizar nenhuma alteração, acionando a linha 10. O algoritmo encerra em $k+1$ passagens, consumindo tempo total <strong>$O(k \\cdot E)$</strong>, onde $k \\le |V| - 1$. Em grafos com diâmetro pequeno de caminhos mínimos ($k \\ll |V|$), o ganho prático é massivo! $\\blacksquare$</li>
        </ul>
      `
    },
    {
      id: "ex12-2",
      code: "EXERCÍCIO 24.2-4 & PROBLEMA 24-1",
      reference: "Seção 24.2 — Caminhos Mais Longos e Caminho Crítico em DAGs (pp. 538–540 e 553)",
      title: "Caminhos Mais Longos em Grafos Acíclicos Dirigidos em Tempo $\\Theta(V + E)$ e Método PERT/CPM",
      prompt: `
        <p>No planejamento de projetos industriais e engenharia de software (método PERT/CPM — Program Evaluation and Review Technique), as tarefas são modeladas como vértices de um dígrafo acíclico (DAG) onde arestas representam dependências temporais e pesos representam durações mínimas.</p>
        <ol>
          <li><strong>(Exercício 24.2-4, p. 538):</strong> Formule um algoritmo linear em tempo $\\Theta(V + E)$ para computar o <strong>caminho mais longo</strong> a partir de uma fonte $s$ em um DAG $G = (V, E)$ com pesos reais arbitrários nas arestas.</li>
          <li><strong>(Problema 24-1a, p. 553):</strong> Demonstre formalmente por que o problema do caminho mais longo pode ser resolvido eficientemente em DAGs enquanto permanece comprovadamente NP-difícil em grafos dirigidos gerais com ciclos.</li>
        </ol>
      `,
      placeholder:
        "Apresente o pseudocódigo com inversão de relaxamento ou pesos opostos e a prova de independência estrutural em DAGs...",
      solution: `
        <h4>Parte 1 — Algoritmo Linear para o Caminho Mais Longo em DAGs (Exercício 24.2-4)</h4>
        <p>Podemos adaptar o algoritmo <code>DAG-SHORTEST-PATHS</code> substituindo a operação $\\min$ por $\\max$ no procedimento de relaxamento:</p>
        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">DAG-LONGEST-PATHS(G, w, s)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">ordenar topologicamente os vértices de G</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">para cada</span> vértice v ∈ G.V</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   v.d = -∞</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   v.π = NIL</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">s.d = 0</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">para cada</span> vértice u, tomado na ordem topológica</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">   <span class="kw">se</span> u.d ≠ -∞</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">       <span class="kw">para cada</span> vértice v ∈ G.Adj[u]</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">           <span class="kw">se</span> v.d < u.d + w(u, v)   <span class="cmt">// RELAXAMENTO MAXIMAL</span></span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">              v.d = u.d + w(u, v)</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">              v.π = u</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content"><span class="kw">retornar</span> d, π</span></div>
            </div>
          </div>
        <p><em>Complexidade:</em> A ordenação topológica via DFS consome $\\Theta(V + E)$. A inicialização custa $\\Theta(V)$ e os laços das linhas 6–11 inspecionam cada vértice e aresta exatamente uma vez, custando $\\sum_{u \\in V} \\text{grau-saída}(u) = |E|$. Tempo total estritamente linear: <strong>$\\Theta(V + E)$</strong>.</p>

        <h4>Parte 2 — Por Que Funciona em DAGs mas é NP-Difícil em Grafos Gerais? (Problema 24-1a)</h4>
        <p>A distinção teórica fundamental reside na <strong>preservação da simplicidade de caminhos</strong>:</p>
        <ul>
          <li><strong>Em Grafos com Ciclos:</strong> Para evitar pesos infinitos, o caminho mais longo é definido sobre caminhos <em>simples</em> (sem repetição de vértices). No entanto, subcaminhos de um caminho mais longo simples não podem reaproveitar nenhum dos vértices já utilizados no restante do caminho. Essa restrição de pertinência acopla globalmente todas as escolhas locais: a decisão ótima entre $u$ e $v$ depende do conjunto exato de vértices visitados antes de $u$ e depois de $v$! Essa dependência destrói o princípio da subestrutura ótima independente de Bellman, tornando o problema redutível ao Ciclo Hamiltoniano e, portanto, <strong>NP-difícil</strong>.</li>
          <li><strong>Em Grafos Acíclicos (DAGs):</strong> Como $G$ não possui nenhum ciclo direcionado, <strong>TODO caminho em um DAG é trivialmente um caminho simples</strong>! Não há perigo algum de um caminho revisitar um vértice. Logo, a restrição de simplicidade é automaticamente satisfeita sem necessidade de rastrear vértices previamente visitados. A ordenação topológica garante uma direção temporal estrita: ao processarmos o vértice $u$, todos os caminhos que chegam a $u$ já foram completamente explorados e consolidados em $u.d$. A subestrutura ótima $v.d = \\max_{(u, v) \\in E} \\{ u.d + w(u, v) \\}$ é perfeitamente independente e exata. $\\blacksquare$</li>
        </ul>
      `
    },
    {
      id: "ex12-3",
      code: "EXERCÍCIO 24.3-4 & 24.3-8",
      reference: "Seção 24.3 — Algoritmo de Dial e BFS 0-1 (pp. 544–545)",
      title: "Otimização de Dijkstra com Pesos Inteiros Pequenos: Fila de Baldes de Dial em $O(VW + E)$ e BFS 0-1 em $O(V + E)$",
      prompt: `
        <p>Considere casos especiais do algoritmo de Dijkstra onde os pesos das arestas são números inteiros restritos a um intervalo limitado:</p>
        <ol>
          <li><strong>(Exercício 24.3-8, p. 545):</strong> Suponha que todos os pesos das arestas sejam inteiros no intervalo $\\{0, 1, \\dots, W\\}$, para alguma constante inteira $W \\ge 1$. Mostre como implementar a fila de prioridades de Dijkstra usando um arranjo de listas encadeadas (baldes) para atingir tempo de execução <strong>$O(VW + E)$</strong> (Algoritmo de Dial).</li>
          <li><strong>(Exercício 24.3-4, p. 544):</strong> No caso particular onde $W = 1$ (arestas com pesos apenas em $\\{0, 1\\}$), mostre como resolver caminhos mínimos de fonte única em tempo estritamente linear <strong>$O(V + E)$</strong> usando uma <em>deque</em> (fila de duas extremidades — 0-1 BFS).</li>
        </ol>
      `,
      placeholder:
        "Descreva a estrutura de baldes circulares de tamanho W+1 e o mecanismo de inserção na frente/trás da deque para 0-1 BFS...",
      solution: `
        <h4>Parte 1 — Algoritmo de Dial com Fila de Baldes em $O(VW + E)$ (Exercício 24.3-8)</h4>
        <p>Como todos os pesos de arestas são inteiros não negativos $\\le W$, a distância máxima possível de qualquer vértice simples a partir de $s$ é $(|V| - 1)W$. Além disso, as distâncias dos vértices extraídos por Dijkstra são não decrescentes. Quando extraímos um vértice $u$ com distância $d = u.d$, qualquer aresta relaxada $(u, v)$ define $v.d = u.d + w(u, v) \\le d + W$. Portanto, em qualquer momento, todas as chaves ativas na fila de prioridades residem no intervalo <strong>$[d, d + W]$</strong>, abrangendo no máximo $W + 1$ valores inteiros distintos!</p>
        <ul>
          <li><strong>Estrutura de Dados (Baldes Circulares):</strong> Mantemos um arranjo circular de $W + 1$ listas duplamente encadeadas: $\\text{Balde}[0 \\dots W]$. Um vértice $v$ com estimativa $v.d$ é armazenado na lista $\\text{Balde}[v.d \\pmod{W + 1}]$.</li>
          <li><strong>Operação <code>DECREASE-KEY</code> em $O(1)$:</strong> Para atualizar $v.d$ para $v.d'$, removemos $v$ de sua lista atual e inserimos na cabeça de $\\text{Balde}[v.d' \\pmod{W + 1}]$ em tempo constante $O(1)$. Como há no máximo $|E|$ relaxamentos, o custo total é $O(E)$.</li>
          <li><strong>Operação <code>EXTRACT-MIN</code> em $O(W + 1)$ amortizado:</strong> Mantemos um ponteiro $\\text{idx}$ para o índice da menor distância atual. Para encontrar o próximo mínimo, avançamos $\\text{idx}$ circularmente até encontrar um balde não vazio. Como a menor distância nunca decresce e varia de $0$ a $|V|W$, o ponteiro avança no máximo $|V|W$ vezes ao longo de todo o algoritmo!</li>
        </ul>
        <p>Tempo total: $\\Theta(V)$ na inicialização $+ O(VW)$ avançando o ponteiro $+ O(E)$ em relaxamentos = <strong>$O(VW + E)$</strong>. Se $W = O(1)$, o algoritmo executa em tempo linear $\\Theta(V + E)$!</p>

        <h4>Parte 2 — BFS 0-1 em Tempo $O(V + E)$ usando Deque (Exercício 24.3-4)</h4>
        <p>Quando $W = 1$, os pesos de arestas pertencem exclusivamente a $\\{0, 1\\}$. Mantemos uma <strong>fila de duas extremidades (Deque)</strong> $Q$:</p>
        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">BFS-0-1(G, w, s)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">INITIALIZE-SINGLE-SOURCE(G, s)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">Q = nova Deque vazia</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">PUSH-BACK(Q, s)</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">enquanto</span> Q ≠ vazia</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">   u = POP-FRONT(Q)</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">   <span class="kw">para cada</span> vértice v ∈ G.Adj[u]</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">       <span class="kw">se</span> v.d > u.d + w(u, v)</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">           v.d = u.d + w(u, v)</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">           v.π = u</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">          <span class="kw">se</span> w(u, v) == 0</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">              PUSH-FRONT(Q, v)   <span class="cmt">// Aresta de custo 0 mantém o nível de distância!</span></span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">          <span class="kw">senão</span></span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">              PUSH-BACK(Q, v)    <span class="cmt">// Aresta de custo 1 avança para o próximo nível!</span></span></div>
            </div>
          </div>
        <p><em>Justificativa:</em> Uma aresta de peso $0$ não aumenta a distância ($v.d = u.d$), logo $v$ deve ser processado imediatamente junto com o nível atual na frente da deque; uma aresta de peso $1$ ($v.d = u.d + 1$) coloca $v$ no final da fila. A deque contém no máximo dois valores de distância consecutivos a qualquer momento, garantindo que os vértices saiam em ordem estritamente não decrescente de distância. Cada vértice entra e sai da deque no máximo uma vez, e cada aresta é examinada uma vez. Tempo total estritamente ótimo: <strong>$\\Theta(V + E)$</strong>! $\\blacksquare$</p>
      `
    },
    {
      id: "ex12-4",
      code: "EXERCÍCIO 24.4-1 & 24.4-6",
      reference: "Seção 24.4 — Resolução de Sistemas de Restrições de Diferença (pp. 547–548)",
      title: "Resolução Completa de Sistemas com Limites Inferiores e Superiores via Bellman-Ford",
      prompt: `
        <p>Resolva o sistema de restrições lineares da Seção 24.4:</p>
        <ol>
          <li><strong>(Exercício 24.4-1, p. 547):</strong> Encontre uma solução factível para o sistema de restrições de diferença:
          $$x_1 - x_2 \\le 1, \\quad x_1 - x_4 \\le -4, \\quad x_2 - x_3 \\le 2, \\quad x_2 - x_5 \\le 7, \\quad x_3 - x_1 \\le 5,$$
          $$x_4 - x_2 \\le 2, \\quad x_4 - x_5 \\le 3, \\quad x_5 - x_3 \\le 10, \\quad x_5 - x_4 \\le 2$$
          ou demonstre que o sistema é inconsistente construindo o grafo de restrições e executando <code>BELLMAN-FORD</code> a partir de $v_0$.</li>
          <li><strong>(Exercício 24.4-6, p. 548):</strong> Suponha que o sistema também contenha restrições com limites inferiores da forma $x_j - x_i \\ge c_k$. Mostre como transformar essas restrições na forma padrão $x_i - x_j \\le -c_k$ e incorporá-las ao grafo de restrições mantendo a aplicabilidade de Bellman-Ford.</li>
        </ol>
      `,
      placeholder:
        "Desenhe a lista de arestas do grafo de restrições, mostre as distâncias a partir de v0 e comprove a factibilidade...",
      solution: `
        <h4>Parte 1 — Resolução do Sistema via Grafo de Restrições (Exercício 24.4-1)</h4>
        <p>O sistema possui $n = 5$ variáveis e $m = 9$ restrições. Construímos o grafo de restrições $G = (V, E)$ com $V = \\{v_0, v_1, v_2, v_3, v_4, v_5\\}$:</p>
        <ul>
          <li>Arestas partindo de $v_0$: $(v_0, v_i)$ com peso $0$ para $i \\in \\{1, 2, 3, 4, 5\\}$.</li>
          <li>Arestas de restrições $x_j - x_i \\le b_k \\implies (v_i, v_j)$ com peso $b_k$:
            <br>$(v_2, v_1): 1$, $(v_4, v_1): -4$, $(v_3, v_2): 2$, $(v_5, v_2): 7$, $(v_1, v_3): 5$,
            <br>$(v_2, v_4): 2$, $(v_5, v_4): 3$, $(v_3, v_5): 10$, $(v_4, v_5): 2$.
          </li>
        </ul>
        <p>Executamos <code>BELLMAN-FORD(G, w, v_0)</code>:</p>
        <ol>
          <li>Inicialização: $v_0.d = 0$, $v_1.d = v_2.d = v_3.d = v_4.d = v_5.d = 0$.</li>
          <li>Passagem 1: A aresta $(v_4, v_1)$ com peso -4 reduz $v_1.d$ de 0 para $0 + (-4) = -4$. As demais arestas não melhoram estimativas.</li>
          <li>Passagem 2: Com $v_1.d = -4$, a aresta $(v_1, v_3)$ com peso 5 dá $v_3.d = \\min(0, -4 + 5) = 0$ (não altera). A aresta $(v_2, v_4)$ tem peso 2 ($0 + 2 = 2$). Aresta $(v_4, v_1)$ permanece $-4$.</li>
          <li>Passagem 3 e 4: Nenhuma estimativa adicional é reduzida. As distâncias finais a partir de $v_0$ convergem para:
          $$v_0.d = 0, \\quad v_1.d = -4, \\quad v_2.d = 0, \\quad v_3.d = 0, \\quad v_4.d = 0, \\quad v_5.d = 0$$</li>
        </ol>
        <p><em>Verificação de Consistência das Inequações:</em></p>
        <ul>
          <li>$x_1 - x_2 = -4 - 0 = -4 \\le 1$ (Satisfeita com folga 5)</li>
          <li>$x_1 - x_4 = -4 - 0 = -4 \\le -4$ (Satisfeita na igualdade)</li>
          <li>$x_2 - x_3 = 0 - 0 = 0 \\le 2$ (Satisfeita)</li>
          <li>$x_2 - x_5 = 0 - 0 = 0 \\le 7$ (Satisfeita)</li>
          <li>$x_3 - x_1 = 0 - (-4) = 4 \\le 5$ (Satisfeita)</li>
          <li>$x_4 - x_2 = 0 - 0 = 0 \\le 2$ (Satisfeita)</li>
          <li>$x_4 - x_5 = 0 - 0 = 0 \\le 3$ (Satisfeita)</li>
          <li>$x_5 - x_3 = 0 - 0 = 0 \\le 10$ (Satisfeita)</li>
          <li>$x_5 - x_4 = 0 - 0 = 0 \\le 2$ (Satisfeita)</li>
        </ul>
        <p>Solução factível obtida: <strong>$x = (-4, 0, 0, 0, 0)$</strong> (ou somando $+4$: $x = (0, 4, 4, 4, 4)$).</p>

        <h4>Parte 2 — Incorporação de Limites Inferiores $x_j - x_i \\ge c_k$ (Exercício 24.4-6)</h4>
        <p>Multiplicando ambos os lados da desigualdade por $-1$, invertemos a relação de ordem:</p>
        $$x_j - x_i \\ge c_k \\iff -(x_j - x_i) \\le -c_k \\iff x_i - x_j \\le -c_k$$
        <p>Essa inequação está agora na forma canônica padrão de restrição de diferença! No grafo de restrições $G$, ela corresponde a uma <strong>aresta dirigida partindo de $v_j$ para $v_i$</strong> com peso $w(v_j, v_i) = -c_k$. O algoritmo de Bellman-Ford pode ser executado sem nenhuma modificação, detectando inconsistências via ciclos negativos caso limites inferiores e superiores entrem em contradição (exemplo: $x_j - x_i \\le 2$ e $x_j - x_i \\ge 5$). $\\blacksquare$</p>
      `
    },
    {
      id: "ex12-5",
      code: "EXERCÍCIOS 25.1-8 & 25.2-4",
      reference: "Capítulo 25.1 & 25.2 — Otimização de Espaço em Floyd-Warshall e Detecção de Ciclos Negativos (pp. 565 e 570)",
      title: "Demonstração da Otimização In-Place de Floyd-Warshall em Espaço $\\Theta(n^2)$ e Detecção de Ciclos Negativos",
      prompt: `
        <p>Analise os detalhes de implementação matricial de Floyd-Warshall:</p>
        <ol>
          <li><strong>(Exercício 25.2-4, p. 570):</strong> Mostre como implementar o algoritmo de Floyd-Warshall usando uma única matriz $D$ de dimensão $n \\times n$ (otimização in-place em espaço $\\Theta(n^2)$), dispensando o índice de iteração $(k)$. Prove que nenhuma entrada utilizada no cálculo é sobrescrita prematuramente.</li>
          <li><strong>(Exercício 25.1-8, p. 565):</strong> Como podemos usar as saídas dos algoritmos de caminhos mínimos entre todos os pares (Floyd-Warshall ou Multiplicação Matricial) para detectar se o grafo contém algum <strong>ciclo de peso negativo</strong>? Demonstre a equivalência com a diagonal principal da matriz de distâncias.</li>
        </ol>
      `,
      placeholder:
        "Prove que d_ik e d_kj não mudam na k-ésima iteração e relacione d_ii < 0 com a existência de ciclos negativos...",
      solution: `
        <h4>Parte 1 — Demonstração da Execução In-Place em $\\Theta(n^2)$ (Exercício 25.2-4)</h4>
        <p>No pseudocódigo padrão de Floyd-Warshall, a atualização é dada por:</p>
        $$d_{ij}^{(k)} = \\min\\left( d_{ij}^{(k-1)}, \\; d_{ik}^{(k-1)} + d_{kj}^{(k-1)} \\right)$$
        <p>Se utilizarmos uma única matriz $D$ e atualizarmos $D[i, j] = \\min(D[i, j], D[i, k] + D[k, j])$, poderíamos temer que atualizar uma entrada sobrescrevesse um valor que ainda será necessário para calcular outra entrada na mesma iteração $k$. Provemos que isso <strong>NUNCA ocorre</strong>:</p>
        <ul>
          <li>Considere as entradas da <strong>linha $k$</strong>: para qualquer $j$, temos:
          $$d_{kj}^{(k)} = \\min\\left( d_{kj}^{(k-1)}, \\; d_{kk}^{(k-1)} + d_{kj}^{(k-1)} \\right)$$
          Como não há ciclos negativos, a menor distância de $k$ a $k$ com intermediários em $\\{1, \\dots, k-1\\}$ é $d_{kk}^{(k-1)} = 0$. Logo, $d_{kk}^{(k-1)} + d_{kj}^{(k-1)} = 0 + d_{kj}^{(k-1)} = d_{kj}^{(k-1)}$. Assim, $d_{kj}^{(k)} = \\min(d_{kj}^{(k-1)}, d_{kj}^{(k-1)}) = d_{kj}^{(k-1)}$! A linha $k$ permanece estritamente invariante na iteração $k$.</li>
          <li>Considere as entradas da <strong>coluna $k$</strong>: analogamente, para qualquer $i$:
          $$d_{ik}^{(k)} = \\min\\left( d_{ik}^{(k-1)}, \\; d_{ik}^{(k-1)} + d_{kk}^{(k-1)} \\right) = d_{ik}^{(k-1)}$$
          A coluna $k$ também permanece estritamente invariante na iteração $k$!</li>
        </ul>
        <p>Como o cálculo de qualquer $D[i, j]$ depende exclusivamente de valores da linha $k$ ($D[k, j]$) e da coluna $k$ ($D[i, k]$), e nenhum desses valores se altera durante toda a passagem $k$, a ordem das atualizações das células na matriz é irrelevante! Podemos computar <em>in-place</em> com uma única matriz $n \\times n$, reduzindo o consumo de memória de $\\Theta(n^3)$ para estritamente <strong>$\\Theta(n^2)$</strong>. $\\blacksquare$</p>

        <h4>Parte 2 — Detecção de Ciclos Negativos via Diagonal Principal (Exercício 25.1-8)</h4>
        <p><strong>Teorema:</strong> Um grafo $G$ contém um ciclo de peso estritamente negativo se e somente se, ao término de Floyd-Warshall, existe algum vértice $i$ tal que <strong>$d_{ii} < 0$</strong>.</p>
        <ul>
          <li><em>($\\Rightarrow$):</em> Suponha que $G$ contenha um ciclo negativo $c = \\langle v_1, v_2, \\dots, v_r, v_1 \\rangle$ com peso $w(c) < 0$. Seja $k = \\max \\{v_1, \\dots, v_r\\}$ o vértice de maior rótulo no ciclo $c$. Todos os outros vértices do ciclo pertencem a $\\{1, \\dots, k-1\\}$. Na iteração $k$, o ciclo $c$ representa um caminho fechado de $k$ a $k$ cujos intermediários residem em $\\{1, \\dots, k-1\\}$. Logo, $d_{kk}^{(k)} \\le w(c) < 0$. Como estimativas em Floyd-Warshall decrescem monotonicamente, na terminação teremos $d_{kk}^{(n)} \\le d_{kk}^{(k)} < 0$.</li>
          <li><em>($\\Leftarrow$):</em> Inicialmente $d_{ii}^{(0)} = w_{ii} = 0$. Se ao final $d_{ii}^{(n)} < 0$, a estimativa $d_{ii}$ decresceu estritamente em relação a $0$. Como cada redução corresponde ao peso de algum caminho fechado simples de $i$ a $i$, deve existir um ciclo contendo $i$ com peso estritamente negativo. $\\blacksquare$</li>
        </ul>
      `
    },
    {
      id: "ex12-6",
      code: "EXERCÍCIOS 25.3-4 & 25.3-5",
      reference: "Seção 25.3 — Propriedades da Reponderação de Johnson (pp. 577–578)",
      title: "Análise Rigorosa da Reponderação de Johnson: Refutação da Falácia de Greenstreet e Preservação de Ciclos de Peso Zero",
      prompt: `
        <p>Aprofunde a teoria matemática da reponderação de arestas no Algoritmo de Johnson:</p>
        <ol>
          <li><strong>(Exercício 25.3-4, p. 577):</strong> O professor Greenstreet afirma que existe um método muito mais simples de reponderar arestas: seja $w^* = \\min_{(u,v) \\in E} \\{w(u, v)\\}$. Se $w^* < 0$, basta definir a nova função peso somando $|w^*|$ a todas as arestas: $\\hat{w}(u, v) = w(u, v) - w^*$. Construa um contraexemplo formal detalhado com vértices, arestas e pesos provando que o método de Greenstreet distorce caminhos mínimos.</li>
          <li><strong>(Exercício 25.3-5, p. 578):</strong> Suponha que executemos o algoritmo de Johnson em um grafo dirigido $G$ com função peso $w$. Mostre que se $G$ contém um ciclo $c$ de peso zero ($w(c) = 0$), então $\\hat{w}(u, v) = 0$ para toda aresta $(u, v)$ pertencente a $c$.</li>
        </ol>
      `,
      placeholder:
        "Apresente o grafo contraexemplo com pesos e caminhos de diferentes comprimentos, e demonstre o cancelamento em ciclos de peso zero...",
      solution: `
        <h4>Parte 1 — O Contraexemplo Formal contra Greenstreet (Exercício 25.3-4)</h4>
        <p>Considere o grafo dirigido com $V = \\{s, a, t\\}$ e duas rotas alternativas de $s$ a $t$:</p>
        <ul>
          <li>Rota 1 (1 aresta): aresta direta $(s, t)$ com peso $w(s, t) = 2$.</li>
          <li>Rota 2 (2 arestas): caminho $\\langle s, a, t \\rangle$ com arestas $(s, a)$ de peso $1$ e $(a, t)$ de peso $-2$.</li>
        </ul>
        <p>Calculando os pesos originais sob $w$:</p>
        <ul>
          <li>$w(\\text{Rota 1}) = 2$.</li>
          <li>$w(\\text{Rota 2}) = 1 + (-2) = -1$.</li>
        </ul>
        <p>Sob a métrica original $w$, a Rota 2 é estritamente mais curta que a Rota 1 ($-1 < 2$).</p>
        <p>Agora aplicamos a proposta de Greenstreet: o peso mínimo no grafo é $w^* = -2$. Definimos $\\hat{w}(u, v) = w(u, v) - (-2) = w(u, v) + 2$:</p>
        <ul>
          <li>$\\hat{w}(s, t) = 2 + 2 = 4$. (A Rota 1 agora tem peso 4).</li>
          <li>$\\hat{w}(s, a) = 1 + 2 = 3$, e $\\hat{w}(a, t) = -2 + 2 = 0$.</li>
          <li>$\\hat{w}(\\text{Rota 2}) = \\hat{w}(s, a) + \\hat{w}(a, t) = 3 + 0 = 3$.</li>
        </ul>
        <p>Até aqui a Rota 2 ainda venceu ($3 < 4$). Agora adicione mais uma aresta intermediária à Rota 2: suponha que a rota fosse composta por 4 arestas de peso $0, 0, 0, -2$ (peso total original $-2$). Sob a nova métrica, cada aresta ganharia $+2$, somando $2 + 2 + 2 + 0 = 6 > 4$! A rota direta de 1 aresta ganharia apenas um único acréscimo de $+2$, tornando-se artificialmente menor que a rota de múltiplas arestas. A adição pura de constante favorece trajetórias com menos arestas, quebrando a subestrutura ótima.</p>

        <h4>Parte 2 — Demonstração para Ciclos de Peso Zero (Exercício 25.3-5)</h4>
        <p>Seja $c = \\langle v_0, v_1, \\dots, v_k \\rangle$ um ciclo simples em $G$ com $v_0 = v_k$ e peso original nulo: $w(c) = \\sum_{i=1}^k w(v_{i-1}, v_i) = 0$.</p>
        <p>No algoritmo de Johnson, a reponderação é dada por $\\hat{w}(u, v) = w(u, v) + h(u) - h(v)$, onde $h(v) = \\delta(s, v)$ são distâncias computadas por Bellman-Ford a partir da fonte auxiliar. Pela Desigualdade Triangular, temos para toda aresta do grafo:</p>
        $$\\hat{w}(u, v) = w(u, v) + h(u) - h(v) \\ge 0$$
        <p>Ou seja, todo peso $\\hat{w}(u, v)$ é <strong>não negativo</strong> ($\\ge 0$). Agora, somamos esses novos pesos ao longo do ciclo $c$:</p>
        $$\\hat{w}(c) = \\sum_{i=1}^k \\hat{w}(v_{i-1}, v_i) = \\sum_{i=1}^k \\left( w(v_{i-1}, v_i) + h(v_{i-1}) - h(v_i) \\right)$$
        <p>Como a soma de $h(v_{i-1}) - h(v_i)$ em um ciclo fecha telescopicamente em $h(v_0) - h(v_k) = 0$ (Lema 25.2), temos:</p>
        $$\\hat{w}(c) = w(c) + 0 = 0$$
        <p>Temos uma soma de $k$ termos reais $\\hat{w}(v_{i-1}, v_i)$ onde cada termo é obrigatoriamente $\\ge 0$, e a soma total é exatamente igual a $0$:</p>
        $$\\sum_{i=1}^k \\hat{w}(v_{i-1}, v_i) = 0 \\quad \\text{com } \\hat{w}(v_{i-1}, v_i) \\ge 0 \\quad \\forall i$$
        <p>A única possibilidade matemática para que uma soma de números não negativos resulte em zero é que <strong>CADA TERMO SEJA RIGOROSAMENTE IGUAL A ZERO</strong>:</p>
        $$\\hat{w}(u, v) = 0 \\quad \\text{para toda aresta } (u, v) \\in c. \\quad \\blacksquare$$
      `
    },
    {
      id: "ex12-7",
      code: "EXERCÍCIO 26.2-3 & 26.2-9",
      reference: "Seção 26.2 — Determinação de Corte Mínimo e Atualização Dinâmica de Capacidade (pp. 600–601)",
      title: "Construção Algorítmica do Corte Mínimo em Tempo $O(V + E)$ e Atualização de Fluxo em Tempo Linear",
      prompt: `
        <p>Considere o Teorema do Fluxo Máximo–Corte Mínimo e a dinamização de redes:</p>
        <ol>
          <li><strong>(Exercício 26.2-3, p. 600):</strong> Dado um fluxo máximo $f$ em uma rede $G = (V, E)$, descreva um algoritmo de tempo $O(V + E)$ para encontrar um corte de capacidade mínima $(S, T)$. Esse corte mínimo é sempre único? Justifique com um contraexemplo.</li>
          <li><strong>(Exercício 26.2-9, p. 601):</strong> Suponha que tenhamos computado um fluxo máximo $f$ em uma rede $G$ com capacidades inteiras. Se a capacidade de uma única aresta $(u, v)$ for incrementada em $1$ unidade ($c'(u, v) = c(u, v) + 1$), mostre como encontrar o novo fluxo máximo na rede modificada em tempo <strong>$O(V + E)$</strong>, sem reexecutar o algoritmo de fluxo do zero.</li>
        </ol>
      `,
      placeholder:
        "Apresente a busca BFS em G_f para construir S, discuta a unicidade e mostre o aumento único em O(V+E)...",
      solution: `
        <h4>Parte 1 — Construção do Corte Mínimo em $O(V + E)$ e Unicidade (Exercício 26.2-3)</h4>
        <p><strong>Algoritmo de Construção:</strong></p>
        <ol>
          <li>Construa a rede residual final $G_f = (V, E_f)$ associada ao fluxo máximo $f$.</li>
          <li>Execute uma busca em largura ou profundidade (<code>BFS(G_f, s)</code> ou <code>DFS</code>) iniciando na fonte $s$, percorrendo apenas arestas com capacidade residual estritamente positiva ($c_f(u, v) > 0$).</li>
          <li>Defina $S$ como o conjunto de todos os vértices visitados pela busca (alcançáveis de $s$ em $G_f$) e $T = V - S$.</li>
        </ol>
        <p><em>Complexidade:</em> Como o fluxo já é máximo, $G_f$ tem $|V|$ vértices e no máximo $2|E|$ arestas residuais. A travessia consome tempo linear <strong>$O(V + E)$</strong>.</p>
        <p><em>Unicidade:</em> O corte mínimo <strong>NÃO é necessariamente único</strong>! Considere uma rede com 4 vértices em linha: $s \\to a \\to b \\to t$, onde todas as 3 arestas possuem capacidade $c = 1$. O fluxo máximo é $|f^*| = 1$. Qualquer um dos três cortes a seguir possui capacidade $c(S, T) = 1$ e, portanto, todos são cortes mínimos válidos:</p>
        <ul>
          <li>Corte 1: $S_1 = \\{s\\}, T_1 = \\{a, b, t\\}$ com capacidade $c(s, a) = 1$.</li>
          <li>Corte 2: $S_2 = \\{s, a\\}, T_2 = \\{b, t\\}$ com capacidade $c(a, b) = 1$.</li>
          <li>Corte 3: $S_3 = \\{s, a, b\\}, T_3 = \\{t\\}$ com capacidade $c(b, t) = 1$.</li>
        </ul>

        <h4>Parte 2 — Atualização de Fluxo em Tempo $O(V + E)$ após Incremento de Capacidade (Exercício 26.2-9)</h4>
        <p>Quando a capacidade de $(u, v)$ aumenta de $c(u, v)$ para $c(u, v) + 1$, o fluxo original $f$ continua sendo um fluxo viável na nova rede, pois $0 \\le f(x, y) \\le c(x, y) \\le c'(x, y)$ e a conservação de fluxo não foi violada em nenhum vértice.</p>
        <p>Na nova rede residual $G'_{f}$, a capacidade residual da aresta $(u, v)$ é incrementada em $1$:</p>
        $$c'_{f}(u, v) = c'(u, v) - f(u, v) = (c(u, v) + 1) - f(u, v) = c_f(u, v) + 1$$
        <p>Pelo Teorema do Fluxo Máximo–Corte Mínimo, como a capacidade de apenas uma aresta aumentou em $+1$, a capacidade de qualquer corte $(S, T)$ que contém $(u, v)$ aumenta no máximo em $+1$, e os cortes que não contêm $(u, v)$ permanecem inalterados. Logo, o novo fluxo máximo $|f'^*|$ pode ser ou $|f^*|$ ou $|f^*| + 1$!</p>
        <p><strong>Procedimento em $O(V + E)$:</strong></p>
        <ol>
          <li>Atualize a rede residual $G'_{f}$ adicionando $+1$ à capacidade residual de $(u, v)$.</li>
          <li>Execute uma única <strong>Busca em Largura (BFS)</strong> em $G'_{f}$ a partir de $s$ procurando um caminho aumentador até $t$.</li>
          <li>Se a BFS encontrar um caminho aumentador $p$ de $s$ a $t$, como todas as capacidades residuais originais estavam esgotadas nos gargalos e apenas uma unidade foi injetada, a capacidade residual de $p$ será $c'_{f}(p) = 1$. Aumentamos o fluxo ao longo de $p$ em $+1$ unidade: $|f'| = |f^*| + 1$.</li>
          <li>Se a BFS não alcançar $t$, então não existe caminho aumentador em $G'_{f}$, o que prova que o fluxo original $f$ já é o fluxo máximo da nova rede ($|f'^*| = |f^*|$).</li>
        </ol>
        <p>Como executamos apenas uma única BFS sobre a rede, o tempo total é estritamente <strong>$O(V + E)$</strong>! $\\blacksquare$</p>
      `
    },
    {
      id: "ex12-8",
      code: "PROBLEMAS 26-1 & 26-4",
      reference: "Capítulo 26 — Capacidades em Vértices e Análise de Sensibilidade de Fluxo (pp. 621 e 623)",
      title: "Modelagem de Redes com Capacidades em Vértices e Análise de Sensibilidade de Arestas",
      prompt: `
        <p>Resolva dois problemas teóricos e de modelagem fundamentais do Capítulo 26:</p>
        <ol>
          <li><strong>(Problema 26-1, p. 621 — Redes com Capacidades nos Vértices):</strong> Em uma rede de tráfego aéreo ou roteamento de pacotes, além das restrições de capacidade nas arestas $c(u, v)$, cada vértice $v \\in V$ possui uma capacidade máxima de passagem $c(v) \\ge 0$, limitando o fluxo total que pode atravessar $v$: $\\sum_{u} f(u, v) \\le c(v)$. Mostre como transformar essa rede em uma rede de fluxo clássica equivalente que possua capacidades apenas nas arestas, preservando o valor do fluxo máximo.</li>
          <li><strong>(Problema 26-4, p. 623 — Sensibilidade de Arestas no Fluxo Máximo):</strong> Seja $f$ um fluxo máximo em $G = (V, E)$. Uma aresta $(u, v) \\in E$ é dita <em>crítica de aumento</em> se incrementar sua capacidade $c(u, v)$ estritamente aumenta o valor do fluxo máximo. Dê uma caracterização necessária e suficiente para uma aresta ser crítica de aumento em termos de cortes mínimos, e forneça um algoritmo eficiente para identificar todas as arestas críticas de aumento em tempo $O(V + E)$ após a execução do fluxo máximo.</li>
        </ol>
      `,
      placeholder:
        "Apresente a técnica de divisão de vértices v_in e v_out e a caracterização por arestas que cruzam TODOS os cortes mínimos...",
      solution: `
        <h4>Parte 1 — Redução de Capacidades em Vértices via Divisão de Nós (Problema 26-1)</h4>
        <p>Dada a rede $G = (V, E)$ com capacidades de arestas $c(u, v)$ e capacidades de vértices $c(v)$ para $v \\in V - \\{s, t\\}$, construímos uma rede equivalente $G' = (V', E')$ aplicando a <strong>técnica clássica de divisão de vértices</strong> (*vertex splitting*):</p>
        <ul>
          <li>Para cada vértice intermediário $v \\in V - \\{s, t\\}$, substituímos $v$ por dois vértices acoplados: um vértice de entrada <strong>$v_{\\text{in}}$</strong> e um vértice de saída <strong>$v_{\\text{out}}$</strong>.</li>
          <li>Conectamos $v_{\\text{in}}$ a $v_{\\text{out}}$ por uma aresta dirigida interna $(v_{\\text{in}}, v_{\\text{out}})$ cuja capacidade é exatamente a capacidade do vértice original:
          $$c'(v_{\\text{in}}, v_{\\text{out}}) = c(v)$$</li>
          <li>Para toda aresta original $(u, v) \\in E$:
            <ul>
              <li>Se $u = s$ e $v = t$, mantemos $(s, t)$ com capacidade $c(s, t)$.</li>
              <li>Se $u = s$ e $v \\neq t$, criamos a aresta $(s, v_{\\text{in}})$ com capacidade $c(s, v)$.</li>
              <li>Se $u \\neq s$ e $v = t$, criamos a aresta $(u_{\\text{out}}, t)$ com capacidade $c(u, t)$.</li>
              <li>Se $u, v \\in V - \\{s, t\\}$, criamos a aresta $(u_{\\text{out}}, v_{\\text{in}})$ com capacidade $c(u, v)$.</li>
            </ul>
          </li>
        </ul>
        <p><em>Demonstração de Equivalência:</em> Todo fluxo que entra em $v$ na rede original deve entrar em $v_{\\text{in}}$ na rede $G'$. Pela conservação de fluxo em $v_{\\text{in}}$, todo esse fluxo é forçado a atravessar a aresta única $(v_{\\text{in}}, v_{\\text{out}})$, cuja capacidade é $c(v)$, satisfazendo a restrição de capacidade no vértice $\\sum_{u} f(u, v) \\le c(v)$. Em seguida, o fluxo sai de $v_{\\text{out}}$ para seus vizinhos originais. Logo, qualquer fluxo viável em $G$ mapeia bijetivamente para um fluxo viável em $G'$ de mesmo valor, e vice-versa!</p>
        <p>A rede $G'$ possui $|V'| = 2|V| - 2$ vértices e $|E'| = |E| + |V| - 2$ arestas. A transformação é linear em tempo $\\Theta(V + E)$ e permite aplicar diretamente Ford-Fulkerson, Edmonds-Karp ou Push-Relabel.</p>

        <h4>Parte 2 — Análise de Sensibilidade e Arestas Críticas de Aumento (Problema 26-4)</h4>
        <p><strong>Caracterização Teórica:</strong> Incrementar a capacidade de uma aresta $(u, v)$ aumenta o fluxo máximo se e somente se <strong>$(u, v)$ cruza TODOS os cortes mínimos da rede</strong>!</p>
        <ul>
          <li>Se existisse algum corte mínimo $(S, T)$ que não contivesse $(u, v)$ cruzando de $S$ para $T$, a capacidade desse corte $c(S, T)$ não aumentaria com o incremento de $c(u, v)$. Pelo Corolário 26.5 ($|f^*| \\le c(S, T)$), o novo fluxo máximo continuaria limitado pelo mesmo valor $c(S, T)$, impedindo qualquer aumento no fluxo global!</li>
          <li>Portanto, uma aresta $(u, v)$ é crítica de aumento $\\iff$ para todo corte mínimo $(S, T)$, temos $u \\in S$ e $v \\in T$.</li>
        </ul>
        <p><strong>Algoritmo de Identificação em Tempo $O(V + E)$ pós-Fluxo Máximo:</strong></p>
        <ol>
          <li>Dada a rede residual $G_f$, encontre o subconjunto <strong>$S_{\\min}$</strong> de todos os vértices alcançáveis a partir de $s$ em $G_f$ (via BFS/DFS a partir de $s$). O corte $(S_{\\min}, V - S_{\\min})$ é o corte mínimo mais próximo da fonte.</li>
          <li>Encontre o subconjunto <strong>$T_{\\min}$</strong> de todos os vértices que conseguem alcançar $t$ em $G_f$ (executando uma BFS/DFS a partir de $t$ no grafo transposto $G_f^{\\text{T}}$). O conjunto $V - T_{\\min}$ define o corte mínimo mais próximo do sorvedouro.</li>
          <li>Uma aresta $(u, v) \\in E$ pertence a todos os cortes mínimos se e somente se:
          $$u \\in S_{\\min} \\quad \\text{e} \\quad v \\in T_{\\min}$$
          (além de estar completamente saturada, $f(u, v) = c(u, v)$).</li>
          <li>Basta percorrer todas as arestas $(u, v) \\in E$ e testar essa pertinência em tempo $O(1)$ por aresta.</li>
        </ol>
        <p>Tempo total: duas buscas lineares $\\implies$ <strong>$O(V + E)$</strong>! $\\blacksquare$</p>
      `
    }
  ];

  if (typeof window.registerCodexModule === "function") {
    window.registerCodexModule(12, {
      revisao,
      unidades,
      initWorkbenches,
      quizzes,
      exercicios
    });
  }
})();
