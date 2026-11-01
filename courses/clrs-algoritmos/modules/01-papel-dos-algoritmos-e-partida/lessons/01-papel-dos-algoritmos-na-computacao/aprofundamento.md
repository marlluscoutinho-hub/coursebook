<p>O Capítulo 1 abre a obra respondendo a três perguntas norteadoras: <em>O que são algoritmos? Por que o estudo dos algoritmos vale a pena? Qual é o papel dos algoritmos em relação a outras tecnologias usadas em computadores?</em></p>

<h3>1. Definição Formal: Algoritmo, Problema Computacional e Instância</h3>
<p>Informalmente, um <strong>algoritmo</strong> é qualquer procedimento computacional bem definido que toma algum valor ou conjunto de valores como <strong>entrada</strong> e, em uma sequência finita de etapas computacionais, produz algum valor ou conjunto de valores como <strong>saída</strong>. Dessa forma, um algoritmo transforma a entrada na saída.</p>
<p>Sob uma segunda perspectiva complementar, os autores definem o algoritmo como uma ferramenta para resolver um <strong>problema computacional bem especificado</strong>:</p>
<ul>
<li>O <strong>enunciado do problema</strong> especifica, em termos gerais, a relação desejada entre a entrada e a saída.</li>
<li>O <strong>algoritmo</strong> descreve um procedimento computacional específico para alcançar essa relação entre entrada e saída.</li>
</ul>

<div class="canonical-callout">
<span class="callout-tag">[ ENUNCIADO FORMAL • O PROBLEMA DE ORDENAÇÃO ]</span>
<p><strong>Entrada:</strong> Uma sequência de $n$ números $\langle a_1, a_2, \dots, a_n \rangle$.</p>
<p><strong>Saída:</strong> Uma permutação (reordenação) $\langle a'_1, a'_2, \dots, a'_n \rangle$ da sequência de entrada, tal que $a'_1 \le a'_2 \le \dots \le a'_n$.</p>
</div>

<p>Por exemplo, dada a sequência de entrada $\langle 31, 41, 59, 26, 41, 58 \rangle$, um algoritmo de ordenação devolve como saída a sequência $\langle 26, 31, 41, 41, 58, 59 \rangle$. Essa sequência específica de entrada é denominada uma <strong>instância</strong> do problema de ordenação. Em geral, uma <strong>instância de um problema</strong> consiste na entrada (que satisfaz quaisquer restrições impostas no enunciado do problema) necessária para calcular uma solução para o problema.</p>
<p>Por ser uma operação fundamental usada como etapa intermediária na maioria dos sistemas, existem diversos bons algoritmos de ordenação. A escolha do melhor algoritmo para uma aplicação depende de fatores fundamentais:</p>
<ol>
<li>O <strong>número de itens</strong> $n$ a ordenar;</li>
<li>O <strong>grau de ordenação</strong> já apresentado previamente por esses itens;</li>
<li>As possíveis <strong>restrições aos valores</strong> dos itens (por exemplo, serem inteiros pequenos em um intervalo restrito);</li>
<li>A <strong>arquitetura do computador</strong> (processadores, caches);</li>
<li>O <strong>tipo de dispositivo de armazenamento</strong> que será utilizado: memória principal (RAM), discos magnéticos/SSDs ou até mesmo fitas.</li>
</ol>

<h3>2. Corretude e Algoritmos com Taxa de Erro Controlável</h3>
<p>Diz-se que um algoritmo é <strong>correto</strong> se, para <em>toda</em> instância de entrada, ele <strong>parar</strong> com a saída correta. Dizemos que um algoritmo correto <em>resolve</em> o problema computacional dado. Um algoritmo <strong>incorreto</strong>, por sua vez, pode falhar de duas maneiras: (1) não parar em absoluto para algumas instâncias de entrada (entrar em laço infinito), ou (2) parar devolvendo uma resposta incorreta.</p>
<p>Aqui os autores destacam uma nuance contra-intuitiva importantíssima: <strong>às vezes, algoritmos incorretos podem ser extremamente úteis, desde que possamos controlar sua taxa de erros!</strong> O exemplo clássico do livro (estudado no Capítulo 31) é o teste probabilístico de primalidade (como o algoritmo de Miller-Rabin) para encontrar números primos imensos usados em criptografia: ele é incrivelmente rápido e sua probabilidade de erro pode ser reduzida a um valor arbitrariamente ínfimo. Na maior parte do livro, contudo, o foco recai sobre algoritmos estritamente corretos.</p>
<p>Quanto à forma de expressão, um algoritmo pode ser especificado em linguagem comum (português ou inglês), como um programa de computador em uma linguagem específica, em pseudocódigo, ou mesmo como um projeto de circuito de hardware. O único requisito inegociável é que a especificação forneça uma descrição precisa do procedimento computacional a ser seguido.</p>

<h3>3. Que Tipos de Problemas São Resolvidos por Algoritmos?</h3>
<p>Cormen et al. ilustram a abrangência prática dos algoritmos em quatro grandes frentes da sociedade moderna:</p>
<ul>
<li><strong>Projeto Genoma Humano e Biologia Computacional:</strong> Identificar os cerca de $100.000$ genes do DNA humano, determinar as sequências dos $3$ bilhões de pares de bases químicas, armazenar esses dados e analisá-los exige algoritmos sofisticados (como programação dinâmica e correspondência de cadeias) para economizar tempo humano, tempo de máquina e recursos laboratoriais.</li>
<li><strong>Internet e Mecanismos de Busca:</strong> Gerenciar e manipular volumes gigantescos de dados na rede depende de encontrar boas rotas para transmissão de pacotes (algoritmos de caminhos mínimos em grafos, Capítulo 24) e localizar rapidamente páginas com informações específicas (tabelas de espalhamento no Capítulo 11 e correspondência de cadeias no Capítulo 32).</li>
<li><strong>Comércio Eletrônico e Segurança Digital:</strong> Negociar bens eletronicamente mantendo o sigilo de cartões de crédito, senhas e extratos bancários baseia-se na <strong>criptografia de chave pública (RSA)</strong> e nas <strong>assinaturas digitais</strong> (Capítulo 31), fundamentadas em algoritmos numéricos e teoria dos números.</li>
<li><strong>Indústria, Logística e Alocação de Recursos Escassos:</strong> Decidir onde uma petrolífera deve perfurar poços para maximizar o lucro, onde uma campanha política deve alocar verba publicitária, como uma companhia aérea deve escalar tripulações minimizando custos e respeitando regulamentações governamentais, ou onde um provedor de Internet deve alocar largura de banda são problemas resolvidos por <strong>Programação Linear</strong> (Capítulo 29).</li>
</ul>

<h3>4. Cinco Problemas Específicos e a Explosão Combinatória das Soluções Candidatas</h3>
<p>Para mostrar por que o projeto de algoritmos não é trivial, os autores apresentam cinco problemas concretos que percorrem o livro:</p>
<ol>
<li><strong>Rota Mais Curta em um Mapa Rodoviário (Capítulo 24):</strong> Modelamos interseções como vértices e estradas como arestas ponderadas de um grafo. O número de rotas possíveis entre duas cidades é astronômico, mesmo descartando rotas com laços; precisamos encontrar a mais curta sem testar todas.</li>
<li><strong>Subsequência Comum Mais Longa — LCS (Capítulo 15):</strong> Dadas duas sequências de símbolos $X = \langle x_1, x_2, \dots, x_m \rangle$ e $Y = \langle y_1, y_2, \dots, y_n \rangle$, uma subsequência é obtida removendo alguns (ou todos, ou nenhum) elementos sem alterar a ordem relativa (ex.: de $\langle A, B, C, D, E, F, G \rangle$ podemos extrair $\langle B, C, E, G \rangle$). Medir a maior subsequência comum entre dois filamentos de DNA revela seu grau de semelhança genética. Contudo, $X$ e $Y$ possuem $2^m$ e $2^n$ subsequências possíveis! Enumerá-las por força bruta é inviável, mas a <strong>programação dinâmica</strong> resolve o problema em tempo polinomial.</li>
<li><strong>Ordenação Topológica de um Catálogo de Peças (Capítulo 22):</strong> Num projeto mecânico com $n$ peças onde algumas dependem de outras, queremos listar as peças de modo que cada peça apareça antes de qualquer outra que a utilize. Existem $n!$ (n fatorial) ordenações possíveis — e $n!$ cresce ainda mais rápido que uma exponencial $2^n$. A ordenação topológica em grafos resolve isso em tempo linear!</li>
<li><strong>Envoltória Convexa de $n$ Pontos no Plano (Capítulo 33):</strong> A envoltória convexa é o menor polígono convexo que engloba todos os $n$ pontos (imagine cada ponto como um prego cravado numa tábua e a envoltória como um elástico esticado solto ao redor de todos os pregos). Há $2^n$ subconjuntos possíveis de pontos para serem vértices, além de suas permutações de ordem, mas métodos de varredura geométrica (Varredura de Graham e Marcha de Jarvis) a encontram eficientemente.</li>
<li><strong>Transformada Discreta e Rápida de Fourier — DFT e FFT (Capítulo 30):</strong> Nem todo problema possui um conjunto discreto óbvio de soluções candidatas. Na conversão de amostras numéricas de um sinal do domínio do tempo para o domínio da frequência, a FFT realiza o cálculo em $\Theta(n \lg n)$, viabilizando processamento de áudio/imagem, compressão de dados e multiplicação de grandes polinômios e inteiros.</li>
</ol>

<div class="canonical-callout theorem">
<span class="callout-tag">[ DUAS CARACTERÍSTICAS DOS PROBLEMAS ALGORÍTMICOS ]</span>
<p><strong>1. Muitas soluções candidatas:</strong> A esmagadora maioria das soluções candidatas não resolve o problema (ou não é a solução ótima). Encontrar a solução correta ou a "melhor" sem vasculhar cegamente um espaço de busca de tamanho $2^n$ ou $n!$ é um desafio intelectual profundo.</p>
<p><strong>2. Aplicações práticas diretas:</strong> De economia de combustível e mão de obra em ferrovias até roteamento de pacotes de Internet e navegadores GPS.</p>
</div>

<h3>5. Estruturas de Dados, Técnica, Problemas NP-Completos e Paralelismo</h3>
<ul>
<li><strong>Estruturas de dados:</strong> Uma estrutura de dados é um modo de armazenar e organizar dados com o objetivo de facilitar acesso e modificações. <em>Regra de ouro dos autores:</em> nenhuma estrutura de dados única funciona bem para todas as finalidades; por isso é indispensável conhecer os pontos fortes e as limitações de várias delas.</li>
<li><strong>Técnica além do "livro de receitas":</strong> Embora o livro contenha dezenas de algoritmos prontos, você inevitavelmente encontrará problemas inéditos na vida profissional. O propósito central é ensinar <strong>técnicas de projeto e análise</strong> (divisão e conquista, programação dinâmica, estratégia gulosa, análise amortizada) para que você crie seus próprios algoritmos, prove sua corretude e meça sua eficiência.</li>
<li><strong>Problemas Difíceis e NP-Completude (Capítulos 34 e 35):</strong> Existem problemas para os quais não se conhece nenhum algoritmo eficiente (de tempo polinomial). O subconjunto dos problemas <strong>NP-completos</strong> intriga a Ciência da Computação por <strong>três motivos fundamentais</strong>:
<ol>
<li>Embora nenhum algoritmo eficiente jamais tenha sido encontrado para qualquer problema NP-completo, <em>ninguém jamais provou que é impossível existir um</em> (o problema em aberto $\text{P} \stackrel{?}{=} \text{NP}$).</li>
<li>Eles possuem a propriedade extraordinária do "tudo ou nada": <em>se existir um algoritmo eficiente para um único problema NP-completo, então existirão algoritmos eficientes para todos eles!</em></li>
<li>Vários problemas NP-completos são superficialmente quase idênticos a problemas fáceis que possuem algoritmos eficientes: uma pequena mudança no enunciado transforma um problema tratável (como o caminho mais curto entre dois pontos) em um problema NP-completo intratável (como o <strong>Problema do Caixeiro-Viajante — TSP</strong>, onde o caminhão de entregas deve visitar todos os pontos e retornar ao depósito percorrendo a menor distância total). Saber identificar a NP-completude evita que o engenheiro perca meses buscando um algoritmo exato rápido inexistente e permite recorrer aos <strong>algoritmos de aproximação</strong> (Capítulo 35).</li>
</ol>
</li>
<li><strong>Paralelismo e Processadores Multicore (Capítulo 27):</strong> Durante décadas, a velocidade de relógio (<em>clock</em>) dos processadores cresceu regularmente. Contudo, limitações físicas impuseram uma barreira: a <strong>densidade de potência aumenta superlinearmente com a velocidade de relógio</strong>, gerando risco real de derretimento dos chips! A resposta da indústria foi integrar múltiplos núcleos de processamento (<em>multicore</em>) em um único chip — verdadeiros computadores paralelos em miniatura. Para extrair desempenho deles, o Capítulo 27 desenvolve a teoria dos algoritmos <strong>multithread dinâmicos</strong>.</li>
</ul>
