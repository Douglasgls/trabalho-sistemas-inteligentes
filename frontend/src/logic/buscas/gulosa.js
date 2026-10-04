// ==========================================
// BUSCA GULOSA
// ==========================================

import No from '../js/no';


// ==========================================
// BUSCA GULOSA
// ==========================================

function buscaGulosa(mapa, origem, destino, heuristica) {

  // ========================================
  // LISTA DE NÓS A SEREM EXPLORADOS
  // ========================================

  const abertos = [];


  // ========================================
  // POSIÇÕES JÁ EXPLORADAS
  // ========================================

  const fechados = new Set();


  // ========================================
  // CONTADOR DE NÓS EXPLORADOS
  // ========================================

  let nosExplorados = 0;


  // ========================================
  // HEURÍSTICA DO NÓ INICIAL
  // ========================================

  const hInicial =
    heuristica(origem, destino);


  // ========================================
  // CRIA O NÓ INICIAL
  // ========================================

  const noInicial = new No(
    origem[0],
    origem[1],
    null,
    0,
    hInicial
  );


  // Na busca Gulosa, o valor usado
  // para escolher o próximo nó é h.
  noInicial.f = hInicial;


  abertos.push(noInicial);


  // ========================================
  // LOOP PRINCIPAL
  // ========================================

  while (abertos.length > 0) {


    // ======================================
    // ENCONTRA O NÓ COM MENOR H
    // ======================================

    let indiceMelhor = 0;

    for (let i = 1; i < abertos.length; i++) {

      if (
        abertos[i].heuristica <
        abertos[indiceMelhor].heuristica
      ) {

        indiceMelhor = i;

      }

    }


    // Remove o melhor nó
    const noAtual =
      abertos.splice(indiceMelhor, 1)[0];


    // ======================================
    // IDENTIFICA A POSIÇÃO
    // ======================================

    const chaveAtual =
      `${noAtual.linha},${noAtual.coluna}`;


    // Evita explorar novamente
    if (fechados.has(chaveAtual)) {

      continue;

    }


    // Marca como explorado
    fechados.add(chaveAtual);

    nosExplorados++;


    // ======================================
    // VERIFICA SE CHEGOU AO DESTINO
    // ======================================

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


    // ======================================
    // MOVIMENTOS POSSÍVEIS
    // ======================================

    const movimentos = [

      [-1, 0], // cima
      [1, 0],  // baixo
      [0, -1], // esquerda
      [0, 1]   // direita

    ];


    // ======================================
    // ANALISA OS VIZINHOS
    // ======================================

    for (const [deltaLinha, deltaColuna] of movimentos) {

      const novaLinha =
        noAtual.linha + deltaLinha;

      const novaColuna =
        noAtual.coluna + deltaColuna;


      // --------------------------------------
      // VERIFICA LIMITES
      // --------------------------------------

      if (
        novaLinha < 0 ||
        novaLinha >= mapa.altura ||
        novaColuna < 0 ||
        novaColuna >= mapa.largura
      ) {

        continue;

      }


      // --------------------------------------
      // OBTÉM A CÉLULA
      // --------------------------------------

      const celula =
        mapa.matriz[novaLinha][novaColuna];


      // --------------------------------------
      // IGNORA BARREIRAS
      // --------------------------------------

      if (celula.tipo === "barreira") {

        continue;

      }


      // --------------------------------------
      // VERIFICA SE JÁ FOI EXPLORADA
      // --------------------------------------

      const chaveVizinho =
        `${novaLinha},${novaColuna}`;


      if (fechados.has(chaveVizinho)) {

        continue;

      }


      // --------------------------------------
      // CALCULA O CUSTO ACUMULADO
      // --------------------------------------

      const novoCusto =
        noAtual.custo + celula.custo;


      // --------------------------------------
      // CALCULA A HEURÍSTICA
      // --------------------------------------

      const novoH =
        heuristica(
          [novaLinha, novaColuna],
          destino
        );


      // --------------------------------------
      // CRIA O NOVO NÓ
      // --------------------------------------

      const novoNo = new No(

        novaLinha,

        novaColuna,

        noAtual,

        novoCusto,

        novoH

      );


      // --------------------------------------
      // NA GULOSA:
      // f = h
      // --------------------------------------

      novoNo.f = novoH;


      // --------------------------------------
      // ADICIONA À LISTA DE ABERTOS
      // --------------------------------------

      abertos.push(novoNo);

    }

  }


  // ========================================
  // NENHUM CAMINHO ENCONTRADO
  // ========================================

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

export default buscaGulosa;