/** Genera un identificador corto y razonablemente único (usa crypto.randomUUID si está disponible). */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 9);
}
