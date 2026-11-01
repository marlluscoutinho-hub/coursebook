# O Cursor de Arquivo: Posicionamento Físico com Seek e Tell

> *"Ao abrirmos um arquivo, o sistema operacional mantém um ponteiro ou cursor de posição que indica de onde os dados serão lidos ou onde serão gravados... Os métodos seek e tell permitem controlar e consultar essa posição diretamente."*  
> — **Nilo Ney Coutinho Menezes**, *Introdução à Programação com Python*, pp. 194–197

---

### Visão Geral da Aula

Quando você lê um arquivo com `f.read()`, o que acontece se você chamar `f.read()` novamente logo em seguida? O segundo comando retorna uma string vazia `""`! Isso não significa que o arquivo foi apagado; significa que o **cursor físico de leitura** alcançou o final do arquivo (*EOF - End of File*).

Nesta aula, desvendaremos a mecânica de navegação interna nos arquivos:
1. **O Método `tell()`:** Como inspecionar a coordenada exata em bytes onde o cursor do arquivo está posicionado no momento.
2. **O Método `seek(offset, [whence]):`** Como rebobinar o ponteiro para o início (`seek(0)`), saltar para posições arbitrárias ou navegar a partir do fim do arquivo.
3. **Acesso Aleatório (*Random Access*):** A base técnica de bancos de dados relacionais e leitores de arquivos indexados que pulam diretamente para o byte de interesse sem ler sequencialmente gigabytes de dados.
