/* ==========================================================================
   CODEX — Dados Estruturais da Trilha (16 Módulos) & Conteúdo Integral do Módulo 1
   Obra: Algoritmos: Teoria e Prática (3ª Edição) — Thomas H. Cormen,
         Charles E. Leiserson, Ronald L. Rivest e Clifford Stein (CLRS)
   ========================================================================== */

window.CODEX_DATA = {
  tome: {
    id: "TOMO #01",
    isbn: "978-85-352-3699-6",
    title: "Algoritmos: Teoria e Prática",
    edition: "3ª Edição Integral (Tradução da 3ª Edição Norte-Americana — MIT Press / Campus Elsevier)",
    authors: "Thomas H. Cormen • Charles E. Leiserson • Ronald L. Rivest • Clifford Stein",
    totalPages: 1042,
    totalModules: 16,
    totalChapters: "35 Capítulos + 4 Apêndices (A–D)",
    summary:
      "Edição interativa integral da obra de referência mundial em Ciência da Computação. Cada módulo preserva rigorosamente as demonstrações por invariante de laço e indução, os pseudocódigos originais dos autores, as análises de pior caso e caso esperado no modelo RAM e todos os problemas clássicos do livro."
  },

  blocks: [
    {
      id: "bloco-1",
      code: "BLOCO I",
      title: "Fundamentos do Projeto e Análise de Algoritmos",
      subtitle: "Parte I (Capítulos 1 a 5) + Apêndices A e C"
    },
    {
      id: "bloco-2",
      code: "BLOCO II",
      title: "Ordenação e Estatísticas de Ordem",
      subtitle: "Parte II (Capítulos 6 a 9)"
    },
    {
      id: "bloco-3",
      code: "BLOCO III",
      title: "Estruturas de Dados Fundamentais e Balanceadas",
      subtitle: "Parte III (Capítulos 10 a 14)"
    },
    {
      id: "bloco-4",
      code: "BLOCO IV",
      title: "Técnicas Avançadas de Projeto e Estruturas Avançadas",
      subtitle: "Partes IV e V (Capítulos 15 a 21)"
    },
    {
      id: "bloco-5",
      code: "BLOCO V",
      title: "Algoritmos em Grafos e Redes de Fluxo",
      subtitle: "Parte VI (Capítulos 22 a 26) + Apêndice B"
    },
    {
      id: "bloco-6",
      code: "BLOCO VI",
      title: "Tópicos Selecionados, Modelos Paralelos e Intratabilidade",
      subtitle: "Parte VII (Capítulos 27 a 35) + Apêndice D"
    }
  ],

  modules: [
    {
      id: 1,
      code: "MÓDULO 01",
      blockId: "bloco-1",
      chapters: "Capítulos 1 e 2 (pp. 15–46)",
      title: "O Papel dos Algoritmos e a Partida no Projeto e Análise",
      unlocked: true,
      estimatedTime: "3h 30min",
      objective:
        "Compreender o conceito formal de algoritmo, problema computacional e instância; reconhecer algoritmos como uma tecnologia essencial; dominar a especificação em pseudocódigo CLRS, provar a corretude usando invariantes de laço (inicialização, manutenção e término), analisar tempos de execução no modelo RAM e contrastar a abordagem incremental (INSERTION-SORT) com o paradigma de divisão e conquista (MERGE-SORT).",
      concepts: [
        "Algoritmos e Instâncias",
        "Algoritmos como Tecnologia",
        "INSERTION-SORT",
        "Invariantes de Laço",
        "Modelo RAM",
        "Análise de Pior e Melhor Caso",
        "Ordem de Crescimento Θ",
        "Divisão e Conquista",
        "MERGE com Sentinelas ∞",
        "MERGE-SORT & Árvore de Recursão"
      ]
    },
    {
      id: 2,
      code: "MÓDULO 02",
      blockId: "bloco-1",
      chapters: "Capítulo 3 + Apêndice A (pp. 47–65, 920–930)",
      title: "Crescimento de Funções, Notação Assintótica e Somatórios",
      unlocked: false,
      estimatedTime: "4h 00min",
      objective:
        "Dominar o formalismo matemático da eficiência assintótica (Θ, O, Ω, o, ω), manipular propriedades algébricas das funções que governam a complexidade computacional e aplicar técnicas exatas e de limitação para resolver somatórios que emergem da análise de laços iterativos.",
      concepts: [
        "Notações Θ, O, Ω, o, ω",
        "Teorema 3.1",
        "Pisos, Tetos e Logaritmos",
        "Fatoriais (Stirling) e lg* n",
        "Fibonacci e Proporção Áurea",
        "Séries Aritméticas, Geométricas e Harmônicas",
        "Somatórios Telescópicos",
        "Limitação por Integrais"
      ]
    },
    {
      id: 3,
      code: "MÓDULO 03",
      blockId: "bloco-1",
      chapters: "Capítulo 4 (pp. 66–105)",
      title: "Divisão e Conquista Avançada e Resolução de Recorrências",
      unlocked: false,
      estimatedTime: "4h 30min",
      objective:
        "Projetar algoritmos não triviais sob o paradigma de divisão e conquista (reduzindo a complexidade assintótica em problemas de arranjos e matrizes) e dominar os três métodos fundamentais para resolver recorrências algorítmicas, incluindo as condições técnicas e a demonstração do Teorema Mestre.",
      concepts: [
        "Subarranjo Máximo Θ(n lg n)",
        "Algoritmo de Strassen Θ(n^lg 7)",
        "Método de Substituição",
        "Método da Árvore de Recursão",
        "Método Mestre (3 Casos)",
        "Condição de Regularidade",
        "Prova do Teorema Mestre"
      ]
    },
    {
      id: 4,
      code: "MÓDULO 04",
      blockId: "bloco-1",
      chapters: "Capítulo 5 + Apêndice C (pp. 106–130, 950–977)",
      title: "Análise Probabilística e Algoritmos Aleatorizados",
      unlocked: false,
      estimatedTime: "4h 15min",
      objective:
        "Distinguir análise probabilística de algoritmos aleatorizados, dominar a técnica de variáveis aleatórias indicadoras (Lema 5.1) para simplificar o cálculo de valores esperados e aplicar ferramentas de contagem e probabilidade na análise rigorosa de algoritmos.",
      concepts: [
        "Problema da Contratação",
        "Variáveis Aleatórias Indicadoras",
        "RANDOMIZE-IN-PLACE",
        "Paradoxo do Aniversário",
        "Bolas e Caixas & Sequências",
        "Contratação On-line (1/e)",
        "Distribuições Geométrica e Binomial"
      ]
    },
    {
      id: 5,
      code: "MÓDULO 05",
      blockId: "bloco-2",
      chapters: "Capítulos 6 e 7 (pp. 131–165)",
      title: "Ordenação no Lugar e Filas de Prioridades: Heapsort e Quicksort",
      unlocked: false,
      estimatedTime: "4h 30min",
      objective:
        "Compreender a estrutura de dados heap binário tanto para ordenação ótima no lugar (HEAPSORT) quanto para implementação de filas de prioridades dinâmicas, e dominar o algoritmo Quicksort (determinístico e aleatorizado) e sua análise de caso esperado Θ(n lg n).",
      concepts: [
        "MAX-HEAPIFY O(lg n)",
        "BUILD-MAX-HEAP O(n)",
        "HEAPSORT O(n lg n)",
        "Filas de Prioridades",
        "QUICKSORT & PARTITION",
        "RANDOMIZED-QUICKSORT",
        "Análise do Caso Esperado"
      ]
    },
    {
      id: 6,
      code: "MÓDULO 06",
      blockId: "bloco-2",
      chapters: "Capítulos 8 e 9 (pp. 166–195)",
      title: "Limites Inferiores, Ordenação em Tempo Linear e Estatísticas de Ordem",
      unlocked: false,
      estimatedTime: "4h 00min",
      objective:
        "Demonstrar o limite inferior Ω(n lg n) no modelo de árvore de decisão, superar essa barreira usando ordenação por Contagem, Digital e Balde, e selecionar qualquer estatística de ordem (como a mediana) em tempo linear O(n) esperado e no pior caso.",
      concepts: [
        "Árvores de Decisão Ω(n lg n)",
        "COUNTING-SORT & Estabilidade",
        "RADIX-SORT",
        "BUCKET-SORT",
        "Mínimo e Máximo Simultâneos",
        "RANDOMIZED-SELECT",
        "SELECT (Mediana das Medianas)"
      ]
    },
    {
      id: 7,
      code: "MÓDULO 07",
      blockId: "bloco-3",
      chapters: "Capítulos 10 e 11 (pp. 196–243)",
      title: "Estruturas de Dados Elementares e Tabelas de Espalhamento",
      unlocked: false,
      estimatedTime: "4h 30min",
      objective:
        "Projetar e manipular representações de conjuntos dinâmicos (pilhas, filas, listas ligadas com sentinelas, árvores enraizadas e ponteiros em arranjos) e dominar tabelas hash (encadeamento, funções hash universais, endereçamento aberto e hashing perfeito).",
      concepts: [
        "Pilhas, Filas e Listas com Sentinelas",
        "Ponteiros em Arranjos e Lista Livre",
        "Filho Esquerdo–Irmão Direito",
        "Hashing com Encadeamento",
        "Hashing Universal",
        "Endereçamento Aberto",
        "Hashing Perfeito O(1)"
      ]
    },
    {
      id: 8,
      code: "MÓDULO 08",
      blockId: "bloco-3",
      chapters: "Capítulos 12, 13 e 14 (pp. 244–299)",
      title: "Árvores de Busca Binária, Árvores Vermelho-Preto e Aumento de Estruturas",
      unlocked: false,
      estimatedTime: "5h 00min",
      objective:
        "Dominar operações em Árvores de Busca Binária (ABB), garantir desempenho O(lg n) no pior caso por meio das propriedades e rotações das Árvores Vermelho-Preto, e aplicar o Teorema 14.1 para criar árvores de estatísticas de ordem e árvores de intervalos.",
      concepts: [
        "Consultas, TRANSPLANT e TREE-DELETE",
        "ABB Construída Aleatoriamente",
        "5 Propriedades Vermelho-Preto",
        "LEFT-ROTATE e RIGHT-ROTATE",
        "RB-INSERT e RB-DELETE",
        "OS-SELECT e OS-RANK",
        "Árvores de Intervalos"
      ]
    },
    {
      id: 9,
      code: "MÓDULO 09",
      blockId: "bloco-4",
      chapters: "Capítulos 15, 16 e 17 (pp. 300–397)",
      title: "Programação Dinâmica, Algoritmos Gulosos e Análise Amortizada",
      unlocked: false,
      estimatedTime: "5h 30min",
      objective:
        "Resolver problemas de otimização identificando subestrutura ótima e subproblemas superpostos (Programação Dinâmica), discernir quando a propriedade de escolha gulosa e matroides garantem otimalidade, e dominar os três métodos de análise amortizada.",
      concepts: [
        "Corte de Hastes e Cadeias de Matrizes",
        "LCS e Árvores de Busca Ótimas",
        "Seleção de Atividades e Huffman",
        "Teoria dos Matroides",
        "Análise Agregada, Contabilidade e Potencial",
        "Tabelas Dinâmicas (Expansão e Contração)"
      ]
    },
    {
      id: 10,
      code: "MÓDULO 10",
      blockId: "bloco-4",
      chapters: "Capítulos 18, 19, 20 e 21 (pp. 398–482)",
      title: "Estruturas Avançadas: Árvores B, Heaps de Fibonacci, vEB e Conjuntos Disjuntos",
      unlocked: false,
      estimatedTime: "5h 30min",
      objective:
        "Projetar e analisar estruturas especializadas para memória secundária (Árvores B), filas de prioridades intercaláveis com custos amortizados constantes (Heaps de Fibonacci), buscas em O(lg lg u) (van Emde Boas) e Conjuntos Disjuntos em O(m α(n)).",
      concepts: [
        "Árvores B e DISK-READ/WRITE",
        "Heaps de Fibonacci e CASCADING-CUT",
        "Árvores proto-vEB e vEB O(lg lg u)",
        "Florestas de Conjuntos Disjuntos",
        "União pelo Posto e Compressão de Caminho",
        "Função Inversa de Ackermann α(n)"
      ]
    },
    {
      id: 11,
      code: "MÓDULO 11",
      blockId: "bloco-5",
      chapters: "Capítulos 22 e 23 + Apêndice B (pp. 483–525, 931–949)",
      title: "Algoritmos Elementares em Grafos (BFS, DFS, SCC) e Árvores Geradoras Mínimas",
      unlocked: false,
      estimatedTime: "4h 45min",
      objective:
        "Dominar o formalismo matemático de grafos e árvores (Apêndice B), explorar grafos via Busca em Largura (BFS) e Busca em Profundidade (DFS), realizar Ordenação Topológica, decompor Componentes Fortemente Conexas e construir MSTs com Kruskal e Prim.",
      concepts: [
        "Listas e Matrizes de Adjacências",
        "Busca em Largura (BFS)",
        "Busca em Profundidade (DFS) e Parênteses",
        "Ordenação Topológica",
        "Componentes Fortemente Conexas",
        "Arestas Seguras, MST-KRUSKAL e MST-PRIM"
      ]
    },
    {
      id: 12,
      code: "MÓDULO 12",
      blockId: "bloco-5",
      chapters: "Capítulos 24, 25 e 26 (pp. 526–623)",
      title: "Caminhos Mínimos (Fonte Única e Todos os Pares) e Redes de Fluxo Máximo",
      unlocked: false,
      estimatedTime: "5h 30min",
      objective:
        "Dominar a teoria do relaxamento de arestas (Bellman-Ford, DAGs, Dijkstra, Restrições de Diferença, Floyd-Warshall e Johnson) e resolver problemas de Fluxo Máximo e corte mínimo via Ford-Fulkerson, Edmonds-Karp e algoritmos Push-Relabel.",
      concepts: [
        "Relaxamento, Bellman-Ford e Dijkstra",
        "Restrições de Diferença",
        "Floyd-Warshall e Fecho Transitivo",
        "Algoritmo de Johnson",
        "Teorema Fluxo Máximo–Corte Mínimo",
        "Ford-Fulkerson, Push-Relabel e Relabel-to-Front"
      ]
    },
    {
      id: 13,
      code: "MÓDULO 13",
      blockId: "bloco-6",
      chapters: "Capítulos 27, 28 e 29 + Apêndice D (pp. 624–725, 978–990)",
      title: "Algoritmos Multithread, Operações com Matrizes e Programação Linear",
      unlocked: false,
      estimatedTime: "5h 00min",
      objective:
        "Projetar algoritmos paralelos no modelo de multithread dinâmico (trabalho T₁ e duração T∞), resolver sistemas lineares (LU/LUP), inversão de matrizes e mínimos quadrados, e formular/resolver problemas de Programação Linear via Simplex e Dualidade.",
      concepts: [
        "spawn, sync, parallel, Trabalho T₁ e Duração T∞",
        "P-MERGE-SORT",
        "Decomposição LU e LUP",
        "Mínimos Quadrados e Matrizes Positivas Definidas",
        "Formas Padrão e de Folgas",
        "Algoritmo SIMPLEX e Teorema da Dualidade"
      ]
    },
    {
      id: 14,
      code: "MÓDULO 14",
      blockId: "bloco-6",
      chapters: "Capítulos 30 e 31 (pp. 726–795)",
      title: "Polinômios, Transformada Rápida de Fourier (FFT) e Teoria dos Números",
      unlocked: false,
      estimatedTime: "5h 00min",
      objective:
        "Multiplicar polinômios em Θ(n lg n) via Transformada Rápida de Fourier (FFT recursiva e iterativa) e dominar os algoritmos de teoria dos números que sustentam o criptossistema RSA, o teste de primalidade de Miller-Rabin e a fatoração de Pollard-Rho.",
      concepts: [
        "Raízes Complexas da Unidade e DFT",
        "RECURSIVE-FFT e ITERATIVE-FFT",
        "EUCLID e EXTENDED-EUCLID",
        "Teorema Chinês do Resto",
        "Potenciação Modular e Criptografia RSA",
        "Teste MILLER-RABIN e Fatoração POLLARD-RHO"
      ]
    },
    {
      id: 15,
      code: "MÓDULO 15",
      blockId: "bloco-6",
      chapters: "Capítulos 32 e 33 (pp. 796–845)",
      title: "Correspondência de Cadeias e Geometria Computacional",
      unlocked: false,
      estimatedTime: "4h 30min",
      objective:
        "Localizar padrões em cadeias com eficiência ótima (Rabin-Karp, Autômatos Finitos e Knuth-Morris-Pratt) e resolver problemas geométricos no plano via produtos vetoriais, varredura de linha, envoltória convexa (Graham e Jarvis) e par mais próximo.",
      concepts: [
        "Algoritmo de Rabin-Karp",
        "Autômatos Finitos para Cadeias",
        "Algoritmo KMP e Função de Prefixo π",
        "Produtos Vetoriais e SEGMENTS-INTERSECT",
        "Varredura de Linha (Sweep-Line)",
        "GRAHAM-SCAN, Marcha de Jarvis e Par Mais Próximo"
      ]
    },
    {
      id: 16,
      code: "MÓDULO 16",
      blockId: "bloco-6",
      chapters: "Capítulos 34 e 35 (pp. 846–918)",
      title: "Intratabilidade Computacional: Problemas NP-Completos e Algoritmos de Aproximação",
      unlocked: false,
      estimatedTime: "5h 15min",
      objective:
        "Compreender as classes P, NP e co-NP, dominar reduções em tempo polinomial (≤_P) para provar NP-completude (CIRCUIT-SAT, SAT, 3-CNF-SAT, CLIQUE, VERTEX-COVER, HAM-CYCLE, TSP, SUBSET-SUM) e projetar algoritmos de aproximação com garantias provadas.",
      concepts: [
        "Classes P, NP, co-NP e Certificados",
        "Redutibilidade Polinomial ≤_P",
        "Teorema de Cook-Levin (CIRCUIT-SAT e 3-CNF-SAT)",
        "Cadeia de Reduções NP-Completas",
        "2-Aproximação para Cobertura de Vértices e TSP",
        "GREEDY-SET-COVER e FPTAS para SUBSET-SUM"
      ]
    }
  ],

  /* ========================================================================
     CONTEÚDO INTEGRAL E APROFUNDADO DO MÓDULO 1 (CAPÍTULOS 1 E 2)
     ======================================================================== */
  module1: {
    revisao: {
      subtitle: "Ponto de Partida, Contrato Intelectual da Obra e Base Matemática para os Capítulos 1 e 2",
      intro:
        "Por inaugurarmos aqui o estudo de 'Algoritmos: Teoria e Prática' (Parte I: Fundamentos), esta etapa de Revisão cumpre um duplo papel: apresentar a arquitetura metodológica estabelecida por Cormen, Leiserson, Rivest e Stein no Prefácio e na Introdução da Parte I, e consolidar os quatro pilares matemáticos e de notação indispensáveis para que você absorva os Capítulos 1 e 2 sem nenhuma lacuna.",
      pillars: [
        {
          tag: "[ PILAR 01 • ÍNDICES E SEQUÊNCIAS ]",
          title: "Notação de Sequências Finitas, Arranjos 1-Indexados e Permutações",
          body: `
            <p>Ao longo de todo o livro, os autores distinguem cuidadosamente o objeto matemático abstrato (uma <strong>sequência</strong>) de sua representação concreta na memória (um <strong>arranjo</strong>):</p>
            <ul>
              <li><strong>Sequências com colchetes angulares:</strong> Uma sequência ordenada de $n$ elementos é escrita como $\\langle a_1, a_2, \\dots, a_n \\rangle$. Por exemplo, $\\langle 31, 41, 59, 26, 41, 58 \\rangle$.</li>
              <li><strong>Permutação (reordenação):</strong> Uma sequência $\\langle a'_1, a'_2, \\dots, a'_n \\rangle$ é uma <em>permutação</em> de $\\langle a_1, a_2, \\dots, a_n \\rangle$ se contém exatamente os mesmos elementos (com as mesmas multiplicidades, caso haja chaves repetidas como o $41$), apenas possivelmente em outra ordem.</li>
              <li><strong>Ordem não decrescente vs. estritamente crescente:</strong> Quando escrevemos $a'_1 \\le a'_2 \\le \\dots \\le a'_n$, dizemos ordem <strong>não decrescente</strong> (pois elementos iguais adjacentes são permitidos, como $41 \\le 41$). De forma análoga, $a'_1 \\ge a'_2 \\ge \\dots \\ge a'_n$ é denominada ordem <strong>não crescente</strong>.</li>
              <li><strong>Indexação iniciada em $1$:</strong> No pseudocódigo CLRS, os arranjos começam no índice $1$, isto é, $A[1 \\dots n]$, onde $n$ é armazenado no atributo $A.\\text{comprimento}$. A notação de fatia (<em>subarranjo</em>) $A[i \\dots j]$ representa os $j - i + 1$ elementos $A[i], A[i+1], \\dots, A[j]$. Se $i > j$ (por exemplo, $A[p \\dots k-1]$ quando $k = p$), o subarranjo é <strong>vazio</strong> e contém $0$ elementos!</li>
            </ul>
          `
        },
        {
          tag: "[ PILAR 02 • LOGARITMOS E ESCALA ]",
          title: "O Logaritmo Binário (lg n) e a Árvore de Divisões Sucessivas",
          body: `
            <p>Na análise de algoritmos, a base $2$ é tão onipresente que o livro adota a notação padrão $\\lg n$ para denotar $\\log_2 n$ (logaritmo na base $2$):</p>
            <ul>
              <li>Por definição, $\\lg n = k \\iff 2^k = n$. Assim, $\\lg 1 = 0$, $\\lg 2 = 1$, $\\lg 8 = 3$, $\\lg 1.024 = 10$ e $\\lg 1.048.576 = 20$.</li>
              <li><strong>Interpretação algorítmica:</strong> Se você tem uma coleção de $n = 2^k$ elementos e a divide ao meio repetidamente até restarem subcoleções de apenas $1$ elemento, quantas divisões em série você fará? Exatamente $k = \\lg n$ divisões! E quantos níveis terá a árvore que inclui tanto o nível original (tamanho $n$) quanto o nível das folhas (tamanho $1$)? Exatamente $\\lg n + 1$ níveis.</li>
              <li><strong>Contraste de crescimento:</strong> Quando $n = 1.000$, temos $\\lg n \\approx 10$; quando $n = 1.000.000$ ($10^6$), $n$ multiplicou por mil, mas $\\lg n$ apenas dobrou para $\\approx 20$; para $n = 10^7$ (dez milhões), $\\lg 10^7 \\approx 23,25$. Essa compressão exponencial é o segredo por trás da eficiência de algoritmos de divisão e conquista.</li>
            </ul>
          `
        },
        {
          tag: "[ PILAR 03 • SOMATÓRIOS DE LAÇOS ]",
          title: "Soma de Progressão Aritmética e Contagem de Testes em Laços",
          body: `
            <p>Quando um laço <code>for</code> ou <code>while</code> executa na máquina de acesso aleatório (RAM), o tempo total gasto é proporcional à soma das execuções de cada linha. Duas regras algébricas serão usadas diretamente no Capítulo 2:</p>
            <ul>
              <li><strong>O teste do cabeçalho do laço executa uma vez a mais que o corpo:</strong> Se um laço <code>for j = 2 to n</code> termina normalmente, o corpo executa para $j = 2, 3, \\dots, n$ (totalizando $n - 1$ vezes), mas o teste no cabeçalho também é avaliado quando $j = n + 1$ (momento em que falha e encerra o laço), totalizando $(n - 1) + 1 = n$ avaliações!</li>
              <li><strong>Fórmulas de Gauss para somatórios lineares:</strong> Sabemos que $\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}$. Consequentemente, no Capítulo 2 encontraremos duas variantes diretas (quando $j$ varia de $2$ até $n$):
                $$\\sum_{j=2}^{n} j = \\left(\\sum_{j=1}^{n} j\\right) - 1 = \\frac{n(n+1)}{2} - 1 \\qquad \\text{e} \\qquad \\sum_{j=2}^{n} (j - 1) = \\sum_{k=1}^{n-1} k = \\frac{n(n-1)}{2}$$
                Observe que ambas as somas são polinômios de segundo grau em $n$ (isto é, crescem proporcionalmente a $\\frac{1}{2}n^2$).</li>
            </ul>
          `
        },
        {
          tag: "[ PILAR 04 • INDUÇÃO FINITA ]",
          title: "Da Indução Matemática Clássica para o Invariante de Laço",
          body: `
            <p>Na matemática, para provar que uma proposição $P(k)$ vale para todos os inteiros $k \\ge k_0$, demonstramos um <strong>Caso Base</strong> ($P(k_0)$ é verdadeira) e um <strong>Passo Indutivo</strong> (se $P(k)$ vale, então $P(k+1)$ também vale).</p>
            <p>Em Ciência da Computação, os autores adaptam a indução matemática para demonstrar formalmente que um laço produz a resposta correta por meio de um <strong>Invariante de Laço</strong> — uma afirmação sobre o estado das variáveis antes de cada iteração. A diferença crucial está na 3ª etapa (<strong>Término</strong>): enquanto na indução matemática o passo indutivo se estende ao infinito, num algoritmo a indução <em>para</em> quando a condição do laço deixa de valer, e combinamos o invariante com a negação da condição do laço para provar a corretude final.</p>
          `
        }
      ],
      checklist: [
        "Compreendo que no pseudocódigo do livro um arranjo A[1 .. n] começa no índice 1 e que o subarranjo A[1 .. j - 1] possui apenas o elemento A[1] quando j = 2.",
        "Sei que lg n significa log₂ n e que lg(10⁷) ≈ 23,25 enquanto n = 10.000.000.",
        "Entendo por que um cabeçalho de laço que termina normalmente executa seu teste 1 vez a mais que o corpo interno do laço.",
        "Compreendo as duas igualdades de somatório: ∑_{j=2..n} j = n(n+1)/2 − 1 e ∑_{j=2..n} (j−1) = n(n−1)/2."
      ]
    },

    unidades: [
      /* ====================================================================
         UNIDADE 1.1 — CAPÍTULO 1, SEÇÃO 1.1
         ==================================================================== */
      {
        id: "u1-1",
        code: "UNIDADE 1.1 • CAP. 1 (SEÇÃO 1.1)",
        pages: "pp. 17–21",
        title: "O Papel dos Algoritmos na Computação: Definição, Domínios e Fronteiras",
        content: `
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
            <p><strong>Entrada:</strong> Uma sequência de $n$ números $\\langle a_1, a_2, \\dots, a_n \\rangle$.</p>
            <p><strong>Saída:</strong> Uma permutação (reordenação) $\\langle a'_1, a'_2, \\dots, a'_n \\rangle$ da sequência de entrada, tal que $a'_1 \\le a'_2 \\le \\dots \\le a'_n$.</p>
          </div>

          <p>Por exemplo, dada a sequência de entrada $\\langle 31, 41, 59, 26, 41, 58 \\rangle$, um algoritmo de ordenação devolve como saída a sequência $\\langle 26, 31, 41, 41, 58, 59 \\rangle$. Essa sequência específica de entrada é denominada uma <strong>instância</strong> do problema de ordenação. Em geral, uma <strong>instância de um problema</strong> consiste na entrada (que satisfaz quaisquer restrições impostas no enunciado do problema) necessária para calcular uma solução para o problema.</p>
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
            <li><strong>Subsequência Comum Mais Longa — LCS (Capítulo 15):</strong> Dadas duas sequências de símbolos $X = \\langle x_1, x_2, \\dots, x_m \\rangle$ e $Y = \\langle y_1, y_2, \\dots, y_n \\rangle$, uma subsequência é obtida removendo alguns (ou todos, ou nenhum) elementos sem alterar a ordem relativa (ex.: de $\\langle A, B, C, D, E, F, G \\rangle$ podemos extrair $\\langle B, C, E, G \\rangle$). Medir a maior subsequência comum entre dois filamentos de DNA revela seu grau de semelhança genética. Contudo, $X$ e $Y$ possuem $2^m$ e $2^n$ subsequências possíveis! Enumerá-las por força bruta é inviável, mas a <strong>programação dinâmica</strong> resolve o problema em tempo polinomial.</li>
            <li><strong>Ordenação Topológica de um Catálogo de Peças (Capítulo 22):</strong> Num projeto mecânico com $n$ peças onde algumas dependem de outras, queremos listar as peças de modo que cada peça apareça antes de qualquer outra que a utilize. Existem $n!$ (n fatorial) ordenações possíveis — e $n!$ cresce ainda mais rápido que uma exponencial $2^n$. A ordenação topológica em grafos resolve isso em tempo linear!</li>
            <li><strong>Envoltória Convexa de $n$ Pontos no Plano (Capítulo 33):</strong> A envoltória convexa é o menor polígono convexo que engloba todos os $n$ pontos (imagine cada ponto como um prego cravado numa tábua e a envoltória como um elástico esticado solto ao redor de todos os pregos). Há $2^n$ subconjuntos possíveis de pontos para serem vértices, além de suas permutações de ordem, mas métodos de varredura geométrica (Varredura de Graham e Marcha de Jarvis) a encontram eficientemente.</li>
            <li><strong>Transformada Discreta e Rápida de Fourier — DFT e FFT (Capítulo 30):</strong> Nem todo problema possui um conjunto discreto óbvio de soluções candidatas. Na conversão de amostras numéricas de um sinal do domínio do tempo para o domínio da frequência, a FFT realiza o cálculo em $\\Theta(n \\lg n)$, viabilizando processamento de áudio/imagem, compressão de dados e multiplicação de grandes polinômios e inteiros.</li>
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
                <li>Embora nenhum algoritmo eficiente jamais tenha sido encontrado para qualquer problema NP-completo, <em>ninguém jamais provou que é impossível existir um</em> (o problema em aberto $\\text{P} \\stackrel{?}{=} \\text{NP}$).</li>
                <li>Eles possuem a propriedade extraordinária do "tudo ou nada": <em>se existir um algoritmo eficiente para um único problema NP-completo, então existirão algoritmos eficientes para todos eles!</em></li>
                <li>Vários problemas NP-completos são superficialmente quase idênticos a problemas fáceis que possuem algoritmos eficientes: uma pequena mudança no enunciado transforma um problema tratável (como o caminho mais curto entre dois pontos) em um problema NP-completo intratável (como o <strong>Problema do Caixeiro-Viajante — TSP</strong>, onde o caminhão de entregas deve visitar todos os pontos e retornar ao depósito percorrendo a menor distância total). Saber identificar a NP-completude evita que o engenheiro perca meses buscando um algoritmo exato rápido inexistente e permite recorrer aos <strong>algoritmos de aproximação</strong> (Capítulo 35).</li>
              </ol>
            </li>
            <li><strong>Paralelismo e Processadores Multicore (Capítulo 27):</strong> Durante décadas, a velocidade de relógio (<em>clock</em>) dos processadores cresceu regularmente. Contudo, limitações físicas impuseram uma barreira: a <strong>densidade de potência aumenta superlinearmente com a velocidade de relógio</strong>, gerando risco real de derretimento dos chips! A resposta da indústria foi integrar múltiplos núcleos de processamento (<em>multicore</em>) em um único chip — verdadeiros computadores paralelos em miniatura. Para extrair desempenho deles, o Capítulo 27 desenvolve a teoria dos algoritmos <strong>multithread dinâmicos</strong>.</li>
          </ul>
        `
      },

      /* ====================================================================
         UNIDADE 1.2 — CAPÍTULO 1, SEÇÃO 1.2
         ==================================================================== */
      {
        id: "u1-2",
        code: "UNIDADE 1.2 • CAP. 1 (SEÇÃO 1.2)",
        pages: "pp. 21–24",
        title: "Algoritmos como Tecnologia e o Duelo Computador A vs. Computador B",
        content: `
          <h3>1. Por que Estudar Algoritmos se o Hardware é Rápido?</h3>
          <p>Os autores abrem a Seção 1.2 com uma provocação: <em>"Suponha que os computadores fossem infinitamente rápidos e que a memória do computador fosse gratuita. Você teria alguma razão para estudar algoritmos?"</em></p>
          <p>A resposta ainda seria <strong>sim</strong> — nem que fosse apenas porque você precisaria demonstrar que seu método de solução realmente <strong>termina</strong> e o faz produzindo a <strong>resposta correta</strong>. Na realidade, porém, computadores não são infinitamente rápidos e memória não é gratuita: <strong>tempo de computação e espaço na memória são recursos escassos</strong> que precisam ser usados com sabedoria.</p>

          <h3>2. O Impacto Dramático da Eficiência: $c_1 n^2$ versus $c_2 n \\lg n$</h3>
          <p>Algoritmos diferentes criados para solucionar exatamente o mesmo problema frequentemente diferem brutalmente em eficiência — e essas diferenças de ordem de crescimento superam de longe qualquer diferença de hardware ou de linguagem de programação.</p>
          <p>No Capítulo 2 estudaremos dois algoritmos para ordenar $n$ itens:</p>
          <ul>
            <li><strong>Ordenação por Inserção (<code>INSERTION-SORT</code>):</strong> leva um tempo aproximadamente igual a $c_1 n^2 = c_1 n \\cdot n$, onde $c_1$ é uma constante que não depende de $n$ (mas reflete a compactação de seus laços internos).</li>
            <li><strong>Ordenação por Intercalação (<code>MERGE-SORT</code>):</strong> leva um tempo aproximadamente igual a $c_2 n \\lg n = c_2 n \\cdot \\lg n$, onde $\\lg n = \\log_2 n$ e $c_2$ é outra constante com $c_1 < c_2$ (já que a ordenação por inserção possui código mais simples e menor sobrecarga constante).</li>
          </ul>
          <p>Embora $c_1 < c_2$ faça a ordenação por inserção vencer para entradas muito pequenas, compare o segundo fator de cada produto: na ordenação por inserção ele é $n$, enquanto na ordenação por intercalação é $\\lg n$. Quando $n = 1.000$, $\\lg n \\approx 10$; quando $n = 1.000.000$, $\\lg n \\approx 20$. Independentemente do quão menor $c_1$ seja em relação a $c_2$, <strong>sempre haverá um ponto de corte (<em>crossover point</em>) além do qual a ordenação por intercalação será mais rápida</strong>.</p>

          <div class="canonical-callout invariant">
            <span class="callout-tag">[ ESTUDO DE CASO CANÔNICO • COMPUTADOR A vs. COMPUTADOR B (p. 22) ]</span>
            <p>Ambos os computadores devem ordenar um arranjo de <strong>$n = 10.000.000$ ($10^7$) números</strong> (inteiros de 8 bytes ocupam apenas $\\approx 80\\text{ MB}$, cabendo com folga na RAM de qualquer laptop):</p>
            <ul>
              <li><strong>Computador A (Supercomputador Sequencial + Melhor Programador do Mundo):</strong> Executa <strong>$10\\text{ bilhões}$ ($10^{10}$) de instruções por segundo</strong>. O programador mais astucioso do planeta implementa a <strong>Ordenação por Inserção</strong> diretamente em linguagem de máquina, exigindo apenas $2n^2$ instruções.</li>
              <li><strong>Computador B ($1.000\\times$ mais lento + Compilador Ineficiente):</strong> Executa apenas <strong>$10\\text{ milhões}$ ($10^7$) de instruções por segundo</strong>. Um programador mediano implementa a <strong>Ordenação por Intercalação</strong> em linguagem de alto nível com um compilador ruim, exigindo $50n \\lg n$ instruções (constante $25\\times$ pior!).</li>
            </ul>
            <p><strong>Resultado para $n = 10^7$ (dez milhões de números):</strong></p>
            $$\\text{Tempo do Computador A} = \\frac{2 \\cdot (10^7)^2 \\text{ instruções}}{10^{10} \\text{ instruções/segundo}} = 20.000 \\text{ segundos } (\\text{mais de } 5,5 \\text{ horas!})$$
            $$\\text{Tempo do Computador B} = \\frac{50 \\cdot 10^7 \\lg 10^7 \\text{ instruções}}{10^7 \\text{ instruções/segundo}} \\approx 1.163 \\text{ segundos } (\\text{menos de } 20 \\text{ minutos!})$$
            <p>Mesmo com um hardware <strong>mil vezes mais lento</strong> e um código com constante <strong>vinte e cinco vezes maior</strong>, o Computador B termina <strong>mais de 17 vezes mais rápido</strong> que o Computador A! E se subirmos a entrada para <strong>$n = 10^8$ (100 milhões de números)</strong>, o Computador A levará <strong>mais de 23 dias</strong> ($2.000.000\\text{ s}$), enquanto o Computador B concluirá a tarefa em <strong>menos de 4 horas</strong> ($\\approx 13.287\\text{ s}$).</p>
          </div>

          <h3>3. Algoritmos e Outras Tecnologias Contemporâneas</h3>
          <p>Por tudo isso, os algoritmos devem ser encarados como uma <strong>tecnologia</strong> de primeira classe, lado a lado com o hardware. E mesmo diante de tecnologias modernas — arquiteturas avançadas de fabricação, interfaces gráficas (GUIs), orientação a objetos, tecnologias integradas da Web e redes de alta velocidade com e sem fio — os algoritmos permanecem no núcleo de tudo:</p>
          <ol>
            <li><strong>No nível da aplicação:</strong> Um serviço de mapas na Web depende de hardware, GUI, rede e orientação a objetos, mas não pode existir sem algoritmos de caminhos mínimos para traçar rotas, algoritmos de renderização de mapas e interpolação de endereços.</li>
            <li><strong>Na infraestrutura invisível de todas as aplicações:</strong> Até uma aplicação Web simples que pareça não ter conteúdo algorítmico explícito depende integralmente de algoritmos: o projeto eletrônico do hardware usou algoritmos (VLSI/CAD); o desenho da GUI usa algoritmos gráficos; a transmissão em rede depende de algoritmos de roteamento e controle de congestionamento; e o código escrito em qualquer linguagem foi processado por um compilador, interpretador ou montador recheado de algoritmos!</li>
          </ol>
          <p>Como resumem os autores no fechamento do Capítulo 1: <em>"Uma sólida base de conhecimento e técnica de algoritmos é uma das características que separam os programadores verdadeiramente qualificados dos novatos. Com a moderna tecnologia de computação, você pode executar algumas tarefas sem saber muito sobre algoritmos; porém, com uma boa base em algoritmos, é possível fazer muito, muito mais."</em></p>

          <div id="workbench-scale-mount"></div>
        `
      },

      /* ====================================================================
         UNIDADE 2.1 — CAPÍTULO 2, SEÇÃO 2.1
         ==================================================================== */
      {
        id: "u2-1",
        code: "UNIDADE 2.1 • CAP. 2 (SEÇÃO 2.1)",
        pages: "pp. 25–30",
        title: "Ordenação por Inserção, Convenções de Pseudocódigo e Invariantes de Laço",
        content: `
          <p>O Capítulo 2 (<em>"Dando a Partida"</em>) nos apresenta a estrutura metodológica que percorrerá todo o livro: especificar o algoritmo em um pseudocódigo límpido, demonstrar matematicamente sua corretude por meio de um <strong>invariante de laço</strong> e analisar seu tempo de execução.</p>

          <h3>1. A Mecânica da Ordenação por Inserção (<code>INSERTION-SORT</code>)</h3>
          <p>A <strong>ordenação por inserção</strong> é um algoritmo eficiente para ordenar um número pequeno de elementos. Os números que desejamos ordenar são chamados de <strong>chaves</strong>.</p>

          <div class="canonical-callout analogy">
            <span class="callout-tag">[ ANALOGIA DO LIVRO • CARTAS DE BARALHO (FIGURA 2.1, p. 26) ]</span>
            <p>A ordenação por inserção funciona exatamente como muitas pessoas ordenam cartas em um jogo de baralho. Começamos com a mão esquerda vazia e todas as cartas viradas para baixo sobre a mesa. Em seguida, pegamos uma carta de cada vez da mesa e a inserimos na posição correta na mão esquerda. Para achar a posição correta dessa nova carta, nós a comparamos com cada uma das cartas que já estão na mão, <strong>da direita para a esquerda</strong>. Em todos os momentos, as cartas seguradas na mão esquerda estão ordenadas, e essas cartas eram justamente as que estavam no topo da pilha sobre a mesa.</p>
          </div>

          <p>O procedimento <code>INSERTION-SORT(A)</code> recebe como parâmetro um arranjo $A[1 \\dots n]$ de comprimento $n = A.\\text{comprimento}$. Ele ordena os elementos <strong>no lugar</strong> (<em>in-place</em>): reorganiza os números dentro do próprio arranjo $A$, mantendo no máximo um número <strong>constante</strong> de elementos armazenados fora do arranjo em qualquer instante (a variável escalar <code>chave</code>, além dos índices locais <code>i</code> e <code>j</code>).</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">INSERTION-SORT(A)</span>
              <span>[ CAPÍTULO 2.1 • ORDENAÇÃO NO LUGAR ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">for</span> j = 2 <span class="kw">to</span> A.comprimento</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    chave = A[j]</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    <span class="cmt">// Inserir A[j] na sequência ordenada A[1 .. j - 1].</span></span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    i = j - 1</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">while</span> i &gt; 0 <span class="kw">e</span> A[i] &gt; chave</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">        A[i + 1] = A[i]</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">        i = i - 1</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">    A[i + 1] = chave</span></div>
            </div>
          </div>

          <h3>2. Invariantes de Laço e a Prova de Corretude da Ordenação por Inserção</h3>
          <p>Na Figura 2.2 do livro ($A = \\langle 5, 2, 4, 6, 1, 3 \\rangle$), o índice $j$ indica a "carta atual" que está sendo retirada da mesa para ser inserida na mão esquerda. No início de cada iteração do laço <code>for</code> externo (indexado por $j$), o subarranjo $A[1 \\dots j - 1]$ corresponde à mão atualmente ordenada, e o subarranjo restante $A[j + 1 \\dots n]$ corresponde à pilha de cartas ainda sobre a mesa. Mais do que estar ordenado, $A[1 \\dots j - 1]$ contém exatamente os elementos que estavam <em>originalmente</em> nas posições $1$ a $j - 1$ (isto é, não perdemos nem inventamos números!). Enunciamos isso formalmente:</p>

          <div class="canonical-callout invariant">
            <span class="callout-tag">[ INVARIANTE DE LAÇO • INSERTION-SORT (p. 27) ]</span>
            <p><strong>Enunciado do Invariante:</strong> <em>"No início de cada iteração para o laço <code>for</code> das linhas 1–8, o subarranjo $A[1 \\dots j - 1]$ consiste nos elementos que estavam originalmente em $A[1 \\dots j - 1]$, porém em sequência ordenada."</em></p>
            <div class="invariant-triad">
              <div class="triad-card">
                <div class="triad-card-title">1. Inicialização</div>
                <p>Devemos mostrar que o invariante vale antes da primeira iteração do laço, quando $j = 2$ (logo após a atribuição inicial $j=2$ e antes do primeiro teste $j \\le A.\\text{comprimento}$). Nesse instante, o subarranjo $A[1 \\dots j-1]$ é $A[1 \\dots 1]$, que consiste apenas no único elemento $A[1]$. Ele é o elemento original de $A[1]$ e um único elemento está trivialmente ordenado. Logo, o invariante é válido.</p>
              </div>
              <div class="triad-card">
                <div class="triad-card-title">2. Manutenção</div>
                <p>Devemos mostrar que se o invariante é verdadeiro antes de uma iteração, permanece verdadeiro antes da próxima. O corpo do laço desloca $A[j-1], A[j-2], \\dots$ uma posição para a direita (linhas 5–7) até achar a posição correta para $A[j]$ e ali insere a <code>chave</code> (linha 8). Nesse ponto, $A[1 \\dots j]$ contém os elementos originais de $A[1 \\dots j]$ ordenados. Quando o laço <code>for</code> incrementa $j$ para a próxima iteração, o novo $A[1 \\dots j-1]$ preserva exatamente o invariante.</p>
              </div>
              <div class="triad-card">
                <div class="triad-card-title">3. Término</div>
                <p>Examinamos o que ocorre quando o laço termina. A condição que força o término do laço <code>for</code> é $j > A.\\text{comprimento} = n$. Como cada iteração aumenta $j$ de $1$, temos exatamente $j = n + 1$ na saída. Substituindo $j = n + 1$ no enunciado do invariante de laço, obtemos que o subarranjo $A[1 \\dots (n+1)-1] = A[1 \\dots n]$ consiste nos elementos originalmente contidos em $A[1 \\dots n]$, mas em sequência ordenada. Como $A[1 \\dots n]$ é o arranjo inteiro, o algoritmo é correto!</p>
              </div>
            </div>
          </div>

          <h3>3. Todas as Convenções do Pseudocódigo CLRS (pp. 28–29)</h3>
          <p>Para ler e escrever algoritmos em todo o curso sem ambiguidades, os autores estabelecem 11 convenções de pseudocódigo essenciais que você deve dominar:</p>
          <ol>
            <li><strong>Recuo (indentação) define estrutura de bloco:</strong> Eliminam-se palavras como <code>begin</code> e <code>end</code>. Em instruções <code>if-else</code>, o <code>else</code> fica alinhado no mesmo recuo do <code>if</code> correspondente, e testes encadeados usam <code>elseif</code>.</li>
            <li><strong>Retenção do valor do contador de laço após a saída:</strong> Ao contrário de certas declarações locais em C++ ou Java, no pseudocódigo CLRS <strong>o contador do laço mantém o valor que primeiro violou o limite do laço</strong>. Por isso, após <code>for j = 2 to n</code> terminar normalmente, $j$ vale rigorosamente $n + 1$.</li>
            <li><strong>Palavras-chave <code>to</code>, <code>downto</code> e <code>by</code>:</strong> <code>to</code> incrementa o contador de $1$ em $1$; <code>downto</code> decrementa de $1$ em $1$; incrementos maiores usam a cláusula <code>by</code>.</li>
            <li><strong>Comentários e atribuição múltipla:</strong> <code>//</code> inicia um comentário de fim de linha. A instrução <code>i = j = e</code> equivale a <code>j = e</code> seguido de <code>i = j</code>.</li>
            <li><strong>Variáveis locais:</strong> Todas as variáveis (como <code>i</code>, <code>j</code>, <code>chave</code>) são locais ao procedimento, salvo menção explícita em contrário.</li>
            <li><strong>Acesso a arranjos e subarranjos:</strong> <code>A[i]</code> acessa o $i$-ésimo elemento, e <code>A[1 .. j]</code> denota o subarranjo de $A[1]$ até $A[j]$.</li>
            <li><strong>Objetos, atributos em cascata e ponteiros:</strong> Objetos possuem atributos acessados por ponto (como <code>A.comprimento</code>). A notação em cascata <code>x.f.g</code> significa <code>(x.f).g</code>. Uma variável representando um objeto ou arranjo é um <strong>ponteiro</strong> para seus dados: fazer <code>y = x</code> faz com que <code>x</code> e <code>y</code> apontem para o mesmo objeto; alterar <code>x.f = 3</code> imediatamente torna <code>y.f = 3</code>! Se um ponteiro não aponta para objeto algum, recebe o valor especial <code>NIL</code>.</li>
            <li><strong>Passagem de parâmetros por valor (com ponteiros copiados para objetos/arranjos):</strong> Procedimentos recebem cópias de seus parâmetros. Se $x$ é parâmetro e o procedimento faz $x = y$, o chamador não vê essa reatribuição da variável $x$; porém, se o procedimento faz <code>x.f = 3</code> ou <code>A[i] = 5</code>, a modificação no objeto apontado ou nos elementos do arranjo <strong>é visível</strong> para o chamador!</li>
            <li><strong>Instrução <code>return</code> com múltiplos valores:</strong> Diferente de muitas linguagens tradicionais, uma única instrução <code>return</code> no CLRS pode devolver múltiplos valores simultaneamente ao chamador.</li>
            <li><strong>Operadores booleanos <code>e</code> / <code>ou</code> com curto-circuito (<em>short-circuiting</em>):</strong> Em <code>x e y</code>, avaliamos primeiro <code>x</code>; se <code>x</code> for <code>FALSE</code>, <strong>não avaliamos <code>y</code></strong>! Isso é vital na linha 5 do <code>INSERTION-SORT</code> (<code>while i > 0 e A[i] > chave</code>): quando $i = 0$, o teste $i > 0$ dá <code>FALSE</code> e o curto-circuito impede a tentativa ilegal de acessar a posição inexistente $A[0]$! Da mesma forma, protege expressões como <code>x ≠ NIL e x.f == y</code>.</li>
            <li><strong>Palavra-chave <code>error</code>:</strong> Indica que as pré-condições da chamada foram violadas; o tratamento cabe ao procedimento chamador.</li>
          </ol>

          <div id="workbench-insertion-mount"></div>
        `
      },

      /* ====================================================================
         UNIDADE 2.2 — CAPÍTULO 2, SEÇÃO 2.2
         ==================================================================== */
      {
        id: "u2-2",
        code: "UNIDADE 2.2 • CAP. 2 (SEÇÃO 2.2)",
        pages: "pp. 30–35",
        title: "Análise de Algoritmos: Modelo RAM, Custos Exatos, Pior Caso e Ordem de Crescimento Θ",
        content: `
          <h3>1. O Modelo de Computação RAM (Random-Access Machine)</h3>
          <p>Analisar um algoritmo significa prever os recursos que ele consome (ocasionalmente memória, largura de banda ou hardware, mas primordialmente o <strong>tempo de computação</strong>). Para isso, adotamos como tecnologia de implementação o modelo genérico de <strong>Máquina de Acesso Aleatório (RAM)</strong> com um único processador:</p>
          <ul>
            <li><strong>Execução estritamente sequencial:</strong> As instruções são executadas uma após a outra, sem operações concorrentes (com exceção do Capítulo 27, que estuda paralelismo).</li>
            <li><strong>Instruções primitivas de tempo constante:</strong> O modelo RAM contém apenas instruções realistas presentes em processadores reais — <strong>aritméticas</strong> (soma, subtração, multiplicação, divisão, resto, piso, teto), <strong>movimentação de dados</strong> (carregar, armazenar, copiar) e <strong>controle</strong> (desvio condicional/incondicional, chamada e retorno de sub-rotinas). Cada uma dessas instruções leva um <strong>tempo constante</strong>. Não existe uma "instrução mágica de ordenação" em um único passo!</li>
            <li><strong>Tipos de dados e limite no tamanho da palavra:</strong> Os tipos são inteiros e números em ponto flutuante. Para uma entrada de tamanho $n$, assumimos que cada palavra de dados tem tamanho limitado a $c \\lg n$ bits (para uma constante $c \\ge 1$). <em>Por que $c \\ge 1$?</em> Para que uma palavra possa armazenar o valor $n$ e indexar qualquer um dos $n$ elementos da entrada. <em>Por que $c$ deve ser constante?</em> Porque se uma única palavra pudesse crescer arbitrariamente, poderíamos empacotar toda a entrada dentro de uma única palavra gigante e operar sobre ela em tempo constante, o que seria fisicamente absurdo!</li>
            <li><strong>A área cinzenta da exponenciação e o deslocamento de bits (<em>shift left</em>):</strong> Calcular $x^y$ para reais quaisquer não é uma operação de tempo constante. Entretanto, deslocar os bits de um inteiro $k$ posições para a esquerda equivale a multiplicar por $2^k$. Assim, calcular $2^k$ deslocando o inteiro $1$ em $k$ posições para a esquerda <strong>é tratado como uma operação de tempo constante</strong> desde que $k$ não exceda o número de bits de uma palavra do computador.</li>
            <li><strong>Hierarquia de memória:</strong> O modelo RAM padrão não modela caches L1/L2/L3 nem paginação em memória virtual (que serão tratados em modelos específicos, como Árvores B no Capítulo 18).</li>
          </ul>

          <h3>2. Tamanho da Entrada e Tempo de Execução</h3>
          <ul>
            <li><strong>Tamanho da entrada:</strong> Depende do problema. Para ordenação ou transformadas de Fourier, é o <strong>número de itens $n$</strong>. Para multiplicação de dois inteiros ou testes de primalidade, é o <strong>número total de bits</strong> necessários para representar a entrada em binário. Para algoritmos em grafos, é descrito por <strong>dois parâmetros</strong>: o número de vértices $|V|$ e o número de arestas $|E|$.</li>
            <li><strong>Tempo de execução $T(n)$:</strong> É o número de operações primitivas ("passos") executadas. Assumimos que cada execução da linha $i$ do pseudocódigo custa um tempo constante $c_i$ (e comentários custam $0$). Nota sutil: <em>chamar</em> uma sub-rotina custa tempo constante, mas <em>executar</em> a sub-rotina chamada tem seu próprio custo contabilizado separadamente.</li>
          </ul>

          <h3>3. Análise Linha a Linha do <code>INSERTION-SORT</code></h3>
          <p>Seja $t_j$ o número de vezes que o teste do laço <code>while</code> na linha 5 é executado para um determinado valor de $j \\in \\{2, 3, \\dots, n\\}$. Como um laço que termina normalmente avalia seu teste uma vez a mais que o corpo, as linhas 6 e 7 executam exatamente $t_j - 1$ vezes para cada $j$:</p>

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
                  <td>$\\sum_{j=2}^{n} t_j$</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td><code>&nbsp;&nbsp;&nbsp;&nbsp;A[i + 1] = A[i]</code></td>
                  <td>$c_6$</td>
                  <td>$\\sum_{j=2}^{n} (t_j - 1)$</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td><code>&nbsp;&nbsp;&nbsp;&nbsp;i = i - 1</code></td>
                  <td>$c_7$</td>
                  <td>$\\sum_{j=2}^{n} (t_j - 1)$</td>
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
          $$T(n) = c_1 n + c_2(n - 1) + c_4(n - 1) + c_5 \\sum_{j=2}^{n} t_j + c_6 \\sum_{j=2}^{n} (t_j - 1) + c_7 \\sum_{j=2}^{n} (t_j - 1) + c_8(n - 1)$$

          <h4>Caso 1: Melhor Caso (Arranjo já ordenado inicialmente)</h4>
          <p>Se o arranjo já está ordenado ($A[1] \\le A[2] \\le \\dots \\le A[n]$), então para cada $j = 2, 3, \\dots, n$, logo na primeira verificação da linha 5 (com $i = j - 1$), constatamos que $A[i] \\le \\text{chave}$. Assim, <strong>$t_j = 1$ para todo $j$</strong>, e $t_j - 1 = 0$ (o corpo das linhas 6 e 7 nunca é executado!). Substituindo $t_j = 1$:</p>
          $$T(n) = c_1 n + c_2(n - 1) + c_4(n - 1) + c_5(n - 1) + c_8(n - 1) = (c_1 + c_2 + c_4 + c_5 + c_8)n - (c_2 + c_4 + c_5 + c_8)$$
          <p>Podemos escrever esse tempo na forma $T(n) = an + b$ para constantes $a$ e $b$ que dependem apenas dos custos $c_i$. Portanto, no melhor caso, o tempo de execução é uma <strong>função linear de $n$</strong>, isto é, $\\Theta(n)$.</p>

          <h4>Caso 2: Pior Caso (Arranjo ordenado em ordem inversa / decrescente)</h4>
          <p>Se o arranjo está em ordem estritamente decrescente, cada novo elemento $A[j]$ é menor que todos os elementos de $A[1 \\dots j - 1]$ e precisa ser comparado com todos os $j - 1$ elementos anteriores antes que o teste termine quando $i = 0$. Portanto, <strong>$t_j = j$ para todo $j = 2, 3, \\dots, n$</strong>. Usando as identidades $\\sum_{j=2}^{n} j = \\frac{n(n+1)}{2} - 1$ e $\\sum_{j=2}^{n} (j - 1) = \\frac{n(n-1)}{2}$:</p>
          $$T(n) = c_1 n + c_2(n - 1) + c_4(n - 1) + c_5\\left(\\frac{n(n+1)}{2} - 1\\right) + c_6\\left(\\frac{n(n-1)}{2}\\right) + c_7\\left(\\frac{n(n-1)}{2}\\right) + c_8(n - 1)$$
          <p>Agrupando os termos em potências de $n$:</p>
          $$T(n) = \\left(\\frac{c_5}{2} + \\frac{c_6}{2} + \\frac{c_7}{2}\\right)n^2 + \\left(c_1 + c_2 + c_4 + \\frac{c_5}{2} - \\frac{c_6}{2} - \\frac{c_7}{2} + c_8\\right)n - (c_2 + c_4 + c_5 + c_8)$$
          <p>Podemos expressar esse tempo de pior caso como $T(n) = an^2 + bn + c$ para constantes $a, b, c$: trata-se de uma <strong>função quadrática de $n$</strong>.</p>

          <h3>4. Por Que Nos Concentramos no Pior Caso? (As 3 Razões de Cormen et al.)</h3>
          <ol>
            <li><strong>Garantia de limite superior absoluto:</strong> O tempo de pior caso estabelece um teto garantido — sabemos com certeza matemática que o algoritmo <em>jamais</em> demorará mais do que isso para qualquer entrada de tamanho $n$.</li>
            <li><strong>O pior caso ocorre com frequência na prática:</strong> Em sistemas de bancos de dados, por exemplo, o pior caso de uma busca ocorre justamente quando a informação procurada <em>não está presente</em> no banco, uma situação corriqueira em muitas aplicações reais.</li>
            <li><strong>O "caso médio" é frequentemente tão ruim quanto o pior caso:</strong> Suponha que escolhamos $n$ números aleatoriamente para o <code>INSERTION-SORT</code>. Em média, metade dos elementos em $A[1 \\dots j - 1]$ é maior que $A[j]$ e metade é menor; logo, percorremos metade do subarranjo e $t_j \\approx j/2$. Ao substituir $t_j = j/2$ nos somatórios, o termo dominante continua sendo proporcional a $n^2$ — ou seja, o caso médio da ordenação por inserção também é uma função quadrática $\\Theta(n^2)$, exatamente como o pior caso!</li>
          </ol>

          <h3>5. As Três Abstrações Simplificadoras até a Ordem de Crescimento $\\Theta$</h3>
          <p>Repare na progressão de abstrações que construímos:</p>
          <ol>
            <li>Primeiro, abstraímos os tempos físicos em microssegundos substituindo-os pelas constantes de instrução $c_i$;</li>
            <li>Segundo, agrupamos as combinações de $c_i$ nos coeficientes agregados $a, b, c$ em $T(n) = an^2 + bn + c$;</li>
            <li>Terceiro, concentramo-nos na <strong>ordem de crescimento</strong> (taxa de crescimento): descartamos os termos de ordem mais baixa ($bn + c$) e ignoramos o coeficiente constante do termo líder ($a$), retendo apenas o fator principal $n^2$. Escrevemos assim que a ordenação por inserção possui tempo de execução de pior caso <strong>$\\Theta(n^2)$</strong> ("teta de $n$ ao quadrado") e tempo de melhor caso <strong>$\\Theta(n)$</strong>.</li>
          </ol>
        `
      },

      /* ====================================================================
         UNIDADE 2.3 — CAPÍTULO 2, SEÇÃO 2.3.1
         ==================================================================== */
      {
        id: "u2-3",
        code: "UNIDADE 2.3 • CAP. 2 (SEÇÃO 2.3.1)",
        pages: "pp. 35–38",
        title: "Projeto por Divisão e Conquista: O Procedimento MERGE com Sentinelas e MERGE-SORT",
        content: `
          <h3>1. O Paradigma de Divisão e Conquista</h3>
          <p>Enquanto a ordenação por inserção adota uma abordagem <strong>incremental</strong> (inserindo um único elemento $A[j]$ por vez no subarranjo já ordenado $A[1 \\dots j-1]$), muitos dos algoritmos mais poderosos da computação têm estrutura <strong>recursiva</strong> e seguem o paradigma de <strong>Divisão e Conquista</strong>, composto por três passos em cada nível da recursão:</p>
          <ul>
            <li><strong>Divisão:</strong> Dividir o problema em um determinado número de subproblemas que são instâncias menores do mesmo problema original.</li>
            <li><strong>Conquista:</strong> Conquistar os subproblemas resolvendo-os recursivamente. Se os tamanhos dos subproblemas forem pequenos o bastante (caso base), resolvê-los diretamente.</li>
            <li><strong>Combinação:</strong> Combinar as soluções dos subproblemas para formar a solução do problema original.</li>
          </ul>
          <p>Aplicado à <strong>ordenação por intercalação (<code>MERGE-SORT</code>)</strong>, o paradigma opera assim:</p>
          <ol>
            <li><strong>Divisão:</strong> Divide a sequência de $n$ elementos em duas subsequências de $n/2$ elementos cada.</li>
            <li><strong>Conquista:</strong> Ordena as duas subsequências recursivamente utilizando a ordenação por intercalação (a recursão "extingue-se" quando a subsequência tem comprimento $1$, pois qualquer sequência de $1$ elemento já está ordenada!).</li>
            <li><strong>Combinação:</strong> Intercala (mescla) as duas subsequências ordenadas para produzir a sequência ordenada final.</li>
          </ol>

          <h3>2. O Procedimento Auxiliar <code>MERGE(A, p, q, r)</code> e o Truque das Cartas Sentinelas $\\infty$</h3>
          <p>O coração do algoritmo reside na etapa de combinação, realizada pelo procedimento <code>MERGE(A, p, q, r)</code>, onde $p \\le q < r$. Ele assume que os subarranjos $A[p \\dots q]$ (com $n_1 = q - p + 1$ elementos) e $A[q + 1 \\dots r]$ (com $n_2 = r - q$ elementos) já estão individualmente ordenados e os intercala em um único subarranjo ordenado $A[p \\dots r]$ de $n = r - p + 1 = n_1 + n_2$ elementos.</p>

          <div class="canonical-callout analogy">
            <span class="callout-tag">[ ANALOGIA DO LIVRO • DUAS PILHAS COM SENTINELAS ∞ (p. 36) ]</span>
            <p>Imagine duas pilhas de cartas na mesa, ambas <strong>viradas para cima</strong> e ordenadas com as menores cartas no topo. Queremos fundi-las em uma única pilha de saída ordenada. Em cada passo básico, olhamos apenas as duas cartas do topo das duas pilhas, escolhemos a menor delas e a colocamos na pilha de saída. Para evitar ter de testar em cada iteração se uma das duas pilhas já ficou vazia, colocamos no fundo de cada pilha uma <strong>carta sentinela</strong> com o valor especial $\\infty$ (infinito). Sempre que uma carta $\\infty$ é exposta no topo de uma pilha, ela jamais será menor que uma carta real da outra pilha! E como sabemos de antemão que exatamente $r - p + 1$ cartas reais precisam ir para a pilha de saída, basta executar um laço <code>for k = p to r</code> de exatamente $r - p + 1$ iterações: quando ambas as cartas $\\infty$ ficarem frente a frente, o laço já terá terminado!</p>
          </div>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">MERGE(A, p, q, r)</span>
              <span>[ CAPÍTULO 2.3.1 • INTERCALAÇÃO EM Θ(n) COM SENTINELAS ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">n₁ = q - p + 1</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">n₂ = r - q</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">sejam</span> L[1 .. n₁ + 1] <span class="kw">e</span> R[1 .. n₂ + 1] novos arranjos</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">for</span> i = 1 <span class="kw">to</span> n₁</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    L[i] = A[p + i - 1]</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">for</span> j = 1 <span class="kw">to</span> n₂</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    R[j] = A[q + j]</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">L[n₁ + 1] = ∞</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">R[n₂ + 1] = ∞</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">i = 1</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">j = 1</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content"><span class="kw">for</span> k = p <span class="kw">to</span> r</span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">    <span class="kw">if</span> L[i] ≤ R[j]</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">        A[k] = L[i]</span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content">        i = i + 1</span></div>
              <div class="code-line"><span class="line-num">16</span><span class="line-content">    <span class="kw">else</span> A[k] = R[j]</span></div>
              <div class="code-line"><span class="line-num">17</span><span class="line-content">        j = j + 1</span></div>
            </div>
          </div>

          <div class="canonical-callout invariant">
            <span class="callout-tag">[ INVARIANTE DE LAÇO • PROCEDIMENTO MERGE (pp. 37–38) ]</span>
            <p><strong>Enunciado do Invariante:</strong> <em>"No início de cada iteração do laço <code>for</code> das linhas 12 a 17, o subarranjo $A[p \\dots k - 1]$ contém os $k - p$ menores elementos de $L[1 \\dots n_1 + 1]$ e $R[1 \\dots n_2 + 1]$, em sequência ordenada. Além disso, $L[i]$ e $R[j]$ são os menores elementos de seus arranjos que não foram copiados de volta em $A$."</em></p>
            <div class="invariant-triad">
              <div class="triad-card">
                <div class="triad-card-title">1. Inicialização</div>
                <p>Antes da primeira iteração, $k = p$, logo $A[p \\dots k - 1]$ está vazio e contém os $k - p = 0$ menores elementos de $L$ e $R$. Como $i = j = 1$, tanto $L[1]$ quanto $R[1]$ são os menores elementos de seus respectivos arranjos ainda não copiados de volta em $A$.</p>
              </div>
              <div class="triad-card">
                <div class="triad-card-title">2. Manutenção</div>
                <p>Suponha primeiro que $L[i] \\le R[j]$. Então $L[i]$ é o menor elemento ainda não copiado para $A$. Como $A[p \\dots k - 1]$ já continha os $k - p$ menores elementos, após a linha 14 copiar $L[i]$ para $A[k]$, o subarranjo $A[p \\dots k]$ passa a conter os $k - p + 1$ menores elementos ordenados. Incrementar $k$ (no laço <code>for</code>) e $i$ (linha 15) restabelece o invariante. Se $L[i] > R[j]$, as linhas 16–17 fazem o mesmo simetricamente.</p>
              </div>
              <div class="triad-card">
                <div class="triad-card-title">3. Término</div>
                <p>No término, $k = r + 1$. Pelo invariante, $A[p \\dots k - 1] = A[p \\dots r]$ contém os $k - p = r - p + 1$ menores elementos de $L[1 \\dots n_1 + 1]$ e $R[1 \\dots n_2 + 1]$ em sequência ordenada. Juntos, $L$ e $R$ contêm $n_1 + n_2 + 2 = r - p + 3$ elementos; todos foram copiados em $A$, exceto os dois maiores, que são justamente as duas sentinelas $\\infty$!</p>
              </div>
            </div>
          </div>

          <p><strong>Tempo de execução de <code>MERGE</code>:</strong> As linhas 1–3 e 8–11 levam tempo constante $\\Theta(1)$; os dois laços de cópia nas linhas 4–7 levam tempo $\\Theta(n_1 + n_2) = \\Theta(n)$; e o laço principal das linhas 12–17 executa exatamente $n = r - p + 1$ iterações de custo constante cada. Logo, <code>MERGE</code> executa em tempo linear <strong>$\\Theta(n)$</strong> (e observe que ele <em>não</em> opera no lugar, pois aloca os arranjos auxiliares $L$ e $R$ de tamanho total $\\Theta(n)$).</p>

          <h3>3. O Procedimento Recursivo <code>MERGE-SORT(A, p, r)</code></h3>
          <p>Usando <code>MERGE</code> como sub-rotina, o procedimento <code>MERGE-SORT(A, p, r)</code> ordena o subarranjo $A[p \\dots r]$. Se $p \\ge r$, o subarranjo possui no máximo $1$ elemento e já está ordenado. Caso contrário ($p < r$), calculamos o índice médio $q = \\lfloor (p + r)/2 \\rfloor$, que particiona $A[p \\dots r]$ em $A[p \\dots q]$ (com $\\lceil n/2 \\rceil$ elementos) e $A[q + 1 \\dots r]$ (com $\\lfloor n/2 \\rfloor$ elementos):</p>

          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header">
              <span class="proc-name">MERGE-SORT(A, p, r)</span>
              <span>[ CAPÍTULO 2.3.1 • CHAMADA INICIAL: MERGE-SORT(A, 1, A.comprimento) ]</span>
            </div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> p &lt; r</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    q = ⌊(p + r) / 2⌋</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    MERGE-SORT(A, p, q)</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    MERGE-SORT(A, q + 1, r)</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    MERGE(A, p, q, r)</span></div>
            </div>
          </div>

          <div id="workbench-merge-mount"></div>
        `
      },

      /* ====================================================================
         UNIDADE 2.4 — CAPÍTULO 2, SEÇÃO 2.3.2 + PROBLEMAS DO CAPÍTULO 2
         ==================================================================== */
      {
        id: "u2-4",
        code: "UNIDADE 2.4 • CAP. 2 (SEÇÃO 2.3.2 & PROBLEMAS)",
        pages: "pp. 38–46",
        title: "Equações de Recorrência, Árvore de Recursão Θ(n lg n) e Problemas Clássicos do Cap. 2",
        content: `
          <h3>1. A Recorrência Geral dos Algoritmos de Divisão e Conquista</h3>
          <p>Quando um algoritmo contém chamadas recursivas a si mesmo, seu tempo de execução $T(n)$ é descrito naturalmente por uma <strong>equação de recorrência</strong> (ou simplesmente <strong>recorrência</strong>), que expressa o tempo total para um problema de tamanho $n$ em função do tempo para entradas menores.</p>
          <p>Suponha que um algoritmo de divisão e conquista divida o problema em <strong>$a$ subproblemas</strong>, cada um com tamanho igual a <strong>$1/b$</strong> do tamanho original (no <code>MERGE-SORT</code>, temos $a = 2$ e $b = 2$, mas em muitos algoritmos $a \\ne b$). Se o tamanho for pequeno o bastante ($n \\le c$ para uma constante $c$), a solução direta leva tempo constante $\\Theta(1)$. Caso contrário, sejam $D(n)$ o tempo para <strong>dividir</strong> o problema e $C(n)$ o tempo para <strong>combinar</strong> as soluções. Obtemos a recorrência geral:</p>
          $$T(n) = \\begin{cases} \\Theta(1) & \\text{se } n \\le c, \\\\ aT(n/b) + D(n) + C(n) & \\text{caso contrário.} \\end{cases}$$

          <h3>2. Análise da Ordenação por Intercalação e a Árvore de Recursão (Figura 2.5)</h3>
          <p>Para analisar o pior caso de <code>MERGE-SORT</code> sobre $n$ números (assumindo inicialmente que $n$ é uma potência exata de $2$), examinamos os três passos quando $n > 1$:</p>
          <ul>
            <li><strong>Divisão:</strong> Calcula apenas a média $q = \\lfloor (p + r)/2 \\rfloor$, o que leva tempo constante: $D(n) = \\Theta(1)$.</li>
            <li><strong>Conquista:</strong> Resolve recursivamente dois subproblemas de tamanho $n/2$, contribuindo com $2T(n/2)$.</li>
            <li><strong>Combinação:</strong> O procedimento <code>MERGE</code> sobre $n$ elementos leva tempo linear: $C(n) = \\Theta(n)$.</li>
          </ul>
          <p>Somando $D(n) + C(n) = \\Theta(1) + \\Theta(n) = \\Theta(n)$, obtemos a recorrência (2.1) do livro para o <code>MERGE-SORT</code>:</p>
          $$T(n) = \\begin{cases} \\Theta(1) & \\text{se } n = 1, \\\\ 2T(n/2) + \\Theta(n) & \\text{se } n > 1. \\end{cases}$$
          <p>Para demonstrar visual e algebricamente por que a solução dessa recorrência é $T(n) = \\Theta(n \\lg n)$ sem precisar ainda do Teorema Mestre (que será visto no Capítulo 4), reescrevemos a recorrência explícita (2.2) usando uma constante $c > 0$ que representa o tempo de resolver um problema de tamanho $1$ bem como o tempo por elemento nas fases de divisão e combinação:</p>
          $$T(n) = \\begin{cases} c & \\text{se } n = 1, \\\\ 2T(n/2) + cn & \\text{se } n > 1. \\end{cases}$$

          <div class="canonical-callout theorem">
            <span class="callout-tag">[ CONSTRUÇÃO E SOMA DA ÁRVORE DE RECURSÃO • FIGURA 2.5 (pp. 40–41) ]</span>
            <p>Expandimos $T(n)$ nível por nível em uma <strong>árvore de recursão</strong>:</p>
            <ul>
              <li><strong>Nível $0$ (Raiz):</strong> $1 = 2^0$ nó de tamanho $n$, com custo local $cn$. Suas duas subárvores são $T(n/2)$ e $T(n/2)$.</li>
              <li><strong>Nível $1$:</strong> $2 = 2^1$ nós, cada um de tamanho $n/2$ e custo $c(n/2)$. Soma do nível $1$: $c(n/2) + c(n/2) = cn$.</li>
              <li><strong>Nível $2$:</strong> $4 = 2^2$ nós, cada um de tamanho $n/4$ e custo $c(n/4)$. Soma do nível $2$: $4 \\cdot c(n/4) = cn$.</li>
              <li><strong>Nível geral $i$ abaixo do topo:</strong> Possui exatamente $2^i$ nós, cada um resolvendo um subproblema de tamanho $n/2^i$ e contribuindo com um custo $c(n/2^i)$. Logo, o custo total do nível $i$ é:
                $$2^i \\cdot c\\left(\\frac{n}{2^i}\\right) = cn$$
                Ou seja, <strong>todos os níveis da árvore têm exatamente o mesmo custo total $cn$!</strong></li>
              <li><strong>Nível inferior (Folhas):</strong> Ocorre quando o tamanho do subproblema chega a $n/2^i = 1 \\iff 2^i = n \\iff i = \\lg n$. Há $n$ folhas de tamanho $1$, cada uma custando $c$, somando $n \\cdot c = cn$.</li>
              <li><strong>Número total de níveis:</strong> Como $i$ vai de $0$ até $\\lg n$, a árvore possui exatamente <strong>$\\lg n + 1$ níveis</strong> (provado por indução sobre $n = 2^i$: para $n=1$, $\\lg 1 + 1 = 1$ nível; passando de $2^i$ para $2^{i+1}$ folhas, adiciona-se $1$ nível, resultando em $(i+1)+1 = \\lg 2^{i+1} + 1$).</li>
              <li><strong>Soma global de todos os níveis:</strong> Multiplicando o custo por nível ($cn$) pelo número de níveis ($\\lg n + 1$):
                $$T(n) = cn(\\lg n + 1) = cn \\lg n + cn = \\Theta(n \\lg n).$$</li>
            </ul>
          </div>

          <h3>3. Aprofundamento nos Problemas Canônicos do Final do Capítulo 2 (pp. 42–45)</h3>
          <p>O Capítulo 2 encerra com quatro problemas fundamentais que conectam a teoria que você acabou de estudar a técnicas avançadas de engenharia de algoritmos:</p>
          <ol>
            <li><strong>Problema 2-1 (Adensando as folhas da recursão — Híbrido <code>MERGE-SORT</code> + <code>INSERTION-SORT</code>):</strong> Como a ordenação por inserção possui fatores constantes menores que a ordenação por intercalação para entradas pequenas, implementações reais de alto desempenho (como o <em>Timsort</em> e bibliotecas padrão) param de dividir o <code>MERGE-SORT</code> quando os subarranjos atingem tamanho $k$, ordenam as $n/k$ sublistas de tamanho $k$ usando <code>INSERTION-SORT</code> em tempo $\\Theta\\left(\\frac{n}{k} \\cdot k^2\\right) = \\Theta(nk)$, e depois intercalam essas $n/k$ sublistas em $\\lg(n/k)$ níveis de fusão custando $\\Theta(n \\lg(n/k))$. O tempo total é $\\Theta(nk + n \\lg(n/k))$, que preserva a complexidade ótima $\\Theta(n \\lg n)$ desde que escolhamos $k = O(\\lg n)$!</li>
            <li><strong>Problema 2-2 (Corretude e Análise do <code>BUBBLESORT</code>):</strong> O algoritmo <code>BUBBLESORT</code> percorre o arranjo com um laço externo <code>for i = 1 to A.comprimento - 1</code> e um laço interno <code>for j = A.comprimento downto i + 1</code> trocando $A[j]$ com $A[j-1]$ se $A[j] < A[j-1]$. Seu invariante do laço interno garante que, ao fim da iteração $i$, o menor elemento de $A[i \\dots n]$ "flutuou" para a posição $A[i]$. Seu tempo de pior caso (e de melhor caso na versão sem flag) é $\\Theta(n^2)$, mas com constantes piores que o <code>INSERTION-SORT</code> porque realiza trocas completas (3 atribuições) em vez de deslocamentos simples.</li>
            <li><strong>Problema 2-3 (Regra de Horner para Avaliação Polinomial em $\\Theta(n)$):</strong> Para avaliar $P(x) = \\sum_{k=0}^{n} a_k x^k = a_0 + x(a_1 + x(a_2 + \\dots + x(a_{n-1} + x a_n)\\dots))$, o algoritmo ingênuo que calcula cada potência $x^k$ do zero gasta $\\Theta(n^2)$ multiplicações. A <strong>Regra de Horner</strong> (<code>y = 0; for i = n downto 0: y = a_i + x · y</code>) mantém o invariante $y = \\sum_{k=0}^{n-(i+1)} a_{k+i+1} x^k$ e avalia qualquer polinômio de grau $n$ em tempo linear ótimo <strong>$\\Theta(n)$</strong>!</li>
            <li><strong>Problema 2-4 (Inversões em um Arranjo):</strong> Dado um arranjo $A[1 \\dots n]$, um par de índices $(i, j)$ é chamado de uma <strong>inversão</strong> se $i < j$ e $A[i] > A[j]$ (isto é, dois elementos fora da ordem natural). Por exemplo, em $\\langle 2, 3, 8, 6, 1 \\rangle$, existem exatamente $5$ inversões: $(1,5), (2,5), (3,4), (3,5)$ e $(4,5)$ (correspondentes aos pares de valores $(2,1), (3,1), (8,6), (8,1)$ e $(6,1)$). Um arranjo em ordem decrescente $\\langle n, n-1, \\dots, 1 \\rangle$ possui o número máximo possível de inversões: $\\binom{n}{2} = \\frac{n(n-1)}{2}$. Mais ainda: cada deslocamento na linha 6 do <code>INSERTION-SORT</code> elimina exatamente uma inversão, de modo que o tempo de execução do <code>INSERTION-SORT</code> sobre uma entrada com $I$ inversões é exatamente $\\Theta(n + I)$! E modificando o passo <code>MERGE</code> do <code>MERGE-SORT</code> (somando $n_1 - i + 1$ ao contador de inversões toda vez que $R[j] < L[i]$), podemos contar todas as inversões de qualquer arranjo em tempo $\\Theta(n \\lg n)$!</li>
          </ol>
        `
      }
    ],

    /* ======================================================================
       QUIZZES COM GABARITO COMENTADO DIALÉTICO (12 QUESTÕES)
       ====================================================================== */
    quizzes: [
      {
        id: "q1",
        type: "Múltipla Escolha",
        reference: "Cap. 1, Seção 1.1 (pp. 17–18)",
        question:
          "Sobre a definição formal de algoritmos, instâncias e corretude apresentada na Seção 1.1 do livro, assinale a alternativa CORRETA:",
        options: [
          {
            letter: "A",
            text: "Uma instância de um problema computacional é o código-fonte do programa que implementa a relação entre entrada e saída.",
            isCorrect: false,
            explanation:
              "Incorreta. Uma instância de um problema consiste na entrada específica (por exemplo, a sequência ⟨31, 41, 59, 26, 41, 58⟩) que satisfaz as restrições do enunciado do problema e é necessária para calcular uma solução, não no código-fonte."
          },
          {
            letter: "B",
            text: "Um algoritmo que ocasionalmente produz uma resposta incorreta jamais tem utilidade prática em Ciência da Computação, pois viola a definição estrita de corretude.",
            isCorrect: false,
            explanation:
              "Incorreta. Como os autores destacam explicitamente na página 17, algoritmos incorretos podem ser extremamente úteis na prática se pudermos controlar sua taxa de erros — o exemplo canônico é o teste probabilístico de primalidade para achar grandes números primos (Capítulo 31)."
          },
          {
            letter: "C",
            text: "Diz-se que um algoritmo é correto se, para toda instância de entrada, ele parar com a saída correta; um algoritmo incorreto pode não parar em algumas instâncias ou parar com uma resposta incorreta.",
            isCorrect: true,
            explanation:
              "Correta! Esta é exatamente a definição formal de corretude dada na Seção 1.1 (p. 17): para toda instância de entrada válida, o algoritmo deve terminar (parar) e produzir a saída que satisfaz a especificação do problema."
          },
          {
            letter: "D",
            text: "O enunciado formal do problema de ordenação exige que a saída seja uma permutação estritamente crescente a'₁ < a'₂ < ... < a'ₙ, proibindo chaves repetidas.",
            isCorrect: false,
            explanation:
              "Incorreta. O problema de ordenação especifica ordem não decrescente (a'₁ ≤ a'₂ ≤ ... ≤ a'ₙ), permitindo chaves repetidas (como o número 41 na instância ⟨31, 41, 59, 26, 41, 58⟩)."
          }
        ]
      },
      {
        id: "q2",
        type: "Múltipla Escolha",
        reference: "Cap. 1, Seção 1.1 (pp. 19–21)",
        question:
          "Por que o conjunto dos problemas NP-completos (como o Problema do Caixeiro-Viajante) é tão importante e intrigante segundo Cormen, Leiserson, Rivest e Stein?",
        options: [
          {
            letter: "A",
            text: "Porque já foi demonstrado matematicamente que é impossível existir qualquer algoritmo de tempo polinomial para problemas NP-completos.",
            isCorrect: false,
            explanation:
              "Incorreta. Os autores enfatizam como primeira razão na página 20 que ninguém jamais provou que não é possível existir um algoritmo eficiente para problemas NP-completos (a questão P = NP segue em aberto)."
          },
          {
            letter: "B",
            text: "Porque se existir um algoritmo eficiente para qualquer problema NP-completo, então existirão algoritmos eficientes para todos os problemas NP-completos, além de muitos deles serem muito parecidos com problemas que possuem algoritmos eficientes conhecidos.",
            isCorrect: true,
            explanation:
              "Correta! Os autores listam exatamente essas três propriedades (p. 20): (1) não se sabe se existe algoritmo eficiente, (2) se houver solução eficiente para um, haverá para todos, e (3) pequenas mudanças no enunciado de um problema tratável (como caminho mínimo) produzem um problema NP-completo (como o caixeiro-viajante)."
          },
          {
            letter: "C",
            text: "Porque problemas NP-completos nunca surgem em aplicações industriais ou logísticas reais, sendo estudados apenas na matemática pura.",
            isCorrect: false,
            explanation:
              "Incorreta. O livro ressalta que problemas NP-completos surgem com frequência surpreendente em aplicações reais (como logística de entregas de caminhões) e reconhecê-los permite adotar algoritmos de aproximação."
          },
          {
            letter: "D",
            text: "Porque problemas NP-completos não admitem algoritmos de aproximação eficientes sob nenhuma premissa.",
            isCorrect: false,
            explanation:
              "Incorreta. Adotando premissas razoáveis, existem algoritmos de aproximação eficientes que entregam soluções boas (próximas da ótima), tema central do Capítulo 35."
          }
        ]
      },
      {
        id: "q3",
        type: "Múltipla Escolha",
        reference: "Cap. 1, Seção 1.2 (pp. 21–23)",
        question:
          "No experimento comparativo da Seção 1.2 para ordenar n = 10 milhões (10⁷) de números, o Computador A (10¹⁰ instruções/s) executa Ordenação por Inserção com 2n² instruções, enquanto o Computador B (10⁷ instruções/s, mil vezes mais lento) executa Ordenação por Intercalação com 50n lg n instruções. O que acontece e por quê?",
        options: [
          {
            letter: "A",
            text: "O Computador A vence com folga porque sua velocidade bruta de hardware é 1.000 vezes maior e a constante do código em linguagem de máquina (2) é 25 vezes menor que a do Computador B (50).",
            isCorrect: false,
            explanation:
              "Incorreta. Apesar de ser 1.000× mais rápido no hardware e ter constante 25× menor no código, o Computador A leva 20.000 segundos (> 5,5 horas) contra ~1.163 segundos (< 20 minutos) do Computador B."
          },
          {
            letter: "B",
            text: "O Computador B termina mais de 17 vezes mais rápido que o Computador A (cerca de 20 minutos contra 5,5 horas), porque o fator lg(10⁷) ≈ 23,25 cresce drasticamente mais devagar que o fator n = 10⁷, superando a desvantagem de hardware e compilador.",
            isCorrect: true,
            explanation:
              "Correta! Para n = 10⁷, 2·(10⁷)² / 10¹⁰ = 20.000 s, enquanto 50·10⁷·lg(10⁷) / 10⁷ ≈ 1.163 s. A ordem de crescimento n lg n vence n² por mais de 17 vezes em n = 10⁷ (e em n = 10⁸ vence por < 4 horas contra > 23 dias)."
          },
          {
            letter: "C",
            text: "Os dois computadores empatam em exatamente 1.000 segundos para n = 10⁷.",
            isCorrect: false,
            explanation:
              "Incorreta. O ponto de empate entre os dois computadores ocorre muito antes (quando 2n²/10¹⁰ ≈ 50n lg n / 10⁷, isto é, em torno de n ≈ 460.000); em n = 10⁷ o Computador B já é 17 vezes mais rápido."
          },
          {
            letter: "D",
            text: "A ordenação por intercalação é sempre mais rápida que a ordenação por inserção para qualquer valor inteiro positivo de n ≥ 2, independentemente das constantes c₁ e c₂.",
            isCorrect: false,
            explanation:
              "Incorreta. Para valores pequenos de n, como c₁ < c₂, a ordenação por inserção costuma ser mais rápida (por exemplo, no Exercício 1.2-2 com 8n² vs 64n lg n, a inserção vence para 2 ≤ n ≤ 43)."
          }
        ]
      },
      {
        id: "q4",
        type: "Verdadeiro ou Falso",
        reference: "Cap. 1, Seção 1.1 (p. 20) — Paralelismo",
        question:
          "[ VERDADEIRO OU FALSO ] A transição da indústria de processadores de um único núcleo com clock cada vez mais alto para arquiteturas com múltiplos núcleos (multicore) ocorreu porque a densidade de potência cresce superlinearmente com a velocidade de relógio, trazendo o risco físico de derretimento dos chips.",
        options: [
          {
            letter: "V",
            text: "Verdadeiro — Essa limitação física de dissipação térmica é exatamente a razão apontada pelos autores na Seção 1.1 para a adoção de chips multicore e algoritmos multithread.",
            isCorrect: true,
            explanation:
              "Correta! Na página 20 (seção 'Paralelismo'), Cormen et al. explicam que como a densidade de potência aumenta superlinearmente com a velocidade de relógio, existe o risco de derretimento dos chips acima de certo limite, motivando o projeto de chips com vários núcleos e algoritmos multithread (Cap. 27)."
          },
          {
            letter: "F",
            text: "Falso — A velocidade de relógio parou de crescer apenas por razões comerciais de marketing, sem qualquer barreira física ou térmica nos chips.",
            isCorrect: false,
            explanation:
              "Incorreta. A barreira foi estritamente física e termodinâmica (densidade de potência superlinear)."
          }
        ]
      },
      {
        id: "q5",
        type: "Múltipla Escolha",
        reference: "Cap. 2, Seção 2.1 (pp. 26–28)",
        question:
          "Na demonstração de corretude do algoritmo INSERTION-SORT(A) por meio de seu invariante de laço, como a propriedade de Término estabelece que o arranjo inteiro A[1 .. n] está ordenado ao final?",
        options: [
          {
            letter: "A",
            text: "Porque o laço for termina quando j = n, e substituindo j = n no invariante obtemos que A[1 .. n] está ordenado.",
            isCorrect: false,
            explanation:
              "Incorreta! Se substituíssemos j = n no invariante ('A[1 .. j - 1] está ordenado'), provaríamos apenas que A[1 .. n - 1] está ordenado, deixando A[n] de fora! O laço só termina quando j excede n, ou seja, quando j = n + 1."
          },
          {
            letter: "B",
            text: "Porque a condição que provoca o término do laço for é j > A.comprimento = n; logo, no término temos j = n + 1, e substituindo j = n + 1 no invariante para A[1 .. j - 1] concluímos que A[1 .. n] consiste nos elementos originais de A[1 .. n] em ordem.",
            isCorrect: true,
            explanation:
              "Correta! Pela convenção do pseudocódigo CLRS, o contador j retém o primeiro valor que violou o limite do laço for, que é j = n + 1. Substituindo j = n + 1 em A[1 .. j - 1], obtemos A[1 .. n] ordenado."
          },
          {
            letter: "C",
            text: "Porque o passo de Manutenção é aplicado infinitas vezes para todo n tendendo ao infinito, exatamente como na indução matemática clássica.",
            isCorrect: false,
            explanation:
              "Incorreta. Os autores destacam na página 27 que a diferença essencial entre invariantes de laço e indução matemática clássica é que no algoritmo paramos a indução finitamente quando o laço termina."
          },
          {
            letter: "D",
            text: "Porque o laço while interno sempre reduz i até 0 em todas as iterações, independentemente dos valores das chaves.",
            isCorrect: false,
            explanation:
              "Incorreta. O laço while para assim que encontra A[i] ≤ chave (no melhor caso, nem sequer entra no corpo do while e i permanece igual a j - 1)."
          }
        ]
      },
      {
        id: "q6",
        type: "Múltipla Escolha",
        reference: "Cap. 2, Seção 2.1 (pp. 28–29) — Convenções de Pseudocódigo",
        question:
          "De acordo com as convenções de pseudocódigo estabelecidas na Seção 2.1, o que ocorre quando executamos a linha 5 do INSERTION-SORT (`while i > 0 e A[i] > chave`) no instante em que a variável i atinge o valor 0?",
        options: [
          {
            letter: "A",
            text: "O algoritmo acessa a posição A[0] da memória, que contém uma sentinela automática igual a -∞.",
            isCorrect: false,
            explanation:
              "Incorreta. No INSERTION-SORT não há sentinela em A[0]; o arranjo é indexado de 1 até n."
          },
          {
            letter: "B",
            text: "Ocorre um erro de execução (error) por tentativa de indexação fora dos limites do arranjo A[1 .. n].",
            isCorrect: false,
            explanation:
              "Incorreta. Não ocorre erro justamente porque o operador booleano 'e' possui avaliação em curto-circuito."
          },
          {
            letter: "C",
            text: "Como o operador booleano 'e' possui avaliação em curto-circuito (short-circuit), ao avaliar i > 0 como FALSE quando i = 0, a segunda condição A[i] > chave sequer é avaliada, encerrando o laço while com segurança.",
            isCorrect: true,
            explanation:
              "Correta! Na página 29, os autores explicam que os operadores 'e' e 'ou' têm curto-circuito: se o primeiro operando de 'e' for FALSE, o segundo nunca é avaliado, protegendo contra acessos inválidos como A[0] ou x.f quando x = NIL."
          },
          {
            letter: "D",
            text: "Ambos os lados do operador 'e' são sempre avaliados simultaneamente, mas o modelo RAM ignora índices nulos.",
            isCorrect: false,
            explanation:
              "Incorreta. A avaliação é estritamente sequencial da esquerda para a direita com curto-circuito."
          }
        ]
      },
      {
        id: "q7",
        type: "Verdadeiro ou Falso",
        reference: "Cap. 2, Seção 2.1 (p. 29) — Objetos, Ponteiros e Parâmetros",
        question:
          "[ VERDADEIRO OU FALSO ] No pseudocódigo do livro, variáveis que representam objetos ou arranjos são tratadas como ponteiros: se fizermos `y = x` e depois `x.f = 3`, então `y.f` também passará a valer `3`. Além disso, ao passar um objeto `x` como parâmetro a um procedimento, atribuir `x = z` dentro do procedimento não afeta a variável do chamador, mas atribuir `x.f = 3` é visível para o chamador.",
        options: [
          {
            letter: "V",
            text: "Verdadeiro — O ponteiro para o objeto é copiado por valor na chamada, de modo que reatribuir o parâmetro local não afeta o chamador, mas mutar um atributo `x.f` altera o objeto compartilhado.",
            isCorrect: true,
            explanation:
              "Correta! Esta é a descrição exata da semântica de objetos, arranjos e passagem de parâmetros explicada nas páginas 28 e 29 do livro."
          },
          {
            letter: "F",
            text: "Falso — Objetos e arranjos inteiros são sempre copiados profundamente (deep copy) a cada atribuição `y = x` ou chamada de procedimento.",
            isCorrect: false,
            explanation:
              "Incorreta. Apenas o ponteiro é copiado, nunca o arranjo ou os atributos inteiros do objeto."
          }
        ]
      },
      {
        id: "q8",
        type: "Múltipla Escolha",
        reference: "Cap. 2, Seção 2.2 (pp. 30–31) — Modelo RAM",
        question:
          "Ao definir o modelo de computação RAM (Random-Access Machine) na Seção 2.2, os autores impõem que, para entradas de tamanho n, o tamanho de cada palavra de dados seja limitado a c lg n bits para uma constante c ≥ 1. Qual é a justificativa técnica para essas duas exigências (c ≥ 1 e c ser uma constante)?",
        options: [
          {
            letter: "A",
            text: "Exigimos c ≥ 1 para que uma única palavra possa conter o valor de n e indexar os n elementos da entrada; e exigimos que c seja constante para que o tamanho da palavra não cresça arbitrariamente (o que permitiria guardar uma quantidade imensa de dados em uma palavra e operá-la em tempo constante).",
            isCorrect: true,
            explanation:
              "Correta! Como explicado nas páginas 30–31, precisamos de pelo menos lg n bits (c ≥ 1) para endereçar os n elementos da entrada, e c deve ser constante para impedir o truque irrealista de empacotar toda a entrada numa única palavra de tamanho arbitrário."
          },
          {
            letter: "B",
            text: "Exigimos c ≥ 1 apenas para números em ponto flutuante, pois inteiros no modelo RAM têm precisão infinita sem limite de bits.",
            isCorrect: false,
            explanation:
              "Incorreta. O limite de tamanho da palavra aplica-se diretamente à representação de inteiros no modelo RAM."
          },
          {
            letter: "C",
            text: "Essa restrição existe para modelar com precisão os diferentes níveis de memória cache L1, L2 e memória virtual em disco.",
            isCorrect: false,
            explanation:
              "Incorreta. Na página 31, os autores afirmam explicitamente que o modelo RAM não modela caches nem memória virtual."
          },
          {
            letter: "D",
            text: "Porque no modelo RAM não existem instruções de deslocamento de bits (shift left) nem de divisão inteira.",
            isCorrect: false,
            explanation:
              "Incorreta. O modelo RAM inclui divisão, resto, piso, teto e admite deslocamento à esquerda (shift left) para calcular 2ᵏ em tempo constante quando k cabe em uma palavra."
          }
        ]
      },
      {
        id: "q9",
        type: "Múltipla Escolha",
        reference: "Cap. 2, Seção 2.2 (pp. 32–34) — Análise do INSERTION-SORT",
        question:
          "Na análise exata do INSERTION-SORT para um arranjo de n elementos, seja tⱼ o número de vezes que o teste do laço while na linha 5 é executado para um dado j ∈ {2, ..., n}. Quais são os valores de tⱼ e as ordens de crescimento resultantes para o MELHOR caso, o PIOR caso e o CASO MÉDIO (assumindo entrada aleatória), respectivamente?",
        options: [
          {
            letter: "A",
            text: "Melhor caso: tⱼ = 0 e Θ(1); Pior caso: tⱼ = j - 1 e Θ(n²); Caso médio: tⱼ = lg j e Θ(n lg n).",
            isCorrect: false,
            explanation:
              "Incorreta em todos os itens: no melhor caso o teste do while ainda é executado 1 vez por iteração (tⱼ = 1, levando a Θ(n)); no pior caso o teste executa j vezes (j - 1 sucessos + 1 falha quando i = 0); e no caso médio tⱼ ≈ j/2, que resulta em Θ(n²), não Θ(n lg n)."
          },
          {
            letter: "B",
            text: "Melhor caso: tⱼ = 1 e Θ(n); Pior caso: tⱼ = j e Θ(n²); Caso médio: tⱼ ≈ j/2 e Θ(n²).",
            isCorrect: true,
            explanation:
              "Correta! Quando o arranjo já está ordenado, o teste falha de imediato (tⱼ = 1) e T(n) = Θ(n). Quando está em ordem inversa, compara com todos os j - 1 elementos e falha em i = 0 (tⱼ = j), somando Θ(n²). No caso médio, percorre metade de A[1 .. j-1] (tⱼ ≈ j/2), que continua sendo uma função quadrática Θ(n²)."
          },
          {
            letter: "C",
            text: "Melhor caso: tⱼ = 1 e Θ(n lg n); Pior caso: tⱼ = n e Θ(n³); Caso médio: tⱼ = j/2 e Θ(n²).",
            isCorrect: false,
            explanation:
              "Incorreta. O melhor caso é linear Θ(n) e o pior caso é quadrático Θ(n²)."
          },
          {
            letter: "D",
            text: "Melhor caso: tⱼ = j e Θ(n²); Pior caso: tⱼ = j e Θ(n²); Caso médio: tⱼ = j e Θ(n²).",
            isCorrect: false,
            explanation:
              "Incorreta. Isso ocorre na Ordenação por Seleção (Exercício 2.2-2), mas na Ordenação por Inserção o laço while para antecipadamente quando A[i] ≤ chave, tornando o melhor caso Θ(n)."
          }
        ]
      },
      {
        id: "q10",
        type: "Múltipla Escolha",
        reference: "Cap. 2, Seção 2.3.1 (pp. 36–38) — Procedimento MERGE",
        question:
          "Qual é a finalidade exata das cartas sentinelas ∞ colocadas em L[n₁ + 1] e R[n₂ + 1] no procedimento MERGE(A, p, q, r), e o que resta em L e R quando o laço for k = p to r termina?",
        options: [
          {
            letter: "A",
            text: "As sentinelas permitem que o procedimento MERGE execute no lugar (in-place) sem alocar memória extra; no término, elas são copiadas para A[r] e A[r+1].",
            isCorrect: false,
            explanation:
              "Incorreta. O procedimento MERGE não funciona no lugar (aloca L e R de tamanhos n₁ + 1 e n₂ + 1), e as sentinelas jamais são copiadas para o arranjo A."
          },
          {
            letter: "B",
            text: "As sentinelas evitam ter de verificar em cada iteração se algum dos arranjos L ou R já se esgotou; como o laço executa exatamente r - p + 1 vezes, no término todos os r - p + 1 elementos reais foram copiados em ordem para A[p .. r], restando em L e R apenas os dois maiores elementos (as duas sentinelas ∞).",
            isCorrect: true,
            explanation:
              "Correta! Quando um arranjo (digamos L) esgota seus elementos reais, seu ponteiro i passa a apontar para L[n₁ + 1] = ∞, fazendo com que todos os elementos reais restantes de R sejam escolhidos naturalmente até que k alcance r."
          },
          {
            letter: "C",
            text: "As sentinelas reduzem a complexidade assintótica de MERGE de Θ(n²) para Θ(lg n).",
            isCorrect: false,
            explanation:
              "Incorreta. Tanto com sentinelas quanto sem sentinelas (Exercício 2.3-2), o procedimento MERGE executa em tempo linear Θ(n); as sentinelas apenas simplificam o código eliminando os testes de esvaziamento de pilha dentro do laço."
          },
          {
            letter: "D",
            text: "As sentinelas servem para interromper a recursão de MERGE-SORT quando p ≥ r.",
            isCorrect: false,
            explanation:
              "Incorreta. O teste de parada da recursão p < r está na linha 1 de MERGE-SORT(A, p, r), não nas sentinelas de MERGE."
          }
        ]
      },
      {
        id: "q11",
        type: "Múltipla Escolha",
        reference: "Cap. 2, Seção 2.3.2 (pp. 39–41) — Árvore de Recursão",
        question:
          "Na construção da árvore de recursão para resolver a recorrência T(n) = 2T(n/2) + cn da ordenação por intercalação (com n potência exata de 2), qual é o número de nós no nível i abaixo da raiz, o custo de cada nó nesse nível, a soma total do nível i e o número total de níveis da árvore?",
        options: [
          {
            letter: "A",
            text: "Nível i tem 2ⁱ nós, cada nó custa c(n/2ⁱ), a soma do nível i é cn, e a árvore possui lg n + 1 níveis, totalizando cn lg n + cn = Θ(n lg n).",
            isCorrect: true,
            explanation:
              "Correta! No nível i (para i = 0, 1, ..., lg n), há 2ⁱ subproblemas de tamanho n/2ⁱ. O custo de dividir e combinar cada um é c(n/2ⁱ), logo a soma do nível é 2ⁱ · c(n/2ⁱ) = cn. Multiplicando pelos lg n + 1 níveis, obtemos cn(lg n + 1) = Θ(n lg n)."
          },
          {
            letter: "B",
            text: "Nível i tem i nós, cada nó custa cn/i, a soma do nível i é cn, e a árvore possui n níveis, totalizando Θ(n²).",
            isCorrect: false,
            explanation:
              "Incorreta. A cada nível o número de subproblemas dobra (2ⁱ) e o tamanho cai pela metade (n/2ⁱ), atingindo tamanho 1 em lg n passos (lg n + 1 níveis)."
          },
          {
            letter: "C",
            text: "Nível i tem 2ⁱ nós, cada nó custa cn, a soma do nível i é 2ⁱ cn, e a árvore possui lg n níveis.",
            isCorrect: false,
            explanation:
              "Incorreta. Cada nó no nível i opera sobre um subarranjo de tamanho n/2ⁱ, portanto seu custo é c(n/2ⁱ), não cn."
          },
          {
            letter: "D",
            text: "Na ordenação por intercalação, a etapa de divisão D(n) custa Θ(n) e a etapa de combinação C(n) custa Θ(1).",
            isCorrect: false,
            explanation:
              "Incorreta! É exatamente o oposto: no MERGE-SORT, a divisão D(n) apenas calcula o ponto médio q em tempo Θ(1), enquanto a combinação C(n) executa MERGE em tempo Θ(n)."
          }
        ]
      },
      {
        id: "q12",
        type: "Múltipla Escolha",
        reference: "Cap. 2, Exercício 2.3-6 e Problema 2-4 (pp. 42–45)",
        question:
          "Considere duas questões fundamentais de projeto do Capítulo 2: (1) Se substituirmos a varredura linear reversa do laço while do INSERTION-SORT por uma Busca Binária para achar em Θ(lg j) a posição onde inserir A[j], qual passa a ser o tempo de pior caso do INSERTION-SORT? (2) Qual é a relação entre o tempo do INSERTION-SORT padrão e o número I de inversões do arranjo de entrada?",
        options: [
          {
            letter: "A",
            text: "(1) O pior caso cai para Θ(n lg n) porque achar a posição leva Θ(lg j); (2) O tempo não tem relação com o número de inversões.",
            isCorrect: false,
            explanation:
              "Incorreta! Embora a busca binária encontre a posição correta de inserção com apenas Θ(lg j) comparações, ainda precisamos deslocar os elementos maiores uma posição para a direita em um arranjo contíguo, o que continua exigindo Θ(j) movimentações no pior caso!"
          },
          {
            letter: "B",
            text: "(1) O pior caso continua sendo Θ(n²), pois embora o número de comparações caia para Θ(n lg n), o deslocamento dos elementos em A[1 .. j - 1] para abrir espaço para A[j] ainda exige Θ(j) cópias por iteração; (2) O tempo de execução do INSERTION-SORT padrão é Θ(n + I), pois cada iteração do while corrige exatamente uma inversão.",
            isCorrect: true,
            explanation:
              "Correta! No Exercício 2.3-6, a busca binária reduz apenas as comparações para Θ(n lg n), mas a linha 6 (`A[i + 1] = A[i]`) ainda precisa mover até j - 1 elementos no pior caso, mantendo o tempo total em Θ(n²). E no Problema 2-4(c), como cada troca/deslocamento no while envolve um par (i, j) com i < j e A[i] > chave = A[j], o número total de iterações do corpo do while é exatamente igual ao número I de inversões da entrada!"
          },
          {
            letter: "C",
            text: "(1) O pior caso sobe para Θ(n³); (2) O número máximo de inversões em um arranjo de n elementos é n.",
            isCorrect: false,
            explanation:
              "Incorreta. O número máximo de inversões ocorre no arranjo decrescente e vale n(n - 1)/2."
          },
          {
            letter: "D",
            text: "(1) O pior caso cai para Θ(n); (2) O número de inversões só pode ser contado em tempo Θ(n²).",
            isCorrect: false,
            explanation:
              "Incorreta. O número de inversões pode ser contado em tempo Θ(n lg n) modificando o MERGE-SORT (Problema 2-4d)."
          }
        ]
      }
    ],

    /* ======================================================================
       EXERCÍCIOS PRÁTICOS, REFLEXIVOS E DEMONSTRAÇÕES (8 ATIVIDADES)
       ====================================================================== */
    exercicios: [
      {
        id: "ex1",
        code: "EXERCÍCIO 01 • ESCALA E PONTO DE CORTE",
        reference: "Exercícios 1.2-2, 1.2-3 e Problema 1-1 (p. 23)",
        title: "Pontos de Corte Exatos entre Ordens de Crescimento",
        prompt: `
          <p>Resolva os dois problemas analíticos de ponto de corte propostos por Cormen et al. na Seção 1.2:</p>
          <ol>
            <li><strong>(Exercício 1.2-2)</strong> Suponha que estamos comparando implementações de ordenação por inserção e ordenação por intercalação na mesma máquina. Para entradas de tamanho $n$, a ordenação por inserção é executada em $8n^2$ passos, enquanto a ordenação por intercalação é executada em $64n \\lg n$ passos. <strong>Para quais valores inteiros de $n$ a ordenação por inserção supera (é estritamente mais rápida que) a ordenação por intercalação?</strong></li>
            <li><strong>(Exercício 1.2-3)</strong> Qual é o <strong>menor valor inteiro de $n$</strong> tal que um algoritmo cujo tempo de execução é $100n^2$ funciona mais rapidamente que um algoritmo cujo tempo de execução é $2^n$ na mesma máquina?</li>
          </ol>
        `,
        placeholder:
          "Escreva aqui sua resolução passo a passo: monte as inequações 8n² < 64n lg n e 100n² < 2ⁿ e teste os valores inteiros de fronteira...",
        solution: `
          <h4>1. Resolução do Exercício 1.2-2 ($8n^2 < 64n \\lg n$)</h4>
          <p>Queremos determinar para quais inteiros $n \\ge 2$ vale a desigualdade:</p>
          $$8n^2 < 64n \\lg n$$
          <p>Dividindo ambos os membros por $8n$ (já que $n > 0$):</p>
          $$n < 8 \\lg n \\iff \\frac{n}{\\lg n} < 8 \\iff n < 8 \\log_2 n$$
          <ul>
            <li>Para $n = 2$: $2 < 8 \\lg 2 = 8(1) = 8$ (Verdadeiro).</li>
            <li>Para $n = 32$: $32 < 8 \\lg 32 = 8(5) = 40$ (Verdadeiro).</li>
            <li>Para $n = 43$: $8 \\lg 43 \\approx 8 \\times 5,426 = 43,41 > 43$ (Verdadeiro: $8(43)^2 = 14.792$ passos vs. $64(43)\\lg 43 \\approx 14.933$ passos).</li>
            <li>Para $n = 44$: $8 \\lg 44 \\approx 8 \\times 5,459 = 43,67 < 44$ (Falso: $8(44)^2 = 15.488$ passos vs. $64(44)\\lg 44 \\approx 15.374$ passos).</li>
          </ul>
          <p><strong>Conclusão:</strong> A ordenação por inserção supera a ordenação por intercalação para <strong>$2 \\le n \\le 43$</strong>. A partir de $n = 44$, a ordenação por intercalação passa a vencer definitivamente.</p>

          <h4>2. Resolução do Exercício 1.2-3 ($100n^2 < 2^n$)</h4>
          <p>Buscamos o menor inteiro positivo $n$ tal que $100n^2 < 2^n$:</p>
          <ul>
            <li>Para $n = 1$: $100(1)^2 = 100 > 2^1 = 2$.</li>
            <li>Para $n = 10$: $100(10)^2 = 10.000 > 2^{10} = 1.024$.</li>
            <li>Para $n = 14$: $100(14)^2 = 19.600 > 2^{14} = 16.384$.</li>
            <li>Para $n = 15$: $100(15)^2 = 22.500 < 2^{15} = 32.768$.</li>
          </ul>
          <p><strong>Conclusão:</strong> O menor valor inteiro é <strong>$n = 15$</strong>.</p>
        `
      },
      {
        id: "ex2",
        code: "EXERCÍCIO 02 • RASTREAMENTO E VARIAÇÃO DE INSERTION-SORT",
        reference: "Exercícios 2.1-1 e 2.1-2 (p. 29)",
        title: "Rastreamento em ⟨31, 41, 59, 26, 41, 58⟩ e Ordenação Não Crescente",
        prompt: `
          <p>Realize as duas tarefas práticas sobre o procedimento <code>INSERTION-SORT(A)</code>:</p>
          <ol>
            <li><strong>(Exercício 2.1-1)</strong> Usando a Figura 2.2 como modelo, mostre o estado do arranjo $A = \\langle 31, 41, 59, 26, 41, 58 \\rangle$ ao final de cada iteração do laço <code>for</code> externo ($j = 2, 3, 4, 5, 6$), indicando o valor de <code>chave</code> e quantas vezes o corpo do <code>while</code> deslocou elementos.</li>
            <li><strong>(Exercício 2.1-2)</strong> Reescreva o procedimento <code>INSERTION-SORT(A)</code> para ordenar o arranjo em <strong>ordem não crescente</strong> ($a'_1 \\ge a'_2 \\ge \\dots \\ge a'_n$) em vez de ordem não decrescente. Qual é a única comparação que muda no código?</li>
          </ol>
        `,
        placeholder:
          "Liste o estado de A após j = 2, 3, 4, 5, 6 e escreva o pseudocódigo modificado para ordem não crescente...",
        solution: `
          <h4>1. Rastreamento de <code>INSERTION-SORT</code> para $A = \\langle 31, 41, 59, 26, 41, 58 \\rangle$</h4>
          <ul>
            <li><strong>Entrada inicial:</strong> $\\langle 31, 41, 59, 26, 41, 58 \\rangle$</li>
            <li><strong>Iteração $j = 2$ (<code>chave = 41</code>):</strong> Compara $A[1]=31 > 41$ (Falso; $0$ deslocamentos, $t_2 = 1$). Estado após inserir: $\\langle 31, 41, 59, 26, 41, 58 \\rangle$.</li>
            <li><strong>Iteração $j = 3$ (<code>chave = 59</code>):</strong> Compara $A[2]=41 > 59$ (Falso; $0$ deslocamentos, $t_3 = 1$). Estado após inserir: $\\langle 31, 41, 59, 26, 41, 58 \\rangle$.</li>
            <li><strong>Iteração $j = 4$ (<code>chave = 26</code>):</strong> Compara e desloca $59$, $41$ e $31$ uma posição para a direita ($3$ deslocamentos, $t_4 = 4$, parando quando $i=0$). Insere $26$ em $A[1]$. Estado: $\\langle 26, 31, 41, 59, 41, 58 \\rangle$.</li>
            <li><strong>Iteração $j = 5$ (<code>chave = 41</code>):</strong> Compara $A[4]=59 > 41$ (desloca $59$ para $A[5]$) e em seguida testa $A[3]=41 > 41$ (Falso! Note como o sinal estrito <code>&gt;</code> preserva a <strong>estabilidade</strong> dos dois $41$; $1$ deslocamento, $t_5 = 2$). Estado: $\\langle 26, 31, 41, 41, 59, 58 \\rangle$.</li>
            <li><strong>Iteração $j = 6$ (<code>chave = 58</code>):</strong> Compara $A[5]=59 > 58$ (desloca $59$ para $A[6]$) e testa $A[4]=41 > 58$ (Falso; $1$ deslocamento, $t_6 = 2$). Estado final ordenado: <strong>$\\langle 26, 31, 41, 41, 58, 59 \\rangle$</strong>.</li>
          </ul>

          <h4>2. Pseudocódigo para Ordem Não Crescente (Exercício 2.1-2)</h4>
          <p>Basta inverter a comparação na segunda cláusula da linha 5 de <code>A[i] &gt; chave</code> para <strong><code>A[i] &lt; chave</code></strong> (deslocando para a direita os elementos que são <em>menores</em> que a <code>chave</code>):</p>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">INSERTION-SORT-DECREASING(A)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">for</span> j = 2 <span class="kw">to</span> A.comprimento</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    chave = A[j]</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    <span class="cmt">// Inserir A[j] na sequência não crescente A[1 .. j - 1].</span></span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    i = j - 1</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">while</span> i &gt; 0 <span class="kw">e</span> A[i] &lt; chave</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">        A[i + 1] = A[i]</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">        i = i - 1</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">    A[i + 1] = chave</span></div>
            </div>
          </div>
        `
      },
      {
        id: "ex3",
        code: "EXERCÍCIO 03 • PROVA POR INVARIANTE DE LAÇO E ANÁLISE DA BUSCA LINEAR",
        reference: "Exercícios 2.1-3 e 2.2-3 (pp. 29 e 34)",
        title: "Especificação, Corretude por Invariante e Caso Médio da Busca Linear",
        prompt: `
          <p>Considere o <strong>problema de busca</strong> definido na Seção 2.1:</p>
          <ul>
            <li><strong>Entrada:</strong> Uma sequência de $n$ números $A = \\langle a_1, a_2, \\dots, a_n \\rangle$ e um valor $v$.</li>
            <li><strong>Saída:</strong> Um índice $i$ tal que $v = A[i]$ ou o valor especial <code>NIL</code>, se $v$ não aparecer em $A$.</li>
          </ul>
          <ol>
            <li><strong>(Exercício 2.1-3)</strong> Escreva o pseudocódigo para a <strong>busca linear</strong> (<code>LINEAR-SEARCH(A, v)</code>). Enuncie um <strong>invariante de laço</strong> preciso e prove que seu algoritmo é correto demonstrando as três propriedades obrigatórias (<strong>Inicialização</strong>, <strong>Manutenção</strong> e <strong>Término</strong>).</li>
            <li><strong>(Exercício 2.2-3)</strong> Quantos elementos da sequência de entrada precisam ser verificados <strong>em média</strong> (assumindo que $v$ pertença ao arranjo e tenha igual probabilidade $1/n$ de estar em qualquer posição) e <strong>no pior caso</strong>? Expresse os tempos de caso médio e de pior caso em notação $\\Theta$.</li>
          </ol>
        `,
        placeholder:
          "Escreva o pseudocódigo LINEAR-SEARCH(A, v), enuncie o invariante para o subarranjo A[1 .. i - 1], prove Inicialização, Manutenção e Término, e calcule o caso médio...",
        solution: `
          <h4>1. Pseudocódigo de <code>LINEAR-SEARCH(A, v)</code></h4>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">LINEAR-SEARCH(A, v)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">for</span> i = 1 <span class="kw">to</span> A.comprimento</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">if</span> A[i] == v</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">        <span class="kw">return</span> i</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">return</span> NIL</span></div>
            </div>
          </div>

          <h4>2. Prova de Corretude por Invariante de Laço</h4>
          <p><strong>Invariante de Laço:</strong> <em>"No início de cada iteração do laço <code>for</code> das linhas 1–3, o subarranjo $A[1 \\dots i - 1]$ não contém o valor $v$ (isto é, para todo $k \\in \\{1, \\dots, i - 1\\}$, temos $A[k] \\ne v$)."</em></p>
          <ul>
            <li><strong>Inicialização:</strong> Antes da primeira iteração ($i = 1$), o subarranjo $A[1 \\dots i - 1]$ é o subarranjo vazio $A[1 \\dots 0]$. Um subarranjo vazio não contém nenhum elemento e, portanto, trivialmente não contém $v$. O invariante é verdadeiro.</li>
            <li><strong>Manutenção:</strong> Suponha que o invariante vale no início da iteração $i$ (logo $v \\notin A[1 \\dots i - 1]$). Na linha 2, testamos se $A[i] == v$. Se for igual, o procedimento termina imediatamente na linha 3 devolvendo o índice correto $i$. Se $A[i] \\ne v$, então $v$ também não está em $A[1 \\dots i]$, e o incremento de $i$ para $i + 1$ na próxima iteração preserva o invariante de laço.</li>
            <li><strong>Término:</strong> O laço pode terminar de duas maneiras:
              <ol>
                <li><strong>Saída antecipada na linha 3:</strong> Ocorre quando $A[i] == v$, devolvendo imediatamente um índice $i$ válido tal que $A[i] = v$.</li>
                <li><strong>Esgotamento do laço <code>for</code>:</strong> Ocorre quando $i > A.\\text{comprimento} = n$, ou seja, quando $i = n + 1$. Substituindo $i = n + 1$ no invariante de laço, concluímos que o subarranjo $A[1 \\dots n]$ (o arranjo inteiro!) não contém o valor $v$. Nesse instante, a linha 4 devolve <code>NIL</code> corretamente!</li>
              </ol>
            </li>
          </ul>

          <h4>3. Análise do Caso Médio e do Pior Caso (Exercício 2.2-3)</h4>
          <ul>
            <li><strong>Caso Médio:</strong> Se $v$ tem probabilidade uniforme $1/n$ de estar em cada posição $k \\in \\{1, 2, \\dots, n\\}$, o número esperado de elementos verificados é:
              $$E[\\text{comparações}] = \\sum_{k=1}^{n} k \\cdot \\frac{1}{n} = \\frac{1}{n} \\sum_{k=1}^{n} k = \\frac{1}{n} \\cdot \\frac{n(n+1)}{2} = \\frac{n + 1}{2}$$
              Portanto, em média verificamos metade dos elementos, e o tempo de execução no caso médio é linear: <strong>$\\Theta(n)$</strong>.</li>
            <li><strong>Pior Caso:</strong> Ocorre quando $v$ está na última posição $A[n]$ ou quando $v$ não aparece em $A$. Nesse caso, todos os $n$ elementos são verificados, resultando também em tempo <strong>$\\Theta(n)$</strong>.</li>
          </ul>
        `
      },
      {
        id: "ex4",
        code: "EXERCÍCIO 04 • SOMA DE INTEIROS BINÁRIOS DE n BITS",
        reference: "Exercício 2.1-4 (p. 29)",
        title: "Enunciado Formal, Pseudocódigo e Invariante para Soma Binária",
        prompt: `
          <p><strong>(Exercício 2.1-4)</strong> Considere o problema de somar dois inteiros binários de $n$ bits, armazenados em dois arranjos de $n$ elementos $A[1 \\dots n]$ e $B[1 \\dots n]$ (assumindo que o bit menos significativo está na posição $1$, isto é, $x = \\sum_{i=1}^{n} A[i] \\cdot 2^{i-1}$, ou na posição $n$, indicando claramente sua convenção). A soma dos dois inteiros deve ser armazenada em forma binária em um arranjo $C[1 \\dots n + 1]$ de $n + 1$ elementos.</p>
          <p><strong>Enuncie o problema formalmente, escreva o pseudocódigo do procedimento <code>ADD-BINARY(A, B)</code> e indique seu invariante de laço.</strong></p>
        `,
        placeholder:
          "Enuncie Entrada e Saída formalmente e escreva o pseudocódigo usando uma variável de vai-um (transporte / carry)...",
        solution: `
          <h4>1. Enunciado Formal do Problema</h4>
          <p>Adotando a convenção em que o índice $1$ armazena o bit menos significativo ($2^0$) e o índice $n$ armazena o bit mais significativo ($2^{n-1}$):</p>
          <ul>
            <li><strong>Entrada:</strong> Dois arranjos de $n$ bits $A = \\langle a_1, a_2, \\dots, a_n \\rangle$ e $B = \\langle b_1, b_2, \\dots, b_n \\rangle$, com $a_i, b_i \\in \\{0, 1\\}$, representando os inteiros $a = \\sum_{i=1}^{n} a_i 2^{i-1}$ e $b = \\sum_{i=1}^{n} b_i 2^{i-1}$.</li>
            <li><strong>Saída:</strong> Um arranjo de $n + 1$ bits $C = \\langle c_1, c_2, \\dots, c_{n+1} \\rangle$, com $c_i \\in \\{0, 1\\}$, representando o inteiro $c = \\sum_{i=1}^{n+1} c_i 2^{i-1}$ tal que $c = a + b$.</li>
          </ul>

          <h4>2. Pseudocódigo de <code>ADD-BINARY(A, B)</code></h4>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">ADD-BINARY(A, B)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">n = A.comprimento</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">seja</span> C[1 .. n + 1] um novo arranjo</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">transporte = 0</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">for</span> i = 1 <span class="kw">to</span> n</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    soma = A[i] + B[i] + transporte</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">    C[i] = soma <span class="kw">mod</span> 2</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    transporte = ⌊soma / 2⌋</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">C[n + 1] = transporte</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content"><span class="kw">return</span> C</span></div>
            </div>
          </div>

          <h4>3. Invariante de Laço</h4>
          <p>No início de cada iteração do laço <code>for</code> da linha 4, o subarranjo $C[1 \\dots i - 1]$ e o bit <code>transporte</code> satisfazem a identidade exata de valor posicional:</p>
          $$\\left(\\sum_{k=1}^{i-1} C[k] \\cdot 2^{k-1}\\right) + \\text{transporte} \\cdot 2^{i-1} = \\sum_{k=1}^{i-1} (A[k] + B[k]) \\cdot 2^{k-1}.$$
          <p>No término ($i = n + 1$), após atribuir $C[n + 1] = \\text{transporte}$ na linha 8, temos $\\sum_{k=1}^{n+1} C[k] 2^{k-1} = \\sum_{k=1}^{n} A[k] 2^{k-1} + \\sum_{k=1}^{n} B[k] 2^{k-1} = a + b$.</p>
        `
      },
      {
        id: "ex5",
        code: "EXERCÍCIO 05 • ORDENAÇÃO POR SELEÇÃO (SELECTION-SORT)",
        reference: "Exercício 2.2-2 (p. 34)",
        title: "Projeto, Invariante e Análise de Melhor e Pior Caso de SELECTION-SORT",
        prompt: `
          <p><strong>(Exercício 2.2-2)</strong> Considere a ordenação de $n$ números armazenados no arranjo $A$, localizando primeiro o menor elemento de $A$ e permutando esse elemento com o elemento contido em $A[1]$. Em seguida, determine o segundo menor elemento de $A$ (varrendo $A[2 \\dots n]$) e permute-o com $A[2]$. Continue dessa maneira para os primeiros $n - 1$ elementos de $A$.</p>
          <ol>
            <li>Escreva o pseudocódigo para esse algoritmo, conhecido como <strong>ordenação por seleção (<code>SELECTION-SORT</code>)</strong>.</li>
            <li>Qual <strong>invariante de laço</strong> o laço externo desse algoritmo mantém?</li>
            <li>Por que ele só precisa ser executado para os primeiros $n - 1$ elementos, e não para todos os $n$ elementos?</li>
            <li>Forneça os tempos de execução do <strong>melhor caso</strong> e do <strong>pior caso</strong> da ordenação por seleção em notação $\\Theta$.</li>
          </ol>
        `,
        placeholder:
          "Escreva o pseudocódigo de SELECTION-SORT(A) e responda aos itens 2, 3 e 4...",
        solution: `
          <h4>1. Pseudocódigo de <code>SELECTION-SORT(A)</code></h4>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">SELECTION-SORT(A)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">n = A.comprimento</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content"><span class="kw">for</span> i = 1 <span class="kw">to</span> n - 1</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">    min = i</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    <span class="kw">for</span> j = i + 1 <span class="kw">to</span> n</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">        <span class="kw">if</span> A[j] &lt; A[min]</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">            min = j</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    trocar A[i] com A[min]</span></div>
            </div>
          </div>

          <h4>2. Invariante de Laço</h4>
          <p><strong>Invariante do laço externo (linha 2):</strong> <em>"No início de cada iteração do laço <code>for</code> da linha 2 (indexado por $i$), o subarranjo $A[1 \\dots i - 1]$ contém os $i - 1$ menores elementos de todo o arranjo original $A[1 \\dots n]$, já dispostos em sequência ordenada (e todo elemento em $A[i \\dots n]$ é maior ou igual a qualquer elemento de $A[1 \\dots i - 1]$)."</em></p>

          <h4>3. Por que executar apenas até $n - 1$?</h4>
          <p>Quando o laço <code>for</code> externo termina após a iteração $i = n - 1$, temos $i = n$ no término. Pelo invariante de laço, o subarranjo $A[1 \\dots n - 1]$ já contém os $n - 1$ menores elementos de $A$ em ordem não decrescente, e o único elemento restante em $A[n]$ é necessariamente o maior elemento do arranjo! Portanto, $A[n]$ já está em sua posição correta final sem precisar de uma $n$-ésima iteração.</p>

          <h4>4. Tempos de Execução no Melhor Caso e no Pior Caso</h4>
          <p>Diferentemente da ordenação por inserção, o laço interno (linhas 4–6) da ordenação por seleção <strong>sempre varre todos os $n - i$ elementos restantes</strong> de $A[i + 1 \\dots n]$ para ter certeza de que encontrou o mínimo, independentemente de o arranjo já estar ordenado ou não! O número de comparações na linha 5 é sempre:</p>
          $$\\sum_{i=1}^{n-1} (n - i) = \\frac{n(n - 1)}{2} = \\Theta(n^2).$$
          <p>Portanto, <strong>tanto o melhor caso quanto o pior caso de <code>SELECTION-SORT</code> são $\\Theta(n^2)$</strong>.</p>
        `
      },
      {
        id: "ex6",
        code: "EXERCÍCIO 06 • MERGE SEM SENTINELAS E BUSCA BINÁRIA",
        reference: "Exercícios 2.3-2 e 2.3-5 (pp. 41–42)",
        title: "Reescrita de MERGE sem Sentinelas e Busca Binária em Θ(lg n)",
        prompt: `
          <p>Desenvolva o pseudocódigo para dois procedimentos fundamentais da Seção 2.3:</p>
          <ol>
            <li><strong>(Exercício 2.3-2)</strong> Reescreva o procedimento <code>MERGE(A, p, q, r)</code> de modo que ele <strong>não utilize sentinelas $\\infty$</strong> e, em vez disso, pare seu laço principal tão logo todos os elementos do arranjo $L$ ou do arranjo $R$ tenham sido copiados de volta em $A$, copiando então o restante do outro arranjo de volta em $A$.</li>
            <li><strong>(Exercício 2.3-5)</strong> Escreva o pseudocódigo (iterativo ou recursivo) para a <strong>Busca Binária</strong> (<code>BINARY-SEARCH(A, p, r, v)</code>) sobre um arranjo ordenado $A[1 \\dots n]$ e demonstre por meio de sua recorrência que o tempo de execução no pior caso é <strong>$\\Theta(\\lg n)$</strong>.</li>
          </ol>
        `,
        placeholder:
          "Escreva o pseudocódigo de MERGE-NO-SENTINELS(A, p, q, r) e de BINARY-SEARCH(A, p, r, v)...",
        solution: `
          <h4>1. Procedimento <code>MERGE</code> sem Sentinelas (Exercício 2.3-2)</h4>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">MERGE-NO-SENTINELS(A, p, q, r)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">n₁ = q - p + 1</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">n₂ = r - q</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">sejam</span> L[1 .. n₁] <span class="kw">e</span> R[1 .. n₂] novos arranjos</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">for</span> i = 1 <span class="kw">to</span> n₁</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    L[i] = A[p + i - 1]</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">for</span> j = 1 <span class="kw">to</span> n₂</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    R[j] = A[q + j]</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content">i = 1; j = 1; k = p</span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content"><span class="kw">while</span> i ≤ n₁ <span class="kw">e</span> j ≤ n₂</span></div>
              <div class="code-line"><span class="line-num">10</span><span class="line-content">    <span class="kw">if</span> L[i] ≤ R[j]</span></div>
              <div class="code-line"><span class="line-num">11</span><span class="line-content">        A[k] = L[i]; i = i + 1</span></div>
              <div class="code-line"><span class="line-num">12</span><span class="line-content">    <span class="kw">else</span></span></div>
              <div class="code-line"><span class="line-num">13</span><span class="line-content">        A[k] = R[j]; j = j + 1</span></div>
              <div class="code-line"><span class="line-num">14</span><span class="line-content">    k = k + 1</span></div>
              <div class="code-line"><span class="line-num">15</span><span class="line-content"><span class="kw">while</span> i ≤ n₁</span></div>
              <div class="code-line"><span class="line-num">16</span><span class="line-content">    A[k] = L[i]; i = i + 1; k = k + 1</span></div>
              <div class="code-line"><span class="line-num">17</span><span class="line-content"><span class="kw">while</span> j ≤ n₂</span></div>
              <div class="code-line"><span class="line-num">18</span><span class="line-content">    A[k] = R[j]; j = j + 1; k = k + 1</span></div>
            </div>
          </div>

          <h4>2. Busca Binária e Prova de $\\Theta(\\lg n)$ (Exercício 2.3-5)</h4>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">BINARY-SEARCH(A, p, r, v)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content"><span class="kw">if</span> p &gt; r</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">    <span class="kw">return</span> NIL</span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content">q = ⌊(p + r) / 2⌋</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content"><span class="kw">if</span> A[q] == v</span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">return</span> q</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content"><span class="kw">elseif</span> v &lt; A[q]</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content">    <span class="kw">return</span> BINARY-SEARCH(A, p, q - 1, v)</span></div>
              <div class="code-line"><span class="line-num">8</span><span class="line-content"><span class="kw">else</span></span></div>
              <div class="code-line"><span class="line-num">9</span><span class="line-content">    <span class="kw">return</span> BINARY-SEARCH(A, q + 1, r, v)</span></div>
            </div>
          </div>
          <p><strong>Análise da Recorrência:</strong> Em cada nível, dividimos o intervalo ao meio em tempo $D(n) = \\Theta(1)$, fazemos <strong>apenas $a = 1$ chamada recursiva</strong> de tamanho $n/2$ ($b = 2$), e não há etapa de combinação ($C(n) = 0$). Logo:</p>
          $$T(n) = T(n/2) + c$$
          <p>A árvore de recursão é uma cadeia simples com $1$ nó por nível, custo $c$ em cada nível e $\\lg n + 1$ níveis. Portanto, $T(n) = c(\\lg n + 1) = \\Theta(\\lg n)$.</p>
        `
      },
      {
        id: "ex7",
        code: "EXERCÍCIO 07 • PROJETO DE ALGORITMO EM Θ(n lg n) (2-SUM)",
        reference: "Exercício 2.3-7* (p. 42)",
        title: "Determinar se Existem Dois Elementos em S Cuja Soma Seja Exatamente x",
        prompt: `
          <p><strong>(Exercício 2.3-7*)</strong> Descreva um algoritmo de tempo <strong>$\\Theta(n \\lg n)$</strong> no pior caso que, dado um conjunto $S$ de $n$ inteiros e um outro inteiro $x$, determine se existem ou não dois elementos em $S$ cuja soma seja exatamente $x$.</p>
          <p><em>Dica metodológica:</em> Uma solução ingênua que testa todos os pares possíveis gasta $\\Theta(n^2)$. Como usar os algoritmos de $\\Theta(n \\lg n)$ e $\\Theta(\\lg n)$ estudados no Capítulo 2 para resolver o problema em $\\Theta(n \\lg n)$?</p>
        `,
        placeholder:
          "Descreva as etapas do seu algoritmo, escreva o pseudocódigo e some os tempos de execução de cada fase para provar Θ(n lg n)...",
        solution: `
          <h4>1. Estratégia de Projeto em $\\Theta(n \\lg n)$</h4>
          <p>Podemos resolver o problema combinando <code>MERGE-SORT</code> com <code>BINARY-SEARCH</code> (ou com varredura de dois ponteiros):</p>
          <ol>
            <li><strong>Etapa 1 — Ordenação:</strong> Ordenamos o arranjo $S[1 \\dots n]$ em ordem não decrescente chamando <code>MERGE-SORT(S, 1, n)</code>. Custo no pior caso: <strong>$\\Theta(n \\lg n)$</strong>.</li>
            <li><strong>Etapa 2 — Busca do complemento $y = x - S[i]$:</strong> Para cada índice $i = 1, 2, \\dots, n$, procuramos o complemento $y = x - S[i]$ no subarranjo restante $S[i + 1 \\dots n]$ usando <code>BINARY-SEARCH(S, i + 1, n, x - S[i])</code>. Se a busca binária devolver um índice diferente de <code>NIL</code>, retornamos <code>TRUE</code>. Se o laço terminar sem achar nenhum par, retornamos <code>FALSE</code>. Como fazemos no máximo $n$ buscas binárias de custo $O(\\lg n)$ cada, a Etapa 2 custa <strong>$O(n \\lg n)$</strong> (ou, usando dois ponteiros $i=1$ e $j=n$ que convergem, custa apenas $\\Theta(n)$!).</li>
          </ol>

          <h4>2. Pseudocódigo Completo</h4>
          <div class="clrs-pseudocode-box">
            <div class="pseudocode-header"><span class="proc-name">TWO-SUM(S, x)</span></div>
            <div class="pseudocode-lines">
              <div class="code-line"><span class="line-num">1</span><span class="line-content">n = S.comprimento</span></div>
              <div class="code-line"><span class="line-num">2</span><span class="line-content">MERGE-SORT(S, 1, n) <span class="cmt">// Custo Θ(n lg n)</span></span></div>
              <div class="code-line"><span class="line-num">3</span><span class="line-content"><span class="kw">for</span> i = 1 <span class="kw">to</span> n - 1</span></div>
              <div class="code-line"><span class="line-num">4</span><span class="line-content">    j = BINARY-SEARCH(S, i + 1, n, x - S[i]) <span class="cmt">// Custo O(lg n)</span></span></div>
              <div class="code-line"><span class="line-num">5</span><span class="line-content">    <span class="kw">if</span> j ≠ NIL</span></div>
              <div class="code-line"><span class="line-num">6</span><span class="line-content">        <span class="kw">return</span> TRUE</span></div>
              <div class="code-line"><span class="line-num">7</span><span class="line-content"><span class="kw">return</span> FALSE</span></div>
            </div>
          </div>

          <p><strong>Complexidade Total:</strong> $T(n) = \\Theta(n \\lg n) + \\sum_{i=1}^{n-1} O(\\lg n) = \\Theta(n \\lg n) + O(n \\lg n) = \\mathbf{\\Theta(n \\lg n)}$.</p>
        `
      },
      {
        id: "ex8",
        code: "EXERCÍCIO 08 • PROBLEMA 2-4: CONTAGEM DE INVERSÕES EM Θ(n lg n)",
        reference: "Problema 2-4 (pp. 44–45)",
        title: "Análise de Inversões e Algoritmo de Contagem em Θ(n lg n)",
        prompt: `
          <p>Seja $A[1 \\dots n]$ um arranjo de $n$ números distintos. Se $i < j$ e $A[i] > A[j]$, então o par de índices $(i, j)$ é denominado uma <strong>inversão</strong> de $A$. Resolva os quatro itens do <strong>Problema 2-4</strong>:</p>
          <ol>
            <li><strong>(a)</strong> Apresente a lista com as <strong>cinco inversões</strong> do arranjo $A = \\langle 2, 3, 8, 6, 1 \\rangle$.</li>
            <li><strong>(b)</strong> Qual arranjo com elementos do conjunto $\\{1, 2, \\dots, n\\}$ tem o maior número de inversões? Quantas inversões ele tem?</li>
            <li><strong>(c)</strong> Qual é a relação exata entre o tempo de execução da ordenação por inserção e o número de inversões no arranjo de entrada? Justifique.</li>
            <li><strong>(d)</strong> Dê um algoritmo que determine o número de inversões em qualquer permutação de $n$ elementos em tempo de pior caso <strong>$\\Theta(n \\lg n)$</strong> modificando a ordenação por intercalação.</li>
          </ol>
        `,
        placeholder:
          "Responda aos itens (a), (b), (c) e mostre como modificar MERGE para somar (n₁ - i + 1) ao contador de inversões toda vez que R[j] < L[i]...",
        solution: `
          <h4>(a) As 5 inversões de $A = \\langle 2, 3, 8, 6, 1 \\rangle$</h4>
          <p>Os pares de índices $(i, j)$ com $i < j$ e $A[i] > A[j]$ são:</p>
          <ol>
            <li>$(1, 5)$, pois $A[1] = 2 > A[5] = 1$;</li>
            <li>$(2, 5)$, pois $A[2] = 3 > A[5] = 1$;</li>
            <li>$(3, 4)$, pois $A[3] = 8 > A[4] = 6$;</li>
            <li>$(3, 5)$, pois $A[3] = 8 > A[5] = 1$;</li>
            <li>$(4, 5)$, pois $A[4] = 6 > A[5] = 1$.</li>
          </ol>

          <h4>(b) Arranjo com o Número Máximo de Inversões</h4>
          <p>O arranjo em ordem estritamente decrescente $\\langle n, n-1, n-2, \\dots, 2, 1 \\rangle$ possui o maior número de inversões, pois <em>todo</em> par $(i, j)$ com $1 \\le i < j \\le n$ é uma inversão. O total de inversões é:</p>
          $$\\binom{n}{2} = \\sum_{j=2}^{n} (j - 1) = \\frac{n(n - 1)}{2}.$$

          <h4>(c) Relação com o Tempo de Execução de <code>INSERTION-SORT</code></h4>
          <p>Para cada elemento $A[j]$ na iteração $j$ do <code>INSERTION-SORT</code>, o corpo do laço <code>while</code> (linhas 6–7) executa $t_j - 1$ vezes, exatamente uma vez para cada índice $i < j$ tal que $A[i] > A[j]$. Portanto, $t_j - 1$ é o número de inversões cujo segundo elemento é $j$, e a soma $\\sum_{j=2}^{n} (t_j - 1) = I$ é exatamente o número total $I$ de inversões no arranjo original! Assim, o tempo de execução do <code>INSERTION-SORT</code> é <strong>$\\Theta(n + I)$</strong>.</p>

          <h4>(d) Algoritmo <code>COUNT-INVERSIONS</code> em $\\Theta(n \\lg n)$</h4>
          <p>Ao dividir $A[p \\dots r]$ em $L = A[p \\dots q]$ e $R = A[q+1 \\dots r]$, qualquer inversão $(i, j)$ cai em um de três casos disjuntos: ambos em $L$ (contados recursivamente), ambos em $R$ (contados recursivamente), ou $i$ em $L$ e $j$ em $R$ (<strong>inversão cruzada</strong>). Durante o <code>MERGE-INVERSIONS</code>, como $L[1 \\dots n_1]$ e $R[1 \\dots n_2]$ já estão ordenados, sempre que um elemento real $R[j] < L[i]$ é copiado para $A[k]$, sabemos que $R[j]$ é menor que <strong>todos os $n_1 - i + 1$ elementos restantes em $L[i \\dots n_1]$</strong>! Basta somar $n_1 - i + 1$ ao contador de inversões nesse passo, mantendo a recorrência $T(n) = 2T(n/2) + \\Theta(n) = \\Theta(n \\lg n)$.</p>
        `
      }
    ]
  }
};

window.CODEX_DATA.modulesContent = {
  1: window.CODEX_DATA.module1
};

window.registerCodexModule = function (moduleId, content) {
  window.CODEX_DATA.modulesContent[moduleId] = content;
  const modMeta = window.CODEX_DATA.modules.find((m) => m.id === moduleId);
  if (modMeta) {
    modMeta.unlocked = true;
  }
};

