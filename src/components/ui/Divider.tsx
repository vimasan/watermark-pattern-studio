import React from 'react';

interface DividerProps {
  isDark: boolean;
}

/** Separador horizontal fino entre secciones. */
export default function Divider({ isDark }: DividerProps) {
  return <div className={`h-px ${isDark ? 'bg-white/10' : 'bg-zinc-200/60'}`} />;
}
