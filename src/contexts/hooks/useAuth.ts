import { useState, useEffect } from "react";

import endpoints, { api } from "src/api/api";
import { showNotification } from "src/utils/showNotification";

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

export function useAuth() {
  const [userInfo, setUserInfo] = useState<UserInfoProps>({} as UserInfoProps);
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function loadUserInfo() {
      try {
        const userInfo = await endpoints.getUserInfo();

        setUserInfo(userInfo);
        setAuthenticated(true);
      } catch (e: any) {
        showNotification({
          type: "warn",
          message: e.message,
        });
      } finally {
        setAuthLoading(false);
      }
    }

    const userCredentialsLocal = localStorage.getItem(USER_CREDENTIALS_KEY);
    const userCredentialsSession = sessionStorage.getItem(USER_CREDENTIALS_KEY);

      if (userCredentialsLocal || userCredentialsSession) {
        api.defaults.headers.common["Authorization"] =
          JSON.parse(userCredentialsLocal || userCredentialsSession || "").token;
        loadUserInfo();
      } else {
        setAuthLoading(false);
      }

    return () => setAuthLoading(false);
  }, []);

  async function handleLogin({ email, password, remember }: LoginProps) {
    setAuthLoading(true);

    try {
      const token = await endpoints.login(email, password);

      const storage = remember ? localStorage : sessionStorage;

      storage.setItem(USER_CREDENTIALS_KEY, JSON.stringify({ token }));

      api.defaults.headers.common["Authorization"] = token;

      const userInfo = await endpoints.getUserInfo();

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
    sessionStorage.removeItem(USER_CREDENTIALS_KEY);
    api.defaults.headers.common["Authorization"] = "";
  }

  return {
    userInfo,
    authenticated,
    authLoading,
    setUserInfo,
    setAuthenticated,
    handleLogin,
    handleLogout,
  };
}
