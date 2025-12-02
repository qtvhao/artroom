import { useEffect, useRef, useCallback } from 'react';
import { Canvas, PencilBrush } from 'fabric';
import type { Tool } from './Toolbar';
import './DrawingCanvas.css';

interface DrawingCanvasProps {
  tool: Tool;
  brushSize: number;
  color: string;
  onCanvasChange?: (svg: string, json: string) => void;
}

export function DrawingCanvas({ tool, brushSize, color, onCanvasChange }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);

  const handleCanvasChange = useCallback(() => {
    if (!fabricRef.current || !onCanvasChange) return;

    const svg = fabricRef.current.toSVG();
    const json = JSON.stringify(fabricRef.current.toJSON());
    onCanvasChange(svg, json);
  }, [onCanvasChange]);

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      isDrawingMode: true,
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
    });

    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.width = brushSize;
    canvas.freeDrawingBrush.color = color;

    canvas.on('path:created', handleCanvasChange);
    canvas.on('object:modified', handleCanvasChange);

    fabricRef.current = canvas;

    const resizeCanvas = () => {
      const container = canvasRef.current?.parentElement;
      if (container && fabricRef.current) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        fabricRef.current.setDimensions({ width, height });
        fabricRef.current.renderAll();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;

    switch (tool) {
      case 'pencil':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new PencilBrush(canvas);
        canvas.freeDrawingBrush.width = brushSize;
        canvas.freeDrawingBrush.color = color;
        break;
      case 'marker':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new PencilBrush(canvas);
        canvas.freeDrawingBrush.width = brushSize * 2;
        canvas.freeDrawingBrush.color = color;
        (canvas.freeDrawingBrush as PencilBrush).strokeLineCap = 'round';
        (canvas.freeDrawingBrush as PencilBrush).strokeLineJoin = 'round';
        break;
      case 'eraser':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new PencilBrush(canvas);
        canvas.freeDrawingBrush.width = brushSize * 3;
        canvas.freeDrawingBrush.color = '#ffffff';
        break;
      case 'fill':
        canvas.isDrawingMode = false;
        break;
    }
  }, [tool, brushSize, color]);

  useEffect(() => {
    if (!fabricRef.current?.freeDrawingBrush) return;
    fabricRef.current.freeDrawingBrush.width = tool === 'marker' ? brushSize * 2 : brushSize;
  }, [brushSize, tool]);

  useEffect(() => {
    if (!fabricRef.current?.freeDrawingBrush || tool === 'eraser') return;
    fabricRef.current.freeDrawingBrush.color = color;
  }, [color, tool]);

  const handleFillClick = useCallback((e: React.MouseEvent) => {
    if (tool !== 'fill' || !fabricRef.current) return;

    const canvas = fabricRef.current;
    const pointer = canvas.getScenePoint(e.nativeEvent);
    const objects = canvas.getObjects();

    // Find object at click position
    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i];
      if (obj.containsPoint(pointer)) {
        obj.set('fill', color);
        canvas.renderAll();
        handleCanvasChange();
        break;
      }
    }
  }, [tool, color, handleCanvasChange]);

  return (
    <div className="drawing-canvas-container" onClick={handleFillClick}>
      <canvas ref={canvasRef} />
    </div>
  );
}
