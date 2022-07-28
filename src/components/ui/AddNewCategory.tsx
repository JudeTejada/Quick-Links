import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger
} from '@hope-ui/solid';
import { createSignal } from 'solid-js';
import { createSupabase } from 'solid-supabase';
import { BookmarkGroup } from '../../types';

function AddNewCategory() {
  const [categoryText, setCategoryText] = createSignal('');

  const supabase = createSupabase();

  const addNewCategory = async () => {
    const { data, error } = await supabase
      .from<BookmarkGroup>('category')
      .insert({
        title: categoryText()
      });
    if (error) {
      console.error(error);
    }
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!categoryText()) return;

    if (e.key === 'Enter') addNewCategory();
  };

  const handleInput = (event: InputEvent) => {
    const element = event.target as HTMLInputElement;
    setCategoryText(element.value);
  };

  return (
    <>
      <Popover placement='top-start' initialFocus='#category'>
        <PopoverTrigger as={Button}>Add new category</PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <FormControl>
              <FormLabel for='email'>Category</FormLabel>

              <Input
                placeholder='Social'
                id='category'
                type='text'
                value={categoryText()}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
              />
            </FormControl>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}

export { AddNewCategory as CreateNewCategory };
