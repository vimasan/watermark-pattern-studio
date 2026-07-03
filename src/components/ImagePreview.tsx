import React, { RefObject } from 'react';
import { WatermarkSettings, Redaction } from '../types';
import { useWatermarkPreview } from '../hooks/useWatermarkPreview';
import { useZoom } from '../hooks/useZoom';
import PreviewToolbar from './preview/PreviewToolbar';
import PreviewCanvas from './preview/PreviewCanvas';
import ZoomControls from './preview/ZoomControls';
import EmptyPreviewState from './preview/EmptyPreviewState';
import PreviewErrorState from './preview/PreviewErrorState';
import { useDrawing } from '../hooks/useDrawing';
import DrawingToolbar from './DrawingToolbar';

interface ImagePreviewProps {
  imageSrc: string | null;
  fileName: string | null;
  settings: WatermarkSettings;
  theme: 'light' | 'dark';
  redactions?: Redaction[];
  onRedactionsChange?: (redactions: Redaction[]) => void;
  onDownloadRequested: () => void;
  onResetImage?: () => void;
}

export default function ImagePreview({
  imageSrc,
  fileName,
  settings,
  theme,
  redactions = [],
  onRedactionsChange,
  onDownloadRequested,
  onResetImage,
}: ImagePreviewProps) {
  const isDark = theme === 'dark';
  const { canvasRef, loading, error, imageMeta } = useWatermarkPreview(imageSrc, settings, redactions);
  const zoom = useZoom(imageSrc);
  const {
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
  } = useDrawing({
    canvasRef,
    redactions,
    onRedactionsChange
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
      <PreviewToolbar
        isDark={isDark}
        fileName={fileName}
        hasImage={!!imageSrc}
        sizeLabel={imageMeta?.size}
        onDownload={onDownloadRequested}
      />
      <DrawingToolbar
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
        currentColor={currentColor}
        setCurrentColor={setCurrentColor}
        currentSize={currentSize}
        setCurrentSize={setCurrentSize}
        redactions={redactions}
        undo={undo}
        clear={clear}
        isDark={isDark}
      />

      <div
        className={`flex-1 overflow-auto p-8 flex items-center justify-center relative ${
          isDark ? 'bg-black/30' : 'bg-slate-100/40'
        }`}
      >
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#000 20%, transparent 20%), radial-gradient(#000 20%, transparent 20%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
          }}
        />

        {!imageSrc ? (
          <EmptyPreviewState isDark={isDark} />
        ) : error ? (
          <PreviewErrorState message={error} onResetImage={onResetImage} />
        ) : (
          <PreviewCanvas
            isDark={isDark}
            canvasRef={canvasRef as RefObject<HTMLCanvasElement>}
            zoomLevel={zoom.zoomLevel}
            loading={loading}
            activeMode={activeMode}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onTouchStart={handleCanvasTouchStart}
            onTouchMove={handleCanvasTouchMove}
            onTouchEnd={handleCanvasMouseUp}
          />
        )}

        {imageSrc && !error && (
          <ZoomControls
            isDark={isDark}
            zoomLevel={zoom.zoomLevel}
            minZoom={zoom.minZoom}
            maxZoom={zoom.maxZoom}
            defaultZoom={zoom.defaultZoom}
            onZoomOut={zoom.zoomOut}
            onZoomIn={zoom.zoomIn}
            onReset={zoom.resetZoom}
          />
        )}
      </div>
    </div>
  );
}
