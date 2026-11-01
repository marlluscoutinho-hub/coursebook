# Aprofundamento Teórico: CLI Automation e Interface com o Sistema Operacional

O módulo nativo `sys` fornece parâmetros e funções fortemente integrados ao interpretador CPython e ao ambiente de execução do sistema operacional host.

---

### 1. Estrutura da Lista `sys.argv`

Quando o usuário executa um comando no terminal:
```bash
python3 relatorio.py clientes.txt saida.csv
```
O sistema operacional repassa a string de comando ao processo Python, que a divide em tokens por espaços e preenche a lista `sys.argv`:

- `sys.argv[0]` $\to$ `'relatorio.py'` (O nome do script invocado).
- `sys.argv[1]` $\to$ `'clientes.txt'` (Primeiro parâmetro do usuário).
- `sys.argv[2]` $\to$ `'saida.csv'` (Segundo parâmetro do usuário).
- `len(sys.argv)` $\to$ `3`

> [!IMPORTANT]
> **Todos os Elementos de `sys.argv` são Strings:**
> Se o usuário passar números no terminal (`python soma.py 10 20`), `sys.argv[1]` será a string `"10"` e `sys.argv[2]` será `"20"`. A conversão com `int()` ou `float()` é mandatória antes de operações matemáticas.

---

### 2. Validação Defensiva de Parâmetros

Um script de terminal robusto nunca acessa `sys.argv[1]` às cegas. Ele inspeciona a quantidade de argumentos e emite instruções de uso (*usage message*) caso a chamada seja inválida:

```python
import sys

if len(sys.argv) < 3:
    print(f"Uso incorreto!\nSintaxe esperada: python {sys.argv[0]} <origem> <destino>")
    sys.exit(1)  # Termina o processo com código de erro 1

origem = sys.argv[1]
destino = sys.argv[2]
print(f"Processando de {origem} para {destino}...")
```

---

### 3. Exemplo Prático: Implementando um Emulador de `cat -n` (Exercício 9.3)

O comando Unix `cat -n` lê um arquivo e imprime suas linhas na tela, numerando-as sequencialmente:

```python
import sys

if len(sys.argv) < 2:
    print(f"Uso: python {sys.argv[0]} <nome_do_arquivo>")
    sys.exit(1)

nome_arquivo = sys.argv[1]

try:
    with open(nome_arquivo, "r", encoding="utf-8") as f:
        for numero, linha in enumerate(f, start=1):
            print(f"{numero:4d}: {linha.rstrip()}")
except FileNotFoundError:
    print(f"Erro: O arquivo '{nome_arquivo}' não foi encontrado.")
```
Esse padrão transforma pequenos scripts Python em ferramentas poderosas de automação de console, integráveis em pipelines com pipes `|` e redirecionamentos `>` do sistema operacional.
