// File: utils/helpers.ts
// Type: Utility/Helper Functions
// Imports: (none)
// Imported by: Various files across the project
// Role: Contains utility functions used throughout the project.
// Located at: src/utils/helpers.ts

// Utility/helper functions for the app

export const uuidv4 = () => '_' + Math.random().toString(36).substr(2, 9); 

export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

/**
 * Validates a URL string for required fields:
 * - Protocol (http:// or https://)
 * - Domain name
 * - Complete URL structure
 * @param url The URL string to validate
 * @returns true if URL is valid, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    // Check if protocol is http or https
    const validProtocols = ['http:', 'https:'];
    if (!validProtocols.includes(urlObj.protocol)) {
      return false;
    }
    // Check if domain is present
    if (!urlObj.hostname) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};