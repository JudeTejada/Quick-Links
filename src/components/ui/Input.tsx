import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input as HopeUiInput
} from '@hope-ui/solid';
import { useCurrentlyHeldKey } from '@solid-primitives/keyboard';
import { createSignal, onMount, Show } from 'solid-js';
import { isUrl } from '../../util';

type InputType = 'category' | 'bookmark';
interface InputProps {
  type: InputType;
  errorText: string;
  inputType?: string;
  label?: string;
  text?: string;
  placeholder?: string;
  id?: string;
  ref?: HTMLInputElement | ((el: HTMLInputElement) => void) | undefined;
  onFocus?: () => void;
  onBlur?: () => void;
  onSuccessHandler: (text: string) => void;
}

const validateInput = (text: string, type: InputType) => {
  if (!text) return true;

  if (type === 'bookmark' && !isUrl(text)) return true;

  return false;
};

const getFormattedValue = (text: string, type: InputType) => {
  if (type === 'bookmark') {
    text = text.replaceAll('https://', '').replaceAll('http://', '');

    let newInputValue = `https://${text}`;

    return newInputValue;
  }

  return text;
};

export function Input(props: InputProps) {
  const [text, setText] = createSignal(props.text || '');
  const [isError, setIsError] = createSignal(false);
  const key = useCurrentlyHeldKey();

  onMount(() => {
    if (props.type === 'bookmark') setText('https://');
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    const isError = validateInput(text(), props.type);
    if (event.key === 'Enter') {
      isError ? setIsError(true) : props.onSuccessHandler(text());
    }
  };

  const handleInput = (event: InputEvent) => {
    setIsError(false);
    const element = event.target as HTMLInputElement;

    if (
      props.type === 'bookmark' &&
      key() === 'BACKSPACE' &&
      text().endsWith('https://')
    )
      return setText('https://');

    let inputValue = getFormattedValue(element.value, props.type);
    setText(inputValue);
  };

  return (
    <>
      <FormControl>
        <Show when={props.label}>
          <FormLabel for={props.label}>{props.label}</FormLabel>
        </Show>

        <HopeUiInput
          ref={props.ref}
          placeholder={props.placeholder}
          id={props.label}
          type={props.inputType || 'text'}
          value={text()}
          onInput={handleInput}
          onkeydown={handleKeyDown}
          onfocus={props.onFocus}
          onBlur={props.onBlur}
          invalid={isError()}
        />

        <Show when={isError()} fallback={null}>
          <FormHelperText color={'$danger9'}>{props.errorText}</FormHelperText>
        </Show>
      </FormControl>
    </>
  );
}
