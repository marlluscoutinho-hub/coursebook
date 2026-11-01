# Aprofundamento Teórico: Acesso Aleatório e a Mecânica do Cursor

Um arquivo em disco é essencialmente um array contíguo de bytes gerenciado pelo sistema de arquivos (como ext4, NTFS ou APFS). O sistema operacional associa a cada descritor de arquivo aberto um offset numérico chamado **File Pointer**.

---

### 1. Inspecionando a Coordenada com `tell()`

O método `.tell()` responde com um número inteiro indicando a quantidade de bytes a partir do início do arquivo onde o cursor se encontra:

```python
with open("exemplo.txt", "w", encoding="utf-8") as f:
    print(f.tell())  # 0 bytes (início do arquivo)
    f.write("Python")
    print(f.tell())  # 6 bytes (avançou 6 bytes)
```

Ao realizarmos uma operação de leitura:
```python
with open("exemplo.txt", "r", encoding="utf-8") as f:
    trecho = f.read(3)  # Lê apenas 3 caracteres
    print(trecho)       # 'Pyt'
    print(f.tell())     # 3 bytes
```

---

### 2. Navegação Arbitrária com `seek()`

O método `.seek(offset, whence=0)` move o cursor para uma nova posição na sequência de bytes. O parâmetro `whence` especifica o ponto de referência:

| Valor de `whence` | Constante `os` | Ponto de Referência |
| :---: | :--- | :--- |
| `0` (Padrão) | `os.SEEK_SET` | Início do arquivo (offset absoluto a partir do byte 0) |
| `1` | `os.SEEK_CUR` | Posição atual do cursor (deslocamento relativo) |
| `2` | `os.SEEK_END` | Final do arquivo (offset relativo ao EOF) |

```python
with open("exemplo.txt", "r+", encoding="utf-8") as f:
    f.write("Linguagem Python")
    
    # Rebobinar o arquivo para o byte zero:
    f.seek(0)
    print(f.read())  # "Linguagem Python"
    
    # Tentar ler novamente sem seek():
    print(f"Leitura no final: '{f.read()}'")  # '' (retorna string vazia!)
    
    # Voltar para o byte 10:
    f.seek(10)
    print(f.read())  # 'Python'
```

> [!NOTE]
> **Modo Texto vs Modo Binário no `seek()`:**
> Em arquivos abertos no modo texto comum, o Python só permite deslocamentos arbitrários a partir do início (`whence=0`) ou retornos à posição zero (`seek(0)`). Para realizar saltos relativos ou saltar a partir do fim (`whence=1` ou `2`) com offsets não-nulos, o arquivo deve ser aberto em modo binário (`"rb"` ou `"r+b"`).

---

### 3. Buffers do Sistema Operacional e `flush()`

Para evitar que cada caractere escrito cause uma gravação mecânica lenta no disco ou SSD, o sistema operacional e a biblioteca padrão do CPython acumulam dados em um **buffer de escrita em memória** (tipicamente de 4 KB ou 8 KB).

Os dados só são fisicamente gravados no disco quando:
1. O buffer de memória fica completamente cheio.
2. O arquivo é fechado via `.close()` ou na saída do bloco `with`.
3. O comando explícito `f.flush()` é executado.

Se o computador perder energia antes do flush, dados pendentes no buffer podem ser perdidos.
