import { useRef, useState } from 'react';
import { BatchItem, WatermarkSettings } from '../types';
import { applyWatermark, injectMetadata, dataUrlToBlob } from '../utils/watermarkEngine';
import { generateId } from '../utils/id';

interface UseBatchQueueParams {
  items: BatchItem[];
  onItemsChange: React.Dispatch<React.SetStateAction<BatchItem[]>>;
  onSelectPreview: (item: BatchItem) => void;
  settings: WatermarkSettings;
}

/**
 * Encapsula el estado y la lógica de negocio del procesador por lotes
 */
export function useBatchQueue({ items, onItemsChange, onSelectPreview, settings }: UseBatchQueueParams) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [processingAll, setProcessingAll] = useState(false);

  const handleFiles = (files: FileList) => {
    const newItems: BatchItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      newItems.push({
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        originalSrc: URL.createObjectURL(file),
        previewSrc: null,
        status: 'pending',
        progress: 0,
      });
    }

    onItemsChange((prev) => [...prev, ...newItems]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  /**
   * Elimina un elemento del lote liberando sus URLs de objeto.
   */
  const removeItem = (id: string) => {
    const itemToRemove = items.find((item) => item.id === id);
    if (itemToRemove) {
      if (itemToRemove.previewSrc) {
        URL.revokeObjectURL(itemToRemove.previewSrc);
      }
      URL.revokeObjectURL(itemToRemove.originalSrc);
    }

    const remaining = items.filter((item) => item.id !== id);
    onItemsChange(remaining);

    if (remaining.length > 0) {
      onSelectPreview(remaining[remaining.length - 1]);
    }
  };

  const clearAll = () => {
    items.forEach((item) => {
      if (item.previewSrc) URL.revokeObjectURL(item.previewSrc);
      URL.revokeObjectURL(item.originalSrc);
    });
    onItemsChange([]);
  };

  /** Procesa un único elemento del lote a máxima resolución. */
  const processItem = async (item: BatchItem, currentSettings: WatermarkSettings): Promise<BatchItem> => {
    onItemsChange((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, status: 'processing', progress: 20 } : it))
    );

    try {
      // Se procesa a resolución COMPLETA (sin la opción maxDimension usada en la vista previa).
      const canvas = await applyWatermark(item.originalSrc, currentSettings);
      const mimeType = item.type || 'image/jpeg';
      let dataUrl = canvas.toDataURL(mimeType, currentSettings.exportQuality);

      if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
        try {
          dataUrl = await injectMetadata(item.originalSrc, dataUrl, currentSettings);
        } catch (err) {
          console.error('Error injecting metadata in batch item:', err);
        }
      }

      const blobUrl = URL.createObjectURL(dataUrlToBlob(dataUrl));

      return {
        ...item,
        previewSrc: blobUrl,
        status: 'completed',
        progress: 100,
        width: canvas.width,
        height: canvas.height,
      };
    } catch (err: any) {
      return {
        ...item,
        status: 'error',
        progress: 0,
        error: err.message || 'Error al renderizar marca de agua.',
      };
    }
  };

  const processAll = async () => {
    if (items.length === 0 || processingAll) return;
    setProcessingAll(true);

    const itemsToProcess = items.filter((it) => it.status === 'pending' || it.status === 'error');

    for (const item of itemsToProcess) {
      const result = await processItem(item, settings);
      onItemsChange((prev) => prev.map((it) => (it.id === item.id ? result : it)));
    }

    setProcessingAll(false);
  };

  const downloadAllCompleted = () => {
    const completedItems = items.filter((item) => item.status === 'completed' && item.previewSrc);
    if (completedItems.length === 0) return;

    completedItems.forEach((item, index) => {
      // Escalonado para que el navegador pueda gestionar varias descargas sin bloquearse.
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = item.previewSrc!;
        link.download = `protegido_${item.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 250);
    });
  };

  const stats = {
    total: items.length,
    pending: items.filter((i) => i.status === 'pending').length,
    processing: items.filter((i) => i.status === 'processing').length,
    completed: items.filter((i) => i.status === 'completed').length,
    error: items.filter((i) => i.status === 'error').length,
  };

  return {
    fileInputRef,
    dragActive,
    processingAll,
    stats,
    handleFiles,
    handleDrag,
    handleDrop,
    removeItem,
    clearAll,
    processAll,
    downloadAllCompleted,
  };
}
