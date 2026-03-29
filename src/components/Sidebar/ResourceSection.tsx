import { useState, type FC, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface ResourceSectionProps {
  isHusseMode: boolean;
  onToggleHusseMode: (enabled: boolean) => void;
}

export const ResourceSection: FC<ResourceSectionProps> = ({
  isHusseMode,
  onToggleHusseMode,
}) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === 'Husse') {
      onToggleHusseMode(true);
      setError(false);
      setPassword('');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleDisable = () => {
    onToggleHusseMode(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-100">{t('husse.title')}</h3>
        {isHusseMode && (
          <span className="px-2 py-0.5 bg-green-900 text-green-300 text-xs rounded-full">
            {t('husse.active')}
          </span>
        )}
      </div>

      {!isHusseMode ? (
        <form onSubmit={handlePasswordSubmit} className="space-y-2">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('husse.passwordPlaceholder')}
            className={`w-full px-3 py-2 bg-gray-700 border rounded text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
            }`}
          />
          <button
            type="submit"
            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            {t('husse.unlock')}
          </button>
          {error && (
            <p className="text-red-400 text-xs text-center">{t('husse.wrongPassword')}</p>
          )}
        </form>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-gray-400">{t('husse.description')}</p>
          <button
            onClick={handleDisable}
            className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded transition-colors"
          >
            {t('husse.disable')}
          </button>
        </div>
      )}
    </div>
  );
};
