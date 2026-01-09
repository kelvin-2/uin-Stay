import api from './axiosClient';

// Utility function to map backend response to frontend format
const mapAccommodationResponse = (property) => {
  if (!property) return null;
  console.log(property);
  
  return {
    id: property.id,
    title: property.title,
    address: property.address,
    accDetails: property.description,
    maxOccupants: property.max_occupants,
    deposit: property.deposit,
    userId: property.user_id,
    monthlyRent: property.rent,
    roomType: property.room_type,
    location: property.location,
    paymentMethods: property.payment_methods,
    isVerified: property.is_verified,
    amenities: property.amenities,
    images: property.image_urls,
    createdAt: property.created_at,
    updatedAt: property.updated_at
  };
};

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
    
    // Map the response before returning
    return {
      message: response.data.message,
      property: mapAccommodationResponse(response.data.property),
      imageErrors: response.data.imageErrors || []
    };
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

    const response = await api.get('/accommodations/my-properties', config); 
    console.log("the response:", response);

    // Map all properties in the response
    const mappedData = {
      ...response.data,
      properties: Array.isArray(response.data.properties) 
        ? response.data.properties.map(mapAccommodationResponse)
        : Array.isArray(response.data)
        ? response.data.map(mapAccommodationResponse)
        : []
    };

    return mappedData;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw new Error(
      error.response?.data?.details || 
      error.response?.data?.error || 
      'Failed to fetch properties'
    );
  }
};
//will featch accomodation by its id 
export const getAccommodationById = async (propertyId) => {
  try {
    const response = await api.get(`/accommodations/${propertyId}`, config);
    console.log("Property details response:", response);

    // Map the response
    return {
      property: mapAccommodationResponse(response.data.property || response.data)
    };
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw new Error(
      error.response?.data?.details || 
      error.response?.data?.error || 
      'Failed to fetch property details'
    );
  }
};

export const updateAccommodation = async (propertyId, updateData) => {
  try {
    const response = await api.put(`/accommodations/${propertyId}`, updateData);
    
    // Map the response before returning
    return {
      ...response.data,
      property: mapAccommodationResponse(response.data.property)
    };
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