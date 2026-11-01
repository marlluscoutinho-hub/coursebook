# Guia Operacional do Laboratório de Árvore de Decisão

O simulador de fluxo condicional abaixo reproduz o algoritmo de decisão do interpretador Python para quatro cenários clássicos do Capítulo 4 do livro de Nilo Menezes:

---

### Cenários Exploráveis

1. **Radar de Velocidade (Exercício 4.2):** Ajuste a velocidade aferida pelo radar (entre 40 e 150 km/h) e verifique o limiar de 80 km/h. Observe como o ramo da multa só é ativado quando o predicado `velocidade > 80` é verdadeiro.
2. **Escalonamento Salarial (Exercício 4.4):** Digite diferentes valores de remuneração para testar a fronteira exata de R$ 1.250,00 e a alternância entre 10% e 15% de aumento.
3. **Passagem Rodoviária (Exercício 4.6):** Deslize a distância entre 20 e 600 km para inspecionar a transição entre a tarifa padrão de R$ 0,50/km e a promocional de R$ 0,45/km.
4. **Tarifas Elétricas com elif (Exercício 4.10):** Alterne o tipo de instalação (Residencial, Comercial, Industrial) e o consumo em kWh para observar a matriz bidimensional de decisão sendo percorrida pelo compilador.
