import { Heading, ListItem, UnorderedList } from '@hope-ui/solid';
import { createEffect, For } from 'solid-js';
import { categoriesStore, useBookmark } from '../../context/BookmarkProvider';

import { BookmarksList } from './BookmarksList';
import { CreateNewCategory } from './CreateNewCategory';

function BookmarkCategories() {
  const [categories] = useBookmark();

  return (
    <>
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
    </>
  );
}

export { BookmarkCategories };
