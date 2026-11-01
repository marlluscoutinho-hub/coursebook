### Síntese: O Laço while

1. **Repetição Condicional:** O comando `while` reexecuta seu bloco de código enquanto a expressão de cabeçalho permanecer verdadeira (`True`).
2. **Ciclo de Loopback:** Ao concluir a última linha do bloco indentado, o fluxo salta automaticamente de volta ao teste inicial de condição.
3. **Tríade Obrigatória:** Todo laço seguro requer: (1) inicialização da variável antes do laço, (2) teste relacional na condição, e (3) atualização monótona dentro do corpo repetido.
4. **Prevenção de Travamentos:** Omitir a linha de incremento gera um laço infinito, exigindo interrupção forçada com `Ctrl + C`.
