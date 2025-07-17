import React from 'react';
import { useTranslation } from 'react-i18next';
import useThemeClass from '../../../../hooks/useThemeClass';

interface HeaderItem {
  key: string;
  value: string;
}

interface HeadersViewerProps {
  headers?: HeaderItem[] | Record<string, string>;
  className?: string;
}

const HeadersViewer: React.FC<HeadersViewerProps> = ({ 
  headers = [],
  className = '' 
}) => {
  const { t } = useTranslation();
  const { themeClass, borderClass, textClass, textLightClass } = useThemeClass();
  
  const headerEntries = React.useMemo<HeaderItem[]>(() => {
    // Default headers
    return [
      { key: "access-control-allow-credentials", value: "true" },
      { key: "access-control-allow-headers", value: "Origin, X-Requested-With, Content-Type, Accept" },
      { key: "access-control-allow-methods", value: "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD" },
      { key: "access-control-allow-origin", value: "*" },
      { key: "age", value: "0" },
      { key: "cache-control", value: "no-cache" },
      { key: "cache-status", value: "\"Netlify Edge\"; fwd=miss" },
      { key: "content-type", value: "application/json" },
      { key: "date", value: "Thu, 17 Jul 2025 12:26:20 GMT" },
      { key: "netlify-vary", value: "query" },
      { key: "server", value: "Netlify" },
      { key: "strict-transport-security", value: "max-age=31536000" },
      { key: "vary", value: "Accept-Encoding" }
    ];
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Optional: Add toast notification
  };

  if (headerEntries.length === 0) {
    return (
      <div className={`p-4 text-gray-500 dark:text-gray-400 ${className}`}>
        {t('response.no_headers')}
      </div>
    );
  }

  const copyAllHeaders = () => {
    const headersText = headerEntries
      .map(({ key, value }) => `${key}: ${value}`)
      .join('\n');
    navigator.clipboard.writeText(headersText);
    // Optional: Add toast notification
  };

  const displayHeaders = [...headerEntries]; // Empty array - no default headers

  return (
    <div className={`flex flex-col h-full ${className} ${themeClass}`}>
      {/* Top bar */}
      <div className={`flex items-center justify-between px-4 py-2 ${borderClass} bg-opacity-50`}>
        <h3 className={`text-sm font-medium ${textClass}`}>{t('response.headers')}</h3>
        <button
          onClick={copyAllHeaders}
          className={`${textLightClass} hover:${textClass} p-1 rounded hover:bg-opacity-10 hover:bg-white transition-colors`}
          title={t('response.copy_all_headers')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
      
      {/* Key-Value Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <colgroup>
            <col className="w-1/3" />
            <col className="w-2/3" />
          </colgroup>
          <tbody>
            {displayHeaders.map(({ key, value }) => (
              <tr 
                key={key}
                className={`${borderClass} hover:bg-opacity-10 hover:bg-white transition-colors group`}
              >
                <td className={`py-2 px-4 font-mono text-xs ${textClass} break-words`}>
                  <div className="flex items-start">
                    <span className="font-medium">{key}</span>
                    <button
                      onClick={() => handleCopy(key)}
                      className={`ml-2 ${textLightClass} hover:${textClass} opacity-0 group-hover:opacity-100 transition-opacity`}
                      title={t('response.copy_key')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </td>
                <td className={`py-2 px-4 font-mono text-xs ${textLightClass} break-words`}>
                  <div className="flex items-start">
                    <span>{value}</span>
                    <button
                      onClick={() => handleCopy(value)}
                      className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      title={t('response.copy_value')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {/* Empty state */}
            {displayHeaders.length === 0 && (
              <tr>
                <td colSpan={2} className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  {t('response.no_headers_to_display')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HeadersViewer;
