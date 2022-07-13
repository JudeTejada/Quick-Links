/* @refresh reload */
import { render } from 'solid-js/web';
import { createClient } from '@supabase/supabase-js';
import { SupabaseProvider } from 'solid-supabase';
import App from './App';
import { HopeProvider, NotificationsProvider } from '@hope-ui/solid';

const supabase = createClient(
  'https://cwocwsdipdkszcmwhtvj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3b2N3c2RpcGRrc3pjbXdodHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc3MDE1MzUsImV4cCI6MTk3MzI3NzUzNX0.uOV_1bcRGryqLX5cNX7DrENa4ACWFUUx6tjLpeUyF-c'
);

render(
  () => (
    <SupabaseProvider client={supabase}>
      <HopeProvider>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </HopeProvider>
    </SupabaseProvider>
  ),
  document.getElementById('root') as HTMLElement
);
