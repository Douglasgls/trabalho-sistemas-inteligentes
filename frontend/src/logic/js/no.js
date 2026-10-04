// ==========================================
// NÓ DE BUSCA
// ==========================================

class No {

  constructor(linha, coluna, pai = null, custo = 0, heuristica = 0) {

    // Posição do nó no mapa
    this.linha = linha;
    this.coluna = coluna;

    // Nó anterior no caminho
    this.pai = pai;

    // Custo acumulado desde a origem
    this.custo = custo;

    // Estimativa até o objetivo
    this.heuristica = heuristica;

    // Valor utilizado pelos algoritmos
    this.f = custo + heuristica;
  }


  // ==========================================
  // RETORNA A POSIÇÃO DO NÓ
  // ==========================================

  obterPosicao() {

    return [
      this.linha,
      this.coluna
    ];

  }


  // ==========================================
  // VERIFICA SE O NÓ É IGUAL A UMA POSIÇÃO
  // ==========================================

 igual(linha, coluna) {

    return (
      this.linha === linha &&
      this.coluna === coluna
    );

  }


  // ==========================================
  // RECONSTRÓI O CAMINHO
  // ==========================================

  obterCaminho() {

    const caminho = [];

    let noAtual = this;


    while (noAtual !== null) {

      caminho.unshift([
        noAtual.linha,
        noAtual.coluna
      ]);

      noAtual = noAtual.pai;

    }


    return caminho;

  }

}


// ==========================================
// EXPORTAÇÃO
// ==========================================

export default No;