import { useTranslation } from 'react-i18next';
import type { FC } from 'react';
import { CubeIcon } from '@heroicons/react/24/outline';
import type { PackshotConfig } from '../../types/template';
import { FileUploader } from '../common/FileUploader';
import { Slider } from '../common/Slider';
import { Toggle } from '../common/Toggle';

interface PackshotSettingsProps {
  config: PackshotConfig | null;
  onChange: (config: PackshotConfig | null) => void;
  onPackshotUpload: (data: string) => void;
  isHusseMode?: boolean;
  onOpenHusseModal?: () => void;
}

export const PackshotSettings: FC<PackshotSettingsProps> = ({
  config,
  onChange,
  onPackshotUpload,
  isHusseMode = false,
  onOpenHusseModal,
}) => {
  const { t } = useTranslation();

  const handleToggle = (enabled: boolean) => {
    if (enabled) {
      onChange({
        enabled: true,
        positionX: 0,
        positionY: 30,
        scale: 50,
        opacity: 100,
      });
    } else {
      onChange(null);
    }
  };

  const handleChange = <K extends keyof PackshotConfig>(key: K, value: PackshotConfig[K]) => {
    if (config) {
      onChange({ ...config, [key]: value });
    }
  };

  return (
    <div className="space-y-3">
      <Toggle
        label={t('packshot.title')}
        icon={<CubeIcon className="w-4 h-4" />}
        checked={config?.enabled ?? false}
        onChange={handleToggle}
      />
      
      {config?.enabled && (
        <div className="space-y-3 pl-4 border-l-2 border-gray-700">
          <div className="flex gap-2">
            <FileUploader
              label={t('packshot.upload')}
              onFileSelect={onPackshotUpload}
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
          
          <Slider
            label={t('packshot.position') + ' X'}
            value={config.positionX}
            onChange={(value) => handleChange('positionX', value)}
            min={-50}
            max={150}
            unit="%"
          />
          
          <Slider
            label={t('packshot.position') + ' Y'}
            value={config.positionY}
            onChange={(value) => handleChange('positionY', value)}
            min={0}
            max={100}
            unit="%"
          />
          
          <Slider
            label={t('packshot.size')}
            value={config.scale}
            onChange={(value) => handleChange('scale', value)}
            min={10}
            max={200}
            unit="%"
          />
          
          <Slider
            label={t('packshot.opacity')}
            value={config.opacity}
            onChange={(value) => handleChange('opacity', value)}
            unit="%"
          />
        </div>
      )}
    </div>
  );
};
