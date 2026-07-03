import { useCallback, useState } from 'react';
import { WatermarkSettings, BatchItem, Redaction } from '../types';
import { applyWatermark, downloadCanvas } from '../utils/watermarkEngine';
import { ToastVariant } from './useToast';

const DEFAULT_SETTINGS: WatermarkSettings = {
  type: 'text',
  text: 'COPIA CONFIDENCIAL',
  fontFamily: 'Inter, sans-serif',
  fontSize: 28,
  color: '#ef4444',
  opacity: 0.18,
  rotation: -30,
  spacingX: 120,
  spacingY: 120,
  offsetX: 0,
  offsetY: 0,
  imageSrc: null,
  imageScale: 0.4,
  grayscale: false,
  exportQuality: 0.95,
  metadataAuthor: '',
  metadataCopyright: '',
  textSpiral: false,
  textSpiralX: 50,
  textSpiralY: 50,
  textSpiralTurnSpacing: 60,
};

const INVALID_IMAGE_MESSAGE = 'Por favor, cargue un archivo de imagen válido (JPEG, PNG, WEBP).';

interface SingleImage {
  src: string;
  name: string;
}

/** Genera un identificador corto y razonablemente único para un elemento del lote. */
function generateItemId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 9);
}

/** Libera la URL de objeto asociada a una imagen si procede, evitando fugas de memoria. */
function revokeIfBlobUrl(src?: string | null) {
  if (src && src.startsWith('blob:')) {
    URL.revokeObjectURL(src);
  }
}

/**
 * Encapsula todo el estado y la lógica de negocio del espacio de trabajo:
 * ajustes de marca de agua, imágenes en lote, imagen activa en el editor
 * interactivo y el flujo de exportación en alta resolución.
 */
export function useWatermarkWorkspace(showToast: (message: string, variant?: ToastVariant) => void) {
  const [settings, setSettings] = useState<WatermarkSettings>(DEFAULT_SETTINGS);
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [singleImage, setSingleImage] = useState<SingleImage | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleSingleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast(INVALID_IMAGE_MESSAGE, 'error');
        return;
      }

      const fileUrl = URL.createObjectURL(file);

      setSingleImage((prev) => {
        // Evita fugas de memoria si el usuario reemplaza la imagen activa.
        revokeIfBlobUrl(prev?.src);
        return { src: fileUrl, name: file.name };
      });

      const item: BatchItem = {
        id: generateItemId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        originalSrc: fileUrl,
        previewSrc: null,
        status: 'pending',
        progress: 0,
      };
      setBatchItems((prev) => [item, ...prev]);
      showToast('Imagen cargada correctamente en el editor.');
    },
    [showToast]
  );

  /**
   * Renderiza la marca de agua sobre la imagen a 100% de resolución y la
   * descarga, evitando cualquier reducción de calidad.
   */
  const handleFullResolutionExport = useCallback(async (redactions: Redaction[] = []) => {
    if (!singleImage) return;
    setExporting(true);
    showToast('Iniciando renderizado en alta resolución (100%)...', 'info');

    // Da tiempo al navegador para pintar el spinner antes de bloquear el hilo principal.
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const highResCanvas = await applyWatermark(singleImage.src, settings, undefined, redactions);
      downloadCanvas(
        highResCanvas,
        `protegido_${singleImage.name}`,
        singleImage.name.endsWith('.png') ? 'image/png' : 'image/jpeg',
        settings.exportQuality,
        singleImage.src,
        settings
      );
      showToast('¡Exportación completada exitosamente con máxima fidelidad!');
    } catch (err) {
      console.error(err);
      showToast('Ocurrió un error al exportar la imagen original.', 'error');
    } finally {
      setExporting(false);
    }
  }, [singleImage, settings, showToast]);

  const handleSelectFromBatch = useCallback(
    (item: BatchItem) => {
      setSingleImage({ src: item.originalSrc, name: item.name });
      showToast(`Visualizando: ${item.name}`);
    },
    [showToast]
  );

  const resetSingleImage = useCallback(() => {
    setSingleImage((prev) => {
      revokeIfBlobUrl(prev?.src);
      return null;
    });
  }, []);

  const resetWorkspace = useCallback(() => {
    resetSingleImage();
    setBatchItems([]);
  }, [resetSingleImage]);

  return {
    settings,
    setSettings,
    batchItems,
    setBatchItems,
    singleImage,
    exporting,
    handleSingleImageUpload,
    handleFullResolutionExport,
    handleSelectFromBatch,
    resetSingleImage,
    resetWorkspace,
  };
}
