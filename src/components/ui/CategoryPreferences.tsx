import React, { useState } from 'react';
import { Ellipsis, Link2, Trash2 } from 'lucide-react';
import { useMutation } from 'convex/react';

import { api } from '../../../convex/_generated/api';
import type { BookmarkList, CategoryId } from '../../types';
import { useAuth } from '../auth';
import { Button } from './button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogClose,
} from './alert-dialog';
import { Menu, MenuItem, MenuPopup, MenuTrigger } from './menu';

export function CategoryPreferences(props: {
  categoryId: CategoryId;
  categoryTitle: string;
  isLinksEditing: boolean;
  onToggleLinksEdit: (value: boolean) => void;
  links: BookmarkList;
}) {
  const { user } = useAuth();
  const removeCategory = useMutation(api.bookmarks.remove);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await removeCategory({ userId: user.id, categoryId: props.categoryId });
    } catch (error) {
       
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  const handleLinksToggle = () => {
    props.onToggleLinksEdit(!props.isLinksEditing);
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Menu>
        <MenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              className="h-6 w-6 rounded-md border-transparent shadow-none text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Category options"
            >
              <Ellipsis size={18} />
            </Button>
          }
        />
        <MenuPopup align="start" className="min-w-[180px]">
          {props.links?.length ? (
            <MenuItem onClick={handleLinksToggle}>
              <Link2 size={16} />
              {props.isLinksEditing ? 'Cancel edit links' : 'Edit Links'}
            </MenuItem>
          ) : null}

          <MenuItem variant="destructive" onClick={() => setIsDialogOpen(true)}>
            <Trash2 size={16} />
            Delete category
          </MenuItem>
        </MenuPopup>
      </Menu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete "{props.categoryTitle}"?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Deleting this means you won't be able to recover the content and its links.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Confirm'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
