# Etapa 8 — Limpeza Completa de Artefatos & Persistência de Dados (v2)

**Plano:** [plano-refatoracao.md](../plano-refatoracao.md) · **Dívida Visual:** [visual-debt.md](../visual-debt.md)

## Problema
1. O código e a interface ainda carregavam resquícios da fase de ideação inicial:
   - Marca antiga "CODEX", referências a "TOMO #01" e funções acopladas como `switchCodexView` e `closeCodexModal`.
   - Proliferação de colchetes brutos estilo terminal (`[ … ]`) em botões, tags, cabeçalhos de etapas e callouts.
   - Presença residual do termo "bancada" em arquivos de código, botões e títulos.
   - Vocabulário impreciso ("Seções" em vez de "Etapas" no stepper do módulo).
2. Não havia um mecanismo transparente para o usuário exportar ou restaurar seus dados locais de estudo (progresso, anotações de rascunho, respostas de quizzes e telemetria).

## O que foi implementado

### 1. Eliminação Completa de Artefatos em Colchetes (`[ … ]`)
- **Interface e Marca:** Remoção de todos os colchetes visuais em `index.html`, `app.js` e `courses/clrs-algoritmos/data/module1-labs.js`.
- **Botões e Tags:** As tags editoriais agora utilizam classes CSS limpas (`.badge-pill`, `.bracket-tag`) sem necessidade de caracteres de colchetes no texto HTML.
- **Parser Markdown:** O parser de diretivas `:::tag [Título]` agora limpa automaticamente os colchetes do título antes da renderização de `<span class="callout-tag">`.

### 2. Padronização Canônica de Vocabulário e Nomes
- **Marca Unificada:** A plataforma consolida-se oficialmente sob a marca **CourseBook**.
- **COURSEBOOK_DATA como Principal:** O motor e todos os módulos agora operam prioritariamente sobre `window.COURSEBOOK_DATA` e `window.registerCourseModule()`, mantendo `CODEX_DATA` e `registerCodexModule` exclusivamente como aliases retrocompatíveis.
- **Limpeza Profunda do Código e CSS:**
  - `index.html`: Remoção total de classes legadas (`codex-topbar`, `codex-brand`) e prefixos `tome-*` em favor de `coursebook-topbar`, `coursebook-brand`, `course-hero-*` e `id="coursebook-modal-overlay"`.
  - `styles.css`: Classes canônicas `.coursebook-topbar`, `.coursebook-brand`, `.lab-box`, `.coursebook-lab`.
  - `app.js`: Referências a `CODEX_DATA` substituídas por `COURSEBOOK_DATA`, autores dinâmicos no banner de estudo (sem autor fixo hardcoded), e unificação dos manipuladores `updateCourseHeroUI()`.
  - Módulos 2 a 16 do CLRS: Cabeçalhos, títulos de laboratórios e registros padronizados para `coursebook`, `Laboratório Interativo` e `registerCourseModule`.
  - Skill `coursebook-builder`: Templates atualizados para arquitetura canônica de 4 etapas e `registerCourseModule`.
- **Etapas vs. Seções:** A UI e as mensagens de progresso agora utilizam estritamente o termo **"Etapas"** para o stepper de 4 passos (`01. Aulas`, `02. Revisão`, `03. Quizzes`, `04. Exercícios`) e **"Aulas"** para as unidades de leitura.
- **Laboratórios:** A antiga "Bancada Interativa" foi integralmente renomeada para **"Laboratório Interativo"** em todos os cursos e scripts (`module1-labs.js`, `module2.js` a `module16.js`, `nilo-python`).
- **Callouts:** Suporte e estilização adicionados no CSS para `.canonical-callout.lemma` e `.canonical-callout.important`, complementando o catálogo.

### 3. Persistência de Dados & Backup Pessoal
- **Exportação JSON (`coursebookExportData()`):** Gera download instantâneo de um arquivo `coursebook-backup-YYYY-MM-DD.json` contendo o estado completo das etapas concluídas, anotações de rascunho, status de exercícios, respostas dos quizzes e métricas de telemetria.
- **Restauração JSON (`triggerRestoreFromFile()`):** Permite ao estudante carregar seu arquivo de backup em qualquer dispositivo ou navegador, restabelecendo o progresso sem perdas.
- **Modal Integrado:** Acessível diretamente pelo botão `💾 Backup` no topo da aplicação.

## Verificação e Auditoria
1. **Verificação de Colchetes e Termos Legados:**
   - `index.html`: **0 ocorrências** de `codex`, `tome`, `bancada` ou `[` em textos/rótulos.
   - `courses/clrs-algoritmos/data/`: **0 ocorrências** de `bancada`, registro moderno com `registerCourseModule`.
   - `courses/nilo-python/`: **0 ocorrências** de `bancada`, schemas e lições validadas.
2. **Layout Mobile:** Testado via Chrome Headless em 360 px com **0 alvos < 44 px** e **sem overflow horizontal**.
3. **Validação de Schemas & Runtime:**
   - `course_tool.py validate` aprovado em **100%**.
   - Simulação e testes de runtime com `bun` e Chrome Headless executados com sucesso (código 0).
