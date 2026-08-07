import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  from?: string;
  to?: string;
}

export default function GradientText({
  children,
  className = '',
  from = 'from-violet-400',
  to = 'to-fuchsia-400',
}: GradientTextProps) {
  return (
    <span className={`bg-gradient-to-r ${from} ${to} bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}
