import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { GOOGLE_FONTS } from '../../constants/formats';
import type { SubtextConfig } from '../../types/template';
import { ColorPicker } from '../common/ColorPicker';
import { Select } from '../common/Select';
import { Slider } from '../common/Slider';
import { Toggle } from '../common/Toggle';

interface SubtextSettingsProps {
  config: SubtextConfig | null;
  onChange: (config: SubtextConfig | null) => void;
}

export const SubtextSettings: React.FC<SubtextSettingsProps> = ({ config, onChange }) => {
  const { t } = useTranslation();

  const handleToggle = (enabled: boolean) => {
    if (enabled) {
      onChange({
        enabled: true,
        content: '',
        fontFamily: 'Roboto Slab',
        fontSize: 24,
        color: '#000000',
        positionX: 50,
        positionY: 70,
        maxWidth: 80,
      });
    } else {
      onChange(null);
    }
  };

  const handleChange = <K extends keyof SubtextConfig>(key: K, value: SubtextConfig[K]) => {
    if (config) {
      onChange({ ...config, [key]: value });
    }
  };

  const fontOptions = GOOGLE_FONTS.map(font => ({ value: font, label: font }));

  return (
    <div className="space-y-3">
      <Toggle
        label={t('subtext.title')}
        icon={<ArrowDownTrayIcon className="w-4 h-4" />}
        checked={config?.enabled ?? false}
        onChange={handleToggle}
      />
      
      {config?.enabled && (
        <div className="space-y-3 pl-4 border-l-2 border-gray-700">
          <div className="space-y-1">
            <label className="text-xs text-gray-400">{t('subtext.title')}</label>
            <textarea
              value={config.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder={t('subtext.placeholder')}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm resize-none"
              rows={2}
            />
          </div>
          
          <Select
            label={t('subtext.font')}
            value={config.fontFamily}
            options={fontOptions}
            onChange={(value) => handleChange('fontFamily', value)}
          />
          
          <ColorPicker
            label={t('subtext.color')}
            value={config.color}
            onChange={(value) => handleChange('color', value)}
          />
          
          <Slider
            label={t('subtext.size')}
            value={config.fontSize}
            onChange={(value) => handleChange('fontSize', value)}
            min={10}
            max={60}
            unit="px"
          />
          
          <Slider
            label={t('subtext.positionX')}
            value={config.positionX}
            onChange={(value) => handleChange('positionX', value)}
            min={0}
            max={100}
            unit="%"
          />
          
          <Slider
            label={t('subtext.positionY')}
            value={config.positionY}
            onChange={(value) => handleChange('positionY', value)}
            min={0}
            max={100}
            unit="%"
          />
          
          <Slider
            label={t('subtext.maxWidth')}
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
