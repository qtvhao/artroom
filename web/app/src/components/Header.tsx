import './Header.css';

interface HeaderProps {
  prompt: string;
  onBack?: () => void;
  onToggleTheme?: () => void;
  onClear?: () => void;
}

export function Header({ prompt, onBack, onToggleTheme, onClear }: HeaderProps) {
  return (
    <header className="header">
      <button className="header-back" onClick={onBack} aria-label="Go back">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <h1 className="header-prompt">{prompt}</h1>

      <div className="header-actions">
        {onClear && (
          <button className="header-clear" onClick={onClear} aria-label="Clear room">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
            </svg>
          </button>
        )}
        <button className="header-theme" onClick={onToggleTheme} aria-label="Toggle theme">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        </button>
      </div>
    </header>
  );
}
