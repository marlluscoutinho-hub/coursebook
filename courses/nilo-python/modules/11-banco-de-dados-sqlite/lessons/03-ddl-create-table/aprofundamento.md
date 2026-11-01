# DDL: Modelagem de Esquemas e Afinidades de Tipo no SQLite

## 1. O Sistema de Tipos de Armazenamento do SQLite

Diferente de bancos relacionais com tipagem estrita (como PostgreSQL ou MySQL), onde tentar salvar texto em coluna inteira gera erro imediato de DDL, o SQLite utiliza um conceito inovador chamado **Afinidade de Tipos (*Type Affinity*)**. O SQLite classifica os dados em 5 classes de armazenamento fundamentais:

| Classe de Armazenamento | Descrição | Mapeamento no Python |
| :--- | :--- | :--- |
| **`NULL`** | Representa a ausência de valor ou dado desconhecido. | `None` |
| **`INTEGER`** | Número inteiro com sinal, armazenado em 1, 2, 3, 4, 6 ou 8 bytes conforme o valor. | `int` |
| **`REAL`** | Número de ponto flutuante de precisão dupla (8 bytes no padrão IEEE 754). | `float` |
| **`TEXT`** | Cadeia de caracteres codificada em UTF-8, UTF-16BE ou UTF-16LE. | `str` |
| **`BLOB`** | Dados binários brutos (*Binary Large Object*), gravados exatamente como fornecidos. | `bytes` |

> [!TIP]
> Tipos tradicionais de outros bancos como `VARCHAR(100)`, `CHAR(10)` ou `BOOLEAN` são mapeados internamente pelo SQLite para as classes acima (`TEXT` e `INTEGER` respectivamente, onde `0` é Falso e `1` é Verdadeiro).

---

## 2. O Primeiro Programa de Criação de Tabela do Livro

No Programa 11.1 (p. 266), Nilo Menezes escreve o script para criar a tabela `agenda`:

```python
import sqlite3

conexao = sqlite3.connect("agenda.db")
cursor = conexao.cursor()

cursor.execute("""
    CREATE TABLE agenda (
        nome TEXT,
        telefone TEXT
    )
""")

conexao.commit()
cursor.close()
conexao.close()
```

Se você executar esse script uma segunda vez, o SQLite levantará um erro fatal:
`sqlite3.OperationalError: table agenda already exists`

Para contornar essa situação e tornar scripts idempotentes (que podem ser executados repetidas vezes sem falhas), utilizamos a cláusula `IF NOT EXISTS`:

```sql
CREATE TABLE IF NOT EXISTS agenda (
    nome TEXT,
    telefone TEXT
);
```

---

## 3. Chaves Primárias e Restrições de Integridade (Constraints)

Embora a tabela inicial do livro utilize apenas `nome` e `telefone`, em projetos reais duas pessoas podem compartilhar o mesmo nome e o mesmo telefone. Para identificar unicamente cada registro, definimos uma **Chave Primária (`PRIMARY KEY`)**:

```sql
CREATE TABLE IF NOT EXISTS agenda (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL UNIQUE,
    data_cadastro TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Restrições Mais Utilizadas:
- `PRIMARY KEY AUTOINCREMENT`: Garante que cada nova linha inserida receba automaticamente um número inteiro sequencial único ($1, 2, 3, \dots$), gerenciado internamente pelo motor SQLite.
- `NOT NULL`: Impede a inserção de registros com valores vazios/nulos nesse campo.
- `UNIQUE`: Impede que dois registros possuam o mesmo valor na coluna (ex.: nenhum telefone duplicado).
- `DEFAULT valor`: Atribui um valor padrão automático quando o campo for omitido no `INSERT`.
