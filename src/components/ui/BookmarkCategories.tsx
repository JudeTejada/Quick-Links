import {
  Button,
  Heading,
  HStack,
  IconButton,
  ListItem,
  notificationService,
  UnorderedList
} from '@hope-ui/solid';
import { createEffect, createSignal, For, Show } from 'solid-js';
import { useBookmark } from '../../context/BookmarkProvider';
import { BookmarkLoader } from './BookmarkLoader';
import { HiOutlineX } from 'solid-icons/hi';
import { BookmarksList } from './BookmarksList';
import { CreateNewCategory } from './AddNewCategory';
import { ErrorText } from './ErrorText';
import { CategoryPreferences } from './CategoryPreferences';
import { BookmarkGroup } from '../../types';
import { Input } from './Input';
import { createSupabase } from 'solid-supabase';

export function BookmarkCategories() {
  const categories = useBookmark();

  console.log('test commit')
  return (
    <UnorderedList mb={'$8'}>
      <For each={categories}>
        {(cat, i) => (
          <List title={cat.title} bookmarks={cat.bookmarks} id={cat.id} />
        )}
      </For>
      <CreateNewCategory />
    </UnorderedList>
  );
}

const List = (props: BookmarkGroup) => {
  const [isEditing, setIsEditing] = createSignal(false);
  const [inputElm, setInputElm] = createSignal<HTMLInputElement>();

  const supabase = createSupabase();

  createEffect(() => {
    console.log(inputElm()?.focus());
  });

  const handleInputEnter = async (text: string) => {
    const { data, error } = await supabase
      .from('category')
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
            <>
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
            </>
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
      <BookmarksList list={props.bookmarks} categoryId={props.id} />
    </ListItem>
  );
};
