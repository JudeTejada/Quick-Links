import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  ListItem,
  notificationService,
  UnorderedList
} from '@hope-ui/solid';
import { createEffect, createSignal, For, Show } from 'solid-js';
import { HiOutlineX, HiSolidX, HiSolidXCircle } from 'solid-icons/hi';
import { useCurrentlyHeldKey } from '@solid-primitives/keyboard';
import { createSupabase } from 'solid-supabase';
import { TransitionGroup } from 'solid-transition-group';

import { useBookmark } from '../../context/BookmarkProvider';

import { LinksList } from './LinksList';
import { CreateNewCategory } from './AddNewCategory';
import { Input } from './Input';
import { CategoryPreferences } from './CategoryPreferences';

import type { BookmarkGroup } from '../../types';

export function BookmarkCategories() {
  const [categories] = useBookmark();

  return (
    <UnorderedList mb={'$8'} css={{ listStyle: 'none' }} ml={0}>
      <TransitionGroup name='bookmark-item'>
        <For each={categories}>
          {cat => (
            <List
              title={cat.title}
              links={cat.links}
              category_id={cat.category_id}
            />
          )}
        </For>
      </TransitionGroup>

      <CreateNewCategory />
    </UnorderedList>
  );
}

const List = (props: BookmarkGroup) => {
  const [isEditing, setIsEditing] = createSignal(false);
  const [linksIsEditing, setIsLinksEditing] = createSignal(false);
  const [inputElm, setInputElm] = createSignal<HTMLInputElement>();
  const key = useCurrentlyHeldKey();

  const supabase = createSupabase();

  createEffect(() => {
    console.log(props.category_id);
    if (!props.links?.length && linksIsEditing()) setIsLinksEditing(false);
  });

  createEffect(() => {
    inputElm()?.focus();
  });

  createEffect(() => {
    if (key() === 'ESCAPE' && inputElm()) return setIsEditing(false);
    if (key() === 'ESCAPE' && linksIsEditing()) return setIsLinksEditing(false);
  });

  const handleInputEnter = async (text: string) => {
    const { data, error } = await supabase
      .from('bookmarks')
      .update({ title: text })
      .match({ category_id: props.category_id })
      .select();

    if (error)
      return notificationService.show({
        status: 'danger',
        title: 'Error!',
        description: 'failed to edit existing category title'
      });

    if (data) return setIsEditing(false);
  };

  return (
    <ListItem
      position='relative'
      className='bookmark-item'
      outline={linksIsEditing() ? '2px solid  $primary10' : 'none'}
      mb='$4'
      p='$2_5'
      borderRadius='$sm'
    >
      <HStack gap='$4' mb={'$4'}>
        <Show
          when={!isEditing()}
          fallback={
            <Flex gap='$4'>
              <Input
                ref={setInputElm}
                text={props.title}
                errorText='please enter a category'
                type='category'
                onSuccessHandler={handleInputEnter}
              />
              <IconButton
                aria-label='close-icon'
                onClick={() => setIsEditing(false)}
                icon={<HiOutlineX />}
              />
            </Flex>
          }
        >
          <Heading size='3xl'>{props.title}</Heading>
          <CategoryPreferences
            islinksEditing={linksIsEditing}
            links={props.links}
            onToggleEditText={setIsEditing}
            onToggleLinksEdit={setIsLinksEditing}
            categoryId={props.category_id}
            categoryTitle={props.title}
          />
        </Show>
      </HStack>
      <LinksList
        list={props.links}
        categoryId={props.category_id}
        isLinksEditing={linksIsEditing}
      />

      <Show when={linksIsEditing()}>
        <Box
          cursor='pointer'
          position='absolute'
          right='-13px'
          top='-18px'
          zIndex='40px'
          onClick={() => setIsLinksEditing(false)}
        >
          <IconButton
            icon={<HiSolidX size='25px' color='white' />}
            bg='#369EFF'
            aria-label='close-icon'
            maxW={25}
            maxH={25}
            borderRadius='$full'
          />
        </Box>
      </Show>
    </ListItem>
  );
};
