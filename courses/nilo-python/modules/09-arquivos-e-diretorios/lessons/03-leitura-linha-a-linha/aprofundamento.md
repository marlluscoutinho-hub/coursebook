# Aprofundamento Teórico: Eficiência de Memória e Padrões de Consumo

### 1. Comparativo das Estratégias de Leitura

Considere um arquivo `log.txt` de 10 GB gerado por um servidor web em produção:

```python
# MÉTODO 1: f.read()
# Carrega os 10 GB inteiros em uma única string na memória RAM!
# Em máquinas com 8 GB de RAM -> MemoryError e travamento do processo.
with open("log.txt", "r", encoding="utf-8") as f:
    conteudo = f.read()

# MÉTODO 2: f.readlines()
# Cria uma lista contendo milhões de elementos de string na memória RAM!
# Consome ainda mais memória devido à sobrecarga de ponteiros da lista.
with open("log.txt", "r", encoding="utf-8") as f:
    linhas = f.readlines()

# MÉTODO 3: f.readline()
# Lê exatamente uma linha de cada vez sob demanda.
with open("log.txt", "r", encoding="utf-8") as f:
    while True:
        linha = f.readline()
        if not linha:  # EOF
            break
        processa(linha)
```

---

### 2. O Padrão Canônico: O Arquivo como Gerador Iterável

Em Python, o próprio objeto de arquivo retornado por `open()` implementa o protocolo de iteração (`__iter__()` e `__next__()`). Ele atua como um gerador (*lazy generator*):

```python
with open("log.txt", "r", encoding="utf-8") as f:
    for linha in f:
        # Apenas UMA linha reside na memória RAM a cada instante!
        # Complexidade de espaço: O(1)
        if "ERROR" in linha:
            print(linha.strip())
```

> [!TIP]
> **A Remoção Obrigatória do `\n` com `.strip()`:**
> O método de iteração preserva o caractere de quebra de linha `\n` no final de cada string lida. Se você fizer `print(linha)`, verá uma linha em branco extra entre cada saída, pois o `print()` já adiciona sua própria quebra de linha. Para evitar isso, utilize sempre `linha.rstrip("\n")` ou `linha.strip()`.

---

### 3. Exemplo Prático: Filtragem e Divisão de Arquivos (Exercício 9.1)

Considere a necessidade de ler um arquivo de números e separar pares e ímpares em dois arquivos distintos:

```python
with open("numeros.txt", "r", encoding="utf-8") as entrada, \
     open("pares.txt", "w", encoding="utf-8") as pares, \
     open("impares.txt", "w", encoding="utf-8") as impares:
     
    for linha in entrada:
        num = int(linha.strip())
        if num % 2 == 0:
            pares.write(f"{num}\n")
        else:
            impares.write(f"{num}\n")
```
Observe como o gerenciador de contexto `with` suporta a abertura simultânea de múltiplos arquivos separados por vírgula e barra invertida, garantindo que os três arquivos sejam fechados de maneira coordenada.
