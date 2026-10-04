# Fábrica Inteligente 🏭🤖

Este é um projeto em **Node.js** com foco em **Inteligência Artificial e Algoritmos de Busca**. Trata-se de uma aplicação de terminal (console) onde o usuário (jogador) e a Inteligência Artificial devem encontrar o melhor caminho em um mapa de uma fábrica, partindo de uma origem até um destino.

O objetivo principal do projeto é demonstrar, na prática, o funcionamento e a eficiência de diferentes algoritmos de busca (Pathfinding) e heurísticas.

## 🎯 Como Funciona

1. **Partida do Jogador:** Ao iniciar a aplicação, o jogador é desafiado a controlar um robô pelo mapa usando as teclas `W`, `A`, `S` e `D`. Cada movimento tem um custo baseado no terreno.
2. **Conclusão:** Assim que o jogador chega ao destino final, o jogo exibe as estatísticas do jogador (distância percorrida, custo do caminho e número de movimentos).
3. **Análise da IA:** Após a jogada humana, o sistema executa automaticamente os algoritmos de busca implementados para resolver a mesma missão.
4. **Comparação:** No final, é exibido um quadro comparativo mostrando a performance do jogador contra as diferentes abordagens da IA, analisando:
   - Distância
   - Custo total
   - Quantidade de Nós explorados
   - Tempo de execução (em ms)

## 🧠 Algoritmos e Heurísticas Implementadas

O projeto explora a diferença de performance combinando algoritmos clássicos de busca informada com diferentes tipos de heurísticas.

### Algoritmos de Busca (`/buscas`)
- **Busca Gulosa (Greedy Search):** Escolhe o próximo passo baseando-se apenas na heurística (o que parece estar mais perto do objetivo), sem considerar o custo do caminho já percorrido.
- **Busca A* (A-Estrela):** Um dos melhores algoritmos de *pathfinding*. Considera tanto o custo real do caminho percorrido até o momento quanto a heurística estimando o custo até o final, garantindo o caminho de menor custo.

### Heurísticas (`/heuristicas`)
- **Distância de Manhattan (Heurística Forte):** Calcula a distância em grade (apenas movimentos horizontais e verticais). Costuma ser mais precisa ("forte") em mapas onde movimentos diagonais não são permitidos ou têm custo alto.
- **Distância de Chebyshev (Heurística Fraca):** Considera a maior diferença absoluta entre as coordenadas. Permite uma estimativa de distância considerando movimentos diagonais.

## 📂 Estrutura do Projeto

- `main.js`: Arquivo principal. Gerencia o fluxo do jogo, a interface de terminal e a execução final das comparações.
- `/buscas`: Contém as lógicas dos algoritmos de IA (`aestrela.js` e `gulosa.js`).
- `/heuristicas`: Contém as funções de cálculo de distância (`heuristicaForte.js` e `heuristicaFraca.js`).
- `/js`: Módulos centrais do domínio:
  - `mapa.js`: Estrutura e impressão do terreno/mapa.
  - `missao.js`: Definição dos objetivos (pontos de origem e destino).
  - `movimento.js`: Lógica de movimentação, custos e validações de terreno.
  - `robo.js`: Entidade principal que guarda o estado, posição e estatísticas.
  - `no.js`: Estrutura de dados ("Nó") utilizada pelos algoritmos de busca em grafos.

## 🚀 Como Executar

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### Versão Terminal (CLI)
1. Clone ou baixe este repositório.
2. Abra o terminal na pasta raiz do projeto (`/Si`).
3. Execute o comando:
   ```bash
   node main.js
   ```
4. Siga as instruções na tela para controlar o robô!

### Versão Interface Web (Frontend / React)
O projeto também conta com uma interface gráfica rica.
1. Abra o terminal e navegue até a pasta `frontend`:
   ```bash
   cd frontend
   ```
2. Instale as dependências do projeto:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse o link gerado no terminal (geralmente `http://localhost:5173/`) através do seu navegador.
