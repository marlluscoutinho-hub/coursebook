<h3>1. O Catálogo de Operadores Aritméticos</h3>
        <p>No modo interativo, o interpretador pode ser utilizado como uma sofisticada calculadora algébrica. O livro introduz os seguintes operadores aritméticos fundamentais:</p>

        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header">
            <span class="proc-name">EXPRESSÕES ARITMÉTICAS NO INTERPRETADOR</span>
            <span>[ LISTAGENS 2.1 A 2.6 • OPERADORES NATIVOS ]</span>
          </div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">&gt;&gt;&gt; 2 + 3       <span class="cmt">// Adição: produz 5</span></span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">&gt;&gt;&gt; 5 - 3       <span class="cmt">// Subtração: produz 2</span></span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">&gt;&gt;&gt; 2 * 10      <span class="cmt">// Multiplicação: produz 20</span></span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">&gt;&gt;&gt; 20 / 4      <span class="cmt">// Divisão Real: produz 5.0 (sempre float em Python 3)</span></span></div>
            <div class="code-line"><span class="line-num">5</span><span class="line-content">&gt;&gt;&gt; 2 ** 3      <span class="cmt">// Exponenciação (2³): produz 8</span></span></div>
            <div class="code-line"><span class="line-num">6</span><span class="line-content">&gt;&gt;&gt; 10 % 3      <span class="cmt">// Resto da divisão inteira (módulo): produz 1</span></span></div>
          </div>
        </div>

        <p>Note um detalhe crucial destacado pelo autor: na divisão convencional com o operador barra <code>/</code>, o Python 3 sempre gera como resultado um valor de ponto flutuante (<code>float</code>), razão pela qual <code>20 / 4</code> produz <code>5.0</code> em vez do inteiro <code>5</code>.</p>

        <h3>2. A Hierarquia Universal de Precedência</h3>
        <p>Quando múltiplos operadores coexistem em uma mesma expressão, Python aplica rigorosamente as leis da álgebra matemática, estruturadas na seguinte hierarquia:</p>

        <ol>
          <li><strong>1ª Prioridade Máxima:</strong> Exponenciação (<code>**</code>).</li>
          <li><strong>2ª Prioridade Intermediária:</strong> Multiplicação (<code>*</code>), Divisão real (<code>/</code>), Divisão inteira (<code>//</code>) e Resto da divisão (<code>%</code>).</li>
          <li><strong>3ª Prioridade Básica:</strong> Adição (<code>+</code>) e Subtração (<code>-</code>).</li>
        </ol>

        <p>Operadores situados no mesmo nível de prioridade são avaliados <strong>da esquerda para a direita</strong> (associatividade à esquerda), à exceção da exponenciação, cuja convenção matemática associa da direita para a esquerda. O uso consciente de parênteses <code>( )</code> permite sobrepor qualquer prioridade natural e documentar expressamente a intenção do desenvolvedor.</p>

        :::theorem [Princípio Canônico]
<span class="callout-tag">[ ANÁLISE RIGOROSA • EXERCÍCIO 2.2 DO LIVRO ]</span>
          <strong>Avaliação Passo a Passo da Expressão Canônica:</strong>
          <br>
          Considere a expressão do livro: <code>10 % 3 * 10 ** 2 + 1 - 10 * 4 / 2</code>.
          <br><br>
          <em>Passo 1 (Exponenciação):</em> $10^{2} = 100$. A expressão passa a: <code>10 % 3 * 100 + 1 - 10 * 4 / 2</code>.
          <br>
          <em>Passo 2 (Módulo e Multiplicações/Divisões da esquerda para a direita):</em>
          <br>
          &bull; $10 \% 3 = 1$ (pois $10 = 3 \times 3 + 1$). Ficamos com: <code>1 * 100 + 1 - 10 * 4 / 2</code>.
          <br>
          &bull; $1 \times 100 = 100$. Ficamos com: <code>100 + 1 - 10 * 4 / 2</code>.
          <br>
          &bull; $10 \times 4 = 40$. Ficamos com: <code>100 + 1 - 40 / 2</code>.
          <br>
          &bull; $40 / 2 = 20.0$. Ficamos com: <code>100 + 1 - 20.0</code>.
          <br>
          <em>Passo 3 (Adição e Subtração da esquerda para a direita):</em>
          <br>
          &bull; $100 + 1 = 101$. Ficamos com: <code>101 - 20.0</code>.
          <br>
          &bull; $101 - 20.0 = 81.0$.
          <br><br>
          Portanto, o interpretador avalia a expressão resultando no valor exato de <strong>81.0</strong>.
:::