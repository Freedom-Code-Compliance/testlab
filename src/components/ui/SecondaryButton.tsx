import { ButtonHTMLAttributes, ReactNode } from 'react';

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function SecondaryButton({ children, className = '', ...props }: SecondaryButtonProps) {
  return (
    <button
      className={`px-4 py-2 bg-fcc-black border border-fcc-divider text-fcc-white rounded hover:border-fcc-cyan transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}



