const FAVORITES_KEY = 'postman_history_favorites';

export const getFavorites = (): Set<number> => {
  if (typeof window === 'undefined') return new Set();
  
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    if (favorites) {
      return new Set(JSON.parse(favorites));
    }
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
  }
  
  return new Set();
};

export const toggleFavorite = (id: number): Set<number> => {
  const favorites = getFavorites();
  
  if (favorites.has(id)) {
    favorites.delete(id);
  } else {
    favorites.add(id);
  }
  
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
  return new Set(favorites);
};

export const isFavorite = (id: number): boolean => {
  return getFavorites().has(id);
};
