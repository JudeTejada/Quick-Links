import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Spacer,
  Text
} from '@hope-ui/solid';
import { Navigate } from '@solidjs/router';
import { Component, Show } from 'solid-js';
import { createSupabaseAuth } from 'solid-supabase';
import { useOnlineStatus } from 'solid-use';
import { BookmarkProvider } from '../../context/BookmarkProvider';

import { useAuth } from '../auth';
import { BookmarkCategories } from '../ui';

const Home: Component = () => {
  const session = useAuth();
  const auth = createSupabaseAuth();

  if (!session()) return <Navigate href={'/login'} />;

  const handleLogout = () => {
    auth.signOut();
  };

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

        <BookmarkContent />
      </Container>
    </>
  );
};

function BookmarkContent() {
  const isOnline = useOnlineStatus();

  return (
    <Show
      when={isOnline()}
      fallback={
        <Box bg='$danger4' p='$2' mt='$4'>
          <Text>It appears you are not connected in the internet</Text>
        </Box>
      }
    >
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
    </Show>
  );
}

export { Home };
