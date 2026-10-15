// ==========================================
// ROBÔ DA FÁBRICA INTELIGENTE
// ==========================================

class Robo {

  constructor(linha, coluna) {

    // Posição atual do robô
    this.linha = linha;
    this.coluna = coluna;

    // Caminho realizado pelo jogador
    this.caminho = [
      [linha, coluna]
    ];

    // Custo total do percurso
    this.custoTotal = 0;

    // Quantidade de movimentos realizados
    this.movimentos = 0;

    // Estado da peça (para ativar a saída)
    this.temPeca = false;
  }


  // ==========================================
  // RETORNA A POSIÇÃO ATUAL
  // ==========================================

  obterPosicao() {

    return [
      this.linha,
      this.coluna
    ];

  }


  // ==========================================
  // COLETA A PEÇA
  // ==========================================

  coletarPeca() {
    this.temPeca = true;
  }


  // ==========================================
  // MOVE O ROBÔ PARA UMA NOVA POSIÇÃO
  // ==========================================

  mover(linha, coluna, custo) {

    this.linha = linha;
    this.coluna = coluna;

    // Registra a posição no caminho do jogador
    this.caminho.push([
      linha,
      coluna
    ]);

    // Atualiza o custo
    this.custoTotal += custo;

    // Atualiza quantidade de movimentos
    this.movimentos++;
  }


  // ==========================================
  // RETORNA O CAMINHO REALIZADO
  // ==========================================

  obterCaminho() {

    return this.caminho;

  }


  // ==========================================
  // RETORNA AS ESTATÍSTICAS DO PERCURSO
  // ==========================================

  obterEstatisticas() {

    return {

      movimentos: this.movimentos,

      custo: this.custoTotal,

      distancia: this.caminho.length - 1

    };

  }


  // ==========================================
  // VERIFICA SE O ROBÔ ESTÁ NO DESTINO COM A PEÇA
  // ==========================================

  chegouAoDestino(destino, precisaPeca = true) {

    const estaNaPosicao = (
      this.linha === destino[0] &&
      this.coluna === destino[1]
    );

    if (!estaNaPosicao) {
      return false;
    }

    if (precisaPeca) {
      return this.temPeca;
    }

    return true;
  }


  // ==========================================
  // REINICIA O ROBÔ
  // ==========================================

  reiniciar(linha, coluna) {

    this.linha = linha;
    this.coluna = coluna;

    this.caminho = [
      [linha, coluna]
    ];

    this.custoTotal = 0;

    this.movimentos = 0;

    this.temPeca = false;

  }

}


// ==========================================
// EXPORTAÇÃO
// ==========================================

module.exports = Robo;