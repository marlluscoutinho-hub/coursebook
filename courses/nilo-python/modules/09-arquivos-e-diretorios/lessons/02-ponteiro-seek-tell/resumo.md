# Resumo da Unidade: Cursor de Arquivo (Seek e Tell)

### Pontos Essenciais

1. **File Pointer:** O cursor físico que dita a posição em bytes para as operações subsequentes de entrada e saída.
2. **Método `tell()`:** Retorna a posição corrente do ponteiro em bytes em relação ao início do arquivo.
3. **Método `seek(offset, whence)`:** Reposiciona o cursor. `seek(0)` rebobina para o início, viabilizando releituras do arquivo sem reabri-lo.
4. **Comportamento no EOF:** Quando o cursor atinge o final do arquivo, leituras posteriores produzem strings vazias (`""`) até que um `seek()` seja executado.
5. **Esvaziamento de Buffers:** O método `flush()` força a gravação imediata de dados retidos nos buffers de memória para o meio magnético ou de estado sólido.
