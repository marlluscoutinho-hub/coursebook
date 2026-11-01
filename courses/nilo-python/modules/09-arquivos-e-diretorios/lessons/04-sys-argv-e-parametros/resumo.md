# Resumo da Unidade: Linha de Comando com sys.argv

### Pontos Essenciais

1. **Módulo `sys.argv`:** Uma lista de strings fornecida pelo Python contendo os argumentos passados pelo shell na execução do programa.
2. **Índice Zero:** `sys.argv[0]` armazena o nome ou caminho do próprio script em execução.
3. **Tipo Texto Obrigatório:** Todos os valores recebidos via linha de comando são do tipo `str` e exigem conversão explícita caso representem números.
4. **Validação e `sys.exit()`:** Verificar `len(sys.argv)` evita quebras por `IndexError`. O comando `sys.exit(codigo)` aborta a execução retornando códigos de status ao sistema operacional.
