# A Instrução break e o Padrão do Laço por Sentinela

Quando o critério de parada depende de uma entrada imprevisível ou de uma condição avaliada no meio do laço, a clássica verificação apenas no cabeçalho do `while` torna-se rígida e força duplicações de código (como ler o dado uma vez fora do laço e outra vez dentro).

A solução canônica em Python para esse desafio é o uso de laços infinitos controlados (`while True`) conjugados à instrução `break`.

---

### 1. Semântica da Instrução `break`

A instrução `break` provoca a **interrupção imediata e definitiva** do laço mais interno em que está inserida. Quando a CPU encontra a linha com `break`:
1. Nenhuma linha subsequente dentro do bloco daquela iteração é executada.
2. O laço é abortado imediatamente.
3. O fluxo de controle salta para a primeira instrução localizada após o encerramento do laço.

```python
s = 0
while True:
    v = int(input("Digite um número a somar ou 0 para encerrar: "))
    if v == 0:
        break   # Saída imediata ao digitar a sentinela 0
    s += v

print(f"Soma acumulada final: {s}")
```

:::key-idea
O valor especial que sinaliza ao programa a hora de parar (no exemplo acima, o número `0`) é denominado na literatura de **sentinela** (*sentinel value*). O `break` impede que a própria sentinela seja somada ao acumulador ou contada como dado válido.
:::

---

### 2. Estudo de Caso Canônico: Máquina Registradora de Vendas (Exercício 5.15)

No Exercício 5.15 de Nilo Menezes, programamos o terminal de vendas de uma loja:
* A loja trabalha com códigos de produtos e preços tabelados:
  * Código 1: R$ 0,50
  * Código 2: R$ 1,00
  * Código 3: R$ 4,00
  * Código 5: R$ 7,00
  * Código 9: R$ 8,00
* O usuário digita o código do produto e a quantidade comprada.
* A digitação do código `0` encerra as compras e emite o cupom total.
* Códigos inválidos exibem aviso de erro sem interromper o atendimento.

```python
total_compras = 0

print("=== Terminal de Vendas do Supermercado ===")
print("Códigos: 1 (R$ 0,50) | 2 (R$ 1,00) | 3 (R$ 4,00) | 5 (R$ 7,00) | 9 (R$ 8,00) | 0 (Encerrar)")

while True:
    codigo = int(input("\nCódigo do item: "))
    if codigo == 0:
        break   # Finaliza a compra

    preco = 0
    if codigo == 1:
        preco = 0.50
    elif codigo == 2:
        preco = 1.00
    elif codigo == 3:
        preco = 4.00
    elif codigo == 5:
        preco = 7.00
    elif codigo == 9:
        preco = 8.00
    else:
        print("Aviso: Código de produto inválido!")
        continue   # Pula para a próxima leitura sem pedir quantidade

    qtd = int(input(f"Quantidade do produto {codigo}: "))
    subtotal = preco * qtd
    total_compras += subtotal
    print(f"Subtotal do item: R$ {subtotal:.2f} | Total acumulado: R$ {total_compras:.2f}")

print("\n==========================================")
print(f"VALOR TOTAL A PAGAR: R$ {total_compras:.2f}")
print("Obrigado pela preferência!")
```

:::note
Note a presença opcional da instrução `continue`: enquanto o `break` destrói o laço, o `continue` apenas interrompe a iteração atual e salta de volta ao cabeçalho para a próxima rodada do `while`.
:::
