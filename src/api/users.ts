import { api } from "./api";

const usersEndpoints = {
  async getUserInfo() {
    try {
      const response = await api.get("/users/all/user-info");
      return response.data;
    } catch (e) {
      throw Error("Não foi possível pegar as infomações do usuário");
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      return response.headers.authorization;
    } catch (exception: any) {
      const status = exception?.response?.data?.status || 0;

      if (status === 401) {
        throw new Error("Login ou senha incorretos!");
      }

      throw new Error("Aconteceu um erro ao tentar conectar no servidor.");
    }
  },
};

export default usersEndpoints;
