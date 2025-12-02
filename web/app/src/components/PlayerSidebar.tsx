import './PlayerSidebar.css';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  canvasSvg?: string;
}

interface PlayerSidebarProps {
  players: Player[];
  currentPlayerId?: string;
}

export function PlayerSidebar({ players, currentPlayerId }: PlayerSidebarProps) {
  return (
    <aside className="player-sidebar">
      {players.map((player) => (
        <div
          key={player.id}
          className={`player-card ${player.id === currentPlayerId ? 'player-card--current' : ''}`}
        >
          <div className="player-canvas">
            {player.canvasSvg ? (
              <div
                className="player-canvas-content"
                dangerouslySetInnerHTML={{ __html: player.canvasSvg }}
              />
            ) : (
              <div className="player-canvas-empty" />
            )}
          </div>
          <div className="player-info">
            <img
              src={player.avatar}
              alt={`${player.name}'s avatar`}
              className="player-avatar"
            />
            <span className="player-name">{player.name}</span>
          </div>
        </div>
      ))}
    </aside>
  );
}
