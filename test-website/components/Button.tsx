import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  href?: string;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
  tabIndex?: number;
  newTab?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  href,
  variant = 'primary',
  size = 'medium',
  children,
  onClick,
  tabIndex,
  newTab,
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  };
  
  const sizeClasses = {
    small: 'h-8 px-3 text-sm',
    medium: 'h-10 px-4',
    large: 'h-12 px-6 text-lg',
  };
  
  const className = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
  
  if (href) {
    return (
      <Link
        href={href}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        className={className}
        onClick={onClick}
        tabIndex={tabIndex}
      >
        {children}
      </Link>
    );
  }
  
  return (
    <button
      className={className}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      {children}
    </button>
  );
};

export default Button;