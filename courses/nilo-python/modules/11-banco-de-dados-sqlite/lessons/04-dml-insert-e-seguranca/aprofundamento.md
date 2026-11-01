# Inserção de Dados e a Anatomia do SQL Injection

## 1. A Sintaxe Canônica do INSERT INTO

Para inserir dados em uma tabela, especificamos as colunas e os valores correspondentes:

```sql
INSERT INTO agenda (nome, telefone) VALUES ('Nilo Menezes', '99111-2233');
```

No Python:

```python
import sqlite3

conexao = sqlite3.connect("agenda.db")
cursor = conexao.cursor()

cursor.execute("""
    INSERT INTO agenda (nome, telefone)
    VALUES ('Nilo Menezes', '99111-2233')
""")

# CRUCIAL: Sem o commit, as alterações ficam apenas no buffer da transação!
conexao.commit()
cursor.close()
conexao.close()
```

---

## 2. O Perigo Mortal da Concatenação: SQL Injection

Considere um código ingênuo que receba dados do usuário:

```python
# ❌ NUNCA FAÇA ISSO! VULNERABILIDADE GRAVE DE SEGURANÇA!
nome = input("Digite o nome: ")
telefone = input("Digite o telefone: ")

sql_vulneravel = f"INSERT INTO agenda (nome, telefone) VALUES ('{nome}', '{telefone}')"
cursor.execute(sql_vulneravel)
```

Se um usuário mal-intencionado digitar no campo `nome`:
`Maria', '9999'); DROP TABLE agenda; --`

A string interpolada gerará exatamente a seguinte instrução:
```sql
INSERT INTO agenda (nome, telefone) VALUES ('Maria', '9999'); DROP TABLE agenda; --', 'telefone');
```
O SQLite fechará a inserção e executará o comando seguinte: `DROP TABLE agenda;`, destruindo a tabela inteira e comentando o restante da linha com `--`!

---

## 3. A Solução Canônica: Marcadores de Parâmetros `?`

A especificação DB-API 2.0 resolve isso através de **consultas parametrizadas (Prepared Statements)**. Em vez de interpolar strings no código Python, colocamos um ponto de interrogação `?` para cada valor e passamos uma **tupla** como segundo argumento do método `execute`:

```python
# ✅ FORMA CORRETA E IMUNE A SQL INJECTION
nome = input("Digite o nome: ")
telefone = input("Digite o telefone: ")

cursor.execute(
    "INSERT INTO agenda (nome, telefone) VALUES (?, ?)",
    (nome, telefone)
)
conexao.commit()
```

### Como Funciona Internamente?
1. O SQLite primeiro **compila e analisa a sintaxe da árvore SQL**, sabendo previamente que haverá exatamente dois campos literais de dados.
2. Em seguida, os valores da tupla são injetados diretamente nos nós de dados já compilados.
3. Caracteres como aspas simples (`'`), ponto e vírgula (`;`) ou traços duplos (`--`) são tratados estritamente como **texto bruto** e nunca como delimitadores ou palavras-chave de comando.

---

## 4. Inserção em Lote com `cursor.executemany()`

Quando precisamos inserir dezenas ou milhares de registros de uma só vez (por exemplo, ao migrar uma lista de contatos do Python para o banco), executar `cursor.execute()` em loop é extremamente ineficiente.

O método `cursor.executemany()` compila o plano SQL uma única vez e o executa em lote para uma coleção de tuplas:

```python
dados = [
    ("Nilo Menezes", "99111-2233"),
    ("Maria Silva", "98222-3344"),
    ("João Souza", "97333-4455"),
    ("Ana Pereira", "96444-5566")
]

cursor.executemany(
    "INSERT INTO agenda (nome, telefone) VALUES (?, ?)",
    dados
)
conexao.commit()

print(f"Total de registros inseridos: {cursor.rowcount}")
```

> [!TIP]
> **Metadados Úteis do Cursor:**
> - `cursor.rowcount`: Retorna o número de linhas afetadas pela última instrução DML (`INSERT`, `UPDATE` ou `DELETE`).
> - `cursor.lastrowid`: Retorna o identificador `id` autoincremental gerado para a última linha inserida.
