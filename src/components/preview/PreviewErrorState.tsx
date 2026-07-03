import { AlertCircle } from 'lucide-react';

interface PreviewErrorStateProps {
  message: string;
  onResetImage?: () => void;
}

/** Estado de error mostrado cuando la vista previa no pudo renderizarse. */
export default function PreviewErrorState({ message, onResetImage }: PreviewErrorStateProps) {
  return (
    <div className="text-center max-w-sm mx-auto p-6 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500 flex flex-col items-center gap-4 relative z-10">
      <AlertCircle className="w-8 h-8" />
      <p className="text-sm font-semibold">{message}</p>
      {onResetImage && (
        <button
          id="reset-preview-image-btn"
          onClick={onResetImage}
          className="mt-2 text-xs font-bold px-5 py-2.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95 z-20"
        >
          Volver a la página inicial de carga
        </button>
      )}
    </div>
  );
}
