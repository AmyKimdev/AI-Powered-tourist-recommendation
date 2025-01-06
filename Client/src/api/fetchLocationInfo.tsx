import axios from 'axios';

const baseURL = `http://localhost:3000`;

const api = axios.create({ baseURL });

async function fetchLocationInfo(location: string) {
  try {
    const response = await api.get(`/api/sigungu/${location}`);
    return response.data.description; // Assuming the API returns a description field
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export default fetchLocationInfo;
