import { useTranslation } from 'react-i18next';
import type { FC } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import type { LogoConfig } from '../../types/template';
import { FileUploader } from '../common/FileUploader';
import { Slider } from '../common/Slider';
import { Toggle } from '../common/Toggle';

interface LogoSettingsProps {
  config: LogoConfig | null;
  onChange: (config: LogoConfig | null) => void;
  onLogoUpload: (data: string) => void;
  isHusseMode?: boolean;
  onOpenHusseModal?: () => void;
}

const LOGO_PRESETS = [
  { value: 'left-top', positionX: 5, positionY: 5, label: 'Lewy górny', labelEn: 'Left top' },
  { value: 'center', positionX: 50, positionY: 5, label: 'Środek', labelEn: 'Center' },
  { value: 'right-top', positionX: 95, positionY: 5, label: 'Prawy górny', labelEn: 'Right top' },
];

export const LogoSettings: FC<LogoSettingsProps> = ({
  config,
  onChange,
  onLogoUpload,
  isHusseMode = false,
  onOpenHusseModal,
}) => {
  const { t, i18n } = useTranslation();

  const handleToggle = (enabled: boolean) => {
    if (enabled) {
      onChange({
        enabled: true,
        positionX: 5,
        positionY: 5,
        scale: 15,
        opacity: 100,
      });
    } else {
      onChange(null);
    }
  };

  const handleChange = <K extends keyof LogoConfig>(key: K, value: LogoConfig[K]) => {
    if (config) {
      onChange({ ...config, [key]: value });
    }
  };

  const handlePresetChange = (preset: typeof LOGO_PRESETS[0]) => {
    if (config) {
      onChange({
        ...config,
        positionX: preset.positionX,
        positionY: preset.positionY,
      });
    }
  };

  const getCurrentPreset = () => {
    if (!config) return null;
    return LOGO_PRESETS.find(
      p => p.positionX === config.positionX && p.positionY === config.positionY
    )?.value || null;
  };

  return (
    <div className="space-y-3">
      <Toggle
        label={t('logo.title')}
        icon={<PhotoIcon className="w-4 h-4" />}
        checked={config?.enabled ?? false}
        onChange={handleToggle}
      />
      
      {config?.enabled && (
        <div className="space-y-3 pl-4 border-l-2 border-gray-700">
          <div className="flex gap-2">
            <FileUploader
              label={t('logo.upload')}
              onFileSelect={onLogoUpload}
            />
            {isHusseMode && onOpenHusseModal && (
              <button
                onClick={onOpenHusseModal}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white text-sm transition-colors"
              >
                Wybierz
              </button>
            )}
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">{t('logo.position')}</label>
            <select
              value={getCurrentPreset() || ''}
              onChange={(e) => {
                const preset = LOGO_PRESETS.find(p => p.value === e.target.value);
                if (preset) handlePresetChange(preset);
              }}
              className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white"
            >
              <option value="">{t('logo.custom') || 'Własna'}</option>
              {LOGO_PRESETS.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {i18n.language === 'pl' ? preset.label : preset.labelEn}
                </option>
              ))}
            </select>
          </div>
          
          <Slider
            label={t('logo.positionX')}
            value={config.positionX}
            onChange={(value) => handleChange('positionX', value)}
            min={-50}
            max={150}
            unit="%"
          />
          
          <Slider
            label={t('logo.positionY')}
            value={config.positionY}
            onChange={(value) => handleChange('positionY', value)}
            min={0}
            max={100}
            unit="%"
          />
          
          <Slider
            label=""
            value={config.scale}
            onChange={(value) => handleChange('scale', value)}
            min={5}
            max={100}
            unit="%"
          />
          
          <Slider
            label={t('logo.opacity')}
            value={config.opacity}
            onChange={(value) => handleChange('opacity', value)}
            unit="%"
          />
        </div>
      )}
    </div>
  );
};
