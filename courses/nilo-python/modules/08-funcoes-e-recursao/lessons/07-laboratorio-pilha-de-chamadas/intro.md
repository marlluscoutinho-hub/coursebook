# Laboratório Interativo: Depurador de Pilha de Chamadas & Sandbox Lambda

> *"Visualizar a pilha de chamadas quadro a quadro desmistifica a recursão: cada chamada ganha seu próprio espaço de memória independente, preservando seus parâmetros até que o caso base retorne os resultados na volta."*  
> — **Nilo Ney Coutinho Menezes**, *Capítulo 8*, pp. 169–187

---

### Visão Geral do Laboratório

Bem-vindo à bancada prática do Módulo 08. Esta ferramenta interativa oferece dois simuladores para consolidar os tópicos mais abstratos do capítulo:

1. **Simulador Visual da Pilha de Chamadas (*Call Stack*):**
   - Rastreia a alocação e desalocação física dos quadros de ativação (*stack frames*) passo a passo.
   - Suporta algoritmos clássicos de Nilo Menezes: **Fatorial recursivo** ($4!$), **Fibonacci** ($\text{fib}(4)$) e **MDC de Euclides** ($\text{mdc}(24, 9)$).
   - Exibe variáveis locais de cada frame, linha em execução e propagação de valores de retorno.

2. **Sandbox de Funções Lambda e Ordem Superior:**
   - Permite testar expressões lambda customizadas para filtragem de listas (`filter`) e transformação matemática (`map`).
   - Avalia a expressão dinamicamente em tempo real em uma lista configurável de inteiros.
