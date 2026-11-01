# Resumo da Unidade: Estratégias de Leitura e Consumo de Memória

### Pontos Essenciais

1. **`f.read()` e `f.readlines()`:** Eficientes apenas para arquivos pequenos. Em arquivos volumosos, causam `MemoryError` ao carregar tudo de uma vez na memória RAM.
2. **`f.readline()`:** Recupera uma linha por vez até alcançar o final do arquivo (quando retorna `""`).
3. **Iteração Idiomática `for linha in f:`:** O método mais eficiente em memória ($O(1)$), puxando linhas sob demanda através de buffers de streaming.
4. **Tratamento de Quebras:** Linhas lidas retêm o `\n` original no final; a remoção é realizada via `.rstrip("\n")` ou `.strip()`.
5. **Múltiplos Gerenciadores:** A sintaxe `with open(...) as a, open(...) as b:` gerencia múltiplos arquivos abertos concomitantemente de forma atômica.
