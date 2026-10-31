/**
 * COURSEBOOK — MÓDULO 01 CANÔNICO
 * Obra: Introdução à Programação com Python (2ª Edição) — Nilo Ney Coutinho Menezes
 * Capítulos 1 e 2: O Computador, o Interpretador e os Primeiros Programas (pp. 19–48)
 *
 * Arquitetura Canônica de 3 Seções:
 * 1. Aulas & Bancada Interativa (com Unidades de Aprofundamento e Blocos de Revisão por Unidade)
 * 2. Quizzes Dialéticos (10 questões comentadas alternativa por alternativa)
 * 3. Exercícios Práticos Canônicos (8 problemas com resolução analítica passo a passo)
 */

(function () {
  "use strict";

  const MODULE_ID = 1;

  // ========================================================================
  // SEÇÃO DE REVISÃO (Modo Revisão da Aula — Um Bloco Dedicado por Unidade)
  // ========================================================================
  const revisao = {
    subtitle: "Síntese dos Fundamentos da Computação e do Interpretador Python",
    intro:
      "Esta seção consolida os alicerces teóricos e práticos dos Capítulos 1 e 2 da obra de Nilo Ney Coutinho Menezes. Cada bloco de revisão abaixo sintetiza individualmente uma das unidades temáticas do módulo, proporcionando fixação rápida de conceitos, sintaxe e modelos mentais de execução.",
    pillars: [
      {
        tag: "[ REVISÃO UNIDADE 1.1 • ALGORITMOS E FILOSOFIA ]",
        title: "A Natureza dos Algoritmos e a Escolha de Python",
        body: `
          <p>Um <strong>algoritmo</strong> é uma sequência finita, não ambígua e ordenada de instruções operacionais destinadas a resolver um problema computacional ou realizar uma transformação de dados. Nilo Menezes desmistifica a programação demonstrando que todos nós já executamos algoritmos cotidianos: ao seguir uma receita culinária, traçar itinerários em mapas ou ajustar as horas de um relógio digital.</p>
          <p>A linguagem <strong>Python</strong> foi escolhida como veículo pedagógico central por priorizar a <em>legibilidade do código</em>, apresentar uma sintaxe próxima da linguagem natural humana, adotar tipagem dinâmica de alto nível e possuir uma filosofia pragmática de "baterias inclusas", permitindo que o iniciante se concentre no raciocínio lógico em vez de travar em minúcias burocráticas de compilação.</p>
        `
      },
      {
        tag: "[ REVISÃO UNIDADE 1.2 • AMBIENTE E INTERPRETADOR ]",
        title: "O Interpretador: Ciclo REPL versus Modo Script",
        body: `
          <p>Diferente de linguagens puramente compiladas (como C ou Pascal) que geram binários de máquina antes da execução, Python opera prioritariamente sob um <strong>interpretador</strong>. O ambiente disponibiliza duas formas fundamentais de trabalho:</p>
          <ul>
            <li><strong>Modo Interativo (REPL — Read-Eval-Print Loop):</strong> Acessado via prompt <code>&gt;&gt;&gt;</code> (no terminal ou IDLE). O interpretador lê a instrução imediatamente após a tecla <em>Enter</em>, avalia a expressão, exibe o resultado na tela e aguarda o próximo comando. Ideal para exploração, testes rápidos e depuração de expressões.</li>
            <li><strong>Modo Script (Edição de Arquivos .py):</strong> Conjunto de instruções salvas em um arquivo de texto com codificação <strong>UTF-8</strong> e extensão obrigatória <code>.py</code>. Permite a persistência, execução automatizada em lote e distribuição de programas completos.</li>
          </ul>
        `
      },
      {
        tag: "[ REVISÃO UNIDADE 1.3 • SINTAXE E ELEMENTOS PRIMÁRIOS ]",
        title: "Anatomia da Função print() e Rigor Gramatical",
        body: `
          <p>O primeiro programa canônico decompõe a chamada de função em quatro componentes estruturais: <code>print("Oi")</code> é composto pelo <strong>nome da função</strong> (<code>print</code>), pelos <strong>parênteses obrigatórios</strong> que delimitam os argumentos, pelas <strong>aspas delimitadoras</strong> (simples ou duplas) e pelo <strong>conteúdo literal da mensagem</strong> (a string em si).</p>
          <p>Nilo Menezes enfatiza quatro regras de ouro na digitação de código:</p>
          <ol>
            <li><strong>Sensibilidade a maiúsculas (Case Sensitivity):</strong> <code>print</code> e <code>Print</code> são tokens inteiramente distintos para a gramática de Python; digitar a inicial maiúscula resulta em <code>NameError</code>.</li>
            <li><strong>Pareamento estrito de aspas e parênteses:</strong> Todo delimitador aberto deve ser rigorosamente fechado na mesma expressão.</li>
            <li><strong>Significância dos espaços em branco:</strong> A indentação inicial em Python define blocos de código e não deve ser introduzida aleatoriamente.</li>
          </ol>
        `
      },
      {
        tag: "[ REVISÃO UNIDADE 1.4 • ARITMÉTICA E PRECEDÊNCIA ]",
        title: "Operadores Aritméticos e Ordem Algébrica de Avaliação",
        body: `
          <p>Python atua como uma calculadora científica de alta precisão. Os operadores fundamentais dividem-se em:</p>
          <ul>
            <li>Adição (<code>+</code>) e Subtração (<code>-</code>)</li>
            <li>Multiplicação (<code>*</code>) e Divisão real (<code>/</code>, que sempre retorna um valor de ponto flutuante)</li>
            <li>Exponenciação (<code>**</code>, dois asteriscos adjacentes sem espaço)</li>
            <li>Módulo / Resto da divisão inteira (<code>%</code>) e Divisão de chão (<code>//</code>)</li>
          </ul>
          <p>A precedência segue a álgebra matemática estrita: <strong>1º Exponenciação (<code>**</code>)</strong> $\\to$ <strong>2º Multiplicação, Divisão e Resto (<code>*</code>, <code>/</code>, <code>%</code>)</strong> $\\to$ <strong>3º Adição e Subtração (<code>+</code>, <code>-</code>)</strong>. Operadores de mesma prioridade são avaliados da esquerda para a direita, e os parênteses <code>( )</code> são os únicos modificadores universais da ordem de avaliação.</p>
        `
      },
      {
        tag: "[ REVISÃO UNIDADE 1.5 • MEMÓRIA E ATRIBUIÇÃO ]",
        title: "Modelo Mental de Variáveis: Rótulos e Compartimentos de Memória",
        body: `
          <p>Em programação de computadores, uma <strong>variável</strong> não é uma incógnita a ser calculada como na álgebra escolar, mas sim um <strong>rótulo simbólico que referencia um endereço ou compartimento de memória</strong> onde um dado é armazenado.</p>
          <p>O símbolo <code>=</code> é o <strong>operador de atribuição</strong>, lido semanticamente como <em>"recebe"</em> (ex.: <code>salario = 1500</code> lê-se <em>"a variável salário recebe o valor 1500"</em>). O uso de variáveis confere clareza semântica, elimina "números mágicos" no código e permite a recomputação dinâmica de fórmulas sem a necessidade de reescrever estruturas inteiras.</p>
        `
      }
    ],
    checklist: [
      "Compreendo a definição de algoritmo como sequência ordenada e não ambígua de instruções computacionais.",
      "Sei operar o interpretador Python tanto no modo interativo (REPL) quanto através de scripts salvos em arquivos .py.",
      "Identifico os elementos formais da função print(): identificador da função, parênteses delimitadores e aspas literais.",
      "Domino a hierarquia de precedência de operadores aritméticos (**, *, /, %, +, -) e o uso de parênteses para forçar a ordem.",
      "Compreendo o operador de atribuição (=) e sei utilizar variáveis para separar os dados de entrada das fórmulas de cálculo."
    ]
  };

  // ========================================================================
  // SEÇÃO DE UNIDADES DE APROFUNDAMENTO (Modo Padrão da Aula)
  // ========================================================================
  const unidades = [
    {
      id: "u1-1",
      code: "1.1",
      title: "O Desafio da Programação, Algoritmos Cotidianos e a Filosofia do Python",
      reading: "Capítulo 1 (pp. 19–26)",
      content: `
        <h3>1. A Essência do Raciocínio Algorítmico</h3>
        <p>Aprender a programar computadores é muito mais do que decorar vocabulários ou sintaxes de comandos: é desenvolver uma disciplina de raciocínio lógico e estruturado. Nilo Ney Coutinho Menezes inicia sua obra com um alerta fundamental para todo estudante: a programação exige paciência, observação atenta a detalhes e a humildade de entender que o computador não toma iniciativas próprias — ele executa rigorosamente, e de forma literal, aquilo que lhe foi ordenado.</p>

        <p>Um <strong>algoritmo</strong> pode ser compreendido como uma sequência finita, passo a passo e desprovida de ambiguidades, que transforma uma entrada de dados em uma saída útil. No nosso cotidiano, todos nós executamos procedimentos algorítmicos com frequência:</p>

        <ul>
          <li><strong>O ajuste do relógio digital:</strong> Apertar o botão de configuração até o dígito de horas piscar; incrementar o número até a hora desejada; avançar para os minutos; iterar até finalizar a data. Se um passo for invertido, o relógio assumirá um horário incorreto.</li>
          <li><strong>O itinerário em mapas urbanos:</strong> "Seguir 3 quadras em frente, virar à esquerda no semáforo, avançar 200 metros até o rio". Instruções imprecisas levam ao extravio completo do viajante.</li>
          <li><strong>A receita culinária:</strong> A relação exata dos ingredientes e a cronologia estrita de mistura, cozedura e tempo de forno. Tentar assar o bolo antes de misturar a farinha resulta em falha catastrófica.</li>
        </ul>

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ PRINCÍPIO PEDAGÓGICO DE COUTINHO MENEZES • CAPÍTULO 1 ]</span>
          <strong>A Regra da Paciência e Atenção ao Erro:</strong>
          <br><br>
          <em>"Programar exige muita paciência e, principalmente, atenção a detalhes. Uma simples vírgula no lugar de um ponto ou aspas esquecidas podem arruinar seu programa. No início, é comum perder a calma ou mesmo se desesperar até aprender a ler o que realmente escrevemos em nossos programas. Nessas horas, paciência nunca é demais. Nunca pense que o computador está contra você, nem culpe o dia ou o destino."</em> (Nilo Ney C. Menezes, p. 20).
        </div>

        <h3>2. Por que Python?</h3>
        <p>Criada no início dos anos 1990 por Guido van Rossum na Holanda, a linguagem <strong>Python</strong> foi concebida com um foco primordial na legibilidade e expressividade do código. Enquanto em linguagens como C ou Java o iniciante precisa lidar imediatamente com diretivas de compilação, tipos estáticos de memória, pontuação densa e declarações de classes antes mesmo de conseguir exibir uma palavra na tela, em Python a barreira inicial de entrada é mínima.</p>

        <p>O autor pontua as vantagens canônicas que tornam Python a ferramenta ideal para o aprendizado de algoritmos:</p>
        <ol>
          <li><strong>Sintaxe Limpa e Próxima do Pseudocódigo:</strong> As construções da linguagem assemelham-se ao inglês simples, permitindo focar diretamente na lógica da solução.</li>
          <li><strong>Linguagem Multiplataforma:</strong> O mesmo código executa de forma idêntica em ambientes Windows, Linux e macOS sem necessidade de alterações no arquivo-fonte.</li>
          <li><strong>Multi-paradigma e Baterias Inclusas:</strong> Suporta programação procedural estruturada, orientação a objetos e programação funcional, acompanhada de uma biblioteca padrão rica para manipulação de arquivos, strings e bancos de dados.</li>
          <li><strong>Comunidade e Software Livre:</strong> Python é software aberto mantido pela Python Software Foundation (PSF), com vasta documentação e bibliotecas especializadas.</li>
        </ol>
      `
    },
    {
      id: "u1-2",
      code: "1.2",
      title: "A Arquitetura do Interpretador: Modo Direto (REPL) vs. Modo Script",
      reading: "Capítulo 2 (pp. 27–40)",
      content: `
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
      `
    },
    {
      id: "u1-3",
      code: "1.3",
      title: "Anatomia do Primeiro Programa e Cuidados Críticos de Digitação",
      reading: "Capítulo 2 (pp. 40–44)",
      content: `
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

        <div class="canonical-callout theorem">
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
        </div>
      `
    },
    {
      id: "u1-4",
      code: "1.4",
      title: "Operações Aritméticas e Ordem de Precedência Algébrica",
      reading: "Capítulo 2 (pp. 42–44)",
      content: `
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

        <div class="canonical-callout theorem">
          <span class="callout-tag">[ ANÁLISE RIGOROSA • EXERCÍCIO 2.2 DO LIVRO ]</span>
          <strong>Avaliação Passo a Passo da Expressão Canônica:</strong>
          <br>
          Considere a expressão do livro: <code>10 % 3 * 10 ** 2 + 1 - 10 * 4 / 2</code>.
          <br><br>
          <em>Passo 1 (Exponenciação):</em> $10^{2} = 100$. A expressão passa a: <code>10 % 3 * 100 + 1 - 10 * 4 / 2</code>.
          <br>
          <em>Passo 2 (Módulo e Multiplicações/Divisões da esquerda para a direita):</em>
          <br>
          &bull; $10 \\% 3 = 1$ (pois $10 = 3 \\times 3 + 1$). Ficamos com: <code>1 * 100 + 1 - 10 * 4 / 2</code>.
          <br>
          &bull; $1 \\times 100 = 100$. Ficamos com: <code>100 + 1 - 10 * 4 / 2</code>.
          <br>
          &bull; $10 \\times 4 = 40$. Ficamos com: <code>100 + 1 - 40 / 2</code>.
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
        </div>
      `
    },
    {
      id: "u1-5",
      code: "1.5",
      title: "Conceito de Variáveis, Atribuição e Modelo Mental de Memória",
      reading: "Capítulo 2 (pp. 44–48)",
      content: `
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
      `
    },
    {
      id: "u1-6",
      code: "1.6",
      title: "Bancada Interativa: Simulador do Ciclo REPL & Tabela de Símbolos",
      reading: "Prática Integrada (pp. 34–48)",
      content: `
        <h3>1. Experimentação Tátil do Ambiente de Execução</h3>
        <p>Para consolidar os modelos mentais do Módulo 01, utilize a bancada interativa abaixo. Nela você poderá experimentar o comportamento do interpretador Python em tempo real: carregar programas canônicos do livro de Nilo Menezes, inspecionar o processo de avaliação das expressões, visualizar a tabela de variáveis alocadas na memória e acompanhar a saída gerada no terminal virtual.</p>

        <!-- Ponto de Montagem Obrigatório da Bancada Interativa -->
        <div id="workbench-mod1-mount"></div>
      `
    }
  ];

  // ========================================================================
  // BANCADA INTERATIVA: SIMULADOR REPL & MEMÓRIA VIRTUAL (Vanilla JS)
  // ========================================================================
  function initWorkbenches() {
    const mount = document.getElementById("workbench-mod1-mount");
    if (!mount || mount.dataset.initialized === "true") return;
    mount.dataset.initialized = "true";

    mount.innerHTML = `
      <div class="workbench-box" style="margin-top:1.5rem;">
        <div class="workbench-header">
          <span class="workbench-title">[ BANCADA INTERATIVA • SIMULADOR DO CICLO REPL &amp; MEMÓRIA VIRTUAL ]</span>
          <span class="bracket-tag amber">STEP-BY-STEP • VANILLA JS</span>
        </div>
        <div class="workbench-body">
          <p style="font-size:0.88rem;color:var(--ink-secondary);margin-bottom:0.9rem;">
            Experimente o comportamento do interpretador interativo de Python. Selecione um exemplo do livro de Nilo Menezes ou digite suas próprias instruções para acompanhar a tokenização, a atualização da tabela de variáveis na memória e o console de saída.
          </p>

          <!-- Seletor de Programas Canônicos do Livro -->
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;margin-bottom:1rem;background:var(--bg-paper);padding:0.75rem;border:var(--border-thin);">
            <label for="wb1-program-select" style="font-family:var(--font-mono);font-size:0.8rem;font-weight:700;">
              PROGRAMAS DO LIVRO:
            </label>
            <select id="wb1-program-select" style="padding:0.35rem 0.6rem;font-family:var(--font-mono);font-size:0.82rem;border:var(--border-strong);background:var(--bg-card);flex:1;min-width:220px;">
              <option value="prog1">Listagem 1.1: Programa Olá Mundo (print('Oi'))</option>
              <option value="prog2">Listagem 2.1 a 2.6: Operações Aritméticas e Precedência</option>
              <option value="prog3" selected>Listagem 2.7: Primeiro Programa com Variáveis (a + b)</option>
              <option value="prog4">Listagem 2.11: Reajuste Salarial (1500 + 5%)</option>
              <option value="prog5">Exercício 2.2: Expressão Complexa de Precedência (81.0)</option>
              <option value="prog6">Exercício 2.6: Salário de R$ 750 com 15% de Aumento</option>
            </select>
            <button id="wb1-load-btn" class="wb-btn">[ CARREGAR ]</button>
          </div>

          <!-- Editor de Instruções -->
          <div style="margin-bottom:1rem;">
            <label for="wb1-code-input" style="display:block;font-family:var(--font-mono);font-size:0.78rem;margin-bottom:0.35rem;font-weight:700;">
              INSTRUÇÕES A EXECUTAR (Uma por linha):
            </label>
            <textarea id="wb1-code-input" rows="4" style="width:100%;box-sizing:border-box;padding:0.6rem;font-family:var(--font-mono);font-size:0.88rem;background:var(--bg-card);border:var(--border-strong);resize:vertical;"></textarea>
          </div>

          <!-- Controles de Execução -->
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem;">
            <button id="wb1-step-btn" class="wb-btn primary">[ EXECUTAR PRÓXIMA LINHA → ]</button>
            <button id="wb1-run-all-btn" class="wb-btn">[ EXECUTAR TUDO ]</button>
            <button id="wb1-reset-btn" class="wb-btn">[ REINICIAR MEMÓRIA ]</button>
          </div>

          <!-- Painel Dividido: Memória (Tabela de Símbolos) e Console Virtual -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:0.75rem;margin-bottom:0.75rem;">
            
            <!-- Tabela de Variáveis na Memória -->
            <div style="background:var(--bg-card);border:var(--border-thin);padding:0.75rem;">
              <div style="font-family:var(--font-mono);font-size:0.75rem;font-weight:700;margin-bottom:0.5rem;border-bottom:var(--border-thin);padding-bottom:0.25rem;">
                [ MEMÓRIA RAM • TABELA DE SÍMBOLOS ]
              </div>
              <div id="wb1-memory-view" style="font-family:var(--font-mono);font-size:0.82rem;min-height:90px;color:var(--ink-secondary);">
                <em>Nenhuma variável alocada na memória.</em>
              </div>
            </div>

            <!-- Terminal Virtual de Saída -->
            <div style="background:var(--bg-terminal);color:#f0f0f0;border:var(--border-strong);padding:0.75rem;font-family:var(--font-mono);font-size:0.82rem;">
              <div style="color:var(--accent-amber);font-size:0.72rem;margin-bottom:0.5rem;border-bottom:1px solid #333;padding-bottom:0.25rem;">
                [ CONSOLE DE SAÍDA DO USUÁRIO ]
              </div>
              <div id="wb1-terminal-view" style="min-height:90px;white-space:pre-wrap;line-height:1.4;">Python 3.4.0 (IDLE Interactive Shell)&#10;Digite uma instrução ou clique em Executar.&#10;</div>
            </div>
          </div>

          <!-- Log de Telemetria do Interpretador -->
          <div id="wb1-log" class="wb-log-panel" style="font-size:0.75rem;padding:0.6rem;background:var(--bg-terminal);color:var(--ink-on-dark);">
            [LOG] Interpretador pronto. Aguardando execução.
          </div>
        </div>
      </div>
    `;

    // Exemplos canônicos pré-programados
    const EXAMPLES = {
      prog1: 'print("Oi")',
      prog2: "2 + 3\n5 - 3\n2 * 10\n20 / 4\n2 ** 3\n10 % 3",
      prog3: "a = 2\nb = 3\nprint(a + b)",
      prog4: "salário = 1500\naumento = 5\nprint(salário + (salário * aumento / 100))",
      prog5: "resultado = 10 % 3 * 10 ** 2 + 1 - 10 * 4 / 2\nprint(resultado)",
      prog6: "salário = 750\naumento = 15\nprint(salário + (salário * aumento / 100))"
    };

    const codeInput = document.getElementById("wb1-code-input");
    const programSelect = document.getElementById("wb1-program-select");
    const loadBtn = document.getElementById("wb1-load-btn");
    const stepBtn = document.getElementById("wb1-step-btn");
    const runAllBtn = document.getElementById("wb1-run-all-btn");
    const resetBtn = document.getElementById("wb1-reset-btn");
    const memoryView = document.getElementById("wb1-memory-view");
    const terminalView = document.getElementById("wb1-terminal-view");
    const logEl = document.getElementById("wb1-log");

    // Estado da Bancada
    let memory = {};
    let lines = [];
    let currentLineIndex = 0;

    function loadSelectedProgram() {
      const selected = programSelect.value;
      if (EXAMPLES[selected]) {
        codeInput.value = EXAMPLES[selected];
        resetWorkbench();
        if (logEl) logEl.textContent = `[CARREGADO] ${programSelect.options[programSelect.selectedIndex].text}`;
      }
    }

    function resetWorkbench() {
      memory = {};
      lines = codeInput.value
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !l.startsWith("#"));
      currentLineIndex = 0;
      updateMemoryDisplay();
      if (terminalView) {
        terminalView.textContent = "Python 3.4.0 (IDLE Interactive Shell)\n>>> \n";
      }
      if (logEl) logEl.textContent = `[RESET] Memória limpa. ${lines.length} instruções carregadas.`;
    }

    function updateMemoryDisplay() {
      if (!memoryView) return;
      const keys = Object.keys(memory);
      if (keys.length === 0) {
        memoryView.innerHTML = "<em>Nenhuma variável alocada na memória.</em>";
        return;
      }
      let html = '<table style="width:100%;border-collapse:collapse;font-size:0.8rem;">';
      html += '<tr style="border-bottom:1px solid #ddd;text-align:left;"><th style="padding:4px;">Nome</th><th style="padding:4px;">Tipo</th><th style="padding:4px;">Valor</th></tr>';
      keys.forEach((k) => {
        const val = memory[k];
        const typeStr = typeof val === "number" ? (Number.isInteger(val) ? "int" : "float") : typeof val;
        html += `<tr style="border-bottom:1px solid #eee;">
          <td style="padding:4px;font-weight:700;color:var(--ink-primary);">${k}</td>
          <td style="padding:4px;color:var(--accent-amber);">${typeStr}</td>
          <td style="padding:4px;color:var(--ink-primary);">${val}</td>
        </tr>`;
      });
      html += "</table>";
      memoryView.innerHTML = html;
    }

    // Avaliador de expressões matemáticas e atribuições
    function evaluateInstruction(line) {
      if (!line) return null;

      // 1. Comando print(...)
      const printMatch = line.match(/^print\s*\((.*)\)$/);
      if (printMatch) {
        const expr = printMatch[1].trim();
        // Trata string literal com aspas
        if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
          const text = expr.slice(1, -1);
          return { type: "print", output: text, raw: line };
        }
        // Avalia expressão contendo variáveis
        const val = safeEvalWithMemory(expr);
        return { type: "print", output: String(val), raw: line };
      }

      // 2. Atribuição: variavel = expressao
      const assignMatch = line.match(/^([a-zA-Z_áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-zA-Z0-9_áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]*)\s*=\s*(.+)$/);
      if (assignMatch) {
        const varName = assignMatch[1].trim();
        const expr = assignMatch[2].trim();
        const val = safeEvalWithMemory(expr);
        memory[varName] = val;
        return { type: "assign", varName, val, raw: line };
      }

      // 3. Expressão direta (modo REPL calcula e exibe)
      const val = safeEvalWithMemory(line);
      return { type: "expr", val, raw: line };
    }

    function safeEvalWithMemory(expression) {
      try {
        let sanitized = expression;

        // Substitui nomes de variáveis pelos seus valores armazenados
        const keys = Object.keys(memory).sort((a, b) => b.length - a.length);
        keys.forEach((k) => {
          const regex = new RegExp(`\\b${k}\\b`, "g");
          sanitized = sanitized.replace(regex, memory[k]);
        });

        // Suporte para exponenciação Python ** -> Math.pow via replace seguro
        // Ex: a ** b -> Math.pow(a, b)
        sanitized = sanitized.replace(/(\d+(\.\d+)?)\s*\*\*\s*(\d+(\.\d+)?)/g, "Math.pow($1, $3)");

        // Executa avaliação numérica restrita
        // eslint-disable-next-line no-new-func
        const result = Function(`"use strict"; return (${sanitized});`)();
        return typeof result === "number" ? Math.round(result * 10000) / 10000 : result;
      } catch (err) {
        return `Erro: ${err.message}`;
      }
    }

    function executeNextStep() {
      if (lines.length === 0) {
        resetWorkbench();
      }
      if (currentLineIndex >= lines.length) {
        if (logEl) logEl.textContent = "[FIM] Todas as instruções do programa foram executadas.";
        return;
      }

      const line = lines[currentLineIndex];
      const result = evaluateInstruction(line);
      currentLineIndex++;

      // Atualiza Terminal
      if (terminalView) {
        terminalView.textContent += `>>> ${line}\n`;
        if (result && result.type === "print") {
          terminalView.textContent += `${result.output}\n`;
        } else if (result && result.type === "expr" && result.val !== undefined) {
          terminalView.textContent += `${result.val}\n`;
        }
        terminalView.scrollTop = terminalView.scrollHeight;
      }

      // Atualiza Memória e Log
      updateMemoryDisplay();
      if (logEl) {
        if (result && result.type === "assign") {
          logEl.textContent = `[LINHA ${currentLineIndex}] Atribuição: Variável "${result.varName}" recebeu o valor ${result.val}.`;
        } else if (result && result.type === "print") {
          logEl.textContent = `[LINHA ${currentLineIndex}] Saída em tela: "${result.output}".`;
        } else {
          logEl.textContent = `[LINHA ${currentLineIndex}] Executada instrução: "${line}".`;
        }
      }
    }

    function executeAllSteps() {
      resetWorkbench();
      while (currentLineIndex < lines.length) {
        executeNextStep();
      }
    }

    // Conectar eventos DOM
    if (loadBtn) loadBtn.onclick = loadSelectedProgram;
    if (stepBtn) stepBtn.onclick = executeNextStep;
    if (runAllBtn) runAllBtn.onclick = executeAllSteps;
    if (resetBtn) resetBtn.onclick = resetWorkbench;

    // Inicialização padrão com o primeiro exemplo
    loadSelectedProgram();
  }

  // ========================================================================
  // SEÇÃO 2: QUIZZES DE FIXAÇÃO DIALÉTICOS (10 Questões Comentadas)
  // ========================================================================
  const quizzes = [
    {
      id: "q1-1",
      question:
        "Segundo Nilo Ney Coutinho Menezes no Capítulo 1, por que a metáfora da 'receita culinária' ilustra com precisão a essência de um algoritmo de computador?",
      options: [
        {
          text: "Porque cozinhar exige que o cozinheiro decore termos em alemão ou inglês antes de iniciar o preparo de um prato.",
          correct: false,
          explanation:
            "Incorreta. O autor cita sua experiência frustrante tentando traduzir uma receita em alemão para demonstrar que dicionários não bastam; o cerne da analogia não é a língua estrangeira, mas sim a necessidade de compreender o efeito prático das instruções."
        },
        {
          text: "Porque uma receita estabelece uma sequência estrita e ordenada de instruções operacionais que só geram o resultado pretendido se executadas com compreensão e na cronologia correta.",
          correct: true,
          explanation:
            "Correta! Como enfatizado na Seção 1.4.7 do livro, receitas e programas dependem de ações encadeadas de forma não ambígua. A simples listagem de passos não auxilia quem não entende seus efeitos, e alterar a ordem (como assar a massa antes de misturar os ingredientes) invalida todo o procedimento."
        },
        {
          text: "Porque tanto receitas culinárias quanto programas de computador dependem exclusivamente de intuição artística, dispensando regras de lógica formal.",
          correct: false,
          explanation:
            "Incorreta. Programas de computador executam sobre arquiteturas determinísticas, exigindo absoluta precisão lógica e aderência estrita às regras gramaticais da linguagem."
        },
        {
          text: "Porque qualquer computador é capaz de corrigir automaticamente ingredientes e passos equivocados digitados pelo programador.",
          correct: false,
          explanation:
            "Incorreta. O computador é uma máquina obediente que executa estritamente o que foi instruído, incapaz de inferir intuitivamente correções para erros de raciocínio do autor."
        }
      ]
    },
    {
      id: "q1-2",
      question:
        "Qual é a distinção arquitetural primordial entre o modo interativo (REPL) e a execução de scripts persistidos em arquivos (.py)?",
      options: [
        {
          text: "O modo interativo compila permanentemente o programa em código de máquina binário, enquanto scripts .py rodam apenas em servidores web remotos.",
          correct: false,
          explanation:
            "Incorreta. O modo interativo não produz binários nem grava arquivos em disco; sua execução reside temporariamente na memória RAM da sessão ativa."
        },
        {
          text: "O modo REPL avalia e exibe instantaneamente o resultado de cada instrução submetida pelo prompt >>>, enquanto scripts .py agrupam instruções em arquivos de texto UTF-8 para execução reproduzível.",
          correct: true,
          explanation:
            "Correta! Conforme demonstrado nas Seções 2.2 e 2.3 da obra, o interpretador interativo opera no ciclo Read-Eval-Print Loop, permitindo validação imediata de expressões, ao passo que scripts em arquivos com extensão .py gravam o algoritmo em disco para reutilização permanente."
        },
        {
          text: "No modo interativo é proibido usar funções e operadores aritméticos, recursos que só passam a existir quando o código é salvo em disco.",
          correct: false,
          explanation:
            "Incorreta. Todas as operações aritméticas, funções nativas e estruturas do Python funcionam plenamente no modo interativo."
        },
        {
          text: "Arquivos .py devem ser redigidos obrigatoriamente no Microsoft Word para embutir as formatações gráficas que o interpretador exige.",
          correct: false,
          explanation:
            "Incorreta. Conforme adverte a Seção 2.3, processadores de texto convencionais como Word ou OpenOffice corrompem o código com metadados invisíveis; programas devem ser escritos exclusivamente como texto puro (UTF-8) em editores adequados."
        }
      ]
    },
    {
      id: "q1-3",
      question:
        "Ao executar o comando Print('Olá, Mundo!') no interpretador Python, o que ocorrerá e qual é a causa fundamental?",
      options: [
        {
          text: "O programa imprimirá a mensagem normalmente, pois Python ignora a diferença entre letras maiúsculas e minúsculas em nomes de comandos.",
          correct: false,
          explanation:
            "Incorreta. Python é estritamente sensível a maiúsculas e minúsculas (case-sensitive)."
        },
        {
          text: "O interpretador interromperá a execução disparando um NameError, porque o identificador nativo é print (minúsculo), sendo Print considerado uma variável ou função não definida.",
          correct: true,
          explanation:
            "Correta! Na Seção 2.4 (item 1), Nilo Menezes destaca que 'print e Print são completamente diferentes, causando um erro caso você digite o P maiúsculo'. Em Python, a função nativa é registrada unicamente como 'print'."
        },
        {
          text: "O programa fechará o sistema operacional sem emitir mensagens de aviso.",
          correct: false,
          explanation:
            "Incorreta. Erros de identificação são tratados pelo interpretador Python, que emite um relatório claro de exceção (traceback) com a linha e a natureza da falha."
        },
        {
          text: "Ocorrerá um erro de indentação (IndentationError), pois toda instrução inicial exige um recuo de 4 espaços em branco.",
          correct: false,
          explanation:
            "Incorreta. Instruções situadas no nível superior de um script não devem conter espaços de indentação antes do comando."
        }
      ]
    },
    {
      id: "q1-4",
      question:
        "Qual é o valor numérico e o tipo resultante produzido pela expressão 20 / 4 no interpretador Python 3?",
      options: [
        {
          text: "5 do tipo inteiro (int), pois a divisão entre 20 e 4 é exata.",
          correct: false,
          explanation:
            "Incorreta. Em Python 3, o operador de divisão tradicional (/) sempre promove o resultado para ponto flutuante, independentemente de a divisão ser exata."
        },
        {
          text: "5.0 do tipo ponto flutuante (float), uma vez que o operador / realiza divisão real em Python 3.",
          correct: true,
          explanation:
            "Correta! Conforme explicitado na Listagem 2.4 do livro (p. 42), '20/4' resulta em '5.0'. Para obter um quociente estritamente inteiro em Python utiliza-se a divisão de piso (//)."
        },
        {
          text: "0 do tipo inteiro (int), pois o operador / extrai o resto da divisão.",
          correct: false,
          explanation:
            "Incorreta. A extração do resto da divisão é realizada pelo operador módulo (%)."
        },
        {
          text: "Uma mensagem de SyntaxError, pois números inteiros não podem ser divididos sem conversão prévia com float().",
          correct: false,
          explanation:
            "Incorreta. Python realiza coerção automática de tipos numéricos em expressões aritméticas de divisão."
        }
      ]
    },
    {
      id: "q1-5",
      question:
        "Qual é o resultado da avaliação no interpretador Python da expressão do Exercício 2.2 do livro: 10 % 3 * 10 ** 2 + 1 - 10 * 4 / 2?",
      options: [
        {
          text: "81.0, respeitando a precedência estrita: exponenciação primeiro, seguida por módulo, multiplicações e divisões da esquerda para a direita, e finalmente adição e subtração.",
          correct: true,
          explanation:
            "Correta! Pela hierarquia algébrica: 10**2 = 100; em seguida 10 % 3 = 1; 1 * 100 = 100; 10 * 4 = 40; 40 / 2 = 20.0; por fim 100 + 1 = 101; 101 - 20.0 = 81.0."
        },
        {
          text: "45, calculando todos os operadores linearmente da esquerda para a direita sem considerar a prioridade algébrica.",
          correct: false,
          explanation:
            "Incorreta. Ignorar a precedência algébrica viola as leis matemáticas fundamentais implementadas pelo interpretador."
        },
        {
          text: "81 (número inteiro puro), pois todos os operandos originais da expressão foram digitados sem ponto decimal.",
          correct: false,
          explanation:
            "Incorreta. A presença da operação de divisão real (/ 2) converte a parcela em ponto flutuante (20.0), propagando o tipo float para o resultado final (81.0)."
        },
        {
          text: "Zero, pois 10 % 3 anula os termos subsequentes da equação.",
          correct: false,
          explanation:
            "Incorreta. 10 % 3 produz resto 1 (pois 10 = 3*3 + 1), não zero."
        }
      ]
    },
    {
      id: "q1-6",
      question:
        "Em Python, qual é a representação sintática canônica do operador de exponenciação (potenciação), por exemplo para calcular 2 elevado à terceira potência (2³)?",
      options: [
        {
          text: "2 ^ 3",
          correct: false,
          explanation:
            "Incorreta. Em Python, o símbolo de circunflexo (^) é o operador bitwise XOR (ou exclusivo binário), e não o operador de exponenciação."
        },
        {
          text: "2 ** 3 (dois asteriscos consecutivos, sem espaços intermediários)",
          correct: true,
          explanation:
            "Correta! Na Seção 2.5 (Listagem 2.5), Nilo Menezes instrui: 'utilizaremos dois asteriscos (**) para representar a operação de exponenciação. Observe que não há qualquer espaço entre os dois asteriscos'."
        },
        {
          text: "exp(2, 3)",
          correct: false,
          explanation:
            "Incorreta. Não existe a função embutida nativa exp() sem importar módulos matemáticos específicos como math.pow()."
        },
        {
          text: "2 * 3",
          correct: false,
          explanation:
            "Incorreta. Um único asterisco (*) denota multiplicação escalar simples (produzindo 6)."
        }
      ]
    },
    {
      id: "q1-7",
      question:
        "O que o operador de igualdade simples (=) representa em uma linha como salário = 1500, e como ele deve ser semanticamente lido?",
      options: [
        {
          text: "Representa uma asserção de equivalência matemática estática, comprovando que o lado esquerdo é eternamente igual ao lado direito.",
          correct: false,
          explanation:
            "Incorreta. Em computação, a igualdade de comparação é denotada pelo operador duplo (==). O operador simples é puramente imperativo."
        },
        {
          text: "Representa uma operação de atribuição, devendo ser lido como 'a variável salário recebe o valor 1500', associando o identificador ao dado na memória.",
          correct: true,
          explanation:
            "Correta! Como ensina Nilo Menezes na Seção 2.6: 'usaremos o símbolo de igualdade (=) entre o nome do compartimento e o valor que queremos armazenar. Chamaremos essa operação de atribuição, onde um valor é atribuído a uma variável. Quando lermos nosso programa, as operações de atribuição serão chamadas de recebe'."
        },
        {
          text: "Representa a exclusão da variável salário da memória RAM.",
          correct: false,
          explanation:
            "Incorreta. A deleção explícita de nomes na tabela de símbolos utiliza a palavra-chave del."
        },
        {
          text: "Representa um teste booleano que retorna True se o salário for 1500 e False caso contrário.",
          correct: false,
          explanation:
            "Incorreta. O teste condicional booleano de igualdade exige o operador relacional ==."
        }
      ]
    },
    {
      id: "q1-8",
      question:
        "Considere o script contendo apenas a linha: print('Curso de Python). Ao tentar executar esse arquivo, o que o interpretador reportará?",
      options: [
        {
          text: "Imprimirá 'Curso de Python' normalmente, pois a aspa inicial é suficiente para delimitar o texto até o fim da linha.",
          correct: false,
          explanation:
            "Incorreta. Delimitadores de string abertos devem ser rigorosamente fechados com o mesmo caractere de abertura."
        },
        {
          text: "Disparará um SyntaxError (EOL while scanning string literal), acusando que o final da linha foi atingido antes do fechamento da aspa.",
          correct: true,
          explanation:
            "Correta! Conforme o item 2 da Seção 2.4: 'Toda vez que abrir aspas, não se esqueça de fechá-las. Se você se esquecer, seu programa não funcionará'. O interpretador atinge o final da linha (End Of Line - EOL) procurando o fechamento da string e aborta com SyntaxError."
        },
        {
          text: "Criará uma variável de memória chamada Curso com valor indefinido.",
          correct: false,
          explanation:
            "Incorreta. O parser gramatical aborta a análise léxica da linha inteira antes de qualquer alocação de nomes na memória."
        },
        {
          text: "O programa entrará em um laço infinito aguardando que o usuário digite o restante do texto.",
          correct: false,
          explanation:
            "Incorreta. Erros gramaticais de término de literal de string provocam encerramento imediato do compilador/interpretador com mensagem de erro sintático."
        }
      ]
    },
    {
      id: "q1-9",
      question:
        "Por que, na Listagem 2.11 (cálculo de aumento salarial), o autor optou por definir as variáveis salário = 1500 e aumento = 5 em vez de escrever simplesmente print(1500 + (1500 * 5 / 100))?",
      options: [
        {
          text: "Porque Python é incapaz de realizar multiplicações e somas diretamente dentro dos parênteses da função print().",
          correct: false,
          explanation:
            "Incorreta. Python avalia expressões de qualquer complexidade diretamente dentro dos argumentos de funções."
        },
        {
          text: "Porque a utilização de variáveis separa os dados de entrada da fórmula de cálculo, aumentando a clareza, evitando números mágicos e facilitando a atualização futura de valores sem risco de alterar a expressão.",
          correct: true,
          explanation:
            "Correta! Conforme argumenta Nilo Menezes na Seção 2.6: ao utilizar variáveis, damos nomes aos dados de entrada. Se o salário mudar, alteramos apenas uma linha; na fórmula com valores fixos, seríamos obrigados a alterar o número em duas posições distintas da fórmula, elevando o risco de erros."
        },
        {
          text: "Porque variáveis em Python aceleram a velocidade de execução do hardware em mais de 100 vezes em relação a valores literais.",
          correct: false,
          explanation:
            "Incorreta. O uso de variáveis é uma escolha pedagógica e de engenharia de software voltada à legibilidade humana e manutenibilidade; em nível de bytecode, literais simples podem ser até ligeiramente mais compactos."
        },
        {
          text: "Porque o interpretador IDLE recusa a execução de arquivos .py que contenham números literais.",
          correct: false,
          explanation:
            "Incorreta. Literais numéricos são elementos primitivos válidos em qualquer ponto da linguagem."
        }
      ]
    },
    {
      id: "q1-10",
      question:
        "Qual é o único mecanismo universal da linguagem Python capaz de sobrepor a ordem de precedência natural dos operadores aritméticos e alterar a cronologia de cálculo?",
      options: [
        {
          text: "As chaves { }",
          correct: false,
          explanation:
            "Incorreta. Em Python, chaves { } são reservadas para a definição de conjuntos (sets) e dicionários (dicts)."
        },
        {
          text: "Os colchetes [ ]",
          correct: false,
          explanation:
            "Incorreta. Colchetes [ ] são reservados para a definição e indexação de listas e fatiamento (slices)."
        },
        {
          text: "Os parênteses ( )",
          correct: true,
          explanation:
            "Correta! Conforme estabelecido na Seção 2.5: 'Os parênteses são utilizados em Python da mesma forma que em expressões matemáticas, ou seja, para alterar a ordem de execução de uma operação'. Expressões dentro de parênteses são sempre avaliadas prioritariamente."
        },
        {
          text: "O operador de atribuição =",
          correct: false,
          explanation:
            "Incorreta. O operador = atua no armazenamento do resultado em uma variável na memória, não na ordem interna de cálculo dos termos da expressão."
        }
      ]
    }
  ];

  // ========================================================================
  // SEÇÃO 3: EXERCÍCIOS PRÁTICOS CANÔNICOS (8 Problemas Resolvidos)
  // ========================================================================
  const exercicios = [
    {
      id: "ex1-1",
      title: "Exercício 2.1 (a): Conversão de Expressão Aritmética Adição/Multiplicação",
      prompt:
        "Converta a seguinte expressão matemática da notação tradicional para que possa ser avaliada no interpretador Python, respeitando as prioridades operacionais: $10 + 20 \\times 30$. Apresente o código exato e o resultado numérico final.",
      solution: `
        <p><strong>Resolução Analítica Passo a Passo:</strong></p>
        <ol>
          <li>Na notação matemática, o símbolo de multiplicação $\\times$ deve ser traduzido para o operador asterisco (<code>*</code>) em Python.</li>
          <li>A expressão traduzida é: <code>10 + 20 * 30</code>.</li>
          <li>Pelas regras de precedência estabelecidas na Seção 2.5, a multiplicação possui prioridade sobre a adição:
            <ul>
              <li>Primeiro avalia-se: $20 \\times 30 = 600$.</li>
              <li>Em seguida avalia-se a adição: $10 + 600 = 610$.</li>
            </ul>
          </li>
          <li>No interpretador, o comando <code>print(10 + 20 * 30)</code> exibirá o valor inteiro <strong>610</strong>.</li>
        </ol>
      `
    },
    {
      id: "ex1-2",
      title: "Exercício 2.1 (b): Conversão de Potenciação e Divisão",
      prompt:
        "Converta a expressão matemática tradicional $4^2 \\div 30$ para sintaxe válida de Python. Demonstre a ordem de avaliação e indique o valor numérico com o tipo de dado resultante.",
      solution: `
        <p><strong>Resolução Analítica Passo a Passo:</strong></p>
        <ol>
          <li>A potenciação $4^2$ é representada em Python pelo operador de dois asteriscos (<code>**</code>): <code>4 ** 2</code>.</li>
          <li>O símbolo de divisão tradicional $\\div$ é mapeado para a barra oblíqua (<code>/</code>).</li>
          <li>A expressão em Python é escrita como: <code>4 ** 2 / 30</code>.</li>
          <li>Pela hierarquia de operadores:
            <ul>
              <li>A exponenciação tem precedência máxima: $4^2 = 16$.</li>
              <li>A divisão é executada em seguida: $16 / 30 \\approx 0.5333333333333333$.</li>
            </ul>
          </li>
          <li>Como a barra <code>/</code> realiza divisão real em Python 3, o resultado é um número de ponto flutuante (<code>float</code>) aproximadamente igual a <strong>0.5333...</strong> $\\blacksquare$</li>
        </ol>
      `
    },
    {
      id: "ex1-3",
      title: "Exercício 2.1 (c): Uso de Parênteses em Expressões Compostas",
      prompt:
        "Converta a expressão matemática $(94 + 2) \\times 6 - 1$ para que seja avaliada corretamente em Python, demonstrando a árvore de derivação das operações.",
      solution: `
        <p><strong>Resolução Analítica Passo a Passo:</strong></p>
        <ol>
          <li>Mapeamos o símbolo $\\times$ para o operador <code>*</code>, preservando rigorosamente os parênteses que alteram a ordem de avaliação: <code>(94 + 2) * 6 - 1</code>.</li>
          <li>Derivação operacional:
            <ul>
              <li><strong>1º Nível (Sub-expressão entre parênteses):</strong> $94 + 2 = 96$. A expressão reduz-se a <code>96 * 6 - 1</code>.</li>
              <li><strong>2º Nível (Multiplicação):</strong> $96 \\times 6 = 576$. A expressão reduz-se a <code>576 - 1</code>.</li>
              <li><strong>3º Nível (Subtração):</strong> $576 - 1 = 575$.</li>
            </ul>
          </li>
          <li>Resultado final exibido no console: <strong>575</strong>. $\\blacksquare$</li>
        </ol>
      `
    },
    {
      id: "ex1-4",
      title: "Exercício 2.2: Avaliação Analítica de Precedência Completa",
      prompt:
        "Resolva analiticamente no papel a expressão proposta na Seção 2.5: <code>10 % 3 * 10 ** 2 + 1 - 10 * 4 / 2</code>, demonstrando passo a passo a redução de cada operador até o resultado final.",
      solution: `
        <p><strong>Resolução Analítica Passo a Passo:</strong></p>
        <ol>
          <li>Identificamos todos os operadores presentes e suas ordens de precedência:
            <ul>
              <li>Prioridade 1: Exponenciação (<code>**</code>)</li>
              <li>Prioridade 2: Módulo (<code>%</code>), Multiplicação (<code>*</code>), Divisão (<code>/</code>) com associatividade à esquerda</li>
              <li>Prioridade 3: Adição (<code>+</code>), Subtração (<code>-</code>) com associatividade à esquerda</li>
            </ul>
          </li>
          <li><strong>Etapa 1 (Exponenciação):</strong> $10 ** 2 = 100$.<br>
              Expressão: <code>10 % 3 * 100 + 1 - 10 * 4 / 2</code>.</li>
          <li><strong>Etapa 2 (Operadores de prioridade 2 da esquerda para a direita):</strong>
            <ul>
              <li>$10 \\% 3$: o quociente inteiro de 10 por 3 é 3 (resto 1). Logo, $10 \\% 3 = 1$.<br>
                  Expressão: <code>1 * 100 + 1 - 10 * 4 / 2</code>.</li>
              <li>$1 * 100 = 100$.<br>
                  Expressão: <code>100 + 1 - 10 * 4 / 2</code>.</li>
              <li>$10 * 4 = 40$.<br>
                  Expressão: <code>100 + 1 - 40 / 2</code>.</li>
              <li>$40 / 2 = 20.0$ (divisão em Python gera float).<br>
                  Expressão: <code>100 + 1 - 20.0</code>.</li>
            </ul>
          </li>
          <li><strong>Etapa 3 (Operadores de prioridade 3 da esquerda para a direita):</strong>
            <ul>
              <li>$100 + 1 = 101$.<br>
                  Expressão: <code>101 - 20.0</code>.</li>
              <li>$101 - 20.0 = 81.0$.</li>
            </ul>
          </li>
          <li>Resultado analítico final: <strong>81.0</strong>. $\\blacksquare$</li>
        </ol>
      `
    },
    {
      id: "ex1-5",
      title: "Exercício 2.3: Programa de Exibição de Nome Próprio em Tela",
      prompt:
        "Escreva um programa completo em Python que exiba seu nome completo na tela do computador, observando o uso correto de aspas, parênteses e o comando de saída.",
      solution: `
        <p><strong>Implementação Canônica:</strong></p>
        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header">
            <span class="proc-name">EXIBIÇÃO DE IDENTIFICAÇÃO PESSOAL</span>
            <span>[ EXERCÍCIO 2.3 DO LIVRO ]</span>
          </div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">print</span>(<span class="cmt">"Nilo Ney Coutinho Menezes"</span>)</span></div>
          </div>
        </div>
        <p><strong>Comentários de Engenharia:</strong></p>
        <ul>
          <li>O nome é passado como literal de texto (string) envolvido por aspas duplas (ou simples).</li>
          <li>A função <code>print()</code> envia a cadeia de caracteres para o console e anexa automaticamente o caractere de nova linha (<code>\\n</code>).</li>
        </ul>
      `
    },
    {
      id: "ex1-6",
      title: "Exercício 2.4: Avaliação Algébrica de Expressão com Variáveis (2a × 3b)",
      prompt:
        "Escreva um programa em Python que calcule e exiba o resultado de $2a \\times 3b$, onde o valor de $a$ é igual a 3 e o valor de $b$ é igual a 5. Utilize variáveis nomeadas para armazenar as entradas.",
      solution: `
        <p><strong>Implementação Canônica:</strong></p>
        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header">
            <span class="proc-name">CÁLCULO POLINOMIAL COM ATRIBUIÇÃO</span>
            <span>[ EXERCÍCIO 2.4 DO LIVRO ]</span>
          </div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">a = 3</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">b = 5</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">print</span>((2 * a) * (3 * b))</span></div>
          </div>
        </div>
        <p><strong>Demonstração Matemática:</strong></p>
        <ol>
          <li>A variável <code>a</code> armazena 3 na memória: $2a = 2 \\times 3 = 6$.</li>
          <li>A variável <code>b</code> armazena 5 na memória: $3b = 3 \\times 5 = 15$.</li>
          <li>O produto final é avaliado: $6 \\times 15 = 90$.</li>
          <li>A saída impressa no terminal é exatamente o inteiro <strong>90</strong>. $\\blacksquare$</li>
        </ol>
      `
    },
    {
      id: "ex1-7",
      title: "Exercício 2.5: Generalização da Soma para Três Variáveis",
      prompt:
        "Modifique o primeiro programa com variáveis da obra (Listagem 2.7) de forma a calcular e exibir a soma de três variáveis numéricas distintas.",
      solution: `
        <p><strong>Implementação Canônica:</strong></p>
        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header">
            <span class="proc-name">SOMA DE TRÊS VARIÁVEIS NA MEMÓRIA</span>
            <span>[ EXERCÍCIO 2.5 DO LIVRO ]</span>
          </div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">a = 2</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">b = 3</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content">c = 4</span></div>
            <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">print</span>(a + b + c)</span></div>
          </div>
        </div>
        <p><strong>Comentários Estruturais:</strong></p>
        <ul>
          <li>Três compartimentos independentes são alocados na tabela de símbolos da memória: <code>a</code> (2), <code>b</code> (3) e <code>c</code> (4).</li>
          <li>A linha 4 avalia a soma das três referências de memória: $2 + 3 + 4 = 9$, exibindo <strong>9</strong> no console.</li>
        </ul>
      `
    },
    {
      id: "ex1-8",
      title: "Exercício 2.6: Reajuste Salarial de 15% para Salário de R$ 750",
      prompt:
        "Modifique o programa da Listagem 2.11 do livro de forma que ele calcule um aumento salarial de 15% para um funcionário cujo salário atual é de R$ 750,00. Demonstre a fórmula percentual e o valor líquido final.",
      solution: `
        <p><strong>Implementação Canônica:</strong></p>
        <div class="clrs-pseudocode-box">
          <div class="pseudocode-header">
            <span class="proc-name">CÁLCULO DE AUMENTO COM NOVOS PARÂMETROS</span>
            <span>[ EXERCÍCIO 2.6 DO LIVRO ]</span>
          </div>
          <div class="pseudocode-lines">
            <div class="code-line"><span class="line-num">1</span><span class="line-content">salário = 750</span></div>
            <div class="code-line"><span class="line-num">2</span><span class="line-content">aumento = 15</span></div>
            <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">print</span>(salário + (salário * aumento / 100))</span></div>
          </div>
        </div>
        <p><strong>Dedução Numérica:</strong></p>
        <ol>
          <li>O valor do aumento percentual é obtido por: $\\Delta = 750 \\times \\frac{15}{100} = 750 \\times 0.15 = 112.50$.</li>
          <li>O salário reajustado é a soma do salário original com o aumento: $750 + 112.50 = 862.50$.</li>
          <li>O console de saída do interpretador imprimirá: <strong>862.5</strong>. $\\blacksquare$</li>
        </ol>
      `
    }
  ];

  // ========================================================================
  // REGISTRO GLOBAL DO MÓDULO NO COURSEBOOK
  // ========================================================================
  const moduleContent = {
    revisao,
    unidades,
    initWorkbenches,
    quizzes,
    exercicios
  };

  // Registra no sistema geral de módulos do ecossistema CourseBook
  if (typeof window !== "undefined") {
    if (typeof window.registerNiloModule === "function") {
      window.registerNiloModule(MODULE_ID, moduleContent);
    }
    if (typeof window.registerCodexModule === "function") {
      window.registerCodexModule(MODULE_ID, moduleContent);
    }
  }
})();
