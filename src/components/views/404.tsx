import { Box, Button, Container, Text } from '@hope-ui/solid';
import { A } from '@solidjs/router';
import { Component } from 'solid-js';

const Page404: Component = () => {
  return (
    <>
      <Container
        p={{ '@initial': '$4', '@md': '$20' }}
        maxW='$5xl'
        placeItems='center'
        display='grid'
        h='100vh'
      >
        <Box textAlign='center'>
          <Text mb='$4' fontSize={16}>You bumped in a 404 page.</Text>
          <A href='/'>
            <Button>Back to Home</Button>
          </A>
        </Box>
      </Container>
    </>
  );
};

export { Page404 };
