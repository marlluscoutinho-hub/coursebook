<p>O Capítulo 2 (<em>"Dando a Partida"</em>) nos apresenta a estrutura metodológica que percorrerá todo o livro: especificar o algoritmo em um pseudocódigo límpido, demonstrar matematicamente sua corretude por meio de um <strong>invariante de laço</strong> e analisar seu tempo de execução.</p>

<h3>1. A Mecânica da Ordenação por Inserção (<code>INSERTION-SORT</code>)</h3>
<p>A <strong>ordenação por inserção</strong> é um algoritmo eficiente para ordenar um número pequeno de elementos. Os números que desejamos ordenar são chamados de <strong>chaves</strong>.</p>

<div class="canonical-callout analogy">
<span class="callout-tag">[ ANALOGIA DO LIVRO • CARTAS DE BARALHO (FIGURA 2.1, p. 26) ]</span>
<p>A ordenação por inserção funciona exatamente como muitas pessoas ordenam cartas em um jogo de baralho. Começamos com a mão esquerda vazia e todas as cartas viradas para baixo sobre a mesa. Em seguida, pegamos uma carta de cada vez da mesa e a inserimos na posição correta na mão esquerda. Para achar a posição correta dessa nova carta, nós a comparamos com cada uma das cartas que já estão na mão, <strong>da direita para a esquerda</strong>. Em todos os momentos, as cartas seguradas na mão esquerda estão ordenadas, e essas cartas eram justamente as que estavam no topo da pilha sobre a mesa.</p>
</div>

<p>O procedimento <code>INSERTION-SORT(A)</code> recebe como parâmetro um arranjo $A[1 \dots n]$ de comprimento $n = A.\text{comprimento}$. Ele ordena os elementos <strong>no lugar</strong> (<em>in-place</em>): reorganiza os números dentro do próprio arranjo $A$, mantendo no máximo um número <strong>constante</strong> de elementos armazenados fora do arranjo em qualquer instante (a variável escalar <code>chave</code>, além dos índices locais <code>i</code> e <code>j</code>).</p>

<div class="clrs-pseudocode-box">
<div class="pseudocode-header">
<span class="proc-name">INSERTION-SORT(A)</span>
<span>[ CAPÍTULO 2.1 • ORDENAÇÃO NO LUGAR ]</span>
</div>
<div class="pseudocode-lines">
<div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">for</span> j = 2 <span class="kw">to</span> A.comprimento</span></div>
<div class="code-line"><span class="line-num">2</span><span class="line-content">    chave = A[j]</span></div>
<div class="code-line"><span class="line-num">3</span><span class="line-content">    <span class="cmt">// Inserir A[j] na sequência ordenada A[1 .. j - 1].</span></span></div>
<div class="code-line"><span class="line-num">4</span><span class="line-content">    i = j - 1</span></div>
<div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">while</span> i &gt; 0 <span class="kw">e</span> A[i] &gt; chave</span></div>
<div class="code-line"><span class="line-num">6</span><span class="line-content">        A[i + 1] = A[i]</span></div>
<div class="code-line"><span class="line-num">7</span><span class="line-content">        i = i - 1</span></div>
<div class="code-line"><span class="line-num">8</span><span class="line-content">    A[i + 1] = chave</span></div>
</div>
</div>

<h3>2. Invariantes de Laço e a Prova de Corretude da Ordenação por Inserção</h3>
<p>Na Figura 2.2 do livro ($A = \langle 5, 2, 4, 6, 1, 3 \rangle$), o índice $j$ indica a "carta atual" que está sendo retirada da mesa para ser inserida na mão esquerda. No início de cada iteração do laço <code>for</code> externo (indexado por $j$), o subarranjo $A[1 \dots j - 1]$ corresponde à mão atualmente ordenada, e o subarranjo restante $A[j + 1 \dots n]$ corresponde à pilha de cartas ainda sobre a mesa. Mais do que estar ordenado, $A[1 \dots j - 1]$ contém exatamente os elementos que estavam <em>originalmente</em> nas posições $1$ a $j - 1$ (isto é, não perdemos nem inventamos números!). Enunciamos isso formalmente:</p>

<div class="canonical-callout invariant">
<span class="callout-tag">[ INVARIANTE DE LAÇO • INSERTION-SORT (p. 27) ]</span>
<p><strong>Enunciado do Invariante:</strong> <em>"No início de cada iteração para o laço <code>for</code> das linhas 1–8, o subarranjo $A[1 \dots j - 1]$ consiste nos elementos que estavam originalmente em $A[1 \dots j - 1]$, porém em sequência ordenada."</em></p>
<div class="invariant-triad">
<div class="triad-card">
<div class="triad-card-title">1. Inicialização</div>
<p>Devemos mostrar que o invariante vale antes da primeira iteração do laço, quando $j = 2$ (logo após a atribuição inicial $j=2$ e antes do primeiro teste $j \le A.\text{comprimento}$). Nesse instante, o subarranjo $A[1 \dots j-1]$ é $A[1 \dots 1]$, que consiste apenas no único elemento $A[1]$. Ele é o elemento original de $A[1]$ e um único elemento está trivialmente ordenado. Logo, o invariante é válido.</p>
</div>
<div class="triad-card">
<div class="triad-card-title">2. Manutenção</div>
<p>Devemos mostrar que se o invariante é verdadeiro antes de uma iteração, permanece verdadeiro antes da próxima. O corpo do laço desloca $A[j-1], A[j-2], \dots$ uma posição para a direita (linhas 5–7) até achar a posição correta para $A[j]$ e ali insere a <code>chave</code> (linha 8). Nesse ponto, $A[1 \dots j]$ contém os elementos originais de $A[1 \dots j]$ ordenados. Quando o laço <code>for</code> incrementa $j$ para a próxima iteração, o novo $A[1 \dots j-1]$ preserva exatamente o invariante.</p>
</div>
<div class="triad-card">
<div class="triad-card-title">3. Término</div>
<p>Examinamos o que ocorre quando o laço termina. A condição que força o término do laço <code>for</code> é $j > A.\text{comprimento} = n$. Como cada iteração aumenta $j$ de $1$, temos exatamente $j = n + 1$ na saída. Substituindo $j = n + 1$ no enunciado do invariante de laço, obtemos que o subarranjo $A[1 \dots (n+1)-1] = A[1 \dots n]$ consiste nos elementos originalmente contidos em $A[1 \dots n]$, mas em sequência ordenada. Como $A[1 \dots n]$ é o arranjo inteiro, o algoritmo é correto!</p>
</div>
</div>
</div>

<h3>3. Todas as Convenções do Pseudocódigo CLRS (pp. 28–29)</h3>
<p>Para ler e escrever algoritmos em todo o curso sem ambiguidades, os autores estabelecem 11 convenções de pseudocódigo essenciais que você deve dominar:</p>
<ol>
<li><strong>Recuo (indentação) define estrutura de bloco:</strong> Eliminam-se palavras como <code>begin</code> e <code>end</code>. Em instruções <code>if-else</code>, o <code>else</code> fica alinhado no mesmo recuo do <code>if</code> correspondente, e testes encadeados usam <code>elseif</code>.</li>
<li><strong>Retenção do valor do contador de laço após a saída:</strong> Ao contrário de certas declarações locais em C++ ou Java, no pseudocódigo CLRS <strong>o contador do laço mantém o valor que primeiro violou o limite do laço</strong>. Por isso, após <code>for j = 2 to n</code> terminar normalmente, $j$ vale rigorosamente $n + 1$.</li>
<li><strong>Palavras-chave <code>to</code>, <code>downto</code> e <code>by</code>:</strong> <code>to</code> incrementa o contador de $1$ em $1$; <code>downto</code> decrementa de $1$ em $1$; incrementos maiores usam a cláusula <code>by</code>.</li>
<li><strong>Comentários e atribuição múltipla:</strong> <code>//</code> inicia um comentário de fim de linha. A instrução <code>i = j = e</code> equivale a <code>j = e</code> seguido de <code>i = j</code>.</li>
<li><strong>Variáveis locais:</strong> Todas as variáveis (como <code>i</code>, <code>j</code>, <code>chave</code>) são locais ao procedimento, salvo menção explícita em contrário.</li>
<li><strong>Acesso a arranjos e subarranjos:</strong> <code>A[i]</code> acessa o $i$-ésimo elemento, e <code>A[1 .. j]</code> denota o subarranjo de $A[1]$ até $A[j]$.</li>
<li><strong>Objetos, atributos em cascata e ponteiros:</strong> Objetos possuem atributos acessados por ponto (como <code>A.comprimento</code>). A notação em cascata <code>x.f.g</code> significa <code>(x.f).g</code>. Uma variável representando um objeto ou arranjo é um <strong>ponteiro</strong> para seus dados: fazer <code>y = x</code> faz com que <code>x</code> e <code>y</code> apontem para o mesmo objeto; alterar <code>x.f = 3</code> imediatamente torna <code>y.f = 3</code>! Se um ponteiro não aponta para objeto algum, recebe o valor especial <code>NIL</code>.</li>
<li><strong>Passagem de parâmetros por valor (com ponteiros copiados para objetos/arranjos):</strong> Procedimentos recebem cópias de seus parâmetros. Se $x$ é parâmetro e o procedimento faz $x = y$, o chamador não vê essa reatribuição da variável $x$; porém, se o procedimento faz <code>x.f = 3</code> ou <code>A[i] = 5</code>, a modificação no objeto apontado ou nos elementos do arranjo <strong>é visível</strong> para o chamador!</li>
<li><strong>Instrução <code>return</code> com múltiplos valores:</strong> Diferente de muitas linguagens tradicionais, uma única instrução <code>return</code> no CLRS pode devolver múltiplos valores simultaneamente ao chamador.</li>
<li><strong>Operadores booleanos <code>e</code> / <code>ou</code> com curto-circuito (<em>short-circuiting</em>):</strong> Em <code>x e y</code>, avaliamos primeiro <code>x</code>; se <code>x</code> for <code>FALSE</code>, <strong>não avaliamos <code>y</code></strong>! Isso é vital na linha 5 do <code>INSERTION-SORT</code> (<code>while i > 0 e A[i] > chave</code>): quando $i = 0$, o teste $i > 0$ dá <code>FALSE</code> e o curto-circuito impede a tentativa ilegal de acessar a posição inexistente $A[0]$! Da mesma forma, protege expressões como <code>x ≠ NIL e x.f == y</code>.</li>
<li><strong>Palavra-chave <code>error</code>:</strong> Indica que as pré-condições da chamada foram violadas; o tratamento cabe ao procedimento chamador.</li>
</ol>

<div id="workbench-insertion-mount"></div>
