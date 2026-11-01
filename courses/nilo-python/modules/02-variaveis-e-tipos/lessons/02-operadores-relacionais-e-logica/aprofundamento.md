# Álgebra Booleana, Operadores Relacionais e Curto-Circuito

Para que um computador tome decisões e execute desvios de fluxo, ele precisa avaliar o valor-verdade de predicados. Em Python, esse domínio é governado pelo tipo primitivo booleano (`bool`), cujos únicos literais possíveis são `True` e `False`.

---

### 1. O Tipo Booleano e os Operadores Relacionais

Os operadores relacionais estabelecem comparações entre dois termos e sempre devolvem um valor booleano:

| Operador | Significado Matemático | Exemplo em Python | Resultado |
| :---: | :--- | :---: | :---: |
| `==` | Igualdade de valor | `5 == 5` | `True` |
| `!=` | Diferença de valor | `5 != 3` | `True` |
| `>` | Estritamente maior que | `10 > 20` | `False` |
| `<` | Estritamente menor que | `10 < 20` | `True` |
| `>=` | Maior ou igual a | `5 >= 5.0` | `True` |
| `<=` | Menor ou igual a | `7 <= 6` | `False` |

:::warning
Não confunda o operador relacional de igualdade `==` com o operador de atribuição `=`. 
* `a = 10` ordena ao interpretador: "armazene o valor 10 na variável `a`".
* `a == 10` interroga o interpretador: "o valor contido em `a` é igual a 10?".
:::

Em Python, comparações entre inteiros e floats de mesmo valor numérico são matematicamente corretas:
```python
a = 4
c = 4.0
print(a == c)   # True (pois 4 e 4.0 representam a mesma grandeza quantitativa)
```

---

### 2. Operadores Lógicos e Tabelas-Verdade

Combinamos proposições atômicas utilizando três operadores lógicos essenciais: a negação (`not`), a conjunção (`and`) e a disjunção (`or`).

#### Negação Unária (`not`)
Inverte o valor-verdade da proposição:
$$\text{not } P \equiv \neg P$$

| Proposição $P$ | `not` $P$ |
| :---: | :---: |
| `True` | `False` |
| `False` | `True` |

#### Conjunção Lógica (`and`)
Devolve `True` se, e somente se, **ambos** os operandos forem verdadeiros:
$$P \land Q$$

| $P$ | $Q$ | $P$ `and` $Q$ |
| :---: | :---: | :---: |
| `True` | `True` | `True` |
| `True` | `False` | `False` |
| `False` | `True` | `False` |
| `False` | `False` | `False` |

#### Disjunção Lógica (`or`)
Devolve `True` se **pelo menos um** dos operandos for verdadeiro:
$$P \lor Q$$

| $P$ | $Q$ | $P$ `or` $Q$ |
| :---: | :---: | :---: |
| `True` | `True` | `True` |
| `True` | `False` | `True` |
| `False` | `True` | `True` |
| `False` | `False` | `False` |

---

### 3. Precedência Lógica e Parentetização

Assim como na aritmética a multiplicação tem precedência sobre a adição, na álgebra booleana os operadores possuem hierarquia estrita:

1. Parênteses `( )` (maior precedência)
2. Operadores relacionais (`==`, `!=`, `<`, `>`, `<=`, `>=`)
3. Operador unário `not`
4. Operador binário `and`
5. Operador binário `or` (menor precedência)

Considere a expressão:
$$\text{A} > \text{B and C or D}$$
Ela é avaliada internamente pelo compilador como:
$$((A > B) \land C) \lor D$$

Se $A = 5, B = 3, C = \text{False}, D = \text{True}$:
1. $5 > 3 \to \text{True}$
2. $\text{True and False} \to \text{False}$
3. $\text{False or True} \to \text{True}$

---

### 4. Avaliação de Curto-Circuito (Short-Circuit Evaluation)

O interpretador Python adota a otimização de **avaliação preguiçosa** em expressões booleanas:

:::key-idea
* Em uma expressão `A and B`, se $A$ for `False`, o resultado final já é garantidamente falso. O Python **não avalia** a subexpressão $B$.
* Em uma expressão `A or B`, se $A$ for `True`, o resultado final já é garantidamente verdadeiro. O Python **não avalia** a subexpressão $B$.
:::

Esse comportamento é vital para proteção de código defensivo, evitando exceções em tempo de execução:
```python
# Evita divisão por zero graças ao curto-circuito do 'and':
denominador = 0
resultado = (denominador != 0) and (100 / denominador > 5)
print(resultado)  # Devolve False sem estourar ZeroDivisionError!
```
