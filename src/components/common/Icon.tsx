import React from 'react';

import ChevronDown from '@/assets/icons/arrow-down.svg?react';
import ChevronLeft from '@/assets/icons/arrow-left.svg?react';
import ChevronRight from '@/assets/icons/arrow-right.svg?react';
import ChevronUp from '@/assets/icons/arrow-up.svg?react';

const icons = {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} as const;

type IconName = keyof typeof icons;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
}

export default function Icon({ name, ...props }: IconProps) {
  const SvgIcon = icons[name];
  return <SvgIcon {...props} />;
}
