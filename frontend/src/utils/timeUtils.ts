// Utility functions for time formatting and grouping history by time

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export const getTimeAgo = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);
  const diff = Math.floor((now.getTime() - created.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export const formatTime = (time: string): string => {
  const date = new Date(time);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};

export const groupHistoryByTime = (history: any[]): { [key: string]: any[] } => {
  return history.reduce((groups: { [key: string]: any[] }, item) => {
    const date = formatDate(item.created_at);
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
    return groups;
  }, {});
};
