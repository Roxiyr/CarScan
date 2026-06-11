import axios from 'axios';

// Use relative paths so Vite proxy forwards to backend
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || '';

// Direct backend URL for fallback (when not using proxy)
const BACKEND_URL = 'http://localhost:8001';

export const carClassificationApi = {
  /**
   * Upload image dan classify car type
   * @param {File} file - Image file
   * @returns {Promise<{class: string, confidence: number, allClasses: object}>}
   */
  classifyImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Try using proxy first (via Vite dev server)
      let url = `${API_BASE_URL || ''}/predict`;
      // Fallback to direct backend URL if proxy not available
      if (!API_BASE_URL) {
        url = `${BACKEND_URL}/predict`;
      }
      
      const response = await axios.post(
        url,
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
      const url = `${API_BASE_URL || BACKEND_URL}/classes`;
      const response = await axios.get(url);
      return response.data.kelas;
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
      const url = `${API_BASE_URL || BACKEND_URL}/health`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching model info:', error);
      return null;
    }
  },
};
