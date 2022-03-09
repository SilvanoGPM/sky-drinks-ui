import { AxiosResponse } from 'axios';
import { toFullDrinkImageURI } from 'src/utils/toFullPictureURI';

import { api, baseURL } from './api';

const filesEndpoints = {
  getUserImage(uuid: string): string {
    return `${baseURL}/files/users/${uuid}.png`;
  },
  async uploadDrinkImage(picture: File): Promise<AxiosResponse<any, any>> {
    const formData = new FormData();
    formData.append('file', picture);

    return api.post('/files/barmen/drinks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async uploadMultipleDrinksImages(
    pictures: File[]
  ): Promise<AxiosResponse<any, any>> {
    const formData = new FormData();

    pictures.forEach((picture) => formData.append('files', picture));

    return api.post('/files/barmen/multiple-drinks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async uploadUserImage(picture: File): Promise<AxiosResponse<any, any>> {
    const formData = new FormData();
    formData.append('file', picture);

    return api.post('/files/all/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async getAllImages(page = 0, size = 10): Promise<PaginationReturn> {
    const { data } = await api.get(`/files?page=${page}&size=${size}`);

    const mappedContent = data.content
      .filter((file: string) => file.startsWith('/images'))
      .map(async (picture: string) => {
        const image = picture.replace('/images/', '');

        const response = await api.get(`/drinks/find-by-picture/${image}`);

        return {
          image,
          drinks: response.data.map(toFullDrinkImageURI),
        };
      });

    const content = await Promise.all(mappedContent);

    return {
      totalElements: data.totalElements,
      content,
    };
  },

  async getAllImagesWithoutPagination(): Promise<string[]> {
    const { data } = await api.get<string[]>(`/files/list?page`);
    return data;
  },

  async deleteDrinkImage(image: string): Promise<void> {
    await api.delete<void>(`/files/barmen/drinks/${image}`);
  },

  async deleteUserImage(image: string): Promise<void> {
    await api.delete<void>(`/files/all/users/${image}`);
  },
};

export default filesEndpoints;
