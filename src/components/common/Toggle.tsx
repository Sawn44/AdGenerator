import React from 'react';

interface ToggleProps {
  label: string;
  icon?: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  icon,
  checked,
  onChange,
}) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-10 h-6 rounded-full transition-colors ${
            checked ? 'bg-gray-500' : 'bg-gray-700'
          }`}
        />
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </div>
      <div className="flex items-center gap-2 text-gray-300 group-hover:text-gray-100 transition-colors">
        {icon && <span className="text-gray-400 group-hover:text-gray-300">{icon}</span>}
        <span className="text-sm font-medium">{label}</span>
      </div>
    </label>
  );
};
