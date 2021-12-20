import { api } from "./api";

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
};

export default filesEndpoints;
