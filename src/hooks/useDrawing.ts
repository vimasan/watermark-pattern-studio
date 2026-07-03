import React, { MouseEvent, RefObject, TouchEvent, useState } from 'react';
import { ACTIVE_DRAWING, DrawingMode, INACTIVE_DRAWING, Redaction } from '../types';

interface UseDrawingProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  redactions: Redaction[];
  onRedactionsChange?: (redactions: Redaction[]) => void;
}

export function useDrawing({
  canvasRef,
  redactions,
  onRedactionsChange
}: UseDrawingProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeMode, setActiveMode] = useState<DrawingMode>(INACTIVE_DRAWING);
  const [currentTool, setCurrentTool] = useState<'brush' | 'rect' | 'blur' | 'pixelate'>('rect');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentSize, setCurrentSize] = useState(25);

  const handleCanvasMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (activeMode !== ACTIVE_DRAWING || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;

    setIsDrawing(true);

    const newRedaction: Redaction = {
      id: Math.random().toString(36).substring(2, 9),
      type: currentTool,
      color: (currentTool === 'blur' || currentTool === 'pixelate') ? 'transparent' : currentColor,
      size: currentSize,
      points: [{ x: pctX, y: pctY }]
    };

    if (onRedactionsChange) {
      onRedactionsChange([...redactions, newRedaction]);
    }
  };

  const handleCanvasMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeMode !== ACTIVE_DRAWING || !canvasRef.current || !redactions || redactions.length === 0) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;

    const updated = [...redactions];
    const last = { ...updated[updated.length - 1] };

    if (currentTool === 'rect' || currentTool === 'blur' || currentTool === 'pixelate') {
      last.points = [last.points[0], { x: pctX, y: pctY }];
    } else {
      last.points = [...last.points, { x: pctX, y: pctY }];
    }

    updated[updated.length - 1] = last;
    if (onRedactionsChange) {
      onRedactionsChange(updated);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const handleCanvasTouchStart = (e: TouchEvent<HTMLCanvasElement>) => {
    if (activeMode !== ACTIVE_DRAWING || !canvasRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;

    setIsDrawing(true);

    const newRedaction: Redaction = {
      id: Math.random().toString(36).substring(2, 9),
      type: currentTool,
      color: (currentTool === 'blur' || currentTool === 'pixelate') ? 'transparent' : currentColor,
      size: currentSize,
      points: [{ x: pctX, y: pctY }]
    };

    if (onRedactionsChange) {
      onRedactionsChange([...redactions, newRedaction]);
    }
  };

  const handleCanvasTouchMove = (e: TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeMode !== ACTIVE_DRAWING || !canvasRef.current || !redactions || redactions.length === 0) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;

    const updated = [...redactions];
    const last = { ...updated[updated.length - 1] };

    if (currentTool === 'rect' || currentTool === 'blur' || currentTool === 'pixelate') {
      last.points = [last.points[0], { x: pctX, y: pctY }];
    } else {
      last.points = [...last.points, { x: pctX, y: pctY }];
    }

    updated[updated.length - 1] = last;
    if (onRedactionsChange) {
      onRedactionsChange(updated);
    }
  };

  const undo = () => {
    if (redactions.length > 0 && onRedactionsChange) {
      onRedactionsChange(redactions.slice(0, -1));
    }
  };

  const clear = () => {
    if (redactions.length > 0 && onRedactionsChange) {
      if (confirm('¿Está seguro de que desea eliminar todos los dibujos de ocultación?')) {
        onRedactionsChange([]);
      }
    }
  };

  const resetMode = () => {
    setActiveMode(INACTIVE_DRAWING);
    setIsDrawing(false);
  };

  return {
    isDrawing,
    activeMode,
    setActiveMode,
    currentTool,
    setCurrentTool,
    currentColor,
    setCurrentColor,
    currentSize,
    setCurrentSize,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleCanvasTouchStart,
    handleCanvasTouchMove,
    undo,
    clear,
    resetMode
  };
}