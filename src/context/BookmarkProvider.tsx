import {
  createContext,
  createEffect,
  ParentComponent,
  useContext
} from 'solid-js';
import { createStore } from 'solid-js/store';
import { createSupabaseFrom } from 'solid-supabase';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '..';

import type { AddNewBookmark, CategoriesBookmark } from '../types';

type BookmarkProps = [
  bookmarks: CategoriesBookmark,
  methods: {
    addNewCategory: (value: string) => void;
    addNewBookmark: (values: AddNewBookmark) => void;
  }
];
const BookmarkContext = createContext<BookmarkProps | undefined>([
  [],
  { addNewCategory: () => {}, addNewBookmark: () => {} }
]);

export const useBookmark = () => useContext(BookmarkContext)!;

export const BookmarkProvider: ParentComponent = props => {
  const from = createSupabaseFrom(); 

  createEffect(async () => {
    let { data: Bookmark, error } = await supabase
      .from('Bookmarks')
      .select('*');
    console.log(
      '🚀 ~ file: BookmarkProvider.tsx ~ line 33 ~ createEffect ~ data',
      Bookmark
    );
    if (error) console.log('error', error);
  });
  const [categories, setCategories] = createStore<CategoriesBookmark>([
    {
      id: 'eaa2f313-e7e7-47ae-8124-fd9642c1a833',
      title: 'Social',
      bookmarks: [
        {
          id: 'ceca5134-b6df-4552-a973-2578ed49f2c9',
          url: 'http://google.com/'
        },
        {
          id: '715a94f0-5cf1-422a-8f8c-b76ee715c258',
          url: 'https://twitter.com/'
        }
      ]
    }
  ]);

  const addNewCategory = (category: string) => {
    let newCategory = {
      title: category,
      id: uuidv4(),
      bookmarks: []
    };
    setCategories([...categories, newCategory]);
  };

  const addNewBookmark = ({ url, categoryId }: AddNewBookmark) => {
    setCategories(
      category => category.id === categoryId,
      'bookmarks',
      bookmarks => [...bookmarks, { id: uuidv4(), url }]
    );
  };

  const values = [categories, { addNewCategory, addNewBookmark }];
  return (
    <BookmarkContext.Provider value={values}>
      {props.children}
    </BookmarkContext.Provider>
  );
};
