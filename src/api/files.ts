import { AxiosResponse } from 'axios';
import { normalizeImage } from 'src/utils/imageUtils';

import { toFullDrinkImageURI } from 'src/utils/toFullPictureURI';

import { api, baseURL } from './api';

const filesEndpoints = {
  getUserImage(uuid: string): string {
    return `${baseURL}/files/users/${uuid}${
      uuid.endsWith('.png') ? '' : '.png'
    }`;
  },

  getDrinkImage(drink: string): string {
    return `${baseURL}/files/drinks/${normalizeImage(drink)}`;
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

    const mappedContent = data.content.map(async (picture: string) => {
      const image = picture
        .replace('/images/', '')
        .replace('/users/', '')
        .replace('/drinks/', '');

      if (picture.startsWith('/users')) {
        return {
          image: this.getUserImage(image),
          userUUID: image.replace('.png', ''),
        };
      }

      const response = await api.get(`/drinks/find-by-picture/${image}`);

      return {
        image: this.getDrinkImage(image),
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
