// src/services/uploadService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Not using the shared apiRequest() helper here on purpose — it hardcodes
// Content-Type: application/json, which breaks file uploads. FormData
// needs the browser to set its own multipart boundary automatically.
export const uploadImage = async (file) => {
  const token = localStorage.getItem('authToken');
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/uploads`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Image upload failed');
  }
  return data.url;
};