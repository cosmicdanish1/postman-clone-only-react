// File: InterceptorSettings.tsx
// Type: Component (interceptor settings panel)
// Imports: React, InterceptorCard
// Imported by: SettingsPanel.tsx
// Role: Renders the settings panel for HTTP interceptors in the Settings feature.
// Located at: src/pages/Settings/InterceptorSettings.tsx
import React, { useState } from 'react';
import { FaSync, FaLock, FaIdBadge, FaEye, FaEyeSlash, FaChrome, FaFirefox, FaCog, FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useThemeClass from '../../hooks/useThemeClass';

const interceptorOptions = [
  'Browser',
  'Proxy',
  'Agent',
  'Browser extension',
];


type BrowserExtensionSectionProps = { className?: string };
const BrowserExtensionSection: React.FC<BrowserExtensionSectionProps> = ({ className }) => (
  <div className={className}>
    <div className="font-semibold text-text mb-1">Browser extension</div>
    <div className="text-text-secondary text-sm mb-4">Extension Version: Not Reported</div>
    <div className="flex gap-3">
      <button
        type="button"
        className="flex items-center gap-2 px-4 py-2 rounded  text-text border-border bg-bg hover:border-accent hover:text-text-primary transition font-semibold"
        onClick={() => window.open('https://chromewebstore.google.com/detail/hoppscotch-browser-extens/amknoiejhlmhancpahfcfcfhllgkpbld', '_blank')}
      >
        <FaChrome className="w-5 h-5 text-[#4285F4]" />
        Chrome
      </button>
      <button
        type="button"
        className="flex items-center gap-2 px-4 py-2 rounded  text-text border-border bg-bg hover:border-accent hover:text-text-primary transition font-semibold"
        onClick={() => window.open('https://addons.mozilla.org/en-US/firefox/addon/hoppscotch/', '_blank')}
      >
        <FaFirefox className="w-5 h-5 text-[#FF7139]" />
        Firefox
      </button>
    </div>
  </div>
);

// InterceptorSettings is responsible for the Interceptor card in the settings page.
// It manages all settings related to network interception, proxy, agent, and browser extension.
// Main features/cards inside this component:
// - Interceptor options (Browser, Proxy, Agent, Browser extension) as custom radio buttons
// - Proxy settings (URL, username, password, toggles)
// - Agent settings (Verify Host/Peer, CA Certificates, Client Certificates, Register Agent button, cog for domain overrides)
// - CA Certificates modal (file upload for .crt/.cer/.pem)
// - Client Certificates modal (PEM/PFX tabs, file upload, password for PFX)
// - Manage Domains Overrides modal (cog button, domain input, global defaults)
// - Browser extension section (always visible at bottom, Chrome/Firefox links)
// - Toast notifications for agent registration
// All modals and toasts are managed with local state and framer-motion for animation.
const InterceptorSettings: React.FC = () => {
  const themeClass = useThemeClass();
  const [selected, setSelected] = useState('Browser');
  const [verifyHost, setVerifyHost] = useState(false);
  const [verifyPeer, setVerifyPeer] = useState(false);
  const [proxyToggle, setProxyToggle] = useState(false);
  const [proxyUsername, setProxyUsername] = useState('');
  const [proxyPassword, setProxyPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [proxyUrl, setProxyUrl] = useState('');
  const [showProxyUrlInput, setShowProxyUrlInput] = useState(false);
  const [showCAModal, setShowCAModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientTab, setClientTab] = useState<'PEM' | 'PFX'>('PEM');
  const [fileInputRef] = useState(() => React.createRef<HTMLInputElement>());
  const [pemCertInputRef] = useState(() => React.createRef<HTMLInputElement>());
  const [pemKeyInputRef] = useState(() => React.createRef<HTMLInputElement>());
  const [pfxInputRef] = useState(() => React.createRef<HTMLInputElement>());
  const [pfxPassword, setPfxPassword] = useState('');
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [domainInput, setDomainInput] = useState('');

  return (
    <div className={`space-y-8 ${themeClass} bg-bg text-text border-border`}>
    {/* Interceptor */}
    <div>
      <label className="block text-sm font-semibold text-text mb-2">Interceptor</label>
        <div className="flex flex-col gap-4 mb-2 pt-2">
          {interceptorOptions.map(option => (
            <React.Fragment key={option}>
              <label className="flex items-center gap-3 text-text text-sm cursor-pointer">
                <button
                  type="button"
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition focus:outline-none group ${
                    selected === option ? 'border-blue-500' : 'border-border'
                  }`}
                  onClick={() => setSelected(option)}
                  aria-pressed={selected === option}
                >
                  {selected === option && (
                    <span className="w-1.5 h-1.5 rounded-full block" style={{ background: '#3b82f6' }} />
                  )}
                </button>
                <span>{option}</span>
        </label>
              {option === 'Agent' && selected === 'Agent' && (
                <AnimatePresence>
                  <motion.button
                    key="register-agent"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.2 }}
                    type="button"
                    className="flex items-center gap-2 ml-7 mt-2 px-4 py-1.5 rounded  border-border bg-bg hover:border-blue-500 hover:text-blue-400 transition font-semibold shadow text-xs"
                    onClick={() => {
                      toast(
                        <span className="font-semibold text-red-600">
                          Hoppscotch Agent not detected. <span className="font-normal">Please check if the Agent is running</span>
                        </span>,
                        {
                          position: 'bottom-center',
                          autoClose: 8000,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          hideProgressBar: false,
                          style: {
                            background: 'linear-gradient(90deg, #fff 80%, #fee2e2 100%)',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            boxShadow: '0 2px 16px 0 rgba(220,38,38,0.08)',
                            fontWeight: 500,
                          },
                          transition: Slide,
                        }
                      );
                    }}
                  >
                    <FaPlus className="w-3 h-3" />
                    Register Agent
                  </motion.button>
                </AnimatePresence>
              )}
              {option === 'Browser extension' && selected === 'Browser extension' && (
                <BrowserExtensionSection className="mt-2 mb-2" />
              )}
            </React.Fragment>
          ))}
      </div>
      {/* Proxy input */}
      <div className="mt-2">
          <label className="block text-sm font-semibold text-text mb-1">Proxy</label>
          <div className="my-1 text-text-secondary opacity-55 font-semibold text-sm">
            Official Proxy is hosted by Hoppscotch. Read the 
            <a aria-label="Link" href="https://docs.hoppscotch.io/support/privacy" role="link" target="_blank" rel="noopener" className="inline-flex items-center justify-center text-blue-800 ml-1 focus:outline-none hover:text-secondaryDark focus-visible: link">
             Proxy privacy policy</a>. </div>
          <div className="relative w-[840px]">
        <input
          type="text"
              className="bg-bg text-text w-full pr-8 pl-3 py-2 text-sm focus:outline-none  border-border rounded-sm"
          value="https://proxy.hoppscotch.io/"
          readOnly
        />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0 m-0 text-text-secondary hover:text-blue-500 focus:outline-none"
              aria-label="Reload Proxy"
              onClick={() => { /* reload logic here */ }}
              style={{ background: 'none', boxShadow: 'none' }}
            >
              <FaSync className="w-4 h-4" />
            </button>
          </div>
      </div>
    </div>
    {/* Agent */}
    <div>
        <div className="relative flex items-center mb-2 w-full">
          <span className="block text-sm font-semibold text-text">Agent</span>
          <button type="button" className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-text-secondary hover:text-blue-500 focus:outline-none" onClick={() => setShowDomainModal(true)}>
            <FaCog className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col gap-4 mb-2">
          <label className="flex items-center justify-start gap-5 text-sm text-neutral-500 font-semibold hover:text-text">
            <button
              type="button"
              className="relative inline-flex items-center cursor-pointer w-8 h-4 focus:outline-none group"
              onClick={() => setVerifyHost((v) => !v)}
              aria-pressed={verifyHost}
            >
              <span
                className={`absolute inset-0 rounded-full border transition-colors duration-200 border-border ${
                  verifyHost ? '' : 'bg-bg'
                }`}
              />
              <span
                className={`absolute left-1 top-1 w-2 h-2 rounded-full transition-all duration-200 ${
                  verifyHost
                    ? 'translate-x-4 bg-blue-400 shadow-lg'
                    : 'bg-gray-500'
                }`}
              />
              <input
                type="checkbox"
                className="sr-only"
                checked={verifyHost}
                onChange={() => setVerifyHost((v) => !v)}
                tabIndex={-1}
                aria-hidden="true"
              />
            </button>
            Verify Host
        </label>
          <label className="flex items-center justify-start gap-5 text-sm text-neutral-500 font-semibold hover:text-text">
            <button
              type="button"
              className="relative inline-flex items-center cursor-pointer w-8 h-4 focus:outline-none group"
              onClick={() => setVerifyPeer((v) => !v)}
              aria-pressed={verifyPeer}
            >
              <span
                className={`absolute inset-0 rounded-full border transition-colors duration-200 border-border ${
                  verifyPeer ? '' : 'bg-bg'
                }`}
              />
              <span
                className={`absolute left-1 top-1 w-2 h-2 rounded-full transition-all duration-200 ${
                  verifyPeer
                    ? 'translate-x-4 bg-blue-400 shadow-lg'
                    : 'bg-gray-500'
                }`}
              />
              <input
                type="checkbox"
                className="sr-only"
                checked={verifyPeer}
                onChange={() => setVerifyPeer((v) => !v)}
                tabIndex={-1}
                aria-hidden="true"
              />
            </button>
            Verify Peer
        </label>
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              className="flex items-center gap-2 px-2 py-1 text-xs rounded  text-gray-600 border-border bg-bg hover:border-gray-400 hover:text-gray-200 transition font-semibold"
              onClick={() => setShowCAModal(true)}
            >
              <FaLock className="w-4 h-4" />
              CA Certificates
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-2 py-1 text-xs rounded  text-gray-600 border-border bg-bg hover:border-gray-400 hover:text-gray-200 transition font-semibold"
              onClick={() => setShowClientModal(true)}
            >
              <FaIdBadge className="w-4 h-4" />
              Client Certificates
            </button>
          </div>
          <label className="flex items-center justify-start gap-5 mt-4 text-sm text-neutral-500 font-semibold hover:text-text">
            <button
              type="button"
              className="relative inline-flex items-center cursor-pointer w-8 h-4 focus:outline-none group"
              onClick={() => setProxyToggle((v) => !v)}
              aria-pressed={proxyToggle}
            >
              <span
                className={`absolute inset-0 rounded-full border transition-colors duration-200 border-border ${
                  proxyToggle ? '' : 'bg-bg'
                }`}
              />
              <span
                className={`absolute left-1 top-1 w-2 h-2 rounded-full transition-all duration-200 ${
                  proxyToggle
                    ? 'translate-x-4 bg-blue-400 shadow-lg'
                    : 'bg-gray-500'
                }`}
              />
              <input
                type="checkbox"
                className="sr-only"
                checked={proxyToggle}
                onChange={() => setProxyToggle((v) => !v)}
                tabIndex={-1}
                aria-hidden="true"
              />
            </button>
            Proxy
        </label>
      </div>
        <div className="text-xs font-semibold text-text-secondary mt-2">Hoppscotch Agent and Desktop App supports HTTP/HTTPS/SOCKS proxies with NTLM and Basic Auth support.</div>
      </div>
      {proxyToggle && (
        <div className="mt-6">
          <AnimatePresence initial={false}>
            {!showProxyUrlInput && !proxyUrl && (
              <motion.div
                key="label"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="font-semibold text-text mb-1 cursor-pointer select-none"
                onClick={() => setShowProxyUrlInput(true)}
              >
                Proxy URL
              </motion.div>
            )}
            {(showProxyUrlInput || proxyUrl) && (
              <motion.input
                key="input"
                type="text"
                className="bg-bg text-text w-full px-3 py-2 text-sm focus:outline-none border border-border rounded-sm mb-4"
                placeholder="Enter proxy URL"
                value={proxyUrl}
                autoFocus
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                onChange={e => setProxyUrl(e.target.value)}
                onBlur={() => {
                  if (!proxyUrl) setShowProxyUrlInput(false);
                }}
              />
            )}
          </AnimatePresence>
          <div className="text-text-secondary text-sm mb-6">You can also include username and password in the URL.</div>
          <div className="flex gap-8 items-end">
            <div className="flex-1">
              <label className="block text-sm text-text-secondary mb-1 ">Username</label>
              <input
                type="text"
                className="bg-bg text-text w-full px-3 py-2 text-sm  focus:outline-none border border-border rounded-sm"
                value={proxyUsername}
                onChange={e => setProxyUsername(e.target.value)}
              />
            </div>
            <div className="flex-1 relative">
              <label className="block text-sm text-text-secondary mb-1">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="bg-bg text-text w-full px-3 py-2 text-sm focus:outline-none border border-border rounded-sm pr-8"
                value={proxyPassword}
                onChange={e => setProxyPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-7 -translate-y-1/2 p-0 m-0 text-text-secondary hover:text-blue-500 focus:outline-none"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="bottom-center"
        autoClose={8000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        draggableDirection="x"
        draggablePercent={40}
        pauseOnHover
        limit={5}
        theme="light"
        transition={Slide}
        closeButton={false}
        toastClassName={() => 'w-[600px] min-w-[320px] max-w-[98vw] p-4 rounded-md'}
      />
      <BrowserExtensionSection className="mt-10" />
      {/* CA Certificates Modal */} 
      {showCAModal && (
        <AnimatePresence>
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-60">
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-bg-secondary rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative  border-border mt-10"
            >
              <button
                className="absolute top-4 right-4 text-text-secondary hover:text-text text-xl focus:outline-none"
                onClick={() => setShowCAModal(false)}
                aria-label="Close"
              >
                ×
              </button>
              <div className="text-2xl font-bold text-center text-text mb-6">CA Certificates</div>
              <hr className="border-border mb-6" />
              <input
                ref={fileInputRef}
                type="file"
                accept=".crt,.cer,.pem"
                className="hidden"
              />
              <button
                className="w-full flex items-center justify-center gap-2 py-3 rounded  border-border bg-bg-secondary text-text hover:border-blue-500 hover:text-blue-400 transition font-semibold text-base mb-4"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-xl">+</span> Add Certificate File
              </button>
              <div className="text-text-secondary text-sm text-center mb-8">Hoppscotch supports .crt, .cer or .pem files containing one or more certificates.</div>
              <div className="flex justify-start">
                <button
                  className="bg-accent hover:bg-accent-dark text-text px-6 py-2 rounded font-semibold text-base shadow"
                  onClick={() => setShowCAModal(false)}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
      {/* Client Certificates Modal */} 
      {showClientModal && (
        <AnimatePresence>
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-60">
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-bg-secondary rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 relative border border-border mt-10"
            >
              <button
                className="absolute top-4 right-4 text-text-secondary hover:text-text text-xl focus:outline-none"
                onClick={() => setShowClientModal(false)}
                aria-label="Close"
              >
                ×
              </button>
              <div className="text-2xl font-bold text-center text-text mb-6">Client Certificates</div>
              <div className="flex gap-8 border-b border-border mb-6">
                <button
                  className={`pb-2 px-2 text-base font-semibold focus:outline-none transition border-b-2 ${clientTab === 'PEM' ? 'border-blue-500 text-text' : 'border-transparent text-text-secondary hover:text-text'}`}
                  onClick={() => setClientTab('PEM')}
                >
                  PEM
                </button>
                <button
                  className={`pb-2 px-2 text-base font-semibold focus:outline-none transition border-b-2 ${clientTab === 'PFX' ? 'border-blue-500 text-text' : 'border-transparent text-text-secondary hover:text-text'}`}
                  onClick={() => setClientTab('PFX')}
                >
                  PFX
                </button>
              </div>
              {clientTab === 'PEM' && (
                <>
                  <div className="mb-4">
                    <div className="text-text-secondary font-semibold mb-2">Certificate</div>
                    <input
                      ref={pemCertInputRef}
                      type="file"
                      accept=".crt,.cer,.pem"
                      className="hidden"
                    />
                    <button
                      className="w-full flex items-center justify-center gap-2 py-3 rounded border border-border bg-bg-secondary text-text hover:border-blue-500 hover:text-blue-400 transition font-semibold text-base"
                      onClick={() => pemCertInputRef.current?.click()}
                    >
                      <span className="text-xl">+</span> Select File
                    </button>
                  </div>
                  <div className="mb-8">
                    <div className="text-text-secondary font-semibold mb-2">Private Key</div>
                    <input
                      ref={pemKeyInputRef}
                      type="file"
                      accept=".key,.pem"
                      className="hidden"
                    />
                    <button
                      className="w-full flex items-center justify-center gap-2 py-3 rounded border border-border bg-bg-secondary text-text hover:border-blue-500 hover:text-blue-400 transition font-semibold text-base"
                      onClick={() => pemKeyInputRef.current?.click()}
                    >
                      <span className="text-xl">+</span> Select File
                    </button>
                  </div>
                </>
              )}
              {clientTab === 'PFX' && (
                <div className="mb-8">
                  <div className="text-text-secondary font-semibold mb-2">PFX File</div>
                  <input
                    ref={pfxInputRef}
                    type="file"
                    accept=".pfx,.p12"
                    className="hidden"
                  />
                  <button
                    className="w-full flex items-center justify-center gap-2 py-3 rounded border border-border bg-bg-secondary text-text hover:border-blue-500 hover:text-blue-400 transition font-semibold text-base mb-4"
                    onClick={() => pfxInputRef.current?.click()}
                  >
                    <span className="text-xl">+</span> Select File
                  </button>
                  <div className="text-text-secondary font-semibold mb-2">Password</div>
                  <input
                    type="password"
                    value={pfxPassword}
                    onChange={e => setPfxPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-border bg-bg-secondary text-text focus:outline-none focus:border-blue-500 text-base"
                    placeholder="Enter password (if any)"
                  />
                </div>
              )}
              <div className="flex gap-4 mt-2">
                <button
                  className="bg-accent hover:bg-accent-dark text-text px-6 py-2 rounded font-semibold text-base shadow"
                  onClick={() => setShowClientModal(false)}
                >
                  Done
                </button>
                <button
                  className="bg-border hover:bg-border-dark text-text-secondary px-6 py-2 rounded font-semibold text-base shadow"
                  onClick={() => {
                    // Clear logic can be added here
                  }}
                >
                  Clear
                </button>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
      {/* Manage Domains Overrides Modal */} 
      {showDomainModal && (
        <AnimatePresence>
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-60">
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-bg-secondary rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 relative border border-border mt-10"
            >
              <button
                className="absolute top-4 right-4 text-text-secondary hover:text-text text-xl focus:outline-none"
                onClick={() => setShowDomainModal(false)}
                aria-label="Close"
              >
                ×
              </button>
              <div className="text-2xl font-bold text-center text-text mb-6">Manage Domains Overrides</div>
              <div className="flex items-center gap-2 mb-6">
                <input
                  type="text"
                  value={domainInput}
                  onChange={e => setDomainInput(e.target.value)}
                  placeholder="example.com"
                  className={`p-4 sm:p-6 rounded-lg shadow-sm border border-border bg-bg text-text ${themeClass}`}
                />
                <button
                  className="w-10 h-10 flex items-center justify-center rounded bg-border bg-opacity-20 text-text-secondary hover:border-blue-500 hover:text-blue-400 transition text-xl"
                  // onClick={...} // Add logic to handle domain add if needed
                >
                  +
                </button>
              </div>
              <div className="bg-border rounded p-4 text-text-secondary text-base opacity-60 select-none cursor-not-allowed">Global Defaults</div>
            </motion.div>
    </div>
        </AnimatePresence>
      )}
  </div>
);
};

export default InterceptorSettings; 