import axios from 'axios';

const verifyGoogleToken = async (token) => {
    try {
        const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
        return response.data;
    } catch (error) {
        throw new Error('Google token verification failed');
    }
};

export { verifyGoogleToken };
