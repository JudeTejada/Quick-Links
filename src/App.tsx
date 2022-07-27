import { Box, Spinner } from '@hope-ui/solid';
import { Route, Routes, useLocation } from 'solid-app-router';
import {
  Component,
  createEffect,
  createRenderEffect,
  createSignal
} from 'solid-js';

import { SignIn, useAuth } from './components/auth';

import { Home } from './components/views';
import { useSupabaseListener } from './hooks';

const App: Component = () => {
  useSupabaseListener();
  const session = useAuth();

  const [isLoading, setIsLoading] = createSignal(false);
  const location = useLocation();

  createRenderEffect(() => {
    if (location.hash.startsWith('#access_token')) return setIsLoading(true);
    if (isLoading() && session()) setIsLoading(false);
  });

  return (
    <Routes>
      <Route path='/' component={Home} />
      <Route path='/login' component={SignIn} />
    </Routes>
  );
};

export default App;
