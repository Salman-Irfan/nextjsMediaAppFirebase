import axios from "axios";

/**
 * Generic POST request function
 * @param {string} url - API endpoint (e.g. "/api/v1/auth/signup")
 * @param {Object} formData - Payload to send in the request body
 */
export const postData = async (url, formData) => {
  try {
    const response = await axios.post(url, formData);
    return response.data;
  } catch (error) {
    console.error(`POST ${url} failed:`, error);
    throw error;
  }
};
