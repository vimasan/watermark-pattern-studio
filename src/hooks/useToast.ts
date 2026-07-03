import { useCallback, useEffect, useState } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastState {
  message: string;
  variant: ToastVariant;
}

const DEFAULT_DURATION_MS = 4000;

/**
 * Gestiona una notificación tipo "toast" que se oculta automáticamente
 * tras un tiempo determinado. Soporta variantes (éxito/error/info) para
 * que el estilo visual refleje correctamente el tipo de mensaje.
 */
export function useToast(durationMs: number = DEFAULT_DURATION_MS) {
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), durationMs);
    return () => clearTimeout(timer);
  }, [toast, durationMs]);

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    setToast({ message, variant });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  return { toast, showToast, hideToast };
}
