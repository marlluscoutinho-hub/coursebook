# Mutação de Estado e Integridade Transacional (ACID)

## 1. Atualização com UPDATE e a Regra do WHERE

A instrução `UPDATE` altera os valores de uma ou mais colunas em registros já existentes:

```sql
UPDATE precos
SET preco = 79.90
WHERE produto = 'Livro Python Nilo';
```

Podemos atualizar múltiplos campos simultaneamente separando as atribuições por vírgula:

```sql
UPDATE agenda
SET nome = 'Maria Silva Ramos', telefone = '98888-7777'
WHERE id = 2;
```

> [!CAUTION]
> **O Perigo do UPDATE sem WHERE:**
> Se você esquecer a cláusula `WHERE` e executar:
> ```sql
> UPDATE precos SET preco = 0.0;
> ```
> O SQLite atualizará **absolutamente todos os produtos da tabela** para o preço zero! O banco de dados não pedirá confirmação adicional.

---

## 2. Exclusão com DELETE

O comando `DELETE FROM` remove linhas inteiras da tabela que atendam ao predicado estabelecido:

```sql
DELETE FROM agenda
WHERE id = 5;
```

Para verificar exatamente quantas linhas foram afetadas pelo comando `UPDATE` ou `DELETE`, inspecionamos o atributo `cursor.rowcount`:

```python
cursor.execute("DELETE FROM agenda WHERE nome = ?", ("Contato Antigo",))
print(f"Linhas excluídas: {cursor.rowcount}")

if cursor.rowcount == 0:
    print("Aviso: Nenhum registro correspondia ao critério.")
```

---

## 3. Controle Transacional: COMMIT e ROLLBACK

Por padrão, a biblioteca `sqlite3` do Python abre uma transação implicitamente assim que a primeira instrução DML (`INSERT`, `UPDATE` ou `DELETE`) é emitida.

Enquanto a transação estiver aberta:
- As modificações ficam em um arquivo de diário auxiliar temporário (*journal* ou *Write-Ahead Log - WAL*).
- Outros processos ou leitores não enxergam as alterações não consolidadas (princípio do **Isolamento**).
- Se a aplicação travar ou o computador for desligado, as alterações são descartadas e o arquivo volta ao estado anterior intacto.

### Confirmando com `commit()`
Grava todas as operações pendentes da transação no arquivo principal do banco de dados:
```python
conexao.commit()
```

### Abortando com `rollback()`
Desfaz todas as alterações pendentes executadas desde o último `commit()`:
```python
conexao.rollback()
```

---

## 4. O Exemplo Clássico: Transferência Bancária Atômica

Considere a transferência de R$ 200,00 da conta de Nilo para a conta de Maria. A operação envolve duas etapas:
1. Debitar R$ 200,00 de Nilo.
2. Creditar R$ 200,00 para Maria.

Se o sistema falhar após a etapa 1, o dinheiro sumiria no nada. Veja como garantir a **Atomicidade**:

```python
import sqlite3

conexao = sqlite3.connect("banco.db")
cursor = conexao.cursor()

origem = 101  # Conta Nilo
destino = 202 # Conta Maria
valor = 200.00

try:
    # 1. Debita
    cursor.execute("UPDATE contas SET saldo = saldo - ? WHERE numero = ?", (valor, origem))
    if cursor.rowcount == 0:
        raise ValueError("Conta de origem não encontrada!")

    # 2. Credita
    cursor.execute("UPDATE contas SET saldo = saldo + ? WHERE numero = ?", (valor, destino))
    if cursor.rowcount == 0:
        raise ValueError("Conta de destino não encontrada!")

    # Se ambas as etapas tiveram sucesso, consolida a transação
    conexao.commit()
    print("Transferência concluída com sucesso!")

except Exception as erro:
    # Em caso de qualquer falha, desfaz imediatamente todas as modificações parciais!
    conexao.rollback()
    print(f"Transação cancelada: {erro}. Nenhum saldo foi alterado.")

finally:
    conexao.close()
```
Com esse padrão, a integridade da base de dados é mantida matematicamente intacta.
