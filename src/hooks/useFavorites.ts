import { useState, useEffect } from 'react';

const STORAGE_KEY = 'bourbon-vault-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (bourbonId: string) => {
    setFavorites(prev => [...new Set([...prev, bourbonId])]);
  };

  const removeFavorite = (bourbonId: string) => {
    setFavorites(prev => prev.filter(id => id !== bourbonId));
  };

  const toggleFavorite = (bourbonId: string) => {
    if (favorites.includes(bourbonId)) {
      removeFavorite(bourbonId);
    } else {
      addFavorite(bourbonId);
    }
  };

  const isFavorite = (bourbonId: string) => favorites.includes(bourbonId);

  return { favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite };
}
