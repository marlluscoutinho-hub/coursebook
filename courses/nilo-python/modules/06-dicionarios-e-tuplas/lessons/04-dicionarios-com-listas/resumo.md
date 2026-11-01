### Síntese: Dicionários Complexos e Estoques

1. **Estruturas Compostas:** Dicionários com valores em listas `{"item": [qtd, preco]}` modelam tabelas de registros na memória RAM.
2. **Navegação Aninhada:** O primeiro acesso por chave localiza o registro `dict[chave]`; o segundo índice `[0]` extrai o campo interno desejado.
3. **Validação Transacional:** Verificar `if produto in estoque:` e `if qtd <= estoque[produto][0]:` protege o sistema contra `KeyError` e estoques negativos.
4. **Alinhamento com JSON:** Essa modelagem é idêntica aos padrões de intercâmbio de dados de APIs web modernas e documentos NoSQL.
