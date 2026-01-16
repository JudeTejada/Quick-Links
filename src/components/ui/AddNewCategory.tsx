import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from 'convex/react';

import { api } from '../../../convex/_generated/api';
import { useAuth } from '../auth';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { QuickLinksInput } from './QuickLinksInput';

export function CreateNewCategory() {
  const { user } = useAuth();
  const createCategory = useMutation(api.bookmarks.create);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleInputEnter = async (title: string) => {
    if (!user) return;

    try {
      await createCategory({
        title,
        userId: user.id,
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
