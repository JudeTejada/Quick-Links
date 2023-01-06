import { Accessor, createSignal, onMount } from 'solid-js';
export function useIsRendered(): Accessor<Boolean> {
  const [hasRendered, setHasRendered] = createSignal(false);

  onMount(() => {
    setHasRendered(true);
  });

  return hasRendered;
}
