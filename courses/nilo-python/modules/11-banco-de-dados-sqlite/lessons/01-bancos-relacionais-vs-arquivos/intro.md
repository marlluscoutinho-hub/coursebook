# Arquitetura de Dados: Bancos Relacionais vs. Arquivos Planos

No **Capítulo 9**, exploramos a manipulação de arquivos de texto e binários com as funções fundamentais `open()`, `read()` e `write()`. Embora arquivos planos permitam guardar informações entre execuções do programa, qualquer sistema mais complexo esbarra rapidamente em limites severos de desempenho, integridade e concorrência.

Imagine um sistema bancário ou uma agenda telefônica gravada em arquivo texto simples:
- Para atualizar o telefone de um único contato no meio de 100.000 linhas, você é forçado a ler o arquivo inteiro para a memória, reescrever todas as linhas anteriores, gravar a alteração e reescrever o restante em um novo arquivo temporário.
- Se o computador for desligado no exato milissegundo dessa regravação, o arquivo é corrompido e todos os dados são perdidos.
- Se dois usuários tentarem cadastrar clientes ao mesmo tempo, um sobrescreverá o trabalho do outro sem nenhum aviso.

No **Capítulo 11 (pp. 260–263)**, Nilo Ney Coutinho Menezes introduz a solução definitiva para esse problema: os **Sistemas Gerenciadores de Banco de Dados Relacionais (SGBD-R)** e, em especial, a biblioteca **SQLite3**, integrada nativamente ao interpretador Python.
