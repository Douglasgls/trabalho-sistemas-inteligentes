// ==========================================
// MOVIMENTAÇÃO DO ROBÔ
// ==========================================


// Direções possíveis
const DIRECOES = {
  cima: [-1, 0],
  baixo: [1, 0],
  esquerda: [0, -1],
  direita: [0, 1]
};

// CLASSE MOVIMENTO

class Movimento {

  constructor(mapa, robo) {

    this.mapa = mapa;
    this.robo = robo;

  }

  // TENTA REALIZAR UM MOVIMENTO

  mover(direcao) {

    // Verifica se a direção existe
    if (!DIRECOES[direcao]) {

      return {
        sucesso: false,
        mensagem: "Direção inválida."
      };

    }


    // Obtém a posição atual
    const [linhaAtual, colunaAtual] =
      this.robo.obterPosicao();


    // Obtém o deslocamento da direção
    const [deltaLinha, deltaColuna] =
      DIRECOES[direcao];


    // Calcula a nova posição
    const novaLinha =
      linhaAtual + deltaLinha;

    const novaColuna =
      colunaAtual + deltaColuna;


    // ==========================================
    // VERIFICA SE ESTÁ DENTRO DO MAPA
    // ==========================================

    if (!this.posicaoValida(novaLinha, novaColuna)) {

      return {
        sucesso: false,
        mensagem: "Movimento inválido: fora do mapa."
      };

    }


    // Obtém a célula de destino
    const celula =
      this.mapa.matriz[novaLinha][novaColuna];

    // VERIFICA SE É UMA BARREIRA

    if (celula.tipo === "barreira") {

      return {
        sucesso: false,
        mensagem: "Movimento inválido: existe um obstáculo."
      };

    }

    // REALIZA O MOVIMENTO

    this.robo.mover(
      novaLinha,
      novaColuna,
      celula.custo
    );


    return {
      sucesso: true,
      mensagem: "Movimento realizado.",
      posicao: [novaLinha, novaColuna],
      custo: celula.custo,
      terreno: celula.tipo
    };

  }


  // VERIFICA SE UMA POSIÇÃO EXISTE NO MAPA

  posicaoValida(linha, coluna) {

    return (
      linha >= 0 &&
      linha < this.mapa.altura &&
      coluna >= 0 &&
      coluna < this.mapa.largura
    );

  }

  // VERIFICA SE UMA POSIÇÃO É TRANSITÁVEL

  posicaoTransitada(linha, coluna) {

    if (!this.posicaoValida(linha, coluna)) {
      return false;
    }

    return (
      this.mapa.matriz[linha][coluna].tipo !==
      "barreira"
    );

  }

  // OBTÉM AS MOVIMENTAÇÕES POSSÍVEIS

  obterMovimentosPossiveis() {

    const movimentos = [];

    const [linha, coluna] =
      this.robo.obterPosicao();


    for (const direcao in DIRECOES) {

      const [deltaLinha, deltaColuna] =
        DIRECOES[direcao];

      const novaLinha =
        linha + deltaLinha;

      const novaColuna =
        coluna + deltaColuna;


      if (
        this.posicaoTransitada(
          novaLinha,
          novaColuna
        )
      ) {

        movimentos.push({
          direcao,
          posicao: [
            novaLinha,
            novaColuna
          ],
          custo:
            this.mapa
              .matriz[novaLinha][novaColuna]
              .custo
        });

      }

    }

    return movimentos;

  }

}


// ==========================================
// EXPORTAÇÃO
// ==========================================

export { 
  Movimento,
  DIRECOES
 };