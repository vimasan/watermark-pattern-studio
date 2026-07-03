import { useState } from 'react';
import { BatchItem, Redaction } from './types';
import SidebarSettings from './components/SidebarSettings';
import ImagePreview from './components/ImagePreview';
import BatchProcessor from './components/BatchProcessor';
import AppHeader, { WorkspaceTab } from './components/AppHeader';
import AppFooter from './components/AppFooter';
import AmbientBackground from './components/AmbientBackground';
import WelcomeScreen from './components/WelcomeScreen';
import ExportOverlay from './components/ExportOverlay';
import Toast from './components/Toast';
import { useTheme } from './hooks/useTheme';
import { useToast } from './hooks/useToast';
import { useWatermarkWorkspace } from './hooks/useWatermarkWorkspace';

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('editor');
  const { theme, isDark, toggleTheme } = useTheme('dark');
  const { toast, showToast } = useToast();

  const [redactions, setRedactions] = useState<Redaction[]>([]);

  const {
    settings,
    setSettings,
    batchItems,
    setBatchItems,
    singleImage,
    exporting,
    handleSingleImageUpload,
    handleFullResolutionExport,
    handleSelectFromBatch,
    resetSingleImage,
    resetWorkspace,
  } = useWatermarkWorkspace(showToast);

  const handleResetSingleImage = () => {
    resetSingleImage();
    setRedactions([]);
  };

  const handleDownloadRequested = () => {
    handleFullResolutionExport(redactions);
  };

  /** Selecciona una imagen del lote para previsualizarla y salta al editor interactivo. */
  const handleSelectFromBatchAndFocusEditor = (item: BatchItem) => {
    handleSelectFromBatch(item);
    setRedactions([]);
    setActiveTab('editor');
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 relative overflow-hidden ${
        isDark ? 'bg-[#05070a] text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      <AmbientBackground isDark={isDark} />

      {toast && <Toast toast={toast} isDark={isDark} />}

      <AppHeader
        isDark={isDark}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        batchCount={batchItems.length}
        onThemeToggle={toggleTheme}
        showResetButton={!!singleImage && batchItems.length < 2}
        onReset={resetWorkspace}
      />

      <main className="flex-1 overflow-hidden relative z-10 flex">
        {exporting && <ExportOverlay />}

        {/* TAB 1: EDITOR INTERACTIVO */}
        {activeTab === 'editor' &&
          (singleImage ? (
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <SidebarSettings settings={settings} onSettingsChange={setSettings} theme={theme} />
              <ImagePreview
                imageSrc={singleImage.src}
                fileName={singleImage.name}
                settings={settings}
                theme={theme}
                redactions={redactions}
                onRedactionsChange={setRedactions}
                onDownloadRequested={handleDownloadRequested}
                onResetImage={handleResetSingleImage}
              />
            </div>
          ) : (
            <WelcomeScreen isDark={isDark} onImageSelected={handleSingleImageUpload} />
          ))}

        {/* TAB 2: PROCESAMIENTO POR LOTES */}
        {activeTab === 'batch' && (
          <div className="flex-1 overflow-hidden">
            <BatchProcessor
              items={batchItems}
              onItemsChange={setBatchItems}
              onSelectPreview={handleSelectFromBatchAndFocusEditor}
              settings={settings}
              theme={theme}
            />
          </div>
        )}
      </main>

      <AppFooter isDark={isDark} />
    </div>
  );
}
