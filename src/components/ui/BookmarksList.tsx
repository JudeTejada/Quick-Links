import { Button, Image, List, ListItem } from '@hope-ui/solid';
import { Link } from 'solid-app-router';
import { For } from 'solid-js';

import type { Bookmark } from '../../types';

interface BookmarksListProps {
  list: Bookmark[];
}

function BookmarksList(props: BookmarksListProps) {
  return (
    <>
      <List mb={'$6'} display='flex' gap={'$2'} alignItems='center'>
        <For each={props.list}>
          {(bookmark, i) => (
            <ListItem>
              <Link href={bookmark.url}>
                <Image
                  boxSize='24px'
                  src={bookmark.image}
                  alt={bookmark.url}
                  objectFit='cover'
                />
              </Link>
            </ListItem>
          )}
        </For>
        <ListItem>
          <Button size={'xs'}>New</Button>
        </ListItem>
      </List>
    </>
  );
}

export { BookmarksList };
