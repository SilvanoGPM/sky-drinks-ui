import { api } from "./api";

import { USER_CREDENTIALS_KEY } from "src/contexts/hooks/useAuth";
import { showNotification } from "src/utils/showNotification";

export function tokenExpirationInterceptor() {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const tokenExpired = error?.response?.data?.expired || false;
      const status = error?.response.data?.status || 0;

      if (tokenExpired && status === 401 && error.config) {
        localStorage.removeItem(USER_CREDENTIALS_KEY);
        sessionStorage.removeItem(USER_CREDENTIALS_KEY);

        error.config.headers.Authorization = undefined;
        api.defaults.headers.common["Authorization"] = "";

        showNotification({ type: "info", message: "Por favor, faça login novamente!" });

        throw new Error("Por favor, faça login novamente!");
      } else {
        throw error;
      }
    }
  );
}
