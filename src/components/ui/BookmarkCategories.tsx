import {
  Flex,
  Heading,
  HStack,
  IconButton,
  ListItem,
  notificationService,
  UnorderedList
} from '@hope-ui/solid';
import { createEffect, createMemo, createSignal, For, Show } from 'solid-js';
import { useBookmark } from '../../context/BookmarkProvider';
import { HiOutlineX } from 'solid-icons/hi';
import { LinksList } from './LinksList';
import { CreateNewCategory } from './AddNewCategory';
import { CategoryPreferences } from './CategoryPreferences';
import { BookmarkGroup } from '../../types';
import { Input } from './Input';
import { useCurrentlyHeldKey } from '@solid-primitives/keyboard';
import { createSupabase } from 'solid-supabase';
import { TransitionGroup } from 'solid-transition-group';

export function BookmarkCategories() {
  const [categories] = useBookmark();

  return (
    <UnorderedList mb={'$8'} css={{ listStyle: 'none' }} ml={0}>
      <TransitionGroup name='bookmark-item'>
        <For each={categories}>
          {(cat, i) => (
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
    console.log(props.links);
  });

  createEffect(() => {
    if (!props.links?.length && linksIsEditing()) setIsLinksEditing(false);
  });

  createEffect(() => {
    inputElm()?.focus();
  });

  createEffect(() => {
    if (key() === 'ESCAPE' && inputElm()) return setIsEditing(false);
  });

  const handleInputEnter = async (text: string) => {
    const { data, error } = await supabase
      .from('bookmarks')
      .update({ title: text })
      .eq('id', props.category_id);

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
    </ListItem>
  );
};
