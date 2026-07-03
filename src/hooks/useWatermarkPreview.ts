import { useEffect, useRef, useState } from 'react';
import { WatermarkSettings, Redaction } from '../types';
import { applyWatermark, drawRedactionsOnCanvas } from '../utils/watermarkEngine';

const PREVIEW_MAX_DIMENSION = 1200;

interface ImageMeta {
  width: number;
  height: number;
  size: string;
}

/**
* Limpia el canvas, dibuja la imagen base de la marca de agua y luego superpone
* los dibujos sobre la imagen si existen
*/
export const drawPreviewCanvas = (
  targetCanvas: HTMLCanvasElement,
  baseCanvas: HTMLCanvasElement | null,
  redactions: Redaction[]
) => {
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) {
    return;
  }

  ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
  if (baseCanvas) {
    ctx.drawImage(baseCanvas, 0, 0);
  }

  if (redactions.length > 0) {
    drawRedactionsOnCanvas(ctx, targetCanvas.width, targetCanvas.height, redactions);
  }
}

/**
 * Renderiza la marca de agua sobre un `<canvas>` a una resolución reducida
 * (para mantener 60FPS en la interfaz) cada vez que cambian la imagen o los ajustes.
 */
export function useWatermarkPreview(imageSrc: string | null, settings: WatermarkSettings, redactions: Redaction[] = []) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const redactionsRef = useRef<Redaction[]>(redactions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<ImageMeta | null>(null);

  useEffect(() => {
    redactionsRef.current = redactions;
  }, [redactions]);

  useEffect(() => {
    if (!imageSrc) {
      setError(null);
      setImageMeta(null);
      baseCanvasRef.current = null;
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    applyWatermark(imageSrc, settings, { maxDimension: PREVIEW_MAX_DIMENSION }, [])
      .then((renderedCanvas) => {
        if (!active) return;

        baseCanvasRef.current = renderedCanvas;
        const targetCanvas = canvasRef.current;
        if (targetCanvas) {
          targetCanvas.width = renderedCanvas.width;
          targetCanvas.height = renderedCanvas.height;
          drawPreviewCanvas(targetCanvas, renderedCanvas, redactions);
        }

        const img = new Image();
        img.onload = () => {
          if (active) {
            setImageMeta({
              width: img.naturalWidth,
              height: img.naturalHeight,
              size: `${img.naturalWidth} x ${img.naturalHeight} px`,
            });
          }
        };
        img.src = imageSrc;

        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error(err);
        setError('Error al procesar la vista previa. Verifique el formato del archivo.');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [imageSrc, settings]);

  useEffect(() => {
    const targetCanvas = canvasRef.current;
    const baseCanvas = baseCanvasRef.current;
    if (!targetCanvas || !baseCanvas) {
      return;
    }

    drawPreviewCanvas(targetCanvas, baseCanvas, redactions);
  }, [imageSrc, settings, redactions]);

  return { canvasRef, loading, error, imageMeta };
}
