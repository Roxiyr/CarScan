import axios from 'axios';

// Vite hanya membaca env variable yang diawali VITE_
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export const carClassificationApi = {
  classifyImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/predict`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Classification error:', error);
      throw new Error(error.response?.data?.error || 'Gagal classify image. Coba lagi.');
    }
  },

  getSupportedClasses: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/classes`);
      return response.data.kelas;
    } catch (error) {
      console.error('Error fetching classes:', error);
      return ['SUV', 'Sedan', 'Hatchback', 'MPV', 'Pickup'];
    }
  },

  getModelInfo: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Error fetching model info:', error);
      return null;
    }
  },
};