<h3>1. O Interpretador Python e o Ciclo REPL</h3>
        <p>Ao contrário de compiladores tradicionais que traduzem todo o código-fonte de uma só vez para linguagem de máquina gerando um arquivo executável binário (<code>.exe</code> no Windows ou ELF no Linux), Python utiliza um <strong>interpretador</strong>. O interpretador analisa o código, converte-o internamente em <em>bytecode</em> e o executa em uma máquina virtual (Python Virtual Machine — PVM).</p>

        <p>Essa arquitetura permite a existência do <strong>Modo Interativo</strong>, conhecido tecnicamente como <strong>REPL</strong> (<em>Read-Eval-Print Loop</em>):</p>
        <ul>
          <li><strong>Read (Leitura):</strong> O interpretador exibe o prompt primário <code>&gt;&gt;&gt;</code> e aguarda a digitação de uma instrução pelo usuário, finalizada pela tecla <em>Enter</em>.</li>
          <li><strong>Eval (Avaliação):</strong> A linha digitada é imediatamente analisada gramaticalmente e executada pela máquina virtual.</li>
          <li><strong>Print (Impressão):</strong> Caso a instrução produza um valor de retorno, este é imediatamente formatado e exibido na linha subsequente do console.</li>
          <li><strong>Loop (Ciclo):</strong> O prompt <code>&gt;&gt;&gt;</code> reaparece, aguardando o próximo comando.</li>
        </ul>

        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header">
            <span class="proc-name">INTERPRETADOR REPL EM OPERAÇÃO</span>
            <span>[ LISTAGEM 2.1 DO LIVRO • AMBIENTE INTERATIVO ]</span>
          </div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">&gt;&gt;&gt; <span class="kw">print</span>(<span class="cmt">"Oi"</span>)</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">Oi</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">&gt;&gt;&gt; 2 + 3</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content">5</span></div>
          </div>
        </div>

        <h3>2. O Modo Script e Editores de Texto</h3>
        <p>Embora o REPL seja inestimável para experimentar expressões e validar ideias em tempo real, os comandos digitados nele não são persistidos em disco: ao fechar a janela do terminal ou do IDLE, todo o histórico desaparece. Para construir soluções reutilizáveis, escrevemos <strong>scripts</strong>.</p>
        <p>Um script Python é um arquivo de texto simples gravado com a extensão obrigatória <code>.py</code> (por exemplo, <code>teste.py</code>). Nilo Menezes adverte severamente contra o uso de processadores de texto convencionais como Microsoft Word ou LibreOffice Writer, pois tais programas embutem metadados de formatação (fontes, margens, cores) que corrompem a sintaxe do interpretador. Deve-se empregar editores de código puros (como o próprio IDLE, VS Code, Sublime Text, Vim) configurados para a codificação universal <strong>UTF-8</strong>, que viabiliza o uso correto de acentuação e caracteres da língua portuguesa em strings.</p>