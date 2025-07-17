// Utility functions for time formatting and grouping history by time

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // For timestamps in the future or malformed dates
  if (diffInSeconds < 0 || isNaN(diffInSeconds)) {
    return 'just now';
  }

  // For very recent timestamps (under 1 minute)
  if (diffInSeconds < 60) {
    return diffInSeconds < 5 ? 'just now' : `${diffInSeconds} seconds ago`;
  }

  // For timestamps in the last hour
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }

  // For timestamps in the last 24 hours
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  // For timestamps in the last 7 days
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }

  // For older timestamps, show the actual date
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (time: string): string => {
  const date = new Date(time);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true,
    hourCycle: 'h12'
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Group history items by relative time periods
export const groupHistoryByTime = (history: any[]): { [key: string]: any[] } => {
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const groups: { [key: string]: any[] } = {
    'Just Now': [],
    'Last Hour': [],
    'Today': [],
    'Yesterday': [],
    'This Week': [],
    'Older': []
  };
  
  // Sort history by date (newest first)
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  for (const item of sortedHistory) {
    const itemDate = new Date(item.created_at);
    
    if (itemDate > oneMinuteAgo) {
      groups['Just Now'].push(item);
    } else if (itemDate > oneHourAgo) {
      // Calculate minutes ago for more precise grouping
      const minutesAgo = Math.floor((now.getTime() - itemDate.getTime()) / (60 * 1000));
      const groupKey = `${minutesAgo} min ago`;
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    } else if (itemDate >= today) {
      groups['Today'].push(item);
    } else if (itemDate >= yesterday) {
      groups['Yesterday'].push(item);
    } else if (itemDate >= lastWeek) {
      groups['This Week'].push(item);
    } else {
      groups['Older'].push(item);
    }
  }
  
  // Filter out empty groups
  return Object.fromEntries(
    Object.entries(groups).filter(([_, items]) => items.length > 0)
  );
};
