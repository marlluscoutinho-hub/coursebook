# DML: Consultas com SELECT, Filtros WHERE e Recuperação de Registros

Depois de definir tabelas e gravar informações, a operação mais frequente em qualquer sistema é a **leitura** dos dados. O comando `SELECT` é a espinha dorsal de todo o modelo relacional.

Com o `SELECT`, podemos:
- Escolher exatamente quais colunas queremos trazer (evitando desperdício de memória e tráfego de disco).
- Filtrar registros usando critérios lógicos refinados com a cláusula `WHERE` (como faixas de preços, termos parciais de busca ou combinações booleanas).
- Ordenar os dados em ordem crescente ou decrescente com `ORDER BY`.
- Limitar a quantidade de linhas retornadas com `LIMIT`.

No **Capítulo 11 (pp. 272–285)**, Nilo Menezes examina as estratégias do Python para consumir o conjunto de resultados (*result set*), comparando o consumo linha por linha com o carregamento integral em listas na memória.
