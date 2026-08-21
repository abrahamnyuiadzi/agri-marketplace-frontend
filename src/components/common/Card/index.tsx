import type { ReactNode } from 'react';
import { classNames } from '../../../utils/helpers';
import './styles.css';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return <div className={classNames('card', className)}>{children}</div>;
}