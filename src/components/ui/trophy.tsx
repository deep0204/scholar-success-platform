
import React from 'react';
import { cn } from '@/lib/utils';

interface TrophyProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'gold' | 'silver' | 'bronze' | 'default';
  size?: 'sm' | 'md' | 'lg';
}

export function Trophy({
  type = 'default',
  size = 'md',
  className,
  ...props
}: TrophyProps) {
  const colorClass = {
    gold: 'bg-yellow-400 text-yellow-800',
    silver: 'bg-gray-300 text-gray-700',
    bronze: 'bg-amber-700 text-amber-100',
    default: 'bg-campus-blue text-white',
  };

  const sizeClass = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div 
      className={cn(
        'rounded-full flex items-center justify-center shadow-md',
        colorClass[type],
        sizeClass[size],
        className
      )}
      {...props}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="w-1/2 h-1/2"
      >
        <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743-.356l1.918-.56a.75.75 0 00.453-.563l.563-2.257a.75.75 0 00-.177-.643 9.717 9.717 0 00-3.713-2.736 11.55 11.55 0 00-4.277-1.2l.005.021.828 1.758a.75.75 0 01-.278 1.006l-.005.002-.013.006-.087.045a11.88 11.88 0 00-1.333.684zM13.588 2.02a12.515 12.515 0 014.3 1.211 9.786 9.786 0 013.713 2.736.75.75 0 01.177.643l-.563 2.256a.75.75 0 01-.453.563l-1.918.56a6.73 6.73 0 01-2.743.356 6.753 6.753 0 01-6.139-5.6.75.75 0 01.585-.858 47.642 47.642 0 013.07-.543V2.02a.75.75 0 01.75-.75h.093c.334 0 .669.03 1 .09zM10.076 8.968L8.204 8.73a6.725 6.725 0 01-2.331 3.18 12.81 12.81 0 01-1.203.838.75.75 0 00-.172 1.183A10.233 10.233 0 008.85 17.66a.75.75 0 001.28-.452l.69-4.05.211-1.246 1.046 1.553a.75.75 0 00.675.326l4.053-.34a.75.75 0 00.555-1.13A12.825 12.825 0 0015.126 8.4a6.721 6.721 0 01-2.331-3.18l-1.872.237a.75.75 0 00-.659.618l-.157.92-.077.456z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

export default Trophy;
