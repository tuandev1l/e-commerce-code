import axios from 'axios';

export const uploadFile = async (file: File | Blob) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default');
  formData.append('api_key', '595452348893115');

  try {
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/dfa7qyx7z/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return data['secure_url'];
  } catch (error) {}
};
