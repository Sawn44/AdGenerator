import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Template, TemplateConfig, FormatType } from '../../types/template';
import { FormatSelector } from './FormatSelector';
import { BackgroundSettings } from './BackgroundSettings';
import { LogoSettings } from './LogoSettings';
import { PackshotSettings } from './PackshotSettings';
import { TextSettings } from './TextSettings';
import { CTASettings } from './CTASettings';
import { TemplateSelector } from './TemplateSelector';
import { ProjectManager } from './ProjectManager';

interface SidebarProps {
  templates: Template[];
  config: TemplateConfig;
  onConfigChange: (config: TemplateConfig) => void;
  onFormatChange: (format: FormatType) => void;
  onLogoUpload: (data: string) => void;
  onPackshotUpload: (data: string) => void;
  onSaveProject: (name: string) => void;
  onLoadProject: (project: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  templates,
  config,
  onConfigChange,
  onFormatChange,
  onLogoUpload,
  onPackshotUpload,
  onSaveProject,
  onLoadProject,
}) => {
  const { t, i18n } = useTranslation();

  const handleChange = <K extends keyof TemplateConfig>(key: K, value: TemplateConfig[K]) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <div className="w-80 bg-gray-900 border-r border-gray-700 overflow-y-auto">
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white">{t('app.title')}</h1>
          <button
            onClick={() => {
              i18n.language === 'pl' ? i18n.changeLanguage('en') : i18n.changeLanguage('pl');
              localStorage.setItem('language', i18n.language === 'pl' ? 'en' : 'pl');
            }}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
          >
            {i18n.language === 'pl' ? 'EN' : 'PL'}
          </button>
        </div>

        <TemplateSelector
          templates={templates}
          onSelect={(templateConfig) => onConfigChange(templateConfig)}
        />

        <div className="h-px bg-gray-700" />

        <FormatSelector
          value={config.format}
          onChange={onFormatChange}
        />

        <div className="h-px bg-gray-700" />

        <BackgroundSettings
          color={config.background.color}
          onChange={(color) => handleChange('background', { color })}
        />

        <div className="h-px bg-gray-700" />

        <LogoSettings
          config={config.logo}
          onChange={(logo) => handleChange('logo', logo)}
          onLogoUpload={onLogoUpload}
        />

        <div className="h-px bg-gray-700" />

        <PackshotSettings
          config={config.packshot}
          onChange={(packshot) => handleChange('packshot', packshot)}
          onPackshotUpload={onPackshotUpload}
        />

        <div className="h-px bg-gray-700" />

        <TextSettings
          config={config.text}
          onChange={(text) => handleChange('text', text)}
        />

        <div className="h-px bg-gray-700" />

        <CTASettings
          config={config.cta}
          onChange={(cta) => handleChange('cta', cta)}
        />

        <div className="h-px bg-gray-700" />

        <ProjectManager
          onSave={onSaveProject}
          onLoad={onLoadProject}
        />
      </div>
    </div>
  );
};
