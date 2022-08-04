import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input as HopeUiInput
} from '@hope-ui/solid';
import { createSignal, Show } from 'solid-js';
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
  onSuccessHandler: (text: string) => void;
}

const validateInput = (text: string, type: InputType) => {
  if (!text) return true;

  if (type === 'bookmark' && !isUrl(text)) return true;

  return false;
};

export function Input(props: InputProps) {
  const [text, setText] = createSignal(props.text || '');
  const [isError, setIsError] = createSignal(false);

  const handleEnter = (event: KeyboardEvent) => {
    const isError = validateInput(text(), props.type);
    if (event.key === 'Enter') {
      isError ? setIsError(true) : props.onSuccessHandler(text());
    }
  };

  const handleInput = (event: InputEvent) => {
    const element = event.target as HTMLInputElement;
    setIsError(false);
    setText(element.value);
  };

  return (
    <>
      <FormControl>
        <Show when={props.label}>
          <FormLabel for={props.label}>{props.label}</FormLabel>
        </Show>

        <HopeUiInput
          placeholder={props.placeholder}
          id={props.label}
          type={props.inputType || 'text'}
          value={text()}
          onInput={handleInput}
          onkeydown={handleEnter}
          invalid={isError()}
        />

        <Show when={isError()} fallback={null}>
          <FormHelperText color={'$danger9'}>{props.errorText}</FormHelperText>
        </Show>
      </FormControl>
    </>
  );
}
