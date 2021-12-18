import { useState, useEffect } from "react";

import endpoints, { api } from "src/api/api";

type UserInfoProps = {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  role: string;
  birthDay: string;
  cpf: string;
};

type LoginProps = { email: string; password: string; remember: boolean };

export const USER_CREDENTIALS_KEY = "userCredentials";
export const USER_INFO_KEY = "userInfo";

export function useAuth() {
  const [userInfo, setUserInfo] = useState<UserInfoProps>({} as UserInfoProps);
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const userCredentials = localStorage.getItem(USER_CREDENTIALS_KEY);
    const userInfo = localStorage.getItem(USER_INFO_KEY);

    if (userCredentials && userInfo) {
      api.defaults.headers.common["Authorization"] = JSON.parse(userCredentials).token;
      setUserInfo(JSON.parse(userInfo));
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

      const userCredentials = { token, ...(remember ? { email, password } : {}) };

      localStorage.setItem(USER_CREDENTIALS_KEY, JSON.stringify(userCredentials));

      api.defaults.headers.common["Authorization"] = token;

      const userInfo = await endpoints.getUserInfo();

      localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));

      setUserInfo(userInfo);
      setAuthenticated(true);
    } catch (e) {
      throw e;
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
    setAuthenticated(false);
    localStorage.removeItem(USER_CREDENTIALS_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    api.defaults.headers.common["Authorization"] = "";
  }

  return {
    userInfo,
    authenticated,
    authLoading,
    setAuthenticated,
    handleLogin,
    handleLogout,
  };
}
