import { ButtonHTMLAttributes, ReactNode } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function PrimaryButton({ children, className = '', ...props }: PrimaryButtonProps) {
  return (
    <button
      className={`px-6 py-2 bg-fcc-cyan text-fcc-white font-semibold rounded hover:bg-fcc-cyan/90 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

