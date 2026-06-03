import axios from 'axios';

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const carClassificationApi = {
  /**
   * Upload image dan classify car type
   * @param {File} file - Image file
   * @returns {Promise<{class: string, confidence: number, allClasses: object}>}
   */
  classifyImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/classify`,
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

  /**
   * Get supported car classes
   * @returns {Promise<Array>}
   */
  getSupportedClasses: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/classes`);
      return response.data.classes;
    } catch (error) {
      console.error('Error fetching classes:', error);
      return ['SUV', 'Sedan', 'Hatchback', 'MPV', 'Pickup'];
    }
  },

  /**
   * Get model info
   * @returns {Promise<{model: string, accuracy: number, version: string}>}
   */
  getModelInfo: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/model-info`);
      return response.data;
    } catch (error) {
      console.error('Error fetching model info:', error);
      return null;
    }
  },
};
