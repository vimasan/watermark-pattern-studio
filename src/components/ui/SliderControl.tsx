import React from 'react';

interface SliderControlProps {
  id?: string;
  label: string;
  value: number;
  displayValue?: string;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  parse?: 'int' | 'float';
  disabled?: boolean;
  /** Versión reducida (texto/gap más pequeños), usada en los controles anidados del espiral. */
  compact?: boolean;
}

/**
 * Control deslizante reutilizable: etiqueta, valor formateado y `<input type="range">`.
 * Centraliza el estilo y el parseo compartidos por todos los sliders de la barra lateral,
 * que antes se repetían casi idénticos más de una decena de veces.
 */
export default function SliderControl({
  id,
  label,
  value,
  displayValue,
  min,
  max,
  step = 1,
  onChange,
  parse = 'int',
  disabled = false,
  compact = false,
}: SliderControlProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parse === 'float' ? parseFloat(e.target.value) : parseInt(e.target.value, 10));
  };

  return (
    <div className={compact ? 'space-y-1' : 'space-y-1.5'}>
      <div className={`flex justify-between font-semibold opacity-80 ${compact ? 'text-[11px]' : 'text-xs'}`}>
        <span>{label}</span>
        <span className="font-mono text-indigo-400 font-bold">{displayValue ?? value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        className={`w-full ${compact ? 'h-1' : 'h-1.5'} bg-indigo-950 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed`}
      />
    </div>
  );
}
