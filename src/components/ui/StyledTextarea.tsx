import { TextareaHTMLAttributes } from 'react';

interface StyledTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function StyledTextarea({ label, error, className = '', ...props }: StyledTextareaProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm text-fcc-white/70 mb-2">{label}</label>
      )}
      <textarea
        className={`w-full bg-fcc-black border border-fcc-divider rounded p-2 text-fcc-white focus:border-fcc-cyan focus:outline-none min-h-[100px] ${
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

