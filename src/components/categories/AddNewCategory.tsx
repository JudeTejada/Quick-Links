import { useEffect, useRef, useState } from 'react';
import { useConvexAuth, useMutation } from 'convex/react';

import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { QuickLinksInput } from '@/components/bookmarks/QuickLinksInput';

export function CreateNewCategory() {
  const { isAuthenticated } = useConvexAuth();
  const createCategory = useMutation(api.bookmarks.create);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleInputEnter = async (title: string) => {
    if (!isAuthenticated) return;

    try {
      await createCategory({
        title,
      });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <Button className="border-transparent bg-[#0EA5B7] text-white shadow-sm hover:bg-[#0B8EA0]">
            Add new category
          </Button>
        }
      />
      <PopoverContent side="top" align="start" className="w-72">
        <QuickLinksInput
          inputRef={inputRef}
          placeholder="Social"
          id="category"
          errorText="please enter a category"
          type="category"
          onSuccessHandler={handleInputEnter}
        />
      </PopoverContent>
    </Popover>
  );
}
