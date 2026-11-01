# Resumo da Unidade: Agregação e o Projeto Sistema Bancário

### Pontos Essenciais

1. **Agregação:** Padrão arquitetural em que objetos contêm referências a outros objetos como atributos (ex: `Conta` contém uma lista de objetos `Cliente`).
2. **Entidade Mestre `Banco`:** Centraliza a coleção de contas cadastradas e oferece operações consolidadas de listagem e balanço financeiro.
3. **Contas Conjuntas:** A modelagem de titulares como lista permite que contas individuais e conjuntas sejam tratadas pelo mesmo construtor de forma elegante.
4. **Métodos Mágicos:** `__len__`, `__getitem__` e `__str__` conferem às classes customizadas os mesmos comportamentos de coleções nativas da linguagem.
