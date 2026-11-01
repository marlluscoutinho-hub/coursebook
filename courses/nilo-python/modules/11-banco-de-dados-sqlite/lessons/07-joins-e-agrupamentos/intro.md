# Modelagem Relacional: Chaves Estrangeiras, INNER JOIN e Agrupamentos (GROUP BY)

Até agora, manipulamos tabelas isoladas contendo todos os dados em suas próprias colunas. No entanto, o verdadeiro poder dos bancos de dados relacionais manifesta-se quando conectamos **múltiplas tabelas** entre si.

Imagine armazenar a cidade e a população de cada cliente diretamente na tabela de clientes. Se tivermos 10.000 clientes em São Paulo, repetiremos a palavra "São Paulo" e o número "12.396.372" dez mil vezes. Além do enorme desperdício de espaço em disco, se a população for atualizada, teríamos que modificar 10.000 linhas!

A solução proposta pela engenharia de software é a **Normalização de Dados**:
1. Criar uma tabela exclusiva `cidades` (onde cada cidade tem seu próprio `id`).
2. Fazer com que a tabela `clientes` aponte apenas para esse número identificador através de uma **Chave Estrangeira (Foreign Key)**.
3. Juntar as informações sob demanda em consultas ricas utilizando o operador `INNER JOIN`.

No **Capítulo 11 (pp. 296–313)**, Nilo Menezes fecha o estudo de banco de dados ensinando a modelar relacionamentos, calcular somatórios e contagens estatísticas com `GROUP BY` e filtrar relatórios executivos com `HAVING`.
