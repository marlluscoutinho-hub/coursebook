# Resumo da Unidade: O Construtor __init__ e o Parâmetro self

### Pontos Essenciais

1. **Construtor `__init__`:** Método mágico executado automaticamente no instante em que uma nova instância da classe é criada, configurando seus valores iniciais.
2. **Semântica do `self`:** Representa a própria instância em execução. A chamada `obj.metodo()` é traduzida internamente para `Classe.metodo(obj)`.
3. **Atributo vs Variável Local:** Sem o prefixo `self.`, atribuições dentro de métodos criam variáveis locais efêmeras que desaparecem no retorno da função.
4. **Persistência de Estado:** Atributos atrelados a `self.atributo` sobrevivem entre diferentes chamadas de métodos ao longo de toda a vida útil do objeto.
