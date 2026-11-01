# Resumo da Unidade: Manipulação do Sistema de Arquivos e os.walk

### Pontos Essenciais

1. **Portabilidade com `os.path.join`:** Garante concatenação de caminhos compatível com as regras de barras do Linux, macOS e Windows.
2. **Inspeção de Metadados:** `os.path.exists()`, `os.path.isfile()`, `os.path.isdir()` e `os.path.getsize()` validam e quantificam arquivos no disco.
3. **Mecânica de `os.walk`:** Um gerador recursivo que devolve tuplas `(raiz, diretorios, arquivos)` a cada nível da árvore sem estourar a memória.
4. **Operações no File System:** `os.mkdir()` (criação), `os.rmdir()` (remoção de pastas vazias) e `os.remove()` (exclusão de arquivos).
