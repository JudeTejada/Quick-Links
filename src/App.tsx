import { Box, Spinner } from '@hope-ui/solid';
import { Route, Routes } from 'solid-app-router';
import { Component, createRenderEffect, createSignal } from 'solid-js';

import { SignIn, useAuth } from './components/auth';

import { Home } from './components/views';
import { useSupabaseListener } from './hooks';

const App: Component = () => {
  useSupabaseListener();
  const session = useAuth();

  const [isLoading, setIsLoading] = createSignal(false);

  // createRenderEffect(() => {
  //   const url = new URL(window.location.href);
  //   if (url.hash.startsWith('#access_token')) return setIsLoading(true);
  //   setIsLoading(false);
  // });

  // if (isLoading() && !session())
  //   return (
  //     <Box minHeight={'100vh'} display='grid' placeItems={'center'}>
  //       <Spinner
  //         thickness='4px'
  //         speed='0.65s'
  //         emptyColor='$neutral4'
  //         color='$info10'
  //         size='xl'
  //       />
  //     </Box>
  //   );

  return (
    <Routes>
      <Route path='/' component={Home} />
      <Route path='/login' component={SignIn} />
    </Routes>
  );
};

export default App;
