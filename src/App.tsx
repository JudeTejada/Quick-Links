import { Route, Routes, useLocation } from '@solidjs/router';
import { Component, createRenderEffect, createSignal } from 'solid-js';
import { MetaProvider, Title, Link, Meta } from '@solidjs/meta';

import { SignIn, useAuth } from './components/auth';

import { Home } from './components/views';
import { Page404 } from './components/views/404';
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
    <>
      <Seo />

      <Routes>
        <Route path='/' component={Home} />
        <Route path='/login' component={SignIn} />
        <Route path='/*' component={Page404} />
      </Routes>
    </>
  );
};

export default App;
