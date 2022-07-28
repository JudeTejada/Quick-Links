import { Heading, ListItem, UnorderedList } from '@hope-ui/solid';
import { ErrorBoundary, For } from 'solid-js';
import { useBookmark } from '../../context/BookmarkProvider';
import { BookmarkLoader } from './BookmarkLoader';

import { BookmarksList } from './BookmarksList';
import { CreateNewCategory } from './AddNewCategory';
import { ErrorText } from './ErrorText';

function BookmarkCategories() {
  const categories = useBookmark();

  return (
    <ErrorBoundary fallback={<ErrorText text='something went wrong, sorry.' />}>
      <UnorderedList mb={'$8'}>
        <For each={categories} fallback={BookmarkLoader}>
          {(cat, i) => (
            <ListItem>
              <Heading mb={'$1_5'} size='2xl'>
                {cat.title}
              </Heading>
              <BookmarksList list={cat.bookmarks} categoryId={cat.id} />
            </ListItem>
          )}
        </For>
        <CreateNewCategory />
      </UnorderedList>
    </ErrorBoundary>
  );
}

export { BookmarkCategories };
