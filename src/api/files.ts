import { supabase } from 'src/services/supabase';

type ImageReturnedType = {
  name: string;
  url: string;
  id: string;
};

const drinksBucket = process.env.REACT_APP_SUPABASE_DRINKS_BUCKET_NAME!;
const usersBucket = process.env.REACT_APP_SUPABASE_USERS_BUCKET_NAME!;

const filesEndpoints = {
  getUserImage(uuid: string): string {
    return (
      supabase.storage.from(usersBucket).getPublicUrl(uuid).data?.publicURL ||
      ''
    );
  },

  async uploadDrinkImage(picture: File): Promise<string> {
    const buffer = await picture.arrayBuffer();

    const { error } = await supabase.storage
      .from(drinksBucket)
      .upload(picture.name, buffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      throw Error(error.message);
    }

    return (
      supabase.storage.from(drinksBucket).getPublicUrl(picture.name).data
        ?.publicURL || ''
    );
  },

  async uploadMultipleDrinksImages(pictures: File[]): Promise<string[]> {
    const images = await Promise.all(
      pictures.map((picture) => this.uploadDrinkImage(picture))
    );

    return images;
  },

  async uploadUserImage(picture: File, uuid: string): Promise<string> {
    const buffer = await picture.arrayBuffer();

    const { error } = await supabase.storage
      .from(usersBucket)
      .upload(uuid, buffer, {
        contentType: picture.type,
        upsert: true,
      });

    if (error) {
      throw Error(error.message);
    }

    return (
      supabase.storage.from(drinksBucket).getPublicUrl(picture.name).data
        ?.publicURL || ''
    );
  },

  async getAllDrinkImages(): Promise<ImageReturnedType[]> {
    const { data } = await supabase.storage.from(drinksBucket).list();

    const content = (data || []).map<ImageReturnedType>((image) => ({
      name: image.name,
      id: image.id,
      url:
        supabase.storage.from(drinksBucket).getPublicUrl(image.name).data
          ?.publicURL || '',
    }));

    return content;
  },

  async deleteDrinkImage(image: string): Promise<void> {
    await supabase.storage.from(drinksBucket).remove([image]);
  },

  async deleteUserImage(image: string): Promise<void> {
    await supabase.storage.from(usersBucket).remove([image]);
  },
};

export default filesEndpoints;
