import React from 'react';
import { useTranslation } from 'react-i18next';
import { LOGO_POSITIONS } from '../../constants/formats';
import type { LogoConfig } from '../../types/template';
import { FileUploader } from '../common/FileUploader';
import { Select } from '../common/Select';
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
  const { t, i18n } = useTranslation();

  const handleToggle = (enabled: boolean) => {
    if (enabled) {
      onChange({
        enabled: true,
        position: 'left-top',
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

  const positions = LOGO_POSITIONS.map(p => ({
    value: p.value,
    label: i18n.language === 'pl' ? p.label : p.labelEn,
  }));

  return (
    <div className="space-y-3">
      <Toggle
        label={t('logo.title')}
        checked={config?.enabled ?? false}
        onChange={handleToggle}
      />
      
      {config?.enabled && (
        <div className="space-y-3 pl-4 border-l-2 border-gray-700">
          <FileUploader
            label={t('logo.upload')}
            onFileSelect={onLogoUpload}
          />
          
          <Select
            label={t('logo.position')}
            value={config.position}
            options={positions}
            onChange={(value) => handleChange('position', value as LogoConfig['position'])}
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
