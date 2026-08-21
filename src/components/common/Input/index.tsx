import type { InputHTMLAttributes } from 'react';
import { classNames } from '../../../utils/helpers';
import './styles.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...rest }: InputProps) {
  const inputId = id ?? rest.name;

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={classNames('input', error && 'input--error', className)}
        {...rest}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}