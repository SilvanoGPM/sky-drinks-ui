import { api } from './api';

interface PasswordVerifyToken {
  email: string;
  token: string;
}

const passwordEndpoints = {
  async sendPasswordResetToken(email: string): Promise<void> {
    await api.post<void>('/password-reset/request', { email });
  },

  async verifyPasswordResetToken(values: PasswordVerifyToken): Promise<void> {
    await api.post<void>('/password-reset/verify', values);
  },
};

export default passwordEndpoints;
