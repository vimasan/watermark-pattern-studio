import { WatermarkSettings, Redaction } from '../types';
import * as piexif from 'piexifjs';

/**
 * Loads an HTMLImageElement from a source URL/Base64.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!src) {
      return reject(new Error('La ruta o URL de la imagen está vacía.'));
    }
    const img = new Image();
    const isRemote = src.startsWith('http') || src.startsWith('//');
    if (isRemote) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = () => {
      if (isRemote && img.crossOrigin === 'anonymous') {
        // Fallback: Retry loading without crossOrigin if the remote server blocks CORS
        const imgFallback = new Image();
        imgFallback.onload = () => resolve(imgFallback);
        imgFallback.onerror = () => reject(new Error('No se pudo cargar la imagen de origen. Verifique el formato.'));
        imgFallback.src = src;
      } else {
        reject(new Error('No se pudo cargar la imagen de origen. Verifique el formato.'));
      }
    };
    img.src = src;
  });
}

/**
 * Helper to convert any image URL, Object URL, or relative URL into a Base64 Data URL.
 */
export async function urlToDataUrl(url: string): Promise<string> {
  if (url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('blob:')) {
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = () => reject(new Error('Failed to read blob URL'));
      xhr.responseType = 'blob';
      xhr.open('GET', url);
      xhr.send();
    });
  }
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert a Base64 dataURL back into a Blob.
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Injects original image EXIF metadata and custom metadata (Author, Copyright) into a destination JPEG.
 */
export async function injectMetadata(
  originalSrc: string,
  canvasDataUrl: string,
  settings: WatermarkSettings
): Promise<string> {
  // Only process for JPEGs since piexifjs is designed for JPEG EXIF metadata
  if (!canvasDataUrl.startsWith('data:image/jpeg') && !canvasDataUrl.startsWith('data:image/jpg')) {
    return canvasDataUrl;
  }

  try {
    // 1. Convert original image source to a Data URL so we can read its EXIF
    const originalDataUrl = await urlToDataUrl(originalSrc);

    // 2. Load EXIF from original image, fallback to empty EXIF if none is found or if parsing fails
    let exifObj: any = { '0th': {}, 'Exif': {}, 'GPS': {}, '1st': {}, 'Interop': {} };
    try {
      exifObj = piexif.load(originalDataUrl);
    } catch (e) {
      console.warn('Could not read EXIF from original image, initializing empty EXIF container:', e);
    }

    // 3. Ensure '0th' directory exists for primary metadata properties (Artist, Copyright)
    if (!exifObj['0th']) {
      exifObj['0th'] = {};
    }

    // 4. Inject Custom Author (Artist) and Copyright metadata if provided
    if (settings.metadataAuthor !== undefined && settings.metadataAuthor.trim() !== '') {
      exifObj['0th'][piexif.ImageIFD.Artist] = settings.metadataAuthor;
    }
    if (settings.metadataCopyright !== undefined && settings.metadataCopyright.trim() !== '') {
      exifObj['0th'][piexif.ImageIFD.Copyright] = settings.metadataCopyright;
    }

    // 5. Serialize EXIF object back into binary bytes
    const exifBytes = piexif.dump(exifObj);

    // 6. Insert new EXIF bytes into the watermark-rendered canvas JPEG
    const newJpegDataUrl = piexif.insert(exifBytes, canvasDataUrl);
    return newJpegDataUrl;
  } catch (err) {
    console.error('Failed to inject or preserve EXIF metadata:', err);
    return canvasDataUrl; // Safe fallback so export is never blocked
  }
}

export function drawRedactionsOnCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  redactions: Redaction[]
) {
  if (!redactions?.length) {
    return;
  }

  redactions.forEach((redaction) => {
    const points = redaction.points.map((point) => ({
      x: Math.round((point.x / 100) * width),
      y: Math.round((point.y / 100) * height),
    }));

    if (redaction.type === 'brush') {
      if (points.length === 0) {
        return;
      }

      ctx.save();
      ctx.strokeStyle = redaction.color || '#000000';
      ctx.fillStyle = redaction.color || '#000000';
      ctx.lineWidth = Math.max(1, redaction.size);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      if (points.length === 1) {
        ctx.beginPath();
        ctx.arc(points[0].x, points[0].y, Math.max(1, redaction.size / 2), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      return;
    }

    if (points.length < 2) {
      return;
    }

    const x0 = points[0].x;
    const y0 = points[0].y;
    const x1 = points[1].x;
    const y1 = points[1].y;
    const rectX = Math.min(x0, x1);
    const rectY = Math.min(y0, y1);
    const rectW = Math.max(1, Math.abs(x1 - x0));
    const rectH = Math.max(1, Math.abs(y1 - y0));

    if (redaction.type === 'rect') {
      ctx.save();
      ctx.fillStyle = redaction.color || '#000000';
      ctx.fillRect(rectX, rectY, rectW, rectH);
      ctx.restore();
      return;
    }

    const snapshot = document.createElement('canvas');
    snapshot.width = rectW;
    snapshot.height = rectH;
    const snapshotCtx = snapshot.getContext('2d');
    if (!snapshotCtx) {
      return;
    }
    snapshotCtx.drawImage(ctx.canvas, rectX, rectY, rectW, rectH, 0, 0, rectW, rectH);

    if (redaction.type === 'blur') {
      const blurAmount = Math.max(2, Math.round(redaction.size * 0.18));
      ctx.save();
      ctx.filter = `blur(${blurAmount}px)`;
      ctx.drawImage(snapshot, 0, 0, rectW, rectH, rectX, rectY, rectW, rectH);
      ctx.restore();
      return;
    }

    if (redaction.type === 'pixelate') {
      const pixelSize = Math.max(2, Math.round(redaction.size * 0.2));
      const sampleWidth = Math.max(1, Math.round(rectW / pixelSize));
      const sampleHeight = Math.max(1, Math.round(rectH / pixelSize));

      const pixelCanvas = document.createElement('canvas');
      pixelCanvas.width = sampleWidth;
      pixelCanvas.height = sampleHeight;
      const pixelCtx = pixelCanvas.getContext('2d');
      if (!pixelCtx) {
        return;
      }

      pixelCtx.imageSmoothingEnabled = false;
      pixelCtx.drawImage(snapshot, 0, 0, rectW, rectH, 0, 0, sampleWidth, sampleHeight);

      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(pixelCanvas, 0, 0, sampleWidth, sampleHeight, rectX, rectY, rectW, rectH);
      ctx.restore();
    }
  });
}

/**
 * Core rendering function that processes an image and draws a repeating mosaic watermark.
 * Safely downscales preview versions to maintain 60FPS UI performance on large 4K/8K images.
 */
export async function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  mimeType: string = 'image/jpeg',
  quality: number = 0.95,
  originalSrc?: string,
  settings?: WatermarkSettings
) {
  let finalDataUrl = canvas.toDataURL(mimeType, quality);

  if ((mimeType === 'image/jpeg' || mimeType === 'image/jpg') && originalSrc && settings) {
    try {
      finalDataUrl = await injectMetadata(originalSrc, finalDataUrl, settings);
    } catch (err) {
      console.error('Error injecting metadata during file download:', err);
    }
  }

  const link = document.createElement('a');
  link.download = filename;
  link.href = finalDataUrl;
  link.click();
}

/**
 * Core rendering function that processes an image and draws a repeating mosaic watermark.
 * Safely downscales preview versions to maintain 60FPS UI performance on large 4K/8K images.
 */
export async function applyWatermark(
  imageSrc: string,
  settings: WatermarkSettings,
  options?: { maxDimension?: number },
  redactions: Redaction[] = []
): Promise<HTMLCanvasElement> {
  const mainImg = await loadImage(imageSrc);
  
  // Calculate dimensions
  let renderWidth = mainImg.naturalWidth;
  let renderHeight = mainImg.naturalHeight;
  
  if (options?.maxDimension) {
    const ratio = Math.min(options.maxDimension / renderWidth, options.maxDimension / renderHeight);
    if (ratio < 1) {
      renderWidth = Math.round(renderWidth * ratio);
      renderHeight = Math.round(renderHeight * ratio);
    }
  }
  
  const canvas = document.createElement('canvas');
  canvas.width = renderWidth;
  canvas.height = renderHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No se pudo inicializar el contexto 2D del Canvas.');
  }
  
  // Configure smooth scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  // Apply grayscale filter if enabled
  if (settings.grayscale) {
    ctx.filter = 'grayscale(100%)';
  }
  
  // Draw the original image
  ctx.drawImage(mainImg, 0, 0, renderWidth, renderHeight);
  
  // Reset filter so the watermark keeps its original colors
  if (settings.grayscale) {
    ctx.filter = 'none';
  }
  
  // Calculate proportional scale factor
  // If the image is downscaled for preview, we scale the watermark parameters (font size, spacing, offsets)
  // proportionally so that the preview looks IDENTICAL to the full resolution output.
  const scaleRatio = renderWidth / mainImg.naturalWidth;
  
  ctx.save();
  ctx.globalAlpha = settings.opacity;
  
  if (settings.type === 'text' && settings.textSpiral) {
    const spiralX = ((settings.textSpiralX ?? 50) / 100) * renderWidth;
    const spiralY = ((settings.textSpiralY ?? 50) / 100) * renderHeight;
    const turnSpacing = Math.max(10, settings.textSpiralTurnSpacing ?? 60) * scaleRatio;
    
    const scaledFontSize = Math.max(6, settings.fontSize * scaleRatio);
    ctx.font = `bold ${scaledFontSize}px ${settings.fontFamily}`;
    ctx.fillStyle = settings.color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    const textString = settings.text || 'Watermark';
    const textLen = textString.length;
    
    const b = turnSpacing / (2 * Math.PI);
    
    let theta = 0.5;
    let r = b * theta;
    const spacing = 4 * scaleRatio;
    
    const maxRadius = Math.sqrt(renderWidth * renderWidth + renderHeight * renderHeight);
    
    let charIndex = 0;
    let drawCount = 0;
    const maxDraws = 3000;
    
    while (r < maxRadius && drawCount < maxDraws) {
      const char = textString[charIndex % textLen];
      const charWidth = ctx.measureText(char).width || (scaledFontSize * 0.6);
      
      const arcStep = charWidth + spacing;
      const dTheta = arcStep / r;
      theta += dTheta;
      r = b * theta;
      
      const x = spiralX + r * Math.cos(theta);
      const y = spiralY + r * Math.sin(theta);
      
      const tangentAngle = theta + Math.PI / 2 + ((settings.rotation ?? 0) * Math.PI / 180);
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tangentAngle);
      ctx.fillText(char, 0, 0);
      ctx.restore();
      
      charIndex++;
      drawCount++;
    }
    
    ctx.restore();
    if (redactions.length > 0) {
      drawRedactionsOnCanvas(ctx, renderWidth, renderHeight, redactions);
    }
    return canvas;
  }
  
  let watermarkWidth = 0;
  let watermarkHeight = 0;
  let watermarkImg: HTMLImageElement | null = null;
  
  if (settings.type === 'image') {
    if (!settings.imageSrc) {
      ctx.restore();
      return canvas; // Empty image watermark, return base image
    }
    
    try {
      watermarkImg = await loadImage(settings.imageSrc);
      // Dimensions scaled by user imageScale preference AND resolution scaleRatio
      watermarkWidth = watermarkImg.naturalWidth * settings.imageScale * scaleRatio;
      watermarkHeight = watermarkImg.naturalHeight * settings.imageScale * scaleRatio;
      
      // Safety bounds to prevent division-by-zero or hanging loops
      if (watermarkWidth <= 2 || watermarkHeight <= 2) {
        ctx.restore();
        return canvas;
      }
    } catch (err) {
      ctx.restore();
      throw new Error('No se pudo cargar la imagen de la marca de agua.');
    }
  } else {
    // Text watermark
    // Scaled font size
    const scaledFontSize = Math.max(6, settings.fontSize * scaleRatio);
    ctx.font = `bold ${scaledFontSize}px ${settings.fontFamily}`;
    ctx.fillStyle = settings.color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    const textMetrics = ctx.measureText(settings.text || 'Watermark');
    watermarkWidth = textMetrics.width;
    watermarkHeight = scaledFontSize;
    
    // Safety bounds
    if (watermarkWidth <= 1) {
      watermarkWidth = 20;
    }
  }
  
  const centerX = renderWidth / 2;
  const centerY = renderHeight / 2;
  
  // Diagonal to cover the entire canvas even when rotated at 45 degrees
  const diagonal = Math.sqrt(renderWidth * renderWidth + renderHeight * renderHeight);
  
  // Spacing (user setting) scaled proportionally + base size
  const cellWidth = watermarkWidth + (Math.max(10, settings.spacingX) * scaleRatio);
  const cellHeight = watermarkHeight + (Math.max(10, settings.spacingY) * scaleRatio);
  
  // Translate to center and apply rotation
  ctx.translate(centerX, centerY);
  ctx.rotate((settings.rotation * Math.PI) / 180);
  
  // User offset parameters scaled proportionally
  const shiftedOffsetX = settings.offsetX * scaleRatio;
  const shiftedOffsetY = settings.offsetY * scaleRatio;
  
  // Draw tiled grid
  const startX = -diagonal / 2 - cellWidth;
  const endX = diagonal / 2 + cellWidth;
  const startY = -diagonal / 2 - cellHeight;
  const endY = diagonal / 2 + cellHeight;
  
  // Cap iterations to prevent browser freeze in case of extreme/corrupt settings
  let drawCount = 0;
  const maxDraws = 5000;
  
  for (let x = startX; x < endX; x += cellWidth) {
    for (let y = startY; y < endY; y += cellHeight) {
      if (drawCount++ > maxDraws) break;
      
      const posX = x + shiftedOffsetX;
      const posY = y + shiftedOffsetY;
      
      if (settings.type === 'text') {
        ctx.fillText(settings.text || 'Watermark', posX, posY);
      } else if (settings.type === 'image' && watermarkImg) {
        ctx.drawImage(
          watermarkImg,
          posX - watermarkWidth / 2,
          posY - watermarkHeight / 2,
          watermarkWidth,
          watermarkHeight
        );
      }
    }
    if (drawCount > maxDraws) break;
  }

  ctx.restore();
  if (redactions.length > 0) {
    drawRedactionsOnCanvas(ctx, renderWidth, renderHeight, redactions);
  }

  return canvas;
}
