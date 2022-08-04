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
function AddNewCategory() {
  const supabase = createSupabase();

  const handleInputEnter = async (text: string) => {
    const { data, error } = await supabase
      .from<BookmarkGroup>('category')
      .insert({
        title: text
      });
    if (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Popover placement='top-start' initialFocus='#category'>
        <PopoverTrigger as={Button}>Add new category</PopoverTrigger>
        <PopoverContent>
          <PopoverBody>
            <FormControl>
              <Input
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
