import {
  Button,
  FormControl,
  notificationService,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger
} from '@hope-ui/solid';
import { createEffect, createSignal } from 'solid-js';
import { createSupabase } from 'solid-supabase';
import { Input } from './Input';

function AddNewBookmark(props: { categoryId: string }) {
  const supabase = createSupabase();

  const [inputElm, setInputElm] = createSignal<HTMLInputElement>();

  createEffect(() => {
    console.log(inputElm()?.focus());
  });

  const handleEnter = async (text: string) => {
    const { data, error } = await supabase.from('bookmarks').insert({
      url: text,
      category_id: props.categoryId
    });
    if (error)
      return notificationService.show({
        status: 'danger',
        title: 'Error!',
        description: 'failed to add a new bookmark'
      });

    if (data) {
      return window.focus();
    }
  };

  return (
    <>
      <Popover
        closeOnBlur
        triggerMode='click'
        placement='top-start'
        initialFocus='#category'
      >
        <PopoverTrigger
          as={Button}
          variant='subtle'
          colorScheme='neutral'
          size='sm'
        >
          New+
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>
            <FormControl>
              <Input
                ref={setInputElm}
                errorText='invalid url'
                type='bookmark'
                placeholder='https://www.google.com/'
                id='category'
                inputType='url'
                onSuccessHandler={handleEnter}
              />
            </FormControl>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}

export { AddNewBookmark as CreateBookmark };
