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
import { createEffect, createSignal } from 'solid-js';
import { useBookmark } from '../../context/BookmarkProvider';

function CreateNewCategory() {
  const [categoryText, setCategoryText] = createSignal('');

  const [_, { addNewCategory }] = useBookmark();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!categoryText()) return;

    if (e.key === 'Enter') addNewCategory(categoryText());
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

export { CreateNewCategory };
