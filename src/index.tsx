import { render } from 'solid-js/web';
import { createClient } from '@supabase/supabase-js';
import { SupabaseProvider } from 'solid-supabase';
import App from './App';
import { HopeProvider, NotificationsProvider } from '@hope-ui/solid';
import { Router } from '@solidjs/router';
import { StoreProvider } from './components/auth';
import './index.css';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_TOKEN
);

render(
  () => (
    <Router>
      <SupabaseProvider client={supabase}>
        <StoreProvider>
          <HopeProvider>
            <NotificationsProvider>
              <App />
            </NotificationsProvider>
          </HopeProvider>
        </StoreProvider>
      </SupabaseProvider>
    </Router>
  ),
  document.getElementById('root') as HTMLElement
);
