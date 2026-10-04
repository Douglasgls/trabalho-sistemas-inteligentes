import { useState, useEffect, useCallback } from 'react';
import { Bot, MapPin, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, RotateCcw, Star } from 'lucide-react';
import { obterMapa } from './logic/js/mapa';
import { obterMissao } from './logic/js/missao';
import Robo from './logic/js/robo';
import { Movimento } from './logic/js/movimento';

// Import algorithms
import buscaGulosa from './logic/buscas/gulosa';
import aEstrela from './logic/buscas/aestrela';
import heuristicaForte from './logic/heuristicas/heuristicaForte';
import heuristicaFraca from './logic/heuristicas/heuristicaFraca';

const ValueCell = ({ value, min, max, unit = '' }) => {
  const valNum = parseFloat(value);
  let color = 'var(--text-primary)';
  let badge = null;
  if (valNum === min) {
    color = '#34d399';
    badge = <span className="badge badge-best">Melhor</span>;
  } else if (valNum === max && max !== min) {
    color = '#f87171';
    badge = <span className="badge badge-worst">Pior</span>;
  }
  return (
    <td style={{ color, fontWeight: valNum === min ? 'bold' : 'normal' }}>
      {value}{unit} {badge}
    </td>
  );
};

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
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [stars, setStars] = useState(0);

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
    setFloatingTexts([]);
    setStars(0);
  }, [nivel, missaoNum]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Handle Movement
  const moverRobo = useCallback((direcao) => {
    if (gameStatus !== 'playing' || !movimento || !robo || !mapa) return;

    const res = movimento.mover(direcao);
    if (res.sucesso) {
      const novasStats = robo.obterEstatisticas();
      setStats(novasStats);
      
      const custo = mapa.matriz[robo.linha][robo.coluna].custo;
      const id = Date.now() + Math.random();
      
      setFloatingTexts(prev => [...prev, { id, text: `+${custo}`, linha: robo.linha, coluna: robo.coluna }]);
      setTimeout(() => {
        setFloatingTexts(prev => prev.filter(f => f.id !== id));
      }, 1000);

      if (robo.chegouAoDestino(missao.destino)) {
        setGameStatus('finished');
      }
    }
  }, [gameStatus, movimento, robo, missao, mapa]);

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

  const animatePath = (caminho) => {
    if (!caminho) return;
    setPathOverlay([]);
    
    caminho.forEach((node, index) => {
      setTimeout(() => {
        setPathOverlay(prev => {
           if (prev.some(p => p[0] === node[0] && p[1] === node[1])) return prev;
           return [...prev, node];
        });
      }, index * 100);
    });
  };

  const runAIAnalysis = () => {
    setGameStatus('ai_results');
    setPathOverlay([]);
    
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
    
    const optimalCost = results[2]?.custo || stats.custo;
    let calculatedStars = 1;
    if (stats.custo === optimalCost) calculatedStars = 3;
    else if (stats.custo <= optimalCost * 1.3) calculatedStars = 2;
    setStars(calculatedStars);

    if (results[2] && results[2].caminho) {
      const aiPathStr = JSON.stringify(results[2].caminho);
      const playerPathStr = JSON.stringify(robo.obterCaminho());
      setIsPerfectPath(aiPathStr === playerPathStr);
      
      animatePath(results[2].caminho);
    }
  };

  if (!mapa || !missao || !robo) return <div style={{color:'white'}}>Carregando...</div>;

  const robotLeft = robo.coluna * 54 + 25 + 16;
  const robotTop = robo.linha * 54 + 25 + 16;

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
                    border: '1px solid rgba(255,255,255,0.1)', 
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
            
            <h2 style={{borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '0'}}>Missão {missaoNum}</h2>
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
                <h3 style={{color: '#10b981', textShadow: '0 0 10px rgba(16,185,129,0.4)'}}>Missão Concluída!</h3>
                <button className="btn action-btn" onClick={runAIAnalysis}>
                  <Play size={18} style={{marginRight: '8px'}} /> Executar IA
                </button>
              </div>
            )}

            {gameStatus === 'ai_results' && (
              <div style={{marginTop: '2rem'}}>
                <button className="btn action-btn" onClick={initGame} style={{background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white'}}>
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

        <div className="grid-wrapper">
          <div 
            className="grid-container" 
            style={{ 
              gridTemplateColumns: `repeat(${mapa.largura}, 50px)`,
              gridTemplateRows: `repeat(${mapa.altura}, 50px)`
            }}
          >
            {/* Fog of War */}
            <div 
              className="fog-overlay"
              style={{
                WebkitMaskImage: `radial-gradient(circle 200px at ${robotLeft}px ${robotTop}px, transparent 30%, black 90%)`,
                maskImage: `radial-gradient(circle 200px at ${robotLeft}px ${robotTop}px, transparent 30%, black 90%)`,
                opacity: gameStatus === 'playing' ? 1 : 0,
                transition: 'opacity 0.5s ease'
              }}
            />

            {/* Cells Layer */}
            {mapa.matriz.map((linha, i) => (
              linha.map((celula, j) => {
                const isPath = pathOverlay.some(p => p[0] === i && p[1] === j);
                return (
                  <div 
                    key={`${i}-${j}`} 
                    className={`cell ${celula.tipo} ${isPath ? 'path-node' : ''}`}
                    title={`[${i},${j}] ${celula.tipo} (custo: ${celula.custo})`}
                  />
                );
              })
            ))}

            {/* Destination Layer */}
            <div className="dest-layer" style={{ transform: `translate(${missao.destino[1] * 54}px, ${missao.destino[0] * 54}px)` }}>
              <MapPin size={32} className="dest-icon" />
            </div>

            {/* Robot Layer */}
            <div className="robot-layer" style={{ transform: `translate(${robo.coluna * 54}px, ${robo.linha * 54}px)` }}>
              <Bot size={40} className="robot-icon" />
            </div>

            {/* Floating Texts Layer */}
            {floatingTexts.map(ft => (
              <div key={ft.id} className="floating-text" style={{ transform: `translate(${ft.coluna * 54}px, ${ft.linha * 54}px)` }}>
                <div>{ft.text}</div>
              </div>
            ))}

          </div>
        </div>
      </main>

      {gameStatus === 'ai_results' && (
        <div className="panel" style={{width: '100%', marginTop: '2rem'}}>
          <h2>Comparação com a IA</h2>
          
          <div className="stars-container">
            {[1, 2, 3].map(n => (
               <Star key={n} className={`star ${n <= stars ? 'active' : ''}`} size={48} fill={n <= stars ? '#fbbf24' : 'transparent'} strokeWidth={1} />
            ))}
          </div>
          <p style={{textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '1.1rem'}}>
             {stars === 3 ? "Perfeito! Você foi tão eficiente quanto o algoritmo A*." : stars === 2 ? "Muito bom! Mas existe um caminho ligeiramente melhor." : "Você chegou lá, mas gastou muita energia no caminho."}
          </p>

          {(() => {
            const allCosts = [stats.custo, ...aiResults.map(r => r.custo)];
            const minCost = Math.min(...allCosts);
            const maxCost = Math.max(...allCosts);
            const minNodes = Math.min(...aiResults.map(r => r.nosExplorados));
            const maxNodes = Math.max(...aiResults.map(r => r.nosExplorados));
            const minTime = Math.min(...aiResults.map(r => parseFloat(r.tempo)));
            const maxTime = Math.max(...aiResults.map(r => parseFloat(r.tempo)));

            return (
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Abordagem</th>
                    <th>Distância</th>
                    <th>Custo Total</th>
                    <th>Nós Explorados</th>
                    <th>Tempo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="row-player" style={{cursor: 'pointer'}} onClick={() => animatePath(robo.obterCaminho())} title="Clique para ver o seu caminho no mapa">
                    <td>
                      <strong style={{color: '#38bdf8'}}>Você (Jogador)</strong>
                      <br/><span style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>Controle Manual</span>
                    </td>
                    <td>{stats.distancia}</td>
                    <ValueCell value={stats.custo} min={minCost} max={maxCost} />
                    <td style={{color: 'var(--text-secondary)'}}>-</td>
                    <td style={{color: 'var(--text-secondary)'}}>-</td>
                  </tr>
                  {aiResults.map((res, idx) => {
                    const isAStar = res.nome.includes('A*');
                    const rowClass = isAStar ? 'row-a-star' : 'row-greedy';
                    return (
                      <tr key={idx} className={rowClass} style={{cursor: 'pointer'}} onClick={() => animatePath(res.caminho)} title="Clique para ver o caminho">
                        <td>
                          <strong style={{color: isAStar ? '#10b981' : '#f59e0b'}}>{res.nome}</strong>
                          <br/><span style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>{isAStar ? 'Ótimo (Menor custo)' : 'Rápido (Pode errar)'}</span>
                        </td>
                        <td>{res.distancia}</td>
                        <ValueCell value={res.custo} min={minCost} max={maxCost} />
                        <ValueCell value={res.nosExplorados} min={minNodes} max={maxNodes} />
                        <ValueCell value={res.tempo} min={minTime} max={maxTime} unit=" ms" />
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
          })()}
          <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1rem', textAlign: 'center'}}>
            * Clique em uma linha da tabela para visualizar a animação do caminho no mapa.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
