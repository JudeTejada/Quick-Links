import {
  Box,
  Button,
  Container,
  Flex,
  FormLabel,
  Heading,
  Input,
  notificationService,
  Text
} from '@hope-ui/solid';
import { Component, createSignal } from 'solid-js';
import { createSupabaseAuth } from 'solid-supabase';

export const SignIn: Component = () => {
  const auth = createSupabaseAuth();

  const [email, setEmail] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);

  const handleLogin = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await auth.signIn({ email: email() });
      if (error) throw error;
      setIsLoading(false);
      notificationService.show({
        status: 'success',
        title: 'Success',
        description: 'Check your email for the magic link sent!'
      });
      setEmail('');
    } catch (error: any) {
      setIsLoading(false);

      notificationService.show({
        status: 'danger' /* or success, warning, danger */,
        title: 'Something went wrong',
        description: error.error_description || error.message
      });
    }
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
          <form onSubmit={handleLogin}>
            <Flex alignItems={'center'}>
              <Box alignItems={'center'}>
                <FormLabel for='email'>Email address</FormLabel>
                <Input
                  id='email'
                  placeholder='johndoe@gmail.com'
                  type='email'
                  value={email()}
                  oninput={e => {
                    setEmail(e.target.value);
                  }}
                />
                <Button
                  width={'$full'}
                  textAlign={'center'}
                  type='submit'
                  colorScheme='primary'
                  marginTop={'20px'}
                  loading={isLoading()}
                >
                  Sign in
                </Button>
              </Box>
            </Flex>
          </form>
        </Box>
      </Container>
    </Box>
  );
};
