# Resumo da Unidade: Modos de Abertura e Gerenciador de Contexto

### Pontos Essenciais

1. **Ciclo de Persistência:** A manipulação de arquivos demanda abertura com `open()`, operações de leitura/escrita e fechamento para sincronizar buffers com o disco.
2. **Diferença de Modos:** `"r"` (leitura, exige arquivo existente), `"w"` (gravação destrutiva com truncamento a zero), e `"a"` (anexação no final preservando dados anteriores).
3. **Encoding Universal:** O parâmetro `encoding="utf-8"` deve sempre ser especificado para assegurar compatibilidade de acentos entre sistemas operacionais heterogêneos.
4. **Gerenciador de Contexto `with`:** A sintaxe `with open(...) as f:` assegura o fechamento automático e determinístico do arquivo, eliminando vazamento de recursos e corrupção de dados.
