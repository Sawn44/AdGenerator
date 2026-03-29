import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useHusseResources, RESOURCE_SOURCES } from '../../hooks/useHusseResources';
import type { HusseResource, ResourceSource } from '../../hooks/useHusseResources';

interface HusseResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (resource: HusseResource) => void;
  filter: 'logo' | 'packshot';
  source: ResourceSource;
}

export const HusseResourceModal: React.FC<HusseResourceModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  filter,
  source,
}) => {
  const { t } = useTranslation();
  const { resources, loading, error, fetchResources, currentSource } = useHusseResources();

  useEffect(() => {
    if (isOpen && (resources.length === 0 || currentSource !== source)) {
      fetchResources(source);
    }
  }, [isOpen, source]);

  if (!isOpen) return null;

  const filteredResources = resources.filter(r => r.type === filter);
  const sourceName = RESOURCE_SOURCES[source].name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-100">
            {t('resources.selectResource', { name: sourceName })}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-400">{t('resources.loading')}</div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="text-red-400">{t('resources.error')}</div>
              <button
                onClick={() => fetchResources(source)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
              >
                {t('resources.loading')}
              </button>
            </div>
          )}

          {!loading && !error && filteredResources.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-400">{t('resources.noResources')}</div>
            </div>
          )}

          {!loading && !error && filteredResources.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {filteredResources.map((resource) => (
                <button
                  key={resource.url}
                  onClick={() => {
                    onSelect(resource);
                    onClose();
                  }}
                  className="group relative aspect-square bg-gray-700 rounded-lg overflow-hidden hover:ring-2 ring-gray-500 transition-all"
                >
                  <img
                    src={resource.url}
                    alt={resource.name}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                    <span className="text-xs text-gray-300 truncate block">
                      {resource.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
