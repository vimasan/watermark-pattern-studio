import { useEffect, useState } from 'react';

const MIN_ZOOM = 25;
const MAX_ZOOM = 300;
const ZOOM_STEP = 25;
const DEFAULT_ZOOM = 100;

/** Controla el nivel de zoom de la vista previa, reiniciándolo cuando cambia `resetKey` (p. ej. al cambiar de imagen). */
export function useZoom(resetKey: unknown) {
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);

  useEffect(() => {
    setZoomLevel(DEFAULT_ZOOM);
  }, [resetKey]);

  const zoomOut = () => setZoomLevel((prev) => Math.max(MIN_ZOOM, prev - ZOOM_STEP));
  const zoomIn = () => setZoomLevel((prev) => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
  const resetZoom = () => setZoomLevel(DEFAULT_ZOOM);

  return { zoomLevel, zoomOut, zoomIn, resetZoom, minZoom: MIN_ZOOM, maxZoom: MAX_ZOOM, defaultZoom: DEFAULT_ZOOM };
}
