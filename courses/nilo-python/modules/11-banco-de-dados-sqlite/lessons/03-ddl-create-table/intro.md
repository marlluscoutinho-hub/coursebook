# Linguagem de Definição de Dados (DDL): CREATE TABLE e Tipos do SQLite

A linguagem SQL (*Structured Query Language*) é dividida em subconjuntos especializados. O primeiro que encontramos ao projetar uma aplicação é a **DDL (Data Definition Language)**, responsável por criar, modificar ou excluir a estrutura do esquema do banco de dados (tabelas, índices e visões).

Antes de inserir qualquer nome ou número de telefone, o banco precisa saber:
- Qual é o nome da tabela?
- Quais colunas ela conterá?
- Qual é o tipo de dado admitido em cada coluna?
- Existe algum identificador exclusivo para cada registro?

No **Capítulo 11 (pp. 266–268)**, Nilo Menezes constrói o primeiro programa Python que cria uma tabela de contatos (`agenda`), demonstrando como o comando `CREATE TABLE` define o alicerce para todos os dados que serão manipulados a seguir.
