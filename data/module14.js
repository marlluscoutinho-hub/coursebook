/**
 * Codex Curricularium — Módulo 14
 * Polinômios, Transformada Rápida de Fourier (FFT) e Teoria dos Números
 * Capítulos 30 e 31 do CLRS (pp. 726–795)
 * Algoritmos: Teoria e Prática, 3ª Edição — Cormen, Leiserson, Rivest e Stein
 */
(function () {
  "use strict";

/* ========================================================================
     SEÇÃO 1: REVISÃO ACADÊMICA E PILARES FUNDAMENTAIS DO MÓDULO 14
     Capítulos 30 e 31 do CLRS (pp. 726–795)
     ======================================================================== */
  const revisao = {
    subtitle:
      "Polinômios, Transformada Rápida de Fourier (FFT), Algoritmo de Euclides, Aritmética Modular, Teorema Chinês do Resto e Fundamentos da Criptografia RSA (Caps. 30 e 31, pp. 726–795)",
    intro: `
      <p>O <strong>Módulo 14</strong> estabelece uma das pontes mais profundas e revolucionárias entre a <strong>álgebra abstrata</strong>, a <strong>análise harmônica discreta</strong> e a <strong>ciência da computação teórica e aplicada</strong>. Nos Capítulos 30 e 31 do CLRS (pp. 726–795), exploramos como estruturas matemáticas elegantes transformam barreiras assintóticas aparentemente intransponíveis em algoritmos de eficiência extraordinária:</p>
      <ul>
        <li><strong>A Transformada Rápida de Fourier (FFT, Cap. 30):</strong> A multiplicação tradicional de dois polinômios de grau $n$ na representação por coeficientes exige tempo $\\Theta(n^2)$ via convolução direta. No entanto, na <em>representação por pares ponto-valor</em>, dois polinômios podem ser multiplicados em tempo estritamente linear $\\Theta(n)$. O algoritmo da FFT (descoberto por Gauss em 1805 e redescoberto por Cooley e Tukey em 1965) explora a simetria de grupo das <strong>raízes complexas da unidade</strong> para transitar entre os domínios dos coeficientes e dos valores de ponto em apenas <strong>$\\Theta(n \\lg n)$</strong>, viabilizando o processamento digital de sinais moderno, compressão multimídia (JPEG, MP3) e multiplicação de inteiros de precisão arbitrária.</li>
        <li><strong>Algoritmos da Teoria dos Números e Criptografia (Cap. 31):</strong> A teoria dos números — outrora considerada o ramo mais puro e abstrato da matemática — tornou-se a espinha dorsal da segurança cibernética global. Analisamos o <strong>Algoritmo de Euclides</strong> e sua extensão de Bézout em tempo $O(\\lg(\\min(a, b)))$, a estrutura dos grupos multiplicativos $\\mathbb{Z}_n^*$, o <strong>Teorema Chinês do Resto (CRT)</strong>, o <strong>Criptossistema de Chave Pública RSA</strong> (fundamentado no Teorema de Euler e na intratabilidade da fatoração de inteiros), o <strong>Teste de Primalidade Probabilístico de Miller-Rabin</strong> com taxa de erro assintótica $\\le 2^{-s}$ e a elegante heurística de fatoração <strong>Pollard-Rho</strong> baseada no Paradoxo do Aniversário.</li>
      </ul>
    `,
    pillars: [
      {
        tag: "[ PILAR 01 • REPRESENTAÇÃO DE COEFICIENTES VS. PONTO-VALOR E A ESTRATÉGIA DA FFT ]",
        title: "Dualidade de Representações e Multiplicação de Polinômios em Tempo Linear por Ponto-Valor (Seção 30.1)",
        body: `
          <p>Um polinômio de grau limitado por $n$ sobre um corpo algébrico $\\mathbb{F}$ (tipicamente $\\mathbb{C}$) admite duas representações fundamentais (pp. 726–731):</p>
          <ul>
            <li><strong>Representação por Coeficientes:</strong> O vetor $a = (a_0, a_1, \\dots, a_{n-1})$ define formalmente $A(x) = \\sum_{j=0}^{n-1} a_j x^j$. A avaliação em um ponto $x_0$ é realizada em tempo ótimo linear $\\Theta(n)$ pela <strong>Regra de Horner</strong>:
              $$A(x_0) = a_0 + x_0\\big(a_1 + x_0(a_2 + \\dots + x_0(a_{n-2} + x_0 a_{n-1})\\dots)\\big).$$
              A adição de polinômios de grau $n$ custa $\\Theta(n)$, mas a multiplicação por <strong>convolução direta</strong> $c_k = \\sum_{j=0}^k a_j b_{k-j}$ exige $\\Theta(n^2)$ operações aritméticas elementares.</li>
            <li><strong>Representação por Pares Ponto-Valor:</strong> Um conjunto de $n$ pares ordenados $\\{(x_0, y_0), (x_1, y_1), \\dots, (x_{n-1}, y_{n-1})\\}$, com todos os $x_k$ distintos e $y_k = A(x_k)$. Pelo <strong>Teorema 30.1 (Unicidade da Interpolação)</strong>, essa representação é única porque a <strong>matriz de Vandermonde</strong> $V(x_0, \\dots, x_{n-1})$ tem determinante $\\prod_{0 \\le j < k < n} (x_k - x_j) \\neq 0$, sendo estritamente não singular! A interpolação pode ser expressa explicitamente pela <strong>Fórmula de Interpolação de Lagrange</strong>:
              $$A(x) = \\sum_{k=0}^{n-1} y_k \\prod_{j \\neq k} \\frac{x - x_j}{x_k - x_j}.$$
            </li>
            <li><strong>A Grande Sacada da Multiplicação em $\\Theta(n \\lg n)$:</strong> Dadas as representações por pares ponto-valor de $A(x)$ e $B(x)$ em $2n$ pontos distintos, o produto $C(x) = A(x)B(x)$ é obtido por simples multiplicação ponto a ponto: $C(x_k) = A(x_k) \\cdot B(x_k)$ em tempo $\\Theta(n)$! O gargalo histórico residia em converter entre coeficientes e pares ponto-valor em tempo subquadrático. A FFT resolve esse problema avaliando os polinômios nas <strong>raízes complexas da unidade</strong> em $\\Theta(n \\lg n)$!</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 02 • RAÍZES COMPLEXAS DA UNIDADE, PROPRIEDADES E O ALGORITMO RECURSIVE-FFT ]",
        title: "Lemas do Cancelamento, do Quadrado e do Somatório: A Decomposição Par-Ímpar de Cooley-Tukey (Seção 30.2)",
        body: `
          <p>A escolha dos pontos de avaliação é o núcleo mágico da Transformada Rápida de Fourier (pp. 731–738):</p>
          <ul>
            <li><strong>Raízes $n$-ésimas Complexas da Unidade:</strong> São os números complexos $\\omega_n^k = e^{2\\pi i k / n} = \\cos(2\\pi k / n) + i \\sin(2\\pi k / n)$ para $k = 0, 1, \\dots, n-1$. Elas formam um grupo cíclico multiplicativo isomórfico a $(\\mathbb{Z}_n, +)$.</li>
            <li><strong>Propriedades Algébricas Cruciais:</strong>
              <ul>
                <li><strong>Lema do Cancelamento (Lema 30.2):</strong> $\\omega_{dn}^{dk} = \\omega_n^k$, para quaisquer inteiros $n \\ge 0, d > 0, k \\ge 0$. Em particular, $\\omega_n^{n/2} = \\omega_2 = -1$ (Corolário 30.3).</li>
                <li><strong>Lema do Quadrado (Lema 30.4):</strong> Os quadrados das $n$ raízes $n$-ésimas da unidade são exatamente as $n/2$ raízes $(n/2)$-ésimas da unidade: $(\\omega_n^k)^2 = (\\omega_n^{k + n/2})^2 = \\omega_{n/2}^k$. Reduzimos a quantidade de pontos à metade a cada etapa recursiva!</li>
                <li><strong>Lema do Somatório (Lema 30.5):</strong> $\\sum_{j=0}^{n-1} (\\omega_n^k)^j = 0$ para qualquer $k$ não divisível por $n$, garantindo a ortogonalidade das colunas da DFT.</li>
              </ul>
            </li>
            <li><strong>Divisão e Conquista (Algoritmo de Cooley-Tukey):</strong> Decompomos $A(x)$ em coeficientes de índices pares $A^{[0]}(y) = \\sum a_{2j} y^j$ e ímpares $A^{[1]}(y) = \\sum a_{2j+1} y^j$, de modo que $A(x) = A^{[0]}(x^2) + x A^{[1]}(x^2)$. Para cada $k \\in \\{0, \\dots, n/2 - 1\\}$, as <strong>operações borboleta</strong> combinam as soluções dos subproblemas de tamanho $n/2$:
              $$y_k = y_k^{[0]} + \\omega_n^k y_k^{[1]}, \\qquad y_{k + n/2} = y_k^{[0]} - \\omega_n^k y_k^{[1]}.$$
              A recorrência $T(n) = 2T(n/2) + \\Theta(n)$ tem solução estrita $T(n) = \\Theta(n \\lg n)$!</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 03 • FFT ITERATIVA, BIT-REVERSAL E CIRCUITOS PARALELOS EM Θ(lg n) ]",
        title: "Cálculo no Lugar, Permutação Inversa de Bits e a DFT Inversa (Seção 30.3)",
        body: `
          <p>Transformar a recursão de Cooley-Tukey em um circuito de hardware ou código iterativo no lugar de alto rendimento exige compreender a topologia da árvore de recursão (pp. 738–747):</p>
          <ul>
            <li><strong>A Permutação de Reversão de Bits (<em>Bit-Reversal Permutation</em>):</strong> Ao rastrear as chamadas recursivas, os coeficientes nas folhas da árvore aparecem na ordem determinada pela inversão dos bits de seus índices binários. Para $n = 8$, os índices $(0, 1, 2, 3, 4, 5, 6, 7)$ (em binário $000, 001, 010, 011, 100, 101, 110, 111$) tornam-se $(0, 4, 2, 6, 1, 5, 3, 7)$ (em binário invertido $000, 100, 010, 110, 001, 101, 011, 111$). O procedimento <code>BIT-REVERSE-COPY</code> pré-ordena o vetor em tempo $O(n \\lg n)$ (ou $\\Theta(n)$ via tabela ou contador Gray invertido).</li>
            <li><strong>O Algoritmo <code>ITERATIVE-FFT</code>:</strong> Com o vetor reorganizado no lugar, executa $\\lg n$ estágios $s = 1, \\dots, \\lg n$. No estágio $s$, combina subproblemas de tamanho $m = 2^s$ usando fatores de giro $\\omega_m^j = e^{2\\pi i j / m}$ e variáveis temporárias $u$ e $t$, dispensando completamente alocações dinâmicas de memória.</li>
            <li><strong>Circuitos FFT Paralelos e DFT Inversa:</strong> Um circuito FFT de $n$ entradas possui $\\lg n$ estágios de $n/2$ borboletas paralelas, apresentando <strong>profundidade de caminho crítico $\\Theta(\\lg n)$</strong> e trabalho $\\Theta(n \\lg n)$. A <strong>DFT Inversa ($\\text{DFT}_n^{-1}$)</strong> calcula a interpolação aplicando exatamente o mesmo algoritmo, substituindo $\\omega_n$ por $\\omega_n^{-1}$ e dividindo os resultados finais por $n$ (Teorema 30.7)!</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 04 • TEORIA DOS NÚMEROS, ARITMÉTICA MODULAR E CRIPTOGRAFIA RSA ]",
        title: "Algoritmos de Euclides, Grupos ℤₙ*, Teorema Chinês do Resto, Miller-Rabin e RSA (Capítulo 31)",
        body: `
          <p>O Capítulo 31 constrói o ferramental numérico que fundamenta a segurança e a computação distribuída contemporâneas (pp. 748–795):</p>
          <ul>
            <li><strong>Divisibilidade e Teorema de Bézout:</strong> O máximo divisor comum satisfaz $\\text{mdc}(a, b) = \\min\\{ax + by > 0 : x, y \\in \\mathbb{Z}\\}$. O procedimento <code>EUCLID(a, b)</code> computa $\\text{mdc}(a, b)$ em tempo logarítmico; pelo <strong>Teorema de Lamé (Teorema 31.11)</strong>, o número de divisões é limitado por $5 \\log_{10} b + 1$, com o pior caso ocorrendo para números consecutivos de Fibonacci $F_{k+1}, F_k$. O algoritmo <code>EXTENDED-EUCLID(a, b)</code> retorna $(d, x, y)$ tais que $ax + by = d$, viabilizando o cálculo do <strong>inverso multiplicativo modular</strong> $a^{-1} \\bmod n$.</li>
            <li><strong>Estrutura de $\\mathbb{Z}_n^*$ e Teorema Chinês do Resto (CRT):</strong> O grupo multiplicativo $\\mathbb{Z}_n^*$ possui ordem $\\phi(n) = n \\prod_{p \\mid n} (1 - 1/p)$. Pelo <strong>Teorema de Euler</strong>, $a^{\\phi(n)} \\equiv 1 \\pmod n$. Pelo <strong>Teorema Chinês do Resto (Teorema 31.27)</strong>, para módulos coprimos dois a dois, o sistema $x \\equiv a_i \\pmod{n_i}$ possui solução única módulo $m = \\prod n_i$, calculada explicitamente por $x = \\sum a_i M_i (M_i^{-1} \\bmod n_i) \\pmod m$.</li>
            <li><strong>O Criptossistema RSA e Primalidade:</strong> O RSA seleciona primos grandes $p, q$, calcula $n = pq$, $\\phi(n) = (p-1)(q-1)$, escolhe $e$ coprimo com $\\phi(n)$ e calcula $d = e^{-1} \\bmod \\phi(n)$. A cifragem $C = M^e \\bmod n$ e a decifragem $M = C^d \\bmod n$ são executadas em tempo polinomial por <code>MODULAR-EXPONENTIATION</code> em $O(\\lg b)$ multiplicações. O teste probabilístico de <strong>Miller-Rabin</strong> detecta compostos através de testemunhas de Fermat e raízes quadradas não triviais de $1$ com taxa de erro $\\le 2^{-s}$, enquanto a heurística <strong>Pollard-Rho</strong> fatora inteiros em tempo esperado $O(p^{1/2})$ passos aritméticos.</li>
          </ul>
        `
      }
    ],
    checklist: [
      "Compreendo a dualidade entre a representação de polinômios por coeficientes e por pares ponto-valor, sei aplicar a Regra de Horner em Θ(n), a interpolação de Lagrange em Θ(n²), e explicar por que a multiplicação em ponto-valor leva tempo linear Θ(n).",
      "Domino a definição das raízes n-ésimas complexas da unidade ω_n = e^(2πi/n), as demonstrações formais do Lema do Cancelamento, Lema do Quadrado e Lema do Somatório, e a divisão de A(x) em componentes pares e ímpares A^[0](x²) e A^[1](x²).",
      "Sei derivar e rastrear o pseudocódigo de RECURSIVE-FFT(a) e ITERATIVE-FFT(a), aplicar a permutação de inversão de bits (BIT-REVERSE-COPY), explicar a operação borboleta e demonstrar o Teorema da Convolução usando a DFT inversa.",
      "Sei demonstrar o Teorema de Bézout, o Lema da Recursão do MDC e o Teorema de Lamé (≤ 5 log₁₀ b divisões), além de rastrear o algoritmo EXTENDED-EUCLID(a, b) para calcular o inverso multiplicativo modular.",
      "Domino os grupos ℤ_n e ℤ_n*, a função totiente de Euler ϕ(n), o Teorema de Euler e Fermat, o algoritmo do Teorema Chinês do Resto (CRT), o protocolo RSA (geração de chaves, cifragem, decifragem e prova de corretude), o teste de primalidade de Miller-Rabin e a heurística de fatoração de Pollard-Rho."
    ]
  };

/* ========================================================================
     SEÇÃO 2: UNIDADES DE CONTEÚDO DIDÁTICO E MATEMÁTICO (UNIDADES 14.1 A 14.6)
     ======================================================================== */
  const unidades = [
/* ======================================================================
       UNIDADE 14.1 — CAPÍTULO 30: SEÇÃO 30.1 (pp. 726–731)
       Representação de Polinômios e Multiplicação em Ponto-Valor
       ====================================================================== */
    {
      id: "u14-1",
      code: "UNIDADE 14.1 • CAP. 30 (SEÇÃO 30.1)",
      pages: "pp. 726–731",
      title: "30.1 Representação de Polinômios (Coeficientes vs. Valores de Ponto) e Multiplicação em Tempo Linear por Valores de Ponto",
      content: `
        <p>O <strong>Capítulo 30</strong> (pp. 726–747) investiga um dos problemas computacionais mais clássicos da álgebra simbólica e aplicada: a <strong>multiplicação eficiente de polinômios</strong> e o cálculo de <strong>convoluções de vetores</strong>. Enquanto a adição direta de dois polinômios de grau $n$ exige apenas tempo $\\Theta(n)$, o método tradicional para multiplicá-los no domínio dos coeficientes custa tempo quadrático $\\Theta(n^2)$. A introdução da <strong>Transformada Rápida de Fourier (FFT — <em>Fast Fourier Transform</em>)</strong> quebra essa barreira, reduzindo a complexidade para <strong>$\\Theta(n \\lg n)$</strong> através de uma elegante mudança de base geométrica.</p>

        <!-- PONTO DE MONTAGEM DO WORKBENCH INTERATIVO DUPLO -->
        <div id="workbench-mod14-mount"></div>

        <h3>1. O Conceito Formal de Polinômio e a Limitação de Grau</h3>
        <p>Um polinômio na variável indeterminada $x$ sobre um corpo comutativo $\\mathbb{F}$ (tipicamente o corpo dos números complexos $\\mathbb{C}$ ou reais $\\mathbb{R}$) representa formalmente uma função expressa como uma soma de monômios:</p>
        $$A(x) = \\sum_{j=0}^{n-1} a_j x^j = a_0 + a_1 x + a_2 x^2 + \\dots + a_{n-1} x^{n-1}.$$
        <p>Os valores $a_0, a_1, \\dots, a_{n-1} \\in \\mathbb{F}$ são os <strong>coeficientes</strong> do polinômio. O <strong>grau</strong> de $A(x)$, denotado por $\\text{grau}(A)$, é o maior índice $k$ tal que o coeficiente $a_k \\neq 0$. Por convenção, o polinômio identicamente nulo tem grau $-\\infty$. Dizemos que um inteiro positivo $n$ é um <strong>limite do grau</strong> (<em>degree-bound</em>) de $A(x)$ se $\\text{grau}(A) < n$. Portanto, um polinômio com limite de grau $n$ tem no máximo $n$ coeficientes e grau no intervalo $\\{0, 1, \\dots, n-1\\}$.</p>

        <h3>2. Operações Fundamentais na Representação por Coeficientes</h3>
        <p>Na <strong>representação por coeficientes</strong>, um polinômio $A(x)$ de grau limitado por $n$ é armazenado como um vetor unidimensional de coeficientes $a = (a_0, a_1, \\dots, a_{n-1})$. Essa representação é intuitiva e compacta:</p>
        <ul>
          <li><strong>Avaliação de um Polinômio em $x_0$ (Regra de Horner):</strong> A avaliação ingênua calculando cada potência $x_0^j$ separadamente gastaria $\\Theta(n^2)$ multiplicações. Usando a <strong>Regra de Horner</strong> (p. 728), expressamos $A(x_0)$ por fatorações encadeadas:
            $$A(x_0) = a_0 + x_0 \\big(a_1 + x_0 (a_2 + \\dots + x_0 (a_{n-2} + x_0 a_{n-1}) \\dots )\\big).$$
            Começando com $v = a_{n-1}$ e executando $v = a_j + x_0 v$ para $j = n-2, n-3, \\dots, 0$, a Regra de Horner calcula $A(x_0)$ em <strong>exatamente $n-1$ adições e $n-1$ multiplicações</strong>, consumindo tempo estritamente linear <strong>$\\Theta(n)$</strong>.</li>
          <li><strong>Adição de Polinômios:</strong> Se $A(x)$ e $B(x)$ possuem limite de grau $n$ com vetores de coeficientes $a$ e $b$, sua soma $C(x) = A(x) + B(x)$ possui vetor de coeficientes $c = (c_0, c_1, \\dots, c_{n-1})$, onde $c_j = a_j + b_j$ para $j = 0, 1, \\dots, n-1$. Essa operação requer tempo <strong>$\\Theta(n)$</strong>.</li>
          <li><strong>Multiplicação de Polinômios e Convolução Direta:</strong> Sejam $A(x)$ de limite de grau $n_a$ e $B(x)$ de limite de grau $n_b$. O produto $C(x) = A(x) B(x)$ é um polinômio cujo grau satisfaz $\\text{grau}(C) = \\text{grau}(A) + \\text{grau}(B)$, de modo que o limite de grau de $C(x)$ é $n_a + n_b - 1 \\le 2n$ (quando $n_a = n_b = n$). Os coeficientes de $C(x)$ são expressos formalmente por:
            $$c_k = \\sum_{j=0}^k a_j b_{k-j}, \\qquad \\text{para } k = 0, 1, \\dots, 2n - 2,$$
            onde convencionamos $a_j = 0$ para $j \\ge n$ e $b_j = 0$ para $j \\ge n$. O vetor $c$ é denominado a <strong>convolução</strong> dos vetores $a$ e $b$, denotada por <strong>$c = a \\otimes b$</strong>. O cálculo direto de cada um dos $2n-1$ termos $c_k$ requer $\\sum_{k=0}^{2n-2} \\Theta(k+1) = \\mathbf{\\Theta(n^2)}$ multiplicações e adições!</li>
        </ul>

        <h3>3. A Representação por Pares Ponto-Valor</h3>
        <p>Uma <strong>representação por pares ponto-valor</strong> de um polinômio $A(x)$ com limite de grau $n$ é um conjunto de $n$ pares ordenados:</p>
        $$\\{(x_0, y_0), (x_1, y_1), \\dots, (x_{n-1}, y_{n-1})\\}$$
        <p>tais que todos os $x_k$ são <strong>estritamente distintos</strong> entre si e $y_k = A(x_k)$ para $k = 0, 1, \\dots, n-1$. A validade fundamental dessa representação é respaldada pelo seguinte teorema canônico:</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 30.1 • UNICIDADE DA INTERPOLAÇÃO POLINOMIAL (p. 728) ]</span>
          <p><strong>Enunciado:</strong> Para qualquer conjunto de $n$ pares ponto-valor $\\{(x_0, y_0), (x_1, y_1), \\dots, (x_{n-1}, y_{n-1})\\}$ em que todos os $x_k$ são distintos, existe um <strong>único polinômio $A(x)$ com limite de grau $n$</strong> tal que $A(x_k) = y_k$ para todo $k = 0, 1, \\dots, n-1$.</p>
          <p><strong>Demonstração Matricial (Matriz de Vandermonde):</strong> O sistema de equações lineares que determina os coeficientes $(a_0, a_1, \\dots, a_{n-1})$ a partir dos valores $y_k$ é dado pelo produto matricial:</p>
          $$\\begin{pmatrix} 1 & x_0 & x_0^2 & \\dots & x_0^{n-1} \\\\ 1 & x_1 & x_1^2 & \\dots & x_1^{n-1} \\\\ \\vdots & \\vdots & \\vdots & \\ddots & \\vdots \\\\ 1 & x_{n-1} & x_{n-1}^2 & \\dots & x_{n-1}^{n-1} \\end{pmatrix} \\begin{pmatrix} a_0 \\\\ a_1 \\\\ \\vdots \\\\ a_{n-1} \\end{pmatrix} = \\begin{pmatrix} y_0 \\\\ y_1 \\\\ \\vdots \\\\ y_{n-1} \\end{pmatrix}.$$
          <p>A matriz de coeficientes $V(x_0, x_1, \\dots, x_{n-1})$ é a célebre <strong>matriz de Vandermonde</strong>. Seu determinante é o produto clássico:</p>
          $$\\det\\big(V(x_0, x_1, \\dots, x_{n-1})\\big) = \\prod_{0 \\le j < k \\le n-1} (x_k - x_j).$$
          <p>Como todos os pontos $x_k$ foram escolhidos distintos, temos $x_k - x_j \\neq 0$ para todo $j < k$, de modo que $\\det(V) \\neq 0$. Logo, a matriz $V$ é estritamente inversível (não singular), o que garante que o vetor de coeficientes $a = V^{-1} y$ <strong>existe e é único</strong>! $\\blacksquare$</p>
        </div>

        <h4>3.1 Interpolação Explícita pela Fórmula de Lagrange</h4>
        <p>Embora possamos inverter $V$ numericamente via decomposição LUP em $\\Theta(n^3)$, a interpolação pode ser expressa diretamente na forma fechada através dos <strong>polinômios básicos de Lagrange</strong>:</p>
        $$A(x) = \\sum_{k=0}^{n-1} y_k \\cdot \\ell_k(x), \\qquad \\text{onde } \\ell_k(x) = \\prod_{j=0, \\, j \\neq k}^{n-1} \\frac{x - x_j}{x_k - x_j}.$$
        <p>Observe que $\\ell_k(x_k) = 1$ e $\\ell_k(x_j) = 0$ para todo $j \\neq k$. Logo, $A(x_k) = y_k \\cdot 1 + 0 = y_k$. Como cada polinômio $\\ell_k(x)$ possui limite de grau $n$ e requer tempo $\\Theta(n)$ para ser computado (após calcular o polinômio cumulativo $\\prod (x - x_j)$), a recuperação completa dos coeficientes de $A(x)$ via interpolação de Lagrange gasta tempo <strong>$\\Theta(n^2)$</strong>.</p>

        <h3>4. Multiplicação em Tempo Linear $\\Theta(n)$ no Domínio Ponto-Valor</h3>
        <p>O poder revolucionário da representação por pares ponto-valor reside na trivialidade da multiplicação de polinômios:</p>
        <ul>
          <li>Sejam $A(x)$ e $B(x)$ polinômios com limite de grau $n$. O produto $C(x) = A(x) B(x)$ possui limite de grau <strong>$2n$</strong>.</li>
          <li>Portanto, precisamos de pelo menos <strong>$2n$ pares ponto-valor distintos</strong> para representar $C(x)$ unicamente!</li>
          <li>Selecionamos um conjunto comum de $2n$ pontos distintos $x_0, x_1, \\dots, x_{2n-1}$ e avaliamos ambos os polinômios nesses mesmos pontos:
            $$\\{(x_k, A(x_k))\\}_{k=0}^{2n-1} \\quad \\text{e} \\quad \\{(x_k, B(x_k))\\}_{k=0}^{2n-1}.$$
          </li>
          <li>A representação por pares ponto-valor do polinômio produto $C(x)$ é simplesmente:
            $$\\{(x_k, C(x_k))\\}_{k=0}^{2n-1} = \\big\\{\\big(x_k, \\, A(x_k) \\cdot B(x_k)\\big)\\big\\}_{k=0}^{2n-1}.$$
          </li>
          <li>Essa multiplicação ponto a ponto envolve apenas $2n$ multiplicações escalares de números em $\\mathbb{F}$, exigindo <strong>tempo estritamente linear $\\Theta(n)$</strong>!</li>
        </ul>

        <h3>5. O Grande Paradigma da FFT: O Pipeline em $\\Theta(n \\lg n)$</h3>
        <p>A comparação entre as operações nas duas representações revela um contraste dramático:</p>

        <div style="overflow-x: auto; margin: 16px 0;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
            <thead>
              <tr style="border-bottom: 2px solid #3b82f6; background: rgba(59, 130, 246, 0.1);">
                <th style="padding: 10px;">Operação</th>
                <th style="padding: 10px;">Representação por Coeficientes</th>
                <th style="padding: 10px;">Representação por Ponto-Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 10px;"><strong>Avaliação em um ponto $x_0$</strong></td>
                <td style="padding: 10px;">$\\Theta(n)$ (Regra de Horner)</td>
                <td style="padding: 10px;">$\\Theta(n^2)$ (Interpolação de Lagrange)</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 10px;"><strong>Adição de Polinômios</strong></td>
                <td style="padding: 10px;">$\\Theta(n)$ (Soma de coeficientes)</td>
                <td style="padding: 10px;">$\\Theta(n)$ (Soma ponto a ponto)</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 10px;"><strong>Multiplicação de Polinômios</strong></td>
                <td style="padding: 10px; color: #ef4444; font-weight: 700;">$\\Theta(n^2)$ (Convolução tradicional)</td>
                <td style="padding: 10px; color: #10b981; font-weight: 700;">$\\Theta(n)$ (Multiplicação ponto a ponto)</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                <td style="padding: 10px;"><strong>Conversão Direta Ingênua</strong></td>
                <td style="padding: 10px;" colspan="2">Avaliação ingênua em $n$ pontos: $\\Theta(n^2)$ | Interpolação ingênua: $\\Theta(n^2)$</td>
              </tr>
              <tr style="background: rgba(16, 185, 129, 0.1);">
                <td style="padding: 10px;"><strong>Conversão Otimizada via FFT</strong></td>
                <td style="padding: 10px; color: #38bdf8; font-weight: 700;" colspan="2">DFT via FFT: <strong>$\\Theta(n \\lg n)$</strong> | Interpolação via DFT Inversa: <strong>$\\Theta(n \\lg n)$</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>O algoritmo completo para multiplicar dois polinômios de limite de grau $n$ em $\\Theta(n \\lg n)$ consiste em 4 etapas (Figura 30.1, p. 730):</p>
        <ol>
          <li><strong>Preenchimento com Zeros (<em>Zero-Padding</em>):</strong> Duplicamos os limites de grau de $A(x)$ e $B(x)$ preenchendo os vetores de coeficientes com zeros até o comprimento $2n$ (arredondado para a próxima potência inteira de $2$).</li>
          <li><strong>Avaliação Rápida (FFT):</strong> Computamos as representações por pares ponto-valor de $A(x)$ e $B(x)$ avaliando-os nas $2n$ raízes complexas da unidade através de <code>RECURSIVE-FFT</code> ou <code>ITERATIVE-FFT</code> em tempo $\\Theta(n \\lg n)$.</li>
          <li><strong>Multiplicação Ponto a Ponto:</strong> Computamos $C(x_k) = A(x_k) \\cdot B(x_k)$ para cada uma das $2n$ raízes da unidade em tempo $\\Theta(n)$.</li>
          <li><strong>Interpolação Rápida (FFT Inversa):</strong> Aplicamos a Transformada Discreta de Fourier Inversa ($\text{DFT}_{2n}^{-1}$) sobre os valores calculados de $C(x_k)$ para recuperar o vetor de coeficientes $c = (c_0, c_1, \\dots, c_{2n-1})$ em tempo $\\Theta(n \\lg n)$!</li>
        </ol>
      `
    },

    /* ======================================================================
       UNIDADE 14.2 — CAPÍTULO 30: SEÇÃO 30.2 (pp. 731–738)
       A DFT e o Algoritmo RECURSIVE-FFT de Cooley-Tukey
       ====================================================================== */
    {
      id: "u14-2",
      code: "UNIDADE 14.2 • CAP. 30 (SEÇÃO 30.2)",
      pages: "pp. 731–738",
      title: "30.2 A Transformada Discreta de Fourier (DFT) e a Transformada Rápida de Fourier (RECURSIVE-FFT)",
      content: `
        <p>A Seção 30.2 (pp. 731–738) revela o alicerce matemático da FFT: as propriedades de simetria geométrica e algébrica das <strong>raízes complexas da unidade</strong>, culminando na dedução formal do algoritmo recursivo de Cooley e Tukey.</p>

        <h3>1. Raízes Complexas da Unidade e Representação Polar</h3>
        <p>Uma <strong>raiz $n$-ésima complexa da unidade</strong> é um número complexo $\\omega \\in \\mathbb{C}$ tal que $\\omega^n = 1$. Pela fórmula de Euler $e^{i\\theta} = \\cos \\theta + i \\sin \\theta$, existem exatamente $n$ raízes $n$-ésimas da unidade distintas, dadas por:</p>
        $$e^{2\\pi i k / n} = \\cos\\left(\\frac{2\\pi k}{n}\\right) + i \\sin\\left(\\frac{2\\pi k}{n}\\right), \\qquad \\text{para } k = 0, 1, \\dots, n - 1.$$
        <p>Denominamos $\\mathbf{\\omega_n = e^{2\\pi i / n}}$ a <strong>raiz $n$-ésima principal da unidade</strong>. Todas as outras $n-1$ raízes são potências inteiras de $\\omega_n$:</p>
        $$\\omega_n^0, \\; \\omega_n^1, \\; \\omega_n^2, \\; \\dots, \\; \\omega_n^{n-1}.$$
        <p>Geometricamente, essas $n$ raízes estão uniformemente distribuídas sobre o <strong>círculo unitário $|z| = 1$</strong> no plano complexo de Argand-Gauss, separadas por um ângulo central de $2\\pi / n$ radianos (Figura 30.2, p. 732). Sob multiplicação complexa ordinária, as raízes $n$-ésimas da unidade formam um <strong>grupo cíclico multiplicativo</strong> gerado por $\\omega_n$, que é estritamente isomórfico ao grupo aditivo $(\\mathbb{Z}_n, +)$.</p>

        <h3>2. Os Três Lemas Fundamentais das Raízes da Unidade</h3>
        <p>A viabilidade computacional da estratégia de divisão e conquista da FFT apoia-se em três lemas elegantes demonstrados no CLRS:</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ LEMA 30.2 • LEMA DO CANCELAMENTO (p. 733) ]</span>
          <p><strong>Enunciado:</strong> Para quaisquer inteiros $n \\ge 0$, $k \\ge 0$ e $d > 0$:</p>
          $$\\omega_{dn}^{dk} = \\omega_n^k.$$
          <p><strong>Demonstração:</strong> Pela definição exponencial de $\\omega_{dn}^{dk}$:</p>
          $$\\omega_{dn}^{dk} = \\big(e^{2\\pi i / dn}\\big)^{dk} = e^{2\\pi i (dk) / (dn)} = e^{2\\pi i k / n} = \\omega_n^k. \\quad \\blacksquare$$
          <p><strong>Corolário 30.3:</strong> Para qualquer número par $n > 0$, fazendo $k = 1$ e $d = n/2$:</p>
          $$\\omega_n^{n/2} = \\omega_2^1 = e^{\\pi i} = \\mathbf{-1}.$$
        </div>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ LEMA 30.4 • LEMA DO QUADRADO (p. 733) ]</span>
          <p><strong>Enunciado:</strong> Se $n > 0$ é par, o quadrado das $n$ raízes $n$-ésimas da unidade são exatamente as $n/2$ raízes $(n/2)$-ésimas da unidade. Isto é:</p>
          $$\\{(\\omega_n^k)^2 : 0 \\le k < n\\} = \\{\\omega_{n/2}^k : 0 \\le k < n/2\\}.$$
          <p>Além disso, o quadrado de duas raízes diametralmente opostas no círculo é idêntico:</p>
          $$(\\omega_n^{k + n/2})^2 = (\\omega_n^k)^2 = \\omega_{n/2}^k.$$
          <p><strong>Demonstração:</strong> Pelo Lema do Cancelamento, $(\\omega_n^k)^2 = \\omega_n^{2k} = \\omega_{n/2}^k$. Para a segunda metade das raízes ($k + n/2$):</p>
          $$(\\omega_n^{k + n/2})^2 = \\omega_n^{2k + n} = \\omega_n^{2k} \\cdot \\omega_n^n = \\omega_{n/2}^k \\cdot 1 = \\omega_{n/2}^k. \\quad \\blacksquare$$
          <p><em>Significado Computacional:</em> Ao elevar ao quadrado as $n$ raízes $n$-ésimas da unidade, obtemos exatamente $n/2$ pontos distintos em vez de $n$! Esse colapso de pontos à metade é o motor primordial da recursão de divisão e conquista da FFT!</p>
        </div>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ LEMA 30.5 • LEMA DO SOMATÓRIO (p. 734) ]</span>
          <p><strong>Enunciado:</strong> Para qualquer inteiro $n \\ge 1$ e qualquer inteiro $k$ que não seja divisível por $n$:</p>
          $$\\sum_{j=0}^{n-1} (\\omega_n^k)^j = 0.$$
          <p><strong>Demonstração:</strong> Como $k$ não é divisível por $n$, temos $\\omega_n^k \\neq 1$. Aplicando a fórmula clássica da soma de uma progressão geométrica finita com razão $q = \\omega_n^k$:</p>
          $$\\sum_{j=0}^{n-1} (\\omega_n^k)^j = \\frac{(\\omega_n^k)^n - 1}{\\omega_n^k - 1} = \\frac{(\\omega_n^n)^k - 1}{\\omega_n^k - 1} = \\frac{1^k - 1}{\\omega_n^k - 1} = \\frac{0}{\\omega_n^k - 1} = \\mathbf{0}. \\quad \\blacksquare$$
          <p><em>Consequência:</em> Este lema garante a <strong>ortogonalidade</strong> das linhas e colunas da matriz de Vandermonde $V_n$, permitindo inverter a DFT de forma quase idêntica à sua transformada direta!</p>
        </div>

        <h3>3. Definição Formal da DFT (Transformada Discreta de Fourier)</h3>
        <p>Desejamos avaliar um polinômio $A(x) = \\sum_{j=0}^{n-1} a_j x^j$ nas $n$ raízes $n$-ésimas da unidade $\\omega_n^0, \\omega_n^1, \\dots, \\omega_n^{n-1}$. Definimos o vetor de saída $y = (y_0, y_1, \\dots, y_{n-1})$ por:</p>
        $$y_k = A(\\omega_n^k) = \\sum_{j=0}^{n-1} a_j \\big(\\omega_n^k\\big)^j = \\sum_{j=0}^{n-1} a_j \\omega_n^{k j}, \\qquad \\text{para } k = 0, 1, \\dots, n - 1.$$
        <p>O vetor $y$ é a <strong>Transformada Discreta de Fourier</strong> do vetor de coeficientes $a$, denotada por <strong>$y = \\text{DFT}_n(a)$</strong>. Em notação matricial, $y = V_n a$, onde $V_n$ é a matriz de Vandermonde de ordem $n$ gerada pelas potências de $\\omega_n$:</p>
        $$V_n = \\begin{pmatrix}
          1 & 1 & 1 & \\dots & 1 \\\\
          1 & \\omega_n & \\omega_n^2 & \\dots & \\omega_n^{n-1} \\\\
          1 & \\omega_n^2 & \\omega_n^4 & \\dots & \\omega_n^{2(n-1)} \\\\
          \\vdots & \\vdots & \\vdots & \\ddots & \\vdots \\\\
          1 & \\omega_n^{n-1} & \\omega_n^{2(n-1)} & \\dots & \\omega_n^{(n-1)(n-1)}
        \\end{pmatrix}.$$

        <h3>4. O Algoritmo de Divisão e Conquista: <code>RECURSIVE-FFT</code></h3>
        <p>Suponha que $n$ seja uma potência de $2$. O algoritmo de Cooley-Tukey particiona o polinômio $A(x)$ em dois subpolinômios de limite de grau $n/2$, agrupando os coeficientes de índices pares e ímpares:</p>
        $$A^{[0]}(x) = a_0 + a_2 x + a_4 x^2 + \\dots + a_{n-2} x^{n/2 - 1},$$
        $$A^{[1]}(x) = a_1 + a_3 x + a_5 x^2 + \\dots + a_{n-1} x^{n/2 - 1}.$$
        <p>Observe a identidade fundamental que expressa $A(x)$ em termos de $x^2$:</p>
        $$A(x) = A^{[0]}(x^2) + x \\cdot A^{[1]}(x^2).$$
        <p>Portanto, avaliar $A(x)$ nas $n$ raízes $n$-ésimas da unidade $\\{\\omega_n^0, \\omega_n^1, \\dots, \\omega_n^{n-1}\\}$ se reduz a:</p>
        <ol>
          <li>Avaliar $A^{[0]}(y)$ e $A^{[1]}(y)$ nos pontos dados pelos quadrados das raízes $n$-ésimas: $\\{(\\omega_n^k)^2\\}_{k=0}^{n-1}$. Pelo Lema do Quadrado, esse conjunto de pontos tem apenas <strong>$n/2$ elementos</strong>: as raízes $(n/2)$-ésimas da unidade $\\{\\omega_{n/2}^k\\}_{k=0}^{n/2-1}$!</li>
          <li>Combinar os resultados das chamadas recursivas $y^{[0]} = \\text{DFT}_{n/2}(a^{[0]})$ e $y^{[1]} = \\text{DFT}_{n/2}(a^{[1]})$. Para $k = 0, 1, \\dots, n/2 - 1$, temos:
            $$y_k = A(\\omega_n^k) = A^{[0]}(\\omega_{n/2}^k) + \\omega_n^k A^{[1]}(\\omega_{n/2}^k) = \\mathbf{y_k^{[0]} + \\omega_n^k y_k^{[1]}}.$$
            E para a segunda metade dos pontos, onde $\\omega_n^{k + n/2} = -\\omega_n^k$:
            $$y_{k + n/2} = A(\\omega_n^{k + n/2}) = A^{[0]}(\\omega_{n/2}^k) - \\omega_n^k A^{[1]}(\\omega_{n/2}^k) = \\mathbf{y_k^{[0]} - \\omega_n^k y_k^{[1]}}.$$
          </li>
        </ol>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">RECURSIVE-FFT(a)</span>
              <span>[ Algoritmo Recursivo da FFT (p. 735) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">n = a.length                     <span class="cmt">// n é uma potência de 2</span></span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">se</span> n == 1</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   <span class="kw">retorne</span> a</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">ω_n = e^(2πi / n)                <span class="cmt">// raiz principal n-ésima da unidade</span></span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">ω = 1</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">a^[0] = (a0, a2, ..., an-2)      <span class="cmt">// coeficientes pares</span></span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">a^[1] = (a1, a3, ..., an-1)      <span class="cmt">// coeficientes ímpares</span></span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">y^[0] = RECURSIVE-FFT(a^[0])     <span class="cmt">// chamada recursiva 1</span></span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">y^[1] = RECURSIVE-FFT(a^[1])     <span class="cmt">// chamada recursiva 2</span></span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content"><span class="kw">para</span> k = 0 até n/2 - 1</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">  y_k = y_k^[0] + ω · y_k^[1]   <span class="cmt">// operação borboleta (+)</span></span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">  y_{k + n/2} = y_k^[0] - ω · y_k^[1] <span class="cmt">// operação borboleta (-)</span></span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">  ω = ω · ω_n                  <span class="cmt">// atualiza fator de giro</span></span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content"><span class="kw">retorne</span> y</span></div>
            </div>
          </div>

        <h4>4.1 Análise de Complexidade de <code>RECURSIVE-FFT</code></h4>
        <p>A divisão dos coeficientes nas linhas 6 e 7 e a combinação borboleta no laço das linhas 10–13 executam em tempo linear $\\Theta(n)$. Como resolvemos dois subproblemas de tamanho $n/2$, a recorrência de tempo é:</p>
        $$T(n) = 2 T(n/2) + \\Theta(n).$$
        <p>Pelo Caso 2 do <strong>Teorema Mestre</strong> (já que $a = 2, b = 2, f(n) = \\Theta(n) = \\Theta(n^{\\log_2 2})$), a solução é exatamente <strong>$T(n) = \\mathbf{\\Theta(n \\lg n)}$</strong>!</p>

        <h4>4.2 A Operação Borboleta (<em>Butterfly Operation</em>)</h4>
        <p>O par de atribuições nas linhas 11 e 12 constitui a famosa <strong>operação borboleta</strong> (Figura 30.3, p. 739). Ela recebe dois valores parciais de entrada $y_k^{[0]}$ e $y_k^{[1]}$, multiplica $y_k^{[1]}$ pelo <strong>fator de giro</strong> (<em>twiddle factor</em>) $\\omega = \\omega_n^k$, e produz simultaneamente a soma $y_k^{[0]} + \\omega y_k^{[1]}$ e a diferença $y_k^{[0]} - \\omega y_k^{[1]}$. Essa simetria em $X$ (daí o nome borboleta) é a responsável direta por permitir computação no lugar em arquiteturas digitais.</p>
      `
    },

    /* ======================================================================
       UNIDADE 14.3 — CAPÍTULO 30: SEÇÃO 30.3 (pp. 738–747)
       Circuitos FFT, ITERATIVE-FFT e a DFT Inversa
       ====================================================================== */
    {
      id: "u14-3",
      code: "UNIDADE 14.3 • CAP. 30 (SEÇÃO 30.3)",
      pages: "pp. 738–747",
      title: "30.3 Circuitos FFT Eficientes e ITERATIVE-FFT com Permutação Inversa de Bits",
      content: `
        <p>A Seção 30.3 (pp. 738–747) aborda a otimização de baixo nível da FFT, transformando o algoritmo recursivo em uma implementação iterativa de alto desempenho que opera <strong>estritamente no lugar (<em>in-place</em>)</strong>, além de introduzir circuitos paralelos de profundidade logarítmica e a <strong>DFT Inversa</strong>.</p>

        <h3>1. A Árvore de Chamadas Recursivas e a Permutação de Reversão de Bits</h3>
        <p>Ao analisar a árvore de recursão de <code>RECURSIVE-FFT</code> para $n = 8$ (Figura 30.4, p. 740), observamos em que ordem os coeficientes originais chegam às folhas da base (tamanho $1$):</p>
        <ul>
          <li>Na raiz (nível 0), separamos os coeficientes com base no <strong>bit menos significativo</strong> ($b_0$) de seu índice: coeficientes com $b_0 = 0$ (pares: $a_0, a_2, a_4, a_6$) vão para a subárvore esquerda; coeficientes com $b_0 = 1$ (ímpares: $a_1, a_3, a_5, a_7$) vão para a subárvore direita.</li>
          <li>No nível 1, os elementos são separados pelo segundo bit ($b_1$), e assim sucessivamente.</li>
          <li>Nas folhas da árvore, a ordem dos índices resulta na sequência: <strong>$0, 4, 2, 6, 1, 5, 3, 7$</strong>.</li>
        </ul>
        <p>Examinando os índices em binário de $3$ bits antes e depois:</p>

        <div style="overflow-x: auto; margin: 14px 0;">
          <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 0.92rem;">
            <thead>
              <tr style="border-bottom: 2px solid #3b82f6; background: rgba(59, 130, 246, 0.1);">
                <th style="padding: 8px;">Índice Original $k$</th>
                <th style="padding: 8px;">Binário $(b_2 b_1 b_0)$</th>
                <th style="padding: 8px;">Bits Invertidos $(b_0 b_1 b_2)$</th>
                <th style="padding: 8px;">Posição Revertida $\\text{rev}(k)$</th>
                <th style="padding: 8px;">Coeficiente na Folha</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="padding: 6px;">0</td><td><code>000</code></td><td><code>000</code></td><td>0</td><td>$a_0$</td></tr>
              <tr><td style="padding: 6px;">1</td><td><code>001</code></td><td><code>100</code></td><td>4</td><td>$a_4$</td></tr>
              <tr><td style="padding: 6px;">2</td><td><code>010</code></td><td><code>010</code></td><td>2</td><td>$a_2$</td></tr>
              <tr><td style="padding: 6px;">3</td><td><code>011</code></td><td><code>110</code></td><td>6</td><td>$a_6$</td></tr>
              <tr><td style="padding: 6px;">4</td><td><code>100</code></td><td><code>001</code></td><td>1</td><td>$a_1$</td></tr>
              <tr><td style="padding: 6px;">5</td><td><code>101</code></td><td><code>101</code></td><td>5</td><td>$a_5$</td></tr>
              <tr><td style="padding: 6px;">6</td><td><code>110</code></td><td><code>011</code></td><td>3</td><td>$a_3$</td></tr>
              <tr><td style="padding: 6px;">7</td><td><code>111</code></td><td><code>111</code></td><td>7</td><td>$a_7$</td></tr>
            </tbody>
          </table>
        </div>

        <p>A ordem das folhas corresponde exatamente à <strong>permutação de reversão de bits (<em>bit-reversal permutation</em>)</strong>! O procedimento <code>BIT-REVERSE-COPY</code> reorganiza o vetor $a$ diretamente na sua ordem terminal em tempo $O(n \\lg n)$:</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">BIT-REVERSE-COPY(a, A) (p. 742)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">n = a.length</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">para</span> k = 0 até n - 1</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   A[rev(k)] = a[k]</span></div>
            </div>
          </div>

        <h3>2. O Algoritmo Iterativo no Lugar: <code>ITERATIVE-FFT</code></h3>
        <p>Uma vez posicionado o vetor na ordem com reversão de bits, construímos as DFTs de baixo para cima (<em>bottom-up</em>). O laço externo varia o estágio $s$ de $1$ a $\\lg n$, dobrando o tamanho dos blocos combinados $m = 2^s$ a cada iteração:</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">ITERATIVE-FFT(a) (p. 742)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">BIT-REVERSE-COPY(a, A)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">n = a.length                     <span class="cmt">// n é uma potência de 2</span></span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">para</span> s = 1 até lg n              <span class="cmt">// estágios da árvore (s = 1 .. lg n)</span></span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   m = 2^s                      <span class="cmt">// tamanho do subproblema atual</span></span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">   ω_m = e^(2πi / m)            <span class="cmt">// raiz principal m-ésima da unidade</span></span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">   <span class="kw">para</span> k = 0 até n - 1 passo m <span class="cmt">// itera sobre blocos de tamanho m</span></span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">       ω = 1                    <span class="cmt">// fator de giro inicial</span></span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">       <span class="kw">para</span> j = 0 até m/2 - 1   <span class="cmt">// borboletas dentro do bloco</span></span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">           t = ω · A[k + j + m/2]</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">          u = A[k + j]</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">          A[k + j] = u + t     <span class="cmt">// operação borboleta superior</span></span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">          A[k + j + m/2] = u - t <span class="cmt">// operação borboleta inferior</span></span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">          ω = ω · ω_m          <span class="cmt">// avança o fator de giro</span></span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content"><span class="kw">retorne</span> A</span></div>
            </div>
          </div>

        <h4>2.1 Análise Formal de Complexidade</h4>
        <p>Para cada estágio $s$, o laço da linha 6 itera $n/m = n/2^s$ vezes. O laço mais interno da linha 8 itera $m/2 = 2^{s-1}$ vezes. Assim, o número total de operações borboleta executadas é:</p>
        $$\\sum_{s=1}^{\\lg n} \\left(\\frac{n}{2^s} \\cdot 2^{s-1}\\right) = \\sum_{s=1}^{\\lg n} \\frac{n}{2} = \\frac{n}{2} \\lg n = \\mathbf{\\Theta(n \\lg n)}.$$
        <p>O consumo de memória adicional além do arranjo de entrada é estritamente <strong>$\\Theta(1)$</strong>!</p>

        <h3>3. Circuito FFT Paralelo de Profundidade $\\Theta(\\lg n)$</h3>
        <p>A estrutura de <code>ITERATIVE-FFT</code> mapeia-se com perfeição em um circuito digital de processamento paralelo (Figura 30.5, p. 743):</p>
        <ul>
          <li>O circuito possui $n$ fios horizontais de dados.</li>
          <li>À esquerda, a rede executa a <strong>permutação de reversão de bits</strong> conectando as entradas $a_k$ aos fios $\\text{rev}(k)$ com profundidade de fios $0$ (apenas fiação de barramento).</li>
          <li>Em seguida, sucedem-se <strong>$\\lg n$ estágios de borboletas</strong>. Cada estágio contém exatamente $n/2$ operadores borboleta que atuam <strong>completamente em paralelo</strong>.</li>
          <li>Como cada estágio requer tempo de propagação constante $\\Theta(1)$, a <strong>profundidade do circuito</strong> (tempo de execução paralelo com $n/2$ processadores) é estritamente <strong>$\\mathbf{\\Theta(\\lg n)}$</strong>, e o trabalho total é $\\Theta(n \\lg n)$.</li>
        </ul>

        <h3>4. A Transformada Discreta de Fourier Inversa ($\text{DFT}_n^{-1}$)</h3>
        <p>Para recuperar o vetor de coeficientes a partir dos pares ponto-valor avaliados nas raízes da unidade, precisamos inverter a matriz de Vandermonde $V_n$. O Teorema 30.7 revela uma propriedade notável:</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 30.7 • INVERSÃO DA MATRIZ DA DFT (p. 744) ]</span>
          <p><strong>Enunciado:</strong> Para $j, k \\in \\{0, 1, \\dots, n - 1\\}$, o elemento $(j, k)$ da matriz inversa $V_n^{-1}$ é dado por:</p>
          $$\\big(V_n^{-1}\\big)_{j, k} = \\frac{\\omega_n^{-k j}}{n}.$$
          <p><strong>Demonstração:</strong> Mostraremos que $V_n^{-1} V_n = I_n$. O elemento na linha $j$ e coluna $j'$ do produto é:</p>
          $$\\big(V_n^{-1} V_n\\big)_{j, j'} = \\sum_{k=0}^{n-1} \\big(V_n^{-1}\\big)_{j, k} \\big(V_n\\big)_{k, j'} = \\sum_{k=0}^{n-1} \\left(\\frac{\\omega_n^{-k j}}{n}\\right) \\big(\\omega_n^{k j'}\\big) = \\frac{1}{n} \\sum_{k=0}^{n-1} \\big(\\omega_n^{j' - j}\\big)^k.$$
          <ul>
            <li>Se $j' = j$, então $\\omega_n^{j' - j} = \\omega_n^0 = 1$, e a soma vale $\\sum_{k=0}^{n-1} 1 = n$. Logo, o termo é $\\frac{1}{n} \\cdot n = \\mathbf{1}$.</li>
            <li>Se $j' \\neq j$, como $-(n-1) \\le j' - j \\le n-1$ e $j' - j \\neq 0$, o expoente $j' - j$ não é divisível por $n$. Pelo <strong>Lema do Somatório (Lema 30.5)</strong>, temos $\\sum_{k=0}^{n-1} (\\omega_n^{j' - j})^k = 0$, resultando em $\\frac{1}{n} \\cdot 0 = \\mathbf{0}$.</li>
          </ul>
          <p>Portanto, $(V_n^{-1} V_n)_{j, j'} = \\delta_{j, j'}$ (o delta de Kronecker), provando que a matriz é de fato a inversa! $\\blacksquare$</p>
        </div>

        <p><strong>Consequência Algorítmica (Corolário 30.8):</strong> A Transformada Inversa $\\text{DFT}_n^{-1}(y)$ é computada invocando exatamente o mesmo algoritmo <code>ITERATIVE-FFT</code>, apenas <strong>trocando o papel de $\\omega_n$ por $\\omega_n^{-1}$</strong> (isto é, conjugando as raízes ou invertendo o sinal da parte imaginária na exponenciação) e <strong>dividindo cada componente do vetor resultante por $n$</strong>!</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 30.8 • TEOREMA DA CONVOLUÇÃO (p. 745) ]</span>
          <p><strong>Enunciado:</strong> Se $a$ e $b$ são vetores de comprimento $n$ completados com zeros até o comprimento $2n$, então a convolução $a \\otimes b$ é dada por:</p>
          $$a \\otimes b = \\text{DFT}_{2n}^{-1}\\big(\\text{DFT}_{2n}(a) \\cdot \\text{DFT}_{2n}(b)\\big),$$
          <p>onde $\\cdot$ representa a multiplicação componente a componente de dois vetores em $\\mathbb{C}^{2n}$. O tempo total de execução para multiplicar polinômios ou calcular convoluções discretas é estritamente <strong>$\\mathbf{\\Theta(n \\lg n)}$</strong>!</p>
        </div>
      `
    },
/* ======================================================================
       UNIDADE 14.4 — CAPÍTULO 31: SEÇÕES 31.1 E 31.2 (pp. 748–762)
       Teoria dos Números Elementar, Divisibilidade e Algoritmos de Euclides
       ====================================================================== */
    {
      id: "u14-4",
      code: "UNIDADE 14.4 • CAP. 31 (SEÇÕES 31.1 E 31.2)",
      pages: "pp. 748–762",
      title: "31.1 e 31.2 Teoria dos Números Elementar: Divisibilidade, MDC e os Algoritmos de Euclides (EUCLID e EXTENDED-EUCLID)",
      content: `
        <p>O <strong>Capítulo 31</strong> (pp. 748–795) investiga os <strong>algoritmos da teoria dos números</strong>. No contexto computacional, os dados de entrada frequentemente consistem em inteiros gigantescos com milhares de bits. Portanto, a complexidade temporal não é medida apenas no número de inteiros processados, mas no <strong>número de bits $\\beta = \\lceil \\lg(n+1) \\rceil$</strong> necessários para codificá-los. Um algoritmo de teoria dos números é dito de <strong>tempo polinomial</strong> se seu tempo de execução for polinomial em relação ao comprimento de bits $\\beta$ de suas entradas.</p>

        <h3>1. Divisibilidade, Divisão com Resto e Fatoração Única</h3>
        <p>Trabalhamos sobre o conjunto dos inteiros $\\mathbb{Z} = \\{\\dots, -2, -1, 0, 1, 2, \\dots\\}$ e os números naturais $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$:</p>
        <ul>
          <li><strong>Divisibilidade:</strong> A notação <strong>$d \\mid a$</strong> (lê-se "$d$ divide $a$") significa que existe algum inteiro $k \\in \\mathbb{Z}$ tal que $a = k d$. Dizemos que $d$ é um <em>divisor</em> de $a$. Todo inteiro divide $0$. Se $a > 0$ e $d \\mid a$, então $|d| \\le a$. Um número inteiro $p > 1$ é <strong>primo</strong> se seus únicos divisores positivos forem $1$ e $p$; caso contrário, é <strong>composto</strong>.</li>
          <li><strong>Teorema Fundamental da Aritmética (Fatoração Única):</strong> Todo inteiro positivo $a > 1$ pode ser fatorado de modo único (a menos da ordem dos fatores) como um produto de potências de primos:
            $$a = p_1^{e_1} p_2^{e_2} \\dots p_r^{e_r}, \\qquad \\text{com } p_1 < p_2 < \\dots < p_r \\text{ primos e } e_i \\ge 1.$$
          </li>
          <li><strong>Teorema da Divisão com Resto:</strong> Para qualquer inteiro $a$ e qualquer inteiro positivo $n$, existem inteiros <strong>únicos</strong> $q$ (o quociente) e $r$ (o resto) tais que:
            $$a = q n + r, \\qquad \\text{onde } 0 \\le r < n.$$
            Definimos $q = \\lfloor a / n \\rfloor$ e $r = a \\bmod n = a - \\lfloor a / n \\rfloor n$.</li>
        </ul>

        <h3>2. Máximo Divisor Comum e o Teorema de Bézout</h3>
        <p>Sejam $a, b \\in \\mathbb{Z}$ inteiros não simultaneamente nulos. O <strong>máximo divisor comum</strong>, denotado por $\\text{mdc}(a, b)$ ou $\\gcd(a, b)$, é o maior inteiro $d$ tal que $d \\mid a$ e $d \\mid b$. Dois inteiros $a$ e $b$ são <strong>primos entre si (coprimos)</strong> se $\\text{mdc}(a, b) = 1$.</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 31.2 • TEOREMA DE BÉZOUT (p. 751) ]</span>
          <p><strong>Enunciado:</strong> Se $a$ e $b$ são inteiros não simultaneamente nulos, então $\\text{mdc}(a, b)$ é o <strong>menor elemento estritamente positivo</strong> do conjunto de todas as combinações lineares inteiras de $a$ e $b$:</p>
          $$S = \\{a x + b y : x, y \\in \\mathbb{Z}\\}.$$
          <p>Isto é, existem inteiros $x, y \\in \\mathbb{Z}$ (denominados <em>coeficientes de Bézout</em>) tais que:</p>
          $$\\text{mdc}(a, b) = a x + b y.$$
          <p><strong>Demonstração:</strong> Seja $s = a x + b y$ o menor elemento estritamente positivo de $S$. Pelo algoritmo da divisão com resto, podemos escrever $a = q s + r$ com $0 \\le r < s$. Substituindo $s$:</p>
          $$r = a - q s = a - q(a x + b y) = a(1 - q x) + b(-q y).$$
          <p>Portanto, $r$ também é uma combinação linear de $a$ e $b$, logo $r \\in S$. Contudo, se $r > 0$, teríamos um elemento positivo em $S$ estritamente menor que $s$, contradizendo a minimalidade de $s$! Logo, devemos ter $r = 0$, implicando que $s \\mid a$. Pelo mesmo raciocínio, $s \\mid b$. Portanto, $s$ é um divisor comum de $a$ e $b$. Além disso, se $d$ é qualquer outro divisor comum ($d \\mid a$ e $d \\mid b$), então $d \\mid (a x + b y) = s$, logo $d \\le s$. Conclui-se que $s = \\text{mdc}(a, b)$. $\\blacksquare$</p>
          <p><strong>Corolário 31.3:</strong> Para todos inteiros $a, b$, se $d \\mid a$ e $d \\mid b$, então $d \\mid \\text{mdc}(a, b)$.</p>
          <p><strong>Corolário 31.4 (Lema de Euclides):</strong> Para todos inteiros $a, b, c$, se $a \\mid b c$ e $\\text{mdc}(a, b) = 1$, então $a \\mid c$.</p>
        </div>

        <h3>3. O Algoritmo de Euclides Clássico: <code>EUCLID</code></h3>
        <p>O algoritmo de Euclides (Seção 31.2, pp. 753–757) calcula $\\text{mdc}(a, b)$ através de sucessivas reduções modulares fundamentadas no <strong>Lema da Recursão do MDC</strong>:</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 31.9 • LEMA DA RECURSÃO DO MDC (p. 754) ]</span>
          <p><strong>Enunciado:</strong> Para quaisquer inteiros não negativos $a$ e $b$, onde $b > 0$:</p>
          $$\\text{mdc}(a, b) = \\text{mdc}(b, \\, a \\bmod b).$$
          <p><strong>Demonstração:</strong> Mostraremos que os divisores comuns de $a$ e $b$ são idênticos aos divisores comuns de $b$ e $a \\bmod b$. Escreva $a = q b + r$, onde $r = a \\bmod b$. Se $d \\mid a$ e $d \\mid b$, então $d \\mid (a - q b) = r$. Reciprocamente, se $d \\mid b$ e $d \\mid r$, então $d \\mid (q b + r) = a$. Assim, o par $(a, b)$ e o par $(b, r)$ compartilham exatamente o mesmo conjunto de divisores comuns, logo possuem o mesmo maior divisor comum! $\\blacksquare$</p>
        </div>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">EUCLID(a, b)</span>
              <span>[ Algoritmo de Euclides Clássico (p. 754) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">se</span> b == 0</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">   <span class="kw">retorne</span> a</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">senão</span></span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   <span class="kw">retorne</span> EUCLID(b, a mod b)</span></div>
            </div>
          </div>

        <h4>3.1 Análise de Complexidade e o Teorema de Lamé</h4>
        <p>A taxa de convergência de <code>EUCLID</code> é surpreendentemente veloz. Em cada duas chamadas consecutivas, o segundo argumento é reduzido pelo menos à metade: $(a \\bmod b) < a / 2$ (se $b \\le a/2$, o resto é menor que $b \\le a/2$; se $b > a/2$, o quociente é $1$ e o resto é $a - b < a/2$). O pior caso teórico do algoritmo foi formalizado pelo matemático francês Gabriel Lamé em 1844:</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 31.11 • TEOREMA DE LAMÉ (p. 756) ]</span>
          <p><strong>Enunciado:</strong> Para qualquer inteiro $k \\ge 1$, se $a > b \\ge 1$ e o procedimento <code>EUCLID(a, b)</code> efetua $k$ chamadas recursivas, então:</p>
          $$a \\ge F_{k+2} \\qquad \\text{e} \\qquad b \\ge F_{k+1},$$
          <p>onde $F_i$ é o $i$-ésimo número de Fibonacci. O pior caso absoluto de <code>EUCLID</code> ocorre precisamente quando os argumentos de entrada são números de Fibonacci consecutivos: $a = F_{k+2}$ e $b = F_{k+1}$.</p>
          <p><strong>Limite Prático de Divisões:</strong> Como $F_{k+1} \\approx \\frac{\\phi^{k+1}}{\\sqrt{5}}$ com $\\phi = \\frac{1 + \\sqrt{5}}{2} \\approx 1,618$, temos:</p>
          $$k \\le 1 + \\log_\\phi b = 1 + \\frac{\\log_{10} b}{\\log_{10} \\phi} \\approx 1 + 4,785 \\log_{10} b \\le \\mathbf{5 \\log_{10} b + 1}.$$
          <p><em>Conclusão de Lamé:</em> <strong>O número de divisões executadas pelo Algoritmo de Euclides nunca excede 5 vezes o número de dígitos decimais do menor argumento $b$!</strong> Assim, <code>EUCLID</code> requer $O(\\lg b)$ operações aritméticas e $O(\\beta^2)$ operações com bits em inteiros de $\\beta$ bits.</p>
        </div>

        <h3>4. O Algoritmo de Euclides Estendido: <code>EXTENDED-EUCLID</code></h3>
        <p>O Teorema de Bézout garante que $d = \\text{mdc}(a, b) = a x + b y$. O procedimento <code>EXTENDED-EUCLID(a, b)</code> não apenas calcula $d$, mas constrói recursivamente os próprios coeficientes inteiros $(x, y)$ que satisfazem a identidade:</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">EXTENDED-EUCLID(a, b)</span>
              <span>[ Algoritmo de Euclides Estendido (p. 757) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">se</span> b == 0</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">   <span class="kw">retorne</span> (a, 1, 0)</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">(d', x', y') = EXTENDED-EUCLID(b, a mod b)</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">(d, x, y) = (d', y', x' - ⌊a / b⌋ · y')</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content"><span class="kw">retorne</span> (d, x, y)</span></div>
            </div>
          </div>

        <h4>4.1 Demonstração Rigorosa da Relação de Recorrência</h4>
        <p>No caso base $b = 0$, temos $\\text{mdc}(a, 0) = a = a \\cdot 1 + 0 \\cdot 0$, logo $(d, x, y) = (a, 1, 0)$. No passo recursivo, a chamada com argumentos $(b, a \\bmod b)$ retorna $(d', x', y')$ satisfazendo:</p>
        $$d' = b \\cdot x' + (a \\bmod b) \\cdot y'.$$
        <p>Como $a \\bmod b = a - \\lfloor a / b \\rfloor b$, substituímos diretamente na identidade de Bézout:</p>
        $$d' = b \\cdot x' + \\left(a - \\left\\lfloor \\frac{a}{b} \\right\\rfloor b\\right) y' = a \\cdot y' + b \\cdot \\left(x' - \\left\\lfloor \\frac{a}{b} \\right\\rfloor y'\\right).$$
        <p>Igualando coeficientes com $d = a \\cdot x + b \\cdot y$, obtemos:</p>
        $$d = d', \\qquad x = y', \\qquad y = x' - \\left\\lfloor \\frac{a}{b} \\right\\rfloor y'. \\quad \\blacksquare$$
        <p>Esse algoritmo é a ferramenta primordial para computar o <strong>inverso multiplicativo modular</strong>: quando $\\text{mdc}(a, n) = 1$, temos $a x + n y = 1 \\implies a x \\equiv 1 \\pmod n$, de modo que $a^{-1} \\equiv x \\pmod n$!</p>
      `
    },

    /* ======================================================================
       UNIDADE 14.5 — CAPÍTULO 31: SEÇÕES 31.3, 31.4 E 31.5 (pp. 762–775)
       Aritmética Modular, Grupos ℤₙ*, Equações Modulares e Teorema Chinês do Resto
       ====================================================================== */
    {
      id: "u14-5",
      code: "UNIDADE 14.5 • CAP. 31 (SEÇÕES 31.3 A 31.5)",
      pages: "pp. 762–775",
      title: "31.3, 31.4 e 31.5 Aritmética Modular, Grupos ℤₙ e ℤₙ*, Equações Lineares Modulares e o Teorema Chinês do Resto",
      content: `
        <p>As Seções 31.3 a 31.5 (pp. 762–775) formalizam a estrutura algébrica da <strong>aritmética modular</strong> através da teoria de grupos e anéis, culminando na resolução geral de equações lineares de congruência e na demonstração completa do <strong>Teorema Chinês do Resto</strong>.</p>

        <h3>1. Congruência Modular e o Anel $\\mathbb{Z}_n$</h3>
        <p>Dizemos que dois inteiros $a$ e $b$ são <strong>congruentes módulo $n$</strong> (onde $n > 0$), denotado por <strong>$a \\equiv b \\pmod n$</strong>, se $a \\bmod n = b \\bmod n$, ou equivalentemente se $n \\mid (a - b)$. A relação de congruência é uma <strong>relação de equivalência</strong> (reflexiva, simétrica e transitiva) que particiona $\\mathbb{Z}$ em $n$ classes de equivalência disjuntas denominadas <em>classes de resíduos módulo $n$</em>:</p>
        $$[a]_n = \\{a + k n : k \\in \\mathbb{Z}\\}.$$
        <p>O conjunto das classes de resíduos com operações de adição e multiplicação mod $n$ forma o <strong>anel comutativo $\\mathbb{Z}_n = \\{0, 1, \\dots, n - 1\\}$</strong>.</p>

        <h3>2. Teoria de Grupos e o Grupo Multiplicativo $\\mathbb{Z}_n^*$</h3>
        <p>Um <strong>grupo $(G, \\circ)$</strong> é um conjunto não vazio munido de uma operação binária que satisfaz: (1) <em>Fechamento</em>: $a \\circ b \\in G$; (2) <em>Associatividade</em>: $(a \\circ b) \\circ c = a \\circ (b \\circ c)$; (3) <em>Elemento Neutro</em>: existe $e \\in G$ tal que $a \\circ e = e \\circ a = a$; e (4) <em>Inverso</em>: para todo $a \\in G$, existe $a^{-1} \\in G$ tal que $a \\circ a^{-1} = a^{-1} \\circ a = e$. Se a operação for comutativa, o grupo é dito <strong>abeliano</strong>.</p>
        <ul>
          <li><strong>O Grupo Aditivo $(\\mathbb{Z}_n, +_n)$:</strong> É um grupo cíclico abeliano finito de ordem $|\\mathbb{Z}_n| = n$, gerado por $1$.</li>
          <li><strong>O Grupo Multiplicativo $\\mathbb{Z}_n^*$:</strong> $\\mathbb{Z}_n$ sob multiplicação modular não forma um grupo porque $0$ não tem inverso multiplicativo. O subconjunto dos elementos que possuem inverso multiplicativo módulo $n$ é o <strong>conjunto dos resíduos coprimos com $n$</strong>:
            $$\\mathbb{Z}_n^* = \\{a \\in \\mathbb{Z}_n : \\text{mdc}(a, n) = 1\\}.$$
            Sob multiplicação módulo $n$, $(\\mathbb{Z}_n^*, \\cdot_n)$ é um grupo abeliano finito de grande importância criptográfica!</li>
        </ul>

        <h4>2.1 A Função Totiente de Euler $\\phi(n)$</h4>
        <p>A <strong>ordem do grupo $\\mathbb{Z}_n^*$</strong> é dada pela função totiente (ou indicatriz) de Euler $\\phi(n) = |\\mathbb{Z}_n^*|$ (p. 766):</p>
        <ul>
          <li>Se $p$ é primo: $\\phi(p) = p - 1$ (todos os inteiros $1, 2, \\dots, p-1$ são coprimos com $p$).</li>
          <li>Se $p$ é primo e $e \\ge 1$: $\\phi(p^e) = p^e (1 - 1/p) = p^e - p^{e-1}$.</li>
          <li>A função $\\phi(n)$ é <strong>multiplicativa</strong>: se $\\text{mdc}(a, b) = 1$, então $\\phi(a b) = \\phi(a) \\phi(b)$.</li>
          <li>Para a fatoração canônica de $n = p_1^{e_1} \\dots p_r^{e_r}$, a fórmula geral de Euler é:
            $$\\mathbf{\\phi(n) = n \\prod_{p \\mid n} \\left(1 - \\frac{1}{p}\\right)}.$$
          </li>
          <li>No caso crucial do sistema RSA, onde $n = p q$ com $p$ e $q$ primos distintos:
            $$\\mathbf{\\phi(n) = (p - 1)(q - 1)}.$$
          </li>
        </ul>

        <h4>2.2 Teoremas de Lagrange, Euler e Fermat</h4>
        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 31.15 • TEOREMA DE LAGRANGE E COROLÁRIOS (p. 767) ]</span>
          <p><strong>Teorema de Lagrange:</strong> Se $G$ é um grupo finito e $H$ é um subgrupo de $G$, então a ordem $|H|$ divide $|G|$.</p>
          <p><strong>Corolário (Ordem de Elemento):</strong> Para qualquer $a \\in G$, a ordem de $a$ (o menor $k > 0$ tal que $a^k = e$) divide $|G|$. Consequentemente, para todo $a \\in G$:</p>
          $$a^{|G|} = e.$$
          <p><strong>Teorema 31.30 (Teorema de Euler):</strong> Aplicando o corolário ao grupo multiplicativo $\\mathbb{Z}_n^*$, cuja ordem é $|\\mathbb{Z}_n^*| = \\phi(n)$, temos para todo $a$ coprimo com $n$ ($\text{mdc}(a, n) = 1$):</p>
          $$\\mathbf{a^{\\phi(n)} \\equiv 1 \\pmod n}.$$
          <p><strong>Corolário 31.31 (Pequeno Teorema de Fermat):</strong> Se $p$ é primo e $a$ não é múltiplo de $p$ ($\text{mdc}(a, p) = 1$), então como $\\phi(p) = p - 1$:</p>
          $$\\mathbf{a^{p-1} \\equiv 1 \\pmod p} \\implies a^p \\equiv a \\pmod p.$$
        </div>

        <h3>3. Equações Lineares Modulares: <code>MODULAR-LINEAR-EQUATION-SOLVER</code></h3>
        <p>Desejamos encontrar todos os $x \\in \\mathbb{Z}_n$ que satisfazem a congruência:</p>
        $$a x \\equiv b \\pmod n.$$
        <p>Essa equação é equivalente à equação diofantina linear $a x - n y = b$. As condições de existência e estrutura do conjunto de soluções são dadas pelo Teorema 31.20:</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 31.20 • SOLUBILIDADE DE CONGRUÊNCIAS LINEARES (p. 769) ]</span>
          <p><strong>Enunciado:</strong> A equação linear modular $a x \\equiv b \\pmod n$ admite solução se e somente se <strong>$d = \\text{mdc}(a, n)$ divide $b$</strong> ($d \\mid b$). Se $d \\mid b$, a equação possui <strong>exatamente $d$ soluções distintas em $\\mathbb{Z}_n$</strong>.</p>
          <p><strong>Construção das Soluções:</strong> Seja $(d, x', y') = \\text{EXTENDED-EUCLID}(a, n)$, tal que $a x' + n y' = d$. Multiplicando ambos os lados por $b/d$ (que é inteiro):</p>
          $$a \\left(x' \\cdot \\frac{b}{d}\\right) + n \\left(y' \\cdot \\frac{b}{d}\\right) = b \\implies a \\underbrace{\\left(x' \\cdot \\frac{b}{d}\\right)}_{x_0} \\equiv b \\pmod n.$$
          <p>Assim, uma solução particular é $\\mathbf{x_0 = x'(b/d) \\bmod n}$. As demais $d-1$ soluções distintas em $\\mathbb{Z}_n$ são obtidas somando múltiplos de $n/d$:</p>
          $$\\mathbf{x_i = \\left(x_0 + i \\cdot \\frac{n}{d}\\right) \\bmod n}, \\qquad \\text{para } i = 0, 1, \\dots, d - 1.$$
        </div>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">MODULAR-LINEAR-EQUATION-SOLVER(a, b, n) (p. 770)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">(d, x', y') = EXTENDED-EUCLID(a, n)</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">se</span> d divide b</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">   x_0 = (x' · (b / d)) mod n</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">   <span class="kw">para</span> i = 0 até d - 1</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">       <span class="kw">imprima</span> (x_0 + i · (n / d)) mod n</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">senão</span></span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">   <span class="kw">imprima</span> "nenhuma solução"</span></div>
            </div>
          </div>

        <h3>4. O Teorema Chinês do Resto (CRT)</h3>
        <p>O <strong>Teorema Chinês do Resto</strong> (Seção 31.5, pp. 772–775) remonta ao matemático chinês Sun Zi no século III d.C. Ele estabelece uma correspondência biunívoca perfeita (isomorfismo de anéis) entre um anel módulo um produto $m$ e o produto direto de anéis módulos coprimos:</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 31.27 • TEOREMA CHINÊS DO RESTO (CRT) (p. 773) ]</span>
          <p><strong>Enunciado:</strong> Sejam $n_1, n_2, \\dots, n_k$ inteiros positivos <strong>coprimos dois a dois</strong> (isto é, $\\text{mdc}(n_i, n_j) = 1$ para todo $i \\neq j$) e seja $m = n_1 n_2 \\dots n_k = \\prod_{i=1}^k n_i$. Então, para quaisquer inteiros $a_1, a_2, \\dots, a_k$, o sistema de congruências simultâneas:</p>
          $$\\begin{cases}
            x \\equiv a_1 \\pmod{n_1} \\\\
            x \\equiv a_2 \\pmod{n_2} \\\\
            \\quad \\vdots \\\\
            x \\equiv a_k \\pmod{n_k}
          \\end{cases}$$
          <p>possui uma <strong>única solução módulo $m$</strong>.</p>
          <p><strong>Demonstração Construtiva e Algoritmo:</strong> Para cada $i \\in \\{1, \\dots, k\\}$, definimos:</p>
          $$M_i = \\frac{m}{n_i} = \\prod_{j \\neq i} n_j.$$
          <p>Como todos os fatores de $M_i$ são coprimos com $n_i$, temos $\\text{mdc}(M_i, n_i) = 1$. Portanto, pelo Teorema de Bézout, existe o inverso modular $M_i^{-1} \\in \\mathbb{Z}_{n_i}^*$ tal que:</p>
          $$M_i \\cdot M_i^{-1} \\equiv 1 \\pmod{n_i}.$$
          <p>Definimos os elementos de base $c_i = M_i (M_i^{-1} \\bmod n_i)$. Observe as propriedades de ortogonalidade de $c_i$:</p>
          <ul>
            <li>$c_i \\equiv 1 \\pmod{n_i}$ (por definição do inverso);</li>
            <li>$c_i \\equiv 0 \\pmod{n_j}$ para qualquer $j \\neq i$, pois $n_j$ divide $M_i$!</li>
          </ul>
          <p>Logo, a solução geral única é construída por superposição linear:</p>
          $$\\mathbf{x = \\left( \\sum_{i=1}^k a_i \\cdot c_i \\right) \\bmod m = \\left( \\sum_{i=1}^k a_i \\cdot M_i \\cdot (M_i^{-1} \\bmod n_i) \\right) \\bmod m}. \\quad \\blacksquare$$
        </div>
      `
    },

    /* ======================================================================
       UNIDADE 14.6 — CAPÍTULO 31: SEÇÕES 31.6 A 31.9 (pp. 775–795)
       Potenciação Modular, RSA, Primalidade Miller-Rabin e Fatoração Pollard-Rho
       ====================================================================== */
    {
      id: "u14-6",
      code: "UNIDADE 14.6 • CAP. 31 (SEÇÕES 31.6 A 31.9)",
      pages: "pp. 775–795",
      title: "31.6, 31.7, 31.8 e 31.9 Potenciação Modular, o Criptossistema RSA, o Teste MILLER-RABIN e Fatoração POLLARD-RHO",
      content: `
        <p>As Seções 31.6 a 31.9 (pp. 775–795) consolidam o ápice aplicado da teoria dos números: a <strong>exponenciação modular por quadrados repetidos</strong>, a concepção e prova de corretude do <strong>Criptossistema RSA</strong>, o teste probabilístico de primalidade de <strong>Miller-Rabin</strong> e a heurística de fatoração de inteiros <strong>Pollard-Rho</strong>.</p>

        <h3>1. Exponenciação Modular por Quadrados Repetidos: <code>MODULAR-EXPONENTIATION</code></h3>
        <p>Calcular $a^b \\bmod n$ multiplicando $a$ por si mesmo $b$ vezes seria catastrófico quando $b$ possui centenas de bits ($b \\approx 2^{1024}$). O método de <strong>quadrados repetidos</strong> (p. 779) decompõe o expoente em sua representação binária $b = \\sum_{i=0}^k b_i 2^i = \\langle b_k, b_{k-1}, \\dots, b_0 \\rangle_2$:</p>

        <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">MODULAR-EXPONENTIATION(a, b, n) (p. 779)</span>
              <span>[ CLRS • ALGORITMO ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">c = 0</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">d = 1</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">seja</span> ⟨b_k, b_{k-1}, ..., b_0⟩ a representação binária de b</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">para</span> i = k decrescendo até 0</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">   c = 2 · c</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">   d = (d · d) mod n            <span class="cmt">// elevação ao quadrado</span></span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">   <span class="kw">se</span> b_i == 1</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">       c = c + 1</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">       d = (d · a) mod n        <span class="cmt">// multiplicação condicional</span></span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content"><span class="kw">retorne</span> d</span></div>
            </div>
          </div>

        <p><strong>Complexidade:</strong> O laço executa exatamente $k+1 = \\lfloor \\lg b \\rfloor + 1$ iterações. Em cada iteração ocorre sempre uma elevação ao quadrado modular e, se $b_i = 1$, uma multiplicação adicional. O número total de multiplicações modulares é no máximo <strong>$2 \\lg b$</strong>. Para inteiros de $\\beta$ bits, o algoritmo gasta tempo $O(\\beta)$ multiplicações aritméticas e <strong>$O(\\beta^3)$ operações com bits</strong>!</p>

        <h3>2. O Criptossistema de Chave Pública RSA</h3>
        <p>Criado em 1977 por Ron Rivest, Adi Shamir e Leonard Adleman no MIT (Seção 31.7, pp. 781–786), o <strong>RSA</strong> baseia-se na assimetria computacional fundamental: é extremamente rápido multiplicar dois primos grandes, mas computacionalmente inviável fatorar seu produto em tempo prático.</p>

        <h4>2.1 Protocolo de Geração de Chaves</h4>
        <ol>
          <li>Selecione aleatoriamente dois números primos grandes secretos distintos $p$ e $q$ (tipicamente de 1024 ou 2048 bits cada).</li>
          <li>Calcule o módulo RSA público $n = p \\cdot q$.</li>
          <li>Calcule o totiente de Euler $\\phi(n) = (p - 1)(q - 1)$.</li>
          <li>Selecione um inteiro ímpar $e$ tal que $1 < e < \\phi(n)$ e $\\text{mdc}(e, \\phi(n)) = 1$ (frequentemente $e = 65537 = 2^{16} + 1$).</li>
          <li>Calcule a chave privada $d$ como o inverso multiplicativo de $e$ módulo $\\phi(n)$ usando <code>EXTENDED-EUCLID(e, ϕ(n))</code>:
            $$e \\cdot d \\equiv 1 \\pmod{\\phi(n)}.$$
          </li>
          <li><strong>Chave Pública:</strong> $P = (e, n)$. Divulgada amplamente.</li>
          <li><strong>Chave Privada:</strong> $S = (d, n)$. Mantida sob sigilo absoluto. Os fatores $p, q$ e $\\phi(n)$ são descartados com segurança.</li>
        </ol>

        <h4>2.2 Cifragem, Decifragem e Assinaturas Digitais</h4>
        <ul>
          <li><strong>Cifragem:</strong> Para transmitir uma mensagem $M \\in \\mathbb{Z}_n$, Bob obtém a chave pública de Alice $(e, n)$ e computa o texto cifrado:
            $$\\mathbf{C = M^e \\bmod n}.$$
          </li>
          <li><strong>Decifragem:</strong> Alice recebe $C$ e usa sua chave privada secreta $d$ para recuperar a mensagem original:
            $$\\mathbf{M = C^d \\bmod n}.$$
          </li>
          <li><strong>Assinatura Digital:</strong> Alice assina um documento $M'$ aplicando sua chave privada $s = (M')^d \\bmod n$. Qualquer destinatário confirma a autenticidade verificando se $s^e \\equiv M' \\pmod n$.</li>
        </ul>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 31.36 • CORRETUDE DO CRIPTOSSISTEMA RSA (p. 783) ]</span>
          <p><strong>Enunciado:</strong> As operações de cifragem e decifragem do RSA satisfazem $(M^e)^d \\equiv M \\pmod n$ e $(M^d)^e \\equiv M \\pmod n$ para qualquer mensagem $M \\in \\mathbb{Z}_n$.</p>
          <p><strong>Demonstração:</strong> Como $e d \\equiv 1 \\pmod{\\phi(n)}$, existe um inteiro $k \\ge 1$ tal que $e d = 1 + k \\phi(n) = 1 + k (p - 1)(q - 1)$. Precisamos mostrar que $M^{ed} \\equiv M \\pmod n$. Mostraremos primeiro a congruência módulo $p$:</p>
          <ul>
            <li>Se $p \\nmid M$ ($\text{mdc}(M, p) = 1$), pelo Pequeno Teorema de Fermat temos $M^{p-1} \\equiv 1 \\pmod p$. Logo:
              $$M^{ed} = M^{1 + k(p-1)(q-1)} = M \\cdot \\big(M^{p-1}\\big)^{k(q-1)} \\equiv M \\cdot 1^{k(q-1)} \\equiv \\mathbf{M \\pmod p}.$$
            </li>
            <li>Se $p \\mid M$, então $M \\equiv 0 \\pmod p$. Como $e d \\ge 1$, temos $M^{ed} \\equiv 0^{ed} \\equiv 0 \\equiv \\mathbf{M \\pmod p}$.</li>
          </ul>
          <p>Em ambos os casos, vale $M^{ed} \\equiv M \\pmod p$. Pelo mesmo raciocínio exato substituindo $p$ por $q$, vale $M^{ed} \\equiv M \\pmod q$. Como $p$ e $q$ são primos distintos, temos $\\text{mdc}(p, q) = 1$. Portanto, pelo <strong>Teorema Chinês do Resto (CRT)</strong>, como $M^{ed} \\equiv M$ nos dois módulos, concluímos que:</p>
          $$M^{ed} \\equiv M \\pmod{p q = n}. \\quad \\blacksquare$$
        </div>

        <h3>3. Teste de Primalidade Probabilístico de Miller-Rabin</h3>
        <p>Para gerar chaves RSA, é imperativo testar eficientemente se inteiros aleatórios gigantescos são primos. O teste de pseudoprimalidade baseado no Pequeno Teorema de Fermat ($a^{n-1} \\stackrel{?}{\\equiv} 1 \\pmod n$) falha diante dos <strong>números de Carmichael</strong> (como $561 = 3 \\cdot 11 \\cdot 17$), que são compostos mas satisfazem $a^{n-1} \\equiv 1 \\pmod n$ para toda base coprima $a \\in \\mathbb{Z}_n^*$! O algoritmo de Miller-Rabin elimina essa vulnerabilidade explorando raízes quadradas não triviais de $1$:</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 31.34 • RAÍZES QUADRADAS NÃO TRIVIAIS DA UNIDADE MÓDULO n (p. 787) ]</span>
          <p><strong>Enunciado:</strong> Se $p$ é um número primo ímpar e $x^2 \\equiv 1 \\pmod p$, então as únicas soluções são as raízes triviais <strong>$x \\equiv 1$ ou $x \\equiv -1 \\pmod p$</strong>.</p>
          <p><strong>Demonstração:</strong> $x^2 \\equiv 1 \\pmod p \\iff x^2 - 1 \\equiv 0 \\pmod p \\iff (x - 1)(x + 1) \\equiv 0 \\pmod p$. Pelo Lema de Euclides, $p$ deve dividir $x - 1$ (logo $x \\equiv 1$) ou $p$ deve dividir $x + 1$ (logo $x \\equiv -1 \\equiv p - 1$). $\\blacksquare$</p>
          <p><em>Contrapositiva de Miller-Rabin:</em> Se durante o cálculo de $a^{n-1} \\bmod n$ encontrarmos algum inteiro $x$ tal que $x^2 \\equiv 1 \\pmod n$, mas com $x \\not\\equiv 1$ e $x \\not\\equiv n - 1 \\pmod n$, temos a <strong>garantia matemática absoluta de que $n$ é composto</strong>! Chamamos esse $x$ de <em>raiz quadrada não trivial de $1$</em>.</p>
        </div>

        <h4>3.1 Procedimento <code>WITNESS</code> e <code>MILLER-RABIN</code></h4>
        <p>Decompomos $n - 1 = 2^t \\cdot u$, com $t \\ge 1$ e $u$ ímpar. O procedimento <code>WITNESS(a, n)</code> computa $x_0 = a^u \\bmod n$ e depois executa $t$ elevações ao quadrado sucessivas $x_i = x_{i-1}^2 \\bmod n$. Se em algum passo intermediário $x_i = 1$ mas $x_{i-1} \\notin \\{1, n-1\\}$, encontramos uma raiz não trivial e retornamos <code>TRUE</code> ($n$ é composto). Se no final $x_t = a^{n-1} \\not\\equiv 1 \\pmod n$, $n$ falhou no teste de Fermat e retornamos <code>TRUE</code>.</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA 31.38 E TEOREMA 31.39 • TAXA DE ERRO DE MILLER-RABIN (pp. 788–790) ]</span>
          <p><strong>Teorema 31.38:</strong> Se $n$ é um número composto ímpar, o número de testemunhas de que $n$ é composto em $\\mathbb{Z}_n^*$ é de pelo menos <strong>$(n - 1) / 2$</strong> (na verdade, pelo menos $3(n-1)/4$).</p>
          <p><strong>Teorema 31.39:</strong> Para qualquer inteiro ímpar $n > 2$ e $s$ tentativas com bases $a$ escolhidas independentemente ao acaso, a probabilidade de <code>MILLER-RABIN(n, s)</code> declarar falsamente que um número composto é primo é no máximo:</p>
          $$\\mathbf{\\text{Pr}\\{\\text{Erro}\\} \\le 2^{-s}}.$$
          <p>Para $s = 50$, a probabilidade de erro é menor que $2^{-50} \\approx 8,88 \\times 10^{-16}$, um risco incomensuravelmente menor que a probabilidade de uma falha de hardware no processador!</p>
        </div>

        <h3>4. A Heurística de Fatoração de Inteiros: <code>POLLARD-RHO</code></h3>
        <p>Desenvolvida por John Pollard em 1975 (Seção 31.9, pp. 790–795), a heurística <strong>Pollard-Rho</strong> é projetada para descobrir fatores primos não triviais $p$ de um número composto grande $n$ usando o <strong>Paradoxo do Aniversário</strong>:</p>
        <ul>
          <li>Geramos uma sequência pseudoaleatória $x_{i+1} = f(x_i) \\bmod n$, onde $f(x) = (x^2 - 1) \\bmod n$.</li>
          <li>Projetada módulo o fator primo desconhecido $p$, a sequência $x'_i = x_i \\bmod p$ satisfaz a mesma recorrência em um domínio de tamanho finito $p$.</li>
          <li>Pelo Paradoxo do Aniversário, o número esperado de passos antes de a sequência $x'_i$ entrar em ciclo módulo $p$ é de apenas <strong>$\\Theta(\\sqrt{p})$</strong>!</li>
          <li>Tão logo dois elementos distintos satisfaçam $x_i \\equiv x_j \\pmod p$, temos $p \\mid (x_i - x_j)$. Como tipicamente $x_i \\not\\equiv x_j \\pmod n$, o máximo divisor comum:
            $$\\mathbf{d = \\text{mdc}(|x_i - x_j|, \\, n)}$$
            revela um <strong>divisor não trivial $d > 1$ de $n$</strong>!</li>
          <li>Utilizando a técnica de detecção de ciclo de Floyd (algoritmo da tartaruga e da lebre), o procedimento consome memória constante $\\Theta(1)$ e tempo esperado de <strong>$O(p^{1/2}) \\le O(n^{1/4})$ passos aritméticos</strong>!</li>
        </ul>
      `
    }
  ];

/* ========================================================================
     SEÇÃO 2.5: WORKBENCH INTERATIVO DUPLO DO MÓDULO 14
     (1) Simulador Interativo de FFT / DFT, Círculo Trigonométrico e Multiplicação
     (2) Simulador Criptográfico RSA & Algoritmo de Euclides Estendido
     ======================================================================== */
  function initWorkbenches() {
    const mount = document.getElementById("workbench-mod14-mount");
    if (!mount || mount.dataset.initialized === "true") return;
    mount.dataset.initialized = "true";

    mount.innerHTML = `
      <div class="workbench-box" style="margin-top:1.5rem;">
        <div class="workbench-header">
          <span class="workbench-title">[ BANCADA INTERATIVA DUPLA • MÓDULO 14: FFT & CRIPTOSSISTEMA RSA (CAPS. 30–31) ]</span>
          <span class="bracket-tag amber">FFT • CÍRCULO COMPLEXO • EUCLIDES ESTENDIDO • RSA</span>
        </div>
        <div class="workbench-body">
          <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
            Explore interativamente a dualidade algébrica entre coeficientes e valores de ponto: <strong>(Laboratório 01)</strong> Raízes complexas da unidade no círculo trigonométrico, rastreamento de <code>ITERATIVE-FFT</code> com permutação bit-reversal e multiplicação de polinômios via convolução; <strong>(Laboratório 02)</strong> O algoritmo <code>EXTENDED-EUCLID</code> passo a passo, cálculo do inverso modular e o Criptossistema RSA completo (geração de chaves, cifragem e decifragem por quadrados repetidos).
          </p>

          <div style="display:flex;gap:0.6rem;flex-wrap:wrap;margin-bottom:1.1rem;border-bottom:2px solid var(--ink-primary);padding-bottom:0.8rem;">
            <button id="m14-tab-fft" class="wb-btn primary">[ LABORATÓRIO 01: SIMULADOR FFT / DFT & MULTIPLICAÇÃO (CAP. 30) ]</button>
            <button id="m14-tab-rsa" class="wb-btn">[ LABORATÓRIO 02: EUCLIDES ESTENDIDO & CRIPTOSSISTEMA RSA (CAP. 31) ]</button>
          </div>

          <!-- PAINEL 1: FFT / DFT -->
          <div id="m14-panel-fft">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1.25rem;">
              <!-- SUBCOLUNA A: CÍRCULO COMPLEXO -->
              <div style="background:var(--bg-card);border:var(--border-thin);padding:1rem;">
                <div style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;margin-bottom:0.6rem;color:var(--accent-amber-dark);">
                  [ RAÍZES COMPLEXAS DA UNIDADE (CÍRCULO TRIGONOMÉTRICO) ]
                </div>
                <div style="display:flex;gap:10px;align-items:center;margin-bottom:12px;flex-wrap:wrap;font-family:var(--font-mono);font-size:0.78rem;">
                  <label style="font-weight:700;">Ordem $n$:</label>
                  <select id="m14-fft-n" class="search-input-brutal" style="padding:4px 10px;">
                    <option value="4">n = 4 (raízes quartas: ±1, ±i)</option>
                    <option value="8" selected>n = 8 (raízes oitavas de 45°)</option>
                    <option value="16">n = 16 (raízes décimas-sextas)</option>
                  </select>
                </div>
                <div style="display:flex;justify-content:center;align-items:center;background:var(--bg-paper);padding:1rem;border:var(--border-thin);">
                  <svg id="m14-roots-svg" width="280" height="280" viewBox="-140 -140 280 280" style="background:#111;border-radius:50%;border:2px solid #111;box-shadow:var(--shadow-brutal-sm);"></svg>
                </div>
                <div id="m14-root-detail" class="wb-log-panel" style="margin-top:10px;min-height:48px;">
                  Clique ou passe o mouse sobre uma raiz no círculo acima para inspecionar seus valores polar e retangular.
                </div>
              </div>

              <!-- SUBCOLUNA B: RASTREAMENTO DA FFT ITERATIVA -->
              <div style="background:var(--bg-card);border:var(--border-thin);padding:1rem;">
                <div style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;margin-bottom:0.6rem;color:var(--accent-amber-dark);">
                  [ RASTREAMENTO PASSO A PASSO DE ITERATIVE-FFT ]
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;align-items:center;">
                  <label style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;">Vetor $a$:</label>
                  <input id="m14-fft-input" type="text" value="0, 2, 3, -1, 4, 5, 7, 9" class="search-input-brutal" style="flex:1;min-width:160px;font-family:var(--font-mono);font-size:0.82rem;" />
                  <button id="m14-fft-calc-btn" class="wb-btn primary">Calcular DFT</button>
                </div>
                <div style="font-family:var(--font-mono);font-size:0.75rem;margin-bottom:8px;color:var(--ink-secondary);">Pré-configurações: <a href="javascript:void(0)" id="m14-preset-ex1" style="color:var(--accent-amber-dark);font-weight:700;">Exemplo 30.3-1 (n=8)</a> | <a href="javascript:void(0)" id="m14-preset-ex2" style="color:var(--accent-amber-dark);font-weight:700;">Linear [1, 2, 3, 4] (n=4)</a></div>
                <div id="m14-fft-trace-output" class="wb-log-panel" style="max-height:240px;overflow-y:auto;"></div>
              </div>
            </div>

            <!-- SEÇÃO C: MULTIPLICAÇÃO DE POLINÔMIOS VIA FFT -->
            <div style="margin-top:1.25rem;background:var(--bg-card);border:var(--border-thin);padding:1rem;">
              <div style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;margin-bottom:0.6rem;color:var(--accent-emerald-dark);">
                [ MULTIPLICAÇÃO RÁPIDA DE POLINÔMIOS A(x) · B(x) VIA CONVOLUÇÃO FFT ]
              </div>
              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-bottom:12px;">
                <div>
                  <label style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;">Polinômio $A(x)$ (coeficientes $a_0, a_1, \dots$):</label>
                  <input id="m14-poly-a" type="text" value="1, 1" class="search-input-brutal" style="width:100%;box-sizing:border-box;margin-top:4px;" />
                  <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--ink-secondary);">Ex.: <code>1, 1</code> representa $1 + x$</span>
                </div>
                <div>
                  <label style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;">Polinômio $B(x)$ (coeficientes $b_0, b_1, \dots$):</label>
                  <input id="m14-poly-b" type="text" value="-1, 2" class="search-input-brutal" style="width:100%;box-sizing:border-box;margin-top:4px;" />
                  <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--ink-secondary);">Ex.: <code>-1, 2</code> representa $-1 + 2x$</span>
                </div>
              </div>
              <button id="m14-poly-mult-btn" class="wb-btn primary">Multiplicar Polinômios (FFT → Convolução → IFFT)</button>
              <div id="m14-poly-result" class="wb-log-panel" style="margin-top:12px;"></div>
            </div>
          </div>

          <!-- PAINEL 2: RSA & EUCLIDES ESTENDIDO -->
          <div id="m14-panel-rsa" style="display:none;">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1.25rem;">
              <!-- SUBCOLUNA A: EXTENDED-EUCLID -->
              <div style="background:var(--bg-card);border:var(--border-thin);padding:1rem;">
                <div style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;margin-bottom:0.6rem;color:var(--accent-amber-dark);">
                  [ EXTENDED-EUCLID(a, b): BÉZOUT E INVERSO MODULAR ]
                </div>
                <p style="font-size:0.82rem;color:var(--ink-secondary);margin-bottom:0.6rem;">Calcula $d = \\text{mdc}(a, b) = a x + b y$. Se $d = 1$, $x \\equiv a^{-1} \\pmod b$.</p>
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap;">
                  <label style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;">$a$:</label>
                  <input id="m14-ee-a" type="number" value="899" class="search-input-brutal" style="width:80px;" />
                  <label style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;">$b$:</label>
                  <input id="m14-ee-b" type="number" value="493" class="search-input-brutal" style="width:80px;" />
                  <button id="m14-ee-run-btn" class="wb-btn primary">Executar</button>
                </div>
                <div style="font-family:var(--font-mono);font-size:0.75rem;margin-bottom:8px;color:var(--ink-secondary);">Presets: <a href="javascript:void(0)" id="m14-preset-ee1" style="color:var(--accent-amber-dark);font-weight:700;">Ex. 31.2-4 (899, 493)</a> | <a href="javascript:void(0)" id="m14-preset-ee2" style="color:var(--accent-amber-dark);font-weight:700;">Inverso (17 mod 3120)</a></div>
                <div id="m14-ee-output" class="wb-log-panel" style="max-height:240px;overflow-y:auto;"></div>
              </div>

              <!-- SUBCOLUNA B: SIMULADOR CRIPTOGRÁFICO RSA -->
              <div style="background:var(--bg-card);border:var(--border-thin);padding:1rem;">
                <div style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;margin-bottom:0.6rem;color:var(--accent-emerald-dark);">
                  [ SIMULADOR DE CHAVES RSA, CIFRAGEM E DECIFRAGEM ]
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
                  <div>
                    <label style="font-family:var(--font-mono);font-size:0.76rem;font-weight:700;">Primo $p$:</label>
                    <input id="m14-rsa-p" type="number" value="61" class="search-input-brutal" style="width:100%;box-sizing:border-box;" />
                  </div>
                  <div>
                    <label style="font-family:var(--font-mono);font-size:0.76rem;font-weight:700;">Primo $q$:</label>
                    <input id="m14-rsa-q" type="number" value="53" class="search-input-brutal" style="width:100%;box-sizing:border-box;" />
                  </div>
                  <div>
                    <label style="font-family:var(--font-mono);font-size:0.76rem;font-weight:700;">Expoente público $e$:</label>
                    <input id="m14-rsa-e" type="number" value="17" class="search-input-brutal" style="width:100%;box-sizing:border-box;" />
                  </div>
                  <div>
                    <label style="font-family:var(--font-mono);font-size:0.76rem;font-weight:700;">Mensagem $M < n$:</label>
                    <input id="m14-rsa-m" type="number" value="65" class="search-input-brutal" style="width:100%;box-sizing:border-box;" />
                  </div>
                </div>
                <button id="m14-rsa-gen-btn" class="wb-btn primary" style="width:100%;margin-bottom:8px;">Gerar Chaves e Cifrar/Decifrar</button>
                <div style="font-family:var(--font-mono);font-size:0.75rem;margin-bottom:8px;color:var(--ink-secondary);">Presets: <a href="javascript:void(0)" id="m14-preset-rsa1" style="color:var(--accent-amber-dark);font-weight:700;">CLRS p. 782 (p=61, q=53, e=17)</a> | <a href="javascript:void(0)" id="m14-preset-rsa2" style="color:var(--accent-amber-dark);font-weight:700;">Mini (11, 29, e=3)</a></div>
                <div id="m14-rsa-output" class="wb-log-panel"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // --- LOGICA DE ALTERNANCIA DE ABAS ---
    const tabFft = document.getElementById("m14-tab-fft");
    const tabRsa = document.getElementById("m14-tab-rsa");
    const panelFft = document.getElementById("m14-panel-fft");
    const panelRsa = document.getElementById("m14-panel-rsa");

    if (tabFft && tabRsa && panelFft && panelRsa) {
      tabFft.onclick = () => {
        tabFft.style.background = "#2563eb";
        tabFft.style.color = "#fff";
        tabFft.style.borderColor = "#3b82f6";
        tabRsa.style.background = "#1e293b";
        tabRsa.style.color = "#94a3b8";
        tabRsa.style.borderColor = "#475569";
        panelFft.style.display = "block";
        panelRsa.style.display = "none";
      };

      tabRsa.onclick = () => {
        tabRsa.style.background = "#d97706";
        tabRsa.style.color = "#fff";
        tabRsa.style.borderColor = "#f59e0b";
        tabFft.style.background = "#1e293b";
        tabFft.style.color = "#94a3b8";
        tabFft.style.borderColor = "#475569";
        panelFft.style.display = "none";
        panelRsa.style.display = "block";
      };
    }

    // --- ABA 1: CÍRCULO COMPLEXO SVG ---
    function renderRootsCircle(n) {
      const svg = document.getElementById("m14-roots-svg");
      const detail = document.getElementById("m14-root-detail");
      if (!svg) return;
      svg.innerHTML = "";

      const R = 100;
      // Eixos coordenados
      const axes = `
        <line x1="-125" y1="0" x2="125" y2="0" stroke="#334155" stroke-width="1.5" />
        <line x1="0" y1="-125" x2="0" y2="125" stroke="#334155" stroke-width="1.5" />
        <circle cx="0" cy="0" r="${R}" fill="none" stroke="#2563eb" stroke-dasharray="4,4" stroke-width="1.5" />
        <text x="126" y="4" fill="#64748b" font-size="10" font-family="sans-serif">Re</text>
        <text x="4" y="-126" fill="#64748b" font-size="10" font-family="sans-serif">Im</text>
      `;
      svg.insertAdjacentHTML("beforeend", axes);

      // Pontos das raízes
      for (let k = 0; k < n; k++) {
        const theta = (2 * Math.PI * k) / n;
        const re = Math.cos(theta);
        const im = Math.sin(theta);
        // SVG: eixo y aponta para baixo, então y = -R * im
        const cx = (R * re).toFixed(2);
        const cy = (-R * im).toFixed(2);

        const circleEl = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circleEl.setAttribute("cx", cx);
        circleEl.setAttribute("cy", cy);
        circleEl.setAttribute("r", "5.5");
        circleEl.setAttribute("fill", k === 0 ? "#10b981" : (k === n/2 ? "#ef4444" : "#38bdf8"));
        circleEl.setAttribute("stroke", "#ffffff");
        circleEl.setAttribute("stroke-width", "1.5");
        circleEl.style.cursor = "pointer";

        const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
        const lx = (1.2 * R * re).toFixed(2);
        const ly = (-1.2 * R * im + 4).toFixed(2);
        textEl.setAttribute("x", lx);
        textEl.setAttribute("y", ly);
        textEl.setAttribute("fill", "#94a3b8");
        textEl.setAttribute("font-size", n > 8 ? "8" : "10");
        textEl.setAttribute("text-anchor", "middle");
        textEl.textContent = `ω${n}^${k}`;

        const showDetail = () => {
          if (detail) {
            const reStr = Math.abs(re) < 1e-9 ? "0.000" : re.toFixed(3);
            const imStr = Math.abs(im) < 1e-9 ? "0.000" : (im > 0 ? `+ ${im.toFixed(3)}i` : `- ${Math.abs(im).toFixed(3)}i`);
            const deg = ((k * 360) / n).toFixed(1);
            detail.innerHTML = `
              <strong style="color: #38bdf8;">Raiz selecionada: ω_${n}^${k}</strong> (${deg}°)<br>
              <strong>Forma Polar:</strong> e^(2πi · ${k} / ${n}) = cos(${deg}°) + i·sin(${deg}°)<br>
              <strong>Forma Retangular:</strong> ${reStr} ${imStr}
              ${k === 0 ? " <span style='color: #10b981;'>(Elemento neutro = 1)</span>" : ""}
              ${k === n/2 ? " <span style='color: #ef4444;'>(Corolário 30.3: ω_n^(n/2) = -1)</span>" : ""}
            `;
          }
        };

        circleEl.addEventListener("mouseenter", showDetail);
        circleEl.addEventListener("click", showDetail);

        svg.appendChild(circleEl);
        svg.appendChild(textEl);
      }
    }

    const nSelect = document.getElementById("m14-fft-n");
    if (nSelect) {
      nSelect.onchange = () => renderRootsCircle(parseInt(nSelect.value, 10));
      renderRootsCircle(parseInt(nSelect.value, 10));
    }

    // --- ABA 1: RASTREAMENTO DA FFT ITERATIVA ---
    function bitReverse(k, bits) {
      let rev = 0;
      for (let i = 0; i < bits; i++) {
        rev = (rev << 1) | ((k >> i) & 1);
      }
      return rev;
    }

    function runIterativeFFT(a) {
      const n = a.length;
      const bits = Math.round(Math.log2(n));
      const A = new Array(n);
      for (let k = 0; k < n; k++) {
        A[bitReverse(k, bits)] = { re: a[k], im: 0 };
      }

      let logHtml = `<div style="color: #60a5fa; font-weight: bold; margin-bottom: 6px;">Entrada: a = [${a.join(", ")}] (n = ${n}, lg n = ${bits})</div>`;
      logHtml += `<div style="color: #94a3b8; margin-bottom: 6px;">1. BIT-REVERSE-COPY:</div>`;
      logHtml += `<div style="margin-left: 8px; margin-bottom: 10px;">`;
      for (let k = 0; k < n; k++) {
        const revK = bitReverse(k, bits);
        logHtml += `k=${k} (${k.toString(2).padStart(bits, "0")}) → rev=${revK} (${revK.toString(2).padStart(bits, "0")}) : A[${revK}] = ${a[k]}<br>`;
      }
      logHtml += `Arranjo inicial A = [${A.map(x => x.re).join(", ")}]</div>`;

      for (let s = 1; s <= bits; s++) {
        const m = 1 << s;
        logHtml += `<div style="color: #38bdf8; font-weight: bold; margin-top: 8px;">Estágio s = ${s} (m = 2^${s} = ${m}, m/2 = ${m/2} borboletas/bloco):</div>`;
        const theta_m = (2 * Math.PI) / m;
        const wm = { re: Math.cos(theta_m), im: Math.sin(theta_m) };

        for (let k = 0; k < n; k += m) {
          let w = { re: 1, im: 0 };
          logHtml += `<div style="margin-left: 10px; color: #cbd5e1;">Bloco k = ${k}..${k+m-1}:</div>`;
          for (let j = 0; j < m / 2; j++) {
            const idx1 = k + j;
            const idx2 = k + j + m / 2;
            const target = A[idx2];
            // t = w * A[idx2]
            const t = {
              re: w.re * target.re - w.im * target.im,
              im: w.re * target.im + w.im * target.re
            };
            const u = { re: A[idx1].re, im: A[idx1].im };
            A[idx1] = { re: u.re + t.re, im: u.im + t.im };
            A[idx2] = { re: u.re - t.re, im: u.im - t.im };

            const fmtC = (c) => {
              const r = Math.abs(c.re) < 1e-6 ? "0" : c.re.toFixed(2);
              const i = Math.abs(c.im) < 1e-6 ? "" : (c.im > 0 ? `+${c.im.toFixed(2)}i` : `${c.im.toFixed(2)}i`);
              return `${r}${i}`;
            };
            logHtml += `<div style="margin-left: 20px; font-size: 0.78rem;">Borboleta j=${j} (ω_${m}^${j}): A[${idx1}] = ${fmtC(A[idx1])}, A[${idx2}] = ${fmtC(A[idx2])}</div>`;

            // w = w * wm
            const nextW = {
              re: w.re * wm.re - w.im * wm.im,
              im: w.re * wm.im + w.im * wm.re
            };
            w = nextW;
          }
        }
      }

      logHtml += `<div style="color: #10b981; font-weight: bold; margin-top: 10px;">Vetor Final y = DFT_${n}(a):</div>`;
      logHtml += `<div style="margin-left: 8px; margin-top: 4px;">`;
      A.forEach((c, idx) => {
        const r = Math.abs(c.re) < 1e-4 ? "0.00" : c.re.toFixed(2);
        const i = Math.abs(c.im) < 1e-4 ? "" : (c.im > 0 ? ` + ${c.im.toFixed(2)}i` : ` - ${Math.abs(c.im).toFixed(2)}i`);
        logHtml += `y[${idx}] = <strong>${r}${i}</strong><br>`;
      });
      logHtml += `</div>`;

      return logHtml;
    }

    const fftInput = document.getElementById("m14-fft-input");
    const fftCalcBtn = document.getElementById("m14-fft-calc-btn");
    const fftTraceOutput = document.getElementById("m14-fft-trace-output");

    function executeFftTrace() {
      if (!fftInput || !fftTraceOutput) return;
      const raw = fftInput.value.split(",").map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      if (raw.length < 2) {
        fftTraceOutput.innerHTML = "<span style='color: #ef4444;'>Insira pelo menos 2 números separados por vírgula.</span>";
        return;
      }
      let n = 1;
      while (n < raw.length) n <<= 1;
      while (raw.length < n) raw.push(0);
      fftTraceOutput.innerHTML = runIterativeFFT(raw);
    }

    if (fftCalcBtn) fftCalcBtn.onclick = executeFftTrace;
    const preset1 = document.getElementById("m14-preset-ex1");
    if (preset1) preset1.onclick = () => { if (fftInput) { fftInput.value = "0, 2, 3, -1, 4, 5, 7, 9"; executeFftTrace(); } };
    const preset2 = document.getElementById("m14-preset-ex2");
    if (preset2) preset2.onclick = () => { if (fftInput) { fftInput.value = "1, 2, 3, 4"; executeFftTrace(); } };

    // Executa uma vez inicialmente
    executeFftTrace();

    // --- ABA 1: MULTIPLICAÇÃO DE POLINÔMIOS ---
    function polyMultiply(aCoeffs, bCoeffs) {
      const degA = aCoeffs.length - 1;
      const degB = bCoeffs.length - 1;
      const degProd = degA + degB;
      let n = 1;
      while (n <= degProd) n <<= 1;

      const aPadded = new Array(n).fill(0);
      const bPadded = new Array(n).fill(0);
      for (let i = 0; i <= degA; i++) aPadded[i] = aCoeffs[i];
      for (let i = 0; i <= degB; i++) bPadded[i] = bCoeffs[i];

      function fft(vec, invert) {
        const len = vec.length;
        const bits = Math.round(Math.log2(len));
        const res = new Array(len);
        for (let k = 0; k < len; k++) res[bitReverse(k, bits)] = { re: vec[k].re, im: vec[k].im };

        for (let s = 1; s <= bits; s++) {
          const m = 1 << s;
          const angle = (2 * Math.PI / m) * (invert ? -1 : 1);
          const wm = { re: Math.cos(angle), im: Math.sin(angle) };
          for (let k = 0; k < len; k += m) {
            let w = { re: 1, im: 0 };
            for (let j = 0; j < m / 2; j++) {
              const idx1 = k + j;
              const idx2 = k + j + m / 2;
              const t = {
                re: w.re * res[idx2].re - w.im * res[idx2].im,
                im: w.re * res[idx2].im + w.im * res[idx2].re
              };
              const u = { re: res[idx1].re, im: res[idx1].im };
              res[idx1] = { re: u.re + t.re, im: u.im + t.im };
              res[idx2] = { re: u.re - t.re, im: u.im - t.im };
              const nw = {
                re: w.re * wm.re - w.im * wm.im,
                im: w.re * wm.im + w.im * wm.re
              };
              w = nw;
            }
          }
        }
        if (invert) {
          for (let k = 0; k < len; k++) {
            res[k].re /= len;
            res[k].im /= len;
          }
        }
        return res;
      }

      const A_comp = aPadded.map(r => ({ re: r, im: 0 }));
      const B_comp = bPadded.map(r => ({ re: r, im: 0 }));

      const dftA = fft(A_comp, false);
      const dftB = fft(B_comp, false);

      const dftC = new Array(n);
      for (let k = 0; k < n; k++) {
        dftC[k] = {
          re: dftA[k].re * dftB[k].re - dftA[k].im * dftB[k].im,
          im: dftA[k].re * dftB[k].im + dftA[k].im * dftB[k].re
        };
      }

      const ifftC = fft(dftC, true);
      const finalCoeffs = ifftC.slice(0, degProd + 1).map(c => Math.round(c.re));

      return {
        degA, degB, degProd, n,
        aPadded, bPadded, dftA, dftB, dftC, finalCoeffs
      };
    }

    const polyBtn = document.getElementById("m14-poly-mult-btn");
    const polyOut = document.getElementById("m14-poly-result");
    if (polyBtn && polyOut) {
      polyBtn.onclick = () => {
        const rawA = document.getElementById("m14-poly-a").value.split(",").map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
        const rawB = document.getElementById("m14-poly-b").value.split(",").map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
        if (rawA.length === 0 || rawB.length === 0) {
          polyOut.innerHTML = "<span style='color: #ef4444;'>Insira coeficientes válidos para A(x) e B(x).</span>";
          return;
        }
        const res = polyMultiply(rawA, rawB);

        const formatPoly = (coeffs) => {
          return coeffs.map((c, i) => {
            if (c === 0 && coeffs.length > 1) return null;
            if (i === 0) return `${c}`;
            if (i === 1) return (c === 1 ? "x" : (c === -1 ? "-x" : `${c}x`));
            return (c === 1 ? `x^${i}` : (c === -1 ? `-x^${i}` : `${c}x^${i}`));
          }).filter(Boolean).join(" + ").replace(/\+ -/g, "- ");
        };

        polyOut.innerHTML = `
          <div style="color: #34d399; font-weight: bold; margin-bottom: 6px;">Resultado da Multiplicação em Θ(n lg n):</div>
          <div style="margin-bottom: 8px;">
            <strong>A(x)</strong> = ${formatPoly(rawA)} (grau ${res.degA})<br>
            <strong>B(x)</strong> = ${formatPoly(rawB)} (grau ${res.degB})<br>
            <strong>Limite de Grau de C(x)</strong> = ${res.degProd + 1} → Próxima potência de 2: <strong>n = ${res.n}</strong>
          </div>
          <div style="background: rgba(15, 23, 42, 0.8); padding: 8px; border-radius: 4px; margin-bottom: 8px; font-family: monospace; font-size: 0.8rem;">
            1. Zero-Padding até ${res.n}: a = [${res.aPadded.join(", ")}], b = [${res.bPadded.join(", ")}]<br>
            2. Avaliação: DFT_${res.n}(a) e DFT_${res.n}(b) computadas via FFT em tempo Θ(n lg n)<br>
            3. Multiplicação Ponto a Ponto: C_k = A_k · B_k em tempo Θ(n)<br>
            4. Interpolação: DFT_${res.n}^(-1)(C) dividindo por ${res.n} em tempo Θ(n lg n)
          </div>
          <div style="color: #60a5fa; font-size: 0.95rem;">
            <strong>Coeficientes da Convolução C = a ⊗ b:</strong> [${res.finalCoeffs.join(", ")}]<br>
            <strong>Polinômio Produto C(x):</strong> <span style="color: #34d399; font-weight: bold;">${formatPoly(res.finalCoeffs)}</span>
          </div>
        `;
      };
      polyBtn.click();
    }

    // --- ABA 2: EXTENDED-EUCLID ---
    function extEuclid(a, b) {
      const steps = [];
      function recurse(u, v) {
        if (v === 0) {
          steps.push({ u, v, q: 0, r: 0, d: u, x: 1, y: 0, base: true });
          return { d: u, x: 1, y: 0 };
        }
        const q = Math.floor(u / v);
        const r = u % v;
        const sub = recurse(v, r);
        const d = sub.d;
        const x = sub.y;
        const y = sub.x - q * sub.y;
        steps.push({ u, v, q, r, d, x, y, base: false });
        return { d, x, y };
      }
      const res = recurse(a, b);
      return { res, steps };
    }

    const eeBtn = document.getElementById("m14-ee-run-btn");
    const eeOut = document.getElementById("m14-ee-output");
    function runExtendedEuclidView() {
      if (!eeOut) return;
      const a = parseInt(document.getElementById("m14-ee-a").value, 10);
      const b = parseInt(document.getElementById("m14-ee-b").value, 10);
      if (isNaN(a) || isNaN(b) || a < 0 || b < 0) {
        eeOut.innerHTML = "<span style='color: #ef4444;'>Insira inteiros não negativos.</span>";
        return;
      }
      const { res, steps } = extEuclid(a, b);

      let html = `<div style="color: #fbbf24; font-weight: bold; margin-bottom: 6px;">Execução de EXTENDED-EUCLID(${a}, ${b}):</div>`;
      html += `<table style="width: 100%; border-collapse: collapse; font-size: 0.78rem; text-align: center; margin-bottom: 10px;">
        <thead>
          <tr style="border-bottom: 1px solid #475569; background: rgba(59, 130, 246, 0.1);">
            <th style="padding: 4px;">Etapa</th><th style="padding: 4px;">u</th><th style="padding: 4px;">v</th><th style="padding: 4px;">q = ⌊u/v⌋</th><th style="padding: 4px;">r = u mod v</th><th style="padding: 4px;">d</th><th style="padding: 4px;">x</th><th style="padding: 4px;">y</th>
          </tr>
        </thead>
        <tbody>`;
      steps.reverse().forEach((st, idx) => {
        html += `<tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 4px;">${idx + 1}</td>
          <td style="padding: 4px;">${st.u}</td>
          <td style="padding: 4px;">${st.v}</td>
          <td style="padding: 4px;">${st.base ? "-" : st.q}</td>
          <td style="padding: 4px;">${st.base ? "-" : st.r}</td>
          <td style="padding: 4px; font-weight: bold; color: #38bdf8;">${st.d}</td>
          <td style="padding: 4px; color: #34d399;">${st.x}</td>
          <td style="padding: 4px; color: #f472b6;">${st.y}</td>
        </tr>`;
      });
      html += `</tbody></table>`;

      html += `<div style="margin-top: 6px;">
        <strong>Resultado Final:</strong> d = <strong>${res.d}</strong>, x = <strong>${res.x}</strong>, y = <strong>${res.y}</strong><br>
        <strong>Identidade de Bézout:</strong> ${a} · (${res.x}) + ${b} · (${res.y}) = ${a * res.x} + ${b * res.y} = <strong>${res.d}</strong><br>
        ${res.d === 1 ? `<span style='color: #10b981; font-weight: bold;'>Como mdc(${a}, ${b}) = 1: o inverso de ${a} mod ${b} é (${res.x} mod ${b}) = ${(res.x % b + b) % b}.</span>` : `<span style='color: #ef4444;'>Como mdc(${a}, ${b}) = ${res.d} ≠ 1, ${a} não possui inverso multiplicativo módulo ${b}.</span>`}
      </div>`;
      eeOut.innerHTML = html;
    }

    if (eeBtn) eeBtn.onclick = runExtendedEuclidView;
    const eePreset1 = document.getElementById("m14-preset-ee1");
    if (eePreset1) eePreset1.onclick = () => {
      document.getElementById("m14-ee-a").value = 899;
      document.getElementById("m14-ee-b").value = 493;
      runExtendedEuclidView();
    };
    const eePreset2 = document.getElementById("m14-preset-ee2");
    if (eePreset2) eePreset2.onclick = () => {
      document.getElementById("m14-ee-a").value = 17;
      document.getElementById("m14-ee-b").value = 3120;
      runExtendedEuclidView();
    };
    runExtendedEuclidView();

    // --- ABA 2: SIMULADOR RSA ---
    function modExpTrace(base, exp, mod) {
      let d = 1;
      const bin = exp.toString(2);
      const steps = [];
      for (let i = 0; i < bin.length; i++) {
        const bit = parseInt(bin[i], 10);
        const beforeSq = d;
        d = (d * d) % mod;
        let mult = null;
        if (bit === 1) {
          const beforeM = d;
          d = (d * base) % mod;
          mult = `${beforeM} · ${base} mod ${mod} = ${d}`;
        }
        steps.push({ bit, beforeSq, sqResult: (beforeSq * beforeSq) % mod, mult, after: d });
      }
      return { result: d, bin, steps };
    }

    const rsaGenBtn = document.getElementById("m14-rsa-gen-btn");
    const rsaOut = document.getElementById("m14-rsa-output");

    function runRsaSimulator() {
      if (!rsaOut) return;
      const p = parseInt(document.getElementById("m14-rsa-p").value, 10);
      const q = parseInt(document.getElementById("m14-rsa-q").value, 10);
      const e = parseInt(document.getElementById("m14-rsa-e").value, 10);
      const M = parseInt(document.getElementById("m14-rsa-m").value, 10);

      if (isNaN(p) || isNaN(q) || isNaN(e) || isNaN(M)) {
        rsaOut.innerHTML = "<span style='color: #ef4444;'>Preencha todos os campos com inteiros válidos.</span>";
        return;
      }
      if (p === q) {
        rsaOut.innerHTML = "<span style='color: #ef4444;'>Os primos p e q devem ser distintos!</span>";
        return;
      }

      const n = p * q;
      const phi = (p - 1) * (q - 1);
      const ee = extEuclid(e, phi);

      if (ee.res.d !== 1) {
        rsaOut.innerHTML = `<span style='color: #ef4444;'>Erro: mdc(e, ϕ(n)) = mdc(${e}, ${phi}) = ${ee.res.d} ≠ 1. O expoente e não é coprimo com ϕ(n). Escolha outro e!</span>`;
        return;
      }

      const d = ((ee.res.x % phi) + phi) % phi;
      if (M >= n) {
        rsaOut.innerHTML = `<span style='color: #ef4444;'>Aviso: a mensagem M = ${M} deve ser estritamente menor que o módulo n = ${n}.</span>`;
        return;
      }

      const enc = modExpTrace(M, e, n);
      const C = enc.result;
      const dec = modExpTrace(C, d, n);
      const recoveredM = dec.result;

      rsaOut.innerHTML = `
        <div style="color: #fbbf24; font-weight: bold; margin-bottom: 6px;">Parâmetros Criptográficos Calculados:</div>
        <div style="font-size: 0.82rem; margin-bottom: 8px;">
          • Módulo Público: <strong>n = p · q = ${p} · ${q} = ${n}</strong><br>
          • Totiente de Euler: <strong>ϕ(n) = (${p} - 1)(${q} - 1) = ${phi}</strong><br>
          • Chave Pública: <strong>P = (e, n) = (${e}, ${n})</strong><br>
          • Chave Privada: <strong>S = (d, n) = (${d}, ${n})</strong> (pois ${e} · ${d} ≡ 1 mod ${phi})
        </div>

        <div style="background: rgba(15, 23, 42, 0.85); padding: 8px; border-radius: 4px; margin-bottom: 8px; font-size: 0.8rem;">
          <strong style="color: #38bdf8;">1. Cifragem: C = M^e mod n = ${M}^${e} mod ${n}</strong><br>
          Expoente binário e = ${e} (${enc.bin}_2, ${enc.bin.length} bits)<br>
          Texto Cifrado: <strong style="color: #f59e0b; font-size: 0.95rem;">C = ${C}</strong>
        </div>

        <div style="background: rgba(15, 23, 42, 0.85); padding: 8px; border-radius: 4px; font-size: 0.8rem;">
          <strong style="color: #34d399;">2. Decifragem: M' = C^d mod n = ${C}^${d} mod ${n}</strong><br>
          Expoente binário d = ${d} (${dec.bin}_2, ${dec.bin.length} bits)<br>
          Mensagem Recuperada: <strong style="color: #34d399; font-size: 0.95rem;">M' = ${recoveredM}</strong>
          ${recoveredM === M ? " <span style='color: #10b981; font-weight: bold;'>✔ (SUCESSO: M' == M)</span>" : " <span style='color: #ef4444;'>✘ ERRO</span>"}
        </div>
      `;
    }

    if (rsaGenBtn) rsaGenBtn.onclick = runRsaSimulator;
    const rsaPreset1 = document.getElementById("m14-preset-rsa1");
    if (rsaPreset1) rsaPreset1.onclick = () => {
      document.getElementById("m14-rsa-p").value = 61;
      document.getElementById("m14-rsa-q").value = 53;
      document.getElementById("m14-rsa-e").value = 17;
      document.getElementById("m14-rsa-m").value = 65;
      runRsaSimulator();
    };
    const rsaPreset2 = document.getElementById("m14-preset-rsa2");
    if (rsaPreset2) rsaPreset2.onclick = () => {
      document.getElementById("m14-rsa-p").value = 11;
      document.getElementById("m14-rsa-q").value = 29;
      document.getElementById("m14-rsa-e").value = 3;
      document.getElementById("m14-rsa-m").value = 31;
      runRsaSimulator();
    };
    runRsaSimulator();
  }

/* ========================================================================
     SEÇÃO 3: QUIZZES (10 QUESTÕES COM GABARITO COMENTADO — CAPS. 30 E 31)
     ======================================================================== */
  const quizzes = [
    {
      id: "q14-1",
      type: "Múltipla Escolha",
      reference: "Cap. 30, Seção 30.1 (pp. 726–731)",
      question:
        "Considere a representação de polinômios por coeficientes e por pares ponto-valor. Para dois polinômios A(x) e B(x) com limite de grau n, qual das alternativas expressa CORRETAMENTE a complexidade da multiplicação e a unicidade da representação?",
      options: [
        {
          letter: "A",
          text: "A multiplicação na forma de coeficientes exige tempo Θ(n²) via convolução direta, enquanto na forma de pares ponto-valor com 2n pontos distintos ela requer apenas Θ(n) multiplicações escalares; além disso, a representação por pares ponto-valor é única porque o determinante da matriz de Vandermonde formada por pontos distintos é não nulo.",
          isCorrect: true,
          explanation:
            "Correta! Pela Seção 30.1 (pp. 728–730) e pelo Teorema 30.1, a matriz de Vandermonde V(x_0, ..., x_{n-1}) possui determinante ∏_{j<k} (x_k - x_j) ≠ 0 se os pontos forem distintos, garantindo a unicidade. Multiplicar em ponto-valor requer apenas C(x_k) = A(x_k) · B(x_k) em 2n pontos (pois grau(C) < 2n), tomando tempo linear Θ(n)."
        },
        {
          letter: "B",
          text: "A multiplicação por pares ponto-valor exige apenas n pontos e tempo Θ(lg n), mas a interpolação para coeficientes é impossível devido à singularidade da matriz de Vandermonde.",
          isCorrect: false,
          explanation:
            "Incorreta. O produto C(x) = A(x)B(x) possui limite de grau 2n, exigindo no mínimo 2n pares ponto-valor, e a matriz de Vandermonde com pontos distintos é estritamente não singular."
        },
        {
          letter: "C",
          text: "A Regra de Horner avalia um polinômio em um ponto em tempo Θ(lg n), permitindo avaliar n pontos em Θ(n lg n) sem usar números complexos.",
          isCorrect: false,
          explanation:
            "Incorreta. A Regra de Horner executa n-1 adições e n-1 multiplicações, consumindo tempo linear Θ(n) por ponto, logo avaliar n pontos quaisquer demora tempo quadrático Θ(n²)."
        },
        {
          letter: "D",
          text: "A interpolação de Lagrange permite recuperar a forma de coeficientes a partir de n pontos em tempo linear Θ(n).",
          isCorrect: false,
          explanation:
            "Incorreta. A fórmula de interpolação de Lagrange direta para recuperar os coeficientes gasta tempo quadrático Θ(n²)."
        }
      ]
    },
    {
      id: "q14-2",
      type: "Múltipla Escolha",
      reference: "Cap. 30, Seção 30.2 (pp. 731–734)",
      question:
        "Sobre as raízes n-ésimas complexas da unidade ω_n = e^(2πi/n) e suas propriedades fundamentais (Lemas do Cancelamento, do Quadrado e do Somatório), assinale a alternativa CORRETA:",
      options: [
        {
          letter: "A",
          text: "Pelo Lema do Cancelamento, ω_{dn}^{dk} = ω_n^k; pelo Lema do Quadrado, os quadrados das n raízes n-ésimas da unidade são as n/2 raízes (n/2)-ésimas da unidade (com (ω_n^{k + n/2})² = (ω_n^k)² = ω_{n/2}^k); e pelo Lema do Somatório, a soma ∑_{j=0}^{n-1} (ω_n^k)^j é igual a 0 para todo k não divisível por n.",
          isCorrect: true,
          explanation:
            "Correta! Esses são precisamente os Lemas 30.2, 30.4 e 30.5 do CLRS (pp. 733–734). O Lema do Quadrado é o que viabiliza a redução do número de pontos à metade na recursão de Cooley-Tukey, e o Lema do Somatório prova a ortogonalidade da matriz da DFT."
        },
        {
          letter: "B",
          text: "O Lema do Quadrado afirma que elevar ao quadrado as raízes n-ésimas produz n raízes 2n-ésimas da unidade, dobrando o tamanho do subproblema.",
          isCorrect: false,
          explanation:
            "Incorreta. Elevar ao quadrado reduz as n raízes n-ésimas às n/2 raízes (n/2)-ésimas, dividindo o conjunto de pontos pela metade."
        },
        {
          letter: "C",
          text: "A soma de todas as raízes n-ésimas da unidade ∑_{k=0}^{n-1} ω_n^k é igual a n para qualquer n par.",
          isCorrect: false,
          explanation:
            "Incorreta. Para k = 1 (que não divide n), a soma das potências vale exatamente 0 pelo Lema do Somatório."
        },
        {
          letter: "D",
          text: "Para n par, a raiz diametralmente oposta satisfaz ω_n^{n/2} = +1, coincidindo com a raiz principal ω_n^0.",
          isCorrect: false,
          explanation:
            "Incorreta. Pelo Corolário 30.3, ω_n^{n/2} = e^{πi} = -1, que é o oposto aditivo de ω_n^0 = 1."
        }
      ]
    },
    {
      id: "q14-3",
      type: "Múltipla Escolha",
      reference: "Cap. 30, Seção 30.2 (pp. 734–738)",
      question:
        "No algoritmo RECURSIVE-FFT(a), como o polinômio A(x) é decomposto e qual é a relação que combina os resultados das chamadas recursivas y^[0] e y^[1] nas operações borboleta?",
      options: [
        {
          letter: "A",
          text: "A(x) é decomposto em metade superior e metade inferior A(x) = A_{inf}(x) + x^(n/2) A_{sup}(x), combinando com y_k = y_k^{inf} + y_k^{sup}.",
          isCorrect: false,
          explanation:
            "Incorreta. A divisão da FFT é feita por paridade de índices dos coeficientes (pares e ímpares), e não por metades contíguas do vetor."
        },
        {
          letter: "B",
          text: "A(x) é decomposto em coeficientes pares e ímpares tal que A(x) = A^[0](x²) + x A^[1](x²); as soluções recursivas são combinadas para k = 0 .. n/2 - 1 por y_k = y_k^[0] + ω_n^k y_k^[1] e y_{k + n/2} = y_k^[0] - ω_n^k y_k^[1], resultando na recorrência T(n) = 2T(n/2) + Θ(n) = Θ(n lg n).",
          isCorrect: true,
          explanation:
            "Correta! Pela Seção 30.2 (pp. 735–736), a identidade A(x) = A^[0](x²) + x A^[1](x²) combinada com o fato de que (ω_n^{k + n/2})² = (ω_n^k)² = ω_{n/2}^k e ω_n^{k + n/2} = -ω_n^k permite calcular ambos os pontos com uma única multiplicação pelo fator de giro ω_n^k!"
        },
        {
          letter: "C",
          text: "O algoritmo divide o vetor em 4 subproblemas de tamanho n/4, gerando a recorrência T(n) = 4T(n/4) + Θ(n²) = Θ(n²).",
          isCorrect: false,
          explanation:
            "Incorreta. O algoritmo clássico de radix-2 divide em 2 subproblemas de tamanho n/2, com combinação em tempo linear Θ(n), atingindo Θ(n lg n)."
        },
        {
          letter: "D",
          text: "A operação borboleta requer dividir recursivamente por n em cada chamada para garantir estabilidade numérica.",
          isCorrect: false,
          explanation:
            "Incorreta. A divisão por n ocorre exclusivamente na DFT Inversa ao final da interpolação, e não nas chamadas recursivas da FFT direta."
        }
      ]
    },
    {
      id: "q14-4",
      type: "Múltipla Escolha",
      reference: "Cap. 30, Seção 30.3 (pp. 738–747)",
      question:
        "Qual é o papel da permutação de inversão de bits (BIT-REVERSE-COPY) no algoritmo ITERATIVE-FFT e qual é a profundidade de um circuito FFT paralelo para n entradas?",
      options: [
        {
          letter: "A",
          text: "A inversão de bits coloca as entradas na ordem em que aparecem nas folhas da árvore de recursão da FFT, permitindo que os cálculos das borboletas sejam executados inteiramente no lugar (in-place) em lg n estágios; um circuito FFT paralelo correspondente possui profundidade Θ(lg n) e executa Θ(n lg n) operações borboleta.",
          isCorrect: true,
          explanation:
            "Correta! Conforme demonstrado na Seção 30.3 (pp. 740–744), a extração do bit menos significativo em cada nível da árvore faz com que as folhas sigam a permutação rev(k). Isso viabiliza o algoritmo iterativo no lugar e o circuito paralelo com lg n estágios de n/2 borboletas paralelas (profundidade Θ(lg n))."
        },
        {
          letter: "B",
          text: "A inversão de bits serve para calcular o inverso modular dos coeficientes e exige circuito com profundidade linear Θ(n).",
          isCorrect: false,
          explanation:
            "Incorreta. A permutação de inversão de bits é puramente uma reordenação de índices e sua profundidade em hardware é 0 (apenas fiação)."
        },
        {
          letter: "C",
          text: "A DFT inversa não pode usar ITERATIVE-FFT porque a matriz V_n não possui inversa expressável por potências de raízes da unidade.",
          isCorrect: false,
          explanation:
            "Incorreta. Pelo Teorema 30.7, (V_n^{-1})_{j,k} = (1/n) ω_n^{-kj}, permitindo calcular a DFT inversa com o mesmo algoritmo ITERATIVE-FFT usando ω_n^{-1} e dividindo por n."
        },
        {
          letter: "D",
          text: "O circuito paralelo de FFT possui profundidade Θ(n) porque as borboletas de um mesmo estágio dependem sequencialmente umas das outras.",
          isCorrect: false,
          explanation:
            "Incorreta. As n/2 borboletas de cada estágio são completamente disjuntas e operam sobre pares independentes de fios, executando em paralelo em tempo Θ(1)."
        }
      ]
    },
    {
      id: "q14-5",
      type: "Múltipla Escolha",
      reference: "Cap. 31, Seções 31.1 e 31.2 (pp. 753–757)",
      question:
        "Considere o Algoritmo de Euclides EUCLID(a, b) para calcular mdc(a, b) com a > b ≥ 1. O que estabelece o Teorema de Lamé (Teorema 31.11) a respeito do número de divisões e de seu pior caso?",
      options: [
        {
          letter: "A",
          text: "O número de divisões é ilimitado quando a e b são primos entre si, exigindo Θ(b) subtrações sucessivas.",
          isCorrect: false,
          explanation:
            "Incorreta. EUCLID usa o resto da divisão modular e converge sempre em tempo logarítmico O(lg b)."
        },
        {
          letter: "B",
          text: "Se EUCLID(a, b) efetua k chamadas recursivas, então a ≥ F_{k+2} e b ≥ F_{k+1}; o pior caso absoluto ocorre para números consecutivos de Fibonacci (mdc(F_{k+2}, F_{k+1})), limitando o número de divisões a no máximo 5 vezes o número de dígitos decimais de b (k ≤ 5 log₁₀ b + 1).",
          isCorrect: true,
          explanation:
            "Correta! Este é o Teorema de Lamé (Teorema 31.11, p. 756). Quando os quocientes em todas as etapas são 1 (o que ocorre exatamente com números de Fibonacci consecutivos), a convergência é a mais lenta possível, garantindo que k ≤ log_φ b + 1 ≈ 4,785 log₁₀ b + 1 ≤ 5 log₁₀ b + 1."
        },
        {
          letter: "C",
          text: "O número de divisões é estritamente constante igual a ⌊lg b⌋ para qualquer par de inteiros positivos.",
          isCorrect: false,
          explanation:
            "Incorreta. O número de divisões varia conforme a estrutura aritmética de a e b, sendo no máximo proporcional a lg b."
        },
        {
          letter: "D",
          text: "O Teorema de Lamé afirma que o pior caso ocorre para potências de 2 (a = 2^k, b = 2^{k-1}), necessitando de 2^k divisões.",
          isCorrect: false,
          explanation:
            "Incorreta. Para potências de 2, EUCLID(2^k, 2^{k-1}) termina em apenas 1 divisão (pois 2^k mod 2^{k-1} = 0)."
        }
      ]
    },
    {
      id: "q14-6",
      type: "Múltipla Escolha",
      reference: "Cap. 31, Seção 31.2 (pp. 757–760)",
      question:
        "O algoritmo EXTENDED-EUCLID(a, b) calcula d = mdc(a, b) e inteiros x, y tais que ax + by = d. Como ele é utilizado para calcular o inverso multiplicativo de um número a módulo n?",
      options: [
        {
          letter: "A",
          text: "Executa EXTENDED-EUCLID(a, n); se d = 1, o inverso multiplicativo de a módulo n é x mod n (ou seja, (x % n + n) % n); se d ≠ 1, o inverso multiplicativo não existe em ℤ_n.",
          isCorrect: true,
          explanation:
            "Correta! Pela Seção 31.2 (p. 758) e Corolário 31.26, a x + n y = 1 implica a x ≡ 1 (mod n). Portanto, x é o inverso multiplicativo modular de a. Se d = mdc(a, n) > 1, nenhum múltiplo de a pode ser côngruo a 1 módulo n, logo o inverso inexiste."
        },
        {
          letter: "B",
          text: "O inverso multiplicativo modular existe para qualquer par de inteiros e é dado sempre por y mod n, independentemente de d.",
          isCorrect: false,
          explanation:
            "Incorreta. O inverso só existe se mdc(a, n) = 1, e corresponde ao coeficiente x (associado a a), não a y (associado a n)."
        },
        {
          letter: "C",
          text: "O algoritmo calcula d = ax - by e requer tempo exponencial O(2^β) para inteiros de β bits.",
          isCorrect: false,
          explanation:
            "Incorreta. EXTENDED-EUCLID calcula d = ax + by e é executado em tempo polinomial O(lg(min(a, b))) operações aritméticas."
        },
        {
          letter: "D",
          text: "Se d = 1, o inverso é garantidamente igual a a^(n-1) mod n apenas se n for um número de Carmichael.",
          isCorrect: false,
          explanation:
            "Incorreta. Pelo Teorema de Euler, o inverso é a^{ϕ(n)-1} mod n para qualquer n coprimo com a; números de Carmichael são compostos que violam o teste de Fermat."
        }
      ]
    },
    {
      id: "q14-7",
      type: "Múltipla Escolha",
      reference: "Cap. 31, Seção 31.4 (pp. 769–772)",
      question:
        "A respeito da equação linear modular ax ≡ b (mod n), qual das afirmações abaixo expressa com exatidão o critério de solubilidade e a estrutura das soluções (Teorema 31.20)?",
      options: [
        {
          letter: "A",
          text: "A equação sempre tem exatamente uma solução se b > a, e nenhuma solução se b < a.",
          isCorrect: false,
          explanation:
            "Incorreta. A solubilidade depende exclusivamente da relação de divisibilidade entre d = mdc(a, n) e b."
        },
        {
          letter: "B",
          text: "A equação ax ≡ b (mod n) admite solução se e somente se d = mdc(a, n) divide b; se d divide b, existem exatamente d soluções distintas em ℤ_n, dadas por x_i = (x_0 + i · (n/d)) mod n para i = 0, 1, ..., d - 1, onde x_0 = x' (b/d) mod n.",
          isCorrect: true,
          explanation:
            "Correta! Este é exatamente o enunciado e construção do Teorema 31.20 (p. 769). Se d | b, a solução particular x_0 é amplificada a partir da combinação de Bézout e gera um conjunto de d soluções espaçadas uniformemente por saltos de n/d."
        },
        {
          letter: "C",
          text: "A equação possui infinitas soluções distintas em ℤ_n para qualquer escolha de a e b.",
          isCorrect: false,
          explanation:
            "Incorreta. Em ℤ_n há no máximo n elementos no total, e a equação possui no máximo d ≤ n soluções distintas módulo n."
        },
        {
          letter: "D",
          text: "A equação possui solução apenas se a e n forem ambos números primos.",
          isCorrect: false,
          explanation:
            "Incorreta. Basta que d = mdc(a, n) divida b (por exemplo, 2x ≡ 4 mod 6 tem d = mdc(2,6) = 2, que divide 4; soluções 2 e 5)."
        }
      ]
    },
    {
      id: "q14-8",
      type: "Múltipla Escolha",
      reference: "Cap. 31, Seção 31.5 (pp. 772–775)",
      question:
        "No Teorema Chinês do Resto (CRT, Teorema 31.27), com sistema de congruências x ≡ a_i (mod n_i) para i = 1 .. k com módulos n_i coprimos dois a dois e m = ∏ n_i, como a solução única módulo m é reconstruída?",
      options: [
        {
          letter: "A",
          text: "x = ∏_{i=1}^k a_i mod m, somando 1 caso o produto seja par.",
          isCorrect: false,
          explanation:
            "Incorreta. A solução do CRT não é o produto das soluções parciais."
        },
        {
          letter: "B",
          text: "Para cada i, define-se M_i = m / n_i e c_i = M_i · (M_i^{-1} mod n_i); então a solução única módulo m é x = (∑_{i=1}^k a_i c_i) mod m, pois c_i ≡ 1 (mod n_i) e c_i ≡ 0 (mod n_j) para todo j ≠ i.",
          isCorrect: true,
          explanation:
            "Correta! Conforme demonstrado na Seção 31.5 (pp. 773–774), os fatores c_i funcionam como uma base ortogonal: ao avaliar x mod n_j, todos os termos com i ≠ j anulam-se (já que n_j | M_i), restando a_j · c_j ≡ a_j · 1 = a_j (mod n_j)."
        },
        {
          letter: "C",
          text: "O CRT exige que todos os módulos n_i sejam primos idênticos entre si (n_1 = n_2 = ... = n_k).",
          isCorrect: false,
          explanation:
            "Incorreta. O CRT exige estritamente que os módulos sejam primos entre si dois a dois: mdc(n_i, n_j) = 1 para todo i ≠ j."
        },
        {
          letter: "D",
          text: "A solução é sempre indeterminada caso k > 2, necessitando de busca exaustiva exponencial.",
          isCorrect: false,
          explanation:
            "Incorreta. A solução é única módulo m para qualquer número finito k de módulos coprimos e calculável em tempo polinomial."
        }
      ]
    },
    {
      id: "q14-9",
      type: "Múltipla Escolha",
      reference: "Cap. 31, Seção 31.7 (pp. 781–786)",
      question:
        "No Criptossistema de Chave Pública RSA, por que a relação ed ≡ 1 (mod ϕ(n)) com n = pq e ϕ(n) = (p - 1)(q - 1) garante que a decifragem C^d mod n recupere a mensagem original M para todo M ∈ ℤ_n?",
      options: [
        {
          letter: "A",
          text: "Porque ed = 1 + k(p-1)(q-1); pelo Pequeno Teorema de Fermat e pelo CRT, temos M^{ed} ≡ M (mod p) e M^{ed} ≡ M (mod q) tanto quando mdc(M, p) = 1 quanto quando p divide M; logo M^{ed} ≡ M (mod pq) para qualquer M.",
          isCorrect: true,
          explanation:
            "Correta! Esta é a demonstração formal do Teorema 31.36 (pp. 783–784). Mesmo no caso em que p divide M, temos M ≡ 0 mod p e M^{ed} ≡ 0 mod p, preservando a igualdade; o Teorema Chinês do Resto então garante a congruência módulo n = pq."
        },
        {
          letter: "B",
          text: "Porque ed = 1 em ℤ, o que significa que e e d são obrigatoriamente iguais a 1.",
          isCorrect: false,
          explanation:
            "Incorreta. A igualdade ed ≡ 1 ocorre módulo ϕ(n), e não no anel dos inteiros ℤ."
        },
        {
          letter: "C",
          text: "Porque o RSA proíbe a criptografia de qualquer mensagem M que não seja um número primo menor que p.",
          isCorrect: false,
          explanation:
            "Incorreta. O RSA cifra qualquer número inteiro M ∈ ℤ_n, mesmo compostos ou múltiplos de p ou q."
        },
        {
          letter: "D",
          text: "A decifragem funciona porque a função ϕ(n) é mantida pública junto com a chave pública P = (e, n).",
          isCorrect: false,
          explanation:
            "Incorreta. ϕ(n) DEVE ser mantida em segredo absoluto (ou destruída); se um invasor descobrir ϕ(n), ele calcula d = e^{-1} mod ϕ(n) em milissegundos e quebra o sistema!"
        }
      ]
    },
    {
      id: "q14-10",
      type: "Múltipla Escolha",
      reference: "Cap. 31, Seções 31.8 e 31.9 (pp. 786–795)",
      question:
        "Sobre o teste de primalidade probabilístico de Miller-Rabin e a heurística de fatoração Pollard-Rho, qual das alternativas é CORRETA?",
      options: [
        {
          letter: "A",
          text: "O teste de Miller-Rabin pode errar declarando que um número primo é composto, mas nunca declara que um composto é primo.",
          isCorrect: false,
          explanation:
            "Incorreta. Se n é primo, Miller-Rabin SEMPRE retorna PRIME. O erro possível (com probabilidade ≤ 2^{-s}) é declarar que um número COMPOSTO é primo caso nenhuma testemunha seja sorteada."
        },
        {
          letter: "B",
          text: "O teste de Miller-Rabin detecta números compostos mesmo entre os números de Carmichael porque busca raízes quadradas não triviais de 1 mod n (x² ≡ 1 mod n com x ≢ ±1 mod n); para s iterações independentes, a probabilidade de um composto ser declarado primo é no máximo 2^{-s}; e Pollard-Rho fatora n em tempo esperado O(p^{1/2}) passos aritméticos usando o Paradoxo do Aniversário.",
          isCorrect: true,
          explanation:
            "Correta! Pelo Teorema 31.34, 31.38 e 31.39 (pp. 787–790), o teste de Miller-Rabin neutraliza os números de Carmichael detectando raízes não triviais de 1, garantindo erro ≤ 2^{-s}. Já o Pollard-Rho (pp. 790–795) explora o paradoxo do aniversário para encontrar colisões da sequência módulo o divisor primo p em O(√p) passos."
        },
        {
          letter: "C",
          text: "Pollard-Rho é um algoritmo de tempo determinístico estritamente linear O(n) que não utiliza o cálculo de MDC.",
          isCorrect: false,
          explanation:
            "Incorreta. Pollard-Rho é uma heurística probabilística que calcula mdc(|x_i - y|, n) e possui tempo esperado O(√p) ≤ O(n^{1/4}), muito mais rápido que O(n)."
        },
        {
          letter: "D",
          text: "Números de Carmichael possuem apenas raízes quadradas triviais de 1, tornando-os indistinguíveis de números primos por qualquer algoritmo em tempo polinomial.",
          isCorrect: false,
          explanation:
            "Incorreta. Por não serem potências de primos, os números de Carmichael sempre possuem raízes quadradas não triviais de 1 e são detectados com facilidade por Miller-Rabin."
        }
      ]
    }
  ];

/* ========================================================================
     SEÇÃO 4: EXERCÍCIOS E PROBLEMAS CANÔNICOS RESOLVIDOS (CAPS. 30 E 31)
     ======================================================================== */
  const exercicios = [
    {
      id: "ex14-1",
      code: "EXERCÍCIO 01 • REGRA DE HORNER E DERIVADAS POLINOMIAIS",
      reference: "Exercício 30.1-2 (p. 730)",
      title: "Avaliação Simultânea de um Polinômio A(x) e de Sua Primeira Derivada A'(x) em Tempo Linear Θ(n)",
      prompt: `
        <p><strong>(Exercício 30.1-2, p. 730)</strong> Seja $A(x) = \\sum_{j=0}^{n-1} a_j x^j$ um polinômio com limite de grau $n$ na representação por coeficientes $a = (a_0, a_1, \\dots, a_{n-1})$.</p>
        <ol>
          <li>Escreva um algoritmo de tempo linear $\\Theta(n)$ baseado na <strong>Regra de Horner</strong> que avalie simultaneamente o polinômio $A(x_0)$ e sua primeira derivada $A'(x_0)$ em um ponto arbitrário $x_0 \\in \\mathbb{F}$.</li>
          <li>Mostre que seu algoritmo realiza no máximo $2n$ multiplicações e $2n$ adições, mantendo consumo de memória auxiliar $\\Theta(1)$.</li>
        </ol>
      `,
      placeholder:
        "Aplique a regra do produto à fatoração de Horner de A(x). Se A(x) = a_0 + x · P(x), então A'(x) = P(x) + x · P'(x)...",
      solution: `
        <h4>1. Dedução Matemática da Regra de Horner para a Derivada</h4>
        <p>A Regra de Horner expressa $A(x)$ como uma cadeia de multiplicações:</p>
        $$A(x) = a_0 + x \\Big(a_1 + x \\big(a_2 + \\dots + x (a_{n-2} + x a_{n-1}) \\dots \\big)\\Big).$$
        <p>Definindo a sequência de polinômios intermediários $P_k(x)$ para $k = n-1, n-2, \\dots, 0$:</p>
        $$\\begin{cases} P_{n-1}(x) = a_{n-1} \\\\ P_k(x) = a_k + x \\cdot P_{k+1}(x), & \\text{para } k = n-2, n-3, \\dots, 0. \\end{cases}$$
        <p>Claramente, $A(x) = P_0(x)$. Tomando a derivada em relação a $x$ de cada equação da recorrência usando a regra do produto ($[x \\cdot P_{k+1}(x)]' = P_{k+1}(x) + x \\cdot P'_{k+1}(x)$):</p>
        $$\\begin{cases} P'_{n-1}(x) = 0 \\\\ P'_k(x) = P_{k+1}(x) + x \\cdot P'_{k+1}(x), & \\text{para } k = n-2, n-3, \\dots, 0. \\end{cases}$$
        <p>No final, $A'(x_0) = P'_0(x_0)$! Assim, podemos atualizar simultaneamente o valor acumulado do polinômio $v$ e de sua derivada $v'$ em um único laço descendente de $n-1$ iterações.</p>

        <h4>2. Pseudocódigo em $\\Theta(n)$</h4>
        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header"><span class="proc-name">HORNER-WITH-DERIVATIVE(a, x₀)</span></div>
          <div class="code-line"><span class="line-num">1</span><span class="line-content">n = a.length</span></div>
          <div class="code-line"><span class="line-num">2</span><span class="line-content">val = a[n - 1]</span></div>
          <div class="code-line"><span class="line-num">3</span><span class="line-content">der = 0</span></div>
          <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">para</span> k = n - 2 <span class="kw">decrescendo até</span> 0</span></div>
          <div class="code-line"><span class="line-num">5</span><span class="line-content">    der = val + x₀ · der</span></div>
          <div class="code-line"><span class="line-num">6</span><span class="line-content">    val = a[k] + x₀ · val</span></div>
          <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">retorne</span> (val, der)</span></div>
        </div>

        <h4>3. Análise de Complexidade</h4>
        <ul>
          <li><strong>Número de Operações:</strong> O laço executa exatamente $n-1$ iterações. Em cada iteração ocorrem exatamente $2$ multiplicações e $2$ adições. O total de operações aritméticas é de $2(n-1)$ multiplicações e $2(n-1)$ adições, totalizando rigorosamente <strong>$\\Theta(n)$</strong>.</li>
          <li><strong>Espaço:</strong> Utiliza apenas duas variáveis acumuladoras escalares (<code>val</code> e <code>der</code>), consumindo espaço adicional <strong>$\\Theta(1)$</strong>. $\\blacksquare$</li>
        </ul>
      `
    },
    {
      id: "ex14-2",
      code: "EXERCÍCIO 02 • LEMA DO SOMATÓRIO E ORTOGONALIDADE DA DFT",
      reference: "Exercício 30.2-1 e Lema 30.5 (pp. 734 e 738)",
      title: "Demonstração Rigorosa do Lema do Somatório e Ortogonalidade das Colunas da Matriz de Vandermonde Vn",
      prompt: `
        <p><strong>(Exercício 30.2-1 e Lema 30.5, pp. 734, 738)</strong> As raízes $n$-ésimas da unidade são dadas por $\\omega_n^k = e^{2\\pi i k / n}$ para $k = 0, 1, \\dots, n - 1$.</p>
        <ol>
          <li>Demonstre formalmente o <strong>Lema do Somatório (Lema 30.5)</strong>: para qualquer inteiro $n \\ge 1$ e qualquer inteiro $k$ não divisível por $n$, $\\sum_{j=0}^{n-1} (\\omega_n^k)^j = 0$.</li>
          <li>Considere as $n$ colunas da matriz de Vandermonde $V_n$, onde a coluna $k$ é o vetor $v_k = \\big(1, \\, \\omega_n^k, \\, \\omega_n^{2k}, \\, \\dots, \\, \\omega_n^{(n-1)k}\\big)^{\\text{T}}$. Defina o produto interno hermitiano padrão em $\\mathbb{C}^n$ por $\\langle u, v \\rangle = \\sum_{j=0}^{n-1} u_j \\overline{v_j}$, onde $\\overline{z}$ é o conjugado complexo de $z$. Mostre que as colunas de $V_n$ são <strong>mutuamente ortogonais</strong> e deduza a fórmula da matriz inversa $V_n^{-1}$.</li>
        </ol>
      `,
      placeholder:
        "Use a soma da progressão geométrica finita ∑_{j=0}^{n-1} q^j = (q^n - 1)/(q - 1) com q = ω_n^k. Para a ortogonalidade, observe que o conjugado de ω_n^{jk'} é ω_n^{-jk'}...",
      solution: `
        <h4>1. Demonstração do Lema do Somatório</h4>
        <p>Seja $q = \\omega_n^k$. Como $k$ não é divisível por $n$, temos $k \\not\\equiv 0 \\pmod n$, o que implica $\\omega_n^k \\neq 1$ (ou seja, $q \\neq 1$). A soma dos $n$ primeiros termos da progressão geométrica de razão $q$ é:</p>
        $$S = \\sum_{j=0}^{n-1} q^j = 1 + q + q^2 + \\dots + q^{n-1} = \\frac{q^n - 1}{q - 1}.$$
        <p>Substituindo $q = \\omega_n^k$:</p>
        $$q^n = \\big(\\omega_n^k\\big)^n = \\big(\\omega_n^n\\big)^k = (1)^k = 1.$$
        <p>Portanto:</p>
        $$S = \\frac{1 - 1}{\\omega_n^k - 1} = \\frac{0}{\\omega_n^k - 1} = \\mathbf{0}. \\quad \\blacksquare$$

        <h4>2. Ortogonalidade das Colunas de $V_n$ e Inversão Matricial</h4>
        <p>Para duas colunas $k$ e $k'$ de $V_n$ ($0 \\le k, k' < n$), o produto interno hermitiano é:</p>
        $$\\langle v_k, v_{k'} \\rangle = \\sum_{j=0}^{n-1} \\big(V_n\\big)_{j, k} \\cdot \\overline{\\big(V_n\\big)_{j, k'}} = \\sum_{j=0}^{n-1} \\omega_n^{j k} \\cdot \\overline{\\omega_n^{j k'}}.$$
        <p>Como $|\\omega_n| = 1$, o conjugado complexo é seu inverso multiplicativo: $\\overline{e^{i\\theta}} = e^{-i\\theta} \\implies \\overline{\\omega_n^{j k'}} = \\omega_n^{-j k'}$. Assim:</p>
        $$\\langle v_k, v_{k'} \\rangle = \\sum_{j=0}^{n-1} \\omega_n^{j(k - k')} = \\sum_{j=0}^{n-1} \\big(\\omega_n^{k - k'}\\big)^j.$$
        <ul>
          <li><strong>Se $k = k'$:</strong> $\\omega_n^0 = 1$, e a soma resulta em $\\sum_{j=0}^{n-1} 1 = \\mathbf{n}$. Portanto, $\\|v_k\\|^2 = n$.</li>
          <li><strong>Se $k \\neq k'$:</strong> Como $-(n-1) \\le k - k' \\le n-1$ e $k - k' \\neq 0$, o expoente $k - k'$ não é divisível por $n$. Pelo Lema do Somatório demonstrado acima, a soma vale rigorosamente $\\mathbf{0}$!</li>
        </ul>
        <p>Portanto, $\\langle v_k, v_{k'} \\rangle = n \\cdot \\delta_{k, k'}$, provando que as colunas são <strong>mutuamente ortogonais</strong>. Em linguagem matricial:</p>
        $$V_n^* V_n = n \\cdot I_n \\implies \\mathbf{V_n^{-1} = \\frac{1}{n} V_n^*},$$
        <p>onde $V_n^*$ é a transposta conjugada de $V_n$, cujo elemento $(j, k)$ é $\\frac{1}{n} \\omega_n^{-kj}$. Isso prova o Teorema 30.7! $\\blacksquare$</p>
      `
    },
    {
      id: "ex14-3",
      code: "EXERCÍCIO 03 • MULTIPLICAÇÃO DE POLINÔMIOS VIA FFT PASSO A PASSO",
      reference: "Exercício 30.2-4 (p. 738)",
      title: "Rastreamento Completo da Multiplicação de A(x) = x + 1 e B(x) = 2x - 1 Usando as Raízes Quartas da Unidade",
      prompt: `
        <p><strong>(Exercício 30.2-4, p. 738)</strong> Utilize o pipeline de multiplicação de polinômios via FFT em $4$ pontos para computar o produto de $A(x) = x + 1$ e $B(x) = 2x - 1$:</p>
        <ol>
          <li>Preencha os vetores de coeficientes com zeros até $n = 4$ e liste as $4$ raízes quartas da unidade $\\{\\omega_4^0, \\omega_4^1, \\omega_4^2, \\omega_4^3\\}$.</li>
          <li>Calcule $\\text{DFT}_4(a)$ e $\\text{DFT}_4(b)$ avaliando os polinômios nessas $4$ raízes.</li>
          <li>Execute a multiplicação ponto a ponto para obter os pares ponto-valor de $C(x) = A(x)B(x)$.</li>
          <li>Aplique a Transformada Inversa $\\text{DFT}_4^{-1}$ para recuperar o vetor de coeficientes $c = (c_0, c_1, c_2, c_3)$ e verifique o resultado por multiplicação direta.</li>
        </ol>
      `,
      placeholder:
        "Grau de A e B é 1, logo grau do produto é 2. Escolha n = 4. Coeficientes padded: a = (1, 1, 0, 0), b = (-1, 2, 0, 0). Raízes quartas: 1, i, -1, -i...",
      solution: `
        <h4>1. Vetores com Preenchimento de Zeros e Raízes Quartas da Unidade</h4>
        <p>Como $\\text{grau}(A) = 1$ e $\\text{grau}(B) = 1$, o produto $C(x) = A(x)B(x)$ possui grau $2$, exigindo limite de grau $n = 4$ (menor potência de $2$ maior que $2$).</p>
        <ul>
          <li>$A(x) = 1 + 1x + 0x^2 + 0x^3 \\implies a = (1, 1, 0, 0)^{\\text{T}}$.</li>
          <li>$B(x) = -1 + 2x + 0x^2 + 0x^3 \\implies b = (-1, 2, 0, 0)^{\\text{T}}$.</li>
          <li>As raízes quartas da unidade com $\\omega_4 = e^{2\\pi i / 4} = i$ são:
            $$\\omega_4^0 = 1, \\quad \\omega_4^1 = i, \\quad \\omega_4^2 = -1, \\quad \\omega_4^3 = -i.$$
          </li>
        </ul>

        <h4>2. Avaliação: Cálculo de $\\text{DFT}_4(a)$ e $\\text{DFT}_4(b)$</h4>
        <ul>
          <li>Para $A(x) = 1 + x$:
            $$\\begin{aligned}
              A(1) &= 1 + 1 = \\mathbf{2} \\\\
              A(i) &= 1 + i = \\mathbf{1 + i} \\\\
              A(-1) &= 1 - 1 = \\mathbf{0} \\\\
              A(-i) &= 1 - i = \\mathbf{1 - i}
            \\end{aligned} \\implies \\text{DFT}_4(a) = \\big(2, \\, 1+i, \\, 0, \\, 1-i\\big)^{\\text{T}}.$$
          </li>
          <li>Para $B(x) = -1 + 2x$:
            $$\\begin{aligned}
              B(1) &= -1 + 2(1) = \\mathbf{1} \\\\
              B(i) &= -1 + 2i = \\mathbf{-1 + 2i} \\\\
              B(-1) &= -1 + 2(-1) = \\mathbf{-3} \\\\
              B(-i) &= -1 - 2i = \\mathbf{-1 - 2i}
            \\end{aligned} \\implies \\text{DFT}_4(b) = \\big(1, \\, -1+2i, \\, -3, \\, -1-2i\\big)^{\\text{T}}.$$
          </li>
        </ul>

        <h4>3. Multiplicação Ponto a Ponto: $C(\\omega_4^k) = A(\\omega_4^k) \\cdot B(\\omega_4^k)$</h4>
        $$\\begin{aligned}
          y_0 &= 2 \\cdot 1 = \\mathbf{2} \\\\
          y_1 &= (1 + i)(-1 + 2i) = -1 + 2i - i + 2i^2 = -1 + i - 2 = \\mathbf{-3 + i} \\\\
          y_2 &= 0 \\cdot (-3) = \\mathbf{0} \\\\
          y_3 &= (1 - i)(-1 - 2i) = -1 - 2i + i + 2i^2 = -1 - i - 2 = \\mathbf{-3 - i}
        \\end{aligned}$$
        <p>Assim, o vetor de valores de ponto de $C$ é $y = \\big(2, \\, -3+i, \\, 0, \\, -3-i\\big)^{\\text{T}}$.</p>

        <h4>4. Interpolação: Aplicação de $\\text{DFT}_4^{-1}$</h4>
        <p>Os coeficientes $c_j = \\frac{1}{4} \\sum_{k=0}^3 y_k \\omega_4^{-jk} = \\frac{1}{4} \\sum_{k=0}^3 y_k (-i)^{jk}$:</p>
        <ul>
          <li><strong>$c_0$ (j = 0):</strong> $\\frac{1}{4} [2 + (-3+i) + 0 + (-3-i)] = \\frac{1}{4} [2 - 6] = \\frac{-4}{4} = \\mathbf{-1}$.</li>
          <li><strong>$c_1$ (j = 1):</strong> $\\frac{1}{4} [2(-i)^0 + (-3+i)(-i)^1 + 0(-i)^2 + (-3-i)(-i)^3]$:
            $$(-3+i)(-i) = 3i - i^2 = 1 + 3i; \\quad (-3-i)(i) = -3i - i^2 = 1 - 3i.$$
            Soma: $2 + (1 + 3i) + (1 - 3i) = 4 \\implies c_1 = \\frac{4}{4} = \\mathbf{1}$.</li>
          <li><strong>$c_2$ (j = 2):</strong> $\\frac{1}{4} [2(-1)^0 + (-3+i)(-1)^1 + 0 + (-3-i)(-1)^3]$:
            $$2 - (-3+i) - (-3-i) = 2 + 3 - i + 3 + i = 8 \\implies c_2 = \\frac{8}{4} = \\mathbf{2}$.</li>
          <li><strong>$c_3$ (j = 3):</strong> $\\frac{1}{4} [2(i)^0 + (-3+i)(i) + 0 + (-3-i)(-i)]$:
            $$(-3+i)i = -3i - 1; \\quad (-3-i)(-i) = 3i - 1.$$
            Soma: $2 + (-1 - 3i) + (-1 + 3i) = 0 \\implies c_3 = \\mathbf{0}$.</li>
        </ul>
        <p><strong>Polinômio Produto Final:</strong> $C(x) = c_0 + c_1 x + c_2 x^2 + c_3 x^3 = \\mathbf{-1 + x + 2x^2}$.</p>
        <p><em>Verificação Algébrica Direta:</em> $(x + 1)(2x - 1) = 2x^2 - x + 2x - 1 = 2x^2 + x - 1$. Idêntico! $\\blacksquare$</p>
      `
    },
    {
      id: "ex14-4",
      code: "EXERCÍCIO 04 • RASTREAMENTO DE ITERATIVE-FFT E BIT-REVERSAL",
      reference: "Exercício 30.3-1 (p. 744)",
      title: "Rastreamento Passo a Passo de ITERATIVE-FFT para o Vetor a = (0, 2, 3, -1, 4, 5, 7, 9) com n = 8",
      prompt: `
        <p><strong>(Exercício 30.3-1, p. 744)</strong> Execute o procedimento <code>ITERATIVE-FFT(a)</code> passo a passo para calcular a DFT do vetor de entrada:</p>
        $$a = (0, 2, 3, -1, 4, 5, 7, 9).$$
        <ol>
          <li>Mostre o arranjo $A$ resultante após a invocação inicial de <code>BIT-REVERSE-COPY(a, A)</code>.</li>
          <li>Para cada estágio $s = 1, 2, 3$, liste o valor de $m = 2^s$, a raiz principal $\\omega_m$, os fatores de giro utilizados e o conteúdo completo do arranjo $A$ ao final do estágio.</li>
        </ol>
      `,
      placeholder:
        "Ordem bit-reversal para n=8: rev(0)=0, rev(1)=4, rev(2)=2, rev(3)=6, rev(4)=1, rev(5)=5, rev(6)=3, rev(7)=7. Estágio 1 combina pares adjacentes...",
      solution: `
        <h4>1. Permutação Bit-Reversal: <code>BIT-REVERSE-COPY(a, A)</code></h4>
        <p>Para $n = 8$ ($3$ bits), o mapeamento de índices $k \\to \\text{rev}(k)$ com $a = (0, 2, 3, -1, 4, 5, 7, 9)$ é:</p>
        <ul>
          <li>$A[\\text{rev}(0)] = A[0] = a_0 = \\mathbf{0}$</li>
          <li>$A[\\text{rev}(1)] = A[4] = a_1 = \\mathbf{2}$</li>
          <li>$A[\\text{rev}(2)] = A[2] = a_2 = \\mathbf{3}$</li>
          <li>$A[\\text{rev}(3)] = A[6] = a_3 = \\mathbf{-1}$</li>
          <li>$A[\\text{rev}(4)] = A[1] = a_4 = \\mathbf{4}$</li>
          <li>$A[\\text{rev}(5)] = A[5] = a_5 = \\mathbf{5}$</li>
          <li>$A[\\text{rev}(6)] = A[3] = a_6 = \\mathbf{7}$</li>
          <li>$A[\\text{rev}(7)] = A[7] = a_7 = \\mathbf{9}$</li>
        </ul>
        <p>Logo, o arranjo inicial $A$ nas folhas da árvore é:</p>
        $$A^{(0)} = \\big[0, \\; 4, \\; 3, \\; 7, \\; 2, \\; 5, \\; -1, \\; 9\\big].$$

        <h4>2. Estágio $s = 1$ ($m = 2^1 = 2$, $\\omega_2 = e^{\\pi i} = -1$)</h4>
        <p>Temos $n/m = 4$ blocos de tamanho $2$. Em cada bloco há $m/2 = 1$ borboleta com $\\omega = \\omega_2^0 = 1$:</p>
        <ul>
          <li>Bloco 0 (índices 0, 1): $u = 0, t = 1 \\cdot 4 = 4 \\implies A[0] = 0 + 4 = \\mathbf{4}, \\; A[1] = 0 - 4 = \\mathbf{-4}$.</li>
          <li>Bloco 1 (índices 2, 3): $u = 3, t = 1 \\cdot 7 = 7 \\implies A[2] = 3 + 7 = \\mathbf{10}, \\; A[3] = 3 - 7 = \\mathbf{-4}$.</li>
          <li>Bloco 2 (índices 4, 5): $u = 2, t = 1 \\cdot 5 = 5 \\implies A[4] = 2 + 5 = \\mathbf{7}, \\; A[5] = 2 - 5 = \\mathbf{-3}$.</li>
          <li>Bloco 3 (índices 6, 7): $u = -1, t = 1 \\cdot 9 = 9 \\implies A[6] = -1 + 9 = \\mathbf{8}, \\; A[7] = -1 - 9 = \\mathbf{-10}$.</li>
        </ul>
        $$A^{(1)} = \\big[4, \\; -4, \\; 10, \\; -4, \\; 7, \\; -3, \\; 8, \\; -10\\big].$$

        <h4>3. Estágio $s = 2$ ($m = 2^2 = 4$, $\\omega_4 = e^{\\pi i / 2} = i$)</h4>
        <p>Temos $n/m = 2$ blocos de tamanho $4$. Cada bloco possui $2$ borboletas ($j=0$ com $\\omega=1$; $j=1$ com $\\omega=i$):</p>
        <ul>
          <li><strong>Bloco 0 (índices 0..3):</strong>
            <ul>
              <li>$j=0$: $u = A[0] = 4, t = 1 \\cdot A[2] = 10 \\implies A[0] = 4 + 10 = \\mathbf{14}, \\; A[2] = 4 - 10 = \\mathbf{-6}$.</li>
              <li>$j=1$: $u = A[1] = -4, t = i \\cdot A[3] = -4i \\implies A[1] = \\mathbf{-4 - 4i}, \\; A[3] = \\mathbf{-4 + 4i}$.</li>
            </ul>
          </li>
          <li><strong>Bloco 1 (índices 4..7):</strong>
            <ul>
              <li>$j=0$: $u = A[4] = 7, t = 1 \\cdot A[6] = 8 \\implies A[4] = 7 + 8 = \\mathbf{15}, \\; A[6] = 7 - 8 = \\mathbf{-1}$.</li>
              <li>$j=1$: $u = A[5] = -3, t = i \\cdot A[7] = -10i \\implies A[5] = \\mathbf{-3 - 10i}, \\; A[7] = \\mathbf{-3 + 10i}$.</li>
            </ul>
          </li>
        </ul>
        $$A^{(2)} = \\big[14, \\; -4-4i, \\; -6, \\; -4+4i, \\; 15, \\; -3-10i, \\; -1, \\; -3+10i\\big].$$

        <h4>4. Estágio $s = 3$ ($m = 2^3 = 8$, $\\omega_8 = \\frac{\\sqrt{2}}{2} + i \\frac{\\sqrt{2}}{2}$)</h4>
        <p>Temos $1$ único bloco de tamanho $8$ com $4$ borboletas ($j = 0, 1, 2, 3$):</p>
        <ul>
          <li>$j=0$ ($\\omega = 1$): $u = A[0] = 14, t = 1 \\cdot A[4] = 15 \\implies A[0] = 14 + 15 = \\mathbf{29}, \\; A[4] = 14 - 15 = \\mathbf{-1}$.</li>
          <li>$j=1$ ($\\omega = \\omega_8 = \\frac{\\sqrt{2}}{2}(1+i)$): $u = A[1] = -4 - 4i$.
            $$t = \\omega_8 \\cdot A[5] = \\frac{\\sqrt{2}}{2}(1+i)(-3-10i) = \\frac{\\sqrt{2}}{2}[(-3 + 10) + i(-10 - 3)] = \\frac{\\sqrt{2}}{2}(7 - 13i) \\approx 4,95 - 9,19i.$$
            $$A[1] = (-4 - 4i) + (4,95 - 9,19i) = \\mathbf{0,95 - 13,19i}, \\quad A[5] = (-4 - 4i) - (4,95 - 9,19i) = \\mathbf{-8,95 + 5,19i}.$$
          </li>
          <li>$j=2$ ($\\omega = \\omega_8^2 = i$): $u = A[2] = -6, t = i \\cdot A[6] = -i \\implies A[2] = \\mathbf{-6 - i}, \\; A[6] = \\mathbf{-6 + i}$.</li>
          <li>$j=3$ ($\\omega = \\omega_8^3 = \\frac{\\sqrt{2}}{2}(-1+i)$): $u = A[3] = -4 + 4i$.
            $$t = \\omega_8^3 \\cdot A[7] = \\frac{\\sqrt{2}}{2}(-1+i)(-3+10i) = \\frac{\\sqrt{2}}{2}[(3 - 10) + i(-3 - 10)] = \\frac{\\sqrt{2}}{2}(-7 - 13i) \\approx -4,95 - 9,19i.$$
            $$A[3] = (-4 + 4i) + (-4,95 - 9,19i) = \\mathbf{-8,95 - 5,19i}, \\quad A[7] = (-4 + 4i) - (-4,95 - 9,19i) = \\mathbf{0,95 + 13,19i}.$$
          </li>
        </ul>
        <p><strong>Vetor Final $y = \\text{DFT}_8(a)$:</strong></p>
        $$y = \\Big(29, \\; 0,95 - 13,19i, \\; -6 - i, \\; -8,95 - 5,19i, \\; -1, \\; -8,95 + 5,19i, \\; -6 + i, \\; 0,95 + 13,19i\\Big)^{\\text{T}}. \\quad \\blacksquare$$
      `
    },
    {
      id: "ex14-5",
      code: "EXERCÍCIO 05 • EXTENDED-EUCLID E COEFICIENTES DE BÉZOUT",
      reference: "Exercício 31.2-4 (p. 756)",
      title: "Rastreamento Completo de EXTENDED-EUCLID(899, 493) e Determinação da Combinação Linear de Bézout",
      prompt: `
        <p><strong>(Exercício 31.2-4, p. 756)</strong> Execute o procedimento <code>EXTENDED-EUCLID(899, 493)</code> detalhadamente:</p>
        <ol>
          <li>Apresente a sequência de chamadas recursivas, incluindo os quocientes $q = \\lfloor a / b \\rfloor$ e os restos $r = a \\bmod b$.</li>
          <li>Exiba a fase de desempilhamento e reconstrução dos coeficientes $(d, x, y)$ tais que $899x + 493y = d$.</li>
          <li>Verifique formalmente que $d = \\text{mdc}(899, 493) = 29$.</li>
        </ol>
      `,
      placeholder:
        "Divisões: 899 = 1·493 + 406; 493 = 1·406 + 87; 406 = 4·87 + 58; 87 = 1·58 + 29; 58 = 2·29 + 0. Desempilhe aplicando x = y' e y = x' - q·y'...",
      solution: `
        <h4>1. Sequência de Divisões Euclidianas (Fase de Ida)</h4>
        <p>Aplicamos repetidamente $a = q \\cdot b + r$ com $r = a \\bmod b$:</p>
        $$\\begin{aligned}
          \\text{Passo 1:} & \\quad 899 = 1 \\cdot 493 + 406 && (q_1 = 1, \\, r_1 = 406) \\\\
          \\text{Passo 2:} & \\quad 493 = 1 \\cdot 406 + 87  && (q_2 = 1, \\, r_2 = 87) \\\\
          \\text{Passo 3:} & \\quad 406 = 4 \\cdot 87 + 58   && (q_3 = 4, \\, r_3 = 58) \\\\
          \\text{Passo 4:} & \\quad 87 = 1 \\cdot 58 + 29    && (q_4 = 1, \\, r_4 = 29) \\\\
          \\text{Passo 5:} & \\quad 58 = 2 \\cdot 29 + 0     && (q_5 = 2, \\, r_5 = 0) \\\\
          \\text{Passo 6:} & \\quad \\text{Chamada base: } \\text{EXTENDED-EUCLID}(29, 0).
        \\end{aligned}$$

        <h4>2. Desempilhamento e Reconstrução de Bézout (Fase de Volta)</h4>
        <p>A relação de retorno da linha 4 de <code>EXTENDED-EUCLID</code> é: $x = y'$ e $y = x' - q \\cdot y'$:</p>
        <ul>
          <li><strong>Caso Base $(29, 0)$:</strong> Retorna $(d, x, y) = \\mathbf{(29, 1, 0)}$.</li>
          <li><strong>Passo 5 $(58, 29)$ com $q_5 = 2$:</strong>
            $$x = 0, \\quad y = 1 - 2(0) = 1 \\implies \\mathbf{(29, 0, 1)} \\quad [58(0) + 29(1) = 29].$$
          </li>
          <li><strong>Passo 4 $(87, 58)$ com $q_4 = 1$:</strong>
            $$x = 1, \\quad y = 0 - 1(1) = -1 \\implies \\mathbf{(29, 1, -1)} \\quad [87(1) + 58(-1) = 29].$$
          </li>
          <li><strong>Passo 3 $(406, 87)$ com $q_3 = 4$:</strong>
            $$x = -1, \\quad y = 1 - 4(-1) = 5 \\implies \\mathbf{(29, -1, 5)} \\quad [406(-1) + 87(5) = -406 + 435 = 29].$$
          </li>
          <li><strong>Passo 2 $(493, 406)$ com $q_2 = 1$:</strong>
            $$x = 5, \\quad y = -1 - 1(5) = -6 \\implies \\mathbf{(29, 5, -6)} \\quad [493(5) + 406(-6) = 2465 - 2436 = 29].$$
          </li>
          <li><strong>Passo 1 $(899, 493)$ com $q_1 = 1$:</strong>
            $$x = -6, \\quad y = 5 - 1(-6) = 11 \\implies \\mathbf{(29, -6, 11)}.$$
          </li>
        </ul>

        <h4>3. Verificação da Identidade de Bézout</h4>
        $$899 \\cdot (-6) + 493 \\cdot (11) = -5394 + 5423 = \\mathbf{29}.$$
        <p>Como $29 \\mid 899$ ($899 = 29 \\times 31$) e $29 \\mid 493$ ($493 = 29 \\times 17$), o resultado é estritamente $\\text{mdc}(899, 493) = \\mathbf{29}$, e a tupla de saída retornada é <strong>$(d, x, y) = (29, -6, 11)$</strong>! $\\blacksquare$</p>
      `
    },
    {
      id: "ex14-6",
      code: "EXERCÍCIO 06 • TEOREMA CHINÊS DO RESTO (CRT)",
      reference: "Exercício 31.5-1 (p. 774)",
      title: "Resolução Passo a Passo de um Sistema de Congruências Simultâneas pelo Teorema Chinês do Resto",
      prompt: `
        <p><strong>(Exercício 31.5-1, p. 774)</strong> Encontre todos os inteiros $x$ que satisfazem o sistema de congruências simultâneas:</p>
        $$\\begin{cases}
          x \\equiv 1 \\pmod 5 \\\\
          x \\equiv 2 \\pmod 6 \\\\
          x \\equiv 3 \\pmod 7
        \\end{cases}$$
        <ol>
          <li>Verifique que os módulos $n_1 = 5, n_2 = 6, n_3 = 7$ são coprimos dois a dois e calcule o módulo composto $m$.</li>
          <li>Calcule $M_i = m / n_i$ para cada $i \\in \\{1, 2, 3\\}$.</li>
          <li>Encontre os inversos modulares $M_i^{-1} \\pmod{n_i}$ usando o algoritmo de Euclides Estendido.</li>
          <li>Calcule os fatores base $c_i = M_i (M_i^{-1} \\bmod n_i)$ e obtenha a solução única $x$ no intervalo $0 \\le x < m$.</li>
        </ol>
      `,
      placeholder:
        "Módulos: 5, 6, 7. m = 5·6·7 = 210. M_1 = 42, M_2 = 35, M_3 = 30. Calcule os inversos: 42 mod 5 = 2 (inverso 3); 35 mod 6 = 5 (inverso 5); 30 mod 7 = 2 (inverso 4)...",
      solution: `
        <h4>1. Verificação dos Módulos e Cálculo de $m$</h4>
        <p>Os módulos são $n_1 = 5$, $n_2 = 6$, $n_3 = 7$.</p>
        <ul>
          <li>$\\text{mdc}(5, 6) = 1$, $\\text{mdc}(5, 7) = 1$ e $\\text{mdc}(6, 7) = 1$. Os módulos são <strong>estritamente coprimos dois a dois</strong>.</li>
          <li>O produto total é:
            $$m = n_1 \\cdot n_2 \\cdot n_3 = 5 \\cdot 6 \\cdot 7 = \\mathbf{210}.$$
          </li>
        </ul>

        <h4>2. Cálculo dos Termos $M_i = m / n_i$</h4>
        <ul>
          <li>$M_1 = 210 / 5 = \\mathbf{42}$</li>
          <li>$M_2 = 210 / 6 = \\mathbf{35}$</li>
          <li>$M_3 = 210 / 7 = \\mathbf{30}$</li>
        </ul>

        <h4>3. Cálculo dos Inversos Modulares $M_i^{-1} \\pmod{n_i}$</h4>
        <ul>
          <li><strong>Para $i = 1$ (módulo 5):</strong>
            $$M_1 = 42 \\equiv 2 \\pmod 5.$$
            Queremos $2 \\cdot M_1^{-1} \\equiv 1 \\pmod 5$. Como $2 \\times 3 = 6 \\equiv 1 \\pmod 5$, temos $\\mathbf{M_1^{-1} \\equiv 3 \\pmod 5}$.</li>
          <li><strong>Para $i = 2$ (módulo 6):</strong>
            $$M_2 = 35 \\equiv 5 \\equiv -1 \\pmod 6.$$
            Queremos $5 \\cdot M_2^{-1} \\equiv 1 \\pmod 6$. Como $(-1)(-1) = 1$, temos $\\mathbf{M_2^{-1} \\equiv 5 \\pmod 6}$.</li>
          <li><strong>Para $i = 3$ (módulo 7):</strong>
            $$M_3 = 30 \\equiv 2 \\pmod 7.$$
            Queremos $2 \\cdot M_3^{-1} \\equiv 1 \\pmod 7$. Como $2 \\times 4 = 8 \\equiv 1 \\pmod 7$, temos $\\mathbf{M_3^{-1} \\equiv 4 \\pmod 7}$.</li>
        </ul>

        <h4>4. Construção dos Fatores Base $c_i$ e da Solução Final</h4>
        $$c_1 = M_1 \\cdot (M_1^{-1} \\bmod n_1) = 42 \\cdot 3 = \\mathbf{126}$$
        $$c_2 = M_2 \\cdot (M_2^{-1} \\bmod n_2) = 35 \\cdot 5 = \\mathbf{175}$$
        $$c_3 = M_3 \\cdot (M_3^{-1} \\bmod n_3) = 30 \\cdot 4 = \\mathbf{120}$$
        <p>Pela fórmula de superposição do Teorema Chinês do Resto com $a_1 = 1, a_2 = 2, a_3 = 3$:</p>
        $$\\begin{aligned}
          x &= \\big(a_1 c_1 + a_2 c_2 + a_3 c_3\\big) \\bmod m \\\\
          &= \\big(1 \\cdot 126 + 2 \\cdot 175 + 3 \\cdot 120\\big) \\bmod 210 \\\\
          &= (126 + 350 + 360) \\bmod 210 \\\\
          &= 836 \\bmod 210.
        \\end{aligned}$$
        <p>Como $836 = 3 \\times 210 + 206$:</p>
        $$\\mathbf{x = 206}.$$

        <h4>5. Verificação da Solução</h4>
        <ul>
          <li>$206 = 41 \\times 5 + 1 \\implies 206 \\equiv \\mathbf{1} \\pmod 5$ ✔</li>
          <li>$206 = 34 \\times 6 + 2 \\implies 206 \\equiv \\mathbf{2} \\pmod 6$ ✔</li>
          <li>$206 = 29 \\times 7 + 3 \\implies 206 \\equiv \\mathbf{3} \\pmod 7$ ✔</li>
        </ul>
        <p>A solução geral é $x \\equiv 206 \\pmod{210}$, ou seja, $x \\in \\{206 + 210k : k \\in \\mathbb{Z}\\}$. $\\blacksquare$</p>
      `
    },
    {
      id: "ex14-7",
      code: "EXERCÍCIO 07 • O CRIPTOSSISTEMA RSA EM ESCALA DIDÁTICA",
      reference: "Exercício 31.7-1 (p. 783)",
      title: "Geração de Chaves, Cifragem e Decifragem Completa no Criptossistema RSA para p = 11 e q = 29",
      prompt: `
        <p><strong>(Exercício 31.7-1, p. 783)</strong> Considere um sistema RSA instanciado com os números primos $p = 11$ e $q = 29$:</p>
        <ol>
          <li>Calcule o módulo $n$ e o valor da função totiente de Euler $\\phi(n)$.</li>
          <li>Selecione o menor inteiro ímpar $e > 1$ tal que $\\text{mdc}(e, \\phi(n)) = 1$.</li>
          <li>Calcule a chave privada $d$ usando o algoritmo de Euclides Estendido tal que $e \\cdot d \\equiv 1 \\pmod{\\phi(n)}$.</li>
          <li>Cifre a mensagem $M = 31$ obtendo o texto cifrado $C = M^e \\bmod n$ por exponenciação modular rápida.</li>
          <li>Decifre $C$ calculando $M' = C^d \\bmod n$ e comprove que $M' = 31$.</li>
        </ol>
      `,
      placeholder:
        "n = 11 · 29 = 319. ϕ(n) = 10 · 28 = 280. Teste e = 3: mdc(3, 280) = 1. Calcule o inverso de 3 mod 280 usando EXTENDED-EUCLID...",
      solution: `
        <h4>1. Cálculo de $n$ e $\\phi(n)$</h4>
        <ul>
          <li>Módulo público: $n = p \\cdot q = 11 \\cdot 29 = \\mathbf{319}$.</li>
          <li>Totiente de Euler: $\\phi(n) = (p - 1)(q - 1) = (11 - 1)(29 - 1) = 10 \\cdot 28 = \\mathbf{280}$.</li>
        </ul>

        <h4>2. Escolha do Expoente Público $e$</h4>
        <p>Testamos inteiros ímpares $e > 1$:</p>
        <p>Para $e = 3$: como $280 = 3 \\times 93 + 1$, temos $\\text{mdc}(3, 280) = 1$. Portanto, $\\mathbf{e = 3}$ é o menor inteiro ímpar válido!</p>
        <p>A chave pública é <strong>$P = (e, n) = (3, 319)$</strong>.</p>

        <h4>3. Cálculo da Chave Privada $d$ via Euclides Estendido</h4>
        <p>Queremos encontrar $d$ tal que $3d \\equiv 1 \\pmod{280}$, ou seja, $3d + 280y = 1$:</p>
        <ul>
          <li>Divisão: $280 = 93 \\cdot 3 + 1 \\implies 1 = 280(1) - 93(3) = 3(-93) + 280(1)$.</li>
          <li>Portanto, $x = -93$.</li>
          <li>Reduzindo módulo $280$:
            $$d \\equiv -93 \\equiv -93 + 280 = \\mathbf{187} \\pmod{280}.$$
          </li>
          <li>Verificação: $3 \\times 187 = 561 = 2 \\times 280 + 1 \\equiv 1 \\pmod{280}$ ✔.</li>
        </ul>
        <p>A chave privada secreta é <strong>$S = (d, n) = (187, 319)$</strong>.</p>

        <h4>4. Cifragem da Mensagem $M = 31$</h4>
        <p>O texto cifrado é dado por $C = M^e \\bmod n = 31^3 \\bmod 319$:</p>
        $$\\begin{aligned}
          31^2 &= 961 \\\\
          961 &= 3 \\times 319 + 4 = 957 + 4 \\implies 31^2 \\equiv 4 \\pmod{319} \\\\
          31^3 &= 31^2 \\cdot 31 \\equiv 4 \\cdot 31 = 124 \\pmod{319}.
        \\end{aligned}$$
        <p>O texto cifrado transmitido por Bob é <strong>$C = 124$</strong>.</p>

        <h4>5. Decifragem de $C = 124$ com $d = 187$</h4>
        <p>Alice calcula $M' = 124^{187} \\bmod 319$. Representação binária de $187$:</p>
        $$187 = 128 + 32 + 16 + 8 + 2 + 1 = \\langle 1, 0, 1, 1, 1, 0, 1, 1 \\rangle_2.$$
        <p>Podemos simplificar o cálculo usando o Teorema Chinês do Resto sobre os fatores primos $p = 11$ e $q = 29$:</p>
        <ul>
          <li><strong>Módulo 11:</strong> $124 \\equiv 3 \\pmod{11}$. Pelo Pequeno Teorema de Fermat, $3^{10} \\equiv 1 \\pmod{11}$. Como $187 = 18 \\times 10 + 7$:
            $$124^{187} \\equiv 3^7 \\pmod{11}.$$
            $3^2 = 9 \\equiv -2 \\implies 3^4 \\equiv (-2)^2 = 4 \\implies 3^7 = 3^4 \\cdot 3^2 \\cdot 3 \\equiv 4 \\cdot (-2) \\cdot 3 = -24 \\equiv \\mathbf{9} \\pmod{11}$.
          </li>
          <li><strong>Módulo 29:</strong> $124 = 4 \\times 29 + 8 \\implies 124 \\equiv 8 \\pmod{29}$. Pelo Pequeno Teorema de Fermat, $8^{28} \\equiv 1 \\pmod{29}$. Como $187 = 6 \\times 28 + 19$:
            $$124^{187} \\equiv 8^{19} \\pmod{29}.$$
            Como $8 = 2^3$, temos $8^{19} = 2^{57}$. Como $2^{28} \\equiv 1$, $2^{57} = (2^{28})^2 \\cdot 2^1 \\equiv 1 \\cdot 2 = \\mathbf{2} \\pmod{29}$.
          </li>
        </ul>
        <p>Agora resolvemos o sistema: $M' \\equiv 9 \\pmod{11}$ e $M' \\equiv 2 \\pmod{29}$:</p>
        $$M' = 29k + 2 \\implies 29k + 2 \\equiv 9 \\pmod{11} \\implies 7k + 2 \\equiv 9 \\implies 7k \\equiv 7 \\implies k \\equiv 1 \\pmod{11}.$$
        <p>Substituindo $k = 1$:</p>
        $$M' = 29(1) + 2 = \\mathbf{31}.$$
        <p>A mensagem original recuperada é <strong>$M = 31$</strong>, comprovando perfeitamente a corretude do RSA! $\\blacksquare$</p>
      `
    },
    {
      id: "ex14-8",
      code: "EXERCÍCIO 08 • O ALGORITMO BINÁRIO DE MDC (STEIN)",
      reference: "Problema 31-1 (p. 794)",
      title: "Demonstração das Identidades de Paridade e Projeto do Algoritmo Binário de MDC sem Divisão Longa em O(lg a)",
      prompt: `
        <p><strong>(Problema 31-1, p. 794)</strong> A maioria dos processadores modernos executa operações de deslocamento de bits (divisão por 2) e testes de paridade muito mais rapidamente que divisões inteiras com resto. O <strong>Algoritmo Binário de MDC</strong> (proposto por Josef Stein em 1967) calcula $\\text{mdc}(a, b)$ sem nenhuma divisão longa.</p>
        <ol>
          <li>Demonstre as três propriedades fundamentais de paridade:
            <ul>
              <li>Se $a$ e $b$ são ambos pares: $\\text{mdc}(a, b) = 2 \\cdot \\text{mdc}(a/2, \\, b/2)$.</li>
              <li>Se $a$ é ímpar e $b$ é par: $\\text{mdc}(a, b) = \\text{mdc}(a, \\, b/2)$.</li>
              <li>Se $a$ e $b$ são ambos ímpares: $\\text{mdc}(a, b) = \\text{mdc}((a - b)/2, \\, b)$.</li>
            </ul>
          </li>
          <li>Escreva o pseudocódigo formal de <code>BINARY-GCD(a, b)</code>.</li>
          <li>Mostre que para inteiros $a \\ge b$, o algoritmo executa no máximo $O(\\lg a)$ iterações e analisa sua complexidade de operações com bits.</li>
        </ol>
      `,
      placeholder:
        "Se ambos são pares, 2 é fator comum. Se um é ímpar e outro é par, 2 não divide o mdc. Se ambos são ímpares, a-b é par, logo mdc(a,b) = mdc(a-b, b) = mdc((a-b)/2, b)...",
      solution: `
        <h4>1. Demonstração Formal das Propriedades de Paridade</h4>
        <ul>
          <li><strong>Caso 1 ($a$ par, $b$ par):</strong> Como $2 \\mid a$ e $2 \\mid b$, o número $2$ é um divisor comum de $a$ e $b$. Pela fatoração única em primos:
            $$\\text{mdc}(a, b) = \\text{mdc}(2 \\cdot (a/2), \\; 2 \\cdot (b/2)) = \\mathbf{2 \\cdot \\text{mdc}(a/2, \\; b/2)}. \\quad \\blacksquare$$
          </li>
          <li><strong>Caso 2 ($a$ ímpar, $b$ par):</strong> Como $a$ é ímpar, $2 \\nmid a$. Portanto, $2$ não pode ser divisor comum de $a$ e $b$, logo $\\text{mdc}(a, b)$ é ímpar. Segue que todo divisor comum de $a$ e $b$ é coprimo com $2$, dividindo necessariamente $b/2$. Logo:
            $$\\mathbf{\\text{mdc}(a, b) = \\text{mdc}(a, \\; b/2)}. \\quad \\blacksquare$$
          </li>
          <li><strong>Caso 3 ($a$ ímpar, $b$ ímpar):</strong> Pela propriedade fundamental do MDC ($\text{mdc}(a, b) = \\text{mdc}(a - b, b)$), qualquer divisor comum de $a$ e $b$ também divide $a - b$. Como a diferença de dois números ímpares é sempre <strong>par</strong>, $a - b$ é divisível por $2$. Mas como $b$ é ímpar, $2$ não divide o MDC. Aplicando a propriedade do Caso 2 a $\\text{mdc}(a - b, b)$:
            $$\\mathbf{\\text{mdc}(a, b) = \\text{mdc}(a - b, \\; b) = \\text{mdc}\\left(\\frac{a - b}{2}, \\; b\\right)}. \\quad \\blacksquare$$
          </li>
        </ul>

        <h4>2. Pseudocódigo do Algoritmo Binário de MDC</h4>
        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header"><span class="proc-name">BINARY-GCD(a, b) (Stein, 1967)</span></div>
          <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">se</span> a == 0 <span class="kw">retorne</span> b</span></div>
          <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">se</span> b == 0 <span class="kw">retorne</span> a</span></div>
          <div class="code-line"><span class="line-num">3</span><span class="line-content">shift = 0</span></div>
          <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">enquanto</span> (a & 1) == 0 <span class="kw">e</span> (b & 1) == 0    <span class="comment">// ambos são pares</span></span></div>
          <div class="code-line"><span class="line-num">5</span><span class="line-content">    a = a >> 1; b = b >> 1; shift = shift + 1</span></div>
          <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">enquanto</span> (a & 1) == 0                  <span class="comment">// remove fatores 2 de a</span></span></div>
          <div class="code-line"><span class="line-num">7</span><span class="line-content">    a = a >> 1</span></div>
          <div class="code-line"><span class="line-num">8</span><span class="line-content"><span class="kw">repita</span></span></div>
          <div class="code-line"><span class="line-num">9</span><span class="line-content">    <span class="kw">enquanto</span> (b & 1) == 0              <span class="comment">// remove fatores 2 de b</span></span></div>
          <div class="code-line"><span class="line-num">10</span><span class="line-content">        b = b >> 1</span></div>
          <div class="code-line"><span class="line-num">11</span><span class="line-content">    <span class="kw">se</span> a > b</span></div>
          <div class="code-line"><span class="line-num">12</span><span class="line-content">        troque a com b</span></div>
          <div class="code-line"><span class="line-num">13</span><span class="line-content">    b = b - a                          <span class="comment">// b agora é par</span></span></div>
          <div class="code-line"><span class="line-num">14</span><span class="line-content"><span class="kw">até</span> b == 0</span></div>
          <div class="code-line"><span class="line-num">15</span><span class="line-content"><span class="kw">retorne</span> a << shift</span></div>
        </div>

        <h4>3. Análise de Complexidade</h4>
        <ul>
          <li><strong>Número de Iterações:</strong> Em cada passagem do laço principal, pelo menos uma das variáveis é dividida por $2$ (via deslocamento de bits à direita <code>>> 1</code>). Como o produto $a \\cdot b$ diminui por um fator de pelo menos $2$ em cada iteração em que $b$ é par ou substituído por $(b - a)/2$, o número total de iterações é no máximo limitado por $\\lg a + \\lg b = \\mathbf{O(\\lg a)}$.</li>
          <li><strong>Operações com Bits:</strong> Cada iteração requer apenas deslocamento de bits (<code>>> 1</code>), teste do bit menos significativo (<code>& 1</code>) e subtração binária de inteiros de $\\beta$ bits (custo $O(\\beta)$ operações com bits). Portanto, o tempo total é de <strong>$O(\\beta^2)$ operações com bits</strong>, dispensando divisões inteiras dispendiosas em hardware! $\\blacksquare$</li>
        </ul>
      `
    }
  ];

/* ========================================================================
     REGISTRO DO MÓDULO 14 NO CODEX CURRICULARIUM
     ======================================================================== */
  if (typeof window !== "undefined" && typeof window.registerCodexModule === "function") {
    window.registerCodexModule(14, {
      revisao,
      unidades,
      initWorkbenches,
      quizzes,
      exercicios
    });
  }
})();
