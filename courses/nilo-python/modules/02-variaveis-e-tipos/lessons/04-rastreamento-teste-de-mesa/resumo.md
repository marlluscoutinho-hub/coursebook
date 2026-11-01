### Síntese: Teste de Mesa e Rastreamento de Estado

1. **Definição e Finalidade:** O teste de mesa é a simulação analítica do interpretador no papel ou planilha, registrando a cada linha a instrução, as variáveis alteradas e a saída gerada.
2. **Padrão Acumulador:** Instruções como `divida = divida + compra` avaliam primeiro o lado direito com os valores atuais da memória para então atualizar a variável de destino.
3. **Armadilha da Sobrescrita:** Atribuir `a = b` sem salvar `a` destrói imediatamente o valor anterior. A troca correta exige uma variável intermediária auxiliar (`aux = a; a = b; b = aux`) ou desempacotamento idiomático (`a, b = b, a`).
4. **Hábito do Engenheiro:** Antes de debugar código complexo executando-o às cegas, rastrear 5 linhas na tabela de teste de mesa localiza 90% dos erros lógicos de inicialização e acumulação.
