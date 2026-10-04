import { useState, useEffect, useCallback } from 'react';
import { Bot, MapPin, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, RotateCcw } from 'lucide-react';
import { obterMapa } from './logic/js/mapa';
import { obterMissao } from './logic/js/missao';
import Robo from './logic/js/robo';
import { Movimento } from './logic/js/movimento';

// Import algorithms
import buscaGulosa from './logic/buscas/gulosa';
import aEstrela from './logic/buscas/aestrela';
import heuristicaForte from './logic/heuristicas/heuristicaForte';
import heuristicaFraca from './logic/heuristicas/heuristicaFraca';

function App() {
  const [nivel, setNivel] = useState(1);
  const [missaoNum] = useState(1);
  
  const [mapa, setMapa] = useState(null);
  const [missao, setMissao] = useState(null);
  const [robo, setRobo] = useState(null);
  const [movimento, setMovimento] = useState(null);
  
  const [gameStatus, setGameStatus] = useState('playing'); // playing, finished, ai_results
  const [stats, setStats] = useState({ distancia: 0, custo: 0, movimentos: 0 });
  const [aiResults, setAiResults] = useState([]);
  const [pathOverlay, setPathOverlay] = useState([]);
  const [isPerfectPath, setIsPerfectPath] = useState(false);

  // Initialize Game
  const initGame = useCallback(() => {
    const newMapa = obterMapa(nivel);
    const newMissao = obterMissao(nivel, missaoNum);
    const newRobo = new Robo(newMissao.origem[0], newMissao.origem[1]);
    const newMovimento = new Movimento(newMapa, newRobo);
    
    setMapa(newMapa);
    setMissao(newMissao);
    setRobo(newRobo);
    setMovimento(newMovimento);
    setGameStatus('playing');
    setStats({ distancia: 0, custo: 0, movimentos: 0 });
    setAiResults([]);
    setPathOverlay([]);
    setIsPerfectPath(false);
  }, [nivel, missaoNum]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Handle Movement
  const moverRobo = useCallback((direcao) => {
    if (gameStatus !== 'playing' || !movimento || !robo) return;

    const res = movimento.mover(direcao);
    if (res.sucesso) {
      // Force re-render with new reference if needed, but robo is mutated.
      // Since robo mutates, we spread it or update a dummy state to force render.
      setStats(robo.obterEstatisticas());

      if (robo.chegouAoDestino(missao.destino)) {
        setGameStatus('finished');
      }
    }
  }, [gameStatus, movimento, robo, missao]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.key.toLowerCase()) {
        case 'w': moverRobo('cima'); break;
        case 'a': moverRobo('esquerda'); break;
        case 's': moverRobo('baixo'); break;
        case 'd': moverRobo('direita'); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moverRobo]);

  const runAIAnalysis = () => {
    setGameStatus('ai_results');
    
    const algorithms = [
      { nome: "Gulosa + Manhattan", func: buscaGulosa, heuristica: heuristicaForte },
      { nome: "Gulosa + Chebyshev", func: buscaGulosa, heuristica: heuristicaFraca },
      { nome: "A* + Manhattan", func: aEstrela, heuristica: heuristicaForte },
      { nome: "A* + Chebyshev", func: aEstrela, heuristica: heuristicaFraca }
    ];

    const results = algorithms.map(alg => {
      const inicio = performance.now();
      const res = alg.func(mapa, missao.origem, missao.destino, alg.heuristica);
      const fim = performance.now();
      return {
        ...res,
        nome: alg.nome,
        tempo: (fim - inicio).toFixed(2)
      };
    });

    setAiResults(results);
    
    // Check if player's path is identical to the best AI path
    if (results[2] && results[2].caminho) {
      const aiPathStr = JSON.stringify(results[2].caminho);
      const playerPathStr = JSON.stringify(robo.obterCaminho());
      setIsPerfectPath(aiPathStr === playerPathStr);
      setPathOverlay(results[2].caminho);
    }
  };

  const showPath = (caminho) => {
    if (caminho) setPathOverlay(caminho);
  };

  if (!mapa || !missao || !robo) return <div>Carregando...</div>;

  return (
    <div className="app-container">
      <header className="header">
        <h1>Fábrica Inteligente</h1>
        <p>Encontre o melhor caminho até o destino!</p>
      </header>

      <main className="main-content">
        <div className="sidebar">
          <div className="panel">
            <div className="level-selector" style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem', justifyContent: 'center'}}>
              {[1, 2, 3].map(n => (
                <button 
                  key={n} 
                  style={{
                    padding: '0.5rem 1rem', 
                    background: nivel === n ? 'var(--brand)' : 'var(--surface-hover)', 
                    border: '1px solid var(--border)', 
                    color: 'white', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    fontWeight: 'bold',
                    flex: 1
                  }}
                  onClick={() => {
                    if (window.confirm(`Mudar para a Fase ${n}? O progresso atual será perdido.`)) {
                      setNivel(n);
                    }
                  }}
                >
                  Fase {n}
                </button>
              ))}
            </div>
            
            <h2 style={{borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', marginTop: '0'}}>Missão {missaoNum}</h2>
          <div className="stats">
            <div className="stat-item">
              <span>Distância</span>
              <span className="stat-value">{stats.distancia}</span>
            </div>
            <div className="stat-item">
              <span>Custo Total</span>
              <span className="stat-value">{stats.custo}</span>
            </div>
            <div className="stat-item">
              <span>Movimentos</span>
              <span className="stat-value">{stats.movimentos}</span>
            </div>
          </div>

          {gameStatus === 'playing' && (
            <div className="controls">
              <button className="btn btn-up" onClick={() => moverRobo('cima')}><ArrowUp /></button>
              <button className="btn btn-left" onClick={() => moverRobo('esquerda')}><ArrowLeft /></button>
              <button className="btn btn-down" onClick={() => moverRobo('baixo')}><ArrowDown /></button>
              <button className="btn btn-right" onClick={() => moverRobo('direita')}><ArrowRight /></button>
            </div>
          )}

          {gameStatus === 'finished' && (
            <div style={{marginTop: '2rem'}}>
              <h3 style={{color: '#10b981'}}>Missão Concluída!</h3>
              <button className="btn action-btn" onClick={runAIAnalysis}>
                <Play size={18} style={{marginRight: '8px'}} /> Executar IA
              </button>
            </div>
          )}

          {gameStatus === 'ai_results' && (
            <div style={{marginTop: '2rem'}}>
               <button className="btn action-btn" onClick={initGame} style={{background: 'transparent', border: '1px solid var(--border)'}}>
                <RotateCcw size={18} style={{marginRight: '8px'}} /> Jogar Novamente
              </button>
            </div>
          )}
          </div>

          <div className="panel legend-panel">
            <div className="legend-item">
              <div className="cell-mini estrada"></div>
              <span>Peso: 1</span>
            </div>
            <div className="legend-item">
              <div className="cell-mini terra"></div>
              <span>Peso: 3</span>
            </div>
            <div className="legend-item">
              <div className="cell-mini lama"></div>
              <span>Peso: 5</span>
            </div>
            <div className="legend-item">
              <div className="cell-mini barreira"></div>
              <span>Bloqueado</span>
            </div>
          </div>
        </div>

        <div 
          className="grid-container" 
          style={{ gridTemplateColumns: `repeat(${mapa.largura}, 1fr)` }}
        >
          {mapa.matriz.map((linha, i) => (
            linha.map((celula, j) => {
              const isRobot = robo.linha === i && robo.coluna === j;
              const isDest = missao.destino[0] === i && missao.destino[1] === j;
              
              // Check if part of AI path
              const isPath = pathOverlay.some(p => p[0] === i && p[1] === j);

              return (
                <div 
                  key={`${i}-${j}`} 
                  className={`cell ${celula.tipo} ${isPath ? 'path-node' : ''}`}
                  title={`[${i},${j}] ${celula.tipo} (custo: ${celula.custo})`}
                >
                  {isRobot && <Bot size={32} className="robot-icon" />}
                  {isDest && !isRobot && <MapPin size={28} className="dest-icon" />}
                </div>
              );
            })
          ))}
        </div>
      </main>

      {gameStatus === 'ai_results' && (
        <div className="panel" style={{width: '100%'}}>
          <h2>Comparação com a IA</h2>
          {isPerfectPath && (
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #10b981' }}>
              <strong>🎉 Parabéns!</strong> Você encontrou exatamente o mesmo trajeto perfeito calculado pelo algoritmo A-Estrela!
            </div>
          )}
          <table className="results-table">
            <thead>
              <tr>
                <th>Abordagem</th>
                <th>Distância</th>
                <th>Custo</th>
                <th>Nós Explorados</th>
                <th>Tempo (ms)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{cursor: 'pointer', background: 'rgba(255,255,255,0.05)'}} onClick={() => showPath(robo.obterCaminho())} title="Clique para ver o seu caminho no mapa">
                <td><strong>Você (Jogador)</strong></td>
                <td>{stats.distancia}</td>
                <td>{stats.custo}</td>
                <td>-</td>
                <td>-</td>
              </tr>
              {aiResults.map((res, idx) => (
                <tr key={idx} style={{cursor: 'pointer'}} onClick={() => showPath(res.caminho)} title="Clique para ver o caminho">
                  <td>{res.nome}</td>
                  <td>{res.distancia}</td>
                  <td>{res.custo}</td>
                  <td>{res.nosExplorados}</td>
                  <td>{res.tempo}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1rem'}}>
            * Clique em uma linha da tabela para visualizar o caminho encontrado pela IA no mapa.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
