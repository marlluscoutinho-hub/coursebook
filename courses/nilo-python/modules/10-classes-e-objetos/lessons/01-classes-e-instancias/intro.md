# Modelagem de Entidades: Classes e Instâncias Independentes

> *"A programação orientada a objetos facilita a escrita e manutenção de nossos programas, utilizando classes e objetos. Classes são a definição de um novo tipo de dados que associa dados e operações em uma só estrutura. Um objeto pode ser entendido como uma variável cujo tipo é uma classe, ou seja, um objeto é uma instância de uma classe."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, p. 216

---

### Visão Geral da Aula

Na programação procedural que praticamos até agora, dados (listas, dicionários, números) e funções (procedimentos que operam sobre dados) existiam separados no código. A **Programação Orientada a Objetos (POO)** unifica estado e comportamento sob uma mesma abstração.

Nesta aula introdutória do Capítulo 10, você aprenderá:
1. **A Metáfora da Classe como Molde:** Como a instrução `class Televisao:` cria um novo tipo de dado definido pelo programador.
2. **Instanciação na Memória:** A criação física de múltiplos objetos independentes (`tv_sala = Televisao()`, `tv_quarto = Televisao()`).
3. **Independência de Atributos:** Por que alterar o canal de `tv_sala` não altera o canal de `tv_quarto`, demonstrando o isolamento de instâncias na memória heap.
