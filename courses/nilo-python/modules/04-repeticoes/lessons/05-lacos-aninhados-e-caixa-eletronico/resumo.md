### Síntese: Laços Aninhados e Caixa Eletrônico

1. **Laços Aninhados:** A cada passo do laço externo, o laço interno percorre todas as suas repetições do início ao fim ($N \times M$ iterações).
2. **Reinicialização Obrigatória:** Variáveis de controle do laço interno devem ser reinicializadas a cada ciclo do laço externo.
3. **Estratégia Gulosa (Greedy):** O dispensador de notas atende ao saque subtraindo a maior cédula viável tantas vezes quanto possível antes de migrar para a denominação inferior.
4. **Condição de Parada Final:** O laço termina com `break` quando o saldo restante a pagar atinge rigorosamente zero (`apagar == 0`).
