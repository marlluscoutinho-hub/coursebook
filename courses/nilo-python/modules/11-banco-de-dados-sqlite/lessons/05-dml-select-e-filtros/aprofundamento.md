# Consultas Estruturadas, Filtros Dinâmicos e Consumo de Resultados

## 1. As Três Estratégias de Consumo do Cursor em Python

Quando executamos uma instrução `SELECT`, o banco de dados não transfere todas as linhas de imediato para a memória RAM do Python. Em vez disso, o objeto `cursor` atua como um ponteiro (*stream*):

### Estratégia 1: Iteração Direta no Cursor (Recomendada para Grandes Bases)
```python
import sqlite3

conexao = sqlite3.connect("agenda.db")
cursor = conexao.cursor()

cursor.execute("SELECT nome, telefone FROM agenda")

for registro in cursor:
    nome, telefone = registro
    print(f"Nome: {nome:20} | Tel: {telefone}")
```
*Vantagem:* Complexidade de espaço $\mathcal{O}(1)$ na memória do Python. Se a tabela possuir 5 milhões de linhas, o Python processará linha a linha sem esgotar a RAM da máquina.

### Estratégia 2: `cursor.fetchone()`
Retorna a próxima linha individualmente como uma tupla, ou `None` quando o conjunto de dados se esgotar.
```python
cursor.execute("SELECT nome, telefone FROM agenda WHERE nome = ?", ("Nilo Menezes",))
registro = cursor.fetchone()
if registro:
    print("Encontrado:", registro[0], registro[1])
else:
    print("Contato não localizado.")
```

### Estratégia 3: `cursor.fetchall()`
Recupera todos os registros restantes de uma só vez, retornando uma lista comum do Python (`list` contendo tuplas):
```python
cursor.execute("SELECT * FROM agenda")
todos_contatos = cursor.fetchall()
print(f"Total na memória: {len(todos_contatos)}")
```
> [!WARNING]
> Use `cursor.fetchall()` apenas se a quantidade de registros for sabidamente pequena ou moderada. Em tabelas gigantescas, carregar tudo em uma lista pode causar travamentos por falta de memória (*Out of Memory*).

---

## 2. Acesso Elegante por Nomes de Coluna: `sqlite3.Row`

Por padrão, cada linha retornada pelo cursor é uma tupla indexada numericamente (`registro[0]`, `registro[1]`), o que torna o código frágil se a ordem das colunas no `SELECT` mudar.

O SQLite permite configurar a fábrica de linhas (`row_factory`):

```python
import sqlite3

conexao = sqlite3.connect("agenda.db")
conexao.row_factory = sqlite3.Row  # Ativa o mapeamento por nome de coluna
cursor = conexao.cursor()

cursor.execute("SELECT nome, telefone FROM agenda")
for linha in cursor:
    # Acesso como se fosse um dicionário ou tupla!
    print(f"Nome: {linha['nome']} | Telefone: {linha['telefone']}")
```

---

## 3. Cláusula WHERE, Operadores e Curingas LIKE

O poder das consultas relacionais reside na capacidade de filtrar registros com precisão:

| Operador / Cláusula | Função | Exemplo SQL |
| :--- | :--- | :--- |
| `=` , `<>` / `!=` | Igualdade e desigualdade | `WHERE preco = 50.0` / `WHERE status != 'inativo'` |
| `>` , `<` , `>=` , `<=` | Comparações numéricas | `WHERE populacao > 1000000` |
| `BETWEEN a AND b` | Intervalo inclusivo | `WHERE preco BETWEEN 10.0 AND 50.0` |
| `IN (v1, v2, ...)` | Pertinência a conjunto | `WHERE estado IN ('SP', 'RJ', 'MG')` |
| `LIKE '%termo%'` | Busca por padrão de texto | `WHERE nome LIKE '%Silva%'` |
| `IS NULL` / `IS NOT NULL` | Teste de valor ausente | `WHERE telefone IS NOT NULL` |

### Curingas do Operador LIKE:
- `%`: Representa zero, um ou múltiplos caracteres quaisquer (`'N%'` localiza "Nilo", "Neusa", "N").
- `_`: Representa exatamente um caractere (`'P_ulo'` localiza "Paulo", mas não "Paulinho").

---

## 4. Ordenação e Limitação: ORDER BY e LIMIT

Podemos ordenar os resultados por uma ou mais colunas, de forma ascendente (`ASC`, padrão) ou descendente (`DESC`), além de paginar o resultado:

```sql
SELECT produto, preco
FROM precos
WHERE preco > 15.0
ORDER BY preco DESC
LIMIT 5;
```

No Python, ao parametrizar consultas com filtros dinâmicos de texto com `LIKE`, passe os curingas dentro da tupla:

```python
termo = input("Pesquisar nome: ")
cursor.execute(
    "SELECT nome, telefone FROM agenda WHERE nome LIKE ? ORDER BY nome",
    (f"%{termo}%",)
)
```
Essa abordagem une a flexibilidade da busca textual ampla com a segurança total contra injeção de código.
