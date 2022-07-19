import { Box, Button, Container, Flex, Heading, Spacer } from '@hope-ui/solid';
import { Navigate } from 'solid-app-router';
import { Component } from 'solid-js';
import { createSupabaseAuth } from 'solid-supabase';
import { BookmarkProvider } from '../../context/BookmarkProvider';

import { useAuth } from '../auth';
import { BookmarkCategories, CreateBookmark } from '../ui';

const Home: Component = () => {
  const session = useAuth();

  if (!session()) return <Navigate href={'/login'} />;

  const auth = createSupabaseAuth();
  const handleLogout = () => {
    auth.signOut();
  };
  return (
    <BookmarkProvider>
      <Container p={'$20'} maxW='$5xl'>
        <Flex alignItems={'center'}>
          <Box>
            <Heading size={'3xl'} mb='$1'>
              Minimal solid marks
            </Heading>
            <Heading size='base' color='$blackAlpha11'>
              {session()?.user?.email}
            </Heading>
          </Box>
          <Spacer />
          <Button onClick={handleLogout}>logout</Button>
        </Flex>
        <Box
          mt='$10'
          display='flex'
          flexDirection={'column'}
          alignItems='flex-start'
        >
          <BookmarkCategories />
        </Box>
      </Container>
    </BookmarkProvider>
  );
};

export { Home };
