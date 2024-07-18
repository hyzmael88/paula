import axios from 'axios';

export async function getAllModelsFromSanity() {
    try {
        const response = await axios.get('https://api.sanity.io/v1/data/query/production', {
            params: {
                query: '*[_type == "modelo"]',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching data from Sanity:', error);
        throw error;
    }
}