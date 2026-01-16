import { useEffect, useRef, useState } from 'react';
import { useConvexAuth, useMutation } from 'convex/react';

import { api } from '../../../convex/_generated/api';
import { notify } from '../../lib/notify';
import type { CategoryId } from '../../types';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { QuickLinksInput } from './QuickLinksInput';

export function CreateBookmark({ categoryId }: { categoryId: CategoryId }) {
  const { isAuthenticated } = useConvexAuth();
  const createLink = useMutation(api.links.create);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleEnter = async (text: string) => {
    if (!isAuthenticated) return;

    try {
      await createLink({
        url: text,
        categoryId,
      });
      inputRef.current?.blur();
      setIsOpen(false);
    } catch (error) {
      notify({
        status: 'danger',
        title: 'Error!',
        description: error instanceof Error ? error.message : 'Failed to add a new bookmark.',
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
