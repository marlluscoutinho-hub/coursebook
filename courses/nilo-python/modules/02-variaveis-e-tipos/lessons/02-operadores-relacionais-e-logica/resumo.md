### Síntese: Lógica Booleana e Curto-Circuito

1. **Tipo Booleano (`bool`):** Possui exatamente dois literais canônicos: `True` e `False` (sempre com a primeira letra maiúscula).
2. **Operadores de Comparação:** `==` (igualdade de valor), `!=` (diferença), `<`, `>`, `<=`, `>=`. Sempre produzem um resultado booleano.
3. **Conectivos Lógicos e Precedência:** A hierarquia é estrita: `not` (mais prioritário), seguido por `and` e por último `or`. Parênteses devem ser usados para forçar clareza semântica.
4. **Curto-Circuito:** Em `A and B`, se $A$ é `False`, $B$ não é executado. Em `A or B`, se $A$ é `True`, $B$ não é executado. Esse mecanismo protege contra erros como divisão por zero.
