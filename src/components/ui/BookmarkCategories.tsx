import { Heading, ListItem, UnorderedList } from '@hope-ui/solid';
import { For } from 'solid-js';
import { createStore } from 'solid-js/store';

import { type Bookmarks } from '../../types';
import { BookmarksList } from './BookmarksList';

function BookmarkCategories() {
  const [categories, setCategories] = createStore<Bookmarks>([
    {
      title: 'Social',
      bookmarks: [
        {
          url: 'http://google.com/',
          image:
            'https://fdn.superdense.com/google.com/favicon.png?w=44&v=1658078777011'
        },
        {
          url: 'http://google.com/',
          image:
            'https://fdn.superdense.com/google.com/favicon.png?w=44&v=1658078777011'
        }
      ]
    },

    {
      title: 'Personal',
      bookmarks: [
        {
          url: 'http://google.com/',
          image:
            'https://fdn.superdense.com/google.com/favicon.png?w=44&v=1658078777011'
        }
      ]
    }
  ]);

  return (
    <UnorderedList mb={'$8'}>
      <For each={categories}>
        {(cat, i) => (
          <ListItem>
            <Heading mb={'$1_5'} size='2xl'>
              {cat.title}
            </Heading>
            <BookmarksList list={cat.bookmarks} />
          </ListItem>
        )}
      </For>
    </UnorderedList>
  );
}

export { BookmarkCategories };
