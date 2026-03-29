import React from 'react';
import { useTranslation } from 'react-i18next';
import { GOOGLE_FONTS } from '../../constants/formats';
import type { TextConfig } from '../../types/template';
import { ColorPicker } from '../common/ColorPicker';
import { Select } from '../common/Select';
import { Slider } from '../common/Slider';
import { Toggle } from '../common/Toggle';

interface TextSettingsProps {
  config: TextConfig | null;
  onChange: (config: TextConfig | null) => void;
}

export const TextSettings: React.FC<TextSettingsProps> = ({ config, onChange }) => {
  const { t } = useTranslation();

  const handleToggle = (enabled: boolean) => {
    if (enabled) {
      onChange({
        enabled: true,
        content: '',
        fontFamily: 'Montserrat',
        fontSize: 48,
        color: '#000000',
        positionX: 50,
        positionY: 50,
        maxWidth: 80,
      });
    } else {
      onChange(null);
    }
  };

  const handleChange = <K extends keyof TextConfig>(key: K, value: TextConfig[K]) => {
    if (config) {
      onChange({ ...config, [key]: value });
    }
  };

  const fontOptions = GOOGLE_FONTS.map(font => ({ value: font, label: font }));

  return (
    <div className="space-y-3">
      <Toggle
        label={t('text.title')}
        checked={config?.enabled ?? false}
        onChange={handleToggle}
      />
      
      {config?.enabled && (
        <div className="space-y-3 pl-4 border-l-2 border-gray-700">
          <div className="space-y-1">
            <label className="text-xs text-gray-400">{t('text.title')}</label>
            <textarea
              value={config.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder={t('text.placeholder')}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm resize-none"
              rows={3}
            />
          </div>
          
          <Select
            label={t('text.font')}
            value={config.fontFamily}
            options={fontOptions}
            onChange={(value) => handleChange('fontFamily', value)}
          />
          
          <ColorPicker
            label={t('text.color')}
            value={config.color}
            onChange={(value) => handleChange('color', value)}
          />
          
          <Slider
            label={t('text.size')}
            value={config.fontSize}
            onChange={(value) => handleChange('fontSize', value)}
            min={12}
            max={120}
            unit="px"
          />
          
          <Slider
            label={t('text.positionX')}
            value={config.positionX}
            onChange={(value) => handleChange('positionX', value)}
            min={0}
            max={100}
            unit="%"
          />
          
          <Slider
            label={t('text.positionY')}
            value={config.positionY}
            onChange={(value) => handleChange('positionY', value)}
            min={0}
            max={100}
            unit="%"
          />
          
          <Slider
            label={t('text.maxWidth')}
            value={config.maxWidth}
            onChange={(value) => handleChange('maxWidth', value)}
            min={20}
            max={100}
            unit="%"
          />
        </div>
      )}
    </div>
  );
};
