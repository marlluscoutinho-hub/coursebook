<h3>1. O Modelo Mental da Memória como Estante de Caixas</h3>
        <p>Para desmistificar o funcionamento interno do computador, Nilo Menezes propõe uma analogia clássica: imagine a memória de acesso aleatório (RAM) do computador como uma gigantesca estante repleta de compartimentos etiquetados. Cada compartimento possui um nome e pode armazenar temporariamente um dado.</p>

        <p>Em programação, uma <strong>variável</strong> é a etiqueta que nomeia uma dessas posições de memória. Quando escrevemos <code>a = 2</code>, estamos executando uma operação de <strong>atribuição</strong>. O símbolo de igualdade <code>=</code> deve ser lido semanticamente como <em>"recebe"</em>:</p>
        <p style="text-align:center;font-family:var(--font-mono);font-size:1.05rem;background:var(--bg-paper);padding:0.75rem;border:var(--border-thin);">
          <strong>a = 2</strong> &nbsp;→&nbsp; <em>"A variável <strong>a</strong> recebe o valor numérico <strong>2</strong>"</em>
        </p>

        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header">
            <span class="proc-name">PROGRAMA COM VARIÁVEIS E ATRIBUIÇÃO</span>
            <span>[ LISTAGEM 2.7 • NILO MENEZES ]</span>
          </div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">a = 2</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">b = 3</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">print</span>(a + b)  <span class="cmt">// Calcula o valor na memória e exibe 5</span></span></div>
          </div>
        </div>

        <h3>2. Por que Usar Variáveis? A Separação entre Dados e Algoritmo</h3>
        <p>O autor indaga: por que nos dar ao trabalho de criar duas variáveis <code>a</code> e <code>b</code> apenas para somar dois números se poderíamos simplesmente escrever <code>print(2 + 3)</code> ou <code>print(5)</code>?</p>

        <p>A resposta revela o cerne da engenharia de software:</p>
        <ul>
          <li><strong>Clareza Semântica:</strong> A instrução <code>print(5)</code> é opaca; ela oculta a intenção do programa. Já a declaração de variáveis documenta o problema, explicando o que cada dado representa.</li>
          <li><strong>Reusabilidade e Manutenibilidade:</strong> Em problemas reais, o mesmo dado precisa ser referenciado em múltiplos pontos de uma equação ou sistema. Se o dado de entrada mudar, basta alterar uma única linha de atribuição, mantendo todas as fórmulas subsequentes intactas.</li>
        </ul>

        <p>Essa vantagem se torna evidente na Listagem 2.11 da obra, que modela o cálculo de reajuste salarial:</p>

        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header">
            <span class="proc-name">CÁLCULO DE AUMENTO SALARIAL</span>
            <span>[ LISTAGEM 2.11 • MODELAGEM DE ENTRADAS ]</span>
          </div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">salário = 1500</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">aumento = 5</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">print</span>(salário + (salário * aumento / 100))  <span class="cmt">// Exibe 1575.0</span></span></div>
          </div>
        </div>

        <p>Se utilizássemos literais fixos (<em>hardcoded</em>) como <code>print(1500 + (1500 * 5 / 100))</code>, qualquer alteração no valor do salário exigiria modificar múltiplos pontos da expressão, multiplicando os riscos de esquecimento e inconsistência.</p>