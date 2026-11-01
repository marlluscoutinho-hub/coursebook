# Nomes de Variáveis, Precisão Numérica e Representação Binária

No modelo computacional contemporâneo, toda variável é um identificador simbólico que vincula um rótulo do código-fonte a um objeto alocado na memória volátil (RAM). Para que o interpretador Python consiga analisar o texto sem ambiguidades léxicas, a linguagem estabelece regras estritas para a formação de identificadores.

---

### 1. Regras Léxicas e Convenções de Nomenclatura

Um nome de variável válido em Python deve obedecer rigorosamente às seguintes diretrizes:

1. **Caractere Inicial:** Deve começar obrigatoriamente com uma letra (maiúscula ou minúscula do alfabeto) ou com o caractere de sublinhado (`_`). É terminantemente proibido iniciar identificadores com algarismos numéricos (`2salario` gera erro sintático imediato).
2. **Caracteres Subsequentes:** Podem conter letras, números e sublinhados (`salario_liquido_2026`). Não são permitidos espaços em branco, hífens (`-`), sinais aritméticos ou pontuações como pontos e vírgulas.
3. **Sensibilidade a Maiúsculas (Case Sensitivity):** `salario`, `Salario` e `SALARIO` representam três referências distintas na tabela de símbolos do interpretador.
4. **Palavras Reservadas:** O Python possui palavras-chave exclusivas para sua gramática (`if`, `else`, `while`, `for`, `def`, `class`, `import`, `True`, `False`, etc.) que não podem ser reutilizadas como nomes de variáveis.

:::key-idea
Em Python, a convenção oficial do guia de estilo PEP 8 para variáveis é o **snake_case**: palavras em minúsculas separadas por sublinhado, priorizando a clareza descritiva do domínio (ex.: `preco_unitario`, `total_impostos`).
:::

---

### 2. O Tipo Inteiro (`int`): Precisão Arbitrária

Em linguagens compiladas tradicionais de baixo nível (como C ou C++), os tipos inteiros são fixados pelo tamanho da palavra do processador:
* `int32`: varia no intervalo \([-2^{31}, 2^{31}-1]\), ou seja, de \(-2.147.483.648\) a \(2.147.483.647\).
* `int64`: varia no intervalo \([-2^{63}, 2^{63}-1]\).

Se uma operação aritmética ultrapassar esse teto numérico em C, ocorre o fenômeno catastrófico de **estouro de inteiros (integer overflow)**, produzindo números truncados ou negativos espúrios.

Em contrapartida, em **Python 3**, o tipo `int` é implementado com **precisão arbitrária (bignum)**. O interpretador gerencia dinamicamente blocos de memória para acomodar inteiros com tantos dígitos quantos couberem na memória física do computador:

```python
# Cálculo exato de 2 elevado a 1000 em Python
valor_gigante = 2 ** 1000
print(valor_gigante)
# Resultado: número com mais de 300 dígitos decimais exatos!
```

$$\text{Teto de bits em Python} \to \infty \quad (\text{limitado apenas pela RAM disponível})$$

---

### 3. O Tipo Ponto Flutuante (`float`) e o Padrão IEEE 754

Enquanto inteiros possuem precisão ilimitada, números com parte fracionária (reais) são mapeados em Python pelo tipo `float`, implementado através da norma internacional **IEEE 754 de precisão dupla (64 bits)**:

* **1 bit de sinal:** define se o número é positivo ou negativo.
* **11 bits de expoente:** controlam a ordem de magnitude da grandeza.
* **52 bits de mantissa (fração):** armazenam a precisão significativa (aproximadamente 15 a 17 dígitos decimais de precisão).

A representação matemática formal segue a relação:

$$X = (-1)^s \times (1 + m) \times 2^{e - 1023}$$

#### A Dízima Binária Periódica
No sistema decimal (base 10), frações como \(\frac{1}{3}\) geram dízimas infinitas:

$$\frac{1}{3} = 0{,}333333\dots$$

No hardware eletrônico, a aritmética é calculada na **base 2 (binária)**, cujas frações puras são potências inversas de 2: \(\frac{1}{2} = 0.5\), \(\frac{1}{4} = 0.25\), \(\frac{1}{8} = 0.125\), etc. Frações que parecem triviais em base 10, como \(0.1 = \frac{1}{10}\), tornam-se dízimas periódicas infinitas quando convertidas para o sistema binário:

$$(0.1)_{10} = (0.00011001100110011\dots)_2$$

Como a memória do computador possui apenas 53 bits de precisão para a mantissa, a dízima é truncada no bit mais próximo. Ao realizar operações aritméticas, esse resíduo microscópico se manifesta:

```python
>>> 0.1 + 0.2
0.30000000000000004

>>> 3 * 0.1
0.30000000000000004
```

:::note
Esse comportamento **não é um defeito do Python**, mas uma consequência universal da representação finita de números reais em hardware digital IEEE 754. Ele afeta identicamente Java, C, C++, JavaScript e Rust.
:::

---

### 4. Boas Práticas e Funções Nativas de Inspeção

Para inspecionar o tipo dinâmico inferido pelo interpretador Python para qualquer expressão, recorremos à função nativa `type()`:

```python
x = 42
print(type(x))    # <class 'int'>

y = 3.14159
print(type(y))    # <class 'float'>

z = 4.0
print(type(z))    # <class 'float'>: a presença do ponto torna o valor float!
```

:::theorem
**Teorema da Coerção Numérica Automática:** Quando um operador aritmético binário envolve um operando do tipo `int` e outro do tipo `float`, o interpretador Python converte implicitamente o operando inteiro para `float` antes de computar o cálculo, garantindo que o resultado final pertença ao tipo mais genérico (`float`):
$$\text{int} \oplus \text{float} \Longrightarrow \text{float}$$
:::
