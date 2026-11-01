# O Construtor __init__ e a Semântica do Parâmetro Self

> *"O método __init__ será chamado sempre que criarmos objetos da classe... Todo método em Python tem self como primeiro parâmetro. Sempre que quisermos especificar atributos de objetos, devemos associá-los a self. Caso contrário, se escrevêssemos ligada=False, ligada seria apenas uma variável local do método, e não um atributo do objeto."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, pp. 217, 218

---

### Visão Geral da Aula

Em Python, a sintaxe de orientação a objetos possui uma assinatura visual inconfundível: todo método declarado dentro de uma classe começa com o parâmetro `self`. Para quem vem de linguagens como C++ ou Java (onde o ponteiro `this` é implícito e oculto), o `self` explícito pode parecer peculiar.

Nesta aula fundamental, você dominará:
1. **O Ciclo de Vida da Instanciação:** Como a chamada `tv = Televisao()` aciona automaticamente o construtor `__init__()`.
2. **A Semântica do `self`:** Compreender que `self` é a referência ao endereço do próprio objeto concreto recém-alocado que está executando aquele método.
3. **Atributo de Instância vs Variável Local:** O erro comum de esquecer o prefixo `self.` e como isso gera variáveis locais descartáveis em vez de campos persistentes do objeto.
4. **Passagem Implícita de Argumentos:** Por que escrevemos `tv.muda_canal()` sem passar argumentos, enquanto o método é definido como `def muda_canal(self):`.
