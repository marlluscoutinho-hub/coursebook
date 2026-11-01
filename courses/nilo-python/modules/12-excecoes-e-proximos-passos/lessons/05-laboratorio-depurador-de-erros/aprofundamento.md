# Roteiro Experimental de Depuração e Código Pythonico

Para extrair o valor didático máximo da bancada interativa abaixo, siga os experimentos propostos:

---

### Experimento 1: Leitura Reversa de Traceback
1. Na aba **"🔍 Anatomia de Exceções & Try/Except"**, clique no botão **ZeroDivisionError**.
2. Olhe primeiro para a caixa preta e vermelha inferior: note o nome da exceção e a mensagem de diagnóstico (`division by zero`).
3. Em seguida, suba os olhos para a penúltima linha: localize o arquivo `calculadora.py` e a linha 2.
4. Leia o painel de **Causa Raiz** e **Solução** para compreender a lógica subjacente ao erro.

---

### Experimento 2: A Mágica do Bloco try / except
1. No mesmo cenário de erro, clique no botão superior direito: **"⚠️ Sem Tratamento (Erro Fatal)"**.
2. Veja o botão mudar para verde: **"✅ Com try / except (Tratado)"**.
3. Observe como o código é envolvido em uma malha de segurança que intercepta `ZeroDivisionError`, imprime uma mensagem de contingência e garante que o bloco `finally` seja executado sem derrubar o programa.
4. Repita esse procedimento para os cenários de `IndexError` (tentativa de acessar índice 3 em lista de 3 elementos) e `KeyError` (consulta de chave inexistente em dicionário).

---

### Experimento 3: Explorando Compreensão de Listas
1. Clique no botão superior da barra de navegação: **"⚡ List Comprehensions & PEP 8"**.
2. Alterne entre os três exemplos canônicos:
   - **Exemplo 1 (Quadrados dos Pares):** Demonstra como o `if x % 2 == 0` atua como filtro antes do mapeamento `x**2`.
   - **Exemplo 2 (Nomes em Caixa Alta):** Aplica métodos de string e filtro de comprimento em texto.
   - **Exemplo 3 (Reajuste de Preços):** Aplica cálculos matemáticos e arredondamento `round()` com filtro condicional de valor.
3. Observe as diretrizes da PEP 8 na coluna lateral e memorize as convenções oficiais de nomenclatura (`snake_case`, `PascalCase` e `UPPER_CASE`).
