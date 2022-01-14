import qs from "query-string";

import { LoginError } from "src/errors/LoginError";
import {
  UserPaginatedType,
  UserSearchParams,
  UserToCreate,
  UserToUpdate,
  UserType,
} from "src/types/user";

import { api } from "./api";

const usersEndpoints = {
  async login(email: string, password: string): Promise<string> {
    try {
      const { headers } = await api.post("/login", {
        email,
        password,
      });

      return headers.authorization;
    } catch (exception: any) {
      const status = exception?.response?.data?.status || 0;

      if (status === 401) {
        throw new LoginError("Login ou senha incorretos!");
      }

      throw new Error("Aconteceu um erro ao tentar conectar no servidor");
    }
  },

  async createUser(user: UserToCreate): Promise<UserType> {
    const { data } = await api.post<UserType>("/users/admin", user);
    return data;
  },

  async searchUser(params: UserSearchParams): Promise<UserPaginatedType> {
    const searchParams = qs.stringify(params);

    const { data } = await api.get<UserPaginatedType>(
      `/users/admin/search?${searchParams}`
    );

    return {
      totalElements: data.totalElements,
      content: data.content,
    };
  },

  async findUserByUUID(uuid: string): Promise<UserType> {
    const { data } = await api.get<UserType>(`/users/all/${uuid}`);
    return data;
  },

  async findUserByEmail(email: string): Promise<UserType> {
    const { data } = await api.get<UserType>(
      `/users/admin/find-by-email/${email}`
    );
    return data;
  },

  async findUserByCPF(cpf: string): Promise<UserType> {
    const { data } = await api.get<UserType>(`/users/admin/find-by-cpf/${cpf}`);
    return data;
  },

  async getUserInfo(): Promise<UserType> {
    const { data } = await api.get<UserType>("/users/all/user-info");
    return data;
  },

  async replaceUser(drink: UserToUpdate): Promise<void> {
    const userFound = await this.findUserByUUID(drink.uuid);
    await this.login(userFound.email, drink.password);

    const { newPassword, ...drinkToUpdate } = {
      ...drink,
      password: drink.newPassword || drink.password,
    };

    await api.put("/users/user", drinkToUpdate);
  },

  async toggleUserLockReqeusts(uuid: string): Promise<UserType> {
    const { data } = await api.patch<UserType>(
      `/users/admin/toggle-lock-requests/${uuid}`
    );
    return data;
  },

  async deleteUser(uuid: string): Promise<void> {
    await api.delete(`/users/user/${uuid}`);
  },
};

export default usersEndpoints;
