import React, { useEffect, useState } from 'react';

import { Field, FieldError, FieldLabel } from './field';
import { Input } from './input';
import { isUrl } from '../../util';

type InputType = 'category' | 'bookmark';

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
  inputRef?: React.RefObject<HTMLInputElement>;
}

const validateInput = (text: string, type: InputType) => {
  if (!text) return true;
  if (type === 'bookmark' && !isUrl(text)) return true;
  return false;
};

const formatValue = (text: string, type: InputType) => {
  if (type === 'bookmark') {
    const cleaned = text.replace(/^https?:\/\//, '');
    return `https://${cleaned}`;
  }

  return text;
};

export function QuickLinksInput(props: QuickLinksInputProps) {
  const [text, setText] = useState(props.text || '');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (props.type === 'bookmark' && !props.text) {
      setText('https://');
    }
  }, [props.type, props.text]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

    const shouldError = validateInput(text, props.type);
    if (shouldError) {
      setIsError(true);
      return;
    }

    props.onSuccessHandler(text);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    const inputValue = event.target.value;
    const formatted = formatValue(inputValue, props.type);
    setText(formatted);
  };

  return (
    <Field>
      {props.label ? (
        <FieldLabel htmlFor={props.id ?? props.label}>{props.label}</FieldLabel>
      ) : null}
      <Input
        ref={props.inputRef}
        id={props.id ?? props.label}
        placeholder={props.placeholder}
        type={props.inputType || 'text'}
        value={text}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        aria-invalid={isError}
      />
      {isError ? <FieldError>{props.errorText}</FieldError> : null}
    </Field>
  );
}
