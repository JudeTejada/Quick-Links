import { Image, List, ListItem } from '@hope-ui/solid';
import { Link } from 'solid-app-router';
import { For } from 'solid-js';
import { useBookmark } from '../../context/BookmarkProvider';

import type { Bookmark } from '../../types';
import { removeHttp } from '../../util';
import { CreateBookmark } from './CreateBookMark';

interface BookmarksListProps {
  list: Bookmark[];
  id: string;
}

function BookmarksList(props: BookmarksListProps) {
  const [, { addNewBookmark }] = useBookmark();

  const handleNewLink = (url: string) => {
    addNewBookmark({ url, id: props.id });
  };

  return (
    <>
      <List mb={'$6'} display='flex' gap={'$2'} alignItems='center'>
        <For each={props.list}>
          {(bookmark, i) => (
            <ListItem>
              <Link href={bookmark.url}>
                <Image
                  boxSize='24px'
                  src={`https://icon.horse/icon/${removeHttp(bookmark.url)}`}
                  alt={bookmark.url}
                  objectFit='cover'
                />
              </Link>
            </ListItem>
          )}
        </For>
        <ListItem>
          <CreateBookmark onAddNewLink={handleNewLink} />
        </ListItem>
      </List>
    </>
  );
}

export { BookmarksList };
