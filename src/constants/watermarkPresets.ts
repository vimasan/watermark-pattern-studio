import { WatermarkSettings } from '../types';

export interface WatermarkPreset {
  /** Identificador lógico de la plantilla (independiente del id del botón en el DOM). */
  key: string;
  /** Id del elemento en el DOM, tal y como existía en el componente original. */
  buttonId: string;
  label: string;
  description: string;
  descriptionClassName?: string;
  accentClass: string;
  settings: Partial<WatermarkSettings>;
}

export const WATERMARK_PRESETS: WatermarkPreset[] = [
  {
    key: 'confidential',
    buttonId: 'preset-confidential',
    label: 'Confidencial',
    description: 'Diagonal rojo tenue',
    accentClass: 'text-red-500/90',
    settings: {
      type: 'text',
      text: 'CONFIDENCIAL',
      fontSize: 36,
      color: '#ef4444',
      opacity: 0.18,
      rotation: -35,
      spacingX: 120,
      spacingY: 120,
      offsetX: 0,
      offsetY: 0,
    },
  },
  {
    key: 'discreet-white',
    buttonId: 'preset-discreet',
    label: 'Copyright',
    description: 'Mosaico sutil blanco',
    accentClass: 'text-teal-400',
    settings: {
      type: 'text',
      text: '© COPIA DE SEGURIDAD',
      fontSize: 20,
      color: '#ffffff',
      opacity: 0.25,
      rotation: 0,
      spacingX: 180,
      spacingY: 140,
      offsetX: 30,
      offsetY: 30,
    },
  },
  {
    key: 'dense-protect',
    buttonId: 'preset-dense',
    label: 'Mosaico Oscuro',
    description: 'Doble seguridad',
    descriptionClassName: 'font-mono',
    accentClass: 'text-orange-400',
    settings: {
      type: 'text',
      text: 'PROHIBIDA LA REPRODUCCIÓN',
      fontSize: 16,
      color: '#000000',
      opacity: 0.08,
      rotation: -45,
      spacingX: 60,
      spacingY: 80,
      offsetX: 0,
      offsetY: 0,
    },
  },
  {
    key: 'custom-logo',
    buttonId: 'preset-logo',
    label: 'Logo Mosaico',
    description: 'Distribución de marca',
    accentClass: 'text-indigo-400',
    settings: {
      type: 'image',
      imageScale: 0.4,
      opacity: 0.25,
      rotation: -25,
      spacingX: 150,
      spacingY: 150,
      offsetX: 0,
      offsetY: 0,
    },
  },
];
