import axios from 'axios';

export const getImageUrl = async (id = '5') => {
    try {
        const apiKey = '41385074-9d63f60ee7ef5c84956a8147b';
        const apiUrl = `https://pixabay.com/api/?key=${apiKey}&id=${id}`;

        const response = await axios.get(apiUrl);
        const imageUrl = response.data.hits[0].webformatURL;

        return imageUrl;
    } catch (error) {
        console.error('There was a problem with the Axios request:', error);
        throw error; // Re-throw the error to handle it where this function is called
    }
};