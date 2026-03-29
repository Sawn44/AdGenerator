import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sidebar } from './components/Sidebar/Sidebar';
import { CanvasEditor } from './components/Canvas/CanvasEditor';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Template, TemplateConfig, Project, FormatType } from './types/template';
import './i18n';

import blankLandscape from './templates/blank-landscape.json';
import blankSquare from './templates/blank-square.json';
import productHero from './templates/product-hero.json';
import promoRed from './templates/promo-red.json';
import elegantDark from './templates/elegant-dark.json';

const builtInTemplates: Template[] = [
  blankLandscape as unknown as Template,
  blankSquare as unknown as Template,
  productHero as unknown as Template,
  promoRed as unknown as Template,
  elegantDark as unknown as Template,
];

const DEFAULT_CONFIG: TemplateConfig = {
  format: 'landscape',
  background: { color: '#FFFFFF' },
  logo: null,
  packshot: null,
  text: null,
  subtext: null,
  cta: null,
};

function App() {
  const { t } = useTranslation();
  const { saveProject } = useLocalStorage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [templates, setTemplates] = useState<Template[]>(builtInTemplates);
  const [config, setConfig] = useState<TemplateConfig>(DEFAULT_CONFIG);
  const [logoData, setLogoData] = useState<string | null>(null);
  const [packshotData, setPackshotData] = useState<string | null>(null);

  useEffect(() => {
    const customTemplates = localStorage.getItem('custom_templates');
    if (customTemplates) {
      try {
        const parsed = JSON.parse(customTemplates) as Template[];
        setTemplates([...builtInTemplates, ...parsed]);
      } catch (e) {
        console.error('Failed to parse custom templates');
      }
    }
  }, []);

  const handleConfigChange = useCallback((newConfig: TemplateConfig) => {
    setConfig(newConfig);
  }, []);

  const handleFormatChange = useCallback((format: FormatType) => {
    setConfig(prev => ({ ...prev, format }));
  }, []);

  const handleLogoUpload = useCallback((data: string) => {
    setLogoData(data);
  }, []);

  const handlePackshotUpload = useCallback((data: string) => {
    setPackshotData(data);
  }, []);

  const handleSaveProject = useCallback((name: string) => {
    const project: Project = {
      id: `proj_${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      template: config,
      logoData: logoData || undefined,
      packshotData: packshotData || undefined,
    };
    saveProject(project);
  }, [config, logoData, packshotData, saveProject]);

  const handleLoadProject = useCallback((project: Project) => {
    setConfig(project.template);
    setLogoData(project.logoData || null);
    setPackshotData(project.packshotData || null);
  }, []);

  const handleExport = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const format = config.format;
    const filename = `pmax-ad-${format}-${Date.now()}.jpg`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/jpeg', 0.92);
    link.click();
  }, [config.format]);

  return (
    <div className="h-screen flex bg-gray-900">
      <Sidebar
        templates={templates}
        config={config}
        onConfigChange={handleConfigChange}
        onFormatChange={handleFormatChange}
        onLogoUpload={handleLogoUpload}
        onPackshotUpload={handlePackshotUpload}
        onSaveProject={handleSaveProject}
        onLoadProject={handleLoadProject}
      />
      
      <div className="flex-1 flex flex-col">
        <CanvasEditor
          config={config}
          logoData={logoData}
          packshotData={packshotData}
          format={config.format}
          canvasRef={canvasRef}
        />
        
        <div className="bg-gray-800 border-t border-gray-700 p-4 flex justify-center">
          <button
            onClick={handleExport}
            className="px-8 py-3 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t('app.export')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
