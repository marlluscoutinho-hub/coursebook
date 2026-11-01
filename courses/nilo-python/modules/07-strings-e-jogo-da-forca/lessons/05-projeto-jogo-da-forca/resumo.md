# Resumo da Unidade: Engenharia do Jogo da Forca

### Pontos Essenciais

1. **Estrutura de Estado:** O jogo mantém quatro variáveis centrais: `palavra` (alvo), `digitadas` (histórico completo), `acertos` (letras corretas) e `erros` (contador de falhas de 0 a 6).
2. **Reconstrução Dinâmica:** A cada ciclo, a palavra oculta é gerada iterando sobre a palavra e aplicando o ternário `letra if letra in acertos else "."`.
3. **Prevenção de Duplicatas com `continue`:** Palpites já tentados são interceptados antes de afetar o contador de erros.
4. **Renderização Condicional:** O cadafalso ASCII projeta a cabeça (`O`), tronco (`|`), braços (`/`, `\`) e pernas (`/`, `\`) de acordo com o total acumulado de falhas.
