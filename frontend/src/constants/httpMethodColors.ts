// Centralized HTTP method color mapping for all UI components
// Use this everywhere you need method color (tabs, dropdown, etc.)

const HTTP_METHOD_COLORS: Record<string, string> = {
  GET: '#10B981',      // green-500
  POST: '#3B82F6',     // blue-500
  PUT: '#F59E0B',      // yellow-500
  PATCH: '#8B5CF6',    // purple-500
  DELETE: '#EF4444',   // red-500
  HEAD: '#EC4899',     // pink-500
  OPTIONS: '#6366F1',  // indigo-500
  CONNECT: '#737373',  // gray-500
  TRACE: '#737373',    // gray-500
  CUSTOM: '#737373',   // gray-500
};

export default HTTP_METHOD_COLORS;
