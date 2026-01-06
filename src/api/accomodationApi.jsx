import api from './axiosClient';

export const createAccommodation = async (
  propertyData,
  imageFiles = [],
  onProgress = null
) => {
  const formData = new FormData();

  // Append property data as JSON string
  formData.append("propertyData", JSON.stringify(propertyData));

  // Append image files
  imageFiles.forEach(file => {
    formData.append("images", file);
  });

  // Debug logging
  console.log('=== FormData Debug ===');
  console.log('Property Data:', propertyData);
  console.log('Image Files:', imageFiles);
  console.log('Image Files Length:', imageFiles.length);
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };

  if (onProgress) {
    config.onUploadProgress = e => {
      const percent = Math.round((e.loaded * 100) / e.total);
      onProgress(percent);
    };
  }

  try {
    const response = await api.post(
      "/accommodations",
      formData,
      config
    );
    return response.data;
  } catch (error) {
    console.error('=== Upload Error ===');
    console.error('Error:', error);
    console.error('Response:', error.response?.data);
    console.error('Status:', error.response?.status);
    throw error;
  }
};

export const getMyProperties = async () => {
  console.log("here we go");
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    const response = await api.get('/accommodations/my-properties',config); 
    console.log("the response:",response);

    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw new Error(
      error.response?.data?.details || 
      error.response?.data?.error || 
      'Failed to fetch properties'
    );
  }
};

export const updateAccommodation = async (propertyId, updateData) => {
  try {
    const response = await api.put(`/accommodations/${propertyId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating accommodation:', error);
    throw new Error(
      error.response?.data?.details || 
      error.response?.data?.error || 
      'Failed to update accommodation'
    );
  }
};

export const deleteAccommodation = async (propertyId) => {
  try {
    const response = await api.delete(`/accommodations/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting accommodation:', error);
    throw new Error(
      error.response?.data?.details || 
      error.response?.data?.error || 
      'Failed to delete accommodation'
    );
  }
};