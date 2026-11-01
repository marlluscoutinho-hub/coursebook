# Aprofundamento Teórico: Tokenização com `split()` e Higienização de Dados

Processar dados brutos exige transformar fluxos de texto livre em tokens bem delimitados. Os métodos `split()`, `replace()` e `strip()` formam o pipeline clássico de ETL (*Extract, Transform, Load*) em scripts de análise de dados em Python.

---

### 1. Tokenização e Delimitadores com `split()`

O método `.split([sep])` fragmenta a string original e retorna uma lista de strings:

```python
s = "um tigre, dois tigres, três tigres"

# Dividindo por vírgula:
partes_virgula = s.split(",")
print(partes_virgula)
# ['um tigre', ' dois tigres', ' três tigres']

# Dividindo por espaço explícito:
partes_espaco = s.split(" ")
print(partes_espaco)
# ['um', 'tigre,', 'dois', 'tigres,', 'três', 'tigres']

# Dividindo sem parâmetros (espaço em branco genérico):
partes_padrao = s.split()
print(partes_padrao)
```

> [!NOTE]
> **A Mágica do `split()` sem parâmetros:**
> Quando chamado sem nenhum argumento `s.split()`, o Python agrupa sequências consecutivas de múltiplos espaços em branco, tabulações `\t` e quebras de linha `\n` como um único delimitador e descarta espaços vazios nas pontas. Isso é perfeito para higienizar entradas humanas.

Para strings com múltiplas linhas, o método `.splitlines()` preserva e divide pelos limites de linha universais (`\n`, `\r\n`):
```python
poema = "Primeiro verso\nSegundo verso\nTerceiro verso\n"
linhas = poema.splitlines()
print(linhas)  # ['Primeiro verso', 'Segundo verso', 'Terceiro verso']
```

---

### 2. Substituição Atômica com `replace()`

O método `.replace(antigo, novo, [contagem])` cria uma nova string substituindo ocorrências da substring `antigo` pelo valor `novo`:

```python
s = "um tigre, dois tigres, três tigres"

# Substituição global:
print(s.replace("tigre", "gato"))
# "um gato, dois gatos, três gatos"

# Substituição limitada pela contagem:
print(s.replace("tigre", "gato", 1))
# "um gato, dois tigres, três tigres"

# Remoção de caracteres (substituindo por string vazia):
print(s.replace(",", ""))
# "um tigre dois tigres três tigres"
```

---

### 3. Remoção de Ruído com a Família `strip()`

Frequentemente, entradas de usuários (`input()`) ou linhas lidas de arquivos contêm espaços acidentais ou o caractere de nova linha `\n` no final. A família `strip` remove esses ruídos de forma não destrutiva:

```python
suja = "   \n\t  Dados Importantes   \r\n "
limpa = suja.strip()
print(f"'{limpa}'")  # 'Dados Importantes'

# lstrip remove apenas à esquerda; rstrip remove apenas à direita:
print(f"'{suja.lstrip()}'")  # Remove apenas o início
print(f"'{suja.rstrip()}'")  # Remove apenas o fim
```

Podemos também passar um conjunto de caracteres customizados a serem removidos das bordas:

```python
url_suja = "...///https://site.com/artigo///..."
print(url_suja.strip("./"))  # 'https://site.com/artigo'
```
Essa chamada varre as pontas e elimina consecutivamente qualquer caractere presente no conjunto `"./"`.
