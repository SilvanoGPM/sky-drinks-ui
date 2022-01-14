import { api, toFullPictureURI } from "./api";

const filesEndpoints = {
  async uploadImage(picture: File) {
    const formData = new FormData();
    formData.append("file", picture);

    return api.post("/files/barmen/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async getAllImages(page = 0, size = 10) {
    const { data } = await api.get(`/files?page=${page}&size=${size}`);

    const mappedContent = data.content
      .filter((file: string) => file.startsWith("/images"))
      .map(async (picture: string) => {
        const image = picture.replace("/images/", "");

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

  async getAllImagesWithoutPagination() {
    const { data } = await api.get(`/files/list?page`);
    return data;
  },

  async deleteImage(image: string) {
    await api.delete(`/files/barmen/images/${image}`);
  },
};

export default filesEndpoints;
