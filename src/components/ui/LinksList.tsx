import {
  Anchor,
  Box,
  IconButton,
  Image as HopeUiImage,
  List,
  ListItem,
  Text
} from '@hope-ui/solid';
import {
  Accessor,
  createRenderEffect,
  createSignal,
  For,
  Show
} from 'solid-js';
import { HiSolidX, HiSolidXCircle } from 'solid-icons/hi';
import type { Bookmark } from '../../types';
import { removeHttp } from '../../util';
import { CreateBookmark } from './AddNewBookmark';
import { createSupabase } from 'solid-supabase';
import { useBookmark } from '../../context/BookmarkProvider';
import { TransitionGroup } from 'solid-transition-group';

import { Icon } from '@hope-ui/solid';

interface LinkListProps {
  list: Bookmark[];
  categoryId: number;
  isLinksEditing: Accessor<Boolean>;
}

function LinksList(props: LinkListProps) {
  return (
    <List
      display='flex'
      gap={'$2'}
      alignItems='center'
      flexWrap='wrap'
      rowGap='$4'
    >
      <TransitionGroup name='list-item'>
        <For each={props.list}>
          {(bookmark, i) => (
            // @ts-ignore
            <BookmarkLink
              id={bookmark.id}
              url={bookmark.url}
              category_id={props.categoryId}
              isLinksEditing={props.isLinksEditing}
            />
          )}
        </For>
      </TransitionGroup>

      {!props.isLinksEditing() && (
        <ListItem>
          <CreateBookmark categoryId={props.categoryId} />
        </ListItem>
      )}
    </List>
  );
}

interface BookmarkLink extends Bookmark {
  isLinksEditing: Accessor<Boolean>;
}

function BookmarkLink(props: BookmarkLink) {
  const supabase = createSupabase();

  const [imageError, setImageError] = createSignal(false);

  const [_, setCategories] = useBookmark();

  createRenderEffect(() => {
    const img = new Image();
    img.onload = () => {};
    img.onerror = () => setImageError(true);
  });

  const handleDeleteLink = async (linkId: string) => {
    const { data, error } = await supabase
      .from('links')
      .delete()
      .match({ id: linkId });

    if (data) {
      setCategories(
        category => category.category_id === props.category_id,
        'links',
        bookmarks => bookmarks.filter(link => link.id !== linkId)
      );
    }
    if (error) {
      console.log(error);
    }
  };

  return (
    <ListItem
      as={Anchor}
      href={props.url}
      target='_blank'
      external
      position='relative'
      className='list-item'
      borderRadius='$full'
    >
      <Show when={props.isLinksEditing()}>
        <IconButton
          maxW={16}
          maxH={16}
          aria-label='Delete current link'
          icon={<HiSolidX size={16} />}
          colorScheme='danger'
          pos='absolute'
          right='-5px'
          top='-5px'
          zIndex={10}
          borderRadius='$full'
          onClick={(e: any) => {
            e.stopPropagation();
            e.preventDefault();
            handleDeleteLink(props.id);
          }}
        />
      </Show>
      <Show
        when={!imageError()}
        fallback={
          <Box
            boxSize='24px'
            borderRadius='$full'
            display='grid'
            placeItems='center'
            color='white'
            bg='#000'
          >
            <Text fontSize={10}>404</Text>
          </Box>
        }
      >
        <HopeUiImage
          position='relative'
          zIndex='5'
          borderRadius={'$full'}
          boxSize={props.isLinksEditing() ? '34px' : '24px'}
          src={`https://icon.horse/icon/${removeHttp(props.url)}`}
          alt={props.url}
          objectFit='cover'
        />
      </Show>
    </ListItem>
    // </ListItem>
  );
}

export { LinksList };
