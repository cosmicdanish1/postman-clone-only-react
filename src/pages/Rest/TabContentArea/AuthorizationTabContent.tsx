// File: AuthorizationTabContent.tsx
// Type: Component (authorization tab content)
// Imports: React, MonacoEditor
// Imported by: TabContentArea.tsx
// Role: Renders the UI for configuring request authorization (various auth types) in the request editor.
// Located at: src/components/TabContentArea/AuthorizationTabContent.tsx
import React, { useState, useRef, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import type { AuthType } from '../../../types';

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

interface AuthorizationTabContentProps {
  authType: AuthType;
  setAuthType: (type: AuthType) => void;
}

const AuthorizationTabContent: React.FC<AuthorizationTabContentProps> = ({ 
  authType: propAuthType, 
  setAuthType: propSetAuthType 
}) => {
  const theme = useSelector((state: any) => state.theme.theme);
  const { t } = useTranslation();
  let themeClass = '';
  if (theme === 'dark') themeClass = 'theme-dark';
  else if (theme === 'black') themeClass = 'theme-black';
  // No class for light (default)

  const [authType, setAuthType] = useState<AuthType>(propAuthType || 'none');
  const [authConfig, setAuthConfig] = useState<AuthConfig>({
    type: 'none'
  });
  const [enabled, setEnabled] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const authTypes = [
    { value: 'inherit', label: t('auth_inherit') },
    { value: 'none', label: t('auth_none') },
    { value: 'basic', label: t('auth_basic') },
    { value: 'digest', label: t('auth_digest') },
    { value: 'bearer', label: t('auth_bearer') },
    { value: 'oauth2', label: t('auth_oauth2') },
    { value: 'apikey', label: t('auth_apikey') },
    { value: 'aws', label: t('auth_aws') },
    { value: 'hawk', label: t('auth_hawk') },
    { value: 'jwt', label: t('auth_jwt') },
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

  // Sync local state with props
  useEffect(() => {
    if (propAuthType) {
      setAuthType(propAuthType);
    }
  }, [propAuthType]);

  const handleAuthTypeChange = (type: AuthType) => {
    setAuthType(type);
    propSetAuthType(type);
  };

  const handleAuthConfigChange = (field: keyof AuthConfig, value: string) => {
    setAuthConfig(prev => ({ ...prev, [field]: value }));
  };

  const renderAuthFields = () => {
    if (authType === 'inherit') {
      return (
        <div className="flex flex-row w-full min-h-[200px] divide-x divide-neutral-800">
          <div className="flex-1 flex items-start p-8">
            <span className="text-gray-200 text-base">
              {t('auth_save_inherit')}
            </span>
          </div>
          <div className="w-1/3 min-w-[260px] flex flex-col items-start p-8">
            <span className="text-gray-400 text-sm mb-2">
              {t('auth_header_generated')}
            </span>
            <a
              href="https://learning.postman.com/docs/sending-requests/authorization/#inheriting-auth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex items-center gap-1 text-sm mt-2"
            >
              {t('learn_how')}
              <span className="material-icons text-base align-middle">open_in_new</span>
            </a>
          </div>
        </div>
      );
    }
    switch (authType) {
      case 'bearer':
        return (
          <div className="flex flex-row w-full min-h-[200px] divide-x divide-neutral-800">
            <div className="flex-1 flex flex-col justify-start p-8 gap-2">
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder={t('token')}
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
          <div className="flex flex-row w-full min-h-[200px] divide-x divide-neutral-800">
            <div className="flex-1 flex flex-col justify-start p-8 gap-2">
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder={t('username')}
                value={authConfig.username || ''}
                onChange={e => handleAuthConfigChange('username', e.target.value)}
                autoComplete="username"
                type="text"
              />
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder={t('password')}
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
          <div className="flex flex-row w-full min-h-[200px] divide-x divide-neutral-800">
            <div className="flex-1 flex flex-col justify-start p-8 gap-2">
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder={t('key')}
                value={authConfig.key || ''}
                onChange={e => handleAuthConfigChange('key', e.target.value)}
                type="text"
              />
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder={t('value')}
                value={authConfig.value || ''}
                onChange={e => handleAuthConfigChange('value', e.target.value)}
                type="text"
              />
              <div className="flex items-center border-b border-neutral-800 py-3">
                <span className="text-gray-400 text-sm mr-4">{t('pass_by')}</span>
                <select
                  className="bg-transparent text-gray-200 font-semibold focus:outline-none"
                  value={authConfig.addTo || 'header'}
                  onChange={e => handleAuthConfigChange('addTo', e.target.value)}
                >
                  <option value="header" className="bg-neutral-900 text-gray-200">{t('headers')}</option>
                  <option value="query" className="bg-neutral-900 text-gray-200">{t('query')}</option>
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
          <div className="flex flex-row w-full min-h-[200px] divide-x divide-neutral-800">
            <div className="flex-1 flex flex-col justify-start p-8 gap-2">
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder={t('username')}
                value={authConfig.username || ''}
                onChange={e => handleAuthConfigChange('username', e.target.value)}
                autoComplete="username"
                type="text"
              />
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder={t('password')}
                value={authConfig.password || ''}
                onChange={e => handleAuthConfigChange('password', e.target.value)}
                autoComplete="current-password"
                type="password"
              />
              <div className="mt-6 mb-2">
                <div className="font-semibold text-gray-200 text-sm mb-1">{t('advanced_configuration')}</div>
                <div className="text-xs text-gray-400 mb-4">{t('auto_assign_defaults')}</div>
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder={t('realm_placeholder')}
                  value={authConfig.realm || ''}
                  onChange={e => handleAuthConfigChange('realm', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder={t('nonce')}
                  value={authConfig.nonce || ''}
                  onChange={e => handleAuthConfigChange('nonce', e.target.value)}
                  type="text"
                />
                <div className="flex items-center border-b border-neutral-800 py-3">
                  <span className="text-gray-400 text-sm mr-4">{t('algorithm')}</span>
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
                  placeholder={t('qop_placeholder')}
                  value={authConfig.qop || ''}
                  onChange={e => handleAuthConfigChange('qop', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder={t('nonce_count_placeholder')}
                  value={authConfig.nonceCount || ''}
                  onChange={e => handleAuthConfigChange('nonceCount', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder={t('client_nonce_placeholder')}
                  value={authConfig.clientNonce || ''}
                  onChange={e => handleAuthConfigChange('clientNonce', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder={t('opaque')}
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
          <div className="flex flex-row w-full min-h-[200px] divide-x divide-neutral-800">
            <div className="flex-1 flex flex-col justify-start p-8 gap-2">
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder={t('token')}
                value={authConfig.token || ''}
                onChange={e => handleAuthConfigChange('token', e.target.value)}
                autoComplete="off"
                type="text"
              />
              <div className="flex items-center border-b border-neutral-800 py-3">
                <span className="text-gray-400 text-sm mr-4">{t('grant_type')}</span>
                <select
                  className="bg-transparent text-gray-200 font-semibold focus:outline-none"
                  value={authConfig.grantType || 'authorization_code'}
                  onChange={e => handleAuthConfigChange('grantType', e.target.value)}
                >
                  <option value="authorization_code" className="  text-gray-200">{t('authorization_code')}</option>
                  <option value="client_credentials" className=" text-gray-200">{t('client_credentials')}</option>
                  <option value="password" className=" text-gray-200">{t('password_grant')}</option>
                  <option value="implicit" className=" text-gray-200">{t('implicit')}</option>
                  <option value="refresh_token" className=" text-gray-200">{t('refresh_token')}</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-gray-400 text-sm py-3 border-b border-neutral-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!authConfig.usePkce}
                  onChange={e => handleAuthConfigChange('usePkce', e.target.checked ? 'true' : '')}
                  className="accent-blue-500"
                />
                {t('use_pkce')}
              </label>
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder={t('authorization_endpoint')}
                value={authConfig.authorizationEndpoint || ''}
                onChange={e => handleAuthConfigChange('authorizationEndpoint', e.target.value)}
                type="text"
              />
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder={t('token_endpoint')}
                value={authConfig.tokenEndpoint || ''}
                onChange={e => handleAuthConfigChange('tokenEndpoint', e.target.value)}
                type="text"
              />
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder={t('client_id')}
                value={authConfig.clientId || ''}
                onChange={e => handleAuthConfigChange('clientId', e.target.value)}
                type="text"
              />
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder={t('client_secret')}
                value={authConfig.clientSecret || ''}
                onChange={e => handleAuthConfigChange('clientSecret', e.target.value)}
                type="password"
              />
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder={t('scopes')}
                value={authConfig.scopes || ''}
                onChange={e => handleAuthConfigChange('scopes', e.target.value)}
                type="text"
              />
              <div className="flex items-center border-b border-neutral-800 py-3">
                <span className="text-gray-400 text-sm mr-4">{t('pass_by')}</span>
                <select
                  className="bg-transparent text-gray-200 font-semibold focus:outline-none"
                  value={authConfig.passBy || 'header'}
                  onChange={e => handleAuthConfigChange('passBy', e.target.value)}
                >
                  <option value="header" className=" text-gray-200">{t('headers')}</option>
                  <option value="query" className=" text-gray-200">{t('query')}</option>
                </select>
              </div>
              <div className="flex gap-4 mt-4">
                <button className=" text-gray-200 px-4 py-2 rounded hover:bg-neutral-700 transition-colors" type="button">{t('generate_token')}</button>
                <button className=" text-gray-200 px-4 py-2 rounded hover:bg-neutral-700 transition-colors" type="button">{t('refresh_token_btn')}</button>
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
          <div className="flex flex-row w-full min-h-[200px] divide-x divide-neutral-800">
            <div className="flex-1 flex flex-col justify-start p-8 gap-2">
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder={t('access_key')}
                value={authConfig.accessKey || ''}
                onChange={e => handleAuthConfigChange('accessKey', e.target.value)}
                type="text"
              />
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder={t('secret_key')}
                value={authConfig.secretKey || ''}
                onChange={e => handleAuthConfigChange('secretKey', e.target.value)}
                type="password"
              />
              <div className="mt-6 mb-2">
                <div className="font-semibold text-gray-200 text-sm mb-1">{t('advanced_configuration')}</div>
                <div className="text-xs text-gray-400 mb-4">{t('auto_assign_defaults')}</div>
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder={t('aws_region')}
                  value={authConfig.awsRegion || ''}
                  onChange={e => handleAuthConfigChange('awsRegion', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder={t('service_name')}
                  value={authConfig.serviceName || ''}
                  onChange={e => handleAuthConfigChange('serviceName', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder={t('service_token')}
                  value={authConfig.serviceToken || ''}
                  onChange={e => handleAuthConfigChange('serviceToken', e.target.value)}
                  type="text"
                />
              </div>
              <div className="flex items-center border-b border-neutral-800 py-3">
                <span className="text-gray-400 text-sm mr-4">{t('pass_by')}</span>
                <select
                  className="bg-transparent text-gray-200 font-semibold focus:outline-none"
                  value={authConfig.addTo || 'header'}
                  onChange={e => handleAuthConfigChange('addTo', e.target.value)}
                >
                  <option value="header" className="bg-neutral-900 text-gray-200">{t('headers')}</option>
                  <option value="query" className="bg-neutral-900 text-gray-200">{t('query')}</option>
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
          <div className="flex flex-row w-full min-h-[200px] divide-x divide-neutral-800">
            <div className="flex-1 flex flex-col justify-start p-8 gap-2">
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder={t('hawk_auth_id')}
                value={authConfig.hawkId || ''}
                onChange={e => handleAuthConfigChange('hawkId', e.target.value)}
                type="text"
              />
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder={t('hawk_auth_key')}
                value={authConfig.hawkKey || ''}
                onChange={e => handleAuthConfigChange('hawkKey', e.target.value)}
                type="password"
              />
              <div className="flex items-center border-b border-neutral-800 py-3">
                <span className="text-gray-400 text-sm mr-4">{t('algorithm')}</span>
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
                <div className="font-semibold text-gray-200 text-sm mb-1">{t('advanced_configuration')}</div>
                <div className="text-xs text-gray-400 mb-4">{t('auto_assign_defaults')}</div>
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder={t('username')}
                  value={authConfig.hawkUsername || ''}
                  onChange={e => handleAuthConfigChange('hawkUsername', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder={t('nonce')}
                  value={authConfig.hawkNonce || ''}
                  onChange={e => handleAuthConfigChange('hawkNonce', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder={t('ext')}
                  value={authConfig.hawkExt || ''}
                  onChange={e => handleAuthConfigChange('hawkExt', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder={t('app')}
                  value={authConfig.hawkApp || ''}
                  onChange={e => handleAuthConfigChange('hawkApp', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder={t('dlg')}
                  value={authConfig.hawkDlg || ''}
                  onChange={e => handleAuthConfigChange('hawkDlg', e.target.value)}
                  type="text"
                />
                <input
                  className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                  placeholder={t('timestamp')}
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
                  {t('include_payload_hash')}
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
          <div className="flex flex-row w-full min-h-[200px] divide-x divide-neutral-800">
            <div className="flex-1 flex flex-col justify-start p-8 gap-2">
              <div className="flex items-center border-b border-neutral-800 py-3">
                <span className="text-gray-400 text-sm mr-4">{t('algorithm')}</span>
                <select
                  className="bg-transparent text-gray-200 font-semibold focus:outline-none"
                  value={authConfig.jwtAlgorithm || 'HS256'}
                  onChange={e => handleAuthConfigChange('jwtAlgorithm', e.target.value)}
                >
                  <option value="HS256" className=" text-gray-200">{t('HS256')}</option>
                  <option value="HS384" className=" text-gray-200">{t('HS384')}</option>
                  <option value="HS512" className=" text-gray-200">{t('HS512')}</option>
                  <option value="RS256" className=" text-gray-200">{t('RS256')}</option>
                  <option value="RS384" className=" text-gray-200">{t('RS384')}</option>
                  <option value="RS512" className=" text-gray-200">{t('RS512')}</option>
                  <option value="ES256" className=" text-gray-200">{t('ES256')}</option>
                  <option value="ES384" className=" text-gray-200">{t('ES384')}</option>
                  <option value="ES512" className=" text-gray-200">{t('ES512')}</option>
                  <option value="PS256" className=" text-gray-200">{t('PS256')}</option>
                  <option value="PS384" className=" text-gray-200">{t('PS384')}</option>
                  <option value="PS512" className=" text-gray-200">{t('PS512')}</option>
                  <option value="none" className=" text-gray-200">{t('none_alg')}</option>
                </select>
              </div>
              <input
                className="w-full bg-transparent text-gray-200 border-0 border-b border-neutral-800 rounded-none px-0 py-3 focus:outline-none focus:ring-0 placeholder-gray-400"
                placeholder={t('secret')}
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
                {t('secret_base64_encoded')}
              </label>
              <div className="mt-2 mb-2">
                <div className="text-gray-400 text-sm mb-1">{t('payload')}</div>
                <div className="border border-neutral-800 rounded  overflow-hidden">
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
                <div className="font-semibold text-gray-200 text-sm mb-1">{t('bearer')}</div>
                <div className="text-gray-400 text-sm mb-1">{t('jwt_headers')}</div>
                <div className="border border-neutral-800 rounded  overflow-hidden">
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
            <div className="w-16 h-16  rounded-full flex items-center justify-center mb-4">
              <span className="material-icons text-gray-400 text-2xl">lock_open</span>
            </div>
            <h3 className="text-gray-300 text-lg font-medium mb-2">{t('no_authorization')}</h3>
            <p className="text-gray-500 text-sm max-w-md">
              {t('no_authorization_info')}
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`w-full h-full bg-bg text-text ${themeClass} flex flex-col`}>
      {/* Fixed header */}
      <div className="sticky top-0 z-10 bg-bg border-b border-neutral-800">
        <div className="flex items-center px-4 h-12">
          <div className="flex items-center w-full">
            <div className="flex items-center gap-2">
              <span className="text-gray-300 text-sm font-medium">Authorization</span>
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-1 text-gray-200 hover:bg-neutral-800 px-3 py-1.5 rounded text-sm font-medium"
                  onClick={() => setDropdownOpen(v => !v)}
                  type="button"
                >
                  {authTypes.find(t => t.value === authType)?.label || 'Inherit'}
                  <span className="material-icons text-lg">arrow_drop_down</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute left-0 mt-1 z-50 w-56 bg-neutral-800 border border-neutral-700 rounded shadow-lg py-1">
                    {authTypes.map(type => (
                      <div
                        key={type.value}
                        className={`px-3 py-2 cursor-pointer transition-colors select-none ${authType === type.value ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-neutral-700'}`}
                        onClick={() => {
                          const newType = type.value as AuthType;
                          handleAuthTypeChange(newType);
                          setAuthConfig({ type: newType });
                          setDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          <span className="text-sm">{type.label}</span>
                          {authType === type.value && (
                            <span className="ml-auto material-icons text-sm">check</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="ml-auto flex items-center gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer select-none px-3 py-1.5 rounded hover:bg-neutral-800">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={e => setEnabled(e.target.checked)}
                  className="accent-blue-500 w-4 h-4"
                />
                <span className="text-gray-200 text-sm">{t('enabled')}</span>
              </label>
              <button 
                className="text-gray-400 hover:text-gray-200 p-1.5 rounded-full hover:bg-neutral-800" 
                title={t('help')}
              >
                <span className="material-icons text-lg">help_outline</span>
              </button>
              <button 
                className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-neutral-800" 
                title={t('delete')}
              >
                <span className="material-icons text-lg">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {enabled ? (
            <div className="p-6">
              {renderAuthFields()}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Authorization is disabled
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorizationTabContent; 