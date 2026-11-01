<h3>1. Decomposição Estrutural de print("Oi")</h3>
<p>O primeiro programa formal apresentado no livro é a instrução clássica de exibição em tela. Conforme detalhado na Figura 2.21 da obra, essa linha elementar é constituída por quatro blocos anatômicos que devem ser compreendidos isoladamente:</p>

<div class="clrs-pseudocode-box">
          <div class="pseudocode-header">
            <span class="proc-name">ANATOMIA DA CHAMADA DE FUNÇÃO</span>
            <span>[ FIGURA 2.21 DO LIVRO • ELEMENTOS DA LINGUAGEM ]</span>
          </div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">print</span> ( <span class="cmt">"</span> Oi <span class="cmt">"</span> )</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="cmt">// ↑      ↑  ↑   ↑  ↑</span></span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="cmt">// Função (  Aspas Msg Aspas )</span></span></div>
          </div>
</div>

<ol>
          <li><strong>Nome da Função (<code>print</code>):</strong> É o identificador que invoca a rotina nativa do Python responsável por escrever dados no fluxo de saída padrão (geralmente o console do terminal).</li>
          <li><strong>Parênteses Delimitadores (<code>( )</code>):</strong> Em Python 3, <code>print</code> é estritamente uma função, e seus argumentos devem ser envoltos por parênteses. Omitir os parênteses resulta em <code>SyntaxError: Missing parentheses in call to 'print'</code>.</li>
          <li><strong>Aspas Delimitadoras (<code>" "</code> ou <code>' '</code>):</strong> Indicam ao interpretador o início e o término de um dado do tipo texto (string literal), separando os comandos do programa das mensagens enviadas ao usuário final.</li>
          <li><strong>Mensagem (<code>Oi</code>):</strong> É o conteúdo factual que será transmitido aos olhos do usuário, exatamente na sequência de caracteres especificada.</li>
</ol>

<h3>2. As Quatro Regras Gramaticais de Ouro</h3>
<p>Nilo Coutinho Menezes cataloga os quatro erros mais recorrentes cometidos por iniciantes:</p>

        :::theorem [Princípio Canônico]
<span class="callout-tag">[ REGRAS CRÍTICAS DE DIGITAÇÃO • SEÇÃO 2.4 DO LIVRO ]</span>
          <strong>1. Case Sensitivity (Diferenciação Estrita entre Maiúsculas e Minúsculas):</strong>
          <br>
          Em Python, <code>print</code>, <code>Print</code> e <code>PRINT</code> são identificadores completamente distintos. Como a função nativa é grafada em minúsculas, invocar <code>Print("Oi")</code> provoca uma interrupção com <code>NameError: name 'Print' is not defined</code>.
          <br><br>
          <strong>2. Fechamento de Delimitadores de Texto:</strong>
          <br>
          Toda aspa aberta deve ser obrigatoriamente fechada. Escrever <code>print("Oi)</code> acarreta <code>SyntaxError: EOL while scanning string literal</code>.
          <br><br>
          <strong>3. Integridade dos Parênteses:</strong>
          <br>
          Todo parêntese de abertura requer seu par correspondente de fechamento. Parênteses não são opcionais em chamadas de função.
          <br><br>
          <strong>4. A Relevância dos Espaços e Indentação:</strong>
          <br>
          Diferente de C ou Java (que utilizam chaves <code>{ }</code>), Python utiliza o alinhamento de espaços em branco à esquerda para determinar a hierarquia de blocos lógicos. Adicionar espaços acidentalmente no início de uma instrução solta provoca <code>IndentationError: unexpected indent</code>.
:::