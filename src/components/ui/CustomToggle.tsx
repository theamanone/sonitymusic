"use client";

interface CustomToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  isDark: boolean;
}

export default function CustomToggle({ 
  checked, 
  onChange, 
  label, 
  description, 
  isDark 
}: CustomToggleProps) {
  return (
    <label className="flex items-start space-x-3 cursor-pointer group">
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-5 h-5 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
          checked
            ? 'bg-blue-600 border-blue-600 scale-100'
            : isDark
            ? 'border-gray-600 hover:border-gray-500 bg-transparent'
            : 'border-gray-300 hover:border-gray-400 bg-white'
        } ${
          checked ? 'shadow-lg shadow-blue-600/25' : ''
        }`}>
          {checked && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      <div className="flex-1">
        <span className={`font-medium ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {label}
        </span>
        {description && (
          <p className={`text-sm mt-1 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {description}
          </p>
        )}
      </div>
    </label>
  );
}
