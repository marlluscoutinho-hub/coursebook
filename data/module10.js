/* ==========================================================================
   MÓDULO 10 — Estruturas Avançadas: Árvores B, Heaps de Fibonacci,
               Árvores de van Emde Boas (vEB) e Conjuntos Disjuntos
   Capítulos 18, 19, 20 e 21 (pp. 398–482) — Cormen, Leiserson, Rivest e Stein
   ========================================================================== */

(function () {
  if (typeof window === "undefined" || typeof window.registerCodexModule !== "function") {
    return;
  }

  const revisao = {
    subtitle: "Da Hierarquia de Memória Secundária aos Limites Sublogarítmicos e Quase Constantes: O Panorama da Parte V (Capítulos 18 a 21)",
    intro:
      "A Parte V de 'Algoritmos: Teoria e Prática' (Capítulos 18 a 21, pp. 398–482) inaugura o estudo das Estruturas de Dados Avançadas. Enquanto a Parte III estabeleceu que árvores de busca binária balanceadas (como árvores vermelho-preto) e heaps binários resolvem operações de conjunto dinâmico em tempo O(lg n) no modelo RAM padrão, a Parte V mostra como romper ou especializar essa barreira em quatro frentes fundamentais: (1) minimizando transferências físicas de blocos de disco com Árvores B de alto fator de ramificação t (Capítulo 18); (2) postergando trabalho estrutural para alcançar tempo amortizado O(1) em INSERT, UNION e DECREASE-KEY com Heaps de Fibonacci (Capítulo 19); (3) explorando o universo inteiro finito {0, ..., u-1} via recorrência de raiz quadrada para atingir O(lg lg u) em Árvores de van Emde Boas (Capítulo 20); e (4) mantendo partições dinâmicas em tempo praticamente constante O(α(n)) por operação com Florestas de Conjuntos Disjuntos (Capítulo 21).",
    pillars: [
      {
        tag: "[ PILAR 01 • CAPÍTULO 18: MEMÓRIA SECUNDÁRIA E FATOR DE RAMIFICAÇÃO t ]",
        title: "Hierarquia de Memória Secundária vs. RAM e por que Árvores B Minimizam DISK-READ e DISK-WRITE",
        body: `
          <p>Na memória principal (RAM), o acesso a qualquer endereço eletrônico leva nanossegundos ($\\approx 10^{-8}\\text{ s}$). Já em discos magnéticos (ou blocos de armazenamento secundário), posicionar cabeçotes mecânicos (<em>seek time</em>) e aguardar a rotação do prato (<em>rotational latency</em>) leva milissegundos ($\\approx 10^{-2}\\text{ s}$) — uma penalidade de <strong>$100.000$ a $1.000.000$ de vezes mais lenta</strong> que uma instrução de CPU!</p>
          <ul>
            <li><strong>Transferência em páginas (blocos):</strong> Para amortizar a lentidão mecânica, o sistema de armazenamento lê e grava páginas inteiras de uma só vez (por exemplo, $4\\text{ KB}$ a $64\\text{ KB}$) por meio das primitivas <code>DISK-READ(x)</code> e <code>DISK-WRITE(x)</code>.</li>
            <li><strong>Por que uma árvore vermelho-preto é ineficiente em disco?</strong> Com fator de ramificação $2$, uma árvore binária balanceada com $n = 10^9$ chaves tem altura $\\lg(10^9) \\approx 30$, exigindo até $30$ acessos a disco por busca.</li>
            <li><strong>A solução da Árvore B (grau mínimo $t \\ge 2$):</strong> Dimensionamos cada nó da Árvore B para ocupar exatamente uma página inteira de disco, armazenando entre $t - 1$ e $2t - 1$ chaves e entre $t$ e $2t$ ponteiros para filhos. Se $t = 1.001$ (fator de ramificação de $1.001$ a $2.000$), uma árvore de altura $h = 2$ (raiz na RAM + 2 níveis em disco) já armazena mais de <strong>um bilhão de chaves</strong> ($1.001^3 - 1 > 10^9$) com no máximo <strong>$2$ acessos a disco</strong>! Em geral, o número de acessos a disco é $O(\\log_t n)$, enquanto o tempo de CPU é $O(t \\log_t n)$.</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 02 • CAPÍTULO 19: FILAS DE PRIORIDADES INTERCALÁVEIS E ANÁLISE AMORTIZADA ]",
        title: "Heaps Intercaláveis (Mergeable Heaps) e a Postergação da Consolidação em Heaps de Fibonacci",
        body: `
          <p>Um <strong>heap intercalável</strong> suporta cinco operações: <code>MAKE-HEAP()</code>, <code>INSERT(H, x)</code>, <code>MINIMUM(H)</code>, <code>EXTRACT-MIN(H)</code> e <code>UNION(H₁, H₂)</code>, além de <code>DECREASE-KEY(H, x, k)</code> e <code>DELETE(H, x)</code>. Em um heap binário de $n$ elementos, <code>UNION</code> custa $\\Theta(n)$ e <code>DECREASE-KEY</code> custa $\\Theta(\\lg n)$.</p>
          <ul>
            <li><strong>Filosofia preguiçosa (<em>lazy</em>) dos Heaps de Fibonacci:</strong> Em vez de manter uma única árvore rígida após cada inserção ou união, um Heap de Fibonacci mantém uma <strong>lista circular duplamente ligada de raízes</strong> de árvores com ordenação de heap mínimo, apontando sempre para a raiz mínima $H.\\text{min}$.</li>
            <li><strong>Operações em $O(1)$ amortizado:</strong> <code>FIB-HEAP-INSERT</code> apenas insere o novo nó na lista de raízes em $O(1)$ real; <code>FIB-HEAP-UNION</code> apenas concatena duas listas circulares em $O(1)$ real. Toda a tarefa de agrupar árvores de mesmo grau é <strong>postergada</strong> para <code>FIB-HEAP-EXTRACT-MIN</code> (via <code>CONSOLIDATE</code>).</li>
            <li><strong>A função potencial $\\Phi(H) = t(H) + 2m(H)$:</strong> Onde $t(H)$ é o número de árvores na lista de raízes e $m(H)$ é o número de nós marcados (que perderam $1$ filho). Quando <code>FIB-HEAP-DECREASE-KEY</code> viola a ordem de heap, ele corta o nó $x$ em $O(1)$ e aciona <code>CASCADING-CUT</code> no pai se este já tiver perdido um filho antes. O peso $2$ em $2m(H)$ paga exatamente $1$ unidade pelo próprio corte de um nó marcado e $1$ unidade pelo aumento de $t(H)$, cravando <code>DECREASE-KEY</code> em <strong>$O(1)$ amortizado</strong> — o que acelera diretamente os algoritmos de Dijkstra e Prim para $O(V \\lg V + E)$!</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 03 • CAPÍTULO 20: RECORRÊNCIA DE RAIZ QUADRADA EM ÁRVORES vEB ]",
        title: "Superando o Limite de Comparação O(lg n) via T(u) = T(√u) + O(1) = O(lg lg u)",
        body: `
          <p>Qualquer fila de prioridades baseada puramente em comparações de chaves precisa gastar $\\Omega(\\lg n)$ em pelo menos uma entre <code>INSERT</code> e <code>EXTRACT-MIN</code> (caso contrário, ordenaríamos $n$ elementos em $o(n \\lg n)$). Contudo, quando as chaves são inteiros sem duplicatas restritos a um universo finito $U = \\{0, 1, \\dots, u - 1\\}$ onde $u = 2^k$, podemos usar as próprias chaves como índices estruturais!</p>
          <ul>
            <li><strong>Divisão pela raiz quadrada do universo:</strong> Definimos $\\uuparrow\\!\\sqrt{u} = 2^{\\lceil k/2 \\rceil}$ (raiz superior) e $\\ddownarrow\\!\\sqrt{u} = 2^{\\lfloor k/2 \\rfloor}$ (raiz inferior). Toda chave $x \\in \\{0, \\dots, u - 1\\}$ é decomposta em seu número de agrupamento (<em>cluster</em>) $\\text{high}(x) = \\lfloor x / \\ddownarrow\\!\\sqrt{u} \\rfloor$ e sua posição interna $\\text{low}(x) = x \\bmod \\ddownarrow\\!\\sqrt{u}$, com reconstrução bijetora $x = \\text{index}(c, i) = c \\cdot \\ddownarrow\\!\\sqrt{u} + i$.</li>
            <li><strong>Por que 1 chamada recursiva muda tudo:</strong> Se uma operação faz <strong>duas</strong> chamadas recursivas de tamanho $\\sqrt{u}$ (como ocorre na estrutura preliminar <code>proto-vEB</code>), a recorrência $T(u) = 2T(\\sqrt{u}) + O(1)$ (com mudança de variável $m = \\lg u$) recai em $S(m) = 2S(m/2) + O(1) = \\Theta(m) = \\Theta(\\lg u)$.</li>
            <li><strong>O golpe de mestre de van Emde Boas:</strong> Ao armazenar explicitamente $V.\\text{min}$ e $V.\\text{max}$ em cada nó da árvore <code>vEB</code> e <strong>não armazenar $V.\\text{min}$ recursivamente dentro de nenhum cluster</strong>, verificamos em $O(1)$ se um cluster é vazio ou se uma inserção ocorre em árvore vazia, reduzindo todas as operações a <strong>no máximo uma única chamada recursiva</strong> de tamanho $\\sqrt{u}$:
              $$T(u) = T(\\sqrt{u}) + O(1) \\implies S(m) = S(m/2) + O(1) = \\mathbf{O(\\lg m) = O(\\lg \\lg u)}.$$
            </li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 04 • CAPÍTULO 21: CONJUNTOS DISJUNTOS E A INVERSA DE ACKERMANN α(n) ]",
        title: "Partições Dinâmicas (MAKE-SET, UNION, FIND-SET) e a Função α(n) ≤ 4",
        body: `
          <p>Muitas aplicações fundamentais — como manter as <strong>componentes conexas</strong> de um grafo dinâmico à medida que arestas são adicionadas ou executar o algoritmo de <strong>Kruskal</strong> para Árvore Geradora Mínima (Capítulo 23) — exigem manter uma coleção de conjuntos dinâmicos disjuntos $\\mathcal{S} = \\{S_1, S_2, \\dots, S_k\\}$, cada um identificado por um <strong>representante</strong> único.</p>
          <ul>
            <li><strong>Representação por listas ligadas com união ponderada (Seção 21.2):</strong> Cada elemento aponta para o cabeçalho da lista (<code>FIND-SET</code> em $O(1)$). Ao unir duas listas, anexamos sempre a lista menor ao final da maior: cada vez que o ponteiro de um elemento é atualizado, o conjunto resultante pelo menos dobra de tamanho, limitando $m$ operações (com $n$ <code>MAKE-SET</code>) a $O(m + n \\lg n)$.</li>
            <li><strong>Florestas de conjuntos disjuntos com duas heurísticas (Seções 21.3 e 21.4):</strong> Representamos cada conjunto como uma árvore enraizada onde cada nó $x$ aponta apenas para o pai $x.p$ (e a raiz aponta para si mesma: $x.p = x$). Combinando <strong>União por Posto</strong> (a raiz de menor <em>rank</em> passa a apontar para a raiz de maior <em>rank</em>) com <strong>Compressão de Caminho</strong> (durante <code>FIND-SET(x)</code>, todos os nós no caminho de busca passam a apontar diretamente para a raiz), Robert Endre Tarjan provou que $m$ operações levam tempo $O(m \\,\\alpha(n))$, onde $\\alpha(n)$ é a inversa da função de crescimento explosivo $A_k(j)$ (variante de Ackermann): para qualquer entrada fisicamente concebível no universo observável ($n \\le 10^{80}$), temos $\\alpha(n) \\le 4$, tornando o tempo amortizado por operação <strong>linear para todos os fins práticos</strong>!</li>
          </ul>
        `
      }
    ],
    checklist: [
      "Compreendo a diferença de ordens de grandeza entre acesso à RAM (nanossegundos) e acesso a disco magnético (milissegundos) e por que Árvores B usam grau mínimo t grande para manter a altura h ≤ log_t((n+1)/2) extremamente baixa.",
      "Sei enunciar as 5 propriedades de uma Árvore B (todas as folhas na mesma profundidade; nós não raiz com [t−1, 2t−1] chaves; raiz com [1, 2t−1] chaves) e entendo por que B-TREE-INSERT divide preventivamente todo nó cheio (2t−1 chaves) que encontra na descida.",
      "Compreendo a função potencial Φ(H) = t(H) + 2m(H) de um Heap de Fibonacci, o algoritmo CONSOLIDATE em FIB-HEAP-EXTRACT-MIN e como CASCADING-CUT garante custo amortizado O(1) em FIB-HEAP-DECREASE-KEY mantendo subárvores de grau k com pelo menos F_{k+2} ≥ φ^k nós.",
      "Sei calcular high(x), low(x) e index(x, y) em uma Árvore de van Emde Boas e explicar por que não armazenar u.min recursivamente nos clusters reduz a recorrência de T(u) = 2T(√u) + O(1) = Θ(lg u) para T(u) = T(√u) + O(1) = O(lg lg u).",
      "Domino os pseudocódigos de MAKE-SET, UNION, LINK e FIND-SET em florestas de conjuntos disjuntos com União por Posto e Compressão de Caminho, bem como a definição de A_k(j) e α(n) ≤ 4."
    ]
  };

  const unidades = [
    /* ======================================================================
       UNIDADE 10.1 — CAPÍTULO 18: ÁRVORES B
       ====================================================================== */
    {
      id: "u10-1",
      code: "UNIDADE 10.1 • CAPÍTULO 18 (SEÇÕES 18.1, 18.2 E 18.3)",
      pages: "pp. 398–418",
      title: "18.1, 18.2 e 18.3 Árvores B: Definição, Grau Mínimo t, Altura O(log_t n), Busca, Inserção (B-TREE-SPLIT-CHILD, B-TREE-INSERT) e Remoção",
      content: `
        <p>As <strong>Árvores B</strong> (<em>B-trees</em>), introduzidas por R. Bayer e E. McCreight (1972), são árvores de busca balanceadas projetadas especificamente para funcionar bem em <strong>discos magnéticos</strong> ou outros dispositivos de armazenamento secundário de acesso direto. São a estrutura de dados padrão dos sistemas gerenciadores de bancos de dados (SGBDs) e sistemas de arquivos modernos (frequentemente na variante <strong>Árvores $\\text{B}^+$</strong>, que armazena todos os dados satélites nas folhas).</p>

        <h3>1. O Modelo de Memória Secundária: <code>DISK-READ</code> e <code>DISK-WRITE</code></h3>
        <p>Como a memória principal (RAM, baseada em chips de silício) é cara e volátil, bancos de dados massivos residem em <strong>discos magnéticos</strong>. Um disco consiste em pratos revestidos por material magnetizável que giram a alta velocidade (ex.: $7.200\\text{ RPM}$, cerca de $8,33\\text{ ms}$ por rotação completa) sob cabeçotes presos a braços mecânicos que se movem radialmente entre cilindros/trilhas (tempo de busca mecânico de $3$ a $9\\text{ ms}$).</p>
        <p>Como o primeiro byte leva milissegundos para ser alcançado (cerca de $100.000\\times$ mais lento que a RAM), mas a transferência sequencial subsequente é rápida, o disco divide cada trilha em <strong>páginas</strong> de tamanho fixo (ex.: $2^{11}$ a $2^{16}$ bytes). Nos algoritmos de Árvore B, medimos a eficiência em duas dimensões independentes:</p>
        <ol>
          <li>O <strong>número de operações <code>DISK-READ(x)</code> e <code>DISK-WRITE(x)</code></strong> (que transfere uma página inteira entre o disco e a memória principal e domina o tempo total de execução);</li>
          <li>O <strong>tempo de CPU</strong> gasto examinando chaves na memória principal.</li>
        </ol>
        <p>Por convenção, a <strong>raiz $T.\\text{raiz}$ da Árvore B é mantida permanentemente na memória principal</strong>; porém, sempre que o nó raiz for modificado, precisamos emitir um <code>DISK-WRITE(T.raiz)</code>. Qualquer outro nó $x$ apontado por um ponteiro em disco deve ser lido via <code>DISK-READ(x)</code> antes que seus atributos sejam acessados, e gravado via <code>DISK-WRITE(x)</code> caso seus atributos sejam alterados.</p>

        <h3>2. Definição Formal de Árvore B (Seção 18.1, pp. 401–404)</h3>
        <p>Para simplificar a exposição, assumimos (como no livro) que qualquer "informação satélite" associada a uma chave reside no mesmo nó da chave (embora, na prática, use-se um ponteiro para a página de dados ou uma Árvore $\\text{B}^+$).</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ DEFINIÇÃO FORMAL • AS 5 PROPRIEDADES DE UMA ÁRVORE B (p. 402) ]</span>
          <p>Uma <strong>Árvore B</strong> $T$ é uma árvore enraizada (cuja raiz é $T.\\text{raiz}$) que possui as cinco propriedades a seguir:</p>
          <ol>
            <li><strong>Atributos de cada nó $x$:</strong>
              <ul>
                <li>$x.n$: o número de chaves atualmente armazenadas no nó $x$;</li>
                <li>As próprias $x.n$ chaves, $x.\\text{chave}_1, x.\\text{chave}_2, \\dots, x.\\text{chave}_{x.n}$, armazenadas em <strong>ordem não decrescente</strong>, de modo que $x.\\text{chave}_1 \\le x.\\text{chave}_2 \\le \\dots \\le x.\\text{chave}_{x.n}$;</li>
                <li>$x.\\text{folha}$: um valor booleano que é <code>TRUE</code> se $x$ é uma folha e <code>FALSE</code> se $x$ é um nó interno.</li>
              </ul>
            </li>
            <li><strong>Ponteiros para filhos:</strong> Cada nó interno $x$ contém também $x.n + 1$ ponteiros $x.c_1, x.c_2, \\dots, x.c_{x.n+1}$ para seus filhos. Os nós folhas não têm filhos e, portanto, seus atributos $c_i$ são indefinidos.</li>
            <li><strong>Propriedade de ordenação das chaves (separadores de intervalos):</strong> As chaves $x.\\text{chave}_i$ separam os intervalos de chaves armazenadas em cada subárvore: se $k_i$ é qualquer chave armazenada na subárvore com raiz em $x.c_i$, então:
              $$k_1 \\le x.\\text{chave}_1 \\le k_2 \\le x.\\text{chave}_2 \\le \\dots \\le x.\\text{chave}_{x.n} \\le k_{x.n+1}.$$
            </li>
            <li><strong>Profundidade uniforme das folhas:</strong> Todas as folhas têm a <strong>mesma profundidade</strong>, que é a altura $h$ da árvore.</li>
            <li><strong>Limites inferior e superior de chaves por nó (Grau Mínimo $t \\ge 2$):</strong> Existem limites fixos expressos em função de um inteiro fixo $t \\ge 2$ denominado <strong>grau mínimo</strong> da Árvore B:
              <ul>
                <li><strong>Limite inferior:</strong> Todo nó que não seja a raiz deve ter no mínimo $t - 1$ chaves. Portanto, todo nó interno que não seja a raiz tem pelo menos $t$ filhos. Se a árvore não é vazia, a raiz deve ter pelo menos $1$ chave (e pelo menos $2$ filhos se não for folha).</li>
                <li><strong>Limite superior:</strong> Todo nó pode conter no máximo $2t - 1$ chaves. Portanto, um nó interno pode ter no máximo $2t$ filhos. Dizemos que um nó está <strong>cheio</strong> (<em>full</em>) se ele contém exatamente $2t - 1$ chaves.</li>
              </ul>
            </li>
          </ol>
        </div>

        <p><strong>O caso mais simples ($t = 2$): Árvores 2-3-4.</strong> Quando $t = 2$, todo nó que não seja a raiz contém $1$, $2$ ou $3$ chaves e, consequentemente, todo nó interno possui $2$, $3$ ou $4$ filhos. Na literatura, uma Árvore B com grau mínimo $t = 2$ é conhecida como uma <strong>Árvore 2-3-4</strong>.</p>

        <h3>3. A Altura de uma Árvore B — Teorema 18.1 (pp. 403–404)</h3>
        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 18.1 • LIMITE SUPERIOR DA ALTURA DE UMA ÁRVORE B (p. 403) ]</span>
          <p>Se $n \\ge 1$, então para qualquer Árvore B $T$ de $n$ chaves com altura $h$ e grau mínimo $t \\ge 2$,</p>
          $$h \\le \\log_t \\frac{n + 1}{2}.$$
          <p><strong>Demonstração Completa:</strong> A raiz de $T$ contém no mínimo $1$ chave. Se $h \\ge 1$, a raiz tem pelo menos $2$ filhos (no nível/profundidade $1$). Cada um desses $2$ filhos é um nó não raiz, logo tem pelo menos $t$ filhos (totalizando pelo menos $2t$ nós na profundidade $2$), cada um dos quais tem pelo menos $t$ filhos (totalizando pelo menos $2t^2$ nós na profundidade $3$), e assim por diante, até a profundidade $h$, que contém pelo menos $2t^{h-1}$ nós. Além disso, todo nó exceto a raiz possui no mínimo $t - 1$ chaves. Somando o número mínimo de chaves em todos os níveis de $0$ a $h$:</p>
          $$n \\ge 1 + (t - 1) \\sum_{i=1}^{h} 2t^{i-1} = 1 + 2(t - 1)\\left(\\frac{t^h - 1}{t - 1}\\right) = 1 + 2(t^h - 1) = 2t^h - 1.$$
          <p>Isolando $t^h$, obtemos $2t^h \\le n + 1 \\iff t^h \\le \\frac{n+1}{2}$. Aplicando o logaritmo na base $t$ em ambos os lados, concluímos que $h \\le \\log_t \\frac{n+1}{2}$. $\\blacksquare$</p>
        </div>

        <h3>4. Operações Básicas: Busca, Criação e Inserção em Uma Única Descida (Seção 18.2, pp. 404–412)</h3>
        <h4>4.1 Pesquisando uma Árvore B (<code>B-TREE-SEARCH</code>)</h4>
        <p>A busca generaliza a busca binária em BST para uma decisão de $(x.n + 1)$ vias em cada nó $x$. Devolvemos um par ordenado $(y, i)$ consistindo no nó $y$ e no índice $i$ tal que $y.\\text{chave}_i = k$, ou <code>NIL</code> se $k$ não estiver na árvore:</p>
        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header"><span class="proc-name">B-TREE-SEARCH(x, k)</span></div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">i = 1</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">while</span> i ≤ x.n <span class="kw">and</span> k &gt; x.chave_i</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">    i = i + 1</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">if</span> i ≤ x.n <span class="kw">and</span> k == x.chave_i</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">return</span> (x, i)</span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">elseif</span> x.folha</span></div>
            <div class="code-line"><span class="line-num">7</span><span class="line-content">    <span class="kw">return</span> NIL</span></div>
            <div class="code-line"><span class="line-num">8</span><span class="line-content"><span class="kw">else</span> DISK-READ(x.c_i)</span></div>
            <div class="code-line"><span class="line-num">9</span><span class="line-content">    <span class="kw">return</span> B-TREE-SEARCH(x.c_i, k)</span></div>
          </div>
        </div>
        <p><strong>Complexidade:</strong> Como <code>B-TREE-SEARCH</code> visita no máximo um nó por nível ao longo de um caminho simples da raiz até uma folha, o número de páginas de disco acessadas é $\\Theta(h) = O(\\log_t n)$. Em cada nó, o laço <code>while</code> das linhas 2–3 leva tempo $O(t)$, resultando em tempo total de CPU $O(t h) = O(t \\log_t n)$.</p>

        <h4>4.2 Criando uma Árvore B Vazia (<code>B-TREE-CREATE</code>)</h4>
        <p>Usando <code>ALLOCATE-NODE()</code> (que aloca uma página de disco em $O(1)$ sem precisar de <code>DISK-READ</code>):</p>
        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header"><span class="proc-name">B-TREE-CREATE(T)</span></div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">x = ALLOCATE-NODE()</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">x.folha = TRUE</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">x.n = 0</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">DISK-WRITE(x)</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content">T.raiz = x</span></div>
          </div>
        </div>

        <h4>4.3 Dividindo um Nó Filho Cheio: <code>B-TREE-SPLIT-CHILD(x, i)</code></h4>
        <p>Sempre inserimos uma nova chave em uma <strong>folha</strong>. Porém, se a folha estiver cheia ($2t - 1$ chaves), não podemos inserir diretamente sem violar a Propriedade 5. A operação fundamental de reestruturação é a <strong>divisão (<em>split</em>)</strong>: um nó cheio $y = x.c_i$ com $2t - 1$ chaves é dividido em torno de sua <strong>chave mediana $y.\\text{chave}_t$</strong>:</p>
        <ul>
          <li>As $t - 1$ primeiras chaves ($y.\\text{chave}_1, \\dots, y.\\text{chave}_{t-1}$) permanecem em $y$;</li>
          <li>As $t - 1$ últimas chaves ($y.\\text{chave}_{t+1}, \\dots, y.\\text{chave}_{2t-1}$) são movidas para um recém-alocado nó irmão à direita $z$;</li>
          <li>A chave mediana $y.\\text{chave}_t$ <strong>sobe para o pai $x$</strong> (que é suposto não cheio antes da chamada), separando os ponteiros para $y$ e $z$.</li>
        </ul>
        <p><strong>O truque da descida única preventiva:</strong> Em vez de descer até a folha e depois precisar subir de volta propagando divisões (o que exigiria reler nós do disco ou manter todo o caminho na RAM), dividimos <strong>preventivamente</strong> qualquer nó cheio ($2t - 1$ chaves) que encontramos enquanto descemos pela árvore! Isso garante um invariante poderoso: <em>toda vez que precisamos dividir um filho cheio $y$, temos certeza absoluta de que seu pai $x$ não está cheio!</em></p>
        <p><strong>A única maneira de uma Árvore B crescer em altura:</strong> Se a própria raiz $r = T.\\text{raiz}$ estiver cheia ($2t - 1$ chaves), criamos uma nova raiz $s$ (inicialmente com $0$ chaves), fazemos $r$ ser o único filho de $s$ ($s.c_1 = r$) e chamamos <code>B-TREE-SPLIT-CHILD(s, 1)</code>. Ao contrário das árvores binárias de busca (que crescem nas folhas), <strong>uma Árvore B aumenta de altura exclusivamente no topo (na raiz)!</strong></p>

        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header"><span class="proc-name">B-TREE-SPLIT-CHILD(x, i)</span></div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">z = ALLOCATE-NODE()</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">y = x.c_i</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">z.folha = y.folha</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">z.n = t - 1</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">for</span> j = 1 <span class="kw">to</span> t - 1</span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content">    z.chave_j = y.chave_{j+t}</span></div>
            <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">if</span> <span class="kw">not</span> y.folha</span></div>
            <div class="code-line"><span class="line-num">8</span><span class="line-content">    <span class="kw">for</span> j = 1 <span class="kw">to</span> t</span></div>
            <div class="code-line"><span class="line-num">9</span><span class="line-content">        z.c_j = y.c_{j+t}</span></div>
            <div class="code-line"><span class="line-num">10</span><span class="line-content">y.n = t - 1</span></div>
            <div class="code-line"><span class="line-num">11</span><span class="line-content"><span class="kw">for</span> j = x.n + 1 <span class="kw">downto</span> i + 1</span></div>
            <div class="code-line"><span class="line-num">12</span><span class="line-content">    x.c_{j+1} = x.c_j</span></div>
            <div class="code-line"><span class="line-num">13</span><span class="line-content">x.c_{i+1} = z</span></div>
            <div class="code-line"><span class="line-num">14</span><span class="line-content"><span class="kw">for</span> j = x.n <span class="kw">downto</span> i</span></div>
            <div class="code-line"><span class="line-num">15</span><span class="line-content">    x.chave_{j+1} = x.chave_j</span></div>
            <div class="code-line"><span class="line-num">16</span><span class="line-content">x.chave_i = y.chave_t</span></div>
            <div class="code-line"><span class="line-num">17</span><span class="line-content">x.n = x.n + 1</span></div>
            <div class="code-line"><span class="line-num">18</span><span class="line-content">DISK-WRITE(y)</span></div>
            <div class="code-line"><span class="line-num">19</span><span class="line-content">DISK-WRITE(z)</span></div>
            <div class="code-line"><span class="line-num">20</span><span class="line-content">DISK-WRITE(x)</span></div>
          </div>
        </div>
        <p><strong>Custo de <code>B-TREE-SPLIT-CHILD</code>:</strong> Tempo de CPU $\\Theta(t)$ (pelos laços que copiam $t-1$ chaves e $t$ ponteiros) e $O(1)$ operações de disco (exatamente $3$ chamadas <code>DISK-WRITE</code> nas linhas 18–20).</p>

        <h4>4.4 Inserindo uma Chave: <code>B-TREE-INSERT</code> e <code>B-TREE-INSERT-NONFULL</code></h4>
        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header"><span class="proc-name">B-TREE-INSERT(T, k)</span></div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">r = T.raiz</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">if</span> r.n == 2t - 1</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">    s = ALLOCATE-NODE()</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">    T.raiz = s</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content">    s.folha = FALSE</span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content">    s.n = 0</span></div>
            <div class="code-line"><span class="line-num">7</span><span class="line-content">    s.c_1 = r</span></div>
            <div class="code-line"><span class="line-num">8</span><span class="line-content">    B-TREE-SPLIT-CHILD(s, 1)</span></div>
            <div class="code-line"><span class="line-num">9</span><span class="line-content">    B-TREE-INSERT-NONFULL(s, k)</span></div>
            <div class="code-line"><span class="line-num">10</span><span class="line-content"><span class="kw">else</span> B-TREE-INSERT-NONFULL(r, k)</span></div>
          </div>
        </div>

        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header"><span class="proc-name">B-TREE-INSERT-NONFULL(x, k)</span></div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">i = x.n</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">if</span> x.folha</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">    <span class="kw">while</span> i ≥ 1 <span class="kw">and</span> k &lt; x.chave_i</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">        x.chave_{i+1} = x.chave_i</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content">        i = i - 1</span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content">    x.chave_{i+1} = k</span></div>
            <div class="code-line"><span class="line-num">7</span><span class="line-content">    x.n = x.n + 1</span></div>
            <div class="code-line"><span class="line-num">8</span><span class="line-content">    DISK-WRITE(x)</span></div>
            <div class="code-line"><span class="line-num">9</span><span class="line-content"><span class="kw">else</span> <span class="kw">while</span> i ≥ 1 <span class="kw">and</span> k &lt; x.chave_i</span></div>
            <div class="code-line"><span class="line-num">10</span><span class="line-content">        i = i - 1</span></div>
            <div class="code-line"><span class="line-num">11</span><span class="line-content">    i = i + 1</span></div>
            <div class="code-line"><span class="line-num">12</span><span class="line-content">    DISK-READ(x.c_i)</span></div>
            <div class="code-line"><span class="line-num">13</span><span class="line-content">    <span class="kw">if</span> x.c_i.n == 2t - 1</span></div>
            <div class="code-line"><span class="line-num">14</span><span class="line-content">        B-TREE-SPLIT-CHILD(x, i)</span></div>
            <div class="code-line"><span class="line-num">15</span><span class="line-content">        <span class="kw">if</span> k &gt; x.chave_i</span></div>
            <div class="code-line"><span class="line-num">16</span><span class="line-content">            i = i + 1</span></div>
            <div class="code-line"><span class="line-num">17</span><span class="line-content">    B-TREE-INSERT-NONFULL(x.c_i, k)</span></div>
          </div>
        </div>
        <p>Observe as linhas 13–16 de <code>B-TREE-INSERT-NONFULL</code>: após ler $x.c_i$, se ele estiver cheio ($2t - 1$ chaves), chamamos <code>B-TREE-SPLIT-CHILD(x, i)</code>, que sobe a mediana para $x.\\text{chave}_i$ e divide o filho em $x.c_i$ e $x.c_{i+1}$. A linha 15 verifica então se $k > x.\\text{chave}_i$ para decidir em qual das duas metades (agora com apenas $t - 1$ chaves) a recursão deve descer! Em qualquer momento, há apenas $O(1)$ páginas de disco na memória principal, com total de $O(h) = O(\\log_t n)$ acessos a disco e $O(t h) = O(t \\log_t n)$ tempo de CPU.</p>

        <h3>5. Eliminando uma Chave de uma Árvore B: Os Casos 1, 2 (2a, 2b, 2c) e 3 (3a, 3b) (Seção 18.3, pp. 412–416)</h3>
        <p>Na remoção <code>B-TREE-DELETE(x, k)</code>, precisamos impedir que um nó fique com menos de $t - 1$ chaves ao removermos uma chave de sua subárvore. Assim como na inserção, o algoritmo é projetado em <strong>uma única descida</strong> mantendo o seguinte invariante: <em>sempre que <code>B-TREE-DELETE</code> é chamado recursivamente sobre um nó $x$ (que não seja a raiz), o número de chaves em $x$ é pelo menos o grau mínimo $t$</em> (uma chave a mais que o mínimo exigido $t - 1$!). Os <strong>três casos exatos</strong> são:</p>

        <div class="canonical-callout">
          <span class="callout-tag">[ OS 3 CASOS CANÔNICOS DE B-TREE-DELETE(x, k) (pp. 413–415) ]</span>
          <ul>
            <li><strong>CASO 1 ($k$ está no nó $x$ e $x$ é uma folha):</strong> Simplesmente elimine a chave $k$ de $x$ (como $x$ tem pelo menos $t$ chaves pelo invariante de descida — ou é a própria raiz —, restam pelo menos $t - 1$ chaves).</li>
            <li><strong>CASO 2 ($k$ está no nó $x$ e $x$ é um nó interno):</strong> Seja $k = x.\\text{chave}_i$. Examinamos os filhos que precedem e sucedem $k$ em $x$:
              <ul>
                <li><strong>Caso 2a (O filho $y = x.c_i$ que precede $k$ tem pelo menos $t$ chaves):</strong> Encontre o predecessor $k'$ de $k$ na subárvore enraizada em $y$ (descendo pelos filhos mais à direita de $y$). Elimine $k'$ recursivamente e substitua $k$ por $k'$ em $x$.</li>
                <li><strong>Caso 2b (Simétrico: $y = x.c_i$ tem $t - 1$ chaves, mas o filho $z = x.c_{i+1}$ que sucede $k$ tem pelo menos $t$ chaves):</strong> Encontre o sucessor $k'$ de $k$ na subárvore enraizada em $z$ (descendo pelos filhos mais à esquerda de $z$). Elimine $k'$ recursivamente e substitua $k$ por $k'$ em $x$.</li>
                <li><strong>Caso 2c (Tanto $y = x.c_i$ quanto $z = x.c_{i+1}$ têm apenas $t - 1$ chaves):</strong> <strong>Intercale (<em>merge</em>)</strong> $k$ e todo o conteúdo de $z$ dentro de $y$, de modo que $x$ perca tanto $k$ quanto o ponteiro para $z$, e $y$ passe a conter $(t - 1) + 1 + (t - 1) = 2t - 1$ chaves (e $2t$ filhos, se não for folha). Libere $z$ e chame recursivamente <code>B-TREE-DELETE(y, k)</code>.</li>
              </ul>
            </li>
            <li><strong>CASO 3 ($k$ não está no nó interno $x$):</strong> Determine a raiz $x.c_i$ da subárvore apropriada que deve conter $k$. Se $x.c_i$ tem apenas $t - 1$ chaves, execute o passo <strong>3a</strong> ou <strong>3b</strong> abaixo para garantir que desçamos para um nó com pelo menos $t$ chaves:
              <ul>
                <li><strong>Caso 3a (Rotação/Empréstimo de irmão imediato):</strong> Se $x.c_i$ tem apenas $t - 1$ chaves, mas possui um irmão imediato (esquerdo $x.c_{i-1}$ ou direito $x.c_{i+1}$) com pelo menos $t$ chaves, dê a $x.c_i$ uma chave extra descendo a chave separadora de $x$ para $x.c_i$, subindo uma chave do irmão rico para $x$ e movendo o ponteiro de filho correspondente do irmão para $x.c_i$.</li>
                <li><strong>Caso 3b (Fusão/Intercalação com irmão):</strong> Se $x.c_i$ e ambos os seus irmãos imediatos têm apenas $t - 1$ chaves, <strong>intercale</strong> $x.c_i$ com um irmão (esquerdo ou direito), movendo a chave separadora de $x$ para o meio do novo nó intercalado (que passa a ter $2t - 1$ chaves). (Se $x$ era a raiz e ficou com $0$ chaves após essa fusão, o nó intercalado torna-se a nova raiz e a altura da Árvore B diminui em $1$!).</li>
              </ul>
            </li>
          </ul>
        </div>
        <p><strong>Complexidade de <code>B-TREE-DELETE</code>:</strong> Como a maioria das chaves reside nas folhas, quase todas as remoções terminam no Caso 1. Mesmo quando ocorre o Caso 2a/2b, é possível encontrar $k'$ e removê-lo em uma única passagem descendente sem precisar reescrever ancestral algum além do necessário. O total de operações de disco é $O(h) = O(\\log_t n)$ e o tempo de CPU é $O(t h) = O(t \\log_t n)$.</p>

        <div id="workbench-mod10-mount"></div>
      `
    },

    /* ======================================================================
       UNIDADE 10.2 — CAPÍTULO 19 (SEÇÕES 19.1, 19.2 E 19.3): HEAPS DE FIBONACCI
       ====================================================================== */
    {
      id: "u10-2",
      code: "UNIDADE 10.2 • CAPÍTULO 19 (SEÇÕES 19.1, 19.2 E 19.3)",
      pages: "pp. 419–433",
      title: "19.1, 19.2 e 19.3 Heaps de Fibonacci: Estrutura, Potencial Φ(H) = t(H) + 2m(H) e Operações de Heap Intercalável (FIB-HEAP-INSERT, FIB-HEAP-UNION, FIB-HEAP-EXTRACT-MIN e CONSOLIDATE)",
      content: `
        <p>Introduzidos por Michael L. Fredman e Robert E. Tarjan (1987), os <strong>Heaps de Fibonacci</strong> são uma estrutura de dados de <strong>heaps intercaláveis</strong> (<em>mergeable heaps</em>) que alcançam limites de tempo amortizados assintoticamente ótimos: $O(1)$ para <code>MAKE-HEAP</code>, <code>INSERT</code>, <code>MINIMUM</code>, <code>UNION</code> e <code>DECREASE-KEY</code>, e $O(\\lg n)$ para <code>EXTRACT-MIN</code> e <code>DELETE</code>.</p>

        <h3>1. Comparação Canônica: Heaps Binários vs. Heaps de Fibonacci (Figura 19.1, p. 420)</h3>
        <div class="canonical-table-wrap">
          <table class="canonical-table">
            <thead>
              <tr>
                <th>Procedimento</th>
                <th>Heap Binário (Pior Caso)</th>
                <th>Heap de Fibonacci (Amortizado)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>MAKE-HEAP</code></td>
                <td>$\\Theta(1)$</td>
                <td>$\\Theta(1)$</td>
              </tr>
              <tr>
                <td><code>INSERT</code></td>
                <td>$\\Theta(\\lg n)$</td>
                <td>$\\Theta(1)$</td>
              </tr>
              <tr>
                <td><code>MINIMUM</code></td>
                <td>$\\Theta(1)$</td>
                <td>$\\Theta(1)$</td>
              </tr>
              <tr>
                <td><code>EXTRACT-MIN</code></td>
                <td>$\\Theta(\\lg n)$</td>
                <td>$O(\\lg n)$</td>
              </tr>
              <tr>
                <td><code>UNION</code></td>
                <td>$\\Theta(n)$</td>
                <td>$\\Theta(1)$</td>
              </tr>
              <tr>
                <td><code>DECREASE-KEY</code></td>
                <td>$\\Theta(\\lg n)$</td>
                <td>$\\Theta(1)$</td>
              </tr>
              <tr>
                <td><code>DELETE</code></td>
                <td>$\\Theta(\\lg n)$</td>
                <td>$O(\\lg n)$</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p><strong>Impacto prático e teórico:</strong> Em algoritmos de grafos como a Árvore Geradora Mínima de Prim (Capítulo 23) e Caminhos Mínimos de Origem Única de Dijkstra (Capítulo 24), realizamos $|V|$ chamadas a <code>EXTRACT-MIN</code> e até $|E|$ chamadas a <code>DECREASE-KEY</code>. Em grafos densos onde $|E| = \\Theta(|V|^2)$, substituir um heap binário por um heap de Fibonacci reduz o tempo total de $O(E \\lg V)$ para <strong>$O(V \\lg V + E)$</strong>!</p>

        <h3>2. Estrutura de um Heap de Fibonacci e Função Potencial $\\Phi(H)$ (Seção 19.1, pp. 421–424)</h3>
        <p>Um <strong>Heap de Fibonacci</strong> $H$ é uma coleção de <strong>árvores enraizadas</strong> que obedecem à <strong>propriedade de heap mínimo</strong>: a chave de um nó é sempre maior ou igual à chave de seu pai ($x.\\text{chave} \\ge x.p.\\text{chave}$).</p>
        <ul>
          <li><strong>Atributos de cada nó $x$:</strong>
            <ul>
              <li>$x.p$: ponteiro para o pai de $x$ (<code>NIL</code> se $x$ é raiz);</li>
              <li>$x.\\text{filho}$: ponteiro para qualquer um de seus filhos (<code>NIL</code> se $x$ não tem filhos);</li>
              <li>$x.\\text{esquerda}$ e $x.\\text{direita}$: ponteiros para os irmãos esquerdo e direito de $x$ em uma <strong>lista circular duplamente ligada</strong> de filhos (se $x$ é filho único, $x.\\text{esquerda} = x.\\text{direita} = x$);</li>
              <li>$x.\\text{grau}$: o número de filhos na lista de filhos de $x$;</li>
              <li>$x.\\text{marca}$ (<em>mark</em>): atributo booleano que indica se o nó $x$ <strong>perdeu um filho desde a última vez em que $x$ se tornou filho de outro nó</strong>. Nós recém-criados estão desmarcados, e um nó $x$ é desmarcado ($x.\\text{marca} = \\text{FALSE}$) sempre que se torna filho de outro nó.</li>
            </ul>
          </li>
          <li><strong>Atributos do heap $H$:</strong>
            <ul>
              <li>$H.\\text{min}$: ponteiro para a raiz da árvore que contém a chave mínima (denominado <em>nó mínimo</em> do heap; se $H$ está vazio, $H.\\text{min} = \\text{NIL}$);</li>
              <li>$H.n$: número total de nós atualmente em $H$;</li>
              <li>As raízes de todas as árvores em $H$ são ligadas por seus ponteiros <code>esquerda</code> e <code>direita</code> formando a <strong>lista de raízes</strong> (circular duplamente ligada). Isso permite inserir um nó, remover um nó ou concatenar duas listas circulares em tempo $O(1)$!</li>
            </ul>
          </li>
        </ul>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ FUNÇÃO POTENCIAL DE UM HEAP DE FIBONACCI • Φ(H) = t(H) + 2m(H) (p. 423) ]</span>
          <p>Para analisar o desempenho amortizado pelo <strong>método do potencial</strong> (Capítulo 17), definimos para cada heap de Fibonacci $H$:</p>
          <ul>
            <li>$t(H)$: o número de árvores na lista de raízes de $H$;</li>
            <li>$m(H)$: o número de nós marcados em $H$;</li>
            <li>$D(n)$: o limite superior do grau máximo ($x.\\text{grau}$) de qualquer nó em um heap de Fibonacci de $n$ nós (na Unidade 10.3 provaremos que $D(n) \\le \\lfloor \\log_\\phi n \\rfloor = O(\\lg n)$).</li>
          </ul>
          <p>O potencial do heap de Fibonacci $H$ é:</p>
          $$\\Phi(H) = t(H) + 2\\,m(H).$$
          <p>Um heap vazio começa com $t(H) = 0$ e $m(H) = 0$, logo $\\Phi(H) = 0$. Além disso, $\\Phi(H) \\ge 0$ em todos os instantes subsequentes, de modo que a soma dos custos amortizados limita superiormente a soma dos custos reais!</p>
        </div>

        <h3>3. Operações de Heaps Intercaláveis (Seção 19.2, pp. 424–433)</h3>
        <h4>3.1 Criando um Novo Heap e Inserindo um Nó ($O(1)$ real e amortizado)</h4>
        <p>Para <code>MAKE-FIB-HEAP()</code>, alocamos e retornamos $H$ com $H.n = 0$ e $H.\\text{min} = \\text{NIL}$, com custo real e amortizado $\\Theta(1)$. Para inserir o nó $x$ (cuja chave $x.\\text{chave}$ já foi atribuída):</p>
        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header"><span class="proc-name">FIB-HEAP-INSERT(H, x)</span></div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">x.grau = 0</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">x.p = NIL</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">x.filho = NIL</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">x.marca = FALSE</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">if</span> H.min == NIL</span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content">    crie uma lista de raízes para H contendo apenas x</span></div>
            <div class="code-line"><span class="line-num">7</span><span class="line-content">    H.min = x</span></div>
            <div class="code-line"><span class="line-num">8</span><span class="line-content"><span class="kw">else</span> insira x na lista de raízes de H</span></div>
            <div class="code-line"><span class="line-num">9</span><span class="line-content">    <span class="kw">if</span> x.chave &lt; H.min.chave</span></div>
            <div class="code-line"><span class="line-num">10</span><span class="line-content">        H.min = x</span></div>
            <div class="code-line"><span class="line-num">11</span><span class="line-content">H.n = H.n + 1</span></div>
          </div>
        </div>
        <p><strong>Análise Amortizada de <code>FIB-HEAP-INSERT</code>:</strong> Custo real $c_i = O(1)$. Como uma nova árvore de $1$ nó desmarcado foi adicionada à lista de raízes, $t(H') = t(H) + 1$ e $m(H') = m(H)$. Logo, $\\Delta \\Phi = 1 + 2(0) = 1$, e o custo amortizado é $\\hat{c}_i = O(1) + 1 = O(1)$.</p>

        <h4>3.2 Encontrando o Mínimo e Unindo Dois Heaps de Fibonacci ($O(1)$)</h4>
        <p>Encontrar o nó mínimo basta retornar $H.\\text{min}$ em $\\Theta(1)$ (com $\\Delta \\Phi = 0$). Para unir $H_1$ e $H_2$ destruindo ambos:</p>
        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header"><span class="proc-name">FIB-HEAP-UNION(H₁, H₂)</span></div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">H = MAKE-FIB-HEAP()</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">H.min = H₁.min</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">concatene a lista de raízes de H₂ com a lista de raízes de H</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">if</span> (H₁.min == NIL) <span class="kw">or</span> (H₂.min ≠ NIL <span class="kw">and</span> H₂.min.chave &lt; H₁.min.chave)</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content">    H.min = H₂.min</span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content">H.n = H₁.n + H₂.n</span></div>
            <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">return</span> H</span></div>
          </div>
        </div>
        <p><strong>Análise Amortizada de <code>FIB-HEAP-UNION</code>:</strong> Como $t(H) = t(H_1) + t(H_2)$ e $m(H) = m(H_1) + m(H_2)$, a variação de potencial é $\\Delta \\Phi = \\Phi(H) - (\\Phi(H_1) + \\Phi(H_2)) = 0$. Portanto, o custo amortizado é igual ao custo real $O(1)$!</p>

        <h4>3.3 Extraindo o Nó Mínimo e Consolidando a Lista de Raízes ($O(\\lg n)$ amortizado)</h4>
        <p>A operação <code>FIB-HEAP-EXTRACT-MIN(H)</code> é onde o trabalho "postergado" finalmente acontece. Primeiro, removemos $z = H.\\text{min}$, promovemos cada um dos $z.\\text{grau}$ filhos de $z$ para a lista de raízes (definindo $x.p = \\text{NIL}$) e então chamamos <code>CONSOLIDATE(H)</code> para reduzir o número de árvores na lista de raízes, garantindo que, ao final, <strong>cada raiz na lista de raízes tenha um valor de <code>grau</code> distinto</strong> (logo, restam no máximo $D(H.n) + 1$ raízes):</p>

        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header"><span class="proc-name">FIB-HEAP-EXTRACT-MIN(H)</span></div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">z = H.min</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">if</span> z ≠ NIL</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">    <span class="kw">for</span> cada filho x de z</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">        adicione x à lista de raízes de H</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content">        x.p = NIL</span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content">    remova z da lista de raízes de H</span></div>
            <div class="code-line"><span class="line-num">7</span><span class="line-content">    <span class="kw">if</span> z == z.direita</span></div>
            <div class="code-line"><span class="line-num">8</span><span class="line-content">        H.min = NIL</span></div>
            <div class="code-line"><span class="line-num">9</span><span class="line-content">    <span class="kw">else</span> H.min = z.direita</span></div>
            <div class="code-line"><span class="line-num">10</span><span class="line-content">        CONSOLIDATE(H)</span></div>
            <div class="code-line"><span class="line-num">11</span><span class="line-content">    H.n = H.n - 1</span></div>
            <div class="code-line"><span class="line-num">12</span><span class="line-content"><span class="kw">return</span> z</span></div>
          </div>
        </div>

        <p>O procedimento <code>CONSOLIDATE(H)</code> utiliza um arranjo auxiliar de ponteiros $A[0 \\dots D(H.n)]$ onde $A[i] = y$ se $y$ é atualmente uma raiz com $y.\\text{grau} = i$. Sempre que encontramos duas raízes $x$ e $y$ de mesmo grau $d$ (com $x.\\text{chave} \\le y.\\text{chave}$), chamamos <code>FIB-HEAP-LINK(H, y, x)</code> para remover $y$ da lista de raízes e torná-lo filho de $x$, incrementando $x.\\text{grau}$ para $d + 1$ e desmarcando $y$ ($y.\\text{marca} = \\text{FALSE}$):</p>

        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header"><span class="proc-name">CONSOLIDATE(H)</span> &amp; <span class="proc-name">FIB-HEAP-LINK(H, y, x)</span></div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">seja A[0 .. D(H.n)] um novo arranjo</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">for</span> i = 0 <span class="kw">to</span> D(H.n)</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">    A[i] = NIL</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">for</span> cada nó w na lista de raízes de H</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content">    x = w</span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content">    d = x.grau</span></div>
            <div class="code-line"><span class="line-num">7</span><span class="line-content">    <span class="kw">while</span> A[d] ≠ NIL</span></div>
            <div class="code-line"><span class="line-num">8</span><span class="line-content">        y = A[d] <span class="cmt">// outra árvore com o mesmo grau de x</span></span></div>
            <div class="code-line"><span class="line-num">9</span><span class="line-content">        <span class="kw">if</span> x.chave &gt; y.chave</span></div>
            <div class="code-line"><span class="line-num">10</span><span class="line-content">            troque x com y</span></div>
            <div class="code-line"><span class="line-num">11</span><span class="line-content">        FIB-HEAP-LINK(H, y, x)</span></div>
            <div class="code-line"><span class="line-num">12</span><span class="line-content">        A[d] = NIL</span></div>
            <div class="code-line"><span class="line-num">13</span><span class="line-content">        d = d + 1</span></div>
            <div class="code-line"><span class="line-num">14</span><span class="line-content">    A[d] = x</span></div>
            <div class="code-line"><span class="line-num">15</span><span class="line-content">H.min = NIL</span></div>
            <div class="code-line"><span class="line-num">16</span><span class="line-content"><span class="kw">for</span> i = 0 <span class="kw">to</span> D(H.n)</span></div>
            <div class="code-line"><span class="line-num">17</span><span class="line-content">    <span class="kw">if</span> A[i] ≠ NIL</span></div>
            <div class="code-line"><span class="line-num">18</span><span class="line-content">        <span class="kw">if</span> H.min == NIL</span></div>
            <div class="code-line"><span class="line-num">19</span><span class="line-content">            crie uma lista de raízes para H contendo apenas A[i]</span></div>
            <div class="code-line"><span class="line-num">20</span><span class="line-content">            H.min = A[i]</span></div>
            <div class="code-line"><span class="line-num">21</span><span class="line-content">        <span class="kw">else</span> insira A[i] na lista de raízes de H</span></div>
            <div class="code-line"><span class="line-num">22</span><span class="line-content">            <span class="kw">if</span> A[i].chave &lt; H.min.chave</span></div>
            <div class="code-line"><span class="line-num">23</span><span class="line-content">                H.min = A[i]</span></div>
            <div class="code-line"><span class="line-num">—</span><span class="line-content"><span class="cmt">// Procedimento auxiliar FIB-HEAP-LINK(H, y, x):</span></span></div>
            <div class="code-line"><span class="line-num">1</span><span class="line-content">remova y da lista de raízes de H</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">faça y um filho de x, incrementando x.grau</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">y.marca = FALSE</span></div>
          </div>
        </div>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ ANÁLISE AMORTIZADA COMPLETA DE FIB-HEAP-EXTRACT-MIN (pp. 431–433) ]</span>
          <p>Seja $H$ um heap de Fibonacci de $n$ nós antes de <code>FIB-HEAP-EXTRACT-MIN</code>:</p>
          <ol>
            <li><strong>Custo Real $O(D(n) + t(H))$:</strong> A raiz mínima $z$ possui no máximo $D(n)$ filhos, de modo que adicioná-los à lista de raízes leva $O(D(n))$ e o tamanho da lista de raízes antes de <code>CONSOLIDATE</code> torna-se no máximo $D(n) + t(H) - 1$. Cada vez que o laço <code>while</code> de <code>CONSOLIDATE</code> (linhas 7–13) executa, uma raiz é ligada a outra via <code>FIB-HEAP-LINK</code>, reduzindo o número de raízes em $1$. Portanto, o trabalho total de todos os laços em <code>CONSOLIDATE</code> é no máximo $O(D(n) + t(H))$.</li>
            <li><strong>Variação de Potencial:</strong> O potencial antes de extrair o mínimo é $t(H) + 2m(H)$. Após <code>CONSOLIDATE</code>, há no máximo $D(n) + 1$ árvores na lista de raízes (pois cada grau em $0 \\dots D(n)$ aparece no máximo uma vez) e nenhum nó novo foi marcado ($m(H') \\le m(H)$). Portanto, o potencial após a operação é no máximo $(D(n) + 1) + 2m(H)$.</li>
            <li><strong>Custo Amortizado:</strong> Escalonando a unidade de potencial para dominar a constante oculta em $O(t(H))$:
              $$\\hat{c} = O(D(n) + t(H)) + \\Big((D(n) + 1 + 2m(H)) - (t(H) + 2m(H))\\Big) = O(D(n)) + O(t(H)) - t(H) = \\mathbf{O(D(n)) = O(\\lg n)}.$$
              Cada árvore presente na lista de raízes já tinha <strong>$1$ unidade de potencial pré-paga</strong> durante seu <code>INSERT</code> ou corte anterior, pagando integralmente por sua consolidação!
            </li>
          </ol>
        </div>
      `
    },

    /* ======================================================================
       UNIDADE 10.3 — CAPÍTULO 19 (SEÇÕES 19.4 E 19.5): DECREASE-KEY, CASCADING-CUT E LIMITE D(n)
       ====================================================================== */
    {
      id: "u10-3",
      code: "UNIDADE 10.3 • CAPÍTULO 19 (SEÇÕES 19.4 E 19.5)",
      pages: "pp. 433–442",
      title: "19.4 e 19.5 Decremento de uma Chave (FIB-HEAP-DECREASE-KEY), Corte em Cascata (CUT e CASCADING-CUT), Exclusão e Limite do Grau Máximo D(n) ≤ ⌊log_φ n⌋",
      content: `
        <p>A genialidade estrutural dos Heaps de Fibonacci reside em como implementamos <code>FIB-HEAP-DECREASE-KEY(H, x, k)</code> em tempo amortizado $O(1)$ sem permitir que as árvores fiquem arbitrariamente ralas (o que destruiria o limite logarítmico $D(n) = O(\\lg n)$ de <code>EXTRACT-MIN</code>).</p>

        <h3>1. Decremento de Chave e Corte em Cascata: <code>CUT</code> e <code>CASCADING-CUT</code> (Seção 19.3, pp. 433–437)</h3>
        <p>Quando reduzimos $x.\\text{chave}$ para um novo valor $k \\le x.\\text{chave}$, se $x$ é raiz ou se $k \\ge y.\\text{chave}$ (onde $y = x.p$), a propriedade de heap mínimo permanece intacta! Caso contrário ($k < y.\\text{chave}$), executamos duas ações:</p>
        <ol>
          <li><strong><code>CUT(H, x, y)</code>:</strong> "Cortamos" a ligação entre $x$ e seu pai $y$, removendo $x$ da lista de filhos de $y$, decrementando $y.\\text{grau}$, adicionando $x$ à lista de raízes de $H$ (com $x.p = \\text{NIL}$) e desmarcando $x$ ($x.\\text{marca} = \\text{FALSE}$).</li>
          <li><strong><code>CASCADING-CUT(H, y)</code>:</strong> Para que árvores de alto grau continuem exponencialmente densas em número de nós, impomos a <strong>regra dos dois filhos perdidos</strong>: assim que um nó não raiz $y$ perde seu <strong>segundo</strong> filho após ter se tornado filho de outro nó, nós também cortamos $y$ de seu pai $y.p$! O atributo booleano $y.\\text{marca}$ registra essa história:
            <ul>
              <li>Se $y.\\text{marca} == \\text{FALSE}$ (perdeu seu 1º filho agora): apenas marcamos $y.\\text{marca} = \\text{TRUE}$ e encerramos!</li>
              <li>Se $y.\\text{marca} == \\text{TRUE}$ (já havia perdido 1 filho antes e acaba de perder o 2º): chamamos <code>CUT(H, y, z)</code> (onde $z = y.p$) e subimos recursivamente com <code>CASCADING-CUT(H, z)</code>!</li>
            </ul>
          </li>
        </ol>

        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header"><span class="proc-name">FIB-HEAP-DECREASE-KEY(H, x, k)</span>, <span class="proc-name">CUT(H, x, y)</span> &amp; <span class="proc-name">CASCADING-CUT(H, y)</span></div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> k &gt; x.chave</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">error</span> "nova chave é maior que a chave atual"</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">x.chave = k</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">y = x.p</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">if</span> y ≠ NIL <span class="kw">and</span> x.chave &lt; y.chave</span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content">    CUT(H, x, y)</span></div>
            <div class="code-line"><span class="line-num">7</span><span class="line-content">    CASCADING-CUT(H, y)</span></div>
            <div class="code-line"><span class="line-num">8</span><span class="line-content"><span class="kw">if</span> x.chave &lt; H.min.chave</span></div>
            <div class="code-line"><span class="line-num">9</span><span class="line-content">    H.min = x</span></div>
            <div class="code-line"><span class="line-num">—</span><span class="line-content"><span class="cmt">// Procedimento CUT(H, x, y):</span></span></div>
            <div class="code-line"><span class="line-num">1</span><span class="line-content">remova x da lista de filhos de y, decrementando y.grau</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">adicione x à lista de raízes de H</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">x.p = NIL</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">x.marca = FALSE</span></div>
            <div class="code-line"><span class="line-num">—</span><span class="line-content"><span class="cmt">// Procedimento CASCADING-CUT(H, y):</span></span></div>
            <div class="code-line"><span class="line-num">1</span><span class="line-content">z = y.p</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">if</span> z ≠ NIL</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">    <span class="kw">if</span> y.marca == FALSE</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">        y.marca = TRUE</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">else</span> CUT(H, y, z)</span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content">        CASCADING-CUT(H, z)</span></div>
          </div>
        </div>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ POR QUE O FATOR 2 EM 2m(H) TORNA DECREASE-KEY O(1) AMORTIZADO? (p. 436) ]</span>
          <p>Suponha que uma chamada a <code>FIB-HEAP-DECREASE-KEY</code> execute <code>CASCADING-CUT</code> recursivamente $c$ vezes:</p>
          <ul>
            <li><strong>Custo Real:</strong> $O(c)$, pois cada chamada de <code>CUT</code> e <code>CASCADING-CUT</code> leva $O(1)$ fora a recursão.</li>
            <li><strong>Variação no número de árvores $t(H)$:</strong> O corte original de $x$ mais os $c - 1$ cortes em cascata adicionam $c$ novas árvores à lista de raízes: $\\Delta t(H) = c$.</li>
            <li><strong>Variação no número de nós marcados $m(H)$:</strong> Cada uma das $c - 1$ chamadas de <code>CASCADING-CUT</code> que realizaram um corte desmarcou um nó previamente marcado ($- (c - 1)$), e a última chamada ($c$-ésima) pode ter marcado no máximo $1$ nó ($+1$). Logo, $\\Delta m(H) \\le -(c - 1) + 1 = 2 - c$.</li>
            <li><strong>Variação Total de Potencial $\\Delta \\Phi$:</strong>
              $$\\Delta \\Phi = \\Delta t(H) + 2\\,\\Delta m(H) \\le c + 2(2 - c) = 4 - c.$$
            </li>
            <li><strong>Custo Amortizado:</strong> $\\hat{c} = O(c) + 4 - c = \\mathbf{O(1)}$! Cada vez que um nó foi marcado no passado, depositamos $2$ unidades de potencial: $1$ unidade paga pelo corte em cascata quando ele perde o segundo filho, e a outra $1$ unidade paga pelo aumento de $t(H)$ quando ele vira uma nova raiz!</li>
          </ul>
        </div>

        <h4>Exclusão de um Nó: <code>FIB-HEAP-DELETE(H, x)</code> ($O(\\lg n)$ amortizado)</h4>
        <p>Para excluir qualquer nó $x$, reduzimos sua chave para $-\\infty$ e extraímos o mínimo:</p>
        <ol>
          <li><code>FIB-HEAP-DECREASE-KEY(H, x, -∞)</code> — custo amortizado $O(1)$;</li>
          <li><code>FIB-HEAP-EXTRACT-MIN(H)</code> — custo amortizado $O(D(n)) = O(\\lg n)$.</li>
        </ol>

        <h3>2. Limitando o Grau Máximo: Lemas 19.1 a 19.4 e Corolário 19.5 (Seção 19.4, pp. 437–440)</h3>
        <p>Por que a estrutura se chama <em>Heap de Fibonacci</em>? Porque a regra do corte em cascata força o tamanho de qualquer subárvore de grau $k$ a crescer pelo menos tão rápido quanto os <strong>números de Fibonacci</strong> $F_{k+2}$!</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ DEMONSTRAÇÃO COMPLETA • LEMAS 19.1 A 19.4 E COROLÁRIO 19.5 (pp. 437–440) ]</span>
          <ul>
            <li><strong>Lema 19.1 (Grau mínimo dos filhos de $x$):</strong> Seja $x$ qualquer nó em um heap de Fibonacci com $x.\\text{grau} = k$, e sejam $y_1, y_2, \\dots, y_k$ os filhos de $x$ na ordem cronológica em que foram ligados a $x$ (do mais antigo ao mais recente). Então $y_1.\\text{grau} \\ge 0$ e, para $i = 2, 3, \\dots, k$, temos <strong>$y_i.\\text{grau} \\ge i - 2$</strong>.<br />
            <em>Prova:</em> Quando $y_i$ foi ligado a $x$ (dentro de <code>CONSOLIDATE</code>), $y_1, \\dots, y_{i-1}$ já eram filhos de $x$, logo $x.\\text{grau} \\ge i - 1$ naquele instante. Como <code>FIB-HEAP-LINK</code> só liga nós que possuem exatamente o <em>mesmo grau</em> no momento da ligação, $y_i.\\text{grau}$ era pelo menos $i - 1$ quando se tornou filho de $x$. Desde então, $y_i$ pode ter perdido <strong>no máximo um filho</strong> (pois se tivesse perdido um segundo filho, <code>CASCADING-CUT</code> o teria cortado de $x$!). Portanto, $y_i.\\text{grau} \\ge (i - 1) - 1 = i - 2$. $\\blacksquare$</li>
            <li><strong>Lema 19.2 (Identidade de Fibonacci):</strong> Para todo inteiro $k \\ge 0$, o $(k+2)$-ésimo número de Fibonacci satisfaz:
              $$F_{k+2} = 1 + \\sum_{i=0}^{k} F_i.$$
              <em>Prova por indução em $k$:</em> Para $k = 0$, $F_2 = 1 = 1 + F_0 = 1 + 0$. No passo indutivo, $F_{k+2} = F_{k+1} + F_k = \\left(1 + \\sum_{i=0}^{k-1} F_i\\right) + F_k = 1 + \\sum_{i=0}^{k} F_i$. $\\blacksquare$</li>
            <li><strong>Lema 19.3 (Desigualdade da Proporção Áurea):</strong> Para todo inteiro $k \\ge 0$, $F_{k+2} \\ge \\phi^k$, onde $\\phi = \\frac{1 + \\sqrt{5}}{2} = 1,61803\\dots$ satisfaz $\\phi^2 = 1 + \\phi$.</li>
            <li><strong>Lema 19.4 (Tamanho exponencial das subárvores):</strong> Seja $x$ qualquer nó em um heap de Fibonacci e $k = x.\\text{grau}$. Então $\\text{tamanho}(x) \\ge F_{k+2} \\ge \\phi^k$, onde $\\text{tamanho}(x)$ é o número de nós na subárvore enraizada em $x$ (incluindo $x$).<br />
            <em>Prova:</em> Seja $s_k$ o menor valor possível de $\\text{tamanho}(z)$ sobre todos os nós $z$ tais que $z.\\text{grau} = k$. Triviais: $s_0 = 1$, $s_1 = 2$. Contando o próprio nó $x$, o filho $y_1$ (que contribui com pelo menos $1$) e $\\text{tamanho}(y_i) \\ge s_{y_i.\\text{grau}} \\ge s_{i-2}$ para $i = 2, \\dots, k$ (pelo Lema 19.1 e monotonicidade de $s$):
              $$\\text{tamanho}(x) \\ge s_k \\ge 2 + \\sum_{i=2}^{k} s_{i-2}.$$
            Por indução em $k$, assumindo $s_j \\ge F_{j+2}$ para $j < k$, temos $s_k \\ge 2 + \\sum_{i=2}^{k} F_i = 1 + \\sum_{i=0}^{k} F_i = F_{k+2} \\ge \\phi^k$. $\\blacksquare$</li>
            <li><strong>Corolário 19.5 (Limite do Grau Máximo $D(n)$):</strong> O grau máximo $D(n)$ de qualquer nó em um heap de Fibonacci de $n$ nós é no máximo $\\lfloor \\log_\\phi n \\rfloor$.<br />
            <em>Prova:</em> Para qualquer nó $x$ de grau $k$, temos $n \\ge \\text{tamanho}(x) \\ge \\phi^k$. Tomando o logaritmo na base $\\phi$, obtemos $k \\le \\log_\\phi n$, e como $k$ é inteiro, $D(n) \\le \\lfloor \\log_\\phi n \\rfloor = O(\\lg n)$. $\\blacksquare$</li>
          </ul>
        </div>
      `
    },

    /* ======================================================================
       UNIDADE 10.4 — CAPÍTULO 20: ÁRVORES DE VAN EMDE BOAS (vEB)
       ====================================================================== */
    {
      id: "u10-4",
      code: "UNIDADE 10.4 • CAPÍTULO 20 (SEÇÕES 20.1, 20.2 E 20.3)",
      pages: "pp. 443–461",
      title: "20.1, 20.2 e 20.3 Árvores de van Emde Boas (vEB): Vetor de Bits, Estrutura Recursiva proto-vEB e Árvore vEB em O(lg lg u)",
      content: `
        <p>Quando as chaves pertencem a um universo inteiro limitado $U = \\{0, 1, 2, \\dots, u - 1\\}$ sem duplicatas (onde $u = 2^k$ para algum inteiro $k \\ge 1$), as <strong>Árvores de van Emde Boas (vEB)</strong> suportam todas as operações de conjunto dinâmico (<code>MEMBER</code>, <code>INSERT</code>, <code>DELETE</code>, <code>MINIMUM</code>, <code>MAXIMUM</code>, <code>SUCCESSOR</code> e <code>PREDECESSOR</code>) em tempo de pior caso <strong>$O(\\lg \\lg u)$</strong>.</p>

        <h3>1. Abordagens Preliminares e a Geometria de $\\sqrt{u}$ (Seção 20.1, pp. 444–447)</h3>
        <ol>
          <li><strong>Vetor de Bits Direto ($A[0 \\dots u - 1]$):</strong> $A[x] = 1 \\iff x \\in S$. Suporta <code>INSERT</code>, <code>DELETE</code> e <code>MEMBER</code> em $O(1)$, mas <code>MINIMUM</code>, <code>MAXIMUM</code>, <code>SUCCESSOR</code> e <code>PREDECESSOR</code> precisam varrer até $u$ bits no pior caso: $\\Theta(u)$.</li>
          <li><strong>Árvore Binária sobre o Vetor de Bits:</strong> Cada nó interno armazena o <code>OR</code> lógico de seus dois filhos ($1$ se a subárvore contém algum $1$). Todas as operações percorrem no máximo um caminho para cima e um para baixo na árvore de altura $\\lg u$, levando $O(\\lg u)$.</li>
          <li><strong>Superpondo uma Árvore de Grau $\\sqrt{u}$ (Altura Constante $2$):</strong> Suponha $u = 2^{2k}$. Dividimos o vetor de bits em $\\sqrt{u}$ <strong>agrupamentos (<em>clusters</em>)</strong> de $\\sqrt{u}$ bits cada, e mantemos um arranjo <code>resumo</code> (<em>summary</em>) de tamanho $\\sqrt{u}$ onde $\\text{resumo}[i] = 1$ se e somente se o $i$-ésimo cluster contém pelo menos uma chave. Agora <code>SUCCESSOR</code> e <code>DELETE</code> levam $O(\\sqrt{u})$ no pior caso.</li>
        </ol>

        <div class="canonical-callout">
          <span class="callout-tag">[ FUNÇÕES DE ÍNDICE EM ÁRVORES vEB • high(x), low(x) E index(x, y) (pp. 446, 452) ]</span>
          <p>Para permitir que $u = 2^k$ seja qualquer potência de $2$ (mesmo quando $k$ é ímpar), definimos a <strong>raiz quadrada superior</strong> $\\uuparrow\\!\\sqrt{u} = 2^{\\lceil k/2 \\rceil}$ (número de clusters) e a <strong>raiz quadrada inferior</strong> $\\ddownarrow\\!\\sqrt{u} = 2^{\\lfloor k/2 \\rfloor}$ (tamanho de cada cluster), de modo que $u = \\uuparrow\\!\\sqrt{u} \\cdot \\ddownarrow\\!\\sqrt{u}$:</p>
          $$\\text{high}(x) = \\left\\lfloor \\frac{x}{\\ddownarrow\\!\\sqrt{u}} \\right\\rfloor, \\qquad \\text{low}(x) = x \\bmod \\ddownarrow\\!\\sqrt{u}, \\qquad \\text{index}(x, y) = x \\cdot \\ddownarrow\\!\\sqrt{u} + y.$$
          <p>Vale a identidade fundamental $x = \\text{index}(\\text{high}(x), \\text{low}(x))$: os $\\lceil k/2 \\rceil$ bits mais significativos de $x$ formam $\\text{high}(x) \\in \\{0, \\dots, \\uuparrow\\!\\sqrt{u}-1\\}$ (qual cluster contém $x$), e os $\\lfloor k/2 \\rfloor$ bits menos significativos formam $\\text{low}(x) \\in \\{0, \\dots, \\ddownarrow\\!\\sqrt{u}-1\\}$ (o deslocamento de $x$ dentro de seu cluster).</p>
        </div>

        <h3>2. Estrutura Recursiva <code>proto-vEB(u)</code> e Por Que Ela Empaca em $\\Theta(\\lg u)$ (Seção 20.2, pp. 447–452)</h3>
        <p>Suponha $u = 2^{2^k}$. Uma estrutura <code>proto-vEB(u)</code> tem caso base $u = 2$ (com arranjo $A[0..1]$) e, para $u \\ge 4$, contém um ponteiro $V.\\text{resumo}$ para uma <code>proto-vEB</code>($\\sqrt{u}$) e um arranjo $V.\\text{cluster}[0 \\dots \\sqrt{u}-1]$ de $\\sqrt{u}$ ponteiros para estruturas <code>proto-vEB</code>($\\sqrt{u}$).</p>
        <ul>
          <li><strong><code>PROTO-vEB-MEMBER(V, x)</code> leva $O(\\lg \\lg u)$:</strong> Faz apenas $1$ chamada recursiva: <code>PROTO-vEB-MEMBER(V.cluster[high(x)], low(x))</code>, gerando $T(u) = T(\\sqrt{u}) + O(1) = O(\\lg \\lg u)$.</li>
          <li><strong>Por que <code>PROTO-vEB-MINIMUM</code>, <code>INSERT</code> e <code>SUCCESSOR</code> falham em atingir $O(\\lg \\lg u)$:</strong>
            <ul>
              <li>Em <code>PROTO-vEB-MINIMUM(V)</code>, fazemos <strong>$2$ chamadas recursivas</strong> de tamanho $\\sqrt{u}$: (1) encontrar o primeiro cluster não vazio <code>c = PROTO-vEB-MINIMUM(V.resumo)</code> e (2) encontrar o primeiro elemento dentro dele: <code>offset = PROTO-vEB-MINIMUM(V.cluster[c])</code>. Logo, $T(u) = 2T(\\sqrt{u}) + O(1)$, que com $m = \\lg u$ dá $S(m) = 2S(m/2) + O(1) = \\Theta(m) = \\mathbf{\\Theta(\\lg u)}$!</li>
              <li>Em <code>PROTO-vEB-SUCCESSOR(V, x)</code>, fazemos até <strong>$2$ chamadas recursivas</strong> (buscar sucessor em $V.\\text{cluster}[\\text{high}(x)]$, ou buscar o próximo cluster em $V.\\text{resumo}$ seguido de <code>PROTO-vEB-MINIMUM</code> nesse cluster), resultando em $T(u) = 2T(\\sqrt{u}) + \\Theta(\\lg u) = \\mathbf{\\Theta(\\lg u \\lg \\lg u)}$!</li>
            </ul>
          </li>
        </ul>

        <h3>3. A Árvore de van Emde Boas <code>vEB(u)</code> e o Truque de $V.\\text{min}$ e $V.\\text{max}$ (Seção 20.3, pp. 452–461)</h3>
        <p>Para eliminar a segunda chamada recursiva em <em>todas</em> as operações, uma árvore <code>vEB(u)</code> adiciona a cada nó $V$ dois atributos inteiros: $V.\\text{min}$ e $V.\\text{max}$ (ambos <code>NIL</code> quando a árvore está vazia):</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ O SEGREDO DE OURO DE UMA ÁRVORE vEB(u) (p. 453) ]</span>
          <ol>
            <li><strong>$V.\\text{min}$ e $V.\\text{max}$ permitem consultas em $O(1)$:</strong> <code>vEB-TREE-MINIMUM(V)</code> e <code>vEB-TREE-MAXIMUM(V)</code> simplesmente retornam $V.\\text{min}$ e $V.\\text{max}$ em tempo $O(1)$ sem nenhuma recursão! Além disso, podemos saber em $O(1)$ se uma árvore é vazia ($V.\\text{min} == \\text{NIL}$), se contém apenas 1 elemento ($V.\\text{min} == V.\\text{max} \\ne \\text{NIL}$) ou se $x$ é menor que o maior elemento de seu cluster ($\\text{low}(x) < V.\\text{cluster}[\\text{high}(x)].\\text{max}$).</li>
            <li><strong>$V.\\text{min}$ NÃO é armazenado recursivamente em nenhum cluster:</strong> O elemento armazenado em $V.\\text{min}$ <strong>não aparece</strong> em $V.\\text{cluster}[\\text{high}(V.\\text{min})]$, nem contamina $V.\\text{resumo}$! (Por outro lado, se a árvore tem $\\ge 2$ elementos, $V.\\text{max}$ <em>é</em> armazenado recursivamente nos clusters.)</li>
            <li><strong>Consequência para inserção em árvore vazia (<code>vEB-EMPTY-TREE-INSERT</code>):</strong> Para inserir $x$ em uma árvore vazia $V$, basta fazer $V.\\text{min} = V.\\text{max} = x$ em tempo <strong>$O(1)$</strong>, sem precisar descer recursivamente pelos clusters nem atualizar o resumo!</li>
          </ol>
        </div>

        <h4>Pseudocódigos Fundamentais em $O(\\lg \\lg u)$: <code>SUCCESSOR</code>, <code>INSERT</code> e <code>DELETE</code></h4>
        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header"><span class="proc-name">vEB-TREE-SUCCESSOR(V, x)</span></div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> V.u == 2</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">if</span> x == 0 <span class="kw">and</span> V.max == 1</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">        <span class="kw">return</span> 1</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">else</span> <span class="kw">return</span> NIL</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">elseif</span> V.min ≠ NIL <span class="kw">and</span> x &lt; V.min</span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content">    <span class="kw">return</span> V.min</span></div>
            <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">else</span> max-low = vEB-TREE-MAXIMUM(V.cluster[high(x)]) <span class="cmt">// O(1)!</span></span></div>
            <div class="code-line"><span class="line-num">8</span><span class="line-content">    <span class="kw">if</span> max-low ≠ NIL <span class="kw">and</span> low(x) &lt; max-low</span></div>
            <div class="code-line"><span class="line-num">9</span><span class="line-content">        offset = vEB-TREE-SUCCESSOR(V.cluster[high(x)], low(x)) <span class="cmt">// 1 chamada recursiva!</span></span></div>
            <div class="code-line"><span class="line-num">10</span><span class="line-content">        <span class="kw">return</span> index(high(x), offset)</span></div>
            <div class="code-line"><span class="line-num">11</span><span class="line-content">    <span class="kw">else</span> succ-cluster = vEB-TREE-SUCCESSOR(V.resumo, high(x)) <span class="cmt">// OU 1 chamada recursiva!</span></span></div>
            <div class="code-line"><span class="line-num">12</span><span class="line-content">        <span class="kw">if</span> succ-cluster == NIL</span></div>
            <div class="code-line"><span class="line-num">13</span><span class="line-content">            <span class="kw">return</span> NIL</span></div>
            <div class="code-line"><span class="line-content">        <span class="kw">else</span> offset = vEB-TREE-MINIMUM(V.cluster[succ-cluster]) <span class="cmt">// O(1)!</span></span></div>
            <div class="code-line"><span class="line-num">15</span><span class="line-content">            <span class="kw">return</span> index(succ-cluster, offset)</span></div>
          </div>
        </div>
        <p>Observe a perfeição das linhas 7–15 de <code>vEB-TREE-SUCCESSOR</code>: na linha 7 consultamos <code>max-low</code> em $O(1)$. Se $\\text{low}(x) < \\text{max-low}$, temos <strong>certeza</strong> de que o sucessor de $x$ está dentro do mesmo cluster $\\text{high}(x)$, então fazemos <strong>apenas a chamada recursiva da linha 9</strong>. Caso contrário, fazemos <strong>apenas a chamada recursiva da linha 11</strong> em $V.\\text{resumo}$ e obtemos o primeiro elemento de <code>succ-cluster</code> na linha 14 em $O(1)$ via $V.\\text{cluster}[\\text{succ-cluster}].\\text{min}$!</p>

        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header"><span class="proc-name">vEB-EMPTY-TREE-INSERT(V, x)</span> &amp; <span class="proc-name">vEB-TREE-INSERT(V, x)</span></div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="cmt">// vEB-EMPTY-TREE-INSERT(V, x):</span></span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">V.min = x</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">V.max = x</span></div>
            <div class="code-line"><span class="line-num">—</span><span class="line-content"><span class="cmt">// vEB-TREE-INSERT(V, x):</span></span></div>
            <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> V.min == NIL</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">    vEB-EMPTY-TREE-INSERT(V, x)</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">else</span> <span class="kw">if</span> x &lt; V.min</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">        troque x com V.min</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">if</span> V.u &gt; 2</span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content">        <span class="kw">if</span> vEB-TREE-MINIMUM(V.cluster[high(x)]) == NIL</span></div>
            <div class="code-line"><span class="line-num">7</span><span class="line-content">            vEB-TREE-INSERT(V.resumo, high(x)) <span class="cmt">// 1 chamada recursiva!</span></span></div>
            <div class="code-line"><span class="line-num">8</span><span class="line-content">            vEB-EMPTY-TREE-INSERT(V.cluster[high(x)], low(x)) <span class="cmt">// O(1)!</span></span></div>
            <div class="code-line"><span class="line-num">9</span><span class="line-content">        <span class="kw">else</span> vEB-TREE-INSERT(V.cluster[high(x)], low(x)) <span class="cmt">// OU 1 chamada recursiva!</span></span></div>
            <div class="code-line"><span class="line-num">10</span><span class="line-content">    <span class="kw">if</span> x &gt; V.max</span></div>
            <div class="code-line"><span class="line-num">11</span><span class="line-content">        V.max = x</span></div>
          </div>
        </div>
        <p>Veja as linhas 6–9 de <code>vEB-TREE-INSERT</code>: se o cluster $\\text{high}(x)$ estava vazio (linha 6), fazemos a chamada recursiva em $V.\\text{resumo}$ (linha 7), mas a inserção no cluster na linha 8 usa <code>vEB-EMPTY-TREE-INSERT</code>, que custa <strong>$O(1)$</strong>! Se o cluster não estava vazio, pulamos a linha 7 e fazemos apenas a chamada recursiva da linha 9. De modo análogo, em <code>vEB-TREE-DELETE(V, x)</code> (pp. 459–460) — e em <code>vEB-TREE-PREDECESSOR(V, x)</code> (que tem um caso adicional quando $x$ pertence a um cluster cujo único elemento era o próprio $V.\\text{cluster}[\\text{high}(x)].\\text{min}$) — <strong>nunca ocorrem duas chamadas recursivas completas na mesma invocação</strong>, estabelecendo $T(u) = T(\\uuparrow\\!\\sqrt{u}) + O(1) = \\mathbf{O(\\lg \\lg u)}$ para todas as operações! O espaço total de uma árvore <code>vEB(u)</code> é $O(u)$.</p>
      `
    },

    /* ======================================================================
       UNIDADE 10.5 — CAPÍTULO 21 (SEÇÕES 21.1 E 21.2): CONJUNTOS DISJUNTOS & LISTAS LIGADAS
       ====================================================================== */
    {
      id: "u10-5",
      code: "UNIDADE 10.5 • CAPÍTULO 21 (SEÇÕES 21.1 E 21.2)",
      pages: "pp. 462–468",
      title: "21.1 e 21.2 Operações de Conjuntos Disjuntos (MAKE-SET, UNION, FIND-SET), Aplicação em Componentes Conexas e Representação por Listas Ligadas com Heurística de União Ponderada",
      content: `
        <p>Uma <strong>estrutura de dados de conjuntos disjuntos</strong> mantém uma coleção $\\mathcal{S} = \\{S_1, S_2, \\dots, S_k\\}$ de conjuntos dinâmicos disjuntos. Identificamos cada conjunto por um <strong>representante</strong>, que é algum membro do conjunto (qualquer membro serve, desde que duas consultas ao mesmo conjunto sem modificação intermediária devolvam exatamente o mesmo representante).</p>

        <h3>1. As Três Operações de Conjuntos Disjuntos e Parâmetros $n$ e $m$ (Seção 21.1, pp. 462–464)</h3>
        <ul>
          <li><strong><code>MAKE-SET(x)</code>:</strong> Cria um novo conjunto cujo único membro (e, portanto, representante) é $x$. Como os conjuntos são disjuntos, exigimos que $x$ ainda não esteja em nenhum outro conjunto.</li>
          <li><strong><code>UNION(x, y)</code>:</strong> Une os conjuntos dinâmicos que contêm $x$ e $y$, digamos $S_x$ e $S_y$, em um novo conjunto $S_x \\cup S_y$, destruindo $S_x$ e $S_y$ da coleção $\\mathcal{S}$.</li>
          <li><strong><code>FIND-SET(x)</code>:</strong> Devolve um ponteiro para o representante do (único) conjunto que contém $x$.</li>
        </ul>
        <p>Analisamos o tempo de execução em termos de dois parâmetros: <strong>$n$</strong> (o número de operações <code>MAKE-SET</code>) e <strong>$m$</strong> (o número total de operações <code>MAKE-SET</code>, <code>UNION</code> e <code>FIND-SET</code>). Como cada <code>UNION</code> reduz o número de conjuntos disjuntos em $1$, no máximo $n - 1$ operações <code>UNION</code> podem ocorrer, e sempre vale $m \\ge n$.</p>

        <h4>Aplicação Clássica: Determinando as Componentes Conexas de um Grafo Não Orientado</h4>
        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header"><span class="proc-name">CONNECTED-COMPONENTS(G)</span> &amp; <span class="proc-name">SAME-COMPONENT(u, v)</span></div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">for</span> cada vértice v ∈ G.V</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">    MAKE-SET(v)</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">for</span> cada aresta (u, v) ∈ G.E</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">if</span> FIND-SET(u) ≠ FIND-SET(v)</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content">        UNION(u, v)</span></div>
            <div class="code-line"><span class="line-num">—</span><span class="line-content"><span class="cmt">// Procedimento SAME-COMPONENT(u, v):</span></span></div>
            <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> FIND-SET(u) == FIND-SET(v)</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">return</span> TRUE</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">else</span> <span class="kw">return</span> FALSE</span></div>
          </div>
        </div>
        <p>Quando as arestas do grafo são estáticas, a busca em profundidade (DFS, Capítulo 22) encontra componentes conexas em $O(V + E)$. Porém, quando <strong>as arestas são adicionadas dinamicamente</strong> e precisamos consultar <code>SAME-COMPONENT(u, v)</code> de forma intercalada com a chegada de novas arestas, conjuntos disjuntos são imbatíveis!</p>

        <h3>2. Representação por Listas Ligadas e Heurística de União Ponderada (Seção 21.2, pp. 465–468)</h3>
        <p>Na representação por listas ligadas (Figura 21.2), cada conjunto é representado por um objeto de conjunto que possui ponteiros <code>head</code> (para o primeiro elemento da lista, que é o <strong>representante</strong> do conjunto) e <code>tail</code> (para o último elemento). Cada nó na lista contém o membro do conjunto, um ponteiro <code>next</code> para o próximo nó e um ponteiro de volta para o objeto do conjunto.</p>
        <ul>
          <li><code>MAKE-SET(x)</code> e <code>FIND-SET(x)</code> levam tempo <strong>$O(1)$</strong> (basta seguir o ponteiro de $x$ para o objeto do conjunto e ler <code>head</code>).</li>
          <li><strong>União ingênua ($\\Theta(m^2)$):</strong> Se <code>UNION(x, y)</code> sempre anexa a lista de $x$ ao final da lista de $y$, precisamos atualizar o ponteiro de conjunto de cada membro da lista de $x$. Uma sequência de $n$ chamadas <code>MAKE-SET</code> seguidas por $n - 1$ chamadas <code>UNION</code> que sempre anexam uma lista de tamanho $i - 1$ a uma lista de tamanho $1$ gasta $n + \\sum_{i=1}^{n-1} i = \\Theta(n^2) = \\Theta(m^2)$ (tempo amortizado $\\Theta(m)$ por operação)!</li>
          <li><strong>Heurística de União Ponderada (<em>Weighted-Union Heuristic</em>):</strong> Mantemos o comprimento de cada lista no objeto do conjunto e, em <code>UNION(x, y)</code>, <strong>sempre anexamos a lista menor ao final da lista maior</strong> (desempatando arbitrariamente se tiverem o mesmo tamanho).</li>
        </ul>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 21.1 • ANÁLISE DA UNIÃO PONDERADA EM LISTAS LIGADAS (p. 467) ]</span>
          <p>Usando a representação por listas ligadas de conjuntos disjuntos e a heurística de união ponderada, uma sequência de $m$ operações <code>MAKE-SET</code>, <code>UNION</code> e <code>FIND-SET</code>, das quais $n$ são operações <code>MAKE-SET</code>, leva o tempo <strong>$O(m + n \\lg n)$</strong>.</p>
          <p><strong>Demonstração Completa:</strong> Contamos quantas vezes o ponteiro de retorno para o objeto do conjunto de qualquer elemento fixo $x$ pode ser atualizado ao longo de todas as operações <code>UNION</code>. Toda vez que o ponteiro de $x$ é atualizado, $x$ pertencia ao menor dos dois conjuntos que estavam sendo unidos. Portanto, na primeira vez que o ponteiro de $x$ é atualizado, o conjunto resultante tem no mínimo $2$ membros; na segunda vez, tem no mínimo $4$ membros; e, por indução, após o ponteiro de $x$ ter sido atualizado $k$ vezes, o conjunto resultante tem no mínimo $2^k$ membros. Como o maior conjunto possível tem no máximo $n$ membros, temos $2^k \\le n \\implies k \\le \\lg n$ (ou seja, $\\lceil \\lg n \\rceil$ atualizações por elemento). Somando sobre todos os $n$ elementos, o tempo total gasto atualizando ponteiros de objetos em todas as chamadas <code>UNION</code> é $O(n \\lg n)$. Somando $O(1)$ para cada uma das $n$ operações <code>MAKE-SET</code> e para cada <code>FIND-SET</code> (e atualizações de <code>head</code>/<code>tail</code>/tamanho), o tempo total da sequência de $m$ operações é $O(m + n \\lg n)$. $\\blacksquare$</p>
        </div>
      `
    },

    /* ======================================================================
       UNIDADE 10.6 — CAPÍTULO 21 (SEÇÕES 21.3 E 21.4): FLORESTAS DE CONJUNTOS DISJUNTOS & α(n)
       ====================================================================== */
    {
      id: "u10-6",
      code: "UNIDADE 10.6 • CAPÍTULO 21 (SEÇÕES 21.3 E 21.4)",
      pages: "pp. 468–482",
      title: "21.3 e 21.4 Florestas de Conjuntos Disjuntos: União por Posto (Union by Rank), Compressão de Caminho (Path Compression) e Análise O(m α(n))",
      content: `
        <p>Na implementação mais rápida de conjuntos disjuntos — as <strong>florestas de conjuntos disjuntos</strong> (Seção 21.3, pp. 468–472) —, representamos conjuntos por <strong>árvores enraizadas</strong>, onde cada nó contém um membro e cada árvore representa um conjunto. Cada membro $x$ aponta apenas para seu pai $x.p$, e a <strong>raiz</strong> de cada árvore contém o representante e é seu próprio pai ($x.p = x$).</p>

        <h3>1. As Duas Heurísticas e os Pseudocódigos Canônicos (Seção 21.3, pp. 469–471)</h3>
        <ol>
          <li><strong>União por Posto (<em>Union by Rank</em>):</strong> Para cada nó $x$, mantemos um inteiro $x.\\text{posto}$ (<em>rank</em>), que é um limite superior para a altura de $x$ (número de arestas no caminho mais longo de $x$ até uma folha descendente). Em <code>UNION(x, y)</code>, fazemos a raiz de <strong>menor posto</strong> apontar para a raiz de <strong>maior posto</strong>. Se as duas raízes tiverem postos iguais, escolhemos arbitrariamente uma delas (no código, $y$) como pai e incrementamos seu posto em $1$.</li>
          <li><strong>Compressão de Caminho (<em>Path Compression</em>):</strong> Durante <code>FIND-SET(x)</code>, usamos recursão para subir pelo caminho de busca até encontrar a raiz e, no retorno da recursão, <strong>fazemos cada nó no caminho apontar diretamente para a raiz</strong>! A compressão de caminho não altera nenhum atributo <code>posto</code>.</li>
        </ol>

        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header"><span class="proc-name">MAKE-SET(x)</span>, <span class="proc-name">UNION(x, y)</span>, <span class="proc-name">LINK(x, y)</span> &amp; <span class="proc-name">FIND-SET(x)</span></div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="cmt">// MAKE-SET(x):</span></span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">x.p = x</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">x.posto = 0</span></div>
            <div class="code-line"><span class="line-num">—</span><span class="line-content"><span class="cmt">// UNION(x, y):</span></span></div>
            <div class="code-line"><span class="line-num">1</span><span class="line-content">LINK(FIND-SET(x), FIND-SET(y))</span></div>
            <div class="code-line"><span class="line-num">—</span><span class="line-content"><span class="cmt">// LINK(x, y):</span></span></div>
            <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> x.posto &gt; y.posto</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">    y.p = x</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">else</span> x.p = y</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">if</span> x.posto == y.posto</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content">        y.posto = y.posto + 1</span></div>
            <div class="code-line"><span class="line-num">—</span><span class="line-content"><span class="cmt">// FIND-SET(x) — Método de Duas Passagens:</span></span></div>
            <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> x ≠ x.p</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">    x.p = FIND-SET(x.p)</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">return</span> x.p</span></div>
          </div>
        </div>
        <p>Observe que <code>FIND-SET(x)</code> é um <strong>método de duas passagens</strong>: na primeira passagem, sobe pelo caminho de localização até encontrar a raiz; na segunda passagem (desempilhando as chamadas recursivas), desce pelo caminho de localização atualizando cada $x.p$ para apontar diretamente para a raiz.</p>

        <h3>2. A Função $A_k(j)$, sua Inversa $\\alpha(n) \\le 4$ e a Análise $O(m \\,\\alpha(n))$ (Seção 21.4, pp. 472–481)</h3>
        <p>Usadas isoladamente, a união por posto dá tempo $O(m \\lg n)$ (Exercício 21.4-4) e a compressão de caminho dá tempo $\\Theta(n + f \\cdot (1 + \\lg_{2+f/n} n))$ para $f$ operações <code>FIND-SET</code>. Quando usadas <strong>juntas</strong>, o tempo de execução no pior caso é apenas <strong>$O(m \\,\\alpha(n))$</strong>!</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ DEFINIÇÃO FORMAL • A FUNÇÃO A_k(j) E SUA INVERSA α(n) (pp. 472–474) ]</span>
          <p>Para inteiros $k \\ge 0$ e $j \\ge 1$, definimos a função $A_k(j)$ (variante da função de Ackermann) por:</p>
          $$A_k(j) = \\begin{cases} j + 1 & \\text{se } k = 0, \\\\ A_{k-1}^{(j+1)}(j) & \\text{se } k \\ge 1, \\end{cases}$$
          <p>onde $A_{k-1}^{(j+1)}(j)$ denota a composição iterada $(j + 1)$ vezes da função $A_{k-1}$ aplicada a $j$.</p>
          <ul>
            <li><strong>Nível $k = 0$:</strong> $A_0(j) = j + 1$.</li>
            <li><strong>Nível $k = 1$:</strong> $A_1(j) = A_0^{(j+1)}(j) = j + (j + 1) = 2j + 1$ (Lema 21.2).</li>
            <li><strong>Nível $k = 2$:</strong> $A_2(j) = A_1^{(j+1)}(j) = 2^{j+1}(j + 1) - 1$ (Lema 21.3). Em particular, $A_2(1) = 2^2(2) - 1 = 7$.</li>
            <li><strong>Nível $k = 3$:</strong> $A_3(1) = A_2^{(2)}(1) = A_2(A_2(1)) = A_2(7) = 2^8(8) - 1 = 2.047$.</li>
            <li><strong>Nível $k = 4$:</strong> $A_4(1) = A_3^{(2)}(1) = A_3(A_3(1)) = A_3(2047) = A_2^{(2048)}(2047) \\gg A_2(2047) = 2^{2048} \\cdot 2048 - 1 > 2^{2048} = (2^4)^{512} = 16^{512} \\gg 10^{80}$ (o número estimado de átomos no universo observável!).</li>
          </ul>
          <p>Definimos a <strong>inversa $\\alpha(n)$</strong> como o menor nível $k$ tal que $A_k(1)$ é pelo menos $n$:</p>
          $$\\alpha(n) = \\min\\{k : A_k(1) \\ge n\\}.$$
          <p>Portanto: $\\alpha(n) = 0$ para $0 \\le n \\le 2$; $\\alpha(3) = 1$; $\\alpha(n) = 2$ para $4 \\le n \\le 7$; $\\alpha(n) = 3$ para $8 \\le n \\le 2047$; e <strong>$\\alpha(n) = 4$ para $2048 \\le n \\le A_4(1)$ (onde $A_4(1) \\gg 10^{80}$)</strong>!</p>
        </div>

        <h4>Propriedades dos Postos e Estrutura da Prova pelo Método do Potencial (Lemas 21.4 a 21.13 e Teorema 21.14)</h4>
        <ul>
          <li><strong>Lema 21.4 (Monotonicidade estrita dos postos):</strong> Para todo nó $x \\ne x.p$, vale $x.\\text{posto} < x.p.\\text{posto}$. Além disso, $x.\\text{posto}$ começa em $0$, aumenta no tempo enquanto $x$ é raiz e <strong>jamais muda depois que $x$ deixa de ser raiz</strong>.</li>
          <li><strong>Corolário 21.5 (Limite de posto):</strong> Uma árvore cuja raiz tem posto $k$ contém pelo menos $2^k$ nós, de modo que $x.\\text{posto} \\le \\lfloor \\lg n \\rfloor < n$ para todo nó $x$.</li>
          <li><strong>Nível $\\text{level}(x)$ e Índice $\\text{iter}(x)$:</strong> Para qualquer nó $x$ que tem pai ($x \\ne x.p$) e tem $x.\\text{posto} \\ge 1$, definimos:
            $$\\text{level}(x) = \\max\\{k : x.p.\\text{posto} \\ge A_k(x.\\text{posto})\\} \\quad \\text{(satisfazendo } 0 \\le \\text{level}(x) < \\alpha(n)\\text{)}$$
            $$\\text{iter}(x) = \\max\\{i : x.p.\\text{posto} \\ge A_{\\text{level}(x)}^{(i)}(x.\\text{posto})\\} \\quad \\text{(satisfazendo } 1 \\le \\text{iter}(x) \\le x.\\text{posto}\\text{)}.$$
          </li>
          <li><strong>Função potencial $\\phi_q(x)$ e $\\Phi_q = \\sum_x \\phi_q(x)$:</strong> Se $x$ é uma raiz ou se $x.\\text{posto} == 0$, então $\\phi_q(x) = \\alpha(n) \\cdot x.\\text{posto}$. Se $x$ não é raiz e $x.\\text{posto} \\ge 1$, então:
            $$\\phi_q(x) = (\\alpha(n) - \\text{level}(x)) \\cdot x.\\text{posto} - \\text{iter}(x).$$
            À medida que <code>FIND-SET</code> comprime caminhos, $x.p.\\text{posto}$ cresce, o que aumenta $\\text{iter}(x)$ ou $\\text{level}(x)$, fazendo $\\phi_q(x)$ <strong>diminuir em pelo menos $1$</strong> para cada nó no caminho de busca que possui um ancestral acima dele com o mesmo $\\text{level}(x)$! Como há no máximo $\\alpha(n) + 2$ nós no caminho de busca que <em>não</em> possuem um ancestral com mesmo $\\text{level}$, o custo amortizado de <code>FIND-SET</code> e de <code>LINK</code> (e <code>MAKE-SET</code>) é limitado por $O(\\alpha(n))$, provando o <strong>Teorema 21.14</strong>: uma sequência de $m$ operações leva tempo <strong>$O(m \\,\\alpha(n))$</strong>!</li>
        </ul>
      `
    }
  ];

  /* ========================================================================
     BANCADAS INTERATIVAS DO MÓDULO 10
     (1) Floresta de Conjuntos Disjuntos (MAKE-SET, UNION por Posto, FIND-SET com Compressão de Caminho)
     (2) Árvore B (B-TREE-SPLIT-CHILD & B-TREE-INSERT) & Decomposição em Árvore vEB (high, low, index)
     ======================================================================== */
  function initWorkbenches() {
    const mount = document.getElementById("workbench-mod10-mount");
    if (!mount) return;

    mount.innerHTML = `
      <div class="workbench-box" style="margin-top:1.75rem;">
        <div class="workbench-header">
          <span class="workbench-title">[ BANCADA INTERATIVA #10A • FLORESTA DE CONJUNTOS DISJUNTOS: UNIÃO POR POSTO &amp; COMPRESSÃO DE CAMINHO (CAP. 21.3) ]</span>
          <span class="bracket-tag dark">O(m α(n)) • α(n) ≤ 4</span>
        </div>
        <div class="workbench-body">
          <p style="font-size:0.9rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
            Execute operações <code>UNION(x, y)</code> (que usa <code>LINK</code> com <strong>União por Posto</strong>) e <code>FIND-SET(x)</code> (que aplica <strong>Compressão de Caminho</strong> fazendo todos os nós no caminho de busca apontarem diretamente para a raiz!). Use também o botão de <strong>Cenário do Exercício 21.3-1</strong> para ver uma árvore de posto 3 ser achatada em tempo real:
          </p>

          <div class="workbench-controls" style="display:flex;flex-wrap:wrap;gap:0.65rem;align-items:center;margin-bottom:1rem;">
            <label style="font-family:var(--font-mono);font-size:0.76rem;font-weight:700;">Nó x:</label>
            <select id="dsu-x-sel" class="search-input-brutal" style="min-width:70px;"></select>
            <label style="font-family:var(--font-mono);font-size:0.76rem;font-weight:700;">Nó y:</label>
            <select id="dsu-y-sel" class="search-input-brutal" style="min-width:70px;"></select>

            <button class="wb-btn primary" onclick="window.mod10DsuUnion()">[ UNION(x, y) ]</button>
            <button class="wb-btn primary" onclick="window.mod10DsuFind()">[ FIND-SET(x) (Comprimir Caminho) ]</button>
            <button class="wb-btn" onclick="window.mod10DsuPresetDeep()">[ CARREGAR ÁRVORE DE POSTO 3 (EX. 21.3-1) ]</button>
            <button class="wb-btn" onclick="window.mod10DsuReset()">[ ↺ REINICIAR 8 MAKE-SET ]</button>
          </div>

          <div id="dsu-telemetry" class="workbench-telemetry-strip" style="margin-bottom:1rem;"></div>
          <div id="dsu-forest-canvas" style="background:var(--bg-card);border:var(--border-thin);padding:1rem;overflow-x:auto;"></div>
          <div id="dsu-log-box" style="margin-top:0.75rem;padding:0.75rem 1rem;background:#F4EFE4;border-left:3px solid #111;font-family:var(--font-mono);font-size:0.8rem;"></div>
        </div>
      </div>

      <div class="workbench-box" style="margin-top:1.5rem;">
        <div class="workbench-header">
          <span class="workbench-title">[ BANCADA INTERATIVA #10B • ÁRVORE B (B-TREE-SPLIT-CHILD &amp; INSERT) E DECOMPOSIÇÃO vEB (CAP. 18 &amp; 20) ]</span>
          <span class="bracket-tag amber">h ≤ log_t((n+1)/2) • O(lg lg u)</span>
        </div>
        <div class="workbench-body">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:1.25rem;">
            <div style="background:var(--bg-card);border:var(--border-thin);padding:1rem;">
              <div style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;margin-bottom:0.5rem;">
                [ SIMULADOR DE INSERÇÃO E DIVISÃO PREVENTIVA EM ÁRVORE B (t = 2, Máx 2t-1 = 3 chaves/nó) ]
              </div>
              <p style="font-size:0.84rem;color:var(--ink-secondary);margin-bottom:0.75rem;">
                Insira chaves ou execute passo a passo a sequência clássica do <strong>Exercício 18.2-1</strong> $\\langle F, S, Q, K, C, L, H, T, V, W, M, R, N \\dots \\rangle$ observando como <code>B-TREE-SPLIT-CHILD</code> divide nós cheios ($3$ chaves) ao redor da mediana em uma única descida:
              </p>
              <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.75rem;">
                <input id="btree-key-input" type="text" maxlength="2" value="F" class="search-input-brutal" style="width:65px;text-transform:uppercase;" />
                <button class="wb-btn primary" onclick="window.mod10BTreeInsertInput()">[ B-TREE-INSERT ]</button>
                <button class="wb-btn primary" onclick="window.mod10BTreeNextPreset()">[ + PRÓXIMA CHAVE EX. 18.2-1 ]</button>
                <button class="wb-btn" onclick="window.mod10BTreeReset()">[ ↺ LIMPAR ]</button>
              </div>
              <div id="btree-canvas" style="font-family:var(--font-mono);font-size:0.8rem;line-height:1.55;"></div>
            </div>

            <div style="background:var(--bg-card);border:var(--border-thin);padding:1rem;">
              <div style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;margin-bottom:0.5rem;">
                [ INSPETOR DE ÁRVORE DE VAN EMDE BOAS vEB(u): high(x), low(x) E RECORRÊNCIA T(u) = T(√u) + O(1) ]
              </div>
              <p style="font-size:0.84rem;color:var(--ink-secondary);margin-bottom:0.75rem;">
                Selecione o tamanho do universo $u = 2^k$ e uma chave $x \\in \\{0, \\dots, u - 1\\}$ para inspecionar a decomposição binária em $\\uuparrow\\!\\sqrt{u}$ clusters de tamanho $\\ddownarrow\\!\\sqrt{u}$ e a cadeia de chamadas recursivas até $u = 2$:
              </p>
              <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;margin-bottom:0.75rem;">
                <label style="font-family:var(--font-mono);font-size:0.75rem;font-weight:700;">u:</label>
                <select id="veb-u-sel" class="search-input-brutal" onchange="window.mod10UpdateVeb()">
                  <option value="16" selected>u = 16 (2⁴)</option>
                  <option value="32">u = 32 (2⁵ — potência ímpar!)</option>
                  <option value="256">u = 256 (2⁸)</option>
                  <option value="65536">u = 65.536 (2¹⁶)</option>
                </select>
                <label style="font-family:var(--font-mono);font-size:0.75rem;font-weight:700;">x:</label>
                <input id="veb-x-input" type="number" min="0" value="11" class="search-input-brutal" style="width:90px;" oninput="window.mod10UpdateVeb()" />
              </div>
              <div id="veb-output" style="font-family:var(--font-mono);font-size:0.8rem;line-height:1.55;"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    /* --- Lógica da Bancada #10A: Floresta de Conjuntos Disjuntos --- */
    const dsuNodes = ["a", "b", "c", "d", "e", "f", "g", "h"];
    let dsuParent = {};
    let dsuRank = {};
    let dsuTotalOps = 0;
    let dsuHighlightedPath = [];

    function initDsuSelectors() {
      const xSel = document.getElementById("dsu-x-sel");
      const ySel = document.getElementById("dsu-y-sel");
      if (!xSel || !ySel) return;
      xSel.innerHTML = dsuNodes.map((n, i) => `<option value="${n}" ${i === 0 ? "selected" : ""}>${n}</option>`).join("");
      ySel.innerHTML = dsuNodes.map((n, i) => `<option value="${n}" ${i === 1 ? "selected" : ""}>${n}</option>`).join("");
    }

    function dsuFindRootNoCompress(x) {
      let cur = x;
      while (dsuParent[cur] !== cur) {
        cur = dsuParent[cur];
      }
      return cur;
    }

    function dsuDepth(x) {
      let d = 0;
      let cur = x;
      while (dsuParent[cur] !== cur) {
        d++;
        cur = dsuParent[cur];
      }
      return d;
    }

    function dsuFindWithCompress(x) {
      const path = [];
      let cur = x;
      while (dsuParent[cur] !== cur) {
        path.push(cur);
        cur = dsuParent[cur];
      }
      const root = cur;
      path.forEach((node) => {
        dsuParent[node] = root;
      });
      return { root, compressedNodes: path };
    }

    function renderDsu() {
      const tel = document.getElementById("dsu-telemetry");
      const canvas = document.getElementById("dsu-forest-canvas");
      if (!tel || !canvas) return;

      const roots = dsuNodes.filter((n) => dsuParent[n] === n);
      const maxDepth = Math.max(...dsuNodes.map(dsuDepth));
      const maxRank = Math.max(...dsuNodes.map((n) => dsuRank[n]));

      tel.innerHTML = `
        <div class="wb-stat-box">
          <span>CONJUNTOS DISJUNTOS ATIVOS</span>
          <strong>${roots.length} (${roots.map((r) => `{rep: ${r}}`).join(", ")})</strong>
        </div>
        <div class="wb-stat-box">
          <span>POSTO MÁXIMO (RANK) / PROFUNDIDADE REAL</span>
          <strong>posto máx = ${maxRank} (≤ ⌊lg 8⌋ = 3) • prof. máx = ${maxDepth}</strong>
        </div>
        <div class="wb-stat-box">
          <span>OPERAÇÕES REALIZADAS &amp; α(n)</span>
          <strong>m = ${dsuTotalOps} ops • α(8) = 3 (≤ 4)</strong>
        </div>
      `;

      const rowsHtml = dsuNodes
        .map((n) => {
          const isRoot = dsuParent[n] === n;
          const isHighlighted = dsuHighlightedPath.includes(n);
          const bg = isHighlighted ? "#FDE68A" : isRoot ? "#DCFCE7" : "#FFFFFF";
          return `
            <div style="border:2px solid #111;padding:0.55rem 0.7rem;background:${bg};min-width:110px;">
              <div style="font-family:var(--font-mono);font-weight:700;font-size:0.88rem;">
                Nó ${n} ${isRoot ? "[RAIZ]" : ""}
              </div>
              <div style="font-family:var(--font-mono);font-size:0.76rem;margin-top:0.2rem;">
                ${n}.p = <strong>${dsuParent[n]}</strong> | posto = <strong>${dsuRank[n]}</strong>
              </div>
              <div style="font-family:var(--font-mono);font-size:0.72rem;color:var(--ink-secondary);margin-top:0.15rem;">
                prof. = ${dsuDepth(n)} • rep = ${dsuFindRootNoCompress(n)}
              </div>
            </div>
          `;
        })
        .join("");

      canvas.innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:0.6rem;">${rowsHtml}</div>`;
    }

    window.mod10DsuReset = function () {
      dsuNodes.forEach((n) => {
        dsuParent[n] = n;
        dsuRank[n] = 0;
      });
      dsuTotalOps = 8;
      dsuHighlightedPath = [];
      const log = document.getElementById("dsu-log-box");
      if (log) {
        log.innerHTML = `<strong>[INICIALIZAÇÃO]:</strong> 8 chamadas <code>MAKE-SET(a..h)</code> executadas. Para cada nó $x$, temos $x.p = x$ e $x.\\text{posto} = 0$.`;
      }
      renderDsu();
    };

    window.mod10DsuPresetDeep = function () {
      dsuNodes.forEach((n) => {
        dsuParent[n] = n;
        dsuRank[n] = 0;
      });
      // Construir árvore binomial de posto 3 com caminho longo a -> b -> d -> h
      // Pares: (a,b)->b(rank1), (c,d)->d(rank1), (e,f)->f(rank1), (g,h)->h(rank1)
      // Depois (b,d)->d(rank2), (f,h)->h(rank2), e finalmente (d,h)->h(rank3)
      dsuParent["a"] = "b"; dsuRank["b"] = 1;
      dsuParent["c"] = "d"; dsuRank["d"] = 2; dsuParent["b"] = "d";
      dsuParent["e"] = "f"; dsuRank["f"] = 1;
      dsuParent["g"] = "h"; dsuRank["h"] = 3; dsuParent["f"] = "h";
      dsuParent["d"] = "h";
      dsuTotalOps = 15;
      dsuHighlightedPath = ["a", "b", "d", "h"];
      const xSel = document.getElementById("dsu-x-sel");
      if (xSel) xSel.value = "a";
      const log = document.getElementById("dsu-log-box");
      if (log) {
        log.innerHTML = `<strong>[CENÁRIO EX. 21.3-1 CARREGADO]:</strong> Árvore única com raiz $h$ ($h.\\text{posto} = 3$) e caminho longo $a \\to b \\to d \\to h$ (profundidade $3$). Clique agora em <strong>[ FIND-SET(x) ]</strong> com $x = a$ para ver a <strong>Compressão de Caminho</strong> ligar $a$, $b$ e $d$ diretamente à raiz $h$!`;
      }
      renderDsu();
    };

    window.mod10DsuUnion = function () {
      const xSel = document.getElementById("dsu-x-sel");
      const ySel = document.getElementById("dsu-y-sel");
      const log = document.getElementById("dsu-log-box");
      if (!xSel || !ySel) return;
      const x = xSel.value;
      const y = ySel.value;
      const rx = dsuFindWithCompress(x);
      const ry = dsuFindWithCompress(y);
      dsuTotalOps++;

      if (rx.root === ry.root) {
        dsuHighlightedPath = [x, y, rx.root];
        if (log) {
          log.innerHTML = `<strong>[UNION(${x}, ${y})]:</strong> <code>FIND-SET(${x}) = FIND-SET(${y}) = ${rx.root}</code>. Já pertencem ao mesmo conjunto!`;
        }
        renderDsu();
        return;
      }

      let winner = ry.root;
      let rankMsg = "";
      if (dsuRank[rx.root] > dsuRank[ry.root]) {
        dsuParent[ry.root] = rx.root;
        winner = rx.root;
        rankMsg = `${rx.root}.posto (${dsuRank[rx.root]}) > ${ry.root}.posto (${dsuRank[ry.root]}) ⟹ ${ry.root}.p = ${rx.root} (postos inalterados).`;
      } else {
        dsuParent[rx.root] = ry.root;
        winner = ry.root;
        if (dsuRank[rx.root] === dsuRank[ry.root]) {
          dsuRank[ry.root]++;
          rankMsg = `Postos iguais! ${rx.root}.p = ${ry.root} e ${ry.root}.posto incrementado para ${dsuRank[ry.root]}.`;
        } else {
          rankMsg = `${rx.root}.posto (${dsuRank[rx.root]}) < ${ry.root}.posto (${dsuRank[ry.root]}) ⟹ ${rx.root}.p = ${ry.root} (postos inalterados).`;
        }
      }
      dsuHighlightedPath = [x, y, rx.root, ry.root];
      if (log) {
        log.innerHTML = `<strong>[UNION(${x}, ${y}) → LINK(${rx.root}, ${ry.root})]:</strong> ${rankMsg} Nova raiz representante: <strong>${winner}</strong>.`;
      }
      renderDsu();
    };

    window.mod10DsuFind = function () {
      const xSel = document.getElementById("dsu-x-sel");
      const log = document.getElementById("dsu-log-box");
      if (!xSel) return;
      const x = xSel.value;
      const beforeDepth = dsuDepth(x);
      const res = dsuFindWithCompress(x);
      dsuTotalOps++;
      dsuHighlightedPath = [...res.compressedNodes, res.root];
      if (log) {
        log.innerHTML = `<strong>[FIND-SET(${x})]:</strong> Representante retornado = <strong>${res.root}</strong>. Profundidade de ${x} antes = ${beforeDepth} → depois = ${dsuDepth(x)}. Nós no caminho que passaram a apontar diretamente para ${res.root}: <code>[${res.compressedNodes.join(", ") || "nenhum (já era raiz)"}]</code>.`;
      }
      renderDsu();
    };

    initDsuSelectors();
    window.mod10DsuReset();

    /* --- Lógica da Bancada #10B: Árvore B (t = 2) & Árvore vEB --- */
    const presetEx1821 = ["F", "S", "Q", "K", "C", "L", "H", "T", "V", "W", "M", "R", "N", "P", "A", "B", "X", "Y", "D", "Z", "E"];
    let presetIdx = 0;
    const T_DEG = 2; // Grau mínimo t = 2 (máx 3 chaves por nó)
    let btreeRoot = { keys: [], children: [], leaf: true };
    let btreeLastEvent = "Árvore B inicializada com B-TREE-CREATE (raiz folha vazia, t = 2, máx 2t - 1 = 3 chaves/nó).";

    function splitChildBTree(x, i) {
      const y = x.children[i];
      const median = y.keys[T_DEG - 1];
      const z = {
        keys: y.keys.slice(T_DEG),
        children: y.leaf ? [] : y.children.slice(T_DEG),
        leaf: y.leaf
      };
      y.keys = y.keys.slice(0, T_DEG - 1);
      if (!y.leaf) {
        y.children = y.children.slice(0, T_DEG);
      }
      x.children.splice(i + 1, 0, z);
      x.keys.splice(i, 0, median);
      return median;
    }

    function insertNonFullBTree(x, k, events) {
      let i = x.keys.length - 1;
      if (x.leaf) {
        if (x.keys.includes(k)) {
          events.push(`Chave '${k}' já presente na folha [${x.keys.join(", ")}].`);
          return;
        }
        x.keys.push(k);
        x.keys.sort();
        events.push(`Inserida '${k}' na folha → [${x.keys.join(", ")}].`);
      } else {
        while (i >= 0 && k < x.keys[i]) i--;
        i++;
        if (x.children[i].keys.length === 2 * T_DEG - 1) {
          const oldKeys = x.children[i].keys.join(", ");
          const med = splitChildBTree(x, i);
          events.push(`Filho cheio [${oldKeys}] dividido preventivamente! Mediana '${med}' subiu para o pai.`);
          if (k > x.keys[i]) i++;
        }
        insertNonFullBTree(x.children[i], k, events);
      }
    }

    function insertBTree(k) {
      const events = [];
      const r = btreeRoot;
      if (r.keys.length === 2 * T_DEG - 1) {
        const oldRootKeys = r.keys.join(", ");
        const s = { keys: [], children: [r], leaf: false };
        btreeRoot = s;
        const med = splitChildBTree(s, 0);
        events.push(`Raiz cheia [${oldRootKeys}] dividida! Mediana '${med}' tornou-se a nova raiz (altura aumentou em +1).`);
        insertNonFullBTree(s, k, events);
      } else {
        insertNonFullBTree(r, k, events);
      }
      btreeLastEvent = events.join(" ");
      renderBTree();
    }

    function renderBTree() {
      const canvas = document.getElementById("btree-canvas");
      if (!canvas) return;
      const levels = [];
      function traverse(node, depth) {
        if (!levels[depth]) levels[depth] = [];
        levels[depth].push(`[${node.keys.join(" | ") || "∅"}]`);
        node.children.forEach((c) => traverse(c, depth + 1));
      }
      traverse(btreeRoot, 0);

      canvas.innerHTML = `
        <div style="margin-bottom:0.5rem;padding:0.45rem 0.65rem;background:#F4EFE4;border-left:3px solid #111;">
          <strong>Última Operação:</strong> ${btreeLastEvent}
        </div>
        ${levels
          .map(
            (lvl, idx) => `
          <div style="margin-bottom:0.35rem;">
            <span style="color:var(--ink-secondary);">Nível ${idx}${idx === 0 ? " (Raiz)" : idx === levels.length - 1 ? " (Folhas)" : ""}:</span>
            <strong>${lvl.join("   ")}</strong>
          </div>
        `
          )
          .join("")}
      `;
    }

    window.mod10BTreeInsertInput = function () {
      const inp = document.getElementById("btree-key-input");
      if (!inp || !inp.value.trim()) return;
      const k = inp.value.trim().toUpperCase();
      insertBTree(k);
    };

    window.mod10BTreeNextPreset = function () {
      if (presetIdx >= presetEx1821.length) {
        btreeLastEvent = "Todas as 21 chaves do Exercício 18.2-1 já foram inseridas!";
        renderBTree();
        return;
      }
      const k = presetEx1821[presetIdx++];
      const inp = document.getElementById("btree-key-input");
      if (inp && presetIdx < presetEx1821.length) {
        inp.value = presetEx1821[presetIdx];
      }
      insertBTree(k);
    };

    window.mod10BTreeReset = function () {
      btreeRoot = { keys: [], children: [], leaf: true };
      presetIdx = 0;
      const inp = document.getElementById("btree-key-input");
      if (inp) inp.value = "F";
      btreeLastEvent = "Árvore B reiniciada (grau mínimo t = 2).";
      renderBTree();
    };

    window.mod10UpdateVeb = function () {
      const uSel = document.getElementById("veb-u-sel");
      const xInp = document.getElementById("veb-x-input");
      const out = document.getElementById("veb-output");
      if (!uSel || !xInp || !out) return;

      const u = parseInt(uSel.value, 10);
      let x = parseInt(xInp.value, 10);
      if (isNaN(x) || x < 0) x = 0;
      if (x >= u) x = u - 1;

      const k = Math.round(Math.log2(u));
      const upperSqrt = Math.pow(2, Math.ceil(k / 2));
      const lowerSqrt = Math.pow(2, Math.floor(k / 2));
      const h = Math.floor(x / lowerSqrt);
      const l = x % lowerSqrt;
      const reconstructed = h * lowerSqrt + l;

      const chain = [];
      let curU = u;
      let curX = x;
      let depth = 0;
      while (curU > 2) {
        const ck = Math.round(Math.log2(curU));
        const cLowSqrt = Math.pow(2, Math.floor(ck / 2));
        const ch = Math.floor(curX / cLowSqrt);
        const cl = curX % cLowSqrt;
        chain.push(`Passo ${++depth}: vEB(${curU}), x=${curX} ⟹ cluster[high=${ch}], novo x = low=${cl} (u'=${cLowSqrt})`);
        curU = cLowSqrt;
        curX = cl;
      }
      chain.push(`Caso Base: vEB(2), x=${curX} (verificação direta em O(1)!)`);

      out.innerHTML = `
        <div style="padding:0.5rem 0.65rem;background:#F4EFE4;border-left:3px solid #111;margin-bottom:0.5rem;">
          <div><strong>Universo:</strong> $u = ${u} = 2^{${k}}$ • $\\uuparrow\\!\\sqrt{u} = ${upperSqrt}$ clusters de tamanho $\\ddownarrow\\!\\sqrt{u} = ${lowerSqrt}$</div>
          <div><strong>Decomposição de $x = ${x}$:</strong> <code>high(${x}) = ⌊${x}/${lowerSqrt}⌋ = ${h}</code> | <code>low(${x}) = ${x} mod ${lowerSqrt} = ${l}</code></div>
          <div><strong>Reconstrução:</strong> <code>index(${h}, ${l}) = ${h}·${lowerSqrt} + ${l} = ${reconstructed}</code></div>
        </div>
        <div><strong>Cadeia de 1 Chamada Recursiva por Nível ($O(\\lg \\lg u)$ = ${depth} passos):</strong></div>
        <ul style="margin:0.3rem 0 0 1.1rem;padding:0;">
          ${chain.map((step) => `<li>${step}</li>`).join("")}
        </ul>
      `;
    };

    renderBTree();
    window.mod10UpdateVeb();
  }

  /* ========================================================================
     SEÇÃO 3: 10 QUIZZES COM GABARITO COMENTADO ALTERNATIVA POR ALTERNATIVA
     ======================================================================== */
  const quizzes = [
    {
      id: "q10-1",
      type: "Múltipla Escolha",
      reference: "Capítulo 18 — Seção 18.1 e Teorema 18.1 (pp. 401–404)",
      question:
        "Considere uma Árvore B não vazia $T$ com $n$ chaves, altura $h$ e grau mínimo $t \\ge 2$. Qual das afirmações abaixo descreve corretamente os limites de chaves por nó e a cota superior de $h$ provada no Teorema 18.1?",
      options: [
        {
          letter: "A",
          text: "Todo nó (incluindo a raiz) deve ter entre t − 1 e 2t − 1 chaves, e a altura satisfaz h ≤ log_t(n).",
          isCorrect: false,
          explanation:
            "Incorreta. A Propriedade 5 (p. 402) estabelece que a raiz é exceção ao limite inferior de t − 1 chaves: se a árvore não é vazia, a raiz pode conter apenas 1 chave (e ter apenas 2 filhos). Além disso, a fórmula exata do Teorema 18.1 é h ≤ log_t((n + 1)/2)."
        },
        {
          letter: "B",
          text: "A raiz tem entre 1 e 2t − 1 chaves, todo nó não raiz tem entre t − 1 e 2t − 1 chaves (e entre t e 2t filhos se for interno), e a altura satisfaz h ≤ log_t((n + 1)/2).",
          isCorrect: true,
          explanation:
            "Correta! Pela Propriedade 5 (p. 402) e pelo Teorema 18.1 (p. 403), como a raiz tem pelo menos 1 chave e 2 filhos, e cada nó interno subsequente tem pelo menos t − 1 chaves e t filhos, o número mínimo de chaves em altura h é n ≥ 1 + (t − 1) ∑_{i=1..h} 2t^{i−1} = 2t^h − 1, donde h ≤ log_t((n + 1)/2)."
        },
        {
          letter: "C",
          text: "Todo nó interno tem exatamente 2t filhos, as folhas podem estar em profundidades diferentes que diferem em no máximo 1, e h ≤ lg(n + 1).",
          isCorrect: false,
          explanation:
            "Incorreta. Pela Propriedade 4 (p. 402), todas as folhas de uma Árvore B têm exatamente a mesma profundidade h, e o número de filhos de um nó interno não raiz varia no intervalo [t, 2t]."
        },
        {
          letter: "D",
          text: "O grau mínimo pode ser t = 1, caso em que os nós têm entre 0 e 1 chave e a árvore degenera em uma lista ligada de altura n.",
          isCorrect: false,
          explanation:
            "Incorreta. Por definição (p. 402 e Exercício 18.1-1), o grau mínimo exige t ≥ 2: se t = 1, o limite inferior seria t − 1 = 0 chaves por nó e o limite superior seria 2t − 1 = 1 chave, o que impediria a divisão de nós e permitiria nós internos sem chaves."
        }
      ]
    },
    {
      id: "q10-2",
      type: "Múltipla Escolha",
      reference: "Capítulo 18 — Seção 18.2: B-TREE-INSERT e B-TREE-SPLIT-CHILD (pp. 406–411)",
      question:
        "Por que o algoritmo B-TREE-INSERT(T, k) consegue inserir uma chave em uma Árvore B percorrendo um único caminho descendente da raiz até uma folha, sem jamais precisar subir de volta na árvore?",
      options: [
        {
          letter: "A",
          text: "Porque uma Árvore B nunca divide nós internos; apenas folhas são divididas, e a chave mediana de uma folha é descartada.",
          isCorrect: false,
          explanation:
            "Incorreta. Nenhuma chave é descartada: a chave mediana y.chave_t sobe para o nó pai x (linha 16 de B-TREE-SPLIT-CHILD), e nós internos cheios também são divididos."
        },
        {
          letter: "B",
          text: "Porque ao descer pela árvore, B-TREE-INSERT e B-TREE-INSERT-NONFULL dividem preventivamente cada nó cheio (com 2t − 1 chaves) encontrado no caminho antes de descer para ele, garantindo que o pai nunca esteja cheio quando um filho precisa ser dividido.",
          isCorrect: true,
          explanation:
            "Correta! Como explicado nas pp. 407–410, ao dividir qualquer nó cheio (2t − 1 chaves) encontrado na descida (incluindo a própria raiz antes de iniciar B-TREE-INSERT-NONFULL), garantimos o invariante de que o nó atual x nunca está cheio, havendo sempre espaço em x para receber a chave mediana de um filho cheio."
        },
        {
          letter: "C",
          text: "Porque a Árvore B cresce adicionando novas folhas abaixo das folhas cheias, aumentando a profundidade apenas do ramo onde ocorreu a inserção.",
          isCorrect: false,
          explanation:
            "Incorreta. Adicionar folhas abaixo de folhas existentes violaria a Propriedade 4 (todas as folhas têm a mesma profundidade). A única maneira de uma Árvore B aumentar de altura é dividindo a raiz (linhas 2–8 de B-TREE-INSERT, p. 408)."
        },
        {
          letter: "D",
          text: "Porque B-TREE-SPLIT-CHILD transfere chaves para um irmão adjacente usando rotações em vez de criar um novo nó.",
          isCorrect: false,
          explanation:
            "Incorreta. B-TREE-SPLIT-CHILD sempre aloca um novo nó z (ALLOCATE-NODE na linha 1) e reparte as 2t − 1 chaves do filho cheio y em t − 1 chaves em y, t − 1 chaves em z e 1 chave mediana que sobe para o pai x."
        }
      ]
    },
    {
      id: "q10-3",
      type: "Verdadeiro ou Falso",
      reference: "Capítulo 18 — Seção 18.3: B-TREE-DELETE (pp. 412–416)",
      question:
        "Julgue a afirmação sobre B-TREE-DELETE(x, k): 'Quando k está em um nó interno x (Caso 2, digamos k = x.chave_i) e ambos os filhos adjacentes y = x.c_i e z = x.c_{i+1} possuem exatamente o número mínimo de chaves (t − 1 chaves cada), o Caso 2c intercala (funde) k e todas as chaves/ponteiros de z dentro de y, produzindo um nó y com 2t − 1 chaves no qual k é então eliminada recursivamente.'",
      options: [
        {
          letter: "V",
          text: "Verdadeiro — essa é exatamente a especificação do Caso 2c de B-TREE-DELETE.",
          isCorrect: true,
          explanation:
            "Correta! Conforme descrito na p. 414 (Caso 2c), quando nem y = x.c_i (Caso 2a) nem z = x.c_{i+1} (Caso 2b) possuem pelo menos t chaves, ambos têm exatamente t − 1 chaves. A fusão de y (t − 1 chaves), k (1 chave) e z (t − 1 chaves) gera um nó com (t − 1) + 1 + (t − 1) = 2t − 1 chaves (cheio, mas válido!), permitindo descer recursivamente para remover k de y mantendo o invariante de pelo menos t chaves."
        },
        {
          letter: "F",
          text: "Falso — no Caso 2c o nó y passaria a ter 2t chaves, violando o limite superior 2t − 1.",
          isCorrect: false,
          explanation:
            "Incorreta. Como ambos y e z possuem t − 1 chaves (e não t chaves), a soma com a chave separadora k é exatamente (t − 1) + 1 + (t − 1) = 2t − 1 chaves, que respeita perfeitamente o limite superior de um nó da Árvore B."
        }
      ]
    },
    {
      id: "q10-4",
      type: "Múltipla Escolha",
      reference: "Capítulo 19 — Seções 19.1 e 19.2: Função Potencial e CONSOLIDATE (pp. 423–433)",
      question:
        "Em um Heap de Fibonacci H, a função potencial é definida por Φ(H) = t(H) + 2m(H), onde t(H) é o número de árvores na lista de raízes e m(H) é o número de nós marcados. Durante FIB-HEAP-EXTRACT-MIN(H), qual é a garantia estrutural pós-execução do procedimento CONSOLIDATE(H) e como t(H) paga pelo custo amortizado?",
      options: [
        {
          letter: "A",
          text: "CONSOLIDATE reduz a lista de raízes a uma única árvore enraizada em H.min, fazendo t(H') = 1.",
          isCorrect: false,
          explanation:
            "Incorreta. CONSOLIDATE só une raízes que possuem o mesmo grau d (enquanto A[d] ≠ NIL). Ao final, pode haver até uma raiz para cada grau possível em 0 .. D(H.n), totalizando até D(H.n) + 1 árvores."
        },
        {
          letter: "B",
          text: "CONSOLIDATE garante que cada raiz na lista de raízes tenha um grau distinto (no máximo D(n) + 1 raízes no total), e cada ligação FIB-HEAP-LINK reduz t(H) em 1, de modo que a queda de potencial −t(H) cancela o trabalho O(t(H)) de varrer e ligar as raízes acumuladas.",
          isCorrect: true,
          explanation:
            "Correta! Nas pp. 429–433, CONSOLIDATE usa o arranjo A[0 .. D(H.n)] para ligar pares de raízes de mesmo grau até que todas as raízes restantes tenham graus distintos (no máximo D(n) + 1 raízes). O custo real O(D(n) + t(H)) somado à variação de potencial ≤ (D(n) + 1) − t(H) resulta em custo amortizado O(D(n)) = O(lg n)."
        },
        {
          letter: "C",
          text: "CONSOLIDATE marca todas as raízes ligadas com y.marca = TRUE, aumentando m(H) para pagar por futuras extrações.",
          isCorrect: false,
          explanation:
            "Incorreta. A linha 3 de FIB-HEAP-LINK(H, y, x) faz exatamente o oposto: y.marca = FALSE, pois sempre que um nó se torna filho de outro nó, sua contagem de filhos perdidos é zerada!"
        },
        {
          letter: "D",
          text: "CONSOLIDATE tem custo real O(1) porque não percorre a lista de raízes.",
          isCorrect: false,
          explanation:
            "Incorreta. O custo real no pior caso de CONSOLIDATE é Θ(D(n) + t(H)), que pode ser Ω(n) se houver Θ(n) raízes acumuladas por inserções prévias; é o custo amortizado que vale O(lg n)."
        }
      ]
    },
    {
      id: "q10-5",
      type: "Múltipla Escolha",
      reference: "Capítulo 19 — Seções 19.3 e 19.4: CASCADING-CUT e Lema 19.4 (pp. 433–440)",
      question:
        "Em um Heap de Fibonacci, por que definimos o coeficiente 2 diante de m(H) na função potencial Φ(H) = t(H) + 2m(H), e qual é a relação fundamental provada no Lema 19.4 entre o grau k de qualquer nó x e o tamanho de sua subárvore?",
      options: [
        {
          letter: "A",
          text: "Porque cada corte em cascata de um nó marcado y o desmarca (reduzindo 2m(H) em 2 unidades): 1 unidade paga pelo trabalho O(1) do próprio corte e 1 unidade compensa o aumento de +1 em t(H) quando y entra na lista de raízes; e a regra de cortar no 2º filho perdido garante tamanho(x) ≥ F_{k+2} ≥ φ^k.",
          isCorrect: true,
          explanation:
            "Correta! Conforme explicado nas pp. 436–440, se CASCADING-CUT realiza c − 1 cortes de nós marcados, t(H) sobe em c e m(H) varia em no máximo −(c − 1) + 1 = 2 − c, dando ΔΦ = c + 2(2 − c) = 4 − c, o que cancela o custo real O(c) e deixa DECREASE-KEY em O(1) amortizado. Pelo Lema 19.1, o i-ésimo filho de x tem grau ≥ i − 2, levando a s_k ≥ 2 + ∑_{i=2..k} s_{i−2} = F_{k+2} ≥ φ^k (Lema 19.4)."
        },
        {
          letter: "B",
          text: "Porque um nó só é cortado quando perde 3 filhos seguidos, garantindo que tamanho(x) ≥ 2^k exatamente como em um heap binomial.",
          isCorrect: false,
          explanation:
            "Incorreta. Um nó não raiz é cortado assim que perde seu segundo filho (quando y.marca já era TRUE), e o limite inferior de tamanho de uma subárvore de grau k é F_{k+2} ≥ φ^k (onde φ ≈ 1,61803), não 2^k."
        },
        {
          letter: "C",
          text: "Porque m(H) conta o número de raízes marcadas na lista de raízes, e tamanho(x) ≥ k².",
          isCorrect: false,
          explanation:
            "Incorreta. Nenhuma raiz em um Heap de Fibonacci jamais está marcada (Exercício 19.3-1), e o tamanho cresce exponencialmente como F_{k+2} ≥ φ^k, o que garante D(n) ≤ ⌊log_φ n⌋."
        },
        {
          letter: "D",
          text: "Porque FIB-HEAP-DECREASE-KEY reconstrói toda a lista de raízes com CONSOLIDATE a cada chamada.",
          isCorrect: false,
          explanation:
            "Incorreta. FIB-HEAP-DECREASE-KEY jamais chama CONSOLIDATE; ele apenas usa CUT e CASCADING-CUT."
        }
      ]
    },
    {
      id: "q10-6",
      type: "Múltipla Escolha",
      reference: "Capítulo 20 — Seções 20.2 e 20.3: proto-vEB vs. vEB (pp. 447–460)",
      question:
        "Qual é a diferença arquitetural decisiva que faz uma Árvore de van Emde Boas vEB(u) alcançar tempo de pior caso O(lg lg u) em todas as operações, enquanto a estrutura preliminar proto-vEB(u) leva Θ(lg u) em MINIMUM e Θ(lg u lg lg u) em SUCCESSOR?",
      options: [
        {
          letter: "A",
          text: "A árvore vEB(u) divide o universo em log u clusters em vez de √u clusters.",
          isCorrect: false,
          explanation:
            "Incorreta. Ambas dividem o universo usando a raiz quadrada (↑√u clusters de tamanho ↓√u)."
        },
        {
          letter: "B",
          text: "A árvore vEB(u) armazena explicitamente V.min e V.max em cada nó e NÃO armazena V.min recursivamente em nenhum cluster (nem no resumo), permitindo consultar mínimo/máximo e inserir em árvore vazia em O(1), reduzindo cada operação a no máximo 1 chamada recursiva: T(u) = T(√u) + O(1) = O(lg lg u).",
          isCorrect: true,
          explanation:
            "Correta! Nas pp. 452–459, armazenar V.min e V.max permite responder MINIMUM e MAXIMUM em O(1) e testar em O(1) se o sucessor/predecessor está no mesmo cluster de x. Além disso, como V.min não é armazenado recursivamente nos clusters, vEB-EMPTY-TREE-INSERT custa O(1), evitando que vEB-TREE-INSERT faça duas chamadas recursivas quando um cluster estava vazio!"
        },
        {
          letter: "C",
          text: "A árvore vEB(u) usa espalhamento perfeito (perfect hashing) sem nenhum arranjo de resumo.",
          isCorrect: false,
          explanation:
            "Incorreta. A árvore vEB(u) padrão do Capítulo 20 mantém um ponteiro V.resumo para uma árvore vEB(↑√u) e um arranjo V.cluster[0 .. ↑√u − 1]."
        },
        {
          letter: "D",
          text: "A árvore vEB(u) armazena tanto V.min quanto V.max fora dos clusters, de modo que uma árvore com 2 elementos possui todos os seus clusters vazios.",
          isCorrect: false,
          explanation:
            "Incorreta. Apenas V.min não é armazenado recursivamente nos clusters! Se a árvore contém 2 ou mais elementos, o elemento V.max (e todos os elementos diferentes de V.min) são armazenados recursivamente em seus respectivos clusters (p. 453)."
        }
      ]
    },
    {
      id: "q10-7",
      type: "Verdadeiro ou Falso",
      reference: "Capítulo 20 — Seção 20.3: Funções high(x), low(x) e index(x, y) (p. 452)",
      question:
        "Julgue a afirmação: 'Em uma árvore vEB(u) com tamanho de universo u = 32 = 2^5 (expoente ímpar), temos ↑√32 = 2^{⌈5/2⌉} = 8 clusters, cada um de tamanho ↓√32 = 2^{⌊5/2⌋} = 4; portanto, para a chave x = 23, vale high(23) = ⌊23/4⌋ = 5 e low(23) = 23 mod 4 = 3.'",
      options: [
        {
          letter: "V",
          text: "Verdadeiro — os cálculos de ↑√u, ↓√u, high(23) e low(23) seguem exatamente as definições da Seção 20.3.",
          isCorrect: true,
          explanation:
            "Correta! Para u = 2^5 = 32, a raiz quadrada superior é ↑√32 = 2^{⌈5/2⌉} = 2^3 = 8 e a raiz quadrada inferior é ↓√32 = 2^{⌊5/2⌋} = 2^2 = 4. Como dividimos sempre por ↓√u = 4, temos high(23) = ⌊23/4⌋ = 5, low(23) = 23 mod 4 = 3 e index(5, 3) = 5 · 4 + 3 = 23."
        },
        {
          letter: "F",
          text: "Falso — árvores vEB só são definidas quando k = lg u é uma potência exata de 2 (u = 2^{2^m}).",
          isCorrect: false,
          explanation:
            "Incorreta. Essa restrição (u = 2^{2^m}) aplicava-se apenas à estrutura didática proto-vEB da Seção 20.2. Na Seção 20.3 (p. 452), o uso de ↑√u e ↓√u generaliza as árvores vEB para qualquer potência de 2, u = 2^k com k ≥ 1."
        }
      ]
    },
    {
      id: "q10-8",
      type: "Múltipla Escolha",
      reference: "Capítulo 21 — Seção 21.2: Teorema 21.1 (pp. 465–468)",
      question:
        "Na representação de conjuntos disjuntos por listas ligadas com a heurística de união ponderada (que sempre anexa a lista menor ao final da lista maior), qual é o tempo de execução no pior caso de uma sequência de m operações MAKE-SET, UNION e FIND-SET, das quais n são operações MAKE-SET?",
      options: [
        {
          letter: "A",
          text: "Θ(m²), pois cada operação UNION ainda pode atualizar Θ(n) ponteiros.",
          isCorrect: false,
          explanation:
            "Incorreta. Embora uma única operação UNION isolada possa atualizar Θ(n) ponteiros (quando une dois conjuntos de tamanho n/2), na análise agregada da sequência inteira o ponteiro de cada elemento x é atualizado no máximo ⌈lg n⌉ vezes!"
        },
        {
          letter: "B",
          text: "O(m + n lg n), pois o ponteiro de retorno para o objeto do conjunto de cada um dos n elementos é atualizado no máximo ⌈lg n⌉ vezes ao longo de todas as operações UNION, já que o conjunto resultante pelo menos dobra de tamanho a cada atualização.",
          isCorrect: true,
          explanation:
            "Correta! Esse é exatamente o Teorema 21.1 (p. 467): após k atualizações do ponteiro de x, o conjunto que contém x possui pelo menos 2^k membros; logo 2^k ≤ n ⟹ k ≤ lg n, totalizando O(n lg n) atualizações de ponteiros em todas as chamadas UNION e O(1) para cada uma das m operações."
        },
        {
          letter: "C",
          text: "O(m α(n)), pois listas ligadas com união ponderada usam compressão de caminho.",
          isCorrect: false,
          explanation:
            "Incorreta. O limite O(m α(n)) pertence às florestas de conjuntos disjuntos (árvores enraizadas) com união por posto e compressão de caminho (Seções 21.3 e 21.4). Na lista ligada, todo elemento já aponta diretamente para o cabeçalho (FIND-SET é O(1)), mas atualizar a lista menor em UNION custa O(n lg n) no total."
        },
        {
          letter: "D",
          text: "O(m lg m) para as operações FIND-SET e O(n) para todas as operações UNION.",
          isCorrect: false,
          explanation:
            "Incorreta. Na representação por listas ligadas, cada FIND-SET leva O(1) e o custo total das atualizações de ponteiros em UNION é limitado por O(n lg n)."
        }
      ]
    },
    {
      id: "q10-9",
      type: "Múltipla Escolha",
      reference: "Capítulo 21 — Seções 21.3 e 21.4: União por Posto e Compressão de Caminho (pp. 469–475)",
      question:
        "Em uma floresta de conjuntos disjuntos com União por Posto (Union by Rank) e Compressão de Caminho (Path Compression), qual das afirmações abaixo sobre o atributo x.posto (rank) é VERDADEIRA?",
      options: [
        {
          letter: "A",
          text: "Sempre que FIND-SET(x) executa compressão de caminho, os valores de posto dos ancestrais de x são recalculados e reduzidos para refletir a nova altura menor da árvore.",
          isCorrect: false,
          explanation:
            "Incorreta. O procedimento FIND-SET (p. 471) altera exclusivamente os ponteiros de pai (x.p = FIND-SET(x.p)) e jamais toca no atributo posto! Por isso, x.posto é um limite superior para a altura de x, e não necessariamente a altura exata após compressões de caminho."
        },
        {
          letter: "B",
          text: "Em LINK(x, y), o posto da raiz vencedora é sempre incrementado em 1, mesmo quando x.posto ≠ y.posto.",
          isCorrect: false,
          explanation:
            "Incorreta. Nas linhas 4–5 de LINK(x, y) (p. 471), y.posto só é incrementado em 1 quando x.posto == y.posto! Se os postos forem diferentes, a raiz de menor posto aponta para a de maior posto e nenhum posto muda."
        },
        {
          letter: "C",
          text: "Para qualquer nó x que não seja raiz (x ≠ x.p), vale estritamente x.posto < x.p.posto; além disso, depois que x deixa de ser uma raiz, o valor de x.posto nunca mais se altera.",
          isCorrect: true,
          explanation:
            "Correta! Esse é exatamente o Lema 21.4 (p. 475): apenas raízes podem ter seu posto incrementado (em LINK quando x.posto == y.posto). Uma vez que x se torna filho de outro nó, x nunca mais volta a ser raiz, logo x.posto permanece congelado para sempre, e qualquer compressão de caminho faz x apontar para um ancestral ainda mais alto, preservando x.posto < x.p.posto."
        },
        {
          letter: "D",
          text: "O posto máximo possível de um nó em uma floresta com n elementos é n − 1.",
          isCorrect: false,
          explanation:
            "Incorreta. Pelo Corolário 21.5 (p. 475), como o posto só sobe em 1 quando unimos duas árvores de mesmo posto k (dobrando o número mínimo de nós para 2^{k+1}), uma árvore de posto k tem pelo menos 2^k nós, logo x.posto ≤ ⌊lg n⌋."
        }
      ]
    },
    {
      id: "q10-10",
      type: "Verdadeiro ou Falso",
      reference: "Capítulo 21 — Seção 21.4: A Função A_k(j) e α(n) (pp. 472–474)",
      question:
        "Julgue a afirmação: 'Pela definição da função A_k(j) na Seção 21.4 (onde A_0(j) = j + 1 e A_k(j) = A_{k−1}^{(j+1)}(j)), temos A_1(1) = 3, A_2(1) = 7, A_3(1) = 2047 e A_4(1) ≫ 10^{80}; consequentemente, α(n) = min{k : A_k(1) ≥ n} satisfaz α(n) ≤ 4 para qualquer tamanho de entrada n ≤ 10^{80}.'",
      options: [
        {
          letter: "V",
          text: "Verdadeiro — esses são exatamente os valores calculados nos Lemas 21.2 e 21.3 e na página 473 do livro.",
          isCorrect: true,
          explanation:
            "Correta! Pelos Lemas 21.2 e 21.3 (p. 473), A_1(j) = 2j + 1 ⟹ A_1(1) = 3; A_2(j) = 2^{j+1}(j + 1) − 1 ⟹ A_2(1) = 7; A_3(1) = A_2(A_2(1)) = A_2(7) = 2^8 · 8 − 1 = 2047; e A_4(1) = A_3(2047) = A_2^{(2048)}(2047) ≫ 2^{2048} ≫ 10^{80}. Por isso, α(n) ≤ 4 para todas as aplicações práticas concebíveis!"
        },
        {
          letter: "F",
          text: "Falso — α(n) é igual ao logaritmo iterado lg* n, que atinge o valor 5 para n = 65.536.",
          isCorrect: false,
          explanation:
            "Incorreta. A função inversa de Ackermann α(n) cresce muitíssimo mais devagar do que o logaritmo iterado lg* n: enquanto lg*(65.536) = 5, para n = 65.536 já temos 2047 < 65.536 ≪ A_4(1), logo α(65.536) = 4 (e continua sendo 4 até A_4(1) ≫ 10^{80})."
        }
      ]
    }
  ];

  /* ========================================================================
     SEÇÃO 4: 8 EXERCÍCIOS E PROBLEMAS CANÔNICOS COM RESOLUÇÃO PASSO A PASSO
     ======================================================================== */
  const exercicios = [
    {
      id: "ex10-1",
      code: "EXERCÍCIO 01 • EXERCÍCIO 18.1-1 E 18.1-3 (PP. 404)",
      reference: "Exercícios 18.1-1 e 18.1-3 (p. 404)",
      title: "Por que não Permitimos Grau Mínimo t = 1 em uma Árvore B e Enumeração de Todas as Árvores 2-3-4 com {1, 2, 3, 4, 5}",
      prompt: `
        <p>Resolva os dois problemas fundamentais da Seção 18.1 sobre a definição formal das Árvores B:</p>
        <ol>
          <li><strong>(a) Exercício 18.1-1:</strong> Por que não permitimos um grau mínimo de $t = 1$ na definição de uma Árvore B?</li>
          <li><strong>(b) Exercício 18.1-3:</strong> Mostre todas as Árvores B legítimas com grau mínimo $t = 2$ (Árvores 2-3-4) que representam o conjunto de chaves $\\{1, 2, 3, 4, 5\\}$.</li>
        </ol>
      `,
      placeholder:
        "Analise o que aconteceria com os limites [t - 1, 2t - 1] e com B-TREE-SPLIT-CHILD se t = 1; depois liste as configurações possíveis para {1, 2, 3, 4, 5} quando t = 2...",
      solution: `
        <h4>(a) Resolução do Exercício 18.1-1: Por que $t \\ge 2$ é obrigatório</h4>
        <p>Pela Propriedade 5 da definição de Árvore B (p. 402), todo nó diferente da raiz deve conter no mínimo $t - 1$ chaves e no máximo $2t - 1$ chaves. Se permitíssemos $t = 1$:</p>
        <ul>
          <li><strong>Limite inferior $t - 1 = 0$:</strong> Nós não raiz poderiam conter $0$ chaves (e apenas $1$ ponteiro de filho), permitindo cadeias degeneradas arbitrariamente longas de nós sem chaves (destruindo o limite logarítmico de altura do Teorema 18.1, onde $\\log_1((n+1)/2)$ sequer está definido!).</li>
          <li><strong>Limite superior $2t - 1 = 1$:</strong> Um nó estaria "cheio" com apenas $1$ chave! Porém, o procedimento <code>B-TREE-SPLIT-CHILD</code> precisa dividir um nó cheio com $2t - 1$ chaves em dois nós com $t - 1$ chaves cada e promover $1$ chave mediana para o pai. Com $t = 1$, uma chave subiria para o pai e os dois filhos resultantes ficariam com $t - 1 = 0$ chaves! Logo, $t \\ge 2$ é o menor inteiro para o qual a divisão produz dois filhos não vazios ($t - 1 \\ge 1$ chave em cada).</li>
        </ul>

        <h4>(b) Resolução do Exercício 18.1-3: Todas as Árvores B ($t = 2$) para $\\{1, 2, 3, 4, 5\\}$</h4>
        <p>Com $t = 2$, cada nó (inclusive folhas) pode ter no máximo $2t - 1 = 3$ chaves, e cada nó não raiz deve ter no mínimo $t - 1 = 1$ chave. Como $n = 5 > 3$, a árvore não cabe em um único nó ($h \\ne 0$). Pelo Teorema 18.1, $h \\le \\log_2(6/2) = \\log_2 3 < 2$, logo <strong>toda Árvore B válida com $5$ chaves e $t = 2$ tem altura exatamente $h = 1$</strong> (uma raiz e um nível de folhas):</p>
        <ol>
          <li><strong>Caso 1: A raiz possui $1$ chave e $2$ folhas filhas</strong> (a soma das chaves nas $2$ folhas é $5 - 1 = 4$, e como cada folha tem entre $1$ e $3$ chaves, as partições de $4$ são $(1, 3)$, $(2, 2)$ e $(3, 1)$):
            <ul>
              <li>Raiz $[2]$, filhos folhas $[1]$ e $[3, 4, 5]$;</li>
              <li>Raiz $[3]$, filhos folhas $[1, 2]$ e $[4, 5]$;</li>
              <li>Raiz $[4]$, filhos folhas $[1, 2, 3]$ e $[5]$.</li>
            </ul>
          </li>
          <li><strong>Caso 2: A raiz possui $2$ chaves e $3$ folhas filhas</strong> (a soma das chaves nas $3$ folhas é $5 - 2 = 3$, e como cada folha tem $\\ge 1$ chave, cada uma das $3$ folhas deve conter exatamente $1$ chave!):
            <ul>
              <li>Raiz $[2, 4]$, filhos folhas $[1]$, $[3]$ e $[5]$.</li>
            </ul>
          </li>
        </ol>
        <p>Portanto, existem exatamente <strong>$4$ Árvores B legítimas</strong> com $t = 2$ para $\\{1, 2, 3, 4, 5\\}$.</p>
      `
    },
    {
      id: "ex10-2",
      code: "EXERCÍCIO 02 • EXERCÍCIO 18.2-1 (P. 411)",
      reference: "Exercício 18.2-1 (p. 411)",
      title: "Rastreamento Completo de B-TREE-INSERT na Sequência ⟨F, S, Q, K, C, L, H, T, V, W, M, R, N, P, A, B, X, Y, D, Z, E⟩ com t = 2",
      prompt: `
        <p>Mostre os resultados da inserção das chaves</p>
        $$\\langle F, S, Q, K, C, L, H, T, V, W, M, R, N, P, A, B, X, Y, D, Z, E \\rangle$$
        <p>em ordem em uma Árvore B inicialmente vazia com grau mínimo $t = 2$. Mostre a configuração da árvore imediatamente antes de cada divisão de nó cheio e a configuração final após todas as $21$ inserções.</p>
      `,
      placeholder:
        "Lembre-se de que com t = 2 um nó está cheio quando possui 2t - 1 = 3 chaves, e que B-TREE-INSERT divide preventivamente qualquer nó com 3 chaves encontrado durante a descida...",
      solution: `
        <h4>Rastreamento Passo a Passo com Divisão Preventiva ($t = 2$, nó cheio $= 3$ chaves)</h4>
        <ol>
          <li><strong>Inserir $F, S, Q$:</strong> A raiz (folha) acumula $[F, Q, S]$ (agora está cheia com $3$ chaves).</li>
          <li><strong>Inserir $K$ (1ª divisão — raiz):</strong> Ao iniciar <code>B-TREE-INSERT(T, K)</code>, a raiz $[F, Q, S]$ está cheia! <code>B-TREE-SPLIT-CHILD</code> sobe a mediana $Q$ para uma nova raiz e cria os filhos $[F]$ e $[S]$. Como $K < Q$, $K$ entra no 1º filho:
            <pre style="margin:0.3rem 0;font-family:var(--font-mono);font-size:0.8rem;">Raiz: [Q]  →  Filhos: [F, K]   [S]</pre>
          </li>
          <li><strong>Inserir $C, L$:</strong> $C < Q$ vai para o 1º filho $\\to [C, F, K]$ (cheio!). Na inserção de $L$ ($L < Q$), ao descer para o 1º filho $[C, F, K]$, vemos que ele está cheio! Dividimos $[C, F, K]$ subindo $F$ para a raiz $[F, Q]$, gerando filhos $[C]$ e $[K]$, e inserimos $L > F$ no filho $[K, L]$:
            <pre style="margin:0.3rem 0;font-family:var(--font-mono);font-size:0.8rem;">Raiz: [F, Q]  →  Filhos: [C]   [K, L]   [S]</pre>
          </li>
          <li><strong>Inserir $H, T, V$:</strong> $H \\in (F, Q)$ vai para $[H, K, L]$ (cheio). $T, V > Q$ vão para $[S, T, V]$ (cheio).</li>
          <li><strong>Inserir $W$:</strong> $W > Q$; ao descer para o 3º filho $[S, T, V]$, ele está cheio! A mediana $T$ sobe para a raiz $[F, Q, T]$ (raiz agora cheia!) e $W$ entra em $[V, W]$:
            <pre style="margin:0.3rem 0;font-family:var(--font-mono);font-size:0.8rem;">Raiz: [F, Q, T]  →  Filhos: [C]   [H, K, L]   [S]   [V, W]</pre>
          </li>
          <li><strong>Inserir $M$ (aumento de altura para $h = 2$):</strong> No início de <code>B-TREE-INSERT(T, M)</code>, a raiz $[F, Q, T]$ está cheia! Ela é dividida em torno de $Q$ (nova raiz $[Q]$, com filhos internos $[F]$ e $[T]$). Em seguida, descendo por $M < Q \\to M > F$, encontramos a folha $[H, K, L]$ cheia! Ela é dividida subindo $K$ para o nó interno $[F, K]$, e $M$ entra em $[L, M]$:
            <pre style="margin:0.3rem 0;font-family:var(--font-mono);font-size:0.8rem;">Nível 0: [Q]
Nível 1: [F, K]              [T]
Nível 2: [C]  [H]  [L, M]    [S]  [V, W]</pre>
          </li>
          <li><strong>Inserir $R, N, P$:</strong> $R$ entra em $[R, S]$; $N$ entra em $[L, M, N]$ (cheia); ao inserir $P$, a folha $[L, M, N]$ é dividida subindo $M$ para $[F, K, M]$ (nó interno agora cheio!) e $P$ entra em $[N, P]$.</li>
          <li><strong>Inserir $A, B$:</strong> Ao inserir $A$ ($A < Q$), o filho interno esquerdo $[F, K, M]$ está cheio ($3$ chaves)! Ele é dividido preventivamente subindo $K$ para a raiz $[K, Q]$ (com filhos internos $[F]$, $[M]$ e $[T]$), e $A$, depois $B$, entram na 1ª folha $[A, B, C]$ (cheia!).</li>
          <li><strong>Inserir $X, Y$:</strong> Entram na última folha $[V, W, X]$ (cheia); ao inserir $Y$, $[V, W, X]$ é dividida subindo $W$ para $[T, W]$, ficando folhas $[V]$ e $[X, Y]$.</li>
          <li><strong>Inserir $D, Z, E$:</strong> Ao inserir $D$ ($D < K, D < F$), a 1ª folha $[A, B, C]$ está cheia! Ela é dividida subindo $B$ para $[B, F]$, e $D$ (depois $E$) entram na folha $[C, D, E]$. Já $Z$ entra na última folha $[X, Y, Z]$.</li>
        </ol>

        <h4>Árvore B Final após as 21 Inserções ($h = 2$)</h4>
        <pre style="margin:0.5rem 0;padding:0.75rem;background:#F4EFE4;border-left:3px solid #111;font-family:var(--font-mono);font-size:0.82rem;">Nível 0 (Raiz):          [ K | Q ]
Nível 1 (Internos):  [ B | F ]        [ M ]          [ T | W ]
Nível 2 (Folhas):  [A] [C,D,E] [H]  [L] [N,P]    [R,S] [V] [X,Y,Z]</pre>
      `
    },
    {
      id: "ex10-3",
      code: "EXERCÍCIO 03 • EXERCÍCIO 19.2-1 (P. 433)",
      reference: "Exercício 19.2-1 (p. 433)",
      title: "Execução de FIB-HEAP-EXTRACT-MIN e Consolidação pelo Arranjo de Graus A[0 .. D(n)]",
      prompt: `
        <p>Explique detalhadamente e trace a execução de <code>FIB-HEAP-EXTRACT-MIN(H)</code> (incluindo o estado do arranjo $A[0 \\dots D(H.n)]$ em <code>CONSOLIDATE</code>) quando $H$ consiste inicialmente em três árvores na lista de raízes:</p>
        <ul>
          <li>Uma árvore $T_1$ de grau $0$ com raiz $24$;</li>
          <li>Uma árvore $T_2$ de grau $1$ com raiz $17$ (cujo único filho é $30$);</li>
          <li>Uma árvore $T_3$ de grau $3$ com raiz mínima $H.\\text{min} = 3$, cujos $3$ filhos são:
            <ul>
              <li>$18$ (grau $2$, com filhos $21$ e $39$, onde $21$ tem filho $52$);</li>
              <li>$52'$ (ou $38$, grau $1$, com filho $41$);</li>
              <li>$37$ (grau $0$, folha).</li>
            </ul>
          </li>
        </ul>
      `,
      placeholder:
        "Mostre (1) a promoção dos 3 filhos da raiz mínima 3 para a lista de raízes, (2) a sequência de ligações FIB-HEAP-LINK à medida que CONSOLIDATE insere cada raiz em A[d], e (3) a nova raiz mínima H.min...",
      solution: `
        <h4>Passo 1: Remoção de $z = H.\\text{min} = 3$ e Promoção de seus Filhos (Linhas 1–6 de <code>FIB-HEAP-EXTRACT-MIN</code>)</h4>
        <p>Os $3$ filhos de $z = 3$ (nós $18$ de grau $2$, $38$ de grau $1$ e $37$ de grau $0$) têm seus ponteiros de pai ajustados para $x.p = \\text{NIL}$ e são adicionados à lista de raízes de $H$, enquanto $z = 3$ é removido. A lista de raízes passa a conter $5$ árvores:</p>
        <ul>
          <li>Raiz $24$ (grau $0$);</li>
          <li>Raiz $17$ (grau $1$, filho $30$);</li>
          <li>Raiz $18$ (grau $2$, filhos $21$ e $39$);</li>
          <li>Raiz $38$ (grau $1$, filho $41$);</li>
          <li>Raiz $37$ (grau $0$).</li>
        </ul>

        <h4>Passo 2: Consolidação por Graus em <code>CONSOLIDATE(H)</code></h4>
        <p>Inicializamos $A[0 \\dots D(n)] = \\text{NIL}$ e processamos cada raiz $w$ da lista de raízes:</p>
        <ol>
          <li><strong>$w = 24$ ($d = 0$):</strong> $A[0] == \\text{NIL} \\implies A[0] = 24$.</li>
          <li><strong>$w = 17$ ($d = 1$):</strong> $A[1] == \\text{NIL} \\implies A[1] = 17$.</li>
          <li><strong>$w = 18$ ($d = 2$):</strong> $A[2] == \\text{NIL} \\implies A[2] = 18$.</li>
          <li><strong>$w = 38$ ($d = 1$):</strong> Colisão em $A[1] = 17$! Como $17 < 38$, chamamos <code>FIB-HEAP-LINK(H, 38, 17)</code>: $38$ torna-se filho de $17$, $38.\\text{marca} = \\text{FALSE}$, $17.\\text{grau}$ sobe para $d = 2$ e $A[1] = \\text{NIL}$.
            <ul>
              <li>Agora para $x = 17$ com $d = 2$, há nova colisão em $A[2] = 18$! Como $17 < 18$, chamamos <code>FIB-HEAP-LINK(H, 18, 17)</code>: $18$ torna-se filho de $17$, $18.\\text{marca} = \\text{FALSE}$, $17.\\text{grau}$ sobe para $d = 3$ e $A[2] = \\text{NIL}$.</li>
              <li>Como $A[3] == \\text{NIL}$, fazemos $A[3] = 17$.</li>
            </ul>
          </li>
          <li><strong>$w = 37$ ($d = 0$):</strong> Colisão em $A[0] = 24$! Como $24 < 37$, chamamos <code>FIB-HEAP-LINK(H, 37, 24)</code>: $37$ torna-se filho de $24$, $24.\\text{grau}$ sobe para $d = 1$ e $A[0] = \\text{NIL}$. Como $A[1] == \\text{NIL}$, fazemos $A[1] = 24$.</li>
        </ol>

        <h4>Passo 3: Reconstrução da Lista de Raízes e Atualização de $H.\\text{min}$ (Linhas 15–23)</h4>
        <p>Varrendo $A[0 \\dots D(n)]$, as únicas entradas não nulas são:</p>
        <ul>
          <li>$A[1] = 24$ (árvore de grau $1$, com filho $37$);</li>
          <li>$A[3] = 17$ (árvore de grau $3$, com filhos $30, 38, 18$).</li>
        </ul>
        <p>O novo ponteiro mínimo passa a ser <strong>$H.\\text{min} = 17$</strong>, e todas as raízes restantes têm graus estritamente distintos ($1$ e $3$).</p>
      `
    },
    {
      id: "ex10-4",
      code: "EXERCÍCIO 04 • EXERCÍCIOS 19.3-1 E 19.3-2 (P. 437)",
      reference: "Exercícios 19.3-1 e 19.3-2 (p. 437)",
      title: "Por que uma Raiz em um Heap de Fibonacci Nunca Está Marcada e Justificativa do Custo Amortizado O(1) de DECREASE-KEY",
      prompt: `
        <p>Suponha que uma raiz $x$ em um Heap de Fibonacci esteja marcada. Responda:</p>
        <ol>
          <li><strong>(a) Exercício 19.3-1:</strong> Explique como $x$ veio a ser uma raiz marcada. Demonstre que o fato de $x$ estar marcada não tem influência na análise (e como os procedimentos do capítulo impedem que raízes fiquem marcadas).</li>
          <li><strong>(b) Exercício 19.3-2:</strong> Justifique o limite amortizado de $O(1)$ para <code>FIB-HEAP-DECREASE-KEY</code> usando o método agregado (como um custo médio por operação ao longo de uma sequência).</li>
        </ol>
      `,
      placeholder:
        "Verifique em quais linhas de código x.marca pode receber TRUE (apenas em CASCADING-CUT quando z = y.p ≠ NIL) e o que acontece quando um nó marcado perde um filho ou é promovido em EXTRACT-MIN...",
      solution: `
        <h4>(a) Resolução do Exercício 19.3-1</h4>
        <p>Nos algoritmos do Capítulo 19, o único lugar onde um nó $y$ recebe $y.\\text{marca} = \\text{TRUE}$ é na linha 4 de <code>CASCADING-CUT(H, y)</code>, que só é executada quando $z = y.p \\ne \\text{NIL}$ (isto é, quando $y$ <strong>não é uma raiz</strong>). Se $y$ for cortado posteriormente por <code>CUT</code>, a linha 4 de <code>CUT</code> define explicitamente $y.\\text{marca} = \\text{FALSE}$. Portanto, a <strong>única maneira</strong> de uma raiz $x$ vir a estar marcada é se $x$ era um nó interno marcado (tendo perdido um filho no passado), nunca perdeu um segundo filho, e então seu pai $z = x.p$ foi removido como o nó mínimo durante <code>FIB-HEAP-EXTRACT-MIN(H)</code> (linhas 3–5, que promovem os filhos de $z$ para a lista de raízes sem alterar $x.\\text{marca}$).</p>
        <p><strong>Por que isso não afeta a análise (nem o comportamento futuro):</strong></p>
        <ul>
          <li>Enquanto $x$ permanecer uma raiz, se um filho de $x$ for cortado em <code>DECREASE-KEY</code>, a chamada <code>CASCADING-CUT(H, x)</code> verifica $z = x.p$ (linha 1) e, como $z == \\text{NIL}$ (linha 2), encerra imediatamente sem inspecionar $x.\\text{marca}$!</li>
          <li>Se $x$ vier a se tornar filho de outra raiz durante um futuro <code>CONSOLIDATE</code>, a linha 3 de <code>FIB-HEAP-LINK</code> define $x.\\text{marca} = \\text{FALSE}$ de qualquer forma.</li>
          <li>Na análise potencial, deixar $x$ marcado em <code>EXTRACT-MIN</code> mantém $\\Delta m(H) \\le 0$ (e se desmarcássemos $x$ ao promovê-lo, $\\Phi(H)$ apenas diminuiria em $2$, melhorando ainda mais o custo amortizado!).</li>
        </ul>

        <h4>(b) Resolução do Exercício 19.3-2: Visão pelo Método Agregado</h4>
        <p>Cada chamada a <code>CUT(H, y, z)</code> dentro de <code>CASCADING-CUT</code> ocorre <strong>exclusivamente</strong> sobre um nó $y$ que estava marcado ($y.\\text{marca} == \\text{TRUE}$) e o desmarca ($y.\\text{marca} = \\text{FALSE}$). Mas quantas vezes nós podem ser marcados ao longo de uma sequência inteira contendo $k$ chamadas a <code>FIB-HEAP-DECREASE-KEY</code>? Cada chamada a <code>FIB-HEAP-DECREASE-KEY</code> marca <strong>no máximo um único nó</strong> (o último ancestral visitado na cadeia de <code>CASCADING-CUT</code>). Portanto, em $k$ chamadas a <code>DECREASE-KEY</code>, no máximo $k$ nós podem ser marcados no total, o que implica que a soma de todos os cortes em cascata ao longo de todas as $k$ operações é no máximo $k$! Somando o corte inicial de $x$ em cada chamada ($k$ cortes iniciais), o número total de execuções de <code>CUT</code> nas $k$ chamadas é no máximo $2k = O(k)$, dando um custo médio (agregado) de $O(k)/k = \\mathbf{O(1)}$ por operação <code>DECREASE-KEY</code>.</p>
      `
    },
    {
      id: "ex10-5",
      code: "EXERCÍCIO 05 • EXERCÍCIOS 20.2-2 E 20.3-1 (PP. 452, 460)",
      reference: "Exercícios 20.2-2 e 20.3-1 (pp. 452, 460)",
      title: "De PROTO-vEB-DELETE à Árvore vEB(u): Por que u.min Não É Armazenado Recursivamente e Operação com Duplicatas",
      prompt: `
        <p>Analise a transição da estrutura <code>proto-vEB</code> para a árvore <code>vEB</code>:</p>
        <ol>
          <li><strong>(a)</strong> Explique matematicamente por que o fato de $V.\\text{min}$ <strong>não</strong> ser armazenado recursivamente dentro de $V.\\text{cluster}[\\text{high}(V.\\text{min})]$ é indispensável para que <code>vEB-TREE-INSERT</code> e <code>vEB-TREE-DELETE</code> executem em $O(\\lg \\lg u)$ no pior caso.</li>
          <li><strong>(b) Exercício 20.3-1:</strong> Para suportar chaves duplicadas, modifique a árvore <code>vEB</code> para suportar um multiconjunto mantendo o tempo $O(\\lg \\lg u)$ para todas as operações.</li>
        </ol>
      `,
      placeholder:
        "Analise as linhas 6-8 de vEB-TREE-INSERT quando um cluster está vazio: se V.min estivesse armazenado recursivamente nos clusters, vEB-EMPTY-TREE-INSERT não seria O(1)...",
      solution: `
        <h4>(a) Por que $V.\\text{min}$ não pode ser armazenado recursivamente no cluster</h4>
        <p>Em <code>vEB-TREE-INSERT(V, x)</code> (linhas 6–9, p. 457), quando o cluster $c = \\text{high}(x)$ para onde $x$ vai está vazio ($V.\\text{cluster}[c].\\text{min} == \\text{NIL}$), precisamos atualizar <strong>duas</strong> subestruturas de tamanho $\\sqrt{u}$:</p>
        <ol>
          <li>Inserir o número do cluster $c = \\text{high}(x)$ na árvore de resumo: <code>vEB-TREE-INSERT(V.resumo, high(x))</code>;</li>
          <li>Inserir a posição interna $\\text{low}(x)$ no cluster vazio: <code>vEB-EMPTY-TREE-INSERT(V.cluster[high(x)], low(x))</code>.</li>
        </ol>
        <p>Se $V.\\text{min}$ fosse armazenado recursivamente dentro dos clusters, então inserir o primeiro elemento em um cluster vazio exigiría descer recursivamente até as folhas de tamanho $u = 2$ daquele cluster, levando $\\Theta(\\lg \\lg u)$ além da chamada recursiva em $V.\\text{resumo}$. Teríamos então <strong>duas chamadas recursivas</strong> de tamanho $\\sqrt{u}$ no pior caso, recaindo na recorrência:</p>
        $$T(u) = 2T(\\sqrt{u}) + O(1) = \\Theta(\\lg u) \\quad \\text{(perdendo o limite } O(\\lg \\lg u)\\text{!)}.$$
        <p>Graças ao fato de $V.\\text{min}$ <em>não</em> ser armazenado recursivamente nos clusters, <code>vEB-EMPTY-TREE-INSERT(V, x)</code> limita-se a fazer $V.\\text{min} = V.\\text{max} = x$ em tempo <strong>$O(1)$</strong>! Analogamente, em <code>vEB-TREE-DELETE(V, x)</code> (linhas 14–17, p. 459), quando removemos $x$ e isso esvazia um cluster, precisamos chamar <code>vEB-TREE-DELETE(V.resumo, high(x))</code>; sabemos que o cluster ficou vazio exatamente porque a remoção de $\\text{low}(x)$ na linha 13 encontrou um cluster de apenas $1$ elemento ($V.\\text{min} == V.\\text{max}$), que foi esvaziado nas linhas 1–2 de <code>vEB-TREE-DELETE</code> em tempo <strong>$O(1)$ sem recursão</strong>!</p>

        <h4>(b) Resolução do Exercício 20.3-1: Suportando Chaves Duplicadas em $O(\\lg \\lg u)$</h4>
        <p>Em cada nó base ($V.u == 2$) ou junto a cada atributo $V.\\text{min}$ (e nos casos base), ou mais simplesmente mantendo em cada nó $V$ uma contagem de multiplicidade $V.\\text{count-min}$ e nos casos base $u = 2$ um par de contadores $V.\\text{count}[0..1]$ (ou mantendo na estrutura um arranjo auxiliar / atributo de multiplicidade asociado a $V.\\text{min}$): de forma ainda mais limpa, como toda chave $x$ presente na árvore (ou é $V.\\text{min}$ de algum único nó na árvore, ou atinge uma folha $u = 2$), basta associar a cada atributo $V.\\text{min}$ uma contagem inteira $V.\\text{min-freq} \\ge 1$ (e na folha $u = 2$ também $V.\\text{max-freq}$ quando $V.\\text{min} \\ne V.\\text{max}$):</p>
        <ul>
          <li>Em <code>vEB-TREE-INSERT(V, x)</code>: se $x == V.\\text{min}$, apenas incremente $V.\\text{min-freq}$ em $1$ e retorne em $O(1)$! Se $x < V.\\text{min}$, troque o par $(x, \\text{freq})$ com $(V.\\text{min}, V.\\text{min-freq})$ e continue descendo.</li>
          <li>Em <code>vEB-TREE-DELETE(V, x)</code>: ao encontrar o nó onde $x == V.\\text{min}$ (ou no caso base $u = 2$), se a frequência for $> 1$, apenas decremente a frequência em $1$ em $O(1)$ sem remover a chave estruturalmente; só execute a remoção estrutural quando a frequência cair de $1$ para $0$. Todas as operações continuam em $O(\\lg \\lg u)$!</li>
        </ul>
      `
    },
    {
      id: "ex10-6",
      code: "EXERCÍCIO 06 • EXERCÍCIOS 21.2-2 E 21.3-1 (PP. 468, 471)",
      reference: "Exercícios 21.2-2 e 21.3-1 (pp. 468, 471)",
      title: "Rastreamento de Floresta de Conjuntos Disjuntos com União por Posto e Compressão de Caminho para 16 Elementos",
      prompt: `
        <p>Considere o programa abaixo (Exercício 21.2-2 / 21.3-1) usando uma <strong>floresta de conjuntos disjuntos</strong> com <strong>união por posto</strong> e <strong>compressão de caminho</strong>:</p>
        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header"><span class="proc-name">EXERCÍCIO 21.3-1</span></div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">for</span> i = 1 <span class="kw">to</span> 16</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">    MAKE-SET(x_i)</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">for</span> i = 1 <span class="kw">to</span> 15 <span class="kw">by</span> 2</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">    UNION(x_i, x_{i+1})</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">for</span> i = 1 <span class="kw">to</span> 13 <span class="kw">by</span> 4</span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content">    UNION(x_i, x_{i+2})</span></div>
            <div class="code-line"><span class="line-num">7</span><span class="line-content">UNION(x_1, x_5)</span></div>
            <div class="code-line"><span class="line-num">8</span><span class="line-content">UNION(x_{11}, x_{13})</span></div>
            <div class="code-line"><span class="line-num">9</span><span class="line-content">UNION(x_1, x_{10})</span></div>
            <div class="code-line"><span class="line-num">10</span><span class="line-content">FIND-SET(x_2)</span></div>
            <div class="code-line"><span class="line-num">11</span><span class="line-content">FIND-SET(x_9)</span></div>
          </div>
        </div>
        <p>Determine os ponteiros de pai $x_i.p$ e os postos $x_i.\\text{posto}$ de todos os $16$ elementos após a linha 9 e depois após as chamadas <code>FIND-SET(x_2)</code> (linha 10) e <code>FIND-SET(x_9)</code> (linha 11).</p>
      `,
      placeholder:
        "Lembre-se de que em LINK(x, y), quando x.posto == y.posto, fazemos x.p = y e incrementamos y.posto em 1...",
      solution: `
        <h4>1. Evolução das Árvores nas Linhas 1 a 9</h4>
        <ul>
          <li><strong>Linhas 1–2 (<code>MAKE-SET</code>):</strong> $16$ árvores unitárias $x_1, \\dots, x_{16}$ com $x_i.p = x_i$ e $x_i.\\text{posto} = 0$.</li>
          <li><strong>Linhas 3–4 (<code>UNION(x_i, x_{i+1})</code> para $i = 1, 3, \\dots, 15$):</strong> Pela linha 3 de <code>LINK(x_i, x_{i+1})</code>, como os postos são iguais ($0 == 0$), $x_i.p = x_{i+1}$ e $x_{i+1}.\\text{posto} = 1$. Obtemos $8$ árvores de posto $1$ enraizadas nos índices pares $x_2, x_4, x_6, x_8, x_{10}, x_{12}, x_{14}, x_{16}$.</li>
          <li><strong>Linhas 5–6 (<code>UNION(x_i, x_{i+2})</code> para $i = 1, 5, 9, 13$):</strong>
            <ul>
              <li>Para $i = 1$: <code>FIND-SET(x_1)</code> retorna $x_2$ (já era filho direto de $x_2$) e <code>FIND-SET(x_3)</code> retorna $x_4$. Então <code>LINK(x_2, x_4)</code> faz $x_2.p = x_4$ e $x_4.\\text{posto} = 2$.</li>
              <li>Analogamente, obtemos $4$ árvores de posto $2$ enraizadas em $x_4$ (com $x_2.p = x_4$), $x_8$ (com $x_6.p = x_8$), $x_{12}$ (com $x_{10}.p = x_{12}$) e $x_{16}$ (com $x_{14}.p = x_{16}$).</li>
            </ul>
          </li>
          <li><strong>Linha 7 (<code>UNION(x_1, x_5)</code>):</strong>
            <ul>
              <li><code>FIND-SET(x_1)</code> segue $x_1 \\to x_2 \\to x_4$, comprimindo $x_1.p = x_4$!</li>
              <li><code>FIND-SET(x_5)</code> segue $x_5 \\to x_6 \\to x_8$, comprimindo $x_5.p = x_8$!</li>
              <li><code>LINK(x_4, x_8)</code> (ambos com posto $2$) faz $x_4.p = x_8$ e $x_8.\\text{posto} = 3$.</li>
            </ul>
          </li>
          <li><strong>Linha 8 (<code>UNION(x_{11}, x_{13})</code>):</strong>
            <ul>
              <li><code>FIND-SET(x_{11})</code> retorna $x_{12}$ (já filho direto) e <code>FIND-SET(x_{13})</code> segue $x_{13} \\to x_{14} \\to x_{16}$, comprimindo $x_{13}.p = x_{16}$!</li>
              <li><code>LINK(x_{12}, x_{16})</code> (ambos com posto $2$) faz $x_{12}.p = x_{16}$ e $x_{16}.\\text{posto} = 3$.</li>
            </ul>
          </li>
          <li><strong>Linha 9 (<code>UNION(x_1, x_{10})</code>):</strong>
            <ul>
              <li><code>FIND-SET(x_1)</code> segue $x_1 \\to x_4 \\to x_8$, comprimindo $x_1.p = x_8$!</li>
              <li><code>FIND-SET(x_{10})</code> segue $x_{10} \\to x_{12} \\to x_{16}$, comprimindo $x_{10}.p = x_{16}$!</li>
              <li><code>LINK(x_8, x_{16})</code> (ambos com posto $3$) faz $x_8.p = x_{16}$ e $x_{16}.\\text{posto} = 4$.</li>
            </ul>
          </li>
        </ul>

        <h4>2. Efeito das Linhas 10 e 11 (<code>FIND-SET(x_2)</code> e <code>FIND-SET(x_9)</code>)</h4>
        <ul>
          <li><strong>Linha 10 (<code>FIND-SET(x_2)</code>):</strong> Antes da chamada, o caminho de $x_2$ até a raiz é $x_2 \\to x_4 \\to x_8 \\to x_{16}$. A compressão de caminho faz <strong>$x_2.p = x_{16}$</strong> e <strong>$x_4.p = x_{16}$</strong> (enquanto $x_8.p = x_{16}$ já valia)! Retorno: $x_{16}$.</li>
          <li><strong>Linha 11 (<code>FIND-SET(x_9)</code>):</strong> Antes da chamada, como $x_{10}.p$ já havia sido comprimido para $x_{16}$ na linha 9, o caminho de $x_9$ até a raiz é $x_9 \\to x_{10} \\to x_{16}$. A compressão de caminho faz <strong>$x_9.p = x_{16}$</strong>! Retorno: $x_{16}$.</li>
        </ul>
      `
    },
    {
      id: "ex10-7",
      code: "EXERCÍCIO 07 • EXERCÍCIO 21.3-3 (P. 471)",
      reference: "Exercício 21.3-3 (p. 471)",
      title: "Implementação Não Recursiva de FIND-SET com Compressão de Caminho em O(1) de Espaço Auxiliar",
      prompt: `
        <p>Dê uma versão <strong>não recursiva</strong> de <code>FIND-SET(x)</code> com compressão de caminho que utilize apenas $O(1)$ de memória auxiliar (sem pilha de recursão).</p>
      `,
      placeholder:
        "Escreva dois laços while: o primeiro para encontrar a raiz r, e o segundo para subir novamente a partir de x redirecionando cada ponteiro .p para r...",
      solution: `
        <h4>Ideia Algorítmica</h4>
        <p>Como <code>FIND-SET</code> é um método de duas passagens, podemos substituir a pilha de chamadas recursivas por dois laços <code>while</code> sequenciais usando apenas duas variáveis locais de ponteiro (<code>r</code> e <code>y</code>):</p>
        <ol>
          <li><strong>1ª Passagem (Localizar a raiz $r$):</strong> Partimos de $r = x$ e avançamos $r = r.p$ enquanto $r \\ne r.p$. Ao terminar, $r$ aponta para a raiz da árvore.</li>
          <li><strong>2ª Passagem (Comprimir o caminho de $x$ até $r$):</strong> Partimos novamente de $y = x$. Enquanto $y \\ne r$, salvamos o pai original em uma variável temporária <code>prox = y.p</code>, redirecionamos <code>y.p = r</code> e avançamos <code>y = prox</code>.</li>
        </ol>

        <h4>Pseudocódigo Completo</h4>
        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header"><span class="proc-name">FIND-SET-ITERATIVE(x)</span></div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">r = x</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">while</span> r ≠ r.p</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">    r = r.p</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">y = x</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">while</span> y ≠ r</span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content">    prox = y.p</span></div>
            <div class="code-line"><span class="line-num">7</span><span class="line-content">    y.p = r</span></div>
            <div class="code-line"><span class="line-num">8</span><span class="line-content">    y = prox</span></div>
            <div class="code-line"><span class="line-num">9</span><span class="line-content"><span class="kw">return</span> r</span></div>
          </div>
        </div>
        <p><strong>Complexidade:</strong> O tempo de execução permanece linear no comprimento do caminho de busca (com o mesmo tempo amortizado $O(\\alpha(n))$), mas o espaço de pilha auxiliar cai de $\\Theta(\\text{profundidade}(x))$ para estritamente <strong>$\\Theta(1)$</strong>.</p>
      `
    },
    {
      id: "ex10-8",
      code: "EXERCÍCIO 08 • PROBLEMA 21-1: MÍNIMO OFF-LINE (PP. 480–481)",
      reference: "Problema 21-1 (pp. 480–481)",
      title: "O Problema do Mínimo Off-line (OFF-LINE-MINIMUM) Resolvido com Florestas de Conjuntos Disjuntos em O(n α(n))",
      prompt: `
        <p>No <strong>problema do mínimo off-line</strong> (Problema 21-1, p. 480), mantemos um conjunto dinâmico $T$ de elementos do domínio $\\{1, 2, \\dots, n\\}$ sob uma sequência $S$ de $n$ chamadas <code>INSERT</code> (cada chave em $\\{1, \\dots, n\\}$ inserida exatamente uma vez) e $m$ chamadas <code>EXTRACT-MIN</code> (representadas por <code>E</code>). Representamos $S$ por $I_1, E, I_2, E, \\dots, I_m, E, I_{m+1}$, colocando as chaves de cada $I_j$ em um conjunto $K_j$, e executamos:</p>
        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header"><span class="proc-name">OFF-LINE-MINIMUM(m, n)</span></div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">for</span> i = 1 <span class="kw">to</span> n</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">    determine j tal que i ∈ K_j</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">    <span class="kw">if</span> j ≠ m + 1</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">        extraído[j] = i</span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content">        seja l o menor valor maior que j para o qual o conjunto K_l existe</span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content">        K_l = K_j ∪ K_l, destruindo K_j</span></div>
            <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">return</span> extraído</span></div>
          </div>
        </div>
        <ol>
          <li><strong>(a)</strong> Para a sequência $4, 8, E, 3, E, 9, 2, 6, E, E, E, 1, 7, E, 5$, preencha o arranjo <code>extraído[1 .. 6]</code>.</li>
          <li><strong>(b)</strong> Demonstre que o arranjo <code>extraído</code> retornado por <code>OFF-LINE-MINIMUM</code> é correto.</li>
          <li><strong>(c)</strong> Descreva como implementar <code>OFF-LINE-MINIMUM</code> eficientemente com uma estrutura de dados de conjuntos disjuntos e dê um limite justo para o tempo de execução no pior caso.</li>
        </ol>
      `,
      placeholder:
        "Resolva (a) simulando a sequência, (b) argumentando sobre em qual EXTRACT-MIN a menor chave restante i = 1, 2, ..., n deve ser extraída, e (c) mantendo os conjuntos K_j em uma lista ligada de representantes...",
      solution: `
        <h4>(a) Simulação da Sequência $4, 8, E, 3, E, 9, 2, 6, E, E, E, 1, 7, E, 5$</h4>
        <p>Os conjuntos iniciais são $K_1 = \\{4, 8\\}$, $K_2 = \\{3\\}$, $K_3 = \\{9, 2, 6\\}$, $K_4 = \\emptyset$, $K_5 = \\emptyset$, $K_6 = \\{1, 7\\}$, $K_7 = \\{5\\}$ (com $m = 6$ chamadas <code>E</code>):</p>
        <ul>
          <li>Na 1ª chamada <code>E</code> (após $4, 8$): extrai $\\min\\{4, 8\\} = \\mathbf{4} \\implies \\text{extraído}[1] = 4$;</li>
          <li>Na 2ª chamada <code>E</code> (após inserir $3$): extrai $\\min\\{8, 3\\} = \\mathbf{3} \\implies \\text{extraído}[2] = 3$;</li>
          <li>Na 3ª chamada <code>E</code> (após inserir $9, 2, 6$): extrai $\\min\\{8, 9, 2, 6\\} = \\mathbf{2} \\implies \\text{extraído}[3] = 2$;</li>
          <li>Na 4ª chamada <code>E</code>: extrai $\\min\\{8, 9, 6\\} = \\mathbf{6} \\implies \\text{extraído}[4] = 6$;</li>
          <li>Na 5ª chamada <code>E</code>: extrai $\\min\\{8, 9\\} = \\mathbf{8} \\implies \\text{extraído}[5] = 8$;</li>
          <li>Na 6ª chamada <code>E</code> (após inserir $1, 7$): extrai $\\min\\{9, 1, 7\\} = \\mathbf{1} \\implies \\text{extraído}[6] = 1$.</li>
        </ul>
        <p>Portanto, <strong>$\\text{extraído}[1 \\dots 6] = \\langle 4, 3, 2, 6, 8, 1 \\rangle$</strong>.</p>

        <h4>(b) Demonstração de Corretude</h4>
        <p>Por indução em $i = 1, 2, \\dots, n$: considere a menor chave $i = 1$. Como $1$ é menor que todas as outras chaves, se $1$ foi inserida no bloco $I_j$ (antes da $j$-ésima chamada <code>EXTRACT-MIN</code>, com $j \\le m$), ela <strong>obrigatoriamente</strong> será o menor elemento presente no conjunto no momento da $j$-ésima chamada <code>EXTRACT-MIN</code>! Logo, $\\text{extraído}[j] = 1$. Uma vez que a $j$-ésima chamada <code>EXTRACT-MIN</code> já foi consumida pela chave $1$, todos os demais elementos que estavam em $K_j$ passam a se comportar exatamente como se tivessem sido inseridos no próximo bloco disponível $K_l$ ($l > j$) cuja chamada <code>EXTRACT-MIN</code> ainda não foi atribuída — o que corresponde exatamente a fundir $K_l = K_j \\cup K_l$ e destruir $K_j$! Aplicando o mesmo raciocínio indutivamente para $i = 2, 3, \\dots, n$, cada chave $i$ é atribuída à primeira chamada <code>EXTRACT-MIN</code> disponível após sua inserção.</p>

        <h4>(c) Implementação com Conjuntos Disjuntos e Complexidade $O(n \\,\\alpha(n))$</h4>
        <ul>
          <li>Representamos cada conjunto não vazio $K_j$ em uma floresta de conjuntos disjuntos (com união por posto e compressão de caminho), associando ao representante de cada conjunto o seu número de lote $j$.</li>
          <li>Mantemos os conjuntos existentes $K_j$ (para $1 \\le j \\le m + 1$, incluindo conjuntos inicialmente vazios como nós sentinela na lista) em uma <strong>lista duplamente ligada ordenada pelo índice $j$</strong>.</li>
          <li>Na linha 2, encontramos $j$ chamando <code>FIND-SET(i)</code> e lendo o número do conjunto de seu representante.</li>
          <li>Na linha 5, como os conjuntos existentes estão em uma lista duplamente ligada, o conjunto $K_l$ (menor $l > j$ existente) é simplesmente o ponteiro <code>next</code> de $K_j$ na lista ligada de conjuntos, encontrado em $O(1)$!</li>
          <li>Na linha 6, chamamos <code>UNION</code> entre os representantes de $K_j$ e $K_l$, atualizamos o número do conjunto do novo representante para $l$ e removemos $K_j$ da lista duplamente ligada em $O(1)$.</li>
          <li><strong>Tempo Total:</strong> Fazemos $n$ chamadas a <code>MAKE-SET</code>, $n$ chamadas a <code>FIND-SET</code> e no máximo $m \\le n$ chamadas a <code>UNION</code>. Pela análise da Seção 21.4 (Teorema 21.14), o tempo total de pior caso é <strong>$O((n + m)\\,\\alpha(n)) = O(n \\,\\alpha(n))$</strong>!</li>
        </ul>
      `
    }
  ];

  window.registerCodexModule(10, {
    revisao,
    unidades,
    initWorkbenches,
    quizzes,
    exercicios
  });
})();
