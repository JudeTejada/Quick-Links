import { Box, Button, Container, Flex, Heading, Text } from '@hope-ui/solid';
import { Component, createSignal } from 'solid-js';
import { createSupabaseAuth } from 'solid-supabase';

export const SignIn: Component = () => {
  const auth = createSupabaseAuth();

  const signInGoogle = () => {
    auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <Box>
      <Container display='grid' placeItems={'center'} minHeight='100vh'>
        <Box>
          <Box textAlign={'center'} mb='$4'>
            <Heading level='6' size='5xl' marginBottom='20px'>
              Welcome
            </Heading>
            <Text size='base'>Easily sign in with using a magic link.</Text>
          </Box>
          <Flex alignItems={'center'}>
            <Box alignItems={'center'}>
              <Button
                width={'$full'}
                textAlign={'center'}
                // type='submit'
                onclick={signInGoogle}
                colorScheme='primary'
                marginTop={'20px'}
              >
                Sign in with Google
              </Button>
            </Box>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};
