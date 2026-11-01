# Tuplas Imutáveis, Desempacotamento e Chaves Compostas

> *"Tuplas podem ser vistas como listas em Python, com a grande diferença de serem imutáveis. Tuplas são ideais para representar listas de valores constantes e também para realizar operações de empacotamento e desempacotamento de valores."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, p. 133

---

### Visão Geral da Aula

Até agora, trabalhamos com listas — estruturas dinâmicas, mutáveis e redimensionáveis — e com dicionários, que organizam valores em pares chave-valor. Porém, na engenharia de software e na ciência da computação, surge uma necessidade crítica: **como representar registros cujos campos não devem ser alterados acidentalmente em tempo de execução?**

É aqui que entram as **tuplas** (`tuple`). Nesta aula, você dominará:
1. **A Natureza Imutável da Tupla:** Sintaxe com parênteses, a pegadinha da vírgula obrigatória em tuplas unitárias (`(1,)` vs `(1)`), e o erro `TypeError: 'tuple' object does not support item assignment`.
2. **Empacotamento e Desempacotamento:** Atribuição múltipla paralela (`a, b = 10, 20`), troca idiomática de variáveis sem variável auxiliar temporária (`a, b = b, a`) e iteração com `.items()`.
3. **Tuplas como Chaves em Dicionários:** Por que listas não podem ser chaves (ausência de hash) enquanto tuplas podem, habilitando matrizes esparsas e coordenadas bidimensionais `(x, y)`.
4. **Mutabilidade Interna:** O que acontece quando uma tupla contém referências a objetos mutáveis (como uma lista em `("a", [1, 2]))`.
