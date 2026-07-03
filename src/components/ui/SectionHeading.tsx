import React from 'react';

interface SectionHeadingProps {
  icon: React.ElementType;
  children: React.ReactNode;
}

/** Título de sección uniforme (icono + texto en mayúsculas) usado en toda la barra lateral. */
export default function SectionHeading({ icon: Icon, children }: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider opacity-60">
      <Icon className="w-3.5 h-3.5 text-indigo-400" />
      <span>{children}</span>
    </div>
  );
}
