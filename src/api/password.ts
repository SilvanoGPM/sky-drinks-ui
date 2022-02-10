import { api } from './api';

const passwordEndpoints = {
  async sendPasswordResetToken(email: string): Promise<void> {
    await api.post<void>('/password-reset/request', { email });
  },
};

export default passwordEndpoints;
