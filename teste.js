const readline = require("readline");

const {
  obterMapa,
  imprimirMapa
} = require("./js/mapa");

const {
  obterMissao,
  imprimirMissao
} = require("./js/missao");

const Robo = require("./js/robo");

const {
  Movimento
} = require("./js/movimento");


// ==========================================
// CONFIGURAÇÃO
// ==========================================

const nivel = 1;

const mapa = obterMapa(nivel);

const missao = obterMissao(nivel, 1);


// ==========================================
// CRIA O ROBÔ
// ==========================================

const robo = new Robo(
  missao.origem[0],
  missao.origem[1]
);


// ==========================================
// CRIA O SISTEMA DE MOVIMENTO
// ==========================================

const movimento = new Movimento(
  mapa,
  robo
);


// ==========================================
// CONFIGURA O TERMINAL
// ==========================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


// ==========================================
// MOSTRA A MISSÃO
// ==========================================

imprimirMissao(missao);


// ==========================================
// MOSTRA O MAPA
// ==========================================

imprimirMapa(
  mapa,
  missao,
  robo
);


// ==========================================
// MOSTRA CONTROLES
// ==========================================

console.log("\nControles:");

console.log("W = cima");
console.log("A = esquerda");
console.log("S = baixo");
console.log("D = direita");

console.log("Q = sair");


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
// FAZ UMA JOGADA
// ==========================================

function jogar() {

  rl.question("\nDigite W/A/S/D: ", (tecla) => {

    // Remove espaços
    tecla = tecla.trim();


    // ======================================
    // SAIR
    // ======================================

    if (tecla.toLowerCase() === "q") {

      console.log("\nJogo encerrado.");

      rl.close();

      return;
    }


    // ======================================
    // CONVERTE TECLA
    // ======================================

    const direcao = converterTecla(tecla);


    if (!direcao) {

      console.log(
        "\nTecla inválida. Use W, A, S ou D."
      );

      jogar();

      return;
    }


    // ======================================
    // REALIZA MOVIMENTO
    // ======================================

    const resultado =
      movimento.mover(direcao);


    console.log(
      `\n${resultado.mensagem}`
    );


    // ======================================
    // MOSTRA INFORMAÇÕES
    // ======================================

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


    // ======================================
    // MOSTRA MAPA ATUALIZADO
    // ======================================

    imprimirMapa(
      mapa,
      missao,
      robo
    );


    // ======================================
    // VERIFICA DESTINO
    // ======================================

    if (
      robo.chegouAoDestino(
        missao.destino
      )
    ) {

      console.log(
        "\n🎯 MISSÃO CONCLUÍDA!"
      );


      console.log(
        "\nEstatísticas:"
      );

      console.log(
        robo.obterEstatisticas()
      );


      console.log(
        "\nCaminho realizado:"
      );

      console.log(
        robo.obterCaminho()
      );


      rl.close();

      return;
    }


    // ======================================
    // PRÓXIMO MOVIMENTO
    // ======================================

    jogar();

  });

}


// ==========================================
// INICIA O JOGO
// ==========================================

jogar();