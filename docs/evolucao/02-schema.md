# Etapa 2 — Schema modular (e complemento da etapa 0)

**Plano:** [plano-refatoracao.md](../plano-refatoracao.md) · **Especificação:** [architecture.md](../architecture.md) · **Schemas:** [`schema/`](../../schema/)

## Problema
Hoje o formato pedagógico é código: HTML dentro de strings JS, etapas fixas em `app.js`. A IA que escreve os cursos não tem um contrato, e trocar o formato de um curso exige reescrever módulos.

## Decisões (e por quê)
| Decisão | Motivo |
|---|---|
| JSON + Markdown com KaTeX | Gerável e validável por IA; sem escape duplo de `\\` nem crases quebrando template literal |
| Perfil separado do conteúdo, com `extends` | Testar formatos diferentes sem reescrever aulas; um perfil pode combinar outros |
| Laboratório declara `mobile` | A IA escritora recebe uma regra clara; o motor avisa em vez de esconder o problema |
| Callouts: catálogo fechado + tipos `x-` declarados no curso | Fim dos tipos sem estilo (`lemma`, `note`...), com exceção controlada |
| Progresso e métricas em chaves separadas, métricas por eventos | Dá para calcular métricas que ainda não pensamos; `viewport` em todo evento |

## O que foi entregue
- `docs/architecture.md`: modelo da aula, blocos, perfis, livro/direitos autorais, progresso e métricas.
- `schema/`: `course`, `lesson`, `lab`, `profile`, `event`.
- `tests/validate-schemas.mjs`: 8 verificações (exemplos válidos passam; `custom` sem `entry`, laboratório sem `mobile`, evento sem `viewport` e callout sem prefixo `x-` falham como esperado).
- `tests/layout.html`: página de regressão de layout com checagem automática de overflow e alvo de toque. Já achou um botão abaixo de 44 px (`visual-debt.md`, item 15).

## Limitações conhecidas
- Faltam `module`, `quiz` e `exercises` (etapa 3, junto com a skill v2).
- A janela headless do Chrome tem largura mínima de ~500 px. Para 360 px reais, usar o DevTools ou um celular.

## Como reproduzir
```bash
python3 -m http.server 8000   # /tests/layout.html
bun tests/validate-schemas.mjs   # requer ajv e ajv-formats instalados
```
