interface AmbientBackgroundProps {
  isDark: boolean;
}

/**
 * Manchas de gradiente decorativas en el fondo, puramente estéticas
 * (efecto "frosted glass" ambiental).
 */
export default function AmbientBackground({ isDark }: AmbientBackgroundProps) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      <div
        className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-all duration-1000 ${
          isDark ? 'bg-indigo-950/40' : 'bg-indigo-200/25'
        }`}
      />
      <div
        className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[140px] transition-all duration-1000 ${
          isDark ? 'bg-blue-950/30' : 'bg-blue-200/20'
        }`}
      />
      <div
        className={`absolute top-[20%] right-[10%] w-[30%] h-[40%] rounded-full blur-[100px] transition-all duration-1000 ${
          isDark ? 'bg-purple-950/30' : 'bg-purple-200/20'
        }`}
      />
    </div>
  );
}
