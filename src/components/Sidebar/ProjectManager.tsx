import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Project } from '../../types/template';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface ProjectManagerProps {
  onLoad: (project: Project) => void;
  onSave: (name: string) => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  onLoad,
  onSave,
}) => {
  const { t } = useTranslation();
  const { projects, deleteProject } = useLocalStorage();
  const [showProjects, setShowProjects] = useState(false);
  const [projectName, setProjectName] = useState('');

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
