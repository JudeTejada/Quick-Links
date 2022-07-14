import { Route, Routes } from 'solid-app-router';
import { Component } from 'solid-js';
import { SignIn } from './components/auth';

import { Home } from './components/views';
import { useSupabaseListener } from './hooks';

const App: Component = () => {
  useSupabaseListener();

  return (
    <Routes>
      <Route path='/' component={Home} />
      <Route path='/login' component={SignIn} />
    </Routes>
  );
};

export default App;
