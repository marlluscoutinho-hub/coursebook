# A Estrutura Anatômica do Traceback no CPython

## 1. A Regra de Ouro: Leia Sempre de Baixo para Cima

Considere o seguinte programa Python com três chamadas encadeadas de função:

```python
# arquivo: sistema.py
def formata_valor(valor):
    return "R$ " + valor.strip()  # Linha 3: Supondo que valor seja str

def processa_item(preco):
    return formata_valor(preco)   # Linha 6

def executa():
    preco_produto = 45.0          # float, não str!
    processa_item(preco_produto)  # Linha 10

executa()                         # Linha 12
```

Ao executar este script, o CPython produz a seguinte saída no terminal:

```text
Traceback (most recent call last):
  File "sistema.py", line 12, in <module>
    executa()
  File "sistema.py", line 10, in executa
    processa_item(preco_produto)
  File "sistema.py", line 6, in processa_item
    return formata_valor(preco)
  File "sistema.py", line 3, in formata_valor
    return "R$ " + valor.strip()
AttributeError: 'float' object has no attribute 'strip'
```

### Análise Forense Passo a Passo (De Baixo para Cima):

1. **Etapa 1 (A Última Linha): O Diagnóstico Final**
   - `AttributeError: 'float' object has no attribute 'strip'`
   - Revela a natureza exata da falha: o método `.strip()` pertence a strings (`str`), mas foi invocado sobre um número de ponto flutuante (`float`).

2. **Etapa 2 (A Penúltima Linha): O Epicentro do Erro**
   - `File "sistema.py", line 3, in formata_valor`
   - Aponta a linha exata do código onde a tentativa inválida ocorreu e o nome da função ativa.

3. **Etapa 3 (As Linhas Superiores): A Pilha de Chamadas (Call Stack)**
   - Mostra como o fluxo do programa chegou até ali:
     - O módulo principal chamou `executa()` na linha 12.
     - `executa()` chamou `processa_item()` na linha 10.
     - `processa_item()` chamou `formata_valor()` na linha 6.
   - Isso permite identificar que a raiz do problema não está na linha 3 (que esperava receber uma string), mas sim na linha 9 dentro de `executa()`, onde um número `float` foi passado indevidamente.

---

## 2. Erros em Tempo de Compilação vs. Erros em Tempo de Execução

É crucial distinguir as duas fases em que um erro pode se manifestar:

| Categoria | Momento de Ocorrência | Exemplos Canônicos | Comportamento do Interpretador |
| :--- | :--- | :--- | :--- |
| **Erro de Sintaxe** (*Compile Time*) | Antes do programa iniciar a execução de qualquer linha. | `SyntaxError`, `IndentationError` | O analisador gramatical (*parser*) do Python rejeita o código. Nenhuma instrução prévia é executada, mesmo que esteja correta. |
| **Exceção em Tempo de Execução** (*Runtime*) | Durante o fluxo normal de processamento. | `ZeroDivisionError`, `IndexError`, `TypeError`, `ValueError` | O programa roda normalmente até atingir o estado inválido. Se não houver tratamento com `try/except`, o processo é abortado. |

---

## 3. O Ciclo Metódico de Depuração (Debugging)

Para depurar qualquer programa com eficiência profissional, adote o ciclo de três fases recomendado por Nilo Menezes:

1. **Reproduzir o Erro:** Encontre a combinação mínima de dados ou entradas de usuário que desencadeia a falha repetidamente de forma determinística.
2. **Formular uma Hipótese:** Leia a última linha do traceback e pergunte-se: *"Qual era o tipo e o valor real da variável naquele exato instante?"*.
3. **Inspecionar e Corrigir:**
   - Adicione temporariamente impressões explicativas: `print(f"DEBUG: tipo={type(valor)}, valor={repr(valor)}")`.
   - Ou utilize o depurador interativo padrão do Python: `breakpoint()` ou `import pdb; pdb.set_trace()`.
   - Ajuste a lógica para validar os tipos ou tratar os casos limites e verifique se o erro desaparece sem criar efeitos colaterais.
