# Resumo da Unidade: Laboratório Bancário Orientado a Objetos

### Síntese Prática

1. **Validação Polimórfica:** O simulador demonstra visualmente que objetos de subclasses especializadas (`ContaEspecial`) substituem perfeitamente objetos da superclasse (`Conta`) executando suas próprias regras de limite sem que o chamador precise checar o tipo da conta.
2. **Extrato Analítico:** Métodos seletores projetam o estado histórico do objeto em relatórios amigáveis.
3. **Robustez com Métodos Mágicos:** Classes que implementam `__len__`, `__getitem__` e `__iter__` oferecem interfaces limpas idênticas às coleções embutidas do Python.
4. **Proteção de Tipos e Integridade:** A classe `ListaÚnica` ilustra como a POO permite encapsular coleções para impedir itens duplicados e tipos inválidos em tempo de execução.
