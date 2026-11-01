# Resumo da Aula: Algoritmos como Tecnologia e o Duelo Computador A vs. Computador B

<p>Na análise de algoritmos, a base $2$ é tão onipresente que o livro adota a notação padrão $\lg n$ para denotar $\log_2 n$ (logaritmo na base $2$):</p>
            <ul>
              <li>Por definição, $\lg n = k \iff 2^k = n$. Assim, $\lg 1 = 0$, $\lg 2 = 1$, $\lg 8 = 3$, $\lg 1.024 = 10$ e $\lg 1.048.576 = 20$.</li>
              <li><strong>Interpretação algorítmica:</strong> Se você tem uma coleção de $n = 2^k$ elementos e a divide ao meio repetidamente até restarem subcoleções de apenas $1$ elemento, quantas divisões em série você fará? Exatamente $k = \lg n$ divisões! E quantos níveis terá a árvore que inclui tanto o nível original (tamanho $n$) quanto o nível das folhas (tamanho $1$)? Exatamente $\lg n + 1$ níveis.</li>
              <li><strong>Contraste de crescimento:</strong> Quando $n = 1.000$, temos $\lg n \approx 10$; quando $n = 1.000.000$ ($10^6$), $n$ multiplicou por mil, mas $\lg n$ apenas dobrou para $\approx 20$; para $n = 10^7$ (dez milhões), $\lg 10^7 \approx 23,25$. Essa compressão exponencial é o segredo por trás da eficiência de algoritmos de divisão e conquista.</li>
            </ul>
