# Projeto Canônico: Arquitetura e Engenharia do Jogo da Forca

> *"O jogo da forca é um exemplo completo que integra praticamente todos os conceitos vistos até aqui: variáveis, listas, strings, laços while e for, condicionais, break e continue."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, pp. 156–160

---

### Visão Geral da Aula

O **Jogo da Forca** é o projeto culminante da primeira metade da obra de Nilo Menezes. Ele não é apenas um jogo recreativo em modo texto; é um estudo de caso arquitetural sobre como gerenciar o ciclo de vida e o estado de uma aplicação interativa.

Nesta aula, desconstruiremos:
1. **O Modelo de Estado do Jogo:** As variáveis de controle: `palavra` secreta, lista de `acertos`, lista de `erros` e o contador acumulativo.
2. **O Laço Principal (*Game Loop*):** A renderização visual das fases da forca ASCII em função da quantidade de erros cometidos (de $0$ a $6$ membros do corpo).
3. **A Reconstrução Visual da Senha:** Como transformar a palavra secreta em uma cadeia de letras reveladas e pontos de interrogação ou pontos (`.`).
4. **Condições de Término:** Como avaliar a vitória imediata quando a máscara coincide com a palavra completa e a derrota por enforcamento fatal.
