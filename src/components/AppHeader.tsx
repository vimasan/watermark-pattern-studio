import { ElementType } from 'react';
import { Layers, Sliders, Grid3X3, ShieldCheck, ChevronLeft, Sun, Moon } from 'lucide-react';

export type WorkspaceTab = 'editor' | 'batch';

interface AppHeaderProps {
  isDark: boolean;
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  batchCount: number;
  onThemeToggle: () => void;
  showResetButton: boolean;
  onReset: () => void;
}

/**
 * Barra de navegación superior: logotipo, selector de pestañas, indicador
 * de privacidad y conmutador de tema.
 */
export default function AppHeader({
  isDark,
  activeTab,
  onTabChange,
  batchCount,
  onThemeToggle,
  showResetButton,
  onReset,
}: AppHeaderProps) {
  return (
    <header
      className={`relative z-10 h-16 border-b px-6 flex items-center justify-between flex-shrink-0 shadow-lg transition-all ${
        isDark ? 'border-white/10 bg-white/5 backdrop-blur-2xl' : 'border-zinc-200/60 bg-white/60 backdrop-blur-2xl'
      }`}
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-2.5">
        {showResetButton && (
          <button
            id="reset-preview-image-btn"
            onClick={onReset}
            className={`p-1 rounded-lg transition-all ${isDark ? 'hover:bg-white/10' : 'hover:bg-zinc-100'}`}
            title="Volver a la selección de imágenes"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>
        )}
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <Layers className="w-4.5 h-4.5" />
        </div>
        <span className={`font-bold text-base tracking-tight font-sans ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Watermark<span className="text-indigo-400">Pro</span>
        </span>
      </div>

      {/* Tab Selection */}
      <nav
        className={`flex items-center gap-1 p-1 rounded-full border ${
          isDark ? 'bg-black/20 border-white/5' : 'bg-slate-200/40 border-zinc-200/30'
        }`}
      >
        <TabButton
          id="tab-editor-btn"
          label="Editor Interactivo"
          icon={Sliders}
          isActive={activeTab === 'editor'}
          isDark={isDark}
          onClick={() => onTabChange('editor')}
        />
        <TabButton
          id="tab-batch-btn"
          label="Procesar por Lotes"
          icon={Grid3X3}
          isActive={activeTab === 'batch'}
          isDark={isDark}
          onClick={() => onTabChange('batch')}
          badgeCount={batchCount}
        />
      </nav>

      {/* Utility Actions */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Procesamiento Local</span>
        </div>

        <button
          id="theme-toggle-btn"
          onClick={onThemeToggle}
          className={`p-2 rounded-xl border transition-all ${
            isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-zinc-200 bg-white hover:bg-zinc-100'
          }`}
          title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>
      </div>
    </header>
  );
}

interface TabButtonProps {
  id: string;
  label: string;
  icon: ElementType;
  isActive: boolean;
  isDark: boolean;
  onClick: () => void;
  badgeCount?: number;
}

function TabButton({ id, label, icon: Icon, isActive, isDark, onClick, badgeCount }: TabButtonProps) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
        isActive
          ? isDark
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/35'
            : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
          : isDark
          ? 'text-slate-300 hover:text-white hover:bg-white/5'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
      {!!badgeCount && (
        <span className="px-1.5 py-0.5 rounded-full bg-white text-[10px] text-indigo-600 font-bold">
          {badgeCount}
        </span>
      )}
    </button>
  );
}
