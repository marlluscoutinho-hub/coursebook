# Estruturas de Dados Abstratas: Pilhas (LIFO)

Uma **Pilha** (*Stack*) é uma estrutura de dados sequencial onde todas as inserções e remoções são realizadas exclusivamente em uma única extremidade denominada **topo** (*top*).

A disciplina que rege a pilha é o princípio **LIFO (Last In, First Out)**: o último elemento a entrar é o primeiro a sair.

---

### 1. Invariantes de uma Pilha

As operações fundamentais são:
1. **Empilhar (*Push*):** Adicionar um elemento no topo da pilha. Em Python: `pilha.append(item)`. Complexidade $O(1)$ amortizada.
2. **Desempilhar (*Pop*):** Remover e retornar o elemento do topo da pilha. Em Python: `item = pilha.pop()`. Complexidade $O(1)$.
3. **Consultar o Topo (*Peek*):** Observar o elemento do topo sem removê-lo. Em Python: `pilha[-1]`.

$$\begin{array}{c}
\text{Entrada/Saída (Topo)} \longleftrightarrow [e_{\text{topo}}] \\
[e_{\dots}] \\
[e_1] \\
\text{(Base da Pilha)}
\end{array}$$

---

### 2. O Problema Canônico da Validação de Parênteses (Exercício 6.7)

Em qualquer compilador ou interpretador (incluindo o do Python), antes de executar uma expressão matemática ou lógica, o analisador léxico/sintático deve verificar se todos os delimitadores (como parênteses `( )`, colchetes `[ ]` e chaves `{ }`) foram abertos e fechados na ordem cronológica correta.

Exemplos:
* `(())` $\to$ **Válido**: 2 aberturas seguidas de 2 fechamentos balanceados.
* `()()()` $\to$ **Válido**: 3 pares balanceados consecutivos.
* `(()` $\to$ **Inválido**: um parêntese foi aberto e nunca fechado.
* `())` $\to$ **Inválido**: houve tentativa de fechar sem nenhum parêntese aberto correspondente.
* `)(` $\to$ **Inválido**: fechou antes de abrir.

#### O Algoritmo Baseado em Pilha:
1. Inicializamos uma pilha vazia `pilha = []`.
2. Lemos a expressão caractere por caractere:
   * Se o caractere for `'('`, **empilhamos** (`pilha.append('(')`).
   * Se o caractere for `')'`:
     * Se a pilha **não estiver vazia**, desempilhamos o topo correspondente (`pilha.pop()`).
     * Se a pilha **estiver vazia**, temos um erro imediato: tentou-se fechar um parêntese sem correspondente prévio!
3. Ao término de toda a leitura da expressão:
   * Se a pilha estiver vazia (`len(pilha) == 0`), a expressão está **perfeitamente balanceada**!
   * Se ainda sobrarem elementos na pilha, a expressão é **inválida** (faltou fechar delimitadores).

```python
# Exercício 6.7 - Verificador de Parênteses
expressao = input("Digite a expressão matemática: ")

pilha = []
erro = False

for pos, char in enumerate(expressao):
    if char == "(":
        pilha.append("(")
    elif char == ")":
        if len(pilha) > 0:
            pilha.pop()
        else:
            erro = True
            print(f"Erro de Sintaxe na posição {pos}: ')' sem correspondente aberto!")
            break

if not erro:
    if len(pilha) == 0:
        print("Validação: Parênteses perfeitamente balanceados e corretos!")
    else:
        print(f"Erro de Sintaxe: {len(pilha)} parêntese(s) '(' aberto(s) sem fechamento!")
```

:::theorem
**Teorema da Linguagem Livre de Contexto de Dyck:** O conjunto de todas as palavras bem formadas com parênteses balanceados constitui a clássica Linguagem de Dyck. Um autômato com pilha determinístico (DPDA) reconhece essa linguagem em tempo linear $O(N)$ e memória proporcional à profundidade máxima de aninhamento.
:::
