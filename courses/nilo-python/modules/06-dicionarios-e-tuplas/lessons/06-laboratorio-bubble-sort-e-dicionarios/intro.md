# Laboratório Interativo: Visualizador Bubble Sort & Gerenciador Hash

> *"O algoritmo Bubble Sort permite visualizar de maneira concreta a troca de elementos adjacentes e a flutuação do maior valor para o final do array. Ao mesmo tempo, dicionários transformam buscas lineares lentas em consultas instantâneas por chave."*  
> — **Nilo Ney Coutinho Menezes**, *Capítulo 6*, pp. 120–136

---

### Visão Geral do Laboratório

Bem-vindo ao laboratório prático do Módulo 06. Esta bancada interativa oferece dois simuladores integrados para consolidar a mecânica interna das estruturas estudadas:

1. **Simulador Visual de Bubble Sort:**
   - Permite carregar listas desordenadas pré-definidas (ou com valores repetidos e já ordenadas) ou digitar uma lista customizada.
   - Executa a ordenação **passo a passo**, exibindo os ponteiros de comparação $L[x]$ vs $L[x+1]$, o estado da flag booleana `trocou`, e as trocas com animação visual.
   - Conta passagens e trocas totais, evidenciando o caso médio $O(N^2)$ e o melhor caso $O(N)$ com interrupção antecipada.

2. **Gerenciador de Estoque e Tabela Hash:**
   - Adiciona, consulta e atualiza produtos em uma tabela associativa em tempo real.
   - Demonstra a prevenção de `KeyError` com verificação de chave prévia e simulação de baixas de estoque.
