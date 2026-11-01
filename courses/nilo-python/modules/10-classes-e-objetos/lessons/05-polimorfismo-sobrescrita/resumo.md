# Resumo da Unidade: Polimorfismo e Sobrescrita

### Pontos Essenciais

1. **Polimorfismo:** A capacidade de tratar objetos de diferentes classes derivadas através de uma interface de métodos compartilhada e homogênea.
2. **Sobrescrita de Métodos (*Override*):** A redefinição de um método na subclasse que substitui ou estende o comportamento da superclasse.
3. **Despacho Dinâmico:** O interpretador resolve em tempo de execução qual versão do método executar com base na classe real referenciada por `self`.
4. **Isolamento de Condições:** Decompor a lógica de autorização em métodos predicados (`pode_sacar()`) viabiliza herança limpa sem duplicar o algoritmo central de transações.
