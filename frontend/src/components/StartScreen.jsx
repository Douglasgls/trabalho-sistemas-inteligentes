import { useState, useEffect } from 'react';
import { 
  Bot, 
  Play, 
  ChevronRight 
} from 'lucide-react';

export default function StartScreen({ onStart }) {
  const [selectedLevel, setSelectedLevel] = useState(1);

  // Allow pressing Enter or Space to start immediately
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onStart(selectedLevel);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLevel, onStart]);

  const levels = [
    {
      id: 1,
      name: 'Fase 1: Setor Inicial',
      dim: '10×10',
      badge: 'Iniciante',
      badgeColor: '#10b981',
      desc: 'Área introdutória para dominar os controles e o ciclo de coleta da peça.'
    },
    {
      id: 2,
      name: 'Fase 2: Galpão Logístico',
      dim: '20×20',
      badge: 'Intermediário',
      badgeColor: '#38bdf8',
      desc: 'Galpão amplo com trechos de terra e múltiplas alternativas de rotas.'
    },
    {
      id: 3,
      name: 'Fase 3: Linha de Montagem',
      dim: '20×20',
      badge: 'Desafio',
      badgeColor: '#f59e0b',
      desc: 'Corredores industriais estreitos e poças de lama com alto custo de passagem.'
    }
  ];

  return (
    <div className="start-screen-wrapper">
      <div className="start-card">
        {/* Central Mascot / Avatar */}
        <div className="start-avatar-container">
          <div className="start-avatar-glow"></div>
          <div className="start-avatar-box">
            <Bot size={54} color="#38bdf8" />
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="start-title">Fábrica Inteligente</h1>

        {/* Level Selection Cards */}
        <div className="start-levels-container">
          <div className="start-levels-title">Selecione a Fase</div>
          <div className="start-levels-cards">
            {levels.map((lvl) => {
              const isSelected = selectedLevel === lvl.id;
              return (
                <div 
                  key={lvl.id}
                  className={`start-level-option ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedLevel(lvl.id)}
                >
                  <div className="start-level-head">
                    <span className="start-level-name">{lvl.name}</span>
                    <span 
                      className="start-level-badge" 
                      style={{ 
                        background: `${lvl.badgeColor}22`, 
                        color: lvl.badgeColor,
                        border: `1px solid ${lvl.badgeColor}44` 
                      }}
                    >
                      {lvl.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 'bold' }}>
                    Tamanho: {lvl.dim}
                  </div>
                  <div className="start-level-desc">
                    {lvl.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Huge Gamified CTA Button */}
        <div className="start-cta-container">
          <button 
            className="btn-start-play"
            onClick={() => onStart(selectedLevel)}
            title="Iniciar a partida com a fase selecionada"
          >
            <Play size={24} fill="currentColor" />
            <span>JOGAR (FASE {selectedLevel})</span>
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
