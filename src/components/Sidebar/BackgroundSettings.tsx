import React from 'react';
import { useTranslation } from 'react-i18next';
import { PRESET_COLORS } from '../../constants/formats';
import { ColorPicker } from '../common/ColorPicker';

interface BackgroundSettingsProps {
  color: string;
  onChange: (color: string) => void;
}

export const BackgroundSettings: React.FC<BackgroundSettingsProps> = ({ color, onChange }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-300">{t('background.title')}</h3>
      <ColorPicker
        label={t('background.color')}
        value={color}
        onChange={onChange}
      />
      <div className="space-y-1">
        <label className="text-xs text-gray-400">{t('background.presets')}</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset.color}
              onClick={() => onChange(preset.color)}
              className={`w-8 h-8 rounded border-2 transition-all ${
                color === preset.color ? 'border-gray-400 scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: preset.color }}
              title={i18n.language === 'pl' ? preset.name : preset.nameEn}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
