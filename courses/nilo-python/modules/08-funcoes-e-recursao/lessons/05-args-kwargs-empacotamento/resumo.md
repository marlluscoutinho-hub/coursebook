# Resumo da Unidade: Parâmetros Variádicos (*args e **kwargs)

### Pontos Essenciais

1. **`*args` (Tupla Posicional):** Agrupa um número indeterminado de argumentos posicionais excedentes em uma tupla imutável.
2. **`**kwargs` (Dicionário Nomeado):** Agrupa quaisquer argumentos nomeados adicionais passados na chamada em um dicionário (`dict`).
3. **Desempacotamento na Invocação:** O uso de `*lista` expande elementos como argumentos posicionais separados e `**dicionario` expande pares chave-valor como argumentos nomeados.
4. **Assinatura Universal:** A combinação `def func(*args, **kwargs):` viabiliza funções genéricas de roteamento, interceptação (*proxies*) e decoradores.
