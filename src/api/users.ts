import { api } from "./api";

type UserToCreate = {
  name: string;
  email: string;
  password: string;
  role: string;
  birthDay: string;
  cpf: string;
};

const usersEndpoints = {
  async deleteUser(uuid: string) {
    try {
      await api.delete(`/users/user/${uuid}`);
    } catch (e: any) {
      throw e;
    }
  },

  async createUser(user: UserToCreate) {
    try {
      const { data } = await api.post("/users/admin", user);
      return data;
    } catch (e: any) {
      console.log(e?.response);

      throw e;
    }
  },

  async searchUser(params: string, size = 6) {
    try {
      const { data } = await api.get(`/users/search?size=${size}&${params}`);

      return {
        totalElements: data.totalElements,
        content: data.content,
      };
    } catch (exception: any) {
      throw new Error("Aconteceu um erro ao tentar conectar no servidor.");
    }
  },

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
