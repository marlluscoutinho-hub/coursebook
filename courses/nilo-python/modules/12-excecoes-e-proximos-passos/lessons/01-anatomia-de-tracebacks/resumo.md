# Síntese da Unidade: Anatomia de um Traceback

### Pontos Fundamentais
1. **Leitura Invertida (Baixo para Cima):** Comece sempre pela última linha, que traz o nome da exceção e a descrição diagnóstica do erro.
2. **Localização do Epicentro:** A penúltima linha indica o arquivo e o número da linha onde a instrução causadora do erro falhou.
3. **Pilha de Chamadas (Call Stack):** As linhas anteriores detalham a cadeia de funções aninhadas que levaram a execução até o ponto de parada.
4. **Sintaxe vs. Tempo de Execução:** `SyntaxError` impede o programa de sequer iniciar; exceções de tempo de execução (`TypeError`, `ValueError`) ocorrem durante o processamento de dados.
5. **Método Científico de Debugging:** Reproduza o bug, formule uma hipótese com base no tipo e valor das variáveis e verifique a correção com asserções ou impressões direcionadas.
