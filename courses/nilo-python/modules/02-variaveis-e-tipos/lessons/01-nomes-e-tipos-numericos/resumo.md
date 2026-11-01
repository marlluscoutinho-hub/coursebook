### Síntese: Identificadores e Representação Numérica

1. **Léxica de Identificadores:** Variáveis iniciam com letra ou `_`, não aceitam caracteres especiais nem espaços, respeitam maiúsculas e minúsculas (*case-sensitive*) e não podem conflitar com palavras-chave do Python.
2. **Precisão Arbitrária de Inteiros (`int`):** Em Python 3, números inteiros não sofrem estouro de capacidade (*overflow*). Eles expandem alocação na RAM conforme necessário, computando potências como \(2^{1000}\) com precisão exata.
3. **Ponto Flutuante IEEE 754 (`float`):** Números decimais usam 64 bits (sinal, expoente e mantissa). Frações como \(0.1\) são dízimas periódicas binárias, gerando pequenas anomalias de representação como \(0.1 + 0.2 \approx 0.30000000000000004\).
4. **Coerção Numérica:** A presença de um ponto decimal transforma o literal em `float`. Em cálculos mistos (`int` com `float`), o resultado é sempre promovido para `float`.
