# Guia de Operação e Experimentos Práticos do Laboratório

Para extrair o máximo de compreensão da física do cursor de arquivo e da varredura de diretórios, execute a seguinte sequência experimental:

---

### Experimento 1: A Destrutividade do Modo `"w"` vs a Preservação do Modo `"a"`

1. No painel **"1. Ponteiro Seek, Tell & Modos"**, observe o buffer inicial pré-carregado: `"Linha 1\nLinha 2\nLinha 3\n"`.
2. Selecione o modo `"w"` e clique em **"Abrir Arquivo"**.
   - Observe o buffer: ele foi **imediatamente esvaziado** (`0 bytes`)! Isso comprova na prática que o modo `"w"` trunca o arquivo instantaneamente.
3. Digite `Registro A\n` no campo de escrita e clique em **"write()"**.
4. Clique em **"Fechar (close)"**.
5. Agora selecione o modo `"a"` (Append) e clique em **"Abrir Arquivo"**.
   - Observe a coordenada do ponteiro: ele foi posicionado automaticamente em `11 bytes` (no final do arquivo), preservando o `"Registro A"`.
6. Digite `Registro B\n` e clique em **"write()"**.
   - O novo texto foi anexado ao final sem apagar a linha anterior.

---

### Experimento 2: Rebobinamento com `seek(0)` e Leitura Parcial

1. Com o arquivo contendo os dois registros, altere o modo para `"r"` e clique em **"Abrir Arquivo"**.
2. Clique em **"read()"**:
   - Todo o conteúdo é lido e o ponteiro salta para o fim do arquivo (`EOF`).
3. Clique em **"read()"** uma segunda vez:
   - O retorno é vazio `""`!
4. No campo `seek:`, digite `0` e clique em **"Mover Ponteiro"**.
   - O cursor vermelho volta para a posição inicial do primeiro byte.
5. Clique em **"read()"** novamente: os dados são relidos com perfeição.

---

### Experimento 3: Navegação com `os.walk` & Geração de HTML

1. Alterne para a aba **"2. os.walk & Gerador HTML"**.
2. Clique em **"Simular os.walk('/projeto')"**:
   - Observe a saída formatada: o algoritmo visita `/projeto`, depois desce para `/projeto/src` e depois para `/projeto/docs`, contabilizando pastas e arquivos.
3. No painel da direita, clique em **"Gerar pagina.html Dinâmica"**:
   - Visualize a tabela HTML renderizada a partir dos dados persistidos.
