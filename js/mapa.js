// ==========================================
// MAPA DA FÁBRICA INTELIGENTE
// ==========================================

// Tipos de terreno disponíveis
const TERRENOS = [
  "estrada",
  "terra",
  "lama",
  "barreira"
];

// Custos de movimentação
const CUSTOS = {
  estrada: 1,
  terra: 3,
  lama: 5,
  barreira: Infinity
};


// ==========================================
// CLASSE CELULA
// ==========================================

class Celula {
  constructor(linha, coluna, tipo, custo) {
    this.linha = linha;
    this.coluna = coluna;
    this.tipo = tipo;
    this.custo = custo;
  }
}


// ==========================================
// CRIA UMA CÉLULA
// ==========================================

function criarCelula(linha, coluna, tipo) {
  return new Celula(
    linha,
    coluna,
    tipo,
    CUSTOS[tipo]
  );
}



// CONVERTE COORDENADA PARA FORMATO DE XADREZ

function converterParaCoordenada(linha, coluna, tamanho) {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return `${letras[coluna]}${tamanho - linha}`;
}

// CRIA UM MAPA A PARTIR DE UMA MATRIZ DE TIPOS

function criarMapa(matrizTipos) {

  const altura = matrizTipos.length;
  const largura = matrizTipos[0].length;

  const matriz = [];

  for (let i = 0; i < altura; i++) {

    const linha = [];

    for (let j = 0; j < largura; j++) {

      const tipo = matrizTipos[i][j];

      if (!TERRENOS.includes(tipo)) {
        throw new Error(
          `Terreno inválido na posição [${i}][${j}]: ${tipo}`
        );
      }

      linha.push(
        criarCelula(i, j, tipo)
      );
    }

    matriz.push(linha);
  }

  return {
    matriz,
    altura,
    largura
  };
}


// ==========================================
// MAPA 1
// ==========================================
//
// 10 × 10
// Poucos obstáculos
// Baixa dificuldade
//
// S = posição inicial do robô
// D = destino
//
// A matriz abaixo contém apenas os terrenos.
// Origem e destino são definidos separadamente.
// ==========================================

const matrizMapa1 = [

  ["estrada", "estrada", "estrada", "estrada", "terra", "terra", "estrada", "estrada", "estrada", "estrada"],

  ["estrada", "barreira", "barreira", "estrada", "terra", "lama", "estrada", "barreira", "barreira", "estrada"],

  ["estrada", "estrada", "estrada", "estrada", "terra", "lama", "estrada", "estrada", "estrada", "estrada"],

  ["terra", "terra", "barreira", "barreira", "terra", "estrada", "estrada", "barreira", "terra", "estrada"],

  ["estrada", "estrada", "estrada", "terra", "terra", "estrada", "lama", "barreira", "terra", "estrada"],

  ["estrada", "barreira", "estrada", "terra", "lama", "estrada", "lama", "estrada", "terra", "estrada"],

  ["estrada", "barreira", "estrada", "estrada", "estrada", "estrada", "terra", "estrada", "estrada", "estrada"],

  ["terra", "terra", "estrada", "barreira", "barreira", "estrada", "terra", "terra", "barreira", "estrada"],

  ["estrada", "barreira", "estrada", "estrada", "estrada", "estrada", "estrada", "barreira", "barreira", "estrada"],

  ["estrada", "estrada", "estrada", "terra", "terra", "estrada", "estrada", "estrada", "estrada", "estrada"]

];


// ==========================================
// MAPA 2
// ==========================================
//
// 20 × 20
// Mais obstáculos
// Mais terrenos com custos diferentes
// Maior quantidade de caminhos possíveis
// ==========================================

const matrizMapa2 = [

  ["estrada", "estrada", "terra", "estrada", "estrada", "estrada", "barreira", "estrada", "estrada", "terra", "estrada", "estrada", "estrada", "barreira", "estrada", "estrada", "terra", "estrada", "estrada", "estrada"],

  ["estrada", "barreira", "terra", "barreira", "barreira", "estrada", "barreira", "estrada", "lama", "terra", "estrada", "barreira", "estrada", "barreira", "estrada", "barreira", "terra", "barreira", "estrada", "estrada"],

  ["estrada", "estrada", "terra", "estrada", "estrada", "estrada", "estrada", "estrada", "lama", "estrada", "estrada", "barreira", "estrada", "estrada", "estrada", "barreira", "estrada", "terra", "estrada", "estrada"],

  ["barreira", "estrada", "terra", "barreira", "terra", "terra", "barreira", "estrada", "estrada", "estrada", "barreira", "barreira", "terra", "terra", "estrada", "estrada", "estrada", "terra", "barreira", "estrada"],

  ["estrada", "estrada", "estrada", "barreira", "terra", "estrada", "barreira", "barreira", "terra", "estrada", "estrada", "estrada", "terra", "barreira", "estrada", "barreira", "estrada", "estrada", "estrada", "estrada"],

  ["estrada", "barreira", "estrada", "estrada", "terra", "estrada", "estrada", "lama", "lama", "estrada", "barreira", "estrada", "terra", "terra", "estrada", "barreira", "terra", "barreira", "estrada", "estrada"],

  ["estrada", "barreira", "terra", "estrada", "estrada", "estrada", "barreira", "estrada", "estrada", "estrada", "barreira", "estrada", "barreira", "estrada", "estrada", "estrada", "terra", "estrada", "barreira", "estrada"],

  ["estrada", "estrada", "terra", "barreira", "barreira", "estrada", "barreira", "terra", "lama", "estrada", "estrada", "estrada", "terra", "barreira", "barreira", "estrada", "terra", "estrada", "estrada", "estrada"],

  ["terra", "estrada", "estrada", "estrada", "terra", "estrada", "estrada", "terra", "estrada", "barreira", "estrada", "barreira", "estrada", "estrada", "estrada", "terra", "estrada", "barreira", "terra", "estrada"],

  ["estrada", "barreira", "barreira", "estrada", "terra", "barreira", "estrada", "terra", "estrada", "estrada", "estrada", "barreira", "terra", "estrada", "barreira", "estrada", "estrada", "terra", "estrada", "estrada"],

  ["estrada", "estrada", "terra", "estrada", "estrada", "barreira", "estrada", "estrada", "lama", "terra", "estrada", "estrada", "terra", "estrada", "estrada", "barreira", "terra", "estrada", "barreira", "estrada"],

  ["barreira", "estrada", "terra", "barreira", "estrada", "estrada", "estrada", "barreira", "estrada", "estrada", "barreira", "estrada", "estrada", "terra", "estrada", "estrada", "terra", "estrada", "estrada", "estrada"],

  ["estrada", "estrada", "estrada", "barreira", "terra", "lama", "estrada", "estrada", "terra", "barreira", "estrada", "terra", "barreira", "estrada", "estrada", "barreira", "estrada", "terra", "estrada", "estrada"],

  ["estrada", "barreira", "estrada", "estrada", "terra", "estrada", "barreira", "estrada", "terra", "estrada", "estrada", "terra", "estrada", "barreira", "estrada", "estrada", "estrada", "barreira", "terra", "estrada"],

  ["terra", "terra", "estrada", "barreira", "estrada", "estrada", "barreira", "terra", "estrada", "barreira", "estrada", "estrada", "terra", "terra", "estrada", "barreira", "estrada", "estrada", "estrada", "estrada"],

  ["estrada", "barreira", "estrada", "estrada", "estrada", "terra", "estrada", "terra", "estrada", "estrada", "barreira", "terra", "estrada", "barreira", "estrada", "estrada", "terra", "barreira", "estrada", "estrada"],

  ["estrada", "estrada", "estrada", "barreira", "terra", "terra", "estrada", "estrada", "terra", "estrada", "estrada", "terra", "estrada", "estrada", "barreira", "terra", "estrada", "estrada", "estrada", "estrada"],

  ["barreira", "estrada", "terra", "estrada", "estrada", "estrada", "barreira", "estrada", "estrada", "barreira", "terra", "estrada", "estrada", "terra", "estrada", "barreira", "estrada", "terra", "barreira", "estrada"],

  ["estrada", "estrada", "terra", "barreira", "estrada", "estrada", "estrada", "estrada", "terra", "estrada", "estrada", "barreira", "estrada", "estrada", "estrada", "terra", "estrada", "estrada", "terra", "estrada"],

  ["estrada", "terra", "estrada", "estrada", "estrada", "barreira", "estrada", "terra", "estrada", "estrada", "terra", "estrada", "estrada", "barreira", "estrada", "estrada", "estrada", "estrada", "estrada", "estrada"]

];


// ==========================================
// MAPA 3
// ==========================================
//

const matrizMapa3 = [

  // 1
  ["estrada", "estrada", "terra", "terra", "estrada", "estrada", "estrada", "barreira", "estrada", "estrada", "terra", "terra", "estrada", "estrada", "barreira", "estrada", "estrada", "terra", "estrada", "estrada"],

  // 2
  ["estrada", "barreira", "terra", "lama", "estrada", "barreira", "estrada", "barreira", "estrada", "lama", "terra", "barreira", "estrada", "estrada", "barreira", "estrada", "terra", "terra", "barreira", "estrada"],

  // 3
  ["estrada", "barreira", "estrada", "estrada", "estrada", "barreira", "estrada", "estrada", "estrada", "lama", "terra", "estrada", "estrada", "terra", "estrada", "estrada", "estrada", "estrada", "barreira", "estrada"],

  // 4
  ["terra", "barreira", "estrada", "barreira", "terra", "terra", "estrada", "barreira", "barreira", "lama", "estrada", "estrada", "barreira", "terra", "terra", "barreira", "estrada", "terra", "barreira", "estrada"],

  // 5
  ["estrada", "estrada", "estrada", "barreira", "terra", "lama", "estrada", "estrada", "estrada", "estrada", "estrada", "barreira", "estrada", "estrada", "terra", "barreira", "estrada", "terra", "estrada", "estrada"],

  // 6
  ["estrada", "barreira", "terra", "barreira", "estrada", "lama", "barreira", "barreira", "estrada", "terra", "estrada", "barreira", "estrada", "terra", "terra", "estrada", "barreira", "terra", "terra", "estrada"],

  // 7
  ["estrada", "barreira", "estrada", "estrada", "estrada", "estrada", "estrada", "barreira", "estrada", "terra", "lama", "barreira", "estrada", "estrada", "barreira", "estrada", "estrada", "estrada", "barreira", "lama"],

  // 8
  ["terra", "barreira", "estrada", "barreira", "barreira", "terra", "estrada", "barreira", "estrada", "estrada", "lama", "estrada", "terra", "terra", "barreira", "estrada", "barreira", "terra", "estrada", "estrada"],

  // 9
  ["estrada", "estrada", "estrada", "barreira", "terra", "terra", "estrada", "estrada", "estrada", "barreira", "estrada", "estrada", "terra", "barreira", "estrada", "estrada", "barreira", "terra", "barreira", "terra"],

  // 10
  ["barreira", "barreira", "estrada", "estrada", "estrada", "lama", "estrada", "barreira", "terra", "barreira", "estrada", "terra", "terra", "barreira", "estrada", "estrada", "estrada", "estrada", "estrada", "estrada"],

  // 11
  ["estrada", "terra", "estrada", "barreira", "estrada", "lama", "estrada", "barreira", "estrada", "estrada", "estrada", "terra", "barreira", "estrada", "terra", "barreira", "estrada", "terra", "barreira", "estrada"],

  // 12
  ["estrada", "barreira", "estrada", "barreira", "terra", "terra", "estrada", "barreira", "lama", "lama", "estrada", "terra", "barreira", "estrada", "estrada", "barreira", "estrada", "terra", "terra", "barreira"],

  // 13
  ["estrada", "barreira", "estrada", "estrada", "terra", "barreira", "estrada", "estrada", "lama", "estrada", "estrada", "estrada", "estrada", "terra", "terra", "estrada", "barreira", "terra", "barreira", "estrada"],

  // 14
  ["terra", "barreira", "terra", "estrada", "estrada", "barreira", "terra", "barreira", "estrada", "estrada", "terra", "barreira", "estrada", "terra", "barreira", "estrada", "estrada", "estrada", "barreira", "estrada"],

  // 15
  ["estrada", "estrada", "terra", "barreira", "terra", "terra", "estrada", "barreira", "terra", "lama", "terra", "estrada", "estrada", "terra", "estrada", "barreira", "estrada", "terra", "estrada", "estrada"],

  // 16
  ["estrada", "barreira", "estrada", "barreira", "estrada", "terra", "estrada", "barreira", "estrada", "lama", "estrada", "barreira", "terra", "terra", "estrada", "barreira", "terra", "terra", "barreira", "lama"],

  // 17
  ["estrada", "barreira", "terra", "estrada", "estrada", "estrada", "terra", "barreira", "estrada", "estrada", "estrada", "barreira", "estrada", "barreira", "estrada", "estrada", "terra", "estrada", "barreira", "estrada"],

  // 18
  ["estrada", "estrada", "terra", "barreira", "terra", "terra", "estrada", "estrada", "terra", "barreira", "estrada", "terra", "terra", "estrada", "barreira", "terra", "estrada", "terra", "estrada", "estrada"],

  // 19
  ["terra", "barreira", "estrada", "estrada", "terra", "lama", "estrada", "barreira", "estrada", "estrada", "terra", "terra", "estrada", "barreira", "estrada", "estrada", "estrada", "barreira", "terra", "estrada"],

  // 20
  ["estrada", "estrada", "estrada", "terra", "estrada", "estrada", "estrada", "barreira", "estrada", "estrada", "terra", "estrada", "estrada", "estrada", "barreira", "estrada", "terra", "terra", "estrada", "estrada"]

];



// CRIAÇÃO DOS MAPAS

const mapas = {

  1: criarMapa(matrizMapa1),

  2: criarMapa(matrizMapa2),

  3: criarMapa(matrizMapa3)

};


// OBTÉM UM MAPA PELO NÍVEL
function obterMapa(nivel) {

  if (!mapas[nivel]) {
    throw new Error(
      `Mapa do nível ${nivel} não existe.`
    );
  }

  return mapas[nivel];
}

// IMPRIME O MAPA NO TERMINAL

function imprimirMapa(mapa, missao, robo = null) {

  console.log(`\nMAPA ${mapa.altura} × ${mapa.largura}\n`);

  for (let i = 0; i < mapa.altura; i++) {

    let linhaStr = "";

    for (let j = 0; j < mapa.largura; j++) {

      // Robô
      if (
        robo &&
        robo.linha === i &&
        robo.coluna === j
      ) {

        linhaStr += " R ";

      }

      // Destino
      else if (
        i === missao.destino[0] &&
        j === missao.destino[1]
      ) {

        linhaStr += " D ";

      }

      else {

        const tipo = mapa.matriz[i][j].tipo;

        switch (tipo) {

          case "estrada":
            linhaStr += " . ";
            break;

          case "terra":
            linhaStr += " T ";
            break;

          case "lama":
            linhaStr += " L ";
            break;

          case "barreira":
            linhaStr += " █ ";
            break;
        }
      }
    }

    console.log(linhaStr);
  }

  console.log("\nLegenda:");
  console.log("R = Robô");
  console.log("D = Destino");
  console.log(". = Estrada (custo 1)");
  console.log("T = Terra (custo 3)");
  console.log("L = Lama (custo 5)");
  console.log("█ = Barreira");
}

module.exports = {
  Celula,
  TERRENOS,
  CUSTOS,
  criarMapa,
  obterMapa,
  imprimirMapa,
  converterParaCoordenada,
  mapas
};