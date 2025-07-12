import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enDownload from './locales/en/download.json';

// Base English translations
const enTranslations = {
  settings: "Settings",
  general: "General",
  theme: "Theme",
  interceptor: "Interceptor",
  language: "Language",
  query_parameters_encoding: "Query Parameters Encoding",
  query_parameters_encoding_desc: "Configure encoding for query parameters in requests",
  experiments: "Experiments",
  experiments_desc: "This is a collection of experiments we're working on that might turn out to be useful, fun, both, or neither. They're not final and may not be stable, so if something overly weird happens, don't panic. Just turn the dang thing off. Jokes aside, Contact us.",
  telemetry: "Telemetry",
  confirm: "Confirm",
  telemetry_optout_desc: "Are you sure you want to opt out of telemetry? Telemetry helps us personalize our operations and provide you with the best experience.",
  yes: "Yes",
  no: "No",
  no_results: "No results",
  save: "Save",
  cancel: "Cancel",
  app_name: "Postman",
  search_and_commands: "Search and commands...",
  save_workspace: "Save My Workspace",
  login: "Log in",
  rest: "REST",
  graphql: "GraphQL",
  realtime: "Realtime",
  global: "Global",
  environment: "Environment",
  close_tab: "Close tab",
  query_parameters: "Query Parameters",
  help: "Help",
  delete: "Delete",
  edit: "Edit",
  add: "Add",
  key: "Key",
  value: "Value",
  description: "Description",
  content_type: "Content Type",
  none: "None",
  override: "Override",
  raw_request_body: "Raw request body",
  format: "Format",
  request_headers: "Request Headers",
  auth_inherit: "Inherit",
  auth_none: "None",
  auth_basic: "Basic Auth",
  auth_digest: "Digest Auth",
  auth_bearer: "Bearer Token",
  auth_oauth2: "OAuth 2.0",
  auth_apikey: "API Key",
  auth_aws: "AWS Signature",
  auth_hawk: "Hawk",
  auth_jwt: "JWT",
  auth_save_inherit: "Please save this request in any collection to inherit authorization",
  auth_header_generated: "The authorization header will be automatically generated when you send the request.",
  learn_how: "Learn how",
  token: "Token",
  username: "Username",
  password: "Password",
  pre_request_script: "Pre-request Script",
  pre_request_info: "Pre-request scripts are written in JavaScript and are run before the request is sent.",
  read_documentation: "Read documentation",
  snippets: "Snippets",
  snippet_env_set: "Environment: Set an environment variable",
  snippet_req_set: "Request: Set a request header",
  snippet_resp_set: "Response: Set variable from response",
  snippet_console_log: "Console: Log to console",
  request_variables: "Request Variables",
  variable_1: "Variable 1",
  value_1: "Value 1",
  script_placeholder: "// Write your {{label}} here...",
  scripting_not_implemented: "Scripting is not yet implemented.",
  
  // Search translations
  search: {
    all: "All",
    requests: "Requests",
    collections: "Collections",
    environments: "Environments",
    documentation: "Documentation",
    search_and_commands: "Search and commands...",
    placeholder: "Search requests, collections, and more...",
    recent_searches: "Recent searches",
    no_results: "No results found",
    tip: "Press Esc to close"
  },
  
  // Download translations
  download: enDownload.download
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
