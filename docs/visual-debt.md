# Dívida visual — mapa de artefatos herdados

> Etapa 0 da refatoração. **Somente mapeamento**: nenhuma decisão foi aplicada. Cada item será tratado numa etapa posterior.
> Decisão: `manter` · `remover` · `renomear` · `a decidir`.

| # | Artefato | Onde aparece | Observação | Decisão |
|---|---|---|---|---|
| 1 | Marca "CODEX", `CODEX_DATA`, `registerCodexModule`, "TOMO #01", ISBN | `app.js`, `curriculum.js`, `index.html` | Nome da primeira ideia (um livro só). Vaza para a UI e para a API dos módulos | a decidir |
| 2 | Tags em colchetes `[ … ]` em callouts, etapas e laboratórios | `app.js`, todos os `moduleN.js` | Estética de "terminal" da ideia inicial | a decidir |
| 3 | Rótulo "BANCADA INTERATIVA #NN" e classes `workbench-*` | `app.js` (~linhas 869–1400), CSS | Passa a **laboratório** (`lab-*`) | renomear |
| 4 | "Bancada de rascunho" nos exercícios | `app.js` (~1649) | Passa a **rascunho** (decidido) | renomear |
| 5 | Estética "Brutalista / Paper & Ink": sombras duras, bordas pretas grossas | `styles.css` | Identidade do projeto; revisar se continua desejada | a decidir |
| 6 | `.clrs-pseudocode-box` | `styles.css`, módulos | Nome preso ao CLRS, usado em outros cursos | renomear |
| 7 | Callouts sem estilo próprio: `definition`, `important`, `lemma`, `note`, `warning` | módulos (1 a 8 usos cada) | O CSS só define `invariant`, `theorem`, `analogy`. Entram no catálogo (ver `docs/plano-refatoracao.md`, seção 10) | renomear/fundir |
| 8 | `theorem` usado como caixa genérica (≈104 usos) | módulos CLRS | Perde significado; reclassificar na conversão do CLRS | a decidir |
| 9 | Hero e textos da home fixos no CLRS | `index.html`, `app.js` | A home deveria ser do catálogo, não de um curso | a decidir |
| 10 | README centrado em um só curso, com contadores fixos ("160 questões", "79+ procedimentos") | `README.md` | Contadores desatualizam | a decidir |
| 11 | Estilos inline (`style="…"`) gerados por `app.js` | `app.js` (ex.: linhas 513, 735, 1663) | Dificulta tema único | a decidir |
| 12 | Etapa "Revisão" como primeira etapa do módulo | `app.js` (`STEP_KEYS`) | Passa a ser resumo por aula, depois do aprendizado | renomear |
| 13 | PDFs soltos na raiz e em `courses/*/` | raiz, `courses/` | Ignorados pelo `.gitignore` e **não rastreados** (verificado). Falta definir uma pasta padrão | a decidir |
| 14 | Fórmulas inline longas com `\text{…}` | conteúdo dos módulos | CSS não resolve; reescrever como display (ver `tests/latex.html`, caso 3) | a decidir |
| 15 | Alvo de toque menor que 44 px (botão "Anterior" / `.btn-secondary-brutal`) | achado em `tests/layout.html` | Detectado pela checagem automática; tratar na etapa 6 (ver plano, 6.5) | a decidir |
