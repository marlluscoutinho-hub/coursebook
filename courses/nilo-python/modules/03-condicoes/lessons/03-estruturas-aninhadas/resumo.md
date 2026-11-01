### Síntese: Condições Aninhadas

1. **Hierarquia de Decisão:** Permite criar árvores lógicas onde ramificações secundárias só são avaliadas se a ramificação primária for confirmada.
2. **Profundidade de Indentação:** Cada camada aninhada adiciona 4 espaços de recuo. É crucial manter o alinhamento visual para não confundir o fechamento de blocos.
3. **Economia Lógica:** Em cadeias escalonadas (`else: if ...`), condições já descartadas no nível superior não precisam ser repetidas na subcondição.
4. **Legibilidade vs. Complexidade:** Embora aninhar 2 níveis seja comum, aninhar 4 ou 5 níveis gera o antipadrão da "pirâmide da perdição", cuja solução canônica em Python é a cláusula `elif`.
