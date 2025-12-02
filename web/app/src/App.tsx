import { useState, useCallback, useRef } from 'react';
import { Header, PlayerSidebar, Toolbar, DrawingCanvas } from './components';
import type { Player, Tool } from './components';
import { updateCanvasData, clearRoom, DEFAULT_ROOM_ID } from './api';
import type { Canvas } from './api';
import './App.css';

function canvasToPlayer(canvas: Canvas, index: number): Player {
  return {
    id: canvas.id,
    name: `Player ${index + 1}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${canvas.id}`,
    canvasSvg: canvas.image_data_svg,
  };
}

function App() {
  const [tool, setTool] = useState<Tool>('pencil');
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState('#000000');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentCanvasId, setCurrentCanvasId] = useState<string | null>(null);
  const [showIdeas, setShowIdeas] = useState(false);

  // Use ref to track canvas ID to avoid stale closure issues
  const canvasIdRef = useRef<string | null>(null);
  // Track pending save to prevent race conditions
  const pendingSaveRef = useRef<Promise<void> | null>(null);

  const handleCanvasChange = useCallback(async (svg: string, json: string) => {
    // Wait for any pending save to complete first
    if (pendingSaveRef.current) {
      await pendingSaveRef.current;
    }

    const savePromise = (async () => {
      try {
        const response = await updateCanvasData({
          roomId: DEFAULT_ROOM_ID,
          canvasId: canvasIdRef.current ?? undefined,
          imageSvg: svg,
          canvasData: json,
        });

        // Update canvas ID ref immediately (no re-render needed)
        if (!canvasIdRef.current) {
          canvasIdRef.current = response.canvas_id;
          setCurrentCanvasId(response.canvas_id);
        }

        // Update players list with new room data (filter out empty canvases)
        const canvasPlayers = response.room_info.canvas
          .filter(c => c.image_data_svg)
          .map(canvasToPlayer);
        setPlayers(canvasPlayers);
      } catch (err) {
        console.error('Failed to save canvas:', err);
      }
    })();

    pendingSaveRef.current = savePromise;
    await savePromise;
    pendingSaveRef.current = null;
  }, []);

  const handleShowIdeas = useCallback(() => {
    setShowIdeas((prev) => !prev);
  }, []);

  const handleClearRoom = useCallback(async () => {
    try {
      await clearRoom(DEFAULT_ROOM_ID);
      // Reset local state
      canvasIdRef.current = null;
      setCurrentCanvasId(null);
      setPlayers([]);
      // Reload page to reset canvas
      window.location.reload();
    } catch (err) {
      console.error('Failed to clear room:', err);
    }
  }, []);

  return (
    <div className="app">
      <Header
        prompt="Draw a camp"
        onBack={() => window.history.back()}
        onClear={handleClearRoom}
      />

      <main className="app-main">
        <PlayerSidebar players={players} currentPlayerId={currentCanvasId ?? undefined} />

        <div className="app-canvas-area">
          {showIdeas && (
            <button className="show-ideas-button" onClick={handleShowIdeas}>
              Show ideas
            </button>
          )}
          <DrawingCanvas
            tool={tool}
            brushSize={brushSize}
            color={color}
            onCanvasChange={handleCanvasChange}
          />
        </div>

        <Toolbar
          activeTool={tool}
          brushSize={brushSize}
          color={color}
          onToolChange={setTool}
          onBrushSizeChange={setBrushSize}
          onColorChange={setColor}
          onShowIdeas={handleShowIdeas}
        />
      </main>
    </div>
  );
}

export default App;
