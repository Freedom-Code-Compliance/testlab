import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface SearchableMultiSelectProps {
  label?: string;
  values: string[];
  onChange: (values: string[]) => void;
  options: Array<{ value: string; label: string }>;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function SearchableMultiSelect({
  label,
  values,
  onChange,
  options,
  error,
  placeholder = 'Select...',
  disabled = false,
}: SearchableMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOptions = options.filter(opt => values.includes(opt.value));

  const handleToggle = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter(v => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(values.filter(v => v !== value));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm text-fcc-white/70 mb-2">{label}</label>
      )}
      
      {/* Error message - displayed between label and selected items for visibility */}
      {error && (
        <p className="mb-2 text-sm text-red-500">{error}</p>
      )}
      
      {/* Selected items display */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedOptions.map((option) => (
            <span
              key={option.value}
              className="inline-flex items-center space-x-1 bg-fcc-cyan/20 text-fcc-cyan px-2 py-1 rounded text-sm"
            >
              <span>{option.label}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => handleRemove(option.value, e)}
                  className="hover:bg-fcc-cyan/30 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full bg-fcc-black border ${
          error ? 'border-red-500' : 'border-fcc-divider'
        } rounded p-2 text-fcc-white focus:border-fcc-cyan focus:outline-none flex items-center justify-between ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span className="text-fcc-white/50">
          {selectedOptions.length > 0 ? `${selectedOptions.length} selected` : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-fcc-black border border-fcc-divider rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-fcc-divider">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-fcc-dark border border-fcc-divider rounded p-2 text-fcc-white text-sm focus:border-fcc-cyan focus:outline-none"
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = values.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-fcc-dark transition-colors px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(option.value)}
                      className="w-5 h-5 rounded border-fcc-divider bg-fcc-black text-fcc-cyan focus:ring-2 focus:ring-fcc-cyan"
                    />
                    <span className="text-fcc-white flex-1">{option.label}</span>
                  </label>
                );
              })
            ) : (
              <div className="px-3 py-2 text-fcc-white/70 text-sm">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

