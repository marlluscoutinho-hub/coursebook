### Síntese: A Estrutura de Pilha (LIFO)

1. **Princípio LIFO:** *Last In, First Out*. O último elemento empilhado é obrigatoriamente o primeiro a ser retirado.
2. **Eficiência Ótima:** Tanto `append(item)` (push) quanto `pop()` (pop sem índice) operam no final da lista em tempo constante $O(1)$, tornando a lista nativa de Python uma pilha perfeita.
3. **Validação de Sintaxe:** Pilhas são a ferramenta canônica para casar delimitadores abertos e fechados em analisadores sintáticos e compiladores.
4. **Dois Tipos de Falha:** Erro por fechamento precoce (tentativa de `pop` em pilha vazia) e erro por fechamento incompleto (pilha não vazia ao final da leitura).
