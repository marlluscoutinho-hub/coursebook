# Validação de Tipos Léxicos, Operador Ternário e Controle com Continue

> *"Em ❸, temos uma nova forma de condição que facilita decisões simples. O if imediato, ou na mesma linha, serve para decidir o valor a retornar... Em ❹, utilizamos a instrução continue. A instrução continue é similar ao break que já conhecemos, mas serve para indicar que devemos ignorar todas as linhas até o fim da repetição e voltar para o início, sem terminá-la."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, pp. 158, 159

---

### Visão Geral da Aula

Nesta aula, conectamos a teoria de validação de dados com recursos de controle de fluxo e sintaxe expressiva do Python essenciais para a construção do Jogo da Forca e de aplicações interativas robustas:

1. **Predicados de Validação de Conteúdo:** Métodos que respondem com booleanos sobre a natureza dos caracteres: `isalnum()` (alfanumérico), `isalpha()` (apenas letras alfabéticas), `isdigit()` (apenas dígitos numéricos), `isupper()` e `islower()`.
2. **Expressão Condicional Ternária:** A sintaxe elegante `valor_se_verdadeiro if condicao else valor_se_falso` para transformar blocos verbosos de 4 linhas em expressões funcionais concisas de 1 linha.
3. **Instrução de Salto `continue`:** Como pular imediatamente para a próxima iteração de um laço `while` ou `for`, ignorando o restante do corpo do loop sem abortar a repetição.
