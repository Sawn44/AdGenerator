import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Template, TemplateConfig } from '../../types/template';

interface TemplateSelectorProps {
  templates: Template[];
  onSelect: (config: TemplateConfig) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ templates, onSelect }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = useCallback((template: Template) => {
    onSelect(template.config);
    setIsOpen(false);
  }, [onSelect]);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-300">{t('templates.title')}</h3>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm flex items-center justify-between"
        >
          <span>{t('templates.select')}</span>
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg max-h-64 overflow-y-auto">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelect(template)}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              >
                {i18n.language === 'pl' ? template.name : template.nameEn}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
