import { type Session } from '@supabase/supabase-js';
import { useNavigate } from 'solid-app-router';
import {
  createContext,
  createEffect,
  createSignal,
  ParentComponent,
  useContext
} from 'solid-js';
import { createOnAuthStateChange, createSupabaseAuth } from 'solid-supabase';

const StoreContext = createContext([{ session: null }, { logout: () => {} }]);

export const useAuth = () => useContext(StoreContext)!;

export const StoreProvider: ParentComponent = props => {
  const [session, setSession] = createSignal<Session | null>(null);
  const navigate = useNavigate();

  const auth = createSupabaseAuth();

  createOnAuthStateChange((event, session) => {
    {
      session ? setSession(session) : setSession(null);
    }
  });

  createEffect(() => {
    session() &&   navigate('/', { replace: true });
  });

  const logout = () => {
    auth.signOut();
    setSession(null);
    navigate('/login', { replace: true });
  };

  const user = [
    session,
    {
      logout
    }
  ];

  return (
    <StoreContext.Provider value={user}>{props.children}</StoreContext.Provider>
  );
};
