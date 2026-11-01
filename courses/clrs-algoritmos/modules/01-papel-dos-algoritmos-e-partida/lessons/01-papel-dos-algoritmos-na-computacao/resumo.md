# Resumo da Aula: O Papel dos Algoritmos na Computação: Definição, Domínios e Fronteiras

<p>Ao longo de todo o livro, os autores distinguem cuidadosamente o objeto matemático abstrato (uma <strong>sequência</strong>) de sua representação concreta na memória (um <strong>arranjo</strong>):</p>
            <ul>
              <li><strong>Sequências com colchetes angulares:</strong> Uma sequência ordenada de $n$ elementos é escrita como $\langle a_1, a_2, \dots, a_n \rangle$. Por exemplo, $\langle 31, 41, 59, 26, 41, 58 \rangle$.</li>
              <li><strong>Permutação (reordenação):</strong> Uma sequência $\langle a'_1, a'_2, \dots, a'_n \rangle$ é uma <em>permutação</em> de $\langle a_1, a_2, \dots, a_n \rangle$ se contém exatamente os mesmos elementos (com as mesmas multiplicidades, caso haja chaves repetidas como o $41$), apenas possivelmente em outra ordem.</li>
              <li><strong>Ordem não decrescente vs. estritamente crescente:</strong> Quando escrevemos $a'_1 \le a'_2 \le \dots \le a'_n$, dizemos ordem <strong>não decrescente</strong> (pois elementos iguais adjacentes são permitidos, como $41 \le 41$). De forma análoga, $a'_1 \ge a'_2 \ge \dots \ge a'_n$ é denominada ordem <strong>não crescente</strong>.</li>
              <li><strong>Indexação iniciada em $1$:</strong> No pseudocódigo CLRS, os arranjos começam no índice $1$, isto é, $A[1 \dots n]$, onde $n$ é armazenado no atributo $A.\text{comprimento}$. A notação de fatia (<em>subarranjo</em>) $A[i \dots j]$ representa os $j - i + 1$ elementos $A[i], A[i+1], \dots, A[j]$. Se $i > j$ (por exemplo, $A[p \dots k-1]$ quando $k = p$), o subarranjo é <strong>vazio</strong> e contém $0$ elementos!</li>
            </ul>
