# Resumo da Unidade: Laboratório Bubble Sort e Dicionários

### Síntese Prática

1. **Visualização Algorítmica:** O Bubble Sort depende do decrescimento sistemático do ponteiro `fim` e da flag `trocou`. A animação passo a passo elucida como o maior elemento flutua progressivamente até sua posição definitiva à direita.
2. **Eficiência no Rastreamento:** Em listas já ordenadas, a flag `trocou` evita passagens adicionais redundantes, reduzindo o tempo de execução de $O(N^2)$ para $O(N)$.
3. **Mapeamento Associativo:** Dicionários eliminam laços lineares de busca (`for produto in lista`) substituindo-os por lookups diretos de tempo constante médio $O(1)$.
4. **Baixa Atômica:** Em sistemas de estoque, a integridade referencial exige verificar previamente a existência da chave (`if item in estoque:`) antes de subtrair unidades e calcular o custo total acumulado.
