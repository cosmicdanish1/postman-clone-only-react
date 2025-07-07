// File: AuthorizationTabContent.tsx
// Type: Component (authorization tab content)
// Imports: React, MonacoEditor
// Imported by: TabContentArea.tsx
// Role: Renders the UI for configuring request authorization (various auth types) in the request editor.
// Located at: src/components/TabContentArea/AuthorizationTabContent.tsx
import React, { useState, useRef, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';

type AuthType =
  | 'inherit'
  | 'none'
  | 'basic'
  | 'digest'
  | 'bearer'
  | 'oauth2'
  | 'apikey'
  | 'aws'
  | 'hawk'
  | 'jwt';

interface AuthConfig {
  type: AuthType;
  token?: string;
  username?: string;
  password?: string;
  key?: string;
  value?: string;
  addTo?: 'header' | 'query';
  realm?: string;
  nonce?: string;
  algorithm?: string;
  qop?: string;
  nonceCount?: string;
  clientNonce?: string;
  opaque?: string;
  grantType?: string;
  usePkce?: string;
  authorizationEndpoint?: string;
  tokenEndpoint?: string;
  clientId?: string;
  clientSecret?: string;
  scopes?: string;
  passBy?: string;
  accessKey?: string;
  secretKey?: string;
  awsRegion?: string;
  serviceName?: string;
  serviceToken?: string;
  hawkId?: string;
  hawkKey?: string;
  hawkAlgorithm?: string;
  hawkUsername?: string;
  hawkNonce?: string;
  hawkExt?: string;
  hawkApp?: string;
  hawkDlg?: string;
  hawkTimestamp?: string;
  hawkIncludePayloadHash?: string;
  jwtAlgorithm?: string;
  jwtSecret?: string;
  jwtSecretBase64?: boolean;
  jwtPayload?: string;
  jwtHeaders?: string;
}

const AuthorizationTabContent: React.FC = () => {
  const [authType, setAuthType] = useState<AuthType>('none');
  const [authConfig, setAuthConfig] = useState<AuthConfig>({
    type: 'none'
  });
  const [enabled, setEnabled] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const authTypes = [
    { value: 'inherit', label: 'Inherit' },
    { value: 'none', label: 'None' },
    { value: 'basic', label: 'Basic Auth' },
    { value: 'digest', label: 'Digest Auth' },
    { value: 'bearer', label: 'Bearer' },
    { value: 'oauth2', label: 'OAuth 2.0' },
    { value: 'apikey', label: 'API Key' },
    { value: 'aws', label: 'AWS Signature' },
    { value: 'hawk', label: 'HAWK' },
    { value: 'jwt', label: 'JWT' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const handleAuthTypeChange = (type: AuthType) => {
    setAuthType(type);
    setAuthConfig({ type });
  };

  const handleAuthConfigChange = (field: keyof AuthConfig, value: string) => {
    setAuthConfig(prev => ({ ...prev, [field]: value }));
  };

  const renderAuthFields = () => {
    if (authType === 'inherit') {
      return (
        <div className="flex flex-row w-full h-64 bg-neutral-900 divide-x divide-neutral-800">
          <div className="flex-1 flex items-start p-8">
            <span className="text-gray-200 text-base">
              Please save this request in any collection to <b>inherit the authorization</b>
            </span>
          </div>
          <div className="w-1/3 min-w-[260px] flex flex-col items-start p-8">
            <span className="text-gray-400 text-sm mb-2">
              The authorization header will be automatically generated when you send the request.
            </span>
            <a
              href="https://learning.postman.com/docs/sending-requests/authorization/#inheriting-auth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex items-center gap-1 text-sm mt-2"
            >
              Learn how
              <span className="material-icons text-base align-middle">open_in_new</span>
            </a>
          </div>
        </div>
      );
    }
    switch (authType) {
      case 'bearer':
        return (
          <div className="flex flex-row w-full bg-neutral-900 divide-x divide-neutral-800">
            <div className="flex-1 flex flex-col justify-start p-8 gap-2">
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Token"
                value={authConfig.token || ''}
                onChange={e => handleAuthConfigChange('token', e.target.value)}
                autoComplete="off"
                type="text"
              />
            </div>
            <div className="w-1/3 min-w-[260px] flex flex-col items-start p-8">
              <span className="text-gray-400 text-sm mb-2">
                The authorization header will be automatically generated when you send the request.
              </span>
              <a
                href="https://learning.postman.com/docs/sending-requests/authorization/#bearer-token"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center gap-1 text-sm mt-2"
              >
                Learn how
                <span className="material-icons text-base align-middle">open_in_new</span>
              </a>
            </div>
          </div>
        );

      case 'basic':
        return (
          <div className="flex flex-row w-full h-64 bg-neutral-900 divide-x divide-neutral-800">
            <div className="flex-1 flex flex-col justify-start p-8 gap-2">
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Username"
                value={authConfig.username || ''}
                onChange={e => handleAuthConfigChange('username', e.target.value)}
                autoComplete="username"
                type="text"
              />
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Password"
                value={authConfig.password || ''}
                onChange={e => handleAuthConfigChange('password', e.target.value)}
                autoComplete="current-password"
                type="password"
              />
            </div>
            <div className="w-1/3 min-w-[260px] flex flex-col items-start p-8">
              <span className="text-gray-400 text-sm mb-2">
                The authorization header will be automatically generated when you send the request.
              </span>
              <a
                href="https://learning.postman.com/docs/sending-requests/authorization/#basic-auth"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center gap-1 text-sm mt-2"
              >
                Learn how
                <span className="material-icons text-base align-middle">open_in_new</span>
              </a>
            </div>
          </div>
        );

      case 'apikey':
        return (
          <div className="flex flex-row w-full bg-neutral-900 divide-x divide-neutral-800">
            <div className="flex-1 flex flex-col justify-start p-8 gap-2">
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Key"
                value={authConfig.key || ''}
                onChange={e => handleAuthConfigChange('key', e.target.value)}
                type="text"
              />
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Value"
                value={authConfig.value || ''}
                onChange={e => handleAuthConfigChange('value', e.target.value)}
                type="text"
              />
              <div className="flex items-center border-b border-neutral-800 py-3">
                <span className="text-gray-400 text-sm mr-4">Pass by</span>
                <select
                  className="bg-transparent text-gray-200 font-semibold focus:outline-none"
                  value={authConfig.addTo || 'header'}
                  onChange={e => handleAuthConfigChange('addTo', e.target.value)}
                >
                  <option value="header" className="bg-neutral-900 text-gray-200">Headers</option>
                  <option value="query" className="bg-neutral-900 text-gray-200">Query</option>
                </select>
              </div>
            </div>
            <div className="w-1/3 min-w-[260px] flex flex-col items-start p-8">
              <span className="text-gray-400 text-sm mb-2">
                The authorization header will be automatically generated when you send the request.
              </span>
              <a
                href="https://learning.postman.com/docs/sending-requests/authorization/#api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center gap-1 text-sm mt-2"
              >
                Learn how
                <span className="material-icons text-base align-middle">open_in_new</span>
              </a>
            </div>
          </div>
        );

      case 'digest':
        return (
          <div className="flex flex-row w-full bg-neutral-900 divide-x divide-neutral-800">
            <div className="flex-1 flex flex-col justify-start p-8 gap-2">
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Username"
                value={authConfig.username || ''}
                onChange={e => handleAuthConfigChange('username', e.target.value)}
                autoComplete="username"
                type="text"
              />
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Password"
                value={authConfig.password || ''}
                onChange={e => handleAuthConfigChange('password', e.target.value)}
                autoComplete="current-password"
                type="password"
              />
              <div className="mt-6 mb-2">
                <div className="font-semibold text-gray-200 text-sm mb-1">Advanced Configuration</div>
                <div className="text-xs text-gray-400 mb-4">Hoppscotch automatically assigns default values to certain fields if no explicit value is provided</div>
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="Realm (e.g. testrealm@example.com)"
                  value={authConfig.realm || ''}
                  onChange={e => handleAuthConfigChange('realm', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="Nonce"
                  value={authConfig.nonce || ''}
                  onChange={e => handleAuthConfigChange('nonce', e.target.value)}
                  type="text"
                />
                <div className="flex items-center border-b border-neutral-800 py-3">
                  <span className="text-gray-400 text-sm mr-4">Algorithm</span>
                  <select
                    className="bg-transparent text-gray-200 font-semibold focus:outline-none"
                    value={authConfig.algorithm || 'sha1'}
                    onChange={e => handleAuthConfigChange('algorithm', e.target.value)}
                  >
                    <option value="sha1" className="bg-neutral-900 text-gray-200">sha1</option>
                    <option value="md5" className="bg-neutral-900 text-gray-200">md5</option>
                    <option value="sha256" className="bg-neutral-900 text-gray-200">sha256</option>
                    <option value="sha512" className="bg-neutral-900 text-gray-200">sha512</option>
                  </select>
                </div>
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="qop (e.g. auth-int)"
                  value={authConfig.qop || ''}
                  onChange={e => handleAuthConfigChange('qop', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="Nonce Count (e.g. 00000001)"
                  value={authConfig.nonceCount || ''}
                  onChange={e => handleAuthConfigChange('nonceCount', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="Client Nonce (e.g. Oa4f113b)"
                  value={authConfig.clientNonce || ''}
                  onChange={e => handleAuthConfigChange('clientNonce', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="Opaque"
                  value={authConfig.opaque || ''}
                  onChange={e => handleAuthConfigChange('opaque', e.target.value)}
                  type="text"
                />
              </div>
            </div>
            <div className="w-1/3 min-w-[260px] flex flex-col items-start p-8">
              <span className="text-gray-400 text-sm mb-2">
                The authorization header will be automatically generated when you send the request.
              </span>
              <a
                href="https://learning.postman.com/docs/sending-requests/authorization/#digest-auth"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center gap-1 text-sm mt-2"
              >
                Learn how
                <span className="material-icons text-base align-middle">open_in_new</span>
              </a>
            </div>
          </div>
        );

      case 'oauth2':
        return (
          <div className="flex flex-row w-full bg-neutral-900 divide-x divide-neutral-800">
            <div className="flex-1 flex flex-col justify-start p-8 gap-2">
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Token"
                value={authConfig.token || ''}
                onChange={e => handleAuthConfigChange('token', e.target.value)}
                autoComplete="off"
                type="text"
              />
              <div className="flex items-center border-b border-neutral-800 py-3">
                <span className="text-gray-400 text-sm mr-4">Grant Type</span>
                <select
                  className="bg-transparent text-gray-200 font-semibold focus:outline-none"
                  value={authConfig.grantType || 'authorization_code'}
                  onChange={e => handleAuthConfigChange('grantType', e.target.value)}
                >
                  <option value="authorization_code" className="bg-neutral-900 text-gray-200">Authorization Code</option>
                  <option value="client_credentials" className="bg-neutral-900 text-gray-200">Client Credentials</option>
                  <option value="password" className="bg-neutral-900 text-gray-200">Password</option>
                  <option value="implicit" className="bg-neutral-900 text-gray-200">Implicit</option>
                  <option value="refresh_token" className="bg-neutral-900 text-gray-200">Refresh Token</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-gray-400 text-sm py-3 border-b border-neutral-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!authConfig.usePkce}
                  onChange={e => handleAuthConfigChange('usePkce', e.target.checked ? 'true' : '')}
                  className="accent-blue-500"
                />
                Use PKCE
              </label>
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Authorization Endpoint"
                value={authConfig.authorizationEndpoint || ''}
                onChange={e => handleAuthConfigChange('authorizationEndpoint', e.target.value)}
                type="text"
              />
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Token Endpoint"
                value={authConfig.tokenEndpoint || ''}
                onChange={e => handleAuthConfigChange('tokenEndpoint', e.target.value)}
                type="text"
              />
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Client ID"
                value={authConfig.clientId || ''}
                onChange={e => handleAuthConfigChange('clientId', e.target.value)}
                type="text"
              />
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Client Secret"
                value={authConfig.clientSecret || ''}
                onChange={e => handleAuthConfigChange('clientSecret', e.target.value)}
                type="password"
              />
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Scopes"
                value={authConfig.scopes || ''}
                onChange={e => handleAuthConfigChange('scopes', e.target.value)}
                type="text"
              />
              <div className="flex items-center border-b border-neutral-800 py-3">
                <span className="text-gray-400 text-sm mr-4">Pass by</span>
                <select
                  className="bg-transparent text-gray-200 font-semibold focus:outline-none"
                  value={authConfig.passBy || 'header'}
                  onChange={e => handleAuthConfigChange('passBy', e.target.value)}
                >
                  <option value="header" className="bg-neutral-900 text-gray-200">Headers</option>
                  <option value="query" className="bg-neutral-900 text-gray-200">Query</option>
                </select>
              </div>
              <div className="flex gap-4 mt-4">
                <button className="bg-neutral-800 text-gray-200 px-4 py-2 rounded hover:bg-neutral-700 transition-colors" type="button">Generate Token</button>
                <button className="bg-neutral-800 text-gray-200 px-4 py-2 rounded hover:bg-neutral-700 transition-colors" type="button">Refresh Token</button>
              </div>
            </div>
            <div className="w-1/3 min-w-[260px] flex flex-col items-start p-8">
              <span className="text-gray-400 text-sm mb-2">
                The authorization header will be automatically generated when you send the request.
              </span>
              <a
                href="https://learning.postman.com/docs/sending-requests/authorization/#oauth-2-0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center gap-1 text-sm mt-2"
              >
                Learn how
                <span className="material-icons text-base align-middle">open_in_new</span>
              </a>
            </div>
          </div>
        );

      case 'aws':
        return (
          <div className="flex flex-row w-full bg-neutral-900 divide-x divide-neutral-800">
            <div className="flex-1 flex flex-col justify-start p-8 gap-2">
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Access Key"
                value={authConfig.accessKey || ''}
                onChange={e => handleAuthConfigChange('accessKey', e.target.value)}
                type="text"
              />
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Secret Key"
                value={authConfig.secretKey || ''}
                onChange={e => handleAuthConfigChange('secretKey', e.target.value)}
                type="password"
              />
              <div className="mt-6 mb-2">
                <div className="font-semibold text-gray-200 text-sm mb-1">Advanced Configuration</div>
                <div className="text-xs text-gray-400 mb-4">Hoppscotch automatically assigns default values to certain fields if no explicit value is provided</div>
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="AWS Region (default: us-east-1)"
                  value={authConfig.awsRegion || ''}
                  onChange={e => handleAuthConfigChange('awsRegion', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="Service Name"
                  value={authConfig.serviceName || ''}
                  onChange={e => handleAuthConfigChange('serviceName', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="Service Token"
                  value={authConfig.serviceToken || ''}
                  onChange={e => handleAuthConfigChange('serviceToken', e.target.value)}
                  type="text"
                />
              </div>
              <div className="flex items-center border-b border-neutral-800 py-3">
                <span className="text-gray-400 text-sm mr-4">Pass by</span>
                <select
                  className="bg-transparent text-gray-200 font-semibold focus:outline-none"
                  value={authConfig.addTo || 'header'}
                  onChange={e => handleAuthConfigChange('addTo', e.target.value)}
                >
                  <option value="header" className="bg-neutral-900 text-gray-200">Headers</option>
                  <option value="query" className="bg-neutral-900 text-gray-200">Query</option>
                </select>
              </div>
            </div>
            <div className="w-1/3 min-w-[260px] flex flex-col items-start p-8">
              <span className="text-gray-400 text-sm mb-2">
                The authorization header will be automatically generated when you send the request.
              </span>
              <a
                href="https://learning.postman.com/docs/sending-requests/authorization/#aws-signature"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center gap-1 text-sm mt-2"
              >
                Learn how
                <span className="material-icons text-base align-middle">open_in_new</span>
              </a>
            </div>
          </div>
        );

      case 'hawk':
        return (
          <div className="flex flex-row w-full bg-neutral-900 divide-x divide-neutral-800">
            <div className="flex-1 flex flex-col justify-start p-8 gap-2">
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="HAWK Auth ID"
                value={authConfig.hawkId || ''}
                onChange={e => handleAuthConfigChange('hawkId', e.target.value)}
                type="text"
              />
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="HAWK Auth Key"
                value={authConfig.hawkKey || ''}
                onChange={e => handleAuthConfigChange('hawkKey', e.target.value)}
                type="password"
              />
              <div className="flex items-center border-b border-neutral-800 py-3">
                <span className="text-gray-400 text-sm mr-4">Algorithm</span>
                <select
                  className="bg-transparent text-gray-200 font-semibold focus:outline-none"
                  value={authConfig.hawkAlgorithm || 'md5'}
                  onChange={e => handleAuthConfigChange('hawkAlgorithm', e.target.value)}
                >
                  <option value="md5" className="bg-neutral-900 text-gray-200">MD5</option>
                  <option value="sha1" className="bg-neutral-900 text-gray-200">SHA1</option>
                  <option value="sha256" className="bg-neutral-900 text-gray-200">SHA256</option>
                  <option value="sha512" className="bg-neutral-900 text-gray-200">SHA512</option>
                </select>
              </div>
              <div className="mt-6 mb-2">
                <div className="font-semibold text-gray-200 text-sm mb-1">Advanced Configuration</div>
                <div className="text-xs text-gray-400 mb-4">Hoppscotch automatically assigns default values to certain fields if no explicit value is provided</div>
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="Username"
                  value={authConfig.hawkUsername || ''}
                  onChange={e => handleAuthConfigChange('hawkUsername', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="Nonce"
                  value={authConfig.hawkNonce || ''}
                  onChange={e => handleAuthConfigChange('hawkNonce', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="ext"
                  value={authConfig.hawkExt || ''}
                  onChange={e => handleAuthConfigChange('hawkExt', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="app"
                  value={authConfig.hawkApp || ''}
                  onChange={e => handleAuthConfigChange('hawkApp', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="dlg"
                  value={authConfig.hawkDlg || ''}
                  onChange={e => handleAuthConfigChange('hawkDlg', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder="Timestamp"
                  value={authConfig.hawkTimestamp || ''}
                  onChange={e => handleAuthConfigChange('hawkTimestamp', e.target.value)}
                  type="text"
                />
                <label className="flex items-center gap-2 text-gray-400 text-sm py-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!!authConfig.hawkIncludePayloadHash}
                    onChange={e => handleAuthConfigChange('hawkIncludePayloadHash', e.target.checked ? 'true' : '')}
                    className="accent-blue-500"
                  />
                  Include Payload Hash
                </label>
              </div>
            </div>
            <div className="w-1/3 min-w-[260px] flex flex-col items-start p-8">
              <span className="text-gray-400 text-sm mb-2">
                The authorization header will be automatically generated when you send the request.
              </span>
              <a
                href="https://learning.postman.com/docs/sending-requests/authorization/#hawk-authentication"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center gap-1 text-sm mt-2"
              >
                Learn how
                <span className="material-icons text-base align-middle">open_in_new</span>
              </a>
            </div>
          </div>
        );

      case 'jwt':
        return (
          <div className="flex flex-row w-full bg-neutral-900 divide-x divide-neutral-800">
            <div className="flex-1 flex flex-col justify-start p-8 gap-2">
              <div className="flex items-center border-b border-neutral-800 py-3">
                <span className="text-gray-400 text-sm mr-4">Algorithm</span>
                <select
                  className="bg-transparent text-gray-200 font-semibold focus:outline-none"
                  value={authConfig.jwtAlgorithm || 'HS256'}
                  onChange={e => handleAuthConfigChange('jwtAlgorithm', e.target.value)}
                >
                  <option value="HS256" className="bg-neutral-900 text-gray-200">HS256</option>
                  <option value="HS384" className="bg-neutral-900 text-gray-200">HS384</option>
                  <option value="HS512" className="bg-neutral-900 text-gray-200">HS512</option>
                  <option value="RS256" className="bg-neutral-900 text-gray-200">RS256</option>
                  <option value="RS384" className="bg-neutral-900 text-gray-200">RS384</option>
                  <option value="RS512" className="bg-neutral-900 text-gray-200">RS512</option>
                  <option value="ES256" className="bg-neutral-900 text-gray-200">ES256</option>
                  <option value="ES384" className="bg-neutral-900 text-gray-200">ES384</option>
                  <option value="ES512" className="bg-neutral-900 text-gray-200">ES512</option>
                  <option value="PS256" className="bg-neutral-900 text-gray-200">PS256</option>
                  <option value="PS384" className="bg-neutral-900 text-gray-200">PS384</option>
                  <option value="PS512" className="bg-neutral-900 text-gray-200">PS512</option>
                  <option value="none" className="bg-neutral-900 text-gray-200">none</option>
                </select>
              </div>
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder="Secret"
                value={authConfig.jwtSecret || ''}
                onChange={e => handleAuthConfigChange('jwtSecret', e.target.value)}
                type="password"
              />
              <label className="flex items-center gap-2 text-gray-400 text-sm py-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!authConfig.jwtSecretBase64}
                  onChange={e => handleAuthConfigChange('jwtSecretBase64', e.target.checked ? 'true' : '')}
                  className="accent-blue-500"
                />
                Secret Base64 Encoded
              </label>
              <div className="mt-2 mb-2">
                <div className="text-gray-400 text-sm mb-1">Payload</div>
                <div className="border border-neutral-800 rounded bg-neutral-900 overflow-hidden">
                  <MonacoEditor
                    height="100px"
                    language="json"
                    theme="vs-dark"
                    value={authConfig.jwtPayload || '{\n  \n}'}
                    onChange={v => handleAuthConfigChange('jwtPayload', v || '')}
                    options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: 'on', scrollBeyondLastLine: false, scrollbar: { vertical: 'hidden', horizontal: 'hidden' } }}
                  />
                </div>
              </div>
              <div className="mt-6 mb-2">
                <div className="font-semibold text-gray-200 text-sm mb-1">Advanced Configuration</div>
                <div className="text-xs text-gray-400 mb-4">Hoppscotch automatically assigns default values to certain fields if no explicit value is provided</div>
                <div className="flex items-center border-b border-neutral-800 py-3">
                  <span className="text-gray-400 text-sm mr-4">Pass by</span>
                  <select
                    className="bg-transparent text-gray-200 font-semibold focus:outline-none"
                    value={authConfig.addTo || 'header'}
                    onChange={e => handleAuthConfigChange('addTo', e.target.value)}
                  >
                    <option value="header" className="bg-neutral-900 text-gray-200">Headers</option>
                    <option value="query" className="bg-neutral-900 text-gray-200">Query</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 mb-2">
                <div className="font-semibold text-gray-200 text-sm mb-1">Bearer</div>
                <div className="text-gray-400 text-sm mb-1">JWT Headers</div>
                <div className="border border-neutral-800 rounded bg-neutral-900 overflow-hidden">
                  <MonacoEditor
                    height="100px"
                    language="json"
                    theme="vs-dark"
                    value={authConfig.jwtHeaders || '{\n  \n}'}
                    onChange={v => handleAuthConfigChange('jwtHeaders', v || '')}
                    options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: 'on', scrollBeyondLastLine: false, scrollbar: { vertical: 'hidden', horizontal: 'hidden' } }}
                  />
                </div>
              </div>
            </div>
            <div className="w-1/3 min-w-[260px] flex flex-col items-start p-8">
              <span className="text-gray-400 text-sm mb-2">
                The authorization header will be automatically generated when you send the request.
              </span>
              <a
                href="https://learning.postman.com/docs/sending-requests/authorization/#jwt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center gap-1 text-sm mt-2"
              >
                Learn how
                <span className="material-icons text-base align-middle">open_in_new</span>
              </a>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
              <span className="material-icons text-gray-400 text-2xl">lock_open</span>
            </div>
            <h3 className="text-gray-300 text-lg font-medium mb-2">No Authorization</h3>
            <p className="text-gray-500 text-sm max-w-md">
              This request will be sent without any authorization headers. 
              Select an authorization type above to configure authentication.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-neutral-900 rounded p-0 mt-2">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 h-10 border-b border-neutral-800 bg-neutral-900">
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Authorization Type</span>
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 bg-neutral-900 text-white font-semibold px-2 py-1 rounded border border-neutral-800 focus:outline-none min-w-[110px]"
              onClick={() => setDropdownOpen(v => !v)}
              type="button"
            >
              {authTypes.find(t => t.value === authType)?.label || ''}
              <span className="material-icons text-base">arrow_drop_down</span>
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 mt-1 z-50 w-56 bg-neutral-900 border border-neutral-800 rounded shadow-lg py-2">
                {authTypes.map(type => (
                  <label
                    key={type.value}
                    className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors select-none ${authType === type.value ? 'font-semibold text-white' : 'text-gray-300 hover:bg-neutral-800'}`}
                  >
                    <input
                      type="radio"
                      name="authTypeDropdown"
                      value={type.value}
                      checked={authType === type.value}
                      onChange={() => {
                        setAuthType(type.value as AuthType);
                        setAuthConfig({ type: type.value as AuthType });
                        setDropdownOpen(false);
                      }}
                      className="accent-blue-500"
                    />
                    <span className="text-base">{type.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={enabled}
              onChange={e => setEnabled(e.target.checked)}
              className="accent-blue-500"
            />
            <span className="font-semibold text-gray-200 text-sm">Enabled</span>
          </label>
          <button className="text-gray-400 hover:text-gray-200" title="Help">
            <span className="material-icons text-base">help_outline</span>
          </button>
          <button className="text-gray-400 hover:text-red-500" title="Delete">
            <span className="material-icons text-base">delete</span>
          </button>
        </div>
      </div>
      {/* Auth fields below bar, only if enabled */}
      {enabled && (
        <div className="p-6">
          {renderAuthFields()}
        </div>
      )}
    </div>
  );
};

export default AuthorizationTabContent; 