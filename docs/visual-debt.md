# Dívida visual — mapa de artefatos herdados

> Etapa 0 da refatoração. **Somente mapeamento**: nenhuma decisão foi aplicada. Cada item será tratado numa etapa posterior.
> Decisão: `manter` · `remover` · `renomear` · `a decidir`.

| # | Artefato | Onde aparecia | Observação | Status / Decisão |
|---|---|---|---|---|
| 1 | Marca "CODEX", `CODEX_DATA`, `registerCodexModule`, "TOMO #01", ISBN | `app.js`, `curriculum.js`, `index.html` | Resolvido: marca CourseBook unificada; aliases `COURSEBOOK_DATA`, `switchView`, `closeModal` e "Curso 01" criados com retrocompatibilidade | **Resolvido** |
| 2 | Tags em colchetes `[ … ]` em callouts, etapas e botões | `app.js`, `index.html`, `module1-labs.js` | Resolvido: colchetes brutos de terminal eliminados da UI; visual editorial limpo preservado | **Resolvido** |
| 3 | Rótulo "BANCADA INTERATIVA #NN" e classes `workbench-*` | `app.js`, `index.html`, `styles.css` | Resolvido: migrado para **Laboratório Interativo** (`lab-*`); aliases mantidos no CSS e JS | **Resolvido** |
| 4 | "Bancada de rascunho" nos exercícios | `app.js`, `index.html` | Resolvido: renomeado para **Rascunho** na UI e nos schemas | **Resolvido** |
| 5 | Estética "Brutalista / Paper & Ink": sombras duras, bordas pretas | `styles.css` | Identidade visual preservada: fundo creme `#FBF8F1`, texto `#111111`, realces âmbar e esmeralda | **Mantido** |
| 6 | `.clrs-pseudocode-box` | `styles.css`, módulos | Resolvido: aliases `.code-box` e `.canonical-code-box` adicionados no CSS | **Resolvido** |
| 7 | Callouts editoriais: `definition`, `important`, `lemma`, `note`, `warning` | `styles.css`, módulos | Resolvido: catálogo completo de callouts estilizado no CSS e suportado via diretivas `:::tag` | **Resolvido** |
| 8 | `theorem` usado como caixa genérica | módulos CLRS | Será tratado progressivamente na conversão dos módulos 2 a 16 do CLRS | **Planejado** |
| 9 | Hero e textos da home fixos no CLRS | `index.html`, `app.js` | Resolvido: home transformada em catálogo multi-cursos com seletor de cursos dinâmico | **Resolvido** |
| 10 | README centrado em um só curso, com contadores fixos | `README.md` | Atualizado para a arquitetura multi-curso do ecossistema CourseBook | **Resolvido** |
| 11 | Estilos inline (`style="…"`) gerados por `app.js` | `app.js` | Mantidos apenas para regras dinâmicas de largura/grid; classes canônicas adicionadas | **Otimizado** |
| 12 | Etapa "Revisão" como primeira etapa do módulo | `app.js` (`STEP_KEYS`), `index.html` | Resolvido: reordenado para Aulas (com síntese de abertura) ➔ Revisão ➔ Quizzes ➔ Exercícios | **Resolvido** |
| 13 | PDFs soltos na raiz e em `courses/*/` | raiz, `courses/` | Resolvido: PDFs organizados dentro de cada pasta de curso (`livro.pdf`, `nilo.pdf`, `forbellone.pdf`) e ignorados no git | **Resolvido** |
| 14 | Fórmulas inline longas com `\text{…}` | módulos CLRS | Resolvido: CSS com `overflow-x: auto` e `min-width: 0` previne quebra de container | **Resolvido** |
| 15 | Alvo de toque menor que 44 px | `tests/layout.html` | Resolvido: alvos $\ge 44\text{px}$ garantidos no CSS e validados com 0 falhas | **Resolvido** |
