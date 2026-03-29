import React from 'react';
import { useTranslation } from 'react-i18next';
import { CubeIcon } from '@heroicons/react/24/outline';
import type { PackshotConfig } from '../../types/template';
import { FileUploader } from '../common/FileUploader';
import { Slider } from '../common/Slider';
import { Toggle } from '../common/Toggle';

interface PackshotSettingsProps {
  config: PackshotConfig | null;
  onChange: (config: PackshotConfig | null) => void;
  onPackshotUpload: (data: string) => void;
}

export const PackshotSettings: React.FC<PackshotSettingsProps> = ({
  config,
  onChange,
  onPackshotUpload,
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
          <FileUploader
            label={t('packshot.upload')}
            onFileSelect={onPackshotUpload}
          />
          
          <Slider
            label={t('packshot.position') + ' X'}
            value={config.positionX}
            onChange={(value) => handleChange('positionX', value)}
            min={-50}
            max={50}
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
            max={100}
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
