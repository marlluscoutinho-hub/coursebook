<h3>1. O Paradigma de Divisão e Conquista</h3>
<p>Enquanto a ordenação por inserção adota uma abordagem <strong>incremental</strong> (inserindo um único elemento $A[j]$ por vez no subarranjo já ordenado $A[1 \dots j-1]$), muitos dos algoritmos mais poderosos da computação têm estrutura <strong>recursiva</strong> e seguem o paradigma de <strong>Divisão e Conquista</strong>, composto por três passos em cada nível da recursão:</p>
<ul>
<li><strong>Divisão:</strong> Dividir o problema em um determinado número de subproblemas que são instâncias menores do mesmo problema original.</li>
<li><strong>Conquista:</strong> Conquistar os subproblemas resolvendo-os recursivamente. Se os tamanhos dos subproblemas forem pequenos o bastante (caso base), resolvê-los diretamente.</li>
<li><strong>Combinação:</strong> Combinar as soluções dos subproblemas para formar a solução do problema original.</li>
</ul>
<p>Aplicado à <strong>ordenação por intercalação (<code>MERGE-SORT</code>)</strong>, o paradigma opera assim:</p>
<ol>
<li><strong>Divisão:</strong> Divide a sequência de $n$ elementos em duas subsequências de $n/2$ elementos cada.</li>
<li><strong>Conquista:</strong> Ordena as duas subsequências recursivamente utilizando a ordenação por intercalação (a recursão "extingue-se" quando a subsequência tem comprimento $1$, pois qualquer sequência de $1$ elemento já está ordenada!).</li>
<li><strong>Combinação:</strong> Intercala (mescla) as duas subsequências ordenadas para produzir a sequência ordenada final.</li>
</ol>

<h3>2. O Procedimento Auxiliar <code>MERGE(A, p, q, r)</code> e o Truque das Cartas Sentinelas $\infty$</h3>
<p>O coração do algoritmo reside na etapa de combinação, realizada pelo procedimento <code>MERGE(A, p, q, r)</code>, onde $p \le q < r$. Ele assume que os subarranjos $A[p \dots q]$ (com $n_1 = q - p + 1$ elementos) e $A[q + 1 \dots r]$ (com $n_2 = r - q$ elementos) já estão individualmente ordenados e os intercala em um único subarranjo ordenado $A[p \dots r]$ de $n = r - p + 1 = n_1 + n_2$ elementos.</p>

<div class="canonical-callout analogy">
<span class="callout-tag">[ ANALOGIA DO LIVRO • DUAS PILHAS COM SENTINELAS ∞ (p. 36) ]</span>
<p>Imagine duas pilhas de cartas na mesa, ambas <strong>viradas para cima</strong> e ordenadas com as menores cartas no topo. Queremos fundi-las em uma única pilha de saída ordenada. Em cada passo básico, olhamos apenas as duas cartas do topo das duas pilhas, escolhemos a menor delas e a colocamos na pilha de saída. Para evitar ter de testar em cada iteração se uma das duas pilhas já ficou vazia, colocamos no fundo de cada pilha uma <strong>carta sentinela</strong> com o valor especial $\infty$ (infinito). Sempre que uma carta $\infty$ é exposta no topo de uma pilha, ela jamais será menor que uma carta real da outra pilha! E como sabemos de antemão que exatamente $r - p + 1$ cartas reais precisam ir para a pilha de saída, basta executar um laço <code>for k = p to r</code> de exatamente $r - p + 1$ iterações: quando ambas as cartas $\infty$ ficarem frente a frente, o laço já terá terminado!</p>
</div>

<div class="clrs-pseudocode-box">
<div class="pseudocode-header">
<span class="proc-name">MERGE(A, p, q, r)</span>
<span>[ CAPÍTULO 2.3.1 • INTERCALAÇÃO EM Θ(n) COM SENTINELAS ]</span>
</div>
<div class="pseudocode-lines">
<div class="code-line"><span class="line-num">1</span><span class="line-content">n₁ = q - p + 1</span></div>
<div class="code-line"><span class="line-num">2</span><span class="line-content">n₂ = r - q</span></div>
<div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">sejam</span> L[1 .. n₁ + 1] <span class="kw">e</span> R[1 .. n₂ + 1] novos arranjos</span></div>
<div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">for</span> i = 1 <span class="kw">to</span> n₁</span></div>
<div class="code-line"><span class="line-num">5</span><span class="line-content">    L[i] = A[p + i - 1]</span></div>
<div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">for</span> j = 1 <span class="kw">to</span> n₂</span></div>
<div class="code-line"><span class="line-num">7</span><span class="line-content">    R[j] = A[q + j]</span></div>
<div class="code-line"><span class="line-num">8</span><span class="line-content">L[n₁ + 1] = ∞</span></div>
<div class="code-line"><span class="line-num">9</span><span class="line-content">R[n₂ + 1] = ∞</span></div>
<div class="code-line"><span class="line-num">10</span><span class="line-content">i = 1</span></div>
<div class="code-line"><span class="line-num">11</span><span class="line-content">j = 1</span></div>
<div class="code-line"><span class="line-num">12</span><span class="line-content"><span class="kw">for</span> k = p <span class="kw">to</span> r</span></div>
<div class="code-line"><span class="line-num">13</span><span class="line-content">    <span class="kw">if</span> L[i] ≤ R[j]</span></div>
<div class="code-line"><span class="line-num">14</span><span class="line-content">        A[k] = L[i]</span></div>
<div class="code-line"><span class="line-num">15</span><span class="line-content">        i = i + 1</span></div>
<div class="code-line"><span class="line-num">16</span><span class="line-content">    <span class="kw">else</span> A[k] = R[j]</span></div>
<div class="code-line"><span class="line-num">17</span><span class="line-content">        j = j + 1</span></div>
</div>
</div>

<div class="canonical-callout invariant">
<span class="callout-tag">[ INVARIANTE DE LAÇO • PROCEDIMENTO MERGE (pp. 37–38) ]</span>
<p><strong>Enunciado do Invariante:</strong> <em>"No início de cada iteração do laço <code>for</code> das linhas 12 a 17, o subarranjo $A[p \dots k - 1]$ contém os $k - p$ menores elementos de $L[1 \dots n_1 + 1]$ e $R[1 \dots n_2 + 1]$, em sequência ordenada. Além disso, $L[i]$ e $R[j]$ são os menores elementos de seus arranjos que não foram copiados de volta em $A$."</em></p>
<div class="invariant-triad">
<div class="triad-card">
<div class="triad-card-title">1. Inicialização</div>
<p>Antes da primeira iteração, $k = p$, logo $A[p \dots k - 1]$ está vazio e contém os $k - p = 0$ menores elementos de $L$ e $R$. Como $i = j = 1$, tanto $L[1]$ quanto $R[1]$ são os menores elementos de seus respectivos arranjos ainda não copiados de volta em $A$.</p>
</div>
<div class="triad-card">
<div class="triad-card-title">2. Manutenção</div>
<p>Suponha primeiro que $L[i] \le R[j]$. Então $L[i]$ é o menor elemento ainda não copiado para $A$. Como $A[p \dots k - 1]$ já continha os $k - p$ menores elementos, após a linha 14 copiar $L[i]$ para $A[k]$, o subarranjo $A[p \dots k]$ passa a conter os $k - p + 1$ menores elementos ordenados. Incrementar $k$ (no laço <code>for</code>) e $i$ (linha 15) restabelece o invariante. Se $L[i] > R[j]$, as linhas 16–17 fazem o mesmo simetricamente.</p>
</div>
<div class="triad-card">
<div class="triad-card-title">3. Término</div>
<p>No término, $k = r + 1$. Pelo invariante, $A[p \dots k - 1] = A[p \dots r]$ contém os $k - p = r - p + 1$ menores elementos de $L[1 \dots n_1 + 1]$ e $R[1 \dots n_2 + 1]$ em sequência ordenada. Juntos, $L$ e $R$ contêm $n_1 + n_2 + 2 = r - p + 3$ elementos; todos foram copiados em $A$, exceto os dois maiores, que são justamente as duas sentinelas $\infty$!</p>
</div>
</div>
</div>

<p><strong>Tempo de execução de <code>MERGE</code>:</strong> As linhas 1–3 e 8–11 levam tempo constante $\Theta(1)$; os dois laços de cópia nas linhas 4–7 levam tempo $\Theta(n_1 + n_2) = \Theta(n)$; e o laço principal das linhas 12–17 executa exatamente $n = r - p + 1$ iterações de custo constante cada. Logo, <code>MERGE</code> executa em tempo linear <strong>$\Theta(n)$</strong> (e observe que ele <em>não</em> opera no lugar, pois aloca os arranjos auxiliares $L$ e $R$ de tamanho total $\Theta(n)$).</p>

<h3>3. O Procedimento Recursivo <code>MERGE-SORT(A, p, r)</code></h3>
<p>Usando <code>MERGE</code> como sub-rotina, o procedimento <code>MERGE-SORT(A, p, r)</code> ordena o subarranjo $A[p \dots r]$. Se $p \ge r$, o subarranjo possui no máximo $1$ elemento e já está ordenado. Caso contrário ($p < r$), calculamos o índice médio $q = \lfloor (p + r)/2 \rfloor$, que particiona $A[p \dots r]$ em $A[p \dots q]$ (com $\lceil n/2 \rceil$ elementos) e $A[q + 1 \dots r]$ (com $\lfloor n/2 \rfloor$ elementos):</p>

<div class="clrs-pseudocode-box">
<div class="pseudocode-header">
<span class="proc-name">MERGE-SORT(A, p, r)</span>
<span>[ CAPÍTULO 2.3.1 • CHAMADA INICIAL: MERGE-SORT(A, 1, A.comprimento) ]</span>
</div>
<div class="pseudocode-lines">
<div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> p &lt; r</span></div>
<div class="code-line"><span class="line-num">2</span><span class="line-content">    q = ⌊(p + r) / 2⌋</span></div>
<div class="code-line"><span class="line-num">3</span><span class="line-content">    MERGE-SORT(A, p, q)</span></div>
<div class="code-line"><span class="line-num">4</span><span class="line-content">    MERGE-SORT(A, q + 1, r)</span></div>
<div class="code-line"><span class="line-num">5</span><span class="line-content">    MERGE(A, p, q, r)</span></div>
</div>
</div>

<div id="workbench-merge-mount"></div>
