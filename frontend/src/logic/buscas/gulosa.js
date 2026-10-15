// ==========================================
// BUSCA GULOSA
// ==========================================

import No from '../js/no';


// ==========================================
// BUSCA GULOSA
// ==========================================

function buscaGulosa(mapa, origem, destino, heuristica, gravarHistorico = false) {

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

  // Histórico passo a passo (caso solicitado para visualização e logs)
  const historico = [];


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

      if (gravarHistorico) {
        historico.push({
          passo: historico.length + 1,
          tipo: "destino_encontrado",
          noAtual: {
            linha: noAtual.linha,
            coluna: noAtual.coluna,
            terreno: mapa.matriz[noAtual.linha][noAtual.coluna].tipo,
            custo: mapa.matriz[noAtual.linha][noAtual.coluna].custo,
            g: noAtual.custo,
            h: noAtual.heuristica,
            f: noAtual.heuristica
          },
          motivoEscolha: `Destino [${destino[0]}, ${destino[1]}] alcançado!`,
          abertos: abertos.map(n => [n.linha, n.coluna]),
          fechados: Array.from(fechados).map(k => k.split(",").map(Number)),
          vizinhos: []
        });
      }

      return {

        caminho,

        custo: noAtual.custo,

        distancia: caminho.length - 1,

        nosExplorados,

        ...(gravarHistorico ? { historico } : {})

      };

    }


    // ======================================
    // MOVIMENTOS POSSÍVEIS
    // ======================================

    const movimentos = [

      { nome: "cima", dL: -1, dC: 0 },
      { nome: "baixo", dL: 1, dC: 0 },
      { nome: "esquerda", dL: 0, dC: -1 },
      { nome: "direita", dL: 0, dC: 1 }

    ];

    const vizinhosPasso = [];


    // ======================================
    // ANALISA OS VIZINHOS
    // ======================================

    for (const mov of movimentos) {

      const novaLinha =
        noAtual.linha + mov.dL;

      const novaColuna =
        noAtual.coluna + mov.dC;


      // --------------------------------------
      // VERIFICA LIMITES
      // --------------------------------------

      if (
        novaLinha < 0 ||
        novaLinha >= mapa.altura ||
        novaColuna < 0 ||
        novaColuna >= mapa.largura
      ) {

        if (gravarHistorico) {
          vizinhosPasso.push({
            direcao: mov.nome,
            posicao: [novaLinha, novaColuna],
            status: "fora_limites",
            motivo: "Fora dos limites do mapa"
          });
        }

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

        if (gravarHistorico) {
          vizinhosPasso.push({
            direcao: mov.nome,
            posicao: [novaLinha, novaColuna],
            terreno: "barreira",
            status: "barreira",
            motivo: "Intransponível (Barreira)"
          });
        }

        continue;

      }


      // --------------------------------------
      // VERIFICA SE JÁ FOI EXPLORADA
      // --------------------------------------

      const chaveVizinho =
        `${novaLinha},${novaColuna}`;


      if (fechados.has(chaveVizinho)) {

        if (gravarHistorico) {
          const hViz = heuristica([novaLinha, novaColuna], destino);
          vizinhosPasso.push({
            direcao: mov.nome,
            posicao: [novaLinha, novaColuna],
            terreno: celula.tipo,
            custoTerreno: celula.custo,
            g: noAtual.custo + celula.custo,
            h: hViz,
            f: hViz,
            status: "ja_explorado",
            motivo: "Já foi visitado/fechado anteriormente"
          });
        }

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

      if (gravarHistorico) {
        vizinhosPasso.push({
          direcao: mov.nome,
          posicao: [novaLinha, novaColuna],
          terreno: celula.tipo,
          custoTerreno: celula.custo,
          g: novoCusto,
          h: novoH,
          f: novoH,
          status: "adicionado",
          motivo: `h = ${novoH} (custo g=${novoCusto} ignorado) - Adicionado à fronteira`
        });
      }

    }

    if (gravarHistorico) {
      historico.push({
        passo: historico.length + 1,
        tipo: "expandir",
        noAtual: {
          linha: noAtual.linha,
          coluna: noAtual.coluna,
          terreno: mapa.matriz[noAtual.linha][noAtual.coluna].tipo,
          custo: mapa.matriz[noAtual.linha][noAtual.coluna].custo,
          g: noAtual.custo,
          h: noAtual.heuristica,
          f: noAtual.heuristica
        },
        motivoEscolha: `Menor heurística h = ${noAtual.heuristica} (custo acumulado g=${noAtual.custo} é ignorado)`,
        abertos: abertos.map(n => [n.linha, n.coluna]),
        fechados: Array.from(fechados).map(k => k.split(",").map(Number)),
        vizinhos: vizinhosPasso
      });
    }

  }


  // ========================================
  // NENHUM CAMINHO ENCONTRADO
  // ========================================

  return {

    caminho: null,

    custo: Infinity,

    distancia: Infinity,

    nosExplorados,

    ...(gravarHistorico ? { historico } : {})

  };

}


// ==========================================
// EXPORTAÇÃO
// ==========================================

export default buscaGulosa;