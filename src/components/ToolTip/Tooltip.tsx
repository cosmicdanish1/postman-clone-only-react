import React, { useState, useRef, useEffect } from 'react';
import './Tooltip.css';


type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: TooltipPosition;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (!isVisible || !tooltipRef.current || !containerRef.current) return;

      const container = containerRef.current.getBoundingClientRect();
      const tooltip = tooltipRef.current;

      const positions = {
        top: {
          top: -tooltip.offsetHeight - 8,
          left: (container.width - tooltip.offsetWidth) / 2,
        },
        bottom: {
          top: container.height + 8,
          left: (container.width - tooltip.offsetWidth) / 2,
        },
        left: {
          top: (container.height - tooltip.offsetHeight) / 2,
          left: -tooltip.offsetWidth - 8,
        },
        right: {
          top: (container.height - tooltip.offsetHeight) / 2,
          left: container.width + 8,
        },
      };

      Object.entries(positions[position]).forEach(([key, value]) => {
        tooltip.style[key as any] = `${value}px`;
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isVisible, position]);

  return (
    <div 
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
  <div
    ref={tooltipRef}
    className={`
      absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 
      rounded-lg shadow-sm transition-opacity duration-300
      ${isVisible ? 'opacity-100' : 'opacity-0'}
    `}
  >
    {content}
    <div className={`tooltip-arrow tooltip-arrow-${position}`}></div>
  </div>
)}

    </div>
  );
};

export default Tooltip;