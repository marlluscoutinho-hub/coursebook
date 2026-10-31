# Etapas 4 e 5 — Web Engine v2 e Desacoplamento do CLRS

**Plano:** [plano-refatoracao.md](../plano-refatoracao.md) · **Especificação:** [architecture.md](../architecture.md)

## Problema
Anteriormente:
1. O motor `app.js` continha mais de 630 linhas de código hardcoded referentes exclusivamente às 3 bancadas do Módulo 1 do CLRS (`initScaleWorkbench`, `initInsertionSortWorkbench`, `initMergeSortWorkbench`). O motor não era genérico e dependia diretamente de um curso específico.
2. Não havia suporte para renderizar Markdown com diretivas de callout sem ferramentas externas de build.
3. Não havia sistema de telemetria/métricas para comparar eficácia de perfis pedagógicos e monitorar acessos mobile.
4. A gaveta mobile da barra lateral não possuía backdrop escurecido, não fechava ao toque fora e permitia vazamento de scroll da página.
5. Vários botões tinham alvos de toque inferiores a 44px (reprovados no teste de layout).

## O que foi implementado

### 1. Desacoplamento e Adaptador do CLRS (Etapa 5)
- Extração cirúrgica das 3 bancadas do Módulo 1 de `app.js` para `courses/clrs-algoritmos/data/module1-labs.js`.
- O motor `app.js` agora inicializa laboratórios/bancadas de forma genérica via `curContent.initWorkbenches()` ou `curContent.initLabs()`.
- O CLRS e todos os seus 16 módulos continuam funcionando 100% sem qualquer regressão.

### 2. Motor Web v2 (Etapa 4)
- **Parser Markdown integrado (`renderMarkdown`)**: Suporte a diretivas de callouts canônicos (`:::theorem`, `:::key-idea`, `:::code`, `:::invariant`, `:::analogy`, `:::definition`, `:::warning`, `:::note`) e formatação editorial, com integração ao `marked.js` e fallback nativo.
- **Sistema de Métricas e Telemetria (`coursebook:events:v1`)**:
  - Registro de eventos `lesson_open`, `lesson_complete` e `quiz_answer`.
  - Captura da resolução `viewport` (largura em px) para análise comparativa mobile vs. desktop.
  - Função pública `window.coursebookGetMetrics()` para consulta e exportação.
- **Navegação Mobile Aprimorada**:
  - Fundo escurecido (`.sidebar-backdrop`) com efeito de desfoque.
  - Fechamento automático ao tocar no backdrop ou selecionar uma aula.
  - Bloqueio de rolagem da página quando o menu lateral está aberto em telas pequenas.
- **Conformidade de Acessibilidade Mobile**:
  - Alvos de toque ajustados com `min-height: 44px` nos botões `.btn-primary-brutal`, `.btn-secondary-brutal`, `.mobile-menu-btn` e `.sidebar-back-btn`.
  - Validação de 100% aprovada em `tests/layout.html` (0 alvos < 44px).

## Como reproduzir
```bash
python3 -m http.server 8000
# Acesse http://localhost:8000/ e navegue pelos módulos do CLRS
# Abra o console e digite: coursebookGetMetrics()
```
