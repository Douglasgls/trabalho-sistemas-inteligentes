// ==========================================
// MISSÕES DA FÁBRICA INTELIGENTE
// ==========================================


// ==========================================
// MISSÕES DO NÍVEL 1
// ==========================================

const missoesNivel1 = [

  {
    id: 1,
    nome: "Missão 01",
    descricao: "Pegue o Motor no Estoque A e entregue no Setor de Montagem.",

    carga: "Motor",

    origem: [0, 0],

    destino: [9, 9]
  }

];


// ==========================================
// MISSÕES DO NÍVEL 2
// ==========================================

const missoesNivel2 = [

  {
    id: 1,
    nome: "Missão 01",
    descricao: "Pegue a Placa Eletrônica no Estoque B e entregue no Setor de Montagem.",

    carga: "Placa Eletrônica",

    origem: [0, 0],

    destino: [19, 19]
  }

];


// ==========================================
// MISSÕES DO NÍVEL 3
// ==========================================

const missoesNivel3 = [

  {
    id: 1,
    nome: "Missão 01",
    descricao: "Pegue a Ferramenta no Estoque C e entregue no Setor de Produção.",

    carga: "Ferramenta",

    origem: [0, 0],

    destino: [19, 19]
  }

];


// ==========================================
// ORGANIZA AS MISSÕES POR NÍVEL
// ==========================================

const missoes = {

  1: missoesNivel1,

  2: missoesNivel2,

  3: missoesNivel3

};


// ==========================================
// OBTÉM AS MISSÕES DE UM NÍVEL
// ==========================================

function obterMissoes(nivel) {

  if (!missoes[nivel]) {

    throw new Error(
      `Não existem missões cadastradas para o nível ${nivel}.`
    );

  }

  return missoes[nivel];
}


// ==========================================
// OBTÉM UMA MISSÃO ESPECÍFICA
// ==========================================

function obterMissao(nivel, idMissao) {

  const lista = obterMissoes(nivel);

  const missao = lista.find(
    missao => missao.id === idMissao
  );

  if (!missao) {

    throw new Error(
      `A missão ${idMissao} não existe no nível ${nivel}.`
    );

  }

  return missao;
}


// ==========================================
// EXIBE A MISSÃO NO TERMINAL
// ==========================================

function imprimirMissao(missao) {

  console.log("\n==========================================");

  console.log(`          ${missao.nome}`);

  console.log("==========================================");

  console.log(`Objetivo: ${missao.descricao}`);

  console.log(`Carga: ${missao.carga}`);

  console.log(
    `Origem: [${missao.origem[0]}, ${missao.origem[1]}]`
  );

  console.log(
    `Destino: [${missao.destino[0]}, ${missao.destino[1]}]`
  );

  console.log("==========================================\n");
}


// ==========================================
// EXPORTAÇÕES
// ==========================================

module.exports = {

  obterMissoes,

  obterMissao,

  imprimirMissao

};