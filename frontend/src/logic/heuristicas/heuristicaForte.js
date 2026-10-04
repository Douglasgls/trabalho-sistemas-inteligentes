// ==========================================
// HEURÍSTICA FORTE
// DISTÂNCIA DE MANHATTAN
// ==========================================


// ==========================================
// CALCULA A DISTÂNCIA DE MANHATTAN
// ==========================================

function heuristicaForte(posicaoAtual, objetivo) {

  const [linhaAtual, colunaAtual] = posicaoAtual;

  const [linhaObjetivo, colunaObjetivo] = objetivo;


  const distanciaLinha =
    Math.abs(linhaAtual - linhaObjetivo);

  const distanciaColuna =
    Math.abs(colunaAtual - colunaObjetivo);


  return distanciaLinha + distanciaColuna;
}


// ==========================================
// EXPORTAÇÃO
// ==========================================

export default heuristicaForte;