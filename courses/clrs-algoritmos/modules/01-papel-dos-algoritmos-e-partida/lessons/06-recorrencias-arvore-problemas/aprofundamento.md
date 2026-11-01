<h3>1. A Recorrência Geral dos Algoritmos de Divisão e Conquista</h3>
<p>Quando um algoritmo contém chamadas recursivas a si mesmo, seu tempo de execução $T(n)$ é descrito naturalmente por uma <strong>equação de recorrência</strong> (ou simplesmente <strong>recorrência</strong>), que expressa o tempo total para um problema de tamanho $n$ em função do tempo para entradas menores.</p>
<p>Suponha que um algoritmo de divisão e conquista divida o problema em <strong>$a$ subproblemas</strong>, cada um com tamanho igual a <strong>$1/b$</strong> do tamanho original (no <code>MERGE-SORT</code>, temos $a = 2$ e $b = 2$, mas em muitos algoritmos $a \ne b$). Se o tamanho for pequeno o bastante ($n \le c$ para uma constante $c$), a solução direta leva tempo constante $\Theta(1)$. Caso contrário, sejam $D(n)$ o tempo para <strong>dividir</strong> o problema e $C(n)$ o tempo para <strong>combinar</strong> as soluções. Obtemos a recorrência geral:</p>
$$T(n) = \begin{cases} \Theta(1) & \text{se } n \le c, \\ aT(n/b) + D(n) + C(n) & \text{caso contrário.} \end{cases}$$

<h3>2. Análise da Ordenação por Intercalação e a Árvore de Recursão (Figura 2.5)</h3>
<p>Para analisar o pior caso de <code>MERGE-SORT</code> sobre $n$ números (assumindo inicialmente que $n$ é uma potência exata de $2$), examinamos os três passos quando $n > 1$:</p>
<ul>
<li><strong>Divisão:</strong> Calcula apenas a média $q = \lfloor (p + r)/2 \rfloor$, o que leva tempo constante: $D(n) = \Theta(1)$.</li>
<li><strong>Conquista:</strong> Resolve recursivamente dois subproblemas de tamanho $n/2$, contribuindo com $2T(n/2)$.</li>
<li><strong>Combinação:</strong> O procedimento <code>MERGE</code> sobre $n$ elementos leva tempo linear: $C(n) = \Theta(n)$.</li>
</ul>
<p>Somando $D(n) + C(n) = \Theta(1) + \Theta(n) = \Theta(n)$, obtemos a recorrência (2.1) do livro para o <code>MERGE-SORT</code>:</p>
$$T(n) = \begin{cases} \Theta(1) & \text{se } n = 1, \\ 2T(n/2) + \Theta(n) & \text{se } n > 1. \end{cases}$$
<p>Para demonstrar visual e algebricamente por que a solução dessa recorrência é $T(n) = \Theta(n \lg n)$ sem precisar ainda do Teorema Mestre (que será visto no Capítulo 4), reescrevemos a recorrência explícita (2.2) usando uma constante $c > 0$ que representa o tempo de resolver um problema de tamanho $1$ bem como o tempo por elemento nas fases de divisão e combinação:</p>
$$T(n) = \begin{cases} c & \text{se } n = 1, \\ 2T(n/2) + cn & \text{se } n > 1. \end{cases}$$

<div class="canonical-callout theorem">
<span class="callout-tag">[ CONSTRUÇÃO E SOMA DA ÁRVORE DE RECURSÃO • FIGURA 2.5 (pp. 40–41) ]</span>
<p>Expandimos $T(n)$ nível por nível em uma <strong>árvore de recursão</strong>:</p>
<ul>
<li><strong>Nível $0$ (Raiz):</strong> $1 = 2^0$ nó de tamanho $n$, com custo local $cn$. Suas duas subárvores são $T(n/2)$ e $T(n/2)$.</li>
<li><strong>Nível $1$:</strong> $2 = 2^1$ nós, cada um de tamanho $n/2$ e custo $c(n/2)$. Soma do nível $1$: $c(n/2) + c(n/2) = cn$.</li>
<li><strong>Nível $2$:</strong> $4 = 2^2$ nós, cada um de tamanho $n/4$ e custo $c(n/4)$. Soma do nível $2$: $4 \cdot c(n/4) = cn$.</li>
<li><strong>Nível geral $i$ abaixo do topo:</strong> Possui exatamente $2^i$ nós, cada um resolvendo um subproblema de tamanho $n/2^i$ e contribuindo com um custo $c(n/2^i)$. Logo, o custo total do nível $i$ é:
$$2^i \cdot c\left(\frac{n}{2^i}\right) = cn$$
Ou seja, <strong>todos os níveis da árvore têm exatamente o mesmo custo total $cn$!</strong></li>
<li><strong>Nível inferior (Folhas):</strong> Ocorre quando o tamanho do subproblema chega a $n/2^i = 1 \iff 2^i = n \iff i = \lg n$. Há $n$ folhas de tamanho $1$, cada uma custando $c$, somando $n \cdot c = cn$.</li>
<li><strong>Número total de níveis:</strong> Como $i$ vai de $0$ até $\lg n$, a árvore possui exatamente <strong>$\lg n + 1$ níveis</strong> (provado por indução sobre $n = 2^i$: para $n=1$, $\lg 1 + 1 = 1$ nível; passando de $2^i$ para $2^{i+1}$ folhas, adiciona-se $1$ nível, resultando em $(i+1)+1 = \lg 2^{i+1} + 1$).</li>
<li><strong>Soma global de todos os níveis:</strong> Multiplicando o custo por nível ($cn$) pelo número de níveis ($\lg n + 1$):
$$T(n) = cn(\lg n + 1) = cn \lg n + cn = \Theta(n \lg n).$$</li>
</ul>
</div>

<h3>3. Aprofundamento nos Problemas Canônicos do Final do Capítulo 2 (pp. 42–45)</h3>
<p>O Capítulo 2 encerra com quatro problemas fundamentais que conectam a teoria que você acabou de estudar a técnicas avançadas de engenharia de algoritmos:</p>
<ol>
<li><strong>Problema 2-1 (Adensando as folhas da recursão — Híbrido <code>MERGE-SORT</code> + <code>INSERTION-SORT</code>):</strong> Como a ordenação por inserção possui fatores constantes menores que a ordenação por intercalação para entradas pequenas, implementações reais de alto desempenho (como o <em>Timsort</em> e bibliotecas padrão) param de dividir o <code>MERGE-SORT</code> quando os subarranjos atingem tamanho $k$, ordenam as $n/k$ sublistas de tamanho $k$ usando <code>INSERTION-SORT</code> em tempo $\Theta\left(\frac{n}{k} \cdot k^2\right) = \Theta(nk)$, e depois intercalam essas $n/k$ sublistas em $\lg(n/k)$ níveis de fusão custando $\Theta(n \lg(n/k))$. O tempo total é $\Theta(nk + n \lg(n/k))$, que preserva a complexidade ótima $\Theta(n \lg n)$ desde que escolhamos $k = O(\lg n)$!</li>
<li><strong>Problema 2-2 (Corretude e Análise do <code>BUBBLESORT</code>):</strong> O algoritmo <code>BUBBLESORT</code> percorre o arranjo com um laço externo <code>for i = 1 to A.comprimento - 1</code> e um laço interno <code>for j = A.comprimento downto i + 1</code> trocando $A[j]$ com $A[j-1]$ se $A[j] < A[j-1]$. Seu invariante do laço interno garante que, ao fim da iteração $i$, o menor elemento de $A[i \dots n]$ "flutuou" para a posição $A[i]$. Seu tempo de pior caso (e de melhor caso na versão sem flag) é $\Theta(n^2)$, mas com constantes piores que o <code>INSERTION-SORT</code> porque realiza trocas completas (3 atribuições) em vez de deslocamentos simples.</li>
<li><strong>Problema 2-3 (Regra de Horner para Avaliação Polinomial em $\Theta(n)$):</strong> Para avaliar $P(x) = \sum_{k=0}^{n} a_k x^k = a_0 + x(a_1 + x(a_2 + \dots + x(a_{n-1} + x a_n)\dots))$, o algoritmo ingênuo que calcula cada potência $x^k$ do zero gasta $\Theta(n^2)$ multiplicações. A <strong>Regra de Horner</strong> (<code>y = 0; for i = n downto 0: y = a_i + x · y</code>) mantém o invariante $y = \sum_{k=0}^{n-(i+1)} a_{k+i+1} x^k$ e avalia qualquer polinômio de grau $n$ em tempo linear ótimo <strong>$\Theta(n)$</strong>!</li>
<li><strong>Problema 2-4 (Inversões em um Arranjo):</strong> Dado um arranjo $A[1 \dots n]$, um par de índices $(i, j)$ é chamado de uma <strong>inversão</strong> se $i < j$ e $A[i] > A[j]$ (isto é, dois elementos fora da ordem natural). Por exemplo, em $\langle 2, 3, 8, 6, 1 \rangle$, existem exatamente $5$ inversões: $(1,5), (2,5), (3,4), (3,5)$ e $(4,5)$ (correspondentes aos pares de valores $(2,1), (3,1), (8,6), (8,1)$ e $(6,1)$). Um arranjo em ordem decrescente $\langle n, n-1, \dots, 1 \rangle$ possui o número máximo possível de inversões: $\binom{n}{2} = \frac{n(n-1)}{2}$. Mais ainda: cada deslocamento na linha 6 do <code>INSERTION-SORT</code> elimina exatamente uma inversão, de modo que o tempo de execução do <code>INSERTION-SORT</code> sobre uma entrada com $I$ inversões é exatamente $\Theta(n + I)$! E modificando o passo <code>MERGE</code> do <code>MERGE-SORT</code> (somando $n_1 - i + 1$ ao contador de inversões toda vez que $R[j] < L[i]$), podemos contar todas as inversões de qualquer arranjo em tempo $\Theta(n \lg n)$!</li>
</ol>
