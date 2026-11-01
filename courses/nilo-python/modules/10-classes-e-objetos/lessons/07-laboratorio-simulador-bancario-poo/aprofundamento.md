# Guia de Operação e Experimentos Práticos do Laboratório

Para vivenciar na prática a herança e o polimorfismo, execute as seguintes etapas experimentais na bancada:

---

### Experimento 1: A Diferença Polimórfica de Saque entre Conta e ContaEspecial

1. No painel **"1. Simulador do Sistema Bancário"**, selecione no menu de contas a primeira conta: **Conta Comum Nº 101 (João Silva)** com saldo inicial de `R$ 500.00`.
2. No campo de valor da operação, digite `700` e clique em **"Saque (-)"**.
   - Observe o alerta: *"Saque de R$ 700.00 recusado! Saldo insuficiente"*.
   - A conta comum não possui limite, portanto `pode_sacar(700)` retorna `False`.
3. Agora selecione a segunda conta no menu: **ContaEspecial Nº 102 (Maria Souza)** com saldo de `R$ 100.00` e limite de `R$ 1000.00`.
4. Digite novamente o valor `700` e clique em **"Saque (-)"**.
   - Observe o resultado: *"Saque de R$ 700.00 aprovado!"*.
   - Veja o extrato: o saldo passa a ser `-600.00`, pois `(100 + 1000) >= 700`.
   - O extrato especial exibe detalhadamente o saldo contábil negativo, o limite de crédito aprovado e o total ainda disponível para saque (`R$ 400.00`).

---

### Experimento 2: Instanciando uma Nova Conta Personalizada

1. No formulário superior, digite o nome `Carlos Drummond`.
2. Saldo inicial: `1200`.
3. Tipo de Conta: selecione `ContaEspecial (Herança com Limite)` e defina o limite em `2500`.
4. Clique em **"Instanciar Objeto Conta"**.
   - A nova conta Nº 103 é criada na memória e adicionada à lista do banco.
5. Realize um depósito de `R$ 300` e um saque de `R$ 500`, inspecionando o extrato atualizado em tempo real.

---

### Experimento 3: Testando a Classe `ListaÚnica` e Métodos Dunder

1. Alterne para a aba **"2. Métodos Mágicos (__len__, __getitem__)"**.
2. Digite o número inteiro `42` e clique em **"lu.adiciona()"**.
   - O elemento é inserido. `len(lu)` avança para `3`.
3. Tente adicionar o número `42` novamente:
   - A bancada avisa que o elemento foi ignorado por se tratar de duplicata. `len(lu)` permanece inalterado.
4. Tente digitar o número decimal `3.14`:
   - A validação de tipo aciona imediatamente a exceção `TypeError: 'Tipo inválido'. Esperado 'int'`.
