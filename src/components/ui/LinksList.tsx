import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useMutation } from 'convex/react';

import type { Bookmark, CategoryId } from '../../types';
import { removeHttp } from '../../util';
import { CreateBookmark } from './AddNewBookmark';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../auth';
import { Button } from './button';

interface LinkListProps {
  list: Bookmark[];
  categoryId: CategoryId;
  isLinksEditing: boolean;
}

export function LinksList(props: LinkListProps) {
  return (
    <ul className="list-none flex flex-wrap items-center gap-x-2 gap-y-4 p-0">
      {props.list.map((bookmark) => (
        <BookmarkLink
          key={bookmark._id}
          {...bookmark}
          categoryId={props.categoryId}
          isLinksEditing={props.isLinksEditing}
        />
      ))}

      {!props.isLinksEditing ? (
        <li>
          <CreateBookmark categoryId={props.categoryId} />
        </li>
      ) : null}
    </ul>
  );
}

interface BookmarkLinkProps extends Bookmark {
  isLinksEditing: boolean;
  categoryId: CategoryId;
}

function BookmarkLink(props: BookmarkLinkProps) {
  const [imageError, setImageError] = useState(false);
  const { user } = useAuth();
  const removeLink = useMutation(api.links.remove);
  const iconSizeClass = props.isLinksEditing ? 'h-[34px] w-[34px]' : 'h-6 w-6';

  const handleDeleteLink = async (linkId: Bookmark['_id']) => {
    if (!user) return;

    try {
      await removeLink({ userId: user.id, linkId });
    } catch (error) {
       
      console.error(error);
    }
  };

  return (
    <li className="relative">
      <a href={props.url} target="_blank" rel="noreferrer" className="inline-flex items-center">
        {props.isLinksEditing ? (
          <Button
            variant="destructive"
            size="icon-xs"
            className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-transparent p-0 text-white shadow-sm"
            aria-label="Delete current link"
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              handleDeleteLink(props._id);
            }}
          >
            <X size={10} />
          </Button>
        ) : null}

        {!imageError ? (
          <img
            className={`${iconSizeClass} rounded-full object-cover`}
            src={`https://icon.horse/icon/${removeHttp(props.url)}`}
            onError={() => setImageError(true)}
            alt={props.url}
          />
        ) : (
          <span
            className={`${iconSizeClass} grid place-items-center rounded-full bg-black text-[10px] text-white`}
          >
            404
          </span>
        )}
      </a>
    </li>
  );
}
