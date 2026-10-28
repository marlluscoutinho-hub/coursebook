/* ==========================================================================
   CODEX — MÓDULO 02: CRESCIMENTO DE FUNÇÕES, NOTAÇÃO ASSINTÓTICA E SOMATÓRIOS
   Capítulo 3 (pp. 47–65) + Apêndice A (pp. 920–930)
   Obra: Algoritmos: Teoria e Prática (3ª Edição) — Cormen, Leiserson, Rivest e Stein
   ========================================================================== */

(function () {
  const revisao = {
    subtitle:
      "Da Contagem Exata no Modelo RAM ao Formalismo Assintótico de Conjuntos de Funções e à Álgebra dos Somatórios",
    intro:
      "No Módulo 01 (Capítulo 2), determinamos o tempo de execução exato da ordenação por inserção no modelo RAM como uma função quadrática $T(n) = an^2 + bn + c$ no pior caso e linear $T(n) = an + b$ no melhor caso, e introduzimos intuitivamente a ideia de ordem de crescimento $\\Theta(n^2)$ e $\\Theta(n \\lg n)$ descartando termos de ordem inferior e constantes multiplicativas. Agora, no Módulo 02, unificamos o Capítulo 3 (Crescimento de Funções, pp. 47–65) e o Apêndice A (Somatórios, pp. 920–930) para construir o alicerce matemático rigoroso que sustenta toda a análise de algoritmos da obra.",
    pillars: [
      {
        tag: "[ PILAR 01 • EFICIÊNCIA ASSINTÓTICA ]",
        title: "Por que o Limite para n → ∞ Governa a Escolha de Algoritmos",
        body: `
          <p>Quando estudamos a <strong>eficiência assintótica</strong> de um algoritmo, analisamos como seu tempo de execução (ou consumo de espaço) cresce à medida que o tamanho da entrada $n$ aumenta sem limite ($n \\to \\infty$). Embora para entradas minúsculas um algoritmo com constante menor possa vencer temporariamente, existe sempre um limiar $n_0$ a partir do qual um algoritmo assintoticamente mais eficiente (como $\\Theta(n \\lg n)$ frente a $\\Theta(n^2)$) será imbatível para <strong>todas</strong> as entradas maiores.</p>
          <ul>
            <li><strong>Domínio natural e extensões:</strong> As notações assintóticas são definidas primariamente para funções cujo domínio é o conjunto dos números naturais $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$, mas podem ser estendidas aos números reais $\\mathbb{R}$ ou restritas a subconjuntos de $\\mathbb{N}$ quando conveniente.</li>
            <li><strong>Premissa de não negatividade assintótica:</strong> Uma função $f(n)$ é <em>assintoticamente não negativa</em> se $f(n) \\ge 0$ para todo $n$ suficientemente grande, e <em>assintoticamente positiva</em> se $f(n) > 0$ para todo $n$ suficientemente grande. Toda função usada dentro das notações $\\Theta, O, \\Omega, o, \\omega$ no CLRS deve ser assintoticamente não negativa.</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 02 • CONJUNTOS DE FUNÇÕES ]",
        title: "As Cinco Notações Assintóticas (Θ, O, Ω, o, ω) e o Abuso Controlado de '='",
        body: `
          <p>Matematicamente, $\\Theta(g(n))$, $O(g(n))$, $\\Omega(g(n))$, $o(g(n))$ e $\\omega(g(n))$ são <strong>conjuntos de funções</strong>:</p>
          <ul>
            <li><strong>Pertinência versus Igualdade:</strong> Escrever $f(n) = \\Theta(g(n))$ é um abuso intencional e produtivo de notação para expressar a relação de pertinência $f(n) \\in \\Theta(g(n))$. Quando a notação assintótica aparece dentro de uma expressão algébrica (como $2n^2 + 3n + 1 = 2n^2 + \\Theta(n)$), ela representa uma <strong>função anônima</strong> pertencente àquele conjunto.</li>
            <li><strong>Analogia com a ordem dos números reais:</strong> Comparar assintoticamente duas funções $f(n)$ e $g(n)$ espelha a comparação de números reais $a$ e $b$: $O$ corresponde a $\\le$, $\\Omega$ a $\\ge$, $\\Theta$ a $=$, $o$ a $<$ e $\\omega$ a $>$. Contudo, a propriedade de <strong>tricotomia falha</strong> para funções (existem pares de funções osculantes, como $n$ e $n^{1+\\sin n}$, que não são assintoticamente comparáveis!).</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 03 • HIERARQUIA DE FUNÇÕES ]",
        title: "A Escala Canônica de Crescimento: de lg* n a n!",
        body: `
          <p>A Seção 3.2 estabelece as propriedades algébricas e a hierarquia estrita entre as classes de funções que emergem em estruturas de dados e algoritmos:</p>
          $$\\Theta(1) \\prec \\lg^* n \\prec \\lg(\\lg n) \\prec \\lg n \\prec \\lg^k n \\prec n^a \\; (0 < a < 1) \\prec n \\prec n \\lg n \\prec n^2 \\prec n^d \\prec c^n \\; (c > 1) \\prec n! \\prec n^n$$
          <ul>
            <li><strong>Polilogaritmos vs. Polinômios:</strong> Para quaisquer constantes $b > 0$ e $a > 0$, vale $\\lim_{n\\to\\infty} \\frac{\\lg^b n}{n^a} = 0$, logo $\\lg^b n = o(n^a)$ (qualquer potência positiva de $n$ domina qualquer potência de logaritmo).</li>
            <li><strong>Polinômios vs. Exponenciais:</strong> Para quaisquer constantes $b$ e $a > 1$, vale $\\lim_{n\\to\\infty} \\frac{n^b}{a^n} = 0$, logo $n^b = o(a^n)$ (qualquer exponencial de base $> 1$ domina qualquer polinômio).</li>
            <li><strong>Fatoriais e Stirling:</strong> Pela aproximação de Stirling, $n! = \\sqrt{2\\pi n}\\left(\\frac{n}{e}\\right)^n \\left(1 + \\Theta\\left(\\frac{1}{n}\\right)\\right)$, o que demonstra que $n! = \\omega(2^n)$, $n! = o(n^n)$ e fornece o resultado fundamental para limites inferiores de ordenação: $\\lg(n!) = \\Theta(n \\lg n)$.</li>
          </ul>
        `
      },
      {
        tag: "[ PILAR 04 • ÁLGEBRA E LIMITAÇÃO DE SOMATÓRIOS ]",
        title: "Do Laço Iterativo à Forma Fechada ou ao Limite Assintótico (Apêndice A)",
        body: `
          <p>Como vimos no Capítulo 2 com $\\sum_{j=2}^{n} t_j$, todo laço <code>for</code> ou <code>while</code> traduz-se diretamente em um <strong>somatório</strong>. O Apêndice A (pp. 920–930) equipa você com duas caixas de ferramentas complementares:</p>
          <ul>
            <li><strong>Seção A.1 (Fórmulas Exatas e Propriedades):</strong> Linearidade (incluindo com notação $\\Theta$), séries aritméticas ($\\Theta(n^2)$), somas de quadrados ($\\Theta(n^3)$) e cubos ($\\Theta(n^4)$), séries geométricas finitas e infinitas ($\\sum_{k=0}^{\\infty} x^k = \\frac{1}{1-x}$ para $|x| < 1$), diferenciação de séries ($\\sum_{k=0}^{\\infty} k x^k = \\frac{x}{(1-x)^2}$), série harmônica ($H_n = \\ln n + O(1)$) e somas telescópicas ($\\sum_{k=1}^{n} (a_k - a_{k-1}) = a_n - a_0$).</li>
            <li><strong>Seção A.2 (Limitação de Somatórios):</strong> Quando não há fórmula fechada elementar, determinamos limites assintóticos justos por: (1) <strong>Indução matemática</strong> (evitando a armadilha da constante oculta em $O$), (2) <strong>Limitação de termos</strong> (pelo termo máximo ou por uma série geométrica com razão constante $r < 1$), (3) <strong>Divisão (quebra) de somatórios</strong> (como provar que $\\sum_{k=1}^n k = \\Omega(n^2)$ dividindo em $n/2$) e (4) <strong>Aproximação por integrais</strong> para funções monótonas.</li>
          </ul>
        `
      }
    ],
    checklist: [
      "Sei distinguir rigorosamente os quantificadores existenciais (∃c > 0) de Θ, O e Ω dos quantificadores universais (∀c > 0) de o e ω.",
      "Compreendo o Teorema 3.1: f(n) = Θ(g(n)) se e somente se f(n) = O(g(n)) e f(n) = Ω(g(n)), bem como a regra das funções anônimas em equações.",
      "Domino as identidades de pisos, tetos, exponenciais (1 + x ≤ eˣ ≤ 1 + x + x²), logaritmos (a^(log_b c) = c^(log_b a)), aproximação de Stirling (lg(n!) = Θ(n lg n)), logaritmo iterado lg* n e Fibonacci via razão áurea φ.",
      "Sei aplicar as fórmulas fechadas de séries aritméticas, geométricas, harmônicas e telescópicas da Seção A.1.",
      "Sei limitar somatórios por indução, razão geométrica r < 1, quebra de faixa de índices e aproximação por integrais (∫ f(x) dx) da Seção A.2."
    ]
  };

  const unidades = [
    /* ======================================================================
       UNIDADE 2.1 — CAPÍTULO 3, SEÇÃO 3.1 (pp. 47–54)
       ====================================================================== */
    {
      id: "u2-1",
      code: "UNIDADE 2.1 • CAP. 3 (SEÇÃO 3.1)",
      pages: "pp. 47–54",
      title: "3.1 Notação Assintótica (Θ, O, Ω, o, ω), o Teorema 3.1 e Comparação de Funções",
      content: `
        <p>As notações que utilizamos para descrever o tempo de execução assintótico de um algoritmo são definidas em termos de funções cujos domínios são o conjunto dos números naturais $\\mathbb{N} = \\{0, 1, 2, \\dots\\}$. Tais notações descrevem com precisão a função $T(n)$ do tempo de execução, mas aplicam-se de forma geral a quaisquer funções matemáticas (seja para medir espaço de memória, seja em contextos puramente algébricos).</p>

        <h3>1. Notação $\\Theta$ (Limite Assintoticamente Restrito / Justo)</h3>
        <p>Para uma dada função $g(n)$, denotamos por $\\Theta(g(n))$ (lê-se <em>"teta de g de n"</em>) o conjunto de funções:</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ DEFINIÇÃO FORMAL • CONJUNTO Θ(g(n)) (p. 48) ]</span>
          $$\\Theta(g(n)) = \\{ f(n) : \\text{existem constantes positivas } c_1, c_2 \\text{ e } n_0 \\text{ tais que } 0 \\le c_1 g(n) \\le f(n) \\le c_2 g(n) \\text{ para todo } n \\ge n_0 \\}.$$
          <p>Uma função $f(n)$ pertence ao conjunto $\\Theta(g(n))$ se existirem constantes positivas $c_1$ e $c_2$ tais que $f(n)$ possa ser <strong>"encaixada" (sanduichada)</strong> entre $c_1 g(n)$ e $c_2 g(n)$ para todo valor de $n$ suficientemente grande ($n \\ge n_0$). Em outras palavras, para todo $n \\ge n_0$, a função $f(n)$ é igual a $g(n)$ a menos de um fator constante, e dizemos que $g(n)$ é um <strong>limite assintoticamente restrito (ou justo)</strong> para $f(n)$.</p>
        </div>

        <p>Observe que a definição exige $0 \\le c_1 g(n) \\le f(n)$ para $n \\ge n_0$, o que significa que todo membro $f(n) \\in \\Theta(g(n))$ deve ser <strong>assintoticamente não negativo</strong> (e a própria $g(n)$ deve ser assintoticamente não negativa, caso contrário o conjunto $\\Theta(g(n))$ seria vazio). Embora $\\Theta(g(n))$ seja um conjunto e o rigor conjuntista sugerisse escrever $f(n) \\in \\Theta(g(n))$, adotamos a convenção $f(n) = \\Theta(g(n))$ pelas grandes vantagens algébricas que ela proporciona ao manipular equações.</p>

        <h4>Demonstrações Formais Canônicas do Livro (pp. 48–50)</h4>
        <ul>
          <li><strong>Exemplo 1 — Provando que $\\frac{1}{2}n^2 - 3n = \\Theta(n^2)$:</strong> Precisamos exibir constantes positivas $c_1, c_2$ e $n_0$ tais que:
            $$c_1 n^2 \\le \\frac{1}{2}n^2 - 3n \\le c_2 n^2 \\quad \\text{para todo } n \\ge n_0.$$
            Dividindo toda a desigualdade por $n^2$ (para $n > 0$), obtemos a condição equivalente:
            $$c_1 \\le \\frac{1}{2} - \\frac{3}{n} \\le c_2.$$
            <ol>
              <li><em>Desigualdade da direita ($\\frac{1}{2} - \\frac{3}{n} \\le c_2$):</em> Como $\\frac{3}{n} > 0$ para todo $n \\ge 1$, temos $\\frac{1}{2} - \\frac{3}{n} < \\frac{1}{2}$. Portanto, a desigualdade da direita vale para qualquer $n \\ge 1$ se escolhermos qualquer constante $c_2 \\ge \\frac{1}{2}$ (por exemplo, $c_2 = \\frac{1}{2}$).</li>
              <li><em>Desigualdade da esquerda ($c_1 \\le \\frac{1}{2} - \\frac{3}{n}$):</em> Para que $\\frac{1}{2} - \\frac{3}{n}$ seja estritamente positivo, precisamos de $\\frac{3}{n} < \\frac{1}{2} \\iff n > 6$, logo o menor inteiro é $n = 7$. Para $n \\ge 7$, temos $\\frac{3}{n} \\le \\frac{3}{7}$, logo $\\frac{1}{2} - \\frac{3}{n} \\ge \\frac{1}{2} - \\frac{3}{7} = \\frac{1}{14}$. Escolhendo qualquer $c_1 \\le \\frac{1}{14}$, a desigualdade da esquerda vale para todo $n \\ge 7$.</li>
            </ol>
            Concluímos que, escolhendo <strong>$c_1 = \\frac{1}{14}$, $c_2 = \\frac{1}{2}$ e $n_0 = 7$</strong>, vale $0 \\le c_1 n^2 \\le \\frac{1}{2}n^2 - 3n \\le c_2 n^2$ para todo $n \\ge n_0$, provando rigorosamente que $\\frac{1}{2}n^2 - 3n = \\Theta(n^2)$!</li>
          <li><strong>Exemplo 2 — Provando por contradição que $6n^3 \\ne \\Theta(n^2)$:</strong> Suponha, por absurdo, que existam constantes positivas $c_2$ e $n_0$ tais que $6n^3 \\le c_2 n^2$ para todo $n \\ge n_0$. Dividindo ambos os lados por $6n^2$, obteríamos $n \\le \\frac{c_2}{6}$ para todo $n \\ge n_0$. Mas isso é impossível para $n$ arbitrariamente grande (basta tomar $n > \\max(n_0, c_2/6)$), pois $c_2$ é uma constante fixa! Logo, $6n^3 \\ne \\Theta(n^2)$.</li>
          <li><strong>Exemplo 3 — Qualquer função quadrática positiva $f(n) = an^2 + bn + c$ (com $a > 0$) pertence a $\\Theta(n^2)$:</strong> Os autores mostram na página 49 que basta escolher as constantes universais:
            $$c_1 = \\frac{a}{4}, \\qquad c_2 = \\frac{7a}{4} \\qquad \\text{e} \\qquad n_0 = 2 \\cdot \\max\\left(\\frac{|b|}{a}, \\sqrt{\\frac{|c|}{a}}\\right).$$
            De fato, para $n \\ge n_0$, temos $\\frac{|b|}{n} \\le \\frac{a}{2}$ e $\\frac{|c|}{n^2} \\le \\frac{a}{4}$, de modo que $an^2 + bn + c \\ge n^2(a - a/2 - a/4) = \\frac{a}{4}n^2$ e $an^2 + bn + c \\le n^2(a + a/2 + a/4) = \\frac{7a}{4}n^2$.</li>
          <li><strong>Notação $\\Theta(1)$:</strong> Como qualquer constante positiva é um polinômio de grau $d = 0$ ($c = c \\cdot n^0$), representamos qualquer função limitada superior e inferiormente por constantes positivas como $\\Theta(n^0)$ ou simplesmente <strong>$\\Theta(1)$</strong>.</li>
        </ul>

        <h3>2. Notação $O$ (Limite Assintótico Superior)</h3>
        <p>Enquanto $\\Theta$ limita uma função tanto por cima quanto por baixo, a notação $O$ (lê-se <em>"Ó grande de g de n"</em>) fornece apenas um <strong>limite assintótico superior</strong>:</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ DEFINIÇÃO FORMAL • CONJUNTO O(g(n)) (p. 50) ]</span>
          $$O(g(n)) = \\{ f(n) : \\text{existem constantes positivas } c \\text{ e } n_0 \\text{ tais que } 0 \\le f(n) \\le c g(n) \\text{ para todo } n \\ge n_0 \\}.$$
          <p>Como $\\Theta(g(n))$ exige tanto um limite superior quanto um inferior, temos imediatamente que $\\Theta(g(n)) \\subseteq O(g(n))$, isto é, $f(n) = \\Theta(g(n)) \\implies f(n) = O(g(n))$.</p>
        </div>

        <p><strong>Atenção à precisão conceitual:</strong> Na literatura informal, alguns autores usam $O$ quando deveriam usar $\\Theta$. Em Cormen et al., $f(n) = O(g(n))$ afirma <em>apenas</em> que $f(n)$ é limitada superiormente por um múltiplo constante de $g(n)$, sem exigir que o limite seja justo! Por exemplo, qualquer função linear $an + b$ (com $a > 0$) pertence a $O(n^2)$ — basta escolher $c = a + |b|$ e $n_0 = \\max(1, -b/a)$ para obter $0 \\le an + b \\le (a + |b|)n \\le (a + |b|)n^2$ para todo $n \\ge n_0$.</p>
        <p><strong>Semântica de $O(g(n))$ para o tempo de execução de um algoritmo:</strong> Quando afirmamos que <em>"o tempo de execução da ordenação por inserção é $O(n^2)$"</em> (sem especificar "no pior caso"), queremos dizer que o tempo de execução do <strong>pior caso</strong> é $O(n^2)$ — e, como o pior caso limita todas as entradas possíveis, o tempo de execução para <strong>qualquer entrada</strong> de tamanho $n$ é limitado superiormente por $O(n^2)$. Em contrapartida, <strong>não</strong> podemos dizer que o tempo de execução da ordenação por inserção para toda entrada é $\\Theta(n^2)$, pois para entradas já ordenadas ele executa em tempo $\\Theta(n)$!</p>

        <h3>3. Notação $\\Omega$ (Limite Assintótico Inferior) e o Teorema 3.1</h3>
        <p>De modo simétrico à notação $O$, a notação $\\Omega$ (lê-se <em>"ômega grande de g de n"</em>) fornece um <strong>limite assintótico inferior</strong>:</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ DEFINIÇÃO FORMAL • CONJUNTO Ω(g(n)) E TEOREMA 3.1 (p. 51) ]</span>
          $$\\Omega(g(n)) = \\{ f(n) : \\text{existem constantes positivas } c \\text{ e } n_0 \\text{ tais que } 0 \\le c g(n) \\le f(n) \\text{ para todo } n \\ge n_0 \\}.$$
          <hr style="border:none;border-top:1px dashed var(--border-color);margin:0.85rem 0;" />
          <p><strong>Teorema 3.1:</strong> Para quaisquer duas funções $f(n)$ e $g(n)$, temos</p>
          $$f(n) = \\Theta(g(n)) \\iff f(n) = O(g(n)) \\;\\text{ e }\\; f(n) = \\Omega(g(n)).$$
          <p><em>Demonstração (Exercício 3.1-5):</em><br/>
          ($\\Rightarrow$) Se $f(n) = \\Theta(g(n))$, existem $c_1, c_2, n_0 > 0$ tais que $0 \\le c_1 g(n) \\le f(n) \\le c_2 g(n)$ para todo $n \\ge n_0$. A metade esquerda $0 \\le c_1 g(n) \\le f(n)$ prova que $f(n) = \\Omega(g(n))$ (com $c = c_1$), e a metade direita $0 \\le f(n) \\le c_2 g(n)$ prova que $f(n) = O(g(n))$ (com $c = c_2$).<br/>
          ($\\Leftarrow$) Reciprocamente, se $f(n) = O(g(n))$ (logo existem $c', n'_0 > 0$ tais que $0 \\le f(n) \\le c' g(n)$ para $n \\ge n'_0$) e $f(n) = \\Omega(g(n))$ (logo existem $c'', n''_0 > 0$ tais que $0 \\le c'' g(n) \\le f(n)$ para $n \\ge n''_0$), basta escolher <strong>$n_0 = \\max(n'_0, n''_0)$</strong>, $c_1 = c''$ e $c_2 = c'$. Para todo $n \\ge n_0$, ambas as desigualdades valem simultaneamente, isto é, $0 \\le c_1 g(n) \\le f(n) \\le c_2 g(n)$, provando que $f(n) = \\Theta(g(n))$.</p>
        </div>

        <p><strong>Semântica de $\\Omega(g(n))$ para algoritmos:</strong> Quando dizemos que <em>"o tempo de execução de um algoritmo é $\\Omega(g(n))$"</em> (sem modificador), significa que para <strong>qualquer entrada</strong> de tamanho $n$ o algoritmo leva pelo menos $c g(n)$ passos (para $n \\ge n_0$), o que equivale a dar um limite inferior para o <strong>melhor caso</strong>! Por exemplo, o tempo de execução da ordenação por inserção é $\\Omega(n)$ e $O(n^2)$ (mas não é $\\Omega(n^2)$, embora seu tempo de execução <em>do pior caso</em> seja $\\Omega(n^2)$).</p>

        <h3>4. Notação Assintótica em Equações e Desigualdades (pp. 51–52)</h3>
        <p>Como interpretar expressões algébricas que contêm notações assintóticas em um ou em ambos os lados do sinal de igualdade?</p>
        <ol>
          <li><strong>No lado direito de uma equação:</strong> Quando aparece sozinha, como em $n = O(n^2)$, o sinal $=$ significa pertinência ($n \\in O(n^2)$). Quando aparece dentro de uma fórmula maior, como em $2n^2 + 3n + 1 = 2n^2 + \\Theta(n)$, cada ocorrência da notação assintótica representa uma <strong>função anônima</strong> naquele conjunto — aqui, $f(n) = 3n + 1 \\in \\Theta(n)$. Da mesma forma, na recorrência $T(n) = 2T(n/2) + \\Theta(n)$, o termo $\\Theta(n)$ abstrai todos os detalhes lineares e de ordem inferior da divisão e combinação.</li>
          <li><strong>Contagem de funções anônimas:</strong> O número de funções anônimas em uma expressão é exatamente igual ao número de vezes que a notação assintótica é escrita. Assim, em $\\sum_{i=1}^{n} O(i)$, há <strong>apenas uma</strong> função anônima $f(i) \\in O(i)$, e não uma soma de $n$ funções distintas $O(1) + O(2) + \\dots + O(n)$ (que não teria interpretação bem definida quando o número de parcelas varia com $n$).</li>
          <li><strong>No lado esquerdo de uma equação (Regra de Quantificação Universal → Existencial):</strong> Se a notação assintótica aparece no lado esquerdo, como em:
            $$2n^2 + \\Theta(n) = \\Theta(n^2),$$
            a regra formal é: <strong>não importa como as funções anônimas são escolhidas no lado esquerdo do sinal $=$, existe uma maneira de escolher as funções anônimas no lado direito para tornar a equação válida!</strong> Isto é: para <em>qualquer</em> função $f(n) \\in \\Theta(n)$, <em>existe</em> uma função $g(n) \\in \\Theta(n^2)$ tal que $2n^2 + f(n) = g(n)$ para todo $n$. Isso permite encadear deduções limpamente:
            $$2n^2 + 3n + 1 = 2n^2 + \\Theta(n) = \\Theta(n^2).$$</li>
        </ol>

        <h3>5. Notações $o$ ("ó pequeno") e $\\omega$ ("ômega pequeno"): Limites Estritos Não Justos (pp. 52–53)</h3>
        <p>O limite $2n^2 = O(n^2)$ é assintoticamente justo, mas $2n = O(n^2)$ não é. Para denotar um limite superior que <strong>não é assintoticamente justo</strong>, definimos $o(g(n))$ (<em>"ó pequeno de g de n"</em>), e simetricamente, para um limite inferior que <strong>não é assintoticamente justo</strong>, definimos $\\omega(g(n))$ (<em>"ômega pequeno de g de n"</em>):</p>

        <div class="canonical-callout invariant">
          <span class="callout-tag">[ DEFINIÇÕES FORMAIS E LIMITES • o(g(n)) E ω(g(n)) (pp. 52–53) ]</span>
          $$o(g(n)) = \\{ f(n) : \\text{para } \\mathbf{qualquer}\\text{ constante positiva } c > 0, \\text{ existe uma constante } n_0 > 0 \\text{ tal que } 0 \\le f(n) < c g(n) \\text{ para todo } n \\ge n_0 \\}.$$
          $$\\omega(g(n)) = \\{ f(n) : \\text{para } \\mathbf{qualquer}\\text{ constante positiva } c > 0, \\text{ existe uma constante } n_0 > 0 \\text{ tal que } 0 \\le c g(n) < f(n) \\text{ para todo } n \\ge n_0 \\}.$$
          <p><strong>Contraste crucial de quantificadores:</strong> Em $O(g(n))$ e $\\Omega(g(n))$, a desigualdade precisa valer para <strong>alguma</strong> constante $c > 0$ ($\exists c > 0$). Em $o(g(n))$ e $\\omega(g(n))$, a desigualdade estrita deve valer para <strong>todas</strong> as constantes $c > 0$ ($\forall c > 0$, onde $n_0$ pode depender da escolha de $c$).</p>
          <p><strong>Caracterização por limites no infinito:</strong></p>
          $$f(n) = o(g(n)) \\implies \\lim_{n \\to \\infty} \\frac{f(n)}{g(n)} = 0 \\qquad \\text{e} \\qquad f(n) = \\omega(g(n)) \\implies \\lim_{n \\to \\infty} \\frac{f(n)}{g(n)} = \\infty \\; (\\text{se o limite existir}).$$
          <p>Além disso, vale a dualidade perfeita: $f(n) \\in \\omega(g(n)) \\iff g(n) \\in o(f(n))$. Exemplos: $2n = o(n^2)$, mas $2n^2 \\ne o(n^2)$; analogamente, $n^2/2 = \\omega(n)$, mas $n^2/2 \\ne \\omega(n^2)$.</p>
        </div>

        <h3>6. Propriedades Relacionais na Comparação de Funções e a Falha da Tricotomia (pp. 53–54)</h3>
        <p>Sejam $f(n)$, $g(n)$ e $h(n)$ funções assintoticamente positivas. As notações assintóticas satisfazem quatro famílias de propriedades algébricas:</p>
        <ul>
          <li><strong>Transitividade (vale para todas as 5 notações $\\Theta, O, \\Omega, o, \\omega$):</strong>
            $$f(n) = \\Theta(g(n)) \\text{ e } g(n) = \\Theta(h(n)) \\implies f(n) = \\Theta(h(n)) \\quad (\\text{e analogamente para } O, \\Omega, o, \\omega).$$</li>
          <li><strong>Reflexividade (vale para $\\Theta, O, \\Omega$, mas NÃO vale para $o, \\omega$):</strong>
            $$f(n) = \\Theta(f(n)), \\qquad f(n) = O(f(n)), \\qquad f(n) = \\Omega(f(n)).$$</li>
          <li><strong>Simetria (vale exclusivamente para $\\Theta$, tornando $\\Theta$ uma relação de equivalência!):</strong>
            $$f(n) = \\Theta(g(n)) \\iff g(n) = \\Theta(f(n)).$$</li>
          <li><strong>Simetria de Transposição (dualidade entre $O/\\Omega$ e entre $o/\\omega$):</strong>
            $$f(n) = O(g(n)) \\iff g(n) = \\Omega(f(n)) \\qquad \\text{e} \\qquad f(n) = o(g(n)) \\iff g(n) = \\omega(f(n)).$$</li>
          <li><strong>Falha da Tricotomia:</strong> Para quaisquer dois números reais $a, b \\in \\mathbb{R}$, exatamente uma das relações $a < b$, $a = b$ ou $a > b$ é verdadeira. Porém, <strong>nem todas as funções são assintoticamente comparáveis!</strong> Por exemplo, não podemos comparar $f(n) = n$ com $g(n) = n^{1 + \\sin n}$, pois o expoente $1 + \\sin n$ oscila perpetuamente no intervalo $[0, 2]$, assumindo valores próximos de $0$ (onde $g(n) \\approx 1 < n$) e valores próximos de $2$ (onde $g(n) \\approx n^2 > n$) para valores arbitrariamente grandes de $n$. Assim, $n^{1+\\sin n}$ não é nem $O(n)$ nem $\\Omega(n)$.</li>
        </ul>

        <div id="workbench-mod2-mount"></div>
      `
    },

    /* ======================================================================
       UNIDADE 2.2 — CAPÍTULO 3, SEÇÃO 3.2 PARTE 1 (pp. 54–59)
       ====================================================================== */
    {
      id: "u2-2",
      code: "UNIDADE 2.2 • CAP. 3 (SEÇÃO 3.2 — PARTE 1)",
      pages: "pp. 54–59",
      title: "3.2 Notações Padrão e Funções Comuns (Parte 1: Monotonicidade, Pisos, Tetos, Modular, Polinômios e Exponenciais)",
      content: `
        <p>A Seção 3.2 revisa sistematicamente as funções e notações matemáticas elementares que aparecem em toda a análise de algoritmos e estabelece suas relações assintóticas fundamentais.</p>

        <h3>1. Monotonicidade (p. 54)</h3>
        <ul>
          <li>Uma função $f(n)$ é <strong>monotonicamente crescente</strong> se $m \\le n \\implies f(m) \\le f(n)$.</li>
          <li>Uma função $f(n)$ é <strong>monotonicamente decrescente</strong> se $m \\le n \\implies f(m) \\ge f(n)$.</li>
          <li>Uma função $f(n)$ é <strong>estritamente crescente</strong> se $m < n \\implies f(m) < f(n)$.</li>
          <li>Uma função $f(n)$ é <strong>estritamente decrescente</strong> se $m < n \\implies f(m) > f(n)$.</li>
        </ul>

        <h3>2. Pisos ($\\lfloor x \\rfloor$) e Tetos ($\\lceil x \\rceil$) (pp. 54–55)</h3>
        <p>Para qualquer número real $x$, denotamos o maior inteiro menor ou igual a $x$ por $\\lfloor x \\rfloor$ (<em>"o piso de x"</em>) e o menor inteiro maior ou igual a $x$ por $\\lceil x \\rceil$ (<em>"o teto de x"</em>). Ambas as funções $f(x) = \\lfloor x \\rfloor$ e $f(x) = \\lceil x \\rceil$ são monotonicamente crescentes (mas não estritamente crescentes).</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ IDENTIDADES E DESIGUALDADES DE PISOS E TETOS • EQUAÇÕES (3.3) A (3.7) (p. 55) ]</span>
          <p>Para todo número real $x$, valem as desigualdades fundamentais (3.3):</p>
          $$x - 1 < \\lfloor x \\rfloor \\le x \\le \\lceil x \\rceil < x + 1.$$
          <p>Para qualquer inteiro $n$, vale a partição exata ao meio:</p>
          $$\\lfloor n/2 \\rfloor + \\lceil n/2 \\rceil = n.$$
          <p>E para qualquer número real $n \\ge 0$ e inteiros positivos $a, b > 0$, valem as identidades de divisão aninhada (3.4)–(3.7) (muito usadas ao analisar árvores de recursão e heaps):</p>
          $$\\left\\lceil \\frac{\\lceil n/a \\rceil}{b} \\right\\rceil = \\left\\lceil \\frac{n}{ab} \\right\\rceil, \\qquad \\left\\lfloor \\frac{\\lfloor n/a \\rfloor}{b} \\right\\rfloor = \\left\\lfloor \\frac{n}{ab} \\right\\rfloor, \\qquad \\left\\lceil \\frac{a}{b} \\right\\rceil \\le \\frac{a + (b - 1)}{b}, \\qquad \\left\\lfloor \\frac{a}{b} \\right\\rfloor \\ge \\frac{a - (b - 1)}{b}.$$
        </div>

        <h3>3. Aritmética Modular (p. 55)</h3>
        <p>Para qualquer inteiro $a$ e qualquer inteiro positivo $n$, o valor $a \\bmod n$ é o <strong>resto</strong> do quociente $a/n$, definido formalmente pela Equação (3.8):</p>
        $$a \\bmod n = a - n \\lfloor a/n \\rfloor.$$
        <p>A partir da desigualdade $x - 1 < \\lfloor x \\rfloor \\le x$ com $x = a/n$, segue-se imediatamente a Equação (3.9):</p>
        $$0 \\le a \\bmod n < n$$
        <p>(inclusive quando $a$ é negativo, na convenção matemática do CLRS!). Se $(a \\bmod n) = (b \\bmod n)$, escrevemos $a \\equiv b \\pmod{n}$ e dizemos que $a$ é <strong>equivalente a $b$, módulo $n$</strong> — o que ocorre se e somente se $n$ é um divisor exato de $b - a$. Caso contrário, escrevemos $a \\not\\equiv b \\pmod{n}$.</p>

        <h3>4. Polinômios e Limitação Polinomial (pp. 55–56)</h3>
        <p>Dado um inteiro não negativo $d$, um <strong>polinômio em $n$ de grau $d$</strong> é uma função $p(n)$ da forma:</p>
        $$p(n) = \\sum_{i=0}^{d} a_i n^i = a_0 + a_1 n + a_2 n^2 + \\dots + a_d n^d,$$
        <p>onde as constantes $a_0, a_1, \\dots, a_d$ são os coeficientes do polinômio e $a_d \\ne 0$.</p>
        <ul>
          <li>Um polinômio é <strong>assintoticamente positivo se e somente se $a_d > 0$</strong>.</li>
          <li>Para qualquer polinômio assintoticamente positivo $p(n)$ de grau $d$, temos <strong>$p(n) = \\Theta(n^d)$</strong> (demonstrado de forma geral no Problema 3-1).</li>
          <li>Para qualquer constante real $a \\ge 0$, a função $n^a$ é monotonicamente crescente (para $n \\ge 0$), e para $a \\le 0$ ela é monotonicamente decrescente (para $n > 0$).</li>
          <li>Dizemos que uma função $f(n)$ é <strong>polinomialmente limitada</strong> se $f(n) = O(n^k)$ para alguma constante $k$.</li>
        </ul>

        <h3>5. Exponenciais, Séries de Taylor de $e^x$ e Dominação sobre Polinômios (pp. 56–57)</h3>
        <p>Para todos os valores reais $a > 0$, $m$ e $n$, valem as identidades algébricas $a^0 = 1$, $a^1 = a$, $a^{-1} = 1/a$, $(a^m)^n = a^{mn} = (a^n)^m$ e $a^m a^n = a^{m+n}$. Por convenção no livro, adotamos <strong>$0^0 = 1$</strong> sempre que conveniente (por exemplo, no termo $i=0$ de polinômios e séries de potências). Para todo $n$ e $a \\ge 1$, a função $a^n$ é monotonicamente crescente em $n$.</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ EXPONENCIAIS DOMINAM POLINÔMIOS • EQUAÇÕES (3.10) A (3.14) (pp. 56–57) ]</span>
          <p>Para todas as constantes reais $a$ e $b$ tais que <strong>$a > 1$</strong>, aplicando repetidamente a regra de L'Hôpital (ou análise de razão), temos o limite fundamental (3.10):</p>
          $$\\lim_{n \\to \\infty} \\frac{n^b}{a^n} = 0, \\qquad \\text{do qual concluímos que} \\qquad n^b = o(a^n).$$
          <p>Portanto, <strong>qualquer função exponencial com uma base estritamente maior que $1$ cresce assintoticamente mais rápido que qualquer função polinomial!</strong></p>
          <hr style="border:none;border-top:1px dashed var(--border-color);margin:0.85rem 0;" />
          <p>Denotando por $e = 2{,}71828\\dots$ a base do logaritmo natural, para todo $x \\in \\mathbb{R}$ vale a expansão em série de Taylor (3.11):</p>
          $$e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\dots = \\sum_{i=0}^{\\infty} \\frac{x^i}{i!}.$$
          <p>Dessa série decorrem três propriedades indispensáveis para análise probabilística e assintótica (Capítulos 3 e 5):</p>
          <ol>
            <li><strong>Desigualdade global (3.12):</strong> Para todo $x \\in \\mathbb{R}$, vale a desigualdade
              $$e^x \\ge 1 + x,$$
              onde a igualdade ocorre se e somente se $x = 0$.</li>
            <li><strong>Dupla limitação para $|x| \\le 1$ (3.13):</strong> Quando $|x| \\le 1$, temos a aproximação quadrática:
              $$1 + x \\le e^x \\le 1 + x + x^2, \\qquad \\text{logo } e^x = 1 + x + \\Theta(x^2) \\text{ quando } x \\to 0.$$</li>
            <li><strong>Limite exponencial clássico (3.14):</strong> Para todo $x \\in \\mathbb{R}$,
              $$\\lim_{n \\to \\infty} \\left(1 + \\frac{x}{n}\\right)^n = e^x.$$</li>
          </ol>
        </div>
      `
    },

    /* ======================================================================
       UNIDADE 2.3 — CAPÍTULO 3, SEÇÃO 3.2 PARTE 2 (pp. 57–65)
       ====================================================================== */
    {
      id: "u2-3",
      code: "UNIDADE 2.3 • CAP. 3 (SEÇÃO 3.2 — PARTE 2)",
      pages: "pp. 57–65",
      title: "3.2 Notações Padrão e Funções Comuns (Parte 2: Logaritmos, Fatoriais, Stirling, lg* n e Números de Fibonacci)",
      content: `
        <h3>1. Logaritmos e Limitação Polilogarítmica (pp. 57–58)</h3>
        <p>O livro adota quatro notações logarítmicas padronizadas que devemos distinguir com precisão absoluta:</p>
        <ul>
          <li>$\\lg n = \\log_2 n$ (<strong>logaritmo binário</strong> — base $2$);</li>
          <li>$\\ln n = \\log_e n$ (<strong>logaritmo natural</strong> — base $e$);</li>
          <li>$\\lg^k n = (\\lg n)^k$ (<strong>exponenciação</strong> do valor do logaritmo);</li>
          <li>$\\lg \\lg n = \\lg(\\lg n)$ (<strong>composição</strong> funcional do logaritmo).</li>
        </ul>
        <p><em>Convenção sintática de precedência:</em> Funções logarítmicas aplicam-se apenas ao próximo termo da fórmula; assim, $\\lg n + k$ significa $(\\lg n) + k$, e não $\\lg(n + k)$. Para qualquer base constante $b > 1$ e $n > 0$, a função $\\log_b n$ é estritamente crescente.</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ IDENTIDADES LOGARÍTMICAS (3.15)–(3.18) E POLILOGARITMOS (pp. 57–58) ]</span>
          <p>Para todos $a > 0$, $b > 0$, $c > 0$ (com bases $\\ne 1$) e $n$ real, valem as identidades (3.15) e (3.16):</p>
          $$a = b^{\\log_b a}, \\qquad \\log_c(ab) = \\log_c a + \\log_c b, \\qquad \\log_b a^n = n \\log_b a,$$
          $$\\log_b a = \\frac{\\log_c a}{\\log_c b} \\; (\\text{mudança de base}), \\qquad \\log_b(1/a) = -\\log_b a, \\qquad \\log_b a = \\frac{1}{\\log_a b},$$
          $$a^{\\log_b c} = c^{\\log_b a} \\quad \\text{(Equação 3.16 — troca de base e argumento no expoente!)}.$$
          <p><em>Por que a base do logaritmo não importa dentro de $\\Theta, O, \\Omega$?</em> Pela fórmula de mudança de base, $\\log_b n = \\left(\\frac{1}{\\log_c b}\\right) \\log_c n$. Como $\\frac{1}{\\log_c b}$ é uma constante que não depende de $n$, mudar a base de um logaritmo altera seu valor apenas por um fator constante! Por isso escrevemos $\\Theta(\\lg n)$ sem nos preocuparmos com a base.</p>
          <p>Além disso, para $|x| < 1$ vale a expansão $\\ln(1 + x) = x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\frac{x^4}{4} + \\dots$, e para todo $x > -1$ valem as desigualdades (3.17):</p>
          $$\\frac{x}{1 + x} \\le \\ln(1 + x) \\le x.$$
          <p>Dizemos que uma função $f(n)$ é <strong>polilogaritmicamente limitada</strong> se $f(n) = O(\\lg^k n)$ para alguma constante $k$. Substituindo $n$ por $\\lg n$ e $a$ por $2^a$ no limite exponencial (3.10), obtemos o limite (3.18):</p>
          $$\\lim_{n \\to \\infty} \\frac{\\lg^b n}{n^a} = \\lim_{n \\to \\infty} \\frac{\\lg^b n}{(2^a)^{\\lg n}} = 0 \\implies \\lg^b n = o(n^a) \\quad \\text{para qualquer constante } a > 0.$$
          <p>Portanto, <strong>qualquer função polinomial positiva $n^a$ ($a > 0$) cresce assintoticamente mais rápido que qualquer função polilogarítmica $\\lg^b n$!</strong></p>
        </div>

        <h3>2. Fatoriais e a Aproximação de Stirling (pp. 58–59)</h3>
        <p>A função fatorial $n!$, definida para inteiros $n \\ge 0$ por $n! = 1$ se $n = 0$ e $n! = n \\cdot (n-1)!$ se $n > 0$, representa o número de permutações distintas de $n$ elementos ($n! = 1 \\cdot 2 \\cdot 3 \\cdots n$). Um limite superior imediato porém fraco é $n! \\le n^n$. Um limite simultaneamente superior e inferior extremamente preciso é dado pela célebre <strong>Aproximação de Stirling</strong>:</p>

        <div class="canonical-callout invariant">
          <span class="callout-tag">[ APROXIMAÇÃO DE STIRLING E EQUAÇÕES (3.18)–(3.20) (p. 59) ]</span>
          $$n! = \\sqrt{2\\pi n}\\left(\\frac{n}{e}\\right)^n \\left(1 + \\Theta\\left(\\frac{1}{n}\\right)\\right).$$
          <p>Mais especificamente, para todo inteiro $n \\ge 1$, a Equação (3.20) devida a Robbins garante limites explícitos:</p>
          $$n! = \\sqrt{2\\pi n}\\left(\\frac{n}{e}\\right)^n e^{\\alpha_n}, \\qquad \\text{onde} \\qquad \\frac{1}{12n + 1} < \\alpha_n < \\frac{1}{12n}.$$
          <p>Tomando o logaritmo binário na aproximação de Stirling, obtemos a Equação (3.19) e as relações de dominância estrita do Exercício 3.2-3:</p>
          $$\\lg(n!) = \\Theta(n \\lg n), \\qquad n! = \\omega(2^n) \\qquad \\text{e} \\qquad n! = o(n^n).$$
        </div>

        <h3>3. Iteração Funcional $f^{(i)}(n)$ e o Logaritmo Iterado $\\lg^* n$ (pp. 59–60)</h3>
        <p>Usamos a notação $f^{(i)}(n)$ para indicar a função $f(n)$ aplicada iterativamente $i$ vezes a um valor inicial $n$. Para inteiros não negativos $i$, definimos recursivamente:</p>
        $$f^{(i)}(n) = \\begin{cases} n & \\text{se } i = 0, \\\\ f\\left(f^{(i-1)}(n)\\right) & \\text{se } i > 0. \\end{cases}$$
        <p>Por exemplo, se $f(n) = 2n$, então $f^{(i)}(n) = 2^i n$. Cuidado para jamais confundir $\\lg^{(i)} n$ (aplicar o logaritmo $i$ vezes seguidas: $\\lg(\\lg(\\dots \\lg n))$ ) com $\\lg^i n = (\\lg n)^i$ (elevar $\\lg n$ à potência $i$).</p>
        <p>Com base em $\\lg^{(i)} n$, definimos a função <strong>logaritmo iterado</strong> $\\lg^* n$ (lê-se <em>"log estrela de n"</em>) como o menor número de vezes que precisamos aplicar a função logaritmo binário em sucessão, começando em $n$, para que o resultado se torne menor ou igual a $1$:</p>
        $$\\lg^* n = \\min \\left\\{ i \\ge 0 : \\lg^{(i)} n \\le 1 \\right\\}.$$
        <p>O logaritmo iterado é uma função que cresce de maneira extraordinariamente lenta (aparece, por exemplo, na análise clássica de estruturas de conjuntos disjuntos):</p>
        <ul>
          <li>$\\lg^* 2 = 1$, pois $\\lg^{(1)} 2 = \\lg 2 = 1 \\le 1$;</li>
          <li>$\\lg^* 4 = 2$, pois $\\lg^{(2)} 4 = \\lg(\\lg 4) = \\lg 2 = 1$;</li>
          <li>$\\lg^* 16 = 3$, pois $\\lg^{(3)} 16 = \\lg(\\lg 4) = 1$;</li>
          <li>$\\lg^* 65536 = 4$, pois $65536 = 2^{16}$ e $\\lg^{(4)} 65536 = \\lg^{(3)} 16 = 1$;</li>
          <li>$\\lg^*(2^{65536}) = 5$, pois $\\lg(2^{65536}) = 65536$.</li>
        </ul>
        <p>Como o número estimado de átomos em todo o universo observável é cerca de $10^{80}$ — que é incomensuravelmente menor que $2^{65536} \\approx 2 \\times 10^{19728}$ —, na prática <strong>jamais encontraremos um tamanho de entrada real $n$ para o qual $\\lg^* n > 5$!</strong></p>

        <h3>4. Números de Fibonacci, a Razão Áurea $\\phi$ e a Fórmula de Binet (pp. 60–61)</h3>
        <p>Definimos os <strong>números de Fibonacci</strong> pela recorrência linear de segunda ordem (Equação 3.22):</p>
        $$F_0 = 0, \\qquad F_1 = 1, \\qquad F_i = F_{i-1} + F_{i-2} \\quad \\text{para } i \\ge 2,$$
        <p>gerando a famosa sequência $0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, \\dots$ (que surge na análise de pior caso do algoritmo de Euclides no Capítulo 31 e nos Heaps de Fibonacci no Capítulo 19).</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ RAZÃO ÁUREA φ, CONJUGADO φ̂ E CRESCIMENTO EXPONENCIAL DE FIBONACCI (pp. 60–61) ]</span>
          <p>Os números de Fibonacci estão intimamente ligados à <strong>razão áurea $\\phi$</strong> e ao seu conjugado $\\hat{\\phi}$, que são as duas raízes da equação quadrática $x^2 = x + 1$ (Equação 3.23):</p>
          $$\\phi = \\frac{1 + \\sqrt{5}}{2} = 1{,}61803\\dots \\qquad \\text{e} \\qquad \\hat{\\phi} = \\frac{1 - \\sqrt{5}}{2} = -0{,}61803\\dots$$
          <p>Especificamente, prova-se por indução matemática (Exercício 3.2-7) a fórmula fechada exata (Equação 3.25):</p>
          $$F_i = \\frac{\\phi^i - \\hat{\\phi}^i}{\\sqrt{5}}.$$
          <p>Como $|\\hat{\\phi}| < 1$, para todo $i \\ge 0$ temos $\\frac{|\\hat{\\phi}|^i}{\\sqrt{5}} < \\frac{1}{\\sqrt{5}} < \\frac{1}{2}$, o que implica que:</p>
          $$F_i = \\left\\lfloor \\frac{\\phi^i}{\\sqrt{5}} + \\frac{1}{2} \\right\\rfloor,$$
          <p>ou seja, o $i$-ésimo número de Fibonacci $F_i$ é exatamente igual a $\\phi^i / \\sqrt{5}$ arredondado para o inteiro mais próximo! Consequentemente, <strong>os números de Fibonacci crescem exponencialmente: $F_i = \\Theta(\\phi^i)$</strong>.</p>
        </div>
      `
    },

    /* ======================================================================
       UNIDADE 2.4 — APÊNDICE A, SEÇÃO A.1 (pp. 920–924)
       ====================================================================== */
    {
      id: "u2-4",
      code: "UNIDADE 2.4 • APÊNDICE A (SEÇÃO A.1)",
      pages: "pp. 920–924",
      title: "Apêndice A.1 — Fórmulas e Propriedades de Somatórios (Linearidade, Séries Aritméticas, Geométricas, Harmônicas e Telescópicas)",
      content: `
        <p>Quando um algoritmo contém uma estrutura iterativa (como um laço <code>for</code> ou <code>while</code>), seu tempo de execução total é expresso como a soma dos tempos gastos em cada execução do corpo do laço. Por exemplo, no Capítulo 2 vimos que o pior caso do <code>INSERTION-SORT</code> leva ao somatório $\\sum_{j=2}^{n} j = \\Theta(n^2)$. A Seção A.1 do Apêndice A cataloga as propriedades e fórmulas fechadas essenciais para avaliar séries finitas e infinitas.</p>

        <h3>1. Somas Finitas, Séries Infinitas e Linearidade (pp. 920–921)</h3>
        <p>Dada uma sequência $a_1, a_2, \\dots, a_n$, denotamos a soma finita $a_1 + a_2 + \\dots + a_n$ por $\\sum_{k=1}^{n} a_k$ (se $n = 0$, a soma vazia vale $0$ por definição). Para uma sequência infinita, definimos $\\sum_{k=1}^{\\infty} a_k = \\lim_{n \\to \\infty} \\sum_{k=1}^{n} a_k$. Se o limite existe e é finito, a série <strong>converge</strong>; caso contrário, <strong>diverge</strong>. Se $\\sum_{k=1}^{\\infty} |a_k|$ converge, dizemos que a série é <strong>absolutamente convergente</strong>, e seus termos podem ser somados em qualquer ordem.</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ PROPRIEDADE DE LINEARIDADE E NOTAÇÃO ASSINTÓTICA (p. 921) ]</span>
          <p>Para qualquer constante real $c$ e quaisquer sequências finitas (ou séries infinitas convergentes) $a_k$ e $b_k$:</p>
          $$\\sum_{k=1}^{n} (c a_k + b_k) = c \\sum_{k=1}^{n} a_k + \\sum_{k=1}^{n} b_k.$$
          <p>A propriedade de linearidade aplica-se também a somatórios que incorporam notação $\\Theta$:</p>
          $$\\sum_{k=1}^{n} \\Theta(f(k)) = \\Theta\\left( \\sum_{k=1}^{n} f(k) \\right).$$
          <p>Observe a mudança sutil de escopo: no lado esquerdo, a notação $\\Theta(f(k))$ aplica-se à variável de índice $k$; no lado direito, aplica-se ao parâmetro global $n$!</p>
        </div>

        <h3>2. Séries Aritméticas, Quadrados e Cubos (pp. 921–922)</h3>
        <p>Uma <strong>série aritmética</strong> é a soma dos primeiros $n$ inteiros positivos, dada pela Equação (A.1) (fórmula de Gauss):</p>
        $$\\sum_{k=1}^{n} k = 1 + 2 + \\dots + n = \\frac{1}{2}n(n + 1) = \\Theta(n^2).$$
        <p>Para potências superiores (quadrados, cubos e, em geral, $\\sum_{k=1}^{n} k^p = \\Theta(n^{p+1})$), valem as identidades exatas (A.2) e (A.3):</p>
        $$\\sum_{k=0}^{n} k^2 = \\frac{n(n + 1)(2n + 1)}{6} = \\Theta(n^3) \\qquad \\text{e} \\qquad \\sum_{k=0}^{n} k^3 = \\frac{n^2(n + 1)^2}{4} = \\left(\\frac{n(n+1)}{2}\\right)^2 = \\Theta(n^4).$$

        <h3>3. Séries Geométricas Finitas, Infinitas e Diferenciação de Séries (p. 922)</h3>
        <p>Para qualquer número real $x \\ne 1$, a <strong>série geométrica (ou exponencial)</strong> finita de $n + 1$ termos tem o valor exato dado pela Equação (A.5):</p>

        <div class="canonical-callout invariant">
          <span class="callout-tag">[ SÉRIES GEOMÉTRICAS FINITAS, INFINITAS E DIFERENCIADAS • EQUAÇÕES (A.5), (A.6) E (A.8) ]</span>
          $$\\sum_{k=0}^{n} x^k = 1 + x + x^2 + \\dots + x^n = \\frac{x^{n+1} - 1}{x - 1} = \\frac{1 - x^{n+1}}{1 - x} \\quad (x \\ne 1).$$
          <p>Quando o somatório é infinito e <strong>$|x| < 1$</strong>, temos $x^{n+1} \\to 0$ quando $n \\to \\infty$, produzindo a <strong>série geométrica decrescente infinita</strong> (Equação A.6):</p>
          $$\\sum_{k=0}^{\\infty} x^k = \\frac{1}{1 - x} \\quad (|x| < 1).$$
          <p><strong>Diferenciação e integração de séries (Equação A.8):</strong> Diferenciando ambos os lados de $\\sum_{k=0}^{\\infty} x^k = (1 - x)^{-1}$ em relação a $x$, obtemos $\\sum_{k=1}^{\\infty} k x^{k-1} = \\frac{1}{(1 - x)^2}$. Multiplicando ambos os lados por $x$, obtemos a fórmula fundamental para valores esperados da distribuição geométrica e árvores de recursão:</p>
          $$\\sum_{k=0}^{\\infty} k x^k = \\frac{x}{(1 - x)^2} \\quad (|x| < 1).$$
          <p>Por exemplo, para $x = 1/2$, temos $\\sum_{k=0}^{\\infty} (1/2)^k = \\frac{1}{1 - 1/2} = 2$ e $\\sum_{k=0}^{\\infty} \\frac{k}{2^k} = \\frac{1/2}{(1 - 1/2)^2} = \\frac{1/2}{1/4} = 2$.</p>
        </div>

        <h3>4. Série Harmônica $H_n$ (p. 922)</h3>
        <p>Para todo inteiro positivo $n$, o <strong>$n$-ésimo número harmônico $H_n$</strong> é definido pela Equação (A.7):</p>
        $$H_n = 1 + \\frac{1}{2} + \\frac{1}{3} + \\dots + \\frac{1}{n} = \\sum_{k=1}^{n} \\frac{1}{k} = \\ln n + O(1).$$
        <p>(Mais precisamente, $H_n = \\ln n + \\gamma + O(1/n)$, onde $\\gamma \\approx 0{,}57721\\dots$ é a constante de Euler-Mascheroni). A série harmônica surge diretamente na análise do caso médio do <code>QUICKSORT</code> (Capítulo 7) e na coleta de cupons (Capítulo 5).</p>

        <h3>5. Séries Telescópicas e Produtos (pp. 922–923)</h3>
        <p>Para qualquer sequência $a_0, a_1, \\dots, a_n$, uma soma onde termos adjacentes se cancelam é chamada de <strong>soma telescópica</strong> (Equação A.9):</p>
        $$\\sum_{k=1}^{n} (a_k - a_{k-1}) = a_n - a_0 \\qquad \\text{e, simetricamente,} \\qquad \\sum_{k=0}^{n-1} (a_k - a_{k+1}) = a_0 - a_n.$$
        <p><strong>Exemplo clássico de frações parciais (p. 923):</strong> Para calcular $\\sum_{k=1}^{n-1} \\frac{1}{k(k+1)}$, decompomos o termo geral em frações parciais como $\\frac{1}{k(k+1)} = \\frac{1}{k} - \\frac{1}{k+1}$. Aplicando a propriedade telescópica com $a_k = 1/k$:</p>
        $$\\sum_{k=1}^{n-1} \\frac{1}{k(k+1)} = \\sum_{k=1}^{n-1} \\left(\\frac{1}{k} - \\frac{1}{k+1}\\right) = \\left(1 - \\frac{1}{2}\\right) + \\left(\\frac{1}{2} - \\frac{1}{3}\\right) + \\dots + \\left(\\frac{1}{n-1} - \\frac{1}{n}\\right) = 1 - \\frac{1}{n}.$$
        <p>Por fim, um produto finito $\\prod_{k=1}^{n} a_k = a_1 a_2 \\cdots a_n$ (valendo $1$ quando $n = 0$) pode ser convertido em um somatório aplicando logaritmos via Equação (A.10): $\\lg\\left(\\prod_{k=1}^{n} a_k\\right) = \\sum_{k=1}^{n} \\lg a_k$.</p>
      `
    },

    /* ======================================================================
       UNIDADE 2.5 — APÊNDICE A, SEÇÃO A.2 (pp. 924–930)
       ====================================================================== */
    {
      id: "u2-5",
      code: "UNIDADE 2.5 • APÊNDICE A (SEÇÃO A.2)",
      pages: "pp. 924–930",
      title: "Apêndice A.2 — Limitação de Somatórios (Indução, Limitação de Termos, Quebra de Somatórios e Aproximação por Integrais)",
      content: `
        <p>Na análise de algoritmos, frequentemente nos deparamos com somatórios que não possuem uma fórmula fechada elementar simples, mas para os quais precisamos determinar apenas um limite assintótico superior ($O$), inferior ($\\Omega$) ou justo ($\\Theta$). A Seção A.2 desenvolve os <strong>quatro métodos fundamentais</strong> para limitar somatórios.</p>

        <h3>1. Método 1: Indução Matemática e a Armadilha da Constante Oculta (pp. 924–925)</h3>
        <p>Não é necessário adivinhar a fórmula exata de um somatório para usar indução; podemos provar diretamente por indução que $\\sum_{k=0}^{n} a_k \\le f(n)$ para alguma função com constante explícita $c$.</p>
        <ul>
          <li><strong>Exemplo Correto — Provando que $\\sum_{k=0}^{n} 3^k = O(3^n)$:</strong> Formulamos a hipótese indutiva explícita $\\sum_{k=0}^{n} 3^k \\le c \\cdot 3^n$ para uma constante $c$ a determinar.
            <ul>
              <li><em>Caso base ($n = 0$):</em> $\\sum_{k=0}^{0} 3^k = 3^0 = 1 \\le c \\cdot 3^0 = c$, o que é válido desde que $c \\ge 1$.</li>
              <li><em>Passo indutivo ($n \\to n + 1$):</em> Supondo que o limite vale para $n$, temos:
                $$\\sum_{k=0}^{n+1} 3^k = \\sum_{k=0}^{n} 3^k + 3^{n+1} \\le c \\cdot 3^n + 3^{n+1} = \\left(\\frac{1}{3} + \\frac{1}{c}\\right) c \\cdot 3^{n+1} \\le c \\cdot 3^{n+1},$$
                desde que $\\left(\\frac{1}{3} + \\frac{1}{c}\\right) \\le 1 \\iff \\frac{1}{c} \\le \\frac{2}{3} \\iff c \\ge \\frac{3}{2}$. Escolhendo $c = 3/2$ (que satisfaz também $c \\ge 1$), a indução fecha rigorosamente e prova que $\\sum_{k=0}^{n} 3^k = O(3^n)$!</li>
            </ul>
          </li>
        </ul>

        <div class="canonical-callout invariant">
          <span class="callout-tag">[ ALERTA METODOLÓGICO CRÍTICO • A PROVA FALACIOSA POR INDUÇÃO COM O(·) (p. 925) ]</span>
          <p><strong>Nunca use a própria notação $O(\\cdot)$ sem explicitar a constante $c$ dentro do passo indutivo!</strong> Observe a seguinte "prova" falaciosa de que $\\sum_{k=1}^{n} k = O(n)$ (que sabemos ser falso, pois a soma é $\\Theta(n^2)$):</p>
          <p><em>Falácia:</em> "Para $n=1$, $\\sum_{k=1}^{1} k = 1 = O(1)$. Supondo que para $n$ vale $\\sum_{k=1}^{n} k = O(n)$, então para $n+1$ teríamos $\\sum_{k=1}^{n+1} k = \\sum_{k=1}^{n} k + (n + 1) = O(n) + (n + 1) \\stackrel{?}{=} O(n+1)$."</p>
          <p><strong>Qual é o erro fatal?</strong> Se escrevermos a constante $c$ explicitamente ($\\sum_{k=1}^{n} k \\le cn$), no passo $n+1$ obtemos $cn + (n+1) = (c+1)n + 1$: a "constante" oculta precisou crescer de $c$ para $c+1$ a cada passo, logo ela cresce com $n$ e <strong>não é uma constante fixa!</strong> Em toda prova por indução de limites assintóticos, <em>explicite sempre a constante $c$ e mostre que a mesmíssima constante $c$ funciona para $n+1$</em>.</p>
        </div>

        <h3>2. Método 2: Limitando os Termos (pelo Máximo ou por Série Geométrica) (pp. 925–926)</h3>
        <ol>
          <li><strong>Limitação pelo termo máximo $a_{\\max}$:</strong> Se $a_{\\max} = \\max_{1 \\le k \\le n} a_k$, então $\\sum_{k=1}^{n} a_k \\le n \\cdot a_{\\max}$. Por exemplo, $\\sum_{k=1}^{n} k \\le \\sum_{k=1}^{n} n = n^2 = O(n^2)$ (que é justo para séries polinomiais, mas muito fraco para séries exponenciais).</li>
          <li><strong>Limitação por uma série geométrica decrescente (Critério da Razão Constante $r < 1$):</strong> Dada uma série $\\sum_{k=0}^{n} a_k$ de termos positivos, suponha que exista uma <strong>constante $r$ com $0 < r < 1$</strong> tal que:
            $$\\frac{a_{k+1}}{a_k} \\le r \\quad \\text{para todo } k \\ge 0.$$
            Então $a_k \\le a_0 r^k$ para todo $k$, e podemos limitar a soma por uma série geométrica infinita:
            $$\\sum_{k=0}^{n} a_k \\le \\sum_{k=0}^{\\infty} a_0 r^k = a_0 \\sum_{k=0}^{\\infty} r^k = \\frac{a_0}{1 - r} = O(a_0).$$
            <em>Exemplo do livro (p. 926):</em> Para limitar $\\sum_{k=1}^{n} \\frac{k}{3^k} = \\sum_{k=0}^{n-1} \\frac{k+1}{3^{k+1}}$, notamos que $a_0 = 1/3$ e a razão entre termos consecutivos é $\\frac{a_{k+1}}{a_k} = \\frac{k+2}{3^{k+2}} \\cdot \\frac{3^{k+1}}{k+1} = \\frac{1}{3} \\cdot \\frac{k+2}{k+1} \\le \\frac{2}{3}$ para todo $k \\ge 0$. Como $r = 2/3 < 1$ é uma constante estritamente menor que $1$, concluímos imediatamente que $\\sum_{k=1}^{n} \\frac{k}{3^k} \\le \\frac{1/3}{1 - 2/3} = 1 = O(1)$!</li>
          <li><strong>Armadilha da razão $k/(k+1) < 1$:</strong> Na série harmônica $\\sum_{k=1}^{\\infty} \\frac{1}{k}$, a razão entre termos consecutivos é $\\frac{k}{k+1} < 1$, mas a série <strong>diverge</strong> ($\\to \\infty$)! Por quê? Porque $\\lim_{k\\to\\infty} \\frac{k}{k+1} = 1$, logo não existe nenhuma constante fixa $r < 1$ que limite superiormente $\\frac{k}{k+1}$ para todo $k$.</li>
        </ol>

        <h3>3. Método 3: Quebra (Divisão) de Somatórios (pp. 926–928)</h3>
        <p>Quando limitar todos os termos pelo menor termo dá um limite inferior fraco demais (por exemplo, em $\\sum_{k=1}^{n} k$, o menor termo é $1$, o que daria apenas $\\ge n \\cdot 1 = n$, longe de $\\Omega(n^2)$), <strong>particionamos a faixa de índices</strong> do somatório em duas ou mais partes:</p>
        <ul>
          <li><strong>Quebra ao meio para provar $\\sum_{k=1}^{n} k = \\Omega(n^2)$ (p. 926):</strong> Descartando a primeira metade dos termos e limitando cada termo da segunda metade pelo seu menor valor ($n/2$), obtemos em uma única linha:
            $$\\sum_{k=1}^{n} k = \\sum_{k=1}^{\\lfloor n/2 \\rfloor - 1} k + \\sum_{k=\\lfloor n/2 \\rfloor}^{n} k \\ge 0 + \\sum_{k=\\lceil n/2 \\rceil}^{n} \\frac{n}{2} \\ge \\left(\\frac{n}{2}\\right)\\left(\\frac{n}{2}\\right) = \\frac{n^2}{4} = \\Omega(n^2)!$$</li>
          <li><strong>Separar um número constante $k_0$ de termos iniciais:</strong> Se $a_k$ não depende de $n$, então $\\sum_{k=0}^{n} a_k = \\sum_{k=0}^{k_0 - 1} a_k + \\sum_{k=k_0}^{n} a_k = \\Theta(1) + \\sum_{k=k_0}^{n} a_k$ (útil quando a razão geométrica $a_{k+1}/a_k \\le r < 1$ só passa a valer a partir de $k \\ge k_0$, como em $\\sum k^2/2^k$ para $k \\ge 3$).</li>
          <li><strong>Quebra em blocos diádicos (potências de $2$) para $H_n = O(\\lg n)$ (p. 927):</strong> Agrupando os termos de $H_n = \\sum_{k=1}^{n} \\frac{1}{k}$ em $\\lfloor \\lg n \\rfloor + 1$ blocos onde o $i$-ésimo bloco contém os $2^i$ termos de $k = 2^i$ até $2^{i+1} - 1$:
            $$\\sum_{k=1}^{n} \\frac{1}{k} \\le \\sum_{i=0}^{\\lfloor \\lg n \\rfloor} \\sum_{j=0}^{2^i - 1} \\frac{1}{2^i + j} \\le \\sum_{i=0}^{\\lfloor \\lg n \\rfloor} \\sum_{j=0}^{2^i - 1} \\frac{1}{2^i} = \\sum_{i=0}^{\\lfloor \\lg n \\rfloor} 1 = \\lfloor \\lg n \\rfloor + 1 = O(\\lg n).$$</li>
        </ul>

        <h3>4. Método 4: Aproximação por Integrais (pp. 928–929)</h3>
        <p>Quando o somatório tem a forma $\\sum_{k=m}^{n} f(k)$, onde $f(k)$ é uma função <strong>monotonicamente crescente</strong> ou <strong>monotonicamente decrescente</strong>, comparamos a soma das áreas de retângulos de largura unitária com a integral definida sob a curva $y = f(x)$ (Figura A.1, p. 928):</p>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ TEOREMA DA APROXIMAÇÃO POR INTEGRAIS • EQUAÇÕES (A.11) E (A.12) (pp. 928–929) ]</span>
          <p><strong>Caso 1 — Se $f(x)$ é monotonicamente CRESCENTE (Equação A.11):</strong></p>
          $$\\int_{m-1}^{n} f(x)\\,dx \\le \\sum_{k=m}^{n} f(k) \\le \\int_{m}^{n+1} f(x)\\,dx.$$
          <p><strong>Caso 2 — Se $f(x)$ é monotonicamente DECRESCENTE (Equação A.12):</strong></p>
          $$\\int_{m}^{n+1} f(x)\\,dx \\le \\sum_{k=m}^{n} f(k) \\le \\int_{m-1}^{n} f(x)\\,dx.$$
          <hr style="border:none;border-top:1px dashed var(--border-color);margin:0.85rem 0;" />
          <p><strong>Aplicação Canônica 1 — Limites precisos para o número harmônico $H_n = \\sum_{k=1}^{n} \\frac{1}{k}$ (pp. 928–929):</strong><br/>
          Como $f(k) = 1/k$ é monotonicamente decrescente:</p>
          <ul>
            <li><em>Limite inferior (usando $m = 1$ em A.12):</em> $\\sum_{k=1}^{n} \\frac{1}{k} \\ge \\int_{1}^{n+1} \\frac{dx}{x} = \\ln(n + 1)$.</li>
            <li><em>Limite superior (separando $k = 1$ e aplicando A.12 para $m = 2$):</em> $\\sum_{k=1}^{n} \\frac{1}{k} = 1 + \\sum_{k=2}^{n} \\frac{1}{k} \\le 1 + \\int_{1}^{n} \\frac{dx}{x} = \\ln n + 1$.</li>
          </ul>
          <p>Portanto, para todo $n \\ge 1$, vale o sanduíche estreito:</p>
          $$\\ln(n + 1) \\le \\sum_{k=1}^{n} \\frac{1}{k} \\le \\ln n + 1 \\implies H_n = \\ln n + O(1).$$
          <p><strong>Aplicação Canônica 2 — Provando que $\\sum_{k=1}^{n} \\lg k = \\Theta(n \\lg n)$ (Exercício 3.2-3):</strong><br/>
          Como $f(k) = \\lg k$ é monotonicamente crescente e $\\int \\lg x\\,dx = \\frac{1}{\\ln 2}(x \\ln x - x) = x \\lg x - \\frac{x}{\\ln 2}$, a Equação (A.11) fornece imediatamente:</p>
          $$\\int_{1}^{n} \\lg x\\,dx \\le \\sum_{k=2}^{n} \\lg k \\le \\int_{2}^{n+1} \\lg x\\,dx \\implies \\lg(n!) = \\sum_{k=1}^{n} \\lg k = n \\lg n - \\Theta(n) = \\Theta(n \\lg n).$$
        </div>
      `
    }
  ];

  /* ========================================================================
     BANCADAS INTERATIVAS DO MÓDULO 02 (initWorkbenches)
     ======================================================================== */
  function initWorkbenches() {
    const mount = document.getElementById("workbench-mod2-mount");
    if (!mount) return;

    mount.innerHTML = `
      <div class="workbench-box" style="margin-top:1.75rem;">
        <div class="workbench-header">
          <span class="workbench-title">[ BANCADA INTERATIVA #02 • EXPLORADOR DE SANDUÍCHE ASSINTÓTICO Θ(g(n)) & ESCALA DE FUNÇÕES/SOMATÓRIOS ]</span>
          <span class="bracket-tag dark">CAP. 3 + APÊNDICE A</span>
        </div>
        <div class="workbench-body">
          <p style="font-size:0.9rem;color:var(--ink-secondary);margin-bottom:1rem;">
            <strong>Parte A — Verificador Formal de $\\Theta(n^2)$:</strong> Selecione uma função $f(n)$ e ajuste as constantes $c_1$ e $c_2$ para observar a partir de qual limiar inteiro $n_0$ a desigualdade $0 \\le c_1 n^2 \\le f(n) \\le c_2 n^2$ passa a valer para todo $n \\ge n_0$:
          </p>

          <div class="workbench-controls" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:0.85rem;margin-bottom:1rem;">
            <div>
              <label style="display:block;font-family:var(--font-mono);font-size:0.75rem;font-weight:700;margin-bottom:0.3rem;">FUNÇÃO f(n):</label>
              <select id="mod2-fn-select" class="search-input-brutal" style="width:100%;" onchange="window.updateMod2ThetaSim()">
                <option value="ex1" selected>f(n) = (1/2)n² - 3n  [Exemplo p. 49]</option>
                <option value="ex2">f(n) = 2n² + 3n + 1  [Exemplo p. 51]</option>
                <option value="ex3">f(n) = n(n - 1)/2    [Soma Aritmética Cap. 2]</option>
                <option value="ex4">f(n) = 6n³           [Contraexemplo ≠ Θ(n²)]</option>
              </select>
            </div>
            <div>
              <label style="display:block;font-family:var(--font-mono);font-size:0.75rem;font-weight:700;margin-bottom:0.3rem;">
                CONSTANTE INFERIOR c₁: <span id="mod2-c1-val">0.0714 (≈ 1/14)</span>
              </label>
              <input id="mod2-c1-range" type="range" min="0.02" max="2.50" step="0.01" value="0.07" style="width:100%;" oninput="window.updateMod2ThetaSim()" />
            </div>
            <div>
              <label style="display:block;font-family:var(--font-mono);font-size:0.75rem;font-weight:700;margin-bottom:0.3rem;">
                CONSTANTE SUPERIOR c₂: <span id="mod2-c2-val">0.50</span>
              </label>
              <input id="mod2-c2-range" type="range" min="0.20" max="6.00" step="0.05" value="0.50" style="width:100%;" oninput="window.updateMod2ThetaSim()" />
            </div>
          </div>

          <div id="mod2-theta-telemetry" class="workbench-telemetry-strip" style="margin-bottom:1rem;"></div>
          <div id="mod2-theta-table" style="overflow-x:auto;margin-bottom:1.75rem;"></div>

          <hr style="border:none;border-top:2px solid var(--border-color);margin:1.5rem 0;" />

          <p style="font-size:0.9rem;color:var(--ink-secondary);margin-bottom:0.85rem;">
            <strong>Parte B — Comparador Numérico de Ordens de Crescimento, Stirling, Fibonacci e Somatórios ($H_n$):</strong> Escolha um valor de $n$ para inspecionar simultaneamente a hierarquia de crescimento da Seção 3.2 e as aproximações do Apêndice A:
          </p>
          <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;margin-bottom:1rem;">
            <label style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;">TAMANHO DE ENTRADA (n):</label>
            <select id="mod2-growth-n" class="search-input-brutal" onchange="window.updateMod2GrowthTable()">
              <option value="4">n = 4</option>
              <option value="8">n = 8</option>
              <option value="16" selected>n = 16 (2⁴)</option>
              <option value="32">n = 32 (2⁵)</option>
              <option value="64">n = 64 (2⁶)</option>
              <option value="65536">n = 65.536 (2¹⁶)</option>
            </select>
            <button class="btn-secondary-brutal" type="button" onclick="window.setCanonicalPresetMod2()">
              [ RESTAURAR CONSTANTES CANÔNICAS c₁=1/14, c₂=1/2 ]
            </button>
          </div>
          <div id="mod2-growth-output" style="overflow-x:auto;"></div>
        </div>
      </div>
    `;

    window.setCanonicalPresetMod2 = function () {
      const fnSel = document.getElementById("mod2-fn-select");
      const c1In = document.getElementById("mod2-c1-range");
      const c2In = document.getElementById("mod2-c2-range");
      if (fnSel && c1In && c2In) {
        fnSel.value = "ex1";
        c1In.value = "0.07";
        c2In.value = "0.50";
        window.updateMod2ThetaSim();
      }
    };

    window.updateMod2ThetaSim = function () {
      const fnSel = document.getElementById("mod2-fn-select");
      const c1In = document.getElementById("mod2-c1-range");
      const c2In = document.getElementById("mod2-c2-range");
      const c1Lbl = document.getElementById("mod2-c1-val");
      const c2Lbl = document.getElementById("mod2-c2-val");
      const telem = document.getElementById("mod2-theta-telemetry");
      const tbl = document.getElementById("mod2-theta-table");
      if (!fnSel || !c1In || !c2In || !telem || !tbl) return;

      const fnKey = fnSel.value;
      const c1 = parseFloat(c1In.value);
      const c2 = parseFloat(c2In.value);
      c1Lbl.textContent = c1.toFixed(2) + (Math.abs(c1 - 0.07) < 0.005 ? " (≈ 1/14)" : "");
      c2Lbl.textContent = c2.toFixed(2);

      function evalF(n) {
        if (fnKey === "ex1") return 0.5 * n * n - 3 * n;
        if (fnKey === "ex2") return 2 * n * n + 3 * n + 1;
        if (fnKey === "ex3") return 0.5 * n * (n - 1);
        return 6 * n * n * n;
      }

      const sampleNs = [1, 2, 4, 6, 7, 8, 10, 12, 16, 20, 50];
      let foundN0 = null;
      for (let nTest = 1; nTest <= 200; nTest++) {
        let allValidFromHere = true;
        for (let k = nTest; k <= 250; k++) {
          const val = evalF(k);
          const low = c1 * k * k;
          const high = c2 * k * k;
          if (!(low >= 0 && val >= low - 1e-9 && val <= high + 1e-9)) {
            allValidFromHere = false;
            break;
          }
        }
        if (allValidFromHere) {
          foundN0 = nTest;
          break;
        }
      }

      if (fnKey === "ex4") {
        telem.innerHTML = `
          <div class="telemetry-card">
            <span class="telemetry-label">DIAGNÓSTICO ASSINTÓTICO</span>
            <span class="telemetry-val" style="color:var(--crimson);">6n³ ≠ Θ(n²)</span>
          </div>
          <div class="telemetry-card">
            <span class="telemetry-label">RAZÃO f(n)/n² = 6n</span>
            <span class="telemetry-val">Cresce para ∞ (ultrapassa c₂ em n &gt; ${(c2 / 6).toFixed(2)})</span>
          </div>
          <div class="telemetry-card">
            <span class="telemetry-label">LIMIAR n₀ VÁLIDO</span>
            <span class="telemetry-val">INEXISTENTE (Prova por contradição p. 49)</span>
          </div>
        `;
      } else if (foundN0 !== null) {
        telem.innerHTML = `
          <div class="telemetry-card">
            <span class="telemetry-label">STATUS DO ENCAIXE Θ(n²)</span>
            <span class="telemetry-val" style="color:var(--emerald);">✓ VÁLIDO PARA TODO n ≥ n₀</span>
          </div>
          <div class="telemetry-card">
            <span class="telemetry-label">LIMIAR MÍNIMO ENCONTRADO</span>
            <span class="telemetry-val">n₀ = ${foundN0}</span>
          </div>
          <div class="telemetry-card">
            <span class="telemetry-label">FAIXA DE CONSTANTES</span>
            <span class="telemetry-val">c₁ = ${c1.toFixed(2)}  |  c₂ = ${c2.toFixed(2)}</span>
          </div>
        `;
      } else {
        telem.innerHTML = `
          <div class="telemetry-card">
            <span class="telemetry-label">STATUS DO ENCAIXE Θ(n²)</span>
            <span class="telemetry-val" style="color:var(--crimson);">✗ CONSTANTES INCOMPATÍVEIS</span>
          </div>
          <div class="telemetry-card">
            <span class="telemetry-label">COMO CORRIGIR</span>
            <span class="telemetry-val">Escolha c₁ &lt; coef. líder e c₂ ≥ coef. líder</span>
          </div>
        `;
      }

      let rowsHtml = "";
      sampleNs.forEach((n) => {
        const low = c1 * n * n;
        const fVal = evalF(n);
        const high = c2 * n * n;
        const ok = fVal >= 0 && fVal >= low - 1e-9 && fVal <= high + 1e-9;
        rowsHtml += `
          <tr style="${ok ? "background:rgba(16,185,129,0.08);" : ""}">
            <td style="font-family:var(--font-mono);font-weight:700;">n = ${n}${foundN0 === n ? " ★ (n₀)" : ""}</td>
            <td style="font-family:var(--font-mono);">${low.toFixed(2)}</td>
            <td style="font-family:var(--font-mono);font-weight:700;">${fVal.toFixed(2)}</td>
            <td style="font-family:var(--font-mono);">${high.toFixed(2)}</td>
            <td style="font-family:var(--font-mono);font-weight:700;color:${ok ? "var(--emerald)" : "var(--crimson)"};">
              ${ok ? "✓ Encaixado (c₁n² ≤ f(n) ≤ c₂n²)" : "✗ Fora da faixa"}
            </td>
          </tr>
        `;
      });

      tbl.innerHTML = `
        <table class="clrs-cost-table">
          <thead>
            <tr>
              <th>n</th>
              <th>Limite Inferior c₁n²</th>
              <th>Valor Real f(n)</th>
              <th>Limite Superior c₂n²</th>
              <th>Verificação Formal</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      `;
    };

    window.updateMod2GrowthTable = function () {
      const sel = document.getElementById("mod2-growth-n");
      const out = document.getElementById("mod2-growth-output");
      if (!sel || !out) return;
      const n = parseInt(sel.value, 10);

      function lgStar(x) {
        let count = 0;
        let cur = x;
        while (cur > 1) {
          cur = Math.log2(cur);
          count++;
        }
        return count;
      }

      const lgs = lgStar(n);
      const lgn = Math.log2(n);
      const nlgn = n * lgn;
      const n2 = n * n;
      const sumArith = (n * (n + 1)) / 2;

      let hn = 0;
      const maxHarmLoop = Math.min(n, 100000);
      for (let k = 1; k <= maxHarmLoop; k++) hn += 1 / k;
      const hnApproxLn = Math.log(n) + 0.5772156649;

      const phi = (1 + Math.sqrt(5)) / 2;
      const fibStr =
        n <= 64
          ? Math.round(Math.pow(phi, n) / Math.sqrt(5)).toLocaleString("pt-BR")
          : `≈ 10^${(n * Math.log10(phi) - 0.5 * Math.log10(5)).toFixed(1)}`;

      const pow2Str =
        n <= 32
          ? Math.pow(2, n).toLocaleString("pt-BR")
          : `2^${n} ≈ 10^${(n * Math.log10(2)).toFixed(1)}`;

      let factStr = "";
      let stirlingStr = "";
      if (n <= 16) {
        let f = 1;
        for (let k = 2; k <= n; k++) f *= k;
        const st = Math.sqrt(2 * Math.PI * n) * Math.pow(n / Math.E, n);
        factStr = f.toLocaleString("pt-BR");
        stirlingStr = Math.round(st).toLocaleString("pt-BR") + ` (erro ${(((f - st) / f) * 100).toFixed(2)}%)`;
      } else {
        const log10Fact = 0.5 * Math.log10(2 * Math.PI * n) + n * Math.log10(n / Math.E);
        factStr = `≈ 10^${log10Fact.toFixed(2)}`;
        stirlingStr = `lg(n!) ≈ ${(n * Math.log2(n / Math.E) + 0.5 * Math.log2(2 * Math.PI * n)).toFixed(1)} bits`;
      }

      out.innerHTML = `
        <table class="clrs-cost-table">
          <thead>
            <tr>
              <th>Função / Somatório</th>
              <th>Fórmula / Classe Assintótica</th>
              <th>Valor para n = ${n.toLocaleString("pt-BR")}</th>
              <th>Observação Teórica (Cap. 3 & Apêndice A)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Logaritmo Iterado $\\lg^* n$</strong></td>
              <td>$\\min\\{i \\ge 0 : \\lg^{(i)} n \\le 1\\}$</td>
              <td style="font-family:var(--font-mono);font-weight:700;">${lgs}</td>
              <td>Cresce tão lentamente que $\\lg^* n \\le 5$ para todo $n \\le 2^{65536}$.</td>
            </tr>
            <tr>
              <td><strong>Série Harmônica $H_n$</strong></td>
              <td>$\\sum_{k=1}^{n} \\frac{1}{k} = \\ln n + O(1)$</td>
              <td style="font-family:var(--font-mono);font-weight:700;">${hn.toFixed(4)}</td>
              <td>Sanduíche por integrais: $\\ln(n+1) = ${Math.log(n + 1).toFixed(4)} \\le H_n \\le \\ln n + 1 = ${(Math.log(n) + 1).toFixed(4)}$ (Euler: $\\approx ${hnApproxLn.toFixed(4)}$).</td>
            </tr>
            <tr>
              <td><strong>Logaritmo Binário $\\lg n$</strong></td>
              <td>$\\log_2 n = o(n^a)$</td>
              <td style="font-family:var(--font-mono);font-weight:700;">${lgn.toFixed(2)}</td>
              <td>Qualquer polilogaritmo $\\lg^b n$ é dominado por qualquer potência positiva $n^a$.</td>
            </tr>
            <tr>
              <td><strong>Linearítmica $n \\lg n$</strong></td>
              <td>$\\Theta(\\lg(n!))$</td>
              <td style="font-family:var(--font-mono);font-weight:700;">${nlgn.toLocaleString("pt-BR")}</td>
              <td>Pela aproximação de Stirling (Eq. 3.19), $\\sum_{k=1}^n \\lg k = \\lg(n!) = \\Theta(n \\lg n)$.</td>
            </tr>
            <tr>
              <td><strong>Série Aritmética $\\sum_{k=1}^n k$</strong></td>
              <td>$\\frac{1}{2}n(n+1) = \\Theta(n^2)$</td>
              <td style="font-family:var(--font-mono);font-weight:700;">${sumArith.toLocaleString("pt-BR")}</td>
              <td>Metade de $n^2 = ${n2.toLocaleString("pt-BR")}$; limite inferior por quebra ao meio: $n^2/4 = ${(n2 / 4).toLocaleString("pt-BR")}$.</td>
            </tr>
            <tr>
              <td><strong>Fibonacci $F_n$</strong></td>
              <td>$\\lfloor \\phi^n / \\sqrt{5} + 1/2 \\rfloor = \\Theta(\\phi^n)$</td>
              <td style="font-family:var(--font-mono);font-weight:700;">${fibStr}</td>
              <td>Cresce exponencialmente com base na razão áurea $\\phi \\approx 1{,}61803$.</td>
            </tr>
            <tr>
              <td><strong>Exponencial $2^n$</strong></td>
              <td>$\\omega(n^b)$ para todo $b$</td>
              <td style="font-family:var(--font-mono);font-weight:700;">${pow2Str}</td>
              <td>Qualquer exponencial com base $a > 1$ domina qualquer polinômio $n^b$.</td>
            </tr>
            <tr>
              <td><strong>Fatorial $n!$ (e Stirling)</strong></td>
              <td>$\\sqrt{2\\pi n}(n/e)^n(1+\\Theta(1/n))$</td>
              <td style="font-family:var(--font-mono);font-weight:700;">${factStr}</td>
              <td>Stirling: ${stirlingStr}. Vale $n! = \\omega(2^n)$ e $n! = o(n^n)$.</td>
            </tr>
          </tbody>
        </table>
      `;
    };

    window.updateMod2ThetaSim();
    window.updateMod2GrowthTable();
  }

  /* ========================================================================
     SEÇÃO 3: QUIZZES COMENTADOS (10 QUESTÕES — CAP. 3 E APÊNDICE A)
     ======================================================================== */
  const quizzes = [
    {
      id: "q2-1",
      type: "Múltipla Escolha",
      reference: "Cap. 3, Seção 3.1 (pp. 48–50)",
      question:
        "Ao demonstrar formalmente que f(n) = (1/2)n² - 3n pertence ao conjunto Θ(n²) usando a definição básica 0 ≤ c₁n² ≤ (1/2)n² - 3n ≤ c₂n² para todo n ≥ n₀, qual conjunto de constantes positivas (c₁, c₂, n₀) abaixo satisfaz rigorosamente ambas as desigualdades, e por que n₀ não pode ser escolhido como 5?",
      options: [
        {
          letter: "A",
          text: "c₁ = 1/2, c₂ = 1 e n₀ = 1, pois para n = 1 ambos os lados são positivos.",
          isCorrect: false,
          explanation:
            "Incorreta. Para n = 1, f(1) = 1/2 - 3 = -2,5 < 0! Na verdade, f(n) = (1/2)n² - 3n é negativa para n = 1, 2, 3, 4, 5 e nula para n = 6, portanto jamais poderia satisfazer 0 < c₁n² ≤ f(n) antes de n = 7."
        },
        {
          letter: "B",
          text: "c₁ = 1/14, c₂ = 1/2 e n₀ = 7; não podemos escolher n₀ = 5 (nem n₀ = 6) porque para n ≤ 6 temos (1/2)n² - 3n ≤ 0, violando a exigência de que c₁n² > 0 seja menor ou igual a f(n).",
          isCorrect: true,
          explanation:
            "Correta! Dividindo por n², precisamos de c₁ ≤ 1/2 - 3/n ≤ c₂. Para n ≤ 6, 1/2 - 3/n ≤ 0, impossibilitando c₁ > 0. Para n ≥ 7, temos 1/2 - 3/n ≥ 1/2 - 3/7 = 1/14 > 0 e 1/2 - 3/n < 1/2, validando exatamente c₁ = 1/14, c₂ = 1/2 e n₀ = 7 (p. 49)."
        },
        {
          letter: "C",
          text: "c₁ = 1/14, c₂ = 1/2 e n₀ = 5, pois para n = 5 temos (1/2)(25) - 15 = +2,5.",
          isCorrect: false,
          explanation:
            "Incorreta. Para n = 5, (1/2)(25) - 15 = 12,5 - 15 = -2,5 < 0."
        },
        {
          letter: "D",
          text: "As constantes c₁, c₂ e n₀ devem ser universais e idênticas para todas as funções pertencentes ao conjunto Θ(n²).",
          isCorrect: false,
          explanation:
            "Incorreta. Como os autores frisam na página 49, as constantes c₁, c₂ e n₀ dependem da função específica f(n) analisada."
        }
      ]
    },
    {
      id: "q2-2",
      type: "Múltipla Escolha",
      reference: "Cap. 3, Seção 3.1 (pp. 50–51) e Exercício 3.1-3",
      question:
        "Avalie as seguintes afirmações sobre o uso das notações O, Ω e Θ para descrever o tempo de execução de algoritmos (como a Ordenação por Inserção) e assinale a alternativa CORRETA:",
      options: [
        {
          letter: "A",
          text: "A declaração 'O tempo de execução do algoritmo A é no mínimo O(n²)' é perfeitamente rigorosa e significa que o melhor caso de A é quadrático.",
          isCorrect: false,
          explanation:
            "Incorreta! Este é o clássico Exercício 3.1-3 (p. 54): dizer que o tempo de execução é 'no mínimo O(n²)' não faz sentido (é uma afirmação vazia), pois O(n²) fornece apenas um limite superior! Dizer que T(n) ≥ f(n) para alguma função f(n) ∈ O(n²) permite que f(n) seja 0 ou constante, não impondo nenhum limite inferior real."
        },
        {
          letter: "B",
          text: "Como o tempo de execução do pior caso da ordenação por inserção é Θ(n²), segue-se que o tempo de execução da ordenação por inserção é Θ(n²) para toda entrada.",
          isCorrect: false,
          explanation:
            "Incorreta. Na página 50, os autores explicam que o limite Θ(n²) do pior caso NÃO se estende a todas as entradas, pois para uma entrada já ordenada a ordenação por inserção leva tempo Θ(n)."
        },
        {
          letter: "C",
          text: "O tempo de execução da ordenação por inserção (para qualquer entrada) é simultaneamente Ω(n) e O(n²); além disso, pelo Exercício 3.1-6, o tempo de execução de um algoritmo (em todas as entradas) é Θ(g(n)) se e somente se seu pior caso é O(g(n)) e seu melhor caso é Ω(g(n)).",
          isCorrect: true,
          explanation:
            "Correta! Dizer que o tempo de execução de um algoritmo (sem qualificador) é O(g(n)) limita superiormente todas as entradas (equivale a dizer que o pior caso é O(g(n))), e dizer que é Ω(g(n)) limita inferiormente todas as entradas (equivale a dizer que o melhor caso é Ω(g(n))). Logo, pelo Teorema 3.1, todas as entradas são Θ(g(n)) se e somente se o pior caso é O(g(n)) e o melhor caso é Ω(g(n))."
        },
        {
          letter: "D",
          text: "Uma função linear como 3n + 5 pertence a Θ(n), portanto não pode pertencer ao conjunto O(n²).",
          isCorrect: false,
          explanation:
            "Incorreta. Qualquer função linear an + b com a > 0 pertence a O(n²), pois O exige apenas um limite superior, não que ele seja assintoticamente justo (p. 50)."
        }
      ]
    },
    {
      id: "q2-3",
      type: "Múltipla Escolha",
      reference: "Cap. 3, Seção 3.1 (pp. 51–53)",
      question:
        "Qual é a diferença formal exata entre f(n) = O(g(n)) e f(n) = o(g(n)), e qual é a interpretação correta de uma equação com notação assintótica em ambos os lados, como 2n² + Θ(n) = Θ(n²)?",
      options: [
        {
          letter: "A",
          text: "Em O(g(n)) a desigualdade 0 ≤ f(n) ≤ cg(n) vale para alguma constante c > 0, enquanto em o(g(n)) a desigualdade 0 ≤ f(n) < cg(n) deve valer para todas as constantes c > 0 (para n ≥ n₀ dependente de c); na equação 2n² + Θ(n) = Θ(n²), para qualquer função anônima escolhida em Θ(n) no lado esquerdo, existe uma função anônima em Θ(n²) no lado direito que torna a igualdade verdadeira.",
          isCorrect: true,
          explanation:
            "Correta! Esta alternativa sintetiza com perfeição as páginas 51 e 52 do livro: a troca do quantificador existencial (∃c > 0 em O) pelo universal (∀c > 0 em o, o que implica lim f(n)/g(n) = 0), e a regra de leitura da esquerda para a direita nas equações com funções anônimas."
        },
        {
          letter: "B",
          text: "Em o(g(n)) a desigualdade vale para apenas uma constante c > 0, enquanto em O(g(n)) deve valer para todas as constantes c > 0.",
          isCorrect: false,
          explanation:
            "Incorreta. Os quantificadores foram invertidos: é o(g(n)) que exige validade para toda constante c > 0."
        },
        {
          letter: "C",
          text: "O conjunto o(g(n)) ∩ ω(g(n)) contém todas as funções de Θ(g(n)).",
          isCorrect: false,
          explanation:
            "Incorreta! Pelo Exercício 3.1-7, o(g(n)) ∩ ω(g(n)) = ∅ (conjunto vazio), pois nenhuma função pode satisfazer simultaneamente f(n) < cg(n) e f(n) > cg(n) para n grande."
        },
        {
          letter: "D",
          text: "A expressão ∑_{i=1..n} O(i) significa a soma de n funções anônimas diferentes O(1) + O(2) + ... + O(n), e não possui uma única função de i.",
          isCorrect: false,
          explanation:
            "Incorreta. Na página 52, os autores destacam que o número de funções anônimas é igual ao número de vezes que a notação assintótica aparece escrita; logo, em ∑_{i=1..n} O(i) há apenas uma função anônima de i."
        }
      ]
    },
    {
      id: "q2-4",
      type: "Verdadeiro ou Falso",
      reference: "Cap. 3, Seção 3.1 (pp. 53–54) — Comparação de Funções e Tricotomia",
      question:
        "[ VERDADEIRO OU FALSO ] Embora a transitividade valha para todas as cinco notações assintóticas (Θ, O, Ω, o, ω) e a simetria de transposição garanta que f(n) = O(g(n)) ⇔ g(n) = Ω(f(n)), a propriedade de tricotomia dos números reais NÃO se aplica à comparação assintótica de funções — por exemplo, as funções n e n^(1 + sen n) não são comparáveis (nem O nem Ω uma da outra).",
      options: [
        {
          letter: "V",
          text: "Verdadeiro — Como sen n oscila perpetuamente entre -1 e +1, o expoente 1 + sen n oscila entre 0 e 2 para valores arbitrariamente grandes de n, impedindo qualquer limitação assintótica superior ou inferior por n.",
          isCorrect: true,
          explanation:
            "Correta! Na página 54, Cormen et al. usam exatamente o par n e n^(1 + sen n) para demonstrar que a tricotomia falha para funções assintóticas."
        },
        {
          letter: "F",
          text: "Falso — Quaisquer duas funções assintoticamente positivas f(n) e g(n) devem obrigatoriamente satisfazer f(n) = O(g(n)) ou f(n) = Ω(g(n)).",
          isCorrect: false,
          explanation:
            "Incorreta. Funções osculantes podem violar simultaneamente O e Ω."
        }
      ]
    },
    {
      id: "q2-5",
      type: "Múltipla Escolha",
      reference: "Cap. 3, Seção 3.1, Exercício 3.1-4 e Problema 3-4(d)",
      question:
        "Considere o comportamento assintótico de funções exponenciais: (1) É verdade que 2^(n+1) = O(2^n)? (2) É verdade que 2^(2n) = O(2^n)? (3) Em geral, f(n) = O(g(n)) implica 2^f(n) = O(2^g(n))?",
      options: [
        {
          letter: "A",
          text: "(1) Sim, pois 2^(n+1) = 2 · 2^n; (2) Sim, pois o fator 2 no expoente é uma constante; (3) Sim, sempre.",
          isCorrect: false,
          explanation:
            "Incorreta nos itens (2) e (3)! Multiplicar o expoente por 2 eleva a base ao quadrado: 2^(2n) = (2^n)² = 4^n, e a razão 4^n / 2^n = 2^n → ∞."
        },
        {
          letter: "B",
          text: "(1) Sim, pois 2^(n+1) = 2 · 2^n ≤ c · 2^n para c = 2 e n₀ = 1; (2) Não, pois 2^(2n) = 4^n = 2^n · 2^n, e não existe constante c que limite 2^n para todo n; (3) Não em geral, pois f(n) = 2n e g(n) = n satisfazem 2n = O(n), mas 2^(2n) ≠ O(2^n).",
          isCorrect: true,
          explanation:
            "Correta! Somar uma constante no expoente multiplica a função por uma constante (2^(n+1) = 2 · 2^n = Θ(2^n)), mas multiplicar o expoente por uma constante > 1 altera a própria base da exponencial (2^(2n) = 4^n = ω(2^n))."
        },
        {
          letter: "C",
          text: "(1) Não; (2) Não; (3) Sim.",
          isCorrect: false,
          explanation:
            "Incorreta. 2^(n+1) = 2 · 2^n é claramente Θ(2^n) e portanto O(2^n)."
        },
        {
          letter: "D",
          text: "(1) Sim; (2) Não; (3) Sim, desde que f(n) e g(n) sejam polinômios.",
          isCorrect: false,
          explanation:
            "Incorreta no item (3): f(n) = 2n e g(n) = n são polinômios de grau 1, e mesmo assim 2^(2n) ≠ O(2^n)."
        }
      ]
    },
    {
      id: "q2-6",
      type: "Múltipla Escolha",
      reference: "Cap. 3, Seção 3.2 (pp. 56–59)",
      question:
        "Sobre as relações fundamentais entre polilogaritmos, polinômios, exponenciais e fatoriais estabelecidas na Seção 3.2, assinale a alternativa CORRETA:",
      options: [
        {
          letter: "A",
          text: "Para quaisquer constantes reais a > 1 e b > 0, temos n^b = o(a^n) e lg^b n = o(n^a); além disso, pela aproximação de Stirling, lg(n!) = Θ(n lg n), n! = ω(2^n) e n! = o(n^n).",
          isCorrect: true,
          explanation:
            "Correta! As Equações (3.10), (3.18) e (3.19) estabelecem exatamente essa hierarquia: polilogaritmos são o(polinômios), polinômios são o(exponenciais com base > 1), e n! situa-se estritamente entre 2^n e n^n, com logaritmo Θ(n lg n)."
        },
        {
          letter: "B",
          text: "A função lg(n!) não é polinomialmente limitada, pois n! cresce mais rápido que 2^n.",
          isCorrect: false,
          explanation:
            "Incorreta! No Exercício 3.2-4, como lg(n!) = Θ(n lg n) = O(n²), a função lg(n!) É polinomialmente limitada (assim como lg(lg(n!)) = Θ(lg n) = O(n))."
        },
        {
          letter: "C",
          text: "A identidade de troca de logaritmo no expoente afirma que a^(log_b c) = b^(log_a c).",
          isCorrect: false,
          explanation:
            "Incorreta. A Equação (3.16) correta mantém a base b do logaritmo e permuta a e c: a^(log_b c) = c^(log_b a)."
        },
        {
          letter: "D",
          text: "Para todo número real x, vale e^x ≤ 1 + x.",
          isCorrect: false,
          explanation:
            "Incorreta. Pela Equação (3.12), para todo x real o sentido da desigualdade é o oposto: e^x ≥ 1 + x (e ln(1+x) ≤ x)."
        }
      ]
    },
    {
      id: "q2-7",
      type: "Múltipla Escolha",
      reference: "Cap. 3, Seção 3.2 (pp. 59–61) e Exercício 3.2-5",
      question:
        "Considere a função logaritmo iterado lg* n e os números de Fibonacci F_i: (1) Qual é o valor de lg*(2^65536)? (2) Qual das duas funções é assintoticamente maior: lg(lg* n) ou lg*(lg n)? (3) Qual é a ordem de crescimento assintótico de F_i?",
      options: [
        {
          letter: "A",
          text: "(1) lg*(2^65536) = 16; (2) lg(lg* n) é assintoticamente maior; (3) F_i = Θ(2^i).",
          isCorrect: false,
          explanation:
            "Incorreta nos itens (1) e (3): lg*(2^65536) = 1 + lg*(65536) = 1 + 4 = 5, e F_i = Θ(φ^i) com φ ≈ 1,618 < 2."
        },
        {
          letter: "B",
          text: "(1) lg*(2^65536) = 5; (2) lg*(lg n) é assintoticamente maior que lg(lg* n), pois lg*(lg n) = (lg* n) - 1, e chamando k = lg* n temos k - 1 = ω(lg k); (3) F_i = (φ^i - φ̂^i)/√5 = Θ(φ^i), onde φ = (1 + √5)/2.",
          isCorrect: true,
          explanation:
            "Correta! Para n > 1, aplicar lg uma vez reduz o número de passos restantes para chegar a ≤ 1 em exatamente 1 unidade: lg*(lg n) = lg* n - 1. Fazendo a substituição k = lg* n (que tende ao infinito quando n → ∞), comparamos k - 1 com lg k; como k - 1 = ω(lg k), concluímos que lg*(lg n) é assintoticamente maior que lg(lg* n)!"
        },
        {
          letter: "C",
          text: "(1) lg*(2^65536) = 5; (2) lg(lg* n) e lg*(lg n) são assintoticamente iguais Θ(lg* n); (3) F_i é polinomial.",
          isCorrect: false,
          explanation:
            "Incorreta nos itens (2) e (3): lg(lg* n) = o(lg*(lg n)), e Fibonacci cresce exponencialmente como Θ(φ^i)."
        },
        {
          letter: "D",
          text: "(1) lg*(2^65536) = 4; (2) lg(lg* n) é maior; (3) F_i = Θ(i²).",
          isCorrect: false,
          explanation:
            "Incorreta: lg*(65536) = 4, logo lg*(2^65536) = 5."
        }
      ]
    },
    {
      id: "q2-8",
      type: "Múltipla Escolha",
      reference: "Apêndice A, Seção A.1 (pp. 921–923)",
      question:
        "Utilizando as fórmulas fechadas da Seção A.1 para séries geométricas finitas, séries geométricas infinitas diferenciadas e séries telescópicas, quais são os valores exatos de: (I) ∑_{k=0..∞} (k / 2^k), e (II) ∑_{k=1..n-1} 1 / (k(k+1))?",
      options: [
        {
          letter: "A",
          text: "(I) Vale 2, obtido aplicando ∑_{k=0..∞} k x^k = x / (1 - x)² com x = 1/2; (II) Vale 1 - 1/n, obtido pela decomposição telescópica 1/(k(k+1)) = 1/k - 1/(k+1).",
          isCorrect: true,
          explanation:
            "Correta! Pela Equação (A.8), para x = 1/2 (< 1), ∑_{k=0..∞} k(1/2)^k = (1/2) / (1 - 1/2)² = (1/2) / (1/4) = 2. E pela Equação (A.9), a soma telescópica ∑_{k=1..n-1} (1/k - 1/(k+1)) cancela todos os termos intermediários, restando 1/1 - 1/n = 1 - 1/n."
        },
        {
          letter: "B",
          text: "(I) Diverge para o infinito porque o numerador k cresce linearmente; (II) Vale ln n + O(1).",
          isCorrect: false,
          explanation:
            "Incorreta. O denominador exponencial 2^k domina o numerador linear k, fazendo a série convergir para 2; e a série ∑ 1/(k(k+1)) converge para 1 quando n → ∞."
        },
        {
          letter: "C",
          text: "(I) Vale 1; (II) Vale n / (n + 1) + 1.",
          isCorrect: false,
          explanation:
            "Incorreta: (I) vale 2 e (II) vale 1 - 1/n = (n - 1)/n."
        },
        {
          letter: "D",
          text: "(I) Vale 4; (II) Vale 1/n.",
          isCorrect: false,
          explanation:
            "Incorreta: o fator x = 1/2 no numerador de x/(1-x)² reduz 1/(1/4) = 4 para (1/2)/(1/4) = 2."
        }
      ]
    },
    {
      id: "q2-9",
      type: "Verdadeiro ou Falso",
      reference: "Apêndice A, Seção A.2 (pp. 925–926) — Indução e Série Geométrica",
      question:
        "[ VERDADEIRO OU FALSO ] Na Seção A.2, os autores alertam para dois erros clássicos ao limitar somatórios: (1) usar a notação O(·) diretamente dentro de um passo indutivo sem explicitar a constante c (como na falsa prova de que ∑_{k=1..n} k = O(n) alegando que O(n) + (n+1) = O(n+1)), pois a constante oculta cresce a cada iteração; e (2) concluir que uma série ∑ a_k é limitada por uma série geométrica apenas mostrando que a_{k+1}/a_k < 1 (como k/(k+1) < 1 na série harmônica), quando na verdade é obrigatório exibir uma constante r < 1 fixa tal que a_{k+1}/a_k ≤ r para todo k.",
      options: [
        {
          letter: "V",
          text: "Verdadeiro — Ambos os alertas aparecem explicitamente nas páginas 925 e 926 do Apêndice A como as duas principais armadilhas na limitação de somatórios.",
          isCorrect: true,
          explanation:
            "Correta! Na indução assintótica, a mesma constante c deve funcionar para todo n; e na limitação geométrica, a razão deve ser limitada por uma constante r estritamente menor que 1 (afastada de 1)."
        },
        {
          letter: "F",
          text: "Falso — Sempre que a razão a_{k+1}/a_k entre termos consecutivos for menor que 1, a série infinita converge para O(a₀).",
          isCorrect: false,
          explanation:
            "Incorreta. A série harmônica ∑ 1/k tem razão k/(k+1) < 1 para todo k, mas diverge para o infinito."
        }
      ]
    },
    {
      id: "q2-10",
      type: "Múltipla Escolha",
      reference: "Apêndice A, Seção A.2 (pp. 926–929) — Quebra e Integrais",
      question:
        "Para uma função f(k) monotonicamente CRESCENTE e uma função g(k) monotonicamente DECRESCENTE, quais são os limites de aproximação por integral corretos para ∑_{k=m..n} f(k) e ∑_{k=m..n} g(k), e qual resultado essa técnica fornece quando aplicada a H_n = ∑_{k=1..n} (1/k)?",
      options: [
        {
          letter: "A",
          text: "Para f crescente: ∫_{m-1..n} f(x) dx ≤ ∑_{k=m..n} f(k) ≤ ∫_{m..n+1} f(x) dx; para g decrescente: ∫_{m..n+1} g(x) dx ≤ ∑_{k=m..n} g(k) ≤ ∫_{m-1..n} g(x) dx; aplicando a g(k) = 1/k, obtemos ln(n + 1) ≤ H_n ≤ ln n + 1.",
          isCorrect: true,
          explanation:
            "Correta! Estas são exatamente as Equações (A.11) e (A.12) e a derivação das páginas 928–929 para o n-ésimo número harmônico H_n."
        },
        {
          letter: "B",
          text: "Para qualquer função (crescente ou decrescente), a soma é sempre igual a ∫_{m..n} f(x) dx sem deslocamento de índices nos limites de integração.",
          isCorrect: false,
          explanation:
            "Incorreta. Os limites de integração m-1 e n+1 são indispensáveis para garantir que os retângulos de largura 1 fiquem inteiramente abaixo ou acima da curva."
        },
        {
          letter: "C",
          text: "Aplicando a aproximação por integral a H_n = ∑_{k=1..n} (1/k), concluímos que H_n = O(1).",
          isCorrect: false,
          explanation:
            "Incorreta. A integral de 1/x é ln x, portanto H_n = Θ(lg n) (mais precisamente, ln n + O(1))."
        },
        {
          letter: "D",
          text: "A técnica de aproximação por integrais pode ser aplicada diretamente a funções altamente oscilantes não monótonas, como f(k) = k^(1 + sen k).",
          isCorrect: false,
          explanation:
            "Incorreta. As desigualdades (A.11) e (A.12) exigem que a função seja monotonicamente crescente ou monotonicamente decrescente no intervalo."
        }
      ]
    }
  ];

  /* ========================================================================
     SEÇÃO 4: EXERCÍCIOS E PROBLEMAS CANÔNICOS (8 ATIVIDADES COM SOLUÇÃO)
     ======================================================================== */
  const exercicios = [
    {
      id: "ex2-1",
      code: "EXERCÍCIO 01 • DEMONSTRAÇÃO FORMAL DE max(f(n), g(n)) = Θ(f(n) + g(n))",
      reference: "Exercício 3.1-1 (p. 54)",
      title: "Provar pela Definição de Θ que o Máximo de Duas Funções é Θ de sua Soma",
      prompt: `
        <p><strong>(Exercício 3.1-1)</strong> Sejam $f(n)$ e $g(n)$ funções <strong>assintoticamente não negativas</strong>. Usando a definição básica da notação $\\Theta$, prove rigorosamente que:</p>
        $$\\max(f(n), g(n)) = \\Theta(f(n) + g(n)).$$
        <p><em>Instrução:</em> Especifique explicitamente como obter $n_0$ a partir da não negatividade assintótica de $f(n)$ e $g(n)$, exiba os valores numéricos exatos das constantes $c_1$ e $c_2$, e justifique as duas desigualdades $0 \\le c_1(f(n) + g(n)) \\le \\max(f(n), g(n)) \\le c_2(f(n) + g(n))$ para todo $n \\ge n_0$.</p>
      `,
      placeholder:
        "Sejam n₁ e n₂ tais que f(n) ≥ 0 para n ≥ n₁ e g(n) ≥ 0 para n ≥ n₂. Defina n₀ = max(n₁, n₂) e encontre c₁ e c₂...",
      solution: `
        <h4>Demonstração Completa pela Definição de $\\Theta$</h4>
        <ol>
          <li><strong>Uso da premissa de não negatividade assintótica:</strong> Como $f(n)$ e $g(n)$ são assintoticamente não negativas, existem inteiros positivos $n_1$ e $n_2$ tais que $f(n) \\ge 0$ para todo $n \\ge n_1$ e $g(n) \\ge 0$ para todo $n \\ge n_2$. Definimos:
            $$n_0 = \\max(n_1, n_2).$$
            Então, para todo $n \\ge n_0$, temos simultaneamente $f(n) \\ge 0$ e $g(n) \\ge 0$.</li>
          <li><strong>Limite Superior ($c_2 = 1$):</strong> Como $f(n) \\ge 0$ e $g(n) \\ge 0$ para todo $n \\ge n_0$, temos $f(n) \\le f(n) + g(n)$ e $g(n) \\le f(n) + g(n)$. Logo, o maior entre os dois também não excede a soma:
            $$\\max(f(n), g(n)) \\le 1 \\cdot (f(n) + g(n)).$$</li>
          <li><strong>Limite Inferior ($c_1 = 1/2$):</strong> Por definição de máximo, temos $f(n) \\le \\max(f(n), g(n))$ e $g(n) \\le \\max(f(n), g(n))$. Somando essas duas desigualdades membro a membro:
            $$f(n) + g(n) \\le 2 \\cdot \\max(f(n), g(n)) \\iff \\frac{1}{2}(f(n) + g(n)) \\le \\max(f(n), g(n)).$$</li>
          <li><strong>Conclusão:</strong> Escolhendo as constantes positivas <strong>$c_1 = \\frac{1}{2}$</strong>, <strong>$c_2 = 1$</strong> e <strong>$n_0 = \\max(n_1, n_2)$</strong>, vale para todo $n \\ge n_0$:
            $$0 \\le \\frac{1}{2}(f(n) + g(n)) \\le \\max(f(n), g(n)) \\le 1 \\cdot (f(n) + g(n)),$$
            o que demonstra formalmente que $\\max(f(n), g(n)) = \\Theta(f(n) + g(n))$. $\\blacksquare$</li>
        </ol>
      `
    },
    {
      id: "ex2-2",
      code: "EXERCÍCIO 02 • DESLOCAMENTO DE CONSTANTE EM POTÊNCIAS: (n + a)^b = Θ(n^b)",
      reference: "Exercício 3.1-2 (p. 54)",
      title: "Demonstrar que (n + a)^b = Θ(n^b) para Quaisquer Constantes Reais a e b > 0",
      prompt: `
        <p><strong>(Exercício 3.1-2)</strong> Mostre que, para quaisquer constantes reais $a$ e $b$, onde $b > 0$, vale:</p>
        $$(n + a)^b = \\Theta(n^b).$$
        <p><em>Dica:</em> Você não precisa expandir $(n + a)^b$ pelo teorema binomial (já que $b > 0$ é um número real arbitrário, não necessariamente inteiro!). Em vez disso, limite $n + a$ entre $\\frac{1}{2}n$ e $2n$ para $n \\ge 2|a|$ e eleve a desigualdade à potência positiva $b$.</p>
      `,
      placeholder:
        "Para n ≥ 2|a|, mostre que (1/2)n ≤ n - |a| ≤ n + a ≤ n + |a| ≤ 2n e eleve ambos os lados à potência b > 0...",
      solution: `
        <h4>Demonstração para Qualquer Real $b > 0$</h4>
        <ol>
          <li><strong>Enquadramento linear de $n + a$:</strong> Seja $n_0 = \\max(1, \\lceil 2|a| \\rceil)$. Para todo $n \\ge n_0$, temos $n \\ge 2|a|$, o que equivale a $|a| \\le \\frac{1}{2}n$.</li>
          <li>Subtraindo e somando $|a|$ a $n$, obtemos:
            $$n + a \\ge n - |a| \\ge n - \\frac{1}{2}n = \\frac{1}{2}n > 0,$$
            $$n + a \\le n + |a| \\le n + \\frac{1}{2}n = \\frac{3}{2}n \\le 2n.$$
            Portanto, para todo $n \\ge n_0$, vale:
            $$0 < \\frac{1}{2}n \\le n + a \\le 2n.$$</li>
          <li><strong>Aplicação da monotonicidade de $x^b$ para $b > 0$:</strong> Como $b > 0$, a função $x \\mapsto x^b$ é estritamente crescente para $x > 0$. Elevando todos os membros da desigualdade à potência $b$:
            $$0 \\le \\left(\\frac{1}{2}\\right)^b n^b \\le (n + a)^b \\le 2^b n^b.$$</li>
          <li><strong>Conclusão:</strong> Tomando as constantes positivas <strong>$c_1 = (1/2)^b = 2^{-b}$</strong>, <strong>$c_2 = 2^b$</strong> e <strong>$n_0 = \\max(1, \\lceil 2|a| \\rceil)$</strong>, temos $0 \\le c_1 n^b \\le (n + a)^b \\le c_2 n^b$ para todo $n \\ge n_0$. Logo, $(n + a)^b = \\Theta(n^b)$. $\\blacksquare$</li>
        </ol>
      `
    },
    {
      id: "ex2-3",
      code: "EXERCÍCIO 03 • EXPONENCIAIS, LOGARITMOS E CONJETURAS ASSINTÓTICAS",
      reference: "Exercício 3.1-4 e Problema 3-4 (pp. 54 e 62)",
      title: "Análise de 2^(n+1) vs. 2^(2n) e Demonstração/Refutação de Propriedades em Notação Assintótica",
      prompt: `
        <p>Resolva rigorosamente os seguintes itens sobre manipulação de notação assintótica:</p>
        <ol>
          <li><strong>(Exercício 3.1-4)</strong> Prove ou refute: (i) $2^{n+1} = O(2^n)$; (ii) $2^{2n} = O(2^n)$.</li>
          <li><strong>(Problema 3-4c)</strong> Sejam $f(n)$ e $g(n)$ funções assintoticamente positivas tais que $\\lg(g(n)) \\ge 1$ e $f(n) \\ge 1$ para todo $n$ suficientemente grande. Prove que $f(n) = O(g(n))$ implica $\\lg(f(n)) = O(\\lg(g(n)))$.</li>
          <li><strong>(Problema 3-4h)</strong> Prove que $f(n) + o(f(n)) = \\Theta(f(n))$ para qualquer função assintoticamente positiva $f(n)$.</li>
        </ol>
      `,
      placeholder:
        "Desenvolva as provas algébricas para (1), (2) e (3) usando as definições de O, o e Θ...",
      solution: `
        <h4>1. Resolução do Exercício 3.1-4</h4>
        <ul>
          <li><strong>(i) $2^{n+1} = O(2^n)$ é VERDADEIRO:</strong> Como $2^{n+1} = 2 \\cdot 2^n$, basta escolher $c = 2$ e $n_0 = 1$ para obter $0 \\le 2^{n+1} \\le 2 \\cdot 2^n$ para todo $n \\ge 1$.</li>
          <li><strong>(ii) $2^{2n} = O(2^n)$ é FALSO:</strong> Suponha por contradição que existam constantes positivas $c$ e $n_0$ tais que $2^{2n} \\le c \\cdot 2^n$ para todo $n \\ge n_0$. Como $2^{2n} = (2^n)^2$, dividindo ambos os lados por $2^n > 0$ obtemos $2^n \\le c$ para todo $n \\ge n_0$, o que é absurdo para $n > \\lg c$.</li>
        </ul>

        <h4>2. Resolução do Problema 3-4(c): $f(n) = O(g(n)) \\implies \\lg(f(n)) = O(\\lg(g(n)))$</h4>
        <p>Como $f(n) = O(g(n))$, existem constantes $c > 0$ e $n_1$ tais que $f(n) \\le c \\cdot g(n)$ para todo $n \\ge n_1$. Por hipótese, existe $n_2$ tal que $f(n) \\ge 1$ (logo $\\lg(f(n)) \\ge 0$) e $\\lg(g(n)) \\ge 1$ para todo $n \\ge n_2$. Seja $n_0 = \\max(n_1, n_2)$ e suponha sem perda de generalidade que $c \\ge 2$ (logo $\\lg c \\ge 1$). Como a função $\\lg x$ é estritamente crescente, aplicando $\\lg$ a $1 \\le f(n) \\le c \\cdot g(n)$ para $n \\ge n_0$:</p>
        $$0 \\le \\lg(f(n)) \\le \\lg(c \\cdot g(n)) = \\lg c + \\lg(g(n)) \\le (\\lg c)\\lg(g(n)) + \\lg(g(n)) = (\\lg c + 1)\\lg(g(n)),$$
        <p>onde usamos que $1 \\le \\lg(g(n)) \\implies \\lg c \\le (\\lg c)\\lg(g(n))$. Escolhendo a constante $c' = \\lg c + 1 > 0$, obtemos $0 \\le \\lg(f(n)) \\le c' \\lg(g(n))$ para todo $n \\ge n_0$, provando que $\\lg(f(n)) = O(\\lg(g(n)))$.</p>

        <h4>3. Resolução do Problema 3-4(h): $f(n) + o(f(n)) = \\Theta(f(n))$</h4>
        <p>Seja $h(n) \\in o(f(n))$ uma função anônima qualquer. Pela definição de $o(f(n))$, para qualquer constante $c > 0$ — em particular, escolhendo $c = \\frac{1}{2}$ — existe $n_0 > 0$ tal que $0 \\le h(n) < \\frac{1}{2}f(n)$ para todo $n \\ge n_0$ (ou $|h(n)| < \\frac{1}{2}f(n)$ mesmo se permitirmos $h$ com sinal). Somando $f(n)$ a toda a desigualdade:</p>
        $$\\frac{1}{2}f(n) \\le f(n) + h(n) \\le \\frac{3}{2}f(n) \\quad \\text{para todo } n \\ge n_0.$$
        <p>Logo, $f(n) + h(n) \\in \\Theta(f(n))$ com $c_1 = 1/2$ e $c_2 = 3/2$. $\\blacksquare$</p>
      `
    },
    {
      id: "ex2-4",
      code: "EXERCÍCIO 04 • APROXIMAÇÃO DE STIRLING E FATORIAIS",
      reference: "Exercício 3.2-3 (p. 61)",
      title: "Provar que lg(n!) = Θ(n lg n), n! = ω(2^n) e n! = o(n^n)",
      prompt: `
        <p><strong>(Exercício 3.2-3)</strong> Utilizando a aproximação de Stirling:</p>
        $$n! = \\sqrt{2\\pi n}\\left(\\frac{n}{e}\\right)^n \\left(1 + \\Theta\\left(\\frac{1}{n}\\right)\\right),$$
        <p>demonstre rigorosamente as três propriedades fundamentais da função fatorial:</p>
        <ol>
          <li><strong>(a)</strong> $\\lg(n!) = \\Theta(n \\lg n)$ (Equação 3.19);</li>
          <li><strong>(b)</strong> $n! = \\omega(2^n)$;</li>
          <li><strong>(c)</strong> $n! = o(n^n)$.</li>
        </ol>
      `,
      placeholder:
        "Aplique o logaritmo binário lg na fórmula de Stirling para o item (a) e calcule os limites de n!/2^n e n!/n^n para (b) e (c)...",
      solution: `
        <h4>(a) Prova de $\\lg(n!) = \\Theta(n \\lg n)$ via Aproximação de Stirling</h4>
        <p>Aplicando o logaritmo binário $\\lg$ a ambos os lados da aproximação de Stirling e usando $\\lg(ab) = \\lg a + \\lg b$:</p>
        $$\\lg(n!) = \\lg\\left(\\sqrt{2\\pi n}\\right) + \\lg\\left(\\left(\\frac{n}{e}\\right)^n\\right) + \\lg\\left(1 + \\Theta\\left(\\frac{1}{n}\\right)\\right)$$
        $$\\lg(n!) = \\frac{1}{2}\\lg(2\\pi) + \\frac{1}{2}\\lg n + n \\lg n - n \\lg e + \\Theta\\left(\\frac{1}{n}\\right).$$
        <p>Como $\\frac{1}{2}\\lg(2\\pi) = \\Theta(1)$, $\\frac{1}{2}\\lg n = o(n \\lg n)$ e $n \\lg e = \\Theta(n) = o(n \\lg n)$, o termo dominante é $n \\lg n$ e todos os demais são $o(n \\lg n)$. Pelo Problema 3-4(h), $n \\lg n + o(n \\lg n) = \\mathbf{\\Theta(n \\lg n)}$.</p>
        <p><em>(Alternativamente, sem Stirling: $\\lg(n!) = \\sum_{k=1}^n \\lg k \\le n \\lg n = O(n \\lg n)$ e, quebrando a soma na metade, $\\sum_{k=1}^n \\lg k \\ge \\sum_{k=\\lceil n/2 \\rceil}^n \\lg(n/2) \\ge \\frac{n}{2}(\\lg n - 1) = \\Omega(n \\lg n)$.)</em></p>

        <h4>(b) Prova de $n! = \\omega(2^n)$</h4>
        <p>Pela aproximação de Stirling (ou pela desigualdade $n! \\ge (n/e)^n$), calculamos a razão em relação a $2^n$:</p>
        $$\\frac{n!}{2^n} \\ge \\sqrt{2\\pi n}\\left(\\frac{n}{2e}\\right)^n.$$
        <p>Para $n \\ge 6 > 2e \\approx 5{,}436$, temos $\\frac{n}{2e} > 1$, logo $\\lim_{n \\to \\infty} \\frac{n!}{2^n} = \\infty$, o que prova que $n! = \\omega(2^n)$.</p>

        <h4>(c) Prova de $n! = o(n^n)$</h4>
        <p>Dividindo a fórmula de Stirling por $n^n$:</p>
        $$\\frac{n!}{n^n} = \\sqrt{2\\pi n}\\left(\\frac{1}{e}\\right)^n \\left(1 + \\Theta\\left(\\frac{1}{n}\\right)\\right) = \\frac{\\sqrt{2\\pi} \\cdot n^{1/2}}{e^n}\\left(1 + \\Theta\\left(\\frac{1}{n}\\right)\\right).$$
        <p>Pela Equação (3.10), como $e > 1$, temos $\\lim_{n \\to \\infty} \\frac{n^{1/2}}{e^n} = 0$. Portanto, $\\lim_{n \\to \\infty} \\frac{n!}{n^n} = 0$, o que prova que $n! = o(n^n)$. $\\blacksquare$</p>
      `
    },
    {
      id: "ex2-5",
      code: "EXERCÍCIO 05 • CLASSIFICAÇÃO POR TAXAS DE CRESCIMENTO ASSINTÓTICO",
      reference: "Problema 3-3 (p. 62)",
      title: "Ordenar Funções por Ordem de Crescimento (Ω) e Agrupar em Classes de Equivalência Θ",
      prompt: `
        <p><strong>(Problema 3-3 — Seleção Representativa)</strong> Classifique as 12 funções abaixo em ordem decrescente de crescimento assintótico $g_1, g_2, \\dots, g_{12}$ tais que $g_1 = \\Omega(g_2), g_2 = \\Omega(g_3), \\dots, g_{11} = \\Omega(g_{12})$, agrupando na mesma classe de equivalência $\\Theta$ as funções que satisfazem $f(n) = \\Theta(g(n))$:</p>
        $$\\text{Funções: } \\quad 2^{2^n}, \\quad n!, \\quad (\\lg n)!, \\quad 2^n, \\quad n^3, \\quad n^2, \\quad 4^{\\lg n}, \\quad \\lg(n!), \\quad n \\lg n, \\quad (\\sqrt{2})^{\\lg n}, \\quad \\ln^2 n, \\quad \\lg^* n, \\quad 2^{\\lg^* n}.$$
        <p><em>Dica crucial:</em> Use a identidade $a^{\\log_b c} = c^{\\log_b a}$ (Equação 3.16) para simplificar $4^{\\lg n}$ e $(\\sqrt{2})^{\\lg n}$, e reescreva $(\\lg n)!$ em base exponencial usando Stirling!</p>
      `,
      placeholder:
        "Simplifique primeiro 4^(lg n) e (√2)^(lg n) usando a^(lg n) = n^(lg a), avalie lg(n!) e ordene da maior para a menor...",
      solution: `
        <h4>1. Simplificações Algébricas Preliminares</h4>
        <ul>
          <li>Pela Equação (3.16) ($a^{\\lg n} = n^{\\lg a}$):
            $$4^{\\lg n} = n^{\\lg 4} = n^2 \\implies 4^{\\lg n} = \\Theta(n^2)!$$
            $$(\\sqrt{2})^{\\lg n} = n^{\\lg \\sqrt{2}} = n^{1/2} = \\sqrt{n}.$$</li>
          <li>Pela Equação (3.19) (Stirling):
            $$\\lg(n!) = \\Theta(n \\lg n).$$</li>
          <li>Para $(\\lg n)!$: aplicando Stirling a $m = \\lg n$, temos $(\\lg n)! \\approx \\sqrt{2\\pi \\lg n}\\left(\\frac{\\lg n}{e}\\right)^{\\lg n} = 2^{\\lg\\left((\\lg n)^{\\lg n}\\right) - O(\\lg n)} = n^{\\lg \\lg n - O(1)}$. Como o expoente $\\lg \\lg n \\to \\infty$, $(\\lg n)!$ cresce mais rápido que qualquer polinômio $n^3$ ($\\omega(n^3)$), mas muito mais devagar que $2^n$ ($o(2^n)$)!</li>
        </ul>

        <h4>2. Ordenação Decrescente Completa ($g_1 = \\Omega(g_2) = \\dots$) e Classes $\\Theta$</h4>
        <ol>
          <li><strong>Classe 1 (Dupla Exponencial):</strong> $2^{2^n}$</li>
          <li><strong>Classe 2 (Fatorial):</strong> $n!$</li>
          <li><strong>Classe 3 (Exponencial):</strong> $2^n$</li>
          <li><strong>Classe 4 (Superpolinomial / Subexponencial):</strong> $(\\lg n)!$</li>
          <li><strong>Classe 5 (Cúbica):</strong> $n^3$</li>
          <li><strong>Classe 6 (Quadrática — 2 funções equivalentes em $\\Theta$):</strong> $n^2 \\equiv_{\\Theta} 4^{\\lg n}$</li>
          <li><strong>Classe 7 (Linearítmica — 2 funções equivalentes em $\\Theta$):</strong> $n \\lg n \\equiv_{\\Theta} \\lg(n!)$</li>
          <li><strong>Classe 8 (Raiz quadrada):</strong> $(\\sqrt{2})^{\\lg n} = \\sqrt{n}$</li>
          <li><strong>Classe 9 (Polilogarítmica quadrática):</strong> $\\ln^2 n$</li>
          <li><strong>Classe 10 (Exponencial do log-estrela):</strong> $2^{\\lg^* n}$</li>
          <li><strong>Classe 11 (Logaritmo iterado):</strong> $\\lg^* n$</li>
        </ol>
      `
    },
    {
      id: "ex2-6",
      code: "EXERCÍCIO 06 • SÉRIES INFINITAS DIFERENCIADAS E SOMAS TELESCÓPICAS",
      reference: "Exercícios A.1-1, A.1-2 e A.1-3 (p. 923)",
      title: "Encontrar Fórmulas Fechadas para Séries Aritmético-Geométricas e Telescópicas",
      prompt: `
        <p>Utilizando as técnicas da Seção A.1 (fórmulas de séries, diferenciação de séries geométricas e somas telescópicas), encontre o valor exato de cada somatório:</p>
        <ol>
          <li><strong>(Exercício A.1-2*)</strong> Encontre uma fórmula fechada para a soma de $n$ termos da progressão harmônica com denominador aritmético ou avalie a soma telescópica variante: mostre como calcular $\\sum_{k=1}^{n} \\frac{1}{(2k-1)(2k+1)}$ por decomposição telescópica.</li>
          <li><strong>(Exercício A.1-3)</strong> Mostre que $\\sum_{k=0}^{\\infty} k^2 x^k = \\frac{x(1 + x)}{(1 - x)^3}$ para $0 < |x| < 1$.</li>
        </ol>
      `,
      placeholder:
        "Para o item 1, escreva 1/((2k-1)(2k+1)) = (1/2) · [1/(2k-1) - 1/(2k+1)]; para o item 2, diferencie a Equação (A.8) ∑ k x^k = x/(1-x)² em relação a x e multiplique por x...",
      solution: `
        <h4>1. Soma Telescópica $\\sum_{k=1}^{n} \\frac{1}{(2k-1)(2k+1)}$</h4>
        <p>Decompomos o termo geral em frações parciais observando que $(2k+1) - (2k-1) = 2$:</p>
        $$\\frac{1}{(2k-1)(2k+1)} = \\frac{1}{2}\\left(\\frac{1}{2k-1} - \\frac{1}{2k+1}\\right).$$
        <p>Definindo $a_k = \\frac{1}{2k+1}$ (logo $a_{k-1} = \\frac{1}{2k-1}$ e $a_0 = 1$), aplicamos a propriedade telescópica (A.9):</p>
        $$\\sum_{k=1}^{n} \\frac{1}{(2k-1)(2k+1)} = \\frac{1}{2} \\sum_{k=1}^{n} (a_{k-1} - a_k) = \\frac{1}{2}(a_0 - a_n) = \\frac{1}{2}\\left(1 - \\frac{1}{2n+1}\\right) = \\mathbf{\\frac{n}{2n + 1}}.$$
        <p><em>(Nota sobre o Exercício A.1-2: Para $\\sum_{k=1}^{n} \\frac{1}{2k-1}$, podemos escrevê-la em termos de números harmônicos somando e subtraindo os termos pares: $\\sum_{k=1}^{n} \\frac{1}{2k-1} = \\left(\\sum_{j=1}^{2n} \\frac{1}{j}\\right) - \\left(\\sum_{k=1}^{n} \\frac{1}{2k}\\right) = H_{2n} - \\frac{1}{2}H_n = \\ln(2n) - \\frac{1}{2}\\ln n + O(1) = \\frac{1}{2}\\ln n + O(1)$.)</em></p>

        <h4>2. Demonstração de $\\sum_{k=0}^{\\infty} k^2 x^k = \\frac{x(1 + x)}{(1 - x)^3}$ para $|x| < 1$ (Exercício A.1-3)</h4>
        <p>Partimos da Equação (A.8) já estabelecida na Seção A.1 para $|x| < 1$:</p>
        $$\\sum_{k=0}^{\\infty} k x^k = \\frac{x}{(1 - x)^2}.$$
        <p>Diferenciando ambos os lados em relação a $x$ (pela regra do quociente no lado direito):</p>
        $$\\frac{d}{dx}\\left(\\sum_{k=0}^{\\infty} k x^k\\right) = \\sum_{k=1}^{\\infty} k^2 x^{k-1} = \\frac{1 \\cdot (1 - x)^2 - x \\cdot 2(1 - x)(-1)}{(1 - x)^4} = \\frac{(1 - x) + 2x}{(1 - x)^3} = \\frac{1 + x}{(1 - x)^3}.$$
        <p>Multiplicando ambos os lados por $x$, obtemos exatamente o resultado desejado:</p>
        $$\\sum_{k=0}^{\\infty} k^2 x^k = \\mathbf{\\frac{x(1 + x)}{(1 - x)^3}}. \\quad \\blacksquare$$
      `
    },
    {
      id: "ex2-7",
      code: "EXERCÍCIO 07 • LIMITAÇÃO POR INTEGRAIS E QUEBRA DE SOMATÓRIOS",
      reference: "Exercícios A.2-1 e A.2-2 (p. 929)",
      title: "Provar que ∑(1/k²) é Limitada por Constante e Calcular ∑_{k=0..⌊lg n⌋} ⌈n / 2^k⌉ = O(n)",
      prompt: `
        <p>Aplique os métodos da Seção A.2 para demonstrar os dois limites clássicos abaixo (o segundo aparece diretamente na análise linear de <code>BUILD-MAX-HEAP</code> no Capítulo 6!):</p>
        <ol>
          <li><strong>(Exercício A.2-1)</strong> Mostre que $\\sum_{k=1}^{n} \\frac{1}{k^2}$ é limitada na parte superior por uma constante (isto é, $\\sum_{k=1}^{n} \\frac{1}{k^2} = O(1)$, mais especificamente $\\le 2 - 1/n < 2$) usando aproximação por integral.</li>
          <li><strong>(Exercício A.2-2)</strong> Determine um limite superior assintótico de $O(n)$ para o somatório:
            $$\\sum_{k=0}^{\\lfloor \\lg n \\rfloor} \\left\\lceil \\frac{n}{2^k} \\right\\rceil.$$</li>
        </ol>
      `,
      placeholder:
        "No item 1, separe o termo k = 1 e aplique a integral de 1/x² para k = 2..n; no item 2, use ⌈x⌉ < x + 1 e separe em uma série geométrica mais uma soma de 1s...",
      solution: `
        <h4>1. Resolução do Exercício A.2-1: $\\sum_{k=1}^{n} \\frac{1}{k^2} < 2 = O(1)$</h4>
        <p>Se aplicássemos a Equação (A.12) diretamente para $m = 1$, a integral superior seria $\\int_{0}^{n} \\frac{dx}{x^2}$, que diverge em $x = 0$. Portanto, separamos o primeiro termo ($k = 1$) e aplicamos a Equação (A.12) para $f(x) = 1/x^2$ (monotonicamente decrescente) a partir de $m = 2$:</p>
        $$\\sum_{k=1}^{n} \\frac{1}{k^2} = 1 + \\sum_{k=2}^{n} \\frac{1}{k^2} \\le 1 + \\int_{1}^{n} \\frac{1}{x^2}\\,dx = 1 + \\left[ -\\frac{1}{x} \\right]_{1}^{n} = 1 + \\left(1 - \\frac{1}{n}\\right) = 2 - \\frac{1}{n} < 2.$$
        <p>Logo, para todo $n \\ge 1$, a soma é estritamente menor que $2$, provando que $\\sum_{k=1}^{n} \\frac{1}{k^2} = O(1)$ (como sabemos de Euler, converge para $\\pi^2/6 \\approx 1{,}6449$).</p>

        <h4>2. Resolução do Exercício A.2-2: $\\sum_{k=0}^{\\lfloor \\lg n \\rfloor} \\left\\lceil \\frac{n}{2^k} \\right\\rceil = O(n)$</h4>
        <p>Pela desigualdade de teto $\\lceil x \\rceil < x + 1$ (Equação 3.3), limitamos cada termo superiormente por $\\frac{n}{2^k} + 1$:</p>
        $$\\sum_{k=0}^{\\lfloor \\lg n \\rfloor} \\left\\lceil \\frac{n}{2^k} \\right\\rceil < \\sum_{k=0}^{\\lfloor \\lg n \\rfloor} \\left(\\frac{n}{2^k} + 1\\right) = n \\sum_{k=0}^{\\lfloor \\lg n \\rfloor} \\left(\\frac{1}{2}\\right)^k + \\sum_{k=0}^{\\lfloor \\lg n \\rfloor} 1.$$
        <ul>
          <li>A primeira parcela é limitada pela série geométrica infinita de razão $1/2$: $n \\sum_{k=0}^{\\infty} (1/2)^k = n \\cdot \\frac{1}{1 - 1/2} = 2n$.</li>
          <li>A segunda parcela soma $1$ exatamente $\\lfloor \\lg n \\rfloor + 1$ vezes: $\\lfloor \\lg n \\rfloor + 1 \\le \\lg n + 1 = o(n)$.</li>
        </ul>
        <p>Somando as duas partes: $\\sum_{k=0}^{\\lfloor \\lg n \\rfloor} \\left\\lceil \\frac{n}{2^k} \\right\\rceil < 2n + \\lg n + 1 = \\mathbf{O(n)}$ (e como o termo $k=0$ já vale $n$, o somatório é $\\Theta(n)$). $\\blacksquare$</p>
      `
    },
    {
      id: "ex2-8",
      code: "EXERCÍCIO 08 • PROBLEMA A-1: LIMITES ASSINTOTICAMENTE JUSTOS PARA SOMATÓRIOS",
      reference: "Problema A-1 (p. 929)",
      title: "Determinar Limites Θ Justos para Polinômios, Potências de Logaritmos e Produtos k^r lg^s k",
      prompt: `
        <p><strong>(Problema A-1)</strong> Supondo que $r \\ge 0$ e $s \\ge 0$ sejam constantes reais fixas, determine limites assintoticamente justos ($\\Theta$) para os três somatórios abaixo, justificando cada um por aproximação por integrais ou quebra ao meio:</p>
        <ol>
          <li><strong>(a)</strong> $\\sum_{k=1}^{n} k^r$</li>
          <li><strong>(b)</strong> $\\sum_{k=1}^{n} \\lg^s k$</li>
          <li><strong>(c)</strong> $\\sum_{k=1}^{n} k^r \\lg^s k$</li>
        </ol>
      `,
      placeholder:
        "Use a técnica de quebra do somatório em n/2 (ou aproximação por integrais) para mostrar que, em todos os três casos, a soma de k=1 até n é Θ(n · f(n))...",
      solution: `
        <h4>Princípio Unificador: Quebra do Somatório ao Meio para $f(k)$ Monótona Polinomial/Polilogarítmica</h4>
        <p>Nos três itens, o termo geral $f(k)$ é monotonicamente crescente para $k \\ge 1$ (já que $r \\ge 0$ e $s \\ge 0$). Portanto:</p>
        <ul>
          <li><strong>Limite Superior Imediato (pelo termo máximo $f(n)$):</strong>
            $$\\sum_{k=1}^{n} f(k) \\le \\sum_{k=1}^{n} f(n) = n \\cdot f(n) = O(n \\cdot f(n)).$$</li>
          <li><strong>Limite Inferior por Quebra ao Meio (descartando a primeira metade $k < \\lceil n/2 \\rceil$):</strong>
            $$\\sum_{k=1}^{n} f(k) \\ge \\sum_{k=\\lceil n/2 \\rceil}^{n} f(k) \\ge \\frac{n}{2} \\cdot f\\left(\\frac{n}{2}\\right).$$</li>
        </ul>

        <h4>Aplicação aos Três Casos do Problema A-1</h4>
        <ol>
          <li><strong>(a) $\\sum_{k=1}^{n} k^r = \\Theta(n^{r+1})$:</strong>
            <ul>
              <li>Superior: $\\sum_{k=1}^{n} k^r \\le n \\cdot n^r = n^{r+1} = O(n^{r+1})$ (ou por integral: $\\int_{1}^{n+1} x^r\\,dx = \\frac{(n+1)^{r+1} - 1}{r+1} = \\Theta(n^{r+1})$).</li>
              <li>Inferior: $\\sum_{k=1}^{n} k^r \\ge \\frac{n}{2} \\left(\\frac{n}{2}\\right)^r = \\frac{1}{2^{r+1}} n^{r+1} = \\Omega(n^{r+1})$.</li>
              <li>Pelo Teorema 3.1, $\\sum_{k=1}^{n} k^r = \\mathbf{\\Theta(n^{r+1})}$.</li>
            </ul>
          </li>
          <li><strong>(b) $\\sum_{k=1}^{n} \\lg^s k = \\Theta(n \\lg^s n)$:</strong>
            <ul>
              <li>Superior: $\\sum_{k=1}^{n} \\lg^s k \\le n \\lg^s n = O(n \\lg^s n)$.</li>
              <li>Inferior: Para $n \\ge 4$, temos $\\lg(n/2) = \\lg n - 1 \\ge \\frac{1}{2}\\lg n$. Logo:
                $$\\sum_{k=1}^{n} \\lg^s k \\ge \\frac{n}{2} \\lg^s\\left(\\frac{n}{2}\\right) \\ge \\frac{n}{2}\\left(\\frac{1}{2}\\lg n\\right)^s = \\frac{1}{2^{s+1}} n \\lg^s n = \\Omega(n \\lg^s n).$$</li>
              <li>Pelo Teorema 3.1, $\\sum_{k=1}^{n} \\lg^s k = \\mathbf{\\Theta(n \\lg^s n)}$.</li>
            </ul>
          </li>
          <li><strong>(c) $\\sum_{k=1}^{n} k^r \\lg^s k = \\Theta(n^{r+1} \\lg^s n)$:</strong>
            <ul>
              <li>Superior: $\\sum_{k=1}^{n} k^r \\lg^s k \\le n \\cdot (n^r \\lg^s n) = n^{r+1} \\lg^s n = O(n^{r+1} \\lg^s n)$.</li>
              <li>Inferior (para $n \\ge 4$):
                $$\\sum_{k=1}^{n} k^r \\lg^s k \\ge \\frac{n}{2}\\left(\\frac{n}{2}\\right)^r \\lg^s\\left(\\frac{n}{2}\\right) \\ge \\frac{1}{2^{r+s+1}} n^{r+1} \\lg^s n = \\Omega(n^{r+1} \\lg^s n).$$</li>
              <li>Pelo Teorema 3.1, $\\sum_{k=1}^{n} k^r \\lg^s k = \\mathbf{\\Theta(n^{r+1} \\lg^s n)}$. $\\blacksquare$</li>
            </ul>
          </li>
        </ol>
      `
    }
  ];

  if (typeof window !== "undefined" && typeof window.registerCodexModule === "function") {
    window.registerCodexModule(2, {
      revisao,
      unidades,
      initWorkbenches,
      quizzes,
      exercicios
    });
  }
})();
