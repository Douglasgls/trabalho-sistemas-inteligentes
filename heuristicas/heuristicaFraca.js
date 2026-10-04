// ==========================================
// HEURÍSTICA FRACA
// DISTÂNCIA DE CHEBYSHEV
// ==========================================


// ==========================================
// CALCULA A DISTÂNCIA DE CHEBYSHEV
// ==========================================

function heuristicaFraca(posicaoAtual, objetivo) {

  const [linhaAtual, colunaAtual] = posicaoAtual;

  const [linhaObjetivo, colunaObjetivo] = objetivo;


  const distanciaLinha =
    Math.abs(linhaAtual - linhaObjetivo);

  const distanciaColuna =
    Math.abs(colunaAtual - colunaObjetivo);


  return Math.max(
    distanciaLinha,
    distanciaColuna
  );
}


// ==========================================
// EXPORTAÇÃO
// ==========================================

module.exports = heuristicaFraca;