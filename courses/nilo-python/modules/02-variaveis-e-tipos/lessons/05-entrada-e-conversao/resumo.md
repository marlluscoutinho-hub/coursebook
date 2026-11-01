### Síntese: Leitura, Conversão e Formatação

1. **Retorno Textual de `input()`:** A função `input()` interrompe o fluxo para aguardar a digitação do usuário e retorna invariavelmente uma sequência do tipo `str`.
2. **Coerção Explícita de Tipos:** Para realizar cálculos matemáticos com as entradas, é mandatório aplicar `int()` para números inteiros ou `float()` para grandezas reais com frações.
3. **Formatação com Precisão:** Controlamos as casas decimais de saída usando especificadores de formato (como `%.2f` ou f-strings com `{valor:.2f}`), prevenindo a exibição de dízimas ou ruídos de precisão binária na interface.
4. **Interação Robusta:** Toda interface textual deve prever o formato numérico esperado (ponto como separador decimal em vez de vírgula) para evitar falhas de conversão (`ValueError`).
