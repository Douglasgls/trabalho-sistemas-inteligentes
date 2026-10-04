// ==========================================
// JOGO DA FÁBRICA INTELIGENTE
// ==========================================

const readline = require("readline");


// ==========================================
// MAPA
// ==========================================

const {
  obterMapa,
  imprimirMapa
} = require("./js/mapa");


// ==========================================
// MISSÃO
// ==========================================

const {
  obterMissao,
  imprimirMissao
} = require("./js/missao");


// ==========================================
// ROBÔ
// ==========================================

const Robo = require("./js/robo");


// ==========================================
// MOVIMENTO
// ==========================================

const {
  Movimento
} = require("./js/movimento");


// ==========================================
// ALGORITMOS DE BUSCA
// ==========================================

const aEstrela =
  require("./buscas/aestrela");

const buscaGulosa =
  require("./buscas/gulosa");


// ==========================================
// HEURÍSTICAS
// ==========================================

const heuristicaForte =
  require("./heuristicas/heuristicaForte");

const heuristicaFraca =
  require("./heuristicas/heuristicaFraca");


// ==========================================
// CONFIGURAÇÃO
// ==========================================

const NIVEIS = [1, 2, 3];


// ==========================================
// TERMINAL
// ==========================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


// ==========================================
// CONVERTE TECLA PARA DIREÇÃO
// ==========================================

function converterTecla(tecla) {

  switch (tecla.toLowerCase()) {

    case "w":
      return "cima";

    case "a":
      return "esquerda";

    case "s":
      return "baixo";

    case "d":
      return "direita";

    default:
      return null;
  }

}


// ==========================================
// MOSTRA RESULTADO DE UMA BUSCA
// ==========================================

function mostrarResultadoBusca(
  nomeAlgoritmo,
  nomeHeuristica,
  resultado
) {

  console.log("\n------------------------------------------");
  console.log(`${nomeAlgoritmo} + ${nomeHeuristica}`);
  console.log("------------------------------------------");


  if (resultado.caminho === null) {

    console.log("Nenhum caminho encontrado.");

    console.log(
      `Nós explorados: ${resultado.nosExplorados}`
    );

    return;
  }


  console.log(
    `Custo: ${resultado.custo}`
  );

  console.log(
    `Distância: ${resultado.distancia}`
  );

  console.log(
    `Nós explorados: ${resultado.nosExplorados}`
  );

  console.log(
    "Caminho:"
  );

  console.log(
    resultado.caminho
  );

}


// ==========================================
// EXECUTA AS 4 BUSCAS
// ==========================================

function executarBuscas(
  mapa,
  origem,
  destino
) {

  console.log("\n");
  console.log("==========================================");
  console.log("         RESULTADOS DAS BUSCAS");
  console.log("==========================================");


  // ========================================
  // 1. BUSCA GULOSA + MANHATTAN
  // ========================================

  const resultadoGulosaManhattan =
    buscaGulosa(
      mapa,
      origem,
      destino,
      heuristicaForte
    );

  mostrarResultadoBusca(
    "Busca Gulosa",
    "Manhattan",
    resultadoGulosaManhattan
  );


  // ========================================
  // 2. BUSCA GULOSA + CHEBYSHEV
  // ========================================

  const resultadoGulosaChebyshev =
    buscaGulosa(
      mapa,
      origem,
      destino,
      heuristicaFraca
    );

  mostrarResultadoBusca(
    "Busca Gulosa",
    "Chebyshev",
    resultadoGulosaChebyshev
  );


  // ========================================
  // 3. A* + MANHATTAN
  // ========================================

  const resultadoAEstrelaManhattan =
    aEstrela(
      mapa,
      origem,
      destino,
      heuristicaForte
    );

  mostrarResultadoBusca(
    "A*",
    "Manhattan",
    resultadoAEstrelaManhattan
  );


  // ========================================
  // 4. A* + CHEBYSHEV
  // ========================================

  const resultadoAEstrelaChebyshev =
    aEstrela(
      mapa,
      origem,
      destino,
      heuristicaFraca
    );

  mostrarResultadoBusca(
    "A*",
    "Chebyshev",
    resultadoAEstrelaChebyshev
  );

}


// ==========================================
// MOSTRA RESULTADO DO JOGADOR
// ==========================================

function mostrarResultadoJogador(robo) {

  const estatisticas =
    robo.obterEstatisticas();


  console.log("\n");
  console.log("==========================================");
  console.log("          RESULTADO DO JOGADOR");
  console.log("==========================================");


  console.log(
    `Movimentos: ${estatisticas.movimentos}`
  );

  console.log(
    `Distância: ${estatisticas.distancia}`
  );

  console.log(
    `Custo: ${estatisticas.custo}`
  );


  console.log("\nCaminho realizado:");

  console.log(
    robo.obterCaminho()
  );

}


// ==========================================
// JOGA UM NÍVEL
// ==========================================

function jogarNivel(nivel, finalizarNivel) {

  console.log("\n\n");
  console.log("==========================================");
  console.log(`              NÍVEL ${nivel}`);
  console.log("==========================================");


  // ========================================
  // OBTÉM MAPA E MISSÃO
  // ========================================

  const mapa =
    obterMapa(nivel);

  const missao =
    obterMissao(nivel, 1);


  // ========================================
  // CRIA O ROBÔ NA ORIGEM DA MISSÃO
  // ========================================

  const robo =
    new Robo(
      missao.origem[0],
      missao.origem[1]
    );


  // ========================================
  // CRIA O SISTEMA DE MOVIMENTO
  // ========================================

  const movimento =
    new Movimento(
      mapa,
      robo
    );


  // ========================================
  // MOSTRA MISSÃO
  // ========================================

  imprimirMissao(missao);


  // ========================================
  // MOSTRA MAPA
  // ========================================

  imprimirMapa(
    mapa,
    missao,
    robo
  );


  // ========================================
  // CONTROLES
  // ========================================

  console.log("\nControles:");
  console.log("W = cima");
  console.log("A = esquerda");
  console.log("S = baixo");
  console.log("D = direita");
  console.log("Q = sair");


  // ========================================
  // JOGADA DO JOGADOR
  // ========================================

  function jogar() {

    rl.question(
      "\nDigite W/A/S/D: ",
      (tecla) => {

        tecla =
          tecla.trim();


        // ==================================
        // SAIR
        // ==================================

        if (
          tecla.toLowerCase() === "q"
        ) {

          console.log(
            "\nJogo encerrado."
          );

          rl.close();

          return;
        }


        // ==================================
        // CONVERTE TECLA
        // ==================================

        const direcao =
          converterTecla(tecla);


        if (!direcao) {

          console.log(
            "\nTecla inválida. Use W, A, S ou D."
          );

          jogar();

          return;
        }


        // ==================================
        // REALIZA MOVIMENTO
        // ==================================

        const resultado =
          movimento.mover(direcao);


        console.log(
          `\n${resultado.mensagem}`
        );


        // ==================================
        // MOSTRA INFORMAÇÕES DO MOVIMENTO
        // ==================================

        if (resultado.sucesso) {

          console.log(
            `Terreno: ${resultado.terreno}`
          );

          console.log(
            `Custo do movimento: ${resultado.custo}`
          );

          console.log(
            `Posição atual: [${robo.linha}, ${robo.coluna}]`
          );

        }


        // ==================================
        // ATUALIZA MAPA
        // ==================================

        imprimirMapa(
          mapa,
          missao,
          robo
        );


        // ==================================
        // VERIFICA DESTINO
        // ==================================

        if (
          robo.chegouAoDestino(
            missao.destino
          )
        ) {

          console.log("\n");
          console.log("==========================================");
          console.log("          MISSÃO CONCLUÍDA!");
          console.log("==========================================");


          // =================================
          // RESULTADO DO JOGADOR
          // =================================

          mostrarResultadoJogador(
            robo
          );


          // =================================
          // EXECUTA AS 4 BUSCAS
          // =================================

          executarBuscas(
            mapa,
            missao.origem,
            missao.destino
          );


          // =================================
          // FINALIZA OU VAI PARA PRÓXIMO
          // =================================

          finalizarNivel();

          return;
        }


        // ==================================
        // PRÓXIMA JOGADA
        // ==================================

        jogar();

      }
    );

  }


  // ========================================
  // INICIA O NÍVEL
  // ========================================

  jogar();

}


// ==========================================
// INICIA O JOGO
// ==========================================

let indiceNivel = 0;


function iniciarJogo() {

  if (
    indiceNivel >= NIVEIS.length
  ) {

    console.log("\n");
    console.log("==========================================");
    console.log("        FIM DO JOGO!");
    console.log("==========================================");

    console.log(
      "\nTodos os níveis foram concluídos."
    );

    rl.close();

    return;
  }


  const nivel =
    NIVEIS[indiceNivel];


  jogarNivel(
    nivel,
    () => {

      indiceNivel++;

      console.log("\n\n");

      if (
        indiceNivel < NIVEIS.length
      ) {

        console.log(
          "Preparando próximo nível..."
        );

        iniciarJogo();

      }
      else {

        console.log(
          "Todos os níveis foram concluídos!"
        );

        rl.close();

      }

    }
  );

}


// ==========================================
// INÍCIO
// ==========================================

console.log("\n");
console.log("==========================================");
console.log("        FÁBRICA INTELIGENTE");
console.log("==========================================");

console.log(
  "\nIniciando jogo..."
);

iniciarJogo();

