import { RealtimeSubscription } from '@supabase/supabase-js';
import {
  createContext,
  createEffect,
  createResource,
  onCleanup,
  onMount,
  ParentComponent,
  useContext
} from 'solid-js';
import { createStore } from 'solid-js/store';
import { createSupabase } from 'solid-supabase';

import type { Bookmark, BookmarkGroup, CategoriesBookmark } from '../types';

const BookmarkContext = createContext<CategoriesBookmark>();

export const useBookmark = () => useContext(BookmarkContext)!;
const getTodos = async () => {
  const supabase = createSupabase();
  const { data, error } = await supabase.from<CategoriesBookmark>('category')
    .select(`
      id, title,
      bookmarks (
       category_id,
       url,
       id
      )
      `);

  if (error) {
    throw error;
  }

  return data;
};

export const BookmarkProvider: ParentComponent = props => {
  const supabase = createSupabase();
  const [categories, setCategories] = createStore<CategoriesBookmark>([]);
  const [data] = createResource(getTodos);

  createEffect(() => {
    const returnedValue = data();
    if (returnedValue) {
      setCategories(returnedValue);
    }
  });
  let categoriesSubscription: RealtimeSubscription | null;
  let bookmarkSubscription: RealtimeSubscription | null;

  onMount(() => {
    categoriesSubscription = supabase
      .from<BookmarkGroup>('category')
      .on('*', payload => {
        switch (payload.eventType) {
          case 'INSERT':
            console.log('payload.new', payload.new);
            setCategories([...categories, payload.new]);
            break;
          case 'UPDATE':
            setCategories(
              category => category.id === payload.new.id,
              payload.new
            );
            break;
          case 'DELETE':
            setCategories(state =>
              state.filter(category => category.id !== payload.old.id)
            );

            break;
        }
      })
      .subscribe();

    bookmarkSubscription = supabase
      .from<Bookmark>('bookmarks')
      .on('*', payload => {
        switch (payload.eventType) {
          case 'INSERT':
            {
              const { category_id } = payload.new;
              setCategories(
                category => category.id === category_id,
                'bookmarks',
                // @ts-ignore
                bookmarks => [...bookmarks, { ...payload.new }]
              );
            }
            break;
          // case 'UPDATE':
          //   setTodos(item => item.id === payload.new.id, payload.new);
          //   break;
          // case 'DELETE':
          //   setTodos(prev => prev.filter(item => item.id != payload.old.id));
          //   break;
        }
      })
      .subscribe();
  });

  onCleanup(() => {
    categoriesSubscription?.unsubscribe();
    bookmarkSubscription?.unsubscribe();
  });

  return (
    <BookmarkContext.Provider value={categories}>
      {props.children}
    </BookmarkContext.Provider>
  );
};
