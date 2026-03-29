import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Project, Template, TemplateConfig } from '../../types/template';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface ProjectManagerProps {
  onLoad: (project: Project) => void;
  onSave: (name: string) => void;
  config: TemplateConfig;
  logoData: string | null;
  packshotData: string | null;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  onLoad,
  onSave,
  config,
  logoData,
  packshotData,
}) => {
  const { t } = useTranslation();
  const { projects, deleteProject } = useLocalStorage();
  const [showProjects, setShowProjects] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [templateName, setTemplateName] = useState('');

  const handleSave = () => {
    if (!projectName.trim()) return;
    onSave(projectName.trim());
    setProjectName('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('projects.confirmDelete'))) {
      deleteProject(id);
    }
  };

  const handleExportTemplate = () => {
    if (!templateName.trim()) return;
    
    const logoConfig = config.logo ? {
      ...config.logo,
      logoData: logoData || config.logo.logoUrl || undefined,
    } : null;

    const packshotConfig = config.packshot ? {
      ...config.packshot,
      packshotData: packshotData || config.packshot.packshotUrl || undefined,
    } : null;

    const template: Template = {
      id: `custom_${Date.now()}`,
      name: templateName.trim(),
      nameEn: templateName.trim(),
      category: 'custom',
      config: {
        ...config,
        logo: logoConfig,
        packshot: packshotConfig,
        text: config.text ? { ...config.text } : null,
        subtext: config.subtext ? { ...config.subtext } : null,
        cta: config.cta ? { ...config.cta } : null,
      },
    };

    const dataStr = JSON.stringify(template, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${templateName.trim().toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setTemplateName('');
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-300">{t('projects.title')}</h3>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder={t('app.save')}
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
        <button
          onClick={handleSave}
          disabled={!projectName.trim()}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white text-sm transition-colors"
        >
          {t('app.save')}
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder={t('templates.export')}
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleExportTemplate()}
        />
        <button
          onClick={handleExportTemplate}
          disabled={!templateName.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white text-sm transition-colors"
        >
          {t('templates.export')}
        </button>
      </div>

      <button
        onClick={() => setShowProjects(!showProjects)}
        className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm transition-colors"
      >
        {t('projects.title')} ({projects.length})
      </button>

      {showProjects && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {projects.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">{t('projects.empty')}</p>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-2 bg-gray-800 rounded"
              >
                <button
                  onClick={() => onLoad(project)}
                  className="flex-1 text-left text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {project.name}
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="px-2 py-1 text-red-400 hover:text-red-300 text-xs"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
