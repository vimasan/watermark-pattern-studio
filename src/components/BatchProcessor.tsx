import { Dispatch, RefObject, SetStateAction } from 'react';
import { BatchItem, WatermarkSettings } from '../types';
import { useBatchQueue } from '../hooks/useBatchQueue';
import BatchToolbar from './batch/BatchToolbar';
import BatchStatsBar from './batch/BatchStatsBar';
import BatchDropzone from './batch/BatchDropzone';
import BatchTable from './batch/BatchTable';

interface BatchProcessorProps {
  items: BatchItem[];
  onItemsChange: Dispatch<SetStateAction<BatchItem[]>>;
  onSelectPreview: (item: BatchItem) => void;
  settings: WatermarkSettings;
  theme: 'light' | 'dark';
}

export default function BatchProcessor({
  items,
  onItemsChange,
  onSelectPreview,
  settings,
  theme,
}: BatchProcessorProps) {
  const isDark = theme === 'dark';

  const {
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
  } = useBatchQueue({ items, onItemsChange, onSelectPreview, settings });

  return (
    <div className={`p-6 flex flex-col h-full overflow-hidden relative z-10 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
      <BatchToolbar
        isDark={isDark}
        hasItems={items.length > 0}
        processingAll={processingAll}
        pendingCount={stats.pending}
        completedCount={stats.completed}
        onProcessAll={processAll}
        onDownloadAll={downloadAllCompleted}
        onClearAll={clearAll}
      />

      {items.length > 0 && <BatchStatsBar isDark={isDark} stats={stats} />}

      <BatchDropzone
        isDark={isDark}
        dragActive={dragActive}
        fileInputRef={fileInputRef as RefObject<HTMLInputElement>}
        onDrag={handleDrag}
        onDrop={handleDrop}
        onFilesSelected={handleFiles}
      />

      <div className="flex-1 overflow-y-auto">
        <BatchTable isDark={isDark} items={items} onSelectPreview={onSelectPreview} onRemove={removeItem} />
      </div>
    </div>
  );
}
