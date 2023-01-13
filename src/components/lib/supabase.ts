import { createSupabase } from 'solid-supabase';
import { CategoriesBookmark } from '../../types';

export const getTodos = async () => {
  const supabase = createSupabase();
  const { data, error } = await supabase.from<CategoriesBookmark>('category')
    .select(`
      id, title,
      bookmarks (
       category_id
      )
      `);

  if (error) {
    throw error;
  }

  return data;
};
