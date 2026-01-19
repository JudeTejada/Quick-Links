import { useState } from 'react';
import type { ChangeEvent, KeyboardEvent, RefObject } from 'react';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { isUrl } from '@/util';

type InputType = 'category' | 'bookmark';
type InputRef = RefObject<HTMLInputElement | null>;

interface QuickLinksInputProps {
  type: InputType;
  errorText: string;
  inputType?: string;
  label?: string;
  text?: string;
  placeholder?: string;
  id?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onSuccessHandler: (text: string) => void;
  inputRef?: InputRef;
}

const validateInput = (text: string, type: InputType) => {
  if (!text) return true;
  if (type === 'bookmark' && !isUrl(text)) return true;
  return false;
};

const formatValue = (text: string, type: InputType) => {
  if (type === 'bookmark') {
    const cleaned = text.replace(/^(https?:\/\/)+/i, '');
    return cleaned ? `https://${cleaned}` : 'https://';
  }

  return text;
};

export function QuickLinksInput({
  type,
  errorText,
  inputType = 'text',
  label,
  text: initialText,
  placeholder,
  id,
  onFocus,
  onBlur,
  onSuccessHandler,
  inputRef,
}: QuickLinksInputProps) {
  const [text, setText] = useState(initialText || (type === 'bookmark' ? 'https://' : ''));
  const [isError, setIsError] = useState(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

    const normalized = formatValue(text, type);
    const shouldError = validateInput(normalized, type);
    if (shouldError) {
      setIsError(true);
      return;
    }

    onSuccessHandler(normalized);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    const inputValue = event.target.value;
    const formatted = formatValue(inputValue, type);
    setText(formatted);
  };

  return (
    <Field>
      {label ? <FieldLabel htmlFor={id ?? label}>{label}</FieldLabel> : null}
      <Input
        ref={inputRef}
        id={id ?? label}
        placeholder={placeholder}
        type={inputType}
        value={text}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-invalid={isError}
      />
      {isError ? <FieldError>{errorText}</FieldError> : null}
    </Field>
  );
}
