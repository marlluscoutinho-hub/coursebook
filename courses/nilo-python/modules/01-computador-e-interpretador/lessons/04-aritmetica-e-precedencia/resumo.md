# Resumo da Aula: Operadores Aritméticos e Ordem Algébrica de Avaliação

<p>Python atua como uma calculadora científica de alta precisão. Os operadores fundamentais dividem-se em:</p>
          <ul>
            <li>Adição (<code>+</code>) e Subtração (<code>-</code>)</li>
            <li>Multiplicação (<code>*</code>) e Divisão real (<code>/</code>, que sempre retorna um valor de ponto flutuante)</li>
            <li>Exponenciação (<code>**</code>, dois asteriscos adjacentes sem espaço)</li>
            <li>Módulo / Resto da divisão inteira (<code>%</code>) e Divisão de chão (<code>//</code>)</li>
          </ul>
          <p>A precedência segue a álgebra matemática estrita: <strong>1º Exponenciação (<code>**</code>)</strong> $\to$ <strong>2º Multiplicação, Divisão e Resto (<code>*</code>, <code>/</code>, <code>%</code>)</strong> $\to$ <strong>3º Adição e Subtração (<code>+</code>, <code>-</code>)</strong>. Operadores de mesma prioridade são avaliados da esquerda para a direita, e os parênteses <code>( )</code> são os únicos modificadores universais da ordem de avaliação.</p>
