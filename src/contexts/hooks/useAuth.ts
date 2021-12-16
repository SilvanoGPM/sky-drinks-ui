import { HeadersDefaults } from "axios";
import { useState, useEffect } from "react";

import endpoints, { api } from "src/api/api";

type FakeHeaders = {
  Authorization: string | undefined;
} & HeadersDefaults;

const LOCAL_STORAGE_KEY = 'userInfo';

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (userInfo) {
      const headers = api.defaults.headers as FakeHeaders;
      headers.Authorization = JSON.parse(userInfo).token;
      setAuthenticated(true);
    }

    setAuthLoading(false);
  }, []);

  async function handleLogin(email: string, password: string) {
    const token = await endpoints.login(email, password);

    // EU SEI EU SEI
    // mas é temporário, colocar a senha ali parece uma pessíma ideia
    // porém a única que tenho no momento.
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      email,
      password,
      token,
    }));

    const headers = api.defaults.headers as FakeHeaders;
    headers.Authorization = token;
    setAuthenticated(true);
  }

  function handleLogout() {
    setAuthenticated(false);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    const headers = api.defaults.headers as FakeHeaders;
    headers.Authorization = undefined;
  }
  
  return { authenticated, authLoading, handleLogin, handleLogout };

}
