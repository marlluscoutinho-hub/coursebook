# Etapa 9 — Ativação do Motor Modular Nativo & Extinção de Conteúdo Legado em JS

**Plano:** [plano-refatoracao.md](../plano-refatoracao.md) · **Arquitetura v2:** [architecture.md](../architecture.md)

## Problema

1. O curso piloto **Nilo Python (Curso 03)** já contava com a estrutura canônica v2 em JSON e Markdown (`courses/nilo-python/modules/01-computador-e-interpretador/`), porém a aplicação ainda dependia de scripts monolíticos legados em `courses/nilo-python/data/` (`curriculum.js` e `module1.js`), inseridos via tags `<script>` no `index.html`.
2. O laboratório interativo do ciclo REPL e memória virtual estava acoplado dentro do código JavaScript do módulo, violando o princípio de conteúdo como dados puros (Opção B do plano de refatoração).
3. O carregador modular nativo da aplicação web (`app.js`) precisava integrar dinamicamente `course.json`, `curriculum.json`, `module.json`, quizzes, exercícios, checklist e as aulas em Markdown com KaTeX e callouts editoriais.

---

## O Que Foi Implementado

### 1. Extinção Definitiva de Arquivos Legados em JS no Curso
- A pasta `courses/nilo-python/data/` foi **completamente removida**.
- O curso Nilo Python agora opera com **zero arquivos `.js`**, consistindo exclusivamente em dados puros (`.json` e `.md`).
- As tags `<script src="courses/nilo-python/data/...">` foram removidas do `index.html`.

### 2. Desacoplamento do Laboratório para o Catálogo Global
- O laboratório táctil do interpretador Python e memória virtual foi extraído para o catálogo de componentes em [`labs/repl-simulator.js`](../../labs/repl-simulator.js) (`window.COURSEBOOK_LABS["repl-simulator"]`).
- O schema da aula (`06-laboratorio-repl-e-simbolos/lesson.json`) apenas declara:
  ```json
  {
    "type": "lab",
    "id": "repl-simulator",
    "source": "catalog",
    "mobile": "full"
  }
  ```
- O motor CourseBook identifica a declaração do laboratório e instancia o componente automaticamente no elemento de montagem (`workbench-mod1-mount`).

### 3. Implementação do Carregador Modular Assíncrono (`loadModularCourse`)
- Adicionada a função `loadModularCourse(courseId)` ao [`app.js`](../../app.js):
  - Consome via `fetch` a hierarquia de pastas do curso.
  - Carrega metadados do livro e da trilha (`course.json` e `curriculum.json`).
  - Carrega os quizzes dialéticos (`quiz.json`) com 10 questões comentadas e as letras das opções (`A`, `B`, `C`, `D`).
  - Carrega os exercícios práticos (`exercises.json`) com resolução analítica passo a passo.
  - Carrega o checklist de prontidão (`checklist.json`).
  - Itera sobre as aulas da pasta `lessons/`, reunindo a introdução contextual (`intro.md`), o aprofundamento teórico (`aprofundamento.md`) e os resumos de fixação (`resumo.md`).
  - Monta os pilares de revisão da Etapa 02 diretamente a partir dos `resumo.md` de cada aula, eliminando duplicidade de conteúdo.
- As funções `selectCourse()` e `openModuleReader()` foram convertidas para operações assíncronas com tratamento de carregamento sob demanda.

---

## Verificação e Testes Ponta a Ponta

1. **Validação de Schemas e Integridade Estrutural:**
   - `python3 ~/.gemini/config/skills/coursebook-builder/scripts/course_tool.py validate --course-dir "courses/nilo-python"`: **100% APROVADO**.
   - `bun tests/validate-schemas.mjs`: **100% APROVADO** contra todos os schemas JSON oficiais em `schema/`.
2. **Execução Headless Chrome via DevTools Protocol (CDP):**
   - Curso 01 (CLRS) mantém integridade e operacionalidade total em memória via adaptador.
   - Curso 03 (Nilo Python) é carregado assincronamente via `fetch`:
     - 6 aulas carregadas com badges de referência ao livro intactos (sem ocorrência de `undefined`).
     - Laboratório REPL interativo funcional: executado programa de soma de variáveis (`a = 2`, `b = 3`, `print(a + b)`), gerando saída `5` e alocando variáveis na tabela de memória virtual.
     - Checklist interativo de aulas e de revisão sincronizados no `localStorage`.
     - Quizzes e exercícios com guia de resposta e rascunho funcionando com precisão.
