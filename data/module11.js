/* ==========================================================================
   MÓDULO 11 — ALGORITMOS ELEMENTARES EM GRAFOS (BFS, DFS, SCC) E
   ÁRVORES GERADORAS MÍNIMAS (KRUSKAL E PRIM)
   Capítulos 22 e 23 + Apêndice B (pp. 483–525 e pp. 931–949) — CLRS 3ª Edição
   ========================================================================== */

(function () {
  const revisao = {
    subtitle:
      "Das Estruturas Topológicas Discretas (Grafos e Árvores Livres) às Buscas Sistemáticas em Tempo Linear O(V + E) e à Síntese Gulosa de Árvores Geradoras Mínimas",
    intro:
      "O Módulo 11 inaugura a Parte VI do CLRS (Algoritmos em Grafos), articulando o rigor matemático do Apêndice B (grafos dirigidos e não dirigidos, lema do aperto de mão, isomorfismo e as 6 caracterizações equivalentes de uma árvore livre no Teorema B.2) com os dois pilares algorítmicos mais universais da Ciência da Computação: (1) a exploração sistemática de grafos no Capítulo 22 — Busca em Largura (BFS) por ondas concêntricas de distância mínima e Busca em Profundidade (DFS) com carimbos de tempo parentizados, ordenação topológica em DAGs e decomposição em Componentes Fortemente Conexas (Kosaraju-Sharir) — e (2) a otimização combinatória gulosa no Capítulo 23 para construir Árvores Geradoras Mínimas (MST) via o Teorema da Aresta Segura (Teorema 23.1) e suas duas materializações canônicas: o Algoritmo de Kruskal (baseado em Conjuntos Disjuntos) e o Algoritmo de Prim (baseado em Fila de Prioridade Mínima).",
    pillars: [
      {
        tag: "[ PILAR 01 • APÊNDICE B.4 & B.5 (pp. 939–949) ]",
        title: "Formalismo Matemático de Grafos $G = (V, E)$ e as 6 Equivalências das Árvores Livres (Teorema B.2)",
        body: `
          <p>Todo algoritmo sobre redes apoia-se nas definições da matemática discreta do <strong>Apêndice B</strong>. Um grafo $G = (V, E)$ é um par ordenado formado por um conjunto finito de vértices $V$ e um conjunto de arestas $E$. Em <strong>grafos dirigidos (dígrafos)</strong>, cada aresta é um par ordenado $(u, v) \\in V \\times V$ (admitem-se auto-laços $(u, u)$); em <strong>grafos não dirigidos</strong>, cada aresta é um conjunto não ordenado de dois vértices distintos $\\{u, v\\}$ (denotado também por $(u, v)$ com a convenção $(u, v) = (v, u)$ e sem auto-laços). Pelo <strong>Lema do Cumprimento (Exercício B.4-1)</strong>, como cada aresta não dirigida contribui com duas unidades para a soma dos graus dos vértices, vale invariavelmente $\\sum_{v \\in V} \\text{grau}(v) = 2|E|$.</p>
          <p>Na <strong>Seção B.5</strong>, uma <strong>floresta</strong> é definida como um grafo não dirigido acíclico, e uma <strong>árvore livre</strong> como um grafo não dirigido conexo e acíclico. O <strong>Teorema B.2 (pp. 943–944)</strong> estabelece que, para qualquer grafo não dirigido $G = (V, E)$, seis propriedades estruturais são estritamente equivalentes: (1) $G$ é uma árvore livre; (2) quaisquer dois vértices em $G$ estão ligados por um <em>caminho simples único</em>; (3) $G$ é conexo, mas a remoção de qualquer aresta desconecta $G$ (toda aresta é uma <em>ponte</em>); (4) $G$ é conexo e $|E| = |V| - 1$; (5) $G$ é acíclico e $|E| = |V| - 1$; (6) $G$ é acíclico, mas a adição de qualquer nova aresta cria exatamente um ciclo. Essa identidade $|E| = |V| - 1$ governa tanto as árvores de busca do Capítulo 22 quanto o critério de parada de $|V| - 1$ arestas seguras nas Árvores Geradoras Mínimas do Capítulo 23.</p>
        `
      },
      {
        tag: "[ PILAR 02 • SEÇÃO 22.1 (pp. 483–487) ]",
        title: "Dualidade de Representação: Listas de Adjacências $\\Theta(V + E)$ vs. Matrizes de Adjacências $\\Theta(V^2)$",
        body: `
          <p>Para processar um grafo computacionalmente, a <strong>Seção 22.1</strong> confronta duas estruturas de dados fundamentais. A representação por <strong>Listas de Adjacências</strong> utiliza um arranjo $\\text{Adj}[1 \\dots |V|]$ onde cada entrada $G.\\text{Adj}[u]$ aponta para uma lista ligada contendo todos os vértices $v$ tais que $(u, v) \\in E$. A soma dos comprimentos de todas as listas é $|E|$ em grafos dirigidos e $2|E|$ em grafos não dirigidos; logo, o espaço de memória exigido é $\\Theta(V + E)$ — ótimo e indispensável para <strong>grafos esparsos</strong> ($|E| \\ll |V|^2$). Percorrer todos os vizinhos de todos os vértices por análise agregada custa $\\Theta(V + E)$.</p>
          <p>Em contrapartida, a <strong>Matriz de Adjacências</strong> numera os vértices de $1$ a $|V|$ e aloca uma matriz $A = (a_{ij})$ de dimensão $|V| \\times |V|$ onde $a_{ij} = 1$ (ou $w(i, j)$ em grafos ponderados) se $(i, j) \\in E$, e $0$ (ou $\\text{NIL} / \\infty$) caso contrário. Em grafos não dirigidos, a matriz é simétrica ($A = A^{\\text{T}}$). Embora exija $\\Theta(V^2)$ de espaço independentemente da esparsidade de $E$, ela responde à consulta de existência de uma aresta $(u, v)$ em tempo constante $O(1)$ (contra $O(\\text{grau}(u))$ na lista de adjacências) e é preferida para <strong>grafos densos</strong> ($|E| = \\Theta(V^2)$) ou problemas matriciais específicos (como encontrar um sorvedouro universal em $O(V)$ no Exercício 22.1-6).</p>
        `
      },
      {
        tag: "[ PILAR 03 • SEÇÕES 22.2 A 22.5 (pp. 487–512) ]",
        title: "Busca em Largura (Camadas FIFO $\\delta(s, v)$) vs. Busca em Profundidade (Carimbos $u.d/u.f$, DAGs e SCCs)",
        body: `
          <p>Ambos os algoritmos elementares de busca usam o esquema de <strong>três cores</strong> (<code>BRANCO</code> para não descoberto, <code>CINZA</code> para vértice na fronteira ativa e <code>PRETO</code> para vértice totalmente explorado) e executam em tempo linear $O(V + E)$ ou $\\Theta(V + E)$ sobre listas de adjacências, mas geram topologias radicalmente distintas:</p>
          <ul>
            <li><strong>Busca em Largura (<code>BFS</code>, Seção 22.2):</strong> Gerencia a fronteira cinza com uma <strong>fila FIFO $Q$</strong>, descobrindo todos os vértices à distância $k$ da fonte $s$ antes de qualquer vértice à distância $k+1$ (monotonia de dois níveis na fila, <strong>Lema 22.3</strong>). Pelo <strong>Teorema 22.5</strong>, ao término, $v.d = \\delta(s, v)$ (distância de caminho mínimo em número de arestas) e o subgrafo predecessor $G_\\pi$ forma uma árvore em largura.</li>
            <li><strong>Busca em Profundidade (<code>DFS</code>, Seções 22.3–22.5):</strong> Segue recursivamente (pilha LIFO implícita) o vértice cinza mais recente, atribuindo a cada vértice dois carimbos de tempo inteiros em $\\{1, \\dots, 2|V|\\}$: descoberta $u.d$ e finalização $u.f$. Os intervalos $[u.d, u.f]$ obedecem ao <strong>Teorema dos Parênteses (Teorema 22.7)</strong> e ao <strong>Teorema do Caminho Branco (Teorema 22.9)</strong>, permitindo classificar cada aresta em 4 tipos (Árvore, Retorno, Direta e Cruzada), detectar ciclos (<strong>Lema 22.11</strong>), ordenar topologicamente um DAG pela ordem inversa de $u.f$ (<strong>Teorema 22.12</strong>) e decompor qualquer grafo dirigido em suas <strong>Componentes Fortemente Conexas</strong> com duas passagens de <code>DFS</code> (em $G$ e em $G^{\\text{T}}$, <strong>Teorema 22.16</strong>).</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 04 • CAPÍTULO 23 (pp. 513–525) ]",
        title: "Cortes, Arestas Leves, o Teorema da Aresta Segura (23.1) e a Dualidade Kruskal vs. Prim",
        body: `
          <p>Dado um grafo conexo não dirigido $G = (V, E)$ com pesos reais $w : E \\to \\mathbb{R}$, o problema da <strong>Árvore Geradora Mínima (MST)</strong> busca um subconjunto acíclico $T \\subseteq E$ que conecte todos os vértices minimizando $w(T) = \\sum_{(u,v) \\in T} w(u, v)$. O método <code>GENERIC-MST</code> mantém o invariante de que o conjunto de arestas $A$ é subconjunto de alguma MST, adicionando a cada passo uma <strong>aresta segura</strong>. Pelo <strong>Teorema 23.1 (provado por "recortar e colar")</strong>, se $(S, V - S)$ é qualquer corte que <em>respeita</em> $A$ (nenhuma aresta de $A$ cruza o corte) e $(u, v)$ é uma <strong>aresta leve</strong> (de peso mínimo) cruzando $(S, V - S)$, então $(u, v)$ é segura para $A$.</p>
          <p>Pelo <strong>Corolário 23.2</strong>, os dois algoritmos clássicos especializam a escolha do corte seguro de maneiras complementares: o <strong>Algoritmo de Kruskal (<code>MST-KRUSKAL</code>)</strong> mantém uma floresta $G_A = (V, A)$ usando a estrutura de <strong>Conjuntos Disjuntos</strong> do Capítulo 21, ordena todas as arestas por peso crescente em $O(E \\lg E) = O(E \\lg V)$ e une pares de árvores distintas com a aresta globalmente mais leve disponível; já o <strong>Algoritmo de Prim (<code>MST-PRIM</code>)</strong> faz crescer uma <strong>única árvore</strong> a partir de uma raiz $r$, mantendo os vértices fora da árvore em uma fila de prioridade mínima $Q$ ordenada por $v.\\text{chave}$ (menor peso conectando $v$ à árvore atual), alcançando $O(E \\lg V)$ com Heap Binário e $O(E + V \\lg V)$ com <strong>Heap de Fibonacci</strong>!</p>
        `
      }
    ],
    checklist: [
      "Compreendo a demonstração cíclica (1) ⇒ (2) ⇒ (3) ⇒ (4) ⇒ (5) ⇒ (6) ⇒ (1) do Teorema B.2 (Propriedades das Árvores Livres com |E| = |V| - 1) e o Lema do Cumprimento ∑ grau(v) = 2|E|.",
      "Sei comparar rigorosamente Listas de Adjacências (espaço Θ(V + E), consulta de aresta O(grau(u))) e Matrizes de Adjacências (espaço Θ(V²), consulta O(1)), além de construir o grafo transposto G^T.",
      "Domino a prova de corretude da Busca em Largura (BFS): Lema 22.1 (desigualdade triangular δ(s,v) ≤ δ(s,u) + 1), Lema 22.3 (a fila Q contém no máximo 2 distâncias consecutivas) e Teorema 22.5 (v.d = δ(s,v)).",
      "Sei enunciar e provar o Teorema dos Parênteses (22.7), o Teorema do Caminho Branco (22.9), classificar arestas (T, B, F, C) via intervalos [u.d, u.f], ordenar topologicamente DAGs (Teorema 22.12) e executar Kosaraju-Sharir em G e G^T (Lema 22.14 e Teorema 22.16).",
      "Domino a prova por recortar-e-colar do Teorema 23.1 (Aresta Segura em cortes que respeitam A) e as implementações e complexidades de MST-KRUSKAL (O(E lg V) com Union-Find) e MST-PRIM (O(E lg V) com Heap Binário e O(E + V lg V) com Heap de Fibonacci)."
    ]
  };

  const unidades = [
    /* ======================================================================
       UNIDADE 11.1 — APÊNDICE B.4, B.5 E SEÇÃO 22.1
       ====================================================================== */
    {
      id: "u11-1",
      code: "UNIDADE 11.1 • APÊNDICE B.4–B.5 & CAP. 22.1",
      title: "Fundamentos Matemáticos de Grafos, Árvores Livres (Teorema B.2) e Representações Computacionais de Grafos",
      pages: "pp. 939–949 e pp. 483–487",
      content: `
        <h3>1. O Formalismo Discreto de Grafos Dirigidos e Não Dirigidos (Apêndice B.4, pp. 939–942)</h3>
        <p>Na linguagem matemática da <strong>Seção B.4</strong>, um <strong>grafo</strong> é um par ordenado $G = (V, E)$, onde $V$ é um conjunto finito de <strong>vértices</strong> e $E$ é uma relação binária sobre $V$ cujos elementos são chamados de <strong>arestas</strong>. A distinção estrutural fundamental reside na natureza das arestas em $E$:</p>
        <ul>
          <li><strong>Grafo Dirigido (ou Dígrafo):</strong> O conjunto de arestas $E \\subseteq V \\times V$ consiste em <strong>pares ordenados</strong> de vértices $(u, v)$. Dizemos que a aresta $(u, v)$ <em>sai</em> do vértice $u$ (sua origem) e <em>entra</em> no vértice $v$ (seu destino), e que $v$ é <strong>adjacente a</strong> $u$ (notação $u \\to v$). Um grafo dirigido pode conter <strong>auto-laços</strong> (arestas da forma $(u, u)$).</li>
          <li><strong>Grafo Não Dirigido:</strong> O conjunto de arestas $E$ consiste em <strong>pares não ordenados</strong> de vértices distintos $\\{u, v\\}$ com $u \\neq v$. Por convenção tipográfica no CLRS, escrevemos $(u, v)$ também para arestas não dirigidas, mas tratando $(u, v)$ e $(v, u)$ como <em>a mesma aresta</em>. Em um grafo não dirigido, <strong>auto-laços são proibidos</strong> e a relação de adjacência é simétrica: se $(u, v) \\in E$, então $u$ e $v$ são mutuamente adjacentes e a aresta $(u, v)$ é <strong>incidente</strong> em $u$ e em $v$.</li>
        </ul>

        <div class="canonical-callout definition">
          <span class="callout-tag">[ DEFINIÇÃO FORMAL & LEMA DO CUMPRIMENTO — SEÇÃO B.4 E EXERCÍCIO B.4-1 (pp. 939–942) ]</span>
          <p>Em um grafo não dirigido $G = (V, E)$, o <strong>grau</strong> de um vértice $v$, denotado por $\\text{grau}(v)$, é o número de arestas incidentes em $v$. Um vértice com grau $0$ é chamado de <strong>isolado</strong>. Em um grafo dirigido, o <strong>grau de entrada</strong> $\\text{grau-entrada}(v)$ é o número de arestas que entram em $v$, o <strong>grau de saída</strong> $\\text{grau-saída}(v)$ é o número de arestas que saem de $v$, e $\\text{grau}(v) = \\text{grau-entrada}(v) + \\text{grau-saída}(v)$.</p>
          <p><strong>Lema do Cumprimento (Handshaking Lemma, Exercício B.4-1):</strong> Para qualquer grafo não dirigido $G = (V, E)$, a soma dos graus de todos os vértices é exatamente o dobro do número de arestas (e, portanto, é sempre um número par):</p>
          $$\\sum_{v \\in V} \\text{grau}(v) = 2|E|$$
          <p><em>Demonstração:</em> Cada aresta não dirigida $e = \\{u, v\\} \\in E$ possui exatamente duas extremidades distintas e, portanto, contribui com $+1$ para $\\text{grau}(u)$ e $+1$ para $\\text{grau}(v)$, somando exatamente $2$ à contagem total $\\sum_{v \\in V} \\text{grau}(v)$. Em um grafo dirigido, analogamente, $\\sum_{v \\in V} \\text{grau-saída}(v) = \\sum_{v \\in V} \\text{grau-entrada}(v) = |E|$. $\\blacksquare$</p>
        </div>

        <h4>Caminhos, Ciclos, Conectividade, Subgrafos e Isomorfismo</h4>
        <p>Um <strong>caminho</strong> de comprimento $k \\ge 0$ de um vértice $u$ a um vértice $u'$ em um grafo $G = (V, E)$ é uma sequência de vértices $p = \\langle v_0, v_1, v_2, \\dots, v_k \\rangle$ tal que $u = v_0$, $u' = v_k$ e $(v_{i-1}, v_i) \\in E$ para todo $i = 1, 2, \\dots, k$. O comprimento do caminho é o número de arestas $k$ no caminho. Se existe um caminho $p$ de $u$ a $u'$, dizemos que $u'$ é <strong>alcançável</strong> a partir de $u$ via $p$, denotado por $u \\stackrel{p}{\\leadsto} u'$ (ou simplesmente $u \\leadsto u'$). Um caminho é <strong>simples</strong> se todos os vértices na sequência são distintos.</p>
        <ul>
          <li><strong>Ciclos:</strong> Em um grafo dirigido, um caminho $\\langle v_0, v_1, \\dots, v_k \\rangle$ forma um <strong>ciclo</strong> se $v_0 = v_k$ e o caminho contém pelo menos uma aresta ($k \\ge 1$). O ciclo é <strong>simples</strong> se, além disso, $v_1, v_2, \\dots, v_k$ são todos distintos. Em um grafo não dirigido, um caminho $\\langle v_0, v_1, \\dots, v_k \\rangle$ forma um <strong>ciclo</strong> se $k \\ge 3$, $v_0 = v_k$ e $v_1, v_2, \\dots, v_k$ são distintos (pois percorrer a mesma aresta $(u, v)$ de ida e volta $\\langle u, v, u \\rangle$ com $k=2$ não constitui ciclo em grafos não dirigidos). Um grafo sem ciclos simples é dito <strong>acíclico</strong>.</li>
          <li><strong>Componentes Conexas e Fortemente Conexas:</strong> Um grafo não dirigido é <strong>conexo</strong> se todo par de vértices está conectado por algum caminho. As <strong>componentes conexas</strong> de um grafo não dirigido são as classes de equivalência de vértices sob a relação simétrica, reflexiva e transitiva "é alcançável a partir de" (Exercício B.4-4). Já um grafo dirigido é <strong>fortemente conexo</strong> se cada dois vértices $u, v \\in V$ são alcançáveis um a partir do outro ($u \\leadsto v$ e $v \\leadsto u$); as classes de equivalência sob a relação de alcançabilidade mútua são as <strong>componentes fortemente conexas (SCCs)</strong> do grafo dirigido.</li>
          <li><strong>Subgrafos, Grafos Bipartidos, Completos e Contração:</strong> Dizemos que $G' = (V', E')$ é um <strong>subgrafo</strong> de $G = (V, E)$ se $V' \\subseteq V$ e $E' \\subseteq E$. Dado $V' \\subseteq V$, o <strong>subgrafo de $G$ induzido por $V'$</strong> é $G' = (V', E')$ onde $E' = \\{(u, v) \\in E : u, v \\in V'\\}$. Dois grafos $G = (V, E)$ e $G' = (V', E')$ são <strong>isomorfos</strong> se existe uma bijeção $f : V \\to V'$ tal que $(u, v) \\in E \\iff (f(u), f(v)) \\in E'$. Um grafo não dirigido é <strong>completo</strong> ($K_n$) se todo par de vértices distintos é adjacente ($|E| = \\binom{|V|}{2} = |V|(|V|-1)/2$), e é <strong>bipartido</strong> se $V$ pode ser particionado em $V_1 \\cup V_2$ disjuntos tais que toda aresta tem uma extremidade em $V_1$ e outra em $V_2$ (equivalentemente, pelo Problema B-1, $G$ é 2-colorível $\\iff$ $G$ não contém ciclos de comprimento ímpar). A <strong>contração</strong> de um grafo não dirigido por uma aresta $e = (u, v)$ funde $u$ e $v$ em um único supervértice $x$, removendo $(u, v)$ e redirecionando as demais adjacências de $u$ e $v$ para $x$.</li>
        </ul>

        <h3>2. Árvores Livres e a Demonstração Completa do Teorema B.2 (Apêndice B.5, pp. 942–949)</h3>
        <p>Na <strong>Seção B.5.1</strong>, um grafo não dirigido acíclico é denominado uma <strong>floresta</strong>, e um grafo não dirigido conexo e acíclico é denominado uma <strong>árvore livre</strong> (ou simplesmente <strong>árvore</strong>). O teorema central de toda a teoria algorítmica de árvores é o <strong>Teorema B.2</strong>:</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA B.2 — AS 6 CARACTERIZAÇÕES EQUIVALENTES DE UMA ÁRVORE LIVRE (pp. 943–944) ]</span>
          <p>Seja $G = (V, E)$ um grafo não dirigido sobre $n = |V| \\ge 1$ vértices. As seis afirmativas a seguir são equivalentes:</p>
          <ol>
            <li>$G$ é uma <strong>árvore livre</strong> (isto é, $G$ é conexo e acíclico).</li>
            <li>Quaisquer dois vértices em $G$ estão ligados por um <strong>caminho simples único</strong>.</li>
            <li>$G$ é <strong>conexo</strong>, mas, se qualquer aresta for eliminada de $E$, o grafo resultante é desconexo (minimalmente conexo).</li>
            <li>$G$ é <strong>conexo</strong> e $|E| = |V| - 1$.</li>
            <li>$G$ é <strong>acíclico</strong> e $|E| = |V| - 1$.</li>
            <li>$G$ é <strong>acíclico</strong>, mas, se qualquer aresta (entre vértices não adjacentes) for adicionada a $E$, o grafo resultante contém um ciclo (maximalmente acíclico).</li>
          </ol>
          <p><strong>Demonstração Completa por Cadeia de Implicações Cíclicas (CLRS, pp. 943–944):</strong></p>
          <ul>
            <li><strong>(1) $\\Rightarrow$ (2):</strong> Como $G$ é uma árvore livre, $G$ é conexo; logo, quaisquer dois vértices $u, v \\in V$ estão ligados por pelo menos um caminho simples. Suponha, por contradição, que $u$ e $v$ estejam ligados por dois caminhos simples distintos $p_1$ e $p_2$ (Figura B.5). Seja $w$ o primeiro vértice em que $p_1$ e $p_2$ divergem (isto é, o sucessor de $w$ em $p_1$ é $x$, o sucessor em $p_2$ é $y$, e $x \\neq y$), e seja $z$ o primeiro vértice após $w$ em que $p_1$ e $p_2$ reconvergem. Os subcaminhos $p'$ (de $w$ a $z$ passando por $x$ ao longo de $p_1$) e $p''$ (de $w$ a $z$ passando por $y$ ao longo de $p_2$) compartilham apenas suas extremidades $w$ e $z$. Assim, concatenar $p'$ com o inverso de $p''$ forma um ciclo simples em $G$, contradizendo a hipótese de que $G$ é acíclico. Logo, o caminho simples entre $u$ e $v$ é único.</li>
            <li><strong>(2) $\\Rightarrow$ (3):</strong> Se quaisquer dois vértices estão ligados por um caminho simples único, $G$ é conexo. Seja $(u, v) \\in E$ uma aresta arbitrária. A própria aresta $(u, v)$ é um caminho simples de comprimento $1$ entre $u$ e $v$ e, por (2), é o <em>único</em> caminho simples entre $u$ e $v$. Se removermos $(u, v)$ de $E$, não restará nenhum caminho entre $u$ e $v$, tornando o grafo desconexo.</li>
            <li><strong>(3) $\\Rightarrow$ (4):</strong> Por hipótese, $G$ é conexo, o que exige $|E| \\ge |V| - 1$ (Exercício B.4-3). Provamos $|E| \\le |V| - 1$ por indução em $n = |V|$. Para $n = 1$ ou $n = 2$, um grafo que satisfaz (3) possui $0$ ou $1$ aresta, logo $|E| = n - 1$. Para $n \\ge 3$, suponha que todo grafo com menos de $n$ vértices satisfazendo (3) obedeça a $|E| \\le |V| - 1$. Remover uma aresta arbitrária de $G$ divide-o em $k \\ge 2$ componentes conexas $(V_i, E_i)$ (na verdade $k = 2$). Cada componente deve satisfazer (3) (caso contrário, a remoção de uma aresta redundante dentro de $E_i$ não desconectaria $G$). Pela hipótese indutiva, $|E_i| \\le |V_i| - 1$. Somando sobre todas as $k \\ge 2$ componentes, o número de arestas restantes é $\\sum_{i=1}^k |E_i| \\le |V| - k \\le |V| - 2$. Devolvendo a aresta removida, obtemos $|E| \\le |V| - 1$. Combinando com $|E| \\ge |V| - 1$, segue que $|E| = |V| - 1$.</li>
            <li><strong>(4) $\\Rightarrow$ (5):</strong> Suponha que $G$ seja conexo e $|E| = |V| - 1$. Provaremos por contradição que $G$ é acíclico. Suponha que $G$ contenha um ciclo simples $G_k = (V_k, E_k)$ de $k$ vértices; então $|V_k| = |E_k| = k$. Se $k < |V|$, como $G$ é conexo, existe algum vértice $v_{k+1} \\in V - V_k$ adjacente a algum $v_i \\in V_k$. Adicionando $v_{k+1}$ e a aresta $(v_i, v_{k+1})$, obtemos um subgrafo $G_{k+1}$ com $|V_{k+1}| = |E_{k+1}| = k + 1$. Repetindo esse processo indutivamente até esgotar todos os vértices de $V$, obtemos um subgrafo gerador $G_n = (V, E_n)$ com $|E_n| = |V|$. Como $E_n \\subseteq E$, segue que $|E| \\ge |E_n| = |V|$, contradizendo $|E| = |V| - 1$.</li>
            <li><strong>(5) $\\Rightarrow$ (6):</strong> Suponha que $G$ seja acíclico e $|E| = |V| - 1$. Seja $k$ o número de componentes conexas de $G$. Cada componente conexa $(V_i, E_i)$ é conexa e acíclica (logo é uma árvore livre satisfazendo (1), que já provamos implicar (4): $|E_i| = |V_i| - 1$). Assim, $|E| = \\sum_{i=1}^k (|V_i| - 1) = |V| - k$. Como por hipótese $|E| = |V| - 1$, temos obrigatoriamente $k = 1$, de modo que $G$ é conexo e satisfaz (1) e (2). Como já existe um caminho simples único entre quaisquer $u, v \\in V$, adicionar uma nova aresta $(u, v)$ fecha um ciclo simples.</li>
            <li><strong>(6) $\\Rightarrow$ (1):</strong> Suponha que $G$ seja acíclico, mas que adicionar qualquer aresta entre vértices não adjacentes crie um ciclo. Para mostrar que $G$ é uma árvore livre (1), basta provar que $G$ é conexo. Sejam $u, v \\in V$ arbitrários. Se $(u, v) \\in E$, já estão conectados. Se $(u, v) \\notin E$, adicionar a aresta $(u, v)$ cria um ciclo simples em que todas as demais arestas pertencem a $G$; removendo $(u, v)$ desse ciclo, obtemos um caminho simples de $u$ a $v$ inteiramente contido em $G$. Portanto, $G$ é conexo e acíclico. $\\blacksquare$</li>
          </ul>
        </div>

        <p>Nas <strong>Seções B.5.2 e B.5.3 (pp. 945–948)</strong>, o CLRS distingue uma <strong>árvore enraizada</strong> (uma árvore livre na qual um nó distinto $r$ é escolhido como raiz, definindo relações de ancestral/descendente, pai/filho, folhas, <em>profundidade</em> de um nó $x$ como o comprimento do caminho de $r$ a $x$, e <em>altura</em> como o maior caminho descendente até uma folha) de uma <strong>árvore binária</strong> (definida recursivamente como vazia ou formada por uma raiz, uma subárvore esquerda e uma subárvore direita disjuntas, onde um filho único à esquerda difere posicionalmente de um filho único à direita). Em uma <strong>árvore $k$-ária completa</strong> de altura $h$, todas as folhas estão na profundidade $h$, há exatamente $k^h$ folhas e $(k^h - 1)/(k - 1)$ nós internos (no caso binário $k=2$, há $2^h$ folhas e $2^h - 1$ nós internos).</p>

        <h3>3. Representações Computacionais de Grafos (Seção 22.1, pp. 483–487)</h3>
        <p>No <strong>Capítulo 22</strong>, adotamos duas convenções universais do CLRS: (1) dentro de notações assintóticas como $O(V + E)$ ou $\\Theta(V^2)$, os símbolos $V$ e $E$ denotam as cardinalidades $|V|$ e $|E|$; (2) em pseudocódigo, os conjuntos de vértices e arestas são atributos $G.V$ e $G.E$. Para representar um grafo $G = (V, E)$ na memória, dispomos de dois métodos canônicos:</p>

        <div class="canonical-table-wrap">
          <table class="canonical-table">
            <thead>
              <tr>
                <th>Critério / Operação</th>
                <th>Listas de Adjacências (<code>G.Adj[u]</code>)</th>
                <th>Matriz de Adjacências ($A = (a_{ij})$ de $|V| \\times |V|$)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Espaço de Memória</strong></td>
                <td>$\\Theta(V + E)$ — ótimo para <strong>grafos esparsos</strong> ($|E| \\ll |V|^2$).</td>
                <td>$\\Theta(V^2)$ — independente de $|E|$; indicado para <strong>grafos densos</strong> ($|E| \\approx |V|^2$) ou grafos pequenos (1 bit por entrada se não ponderado).</td>
              </tr>
              <tr>
                <td><strong>Soma dos Tamanhos / Simetria</strong></td>
                <td>Dirigido: $\\sum_{u \\in V} |\\text{Adj}[u]| = |E|$.<br>Não dirigido: $\\sum_{u \\in V} |\\text{Adj}[u]| = 2|E|$.</td>
                <td>Dirigido: $a_{ij} = 1 \\iff (i, j) \\in E$.<br>Não dirigido: matriz simétrica $A = A^{\\text{T}}$ ($a_{ij} = a_{ji}$).</td>
              </tr>
              <tr>
                <td><strong>Testar se $(u, v) \\in E$</strong></td>
                <td>$O(1 + \\text{grau-saída}(u))$ — requer busca linear de $v$ em $\\text{Adj}[u]$ (pode ser reduzido com hash/BST, Ex. 22.1-8).</td>
                <td>$\\Theta(1)$ — acesso direto indexado à célula $A[u, v]$.</td>
              </tr>
              <tr>
                <td><strong>Listar vizinhos de $u$</strong></td>
                <td>$\\Theta(1 + \\text{grau-saída}(u))$ — varre apenas os vizinhos reais.</td>
                <td>$\\Theta(V)$ — precisa varrer toda a linha $u$ de comprimento $|V|$.</td>
              </tr>
              <tr>
                <td><strong>Varrer todo o grafo</strong></td>
                <td>$\\Theta(V + E)$ (tempo linear no tamanho da entrada).</td>
                <td>$\\Theta(V^2)$.</td>
              </tr>
              <tr>
                <td><strong>Grafos Ponderados $w(u, v)$</strong></td>
                <td>Armazena o peso $w(u, v)$ junto com o nó $v$ na lista $\\text{Adj}[u]$.</td>
                <td>Armazena $a_{uv} = w(u, v)$ se $(u, v) \\in E$, e $\\text{NIL}$, $0$ ou $\\infty$ se $(u, v) \\notin E$.</td>
              </tr>
              <tr>
                <td><strong>Calcular Transposto $G^{\\text{T}}$ (Ex. 22.1-3)</strong></td>
                <td>$\\Theta(V + E)$ — varre cada $v \\in G.\\text{Adj}[u]$ e insere $u$ em $G^{\\text{T}}.\\text{Adj}[v]$.</td>
                <td>$\\Theta(V^2)$ — transpõe a matriz trocando $a_{ij} \\leftrightarrow a_{ji}$ para $i < j$.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>Abaixo, explore a <strong>Bancada Interativa Dupla do Módulo 11</strong>: no Modo 1, execute passo a passo a <strong>Busca em Largura (<code>BFS</code>)</strong> e a <strong>Busca em Profundidade (<code>DFS</code>)</strong> inspecionando a fila FIFO $Q$, as cores <code>BRANCO / CINZA / PRETO</code>, os carimbos de tempo $u.d / u.f$, a expressão de parênteses do Teorema 22.7 e a classificação de todas as arestas; no Modo 2, compare lado a lado o <strong>Algoritmo de Kruskal (<code>MST-KRUSKAL</code>)</strong> e o <strong>Algoritmo de Prim (<code>MST-PRIM</code>)</strong> construindo a Árvore Geradora Mínima passo a passo!</p>

        <div id="workbench-mod11-mount"></div>
      `
    },

    /* ======================================================================
       UNIDADE 11.2 — SEÇÃO 22.2: BUSCA EM LARGURA (BFS E PRINT-PATH)
       ====================================================================== */
    {
      id: "u11-2",
      code: "UNIDADE 11.2 • CAPÍTULO 22.2",
      title: "22.2 Busca em Largura (BFS), Monotonia da Fila Q, Caminhos Mínimos e Árvores em Largura",
      pages: "pp. 487–495",
      content: `
        <h3>1. A Mecânica de Ondas Concêntricas e o Esquema de 3 Cores</h3>
        <p>A <strong>Busca em Largura (Breadth-First Search — <code>BFS</code>)</strong> é o arquétipo dos algoritmos de propagação por fronteira em grafos (inspirando diretamente o algoritmo de Prim na Seção 23.2 e o algoritmo de Dijkstra na Seção 24.3). Dado um grafo $G = (V, E)$ (dirigido ou não dirigido) representado por listas de adjacências e um vértice <strong>fonte</strong> $s \\in V$, o procedimento <code>BFS(G, s)</code> explora sistematicamente as arestas de $G$ para descobrir todos os vértices alcançáveis a partir de $s$, calculando a distância (menor número de arestas) de $s$ até cada vértice e construindo uma <strong>árvore de busca em largura</strong> enraizada em $s$.</p>
        <p>O algoritmo recebe esse nome porque expande a fronteira entre vértices descobertos e não descobertos uniformemente: <strong>ele descobre todos os vértices à distância $k$ de $s$ antes de descobrir quaisquer vértices à distância $k + 1$</strong>. Para rastrear o estado de cada vértice $u \\in V$, <code>BFS</code> mantém três atributos por vértice:</p>
        <ul>
          <li><code>u.cor</code> $\\in \\{\\text{BRANCO}, \\text{CINZENTO}, \\text{PRETO}\\}$: todos os vértices iniciam <code>BRANCO</code> (não descobertos). Na primeira vez em que um vértice é encontrado durante a varredura de uma lista de adjacências, ele é dito <em>descoberto</em> e torna-se <code>CINZENTO</code>. Quando toda a lista de adjacências de $u$ tiver sido inteiramente examinada, $u$ torna-se <code>PRETO</code>. Assim, os vértices <code>CINZENTOS</code> formam exatamente a <strong>fronteira ativa</strong> entre os vértices <code>PRETOS</code> (já totalmente explorados) e os vértices <code>BRANCOS</code> (ainda não descobertos): todo vértice adjacente a um vértice preto já foi descoberto (logo é cinzento ou preto).</li>
          <li><code>u.d</code>: armazena a distância calculada desde a fonte $s$ até $u$ (inicializada com $\\infty$ para $u \\neq s$ e $0$ para $s$).</li>
          <li><code>u.π</code>: armazena o predecessor (pai) de $u$ na árvore de busca em largura (inicializado com $\\text{NIL}$). Como um vértice é descoberto no máximo uma vez, ele possui no máximo um pai.</li>
        </ul>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">BFS(G, s) — Busca em Largura (CLRS, p. 488)</span>
              <span>[ COMPLEXIDADE: O(V + E) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">para cada</span> vértice u ∈ G.V - {s}</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">   u.cor = BRANCO</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   u.d = ∞</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   u.π = NIL</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">s.cor = CINZENTO</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">s.d = 0</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">s.π = NIL</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">Q = ∅</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">ENQUEUE(Q, s)</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content"><span class="kw">enquanto</span> Q ≠ ∅</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">  u = DEQUEUE(Q)</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">  <span class="kw">para cada</span> v ∈ G.Adj[u]</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">      <span class="kw">se</span> v.cor == BRANCO</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">          v.cor = CINZENTO</span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content">          v.d = u.d + 1</span></div>
              <div class="code-line"><span class="line-num">16</span><span class="line-content">          v.π = u</span></div>
              <div class="code-line"><span class="line-num">17</span><span class="line-content">          ENQUEUE(Q, v)</span></div>
              <div class="code-line"><span class="line-num">18</span><span class="line-content">  u.cor = PRETO</span></div>
            </div>
          </div>

        <h4>Invariante de Laço e Análise Agregada do Tempo de Execução $O(V + E)$</h4>
        <p>O laço <code>enquanto</code> das linhas 10–18 preserva o seguinte invariante: <em>no momento em que o teste na linha 10 é executado, a fila FIFO $Q$ consiste exatamente no conjunto de todos os vértices <code>CINZENTOS</code></em>. Sempre que um vértice branco $v$ é descoberto na linha 13, ele é pintado de cinzento (linha 14) e imediatamente enfileirado (linha 17); e sempre que um vértice $u$ é desenfileirado (linha 11), sua lista de adjacências é varrida e ele é pintado de preto (linha 18).</p>
        <p>Pela <strong>análise agregada</strong> (Seção 17.1), após a inicialização nas linhas 1–4 que custa $O(V)$, nenhum vértice jamais volta a ser pintado de <code>BRANCO</code>. O teste <code>se v.cor == BRANCO</code> na linha 13 garante que cada vértice $v \\in V$ seja enfileirado no máximo uma vez e, portanto, desenfileirado no máximo uma vez. Como cada operação <code>ENQUEUE</code> e <code>DEQUEUE</code> leva tempo $O(1)$, o tempo total gasto em operações de fila é $O(V)$. Além disso, a lista de adjacências $G.\\text{Adj}[u]$ de um vértice $u$ só é percorrida quando $u$ é desenfileirado (no máximo uma vez por vértice). Como a soma dos comprimentos de todas as listas de adjacências é $\\Theta(E)$, o laço <code>para</code> das linhas 12–17 gasta tempo total $O(E)$. Portanto, o tempo total de execução de <code>BFS(G, s)</code> é <strong>$O(V + E)$</strong> — tempo linear em relação ao tamanho da representação por lista de adjacências de $G$.</p>

        <h3>2. Demonstração Rigorosa de Corretude: Lemas 22.1, 22.2, 22.3 e Teorema 22.5 (pp. 489–492)</h3>
        <p>Definimos a <strong>distância de caminho mínimo</strong> $\\delta(s, v)$ de $s$ a $v$ como o número mínimo de arestas em qualquer caminho do vértice $s$ ao vértice $v$ em $G$; se não existe caminho de $s$ a $v$, definimos $\\delta(s, v) = \\infty$. Um caminho de $s$ a $v$ de comprimento $\\delta(s, v)$ é denominado um <strong>caminho mínimo</strong>. Para provar que <code>BFS</code> calcula exatamente $v.d = \\delta(s, v)$ para todo $v \\in V$, o CLRS encadeia três lemas fundamentais:</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ LEMAS 22.1, 22.2, 22.3 E COROLÁRIO 22.4 — PROPRIEDADES DE DISTÂNCIA E DA FILA Q (pp. 490–491) ]</span>
          <ul>
            <li><strong>Lema 22.1 (Desigualdade Triangular de Aresta):</strong> Seja $G = (V, E)$ um grafo dirigido ou não dirigido e seja $s \\in V$ um vértice arbitrário. Então, para qualquer aresta $(u, v) \\in E$, temos $\\delta(s, v) \\le \\delta(s, u) + 1$.<br>
            <em>Prova:</em> Se $u$ é alcançável a partir de $s$, então $v$ também o é, e o caminho mínimo de $s$ a $v$ não pode ser mais longo que um caminho mínimo de $s$ a $u$ seguido pela aresta $(u, v)$, logo $\\delta(s, v) \\le \\delta(s, u) + 1$. Se $u$ não é alcançável de $s$, então $\\delta(s, u) = \\infty$ e a desigualdade vale trivialmente. $\\blacksquare$</li>
            <li><strong>Lema 22.2 (Cota Superior $v.d \\ge \\delta(s, v)$):</strong> Quando <code>BFS(G, s)</code> termina, para cada vértice $v \\in V$, o valor $v.d$ calculado satisfaz $v.d \\ge \\delta(s, v)$.<br>
            <em>Prova por indução no número de operações <code>ENQUEUE</code>:</em> Na base (após enfileirar $s$ na linha 9), $s.d = 0 = \\delta(s, s)$ e $v.d = \\infty \\ge \\delta(s, v)$ para $v \\neq s$. No passo indutivo, quando um vértice branco $v$ é descoberto a partir de $u$, pela hipótese indutiva $u.d \\ge \\delta(s, u)$. Pela linha 15 e pelo Lema 22.1, $v.d = u.d + 1 \\ge \\delta(s, u) + 1 \\ge \\delta(s, v)$. Como $v$ é pintado de cinzento e nunca mais é re-enfileirado, $v.d$ jamais muda novamente. $\\blacksquare$</li>
            <li><strong>Lema 22.3 (Monotonia de Dois Níveis da Fila $Q$):</strong> Suponha que, durante a execução de <code>BFS</code>, a fila $Q$ contenha os vértices $\\langle v_1, v_2, \\dots, v_r \\rangle$, onde $v_1$ é o início (cabeça) de $Q$ e $v_r$ é o final (cauda). Então:
            $$v_r.d \\le v_1.d + 1 \\quad \\text{e} \\quad v_i.d \\le v_{i+1}.d \\text{ para } i = 1, 2, \\dots, r-1.$$
            <em>Prova por indução nas operações de fila:</em> Inicialmente $Q = \\langle s \\rangle$ e o lema vale trivialmente. (i) Em um <code>DEQUEUE</code> de $v_1$, $v_2$ torna-se o novo início; como pela hipótese indutiva $v_1.d \\le v_2.d$, temos $v_r.d \\le v_1.d + 1 \\le v_2.d + 1$, preservando todas as desigualdades. (ii) Em um <code>ENQUEUE</code> de $v$ (que se torna $v_{r+1}$) na linha 17, o vértice $u$ cuja lista de adjacências está sendo varrida já foi removido de $Q$ na linha 11; pela hipótese indutiva aplicada antes de remover $u$, o novo início $v_1$ satisfaz $v_1.d \\ge u.d$, logo $v_{r+1}.d = u.d + 1 \\le v_1.d + 1$. Além disso, a antiga cauda $v_r$ satisfazia $v_r.d \\le u.d + 1 = v_{r+1}.d$. Portanto, a fila contém sempre no máximo dois valores distintos de $d$ ($k$ seguido de $k+1$)! $\\blacksquare$</li>
            <li><strong>Corolário 22.4 (Monotonia Temporal):</strong> Se $v_i$ é enfileirado antes de $v_j$ durante a execução de <code>BFS</code>, então $v_i.d \\le v_j.d$ no momento em que $v_j$ é enfileirado.</li>
          </ul>
        </div>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 22.5 — CORREÇÃO DA BUSCA EM LARGURA (CLRS, pp. 491–492) ]</span>
          <p>Seja $G = (V, E)$ um grafo dirigido ou não dirigido, e suponha que <code>BFS</code> seja executado em $G$ a partir de um vértice fonte $s \\in V$. Então, durante sua execução, <code>BFS</code> descobre todo vértice $v \\in V$ alcançável a partir de $s$ e, no término, $v.d = \\delta(s, v)$ para todo $v \\in V$. Além disso, para qualquer vértice $v \\neq s$ alcançável de $s$, um dos caminhos mínimos de $s$ a $v$ é um caminho mínimo de $s$ a $v.\\pi$ seguido pela aresta $(v.\\pi, v)$.</p>
          <p><strong>Demonstração por Contradição:</strong> Suponha que algum vértice receba um valor $d$ diferente de sua distância real. Seja $v$ o vértice com <strong>$\\delta(s, v)$ mínimo</strong> que recebe um valor incorreto $v.d \\neq \\delta(s, v)$. Claramente $v \\neq s$ (pois $s.d = 0 = \\delta(s, s)$). Pelo Lema 22.2, $v.d \\ge \\delta(s, v)$, logo devemos ter estritamente $v.d > \\delta(s, v)$. Além disso, $v$ deve ser alcançável de $s$ (caso contrário $\\delta(s, v) = \\infty \\ge v.d$).</p>
          <p>Seja $u$ o vértice que precede imediatamente $v$ em um caminho mínimo de $s$ a $v$, de modo que $\\delta(s, v) = \\delta(s, u) + 1$. Como $\\delta(s, u) < \\delta(s, v)$ e escolhemos $v$ com $\\delta(s, v)$ mínimo entre os incorretos, o vértice $u$ foi calculado corretamente: $u.d = \\delta(s, u)$. Colocando essas propriedades juntas, temos:</p>
          $$v.d > \\delta(s, v) = \\delta(s, u) + 1 = u.d + 1 \\quad \\text{(Equação 22.1)}$$
          <p>Considere agora o momento em que <code>BFS</code> desenfileira $u$ de $Q$ na linha 11. Nesse instante, qual é a cor de $v$? Analisamos os três casos exaustivos e mostramos que todos levam a uma contradição com a Equação (22.1):</p>
          <ol>
            <li><strong>Caso 1 ($v$ é <code>BRANCO</code>):</strong> Então a linha 15 define $v.d = u.d + 1$, contradizendo $v.d > u.d + 1$.</li>
            <li><strong>Caso 2 ($v$ é <code>PRETO</code>):</strong> Então $v$ já foi removido da fila antes de $u$ (e portanto enfileirado antes de $u$). Pelo Corolário 22.4, $v.d \\le u.d$, contradizendo $v.d > u.d + 1$.</li>
            <li><strong>Caso 3 ($v$ é <code>CINZENTO</code>):</strong> Então $v$ foi pintado de cinzento ao explorar algum vértice $w$ que foi removido de $Q$ <em>antes</em> de $u$. Logo, $v.d = w.d + 1$. Como $w$ foi enfileirado antes de $u$, pelo Corolário 22.4 temos $w.d \\le u.d$, e portanto $v.d = w.d + 1 \\le u.d + 1$, contradizendo novamente a Equação (22.1)!</li>
          </ol>
          <p>Consequentemente, nenhum tal vértice $v$ pode existir: $v.d = \\delta(s, v)$ para todo $v \\in V$. Além disso, como $v.\\pi = u$ implica $v.d = u.d + 1$, um caminho mínimo de $s$ a $v$ é obtido seguindo um caminho mínimo de $s$ a $v.\\pi$ seguido da aresta $(v.\\pi, v)$. $\\blacksquare$</p>
        </div>

        <h3>3. O Subgrafo Predecessor $G_\\pi$ (Lema 22.6) e o Procedimento PRINT-PATH</h3>
        <p>Para um grafo $G = (V, E)$ com fonte $s$, definimos o <strong>subgrafo dos predecessores</strong> como $G_\\pi = (V_\\pi, E_\\pi)$, onde $V_\\pi = \\{v \\in V : v.\\pi \\neq \\text{NIL}\\} \\cup \\{s\\}$ e $E_\\pi = \\{(v.\\pi, v) : v \\in V_\\pi - \\{s\\}\\}$. Pelo <strong>Lema 22.6 (p. 492)</strong>, $G_\\pi$ é uma <strong>árvore de busca em largura</strong>: $V_\\pi$ contém exatamente os vértices alcançáveis a partir de $s$, $|E_\\pi| = |V_\\pi| - 1$, e para todo $v \\in V_\\pi$ o único caminho simples de $s$ a $v$ em $G_\\pi$ é um caminho mínimo de $s$ a $v$ em $G$. O procedimento recursivo abaixo imprime os vértices desse caminho mínimo em tempo $O(|\\text{caminho}|)$:</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">PRINT-PATH(G, s, v) — Impressão do Caminho Mínimo de s a v (CLRS, p. 493)</span>
              <span>[ COMPLEXIDADE: O(δ(s, v)) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">se</span> v == s</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">   <span class="kw">imprimir</span> s</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">senão se</span> v.π == NIL</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   <span class="kw">imprimir</span> "não existe nenhum caminho de" s "a" v "presente"</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">senão</span> PRINT-PATH(G, s, v.π)</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">   <span class="kw">imprimir</span> v</span></div>
            </div>
          </div>
      `
    },

    /* ======================================================================
       UNIDADE 11.3 — SEÇÃO 22.3: BUSCA EM PROFUNDIDADE (DFS)
       ====================================================================== */
    {
      id: "u11-3",
      code: "UNIDADE 11.3 • CAPÍTULO 22.3",
      title: "22.3 Busca em Profundidade (DFS), Teorema dos Parênteses, Caminho Branco e Classificação de Arestas",
      pages: "pp. 495–503",
      content: `
        <h3>1. A Estratégia de Busca em Profundidade (DFS) e a Floresta Predecessora $G_\\pi$</h3>
        <p>Diferentemente da busca em largura, a <strong>Busca em Profundidade (Depth-First Search — <code>DFS</code>)</strong> explora arestas a partir do vértice $v$ <em>mais recentemente descoberto</em> do qual ainda saem arestas inexploradas. Quando todas as arestas que saem de $v$ já foram exploradas, a busca "retrocede" (<em>backtracks</em>) para explorar as arestas restantes do vértice $v.\\pi$ a partir do qual $v$ foi descoberto. Se ainda restarem vértices não descobertos após esgotar a árvore atual, <code>DFS</code> escolhe um novo vértice branco como raiz e inicia uma nova árvore de busca até que todos os vértices de $V$ sejam visitados.</p>
        <p>Por esse motivo, o subgrafo dos predecessores produzido por <code>DFS</code> forma uma <strong>floresta de busca em profundidade</strong> $G_\\pi = (V, E_\\pi)$, onde $E_\\pi = \\{(v.\\pi, v) : v \\in V \\text{ e } v.\\pi \\neq \\text{NIL}\\}$, composta por uma ou mais árvores de busca em profundidade disjuntas. Além das três cores (<code>BRANCO</code>, <code>CINZENTO</code> e <code>PRETO</code>), <code>DFS</code> atribui a cada vértice $u \\in V$ <strong>dois carimbos de tempo</strong> inteiros distintos entre $1$ e $2|V|$:</p>
        <ul>
          <li><code>u.d</code> (<strong>tempo de descoberta</strong>): momento em que $u$ é descoberto pela primeira vez e pintado de <code>CINZENTO</code>.</li>
          <li><code>u.f</code> (<strong>tempo de término / finalização</strong>): momento em que a busca termina de examinar toda a lista $G.\\text{Adj}[u]$ e pinta $u$ de <code>PRETO</code>.</li>
        </ul>
        <p>Para todo vértice $u \\in V$, vale $1 \\le u.d < u.f \\le 2|V|$ (Equação 22.2). O vértice $u$ é <code>BRANCO</code> antes do tempo $u.d$, <code>CINZENTO</code> exatamente no intervalo aberto $(u.d, u.f)$ (e nos instantes $u.d$ de entrada na pilha de recursão), e <code>PRETO</code> a partir de $u.f$ em diante.</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">DFS(G) e DFS-VISIT(G, u) — Busca em Profundidade (CLRS, p. 496)</span>
              <span>[ COMPLEXIDADE: Θ(V + E) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line" style="margin-top:0.4rem;font-weight:bold;color:var(--accent-amber-border);"><span class="line-num"></span><span class="line-content">DFS(G)</span></div>
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">para cada</span> vértice u ∈ G.V</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">   u.cor = BRANCO</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   u.π = NIL</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">tempo = 0</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">para cada</span> vértice u ∈ G.V</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">   <span class="kw">se</span> u.cor == BRANCO</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">       DFS-VISIT(G, u)</span></div>
              <div class="code-line"><span class="line-num"></span><span class="line-content"></span></div>
              <div class="code-line" style="margin-top:0.4rem;font-weight:bold;color:var(--accent-amber-border);"><span class="line-num"></span><span class="line-content">DFS-VISIT(G, u)</span></div>
              <div class="code-line"><span class="line-num">1</span><span class="line-content">tempo = tempo + 1           <span class="cmt">// vértice branco u acabou de ser descoberto</span></span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">u.d = tempo</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">u.cor = CINZENTO</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">para cada</span> v ∈ G.Adj[u]      <span class="cmt">// explorar aresta (u, v)</span></span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">   <span class="kw">se</span> v.cor == BRANCO</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">       v.π = u</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">       DFS-VISIT(G, v)</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">u.cor = PRETO               <span class="cmt">// pintar u de preto; ele está terminado</span></span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">tempo = tempo + 1</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">u.f = tempo</span></div>
            </div>
          </div>

        <p><strong>Análise Agregada do Tempo de Execução $\\Theta(V + E)$:</strong> Os laços das linhas 1–3 e 5–7 de <code>DFS</code> custam $\\Theta(V)$, excluindo as chamadas a <code>DFS-VISIT</code>. O procedimento <code>DFS-VISIT(G, u)</code> é chamado <strong>exatamente uma vez</strong> para cada vértice $u \\in V$, pois só é invocado sobre vértices brancos e imediatamente pinta $u$ de cinzento na linha 3. Durante a execução de <code>DFS-VISIT(G, u)</code>, o laço das linhas 4–7 itera $|\\text{Adj}[u]|$ vezes. Como $\\sum_{u \\in V} |\\text{Adj}[u]| = \\Theta(E)$, o custo total das linhas 4–7 ao longo de toda a busca é $\\Theta(E)$. Logo, o tempo total de execução de <code>DFS(G)</code> é estritamente <strong>$\\Theta(V + E)$</strong>.</p>

        <h3>2. Teorema dos Parênteses (22.7), Corolário 22.8 e Teorema do Caminho Branco (22.9)</h3>
        <p>A estrutura de chamadas recursivas de <code>DFS-VISIT</code> impõe que os carimbos $u.d$ e $u.f$ formem uma expressão de parênteses bem formada: se registrarmos "(u" no instante $u.d$ e "u)" no instante $u.f$, os pares de parênteses ficam perfeitamente aninhados:</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 22.7 (TEOREMA DOS PARÊNTESES) E COROLÁRIO 22.8 (pp. 497–499) ]</span>
          <p><strong>Teorema 22.7 (Teorema dos Parênteses):</strong> Em qualquer busca em profundidade de um grafo (dirigido ou não dirigido) $G = (V, E)$, para quaisquer dois vértices distintos $u$ e $v$, <strong>exatamente uma</strong> das três condições seguintes é válida:</p>
          <ol>
            <li>Os intervalos $[u.d, u.f]$ e $[v.d, v.f]$ são <strong>completamente disjuntos</strong> ($u.d < u.f < v.d < v.f$ ou $v.d < v.f < u.d < u.f$), e nem $u$ nem $v$ é descendente do outro na floresta em profundidade.</li>
            <li>O intervalo $[u.d, u.f]$ está <strong>inteiramente contido</strong> no intervalo $[v.d, v.f]$ ($v.d < u.d < u.f < v.f$), e $u$ é um descendente próprio de $v$ em uma árvore em profundidade.</li>
            <li>O intervalo $[v.d, v.f]$ está <strong>inteiramente contido</strong> no intervalo $[u.d, u.f]$ ($u.d < v.d < v.f < u.f$), e $v$ é um descendente próprio de $u$ em uma árvore em profundidade.</li>
          </ol>
          <p><em>Demonstração:</em> Sem perda de generalidade, suponha $u.d < v.d$ (o caso $v.d < u.d$ é simétrico trocando $u$ e $v$). Há dois subcasos: (a) Se $v.d < u.f$, então $v$ foi descoberto enquanto $u$ ainda era <code>CINZENTO</code> (ou seja, durante a execução ativa de <code>DFS-VISIT(G, u)</code>), o que implica que $v$ é descendente de $u$. Como $v$ foi descoberto mais recentemente que $u$, a chamada recursiva <code>DFS-VISIT(G, v)</code> explora todas as arestas de saída de $v$ e termina $v$ antes de retornar à chamada de $u$, resultando em $u.d < v.d < v.f < u.f$, ou seja, $[v.d, v.f] \\subset [u.d, u.f]$. (b) Se $u.f < v.d$, então como $u.d < u.f$ e $v.d < v.f$, temos $u.d < u.f < v.d < v.f$: os intervalos são completamente disjuntos e nenhum vértice foi descoberto enquanto o outro era cinzento, logo nenhum é descendente do outro. $\\blacksquare$</p>
          <p><strong>Corolário 22.8 (Aninhamento de Intervalos de Descendentes):</strong> O vértice $v$ é um descendente próprio do vértice $u$ na floresta em profundidade de $G$ se e somente se $u.d < v.d < v.f < u.f$.</p>
        </div>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 22.9 — TEOREMA DO CAMINHO BRANCO (CLRS, p. 499) ]</span>
          <p>Em uma floresta de busca em profundidade de um grafo (dirigido ou não dirigido) $G = (V, E)$, o vértice $v$ é um descendente do vértice $u$ se e somente se, no momento $u.d$ em que a busca descobre $u$, existe um caminho em $G$ de $u$ a $v$ que consiste <strong>inteiramente em vértices brancos</strong>.</p>
          <p><strong>Demonstração ($\Rightarrow$ e $\\Leftarrow$):</strong></p>
          <ul>
            <li><strong>($\\Rightarrow$):</strong> Se $v = u$, o caminho de $u$ a $v$ contém apenas $u$, que ainda é branco no momento em que $u.d$ é definido. Se $v$ é um descendente próprio de $u$ na floresta $G_\\pi$, então, para todo vértice $w$ ao longo do único caminho simples de $u$ a $v$ na árvore em profundidade, $w$ é descendente de $u$ e, pelo Corolário 22.8, $u.d \\le w.d$. Logo, todos os vértices desse caminho são brancos no instante $u.d$.</li>
            <li><strong>($\\Leftarrow$):</strong> Suponha que exista um caminho de vértices brancos de $u$ a $v$ no instante $u.d$, mas, por contradição, $v$ <em>não</em> se torne descendente de $u$. Sem perda de generalidade, escolha $v$ como o <em>primeiro</em> vértice ao longo desse caminho que não se torna descendente de $u$; assim, seu predecessor imediato $w$ no caminho (onde é possível $w = u$) <em>é</em> um descendente de $u$. Pelo Corolário 22.8, temos $w.f \\le u.f$. Como $v$ era branco no tempo $u.d$, temos $u.d < v.d$. Além disso, como $v \\in G.\\text{Adj}[w]$, a lista de adjacências de $w$ será totalmente varrida antes de $w$ terminar em $w.f$; portanto, $v$ deve ser descoberto antes que $w$ termine, isto é, $v.d < w.f$. Combinando as desigualdades, obtemos $u.d < v.d < w.f \\le u.f$. Pelo Teorema dos Parênteses (Teorema 22.7), como $u.d < v.d < u.f$, o intervalo $[v.d, v.f]$ deve estar inteiramente contido em $[u.d, u.f]$, e pelo Corolário 22.8 $v$ é obrigatoriamente um descendente de $u$ — contradição! $\\blacksquare$</li>
          </ul>
        </div>

        <h3>3. As 4 Categorias de Arestas em DFS e o Teorema 22.10 para Grafos Não Dirigidos (pp. 500–502)</h3>
        <p>Uma propriedade diagnóstica crucial da busca em profundidade é classificar cada aresta $(u, v) \\in E$ em uma de <strong>quatro categorias</strong> em função da floresta $G_\\pi$, da cor do vértice $v$ no instante em que $(u, v)$ é explorada pela primeira vez, e da relação entre os intervalos $[u.d, u.f]$ e $[v.d, v.f]$ (Exercício 22.3-5):</p>

        <div class="canonical-table-wrap">
          <table class="canonical-table">
            <thead>
              <tr>
                <th>Tipo de Aresta $(u, v)$</th>
                <th>Definição Estrutural na Floresta $G_\\pi$</th>
                <th>Cor de $v$ ao Explorar $(u, v)$ pela 1ª Vez</th>
                <th>Relação de Intervalos $[u.d, u.f]$ e $[v.d, v.f]$</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>1. Aresta de Árvore (Tree Edge — T)</strong></td>
                <td>$(u, v) \\in E_\\pi$: o vértice $v$ foi descoberto diretamente pela exploração de $(u, v)$.</td>
                <td><code>BRANCO</code> ($v$ ainda não havia sido descoberto).</td>
                <td>$u.d < v.d < v.f < u.f$<br>($[v.d, v.f] \\subset [u.d, u.f]$)</td>
              </tr>
              <tr>
                <td><strong>2. Aresta de Retorno (Back Edge — B)</strong></td>
                <td>Conecta $u$ a um <strong>ancestral</strong> $v$ em uma árvore de $G_\\pi$ (inclui auto-laços $(u, u)$ em dígrafos).</td>
                <td><code>CINZENTO</code> ($v$ está ativo na pilha de recursão como ancestral de $u$).</td>
                <td>$v.d \\le u.d < u.f \\le v.f$<br>($[u.d, u.f] \\subseteq [v.d, v.f]$)</td>
              </tr>
              <tr>
                <td><strong>3. Aresta Direta (Forward Edge — F)</strong></td>
                <td>Aresta que <em>não</em> é de árvore ($\\notin E_\\pi$), mas conecta $u$ a um <strong>descendente próprio</strong> $v$ em $G_\\pi$.</td>
                <td><code>PRETO</code> com $u.d < v.d$ ($v$ foi descoberto e terminado após $u$ iniciar).</td>
                <td>$u.d < v.d < v.f < u.f$<br>($[v.d, v.f] \\subset [u.d, u.f]$)</td>
              </tr>
              <tr>
                <td><strong>4. Aresta Cruzada (Cross Edge — C)</strong></td>
                <td>Todas as demais arestas: entre vértices da mesma árvore sem relação de ancestralidade ou entre árvores distintas de $G_\\pi$.</td>
                <td><code>PRETO</code> com $v.d < u.d$ ($v$ já terminou antes de $u$ ser descoberto).</td>
                <td>$v.d < v.f < u.d < u.f$<br>(intervalos disjuntos, $v$ precede $u$)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 22.10 — AUSÊNCIA DE ARESTAS DIRETAS E CRUZADAS EM GRAFOS NÃO DIRIGIDOS (p. 501) ]</span>
          <p>Em uma busca em profundidade de um <strong>grafo não dirigido</strong> $G$, toda aresta de $G$ é ou uma <strong>aresta de árvore</strong> ou uma <strong>aresta de retorno</strong> (nunca ocorrem arestas diretas nem cruzadas).</p>
          <p><strong>Demonstração:</strong> Seja $(u, v)$ uma aresta arbitrária de $G$ e suponha, sem perda de generalidade, que $u.d < v.d$. Como $v \\in G.\\text{Adj}[u]$, a busca deve descobrir e terminar $v$ antes de terminar $u$ (enquanto $u$ ainda é cinzento), logo $u.d < v.d < v.f < u.f$. Há apenas duas direções possíveis em que a aresta não dirigida $\\{u, v\\}$ pode ser explorada pela primeira vez: (1) se for explorada primeiro na direção de $u$ para $v$, então $v$ ainda é <code>BRANCO</code> nesse instante (pois se já tivesse sido descoberto, a aresta já teria sido explorada antes a partir de $v$), tornando $(u, v)$ uma <strong>aresta de árvore</strong>; (2) se for explorada primeiro na direção de $v$ para $u$, então como $u.d < v.d < v.f < u.f$, o vértice $u$ ainda é <code>CINZENTO</code> quando $v$ o examina, tornando $(v, u)$ uma <strong>aresta de retorno</strong>. $\\blacksquare$</p>
        </div>
      `
    },

    /* ======================================================================
       UNIDADE 11.4 — SEÇÕES 22.4 E 22.5: ORDENAÇÃO TOPOLÓGICA E SCC
       ====================================================================== */
    {
      id: "u11-4",
      code: "UNIDADE 11.4 • CAPÍTULO 22.4 & 22.5",
      title: "22.4 e 22.5 Ordenação Topológica em DAGs (TOPOLOGICAL-SORT) e Componentes Fortemente Conexas (Kosaraju-Sharir)",
      pages: "pp. 504–512",
      content: `
        <h3>1. Ordenação Topológica de um Grafo Acíclico Dirigido — DAG (Seção 22.4, pp. 503–506)</h3>
        <p>Uma <strong>ordenação topológica</strong> de um grafo acíclico dirigido (<strong>DAG</strong>, ou <em>gad</em> em português) $G = (V, E)$ é uma ordenação linear de todos os seus vértices tal que, se $G$ contém uma aresta dirigida $(u, v) \\in E$, então $u$ aparece <strong>antes</strong> de $v$ na ordenação (se os vértices forem dispostos sobre uma linha horizontal, todas as arestas apontam da esquerda para a direita). Se um grafo dirigido contém um ciclo, nenhuma ordenação topológica é possível.</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">TOPOLOGICAL-SORT(G) — Ordenação Topológica via DFS (CLRS, p. 504)</span>
              <span>[ COMPLEXIDADE: Θ(V + E) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">chamar</span> DFS(G) <span class="kw">para</span> calcular os tempos de término v.f <span class="kw">para cada</span> vértice v</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">à medida que cada vértice é terminado, inseri-lo na frente de uma lista ligada</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">retornar</span> a lista ligada de vértices</span></div>
            </div>
          </div>

        <p>Como <code>DFS(G)</code> leva tempo $\\Theta(V + E)$ e inserir cada um dos $|V|$ vértices na frente (cabeça) de uma lista ligada leva tempo $O(1)$ por vértice, <code>TOPOLOGICAL-SORT(G)</code> executa em tempo $\\Theta(V + E)$ e dispõe os vértices em <strong>ordem decrescente de seus tempos de término $u.f$</strong>. Sua corretude decorre do Lema 22.11 e do Teorema 22.12:</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ LEMA 22.11 E TEOREMA 22.12 — CARACTERIZAÇÃO DE DAGS E CORRETUDE DE TOPOLOGICAL-SORT (pp. 504–505) ]</span>
          <p><strong>Lema 22.11:</strong> Um grafo dirigido $G$ é acíclico se e somente se uma busca em profundidade de $G$ não produz nenhuma <strong>aresta de retorno</strong>.</p>
          <p><em>Demonstração:</em> ($\\Rightarrow$) Suponha que uma <code>DFS</code> produza uma aresta de retorno $(u, v)$. Então $v$ é um ancestral de $u$ na floresta em profundidade, logo $G$ contém um caminho dirigido de $v$ a $u$ formado por arestas de árvore, e a aresta de retorno $(u, v)$ fecha um ciclo dirigido. ($\\Leftarrow$) Suponha que $G$ contenha um ciclo $c$. Seja $v$ o <em>primeiro</em> vértice de $c$ a ser descoberto pela <code>DFS</code>, e seja $(u, v)$ a aresta que precede $v$ em $c$. No instante $v.d$, todos os demais vértices de $c$ ainda são brancos, formando um caminho inteiramente branco de $v$ até $u$. Pelo <strong>Teorema do Caminho Branco (Teorema 22.9)</strong>, $u$ torna-se um descendente de $v$ na floresta em profundidade; logo, pelo Corolário 22.8, $v.d < u.d < u.f < v.f$, e quando $(u, v)$ é explorada, $v$ ainda é cinzento, tornando $(u, v)$ uma aresta de retorno! $\\blacksquare$</p>
          <p><strong>Teorema 22.12:</strong> <code>TOPOLOGICAL-SORT(G)</code> produz uma ordenação topológica de qualquer grafo acíclico dirigido $G = (V, E)$ dado como entrada.</p>
          <p><em>Demonstração:</em> Basta provar que, para qualquer aresta $(u, v) \\in E$, temos $v.f < u.f$ (de modo que $v$ termina antes de $u$, sendo inserido na lista ligada antes de $u$ e ficando à direita de $u$ após $u$ ser inserido na frente). Considere o instante em que a aresta $(u, v)$ é explorada por <code>DFS(G)</code> (enquanto $u$ é cinzento). Qual é a cor de $v$? (1) $v$ <strong>não pode ser cinzento</strong>, pois se fosse, $v$ seria ancestral de $u$ e $(u, v)$ seria uma aresta de retorno, contradizendo o Lema 22.11 pois $G$ é um DAG; (2) se $v$ é <strong>branco</strong>, $v$ torna-se descendente de $u$ e, pelo Corolário 22.8, $v.f < u.f$; (3) se $v$ é <strong>preto</strong>, $v$ já terminou e $v.f$ já foi atribuído, enquanto $u$ ainda está cinzento sendo explorado e receberá um carimbo $u.f$ futuro maior, logo $v.f < u.f$. Assim, para toda aresta $(u, v) \\in E$, vale $u.f > v.f$. $\\blacksquare$</p>
        </div>

        <h3>2. Decomposição em Componentes Fortemente Conexas — Kosaraju-Sharir (Seção 22.5, pp. 506–510)</h3>
        <p>Uma <strong>componente fortemente conexa (SCC)</strong> de um grafo dirigido $G = (V, E)$ é um subconjunto maximal de vértices $C \\subseteq V$ tal que, para todo par $u, v \\in C$, temos $u \\leadsto v$ e $v \\leadsto u$. O algoritmo de Kosaraju-Sharir calcula todas as SCCs em tempo linear $\\Theta(V + E)$ usando o <strong>grafo transposto</strong> $G^{\\text{T}} = (V, E^{\\text{T}})$, onde $E^{\\text{T}} = \\{(u, v) : (v, u) \\in E\\}$ ($G$ e $G^{\\text{T}}$ possuem exatamente as mesmas SCCs):</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">STRONGLY-CONNECTED-COMPONENTS(G) — Algoritmo de Kosaraju-Sharir (CLRS, p. 507)</span>
              <span>[ COMPLEXIDADE: Θ(V + E) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">chamar</span> DFS(G) <span class="kw">para</span> calcular os tempos de término u.f <span class="kw">para cada</span> vértice u</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">calcular G^T</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">chamar</span> DFS(G^T), mas no laço principal de DFS considerar os vértices</span></div>
              <div class="code-line"><span class="line-num"></span><span class="line-content">       em ordem decrescente de u.f (como calculados na linha 1)</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">produzir os vértices de cada árvore na floresta de busca em profundidade</span></div>
              <div class="code-line"><span class="line-num"></span><span class="line-content">       formada na linha 3 como uma componente fortemente conexa separada</span></div>
            </div>
          </div>

        <h4>O Grafo de Componentes $G^{\\text{SCC}}$ e as Demonstrações dos Lemas 22.13, 22.14, Corolário 22.15 e Teorema 22.16</h4>
        <p>Se $G$ possui componentes fortemente conexas $C_1, C_2, \\dots, C_k$, o <strong>grafo de componentes</strong> $G^{\\text{SCC}} = (V^{\\text{SCC}}, E^{\\text{SCC}})$ contrai cada $C_i$ em um vértice $v_i \\in V^{\\text{SCC}}$ e coloca uma aresta dirigida $(v_i, v_j) \\in E^{\\text{SCC}}$ se existe alguma aresta $(x, y) \\in E$ com $x \\in C_i$ e $y \\in C_j$ ($i \\neq j$). Para qualquer subconjunto $U \\subseteq V$, definimos o tempo de descoberta mais antigo $d(U) = \\min_{u \\in U} \\{u.d\\}$ e o tempo de término mais recente $f(U) = \\max_{u \\in U} \\{u.f\\}$ (referentes à <strong>primeira</strong> chamada <code>DFS(G)</code> na linha 1).</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ LEMAS 22.13, 22.14, COROLÁRIO 22.15 E TEOREMA 22.16 — PROVA DE KOSARAJU-SHARIR (pp. 508–510) ]</span>
          <ul>
            <li><strong>Lema 22.13 ($G^{\\text{SCC}}$ é um DAG):</strong> Sejam $C$ e $C'$ componentes fortemente conexas distintas em $G = (V, E)$, sejam $u, v \\in C$ e $u', v' \\in C'$. Se $G$ contém um caminho $u \\leadsto u'$, então $G$ não pode conter um caminho $v' \\leadsto v$.<br>
            <em>Prova:</em> Se existisse $v' \\leadsto v$, então como $u \\leadsto u' \\leadsto v'$ e $v' \\leadsto v \\leadsto u$, $u$ e $v'$ seriam mutuamente alcançáveis, contradizendo que $C$ e $C'$ são SCCs distintas. $\\blacksquare$</li>
            <li><strong>Lema 22.14 (Ordenação dos Tempos Máximos $f(C)$ entre SCCs):</strong> Sejam $C$ e $C'$ SCCs distintas em $G = (V, E)$. Se existe uma aresta $(u, v) \\in E$ com $u \\in C$ e $v \\in C'$, então $f(C) > f(C')$.<br>
            <em>Prova (dividida em 2 casos conforme qual componente foi descoberta primeiro na linha 1):</em>
            <ol>
              <li><strong>Caso 1 ($d(C) < d(C')$):</strong> Seja $x \\in C$ o primeiro vértice descoberto em $C$. No instante $x.d$, todos os vértices em $C$ e em $C'$ são brancos. Como existe caminho branco em $C$ de $x$ até $u$, a aresta $(u, v)$ e caminho branco em $C'$ de $v$ até qualquer $w \\in C'$, existe um caminho inteiramente branco $x \\leadsto u \\to v \\leadsto w$ no instante $x.d$. Pelo <strong>Teorema do Caminho Branco (22.9)</strong>, todos os vértices de $C \\cup C'$ tornam-se descendentes de $x$, e pelo Corolário 22.8 $x$ termina depois de todos eles: $f(C) = x.f > f(C')$.</li>
              <li><strong>Caso 2 ($d(C) > d(C')$):</strong> Seja $y \\in C'$ o primeiro vértice descoberto em $C'$. No instante $y.d$, todos os vértices de $C'$ são brancos e tornam-se descendentes de $y$, logo $y.f = f(C')$. Porém, como há uma aresta de $C$ para $C'$, pelo Lema 22.13 <strong>não existe nenhum caminho de $C'$ para $C$ em $G$</strong>! Logo, nenhum vértice de $C$ é alcançável a partir de $y$, e no instante $y.f$ todos os vértices de $C$ ainda são brancos. Portanto, todo $w \\in C$ terminará depois de $y.f$, implicando $f(C) > y.f = f(C')$. $\\blacksquare$</li>
            </ol>
            </li>
            <li><strong>Corolário 22.15 (Arestas em $G^{\\text{T}}$):</strong> Se existe uma aresta $(u, v) \\in E^{\\text{T}}$ com $u \\in C$ e $v \\in C'$ ($C \\neq C'$), então $(v, u) \\in E$ e, pelo Lema 22.14, $f(C) < f(C')$. Isto é, em $G^{\\text{T}}$, todas as arestas entre SCCs distintas apontam de componentes com menor $f$ para componentes com maior $f$!</li>
            <li><strong>Teorema 22.16 (Corretude de <code>STRONGLY-CONNECTED-COMPONENTS(G)</code>):</strong> O algoritmo calcula corretamente as SCCs de $G$.<br>
            <em>Prova por indução no número $k$ de árvores produzidas na linha 3 (busca em $G^{\\text{T}}$):</em> Hipótese indutiva: as primeiras $k$ árvores produzidas na linha 3 são exatamente $k$ SCCs. Base $k=0$ é trivial. No passo indutivo, considere a $(k+1)$-ésima árvore com raiz $u$, pertencente à SCC $C$. Pela ordem decrescente de $u.f$, $u$ possui o maior tempo de término $f(C) = u.f$ dentre todas as SCCs ainda não visitadas. No instante $u.d$ da busca em $G^{\\text{T}}$, todos os vértices de $C$ são brancos, logo pelo Teorema do Caminho Branco todos os vértices de $C$ tornam-se descendentes de $u$. Além disso, pelo Corolário 22.15, qualquer aresta em $G^{\\text{T}}$ que saia de $C$ para outra componente $C' \\neq C$ exige $f(C') > f(C)$; portanto, pela hipótese indutiva, toda tal componente $C'$ já foi integralmente visitada nas $k$ primeiras árvores e seus vértices já estão <code>PRETOS</code>! Assim, a árvore de $u$ em $G^{\\text{T}}$ contém exatamente os vértices de $C$. $\\blacksquare$</li>
          </ul>
        </div>
      `
    },

    /* ======================================================================
       UNIDADE 11.5 — SEÇÃO 23.1: FORMAÇÃO DE UMA ÁRVORE GERADORA MÍNIMA
       ====================================================================== */
    {
      id: "u11-5",
      code: "UNIDADE 11.5 • CAPÍTULO 23.1",
      title: "23.1 Formação de uma Árvore Geradora Mínima (GENERIC-MST, Cortes, Arestas Leves e Teorema 23.1)",
      pages: "pp. 513–518",
      content: `
        <h3>1. Formulação do Problema da MST e o Método Guloso Genérico (GENERIC-MST)</h3>
        <p>No projeto de redes e circuitos eletrônicos, desejamos interconectar um conjunto de $n = |V|$ pinos ou nós usando $n - 1$ conexões de custo total mínimo. Modelamos esse problema por um <strong>grafo conexo não dirigido</strong> $G = (V, E)$ equipado com uma função peso de valor real $w : E \\to \\mathbb{R}$, onde $w(u, v)$ especifica o custo de conectar $u$ e $v$. Nosso objetivo é encontrar um subconjunto acíclico $T \\subseteq E$ que conecte todos os vértices de $V$ (logo, pelo Teorema B.2, $T$ é uma <strong>árvore geradora</strong> de $G$ com $|T| = |V| - 1$ arestas) e cujo peso total</p>
        $$w(T) = \\sum_{(u, v) \\in T} w(u, v)$$
        <p>seja minimizado. A expressão "árvore geradora mínima" (<em>Minimum Spanning Tree — MST</em>) é uma forma abreviada para "árvore geradora de peso mínimo". Tanto o algoritmo de Kruskal quanto o de Prim são especializações do método guloso <code>GENERIC-MST</code>, que faz crescer um conjunto de arestas $A$ uma aresta por vez:</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">GENERIC-MST(G, w) — Método Genérico de Árvore Geradora Mínima (CLRS, p. 514)</span>
              <span>[ ESTRUTURA: INVARIANTE DE ARESTA SEGURA ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">A = ∅</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">enquanto</span> A não forma uma árvore geradora</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   encontrar uma aresta (u, v) que é segura <span class="kw">para</span> A</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   A = A ∪ {(u, v)}</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">retornar</span> A</span></div>
            </div>
          </div>

        <p>O método gerencia o conjunto $A$ mantendo o seguinte <strong>invariante de laço</strong>:</p>
        <div class="canonical-callout definition">
          <span class="callout-tag">[ INVARIANTE DE LAÇO DE GENERIC-MST E DEFINIÇÃO DE ARESTA SEGURA (p. 514) ]</span>
          <p><strong>Invariante:</strong> <em>Antes de cada iteração do laço <code>enquanto</code>, $A$ é um subconjunto de alguma árvore geradora mínima de $G$.</em></p>
          <ul>
            <li><strong>Inicialização:</strong> Após a linha 1, $A = \\emptyset$, que é subconjunto trivial de qualquer árvore geradora mínima.</li>
            <li><strong>Manutenção:</strong> Em cada iteração (linhas 2–4), adicionamos a $A$ uma <strong>aresta segura para $A$</strong> — definida como uma aresta $(u, v) \\in E - A$ tal que $A \\cup \\{(u, v)\\}$ também é subconjunto de alguma árvore geradora mínima.</li>
            <li><strong>Término:</strong> Quando o laço termina após $|V| - 1$ iterações, $A$ é uma árvore geradora que está contida em alguma MST; como toda árvore geradora tem $|V| - 1$ arestas, $A$ é ela própria uma árvore geradora mínima!</li>
          </ul>
        </div>

        <h3>2. Cortes, Respeito a $A$, Arestas Leves e o Teorema da Aresta Segura (Teorema 23.1 e Corolário 23.2)</h3>
        <p>Para identificar eficientemente arestas seguras na linha 3 de <code>GENERIC-MST</code>, a <strong>Seção 23.1 (p. 515)</strong> introduz quatro definições fundamentais sobre um grafo não dirigido $G = (V, E)$:</p>
        <ol>
          <li><strong>Corte $(S, V - S)$:</strong> Uma partição do conjunto de vértices $V$ em dois subconjuntos disjuntos $S$ e $V - S$.</li>
          <li><strong>Aresta que cruza o corte:</strong> Uma aresta $(u, v) \\in E$ <em>cruza</em> o corte $(S, V - S)$ se uma de suas extremidades pertence a $S$ e a outra pertence a $V - S$.</li>
          <li><strong>Corte que respeita $A$:</strong> Dizemos que um corte $(S, V - S)$ <em>respeita</em> um dado conjunto de arestas $A \\subseteq E$ se <strong>nenhuma aresta em $A$ cruza o corte</strong> (isto é, para toda $(x, y) \\in A$, ou $\\{x, y\\} \\subseteq S$ ou $\\{x, y\\} \\subseteq V - S$).</li>
          <li><strong>Aresta leve:</strong> Uma aresta é uma <em>aresta leve</em> cruzando um corte se seu peso é o <strong>mínimo</strong> dentre todas as arestas que cruzam esse corte (pode haver mais de uma aresta leve em caso de empate de pesos).</li>
        </ol>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 23.1 (TEOREMA DA ARESTA SEGURA) E COROLÁRIO 23.2 — PROVA POR RECORTAR E COLAR (pp. 515–516) ]</span>
          <p><strong>Teorema 23.1:</strong> Seja $G = (V, E)$ um grafo conexo não dirigido com uma função peso de valores reais $w$ definida em $E$. Seja $A$ um subconjunto de $E$ que está incluído em alguma árvore geradora mínima para $G$, seja $(S, V - S)$ qualquer corte de $G$ que <strong>respeita $A$</strong>, e seja $(u, v)$ uma <strong>aresta leve</strong> que cruza $(S, V - S)$. Então, a aresta $(u, v)$ é <strong>segura para $A$</strong>.</p>
          <p><strong>Demonstração Completa por "Recortar e Colar" (Cut-and-Paste, Figura 23.3, pp. 515–516):</strong></p>
          <ol>
            <li>Seja $T$ uma árvore geradora mínima que inclui $A$ ($A \\subseteq T$). Se $(u, v) \\in T$, então $A \\cup \\{(u, v)\\} \\subseteq T$ e $(u, v)$ já é segura para $A$.</li>
            <li>Suponha, portanto, que $(u, v) \\notin T$. Construiremos uma outra árvore geradora mínima $T'$ que inclui $A \\cup \\{(u, v)\\}$ pela técnica de recortar e colar.</li>
            <li>Como $T$ é uma árvore geradora, pelo Teorema B.2 existe um caminho simples único $p$ de $u$ a $v$ em $T$; logo, adicionar $(u, v)$ a $T$ cria exatamente um ciclo simples com as arestas de $p$.</li>
            <li>Como $u$ e $v$ estão em lados opostos do corte $(S, V - S)$, pelo menos uma aresta $(x, y) \\in T$ ao longo do caminho $p$ deve cruzar o corte $(S, V - S)$. Além disso, <strong>$(x, y) \\notin A$</strong>, pois o corte $(S, V - S)$ respeita $A$ (nenhuma aresta de $A$ cruza o corte).</li>
            <li>Como $(x, y)$ está no único caminho simples de $u$ a $v$ em $T$, remover $(x, y)$ de $T$ divide $T$ em duas componentes conexas; em seguida, adicionar $(u, v)$ reconecta essas duas componentes, formando uma nova árvore geradora:
            $$T' = T - \\{(x, y)\\} \\cup \\{(u, v)\\}.$$</li>
            <li>Mostremos que $T'$ é uma árvore geradora mínima. Como $(u, v)$ é uma aresta leve que cruza $(S, V - S)$ e $(x, y)$ também cruza esse mesmo corte, temos $w(u, v) \\le w(x, y)$. Logo:
            $$w(T') = w(T) - w(x, y) + w(u, v) \\le w(T).$$
            Mas como $T$ já é uma árvore geradora mínima, temos $w(T) \\le w(T')$; portanto, $w(T') = w(T)$ e $T'$ também é uma árvore geradora mínima!</li>
            <li>Finalmente, como $A \\subseteq T$ e $(x, y) \\notin A$, temos $A \\subseteq T - \\{(x, y)\\}$, e portanto $A \\cup \\{(u, v)\\} \\subseteq T'$. Como $T'$ é uma MST, $(u, v)$ é segura para $A$. $\\blacksquare$</li>
          </ol>
          <p><strong>Corolário 23.2 (Aresta Leve saindo de uma Componente $C$ de $G_A$):</strong> Seja $G = (V, E)$ conexo não dirigido com função peso $w$, seja $A \\subseteq E$ contido em alguma MST de $G$, e seja $C = (V_C, E_C)$ uma componente conexa (árvore) na floresta $G_A = (V, A)$. Se $(u, v)$ é uma aresta leve que conecta $C$ a alguma outra componente em $G_A$, então $(u, v)$ é segura para $A$.<br>
          <em>Prova:</em> O corte $(V_C, V - V_C)$ respeita $A$ (pois $C$ é uma componente conexa maximal de $G_A$), e $(u, v)$ é uma aresta leve para esse corte. Pelo Teorema 23.1, $(u, v)$ é segura para $A$. $\\blacksquare$</p>
        </div>
      `
    },

    /* ======================================================================
       UNIDADE 11.6 — SEÇÃO 23.2: OS ALGORITMOS DE KRUSKAL E DE PRIM
       ====================================================================== */
    {
      id: "u11-6",
      code: "UNIDADE 11.6 • CAPÍTULO 23.2",
      title: "23.2 Os Algoritmos de Kruskal (MST-KRUSKAL) e de Prim (MST-PRIM): Conjuntos Disjuntos vs. Heaps de Prioridade",
      pages: "pp. 518–525",
      content: `
        <h3>1. O Algoritmo de Kruskal (MST-KRUSKAL) e Florestas de Conjuntos Disjuntos (pp. 518–520)</h3>
        <p>O <strong>Algoritmo de Kruskal</strong> aplica diretamente o Corolário 23.2 mantendo o conjunto $A$ como uma <strong>floresta</strong> $G_A = (V, A)$ cujos vértices são todos os vértices do grafo dado. Inicialmente, $G_A$ consiste em $|V|$ árvores isoladas (uma para cada vértice). Em cada passo, a aresta segura adicionada a $A$ é sempre uma aresta $(u, v)$ de <strong>peso mínimo em todo o grafo</strong> que conecta duas árvores distintas $C_1$ e $C_2$ da floresta atual (sendo, portanto, uma aresta leve para o corte $(V_{C_1}, V - V_{C_1})$).</p>
        <p>Para verificar rapidamente se as extremidades $u$ e $v$ pertencem à mesma árvore (o que formaria um ciclo e deve ser descartado) ou a árvores distintas, <code>MST-KRUSKAL</code> utiliza a estrutura de dados de <strong>Conjuntos Disjuntos (Capítulo 21)</strong>: <code>MAKE-SET(v)</code> inicializa cada vértice em seu próprio conjunto unitário, <code>FIND-SET(u) ≠ FIND-SET(v)</code> testa se $u$ e $v$ estão em componentes distintas, e <code>UNION(u, v)</code> funde as duas árvores:</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">MST-KRUSKAL(G, w) — Algoritmo de Kruskal com Conjuntos Disjuntos (CLRS, p. 519)</span>
              <span>[ COMPLEXIDADE: O(E lg V) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">A = ∅</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">para cada</span> vértice v ∈ G.V</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   MAKE-SET(v)</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">ordenar as arestas de G.E em ordem não decrescente pelo peso w</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">para cada</span> aresta (u, v) ∈ G.E, tomada em ordem não decrescente por peso</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">   <span class="kw">se</span> FIND-SET(u) ≠ FIND-SET(v)</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">       A = A ∪ {(u, v)}</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">       UNION(u, v)</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content"><span class="kw">retornar</span> A</span></div>
            </div>
          </div>

        <p><strong>Análise de Complexidade de <code>MST-KRUSKAL</code>:</strong> Usando uma floresta de conjuntos disjuntos com as heurísticas de <em>união por posto (union by rank)</em> e <em>compressão de caminho (path compression)</em> da Seção 21.3:</p>
        <ul>
          <li>A linha 1 custa $O(1)$.</li>
          <li>Ordenar as $|E|$ arestas na linha 4 custa $O(E \\lg E)$.</li>
          <li>O laço das linhas 2–3 executa $|V|$ operações <code>MAKE-SET</code> e o laço das linhas 5–8 executa $2|E|$ operações <code>FIND-SET</code> e $|V| - 1$ operações <code>UNION</code>. Pelo Teorema 21.14, essas $O(V + E)$ operações sobre conjuntos disjuntos custam no total $O((V + E)\\alpha(V))$, onde $\\alpha(V)$ é a inversa funcional de Ackermann de crescimento extremamente lento.</li>
          <li>Como $G$ é conexo, temos $|E| \\ge |V| - 1$, logo o custo de conjuntos disjuntos é $O(E \\alpha(V))$. Como $\\alpha(V) = O(\\lg V) = O(\\lg E)$, o termo dominante é a ordenação $O(E \\lg E)$. Finalmente, como $|E| < |V|^2$, temos $\\lg E < 2 \\lg V = O(\\lg V)$, e portanto o tempo de execução total de Kruskal é <strong>$O(E \\lg V)$</strong>.</li>
        </ul>

        <h3>2. O Algoritmo de Prim (MST-PRIM) e Filas de Prioridade Mínima (pp. 520–522)</h3>
        <p>Diferentemente de Kruskal (que cresce várias árvores simultaneamente em uma floresta), o <strong>Algoritmo de Prim</strong> faz com que as arestas em $A$ formem <strong>sempre uma única árvore</strong>. A árvore começa em um vértice raiz arbitrário $r \\in V$ e cresce até abranger todos os vértices em $V$. Em cada passo, adiciona-se à árvore $A$ uma aresta leve que cruza o corte $(V_A, V - V_A)$, conectando a árvore atual a um vértice fora dela.</p>
        <p>Para selecionar essa aresta leve eficientemente, todos os vértices que <em>ainda não estão na árvore</em> residem em uma <strong>fila de prioridade mínima $Q$</strong> ordenada pelo atributo <code>v.chave</code>, que armazena o peso mínimo de qualquer aresta conectando $v$ a um vértice já presente na árvore (por convenção, $v.\\text{chave} = \\infty$ se não existe tal aresta). O atributo $v.\\pi$ registra o pai de $v$ na árvore, mantendo implicitamente $A = \\{(v, v.\\pi) : v \\in V - \\{r\\} - Q\\}$:</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">MST-PRIM(G, w, r) — Algoritmo de Prim com Fila de Prioridade Mínima (CLRS, p. 521)</span>
              <span>[ HEAP BINÁRIO: O(E lg V) • HEAP DE FIBONACCI: O(E + V lg V) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">para cada</span> u ∈ G.V</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">   u.chave = ∞</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   u.π = NIL</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">r.chave = 0</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">Q = G.V</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">enquanto</span> Q ≠ ∅</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">   u = EXTRACT-MIN(Q)</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">   <span class="kw">para cada</span> v ∈ G.Adj[u]</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">       <span class="kw">se</span> v ∈ Q e w(u, v) < v.chave</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">          v.π = u</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">          v.chave = w(u, v)   <span class="cmt">// operação implícita DECREASE-KEY(Q, v, w(u, v))</span></span></div>
            </div>
          </div>

        <h4>Invariante de Laço de Três Partes e Comparação Heap Binário vs. Heap de Fibonacci</h4>
        <p>Antes de cada iteração do laço <code>enquanto</code> nas linhas 6–11, <code>MST-PRIM</code> mantém o seguinte invariante de três partes (p. 521):</p>
        <ol>
          <li>$A = \\{(v, v.\\pi) : v \\in V - \\{r\\} - Q\\}$ é o conjunto de arestas da árvore única já construída sobre $V - Q$.</li>
          <li>Os vértices já colocados na árvore geradora mínima são aqueles em $V - Q$.</li>
          <li>Para todo vértice $v \\in Q$, se $v.\\pi \\neq \\text{NIL}$, então $v.\\text{chave} < \\infty$ e $v.\\text{chave}$ é o peso de uma aresta leve $(v, v.\\pi)$ que conecta $v$ a algum vértice já pertencente à árvore $V - Q$.</li>
        </ol>

        <div class="canonical-table-wrap">
          <table class="canonical-table">
            <thead>
              <tr>
                <th>Implementação da Fila de Prioridade $Q$ em <code>MST-PRIM</code></th>
                <th>Inicialização de $Q$ (Linhas 1–5)</th>
                <th>$|V|$ chamadas a <code>EXTRACT-MIN(Q)</code> (Linha 7)</th>
                <th>$O(E)$ chamadas a <code>DECREASE-KEY</code> (Linha 11)</th>
                <th>Complexidade Total de <code>MST-PRIM</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Arranjo / Matriz de Adjacências (Ex. 23.2-2)</strong></td>
                <td>$O(V)$</td>
                <td>$|V| \\times O(V) = O(V^2)$</td>
                <td>$O(V^2) \\times O(1) = O(V^2)$</td>
                <td><strong>$\\Theta(V^2)$</strong> (ótimo para grafos densos $|E| = \\Theta(V^2)$)</td>
              </tr>
              <tr>
                <td><strong>Heap Binário Mínimo (Cap. 6)</strong></td>
                <td>$O(V)$ via <code>BUILD-MIN-HEAP</code></td>
                <td>$|V| \\times O(\\lg V) = O(V \\lg V)$</td>
                <td>$O(E) \\times O(\\lg V) = O(E \\lg V)$</td>
                <td><strong>$O(V \\lg V + E \\lg V) = O(E \\lg V)$</strong> (igual a Kruskal)</td>
              </tr>
              <tr>
                <td><strong>Heap de Fibonacci (Cap. 19)</strong></td>
                <td>$O(V)$</td>
                <td>$|V| \\times O(\\lg V)\\text{ amort.} = O(V \\lg V)$</td>
                <td>$O(E) \\times O(1)\\text{ amort.} = O(E)$</td>
                <td><strong>$O(E + V \\lg V)$</strong> (superior quando $|V| \\ll |E|$, i.e., $|E| = \\omega(V)$)</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    }
  ];

  /* ========================================================================
     BANCADA INTERATIVA DUPLA DO MÓDULO 11:
     (1) SIMULADOR PASSO A PASSO DE BFS & DFS (CORES, u.d/u.f, PARÊNTESES E ARESTAS)
     (2) SIMULADOR COMPARATIVO DE MST: KRUSKAL (UNION-FIND) vs. PRIM (FILA Q)
     ======================================================================== */
  function initWorkbenches() {
    const mount = document.getElementById("workbench-mod11-mount");
    if (!mount) return;

    mount.innerHTML = `
      <div class="workbench-box" style="margin-top:1.5rem;">
        <div class="workbench-header">
          <span class="workbench-title">[ BANCADA INTERATIVA DUPLA • MÓDULO 11: BUSCAS EM GRAFOS (CAP. 22) & MST (CAP. 23) ]</span>
          <span class="bracket-tag emerald">BFS • DFS • KRUSKAL • PRIM</span>
        </div>
        <div class="workbench-body">
          <div style="display:flex;gap:0.6rem;flex-wrap:wrap;margin-bottom:1.1rem;border-bottom:2px solid var(--ink-primary);padding-bottom:0.8rem;">
            <button id="m11-tab-search" class="wb-btn primary" onclick="switchMod11WorkbenchTab('search')">
              [ LABORATÓRIO 01: BFS vs. DFS (CORES, CARIMBOS u.d/u.f, PARÊNTESES & ARESTAS) ]
            </button>
            <button id="m11-tab-mst" class="wb-btn" onclick="switchMod11WorkbenchTab('mst')">
              [ LABORATÓRIO 02: ÁRVORE GERADORA MÍNIMA (MST-KRUSKAL vs. MST-PRIM) ]
            </button>
          </div>

          <!-- PAINEL 1: BFS & DFS -->
          <div id="m11-panel-search">
            <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
              Explore passo a passo os algoritmos do <strong>Capítulo 22</strong> sobre o grafo dirigido de 6 vértices ($u, v, w, x, y, z$ — Figura 22.4 do CLRS, p. 496). Alterne entre <strong><code>DFS(G)</code></strong> (observando os carimbos $u.d/u.f$, a expressão de parênteses do Teorema 22.7 e a classificação das arestas em <strong>T</strong> Árvore, <strong>B</strong> Retorno, <strong>F</strong> Direta e <strong>C</strong> Cruzada) e <strong><code>BFS(G, u)</code></strong> (observando a fila FIFO $Q$ com no máximo 2 distâncias pelo Lema 22.3):
            </p>
            <div class="workbench-controls" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                <button id="m11-mode-dfs" class="wb-btn primary" onclick="setMod11SearchMode('dfs')">[ Executar DFS(G) — Fig. 22.4 ]</button>
                <button id="m11-mode-bfs" class="wb-btn" onclick="setMod11SearchMode('bfs')">[ Executar BFS(G, u) — Camadas FIFO ]</button>
              </div>
              <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
                <button class="wb-btn" id="m11-s-prev" onclick="stepMod11Search(-1)">◀ Anterior</button>
                <button class="wb-btn primary" id="m11-s-next" onclick="stepMod11Search(1)">Próximo Passo ▶</button>
                <button class="wb-btn" onclick="stepMod11Search(-999)">↺ Reiniciar</button>
              </div>
            </div>

            <div id="m11-search-telemetry" class="workbench-telemetry-strip" style="margin-top:0.85rem;"></div>
            <div id="m11-search-stage" style="background:var(--bg-card);border:var(--border-thin);padding:1rem;margin:0.85rem 0;"></div>
            <div id="m11-search-log" class="wb-log-panel"></div>
          </div>

          <!-- PAINEL 2: KRUSKAL & PRIM -->
          <div id="m11-panel-mst" style="display:none;">
            <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
              Compare os algoritmos do <strong>Capítulo 23</strong> sobre um grafo conexo ponderado de 6 vértices ($a, b, c, d, e, f$) e 9 arestas (MST de peso ótimo $w(T) = 16$). Veja como <strong><code>MST-KRUSKAL</code></strong> examina arestas por ordem crescente de peso mantendo conjuntos disjuntos (Union-Find), enquanto <strong><code>MST-PRIM(G, w, a)</code></strong> cresce uma única árvore atualizando $v.\\text{chave}$ na fila de prioridade mínima $Q$:
            </p>
            <div class="workbench-controls" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                <button id="m11-mode-kruskal" class="wb-btn primary" onclick="setMod11MstMode('kruskal')">[ MST-KRUSKAL (Conjuntos Disjuntos) ]</button>
                <button id="m11-mode-prim" class="wb-btn" onclick="setMod11MstMode('prim')">[ MST-PRIM (Raiz a • Fila de Prioridade Q) ]</button>
              </div>
              <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
                <button class="wb-btn" id="m11-m-prev" onclick="stepMod11Mst(-1)">◀ Anterior</button>
                <button class="wb-btn primary" id="m11-m-next" onclick="stepMod11Mst(1)">Próximo Passo ▶</button>
                <button class="wb-btn" onclick="stepMod11Mst(-999)">↺ Reiniciar</button>
              </div>
            </div>

            <div id="m11-mst-telemetry" class="workbench-telemetry-strip" style="margin-top:0.85rem;"></div>
            <div id="m11-mst-stage" style="background:var(--bg-card);border:var(--border-thin);padding:1rem;margin:0.85rem 0;"></div>
            <div id="m11-mst-log" class="wb-log-panel"></div>
          </div>
        </div>
      </div>
    `;

    // Dados do Grafo Figura 22.4 (CLRS, p. 496): V = {u, v, w, x, y, z}
    const V22 = ["u", "v", "w", "x", "y", "z"];
    const Adj22 = {
      u: ["v", "x"],
      v: ["y"],
      w: ["y", "z"],
      x: ["v"],
      y: ["x"],
      z: ["z"]
    };

    function buildDfsTrace() {
      const steps = [];
      const state = {};
      V22.forEach((k) => {
        state[k] = { cor: "BRANCO", d: "—", f: "—", pi: "NIL" };
      });
      const edges = {};
      let time = 0;
      const parens = [];

      const snap = (msg, activeEdge) => {
        const clone = {};
        V22.forEach((k) => (clone[k] = { ...state[k] }));
        steps.push({
          mode: "dfs",
          time,
          vertices: clone,
          edges: { ...edges },
          parens: parens.join(" "),
          activeEdge: activeEdge || "—",
          msg
        });
      };

      snap("Inicialização (Linhas 1–4 de DFS): Todos os vértices u ∈ V recebem u.cor = BRANCO, u.π = NIL e tempo = 0.", "—");

      function dfsVisit(u) {
        time++;
        state[u].d = time;
        state[u].cor = "CINZENTO";
        parens.push(`(${u}`);
        snap(`DFS-VISIT(G, ${u}): Descoberto ${u} no tempo ${u}.d = ${time}; ${u}.cor = CINZENTO. Abre parêntese "(${u}".`, `${u} (descoberto)`);

        for (const v of Adj22[u]) {
          const eKey = `(${u},${v})`;
          if (state[v].cor === "BRANCO") {
            edges[eKey] = "T (Árvore)";
            state[v].pi = u;
            snap(`Explora aresta ${eKey}: como ${v}.cor == BRANCO, ${eKey} é ARESTA DE ÁRVORE (T), ${v}.π = ${u}, chama DFS-VISIT(G, ${v}).`, `${eKey} → T`);
            dfsVisit(v);
          } else if (state[v].cor === "CINZENTO") {
            edges[eKey] = "B (Retorno)";
            snap(`Explora aresta ${eKey}: como ${v}.cor == CINZENTO (ancestral ativo na pilha), ${eKey} é ARESTA DE RETORNO (Back Edge — B)!`, `${eKey} → B`);
          } else {
            if (state[u].d < state[v].d) {
              edges[eKey] = "F (Direta)";
              snap(`Explora aresta ${eKey}: como ${v}.cor == PRETO e ${u}.d (${state[u].d}) < ${v}.d (${state[v].d}), ${eKey} é ARESTA DIRETA (Forward Edge — F)!`, `${eKey} → F`);
            } else {
              edges[eKey] = "C (Cruzada)";
              snap(`Explora aresta ${eKey}: como ${v}.cor == PRETO e ${v}.d (${state[v].d}) < ${u}.d (${state[u].d}), ${eKey} é ARESTA CRUZADA (Cross Edge — C)!`, `${eKey} → C`);
            }
          }
        }

        state[u].cor = "PRETO";
        time++;
        state[u].f = time;
        parens.push(`${u})`);
        snap(`Término de ${u} (Linhas 8–10): Lista Adj[${u}] esgotada; ${u}.cor = PRETO e ${u}.f = ${time}. Fecha parêntese "${u})".`, `${u} (terminado)`);
      }

      for (const u of V22) {
        if (state[u].cor === "BRANCO") {
          dfsVisit(u);
        }
      }

      return steps;
    }

    function buildBfsTrace() {
      const steps = [];
      const state = {};
      V22.forEach((k) => {
        state[k] = { cor: "BRANCO", d: "∞", pi: "NIL" };
      });
      const Q = [];
      const treeEdges = [];

      const snap = (msg, active) => {
        const clone = {};
        V22.forEach((k) => (clone[k] = { ...state[k] }));
        steps.push({
          mode: "bfs",
          vertices: clone,
          queue: Q.map((x) => `${x}(d=${state[x].d})`),
          treeEdges: treeEdges.slice(),
          active: active || "—",
          msg
        });
      };

      state["u"].cor = "CINZENTO";
      state["u"].d = 0;
      Q.push("u");
      snap("Inicialização (Linhas 1–9 de BFS(G, u)): Fonte u recebe u.cor = CINZENTO, u.d = 0 e é enfileirada em Q = ⟨u⟩.", "ENQUEUE(Q, u)");

      while (Q.length > 0) {
        const u = Q.shift();
        snap(`Linha 11: DEQUEUE(Q) remove u = ${u} (distância ${state[u].d}). Examinando Adj[${u}] = [${Adj22[u].join(", ")}].`, `DEQUEUE → ${u}`);
        for (const v of Adj22[u]) {
          if (state[v].cor === "BRANCO") {
            state[v].cor = "CINZENTO";
            state[v].d = state[u].d + 1;
            state[v].pi = u;
            Q.push(v);
            treeEdges.push(`(${u},${v})`);
            snap(`Aresta (${u},${v}): ${v} era BRANCO → torna-se CINZENTO, ${v}.d = ${state[v].d}, ${v}.π = ${u}, ENQUEUE(Q, ${v}). (Lema 22.3 mantido!)`, `(${u},${v}) descoberto`);
          } else {
            snap(`Aresta (${u},${v}): ${v} já é ${state[v].cor} (d = ${state[v].d}), logo não é branco e não entra novamente em Q.`, `(${u},${v}) ignorado`);
          }
        }
        state[u].cor = "PRETO";
        snap(`Linha 18: Todos os vizinhos de ${u} foram inspecionados; ${u}.cor = PRETO.`, `${u} → PRETO`);
      }

      snap("Término de BFS(G, u): Fila Q vazia! Vértices alcançáveis de u (u, v, x, y) têm v.d = δ(u, v) exato (Teorema 22.5); w e z permanecem BRANCOS com d = ∞ pois são inalcançáveis a partir de u.", "Concluído");
      return steps;
    }

    // Dados do Grafo Ponderado para MST (6 vértices a..f, 9 arestas, MST = 16)
    const V23 = ["a", "b", "c", "d", "e", "f"];
    const Edges23 = [
      { u: "b", v: "d", w: 1 },
      { u: "d", v: "f", w: 2 },
      { u: "a", v: "c", w: 3 },
      { u: "a", v: "b", w: 4 },
      { u: "b", v: "c", w: 5 },
      { u: "c", v: "d", w: 6 },
      { u: "d", v: "e", w: 7 },
      { u: "c", v: "e", w: 8 },
      { u: "e", v: "f", w: 9 }
    ];

    function buildKruskalTrace() {
      const steps = [];
      let comp = V23.map((v) => [v]);
      const A = [];
      let totalW = 0;
      const edgeStatus = {};
      Edges23.forEach((e) => (edgeStatus[`(${e.u},${e.v}):${e.w}`] = "Pendente"));

      const findCompIdx = (x) => comp.findIndex((c) => c.includes(x));
      const snap = (msg, curEdge) => {
        steps.push({
          mode: "kruskal",
          A: A.slice(),
          totalW,
          sets: comp.map((c) => `{${c.join(",")}}`).join(" , "),
          edgeStatus: { ...edgeStatus },
          curEdge,
          msg
        });
      };

      snap("Inicialização (Linhas 1–4 de MST-KRUSKAL): A = ∅, MAKE-SET(v) cria 6 conjuntos disjuntos unitários e as 9 arestas são ordenadas por peso w crescente.", "—");

      for (const e of Edges23) {
        const key = `(${e.u},${e.v}):${e.w}`;
        const i1 = findCompIdx(e.u);
        const i2 = findCompIdx(e.v);
        if (i1 !== i2) {
          A.push(`${e.u}-${e.v} (w=${e.w})`);
          totalW += e.w;
          edgeStatus[key] = "✓ Aceita (Segura)";
          const merged = [...comp[i1], ...comp[i2]].sort();
          comp = comp.filter((_, idx) => idx !== i1 && idx !== i2);
          comp.push(merged);
          snap(`Examina ${key}: FIND-SET(${e.u}) ≠ FIND-SET(${e.v}). Aresta leve segura (Corolário 23.2)! Adiciona a A e executa UNION(${e.u}, ${e.v}). Peso parcial = ${totalW}.`, key);
        } else {
          edgeStatus[key] = "✗ Rejeitada (Ciclo)";
          snap(`Examina ${key}: FIND-SET(${e.u}) == FIND-SET(${e.v}) (ambos no conjunto {${comp[i1].join(",")}}). Descartada pois formaria ciclo!`, key);
        }
      }

      snap(`Término de MST-KRUSKAL: Floresta reduzida a 1 única árvore geradora mínima com |V|-1 = 5 arestas e peso mínimo total w(T) = ${totalW}.`, "Fim");
      return steps;
    }

    function buildPrimTrace() {
      const steps = [];
      const adj = {};
      V23.forEach((v) => (adj[v] = []));
      Edges23.forEach((e) => {
        adj[e.u].push({ to: e.v, w: e.w });
        adj[e.v].push({ to: e.u, w: e.w });
      });

      const key = {};
      const pi = {};
      const inQ = {};
      V23.forEach((v) => {
        key[v] = Infinity;
        pi[v] = "NIL";
        inQ[v] = true;
      });
      key["a"] = 0;
      const A = [];
      let totalW = 0;

      const snap = (msg, extracted) => {
        const vState = {};
        V23.forEach((v) => {
          vState[v] = {
            chave: key[v] === Infinity ? "∞" : key[v],
            pi: pi[v],
            inQ: inQ[v]
          };
        });
        steps.push({
          mode: "prim",
          vertices: vState,
          A: A.slice(),
          totalW,
          extracted,
          msg
        });
      };

      snap("Inicialização (Linhas 1–5 de MST-PRIM com raiz r = a): a.chave = 0, demais chaves = ∞, π = NIL, e Q = {a, b, c, d, e, f}.", "—");

      for (let step = 0; step < V23.length; step++) {
        let u = null;
        let minK = Infinity;
        for (const v of V23) {
          if (inQ[v] && key[v] < minK) {
            minK = key[v];
            u = v;
          }
        }
        inQ[u] = false;
        if (pi[u] !== "NIL") {
          A.push(`${pi[u]}-${u} (w=${key[u]})`);
          totalW += key[u];
        }
        const updates = [];
        for (const nb of adj[u]) {
          if (inQ[nb.to] && nb.w < key[nb.to]) {
            key[nb.to] = nb.w;
            pi[nb.to] = u;
            updates.push(`${nb.to}.chave=${nb.w} (π=${u})`);
          }
        }
        snap(
          `Iteração ${step + 1}: EXTRACT-MIN(Q) extrai u = ${u} (chave = ${minK}). ${
            pi[u] !== "NIL" ? `Aresta segura (${pi[u]}, ${u}) entra em A.` : "Raiz inicial a."
          } Atualiza vizinhos em Q via DECREASE-KEY: ${updates.length ? updates.join(", ") : "nenhuma chave reduzida"}.`,
          u
        );
      }

      snap(`Término de MST-PRIM: Fila Q vazia! Árvore geradora mínima única A = {(v, v.π)} concluída com peso total w(T) = ${totalW}.`, "Fim");
      return steps;
    }

    let searchMode = "dfs";
    let searchTraces = { dfs: buildDfsTrace(), bfs: buildBfsTrace() };
    let searchIdx = 0;

    let mstMode = "kruskal";
    let mstTraces = { kruskal: buildKruskalTrace(), prim: buildPrimTrace() };
    let mstIdx = 0;

    window.switchMod11WorkbenchTab = function (tab) {
      const pSearch = document.getElementById("m11-panel-search");
      const pMst = document.getElementById("m11-panel-mst");
      const bSearch = document.getElementById("m11-tab-search");
      const bMst = document.getElementById("m11-tab-mst");
      if (pSearch) pSearch.style.display = tab === "search" ? "block" : "none";
      if (pMst) pMst.style.display = tab === "mst" ? "block" : "none";
      if (bSearch) bSearch.classList.toggle("primary", tab === "search");
      if (bMst) bMst.classList.toggle("primary", tab === "mst");
    };

    window.setMod11SearchMode = function (mode) {
      searchMode = mode;
      searchIdx = 0;
      const bDfs = document.getElementById("m11-mode-dfs");
      const bBfs = document.getElementById("m11-mode-bfs");
      if (bDfs) bDfs.classList.toggle("primary", mode === "dfs");
      if (bBfs) bBfs.classList.toggle("primary", mode === "bfs");
      renderMod11Search();
    };

    window.stepMod11Search = function (delta) {
      const trace = searchTraces[searchMode];
      if (delta === -999) searchIdx = 0;
      else searchIdx = Math.max(0, Math.min(trace.length - 1, searchIdx + delta));
      renderMod11Search();
    };

    function renderMod11Search() {
      const trace = searchTraces[searchMode];
      const step = trace[searchIdx];
      if (!step) return;

      const tel = document.getElementById("m11-search-telemetry");
      const stage = document.getElementById("m11-search-stage");
      const log = document.getElementById("m11-search-log");
      const prev = document.getElementById("m11-s-prev");
      const next = document.getElementById("m11-s-next");
      if (prev) prev.disabled = searchIdx === 0;
      if (next) next.disabled = searchIdx === trace.length - 1;

      const colorBadge = (c) => {
        if (c === "BRANCO") return `<span style="background:#FFF;color:#111;border:1px solid #111;padding:0.1rem 0.4rem;font-size:0.72rem;">BRANCO</span>`;
        if (c === "CINZENTO") return `<span style="background:var(--accent-amber-bg);color:#111;border:1px solid #111;padding:0.1rem 0.4rem;font-size:0.72rem;">CINZENTO</span>`;
        return `<span style="background:#111;color:#FFF;border:1px solid #111;padding:0.1rem 0.4rem;font-size:0.72rem;">PRETO</span>`;
      };

      if (step.mode === "dfs") {
        if (tel) {
          tel.innerHTML = `
            <div class="wb-stat-box"><span>ALGORITMO</span><strong>DFS(G) — Fig. 22.4</strong></div>
            <div class="wb-stat-box"><span>RELÓGIO GLOBAL</span><strong>tempo = ${step.time} / 12</strong></div>
            <div class="wb-stat-box"><span>EVENTO ATUAL</span><strong>${step.activeEdge}</strong></div>
            <div class="wb-stat-box"><span>PARÊNTESES (TEOREMA 22.7)</span><strong style="font-size:0.78rem;">${step.parens || "∅"}</strong></div>
          `;
        }
        const edgeEntries = Object.entries(step.edges);
        if (stage) {
          stage.innerHTML = `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:0.65rem;margin-bottom:0.85rem;">
              ${V22.map((v) => {
                const info = step.vertices[v];
                return `
                  <div style="border:var(--border-thin);padding:0.55rem;background:var(--bg-paper);font-family:var(--font-mono);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem;">
                      <strong style="font-size:1rem;">Vértice ${v}</strong>
                      ${colorBadge(info.cor)}
                    </div>
                    <div style="font-size:0.76rem;">d/f: <strong>${info.d} / ${info.f}</strong></div>
                    <div style="font-size:0.76rem;">π: <strong>${info.pi}</strong> | Adj: [${Adj22[v].join(",")}]</div>
                  </div>
                `;
              }).join("")}
            </div>
            <div style="font-family:var(--font-mono);font-size:0.78rem;border-top:1px solid var(--ink-primary);padding-top:0.6rem;">
              <strong>CLASSIFICAÇÃO DE ARESTAS EXPLORADAS (T/B/F/C):</strong>
              ${
                edgeEntries.length
                  ? edgeEntries.map(([k, v]) => `<span class="concept-pill" style="margin:0.2rem;">${k}: ${v}</span>`).join("")
                  : " <em>Nenhuma aresta explorada ainda.</em>"
              }
            </div>
          `;
        }
      } else {
        if (tel) {
          tel.innerHTML = `
            <div class="wb-stat-box"><span>ALGORITMO</span><strong>BFS(G, u) — Fonte s = u</strong></div>
            <div class="wb-stat-box"><span>FILA FIFO Q (LEMA 22.3)</span><strong>⟨ ${step.queue.join(", ") || "∅"} ⟩</strong></div>
            <div class="wb-stat-box"><span>OPERAÇÃO ATIVA</span><strong>${step.active}</strong></div>
            <div class="wb-stat-box"><span>ARESTAS DE G_π</span><strong>${step.treeEdges.join(", ") || "∅"}</strong></div>
          `;
        }
        if (stage) {
          stage.innerHTML = `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:0.65rem;">
              ${V22.map((v) => {
                const info = step.vertices[v];
                return `
                  <div style="border:var(--border-thin);padding:0.55rem;background:var(--bg-paper);font-family:var(--font-mono);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem;">
                      <strong style="font-size:1rem;">Vértice ${v}</strong>
                      ${colorBadge(info.cor)}
                    </div>
                    <div style="font-size:0.76rem;">Distância ${v}.d: <strong>${info.d}</strong></div>
                    <div style="font-size:0.76rem;">Pai ${v}.π: <strong>${info.pi}</strong></div>
                  </div>
                `;
              }).join("")}
            </div>
          `;
        }
      }

      if (log) {
        log.innerHTML = `[PASSO ${searchIdx + 1}/${trace.length}] ${step.msg}`;
      }
    }

    window.setMod11MstMode = function (mode) {
      mstMode = mode;
      mstIdx = 0;
      const bK = document.getElementById("m11-mode-kruskal");
      const bP = document.getElementById("m11-mode-prim");
      if (bK) bK.classList.toggle("primary", mode === "kruskal");
      if (bP) bP.classList.toggle("primary", mode === "prim");
      renderMod11Mst();
    };

    window.stepMod11Mst = function (delta) {
      const trace = mstTraces[mstMode];
      if (delta === -999) mstIdx = 0;
      else mstIdx = Math.max(0, Math.min(trace.length - 1, mstIdx + delta));
      renderMod11Mst();
    };

    function renderMod11Mst() {
      const trace = mstTraces[mstMode];
      const step = trace[mstIdx];
      if (!step) return;

      const tel = document.getElementById("m11-mst-telemetry");
      const stage = document.getElementById("m11-mst-stage");
      const log = document.getElementById("m11-mst-log");
      const prev = document.getElementById("m11-m-prev");
      const next = document.getElementById("m11-m-next");
      if (prev) prev.disabled = mstIdx === 0;
      if (next) next.disabled = mstIdx === trace.length - 1;

      if (step.mode === "kruskal") {
        if (tel) {
          tel.innerHTML = `
            <div class="wb-stat-box"><span>ALGORITMO</span><strong>MST-KRUSKAL(G, w)</strong></div>
            <div class="wb-stat-box"><span>ARESTA ATUAL</span><strong>${step.curEdge}</strong></div>
            <div class="wb-stat-box"><span>PESO ACUMULADO w(A)</span><strong>${step.totalW} (Meta: 16)</strong></div>
            <div class="wb-stat-box"><span>CONJUNTOS DISJUNTOS</span><strong style="font-size:0.75rem;">${step.sets}</strong></div>
          `;
        }
        if (stage) {
          stage.innerHTML = `
            <div style="font-family:var(--font-mono);font-size:0.8rem;margin-bottom:0.7rem;">
              <strong>ARESTAS ORDENADAS POR PESO CRESCENTE (LINHA 4 DE MST-KRUSKAL):</strong>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:0.55rem;margin-bottom:0.8rem;">
              ${Object.entries(step.edgeStatus)
                .map(([k, st]) => {
                  let bg = "var(--bg-paper)";
                  if (st.includes("Aceita")) bg = "var(--accent-emerald-bg)";
                  else if (st.includes("Rejeitada")) bg = "#F8D7DA";
                  return `
                    <div style="border:var(--border-thin);padding:0.45rem 0.6rem;background:${bg};font-family:var(--font-mono);font-size:0.76rem;">
                      <div><strong>${k}</strong></div>
                      <div>${st}</div>
                    </div>
                  `;
                })
                .join("")}
            </div>
            <div style="font-family:var(--font-mono);font-size:0.8rem;border-top:1px solid var(--ink-primary);padding-top:0.55rem;">
              <strong>CONJUNTO A DE ARESTAS SEGURAS (${step.A.length}/5):</strong> ${step.A.join(" , ") || "∅"}
            </div>
          `;
        }
      } else {
        if (tel) {
          tel.innerHTML = `
            <div class="wb-stat-box"><span>ALGORITMO</span><strong>MST-PRIM(G, w, a)</strong></div>
            <div class="wb-stat-box"><span>EXTRACT-MIN(Q)</span><strong>u = ${step.extracted}</strong></div>
            <div class="wb-stat-box"><span>PESO ACUMULADO w(A)</span><strong>${step.totalW} (Meta: 16)</strong></div>
            <div class="wb-stat-box"><span>ARESTAS EM A (${step.A.length}/5)</span><strong style="font-size:0.75rem;">${step.A.join(", ") || "∅"}</strong></div>
          `;
        }
        if (stage) {
          stage.innerHTML = `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:0.65rem;">
              ${V23.map((v) => {
                const info = step.vertices[v];
                const bg = info.inQ ? "var(--bg-paper)" : "var(--accent-emerald-bg)";
                return `
                  <div style="border:var(--border-thin);padding:0.55rem;background:${bg};font-family:var(--font-mono);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.3rem;">
                      <strong>Vértice ${v}</strong>
                      <span style="font-size:0.7rem;padding:0.1rem 0.35rem;border:1px solid #111;background:#FFF;">
                        ${info.inQ ? "Em Q" : "Na Árvore (V-Q)"}
                      </span>
                    </div>
                    <div style="font-size:0.76rem;">${v}.chave: <strong>${info.chave}</strong></div>
                    <div style="font-size:0.76rem;">${v}.π: <strong>${info.pi}</strong></div>
                  </div>
                `;
              }).join("")}
            </div>
          `;
        }
      }

      if (log) {
        log.innerHTML = `[PASSO ${mstIdx + 1}/${trace.length}] ${step.msg}`;
      }
    }

    renderMod11Search();
    renderMod11Mst();
  }

  /* ========================================================================
     SEÇÃO 3: 10 QUIZZES COM GABARITO COMENTADO ALTERNATIVA POR ALTERNATIVA
     ======================================================================== */
  const quizzes = [
    {
      id: "q11-1",
      type: "Múltipla Escolha",
      reference: "Apêndice B.4 & B.5 — Teorema B.2 (pp. 939–944)",
      question:
        "Seja $G = (V, E)$ um grafo não dirigido simples com $|V| = n \\ge 2$ vértices. Segundo o Lema do Cumprimento (Exercício B.4-1) e o Teorema B.2 (Propriedades de Árvores Livres), qual das afirmações abaixo é ESTRITAMENTE VERDADEIRA?",
      options: [
        {
          letter: "A",
          text: "Se G possui exatamente |E| = |V| - 1 arestas, então G é obrigatoriamente uma árvore livre, independentemente de G ser conexo ou conter ciclos.",
          isCorrect: false,
          explanation:
            "Falso! Um grafo não dirigido com |V| = 4 vértices pode consistir em um triângulo (ciclo de 3 vértices e 3 arestas) mais 1 vértice isolado: nesse caso |E| = 3 = |V| - 1, mas G não é conexo nem acíclico. Pelo Teorema B.2 (itens 4 e 5), |E| = |V| - 1 caracteriza uma árvore livre se e somente se for acompanhado de 'G é conexo' OU 'G é acíclico'."
        },
        {
          letter: "B",
          text: "Se G é acíclico e possui |E| = |V| - 1 arestas, então G é necessariamente conexo, a soma dos graus de todos os seus vértices é 2(|V| - 1), e quaisquer dois vértices em G estão ligados por um caminho simples único.",
          isCorrect: true,
          explanation:
            "Correta! Pela equivalência (5) ⇔ (1) ⇔ (2) do Teorema B.2 (pp. 943–944), todo grafo não dirigido acíclico com |E| = |V| - 1 possui exatamente k = |V| - |E| = 1 componente conexa (é uma árvore livre) e possui um caminho simples único entre quaisquer dois vértices. Além disso, pelo Lema do Cumprimento (Exercício B.4-1), ∑_{v∈V} grau(v) = 2|E| = 2(|V| - 1)."
        },
        {
          letter: "C",
          text: "Em qualquer árvore livre G com |V| ≥ 3 vértices, remover uma aresta arbitrária pode manter o grafo conexo caso a aresta incida em uma folha.",
          isCorrect: false,
          explanation:
            "Falso! Pela propriedade (3) do Teorema B.2, toda aresta de uma árvore livre é uma ponte: remover qualquer aresta — mesmo uma incidente em uma folha — desconecta o grafo em exatamente duas componentes conexas (no caso de uma folha, isola a folha do restante da árvore)."
        },
        {
          letter: "D",
          text: "Em um grafo não dirigido arbitrário, o número de vértices de grau ímpar pode ser qualquer inteiro entre 1 e |V|.",
          isCorrect: false,
          explanation:
            "Falso! Como ∑_{v∈V} grau(v) = 2|E| é um número par, a quantidade de vértices com grau ímpar em qualquer grafo não dirigido é obrigatoriamente PAR."
        }
      ]
    },
    {
      id: "q11-2",
      type: "Múltipla Escolha",
      reference: "Seção 22.1 — Representações de Grafos e Exercício 22.1-6 (pp. 483–487)",
      question:
        "Considere um grafo dirigido $G = (V, E)$ sem auto-laços. Um 'sorvedouro universal' (universal sink) é um vértice com grau de entrada $|V| - 1$ e grau de saída $0$. Sobre as representações de $G$ por Lista de Adjacências e Matriz de Adjacências, assinale a alternativa CORRETA:",
      options: [
        {
          letter: "A",
          text: "Na representação por lista de adjacências, calcular os graus de saída de todos os vértices leva tempo Θ(V + E), mas calcular os graus de entrada de todos os vértices exige tempo Θ(V²).",
          isCorrect: false,
          explanation:
            "Falso! Pelo Exercício 22.1-1 (p. 486), tanto os graus de saída quanto os graus de entrada de todos os vértices são calculados em tempo Θ(V + E) na representação por lista de adjacências: basta inicializar um arranjo in[1..|V|] = 0 em O(V) e varrer cada lista Adj[u] incrementando in[v] para cada v ∈ Adj[u] em Θ(E)."
        },
        {
          letter: "B",
          text: "Dada uma matriz de adjacências A de dimensão |V| × |V|, é impossível determinar se G possui um sorvedouro universal em tempo o(V²), pois é obrigatório inspecionar todas as |V|² entradas da matriz.",
          isCorrect: false,
          explanation:
            "Falso! Esta é a célebre exceção destacada no Exercício 22.1-6 (p. 487): é possível determinar se G contém um sorvedouro universal em apenas O(V) operações sobre a matriz de adjacências."
        },
        {
          letter: "C",
          text: "Dada a matriz de adjacências A, cada consulta a uma única célula A[i, j] (para i ≠ j) elimina imediatamente i (se A[i, j] == 1, pois i tem aresta de saída) ou j (se A[i, j] == 0, pois j não recebe aresta de i), permitindo encontrar o único candidato a sorvedouro universal e verificá-lo em tempo total O(V).",
          isCorrect: true,
          explanation:
            "Correta! No Exercício 22.1-6 (p. 487), se A[i, j] == 1, então a linha i possui um 1 e i não pode ter grau de saída 0; se A[i, j] == 0 (com i ≠ j), então a coluna j não possui 1 na posição i e j não pode ter grau de entrada |V| - 1. Assim, avançando i ou j em cada passo (no máximo 2|V| comparações), resta um único candidato k, cuja linha k (toda 0) e coluna k (toda 1 exceto A[k,k]=0) são verificadas em 2|V| passos, totalizando O(V)!"
        },
        {
          letter: "D",
          text: "A soma dos comprimentos de todas as listas de adjacências de um grafo dirigido G é 2|E|, enquanto para um grafo não dirigido é |E|.",
          isCorrect: false,
          explanation:
            "Falso! A relação é exatamente a inversa (p. 484): em um grafo dirigido, a soma dos comprimentos das listas de adjacências é |E|; em um grafo não dirigido, cada aresta {u, v} aparece tanto em Adj[u] quanto em Adj[v], somando 2|E|."
        }
      ]
    },
    {
      id: "q11-3",
      type: "Verdadeiro / Falso",
      reference: "Seção 22.2 — Lema 22.3 e Exercício 22.2-5 (pp. 490–493)",
      question:
        "Julgue a afirmação: 'Durante toda a execução de BFS(G, s), a fila FIFO Q contém vértices com no máximo dois valores distintos de distância d (e, se houver dois valores, eles são inteiros consecutivos k e k + 1). Além disso, alterar a ordem em que os vértices aparecem dentro de cada lista de adjacências G.Adj[u] pode alterar as distâncias finais v.d calculadas por BFS.'",
      options: [
        {
          letter: "V",
          text: "Verdadeiro — a fila Q tem no máximo dois valores de d, e a permutação de G.Adj[u] pode alterar tanto a árvore G_π quanto os valores finais de v.d.",
          isCorrect: false,
          explanation:
            "Incorreto! A primeira parte da afirmação é verdadeira (Lema 22.3, p. 490), mas a segunda parte é FALSA: pelo Teorema 22.5 e Exercício 22.2-5 (p. 493), o valor final u.d calculado por BFS é invariavelmente igual a δ(s, u), sendo totalmente INDEPENDENTE da ordem dos vizinhos em Adj[u] (apenas as arestas da árvore G_π podem mudar em caso de caminhos mínimos alternativos)."
        },
        {
          letter: "F",
          text: "Falso — embora o Lema 22.3 garanta que Q contenha no máximo dois valores consecutivos de d (v_r.d ≤ v_1.d + 1), o Teorema 22.5 prova que v.d = δ(s, v) depende exclusivamente da topologia de G, sendo invariante à ordem das listas de adjacências (apenas os ponteiros predecessores v.π da árvore G_π podem variar).",
          isCorrect: true,
          explanation:
            "Correta! Conforme demonstrado no Teorema 22.5 (p. 491) e discutido no Exercício 22.2-5 (p. 493), a distância v.d = δ(s, v) é uma propriedade intrínseca do grafo G e da fonte s, não sofrendo nenhuma alteração quando reordenamos as listas de adjacências."
        }
      ]
    },
    {
      id: "q11-4",
      type: "Múltipla Escolha",
      reference: "Seção 22.2 — Exercício 22.2-3 e Complexidade em Matriz (p. 493)",
      question:
        "Sobre os detalhes de implementação e complexidade do algoritmo `BFS(G, s)` (Seção 22.2, pp. 488–493), assinale a alternativa CORRETA:",
      options: [
        {
          letter: "A",
          text: "Se a linha 18 de BFS ('u.cor = PRETO') for removida do algoritmo, o procedimento entra em laço infinito caso G contenha ciclos, pois vértices cinzentos seriam enfileirados repetidamente.",
          isCorrect: false,
          explanation:
            "Falso! Como demonstra o Exercício 22.2-3 (e a nota de rodapé 1 da p. 512), o teste na linha 13 verifica apenas 'se v.cor == BRANCO'. Uma vez que um vértice descoberto é pintado de CINZENTO na linha 14, ele nunca mais é BRANCO; logo, remover a linha 18 (usando apenas 1 bit para distinguir BRANCO vs. NÃO-BRANCO) produz exatamente o mesmo resultado!"
        },
        {
          letter: "B",
          text: "A distinção entre CINZENTO e PRETO em BFS é conceitualmente útil para visualizar a fronteira na prova do Teorema 22.5, mas computacionalmente 1 único bit de cor por vértice basta; além disso, se G for representado por Matriz de Adjacências, o tempo de execução de BFS passa a ser Θ(V²).",
          isCorrect: true,
          explanation:
            "Correta! Pelo Exercício 22.2-3, remover a pintura PRETO na linha 18 não altera o comportamento de BFS (1 bit basta: descoberto vs. não descoberto). E pelo Exercício 22.2-4, com Matriz de Adjacências, inspecionar os vizinhos de cada vértice desenfileirado u requer varrer toda a linha u de tamanho |V|, levando a Θ(V + V²) = Θ(V²)."
        },
        {
          letter: "C",
          text: "Em um grafo não dirigido G, a busca em largura pode produzir arestas de retorno (back edges) que conectam um vértice u a um ancestral v com v.d ≤ u.d - 2.",
          isCorrect: false,
          explanation:
            "Falso! Pelo Problema 22-1(a) (p. 510), em uma busca em largura de um grafo não dirigido não há nenhuma aresta de retorno nem direta, e toda aresta que não é da árvore é uma aresta cruzada (u, v) satisfazendo v.d = u.d ou v.d = u.d + 1."
        },
        {
          letter: "D",
          text: "O procedimento PRINT-PATH(G, s, v) utiliza uma pilha explícita auxiliar e executa em tempo Θ(V) mesmo quando δ(s, v) = 1.",
          isCorrect: false,
          explanation:
            "Falso! PRINT-PATH(G, s, v) (p. 493) utiliza recursão direta sobre v.π e executa em tempo O(δ(s, v)), linear no número de vértices do caminho impresso."
        }
      ]
    },
    {
      id: "q11-5",
      type: "Múltipla Escolha",
      reference: "Seção 22.3 — Teorema 22.7, Corolário 22.8 e Exercício 22.3-5 (pp. 497–502)",
      question:
        "Durante a execução de `DFS(G)` em um grafo dirigido $G = (V, E)$, suponha que para dois vértices distintos $u, v \\in V$ ligada por uma aresta dirigida $(u, v) \\in E$, os carimbos de descoberta e término satisfaçam $v.d < v.f < u.d < u.f$. De acordo com o Teorema dos Parênteses (22.7) e o Exercício 22.3-5, qual é a classificação da aresta $(u, v)$ e qual era a cor de $v$ quando $(u, v)$ foi explorada?",
      options: [
        {
          letter: "A",
          text: "(u, v) é uma aresta de retorno (back edge) e v estava CINZENTO quando (u, v) foi explorada.",
          isCorrect: false,
          explanation:
            "Falso! Uma aresta de retorno ocorre se e somente se v é ancestral de u, o que pelo Exercício 22.3-5(b) equivale a v.d ≤ u.d < u.f ≤ v.f (intervalo de u contido no de v)."
        },
        {
          letter: "B",
          text: "(u, v) é uma aresta direta (forward edge) e v estava PRETO quando (u, v) foi explorada.",
          isCorrect: false,
          explanation:
            "Falso! Uma aresta direta conecta u a um descendente próprio v, o que pelo Exercício 22.3-5(a) exige u.d < v.d < v.f < u.f."
        },
        {
          letter: "C",
          text: "(u, v) é uma aresta cruzada (cross edge) e v já estava PRETO no instante em que (u, v) foi explorada a partir de u.",
          isCorrect: true,
          explanation:
            "Correta! Pelo Exercício 22.3-5(c) (p. 502) e Teorema 22.7, a desigualdade v.d < v.f < u.d < u.f significa que os intervalos [v.d, v.f] e [u.d, u.f] são completamente disjuntos e que a exploração de v começou e terminou (pintando v de PRETO em v.f) antes mesmo de u ser descoberto em u.d. Logo, quando u explora (u, v), v já é PRETO com v.d < u.d, caracterizando uma aresta cruzada (C)."
        },
        {
          letter: "D",
          text: "(u, v) é uma aresta de árvore (tree edge) e v estava BRANCO quando (u, v) foi explorada.",
          isCorrect: false,
          explanation:
            "Falso! Se v estivesse BRANCO quando (u, v) foi explorada, v seria descoberto depois de u (u.d < v.d < v.f < u.f)."
        }
      ]
    },
    {
      id: "q11-6",
      type: "Verdadeiro / Falso",
      reference: "Seção 22.3 — Teorema do Caminho Branco 22.9 e Exercícios 22.3-8 / 22.3-9 (pp. 499–502)",
      question:
        "Julgue a afirmação proposta no Exercício 22.3-8 (p. 502): 'Se um grafo dirigido G contém um caminho de u a v e se u.d < v.d em uma busca em profundidade de G, então v é obrigatoriamente um descendente de u na floresta em profundidade produzida.'",
      options: [
        {
          letter: "V",
          text: "Verdadeiro — como existe um caminho de u a v e v foi descoberto depois de u, o Teorema do Caminho Branco garante que DFS-VISIT(G, u) alcançará v.",
          isCorrect: false,
          explanation:
            "Incorreto! O Teorema do Caminho Branco (Teorema 22.9, p. 499) exige que TODOS os vértices ao longo do caminho de u a v sejam BRANCOS no instante u.d. Se algum vértice intermediário w no caminho já tiver sido descoberto antes de u (w.d < u.d, por exemplo w é um ancestral cinzento de u), o caminho não é totalmente branco em u.d!"
        },
        {
          letter: "F",
          text: "Falso — se o único caminho de u a v passar por um vértice intermediário w que já era CINZENTO no instante u.d (por exemplo, arestas w → u e w → v onde DFS visita u antes de v a partir de w, com aresta de retorno u → w), temos caminho u → w → v e u.d < v.d, mas u termina antes de v ser descoberto (u.d < u.f < v.d < v.f), logo v é irmão de u e não seu descendente!",
          isCorrect: true,
          explanation:
            "Correta! Este é o contraexemplo clássico do Exercício 22.3-8 (p. 502): considere V = {w, u, v} com arestas (w, u), (u, w) e (w, v), iniciando DFS em w e visitando u antes de v. Temos w.d = 1, u.d = 2, a aresta (u, w) encontra w CINZENTO (retorno), logo u termina em u.f = 3, e só então w visita v em v.d = 4, v.f = 5, w.f = 6. Há caminho u → w → v e u.d (2) < v.d (4), mas [u.d, u.f] = [2, 3] e [v.d, v.f] = [4, 5] são disjuntos!"
        }
      ]
    },
    {
      id: "q11-7",
      type: "Múltipla Escolha",
      reference: "Seções 22.4 & 22.5 — Ordenação Topológica e Kosaraju-Sharir (pp. 504–510)",
      question:
        "Sobre a Ordenação Topológica (`TOPOLOGICAL-SORT`) e a decomposição em Componentes Fortemente Conexas (`STRONGLY-CONNECTED-COMPONENTS`), assinale a alternativa CORRETA:",
      options: [
        {
          letter: "A",
          text: "Em um DAG G = (V, E), se existe uma aresta dirigida (u, v) ∈ E, então qualquer execução de DFS(G) garante u.d < v.d.",
          isCorrect: false,
          explanation:
            "Falso! Se a DFS começar pelo vértice v (ou por um ancestral de v que não alcança u), v será descoberto e totalmente finalizado (v.d < v.f) antes mesmo de u ser descoberto (u.d > v.f), produzindo uma aresta cruzada (u, v). O que o Teorema 22.12 garante invariavelmente para toda aresta (u, v) em um DAG é v.f < u.f (e NÃO u.d < v.d)!"
        },
        {
          letter: "B",
          text: "Pelo Lema 22.14, se C e C' são componentes fortemente conexas distintas de G e existe uma aresta (u, v) ∈ E com u ∈ C e v ∈ C', então o maior tempo de término em C é estritamente maior que o maior tempo de término em C' (f(C) > f(C')) na primeira chamada DFS(G); por isso, na segunda chamada DFS(G^T), começar pela componente de maior f(C) impede que a busca escape para outras componentes já não visitadas.",
          isCorrect: true,
          explanation:
            "Correta! Esta é exatamente a essência do Lema 22.14, Corolário 22.15 e Teorema 22.16 (pp. 508–510): como toda aresta entre SCCs em G vai de maior f para menor f, no grafo transposto G^T toda aresta entre SCCs vai de menor f para maior f (Corolário 22.15). Processando os vértices em G^T por ordem decrescente de u.f, a primeira SCC visitada é um 'sumidouro' em (G^T)^SCC e a busca em profundidade não consegue vazar para nenhuma outra SCC ainda branca!"
        },
        {
          letter: "C",
          text: "Como sugerido pelo Professor Bacon no Exercício 22.5-3, executar a segunda DFS no próprio grafo original G (sem transpor para G^T) varrendo os vértices em ordem crescente de u.f calcula sempre as componentes fortemente conexas corretamente.",
          isCorrect: false,
          explanation:
            "Falso! Como provaremos no Exercício 22.5-3, o Lema 22.14 garante f(C) > f(C') para uma aresta C → C', mas NÃO garante que o menor tempo de término em C' seja menor que todos os tempos de término em C, nem que escolher u.f crescente isole sumidouros em G."
        },
        {
          letter: "D",
          text: "O grafo de componentes G^SCC pode conter ciclos simples de comprimento maior ou igual a 2 caso o grafo original G não seja fortemente conexo.",
          isCorrect: false,
          explanation:
            "Falso! Pelo Lema 22.13 (p. 508), o grafo de componentes G^SCC de qualquer grafo dirigido G é SEMPRE um grafo acíclico dirigido (DAG): se houvesse ciclo entre C e C', todos os seus vértices pertenceriam à mesma componente fortemente conexa."
        }
      ]
    },
    {
      id: "q11-8",
      type: "Múltipla Escolha",
      reference: "Seção 23.1 — Teorema 23.1 e Exercícios 23.1-2 / 23.1-6 (pp. 515–518)",
      question:
        "Considere um grafo conexo não dirigido $G = (V, E)$ com função peso $w : E \\to \\mathbb{R}$ e um conjunto $A \\subseteq E$ contido em alguma Árvore Geradora Mínima de $G$. À luz do Teorema 23.1 e dos Exercícios 23.1-2, 23.1-3 e 23.1-6, qual das afirmações abaixo é CORRETA?",
      options: [
        {
          letter: "A",
          text: "A recíproca do Teorema 23.1 é verdadeira: se (S, V - S) é um corte qualquer que respeita A e (u, v) é uma aresta segura para A que cruza (S, V - S), então (u, v) é obrigatoriamente uma aresta leve para esse corte.",
          isCorrect: false,
          explanation:
            "Falso! Este é exatamente o erro do Professor Sabatier no Exercício 23.1-2 (p. 517). Contraexemplo: seja G um caminho de 3 vértices a — b — c com w(a, b) = 1 e w(b, c) = 2, e seja A = ∅. A única árvore geradora é T = {(a,b), (b,c)}, logo (b, c) é segura para A = ∅. Porém, para o corte S = {b} e V - S = {a, c} (que respeita A = ∅), ambas as arestas cruzam o corte e (b, c) tem peso 2 > 1 = w(a, b), NÃO sendo aresta leve para esse corte!"
        },
        {
          letter: "B",
          text: "Se uma aresta (u, v) pertence a alguma árvore geradora mínima T de G, então existe pelo menos um corte de G para o qual (u, v) é uma aresta leve.",
          isCorrect: true,
          explanation:
            "Correta! Conforme demonstrado no Exercício 23.1-3 (p. 517), se (u, v) ∈ T, considere o conjunto A = T - {(u, v)}. Remover (u, v) de T divide T em duas componentes conexas com conjuntos de vértices S e V - S. O corte (S, V - S) respeita A, e (u, v) é a única aresta de T que cruza (S, V - S). Se (u, v) não fosse uma aresta leve para esse corte, substituir (u, v) por uma aresta mais leve cruzando (S, V - S) produziria uma árvore geradora com peso estritamente menor que w(T), contradizendo que T é uma MST!"
        },
        {
          letter: "C",
          text: "Se um grafo G possui uma única árvore geradora mínima, então para todo corte de G existe uma única aresta leve que cruza o corte.",
          isCorrect: false,
          explanation:
            "Falso! Pelo Exercício 23.1-6 (p. 517), a implicação vale apenas em uma direção (se todo corte tem aresta leve única ⇒ a MST é única), mas a recíproca é FALSA! Contraexemplo: um triângulo com pesos 1, 1 e 2? Não, um triângulo com arestas (a,b)=1, (b,c)=2 e (a,c)=2 tem duas MSTs; mas considere um ciclo de 3 vértices {a,b,c} com pesos 1, 2, 3 mais uma quarta aresta? Melhor: considere um ciclo de 4 vértices a-b-c-d-a com pesos (a,b)=1, (b,c)=2, (c,d)=1, (d,a)=2? Não, considere um triângulo {a,b,c} onde (a,b)=1, (b,c)=1 e (a,c)=1? Não: considere um grafo com ciclo (a,b)=2, (b,c)=1, (a,c)=2 e uma folha? Não: basta um triângulo {a,b,c} com pesos 2, 2, 1? Não: se (a,b)=1, (b,c)=2 e adicionamos um vértice d ligado apenas a c com peso (c,d)=2? Não, se o corte separa {c} do resto {a,b,d}, as arestas que cruzam são (b,c)=2 e (c,d)=2 (duas arestas leves empatadas!), mas AMBAS são obrigatórias na única MST {(a,b), (b,c), (c,d)}!"
        },
        {
          letter: "D",
          text: "A aresta de maior peso de um grafo conexo G nunca pode pertencer a nenhuma árvore geradora mínima de G.",
          isCorrect: false,
          explanation:
            "Falso! Se a aresta de maior peso de G for uma ponte (isto é, não pertencer a nenhum ciclo de G), ela deve pertencer a TODAS as árvores geradoras de G. O Exercício 23.1-5 afirma apenas que a aresta de peso máximo de um CICLO pode ser evitada."
        }
      ]
    },
    {
      id: "q11-9",
      type: "Múltipla Escolha",
      reference: "Seção 23.2 — Algoritmos de Kruskal e Prim (pp. 518–523)",
      question:
        "Compare o Algoritmo de Kruskal (`MST-KRUSKAL`) e o Algoritmo de Prim (`MST-PRIM`) em um grafo conexo não dirigido $G = (V, E)$ e assinale a alternativa CORRETA:",
      options: [
        {
          letter: "A",
          text: "Para um grafo denso onde |E| = Θ(V²), a implementação de MST-PRIM com Heap de Fibonacci executa em tempo Θ(V²), que é assintoticamente mais rápida que a implementação de MST-PRIM com Heap Binário, a qual executa em Θ(V² lg V).",
          isCorrect: true,
          explanation:
            "Correta! Conforme analisado na Seção 23.2 (p. 522) e no Exercício 23.2-3, quando |E| = Θ(V²), MST-PRIM com Heap Binário custa O(E lg V) = O(V² lg V) (pois realiza O(E) operações DECREASE-KEY a O(lg V) cada), enquanto MST-PRIM com Heap de Fibonacci custa O(E + V lg V) = O(V² + V lg V) = Θ(V²) (pois cada DECREASE-KEY tem custo amortizado O(1))!"
        },
        {
          letter: "B",
          text: "Para um grafo esparso onde |E| = Θ(V), a implementação de MST-PRIM com Heap de Fibonacci é assintoticamente mais rápida que a implementação com Heap Binário.",
          isCorrect: false,
          explanation:
            "Falso! Pelo Exercício 23.2-3 (p. 522), quando |E| = Θ(V), o Heap Binário leva O(E lg V) = O(V lg V) e o Heap de Fibonacci leva O(E + V lg V) = O(V + V lg V) = O(V lg V) — ambos têm exatamente a mesma complexidade assintótica! O Heap de Fibonacci só supera assintoticamente o Heap Binário quando |E| = ω(V)."
        },
        {
          letter: "C",
          text: "No algoritmo de Prim, a atualização da chave v.chave na linha 11 é identical ao algoritmo de Dijkstra: v.chave = u.chave + w(u, v).",
          isCorrect: false,
          explanation:
            "Falso! Em MST-PRIM (linha 11, p. 521), v.chave armazena apenas o peso individual da aresta mais leve que conecta v à árvore atual: v.chave = w(u, v) (e não a distância acumulada desde a raiz r como em Dijkstra)."
        },
        {
          letter: "D",
          text: "Em MST-KRUSKAL, o gargalo assintótico em grafos gerais com pesos reais arbitrários são as operações FIND-SET e UNION na floresta de conjuntos disjuntos, e não a ordenação das arestas.",
          isCorrect: false,
          explanation:
            "Falso! As operações na floresta de conjuntos disjuntos custam apenas O(E α(V)), enquanto a ordenação das arestas na linha 4 custa O(E lg E) = O(E lg V), que é o verdadeiro gargalo assintótico de Kruskal (p. 519)."
        }
      ]
    },
    {
      id: "q11-10",
      type: "Múltipla Escolha",
      reference: "Problemas 22-2 e 23-1 — Pontes, Pontos de Articulação e 2ª Melhor MST (pp. 511, 523)",
      question:
        "Sobre as propriedades estruturais avançadas dos Problemas 22-2 (Pontos de articulação e pontes via DFS) e 23-1 (Segunda melhor árvore geradora mínima), assinale a alternativa CORRETA:",
      options: [
        {
          letter: "A",
          text: "Na árvore de busca em profundidade G_π de um grafo conexo não dirigido G, a raiz r de G_π é um ponto de articulação se e somente se r possui pelo menos 1 filho em G_π.",
          isCorrect: false,
          explanation:
            "Falso! Pelo Problema 22-2(a) (p. 511), a raiz de G_π é um ponto de articulação de G se e somente se ela tem NO MÍNIMO DOIS filhos em G_π (se tiver apenas 1 filho, remover a raiz deixa toda a subárvore do único filho conexa)."
        },
        {
          letter: "B",
          text: "Se todos os pesos das arestas de um grafo conexo G forem estritamente distintos, tanto a árvore geradora mínima quanto a segunda melhor árvore geradora mínima são obrigatoriamente únicas.",
          isCorrect: false,
          explanation:
            "Falso! Pelo Problema 23-1(a) (p. 523), quando todos os pesos de arestas são distintos, a árvore geradora mínima T é única, mas a SEGUNDA melhor árvore geradora mínima NÃO precisa ser única (duas trocas distintas de arestas com a mesma diferença mínima de peso Δw > 0 podem empatar no segundo menor peso)."
        },
        {
          letter: "C",
          text: "Pelo Problema 23-1(b), se T é a árvore geradora mínima de um grafo G com pesos distintos, então uma segunda melhor árvore geradora mínima T' pode ser obtida de T trocando uma única aresta: T' = T - {(u, v)} ∪ {(x, y)}, onde (x, y) ∉ T e (u, v) é a aresta de peso máximo no único caminho simples entre x e y em T.",
          isCorrect: true,
          explanation:
            "Correta! Pelo Problema 23-1(b)-(d) (p. 523), a segunda melhor MST difere de T por uma única substituição de aresta: para cada aresta fora da árvore (x, y) ∉ T, adicioná-la a T forma um ciclo no caminho simples entre x e y em T; para minimizar o aumento de peso w(x, y) - w(u, v) > 0, devemos remover exatamente a aresta de maior peso max[x, y] nesse caminho simples em T, permitindo encontrar a 2ª melhor MST em tempo O(V²)!"
        },
        {
          letter: "D",
          text: "Em um grafo conexo não dirigido G, uma aresta e ∈ E pode ser simultaneamente uma ponte e uma aresta de retorno em uma busca em profundidade.",
          isCorrect: false,
          explanation:
            "Falso! Pelo Problema 22-2(e), uma aresta é uma ponte se e somente se não pertence a nenhum ciclo simples de G. Como toda aresta de retorno (u, v) fecha um ciclo com o caminho de arestas de árvore entre v e u, nenhuma aresta de retorno pode ser uma ponte (toda ponte é necessariamente uma aresta de árvore!)."
        }
      ]
    }
  ];

  /* ========================================================================
     SEÇÃO 4: 8 EXERCÍCIOS E PROBLEMAS CANÔNICOS RESOLVIDOS PASSO A PASSO
     ======================================================================== */
  const exercicios = [
    {
      id: "ex11-1",
      code: "EXERCÍCIOS 22.1-3 & 22.1-6",
      reference: "Seção 22.1 — Transposto G^T e Sorvedouro Universal em O(V) (pp. 486–487)",
      title: "Cálculo do Grafo Transposto $G^{\\text{T}}$ e Detecção de Sorvedouro Universal em Matriz de Adjacências em Tempo $O(V)$",
      prompt: `
        <p>Resolva os dois problemas clássicos de representação da Seção 22.1:</p>
        <ol>
          <li><strong>(Exercício 22.1-3, p. 486):</strong> O transposto de um grafo dirigido $G = (V, E)$ é o grafo $G^{\\text{T}} = (V, E^{\\text{T}})$, onde $E^{\\text{T}} = \\{(v, u) \\in V \\times V : (u, v) \\in E\\}$. Escreva pseudocódigos eficientes para construir $G^{\\text{T}}$ a partir de $G$ tanto para a representação por <strong>Lista de Adjacências</strong> quanto por <strong>Matriz de Adjacências</strong>, e analise seus tempos de execução.</li>
          <li><strong>(Exercício 22.1-6, p. 487):</strong> Mostre como determinar se um grafo dirigido $G = (V, E)$ contém um <strong>sorvedouro universal</strong> (<em>universal sink</em> — um vértice com grau de entrada $|V| - 1$ e grau de saída $0$, assumindo ausência de auto-laços) em tempo <strong>$O(V)$</strong>, dada uma <strong>matriz de adjacências</strong> $A$ de dimensão $|V| \\times |V|$ para $G$.</li>
        </ol>
      `,
      placeholder:
        "Escreva os pseudocódigos de TRANSPOSE-LIST(G), TRANSPOSE-MATRIX(A) e UNIVERSAL-SINK(A) em O(V), com a prova de eliminação...",
      solution: `
        <h4>Parte 1 — Grafo Transposto $G^{\\text{T}}$ (Exercício 22.1-3)</h4>
        <p><strong>a) Representação por Lista de Adjacências em $\\Theta(V + E)$:</strong> Alocamos um novo arranjo de listas vazias $G^{\\text{T}}.\\text{Adj}[1 \\dots |V|]$ em tempo $\\Theta(V)$. Em seguida, para cada vértice $u \\in G.V$, percorremos sua lista $G.\\text{Adj}[u]$ e, para cada vizinho $v$, inserimos $u$ na cabeça da lista ligada $G^{\\text{T}}.\\text{Adj}[v]$ em tempo $O(1)$:</p>
        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">TRANSPOSE-ADJ-LIST(G)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">para cada</span> vértice u ∈ G.V</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">   G^T.Adj[u] = NIL</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">para cada</span> vértice u ∈ G.V</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   <span class="kw">para cada</span> vértice v ∈ G.Adj[u]</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">       inserir u na frente de G^T.Adj[v]</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">retornar</span> G^T</span></div>
            </div>
          </div>
        <p><em>Complexidade:</em> O laço das linhas 1–2 custa $\\Theta(V)$ e o laço aninhado das linhas 3–5 executa a linha 5 exatamente $|E|$ vezes ($O(1)$ por inserção). Tempo total: <strong>$\\Theta(V + E)$</strong>.</p>
        <p><strong>b) Representação por Matriz de Adjacências em $\\Theta(V^2)$:</strong> Dada a matriz $A$ de $|V| \\times |V|$, a matriz de adjacências de $G^{\\text{T}}$ é simplesmente a matriz transposta $A^{\\text{T}}$ onde $a^{\\text{T}}_{ij} = a_{ji}$. Para transpor <em>in-place</em> (ou copiando), percorremos os pares $(i, j)$ com $1 \\le i < j \\le |V|$ trocando $A[i, j] \\leftrightarrow A[j, i]$ em $\\binom{|V|}{2} = \\Theta(V^2)$ operações.</p>

        <h4>Parte 2 — Sorvedouro Universal em Matriz de Adjacências em Tempo $O(V)$ (Exercício 22.1-6)</h4>
        <p><strong>Lema Chave de Eliminação em $O(1)$:</strong> Um vértice $k$ é um sorvedouro universal se e somente se a linha $k$ da matriz $A$ contém apenas $0$s ($A[k, j] = 0$ para todo $j$) e a coluna $k$ contém apenas $1$s exceto na diagonal principal ($A[i, k] = 1$ para todo $i \\neq k$, e $A[k, k] = 0$). Portanto, ao inspecionarmos uma única entrada $A[i, j]$ com $i \\neq j$:</p>
        <ul>
          <li>Se $A[i, j] == 1$: o vértice $i$ possui pelo menos uma aresta de saída $(i, j)$, logo <strong>$i$ não pode ser um sorvedouro universal</strong>!</li>
          <li>Se $A[i, j] == 0$: o vértice $j$ não possui aresta de entrada vinda de $i \\neq j$, logo <strong>$j$ não pode ser um sorvedouro universal</strong>!</li>
        </ul>
        <p>Assim, mantendo dois ponteiros $i = 1$ e $j = 1$, a cada comparação $A[i, j]$ eliminamos definitivamente um vértice ($i$ avança se $A[i, j] == 1$, ou $j$ avança se $A[i, j] == 0$). Quando um dos ponteiros ultrapassar $|V|$, o único candidato sobrevivente possível é o vértice $i$ (se $i \\le |V|$):</p>
        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">UNIVERSAL-SINK(A, n)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">i = 1</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">j = 1</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">enquanto</span> i ≤ n e j ≤ n</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   <span class="kw">se</span> A[i, j] == 1</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">       i = i + 1       <span class="cmt">// i tem aresta de saída: i não é sorvedouro</span></span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">   <span class="kw">senão</span></span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">       j = j + 1       <span class="cmt">// se i ≠ j, j não recebe de i: j não é sorvedouro</span></span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content"><span class="kw">se</span> i > n</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">   <span class="kw">retornar</span> "NÃO EXISTE SORVEDOURO UNIVERSAL"</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content"><span class="cmt">// Verificar em O(V) se o único candidato sobrevivente i é realmente sorvedouro:</span></span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content"><span class="kw">para</span> k = 1 até n</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">  <span class="kw">se</span> A[i, k] == 1</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">      <span class="kw">retornar</span> "NÃO EXISTE SORVEDOURO UNIVERSAL"</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">  <span class="kw">se</span> k ≠ i e A[k, i] == 0</span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content">      <span class="kw">retornar</span> "NÃO EXISTE SORVEDOURO UNIVERSAL"</span></div>
              <div class="code-line"><span class="line-num">16</span><span class="line-content"><span class="kw">retornar</span> i</span></div>
            </div>
          </div>
        <p><em>Análise de Corretude e Complexidade $O(V)$:</em> No laço <code>enquanto</code> (linhas 3–7), cada iteração incrementa $i$ ou $j$, executando no máximo $2n$ iterações. Qualquer verdadeiro sorvedouro universal $s$ tem sua linha $s$ inteiramente nula ($A[s, j] = 0$ para todo $j = 1 \\dots n$); portanto, assim que o ponteiro $i$ atingir $s$, $A[s, j]$ será sempre $0$, fazendo $j$ avançar até $n + 1$ sem nunca incrementar $i$ além de $s$! Em seguida, o laço das linhas 11–15 verifica a linha $i$ e a coluna $i$ em $2n$ acessos. Tempo total: <strong>$\\Theta(V)$</strong>! $\\blacksquare$</p>
      `
    },
    {
      id: "ex11-2",
      code: "EXERCÍCIOS 22.2-7 & 22.2-8",
      reference: "Seção 22.2 — Bipartição de Grafos (Lutadores) e Diâmetro de uma Árvore (pp. 493–494)",
      title: "Bipartição de Grafos ('Bonzinhos' vs. 'Vilões') em $O(n + r)$ e Cálculo do Diâmetro de uma Árvore em $O(V)$",
      prompt: `
        <p>Resolva os dois problemas clássicos de aplicação da Busca em Largura (Seção 22.2):</p>
        <ol>
          <li><strong>(Exercício 22.2-7, p. 493):</strong> Há dois tipos de lutadores profissionais: os "bonzinhos" e os "vilões". Temos $n$ lutadores e uma lista de $r$ pares de lutadores entre os quais há rivalidade. Projete um algoritmo de tempo $O(n + r)$ que determine se é possível designar alguns dos lutadores como bonzinhos e os restantes como vilões de modo que toda rivalidade ocorra sempre entre um bonzinho e um vilão (e, se for possível, produza tal designação).</li>
          <li><strong>(Exercício 22.2-8, p. 494):</strong> O <strong>diâmetro</strong> de uma árvore $T = (V, E)$ é definido por $\\max_{u, v \\in V} \\delta(u, v)$, isto é, a maior de todas as distâncias de caminhos mínimos na árvore. Dê um algoritmo de tempo linear $O(V)$ para calcular o diâmetro de uma árvore e demonstre sua corretude.</li>
        </ol>
      `,
      placeholder:
        "Modele os lutadores como grafo bipartido via paridade de u.d na BFS e apresente o algoritmo de Dupla BFS (ou DP em árvore) para o diâmetro...",
      solution: `
        <h4>Parte 1 — Bipartição de Lutadores via Paridade de <code>BFS</code> em $O(n + r)$ (Exercício 22.2-7)</h4>
        <p><strong>Modelagem:</strong> Construímos um grafo não dirigido $G = (V, E)$ em tempo $O(n + r)$ onde $|V| = n$ (um vértice por lutador) e $|E| = r$ (uma aresta não dirigida $(u, v)$ para cada rivalidade). O problema equivale exatamente a determinar se $G$ é <strong>bipartido</strong> (2-colorível, Problema B-1).</p>
        <p><strong>Algoritmo em $O(n + r)$:</strong> Como $G$ pode ter várias componentes conexas, percorremos todos os vértices $s \\in V$; sempre que encontramos $s.\\text{cor} == \\text{BRANCO}$, iniciamos uma <code>BFS</code> a partir de $s$ definindo $s.d = 0$ e atribuindo a cada vértice descoberto $v$ o tipo:</p>
        $$v.\\text{tipo} = \\begin{cases} \\text{BONZINHO} & \\text{se } v.d \\text{ é par}, \\\\ \\text{VILÃO} & \\text{se } v.d \\text{ é ímpar}. \\end{cases}$$
        <p>Após concluir as buscas em todas as componentes, varremos todas as $r$ arestas $(u, v) \\in E$: se para alguma aresta tivermos $u.\\text{tipo} == v.\\text{tipo}$, retornamos <code>IMPOSSÍVEL</code>; caso contrário, a atribuição $v.\\text{tipo}$ é válida!</p>
        <p><em>Prova de Corretude:</em> Em cada componente conexa com raiz $s$, se $G$ for bipartido, qualquer caminho de $s$ a $v$ tem a mesma paridade de $\\delta(s, v) = v.d$, logo todas as arestas da árvore ligam níveis de paridades opostas ($u.d$ e $u.d + 1$). Se existir uma aresta $(u, v) \\in E$ com $u.\\text{tipo} == v.\\text{tipo}$, então $u.d \\equiv v.d \\pmod 2$ (pelo Problema 22-1(a), $u.d = v.d$), e os caminhos de $u$ e $v$ até seu ancestral comum mais baixo na árvore de <code>BFS</code> juntamente com $(u, v)$ formam um <strong>ciclo de comprimento ímpar</strong>, provando que nenhuma bipartição existe. Tempo total: $O(n + r)$.</p>

        <h4>Parte 2 — Diâmetro de uma Árvore em Tempo Linear $O(V)$ (Exercício 22.2-8)</h4>
        <p>Em uma árvore $T = (V, E)$, temos $|E| = |V| - 1$, logo cada execução de <code>BFS</code> custa $O(V + E) = O(V)$. Existem duas soluções canônicas em tempo $O(V)$:</p>
        <p><strong>Método 1 (Dupla Busca em Largura — 2-Sweep BFS):</strong></p>
        <ol>
          <li>Escolha um vértice arbitrário $x \\in V$ e execute <code>BFS(T, x)</code> para encontrar um vértice $u \\in V$ que maximize $\\delta(x, u)$.</li>
          <li>Execute uma segunda busca <code>BFS(T, u)</code> a partir de $u$ e encontre um vértice $v \\in V$ que maximize $\\delta(u, v)$.</li>
          <li>Retorne $\\delta(u, v)$ como o diâmetro da árvore (e o caminho de $u$ a $v$ como o caminho diametral).</li>
        </ol>
        <p><em>Demonstração de Corretude da Dupla BFS:</em> Sejam $a$ e $b$ dois vértices quaisquer que realizam o diâmetro real $D = \\delta(a, b)$ de $T$, e seja $u$ o vértice mais distante de $x$ encontrado no Passo 1 (logo $\\delta(x, u) \\ge \\delta(x, a)$ e $\\delta(x, u) \\ge \\delta(x, b)$). Como $T$ é uma árvore conexa acíclica, os caminhos simples únicos entre $x, u, a, b$ se intersectam na árvore. Seja $w$ o vértice na interseção do caminho de $a$ a $b$ com o caminho vindo de $x$. Para que $\\delta(a, b) = \\delta(a, w) + \\delta(w, b)$ seja máximo e $\\delta(x, u)$ seja máximo a partir de $x$, a subárvore que contém $u$ a partir de $w$ tem profundidade pelo menos $\\max(\\delta(w, a), \\delta(w, b))$, o que implica que $u$ é ele próprio uma extremidade de um caminho de comprimento máximo $D$, e portanto $\\max_{v \\in V} \\delta(u, v) = \\delta(a, b) = D$!</p>
        <p><strong>Método 2 (Programação Dinâmica em Árvore via 1 única DFS):</strong> Enraíze $T$ arbitrariamente em $r$. Para cada nó $x$, calcule recursivamente em pós-ordem as duas maiores alturas $h_1(x) \\ge h_2(x)$ das subárvores de seus filhos (onde $h = 0$ se não houver filho). O maior caminho simples cujo ancestral mais alto é $x$ tem comprimento $h_1(x) + h_2(x)$ (ou $h_1(x)$ se $x$ tiver apenas 1 filho). O diâmetro de $T$ é $\\max_{x \\in V} \\text{caminho\\_max}(x)$, calculado em uma única passagem $O(V)$. $\\blacksquare$</p>
      `
    },
    {
      id: "ex11-3",
      code: "EXERCÍCIOS 22.3-5 & 22.3-12",
      reference: "Seção 22.3 — Intervalos [u.d, u.f] por Tipo de Aresta e Componentes Conexas (p. 502)",
      title: "Demonstração da Caracterização de Arestas (T, F, B, C) por Intervalos $[u.d, u.f]$ e Rotulação de Componentes Conexas",
      prompt: `
        <p>Demonstre rigorosamente as propriedades da Busca em Profundidade pedidas nos Exercícios 22.3-5 e 22.3-12 (p. 502):</p>
        <ol>
          <li><strong>(Exercício 22.3-5):</strong> Mostre que, em um grafo dirigido $G = (V, E)$, uma aresta $(u, v) \\in E$ é:
            <ul>
              <li><strong>(a)</strong> uma aresta de árvore ou aresta direta se e somente se $u.d < v.d < v.f < u.f$;</li>
              <li><strong>(b)</strong> uma aresta de retorno se e somente se $v.d \\le u.d < u.f \\le v.f$ (com desigualdade estrita se $u \\neq v$);</li>
              <li><strong>(c)</strong> uma aresta cruzada se e somente se $v.d < v.f < u.d < u.f$.</li>
            </ul>
          </li>
          <li><strong>(Exercício 22.3-12):</strong> Mostre como modificar <code>DFS(G)</code> em um grafo não dirigido $G$ para atribuir a cada vértice $v$ um rótulo inteiro $v.\\text{cc} \\in \\{1, \\dots, k\\}$ (onde $k$ é o número de componentes conexas de $G$) tal que $u.\\text{cc} = v.\\text{cc} \\iff u$ e $v$ pertencem à mesma componente conexa.</li>
        </ol>
      `,
      placeholder:
        "Use o Corolário 22.8 e o Teorema dos Parênteses (22.7) para provar (a), (b) e (c), e escreva o pseudocódigo de DFS com contador k de componentes...",
      solution: `
        <h4>Parte 1 — Caracterização de Arestas por Intervalos $[u.d, u.f]$ (Exercício 22.3-5)</h4>
        <ul>
          <li><strong>(a) Árvore ou Direta $\\iff u.d < v.d < v.f < u.f$:</strong> Pela definição da Seção 22.3 (p. 500), uma aresta $(u, v)$ é de árvore ou direta se e somente se $v$ é um <strong>descendente próprio</strong> de $u$ na floresta de busca em profundidade $G_\\pi$. Pelo <strong>Corolário 22.8 (Aninhamento de Intervalos de Descendentes, p. 499)</strong>, $v$ é um descendente próprio de $u$ em $G_\\pi$ se e somente se $u.d < v.d < v.f < u.f$.</li>
          <li><strong>(b) Aresta de Retorno $\\iff v.d \\le u.d < u.f \\le v.f$:</strong> Pela definição, $(u, v)$ é uma aresta de retorno se e somente se $v$ é um <strong>ancestral</strong> de $u$ na floresta $G_\\pi$ (incluindo o caso de auto-laço $u = v$, onde $v.d = u.d < u.f = v.f$). Se $u \\neq v$, $v$ é um ancestral próprio de $u$ (equivalentemente, $u$ é descendente próprio de $v$), o que pelo Corolário 22.8 ocorre se e somente se $v.d < u.d < u.f < v.f$.</li>
          <li><strong>(c) Aresta Cruzada $\\iff v.d < v.f < u.d < u.f$:</strong> Pela definição, $(u, v)$ é uma aresta cruzada se e somente se nem $u$ é descendente de $v$ nem $v$ é descendente de $u$. Pelo <strong>Teorema dos Parênteses (Teorema 22.7)</strong>, isso equivale a dizer que os intervalos $[u.d, u.f]$ e $[v.d, v.f]$ são completamente disjuntos: ou $v.d < v.f < u.d < u.f$ ou $u.d < u.f < v.d < v.f$. Porém, a segunda ordem ($u.d < u.f < v.d < v.f$) é <strong>impossível</strong> quando existe a aresta $(u, v) \\in E$: como $v \\in G.\\text{Adj}[u]$, a lista de adjacências de $u$ é inteiramente varrida antes de $u$ terminar em $u.f$, logo $v$ deve ser descoberto antes de $u.f$ ($v.d < u.f$). Portanto, resta exclusivamente $v.d < v.f < u.d < u.f$! $\\blacksquare$</li>
        </ul>

        <h4>Parte 2 — Identificação de Componentes Conexas via <code>DFS</code> (Exercício 22.3-12)</h4>
        <p>Em um grafo não dirigido $G = (V, E)$, pelo <strong>Teorema do Caminho Branco (Teorema 22.9)</strong>, quando <code>DFS-VISIT(G, u)</code> é invocado a partir da linha 7 de <code>DFS(G)</code> sobre uma raiz branca $u$, todos os vértices na mesma componente conexa de $u$ também estão brancos (pois nenhuma componente anterior tinha caminho até eles) e existe caminho branco de $u$ até cada um deles; logo, a árvore de busca em profundidade enraizada em $u$ conterá <strong>exatamente</strong> todos os vértices da componente conexa de $u$! Basta incrementar um contador $k$ antes de cada chamada de nível superior:</p>
        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">DFS-CONNECTED-COMPONENTS(G)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">para cada</span> vértice u ∈ G.V</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">   u.cor = BRANCO</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   u.π = NIL</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">tempo = 0</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">k = 0</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">para cada</span> vértice u ∈ G.V</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">   <span class="kw">se</span> u.cor == BRANCO</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">       k = k + 1</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">       DFS-VISIT-CC(G, u, k)</span></div>
              <div class="code-line"><span class="line-num"></span><span class="line-content"></span></div>
              <div class="code-line" style="margin-top:0.4rem;font-weight:bold;color:var(--accent-amber-border);"><span class="line-num"></span><span class="line-content">DFS-VISIT-CC(G, u, k)</span></div>
              <div class="code-line"><span class="line-num">1</span><span class="line-content">tempo = tempo + 1</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">u.d = tempo</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">u.cor = CINZENTO</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">u.cc = k</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">para cada</span> v ∈ G.Adj[u]</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">   <span class="kw">se</span> v.cor == BRANCO</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">       v.π = u</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">       DFS-VISIT-CC(G, v, k)</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">u.cor = PRETO</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">tempo = tempo + 1</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">u.f = tempo</span></div>
            </div>
          </div>
      `
    },
    {
      id: "ex11-4",
      code: "EXERCÍCIOS 22.4-2 & 22.4-3",
      reference: "Seção 22.4 — Contagem de Caminhos Simples em DAG e Detecção de Ciclo em O(V) (p. 505)",
      title: "Contagem de Caminhos Simples de $s$ a $t$ em um DAG em $\\Theta(V + E)$ e Detecção de Ciclo Não Dirigido em $O(V)$",
      prompt: `
        <p>Resolva os Exercícios 22.4-2 e 22.4-3 da Seção 22.4 (p. 505):</p>
        <ol>
          <li><strong>(Exercício 22.4-2):</strong> Dê um algoritmo de tempo linear $O(V + E)$ que tome como entrada um grafo acíclico dirigido (DAG) $G = (V, E)$ e dois vértices $s$ e $t$, e retorne o número de caminhos simples de $s$ para $t$ em $G$ (sem precisar listá-los).</li>
          <li><strong>(Exercício 22.4-3):</strong> Dê um algoritmo que determine se um dado grafo não dirigido $G = (V, E)$ contém um ciclo simples, executando no tempo <strong>$O(V)$</strong>, <em>independentemente de $|E|$</em>!</li>
        </ol>
      `,
      placeholder:
        "Para o Ex. 22.4-2, use ordenação topológica + recorrência caminhos[u] = ∑ caminhos[v]. Para o Ex. 22.4-3, use o Teorema B.2 (se |E| ≥ |V| há ciclo)...",
      solution: `
        <h4>Parte 1 — Contagem de Caminhos Simples de $s$ a $t$ em um DAG em $O(V + E)$ (Exercício 22.4-2)</h4>
        <p>Como $G$ é um DAG (acíclico), todo caminho em $G$ é automaticamente um caminho simples! Para cada vértice $u \\in V$, seja $u.\\text{caminhos}$ o número de caminhos dirigidos de $u$ até o destino $t$. Vale a recorrência exata:</p>
        $$u.\\text{caminhos} = \\begin{cases} 1 & \\text{se } u = t, \\\\ \\sum_{v \\in G.\\text{Adj}[u]} v.\\text{caminhos} & \\text{se } u \\neq t. \\end{cases}$$
        <p>Para avaliar essa soma em tempo linear sem recalcular subproblemas, podemos executar <code>TOPOLOGICAL-SORT(G)</code> em $\\Theta(V + E)$ e percorrer os vértices da direita para a esquerda (ou, equivalentemente, usar <code>DFS</code> com memoização a partir de $s$):</p>
        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">COUNT-PATHS-DAG(G, s, t)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">L = TOPOLOGICAL-SORT(G)     <span class="cmt">// lista topologicamente ordenada em Θ(V + E)</span></span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">para cada</span> u ∈ G.V</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   u.caminhos = 0</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">t.caminhos = 1</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">para cada</span> vértice u tomado em ordem INVERSA de L (de t de volta até s)</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">   <span class="kw">se</span> u ≠ t</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">       <span class="kw">para cada</span> v ∈ G.Adj[u]</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">           u.caminhos = u.caminhos + v.caminhos</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content"><span class="kw">retornar</span> s.caminhos</span></div>
            </div>
          </div>
        <p><em>Complexidade:</em> <code>TOPOLOGICAL-SORT</code> custa $\\Theta(V + E)$ e o laço nas linhas 5–8 examina cada aresta $(u, v)$ no máximo uma vez, totalizando <strong>$\\Theta(V + E)$</strong>.</p>

        <h4>Parte 2 — Detectar Ciclo em Grafo Não Dirigido em Tempo $O(V)$ Independente de $|E|$ (Exercício 22.4-3)</h4>
        <p><strong>Por que $O(V + E)$ não basta aqui?</strong> Em um grafo denso, $|E|$ pode ser $\\Theta(V^2)$, mas o enunciado exige tempo estritamente <strong>$O(V)$</strong>, independentemente de $|E|$!</p>
        <p><strong>Chave Teórica (Teorema B.2):</strong> Em qualquer grafo não dirigido <em>acíclico</em> (uma floresta) com $k \\ge 1$ componentes conexas, o número total de arestas é exatamente $|E| = |V| - k \\le |V| - 1$. Portanto, <strong>qualquer grafo não dirigido com $|E| \\ge |V|$ arestas contém obrigatoriamente pelo menos um ciclo!</strong></p>
        <p><strong>Algoritmo em $O(V)$:</strong> Executamos uma <code>DFS(G)</code> modificada mantendo um contador de arestas distintas inspecionadas (ou simplesmente parando na primeira aresta de retorno encontrada):</p>
        <ul>
          <li>Durante a <code>DFS</code>, cada aresta $(u, v)$ explorada na direção de um vértice não pai ($v \\neq u.\\pi$) ou é uma <strong>aresta de árvore</strong> (se $v$ é branco, e pode haver no máximo $|V| - 1$ arestas de árvore em todo o grafo!) ou é uma <strong>aresta de retorno</strong> (se $v$ é cinzento, Teorema 22.10).</li>
          <li>Assim que a busca encontrar a <strong>primeira aresta de retorno</strong> (um vizinho cinzento $v \\neq u.\\pi$), o algoritmo <strong>interrompe imediatamente e retorna <code>CONTÉM CICLO</code></strong>!</li>
          <li>Como pode haver no máximo $|V| - 1$ arestas de árvore antes que uma aresta de retorno seja vista (ou que o grafo termine sem ciclos), o algoritmo atravessa no máximo $|V| - 1$ arestas de árvore (vistas no máximo 2 vezes cada, ida e volta ao pai) mais no máximo $1$ aresta de retorno!</li>
        </ul>
        <p>Logo, o número máximo de passos no laço de adjacências antes de parar é $2(|V| - 1) + 1 < 2|V|$, garantindo tempo de pior caso estrito <strong>$O(V)$</strong> independentemente de $|E|$! $\\blacksquare$</p>
      `
    },
    {
      id: "ex11-5",
      code: "EXERCÍCIOS 22.5-3 & 22.5-4",
      reference: "Seção 22.5 — Contraexemplo do Prof. Bacon e Simetria de G^SCC (p. 510)",
      title: "Por que a Simplificação do Professor Bacon Falha em SCC e Demonstração de $((G^{\\text{T}})^{\\text{SCC}})^{\\text{T}} = G^{\\text{SCC}}$",
      prompt: `
        <p>Analise as propriedades estruturais do algoritmo de Componentes Fortemente Conexas (Seção 22.5, p. 510):</p>
        <ol>
          <li><strong>(Exercício 22.5-3):</strong> O Professor Bacon afirma que o algoritmo para componentes fortemente conexas seria mais simples se usasse o grafo original $G$ (em lugar da transposta $G^{\\text{T}}$) na segunda busca em profundidade e varresse os vértices em <strong>ordem crescente</strong> de tempos de término $u.f$. Construa um contraexemplo explícito mostrando que esse algoritmo falha.</li>
          <li><strong>(Exercício 22.5-4):</strong> Prove que, para qualquer grafo dirigido $G$, temos $((G^{\\text{T}})^{\\text{SCC}})^{\\text{T}} = G^{\\text{SCC}}$. Isto é, o transposto do grafo de componentes de $G^{\\text{T}}$ é idêntico ao grafo de componentes de $G$.</li>
        </ol>
      `,
      placeholder:
        "Para 22.5-3, construa um grafo com duas SCCs C1 = {a, b} e C2 = {c} com aresta b -> c onde u.f crescente começa em b ∈ C1 e invade C2...",
      solution: `
        <h4>Parte 1 — Contraexemplo para o Algoritmo do Professor Bacon (Exercício 22.5-3)</h4>
        <p><strong>Por que a ideia falha?</strong> O Lema 22.14 garante que se há uma aresta de $C_1$ para $C_2$, então $\\max_{u \\in C_1} u.f > \\max_{v \\in C_2} v.f$. Contudo, ele <strong>não</strong> garante que o <em>menor</em> tempo de término $\\min_{u \\in C_1} u.f$ seja maior que os tempos de término de $C_2$! Se um vértice $b \\in C_1$ terminar antes de todos os vértices de $C_2$, a segunda <code>DFS</code> proposta pelo Professor Bacon (em $G$ por ordem crescente de $u.f$) começará em $b \\in C_1$ e, seguindo as arestas originais de $G$, invadirá $C_2$, fundindo erroneamente $C_1$ e $C_2$ em uma única árvore!</p>
        <p><strong>Contraexemplo Concreto:</strong> Considere o grafo dirigido $G = (V, E)$ com $V = \\{a, b, c\\}$ e arestas $E = \\{(a, b), (b, a), (a, c)\\}$:</p>
        <ul>
          <li>As componentes fortemente conexas reais de $G$ são $C_1 = \\{a, b\\}$ e $C_2 = \\{c\\}$ (pois há aresta $a \\to c$, mas nenhum caminho de $c$ para $a$ ou $b$).</li>
          <li>Suponha que a primeira <code>DFS(G)</code> comece em $a$ e que $G.\\text{Adj}[a] = [b, c]$:
            <ol>
              <li>$a$ é descoberto em $a.d = 1$ e visita $b$ em $b.d = 2$.</li>
              <li>A partir de $b$, a única aresta $(b, a)$ encontra $a$ cinzento (retorno), logo $b$ termina em <strong>$b.f = 3$</strong>!</li>
              <li>De volta a $a$, $a$ visita seu segundo vizinho $c$ em $c.d = 4$; como $c$ não tem arestas de saída, $c$ termina em <strong>$c.f = 5$</strong>.</li>
              <li>Finalmente, $a$ termina em <strong>$a.f = 6$</strong>.</li>
            </ol>
          </li>
          <li>Temos os tempos de término $b.f = 3 < c.f = 5 < a.f = 6$.</li>
          <li>Se executarmos a segunda <code>DFS</code> no grafo original $G$ em <strong>ordem crescente de $u.f$</strong> ($b, c, a$), a busca começa em $b$ e, como em $G$ temos o caminho $b \\to a \\to c$, a chamada <code>DFS-VISIT(G, b)</code> descobre $\{b, a, c\}$ em uma única árvore, reportando falsamente que $\{a, b, c\}$ é uma única SCC! (Em contraste, o algoritmo correto de Kosaraju-Sharir ordena por $u.f$ decrescente: $a, c, b$; em $G^{\\text{T}}$, começando em $a$, visita apenas $\{a, b\}$ pois a aresta $(a, c)$ foi invertida para $(c, a)$!).</li>
        </ul>

        <h4>Parte 2 — Prova de $((G^{\\text{T}})^{\\text{SCC}})^{\\text{T}} = G^{\\text{SCC}}$ (Exercício 22.5-4)</h4>
        <p><strong>Demonstração:</strong></p>
        <ol>
          <li><strong>Igualdade dos conjuntos de vértices:</strong> Para quaisquer dois vértices $x, y \\in V$, existe um caminho $x \\leadsto y$ em $G$ se e somente se existe o caminho reverso $y \\leadsto x$ em $G^{\\text{T}}$. Portanto, $x$ e $y$ são mutuamente alcançáveis em $G$ ($x \\leadsto y$ e $y \\leadsto x$) se e somente se são mutuamente alcançáveis em $G^{\\text{T}}$. Logo, $G$ e $G^{\\text{T}}$ possuem exatamente as mesmas componentes fortemente conexas $C_1, C_2, \\dots, C_k$, e os conjuntos de vértices de $G^{\\text{SCC}}$ e $((G^{\\text{T}})^{\\text{SCC}})^{\\text{T}}$ são idênticos: $V^{\\text{SCC}} = \\{v_1, v_2, \\dots, v_k\\}$.</li>
          <li><strong>Igualdade dos conjuntos de arestas:</strong> Para quaisquer $i \\neq j$:
          $$(v_i, v_j) \\in E\\big(((G^{\\text{T}})^{\\text{SCC}})^{\\text{T}}\\big) \\iff (v_j, v_i) \\in E\\big((G^{\\text{T}})^{\\text{SCC}}\\big)$$
          $$\\iff \\exists y \\in C_j, x \\in C_i \\text{ tais que } (y, x) \\in E^{\\text{T}}$$
          $$\\iff \\exists x \\in C_i, y \\in C_j \\text{ tais que } (x, y) \\in E \\iff (v_i, v_j) \\in E(G^{\\text{SCC}}).$$
          Logo, os dois grafos têm os mesmos vértices e as mesmas arestas dirigidas. $\\blacksquare$</li>
        </ol>
      `
    },
    {
      id: "ex11-6",
      code: "EXERCÍCIOS 23.1-1 & 23.1-5",
      reference: "Seção 23.1 — Aresta de Peso Mínimo Global e Aresta de Peso Máximo em Ciclo (p. 517)",
      title: "Prova de que a Aresta Mais Leve Global Pertence a Alguma MST e Exclusão da Aresta Mais Pesada de um Ciclo",
      prompt: `
        <p>Demonstre usando o Teorema 23.1 e a técnica de recortar e colar da Seção 23.1 (p. 517):</p>
        <ol>
          <li><strong>(Exercício 23.1-1):</strong> Seja $(u, v)$ uma aresta de peso mínimo em um grafo conexo não dirigido $G = (V, E)$. Mostre que $(u, v)$ pertence a alguma árvore geradora mínima de $G$.</li>
          <li><strong>(Exercício 23.1-5):</strong> Seja $e = (u, v)$ uma aresta de peso máximo em algum ciclo simples do grafo conexo $G = (V, E)$. Prove que existe uma árvore geradora mínima de $G' = (V, E - \\{e\\})$ que também é uma árvore geradora mínima de $G$ (isto é, existe uma MST de $G$ que não inclui $e$).</li>
        </ol>
      `,
      placeholder:
        "Para 23.1-1, aplique o Teorema 23.1 com A = ∅ e S = {u}. Para 23.1-5, tome uma MST T de G; se e ∈ T, remova e para criar o corte (S, V-S) e substitua por outra aresta do ciclo...",
      solution: `
        <h4>Parte 1 — Aresta de Peso Mínimo Global Pertence a Alguma MST (Exercício 23.1-1)</h4>
        <p><strong>Demonstração Direta via Teorema 23.1:</strong></p>
        <ol>
          <li>Seja $A = \\emptyset$. Como o conjunto vazio é subconjunto de qualquer árvore geradora mínima de $G$, $A$ satisfaz a pré-condição do Teorema 23.1.</li>
          <li>Considere o corte $(S, V - S)$ definido por $S = \\{u\\}$ e $V - S = V - \\{u\\}$. Como $A = \\emptyset$, nenhuma aresta de $A$ cruza esse corte; logo, o corte $(S, V - S)$ <strong>respeita $A$</strong>.</li>
          <li>A aresta $(u, v)$ tem uma extremidade $u \\in S$ e outra $v \\in V - S$, portanto $(u, v)$ cruza o corte $(S, V - S)$.</li>
          <li>Como $(u, v)$ tem peso mínimo entre <em>todas</em> as arestas de $E$, ela certamente tem peso mínimo entre as arestas que cruzam $(S, V - S)$, sendo uma <strong>aresta leve</strong> para esse corte.</li>
          <li>Pelo <strong>Teorema 23.1</strong>, $(u, v)$ é segura para $A = \\emptyset$, o que significa que $\\{(u, v)\\}$ é subconjunto de alguma árvore geradora mínima de $G$. $\\blacksquare$</li>
        </ol>

        <h4>Parte 2 — Aresta de Peso Máximo em um Ciclo Pode Ser Excluída (Exercício 23.1-5)</h4>
        <p><strong>Demonstração por Recortar e Colar:</strong></p>
        <ol>
          <li>Seja $c$ um ciclo simples em $G$ no qual $e = (u, v)$ é uma aresta de peso máximo (logo $w(e') \\le w(e)$ para toda aresta $e' \\in c$).</li>
          <li>Seja $T$ uma árvore geradora mínima qualquer de $G$. Se $e \\notin T$, então $T$ já é uma árvore geradora de $G' = (V, E - \\{e\\})$ e estamos prontos.</li>
          <li>Suponha agora que $e = (u, v) \\in T$.Pelo Teorema B.2, remover $e$ de $T$ desconecta $T$ em duas componentes conexas com conjuntos de vértices $S$ (contendo $u$) e $V - S$ (contendo $v$).</li>
          <li>No ciclo $c$, removendo a aresta $e = (u, v)$, resta um caminho simples $p = c - \\{e\\}$ em $G'$ que conecta $u \\in S$ a $v \\in V - S$. Como $p$ começa em $S$ e termina em $V - S$, deve existir pelo menos uma aresta $e' = (x, y) \\in p$ (logo $e' \\neq e$) que também cruza o corte $(S, V - S)$.</li>
          <li>Como $e'$ conecta as duas componentes de $T - \\{e\\}$, o conjunto $T' = T - \\{e\\} \\cup \\{e'\\}$ é uma árvore geradora de $G$ (e de $G'$, pois $e \\notin T'$).</li>
          <li>Como $e$ tinha peso máximo no ciclo $c$ e $e' \\in c$, temos $w(e') \\le w(e)$, o que implica:
          $$w(T') = w(T) - w(e) + w(e') \\le w(T).$$
          Como $T$ é uma MST de $G$, segue que $w(T') = w(T)$, e portanto $T'$ é uma árvore geradora mínima de $G$ (e de $G'$) que não contém $e$! $\\blacksquare$</li>
        </ol>
      `
    },
    {
      id: "ex11-7",
      code: "EXERCÍCIOS 23.2-2 & 23.2-4",
      reference: "Seção 23.2 — Prim em Θ(V²) com Matriz e Kruskal com Pesos Inteiros (p. 522)",
      title: "Implementação de Prim em $\\Theta(V^2)$ para Matriz de Adjacências e Otimização de Kruskal para Pesos em $\\{1 \\dots |V|\\}$ ou $\\{1 \\dots W\\}$",
      prompt: `
        <p>Resolva os dois exercícios de engenharia algorítmica da Seção 23.2 (p. 522):</p>
        <ol>
          <li><strong>(Exercício 23.2-2):</strong> Suponha que representamos o grafo $G = (V, E)$ como uma matriz de adjacências $W = (w_{ij})$. Dê uma implementação simples do algoritmo de Prim para esse caso que seja executada em tempo $\\Theta(V^2)$ (sem necessidade de heaps sofisticados).</li>
          <li><strong>(Exercício 23.2-4):</strong> Suponha que todos os pesos de arestas em um grafo conexo sejam inteiros na faixa de $1$ a $|V|$. Com que rapidez é possível executar o algoritmo de Kruskal? E se os pesos de arestas forem inteiros na faixa de $1$ a $W$ para alguma constante $W$?</li>
        </ol>
      `,
      placeholder:
        "Para 23.2-2, implemente Q como um arranjo booleano emQ[1..|V|] e faça EXTRACT-MIN por busca linear O(V). Para 23.2-4, substitua a ordenação O(E lg E) por Counting Sort...",
      solution: `
        <h4>Parte 1 — Algoritmo de Prim em $\\Theta(V^2)$ com Matriz de Adjacências (Exercício 23.2-2)</h4>
        <p>Quando $G$ é dado por uma matriz de pesos $W[1 \\dots |V|, 1 \\dots |V|]$ (onde $W[u, v] = \\infty$ se $(u, v) \\notin E$), representamos a fila de prioridade $Q$ simplesmente por um arranjo booleano $\\text{emQ}[1 \\dots |V|]$ e um arranjo $\\text{chave}[1 \\dots |V|]$:</p>
        <ul>
          <li>Cada uma das $|V|$ operações <code>EXTRACT-MIN(Q)</code> percorre linearmente os $|V|$ vértices para encontrar $u$ com $\\text{emQ}[u] == \\text{TRUE}$ e $\\text{chave}[u]$ mínima, custando $\\Theta(V)$ por extração e $\\Theta(V^2)$ no total.</li>
          <li>A atualização <code>DECREASE-KEY</code> na linha 11 é uma simples atribuição em arranjo $\\text{chave}[v] = W[u, v]$ em tempo $O(1)$!</li>
        </ul>
        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">MST-PRIM-MATRIX(W, n, r)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">para</span> u = 1 até n</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">   u.chave = ∞</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   u.π = NIL</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   u.emQ = TRUE</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">r.chave = 0</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">para</span> iter = 1 até n</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">   <span class="cmt">// EXTRACT-MIN por varredura linear em O(V):</span></span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">   u = argmin_{x : x.emQ == TRUE} (x.chave)</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">   u.emQ = FALSE</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">  <span class="kw">para</span> v = 1 até n</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">      <span class="kw">se</span> v.emQ == TRUE e W[u, v] < v.chave</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">          v.π = u</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">          v.chave = W[u, v]</span></div>
            </div>
          </div>
        <p><em>Complexidade:</em> O laço externo (linha 6) executa $n = |V|$ vezes; em cada iteração, a linha 8 gasta $\\Theta(V)$ e o laço das linhas 10–13 gasta $\\Theta(V)$. Tempo total: <strong>$\\Theta(V^2)$</strong> (ótimo para grafos densos, pois é necessário ler as $\\Theta(V^2)$ entradas da matriz).</p>

        <h4>Parte 2 — Algoritmo de Kruskal com Pesos Inteiros Limitados (Exercício 23.2-4)</h4>
        <p>No algoritmo <code>MST-KRUSKAL</code> padrão, o tempo de execução é a soma do tempo para <strong>ordenar as $|E|$ arestas</strong> (linha 4) mais o tempo das $O(V + E)$ operações de conjuntos disjuntos $O(E \\alpha(V))$ (uma vez que $|E| \\ge |V| - 1$ em grafos conexos):</p>
        <ul>
          <li><strong>Caso 1 (Pesos inteiros em $\\{1, 2, \\dots, |V|\\}$):</strong> Podemos ordenar as $|E|$ arestas na linha 4 usando <strong>Counting Sort (Seção 8.2)</strong> em tempo linear $O(V + E) = O(E)$! Nesse caso, o passo de ordenação deixa de ser o gargalo e o tempo total de execução de Kruskal cai de $O(E \\lg V)$ para <strong>$O(E \\alpha(V))$</strong>!</li>
          <li><strong>Caso 2 (Pesos inteiros em $\\{1, 2, \\dots, W\\}$):</strong> Usando Counting Sort na linha 4, a ordenação leva tempo $O(W + E)$. Logo, o tempo total de execução de Kruskal é $O(W + E \\alpha(V))$; se $W = O(1)$ é uma constante fixa, a ordenação custa $O(E)$ e o tempo total novamente é <strong>$O(E \\alpha(V))$</strong>! $\\blacksquare$</li>
        </ul>
      `
    },
    {
      id: "ex11-8",
      code: "PROBLEMAS 22-2 & 23-1",
      reference: "Capítulos 22 e 23 — Pontos de Articulação / Pontes e 2ª Melhor MST (pp. 511, 523)",
      title: "Cálculo de Pontos de Articulação e Pontes via $v.\\text{inferior}$ (Tarjan) em $O(E)$ e Algoritmo para a Segunda Melhor MST",
      prompt: `
        <p>Resolva os dois problemas clássicos de síntese dos Capítulos 22 e 23:</p>
        <ol>
          <li><strong>(Problema 22-2, p. 511):</strong> Em um grafo conexo não dirigido $G = (V, E)$ com árvore de busca em profundidade $G_\\pi = (V, E_\\pi)$, definimos para cada vértice $v \\in V$:
          $$v.\\text{inferior} = \\min \\begin{cases} v.d, \\\\ w.d : (u, w) \\text{ é uma aresta de retorno para algum descendente } u \\text{ de } v. \\end{cases}$$
          Mostre como calcular $v.\\text{inferior}$ para todos os vértices em tempo $O(E)$ e como usar $v.\\text{inferior}$ para identificar todos os <strong>pontos de articulação</strong> e todas as <strong>pontes</strong> de $G$ em tempo $O(E)$.</li>
          <li><strong>(Problema 23-1, p. 523):</strong> Seja $G = (V, E)$ um grafo conexo não dirigido com pesos de arestas distintos. Dada a árvore geradora mínima $T$, descreva um algoritmo de tempo $O(V^2)$ para calcular a aresta de peso máximo $\\text{max}[u, v]$ no único caminho simples entre $u$ e $v$ em $T$ para todos os pares $u, v \\in V$, e use-o para encontrar a <strong>segunda melhor árvore geradora mínima</strong> em tempo $O(E \\lg V + V^2)$ (ou $O(V^2)$ após obter $T$).</li>
        </ol>
      `,
      placeholder:
        "Escreva a recorrência pós-ordem para v.inferior na DFS (condições s.inferior ≥ v.d para articulação e s.inferior > v.d para ponte) e o algoritmo da 2ª melhor MST...",
      solution: `
        <h4>Parte 1 — Pontos de Articulação e Pontes em Tempo $O(E)$ (Problema 22-2, p. 511)</h4>
        <p>Como $G$ é conexo, temos $|V| - 1 \\le |E|$, logo $O(V + E) = O(E)$. Pelo Teorema 22.10, toda aresta de $G$ na <code>DFS</code> é ou uma aresta de árvore $(v, s) \\in E_\\pi$ ou uma aresta de retorno $(u, w)$ ligando $u$ a um ancestral próprio $w$ ($w \\neq u.\\pi$). Como um descendente $u$ de $v$ ou é o próprio $v$ ou pertence à subárvore de algum filho $s$ de $v$ em $G_\\pi$, podemos calcular $v.\\text{inferior}$ em pós-ordem durante <code>DFS-VISIT(G, v)</code>:</p>
        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">DFS-ARTICULATION-AND-BRIDGES(G, v)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">tempo = tempo + 1</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">v.d = tempo</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">v.inferior = v.d</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">v.cor = CINZENTO</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">filhos = 0</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">para cada</span> s ∈ G.Adj[v]</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">   <span class="kw">se</span> s.cor == BRANCO</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">       filhos = filhos + 1</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">       s.π = v</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">      DFS-ARTICULATION-AND-BRIDGES(G, s)</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">      v.inferior = min(v.inferior, s.inferior)</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">      <span class="cmt">// Critério de Ponto de Articulação (Itens a e b):</span></span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">      <span class="kw">se</span> (v.π == NIL e filhos ≥ 2) ou (v.π ≠ NIL e s.inferior ≥ v.d)</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">          marcar v como PONTO DE ARTICULAÇÃO</span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content">      <span class="cmt">// Critério de Ponte (Itens e e f):</span></span></div>
              <div class="code-line"><span class="line-num">16</span><span class="line-content">      <span class="kw">se</span> s.inferior > v.d</span></div>
              <div class="code-line"><span class="line-num">17</span><span class="line-content">          marcar aresta (v, s) como PONTE</span></div>
              <div class="code-line"><span class="line-num">18</span><span class="line-content">  <span class="kw">senão se</span> s ≠ v.π</span></div>
              <div class="code-line"><span class="line-num">19</span><span class="line-content">      v.inferior = min(v.inferior, s.d)   <span class="cmt">// aresta de retorno (v, s)</span></span></div>
              <div class="code-line"><span class="line-num">20</span><span class="line-content">v.cor = PRETO</span></div>
            </div>
          </div>
        <p><em>Justificativa dos Critérios:</em></p>
        <ul>
          <li><strong>Ponto de Articulação (Itens a, b, d):</strong> Se $v$ é a raiz de $G_\\pi$, $v$ é ponto de articulação $\\iff$ tem $\\ge 2$ filhos em $G_\\pi$ (pois não há arestas cruzadas entre subárvores distintas pelo Teorema 22.10). Se $v$ não é raiz, remover $v$ desconecta algum filho $s$ do restante do grafo $\\iff$ nenhuma aresta de retorno saindo da subárvore de $s$ alcança um ancestral próprio de $v$ (cuja descoberta seria $< v.d$), o que equivale exatamente a <strong>$s.\\text{inferior} \\ge v.d$</strong>!</li>
          <li><strong>Ponte (Itens e, f):</strong> Uma aresta $(v, s)$ é ponte $\\iff$ não pertence a nenhum ciclo simples $\\iff$ $(v, s)$ é aresta de árvore e nenhuma aresta de retorno da subárvore de $s$ alcança $v$ ou um ancestral de $v$, o que equivale estritamente a <strong>$s.\\text{inferior} > v.d$</strong>!</li>
        </ul>

        <h4>Parte 2 — Segunda Melhor Árvore Geradora Mínima (Problema 23-1, p. 523)</h4>
        <ol>
          <li><strong>Passo 1 (Encontrar a MST única $T$):</strong> Execute <code>MST-PRIM</code> (ou <code>MST-KRUSKAL</code>) para obter a árvore geradora mínima $T$ em $O(E + V \\lg V)$ (ou $O(E \\lg V)$).</li>
          <li><strong>Passo 2 (Calcular $\\text{max}[u, v]$ para todo par $u, v \\in V$ em $O(V^2)$ — Item c):</strong> Como $T$ é uma árvore, tem apenas $|V| - 1$ arestas. Para cada vértice $u \\in V$, executamos uma busca <code>BFS(T, u)</code> (ou <code>DFS</code>) restrita às arestas de $T$:
            <ul>
              <li>Definimos $\\text{max}[u, u] = \\text{NIL}$.</li>
              <li>Quando a busca em $T$ a partir de $u$ atravessa uma aresta $(x, v) \\in T$ (onde $x$ é o pai de $v$ na travessia iniciada em $u$), atualizamos em $O(1)$:
              $$\\text{max}[u, v] = \\begin{cases} (x, v) & \\text{se } x = u \\text{ ou } w(x, v) > w(\\text{max}[u, x]), \\\\ \\text{max}[u, x] & \\text{caso contrário}. \\end{cases}$$</li>
              <li>Como cada busca em $T$ leva $O(V)$ (pois $|E_T| = |V| - 1$), repetir para todos os $|V|$ vértices $u \\in V$ preenche a matriz $\\text{max}[u, v]$ em tempo total <strong>$O(V^2)$</strong>!</li>
            </ul>
          </li>
          <li><strong>Passo 3 (Avaliar a melhor troca de aresta em $O(E)$ — Item d):</strong> Pelo item (b), a segunda melhor MST tem a forma $T' = T - \\{\\text{max}[x, y]\\} \\cup \\{(x, y)\\}$ para alguma aresta $(x, y) \\in E - T$. Varremos todas as arestas $(x, y) \\in E - T$ e escolhemos aquela que minimiza a diferença estritamente positiva $\\Delta(x, y) = w(x, y) - w(\\text{max}[x, y])$, obtendo a segunda melhor MST em tempo $O(V^2)$ adicional! $\\blacksquare$</li>
        </ol>
      `
    }
  ];

  if (typeof window.registerCodexModule === "function") {
    window.registerCodexModule(11, {
      revisao,
      unidades,
      initWorkbenches,
      quizzes,
      exercicios
    });
  }
})();
