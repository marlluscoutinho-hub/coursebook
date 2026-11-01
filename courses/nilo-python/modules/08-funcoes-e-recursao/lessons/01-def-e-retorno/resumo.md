# Resumo da Unidade: Declaração de Funções e Retorno

### Pontos Essenciais

1. **Definição de Sub-rotinas:** A palavra `def nome(param1, param2):` define um bloco funcional coeso e parametrizado.
2. **Separação de Preocupações:** Funções devem computar e retornar dados (`return`) em vez de imprimi-los na tela (`print`), viabilizando reaproveitamento e testes.
3. **Ponto de Saída Antecipado:** A instrução `return` interrompe imediatamente a execução da função e devolve o controle ao fluxo chamador. Funções sem `return` explícito devolvem `None`.
4. **Retorno Múltiplo:** A sintaxe `return a, b` empacota os valores em uma tupla, permitindo desempacotamento direto pelo chamador (`x, y = fn()`).
