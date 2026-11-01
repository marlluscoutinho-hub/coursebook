<h3>1. O Modelo de Computação RAM (Random-Access Machine)</h3>
<p>Analisar um algoritmo significa prever os recursos que ele consome (ocasionalmente memória, largura de banda ou hardware, mas primordialmente o <strong>tempo de computação</strong>). Para isso, adotamos como tecnologia de implementação o modelo genérico de <strong>Máquina de Acesso Aleatório (RAM)</strong> com um único processador:</p>
<ul>
<li><strong>Execução estritamente sequencial:</strong> As instruções são executadas uma após a outra, sem operações concorrentes (com exceção do Capítulo 27, que estuda paralelismo).</li>
<li><strong>Instruções primitivas de tempo constante:</strong> O modelo RAM contém apenas instruções realistas presentes em processadores reais — <strong>aritméticas</strong> (soma, subtração, multiplicação, divisão, resto, piso, teto), <strong>movimentação de dados</strong> (carregar, armazenar, copiar) e <strong>controle</strong> (desvio condicional/incondicional, chamada e retorno de sub-rotinas). Cada uma dessas instruções leva um <strong>tempo constante</strong>. Não existe uma "instrução mágica de ordenação" em um único passo!</li>
<li><strong>Tipos de dados e limite no tamanho da palavra:</strong> Os tipos são inteiros e números em ponto flutuante. Para uma entrada de tamanho $n$, assumimos que cada palavra de dados tem tamanho limitado a $c \lg n$ bits (para uma constante $c \ge 1$). <em>Por que $c \ge 1$?</em> Para que uma palavra possa armazenar o valor $n$ e indexar qualquer um dos $n$ elementos da entrada. <em>Por que $c$ deve ser constante?</em> Porque se uma única palavra pudesse crescer arbitrariamente, poderíamos empacotar toda a entrada dentro de uma única palavra gigante e operar sobre ela em tempo constante, o que seria fisicamente absurdo!</li>
<li><strong>A área cinzenta da exponenciação e o deslocamento de bits (<em>shift left</em>):</strong> Calcular $x^y$ para reais quaisquer não é uma operação de tempo constante. Entretanto, deslocar os bits de um inteiro $k$ posições para a esquerda equivale a multiplicar por $2^k$. Assim, calcular $2^k$ deslocando o inteiro $1$ em $k$ posições para a esquerda <strong>é tratado como uma operação de tempo constante</strong> desde que $k$ não exceda o número de bits de uma palavra do computador.</li>
<li><strong>Hierarquia de memória:</strong> O modelo RAM padrão não modela caches L1/L2/L3 nem paginação em memória virtual (que serão tratados em modelos específicos, como Árvores B no Capítulo 18).</li>
</ul>

<h3>2. Tamanho da Entrada e Tempo de Execução</h3>
<ul>
<li><strong>Tamanho da entrada:</strong> Depende do problema. Para ordenação ou transformadas de Fourier, é o <strong>número de itens $n$</strong>. Para multiplicação de dois inteiros ou testes de primalidade, é o <strong>número total de bits</strong> necessários para representar a entrada em binário. Para algoritmos em grafos, é descrito por <strong>dois parâmetros</strong>: o número de vértices $|V|$ e o número de arestas $|E|$.</li>
<li><strong>Tempo de execução $T(n)$:</strong> É o número de operações primitivas ("passos") executadas. Assumimos que cada execução da linha $i$ do pseudocódigo custa um tempo constante $c_i$ (e comentários custam $0$). Nota sutil: <em>chamar</em> uma sub-rotina custa tempo constante, mas <em>executar</em> a sub-rotina chamada tem seu próprio custo contabilizado separadamente.</li>
</ul>

<h3>3. Análise Linha a Linha do <code>INSERTION-SORT</code></h3>
<p>Seja $t_j$ o número de vezes que o teste do laço <code>while</code> na linha 5 é executado para um determinado valor de $j \in \{2, 3, \dots, n\}$. Como um laço que termina normalmente avalia seu teste uma vez a mais que o corpo, as linhas 6 e 7 executam exatamente $t_j - 1$ vezes para cada $j$:</p>

<div class="canonical-table-wrap">
<table class="canonical-table">
<thead>
<tr>
<th>Linha</th>
<th>Instrução de Pseudocódigo</th>
<th>Custo</th>
<th>Vezes Executada</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td><code>for j = 2 to A.comprimento</code></td>
<td>$c_1$</td>
<td>$n$</td>
</tr>
<tr>
<td>2</td>
<td><code>&nbsp;&nbsp;chave = A[j]</code></td>
<td>$c_2$</td>
<td>$n - 1$</td>
</tr>
<tr>
<td>3</td>
<td><code>&nbsp;&nbsp;// Inserir A[j] na sequência ordenada A[1 .. j - 1].</code></td>
<td>$0$</td>
<td>$n - 1$</td>
</tr>
<tr>
<td>4</td>
<td><code>&nbsp;&nbsp;i = j - 1</code></td>
<td>$c_4$</td>
<td>$n - 1$</td>
</tr>
<tr>
<td>5</td>
<td><code>&nbsp;&nbsp;while i &gt; 0 e A[i] &gt; chave</code></td>
<td>$c_5$</td>
<td>$\sum_{j=2}^{n} t_j$</td>
</tr>
<tr>
<td>6</td>
<td><code>&nbsp;&nbsp;&nbsp;&nbsp;A[i + 1] = A[i]</code></td>
<td>$c_6$</td>
<td>$\sum_{j=2}^{n} (t_j - 1)$</td>
</tr>
<tr>
<td>7</td>
<td><code>&nbsp;&nbsp;&nbsp;&nbsp;i = i - 1</code></td>
<td>$c_7$</td>
<td>$\sum_{j=2}^{n} (t_j - 1)$</td>
</tr>
<tr>
<td>8</td>
<td><code>&nbsp;&nbsp;A[i + 1] = chave</code></td>
<td>$c_8$</td>
<td>$n - 1$</td>
</tr>
</tbody>
</table>
</div>

<p>Somando os produtos das colunas <em>Custo</em> e <em>Vezes</em>, obtemos a equação geral do tempo de execução $T(n)$ da ordenação por inserção:</p>
$$T(n) = c_1 n + c_2(n - 1) + c_4(n - 1) + c_5 \sum_{j=2}^{n} t_j + c_6 \sum_{j=2}^{n} (t_j - 1) + c_7 \sum_{j=2}^{n} (t_j - 1) + c_8(n - 1)$$

<h4>Caso 1: Melhor Caso (Arranjo já ordenado inicialmente)</h4>
<p>Se o arranjo já está ordenado ($A[1] \le A[2] \le \dots \le A[n]$), então para cada $j = 2, 3, \dots, n$, logo na primeira verificação da linha 5 (com $i = j - 1$), constatamos que $A[i] \le \text{chave}$. Assim, <strong>$t_j = 1$ para todo $j$</strong>, e $t_j - 1 = 0$ (o corpo das linhas 6 e 7 nunca é executado!). Substituindo $t_j = 1$:</p>
$$T(n) = c_1 n + c_2(n - 1) + c_4(n - 1) + c_5(n - 1) + c_8(n - 1) = (c_1 + c_2 + c_4 + c_5 + c_8)n - (c_2 + c_4 + c_5 + c_8)$$
<p>Podemos escrever esse tempo na forma $T(n) = an + b$ para constantes $a$ e $b$ que dependem apenas dos custos $c_i$. Portanto, no melhor caso, o tempo de execução é uma <strong>função linear de $n$</strong>, isto é, $\Theta(n)$.</p>

<h4>Caso 2: Pior Caso (Arranjo ordenado em ordem inversa / decrescente)</h4>
<p>Se o arranjo está em ordem estritamente decrescente, cada novo elemento $A[j]$ é menor que todos os elementos de $A[1 \dots j - 1]$ e precisa ser comparado com todos os $j - 1$ elementos anteriores antes que o teste termine quando $i = 0$. Portanto, <strong>$t_j = j$ para todo $j = 2, 3, \dots, n$</strong>. Usando as identidades $\sum_{j=2}^{n} j = \frac{n(n+1)}{2} - 1$ e $\sum_{j=2}^{n} (j - 1) = \frac{n(n-1)}{2}$:</p>
$$T(n) = c_1 n + c_2(n - 1) + c_4(n - 1) + c_5\left(\frac{n(n+1)}{2} - 1\right) + c_6\left(\frac{n(n-1)}{2}\right) + c_7\left(\frac{n(n-1)}{2}\right) + c_8(n - 1)$$
<p>Agrupando os termos em potências de $n$:</p>
$$T(n) = \left(\frac{c_5}{2} + \frac{c_6}{2} + \frac{c_7}{2}\right)n^2 + \left(c_1 + c_2 + c_4 + \frac{c_5}{2} - \frac{c_6}{2} - \frac{c_7}{2} + c_8\right)n - (c_2 + c_4 + c_5 + c_8)$$
<p>Podemos expressar esse tempo de pior caso como $T(n) = an^2 + bn + c$ para constantes $a, b, c$: trata-se de uma <strong>função quadrática de $n$</strong>.</p>

<h3>4. Por Que Nos Concentramos no Pior Caso? (As 3 Razões de Cormen et al.)</h3>
<ol>
<li><strong>Garantia de limite superior absoluto:</strong> O tempo de pior caso estabelece um teto garantido — sabemos com certeza matemática que o algoritmo <em>jamais</em> demorará mais do que isso para qualquer entrada de tamanho $n$.</li>
<li><strong>O pior caso ocorre com frequência na prática:</strong> Em sistemas de bancos de dados, por exemplo, o pior caso de uma busca ocorre justamente quando a informação procurada <em>não está presente</em> no banco, uma situação corriqueira em muitas aplicações reais.</li>
<li><strong>O "caso médio" é frequentemente tão ruim quanto o pior caso:</strong> Suponha que escolhamos $n$ números aleatoriamente para o <code>INSERTION-SORT</code>. Em média, metade dos elementos em $A[1 \dots j - 1]$ é maior que $A[j]$ e metade é menor; logo, percorremos metade do subarranjo e $t_j \approx j/2$. Ao substituir $t_j = j/2$ nos somatórios, o termo dominante continua sendo proporcional a $n^2$ — ou seja, o caso médio da ordenação por inserção também é uma função quadrática $\Theta(n^2)$, exatamente como o pior caso!</li>
</ol>

<h3>5. As Três Abstrações Simplificadoras até a Ordem de Crescimento $\Theta$</h3>
<p>Repare na progressão de abstrações que construímos:</p>
<ol>
<li>Primeiro, abstraímos os tempos físicos em microssegundos substituindo-os pelas constantes de instrução $c_i$;</li>
<li>Segundo, agrupamos as combinações de $c_i$ nos coeficientes agregados $a, b, c$ em $T(n) = an^2 + bn + c$;</li>
<li>Terceiro, concentramo-nos na <strong>ordem de crescimento</strong> (taxa de crescimento): descartamos os termos de ordem mais baixa ($bn + c$) e ignoramos o coeficiente constante do termo líder ($a$), retendo apenas o fator principal $n^2$. Escrevemos assim que a ordenação por inserção possui tempo de execução de pior caso <strong>$\Theta(n^2)$</strong> ("teta de $n$ ao quadrado") e tempo de melhor caso <strong>$\Theta(n)$</strong>.</li>
</ol>
