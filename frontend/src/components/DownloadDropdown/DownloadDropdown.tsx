import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Check, ExternalLink } from 'lucide-react';
import useThemeClass from '../../hooks/useThemeClass';
import { createPortal } from 'react-dom';

interface DownloadDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

const DownloadDropdown: React.FC<DownloadDropdownProps> = ({ isOpen, onClose, triggerRef }) => {
  console.log('DownloadDropdown render - isOpen:', isOpen);
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [hoveredOS, setHoveredOS] = useState<string | null>(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const { themeClass, accentColorClass, cardBgClass } = useThemeClass();

  const osOptions = [
    {
      id: 'macos',
      name: t('download.platforms.macos'),
      icon: (
        <svg width="1.2em" height="1.2em" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="currentColor" className="mr-2" aria-label={t('download.aria_labels.macos')}>
          <title>{t('download.platforms.macos')}</title>
          <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
        </svg>
      ),
      url: 'https://hoppscotch.com/download?platform=macOS',
      ariaLabel: t('download.aria_labels.macos')
    },
    {
      id: 'windows',
      name: t('download.platforms.windows'),
      icon: (
        <svg width="1.2em" height="1.2em" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="currentColor" className="mr-2" aria-label={t('download.aria_labels.windows')}>
          <title>{t('download.platforms.windows')}</title>
          <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
        </svg>
      ),
      url: 'https://hoppscotch.com/download?platform=windows',
      ariaLabel: t('download.aria_labels.windows')
    },
    {
      id: 'linux',
      name: t('download.platforms.linux'),
      icon: (
        <svg width="1.2em" height="1.2em" xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="currentColor" className="mr-2" aria-label={t('download.aria_labels.linux')}>
          <title>{t('download.platforms.linux')}</title>
          <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2zm-2.962.059h.01c.053 0 .105.005.157.014.376.055.706.333 1.023.752l.91 1.664.003.003c.243.533.754 1.064 1.189 1.637.434.598.77 1.131.729 1.57v.006c-.057.744-.48 1.148-1.125 1.294-.645.135-1.52.002-2.395-.464-.968-.536-2.118-.469-2.857-.602-.369-.066-.61-.2-.723-.4-.11-.2-.113-.602.123-1.23v-.004l.002-.003c.117-.334.03-.752-.027-1.118-.055-.401-.083-.71.043-.94.16-.334.396-.4.69-.533.294-.135.64-.202.915-.47h.002v-.002c.256-.268.445-.601.668-.838.19-.201.38-.336.663-.336zm7.159-9.074c-.435.201-.945.535-1.488.535-.542 0-.97-.267-1.28-.466-.154-.134-.28-.268-.373-.335-.164-.134-.144-.333-.074-.333.109.016.129.134.199.2.096.066.215.2.36.333.292.2.68.467 1.167.467.485 0 1.053-.267 1.398-.466.195-.135.445-.334.648-.467.156-.136.149-.267.279-.267.128.016.034.134-.147.332a8.097 8.097 0 01-.69.468zm-1.082-1.583V5.64c-.006-.02.013-.042.029-.05.074-.043.18-.027.26.004.063 0 .16.067.15.135-.006.049-.085.066-.135.066-.055 0-.092-.043-.141-.068-.052-.018-.146-.008-.163-.065zm-.551 0c-.02.058-.113.049-.166.066-.047.025-.086.068-.14.068-.05 0-.13-.02-.136-.068-.01-.066.088-.133.15-.133.08-.031.184-.047.259-.005.019.009.036.03.03.05v.02h.003z" />
        </svg>
      ),
      url: 'https://hoppscotch.com/download?platform=linux',
      ariaLabel: t('download.aria_labels.linux')
    },
    {
      id: 'cli',
      name: t('download.platforms.cli'),
      icon: (
        <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="mr-2" aria-label={t('download.aria_labels.cli')}>
          <title>{t('download.platforms.cli')}</title>
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
            <path d="m7 11l2-2l-2-2m4 6h4"></path>
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
          </g>
        </svg>
      ),
      url: 'https://docs.hoppscotch.io/documentation/clients/cli/overview',
      ariaLabel: t('download.aria_labels.cli')
    }
  ];

  const handleOSClick = (url: string) => {
    window.open(url, '_blank');
  };

  // Calculate position based on trigger element
  useEffect(() => {
    if (isOpen && triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + (rect.width / 2) - 80, // Center the dropdown (80px = half of 160px width)
      });
    }
  }, [isOpen, triggerRef]);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    console.log('Not rendering dropdown because isOpen is false');
    return null;
  }

  console.log('Rendering dropdown');

  const dropdownContent = (
    <div 
      ref={dropdownRef}
      className={`fixed w-40 rounded-md shadow-lg z-[99999] overflow-hidden transition-all duration-200 ${themeClass} border ${accentColorClass.border} ${cardBgClass}`}
      style={{
        top: position.top,
        left: position.left,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
      role="menu"
      aria-label={t('download.title')}
    >
      <div className="py-1">
        {osOptions.map((os) => (
          <div
            key={os.id}
            onClick={() => handleOSClick(os.url)}
            onMouseEnter={() => setHoveredOS(os.id)}
            onMouseLeave={() => setHoveredOS(null)}
            className={`flex items-center px-4 py-2.5 cursor-pointer transition-all duration-200 text-sm font-medium
              ${hoveredOS === os.id ? 'bg-opacity-10' : 'hover:bg-opacity-5'}
            `}
            style={{
              backgroundColor: hoveredOS === os.id 
                ? `var(--accent-color)` 
                : 'transparent',
              color: 'var(--text-color)',
              borderLeft: hoveredOS === os.id ? `3px solid var(--accent-color)` : '3px solid transparent'
            }}
            role="menuitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOSClick(os.url);
              }
            }}
            aria-label={os.ariaLabel}
          >
            {typeof os.icon === 'string' ? (
              <span className="text-lg mr-2">{os.icon}</span>
            ) : (
              os.icon
            )}
            <span className="flex-1">{os.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return createPortal(dropdownContent, document.body);
};

export default DownloadDropdown;
