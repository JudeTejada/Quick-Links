import { Box, Button, Container, Flex, Heading, Spacer } from '@hope-ui/solid';
import { Navigate } from '@solidjs/router';
import { Component } from 'solid-js';
import { createSupabaseAuth } from 'solid-supabase';
import { useOnlineStatus } from 'solid-use';
import { BookmarkProvider } from '../../context/BookmarkProvider';

import { useAuth } from '../auth';
import { BookmarkCategories, CreateBookmark } from '../ui';

const Home: Component = () => {
  const session = useAuth();
  const isOnline = useOnlineStatus();

  if (!session()) return <Navigate href={'/login'} />;

  console.log(isOnline());
  const auth = createSupabaseAuth();
  const handleLogout = () => {
    auth.signOut();
  };
  if (!isOnline())
    return <h1>There seems to be an issue with your wifi connection</h1>;
  return (
    <>
      <Container p={{ '@initial': '$4', '@md': '$20' }} maxW='$5xl'>
        <Flex alignItems={'center'}>
          <Box>
            <Heading size={'3xl'} mb='$1'>
              Solid marks
            </Heading>
            <Heading size='base' color='$blackAlpha11'>
              {session()?.user?.email}
            </Heading>
          </Box>
          <Spacer />
          <Button onClick={handleLogout}>Sign out</Button>
        </Flex>
        <Box
          mt='$10'
          display='flex'
          flexDirection={'column'}
          alignItems='flex-start'
        >
          <BookmarkProvider>
            <BookmarkCategories />
          </BookmarkProvider>
        </Box>
      </Container>
    </>
  );
};

export { Home };
