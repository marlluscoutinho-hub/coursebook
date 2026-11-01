# Etapa 10 — Conversão do Módulo 01 do CLRS para a Arquitetura Modular v2 & Desacoplamento dos Laboratórios

**Plano Geral:** [plano-refatoracao.md](../plano-refatoracao.md) · **Plano de Conversão CLRS:** [conversao-clrs.md](../conversao-clrs.md) · **Arquitetura v2:** [architecture.md](../architecture.md)

## Contexto e Desafio

Após a extinção do legado em JavaScript no curso piloto Nilo Python (Etapa 9), o principal desafio consistia em iniciar a migração do curso carro-chefe da plataforma: **Algoritmos: Teoria e Prática (CLRS 3ª Edição)**, composto por 16 módulos massivos, 35 capítulos e apêndices matemáticos.

O Módulo 01 (*O Papel dos Algoritmos e a Partida no Projeto e Análise*) cobre os Capítulos 1 e 2 do CLRS (pp. 15–46), abrangendo conceitos essenciais de corretude por invariantes de laço, modelo de computação RAM, análise assintótica $\Theta$ e três laboratórios interativos ricos (Simulador de Escala do Problema 1-1, Simulador Passo a Passo de `INSERTION-SORT` e Intercalador `MERGE` com cartas sentinelas $\infty$).

A migração seguiu a **Estratégia de Coexistência Não-Disruptiva**: o Módulo 01 é convertido para o formato canônico v2 puro (`courses/clrs-algoritmos/modules/01-papel-dos-algoritmos-e-partida/`), enquanto os Módulos 02 a 16 continuam em pleno funcionamento na plataforma através da camada de compatibilidade em memória.

---

## O Que Foi Implementado

### 1. Estrutura Modular Canônica v2 do Módulo 01
Foi gerada a hierarquia completa de dados puros (JSON + Markdown com KaTeX) em `courses/clrs-algoritmos/modules/01-papel-dos-algoritmos-e-partida/`:
- **`module.json`**: Metadados do módulo, escopo de páginas (pp. 15–46), capítulos e relação das 6 aulas.
- **`curriculum.json`**: Definição da trilha curricular completa em 6 Blocos e 16 Módulos do CLRS.
- **`course.json`**: Metadados editoriais e declaração canônica da obra de Cormen et al.
- **`quiz.json`**: 12 questões dialéticas analíticas com gabarito comentado alternativa por alternativa (`A`, `B`, `C`, `D`).
- **`exercises.json`**: 8 problemas clássicos com enunciado, resolução analítica passo a passo e rascunho.
- **`checklist.json`**: Checklist de prontidão e domínio conceitual para avanço pedagógico.

### 2. Decomposição das 6 Aulas (`lessons/`)
Cada aula foi estruturada com a tríade `lesson.json`, `intro.md`, `aprofundamento.md` e `resumo.md`:
1. `01-papel-dos-algoritmos-na-computacao` (pp. 17–21): Definição formal de algoritmo, problema computacional, instâncias e fronteiras de intratabilidade NP.
2. `02-algoritmos-como-tecnologia-duelo` (pp. 21–24): Algoritmos como tecnologia de hardware e duelo do Computador A vs. Computador B (com laboratório `clrs-scale-duel`).
3. `03-ordenacao-insercao-invariantes` (pp. 25–30): Ordenação por inserção, convenções de pseudocódigo e método de prova por invariantes de laço (com laboratório `clrs-insertion-sort`).
4. `04-analise-algoritmos-modelo-ram-e-theta` (pp. 30–35): Modelo RAM de passo único, custos exatos por linha, pior caso, melhor caso e ordem de crescimento $\Theta$.
5. `05-divisao-conquista-merge-sort` (pp. 35–38): Paradigma de divisão e conquista, procedimento `MERGE` com cartas sentinelas $\infty$ e `MERGE-SORT` (com laboratório `clrs-merge-sort`).
6. `06-recorrencias-arvore-problemas` (pp. 38–46): Equações de recorrência, árvore de recursão $\Theta(n \lg n)$ e problemas do Capítulo 2 (busca linear, ordenação por seleção, busca binária e par com soma $x$).

### 3. Desacoplamento dos Laboratórios para `labs/`
- Criado o arquivo [`labs/clrs-module1-labs.js`](../../labs/clrs-module1-labs.js), registrando três componentes no catálogo global:
  - `window.COURSEBOOK_LABS["clrs-scale-duel"]` (Simulador de Escala e Tabela Resolvida do Problema 1-1).
  - `window.COURSEBOOK_LABS["clrs-insertion-sort"]` (Simulador passo a passo com invariante de laço, cartas móveis e telemetria de operações).
  - `window.COURSEBOOK_LABS["clrs-merge-sort"]` (Intercalação com cartas sentinelas $\infty$, pilhas auxiliares $L$ e $R$ e log passo a passo).
- Eliminado o arquivo legado `courses/clrs-algoritmos/data/module1-labs.js`.
- Atualizado o [`index.html`](../../index.html) para carregar os laboratórios a partir de `labs/clrs-module1-labs.js`.

### 4. Suporte a Múltiplos Mounts no Carregador Modular (`app.js`)
- O carregador `loadModularCourse` em [`app.js`](../../app.js) foi aprimorado para suportar módulos que contêm múltiplos laboratórios em aulas distintas, respeitando o `mountId` declarado em `lesson.json` (`workbench-scale-mount`, `workbench-insertion-mount`, `workbench-merge-mount`).
- Flags `__isModular` foram integradas para garantir persistência em cache e evitar recarregamentos redundantes via rede.

---

## Validação e Verificação Automatizada

### 1. Auditoria de Schemas (`course_tool.py`)
```bash
python3 ~/.gemini/config/skills/coursebook-builder/scripts/course_tool.py validate \
  --course-dir courses/clrs-algoritmos \
  --output /tmp/clrs_val.json
```
- **Resultado:** **APROVADO 100% (28 arquivos validados, 0 erros, 0 avisos)**.

### 2. Teste de Ponta a Ponta Headless Chrome (CDP)
Executado via suíte automatizada:
- **Carregamento Modular do CLRS Módulo 01:**
  - `isModular: true`
  - 6 aulas carregadas com badges de leitura de página (`LIVRO: PP. 15-46`).
  - 12 questões de quiz e 8 exercícios canônicos disponíveis.
  - Laboratório 01 (Escala A vs. B): montado e funcional com seletor de $n = 10^7$.
  - Laboratório 02 (Insertion Sort): montado e renderizado com cartas, invariantes e controles de passo.
  - Laboratório 03 (Merge Sort com $\infty$): montado e funcional com pilhas $L$ e $R$.
- **Coexistência com Módulos Legados (Módulo 02):**
  - Módulo 02 carrega perfeitamente a partir do registro em memória (`unidades: 5`, título: *"Estudo Aprofundado — Crescimento de Funções, Notação Assintótica e Somatórios"*).
- **Regressão no Curso Nilo Python:**
  - `isModular: true`, 6 aulas, 10 quizzes, 8 exercícios e laboratório REPL em pleno funcionamento.

---

## Evidências Visuais Geradas
- `screenshot_clrs_modular_m1.png`: Visão geral do Módulo 01 com checklist e aulas modulares.
- `screenshot_clrs_insertion_workbench.png`: Laboratório interativo de Insertion Sort com visual brutalista e invariante de laço.
- `screenshot_clrs_legacy_m2.png`: Módulo 02 do CLRS carregado em regime de coexistência sem quebras.
- `screenshot_nilo_python_regression.png`: Nilo Python validado e íntegro.
