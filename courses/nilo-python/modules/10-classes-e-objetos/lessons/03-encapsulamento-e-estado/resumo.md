# Resumo da Unidade: Encapsulamento e Invariantes de Estado

### Pontos Essenciais

1. **Invariantes de Estado:** Condições lógicas e regras de negócio que devem ser preservadas como verdadeiras durante todo o ciclo de vida do objeto.
2. **Encapsulamento:** A prática de isolar atributos internos e exigir que qualquer alteração de estado ocorra através de métodos com validação prévia.
3. **Controle de Transações:** Métodos mutadores como `saque()` e `deposito()` validam valores e registram histórico de eventos (`operacoes`) de forma atômica.
4. **Delegação de Checagem:** Métodos auxiliares de validação (como `pode_sacar()`) modularizam as condições de autorização, facilitando extensões futuras.
