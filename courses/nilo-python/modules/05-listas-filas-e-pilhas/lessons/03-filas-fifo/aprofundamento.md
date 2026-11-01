# Estruturas de Dados Abstratas: Filas (FIFO)

Uma **Fila** (*Queue*) é uma coleção ordenada de elementos regida pela regra estrita de disciplina temporal **FIFO (First In, First Out)**: o primeiro elemento inserido na estrutura é obrigatoriamente o primeiro a ser retirado.

---

### 1. Invariantes de uma Fila

Uma fila pura admite apenas duas operações fundamentais:
1. **Enfileirar (*Enqueue*):** Inserir um novo elemento no **fim (cauda/tail)** da estrutura. Em Python: `fila.append(novo_item)`.
2. **Desenfileirar (*Dequeue*):** Remover e retornar o elemento do **início (cabeça/head)** da estrutura. Em Python: `atendido = fila.pop(0)`.

$$\text{Entrada (Fim)} \longrightarrow [e_N, \dots, e_2, e_1] \longrightarrow \text{Saída (Início)}$$

---

### 2. O Simulador de Fila de Banco (Listagem 6.21)

Vejamos a implementação canônica apresentada por Nilo Menezes:
* Uma fila com os clientes iniciais de 1 a 5.
* Comandos do operador:
  * `A`: Atender cliente (remove da cabeça da fila).
  * `F`: Chegada de novo cliente (adiciona no fim da fila).
  * `S`: Sair do programa.

```python
ultimo = 10
fila = list(range(1, ultimo + 1))

while True:
    print(f"\nExistem {len(fila)} clientes na fila.")
    print(f"Fila atual: {fila}")
    print("Comandos: F (Novo cliente) | A (Atender) | S (Sair)")
    operacao = input("Operação: ").strip().upper()

    if operacao == "A":
        if len(fila) > 0:
            atendido = fila.pop(0)
            print(f"Cliente {atendido} atendido no guichê!")
        else:
            print("Fila vazia! Não há clientes a atender.")
    elif operacao == "F":
        ultimo += 1
        fila.append(ultimo)
        print(f"Cliente {ultimo} entrou na fila.")
    elif operacao == "S":
        print("Encerrando atendimento do banco.")
        break
    else:
        print("Operação inválida! Digite apenas F, A ou S.")
```

:::key-idea
Observe a guarda defensiva: `if len(fila) > 0: atendido = fila.pop(0)`. Se tentássemos chamar `fila.pop(0)` sem verificar o tamanho da lista, o programa quebraria imediatamente com `IndexError: pop from empty list`.
:::

---

### 3. Processamento em Lote de Múltiplos Comandos (Exercício 6.5)

No Exercício 6.5, o autor propõe aceitar uma string com vários comandos combinados (como `"FFFAAAS"`):
* Três novos clientes chegam (`FFF`).
* Três clientes são atendidos (`AAA`).
* O programa encerra (`S`).

```python
# Processador de Fila em Lote
ultimo = 5
fila = list(range(1, ultimo + 1))

comandos = input("Digite a sequência de operações (ex: FFFAAA): ").strip().upper()

for op in comandos:
    if op == "A":
        if len(fila) > 0:
            atendido = fila.pop(0)
            print(f"Atendimento: Cliente #{atendido} chamado.")
        else:
            print("Fila vazia! Nenhum cliente a atender.")
    elif op == "F":
        ultimo += 1
        fila.append(ultimo)
        print(f"Chegada: Cliente #{ultimo} ingressou na fila.")
    elif op == "S":
        print("Comando 'S': Encerrando processamento de lote antecipadamente.")
        break
    else:
        print(f"Aviso: Comando '{op}' desconhecido ignorado.")

print(f"\nEstado final da fila: {fila}")
```
