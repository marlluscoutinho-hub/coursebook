# Guia Operacional do Laboratório de Filas e Pilhas

O laboratório de estruturas de dados abaixo concretiza visualmente os dois principais modelos de gerenciamento sequencial estudados no Capítulo 6:

---

### 1. Painel 1: Simulador de Fila Bancária (FIFO)

1. **Chegada de Clientes (F):** Clique no botão **"Chegada de Cliente (F) [append]"** para adicionar um novo cliente na cauda da fila.
2. **Atendimento de Clientes (A):** Clique no botão **"Atender Cliente (A) [pop(0)]"** para retirar o primeiro cliente da cabeça da fila. Note a guarda defensiva: se a fila estiver vazia, o laboratório impede o disparo de `IndexError`.
3. **Execução em Lote (Exercício 6.5):** Digite sequências como `FFFAAA` ou `FFAFFA` no campo de texto e clique em **"Processar Lote"** para observar a sequência contínua de chegadas e atendimentos no log de eventos.

---

### 2. Painel 2: Simulador de Pilha e Validador de Parênteses (LIFO)

1. **Inserção de Expressões:** Digite qualquer expressão contendo parênteses no campo de texto (ex.: `((2 + 3) * (5 - 1))` ou exemplos inválidos como `())` e `(()()`).
2. **Análise Passo a Passo:** Clique em **"Analisar Pilha Passo a Passo"**. A cada parêntese aberto `(`, veja o bloco sendo empilhado no topo da pilha; a cada parêntese fechado `)`, veja o topo sendo desempilhado.
3. **Diagnóstico Automático:** Acompanhe a mensagem de diagnóstico em tempo real que confirma se os delimitadores foram balanceados com perfeição ou identifica a posição exata da falha sintática.
