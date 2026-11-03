# CourseBook — Algoritmos: Teoria e Prática (CLRS)

> **Plataforma Educacional Interativa baseada na obra canônica *Introduction to Algorithms (CLRS, 3ª Edição)***  
> Por Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest e Clifford Stein.

🌐 **Acesse o curso online:** **[https://marlluscoutinho-hub.github.io/coursebook/](https://marlluscoutinho-hub.github.io/coursebook/)**

---

## 📌 Sobre o Projeto

O **CourseBook** transforma a leitura linear e passiva de um dos livros mais canônicos e densos da ciência da computação em uma **experiência modular, ativa e visual de estudo**.

O projeto conta com:
- **16 Módulos Temáticos Completos** cobrindo todos os 35 capítulos e apêndices essenciais da 3ª Edição do CLRS.
- **Leitura Guiada e Profunda:** Cada conceito matemático e algorítmico explicado com rigor e demonstrações passo a passo (sem resumos rasos).
- **Terminais de Pseudocódigo Padronizados:** 79+ procedimentos canônicos renderizados em caixas editoriais monoespaçadas com numeração e destaque sintático.
- **Bancadas de Estudo Interativas (Workbenches):** Simuladores visuais interativos em JavaScript nativo (Heap binário, Partição de Quicksort, Árvores Vermelho-Preto, Programação Dinâmica, Algoritmo Simplex, FFT, Graham Scan, etc.).
- **Quizzes Dialéticos com Gabarito Comentado:** 160 questões de múltipla escolha e V/F com explicações aprofundada alternativa por alternativa.
- **Exercícios e Problemas Canônicos:** 128 problemas do livro com guias de resolução analítica completos.
- **Design System Editorial Brutalista:** Estética *Paper & Ink* (papel creme `#FBF8F1`, tinta preta densa, realces em âmbar `#FBBF24` e tipografia acadêmica).
- **Fórmula Matemática Nativa:** Renderização de fórmulas em $\LaTeX$ via KaTeX offline/CDN.

---

## 🗺️ Trilha de Módulos (1 a 16)

| Bloco | Módulo | Título | Capítulos CLRS |
| :--- | :--- | :--- | :--- |
| **Bloco I** | Módulo 01 | O Papel dos Algoritmos e a Partida no Projeto e Análise | Cap. 1 e 2 |
| | Módulo 02 | Crescimento de Funções, Notação Assintótica e Somatórios | Cap. 3 + Ap. A |
| | Módulo 03 | Divisão e Conquista Avançada e Resolução de Recorrências | Cap. 4 |
| | Módulo 04 | Análise Probabilística e Algoritmos Aleatorizados | Cap. 5 + Ap. C |
| **Bloco II** | Módulo 05 | Ordenação no Lugar e Filas de Prioridades: Heapsort e Quicksort | Cap. 6 e 7 |
| | Módulo 06 | Limites Inferiores, Ordenação em Tempo Linear e Estatísticas de Ordem | Cap. 8 e 9 |
| **Bloco III** | Módulo 07 | Estruturas de Dados Elementares e Tabelas de Espalhamento | Cap. 10 e 11 |
| | Módulo 08 | Árvores de Busca Binária, Árvores Vermelho-Preto e Aumento de Estruturas | Cap. 12, 13 e 14 |
| **Bloco IV** | Módulo 09 | Programação Dinâmica, Algoritmos Gulosos e Análise Amortizada | Cap. 15, 16 e 17 |
| | Módulo 10 | Estruturas Avançadas: Árvores B, Heaps de Fibonacci, vEB e Conjuntos Disjuntos | Cap. 18, 19, 20 e 21 |
| **Bloco V** | Módulo 11 | Algoritmos Elementares em Grafos (BFS, DFS, SCC) e Árvores Geradoras Mínimas | Cap. 22, 23 + Ap. B |
| | Módulo 12 | Caminhos Mínimos (Fonte Única e Todos os Pares) e Redes de Fluxo Máximo | Cap. 24, 25 e 26 |
| **Bloco VI** | Módulo 13 | Algoritmos Multithread, Operações com Matrizes e Programação Linear | Cap. 27, 28, 29 + Ap. D |
| | Módulo 14 | Polinômios, Transformada Rápida de Fourier (FFT) e Teoria dos Números | Cap. 30 e 31 |
| | Módulo 15 | Correspondência de Cadeias e Geometria Computacional | Cap. 32 e 33 |
| | Módulo 16 | Intratabilidade Computacional: Problemas NP-Completos e Algoritmos de Aproximação | Cap. 34 e 35 |

---

## 📁 Estrutura do Repositório

O projeto é estruturado para suportar múltiplos cursos em pastas isoladas por livro:

```
coursebook/
├── index.html                  # Shell da aplicação (Home, Catálogo, Leitor e Configurações)
├── styles.css                  # Design System Paper & Ink Brutalism
├── app.js                      # Motor interativo com carregador modular (fetch v2) e eventos
├── schema/                     # Schemas JSON canônicos oficiais (course, module, lesson, lab, quiz...)
├── courses/
│   ├── clrs-algoritmos/        # Curso 01: Algoritmos: Teoria e Prática (CLRS 3ª Ed.)
│   │   ├── course.json         # Metadados do curso e citação formal da obra
│   │   ├── curriculum.json     # Trilha curricular completa dos 16 módulos e 6 blocos
│   │   ├── labs/               # Laboratórios interativos isolados do curso CLRS (clrs-module1-labs.js)
│   │   ├── modules/            # Módulos canônicos em JSON + Markdown puro
│   │   │   └── 01-papel-dos-algoritmos-e-partida/
│   │   │       ├── module.json
│   │   │       ├── quiz.json
│   │   │       ├── exercises.json
│   │   │       ├── checklist.json
│   │   │       └── lessons/
│   │   └── data/               # Módulos 02 a 16 suportados em regime de coexistência sem regressões
│   ├── forbellone-logica/      # Curso 02: Lógica de Programação (Forbellone 3ª Ed.)
│   │   └── course.json         # Metadados e planejamento curricular
│   └── nilo-python/            # Curso 03: Introdução à Programação com Python (Nilo Menezes 2ª Ed.)
│       ├── course.json         # Metadados do curso e citação formal do livro
│       ├── curriculum.json     # Trilha curricular completa dos 12 módulos
│       ├── labs/               # Laboratórios interativos isolados do curso Nilo (repl, trace, vfs, sqlite, etc.)
│       └── modules/            # Módulos 100% em JSON + Markdown (zero JS de conteúdo)
│           └── 01-computador-e-interpretador/
│               ├── module.json
│               ├── quiz.json
│               ├── exercises.json
│               ├── checklist.json
│               └── lessons/
```

---

## 🌐 Acesso Online

O projeto está disponível e hospedado no **GitHub Pages**:

👉 **[https://marlluscoutinho-hub.github.io/coursebook/](https://marlluscoutinho-hub.github.io/coursebook/)**

---

## 🚀 Como Executar Localmente

Como a aplicação é 100% frontend estática (Vanilla HTML5, CSS3 e ES6+):

1. Clone o repositório:
```bash
git clone git@github.com:marlluscoutinho-hub/coursebook.git
cd coursebook
```

2. Execute um servidor HTTP local simples (necessário para o carregamento modular via `fetch`):
```bash
# Com Python 3:
python3 -m http.server 8080

# Ou com Bun:
bunx serve .

# Ou com Node / npx:
npx serve .
```

3. Acesse no navegador: `http://localhost:8080`

---

## 🧭 Evolução do Projeto

O CourseBook é material de estudo pessoal e o projeto central do meu portfólio em engenharia com IA aplicada. A visão de longo prazo é gerar cursos modulares a partir de um livro (PDF), com uso pessoal e não comercial, parafraseando a obra e sempre citando o livro. Cada etapa da refatoração fica registrada aqui, com documento próprio, tag e commits rastreáveis. O plano completo está em [docs/plano-refatoracao.md](docs/plano-refatoracao.md).

| Etapa | O que mudou | Por quê | Documento | Tag |
| :--- | :--- | :--- | :--- | :--- |
| 0 | Estado inicial (CLRS em formato JS, motor acoplado ao conteúdo) | Ponto de retorno | [visual-debt](docs/visual-debt.md) | `v0-pre-refactor` |
| 1 | Correção do overflow de LaTeX e página de regressão | Fórmulas vazavam do bloco da aula | [01-latex](docs/evolucao/01-latex.md) | `refactor/01-latex` |
| 2 | Schema modular (JSON + Markdown), perfis e métricas | Contrato entre IA escritora e plataforma | [02-schema](docs/evolucao/02-schema.md) | `refactor/02-schema` |
| 3 | Skill construtora v2 e schemas completos | IA escreve novo formato com validação e análise | [03-skill-builder-v2](docs/evolucao/03-skill-builder-v2.md) | `refactor/03-skill-builder-v2` |
| 4-5 | Web Engine v2 e desacoplamento do CLRS | Suporte a Markdown, telemetria, gaveta mobile e bancadas extraídas | [04-05-engine-v2](docs/evolucao/04-05-engine-v2-e-adaptador-clrs.md) | `refactor/04-05-engine-v2` |
| 6-7 | Vocabulário canônico, alvos de toque mobile e piloto Nilo | Aulas, laboratórios e rascunho; 1ª validação do formato JSON+MD | [06-07-vocabulario](docs/evolucao/06-07-vocabulario-e-piloto-nilo.md) | `refactor/06-07-nilo-piloto` |
| 8 | Limpeza de artefatos, fluxo canônico e persistência | Eliminação de colchetes e termos legados; exportação/restauração JSON de backup | [08-limpeza-artefatos](docs/evolucao/08-limpeza-de-artefatos-e-persistencia.md) | `refactor/08-limpeza-e-persistencia` |
| 9 | Motor modular v2 e extinção de dados legados do Nilo | Carregador `loadModularCourse` nativo e catálogo `labs/repl-simulator.js` | [09-motor-modular](docs/evolucao/09-motor-modular-e-extincao-data-legado.md) | `refactor/09-motor-modular` |
| 10 | Conversão CLRS Fase 1 (Módulo 01) e labs desacoplados | Módulo 01 em JSON+MD com KaTeX puro e laboratórios em `labs/` | [10-conversao-clrs-modulo1](docs/evolucao/10-conversao-clrs-modulo1.md) | `refactor/10-clrs-modulo1` |

**Padrão de commits:** `<tipo>(<escopo>): <resumo>`, com tipos `feat`, `fix`, `refactor`, `docs`, `style`, `chore`, `test` e escopos `engine`, `lesson`, `lab`, `review`, `latex`, `schema`, `course/<id>`, `readme`.

---

## 📄 Licença & Créditos

Projeto com finalidade estritamente educacional. Baseado na obra *Introduction to Algorithms* de Cormen, Leiserson, Rivest e Stein (MIT Press / McGraw-Hill).
