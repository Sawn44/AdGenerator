import React from 'react';
import { useTranslation } from 'react-i18next';
import { FORMATS } from '../../constants/formats';
import type { FormatType } from '../../types/template';

interface FormatSelectorProps {
  value: FormatType;
  onChange: (format: FormatType) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-300">{t('format.title')}</h3>
      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(FORMATS) as FormatType[]).map((format) => (
          <button
            key={format}
            onClick={() => onChange(format)}
            className={`p-3 rounded border text-sm transition-colors ${
              value === format
                ? 'bg-gray-600 border-gray-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <div
                className={`bg-gray-400 ${
                  format === 'landscape' ? 'w-8 h-4' :
                  format === 'square' ? 'w-6 h-6' :
                  format === 'portrait' ? 'w-5 h-6' :
                  'w-4 h-7'
                } rounded-sm`}
              />
              <span className="text-xs">
                {t(`format.${format}`)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
