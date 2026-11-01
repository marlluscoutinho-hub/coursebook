# Laboratório Interativo: Simulador da Forca & Bancada de Strings

> *"Uma bancada interativa permite manipular visualmente réguas de fatiamento com índices positivos e negativos e jogar a forca com feedback gráfico instantâneo das partes do corpo desenhadas no cadafalso."*  
> — **Nilo Ney Coutinho Menezes**, *Capítulo 7*, pp. 137–160

---

### Visão Geral do Laboratório

Bem-vindo à bancada de experimentação do Módulo 07. Este laboratório interativo é composto por duas ferramentas integradas:

1. **Simulador Visual do Jogo da Forca Canônico:**
   - Permite jogar partidas completas escolhendo palavras secretas de diferentes tamanhos ou customizadas.
   - Atualiza a forca ASCII em tempo real conforme palpites errados são computados (de $0$ a $6$ erros).
   - Bloqueia letras repetidas, exibe histórico de tentativas e valida vitória e derrota.

2. **Régua de Fatiamento e Testador de Métodos:**
   - Exibe qualquer string digitada com réguas alinhadas de índices positivos $(0, 1, 2, \dots)$ e negativos $(-1, -2, -3, \dots)$.
   - Testa intervalos `S[início : fim : passo]` exibindo o resultado e comprimento da substring fatiada.
   - Executa métodos nativos (`upper`, `lower`, `find`, `count`, `replace`, `split`, `strip`, `isdigit`, etc.) com parâmetros customizados.
