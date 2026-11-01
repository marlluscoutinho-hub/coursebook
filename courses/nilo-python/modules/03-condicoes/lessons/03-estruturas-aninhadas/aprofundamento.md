# Condições Aninhadas e Regras de Negócio em Múltiplos Níveis

Quando colocamos uma instrução condicional dentro do bloco de comandos de outra instrução condicional, dizemos que temos uma **estrutura aninhada** (*nested condition*).

O aninhamento permite decompor problemas multidimensionais em árvores hierárquicas de decisão.

---

### 1. Mecânica de Indentação em Múltiplos Níveis

Cada novo nível de decisão introduz um recuo adicional de 4 espaços:

```python
if condição_geral:
    # Nível 1 de indentação (4 espaços)
    if subcondição_especifica:
        # Nível 2 de indentação (8 espaços)
        comando_nível_2()
    else:
        # Nível 2 alternativo (8 espaços)
        outro_comando_nível_2()
else:
    # Retorno ao Nível 1 (4 espaços)
    comando_alternativo_geral()
```

O interpretador só avaliará `subcondição_especifica` se `condição_geral` for estritamente verdadeira. Se a condição geral falhar, todo o bloco interior é completamente descartado pela CPU.

---

### 2. Estudo de Caso Canônico: Tarifação Telefônica por Minutos

Na Listagem 4.6 do livro de Nilo Menezes, o autor apresenta um sistema de faturamento de planos de telefonia móvel celular:
* Até 200 minutos consumidos: R$ 0,20 por minuto.
* Entre 200 e 400 minutos: R$ 0,18 por minuto.
* Acima de 400 minutos: R$ 0,15 por minuto.

Vejamos como esse escalonamento é resolvido com estruturas aninhadas:

```python
minutos = int(input("Minutos utilizados no mês: "))

if minutos < 200:
    preco = 0.20
else:
    # Sabemos que minutos >= 200
    if minutos <= 400:
        preco = 0.18
    else:
        # Sabemos que minutos > 400
        preco = 0.15

total = minutos * preco
print(f"Total de minutos: {minutos}")
print(f"Tarifa aplicada por minuto: R$ {preco:.2f}")
print(f"Valor total da conta: R$ {total:.2f}")
```

#### Análise das Condições de Contorno:
1. Para `minutos = 150`: entra no primeiro `if` (`150 < 200` é `True`), define `preco = 0.20` e pula todo o bloco do `else`.
2. Para `minutos = 200`: `200 < 200` é `False`, caindo no `else`. Dentro do `else`, testa `200 <= 400`, que é `True`, definindo `preco = 0.18`.
3. Para `minutos = 500`: `500 < 200` é `False`. No `else`, `500 <= 400` é `False`, caindo no `else` interno e definindo `preco = 0.15`.

:::note
Observe que, dentro do `else`, não precisamos escrever `if minutos >= 200 and minutos <= 400:`. A condição `minutos >= 200` já está matematicamente assegurada pelo simples fato de termos entrado no `else` da primeira comparação!
:::

---

### 3. Estudo de Caso 2: Aprovação de Empréstimo Imobiliário

No Exercício 4.9 do livro, um banco avalia a viabilidade de crédito imobiliário:
* O mutuário informa: o valor do imóvel ($V$), a renda mensal líquida ($S$) e o prazo em anos ($T$).
* A prestação mensal ($P$) é calculada dividindo o valor do imóvel pelo número de meses:
  $$P = \frac{V}{T \times 12}$$
* O empréstimo só pode ser aprovado se a parcela não ultrapassar 30% da renda:
  $$P \le 0{,}30 \times S$$

```python
valor_casa = float(input("Valor do imóvel pretendido (R$): "))
salario = float(input("Salário mensal líquido (R$): "))
anos = int(input("Prazo de pagamento em anos: "))

meses = anos * 12
prestacao = valor_casa / meses
limite_prestacao = salario * 0.30

print(f"\n--- Análise de Crédito Bancário ---")
print(f"Prestação calculada: R$ {prestacao:.2f} ({meses} parcelas)")
print(f"Capacidade de pagamento máxima (30%): R$ {limite_prestacao:.2f}")

if prestacao <= limite_prestacao:
    print("STATUS: Empréstimo APROVADO com sucesso!")
else:
    diferenca = prestacao - limite_prestacao
    print("STATUS: Empréstimo RECUSADO.")
    print(f"A prestação excede a margem consignável em R$ {diferenca:.2f}.")
```
