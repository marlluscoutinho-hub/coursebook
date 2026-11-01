# Parâmetros Opcionais, Argumentos Nomeados e Validação

> *"Nem sempre precisaremos passar todos os parâmetros para uma função, preferindo utilizar um valor previamente escolhido como padrão, mas deixando a possibilidade de alterá-lo, caso necessário... Quando especificamos o nome dos parâmetros, podemos passá-los em qualquer ordem."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, pp. 174, 176

---

### Visão Geral da Aula

Ao construir interfaces de programação (APIs) e bibliotecas reutilizáveis, flexibilidade é essencial: algumas configurações possuem valores comuns aplicáveis a 95% dos casos, mas os 5% restantes exigem personalização precisa.

Nesta aula, você dominará:
1. **Valores Padrão (*Default Parameters*):** A sintaxe `def fn(param=padrao):` e a regra de ordenação estrita (parâmetros opcionais sempre por último).
2. **Passagem por Nome (*Keyword Arguments*):** A capacidade de chamar funções especificando `nome_parametro=valor`, tornando a ordem irrelevante e documentando o propósito do argumento no código chamador.
3. **Padrão de Validação de Dados:** Como transformar validações repetitivas de intervalo numérico ou comprimento de string em funções genéricas reutilizáveis.
