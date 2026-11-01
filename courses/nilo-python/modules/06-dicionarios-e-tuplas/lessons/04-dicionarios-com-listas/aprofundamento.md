# Dicionários Complexos: Estoques e Bancos de Dados em Memória

A combinação sinérgica de dicionários e listas permite construir estruturas de dados hierárquicas que espelham perfeitamente o formato JSON e esquemas relacionais de bancos de dados.

---

### 1. Modelagem de Estoque com Múltiplos Atributos (Listagem 6.53)

Considere um sistema de armazém onde cada produto possui dois atributos vinculados: a quantidade física em estoque e o preço unitário de venda.

Podemos modelar o valor de cada chave como uma lista de dois elementos:
$$\text{estoque} = \{ \text{produto}: [\text{quantidade}, \text{preço\_unitário}] \}$$

```python
estoque = {
    "tomate": [1000, 2.30],
    "alface": [500, 0.45],
    "batata": [2001, 1.20],
    "feijão": [100, 1.50]
}
```

Acessando os atributos do produto `"tomate"`:
* Quantidade em estoque: `estoque["tomate"][0]` $\to 1000$ unidades.
* Preço de venda: `estoque["tomate"][1]` $\to \text{R\$\ } 2{,}30$.

---

### 2. Baixa de Estoque e Vendas com Validação Defensiva (Exercício 6.17)

No Exercício 6.17 do livro, construímos o fluxo de transação de vendas:
* O usuário digita o nome do produto e a quantidade desejada.
* O sistema verifica se o produto existe no dicionário com o operador `in`.
* Se existir, verifica se a quantidade solicitada está disponível em estoque.
* Realiza a dedução física (`estoque[produto][0] -= qtd`) e calcula o subtotal monetário.

```python
venda = [["tomate", 5], ["batata", 10], ["alface", 5]]

total_venda = 0
print("--- Processamento de Baixa de Vendas no Estoque ---")

for operacao in venda:
    produto, quantidade = operacao
    if produto in estoque:
        preco = estoque[produto][1]
        disponivel = estoque[produto][0]
        
        if quantidade <= disponivel:
            custo = preco * quantidade
            estoque[produto][0] -= quantidade   # Baixa em estoque
            total_venda += custo
            print(f"Venda Aprovada: {produto:7s} | {quantidade:2d} un x R$ {preco:.2f} = R$ {custo:.2f}")
            print(f"  -> Estoque remanescente de {produto}: {estoque[produto][0]} un")
        else:
            print(f"Venda Recusada para {produto}: Estoque insuficiente (pedido: {quantidade}, disp: {disponivel})")
    else:
        print(f"Erro: Produto '{produto}' não cadastrado no inventário.")

print("-" * 50)
print(f"TOTAL FATURADO NAS VENDAS: R$ {total_venda:.2f}")
```

---

### 3. Listas de Dicionários vs. Dicionários de Dicionários

No design de software, temos duas arquiteturas predominantes para organizar coleções em memória:

#### A. Dicionário de Dicionários (Acesso rápido por chave primária):
```python
usuarios = {
    "usr_01": {"nome": "Nilo", "nivel": "admin"},
    "usr_02": {"nome": "Marllus", "nivel": "user"}
}
print(usuarios["usr_01"]["nome"])  # "Nilo"
```

#### B. Lista de Dicionários (Iteração sequencial orientada a registros/tabelas):
```python
clientes = [
    {"id": 1, "nome": "Nilo", "cidade": "Bruxelas"},
    {"id": 2, "nome": "Renata", "cidade": "São Paulo"}
]
for c in clientes:
    print(f"ID #{c['id']}: {c['nome']} reside em {c['cidade']}")
```
