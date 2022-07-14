import { Button, Container } from '@hope-ui/solid';
import { Navigate } from 'solid-app-router';
import { Component } from 'solid-js';

import { useAuth } from '../auth';

const Home: Component = () => {
  const [session, { logout }] = useAuth();

  if (!session()) return <Navigate href={'/login'} />;

  return (
    <Container display='grid' placeItems={'center'} minHeight='100vh'>
      <h1>hello</h1>
      <Button onClick={logout}>Log out</Button>
    </Container>
  );
};

export { Home };
