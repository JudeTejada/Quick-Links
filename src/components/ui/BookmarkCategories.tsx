import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useMutation } from 'convex/react';

import { useBookmark } from '../../context/BookmarkProvider';
import { LinksList } from './LinksList';
import { CreateNewCategory } from './AddNewCategory';
import { CategoryPreferences } from './CategoryPreferences';
import type { BookmarkList, CategoryId } from '../../types';
import { notify } from '../../lib/notify';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../auth';
import { Button } from './button';
import { Input } from './input';

export function BookmarkCategories() {
  const { categories } = useBookmark();

  return (
    <ul className="list-none space-y-5 p-0">
      {categories.map((category) => (
        <CategoryItem
          key={category._id}
          title={category.title}
          links={category.links}
          categoryId={category._id}
        />
      ))}

      <li className="pt-2">
        <CreateNewCategory />
      </li>
    </ul>
  );
}

interface CategoryItemProps {
  categoryId: CategoryId;
  title: string;
  links: BookmarkList;
}

function CategoryItem(props: CategoryItemProps) {
  const { user } = useAuth();
  const updateTitle = useMutation(api.bookmarks.updateTitle);
  const [isEditing, setIsEditing] = useState(false);
  const [linksIsEditing, setLinksIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(props.title);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!props.links?.length && linksIsEditing) setLinksIsEditing(false);
  }, [linksIsEditing, props.links?.length]);

  useEffect(() => {
    if (isEditing) {
      setDraftTitle(props.title);
      inputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (isEditing) {
        setDraftTitle(props.title);
        setIsEditing(false);
      }
      if (linksIsEditing) setLinksIsEditing(false);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isEditing, linksIsEditing]);

  useEffect(() => {
    if (!isEditing) {
      setDraftTitle(props.title);
    }
  }, [isEditing, props.title]);

  const commitTitle = async (text: string) => {
    if (!user) return;
    if (isSaving) return;

    const trimmedTitle = text.trim();
    if (!trimmedTitle) {
      notify({
        status: 'danger',
        title: 'Error!',
        description: 'please enter a category',
      });
      return;
    }

    if (trimmedTitle === props.title) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await updateTitle({
        title: trimmedTitle,
        categoryId: props.categoryId,
        userId: user.id,
      });
      setIsEditing(false);
    } catch (error) {
      notify({
        status: 'danger',
        title: 'Error!',
        description: 'failed to edit existing category title',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <li className="relative rounded-xl p-3 transition-all duration-200">
      <div className="flex items-center gap-2">
        {isEditing ? (
          <Input
            ref={inputRef}
            nativeInput
            className="h-9 w-56 rounded-md border border-transparent bg-transparent px-1 text-2xl font-semibold text-slate-900 focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitTitle(draftTitle);
              }
              if (event.key === 'Escape') {
                event.preventDefault();
                setDraftTitle(props.title);
                setIsEditing(false);
              }
            }}
            onBlur={() => commitTitle(draftTitle)}
          />
        ) : (
          <>
            <button
              type="button"
              className="text-2xl font-semibold text-slate-900 transition-colors hover:text-slate-700"
              onClick={() => setIsEditing(true)}
            >
              {props.title}
            </button>
            <CategoryPreferences
              isLinksEditing={linksIsEditing}
              links={props.links}
              onToggleLinksEdit={setLinksIsEditing}
              categoryId={props.categoryId}
              categoryTitle={props.title}
            />
          </>
        )}
      </div>

      <div className="mt-3">
        <LinksList
          list={props.links}
          categoryId={props.categoryId}
          isLinksEditing={linksIsEditing}
        />
      </div>

      {linksIsEditing ? (
        <Button
          variant="default"
          size="icon-xs"
          className="absolute -top-3 left-1/2 h-7 w-7 -translate-x-1/2 rounded-full border-transparent bg-[#369EFF] text-white shadow-md hover:bg-[#2D8BE4]"
          onClick={() => setLinksIsEditing(false)}
        >
          <X size={16} />
        </Button>
      ) : null}
    </li>
  );
}
