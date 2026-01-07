import { useState, useEffect } from 'react';

const STORAGE_KEY = 'bourbon-vault-compare';
const MAX_COMPARE = 4;

export function useCompare() {
  const [compareList, setCompareList] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (bourbonId: string) => {
    if (compareList.length >= MAX_COMPARE) return false;
    if (compareList.includes(bourbonId)) return false;
    setCompareList(prev => [...prev, bourbonId]);
    return true;
  };

  const removeFromCompare = (bourbonId: string) => {
    setCompareList(prev => prev.filter(id => id !== bourbonId));
  };

  const toggleCompare = (bourbonId: string) => {
    if (compareList.includes(bourbonId)) {
      removeFromCompare(bourbonId);
      return false;
    } else {
      return addToCompare(bourbonId);
    }
  };

  const isInCompare = (bourbonId: string) => compareList.includes(bourbonId);

  const clearCompare = () => setCompareList([]);

  const canAddMore = compareList.length < MAX_COMPARE;

  return { 
    compareList, 
    addToCompare, 
    removeFromCompare, 
    toggleCompare, 
    isInCompare, 
    clearCompare,
    canAddMore,
    compareCount: compareList.length 
  };
}
