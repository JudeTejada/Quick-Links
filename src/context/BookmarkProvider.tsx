import { Box, Text } from '@hope-ui/solid';
import { type RealtimeChannel } from '@supabase/supabase-js';
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
  let categoriesSubscription: RealtimeChannel | null;
  let bookmarkSubscription: RealtimeChannel | null;

  onMount(() => {
    categoriesSubscription = supabase
      .channel('public:bookmarks')
      .on<BookmarkGroup>(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookmarks' },
        payload => {
          switch (payload.eventType) {
            case 'INSERT':
              setCategories([...categories, payload.new]);
              break;
            case 'UPDATE':
              setCategories(
                category => category.category_id === payload.new.category_id,
                payload.new
              );
              break;
            case 'DELETE': {
              setCategories(state =>
                state.filter(
                  category => category.category_id !== payload.old.category_id
                )
              );

              break;
            }
          }
        }
      )
      .subscribe();

    categoriesSubscription = supabase
      .channel('public:links')
      .on<Bookmark>(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'links' },
        payload => {
          switch (payload.eventType) {
            case 'INSERT': {
              const { category_id } = payload.new;
              setCategories(
                category => category.category_id === category_id,
                'links',
                links => [...links, { ...payload.new }]
              );
            }
          }
        }
      )
      .subscribe();
  });

  onCleanup(() => {
    categoriesSubscription?.unsubscribe();
    bookmarkSubscription?.unsubscribe();
  });

  return (
    <BookmarkContext.Provider value={[categories, setCategories]}>
      <ErrorBoundary
        fallback={
          <Box bg='$danger4' p='$2'>
            <Text>
              Uh oh! It looks like you've stumbled upon an unforeseen issue.{' '}
            </Text>
          </Box>
        }
      >
        <Show when={!data.loading} fallback={<BookmarkLoader />}>
          {props.children}
        </Show>
      </ErrorBoundary>
    </BookmarkContext.Provider>
  );
};
