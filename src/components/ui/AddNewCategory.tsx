import {
  Button,
  FormControl,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger
} from '@hope-ui/solid';
import { createSupabase } from 'solid-supabase';
import { BookmarkGroup } from '../../types';
import { Input } from './Input';
import { useAuth } from '../auth';
import { createEffect, createSignal } from 'solid-js';

function AddNewCategory() {
  const session = useAuth();
  const supabase = createSupabase();

  const [inputElm, setInputElm] = createSignal<HTMLInputElement>();

  createEffect(() => {
    console.log(inputElm()?.focus());
  });

  const handleInputEnter = async (title: string) => {
    const { data, error } = await supabase
      .from<BookmarkGroup>('bookmarks')
      .insert({
        title,
        user_id: session()?.user?.id
      });

    if (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Popover closeOnBlur placement='top-start' initialFocus='#category'>
        <PopoverTrigger as={Button}>Add new category</PopoverTrigger>
        <PopoverContent>
          <PopoverBody>
            <FormControl>
              <Input
                ref={setInputElm}
                placeholder='Social'
                id='category'
                errorText='please enter a category'
                type='category'
                onSuccessHandler={handleInputEnter}
              />
            </FormControl>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}

export { AddNewCategory as CreateNewCategory };
