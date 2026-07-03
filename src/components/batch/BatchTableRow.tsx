import { Download, Trash2 } from 'lucide-react';
import { BatchItem } from '../../types';
import { formatBytes } from '../../utils/formatBytes';
import BatchStatusBadge from './BatchStatusBadge';

interface BatchTableRowProps {
  item: BatchItem;
  onSelectPreview: (item: BatchItem) => void;
  onRemove: (id: string) => void;
}

/** Fila individual de la tabla de elementos del lote. */
export default function BatchTableRow({ item, onSelectPreview, onRemove }: BatchTableRowProps) {
  return (
    <tr className="hover:bg-white/[0.02] transition-colors bg-transparent">
      <td className="p-4">
        <img
          src={item.originalSrc}
          alt="Thumbnail"
          className="w-11 h-11 object-cover bg-black/20 rounded-lg border border-white/10"
        />
      </td>

      <td className="p-4 font-bold max-w-[150px] md:max-w-[240px] truncate">
        <div>{item.name}</div>
        {item.width && item.height && (
          <div className="text-[10px] opacity-50 font-mono mt-0.5 font-normal">
            {item.width} x {item.height} px
          </div>
        )}
      </td>

      <td className="p-4 hidden sm:table-cell font-mono opacity-70">{formatBytes(item.size)}</td>

      <td className="p-4">
        <div className="flex items-center gap-1.5">
          <BatchStatusBadge status={item.status} errorMessage={item.error} />
        </div>
      </td>

      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onSelectPreview(item)}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-500/10 hover:bg-indigo-600 text-indigo-400 hover:text-white transition-all cursor-pointer"
            title="Cargar esta imagen en el editor interactivo"
          >
            Ver
          </button>

          {item.status === 'completed' && item.previewSrc && (
            <a
              href={item.previewSrc}
              download={`protegido_${item.name}`}
              className="p-1.5 text-slate-400 hover:text-green-400 rounded-lg hover:bg-green-500/10 transition-colors"
              title="Descargar imagen protegida en máxima calidad"
            >
              <Download className="w-4 h-4" />
            </a>
          )}

          <button
            onClick={() => onRemove(item.id)}
            disabled={item.status === 'processing'}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors disabled:opacity-30 cursor-pointer"
            title="Eliminar de la lista"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
