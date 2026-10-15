// ==========================================
// BUSCA A*
// ==========================================

const No = require("../js/no");


// ==========================================
// BUSCA A*
// ==========================================

function aEstrela(mapa, origem, destino, heuristica, gravarHistorico = false) {

  // Nós que ainda precisam ser analisados
  const abertos = [];

  // Posições já analisadas
  const fechados = new Set();

  // Melhor custo conhecido para cada posição
  const melhoresCustos = new Map();

  // Quantidade de nós explorados
  let nosExplorados = 0;

  // Histórico passo a passo (caso solicitado para visualização e logs)
  const historico = [];


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
            f: noAtual.f
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


    // ========================================
    // MOVIMENTOS POSSÍVEIS
    // ========================================

    const movimentos = [

      { nome: "cima", dL: -1, dC: 0 },
      { nome: "baixo", dL: 1, dC: 0 },
      { nome: "esquerda", dL: 0, dC: -1 },
      { nome: "direita", dL: 0, dC: 1 }

    ];

    const vizinhosPasso = [];


    // ========================================
    // ANALISA OS VIZINHOS
    // ========================================

    for (const mov of movimentos) {

      const novaLinha =
        noAtual.linha + mov.dL;

      const novaColuna =
        noAtual.coluna + mov.dC;


      // ======================================
      // VERIFICA LIMITES
      // ======================================

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

        if (gravarHistorico) {
          const hViz = heuristica([novaLinha, novaColuna], destino);
          vizinhosPasso.push({
            direcao: mov.nome,
            posicao: [novaLinha, novaColuna],
            terreno: celula.tipo,
            custoTerreno: celula.custo,
            g: novoCusto,
            h: hViz,
            f: novoCusto + hViz,
            status: "ignorado_custo",
            motivo: `Caminho já conhecido é melhor ou igual (g=${custoAnterior})`
          });
        }

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

      if (gravarHistorico) {
        vizinhosPasso.push({
          direcao: mov.nome,
          posicao: [novaLinha, novaColuna],
          terreno: celula.tipo,
          custoTerreno: celula.custo,
          g: novoCusto,
          h: novoH,
          f: novoNo.f,
          status: "adicionado",
          motivo: `f = g (${novoCusto}) + h (${novoH}) = ${novoNo.f} - Adicionado à fronteira`
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
          f: noAtual.f
        },
        motivoEscolha: `Menor f = g + h (${noAtual.custo} + ${noAtual.heuristica} = ${noAtual.f})`,
        abertos: abertos.map(n => [n.linha, n.coluna]),
        fechados: Array.from(fechados).map(k => k.split(",").map(Number)),
        vizinhos: vizinhosPasso
      });
    }

  }


  // ==========================================
  // NENHUM CAMINHO
  // ==========================================

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

module.exports = aEstrela;