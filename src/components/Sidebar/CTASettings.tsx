import React from 'react';
import { useTranslation } from 'react-i18next';
import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { CTA_POSITIONS, PRESET_COLORS } from '../../constants/formats';
import type { CTAConfig } from '../../types/template';
import { Select } from '../common/Select';
import { Slider } from '../common/Slider';
import { Toggle } from '../common/Toggle';

interface CTASettingsProps {
  config: CTAConfig | null;
  onChange: (config: CTAConfig | null) => void;
}

export const CTASettings: React.FC<CTASettingsProps> = ({ config, onChange }) => {
  const { t, i18n } = useTranslation();

  const handleToggle = (enabled: boolean) => {
    if (enabled) {
      onChange({
        enabled: true,
        text: '',
        position: 'center',
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
        borderRadius: 30,
      });
    } else {
      onChange(null);
    }
  };

  const handleChange = <K extends keyof CTAConfig>(key: K, value: CTAConfig[K]) => {
    if (config) {
      onChange({ ...config, [key]: value });
    }
  };

  const positions = CTA_POSITIONS.map(p => ({
    value: p.value,
    label: i18n.language === 'pl' ? p.label : p.labelEn,
  }));

  return (
    <div className="space-y-3">
      <Toggle
        label={t('cta.title')}
        icon={<CursorArrowRaysIcon className="w-4 h-4" />}
        checked={config?.enabled ?? false}
        onChange={handleToggle}
      />
      
      {config?.enabled && (
        <div className="space-y-3 pl-4 border-l-2 border-gray-700">
          <div className="space-y-1">
            <label className="text-xs text-gray-400">{t('cta.text')}</label>
            <input
              type="text"
              value={config.text}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder={t('cta.textPlaceholder')}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
            />
          </div>
          
          <Select
            label={t('cta.position')}
            value={config.position}
            options={positions}
            onChange={(value) => handleChange('position', value as CTAConfig['position'])}
          />
          
          <div className="space-y-1">
            <label className="text-xs text-gray-400">{t('cta.bgColor')}</label>
            <div className="flex gap-1">
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-gray-600 bg-transparent"
              />
              {PRESET_COLORS.slice(0, 3).map((preset) => (
                <button
                  key={preset.color}
                  onClick={() => handleChange('backgroundColor', preset.color)}
                  className={`w-8 h-8 rounded border-2 transition-all ${
                    config.backgroundColor === preset.color ? 'border-gray-400' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: preset.color }}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-gray-400">{t('cta.textColor')}</label>
            <div className="flex gap-1">
              <input
                type="color"
                value={config.textColor}
                onChange={(e) => handleChange('textColor', e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-gray-600 bg-transparent"
              />
              <button
                onClick={() => handleChange('textColor', '#FFFFFF')}
                className={`w-8 h-8 rounded border-2 transition-all ${
                  config.textColor === '#FFFFFF' ? 'border-gray-400' : 'border-transparent'
                }`}
                style={{ backgroundColor: '#FFFFFF' }}
              />
              <button
                onClick={() => handleChange('textColor', '#000000')}
                className={`w-8 h-8 rounded border-2 transition-all ${
                  config.textColor === '#000000' ? 'border-gray-400' : 'border-transparent'
                }`}
                style={{ backgroundColor: '#000000' }}
              />
            </div>
          </div>
          
          <Slider
            label={t('cta.borderRadius')}
            value={config.borderRadius}
            onChange={(value) => handleChange('borderRadius', value)}
            min={0}
            max={50}
            unit="px"
          />
        </div>
      )}
    </div>
  );
};
