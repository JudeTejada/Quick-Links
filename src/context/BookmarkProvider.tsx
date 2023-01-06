import { RealtimeSubscription } from '@supabase/supabase-js';
import {
  createContext,
  createEffect,
  createResource,
  ErrorBoundary,
  onCleanup,
  onMount,
  ParentComponent,
  Show,
  useContext
} from 'solid-js';
import { createStore, SetStoreFunction, Store } from 'solid-js/store';
import { createSupabase } from 'solid-supabase';
import { BookmarkLoader } from '../components/ui/BookmarkLoader';
import { ErrorText } from '../components/ui/ErrorText';

import type { Bookmark, BookmarkGroup, CategoriesBookmark } from '../types';

const BookmarkContext =
  createContext<
    [Store<CategoriesBookmark>, SetStoreFunction<CategoriesBookmark>]
  >();

export const useBookmark = () => useContext(BookmarkContext)!;
const getTodos = async () => {
  const supabase = createSupabase();

  const { data, error } = await supabase
    .from<CategoriesBookmark>('bookmarks')
    .select(
      `
      category_id,
      title,
      links (
       url,
       id
      )
      `
    );

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
      .from<BookmarkGroup>('bookmarks')
      .on('*', payload => {
        switch (payload.eventType) {
          case 'INSERT':
            setCategories([...categories, payload.new]);
            break;
          case 'UPDATE':
            setCategories(
              category => category.id === payload.new.id,
              payload.new
            );
            break;
          case 'DELETE': {
            const oldData = payload.old;
            setCategories(state =>
              state.filter(
                category => category.category_id !== payload.old.category_id
              )
            );

            break;
          }
        }
      })
      .subscribe();

    bookmarkSubscription = supabase
      .from<Bookmark>('links')
      .on('*', payload => {
        switch (payload.eventType) {
          case 'INSERT': {
            const { category_id } = payload.new;
            setCategories(
              category => category.category_id === category_id,
              'links',
              bookmarks => [...bookmarks, { ...payload.new }]
            );
          }
        }
      })
      .subscribe();
  });

  onCleanup(() => {
    categoriesSubscription?.unsubscribe();
    bookmarkSubscription?.unsubscribe();
  });

  return (
    <BookmarkContext.Provider value={[categories, setCategories]}>
      <ErrorBoundary
        fallback={<ErrorText text='something went wrong, sorry.' />}
      >
        <Show when={!data.loading} fallback={<BookmarkLoader />}>
          {props.children}
        </Show>
      </ErrorBoundary>
    </BookmarkContext.Provider>
  );
};
