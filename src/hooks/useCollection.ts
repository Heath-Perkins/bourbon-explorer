import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Tables, TablesInsert, Database } from '@/integrations/supabase/types';

export type CollectionItem = Tables<'collection'>;
export type CollectionStatus = Database['public']['Enums']['collection_status'];
export type CollectionInsert = TablesInsert<'collection'>;

export function useCollection() {
  const { user } = useAuth();
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCollection = useCallback(async () => {
    if (!user) {
      setCollection([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('collection')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollection(data || []);
    } catch (error) {
      console.error('Error fetching collection:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  const addToCollection = async (item: Omit<CollectionInsert, 'user_id'>) => {
    if (!user) {
      toast.error('Please sign in to manage your collection');
      return { error: new Error('Not authenticated') };
    }

    try {
      const { data, error } = await supabase
        .from('collection')
        .insert({ ...item, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      
      setCollection(prev => [data, ...prev]);
      toast.success('Added to collection!');
      return { data, error: null };
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('Already in your collection');
      } else {
        console.error('Error adding to collection:', error);
        toast.error('Failed to add to collection');
      }
      return { error };
    }
  };

  const updateCollectionItem = async (id: string, updates: Partial<CollectionItem>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { data, error } = await supabase
        .from('collection')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setCollection(prev => prev.map(c => c.id === id ? data : c));
      return { data, error: null };
    } catch (error) {
      console.error('Error updating collection item:', error);
      return { error };
    }
  };

  const removeFromCollection = async (id: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const previousCollection = collection;
    setCollection(prev => prev.filter(c => c.id !== id));

    try {
      const { error } = await supabase
        .from('collection')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        setCollection(previousCollection);
        throw error;
      }
      
      toast.success('Removed from collection');
      return { error: null };
    } catch (error) {
      console.error('Error removing from collection:', error);
      toast.error('Failed to remove from collection');
      return { error };
    }
  };

  const getByBourbonId = (bourbonId: string) => 
    collection.find(c => c.bourbon_id === bourbonId);

  const isInCollection = (bourbonId: string) => 
    collection.some(c => c.bourbon_id === bourbonId);

  return { 
    collection, 
    loading, 
    addToCollection, 
    updateCollectionItem, 
    removeFromCollection,
    getByBourbonId,
    isInCollection,
    refetch: fetchCollection 
  };
}
