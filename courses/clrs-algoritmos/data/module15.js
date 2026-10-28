/* ==========================================================================
   CODEX — MÓDULO 15: CORRESPONDÊNCIA DE CADEIAS E GEOMETRIA COMPUTACIONAL
   Capítulos 32 e 33 (pp. 796–851)
   Obra: Algoritmos: Teoria e Prática (3ª Edição) — Cormen, Leiserson, Rivest e Stein
   ========================================================================== */

(function () {
  const revisao = {
  "subtitle": "Da Busca Eficiente de Padrões em Cadeias (Rabin-Karp com Hash Rolante, Autômatos Finitos e Knuth-Morris-Pratt com Função de Prefixo π) às Primitivas Geométricas Robustas (Produtos Vetoriais sem Divisão), Varredura de Linha (Sweep-Line), Envoltória Convexa (Graham e Jarvis) e Par de Pontos Mais Próximos",
  "intro": "O Módulo 15 aborda dois dos tópicos mais elegantes e práticos da ciência da computação contemporânea, correspondentes aos Capítulos 32 (Correspondência de Cadeias, pp. 796–824) e 33 (Geometria Computacional, pp. 825–851) de Algoritmos: Teoria e Prática (3ª Edição) de Cormen, Leiserson, Rivest e Stein. O Capítulo 32 formaliza o clássico problema da localização de ocorrências de um padrão P[1..m] dentro de um texto T[1..n] sobre um alfabeto finito Σ. Partindo do algoritmo ingênuo em tempo O((n-m+1)m), o texto desenvolve o engenhoso algoritmo de Rabin-Karp — que converte cadeias em números inteiros na base d módulo um primo grande q, atualizando um hash rolante em tempo O(1) via regra de Horner —, constrói autômatos finitos determinísticos com função de sufixo σ em busca linear estrita Θ(n), e culmina no algoritmo de Knuth-Morris-Pratt (KMP), cuja função de prefixo π[1..m] codifica a automorfia do próprio padrão em tempo amortizado Θ(m), viabilizando varreduras de texto em tempo estrito Θ(n) sem jamais retroceder o índice de leitura. Em sequência, o Capítulo 33 inaugura a geometria computacional sobre uma premissa fundamental: a eliminação total de divisões e de erros de ponto flutuante em favor de produtos vetoriais bidimensionais exatos com aritmética inteira. A partir do cálculo da área orientada de paralelogramos, definem-se as sub-rotinas DIRECTION, ON-SEGMENT e SEGMENTS-INTERSECT em O(1). Sobre esses alicerces estruturam-se o paradigma de varredura de linha (sweep-line) em ANY-SEGMENTS-INTERSECT (tempo O(n lg n)), a construção exata da Envoltória Convexa pelos algoritmos GRAHAM-SCAN (ordenação angular e manutenção de pilha em tempo ótimo Θ(n lg n)) e Marcha de Jarvis (técnica do embrulho de presente sensível à saída em tempo O(nh)), finalizando com o algoritmo ótimo de Divisão e Conquista para localização do Par de Pontos Mais Próximos no plano em Θ(n lg n), fundamentado no Lema Geométrico de Densidade de no máximo 7 comparações na faixa de largura 2δ.",
  "pillars": [
    {
      "tag": "[ PILAR 01 • O PROBLEMA DA CORRESPONDÊNCIA DE CADEIAS E DESLOCAMENTOS VÁLIDOS ]",
      "title": "Do Algoritmo Ingênuo O((n - m + 1)m) ao Hash Rolante de Rabin-Karp em O(1)",
      "body": "\n          <p>O problema da correspondência de cadeias formaliza a busca de todas as ocorrências de um padrão $P[1 \\dots m]$ em um texto $T[1 \\dots n]$, ambos formados por caracteres de um alfabeto finito $\\Sigma$. Dizemos que $P$ ocorre com <strong>deslocamento $s$</strong> (onde $0 \\le s \\le n - m$) se $T[s+1 \\dots s+m] = P[1 \\dots m]$; nesse caso, $s$ é denominado um <em>deslocamento válido</em>.</p>\n          <ul>\n            <li><strong>O Custo do Algoritmo Ingênuo (pp. 797–800):</strong> Ao testar sistematicamente cada um dos $n - m + 1$ deslocamentos possíveis por comparação direta caractere a caractere, o algoritmo ingênuo atinge pior caso $\\Theta((n - m + 1)m)$, como no caso patológico $T = a^n$ e $P = a^m$. Seu pré-processamento é nulo ($0$), mas o retrocesso implícito no texto ao reiniciar cada tentativa causa grande redundância computacional.</li>\n            <li><strong>A Ideia Algébrica de Rabin-Karp (pp. 800–805):</strong> Rabin e Karp interpretaram cada cadeia de comprimento $m$ como um número inteiro de $m$ dígitos na base $d = |\\Sigma|$. Utilizando a <strong>regra de Horner</strong>, o valor numérico $p$ do padrão e o valor $t_0$ da primeira janela do texto $T[1 \\dots m]$ são calculados em tempo $\\Theta(m)$.</li>\n            <li><strong>O Hash Rolante Modular:</strong> Para evitar estouro de precisão com inteiros gigantescos, todos os cálculos são executados módulo um número primo grande $q$ tal que $d \\cdot q$ caiba em uma única palavra de máquina. Dado o valor $t_s$, o valor da janela seguinte $t_{s+1}$ é obtido em <strong>tempo constante $O(1)$</strong> através da relação de recorrência:\n              $$t_{s+1} = \\Big(d\\big(t_s - T[s+1]h\\big) + T[s+m+1]\\Big) \\bmod q$$\n              onde $h \\equiv d^{m-1} \\pmod q$ representa o peso do dígito mais significativo da janela.</li>\n            <li><strong>Acertos Espúrios e Análise de Desempenho:</strong> Quando $t_s \\equiv p \\pmod q$, pode ocorrer um <em>acerto espúrio</em> se $T[s+1 \\dots s+m] \\neq P[1 \\dots m]$. Embora o pior caso permaneça $\\Theta((n - m + 1)m)$ se todos os deslocamentos colidirem, sob a hipótese de distribuição uniforme o tempo esperado é $O(n + m(v + n/q))$. Escolhendo $q \\ge m$, se o número de ocorrências válidas $v$ for $O(1)$, o tempo esperado de casamento é puramente linear $\\mathbf{O(n + m)}$.</li>\n          </ul>\n            "
    },
    {
      "tag": "[ PILAR 02 • AUTÔMATOS FINITOS E O ALGORITMO DE KNUTH-MORRIS-PRATT (KMP) ]",
      "title": "Eliminação de Retrocesso no Texto via Função de Sufixo σ e Função de Prefixo π em Θ(m + n)",
      "body": "\n          <p>O objetivo supremo na busca de padrões é inspecionar cada caractere do texto $T[i]$ <strong>exatamente uma vez</strong>, com o índice $i$ avançando de $1$ até $n$ sem jamais retroceder, processando o texto como um fluxo contínuo (<em>stream</em>):</p>\n          <ul>\n            <li><strong>Autômatos Finitos Determinísticos (pp. 808–815):</strong> Definidos pela 5-upla $(Q, q_0, A, \\Sigma, \\delta)$, onde $Q = \\{0, 1, \\dots, m\\}$, $q_0 = 0$ e $A = \\{m\\}$. A transição de estados é governada pela <strong>função de sufixo</strong> $\\sigma(x) = \\max \\{ k : P_k \\sqsupset x \\}$, estabelecendo $\\delta(q, a) = \\sigma(P_q a)$. O algoritmo <code>FINITE-AUTOMATON-MATCHER</code> executa a busca no tempo estritamente linear $\\Theta(n)$, mas o pré-processamento para construir a tabela de transição consome tempo $O(m^3 |\\Sigma|)$ e espaço $\\Theta(m |\\Sigma|)$, tornando-se impraticável para alfabetos extensos.</li>\n            <li><strong>A Genialidade de Knuth-Morris-Pratt (pp. 815–824):</strong> KMP percebeu que não é necessário computar a matriz de transição para todos os caracteres de $\\Sigma$. Quando um descasamento ocorre no padrão após casar $q$ caracteres, a história do texto já lido coincide exatamente com $P_q$. Toda a informação de salto necessária está codificada na <strong>função de prefixo $\\pi[1 \\dots m]$</strong>, que mapeia cada $q$ no comprimento do mais longo prefixo próprio de $P$ que também é sufixo de $P_q$:\n              $$\\pi[q] = \\max \\{ k : k < q \\text{ e } P_k \\sqsupset P_q \\}$$</li>\n            <li><strong>Análise Amortizada por Potencial:</strong> Em <code>COMPUTE-PREFIX-FUNCTION(P)</code>, a comparação de $P$ contra si mesmo computa $\\pi$ em tempo $\\Theta(m)$. Através da função de potencial $\\Phi = k \\ge 0$, prova-se que o laço interno <code>while</code> executa no máximo $m-1$ decrementos no total. De forma idêntica, <code>KMP-MATCHER(T, P)</code> executa em tempo de busca $\\Theta(n)$ com potencial $\\Phi = q$, assegurando complexidade total ótima $\\mathbf{\\Theta(m + n)}$ completamente independente do tamanho do alfabeto $|\\Sigma|$!</li>\n          </ul>\n            "
    },
    {
      "tag": "[ PILAR 03 • PRIMITIVAS GEOMÉTRICAS SEM DIVISÃO E TESTES DE INTERSEÇÃO ]",
      "title": "Produtos Vetoriais Bidimensionais, Sentido de Curvas (DIRECTION) e Robustez Numérica em O(1)",
      "body": "\n          <p>A geometria computacional lida com pontos, retas e polígonos no plano $\\mathbb{R}^2$. A representação analítica clássica baseada em inclinações $m = (y_2 - y_1)/(x_2 - x_1)$ é falha em computadores devido a retas verticais ($m = \\infty$) e a erros catastróficos de arredondamento em aritmética de ponto flutuante:</p>\n          <ul>\n            <li><strong>Produto Vetorial no Plano (pp. 825–828):</strong> O produto vetorial de dois vetores $p_1 = (x_1, y_1)$ e $p_2 = (x_2, y_2)$ em relação à origem é definido pelo determinante:\n              $$p_1 \\times p_2 = x_1 y_2 - x_2 y_1$$\n              Geometricamente, corresponde à <em>área orientada (sinalizada) do paralelogramo</em> gerado por $p_1$ e $p_2$. Seu sinal determina a orientação relativa:\n              <ul>\n                <li>Se $p_1 \\times p_2 > 0$, $p_1$ está no sentido horário em relação a $p_2$ (ou $p_2$ faz curva no sentido anti-horário em relação a $p_1$);</li>\n                <li>Se $p_1 \\times p_2 < 0$, $p_1$ está no sentido anti-horário em relação a $p_2$ (curva horária);</li>\n                <li>Se $p_1 \\times p_2 = 0$, os vetores são colineares com a origem.</li>\n              </ul>\n            </li>\n            <li><strong>Sentido de Curvas e a Sub-rotina <code>DIRECTION</code>:</strong> Para três pontos $p_i, p_j, p_k$, a curva formada pelos segmentos dirigidos $\\vec{p_i p_j}$ e $\\vec{p_j p_k}$ é calculada transladando $p_i$ para a origem e avaliando $(p_k - p_i) \\times (p_j - p_i) = (x_k - x_i)(y_j - y_i) - (x_j - x_i)(y_k - y_i)$.</li>\n            <li><strong>Interseção de Segmentos em $O(1)$ sem Divisões:</strong> O procedimento <code>SEGMENTS-INTERSECT(p_1, p_2, p_3, p_4)</code> determina se os segmentos $p_1 p_2$ e $p_3 p_4$ se cruzam verificando se cada segmento ultrapassa a reta suporte do outro (estrangulamento mútuo) ou se uma extremidade repousa sobre o outro segmento colinear via caixa delimitadora <code>ON-SEGMENT</code>. Todo o teste requer apenas multiplicações, subtrações e comparações de inteiros, garantindo estabilidade numérica absoluta!</li>\n          </ul>\n            "
    },
    {
      "tag": "[ PILAR 04 • VARREDURA DE LINHA (SWEEP-LINE), ENVOLTÓRIAS CONVEXAS E PAR MAIS PRÓXIMO ]",
      "title": "Topologia Dinâmica, Algoritmo de Graham em Θ(n lg n), Marcha de Jarvis e Divisão e Conquista",
      "body": "\n          <p>Problemas geométricos globais são resolvidos com máxima eficiência combinando estruturas de dados balanceadas e divisão e conquista:</p>\n          <ul>\n            <li><strong>O Paradigma de Varredura de Linha (pp. 831–838):</strong> Em vez de testar todos os $\\binom{n}{2} = \\Theta(n^2)$ pares de segmentos, o algoritmo <code>ANY-SEGMENTS-INTERSECT</code> move uma linha de varredura vertical imaginária da esquerda para a direita. Mantendo os $2n$ eventos ordenados em $Q$ e a relação de ordem vertical dos segmentos ativos em uma árvore rubro-negra $T$, cada inserção ou remoção testa apenas segmentos verticalmente adjacentes. Se houver cruzamento, os segmentos tornam-se vizinhos imediatos em $T$ antes do ponto de interseção, resolvendo o problema no tempo ótimo $\\mathbf{O(n \\lg n)}$.</li>\n            <li><strong>Envoltória Convexa — <code>GRAHAM-SCAN</code> (pp. 838–844):</strong> Dado um conjunto $Q$ com $n$ pontos, a envoltória convexa $\\text{CH}(Q)$ é o menor polígono convexo que delimita todos os pontos de $Q$. <code>GRAHAM-SCAN</code> ancora a busca no ponto $p_0$ de menor ordenada $y$, ordena os pontos restantes por ângulo polar em relação a $p_0$ em $\\Theta(n \\lg n)$, e processa uma pilha $S$. A cada novo ponto $p_i$, desempilha vértices enquanto a curva com os dois elementos superiores da pilha não for estritamente para a esquerda. Cada ponto entra e sai da pilha no máximo uma vez, resultando em tempo amortizado de pilha $O(n)$ e tempo global $\\mathbf{\\Theta(n \\lg n)}$.</li>\n            <li><strong>Marcha de Jarvis (Embrulho de Presente):</strong> Constrói a envoltória no tempo $\\mathbf{O(nh)}$, onde $h$ é o número de vértices de $\\text{CH}(Q)$. Se $h = o(\\lg n)$, Jarvis supera Graham; se $h = \\Theta(n)$, degrada para $\\Theta(n^2)$.</li>\n            <li><strong>Par de Pontos Mais Próximos por Divisão e Conquista (pp. 845–851):</strong> Divide o conjunto de pontos pela mediana das coordenadas $x$, resolvendo recursivamente as metades esquerda e direita com distância mínima $\\delta = \\min(\\delta_L, \\delta_R)$. Na faixa vertical central de largura $2\\delta$, o <strong>Lema Geométrico de Densidade</strong> garante que cada ponto precisa ser comparado com no máximo <strong>7 outros pontos</strong> na lista ordenada por $y$, resultando na recorrência $T(n) = 2T(n/2) + O(n) = \\mathbf{\\Theta(n \\lg n)}$.</li>\n          </ul>\n            "
    }
  ],
  "checklist": [
    "Compreender a formulação matemática da correspondência de cadeias, a notação de deslocamentos válidos s e as limitações do pior caso Θ((n-m+1)m) do algoritmo ingênuo.",
    "Dominar a regra de Horner e a fórmula de atualização em O(1) do hash rolante modular do algoritmo de Rabin-Karp, incluindo a gestão de acertos espúrios.",
    "Analisar formalmente autômatos finitos de busca de cadeias, a função de sufixo σ, e demonstrar o tempo linear Θ(m + n) de Knuth-Morris-Pratt via análise amortizada da função de prefixo π com potencial Φ.",
    "Calcular e aplicar produtos vetoriais bidimensionais p₁ × p₂ como áreas sinalizadas, determinando o sentido de curvas (DIRECTION) e testando a interseção de segmentos (SEGMENTS-INTERSECT) em O(1) sem divisões.",
    "Executar os algoritmos ANY-SEGMENTS-INTERSECT por varredura de linha (O(n lg n)), GRAHAM-SCAN para envoltória convexa (Θ(n lg n)), Marcha de Jarvis (O(nh)), e provar o limite de 7 comparações na faixa de largura 2δ no problema do par de pontos mais próximos."
  ]
};

  const unidades = [
  {
    "id": "u15-1",
    "code": "UNIDADE 15.1 • CAP. 32 (SEÇÕES 32.1 E 32.2)",
    "pages": "pp. 796–808",
    "title": "32.1 e 32.2 O Algoritmo Ingênuo de Busca de Cadeias e o Algoritmo de RABIN-KARP",
    "content": "\n        <p>O <strong>Capítulo 32</strong> (pp. 796–824) dedica-se ao problema fundamental da <strong>correspondência de cadeias</strong> (<em>string matching</em>): dado um texto $T[1 \\dots n]$ e um padrão $P[1 \\dots m]$, com $m \\le n$, ambos compostos por caracteres de um alfabeto finito $\\Sigma$, determinar todas as ocorrências de $P$ em $T$.</p>\n\n        <h3>1. Seção 32.1 — Notação Formal e o Algoritmo Ingênuo (pp. 796–800)</h3>\n        <h4>1.1 Notações e Conceitos Fundamentais</h4>\n        <p>Adotamos as seguintes convenções formais introduzidas no CLRS:</p>\n        <ul>\n          <li><strong>Alfabeto $\\Sigma$:</strong> Conjunto finito de símbolos (ex.: $\\Sigma = \\{0, 1\\}$ para cadeias binárias, ou o alfabeto latino $\\{a, b, \\dots, z\\}$). Denotamos por $\\Sigma^*$ o conjunto de todas as cadeias de comprimento finito formadas por elementos de $\\Sigma$, incluindo a cadeia vazia $\\varepsilon$ (com comprimento $|\\varepsilon| = 0$).</li>\n          <li><strong>Concatenação e Comprimento:</strong> A concatenação de duas cadeias $x$ e $y$ é denotada por $xy$, cujo comprimento é $|xy| = |x| + |y|$.</li>\n          <li><strong>Prefixos e Sufixos:</strong> Dizemos que $w$ é um <strong>prefixo</strong> da cadeia $x$ (denotado por $w \\sqsubset x$) se $x = wy$ para alguma cadeia $y \\in \\Sigma^*$. Analogamente, $w$ é um <strong>sufixo</strong> de $x$ (denotado por $w \\sqsupset x$) se $x = yw$ para alguma cadeia $y \\in \\Sigma^*$. Se $w \\sqsubset x$ e $w \\neq x$, dizemos que $w$ é um <em>prefixo próprio</em> de $x$ (escrevemos $w \\sqsubset x$ com $|w| < |x|$).</li>\n          <li><strong>Subcadeias e Prefixos Indexados:</strong> Para um texto $T[1 \\dots n]$, denotamos por $T[i \\dots j]$ a subcadeia $T[i] T[i+1] \\dots T[j]$ (onde $1 \\le i \\le j \\le n$). O prefixo constituído pelos primeiros $k$ caracteres é denotado por $T_k = T[1 \\dots k]$ (com $T_0 = \\varepsilon$). De forma análoga, para o padrão $P[1 \\dots m]$, $P_k = P[1 \\dots k]$.</li>\n          <li><strong>Deslocamentos Válidos:</strong> Dizemos que o padrão $P$ ocorre com <strong>deslocamento $s$</strong> no texto $T$ para algum $0 \\le s \\le n - m$ se $0 \\le s \\le n - m$ e:\n            $$T[s+1 \\dots s+m] = P[1 \\dots m]$$\n            Se $P$ ocorre com deslocamento $s$ em $T$, chamamos $s$ de <strong>deslocamento válido</strong>; caso contrário, dizemos que $s$ é um <strong>deslocamento não válido</strong>. O problema da correspondência de cadeias resume-se a <em>encontrar todos os deslocamentos válidos</em> com que um padrão dado $P$ ocorre em um texto $T$.</li>\n        </ul>\n\n        <h4>1.2 O Algoritmo Ingênuo de Correspondência de Cadeias</h4>\n        <p>O algoritmo ingênuo (<code>NAIVE-STRING-MATCHER</code>, p. 798) testa sistematicamente cada um dos $n - m + 1$ deslocamentos possíveis deslizando uma janela de tamanho $m$ sobre o texto:</p>\n\n        <div class=\"clrs-pseudocode-box\">\n            <div class=\"pseudocode-header\">\n              <span class=\"proc-name\">NAIVE-STRING-MATCHER(T, P)</span>\n              <span>[ Algoritmo Ingênuo (p. 798) ]</span>\n            </div>\n            <div class=\"pseudocode-lines\">\n              <div class=\"code-line\"><span class=\"line-num\">1</span><span class=\"line-content\">n = T.length</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">2</span><span class=\"line-content\">m = P.length</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">3</span><span class=\"line-content\"><span class=\"kw\">para</span> s = 0 até n - m</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">4</span><span class=\"line-content\">   <span class=\"kw\">se</span> P[1 .. m] == T[s + 1 .. s + m]</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">5</span><span class=\"line-content\">       <span class=\"kw\">imprima</span> \"Padrão ocorre com deslocamento \" s</span></div>\n            </div>\n          </div>\n\n        <h4>1.3 Análise de Complexidade e Casos Extremos</h4>\n        <ul>\n          <li><strong>Tempo de Pré-processamento:</strong> $0$, pois o padrão é utilizado imediatamente sem nenhum cálculo prévio.</li>\n          <li><strong>Tempo de Pior Caso $\\Theta((n - m + 1)m)$:</strong> O pior caso ocorre quando todas as comparações parciais são confirmadas até o último caractere ou quando muitos caracteres coincidem. Exemplo canônico: considere o texto $T = a^n$ (uma sequência de $n$ letras 'a') e o padrão $P = a^m$. Para cada um dos $n - m + 1$ valores de $s$, o laço compara com sucesso todos os $m$ caracteres de $P$, totalizando exatamente $(n - m + 1)m$ comparações. Se $m = \\lfloor n / 2 \\rfloor$, esse tempo é $\\Theta(n^2)$.</li>\n          <li><strong>Caso Favorável de Caracteres Distintos (Exercício 32.1-2, p. 800):</strong> Se todos os caracteres de $P$ forem mutuamente distintos, quando ocorre um descasamento após comparar com sucesso $k$ caracteres ($P[1 \\dots k] = T[s+1 \\dots s+k]$ e $P[k+1] \\neq T[s+k+1]$), sabemos que nenhum dos caracteres de $T[s+2 \\dots s+k]$ pode coincidir com $P[1]$. Portanto, podemos avançar $s$ imediatamente para $s + k$ (ou $s + k + 1$ se $k = 0$), alcançando tempo total $O(n)$ sem memória adicional.</li>\n        </ul>\n\n        <h3>2. Seção 32.2 — O Algoritmo de Rabin-Karp (pp. 800–808)</h3>\n        <h4>2.1 Interpretação Aritmética de Cadeias e a Regra de Horner</h4>\n        <p>Rabin e Karp (1987) propuseram transformar a comparação de caracteres em comparações numéricas. Suponha que o alfabeto seja $\\Sigma = \\{0, 1, \\dots, d-1\\}$, de cardinalidade $d = |\\Sigma|$. Qualquer cadeia de comprimento $k$ sobre $\\Sigma$ pode ser interpretada como um número inteiro na base $d$. Por exemplo, se $\\Sigma = \\{0, 1, \\dots, 9\\}$ ($d = 10$), a cadeia <code>\"31415\"</code> corresponde ao número inteiro decimal $31.415$.</p>\n        <p>Para calcular o valor numérico $p$ correspondente ao padrão $P[1 \\dots m]$, aplicamos a <strong>regra de Horner</strong> em tempo $\\Theta(m)$:</p>\n        $$p = P[m] + d \\Big( P[m-1] + d \\big( P[m-2] + \\dots + d(P[2] + d \\cdot P[1]) \\dots \\big) \\Big)$$\n        <p>De forma similar, calculamos o valor numérico $t_0$ correspondente à primeira subcadeia de comprimento $m$ do texto, $T[1 \\dots m]$, em tempo $\\Theta(m)$:</p>\n        $$t_0 = T[m] + d \\Big( T[m-1] + d \\big( T[m-2] + \\dots + d(T[2] + d \\cdot T[1]) \\dots \\big) \\Big)$$\n\n        <h4>2.2 A Ideia Central: O Hash Rolante em Tempo O(1)</h4>\n        <p>Se conhecemos o valor numérico $t_s$ da subcadeia $T[s+1 \\dots s+m]$, como calculamos o valor $t_{s+1}$ da próxima subcadeia $T[s+2 \\dots s+m+1]$ em tempo $O(1)$? Observamos que passar da janela $s$ para a janela $s+1$ equivale a:</p>\n        <ol>\n          <li>Subtrair o dígito de ordem mais alta: $t_s - T[s+1] \\cdot d^{m-1}$;</li>\n          <li>Multiplicar o resultado por $d$ (deslocando todos os dígitos uma posição para a esquerda na base $d$);</li>\n          <li>Somar o novo dígito de menor ordem $T[s+m+1]$.</li>\n        </ol>\n        <p>Assim, obtemos a fórmula fundamental do <strong>hash rolante</strong> (<em>rolling hash</em>, Equação 32.1, p. 801):</p>\n        $$t_{s+1} = d \\big( t_s - T[s+1] \\cdot d^{m-1} \\big) + T[s+m+1]$$\n        <p>Por exemplo (Figura 32.5, p. 802), se $m = 5$, $d = 10$, $t_s = 31415$ e o próximo caractere no texto for $2$, descartamos o dígito mais à esquerda ($3$), multiplicamos $1415$ por $10$ obtendo $14150$, e somamos $2$, resultando exatamente em $t_{s+1} = 14152$, tudo em $O(1)$ operações aritméticas!</p>\n\n        <h4>2.3 Aritmética Modular e Prevenção de Estouro de Palavra</h4>\n        <p>Se $m$ for grande (por exemplo, $m = 100$ ou $m = 1000$), o valor $p$ terá centenas de dígitos e não caberá em uma palavra de máquina padrão (32 ou 64 bits), tornando as operações aritméticas dependentes de precisão arbitrária com custo $O(m)$. Para contornar essa restrição, <strong>calculamos todos os valores módulo um número primo grande $q$</strong>.</p>\n        <p>Em geral, escolhemos $q$ tal que $d \\cdot q$ caiba confortavelmente em uma palavra de máquina de 64 bits (ex.: $q$ da ordem de $10^9+7$ ou $2^{31}-1$). A constante multiplicativa de ordem superior é pré-calculada módulo $q$:</p>\n        $$h \\equiv d^{m-1} \\pmod q$$\n        <p>A fórmula de atualização do hash rolante reduz-se a (Equação 32.2, p. 802):</p>\n        $$t_{s+1} = \\Big( d \\big( t_s - T[s+1] \\cdot h \\big) + T[s+m+1] \\Big) \\bmod q$$\n        <p><em>Atenção de Implementação:</em> Em muitas linguagens (como C, C++ ou Java), o operador de resto <code>%</code> pode retornar valores negativos se $t_s - T[s+1] \\cdot h < 0$. Para manter o valor sempre no intervalo não negativo $[0, q-1]$, adiciona-se $d \\cdot q$ ou normaliza-se com <code>(valor % q + q) % q</code>.</p>\n\n        <h4>2.4 Acertos Espúrios e o Pseudocódigo de RABIN-KARP-MATCHER</h4>\n        <p>Trabalhar módulo $q$ introduz uma assimetria lógica crucial:</p>\n        <ul>\n          <li>Se $t_s \\not\\equiv p \\pmod q$, então com certeza absoluta $t_s \\neq p$, o que garante que $s$ é um <strong>deslocamento não válido</strong>.</li>\n          <li>Se $t_s \\equiv p \\pmod q$, temos um <strong>acerto</strong>. Contudo, isso não garante que $T[s+1 \\dots s+m] = P[1 \\dots m]$! Pode ocorrer uma colisão de hash, denominada <strong>acerto espúrio</strong> (<em>spurious hit</em>). Para certificar a ocorrência genuína, o algoritmo testa explicitamente caractere a caractere se $P[1 \\dots m] == T[s+1 \\dots s+m]$ em tempo $O(m)$.</li>\n        </ul>\n\n        <div class=\"clrs-pseudocode-box\">\n            <div class=\"pseudocode-header\">\n              <span class=\"proc-name\">RABIN-KARP-MATCHER(T, P, d, q)</span>\n              <span>[ Algoritmo de Rabin-Karp (p. 803) ]</span>\n            </div>\n            <div class=\"pseudocode-lines\">\n              <div class=\"code-line\"><span class=\"line-num\">1</span><span class=\"line-content\">n = T.length</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">2</span><span class=\"line-content\">m = P.length</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">3</span><span class=\"line-content\">h = d^(m - 1) mod q</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">4</span><span class=\"line-content\">p = 0</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">5</span><span class=\"line-content\">t_0 = 0</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">6</span><span class=\"line-content\"><span class=\"kw\">para</span> i = 1 até m                     <span class=\"cmt\">// Pré-processamento via regra de Horner</span></span></div>\n              <div class=\"code-line\"><span class=\"line-num\">7</span><span class=\"line-content\">   p = (d * p + P[i]) mod q</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">8</span><span class=\"line-content\">   t_0 = (d * t_0 + T[i]) mod q</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">9</span><span class=\"line-content\"><span class=\"kw\">para</span> s = 0 até n - m                 <span class=\"cmt\">// Varredura dos deslocamentos</span></span></div>\n              <div class=\"code-line\"><span class=\"line-num\">10</span><span class=\"line-content\">  <span class=\"kw\">se</span> p == t_s                      <span class=\"cmt\">// Acerto heurístico de hash</span></span></div>\n              <div class=\"code-line\"><span class=\"line-num\">11</span><span class=\"line-content\">      <span class=\"kw\">se</span> P[1 .. m] == T[s + 1 .. s + m]</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">12</span><span class=\"line-content\">          <span class=\"kw\">imprima</span> \"Padrão ocorre com deslocamento \" s</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">13</span><span class=\"line-content\">  <span class=\"kw\">se</span> s < n - m</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">14</span><span class=\"line-content\">      t_{s + 1} = (d * (t_s - T[s + 1] * h) + T[s + m + 1]) mod q</span></div>\n            </div>\n          </div>\n\n        <h4>2.5 Análise de Complexidade de Rabin-Karp</h4>\n        <ul>\n          <li><strong>Pré-processamento:</strong> A linha 3 calcula $h = d^{m-1} \\bmod q$ em tempo $O(m)$ (ou $O(\\lg m)$ por potenciação binária modular). As linhas 6–8 calculam $p$ e $t_0$ em $\\Theta(m)$. Logo, o tempo de pré-processamento é $\\mathbf{\\Theta(m)}$.</li>\n          <li><strong>Pior Caso $\\Theta((n - m + 1)m)$:</strong> Ocorre quando quase todos os deslocamentos produzem acertos espúrios ou quando todos os deslocamentos são válidos (por exemplo, $T = a^n, P = a^m$). Nesses casos, o teste explícito na linha 11 é executado $n - m + 1$ vezes, consumindo $\\Theta(m)$ por verificação.</li>\n          <li><strong>Tempo Esperado $O(n + m)$ (Análise Heurística, p. 804):</strong> Supondo que a redução módulo $q$ distribua os valores uniformemente sobre $\\{0, 1, \\dots, q-1\\}$, a probabilidade de um deslocamento arbitrário resultar em acerto espúrio é de $1/q$. O número esperado de acertos espúrios ao longo de todo o texto é $O(n/q)$. Se $v$ denota o número de ocorrências válidas reais do padrão no texto, o tempo esperado de casamento é:\n            $$O(n) + O\\big(m(v + n/q)\\big)$$\n            Se o número de ocorrências válidas for pequeno ($v = O(1)$) e escolhermos um número primo $q \\ge m$, a quantidade $n/q$ é no máximo $n/m \\le n$. Consequentemente, o tempo esperado de correspondência reduz-se a $\\mathbf{O(n + m)}$, o que é puramente <strong>linear</strong>!</li>\n        </ul>\n\n        <div id=\"workbench-mod15-mount\"></div>\n        "
  },
  {
    "id": "u15-2",
    "code": "UNIDADE 15.2 • CAP. 32 (SEÇÃO 32.3)",
    "pages": "pp. 808–815",
    "title": "32.3 Autômatos Finitos para Busca de Cadeias (FINITE-AUTOMATON-MATCHER e COMPUTE-TRANSITION-FUNCTION)",
    "content": "\n        <p>A <strong>Seção 32.3</strong> (pp. 808–815) formaliza a construção de um <strong>autômato finito determinístico</strong> (AFD) especialmente projetado para a busca de padrões. Esse método atinge o ápice da eficiência no tempo de correspondência: examina cada caractere do texto exatamente uma vez e efetua cada transição de estado em tempo constante $O(1)$, atingindo tempo de busca estritamente linear $\\Theta(n)$ sem qualquer retrocesso no texto.</p>\n\n        <h3>1. Definição Formal de um Autômato Finito</h3>\n        <p>Um <strong>autômato finito determinístico</strong> $M$ é uma 5-upla ordenada $(Q, q_0, A, \\Sigma, \\delta)$, onde:</p>\n        <ul>\n          <li>$Q$: Conjunto finito de <strong>estados</strong>. No contexto da busca pelo padrão $P[1 \\dots m]$, definimos $Q = \\{0, 1, \\dots, m\\}$, onde o estado numérico $q \\in Q$ indica o comprimento do prefixo mais longo de $P$ que coincide com um sufixo do texto lido até o momento.</li>\n          <li>$q_0 \\in Q$: O <strong>estado inicial</strong>, fixado como $q_0 = 0$ (nenhum caractere do padrão foi casado ainda).</li>\n          <li>$A \\subseteq Q$: O conjunto de <strong>estados de aceitação</strong> (ou finais). No nosso autômato de cadeia, existe um único estado de aceitação: $A = \\{m\\}$.</li>\n          <li>$\\Sigma$: Um <strong>alfabeto finito</strong> de entrada.</li>\n          <li>$\\delta$: Uma função de mapeamento $\\delta : Q \\times \\Sigma \\to Q$, denominada <strong>função de transição</strong> do autômato.</li>\n        </ul>\n\n        <h3>2. A Função de Sufixo $\\sigma$ e a Função de Transição $\\delta$</h3>\n        <p>O conceito teórico central que rege o autômato de correspondência de cadeias é a <strong>função de sufixo</strong> $\\sigma$ correspondente a um dado padrão $P[1 \\dots m]$.</p>\n        <h4>2.1 Definição da Função de Sufixo $\\sigma$</h4>\n        <p>A função $\\sigma : \\Sigma^* \\to \\{0, 1, \\dots, m\\}$ mapeia qualquer cadeia $x \\in \\Sigma^*$ no comprimento do mais longo prefixo de $P$ que também é um sufixo de $x$ (p. 809):</p>\n        $$\\sigma(x) = \\max \\{ k : P_k \\sqsupset x \\}$$\n        <p>A função $\\sigma(x)$ possui propriedades imediatas fundamentais:</p>\n        <ul>\n          <li>$\\sigma(x)$ está perfeitamente bem-definida para qualquer cadeia $x$, pois $P_0 = \\varepsilon$ é sufixo de qualquer cadeia ($P_0 \\sqsupset x$), garantindo que o conjunto $\\{k : P_k \\sqsupset x\\}$ nunca é vazio e contém ao menos $0$.</li>\n          <li>$0 \\le \\sigma(x) \\le m$.</li>\n          <li>Para qualquer cadeia $x$, $P_k \\sqsupset x$ se e somente se $k \\le \\sigma(x)$.</li>\n          <li>O padrão completo $P$ ocorre no final de uma cadeia $x$ se e somente se $\\sigma(x) = m$.</li>\n        </ul>\n\n        <h4>2.2 Definição da Função de Transição $\\delta$</h4>\n        <p>Definimos o autômato de correspondência de cadeias para o padrão $P[1 \\dots m]$ fixando sua função de transição para qualquer estado $q \\in Q$ e caractere $a \\in \\Sigma$ como:</p>\n        $$\\delta(q, a) = \\sigma(P_q a)$$\n        <p>Intuição: se o autômato está no estado $q$, a porção final do texto lido coincide com $P_q$. Ao receber o caractere $a$, a nova porção final passa a ser $P_q a$. O próximo estado deve registrar o maior prefixo de $P$ que é sufixo de $P_q a$.</p>\n\n        <h3>3. Lemas Fundamentais e Corretude do Autômato</h3>\n        <p>O CLRS demonstra a corretude formal do autômato através de três lemas encadeados:</p>\n        <ul>\n          <li><strong>Lema 32.1 (Lema do Sufixo de Sobreposição, p. 810):</strong> Sejam $x, y$ e $z$ cadeias tais que $x \\sqsupset z$ e $y \\sqsupset z$. Se $|x| \\le |y|$, então $x \\sqsupset y$. Se $|x| \\ge |y|$, então $y \\sqsupset x$. Se $|x| = |y|$, então $x = y$.</li>\n          <li><strong>Lema 32.2 (Lema do Deslocamento do Sufixo, p. 810):</strong> Para qualquer cadeia $x$ e caractere $a$, se $q = \\sigma(x)$, então $\\sigma(xa) \\le q + 1$.<br>\n          <em>Demonstração:</em> Seja $k = \\sigma(xa)$. Se $k = 0$, então $k \\le q + 1$ trivialmente. Se $k > 0$, então $P_k \\sqsupset xa$. Como $P_k$ termina com o caractere $a$, temos $P_{k-1} \\sqsupset x$. Pela definição de $\\sigma(x)$, $\\sigma(x) = q$ é o comprimento do mais longo prefixo de $P$ que é sufixo de $x$. Logo, $k - 1 \\le q$, o que implica $k \\le q + 1$. $\\blacksquare$</li>\n          <li><strong>Lema 32.3 (Lema da Equivalência de Transições, p. 811):</strong> Para qualquer cadeia $x$ e caractere $a$, se $q = \\sigma(x)$, então:\n            $$\\sigma(xa) = \\sigma(P_q a)$$\n          </li>\n          <li><strong>Teorema 32.4 (Corretude do Autômato de Cadeias, p. 811):</strong> Se $\\phi(x)$ denota o estado final assumido pelo autômato após ler a sequência de caracteres $x$ a partir do estado inicial $q_0 = 0$, então para todo $i = 0, 1, \\dots, n$:\n            $$\\phi(T_i) = \\sigma(T_i)$$\n            Portanto, o autômato encontra-se no estado de aceitação $m$ após ler $T[i]$ se e somente se o padrão $P$ ocorre no texto com deslocamento válido $s = i - m$.</li>\n        </ul>\n\n        <h3>4. Pseudocódigos e Complexidade</h3>\n        <div class=\"clrs-pseudocode-box\">\n            <div class=\"pseudocode-header\">\n              <span class=\"proc-name\">FINITE-AUTOMATON-MATCHER(T, δ, m)</span>\n              <span>[ Busca por Autômato Finito (p. 811) ]</span>\n            </div>\n            <div class=\"pseudocode-lines\">\n              <div class=\"code-line\"><span class=\"line-num\">1</span><span class=\"line-content\">n = T.length</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">2</span><span class=\"line-content\">q = 0</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">3</span><span class=\"line-content\"><span class=\"kw\">para</span> i = 1 até n</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">4</span><span class=\"line-content\">   q = δ(q, T[i])</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">5</span><span class=\"line-content\">   <span class=\"kw\">se</span> q == m</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">6</span><span class=\"line-content\">       <span class=\"kw\">imprima</span> \"Padrão ocorre com deslocamento \" i - m</span></div>\n            </div>\n          </div>\n\n        <p>A busca por autômato finito é assombrosamente rápida: o laço executa exatamente $n$ iterações, cada consulta à matriz $\\delta(q, T[i])$ demora $O(1)$, e portanto o tempo de casamento é estritamente $\\mathbf{\\Theta(n)}$.</p>\n\n        <h4>4.1 Construção da Tabela de Transição: COMPUTE-TRANSITION-FUNCTION</h4>\n        <div class=\"clrs-pseudocode-box\">\n            <div class=\"pseudocode-header\">\n              <span class=\"proc-name\">COMPUTE-TRANSITION-FUNCTION(P, Σ) (p. 813)</span>\n              <span>[ CLRS • CAPÍTULOS 32–33 ]</span>\n            </div>\n            <div class=\"pseudocode-lines\">\n              <div class=\"code-line\"><span class=\"line-num\">1</span><span class=\"line-content\">m = P.length</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">2</span><span class=\"line-content\"><span class=\"kw\">para</span> q = 0 até m</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">3</span><span class=\"line-content\">   <span class=\"kw\">para cada</span> caractere a em Σ</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">4</span><span class=\"line-content\">       k = min(m + 1, q + 2)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">5</span><span class=\"line-content\">       <span class=\"kw\">repita</span></span></div>\n              <div class=\"code-line\"><span class=\"line-num\">6</span><span class=\"line-content\">           k = k - 1</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">7</span><span class=\"line-content\">       até que P_k <span class=\"kw\">seja</span> sufixo de P_q a</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">8</span><span class=\"line-content\">       δ(q, a) = k</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">9</span><span class=\"line-content\"><span class=\"kw\">retorne</span> δ</span></div>\n            </div>\n          </div>\n\n        <h4>4.2 O Gargalo dos Autômatos Finitos</h4>\n        <p>Apesar do tempo de busca $\\Theta(n)$, o procedimento <code>COMPUTE-TRANSITION-FUNCTION</code> possui sérias desvantagens práticas:</p>\n        <ul>\n          <li><strong>Tempo de Pré-processamento Cúbico:</strong> Existem $m + 1$ estados e $|\\Sigma|$ caracteres por estado. O laço <code>repita</code> testa até $m + 2$ valores de $k$, e cada teste para verificar se $P_k \\sqsupset P_q a$ consome $O(m)$ comparações de caracteres. Assim, o tempo ingênuo de construção da tabela de transição é $\\mathbf{O(m^3 |\\Sigma|)}$.</li>\n          <li><strong>Consumo de Memória Proibitivo:</strong> A tabela $\\delta$ possui dimensão $(m + 1) \\times |\\Sigma|$. Se o alfabeto for grande — como o padrão Unicode UTF-8 com milhares de caracteres distintos ou dicionários de palavras completas —, a tabela consome megabytes ou gigabytes de RAM. Essa limitação motivou Knuth, Morris e Pratt a desenvolverem um algoritmo que preserva a busca linear $\\Theta(n)$ sem jamais construir explicitamente a matriz $\\delta$!</li>\n        </ul>\n        "
  },
  {
    "id": "u15-3",
    "code": "UNIDADE 15.3 • CAP. 32 (SEÇÃO 32.4)",
    "pages": "pp. 815–824",
    "title": "32.4 O Algoritmo de Knuth-Morris-Pratt (KMP-MATCHER e COMPUTE-PREFIX-FUNCTION)",
    "content": "\n        <p>A <strong>Seção 32.4</strong> (pp. 815–824) apresenta uma das mais célebres criações da algorítmica: o <strong>Algoritmo de Knuth-Morris-Pratt (KMP)</strong>. Ele resolve definitivamente o gargalo do autômato finito, alcançando tempo de pré-processamento linear $\\Theta(m)$ e tempo de busca linear $\\Theta(n)$ com consumo de memória auxiliar de apenas $\\Theta(m)$, completamente independente do tamanho do alfabeto $|\\Sigma|$.</p>\n\n        <h3>1. A Filosofia do Algoritmo KMP</h3>\n        <p>Considere que estejamos comparando o padrão $P$ contra o texto $T$ e já tenhamos casado com sucesso $q$ caracteres ($P[1 \\dots q] = T[s+1 \\dots s+q]$), mas ocorra um descasamento no caractere seguinte: $P[q+1] \\neq T[s+q+1]$.</p>\n        <p>No algoritmo ingênuo, recuaríamos o texto para $s+1$ e recomeçaríamos a comparação de $P[1]$. Contudo, como já sabemos que a subcadeia do texto $T[s+1 \\dots s+q]$ é <em>idêntica</em> a $P[1 \\dots q]$, <strong>já conhecemos os caracteres do texto sem precisar relê-los!</strong></p>\n        <p>A pergunta inteligente é: qual é o menor deslocamento $s' > s$ que ainda pode ser válido? Para que $s'$ seja válido, um prefixo de $P$ deve coincidir com um sufixo do trecho do texto já examinado. Mas como esse trecho do texto coincide com $P_q$, isso equivale a encontrar o <strong>mais longo prefixo próprio de $P$ que também é sufixo de $P_q$</strong>! Essa informação depende exclusivamente da estrutura interna do próprio padrão $P$, e é inteiramente capturada pela <strong>função de prefixo $\\pi$</strong>.</p>\n\n        <h3>2. A Função de Prefixo $\\pi[1 \\dots m]$</h3>\n        <h4>2.1 Definição Formal</h4>\n        <p>A função de prefixo $\\pi : \\{1, 2, \\dots, m\\} \\to \\{0, 1, \\dots, m-1\\}$ mapeia cada índice $q$ do padrão no comprimento do mais longo prefixo próprio de $P$ que é sufixo de $P_q$ (p. 816):</p>\n        $$\\pi[q] = \\max \\{ k : k < q \\text{ e } P_k \\sqsupset P_q \\}$$\n        <p>Por convenção, $\\pi[1] = 0$, pois o único prefixo próprio de $P_1$ é $\\varepsilon$, cujo comprimento é $0$.</p>\n\n        <h4>2.2 A Cadeia de Prefixos Iterados $\\pi^*[q]$</h4>\n        <p>Definimos a iteração da função $\\pi$ por $\\pi^{(0)}[q] = q$ e $\\pi^{(i)}[q] = \\pi[\\pi^{(i-1)}[q]]$ para $i \\ge 1$. A sequência $\\pi^*[q]$ consiste em todos os prefixos próprios não vazios de $P$ que são sufixos de $P_q$ obtidos aplicando $\\pi$ repetidamente até atingir $0$:</p>\n        $$\\pi^*[q] = \\big\\{ \\pi^{(1)}[q], \\, \\pi^{(2)}[q], \\, \\dots, \\, \\pi^{(t)}[q] \\big\\} \\quad \\text{onde } \\pi^{(t)}[q] = 0$$\n\n        <h4>2.3 Lemas Fundamentais da Função de Prefixo</h4>\n        <ul>\n          <li><strong>Lema 32.5 (Lema da Função de Prefixo, p. 817):</strong> Seja $P$ um padrão de comprimento $m$ com função prefixo $\\pi$. Então para qualquer $q \\in \\{1, \\dots, m\\}$, temos:\n            $$\\pi^*[q] = \\{ k : k < q \\text{ e } P_k \\sqsupset P_q \\}$$\n            Isto é, a aplicação sucessiva de $\\pi$ enumera <em>todos</em> os prefixos de $P$ que são sufixos de $P_q$, em ordem decrescente de comprimento!</li>\n          <li><strong>Lema 32.6 (p. 818):</strong> Para qualquer $q \\in \\{1, \\dots, m\\}$, se $\\pi[q] > 0$, então $\\pi[q] - 1 \\in \\pi^*[q-1]$. Isso justifica calcular $\\pi[q]$ examinando candidatos a partir de $\\pi[q-1]$ e descendo pela cadeia de $\\pi$.</li>\n        </ul>\n\n        <h3>3. O Procedimento COMPUTE-PREFIX-FUNCTION(P)</h3>\n        <p>O algoritmo para calcular $\\pi$ compara o padrão contra si mesmo em tempo linear $\\Theta(m)$:</p>\n\n        <div class=\"clrs-pseudocode-box\">\n            <div class=\"pseudocode-header\">\n              <span class=\"proc-name\">COMPUTE-PREFIX-FUNCTION(P)</span>\n              <span>[ Pré-processamento KMP (p. 818) ]</span>\n            </div>\n            <div class=\"pseudocode-lines\">\n              <div class=\"code-line\"><span class=\"line-num\">1</span><span class=\"line-content\">m = P.length</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">2</span><span class=\"line-content\"><span class=\"kw\">seja</span> π[1 .. m] um novo arranjo</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">3</span><span class=\"line-content\">π[1] = 0</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">4</span><span class=\"line-content\">k = 0</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">5</span><span class=\"line-content\"><span class=\"kw\">para</span> q = 2 até m</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">6</span><span class=\"line-content\">   <span class=\"kw\">enquanto</span> k > 0 e P[k + 1] != P[q]</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">7</span><span class=\"line-content\">       k = π[k]</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">8</span><span class=\"line-content\">   <span class=\"kw\">se</span> P[k + 1] == P[q]</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">9</span><span class=\"line-content\">       k = k + 1</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">10</span><span class=\"line-content\">  π[q] = k</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">11</span><span class=\"line-content\"><span class=\"kw\">retorne</span> π</span></div>\n            </div>\n          </div>\n\n        <h4>3.1 Análise Amortizada por Função de Potencial de COMPUTE-PREFIX-FUNCTION</h4>\n        <p>À primeira vista, o laço <code>enquanto</code> aninhado dentro do laço <code>para</code> poderia sugerir complexidade $O(m^2)$. Contudo, a <strong>análise amortizada por função de potencial</strong> (Capítulo 17, p. 819) prova que o tempo é estritamente $\\mathbf{\\Theta(m)}$:</p>\n        <ul>\n          <li>Definimos a função de potencial $\\Phi = k$. Como $k$ representa um comprimento de prefixo, sempre temos $k \\ge 0$, logo $\\Phi \\ge 0$, com potencial inicial $\\Phi_1 = k = 0$.</li>\n          <li>Na linha 9, a única instrução que incrementa $k$ é executada <em>no máximo uma vez por iteração do laço <code>para</code></em>. Portanto, ao longo de todo o algoritmo, $k$ pode sofrer no máximo $m - 1$ incrementos unitários.</li>\n          <li>Na linha 7, cada iteração do laço <code>enquanto</code> substitui $k$ por $\\pi[k]$. Como $\\pi[k] < k$, o valor de $k$ <strong>diminui em no mínimo $1$</strong> a cada iteração do laço <code>enquanto</code>.</li>\n          <li>Como $k$ nunca se torna negativo ($k \\ge 0$) e seu crescimento total é limitado por $m - 1$, o número total de decrementos de $k$ não pode exceder o número total de incrementos!</li>\n          <li>Conclusão: o laço <code>enquanto</code> executa <strong>no máximo $m - 1$ vezes no total</strong> somando todas as iterações de $q = 2 \\dots m$. O custo amortizado de cada iteração do laço <code>para</code> é $O(1)$, provando que <code>COMPUTE-PREFIX-FUNCTION</code> roda em tempo estrito $\\mathbf{\\Theta(m)}$.</li>\n        </ul>\n\n        <h3>4. O Procedimento KMP-MATCHER(T, P)</h3>\n        <p>Armado com o arranjo $\\pi$, o procedimento <code>KMP-MATCHER</code> simula perfeitamente o autômato finito sem retroceder o índice $i$ do texto:</p>\n\n        <div class=\"clrs-pseudocode-box\">\n            <div class=\"pseudocode-header\">\n              <span class=\"proc-name\">KMP-MATCHER(T, P)</span>\n              <span>[ Algoritmo de Knuth-Morris-Pratt (p. 816) ]</span>\n            </div>\n            <div class=\"pseudocode-lines\">\n              <div class=\"code-line\"><span class=\"line-num\">1</span><span class=\"line-content\">n = T.length</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">2</span><span class=\"line-content\">m = P.length</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">3</span><span class=\"line-content\">π = COMPUTE-PREFIX-FUNCTION(P)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">4</span><span class=\"line-content\">q = 0                                <span class=\"cmt\">// Número de caracteres casados</span></span></div>\n              <div class=\"code-line\"><span class=\"line-num\">5</span><span class=\"line-content\"><span class=\"kw\">para</span> i = 1 até n                     <span class=\"cmt\">// Varredura estrita da esquerda para a direita</span></span></div>\n              <div class=\"code-line\"><span class=\"line-num\">6</span><span class=\"line-content\">   <span class=\"kw\">enquanto</span> q > 0 e P[q + 1] != T[i]</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">7</span><span class=\"line-content\">       q = π[q]                     <span class=\"cmt\">// Próximo caractere não casa: recua pelo prefixo</span></span></div>\n              <div class=\"code-line\"><span class=\"line-num\">8</span><span class=\"line-content\">   <span class=\"kw\">se</span> P[q + 1] == T[i]</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">9</span><span class=\"line-content\">       q = q + 1                    <span class=\"cmt\">// Caractere casa: avança o estado</span></span></div>\n              <div class=\"code-line\"><span class=\"line-num\">10</span><span class=\"line-content\">  <span class=\"kw\">se</span> q == m                        <span class=\"cmt\">// Casamento completo encontrado!</span></span></div>\n              <div class=\"code-line\"><span class=\"line-num\">11</span><span class=\"line-content\">      <span class=\"kw\">imprima</span> \"Padrão ocorre com deslocamento \" i - m</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">12</span><span class=\"line-content\">      q = π[q]                     <span class=\"cmt\">// Procura a próxima ocorrência sobreposta</span></span></div>\n            </div>\n          </div>\n\n        <h4>4.1 Análise de Desempenho e Corretude de KMP-MATCHER</h4>\n        <ul>\n          <li><strong>Tempo de Busca $\\Theta(n)$:</strong> Aplicando a função de potencial $\\Phi = q \\ge 0$, a variável $q$ é incrementada na linha 9 no máximo $n$ vezes (uma por caractere do texto). O laço <code>enquanto</code> (linha 7) decrementa $q$ por $q = \\pi[q] < q$. Logo, o laço <code>enquanto</code> executa no máximo $n$ vezes no total durante toda a busca. O tempo de execução de <code>KMP-MATCHER</code> é estritamente $\\mathbf{\\Theta(n)}$.</li>\n          <li><strong>Complexidade Global Ótima:</strong> Tempo total $\\mathbf{\\Theta(m + n)}$ e espaço adicional $\\mathbf{\\Theta(m)}$, sem qualquer dependência do tamanho do alfabeto $|\\Sigma|$.</li>\n          <li><strong>Transmissão Contínua (Streaming):</strong> Como o ponteiro $i$ avança monotonicamente de $1$ até $n$ sem nunca recuar, o texto não precisa residir em memória física: pode ser lido caractere a caractere diretamente da rede ou de um arquivo em disco.</li>\n        </ul>\n\n        <h4>4.2 Otimização com a Função de Prefixo Melhorada $\\pi'$ (Exercício 32.4-6, p. 824)</h4>\n        <p>No <code>KMP-MATCHER</code>, se ocorre um descasamento quando $P[q+1] \\neq T[i]$ e o algoritmo recua para $q' = \\pi[q]$, se porventura $P[q'+1] == P[q+1]$, então imediatamente falharemos de novo no teste $P[q'+1] == T[i]$! Essa comparação é redundante.</p>\n        <p>Para eliminar essas etapas inúteis, define-se a função de prefixo otimizada $\\pi'[q]$ recursivamente:</p>\n        $$\\pi'[q] = \\begin{cases} 0 & \\text{se } \\pi[q] = 0, \\\\ \\pi'[\\pi[q]] & \\text{se } \\pi[q] > 0 \\text{ e } P[\\pi[q] + 1] == P[q + 1], \\\\ \\pi[q] & \\text{se } \\pi[q] > 0 \\text{ e } P[\\pi[q] + 1] \\neq P[q + 1]. \\end{cases}$$\n        <p>Substituindo $\\pi$ por $\\pi'$ na linha 7 de <code>KMP-MATCHER</code> (mas mantendo $\\pi$ na linha 12 para encontrar ocorrências sobrepostas completas), o algoritmo salta múltiplos estados redundantes em cascata com um único acesso, acelerando a busca na prática.</p>\n        "
  },
  {
    "id": "u15-4",
    "code": "UNIDADE 15.4 • CAP. 33 (SEÇÃO 33.1)",
    "pages": "pp. 825–831",
    "title": "33.1 Primitivas Geométricas: Produtos Vetoriais, Sentido de Curvas (DIRECTION) e Interseção de Segmentos (SEGMENTS-INTERSECT)",
    "content": "\n        <p>O <strong>Capítulo 33</strong> (pp. 825–851) introduz a <strong>Geometria Computacional</strong>, a disciplina dedicada ao projeto e análise de algoritmos eficientes para problemas envolvendo objetos geométricos no espaço (pontos, segmentos, polígonos e poliedros).</p>\n\n        <h3>1. A Crise da Aritmética de Ponto Flutuante na Geometria</h3>\n        <p>A formulação geométrica tradicional do ensino médio expressa retas no plano pela equação linear reduzida $y = mx + b$, onde $m = (y_2 - y_1) / (x_2 - x_1)$ é a inclinação (coeficiente angular) e $b$ é o intercepto vertical. Em um computador digital, essa abordagem enfrenta dois obstáculos fatais:</p>\n        <ol>\n          <li><strong>Retas Verticais e Divisão por Zero:</strong> Quando dois pontos compartilham a mesma abscissa ($x_1 = x_2$), a inclinação torna-se indefinida ($m = \\infty$), exigindo casos especiais e ramificações condicionais prolixas em todo o código.</li>\n          <li><strong>Instabilidade Numérica e Violação de Axiomas Topológicos:</strong> A aritmética de ponto flutuante padrão IEEE-754 introduz pequenos erros de arredondamento. Esses erros podem destruir relações fundamentais como a transitividade (fazendo o algoritmo concluir que o ponto $A$ está à esquerda de $B$, $B$ está à esquerda de $C$, mas $C$ está à esquerda de $A$!), provocando laços infinitos e travamentos em programas de CAD e GIS.</li>\n        </ol>\n        <p>A solução elegante do CLRS consiste em <strong>eliminar completamente a divisão e o ponto flutuante</strong>, formulando todas as decisões geométricas em termos de <strong>produtos vetoriais bidimensionais</strong> com números inteiros exatos!</p>\n\n        <h3>2. O Produto Vetorial Bidimensional (Cross Product)</h3>\n        <p>Considere dois pontos no plano cartesiano $p_1 = (x_1, y_1)$ e $p_2 = (x_2, y_2)$ tratados como vetores a partir da origem $(0, 0)$. O <strong>produto vetorial bidimensional</strong> $p_1 \\times p_2$ é definido algebricamente pelo determinante da matriz $2 \\times 2$ (p. 826):</p>\n        $$p_1 \\times p_2 = \\det \\begin{pmatrix} x_1 & x_2 \\\\ y_1 & y_2 \\end{pmatrix} = x_1 y_2 - x_2 y_1$$\n\n        <h4>2.1 Interpretação Geométrica e Sentido Relativo</h4>\n        <p>Geometricamente, o valor $|p_1 \\times p_2|$ é igual à <strong>área do paralelogramo</strong> cujos vértices são $(0, 0)$, $p_1$, $p_2$ e $p_1 + p_2 = (x_1 + x_2, y_1 + y_2)$. Mais importante ainda, o <em>sinal</em> do produto vetorial codifica a orientação angular relativa entre os dois vetores (Figura 33.1, p. 826):</p>\n        <ul>\n          <li><strong>$p_1 \\times p_2 > 0$:</strong> O vetor $p_1$ está no <em>sentido horário</em> em relação a $p_2$ (ou, equivalentemente, $p_2$ faz uma rotação no <strong>sentido anti-horário</strong> a partir de $p_1$ pelo menor ângulo em relação à origem).</li>\n          <li><strong>$p_1 \\times p_2 < 0$:</strong> O vetor $p_1$ está no <em>sentido anti-horário</em> em relação a $p_2$ (ou $p_2$ faz uma rotação no <strong>sentido horário</strong> a partir de $p_1$).</li>\n          <li><strong>$p_1 \\times p_2 = 0$:</strong> Os vetores $p_1$ e $p_2$ são <strong>colineares</strong> em relação à origem (apontam na mesma direção ou em direções diametralmente opostas).</li>\n        </ul>\n\n        <h3>3. Sentido de Curvas entre Segmentos Consecutivos: A Sub-rotina DIRECTION</h3>\n        <p>Dados três pontos $p_0 = (x_0, y_0)$, $p_1 = (x_1, y_1)$ e $p_2 = (x_2, y_2)$, queremos determinar se ao caminhar ao longo do segmento orientado $\\vec{p_0 p_1}$ e depois dobrar em direção a $p_2$ fazemos uma <strong>curva à esquerda</strong> ou uma <strong>curva à direita</strong> no vértice intermediário $p_1$ (Figura 33.2, p. 827).</p>\n        <p>Transladamos temporariamente a origem para $p_0$: os vetores tornam-se $p_1 - p_0 = (x_1 - x_0, y_1 - y_0)$ e $p_2 - p_0 = (x_2 - x_0, y_2 - y_0)$. A orientação da curva corresponde ao sinal do produto vetorial $(p_2 - p_0) \\times (p_1 - p_0)$.</p>\n\n        <div class=\"clrs-pseudocode-box\">\n            <div class=\"pseudocode-header\">\n              <span class=\"proc-name\">DIRECTION(p_i, p_j, p_k)</span>\n              <span>[ Orientação Relativa de Três Pontos (p. 827) ]</span>\n            </div>\n            <div class=\"pseudocode-lines\">\n              <div class=\"code-line\"><span class=\"line-num\">1</span><span class=\"line-content\"><span class=\"kw\">retorne</span> (p_k.x - p_i.x) * (p_j.y - p_i.y) - (p_j.x - p_i.x) * (p_k.y - p_i.y)</span></div>\n            </div>\n          </div>\n\n        <p>Convenção de Sinais de <code>DIRECTION(p_i, p_j, p_k)</code>:</p>\n        <ul>\n          <li>Se <code>DIRECTION(p_i, p_j, p_k) < 0</code>: os pontos viram para a <strong>esquerda</strong> em $p_j$ (sentido anti-horário);</li>\n          <li>Se <code>DIRECTION(p_i, p_j, p_k) > 0</code>: os pontos viram para a <strong>direita</strong> em $p_j$ (sentido horário);</li>\n          <li>Se <code>DIRECTION(p_i, p_j, p_k) == 0</code>: os pontos $p_i, p_j, p_k$ são <strong>colineares</strong>.</li>\n        </ul>\n\n        <h3>4. Teste de Caixa Delimitadora: A Sub-rotina ON-SEGMENT</h3>\n        <p>Se já sabemos que o ponto $p_k$ é colinear com o segmento de reta $p_i p_j$, queremos determinar se $p_k$ repousa estritamente <em>sobre</em> o segmento $p_i p_j$. Isso equivale a testar se $p_k$ pertence à caixa delimitadora retangular (<em>bounding box</em>) cujos cantos opostos são $p_i$ e $p_j$:</p>\n\n        <div class=\"clrs-pseudocode-box\">\n            <div class=\"pseudocode-header\">\n              <span class=\"proc-name\">ON-SEGMENT(p_i, p_j, p_k)</span>\n              <span>[ Teste de Pertencimento a Segmento Colinear (p. 828) ]</span>\n            </div>\n            <div class=\"pseudocode-lines\">\n              <div class=\"code-line\"><span class=\"line-num\">1</span><span class=\"line-content\"><span class=\"kw\">se</span> min(p_i.x, p_j.x) ≤ p_k.x e p_k.x ≤ max(p_i.x, p_j.x) e</span></div>\n              <div class=\"code-line\"><span class=\"line-num\"></span><span class=\"line-content\">         min(p_i.y, p_j.y) ≤ p_k.y e p_k.y ≤ max(p_i.y, p_j.y)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">2</span><span class=\"line-content\">   <span class=\"kw\">retorne</span> TRUE</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">3</span><span class=\"line-content\"><span class=\"kw\">senão</span></span></div>\n              <div class=\"code-line\"><span class=\"line-num\">4</span><span class=\"line-content\">   <span class=\"kw\">retorne</span> FALSE</span></div>\n            </div>\n          </div>\n\n        <h3>5. O Procedimento Completo SEGMENTS-INTERSECT(p₁, p₂, p₃, p₄)</h3>\n        <p>Dois segmentos de reta fechados $p_1 p_2$ e $p_3 p_4$ se interceptam se e somente se pelo menos uma das duas condições geométricas a seguir for satisfeita (pp. 827–828):</p>\n        <ol>\n          <li><strong>Condição Geral (Estrangulamento Mútuo):</strong> Cada segmento ultrapassa (<em>straddles</em>) a reta suporte que contém o outro segmento. Um segmento $p_1 p_2$ ultrapassa a reta suporte de $p_3 p_4$ se as extremidades $p_1$ e $p_2$ estiverem em lados estritamente opostos dessa reta. Algebricamente, isso significa que as orientações relativas <code>DIRECTION(p_3, p_4, p_1)</code> e <code>DIRECTION(p_3, p_4, p_2)</code> têm sinais opostos, e reciprocamente para $p_3 p_4$ em relação à reta de $p_1 p_2$.</li>\n          <li><strong>Condição de Fronteira (Colinearidade):</strong> Uma das quatro extremidades é colinear com o outro segmento e repousa diretamente sobre ele (detectado por <code>d_k == 0</code> e <code>ON-SEGMENT</code>).</li>\n        </ol>\n\n        <div class=\"clrs-pseudocode-box\">\n            <div class=\"pseudocode-header\">\n              <span class=\"proc-name\">SEGMENTS-INTERSECT(p₁, p₂, p₃, p₄)</span>\n              <span>[ Interseção Robusta em O(1) (p. 828) ]</span>\n            </div>\n            <div class=\"pseudocode-lines\">\n              <div class=\"code-line\"><span class=\"line-num\">1</span><span class=\"line-content\">d_1 = DIRECTION(p_3, p_4, p_1)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">2</span><span class=\"line-content\">d_2 = DIRECTION(p_3, p_4, p_2)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">3</span><span class=\"line-content\">d_3 = DIRECTION(p_1, p_2, p_3)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">4</span><span class=\"line-content\">d_4 = DIRECTION(p_1, p_2, p_4)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">5</span><span class=\"line-content\"><span class=\"kw\">se</span> (((d_1 > 0 e d_2 < 0) ou (d_1 < 0 e d_2 > 0)) e</span></div>\n              <div class=\"code-line\"><span class=\"line-num\"></span><span class=\"line-content\">       ((d_3 > 0 e d_4 < 0) ou (d_3 < 0 e d_4 > 0)))</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">6</span><span class=\"line-content\">   <span class=\"kw\">retorne</span> TRUE</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">7</span><span class=\"line-content\"><span class=\"kw\">senão se</span> d_1 == 0 e ON-SEGMENT(p_3, p_4, p_1)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">8</span><span class=\"line-content\">   <span class=\"kw\">retorne</span> TRUE</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">9</span><span class=\"line-content\"><span class=\"kw\">senão se</span> d_2 == 0 e ON-SEGMENT(p_3, p_4, p_2)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">10</span><span class=\"line-content\">  <span class=\"kw\">retorne</span> TRUE</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">11</span><span class=\"line-content\"><span class=\"kw\">senão se</span> d_3 == 0 e ON-SEGMENT(p_1, p_2, p_3)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">12</span><span class=\"line-content\">  <span class=\"kw\">retorne</span> TRUE</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">13</span><span class=\"line-content\"><span class=\"kw\">senão se</span> d_4 == 0 e ON-SEGMENT(p_1, p_2, p_4)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">14</span><span class=\"line-content\">  <span class=\"kw\">retorne</span> TRUE</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">15</span><span class=\"line-content\"><span class=\"kw\">senão</span></span></div>\n              <div class=\"code-line\"><span class=\"line-num\">16</span><span class=\"line-content\">  <span class=\"kw\">retorne</span> FALSE</span></div>\n            </div>\n          </div>\n\n        <p><strong>Complexidade:</strong> Como as sub-rotinas executam apenas um número fixo de adições, subtrações e multiplicações de inteiros, <code>SEGMENTS-INTERSECT</code> opera no tempo estritamente constante $\\mathbf{O(1)}$. Se as coordenadas forem inteiras, o algoritmo é 100% livre de qualquer imprecisão numérica!</p>\n        "
  },
  {
    "id": "u15-5",
    "code": "UNIDADE 15.5 • CAP. 33 (SEÇÃO 33.2)",
    "pages": "pp. 831–838",
    "title": "33.2 Varredura de Linha (Sweep-Line) para Determinar se Qualquer Par de Segmentos se Cruza (ANY-SEGMENTS-INTERSECT)",
    "content": "\n        <p>A <strong>Seção 33.2</strong> (pp. 831–838) aborda um problema central: dado um conjunto $S$ de $n$ segmentos de reta no plano, determinar se <strong>quaisquer dois segmentos se interceptam</strong>.</p>\n\n        <h3>1. O Paradigma da Varredura de Linha (Sweep-Line)</h3>\n        <p>A abordagem de força bruta que testa todos os pares possíveis de segmentos invocaria <code>SEGMENTS-INTERSECT</code> exatamente $\\binom{n}{2} = \\frac{n(n-1)}{2} = \\Theta(n^2)$ vezes. No entanto, intuitivamente, dois segmentos distantes um do outro no plano jamais poderiam se interceptar!</p>\n        <p>O <strong>paradigma de varredura de linha</strong> (<em>sweep-line</em>) transforma uma dimensão espacial (a coordenada horizontal $x$) em uma dimensão temporal fictícia. Uma linha vertical imaginária $\\mathcal{L}$ varre o plano da esquerda para a direita, parando exclusivamente em pontos discretos denominados <strong>pontos de evento</strong> (<em>event points</em>).</p>\n\n        <h3>2. As Estruturas de Dados Fundamentais</h3>\n        <p>O algoritmo mantém duas estruturas de dados complementares:</p>\n        <ol>\n          <li><strong>Fila de Eventos ($Q$):</strong> Contém as $2n$ extremidades dos $n$ segmentos de entrada. Todos os pontos são pré-ordenados em ordem lexicográfica não decrescente de coordenada $x$. Em caso de empate na coordenada $x$, o desempate é feito pela menor coordenada $y$; se ambas coincidirem, prioriza-se a extremidade esquerda de um segmento antes da extremidade direita. A fila pode ser mantida como um arranjo estático ordenado em tempo $O(n \\lg n)$.</li>\n          <li><strong>Status da Linha de Varredura ($T$):</strong> Uma árvore de busca binária balanceada (como uma <strong>árvore rubro-negra</strong>, Capítulo 13) que armazena o conjunto de segmentos atualmente ativos — isto é, os segmentos que cortam a linha vertical $\\mathcal{L}$ no instante $x$ atual. Os segmentos em $T$ são mantidos ordenados pela relação de <strong>pré-ordem total vertical $\\le_x$</strong> de suas ordenadas $y$ de corte com a linha de varredura.</li>\n        </ol>\n\n        <h4>2.1 Comparação em $T$ sem Divisão nem Ponto Flutuante</h4>\n        <p>Para manter os segmentos ordenados em $T$, precisamos comparar dois segmentos ativos $s_1$ e $s_2$ na linha vertical $x$. Dizemos que $s_1 \\le_x s_2$ se a interseção de $s_1$ com $\\mathcal{L}$ ocorre em uma ordenada $y$ menor ou igual à de $s_2$.</p>\n        <p>Conforme demonstrado no Exercício 33.2-2 (p. 837), <em>não precisamos calcular as frações de interseção</em>! Como a linha $\\mathcal{L}$ passa por uma extremidade conhecida de um segmento no evento atual, basta avaliar a orientação relativa da outra extremidade em relação ao segmento vizinho usando nossa sub-rotina <code>DIRECTION</code> em tempo $O(1)$!</p>\n\n        <h3>3. O Algoritmo ANY-SEGMENTS-INTERSECT(S)</h3>\n        <p>O algoritmo processa as extremidades dos segmentos uma a uma da esquerda para a direita:</p>\n\n        <div class=\"clrs-pseudocode-box\">\n            <div class=\"pseudocode-header\">\n              <span class=\"proc-name\">ANY-SEGMENTS-INTERSECT(S)</span>\n              <span>[ Varredura de Linha em O(n lg n) (p. 834) ]</span>\n            </div>\n            <div class=\"pseudocode-lines\">\n              <div class=\"code-line\"><span class=\"line-num\">1</span><span class=\"line-content\">T = ∅</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">2</span><span class=\"line-content\">ordene os pontos finais dos segmentos em S da esquerda <span class=\"kw\">para</span> a direita,</span></div>\n              <div class=\"code-line\"><span class=\"line-num\"></span><span class=\"line-content\">      resolvendo empates pelo menor y (e extremidades esquerdas antes de direitas)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">3</span><span class=\"line-content\"><span class=\"kw\">para cada</span> ponto p na lista de extremidades ordenada</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">4</span><span class=\"line-content\">   <span class=\"kw\">se</span> p é a extremidade esquerda de um segmento s</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">5</span><span class=\"line-content\">       INSERT(T, s)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">6</span><span class=\"line-content\">       <span class=\"kw\">se</span> (ABOVE(T, s) existe e SEGMENTS-INTERSECT(s, ABOVE(T, s)))</span></div>\n              <div class=\"code-line\"><span class=\"line-num\"></span><span class=\"line-content\">              ou (BELOW(T, s) existe e SEGMENTS-INTERSECT(s, BELOW(T, s)))</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">7</span><span class=\"line-content\">           <span class=\"kw\">retorne</span> TRUE</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">8</span><span class=\"line-content\">   <span class=\"kw\">se</span> p é a extremidade direita de um segmento s</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">9</span><span class=\"line-content\">       <span class=\"kw\">se</span> (ABOVE(T, s) existe e BELOW(T, s) existe e</span></div>\n              <div class=\"code-line\"><span class=\"line-num\"></span><span class=\"line-content\">              SEGMENTS-INTERSECT(ABOVE(T, s), BELOW(T, s)))</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">10</span><span class=\"line-content\">          <span class=\"kw\">retorne</span> TRUE</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">11</span><span class=\"line-content\">      DELETE(T, s)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">12</span><span class=\"line-content\"><span class=\"kw\">retorne</span> FALSE</span></div>\n            </div>\n          </div>\n\n        <h3>4. Teorema 33.1 e Prova de Corretude (pp. 834–836)</h3>\n        <p><strong>Teorema 33.1:</strong> A chamada <code>ANY-SEGMENTS-INTERSECT(S)</code> devolve <code>TRUE</code> se e somente se existe pelo menos uma interseção entre os segmentos em $S$.</p>\n        <p><em>Demonstração:</em> Se o algoritmo devolve <code>TRUE</code> (linhas 7 ou 10), ele acabou de executar <code>SEGMENTS-INTERSECT</code> com sucesso em um par real de segmentos, logo a resposta é correta. Suponha agora que exista pelo menos uma interseção. Seja $p$ o <strong>ponto de interseção mais à esquerda</strong> (desempatando pelo menor $y$), e sejam $a$ e $b$ os segmentos que se cruzam em $p$.</p>\n        <p>Como não ocorre nenhuma interseção à esquerda de $p$, a ordem dos segmentos na árvore $T$ é perfeitamente preservada em toda a região à esquerda de $p$. Portanto, os segmentos $a$ e $b$ <strong>devem necessariamente tornar-se vizinhos consecutivos imediatos na árvore $T$</strong> em algum ponto de evento $q$ anterior ou coincidente com $p$:</p>\n        <ul>\n          <li>Se $a$ ou $b$ for inserido em $T$ enquanto o outro já estiver em $T$ como seu vizinho vertical adjacente, a condição da linha 6 detectará o cruzamento.</li>\n          <li>Se $a$ e $b$ já estiverem em $T$ mas separados por outros segmentos intermediários, à medida que a varredura avança esses segmentos intermediários devem terminar antes de $p$ (já que não podem cruzar nem $a$ nem $b$ antes de $p$). Quando o último segmento entre eles for removido na linha 11, $a$ e $b$ tornam-se vizinhos adjacentes imediatos, e a linha 9 testará e detectará sua interseção! $\\blacksquare$</li>\n        </ul>\n\n        <h3>5. Análise de Complexidade</h3>\n        <ul>\n          <li><strong>Ordenação Inicial dos Eventos (Linha 2):</strong> Com $n$ segmentos e $2n$ extremidades, a ordenação consome $O(2n \\lg(2n)) = \\mathbf{O(n \\lg n)}$ via Merge-Sort ou Heapsort.</li>\n          <li><strong>Laço de Varredura (Linhas 3–11):</strong> Executa exatamente $2n$ iterações. Em cada iteração, as operações na árvore rubro-negra $T$ (<code>INSERT</code>, <code>DELETE</code>, <code>ABOVE</code> e <code>BELOW</code>) consomem tempo $O(\\lg n)$ cada uma. As chamadas a <code>SEGMENTS-INTERSECT</code> consomem $O(1)$. Logo, cada evento é processado em tempo $O(\\lg n)$.</li>\n          <li><strong>Tempo Total de Execução:</strong> $O(n \\lg n) + 2n \\cdot O(\\lg n) = \\mathbf{O(n \\lg n)}$.</li>\n        </ul>\n        "
  },
  {
    "id": "u15-6",
    "code": "UNIDADE 15.6 • CAP. 33 (SEÇÕES 33.3 E 33.4)",
    "pages": "pp. 838–851",
    "title": "33.3 e 33.4 Envoltória Convexa (GRAHAM-SCAN, Marcha de Jarvis) e o Problema do Par de Pontos Mais Próximos",
    "content": "\n        <p>As <strong>Seções 33.3 e 33.4</strong> (pp. 838–851) concluem o estudo da geometria computacional com dois problemas geométricos fundamentais: a determinação da <strong>Envoltória Convexa</strong> e a localização do <strong>Par de Pontos Mais Próximos</strong>.</p>\n\n        <h3>1. Seção 33.3 — Envoltória Convexa (Convex Hull)</h3>\n        <h4>1.1 Definição Formal</h4>\n        <p>A <strong>envoltória convexa</strong> de um conjunto $Q$ de pontos no plano, denotada por $\\text{CH}(Q)$ (<em>Convex Hull</em>), é formalmente definida como o menor conjunto convexo contendo $Q$. Intuitivamente, se imaginarmos cada ponto de $Q$ como um prego fincado em uma tábua de madeira, a envoltória convexa é a forma assumida por um elástico de borracha esticado ao redor de todos os pregos.</p>\n        <p>O resultado é um <strong>polígono convexo</strong> cujos vértices são pontos de $Q$, orientados no sentido anti-horário ao longo de seu perímetro.</p>\n\n        <h4>1.2 O Algoritmo de Varredura de Graham (GRAHAM-SCAN, pp. 838–844)</h4>\n        <p>O algoritmo <code>GRAHAM-SCAN</code> resolve o problema da envoltória convexa no tempo ótimo $\\Theta(n \\lg n)$ utilizando uma técnica elegante de ordenação angular e manutenção de pilha:</p>\n\n        <div class=\"clrs-pseudocode-box\">\n            <div class=\"pseudocode-header\">\n              <span class=\"proc-name\">GRAHAM-SCAN(Q)</span>\n              <span>[ Varredura de Graham em Θ(n lg n) (p. 839) ]</span>\n            </div>\n            <div class=\"pseudocode-lines\">\n              <div class=\"code-line\"><span class=\"line-num\">1</span><span class=\"line-content\"><span class=\"kw\">seja</span> p_0 o ponto em Q com a menor coordenada y (ou o mais à esquerda em caso de empate)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">2</span><span class=\"line-content\">sejam ⟨p_1, p_2, ..., p_m⟩ os pontos restantes de Q ordenados por ângulo polar</span></div>\n              <div class=\"code-line\"><span class=\"line-num\"></span><span class=\"line-content\">      em relação a p_0 em sentido anti-horário</span></div>\n              <div class=\"code-line\"><span class=\"line-num\"></span><span class=\"line-content\">      (<span class=\"kw\">se</span> dois ou mais pontos tiverem o mesmo ângulo polar, descarte todos exceto o mais afastado de p_0)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">3</span><span class=\"line-content\"><span class=\"kw\">se</span> m < 2</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">4</span><span class=\"line-content\">   <span class=\"kw\">retorne</span> \"A envoltória convexa contém menos de 3 pontos\"</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">5</span><span class=\"line-content\"><span class=\"kw\">seja</span> S uma pilha vazia</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">6</span><span class=\"line-content\">PUSH(p_0, S)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">7</span><span class=\"line-content\">PUSH(p_1, S)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">8</span><span class=\"line-content\">PUSH(p_2, S)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">9</span><span class=\"line-content\"><span class=\"kw\">para</span> i = 3 até m</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">10</span><span class=\"line-content\">  <span class=\"kw\">enquanto</span> o ângulo formado por NEXT-TO-TOP(S), TOP(S) e p_i não fizer uma curva à esquerda</span></div>\n              <div class=\"code-line\"><span class=\"line-num\"></span><span class=\"line-content\">           (isto é, DIRECTION(NEXT-TO-TOP(S), TOP(S), p_i) ≥ 0)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">11</span><span class=\"line-content\">      POP(S)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">12</span><span class=\"line-content\">  PUSH(p_i, S)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">13</span><span class=\"line-content\"><span class=\"kw\">retorne</span> S</span></div>\n            </div>\n          </div>\n\n        <h4>1.3 Análise e Corretude de GRAHAM-SCAN</h4>\n        <ul>\n          <li><strong>Escolha do Ponto Âncora $p_0$:</strong> Encontrar o ponto de menor coordenada $y$ demora tempo $\\Theta(n)$. Como não existe nenhum ponto abaixo de $p_0$ e ele é o mais à esquerda entre os empates, $p_0$ é comprovadamente um vértice extremo de $\\text{CH}(Q)$.</li>\n          <li><strong>Ordenação Polar em $\\Theta(n \\lg n)$:</strong> Ordenar os $n - 1$ pontos pelo ângulo polar em relação a $p_0$ requer comparações de produtos vetoriais <code>DIRECTION(p_0, p_i, p_j)</code> em tempo $O(1)$. A ordenação completa consome $\\Theta(n \\lg n)$ via Merge-Sort.</li>\n          <li><strong>Análise Amortizada das Operações de Pilha:</strong> Na linha 12, cada ponto $p_i$ é empilhado (<code>PUSH</code>) <em>exatamente uma vez</em> ao longo de todo o laço. Um ponto que já está na pilha só é desempilhado (<code>POP</code>) na linha 11, e uma vez removido, <em>jamais retorna à pilha</em>! Portanto, o número total de operações <code>POP</code> executadas em todo o algoritmo é estritamente limitado por $m \\le n$. Pelo método agregado da análise amortizada, o tempo total gasto com operações de pilha no laço das linhas 9–12 é estritamente $\\mathbf{O(n)}$.</li>\n          <li><strong>Complexidade Global Ótima:</strong> $\\Theta(n) + \\Theta(n \\lg n) + O(n) = \\mathbf{\\Theta(n \\lg n)}$. Pelo Teorema 33.2 (Exercício 33.3-2), qualquer algoritmo baseado em comparações para construir a envoltória convexa requer $\\Omega(n \\lg n)$ no pior caso (por redução direta da ordenação). Logo, <code>GRAHAM-SCAN</code> é <strong>assintoticamente ótimo</strong>!</li>\n        </ul>\n\n        <h4>1.4 A Marcha de Jarvis (Embrulho de Presente, pp. 844–845)</h4>\n        <p>A <strong>Marcha de Jarvis</strong> (<em>Jarvis's march</em> ou <em>gift wrapping</em>) adota uma abordagem física de \"embrulho de pacote\":</p>\n        <ol>\n          <li>Inicia em $p_0$ (o mesmo ponto de menor ordenada $y$).</li>\n          <li>Em cada passo, para encontrar o próximo vértice da envoltória a partir do vértice atual $p$, varre todos os $n$ pontos e seleciona aquele que possui o <strong>menor ângulo polar</strong> (isto é, aquele em relação ao qual todos os outros pontos ficam à esquerda).</li>\n          <li>Constrói a <strong>cadeia da direita</strong> até atingir o vértice mais alto $p_k$, e depois constrói a <strong>cadeia da esquerda</strong> até retornar a $p_0$.</li>\n        </ol>\n        <p><strong>Tempo de Execução $O(nh)$:</strong> Se $h$ denota o número de vértices que de fato compõem a envoltória convexa $\\text{CH}(Q)$, a Marcha de Jarvis efetua $h$ passos de varredura linear, consumindo tempo $\\mathbf{O(nh)}$.</p>\n        <p><em>Comparação com Graham:</em> Jarvis é um algoritmo <strong>sensível à saída</strong> (<em>output-sensitive</em>). Se a envoltória tiver poucos vértices (por exemplo, $h = O(1)$ ou $h = o(\\lg n)$), Jarvis opera em tempo linear $O(n)$, superando a varredura de Graham! Todavia, no pior caso em que todos os $n$ pontos residem na envoltória (como em pontos distribuídos sobre uma circunferência, onde $h = n$), o tempo de Jarvis degenera para $\\mathbf{\\Theta(n^2)}$.</p>\n\n        <h3>2. Seção 33.4 — O Problema do Par de Pontos Mais Próximos (pp. 845–851)</h3>\n        <h4>2.1 Definição do Problema</h4>\n        <p>Dado um conjunto $Q$ de $n \\ge 2$ pontos no plano, encontrar dois pontos $p_1, p_2 \\in Q$ cuja distância euclidiana $d(p_1, p_2) = \\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$ seja mínima.</p>\n        <p>A força bruta calcula as distâncias de todos os $\\binom{n}{2}$ pares em $\\Theta(n^2)$. A Seção 33.4 projeta um formidável algoritmo de <strong>Divisão e Conquista</strong> em $\\mathbf{\\Theta(n \\lg n)}$.</p>\n\n        <h4>2.2 Estrutura do Algoritmo de Divisão e Conquista</h4>\n        <ol>\n          <li><strong>Pré-ordenação Inicial:</strong> Em $O(n \\lg n)$, criamos dois arranjos: $X$ contendo os pontos ordenados por coordenada $x$ crescente, e $Y$ contendo os pontos ordenados por coordenada $y$ crescente. Esses arranjos são particionados em tempo linear nas chamadas recursivas, evitando qualquer ordenação repetida!</li>\n          <li><strong>Divisão:</strong> Traçamos uma linha vertical imaginária $l : x = \\hat{x}$ pela mediana de $X$, particionando o conjunto $P$ em dois subconjuntos $P_L$ e $P_R$ de tamanhos $\\lceil |P|/2 \\rceil$ e $\\lfloor |P|/2 \\rfloor$.</li>\n          <li><strong>Conquista:</strong> Chamamos recursivamente o algoritmo para encontrar a menor distância $\\delta_L$ em $P_L$ e $\\delta_R$ em $P_R$. Definimos:\n            $$\\delta = \\min(\\delta_L, \\delta_R)$$</li>\n          <li><strong>Combinação e a Faixa Central $2\\delta$:</strong> O par mais próximo global ou reside inteiramente em $P_L$ (distância $\\delta_L$), ou reside inteiramente em $P_R$ (distância $\\delta_R$), ou possui um ponto em $P_L$ e outro em $P_R$. Se houver um par que cruza a linha divisória com distância $< \\delta$, ambos os pontos devem residir dentro de uma <strong>faixa vertical de largura $2\\delta$</strong> centrada em $l$:\n            $$|p.x - \\hat{x}| < \\delta$$\n            Construímos o arranjo filtrado $Y'$ selecionando os pontos de $Y$ que caem nessa faixa em tempo estritamente $\\Theta(n)$.</li>\n        </ol>\n\n        <h4>2.3 O Lema Geométrico de Densidade (No Máximo 7 Comparações!)</h4>\n        <p>Como verificar os pontos de $Y'$ sem cair no pior caso quadrático? A resposta reside em uma das propriedades geométricas mais belas do CLRS (pp. 848–849):</p>\n        <ul>\n          <li>Para qualquer ponto $p \\in Y'$, qualquer candidato $q \\in Y'$ a estar a uma distância $< \\delta$ de $p$ deve ter coordenada $y$ no intervalo $[p.y, p.y + \\delta]$.</li>\n          <li>Portanto, $p$ e $q$ devem residir dentro de um retângulo de largura $2\\delta$ e altura $\\delta$ bissectado pela reta $l$, formando dois quadrados de dimensões $\\delta \\times \\delta$ (um do lado esquerdo em $P_L$ e outro do lado direito em $P_R$).</li>\n          <li>Como quaisquer dois pontos em $P_L$ distam pelo menos $\\delta_L \\ge \\delta$ entre si, <strong>no máximo 4 pontos de $P_L$ podem caber dentro do quadrado esquerdo $\\delta \\times \\delta$</strong> (um em cada vértice do quadrado).</li>\n          <li>Pela mesma razão, <strong>no máximo 4 pontos de $P_R$ podem caber no quadrado direito $\\delta \\times \\delta$</strong>.</li>\n          <li>Consequentemente, o retângulo $2\\delta \\times \\delta$ pode conter <strong>no máximo 8 pontos no total</strong>! Como o próprio ponto $p$ é um desses pontos, <strong>restam no máximo 7 outros pontos</strong> a serem verificados!</li>\n        </ul>\n        <p>Portanto, no arranjo $Y'$, basta comparar cada ponto $p$ com no máximo os <strong>7 pontos subsequentes</strong> na ordem de $y$! O laço de combinação executa no máximo $7n$ comparações de distância, consumindo tempo estritamente $\\mathbf{O(n)}$.</p>\n\n        <h4>2.4 Recorrência e Complexidade</h4>\n        <p>A recorrência que descreve o tempo de execução do algoritmo divide o problema em dois subproblemas de tamanho $n/2$ com etapa de combinação linear:</p>\n        $$T(n) = 2T(n/2) + O(n)$$\n        <p>Pelo Caso 2 do Teorema Mestre ($a = 2, b = 2, \\log_2 2 = 1$ e $f(n) = \\Theta(n)$):</p>\n        $$T(n) = \\mathbf{\\Theta(n \\lg n)}$$\n        "
  }
];


  function initWorkbenches() {
    const mount = document.getElementById("workbench-mod15-mount");
    if (!mount || mount.dataset.initialized === "true") return;
    mount.dataset.initialized = "true";

    mount.innerHTML = `
      <div class="workbench-box" style="margin-top:1.5rem;">
        <div class="workbench-header">
          <span class="workbench-title">[ BANCADA INTERATIVA DUPLA • MÓDULO 15: KMP & GEOMETRIA COMPUTACIONAL (CAPS. 32–33) ]</span>
          <span class="bracket-tag emerald">KMP • TABELA π • GRAHAM-SCAN • INTERSEÇÃO</span>
        </div>
        <div class="workbench-body">
          <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
            Explore os algoritmos canônicos dos Capítulos 32 e 33 do CLRS:
            <strong>(Laboratório 01)</strong> a construção da função de prefixo $\\pi[1..m]$, a eliminação de retrocesso no texto via KMP e a visualização do potencial amortizado $\\Phi = q$;
            <strong>(Laboratório 02)</strong> a geometria computacional exata sem divisões, visualizando o teste de orientação $\\text{DIRECTION}$, a detecção robusta de interseção de segmentos e o algoritmo $\\text{GRAHAM-SCAN}$ com pilha e curvas à esquerda/direita.
          </p>

          <div style="display:flex;gap:0.6rem;flex-wrap:wrap;margin-bottom:1.1rem;border-bottom:2px solid var(--ink-primary);padding-bottom:0.8rem;">
            <button id="m15-tab-kmp" class="wb-btn primary">[ LABORATÓRIO 01: SIMULADOR KMP & TABELA DE PREFIXO π (CAP. 32) ]</button>
            <button id="m15-tab-geom" class="wb-btn">[ LABORATÓRIO 02: SIMULADOR GEOMÉTRICO: GRAHAM-SCAN & INTERSEÇÃO (CAP. 33) ]</button>
          </div>

          <!-- PAINEL 1: KMP & TABELA PI -->
          <div id="m15-panel-kmp" style="display:block;">
            <div style="background:var(--bg-card);border:var(--border-thin);padding:1rem;margin-bottom:1rem;">
              <div class="workbench-controls" style="display:flex;gap:14px;flex-wrap:wrap;align-items:center;margin-bottom:12px;">
                <label style="font-family:var(--font-mono);font-weight:700;font-size:0.78rem;">Predefinição:
                  <select id="m15-kmp-preset" class="search-input-brutal" style="margin-left:6px;min-width:240px;">
                    <option value="clrs">CLRS Canônico: T="BACBABABABACACA", P="ABABACA"</option>
                    <option value="ex3241">Exercício 32.4-1: P="ababbabbabbababbabb"</option>
                    <option value="dna">Sequência Genética: T="GATCGATAGCTAGATCGATCGATC", P="GATCGATC"</option>
                    <option value="custom">Entrada Personalizada</option>
                  </select>
                </label>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:12px;">
                <div>
                  <label style="font-family:var(--font-mono);font-weight:700;font-size:0.78rem;display:block;margin-bottom:4px;">Texto T[1 .. n]:</label>
                  <input id="m15-kmp-t-input" type="text" value="BACBABABABACACA" class="search-input-brutal" style="width:100%;box-sizing:border-box;font-family:var(--font-mono);" />
                </div>
                <div>
                  <label style="font-family:var(--font-mono);font-weight:700;font-size:0.78rem;display:block;margin-bottom:4px;">Padrão P[1 .. m]:</label>
                  <input id="m15-kmp-p-input" type="text" value="ABABACA" class="search-input-brutal" style="width:100%;box-sizing:border-box;font-family:var(--font-mono);" />
                </div>
              </div>

              <!-- Tabela Pi Visual -->
              <div style="margin-bottom:14px;">
                <div style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;margin-bottom:4px;color:var(--accent-amber-dark);">Tabela de Função de Prefixo π[1 .. m]:</div>
                <div id="m15-kmp-pi-table" class="canonical-table-wrap"></div>
              </div>

              <!-- Controles Passo a Passo KMP -->
              <div class="workbench-controls" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                <button id="m15-kmp-btn-prev" class="wb-btn">◀ Passo Anterior</button>
                <button id="m15-kmp-btn-next" class="wb-btn primary">Próximo Passo ▶</button>
                <button id="m15-kmp-btn-auto" class="wb-btn">▶ Execução Automática</button>
                <button id="m15-kmp-btn-reset" class="wb-btn">↺ Reiniciar</button>
                <span id="m15-kmp-step-info" style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;color:var(--accent-amber-dark);"></span>
              </div>

              <!-- Visualização Alinhamento Texto / Padrão -->
              <div id="m15-kmp-vis-stage" style="background:var(--bg-paper);padding:14px;border:var(--border-thin);overflow-x:auto;margin-bottom:12px;font-family:var(--font-mono);"></div>

              <!-- Telemetria e Logs -->
              <div id="m15-kmp-log" class="wb-log-panel"></div>
            </div>
          </div>

          <!-- PAINEL 2: GEOMETRIA COMPUTACIONAL -->
          <div id="m15-panel-geom" style="display:none;">
            <!-- Sub-abas da Geometria -->
            <div style="display:flex;gap:8px;margin-bottom:12px;">
              <button id="m15-subtab-graham" class="wb-btn primary">[ 1. FECHO CONVEXO: GRAHAM-SCAN ]</button>
              <button id="m15-subtab-orient" class="wb-btn">[ 2. TESTE DE ORIENTAÇÃO & INTERSEÇÃO ]</button>
            </div>

            <!-- SUBPAINEL A: GRAHAM SCAN -->
            <div id="m15-geom-panel-graham" style="background:var(--bg-card);border:var(--border-thin);padding:1rem;">
              <div class="workbench-controls" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                <label style="font-family:var(--font-mono);font-weight:700;font-size:0.78rem;">Conjunto de Pontos Q:
                  <select id="m15-graham-preset" class="search-input-brutal" style="margin-left:6px;">
                    <option value="clrs">CLRS Canônico (Fig. 33.7, p. 840 — 8 pontos)</option>
                    <option value="random">12 Pontos Aleatórios</option>
                    <option value="collinear">Pontos Colineares (Caso de Borda)</option>
                  </select>
                </label>
                <button id="m15-graham-btn-step" class="wb-btn primary">Avançar Passo a Passo ▶</button>
                <button id="m15-graham-btn-run" class="wb-btn">Calcular Fecho Completo</button>
                <button id="m15-graham-btn-reset" class="wb-btn">↺ Reiniciar</button>
                <span id="m15-graham-step-info" style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;color:var(--accent-amber-dark);"></span>
              </div>

              <div style="display:grid;grid-template-columns:1fr 280px;gap:14px;">
                <div style="background:var(--bg-paper);padding:10px;border:var(--border-thin);display:flex;justify-content:center;align-items:center;">
                  <svg id="m15-graham-svg" width="460" height="320" viewBox="0 0 460 320" style="background:#111;border:2px solid #111;box-shadow:var(--shadow-brutal-sm);"></svg>
                </div>
                <div style="display:flex;flex-direction:column;gap:10px;">
                  <div style="background:var(--bg-elevated);border:var(--border-thin);padding:10px;">
                    <div style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;margin-bottom:4px;color:var(--accent-amber-dark);">Estado da Pilha S:</div>
                    <div id="m15-graham-stack-view" style="font-family:var(--font-mono);font-size:0.82rem;line-height:1.5;"></div>
                  </div>
                  <div id="m15-graham-log" class="wb-log-panel" style="flex:1;max-height:220px;overflow-y:auto;"></div>
                </div>
              </div>
            </div>

            <!-- SUBPAINEL B: ORIENTAÇÃO E INTERSEÇÃO -->
            <div id="m15-geom-panel-orient" style="display:none;background:var(--bg-card);border:var(--border-thin);padding:1rem;">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <!-- DIRECTION -->
                <div style="background:var(--bg-elevated);border:var(--border-thin);padding:1rem;">
                  <div style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;color:var(--accent-amber-dark);margin-bottom:6px;">
                    [ PRODUTO VETORIAL & TESTE DIRECTION(p₀, p₁, p₂) ]
                  </div>
                  <p style="font-size:0.8rem;color:var(--ink-secondary);margin-bottom:8px;">
                    Calcula $(p_2.x - p_0.x)(p_1.y - p_0.y) - (p_1.x - p_0.x)(p_2.y - p_0.y)$ e determina se a curva em $p_1$ vira à esquerda (&gt; 0), à direita (&lt; 0) ou é colinear (= 0).
                  </p>
                  <div style="background:var(--bg-paper);padding:8px;border:var(--border-thin);display:flex;justify-content:center;">
                    <svg id="m15-orient-svg" width="280" height="200" viewBox="0 0 280 200" style="background:#111;border:2px solid #111;"></svg>
                  </div>
                  <div id="m15-orient-result" class="wb-log-panel" style="margin-top:8px;"></div>
                </div>

                <!-- SEGMENTS-INTERSECT -->
                <div style="background:var(--bg-elevated);border:var(--border-thin);padding:1rem;">
                  <div style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;color:var(--accent-emerald-dark);margin-bottom:6px;">
                    [ TESTE ROBUSTO SEGMENTS-INTERSECT(p₁, p₂, p₃, p₄) ]
                  </div>
                  <p style="font-size:0.8rem;color:var(--ink-secondary);margin-bottom:8px;">
                    Combina 4 chamadas a <code>DIRECTION</code> e o teste de fronteira <code>ON-SEGMENT</code>. Arraste ou selecione cenários:
                  </p>
                  <div style="margin-bottom:8px;">
                    <select id="m15-intersect-preset" class="search-input-brutal" style="width:100%;">
                      <option value="cross">Interseção Regular em X (d₁ e d₂ têm sinais opostos)</option>
                      <option value="collinear-overlap">Colinear com Sobreposição (ON-SEGMENT = true)</option>
                      <option value="collinear-disjoint">Colinear Disjunto (ON-SEGMENT = false)</option>
                      <option value="parallel">Paralelos Não Colineares</option>
                      <option value="t-junction">Encontro em T (Vértice toca o outro segmento)</option>
                    </select>
                  </div>
                  <div style="background:var(--bg-paper);padding:8px;border:var(--border-thin);display:flex;justify-content:center;">
                    <svg id="m15-intersect-svg" width="280" height="170" viewBox="0 0 280 170" style="background:#111;border:2px solid #111;"></svg>
                  </div>
                  <div id="m15-intersect-result" class="wb-log-panel" style="margin-top:8px;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // -------------------------------------------------------------
    // LÓGICA DE TROCA DE ABAS
    // -------------------------------------------------------------
    const tabKmp = document.getElementById("m15-tab-kmp");
    const tabGeom = document.getElementById("m15-tab-geom");
    const panelKmp = document.getElementById("m15-panel-kmp");
    const panelGeom = document.getElementById("m15-panel-geom");

    tabKmp.addEventListener("click", () => {
      tabKmp.className = "wb-btn primary";
      tabGeom.className = "wb-btn";
      panelKmp.style.display = "block";
      panelGeom.style.display = "none";
    });

    tabGeom.addEventListener("click", () => {
      tabGeom.className = "wb-btn primary";
      tabKmp.className = "wb-btn";
      panelGeom.style.display = "block";
      panelKmp.style.display = "none";
      renderGraham();
      updateIntersect();
    });

    // Sub-abas Geometria
    const subtabGraham = document.getElementById("m15-subtab-graham");
    const subtabIntersect = document.getElementById("m15-subtab-intersect");
    const viewGraham = document.getElementById("m15-geom-graham-view");
    const viewIntersect = document.getElementById("m15-geom-intersect-view");

    subtabGraham.addEventListener("click", () => {
      subtabGraham.style.background = "#3b82f6";
      subtabGraham.style.color = "#fff";
      subtabIntersect.style.background = "#1e293b";
      subtabIntersect.style.color = "#94a3b8";
      viewGraham.style.display = "block";
      viewIntersect.style.display = "none";
      renderGraham();
    });

    subtabIntersect.addEventListener("click", () => {
      subtabIntersect.style.background = "#3b82f6";
      subtabIntersect.style.color = "#fff";
      subtabGraham.style.background = "#1e293b";
      subtabGraham.style.color = "#94a3b8";
      viewIntersect.style.display = "block";
      viewGraham.style.display = "none";
      updateIntersect();
    });

    // -------------------------------------------------------------
    // MOTOR 1: KMP & TABELA DE PREFIXO PI
    // -------------------------------------------------------------
    let kmpText = "BACBABABABACACA";
    let kmpPat = "ABABACA";
    let kmpPi = [];
    let kmpSteps = [];
    let kmpCurrentStep = 0;
    let kmpTimer = null;

    function computePrefixFunction(P) {
      const m = P.length;
      const pi = new Array(m + 1).fill(0);
      let k = 0;
      for (let q = 2; q <= m; q++) {
        while (k > 0 && P[k] !== P[q - 1]) {
          k = pi[k];
        }
        if (P[k] === P[q - 1]) {
          k++;
        }
        pi[q] = k;
      }
      return pi;
    }

    function buildKmpSteps(T, P, pi) {
      const steps = [];
      const n = T.length;
      const m = P.length;
      let q = 0;
      const matches = [];

      steps.push({
        i: 0,
        q: 0,
        s: 0,
        action: "Início",
        matches: [],
        explain: "Estado inicial: q = 0 caracteres casados. O ponteiro de texto i começará em 1."
      });

      for (let i = 1; i <= n; i++) {
        // Enquanto houver descasamento e q > 0
        while (q > 0 && P[q] !== T[i - 1]) {
          const oldQ = q;
          q = pi[q];
          steps.push({
            i: i,
            q: q,
            s: i - 1 - q,
            action: "Recuo via π",
            comparing: { tIdx: i, pIdx: oldQ + 1, match: false },
            matches: [...matches],
            explain: `Descasamento em T[${i}]='${T[i - 1]}' com P[${oldQ + 1}]='${P[oldQ]}'. KMP consulta π[${oldQ}] = ${q}. O padrão desliza sem retroceder o índice i do texto!`
          });
        }

        const isMatch = P[q] === T[i - 1];
        if (isMatch) {
          q++;
          steps.push({
            i: i,
            q: q,
            s: i - q,
            action: "Caractere Casado",
            comparing: { tIdx: i, pIdx: q, match: true },
            matches: [...matches],
            explain: `Coincidência: T[${i}]='${T[i - 1]}' == P[${q}]='${P[q - 1]}'. O estado avança para q = ${q}.`
          });
        } else {
          steps.push({
            i: i,
            q: 0,
            s: i,
            action: "Descasamento Total",
            comparing: { tIdx: i, pIdx: 1, match: false },
            matches: [...matches],
            explain: `Descasamento em T[${i}]='${T[i - 1]}' com P[1]='${P[0]}'. Nenhum prefixo coincide (q = 0). O ponteiro i avança.`
          });
        }

        if (q === m) {
          const shift = i - m;
          matches.push(shift);
          const oldQ = q;
          q = pi[q];
          steps.push({
            i: i,
            q: q,
            s: i - q,
            action: "OCORRÊNCIA COMPLETA!",
            matches: [...matches],
            isComplete: true,
            explain: `🎯 Ocorrência completa encontrada com deslocamento s = ${shift} (trecho T[${shift + 1}..${i}]). Pela linha 12, KMP consulta π[${oldQ}] = ${q} para buscar ocorrências sobrepostas subsequentes.`
          });
        }
      }

      return steps;
    }

    function renderPiTable() {
      const container = document.getElementById("m15-kmp-pi-table-container");
      let html = `<table style="width: 100%; border-collapse: collapse; font-family: monospace; font-size: 0.9rem; text-align: center;">`;
      html += `<tr style="background: #1e293b; color: #94a3b8;"><td style="padding: 6px; border: 1px solid #334155; font-weight: 700;">q (índice)</td>`;
      for (let q = 1; q <= kmpPat.length; q++) {
        html += `<td style="padding: 6px; border: 1px solid #334155; color: #38bdf8;">${q}</td>`;
      }
      html += `</tr><tr style="background: #0f172a; color: #f8fafc;"><td style="padding: 6px; border: 1px solid #334155; font-weight: 700;">P[q]</td>`;
      for (let q = 0; q < kmpPat.length; q++) {
        html += `<td style="padding: 6px; border: 1px solid #334155; font-weight: 700; color: #f43f5e;">${kmpPat[q]}</td>`;
      }
      html += `</tr><tr style="background: #1e293b; color: #a78bfa; font-weight: 700;"><td style="padding: 6px; border: 1px solid #334155;">π[q]</td>`;
      for (let q = 1; q <= kmpPat.length; q++) {
        html += `<td style="padding: 6px; border: 1px solid #334155; color: #fbbf24;">${kmpPi[q]}</td>`;
      }
      html += `</tr></table>`;
      container.innerHTML = html;
    }

    function renderKmpStep() {
      const step = kmpSteps[kmpCurrentStep];
      if (!step) return;

      document.getElementById("m15-kmp-step-info").innerText = `Passo ${kmpCurrentStep} / ${kmpSteps.length - 1}`;
      document.getElementById("m15-kmp-stat-i").innerText = step.i;
      document.getElementById("m15-kmp-stat-q").innerText = step.q;
      document.getElementById("m15-kmp-stat-s").innerText = step.s;
      document.getElementById("m15-kmp-stat-matches").innerText = step.matches.length;
      document.getElementById("m15-kmp-explanation").innerHTML = step.explain;

      // Render da fita
      const tape = document.getElementById("m15-kmp-tape-container");
      let html = `<div style="font-family: monospace; display: flex; flex-direction: column; gap: 6px;">`;

      // Linha 1: Índices do texto
      html += `<div style="display: flex; gap: 3px; align-items: center;">`;
      html += `<span style="width: 70px; font-size: 0.75rem; color: #64748b;">Índices:</span>`;
      for (let idx = 1; idx <= kmpText.length; idx++) {
        const isCurrent = idx === step.i;
        html += `<div style="width: 28px; text-align: center; font-size: 0.72rem; color: ${isCurrent ? "#38bdf8" : "#64748b"}; font-weight: ${isCurrent ? "700" : "400"};">${idx}</div>`;
      }
      html += `</div>`;

      // Linha 2: Fita do Texto
      html += `<div style="display: flex; gap: 3px; align-items: center;">`;
      html += `<span style="width: 70px; font-size: 0.8rem; font-weight: 700; color: #38bdf8;">Texto T:</span>`;
      for (let idx = 1; idx <= kmpText.length; idx++) {
        const isCurrent = idx === step.i;
        const char = kmpText[idx - 1];
        let bg = "#1e293b";
        let border = "#334155";
        let color = "#f8fafc";

        if (isCurrent) {
          border = "#38bdf8";
          bg = "#0284c7";
          color = "#ffffff";
        } else if (idx <= step.i && idx > step.i - step.q) {
          bg = "#065f46";
          border = "#10b981";
        }

        html += `<div style="width: 28px; height: 32px; display: flex; align-items: center; justify-content: center; background: ${bg}; border: 2px solid ${border}; border-radius: 4px; font-weight: 700; color: ${color}; font-size: 0.95rem;">${char}</div>`;
      }
      html += `</div>`;

      // Linha 3: Ponteiro
      html += `<div style="display: flex; gap: 3px; align-items: center;">`;
      html += `<span style="width: 70px;"></span>`;
      for (let idx = 1; idx <= kmpText.length; idx++) {
        const isCurrent = idx === step.i;
        html += `<div style="width: 28px; text-align: center; color: #38bdf8; font-weight: 700;">${isCurrent ? "▲" : ""}</div>`;
      }
      html += `</div>`;

      // Linha 4: Fita do Padrão Deslocado
      html += `<div style="display: flex; gap: 3px; align-items: center; margin-top: 4px;">`;
      html += `<span style="width: 70px; font-size: 0.8rem; font-weight: 700; color: #f43f5e;">Padrão P:</span>`;
      const padOffset = step.s;
      for (let idx = 1; idx <= kmpText.length; idx++) {
        const pCharIdx = idx - padOffset;
        if (pCharIdx >= 1 && pCharIdx <= kmpPat.length) {
          const char = kmpPat[pCharIdx - 1];
          let bg = "#334155";
          let border = "#475569";
          let color = "#f8fafc";

          if (pCharIdx <= step.q) {
            bg = "#065f46";
            border = "#10b981";
            color = "#a7f3d0";
          } else if (step.comparing && pCharIdx === step.comparing.pIdx) {
            bg = step.comparing.match ? "#065f46" : "#7f1d1d";
            border = step.comparing.match ? "#10b981" : "#ef4444";
          }

          html += `<div style="width: 28px; height: 32px; display: flex; align-items: center; justify-content: center; background: ${bg}; border: 2px solid ${border}; border-radius: 4px; font-weight: 700; color: ${color}; font-size: 0.95rem;">${char}</div>`;
        } else {
          html += `<div style="width: 28px; height: 32px;"></div>`;
        }
      }
      html += `</div></div>`;
      tape.innerHTML = html;
    }

    function initKmp() {
      kmpText = document.getElementById("m15-kmp-t-input").value.trim().toUpperCase() || "BACBABABABACACA";
      kmpPat = document.getElementById("m15-kmp-p-input").value.trim().toUpperCase() || "ABABACA";
      kmpPi = computePrefixFunction(kmpPat);
      kmpSteps = buildKmpSteps(kmpText, kmpPat, kmpPi);
      kmpCurrentStep = 0;
      if (kmpTimer) { clearInterval(kmpTimer); kmpTimer = null; }
      renderPiTable();
      renderKmpStep();
    }

    document.getElementById("m15-kmp-load").addEventListener("click", initKmp);
    document.getElementById("m15-kmp-next").addEventListener("click", () => {
      if (kmpCurrentStep < kmpSteps.length - 1) {
        kmpCurrentStep++;
        renderKmpStep();
      }
    });
    document.getElementById("m15-kmp-prev").addEventListener("click", () => {
      if (kmpCurrentStep > 0) {
        kmpCurrentStep--;
        renderKmpStep();
      }
    });
    document.getElementById("m15-kmp-reset").addEventListener("click", () => {
      kmpCurrentStep = 0;
      if (kmpTimer) { clearInterval(kmpTimer); kmpTimer = null; }
      renderKmpStep();
    });
    document.getElementById("m15-kmp-auto").addEventListener("click", () => {
      if (kmpTimer) {
        clearInterval(kmpTimer);
        kmpTimer = null;
        document.getElementById("m15-kmp-auto").innerText = "▶ Executar Tudo";
      } else {
        document.getElementById("m15-kmp-auto").innerText = "⏸ Pausar";
        kmpTimer = setInterval(() => {
          if (kmpCurrentStep < kmpSteps.length - 1) {
            kmpCurrentStep++;
            renderKmpStep();
          } else {
            clearInterval(kmpTimer);
            kmpTimer = null;
            document.getElementById("m15-kmp-auto").innerText = "▶ Executar Tudo";
          }
        }, 500);
      }
    });

    document.getElementById("m15-kmp-preset").addEventListener("change", (e) => {
      const v = e.target.value;
      if (v === "clrs") {
        document.getElementById("m15-kmp-t-input").value = "BACBABABABACACA";
        document.getElementById("m15-kmp-p-input").value = "ABABACA";
      } else if (v === "ex3241") {
        document.getElementById("m15-kmp-t-input").value = "ababbabbabbababbabb".toUpperCase();
        document.getElementById("m15-kmp-p-input").value = "ababb".toUpperCase();
      } else if (v === "dna") {
        document.getElementById("m15-kmp-t-input").value = "GATCGATAGCTAGATCGATCGATC";
        document.getElementById("m15-kmp-p-input").value = "GATCGATC";
      }
      initKmp();
    });

    initKmp();

    // -------------------------------------------------------------
    // MOTOR 2A: GRAHAM SCAN
    // -------------------------------------------------------------
    let grahamRawPoints = [
      { id: 0, x: 220, y: 310, label: "p₀" },
      { id: 1, x: 340, y: 280, label: "p₁" },
      { id: 2, x: 420, y: 220, label: "p₂" },
      { id: 3, x: 380, y: 120, label: "p₃" },
      { id: 4, x: 280, y: 70,  label: "p₄" },
      { id: 5, x: 150, y: 90,  label: "p₅" },
      { id: 6, x: 70,  y: 180, label: "p₆" },
      { id: 7, x: 180, y: 220, label: "p₇" },
      { id: 8, x: 260, y: 190, label: "p₈" },
      { id: 9, x: 220, y: 140, label: "p₉" }
    ];

    let grahamSteps = [];
    let grahamCurrentStep = 0;
    let grahamTimer = null;

    function crossProduct2D(a, b, c) {
      // (c.x - a.x)*(b.y - a.y) - (b.x - a.x)*(c.y - a.y)
      // Atenção: no SVG, y cresce para baixo, logo invertemos o sinal de y para coerência cartesiana!
      const ax = a.x, ay = 360 - a.y;
      const bx = b.x, by = 360 - b.y;
      const cx = c.x, cy = 360 - c.y;
      return (cx - ax) * (by - ay) - (bx - ax) * (cy - ay);
    }

    function buildGrahamSteps(points) {
      const steps = [];
      if (points.length < 3) return steps;

      // 1. Achar p0 (menor y real, ou maior y SVG; desempate pelo menor x)
      let p0 = points[0];
      for (const p of points) {
        if (p.y > p0.y || (p.y === p0.y && p.x < p0.x)) {
          p0 = p;
        }
      }

      steps.push({
        type: "p0",
        p0: p0,
        stack: [p0],
        sorted: [],
        explain: `Ponto âncora p₀ = (${p0.x}, ${360 - p0.y}) selecionado como menor ordenada y no plano cartesiano.`
      });

      // 2. Ordenar os outros por ângulo polar em relação a p0
      const rest = points.filter(p => p !== p0);
      rest.sort((a, b) => {
        const cp = crossProduct2D(p0, a, b);
        if (cp === 0) {
          const distA = Math.hypot(a.x - p0.x, a.y - p0.y);
          const distB = Math.hypot(b.x - p0.x, b.y - p0.y);
          return distA - distB;
        }
        return cp > 0 ? 1 : -1;
      });

      const sorted = [p0, ...rest];
      steps.push({
        type: "sorted",
        p0: p0,
        stack: [sorted[0], sorted[1], sorted[2]],
        sorted: sorted,
        candidateIdx: 2,
        explain: `Pontos ordenados por ângulo polar anti-horário em relação a p₀. Pilha inicializada com ⟨${sorted[0].label}, ${sorted[1].label}, ${sorted[2].label}⟩.`
      });

      const stack = [sorted[0], sorted[1], sorted[2]];

      for (let i = 3; i < sorted.length; i++) {
        const pi = sorted[i];

        while (stack.length >= 2) {
          const top = stack[stack.length - 1];
          const nextToTop = stack[stack.length - 2];
          const cp = crossProduct2D(nextToTop, top, pi);

          if (cp < 0) {
            // Curva à esquerda estrita (no sistema cartesiano cp < 0 pela nossa convenção DIRECTION)
            steps.push({
              type: "eval",
              stack: [...stack],
              sorted: sorted,
              p0: p0,
              nextToTop: nextToTop,
              top: top,
              pi: pi,
              cp: cp,
              isLeft: true,
              explain: `DIRECTION(${nextToTop.label}, ${top.label}, ${pi.label}) < 0: Curva à ESQUERDA (válida). Empilha ${pi.label}.`
            });
            break;
          } else {
            // Curva à direita ou colinear: POP!
            steps.push({
              type: "eval",
              stack: [...stack],
              sorted: sorted,
              p0: p0,
              nextToTop: nextToTop,
              top: top,
              pi: pi,
              cp: cp,
              isLeft: false,
              explain: `DIRECTION(${nextToTop.label}, ${top.label}, ${pi.label}) ≥ 0: Curva à DIREITA ou colinear! Não-convexo: remove ${top.label} da pilha (POP).`
            });
            stack.pop();
          }
        }
        stack.push(pi);
      }

      steps.push({
        type: "done",
        stack: [...stack],
        sorted: sorted,
        p0: p0,
        explain: `✅ Conclusão de GRAHAM-SCAN! A envoltória convexa CH(Q) é formada pelos vértices da pilha: ⟨${stack.map(p => p.label).join(", ")}⟩.`
      });

      return steps;
    }

    function renderGraham() {
      const svg = document.getElementById("m15-graham-svg");
      if (!svg || grahamSteps.length === 0) return;

      const step = grahamSteps[grahamCurrentStep];
      document.getElementById("m15-graham-step-info").innerText = `Passo ${grahamCurrentStep} / ${grahamSteps.length - 1}`;
      document.getElementById("m15-graham-log-view").innerText = step.explain;

      // Render stack
      const stackView = document.getElementById("m15-graham-stack-view");
      stackView.innerHTML = step.stack.map((p, idx) => {
        const isTop = idx === step.stack.length - 1;
        const isNext = idx === step.stack.length - 2;
        let badgeColor = "#2563eb";
        let sub = "";
        if (isTop) { badgeColor = "#f43f5e"; sub = " (TOP)"; }
        else if (isNext) { badgeColor = "#a78bfa"; sub = " (NEXT)"; }
        return `<span style="background: ${badgeColor}; padding: 3px 8px; border-radius: 4px; font-weight: 700;">${p.label}${sub}</span>`;
      }).join(" ➜ ");

      // Render calc
      const calcView = document.getElementById("m15-graham-calc-view");
      if (step.type === "eval") {
        calcView.innerHTML = `
          Pilha Topo: <strong>${step.top.label}</strong>, Abaixo: <strong>${step.nextToTop.label}</strong><br>
          Candidato p_i: <strong>${step.pi.label}</strong><br>
          Produto Vetorial: <strong>${step.cp}</strong><br>
          Orientação: <span style="color: ${step.isLeft ? "#10b981" : "#ef4444"}; font-weight: 700;">${step.isLeft ? "Curva à Esquerda (Manter)" : "Curva à Direita (Desempilhar)"}</span>
        `;
      } else {
        calcView.innerHTML = `<em>${step.explain}</em>`;
      }

      // SVG
      let svgHtml = `
        <defs>
          <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      `;

      // Raios polares faint
      if (step.sorted && step.sorted.length > 0) {
        const p0 = step.p0;
        for (let i = 1; i < step.sorted.length; i++) {
          const pt = step.sorted[i];
          svgHtml += `<line x1="${p0.x}" y1="${p0.y}" x2="${pt.x}" y2="${pt.y}" stroke="rgba(148, 163, 184, 0.15)" stroke-dasharray="3,3" stroke-width="1"/>`;
        }
      }

      // Desenhar o polígono da pilha atual
      if (step.stack.length >= 2) {
        const pts = step.stack.map(p => `${p.x},${p.y}`).join(" ");
        svgHtml += `<polyline points="${pts}" fill="${step.type === 'done' ? 'rgba(56, 189, 248, 0.2)' : 'none'}" stroke="#38bdf8" stroke-width="3" stroke-linejoin="round"/>`;
        if (step.type === 'done') {
          // fecha a envoltória
          const pFirst = step.stack[0];
          const pLast = step.stack[step.stack.length - 1];
          svgHtml += `<line x1="${pLast.x}" y1="${pLast.y}" x2="${pFirst.x}" y2="${pFirst.y}" stroke="#38bdf8" stroke-width="3"/>`;
        }
      }

      // Se estiver testando um candidato
      if (step.type === "eval") {
        const strokeColor = step.isLeft ? "#10b981" : "#ef4444";
        svgHtml += `<line x1="${step.top.x}" y1="${step.top.y}" x2="${step.pi.x}" y2="${step.pi.y}" stroke="${strokeColor}" stroke-width="2.5" stroke-dasharray="${step.isLeft ? 'none' : '4,4'}"/>`;
      }

      // Desenhar todos os pontos
      const allPoints = step.sorted && step.sorted.length > 0 ? step.sorted : grahamRawPoints;
      for (const p of allPoints) {
        const isP0 = step.p0 && p.id === step.p0.id;
        const inStack = step.stack && step.stack.some(sp => sp.id === p.id);
        const isCandidate = step.pi && p.id === step.pi.id;

        let fill = inStack ? "#38bdf8" : "#64748b";
        let r = 5;
        if (isP0) { fill = "#fbbf24"; r = 7; }
        if (isCandidate) { fill = "#f43f5e"; r = 7; }

        svgHtml += `<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${fill}" stroke="#0f172a" stroke-width="2"/>`;
        svgHtml += `<text x="${p.x + 8}" y="${p.y - 6}" fill="#f8fafc" font-size="11" font-family="sans-serif" font-weight="700">${p.label}</text>`;
      }

      svg.innerHTML = svgHtml;
    }

    function initGraham() {
      grahamSteps = buildGrahamSteps(grahamRawPoints);
      grahamCurrentStep = 0;
      if (grahamTimer) { clearInterval(grahamTimer); grahamTimer = null; }
      renderGraham();
    }

    document.getElementById("m15-graham-load").addEventListener("click", initGraham);
    document.getElementById("m15-graham-next").addEventListener("click", () => {
      if (grahamCurrentStep < grahamSteps.length - 1) {
        grahamCurrentStep++;
        renderGraham();
      }
    });
    document.getElementById("m15-graham-prev").addEventListener("click", () => {
      if (grahamCurrentStep > 0) {
        grahamCurrentStep--;
        renderGraham();
      }
    });
    document.getElementById("m15-graham-reset").addEventListener("click", () => {
      grahamCurrentStep = 0;
      if (grahamTimer) { clearInterval(grahamTimer); grahamTimer = null; }
      renderGraham();
    });
    document.getElementById("m15-graham-auto").addEventListener("click", () => {
      if (grahamTimer) {
        clearInterval(grahamTimer);
        grahamTimer = null;
        document.getElementById("m15-graham-auto").innerText = "▶ Executar";
      } else {
        document.getElementById("m15-graham-auto").innerText = "⏸ Pausar";
        grahamTimer = setInterval(() => {
          if (grahamCurrentStep < grahamSteps.length - 1) {
            grahamCurrentStep++;
            renderGraham();
          } else {
            clearInterval(grahamTimer);
            grahamTimer = null;
            document.getElementById("m15-graham-auto").innerText = "▶ Executar";
          }
        }, 600);
      }
    });

    document.getElementById("m15-graham-preset").addEventListener("change", (e) => {
      const v = e.target.value;
      if (v === "clrs337") {
        grahamRawPoints = [
          { id: 0, x: 220, y: 310, label: "p₀" },
          { id: 1, x: 340, y: 280, label: "p₁" },
          { id: 2, x: 420, y: 220, label: "p₂" },
          { id: 3, x: 380, y: 120, label: "p₃" },
          { id: 4, x: 280, y: 70,  label: "p₄" },
          { id: 5, x: 150, y: 90,  label: "p₅" },
          { id: 6, x: 70,  y: 180, label: "p₆" },
          { id: 7, x: 180, y: 220, label: "p₇" },
          { id: 8, x: 260, y: 190, label: "p₈" },
          { id: 9, x: 220, y: 140, label: "p₉" }
        ];
      } else if (v === "random12") {
        grahamRawPoints = [];
        for (let i = 0; i < 12; i++) {
          grahamRawPoints.push({
            id: i,
            x: Math.round(50 + Math.random() * 400),
            y: Math.round(50 + Math.random() * 260),
            label: `p${i}`
          });
        }
      } else if (v === "circle") {
        grahamRawPoints = [];
        const cx = 250, cy = 180, r = 130;
        for (let i = 0; i < 8; i++) {
          const angle = (i * 2 * Math.PI) / 8;
          grahamRawPoints.push({
            id: i,
            x: Math.round(cx + r * Math.cos(angle)),
            y: Math.round(cy + r * Math.sin(angle)),
            label: `c${i}`
          });
        }
        // pontos internos
        grahamRawPoints.push({ id: 8, x: 220, y: 160, label: "in1" });
        grahamRawPoints.push({ id: 9, x: 270, y: 200, label: "in2" });
        grahamRawPoints.push({ id: 10, x: 250, y: 180, label: "in3" });
      }
      initGraham();
    });

    initGraham();

    // -------------------------------------------------------------
    // MOTOR 2B: SEGMENTS INTERSECT & PRODUTOS VETORIAIS
    // -------------------------------------------------------------
    function direction(pi, pj, pk) {
      return (pk.x - pi.x) * (pj.y - pi.y) - (pj.x - pi.x) * (pk.y - pi.y);
    }

    function onSegment(pi, pj, pk) {
      return (
        Math.min(pi.x, pj.x) <= pk.x && pk.x <= Math.max(pi.x, pj.x) &&
        Math.min(pi.y, pj.y) <= pk.y && pk.y <= Math.max(pi.y, pj.y)
      );
    }

    function segmentsIntersect(p1, p2, p3, p4) {
      const d1 = direction(p3, p4, p1);
      const d2 = direction(p3, p4, p2);
      const d3 = direction(p1, p2, p3);
      const d4 = direction(p1, p2, p4);

      const straddle1 = (d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0);
      const straddle2 = (d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0);

      if (straddle1 && straddle2) return { intersect: true, reason: "Estrangulamento Mútuo Geral (Cada segmento cruza a reta suporte do outro)", d1, d2, d3, d4 };
      if (d1 === 0 && onSegment(p3, p4, p1)) return { intersect: true, reason: "Colinear: p₁ repousa sobre o segmento p₃p₄", d1, d2, d3, d4 };
      if (d2 === 0 && onSegment(p3, p4, p2)) return { intersect: true, reason: "Colinear: p₂ repousa sobre o segmento p₃p₄", d1, d2, d3, d4 };
      if (d3 === 0 && onSegment(p1, p2, p3)) return { intersect: true, reason: "Colinear: p₃ repousa sobre o segmento p₁p₂", d1, d2, d3, d4 };
      if (d4 === 0 && onSegment(p1, p2, p4)) return { intersect: true, reason: "Colinear: p₄ repousa sobre o segmento p₁p₂", d1, d2, d3, d4 };

      return { intersect: false, reason: "Não se interceptam (sem estrangulamento mútuo nem sobreposição colinear)", d1, d2, d3, d4 };
    }

    function updateIntersect() {
      const p1 = { x: parseFloat(document.getElementById("m15-p1x").value) || 0, y: parseFloat(document.getElementById("m15-p1y").value) || 0 };
      const p2 = { x: parseFloat(document.getElementById("m15-p2x").value) || 0, y: parseFloat(document.getElementById("m15-p2y").value) || 0 };
      const p3 = { x: parseFloat(document.getElementById("m15-p3x").value) || 0, y: parseFloat(document.getElementById("m15-p3y").value) || 0 };
      const p4 = { x: parseFloat(document.getElementById("m15-p4x").value) || 0, y: parseFloat(document.getElementById("m15-p4y").value) || 0 };

      const res = segmentsIntersect(p1, p2, p3, p4);

      // Render valores
      document.getElementById("m15-dir-values").innerHTML = `
        d₁ = DIRECTION(p₃, p₄, p₁) = <strong>${res.d1}</strong><br>
        d₂ = DIRECTION(p₃, p₄, p₂) = <strong>${res.d2}</strong><br>
        d₃ = DIRECTION(p₁, p₂, p₃) = <strong>${res.d3}</strong><br>
        d₄ = DIRECTION(p₁, p₂, p₄) = <strong>${res.d4}</strong>
      `;

      // Render testes lógicos
      const s1 = (res.d1 > 0 && res.d2 < 0) || (res.d1 < 0 && res.d2 > 0);
      const s2 = (res.d3 > 0 && res.d4 < 0) || (res.d3 < 0 && res.d4 > 0);
      document.getElementById("m15-logic-tests").innerHTML = `
        • p₁p₂ ultrapassa reta(p₃p₄): <strong>${s1 ? "SIM (sinais opostos)" : "NÃO"}</strong><br>
        • p₃p₄ ultrapassa reta(p₁p₂): <strong>${s2 ? "SIM (sinais opostos)" : "NÃO"}</strong><br>
        • Casos de fronteira d_k == 0: <strong>${(res.d1 === 0 || res.d2 === 0 || res.d3 === 0 || res.d4 === 0) ? "SIM (avaliar ON-SEGMENT)" : "NÃO"}</strong>
      `;

      // Veredito
      const vBox = document.getElementById("m15-verdict-box");
      if (res.intersect) {
        vBox.style.background = "rgba(16, 185, 129, 0.2)";
        vBox.style.border = "1px solid #10b981";
        vBox.style.color = "#34d399";
        vBox.innerHTML = `✔ INTERSEÇÃO DETECTADA (TRUE)<br><span style="font-size: 0.82rem; font-weight: normal;">${res.reason}</span>`;
      } else {
        vBox.style.background = "rgba(239, 68, 68, 0.2)";
        vBox.style.border = "1px solid #ef4444";
        vBox.style.color = "#f87171";
        vBox.innerHTML = `✖ NÃO SE INTERCEPTAM (FALSE)<br><span style="font-size: 0.82rem; font-weight: normal;">${res.reason}</span>`;
      }

      // Render SVG
      const svg = document.getElementById("m15-intersect-svg");
      svg.innerHTML = `
        <defs>
          <pattern id="grid2" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid2)" />
        <!-- Segmento 1 (Azul) -->
        <line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
        <circle cx="${p1.x}" cy="${p1.y}" r="5" fill="#38bdf8"/>
        <text x="${p1.x + 6}" y="${p1.y - 6}" fill="#38bdf8" font-size="12" font-family="monospace" font-weight="700">p₁(${p1.x},${p1.y})</text>
        <circle cx="${p2.x}" cy="${p2.y}" r="5" fill="#38bdf8"/>
        <text x="${p2.x + 6}" y="${p2.y - 6}" fill="#38bdf8" font-size="12" font-family="monospace" font-weight="700">p₂(${p2.x},${p2.y})</text>

        <!-- Segmento 2 (Laranja) -->
        <line x1="${p3.x}" y1="${p3.y}" x2="${p4.x}" y2="${p4.y}" stroke="#fb923c" stroke-width="3" stroke-linecap="round"/>
        <circle cx="${p3.x}" cy="${p3.y}" r="5" fill="#fb923c"/>
        <text x="${p3.x + 6}" y="${p3.y - 6}" fill="#fb923c" font-size="12" font-family="monospace" font-weight="700">p₃(${p3.x},${p3.y})</text>
        <circle cx="${p4.x}" cy="${p4.y}" r="5" fill="#fb923c"/>
        <text x="${p4.x + 6}" y="${p4.y - 6}" fill="#fb923c" font-size="12" font-family="monospace" font-weight="700">p₄(${p4.x},${p4.y})</text>
      `;
    }

    ["m15-p1x", "m15-p1y", "m15-p2x", "m15-p2y", "m15-p3x", "m15-p3y", "m15-p4x", "m15-p4y"].forEach(id => {
      document.getElementById(id).addEventListener("input", updateIntersect);
    });

    document.getElementById("m15-intersect-preset").addEventListener("change", (e) => {
      const v = e.target.value;
      if (v === "cross") {
        document.getElementById("m15-p1x").value = 50;  document.getElementById("m15-p1y").value = 60;
        document.getElementById("m15-p2x").value = 350; document.getElementById("m15-p2y").value = 260;
        document.getElementById("m15-p3x").value = 80;  document.getElementById("m15-p3y").value = 250;
        document.getElementById("m15-p4x").value = 320; document.getElementById("m15-p4y").value = 80;
      } else if (v === "disjoint") {
        document.getElementById("m15-p1x").value = 40;  document.getElementById("m15-p1y").value = 80;
        document.getElementById("m15-p2x").value = 200; document.getElementById("m15-p2y").value = 80;
        document.getElementById("m15-p3x").value = 40;  document.getElementById("m15-p3y").value = 200;
        document.getElementById("m15-p4x").value = 200; document.getElementById("m15-p4y").value = 200;
      } else if (v === "touch") {
        document.getElementById("m15-p1x").value = 50;  document.getElementById("m15-p1y").value = 150;
        document.getElementById("m15-p2x").value = 350; document.getElementById("m15-p2y").value = 150;
        document.getElementById("m15-p3x").value = 200; document.getElementById("m15-p3y").value = 50;
        document.getElementById("m15-p4x").value = 200; document.getElementById("m15-p4y").value = 150; // toca exatamente em (200, 150)
      } else if (v === "collinear_on") {
        document.getElementById("m15-p1x").value = 50;  document.getElementById("m15-p1y").value = 100;
        document.getElementById("m15-p2x").value = 250; document.getElementById("m15-p2y").value = 200;
        document.getElementById("m15-p3x").value = 150; document.getElementById("m15-p3y").value = 150; // sobreposto
        document.getElementById("m15-p4x").value = 350; document.getElementById("m15-p4y").value = 250;
      } else if (v === "collinear_off") {
        document.getElementById("m15-p1x").value = 40;  document.getElementById("m15-p1y").value = 60;
        document.getElementById("m15-p2x").value = 120; document.getElementById("m15-p2y").value = 100;
        document.getElementById("m15-p3x").value = 200; document.getElementById("m15-p3y").value = 140; // mesma reta, mas disjuntos
        document.getElementById("m15-p4x").value = 280; document.getElementById("m15-p4y").value = 180;
      }
      updateIntersect();
    });

    updateIntersect();
  }


  const quizzes = [
  {
    "id": "q15-1",
    "type": "Múltipla Escolha",
    "reference": "Cap. 32, Seções 32.1 e 32.2 (pp. 796–808)",
    "question": "Sobre o problema da correspondência de cadeias, o Algoritmo Ingênuo e o Algoritmo de Rabin-Karp, assinale a afirmação CORRETA:",
    "options": [
      {
        "letter": "A",
        "text": "O algoritmo ingênuo exige pré-processamento em Θ(m), enquanto o algoritmo de Rabin-Karp não realiza pré-processamento algum.",
        "isCorrect": false,
        "explanation": "Incorreta. O algoritmo ingênuo não realiza nenhum pré-processamento (tempo 0), enquanto Rabin-Karp realiza pré-processamento em Θ(m) para calcular o hash do padrão p e a constante h = d^(m-1) mod q (p. 803)."
      },
      {
        "letter": "B",
        "text": "No algoritmo de Rabin-Karp, se t_s ≡ p (mod q), temos a garantia irrestrita de que o padrão ocorre com deslocamento s, sendo desnecessário comparar os caracteres do texto.",
        "isCorrect": false,
        "explanation": "Incorreta. A congruência modular t_s ≡ p (mod q) indica apenas um 'acerto' candidato. Podem ocorrer colisões de hash, denominadas 'acertos espúrios' (spurious hits). Uma comparação explícita caractere a caractere em O(m) é indispensável para confirmar o casamento (p. 801)."
      },
      {
        "letter": "C",
        "text": "O algoritmo de Rabin-Karp atinge tempo de correspondência esperado O(n + m) quando o primo q é escolhido tal que q ≥ m e o número de ocorrências válidas é O(1), embora seu pior caso continue sendo Θ((n - m + 1)m).",
        "isCorrect": true,
        "explanation": "Correta! Conforme demonstrado no CLRS (pp. 803–804), sob a hipótese de distribuição uniforme das classes de congruência mod q, o número esperado de acertos espúrios é O(n/q) = O(n/m) = O(n), levando a um tempo esperado O(n + m). No pior caso patológico (ex.: T = a^n, P = a^m), o tempo degrada para Θ((n - m + 1)m)."
      },
      {
        "letter": "D",
        "text": "Se todos os caracteres do padrão P forem distintos, o algoritmo ingênuo ainda assim consome tempo quadrático Θ(n²).",
        "isCorrect": false,
        "explanation": "Incorreta. Conforme o Exercício 32.1-2 (p. 800), se todos os caracteres de P são distintos, ao encontrar um descasamento após k caracteres coincidentes podemos avançar o deslocamento s imediatamente em k posições, garantindo tempo total O(n)."
      }
    ]
  },
  {
    "id": "q15-2",
    "type": "Múltipla Escolha",
    "reference": "Cap. 32, Seção 32.2 (pp. 800–804)",
    "question": "No algoritmo de Rabin-Karp, considerando base d = |Σ|, primo q e janela de tamanho m, como é realizada a atualização do hash rolante de t_s para t_{s+1} em tempo O(1)?",
    "options": [
      {
        "letter": "A",
        "text": "t_{s+1} = (d(t_s - T[s+1]h) + T[s+m+1]) mod q, onde h = d^(m-1) mod q.",
        "isCorrect": true,
        "explanation": "Correta! Esta é exatamente a Equação 32.2 (p. 802): remove-se o dígito de ordem mais alta T[s+1] multiplicado pelo peso h = d^(m-1) mod q, multiplica-se o resultado por d (deslocamento para a esquerda na base d) e soma-se o novo dígito T[s+m+1], tudo calculado módulo q."
      },
      {
        "letter": "B",
        "text": "t_{s+1} = (t_s/d - T[s+1] + T[s+m+1]h) mod q, onde h = d^m mod q.",
        "isCorrect": false,
        "explanation": "Incorreta. A atualização envolve multiplicação por d para deslocar os dígitos restantes para a esquerda, e não divisão por d (p. 801)."
      },
      {
        "letter": "C",
        "text": "t_{s+1} = (d · t_s + T[s+1] - T[s+m+1]h) mod q, onde h = d^(m-1) mod q.",
        "isCorrect": false,
        "explanation": "Incorreta. O dígito que sai é T[s+1] (com peso alto h) e deve ser subtraído, enquanto o novo dígito que entra é T[s+m+1] (com peso 1) e deve ser somado."
      },
      {
        "letter": "D",
        "text": "t_{s+1} = (t_s - T[s+1]) · d^m + T[s+m+1] mod q.",
        "isCorrect": false,
        "explanation": "Incorreta. A fórmula não reflete o deslocamento correto na base posicional d."
      }
    ]
  },
  {
    "id": "q15-3",
    "type": "Múltipla Escolha",
    "reference": "Cap. 32, Seção 32.3 (pp. 808–815)",
    "question": "A respeito dos autômatos finitos determinísticos de busca de cadeias e da função de sufixo σ, assinale a opção CORRETA:",
    "options": [
      {
        "letter": "A",
        "text": "A função de sufixo σ(x) é definida como o menor índice k tal que P_k é prefixo de x.",
        "isCorrect": false,
        "explanation": "Incorreta. σ(x) é formalmente definida como o comprimento do MAIOR prefixo de P que também é SUFIXO de x: σ(x) = max{k : P_k ⊐ x} (p. 809)."
      },
      {
        "letter": "B",
        "text": "Pelo Lema do Deslocamento do Sufixo (Lema 32.2), se q = σ(x), então para qualquer caractere a temos σ(xa) ≤ q + 1.",
        "isCorrect": true,
        "explanation": "Correta! O Lema 32.2 (p. 810) demonstra que ler um caractere adicional 'a' pode aumentar o comprimento do maior prefixo que é sufixo em no máximo uma unidade em relação ao estado anterior q = σ(x)."
      },
      {
        "letter": "C",
        "text": "O algoritmo FINITE-AUTOMATON-MATCHER requer tempo de busca Θ(n · m) no pior caso devido às transições de retorno a estados anteriores.",
        "isCorrect": false,
        "explanation": "Incorreta. Uma vez construída a função de transição δ, o autômato processa cada caractere do texto em tempo O(1). O tempo total de busca é estritamente linear Θ(n), independente de m (p. 811)."
      },
      {
        "letter": "D",
        "text": "O autômato finito de busca possui múltiplos estados de aceitação, correspondendo a cada prefixo próprio de P.",
        "isCorrect": false,
        "explanation": "Incorreta. Há um único estado de aceitação A = {m}, que indica que o padrão completo de comprimento m foi localizado (p. 809)."
      }
    ]
  },
  {
    "id": "q15-4",
    "type": "Múltipla Escolha",
    "reference": "Cap. 32, Seções 32.3 e 32.4 (pp. 813–816)",
    "question": "Qual é a principal limitação dos autômatos finitos determinísticos puros de busca de cadeias que motivou o desenvolvimento do algoritmo de Knuth-Morris-Pratt (KMP)?",
    "options": [
      {
        "letter": "A",
        "text": "Os autômatos finitos realizam retrocesso sistemático no texto T quando encontram um caractere divergente.",
        "isCorrect": false,
        "explanation": "Incorreta. Autômatos finitos NUNCA retrocedem no texto; o índice do texto avança de 1 a n estritamente."
      },
      {
        "letter": "B",
        "text": "A construção da matriz de transição δ(q, a) exige tempo O(m³ |Σ|) na forma ingênua e consome espaço de armazenamento Θ(m |Σ|), tornando-se impraticável para alfabetos grandes como Unicode ou inteiros.",
        "isCorrect": true,
        "explanation": "Correta! Conforme o CLRS (p. 813 e p. 815), pré-computar transições para cada caractere de Σ consome memória Θ(m |Σ|). Para alfabetos extensos, isso é inviável. KMP resolve isso computando apenas a função π em espaço e tempo Θ(m), totalmente independente de |Σ|."
      },
      {
        "letter": "C",
        "text": "O autômato finito é incapaz de detectar ocorrências sobrepostas do padrão no texto.",
        "isCorrect": false,
        "explanation": "Incorreta. O autômato finito detecta perfeitamente ocorrências sobrepostas, pois transições a partir do estado de aceitação m mapeiam para o mais longo sufixo adequado."
      },
      {
        "letter": "D",
        "text": "A busca em autômatos finitos é probabilística e sujeita a falsos positivos como em Rabin-Karp.",
        "isCorrect": false,
        "explanation": "Incorreta. Autômatos finitos determinísticos são estritamente determinísticos e 100% livres de falsos positivos."
      }
    ]
  },
  {
    "id": "q15-5",
    "type": "Múltipla Escolha",
    "reference": "Cap. 32, Seção 32.4 (pp. 815–818)",
    "question": "Em relação à função de prefixo π[1 .. m] utilizada no algoritmo de Knuth-Morris-Pratt (KMP), assinale a afirmativa CORRETA:",
    "options": [
      {
        "letter": "A",
        "text": "π[q] é definido como o comprimento do mais longo prefixo próprio de P que também é sufixo de P_q: π[q] = max{k : k < q e P_k ⊐ P_q}.",
        "isCorrect": true,
        "explanation": "Correta! Esta é a definição formal canônica da função de prefixo π no CLRS (Equação 32.5, p. 816)."
      },
      {
        "letter": "B",
        "text": "π[1] pode assumir valor 1 se o primeiro caractere for repetido.",
        "isCorrect": false,
        "explanation": "Incorreta. Por definição, π[1] = 0 sempre, pois o único prefixo próprio de P_1 = P[1] é a cadeia vazia ε de comprimento 0 (k < 1 força k = 0)."
      },
      {
        "letter": "C",
        "text": "A iteração da cadeia de prefixos π*[q] enumera os prefixos em ordem crescente de comprimento.",
        "isCorrect": false,
        "explanation": "Incorreta. Pelo Lema 32.5 (p. 817), π*[q] = {π[q], π[π[q]], ...} enumera os prefixos em ordem estritamente DECRESCENTE de comprimento até atingir 0."
      },
      {
        "letter": "D",
        "text": "Quando ocorre um descasamento em P[q+1] ≠ T[i], o KMP retrocede o índice i do texto para i - q + 1.",
        "isCorrect": false,
        "explanation": "Incorreta! O índice do texto i JAMAIS retrocede em KMP. Apenas o estado do padrão q recua para π[q] (p. 816)."
      }
    ]
  },
  {
    "id": "q15-6",
    "type": "Múltipla Escolha",
    "reference": "Cap. 32, Seção 32.4 (pp. 818–823)",
    "question": "Como a análise amortizada utilizando funções de potencial prova que o tempo de execução de COMPUTE-PREFIX-FUNCTION é Θ(m) e de KMP-MATCHER é Θ(n)?",
    "options": [
      {
        "letter": "A",
        "text": "Define-se o potencial Φ = k (ou Φ = q); como k só aumenta em no máximo 1 por iteração externa (total ≤ m-1 incrementos) e cada iteração do laço while decrementa k em pelo menos 1 (com k ≥ 0), o número total de execuções do while é limitado por m-1.",
        "isCorrect": true,
        "explanation": "Correta! Conforme demonstrado no CLRS (p. 819 e Exercício 32.4-5), a função de potencial Φ = k reflete o valor não negativo da variável k. O crescimento total de k é limitado pelo número de iterações do laço for (m-1). Como k = π[k] reduz k em ao menos 1 por iteração do while e k ≥ 0, o while não pode executar mais que m-1 vezes no total, provando complexidade amortizada Θ(m). Raciocínio idêntico com Φ = q prova que o tempo de busca é Θ(n)."
      },
      {
        "letter": "B",
        "text": "O laço while é provado rodar em tempo O(1) no pior caso para cada iteração do laço for.",
        "isCorrect": false,
        "explanation": "Incorreta. Uma iteração isolada do laço for pode fazer k recuar muitas vezes (custo O(m)). Apenas a análise amortizada sobre todo o conjunto de iterações garante o limite linear agregado."
      },
      {
        "letter": "C",
        "text": "O método mestre resolve a recorrência T(n) = 2T(n/2) + O(1) = Θ(n).",
        "isCorrect": false,
        "explanation": "Incorreta. KMP não é um algoritmo de divisão e conquista e não segue a recorrência do método mestre."
      },
      {
        "letter": "D",
        "text": "O tempo linear decorre do fato de o alfabeto Σ ter tamanho constante.",
        "isCorrect": false,
        "explanation": "Incorreta. A complexidade de KMP independe completamente do tamanho do alfabeto |Σ|."
      }
    ]
  },
  {
    "id": "q15-7",
    "type": "Múltipla Escolha",
    "reference": "Cap. 33, Seção 33.1 (pp. 825–828)",
    "question": "Em relação ao produto vetorial bidimensional p₁ × p₂ = x₁y₂ - x₂y₁ e à determinação do sentido de curvas entre segmentos dirigidos consecutivos, assinale a opção CORRETA:",
    "options": [
      {
        "letter": "A",
        "text": "Se p₁ × p₂ > 0, então o vetor p₁ está no sentido horário em relação a p₂ em relação à origem, o que equivale a dizer que p₂ faz uma curva no sentido anti-horário a partir de p₁.",
        "isCorrect": true,
        "explanation": "Correta! Conforme a convenção e definições da Seção 33.1 (pp. 825–827 e Figura 33.1), um produto vetorial positivo p₁ × p₂ > 0 indica que p₁ está no sentido horário em relação a p₂, significando que girar de p₁ para p₂ é um movimento anti-horário (curva à esquerda)."
      },
      {
        "letter": "B",
        "text": "O produto vetorial bidimensional p₁ × p₂ é nulo se e somente se p₁ e p₂ forem vetores perpendiculares.",
        "isCorrect": false,
        "explanation": "Incorreta. O produto vetorial é nulo se e somente se p₁ e p₂ forem COLINEARES (ângulo 0 ou π radianos). Para vetores perpendiculares, o produto escalar é que se anula."
      },
      {
        "letter": "C",
        "text": "O procedimento DIRECTION(p_i, p_j, p_k) requer cálculo trigonométrico da função arco-tangente (atan2) para medir o ângulo.",
        "isCorrect": false,
        "explanation": "Incorreta. Toda a elegância de DIRECTION reside em dispensar trigonometria e divisões, utilizando exclusivamente o produto vetorial (p_k - p_i) × (p_j - p_i) em tempo O(1) com aritmética inteira exata (p. 827)."
      },
      {
        "letter": "D",
        "text": "Se (p₂ - p₀) × (p₁ - p₀) é positivo, viramos para a esquerda ao caminhar de p₀ para p₁ e depois para p₂.",
        "isCorrect": false,
        "explanation": "Incorreta. Pela convenção do CLRS (p. 827), se esse produto for positivo, a virada é para a DIREITA (sentido horário). Se for negativo, a virada é para a ESQUERDA."
      }
    ]
  },
  {
    "id": "q15-8",
    "type": "Múltipla Escolha",
    "reference": "Cap. 33, Seção 33.1 (pp. 827–830)",
    "question": "Sobre o procedimento SEGMENTS-INTERSECT(p₁, p₂, p₃, p₄) para determinar se dois segmentos de reta p₁p₂ e p₃p₄ se interceptam, qual afirmação é VERDADEIRA?",
    "options": [
      {
        "letter": "A",
        "text": "Dois segmentos se interceptam se e somente se as retas infinitas que os contêm se interceptarem.",
        "isCorrect": false,
        "explanation": "Incorreta. Duas retas infinitas não paralelas quase sempre se interceptam no plano, mas o ponto de interseção pode residir muito além dos limites dos segmentos finitos."
      },
      {
        "letter": "B",
        "text": "O algoritmo verifica se cada segmento ultrapassa a reta suporte do outro (produtos vetoriais com sinais estritamente opostos) e, caso algum produto seja zero, verifica o pertencimento à caixa delimitadora via ON-SEGMENT, operando em tempo O(1) sem nenhuma divisão.",
        "isCorrect": true,
        "explanation": "Correta! Conforme detalhado no CLRS (pp. 827–829), os testes de estrangulamento mútuo combinados com ON-SEGMENT cobrem tanto o caso geral quanto todos os casos de fronteira degenerados em tempo O(1) com aritmética inteira livre de divisões."
      },
      {
        "letter": "C",
        "text": "Se d₁ = DIRECTION(p₃, p₄, p₁) = 0, os segmentos p₁p₂ e p₃p₄ garantidamente se interceptam.",
        "isCorrect": false,
        "explanation": "Incorreta. d₁ = 0 indica apenas que o ponto p₁ é colinear com a reta p₃p₄. Ele só toca o segmento se estiver compreendido entre p₃ e p₄, o que exige a confirmação por ON-SEGMENT (p. 828 e Figura 33.3(d))."
      },
      {
        "letter": "D",
        "text": "SEGMENTS-INTERSECT calcula as coordenadas reais (x, y) do ponto de cruzamento por resolução de sistema linear 2×2.",
        "isCorrect": false,
        "explanation": "Incorreta. O algoritmo é um predicado booleano que responde se existe ou não interseção sem calcular o ponto em coordenadas reais, evitando divisão."
      }
    ]
  },
  {
    "id": "q15-9",
    "type": "Múltipla Escolha",
    "reference": "Cap. 33, Seção 33.2 (pp. 831–838)",
    "question": "A respeito do algoritmo ANY-SEGMENTS-INTERSECT baseado no paradigma de varredura de linha (sweep-line), assinale a afirmativa CORRETA:",
    "options": [
      {
        "letter": "A",
        "text": "O algoritmo mantém uma fila de prioridade com todas as interseções possíveis calculadas previamente.",
        "isCorrect": false,
        "explanation": "Incorreta. As interseções não são conhecidas previamente. A fila de eventos contém exclusivamente as 2n extremidades conhecidas dos segmentos (p. 832)."
      },
      {
        "letter": "B",
        "text": "O algoritmo opera em tempo O(n lg n) mantendo a ordem vertical dos segmentos ativos em uma árvore de busca binária balanceada T; pela prova do Teorema 33.1, se houver interseção, os segmentos envolvidos tornam-se vizinhos consecutivos em T antes ou no momento em que o ponto de cruzamento mais à esquerda é atingido.",
        "isCorrect": true,
        "explanation": "Correta! Esta é a essência do Teorema 33.1 (pp. 834–836): segmentos que se cruzam no ponto mais à esquerda p devem necessariamente ser adjacentes na árvore rubro-negra T imediatamente antes de p, permitindo sua detecção em tempo total O(n lg n)."
      },
      {
        "letter": "C",
        "text": "ANY-SEGMENTS-INTERSECT imprime todas as k interseções existentes entre os n segmentos no tempo O(n lg n).",
        "isCorrect": false,
        "explanation": "Incorreta. O algoritmo ANY-SEGMENTS-INTERSECT apenas decide se existe ALGUMA interseção e termina na primeira detecção. Encontrar todas as k interseções no pior caso pode exigir tempo Ω(n²), pois n segmentos podem ter Θ(n²) interseções (Exercício 33.2-1)."
      },
      {
        "letter": "D",
        "text": "Quando a extremidade direita de um segmento s é encontrada, o segmento s é removido de T sem nenhum teste adicional.",
        "isCorrect": false,
        "explanation": "Incorreta. Antes de remover s de T, o algoritmo testa se o segmento imediatamente acima de s (ABOVE(T, s)) intercepta o segmento imediatamente abaixo de s (BELOW(T, s)), pois eles acabam de se tornar novos vizinhos verticais (linha 9, p. 834)."
      }
    ]
  },
  {
    "id": "q15-10",
    "type": "Múltipla Escolha",
    "reference": "Cap. 33, Seções 33.3 e 33.4 (pp. 838–851)",
    "question": "Sobre os algoritmos de Envoltória Convexa (GRAHAM-SCAN e Marcha de Jarvis) e o Par de Pontos Mais Próximos por Divisão e Conquista, qual alternativa é VERDADEIRA?",
    "options": [
      {
        "letter": "A",
        "text": "GRAHAM-SCAN opera em tempo O(n²), enquanto a Marcha de Jarvis garante tempo Θ(n lg n) para qualquer entrada.",
        "isCorrect": false,
        "explanation": "Incorreta. É o oposto: GRAHAM-SCAN opera em tempo ótimo Θ(n lg n) para qualquer entrada, enquanto a Marcha de Jarvis leva tempo O(nh), podendo atingir Θ(n²) quando h = Θ(n) (pp. 839 e 844)."
      },
      {
        "letter": "B",
        "text": "No algoritmo do par de pontos mais próximos por divisão e conquista, cada ponto na faixa central de largura 2δ precisa ser comparado com no máximo 7 outros pontos subsequentes na ordenação por coordenada y, garantindo a etapa de combinação em tempo O(n) e tempo global Θ(n lg n).",
        "isCorrect": true,
        "explanation": "Correta! Conforme demonstrado pelo Lema Geométrico de Densidade (pp. 848–849), no máximo 4 pontos de cada metade podem caber em um retângulo 2δ × δ bissectado pela linha l. Subtraindo o próprio ponto em análise, restam no máximo 7 pontos vizinhos a comparar, viabilizando T(n) = 2T(n/2) + O(n) = Θ(n lg n)."
      },
      {
        "letter": "C",
        "text": "Na varredura de Graham, a cada novo ponto p_i, a pilha S é desempilhada se o ângulo formado fizer uma curva à esquerda.",
        "isCorrect": false,
        "explanation": "Incorreta. A pilha é desempilhada (POP) quando o ângulo NÃO faz curva à esquerda — isto é, quando faz curva à DIREITA ou colinear (DIRECTION ≥ 0), pois isso viola a convexidade (linha 10, p. 839)."
      },
      {
        "letter": "D",
        "text": "A Marcha de Jarvis é sempre mais lenta que a Varredura de Graham, independentemente do número de vértices h da envoltória convexa.",
        "isCorrect": false,
        "explanation": "Incorreta. Se h = o(lg n) (por exemplo, quando a envoltória tem apenas 3 ou 4 vértices para um milhão de pontos), a Marcha de Jarvis opera em tempo O(nh) = O(n), sendo assintoticamente mais rápida que Graham (p. 844)."
      }
    ]
  }
];

  const exercicios = [
  {
    "id": "ex15-1",
    "code": "EXERCÍCIO 01 • ALGORITMO DE RABIN-KARP E ACERTOS ESPÚRIOS",
    "reference": "Exercício 32.2-1 (p. 804)",
    "title": "Cálculo Passo a Passo do Hash Rolante, Detecção de Ocorrências e Contagem de Acertos Espúrios",
    "prompt": "\n          <p><strong>(Exercício 32.2-1, p. 804)</strong> Trabalhando com base decimal $d = 10$ e módulo primo $q = 11$, execute passo a passo o procedimento <code>RABIN-KARP-MATCHER(T, P, d, q)</code> para buscar o padrão $P = 26$ no texto:</p>\n          $$T = 3141592653589793$$\n          <ol>\n            <li>Calcule o valor numérico do padrão $p = 26 \\bmod 11$ e a constante de ordem alta $h = d^{m-1} \\bmod q$.</li>\n            <li>Calcule o valor do hash $t_0$ para o primeiro deslocamento $s = 0$ ($T[1..2] = 31$).</li>\n            <li>Utilizando a fórmula de atualização do hash rolante em tempo $O(1)$:\n              $$t_{s+1} = \\Big(10(t_s - T[s+1]h) + T[s+m+1]\\Big) \\bmod 11$$\n              construa a tabela com os valores de $t_s$ para todos os deslocamentos possíveis $s = 0, 1, \\dots, 14$.</li>\n            <li>Identifique quais deslocamentos produzem acertos ($t_s \\equiv p \\pmod{11}$), classificando cada um em <strong>ocorrência válida</strong> ou <strong>acerto espúrio</strong>. Quantos acertos espúrios ocorrem?</li>\n          </ol>\n        ",
    "placeholder": "Para m = 2, d = 10 e q = 11: h = 10^(2-1) mod 11 = 10. O valor de p = 26 mod 11 = 4. O primeiro bloco T[1..2] = 31 resulta em t_0 = 31 mod 11 = 9...",
    "solution": "\n          <h4>1. Parâmetros Iniciais e Pré-processamento</h4>\n          <ul>\n            <li>Comprimento do texto $n = 16$, comprimento do padrão $m = 2$.</li>\n            <li>Base $d = 10$, módulo primo $q = 11$.</li>\n            <li>Constante multiplicativa de ordem superior:\n              $$h = d^{m-1} \\bmod q = 10^{2-1} \\bmod 11 = 10 \\equiv -1 \\pmod{11}.$$\n            </li>\n            <li>Valor numérico do padrão:\n              $$p = 26 \\bmod 11 = \\mathbf{4}.$$\n            </li>\n          </ul>\n\n          <h4>2. Cálculo da Janela Inicial ($s = 0$) e Atualização do Hash Rolante</h4>\n          <p>Para $s = 0$, $T[1..2] = 31$:\n            $$t_0 = 31 \\bmod 11 = \\mathbf{9}.$$\n          </p>\n          <p>Para os deslocamentos seguintes, aplicamos:\n            $$t_{s+1} = \\Big(10\\big(t_s - T[s+1] \\cdot 10\\big) + T[s+3]\\Big) \\bmod 11$$\n            Como $10 \\equiv -1 \\pmod{11}$, a fórmula simplifica elegantemente para:\n            $$t_{s+1} = \\Big(-(t_s + T[s+1]) + T[s+3]\\Big) \\bmod 11 = \\Big(T[s+3] - t_s - T[s+1]\\Big) \\bmod 11.$$\n          </p>\n          <p>Vamos tabular todos os deslocamentos $s = 0, \\dots, 14$ avaliando as janelas de dois dígitos $T[s+1 .. s+2]$:</p>\n          <table style=\"width: 100%; border-collapse: collapse; font-family: monospace; font-size: 0.88rem; margin: 12px 0;\">\n            <thead>\n              <tr style=\"background: #1e293b; color: #94a3b8;\">\n                <th style=\"padding: 6px; border: 1px solid #334155;\">s</th>\n                <th style=\"padding: 6px; border: 1px solid #334155;\">Subcadeia T[s+1..s+2]</th>\n                <th style=\"padding: 6px; border: 1px solid #334155;\">Valor Decimal</th>\n                <th style=\"padding: 6px; border: 1px solid #334155;\">t_s = Valor mod 11</th>\n                <th style=\"padding: 6px; border: 1px solid #334155;\">t_s == p (4)?</th>\n                <th style=\"padding: 6px; border: 1px solid #334155;\">Classificação</th>\n              </tr>\n            </thead>\n            <tbody>\n              <tr><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">0</td><td style=\"padding: 5px; border: 1px solid #334155;\">\"31\"</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: right;\">31</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">9</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">Não</td><td style=\"padding: 5px; border: 1px solid #334155;\">Deslocamento não válido</td></tr>\n              <tr><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">1</td><td style=\"padding: 5px; border: 1px solid #334155;\">\"14\"</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: right;\">14</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">3</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">Não</td><td style=\"padding: 5px; border: 1px solid #334155;\">Deslocamento não válido</td></tr>\n              <tr><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">2</td><td style=\"padding: 5px; border: 1px solid #334155;\">\"41\"</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: right;\">41</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">8</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">Não</td><td style=\"padding: 5px; border: 1px solid #334155;\">Deslocamento não válido</td></tr>\n              <tr style=\"background: rgba(239, 68, 68, 0.15);\"><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">3</td><td style=\"padding: 5px; border: 1px solid #334155; font-weight: 700;\">\"15\"</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: right;\">15</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center; color: #f87171; font-weight: 700;\">4</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center; color: #f87171; font-weight: 700;\">SIM</td><td style=\"padding: 5px; border: 1px solid #334155; color: #f87171; font-weight: 700;\">Acerto Espúrio (15 ≠ 26)</td></tr>\n              <tr><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">4</td><td style=\"padding: 5px; border: 1px solid #334155;\">\"59\"</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: right;\">59</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">4</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center; color: #f87171; font-weight: 700;\">SIM</td><td style=\"padding: 5px; border: 1px solid #334155; color: #f87171; font-weight: 700;\">Acerto Espúrio (59 ≠ 26)</td></tr>\n              <tr><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">5</td><td style=\"padding: 5px; border: 1px solid #334155;\">\"92\"</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: right;\">92</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">4</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center; color: #f87171; font-weight: 700;\">SIM</td><td style=\"padding: 5px; border: 1px solid #334155; color: #f87171; font-weight: 700;\">Acerto Espúrio (92 ≠ 26)</td></tr>\n              <tr style=\"background: rgba(16, 185, 129, 0.2);\"><td style=\"padding: 5px; border: 1px solid #334155; text-align: center; font-weight: 700;\">6</td><td style=\"padding: 5px; border: 1px solid #334155; font-weight: 700; color: #34d399;\">\"26\"</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: right; font-weight: 700;\">26</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center; color: #34d399; font-weight: 700;\">4</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center; color: #34d399; font-weight: 700;\">SIM</td><td style=\"padding: 5px; border: 1px solid #334155; color: #34d399; font-weight: 700;\">OCORRÊNCIA VÁLIDA (26 == 26)</td></tr>\n              <tr><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">7</td><td style=\"padding: 5px; border: 1px solid #334155;\">\"65\"</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: right;\">65</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">10</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">Não</td><td style=\"padding: 5px; border: 1px solid #334155;\">Deslocamento não válido</td></tr>\n              <tr><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">8</td><td style=\"padding: 5px; border: 1px solid #334155;\">\"53\"</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: right;\">53</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">9</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">Não</td><td style=\"padding: 5px; border: 1px solid #334155;\">Deslocamento não válido</td></tr>\n              <tr><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">9</td><td style=\"padding: 5px; border: 1px solid #334155;\">\"35\"</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: right;\">35</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">2</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">Não</td><td style=\"padding: 5px; border: 1px solid #334155;\">Deslocamento não válido</td></tr>\n              <tr><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">10</td><td style=\"padding: 5px; border: 1px solid #334155;\">\"58\"</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: right;\">58</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">3</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">Não</td><td style=\"padding: 5px; border: 1px solid #334155;\">Deslocamento não válido</td></tr>\n              <tr><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">11</td><td style=\"padding: 5px; border: 1px solid #334155;\">\"89\"</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: right;\">89</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">1</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">Não</td><td style=\"padding: 5px; border: 1px solid #334155;\">Deslocamento não válido</td></tr>\n              <tr><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">12</td><td style=\"padding: 5px; border: 1px solid #334155;\">\"97\"</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: right;\">97</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">9</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">Não</td><td style=\"padding: 5px; border: 1px solid #334155;\">Deslocamento não válido</td></tr>\n              <tr><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">13</td><td style=\"padding: 5px; border: 1px solid #334155;\">\"79\"</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: right;\">79</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">2</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">Não</td><td style=\"padding: 5px; border: 1px solid #334155;\">Deslocamento não válido</td></tr>\n              <tr><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">14</td><td style=\"padding: 5px; border: 1px solid #334155;\">\"93\"</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: right;\">93</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">5</td><td style=\"padding: 5px; border: 1px solid #334155; text-align: center;\">Não</td><td style=\"padding: 5px; border: 1px solid #334155;\">Deslocamento não válido</td></tr>\n            </tbody>\n          </table>\n\n          <h4>3. Conclusão</h4>\n          <ul>\n            <li>Houve um total de <strong>4 acertos</strong> (posições em que $t_s \\equiv 4 \\pmod{11}$): nos deslocamentos $s = 3$, $s = 4$, $s = 5$ e $s = 6$.</li>\n            <li>Desses 4 acertos, apenas $s = 6$ corresponde à <strong>ocorrência válida</strong> do padrão $P = 26$ no texto (subcadeia $T[7..8] = 26$).</li>\n            <li>Os outros 3 deslocamentos ($s = 3$, $s = 4$ e $s = 5$) são <strong>acertos espúrios</strong> causados pelas equivalências $15 \\equiv 4$, $59 \\equiv 4$ e $92 \\equiv 4 \\pmod{11}$.</li>\n            <li><strong>Resposta final:</strong> O algoritmo de Rabin-Karp encontra exatamente <strong>3 acertos espúrios</strong>. $\\blacksquare$</li>\n          </ul>\n        "
  },
  {
    "id": "ex15-2",
    "code": "EXERCÍCIO 02 • CONSTRUÇÃO DO AUTÔMATO FINITO DE BUSCA DE CADEIA",
    "reference": "Exercício 32.3-1 (p. 814)",
    "title": "Cálculo da Matriz de Transição δ(q, a) para o Padrão P = aabab sobre Σ = {a, b}",
    "prompt": "\n          <p><strong>(Exercício 32.3-1, p. 814)</strong> Construa o autômato de correspondência de cadeias para o padrão $P = \\text{aabab}$ sobre o alfabeto binário $\\Sigma = \\{a, b\\}$:</p>\n          <ol>\n            <li>Liste os estados $Q = \\{0, 1, 2, 3, 4, 5\\}$ e os prefixos $P_0, P_1, \\dots, P_5$.</li>\n            <li>Para cada estado $q \\in Q$ e caractere $c \\in \\{a, b\\}$, calcule formalmente o próximo estado $\\delta(q, c) = \\sigma(P_q c)$ determinando o mais longo prefixo de $P$ que é sufixo de $P_q c$.</li>\n            <li>Apresente a <strong>tabela de transição de estados completa</strong> de dimensão $6 \\times 2$.</li>\n            <li>Ilustre a sequência de transições de estados percorrida pelo autômato ao processar o texto $T = \\text{aababaabab}$. O padrão é detectado? Em quais deslocamentos?</li>\n          </ol>\n        ",
    "placeholder": "Para P = aabab, temos P0 = ε, P1 = a, P2 = aa, P3 = aab, P4 = aaba, P5 = aabab. A função delta(q, c) = sigma(P_q c)...",
    "solution": "\n          <h4>1. Prefixos do Padrão $P = \\text{aabab}$</h4>\n          <ul>\n            <li>$P_0 = \\varepsilon$ (comprimento 0)</li>\n            <li>$P_1 = \\text{a}$ (comprimento 1)</li>\n            <li>$P_2 = \\text{aa}$ (comprimento 2)</li>\n            <li>$P_3 = \\text{aab}$ (comprimento 3)</li>\n            <li>$P_4 = \\text{aaba}$ (comprimento 4)</li>\n            <li>$P_5 = \\text{aabab}$ (comprimento 5 — estado de aceitação)</li>\n          </ul>\n\n          <h4>2. Cálculo da Função de Transição $\\delta(q, c) = \\sigma(P_q c)$</h4>\n          <ul>\n            <li><strong>Estado $q = 0$ ($P_0 = \\varepsilon$):</strong>\n              <ul>\n                <li>$\\delta(0, a) = \\sigma(\\text{a}) = 1$ (pois $P_1 = \\text{a} \\sqsupset \\text{a}$).</li>\n                <li>$\\delta(0, b) = \\sigma(\\text{b}) = 0$ (nenhum prefixo não vazio de $P$ começa com 'b').</li>\n              </ul>\n            </li>\n            <li><strong>Estado $q = 1$ ($P_1 = \\text{a}$):</strong>\n              <ul>\n                <li>$\\delta(1, a) = \\sigma(\\text{aa}) = 2$ (pois $P_2 = \\text{aa} \\sqsupset \\text{aa}$).</li>\n                <li>$\\delta(1, b) = \\sigma(\\text{ab}) = 0$ (o mais longo prefixo que é sufixo de 'ab' é $\\varepsilon$).</li>\n              </ul>\n            </li>\n            <li><strong>Estado $q = 2$ ($P_2 = \\text{aa}$):</strong>\n              <ul>\n                <li>$\\delta(2, a) = \\sigma(\\text{aaa}) = 2$ (pois $P_2 = \\text{aa} \\sqsupset \\text{aaa}$; note que $P_3 = \\text{aab} \\not\\sqsupset \\text{aaa}$).</li>\n                <li>$\\delta(2, b) = \\sigma(\\text{aab}) = 3$ (pois $P_3 = \\text{aab} \\sqsupset \\text{aab}$).</li>\n              </ul>\n            </li>\n            <li><strong>Estado $q = 3$ ($P_3 = \\text{aab}$):</strong>\n              <ul>\n                <li>$\\delta(3, a) = \\sigma(\\text{aaba}) = 4$ (pois $P_4 = \\text{aaba} \\sqsupset \\text{aaba}$).</li>\n                <li>$\\delta(3, b) = \\sigma(\\text{aabb}) = 0$ (o maior prefixo que é sufixo de 'aabb' é $\\varepsilon$).</li>\n              </ul>\n            </li>\n            <li><strong>Estado $q = 4$ ($P_4 = \\text{aaba}$):</strong>\n              <ul>\n                <li>$\\delta(4, a) = \\sigma(\\text{aabaa}) = 2$ (pois $P_2 = \\text{aa} \\sqsupset \\text{aabaa}$).</li>\n                <li>$\\delta(4, b) = \\sigma(\\text{aabab}) = 5$ (pois $P_5 = \\text{aabab} \\sqsupset \\text{aabab}$ — transição de aceitação!).</li>\n              </ul>\n            </li>\n            <li><strong>Estado $q = 5$ ($P_5 = \\text{aabab}$ — Estado de Aceitação):</strong>\n              <ul>\n                <li>$\\delta(5, a) = \\sigma(\\text{aababa}) = 1$ (pois o sufixo 'a' coincide com $P_1 = \\text{a}$; 'aba' não é prefixo de $P$).</li>\n                <li>$\\delta(5, b) = \\sigma(\\text{aababb}) = 0$ (nenhum prefixo é sufixo).</li>\n              </ul>\n            </li>\n          </ul>\n\n          <h4>3. Tabela Completa de Transição de Estados $\\delta$</h4>\n          <table style=\"width: 60%; border-collapse: collapse; font-family: monospace; font-size: 0.95rem; text-align: center; margin: 12px 0;\">\n            <thead>\n              <tr style=\"background: #1e293b; color: #94a3b8;\">\n                <th style=\"padding: 8px; border: 1px solid #334155;\">Estado q</th>\n                <th style=\"padding: 8px; border: 1px solid #334155; color: #38bdf8;\">Entrada a</th>\n                <th style=\"padding: 8px; border: 1px solid #334155; color: #f43f5e;\">Entrada b</th>\n              </tr>\n            </thead>\n            <tbody>\n              <tr><td style=\"padding: 6px; border: 1px solid #334155; font-weight: 700;\">0</td><td style=\"padding: 6px; border: 1px solid #334155;\">1</td><td style=\"padding: 6px; border: 1px solid #334155;\">0</td></tr>\n              <tr><td style=\"padding: 6px; border: 1px solid #334155; font-weight: 700;\">1</td><td style=\"padding: 6px; border: 1px solid #334155;\">2</td><td style=\"padding: 6px; border: 1px solid #334155;\">0</td></tr>\n              <tr><td style=\"padding: 6px; border: 1px solid #334155; font-weight: 700;\">2</td><td style=\"padding: 6px; border: 1px solid #334155;\">2</td><td style=\"padding: 6px; border: 1px solid #334155;\">3</td></tr>\n              <tr><td style=\"padding: 6px; border: 1px solid #334155; font-weight: 700;\">3</td><td style=\"padding: 6px; border: 1px solid #334155;\">4</td><td style=\"padding: 6px; border: 1px solid #334155;\">0</td></tr>\n              <tr><td style=\"padding: 6px; border: 1px solid #334155; font-weight: 700;\">4</td><td style=\"padding: 6px; border: 1px solid #334155;\">2</td><td style=\"padding: 6px; border: 1px solid #334155; font-weight: 700; color: #10b981;\">5</td></tr>\n              <tr style=\"background: rgba(16, 185, 129, 0.15);\"><td style=\"padding: 6px; border: 1px solid #334155; font-weight: 700; color: #10b981;\">5 (Aceitação)</td><td style=\"padding: 6px; border: 1px solid #334155;\">1</td><td style=\"padding: 6px; border: 1px solid #334155;\">0</td></tr>\n            </tbody>\n          </table>\n\n          <h4>4. Simulação sobre o Texto $T = \\text{aababaabab}$</h4>\n          <p>O texto tem comprimento $n = 10$. Iniciando em $q_0 = 0$, processamos cada caractere $T[i]$ aplicando $\\delta(q, T[i])$:</p>\n          <ol>\n            <li>$i = 1, T[1] = a \\implies q = \\delta(0, a) = 1$</li>\n            <li>$i = 2, T[2] = a \\implies q = \\delta(1, a) = 2$</li>\n            <li>$i = 3, T[3] = b \\implies q = \\delta(2, b) = 3$</li>\n            <li>$i = 4, T[4] = a \\implies q = \\delta(3, a) = 4$</li>\n            <li>$i = 5, T[5] = b \\implies q = \\delta(4, b) = \\mathbf{5}$ $\\implies$ <strong>Casamento encontrado!</strong> Deslocamento $s = i - m = 5 - 5 = \\mathbf{0}$. Ocorrência em $T[1..5]$.</li>\n            <li>$i = 6, T[6] = a \\implies q = \\delta(5, a) = 1$</li>\n            <li>$i = 7, T[7] = a \\implies q = \\delta(1, a) = 2$</li>\n            <li>$i = 8, T[8] = b \\implies q = \\delta(2, b) = 3$</li>\n            <li>$i = 9, T[9] = a \\implies q = \\delta(3, a) = 4$</li>\n            <li>$i = 10, T[10] = b \\implies q = \\delta(4, b) = \\mathbf{5}$ $\\implies$ <strong>Casamento encontrado!</strong> Deslocamento $s = i - m = 10 - 5 = \\mathbf{5}$. Ocorrência em $T[6..10]$.</li>\n          </ol>\n          <p><strong>Resultado:</strong> O padrão $P = \\text{aabab}$ ocorre nos deslocamentos válidos <strong>$s = 0$</strong> e <strong>$s = 5$</strong>. $\\blacksquare$</p>\n        "
  },
  {
    "id": "ex15-3",
    "code": "EXERCÍCIO 03 • CÁLCULO DA FUNÇÃO DE PREFIXO KMP π",
    "reference": "Exercícios 32.4-1 e 32.4-2 (p. 823)",
    "title": "Traçado de COMPUTE-PREFIX-FUNCTION para Padrão Longo com Repetições e Cadeias de Prefixos π*",
    "prompt": "\n          <p><strong>(Exercícios 32.4-1 e 32.4-2, p. 823)</strong> Considere o padrão com forte periodicidade interna:</p>\n          $$P = \\text{ababbabbabbababbabb}$$\n          <p>cujo comprimento é $m = 19$.</p>\n          <ol>\n            <li>Execute passo a passo o procedimento <code>COMPUTE-PREFIX-FUNCTION(P)</code>, construindo a tabela completa $\\pi[1 \\dots 19]$. Indique detalhadamente as iterações do laço <code>para</code> e os recuos do laço <code>enquanto</code>.</li>\n            <li>Para o estado $q = 19$, determine a cadeia completa de prefixos próprios iterados $\\pi^*[19]$.</li>\n            <li>Demonstre o resultado geral do Exercício 32.4-2: determine um limite superior para o tamanho $|\\pi^*[q]|$ como função de $q$, e apresente um padrão que atinja exatamente essa cota máxima.</li>\n          </ol>\n        ",
    "placeholder": "Para o padrão ababbabbabbababbabb de 19 letras, pi[1] = 0 por definição. Para q = 2: P[2] = 'b' != P[1] = 'a', logo pi[2] = 0...",
    "solution": "\n          <h4>1. Execução Passo a Passo de COMPUTE-PREFIX-FUNCTION(P)</h4>\n          <p>Indexando $P[1..19] = \\text{a b a b b a b b a b b a b a b b a b b}$:</p>\n          <ul>\n            <li>$q = 1: \\pi[1] = 0$ (por definição). Inicializa $k = 0$.</li>\n            <li>$q = 2 (b): k = 0, P[1] = 'a' \\neq 'b' \\implies \\pi[2] = 0, k = 0$.</li>\n            <li>$q = 3 (a): k = 0, P[1] = 'a' == 'a' \\implies k = 1, \\pi[3] = 1$.</li>\n            <li>$q = 4 (b): k = 1, P[2] = 'b' == 'b' \\implies k = 2, \\pi[4] = 2$.</li>\n            <li>$q = 5 (b): k = 2, P[3] = 'a' \\neq 'b' \\implies k = \\pi[2] = 0$. Então $P[1] = 'a' \\neq 'b' \\implies k = 0, \\pi[5] = 0$.</li>\n            <li>$q = 6 (a): k = 0, P[1] = 'a' == 'a' \\implies k = 1, \\pi[6] = 1$.</li>\n            <li>$q = 7 (b): k = 1, P[2] = 'b' == 'b' \\implies k = 2, \\pi[7] = 2$.</li>\n            <li>$q = 8 (b): k = 2, P[3] = 'a' \\neq 'b' \\implies k = \\pi[2] = 0$. $P[1] \\neq 'b' \\implies k = 0, \\pi[8] = 0$.</li>\n            <li>$q = 9 (a): k = 0, P[1] == 'a' \\implies k = 1, \\pi[9] = 1$.</li>\n            <li>$q = 10 (b): k = 1, P[2] == 'b' \\implies k = 2, \\pi[10] = 2$.</li>\n            <li>$q = 11 (b): k = 2, P[3] \\neq 'b' \\implies k = \\pi[2] = 0$. $P[1] \\neq 'b' \\implies k = 0, \\pi[11] = 0$.</li>\n            <li>$q = 12 (a): k = 0, P[1] == 'a' \\implies k = 1, \\pi[12] = 1$.</li>\n            <li>$q = 13 (b): k = 1, P[2] == 'b' \\implies k = 2, \\pi[13] = 2$.</li>\n            <li>$q = 14 (a): k = 2, P[3] == 'a' \\implies k = 3, \\pi[14] = 3$.</li>\n            <li>$q = 15 (b): k = 3, P[4] == 'b' \\implies k = 4, \\pi[15] = 4$.</li>\n            <li>$q = 16 (b): k = 4, P[5] == 'b' \\implies k = 5, \\pi[16] = 5$.</li>\n            <li>$q = 17 (a): k = 5, P[6] == 'a' \\implies k = 6, \\pi[17] = 6$.</li>\n            <li>$q = 18 (b): k = 6, P[7] == 'b' \\implies k = 7, \\pi[18] = 7$.</li>\n            <li>$q = 19 (b): k = 7, P[8] == 'b' \\implies k = 8, \\pi[19] = 8$.</li>\n          </ul>\n\n          <h4>Tabela Consolidada de $\\pi[1..19]$:</h4>\n          <table style=\"width: 100%; border-collapse: collapse; font-family: monospace; font-size: 0.85rem; text-align: center; margin: 12px 0;\">\n            <tr style=\"background: #1e293b; color: #94a3b8;\"><td style=\"padding: 4px; border: 1px solid #334155; font-weight: 700;\">q</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td></tr>\n            <tr style=\"background: #0f172a; color: #f8fafc;\"><td style=\"padding: 4px; border: 1px solid #334155; font-weight: 700;\">P[q]</td><td>a</td><td>b</td><td>a</td><td>b</td><td>b</td><td>a</td><td>b</td><td>b</td><td>a</td><td>b</td><td>b</td><td>a</td><td>b</td><td>a</td><td>b</td><td>b</td><td>a</td><td>b</td><td>b</td></tr>\n            <tr style=\"background: #1e293b; color: #38bdf8; font-weight: 700;\"><td style=\"padding: 4px; border: 1px solid #334155;\">π[q]</td><td>0</td><td>0</td><td>1</td><td>2</td><td>0</td><td>1</td><td>2</td><td>0</td><td>1</td><td>2</td><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td></tr>\n          </table>\n\n          <h4>2. Determinação da Cadeia de Prefixos $\\pi^*[19]$</h4>\n          <p>Para $q = 19$, calculamos as aplicações iteradas de $\\pi$:</p>\n          <ul>\n            <li>$\\pi^{(1)}[19] = \\pi[19] = 8$ (o sufixo $P[12..19] = \\text{abbabbab}$ coincide com $P_8$);</li>\n            <li>$\\pi^{(2)}[19] = \\pi[8] = 0$ (atinge a cadeia vazia $\\varepsilon$).</li>\n          </ul>\n          <p>Portanto, $\\pi^*[19] = \\{8\\}$.</p>\n\n          <h4>3. Limite Superior para $|\\pi^*[q]|$ (Exercício 32.4-2)</h4>\n          <p>Como $\\pi[q] \\le q - 1$ para todo $q$ e cada aplicação sucessiva de $\\pi$ reduz o valor em pelo menos $1$ unidade até atingir $0$, temos a cota superior teórica:</p>\n          $$|\\pi^*[q]| \\le q - 1$$\n          <p>Essa cota máxima é atingida se e somente se todos os caracteres do padrão forem idênticos! Por exemplo, para o padrão homogêneo $P = a^m$ ($P = \\text{aaaaa}$ com $m = 5$):</p>\n          <ul>\n            <li>$\\pi[1] = 0, \\pi[2] = 1, \\pi[3] = 2, \\pi[4] = 3, \\pi[5] = 4$.</li>\n            <li>Para $q = 5$, temos $\\pi^*[5] = \\{4, 3, 2, 1\\}$, cujo tamanho é exatamente $|\\pi^*[5]| = 4 = q - 1$. $\\blacksquare$</li>\n          </ul>\n        "
  },
  {
    "id": "ex15-4",
    "code": "EXERCÍCIO 04 • OTIMIZAÇÃO KMP E ROTAÇÕES CÍCLICAS DE CADEIAS",
    "reference": "Exercícios 32.4-6 e 32.4-7 (p. 824)",
    "title": "Função de Prefixo Refinada π' e Algoritmo de Tempo Linear para Rotações Cíclicas",
    "prompt": "\n          <p><strong>(Exercícios 32.4-6 e 32.4-7, p. 824)</strong> Este exercício investiga uma importante otimização do algoritmo KMP e uma aplicação canônica em processamento de textos:</p>\n          <ol>\n            <li><strong>(Exercício 32.4-6)</strong> No algoritmo <code>KMP-MATCHER</code>, quando ocorre descasamento na linha 6 ($P[q+1] \\neq T[i]$) e substituímos $q = \\pi[q]$, se acontecer que $P[\\pi[q]+1] == P[q+1]$, a próxima comparação do <code>while</code> falhará imediatamente. Mostre como pré-computar a <strong>função de prefixo melhorada $\\pi'$</strong> e prove por que ela preserva a corretude da busca.</li>\n            <li><strong>(Exercício 32.4-7)</strong> Dizemos que uma cadeia $T$ de comprimento $n$ é uma <em>rotação cíclica</em> de outra cadeia $T'$ de mesmo comprimento se $T$ pode ser obtida por um deslocamento circular de $T'$ (por exemplo, <code>\"arc\"</code> e <code>\"car\"</code> são rotações cíclicas). Projete um algoritmo que determine se $T$ é uma rotação cíclica de $T'$ em tempo estritamente linear $\\Theta(n)$ utilizando o algoritmo KMP.</li>\n          </ol>\n        ",
    "placeholder": "1. Definimos pi'[q] recursivamente: se pi[q] = 0 entao 0; se P[pi[q]+1] == P[q+1] entao pi'[pi[q]] senao pi[q]... 2. Para rotacoes ciclicas, concatenamos T' com ela mesma: T'T'...",
    "solution": "\n          <h4>1. A Função de Prefixo Melhorada $\\pi'$ (Exercício 32.4-6)</h4>\n          <p>Seja $q$ o estado atual do padrão e ocorra uma falha de casamento: $P[q+1] \\neq T[i]$. Pelo KMP padrão, recuamos para $k = \\pi[q]$. Contudo, se $P[k+1] == P[q+1]$, então certamente $P[k+1] \\neq T[i]$, provocando outro recuo imediato sem nenhuma chance de casamento!</p>\n          <p>Para contornar essa redundância, definimos a função $\\pi'[1..m]$ recursivamente para $q = 1, \\dots, m$:</p>\n          $$\\pi'[q] = \\begin{cases} \n            0 & \\text{se } \\pi[q] = 0, \\\\\n            \\pi'[\\pi[q]] & \\text{se } \\pi[q] > 0 \\text{ e } P[\\pi[q] + 1] == P[q + 1], \\\\\n            \\pi[q] & \\text{se } \\pi[q] > 0 \\text{ e } P[\\pi[q] + 1] \\neq P[q + 1].\n          \\end{cases}$$\n          <p><strong>Corretude e Otimização:</strong></p>\n          <ul>\n            <li>$\\pi'[q]$ continua pertencendo à cadeia de prefixos válidos $\\pi^*[q]$, preservando a garantia de que nenhum deslocamento válido é descartado.</li>\n            <li>O algoritmo apenas salta estados intermediários que comprovadamente falhariam no teste $P[k+1] == T[i]$.</li>\n            <li>Na linha 7 de <code>KMP-MATCHER</code>, substituímos $q = \\pi[q]$ por $q = \\pi'[q]$. (Atenção: na linha 12, após encontrar uma ocorrência completa, devemos manter $q = \\pi[m]$, pois não há caractere $P[m+1]$ a comparar).</li>\n            <li>O cálculo de $\\pi'$ a partir de $\\pi$ é realizado em tempo $\\Theta(m)$ em uma única passada.</li>\n          </ul>\n\n          <h4>2. Detecção de Rotações Cíclicas em Tempo $\\Theta(n)$ (Exercício 32.4-7)</h4>\n          <p>Sejam $T$ e $T'$ duas cadeias de caracteres de mesmo comprimento $n$.</p>\n          <p><strong>Lema Fundamental de Rotação Cíclica:</strong> $T$ é uma rotação cíclica de $T'$ se e somente se $T$ for uma <strong>subcadeia da cadeia duplicada $T'T'$</strong> (isto é, a concatenação de $T'$ com ela própria)!</p>\n          <p><em>Demonstração:</em> Se $T$ é rotação de $T'$, existem cadeias $u$ e $v$ tais que $T' = uv$ e $T = vu$. Então a duplicação produz $T'T' = (uv)(uv) = u(vu)v = uTv$. Logo, $T$ ocorre como subcadeia exata de $T'T'$ na posição $|u| + 1$. Reciprocamente, qualquer subcadeia de comprimento $n$ em $T'T'$ é da forma $v u$ com $u v = T'$, logo é uma rotação cíclica. $\\blacksquare$</p>\n          <p><strong>Algoritmo Ótimo em $\\Theta(n)$:</strong></p>\n          <ol>\n            <li>Verifica se $|T| == |T'| = n$. Se não forem iguais, retorna <code>FALSE</code> em $O(1)$.</li>\n            <li>Constrói a cadeia $S = T'T'$, cujo comprimento é $2n$.</li>\n            <li>Executa <code>KMP-MATCHER(S, T)</code> tratando $S$ como texto de tamanho $2n$ e $T$ como padrão de tamanho $n$.</li>\n            <li>Se o KMP encontrar qualquer ocorrência (ao menos um deslocamento válido), retorna <code>TRUE</code>; caso contrário, retorna <code>FALSE</code>.</li>\n          </ol>\n          <p><strong>Complexidade:</strong> A duplicação consome tempo $\\Theta(n)$. O pré-processamento de $T$ via <code>COMPUTE-PREFIX-FUNCTION</code> consome $\\Theta(n)$. A busca KMP em $S$ consome $\\Theta(2n) = \\Theta(n)$. Portanto, o tempo total é estritamente <strong>$\\mathbf{\\Theta(n)}$</strong> com espaço auxiliar $\\Theta(n)$. $\\blacksquare$</p>\n        "
  },
  {
    "id": "ex15-5",
    "code": "EXERCÍCIO 05 • PRODUTOS VETORIAIS E COLINEARIDADE DE PONTOS",
    "reference": "Exercícios 33.1-1 e 33.1-4 (p. 830)",
    "title": "Demonstração de Sentido Horário e Algoritmo em O(n² lg n) para Testar Colinearidade de 3 Pontos",
    "prompt": "\n          <p><strong>(Exercícios 33.1-1 e 33.1-4, p. 830)</strong> As primitivas geométricas por produto vetorial sustentam toda a álgebra computacional do plano:</p>\n          <ol>\n            <li><strong>(Exercício 33.1-1)</strong> Prove algebricamente que, se o produto vetorial $p_1 \\times p_2 = x_1 y_2 - x_2 y_1$ é estritamente positivo, então o vetor $p_1$ está no sentido horário em relação ao vetor $p_2$ em relação à origem $(0, 0)$. Utilize as coordenadas polares $p_1 = (r_1 \\cos \\theta_1, r_1 \\sin \\theta_1)$ e $p_2 = (r_2 \\cos \\theta_2, r_2 \\sin \\theta_2)$.</li>\n            <li><strong>(Exercício 33.1-4)</strong> Dado um conjunto $Q$ de $n$ pontos no plano, mostre como determinar no tempo $O(n^2 \\lg n)$ se existem quaisquer <strong>três pontos colineares</strong> em $Q$.</li>\n          </ol>\n        ",
    "placeholder": "1. Em coordenadas polares, x1 = r1 cos(theta1), y1 = r1 sin(theta1)... O determinante fica r1 r2 (cos theta1 sin theta2 - sin theta1 cos theta2) = r1 r2 sin(theta2 - theta1)... 2. Fixamos cada ponto pi como origem e ordenamos os outros n-1 pontos...",
    "solution": "\n          <h4>1. Demonstração Algébrica do Sentido Relativo (Exercício 33.1-1)</h4>\n          <p>Expressamos os vetores $p_1$ e $p_2$ em coordenadas polares centradas na origem:</p>\n          $$p_1 = (r_1 \\cos \\theta_1, \\, r_1 \\sin \\theta_1), \\qquad p_2 = (r_2 \\cos \\theta_2, \\, r_2 \\sin \\theta_2)$$\n          <p>onde $r_1, r_2 > 0$ são as magnitudes euclidianas dos vetores e $\\theta_1, \\theta_2$ são os ângulos polares medidos em radianos a partir do semi-eixo positivo das abscissas no sentido anti-horário.</p>\n          <p>Substituindo essas coordenadas na definição do produto vetorial bidimensional:</p>\n          $$\\begin{aligned}\n            p_1 \\times p_2 &= x_1 y_2 - x_2 y_1 \\\\\n            &= (r_1 \\cos \\theta_1)(r_2 \\sin \\theta_2) - (r_2 \\cos \\theta_2)(r_1 \\sin \\theta_1) \\\\\n            &= r_1 r_2 (\\sin \\theta_2 \\cos \\theta_1 - \\cos \\theta_2 \\sin \\theta_1) \\\\\n            &= r_1 r_2 \\sin(\\theta_2 - \\theta_1).\n          \\end{aligned}$$\n          <p>Como $r_1, r_2 > 0$, o sinal de $p_1 \\times p_2$ é idêntico ao sinal de $\\sin(\\theta_2 - \\theta_1)$:</p>\n          <ul>\n            <li>Se o menor ângulo de rotação de $p_1$ para $p_2$ for no <strong>sentido anti-horário</strong>, temos $0 < \\theta_2 - \\theta_1 < \\pi$, logo $\\sin(\\theta_2 - \\theta_1) > 0 \\implies \\mathbf{p_1 \\times p_2 > 0}$. Isso equivale a dizer que o vetor $p_1$ está no <strong>sentido horário em relação a $p_2$</strong>.</li>\n            <li>Se o menor ângulo for no sentido horário, $-\\pi < \\theta_2 - \\theta_1 < 0$, logo $\\sin(\\theta_2 - \\theta_1) < 0 \\implies \\mathbf{p_1 \\times p_2 < 0}$.</li>\n            <li>Se $\\theta_2 - \\theta_1 = 0$ ou $\\pi$, os vetores estão sobre a mesma reta suporte, logo $\\sin = 0 \\implies \\mathbf{p_1 \\times p_2 = 0}$ (colineares). $\\blacksquare$</li>\n          </ul>\n\n          <h4>2. Algoritmo em $O(n^2 \\lg n)$ para Colinearidade de 3 Pontos (Exercício 33.1-4)</h4>\n          <p>Testar todas as triplas de pontos por força bruta exigiria $\\binom{n}{3} = \\Theta(n^3)$ verificações. Reduzimos para $O(n^2 \\lg n)$ iterando sobre cada ponto e aplicando ordenação angular:</p>\n          <ol>\n            <li>Para cada ponto $p_i \\in Q$ ($i = 1, \\dots, n$):\n              <ul>\n                <li>Considere os $n - 1$ outros pontos restantes $Q - \\{p_i\\}$.</li>\n                <li>Calcule a inclinação ou ordene esses $n - 1$ pontos por ângulo polar em relação a $p_i$ utilizando a sub-rotina <code>DIRECTION(p_i, p_j, p_k)</code>. Como dois pontos $p_j$ e $p_k$ na mesma reta que passa por $p_i$ têm o mesmo ângulo polar (ou diferem de $\\pi$), agrupamos os pontos por reta suporte.</li>\n                <li>A ordenação dos $n - 1$ pontos consome tempo $O(n \\lg n)$.</li>\n                <li>Percorra a lista ordenada de ângulos em tempo linear $O(n)$. Se dois pontos consecutivos tiverem o mesmo ângulo polar em relação a $p_i$ (isto é, <code>DIRECTION(p_i, p_j, p_{j+1}) == 0</code>), então $p_i, p_j$ e $p_{j+1}$ são <strong>três pontos colineares</strong>!</li>\n                <li>Se encontrar, retorne <code>TRUE</code> imediatamente.</li>\n              </ul>\n            </li>\n            <li>Se nenhum ponto encontrar tripla colinear após testar todos os $n$ pontos como pivô, retorne <code>FALSE</code>.</li>\n          </ol>\n          <p><strong>Complexidade:</strong> O laço externo executa $n$ vezes. Em cada iteração, ordenamos $n - 1$ pontos em $O(n \\lg n)$ e varremos em $O(n)$. Tempo total: $n \\times O(n \\lg n) = \\mathbf{O(n^2 \\lg n)}$. $\\blacksquare$</p>\n        "
  },
  {
    "id": "ex15-6",
    "code": "EXERCÍCIO 06 • PONTO NO INTERIOR DE POLÍGONO E RAIO HORIZONTAL",
    "reference": "Exercícios 33.1-6 e 33.1-7 (p. 831)",
    "title": "O Algoritmo do Traçado de Raio (Ray-Casting) para Inclusão de Ponto em Polígono em Tempo O(n)",
    "prompt": "\n          <p><strong>(Exercícios 33.1-6 e 33.1-7, p. 831)</strong> Um problema canônico em computação gráfica e GIS consiste em determinar se um ponto dado $p_0 = (x_0, y_0)$ reside no interior de um polígono simples $P$ formado por $n$ vértices $\\langle v_1, v_2, \\dots, v_n \\rangle$ e arestas $e_i = v_i v_{i+1}$ (com $v_{n+1} = v_1$):</p>\n          <ol>\n            <li>Defina o conceito de <strong>raio horizontal direito</strong> que parte de $p_0$.</li>\n            <li>Apresente o <strong>Algoritmo do Traçado de Raio</strong> (<em>Ray-Casting / Teorema da Curva de Jordan</em>) para determinar se $p_0$ está no interior de $P$ em tempo linear $O(n)$ utilizando o procedimento <code>SEGMENTS-INTERSECT</code>.</li>\n            <li>Explique com rigor como tratar formalmente os <strong>casos degenerados de fronteira</strong>:\n              <ul>\n                <li>Quando o raio intercepta exatamente um dos vértices do polígono ($y_0 = v_i.y$);</li>\n                <li>Quando uma aresta do polígono é horizontal e colinear com o raio.</li>\n              </ul>\n            </li>\n          </ol>\n        ",
    "placeholder": "O raio horizontal direito a partir de p0 é o conjunto de pontos {(x, y) : x >= x0 e y = y0}. Pelo Teorema de Jordan, traçamos um segmento que se estende até o infinito...",
    "solution": "\n          <h4>1. O Raio Horizontal Direito</h4>\n          <p>O <strong>raio horizontal direito</strong> que emana do ponto $p_0 = (x_0, y_0)$ é formalmente o conjunto de pontos (p. 831):</p>\n          $$R(p_0) = \\{ (x, y) \\in \\mathbb{R}^2 : x \\ge x_0 \\text{ e } y = y_0 \\}$$\n          <p>Para fins computacionais, representamos o raio por um segmento de reta longo $p_0 p_{\\infty}$, onde $p_{\\infty} = (x_{\\max} + 1, y_0)$, sendo $x_{\\max} = \\max_{1 \\le i \\le n} v_i.x$ a maior coordenada $x$ dentre todos os vértices de $P$.</p>\n\n          <h4>2. O Princípio do Traçado de Raio (Teorema da Curva de Jordan)</h4>\n          <p>Pelo <strong>Teorema da Curva de Jordan</strong>, todo polígono simples no plano divide o plano em duas regiões conexas disjuntas: o <em>interior</em> (limitado) e o <em>exterior</em> (ilimitado):</p>\n          <ul>\n            <li>Ao cruzar uma aresta do polígono, passamos do exterior para o interior ou do interior para o exterior.</li>\n            <li>Como o ponto $p_{\\infty}$ está garantidamente no <strong>exterior</strong> do polígono (pois está estritamente à direita de todos os vértices), se percorrermos o raio do exterior em direção a $p_0$:\n              <ul>\n                <li>Se o raio interceptar as arestas do polígono um número <strong>ímpar</strong> de vezes, o ponto $p_0$ está no <strong>INTERIOR</strong> de $P$.</li>\n                <li>Se o raio interceptar as arestas um número <strong>par</strong> de vezes (ou $0$), o ponto $p_0$ está no <strong>EXTERIOR</strong> de $P$.</li>\n              </ul>\n            </li>\n          </ul>\n\n          <h4>3. Tratamento Rigoroso dos Casos Degenerados</h4>\n          <p>Os desafios mais sutis surgem nas condições de contorno:</p>\n          <ol>\n            <li><strong>O Ponto $p_0$ sobre a Borda:</strong> Se para qualquer aresta $v_i v_{i+1}$ o procedimento <code>DIRECTION(v_i, v_{i+1}, p_0) == 0</code> e <code>ON-SEGMENT(v_i, v_{i+1}, p_0) == TRUE</code>, o ponto está na própria fronteira do polígono.</li>\n            <li><strong>O Raio Passa por um Vértice $v_i$:</strong> Se uma aresta cruzar o raio em seu vértice final ($v_i.y = y_0$), esse vértice pertence a duas arestas adjacentes ($v_{i-1} v_i$ e $v_i v_{i+1}$). Se contássemos a interseção em ambas as arestas, somaríamos $+2$ (paridade inalterada), mesmo quando a curva localmente transpassa o raio!<br>\n            <em>Regra de Normalização:</em> Para cada aresta $v_i v_{i+1}$, consideramos o intervalo semi-aberto nas ordenadas verticais: a aresta cruza o raio se e somente se:\n              $$\\min(v_i.y, v_{i+1}.y) < y_0 \\le \\max(v_i.y, v_{i+1}.y)$$\n              Essa convenção garante que o vértice com menor $y$ não conta, e o vértice com maior $y$ conta uma única vez!</li>\n            <li><strong>Arestas Horizontais Colineares ($v_i.y = v_{i+1}.y = y_0$):</strong> Pela regra semi-aberta acima, como $\\min(y, y) = y_0$ não é estritamente menor que $y_0$, arestas horizontais são <strong>completamente ignoradas na contagem de cruzamentos</strong>. Isso é geometricamente correto, pois caminhar ao longo de uma aresta horizontal não transpassa o interior para o exterior.</li>\n          </ol>\n\n          <h4>4. Pseudocódigo e Análise de Complexidade</h4>\n          <div class=\"clrs-pseudocode-box\">\n            <div class=\"pseudocode-header\">\n              <span class=\"proc-name\">POINT-IN-POLYGON(P, p₀)</span>\n              <span>[ Tempo O(n) ]</span>\n            </div>\n            <div class=\"pseudocode-lines\">\n              <div class=\"code-line\"><span class=\"line-num\">1</span><span class=\"line-content\">cruzamentos = 0</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">2</span><span class=\"line-content\"><span class=\"kw\">para</span> i = 1 até n</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">3</span><span class=\"line-content\">   u = v_i,  v = v_{i+1}   (com v_{n+1} = v_1)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">4</span><span class=\"line-content\">   <span class=\"kw\">se</span> ON-SEGMENT(u, v, p_0) e DIRECTION(u, v, p_0) == 0</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">5</span><span class=\"line-content\">       <span class=\"kw\">retorne</span> \"NA-BORDA\"</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">6</span><span class=\"line-content\">   <span class=\"kw\">se</span> ((u.y ≤ p_0.y e p_0.y < v.y) ou (v.y ≤ p_0.y e p_0.y < u.y))</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">7</span><span class=\"line-content\">       <span class=\"cmt\">// Testa se a aresta cruza à direita de p_0 via produto vetorial</span></span></div>\n              <div class=\"code-line\"><span class=\"line-num\">8</span><span class=\"line-content\">       <span class=\"kw\">se</span> DIRECTION(u, v, p_0) < 0 (ajustando a orientação u -> v)</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">9</span><span class=\"line-content\">           cruzamentos = cruzamentos + 1</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">10</span><span class=\"line-content\"><span class=\"kw\">se</span> cruzamentos é ímpar</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">11</span><span class=\"line-content\">  <span class=\"kw\">retorne</span> \"INTERIOR\"</span></div>\n              <div class=\"code-line\"><span class=\"line-num\">12</span><span class=\"line-content\"><span class=\"kw\">senão</span> <span class=\"kw\">retorne</span> \"EXTERIOR\"</span></div>\n            </div>\n          </div>\n          <p><strong>Complexidade:</strong> O algoritmo inspeciona cada uma das $n$ arestas do polígono exatamente uma vez, executando operações em tempo $O(1)$ por aresta. O tempo total é estritamente <strong>$\\mathbf{O(n)}$</strong> com espaço auxiliar $O(1)$. $\\blacksquare$</p>\n        "
  },
  {
    "id": "ex15-7",
    "code": "EXERCÍCIO 07 • VARREDURA DE LINHA: NÚMERO DE INTERSEÇÕES E DISCOS",
    "reference": "Exercícios 33.2-1 e 33.2-6 (p. 837)",
    "title": "Limite Quadrático de Interseções e Algoritmo de Varredura para Interseção de Discos em O(n lg n)",
    "prompt": "\n          <p><strong>(Exercícios 33.2-1 e 33.2-6, p. 837)</strong> O paradigma de varredura de linha (sweep-line) é uma ferramenta versátil na geometria algorítmica:</p>\n          <ol>\n            <li><strong>(Exercício 33.2-1)</strong> Mostre que um conjunto de $n$ segmentos de reta pode conter $\\Theta(n^2)$ interseções no total. Apresente uma construção geométrica explícita que comprove esse limite.</li>\n            <li><strong>(Exercício 33.2-6)</strong> Um disco no plano é definido pelo seu centro $c = (x, y)$ e raio $r > 0$. Dois discos se interceptam se a distância euclidiana entre seus centros for menor ou igual à soma de seus raios: $d(c_1, c_2) \\le r_1 + r_2$. Mostre como adaptar o algoritmo de varredura de linha para determinar se <strong>quaisquer dois discos em um conjunto de $n$ discos se interceptam</strong> no tempo $O(n \\lg n)$.</li>\n          </ol>\n        ",
    "placeholder": "1. Construímos uma grade de n/2 segmentos verticais e n/2 segmentos horizontais... 2. Para cada disco D_i com centro (x_i, y_i) e raio r_i, os eventos sao x_i - r_i (entrada) e x_i + r_i (saida)...",
    "solution": "\n          <h4>1. Construção com $\\Theta(n^2)$ Interseções (Exercício 33.2-1)</h4>\n          <p>Para demonstrar que $n$ segmentos podem se interceptar $\\Theta(n^2)$ vezes, construímos uma <strong>grade ortogonal regular</strong>:</p>\n          <ul>\n            <li>Seja $k = \\lfloor n / 2 \\rfloor$. Criamos $k$ segmentos verticais paralelos:\n              $$V_i = \\text{segmento de } (i, 0) \\text{ até } (i, k + 1), \\quad \\text{para } i = 1, 2, \\dots, k.$$\n            </li>\n            <li>Criamos $n - k \\ge k$ segmentos horizontais paralelos:\n              $$H_j = \\text{segmento de } (0, j) \\text{ até } (k + 1, j), \\quad \\text{para } j = 1, 2, \\dots, n - k.$$\n            </li>\n          </ul>\n          <p>Cada segmento vertical $V_i$ cruza <em>todos</em> os segmentos horizontais $H_j$ exatamente no ponto $(i, j)$. Portanto, o número total de interseções é:</p>\n          $$k \\cdot (n - k) = \\lfloor n/2 \\rfloor \\cdot \\lceil n/2 \\rceil = \\mathbf{\\Theta(n^2)}.$$\n          <p>Isso prova por que qualquer algoritmo que imprime <em>todas</em> as interseções requer tempo $\\Omega(n^2)$ no pior caso, justificando o foco de <code>ANY-SEGMENTS-INTERSECT</code> em apenas responder <code>TRUE</code> ou <code>FALSE</code> em tempo $O(n \\lg n)$.</p>\n\n          <h4>2. Detecção de Interseção de Discos em $O(n \\lg n)$ (Exercício 33.2-6)</h4>\n          <p>Dado um conjunto de $n$ discos $D_1, \\dots, D_n$, com centros $c_i = (x_i, y_i)$ e raios $r_i$:</p>\n          <ol>\n            <li><strong>Pontos de Evento na Linha de Varredura:</strong> Para cada disco $D_i$, a linha vertical $\\mathcal{L}$ intercepta o disco no intervalo de coordenadas $x \\in [x_i - r_i, \\, x_i + r_i]$. Portanto, definimos $2n$ eventos:\n              <ul>\n                <li><strong>Evento de Inserção:</strong> na extremidade mais à esquerda $x = x_i - r_i$;</li>\n                <li><strong>Evento de Remoção:</strong> na extremidade mais à direita $x = x_i + r_i$.</li>\n              </ul>\n              Todos os $2n$ eventos são ordenados por coordenada $x$ em tempo $O(n \\lg n)$.\n            </li>\n            <li><strong>Status da Linha de Varredura $T$:</strong> Mantemos uma árvore de busca binária balanceada (rubro-negra) $T$ contendo os discos atualmente ativos cortados por $\\mathcal{L}$. Como a forma circular pode tornar a ordem vertical dependente de $x$, ordenamos os discos ativos em $T$ simplesmente pela <strong>coordenada $y_i$ de seus centros</strong>!</li>\n            <li><strong>Processamento dos Eventos:</strong>\n              <ul>\n                <li>Quando a linha atinge a extremidade esquerda de $D_i$ ($x = x_i - r_i$):\n                  <ul>\n                    <li>Insira $D_i$ em $T$ usando sua chave $y_i$.</li>\n                    <li>Consulte o predecessor e sucessor imediatos em $T$ (os discos com centros mais próximos acima e abaixo em $y$).</li>\n                    <li>Para cada vizinho $D_j$, teste se $d(c_i, c_j) \\le r_i + r_j$ (ou seja, se $(x_i - x_j)^2 + (y_i - y_j)^2 \\le (r_i + r_j)^2$).</li>\n                    <li>Se interceptar, retorne <code>TRUE</code> imediatamente!</li>\n                  </ul>\n                </li>\n                <li>Quando a linha atinge a extremidade direita de $D_i$ ($x = x_i + r_i$):\n                  <ul>\n                    <li>Consulte o predecessor e sucessor de $D_i$ em $T$.</li>\n                    <li>Teste a condição de interseção entre esse predecessor e sucessor. Se interceptarem, retorne <code>TRUE</code>.</li>\n                    <li>Remova $D_i$ da árvore $T$.</li>\n                  </ul>\n                </li>\n              </ul>\n            </li>\n            <li>Se todos os eventos forem processados sem nenhuma colisão, retorne <code>FALSE</code>.</li>\n          </ol>\n          <p><strong>Complexidade:</strong> A ordenação dos $2n$ eventos leva $O(n \\lg n)$. Cada evento executa operações na árvore rubro-negra em tempo $O(\\lg n)$ e testes de distância em $O(1)$. Portanto, o algoritmo opera no tempo ótimo $\\mathbf{O(n \\lg n)}$. $\\blacksquare$</p>\n        "
  },
  {
    "id": "ex15-8",
    "code": "EXERCÍCIO 08 • ENVOLTÓRIA CONVEXA E PAR DE PONTOS MAIS PRÓXIMOS",
    "reference": "Exercícios 33.3-1 e 33.4-2 (pp. 844 e 851)",
    "title": "Vértices Extremos em GRAHAM-SCAN e o Limite Refinado de 5 Comparações no Par Mais Próximo",
    "prompt": "\n          <p><strong>(Exercícios 33.3-1 e 33.4-2, pp. 844 e 851)</strong> Propriedades de otimalidade e limites estruturais:</p>\n          <ol>\n            <li><strong>(Exercício 33.3-1)</strong> No procedimento <code>GRAHAM-SCAN</code>, os pontos restantes $Q - \\{p_0\\}$ são ordenados por ângulo polar em relação ao ponto âncora $p_0$, resultando na sequência $\\langle p_1, p_2, \\dots, p_m \\rangle$. Prove formalmente que os pontos extremos $p_1$ e $p_m$ dessa sequência <strong>devem ser vértices da envoltória convexa $\\text{CH}(Q)$</strong>.</li>\n            <li><strong>(Exercício 33.4-2)</strong> No algoritmo do par de pontos mais próximos por divisão e conquista, o CLRS demonstra que basta verificar no máximo <strong>7 pontos subsequentes</strong> na lista $Y'$ ordenada por $y$ dentro do retângulo $2\\delta \\times \\delta$. Mostre que, na realidade, através de uma análise mais rigorosa do empacotamento euclidiano de círculos de raio $\\delta$, <strong>basta verificar no máximo 5 pontos subsequentes</strong>!</li>\n          </ol>\n        ",
    "placeholder": "1. p1 tem o menor angulo polar em relacao a p0. Tracamos uma reta suporte passando por p0 e p1... 2. No retangulo 2delta x delta, consideramos o circulo centrado em cada ponto...",
    "solution": "\n          <h4>1. Prova de que $p_1$ e $p_m$ São Vértices da Envoltória Convexa (Exercício 33.3-1)</h4>\n          <p>Seja $p_0$ o ponto de menor coordenada $y$ em $Q$ (desempatando pelo menor $x$). Já sabemos que $p_0$ é um vértice extremo de $\\text{CH}(Q)$.</p>\n          <p><strong>Prova para $p_1$:</strong></p>\n          <ul>\n            <li>Por definição da ordenação polar, $p_1$ é o ponto com o <em>menor ângulo polar</em> em relação a $p_0$. Se houver múltiplos pontos com esse mesmo menor ângulo polar, $p_1$ foi escolhido como o mais afastado de $p_0$.</li>\n            <li>Considere a reta orientada $L_1$ que passa por $p_0$ e $p_1$. Como nenhum ponto em $Q$ possui ângulo polar menor que o de $p_1$ e todos os pontos têm ordenada $y \\ge p_0.y$, <strong>todos os pontos de $Q$ estão situados à esquerda de $L_1$ ou sobre o segmento $p_0 p_1$</strong>.</li>\n            <li>Portanto, $L_1$ é uma <strong>reta de suporte</strong> para o conjunto $Q$. Como $p_1$ é o ponto mais extremo em $L_1$, ele não pode ser expresso como uma combinação convexa estrita de quaisquer outros pontos de $Q$. Logo, $p_1$ é necessariamente um vértice de $\\text{CH}(Q)$.</li>\n          </ul>\n          <p><strong>Prova para $p_m$:</strong></p>\n          <ul>\n            <li>Simetricamente, $p_m$ é o ponto que possui o <em>maior ângulo polar</em> em relação a $p_0$ (desempatando pelo mais afastado).</li>\n            <li>A reta orientada $L_m$ que passa por $p_0$ e $p_m$ delimita o conjunto $Q$ de tal forma que todos os outros pontos residem à sua direita (ou seja, no sentido horário em relação a $p_0 p_m$).</li>\n            <li>Assim, $L_m$ também é uma reta de suporte para $Q$, e como $p_m$ é o ponto mais distante nessa direção, $p_m$ deve ser obrigatoriamente um vértice de $\\text{CH}(Q)$. $\\blacksquare$</li>\n          </ul>\n\n          <h4>2. Limite Refinado de 5 Comparações no Par Mais Próximo (Exercício 33.4-2)</h4>\n          <p>No texto principal do CLRS (p. 848), a partição em dois quadrados $\\delta \\times \\delta$ demonstra que no máximo 4 pontos de $P_L$ e 4 pontos de $P_R$ cabem no retângulo $2\\delta \\times \\delta$, totalizando $8 - 1 = 7$ comparações.</p>\n          <p>Podemos refinar essa cota geométrica para <strong>no máximo 5 comparações</strong> observando as restrições euclidianas:</p>\n          <ol>\n            <li>Seja $p = (x_p, y_p) \\in Y'$ o ponto sob análise. Suponha, sem perda de generalidade, que $p \\in P_L$ (lado esquerdo da linha $l$). Todos os outros pontos $q$ a serem comparados satisfazem $y_p \\le q.y \\le y_p + \\delta$.</li>\n            <li>Quantos outros pontos de $P_L$ podem residir no quadrado esquerdo $[\\hat{x} - \\delta, \\hat{x}] \\times [y_p, y_p + \\delta]$? Como a distância mútua entre quaisquer dois pontos em $P_L$ é pelo menos $\\delta$, o número máximo de pontos em um quadrado $\\delta \\times \\delta$ é 4. Contudo, se um ponto está no canto inferior, os outros só podem residir nos outros cantos. Mais especificamente, se $p$ está no quadrado, no máximo <strong>3 outros pontos</strong> de $P_L$ podem coexistir com $p$.</li>\n            <li>Quantos pontos de $P_R$ podem estar a uma distância $< \\delta$ de $p$? Os pontos de $P_R$ devem residir na região $[\\hat{x}, \\hat{x} + \\delta] \\times [y_p, y_p + \\delta]$ e, simultaneamente, dentro do semicírculo de raio $\\delta$ centrado em $p$.</li>\n            <li>Como todos os pontos em $P_R$ devem distar pelo menos $\\delta$ entre si, é geometricamente impossível empacotar mais de <strong>2 pontos de $P_R$</strong> dentro da interseção do semicírculo de raio $\\delta$ com a faixa direita $[\\hat{x}, \\hat{x} + \\delta]$ mantendo distância $\\ge \\delta$ entre eles!</li>\n            <li>Somando os pontos possíveis que podem ter distância $< \\delta$ de $p$ com coordenada $y \\ge y_p$:\n              $$\\text{No máximo } 3 \\text{ pontos em } P_L - \\{p\\} \\quad + \\quad \\text{no máximo } 2 \\text{ pontos em } P_R \\quad = \\quad \\mathbf{5 \\text{ pontos!}}$$\n          </ol>\n          <p>Assim, basta inspecionar no máximo os <strong>5 pontos subsequentes</strong> no arranjo $Y'$, confirmando a suficiência da constante 5 e preservando com perfeição a complexidade $\\Theta(n \\lg n)$. $\\blacksquare$</p>\n        "
  }
];


  if (typeof window !== "undefined" && typeof window.registerCodexModule === "function") {
    window.registerCodexModule(15, {
      revisao,
      unidades,
      initWorkbenches,
      quizzes,
      exercicios
    });
  }
})();
