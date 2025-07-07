// File: InterceptorCard.tsx
// Type: Component (interceptor card)
// Imports: React
// Imported by: InterceptorSettings.tsx
// Role: Renders a card UI for an HTTP interceptor in the Settings feature.
// Located at: src/pages/Settings/InterceptorCard.tsx
import React, { useState } from 'react';
import { FaChrome, FaFirefox } from 'react-icons/fa';

const interceptorOptions = [
  'Browser',
  'Proxy',
  'Agent',
  'Browser extension',
];

const BrowserExtensionSection: React.FC = () => (
  <div>
    <div className="text-zinc-400 text-sm mb-1">Extension Version: Not Reported</div>
    <div className="flex gap-3">
      <button
        type="button"
        className="flex items-center gap-2 px-4 py-2 rounded border text-gray-200 border-zinc-700 border-opacity-50 bg-neutral-900 hover:border-gray-400 hover:text-white transition font-semibold"
        onClick={() => window.open('https://chromewebstore.google.com/detail/hoppscotch-browser-extens/amknoiejhlmhancpahfcfcfhllgkpbld', '_blank')}
      >
        <FaChrome className="w-5 h-5 text-[#4285F4]" />
        Chrome
      </button>
      <button
        type="button"
        className="flex items-center gap-2 px-4 py-2 rounded border text-gray-200 border-zinc-700 border-opacity-50 bg-neutral-900 hover:border-gray-400 hover:text-white transition font-semibold"
        onClick={() => window.open('https://addons.mozilla.org/en-US/firefox/addon/hoppscotch/', '_blank')}
      >
        <FaFirefox className="w-5 h-5 text-[#FF7139]" />
        Firefox
      </button>
    </div>
  </div>
);

const InterceptorCard: React.FC = () => {
  const [selected, setSelected] = useState('Browser extension');

  return (
    <div className="bg-neutral-900 border border-zinc-800 rounded-lg shadow-lg p-5 w-80 text-left z-50">
      <div className="font-bold text-lg text-white mb-1">Interceptor</div>
      <div className="text-zinc-400 text-sm mb-4">Middleware between application and APIs.</div>
      <div className="flex flex-col gap-3 mb-2">
        {interceptorOptions.map(option => (
          <label key={option} className="flex items-center gap-3 text-zinc-200 text-sm cursor-pointer">
            <button
              type="button"
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition focus:outline-none group ${selected === option ? 'border-blue-500' : 'border-gray-400/30'}`}
              onClick={() => setSelected(option)}
              aria-pressed={selected === option}
            >
              {selected === option && (
                <span className="w-1.5 h-1.5 rounded-full block bg-blue-500" />
              )}
            </button>
            <span className={selected === option ? 'font-semibold' : ''}>{option}</span>
          </label>
        ))}
      </div>
      {selected === 'Browser extension' && <BrowserExtensionSection />}
    </div>
  );
};

export default InterceptorCard; 