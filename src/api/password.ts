import { api } from './api';

interface ConfirmVerifyToken {
  email: string;
  token: string;
  password: string;
}

type PasswordVerifyToken = Omit<ConfirmVerifyToken, 'password'>;

const passwordEndpoints = {
  async sendPasswordResetToken(email: string): Promise<void> {
    await api.post<void>('/password-reset/request', { email });
  },

  async verifyPasswordResetToken(values: PasswordVerifyToken): Promise<void> {
    await api.post<void>('/password-reset/verify', values);
  },

  async confirmPasswordResetToken(values: ConfirmVerifyToken): Promise<void> {
    await api.post<void>('/password-reset/confirm', values);
  },
};

export default passwordEndpoints;
