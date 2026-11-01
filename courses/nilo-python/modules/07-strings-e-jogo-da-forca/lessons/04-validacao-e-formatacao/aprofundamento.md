# Aprofundamento Teórico: Validação Léxica e Idiomas de Controle

### 1. Métodos Predicados de Validação de Caracteres

Antes de converter uma entrada do usuário com `int()`, é fundamental validar se ela realmente consiste apenas em dígitos numéricos para evitar quebras por `ValueError`:

```python
entrada = "125"
if entrada.isdigit():
    numero = int(entrada)
else:
    print("Entrada inválida!")
```

| Método | Retorna `True` se: | Exemplo `True` | Exemplo `False` |
| :--- | :--- | :--- | :--- |
| `isalnum()` | Não vazio e todos os caracteres são letras ou dígitos. | `"Python3"` | `"Python 3!"` (tem espaço e !) |
| `isalpha()` | Não vazio e todos os caracteres são letras alfabéticas. | `"Nilo"` | `"Nilo123"` |
| `isdigit()` | Não vazio e todos os caracteres são dígitos decimais. | `"42"` | `"-5"`, `"3.14"` (sinais e pontos dão False) |
| `isupper()` | Contém ao menos uma letra e todas as letras são maiúsculas. | `"FORCA"` | `"Forca"` |
| `islower()` | Contém ao menos uma letra e todas as letras são minúsculas. | `"python"` | `"Python"` |

---

### 2. A Expressão Condicional Ternária (*Conditional Expression*)

Em Python (PEP 308), decisões simples de atribuição podem ser redigidas em forma de expressão:

$$X = \text{ValorVerdadeiro} \quad \mathbf{if} \quad \text{Condição} \quad \mathbf{else} \quad \text{ValorFalso}$$

No Jogo da Forca clássico (p. 158), Nilo Menezes utiliza este idioma para construir a representação visual da palavra oculta:

```python
# Abordagem imperativa clássica (4 linhas):
if letra in acertos:
    senha += letra
else:
    senha += "."

# Abordagem idiomática com operador ternário (1 linha):
senha += letra if letra in acertos else "."
```

Vantagens:
- Elimina variáveis temporárias intermediárias.
- Permite uso direto dentro de formatações de string e retornos de função:
  ```python
  print(f"Status: {'Aprovado' if nota >= 7.0 else 'Reprovado'}")
  ```

---

### 3. Controle Fino de Iteração: `continue`

Enquanto a instrução `break` interrompe e finaliza imediatamente o laço de repetição, a instrução `continue` interrompe apenas a iteração atual e salta imediatamente para o início do próximo ciclo:

```python
# Validação de palpites no Jogo da Forca:
while True:
    tentativa = input("\nDigite uma letra: ").lower().strip()
    
    if len(tentativa) != 1 or not tentativa.isalpha():
        print("Digite exatamente uma única letra válida!")
        continue  # Pula o restante do corpo do loop e volta para o input
        
    if tentativa in tentativas_anteriores:
        print("Você já tentou essa letra antes!")
        continue  # Evita descontar vidas por repetição acidental
        
    # Se passou pelas checagens de guarda, processa o palpite:
    tentativas_anteriores.append(tentativa)
    break
```

O uso de `continue` implementa o padrão de design conhecido como **Cláusulas de Guarda** (*Guard Clauses*), mantendo o código limpo ao tratar casos excepcionais logo no topo da iteração, evitando aninhamentos profundos de `if/else`.
