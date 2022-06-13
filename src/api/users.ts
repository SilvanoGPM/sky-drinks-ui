import qs from 'query-string';

import { LoginError } from 'src/errors/LoginError';

import filesEndpoints from './files';
import { api } from './api';

interface UserWantsUpdate {
  uuid: string;
  email: string;
  password: string;
}

const usersEndpoints = {
  async login(email: string, password: string): Promise<string> {
    try {
      const { headers } = await api.post('/login', {
        email,
        password,
      });

      return headers.authorization;
    } catch (exception: any) {
      const status = exception?.response?.data?.status || 0;

      if (status === 401) {
        const userExists = await this.verifyUserByEmail(email);

        const message = userExists
          ? 'Senha incorreta'
          : 'Nenhum usuário encontrado com esse E-mail';

        throw new LoginError(message);
      }

      throw new Error('Aconteceu um erro ao tentar conectar no servidor');
    }
  },

  async createUser(user: UserToCreate): Promise<UserType> {
    const { data } = await api.post<UserType>('/users/admin', user);
    return data;
  },

  async countTotalUsers(): Promise<TotalUsers> {
    const { data } = await api.get<TotalUsers>('/users/admin/total-users');
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

  async verifyUserByEmail(email: string): Promise<boolean> {
    try {
      await api.get<UserType>(`/users/verify-by-email/${email}`);
      return true;
    } catch {
      return false;
    }
  },

  async findUserByEmail(email: string): Promise<UserPaginatedType> {
    const { data } = await api.get<UserType>(
      `/users/admin/find-by-email/${email}`
    );

    return {
      content: [data],
      totalElements: 1,
    };
  },

  async findUserByCPF(cpf: string): Promise<UserPaginatedType> {
    const { data } = await api.get<UserType>(`/users/admin/find-by-cpf/${cpf}`);

    return {
      content: [data],
      totalElements: 1,
    };
  },

  async getUserInfo(): Promise<UserType> {
    const { data } = await api.get<UserType>('/users/all/user-info');
    return { ...data, picture: filesEndpoints.getUserImage(data.uuid) };
  },

  async replaceUser(
    user: UserToUpdate,
    userWantsCall: UserWantsUpdate
  ): Promise<void> {
    const userFound = await this.findUserByUUID(userWantsCall.uuid);

    await this.login(userFound.email, userWantsCall.password);

    const { newPassword: _, ...drinkToUpdate } = {
      ...user,
      password: user.newPassword,
    };

    await api.put('/users/user', drinkToUpdate);
  },

  async toggleUserLockRequests(uuid: string): Promise<UserType> {
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
