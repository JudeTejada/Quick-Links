import {
  Heading,
  HStack,
  ListItem,
  notificationService,
  UnorderedList
} from '@hope-ui/solid';
import { createSignal, ErrorBoundary, For, Show } from 'solid-js';
import { useBookmark } from '../../context/BookmarkProvider';
import { BookmarkLoader } from './BookmarkLoader';
import { BookmarksList } from './BookmarksList';
import { CreateNewCategory } from './AddNewCategory';
import { ErrorText } from './ErrorText';
import { CategoryPreferences } from './CategoryPreferences';
import { BookmarkGroup } from '../../types';
import { Input } from './Input';
import { createSupabase } from 'solid-supabase';

function BookmarkCategories() {
  const categories = useBookmark();

  return (
    <ErrorBoundary fallback={<ErrorText text='something went wrong, sorry.' />}>
      <UnorderedList mb={'$8'}>
        <For each={categories} fallback={BookmarkLoader}>
          {(cat, i) => (
            <List title={cat.title} bookmarks={cat.bookmarks} id={cat.id} />
          )}
        </For>
        <CreateNewCategory />
      </UnorderedList>
    </ErrorBoundary>
  );
}

const List = (props: BookmarkGroup) => {
  const [isEditing, setIsEditing] = createSignal(false);

  const supabase = createSupabase();

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
      <HStack gap='$4'>
        <Show
          when={isEditing()}
          fallback={
            <Heading mb={'$1_5'} size='2xl'>
              {props.title}
            </Heading>
          }
        >
          <Input
            text={props.title}
            errorText='please enter a category'
            type='category'
            onSuccessHandler={handleInputEnter}
          />
        </Show>

        <CategoryPreferences
          onToggleEditText={setIsEditing}
          categoryId={props.id}
          categoryTitle={props.title}
        />
      </HStack>
      <BookmarksList list={props.bookmarks} categoryId={props.id} />
    </ListItem>
  );
};

export { BookmarkCategories };
