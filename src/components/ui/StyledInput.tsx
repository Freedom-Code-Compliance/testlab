import { InputHTMLAttributes } from 'react';

interface StyledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function StyledInput({ label, error, className = '', ...props }: StyledInputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm text-fcc-white/70 mb-2">{label}</label>
      )}
      <input
        className={`w-full bg-fcc-black border border-fcc-divider rounded p-2 text-fcc-white focus:border-fcc-cyan focus:outline-none ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}



