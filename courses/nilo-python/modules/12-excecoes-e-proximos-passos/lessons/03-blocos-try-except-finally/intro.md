# Tratamento Defensivo: Blocos try, except, else, finally e raise

Em um ambiente de produção real, programas não operam no vácuo de laboratório. Usuários digitam letras onde se esperam números, conexões de internet caem no meio do download e arquivos em disco são renomeados por outros processos.

Se o seu programa não estiver preparado para essas contingências, ele será abortado imediatamente pelo sistema operacional, frustrando o usuário e arriscando perder dados não gravados.

O mecanismo de **Tratamento de Exceções** do Python permite interceptar essas falhas no instante em que acontecem, executar um plano de contingência gracioso e manter a aplicação funcionando com total estabilidade.

No **Capítulo 12 (pp. 314–317)**, Nilo Menezes apresenta a estrutura defensiva completa: os blocos `try`, `except`, `else` e `finally`, além da instrução `raise` para impor regras de negócio intransigentes.
