import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name,
  className = '',
  size = 16,
  color,
}) => {
  // Try to find icon in Lucide
  const IconComponent = (Icons as any)[name] || Icons.CircleDot;
  return <IconComponent className={className} size={size} color={color} />;
};
