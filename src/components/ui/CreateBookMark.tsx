import {
  Button,
  FormControl,
  FormErrorMessage,
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
import { isUrl } from '../../util';

function CreateBookmark() {
  const [categoryText, setCategoryText] = createSignal('');
  const [invalidUrl, setInvalidUrl] = createSignal(false);
  const [pressedEnter, setPressendEnter] = createSignal(false);

  console.log(invalidUrl, 'invalidUrl');
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!categoryText()) return;

    if (e.key === 'Enter') setPressendEnter(true);
  };

  const handleInput = (e: InputEvent) => {
    setCategoryText(e.target.value!);
    setInvalidUrl(false);
  };

  createEffect(() => {
    const isUrlValid = isUrl(categoryText());

    if (pressedEnter()) {
      if (!isUrlValid) setInvalidUrl(true);

      setPressendEnter(false);
      alert('success');
    }
  });

  return (
    <>
      <Popover placement='top-start' initialFocus='#category'>
        <PopoverTrigger as={Button} variant='subtle' colorScheme='neutral'>
          Add new category
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <FormControl>
              <FormLabel for='email'>Category</FormLabel>

              <Input
                placeholder='https://www.google.com/'
                id='category'
                type='text'
                value={categoryText()}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                invalid={invalidUrl()}
              />

              <Show when={invalidUrl()} fallback={null}>
                <FormErrorMessage>Email is required.</FormErrorMessage>
              </Show>
            </FormControl>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}

export { CreateBookmark };
