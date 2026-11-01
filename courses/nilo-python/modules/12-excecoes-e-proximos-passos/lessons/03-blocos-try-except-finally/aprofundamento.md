# Arquitetura de Tratamento de Exceções em Python

## 1. O Fluxo de Controle Completo: try, except, else e finally

A estrutura formal de interceptação de exceções em Python é composta por quatro blocos integrados:

```python
try:
    # 1. Código arriscado que pode lançar exceções (ex: I/O, rede, conversões)
    divisor = int(input("Digite o divisor: "))
    resultado = 100 / divisor

except ValueError as erro:
    # 2. Executado se o usuário digitar algo que não seja número inteiro
    print(f"Erro de valor: Entrada inválida ({erro}).")

except ZeroDivisionError:
    # 3. Executado se o usuário digitar o número 0
    print("Erro aritmético: Impossível dividir por zero!")

else:
    # 4. Executado EXCLUSIVAMENTE se NENHUMA exceção tiver ocorrido no bloco try!
    print(f"Sucesso! Resultado da divisão: {resultado:.2f}")

finally:
    # 5. Executado SEMPRE, independentemente de ter ocorrido erro ou sucesso!
    print("Fim do ciclo de operação (fechamento e liberação garantidos).")
```

### O Papel Insubstituível do Bloco `finally`
Mesmo que o bloco `try` execute uma instrução `return`, `sys.exit()` ou encontre um erro não capturado pelo `except`, o bloco `finally` é **obrigatoriamente executado** antes que o controle saia da função. Por isso, ele é o local canônico para:
- Fechar conexões de banco de dados (`conexao.close()`).
- Fechar descritores de arquivos abertos (`arquivo.close()`).
- Liberar travas de exclusão mútua (*locks*).

---

## 2. A Captura Seletiva vs. O Perigo do `except:` Vazio

Um dos piores antipadrões em programação Python é o chamado *Bare Except*:

```python
# ❌ ANTIPADRÃO TERRÍVEL: NUNCA USE EXCEPT SEM TIPO ESPECÍFICO!
try:
    processa_dados()
except:
    print("Algo deu errado...")
```

### Por Que Esse Código é Destrutivo?
1. Ele captura exceções críticas do sistema que **nunca deveriam ser silenciadas**, como `KeyboardInterrupt` (quando o usuário aperta Ctrl+C no terminal para parar o script) e `SystemExit`.
2. Se você cometer um erro de digitação simples dentro de `processa_dados()` (como escrever `prnt()` em vez de `print()`, gerando um `NameError`), o programa silenciará o erro e continuará rodando em estado corrompido!

> [!IMPORTANT]
> **Regra de Ouro:** Declare sempre os tipos exatos de exceções que você realmente sabe como tratar:
> `except (ValueError, FileNotFoundError) as erro:`

---

## 3. Disparando Exceções Deliberadamente com `raise`

Nem todo erro decorre de limitações técnicas do computador. Muitas vezes, uma operação é matematicamente viável para a CPU, mas **inaceitável segundo as regras de negócio da aplicação** (ex.: cadastrar uma pessoa com idade negativa ou sacar mais do que o saldo permitido).

Para sinalizar essas violações, usamos a instrução `raise`:

```python
def cadastra_usuario(nome, idade):
    if not nome or not nome.strip():
        raise ValueError("O nome do usuário não pode ser vazio ou conter apenas espaços.")
    if idade < 0 or idade > 130:
        raise ValueError(f"Idade inválida informada: {idade}. Deve estar entre 0 e 130 anos.")
    
    return {"nome": nome.strip(), "idade": idade}

try:
    usuario = cadastra_usuario("Carlos", -5)
except ValueError as falha:
    print(f"Cadastro rejeitado: {falha}")
```

Com o `raise`, você transforma violações silenciosas de regras em alertas explícitos e auditáveis.
