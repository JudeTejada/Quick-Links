/* global chrome */

import { type Session } from '@supabase/supabase-js';
import { useNavigate } from '@solidjs/router';
import {
  Accessor,
  createContext,
  createSignal,
  ParentComponent,
  useContext
} from 'solid-js';
import { createOnAuthStateChange, createSupabaseAuth } from 'solid-supabase';

const StoreContext = createContext<Accessor<Session | null>>();

export const useAuth = () => useContext(StoreContext)!;

export const StoreProvider: ParentComponent = props => {
  const [session, setSession] = createSignal<Session | null>(null);

  const navigate = useNavigate();

  createOnAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      setSession(session);

      navigate('/', { replace: true });
    }
    if (event === 'SIGNED_OUT') {
      setSession(null);
      navigate('/login', { replace: true });
    }
  });

  return (
    <StoreContext.Provider value={session}>
      {props.children}
    </StoreContext.Provider>
  );
};
