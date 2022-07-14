import { useAuth } from './../components/auth/userAuth';
import { notificationService } from '@hope-ui/solid';
import { useLocation, useNavigate } from 'solid-app-router';
import { onMount } from 'solid-js';
const useSupabaseListener = () => {
  const navigate = useNavigate();
  const [session] = useAuth();

  onMount(() => {
    if (session()) return navigate('/', { replace: true });

    const urlParams = new URLSearchParams(window.location.href);

    const errCode = urlParams.get('error_code');
    const errMsg = urlParams.get('error_description');

    if (errCode === '401') {
      notificationService.show({
        status: 'danger' /* or success, warning, danger */,
        title: `${errCode} Error`,
        description: errMsg
      });

      navigate('/login', { replace: true });
    }
  });
};

export { useSupabaseListener };
