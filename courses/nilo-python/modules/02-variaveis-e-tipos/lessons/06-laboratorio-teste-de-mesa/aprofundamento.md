# Guia Operacional do Laboratório de Teste de Mesa e Lógica

O laboratório interativo abaixo foi projetado em Vanilla JS para simular dois aspectos críticos da execução de programas em Python:

---

### 1. Painel de Rastreamento (Teste de Mesa)

1. **Seleção de Programas:** Escolha um dos scripts clássicos do livro de Nilo Menezes no menu suspenso (cálculo de aumento salarial, conversão de tempo, aluguel de veículo ou a troca de variáveis com `aux`).
2. **Execução Passo a Passo:** Clique no botão **"Executar Próxima Linha →"**. Observe como a linha correspondente é destacada e uma nova linha é anexada à tabela com a identificação precisa da variável que foi modificada e a fotografia integral do estado da memória.
3. **Execução Automatizada:** Clique em **"Executar Tudo ⏩"** para processar o script completo instantaneamente.
4. **Edição Livre:** Sinta-se à vontade para modificar as linhas de código ou escrever suas próprias atribuições e reiniciar o rastreamento com **"Reiniciar Rastreamento ↺"**.

---

### 2. Painel Booleano e Curto-Circuito

1. **Chaves de Valor-Verdade:** Alterne as variáveis booleanas $A, B, C, D$ entre `True` e `False` com um clique.
2. **Inspeção de Curto-Circuito:** Observe a lista de expressões derivadas dos exercícios do livro. O laboratório sinaliza claramente se a segunda parte da expressão precisou ser avaliada ou se foi ignorada por curto-circuito lógico do operador `and` ou `or`.
