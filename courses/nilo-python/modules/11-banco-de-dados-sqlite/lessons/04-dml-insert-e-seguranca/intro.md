# DML: INSERT INTO, Parâmetros Seguros '?' e Prevenção de SQL Injection

Com a estrutura da tabela pronta, entramos no subconjunto da **DML (Data Manipulation Language)**, que agrupa os comandos responsáveis por incluir, consultar, atualizar e excluir os dados propriamente ditos.

O comando `INSERT INTO` adiciona uma nova linha à tabela. Contudo, ao integrar dados digitados por usuários (via `input()` ou formulários web) em comandos SQL, muitos programadores cometem o erro mais grave da segurança de software: **concatenar strings** diretamente na instrução SQL.

Essa prática abre as portas para o ataque de **Injeção de SQL (SQL Injection)**, uma falha que permite a invasores ler tabelas sigilosas, alterar dados sem autorização ou apagar o banco inteiro com um único comando.

No **Capítulo 11 (pp. 268–272)**, Nilo Menezes ensina a regra de ouro do desenvolvimento profissional: utilizar **parâmetros com interrogação `?`**, delegando ao interpretador do SQLite a garantia de imunidade contra qualquer dado malicioso.
