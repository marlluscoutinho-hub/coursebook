# Entrada de Dados Interativa, Coerção de Tipos e Formatação de Saída

Programas interativos necessitam pausar sua execução para aguardar a intervenção do usuário por meio do dispositivo de entrada padrão (`stdin`). Em Python, esse papel cabe à função nativa `input()`.

---

### 1. A Função `input()` e sua Natureza Textual

A chamada a `input()` aceita uma string opcional de parâmetro (conhecida como *prompt* ou convite), exibe esse texto no console e suspende a execução do programa até que o usuário pressione a tecla `Enter`:

```python
nome = input("Digite o seu nome: ")
print("Bem-vindo, " + nome + "!")
```

:::key-idea
**A Regra Universal do `input()`:** Independentemente do que o usuário digite no teclado — sejam letras, espaços, símbolos ou dígitos numéricos —, a função `input()` devolve **sempre e obrigatoriamente** uma cadeia de caracteres (`str`).
:::

Vejamos o que acontece quando tentamos somar dois valores lidos sem conversão:

```python
# CUIDADO: Armadilha clássica do iniciante
n1 = input("Digite o primeiro número: ")  # Usuário digita 5
n2 = input("Digite o segundo número: ")   # Usuário digita 3
print(n1 + n2)                            # Saída: "53", e NÃO 8!
```

Como `n1` e `n2` são strings (`"5"` e `"3"`), o operador `+` executa **concatenação textual** em vez de adição algébrica.

---

### 2. Conversão Explícita de Tipos (*Type Casting*)

Para que o interpretador compreenda a sequência de dígitos como um número aritmético, devemos aplicar funções de coerção explícita de tipos:

1. `int(valor)`: converte a string em um número inteiro.
2. `float(valor)`: converte a string em um número de ponto flutuante.
3. `str(valor)`: converte qualquer objeto numérico ou booleano em sua representação textual correspondente.

Podemos aninhar a chamada de conversão diretamente na leitura:

```python
# Conversão para inteiro
anos = int(input("Digite sua idade em anos: "))

# Conversão para ponto flutuante
salario = float(input("Digite o salário atual: R$ "))
```

$$\text{Texto digitado: } "1500.50" \xrightarrow{\text{float()}} \text{Objeto float: } 1500.50$$

:::warning
Se o usuário digitar um valor que não possa ser convertido (por exemplo, digitar `"quinze"` ou `"15,5"` com vírgula em vez de ponto), a função disparará a exceção `ValueError: invalid literal for int() with base 10`.
:::

---

### 3. Técnicas de Formatação de Saída

Para apresentar valores numéricos com precisão decimal controlada e textos informativos, o livro de Nilo Menezes ensina os marcadores de formato tradicionais com `%`, além de apresentar a evolução moderna da linguagem:

#### A. O Operador Clássico `%` (Marcadores C-style)
* `%d` ou `%i`: substitui por um número inteiro.
* `%f`: substitui por ponto flutuante (ex.: `%.2f` fixa duas casas decimais).
* `%s`: substitui por string.

```python
preco = 49.90
desconto = 5.0
preco_final = preco - desconto
print("Preço original: R$ %.2f | Desconto: R$ %.2f | A pagar: R$ %.2f" % (preco, desconto, preco_final))
# Saída: Preço original: R$ 49.90 | Desconto: R$ 5.00 | A pagar: R$ 44.90
```

#### B. Método Moderno: f-strings (Python 3.6+)
No Python moderno, a sintaxe preferencial e mais legível é a interpolação com **f-strings** (prefixando a string com `f` e inserindo expressões entre chaves `{}`):

```python
print(f"Preço original: R$ {preco:.2f} | Desconto: R$ {desconto:.2f} | A pagar: R$ {preco_final:.2f}")
```

---

### 4. Aplicação Integrada: Conversor de Tempo em Segundos

Como síntese dos conceitos de leitura, conversão e aritmética, vejamos a resolução elegante do clássico Exercício 3.9 do livro:

```python
# Exercício 3.9: Conversão de dias, horas, minutos e segundos para o total em segundos
dias = int(input("Dias: "))
horas = int(input("Horas: "))
minutos = int(input("Minutos: "))
segundos = int(input("Segundos: "))

total_segundos = (dias * 86400) + (horas * 3600) + (minutos * 60) + segundos
print(f"Total acumulado: {total_segundos:,} segundos.")
```
