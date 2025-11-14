import { SelectHTMLAttributes } from 'react';

interface StyledSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export default function StyledSelect({ label, error, options, className = '', ...props }: StyledSelectProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm text-fcc-white/70 mb-2">{label}</label>
      )}
      <select
        className={`w-full bg-fcc-black border border-fcc-divider rounded p-2 text-fcc-white focus:border-fcc-cyan focus:outline-none ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

