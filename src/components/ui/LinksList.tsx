import {
  Box,
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
  onMount,
  Show
} from 'solid-js';
import { HiSolidXCircle } from 'solid-icons/hi';
import type { Bookmark } from '../../types';
import { removeHttp } from '../../util';
import { CreateBookmark } from './AddNewBookmark';
import { createSupabase } from 'solid-supabase';
import { useBookmark } from '../../context/BookmarkProvider';
import { TransitionGroup } from 'solid-transition-group';

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
    <ListItem position='relative' className='list-item'>
      <a href={props.url} target='_blank'>
        <Show when={props.isLinksEditing()}>
          <Box
            position='absolute'
            right='-5px'
            top='-5px'
            zIndex='40'
            onClick={(e: any) => {
              e.stopPropagation();
              e.preventDefault();
              handleDeleteLink(props.id);
            }}
          >
            <HiSolidXCircle color='red' size={20} />
          </Box>
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
      </a>
    </ListItem>
  );
}

export { LinksList };
