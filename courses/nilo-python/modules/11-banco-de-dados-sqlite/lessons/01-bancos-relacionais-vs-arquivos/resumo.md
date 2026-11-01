# Síntese da Unidade: Bancos Relacionais vs. Arquivos

### Pontos Fundamentais
1. **Limitações dos Arquivos Planos:** Arquivos texto exigem leitura sequencial $\mathcal{O}(N)$, não possuem indexação automática por padrão, carecem de travas de concorrência e podem sofrer corrupção completa se houver interrupção abrupta na gravação.
2. **Modelo Relacional (Codd):** Estrutura dados em tabelas compostas por linhas (tuplas/registros) e colunas (atributos tipados), com identificação unívoca por meio de chaves primárias.
3. **Pilares ACID:** Atomicidade (tudo ou nada), Consistência (regras invioláveis), Isolamento (transações protegidas) e Durabilidade (gravação permanente após confirmação).
4. **Arquitetura SQLite:** Embutido (*serverless*), dispensa configuração de servidores e portas de rede, e armazena todo o banco de dados em um único arquivo binário compacto e portável ou em memória (`:memory:`).
