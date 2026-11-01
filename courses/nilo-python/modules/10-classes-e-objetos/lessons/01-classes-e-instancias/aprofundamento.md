# Aprofundamento Teórico: O Paradigma de Objetos e Alocação na Heap

### 1. Classes vs Instâncias

Em termos de arquitetura de software:
- **Classe:** É a especificação conceitual, o molde ou planta arquitetônica (*blueprint*). Ela define quais atributos e métodos todas as instâncias daquele tipo possuirão.
- **Objeto (Instância):** É a entidade física viva alocada dinamicamente na memória heap do processo durante a execução do programa.

```python
# Definindo o novo tipo de dado:
class Televisao:
    pass

# Criando duas instâncias físicas distintas:
tv1 = Televisao()
tv2 = Televisao()

print(type(tv1))  # <class '__main__.Televisao'>
print(id(tv1) != id(tv2))  # True! Endereços de memória distintos
```

---

### 2. O Exemplo Canônico da Televisão (Listagem 10.1, p. 217)

Nilo Menezes introduz a modelagem a partir de um objeto doméstico simples: uma televisão possui estado (se está ligada e qual canal está sintonizado) e comportamento (ligar, desligar, mudar de canal).

```python
class Televisao:
    def __init__(self):
        self.ligada = False
        self.canal = 2

# Instanciação:
tv_sala = Televisao()
tv_quarto = Televisao()

# Alterando atributos de um objeto específico:
tv_sala.ligada = True
tv_sala.canal = 4

print(f"TV da Sala: ligada={tv_sala.ligada}, canal={tv_sala.canal}")
# TV da Sala: ligada=True, canal=4

print(f"TV do Quarto: ligada={tv_quarto.ligada}, canal={tv_quarto.canal}")
# TV do Quarto: ligada=False, canal=2
```

> [!NOTE]
> **Independência de Estado:**
> Cada objeto mantém seu próprio dicionário interno de atributos (`__dict__`). Mutações feitas nos campos de `tv_sala` não afetam em hipótese alguma o estado interno de `tv_quarto`.

---

### 3. Exercício 10.1: Expandindo com Marca e Tamanho

Para consolidar a independência de instâncias, podemos enriquecer a classe com características físicas adicionais:

```python
class Televisao:
    def __init__(self, marca, tamanho):
        self.ligada = False
        self.canal = 2
        self.marca = marca
        self.tamanho = tamanho

tv1 = Televisao("Sony", 55)
tv2 = Televisao("LG", 42)

print(f"Aparelho 1: {tv1.marca} de {tv1.tamanho} polegadas.")
print(f"Aparelho 2: {tv2.marca} de {tv2.tamanho} polegadas.")
```
Essa separação entre o molde genérico e os dados concretos é o alicerce que permite que softwares lidem com milhões de usuários, contas e registros usando o mesmo código.
