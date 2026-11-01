# A Metodologia do Teste de Mesa e o Rastreamento de Estado

O teste de mesa (também conhecido internacionalmente como *trace table* ou *dry run*) é uma técnica analítica formal desenvolvida nos primórdios da ciência da computação para depuração e verificação estática de algoritmos.

Consiste em reproduzir manualmente, em uma folha de papel ou planilha estruturada, o trabalho exato da Unidade Central de Processamento (CPU) e da memória do computador.

---

### 1. A Estrutura Canônica de uma Tabela de Rastreamento

Uma tabela de teste de mesa organiza o tempo discreto da execução em colunas bem definidas:

1. **Linha / Passo:** O número sequencial da instrução executada no código.
2. **Colunas de Variáveis:** Uma coluna dedicada para cada variável declarada no programa.
3. **Saída na Tela:** O texto ou valor impresso na saída padrão (stdout) por funções como `print()`.

A regra de ouro é: **uma variável só altera seu valor na tabela no momento exato em que uma instrução de atribuição correspondente é executada**. Enquanto não for modificada, ela permanece inalterada ou com traço indicando que ainda não foi criada.

---

### 2. Estudo de Caso Canônico: Cálculo de Aumento Salarial

Considere o programa clássico apresentado por Nilo Menezes na Listagem 3.12:

```python
# Listagem 3.12 - Cálculo de aumento de salário
1: divida = 0
2: compra = 100
3: divida = divida + compra
4: compra = 200
5: divida = divida + compra
6: compra = 300
7: divida = divida + compra
8: compra = 0
9: print(divida)
```

Vamos construir a tabela de teste de mesa passo a passo:

| Linha | `divida` | `compra` | Saída na Tela | Observação Analítica |
| :---: | :---: | :---: | :---: | :--- |
| **1** | `0` | — | — | Inicialização de `divida` com zero |
| **2** | `0` | `100` | — | Atribuição de valor inicial a `compra` |
| **3** | `100` | `100` | — | `divida` recebe \(0 + 100 = 100\) (acumulação) |
| **4** | `100` | `200` | — | Sobrescrita de `compra` com novo valor |
| **5** | `300` | `200` | — | `divida` recebe \(100 + 200 = 300\) |
| **6** | `300` | `300` | — | Nova alteração no valor de `compra` |
| **7** | `600` | `300` | — | `divida` acumula \(300 + 300 = 600\) |
| **8** | `600` | `0` | — | Zera a variável `compra` |
| **9** | `600` | `0` | `600` | Exibição do valor final na saída padrão |

:::key-idea
Observe com atenção as linhas 3, 5 e 7: a expressão `divida = divida + compra` implementa o **padrão acumulador**. O valor antigo de `divida` é lido do lado direito da igualdade, somado ao valor de `compra`, e o resultado é reatribuído de volta a `divida`.
:::

---

### 3. Estudo de Caso 2: Troca de Variáveis e a Armadilha da Sobrescrita

Um erro comum entre iniciantes ocorre ao tentar trocar os valores de duas variáveis:
"Se `a = 5` e `b = 10`, quero que `a` fique com 10 e `b` fique com 5".

Vejamos a tentativa incorreta:
```python
1: a = 5
2: b = 10
3: a = b    # Perigo!
4: b = a
```

Ao montar o teste de mesa dessa sequência:

| Linha | `a` | `b` | Diagnóstico de Erro |
| :---: | :---: | :---: | :--- |
| **1** | `5` | — | `a` inicializado com 5 |
| **2** | `5` | `10` | `b` inicializado com 10 |
| **3** | `10` | `10` | O valor original de `a` (5) foi **destruído** na memória! |
| **4** | `10` | `10` | `b` recebe o valor atual de `a`, que já é 10. Ambas ficam com 10! |

Para corrigir o algoritmo, é indispensável usar uma variável auxiliar temporária (`aux`):

```python
1: a = 5
2: b = 10
3: aux = a   # Preserva o valor original de a
4: a = b     # a recebe o valor de b
5: b = aux   # b recebe o valor original preservado
```

| Linha | `a` | `b` | `aux` | Estado da Memória |
| :---: | :---: | :---: | :---: | :--- |
| **1** | `5` | — | — | `a = 5` |
| **2** | `5` | `10` | — | `b = 10` |
| **3** | `5` | `10` | `5` | `aux` armazena 5 |
| **4** | `10` | `10` | `5` | `a` passa a valer 10 |
| **5** | `10` | `5` | `5` | `b` recupera o 5 de `aux`. Troca concluída! |

:::note
Em Python idiomático, existe uma forma direta de realizar essa troca sem variável auxiliar explícita, chamada **atribuição múltipla**:
```python
a, b = b, a
```
Internamente, o Python cria uma tupla temporária na pilha para preservar os valores antes da atribuição.
:::
