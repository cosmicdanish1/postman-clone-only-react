import { format, startOfDay, startOfWeek, startOfMonth, startOfYear } from 'date-fns';

export const getTimeAgo = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);
  const diff = now.getTime() - created.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 30) return 'Just now';
  if (seconds < 60) return '1 minute ago';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 2) return 'Yesterday';
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

export const formatTime = (time: string): string => {
  return format(new Date(time), 'h:mm a');
};

export const formatDate = (date: string): string => {
  return format(new Date(date), 'MMM d, yyyy');
};

export const groupHistoryByTime = (history: HistoryItem[]): {
  [key: string]: HistoryItem[];
} => {
  const grouped: { [key: string]: HistoryItem[] } = {};
  
  history.forEach(item => {
    const created = new Date(item.created_at);
    const now = new Date();
    const diff = now.getTime() - created.getTime();
    
    let groupKey = '';
    
    if (diff < 3600000) { // 1 hour
      groupKey = 'Just now';
    } else if (diff < 86400000) { // 24 hours
      const hours = Math.floor(diff / 3600000);
      groupKey = `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diff < 172800000) { // 48 hours
      groupKey = 'Yesterday';
    } else {
      const days = Math.floor(diff / 86400000);
      groupKey = `${days} day${days > 1 ? 's' : ''} ago`;
    }
    
    if (!grouped[groupKey]) {
      grouped[groupKey] = [];
    }
    grouped[groupKey].push(item);
  });
  
  return grouped;
};
