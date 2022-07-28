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

type BookmarkContextType = [
  CategoriesBookmark,
  {
    addNewCategory: (value: string) => void;
    addNewBookmark: (values: AddNewBookmark) => void;
  }
];
const BookmarkContext = createContext<BookmarkContextType>();

export const useBookmark = () => useContext(BookmarkContext)!;

const SkeletonLoader = () => {
  return (
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
  );
};

const getTodos = async () => {
  const supabase = createSupabase();
  const { data, error } = await supabase.from<CategoriesBookmark>('category')
    .select(`
      id, title,
      bookmarks (
       category_id
      )
      `);

  if (error) {
    throw error;
  }

  return data;
};

export const BookmarkProvider: ParentComponent = props => {
  const [categories, setCategories] = createStore<CategoriesBookmark>([]);
  const [data] = createResource(getTodos);

  createEffect(() => {
    const returnedValue = data();
    console.log(returnedValue, 'returnedValue');
    if (returnedValue) {
      console.log("🚀 ~ file: BookmarkProvider.tsx ~ line 87 ~ createEffect ~ returnedValue", returnedValue)
      setCategories(returnedValue);
    }
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

  const values: BookmarkContextType = [
    categories,
    { addNewCategory, addNewBookmark }
  ];

  return (
    <BookmarkContext.Provider value={values}>
      {data.loading ? <SkeletonLoader /> : props.children}
    </BookmarkContext.Provider>
  );
};
