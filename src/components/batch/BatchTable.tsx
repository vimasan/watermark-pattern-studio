import { Image as ImageIcon } from 'lucide-react';
import { BatchItem } from '../../types';
import BatchTableRow from './BatchTableRow';

interface BatchTableProps {
  isDark: boolean;
  items: BatchItem[];
  onSelectPreview: (item: BatchItem) => void;
  onRemove: (id: string) => void;
}

/** Tabla (o estado vacío) con la cola de imágenes del lote. */
export default function BatchTable({ isDark, items, onSelectPreview, onRemove }: BatchTableProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 opacity-40 bg-white/5 dark:bg-black/10 border border-white/5 rounded-3xl backdrop-blur-md">
        <ImageIcon className="w-12 h-12 mx-auto mb-3 text-slate-400" />
        <p className="text-xs font-semibold">No hay imágenes en la cola de procesamiento.</p>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-2xl overflow-hidden backdrop-blur-md ${
        isDark ? 'border-white/10 bg-black/30' : 'border-zinc-200 bg-white'
      }`}
    >
      <table className="w-full text-left border-collapse">
        <thead>
          <tr
            className={`text-[10px] uppercase font-bold tracking-wider opacity-60 border-b ${
              isDark ? 'bg-white/[0.02] border-white/10' : 'bg-zinc-50 border-zinc-200'
            }`}
          >
            <th className="p-4">Imagen</th>
            <th className="p-4">Nombre del Archivo</th>
            <th className="p-4 hidden sm:table-cell">Tamaño</th>
            <th className="p-4">Estado</th>
            <th className="p-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-xs">
          {items.map((item) => (
            <BatchTableRow key={item.id} item={item} onSelectPreview={onSelectPreview} onRemove={onRemove} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
