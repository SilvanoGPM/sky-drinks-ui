import { api, toFullPictureURI } from "./api";

const filesEndpoints = {
  async uploadImage(picture: File) {
    try {
      const formData = new FormData();
      formData.append("file", picture);

      return api.post("/files/barmen/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (e: any) {
      throw new Error("Aconteceu um erro ao tentar upar o arquivo!");
    }
  },

  async getAllImages(page = 0, size = 10) {
    try {
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
    } catch (e: any) {
      throw new Error("Aconteceu ao pesquisar imagens!");
    }
  },

  async deleteImage(image: string) {
    try {
      await api.delete(`/files/barmen/images/${image}`)
    } catch (e: any) {
      throw new Error("Aconteceu um erro ao tentar deletar imagem!");
    }
  }
};

export default filesEndpoints;
