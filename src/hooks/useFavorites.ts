import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('bourbon_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data?.map(f => f.bourbon_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = async (bourbonId: string) => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }

    // Optimistic update
    setFavorites(prev => [...new Set([...prev, bourbonId])]);

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({ bourbon_id: bourbonId, user_id: user.id });

      if (error) {
        // Revert on error
        setFavorites(prev => prev.filter(id => id !== bourbonId));
        throw error;
      }
    } catch (error: any) {
      if (error.code === '23505') {
        // Already exists, ignore
      } else {
        console.error('Error adding favorite:', error);
        toast.error('Failed to add favorite');
      }
    }
  };

  const removeFavorite = async (bourbonId: string) => {
    if (!user) return;

    // Optimistic update
    setFavorites(prev => prev.filter(id => id !== bourbonId));

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('bourbon_id', bourbonId)
        .eq('user_id', user.id);

      if (error) {
        // Revert on error
        setFavorites(prev => [...prev, bourbonId]);
        throw error;
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
  };

  const toggleFavorite = (bourbonId: string) => {
    if (favorites.includes(bourbonId)) {
      removeFavorite(bourbonId);
    } else {
      addFavorite(bourbonId);
    }
  };

  const isFavorite = (bourbonId: string) => favorites.includes(bourbonId);

  return { favorites, loading, addFavorite, removeFavorite, toggleFavorite, isFavorite };
}
