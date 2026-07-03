export interface FontOption {
  value: string;
  label: string;
}

export const FONTS: FontOption[] = [
  { value: 'Inter, sans-serif', label: 'Inter (Sans-serif)' },
  { value: 'system-ui, sans-serif', label: 'Sistema UI' },
  { value: 'Georgia, serif', label: 'Georgia (Serif)' },
  { value: 'Courier New, monospace', label: 'Courier New (Mono)' },
  { value: 'Impact, sans-serif', label: 'Impact (Bold Display)' },
  { value: 'monospace', label: 'JetBrains / Fira Mono' },
];
