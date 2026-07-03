import React from 'react';

interface ToggleSwitchProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** Interruptor tipo "pill" reutilizado por los distintos ajustes booleanos. */
export default function ToggleSwitch({ id, checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      id={id}
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-all duration-300 cursor-pointer flex-shrink-0 ${
        checked ? 'bg-indigo-600 justify-end' : 'bg-zinc-700 justify-start'
      }`}
    >
      <div className="w-5 h-5 bg-white rounded-full shadow-md" />
    </button>
  );
}
