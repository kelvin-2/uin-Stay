import publicApi from './publicApi';
import api from './axiosClient';

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

export const landlordStats =async () =>{
    try{
        const response = await api.get("/stats/landlord-stats");
        console.log(response.data);
        return response.data;   
            
    }catch(error){
        console.error('Error fetching public stats:', error);
        throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to fetch public stats'
    );

    }
}