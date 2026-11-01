# Resumo da Unidade: Tuplas e Desempacotamento

### Pontos Essenciais

1. **Definição e Imutabilidade:** Tuplas são sequências ordenadas e imutáveis criadas com parênteses `(item1, item2)` ou simplesmente pela vírgula `,`. Qualquer tentativa de atribuição direta `t[0] = novo_valor` resulta em `TypeError`.
2. **Tupla Unitária:** Uma tupla de um único elemento requer vírgula explícita: `(5,)` ou `5,`. O formato `(5)` é interpretado como um número inteiro entre parênteses.
3. **Desempacotamento de Valores:** A sintaxe `a, b = 10, 20` atribui elementos sequenciais a variáveis individuais. A troca direta `a, b = b, a` elimina a necessidade de variáveis auxiliares temporárias.
4. **Mutabilidade Interna Protegida:** A tupla protege apenas seus ponteiros diretos; se contiver um objeto mutável como uma lista `("id", [1, 2])`, os elementos da lista interna continuam podendo sofrer mutações via `.append()` ou `.pop()`.
5. **Chaves Compostas Hasháveis:** Por serem imutáveis, tuplas contendo elementos imutáveis são hasháveis e servem como chaves de dicionários, sendo a base ideal para matrizes esparsas e pares de coordenadas `(x, y)`.
