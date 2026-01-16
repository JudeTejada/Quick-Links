'use client';

import { Field as FieldPrimitive } from '@base-ui/react/field';
import { mergeProps } from '@base-ui/react/merge-props';
import * as React from 'react';

import { cn } from '@/lib/utils';

type InputProps = React.ComponentProps<'input'> & {
  size?: 'sm' | 'default' | 'lg' | number;
  unstyled?: boolean;
  nativeInput?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size = 'default', unstyled = false, nativeInput = false, ...props },
  ref,
) {
  const inputClassName = cn(
    'h-8.5 w-full min-w-0 rounded-[inherit] bg-transparent px-[calc(--spacing(3)-1px)] leading-8.5 outline-none',
    size === 'sm' && 'h-7.5 px-[calc(--spacing(2.5)-1px)] leading-7.5',
    size === 'lg' && 'h-9.5 leading-9.5',
  );

  if (nativeInput) {
    return (
      <input
        className={cn(inputClassName, className)}
        data-size={typeof size === 'string' ? size : undefined}
        data-slot="input"
        ref={ref}
        {...props}
      />
    );
  }

  return (
    <span
      className={
        cn(
          !unstyled &&
            'relative inline-flex w-full rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 has-aria-invalid:border-destructive/36 has-focus-visible:border-ring has-disabled:opacity-64 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none has-focus-visible:ring-[3px] not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/6%)] sm:text-sm dark:bg-input/32 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]',
          className,
        ) || undefined
      }
      data-size={size}
      data-slot="input-control"
    >
      <FieldPrimitive.Control
        render={(defaultProps) => {
          const { ref: defaultRef, ...restDefaultProps } = defaultProps;
          const mergedProps = mergeProps(restDefaultProps, props);
          const composedRef = (node: HTMLInputElement | null) => {
            if (typeof defaultRef === 'function') {
              defaultRef(node);
            } else if (defaultRef) {
              (defaultRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }

            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }
          };

          return (
            <input
              className={inputClassName}
              data-slot="input"
              ref={composedRef}
              {...mergedProps}
            />
          );
        }}
      />
    </span>
  );
});

export { Input, type InputProps };
