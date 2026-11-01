# Conexões, Cursores e o Protocolo DB-API 2.0 (PEP 249)

## 1. Conexão em Disco vs. Banco em Memória

Para iniciar o trabalho com o banco de dados, invocamos a função `sqlite3.connect()`:

```python
import sqlite3

# Opção 1: Banco persistido em arquivo binário de disco
conexao = sqlite3.connect("agenda.db")

# Opção 2: Banco volátil em memória RAM (ideal para testes automatizados)
conexao_memoria = sqlite3.connect(":memory:")
```

Se o arquivo `agenda.db` não existir no diretório de trabalho, o SQLite o criará automaticamente com tamanho inicial zero. Se o arquivo já existir, a conexão é estabelecida imediatamente sem sobrescrever o conteúdo prévio.

> [!WARNING]
> Bancos criados com `:memory:` existem exclusivamente enquanto a conexão estiver aberta no processo em execução. Quando a variável de conexão for fechada ou o script terminar, todos os dados em memória RAM são imediatamente descartados.

---

## 2. A Distinção entre Connection e Cursor

Um erro conceitual comum de iniciantes é confundir o papel do objeto `Connection` com o objeto `Cursor`:

| Componente | Tipo Python | Papel e Responsabilidades |
| :--- | :--- | :--- |
| **`Connection`** | `sqlite3.Connection` | Representa o **canal físico de comunicação** com o arquivo ou memória. Gerencia o contexto transacional global (`commit()`, `rollback()`) e o nível de isolamento das travas no arquivo. |
| **`Cursor`** | `sqlite3.Cursor` | Representa o **ambiente de execução de comandos**. Contém métodos para executar SQL (`execute()`, `executemany()`) e armazena os metadados e o ponteiro sobre o conjunto de registros retornados (`fetchone()`, `fetchall()`). |

```python
import sqlite3

conexao = sqlite3.connect("agenda.db")
cursor = conexao.cursor()

# cursor despacha a consulta
cursor.execute("SELECT 1 + 1")
resultado = cursor.fetchone()
print(resultado)  # (2,)

# Fechamento formal
cursor.close()
conexao.close()
```

---

## 3. Gerenciamento Seguro com Context Managers (`with`)

O objeto de conexão do `sqlite3` implementa o protocolo de context manager (`__enter__` e `__exit__`), o que simplifica o tratamento de transações:

```python
import sqlite3

with sqlite3.connect("agenda.db") as conexao:
    cursor = conexao.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS teste (id INTEGER PRIMARY KEY, valor TEXT)")
    cursor.execute("INSERT INTO teste (valor) VALUES ('Exemplo Seguro')")
    # Se nenhuma exceção for lançada dentro do bloco with,
    # o Python realiza conexao.commit() automaticamente!
    # Se ocorrer um erro, conexao.rollback() é disparado.
```

> [!IMPORTANT]
> O bloco `with conexao:` gerencia automaticamente o **`commit()` ou `rollback()`** da transação, mas **não fecha a conexão física**. Para fechar a conexão automaticamente ao final do bloco, utilize a biblioteca `contextlib.closing` ou invoque explicitamente `conexao.close()`.
