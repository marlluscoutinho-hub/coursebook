# Parâmetros Arbitrários: Empacotamento com *args e **kwargs

> *"Python permite que funções recebam uma quantidade arbitrária de parâmetros posicionais e nomeados utilizando os operadores * e **... Esse recurso é utilizado extensivamente por funções embutidas como print() e por frameworks modernos."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, pp. 177–181

---

### Visão Geral da Aula

Como a função `print()` do Python consegue receber 1, 5, 20 ou nenhum parâmetro e funcionar perfeitamente em todas as chamadas? Como o método `str.format()` recebe uma lista infinita de variáveis posicionais e nomeadas?

Nesta aula, você aprenderá:
1. **O Operador de Asterisco Simples (`*args`):** Como empacotar uma sequência indeterminada de argumentos posicionais em uma tupla imutável.
2. **O Operador de Asterisco Duplo (`**kwargs`):** Como empacotar argumentos nomeados arbitrários em um dicionário de pares chave-valor.
3. **Desempacotamento na Chamada:** A operação inversa: como passar os elementos de uma lista pré-existente como argumentos posicionais (`fn(*lista)`) e as chaves de um dicionário como argumentos nomeados (`fn(**dicionario)`).
