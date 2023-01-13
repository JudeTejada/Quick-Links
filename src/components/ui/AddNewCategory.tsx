import {
  Button,
  FormControl,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger
} from '@hope-ui/solid';
import { createSupabase } from 'solid-supabase';
import { createEffect, createSignal } from 'solid-js';

import type { AddNewBookmarkGroup, BookmarkCategory } from '../../types';

import { Input } from './Input';

import { useAuth } from '../auth';

function AddNewCategory() {
  const session = useAuth();
  const supabase = createSupabase();

  const [inputElm, setInputElm] = createSignal<HTMLInputElement>();

  createEffect(() => {
    inputElm()?.focus();
  });

  const handleInputEnter = async (title: string) => {
    const { data, error, status } = await supabase
      .from<BookmarkCategory, AddNewBookmarkGroup>('bookmarks')
      .insert({
        // @ts-ignore
        title,
        user_id: session()?.user?.id
      })
      .select();


    if (data) inputElm()?.blur();

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
