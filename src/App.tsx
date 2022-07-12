import type { Component } from 'solid-js';

import { heroText, themeClass } from './app.css';

const App: Component = () => {
  return (
    <div class={themeClass}>
      <h1 class={heroText}>hello world</h1>;
    </div>
  );
};

export default App;
