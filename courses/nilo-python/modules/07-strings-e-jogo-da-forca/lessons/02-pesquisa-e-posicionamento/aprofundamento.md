# Aprofundamento Teórico: Métodos de Inspeção e Posicionamento em Strings

### 1. Prefixo, Sufixo e a Regra do Case Folding

Os métodos `startswith` e `endswith` realizam verificações booleanas de substrings posicionais:

```python
nome = "João da Silva"
print(nome.startswith("João"))   # True
print(nome.startswith("joão"))   # False (Case-sensitive!)
print(nome.endswith("Silva"))    # True
```

Para realizar buscas ou verificações insensíveis a maiúsculas e minúsculas (*case-insensitive*), a boa prática é normalizar a string com `.lower()` ou `.upper()` antes da checagem:

```python
# Verificação segura sem distinção de caixa:
frase = "O Rato roeu a roupa do Rei de Roma"
print(frase.lower().startswith("o rato"))  # True
print("roma" in frase.lower())             # True
```

---

### 2. Contagem Quantitativa: `count()`

O método `.count(sub)` varre a string e conta o número de ocorrências não sobrepostas da substring pesquisada:

```python
texto = "um tigre, dois tigres, três tigres"
print(texto.count("tigre"))   # 3
print(texto.count("tigres"))  # 2
print(texto.count("t"))       # 4
print(texto.count("z"))       # 0 (não encontrado)
```

---

### 3. Localização: `find()` vs `index()`

Quando precisamos saber a coordenada exata em que uma palavra ou caractere aparece pela primeira vez, Python oferece duas abordagens com comportamentos de erro totalmente distintos:

```python
s = "Alô mundo"
pos = s.find("mun")
print(pos)  # 4 (o 'm' está no índice 4)

pos_inexistente = s.find("python")
print(pos_inexistente)  # -1 (convenção clássica para não encontrado)
```

Por outro lado, o método `index()` realiza a mesma busca, mas quando a substring não existe, ele lança uma exceção:

```python
s = "Alô mundo"
try:
    print(s.index("python"))
except ValueError as e:
    print("Capturado ValueError: substring not found")
```

Existe também a variação `rfind()` e `rindex()`, que iniciam a pesquisa da direita para a esquerda (*reverse find*), retornando a última ocorrência da substring.

---

### 4. Alinhamento Espacial: `center()`, `ljust()`, `rjust()`

Para criar tabelas alinhadas em consoles e relatórios texto puro sem recorrer a bibliotecas pesadas de terceiros, utilizamos os métodos de alinhamento:

```python
titulo = "RELATÓRIO FINANCEIRO"

# Centralizar em 40 colunas preenchendo com traços
print(titulo.center(40, "="))
# =========RELATÓRIO FINANCEIRO=========

# Alinhamento à esquerda e à direita com preenchimento
produto = "Tomate"
preco = "R$ 2.30"
print(produto.ljust(20, ".") + preco.rjust(10, " "))
# Tomate..............   R$ 2.30
```
Essa técnica garante legibilidade estética em terminais modo texto e interfaces no estilo Paper & Ink.
