import publicApi from './publicApi';

export const publicStats = async () => {
  try {
    const response = await publicApi.get("/stats/public-stats");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching public stats:', error);
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      'Failed to fetch public stats'
    );
  }
};