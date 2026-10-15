import { useState, useEffect, useCallback } from 'react';
import { 
  Bot, 
  MapPin, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw, 
  Package, 
  Lock, 
  CheckCircle2, 
  CircleDot, 
  Compass, 
  Eye,
  FastForward,
  Home
} from 'lucide-react';
import StartScreen from './components/StartScreen';
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
  
  const [mapa, setMapa] = useState(() => obterMapa(1));
  const [missao, setMissao] = useState(() => obterMissao(1, 1));
  const [robo, setRobo] = useState(() => {
    const m = obterMissao(1, 1);
    return new Robo(m.origem[0], m.origem[1]);
  });
  const [movimento, setMovimento] = useState(() => {
    const mp = obterMapa(1);
    const m = obterMissao(1, 1);
    const rb = new Robo(m.origem[0], m.origem[1]);
    return new Movimento(mp, rb);
  });
  const [temPeca, setTemPeca] = useState(false);
  
  const [gameStatus, setGameStatus] = useState('start'); // start, playing, finished, ai_results
  const [stats, setStats] = useState({ distancia: 0, custo: 0 });
  const [aiResults, setAiResults] = useState([]);
  const [floatingTexts, setFloatingTexts] = useState([]);

  // AI Step-by-Step Visualization State
  const [selectedAlgIndex, setSelectedAlgIndex] = useState(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(100); // ms per step
  const [showFinalPath, setShowFinalPath] = useState(false);

  // Start / Play Game from Start Screen or Level Selector
  const iniciarJogo = useCallback((lvl = 1) => {
    setNivel(lvl);
    const newMapa = obterMapa(lvl);
    const newMissao = obterMissao(lvl, missaoNum);
    const newRobo = new Robo(newMissao.origem[0], newMissao.origem[1]);
    const newMovimento = new Movimento(newMapa, newRobo);
    
    setMapa(newMapa);
    setMissao(newMissao);
    setRobo(newRobo);
    setMovimento(newMovimento);
    setTemPeca(false);
    setGameStatus('playing');
    setStats({ distancia: 0, custo: 0 });
    setAiResults([]);
    setSelectedAlgIndex(null);
    setActiveStepIndex(0);
    setIsPlaying(false);
    setShowFinalPath(false);
    setFloatingTexts([]);
  }, [missaoNum]);

  // Re-initialize Game in the current level
  const initGame = useCallback(() => {
    const newMapa = obterMapa(nivel);
    const newMissao = obterMissao(nivel, missaoNum);
    const newRobo = new Robo(newMissao.origem[0], newMissao.origem[1]);
    const newMovimento = new Movimento(newMapa, newRobo);
    
    setMapa(newMapa);
    setMissao(newMissao);
    setRobo(newRobo);
    setMovimento(newMovimento);
    setTemPeca(false);
    setGameStatus('playing');
    setStats({ distancia: 0, custo: 0 });
    setAiResults([]);
    setSelectedAlgIndex(null);
    setActiveStepIndex(0);
    setIsPlaying(false);
    setShowFinalPath(false);
    setFloatingTexts([]);
  }, [nivel, missaoNum]);

  useEffect(() => {
    if (gameStatus !== 'start') {
      initGame();
    }
  }, [nivel, missaoNum]);

  // Handle Player Movement
  const moverRobo = useCallback((direcao) => {
    if (gameStatus !== 'playing' || !movimento || !robo || !mapa || !missao) return;

    const res = movimento.mover(direcao);
    if (res.sucesso) {
      const novasStats = robo.obterEstatisticas();
      setStats({ distancia: novasStats.distancia, custo: novasStats.custo });
      
      const custo = mapa.matriz[robo.linha][robo.coluna].custo;
      const id = Date.now() + Math.random();
      
      setFloatingTexts(prev => [...prev, { id, text: `+${custo}`, linha: robo.linha, coluna: robo.coluna }]);
      setTimeout(() => {
        setFloatingTexts(prev => prev.filter(f => f.id !== id));
      }, 1000);

      // Coleta da peça se alcançar a coordenada
      if (missao.peca && !robo.temPeca && robo.linha === missao.peca[0] && robo.coluna === missao.peca[1]) {
        robo.coletarPeca();
        setTemPeca(true);
        const specialId = Date.now() + Math.random();
        setFloatingTexts(prev => [
          ...prev,
          { id: specialId, text: 'Peça Coletada! Saída Ativada!', linha: robo.linha, coluna: robo.coluna, isSpecial: true }
        ]);
        setTimeout(() => {
          setFloatingTexts(prev => prev.filter(f => f.id !== specialId));
        }, 1500);
      }

      // Alerta se passar na saída com ela trancada
      if (robo.linha === missao.destino[0] && robo.coluna === missao.destino[1] && !robo.temPeca) {
        const warnId = Date.now() + Math.random();
        setFloatingTexts(prev => [
          ...prev,
          { id: warnId, text: 'Saída Bloqueada!', linha: robo.linha, coluna: robo.coluna, isWarning: true }
        ]);
        setTimeout(() => {
          setFloatingTexts(prev => prev.filter(f => f.id !== warnId));
        }, 1500);
      }

      // Verifica se chegou ao destino liberado
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

  // Run AI Analysis with Full History Recording
  const runAIAnalysis = () => {
    setGameStatus('ai_results');
    
    const algorithms = [
      { nome: "Gulosa + Manhattan", func: buscaGulosa, heuristica: heuristicaForte, isAStar: false },
      { nome: "Gulosa + Chebyshev", func: buscaGulosa, heuristica: heuristicaFraca, isAStar: false },
      { nome: "A* + Manhattan", func: aEstrela, heuristica: heuristicaForte, isAStar: true },
      { nome: "A* + Chebyshev", func: aEstrela, heuristica: heuristicaFraca, isAStar: true }
    ];

    const executarBuscaComposta = (func, heuristica) => {
      if (!missao.peca) {
        return func(mapa, missao.origem, missao.destino, heuristica, true);
      }

      // Etapa 1: Origem até a Peça
      const etapa1 = func(mapa, missao.origem, missao.peca, heuristica, true);

      // Etapa 2: Peça até o Destino
      const etapa2 = func(mapa, missao.peca, missao.destino, heuristica, true);

      if (!etapa1.caminho || !etapa2.caminho) {
        return {
          caminho: null,
          custo: Infinity,
          distancia: Infinity,
          nosExplorados: (etapa1.nosExplorados || 0) + (etapa2.nosExplorados || 0),
          historico: []
        };
      }

      // Concatena históricos marcando as etapas
      const hist1 = (etapa1.historico || []).map(s => ({
        ...s,
        etapaNome: `Etapa 1: Buscando a Peça [${missao.peca[0]}, ${missao.peca[1]}]`,
        alvoAtual: missao.peca
      }));
      const hist2 = (etapa2.historico || []).map(s => ({
        ...s,
        etapaNome: `Etapa 2: Buscando a Saída [${missao.destino[0]}, ${missao.destino[1]}]`,
        alvoAtual: missao.destino
      }));

      const historicoCompleto = [...hist1, ...hist2];

      return {
        caminho: [...etapa1.caminho, ...etapa2.caminho.slice(1)],
        custo: etapa1.custo + etapa2.custo,
        distancia: etapa1.distancia + etapa2.distancia,
        nosExplorados: etapa1.nosExplorados + etapa2.nosExplorados,
        historico: historicoCompleto
      };
    };

    const results = algorithms.map(alg => {
      const inicio = performance.now();
      const res = executarBuscaComposta(alg.func, alg.heuristica);
      const fim = performance.now();
      return {
        ...res,
        nome: alg.nome,
        isAStar: alg.isAStar,
        tempo: (fim - inicio).toFixed(2)
      };
    });

    setAiResults(results);

    // Inicia a exploração visual no A* + Manhattan por padrão
    setSelectedAlgIndex(2);
    setActiveStepIndex(0);
    setShowFinalPath(false);
    setIsPlaying(true);
  };

  // Select an algorithm for visual step-by-step exploration
  const selecionarAlgoritmo = (index) => {
    setSelectedAlgIndex(index);
    setActiveStepIndex(0);
    setShowFinalPath(false);
    setIsPlaying(true);
  };

  // Playback timer effect
  useEffect(() => {
    if (!isPlaying || selectedAlgIndex === null || !aiResults[selectedAlgIndex]) return;
    const historico = aiResults[selectedAlgIndex].historico || [];
    if (historico.length === 0) return;

    const timer = setInterval(() => {
      setActiveStepIndex(prev => {
        if (prev < historico.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          setShowFinalPath(true);
          return prev;
        }
      });
    }, playbackSpeed);

    return () => clearInterval(timer);
  }, [isPlaying, selectedAlgIndex, aiResults, playbackSpeed]);

  if (!mapa || !missao || !robo) return <div style={{color:'white'}}>Carregando...</div>;

  const robotLeft = robo.coluna * 54 + 25 + 16;
  const robotTop = robo.linha * 54 + 25 + 16;

  // Active step data for the selected algorithm
  const selectedAlg = selectedAlgIndex !== null ? aiResults[selectedAlgIndex] : null;
  const historico = selectedAlg?.historico || [];
  const currentStep = historico[activeStepIndex] || null;
  const finalPath = (showFinalPath && selectedAlg) ? (selectedAlg.caminho || []) : [];

  return (
    <div className="app-container">
      {gameStatus !== 'start' && (
        <header className="header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
          <h1 style={{fontSize: '2.8rem', margin: 0}}>Fábrica Inteligente</h1>
          <button 
            className="btn-ctrl" 
            onClick={() => setGameStatus('start')} 
            style={{display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.5rem 1rem', fontSize: '0.88rem'}}
            title="Voltar para a tela de início"
          >
            <Home size={16} /> Menu Inicial
          </button>
        </header>
      )}

      {gameStatus === 'start' ? (
        <StartScreen onStart={(lvl = 1) => iniciarJogo(lvl)} />
      ) : (
        <>
          <main className="main-content">
        {/* Left Sidebar */}
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
            
            {/* Objective checklist */}
            <div className="objective-box">
              <span className="objective-title">Objetivos da Missão</span>
              <div className={`objective-item ${temPeca ? 'done' : 'active'}`}>
                {temPeca ? <CheckCircle2 size={16} color="#34d399" /> : <CircleDot size={16} color="#38bdf8" />}
                <span>1. Pegar Peça ({missao.carga}) {temPeca ? '✓' : `[${missao.peca[0]}, ${missao.peca[1]}]`}</span>
              </div>
              <div className={`objective-item ${temPeca ? 'active' : ''}`}>
                {temPeca ? <CircleDot size={16} color="#38bdf8" /> : <Lock size={16} color="#94a3b8" />}
                <span>2. Ir para a Saída {temPeca ? 'Liberada! [D]' : 'Bloqueada [X]'}</span>
              </div>
            </div>

            <div className="stats">
              <div className="stat-item">
                <span>Distância do Jogador</span>
                <span className="stat-value">{stats.distancia}</span>
              </div>
              <div className="stat-item">
                <span>Custo do Jogador</span>
                <span className="stat-value">{stats.custo}</span>
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
                  <Play size={18} style={{marginRight: '8px'}} /> Executar e Comparar com IA
                </button>
              </div>
            )}

            {gameStatus === 'ai_results' && (
              <div style={{marginTop: '1.5rem'}}>
                <button className="btn action-btn" onClick={initGame} style={{background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white'}}>
                  <RotateCcw size={18} style={{marginRight: '8px'}} /> Jogar Novamente
                </button>
              </div>
            )}
          </div>

          {/* Legend Panel */}
          <div className="panel legend-panel">
            <div className="legend-item">
              <div className="cell-mini estrada"></div>
              <span>Estrada (1)</span>
            </div>
            <div className="legend-item">
              <div className="cell-mini terra"></div>
              <span>Terra (3)</span>
            </div>
            <div className="legend-item">
              <div className="cell-mini lama"></div>
              <span>Lama (5)</span>
            </div>
            <div className="legend-item">
              <div className="cell-mini barreira"></div>
              <span>Barreira</span>
            </div>

            <div style={{width: '100%', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.25rem 0'}}></div>

            <div className="legend-item" title="Posições na fila de prioridade aguardando expansão">
              <div className="cell-mini" style={{background: 'rgba(234, 179, 8, 0.5)', border: '1.5px solid #eab308'}}></div>
              <span>Fronteira</span>
            </div>
            <div className="legend-item" title="Posições que o algoritmo já analisou">
              <div className="cell-mini" style={{background: 'rgba(239, 68, 68, 0.45)', border: '1px solid #ef4444'}}></div>
              <span>Explorados</span>
            </div>
            <div className="legend-item" title="Caminho ótimo encontrado ao final">
              <div className="cell-mini" style={{background: 'rgba(14, 165, 233, 0.7)', border: '2px solid #38bdf8'}}></div>
              <span>Rota Final</span>
            </div>
            <div className="legend-item" title="Destino ou meta atual">
              <div className="cell-mini" style={{background: 'rgba(16, 185, 129, 0.5)', border: '1.5px solid #10b981'}}></div>
              <span>Destino</span>
            </div>
          </div>
        </div>

        {/* Center Grid */}
        <div className="grid-wrapper">
          <div 
            className="grid-container" 
            style={{ 
              gridTemplateColumns: `repeat(${mapa.largura}, 50px)`,
              gridTemplateRows: `repeat(${mapa.altura}, 50px)`
            }}
          >
            {/* Fog of War (active only when human player is playing) */}
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
                // Determine states for AI visualization
                const isCurrent = currentStep && currentStep.noAtual.linha === i && currentStep.noAtual.coluna === j;
                const isFinal = finalPath.some(p => p[0] === i && p[1] === j);
                const isFrontier = currentStep && currentStep.abertos.some(p => p[0] === i && p[1] === j);
                const isExplored = currentStep && currentStep.fechados.some(p => p[0] === i && p[1] === j);

                let cellStateClass = '';
                if (isCurrent) {
                  cellStateClass = 'cell-current';
                } else if (isFinal) {
                  cellStateClass = 'cell-final-path';
                } else if (isFrontier) {
                  cellStateClass = 'cell-frontier';
                } else if (isExplored) {
                  cellStateClass = 'cell-explored';
                }

                return (
                  <div 
                    key={`${i}-${j}`} 
                    className={`cell ${celula.tipo} ${cellStateClass}`}
                    title={`[${i},${j}] ${celula.tipo} (custo: ${celula.custo})`}
                  />
                );
              })
            ))}

            {/* Piece Layer */}
            {missao.peca && (!temPeca || (gameStatus === 'ai_results' && currentStep?.alvoAtual === missao.peca)) && (
              <div 
                className="piece-layer" 
                style={{ transform: `translate(${missao.peca[1] * 54}px, ${missao.peca[0] * 54}px)` }}
                title={`Peça: [${missao.peca[0]}, ${missao.peca[1]}]`}
              >
                <Package size={34} className="piece-icon" />
              </div>
            )}

            {/* Destination Layer */}
            <div 
              className="dest-layer" 
              style={{ transform: `translate(${missao.destino[1] * 54}px, ${missao.destino[0] * 54}px)` }}
              title={temPeca || gameStatus === 'ai_results' ? `Saída Liberada: [${missao.destino[0]}, ${missao.destino[1]}]` : `Saída Bloqueada`}
            >
              {temPeca || gameStatus === 'ai_results' ? (
                <MapPin size={34} className="dest-icon unlocked" />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <MapPin size={34} className="dest-icon locked" />
                  <Lock size={16} color="#ef4444" style={{ position: 'absolute', top: '-4px', right: '-4px' }} />
                </div>
              )}
            </div>

            {/* Robot Layer */}
            <div className="robot-layer" style={{ transform: `translate(${robo.coluna * 54}px, ${robo.linha * 54}px)` }}>
              <Bot size={40} className="robot-icon" />
            </div>

            {/* Floating Texts Layer */}
            {floatingTexts.map(ft => (
              <div 
                key={ft.id} 
                className={`floating-text ${ft.isSpecial ? 'special' : ''} ${ft.isWarning ? 'warning' : ''}`} 
                style={{ transform: `translate(${ft.coluna * 54}px, ${ft.linha * 54}px)` }}
              >
                <div>{ft.text}</div>
              </div>
            ))}

          </div>
        </div>
      </main>

      {/* AI Real-Time Log & Exploration Panel (Positioned above the comparison table) */}
      {gameStatus === 'ai_results' && selectedAlg && currentStep && (
        <div className="ai-log-panel">
          <div className="ai-log-header">
            <div className="ai-log-title">
              <Compass size={22} color={selectedAlg.isAStar ? "#10b981" : "#f59e0b"} />
              <span>{selectedAlg.nome} — Análise e Logs em Tempo Real</span>
            </div>
            <div className="ai-log-subtitle">
              {currentStep.etapaNome || "Exploração da Rota"}
            </div>
          </div>

          <div className="ai-log-grid">
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%'}}>
              {/* Playback & Step Controls */}
              <div className="playback-box">
                <div className="playback-controls">
                  <button 
                    className="btn-ctrl" 
                    title="Passo Anterior" 
                    disabled={activeStepIndex === 0} 
                    onClick={() => { setIsPlaying(false); setActiveStepIndex(p => Math.max(0, p - 1)); }}
                  >
                    <SkipBack size={16} />
                  </button>

                  <button 
                    className={`btn-ctrl ${isPlaying ? 'active' : ''}`} 
                    title={isPlaying ? "Pausar" : "Reproduzir"} 
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{padding: '0.45rem 1.25rem', fontWeight: 'bold'}}
                  >
                    {isPlaying ? <Pause size={18} style={{marginRight: 4}} /> : <Play size={18} style={{marginRight: 4}} />}
                    {isPlaying ? "Pausar" : "Play"}
                  </button>

                  <button 
                    className="btn-ctrl" 
                    title="Próximo Passo" 
                    disabled={activeStepIndex >= historico.length - 1} 
                    onClick={() => { setIsPlaying(false); setActiveStepIndex(p => Math.min(historico.length - 1, p + 1)); }}
                  >
                    <SkipForward size={16} />
                  </button>

                  <button 
                    className="btn-ctrl" 
                    title="Pular para o Caminho Final" 
                    onClick={() => { setIsPlaying(false); setActiveStepIndex(historico.length - 1); setShowFinalPath(true); }}
                  >
                    <FastForward size={16} style={{marginRight: 4}} /> Rota Final
                  </button>
                </div>

                {/* Progress Slider */}
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem'}}>
                  <span>Passo {activeStepIndex + 1} de {historico.length}</span>
                  <span>Velocidade: {playbackSpeed === 250 ? '0.5x' : playbackSpeed === 100 ? '1x' : '2.5x'}</span>
                </div>
                <input 
                  type="range" 
                  className="playback-slider" 
                  min={0} 
                  max={Math.max(0, historico.length - 1)} 
                  value={activeStepIndex} 
                  onChange={(e) => {
                    setIsPlaying(false);
                    setActiveStepIndex(parseInt(e.target.value, 10));
                  }}
                />

                {/* Speed Buttons */}
                <div style={{display: 'flex', gap: '0.4rem', justifyContent: 'center', marginTop: '0.25rem'}}>
                  {[
                    { label: '0.5x (Lento)', speed: 250 },
                    { label: '1x (Normal)', speed: 100 },
                    { label: '2.5x (Rápido)', speed: 40 }
                  ].map(s => (
                    <button 
                      key={s.speed} 
                      className={`btn-ctrl ${playbackSpeed === s.speed ? 'active' : ''}`} 
                      style={{fontSize: '0.72rem', padding: '0.25rem 0.5rem'}}
                      onClick={() => setPlaybackSpeed(s.speed)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frontier & Explored Counts */}
              <div className="stat-pills">
                <div className="stat-pill" style={{borderColor: 'rgba(234, 179, 8, 0.4)'}}>
                  <span style={{color: '#facc15'}}>Na Fronteira</span>
                  <strong>{currentStep.abertos.length}</strong>
                </div>
                <div className="stat-pill" style={{borderColor: 'rgba(239, 68, 68, 0.4)'}}>
                  <span style={{color: '#f87171'}}>Já Explorados</span>
                  <strong>{currentStep.fechados.length}</strong>
                </div>
                <div className="stat-pill" style={{borderColor: 'rgba(56, 189, 248, 0.4)'}}>
                  <span style={{color: '#38bdf8'}}>Nó Atual</span>
                  <strong>[{currentStep.noAtual.linha}, {currentStep.noAtual.coluna}]</strong>
                </div>
                <div className="stat-pill" style={{borderColor: 'rgba(255, 255, 255, 0.15)'}}>
                  <span style={{color: 'var(--text-secondary)'}}>Terreno</span>
                  <strong>{currentStep.noAtual.terreno} (custo: {currentStep.noAtual.custo})</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table & Algorithm Selection */}
      {gameStatus === 'ai_results' && (
        <div className="panel" style={{width: '100%', marginTop: '2rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
            <h2>Comparação com a IA</h2>
          </div>

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
                    <th>Ação Visual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="row-player">
                    <td>
                      <strong style={{color: '#38bdf8'}}>Você (Jogador)</strong>
                      <br/><span style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>Origem → Peça → Saída</span>
                    </td>
                    <td>{stats.distancia}</td>
                    <ValueCell value={stats.custo} min={minCost} max={maxCost} />
                    <td style={{color: 'var(--text-secondary)'}}>-</td>
                    <td style={{color: 'var(--text-secondary)'}}>-</td>
                    <td style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>Controle Manual</td>
                  </tr>

                  {aiResults.map((res, idx) => {
                    const isSelected = selectedAlgIndex === idx;
                    const rowClass = res.isAStar ? 'row-a-star' : 'row-greedy';

                    return (
                      <tr 
                        key={idx} 
                        className={rowClass} 
                        style={{
                          cursor: 'pointer',
                          outline: isSelected ? '2px solid #38bdf8' : 'none',
                          boxShadow: isSelected ? '0 0 15px rgba(56, 189, 248, 0.4)' : 'none'
                        }} 
                        onClick={() => selecionarAlgoritmo(idx)} 
                        title="Clique para assistir à simulação passo a passo com a tabela de logs da IA"
                      >
                        <td>
                          <strong style={{color: res.isAStar ? '#10b981' : '#f59e0b'}}>{res.nome}</strong>
                          <br/><span style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>{res.isAStar ? 'Ótimo (Menor custo g+h)' : 'Gulosa (Só heurística h)'}</span>
                        </td>
                        <td>{res.distancia}</td>
                        <ValueCell value={res.custo} min={minCost} max={maxCost} />
                        <ValueCell value={res.nosExplorados} min={minNodes} max={maxNodes} />
                        <ValueCell value={res.tempo} min={minTime} max={maxTime} unit=" ms" />
                        <td>
                          <button 
                            className={`btn-ctrl ${isSelected ? 'active' : ''}`} 
                            style={{fontSize: '0.78rem', padding: '0.3rem 0.6rem'}}
                            onClick={(e) => { e.stopPropagation(); selecionarAlgoritmo(idx); }}
                          >
                            <Eye size={14} style={{marginRight: 4}} />
                            {isSelected ? 'Assistindo' : 'Ver Passos'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
          })()}
        </div>
      )}
        </>
      )}
    </div>
  );
}

export default App;
