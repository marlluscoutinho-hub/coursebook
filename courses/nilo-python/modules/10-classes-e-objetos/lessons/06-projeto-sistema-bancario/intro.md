# Projeto Canônico: Agregação de Classes e o Sistema Bancário

> *"Podemos ter objetos como atributos de outros objetos... Uma conta pode ter um ou mais clientes associados, e um banco é uma classe que reúne e gerencia uma lista de clientes e uma lista de contas."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, pp. 221–235

---

### Visão Geral da Aula

Em projetos corporativos reais, os objetos não vivem isolados. Eles colaboram, relacionam-se e agrupam-se formando ecossistemas complexos. Dois conceitos fundamentais estruturam essas conexões: **agregação** (onde um objeto contém referências a outros objetos independentes) e **composição**.

Nesta aula arquitetural, conectaremos todas as peças do Capítulo 10 no projeto canônico do **Sistema Bancário**:
1. **A Classe `Cliente`:** Modelagem de pessoas físicas com nome e telefone (Exercício 10.6).
2. **Contas com Múltiplos Titulares:** Como uma `Conta` pode agregar uma lista de instâncias da classe `Cliente` (Exercício 10.8).
3. **A Classe `Banco`:** A entidade agregadora mestre que registra novos clientes, abre contas, localiza instâncias e emite o balanço consolidado de todas as contas cadastradas.
4. **Métodos Mágicos Fundamentais:** Introdução aos métodos especiais `__len__`, `__getitem__` e `__str__` na classe `ListaÚnica`.
