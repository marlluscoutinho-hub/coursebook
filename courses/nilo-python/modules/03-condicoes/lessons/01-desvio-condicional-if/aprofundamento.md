# O Desvio Condicional if e a Indentação como Sintaxe de Bloco

A tomada de decisão em linguagens imperativas é governada por estruturas de controle de fluxo. A estrutura condicional básica é a instrução `if` (*se*), que permite ao programa executar um conjunto de comandos apenas quando uma condição booleana prévia for verdadeira.

---

### 1. Sintaxe Fundamental e os Dois-Pontos (`:`)

A estrutura geral do comando `if` em Python é:

```python
if condição:
    instrução_1
    instrução_2
instrução_fora_do_bloco
```

O mecanismo opera da seguinte forma:
1. O interpretador avalia a expressão booleana `condição`.
2. Se o resultado for `True`, as instruções indentadas subordinadas ao `if` são executadas.
3. Se o resultado for `False`, todo o bloco indentado é saltado e a execução prossegue na primeira linha com recuo alinhado ao `if`.

:::warning
O caractere de dois-pontos (`:`) ao final da linha do `if` é sintaticamente **obrigatório**. Ele indica ao analisador sintático (*parser*) que o cabeçalho da condição terminou e que um novo bloco delimitado por recuo se iniciará. Omitir os dois-pontos dispara imediatamente `SyntaxError: invalid syntax`.
:::

---

### 2. A Indentação como Gramática Oficial da Linguagem

Na imensa maioria das linguagens de programação, a delimitação de blocos é feita por caracteres explícitos:
* **C, C++, Java, Rust, JavaScript:** usam chaves `{ ... }`.
* **Pascal, Algol:** usam palavras-chave `begin ... end`.

Nessas linguagens, o espaçamento visual do código (recuo à direita) é mero adorno estético; um programador descuidado pode escrever código com recuos enganosos sem que o compilador perceba.

:::key-idea
Em **Python**, Guido van Rossum tomou uma decisão de projeto revolucionária: **a indentação é a própria gramática de delimitação de blocos**. O espaço em branco é significativo (*significant whitespace*).
:::

* O padrão recomendado internacionalmente pela PEP 8 é o uso de **4 espaços** para cada nível de recuo.
* O bloco se encerra na primeira instrução que retornar ao nível de recuo anterior.
* Misturar tabulações (`\t`) e espaços na mesma estrutura gera o erro `TabError: inconsistent use of tabs and spaces in indentation`.

---

### 3. Estudo de Caso Canônico: O Radar de Trânsito

Considere o Exercício 4.2 proposto por Nilo Menezes:
* Um radar eletrônico registra a velocidade de um veículo em km/h.
* Se a velocidade for estritamente superior a 80 km/h, o motorista foi multado.
* O valor da multa é de R$ 5,00 para cada km/h que exceder o limite de 80.

```python
velocidade = float(input("Digite a velocidade registrada (km/h): "))

if velocidade > 80:
    excedente = velocidade - 80
    multa = excedente * 5.0
    print("Você foi multado por excesso de velocidade!")
    print(f"Velocidade aferida: {velocidade:.1f} km/h | Limite: 80 km/h")
    print(f"Valor total da penalidade: R$ {multa:.2f}")

print("Fim da fiscalização.")
```

#### Rastreamento da Decisão:
* **Cenário A:** `velocidade = 75.0` $\to$ a condição `75.0 > 80` resulta em `False`. O bloco de três instruções indentadas é sumariamente ignorado. A saída é apenas `"Fim da fiscalização."`.
* **Cenário B:** `velocidade = 92.0` $\to$ a condição `92.0 > 80` resulta em `True`. As linhas indentadas são executadas: `excedente = 12.0`, `multa = 60.00`, exibindo as advertências de autuação. Em seguida, o fluxo retorna ao nível base e exibe `"Fim da fiscalização."`.
