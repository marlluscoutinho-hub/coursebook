# Resumo da Aula: Ordenação por Inserção, Convenções de Pseudocódigo e Invariantes de Laço

<p>Quando um laço <code>for</code> ou <code>while</code> executa na máquina de acesso aleatório (RAM), o tempo total gasto é proporcional à soma das execuções de cada linha. Duas regras algébricas serão usadas diretamente no Capítulo 2:</p>
            <ul>
              <li><strong>O teste do cabeçalho do laço executa uma vez a mais que o corpo:</strong> Se um laço <code>for j = 2 to n</code> termina normalmente, o corpo executa para $j = 2, 3, \dots, n$ (totalizando $n - 1$ vezes), mas o teste no cabeçalho também é avaliado quando $j = n + 1$ (momento em que falha e encerra o laço), totalizando $(n - 1) + 1 = n$ avaliações!</li>
              <li><strong>Fórmulas de Gauss para somatórios lineares:</strong> Sabemos que $\sum_{k=1}^{n} k = \frac{n(n+1)}{2}$. Consequentemente, no Capítulo 2 encontraremos duas variantes diretas (quando $j$ varia de $2$ até $n$):
                $$\sum_{j=2}^{n} j = \left(\sum_{j=1}^{n} j\right) - 1 = \frac{n(n+1)}{2} - 1 \qquad \text{e} \qquad \sum_{j=2}^{n} (j - 1) = \sum_{k=1}^{n-1} k = \frac{n(n-1)}{2}$$
                Observe que ambas as somas são polinômios de segundo grau em $n$ (isto é, crescem proporcionalmente a $\frac{1}{2}n^2$).</li>
            </ul>
