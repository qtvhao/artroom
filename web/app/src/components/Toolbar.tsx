import './Toolbar.css';

export type Tool = 'pencil' | 'marker' | 'eraser' | 'fill';

interface ToolbarProps {
  activeTool: Tool;
  brushSize: number;
  color: string;
  onToolChange: (tool: Tool) => void;
  onBrushSizeChange: (size: number) => void;
  onColorChange: (color: string) => void;
  onShowIdeas?: () => void;
}

const tools: { id: Tool; icon: string; label: string }[] = [
  { id: 'pencil', icon: 'pencil', label: 'Pencil' },
  { id: 'marker', icon: 'marker', label: 'Marker' },
  { id: 'eraser', icon: 'eraser', label: 'Eraser' },
  { id: 'fill', icon: 'fill', label: 'Fill' },
];

function ToolIcon({ type }: { type: string }) {
  switch (type) {
    case 'pencil':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
      );
    case 'marker':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        </svg>
      );
    case 'eraser':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 20H7L3 16c-.8-.8-.8-2 0-2.8l10-10c.8-.8 2-.8 2.8 0l6 6c.8.8.8 2 0 2.8L13 21" />
          <path d="M6 11l5 5" />
        </svg>
      );
    case 'fill':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 11c.3-.9.5-1.9.5-3 0-4.4-3.6-8-8-8S3.5 3.6 3.5 8c0 1.1.2 2.1.5 3" />
          <path d="M12 8v13" />
          <path d="M8 14l4-4 4 4" />
          <circle cx="12" cy="20" r="1" />
        </svg>
      );
    default:
      return null;
  }
}

export function Toolbar({
  activeTool,
  brushSize,
  color,
  onToolChange,
  onBrushSizeChange,
  onColorChange,
  onShowIdeas,
}: ToolbarProps) {
  return (
    <aside className="toolbar">
      <button className="toolbar-ai-button" onClick={onShowIdeas} aria-label="Show ideas">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
        </svg>
      </button>

      <div className="toolbar-tools">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`toolbar-tool ${activeTool === tool.id ? 'toolbar-tool--active' : ''}`}
            onClick={() => onToolChange(tool.id)}
            aria-label={tool.label}
            title={tool.label}
          >
            <ToolIcon type={tool.icon} />
          </button>
        ))}
      </div>

      <div className="toolbar-brush-size">
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => onBrushSizeChange(Number(e.target.value))}
          className="toolbar-brush-slider"
        />
      </div>

      <div className="toolbar-color">
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="toolbar-color-picker"
        />
      </div>
    </aside>
  );
}
