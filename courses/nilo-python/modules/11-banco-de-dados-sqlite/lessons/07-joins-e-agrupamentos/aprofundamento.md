# Modelagem Relacional, Junções (JOIN) e Funções de Agregação

## 1. O Esquema Canônico do Livro: Cidades e Clientes

No Programa 11.13 e seguintes (pp. 296–300), Nilo Menezes divide a base em duas tabelas relacionadas:

```sql
-- Tabela Primária: Cidades
CREATE TABLE cidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    populacao INTEGER NOT NULL
);

-- Tabela Secundária: Clientes (com Chave Estrangeira)
CREATE TABLE clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT,
    cidade_id INTEGER,
    FOREIGN KEY (cidade_id) REFERENCES cidades(id)
);
```

> [!NOTE]
> Por razões de compatibilidade com versões legadas do SQLite, a validação de chaves estrangeiras vem desativada por padrão. Para forçar a verificação estrita de integridade referencial no SQLite, execute sempre ao abrir a conexão:
> ```python
> cursor.execute("PRAGMA foreign_keys = ON;")
> ```

---

## 2. A Junção Relacional com INNER JOIN

Para recuperar o nome do cliente acompanhado do nome da sua respectiva cidade e respectiva população, correlacionamos as tabelas pela igualdade entre a chave estrangeira e a chave primária:

```sql
SELECT 
    clientes.id,
    clientes.nome AS cliente,
    clientes.telefone,
    cidades.nome AS cidade,
    cidades.populacao
FROM clientes
INNER JOIN cidades ON clientes.cidade_id = cidades.id
ORDER BY clientes.nome;
```

### No Python:
```python
import sqlite3

conexao = sqlite3.connect("brasil.db")
conexao.row_factory = sqlite3.Row
cursor = conexao.cursor()

sql = """
    SELECT c.nome AS cliente, cid.nome AS cidade, cid.populacao
    FROM clientes c
    JOIN cidades cid ON c.cidade_id = cid.id
    ORDER BY cid.nome, c.nome
"""

for r in cursor.execute(sql):
    print(f"{r['cliente']:20} mora em {r['cidade']:15} (Pop: {r['populacao']:,})")
```

---

## 3. Funções de Agregação Matemáticas

O SQL disponibiliza funções embutidas para sumarizar grandes volumes de dados em um único indicador numérico:

| Função | Finalidade | Exemplo de Aplicação |
| :--- | :--- | :--- |
| **`COUNT(*)`** | Conta o total de registros retornados. | `SELECT COUNT(*) FROM clientes` |
| **`SUM(coluna)`** | Soma os valores numéricos da coluna. | `SELECT SUM(populacao) FROM cidades` |
| **`AVG(coluna)`** | Calcula a média aritmética dos valores: $\bar{x} = \frac{1}{N}\sum x_i$. | `SELECT AVG(preco) FROM precos` |
| **`MIN(coluna)`** | Obtém o menor valor registrado na coluna. | `SELECT MIN(preco) FROM precos` |
| **`MAX(coluna)`** | Obtém o maior valor registrado na coluna. | `SELECT MAX(populacao) FROM cidades` |

---

## 4. Agrupamento com GROUP BY e Filtro com HAVING

O `GROUP BY` agrupa linhas que possuem os mesmos valores em colunas especificadas, aplicando funções agregadas sobre cada grupo de forma independente:

### Quantidade de Clientes Cadastrados em Cada Cidade:
```sql
SELECT 
    cid.nome AS cidade,
    COUNT(c.id) AS total_clientes
FROM cidades cid
LEFT JOIN clientes c ON cid.id = c.cidade_id
GROUP BY cid.id, cid.nome
ORDER BY total_clientes DESC;
```

### A Diferença Crucial entre WHERE e HAVING:
- **`WHERE`:** Filtra **linhas individuais** antes que qualquer agrupamento ou cálculo de função agregada seja realizado.
- **`HAVING`:** Filtra os **grupos já calculados** após a agregação do `GROUP BY`.

```sql
-- Cidades com mais de 2 clientes cadastrados
SELECT 
    cid.nome AS cidade,
    COUNT(c.id) AS total_clientes
FROM cidades cid
JOIN clientes c ON cid.id = c.cidade_id
GROUP BY cid.id
HAVING COUNT(c.id) >= 2;
```
Essa combinação expressa análises analíticas de alta complexidade em poucas linhas declarativas de SQL.
