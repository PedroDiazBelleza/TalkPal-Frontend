import axios from 'axios';
const api = axios.create({
    baseURL: 'https://talkpal-backend-production.up.railway.app/api/'
});
export default api;