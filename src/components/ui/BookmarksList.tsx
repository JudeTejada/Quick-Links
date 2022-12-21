import { Image, List, ListItem } from '@hope-ui/solid';
import { Link } from 'solid-app-router';
import { For } from 'solid-js';

import type { Bookmark } from '../../types';
import { removeHttp } from '../../util';
import { CreateBookmark } from './AddNewBookmark';

interface BookmarksListProps {
  list: Bookmark[];
  categoryId: string;
}

function BookmarksList(props: BookmarksListProps) {
  return (
    <List mb={'$6'} display='flex' gap={'$2'} alignItems='center'>
      <For each={props.list}>
        {(bookmark, i) => (
          <ListItem>
            <a href={bookmark.url} target='_blank'>
              <Image
                borderRadius={'$full'}
                boxSize='24px'
                src={`https://icon.horse/icon/${removeHttp(bookmark.url)}`}
                alt={bookmark.url}
                objectFit='cover'
              />
            </a>
          </ListItem>
        )}
      </For>
      <ListItem>
        <CreateBookmark categoryId={props.categoryId} />
      </ListItem>
    </List>
  );
}

export { BookmarksList };
