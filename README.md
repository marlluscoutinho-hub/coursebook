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

2. Abra diretamente o arquivo `index.html` em qualquer navegador moderno, ou execute um servidor HTTP simples:
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

## 📄 Licença & Créditos

Projeto com finalidade estritamente educacional. Baseado na obra *Introduction to Algorithms* de Cormen, Leiserson, Rivest e Stein (MIT Press / McGraw-Hill).
