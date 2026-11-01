# Strings: Sequências Imutáveis de Caracteres e Operações Básicas

Em ciência da computação, uma cadeia de caracteres (*string*) é uma sequência ordenada de símbolos alfanuméricos e de controle codificados em UTF-8. Em Python, o tipo nativo é denominado `str`.

---

### 1. Delimitadores Literais: Aspas Simples, Duplas e Triplas

Diferente de linguagens como C ou Java (onde aspas simples delimitam um único caractere `char` e aspas duplas delimitam `String`), o Python não possui tipo de caractere isolado: todo caractere é simplesmente uma string de tamanho unitário.

É possível delimitar literais com aspas simples `'...'` ou duplas `"..."`, ambas com exata equivalência semântica:

```python
texto1 = 'Introdução à Programação'
texto2 = "Introdução à Programação"
print(texto1 == texto2)  # True
```

Essa flexibilidade permite aninhar aspas sem a necessidade de caracteres de escape `\`:
```python
citacao = 'Ele disse: "Python é fascinante!"'
resposta = "Não me diga 'talvez', responda com certeza."
```

Para textos com quebras de linha preservadas ou blocos de documentação (*docstrings*), utilizamos aspas triplas `'''...'''` ou `"""..."""`:
```python
bloco = """Linha 1 do relatório
Linha 2 do relatório
Linha 3 com valores finais"""
```

---

### 2. Operadores de Concatenação (`+`) e Repetição (`*`)

O interpretador Python realiza sobrecarga de operadores (*operator overloading*): os mesmos símbolos aritméticos assumem novos significados quando aplicados a strings:

1. **Concatenação (`+`):** Une duas cadeias de caracteres em uma nova string única:
   ```python
   saudacao = "Olá, " + "Mundo!"
   # "Olá, Mundo!"
   ```
2. **Repetição (`*`):** Multiplica uma string por um número inteiro positivo, duplicando a sequência:
   ```python
   linha_divisoria = "=" * 30
   # "=============================="
   ```

:::warning
Não é permitido somar uma string a um número diretamente: `"Salário: " + 1500` dispara `TypeError: can only concatenate str (not "int") to str`. Para concatenar, é mandatório converter o número explicitamente com `str(1500)` ou usar formatação de texto.
:::

---

### 3. A Função `len()` e a Indexação com Base Zero

Toda string possui um comprimento mensurável correspondente ao número total de caracteres (incluindo espaços e pontuações), obtido pela função embutida `len()`:

```python
frase = "Python 3"
print(len(frase))  # 8 caracteres (índices de 0 a 7)
```

Em Python, a indexação de sequências é **zero-based** (inicia no índice 0):

$$\begin{array}{|c|c|c|c|c|c|c|c|}
\hline
\text{Caractere} & \text{'P'} & \text{'y'} & \text{'t'} & \text{'h'} & \text{'o'} & \text{'n'} & \text{' '} & \text{'3'} \\
\hline
\text{Índice Direto} & 0 & 1 & 2 & 3 & 4 & 5 & 6 & 7 \\
\hline
\text{Índice Negativo} & -8 & -7 & -6 & -5 & -4 & -3 & -2 & -1 \\
\hline
\end{array}$$

O acesso a elementos individuais é feito por colchetes `[índice]`:
```python
s = "Python"
print(s[0])   # 'P' (primeiro caractere)
print(s[5])   # 'n' (último caractere em índice direto)
print(s[-1])  # 'n' (último caractere por índice negativo conveniente)
print(s[-2])  # 'o' (penúltimo)
```

:::theorem
**Teorema dos Limites de Índice:** Se uma string possui comprimento $N = \text{len}(s)$, o acesso direto é válido apenas no intervalo fechado de índices inteiros $[0, N-1]$ ou no intervalo negativo $[-N, -1]$. A tentativa de acessar $s[N]$ resulta imediatamente no erro `IndexError: string index out of range`.
:::

---

### 4. Fatiamento Elementar de Strings (*Slicing*)

Além de extrair um único caractere, podemos extrair subcadeias inteiras utilizando a notação de fatia com dois-pontos `[início:fim]`:

* `início`: índice do primeiro caractere incluído (inclusivo).
* `fim`: índice do caractere onde a fatia para (exclusivo).

$$\text{Subcadeia extraída} = s[\text{início} \dots (\text{fim} - 1)]$$

Exemplo clássico:
```python
cidade = "São Paulo"
print(cidade[0:3])   # "São" (índices 0, 1 e 2; o 3 fica de fora)
print(cidade[:3])    # "São" (quando o início é omitido, assume-se 0)
print(cidade[4:])    # "Paulo" (quando o fim é omitido, vai até o final da string)
```
