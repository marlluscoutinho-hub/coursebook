# Manipulação de Diretórios, Caminhos Portáveis e os.walk

> *"A função os.walk facilita a navegação em uma árvore de diretórios. Imagine que deseje percorrer todos os diretórios a partir de um diretório inicial, retornando o nome do diretório sendo visitado, os diretórios encontrados dentro dele e uma lista de seus arquivos."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, p. 215

---

### Visão Geral da Aula

Sistemas operacionais organizam arquivos em estruturas de árvore hierárquicas compostas por pastas (diretórios) e subpastas. Além disso, diferentes sistemas utilizam separadores de caminho incompatíveis: o Windows usa barras invertidas (`\`), enquanto Linux e macOS utilizam barras normais (`/`).

Nesta aula, você aprenderá:
1. **Operações com o Módulo `os`:** Criação de pastas com `os.mkdir()`, remoção com `os.rmdir()` e exclusão de arquivos com `os.remove()`.
2. **Caminhos Portáveis com `os.path`:** O uso mandatório de `os.path.join()` para concatenar pastas e arquivos de forma portável entre Windows e Linux.
3. **Inspeção de Metadados:** Verificação de existência com `os.path.exists()`, diferenciação entre arquivos e pastas com `os.path.isfile()` e `os.path.isdir()`, e cálculo de tamanho em bytes com `os.path.getsize()`.
4. **Varredura Recursiva com `os.walk()`:** Como navegar em profundidade por toda uma árvore de diretórios automaticamente.
