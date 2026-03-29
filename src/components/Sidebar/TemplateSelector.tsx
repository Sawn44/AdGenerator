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

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(templates, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'templates.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [templates]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const imported = JSON.parse(text) as Template[];
        localStorage.setItem('custom_templates', JSON.stringify(imported));
        window.location.reload();
      } catch (err) {
        console.error('Invalid template file');
      }
    };
    input.click();
  }, []);

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

      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="flex-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
        >
          {t('templates.export')}
        </button>
        <button
          onClick={handleImport}
          className="flex-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
        >
          {t('templates.import')}
        </button>
      </div>
    </div>
  );
};
