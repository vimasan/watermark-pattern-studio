// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { formatBytes } from '../src/utils/formatBytes';
import { generateId } from '../src/utils/id';
import type { Redaction } from '../src/types';
import * as watermarkEngine from '../src/utils/watermarkEngine';
import { drawPreviewCanvas } from '../src/hooks/useWatermarkPreview';

describe('utility functions', () => {
  it('formats bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(5 * 1024 * 1024)).toBe('5 MB');
  });

  it('generates a non-empty unique id', () => {
    const idA = generateId();
    const idB = generateId();

    expect(typeof idA).toBe('string');
    expect(idA.length).toBeGreaterThan(0);
    expect(idB.length).toBeGreaterThan(0);
    expect(idA).not.toBe(idB);
  });
});

describe('watermarkEngine utilities', () => {
  it('returns the same data URL for already normalized data URLs', async () => {
    const dataUrl = 'data:text/plain;base64,SGVsbG8=';
    const result = await watermarkEngine.urlToDataUrl(dataUrl);
    expect(result).toBe(dataUrl);
  });

  it('returns the same output when injecting metadata into non-JPEG output', async () => {
    const originalSrc = 'data:image/png;base64,iVBORw0KGgo=';
    const canvasDataUrl = 'data:image/png;base64,iVBORw0KGgo=';
    const result = await watermarkEngine.injectMetadata(originalSrc, canvasDataUrl, {
      metadataAuthor: 'Test Author',
      metadataCopyright: 'Test Copyright',
    } as any);
    expect(result).toBe(canvasDataUrl);
  });

  it('converts a data URL to a Blob with the expected mime type', () => {
    const dataUrl = 'data:text/plain;base64,SGVsbG8=';
    const blob = watermarkEngine.dataUrlToBlob(dataUrl);

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('text/plain');
    expect(blob.size).toBeGreaterThan(0);
  });

  it('draws a rectangle redaction through canvas context commands', () => {
    const fillRect = vi.fn();
    const save = vi.fn();
    const restore = vi.fn();

    const ctx = {
      save,
      restore,
      fillStyle: '',
      fillRect,
    } as unknown as CanvasRenderingContext2D;

    const redactions: Redaction[] = [
      {
        id: 'test-redaction',
        type: 'rect',
        points: [
          { x: 25, y: 25 },
          { x: 75, y: 75 },
        ],
        color: '#000000',
        size: 10,
      },
    ];

    watermarkEngine.drawRedactionsOnCanvas(ctx, 100, 100, redactions);

    expect(save).toHaveBeenCalledOnce();
    expect(fillRect).toHaveBeenCalledWith(25, 25, 50, 50);
    expect(restore).toHaveBeenCalledOnce();
  });

  it('draws the watermark base image before overlaying redactions', () => {
    const clearRect = vi.fn();
    const drawImage = vi.fn();
    const fillRect = vi.fn();

    const ctx = {
      clearRect,
      drawImage,
      fillRect,
      save: vi.fn(),
      restore: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    const targetCanvas = {
      width: 100,
      height: 100,
      getContext: vi.fn().mockReturnValue(ctx),
    } as unknown as HTMLCanvasElement;
    const baseCanvas = { width: 100, height: 100 } as HTMLCanvasElement;

    drawPreviewCanvas(targetCanvas, baseCanvas, [
      {
        id: 'redaction-1',
        type: 'rect',
        points: [{ x: 25, y: 25 }, { x: 75, y: 75 }],
        color: '#000000',
        size: 10,
      },
    ] as Redaction[]);

    expect(clearRect).toHaveBeenCalledWith(0, 0, 100, 100);
    expect(drawImage).toHaveBeenCalledWith(baseCanvas, 0, 0);
    expect(fillRect).toHaveBeenCalledWith(25, 25, 50, 50);
  });

  it('applies a text watermark using a mocked Image and canvas context', async () => {
    const save = vi.fn();
    const restore = vi.fn();
    const translate = vi.fn();
    const rotate = vi.fn();
    const drawImage = vi.fn();
    const fillText = vi.fn();
    const measureText = vi.fn().mockReturnValue({ width: 40 });

    const fakeCtx = {
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'low',
      filter: 'none',
      globalAlpha: 1,
      save,
      restore,
      translate,
      rotate,
      drawImage,
      fillText,
      measureText,
      fillStyle: '',
      textBaseline: '',
      textAlign: '',
      font: '',
    } as unknown as CanvasRenderingContext2D;

    const fakeCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue(fakeCtx),
    } as unknown as HTMLCanvasElement;

    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'canvas') {
        return fakeCanvas as unknown as HTMLCanvasElement;
      }
      return document.createElement.call(document, tag);
    });

    const originalImage = global.Image;
    class FakeImage {
      naturalWidth = 100;
      naturalHeight = 100;
      crossOrigin?: string;
      onload?: () => void;
      onerror?: () => void;
      set src(value: string) {
        if (this.onload) {
          this.onload();
        }
      }
    }
    // @ts-expect-error global stub
    global.Image = FakeImage;

    const canvas = await watermarkEngine.applyWatermark(
      'data:image/png;base64,AAAA',
      {
        type: 'text',
        text: 'TEST',
        fontSize: 20,
        fontFamily: 'Arial',
        color: '#000000',
        opacity: 1,
        rotation: 0,
        spacingX: 20,
        spacingY: 20,
        offsetX: 0,
        offsetY: 0,
        grayscale: false,
        textSpiral: false,
        imageScale: 1,
      } as any,
      { maxDimension: 100 },
      []
    );

    expect(canvas).toBeDefined();
    expect((canvas as any).width).toBe(100);
    expect((canvas as any).height).toBe(100);

    // restore original globals and spies
    global.Image = originalImage;
    createElementSpy.mockRestore();
  });

  it('downloads canvas as JPEG and creates a link click event', async () => {
    const jpegDataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDAREAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAQFBv/EABcBAQADAAAAAAAAAAAAAAAAAAABAgP/2gAIAQEAAD8A/wD/xAAUEAEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/APP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/APP/2Q==';
    const canvas = {
      toDataURL: vi.fn().mockReturnValue(jpegDataUrl),
    } as unknown as HTMLCanvasElement;

    const click = vi.fn();
    const link = {
      download: '',
      href: '',
      click,
    } as unknown as HTMLAnchorElement;

    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        return link as unknown as HTMLAnchorElement;
      }
      return document.createElement.call(document, tag);
    });

    const settings = { metadataAuthor: 'Author', metadataCopyright: 'Copyright' } as any;

    await watermarkEngine.downloadCanvas(canvas, 'test.jpg', 'image/jpeg', 0.8, jpegDataUrl, settings);

    expect((canvas as any).toDataURL).toHaveBeenCalledWith('image/jpeg', 0.8);
    expect(link.download).toBe('test.jpg');
    expect(link.href.startsWith('data:image/jpeg;base64,')).toBe(true);
    expect(click).toHaveBeenCalledOnce();

    createElementSpy.mockRestore();
  });
});
