import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../../utils/helpers';
import './styles.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={classNames('btn', `btn--${variant}`, className)}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? 'Chargement…' : children}
    </button>
  );
}