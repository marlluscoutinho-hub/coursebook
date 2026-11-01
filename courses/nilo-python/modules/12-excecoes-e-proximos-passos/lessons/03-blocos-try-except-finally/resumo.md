# Síntese da Unidade: Tratamento Defensivo e raise

### Pontos Fundamentais
1. **Bloco `try`:** Envolve instruções críticas sujeitas a falhas externas de I/O, rede ou conversão de tipos.
2. **Bloco `except Tipo as erro`:** Captura exclusivamente as exceções declaradas, mantendo o processo vivo e executando ações de recuperação.
3. **Bloco `else`:** Executado somente quando nenhuma exceção for lançada dentro do bloco `try`.
4. **Bloco `finally`:** Executado incondicionalmente em qualquer cenário (sucesso, erro ou retorno antecipado), sendo perfeito para liberar recursos físicos.
5. **Evite `except:` Nu:** Nunca capture exceções genericamente sem especificar a classe de erro, sob pena de mascarar falhas graves de sistema e digitação.
6. **Instrução `raise`:** Lança exceções intencionalmente para interromper operações que violem regras de negócio ou invariantes do domínio.
