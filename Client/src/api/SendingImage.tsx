import axios from 'axios';

const baseURL = `http://localhost:3000`;

const api = axios.create({ baseURL });

async function UploadFile(formData: FormData) {
  try {
    // Make the POST request
    const response = await api.post<{
      response: Array<{
        gal_title: string;
        image_url: string;
        location: string;
        similarity: number;
      }>;
      image_url: string;
    }>('/api/combined_densenet', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Access the first item in the response array
    const imageInfo = response.data.response[0]; // Get the first object from the response array
    const externalImageUrl = response.data.image_url;

    // Log the extracted information
    console.log('Gallery Title:', imageInfo.gal_title);
    console.log('Image URL:', imageInfo.image_url);
    console.log('Location:', imageInfo.location);
    console.log('Similarity:', imageInfo.similarity);
    console.log('External Image URL:', externalImageUrl);

    // Return the image URL or other relevant data as needed
    return imageInfo; // Return the image URL or whatever is needed
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export default UploadFile;
