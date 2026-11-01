### Síntese: A Cláusula else

1. **Mutuamente Exclusivo:** O bloco `else` só é alcançado quando a condição do `if` associado resulta em `False`.
2. **Sem Condição Própria:** O `else` nunca recebe predicados (escrever `else condição:` é erro sintático); ele captura o complemento lógico universal do teste anterior.
3. **Eficiência e Segurança:** Substitui com vantagem o uso de dois `if` isolados, reduzindo o número de comparações da CPU e eliminando o risco de valores de fronteira caírem em lacunas esquecidas.
4. **Isolamento de Variáveis:** Configurar valores comuns (como a tarifa unitária) dentro dos ramos e calcular a expressão final fora do bloco evita duplicação desnecessária de código.
