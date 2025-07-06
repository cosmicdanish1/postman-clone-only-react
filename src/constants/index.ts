// Content type options for Body tab
export const contentTypeOptions = [
  { label: 'None', value: 'none' },
  { label: 'Text', value: 'text', isSection: true },
  { label: 'application/json', value: 'application/json' },
  { label: 'application/ld+json', value: 'application/ld+json' },
  { label: 'application/hal+json', value: 'application/hal+json' },
  { label: 'application/vnd.api+json', value: 'application/vnd.api+json' },
  { label: 'application/xml', value: 'application/xml' },
  { label: 'text/xml', value: 'text/xml' },
  { label: 'Structured', value: 'structured', isSection: true },
  { label: 'application/x-www-form-urlencoded', value: 'application/x-www-form-urlencoded' },
  { label: 'multipart/form-data', value: 'multipart/form-data' },
  { label: 'Binary', value: 'binary', isSection: true },
  { label: 'application/octet-stream', value: 'application/octet-stream' },
  { label: 'Others', value: 'others', isSection: true },
  { label: 'text/html', value: 'text/html' },
  { label: 'text/plain', value: 'text/plain' },
];

export const METHODS = [
  'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'CONNECT', 'TRACE', 'CUSTOM'
]; 