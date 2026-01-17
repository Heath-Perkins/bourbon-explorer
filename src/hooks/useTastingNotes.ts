import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type TastingNote = Tables<'tasting_notes'>;
export type TastingNoteInsert = TablesInsert<'tasting_notes'>;

export function useTastingNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<TastingNote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasting_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('tasted_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching tasting notes:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = async (note: Omit<TastingNoteInsert, 'user_id'>) => {
    if (!user) {
      toast.error('Please sign in to save tasting notes');
      return { error: new Error('Not authenticated') };
    }

    try {
      const { data, error } = await supabase
        .from('tasting_notes')
        .insert({ ...note, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      
      setNotes(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error adding tasting note:', error);
      toast.error('Failed to save tasting note');
      return { error };
    }
  };

  const updateNote = async (id: string, updates: Partial<TastingNote>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { data, error } = await supabase
        .from('tasting_notes')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setNotes(prev => prev.map(n => n.id === id ? data : n));
      return { data, error: null };
    } catch (error) {
      console.error('Error updating tasting note:', error);
      return { error };
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Optimistic update
    const previousNotes = notes;
    setNotes(prev => prev.filter(n => n.id !== id));

    try {
      const { error } = await supabase
        .from('tasting_notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        setNotes(previousNotes);
        throw error;
      }
      
      toast.success('Tasting note deleted');
      return { error: null };
    } catch (error) {
      console.error('Error deleting tasting note:', error);
      toast.error('Failed to delete tasting note');
      return { error };
    }
  };

  return { notes, loading, addNote, updateNote, deleteNote, refetch: fetchNotes };
}
