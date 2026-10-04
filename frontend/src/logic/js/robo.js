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
  // VERIFICA SE O ROBÔ ESTÁ NO DESTINO
  // ==========================================

  chegouAoDestino(destino) {

    return (
      this.linha === destino[0] &&
      this.coluna === destino[1]
    );

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

  }

}


// ==========================================
// EXPORTAÇÃO
// ==========================================

export default Robo;