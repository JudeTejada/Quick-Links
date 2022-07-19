import { notificationService } from '@hope-ui/solid';
import { createRenderEffect } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import { useAuth } from './../components/auth/userAuth';

const useSupabaseListener = () => {
  const navigate = useNavigate();
  const session = useAuth();

  //localhost:3001/#access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjU3Nzk1MDE4LCJzdWIiOiI4ZTExNmFjYi03NDIwLTRlNTItOGQ5Zi0xMGU1MmYzODJhMWQiLCJlbWFpbCI6Imp1ZGVsYXVyZW50ZXRlamFkYUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7fSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQifQ.FmR83oCT9zy8Nl5zVmc6zz3MupN2ntSMgdzXmqbsafA&expires_in=3600&refresh_token=gJtspWJJdCghnCthY50nsg&token_type=bearer&type=magiclink

  createRenderEffect(() => {
    if (session()) return navigate('/', { replace: true });

    const urlParams = new URLSearchParams(window.location.href);

    const errCode = urlParams.get('error_code');
    const errMsg = urlParams.get('error_description');

    if (errCode === '401') {
      notificationService.show({
        status: 'danger' /* or success, warning, danger */,
        title: `${errCode} Error`,
        description: errMsg || ''
      });

      navigate('/login', { replace: true });
    }
  });
};

export { useSupabaseListener };
