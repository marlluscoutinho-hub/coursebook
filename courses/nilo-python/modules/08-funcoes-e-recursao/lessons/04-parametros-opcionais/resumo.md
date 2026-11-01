# Resumo da Unidade: Parâmetros Opcionais e Nomeados

### Pontos Essenciais

1. **Valores Padrão:** Parâmetros opcionais declaram um valor default no cabeçalho e devem obrigatoriamente figurar após os parâmetros obrigatórios.
2. **Argumentos Nomeados:** Invocação na forma `param=valor` desvincula a chamada da ordem posicional e documenta a semântica de cada argumento.
3. **Regra de Transição:** Argumentos posicionais não podem seguir argumentos nomeados na chamada da função.
4. **Armadilha do Padrão Mutável:** Nunca use listas ou dicionários literais como valores padrão (`lista=[]`); use `lista=None` e inicialize dentro da função.
5. **Reuso de Validação:** Isolar laços de validação em funções com parâmetros de faixa (`faixa_int`) elimina código duplicado de sanitização.
