import { AxiosResponse } from 'axios';
import { toFullPictureURI } from 'src/utils/toFullPictureURI';

import { api } from './api';

const filesEndpoints = {
  async uploadImage(picture: File): Promise<AxiosResponse<any, any>> {
    const formData = new FormData();
    formData.append('file', picture);

    return api.post('/files/barmen/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async uploadMultipleImages(
    pictures: File[]
  ): Promise<AxiosResponse<any, any>> {
    const formData = new FormData();

    pictures.forEach((picture) => formData.append('files', picture));

    return api.post('/files/barmen/multiple-images', formData, {
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
          drinks: response.data.map(toFullPictureURI),
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

  async deleteImage(image: string): Promise<void> {
    await api.delete<void>(`/files/barmen/images/${image}`);
  },
};

export default filesEndpoints;
