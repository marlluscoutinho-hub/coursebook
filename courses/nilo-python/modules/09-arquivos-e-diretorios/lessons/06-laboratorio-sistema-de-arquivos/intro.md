# Laboratório Interativo: Sistema de Arquivos Virtual, Seek/Tell & os.walk

> *"Um simulador visual do sistema de arquivos permite manipular em tempo real o cursor de seek e tell, alternar modos de abertura r, w e a, e observar o resultado imediato da navegação de diretórios com os.walk."*  
> — **Nilo Ney Coutinho Menezes**, *Capítulo 9*, pp. 188–215

---

### Visão Geral do Laboratório

Bem-vindo ao laboratório prático do Módulo 09. Esta bancada interativa oferece um ambiente seguro e controlado para experimentar as operações de baixo nível de arquivos em disco:

1. **Simulador do Ponteiro Físico (`seek` e `tell`):**
   - Abra arquivos virtuais nos modos `"w"` (escrita com truncamento), `"a"` (anexação no fim), `"r"` (leitura) ou `"r+"`.
   - Visualize a régua de bytes e a posição exata do cursor vermelho em tempo real.
   - Execute operações de `write()`, mova o cursor com `seek(offset)` e observe como o `read()` consome os dados a partir da posição atual até o fim do arquivo.

2. **Explorador de Árvore com `os.walk` & Gerador HTML:**
   - Execute uma simulação visual do `os.walk()` em uma árvore de projeto contendo pastas de código, documentos e submódulos.
   - Veja o resultado imediato da compilação de relatórios e tabelas geradas dinamicamente como páginas web HTML 5 com UTF-8.
