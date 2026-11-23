import React from 'react';

interface SpatialCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const SpatialCard: React.FC<SpatialCardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-spatial border transition-all duration-300
        bg-spatial-card border-spatial-border shadow-spatial
        ${hoverEffect ? 'hover:-translate-y-1 hover:border-spatial-borderHover hover:shadow-spatial-lg cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
