import { ChangeEvent, RefObject, useRef } from 'react';
import { WatermarkSettings } from '../types';
import { RESET_SETTINGS } from '../constants/resetSettings';
import { WATERMARK_PRESETS } from '../constants/watermarkPresets';
import Divider from './ui/Divider';
import SidebarHeader from './sidebar/SidebarHeader';
import PresetSelector from './sidebar/PresetSelector';
import WatermarkTypeToggle from './sidebar/WatermarkTypeToggle';
import TextWatermarkControls from './sidebar/TextWatermarkControls';
import ImageWatermarkControls from './sidebar/ImageWatermarkControls';
import RotationOpacityControls from './sidebar/RotationOpacityControls';
import SpacingOffsetControls from './sidebar/SpacingOffsetControls';
import QualityFiltersControls from './sidebar/QualityFiltersControls';
import MetadataControls from './sidebar/MetadataControls';

interface SidebarSettingsProps {
  settings: WatermarkSettings;
  onSettingsChange: (settings: WatermarkSettings) => void;
  theme: 'light' | 'dark';
}

export default function SidebarSettings({ settings, onSettingsChange, theme }: SidebarSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === 'dark';

  const updateSetting = <K extends keyof WatermarkSettings>(key: K, value: WatermarkSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleWatermarkImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updateSetting('imageSrc', event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearWatermarkImage = () => {
    updateSetting('imageSrc', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const applyPreset = (presetKey: string) => {
    const preset = WATERMARK_PRESETS.find((p) => p.key === presetKey);
    if (!preset) return;
    onSettingsChange({ ...settings, ...preset.settings });
  };

  return (
    <div
      className={`w-full lg:w-96 flex-shrink-0 flex flex-col border-r backdrop-blur-xl relative z-10 transition-colors duration-300 ${
        isDark
          ? 'bg-[#0b0f19]/70 border-white/10 text-slate-100 shadow-xl shadow-black/30'
          : 'bg-white/70 border-zinc-200/60 text-slate-800 shadow-xl shadow-zinc-200/30'
      } h-full overflow-y-auto`}
    >
      <SidebarHeader isDark={isDark} onReset={() => onSettingsChange(RESET_SETTINGS)} />

      <div className="p-5 space-y-6 flex-1">
        <WatermarkTypeToggle isDark={isDark} type={settings.type} onChange={(type) => updateSetting('type', type)} />

        <PresetSelector isDark={isDark} onApply={applyPreset} />

        <Divider isDark={isDark} />

        {settings.type === 'text' && (
          <TextWatermarkControls
            isDark={isDark}
            settings={settings}
            onUpdate={updateSetting}
            onSettingsChange={onSettingsChange}
          />
        )}

        {settings.type === 'image' && (
          <ImageWatermarkControls
            isDark={isDark}
            settings={settings}
            fileInputRef={fileInputRef as RefObject<HTMLInputElement>}
            onUpload={handleWatermarkImageUpload}
            onClear={clearWatermarkImage}
            onUpdate={updateSetting}
          />
        )}

        <Divider isDark={isDark} />

        <RotationOpacityControls settings={settings} onUpdate={updateSetting} />

        {!(settings.type === 'text' && settings.textSpiral) && (
          <>
            <Divider isDark={isDark} />
            <SpacingOffsetControls settings={settings} onUpdate={updateSetting} />
          </>
        )}

        <Divider isDark={isDark} />

        <QualityFiltersControls isDark={isDark} settings={settings} onUpdate={updateSetting} />

        <Divider isDark={isDark} />

        <MetadataControls isDark={isDark} settings={settings} onUpdate={updateSetting} />
      </div>
    </div>
  );
}
