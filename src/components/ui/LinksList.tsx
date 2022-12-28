import { Image, List, ListItem } from '@hope-ui/solid';
import { Link } from 'solid-app-router';
import { createEffect, createSignal, For } from 'solid-js';

import type { Bookmark } from '../../types';
import { removeHttp } from '../../util';
import { CreateBookmark } from './AddNewBookmark';

interface LinkListProps {
  list: Bookmark[];
  categoryId: string;
}

function LinksList(props: LinkListProps) {
  const [isImageError, setIsImageError] = createSignal(false);

  createEffect(() => {
    console.log(isImageError(), 'isImageError');
  });
  return (
    <List mb={'$6'} display='flex' gap={'$2'} alignItems='center' flexWrap='wrap'>
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
                onError={() => setIsImageError(true)}
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

export { LinksList };
