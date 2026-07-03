import { WatermarkSettings } from '../types';

/**
 * Valores de fábrica usados por el botón "Restablecer" de la barra lateral.
 *
 * Nota: a diferencia del objeto original (que omitía metadataAuthor, metadataCopyright
 * y los campos de espiral), aquí se incluyen todos los campos explícitamente para que
 * "Restablecer" deje siempre el estado en un punto conocido en vez de dejar esos
 * campos en `undefined`.
 */
export const RESET_SETTINGS: WatermarkSettings = {
  type: 'text',
  text: 'MARCA DE AGUA',
  fontFamily: 'Inter, sans-serif',
  fontSize: 32,
  color: '#6366f1',
  opacity: 0.3,
  rotation: -30,
  spacingX: 120,
  spacingY: 120,
  offsetX: 0,
  offsetY: 0,
  imageSrc: null,
  imageScale: 0.5,
  grayscale: false,
  exportQuality: 0.95,
  metadataAuthor: '',
  metadataCopyright: '',
  textSpiral: false,
  textSpiralX: 50,
  textSpiralY: 50,
  textSpiralTurnSpacing: 60,
};
