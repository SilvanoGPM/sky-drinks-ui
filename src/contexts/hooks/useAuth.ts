import { useState, useEffect } from "react";

import endpoints, { api } from "src/api/api";

type LoginProps = { email: string; password: string; remember: boolean };

export const USER_INFO_KEY = "userInfo";

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem(USER_INFO_KEY);

    if (userInfo) {
      api.defaults.headers.common["Authorization"] = JSON.parse(userInfo).token;
      setAuthenticated(true);
    }

    setAuthLoading(false);
  }, []);

  async function handleLogin({ email, password, remember }: LoginProps) {
    setAuthLoading(true);

    try {
      const token = await endpoints.login(email, password);

      // EU SEI EU SEI
      // mas é temporário, colocar a senha ali parece uma pessíma ideia
      // porém a única que tenho no momento.

      const userInfo = { token, ...(remember ? { email, password } : {}) };

      localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));

      setAuthenticated(true);
      api.defaults.headers.common["Authorization"] = token;
    } catch (e) {
      throw e;
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
    setAuthenticated(false);
    localStorage.removeItem(USER_INFO_KEY);
    api.defaults.headers.common["Authorization"] = "";
  }

  return {
    authenticated,
    authLoading,
    setAuthenticated,
    handleLogin,
    handleLogout,
  };
}
