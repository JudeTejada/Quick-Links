import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger
} from '@hope-ui/solid';
import { createEffect, createSignal, Show } from 'solid-js';
import { createSupabase } from 'solid-supabase';
import { isUrl } from '../../util';

function AddNewBookmark(props: { categoryId: string }) {
  const [url, setUrl] = createSignal('');
  const [invalidUrl, setInvalidUrl] = createSignal(false);
  const [pressedEnter, setPressendEnter] = createSignal(false);

  const supabase = createSupabase();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!url()) return;

    if (e.key === 'Enter') setPressendEnter(true);
  };

  const addNewUrl = async () => {
    const { data, error } = await supabase.from('bookmarks').insert({
      url: url(),
      category_id: props.categoryId
    });
    if (error) {
      console.error(error);
    }
  };

  const handleInput = (event: InputEvent) => {
    const element = event.target as HTMLInputElement;
    setUrl(element.value);
    setInvalidUrl(false);
  };

  createEffect(() => {
    const isUrlValid = isUrl(url());

    if (pressedEnter()) {
      if (!isUrlValid) return setInvalidUrl(true);

      setPressendEnter(false);

      addNewUrl();
    }
  });

  return (
    <>
      <Popover placement='top-start' initialFocus='#category'>
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
          <PopoverCloseButton />
          <PopoverBody>
            <FormControl>
              <FormLabel for='email'></FormLabel>

              <Input
                placeholder='https://www.google.com/'
                id='category'
                type='text'
                value={url()}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                invalid={invalidUrl()}
              />

              <Show when={invalidUrl()} fallback={null}>
                <FormHelperText color={'$danger9'}>Invalid url</FormHelperText>
              </Show>
            </FormControl>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}

export { AddNewBookmark as CreateBookmark };
