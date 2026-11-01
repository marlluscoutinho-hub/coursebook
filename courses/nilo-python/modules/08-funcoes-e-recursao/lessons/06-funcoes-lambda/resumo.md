# Resumo da Unidade: Funções de Primeira Classe e Lambdas

### Pontos Essenciais

1. **Objetos de Primeira Classe:** Funções em Python podem ser atribuídas a variáveis, armazenadas em coleções e passadas como argumentos para outras funções.
2. **Funções de Ordem Superior:** Funções que recebem sub-rotinas como parâmetros viabilizam injeção de dependência e desacoplamento de filtros e processamentos.
3. **Passagem sem Parênteses:** Para repassar uma função como parâmetro, utiliza-se apenas seu nome identificador (`foper`), sem parênteses de invocação imediata.
4. **Sintaxe Lambda:** A notação `lambda args: expressao` sintetiza funções anônimas descartáveis de uma única expressão com retorno implícito.
5. **Chaves de Ordenação:** Lambdas são o padrão da indústria para extrair chaves de classificação customizada em `sorted(lista, key=lambda x: ...)`.
