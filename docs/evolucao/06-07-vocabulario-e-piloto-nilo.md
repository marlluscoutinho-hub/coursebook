# Etapas 6 e 7 — Vocabulário Editorial e Piloto Nilo-Python (v2 Modular)

**Plano:** [plano-refatoracao.md](../plano-refatoracao.md) · **Especificação:** [architecture.md](../architecture.md) · **Curso Piloto:** `courses/nilo-python/`

## Problema
1. O vocabulário da interface ainda continha termos antigos e misturados ("Unidades de Estudo" em vez de "Aulas", "Bancada de estudo" em vez de "Laboratório", "Bancada de rascunho" em vez de "Rascunho").
2. Era necessário validar o novo modelo modular (JSON + Markdown com KaTeX e perfis) em um curso completo real, para comprovar na prática que a IA escritora e o motor conseguem operar sem atritos antes da conversão de longo prazo do CLRS.

## O que foi implementado

### 1. Padronização do Vocabulário Editorial (Etapa 6)
- **Menu Lateral & Stepper:** "Unidades deste Módulo" passa oficialmente a ser **"Aulas deste Módulo"**.
- **Laboratório Interativo:** "Bancadas algorítmicas" e botões passam a se chamar **"Laboratórios Interativos"**.
- **Rascunho:** A antiga "bancada de rascunho" nos exercícios passa a ser simplesmente **"Rascunho"**.
- **Catálogo Visual de Callouts:** Estilização dedicada para `key-idea`, `theorem`, `invariant`, `analogy`, `definition`, `warning`, `note` e `code`.

### 2. Curso Piloto Canônico: Nilo-Python v2 (Etapa 7)
O Módulo 01 da obra *Introdução à Programação com Python* (Nilo Ney Coutinho Menezes) foi estruturado e validado integralmente no formato modular v2:
- `course.json`: Metadados formais, citação do livro e autores, e política `contentPolicy: "paraphrase"`.
- `profile.json`: Perfil pedagógico `pratico` (`intro` ➔ `lab` ➔ `text` ➔ `summary`).
- `modules/01-computador-e-interpretador/module.json`: Metadados do Módulo 01.
- **6 Aulas Canônicas Modulares:**
  1. `01-algoritmos-e-python`: Algoritmos cotidianos e filosofia do Python.
  2. `02-ambiente-e-interpretador`: Interpretador PVM, ciclo REPL vs. scripts `.py`.
  3. `03-primeiro-programa-print`: Função `print()` e regras críticas de digitação.
  4. `04-aritmetica-e-precedencia`: Operadores aritméticos e ordem de avaliação.
  5. `05-variaveis-e-memoria`: Modelo mental de variáveis e compartimentos de memória.
  6. `06-laboratorio-repl-e-simbolos`: Aula dedicada com **Laboratório Interativo** do simulador REPL (`kind: "lab"`, `mobile: "full"`).
- Cada aula conta com o trio `intro.md` (contextualização de abertura), `aprofundamento.md` (teoria e callouts) e `resumo.md` (síntese para fixação e revisão do módulo).
- `quiz.json`: 10 questões dialéticas com todas as alternativas detalhadamente justificadas.
- `exercises.json`: 8 problemas práticos com guia de resolução passo a passo e rascunho persistido.

### 3. Validação e Auditoria Automatizada
Execução via CLI `course_tool.py`:
- `validate`: **APROVADO 100%** (28 arquivos validados rigorosamente contra os schemas oficiais).
- `analyze`: Cobertura pedagógica total e confirmação de 100% de distratores dialeticamente explicados.

## Como reproduzir
```bash
python3 ~/.gemini/config/skills/coursebook-builder/scripts/course_tool.py validate \
  --course-dir "courses/nilo-python" --output "/tmp/val_nilo.json"

python3 ~/.gemini/config/skills/coursebook-builder/scripts/course_tool.py analyze \
  --course-dir "courses/nilo-python" --output "/tmp/ana_nilo.json"
```
