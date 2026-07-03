const UNITS = ['B', 'KB', 'MB', 'GB'] as const;

/** Formatea un tamaño en bytes a una representación legible (ej. "2.4 MB"). */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const exponent = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, exponent);
  return `${parseFloat(value.toFixed(1))} ${UNITS[exponent]}`;
}
