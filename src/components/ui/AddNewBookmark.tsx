import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from 'convex/react';

import { api } from '../../../convex/_generated/api';
import { notify } from '../../lib/notify';
import { useAuth } from '../auth';
import type { CategoryId } from '../../types';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { QuickLinksInput } from './QuickLinksInput';

export function CreateBookmark({ categoryId }: { categoryId: CategoryId }) {
  const { user } = useAuth();
  const createLink = useMutation(api.links.create);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleEnter = async (text: string) => {
    if (!user) return;

    try {
      await createLink({
        url: text,
        categoryId,
        userId: user.id,
      });
      inputRef.current?.blur();
      setIsOpen(false);
    } catch (error) {
      notify({
        status: 'danger',
        title: 'Error!',
        description: 'failed to add a new bookmark',
      });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="secondary"
            size="xs"
            className="h-6 rounded-md px-2.5 text-xs font-semibold text-slate-600 shadow-none hover:bg-slate-200"
          >
            New+
          </Button>
        }
      />
      <PopoverContent side="top" align="start" className="w-80">
        <QuickLinksInput
          inputRef={inputRef}
          errorText="invalid url"
          type="bookmark"
          placeholder="https://www.google.com/"
          id="category"
          inputType="url"
          onSuccessHandler={handleEnter}
        />
      </PopoverContent>
    </Popover>
  );
}
