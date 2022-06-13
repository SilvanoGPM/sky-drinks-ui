import { useState, useEffect } from 'react';

import endpoints, { api } from 'src/api/api';
import { handleError } from 'src/utils/handleError';

export const USER_CREDENTIALS_KEY = 'userCredentials';

export function useAuth(): AuthContenxtType {
  const [userInfo, setUserInfo] = useState<UserType>({} as UserType);
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    async function loadUserInfo(): Promise<void> {
      try {
        const userInfoFound = await endpoints.getUserInfo();

        setUserInfo({ ...userInfoFound });
        setAuthenticated(true);
      } catch (error: any) {
        handleError({
          error,
          fallback: 'Não foi possível carregar informação do usuário',
        });
      } finally {
        setAuthLoading(false);
      }
    }

    const userCredentialsLocal = localStorage.getItem(USER_CREDENTIALS_KEY);
    const userCredentialsSession = sessionStorage.getItem(USER_CREDENTIALS_KEY);

    if (userCredentialsLocal || userCredentialsSession) {
      const usetToken = JSON.parse(
        userCredentialsLocal || userCredentialsSession || ''
      ).token;

      api.defaults.headers.common.Authorization = usetToken;
      setToken(usetToken);
      loadUserInfo();
    } else {
      setAuthLoading(false);
    }

    return () => setAuthLoading(false);
  }, []);

  async function handleLogin({
    email,
    password,
    remember,
  }: LoginProps): Promise<void> {
    setAuthLoading(true);

    try {
      const userToken = await endpoints.login(email, password);

      const storage = remember ? localStorage : sessionStorage;

      storage.setItem(
        USER_CREDENTIALS_KEY,
        JSON.stringify({ token: userToken })
      );

      api.defaults.headers.common.Authorization = userToken;

      const userInfoFound = await endpoints.getUserInfo();

      setToken(userToken);
      setUserInfo(userInfoFound);
      setAuthenticated(true);
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout(): void {
    setAuthenticated(false);
    setToken('');
    setUserInfo({} as UserType);
    localStorage.removeItem(USER_CREDENTIALS_KEY);
    sessionStorage.removeItem(USER_CREDENTIALS_KEY);
    api.defaults.headers.common.Authorization = '';
  }

  return {
    userInfo,
    authenticated,
    authLoading,
    token,
    setUserInfo,
    setAuthenticated,
    handleLogin,
    handleLogout,
  };
}
