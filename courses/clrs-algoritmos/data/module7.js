/* ==========================================================================
   MÓDULO 07 — Estruturas de Dados Elementares e Tabelas de Espalhamento
   Capítulos 10 e 11 (pp. 196–243) — Thomas H. Cormen, Charles E. Leiserson,
   Ronald L. Rivest e Clifford Stein (Algoritmos: Teoria e Prática, 3ª Edição)
   ========================================================================== */

(function () {
  const module7Content = {
    /* ======================================================================
       SEÇÃO 1: REVISÃO DE PRÉ-REQUISITOS E ARQUITETURA DA PARTE III
       ====================================================================== */
    revisao: {
      subtitle:
        "Inauguração da Parte III (Estruturas de Dados): Conjuntos Dinâmicos, Estruturas Lineares e Enraizadas, Endereçamento Direto e a Teoria de Tabelas de Espalhamento (Hashing)",
      intro:
        "Ao inaugurar a Parte III (Estruturas de Dados, pp. 196–243), Cormen, Leiserson, Rivest e Stein transitam dos algoritmos de ordenação e seleção em arranjos estáticos para a representação e manipulação eficiente de conjuntos dinâmicos finitos — conjuntos que podem crescer, encolher ou sofrer modificações ao longo do tempo. No Capítulo 10, estudamos as estruturas de dados elementares baseadas em ponteiros e índices (pilhas, filas circulares, listas ligadas com sentinelas, alocação de objetos em lista livre e árvores enraizadas). No Capítulo 11, enfrentamos o problema fundamental de implementar dicionários (INSERT, SEARCH, DELETE) em tempo esperado O(1) — e até em pior caso O(1) para conjuntos estáticos — por meio de Tabelas de Espalhamento (Hash Tables), encadeamento, hashing universal, endereçamento aberto e hashing perfeito.",
      pillars: [
        {
          tag: "[ PILAR 01 • CONJUNTOS DINÂMICOS E AS 7 OPERAÇÕES CANÔNICAS ]",
          title: "Consultas vs. Operações Modificadoras em Conjuntos Dinâmicos",
          body: `
            <p>Na Introdução da Parte III (pp. 196–199), cada elemento de um conjunto dinâmico $S$ é representado por um objeto $x$ apontado por um ponteiro, possuindo um atributo identificatório <code>x.chave</code> e, opcionalmente, <strong>dados satélites</strong> e campos de ponteiros. As operações dividem-se em <strong>consultas</strong> e <strong>operações modificadoras</strong>:</p>
            <div class="canonical-table-wrap">
              <table class="canonical-table">
                <thead>
                  <tr>
                    <th>Operação</th>
                    <th>Categoria</th>
                    <th>Especificação Formal (CLRS, p. 197)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong><code>SEARCH(S, k)</code></strong></td>
                    <td>Consulta</td>
                    <td>Retorna um ponteiro $x \\in S$ tal que $x.\\text{chave} = k$, ou <code>NIL</code> se tal elemento não pertencer a $S$.</td>
                  </tr>
                  <tr>
                    <td><strong><code>INSERT(S, x)</code></strong></td>
                    <td>Modificadora</td>
                    <td>Aumenta o conjunto $S$ com o elemento apontado por $x$ (cujos atributos básicos já foram inicializados).</td>
                  </tr>
                  <tr>
                    <td><strong><code>DELETE(S, x)</code></strong></td>
                    <td>Modificadora</td>
                    <td>Dado um <strong>ponteiro $x$</strong> para um elemento em $S$ (e não uma chave!), remove $x$ de $S$.</td>
                  </tr>
                  <tr>
                    <td><strong><code>MINIMUM(S)</code></strong> / <strong><code>MAXIMUM(S)</code></strong></td>
                    <td>Consulta (Ordem Total)</td>
                    <td>Retorna um ponteiro para o elemento de $S$ com a menor (ou maior) chave.</td>
                  </tr>
                  <tr>
                    <td><strong><code>SUCCESSOR(S, x)</code></strong> / <strong><code>PREDECESSOR(S, x)</code></strong></td>
                    <td>Consulta (Ordem Total)</td>
                    <td>Retorna o próximo elemento maior (ou menor) que $x$ na ordem linear de $S$, ou <code>NIL</code> se $x$ for o extremo.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>Um conjunto dinâmico que precisa suportar apenas <code>INSERT</code>, <code>DELETE</code> e <code>SEARCH</code> é denominado um <strong>dicionário</strong> (como a tabela de símbolos de um compilador).</p>
          `
        },
        {
          tag: "[ PILAR 02 • ESTRUTURAS LINEARES, SENTINELAS E PONTEIROS EM ARRANJOS ]",
          title: "LIFO, FIFO, Objetos Sentinelas L.nil e Gerenciamento Explícito por Lista Livre",
          body: `
            <p>No Capítulo 10 (pp. 200–216), aprendemos como organizar conjuntos dinâmicos em memória contígua ou encadeada:</p>
            <ul>
              <li><strong>Pilhas (LIFO) e Filas (FIFO):</strong> Conjuntos dinâmicos onde o elemento removido por <code>DELETE</code> é pré-especificado pelo tempo de permanência: <code>POP</code> remove o mais recente ($O(1)$) e <code>DEQUEUE</code> remove o mais antigo em um arranjo circular ($O(1)$).</li>
              <li><strong>Listas Duplamente Ligadas e Sentinela <code>L.nil</code>:</strong> Enquanto uma lista comum exige testes de fronteira (<code>x.anterior ≠ NIL</code>, <code>L.inicio == NIL</code>), introduzir um objeto fictício <strong>sentinela <code>L.nil</code></strong> fecha a lista em um anel circular e reduz <code>LIST-DELETE'(x)</code> a apenas 2 linhas sem nenhum desvio condicional (<code>if</code>)!</li>
              <li><strong>Síntese de Ponteiros e Lista Livre:</strong> Em linguagens ou ambientes sem alocação dinâmica nativa, sintetizamos objetos usando múltiplos arranjos paralelos (<code>chave[x]</code>, <code>proximo[x]</code>, <code>anterior[x]</code>) ou um único arranjo contíguo, mantendo os objetos livres em uma <strong>lista livre</strong> gerenciada como pilha em $O(1)$ via <code>ALLOCATE-OBJECT</code> e <code>FREE-OBJECT</code>.</li>
            </ul>
          `
        },
        {
          tag: "[ PILAR 03 • ENDEREÇAMENTO DIRETO VS. TABELAS DE ESPALHAMENTO ]",
          title: "O Compromisso Espaço-Tempo quando o Universo U é Gigantesco",
          body: `
            <p>No Capítulo 11 (pp. 217–224), contrastamos duas abordagens para indexar chaves extraídas de um universo $U$:</p>
            <ul>
              <li><strong>Tabelas de Endereçamento Direto ($T[0 \\dots |U|-1]$):</strong> Se $|U|$ é pequeno, reservamos uma posição de arranjo para cada chave possível $k \\in U$. Todas as operações de dicionário levam tempo de <strong>pior caso $O(1)$</strong>, mas o espaço $\\Theta(|U|)$ torna-se impossível quando $|U|$ é imenso (ex.: identificadores de 64 bits ou strings ASCII) e o conjunto real $K \\subseteq U$ de $n = |K|$ chaves armazenadas é muito menor ($n \\ll |U|$).</li>
              <li><strong>Tabelas de Espalhamento (Hashing):</strong> Reduzimos o arranjo para $T[0 \\dots m-1]$ com $m = \\Theta(n)$ usando uma <strong>função hash</strong> $h: U \\to \\{0, 1, \\dots, m-1\\}$. Como $|U| > m$, pelo Princípio da Casa dos Pombos as <strong>colisões</strong> ($h(k_1) = h(k_2)$ para $k_1 \\neq k_2$) são inevitáveis e resolvidas por <strong>encadeamento</strong> ($\alpha = n/m$ qualquer) ou <strong>endereçamento aberto</strong> ($\alpha = n/m \\le 1$), alcançando tempo <strong>esperado $O(1)$</strong>.</li>
            </ul>
          `
        },
        {
          tag: "[ PILAR 04 • ANÁLISE PROBABILÍSTICA, HASHING UNIVERSAL E PERFEITO ]",
          title: "Da Dispersão Uniforme Simples à Imunidade Contra Adversários e Pior Caso O(1)",
          body: `
            <p>As ferramentas probabilísticas do Capítulo 5 (variáveis aleatórias indicadoras, linearidade da esperança e desigualdade de Markov) sustentam os grandes teoremas do Capítulo 11:</p>
            <ul>
              <li><strong>Hashing Uniforme Simples (SUHA):</strong> Se cada chave é mapeada independente e uniformemente para qualquer das $m$ posições, a busca com ou sem sucesso em encadeamento examina em média $\\Theta(1 + \\alpha)$ elementos (Teoremas 11.1 e 11.2).</li>
              <li><strong>Hashing Universal ($\mathscr{H}$):</strong> Qualquer função hash fixa $h$ é vulnerável a um adversário que escolha $n$ chaves que colidem na mesma posição ($\Theta(n)$). Ao sortear $h$ aleatoriamente em tempo de execução de uma família universal $\mathscr{H}$ onde $\\Pr_{h \\in \\mathscr{H}}\\{h(k) = h(l)\\} \\le 1/m$ para todo $k \\neq l$ (como $\mathscr{H}_{pm}$ com $h_{ab}(k) = ((ak + b) \\bmod p) \\bmod m$), garantimos tempo esperado $\\le 1 + \\alpha$ para <strong>qualquer entrada</strong> (Teoremas 11.3 e 11.5).</li>
              <li><strong>Hashing Perfeito (Seção 11.5):</strong> Para conjuntos estáticos, combinamos duas camadas de hashing universal com tabelas secundárias de tamanho quadrático $m_j = n_j^2$, eliminando 100% das colisões e garantindo busca em <strong>tempo de pior caso $O(1)$</strong> usando memória total esperada $< 2n = O(n)$ (Teoremas 11.9 e 11.10).</li>
            </ul>
          `
        }
      ],
      checklist: [
        "Compreendo por que DELETE(S, x) em listas e tabelas encadeadas recebe um ponteiro x (levando O(1) em lista duplamente ligada) e não uma chave k.",
        "Domino a aritmética circular das filas Q.inicio e Q.fim em Q[1 .. n] e o uso da sentinela L.nil para eliminar condições de contorno em listas duplamente ligadas.",
        "Compreendo o fator de carga α = n/m e as demonstrações dos Teoremas 11.1, 11.2 e 11.3 por meio da variável aleatória indicadora X_{ij} = I{h(k_i) = h(k_j)}.",
        "Sei projetar funções hash pelos métodos da divisão (m primo afastado de 2^p), da multiplicação (A ≈ (√5 - 1)/2) e da família universal H_{pm}.",
        "Domino as 3 técnicas de endereçamento aberto (sondagem linear, quadrática e hash duplo), o papel do marcador DELETED e o esquema de 2 níveis do Hashing Perfeito."
      ]
    },

    /* ======================================================================
       SEÇÃO 2: UNIDADES DE APRENDIZADO (CAPÍTULOS 10 E 11 COMPLETOS, pp. 196–243)
       ====================================================================== */
    unidades: [
      /* ====================================================================
         UNIDADE 7.1 — CAPÍTULO 10, SEÇÕES 10.1 E 10.2 (pp. 200–208)
         ==================================================================== */
      {
        id: "u7-1",
        code: "UNIDADE 01 • CAPÍTULO 10, SEÇÕES 10.1 E 10.2 (PP. 200–208)",
        title: "10.1 e 10.2 Pilhas, Filas e Listas Ligadas (Duplamente Ligadas e Circulares com Sentinela L.nil)",
        readingTime: "35 min",
        objectives: [
          "Compreender e implementar pilhas (política LIFO: STACK-EMPTY, PUSH, POP) em arranjo S[1 .. n] identificando estouro negativo (underflow) e estouro positivo (overflow).",
          "Implementar filas circulares (política FIFO: ENQUEUE, DEQUEUE) de até n - 1 elementos em um arranjo Q[1 .. n] gerenciando os atributos Q.inicio e Q.fim.",
          "Construir listas duplamente ligadas com LIST-SEARCH, LIST-INSERT e LIST-DELETE em tempo O(n), O(1) e O(1).",
          "Dominar a técnica de objetos sentinelas (L.nil) para converter uma lista duplamente ligada em uma lista circular sem testes de contorno (LIST-DELETE', LIST-SEARCH' e LIST-INSERT')."
        ],
        content: `
          <h3>1. Pilhas (Seção 10.1, pp. 200–201): Política LIFO</h3>
          <p>Pilhas e filas são conjuntos dinâmicos nos quais o elemento removido pela operação <code>DELETE</code> é pré-especificado. Em uma <strong>pilha</strong> (<em>stack</em>), o elemento eliminado é sempre o mais recentemente inserido: a pilha implementa uma política de <strong>último a entrar, primeiro a sair</strong> ou <strong>LIFO</strong> (<em>last-in, first-out</em>). A operação <code>INSERT</code> é denominada <strong><code>PUSH</code></strong> (empilhar) e a operação <code>DELETE</code> — que não recebe argumento de elemento — é denominada <strong><code>POP</code></strong> (desempilhar).</p>
          <p>Podemos implementar uma pilha de no máximo $n$ elementos usando um arranjo 1-indexado $S[1 \\dots n]$ dotado de um atributo <code>S.topo</code> que indexa o elemento mais recentemente inserido:</p>
          <ul>
            <li>A pilha ativa consiste nos elementos $S[1 \\dots S.\\text{topo}]$, onde $S[1]$ é o elemento na base (parte inferior) e $S[S.\\text{topo}]$ é o elemento no topo.</li>
            <li>Quando $S.\\text{topo} = 0$, a pilha está <strong>vazia</strong> (testada por <code>STACK-EMPTY(S)</code>).</li>
            <li>Se tentarmos aplicar <code>POP</code> em uma pilha vazia ($S.\\text{topo} = 0$), ocorre um <strong>estouro negativo</strong> (<em>underflow</em>), que é um erro de programação.</li>
            <li>Se $S.\\text{topo}$ exceder a capacidade $n$ do arranjo durante um <code>PUSH</code>, ocorre um <strong>estouro</strong> (<em>overflow</em>).</li>
          </ul>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">STACK-EMPTY(S)</span>, <span class="proc-name">PUSH(S, x)</span> e <span class="proc-name">POP(S)</span> — Tempo $O(1)$</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">STACK-EMPTY</span>(S)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">if</span> S.topo == 0</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">        <span class="kw">return</span> TRUE</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">else return</span> FALSE</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">PUSH</span>(S, x)</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    S.topo = S.topo + 1</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">    S[S.topo] = x</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content"><span class="kw">POP</span>(S)</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">    <span class="kw">if</span> STACK-EMPTY(S)</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">        <span class="kw">error</span> "underflow (estouro negativo)"</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">    <span class="kw">else</span> S.topo = S.topo - 1</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">        <span class="kw">return</span> S[S.topo + 1]</span></div>
            </div>
          </div>
          <p>Observe na linha 14 (Figura 10.1(c), p. 200) que, após <code>POP(S)</code> decrementar <code>S.topo</code>, o valor antigo continua fisicamente presente na memória em $S[S.\\text{topo} + 1]$, mas já não faz mais parte da pilha ativa $S[1 \\dots S.\\text{topo}]$ e será sobrescrito pelo próximo <code>PUSH</code>. Cada uma das três operações executa em tempo estritamente <strong>$O(1)$</strong>.</p>

          <h3>2. Filas em Arranjo Circular (Seção 10.1, pp. 201–203): Política FIFO</h3>
          <p>Em uma <strong>fila</strong> (<em>queue</em>), o elemento eliminado é sempre aquele que estava no conjunto há mais tempo: ela implementa a política de <strong>primeiro a entrar, primeiro a sair</strong> ou <strong>FIFO</strong> (<em>first-in, first-out</em>). Chamamos a operação <code>INSERT</code> de <strong><code>ENQUEUE</code></strong> (enfileirar) e a operação <code>DELETE</code> de <strong><code>DEQUEUE</code></strong> (desenfileirar).</p>
          <p>Como mostra a Figura 10.2 (p. 201), implementamos uma fila de no máximo <strong>$n - 1$ elementos</strong> usando um arranjo $Q[1 \\dots n]$ de comprimento $n = Q.\\text{comprimento}$ e dois atributos:</p>
          <ul>
            <li><strong><code>Q.inicio</code></strong> (<em>head</em>): indexa o elemento que está no início (cabeça) da fila, pronto para ser removido por <code>DEQUEUE</code>.</li>
            <li><strong><code>Q.fim</code></strong> (<em>tail</em>): indexa a <strong>próxima posição vazia</strong> na qual um elemento recém-chegado será inserido por <code>ENQUEUE</code>.</li>
            <li>Os elementos presentes na fila ocupam as posições $Q.\\text{inicio}, Q.\\text{inicio} + 1, \\dots, Q.\\text{fim} - 1$ em uma <strong>ordem circular</strong> onde a posição $1$ segue imediatamente a posição $n$.</li>
            <li><strong>Condição de Fila Vazia:</strong> Inicialmente temos $Q.\\text{inicio} = Q.\\text{fim} = 1$. Sempre que <strong>$Q.\\text{inicio} == Q.\\text{fim}$</strong>, a fila está vazia (tentar desenfileirar causa <em>underflow</em>).</li>
            <li><strong>Condição de Fila Cheia:</strong> A fila está cheia (contendo $n - 1$ elementos) quando $Q.\\text{inicio} == Q.\\text{fim} + 1$, ou quando simultaneamente $Q.\\text{inicio} == 1$ e $Q.\\text{fim} == Q.\\text{comprimento}$ (deixando sempre 1 posição sentinela vazia para distinguir fila cheia de fila vazia).</li>
          </ul>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">ENQUEUE(Q, x)</span> e <span class="proc-name">DEQUEUE(Q)</span> — Tempo $O(1)$</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">ENQUEUE</span>(Q, x)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    Q[Q.fim] = x</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    <span class="kw">if</span> Q.fim == Q.comprimento</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">        Q.fim = 1</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">else</span> Q.fim = Q.fim + 1</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">DEQUEUE</span>(Q)</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">    x = Q[Q.inicio]</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">    <span class="kw">if</span> Q.inicio == Q.comprimento</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">        Q.inicio = 1</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">    <span class="kw">else</span> Q.inicio = Q.inicio + 1</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">    <span class="kw">return</span> x</span></div>
            </div>
          </div>

          <h3>3. Listas Duplamente Ligadas (Seção 10.2, pp. 203–205)</h3>
          <p>Em uma <strong>lista ligada</strong>, os objetos estão organizados em ordem linear determinada por ponteiros em cada objeto, e não por índices contíguos de arranjo. Na Figura 10.3 (p. 204), cada elemento de uma <strong>lista duplamente ligada</strong> $L$ é um objeto $x$ com três atributos estruturais:</p>
          <ul>
            <li><code>x.chave</code>: o valor da chave armazenada (além de eventuais dados satélites).</li>
            <li><code>x.proximo</code> (<em>next</em>): ponteiro para o sucessor de $x$ na lista (vale <code>NIL</code> se $x$ é o último elemento, ou <em>fim/cauda</em> da lista).</li>
            <li><code>x.anterior</code> (<em>prev</em>): ponteiro para o predecessor de $x$ na lista (vale <code>NIL</code> se $x$ é o primeiro elemento, ou <em>início/cabeça</em> da lista).</li>
            <li><code>L.inicio</code> (<em>head</em>): atributo da lista $L$ que aponta para o primeiro elemento. Se $L.\\text{inicio} == \\text{NIL}$, a lista está vazia.</li>
          </ul>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">LIST-SEARCH(L, k)</span>, <span class="proc-name">LIST-INSERT(L, x)</span> e <span class="proc-name">LIST-DELETE(L, x)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">LIST-SEARCH</span>(L, k) <span class="cmt">// Tempo Θ(n) no pior caso</span></span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    x = L.inicio</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    <span class="kw">while</span> x ≠ NIL <span class="kw">e</span> x.chave ≠ k</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">        x = x.proximo</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">return</span> x</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">LIST-INSERT</span>(L, x) <span class="cmt">// Emenda x na cabeça da lista em O(1)</span></span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">    x.proximo = L.inicio</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">    <span class="kw">if</span> L.inicio ≠ NIL</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">        L.inicio.anterior = x</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">    L.inicio = x</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">    x.anterior = NIL</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content"><span class="kw">LIST-DELETE</span>(L, x) <span class="cmt">// Desliga o ponteiro x em O(1)</span></span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content">    <span class="kw">if</span> x.anterior ≠ NIL</span></div>
              <div class="code-line"><span class="line-num">16</span><span class="line-content">        x.anterior.proximo = x.proximo</span></div>
              <div class="code-line"><span class="line-num">17</span><span class="line-content">    <span class="kw">else</span> L.inicio = x.proximo</span></div>
              <div class="code-line"><span class="line-num">18</span><span class="line-content">    <span class="kw">if</span> x.proximo ≠ NIL</span></div>
              <div class="code-line"><span class="line-num">19</span><span class="line-content">        x.proximo.anterior = x.anterior</span></div>
            </div>
          </div>

          <div class="canonical-callout warning">
            <strong>Observação Crítica sobre <code>LIST-DELETE(L, x)</code>:</strong> O procedimento recebe o <strong>ponteiro $x$</strong> para o objeto a ser removido, executando em $O(1)$. Se quisermos remover um elemento dado apenas o valor de sua chave $k$, devemos primeiro chamar <code>x = LIST-SEARCH(L, k)</code> para localizar o ponteiro, elevando o tempo total para $\\Theta(n)$ no pior caso. Além disso, em uma lista <em>simplesmente ligada</em>, mesmo tendo o ponteiro $x$, <code>LIST-DELETE</code> leva $\\Theta(n)$ porque precisamos percorrer a lista desde o início para descobrir o predecessor de $x$!
          </div>

          <h3>4. Sentinelas (<code>L.nil</code>): Listas Duplamente Ligadas Circulares Sem Condições de Contorno (pp. 205–207)</h3>
          <p>Observe que <code>LIST-INSERT</code> possui 1 teste condicional (<code>if L.inicio ≠ NIL</code>) e <code>LIST-DELETE</code> possui 2 testes condicionais (<code>if x.anterior ≠ NIL</code> e <code>if x.proximo ≠ NIL</code>) exclusivamente para tratar as condições de contorno no início e no fim da lista. Podemos eliminar todos esses desvios introduzindo uma <strong>sentinela</strong> (Figura 10.4, p. 206):</p>
          <ul>
            <li>Suprimos a lista $L$ com um objeto fictício <strong><code>L.nil</code></strong> que representa <code>NIL</code>, mas possui todos os atributos (<code>proximo</code>, <code>anterior</code>, <code>chave</code>) de um nó comum da lista.</li>
            <li>Substituímos toda referência a <code>NIL</code> por uma referência à sentinela <code>L.nil</code>. Isso transforma a lista em uma <strong>lista duplamente ligada circular com sentinela</strong>, na qual <code>L.nil</code> situa-se exatamente entre o fim e o início da lista:
              <ul>
                <li><code>L.nil.proximo</code> aponta para o <strong>início</strong> (primeiro elemento) da lista — eliminando a necessidade do atributo <code>L.inicio</code>!</li>
                <li><code>L.nil.anterior</code> aponta para o <strong>fim</strong> (último elemento) da lista.</li>
                <li>Em uma <strong>lista vazia</strong> (Figura 10.4(a)), tanto <code>L.nil.proximo</code> quanto <code>L.nil.anterior</code> apontam para o próprio <code>L.nil</code>!</li>
              </ul>
            </li>
          </ul>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">LIST-DELETE'(x)</span>, <span class="proc-name">LIST-SEARCH'(L, k)</span> e <span class="proc-name">LIST-INSERT'(L, x)</span> com Sentinela <code>L.nil</code></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">LIST-DELETE'</span>(x) <span class="cmt">// Apenas 2 linhas, ZERO desvios condicionais!</span></span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    x.anterior.proximo = x.proximo</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    x.proximo.anterior = x.anterior</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">LIST-SEARCH'</span>(L, k)</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">    x = L.nil.proximo</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    <span class="kw">while</span> x ≠ L.nil <span class="kw">e</span> x.chave ≠ k</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">        x = x.proximo</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">    <span class="kw">return</span> x</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content"><span class="kw">LIST-INSERT'</span>(L, x) <span class="cmt">// Insere x entre L.nil e o antigo início</span></span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">    x.proximo = L.nil.proximo</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">    L.nil.proximo.anterior = x</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">    L.nil.proximo = x</span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content">    x.anterior = L.nil</span></div>
            </div>
          </div>

          <p>Mais ainda: como destaca o <strong>Exercício 10.2-4</strong> (p. 207), podemos eliminar até mesmo o teste <code>x ≠ L.nil</code> de cada iteração do laço <code>while</code> em <code>LIST-SEARCH'(L, k)</code>! Basta gravar a chave procurada dentro da própria sentinela (<code>L.nil.chave = k</code>) antes de iniciar o laço e testar apenas <code>while x.chave ≠ k</code>: se $k$ não estiver nos nós reais da lista, a busca parará garantidamente ao atingir a sentinela <code>L.nil</code>!</p>
          <p><strong>Cautela no uso de sentinelas (p. 207):</strong> Sentinelas simplificam o código e reduzem fatores constantes, mas se uma estrutura de dados contiver <em>muitas listas pequenas</em> (como uma tabela de espalhamento com milhares de listas encadeadas curtas), alocar um objeto sentinela completo para cada lista desperdiçaria memória significativa. Por isso, só usamos um objeto sentinela dedicado quando ele realmente compensa em clareza ou desempenho.</p>

          <div id="workbench-mod7-mount"></div>
        `
      },

      /* ====================================================================
         UNIDADE 7.2 — CAPÍTULO 10, SEÇÕES 10.3 E 10.4 (pp. 208–216)
         ==================================================================== */
      {
        id: "u7-2",
        code: "UNIDADE 02 • CAPÍTULO 10, SEÇÕES 10.3 E 10.4 (PP. 208–216)",
        title: "10.3 e 10.4 Implementação de Ponteiros e Objetos em Arranjos (ALLOCATE-OBJECT / FREE-OBJECT) e Representação de Árvores Enraizadas",
        readingTime: "35 min",
        objectives: [
          "Sintetizar ponteiros e objetos em ambientes sem alocação dinâmica usando a representação em vários arranjos paralelos (chave, proximo, anterior) e a representação em um único arranjo contíguo com deslocamentos (offsets).",
          "Implementar o gerenciador de armazenamento em lista livre (ALLOCATE-OBJECT e FREE-OBJECT) operando como uma pilha em tempo O(1).",
          "Representar árvores binárias usando ponteiros p, esquerdo e direito, e árvores com ramificação arbitrária (ilimitada) usando a representação filho-esquerdo, irmão-direito em espaço O(n)."
        ],
        content: `
          <h3>1. Representação de Objetos em Vários Arranjos e em um Único Arranjo (Seção 10.3, pp. 208–210)</h3>
          <p>Como implementamos estruturas ligadas (como listas, grafos ou árvores) em linguagens que não oferecem tipos de dados ponteiro explícitos, ou quando desejamos máxima localidade de cache sem sobrecarga do alocador do sistema operacional? A Seção 10.3 apresenta duas maneiras de sintetizar objetos e ponteiros usando apenas arranjos e índices inteiros:</p>
          <ol>
            <li><strong>Representação em Vários Arranjos Paralelos (Figura 10.5, p. 209):</strong> Para uma coleção de objetos homogêneos (que possuem os mesmos atributos), criamos um arranjo separado para cada atributo: <code>chave[1 .. m]</code>, <code>proximo[1 .. m]</code> e <code>anterior[1 .. m]</code>.
              <ul>
                <li>Um "ponteiro" $x$ é simplesmente um <strong>índice inteiro</strong> común para os três arranjos: a fatia vertical <code>chave[x]</code>, <code>proximo[x]</code> e <code>anterior[x]</code> representa o objeto $x$.</li>
                <li>A constante <code>NIL</code> é representada por um inteiro especial (como $0$ ou $-1$) que não corresponde a nenhum índice válido do arranjo.</li>
              </ul>
            </li>
            <li><strong>Representação em um Único Arranjo Contíguo (Figura 10.6, p. 209):</strong> Como na memória física de um computador (endereçada de $0$ a $M - 1$), armazenamos todos os objetos dentro de um único grande arranjo $A$.
              <ul>
                <li>Cada objeto ocupa um subarranjo contíguo $A[j \\dots k]$, e o ponteiro para o objeto é o índice inicial $j$.</li>
                <li>Cada atributo corresponde a um <strong>deslocamento fixo</strong> (<em>offset</em>): por exemplo, <code>chave</code> no deslocamento $0$ ($A[j]$), <code>proximo</code> no deslocamento $1$ ($A[j + 1]$) e <code>anterior</code> no deslocamento $2$ ($A[j + 2]$).</li>
                <li>Essa representação é altamente flexível porque permite armazenar objetos heterogêneos (de comprimentos diferentes) no mesmo arranjo $A$.</li>
              </ul>
            </li>
          </ol>

          <h3>2. Alocação e Liberação de Objetos: A Lista Livre (<code>livre</code>) em $O(1)$ (pp. 210–211)</h3>
          <p>Em uma representação de vários arranjos de comprimento $m$ contendo atualmente $n \\le m$ elementos na lista ativa $L$, os $m - n$ índices restantes estão disponíveis para futuras inserções. Em vez de recorrer a um coletor de lixo externo, mantemos todos os objetos não utilizados encadeados em uma lista simplesmente ligada chamada <strong>lista livre</strong> (<em>free list</em>, Figura 10.7, p. 210):</p>
          <ul>
            <li>A lista livre utiliza <strong>apenas o arranjo <code>proximo</code></strong> (não precisamos tocar em <code>anterior</code>, como explica o Exercício 10.3-3) e seu início é apontado pela variável global <strong><code>livre</code></strong>.</li>
            <li>Cada posição de índice $1 \\dots m$ nos arranjos pertence ou à lista ativa $L$ (ou a uma entre várias listas ativas $L_1, L_2$ que compartilham o mesmo espaço de armazenamento, Figura 10.8) ou à lista livre, mas nunca a ambas simultaneamente.</li>
            <li><strong>A lista livre funciona exatamente como uma pilha (LIFO):</strong> o próximo objeto alocado por <code>ALLOCATE-OBJECT()</code> é sempre o último objeto devolvido por <code>FREE-OBJECT(x)</code>!</li>
          </ul>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">ALLOCATE-OBJECT()</span> e <span class="proc-name">FREE-OBJECT(x)</span> — Tempo $O(1)$</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">ALLOCATE-OBJECT</span>() <span class="cmt">// Equivale a um POP na pilha da lista livre</span></span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">if</span> livre == NIL</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">        <span class="kw">error</span> "out of space (sem espaço disponível)"</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">else</span> x = livre</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">        livre = x.proximo</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">        <span class="kw">return</span> x</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content"><span class="kw">FREE-OBJECT</span>(x) <span class="cmt">// Equivale a um PUSH na pilha da lista livre</span></span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">    x.proximo = livre</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">    livre = x</span></div>
            </div>
          </div>

          <h3>3. Representação de Árvores Enraizadas (Seção 10.4, pp. 212–215)</h3>
          <p>Para representar <strong>árvores enraizadas</strong> com estruturas ligadas, cada nó $x$ é um objeto dotado de um atributo <code>x.chave</code> e de ponteiros para outros nós. A árvore inteira $T$ possui um atributo <code>T.raiz</code> que aponta para o nó raiz (ou vale <code>NIL</code> se a árvore estiver vazia). Distinguimos dois modelos fundamentais:</p>

          <h4>3.1 Árvores Binárias (Figura 10.9, p. 213)</h4>
          <p>Em uma árvore binária $T$, cada nó $x$ possui até dois filhos e armazena <strong>três ponteiros</strong>:</p>
          <ul>
            <li><strong><code>x.p</code></strong>: aponta para o nó <strong>pai</strong> de $x$ (se $x$ é a raiz, então <code>x.p = NIL</code>).</li>
            <li><strong><code>x.esquerdo</code></strong>: aponta para o <strong>filho à esquerda</strong> de $x$ (ou <code>NIL</code> se não houver filho esquerdo).</li>
            <li><strong><code>x.direito</code></strong>: aponta para o <strong>filho à direita</strong> de $x$ (ou <code>NIL</code> se não houver filho direito).</li>
          </ul>

          <h4>3.2 Árvores Enraizadas com Ramificações Ilimitadas: Filho da Esquerda, Irmão da Direita (Figura 10.10, p. 214)</h4>
          <p>Se um nó puder ter um número arbitrário (ilimitado) de filhos — ou se o grau máximo $k$ for grande mas a maioria dos nós tiver poucos filhos —, alocar $k$ ponteiros <code>filho1</code>, ..., <code>filhok</code> em cada nó é inviável ou desperdiça $\\Theta(n \\cdot k)$ de memória.</p>
          <p>A <strong>representação filho da esquerda, irmão da direita</strong> (<em>left-child, right-sibling</em>) resolve esse problema de forma brilhante usando <strong>apenas $O(n)$ de espaço total</strong> (exatamente três ponteiros por nó, independentemente de quantos filhos cada nó possua!):</p>
          <ol>
            <li><strong><code>x.p</code></strong>: aponta para o nó pai de $x$ (<code>NIL</code> na raiz).</li>
            <li><strong><code>x.filho-esquerdo</code></strong>: aponta exclusivamente para o <strong>filho mais à esquerda</strong> (primeiro filho) do nó $x$ (vale <code>NIL</code> se $x$ for uma folha).</li>
            <li><strong><code>x.irmao-direito</code></strong>: aponta para o <strong>irmão de $x$ imediatamente à sua direita</strong> (isto é, o próximo filho do mesmo pai <code>x.p</code>; vale <code>NIL</code> se $x$ for o filho mais à direita de seu pai).</li>
          </ol>
          <p>Dessa forma, todos os filhos de um nó $x$ formam uma lista simplesmente ligada encabeçada por <code>x.filho-esquerdo</code> e encadeada pelos ponteiros <code>irmao-direito</code>!</p>
        `
      },

      /* ====================================================================
         UNIDADE 7.3 — CAPÍTULO 11, SEÇÕES 11.1 E 11.2 (pp. 217–224)
         ==================================================================== */
      {
        id: "u7-3",
        code: "UNIDADE 03 • CAPÍTULO 11, SEÇÕES 11.1 E 11.2 (PP. 217–224)",
        title: "11.1 e 11.2 Tabelas de Endereçamento Direto e Tabelas de Dispersão (Hashing) com Encadeamento",
        readingTime: "45 min",
        objectives: [
          "Implementar tabelas de endereçamento direto (DIRECT-ADDRESS-SEARCH, INSERT, DELETE) em tempo de pior caso O(1) e diagnosticar suas limitações de memória quando |U| é grande.",
          "Compreender o mapeamento de uma função hash h: U → {0, 1, ..., m - 1}, o fenômeno inevitável das colisões e sua resolução por encadeamento (CHAINED-HASH-INSERT, SEARCH, DELETE).",
          "Definir formalmente o fator de carga α = n/m e a hipótese de hashing uniforme simples (SUHA).",
          "Demonstrar rigorosamente os Teoremas 11.1 e 11.2 provando que tanto a busca mal sucedida quanto a busca bem-sucedida levam tempo médio Θ(1 + α) usando variáveis aleatórias indicadoras."
        ],
        content: `
          <h3>1. Tabelas de Endereçamento Direto (Seção 11.1, pp. 217–219)</h3>
          <p>Quando o universo de chaves possíveis $U = \\{0, 1, \\dots, m - 1\\}$ é razoavelmente pequeno e não há dois elementos com a mesma chave, a maneira mais rápida de representar um dicionário dinâmico $K \\subseteq U$ é usar uma <strong>tabela de endereçamento direto</strong> (<em>direct-address table</em>) $T[0 \\dots m - 1]$ (Figura 11.1, p. 218), na qual cada posição (ou <em>lacuna/slot</em>) $k$ aponta diretamente para o elemento com chave $k$ (ou contém <code>NIL</code> se $k \\notin K$):</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">DIRECT-ADDRESS-SEARCH</span>, <span class="proc-name">INSERT</span> e <span class="proc-name">DELETE</span> — Tempo de Pior Caso $O(1)$</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">DIRECT-ADDRESS-SEARCH</span>(T, k)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">return</span> T[k]</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">DIRECT-ADDRESS-INSERT</span>(T, x)</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    T[x.chave] = x</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">DIRECT-ADDRESS-DELETE</span>(T, x)</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">    T[x.chave] = NIL</span></div>
            </div>
          </div>

          <p><strong>O Colapso do Endereçamento Direto:</strong> Se o universo $U$ é muito grande (por exemplo, chaves inteiras de 64 bits onde $|U| = 2^{64}$, ou identificadores alfanuméricos de um compilador), alocar uma tabela de tamanho $|U|$ é impossível, e se o conjunto real $K$ de $n = |K|$ chaves armazenadas for pequeno em relação a $|U|$, quase toda a memória alocada seria desperdiçada.</p>

          <h3>2. Tabelas de Espalhamento (Hashing) e Resolução de Colisões por Encadeamento (Seção 11.2, pp. 219–221)</h3>
          <p>Quando $n = |K| \\ll |U|$, uma <strong>tabela de espalhamento</strong> (<em>hash table</em>) reduz o espaço necessário para $\\Theta(n)$ mantendo o tempo de busca em $O(1)$ (no caso médio). Em vez de armazenar o elemento de chave $k$ na posição $k$, usamos uma <strong>função hash</strong> determinística</p>
          $$h : U \\to \\{0, 1, \\dots, m - 1\\}$$
          <p>para calcular a posição $h(k)$ na tabela $T[0 \\dots m - 1]$, onde $m \\ll |U|$ (Figura 11.2). Dizemos que $k$ <em>se espalha</em> (<em>hashes</em>) para a posição $h(k)$ e que $h(k)$ é o <strong>valor hash</strong> de $k$.</p>
          <p>Como $|U| > m$, pelo Princípio da Casa dos Pombos é inevitável que existam chaves distintas $k_1 \\neq k_2$ tais que $h(k_1) = h(k_2)$ — situação denominada <strong>colisão</strong>. Na resolução de colisões por <strong>encadeamento</strong> (<em>chaining</em>, Figura 11.3, p. 220), colocamos todos os elementos que se espalham para a mesma posição $j$ em uma <strong>lista duplamente ligada</strong> apontada por $T[j]$ (ou $T[j] = \\text{NIL}$ se a lista estiver vazia):</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">CHAINED-HASH-INSERT</span>, <span class="proc-name">SEARCH</span> e <span class="proc-name">DELETE</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">CHAINED-HASH-INSERT</span>(T, x) <span class="cmt">// Pior caso O(1) (assume que x ainda não está em T)</span></span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    insira x no início da lista T[h(x.chave)]</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">CHAINED-HASH-SEARCH</span>(T, k) <span class="cmt">// Proporcional ao comprimento da lista T[h(k)]</span></span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    procure um elemento com chave k na lista T[h(k)]</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">CHAINED-HASH-DELETE</span>(T, x) <span class="cmt">// Pior caso O(1) em lista duplamente ligada!</span></span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">    elimine x da lista T[h(x.chave)]</span></div>
            </div>
          </div>

          <h3>3. Análise do Hash com Encadeamento: Teoremas 11.1 e 11.2 (pp. 221–223)</h3>
          <p>Dada uma tabela de espalhamento $T$ com $m$ posições que armazena $n$ elementos, definimos o <strong>fator de carga</strong> (<em>load factor</em>) $\\alpha$ como:</p>
          $$\\alpha = \\frac{n}{m},$$
          <p>isto é, o número médio de elementos armazenados em uma cadeia ($\alpha$ pode ser menor, igual ou maior que $1$). Seja $n_j$ o comprimento da lista $T[j]$ para $j = 0, 1, \\dots, m - 1$, de modo que $n = \\sum_{j=0}^{m-1} n_j$.</p>
          <ul>
            <li><strong>Pior Caso ($\Theta(n)$):</strong> Se todas as $n$ chaves colidirem na mesma posição, forma-se uma única lista de comprimento $n$ e a busca degrada para $\\Theta(n)$ mais o tempo de calcular $h(k)$.</li>
            <li><strong>Caso Médio sob Hashing Uniforme Simples (SUHA — <em>Simple Uniform Hashing Assumption</em>):</strong> Consideramos que qualquer elemento dado tem igual probabilidade $1/m$ de se espalhar para qualquer uma das $m$ posições, independentemente das posições para onde quaisquer outros elementos tenham ido. Assim, o comprimento esperado de cada lista $T[j]$ é $\\text{E}[n_j] = \\alpha = n/m$, e supomos que calcular $h(k)$ leva tempo $O(1)$.</li>
          </ul>

          <div class="canonical-callout important">
            <strong>Teorema 11.1 (Busca Mal Sucedida no Encadeamento, p. 222):</strong> Em uma tabela de espalhamento na qual as colisões são resolvidas por encadeamento, uma <strong>busca mal sucedida</strong> demora o tempo médio $\\mathbf{\\Theta(1 + \\alpha)}$, sob a hipótese de hashing uniforme simples.<br><br>
            <strong>Prova:</strong> Sob hashing uniforme simples, qualquer chave $k$ ainda não armazenada na tabela tem igual probabilidade de cair em qualquer uma das $m$ posições. O algoritmo calcula $h(k)$ em tempo $\\Theta(1)$ e percorre toda a lista $T[h(k)]$ até o final (<code>NIL</code>) sem encontrar $k$. Como o número esperado de elementos em $T[h(k)]$ é $\\text{E}[n_{h(k)}] = \\alpha = n/m$, o tempo total esperado (incluindo o cálculo de $h(k)$) é $\\mathbf{\\Theta(1 + \\alpha)}$. $\\blacksquare$
          </div>

          <div class="canonical-callout important">
            <strong>Teorema 11.2 (Busca Bem-Sucedida no Encadeamento, pp. 222–223):</strong> Em uma tabela de espalhamento na qual as colisões são resolvidas por encadeamento, uma <strong>busca bem-sucedida</strong> demora o tempo médio $\\mathbf{\\Theta(1 + \\alpha)}$, sob a hipótese de hashing uniforme simples.<br><br>
            <strong>Prova Completa por Variáveis Aleatórias Indicadoras:</strong> Suponha que o elemento pesquisado tenha igual probabilidade $1/n$ de ser qualquer um dos $n$ elementos $x_1, x_2, \\dots, x_n$ armazenados na tabela (onde $x_i$ é o $i$-ésimo elemento inserido, com chave $k_i = x_i.\\text{chave}$).<br>
            Como <code>CHAINED-HASH-INSERT</code> insere novos elementos sempre <strong>na frente (cabeça)</strong> da lista, os elementos examinados antes de encontrar $x_i$ na lista $T[h(k_i)]$ são exatamente os elementos $x_j$ que foram inseridos <strong>depois de $x_i$</strong> ($j > i$) e que colidiram na mesma posição de $x_i$ ($h(k_j) = h(k_i)$). Somando $+1$ pelo exame do próprio $x_i$, definimos para cada par $(i, j)$ a variável aleatória indicadora:
            $$X_{ij} = \\text{I}\\{h(k_i) = h(k_j)\\}.$$
            Pela hipótese de hashing uniforme simples, $\\Pr\\{h(k_i) = h(k_j)\\} = 1/m$, logo pelo Lema 5.1 temos $\\text{E}[X_{ij}] = 1/m$. Pela linearidade da esperança, o número esperado de elementos examinados em uma busca bem-sucedida é:
            $$\\text{E}\\left[\\frac{1}{n}\\sum_{i=1}^{n} \\left(1 + \\sum_{j=i+1}^{n} X_{ij}\\right)\\right] = \\frac{1}{n}\\sum_{i=1}^{n} \\left(1 + \\sum_{j=i+1}^{n} \\text{E}[X_{ij}]\\right) = \\frac{1}{n}\\sum_{i=1}^{n} \\left(1 + \\sum_{j=i+1}^{n} \\frac{1}{m}\\right)$$
            $$= 1 + \\frac{1}{nm}\\sum_{i=1}^{n} (n - i) = 1 + \\frac{1}{nm} \\cdot \\frac{n(n - 1)}{2} = 1 + \\frac{n - 1}{2m} = 1 + \\frac{\\alpha}{2} - \\frac{\\alpha}{2n}.$$
            Somando o tempo $\\Theta(1)$ para avaliar $h(k)$, o tempo total esperado é $\\Theta(2 + \\alpha/2 - \\alpha/2n) = \\mathbf{\\Theta(1 + \\alpha)}$. $\\blacksquare$
          </div>

          <p><strong>Significado Prático:</strong> Se o número $n$ de chaves é no máximo proporcional ao número $m$ de posições da tabela ($n = O(m)$), então $\\alpha = n/m = O(1)$, e portanto <strong>todas as operações de dicionário (<code>INSERT</code>, <code>DELETE</code>, <code>SEARCH</code>) executam em tempo $O(1)$ em média!</strong></p>
        `
      },

      /* ====================================================================
         UNIDADE 7.4 — CAPÍTULO 11, SEÇÃO 11.3 (pp. 224–234)
         ==================================================================== */
      {
        id: "u7-4",
        code: "UNIDADE 04 • CAPÍTULO 11, SEÇÃO 11.3 (PP. 224–234)",
        title: "11.3 Funções de Dispersão e Dispersão Universal (Hashing Universal)",
        readingTime: "45 min",
        objectives: [
          "Interpretar chaves arbitrárias (como strings ASCII) como números naturais em base adequada (ex.: raiz 128 ou 2^p).",
          "Projetar funções hash pelo Método da Divisão (h(k) = k mod m), compreendendo por que evitar m = 2^p e m = 2^p - 1 e preferir números primos afastados de potências de 2.",
          "Projetar funções hash pelo Método da Multiplicação (h(k) = ⌊m(kA mod 1)⌋), aplicando a constante áurea de Knuth A ≈ (√5 - 1)/2 e a implementação em palavras de w bits.",
          "Compreender a vulnerabilidade de funções hash fixas a adversários e dominar a teoria de Hashing Universal (Teorema 11.3, Corolário 11.4 e a construção algébrica da família universal H_{pm} no Teorema 11.5)."
        ],
        content: `
          <h3>1. O Que Faz uma Boa Função Hash e Interpretação como Números Naturais (pp. 224–225)</h3>
          <p>Uma boa função hash satisfaz aproximadamente a hipótese de hashing uniforme simples: cada chave tem igual probabilidade de ir para qualquer uma das $m$ posições, independentemente de padrões que existam nos dados (por exemplo, se chaves reais $k$ forem distribuídas uniformemente em $[0, 1)$, então $h(k) = \\lfloor km \\rfloor$ satisfaz exatamente essa condição).</p>
          <p>Como as funções hash operam sobre o universo $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$, chaves não numéricas (como cadeias de caracteres na tabela de símbolos de um compilador) são interpretadas como inteiros em uma base adequada: por exemplo, usando a tabela ASCII (raiz $128$), o identificador <code>pt</code> ($\\text{'p'} = 112$, $\\text{'t'} = 116$) torna-se $(112 \\cdot 128) + 116 = 14.452$.</p>

          <h3>2. O Método da Divisão (Seção 11.3.1, pp. 225–226)</h3>
          <p>No <strong>método da divisão</strong>, mapeamos uma chave $k$ para uma das $m$ posições tomando o resto da divisão de $k$ por $m$:</p>
          $$h(k) = k \\bmod m.$$
          <p>Embora seja extremamente rápido (exige uma única operação de resto), a escolha de $m$ é crítica:</p>
          <ul>
            <li><strong>Jamais escolha $m = 2^p$ (potência de 2):</strong> Se $m = 2^p$, então $k \\bmod 2^p$ extrai <strong>apenas os $p$ bits menos significativos</strong> de $k$, ignorando completamente todos os bits de ordem superior!</li>
            <li><strong>Evite $m = 2^p - 1$ quando as chaves são cadeias em base $2^p$ (Exercício 11.3-3):</strong> Como $2^p \\equiv 1 \\pmod{2^p - 1}$, permutar os caracteres de uma string não altera o valor de $k \\bmod (2^p - 1)$ (todos os anagramas colidem!).</li>
            <li><strong>Escolha Recomendada:</strong> Um <strong>número primo não muito próximo de uma potência exata de $2$</strong>. Por exemplo, para armazenar $n \\approx 2.000$ cadeias aceitando uma média de $\\alpha \\approx 3$ elementos por busca sem sucesso, escolhemos $m = 701$ (primo próximo de $2000/3$ e longe de $2^9 = 512$ e $2^{10} = 1024$), usando $h(k) = k \\bmod 701$.</li>
          </ul>

          <h3>3. O Método da Multiplicação (Seção 11.3.2, pp. 226–227)</h3>
          <p>O <strong>método da multiplicação</strong> opera em duas etapas sobre uma constante real $A$ fixada no intervalo $0 < A < 1$:</p>
          $$h(k) = \\lfloor m (k A \\bmod 1) \\rfloor,$$
          <p>onde $kA \\bmod 1 = kA - \\lfloor kA \\rfloor$ é a <strong>parte fracionária</strong> de $kA$.</p>
          <ul>
            <li><strong>Vantagem:</strong> O valor de $m$ não é crítico; escolhemos tipicamente $m = 2^p$ (potência de 2) para implementar o cálculo com operações rápidas de multiplicação inteira e deslocamento de bits (Figura 11.4, p. 227):
              <ul>
                <li>Em uma máquina com palavras de $w$ bits (onde $k$ cabe em 1 palavra), representamos $A = s / 2^w$, onde $0 < s < 2^w$ é um inteiro de $w$ bits.</li>
                <li>Multiplicamos $k \\times s$, obtendo um produto de $2w$ bits da forma $r_1 2^w + r_0$, onde $r_1$ é a palavra de ordem alta (parte inteira de $kA$) e $r_0$ é a palavra de ordem baixa (que representa a parte fracionária $kA \\bmod 1$).</li>
                <li>Os <strong>$p$ bits mais significativos da metade inferior $r_0$</strong> (obtidos por $r_0 \\gg (w - p)$) formam exatamente o valor hash $h(k)$!</li>
              </ul>
            </li>
            <li><strong>A Constante Áurea de Knuth:</strong> Donald Knuth sugere escolher $A$ próximo ao conjugado da razão áurea:
              $$A \\approx \\frac{\\sqrt{5} - 1}{2} = 0,6180339887\\dots$$
              <strong>Exemplo do Livro (p. 226):</strong> Para $k = 123456$, $p = 14$ ($m = 2^{14} = 16384$) e $w = 32$, temos $s = \\lfloor A \\cdot 2^{32} \\rfloor = 2654435769$. O produto é $k \\times s = 327.706.022.297.664 = 76300 \\cdot 2^{32} + 17612864$, logo $r_1 = 76300$ e $r_0 = 17612864$. Tomando os $14$ bits mais significativos de $r_0$, obtemos $\\lfloor 17612864 / 2^{32 - 14} \\rfloor = \\lfloor 17612864 / 262144 \\rfloor = \\mathbf{67}$.</li>
          </ul>

          <h3>4. Hashing Universal (Seção 11.3.3, pp. 227–231): Imunidade Contra Adversários</h3>
          <p>Se um adversário malicioso (ou um caso patológico real) conhecer a função hash <strong>fixa</strong> $h$ usada por um sistema, ele poderá escolher $n$ chaves que sejam todas mapeadas para a mesma posição, forçando buscas em tempo $\\Theta(n)$. A única solução matematicamente sólida — exatamente como fizemos no <code>RANDOMIZED-QUICKSORT</code> — é <strong>sortear a função hash aleatoriamente no início da execução</strong> a partir de uma família de funções cuidadosamente projetada, de modo independente das chaves de entrada.</p>

          <div class="canonical-callout important">
            <strong>Definição de Família Universal de Funções Hash ($\mathscr{H}$, p. 228):</strong> Seja $\mathscr{H}$ uma coleção finita de funções hash que mapeiam um universo $U$ de chaves para $\\{0, 1, \\dots, m - 1\\}$. Dizemos que $\mathscr{H}$ é <strong>universal</strong> se, para cada par de chaves distintas $k, l \\in U$, o número de funções $h \\in \\mathscr{H}$ para as quais $h(k) = h(l)$ é no máximo $|\\mathscr{H}|/m$:
            $$|\\{h \\in \\mathscr{H} : h(k) = h(l)\\}| \\le \\frac{|\\mathscr{H}|}{m} \\quad \\Longleftrightarrow \\quad \\Pr_{h \\in \\mathscr{H}}\\{h(k) = h(l)\\} \\le \\frac{1}{m}.$$
          </div>

          <div class="canonical-callout important">
            <strong>Teorema 11.3 e Corolário 11.4 (Desempenho Esperado com Hashing Universal, pp. 228–229):</strong> Suponha que $h$ seja escolhida uniformemente ao acaso de uma coleção universal $\mathscr{H}$ para espalhar $n$ chaves em uma tabela $T$ de tamanho $m$ com encadeamento:<br>
            <ul>
              <li>Se $k \\notin T$, o comprimento esperado da lista $T[h(k)]$ satisfaz $\\text{E}[n_{h(k)}] \\le \\alpha = n/m$.</li>
              <li>Se $k \\in T$, o comprimento esperado da lista que contém $k$ satisfaz $\\text{E}[n_{h(k)}] \\le 1 + \\frac{n - 1}{m} < 1 + \\alpha$.</li>
            </ul>
            <strong>Prova:</strong> Para cada par $k \\neq l$, seja $X_{kl} = \\text{I}\\{h(k) = h(l)\\}$. Pela definição de família universal, $\\text{E}[X_{kl}] = \\Pr\\{h(k) = h(l)\\} \\le 1/m$. Seja $Y_k = \\sum_{l \\in T,\\, l \\neq k} X_{kl}$ o número de chaves em $T$ diferentes de $k$ que colidem com $k$. Se $k \\notin T$, há $n$ termos na soma e $n_{h(k)} = Y_k$, logo $\\text{E}[n_{h(k)}] \\le n(1/m) = \\alpha$. Se $k \\in T$, há $n - 1$ termos na soma e $n_{h(k)} = 1 + Y_k$, logo $\\text{E}[n_{h(k)}] \\le 1 + (n - 1)/m < 1 + \\alpha$. $\\blacksquare$<br>
            <strong>Corolário 11.4:</strong> Qualquer sequência de $n$ operações <code>INSERT</code>, <code>SEARCH</code> e <code>DELETE</code> contendo $O(m)$ operações <code>INSERT</code> é processada em <strong>tempo total esperado $\\Theta(n)$</strong> — independentemente de quem escolheu as chaves!
          </div>

          <h4>Construção Algébrica da Classe Universal $\mathscr{H}_{pm}$ (Teorema 11.5, pp. 229–231)</h4>
          <p>Como construir explicitamente uma família universal $\mathscr{H}_{pm}$ para qualquer tamanho de tabela $m$ (mesmo que $m$ não seja primo)?</p>
          <ol>
            <li>Escolhemos um número primo $p$ suficientemente grande tal que toda chave possível $k$ pertença a $\\mathbb{Z}_p = \\{0, 1, \\dots, p - 1\\}$ e $p > m$. Seja $\\mathbb{Z}_p^* = \\{1, 2, \\dots, p - 1\\}$.</li>
            <li>Para cada $a \\in \\mathbb{Z}_p^*$ ($p - 1$ escolhas) e cada $b \\in \\mathbb{Z}_p$ ($p$ escolhas), definimos a função linear modular:
              $$h_{ab}(k) = ((ak + b) \\bmod p) \\bmod m.$$
              (Exemplo: com $p = 17$ e $m = 6$, temos $h_{3,4}(8) = ((3 \\cdot 8 + 4) \\bmod 17) \\bmod 6 = (28 \\bmod 17) \\bmod 6 = 11 \\bmod 6 = 5$.)</li>
            <li>A família completa possui $p(p - 1)$ funções:
              $$\\mathscr{H}_{pm} = \\{h_{ab} : a \\in \\mathbb{Z}_p^* \\text{ e } b \\in \\mathbb{Z}_p\\}.$$</li>
          </ol>

          <div class="canonical-callout note">
            <strong>Teorema 11.5 (Prova de que $\mathscr{H}_{pm}$ é Universal, p. 230):</strong> Sejam $k, l \\in \\mathbb{Z}_p$ duas chaves distintas ($k \\neq l$). Para uma função $h_{ab}$, definimos os valores antes da redução módulo $m$:
            $$r = (ak + b) \\bmod p \\quad \\text{e} \\quad s = (al + b) \\bmod p.$$
            Como $p$ é primo, $a \\not\\equiv 0 \\pmod p$ e $k - l \\not\\equiv 0 \\pmod p$, temos $r - s \\equiv a(k - l) \\not\\equiv 0 \\pmod p$, logo <strong>$r \\neq s$ (jamais há colisão no nível módulo $p$)</strong>! Mais ainda, para $k, l$ fixos, o sistema linear modular tem solução única $a = ((r - s)((k - l)^{-1} \\bmod p)) \\bmod p$ e $b = (r - ak) \\bmod p$, estabelecendo uma <strong>bijeção 1-para-1</strong> entre os $p(p - 1)$ pares $(a, b) \\in \\mathbb{Z}_p^* \\times \\mathbb{Z}_p$ e os $p(p - 1)$ pares $(r, s) \\in \\mathbb{Z}_p \\times \\mathbb{Z}_p$ com $r \\neq s$.<br>
            Para cada valor fixo de $r$, entre os $p - 1$ valores possíveis restantes para $s \\neq r$, quantos satisfazem $s \\equiv r \\pmod m$? No máximo $\\lceil p/m \\rceil - 1 \\le \\frac{p - 1}{m}$. Portanto, a probabilidade de colisão quando $(a, b)$ é sorteado uniformemente é no máximo $\\frac{(p - 1)/m}{p - 1} = \\mathbf{\\frac{1}{m}}$. $\\blacksquare$
          </div>
        `
      },

      /* ====================================================================
         UNIDADE 7.5 — CAPÍTULO 11, SEÇÃO 11.4 (pp. 234–242)
         ==================================================================== */
      {
        id: "u7-5",
        code: "UNIDADE 05 • CAPÍTULO 11, SEÇÃO 11.4 (PP. 234–242)",
        title: "11.4 Endereçamento Aberto (Sondagem Linear, Quadrática e Dispersão Dupla)",
        readingTime: "45 min",
        objectives: [
          "Compreender o funcionamento do endereçamento aberto (α = n/m ≤ 1, ausência total de ponteiros e listas externas) e o conceito de sequência de sondagem ⟨h(k, 0), ..., h(k, m - 1)⟩.",
          "Implementar HASH-INSERT(T, k), HASH-SEARCH(T, k) e explicar por que a remoção exige o marcador especial DELETED.",
          "Comparar rigorosamente Sondagem Linear (e agrupamento primário), Sondagem Quadrática (e agrupamento secundário) e Hash Duplo (Θ(m²) sequências de sondagem com mdc(h₂(k), m) = 1).",
          "Demonstrar o Teorema 11.6 (≤ 1/(1 - α) sondagens em busca mal sucedida), o Corolário 11.7 e o Teorema 11.8 (≤ (1/α) ln(1/(1 - α)) sondagens em busca bem-sucedida)."
        ],
        content: `
          <h3>1. Princípios do Endereçamento Aberto e Sequências de Sondagem (pp. 234–236)</h3>
          <p>No <strong>endereçamento aberto</strong> (<em>open addressing</em>), todos os elementos residem diretamente dentro da própria tabela $T[0 \\dots m - 1]$: cada posição contém um elemento do conjunto dinâmico ou <code>NIL</code>. Não há listas ligadas nem ponteiros armazenados fora ou dentro da tabela (portanto $n \\le m$ e o fator de carga satisfaz obrigatoriamente <strong>$\\alpha = n/m \\le 1$</strong>). A memória economizada ao eliminar os ponteiros permite alocar uma tabela com mais posições para a mesma quantidade física de RAM, reduzindo $\\alpha$ e acelerando a busca.</p>
          <p>Para inserir ou buscar uma chave $k$, <strong>sondamos</strong> (examinamos sucessivamente) posições da tabela usando uma função hash estendida que recebe o número da sondagem $i \\in \\{0, 1, \\dots, m - 1\\}$ como segundo argumento:</p>
          $$h : U \\times \\{0, 1, \\dots, m - 1\\} \\to \\{0, 1, \\dots, m - 1\\}.$$
          <p>Exigimos que, para toda chave $k$, a <strong>sequência de sondagem</strong></p>
          $$\\langle h(k, 0),\\; h(k, 1),\\; \\dots,\\; h(k, m - 1) \\rangle$$
          <p>seja uma <strong>permutação de $\\langle 0, 1, \\dots, m - 1 \\rangle$</strong>, garantindo que toda posição da tabela possa ser examinada caso a tabela esteja quase cheia.</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">HASH-INSERT(T, k)</span> e <span class="proc-name">HASH-SEARCH(T, k)</span> em Endereçamento Aberto</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">HASH-INSERT</span>(T, k)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    i = 0</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    <span class="kw">repeat</span></span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">        j = h(k, i)</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">        <span class="kw">if</span> T[j] == NIL</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">            T[j] = k</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">            <span class="kw">return</span> j</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">        <span class="kw">else</span> i = i + 1</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">    <span class="kw">until</span> i == m</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">    <span class="kw">error</span> "estouro da tabela de espalhamento (hash table overflow)"</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content"><span class="kw">HASH-SEARCH</span>(T, k)</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">    i = 0</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">    <span class="kw">repeat</span></span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content">        j = h(k, i)</span></div>
              <div class="code-line"><span class="line-num">16</span><span class="line-content">        <span class="kw">if</span> T[j] == k</span></div>
              <div class="code-line"><span class="line-num">17</span><span class="line-content">            <span class="kw">return</span> j</span></div>
              <div class="code-line"><span class="line-num">18</span><span class="line-content">        i = i + 1</span></div>
              <div class="code-line"><span class="line-num">19</span><span class="line-content">    <span class="kw">until</span> T[j] == NIL <span class="kw">ou</span> i == m</span></div>
              <div class="code-line"><span class="line-num">20</span><span class="line-content">    <span class="kw">return</span> NIL</span></div>
            </div>
          </div>

          <div class="canonical-callout warning">
            <strong>Por que a Eliminação Exige o Marcador Especial <code>DELETED</code>? (p. 235):</strong> Quando removemos uma chave da posição $j$, <strong>jamais podemos gravar <code>T[j] = NIL</code></strong>! Se fizéssemos isso, uma chamada subsequente a <code>HASH-SEARCH(T, k')</code> para outra chave $k'$ cuja inserção havia colidido em $j$ e prosseguido para $i + 1$ pararia prematuramente na linha 19 ao encontrar <code>T[j] == NIL</code>, concluindo falsamente que $k'$ não está na tabela!<br>
            <strong>Solução:</strong> Gravamos o marcador especial <strong><code>DELETED</code></strong> (lápide / <em>tombstone</em>) na posição removida. <code>HASH-SEARCH</code> trata <code>DELETED</code> como posição ocupada e continua sondando adiante, enquanto <code>HASH-INSERT</code> trata <code>DELETED</code> como posição livre (<code>if T[j] == NIL ou T[j] == DELETED</code>) para reutilizar o espaço. Contudo, como os tempos de busca deixam de depender apenas do fator de carga atual $\\alpha$, quando há eliminações frequentes costuma-se preferir o encadeamento.
          </div>

          <h3>2. As Três Técnicas de Sondagem: Linear, Quadrática e Hash Duplo (pp. 236–238)</h3>
          <p>O modelo teórico idealizado de <strong>hashing uniforme</strong> supõe que a sequência de sondagem de cada chave é igualmente provável de ser qualquer uma das $m!$ permutações de $\\langle 0, 1, \\dots, m - 1 \\rangle$. Na prática, aproximamos esse ideal com três técnicas clássicas:</p>

          <div class="canonical-table-wrap">
            <table class="canonical-table">
              <thead>
                <tr>
                  <th>Técnica</th>
                  <th>Função de Sondagem $h(k, i)$ ($0 \\le i < m$)</th>
                  <th>Nº de Sequências Distintas</th>
                  <th>Fenômeno de Agrupamento / Requisitos</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>1. Sondagem Linear</strong></td>
                  <td>$h(k, i) = (h'(k) + i) \\bmod m$</td>
                  <td>Apenas $\\mathbf{m}$ sequências</td>
                  <td>Sofre de <strong>agrupamento primário</strong> (<em>primary clustering</em>): um bloco de $i$ posições cheias absorve a próxima chave com probabilidade $(i+1)/m$, fundindo blocos em filas longas.</td>
                </tr>
                <tr>
                  <td><strong>2. Sondagem Quadrática</strong></td>
                  <td>$h(k, i) = (h'(k) + c_1 i + c_2 i^2) \\bmod m$<br>($c_2 \\neq 0$)</td>
                  <td>Apenas $\\mathbf{m}$ sequências</td>
                  <td>Sofre de <strong>agrupamento secundário</strong> (<em>secondary clustering</em>): se $h'(k_1) = h'(k_2)$, ambas percorrem exatamente a mesma sequência. Exige escolha cuidadosa de $c_1, c_2, m$ (ex.: $m = 2^p$ e $c_1 = c_2 = 1/2$, Problema 11-3).</td>
                </tr>
                <tr>
                  <td><strong>3. Hash Duplo (Double Hashing)</strong></td>
                  <td>$h(k, i) = (h_1(k) + i \\cdot h_2(k)) \\bmod m$</td>
                  <td>$\\mathbf{\\Theta(m^2)}$ sequências</td>
                  <td><strong>Sem agrupamento!</strong> Tanto a posição inicial $h_1(k)$ quanto o passo $h_2(k)$ dependem de $k$. Exige que <strong>$\\text{mdc}(h_2(k), m) = 1$</strong> (primos entre si) para permutar toda a tabela.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p><strong>Como garantir $\\text{mdc}(h_2(k), m) = 1$ no Hash Duplo (p. 237):</strong></p>
          <ul>
            <li><strong>Opção 1 ($m = 2^p$):</strong> Projetar $h_2(k)$ de modo que retorne sempre um <strong>inteiro ímpar</strong>.</li>
            <li><strong>Opção 2 ($m$ primo):</strong> Projetar $h_2(k)$ de modo que retorne sempre um inteiro estritamente positivo entre $1$ e $m - 1$, por exemplo:
              $$h_1(k) = k \\bmod m, \\qquad h_2(k) = 1 + (k \\bmod m'),$$
              onde $m' < m$ (tipicamente $m' = m - 1$ ou $m - 2$, como na Figura 11.5 com $m = 13$ e $m' = 11$).</li>
          </ul>

          <h3>3. Análise do Endereçamento Aberto sob Hashing Uniforme: Teoremas 11.6, 11.7 e 11.8 (pp. 238–241)</h3>

          <div class="canonical-callout important">
            <strong>Teorema 11.6 e Corolário 11.7 (Busca Mal Sucedida e Inserção, pp. 239–240):</strong> Dada uma tabela de espalhamento de endereço aberto com fator de carga $\\alpha = n/m < 1$, o número esperado de sondagens em uma <strong>busca mal sucedida</strong> (e, consequentemente, em uma <strong>inserção</strong> <code>HASH-INSERT</code>) é no máximo
            $$\\mathbf{\\frac{1}{1 - \\alpha}},$$
            supondo hashing uniforme.<br><br>
            <strong>Prova Completa:</strong> Seja $X$ a variável aleatória que conta o número de sondagens realizadas em uma busca mal sucedida (onde toda sondagem exceto a última acessa uma posição ocupada e a última acessa uma posição vazia), e seja $A_i$ o evento em que ocorre uma $i$-ésima sondagem e ela acessa uma posição ocupada. O evento $\\{X \\ge i\\}$ equivale à interseção $A_1 \\cap A_2 \\cap \\dots \\cap A_{i-1}$:
            $$\\Pr\\{X \\ge i\\} = \\Pr\\{A_1\\} \\cdot \\Pr\\{A_2 \\mid A_1\\} \\cdot \\Pr\\{A_3 \\mid A_1 \\cap A_2\\} \\cdots \\Pr\\{A_{i-1} \\mid A_1 \\cap \\dots \\cap A_{i-2}\\}.$$
            Como há $n$ elementos em $m$ posições e já examinamos $j - 1$ posições ocupadas distintas sem reposição:
            $$\\Pr\\{A_j \\mid A_1 \\cap \\dots \\cap A_{j-1}\\} = \\frac{n - j + 1}{m - j + 1} \\le \\frac{n}{m} = \\alpha \\quad (\\text{pois } n < m \\text{ e } j \\ge 1).$$
            Portanto, $\\Pr\\{X \\ge i\\} \\le \\alpha^{i-1}$ para $1 \\le i \\le m$ (e $\\Pr\\{X \\ge i\\} = 0$ para $i > m$). Pela identidade da esperança para naturais (Equação C.25, $\\text{E}[X] = \\sum_{i=1}^{\\infty} \\Pr\\{X \\ge i\\}$):
            $$\\text{E}[X] = \\sum_{i=1}^{\\infty} \\Pr\\{X \\ge i\\} \\le \\sum_{i=1}^{\\infty} \\alpha^{i-1} = \\sum_{i=0}^{\\infty} \\alpha^i = \\mathbf{\\frac{1}{1 - \\alpha}}. \\quad \\blacksquare$$
            <em>Exemplo numérico:</em> Se a tabela está $50\\%$ cheia ($\alpha = 0,5$), fazemos no máximo $1/(1 - 0,5) = 2$ sondagens em média; se está $90\\%$ cheia ($\alpha = 0,9$), fazemos no máximo $1/(1 - 0,9) = 10$ sondagens em média.
          </div>

          <div class="canonical-callout important">
            <strong>Teorema 11.8 (Busca Bem-Sucedida em Endereçamento Aberto, pp. 240–241):</strong> Dada uma tabela de endereço aberto com fator de carga $\\alpha = n/m < 1$, o número esperado de sondagens em uma <strong>busca bem-sucedida</strong> é no máximo
            $$\\mathbf{\\frac{1}{\\alpha} \\ln \\frac{1}{1 - \\alpha}},$$
            supondo hashing uniforme e que cada uma das $n$ chaves na tabela tem igual probabilidade $1/n$ de ser procurada.<br><br>
            <strong>Prova Completa:</strong> A busca por uma chave $k$ que foi a $(i + 1)$-ésima chave inserida na tabela ($0 \\le i \\le n - 1$) refaz exatamente a sequência de sondagem de sua inserção quando a tabela continha $i$ chaves (fator de carga $i/m$). Pelo Corolário 11.7, o número esperado de sondagens para encontrar essa chave é no máximo $\\frac{1}{1 - i/m} = \\frac{m}{m - i}$. Tomando a média sobre todas as $n$ chaves e limitando o somatório por uma integral (Equação A.12):
            $$\\frac{1}{n}\\sum_{i=0}^{n-1} \\frac{m}{m - i} = \\frac{m}{n}\\sum_{i=0}^{n-1} \\frac{1}{m - i} = \\frac{1}{\\alpha}\\sum_{k=m-n+1}^{m} \\frac{1}{k} \\le \\frac{1}{\\alpha}\\int_{m-n}^{m} \\frac{1}{x}\\,dx = \\frac{1}{\\alpha}\\ln\\frac{m}{m - n} = \\mathbf{\\frac{1}{\\alpha}\\ln\\frac{1}{1 - \\alpha}}. \\quad \\blacksquare$$
            <em>Exemplo numérico:</em> Para $\\alpha = 0,5$, o limite é $2 \\ln 2 \\approx 1,387$ sondagens; para $\\alpha = 0,9$, o limite é $\\frac{1}{0,9}\\ln 10 \\approx 2,559$ sondagens!
          </div>
        `
      },

      /* ====================================================================
         UNIDADE 7.6 — CAPÍTULO 11, SEÇÃO 11.5 (pp. 242–247)
         ==================================================================== */
      {
        id: "u7-6",
        code: "UNIDADE 06 • CAPÍTULO 11, SEÇÃO 11.5 (PP. 242–247)",
        title: "11.5 Dispersão Perfeita (Perfect Hashing em Pior Caso O(1))",
        readingTime: "40 min",
        objectives: [
          "Compreender quando e como alcançar busca em tempo de pior caso O(1) para conjuntos de chaves estáticos (esquema FKS de Fredman, Komlós e Szemerédi).",
          "Demonstrar o Teorema 11.9: em uma tabela de tamanho quadrático m = n², uma função sorteada de uma família universal não produz nenhuma colisão com probabilidade > 1/2.",
          "Construir a estrutura de dois níveis do Hashing Perfeito (T[0 .. n - 1] no nível 1 e tabelas secundárias S_j de tamanho m_j = n_j² no nível 2).",
          "Demonstrar o Teorema 11.10 e os Corolários 11.11 e 11.12, provando que o espaço total esperado das tabelas secundárias é estritamente menor que 2n (armazenamento linear O(n))."
        ],
        content: `
          <h3>1. O Desafio do Pior Caso $O(1)$ e a Arquitetura de Dois Níveis (pp. 242–243)</h3>
          <p>Quando o conjunto $K$ de $n$ chaves é <strong>estático</strong> — isto é, uma vez armazenado na tabela, o conjunto nunca mais sofre inserções ou remoções (como o conjunto de palavras reservadas de uma linguagem de programação em um compilador, ou um dicionário fixo em ROM) —, podemos projetar um esquema de <strong>hashing perfeito</strong> (<em>perfect hashing</em>, devido a Fredman, Komlós e Szemerédi) no qual <strong>toda busca executa em tempo de pior caso estritamente $O(1)$ (exatamente 2 acessos a tabelas, com ZERO colisões!)</strong> usando memória total $O(n)$.</p>
          <p>Como mostra a Figura 11.6 (p. 242), o hashing perfeito utiliza <strong>dois níveis de hashing universal</strong>:</p>
          <ol>
            <li><strong>Primeiro Nível (Tabela Primária $T[0 \\dots m - 1]$ com $m = n$):</strong> Espalhamos as $n$ chaves em $m = n$ posições usando uma função $h \\in \\mathscr{H}_{pm}$ escolhida de uma família universal.</li>
            <li><strong>Segundo Nível (Tabelas Secundárias $S_j$ de tamanho $m_j = n_j^2$):</strong> Em vez de encadear em uma lista ligada as $n_j$ chaves que caíram na posição $j$, alocamos uma pequena <strong>tabela de espalhamento secundária $S_j$</strong> de tamanho <strong>quadrático $m_j = n_j^2$</strong> com uma função hash secundária própria $h_j \\in \\mathscr{H}_{p, m_j}$, escolhida cuidadosamente até que <strong>não ocorra nenhuma colisão dentro de $S_j$</strong>! (Se $n_j = 1$, basta $m_j = 1$ e $a_j = b_j = 0$; se $n_j = 0$, $S_j = \\text{NIL}$.)</li>
          </ol>

          <h3>2. Por Que $m_j = n_j^2$ Elimina Colisões? O Teorema 11.9 (pp. 243–244)</h3>
          <p>O primeiro passo é provar que, quando o tamanho de uma tabela é o quadrado do número de elementos ($m = n^2$), mais da metade das funções hash de uma família universal $\mathscr{H}$ não produz absolutamente nenhuma colisão:</p>

          <div class="canonical-callout important">
            <strong>Teorema 11.9 (Ausência de Colisões em Espaço Quadrático $m = n^2$, p. 243):</strong> Suponha que armazenamos $n$ chaves em uma tabela de espalhamento de tamanho $m = n^2$ usando uma função hash $h$ escolhida uniformemente ao acaso de uma classe universal $\mathscr{H}$. Então, a probabilidade de ocorrer qualquer colisão é <strong>estritamente menor que $1/2$</strong>.<br><br>
            <strong>Prova Completa:</strong> Existem $\\binom{n}{2} = \\frac{n(n - 1)}{2}$ pares de chaves distintas que podem colidir. Para cada par, a probabilidade de colisão sob uma família universal é no máximo $1/m$. Seja $X$ a variável aleatória que conta o número total de colisões. Pela linearidade da esperança, quando $m = n^2$:
            $$\\text{E}[X] \\le \\binom{n}{2} \\cdot \\frac{1}{n^2} = \\frac{n^2 - n}{2} \\cdot \\frac{1}{n^2} < \\frac{1}{2}.$$
            Aplicando a <strong>desigualdade de Markov</strong> ($\\Pr\\{X \\ge t\\} \\le \\text{E}[X]/t$, Equação C.30) com $t = 1$:
            $$\\Pr\\{X \\ge 1\\} \\le \\frac{\\text{E}[X]}{1} < \\frac{1}{2}.$$
            Logo, com probabilidade $> 1/2$, uma função $h$ sorteada ao acaso tem $X = 0$ colisões (bastam em média $< 2$ tentativas aleatórias para encontrar uma função livre de colisões)! $\\blacksquare$
          </div>

          <h3>3. Por Que a Soma dos Quadrados $\\sum n_j^2$ Continua Linear $O(n)$? Teorema 11.10 e Corolários 11.11 e 11.12 (pp. 244–245)</h3>
          <p>Se usássemos uma única tabela de tamanho $m = n^2$, o espaço seria quadrático $\\Theta(n^2)$ — excessivo para $n$ grande. Mas ao aplicar o tamanho quadrático $m_j = n_j^2$ <em>apenas dentro de cada balde secundário $S_j$</em> após um primeiro nível com $m = n$, a soma total dos tamanhos das tabelas secundárias $\\sum_{j=0}^{m-1} m_j = \\sum_{j=0}^{m-1} n_j^2$ permanece esperada <strong>menor que $2n$</strong>!</p>

          <div class="canonical-callout important">
            <strong>Teorema 11.10 e Corolário 11.11 (Espaço Total Esperado $< 2n$, pp. 244–245):</strong> Se armazenamos $n$ chaves em uma tabela de primeiro nível de tamanho $m = n$ usando uma função $h$ sorteada de uma classe universal $\mathscr{H}$, então o tamanho combinado esperado de todas as tabelas secundárias $m_j = n_j^2$ satisfaz:
            $$\\text{E}\\left[\\sum_{j=0}^{m-1} m_j\\right] = \\text{E}\\left[\\sum_{j=0}^{m-1} n_j^2\\right] < \\mathbf{2n}.$$
            <strong>Prova Completa:</strong> Para qualquer inteiro não negativo $a$, vale a identidade algébrica $a^2 = a + 2\\binom{a}{2}$. Aplicando a cada $n_j$:
            $$\\text{E}\\left[\\sum_{j=0}^{m-1} n_j^2\\right] = \\text{E}\\left[\\sum_{j=0}^{m-1} \\left(n_j + 2\\binom{n_j}{2}\\right)\\right] = \\text{E}\\left[\\sum_{j=0}^{m-1} n_j\\right] + 2\\,\\text{E}\\left[\\sum_{j=0}^{m-1} \\binom{n_j}{2}\\right].$$
            <ul>
              <li>O primeiro somatório $\\sum_{j=0}^{m-1} n_j$ é simplesmente o número total de elementos na tabela, que vale exatamente <strong>$n$</strong>.</li>
              <li>O segundo somatório $\\sum_{j=0}^{m-1} \\binom{n_j}{2}$ conta exatamente o <strong>número total de pares de chaves que colidem no primeiro nível</strong>! Pela propriedade de hashing universal, como há $\\binom{n}{2}$ pares e cada par colide com probabilidade $\\le 1/m = 1/n$:
                $$\\text{E}\\left[\\sum_{j=0}^{m-1} \\binom{n_j}{2}\\right] \\le \\binom{n}{2}\\cdot\\frac{1}{m} = \\frac{n(n - 1)}{2m} = \\frac{n - 1}{2} \\quad (\\text{pois } m = n).$$</li>
            </ul>
            Substituindo os dois termos:
            $$\\text{E}\\left[\\sum_{j=0}^{m-1} n_j^2\\right] \\le n + 2\\cdot\\frac{n - 1}{2} = 2n - 1 < \\mathbf{2n}. \\quad \\blacksquare$$
          </div>

          <p><strong>Corolário 11.12 (Limite de Cauda via Desigualdade de Markov, p. 245):</strong> Aplicando novamente a desigualdade de Markov a $X = \\sum_{j=0}^{m-1} m_j$ com $t = 4n$:</p>
          $$\\Pr\\left\\{\\sum_{j=0}^{m-1} m_j \\ge 4n\\right\\} \\le \\frac{\\text{E}[X]}{4n} < \\frac{2n}{4n} = \\frac{1}{2}.$$
          <p>Portanto, basta testar algumas poucas funções universais no nível 1 até encontrar uma em que $\\sum n_j^2 < 4n$, e depois algumas poucas funções universais em cada $S_j$ até eliminar todas as colisões secundárias, construindo o dicionário perfeito em tempo esperado $O(n)$, espaço total $O(n)$ e busca em <strong>pior caso $O(1)$</strong>!</p>
        `
      }
    ],

    /* ======================================================================
       WORKBENCH INTERATIVO DUPLO (SIMULADOR DE HASHING + LISTA COM SENTINELA)
       ====================================================================== */
    initWorkbenches: function () {
      const mount = document.getElementById("workbench-mod7-mount");
      if (!mount) return;

      mount.innerHTML = `
        <div class="workbench-container" style="margin: 2rem 0; border: 2px solid var(--ink-primary); background: var(--bg-secondary); padding: 1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; margin-bottom:1rem; border-bottom:2px solid var(--ink-primary); padding-bottom:0.75rem;">
            <div>
              <span style="font-family:var(--font-mono); font-size:0.75rem; font-weight:700; color:var(--accent-amber);">[ WORKBENCH INTERATIVO • MÓDULO 07 ]</span>
              <h4 style="margin:0.25rem 0 0 0; font-size:1.1rem;">Laboratório Duplo: Tabelas de Espalhamento (Cap. 11) &amp; Listas com Sentinela / Lista Livre (Cap. 10)</h4>
            </div>
            <div style="display:flex; gap:0.5rem;">
              <button id="mod7-tab-hash" class="btn-primary-brutal" onclick="window.switchMod7WorkbenchTab('hash')">1. Tabelas de Espalhamento (m = 11)</button>
              <button id="mod7-tab-list" class="btn-secondary-brutal" onclick="window.switchMod7WorkbenchTab('list')">2. Sentinela L.nil &amp; Lista Livre</button>
            </div>
          </div>

          <!-- PAINEL 1: SIMULADOR DE HASHING -->
          <div id="mod7-panel-hash" style="display:block;">
            <p style="font-size:0.88rem; margin-top:0;">
              Compare o comportamento de <strong>Encadeamento</strong>, <strong>Sondagem Linear</strong> ($h(k,i) = (k + i) \\bmod 11$), <strong>Sondagem Quadrática</strong> ($h(k,i) = (k + i + 3i^2) \\bmod 11$, Ex. 11.4-1) e <strong>Hash Duplo</strong> ($h_1(k) = k \\bmod 11$, $h_2(k) = 1 + (k \\bmod 10)$) em uma tabela $T[0 \\dots 10]$ ($m = 11$).
            </p>
            <div style="display:flex; gap:0.6rem; flex-wrap:wrap; align-items:center; margin-bottom:1rem;">
              <label style="font-family:var(--font-mono); font-size:0.78rem; font-weight:700;">Modo:</label>
              <select id="mod7-hash-mode" onchange="window.resetMod7HashTable()" style="font-family:var(--font-mono); padding:0.35rem 0.5rem; border:2px solid var(--ink-primary); background:var(--bg-card); color:var(--ink-primary);">
                <option value="linear">Endereçamento Aberto: Sondagem Linear (Ex. 11.4-1a)</option>
                <option value="quadratic">Endereçamento Aberto: Sondagem Quadrática c₁=1, c₂=3 (Ex. 11.4-1b)</option>
                <option value="double">Endereçamento Aberto: Hash Duplo h₂(k)=1+(k mod 10) (Ex. 11.4-1c)</option>
                <option value="chaining">Resolução por Encadeamento (Listas Duplamente Ligadas)</option>
              </select>
              <input id="mod7-hash-key" type="number" value="10" placeholder="Chave k" style="width:90px; font-family:var(--font-mono); padding:0.35rem 0.5rem; border:2px solid var(--ink-primary); background:var(--bg-card); color:var(--ink-primary);" />
              <button class="btn-primary-brutal" onclick="window.insertMod7HashKey()">INSERT(k)</button>
              <button class="btn-secondary-brutal" onclick="window.searchMod7HashKey()">SEARCH(k)</button>
              <button class="btn-secondary-brutal" onclick="window.deleteMod7HashKey()">DELETE(k)</button>
              <button class="btn-secondary-brutal" onclick="window.loadCanonicalEx1141()">Carregar Ex. 11.4-1 ⟨10,22,31,4,15,28,17,88,59⟩</button>
              <button class="btn-secondary-brutal" onclick="window.resetMod7HashTable()">Limpar</button>
            </div>
            <div id="mod7-hash-stage"></div>
          </div>

          <!-- PAINEL 2: SIMULADOR DE LISTA CIRCULAR COM SENTINELA E LISTA LIVRE -->
          <div id="mod7-panel-list" style="display:none;">
            <p style="font-size:0.88rem; margin-top:0;">
              Explore a representação em <strong>vários arranjos</strong> (<code>chave</code>, <code>proximo</code>, <code>anterior</code> de índices $0 \\dots 7$, onde o índice $0$ é a <strong>sentinela <code>L.nil</code></strong>) combinada com a <strong>lista livre (<code>livre</code>)</strong> operando como pilha em $O(1)$ via <code>ALLOCATE-OBJECT()</code> e <code>FREE-OBJECT(x)</code>.
            </p>
            <div style="display:flex; gap:0.6rem; flex-wrap:wrap; align-items:center; margin-bottom:1rem;">
              <input id="mod7-list-key" type="number" value="25" placeholder="Chave k" style="width:90px; font-family:var(--font-mono); padding:0.35rem 0.5rem; border:2px solid var(--ink-primary); background:var(--bg-card); color:var(--ink-primary);" />
              <button class="btn-primary-brutal" onclick="window.insertMod7SentinelList()">ALLOCATE + LIST-INSERT'(L, x)</button>
              <button class="btn-secondary-brutal" onclick="window.deleteMod7SentinelList()">LIST-SEARCH' + LIST-DELETE'(x) + FREE</button>
              <button class="btn-secondary-brutal" onclick="window.resetMod7SentinelList()">Restaurar Fig. 10.4 / 10.7 ({9, 16, 4, 1})</button>
            </div>
            <div id="mod7-list-stage"></div>
          </div>
        </div>
      `;

      /* Lógica do Simulador 1: Tabelas de Espalhamento */
      const M = 11;
      let hashTable = [];
      let hashChains = [];
      let lastHashLog = "";
      let highlightedSlots = [];

      function probeIndex(mode, k, i) {
        const h1 = ((k % M) + M) % M;
        if (mode === "linear") {
          return (h1 + i) % M;
        } else if (mode === "quadratic") {
          return (h1 + 1 * i + 3 * i * i) % M;
        } else {
          const h2 = 1 + (((k % (M - 1)) + (M - 1)) % (M - 1));
          return (h1 + i * h2) % M;
        }
      }

      window.resetMod7HashTable = function () {
        hashTable = new Array(M).fill(null);
        hashChains = Array.from({ length: M }, () => []);
        highlightedSlots = [];
        lastHashLog =
          "Tabela inicializada vazia ($m = 11$, $n = 0$, fator de carga $\\alpha = 0$). Insira chaves individualmente ou clique em <strong>Carregar Ex. 11.4-1</strong>.";
        renderMod7Hash();
      };

      window.insertMod7HashKey = function (customKey) {
        const modeSel = document.getElementById("mod7-hash-mode");
        const mode = modeSel ? modeSel.value : "linear";
        const inp = document.getElementById("mod7-hash-key");
        const k = customKey !== undefined ? customKey : parseInt(inp ? inp.value : "10", 10);
        if (isNaN(k)) return;

        highlightedSlots = [];
        if (mode === "chaining") {
          const j = ((k % M) + M) % M;
          hashChains[j].unshift(k);
          highlightedSlots = [j];
          const n = hashChains.reduce((acc, c) => acc + c.length, 0);
          lastHashLog = `<strong>CHAINED-HASH-INSERT(T, ${k}):</strong> $h(${k}) = ${k} \\bmod 11 = ${j}$. Inserido na cabeça da lista $T[${j}]$ em $O(1)$. Total $n = ${n}$, $\\alpha = ${(n / M).toFixed(2)}$.`;
        } else {
          const seq = [];
          let inserted = false;
          for (let i = 0; i < M; i++) {
            const j = probeIndex(mode, k, i);
            seq.push(`${j}`);
            highlightedSlots.push(j);
            if (hashTable[j] === null || hashTable[j] === "DELETED") {
              hashTable[j] = k;
              inserted = true;
              const n = hashTable.filter((v) => v !== null && v !== "DELETED").length;
              lastHashLog = `<strong>HASH-INSERT(T, ${k}):</strong> Sequência sondada $\\langle ${seq.join(", ")} \\rangle$ (${i + 1} sondage${i === 0 ? "m" : "ns"}). Armazenado em $T[${j}] = ${k}$. Fator de carga $\\alpha = ${n}/11 = ${(n / M).toFixed(2)}$.`;
              break;
            }
          }
          if (!inserted) {
            lastHashLog = `<strong>ERRO (Overflow):</strong> Todas as $m = 11$ posições foram sondadas ($\\langle ${seq.join(", ")} \\rangle$) e a tabela está cheia!`;
          }
        }
        renderMod7Hash();
      };

      window.searchMod7HashKey = function () {
        const modeSel = document.getElementById("mod7-hash-mode");
        const mode = modeSel ? modeSel.value : "linear";
        const inp = document.getElementById("mod7-hash-key");
        const k = parseInt(inp ? inp.value : "10", 10);
        if (isNaN(k)) return;

        highlightedSlots = [];
        if (mode === "chaining") {
          const j = ((k % M) + M) % M;
          highlightedSlots = [j];
          const idx = hashChains[j].indexOf(k);
          if (idx !== -1) {
            lastHashLog = `<strong>CHAINED-HASH-SEARCH(T, ${k}):</strong> Encontrado na lista $T[${j}]$ após examinar ${idx + 1} nó(s)!`;
          } else {
            lastHashLog = `<strong>CHAINED-HASH-SEARCH(T, ${k}):</strong> Busca sem sucesso na lista $T[${j}]$ (percorridos todos os ${hashChains[j].length} nós até NIL).`;
          }
        } else {
          const seq = [];
          let found = -1;
          for (let i = 0; i < M; i++) {
            const j = probeIndex(mode, k, i);
            seq.push(j);
            highlightedSlots.push(j);
            if (hashTable[j] === k) {
              found = j;
              lastHashLog = `<strong>HASH-SEARCH(T, ${k}):</strong> Sucesso! Encontrado em $T[${j}]$ após ${i + 1} sondage${i === 0 ? "m" : "ns"} ($\\langle ${seq.join(", ")} \\rangle$). Note que marcadores <code>DELETED</code> não interrompem a busca.`;
              break;
            }
            if (hashTable[j] === null) {
              lastHashLog = `<strong>HASH-SEARCH(T, ${k}):</strong> Busca mal sucedida! Encontrou <code>NIL</code> em $T[${j}]$ na sondagem $i = ${i}$ ($\\langle ${seq.join(", ")} \\rangle$). Retornou <code>NIL</code>.`;
              break;
            }
          }
          if (found === -1 && seq.length === M && hashTable[seq[M - 1]] !== null) {
            lastHashLog = `<strong>HASH-SEARCH(T, ${k}):</strong> Busca mal sucedida após examinar todas as $m = 11$ posições ($\\langle ${seq.join(", ")} \\rangle$).`;
          }
        }
        renderMod7Hash();
      };

      window.deleteMod7HashKey = function () {
        const modeSel = document.getElementById("mod7-hash-mode");
        const mode = modeSel ? modeSel.value : "linear";
        const inp = document.getElementById("mod7-hash-key");
        const k = parseInt(inp ? inp.value : "10", 10);
        if (isNaN(k)) return;

        highlightedSlots = [];
        if (mode === "chaining") {
          const j = ((k % M) + M) % M;
          highlightedSlots = [j];
          const idx = hashChains[j].indexOf(k);
          if (idx !== -1) {
            hashChains[j].splice(idx, 1);
            lastHashLog = `<strong>CHAINED-HASH-DELETE(T, ${k}):</strong> Nó removido da lista duplamente ligada $T[${j}]$ sem precisar de marcador DELETED.`;
          } else {
            lastHashLog = `<strong>CHAINED-HASH-DELETE:</strong> Chave ${k} não encontrada em $T[${j}]$.`;
          }
        } else {
          let removed = false;
          for (let i = 0; i < M; i++) {
            const j = probeIndex(mode, k, i);
            highlightedSlots.push(j);
            if (hashTable[j] === k) {
              hashTable[j] = "DELETED";
              removed = true;
              lastHashLog = `<strong>HASH-DELETE(T, ${k}):</strong> Chave removida de $T[${j}]$ e substituída pelo marcador especial <strong><code>DELETED</code></strong> (Ex. 11.4-2) para não quebrar buscas de chaves inseridas posteriormente na mesma trilha de sondagem!`;
              break;
            }
            if (hashTable[j] === null) break;
          }
          if (!removed) {
            lastHashLog = `<strong>HASH-DELETE:</strong> Chave ${k} não está presente na tabela.`;
          }
        }
        renderMod7Hash();
      };

      window.loadCanonicalEx1141 = function () {
        window.resetMod7HashTable();
        const canonicalKeys = [10, 22, 31, 4, 15, 28, 17, 88, 59];
        canonicalKeys.forEach((k) => window.insertMod7HashKey(k));
        lastHashLog = `<strong>Sequência Canônica do Exercício 11.4-1 Carregada ($\\langle 10, 22, 31, 4, 15, 28, 17, 88, 59 \\rangle$ em $m = 11$):</strong> Compare o estado final da tabela alternando o seletor de modo acima!`;
        renderMod7Hash();
      };

      function renderMod7Hash() {
        const stage = document.getElementById("mod7-hash-stage");
        if (!stage) return;
        const modeSel = document.getElementById("mod7-hash-mode");
        const mode = modeSel ? modeSel.value : "linear";

        let gridHtml = "";
        if (mode === "chaining") {
          gridHtml = hashChains
            .map((chain, j) => {
              const isHi = highlightedSlots.includes(j);
              const border = isHi ? "2px solid var(--accent-amber)" : "2px solid var(--ink-primary)";
              const nodes = chain.length
                ? chain
                    .map(
                      (val) =>
                        `<span style="padding:0.2rem 0.45rem;background:rgba(16,185,129,0.2);border:1px solid var(--ink-primary);font-weight:700;">${val}</span>`
                    )
                    .join(" ⇄ ") + " → NIL"
                : "<span style='color:var(--ink-muted);'>NIL</span>";
              return `
                <div style="display:flex;align-items:center;gap:0.6rem;padding:0.35rem 0.6rem;border:${border};background:var(--bg-card);font-family:var(--font-mono);font-size:0.82rem;">
                  <strong style="min-width:48px;">T[${j}]:</strong>
                  <div>${nodes}</div>
                </div>
              `;
            })
            .join("");
          gridHtml = `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:0.45rem;margin-bottom:0.9rem;">${gridHtml}</div>`;
        } else {
          const cells = hashTable
            .map((val, j) => {
              const stepIdx = highlightedSlots.indexOf(j);
              let bg = "var(--bg-card)";
              let label = "NIL";
              if (val === "DELETED") {
                bg = "rgba(239, 68, 68, 0.20)";
                label = "DELETED";
              } else if (val !== null) {
                bg = "rgba(16, 185, 129, 0.20)";
                label = `${val}`;
              }
              if (stepIdx !== -1) {
                bg = "rgba(245, 158, 11, 0.28)";
              }
              return `
                <div style="min-width:74px;text-align:center;padding:0.5rem 0.35rem;background:${bg};border:2px solid var(--ink-primary);font-family:var(--font-mono);">
                  <div style="font-size:0.68rem;color:var(--ink-muted);">T[${j}]</div>
                  <div style="font-size:1.02rem;font-weight:800;margin:0.2rem 0;">${label}</div>
                  <div style="font-size:0.65rem;color:var(--ink-secondary);min-height:0.95rem;">
                    ${stepIdx !== -1 ? `sond. #${stepIdx}` : "&nbsp;"}
                  </div>
                </div>
              `;
            })
            .join("");
          gridHtml = `<div style="display:flex;gap:0.45rem;flex-wrap:wrap;margin-bottom:0.9rem;">${cells}</div>`;
        }

        stage.innerHTML = `
          ${gridHtml}
          <div class="canonical-callout note" style="margin:0;">
            <p style="margin:0;font-size:0.88rem;">${lastHashLog}</p>
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

      /* Lógica do Simulador 2: Lista Circular com Sentinela L.nil e Lista Livre */
      const CAP = 8; // índice 0 = L.nil, índices 1..7 = objetos
      let arrKey = [];
      let arrNext = [];
      let arrPrev = [];
      let activeSet = new Set();
      let freeHead = -1;
      let listLog = "";

      window.resetMod7SentinelList = function () {
        arrKey = ["L.nil", 4, 1, 9, null, 16, null, null];
        // Ordem lógica da lista: L.nil(0) <-> 9(3) <-> 16(5) <-> 4(1) <-> 1(2) <-> L.nil(0)
        arrNext = [3, 2, 0, 5, 6, 1, 7, -1];
        arrPrev = [2, 5, 1, 0, -1, 3, -1, -1];
        activeSet = new Set([0, 3, 5, 1, 2]);
        freeHead = 4; // pilha livre: 4 -> 6 -> 7 -> NIL(-1)
        listLog =
          "Estado inicial carregado: A sentinela reside no índice <code>0 (L.nil)</code>. A lista circular ativa percorre $0 \\leftrightarrow 3(\\text{chave } 9) \\leftrightarrow 5(\\text{chave } 16) \\leftrightarrow 1(\\text{chave } 4) \\leftrightarrow 2(\\text{chave } 1) \\leftrightarrow 0$, e a lista livre é encabeçada por <code>livre = 4</code> ($4 \\to 6 \\to 7 \\to \\text{NIL}$).";
        renderMod7List();
      };

      window.insertMod7SentinelList = function () {
        const inp = document.getElementById("mod7-list-key");
        const k = parseInt(inp ? inp.value : "25", 10);
        if (isNaN(k)) return;
        if (freeHead === -1) {
          listLog = `<strong>ERRO em ALLOCATE-OBJECT():</strong> <code>livre == NIL</code> (sem espaço livre nos arranjos)! Remova um elemento antes de inserir.`;
          renderMod7List();
          return;
        }
        // ALLOCATE-OBJECT()
        const x = freeHead;
        freeHead = arrNext[x];
        arrKey[x] = k;
        // LIST-INSERT'(L, x) onde L.nil = 0
        const oldFirst = arrNext[0];
        arrNext[x] = oldFirst;
        arrPrev[oldFirst] = x;
        arrNext[0] = x;
        arrPrev[x] = 0;
        activeSet.add(x);
        listLog = `<strong>ALLOCATE-OBJECT() + LIST-INSERT'(L, x):</strong> Alocado o índice $x = ${x}$ do topo da lista livre (novo <code>livre = ${freeHead === -1 ? "NIL" : freeHead}</code>) e inserida a chave $${k}$ entre <code>L.nil (0)</code> e o antigo início (${oldFirst}) sem nenhum comando <code>if</code>!`;
        renderMod7List();
      };

      window.deleteMod7SentinelList = function () {
        const inp = document.getElementById("mod7-list-key");
        const k = parseInt(inp ? inp.value : "25", 10);
        if (isNaN(k)) return;
        // LIST-SEARCH'(L, k) com técnica do Ex. 10.2-4
        let x = arrNext[0];
        while (x !== 0 && arrKey[x] !== k) {
          x = arrNext[x];
        }
        if (x === 0) {
          listLog = `<strong>LIST-SEARCH'(L, ${k}):</strong> Busca retornou a sentinela <code>L.nil (0)</code> — a chave $${k}$ não pertence à lista!`;
          renderMod7List();
          return;
        }
        // LIST-DELETE'(x) em 2 linhas
        const p = arrPrev[x];
        const n = arrNext[x];
        arrNext[p] = n;
        arrPrev[n] = p;
        activeSet.delete(x);
        // FREE-OBJECT(x)
        arrNext[x] = freeHead;
        freeHead = x;
        listLog = `<strong>LIST-DELETE'(${x}) + FREE-OBJECT(${x}):</strong> O nó $x = ${x}$ (chave $${k}$) foi desligado em 2 atribuições (<code>anterior[${x}].proximo = ${n}</code>, <code>proximo[${x}].anterior = ${p}</code>) e empilhado no topo da lista livre (<code>livre = ${x}</code>)!`;
        renderMod7List();
      };

      function renderMod7List() {
        const stage = document.getElementById("mod7-list-stage");
        if (!stage) return;

        // Reconstruir ordem da lista circular a partir de 0
        const order = [];
        let cur = arrNext[0];
        let guard = 0;
        while (cur !== 0 && guard < CAP) {
          order.push(`${arrKey[cur]} [índice ${cur}]`);
          cur = arrNext[cur];
          guard++;
        }

        // Reconstruir pilha livre
        const freeOrder = [];
        let f = freeHead;
        guard = 0;
        while (f !== -1 && guard < CAP) {
          freeOrder.push(f);
          f = arrNext[f];
          guard++;
        }

        const cols = Array.from({ length: CAP }, (_, idx) => {
          const isSentinel = idx === 0;
          const isActive = activeSet.has(idx) && !isSentinel;
          let bg = "var(--bg-card)";
          let badge = "LIVRE";
          if (isSentinel) {
            bg = "var(--accent-amber)";
            badge = "SENTINELA";
          } else if (isActive) {
            bg = "rgba(16, 185, 129, 0.20)";
            badge = "ATIVO EM L";
          }
          return `
            <div style="min-width:86px;text-align:center;padding:0.45rem 0.35rem;background:${bg};border:2px solid var(--ink-primary);font-family:var(--font-mono);font-size:0.76rem;">
              <div style="font-weight:800;border-bottom:1px solid var(--ink-primary);padding-bottom:0.2rem;margin-bottom:0.25rem;">Índice ${idx}</div>
              <div style="font-size:0.65rem;font-weight:700;margin-bottom:0.25rem;">${badge}</div>
              <div>chave: <strong>${arrKey[idx] !== null ? arrKey[idx] : "—"}</strong></div>
              <div>prox: <strong>${arrNext[idx] === -1 ? "NIL" : arrNext[idx]}</strong></div>
              <div>ant: <strong>${isActive || isSentinel ? arrPrev[idx] : "—"}</strong></div>
            </div>
          `;
        }).join("");

        stage.innerHTML = `
          <div style="margin-bottom:0.65rem;font-family:var(--font-mono);font-size:0.78rem;">
            <div><strong>Anel Circular L:</strong> <code>L.nil [0]</code> ⇄ ${order.length ? order.join(" ⇄ ") + " ⇄ " : ""}<code>L.nil [0]</code></div>
            <div style="margin-top:0.25rem;"><strong>Pilha da Lista Livre (livre = ${freeHead === -1 ? "NIL" : freeHead}):</strong> ${freeOrder.length ? freeOrder.join(" → ") + " → NIL" : "NIL (esgotada)"}</div>
          </div>
          <div style="display:flex;gap:0.45rem;flex-wrap:wrap;margin-bottom:0.9rem;">
            ${cols}
          </div>
          <div class="canonical-callout note" style="margin:0;">
            <p style="margin:0;font-size:0.88rem;">${listLog}</p>
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

      window.switchMod7WorkbenchTab = function (tab) {
        const pHash = document.getElementById("mod7-panel-hash");
        const pList = document.getElementById("mod7-panel-list");
        const bHash = document.getElementById("mod7-tab-hash");
        const bList = document.getElementById("mod7-tab-list");
        if (!pHash || !pList || !bHash || !bList) return;
        if (tab === "hash") {
          pHash.style.display = "block";
          pList.style.display = "none";
          bHash.className = "btn-primary-brutal";
          bList.className = "btn-secondary-brutal";
        } else {
          pHash.style.display = "none";
          pList.style.display = "block";
          bHash.className = "btn-secondary-brutal";
          bList.className = "btn-primary-brutal";
        }
      };

      window.resetMod7HashTable();
      window.resetMod7SentinelList();
    },

    /* ======================================================================
       SEÇÃO 3: QUIZZES COM GABARITO COMENTADO (10 QUESTÕES — CAPS. 10 E 11)
       ====================================================================== */
    quizzes: [
      {
        id: "q7-1",
        type: "Múltipla Escolha",
        reference: "Cap. 10, Seção 10.1 e Exercício 10.1-2 (pp. 200–203) — Pilhas e Filas em Arranjos",
        question:
          "Sobre a implementação de pilhas (LIFO) e filas circulares (FIFO) em arranjos 1-indexados na Seção 10.1 e no Exercício 10.1-2, assinale a alternativa CORRETA:",
        options: [
          {
            letter: "A",
            text: "Para implementar duas pilhas em um único arranjo A[1 .. n] sem que nenhuma sofra estouro a menos que a soma total de elementos nas duas pilhas atinja n (Ex. 10.1-2), fazemos a Pilha 1 crescer da extremidade esquerda para a direita (iniciando em topo₁ = 0) e a Pilha 2 crescer da extremidade direita para a esquerda (iniciando em topo₂ = n + 1), ocorrendo estouro somente quando topo₁ + 1 == topo₂.",
            isCorrect: true,
            explanation:
              "Correta! Fazendo as duas pilhas crescerem em sentidos opostos a partir das extremidades A[1] e A[n], toda posição livre de A[1 .. n] pode ser utilizada por qualquer uma das pilhas em O(1), e o estouro ocorre se e somente se topo₁ + 1 == topo₂ (quando as duas somam exatamente n elementos)."
          },
          {
            letter: "B",
            text: "Para implementar duas pilhas em A[1 .. n], basta dividir o arranjo fixamente ao meio (A[1 .. ⌊n/2⌋] e A[⌊n/2⌋ + 1 .. n]), o que impede estouro enquanto o total de elementos for menor que n.",
            isCorrect: false,
            explanation:
              "Incorreta. Dividir o arranjo fixamente ao meio faz com que a Pilha 1 sofra estouro assim que tiver ⌊n/2⌋ + 1 elementos, mesmo que a Pilha 2 esteja completamente vazia!"
          },
          {
            letter: "C",
            text: "Quando a operação POP(S) é executada em uma pilha S[1 .. n], ela apaga fisicamente o valor de S[S.topo] gravando 0 na memória antes de decrementar S.topo.",
            isCorrect: false,
            explanation:
              "Incorreta. Como mostra a Figura 10.1(c) (p. 200), POP(S) apenas decrementa S.topo e retorna S[S.topo + 1]; o valor antigo permanece na memória mas deixa de pertencer à pilha."
          },
          {
            letter: "D",
            text: "Na implementação circular de fila da Seção 10.1, Q.fim aponta sempre para o último elemento já inserido, e a fila está vazia quando Q.inicio == Q.fim + 1.",
            isCorrect: false,
            explanation:
              "Incorreta. Na Seção 10.1, Q.fim indexa a PRÓXIMA posição onde um elemento recém-chegado será inserido; a fila está vazia quando Q.inicio == Q.fim e cheia quando Q.inicio == Q.fim + 1 (ou Q.inicio == 1 e Q.fim == Q.comprimento)."
          }
        ]
      },
      {
        id: "q7-2",
        type: "Múltipla Escolha",
        reference: "Cap. 10, Seção 10.2 e Exercício 10.2-4 (pp. 205–207) — Listas Circulares com Sentinela L.nil",
        question:
          "Considere uma lista duplamente ligada circular com objeto sentinela L.nil (Seção 10.2). Qual das afirmações a seguir descreve corretamente o papel de L.nil e a otimização de LIST-SEARCH'(L, k) do Exercício 10.2-4?",
        options: [
          {
            letter: "A",
            text: "A sentinela L.nil reduz a complexidade assintótica de LIST-SEARCH'(L, k) de Θ(n) para O(lg n) ao permitir saltos binários pelos ponteiros.",
            isCorrect: false,
            explanation:
              "Incorreta. Como frisam os autores na página 207, sentinelas raramente reduzem os limites assintóticos de tempo; a busca em lista ligada permanece Θ(n) no pior caso."
          },
          {
            letter: "B",
            text: "Em uma lista vazia com sentinela, L.nil.proximo e L.nil.anterior valem NIL, exigindo um teste if L.nil.proximo == NIL dentro de LIST-DELETE'(x).",
            isCorrect: false,
            explanation:
              "Incorreta. Na lista vazia com sentinela (Figura 10.4(a)), tanto L.nil.proximo quanto L.nil.anterior apontam para o próprio L.nil, e LIST-DELETE'(x) não possui nenhum comando if."
          },
          {
            letter: "C",
            text: "L.nil.proximo aponta para o início da lista e L.nil.anterior aponta para o fim; LIST-DELETE'(x) reduz-se a duas linhas sem desvios condicionais; e atribuir L.nil.chave = k antes do laço while em LIST-SEARCH'(L, k) permite eliminar o teste x ≠ L.nil de cada iteração.",
            isCorrect: true,
            explanation:
              "Correta! Ao armazenar a chave buscada k na própria sentinela (L.nil.chave = k), garantimos que o laço while x.chave ≠ k sempre terminará (no máximo ao atingir L.nil), poupando uma comparação por iteração."
          },
          {
            letter: "D",
            text: "É sempre vantajoso alocar um objeto sentinela dedicado para cada lista ligada do sistema, mesmo quando existem milhões de listas muito curtas ou vazias.",
            isCorrect: false,
            explanation:
              "Incorreta. Na página 207, os autores advertem explicitamente que quando há muitas listas pequenas, a memória extra ocupada por suas sentinelas representa um desperdício significativo."
          }
        ]
      },
      {
        id: "q7-3",
        type: "Verdadeiro ou Falso",
        reference: "Cap. 10, Seções 10.3 e 10.4 (pp. 210–215) — Lista Livre e Representação de Árvores",
        question:
          "[ VERDADEIRO OU FALSO ] Na Seção 10.3, a lista livre gerenciada por ALLOCATE-OBJECT() e FREE-OBJECT(x) opera como uma pilha (LIFO) em tempo O(1) utilizando apenas o arranjo 'proximo'; e na Seção 10.4, a representação 'filho da esquerda, irmão da direita' permite representar qualquer árvore enraizada de n nós com grau de ramificação arbitrário (ilimitado) usando apenas O(n) espaço.",
        options: [
          {
            letter: "V",
            text: "Verdadeiro — ALLOCATE-OBJECT desempilha o objeto apontado por 'livre' e FREE-OBJECT empilha o objeto liberado em O(1) sem precisar alterar 'anterior'; já na representação filho-esquerdo/irmão-direito, cada nó usa apenas três ponteiros fixos (p, filho-esquerdo e irmao-direito), totalizando Θ(n) memória para n nós.",
            isCorrect: true,
            explanation:
              "Correta! Ambas as propriedades são fundamentais nas Seções 10.3 (pp. 210–211) e 10.4 (pp. 213–214)."
          },
          {
            letter: "F",
            text: "Falso — A representação filho-esquerdo/irmão-direito funciona apenas para árvores estritamente binárias onde cada nó tem no máximo 2 filhos.",
            isCorrect: false,
            explanation:
              "Incorreta. Ela foi projetada justamente para árvores com número arbitrário/ilimitado de filhos por nó, encadeando todos os filhos de um mesmo pai através dos ponteiros irmao-direito."
          }
        ]
      },
      {
        id: "q7-4",
        type: "Múltipla Escolha",
        reference: "Cap. 11, Seção 11.2 (pp. 220–223) — Hashing com Encadeamento e Teoremas 11.1 e 11.2",
        question:
          "Em uma tabela de espalhamento T[0 .. m - 1] com n elementos e resolução de colisões por encadeamento (listas duplamente ligadas), seja α = n/m o fator de carga. Sob a hipótese de hashing uniforme simples (SUHA), assinale a alternativa CORRETA:",
        options: [
          {
            letter: "A",
            text: "O fator de carga α = n/m nunca pode exceder 1; se n > m, a tabela sofre um erro fatal de estouro.",
            isCorrect: false,
            explanation:
              "Incorreta. No encadeamento (ao contrário do endereçamento aberto), α = n/m pode ser menor, igual ou maior que 1, pois os elementos são alocados em nós de listas ligadas."
          },
          {
            letter: "B",
            text: "Em uma busca mal sucedida, o número esperado de chaves examinadas na lista T[h(k)] é exatamente α; em uma busca bem-sucedida, o número esperado de elementos examinados é 1 + α/2 - α/(2n); portanto, ambos os casos executam em tempo médio Θ(1 + α).",
            isCorrect: true,
            explanation:
              "Correta! Esta é a síntese exata dos Teoremas 11.1 e 11.2 (pp. 222–223). Quando n = O(m), temos α = O(1) e portanto a busca leva tempo médio O(1)."
          },
          {
            letter: "C",
            text: "Se trocarmos as listas duplamente ligadas por listas simplesmente ligadas, a operação CHAINED-HASH-DELETE(T, x) (que recebe o ponteiro x) continuará executando em tempo O(1) no pior caso.",
            isCorrect: false,
            explanation:
              "Incorreta! Como destacam os autores na página 221, com listas simplesmente ligadas, mesmo recebendo o ponteiro x, precisaríamos percorrer a lista T[h(x.chave)] para encontrar o predecessor de x, degradando a eliminação de O(1) para Θ(1 + α) em média e Θ(n) no pior caso."
          },
          {
            letter: "D",
            text: "Manter cada lista encadeada ordenada por chave (Exercício 11.2-3) reduz o tempo assintótico esperado de inserção de O(1) para O(lg α).",
            isCorrect: false,
            explanation:
              "Incorreta. Em uma lista ligada ordenada não é possível fazer busca binária; inserir em ordem exige percorrer a lista em Θ(1 + α) (piorando a inserção, que era O(1) ao inserir na cabeça!), embora reduza pela metade o número médio de comparações na busca mal sucedida."
          }
        ]
      },
      {
        id: "q7-5",
        type: "Múltipla Escolha",
        reference: "Cap. 11, Seções 11.3.1 e 11.3.2 (pp. 225–227) — Métodos da Divisão e da Multiplicação",
        question:
          "Sobre o projeto de funções hash pelos métodos da divisão (h(k) = k mod m) e da multiplicação (h(k) = ⌊m(kA mod 1)⌋), assinale a alternativa CORRETA:",
        options: [
          {
            letter: "A",
            text: "No método da divisão, m = 2^p é a escolha ideal porque utiliza todos os bits da chave k igualmente.",
            isCorrect: false,
            explanation:
              "Incorreta! Se m = 2^p no método da divisão, k mod 2^p depende exclusivamente dos p bits menos significativos de k, descartando todos os demais bits."
          },
          {
            letter: "B",
            text: "No método da divisão, devemos preferir um número primo m não muito próximo de uma potência exata de 2; já no método da multiplicação, o valor de m não é crítico e escolhemos tipicamente m = 2^p, extraindo como valor hash os p bits mais significativos da metade inferior de w bits (r₀) do produto k · s (onde s = ⌊A · 2^w⌋ e A ≈ (√5 - 1)/2).",
            isCorrect: true,
            explanation:
              "Correta! Esta é a descrição exata das Seções 11.3.1 e 11.3.2 e da Figura 11.4 (pp. 225–227)."
          },
          {
            letter: "C",
            text: "No método da multiplicação, a constante A deve ser um número inteiro maior que m.",
            isCorrect: false,
            explanation:
              "Incorreta. A constante A deve pertencer estritamente ao intervalo aberto 0 < A < 1."
          },
          {
            letter: "D",
            text: "No método da divisão, escolher m = 2^p - 1 quando as chaves são cadeias de caracteres interpretadas na base 2^p garante que duas palavras que são anagramas nunca colidam.",
            isCorrect: false,
            explanation:
              "Incorreta! Pelo Exercício 11.3-3, quando m = 2^p - 1 e a base é 2^p, permutar os caracteres de uma cadeia preserva exatamente o valor de k mod (2^p - 1), fazendo com que TODOS os anagramas colidam na mesma posição!"
          }
        ]
      },
      {
        id: "q7-6",
        type: "Múltipla Escolha",
        reference: "Cap. 11, Seção 11.3.3 (pp. 227–231) — Hashing Universal e Família H_{pm}",
        question:
          "Considere uma coleção finita H de funções hash que mapeiam U para {0, 1, ..., m - 1} e a família algébrica H_{pm} = {h_{ab} : a ∈ Z_p* e b ∈ Z_p} onde h_{ab}(k) = ((ak + b) mod p) mod m (com p primo e p > m). Assinale a alternativa CORRETA:",
        options: [
          {
            letter: "A",
            text: "A família H é dita universal se, para todo par de chaves distintas k, l ∈ U, existem no máximo |H|/m funções h ∈ H tais que h(k) = h(l); e a família H_{pm} possui exatamente p(p - 1) funções e é universal mesmo quando o tamanho m da tabela não é primo.",
            isCorrect: true,
            explanation:
              "Correta! Pela definição da página 228 e pelo Teorema 11.5 (p. 230), |H_{pm}| = (p - 1)p, Pr{h_{ab}(k) = h_{ab}(l)} ≤ 1/m para quaisquer k ≠ l, e m pode ser qualquer inteiro arbitrário menor que p (propriedade crucial para usar m_j = n_j² no Hashing Perfeito!)."
          },
          {
            letter: "B",
            text: "Se permitirmos a = 0 na definição de H_{pm}, todas as funções resultantes h_{0,b}(k) continuam não tendo colisões para chaves distintas.",
            isCorrect: false,
            explanation:
              "Incorreta! Se a = 0, então h_{0,b}(k) = (b mod p) mod m é uma função constante que mapeia TODAS as chaves do universo para a mesma posição, gerando 100% de colisão!"
          },
          {
            letter: "C",
            text: "No Teorema 11.5, duas chaves distintas k ≠ l já podem colidir antes da redução módulo m, isto é, (ak + b) mod p pode ser igual a (al + b) mod p para a ∈ Z_p*.",
            isCorrect: false,
            explanation:
              "Incorreta. Como p é primo e a ∈ {1, ..., p - 1} e k ≠ l (mod p), o produto a(k - l) nunca é zero módulo p; logo r = (ak + b) mod p e s = (al + b) mod p são SEMPRE distintos (nenhuma colisão ocorre no nível mod p)."
          },
          {
            letter: "D",
            text: "O hashing universal só garante tempo esperado O(1 + α) se as chaves de entrada forem geradas aleatoriamente por uma distribuição uniforme.",
            isCorrect: false,
            explanation:
              "Incorreta! No hashing universal, a aleatoriedade está na escolha da função hash h ∈ H em tempo de execução, garantindo tempo esperado O(1 + α) para QUALQUER entrada, mesmo que escolhida por um adversário malicioso."
          }
        ]
      },
      {
        id: "q7-7",
        type: "Múltipla Escolha",
        reference: "Cap. 11, Seção 11.4 (pp. 236–238) — Sondagem Linear, Quadrática e Hash Duplo",
        question:
          "Compare as três técnicas de endereçamento aberto (Sondagem Linear, Sondagem Quadrática e Hash Duplo) em uma tabela de tamanho m:",
        options: [
          {
            letter: "A",
            text: "A sondagem linear e a sondagem quadrática geram Θ(m²) sequências de sondagem distintas, enquanto o hash duplo gera apenas m sequências.",
            isCorrect: false,
            explanation:
              "Incorreta! Na sondagem linear e na quadrática, a posição inicial h'(k) determina inteiramente toda a sequência, gerando apenas m sequências distintas; já o hash duplo varia o par (h₁(k), h₂(k)), gerando Θ(m²) sequências distintas."
          },
          {
            letter: "B",
            text: "A sondagem linear sofre de agrupamento primário (longos blocos contíguos ocupados tendem a crescer porque uma posição vazia precedida por i posições ocupadas é preenchida com probabilidade (i + 1)/m); a sondagem quadrática evita o agrupamento primário mas sofre de agrupamento secundário; e o hash duplo exige que h₂(k) seja relativamente primo a m (mdc(h₂(k), m) = 1) para examinar toda a tabela.",
            isCorrect: true,
            explanation:
              "Correta! Esta é a análise comparativa exata das páginas 236–238 e do Exercício 11.4-4."
          },
          {
            letter: "C",
            text: "Na sondagem quadrática, duas chaves com o mesmo valor inicial h'(k₁) = h'(k₂) seguem sequências de sondagem diferentes porque o termo c₂ i² depende de k.",
            isCorrect: false,
            explanation:
              "Incorreta. Como c₁ e c₂ são constantes fixas independentes de k, h'(k₁) = h'(k₂) implica h(k₁, i) = h(k₂, i) para todo i — exatamente a causa do agrupamento secundário."
          },
          {
            letter: "D",
            text: "No hash duplo, se m = 12 e h₂(k) = 4 para alguma chave k, a sequência de sondagem visitará todas as 12 posições da tabela antes de se repetir.",
            isCorrect: false,
            explanation:
              "Incorreta! Pelo Exercício 11.4-4, como d = mdc(12, 4) = 4, a sequência de sondagem visitará apenas m/d = 12/4 = 3 posições da tabela (1/4 da tabela) antes de entrar em ciclo!"
          }
        ]
      },
      {
        id: "q7-8",
        type: "Verdadeiro ou Falso",
        reference: "Cap. 11, Seção 11.4 (p. 235) e Exercício 11.4-2 — Remoção com Marcador DELETED",
        question:
          "[ VERDADEIRO OU FALSO ] Em uma tabela de espalhamento com endereçamento aberto, ao remover uma chave da posição j usando o marcador especial DELETED, o procedimento HASH-SEARCH(T, k) não precisa ser modificado (pois trata DELETED como uma posição ocupada e continua sondando até encontrar k ou NIL), enquanto HASH-INSERT(T, k) deve ser modificado para permitir inserir a nova chave na primeira posição encontrada que contenha NIL ou DELETED.",
        options: [
          {
            letter: "V",
            text: "Verdadeiro — Se gravássemos NIL ao remover, buscas posteriores por chaves cuja trilha de sondagem passou por j parariam prematuramente; com DELETED, HASH-SEARCH passa por cima de DELETED e HASH-INSERT reutiliza as posições marcadas com DELETED.",
            isCorrect: true,
            explanation:
              "Correta! Como explicado na página 235 e formalizado no Exercício 11.4-2."
          },
          {
            letter: "F",
            text: "Falso — HASH-SEARCH deve parar imediatamente e retornar NIL assim que encontrar o marcador DELETED.",
            isCorrect: false,
            explanation:
              "Incorreta. Se HASH-SEARCH parasse em DELETED, ele teria exatamente o mesmo defeito de gravar NIL na remoção e perderia chaves válidas localizadas mais adiante na sequência de sondagem."
          }
        ]
      },
      {
        id: "q7-9",
        type: "Múltipla Escolha",
        reference: "Cap. 11, Seção 11.4, Teoremas 11.6 e 11.8 e Exercício 11.4-3 (pp. 239–241)",
        question:
          "Considere uma tabela de espalhamento de endereço aberto sob hashing uniforme com fator de carga α = 3/4 = 0,75 (Exercício 11.4-3). Pelos Teoremas 11.6 e 11.8, quais são os limites superiores para o número esperado de sondagens em uma busca mal sucedida e em uma busca bem-sucedida, respectivamente?",
        options: [
          {
            letter: "A",
            text: "Busca mal sucedida: no máximo 1/(1 - 3/4) = 4 sondagens; Busca bem-sucedida: no máximo (1 / (3/4)) ln(1 / (1 - 3/4)) = (4/3) ln 4 ≈ 1,848 sondagens.",
            isCorrect: true,
            explanation:
              "Correta! Substituindo α = 3/4 no Teorema 11.6 obtemos 1/(1 - 3/4) = 1/(1/4) = 4 sondagens; e substituindo α = 3/4 no Teorema 11.8 obtemos (4/3) ln 4 ≈ 1,333 × 1,3863 ≈ 1,848 sondagens."
          },
          {
            letter: "B",
            text: "Busca mal sucedida: no máximo 1 + 3/4 = 1,75 sondagens; Busca bem-sucedida: no máximo 1 + 3/8 = 1,375 sondagens.",
            isCorrect: false,
            explanation:
              "Incorreta. As fórmulas 1 + α e 1 + α/2 referem-se ao hashing com encadeamento (Teoremas 11.1 e 11.2), e não ao endereçamento aberto!"
          },
          {
            letter: "C",
            text: "Busca mal sucedida: no máximo (4/3) ln 4 sondagens; Busca bem-sucedida: no máximo 4 sondagens.",
            isCorrect: false,
            explanation:
              "Incorreta. A busca bem-sucedida exige sempre MENOS sondagens em média do que a busca mal sucedida, pois refaz o histórico de inserções quando a tabela estava menos cheia (0 ≤ i < n)."
          },
          {
            letter: "D",
            text: "Ambos os limites são iguais a 1 / (1 - α)² = 16 sondagens.",
            isCorrect: false,
            explanation:
              "Incorreta. A série geométrica ∑_{i=0..∞} α^i converge para 1/(1 - α) = 4, e não 1/(1 - α)²."
          }
        ]
      },
      {
        id: "q7-10",
        type: "Múltipla Escolha",
        reference: "Cap. 11, Seção 11.5, Teoremas 11.9 e 11.10 e Corolários 11.11 e 11.12 (pp. 242–245) — Hashing Perfeito",
        question:
          "Sobre o esquema de Hashing Perfeito de dois níveis (Seção 11.5) para armazenar um conjunto estático K de n chaves, assinale a alternativa CORRETA:",
        options: [
          {
            letter: "A",
            text: "O primeiro nível usa uma tabela de tamanho m = n² e o segundo nível usa listas ligadas comuns.",
            isCorrect: false,
            explanation:
              "Incorreta. O primeiro nível usa uma tabela de tamanho linear m = n, e o segundo nível usa pequenas tabelas de espalhamento S_j de tamanho quadrático m_j = n_j² (sem listas ligadas)."
          },
          {
            letter: "B",
            text: "Pelo Teorema 11.9, ao espalhar n_j chaves em uma tabela secundária S_j de tamanho m_j = n_j² usando uma função universal, o número esperado de colisões é menor que 1/2 (logo Pr{colisão} < 1/2 pela desigualdade de Markov); e pelo Teorema 11.10 / Corolário 11.11, o espaço total esperado de todas as tabelas secundárias satisfaz E[∑ m_j] = E[∑ n_j²] < 2n.",
            isCorrect: true,
            explanation:
              "Correta! Esta é a essência matemática dos Teoremas 11.9 e 11.10 e do Corolário 11.11 (pp. 243–245), garantindo zero colisões em tempo de busca de pior caso O(1) e memória linear O(n)."
          },
          {
            letter: "C",
            text: "O Hashing Perfeito da Seção 11.5 suporta inserções e remoções arbitrárias em tempo de pior caso O(1) sem nunca reconstruir as tabelas.",
            isCorrect: false,
            explanation:
              "Incorreta. O esquema de Fredman, Komlós e Szemerédi da Seção 11.5 é projetado para conjuntos de chaves ESTÁTICOS (que não mudam após armazenados na tabela)."
          },
          {
            letter: "D",
            text: "O valor esperado E[∑ n_j²] no Teorema 11.10 é Θ(n²), o que torna o Hashing Perfeito impraticável em termos de memória.",
            isCorrect: false,
            explanation:
              "Incorreta! Graças à identidade n_j² = n_j + 2 C(n_j, 2) e ao fato de que o número esperado de colisões totais no nível 1 é ≤ n(n-1)/(2n) = (n-1)/2, temos E[∑ n_j²] ≤ n + (n - 1) = 2n - 1 < 2n = O(n)!"
          }
        ]
      }
    ],

    /* ======================================================================
       SEÇÃO 4: EXERCÍCIOS E PROBLEMAS CANÔNICOS RESOLVIDOS (8 EXERCÍCIOS)
       ====================================================================== */
    exercicios: [
      {
        id: "ex7-1",
        code: "EXERCÍCIO 01 • PILHAS E FILAS: DETECÇÃO DE ERROS E SIMULAÇÃO CRUZADA",
        reference: "Exercícios 10.1-4, 10.1-6 e 10.1-7 (p. 203)",
        title: "ENQUEUE/DEQUEUE com Overflow/Underflow, Fila com Duas Pilhas e Pilha com Duas Filas",
        prompt: `
          <p>Resolva o trio clássico de exercícios de projeto da Seção 10.1:</p>
          <ol>
            <li><strong>(Exercício 10.1-4)</strong> Reescreva <code>ENQUEUE(Q, x)</code> e <code>DEQUEUE(Q)</code> para detectar explicitamente o estouro (<em>overflow</em>) e o estouro negativo (<em>underflow</em>) de uma fila circular em $Q[1 \\dots n]$.</li>
            <li><strong>(Exercício 10.1-6)</strong> Mostre como implementar uma <strong>fila usando duas pilhas</strong> $S_{\\text{entrada}}$ e $S_{\\text{saida}}$. Analise o tempo de execução de pior caso e o tempo amortizado das operações <code>ENQUEUE</code> e <code>DEQUEUE</code>.</li>
            <li><strong>(Exercício 10.1-7)</strong> Mostre como implementar uma <strong>pilha usando duas filas</strong> $Q_1$ e $Q_2$ e analise o tempo de execução de <code>PUSH</code> e <code>POP</code>.</li>
          </ol>
        `,
        placeholder:
          "Escreva a condição de fila cheia/vazia para o Ex. 10.1-4, explique a transferência preguiçosa entre S_entrada e S_saida em O(1) amortizado no Ex. 10.1-6, e a rotação de n-1 elementos no Ex. 10.1-7...",
        solution: `
          <h4>1. <code>ENQUEUE</code> e <code>DEQUEUE</code> com Detecção de Estouro e Estouro Negativo (Ex. 10.1-4)</h4>
          <p>Em um arranjo circular $Q[1 \\dots n]$ ($n = Q.\\text{comprimento}$), a fila está <strong>vazia</strong> quando $Q.\\text{inicio} == Q.\\text{fim}$ e está <strong>cheia</strong> quando avançar $Q.\\text{fim}$ em 1 posição circular atingiria $Q.\\text{inicio}$:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">ENQUEUE-SAFE(Q, x)</span> e <span class="proc-name">DEQUEUE-SAFE(Q)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">ENQUEUE-SAFE</span>(Q, x)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">if</span> Q.inicio == Q.fim + 1 <span class="kw">ou</span> (Q.inicio == 1 <span class="kw">e</span> Q.fim == Q.comprimento)</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">        <span class="kw">error</span> "overflow (estouro de fila cheia)"</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    Q[Q.fim] = x</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">if</span> Q.fim == Q.comprimento</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">        Q.fim = 1</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    <span class="kw">else</span> Q.fim = Q.fim + 1</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content"><span class="kw">DEQUEUE-SAFE</span>(Q)</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">    <span class="kw">if</span> Q.inicio == Q.fim</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">        <span class="kw">error</span> "underflow (estouro negativo de fila vazia)"</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">    x = Q[Q.inicio]</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">    <span class="kw">if</span> Q.inicio == Q.comprimento</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">        Q.inicio = 1</span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content">    <span class="kw">else</span> Q.inicio = Q.inicio + 1</span></div>
              <div class="code-line"><span class="line-num">16</span><span class="line-content">    <span class="kw">return</span> x</span></div>
            </div>
          </div>

          <h4>2. Implementação de uma Fila Usando Duas Pilhas (Ex. 10.1-6)</h4>
          <p>Mantemos duas pilhas: $S_{\\text{entrada}}$ (para receber novos elementos) e $S_{\\text{saida}}$ (para fornecer elementos na ordem FIFO):</p>
          <ul>
            <li><strong><code>ENQUEUE(Q, x)</code> — Tempo de pior caso $O(1)$:</strong> Simplesmente executa <code>PUSH(S_entrada, x)</code>.</li>
            <li><strong><code>DEQUEUE(Q)</code> — Tempo de pior caso $\\Theta(n)$, mas tempo amortizado $O(1)$:</strong>
              <ul>
                <li>Se $S_{\\text{saida}}$ <strong>não estiver vazia</strong>, basta retornar <code>POP(S_saida)</code> em $O(1)$.</li>
                <li>Se $S_{\\text{saida}}$ <strong>estiver vazia</strong> (e $S_{\\text{entrada}}$ também estiver vazia, sinalize <em>underflow</em>), desempilhamos todos os elementos de $S_{\\text{entrada}}$ um por um e os empilhamos em $S_{\\text{saida}}$ (<code>while not STACK-EMPTY(S_entrada) do PUSH(S_saida, POP(S_entrada))</code>), invertendo a ordem LIFO para FIFO, e por fim retornamos <code>POP(S_saida)</code>!</li>
              </ul>
            </li>
            <li><strong>Análise Amortizada:</strong> Cada elemento inserido na fila sofre exatamente <strong>4 operações de pilha de custo $O(1)$</strong> ao longo de toda a sua vida: um <code>PUSH</code> em $S_{\\text{entrada}}$, um <code>POP</code> de $S_{\\text{entrada}}$, um <code>PUSH</code> em $S_{\\text{saida}}$ e um <code>POP</code> de $S_{\\text{saida}}$. Logo, qualquer sequência de $m$ operações <code>ENQUEUE</code> e <code>DEQUEUE</code> leva tempo total $O(m)$, ou seja, <strong>$O(1)$ amortizado por operação</strong>!</li>
          </ul>

          <h4>3. Implementação de uma Pilha Usando Duas Filas (Ex. 10.1-7)</h4>
          <p>Mantemos uma fila ativa $Q_1$ (com os $n$ elementos atuais) e uma fila auxiliar vazia $Q_2$. Podemos escolher otimizar <code>PUSH</code> ou <code>POP</code>:</p>
          <ul>
            <li><strong>Abordagem A (<code>PUSH</code> em $O(1)$ e <code>POP</code> em $\\Theta(n)$):</strong> <code>PUSH(S, x)</code> faz apenas <code>ENQUEUE(Q_1, x)</code> em $O(1)$. Para executar <code>POP(S)</code>, desenfileiramos os $n - 1$ primeiros elementos de $Q_1$ e os enfileiramos em $Q_2$; o último elemento restante em $Q_1$ é o mais recente (topo da pilha), que desenfileiramos e retornamos, trocando em seguida os nomes de $Q_1$ e $Q_2$.</li>
            <li><strong>Abordagem B (<code>PUSH</code> em $\\Theta(n)$ e <code>POP</code> em $O(1)$):</strong> Ao inserir $x$, fazemos <code>ENQUEUE(Q_2, x)</code> na fila vazia $Q_2$ e depois transferimos todos os elementos de $Q_1$ para trás de $x$ em $Q_2$ ($\Theta(n)$), trocando os nomes de $Q_1$ e $Q_2$; assim, $Q_1$ mantém sempre os elementos em ordem LIFO pronta para <code>DEQUEUE(Q_1)</code> em $O(1)$.</li>
          </ul>
        `
      },
      {
        id: "ex7-2",
        code: "EXERCÍCIO 02 • UNIÃO DE CONJUNTOS EM O(1) E INVERSÃO DE LISTA NO LUGAR",
        reference: "Exercícios 10.2-6 e 10.2-7 (p. 207)",
        title: "Operação UNION(S₁, S₂) em Tempo O(1) com Listas Circulares e Inversão Não Recursiva em Θ(n)",
        prompt: `
          <p>Resolva os Exercícios 10.2-6 e 10.2-7 sobre manipulação de ponteiros em listas ligadas:</p>
          <ol>
            <li><strong>(Exercício 10.2-6)</strong> A operação em conjuntos dinâmicos <code>UNION(S₁, S₂)</code> recebe dois conjuntos disjuntos $S_1$ e $S_2$ e retorna $S = S_1 \\cup S_2$ (destruindo $S_1$ e $S_2$). Mostre como suportar <code>UNION</code> em <strong>tempo $O(1)$</strong> usando uma estrutura de dados de lista adequada (mantendo também <code>INSERT</code> e <code>DELETE</code> eficientes).</li>
            <li><strong>(Exercício 10.2-7)</strong> Dê um procedimento não recursivo de tempo $\\Theta(n)$ que <strong>inverta uma lista simplesmente ligada</strong> de $n$ elementos utilizando apenas espaço auxiliar constante $O(1)$ além da própria lista.</li>
          </ol>
        `,
        placeholder:
          "Mostre como emendar os anéis de duas listas duplamente ligadas circulares com sentinela em O(1), e escreva o laço de 3 ponteiros (anterior, atual, proximo) para inverter uma lista simplesmente ligada...",
        solution: `
          <h4>1. Suportando <code>UNION(S₁, S₂)</code> em Tempo $O(1)$ (Ex. 10.2-6)</h4>
          <p>Se representarmos $S_1$ e $S_2$ como <strong>listas duplamente ligadas circulares com sentinelas</strong> $S_1.\\text{nil}$ e $S_2.\\text{nil}$ (ou como listas simplesmente ligadas que mantêm tanto o ponteiro <code>inicio</code> quanto o ponteiro <code>fim</code>), podemos concatenar as duas listas em <strong>tempo estritamente constante $O(1)$</strong>!</p>
          <p>Usando listas duplamente ligadas circulares com sentinela (que também preservam <code>LIST-INSERT'</code> e <code>LIST-DELETE'</code> em $O(1)$), basta conectar o último elemento de $S_1$ ($S_1.\\text{nil}.\\text{anterior}$) ao primeiro elemento de $S_2$ ($S_2.\\text{nil}.\\text{proximo}$), e o último elemento de $S_2$ ($S_2.\\text{nil}.\\text{anterior}$) à sentinela $S_1.\\text{nil}$ (descartando a sentinela $S_2.\\text{nil}$):</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">LIST-UNION(S₁, S₂)</span> — Tempo $O(1)$</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> S₂.nil.proximo ≠ S₂.nil <span class="cmt">// Se S₂ não está vazia</span></span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    S₁.nil.anterior.proximo = S₂.nil.proximo</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    S₂.nil.proximo.anterior = S₁.nil.anterior</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    S₂.nil.anterior.proximo = S₁.nil</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    S₁.nil.anterior = S₂.nil.anterior</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">return</span> S₁</span></div>
            </div>
          </div>

          <h4>2. Inversão Não Recursiva de Lista Simplesmente Ligada em $\\Theta(n)$ e Espaço $O(1)$ (Ex. 10.2-7)</h4>
          <p>Percorremos a lista simplesmente ligada $L$ mantendo três ponteiros locais: <code>ant</code> (inicialmente <code>NIL</code>), <code>atual</code> (inicialmente <code>L.inicio</code>) e <code>prox</code> (para salvar <code>atual.proximo</code> antes de inverter a seta):</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">LIST-REVERSE(L)</span> — Tempo $\\Theta(n)$ e Espaço Auxiliar $O(1)$</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">ant = NIL</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">atual = L.inicio</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">while</span> atual ≠ NIL</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    prox = atual.proximo</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    atual.proximo = ant</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">    ant = atual</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    atual = prox</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">L.inicio = ant</span></div>
            </div>
          </div>
          <p>O laço <code>while</code> executa exatamente $n$ iterações de custo $O(1)$ cada, levando tempo $\\Theta(n)$ e usando apenas 3 variáveis de ponteiro extras ($O(1)$).</p>
        `
      },
      {
        id: "ex7-3",
        code: "EXERCÍCIO 03 • PERCURSO EM O(n) DE ÁRVORES BINÁRIAS E FILHO-ESQUERDO/IRMÃO-DIREITO",
        reference: "Exercícios 10.4-2, 10.4-3 e 10.4-4 (pp. 214–215)",
        title: "Algoritmos de Tempo O(n) para Imprimir Chaves em Árvores Binárias e Árvores de Ramificação Arbitrária",
        prompt: `
          <p>Resolva os Exercícios 10.4-2, 10.4-3 e 10.4-4 sobre percursos de árvores enraizadas:</p>
          <ol>
            <li><strong>(Exercício 10.4-2 e 10.4-3)</strong> Escreva um procedimento recursivo e um procedimento não recursivo (usando uma pilha auxiliar) de tempo $O(n)$ que, dada uma árvore binária de $n$ nós, imprimam a chave de cada nó.</li>
            <li><strong>(Exercício 10.4-4)</strong> Escreva um procedimento de tempo $O(n)$ que imprima todas as chaves de uma árvore enraizada arbitrária com $n$ nós armazenada usando a representação <strong>filho-esquerdo, irmão-direito</strong>.</li>
          </ol>
        `,
        placeholder:
          "Escreva PRINT-BINARY-TREE(x), sua versão iterativa com pilha e PRINT-LCRS-TREE(x) percorrendo filho-esquerdo e o laço de irmao-direito...",
        solution: `
          <h4>1. Percurso Recursivo e Iterativo (com Pilha) em Árvore Binária (Ex. 10.4-2 e 10.4-3)</h4>
          <p>Na versão recursiva (chamada inicialmente com <code>PRINT-BINARY-TREE(T.raiz)</code>), visitamos cada nó exatamente uma vez em $\\Theta(n)$. Na versão iterativa, empilhamos a raiz em uma pilha $S$ e, a cada passo, desempilhamos um nó $x$, imprimimos <code>x.chave</code> e empilhamos seus filhos não nulos:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">PRINT-BINARY-TREE(x)</span> e <span class="proc-name">ITERATIVE-PRINT-BINARY-TREE(T)</span> — Tempo $\\Theta(n)$</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">PRINT-BINARY-TREE</span>(x)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">if</span> x ≠ NIL</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">        imprima x.chave</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">        PRINT-BINARY-TREE(x.esquerdo)</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">        PRINT-BINARY-TREE(x.direito)</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">ITERATIVE-PRINT-BINARY-TREE</span>(T)</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">    seja S uma nova pilha vazia</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">    <span class="kw">if</span> T.raiz ≠ NIL</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">        PUSH(S, T.raiz)</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">    <span class="kw">while not</span> STACK-EMPTY(S)</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">        x = POP(S)</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">        imprima x.chave</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">        <span class="kw">if</span> x.direito ≠ NIL</span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content">            PUSH(S, x.direito)</span></div>
              <div class="code-line"><span class="line-num">16</span><span class="line-content">        <span class="kw">if</span> x.esquerdo ≠ NIL</span></div>
              <div class="code-line"><span class="line-num">17</span><span class="line-content">            PUSH(S, x.esquerdo)</span></div>
            </div>
          </div>

          <h4>2. Percurso em Árvore com Representação Filho-Esquerdo, Irmão-Direito (Ex. 10.4-4)</h4>
          <p>Como a representação filho-esquerdo, irmão-direito é estruturalmente isomorfa a uma árvore binária onde <code>x.filho-esquerdo</code> desempenha o papel de <code>x.esquerdo</code> e <code>x.irmao-direito</code> desempenha o papel de <code>x.direito</code>, podemos percorrer toda a árvore recursivamente em $\\Theta(n)$ (ou iterando sobre os irmãos):</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">PRINT-LCRS-TREE(x)</span> — Tempo $\\Theta(n)$</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> x ≠ NIL</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    imprima x.chave</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    filho = x.filho-esquerdo</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">while</span> filho ≠ NIL</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">        PRINT-LCRS-TREE(filho)</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">        filho = filho.irmao-direito</span></div>
            </div>
          </div>
          <p>Cada um dos $n$ nós da árvore tem sua chave impressa exatamente uma vez e cada ponteiro <code>filho-esquerdo</code> e <code>irmao-direito</code> é atravessado exatamente uma vez, garantindo tempo total <strong>$\\Theta(n)$</strong>.</p>
        `
      },
      {
        id: "ex7-4",
        code: "EXERCÍCIO 04 • VETOR DE BITS E DICIONÁRIO EM ARRANJO ENORME NÃO INICIALIZADO",
        reference: "Exercícios 11.1-2 e 11.1-4 (pp. 218–219)",
        title: "Conjunto Dinâmico em Vetor de Bits e Inicialização em O(1) para Arranjo Gigante com Lixo de Memória",
        prompt: `
          <p>Resolva os Exercícios 11.1-2 e 11.1-4 sobre Tabelas de Endereçamento Direto:</p>
          <ol>
            <li><strong>(Exercício 11.1-2)</strong> Descreva como usar um <strong>vetor de bits</strong> $B[0 \\dots m - 1]$ (arranjo de 0s e 1s) para representar um conjunto dinâmico de elementos distintos sem dados satélites, suportando as operações de dicionário em tempo $O(1)$.</li>
            <li><strong>(Exercício 11.1-4 ★)</strong> Desejamos implementar um dicionário por endereçamento direto em um <strong>arranjo enorme $T[0 \\dots m - 1]$</strong> cujas entradas inicialmente contêm <strong>lixo arbitrário de memória</strong>, e inicializar o arranjo inteiro é impraticável devido ao seu tamanho. Descreva um esquema em que cada objeto armazenado use espaço $O(1)$ e <strong>a inicialização da estrutura, <code>SEARCH</code>, <code>INSERT</code> e <code>DELETE</code> demorem todos tempo $O(1)$ no pior caso!</strong></li>
          </ol>
        `,
        placeholder:
          "Mostre B[k] = 1/0 para o vetor de bits, e para o Ex. 11.1-4 use uma pilha auxiliar S[1 .. n] com validação cruzada (ponteiros bidirecionais entre T[k] e S[i])...",
        solution: `
          <h4>1. Conjunto Dinâmico em Vetor de Bits $B[0 \\dots m - 1]$ (Ex. 11.1-2)</h4>
          <p>Quando não há dados satélites, a presença ou ausência de uma chave $k \\in \\{0, 1, \\dots, m - 1\\}$ no conjunto dinâmico é codificada por 1 único bit em $B[k]$:</p>
          <ul>
            <li><strong><code>BIT-VECTOR-SEARCH(B, k)</code>:</strong> Retorna <code>B[k] == 1</code> (ou retorna $k$ se $B[k] == 1$ e <code>NIL</code> se $B[k] == 0$) em $O(1)$.</li>
            <li><strong><code>BIT-VECTOR-INSERT(B, k)</code>:</strong> Atribui <code>B[k] = 1</code> em $O(1)$.</li>
            <li><strong><code>BIT-VECTOR-DELETE(B, k)</code>:</strong> Atribui <code>B[k] = 0</code> em $O(1)$.</li>
          </ul>

          <h4>2. Dicionário em Arranjo Enorme Não Inicializado em $O(1)$ (Ex. 11.1-4 — Validação Cruzada de Hopcroft-Ullman)</h4>
          <p>Como $T[0 \\dots m - 1]$ contém lixo arbitrário e não podemos gastar $\\Theta(m)$ para zerá-lo, mantemos uma <strong>pilha auxiliar $S[1 \\dots m]$</strong> cujo atributo <code>S.topo</code> (inicializado com <code>S.topo = 0</code> em <strong>tempo $O(1)$</strong>!) conta quantos elementos estão realmente armazenados no dicionário no momento.</p>
          <p>Para cada chave $k$ efetivamente inserida no dicionário, criamos um <strong>elo bidirecional verificável</strong> entre a posição $T[k]$ do arranjo enorme e uma posição $i \\in \\{1, \\dots, S.\\text{topo}\\}$ da pilha $S$:</p>
          <ul>
            <li>$T[k]$ armazena o índice $i$ ($1 \\le i \\le S.\\text{topo}$) onde a chave $k$ foi registrada na pilha $S$.</li>
            <li>$S[i]$ armazena a própria chave $k$ (e o ponteiro para seus dados satélites).</li>
          </ul>
          <p><strong>Como distinguir um índice real de um lixo de memória em $T[k]$ em $O(1)$?</strong> Uma entrada $T[k]$ é <strong>válida</strong> (isto é, $k$ pertence ao dicionário) se, e somente se, satisfizer simultaneamente as duas condições de validação cruzada:</p>
          $$1 \\le T[k] \\le S.\\text{topo} \\quad \\mathbf{\\text{e}} \\quad S[T[k]] == k!$$
          <p>(Se $T[k]$ contiver lixo que por acaso seja um inteiro $j$ entre $1$ e $S.\\text{topo}$, a posição $S[j]$ da pilha já foi escrita por nós com alguma outra chave válida $k' \\neq k$, logo $S[j] == k$ será falso!)</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">HUGE-SEARCH</span>, <span class="proc-name">HUGE-INSERT</span> e <span class="proc-name">HUGE-DELETE</span> — Todos em $O(1)$ sem Inicializar $T$</div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">HUGE-SEARCH</span>(T, S, k)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">if</span> 1 ≤ T[k] ≤ S.topo <span class="kw">e</span> S[T[k]].chave == k</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">        <span class="kw">return</span> S[T[k]]</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">else return</span> NIL</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">HUGE-INSERT</span>(T, S, x)</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    S.topo = S.topo + 1</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">    S[S.topo] = x</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">    T[x.chave] = S.topo</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content"><span class="kw">HUGE-DELETE</span>(T, S, x) <span class="cmt">// Tapa o buraco em S[i] com o elemento do topo S[S.topo]</span></span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">    i = T[x.chave]</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">    ultimo = S[S.topo]</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">    S[i] = ultimo</span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content">    T[ultimo.chave] = i</span></div>
              <div class="code-line"><span class="line-num">16</span><span class="line-content">    S.topo = S.topo - 1</span></div>
            </div>
          </div>
        `
      },
      {
        id: "ex7-5",
        code: "EXERCÍCIO 05 • COLISÕES ESPERADAS, ENCADEAMENTO E MÉTODO DA MULTIPLICAÇÃO",
        reference: "Exercícios 11.2-1, 11.2-2 e 11.3-4 (pp. 223, 231)",
        title: "Número Esperado de Colisões C(n, 2)/m, Rastreamento de Encadeamento e Cálculo com a Razão Áurea",
        prompt: `
          <p>Resolva os Exercícios 11.2-1, 11.2-2 e 11.3-4:</p>
          <ol>
            <li><strong>(Exercício 11.2-1)</strong> Suponha que usamos uma função hash $h$ para espalhar $n$ chaves distintas em um arranjo $T$ de comprimento $m$. Sob hashing uniforme simples, qual é o <strong>número esperado de colisões</strong> (isto é, a cardinalidade esperada de $\\{\\{k, l\\} : k \\neq l \\text{ e } h(k) = h(l)\\}$)?</li>
            <li><strong>(Exercício 11.2-2)</strong> Demonstre a inserção das chaves $5, 28, 19, 15, 20, 33, 12, 17, 10$ em uma tabela com encadeamento de $m = 9$ posições e $h(k) = k \\bmod 9$.</li>
            <li><strong>(Exercício 11.3-4)</strong> Considere uma tabela de tamanho $m = 1000$ e a função pelo método da multiplicação $h(k) = \\lfloor m (k A \\bmod 1) \\rfloor$ para $A = (\\sqrt{5} - 1)/2 \\approx 0,6180339887$. Calcule as posições para as quais são mapeadas as chaves $61, 62, 63, 64$ e $65$.</li>
          </ol>
        `,
        placeholder:
          "Use variáveis indicadoras para os C(n,2) pares no Ex. 11.2-1, monte as 9 listas de k mod 9 no Ex. 11.2-2 e calcule ⌊1000(kA mod 1)⌋ para k = 61..65...",
        solution: `
          <h4>1. Número Esperado de Colisões sob Hashing Uniforme Simples (Ex. 11.2-1)</h4>
          <p>Para cada par não ordenado $\\{k_i, k_j\\}$ de chaves distintas ($1 \\le i < j \\le n$), definimos a variável aleatória indicadora $X_{ij} = \\text{I}\\{h(k_i) = h(k_j)\\}$. Sob hashing uniforme simples, $h(k_i)$ e $h(k_j)$ são distribuídos uniforme e independentemente em $\\{0, \\dots, m - 1\\}$, logo $\\Pr\\{h(k_i) = h(k_j)\\} = 1/m$ e $\\text{E}[X_{ij}] = 1/m$.</p>
          <p>Como existem exatamente $\\binom{n}{2} = \\frac{n(n - 1)}{2}$ pares de chaves distintas, pela linearidade da esperança o número total esperado de colisões é:</p>
          $$\\text{E}\\left[\\sum_{1 \\le i < j \\le n} X_{ij}\\right] = \\sum_{1 \\le i < j \\le n} \\text{E}[X_{ij}] = \\binom{n}{2} \\cdot \\frac{1}{m} = \\mathbf{\\frac{n(n - 1)}{2m}}.$$

          <h4>2. Rastreamento do Encadeamento com $m = 9$ e $h(k) = k \\bmod 9$ (Ex. 11.2-2)</h4>
          <p>Calculando $h(k) = k \\bmod 9$ para a sequência $\\langle 5, 28, 19, 15, 20, 33, 12, 17, 10 \\rangle$ e lembrando que cada nova chave é inserida <strong>no início (cabeça)</strong> da respectiva lista ligada:</p>
          <ul>
            <li>$h(5) = 5 \\implies T[5]: \\langle 5 \\rangle$</li>
            <li>$h(28) = 1 \\implies T[1]: \\langle 28 \\rangle$</li>
            <li>$h(19) = 1 \\implies T[1]: \\langle 19, 28 \\rangle$</li>
            <li>$h(15) = 6 \\implies T[6]: \\langle 15 \\rangle$</li>
            <li>$h(20) = 2 \\implies T[2]: \\langle 20 \\rangle$</li>
            <li>$h(33) = 6 \\implies T[6]: \\langle 33, 15 \\rangle$</li>
            <li>$h(12) = 3 \\implies T[3]: \\langle 12 \\rangle$</li>
            <li>$h(17) = 8 \\implies T[8]: \\langle 17 \\rangle$</li>
            <li>$h(10) = 1 \\implies T[1]: \\langle 10, 19, 28 \\rangle$</li>
          </ul>
          <p><strong>Estado final das 9 posições ($T[0 \\dots 8]$):</strong><br>
          $T[0] = \\text{NIL}$; $\\; T[1] = 10 \\rightleftarrows 19 \\rightleftarrows 28$; $\\; T[2] = 20$; $\\; T[3] = 12$; $\\; T[4] = \\text{NIL}$; $\\; T[5] = 5$; $\\; T[6] = 33 \\rightleftarrows 15$; $\\; T[7] = \\text{NIL}$; $\\; T[8] = 17$.</p>

          <h4>3. Método da Multiplicação com $m = 1000$ e $A = (\\sqrt{5} - 1)/2 \\approx 0,61803398875$ (Ex. 11.3-4)</h4>
          <p>Calculamos $kA$, extraímos a parte fracionária $kA \\bmod 1 = kA - \\lfloor kA \\rfloor$ e tomamos $\\lfloor 1000 \\cdot (kA \\bmod 1) \\rfloor$:</p>
          <ul>
            <li><strong>$k = 61$:</strong> $61 A \\approx 37,7000733 \\implies 61A \\bmod 1 \\approx 0,7000733 \\implies h(61) = \\lfloor 700,0733 \\rfloor = \\mathbf{700}$.</li>
            <li><strong>$k = 62$:</strong> $62 A \\approx 38,3181073 \\implies 62A \\bmod 1 \\approx 0,3181073 \\implies h(62) = \\lfloor 318,1073 \\rfloor = \\mathbf{318}$.</li>
            <li><strong>$k = 63$:</strong> $63 A \\approx 38,9361413 \\implies 63A \\bmod 1 \\approx 0,9361413 \\implies h(63) = \\lfloor 936,1413 \\rfloor = \\mathbf{936}$.</li>
            <li><strong>$k = 64$:</strong> $64 A \\approx 39,5541753 \\implies 64A \\bmod 1 \\approx 0,5541753 \\implies h(64) = \\lfloor 554,1753 \\rfloor = \\mathbf{554}$.</li>
            <li><strong>$k = 65$:</strong> $65 A \\approx 40,1722093 \\implies 65A \\bmod 1 \\approx 0,1722093 \\implies h(65) = \\lfloor 172,2093 \\rfloor = \\mathbf{172}$.</li>
          </ul>
          <p>Observe a excelência da razão áurea $A$: chaves consecutivas ($61, 62, 63, 64, 65$) são espalhadas uniformemente por toda a tabela ($700, 318, 936, 554, 172$)! </p>
        `
      },
      {
        id: "ex7-6",
        code: "EXERCÍCIO 06 • COMPARAÇÃO COMPLETA DO ENDEREÇAMENTO ABERTO (EX. 11.4-1)",
        reference: "Exercício 11.4-1 (p. 241)",
        title: "Inserção de ⟨10, 22, 31, 4, 15, 28, 17, 88, 59⟩ em m = 11 via Sondagem Linear, Quadrática e Hash Duplo",
        prompt: `
          <p><strong>(Exercício 11.4-1)</strong> Considere a inserção das chaves $10, 22, 31, 4, 15, 28, 17, 88, 59$ em uma tabela de espalhamento de comprimento $m = 11$ usando endereçamento aberto com a função hash auxiliar $h'(k) = k$ (isto é, $k \\bmod 11$). Ilustre passo a passo o resultado da inserção dessas chaves utilizando:</p>
          <ol>
            <li><strong>Sondagem Linear:</strong> $h(k, i) = (k + i) \\bmod 11$.</li>
            <li><strong>Sondagem Quadrática:</strong> $h(k, i) = (k + c_1 i + c_2 i^2) \\bmod 11$ com $c_1 = 1$ e $c_2 = 3$.</li>
            <li><strong>Hash Duplo:</strong> $h(k, i) = (h_1(k) + i \\cdot h_2(k)) \\bmod 11$ com $h_1(k) = k$ e $h_2(k) = 1 + (k \\bmod (m - 1)) = 1 + (k \\bmod 10)$.</li>
          </ol>
        `,
        placeholder:
          "Calcule h₁(k) = k mod 11 e h₂(k) = 1 + (k mod 10) para cada uma das 9 chaves e trace as colisões nos 3 métodos...",
        solution: `
          <h4>0. Pré-Cálculo das Funções Auxiliares para as 9 Chaves ($m = 11$)</h4>
          <ul>
            <li>$k = 10$: $h_1(10) = 10 \\bmod 11 = 10$; $\\; h_2(10) = 1 + (10 \\bmod 10) = 1$.</li>
            <li>$k = 22$: $h_1(22) = 22 \\bmod 11 = 0$; $\\; h_2(22) = 1 + (22 \\bmod 10) = 3$.</li>
            <li>$k = 31$: $h_1(31) = 31 \\bmod 11 = 9$; $\\; h_2(31) = 1 + (31 \\bmod 10) = 2$.</li>
            <li>$k = 4$: $h_1(4) = 4 \\bmod 11 = 4$; $\\; h_2(4) = 1 + (4 \\bmod 10) = 5$.</li>
            <li>$k = 15$: $h_1(15) = 15 \\bmod 11 = 4$; $\\; h_2(15) = 1 + (15 \\bmod 10) = 6$.</li>
            <li>$k = 28$: $h_1(28) = 28 \\bmod 11 = 6$; $\\; h_2(28) = 1 + (28 \\bmod 10) = 9$.</li>
            <li>$k = 17$: $h_1(17) = 17 \\bmod 11 = 6$; $\\; h_2(17) = 1 + (17 \\bmod 10) = 8$.</li>
            <li>$k = 88$: $h_1(88) = 88 \\bmod 11 = 0$; $\\; h_2(88) = 1 + (88 \\bmod 10) = 9$.</li>
            <li>$k = 59$: $h_1(59) = 59 \\bmod 11 = 4$; $\\; h_2(59) = 1 + (59 \\bmod 10) = 10$.</li>
          </ul>
          <p>As 4 primeiras chaves ($10 \\to T[10]$, $22 \\to T[0]$, $31 \\to T[9]$, $4 \\to T[4]$) entram sem colisão ($i = 0$) nos três métodos. As diferenças surgem a partir de $k = 15$:</p>

          <h4>1. Sondagem Linear: $h(k, i) = (h_1(k) + i) \\bmod 11$</h4>
          <ul>
            <li><strong>$15$ ($h_1 = 4$):</strong> $T[4]$ ocupado $\\to i=1: T[5] = 15$.</li>
            <li><strong>$28$ ($h_1 = 6$):</strong> $i=0: T[6] = 28$.</li>
            <li><strong>$17$ ($h_1 = 6$):</strong> $T[6]$ ocupado $\\to i=1: T[7] = 17$.</li>
            <li><strong>$88$ ($h_1 = 0$):</strong> $T[0]$ ocupado $\\to i=1: T[1] = 88$.</li>
            <li><strong>$59$ ($h_1 = 4$):</strong> $T[4], T[5], T[6], T[7]$ ocupados (agrupamento primário!) $\\to i=4: T[8] = 59$.</li>
          </ul>
          <p><strong>Tabela Final (Linear):</strong> $\\langle 0: 22,\\; 1: 88,\\; 2: \\text{NIL},\\; 3: \\text{NIL},\\; 4: 4,\\; 5: 15,\\; 6: 28,\\; 7: 17,\\; 8: 59,\\; 9: 31,\\; 10: 10 \\rangle$.</p>

          <h4>2. Sondagem Quadrática: $h(k, i) = (h_1(k) + i + 3i^2) \\bmod 11$</h4>
          <p>(Deslocamentos $i + 3i^2$: para $i=1 \\to +4$; $i=2 \\to +14 \\equiv +3$; $i=3 \\to +30 \\equiv +8$; $i=4 \\to +52 \\equiv +8$):</p>
          <ul>
            <li><strong>$15$ ($h_1 = 4$):</strong> $i=0: T[4]$ ocupado $\\to i=1: (4 + 4)\\bmod 11 = 8 \\implies T[8] = 15$.</li>
            <li><strong>$28$ ($h_1 = 6$):</strong> $i=0: T[6] = 28$.</li>
            <li><strong>$17$ ($h_1 = 6$):</strong> $i=0: T[6]$ ocupado $\\to i=1: (6 + 4)\\bmod 11 = 10$ (ocupado por 10) $\\to i=2: (6 + 14)\\bmod 11 = 9$ (ocupado por 31) $\\to i=3: (6 + 30)\\bmod 11 = 3 \\implies T[3] = 17$.</li>
            <li><strong>$88$ ($h_1 = 0$):</strong> $i=0: T[0]$ ocupado $\\to i=1: (0 + 4)\\bmod 11 = 4$ (ocupado por 4) $\\to i=2: (0 + 14)\\bmod 11 = 3$ (ocupado por 17) $\\to i=3: (0 + 30)\\bmod 11 = 8$ (ocupado por 15) $\\to i=4: (0 + 52)\\bmod 11 = 8$ (ocupado) $\\to i=5: (0 + 80)\\bmod 11 = 3$ (ocupado) $\\to i=6: (0 + 114)\\bmod 11 = 4$ (ocupado) $\\to i=7: (0 + 154)\\bmod 11 = 0$ (ocupado) $\\to i=8: (0 + 200)\\bmod 11 = 2 \\implies T[2] = 88$.</li>
            <li><strong>$59$ ($h_1 = 4$):</strong> $i=0: T[4]$ ocupado $\\to i=1: T[8]$ ocupado (agrupamento secundário com 4 e 15!) $\\to i=2: (4 + 14)\\bmod 11 = 7 \\implies T[7] = 59$.</li>
          </ul>
          <p><strong>Tabela Final (Quadrática):</strong> $\\langle 0: 22,\\; 1: \\text{NIL},\\; 2: 88,\\; 3: 17,\\; 4: 4,\\; 5: \\text{NIL},\\; 6: 28,\\; 7: 59,\\; 8: 15,\\; 9: 31,\\; 10: 10 \\rangle$.</p>

          <h4>3. Hash Duplo: $h(k, i) = (h_1(k) + i \\cdot h_2(k)) \\bmod 11$</h4>
          <ul>
            <li><strong>$15$ ($h_1 = 4, h_2 = 6$):</strong> $i=0: T[4]$ ocupado $\\to i=1: (4 + 6)\\bmod 11 = 10$ (ocupado por 10) $\\to i=2: (4 + 12)\\bmod 11 = 5 \\implies T[5] = 15$.</li>
            <li><strong>$28$ ($h_1 = 6, h_2 = 9$):</strong> $i=0: T[6] = 28$.</li>
            <li><strong>$17$ ($h_1 = 6, h_2 = 8$):</strong> $i=0: T[6]$ ocupado $\\to i=1: (6 + 8)\\bmod 11 = 3 \\implies T[3] = 17$.</li>
            <li><strong>$88$ ($h_1 = 0, h_2 = 9$):</strong> $i=0: T[0]$ ocupado $\\to i=1: (0 + 9)\\bmod 11 = 9$ (ocupado por 31) $\\to i=2: (0 + 18)\\bmod 11 = 7 \\implies T[7] = 88$.</li>
            <li><strong>$59$ ($h_1 = 4, h_2 = 10$):</strong> $i=0: T[4]$ ocupado $\\to i=1: (4 + 10)\\bmod 11 = 3$ (ocupado por 17) $\\to i=2: (4 + 20)\\bmod 11 = 2 \\implies T[2] = 59$.</li>
          </ul>
          <p><strong>Tabela Final (Hash Duplo):</strong> $\\langle 0: 22,\\; 1: \\text{NIL},\\; 2: 59,\\; 3: 17,\\; 4: 4,\\; 5: 15,\\; 6: 28,\\; 7: 88,\\; 8: \\text{NIL},\\; 9: 31,\\; 10: 10 \\rangle$.</p>
        `
      },
      {
        id: "ex7-7",
        code: "EXERCÍCIO 07 • REMOÇÃO COM DELETED E SUBGRUPOS CÍCLICOS NO HASH DUPLO",
        reference: "Exercícios 11.4-2 e 11.4-4 (pp. 241–242)",
        title: "Pseudocódigo de HASH-DELETE / HASH-INSERT com DELETED e Prova de mdc(h₂(k), m) = d",
        prompt: `
          <p>Resolva os Exercícios 11.4-2 e 11.4-4 da Seção 11.4:</p>
          <ol>
            <li><strong>(Exercício 11.4-2)</strong> Escreva o pseudocódigo para <code>HASH-DELETE(T, k)</code> como descrito no texto e modifique <code>HASH-INSERT(T, k)</code> para manipular o valor especial <code>DELETED</code>.</li>
            <li><strong>(Exercício 11.4-4)</strong> Suponha que usamos hash duplo $h(k, i) = (h_1(k) + i \\cdot h_2(k)) \\bmod m$. Mostre que, se $m$ e $h_2(k)$ têm máximo divisor comum $d = \\text{mdc}(m, h_2(k)) \\ge 1$, então uma busca mal sucedida para a chave $k$ examina apenas $(1/d)$-ésimo da tabela antes de retornar à posição inicial $h_1(k)$. Conclua que quando $d = 1$ a busca examina a tabela inteira.</li>
          </ol>
        `,
        placeholder:
          "Escreva HASH-INSERT aceitando T[j] == NIL ou T[j] == DELETED e HASH-DELETE gravando DELETED; depois mostre que i·h₂(k) ≡ 0 (mod m) tem menor solução positiva i = m/d...",
        solution: `
          <h4>1. Pseudocódigo de <code>HASH-INSERT</code> Modificado e <code>HASH-DELETE</code> (Ex. 11.4-2)</h4>
          <p>Em <code>HASH-INSERT</code>, basta substituir o teste <code>if T[j] == NIL</code> na linha 5 por <code>if T[j] == NIL ou T[j] == DELETED</code>. Em <code>HASH-DELETE</code>, localizamos a chave $k$ seguindo a mesma sequência de sondagem de <code>HASH-SEARCH</code> e gravamos <code>T[j] = DELETED</code>:</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">HASH-INSERT-WITH-DELETED(T, k)</span> e <span class="proc-name">HASH-DELETE(T, k)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">HASH-INSERT-WITH-DELETED</span>(T, k)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    i = 0</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    <span class="kw">repeat</span></span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">        j = h(k, i)</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">        <span class="kw">if</span> T[j] == NIL <span class="kw">ou</span> T[j] == DELETED</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">            T[j] = k</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">            <span class="kw">return</span> j</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">        <span class="kw">else</span> i = i + 1</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">    <span class="kw">until</span> i == m</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">    <span class="kw">error</span> "estouro da tabela de espalhamento"</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">&nbsp;</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content"><span class="kw">HASH-DELETE</span>(T, k)</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">    i = 0</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">    <span class="kw">repeat</span></span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content">        j = h(k, i)</span></div>
              <div class="code-line"><span class="line-num">16</span><span class="line-content">        <span class="kw">if</span> T[j] == k</span></div>
              <div class="code-line"><span class="line-num">17</span><span class="line-content">            T[j] = DELETED</span></div>
              <div class="code-line"><span class="line-num">18</span><span class="line-content">            <span class="kw">return</span> j</span></div>
              <div class="code-line"><span class="line-num">19</span><span class="line-content">        i = i + 1</span></div>
              <div class="code-line"><span class="line-num">20</span><span class="line-content">    <span class="kw">until</span> T[j] == NIL <span class="kw">ou</span> i == m</span></div>
              <div class="code-line"><span class="line-num">21</span><span class="line-content">    <span class="kw">error</span> "chave k não encontrada na tabela"</span></div>
            </div>
          </div>

          <h4>2. Prova de que o Hash Duplo Examina $m/d$ Posições quando $\\text{mdc}(m, h_2(k)) = d$ (Ex. 11.4-4)</h4>
          <p>Seja $d = \\text{mdc}(m, h_2(k)) \\ge 1$. Queremos determinar o menor inteiro positivo $i \\ge 1$ para o qual a $i$-ésima posição sondada coincide novamente com a posição inicial $h(k, 0) = h_1(k)$:</p>
          $$h(k, i) = h(k, 0) \\iff (h_1(k) + i \\cdot h_2(k)) \\bmod m = h_1(k) \\bmod m \\iff i \\cdot h_2(k) \\equiv 0 \\pmod m.$$
          <p>Dividindo $m$ e $h_2(k)$ pelo seu máximo divisor comum $d$, escrevemos $m = d \\cdot m'$ e $h_2(k) = d \\cdot h'$, onde $\\text{mdc}(m', h') = 1$ (são primos entre si). A congruência $d \\cdot m' \\mid i \\cdot d \\cdot h'$ equivale a:</p>
          $$m' \\mid i \\cdot h'.$$
          <p>Pelo Lema de Euclides (Teorema 31.4, Capítulo 31), como $\\text{mdc}(m', h') = 1$, $m'$ divide $i \\cdot h'$ se, e somente se, $m'$ divide $i$. Portanto, o menor inteiro positivo $i$ para o qual a sequência de sondagem retorna a $h_1(k)$ (e passa a repetir o mesmo ciclo) é:</p>
          $$i = m' = \\mathbf{\\frac{m}{d}},$$
          <p>que corresponde a exatamente $(1/d)$-ésimo das $m$ posições da tabela! Em particular, quando $d = \\text{mdc}(m, h_2(k)) = 1$, o período é $m/1 = m$, visitando todas as $m$ posições da tabela antes de repetir. $\\blacksquare$</p>
        `
      },
      {
        id: "ex7-8",
        code: "EXERCÍCIO 08 • PROBLEMA 11-1: LIMITE O(lg n) PARA A SONDAGEM MAIS LONGA",
        reference: "Problema 11-1 (pp. 245–246)",
        title: "Prova de que a Sequência de Sondagens Mais Longa em Endereçamento Aberto com n ≤ m/2 é O(lg n)",
        prompt: `
          <p>Resolva integralmente o <strong>Problema 11-1 (Limite para sondagem mais longa em hashing)</strong>: Suponha que usamos uma tabela de espalhamento de endereçamento aberto de tamanho $m$ para armazenar $n \\le m/2$ itens sob hashing uniforme. Seja $X_i$ o número de sondagens exigidas pela $i$-ésima inserção ($1 \\le i \\le n$) e seja $X = \\max_{1 \\le i \\le n} X_i$ o comprimento da sequência de sondagens mais longa:</p>
          <ol>
            <li><strong>(a)</strong> Mostre que, para $i = 1, 2, \\dots, n$, a probabilidade de a $i$-ésima inserção exigir estritamente mais de $k$ sondagens satisfaz $\\Pr\\{X_i > k\\} \\le 2^{-k}$.</li>
            <li><strong>(b)</strong> Mostre que, para $i = 1, 2, \\dots, n$, $\\Pr\\{X_i > 2 \\lg n\\} \\le 1/n^2 = O(1/n^2)$.</li>
            <li><strong>(c)</strong> Mostre que $\\Pr\\{X > 2 \\lg n\\} \\le 1/n = O(1/n)$.</li>
            <li><strong>(d)</strong> Conclua que o comprimento esperado $\\text{E}[X]$ da sequência de sondagens mais longa é $\\mathbf{O(\\lg n)}$.</li>
          </ol>
        `,
        placeholder:
          "Use o limite Pr{X_i ≥ k+1} ≤ (i-1)/m ≤ 1/2 elevado a k para (a), substitua k = 2 lg n para (b), aplique o limite da união (Boole) para (c) e divida a soma de E[X] em ≤ ⌈2 lg n⌉ e > ⌈2 lg n⌉ para (d)...",
        solution: `
          <h4>(a) Prova de que $\\Pr\\{X_i > k\\} \\le 2^{-k}$</h4>
          <p>Na $i$-ésima inserção, existem $i - 1 < n \\le m/2$ elementos já armazenados na tabela. Pelo cálculo da prova do Teorema 11.6, a probabilidade de as primeiras $k$ posições sondadas estarem todas ocupadas (o que equivale ao evento $\\{X_i > k\\}$, isto é, $\\{X_i \\ge k + 1\\}$) é:</p>
          $$\\Pr\\{X_i > k\\} = \\frac{i - 1}{m} \\cdot \\frac{i - 2}{m - 1} \\cdots \\frac{i - k}{m - k + 1} \\le \\left(\\frac{i - 1}{m}\\right)^k < \\left(\\frac{n}{m}\\right)^k \\le \\left(\\frac{1}{2}\\right)^k = \\mathbf{2^{-k}}.$$

          <h4>(b) Prova de que $\\Pr\\{X_i > 2 \\lg n\\} \\le 1/n^2 = O(1/n^2)$</h4>
          <p>Substituindo $k = 2 \\lg n$ na desigualdade da parte (a):</p>
          $$\\Pr\\{X_i > 2 \\lg n\\} \\le 2^{-2 \\lg n} = \\left(2^{\\lg n}\\right)^{-2} = n^{-2} = \\mathbf{\\frac{1}{n^2}} = O(1/n^2).$$

          <h4>(c) Prova de que $\\Pr\\{X > 2 \\lg n\\} \\le 1/n = O(1/n)$</h4>
          <p>Como $X = \\max_{1 \\le i \\le n} X_i$, o evento $\\{X > 2 \\lg n\\}$ ocorre se, e somente se, pelo menos uma das variáveis $X_i$ exceder $2 \\lg n$, isto é, $\\{X > 2 \\lg n\\} = \\bigcup_{i=1}^{n} \\{X_i > 2 \\lg n\\}$. Pela <strong>desigualdade de Boole (limite da união)</strong>:</p>
          $$\\Pr\\{X > 2 \\lg n\\} = \\Pr\\left\\{\\bigcup_{i=1}^{n} \\{X_i > 2 \\lg n\\}\\right\\} \\le \\sum_{i=1}^{n} \\Pr\\{X_i > 2 \\lg n\\} \\le \\sum_{i=1}^{n} \\frac{1}{n^2} = n \\cdot \\frac{1}{n^2} = \\mathbf{\\frac{1}{n}} = O(1/n).$$

          <h4>(d) Prova de que $\\text{E}[X] = O(\\lg n)$</h4>
          <p>Como no máximo $n$ elementos são inseridos, nenhuma inserção jamais faz mais do que $n$ sondagens ($X \\le n$). Particionamos o cálculo do valor esperado $\\text{E}[X]$ em torno do limiar $k_0 = \\lceil 2 \\lg n \\rceil$:</p>
          $$\\text{E}[X] = \\sum_{k=1}^{n} k \\cdot \\Pr\\{X = k\\} = \\sum_{k=1}^{\\lceil 2 \\lg n \\rceil} k \\cdot \\Pr\\{X = k\\} + \\sum_{k=\\lceil 2 \\lg n \\rceil + 1}^{n} k \\cdot \\Pr\\{X = k\\}$$
          $$\\le \\lceil 2 \\lg n \\rceil \\cdot \\Pr\\{X \\le \\lceil 2 \\lg n \\rceil\\} + n \\cdot \\Pr\\{X > 2 \\lg n\\}$$
          $$\\le \\lceil 2 \\lg n \\rceil \\cdot 1 + n \\cdot \\frac{1}{n} = \\lceil 2 \\lg n \\rceil + 1 = \\mathbf{O(\\lg n)}. \\quad \\blacksquare$$
        `
      }
    ]
  };

  if (typeof window !== "undefined" && typeof window.registerCodexModule === "function") {
    window.registerCodexModule(7, module7Content);
  } else if (typeof window !== "undefined") {
    window.PendingCodexModules = window.PendingCodexModules || {};
    window.PendingCodexModules[7] = module7Content;
  }
})();
