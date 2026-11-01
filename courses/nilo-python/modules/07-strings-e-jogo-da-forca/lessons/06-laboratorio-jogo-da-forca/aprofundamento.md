# Guia de Operação e Experimentos Práticos do Laboratório

Para extrair o máximo de compreensão teórica e prática da bancada de strings, execute os seguintes passos guiados:

---

### Experimento 1: A Régua de Índices Positivos e Negativos

1. No painel **"2. Régua de Fatiamento & Métodos"**, observe a string base `PROGRAMACAO PYTHON`.
2. Observe na régua superior como cada caractere recebe simultaneamente:
   - Um índice verde positivo: `0` para `'P'`, `1` para `'R'`, até `17` para `'N'`.
   - Um índice vermelho negativo: `-18` para `'P'`, `-17` para `'R'`, até `-1` para `'N'`.
3. No campo de fatiamento:
   - Teste `inicio: 0`, `fim: 10`, `passo: 1` $\to$ resulta em `"PROGRAMACA"`.
   - Teste `inicio: -6`, `fim: 18`, `passo: 1` $\to$ extrai `"PYTHON"`.
   - Teste `inicio: 0`, `fim: 18`, `passo: 2` $\to$ extrai caracteres em posições alternadas.
   - Teste `inicio: 18`, `fim: 0`, `passo: -1` $\to$ inverte os caracteres da string!

---

### Experimento 2: Sandbox de Métodos Built-in

1. Selecione o método `.find(substring)` e digite `PYTHON` no parâmetro $\to$ retorno da expressão: `12` (índice inicial).
2. Digite `JAVA` no parâmetro de `.find()` $\to$ retorno: `-1`.
3. Selecione `.replace(antigo, novo)` e digite `PYTHON, RUST` $\to$ retorna `"PROGRAMACAO RUST"`.
4. Selecione `.split(separador)` e digite um espaço ` ` $\to$ retorna a lista `["PROGRAMACAO", "PYTHON"]`.

---

### Experimento 3: Ciclo Completo no Jogo da Forca

1. No painel **"1. Jogo da Forca Canônico"**, selecione a palavra `"PYTHON"`.
2. Tente a letra `A` (não existe em PYTHON):
   - A forca desenha a cabeça `O`.
   - O contador de erros avança para `1 / 6`.
3. Tente a letra `P`:
   - A palavra secreta atualiza para `P . . . . .`.
   - Os erros permanecem em `1 / 6`.
4. Tente novamente a letra `A`:
   - O laboratório emite aviso: *"Você já tentou a letra A!"* sem descontar vida adicional (cláusula de guarda).
5. Complete as letras restantes (`Y`, `T`, `H`, `O`, `N`) e observe a mensagem de vitória.
