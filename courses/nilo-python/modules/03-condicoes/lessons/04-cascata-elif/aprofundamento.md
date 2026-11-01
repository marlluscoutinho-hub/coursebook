# A Cláusula elif: Achatando Árvores de Decisão

A palavra-chave `elif` é uma contração sintática das palavras `else` e `if`. Ela permite concatenar múltiplas condições sequenciais no **mesmo nível de indentação**, evitando o deslocamento horizontal excessivo da tela (conhecido na indústria como *código em ponta de flecha* ou *arrow anti-pattern*).

---

### 1. Transformação Estrutural: De `else: if:` para `elif`

Compare as duas estruturas lógicas idênticas:

#### A. Estrutura Aninhada Clássica:
```python
if categoria == 1:
    preco = 10
else:
    if categoria == 2:
        preco = 18
    else:
        if categoria == 3:
            preco = 23
        else:
            preco = 0
```

#### B. Estrutura Idiomática em Cascata com `elif`:
```python
if categoria == 1:
    preco = 10
elif categoria == 2:
    preco = 18
elif categoria == 3:
    preco = 23
else:
    preco = 0
```

:::key-idea
Todas as ramificações `elif` compartilham a mesma margem vertical. A avaliação ocorre **de cima para baixo**: o primeiro predicado que resultar em `True` tem seu bloco executado, e o interpretador salta imediatamente para o fim de toda a cadeia condicional, sem avaliar os demais `elif` ou o `else`.
:::

---

### 2. Estudo de Caso Canônico: A Calculadora de Operações Básicas

No Exercício 4.8 do livro, projetamos um interpretador de operações aritméticas:
* O usuário digita dois operandos numéricos.
* O usuário escolhe a operação desejada digitando o símbolo (`+`, `-`, `*`, `/`).
* O programa avalia a escolha com `elif` e exibe o resultado formatado.

```python
num1 = float(input("Digite o primeiro número: "))
num2 = float(input("Digite o segundo número: "))
operacao = input("Digite a operação desejada (+, -, *, /): ").strip()

if operacao == "+":
    resultado = num1 + num2
    print(f"{num1} + {num2} = {resultado}")
elif operacao == "-":
    resultado = num1 - num2
    print(f"{num1} - {num2} = {resultado}")
elif operacao == "*":
    resultado = num1 * num2
    print(f"{num1} * {num2} = {resultado}")
elif operacao == "/":
    if num2 != 0:
        resultado = num1 / num2
        print(f"{num1} / {num2} = {resultado:.4f}")
    else:
        print("Erro Crítico: Não é permitida a divisão por zero!")
else:
    print(f"Erro: Operação '{operacao}' inválida ou não reconhecida.")
```

Note como o `else` final atua como **tratamento de exceção de domínio**, capturando entradas espúrias (como digitação de letras ou caracteres não mapeados).

---

### 3. Estudo de Caso Avançado: Tarifação de Energia Elétrica (Exercício 4.10)

No Exercício 4.10, Nilo Menezes apresenta uma matriz bidimensional de regras de faturamento:

$$\begin{array}{|c|c|c|}
\hline
\textbf{Tipo de Instalação} & \textbf{Faixa de Consumo} & \textbf{Preço por kWh} \\
\hline
\text{R (Residencial)} & \le 500\text{ kWh} & \text{R\$\ } 0{,}40 \\
\text{R (Residencial)} & > 500\text{ kWh} & \text{R\$\ } 0{,}65 \\
\hline
\text{C (Comercial)} & \le 1000\text{ kWh} & \text{R\$\ } 0{,}55 \\
\text{C (Comercial)} & > 1000\text{ kWh} & \text{R\$\ } 0{,}60 \\
\hline
\text{I (Industrial)} & \le 5000\text{ kWh} & \text{R\$\ } 0{,}55 \\
\text{I (Industrial)} & > 5000\text{ kWh} & \text{R\$\ } 0{,}60 \\
\hline
\end{array}$$

Implementação estruturada combinando `elif` no tipo com bifurcação na faixa:

```python
kwh = float(input("Consumo em kWh: "))
tipo = input("Tipo de instalação (R, C ou I): ").strip().upper()

valido = True

if tipo == "R":
    if kwh <= 500:
        tarifa = 0.40
    else:
        tarifa = 0.65
elif tipo == "C":
    if kwh <= 1000:
        tarifa = 0.55
    else:
        tarifa = 0.60
elif tipo == "I":
    if kwh <= 5000:
        tarifa = 0.55
    else:
        tarifa = 0.60
else:
    valido = False
    print(f"Erro: Tipo de instalação '{tipo}' desconhecido.")

if valido:
    total = kwh * tarifa
    print(f"Tipo: {tipo} | Consumo: {kwh:.1f} kWh | Tarifa: R$ {tarifa:.2f}/kWh")
    print(f"Total da fatura de energia elétrica: R$ {total:.2f}")
```
