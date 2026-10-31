# Etapa 3 — Skill Construtora v2 e Schemas Completos

**Plano:** [plano-refatoracao.md](../plano-refatoracao.md) · **Especificação:** [architecture.md](../architecture.md) · **Skill:** `~/.gemini/config/skills/coursebook-builder/`

## Problema
A versão anterior da skill `coursebook-builder` gerava módulos monolíticos legados em JavaScript (`moduleN.js` com `registerCodexModule`, templates literais com HTML embutido e vocabulário acoplado ao CLRS). A IA que construía os cursos não possuía ferramentas de validação de schemas, nem de análise pedagógica de fidelidade.

## O que foi implementado
1. **Conclusão dos Schemas Oficiais (`schema/`):**
   - `module.schema.json`: Módulo temático, capítulos, páginas, fluxo de aulas e referências de quiz/exercícios.
   - `quiz.schema.json`: Quizzes dialéticos com todas as alternativas justificadas (`explanation`).
   - `exercises.schema.json`: Exercícios clássicos com solução passo a passo e rascunho persistido.
   - Suite de testes em `tests/validate-schemas.mjs` expandida e validada via Bun/Ajv2020.
2. **Atualização da Skill `coursebook-builder`:**
   - **Novo `SKILL.md`:** Orientação explícita da tríade **Extrator ➔ Escritor ➔ Analisador**.
   - **Blueprint Instrucional v2 (`references/instructional_blueprint.md`):** Arquitetura centrada em Aulas (`intro.md`, `aprofundamento.md`, `resumo.md`), Laboratórios interativos com flag `mobile`, Quizzes dialéticos e Exercícios com Rascunho.
   - **Design System v2 (`references/design_system.md`):** Novo vocabulário editorial, catálogo oficial de callouts e requisitos mobile (alvos de toque $\ge 44\text{px}$ e sem overflow).
   - **CLI `course_tool.py` renovada:**
     - `scaffold`: Cria a estrutura de pastas v2 em JSON + Markdown.
     - `validate`: Valida JSONs contra schemas, existência de arquivos Markdown, chamadas a callouts oficiais e suporte mobile em laboratórios.
     - `analyze`: Emite métricas de cobertura do livro, contagem de aulas/laboratórios e confirmação de dialética 100% justificada.

## Como reproduzir
```bash
# Validar schemas
bun tests/validate-schemas.mjs

# Testar scaffold v2 e validação
python3 ~/.gemini/config/skills/coursebook-builder/scripts/course_tool.py scaffold \
  --slug "curso-teste" --title "Título" --author "Autor" --modules 1 --base-dir "/tmp" --output "/tmp/scaffold.json"

python3 ~/.gemini/config/skills/coursebook-builder/scripts/course_tool.py validate \
  --course-dir "/tmp/courses/curso-teste" --output "/tmp/validate.json"
```
