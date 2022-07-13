import { Container } from '@hope-ui/solid';
import { Component, createEffect, createSignal } from 'solid-js';
import { createOnAuthStateChange } from 'solid-supabase';

import { SignIn } from './components/auth';

const App: Component = () => {
  const [session, setSession] = createSignal(null);

  createOnAuthStateChange((event, session) => {
    console.log(event, session);
    setSession(session);
  });
  return (
    <Container display='grid' placeItems={'center'} minHeight='100vh'>
      {!session ? <SignIn /> : <h1>Hooooray!</h1>}
    </Container>
  );
};

export default App;
