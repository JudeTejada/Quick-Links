import { Box, Flex, SkeletonCircle, SkeletonText } from '@hope-ui/solid';
import {
  createContext,
  createEffect,
  createResource,
  ParentComponent,
  useContext
} from 'solid-js';
import { createStore } from 'solid-js/store';
import { createSupabase } from 'solid-supabase';
import { v4 as uuidv4 } from 'uuid';

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
  const [categories, setCategories] = createStore<CategoriesBookmark>([]);
  const supabase = createSupabase();

  const [data] = createResource(1, () => {
    return supabase.from('category').select(`
      id, title,
      bookmarks (
       category_id
      )
      `);
  });

  createEffect(async () => {
    if (data()) {
      const categories = (await data())?.data as CategoriesBookmark;

      setCategories(categories);
    }
  });

  createEffect(() => {
    console.log(categories, 'categories');
  });

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

  console.log(data.loading);
  return (
    <BookmarkContext.Provider value={values}>
      {data.loading ? (
        <Box>
          <Box>
            <SkeletonText
              mt='$4'
              width={'200px'}
              noOfLines={1}
              spacing='$4'
              mb='$1_5'
            />
            <Flex mb='$6' gap='$2'>
              <SkeletonCircle size='$10' />
              <SkeletonCircle size='$10' />
              <SkeletonCircle size='$10' />
            </Flex>
          </Box>
          <Box>
            <SkeletonText
              mt='$4'
              width={'200px'}
              noOfLines={1}
              spacing='$4'
              mb='$1_5'
            />
            <Flex mb='$6' gap='$2'>
              <SkeletonCircle size='$10' />
              <SkeletonCircle size='$10' />
              <SkeletonCircle size='$10' />
              <SkeletonCircle size='$10' />
              <SkeletonCircle size='$10' />
            </Flex>
          </Box>
        </Box>
      ) : (
        props.children
      )}
    </BookmarkContext.Provider>
  );
};
