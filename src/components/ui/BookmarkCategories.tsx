import { Heading, ListItem, UnorderedList } from '@hope-ui/solid';
import { ErrorBoundary, For } from 'solid-js';
import { useBookmark } from '../../context/BookmarkProvider';

import { BookmarksList } from './BookmarksList';
import { CreateNewCategory } from './CreateNewCategory';
import { ErrorText } from './ErrorText';

function BookmarkCategories() {
  const [categories] = useBookmark();

  console.log(categories, 'categories from BookmarkCategories');

  if (!categories) return null;
  return (
    <ErrorBoundary
      fallback={
        <ErrorText text='Something went wrong!, try refreshing your browser' />
      }
    >
      <UnorderedList mb={'$8'}>
        <For each={categories}>
          {(cat, i) => (
            <ListItem>
              <Heading mb={'$1_5'} size='2xl'>
                {cat.title}
              </Heading>
              <BookmarksList list={cat.bookmarks} id={cat.id} />
            </ListItem>
          )}
        </For>
      </UnorderedList>
      <CreateNewCategory />
    </ErrorBoundary>
  );
}

export { BookmarkCategories };
