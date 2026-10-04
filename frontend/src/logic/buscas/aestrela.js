// ==========================================
// BUSCA A*
// ==========================================

import No from '../js/no';


// ==========================================
// BUSCA A*
// ==========================================

function aEstrela(mapa, origem, destino, heuristica) {

  // Nós que ainda precisam ser analisados
  const abertos = [];

  // Posições já analisadas
  const fechados = new Set();

  // Melhor custo conhecido para cada posição
  const melhoresCustos = new Map();

  // Quantidade de nós explorados
  let nosExplorados = 0;


  // ==========================================
  // NÓ INICIAL
  // ==========================================

  const hInicial =
    heuristica(origem, destino);

  const noInicial = new No(
    origem[0],
    origem[1],
    null,
    0,
    hInicial
  );

  abertos.push(noInicial);

  melhoresCustos.set(
    `${origem[0]},${origem[1]}`,
    0
  );


  // ==========================================
  // LOOP PRINCIPAL
  // ==========================================

  while (abertos.length > 0) {


    // ========================================
    // ESCOLHE O NÓ COM MENOR F
    // ========================================

    let indiceMelhor = 0;

    for (let i = 1; i < abertos.length; i++) {

      if (
        abertos[i].f <
        abertos[indiceMelhor].f
      ) {

        indiceMelhor = i;

      }

      // Desempate:
      // se F for igual, prefere menor H
      else if (
        abertos[i].f ===
        abertos[indiceMelhor].f
        &&
        abertos[i].heuristica <
        abertos[indiceMelhor].heuristica
      ) {

        indiceMelhor = i;

      }

    }


    const noAtual =
      abertos.splice(indiceMelhor, 1)[0];


    const chaveAtual =
      `${noAtual.linha},${noAtual.coluna}`;


    // ========================================
    // VERIFICA SE É UM CAMINHO PIOR
    // ========================================

    const melhorCustoConhecido =
      melhoresCustos.get(chaveAtual);


    if (
      noAtual.custo >
      melhorCustoConhecido
    ) {

      continue;

    }


    // ========================================
    // VERIFICA SE JÁ FOI EXPLORADO
    // ========================================

    if (fechados.has(chaveAtual)) {

      continue;

    }


    fechados.add(chaveAtual);

    nosExplorados++;


    // ========================================
    // CHEGOU AO DESTINO?
    // ========================================

    if (
      noAtual.linha === destino[0] &&
      noAtual.coluna === destino[1]
    ) {

      const caminho =
        noAtual.obterCaminho();

      return {

        caminho,

        custo: noAtual.custo,

        distancia: caminho.length - 1,

        nosExplorados

      };

    }


    // ========================================
    // MOVIMENTOS POSSÍVEIS
    // ========================================

    const movimentos = [

      [-1, 0], // cima
      [1, 0],  // baixo
      [0, -1], // esquerda
      [0, 1]   // direita

    ];


    // ========================================
    // ANALISA OS VIZINHOS
    // ========================================

    for (
      const [deltaLinha, deltaColuna]
      of movimentos
    ) {

      const novaLinha =
        noAtual.linha + deltaLinha;

      const novaColuna =
        noAtual.coluna + deltaColuna;


      // ======================================
      // VERIFICA LIMITES
      // ======================================

      if (
        novaLinha < 0 ||
        novaLinha >= mapa.altura ||
        novaColuna < 0 ||
        novaColuna >= mapa.largura
      ) {

        continue;

      }


      // ======================================
      // OBTÉM A CÉLULA
      // ======================================

      const celula =
        mapa.matriz[novaLinha][novaColuna];


      // ======================================
      // IGNORA BARREIRA
      // ======================================

      if (
        celula.tipo === "barreira"
      ) {

        continue;

      }


      // ======================================
      // CALCULA NOVO CUSTO
      // ======================================

      const novoCusto =
        noAtual.custo +
        celula.custo;


      const chaveVizinho =
        `${novaLinha},${novaColuna}`;


      // ======================================
      // VERIFICA MELHOR CUSTO
      // ======================================

      const custoAnterior =
        melhoresCustos.get(chaveVizinho);


      if (
        custoAnterior !== undefined &&
        novoCusto >= custoAnterior
      ) {

        continue;

      }


      // ======================================
      // NOVO MELHOR CAMINHO
      // ======================================

      melhoresCustos.set(
        chaveVizinho,
        novoCusto
      );


      // ======================================
      // CALCULA HEURÍSTICA
      // ======================================

      const novoH =
        heuristica(
          [novaLinha, novaColuna],
          destino
        );


      // ======================================
      // CRIA NOVO NÓ
      // ======================================

      const novoNo = new No(

        novaLinha,

        novaColuna,

        noAtual,

        novoCusto,

        novoH

      );


      // ======================================
      // F = G + H
      // ======================================

      novoNo.f =
        novoCusto + novoH;


      abertos.push(novoNo);

    }

  }


  // ==========================================
  // NENHUM CAMINHO
  // ==========================================

  return {

    caminho: null,

    custo: Infinity,

    distancia: Infinity,

    nosExplorados

  };

}


// ==========================================
// EXPORTAÇÃO
// ==========================================

export default aEstrela;