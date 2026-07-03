import { DragEvent, RefObject } from 'react';
import { Upload } from 'lucide-react';

interface BatchDropzoneProps {
  isDark: boolean;
  dragActive: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  onDrag: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  onFilesSelected: (files: FileList) => void;
}

/** Zona de arrastrar y soltar (o clic) para añadir imágenes al lote. */
export default function BatchDropzone({
  isDark,
  dragActive,
  fileInputRef,
  onDrag,
  onDrop,
  onFilesSelected,
}: BatchDropzoneProps) {
  return (
    <div
      onDragEnter={onDrag}
      onDragOver={onDrag}
      onDragLeave={onDrag}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all mb-6 relative overflow-hidden group backdrop-blur-md ${
        dragActive
          ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]'
          : isDark
          ? 'border-white/10 bg-black/20 hover:bg-white/[0.02] hover:border-indigo-500/30'
          : 'border-zinc-300 bg-zinc-50/50 hover:bg-zinc-50 hover:border-indigo-400'
      }`}
    >
      <Upload className="w-10 h-10 mx-auto text-indigo-400 mb-3 group-hover:animate-bounce" />
      <h3 className="font-bold text-sm">Arrastra y suelta tus imágenes aquí</h3>
      <p className="text-xs opacity-60 mt-1 max-w-md mx-auto">
        Soporta formatos JPEG, PNG, WEBP. Resolución ilimitada (4K, 8K, etc.)
      </p>
      <span className="inline-block mt-4 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-full shadow-md shadow-indigo-600/30">
        Seleccionar archivos manualmente
      </span>
      <input
        ref={fileInputRef}
        id="batch-files-input"
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => e.target.files && onFilesSelected(e.target.files)}
        className="hidden"
      />
    </div>
  );
}
