import {
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  ListItem,
  notificationService,
  UnorderedList
} from '@hope-ui/solid';
import { createEffect, createSignal, For, Show } from 'solid-js';
import { useBookmark } from '../../context/BookmarkProvider';
import { HiOutlineX } from 'solid-icons/hi';
import { LinksList } from './LinksList';
import { CreateNewCategory } from './AddNewCategory';
import { CategoryPreferences } from './CategoryPreferences';
import { BookmarkGroup } from '../../types';
import { Input } from './Input';
import { useCurrentlyHeldKey } from '@solid-primitives/keyboard';
import { createSupabase } from 'solid-supabase';

export function BookmarkCategories() {
  const categories = useBookmark();

  return (
    <UnorderedList mb={'$8'}>
      <For each={categories}>
        {(cat, i) => (
          <List title={cat.title} links={cat.links} id={cat.category_id} />
        )}
      </For>
      <CreateNewCategory />
    </UnorderedList>
  );
}

const List = (props: BookmarkGroup) => {
  const [isEditing, setIsEditing] = createSignal(false);
  const [isFocused, setIsFocused] = createSignal(false);
  const [inputElm, setInputElm] = createSignal<HTMLInputElement>();

  const supabase = createSupabase();

  createEffect(() => {
    inputElm()?.focus();
  });

  const key = useCurrentlyHeldKey();

  createEffect(() => {
    if (key() === 'ESCAPE' && inputElm()) return setIsEditing(false);
  });

  const handleInputEnter = async (text: string) => {
    const { data, error } = await supabase
      .from('bookmarks')
      .update({ title: text })
      .eq('id', props.id);

    if (error)
      return notificationService.show({
        status: 'danger',
        title: 'Error!',
        description: 'failed to edit existing category title'
      });

    if (data) return setIsEditing(false);
  };

  return (
    <ListItem>
      <HStack gap='$4' mb={'$1_5'}>
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
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />

              <IconButton
                aria-label='close-icon'
                onClick={() => setIsEditing(false)}
                icon={<HiOutlineX />}
              />
            </Flex>
          }
        >
          <Heading size='2xl'>{props.title}</Heading>
          <CategoryPreferences
            onToggleEditText={setIsEditing}
            categoryId={props.id}
            categoryTitle={props.title}
          />
        </Show>
      </HStack>
      <LinksList list={props.links} categoryId={props.id} />
    </ListItem>
  );
};
