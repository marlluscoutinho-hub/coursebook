# Scripts de Linha de Comando e o Módulo sys.argv

> *"Muitas vezes queremos executar nossos programas passando parâmetros na linha de comando, da mesma forma que fazemos com programas do sistema operacional como cp, rm ou dir... Em Python, esses parâmetros são capturados na lista sys.argv do módulo sys."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, pp. 197–200

---

### Visão Geral da Aula

Softwares profissionais de infraestrutura, ciência de dados e DevOps raramente solicitam dados através de caixas de diálogo ou `input()` interativos. Eles são chamados diretamente no terminal de comando (Bash, PowerShell ou Zsh) recebendo parâmetros, flags e nomes de arquivos como argumentos:

```bash
python processa.py dados.txt relatorio.csv --verbose
```

Nesta aula, você aprenderá:
1. **A Anatomia de `sys.argv`:** A lista que preserva os argumentos passados pelo shell na inicialização do interpretador.
2. **A Posição `sys.argv[0]`:** Por que o primeiro elemento da lista é sempre o nome do próprio script executado.
3. **Validação de Argumentos:** Como prevenir `IndexError: list index out of range` verificando `len(sys.argv)` antes de ler parâmetros.
4. **Construção de Utilitários de Terminal:** Implementando comandos no estilo `cat` (exibição paginada) e `grep` (busca de linhas) diretamente em Python.
