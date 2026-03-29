import React from 'react';
import { useTranslation } from 'react-i18next';
import { PhotoIcon } from '@heroicons/react/24/outline';
import type { LogoConfig } from '../../types/template';
import { FileUploader } from '../common/FileUploader';
import { Slider } from '../common/Slider';
import { Toggle } from '../common/Toggle';

interface LogoSettingsProps {
  config: LogoConfig | null;
  onChange: (config: LogoConfig | null) => void;
  onLogoUpload: (data: string) => void;
}

export const LogoSettings: React.FC<LogoSettingsProps> = ({
  config,
  onChange,
  onLogoUpload,
}) => {
  const { t } = useTranslation();

  const handleToggle = (enabled: boolean) => {
    if (enabled) {
      onChange({
        enabled: true,
        positionX: 0,
        positionY: 0,
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
          <FileUploader
            label={t('logo.upload')}
            onFileSelect={onLogoUpload}
          />
          
          <Slider
            label={t('logo.position') + ' X'}
            value={config.positionX}
            onChange={(value) => handleChange('positionX', value)}
            min={-50}
            max={50}
            unit="%"
          />
          
          <Slider
            label={t('logo.position') + ' Y'}
            value={config.positionY}
            onChange={(value) => handleChange('positionY', value)}
            min={0}
            max={100}
            unit="%"
          />
          
          <Slider
            label={t('logo.size')}
            value={config.scale}
            onChange={(value) => handleChange('scale', value)}
            min={5}
            max={40}
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
