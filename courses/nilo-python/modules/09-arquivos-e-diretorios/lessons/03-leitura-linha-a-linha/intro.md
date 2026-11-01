# Estratégias de Leitura: Read, Readlines e Iteradores em Memória

> *"Podemos ler um arquivo inteiro de uma só vez ou linha a linha... Em programas reais com arquivos de centenas de megabytes ou gigabytes, a escolha do método de leitura define se o programa consumirá alguns kilobytes de memória ou se causará o esgotamento total da memória do computador."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, pp. 190–194

---

### Visão Geral da Aula

Ao ler dados de arquivos de log, cadastros ou bases de dados em formato texto, o desenvolvedor dispõe de múltiplos métodos na API do Python: `read()`, `readline()`, `readlines()` e a iteração direta `for linha in arquivo:`.

Nesta aula, analisaremos:
1. **`f.read()`:** Leitura monolítica de todo o conteúdo em uma única e gigantesca string.
2. **`f.readlines()`:** Leitura que carrega todas as linhas em uma lista de strings na memória RAM.
3. **`f.readline()`:** Leitura sob demanda (*lazy*), puxando uma linha por vez até o caractere `\n`.
4. **O Iterador Idiomático `for linha in f:`:** A melhor prática do Python moderno, com consumo de memória constante $O(1)$, capaz de processar arquivos de qualquer tamanho (mesmo terabytes) linha a linha sem sobrecarregar o sistema operacional.
