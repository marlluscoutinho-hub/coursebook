### Síntese: O Padrão Acumulador

1. **Acumulador vs. Contador:** O contador avança em passos constantes (`+ 1`), enquanto o acumulador incorpora valores variáveis (`soma += valor`).
2. **Inicialização Neutra:** Acumuladores de soma devem iniciar em `0`; acumuladores de produto/fatorial devem iniciar em `1`. Inicializar incorretamente contamina todo o resultado.
3. **Cálculo de Médias:** A média aritmética só deve ser dividida após o encerramento do laço, quando a soma e a contagem total estiverem consolidadas.
4. **Juros Compostos:** Modelar acumulações financeiras mês a mês com laços `while` permite incorporar aportes e oscilações de taxas com facilidade computacional.
