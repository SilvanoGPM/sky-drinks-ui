import axios from "axios";

import endpoints, { api } from "./api";

import {
  USER_CREDENTIALS_KEY,
  USER_INFO_KEY,
} from "src/contexts/hooks/useAuth";

export function refreshToken() {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const tokenExpired = error?.response?.data?.expired || false;
      const status = error?.response.data?.status || 0;

      if (tokenExpired && status === 401 && error.config) {
        const userCredentials = localStorage.getItem(USER_CREDENTIALS_KEY);

        if (userCredentials) {
          const { email, password } = JSON.parse(userCredentials);

          if (email && password) {
            const token = await endpoints.login(email, password);

            api.defaults.headers.common["Authorization"] = token;
            error.config.headers.Authorization = token;

            localStorage.setItem(
              USER_CREDENTIALS_KEY,
              JSON.stringify({
                email,
                password,
                token,
              })
            );

            const userInfo = await endpoints.getUserInfo();

            localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));

            return axios.request(error.config);
          } else {
            localStorage.removeItem(USER_CREDENTIALS_KEY);
            localStorage.removeItem(USER_INFO_KEY);

            error.config.headers.Authorization = undefined;
            api.defaults.headers.common["Authorization"] = "";

            throw new Error("Por favor, faça login novamente!");
          }
        }
      } else {
        throw error;
      }
    }
  );
}
