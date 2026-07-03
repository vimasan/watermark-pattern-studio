export type WatermarkType = 'text' | 'image';

export interface WatermarkSettings {
  type: WatermarkType;
  // Text settings
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  // Common settings
  opacity: number;
  rotation: number; // in degrees
  spacingX: number; // horizontal gap (pixels)
  spacingY: number; // vertical gap (pixels)
  offsetX: number;  // horizontal pattern shift (pixels)
  offsetY: number;  // vertical pattern shift (pixels)
  // Image settings
  imageSrc: string | null; // Base64 or object URL of the watermark image
  imageScale: number;      // scaling factor for the watermark image (0.1 to 3)
  // Export & Filters
  grayscale: boolean;      // whether the source image should be grayscaled
  exportQuality: number;   // image compression quality (0.1 to 1.0)
  metadataAuthor?: string; // custom author/artist name
  metadataCopyright?: string; // custom copyright text
  // Text spiral effect
  textSpiral?: boolean;
  textSpiralX?: number; // 0 to 100
  textSpiralY?: number; // 0 to 100
  textSpiralTurnSpacing?: number; // spacing between turns
  prevRotation?: number; // stores previous rotation before enabling spiral
}

export interface BatchItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string; // mime type
  originalSrc: string; // Object URL for original image
  previewSrc: string | null; // Watermarked preview Base64 or Object URL
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  width?: number;
  height?: number;
}

export interface UnitTestResult {
  name: string;
  category: string;
  passed: boolean;
  message?: string;
  durationMs: number;
}

export const ACTIVE_DRAWING: string = 'active-drawing';
export const INACTIVE_DRAWING: string = 'inactive-drawing';

export type DrawingMode = typeof ACTIVE_DRAWING | typeof INACTIVE_DRAWING;

export interface Redaction {
  id: string;
  type: 'brush' | 'rect' | 'blur' | 'pixelate';
  color: string; // solid color for brush/rect, or 'transparent' for blur/pixelate
  size: number; // size in pixels (will be scaled proportionally)
  points: { x: number; y: number }[]; // percentages of image dimension (0 to 100)
}